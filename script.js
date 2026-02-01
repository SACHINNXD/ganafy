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
const miniBtn = document.getElementById("miniBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");

/* VOLUME */
const volumeSlider = document.getElementById("volumeSlider");
audio.volume = 1;
volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value / 100;
});

/* MINI PLAYER */
const miniPlayer = document.getElementById("miniPlayer");
const miniAlbum = document.getElementById("miniAlbum");
const miniTitle = document.getElementById("miniTitle");
const miniPlay = document.getElementById("miniPlay");

/* FULLSCREEN */
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
  audio.paused ? audio.play() : audio.pause();
}

bottomPlay.onclick = togglePlay;
miniPlay.onclick = togglePlay;
fsPlay.onclick = togglePlay;

audio.onplay = () => {
  bottomPlay.textContent = "❚❚";
  miniPlay.textContent = "❚❚";
  fsPlay.textContent = "❚❚";
};

audio.onpause = () => {
  bottomPlay.textContent = "▶";
  miniPlay.textContent = "▶";
  fsPlay.textContent = "▶";
};

/* NEXT / PREVIOUS */
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
  currentTimeEl.textContent = formatTime(audio.currentTime);
  totalTimeEl.textContent = formatTime(audio.duration);
};

progress.oninput = () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
};

audio.onended = () => {
  repeat ? loadSong(currentIndex) : nextBtn.click();
};

/* MINI TOGGLE */
miniBtn.onclick = () => {
  miniPlayer.style.display =
    miniPlayer.style.display === "block" ? "none" : "block";
};

/* FULLSCREEN */
fullscreenBtn.onclick = () => fullscreenPlayer.style.display = "flex";
exitFullscreen.onclick = () => fullscreenPlayer.style.display = "none";

/* DRAG MINI */
let dragging = false;
let dx = 0;
let dy = 0;

miniPlayer.onmousedown = e => {
  dragging = true;
  dx = e.offsetX;
  dy = e.offsetY;
};

document.onmousemove = e => {
  if (!dragging) return;
  miniPlayer.style.left = e.pageX - dx + "px";
  miniPlayer.style.top = e.pageY - dy + "px";
};

document.onmouseup = () => dragging = false;

/* UTIL */
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return m + ":" + String(s).padStart(2, "0");
}
