// components/ThemeProvider.tsx

"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
// The 'ThemeProviderProps' type is inferred correctly without a direct import.
// Or you can import it from the root if needed, but this is cleaner.

export function ThemeProvider({ 
  children, 
  ...props 
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}