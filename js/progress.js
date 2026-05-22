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

