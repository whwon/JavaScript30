function playSound(keyCode) {
  if (!keyCode) return;

  const audio = document.querySelector(`audio[data-key="${keyCode}"]`);
  const key = document.querySelector(`div[data-key="${keyCode}"]`);

  if (!audio) return;

  key.classList.add("playing");

  /**
   * If the user clicks on the down key multiple times we want the audio to
   * replay the sound instead of finishing one sound made from the first
   * registered click. To accommodate for this, we set the currentTime to
   * zero so that it "rewinds" and replays the audio from the very beginning.
   */
  audio.currentTime = 0;
  audio.play();
}

function handleClick() {
  if (!this?.dataset?.key) return;
  playSound(this.dataset.key);
}

function handleKeyDown(e) {
  if (!e.keyCode) return;
  playSound(e.keyCode);
}

/**
 * Since we want to remove the CSS whenever the keydown has been clicked
 * to reset it back to its original look, we look at the CSS value.
 * @param {*} e
 * @returns
 */
function removeTransition(e) {
  /**
   * The property name is "transform" because that is the value of the class
   * name. "playing".
   */
  if (e.propertyName !== "transform") return;
  this.classList.remove("playing");
}

const keys = document.querySelectorAll(".key");
/**
 * The transitionend -> "transition end" is listened for so that when the CSS
 * attribute "transition" finishes its render after the given time, we want to
 * follow up by removing the added CSS class name. This is a better approach
 * than hardcoding since if the CSS value changes we would need to mirror it on
 * the JS, but by doing it like so it will always be dynamic. Another way could
 * have been to wait until the audio finishes playing but visually it did not
 * accomplish our goal of the keys flickers for each click.
 */
keys.forEach((key) => key.addEventListener("transitionend", removeTransition));
keys.forEach((key) => key.addEventListener("click", handleClick));
window.addEventListener("keydown", handleKeyDown);
