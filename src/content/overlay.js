const OverlayManager = {
	element: null,
	overlayInner: null,
	originalStyles: new Map(),

	create() {
		if (this.element) return this.overlayInner;

		const html = document.documentElement;
		const body = document.body;

		const scrollbarWidth = window.innerWidth - html.clientWidth;

		this._saveStyle(html, 'overflow');
		this._saveStyle(body, 'overflow');
		this._saveStyle(body, 'padding-right');

		html.style.setProperty('overflow', 'hidden', 'important');
		body.style.setProperty('overflow', 'hidden', 'important');

		if (scrollbarWidth > 0) {
			const currentPadding = parseFloat(window.getComputedStyle(body).paddingRight) || 0;
			body.style.setProperty('padding-right', `${currentPadding + scrollbarWidth}px`, 'important');
		}

		this.element = document.createElement('div');
		this.element.id = 'ruler-extension-root';

		this.element.innerHTML = '<div class="measure-overlay"></div>';
		this.overlayInner = this.element.firstChild;

		document.body.appendChild(this.element);

		this.boundPreventScroll = this._preventScroll.bind(this);
		window.addEventListener('wheel', this.boundPreventScroll, { passive: false, capture: true });

		return this.overlayInner;
	},

	destroy() {
		document.querySelectorAll('#ruler-extension-root').forEach(el => el.remove());

		const html = document.documentElement;
		const body = document.body;

		[html, body].forEach(el => {
			el.style.removeProperty('overflow');
			el.style.removeProperty('padding-right');
		});

		this.originalStyles.forEach((value, key) => {
			const [el, prop] = key.split(':');
			const target = el === 'html' ? html : body;
			target.style[prop] = value;
		});
		this.originalStyles.clear();

		window.removeEventListener('wheel', this.boundPreventScroll, { capture: true });

		this.element = null;
		this.overlayInner = null;
	},

	_preventScroll(e) {
		if (this.element && !this.element.contains(e.target)) {
			e.preventDefault();
			e.stopImmediatePropagation();
		}
	},

	_saveStyle(el, prop) {
		const key = `${el.tagName.toLowerCase()}:${prop}`;
		this.originalStyles.set(key, el.style[prop]);
	}
};