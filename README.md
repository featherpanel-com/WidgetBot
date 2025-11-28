# WidgetBot Plugin for FeatherPanel

Integrate [WidgetBot](https://widgetbot.io/) Discord chat widgets directly into your FeatherPanel installation. This plugin adds a floating Discord chat widget that allows users to interact with your Discord server without leaving the panel.

## Features

- **Discord Chat Integration**: Embed a live Discord chat widget using WidgetBot Crate
- **Automatic Injection**: WidgetBot automatically appears on all FeatherPanel pages (desktop only)
- **Customizable**: Configure button color, position, and notification settings
- **Public API**: Access WidgetBot configuration via public API endpoints
- **Embed Support**: Generate standalone embed pages for external use
- **Smart Positioning**: Automatically positioned to avoid collisions with other UI elements (like FeatherAI agent)

## Installation

1. Install the plugin through the FeatherPanel plugin manager
2. Navigate to **Plugins** → **WidgetBot** in the admin panel
3. Configure your Discord server and channel IDs

## Configuration

### Required Settings

- **Server ID**: Your Discord server ID

  - To get your server ID, enable Developer Mode in Discord, right-click your server, and select "Copy Server ID"
  - Make sure to invite the WidgetBot bot first: https://add.widgetbot.io/

- **Channel ID**: The Discord channel ID you want to display by default
  - Enable Developer Mode, right-click the channel, and select "Copy Channel ID"

### Optional Settings

- **Crate Button Color**: Hex color code for the WidgetBot button (e.g., `#5865F2` for Discord blue)
- **Crate Vertical Location**: Position vertically - `top`, `bottom`, or a pixel number
- **Crate Horizontal Location**: Position horizontally - `left`, `right`, or a pixel number
- **Enable Crate Notifications**: Toggle message notifications (`true` or `false`)

## How It Works

Once configured, the WidgetBot Crate widget will automatically:

1. Load on all FeatherPanel pages (desktop viewports only)
2. Display as a floating button in the bottom-left corner (by default, positioned 150px from bottom to avoid UI collisions)
3. Open a Discord chat widget when clicked
4. Show your configured Discord server and channel

## API Endpoints

### Public Configuration API

**GET** `/api/public/widgetbot/config`

Returns the WidgetBot configuration as JSON (no authentication required):

```json
{
  "success": true,
  "data": {
    "server_id": "299881420891881473",
    "channel_id": "355719584830980096",
    "crate_options": {
      "color": "#5865F2",
      "location": ["bottom", "left"],
      "notifications": true
    }
  }
}
```

### Embed Endpoint

**GET** `/widgetbot/embed`

Returns a standalone HTML page with the WidgetBot embed. Perfect for use in iframes on external sites:

```html
<iframe
  src="https://your-panel-domain.com/widgetbot/embed"
  width="800"
  height="600"
  style="border:none;"
>
</iframe>
```

## Frontend Integration

The plugin automatically injects the WidgetBot Crate script and initializes it with your configuration:

```javascript
// Automatically loaded on all pages
<script
  src="https://cdn.jsdelivr.net/npm/@widgetbot/crate@3"
  async
  defer
></script>;

// Initialized with your settings
new Crate({
  server: "YOUR_SERVER_ID",
  channel: "YOUR_CHANNEL_ID",
  location: [150, "left"], // Positioned higher to avoid UI collisions
  // ... other options from your configuration
});
```

## Customization

### Programmatic Control

The WidgetBot Crate instance is available globally as `window.WidgetBotCrate`, allowing you to control it via JavaScript:

```javascript
// Toggle the widget
window.WidgetBotCrate.toggle();

// Navigate to a different channel
window.WidgetBotCrate.navigate("CHANNEL_ID");

// Show a notification
window.WidgetBotCrate.notify("Hello from FeatherPanel!");

// Update options
window.WidgetBotCrate.setOptions({
  color: "#22c55e",
  location: ["top", "right"],
});
```

### CSS Customization

The WidgetBot Crate button can be styled using CSS. The button is rendered in a shadow DOM, but you can target it using WidgetBot's CSS injection feature via the configuration options.

## Troubleshooting

### WidgetBot Not Appearing

1. **Check Configuration**: Ensure both `server_id` and `channel_id` are set in plugin settings
2. **Bot Invitation**: Make sure you've invited the WidgetBot bot to your Discord server: https://add.widgetbot.io/
3. **Desktop Only**: The widget only appears on desktop viewports (width ≥ 1024px)
4. **Browser Console**: Check the browser console for any JavaScript errors

### Configuration Errors

If you see "No configuration provided" message:

1. Go to **Plugins** → **WidgetBot** in the admin panel
2. Fill in the required `server_id` and `channel_id` fields
3. Save the configuration
4. Refresh the page

## Files Structure

```
widgetbot/
├── WidgetBot.php              # Main plugin class
├── conf.yml                   # Plugin configuration schema
├── Controllers/
│   └── WidgetBotController.php # API controllers
├── Routes/
│   └── widgetbot.php          # Route definitions
├── Frontend/
│   ├── index.js               # Frontend JavaScript (Crate integration)
│   ├── index.css              # Plugin styles
│   └── sidebar.json           # Sidebar configuration
└── README.md                  # This file
```

## Requirements

- PHP with PDO extension
- FeatherPanel v2
- Valid Discord server and channel IDs
- WidgetBot bot invited to your Discord server

## Support

For WidgetBot-specific issues, visit:

- [WidgetBot Documentation](https://docs.widgetbot.io/)
- [WidgetBot Discord Server](https://discord.gg/widgetbot)

For plugin-specific issues, check the FeatherPanel logs or contact the plugin author.

## License

MIT License - See the main FeatherPanel license for details.

## Author

- **NaysKUtzu** - Initial development

---

**Note**: This plugin uses the official WidgetBot Crate library. Make sure to comply with WidgetBot's terms of service when using this integration.
