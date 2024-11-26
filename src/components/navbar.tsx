"use client";
import { usePathname } from "next/navigation";
import UserButton from "@/features/auth/components/UserButton";
import MobileSidebar from "./mobileSidebar";

const pathnameMap = {
  tasks: {
    title: "Tasks",
    description: "View all of your tasks here",
  },
  projects: {
    title: "Projects",
    description: "View all of your projects here",
  },
};

const defaultMap = {
  title: "Home",
  description: "Monitor all your projects and tasks here",
};

const Navbar = () => {
  const pathname = usePathname();
  const pathnameParts = pathname.split("/");
  const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap;
  const { title, description } = pathnameMap[pathnameKey] ?? defaultMap;

  return (
    <nav className="pt-4 px-6 flex items-center justify-between">
      <div className="flex-col hidden lg:flex">
        <h1 className="font-semibold text-2xl">{title}</h1>
        <p className="text-muted-foreground ">{description}</p>
      </div>

      <MobileSidebar />
      <UserButton />
    </nav>
  );
};

export default Navbar;
