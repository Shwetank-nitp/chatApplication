import React, { useState } from "react";
import { toast } from "react-toastify";
import { fireService } from "../Services/FireService";
import { useDispatch } from "react-redux";
import { login } from "../Store/AuthSlice";
import { Link } from "react-router-dom";
function Login() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  async function handleForm(e) {
    try {
      setLoading(true);
      e.preventDefault();
      const formData = new FormData(e.target);
      const obj = Object.fromEntries(formData.entries());
      const user = await fireService.login(obj.email, obj.password);
      const clinet = await fireService.getUserById(user.uid, "users");
      dispatch(login(clinet));
      toast("Successfull", { type: "success" });
    } catch (error) {
      console.log(error);
      toast(error.message, { type: "error" });
    } finally {
      setLoading(true);
    }
  }
  return (
    <div className="glass w-max p-3 min-w-[20%]">
      <form onSubmit={handleForm} className="flex flex-col gap-4 text-gray-300">
        <div className="">
          <label className="block my-1" htmlFor="email">
            Enter your Email
          </label>
          <input
            className="outline-none bg-slate-900 py-2 px-3 rounded-lg w-full"
            name="email"
            id="email"
            type="text"
            placeholder="Email"
          />
        </div>
        <div className="">
          <label className="block my-1" htmlFor="password">
            Enter your password
          </label>
          <input
            className="outline-none bg-slate-900 py-2 px-3 rounded-lg w-full"
            name="password"
            id="password"
            type="password"
            placeholder="Password"
          />
        </div>
        <button
          disabled={loading}
          type="submit"
          className={`py-2 px-3 ${
            loading ? "bg-blue-400" : "bg-blue-500"
          } rounded-lg`}
        >
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>
      <p className="py-2">
        Create a new Account ?{" "}
        <Link to={"/register"} className="no-underline text-blue-500">
          Click here
        </Link>
      </p>
    </div>
  );
}

export default Login;
