"use client";

import { useState } from "react";
import { Note } from "@/lib/db/schema/notes";
import { NotesPanel } from "@/components/notes/notes-panel";
import { ChatPanel } from "@/components/chat/chat-panel";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StickyNote, Bot, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  initialNotes: Note[];
}

export function MainLayout({ initialNotes }: MainLayoutProps) {
  const [isMobileNotesOpen, setIsMobileNotesOpen] = useState(true);

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden h-screen md:block">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={40} minSize={30} maxSize={60}>
            <NotesPanel notes={initialNotes} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={60} minSize={40}>
            <ChatPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Mobile Layout */}
      <div className="flex h-screen flex-col md:hidden">
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
            <NotesPanel notes={initialNotes} />
          </TabsContent>
          <TabsContent value="chat" className="mt-0 flex-1 overflow-hidden">
            <ChatPanel />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
