import React, { useRef, useState } from "react";
import { avatar } from "../assets/AppAssits";
import { fireService } from "../Services/FireService";
import { toast } from "react-toastify";
import { defaultPic } from "../../envConfig";
import { useDispatch } from "react-redux";
import { login } from "../Store/AuthSlice";
import { Link } from "react-router-dom";

function SignUp() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const imgRef = useRef(null);
  const [file, setFile] = useState({
    file: null,
    url: avatar,
  });

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFile({
        file,
        url,
      });
    }
  }

  function handleImageClick() {
    imgRef.current.click();
  }

  async function formHandler(e) {
    setLoading(true);
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const obj = Object.fromEntries(formData.entries());
    console.log(obj);
    try {
      let url = null;
      if (file.file) {
        url = await fireService.uploadImage(file.file);
      }
      const user = await fireService.createAccount(obj.email, obj.password);
      await fireService.createDocument(
        {
          id: user.uid,
          name: obj.name.toLowerCase(),
          email: obj.email,
          avatar: url || defaultPic,
          blocked: [],
        },
        user.uid,
        "users"
      );
      await fireService.createDocument({ chat: [] }, user.uid, "userchats");

      dispatch(login(user.toJSON()));
      toast.success("User created successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass p-3 min-w-[20%]">
      <form
        className="flex gap-2 flex-col text-gray-300"
        onSubmit={formHandler}
      >
        <div className="flex m-1 flex-col">
          <label htmlFor="name">Enter your name</label>
          <input
            className="py-2 px-3 rounded-lg outline-none bg-slate-900"
            id="name"
            name="name"
            type="text"
            placeholder="Name"
          />
        </div>
        <div className="flex m-1 flex-col">
          <label htmlFor="username">Enter your username</label>
          <input
            className="py-2 px-3 rounded-lg outline-none bg-slate-900"
            id="email"
            name="email"
            type="email"
            placeholder="example@gmail.com"
          />
        </div>
        <div className="flex m-1 flex-col">
          <label htmlFor="password">Enter your password</label>
          <input
            className="py-2 px-3 rounded-lg outline-none bg-slate-900"
            id="password"
            name="password"
            type="password"
            placeholder="@3Aw$"
          />
        </div>
        <div className="flex flex-col m-1 justify-center gap-3 items-center relative">
          <label htmlFor="avatar">Profile Picture</label>
          <input
            ref={imgRef}
            className="hidden"
            type="file"
            id="avatar"
            name="avatar"
            accept=".jpg,.png"
            onChange={handleImageChange}
          />
          <button
            type="button"
            onClick={handleImageClick}
            className="w-[75px] h-[75px] rounded-full bg-transparent"
          ></button>
          <img
            src={file.url}
            alt="Profile Preview"
            className="w-[75px] h-[75px] rounded-full absolute -z-10 bottom-0"
          />
        </div>
        <button
          disabled={loading}
          className={`p-2 m-3 rounded-lg ${
            loading ? "bg-blue-300 text-gray-500" : "bg-blue-500"
          }`}
          type="submit"
        >
          {loading ? "Loading" : "Submit"}
        </button>
      </form>
      <p>
        Already have an Account ?{" "}
        <Link to={"/login"} className="no-underline text-red-500">
          Click here
        </Link>
      </p>
    </div>
  );
}

export default SignUp;
