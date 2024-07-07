import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import { loading } from "../assets/AppAssits";

function Loading({ className }) {
  const loadingRef = useRef(null);
  // useEffect(() => {
  //   try {
  //     lottie.loadAnimation({
  //       container: loadingRef.current,
  //       renderer: "svg",
  //       loop: true,
  //       autoplay: true,
  //       path: loading,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, []);
  return (
    <div
      className={`w-full h-full flex justify-center items-center ${className}`}
    >
      <div id="laoding" ref={loadingRef}>
        Loading
      </div>
    </div>
  );
}

export default Loading;
