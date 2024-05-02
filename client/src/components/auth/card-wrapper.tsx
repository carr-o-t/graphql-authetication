"use client";

import { cn } from "@/lib/utils";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { Poppins } from "next/font/google";
import { BackButton } from "./back-button";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  headerHeading: string;
  backButtonLabel: string;
  backButtonHref: string;
}

export const CardWrapper = ({
  children,
  headerLabel,
  headerHeading,
  backButtonLabel,
  backButtonHref,
}: CardWrapperProps) => {
  return (
    <Card
      className="w-[400px] shadow-md"
      style={{
        maxWidth: "512px",
        width: "100%",
        background: "#1c1c1cfb",
        color: "white",
      }}
    >
      <div
        className="w-full flex flex-col gap-y-4 items-center justify-center"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem", // Adjust gap size as needed
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        <h1
          className={cn("text-3xl font-semibold", font.className)}
          style={{
            fontSize: "1.875rem",
            lineHeight: "2.25rem",
            fontWeight: "600",
            margin: 0,
          }}
        >
          {headerHeading}
        </h1>
        <p
          className="text-muted-foreground text-sm"
          style={{
            margin: 0,
            fontSize: "0.875rem",
            lineHeight: "1.25rem",
            color: "hsl(215 20.2% 65.1%)",
          }}
        >
          {headerLabel}
        </p>
      </div>
      <CardContent>{children}</CardContent>
      <CardActions>
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardActions>
    </Card>
  );
};
