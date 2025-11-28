// ===============================================
// WidgetBot Plugin - Frontend JavaScript
// ===============================================

console.log("🚀 WidgetBot Plugin Loading...");

// Wait for FeatherPanel API to be available
function waitForAPI() {
  return new Promise((resolve) => {
    if (window.FeatherPanel && window.FeatherPanel.api) {
      resolve();
    } else {
      // Check every 100ms until API is available
      const check = setInterval(() => {
        if (window.FeatherPanel && window.FeatherPanel.api) {
          clearInterval(check);
          resolve();
        }
      }, 100);
    }
  });
}

// Wait for WidgetBot Crate script to be available
function waitForCrate() {
  return new Promise((resolve) => {
    if (window.Crate) {
      resolve();
    } else {
      const check = setInterval(() => {
        if (window.Crate) {
          clearInterval(check);
          resolve();
        }
      }, 100);
    }
  });
}

// Main WidgetBot Plugin Class
class WidgetBotPlugin {
  constructor() {
    this.api = null;
    this.crate = null;
  }

  async init(api) {
    this.api = api;
    console.log("🚀 WidgetBot Plugin initialized!");

    // Automatically initialize the WidgetBot Crate once the plugin is ready
    try {
      await this.initCrate();
    } catch (e) {
      console.error("❌ Failed to initialize WidgetBot Crate:", e);
    }
  }

  async initCrate() {
    try {
      const response = await fetch("/api/public/widgetbot/config");
      const result = await response.json();

      if (!result || !result.success || !result.data) {
        console.warn(
          "WidgetBot config API did not return a valid response:",
          result
        );
        return;
      }

      const {
        server_id: serverId,
        channel_id: channelId,
        crate_options: crateOptions,
      } = result.data;

      if (!serverId) {
        console.warn("WidgetBot config missing server_id");
        return;
      }

      // Inject the WidgetBot Crate script
      if (!document.querySelector('script[src*="@widgetbot/crate@3"]')) {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/@widgetbot/crate@3";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      }

      // Wait until Crate is available on window
      await waitForCrate();

      const options = {
        server: serverId,
      };

      if (channelId) {
        options.channel = channelId;
      }

      if (crateOptions && typeof crateOptions === "object") {
        Object.assign(options, crateOptions);
      }

      // Override location to position it higher up to avoid collision with FeatherAI agent
      // Use a numeric offset from bottom (150px) instead of just "bottom"
      const verticalPos = options.location?.[0] || "bottom";
      const horizontalPos = options.location?.[1] || "left";

      // If vertical is "bottom", convert it to a numeric offset to move it higher
      if (verticalPos === "bottom") {
        options.location = [150, horizontalPos]; // 150px from bottom = higher up
      } else if (typeof verticalPos === "string") {
        // Keep as-is if it's "top" or already a number
        options.location = [verticalPos, horizontalPos];
      }

      // Initialize the Crate widget
      this.crate = new window.Crate(options);
      window.WidgetBotCrate = this.crate;

      console.log("✅ WidgetBot Crate initialized with options:", options);
    } catch (error) {
      console.error(
        "Failed to load WidgetBot config or initialize Crate:",
        error
      );
    }
  }
}

// Main plugin initialization
async function initWidgetBotPlugin() {
  await waitForAPI();

  const api = window.FeatherPanel.api;
  const WidgetBot = new WidgetBotPlugin();
  await WidgetBot.init(api);

  // Make plugin globally available
  window.WidgetBotPlugin = WidgetBot;

  console.log("🚀 WidgetBot Plugin API Ready!");
}

// Initialize the plugin
initWidgetBotPlugin();

console.log("🚀 WidgetBot Plugin script loaded");
