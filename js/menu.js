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

