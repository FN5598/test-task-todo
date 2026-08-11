import type { ReactNode } from "react";
import AuthTokenRefresher from "@/UI/AuthTokenRefresher";

export default function TasksLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      {children}
      <AuthTokenRefresher />
    </>
  );
}
