import { lenis } from "./init";

// Throttle Function
function throttle(func: Function, limit: number) {
	let inThrottle: boolean;
	return function () {
		const args = arguments;
		const context = this;
		if (!inThrottle) {
			func.apply(context, args);
			inThrottle = true;
			setTimeout(() => {
				inThrottle = false;
			}, limit);
		}
	};
}

// Resize Function
// Validation to prevent resize events on iOS Safari
let windowWidth = window.innerWidth;
export function onResize(passedFunction: Function) {
	return function () {
		if (window.innerWidth !== windowWidth) {
			const throttledFunction = throttle(passedFunction, 250);
			windowWidth = window.innerWidth;
			throttledFunction();
		}
	};
}

// Toggle Page Scroll
export function togglePageScroll(enable: boolean) {
	if (enable) {
		document.body.style.overflow = "visible";
		lenis.start();
	} else {
		document.body.style.overflow = "hidden";
		lenis.stop();
	}
}

export function validateForm(form: HTMLFormElement) {
	const submitButton: HTMLButtonElement | null = form?.querySelector(
		'button[type="submit"]'
	);

	if (!submitButton) return;

	let isValid = true;

	const formFields: NodeListOf<HTMLInputElement> = form.querySelectorAll(
		"input[required], select[required], textarea[required]"
	);
	formFields.forEach((input) => {
		if (!input.value.trim()) {
			isValid = false;
		}
	});

	submitButton.disabled = !isValid;
}

export function handleFormError(error: Error, errorCount: number) {
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
	/* displayModalMessage(errorMessage, "error"); */

	return errorCount + 1; // Return the incremented errorCount
}
