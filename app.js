  /* >>> CLOCK (tetep) <<< */
  const elHour   = document.querySelector('.watch .hand.hour');
  const elMinute = document.querySelector('.watch .hand.minute');
  const elSecond = document.querySelector('.watch .hand.second');
  const elLabel  = document.querySelector('.watch .watch-label');

  let watchTimer = null;

  function setWatch() {
    const now = new Date();
    const s = now.getSeconds();
    const m = now.getMinutes();
    const h = now.getHours();

    const secDeg = s * 6;
    const minDeg = m * 6 + s * 0.1;
    const hrDeg  = (h % 12) * 30 + m * 0.5;

    elSecond.style.transform = `translate(-50%,-50%) rotate(${secDeg}deg)`;
    elMinute.style.transform = `translate(-50%,-50%) rotate(${minDeg}deg)`;
    elHour.style.transform   = `translate(-50%,-50%) rotate(${hrDeg}deg)`;
    elLabel.textContent = h < 12 ? 'AM' : 'PM';
  }

  function startWatch(){
    setWatch();
    clearInterval(watchTimer);
    watchTimer = setInterval(setWatch, 1000);
  }
  function stopWatch(){
    clearInterval(watchTimer);
    watchTimer = null;
  }

  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('mainMenu');
  const backdrop = document.getElementById('backdrop');
  const scene = document.getElementById('scene');
  const menuSound = document.getElementById('menuSound');

  function playMenuSoundSafe() {
    if (!menuSound) return;
    try {
      menuSound.currentTime = 0;
      menuSound.volume = 0.6;
      const p = menuSound.play();
      if (p && p.catch) p.catch(() => {});
    } catch (e) {}
  }

  function openMenu(){
    scene.classList.add('bw-mode');
    menu.classList.remove('closing');
    menu.classList.add('open');
    menu.setAttribute('aria-hidden','false');
    backdrop.hidden = false;
    backdrop.classList.remove('hide');
    backdrop.classList.add('show');
    startWatch();
    requestAnimationFrame(playMenuSoundSafe);
  }

  function closeMenu(){
    scene.classList.remove('bw-mode');
    menu.classList.remove('open');
    menu.classList.add('closing');
    menu.setAttribute('aria-hidden','true');
    backdrop.classList.remove('show');
    backdrop.classList.add('hide');
    setTimeout(()=>{
      backdrop.hidden = true;
      backdrop.classList.remove('hide');
      menu.classList.remove('closing');
    }, 260);
    if (menuSound) menuSound.pause();
    stopWatch();
  }

  // ===== MAP page refs =====
  const mapPage = document.getElementById('mapPage');
  const mapBack = document.getElementById('mapBack');
  const linkMap = document.querySelector('a[href="#map"]');

  // ===== HELP page refs =====
  const helpPage = document.getElementById('helpPage');
  const helpBack = document.getElementById('helpBack');
  const linkHelp = document.querySelector('a[href="#help"]');

  // ===== PROGRESS page refs =====
  const progressPage = document.getElementById('progressPage');
  const progressBack = document.getElementById('progressBack');
  const linkProgress = document.querySelector('a[href="#progress"]');

  // ===== SETTINGS page refs =====
  const settingsPage = document.getElementById('settingsPage');
  const settingsBack = document.getElementById('settingsBack');
  const linkSettings = document.querySelector('a[href="#settings"]');
  if (linkSettings){ linkSettings.addEventListener('click', (e)=>{ e.preventDefault(); location.hash = '#settings'; }); }
  if (settingsBack){ settingsBack.addEventListener('click', ()=>{ location.hash = ''; }); }

