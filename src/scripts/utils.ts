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
		document.body.style.overflow = "visible";
	} else {
		document.body.style.overflow = "hidden";
	}
}

export function validateForm(form: HTMLFormElement) {
	const submitButton: HTMLButtonElement | null = form?.querySelector(
		'button[type="submit"]'
	);

	if (!submitButton) return;

	let isValid = true;

	form.querySelectorAll(
		"input[required], select[required], textarea[required]"
	).forEach((input) => {
		if (!input.value.trim()) {
			isValid = false;
		}
	});

	submitButton.disabled = !isValid;
}

export function handleFormError(error, errorCount) {
	let errorMessage;

	if (errorCount >= 1) {
		errorMessage =
			"Something is still wrong, maybe try emailing me. My email address is <a href='mailto:ayayves@gmail.com'>ayayves@gmail.com</a>.";
	} else {
		// Increment error count in the parent document
		errorMessage =
			"Something’s gone wrong in submitting the form. Please try again.";
	}

	console.error("Form submission error:", error);
	displayModalMessage(errorMessage, "error");

	return errorCount + 1; // Return the incremented errorCount
}
