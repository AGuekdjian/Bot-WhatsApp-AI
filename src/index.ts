import "dotenv/config";
import BotWhatsapp from "@bot-whatsapp/bot";
import database from "./database";
import provider from "./provider";
import flow from "./flow";

const main = async () => {
  await BotWhatsapp.createBot({
    database,
    flow,
    provider,
  });
};

main();
