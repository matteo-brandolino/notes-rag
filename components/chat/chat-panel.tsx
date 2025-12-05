"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Send, Bot, User, Loader2, Search, BookOpen, StickyNote } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChatPanel() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();
  const isLoading = status === "streaming" || status === "submitted";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  };

  const getToolIcon = (toolType: string) => {
    if (toolType.includes("Notes") || toolType.includes("notes")) {
      return <StickyNote className="h-3 w-3" />;
    }
    if (toolType.includes("All") || toolType.includes("searchAll")) {
      return <Search className="h-3 w-3" />;
    }
    return <BookOpen className="h-3 w-3" />;
  };

  const getToolLabel = (toolType: string) => {
    const labels: Record<string, string> = {
      "tool-addResource": "Aggiunta risorsa",
      "tool-search": "Ricerca",
    };
    return labels[toolType] || toolType;
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <h2 className="text-lg font-semibold">AI Assistant</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Cerca nelle tue note e nella knowledge base
        </p>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bot className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="text-lg font-medium">Inizia una conversazione</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Fai domande sulle tue note o aggiungi nuove informazioni alla
                knowledge base
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
                  Cosa c'è nelle mie note?
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
                  Riassumi le mie note
                </Badge>
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex gap-3",
                  m.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {m.role !== "user" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] space-y-2",
                    m.role === "user" && "text-right"
                  )}
                >
                  {m.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <Card
                            key={i}
                            className={cn(
                              "inline-block px-4 py-2",
                              m.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            )}
                          >
                            <p className="whitespace-pre-wrap text-sm">
                              {part.text}
                            </p>
                          </Card>
                        );
                      case "tool-addResource":
                      case "tool-search":
                        return (
                          <div key={i} className="space-y-1">
                            <Badge
                              variant="secondary"
                              className="gap-1 text-xs"
                            >
                              {getToolIcon(part.type)}
                              {part.state === "output-available"
                                ? getToolLabel(part.type)
                                : `${getToolLabel(part.type)}...`}
                              {part.state !== "output-available" && (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              )}
                            </Badge>
                            {part.state === "output-available" && part.output != null && (
                              <Card className="bg-muted/50 p-2">
                                <pre className="max-h-32 overflow-auto text-xs">
                                  {typeof part.output === "string"
                                    ? part.output
                                    : JSON.stringify(part.output, null, 2)}
                                </pre>
                              </Card>
                            )}
                          </div>
                        );
                      default:
                        return null;
                    }
                  })}
                </div>
                {m.role === "user" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))
          )}
          {isLoading && messages.length > 0 && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <Card className="inline-block bg-muted px-4 py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Scrivi un messaggio..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
