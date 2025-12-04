(function(){
  const output = document.getElementById('terminal-output');
  const typed = document.getElementById('typed');
  const prompt = document.getElementById('prompt');

  // About-me content (text = typed preview, html = final rendered line which may include links/SVG)
  const items = [
    { text: 'ღᴄᴏsᴍɪᴄʙᴜɴɴʏღ', html: '<div class="terminal-line"><strong>ღᴄᴏsᴍɪᴄʙᴜɴɴʏღ</strong></div>' },
    { text: 'i like to make 3D Models on blender.', html: '<div class="terminal-line">i like to make 3D Models on blender.</div>' },
    { text: 'Interests: 3D Design, Gaming, VRChat', html: '<div class="terminal-line"><strong>Interests:</strong> 3D Design · Gaming · VRChat</div>' },
    { text: "Relationship status: Taken by ~Ｔｗｉｇｂｅｅｅ~", html: '<div class="terminal-line"><strong>Relationship status:</strong> Taken by ~Ｔｗｉｇｂｅｅｅ~</div>' },
    { text: 'Links:', html: '<div class="terminal-line"><strong>Links:</strong></div>' },
    { text: 'VRChat', html: `<div class="terminal-line"><a href="https://vrchat.com/home/user/usr_f78c9f85-ac85-48c2-9bee-a8cf0594bd9c" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.4"/><path d="M6 12c1.3-3 4.7-5 6-5s4.7 2 6 5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>VRChat</a></div>` },
    { text: 'Twitter', html: `<div class="terminal-line"><a href="https://x.com/ToutubeVR" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23 4.5c-.8.4-1.6.6-2.5.8.9-.6 1.6-1.6 1.9-2.7-.8.5-1.7.9-2.6 1.1C18.6 3 17.3 2.5 16 2.5c-2 0-3.5 1.6-3.5 3.6 0 .3 0 .6.1.8C9.2 6.7 6.2 5 4 2.6c-.3.6-.5 1.4-.5 2.1 0 1.2.6 2.2 1.5 2.8-.7 0-1.3-.2-1.9-.5v.1c0 2 1.4 3.7 3.3 4.1-.3.1-.7.1-1 .1-.2 0-.4 0-.6-.1.4 1.4 1.7 2.4 3.2 2.4C8 17 6 17.6 3.8 17.6c-.3 0-.6 0-.9-.1C3.8 19 5.7 20 8 20c5.3 0 8.2-4.5 8.2-8.4v-.4c.6-.4 1.2-1 1.6-1.6-.6.3-1.2.6-1.9.7.7-.5 1.2-1.3 1.4-2.2z" fill="currentColor"/></svg>X</a></div>` },
    { text: 'Ko-fi', html: `<div class="terminal-line"><a href="https://ko-fi.com/cosmicbunzy" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21s8-4.4 8-10.5S15.9 3 12 7.5 4 3 4 10.5 12 21 12 21z" stroke="currentColor" stroke-width="1.2" fill="currentColor"/></svg>Ko-fi</a></div>` }
  ];

  let index = 0;
  let charIndex = 0;

  function appendHtml(html){
    output.innerHTML += html;
    output.scrollTop = output.scrollHeight;
  }

  function typeItem(){
    if(index >= items.length){
      typed.textContent = '';
      return;
    }
    const item = items[index];
    const preview = item.text;
    if(charIndex <= preview.length){
      typed.textContent = preview.slice(0, charIndex);
      charIndex++;
      setTimeout(typeItem, 25 + Math.random()*45);
    } else {
      // finished typing preview, commit HTML
      appendHtml(item.html);
      index++;
      charIndex = 0;
      setTimeout(typeItem, 220 + Math.random()*300);
    }
  }

  // Start typing about-me after small delay
  setTimeout(typeItem, 300);

  // Allow user to type and press enter to echo into output (keeps demo interactive)
  document.addEventListener('keydown', (e)=>{
    if(e.key.length === 1){
      typed.textContent += e.key;
    } else if(e.key === 'Backspace'){
      typed.textContent = typed.textContent.slice(0,-1);
    } else if(e.key === 'Enter'){
      appendHtml('<div class="terminal-line">' + prompt.textContent + ' ' + escapeHtml(typed.textContent) + '</div>');
      typed.textContent = '';
    }
  });

  function escapeHtml(s){
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

})();
