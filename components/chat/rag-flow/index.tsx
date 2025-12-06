"use client";

import dynamic from "next/dynamic";

export const RagResultsFlow = dynamic(
  () => import("./rag-results-flow").then((mod) => mod.RagResultsFlow),
  {
    ssr: false,
    loading: () => <div className="h-[350px] w-full rounded-lg border bg-background animate-pulse" />
  }
);

export { FloatingEdge } from "./floating-edge";
export { getEdgeParams } from "./utils";
