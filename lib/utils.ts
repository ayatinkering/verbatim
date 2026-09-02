import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format duration in seconds to a human readable string like "18h 24m" or "45m".
 */
export function formatDuration(secondsOrMinutes: number, isMinutes = false): string {
  const totalSeconds = isMinutes ? secondsOrMinutes * 60 : secondsOrMinutes;
  if (!totalSeconds || totalSeconds <= 0) return "0m";

  const totalMinutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  return `${minutes}m`;
}

/**
 * Format student count (e.g. 18240 -> "18.2k students", 2100 -> "2.1k students")
 */
export function formatStudentCount(count?: number): string {
  if (!count) return "0 students";
  if (count >= 1000) {
    const formatted = (count / 1000).toFixed(1).replace(/\.0$/, "");
    return `${formatted}k students`;
  }
  return `${count} students`;
}
