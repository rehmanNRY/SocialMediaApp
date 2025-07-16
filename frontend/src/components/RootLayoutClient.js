"use client";
import { Provider, useSelector } from "react-redux";
import { store } from "@/redux/store";
import { useState } from "react";
import { Header, Rightbar, Sidebar } from ".";
import LoadingProvider from "./LoadingProvider";
import ModalPortal from "./common/ModalPortal";

export default function RootLayoutClient({ children }) {
  return (
    <Provider store={store}>
      <LoadingProvider>
        <LayoutWrapper>{children}</LayoutWrapper>
        <ModalPortal />
      </LoadingProvider>
    </Provider>
  );
}

function LayoutWrapper({ children }) {
  const [isSidebar, setisSidebar] = useState(false);
  const toggleSidebar = () => {
    setisSidebar(!isSidebar);
  }
  const closeSidebar = () => {
    setisSidebar(false);
  }
  return (
    <>
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex w-full h-full">
        <Sidebar isSidebar={isSidebar} onClose={closeSidebar} />
        <div className="flex flex-col flex-1 max-w-full overflow-hidden">
          {children}
        </div>
        <Rightbar />
      </div>
    </>
  )
}