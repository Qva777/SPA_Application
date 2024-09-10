import { Outlet } from "react-router-dom";
import Navbar from "@/components/shared/Navbar";

export default function RootLayout() {
  return (
    <div className=" h-full relative">
      <div className=" h-screen">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
}
