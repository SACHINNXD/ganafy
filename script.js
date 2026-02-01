const audio = document.getElementById("audio");

const playButton = document.getElementById("playButton");
const bottomPlay = document.getElementById("bottomPlay");

const bottomBar = document.getElementById("bottomBar");
const progress = document.getElementById("progress");

const songName = "MXRCVRY - AYUDA";

/* Play / Pause */
function togglePlay() {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

playButton.addEventListener("click", togglePlay);
bottomPlay.addEventListener("click", togglePlay);

/* On play */
audio.addEventListener("play", () => {
  playButton.textContent = "❚❚";
  bottomPlay.textContent = "❚❚";
  bottomBar.style.display = "flex";
  document.title = `ganafy | ${songName}`;
});

/* On pause */
audio.addEventListener("pause", () => {
  playButton.textContent = "▶";
  bottomPlay.textContent = "▶";
  document.title = "ganafy";
});

/* Progress update */
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    progress.value = (audio.currentTime / audio.duration) * 100;
  }
});

/* Seek */
progress.addEventListener("input", () => {
  if (audio.duration) {
    audio.currentTime = (progress.value / 100) * audio.duration;
  }
});
