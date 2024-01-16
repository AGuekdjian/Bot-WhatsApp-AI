import BotWhatsapp from "@bot-whatsapp/bot";
import { ChatCompletionMessageParam } from "openai/resources";
import { run, runDetermine } from "src/services/openai";

export default BotWhatsapp.addKeyword(BotWhatsapp.EVENTS.WELCOME)
  .addAction(async (ctx, { state }) => {
    try {
      const history = (state.getMyState()?.history ??
        []) as ChatCompletionMessageParam[];

      const ai = await runDetermine(history);

      if (ai.toLocaleLowerCase().includes("unknown")) {
        return;
      }

      if (ai.toLocaleLowerCase().includes("chatbot")) {
        return;
      }
    } catch (err) {
      console.log(`[ERROR]: `, err);
      return;
    }
  })
  .addAction(async (ctx, { flowDynamic, state }) => {
    try {
      const newHistory = (state.getMyState()?.history ??
        []) as ChatCompletionMessageParam[];

      const name = ctx?.pushName ?? "";

      newHistory.push({
        role: "user",
        content: ctx.body,
      });

      const largeResponse = await run(name, newHistory);

      const chunks = largeResponse.split(/(?<!\d)\.\s+/g);

      for (const chunk of chunks) {
        await flowDynamic(chunk);
      }

      newHistory.push({
        role: "assistant",
        content: largeResponse,
      });

      await state.update({ history: newHistory });
    } catch (err) {
      console.log(`[ERROR]: `, err);
      return;
    }
  });
