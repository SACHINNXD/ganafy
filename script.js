const audio = document.getElementById("audio");

/* SONG DATA */
const songRows = document.querySelectorAll(".songRow");
const songs = [];

songRows.forEach(row => {
  songs.push({
    src: row.dataset.audio,
    title: row.dataset.title,
    img: row.dataset.image
  });
});

let currentIndex = 0;
let shuffle = false;
let repeat = false;

/* BOTTOM PLAYER ELEMENTS */
const bottomBar = document.getElementById("bottomBar");
const bottomAlbum = document.getElementById("bottomAlbum");
const bottomTrack = document.getElementById("bottomTrack");
const bottomPlay = document.getElementById("bottomPlay");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("currentTime");
const totalTimeEl = document.getElementById("totalTime");

const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");
const miniBtn = document.getElementById("miniBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");

/* MINI PLAYER */
const miniPlayer = document.getElementById("miniPlayer");
const miniAlbum = document.getElementById("miniAlbum");
const miniTitle = document.getElementById("miniTitle");
const miniPlay = document.getElementById("miniPlay");

/* FULLSCREEN PLAYER */
const fullscreenPlayer = document.getElementById("fullscreenPlayer");
const fsAlbum = document.getElementById("fsAlbum");
const fsTitle = document.getElementById("fsTitle");
const fsPlay = document.getElementById("fsPlay");
const fsNext = document.getElementById("fsNext");
const fsPrev = document.getElementById("fsPrev");
const exitFullscreen = document.getElementById("exitFullscreen");

/* LOAD SONG */
function loadSong(index) {
  const song = songs[index];

  audio.src = song.src;

  bottomAlbum.src = song.img;
  miniAlbum.src = song.img;
  fsAlbum.src = song.img;

  bottomTrack.textContent = song.title;
  miniTitle.textContent = song.title;
  fsTitle.textContent = song.title;

  audio.play();
  bottomBar.style.display = "flex";
}

/* SONG CLICK */
songRows.forEach(row => {
  row.addEventListener("click", () => {
    currentIndex = Number(row.dataset.index);
    loadSong(currentIndex);
  });
});

/* PLAY / PAUSE */
function togglePlay() {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

bottomPlay.addEventListener("click", togglePlay);
miniPlay.addEventListener("click", togglePlay);
fsPlay.addEventListener("click", togglePlay);

audio.addEventListener("play", () => {
  bottomPlay.textContent = "❚❚";
  miniPlay.textContent = "❚❚";
  fsPlay.textContent = "❚❚";
});

audio.addEventListener("pause", () => {
  bottomPlay.textContent = "▶";
  miniPlay.textContent = "▶";
  fsPlay.textContent = "▶";
});

/* NEXT / PREVIOUS */
nextBtn.addEventListener("click", () => {
  if (shuffle) {
    currentIndex = Math.floor(Math.random() * songs.length);
  } else {
    currentIndex = (currentIndex + 1) % songs.length;
  }
  loadSong(currentIndex);
});

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex);
});

shuffleBtn.addEventListener("click", () => shuffle = !shuffle);
repeatBtn.addEventListener("click", () => repeat = !repeat);

/* TIME + SEEK */
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;

  progress.value = (audio.currentTime / audio.duration) * 100;
  currentTimeEl.textContent = formatTime(audio.currentTime);
  totalTimeEl.textContent = formatTime(audio.duration);
});

progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

audio.addEventListener("ended", () => {
  if (repeat) {
    loadSong(currentIndex);
  } else {
    nextBtn.click();
  }
});

/* MINI TOGGLE (BOTTOM BAR STAYS) */
miniBtn.addEventListener("click", () => {
  miniPlayer.style.display =
    miniPlayer.style.display === "block" ? "none" : "block";
});

/* FULLSCREEN TOGGLE */
fullscreenBtn.addEventListener("click", () => {
  fullscreenPlayer.style.display = "flex";
});

exitFullscreen.addEventListener("click", () => {
  fullscreenPlayer.style.display = "none";
});

/* DRAG MINI PLAYER */
let dragging = false;
let offsetX = 0;
let offsetY = 0;

miniPlayer.addEventListener("mousedown", e => {
  dragging = true;
  offsetX = e.offsetX;
  offsetY = e.offsetY;
});

document.addEventListener("mousemove", e => {
  if (!dragging) return;
  miniPlayer.style.left = e.pageX - offsetX + "px";
  miniPlayer.style.top = e.pageY - offsetY + "px";
});

document.addEventListener("mouseup", () => dragging = false);

/* UTILITY */
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return m + ":" + String(s).padStart(2, "0");
}
