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
		this.box.style.display = 'block';
		this.box.style.left = rect.x + 'px';
		this.box.style.top = rect.y + 'px';
		this.box.style.width = rect.w + 'px';
		this.box.style.height = rect.h + 'px';
		this.badge.innerText = `${rect.w}px × ${rect.h}px`;
	}
};