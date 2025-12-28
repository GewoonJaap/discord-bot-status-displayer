# discord-bot-status-displayer

Display a status on your Discord bot with optional health check monitoring.

## Features

- 🤖 Set custom Discord bot activity status
- 🏥 Optional health endpoint monitoring
- 🔄 Automatic status updates based on health checks
- 🎯 Automatic sharding support
- 🐳 Docker support included

## Environment Variables

### Required
- `TOKEN` - Your Discord bot token

### Basic Activity (Optional)
- `ACTIVITY_NAME` - The activity name to display (default: "Hi there :)")
- `ACTIVITY_TYPE` - The activity type: `playing`, `streaming`, `listening`, `watching`, `competing` (default: "playing")

### Health Check Monitoring (Optional)
All health check variables are optional. If `HEALTH_ENDPOINT` is not set, the bot will use the basic activity settings.

- `HEALTH_ENDPOINT` - URL of the health endpoint to monitor (e.g., `https://your-service.com/health`)
- `HEALTH_CHECK_INTERVAL` - How often to check health in milliseconds (default: `60000` = 60 seconds)

**Healthy Status:**
- `ACTIVITY_NAME_HEALTHY` - Activity name when health check passes (default: "✅ Service Online")
- `ACTIVITY_TYPE_HEALTHY` - Activity type when healthy (default: value of `ACTIVITY_TYPE` or "playing")

**Unhealthy Status:**
- `ACTIVITY_NAME_UNHEALTHY` - Activity name when health check fails (default: "❌ Service Offline")
- `ACTIVITY_TYPE_UNHEALTHY` - Activity type when unhealthy (default: value of `ACTIVITY_TYPE` or "playing")

## Setup

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Create a `.env` file with your configuration:
   ```env
   TOKEN=your_discord_bot_token_here
   
   # Basic activity (used when no health endpoint is set)
   ACTIVITY_NAME=My Custom Status
   ACTIVITY_TYPE=playing
   
   # Optional: Health monitoring
   HEALTH_ENDPOINT=https://api.example.com/health
   HEALTH_CHECK_INTERVAL=30000
   ACTIVITY_NAME_HEALTHY=✅ API Online
   ACTIVITY_TYPE_HEALTHY=watching
   ACTIVITY_NAME_UNHEALTHY=❌ API Down
   ACTIVITY_TYPE_UNHEALTHY=watching
   ```
4. Build and run:
   ```bash
   yarn build
   yarn start
   ```

### Docker

1. Build the image:
   ```bash
   docker build -t discord-bot-status-displayer .
   ```
2. Run the container:
   ```bash
   docker run -d \
     -e TOKEN=your_discord_bot_token \
     -e HEALTH_ENDPOINT=https://api.example.com/health \
     -e ACTIVITY_NAME_HEALTHY="✅ Service Running" \
     -e ACTIVITY_NAME_UNHEALTHY="❌ Service Down" \
     discord-bot-status-displayer
   ```

### Docker Compose

```yaml
version: '3.8'
services:
  discord-bot:
    build: .
    environment:
      - TOKEN=your_discord_bot_token
      - HEALTH_ENDPOINT=https://api.example.com/health
      - HEALTH_CHECK_INTERVAL=60000
      - ACTIVITY_NAME_HEALTHY=✅ Service Online
      - ACTIVITY_NAME_UNHEALTHY=❌ Service Offline
    restart: unless-stopped
```

## Usage Examples

### Simple Status (No Health Check)
```env
TOKEN=your_token
ACTIVITY_NAME=Hello World!
ACTIVITY_TYPE=playing
```
Result: Bot shows "Playing Hello World!"

### Health Monitoring
```env
TOKEN=your_token
HEALTH_ENDPOINT=https://myapi.com/health
ACTIVITY_NAME_HEALTHY=API is up
ACTIVITY_NAME_UNHEALTHY=API is down
ACTIVITY_TYPE_HEALTHY=watching
```
Result: Bot shows "Watching API is up" when healthy, "Watching API is down" when unhealthy

### Fallback to Basic Activity
```env
TOKEN=your_token
ACTIVITY_NAME=Default Status
# No HEALTH_ENDPOINT set
```
Result: Bot shows "Playing Default Status" (no health checks performed)

## How It Works

1. **Without Health Endpoint**: The bot simply sets the configured activity status once on startup
2. **With Health Endpoint**: 
   - The bot checks the health endpoint immediately on startup
   - Sets the appropriate activity based on the health status
   - Continues checking at the configured interval
   - Updates the activity only when the health status changes

## License

MIT
