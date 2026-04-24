const Utils = {
	calculateRect(startX, startY, endX, endY) {
		return {
			x: Math.min(startX, endX),
			y: Math.min(startY, endY),
			w: Math.abs(startX - endX),
			h: Math.abs(startY - endY)
		};
	},

	getScrollbarWidth() {
		const outer = document.createElement('div');
		outer.style.visibility = 'hidden';
		outer.style.overflow = 'scroll';
		document.body.appendChild(outer);

		const inner = document.createElement('div');
		outer.appendChild(inner);

		const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

		outer.parentNode.removeChild(outer);
		return scrollbarWidth;
	}
};