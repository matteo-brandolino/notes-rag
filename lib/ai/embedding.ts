import { embed, embedMany } from 'ai';
import { db } from '../db';
import { cosineDistance, desc, gt, sql, eq } from 'drizzle-orm';
import { embeddings } from '../db/schema/embeddings';
import { notes } from '../db/schema/notes';
import { openai } from '@/lib/ai/provider';

const embeddingModel = openai.textEmbeddingModel('text-embedding-ada-002');

const generateChunks = (input: string): string[] => {
  const trimmed = input.trim();
  if (!trimmed) return [];

  const chunks = trimmed
    .split(/\.(?:\s|$)/)
    .map(chunk => chunk.trim())
    .filter(chunk => chunk.length > 0);

  return chunks.length === 0 ? [trimmed] : chunks;
};

export const generateEmbeddings = async (
  value: string,
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(value);
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll('\\n', ' ');
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
};

export const findAllRelevantContent = async (userQuery: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery);
  const similarity = sql<number>`1 - (${cosineDistance(
    embeddings.embedding,
    userQueryEmbedded,
  )})`;

  const results = await db
    .select({
      content: embeddings.content,
      similarity,
      noteId: embeddings.noteId,
      resourceId: embeddings.resourceId,
      noteTitle: notes.title,
    })
    .from(embeddings)
    .leftJoin(notes, eq(embeddings.noteId, notes.id))
    .where(gt(similarity, 0.5))
    .orderBy(t => desc(t.similarity))
    .limit(8);

  return {
    resources: results.filter(r => r.resourceId !== null),
    notes: results.filter(r => r.noteId !== null),
  };
};