function applyRoute(){
  const h = location.hash;

  const isMap      = h === '#map';
  const isHelp     = h === '#help';
  const isProgress = h === '#progress';
  const isSettings = h === '#settings';

  document.body.classList.toggle('route-map',      isMap);
  document.body.classList.toggle('route-help',     isHelp);
  document.body.classList.toggle('route-progress', isProgress);
  document.body.classList.toggle('route-settings', isSettings);

  // MAP
  if (mapPage){ if (isMap){ mapPage.hidden=false; mapPage.classList.add('show'); } else { mapPage.classList.remove('show'); mapPage.hidden=true; } }
  // HELP
  if (helpPage){ if (isHelp){ helpPage.hidden=false; helpPage.classList.add('show'); } else { helpPage.classList.remove('show'); helpPage.hidden=true; } }
  // PROGRESS
  if (progressPage){ if (isProgress){ progressPage.hidden=false; progressPage.classList.add('show'); } else { progressPage.classList.remove('show'); progressPage.hidden=true; } }
  // SETTINGS
  if (settingsPage){ if (isSettings){ settingsPage.hidden=false; settingsPage.classList.add('show'); } else { settingsPage.classList.remove('show'); settingsPage.hidden=true; } }

  if (isMap || isHelp || isProgress || isSettings) closeMenu();
}


  window.addEventListener('hashchange', applyRoute);
  applyRoute();

  function openMap(){ location.hash = '#map'; }
  function openHelp(){ location.hash = '#help'; }
  function closeRoute(){ location.hash = ''; } // balik ke landing

  if (linkMap){  linkMap.addEventListener('click', (e)=>{ e.preventDefault(); openMap();  }); }
  if (linkHelp){ linkHelp.addEventListener('click', (e)=>{ e.preventDefault(); openHelp(); }); }

  if (mapBack){  mapBack.addEventListener('click',  closeRoute); }
  if (helpBack){ helpBack.addEventListener('click', closeRoute); }

  if (linkProgress){ linkProgress.addEventListener('click', (e)=>{ e.preventDefault(); location.hash = '#progress'; }); }
  if (progressBack){ progressBack.addEventListener('click', ()=>{ location.hash = ''; }); }


  document.addEventListener('keydown', (e)=>{
    if(e.key==='Escape' && (location.hash === '#map' || location.hash === '#help')) closeRoute();
  });

  toggle.addEventListener('click', openMenu);
  backdrop.addEventListener('click', closeMenu);
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape' && !location.hash) closeMenu(); });

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

/* ====== MAP Checklist (add/toggle/delete + localStorage) ====== */
(() => {
  if (!mapPage) return;

  const LS_KEY = 'mapTodosV1';
  const elList  = document.getElementById('todoList');
  const elForm  = document.getElementById('todoForm');
  const elInput = document.getElementById('todoInput');
  const elClear = document.getElementById('todoClear');
  const elStats = document.getElementById('todoStats');

  // Seed awal (sekali, kalau belum ada data)
  const defaults = [
    { id: uid(), text: 'Hunt legendary animal', done: false },
    { id: uid(), text: 'Rob a train (roleplay, jangan beneran 😼)', done: false },
    { id: uid(), text: 'Poker in Saint Denis', done: false },
    { id: uid(), text: 'Upgrade satchel', done: false },
    { id: uid(), text: 'Stranger missions', done: false },
  ];

  function uid(){ return Math.random().toString(36).slice(2,10) + Date.now().toString(36).slice(-4); }

  function load(){
    try{
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return [...defaults];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [...defaults];
    }catch{ return [...defaults]; }
  }
  function save(items){
    try{ localStorage.setItem(LS_KEY, JSON.stringify(items)); }catch{}
  }

  function render(){
    const items = load();
    elList.innerHTML = '';
    for (const it of items){
      const li = document.createElement('li');
      li.className = 'todo-item' + (it.done ? ' done' : '');
      li.dataset.id = it.id;

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = !!it.done;
      cb.setAttribute('aria-label', 'Centang ' + it.text);

      const title = document.createElement('div');
      title.className = 'todo-title';
      title.textContent = it.text;

      // Aksi: Edit cepat + Hapus
      const act = document.createElement('div');
      act.className = 'todo-actions';

      const bEdit = document.createElement('button');
      bEdit.className = 'btn-small';
      bEdit.textContent = 'Edit';
      bEdit.addEventListener('click', (e)=>{
        e.preventDefault();
        const now = load();
        const idx = now.findIndex(x => x.id === it.id);
        if (idx < 0) return;
        const nt = prompt('Ubah teks:', now[idx].text || '');
        if (nt === null) return;
        now[idx].text = nt.trim();
        save(now); render();
      });

      const bDel = document.createElement('button');
      bDel.className = 'btn-small danger';
      bDel.textContent = 'Hapus';
      bDel.addEventListener('click', (e)=>{
        e.preventDefault();
        const now = load().filter(x => x.id !== it.id);
        save(now); render();
      });

      act.appendChild(bEdit);
      act.appendChild(bDel);

      // Toggle centang
      cb.addEventListener('change', ()=>{
        const now = load();
        const idx = now.findIndex(x => x.id === it.id);
        if (idx >= 0){
          now[idx].done = !!cb.checked;
          save(now); // simpan
        }
        li.classList.toggle('done', cb.checked);
        updateStats();
      });

      li.appendChild(cb);
      li.appendChild(title);
      li.appendChild(act);
      elList.appendChild(li);
    }
    updateStats();
  }

  function updateStats(){
    const items = load();
    const left = items.filter(i => !i.done).length;
    const total = items.length;
    elStats.textContent = `${left}/${total} belum selesai`;
  }

  // Tambah item
  if (elForm){
    elForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const txt = (elInput.value || '').trim();
      if (!txt) return;
      const items = load();
      items.unshift({ id: uid(), text: txt, done: false });
      save(items);
      elInput.value = '';
      render();
      elInput.focus();
    });
  }

  // Hapus yang selesai
  if (elClear){
    elClear.addEventListener('click', ()=>{
      const items = load().filter(i => !i.done);
      save(items); render();
    });
  }

  // Render pas buka route #map biar selalu sync
  window.addEventListener('hashchange', ()=>{
    if (location.hash === '#map') render();
  });

  // First render
  render();
})();

