/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Buffer } from "node:buffer";
import type { Ai } from "workers-ai";

export interface Env {
  AI: Ai;
  // Uncomment the following line if you want to use KV for indexing later.
  // MY_KV_NAMESPACE: KVNamespace;
}

/**
 * Placeholder: Retrieves an array of ArrayBuffers representing audio chunks.
 * Replace this with your actual logic to split or retrieve pre-chunked audio.
 */
async function getAudioChunks(): Promise<ArrayBuffer[]> {
  // For demonstration, fetch an entire audio file and split it into chunks.
  const URL = ""https://pub-dbcf9f0bd3af47ca9d40971179ee62de.r2.dev/02f6edc0-1f7b-4272-bd17-f05335104725/audio.mp3";
  const response = await fetch(URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch audio: ${response.status}`);
  }
  const arrayBuffer = await response.arrayBuffer();

  // Example: Split into 1MB chunks.
  const chunkSize = 1024 * 1024; // 1MB
  const chunks: ArrayBuffer[] = [];
  for (let i = 0; i < arrayBuffer.byteLength; i += chunkSize) {
    const chunk = arrayBuffer.slice(i, i + chunkSize);
    chunks.push(chunk);
  }
  return chunks;
}

/**
 * Transcribes a single audio chunk using the Whisper model.
 * Converts the chunk to base64 and calls the AI binding.
 */
async function transcribeChunk(chunkBuffer: ArrayBuffer, env: Env): Promise<string> {
  const base64 = Buffer.from(chunkBuffer, "binary").toString("base64");
  const res = await env.AI.run("@cf/openai/whisper-large-v3-turbo", {
    audio: base64,
    // Optional parameters:
    // task: "transcribe",
    // language: "en",
    // vad_filter: "false",
    // initial_prompt: "Provide context if needed.",
    // prefix: "Transcription:",
  });
  // Assumes the result object includes a "text" property with the transcription.
  return res.text;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      const audioChunks = await getAudioChunks();
      let fullTranscript = "";
      for (const chunk of audioChunks) {
        try {
          const transcript = await transcribeChunk(chunk, env);
          fullTranscript += transcript + "\n";
        } catch (error) {
          fullTranscript += "[Error transcribing chunk]\n";
        }
      }
      return new Response(fullTranscript, {
        headers: { "Content-Type": "text/plain" },
      });
    } catch (error) {
      console.error("Failed to process audio chunks:", error);
      return new Response("Error processing audio chunks", { status: 500 });
    }
  },
} satisfies ExportedHandler<Env>;
