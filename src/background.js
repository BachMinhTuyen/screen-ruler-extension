chrome.action.onClicked.addListener(async (tab) => {
	try {
		await chrome.tabs.sendMessage(tab.id, { type: "PING" });

		await chrome.tabs.sendMessage(tab.id, { type: "TOGGLE_RULER" });

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
	}
});