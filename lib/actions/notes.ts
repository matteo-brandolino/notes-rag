"use server";

import { eq, desc, sql } from "drizzle-orm";
import { db } from "../db";
import {
  notes,
  insertNoteSchema,
  updateNoteSchema,
  NewNoteParams,
  UpdateNoteParams,
  Note,
} from "../db/schema/notes";
import { embeddings } from "../db/schema/embeddings";
import { generateEmbeddings } from "../ai/embedding";
import { revalidatePath } from "next/cache";

async function syncNoteEmbeddings(noteId: string, title: string, content: string) {
  await db.delete(embeddings).where(eq(embeddings.noteId, noteId));

  const generatedEmbeddings = await generateEmbeddings(`${title}. ${content}`);
  if (generatedEmbeddings.length > 0) {
    await db.insert(embeddings).values(
      generatedEmbeddings.map((emb) => ({
        noteId,
        content: emb.content,
        embedding: emb.embedding,
      }))
    );
  }
}

export const createNote = async (
  input: NewNoteParams
): Promise<{ success: boolean; note?: Note; error?: string }> => {
  try {
    const validatedInput = insertNoteSchema.parse(input);

    const [note] = await db
      .insert(notes)
      .values({
        title: validatedInput.title,
        content: validatedInput.content,
        tags: validatedInput.tags || [],
        isPinned: validatedInput.isPinned || false,
        color: validatedInput.color || "#ffffff",
      })
      .returning();

    try {
      await syncNoteEmbeddings(note.id, note.title, note.content);
    } catch (embeddingError) {
      console.error("Error generating embeddings:", embeddingError);
    }

    revalidatePath("/");
    return { success: true, note };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error creating note",
    };
  }
};

export const updateNote = async (
  id: string,
  input: UpdateNoteParams
): Promise<{ success: boolean; note?: Note; error?: string }> => {
  try {
    const validatedInput = updateNoteSchema.parse(input);

    const [note] = await db
      .update(notes)
      .set({
        ...validatedInput,
        updatedAt: sql`now()`,
      })
      .where(eq(notes.id, id))
      .returning();

    if (!note) {
      return { success: false, error: "Note not found" };
    }

    if (validatedInput.title !== undefined || validatedInput.content !== undefined) {
      await syncNoteEmbeddings(note.id, note.title, note.content);
    }

    revalidatePath("/");
    return { success: true, note };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error updating note",
    };
  }
};

export const deleteNote = async (
  id: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const [deleted] = await db
      .delete(notes)
      .where(eq(notes.id, id))
      .returning();

    if (!deleted) {
      return { success: false, error: "Note not found" };
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error deleting note",
    };
  }
};

export const getNotes = async (): Promise<Note[]> => {
  const allNotes = await db
    .select()
    .from(notes)
    .orderBy(desc(notes.isPinned), desc(notes.updatedAt));
  return allNotes;
};

export const getNote = async (id: string): Promise<Note | null> => {
  const [note] = await db.select().from(notes).where(eq(notes.id, id));
  return note || null;
};

export const togglePinNote = async (
  id: string
): Promise<{ success: boolean; note?: Note; error?: string }> => {
  try {
    const [existingNote] = await db
      .select()
      .from(notes)
      .where(eq(notes.id, id));

    if (!existingNote) {
      return { success: false, error: "Note not found" };
    }

    const [note] = await db
      .update(notes)
      .set({
        isPinned: !existingNote.isPinned,
        updatedAt: sql`now()`,
      })
      .where(eq(notes.id, id))
      .returning();

    revalidatePath("/");
    return { success: true, note };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error toggling pin",
    };
  }
};
