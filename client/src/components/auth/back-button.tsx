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
        color: "#a1a1aa",
      }}
    >
      <Link href={href} style={{ color: "#a1a1aa" }}>
        {label}
      </Link>
    </Button>
  );
};
