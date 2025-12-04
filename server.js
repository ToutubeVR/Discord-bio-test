const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const COMMENTS_FILE = path.join(__dirname, 'comments.json');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static site files from current directory
app.use(express.static(path.join(__dirname)));

function readComments(){
  try{
    const raw = fs.readFileSync(COMMENTS_FILE, 'utf8');
    return JSON.parse(raw);
  }catch(e){
    return [];
  }
}

function writeComments(arr){
  fs.writeFileSync(COMMENTS_FILE, JSON.stringify(arr, null, 2), 'utf8');
}

app.get('/comments', (req, res)=>{
  const comments = readComments();
  res.json(comments);
});

app.post('/comments', (req, res)=>{
  const name = String(req.body.name || 'Anonymous').slice(0,200);
  const text = String(req.body.text || '').slice(0,2000);
  if(!text) return res.status(400).json({ error:'empty' });
  const comment = { name, text, ts: Date.now() };
  const comments = readComments();
  comments.push(comment);
  try{
    writeComments(comments);
    res.json({ ok:true });
  }catch(e){
    res.status(500).json({ error: 'write-failed' });
  }
});

// Admin: delete comment by timestamp (requires admin key)
app.post('/comments/delete', (req, res)=>{
  const adminKey = String(req.body.adminKey || req.headers['x-admin-key'] || '');
  const expected = process.env.ADMIN_KEY || 'ღᴄᴏsᴍɪᴄʙᴜɴɴʏღ';
  if(adminKey !== expected) return res.status(401).json({ error: 'unauthorized' });
  const ts = Number(req.body.ts || 0);
  if(!ts) return res.status(400).json({ error: 'missing-ts' });
  let comments = readComments();
  const before = comments.length;
  comments = comments.filter(c => Number(c.ts) !== ts);
  if(comments.length === before) return res.status(404).json({ error: 'not-found' });
  try{
    writeComments(comments);
    res.json({ ok:true });
  }catch(e){
    res.status(500).json({ error:'write-failed' });
  }
});

app.listen(PORT, ()=>{
  console.log(`Comments server running on http://localhost:${PORT}`);
});
