"use client";

import { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Node,
  Edge,
  MarkerType,
  NodeProps,
  Handle,
  Position,
  ReactFlowProvider,
  useReactFlow,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { FloatingEdge } from "./floating-edge";
import { cn } from "@/lib/utils";
import { Search, FileText } from "lucide-react";

interface RagResult {
  id: string;
  content: string;
  similarity?: number;
  metadata?: Record<string, unknown>;
}

interface RagResultsFlowProps {
  query: string;
  results: RagResult[];
  className?: string;
}

function QueryNode({ data }: NodeProps) {
  return (
    <div className="px-4 py-3 rounded-lg bg-primary text-primary-foreground shadow-lg border-2 border-primary min-w-[150px] max-w-[250px]">
      <Handle type="target" position={Position.Top} id="top" className="!opacity-0" />
      <Handle type="target" position={Position.Bottom} id="bottom" className="!opacity-0" />
      <Handle type="target" position={Position.Left} id="left" className="!opacity-0" />
      <Handle type="target" position={Position.Right} id="right" className="!opacity-0" />
      <div className="flex items-center gap-2 mb-1">
        <Search className="h-4 w-4 shrink-0" />
        <span className="text-xs font-semibold uppercase tracking-wide">Query</span>
      </div>
      <p className="text-sm font-medium line-clamp-3">{data.label as string}</p>
    </div>
  );
}

function ResultNode({ data }: NodeProps) {
  const similarity = data.similarity as number | undefined;
  const similarityPercent = similarity ? Math.round(similarity * 100) : null;

  return (
    <div className="px-3 py-2 rounded-lg bg-card text-card-foreground shadow-md border min-w-[120px] max-w-[200px] hover:shadow-lg transition-shadow">
      <Handle type="source" position={Position.Top} id="top" className="!opacity-0" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="!opacity-0" />
      <Handle type="source" position={Position.Left} id="left" className="!opacity-0" />
      <Handle type="source" position={Position.Right} id="right" className="!opacity-0" />
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-1">
          <FileText className="h-3 w-3 text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground">Result</span>
        </div>
        {similarityPercent !== null && (
          <span className={cn(
            "text-xs font-medium px-1.5 py-0.5 rounded",
            similarityPercent >= 80 ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" :
            similarityPercent >= 60 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" :
            "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
          )}>
            {similarityPercent}%
          </span>
        )}
      </div>
      <p className="text-xs line-clamp-4">{data.label as string}</p>
    </div>
  );
}

const nodeTypes = {
  query: QueryNode,
  result: ResultNode,
};

const edgeTypes = {
  floating: FloatingEdge,
};

function Flow({ initialNodes, initialEdges }: { initialNodes: Node[]; initialEdges: Edge[] }) {
  const { fitView } = useReactFlow();
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const onNodesChangeHandler = (changes: { type: string; id?: string }[]) => {
    onNodesChange(changes as Parameters<typeof onNodesChange>[0]);
    const hasDimensionChange = changes.some((c) => c.type === 'dimensions');
    if (hasDimensionChange) {
      fitView({ padding: 0.2 });
    }
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChangeHandler}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      proOptions={{ hideAttribution: true }}
      nodesDraggable={true}
      nodesConnectable={false}
      elementsSelectable={true}
      panOnDrag={true}
      panOnScroll={true}
      zoomOnScroll={true}
      zoomOnPinch={true}
      zoomOnDoubleClick={false}
      preventScrolling={true}
    >
      <Background color="hsl(var(--muted-foreground))" gap={16} size={1} />
    </ReactFlow>
  );
}

function RagResultsFlowInner({ query, results, className }: RagResultsFlowProps) {
  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    nodes.push({
      id: "query",
      type: "query",
      position: { x: 0, y: 0 },
      data: { label: query },
    });

    const radius = 200;
    const angleStep = (2 * Math.PI) / Math.max(results.length, 1);

    results.forEach((result, index) => {
      const angle = angleStep * index - Math.PI / 2;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      const nodeId = `${result.id}-${index}`;

      nodes.push({
        id: nodeId,
        type: "result",
        position: { x, y },
        data: {
          label: result.content.slice(0, 150) + (result.content.length > 150 ? "..." : ""),
          similarity: result.similarity,
          metadata: result.metadata,
        },
      });

      edges.push({
        id: `edge-${nodeId}`,
        source: nodeId,
        target: "query",
        type: "floating",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 15,
          height: 15,
        },
        style: {
          strokeWidth: 2,
          stroke: result.similarity && result.similarity >= 0.8
            ? "hsl(var(--primary))"
            : "hsl(var(--muted-foreground))",
        },
      });
    });

    return { nodes, edges };
  }, [query, results]);

  return (
    <div className={cn("h-[350px] w-full rounded-lg border bg-background", className)}>
      <ReactFlowProvider>
        <Flow initialNodes={nodes} initialEdges={edges} />
      </ReactFlowProvider>
    </div>
  );
}

export function RagResultsFlow({ query, results, className }: RagResultsFlowProps) {
  if (results.length === 0) {
    return (
      <div className={cn("flex items-center justify-center h-[300px] text-muted-foreground", className)}>
        No results found
      </div>
    );
  }

  return <RagResultsFlowInner query={query} results={results} className={className} />;
}
