"use client";
import Navbar from "./layout/Navbar";
import Rightbar from "./layout/Rightbar";
import Sidebar from "./layout/Sidebar";
import { Provider, useSelector } from "react-redux";
import { store } from "@/redux/store";

export default function RootLayoutClient({ children }) {
  return (
    <Provider store={store}>
      <LayoutWrapper>{children}</LayoutWrapper>
    </Provider>
  );
}

function LayoutWrapper({ children }) {
  // const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  return (
    <>
      <Navbar />
      <div className="flex w-full h-full">
        <Sidebar />
        <div className="flex flex-col flex-1">
          {children}
        </div>
        <Rightbar />
      </div>
    </>
  )
}