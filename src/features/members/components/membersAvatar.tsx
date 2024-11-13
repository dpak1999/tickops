import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { FC } from "react";

interface MembersAvatarProps {
  name: string;
  className?: string;
  fallbackClassname?: string;
}

const MembersAvatar: FC<MembersAvatarProps> = ({
  name,
  className,
  fallbackClassname,
}) => {
  return (
    <Avatar
      className={cn(
        "size-5 transition border border-neutral-300 rounded-full",
        className
      )}
    >
      <AvatarFallback
        className={cn(
          "bg-neutral-200 text-neutral-500 font-medium flex items-center justify-center",
          fallbackClassname
        )}
      >
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export default MembersAvatar;
