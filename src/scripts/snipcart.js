import { togglePageScroll } from "./utils";

const PUBLIC_SNIPCART_API_KEY = import.meta.env.PUBLIC_SNIPCART_API_KEY;

export function initSnipcart() {
	window.SnipcartSettings = {
		publicApiKey: PUBLIC_SNIPCART_API_KEY,
		loadCSS: false,
		loadStrategy: "on-user-interaction",
		templatesUrl: "/SnipcartTemplates.html",
	};

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

	const itemCountWrapper = document.querySelectorAll(".cart-counter-w");

	const updateItemCount = () => {
		if (window.Snipcart) {
			// Retrieve item count from sessionStorage
			let itemCount = sessionStorage.getItem("snipcartItemCount");
			const storageCount = itemCount;

			function setItemCounter() {
				if (itemCount > 0) {
					itemCountWrapper.forEach((wrapper) => {
						wrapper.style.display = "flex";
						wrapper
							.querySelectorAll(".cart-counter")
							.forEach((counter) => {
								counter.textContent = itemCount;
							});
					});
				} else {
					itemCountWrapper.forEach((wrapper) => {
						wrapper.style.display = "none";
					});
				}
			}

			if (itemCount) {
				setItemCounter();
			}

			// Get the cart item count from Snipcart
			itemCount = Snipcart.store.getState().cart.items.count;

			if (itemCount !== storageCount) {
				// Store the item count in session storage
				sessionStorage.setItem("snipcartItemCount", itemCount);

				// Run setItemCounter
				setItemCounter();
			}
		}
	};

	document.addEventListener("snipcart.ready", function () {
		// Add light theming and disable Lenis on cart
		Snipcart.events.on("snipcart.initialized", function () {
			document
				.getElementById("snipcart")
				.setAttribute("data-theme", "light");

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
				togglePageScroll(false);

				// Add a close event to the modal background on click
				const snipcartContainer = document.getElementById("snipcart");

				// Pause to let Snipcart add the modal and background
				setTimeout(function () {
					const snipcartBackground = snipcartContainer.querySelector(
						".snipcart-modal__container"
					);

					if (snipcartBackground) {
						snipcartBackground.addEventListener(
							"click",
							function (event) {
								if (
									event.target.classList.contains(
										"snipcart-modal__container"
									)
								)
									Snipcart.api.theme.cart.close();
							}
						);
					}
				}, 250);
			}

			if (routesChange.from !== "/" && routesChange.to === "/") {
				const snipcart = document.getElementById("snipcart");

				const snipcartModal =
					snipcart?.querySelector(".snipcart-modal");
				const snipcartModalBackground = snipcart?.querySelector(
					".snipcart-modal__container"
				);

				if (snipcartModal && snipcartModalBackground) {
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
				const snipcart = document.getElementById("snipcart");

				const snipcartModal =
					snipcart?.querySelector(".snipcart-modal");

				if (snipcartModal)
					snipcartModal.setAttribute("closing", "true");
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
