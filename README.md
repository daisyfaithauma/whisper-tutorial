# Whisper Transcription Cloudflare Worker

## Project Overview
This project implements an AI-powered audio transcription service using Cloudflare Workers AI and the Whisper-large-v3-turbo model. The application can transcribe audio files of various lengths by supporting chunk-based processing and leveraging Cloudflare's serverless infrastructure.

## Features
- Automatic Speech Recognition (ASR) using OpenAI's Whisper model
- Supports large audio file transcription through intelligent chunking
- Cloudflare Workers deployment for scalable, low-latency transcription
- Configurable transcription parameters:
  - Language selection
  - Translation vs. transcription mode
  - Voice activity detection
  - Custom initial prompts

## Prerequisites
- Cloudflare account
- Node.js (v18+ recommended)
- Wrangler CLI
- Basic JavaScript/TypeScript knowledge

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd whisper-transcription-worker
```

2. Install dependencies:
```bash
npm install
```

3. Configure Cloudflare credentials:
```bash
npx wrangler login
```

## Configuration
Update `wrangler.toml` with:
```toml
compatibility_date = "2024-09-23"
nodejs_compat = true

[ai]
binding = "AI"
```

## Local Development
Start the development server:
```bash
npx wrangler dev --remote
```

## Deployment
Deploy your Worker:
```bash
npx wrangler deploy
```

## Usage Example
```javascript
// Sample API call configuration
const transcriptionOptions = {
  audio: base64EncodedAudio,
  task: "transcribe",
  language: "en",
  vad_filter: "false"
}
```

## Supported Audio Formats
- MP3
- WAV
- Other formats supported by Cloudflare Workers AI
