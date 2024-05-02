"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

type LabelProps = React.HTMLAttributes<HTMLLabelElement> &
  VariantProps<typeof labelVariants> & {
    children: React.ReactNode;
  };

const Label: React.FC<LabelProps> = ({ children, className, ...props }) => (
  <label className={cn(labelVariants(), className)} {...props}>
    {children}
  </label>
);
Label.displayName = "Label";

export { Label };
