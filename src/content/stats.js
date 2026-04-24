const StatsBox = {
	element: null,
	isDragging: false,
	isDraggingManual: false,
	isDraggingInitialized: false,
	offsetX: 0,
	offsetY: 0,
	isLightMode: false,
	boundMouseMove: null,
	boundMouseUp: null,

	async init(container) {
		this.destroy();

		try {
			const result = await chrome.storage.local.get(['isLightMode']);
			this.isLightMode = result.isLightMode !== undefined ? result.isLightMode : false;
		} catch (e) {
			console.error("Storage read error:", e);
		}

		this.element = document.createElement('div');
		container.appendChild(this.element);

		this.updateTheme();

		this.setupDragging();
		this.setupManualInput();
		this.setupControls();
	},

	updateTheme() {
		const isLight = this.isLightMode;
		const name = chrome.runtime.getManifest().name;
		const version = chrome.runtime.getManifest().version;
		const relativePath = chrome.runtime.getManifest().icons["16"];
		const logoUrl = chrome.runtime.getURL(relativePath);

		const currentVals = {
			x: this.element?.querySelector('#stat-x')?.value || 0,
			y: this.element?.querySelector('#stat-y')?.value || 0,
			w: this.element?.querySelector('#stat-w')?.value || 0,
			h: this.element?.querySelector('#stat-h')?.value || 0
		};

		this.element.className = `measure-stats ${isLight ? 'light-mode' : 'dark-mode'}`;

		this.element.innerHTML = `
			<div class="stats-toolbar">
				<div class="brand-wrapper">
					<img src="${logoUrl}" alt="${name}" />
					<span class="version-tag">v${version}</span>
				</div>

				<div class="actions-wrapper">
					<button class="btn-icon btn-theme" title="Light/Dark Mode">
						<i data-lucide="${isLight ? 'sun' : 'moon'}"></i>
					</button>
					<button class="btn-icon btn-close" title="Turn Off">
						<i data-lucide="circle-power"></i>
					</button>
				</div>
			</div>
			<div class="space-y-3">
				<section class="flex-col">
					<div class="text-label mb-2">Position (px)</div>
					<div class="flex-row items-center justify-between gap-4">
						<span class="font-medium">X:</span>
						<input type="number" id="stat-x" value="${currentVals.x}" class="stat-input">
					</div>
					<div class="flex-row items-center justify-between gap-4 mt-1">
						<span class="font-medium">Y:</span>
						<input type="number" id="stat-y" value="${currentVals.y}" class="stat-input">
					</div>
				</section>

				<section class="flex-col">
					<div class="text-label mb-2">Size (px)</div>
					<div class="flex-row items-center justify-between gap-4">
						<span class="font-medium">W:</span>
						<input type="number" id="stat-w" value="${currentVals.w}" class="stat-input">
					</div>
					<div class="flex-row items-center justify-between gap-4 mt-1">
						<span class="font-medium">H:</span>
						<input type="number" id="stat-h" value="${currentVals.h}" class="stat-input">
					</div>
				</section>
			</div>
		`;

		this.refreshIcons();
		this.setupControls();
		this.setupManualInput();
	},

	refreshIcons() {
		if (typeof lucide !== 'undefined') {
			lucide.createIcons({
				attrs: {
					class: ['lucide-icon'],
					stroke: 'currentColor',
					'stroke-width': 2,
					width: 16,
					height: 16
				}
			});
		}
	},

	setupControls() {
		const themeBtn = this.element.querySelector('.btn-theme');
		themeBtn.onclick = async (e) => {
			e.stopPropagation();
			this.isLightMode = !this.isLightMode;

			await chrome.storage.local.set({ isLightMode: this.isLightMode });

			this.updateTheme();
		};

		const closeBtn = this.element.querySelector('.btn-close');
		closeBtn.onclick = (e) => {
			e.stopPropagation();
			this.destroy();
			if (typeof OverlayManager !== 'undefined') OverlayManager.destroy();

			chrome.runtime.sendMessage({ type: "RULER_CLOSED_MANUALLY" });
		};
	},

	setupDragging() {
		const handleMouseDown = (e) => {
			if (e.target.tagName === 'INPUT' || e.target.closest('button')) return;
			e.stopPropagation();
			this.isDragging = true;
			this.element.style.transition = 'none';
			const rect = this.element.getBoundingClientRect();
			this.offsetX = e.clientX - rect.left;
			this.offsetY = e.clientY - rect.top;
			this.element.classList.add('cursor-grabbing');
		};

		this.boundMouseMove = (e) => {
			if (!this.isDragging || !this.element) return;
			const newLeft = e.clientX - this.offsetX;
			const newTop = e.clientY - this.offsetY;
			this.element.style.left = `${newLeft}px`;
			this.element.style.top = `${newTop}px`;
			this.element.style.right = 'auto';
			this.element.style.bottom = 'auto';
		};

		this.boundMouseUp = () => {
			if (!this.isDragging) return;
			this.isDragging = false;
			if (this.element) {
				this.element.classList.remove('cursor-grabbing');
				this.element.style.transition = 'all 0.3s';
			}
		};

		this.element.addEventListener('mousedown', handleMouseDown);
		window.addEventListener('mousemove', this.boundMouseMove);
		window.addEventListener('mouseup', this.boundMouseUp);
		this.isDraggingInitialized = true;
	},

	update(rect) {
		if (!this.element || this.isDraggingManual) return;
		const setVal = (id, val) => {
			const el = this.element.querySelector(`#${id}`);
			if (el) el.value = Math.round(val);
		};
		setVal('stat-x', rect.x);
		setVal('stat-y', rect.y);
		setVal('stat-w', rect.w);
		setVal('stat-h', rect.h);
	},

	setupManualInput() {
		this.element.addEventListener('wheel', (e) => {
			e.stopPropagation();
		}, { passive: false });

		const inputs = ['stat-x', 'stat-y', 'stat-w', 'stat-h'];
		inputs.forEach(id => {
			const el = this.element.querySelector(`#${id}`);
			if (!el) return;

			el.onmousedown = (e) => e.stopPropagation();
			el.oninput = () => {
				this.isDraggingManual = true;
				this.applyManualChanges();
			};
			el.onblur = () => {
				this.isDraggingManual = false;
			};
		});
	},

	applyManualChanges() {
		const getValue = (id) => this.element.querySelector(`#${id}`).value;
		const x = getValue('stat-x'), y = getValue('stat-y'), w = getValue('stat-w'), h = getValue('stat-h');

		if (typeof Selector !== 'undefined' && Selector.box) {
			Selector.box.style.left = x + 'px';
			Selector.box.style.top = y + 'px';
			Selector.box.style.width = w + 'px';
			Selector.box.style.height = h + 'px';

			const badge = Selector.box.querySelector('.measure-badge');
			if (badge) badge.innerText = `${w}px × ${h}px`;
		}
	},

	destroy() {
		if (this.boundMouseMove) {
			window.removeEventListener('mousemove', this.boundMouseMove);
			this.boundMouseMove = null;
		}
		if (this.boundMouseUp) {
			window.removeEventListener('mouseup', this.boundMouseUp);
			this.boundMouseUp = null;
		}

		if (this.element) this.element.remove();

		this.element = null;
		this.isDragging = false;
		this.isDraggingInitialized = false;
	}
};