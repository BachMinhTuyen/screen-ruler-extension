const Utils = {
	calculateRect(startX, startY, endX, endY) {
		return {
			x: Math.min(startX, endX),
			y: Math.min(startY, endY),
			w: Math.abs(startX - endX),
			h: Math.abs(startY - endY)
		};
	}
};