// Get all the elements
const player = document.querySelector(".player");
const video = player.querySelector(".viewer");
const progress = player.querySelector(".progress");
const progressBar = player.querySelector(".progress__filled");
const toggle = player.querySelector(".toggle");
const ranges = player.querySelectorAll(".player__slider");
const skipButtons = player.querySelectorAll("[data-skip]");

// Build out functions
function togglePlay() {
  const method = video.paused ? "play" : "pause";
  video[method]();
}

function updateButton() {
  const icon = this.paused ? "►" : "❚ ❚";
  toggle.textContent = icon;
}

function handleKeyDown(e) {
  if (e.code === "Space" || e.key === "Enter") togglePlay();
  /**
   * Since we do not have access to the dataset property when we do
   * not click on the button itself, we simply pass in the value
   * we want to skip manually. Basically, we are defaulting it.
   * In the future I guess we can create a dropdown that has a
   * data-set of time the user can choose from.
   */
  if (e.code === "ArrowLeft") skip(-10);
  if (e.code === "ArrowRight") skip(25);
  if (e.code === "ArrowUp" || e.code === "ArrowDown") handleVolume(e.code);
}

function skip(dataset) {
  video.currentTime += parseFloat(this.dataset?.skip || dataset);
}

/**
 * We are simply utilizing the attributes that are set on the HTML element
 * and then using the this keyword to access the value of the attribute.
 */
function handleRangeUpdate() {
  video[this.name] = this.value;
}

function handleVolume(keyPressed) {
  if (keyPressed === "ArrowDown" && video.volume > 0) {
    if (video.volume <= 0.1) video.volume = 0;
    else video.volume -= 0.1;
  }
  if (keyPressed === "ArrowUp" && video.volume < 1) {
    if (video.volume >= 0.9) video.volume = 1;
    else video.volume += 0.1;
  }
  video["volume"] = video.volume;
}

function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
  /**
   * Basically get the percentage by getting the length of the video
   * in terms of the width of the progress bar and then multiply it
   * by the duration of the video.
   */
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}

video.addEventListener("click", togglePlay);
video.addEventListener("play", updateButton);
video.addEventListener("pause", updateButton);
video.addEventListener("progress", handleProgress);

toggle.addEventListener("click", togglePlay);

window.addEventListener("keydown", handleKeyDown);

skipButtons.forEach((button) => button.addEventListener("click", skip));

ranges.forEach((range) => range.addEventListener("change", handleRangeUpdate));
ranges.forEach((range) => range.addEventListener("mousemove", handleRangeUpdate));

let mousedown = false;
progress.addEventListener("click", scrub);
progress.addEventListener("mousemove", (e) => mousedown && scrub(e));
progress.addEventListener("mousedown", () => (mousedown = true));
progress.addEventListener("mouseup", () => (mousedown = false));
