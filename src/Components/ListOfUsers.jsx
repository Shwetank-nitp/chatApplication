import React, { useEffect, useState } from "react";
import avatar from "../assets/AppAssits/avatar.png";
import more from "../assets/AppAssits/more.png";
import edit from "../assets/AppAssits/edit.png";
import camera from "../assets/AppAssits/video.png";
import plus from "../assets/AppAssits/plus.png";
import minus from "../assets/AppAssits/minus.png";
import search from "../assets/AppAssits/search.png";
import FindUser from "./FindUser";
import { useSelector } from "react-redux";
import { fireService } from "../Services/FireService";
import Loading from "./Loading";
import { doc, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";

function ListOfUsers() {
  const [add, setAdd] = useState(true);
  const [list, setList] = useState([]);
  const { data, status } = useSelector((state) => state.AuthSlice);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unSub;

    if (status) {
      unSub = onSnapshot(
        doc(fireService.db, "userchats", data.id),
        async (res) => {
          try {
            const list = res.data().chat;

            const promises = list.map(async (item) => {
              const user = await fireService.getUserById(item?.reseverId);
              return { ...user, lastmessage: item.lastmessage };
            });
            const userList = await Promise.all(promises);
            setList(userList);
          } catch (error) {
            console.error("Error fetching user data:", error);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error("Error with onSnapshot:", error);
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }

    return () => {
      if (unSub) unSub();
      setLoading(true); // Set loading to true when the component unmounts or dependencies change
    };
  }, [data?.id, status]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="border-r-gray-500 relative border-opacity-75 border-r-[0.5px] border-solid border-gray-700 pr-3 col-span-3 flex flex-col gap-4 w-full overflow-y-hidden">
      {!add && <FindUser />}

      <div className="flex items-center gap-4">
        <div className="w-[45px] h-[45px] rounded-full overflow-hidden">
          <img src={data?.avatar} alt="avatar" className="w-full h-full" />
        </div>
        <div className="font-bold text-lg text-white flex-1">{data?.name}</div>
        <img src={more} alt="more" className="w-4 h-4 cursor-pointer" />
        <img className="w-4 h-4 cursor-pointer" src={camera} alt="camera" />
        <img src={edit} alt="edit" className="w-4 h-4 cursor-pointer" />
      </div>

      <div className="flex gap-4 items-center">
        <form className="flex bg-slate-900 items-center py-1 px-3 m-1 rounded-md">
          <input
            className="outline-none bg-inherit text-white w-full"
            placeholder="search"
            name="search"
            maxLength={25}
          />
          <button className="w-4 h-4" type="submit">
            <img src={search} />
          </button>
        </form>
        <img
          className="w-5 h-5 bg-slate-900 p-1 rounded-md cursor-pointer"
          src={add ? plus : minus}
          onClick={() => {
            setAdd((prev) => !prev);
          }}
        />
      </div>

      {list.map((user) => (
        <Link
          to={`/user/${user.id}`}
          key={user.id}
          className="max-h-full overflow-y-auto scroll-smooth grid gap-4"
        >
          <div className="flex items-center gap-4 cursor-pointer">
            <div className="w-[35px] h-[35px] rounded-full overflow-hidden">
              <img src={user.avatar} alt="avatar" className="w-full h-full" />
            </div>
            <div>
              <div className="font-bold">{user.name}</div>
              <div className="text-xs text-gray-300">
                {user?.lastmessage || "Start Chat"}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ListOfUsers;
