"use client";

import Link from "next/link";
import Button from "@mui/material/Button";

export default function Home() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between p-24"
      style={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: "6rem",
        gap: "1rem",
      }}
    >
      <Button variant="outlined">
        <Link href="/auth/signup">register</Link>
      </Button>
      <Button variant="outlined">
        <Link href="/auth/login">login</Link>
      </Button>
      <Button variant="outlined">
        <Link href="/dashboard">Dashboard</Link>
      </Button>
    </main>
  );
}
