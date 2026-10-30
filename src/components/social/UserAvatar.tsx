import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { FiUser } from "react-icons/fi";

interface UserAvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: "h-7 w-7",
  md: "h-8 w-8",
  lg: "h-[72px] w-[72px]",
};

const sizePixels = {
  sm: 28,
  md: 32,
  lg: 72,
};

const iconSizes = {
  sm: "h-4 w-4",
  md: "h-4 w-4",
  lg: "h-8 w-8",
};

export function UserAvatar({ src, name, size = "md", className }: UserAvatarProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={sizePixels[size]}
        height={sizePixels[size]}
        className={cn("rounded-full", sizeStyles[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-amber-500 text-white",
        sizeStyles[size],
        className,
      )}
    >
      <FiUser className={iconSizes[size]} />
    </div>
  );
}
