"use client";

import { useState, useEffect } from "react";
import { Note } from "@/lib/db/schema/notes";
import { NotesPanel } from "@/components/notes/notes-panel";
import { ChatPanel } from "@/components/chat/chat-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StickyNote, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { ErrorBoundary } from "@/components/error-boundary";

interface MainLayoutProps {
  initialNotes: Note[];
}

export function MainLayout({ initialNotes }: MainLayoutProps) {
  const [isMobileNotesOpen, setIsMobileNotesOpen] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <ErrorBoundary>
      {/* Desktop Layout */}
      <div className="hidden h-screen md:flex">
        <div className="w-[320px] border-r">
          <ErrorBoundary>
            <NotesPanel notes={initialNotes} />
          </ErrorBoundary>
        </div>
        <div className="flex-1">
          <ErrorBoundary>
            <ChatPanel />
          </ErrorBoundary>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex h-screen flex-col md:hidden">
        {!isMounted ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <Tabs
            defaultValue="notes"
            className="flex h-full flex-col"
            onValueChange={(value) => setIsMobileNotesOpen(value === "notes")}
          >
            <div className="border-b">
              <TabsList className="w-full justify-start rounded-none border-b-0 bg-transparent p-0">
                <TabsTrigger
                  value="notes"
                  className={cn(
                    "relative rounded-none border-b-2 border-transparent px-4 py-3 font-medium",
                    "data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  )}
                >
                  <StickyNote className="mr-2 h-4 w-4" />
                  Note
                </TabsTrigger>
                <TabsTrigger
                  value="chat"
                  className={cn(
                    "relative rounded-none border-b-2 border-transparent px-4 py-3 font-medium",
                    "data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  )}
                >
                  <Bot className="mr-2 h-4 w-4" />
                  AI Chat
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="notes" className="mt-0 flex-1 overflow-hidden">
              <ErrorBoundary>
                <NotesPanel notes={initialNotes} />
              </ErrorBoundary>
            </TabsContent>
            <TabsContent value="chat" className="mt-0 flex-1 overflow-hidden">
              <ErrorBoundary>
                <ChatPanel />
              </ErrorBoundary>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </ErrorBoundary>
  );
}
