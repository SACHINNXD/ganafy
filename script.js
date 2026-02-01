const audio = document.getElementById("audio");
const bottomBar = document.getElementById("bottomBar");
const bottomAlbum = document.getElementById("bottomAlbum");
const bottomTrack = document.getElementById("bottomTrack");
const bottomPlay = document.getElementById("bottomPlay");
const closePlayer = document.getElementById("closePlayer");
const progress = document.getElementById("progress");

let currentSong = null;

/* PLAY SONG FROM LIST */
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
    localStorage.removeItem("ganafy_closed");
  });
});

/* PLAY / PAUSE */
bottomPlay.addEventListener("click", () => {
  audio.paused ? audio.play() : audio.pause();
});

/* UPDATE PROGRESS */
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  progress.value = (audio.currentTime / audio.duration) * 100;
});

/* SEEK */
progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

/* CLOSE PLAYER PERMANENTLY */
closePlayer.addEventListener("click", () => {
  audio.pause();
  audio.currentTime = 0;
  bottomBar.style.display = "none";
  localStorage.setItem("ganafy_closed", "true");
});
