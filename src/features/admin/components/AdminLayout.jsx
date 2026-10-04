"use client";

import ConsoleShell from "../console/ConsoleShell";

/** Every admin page sits in the console shell. */
export default function AdminLayout({ children }) {
  return <ConsoleShell>{children}</ConsoleShell>;
}
