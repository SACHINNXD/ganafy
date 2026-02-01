const audio = document.getElementById("audio");

const bottomBar = document.getElementById("bottomBar");
const bottomAlbum = document.getElementById("bottomAlbum");
const bottomTrack = document.getElementById("bottomTrack");
const bottomPlay = document.getElementById("bottomPlay");
const closePlayer = document.getElementById("closePlayer");
const progress = document.getElementById("progress");
const timeDisplay = document.getElementById("timeDisplay");

let currentSong = null;

/* FORMAT TIME */
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/* SONG CLICK */
document.querySelectorAll(".songRow").forEach(row => {
  row.addEventListener("click", () => {
    const src = row.dataset.audio;
    const title = row.dataset.title;
    const img = row.dataset.image;

    if (currentSong !== src) {
      audio.src = src;
      audio.currentTime = 0;
      currentSong = src;
    }

    bottomAlbum.src = img;
    bottomTrack.textContent = title;

    audio.play();
    bottomBar.style.display = "flex";

    localStorage.setItem("ganafy_song", src);
    localStorage.setItem("ganafy_title", title);
    localStorage.setItem("ganafy_img", img);
    localStorage.removeItem("ganafy_closed");
  });
});

/* PLAY / PAUSE BUTTON */
bottomPlay.addEventListener("click", () => {
  audio.paused ? audio.play() : audio.pause();
});

/* SYNC UI */
audio.addEventListener("play", () => {
  bottomPlay.textContent = "❚❚";
});

audio.addEventListener("pause", () => {
  bottomPlay.textContent = "▶";
});

/* PROGRESS + TIME */
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;

  progress.value = (audio.currentTime / audio.duration) * 100;
  timeDisplay.textContent =
    `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;

  localStorage.setItem("ganafy_time", audio.currentTime);
});

/* SEEK */
progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

/* CLOSE PERMANENTLY */
closePlayer.addEventListener("click", () => {
  audio.pause();
  audio.currentTime = 0;
  bottomBar.style.display = "none";

  localStorage.setItem("ganafy_closed", "true");
  localStorage.removeItem("ganafy_time");
});

/* RESTORE ON LOAD */
window.addEventListener("load", () => {
  if (localStorage.getItem("ganafy_closed") === "true") return;

  const song = localStorage.getItem("ganafy_song");
  const title = localStorage.getItem("ganafy_title");
  const img = localStorage.getItem("ganafy_img");
  const time = localStorage.getItem("ganafy_time");

  if (!song) return;

  audio.src = song;
  bottomAlbum.src = img;
  bottomTrack.textContent = title;
  bottomBar.style.display = "flex";

  if (time) audio.currentTime = parseFloat(time);
});