/* ====== PROGRESS page (bars + IP tracker) ====== */
(() => {
  if (!progressPage) return;

  // Storage keys
  const LS_META = 'progressMetaV1';
  const LS_IP   = 'progressIPV1';

  // Meta refs
  const pmSemester   = document.getElementById('pmSemester');
  const pmSemPct     = document.getElementById('pmSemPct');
  const barSemPct    = document.getElementById('barSemPct');
  const pmSemPctLbl  = document.getElementById('pmSemPctLabel');

  const pmSksDone    = document.getElementById('pmSksDone');
  const pmSksTarget  = document.getElementById('pmSksTarget');
  const barSksPct    = document.getElementById('barSksPct');
  const pmSksPctLbl  = document.getElementById('pmSksPctLabel');

  // IP refs
  const ipForm   = document.getElementById('ipForm');
  const ipSem    = document.getElementById('ipSem');
  const ipSks    = document.getElementById('ipSks');
  const ipVal    = document.getElementById('ipVal');
  const ipClear  = document.getElementById('ipClear');
  const ipTbody  = document.getElementById('ipTbody');
  const ipTotalSks = document.getElementById('ipTotalSks');
  const ipIpk      = document.getElementById('ipIpk');

  // ===== utils
  const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));

  // ===== META
  const metaDefaults = { semester: 1, semPct: 0, sksDone: 0, sksTarget: 144 };

  function loadMeta(){
    try{
      const raw = localStorage.getItem(LS_META);
      if (!raw) return {...metaDefaults};
      const obj = JSON.parse(raw);
      return { ...metaDefaults, ...(obj||{}) };
    }catch{ return {...metaDefaults}; }
  }
  function saveMeta(m){
    try{ localStorage.setItem(LS_META, JSON.stringify(m)); }catch{}
  }
  function renderMeta(){
    const m = loadMeta();
    pmSemester.value  = m.semester;
    pmSemPct.value    = clamp(m.semPct, 0, 100);
    barSemPct.style.width = `${clamp(m.semPct,0,100)}%`;
    pmSemPctLbl.textContent = `${clamp(m.semPct,0,100)}%`;

    pmSksDone.value   = m.sksDone;
    pmSksTarget.value = Math.max(1, m.sksTarget || 144);

    const pct = clamp((m.sksDone / Math.max(1, m.sksTarget))*100, 0, 100);
    barSksPct.style.width = `${pct.toFixed(2)}%`;
    pmSksPctLbl.textContent = `${pct.toFixed(2)}%`;
  }
  function bindMeta(){
    pmSemester.addEventListener('input', ()=>{
      const m = loadMeta();
      m.semester = Math.max(1, parseInt(pmSemester.value||'1',10));
      saveMeta(m); // no re-render needed
    });
    pmSemPct.addEventListener('input', ()=>{
      const m = loadMeta();
      m.semPct = clamp(parseInt(pmSemPct.value||'0',10), 0, 100);
      saveMeta(m);
      barSemPct.style.width = `${m.semPct}%`;
      pmSemPctLbl.textContent = `${m.semPct}%`;
    });
    const updSKS = ()=>{
      const m = loadMeta();
      m.sksDone   = Math.max(0, parseInt(pmSksDone.value||'0',10));
      m.sksTarget = Math.max(1, parseInt(pmSksTarget.value||'144',10));
      saveMeta(m);
      const pct = clamp((m.sksDone / Math.max(1, m.sksTarget))*100, 0, 100);
      barSksPct.style.width = `${pct.toFixed(2)}%`;
      pmSksPctLbl.textContent = `${pct.toFixed(2)}%`;
    };
    pmSksDone.addEventListener('input',  updSKS);
    pmSksTarget.addEventListener('input',updSKS);
  }

  // ===== IP LIST
  function loadIPs(){
    try{
      const raw = localStorage.getItem(LS_IP);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    }catch{ return []; }
  }
  function saveIPs(a){
    try{ localStorage.setItem(LS_IP, JSON.stringify(a)); }catch{}
  }
  function calcSummary(){
    const arr = loadIPs();
    const totalSks = arr.reduce((s,x)=>s + (parseInt(x.sks)||0), 0);
    const wSum = arr.reduce((s,x)=> s + ( (parseFloat(x.ip)||0) * (parseInt(x.sks)||0) ), 0);
    const ipk = totalSks ? (wSum/totalSks) : 0;
    ipTotalSks.textContent = totalSks;
    ipIpk.textContent = ipk.toFixed(2);
  }
  function renderIPs(){
    const arr = loadIPs().sort((a,b)=> (a.sem||0)-(b.sem||0));
    ipTbody.innerHTML = '';
    for (let i=0;i<arr.length;i++){
      const it = arr[i];
      const tr = document.createElement('tr');

      const tdSem = document.createElement('td'); tdSem.textContent = it.sem ?? '';
      const tdSks = document.createElement('td'); tdSks.textContent = it.sks ?? '';
      const tdIp  = document.createElement('td'); tdIp.textContent  = it.ip ?? '';

      const tdAct = document.createElement('td');
      const act = document.createElement('div'); act.className = 'ip-actions';

      const bEdit = document.createElement('button');
      bEdit.className = 'btn-small'; bEdit.textContent = 'Edit';
      bEdit.addEventListener('click', ()=>{
        const sem = prompt('Semester:', it.sem ?? '');
        if (sem === null) return;
        const sks = prompt('SKS:', it.sks ?? '');
        if (sks === null) return;
        const ip  = prompt('IP (0–4):', it.ip ?? '');
        if (ip === null) return;

        const arr2 = loadIPs();
        const idx = arr2.findIndex(x => x === it);
        if (idx >= 0){
          arr2[idx] = {
            sem: Math.max(1, parseInt(sem||'1',10)),
            sks: Math.max(1, parseInt(sks||'1',10)),
            ip:  clamp(parseFloat(ip||'0'), 0, 4).toFixed(2)
          };
          saveIPs(arr2); renderIPs(); calcSummary();
        }
      });

      const bDel = document.createElement('button');
      bDel.className = 'btn-small danger'; bDel.textContent = 'Hapus';
      bDel.addEventListener('click', ()=>{
        const arr2 = loadIPs().filter(x => x !== it);
        saveIPs(arr2); renderIPs(); calcSummary();
      });

      act.appendChild(bEdit); act.appendChild(bDel);
      tdAct.appendChild(act);

      tr.appendChild(tdSem); tr.appendChild(tdSks); tr.appendChild(tdIp); tr.appendChild(tdAct);
      ipTbody.appendChild(tr);
    }
    calcSummary();
  }
  function bindIP(){
    if (ipForm){
      ipForm.addEventListener('submit', (e)=>{
        e.preventDefault();
        const sem = Math.max(1, parseInt(ipSem.value || '1', 10));
        const sks = Math.max(1, parseInt(ipSks.value || '1', 10));
        const ip  = clamp(parseFloat(ipVal.value || '0'), 0, 4);

        const arr = loadIPs();
        arr.push({ sem, sks, ip: ip.toFixed(2) });
        saveIPs(arr);
        renderIPs();
        // auto-next semester kalau kosong
        if (!ipSem.value) ipSem.value = String(sem + 1);
        ipSks.value = ''; ipVal.value = '';
      });
    }
    if (ipClear){
      ipClear.addEventListener('click', ()=>{
        if (!confirm('Hapus semua entri IP?')) return;
        saveIPs([]); renderIPs(); calcSummary();
      });
    }
  }

  // Auto render saat buka #progress
  window.addEventListener('hashchange', ()=>{
    if (location.hash === '#progress'){ renderMeta(); renderIPs(); }
  });

  // Init
  bindMeta(); bindIP();
  renderMeta(); renderIPs();

  // Isi default "Semester" di form IP (kalau kosong) = meta.semester
  const m0 = loadMeta();
  if (ipSem && !ipSem.value) ipSem.value = String(m0.semester || 1);
})();

