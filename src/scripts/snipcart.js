import { togglePageScroll } from "./utils";

const PUBLIC_SNIPCART_API_KEY = import.meta.env.PUBLIC_SNIPCART_API_KEY;

export function initSnipcart() {
	window.SnipcartSettings = {
		publicApiKey: PUBLIC_SNIPCART_API_KEY,
		loadCSS: false,
		loadStrategy: "on-user-interaction",
		templatesUrl: "/snipcart-templates.html",
	};

	// Supplied Snipcart Setup Script
	(function () {
		var c, d;
		(d = (c = window.SnipcartSettings).version) != null ||
			(c.version = "3.0");
		var s, S;
		(S = (s = window.SnipcartSettings).timeoutDuration) != null ||
			(s.timeoutDuration = 2750);
		var l, p;
		(p = (l = window.SnipcartSettings).domain) != null ||
			(l.domain = "cdn.snipcart.com");
		var w, u;
		(u = (w = window.SnipcartSettings).protocol) != null ||
			(w.protocol = "https");
		var m, g;
		(g = (m = window.SnipcartSettings).loadCSS) != null || (m.loadCSS = !0);
		var y =
				window.SnipcartSettings.version.includes("v3.0.0-ci") ||
				(window.SnipcartSettings.version != "3.0" &&
					window.SnipcartSettings.version.localeCompare(
						"3.4.0",
						void 0,
						{
							numeric: !0,
							sensitivity: "base",
						}
					) === -1),
			f = ["focus", "mouseover", "touchmove", "scroll", "keydown"];
		window.LoadSnipcart = o;
		document.readyState === "loading"
			? document.addEventListener("DOMContentLoaded", r)
			: r();
		function r() {
			window.SnipcartSettings.loadStrategy
				? window.SnipcartSettings.loadStrategy ===
						"on-user-interaction" &&
					(f.forEach(function (t) {
						return document.addEventListener(t, o);
					}),
					setTimeout(o, window.SnipcartSettings.timeoutDuration))
				: o();
		}
		var a = !1;
		function o() {
			if (a) return;
			a = !0;
			let t = document.getElementsByTagName("head")[0],
				n = document.querySelector("#snipcart"),
				i = document.querySelector(
					'src[src^="'
						.concat(window.SnipcartSettings.protocol, "://")
						.concat(
							window.SnipcartSettings.domain,
							'"][src$="snipcart.js"]'
						)
				),
				e = document.querySelector(
					'link[href^="'
						.concat(window.SnipcartSettings.protocol, "://")
						.concat(
							window.SnipcartSettings.domain,
							'"][href$="snipcart.css"]'
						)
				);
			n ||
				((n = document.createElement("div")),
				(n.id = "snipcart"),
				n.setAttribute("hidden", "true"),
				document.body.appendChild(n)),
				h(n),
				i ||
					((i = document.createElement("script")),
					(i.src = ""
						.concat(window.SnipcartSettings.protocol, "://")
						.concat(window.SnipcartSettings.domain, "/themes/v")
						.concat(
							window.SnipcartSettings.version,
							"/default/snipcart.js"
						)),
					(i.async = !0),
					t.appendChild(i)),
				!e &&
					window.SnipcartSettings.loadCSS &&
					((e = document.createElement("link")),
					(e.rel = "stylesheet"),
					(e.type = "text/css"),
					(e.href = ""
						.concat(window.SnipcartSettings.protocol, "://")
						.concat(window.SnipcartSettings.domain, "/themes/v")
						.concat(
							window.SnipcartSettings.version,
							"/default/snipcart.css"
						)),
					t.prepend(e)),
				f.forEach(function (v) {
					return document.removeEventListener(v, o);
				});
		}
		function h(t) {
			!y ||
				((t.dataset.apiKey = window.SnipcartSettings.publicApiKey),
				window.SnipcartSettings.addProductBehavior &&
					(t.dataset.configAddProductBehavior =
						window.SnipcartSettings.addProductBehavior),
				window.SnipcartSettings.modalStyle &&
					(t.dataset.configModalStyle =
						window.SnipcartSettings.modalStyle),
				window.SnipcartSettings.currency &&
					(t.dataset.currency = window.SnipcartSettings.currency),
				window.SnipcartSettings.templatesUrl &&
					(t.dataset.templatesUrl =
						window.SnipcartSettings.templatesUrl));
		}
	})();

	// Add click event listeners to cart buttons
	function initCartButtons() {
		const cartButtons = document.querySelectorAll("[data-modal='cart']");
		cartButtons.forEach((cartButton) => {
			cartButton.addEventListener("click", () => {
				Snipcart.api.theme.cart.open();
			});
		});
	}

	// Set the data-theme attribute on Snipcart
	function setModalTheme() {
		document.getElementById("snipcart").setAttribute("data-theme", "light");
	}

	// Set an event listener on backdrop when cart is open
	function setBackdropEventListeners() {
		setTimeout(function () {
			const snipcartContainer = document.getElementById("snipcart");
			const snipcartBackground = snipcartContainer.querySelector(
				".snipcart-modal__container"
			);

			function closeModal() {
				Snipcart.api.theme.cart.close();
				document.removeEventListener("keydown", handleEscapeClick);
				snipcartBackground.removeEventListener(
					"click",
					handleBackgroundClick
				);
			}

			function handleEscapeClick(event) {
				if (event.key === "Escape") closeModal();
			}

			function handleBackgroundClick(event) {
				if (
					event.target.classList.contains("snipcart-modal__container")
				)
					closeModal();
			}

			if (snipcartBackground) {
				// Add ESC key event listener
				document.addEventListener("keydown", handleEscapeClick);

				// Add click on background event listener
				snipcartBackground.addEventListener(
					"click",
					handleBackgroundClick
				);
			}
		}, 800);
	}

	// When Snipcart is ready, run configuration scripts
	document.addEventListener("snipcart.ready", function () {
		// Add light theming, init cartButtons, and disable Lenis on cart
		Snipcart.events.on("snipcart.initialized", function () {
			setModalTheme();
			initCartButtons();

			document
				.getElementById("snipcart")
				.setAttribute("data-lenis-prevent", true);

			// Update cart item count in Navbar
			updateItemCount();
		});

		Snipcart.events.on("item.added", () => {
			updateItemCount();
		});

		Snipcart.events.on("item.updated", () => {
			updateItemCount();
		});

		Snipcart.events.on("item.removed", () => {
			updateItemCount();
		});

		Snipcart.events.on("theme.routechanged", (routesChange) => {
			if (routesChange.from === "/" && routesChange.to !== "/") {
				// Cart Opened
				setModalTheme();
				togglePageScroll(false);
				setBackdropEventListeners();
			}

			if (routesChange.from !== "/" && routesChange.to === "/") {
				// Cart Closed
				const snipcart = document.getElementById("snipcart");

				const snipcartModal =
					snipcart?.querySelector(".snipcart-modal");
				const snipcartModalBackground = snipcart?.querySelector(
					".snipcart-modal__container"
				);

				if (snipcartModal && snipcartModalBackground) {
					setBackdropEventListeners();
					snipcartModal.setAttribute("closing", "true");
					snipcartModalBackground.setAttribute("closing", "true");
					snipcartModal.addEventListener(
						"animationend",
						() => {
							togglePageScroll(true);
						},
						{ once: true }
					);
				}
			}

			if (
				routesChange.from === "/cart" &&
				routesChange.to === "/checkout"
			) {
				setModalTheme();
				const snipcart = document.getElementById("snipcart");

				setTimeout(function () {
					const snipcartTest = snipcart.querySelectorAll(
						".snipcart-modal__container"
					);
					console.log(snipcartTest);
				}, 100);

				const snipcartModal =
					snipcart?.querySelector(".snipcart-modal");
				const snipcartBackground = snipcart?.querySelector(
					".snipcart-modal__container"
				);

				if (snipcartModal) {
					setBackdropEventListeners();
					snipcartModal.setAttribute("closing", "true");
					snipcartBackground?.setAttribute("closing", "true");
				}
			}

			if (
				routesChange.from === "/checkout" &&
				routesChange.to === "/order"
			) {
				setModalTheme();
				const snipcart = document.getElementById("snipcart");

				const snipcartModal =
					snipcart?.querySelector(".snipcart-modal");

				if (snipcartModal) {
					setBackdropEventListeners();
					snipcartModal.setAttribute("closing", "true");
				}
			}
		});

		Snipcart.api.session.setLanguage("en", {
			// Message for too many items for the amount of stock
			errors: {
				quantity_revised:
					"Unfortunately, that's all the stock we have.",
				quantity_out_of_stock:
					"Unforunately, this product option is out of stock. Maybe try a different option.",
			},
		});
	});
}

// Retrieving & saving item count, and applying to string in cartButtons
export function updateItemCount() {
	// Retrieve item count from sessionStorage
	let itemCount = sessionStorage.getItem("snipcartItemCount");
	const itemCountWrapper = document.querySelectorAll(".cart-counter-w");

	// Set the item count as string in cartButtons
	function setItemCounter() {
		if (itemCount > 0) {
			itemCountWrapper.forEach((wrapper) => {
				wrapper.style.display = "flex";
				wrapper.querySelectorAll(".cart-counter").forEach((counter) => {
					counter.textContent = itemCount;
				});
			});
		} else {
			itemCountWrapper.forEach((wrapper) => {
				wrapper.style.display = "none";
			});
		}
	}

	// If item count exists in session storage, set as string on cartButtons
	if (itemCount) {
		setItemCounter();
	}

	// Call Snipcart for most up to date count and save to session storage
	if (window.Snipcart) {
		// Get the cart item count from Snipcart
		const newItemCount = Snipcart.store.getState().cart.items.count;

		// Store the item count in session storage
		sessionStorage.setItem("snipcartItemCount", newItemCount);

		// Run setItemCounter
		setItemCounter();
	}
}
