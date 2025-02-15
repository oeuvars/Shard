import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDuration = (duration: number) => {
   const minutes = Math.floor(duration / 60000)
   const seconds = Math.floor((duration % 60000) / 1000)

   return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export const snakeToTitle = (str: string) => {
   return str.replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase());
}

export function formatDate(date: Date): string {
   const day = date.getDate();
   const ordinal = getOrdinalSuffix(day);

   const month = date.toLocaleString('default', { month: 'long' }).toLowerCase();

   const year = date.getFullYear();

   return `${day}${ordinal} ${snakeToTitle(month)} ${year}`;
 }

 function getOrdinalSuffix(day: number): string {
   if (day >= 11 && day <= 13) {
     return 'th';
   }

   switch (day % 10) {
     case 1: return 'st';
     case 2: return 'nd';
     case 3: return 'rd';
     default: return 'th';
   }
 }
