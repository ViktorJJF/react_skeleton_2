import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Re-export utilities for easy access
export * from "./dateUtils";
export * from "./searchUtils";
export * from "./formUtils";
export * from "./apiUtils";
