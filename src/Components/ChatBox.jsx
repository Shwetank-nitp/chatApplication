import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  camera,
  emoji,
  img,
  info,
  mic,
  phone,
  video,
} from "../assets/AppAssits/index";
import EmojiPicker from "emoji-picker-react";
import Chat from "./Chat";
import { useNavigate, useParams } from "react-router-dom";
import {
  Timestamp,
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { fireService } from "../Services/FireService";
import { useSelector } from "react-redux";
import Loading from "./Loading";

function ChatBox() {
  const chatRef = useRef(null);
  const ref = useRef(null);
  const [height, setHight] = useState(null);
  const [text, setText] = useState("");
  const { id: userId } = useParams();
  const [messages, setMessages] = useState([]);
  const {
    data: { id: clinetId, avatar: clinetProfilePic },
  } = useSelector((state) => state.AuthSlice);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [chatId, setChatId] = useState("");
  const nav = useNavigate();
  const [submitLoading, setSubmitLoading] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    const handleDocuments = async () => {
      try {
        const userResponse = await fireService.getUserById(userId);
        setUser(userResponse);
        const clientUserChatRef = doc(fireService.db, "userchats", clinetId);
        const chatResponse = await getDoc(clientUserChatRef);
        if (chatResponse.exists()) {
          const allChats = chatResponse.data().chat;
          const chatItem = allChats.find((item) => item.reseverId === userId);
          return chatItem ? chatItem.chatId : null;
        } else {
          return null;
        }
      } catch (error) {
        console.log(error);
        return null;
      }
    };

    let unSub;
    handleDocuments()
      .then((chatId) => {
        if (chatId) {
          setChatId(chatId);
          const chatRef = doc(fireService.db, "chats", chatId);
          unSub = onSnapshot(
            chatRef,
            (snapshot) => {
              if (snapshot.exists()) {
                setMessages(snapshot.data().messages);
              }
            },
            (error) => {
              console.log(error);
            }
          );
        } else {
          nav("/not-found");
        }
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      if (unSub) {
        console.log("unmount");
        unSub();
      }
    };
  }, [userId]);

  useEffect(() => {
    if (ref.current && ref.current.style) {
      ref.current.style.height = height + "px";
    }
  }, [height]);

  const [isCLik, setIsClick] = useState(false);

  function handleTextArea(e) {
    setHight(ref.current.scrollHeight);
    setText(e?.target.value);
  }

  function handleTextChange(e) {
    setText((prev) => prev + e.emoji);
  }

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitLoading(true);
    const formData = new FormData(e.target);
    const { message, file = null } = Object.fromEntries(formData);
    if (!message) {
      return;
    }
    console.log("Message is sent!", message, " ", file);

    //todo: check if ther is a file presend and upload it ...
    const data = {
      messages: arrayUnion({
        resever: userId,
        sender: clinetId,
        message: message,
        fileUrl: file,
        sendAt: Timestamp.now(),
      }),
    };
    try {
      const docRef = await fireService.updateDocument(data, chatId, "chats");
      console.log("Update : ", docRef.id === chatId);
    } catch (error) {
      console.log(error);
    }
    setText("");
    setSubmitLoading(false);
  }

  if (loading) {
    return <Loading className={"col-span-6"} />;
  }

  return (
    <div className="px-2 col-span-6 b-right overflow-hidden flex flex-col ">
      <div className="flex gap-4 items-center justify-between pb-2 b-btm">
        <div className="w-[45px] h-[45px] rounded-full overflow-hidden cursor-pointer">
          <img src={user?.avatar} alt="avatar" />
        </div>
        <div className="flex-1 cursor-pointer">
          <div className="font-bold">{user?.name}</div>
          <div className="font-thin text-sm">Hello</div>
        </div>
        <div className="flex gap-4">
          <img
            src={phone}
            alt="phone"
            className="w-[15px] h-[15px] cursor-pointer"
          />
          <img
            src={video}
            alt="video"
            className="w-[15px] h-[15px] cursor-pointer"
          />
          <img
            src={info}
            alt="about"
            className="w-[15px] h-[15px] cursor-pointer"
          />
        </div>
      </div>
      <div className=" flex-1 overflow-y-auto flex flex-col pt-2 pr-2 scroll-smooth">
        {messages.map((message, index) => (
          <Chat
            key={index}
            own={clinetId === message.sender}
            message={message.message}
            img={message?.img}
            time={message.sendAt}
            pfp={message.sender === clinetId ? clinetProfilePic : user.avatar}
          />
        ))}
        <span id="bottom" ref={chatRef}></span>
      </div>
      <div className="flex gap-1 items-center p-1 b-top">
        <div className="flex gap-4">
          <img
            src={img}
            alt="image"
            className="w-[15px] h-[15px] cursor-pointer"
          />
          <img
            src={camera}
            alt="camera"
            className="w-[15px] h-[15px] cursor-pointer"
          />
          <img
            src={mic}
            alt="mic"
            className="w-[15px] h-[15px] cursor-pointer"
          />
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex-1 grid grid-cols-12 gap-2"
        >
          <textarea
            name="message"
            value={text}
            ref={ref}
            placeholder="Type your message here..."
            maxLength={150}
            onChange={(e) => handleTextArea(e)}
            className={`col-span-10 px-3 py-1 bg-gray-900 rounded-lg outline-none resize-none h-[40px]`}
          />
          <div className="flex items-center  col-span-2 gap-1">
            <div className="relative">
              <div className="absolute bottom-4 right-4 z-10">
                <EmojiPicker
                  open={isCLik}
                  onEmojiClick={(e) => {
                    console.log(e);
                    handleTextChange(e);
                  }}
                />
              </div>
              <img
                src={emoji}
                onClick={() => {
                  setIsClick((prev) => !prev);
                }}
                className="h-[20px] w-[20px] cursor-pointer"
              />
            </div>
            <button
              disabled={submitLoading}
              type="submit"
              className={`${
                submitLoading ? "bg-blue-400" : "bg-blue-500"
              } py-1 px-3 rounded-md`}
            >
              {submitLoading ? "Sending" : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatBox;
