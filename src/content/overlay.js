const OverlayManager = {
	element: null,
	overlayInner: null,
	originalStyles: {
		paddingRight: '',
		overflow: ''
	},

	create() {
		if (this.element) return this.overlayInner;

		const hasScroll = document.body.scrollHeight > window.innerHeight;

		if (hasScroll) {
			const sbWidth = Utils.getScrollbarWidth();

			this.originalStyles.paddingRight = document.body.style.paddingRight;
			this.originalStyles.overflow = document.body.style.overflow;

			const computedPadding = parseFloat(window.getComputedStyle(document.body).paddingRight) || 0;

			document.body.style.paddingRight = `${computedPadding + sbWidth}px`;
			document.body.style.overflow = 'hidden';
		}

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
			document.body.style.paddingRight = this.originalStyles.paddingRight;
			document.body.style.overflow = this.originalStyles.overflow;

			this.element.remove();
			this.element = null;
			this.overlayInner = null;
		}
	}
};