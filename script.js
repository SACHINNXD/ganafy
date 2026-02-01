/* =========================
   ELEMENT REFERENCES
========================= */
const audio = document.getElementById("audio");

const playButton = document.getElementById("playButton");
const bottomPlay = document.getElementById("bottomPlay");
const closePlayer = document.getElementById("closePlayer");

const bottomBar = document.getElementById("bottomBar");
const progress = document.getElementById("progress");

const songName = "MXRCVRY - AYUDA";

/* =========================
   PLAY / PAUSE TOGGLE
========================= */
function togglePlay() {
  // User explicitly plays again → allow popup
  localStorage.removeItem("ganafy_closed");

  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

/* Buttons exist on both pages */
if (playButton) playButton.addEventListener("click", togglePlay);
if (bottomPlay) bottomPlay.addEventListener("click", togglePlay);

/* =========================
   AUDIO EVENTS
========================= */
audio.addEventListener("play", () => {
  if (playButton) playButton.textContent = "❚❚";
  if (bottomPlay) bottomPlay.textContent = "❚❚";

  if (bottomBar) bottomBar.style.display = "flex";

  document.title = `ganafy | ${songName}`;

  localStorage.setItem("ganafy_playing", "true");
});

audio.addEventListener("pause", () => {
  if (playButton) playButton.textContent = "▶";
  if (bottomPlay) bottomPlay.textContent = "▶";

  document.title = "ganafy";

  localStorage.setItem("ganafy_playing", "false");
});

/* =========================
   PROGRESS BAR
========================= */
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;

  if (progress) {
    progress.value = (audio.currentTime / audio.duration) * 100;
  }

  localStorage.setItem("ganafy_time", audio.currentTime);
});

if (progress) {
  progress.addEventListener("input", () => {
    if (!audio.duration) return;

    audio.currentTime = (progress.value / 100) * audio.duration;
    localStorage.setItem("ganafy_time", audio.currentTime);
  });
}

/* =========================
   CLOSE PLAYER (PERMANENT)
========================= */
if (closePlayer) {
  closePlayer.addEventListener("click", () => {
    audio.pause();
    audio.currentTime = 0;

    if (bottomBar) bottomBar.style.display = "none";

    if (playButton) playButton.textContent = "▶";
    if (bottomPlay) bottomPlay.textContent = "▶";

    document.title = "ganafy";

    // Permanent close
    localStorage.setItem("ganafy_closed", "true");
    localStorage.removeItem("ganafy_time");
    localStorage.removeItem("ganafy_playing");
  });
}

/* =========================
   RESTORE ON PAGE LOAD
========================= */
window.addEventListener("load", () => {
  // If user closed player explicitly → never restore
  if (localStorage.getItem("ganafy_closed") === "true") return;

  const savedTime = localStorage.getItem("ganafy_time");
  const wasPlaying = localStorage.getItem("ganafy_playing");

  if (savedTime !== null) {
    audio.currentTime = parseFloat(savedTime);
    if (bottomBar) bottomBar.style.display = "flex";
  }

  if (wasPlaying === "true") {
    audio.play();
  }
});
