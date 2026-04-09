import { Command } from "commander";
import { generateVoice } from "../api.js";
import {
  handleError,
  isQuote,
  printGeneration,
  printQuote,
} from "../output.js";
import type { GenerationResponse, QuoteResponse } from "../api.js";

export const voiceCommand = new Command("voice")
  .description("Generate speech from text")
  .argument("<text>", "Text to convert to speech")
  .option("-m, --model <model>", "Model ID (e.g. chatterbox-turbo, elevenlabs-turbo-2-5)")
  .option("--voice <id>", "Voice ID from the library (e.g. internal_marco)")
  .option("--ref-audio <url>", "Reference audio URL for voice cloning")
  .option("--speed <factor>", "Speech speed (0.5-2.0)", parseFloat)
  .option("-l, --language <code>", "Language code (en, es, fr, zh, ja, ...)")
  .option("-e, --emotion <emotion>", "Emotion for IndexTTS2 (happy, sad, angry, afraid, calm, neutral)")
  .option("--emotion-vector <json>", "Per-word emotion control as JSON array (e.g. '[{\"word\":\"fell\",\"emotion\":\"sad\"},{\"word\":\"victory\",\"emotion\":\"happy\"}]')")
  .option("--voice-description <desc>", "Design a voice from a text description (Qwen 3 TTS)")
  .option("--estimate", "Show cost estimate without generating")
  .option("-w, --wait <seconds>", "Max seconds to wait (default: 60)", parseInt)
  .option("--raw", "Output full JSON response")
  .action(async (text: string, opts) => {
    try {
      let emotionVector: unknown[] | undefined;
      if (opts.emotionVector) {
        try {
          emotionVector = JSON.parse(opts.emotionVector);
        } catch {
          console.error("Error: --emotion-vector must be valid JSON array");
          process.exit(1);
        }
      }

      const res = await generateVoice(text, {
        model: opts.model,
        voice: opts.voice,
        ref_audio_url: opts.refAudio,
        speed: opts.speed,
        language: opts.language,
        emotion: opts.emotion,
        emotion_vector: emotionVector,
        voice_description: opts.voiceDescription,
        confirm: !opts.estimate,
        wait: opts.wait || 60,
      });

      if (isQuote(res)) {
        printQuote(res as QuoteResponse, opts.raw);
      } else {
        printGeneration(res as GenerationResponse, opts.raw);
      }
    } catch (err) {
      handleError(err);
    }
  });
