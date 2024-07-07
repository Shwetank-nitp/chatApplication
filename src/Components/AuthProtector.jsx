import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function AuthProtector({ children, authentication }) {
  const { status } = useSelector((state) => state.AuthSlice);
  const nav = useNavigate();
  useEffect(() => {
    if (authentication === true && status === false) {
      nav("/login");
    }
    if (authentication === false && status === true) {
      nav("/");
    }
  }, [status]);
  return <div>{children}</div>;
}

export default AuthProtector;
