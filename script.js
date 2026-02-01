const audio = document.getElementById("audio");

const playButton = document.getElementById("playButton");
const bottomPlay = document.getElementById("bottomPlay");

const bottomBar = document.getElementById("bottomBar");
const progress = document.getElementById("progress");

/* Play / Pause toggle */
function togglePlay() {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

/* Button clicks */
playButton.addEventListener("click", togglePlay);
bottomPlay.addEventListener("click", togglePlay);

/* Sync UI when playing */
audio.addEventListener("play", () => {
  playButton.textContent = "❚❚";
  bottomPlay.textContent = "❚❚";
  bottomBar.style.display = "flex";
});

/* Sync UI when paused */
audio.addEventListener("pause", () => {
  playButton.textContent = "▶";
  bottomPlay.textContent = "▶";
});

/* Update progress bar */
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.value = percent;
  }
});

/* Seek when user drags bar */
progress.addEventListener("input", () => {
  if (audio.duration) {
    audio.currentTime = (progress.value / 100) * audio.duration;
  }
});
