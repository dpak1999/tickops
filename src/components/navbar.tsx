import UserButton from "@/features/auth/components/UserButton";
import MobileSidebar from "./mobileSidebar";

const Navbar = () => {
  return (
    <nav className="pt-4 px-6 flex items-center justify-between">
      <div className="flex-col hidden lg:flex">
        <h1 className="font-semibold text-2xl">Home</h1>
        <p className="text-muted-foreground ">
          Monitor all your projects and tasks here
        </p>
      </div>

      <MobileSidebar />
      <UserButton />
    </nav>
  );
};

export default Navbar;
