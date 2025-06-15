import { SignUp } from "@clerk/nextjs";
import React from "react";

type Props = {};

const Page = (props: Props) => {
  return <div className="flex items-center justify-center h-screen">
  <SignUp />
</div>;
};

export default Page;
