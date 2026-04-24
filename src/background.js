chrome.action.onClicked.addListener(async (tab) => {
	try {
		await chrome.tabs.sendMessage(tab.id, { type: "PING" });

		const response = await chrome.tabs.sendMessage(tab.id, { type: "TOGGLE_RULER" });

		if (response) {
			updateBadge(tab.id, response.status === "on");
		}

	} catch (err) {
		await chrome.scripting.insertCSS({
			target: { tabId: tab.id },
			files: ["src/styles/overlay.css"]
		});

		await chrome.scripting.executeScript({
			target: { tabId: tab.id },
			files: [
				"src/libs/lucide.js",
				"src/content/utils.js",
				"src/content/overlay.js",
				"src/content/selector.js",
				"src/content/resizer.js",
				"src/content/stats.js",
				"src/content/index.js"
			]
		});

		setTimeout(() => {
			chrome.tabs.sendMessage(tab.id, { type: "TOGGLE_RULER" });
		}, 50);
		updateBadge(tab.id, true);
	}
});

chrome.runtime.onMessage.addListener((message, sender) => {
	if (message.type === "RULER_CLOSED_MANUALLY" && sender.tab) {
		updateBadge(sender.tab.id, false);
	}
});

function updateBadge(tabId, isOn) {
	chrome.action.setBadgeText({
		tabId: tabId,
		text: isOn ? "ON" : ""
	});

	chrome.action.setBadgeBackgroundColor({
		tabId: tabId,
		color: isOn ? "#10b981" : "#000000"
	});
}