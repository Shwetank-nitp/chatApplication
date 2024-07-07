import React, { useCallback, useEffect, useMemo, useState } from "react";
import { arrowDown, avatar, cat, arrowUp } from "../assets/AppAssits";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fireService } from "../Services/FireService";
import { toast } from "react-toastify";
import { logout as logoutReducer } from "../Store/AuthSlice";

function UserDetails() {
  const [settings, setSettings] = useState(false);
  const [help, sethelp] = useState(false);
  const [media, setmedia] = useState(false);
  const { data } = useSelector((state) => state.AuthSlice);
  const [details, setDetails] = useState(data);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    setLoading(true);
    if (id) {
      fireService
        .getUserById(id)
        .then((doc) => {
          setDetails(doc || data);
        })
        .catch((e) => {
          console.error("error :", e);
          toast.error(e.message);
        });
    }
    setLoading(false);
  }, [id]);
  function logout() {
    fireService
      .logout()
      .then(() => {
        dispatch(logoutReducer());
        toast.success("User logout");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  }
  const handleToggle = (select = "") => {
    setSettings(select === "settings" ? !settings : false);
    setmedia(select === "media" ? !media : false);
    sethelp(select === "help" ? !help : false);
  };

  const render = useMemo(() => {
    return [...Array(11000)].map((_, index) => (
      <li key={index}>
        <img
          src={cat}
          alt="medai"
          className="w-[35px] h-[35px] m-2 inline-block rounded-md"
        />
        <span>photo_1.png</span>
      </li>
    ));
  }, []);

  return (
    <div className="col-span-3">
      <div className="flex flex-col gap-2 items-center text-center b-btm pb-2">
        <div className="w-[75px] h-[75px] overflow-hidden rounded-full">
          <img src={avatar} alt="avatar" className="w-full h-full" />
        </div>
        <div className="font-bold text-lg">Lorem, ipsum dolor.</div>
        <div className="text-sm text-gray-300">
          Lorem ipsum dolor sit amet consectetur adipisicing.
        </div>
      </div>

      <div className="p-4 b-btm max-h-full flex flex-col">
        <div
          onClick={() => {
            handleToggle("settings");
          }}
          className="flex my-4 justify-between items-center cursor-pointer"
        >
          <span>Chat Settings</span>
          <div className="p-2 bg-gray-900 rounded-full overflow-hidden">
            <img
              src={settings ? arrowDown : arrowUp}
              className="w-[15px] h[15px]"
            />
          </div>
        </div>
        <div
          onClick={() => {
            handleToggle("help");
          }}
          className="flex my-4 justify-between items-center cursor-pointer"
        >
          <span>Privacy & Help</span>
          <div className="p-2 bg-gray-900 rounded-full overflow-hidden">
            <img
              src={help ? arrowDown : arrowUp}
              className="w-[15px] h[15px]"
            />
          </div>
        </div>
        <div
          onClick={() => {
            handleToggle("media");
          }}
          className="flex my-4 justify-between items-center cursor-pointer"
        >
          <span>Chat Media</span>
          <div className="p-2 bg-gray-900 rounded-full overflow-hidden">
            <img
              src={media ? arrowDown : arrowUp}
              className="w-[15px] h[15px]"
            />
          </div>
        </div>
        <div
          className={`${
            media ? "block" : "hidden"
          } max-h-[125px] overflow-auto`}
        >
          <ul>{media && render}</ul>
        </div>
      </div>
      <div>
        <button className="py-2 w-full px-3 my-2 bg-red-400 rounded-md">
          Block
        </button>
        <button
          onClick={logout}
          className="py-2 px-3 w-full my-2 bg-blue-400 rounded-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default UserDetails;
