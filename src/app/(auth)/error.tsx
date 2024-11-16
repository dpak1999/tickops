"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

const ErrorPage = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-y-4">
      <AlertTriangle className="size-10 text-destructive" />
      <p className="text-sm text-muted-foreground">Something went wrong</p>

      <Button variant="secondary">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
};

export default ErrorPage;
