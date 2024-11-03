import UserButton from "@/features/auth/components/UserButton";
import Image from "next/image";
import Link from "next/link";
import { FC, ReactNode } from "react";

interface StandaloneLayoutProps {
  children: ReactNode;
}

const StandaloneLayout: FC<StandaloneLayoutProps> = ({ children }) => {
  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center h-[73px]">
          <Link href={"/"}>
            <Image
              src={"/logo.svg"}
              alt="logo"
              width={48}
              height={48}
              className="mr-3"
            />
          </Link>
          <UserButton />
        </nav>
        <div className="flex flex-col items-center justify-center py-4">
          {children}
        </div>
      </div>
    </main>
  );
};

export default StandaloneLayout;
