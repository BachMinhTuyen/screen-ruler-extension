# Screen Ruler Extension

**Screen Ruler** is a powerful web tool designed for developers and designers to measure element dimensions (Width, Height) and positioning (X, Y) directly in the browser.

## Key Features

- **Dynamic Measurement:** Click and drag to create a measurement area anywhere on any webpage.
- **Manual Adjustments:** Fine-tune coordinates and dimensions via input fields or by using the mouse wheel.
- **Dark/Light Mode:** Modern Stats Box UI that adapts to your preference.

## Security & Privacy

This extension is built with a security-first approach, adhering to industry best practices:
- **Principle of Least Privilege:** Unlike most rulers, this extension does not track your browsing history or read data on every website you visit. It only requests access to the current tab when you explicitly click the extension icon (activeTab permission).
- **Just-in-Time Injection:** No scripts are running in the background while you browse. Code is only injected and executed when the tool is activated, significantly reducing RAM usage and improving browser performance.
- **No Data Collection:** All measurement data and user preferences are stored locally on your machine using chrome.storage.local. We do not have any external servers and never collect your personal information.
- **Anti-Fingerprinting:** Utilizes use_dynamic_url for web-accessible resources, preventing malicious websites from detecting the presence of the extension.

## Installation Guide (Chrome Developer Mode)

Follow these steps to install and run the extension locally on your Chrome browser:

### Step 1: Clone the Repository
Download the source code to your local machine using `git clone` or by downloading the `.zip` file.

### Step 2: Load into Chrome
1. Open Chrome and navigate to: `chrome://extensions/`
2. Enable **Developer mode** using the toggle in the top-right corner.
3. Click the **Load unpacked** button.
4. Select the project folder (the one containing the `manifest.json` file).

### Step 3: Start Measuring
- Click the Extension icon in the toolbar to activate the ruler.
- Drag to draw, move the box, or use the handles to resize.

## Credits & Attribution

### Author
- **Developed by:** [Minh Tuyen](https://github.com/bachminhtuyen)

### Third-Party Resources
Special thanks to the following providers for their amazing free resources:
- Icons provided by [Lucide Icons](https://lucide.dev/) (ISC License).
- [Ruler icons](https://www.flaticon.com/free-icons/ruler) created by Aranagraphics - Flaticon

---
*Made with ❤️ for Web Developers.*