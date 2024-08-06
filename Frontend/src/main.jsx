import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { RoomProvider } from "./components/RoomContext";

import SignUp from "./components/signUp";
import Login from "./components/Login";
import ChatsLayout from "./components/chatsLayout";
import CreateRoom from "./components/createRoom";
import JoinRoom from "./components/joinRoom";
import Room from "./components/room";
import "./index.css";
import RootLayout from "./components/RootLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/signup", element: <SignUp /> },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/chats",
    element: <ChatsLayout />,
    children: [
      { path: "/chats/create-room", element: <CreateRoom /> },
      { path: "/chats/join-room", element: <JoinRoom /> },
    ],
  },
  {
    path: "/room",
    element: <Room />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RoomProvider>
      <RouterProvider router={router} />
    </RoomProvider>
  </React.StrictMode>
);
