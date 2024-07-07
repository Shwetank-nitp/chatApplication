import React, { useEffect, useState } from "react";
import { avatar } from "../assets/AppAssits";

function Chat({ message = "test", own = true, time, pfp, img }) {
  const [date, setDate] = useState("0 sec");
  useEffect(() => {
    const interval = setInterval(() => {
      const number = time.toMillis();
      const nowNumber = Date.now();
      const diff = nowNumber - number;
      const _day = 1000 * 60 * 60 * 24;
      const hours = _day / 24;
      if (diff > _day && diff <= 30 * _day) {
        setDate(`${Math.round(diff / _day)} days ago`);
      } else if (diff > 30 * _day) {
        setDate(`${Math.round(diff / (30 * _day))} Months ago`);
      } else if (diff < _day && diff >= hours) {
        setDate(`${Math.round(diff / hours)} hours ago`);
      } else if (diff < hours && diff >= hours / 60) {
        setDate(`${Math.round(diff / (hours / 60))} min ago`);
      } else if (diff < hours / 60) {
        setDate(`${Math.round(diff / 1000)} sec ago`);
      } else {
        setDate(time.toDate());
      }
    }, 1500);
    return () => {
      console.log("clean up");
      clearInterval(interval);
    };
  }, []);
  return (
    <div
      className={`flex items-start justify-start gap-1 max-w-[50%] ${
        own && "flex-row-reverse self-end"
      }`}
    >
      <div className={`rounded-full overflow-hidden w-[35px] h-[35px]`}>
        <img src={pfp} alt="avatar" className="w-full h-full" />
      </div>
      <div className="max-w-[80%] m-1">
        {img && (
          <img
            src={img}
            alt="image"
            className="w-fit h-fit max-w-full mb-1 rounded-sm"
          />
        )}
        {message && (
          <div
            className={`${
              own ? "bg-blue-600" : "bg-white text-black"
            } px-3 py-1 rounded-lg `}
          >
            <p className="text-wrap">{message}</p>
          </div>
        )}
        <span className={`text-xs text-white`}>{date}</span>
      </div>
    </div>
  );
}

export default Chat;
