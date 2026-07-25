import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge class names with Tailwind classes
 * Uses clsx for conditional classes and twMerge for Tailwind-specific class merging
 * @param inputs - Class names to merge
 * @returns Merged class names string
 */
export const mergeCls = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};
