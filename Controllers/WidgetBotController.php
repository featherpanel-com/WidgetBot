<?php

/*
 * This file is part of FeatherPanel.
 *
 * MIT License
 *
 * Copyright (c) 2025 MythicalSystems
 * Copyright (c) 2025 Cassian Gherman (NaysKutzu)
 * Copyright (c) 2018 - 2021 Dane Everitt <dane@daneeveritt.com> and Contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

namespace App\Addons\widgetbot\Controllers;

use App\Helpers\ApiResponse;
use App\Plugins\PluginSettings;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class WidgetBotController
{
	/**
	 * Return the configured WidgetBot server and channel IDs as a public API.
	 *
	 * This endpoint is unauthenticated on purpose so it can be used from embeds.
	 */
	public function config(Request $request): Response
	{
		$serverId = PluginSettings::getSetting('widgetbot', 'server_id');
		$channelId = PluginSettings::getSetting('widgetbot', 'channel_id');

		if ($serverId === null || $channelId === null) {
			return ApiResponse::error(
				'No configuration provided. Please configure WidgetBot inside the plugins area.',
				'WIDGETBOT_NOT_CONFIGURED',
				500
			);
		}

		return ApiResponse::success(
			[
				'server_id' => $serverId,
				'channel_id' => $channelId,
				// Extra options passed directly to the WidgetBot Crate constructor
				// so users can customize behaviour via the plugin settings UI.
				'crate_options' => [
					// Button color, e.g. '#5865F2'
					'color' => PluginSettings::getSetting('widgetbot', 'crate_color') ?? null,
					// Crate location, e.g. ['bottom', 'right']
					'location' => [
						PluginSettings::getSetting('widgetbot', 'crate_location_vertical') ?? 'bottom',
						PluginSettings::getSetting('widgetbot', 'crate_location_horizontal') ?? 'right',
					],
					// Enable/disable notifications (true/false)
					'notifications' => PluginSettings::getSetting('widgetbot', 'crate_notifications') === 'true',
				],
			],
			'WidgetBot configuration loaded',
			200
		);
	}

	/**
	 * Simple unauthenticated HTML embed for WidgetBot.
	 *
	 * This can be used directly as an iframe source on external sites.
	 */
	public function embed(Request $request): Response
	{
		$serverId = PluginSettings::getSetting('widgetbot', 'server_id');
		$channelId = PluginSettings::getSetting('widgetbot', 'channel_id');

		if ($serverId === null || $channelId === null) {
			$html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>WidgetBot</title></head>'
				. '<body style="margin:0;background:#020617;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;text-align:center;padding:1.5rem;">'
				. '<p style="max-width:32rem;line-height:1.5;">'
				. 'No configuration provided. Please configure WidgetBot inside the plugins area.'
				. '</p>'
				. '</body></html>';

			return new Response($html, 500, ['Content-Type' => 'text/html; charset=utf-8']);
		}

		$serverIdEscaped = htmlspecialchars($serverId, ENT_QUOTES, 'UTF-8');
		$channelIdEscaped = htmlspecialchars($channelId, ENT_QUOTES, 'UTF-8');

		$html = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WidgetBot</title>
    <style>
        html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            background-color: #020617;
        }
        body {
            display: flex;
            align-items: stretch;
            justify-content: stretch;
            overflow: hidden;
        }
        widgetbot {
            width: 100%;
            height: 100%;
        }
    </style>
</head>
<body>
<widgetbot
  server="{$serverIdEscaped}"
  channel="{$channelIdEscaped}"
  width="800"
  height="600"
></widgetbot>

<script src="https://cdn.jsdelivr.net/npm/@widgetbot/html-embed" async></script>
</body>
</html>
HTML;

		return new Response($html, 200, ['Content-Type' => 'text/html; charset=utf-8']);
	}
}


