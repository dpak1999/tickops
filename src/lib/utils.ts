import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import ShortUniqueId from "short-unique-id";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateInviteCode(length: number) {
  const uniqueId = new ShortUniqueId({ length: length || 10 });
  return uniqueId.randomUUID();
}

export function snakeCaseToTitleCase(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
