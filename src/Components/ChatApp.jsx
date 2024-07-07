import React from "react";
import ChatBox from "./ChatBox";
import ListOfUsers from "./ListOfUsers";
import UserDetails from "./UserDetails";
import { Outlet } from "react-router-dom";

function ChatApp() {
  return (
    <div className="glass w-[85vw] h-[95vh] grid grid-cols-12 gap-1 p-3">
      <ListOfUsers />
      <Outlet/>
      <UserDetails />
    </div>
  );
}

export default ChatApp;
