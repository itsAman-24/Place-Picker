import React from "react";
import { useState, useEffect } from 'react';

const ProgressBar = ({ timer }) => {
  const [timerValue, setTimerValue] = useState(timer);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerValue((prevValue) => prevValue - 10);
    }, 10);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <progress className="progressBar" value={timerValue} max={timer} />;
};

export default ProgressBar;
