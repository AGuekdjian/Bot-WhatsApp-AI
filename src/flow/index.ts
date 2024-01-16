import BotWhatsapp from "@bot-whatsapp/bot";
import flowInit from "./init.flow";
import flowDefault from "./default.flow";

export default BotWhatsapp.createFlow([flowInit, flowDefault]);
