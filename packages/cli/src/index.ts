#!/usr/bin/env node

import { Command } from "commander";
import { loginCommand } from "./commands/login.js";
import { imageCommand } from "./commands/image.js";
import { videoCommand } from "./commands/video.js";
import { voiceCommand } from "./commands/voice.js";
import { musicCommand } from "./commands/music.js";
import { talkingHeadCommand } from "./commands/talking-head.js";
import { modelsCommand } from "./commands/models.js";
import { voicesCommand } from "./commands/voices.js";
import { compareCommand } from "./commands/compare.js";
import { estimateCommand } from "./commands/estimate.js";
import { selectCommand } from "./commands/select.js";
import { balanceCommand } from "./commands/balance.js";
import { statusCommand } from "./commands/status.js";
import { reelCommand } from "./commands/reel/index.js";

const program = new Command();

program
  .name("fairstack")
  .description(
    "FairStack CLI — generate images, video, voice, and music at fair prices"
  )
  .version("0.1.0");

// Auth
program.addCommand(loginCommand);

// Generation commands
program.addCommand(imageCommand);
program.addCommand(videoCommand);
program.addCommand(voiceCommand);
program.addCommand(musicCommand);
program.addCommand(talkingHeadCommand);

// Discovery / utility
program.addCommand(modelsCommand);
program.addCommand(voicesCommand);
program.addCommand(compareCommand);
program.addCommand(estimateCommand);
program.addCommand(selectCommand);
program.addCommand(balanceCommand);
program.addCommand(statusCommand);

// Reel production pipeline
program.addCommand(reelCommand);

program.parse();
