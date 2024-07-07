import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ChatApp from "./Components/ChatApp.jsx";
import Login from "./Components/Login.jsx";
import SignUp from "./Components/SignUp.jsx";
import { Provider } from "react-redux";
import store from "./Store/store.js";
import "react-toastify/dist/ReactToastify.css";
import AuthProtector from "./Components/AuthProtector.jsx";
import ChatBox from "./Components/ChatBox.jsx";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <AuthProtector authentication={true}>
            <ChatApp />
          </AuthProtector>
        ),
        children: [
          {
            path: "/",
            element: (
              <div className="px-2 col-span-6 b-right overflow-hidden flex flex-col justify-center items-center">
                <div className="text-lg">Welcome 👋
                  TODO: MAKE THIS MORE BUTIFUL
                </div>
              </div>
            ),
          },
          {
            path: "/user/:id",

            element: (
                <ChatBox />
            ),
          },
        ],
      },
      {
        path: "/login",
        element: (
          <AuthProtector authentication={false}>
            <Login />
          </AuthProtector>
        ),
      },
      {
        path: "/register",
        element: (
          <AuthProtector authentication={false}>
            <SignUp />
          </AuthProtector>
        ),
      },
    ],
  },

  { path: "*", element: <h1 className="bg-blue-400">Not found</h1> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={routes} />
    </Provider>
  </React.StrictMode>
);
