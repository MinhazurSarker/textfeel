import "@/css/satoshi.css";
import "@/css/style.css";
import { getUserByToken } from "@/lib/actions/get/user";

import React from "react";
import Wrapper from "./Wrapper";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, token } = await getUserByToken();

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          <Wrapper token={token} user={user}>
            {children}
          </Wrapper>
        </div>
      </body>
    </html>
  );
}
