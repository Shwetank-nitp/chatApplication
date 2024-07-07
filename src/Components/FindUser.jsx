import { arrayUnion, where } from "firebase/firestore";
import React, { useState } from "react";
import { fireService } from "../Services/FireService";
import Loading from "./Loading";
import { useSelector } from "react-redux";

function FindUser() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    data: { id: clientId, name: clinetName },
  } = useSelector((state) => state.AuthSlice);

  function handleChange(e) {
    setSearch(e.target?.value);
  }

  async function handleSearch() {
    try {
      setLoading(true);
      if (search) {
        const objectQuery = {
          where: where("name", "==", search.toLowerCase()),
        };
        const allUsers = await fireService.getDocumentByQuary(objectQuery);
        setUsers(allUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { userId } = Object.fromEntries(formData);
    try {
      const { id: chatId } = await fireService.createDocument(
        { messages: [] },
        undefined,
        "chats"
      );
      await fireService.updateDocument(
        {
          chat: arrayUnion({
            chatId: chatId,
            reseverId: userId,
            lastmessage: "",
          }),
        },
        clientId,
        "userchats"
      );
      await fireService.updateDocument(
        {
          chat: arrayUnion({
            chatId: chatId,
            reseverId: clientId,
            lastmessage: "",
          }),
        },
        userId,
        "userchats"
      );
      console.log("done");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="absolute p-2 top-[20%] glass-x rounded-md min-w-[95%]">
      <div>
        <input
          name="search"
          value={search}
          onChange={handleChange}
          className="py-2 px-3 mx-1 rounded-lg bg-slate-900 outline-none"
          placeholder="Find user..."
        />
        <button
          onClick={handleSearch}
          type="submit"
          className={`py-2 px-3 ${
            loading ? "bg-blue-400" : "bg-blue-500"
          } rounded-md`}
        >
          {loading ? "Loading" : "Search"}
        </button>
      </div>
      <div className="my-3 text-black flex flex-col items-center max-h-[250px] overflow-y-auto">
        {loading ? (
          <Loading />
        ) : users.length ? (
          <ul>
            {users.map((user) => (
              <li
                key={user.id}
                className="my-2 bg-slate-600 rounded-md overflow-hidden text-white flex items-center p-2 justify-between"
              >
                <div className="inline-block w-[35px] h-[35px] rounded-lg overflow-hidden">
                  <img
                    src={user.avatar}
                    className="w-full h-full"
                    alt="Avatar"
                  />
                </div>
                <div className="mx-2 inline-block">{user.name}</div>
                <form onSubmit={handleAdd}>
                  <input
                    name="userId"
                    value={user.id}
                    className="hidden"
                    readOnly
                  />
                  <button
                    type="submit"
                    className="py-1 px-2 rounded-lg bg-green-400"
                  >
                    Add
                  </button>
                </form>
              </li>
            ))}
          </ul>
        ) : (
          "No results"
        )}
      </div>
    </div>
  );
}

export default FindUser;
