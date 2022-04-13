window.addEventListener('DOMContentLoaded', () => {
	hashChangeOnHeadingsModule();
	frameworkDisplayModule();
	codeViewerModule();
});

function codeViewerModule() {
	function applyFileSelected(codeViewerId) {
		for (const $fileSelected of document.querySelectorAll(`[data-codeviewer=${codeViewerId}][data-file-selected]`)) {
			const filenameSelected = $fileSelected.getAttribute('data-file-selected');
			for (const $file of $fileSelected.querySelectorAll('[data-file]')) {
				const filename = $file.getAttribute('data-file');
				$file.style.display = filename === filenameSelected ? 'block' : 'none';
			}

			for (const $fileButton of document.querySelectorAll(`[data-codeviewer=${codeViewerId}][data-file-button]`)) {
				const filename = $fileButton.getAttribute('data-file-button');
				$fileButton.style.fontWeight = filename === filenameSelected ? 600 : 400;
			}
		}
	}

	for (const $fileButton of document.querySelectorAll('[data-file-button]')) {
		$fileButton.addEventListener('click', () => {
			const filename = $fileButton.getAttribute('data-file-button');
			const codeViewerId = $fileButton.getAttribute('data-codeviewer');
			const target = document.querySelector(`[data-codeviewer=${codeViewerId}][data-file-selected]`);
			target.setAttribute('data-file-selected', filename);
			applyFileSelected(codeViewerId);
		});
	}
}

function frameworkDisplayModule() {
	const frameworks = ['react', 'svelte', 'angular', 'vue3'];

	const $ = {
		fmwButtonHide: (framework) => document.querySelectorAll(framework ? `[data-framework-button-hide=${framework}]` : '[data-framework-button-hide]'),
		fmwButtonShow: (framework) => document.querySelectorAll(framework ? `[data-framework-button-show=${framework}]` : '[data-framework-button-show]'),
		fmwContent: (framework) => document.querySelectorAll(`[data-framework-content=${framework}]`),
	};

	const hiddenFrameworksProxy = createLocaleStorageProxy('hidden_frameworks');

	function onFramework(framework) {
		return {
			show() {
				if (hiddenFrameworksProxy.includes(framework)) {
					const frameworkIndex = hiddenFrameworksProxy.indexOf(framework);
					delete hiddenFrameworksProxy[frameworkIndex];
				}
				apply();
			},
			hide() {
				if (!hiddenFrameworksProxy.includes(framework)) {
					hiddenFrameworksProxy.push(framework);
				}
				apply();
			},
		};
	}

	function apply() {
		for (const frameworkToHide of Object.values(hiddenFrameworksProxy)) {
			for (const $el of $.fmwContent(frameworkToHide)) {
				$el.style.display = 'none';
			}
			for (const $el of $.fmwButtonShow(frameworkToHide)) {
				$el.style.display = 'block';
			}
		}

		for (const frameworkToShow of arrayDiff(Object.values(hiddenFrameworksProxy), frameworks)) {
			for (const $el of $.fmwContent(frameworkToShow)) {
				$el.style.display = 'block';
			}
			for (const $el of $.fmwButtonShow(frameworkToShow)) {
				$el.style.display = 'none';
			}
		}
	}

	apply();

	for (const $fmwButton of $.fmwButtonHide()) {
		const framework = $fmwButton.getAttribute('data-framework-button-hide');
		$fmwButton.addEventListener('click', () => {
			onFramework(framework).hide();
		});
	}

	for (const $fmwButton of $.fmwButtonShow()) {
		const framework = $fmwButton.getAttribute('data-framework-button-show');
		$fmwButton.addEventListener('click', () => {
			onFramework(framework).show();
		});
	}
}

function hashChangeOnHeadingsModule() {
	const anchorObserver = new IntersectionObserver((entries) => {
		for (const entry of entries) {
			if (entry.isIntersecting) {
				const { target } = entry;
				window.history.pushState({}, '', `#${target.id}`);
			}
		}
	});
	for (const $heading of document.querySelectorAll('#main-content h1, #main-content h2')) {
		anchorObserver.observe($heading);
	}
}

function createLocaleStorageProxy(key) {
	const storage = createLocaleStorage(key);

	return new Proxy(storage.getJSON() || [], {
		get(target, prop) {
			return target[prop];
		},
		set(target, prop, value, receiver) {
			target[prop] = value;
			storage.setJSON(receiver);
			return true;
		},
		deleteProperty(target, prop) {
			target.splice(prop, 1);
			storage.setJSON(target);
			return true;
		},
	});
}

function createLocaleStorage(k) {
	function get() {
		return localStorage.getItem(k);
	}
	return {
		get,
		getJSON() {
			var value = get();
			if (value) {
				try {
					return JSON.parse(value);
				} catch (err) {
					console.error({ getJSONErr: err });
					return undefined;
				}
			}
		},
		setJSON(o) {
			this.set(JSON.stringify(o));
		},
		set(v) {
			localStorage.setItem(k, v);
		},
		remove() {
			localStorage.removeItem(k);
		},
	};
}

function arrayDiff(a1, a2) {
	var diff = {};

	for (var i = 0; i < a1.length; i++) {
		diff[a1[i]] = true;
	}

	for (var i = 0; i < a2.length; i++) {
		if (diff[a2[i]]) {
			delete diff[a2[i]];
		} else {
			diff[a2[i]] = true;
		}
	}

	return Object.keys(diff);
}
