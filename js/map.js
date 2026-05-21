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

