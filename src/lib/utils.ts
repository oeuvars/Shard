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


 export function formatDistanceToNow(date: Date | number | string, options?: { addSuffix?: boolean }): string {
  const now = new Date();
  const inputDate = new Date(date);

  const diffInSeconds = Math.round((now.getTime() - inputDate.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  const units = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  let relativeTime = "";

  for (const unit in units) {
    const divisor = units[unit as keyof typeof units];
    if (Math.abs(diffInSeconds) >= divisor || unit === 'second') {
      const value = Math.round(diffInSeconds / divisor);
      console.log("first", relativeTime)
      relativeTime = rtf.format(value, unit as Intl.RelativeTimeFormatUnit);
      relativeTime = relativeTime.replace("in ", "");
      break;
    }
  }

  if (options && options.addSuffix) {
    if (diffInSeconds < 0) {
      relativeTime = relativeTime;
    } else {
      relativeTime += " ago";
      console.log("third", relativeTime)
    }
  }

  return relativeTime;
}
