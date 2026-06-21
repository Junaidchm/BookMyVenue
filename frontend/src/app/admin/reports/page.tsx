"use client";

import { BarChart2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ReportsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 rounded-2xl bg-primary-container/15 flex items-center justify-center mb-6">
        <BarChart2 className="w-10 h-10 text-primary-container" />
      </div>
      <h1 className="text-headline-md text-on-surface mb-3">Reports Coming Soon</h1>
      <p className="text-text-muted text-body-md max-w-md mb-8">
        We&apos;re building powerful analytics and reporting tools to give you deeper
        insights into platform performance, revenue trends, and user behavior.
      </p>
      <div className="flex gap-3">
        <Button asChild variant="outline" className="border-border-subtle hover:bg-surface-container-low">
          <Link href="/admin">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
      <div className="mt-12 flex items-center gap-2 text-xs text-text-muted">
        <span className="w-2 h-2 rounded-full bg-status-warning-text animate-pulse" />
        Under active development
      </div>
    </div>
  );
}
