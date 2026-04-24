const OverlayManager = {
	element: null,
	overlayInner: null,

	create() {
		this.element = document.createElement('div');
		this.element.id = 'ruler-extension-root';

		this.overlayInner = document.createElement('div');
		this.overlayInner.className = 'measure-overlay';

		this.element.appendChild(this.overlayInner);
		document.body.appendChild(this.element);

		return this.overlayInner;
	},

	destroy() {
		if (this.element) {
			this.element.remove();
			this.element = null;
			this.overlayInner = null;
		}
	}
};