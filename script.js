const audio = document.getElementById("audio");

const playButton = document.getElementById("playButton");
const bottomPlay = document.getElementById("bottomPlay");
const closePlayer = document.getElementById("closePlayer");

const bottomBar = document.getElementById("bottomBar");
const progress = document.getElementById("progress");

const songName = "MXRCVRY - AYUDA";

/* Toggle play */
function togglePlay() {
  localStorage.removeItem("ganafy_closed");
  audio.paused ? audio.play() : audio.pause();
}

if (playButton) playButton.onclick = togglePlay;
if (bottomPlay) bottomPlay.onclick = togglePlay;

/* Sync UI */
audio.onplay = () => {
  if (playButton) playButton.textContent = "❚❚";
  if (bottomPlay) bottomPlay.textContent = "❚❚";
  if (bottomBar) bottomBar.style.display = "flex";
  document.title = `ganafy | ${songName}`;
  localStorage.setItem("ganafy_playing", "true");
};

audio.onpause = () => {
  if (playButton) playButton.textContent = "▶";
  if (bottomPlay) bottomPlay.textContent = "▶";
  document.title = "ganafy";
  localStorage.setItem("ganafy_playing", "false");
};

/* Progress */
audio.ontimeupdate = () => {
  if (!audio.duration) return;
  if (progress) progress.value = (audio.currentTime / audio.duration) * 100;
  localStorage.setItem("ganafy_time", audio.currentTime);
};

if (progress) {
  progress.oninput = () => {
    if (!audio.duration) return;
    audio.currentTime = (progress.value / 100) * audio.duration;
  };
}

/* Close popup permanently */
if (closePlayer) {
  closePlayer.onclick = () => {
    audio.pause();
    audio.currentTime = 0;
    if (bottomBar) bottomBar.style.display = "none";
    localStorage.setItem("ganafy_closed", "true");
    localStorage.removeItem("ganafy_time");
    localStorage.removeItem("ganafy_playing");
    document.title = "ganafy";
  };
}

/* Restore */
window.onload = () => {
  if (localStorage.getItem("ganafy_closed") === "true") return;

  const time = localStorage.getItem("ganafy_time");
  const playing = localStorage.getItem("ganafy_playing");

  if (time) {
    audio.currentTime = parseFloat(time);
    if (bottomBar) bottomBar.style.display = "flex";
  }

  if (playing === "true") audio.play();
};
