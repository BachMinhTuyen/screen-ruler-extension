const Selector = {
	box: null,
	badge: null,

	init(container) {
		this.box = document.createElement('div');
		this.box.className = 'measure-box';
		this.box.style.display = 'none';

		this.badge = document.createElement('div');
		this.badge.className = 'measure-badge';

		this.box.appendChild(this.badge);
		container.appendChild(this.box);
	},

	update(rect) {
		const { x, y, w, h } = rect;

		this.box.style.left = `${x}px`;
		this.box.style.top = `${y}px`;
		this.box.style.width = `${w}px`;
		this.box.style.height = `${h}px`;
		this.box.style.display = 'block';

		this.badge.textContent = `${Math.round(w)} × ${Math.round(h)} px`;

		const atTop = y < 30;
		const atLeft = x < 5;

		if (atTop) {
			this.box.classList.add('is-top-edge');
		} else {
			this.box.classList.remove('is-top-edge');
		}

		if (atLeft) {
			this.box.classList.add('is-left-edge');
		} else {
			this.box.classList.remove('is-left-edge');
		}
	}
};