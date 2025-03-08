"use client";
import { Provider, useSelector } from "react-redux";
import { store } from "@/redux/store";
import { useState } from "react";
import { Header, Rightbar, Sidebar } from ".";

export default function RootLayoutClient({ children }) {
  return (
    <Provider store={store}>
      <LayoutWrapper>{children}</LayoutWrapper>
    </Provider>
  );
}

function LayoutWrapper({ children }) {
  const [isSidebar, setisSidebar] = useState(false);
  const toggleSidebar = () => {
    setisSidebar(!isSidebar);
  }
  return (
    <>
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex w-full h-full">
        <Sidebar isSidebar={isSidebar} />
        <div className="flex flex-col flex-1 max-w-full overflow-hidden">
          {children}
        </div>
        <Rightbar />
      </div>
    </>
  )
}