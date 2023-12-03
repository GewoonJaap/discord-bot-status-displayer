import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
import { getActivityType } from "./util/activityTypeFetcher";
(async () => {
  client.on("ready", () => {
    //set status
    console.log(`Logged in as ${client.user?.tag}!`);
    client.user?.setActivity(process.env.ACTIVITY_NAME || "Hi there :)", {
      type: getActivityType(process.env.ACTIVITY_TYPE || "playing")
    });
    console.log(`Activity set to ${client.user?.presence.activities[0].name}!`);
  });

  client.login(process.env.TOKEN);
})();

console.log("Starting the activity bot...");
