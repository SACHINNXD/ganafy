const audio = document.getElementById("audio");

const playButton = document.getElementById("playButton");
const bottomPlay = document.getElementById("bottomPlay");
const closePlayer = document.getElementById("closePlayer");

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

/* Sync UI */
audio.addEventListener("play", () => {
  playButton.textContent = "❚❚";
  bottomPlay.textContent = "❚❚";
  bottomBar.style.display = "flex";
  document.title = `ganafy | ${songName}`;
  localStorage.setItem("ganafy_playing", "true");
});

audio.addEventListener("pause", () => {
  playButton.textContent = "▶";
  bottomPlay.textContent = "▶";
  document.title = "ganafy";
  localStorage.setItem("ganafy_playing", "false");
});

/* Progress */
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    progress.value = (audio.currentTime / audio.duration) * 100;
    localStorage.setItem("ganafy_time", audio.currentTime);
  }
});

progress.addEventListener("input", () => {
  if (audio.duration) {
    audio.currentTime = (progress.value / 100) * audio.duration;
    localStorage.setItem("ganafy_time", audio.currentTime);
  }
});

/* CLOSE PLAYER */
closePlayer.addEventListener("click", () => {
  audio.pause();
  audio.currentTime = 0;

  bottomBar.style.display = "none";

  playButton.textContent = "▶";
  bottomPlay.textContent = "▶";
  document.title = "ganafy";

  localStorage.removeItem("ganafy_time");
  localStorage.removeItem("ganafy_playing");
});

/* Restore on load */
window.addEventListener("load", () => {
  const savedTime = localStorage.getItem("ganafy_time");
  const wasPlaying = localStorage.getItem("ganafy_playing");

  if (savedTime !== null) {
    audio.currentTime = parseFloat(savedTime);
    bottomBar.style.display = "flex";
  }

  if (wasPlaying === "true") {
    audio.play();
  }
});
