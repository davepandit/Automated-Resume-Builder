import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        // Core Styles: Increased height, rounder corners (rounded-lg), subtle shadow
        "flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base ring-offset-background transition-all duration-200 shadow-sm",

        // File, Placeholder, Disabled: Same good practices
        "file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50",

        // Focus State: Clearer ring and border color
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 focus-visible:border-indigo-500",

        // Dark Mode Support
        "dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-indigo-400 dark:focus-visible:border-indigo-400",

        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
