"use client"
import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

const Page = () => {
  const { theme } = useTheme();
  console.log("theme",theme)
  return <div className="flex items-center justify-center min-h-[calc(100vh-64px)] mt-[64px] border-t">
    <SignIn
   appearance={{
    baseTheme: theme === "dark" ? dark : undefined,
  }}
  />
</div>;
};

export default Page;