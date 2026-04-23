let isDrawing = false;
let isResizing = false;
let isMoving = false;
let startX, startY;
let offsetX, offsetY;
let activeHandle = null;

chrome.runtime.onMessage.addListener((request) => {
	if (request.type === "TOGGLE_RULER") {
		if (OverlayManager.element) {
			StatsBox.destroy();
			OverlayManager.destroy();
			document.body.classList.remove('ruler-no-scroll');
		} else {
			const overlay = OverlayManager.create();
			Selector.init(overlay);
			StatsBox.init(overlay);
			setupEvents(overlay);
			document.body.classList.add('ruler-no-scroll');
		}
	}
});

function setupEvents(overlayRoot) {
	overlayRoot.addEventListener('mousedown', (e) => {
		const target = e.target;

		// If you click on the Stats Box or Input inside it -> Skip, do not start drawing.
		if (target.closest('.measure-stats')) {
			return;
		}

		// If you click on the Handle (Resize)
		if (target.classList.contains('handle')) {
			isResizing = true;
			activeHandle = target;
			e.stopPropagation();
			return;
		}

		// If you click on the Box (Move)
		if (target === Selector.box || Selector.box.contains(target)) {
			if (target.classList.contains('measure-badge')) return;

			isMoving = true;
			const rect = Selector.box.getBoundingClientRect();
			offsetX = e.clientX - rect.left;
			offsetY = e.clientY - rect.top;
			e.stopPropagation();
			return;
		}

		// If you click on an empty area (Draw)
		// Only start drawing if you click on the overlay layer
		if (target.classList.contains('measure-overlay')) {
			isDrawing = true;
			startX = e.clientX;
			startY = e.clientY;

			// Reset box về vị trí click đầu tiên
			Selector.update({ x: startX, y: startY, w: 0, h: 0 });
		}
	});

	window.addEventListener('mousemove', (e) => {
		let currentRect = null;

		if (isDrawing) {
			// New drawing: Change both position and size
			currentRect = Utils.calculateRect(startX, startY, e.clientX, e.clientY);
			Selector.update(currentRect);
		}
		else if (isResizing) {
			// Resize: Use Resizer logic
			Resizer.applyResize(Selector.box, activeHandle, e.clientX, e.clientY);
			const b = Selector.box.getBoundingClientRect();
			currentRect = { x: b.left, y: b.top, w: b.width, h: b.height };
		}
		else if (isMoving) {
			// MOVE: Keep W and H the same, only change X and Y
			const newX = e.clientX - offsetX;
			const newY = e.clientY - offsetY;

			Selector.box.style.left = newX + 'px';
			Selector.box.style.top = newY + 'px';

			// Use the current parameters to update the Stats table without changing the size.
			const b = Selector.box.getBoundingClientRect();
			currentRect = { x: newX, y: newY, w: b.width, h: b.height };
		}

		if (currentRect) {
			StatsBox.update(currentRect);
		}
	});

	window.addEventListener('mouseup', () => {
		if (isDrawing) {
			Resizer.createHandles(Selector.box);
		}
		isDrawing = false;
		isResizing = false;
		isMoving = false;
		activeHandle = null;
	});
}