import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import { getActivityType } from "./util/activityTypeFetcher";
import { checkHealth } from "./util/healthChecker";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  shards: "auto"
});

// Configuration from environment variables
const HEALTH_ENDPOINT = process.env.HEALTH_ENDPOINT;
const HEALTH_CHECK_INTERVAL = parseInt(process.env.HEALTH_CHECK_INTERVAL || "60000"); // Default: 60 seconds
const ACTIVITY_NAME_HEALTHY = process.env.ACTIVITY_NAME_HEALTHY || process.env.ACTIVITY_NAME || "✅ Service Online";
const ACTIVITY_TYPE_HEALTHY = process.env.ACTIVITY_TYPE_HEALTHY || process.env.ACTIVITY_TYPE || "playing";
const ACTIVITY_NAME_UNHEALTHY = process.env.ACTIVITY_NAME_UNHEALTHY || "❌ Service Offline";
const ACTIVITY_TYPE_UNHEALTHY = process.env.ACTIVITY_TYPE_UNHEALTHY || process.env.ACTIVITY_TYPE || "playing";

let currentHealthStatus: boolean | null = null;

console.log("Starting the activity bot...");

async function updateActivity() {
  if (!client.user) return;

  if (!HEALTH_ENDPOINT) {
    // No health endpoint configured, use default behavior
    client.user.setActivity(process.env.ACTIVITY_NAME || "Hi there :)", {
      type: getActivityType(process.env.ACTIVITY_TYPE || "playing")
    });
    console.log(`Activity set to ${client.user.presence.activities[0].name}!`);
    return;
  }

  const healthResult = await checkHealth(HEALTH_ENDPOINT);

  // Only update if health status changed
  if (currentHealthStatus !== healthResult.isHealthy) {
    currentHealthStatus = healthResult.isHealthy;

    if (healthResult.isHealthy) {
      client.user.setActivity(ACTIVITY_NAME_HEALTHY, {
        type: getActivityType(ACTIVITY_TYPE_HEALTHY)
      });
      console.log(`✅ Health check passed - Activity: ${ACTIVITY_NAME_HEALTHY}`);
    } else {
      client.user.setActivity(ACTIVITY_NAME_UNHEALTHY, {
        type: getActivityType(ACTIVITY_TYPE_UNHEALTHY)
      });
      console.log(`❌ Health check failed - Activity: ${ACTIVITY_NAME_UNHEALTHY}`);
      if (healthResult.error) {
        console.log(`Error: ${healthResult.error}`);
      }
    }
  }
}

(async () => {
  client.on("ready", async () => {
    console.log(`Logged in as ${client.user?.tag}!`);
    console.log(`Running on shard(s): ${client.shard?.ids.join(", ")}`);

    if (HEALTH_ENDPOINT) {
      console.log(`Health endpoint: ${HEALTH_ENDPOINT}`);
      console.log(`Check interval: ${HEALTH_CHECK_INTERVAL}ms`);
    }

    // Set initial activity
    await updateActivity();

    // Set up periodic health checks if endpoint is configured
    if (HEALTH_ENDPOINT) {
      setInterval(updateActivity, HEALTH_CHECK_INTERVAL);
    }
  });

  await client.login(process.env.TOKEN);
})();
