import { createResource } from "@/lib/actions/resources";
import {
  convertToModelMessages,
  streamText,
  tool,
  UIMessage,
  stepCountIs,
} from "ai";
import { z } from "zod";
import { openai } from "@/lib/ai/provider";
import { findAllRelevantContent } from "@/lib/ai/embedding";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    system: `You are a helpful assistant with access to a knowledge base and user's personal notes.
    Check your knowledge base and user notes before answering any questions.
    Only respond to questions using information from tool calls.
    When information comes from user notes, mention that it's from their personal notes.
    If no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools: {
      addResource: tool({
        description: `add a resource to your knowledge base.
          If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
        inputSchema: z.object({
          content: z
            .string()
            .describe("the content or resource to add to the knowledge base"),
        }),
        execute: async ({ content }) => createResource({ content }),
      }),
      search: tool({
        description: `search through the knowledge base and user's personal notes to find relevant information.
          Always use this tool to answer questions. Results include both resources and user notes.`,
        inputSchema: z.object({
          query: z.string().describe("the search query"),
        }),
        execute: async ({ query }) => findAllRelevantContent(query),
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
