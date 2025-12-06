"use client";

import { useState, useEffect } from "react";
import { Note } from "@/lib/db/schema/notes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Pin, Trash2, Edit2 } from "lucide-react";
import { togglePinNote, deleteNote } from "@/lib/actions/notes";
import { cn } from "@/lib/utils";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
}

export function NoteCard({ note, onEdit }: NoteCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPinning, setIsPinning] = useState(false);
  const [formattedDate, setFormattedDate] = useState<string>("");

  const handleDelete = async () => {
    if (confirm("Sei sicuro di voler eliminare questa nota?")) {
      setIsDeleting(true);
      await deleteNote(note.id);
      setIsDeleting(false);
    }
  };

  const handleTogglePin = async () => {
    setIsPinning(true);
    await togglePinNote(note.id);
    setIsPinning(false);
  };

  useEffect(() => {
    setFormattedDate(
      new Intl.DateTimeFormat("it-IT", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(note.updatedAt))
    );
  }, [note.updatedAt]);

  return (
    <Card
      className={cn(
        "group relative transition-all hover:shadow-md",
        note.isPinned && "ring-2 ring-primary/20"
      )}
      style={{
        backgroundColor: note.color || "#ffffff",
      }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-1 text-base font-medium">
            {note.isPinned && (
              <Pin className="mr-1 inline-block h-3 w-3 text-primary" />
            )}
            {note.title}
          </CardTitle>
          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handleTogglePin}
                    disabled={isPinning}
                  >
                    <Pin
                      className={cn(
                        "h-3.5 w-3.5",
                        note.isPinned && "fill-current"
                      )}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {note.isPinned ? "Rimuovi pin" : "Fissa"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onEdit(note)}
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Modifica</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Elimina</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {note.content}
        </p>
        {note.tags && note.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {note.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        <p className="mt-3 text-xs text-muted-foreground/70">
          {formattedDate}
        </p>
      </CardContent>
    </Card>
  );
}
