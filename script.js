const audio = document.getElementById("audio");

const playButton = document.getElementById("playButton");
const bottomPlay = document.getElementById("bottomPlay");

const bottomBar = document.getElementById("bottomBar");
const progress = document.getElementById("progress");

const songName = "MXRCVRY - AYUDA";

/* ---------- PLAY / PAUSE ---------- */
function togglePlay() {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

playButton.addEventListener("click", togglePlay);
bottomPlay.addEventListener("click", togglePlay);

/* ---------- UI SYNC ---------- */
audio.addEventListener("play", () => {
  playButton.textContent = "❚❚";
  bottomPlay.textContent = "❚❚";
  bottomBar.style.display = "flex";
  document.title = `ganafy | ${songName}`;
  saveState(true);
});

audio.addEventListener("pause", () => {
  playButton.textContent = "▶";
  bottomPlay.textContent = "▶";
  document.title = "ganafy";
  saveState(false);
});

/* ---------- PROGRESS ---------- */
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    progress.value = (audio.currentTime / audio.duration) * 100;
    saveTime();
  }
});

progress.addEventListener("input", () => {
  if (audio.duration) {
    audio.currentTime = (progress.value / 100) * audio.duration;
    saveTime();
  }
});

/* ---------- LOCAL STORAGE ---------- */
function saveTime() {
  localStorage.setItem("ganafy_time", audio.currentTime);
}

function saveState(isPlaying) {
  localStorage.setItem("ganafy_playing", isPlaying);
}

/* ---------- RESTORE ON LOAD ---------- */
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
