import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function initGSAPLenis() {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  "use strict";

  lenis = new Lenis({
    duration: 0.9,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: "vertical",
    gestureDirection: "vertical",
    smooth: false,
    mouseMultiplier: 0.6,
    smoothTouch: false,
    touchMultiplier: 1.2,
    infinite: false
  });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

  return ScrollTrigger;
}

initGSAPLenis();

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// On Resize Function
let windowWidth = window.innerWidth;

function onResize(passedFunction) {
  if (window.innerWidth !== windowWidth) {
      windowWidth = window.innerWidth;

    passedFunction();
  }
}

window.addEventListener('resize', throttle(() => onResize(initMarquees), 250));

// Toggle Page Scroll
export function togglePageScroll(enable) {
  if (enable) {
    document.body.style.overflow = '';
    lenis.start();
  } else {
    document.body.style.overflow = 'hidden';
    lenis.stop();
  }
}