import { Outlet } from "react-router-dom";

import Chats from "./chats";

function ChatsLayout() {
  return (
    <>
      <Chats />
      <Outlet />
    </>
  );
}

export default ChatsLayout;
