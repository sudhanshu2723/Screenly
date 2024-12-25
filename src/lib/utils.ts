import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
// used to combine mutiple className together
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const truncateString = (string: string, slice?: number) => {
  return string.slice(0, slice || 30) + '...'
}
