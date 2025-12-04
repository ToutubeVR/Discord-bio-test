(function(){
  const form = document.getElementById('comment-form');
  const nameInput = document.getElementById('comment-name');
  const textInput = document.getElementById('comment-text');
  const list = document.getElementById('comments-list');
  const status = document.getElementById('comment-status');
  const adminBtn = document.getElementById('admin-enter');
  let adminKey = null;

  // backend base path (when running server locally, use same origin)
  const API_BASE = '';

  console.log('Comments client initializing...');
  console.log('Form found:', !!form, form);

  // Load comments on page load
  loadComments();

  async function loadComments(){
    try{
      const res = await fetch(API_BASE + '/comments');
      if(!res.ok) { list.innerHTML = '<div style="color:rgba(255,255,255,0.6)">Could not load comments (server unavailable).</div>'; return }
      const data = await res.json();
      console.log('Comments loaded:', data);
      renderComments(data);
    }catch(e){
      console.error('Load error:', e);
      list.innerHTML = '<div style="color:rgba(255,255,255,0.6)">Could not load comments (offline).</div>';
    }
  }

  function renderComments(arr){
    if(!arr || !arr.length){ list.innerHTML = '<div style="color:rgba(255,255,255,0.6)">No comments yet — be the first!</div>'; return }
    list.innerHTML = arr.slice().reverse().map(c=>{
      const deleteBtn = adminKey ? `<button class="delete-btn" data-ts="${c.ts}">Delete</button>` : '';
      return `<div class="comment"><div class="meta">${escapeHtml(c.name)} • ${new Date(c.ts).toLocaleString()}</div><div class="body">${escapeHtml(c.text)}</div><div style="margin-top:6px">${deleteBtn}</div></div>`
    }).join('');
    // attach delete handlers
    if(adminKey){
      list.querySelectorAll('.delete-btn').forEach(btn=>{
        btn.addEventListener('click', async ()=>{
          const ts = btn.getAttribute('data-ts');
          try{
            const r = await fetch(API_BASE + '/comments/delete', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ adminKey, ts }) });
            if(!r.ok) throw new Error('delete-failed');
            await loadComments();
          }catch(err){ alert('Delete failed: ' + (err.message || '')) }
        })
      })
    }
  }

  form && form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    console.log('Form submit!');
    const name = nameInput.value.trim() || 'Anonymous';
    const text = textInput.value.trim();
    if(!text){ console.log('Empty text'); return; }
    status.textContent = 'posting...';
    console.log('Posting:', { name, text });
    try{
      const res = await fetch(API_BASE + '/comments', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ name, text })
      });
      console.log('Response:', res.status, res.ok);
      if(!res.ok) throw new Error('post-failed: ' + res.status);
      const reply = await res.json();
      console.log('Server replied:', reply);
      nameInput.value = '';
      textInput.value = '';
      status.textContent = 'posted!';
      setTimeout(()=>status.textContent = '', 2000);
      await loadComments();
    }catch(err){
      console.error('Error:', err.message);
      status.textContent = 'Error: ' + err.message;
      setTimeout(()=>status.textContent = '', 3000);
    }
  });

  // Admin button: prompt for key (not saved to storage), toggle admin state
  if(adminBtn){
    adminBtn.addEventListener('click', async ()=>{
      const key = prompt('Enter admin key to enable moderation (local admin key).');
      if(!key) return;
      // test a quick delete-verification call is not available, so we'll just store key and attempt delete when used
      adminKey = key;
      await loadComments();
      alert('Admin mode enabled for this session. Delete buttons are visible.');
    })
  }

  function escapeHtml(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  // If the panel is left open when the page loads, attempt to load comments
})();
