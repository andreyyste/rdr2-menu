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


