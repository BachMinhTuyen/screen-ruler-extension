const Resizer = {
	createHandles(parent) {
		if (parent.querySelectorAll('.handle').length > 0) return;
		const dirs = ['tl', 'tr', 'bl', 'br', 't', 'b', 'l', 'r'];
		dirs.forEach(dir => {
			const h = document.createElement('div');
			h.className = `handle handle-${dir}`;
			h.dataset.direction = dir;
			parent.appendChild(h);
		});
	},

	applyResize(box, activeHandle, currX, currY) {
		const rect = box.getBoundingClientRect();
		const dir = activeHandle.dataset.direction;
		let { left, top, width, height } = rect;

		if (dir.includes('r')) width = currX - rect.left;
		if (dir.includes('l')) {
			width = rect.right - currX;
			left = currX;
		}
		if (dir.includes('b')) height = currY - rect.top;
		if (dir.includes('t')) {
			height = rect.bottom - currY;
			top = currY;
		}

		box.style.left = left + 'px';
		box.style.top = top + 'px';
		box.style.width = width + 'px';
		box.style.height = height + 'px';

		const badge = box.querySelector('.measure-badge');
		badge.innerText = `${Math.round(width)}px × ${Math.round(height)}px`;
	}
};