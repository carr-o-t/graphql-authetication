"use client";

import Button from "@mui/material/Button";
import Link from "next/link";

interface BackButtonProps {
  href: string;
  label: string;
}

export const BackButton = ({ href, label }: BackButtonProps) => {
  return (
    <Button
      variant="text"
      className="font-normal w-full"
      size="small"
      style={{
        width: "100%",
        fontSize: "13px",
        textTransform: "capitalize",
        color: "#1976d2",
      }}
    >
      <Link href={href} style={{ color: "#1976d2" }}>
        {label}
      </Link>
    </Button>
  );
};
