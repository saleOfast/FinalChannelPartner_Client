import React, { useState, useEffect } from 'react';

const ClockComponent = () => {
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);

  const rotation = (target, val) => {
    target.style.transform = `rotate(${val}deg)`;
  };

  useEffect(() => {
    const clockInterval = setInterval(() => {
      let date = new Date();
      let hh = (date.getHours() % 12) + date.getMinutes() / 59;
      let mm = date.getMinutes();
      let ss = date.getSeconds();

      hh *= 30;
      mm *= 6;
      ss *= 6;

      rotation(document.getElementById("hr"), hh);
      rotation(document.getElementById("min"), mm);
      rotation(document.getElementById("sec"), ss);

      setHour(hh);
      setMinute(mm);
      setSecond(ss);
    }, 500);

    return () => clearInterval(clockInterval);
  }, []);

  return (
    <div className="container ">
      <div className="circle"></div>
      <div className="circle"></div>

      <div className="clock">
        <div className="clock-img">
          <img src="/images/clock.png" alt="clock" />
        </div>
        <div className="hour">
          <span className="hr" id="hr" style={{ transform: `rotate(${hour}deg)` }}></span>
        </div>
        <div className="minute">
          <span className="min" id="min" style={{ transform: `rotate(${minute}deg)` }}></span>
        </div>
        <div className="second">
          <span className="sec" id="sec" style={{ transform: `rotate(${second}deg)` }}></span>
        </div>
      </div>
    </div>
  )
}

export default ClockComponent