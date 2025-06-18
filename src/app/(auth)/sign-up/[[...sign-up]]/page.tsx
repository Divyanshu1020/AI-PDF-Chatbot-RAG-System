"use client"
import { SignUp } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from '@clerk/themes'

const Page = () => {
  const { theme } = useTheme();
  console.log("theme",theme)
  return <div className="flex items-center justify-center min-h-[calc(100vh-64px)] mt-[64px] border-t">
  <SignUp
   appearance={{
    baseTheme: dark
  }}
  />
</div>;
};

export default Page;