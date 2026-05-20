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

