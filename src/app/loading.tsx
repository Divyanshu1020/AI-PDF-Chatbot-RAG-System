"use client"
import Loader from "@/components/global/loader";
import React from "react";

interface Props {
    state: boolean
}

const Loading = ({state=false}: Props) => {
  return (
    <div className="h-screen flex justify-center items-center">
      <Loader state={state}>...Loading</Loader>
    </div>
  );
};

export default Loading;
