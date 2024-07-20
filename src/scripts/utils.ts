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

export function validateForm(formElement: HTMLFormElement) {
	const submitButton = formElement.querySelector<HTMLButtonElement>(
		'button[type="submit"]'
	)!;

	let isValid = true;

	const formFields = formElement.querySelectorAll<
		HTMLInputElement | HTMLTextAreaElement
	>("input[required], select[required], textarea[required]");
	formFields.forEach((input) => {
		if (!input.value.trim()) {
			isValid = false;
		}
	});

	submitButton.disabled = !isValid;
}

interface FormSuccessProps {
	formElement: HTMLFormElement;
	successMessage: string;
	buttonLabel?: string;
	clearForm?: boolean;
	hideForm?: boolean;
}

export function handleFormSuccess(props: FormSuccessProps) {
	const { formElement, successMessage, buttonLabel, clearForm, hideForm } =
		props;

	const feedbackMessage = formElement.querySelector(".feedback-message")!;
	feedbackMessage.textContent = successMessage;
	feedbackMessage.classList.remove("error");
	feedbackMessage.classList.add("success");

	if (buttonLabel) {
		const submitButton = formElement.querySelector<HTMLButtonElement>(
			'button[type="submit"]'
		)!;
		submitButton.textContent = buttonLabel;
	}

	if (hideForm) {
		const fields = formElement.querySelectorAll<HTMLElement>(".field-w");
		fields.forEach((field) => {
			field.classList.add("success");
		});

		const submitButton = formElement.querySelector<HTMLButtonElement>(
			'button[type="submit"]'
		)!;
		submitButton.style.display = "none";
	}

	if (clearForm) {
		const fields = formElement.querySelectorAll<
			HTMLInputElement | HTMLTextAreaElement
		>("input, textarea");
		fields.forEach((field) => {
			field.value = "";
		});
	}
}

interface FormErrorProps {
	formElement: HTMLFormElement;
	errorMessage: string;
	buttonLabel: string;
}

export function handleFormError(props: FormErrorProps) {
	const { formElement, errorMessage, buttonLabel } = props;

	const feedbackMessage = formElement.querySelector(".feedback-message")!;
	feedbackMessage.textContent = errorMessage;
	feedbackMessage.classList.remove("success");
	feedbackMessage.classList.add("error");

	const submitButton = formElement.querySelector<HTMLButtonElement>(
		'button[type="submit"]'
	)!;
	submitButton.textContent = buttonLabel;
}

export function cleanForm(formElement: HTMLFormElement) {
	const feedbackMessage = formElement.querySelector(".feedback-message")!;
	feedbackMessage.textContent = "";
	feedbackMessage.classList.remove("success");
	feedbackMessage.classList.remove("error");

	const fields = formElement.querySelectorAll<HTMLElement>(".field-w");
	fields.forEach((field) => {
		field.classList.remove("success");
	});

	const submitButton = formElement.querySelector<HTMLButtonElement>(
		'button[type="submit"]'
	)!;
	submitButton.style.display = "block";

	console.log("Form cleaned");
}
