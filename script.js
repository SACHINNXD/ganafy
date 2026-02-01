const audio = document.getElementById("audio");
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

/* BOTTOM PLAYER */
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
const miniBtn = document.getElementById("mini");
const fullscreenBtn = document.getElementById("fullscreen");

/* MINI PLAYER */
const miniPlayer = document.getElementById("miniPlayer");
const miniAlbum = document.getElementById("miniAlbum");
const miniTitle = document.getElementById("miniTitle");
const miniOverlayPlay = document.getElementById("miniOverlayPlay");

/* FULLSCREEN */
const fsPlayer = document.getElementById("fullscreenPlayer");
const fsAlbum = document.getElementById("fsAlbum");
const fsTitle = document.getElementById("fsTitle");
const fsPlay = document.getElementById("fsPlay");
const fsNext = document.getElementById("fsNext");
const fsPrev = document.getElementById("fsPrev");
const exitFs = document.getElementById("exitFullscreen");

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
  audio.paused ? audio.play() : audio.pause();
}

bottomPlay.onclick = togglePlay;
miniOverlayPlay.onclick = togglePlay;
fsPlay.onclick = togglePlay;

audio.onplay = () => {
  bottomPlay.textContent = "❚❚";
  miniOverlayPlay.textContent = "❚❚";
  fsPlay.textContent = "❚❚";
};

audio.onpause = () => {
  bottomPlay.textContent = "▶";
  miniOverlayPlay.textContent = "▶";
  fsPlay.textContent = "▶";
};

/* NEXT / PREV */
nextBtn.onclick = () => {
  currentIndex = shuffle
    ? Math.floor(Math.random() * songs.length)
    : (currentIndex + 1) % songs.length;
  loadSong(currentIndex);
};

prevBtn.onclick = () => {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex);
};

shuffleBtn.onclick = () => shuffle = !shuffle;
repeatBtn.onclick = () => repeat = !repeat;

/* TIME */
audio.ontimeupdate = () => {
  if (!audio.duration) return;
  progress.value = (audio.currentTime / audio.duration) * 100;
  currentTimeEl.textContent = format(audio.currentTime);
  totalTimeEl.textContent = format(audio.duration);
};

progress.oninput = () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
};

audio.onended = () => {
  repeat ? loadSong(currentIndex) : nextBtn.click();
};

/* MINI TOGGLE (BOTTOM BAR STAYS) */
miniBtn.onclick = () => {
  miniPlayer.style.display =
    miniPlayer.style.display === "block" ? "none" : "block";
};

/* FULLSCREEN TOGGLE */
fullscreenBtn.onclick = () => fsPlayer.style.display = "flex";
exitFs.onclick = () => fsPlayer.style.display = "none";

/* DRAG MINI PLAYER */
let dragging = false;
let offsetX = 0;
let offsetY = 0;

miniPlayer.onmousedown = e => {
  dragging = true;
  offsetX = e.offsetX;
  offsetY = e.offsetY;
};

document.onmousemove = e => {
  if (!dragging) return;
  miniPlayer.style.left = e.pageX - offsetX + "px";
  miniPlayer.style.top = e.pageY - offsetY + "px";
};

document.onmouseup = () => dragging = false;

/* UTILS */
function format(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return m + ":" + String(s).padStart(2, "0");
}
