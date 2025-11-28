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

// Main WidgetBot Plugin Class
class WidgetBotPlugin {
  constructor() {
    this.api = null;
  }

  async init(api) {
    this.api = api;
    console.log("🚀 WidgetBot Plugin initialized!");

    // Automatically inject the WidgetBot embed once the plugin is ready
    try {
      await this.injectWidgetBotEmbed();
    } catch (e) {
      console.error("❌ Failed to inject WidgetBot embed:", e);
    }
  }

  async injectWidgetBotEmbed() {
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

      const { server_id: serverId, channel_id: channelId } = result.data;
      if (!serverId || !channelId) {
        console.warn("WidgetBot config missing server_id or channel_id");
        return;
      }

      // Inject the WidgetBot script
      if (!document.querySelector('script[src*="@widgetbot/html-embed"]')) {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/@widgetbot/html-embed";
        script.async = true;
        document.head.appendChild(script);
      }

      // Create a container in the DOM for the widget if it doesn't exist yet
      let container = document.getElementById("widgetbot-embed-container");
      if (!container) {
        container = document.createElement("div");
        container.id = "widgetbot-embed-container";
        container.style.position = "fixed";
        container.style.bottom = "1.5rem";
        container.style.right = "1.5rem";
        container.style.width = "400px";
        container.style.height = "600px";
        container.style.zIndex = "9999";
        container.style.borderRadius = "0.75rem";
        container.style.overflow = "hidden";
        container.style.boxShadow = "0 20px 40px rgba(0,0,0,0.45)";
        document.body.appendChild(container);
      } else {
        container.innerHTML = "";
      }

      // Create the <widgetbot> element
      const widget = document.createElement("widgetbot");
      widget.setAttribute("server", serverId);
      widget.setAttribute("channel", channelId);
      widget.setAttribute("width", "100%");
      widget.setAttribute("height", "100%");

      container.appendChild(widget);
      console.log("✅ WidgetBot embed injected into the page");
    } catch (error) {
      console.error("Failed to load WidgetBot config or inject embed:", error);
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
