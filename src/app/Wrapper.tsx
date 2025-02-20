"use client";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const AppContext = React.createContext<{
  user: User | null | undefined;
  token: string | null | undefined;
}>({
  user: null,
  token: null,
});

export default function Wrapper({
  children,
  token,
  user,
}: {
  children: React.ReactNode;
  token: string | null | undefined;
  user: User | null | undefined;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    if (!token || !user || user?.role !== "admin") {
      router.push("/login");
    }
    return () => {};
  }, [user, token]);

  return (
    <AppContext.Provider value={{ user, token }}>
      {["/login", "/register", "/404"].includes(pathname) ? (
        <>{children}</>
      ) : (
        <React.Fragment>
          {/* <!-- ===== Page Wrapper Start ===== --> */}
          <div className="flex">
            {/* <!-- ===== Sidebar Start ===== --> */}
            <Sidebar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
            {/* <!-- ===== Sidebar End ===== --> */}

            {/* <!-- ===== Content Area Start ===== --> */}
            <div className="relative flex flex-1 flex-col lg:ml-72.5">
              {/* <!-- ===== Header Start ===== --> */}
              <Header
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
              {/* <!-- ===== Header End ===== --> */}

              {/* <!-- ===== Main Content Start ===== --> */}
              <main>
                <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                  {children}
                </div>
              </main>
              {/* <!-- ===== Main Content End ===== --> */}
            </div>
            {/* <!-- ===== Content Area End ===== --> */}
          </div>
          {/* <!-- ===== Page Wrapper End ===== --> */}
        </React.Fragment>
      )}
      <Toaster />
    </AppContext.Provider>
  );
}
export const useAppCntext = () => React.useContext(AppContext);
