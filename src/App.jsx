import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { fireService } from "./Services/FireService";
import { useDispatch } from "react-redux";
import { login } from "./Store/AuthSlice";
import Loading from "./Components/Loading";

export default function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    fireService
      .getAccount()
      .then(async (user) => {
        if (!!user) {
          console.log(user.uid);
          const clinet = await fireService.getUserById(user.uid, "users");
          dispatch(login(clinet));
        } else {
          console.log("no session found!");
        }
      })
      .catch((error) => {
        console.error("error", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return loading ? (
    <>
      <Loading />
    </>
  ) : (
    <div className="w-full h-full flex justify-center items-center">
      <Outlet />
      <ToastContainer position="bottom-right" />
    </div>
  );
}
