/* function throttle(func, limit: number) {
    let inThrottle: boolean | null;
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

export function onResize(passedFunction: () => void): void {
  if (window.innerWidth !== windowWidth) {
      windowWidth = window.innerWidth;

    passedFunction();
  }
} */

/* window.addEventListener('resize', throttle(() => onResize(initMarquees), 250)); */

// Toggle Page Scroll
export function togglePageScroll(enable: boolean) {
  if (enable) {
    document.body.style.overflow = '';
  } else {
    document.body.style.overflow = 'hidden';
  }
};