/* ====== SETTINGS → CALENDAR (L1–L4) ====== */
(() => {
  if (!settingsPage) return;

  // ---- Storage Keys
  const LS_EVENTS = 'calendarEventsV1';
  const LS_PREFS  = 'calendarPrefsV1';
  const LS_NOTIF  = 'calendarNotifiedV1'; // cache id->timestamp

  // ---- Refs
  const grid   = document.getElementById('calGrid');
  const monthLabel = document.getElementById('calMonthLabel');
  const btnPrev = document.getElementById('calPrev');
  const btnNext = document.getElementById('calNext');
  const btnToday= document.getElementById('calToday');
  const selFilter = document.getElementById('calCategoryFilter');
  const hideDone  = document.getElementById('calHideDone');
  const selTheme  = document.getElementById('calTheme');
  const btnExport = document.getElementById('calExport');
  const inpImport = document.getElementById('calImport');
  const btnNotif  = document.getElementById('calNotif');

  const form   = document.getElementById('eventForm');
  const evId   = document.getElementById('evId');
  const evTitle= document.getElementById('evTitle');
  const evCategory = document.getElementById('evCategory');
  const evDone = document.getElementById('evDone');
  const evDate = document.getElementById('evDate');
  const evStart= document.getElementById('evStart');
  const evEnd  = document.getElementById('evEnd');
  const evReminder = document.getElementById('evReminder');
  const evNotes= document.getElementById('evNotes');
  const evReset= document.getElementById('evReset');

  const listToday = document.getElementById('listToday');
  const listWeek  = document.getElementById('listWeek');

  // ---- State
  let today = new Date();
  let viewYear  = today.getFullYear();
  let viewMonth = today.getMonth(); // 0..11

  // ---- Utils
  const pad2 = (n)=> String(n).padStart(2,'0');
  const toKey = (d)=> `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
  const parseDate = (iso)=> { const [y,m,d] = iso.split('-').map(Number); return new Date(y, (m||1)-1, d||1); };
  const uid = ()=> Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4);

  // ---- Storage helpers
  function loadEvents(){
    try{ const a = JSON.parse(localStorage.getItem(LS_EVENTS)||'[]'); return Array.isArray(a)?a:[]; }catch{ return []; }
  }
  function saveEvents(a){
    try{ localStorage.setItem(LS_EVENTS, JSON.stringify(a)); }catch{}
  }
  function loadPrefs(){
    const defaults = { filter:'', hideDone:false, theme:'classic' };
    try{ const p = JSON.parse(localStorage.getItem(LS_PREFS)||'{}'); return { ...defaults, ...(p||{}) }; }catch{ return defaults; }
  }
  function savePrefs(p){
    try{ localStorage.setItem(LS_PREFS, JSON.stringify(p)); }catch{}
  }
  function loadNotified(){
    try{ const m = JSON.parse(localStorage.getItem(LS_NOTIF)||'{}'); return m && typeof m==='object' ? m : {}; }catch{ return {}; }
  }
  function saveNotified(m){ try{ localStorage.setItem(LS_NOTIF, JSON.stringify(m)); }catch{} }

  // ---- Rendering
  function monthName(m){
    return ['January','February','March','April','May','June','July','August','September','October','November','December'][m];
  }
  function renderHeader(){
    monthLabel.textContent = `${monthName(viewMonth)} ${viewYear}`;
  }
  function getMonthMatrix(year, month){
    // return array of Date for 6 weeks grid
    const first = new Date(year, month, 1);
    const startDow = first.getDay(); // 0 Sun
    const start = new Date(year, month, 1 - startDow); // start from Sunday
    const days = [];
    for(let i=0; i<42; i++){
      days.push(new Date(start.getFullYear(), start.getMonth(), start.getDate()+i));
    }
    return days;
  }
  function applyTheme(theme){
    document.body.classList.remove('theme-blood','theme-sand');
    if (theme==='blood') document.body.classList.add('theme-blood');
    if (theme==='sand')  document.body.classList.add('theme-sand');
  }

  function renderGrid(){
    if (!grid) return;
    grid.innerHTML = '';

    // DOW header
    const head = document.createElement('div');
    head.className = 'cal-head';
    ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d=>{
      const el = document.createElement('div');
      el.className = 'cal-dow';
      el.textContent = d;
      head.appendChild(el);
    });
    grid.appendChild(head);

    const prefs = loadPrefs();
    const events = loadEvents();
    const days = getMonthMatrix(viewYear, viewMonth);

    const startMonth = new Date(viewYear, viewMonth, 1);
    const endMonth   = new Date(viewYear, viewMonth+1, 0);

    days.forEach(day=>{
      const key = toKey(day);
      const cell = document.createElement('div');
      cell.className = 'cal-cell';

      // date row
      const dateRow = document.createElement('div');
      dateRow.className = 'cal-date';
      const dnum = document.createElement('span');
      dnum.textContent = day.getDate();
      if (day.toDateString() === new Date().toDateString()){
        dnum.style.fontWeight = '800';
      }
      const act = document.createElement('div'); act.className='actions';
      const add = document.createElement('button'); add.className='addbtn'; add.textContent = '+';
      add.title = 'Tambah event pada tanggal ini';
      add.addEventListener('click', ()=>{
        evId.value=''; evTitle.value=''; evCategory.value='tugas';
        evDone.checked=false; evDate.value=key; evStart.value=''; evEnd.value='';
        evReminder.value=''; evNotes.value='';
        evTitle.focus();
      });
      act.appendChild(add);
      dateRow.appendChild(dnum); dateRow.appendChild(act);
      cell.appendChild(dateRow);

      // events
      const ofDay = events
        .filter(e => e.date === key)
        .filter(e => (prefs.filter ? e.category === prefs.filter : true))
        .filter(e => (prefs.hideDone ? !e.done : true))
        .sort((a,b) => (a.start||'').localeCompare(b.start||''));

      for (const e of ofDay){
        const ev = document.createElement('div');
        ev.className = `ev ${e.category}` + (e.done ? ' done' : '');
        const dot = document.createElement('div'); dot.className='ev-dot';
        const body= document.createElement('div'); body.className='ev-body';
        const title= document.createElement('div'); title.className='ev-title'; title.textContent = e.title;
        const meta = document.createElement('div'); meta.className='ev-meta';
        const timeTxt = (e.start? e.start : '') + (e.end? `–${e.end}` : '');
        meta.textContent = `${timeTxt || 'all-day'} • ${tagName(e.category)}`;

        body.appendChild(title); body.appendChild(meta);

        const act = document.createElement('div'); act.className='ev-act';
        const bDone = document.createElement('button'); bDone.className='mini'; bDone.textContent = e.done ? 'Undo' : 'Done';
        bDone.addEventListener('click', ()=> toggleDone(e.id));
        const bEdit = document.createElement('button'); bEdit.className='mini'; bEdit.textContent = 'Edit';
        bEdit.addEventListener('click', ()=> fillForm(e));
        const bDel = document.createElement('button'); bDel.className='mini'; bDel.textContent = 'Del';
        bDel.addEventListener('click', ()=> delEvent(e.id));

        act.appendChild(bDone); act.appendChild(bEdit); act.appendChild(bDel);

        ev.appendChild(dot); ev.appendChild(body); ev.appendChild(act);
        cell.appendChild(ev);
      }

      // dim other months
      if (day < startMonth || day > endMonth) cell.style.opacity = .5;

      grid.appendChild(cell);
    });
  }

  function tagName(cat){
    return { kuliah:'Kuliah', tugas:'Tugas', pribadi:'Pribadi', lain:'Lain' }[cat] || 'Lain';
  }

  function fillForm(e){
    evId.value = e.id;
    evTitle.value = e.title || '';
    evCategory.value = e.category || 'lain';
    evDone.checked = !!e.done;
    evDate.value = e.date || '';
    evStart.value = e.start || '';
    evEnd.value = e.end || '';
    evReminder.value = e.reminder || '';
    evNotes.value = e.notes || '';
    evTitle.focus();
  }

  function toggleDone(id){
    const a = loadEvents();
    const idx = a.findIndex(x=>x.id===id);
    if (idx<0) return;
    a[idx].done = !a[idx].done;
    saveEvents(a);
    renderGrid(); renderSide();
  }

  function delEvent(id){
    const a = loadEvents().filter(x=>x.id!==id);
    saveEvents(a);
    renderGrid(); renderSide();
  }

  // ---- Side lists (Today / Week)
  function renderSide(){
    const a = loadEvents();
    const now = new Date();
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1);

    const weekStart = new Date(dayStart); weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEnd = new Date(weekStart); weekEnd.setDate(weekEnd.getDate()+7);

    function inDay(e){
      const d = parseDate(e.date);
      return d >= dayStart && d < dayEnd;
    }
    function inWeek(e){
      const d = parseDate(e.date);
      return d >= weekStart && d < weekEnd;
    }

    const prefs = loadPrefs();
    const filter = (e)=> (prefs.filter ? e.category===prefs.filter : true) && (prefs.hideDone ? !e.done : true);

    const todayList = a.filter(inDay).filter(filter).sort((x,y)=>(x.start||'').localeCompare(y.start||''));
    const weekList  = a.filter(inWeek).filter(filter).sort((x,y)=> (x.date+y.start).localeCompare(y.date+x.start));

    listToday.innerHTML = '';
    for (const e of todayList){
      const li = document.createElement('li');
      li.innerHTML = `<span class="ev-dot" style="background:${getCatColor(e.category)}"></span>
        <span>${e.title}</span>
        <small>${e.start || 'all-day'}</small>`;
      const btn = document.createElement('button'); btn.className='mini'; btn.textContent = e.done?'Undo':'Done';
      btn.addEventListener('click', ()=> toggleDone(e.id));
      li.appendChild(btn);
      listToday.appendChild(li);
    }

    listWeek.innerHTML = '';
    for (const e of weekList){
      const li = document.createElement('li');
      li.innerHTML = `<span class="ev-dot" style="background:${getCatColor(e.category)}"></span>
        <span>${e.title}</span>
        <small>${e.date} ${e.start||''}</small>`;
      const btn = document.createElement('button'); btn.className='mini'; btn.textContent = e.done?'Undo':'Done';
      btn.addEventListener('click', ()=> toggleDone(e.id));
      li.appendChild(btn);
      listWeek.appendChild(li);
    }
  }

  function getCatColor(cat){
    return getComputedStyle(document.documentElement).getPropertyValue(
      {kuliah:'--c-kuliah', tugas:'--c-tugas', pribadi:'--c-pribadi', lain:'--c-lain'}[cat] || '--c-lain'
    ) || '#888';
  }

  // ---- Form submit
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const item = {
      id: evId.value || uid(),
      title: (evTitle.value||'').trim(),
      category: evCategory.value || 'lain',
      done: !!evDone.checked,
      date: evDate.value,
      start: evStart.value || '',
      end: evEnd.value || '',
      reminder: Math.max(0, parseInt(evReminder.value||'0',10)) || 0,
      notes: (evNotes.value||'').trim(),
      createdAt: Date.now()
    };
    if (!item.title || !item.date) return;

    const a = loadEvents();
    const idx = a.findIndex(x=>x.id===item.id);
    if (idx>=0) a[idx]=item; else a.push(item);
    saveEvents(a);

    // clear
    evId.value=''; evTitle.value=''; evDone.checked=false; evNotes.value=''; evStart.value=''; evEnd.value=''; evReminder.value='';

    renderGrid(); renderSide();
  });

  evReset.addEventListener('click', ()=>{
    evId.value=''; evTitle.value=''; evCategory.value='tugas'; evDone.checked=false;
    evDate.value=''; evStart.value=''; evEnd.value=''; evReminder.value=''; evNotes.value='';
  });

  // ---- Navigation
  btnPrev.addEventListener('click', ()=>{ if(--viewMonth<0){ viewMonth=11; viewYear--; } draw(); });
  btnNext.addEventListener('click', ()=>{ if(++viewMonth>11){ viewMonth=0; viewYear++; } draw(); });
  btnToday.addEventListener('click', ()=>{ const n=new Date(); viewYear=n.getFullYear(); viewMonth=n.getMonth(); draw(); });

  // ---- Filters & Prefs
  const prefs0 = loadPrefs();
  selFilter.value = prefs0.filter || '';
  hideDone.checked = !!prefs0.hideDone;
  selTheme.value = prefs0.theme || 'classic';
  applyTheme(selTheme.value);

  selFilter.addEventListener('change', ()=>{
    const p=loadPrefs(); p.filter = selFilter.value; savePrefs(p); draw();
  });
  hideDone.addEventListener('change', ()=>{
    const p=loadPrefs(); p.hideDone = !!hideDone.checked; savePrefs(p); draw();
  });
  selTheme.addEventListener('change', ()=>{
    const p=loadPrefs(); p.theme = selTheme.value; savePrefs(p); applyTheme(p.theme);
  });

  // ---- Export / Import
  btnExport.addEventListener('click', ()=>{
    const data = { events: loadEvents(), prefs: loadPrefs() };
    const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `calendar-export-${Date.now()}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  });
  inpImport.addEventListener('change', async ()=>{
    const f = inpImport.files?.[0]; if(!f) return;
    try{
      const text = await f.text();
      const obj = JSON.parse(text);
      if (Array.isArray(obj.events)) saveEvents(obj.events);
      if (obj.prefs && typeof obj.prefs==='object') savePrefs(obj.prefs);
      draw();
      alert('Import sukses!');
    }catch{ alert('File invalid ajg 😭'); }
    finally{ inpImport.value = ''; }
  });

  // ---- Notifications (L3)
  btnNotif.addEventListener('click', async ()=>{
    try{
      const perm = await Notification.requestPermission();
      alert(perm === 'granted' ? 'Siap! Notif diijinkan.' : 'Notif ditolak/diabaikan.');
    }catch{}
  });

  function checkNotifications(){
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    const notified = loadNotified();
    const now = new Date();

    const a = loadEvents().filter(e => !e.done && e.reminder>0 && e.date);
    for (const e of a){
      const startTime = toDateTime(e.date, e.start);
      if (!startTime) continue;
      const tReminder = new Date(startTime.getTime() - e.reminder*60000);
      // fire if current >= reminder time and not yet fired in last 24h
      if (now >= tReminder){
        const key = e.id + '|' + startTime.getTime();
        if (!notified[key]){
          new Notification(e.title, {
            body: `${e.date} ${e.start||''} • ${tagName(e.category)}${e.notes? ' — '+e.notes : ''}`,
          });
          notified[key] = Date.now();
        }
      }
    }
    // cleanup cache
    for (const k of Object.keys(notified)){
      if (now - notified[k] > 3*24*3600*1000) delete notified[k];
    }
    saveNotified(notified);
  }

  function toDateTime(dateISO, timeHHMM){
    const d = parseDate(dateISO);
    if (!timeHHMM) return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
    const [hh,mm] = timeHHMM.split(':').map(Number);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), hh||0, mm||0, 0);
  }

  // run checker tiap menit
  setInterval(checkNotifications, 60000);
  // juga cek saat buka halaman
  window.addEventListener('focus', checkNotifications);

  function draw(){ renderHeader(); renderGrid(); renderSide(); }
  draw();

  // Auto render pas buka route #settings
  window.addEventListener('hashchange', ()=>{
    if (location.hash === '#settings') draw();
  });
})();


  /* ========== MAP ZOOM (wheel only on image area) ========== */
  (() => {
    const pageInner = document.querySelector('#mapPage .page-inner');
    const canvas    = document.querySelector('#mapPage .map-canvas');

    if (!pageInner || !canvas) return;

    let scale = 1;
    const MIN_ZOOM = 1;
    const MAX_ZOOM = 4;
    const STEP     = 0.12;

    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    pageInner.addEventListener('wheel', (e) => {
      if (location.hash !== '#map') return;
      e.preventDefault();

      const rect = pageInner.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      canvas.style.transformOrigin = `${x}px ${y}px`;

      const dir = e.deltaY < 0 ? 1 : -1;
      scale = clamp(scale * (1 + dir * STEP), MIN_ZOOM, MAX_ZOOM);
      canvas.style.transform = `scale(${scale})`;
    }, { passive: false });

    pageInner.addEventListener('dblclick', () => {
      scale = 1;
      canvas.style.transformOrigin = '50% 50%';
      canvas.style.transform = 'scale(1)';
    });
  })();
