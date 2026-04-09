import { Command } from "commander";
import { readConfig, writeConfig } from "../config.js";
import { createInterface } from "node:readline";

export const loginCommand = new Command("login")
  .description("Store your FairStack API key")
  .argument("[key]", "API key (or set FAIRSTACK_API_KEY env var)")
  .option("--base-url <url>", "Custom API base URL")
  .action(async (key?: string, opts?: { baseUrl?: string }) => {
    let apiKey = key;

    if (!apiKey) {
      // Prompt for key
      const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      apiKey = await new Promise<string>((resolve) => {
        rl.question("Enter your FairStack API key: ", (answer) => {
          rl.close();
          resolve(answer.trim());
        });
      });
    }

    if (!apiKey) {
      console.error("No API key provided");
      process.exit(1);
    }

    if (!apiKey.startsWith("fs_")) {
      console.error(
        'Invalid API key format. Keys start with "fs_". Get yours at https://fairstack.ai/app/api-keys'
      );
      process.exit(1);
    }

    const config = readConfig();
    config.apiKey = apiKey;
    if (opts?.baseUrl) config.baseUrl = opts.baseUrl;
    writeConfig(config);

    console.log("API key saved to ~/.fairstack/config.json");
    console.log(
      "You can also set the FAIRSTACK_API_KEY environment variable instead."
    );
  });
