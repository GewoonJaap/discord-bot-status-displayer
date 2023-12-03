import { ActivityType } from "discord.js";

export function getActivityType(type: string): ActivityType {
  switch (type.toLowerCase()) {
    case "playing":
      return ActivityType.Playing;
    case "streaming":
      return ActivityType.Streaming;
    case "listening":
      return ActivityType.Listening;
    case "watching":
      return ActivityType.Watching;
    case "competing":
      return ActivityType.Competing;
    default:
      return ActivityType.Playing;
  }
}
