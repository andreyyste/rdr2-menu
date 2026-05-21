/* ====== HELP: editable links + localStorage ====== */
(() => {
  if (!helpPage) return;

  const LS_KEY = 'helpLinksV1';
  const helpList = document.getElementById('helpList');
  const form = document.getElementById('helpForm');
  const fTitle = document.getElementById('hfTitle');
  const fTag   = document.getElementById('hfTag');
  const fUrl   = document.getElementById('hfUrl');
  const fDesc  = document.getElementById('hfDesc');
  const btnReset = document.getElementById('hfReset');

  const defaults = [
    { tag:'Wiki', title:'RDR2 Fandom Wiki', url:'https://reddead.fandom.com/wiki/Red_Dead_Redemption_2', desc:'Lore, karakter, misi, item, dan pedoman lengkap.' },
    { tag:'YouTube', title:'Rockstar Games Channel', url:'https://www.youtube.com/@RockstarGames', desc:'Trailer resmi, update, dan konten video.' },
    { tag:'News', title:'Rockstar Newswire', url:'https://www.rockstargames.com/newswire', desc:'Pengumuman, patch notes, dan event terbaru.' },
    { tag:'Forum', title:'GTAForums — RDR2', url:'https://gtaforums.com/forum/272-red-dead-redemption-2/', desc:'Diskusi komunitas, tips, mod, dan teori liar 😼.' },
    { tag:'Tools', title:'RDR2 Interactive Map', url:'https://rdr2map.com', desc:'Peta interaktif: collectibles, hewan, lokasi unik.' },
  ];

  function load(){
    try{
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return [...defaults];
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return [...defaults];
      return arr;
    }catch{ return [...defaults]; }
  }
  function save(items){
    try{ localStorage.setItem(LS_KEY, JSON.stringify(items)); }catch{}
  }

  function sanitizeUrl(u){
    if (!u) return '';
    const trimmed = u.trim();
    if (/^javascript:/i.test(trimmed)) return ''; // no js:
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return 'https://' + trimmed;
  }

  function createCard(item, idx){
    const a = document.createElement('a');
    a.href = item.url; a.target = '_blank'; a.rel = 'noopener';
    a.innerHTML = `
      <span class="tag">${item.tag ? escapeHtml(item.tag) : 'Link'}</span>
      <div class="title">
        <span>${escapeHtml(item.title || '(Tanpa Judul)')}</span>
      </div>
      <div class="desc">${escapeHtml(item.desc || '')}</div>
    `;

    const wrap = document.createElement('div');
    wrap.className = 'help-card';

    const actions = document.createElement('div');
    actions.className = 'card-actions';

    // Hapus
    const bDel = document.createElement('button');
    bDel.className = 'btn-small danger';
    bDel.textContent = 'Hapus';
    bDel.addEventListener('click', (e)=>{
      e.preventDefault();
      const items = load();
      items.splice(idx,1);
      save(items);
      render();
    });

    // (Opsional) Edit cepet judul/desc
    const bEdit = document.createElement('button');
    bEdit.className = 'btn-small';
    bEdit.textContent = 'Edit';
    bEdit.addEventListener('click', (e)=>{
      e.preventDefault();
      const items = load();
      const cur = items[idx];
      const nt = prompt('Judul:', cur.title || '');
      if (nt === null) return;
      const nd = prompt('Deskripsi:', cur.desc || '');
      if (nd === null) return;
      cur.title = nt.trim();
      cur.desc  = nd.trim();
      items[idx] = cur;
      save(items);
      render();
    });

    actions.appendChild(bEdit);
    actions.appendChild(bDel);

    wrap.appendChild(a);
    wrap.appendChild(actions);
    return wrap;
  }

  function escapeHtml(s){
    return String(s ?? '')
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'",'&#39;');
  }

  function render(){
    const items = load();
    helpList.innerHTML = '';
    for (let i=0;i<items.length;i++){
      helpList.appendChild(createCard(items[i], i));
    }
  }

  // Submit form tambah
  if (form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const title = fTitle.value.trim();
      const tag   = fTag.value.trim();
      const url   = sanitizeUrl(fUrl.value);
      const desc  = fDesc.value.trim();

      if (!title || !url) return;

      const items = load();
      items.unshift({ tag, title, url, desc });
      save(items);
      render();

      fTitle.value = '';
      fTag.value = '';
      fUrl.value = '';
      fDesc.value = '';
      fTitle.focus();
    });

    // Reset ke default (konfirmasi dikit)
    if (btnReset){
      btnReset.addEventListener('click', ()=>{
        const ok = confirm('Reset daftar HELP ke bawaan? (Data custom kamu di device ini akan hilang)');
        if (!ok) return;
        save(defaults);
        render();
      });
    }
  }

  // Render pas buka route #help juga biar selalu up to date
  window.addEventListener('hashchange', ()=>{
    if (location.hash === '#help') render();
  });

  // Render pertama kali
  render();
})();

