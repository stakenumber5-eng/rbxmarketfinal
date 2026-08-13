import "./globals.css";
import type { ReactNode } from "react";
export const metadata = { title:"RBLX Store", description:"Robux, Adopt Me and MM2 marketplace" };
export default function RootLayout({children}:{children:ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}
