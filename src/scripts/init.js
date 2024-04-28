import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import Lenis from "@studio-freight/lenis";

export let lenis; // Define lenis outside to make it exportable

function initGSAPLenis() {
	gsap.registerPlugin(ScrollTrigger, CustomEase);
	ScrollTrigger.config({ ignoreMobileResize: true });

	("use strict");

	lenis = new Lenis({
		duration: 0.9,
		easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
		direction: "vertical",
		gestureDirection: "vertical",
		smooth: false,
		mouseMultiplier: 0.6,
		smoothTouch: false,
		touchMultiplier: 1.2,
		infinite: false,
	});

	lenis.on("scroll", ScrollTrigger.update);
	gsap.ticker.add((time) => {
		lenis.raf(time * 1000);
	});

	return ScrollTrigger;
}

initGSAPLenis();

const cartButtons = document.querySelectorAll("button[data-modal=cart]");
cartButtons?.forEach((cartButton) => {
	cartButton.addEventListener("click", () => {
		Snipcart.api.theme.cart.open();
	});
});

export const easingSmall = CustomEase.create(
	"custom",
	"M0,0 C0.288,0 0.199,0.599 0.4,0.8 0.609,1.011 0.898,1 1,1 "
);
export const easingLarge = CustomEase.create(
	"custom",
	"M0,0 C0.3,0 0.387,0.256 0.455,0.512 0.517,0.75 0.599,1 1,1 "
);
