import Image from "next/image";
import Link from "next/link";
import React from "react";
import DottedSeparator from "./dotted";
import Navigation from "./navigation";

const Sidebar = () => {
  return (
    <aside className="h-full bg-neutral-100 p-4 w-full">
      <Link href={"/"}>
        <div className="flex flex-row items-center">
          <Image
            src={"/logo.svg"}
            alt="logo"
            width={30}
            height={30}
            className="mr-3"
          />
          <span className="font-bold text-2xl text-neutral-700">Tickops</span>
        </div>
      </Link>

      <DottedSeparator className="my-4" />

      <Navigation />
    </aside>
  );
};

export default Sidebar;
