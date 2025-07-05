import { Suspense } from "react";
import {BarLoader} from "react-spinners";
import {Outlet} from "react-router-dom";
import Header from "../pages/Header";
export default function DashboardLayout() {


  return (
    <>
    <div className="fixed top-0 left-0 right-0 z-50">
    <Header />
    </div>
    <div className="container mx-auto px-5 min-h-screen mt-14">
      
      <div className="flex items-center justify-between mb-5">
        
      </div>
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
        <Outlet />
      </Suspense>
    </div>
    </>
  );
}
