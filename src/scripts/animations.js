import { gsap } from "gsap";

// Animate Ticker Label on Button
export function tickerLinkHover(
  input,
  newLabel,
  customDuration,
  manualLabelReset
) {
  const labelText = input.querySelector(".label");
  const labelWrapper = labelText.parentNode;
  const animationDuration = customDuration || 0.25;
  const animationEase = "power1.out";

  function resetLinkLabel() {
    const duplicatedLabel = labelWrapper.querySelector(".duplicated-label");
    gsap.to(labelText, {
      y: 0,
      duration: animationDuration,
      ease: animationEase,
    });
    gsap.to(duplicatedLabel, {
      y: "100%",
      duration: animationDuration,
      ease: animationEase,
      onComplete: () => {
        duplicatedLabel?.remove();
        if (!manualLabelReset) {
          input.removeEventListener("mouseout", resetLinkLabel);
        }
      },
    });
  }

  let duplicatedLabel = input.querySelector(".duplicated-label");
  if (duplicatedLabel) {
    resetLinkLabel(duplicatedLabel);
    return;
  }

  // Logic for hover in
  duplicatedLabel = labelText.cloneNode(true);
  Object.assign(duplicatedLabel.style, {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
  });
  duplicatedLabel.classList.add("duplicated-label");

  if (newLabel) {
    duplicatedLabel.textContent = newLabel;
  }

  labelWrapper.appendChild(duplicatedLabel);

  // Start animation for hover in
  gsap.to(labelText, {
    y: "-100%",
    duration: animationDuration,
    ease: animationEase,
  });
  gsap.from(duplicatedLabel, {
    y: "100%",
    duration: animationDuration,
    ease: animationEase,
  });

  // Attach the mouse-out event listener to handle automatic mouse-out animation
  if (!manualLabelReset) {
    input.addEventListener("mouseout", resetLinkLabel);
  }
}

export function imageParallax(image, start, end, startPosition, endPosition) {
  if (image) {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: image,
          start: start,
          end: end,
          scrub: true,
        },
      })
      .fromTo(
        image,
        { y: startPosition },
        { y: endPosition, ease: "none" },
        "start"
      );
  } else {
    console.log("can't find image");
  }
}

export function initMarquee(marquee, speed) {
  if (!marquee) return null;

  // Remove existing GSAP animations if any
  if (marquee.marqueeTimeline) {
    marquee.marqueeTimeline.kill();
  }

  let marqueeSplits = marquee.querySelectorAll(".marquee-split");
  marqueeSplits.forEach((split, index) => {
    if (index > 0) {
      split.remove();
    }
  });

  const marqueeSplit = marquee.querySelector(".marquee-split");
  const marqueeBlock = marqueeSplit?.querySelector(".marquee-block");
  if (!marqueeSplit || !marqueeBlock) return;

  marqueeSplit.innerHTML = "";
  marqueeSplit.appendChild(marqueeBlock.cloneNode(true));

  const marqueeWidth = marquee.offsetWidth;
  let totalWidth = marqueeBlock.offsetWidth;

  while (totalWidth < marqueeWidth) {
    const cloneBlock = marqueeBlock.cloneNode(true);
    marqueeSplit.appendChild(cloneBlock);
    totalWidth += cloneBlock.offsetWidth;
  }

  const duplicatedMarqueeSplit = marqueeSplit.cloneNode(true);
  marquee.appendChild(duplicatedMarqueeSplit);

  marqueeSplits = marquee.querySelectorAll(".marquee-split");
  gsap.set(marqueeSplits, { x: 0 });

  let marqueeTimeline = gsap.timeline({
    repeat: -1,
    defaults: { ease: "linear" },
  });

  marqueeSplits.forEach((split) => {
    marqueeTimeline.to(split, { x: "-100%", duration: speed }, 0);
  });

  // Store the timeline in the marquee element for later reference
  marquee.marqueeTimeline = marqueeTimeline;

  return marqueeTimeline;
}