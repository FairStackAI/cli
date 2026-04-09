import { Command } from "commander";
import { getAccount } from "../api.js";
import { handleError, printJson } from "../output.js";

export const balanceCommand = new Command("balance")
  .description("Check your credit balance and account info")
  .option("--raw", "Output full JSON response")
  .action(async (opts) => {
    try {
      const res = await getAccount();

      if (opts.raw) {
        printJson(res, true);
        return;
      }

      const d = res.data;
      console.log(`Account:  ${d.name} (${d.email})`);
      console.log(`Plan:     ${d.plan.description}`);
      console.log(`Balance:  $${d.credits.balance_usd.toFixed(2)}`);
      if (d.spending_cap.monthly_usd !== null) {
        console.log(
          `Spending: $${d.spending_cap.used_this_month_usd.toFixed(2)} / $${d.spending_cap.monthly_usd.toFixed(2)} this month`
        );
      } else {
        console.log(
          `Spent:    $${d.spending_cap.used_this_month_usd.toFixed(2)} this month`
        );
      }
    } catch (err) {
      handleError(err);
    }
  });
