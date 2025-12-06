"use client";

import { useState } from "react";
import { Note } from "@/lib/db/schema/notes";
import { NoteCard } from "./note-card";
import { NoteEditor } from "./note-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Search, StickyNote } from "lucide-react";

interface NotesPanelProps {
  notes: Note[];
}

export function NotesPanel({ notes }: NotesPanelProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleNewNote = () => {
    setEditingNote(null);
    setIsEditorOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const pinnedNotes = filteredNotes.filter((note) => note.isPinned);
  const unpinnedNotes = filteredNotes.filter((note) => !note.isPinned);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <StickyNote className="h-5 w-5" />
            <h2 className="text-lg font-semibold">My Notes</h2>
          </div>
          <Button onClick={handleNewNote} size="sm">
            <Plus className="mr-1 h-4 w-4" />
            New
          </Button>
        </div>
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="pl-9"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <StickyNote className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="text-lg font-medium">No Notes</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Create your first note to get started
              </p>
              <Button onClick={handleNewNote} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Create Note
              </Button>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="text-lg font-medium">No Results</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try a different search
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pinnedNotes.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-medium uppercase text-muted-foreground">
                    Pinned
                  </h3>
                  <div className="grid gap-3">
                    {pinnedNotes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onEdit={handleEditNote}
                      />
                    ))}
                  </div>
                </div>
              )}

              {unpinnedNotes.length > 0 && (
                <div className="space-y-2">
                  {pinnedNotes.length > 0 && (
                    <h3 className="text-xs font-medium uppercase text-muted-foreground">
                      Other Notes
                    </h3>
                  )}
                  <div className="grid gap-3">
                    {unpinnedNotes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onEdit={handleEditNote}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
      <NoteEditor
        note={editingNote}
        open={isEditorOpen}
        onOpenChange={setIsEditorOpen}
      />
    </div>
  );
}
