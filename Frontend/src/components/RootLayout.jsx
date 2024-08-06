import { Outlet } from "react-router-dom";
import App from "../App";

function RootLayout() {
  return <>
  <App />
  <Outlet />
  </>;
}

export default RootLayout;
