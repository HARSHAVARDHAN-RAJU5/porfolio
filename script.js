const path = document.getElementById("path");
const section = document.querySelector(".two");
const dot = document.querySelector(".dot");
const labels = document.querySelectorAll(".label");

const length = path.getTotalLength();

// prepare path
path.style.strokeDasharray = length;
path.style.strokeDashoffset = length;

// label trigger points (0–1)
const labelTimings = [0.33, 0.66, 1];

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  const start = section.offsetTop;
  const end = start + section.offsetHeight - window.innerHeight;
  if (end <= start) return;

  // BEFORE
  if (scrollY < start) {
    path.style.strokeDashoffset = length;

    const p0 = path.getPointAtLength(0);
    dot.setAttribute("cx", p0.x);
    dot.setAttribute("cy", p0.y);

    labels.forEach((label, i) => {
      const t = labelTimings[i] * length;
      const p = path.getPointAtLength(t);
      label.style.top = `${p.y}px`;
      label.style.opacity = 0;
      label.style.transform = "translateY(2px)";
    });
    return;
  }

  // AFTER
  if (scrollY > end) {
    path.style.strokeDashoffset = 0;

    const pEnd = path.getPointAtLength(length);
    dot.setAttribute("cx", pEnd.x);
    dot.setAttribute("cy", pEnd.y);

    labels.forEach((label, i) => {
      const t = labelTimings[i] * length;
      const p = path.getPointAtLength(t);
      label.style.top = `${p.y}px`;
      label.style.opacity = 1;
      label.style.transform = "translateY(0)";
    });
    return;
  }

  // INSIDE
  const progress = (scrollY - start) / (end - start);

  // draw path
  path.style.strokeDashoffset = length * (1 - progress);

  // move dot
  const pDot = path.getPointAtLength(progress * length);
  dot.setAttribute("cx", pDot.x);
  dot.setAttribute("cy", pDot.y);

  // position + reveal labels
  labels.forEach((label, i) => {
    const t = labelTimings[i] * length;
    const p = path.getPointAtLength(t);

    // 🔒 vertical lock to curve
    label.style.top = `${p.y}px`;

    if (progress >= labelTimings[i]) {
      label.style.opacity = 1;
      label.style.transform = "translateY(0)";
    } else {
      label.style.opacity = 0;
      label.style.transform = "translateY(2px)";
    }
  });
});
