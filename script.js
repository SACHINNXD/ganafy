const audio = document.getElementById("audio");

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
const fullscreenBtn = document.getElementById("fullscreen");
const miniBtn = document.getElementById("mini");
const closeBtn = document.getElementById("closePlayer");

const songRows = document.querySelectorAll(".songRow");

const songs = Array.from(songRows).map(row => ({
  src: row.dataset.audio,
  title: row.dataset.title,
  img: row.dataset.image
}));

let currentIndex = 0;
let shuffle = false;
let repeat = false;

/* FORMAT TIME */
function format(t) {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2,"0")}`;
}

/* LOAD SONG */
function loadSong(index) {
  const song = songs[index];
  audio.src = song.src;
  bottomAlbum.src = song.img;
  bottomTrack.textContent = song.title;
  audio.play();
  bottomBar.style.display = "flex";

  localStorage.setItem("ganafy_song_index", index);
  localStorage.removeItem("ganafy_closed");
}

/* SONG CLICK */
songRows.forEach(row => {
  row.addEventListener("click", () => {
    currentIndex = Number(row.dataset.index);
    loadSong(currentIndex);
  });
});

/* PLAY / PAUSE */
bottomPlay.onclick = () => {
  audio.paused ? audio.play() : audio.pause();
};

audio.onplay = () => bottomPlay.textContent = "❚❚";
audio.onpause = () => bottomPlay.textContent = "▶";

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

/* SHUFFLE / REPEAT */
shuffleBtn.onclick = () => shuffle = !shuffle;
repeatBtn.onclick = () => repeat = !repeat;

/* TIME UPDATE */
audio.ontimeupdate = () => {
  if (!audio.duration) return;

  progress.value = (audio.currentTime / audio.duration) * 100;
  currentTimeEl.textContent = format(audio.currentTime);
  totalTimeEl.textContent = format(audio.duration);

  localStorage.setItem("ganafy_time", audio.currentTime);
};

/* SEEK */
progress.oninput = () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
};

/* END */
audio.onended = () => {
  repeat ? loadSong(currentIndex) : nextBtn.click();
};

/* MINI PLAYER */
miniBtn.onclick = () => {
  bottomBar.style.height = "50px";
};

/* FULLSCREEN */
fullscreenBtn.onclick = () => {
  document.documentElement.requestFullscreen();
};

/* CLOSE */
closeBtn.onclick = () => {
  audio.pause();
  bottomBar.style.display = "none";
  localStorage.setItem("ganafy_closed", "true");
};

/* RESTORE */
window.onload = () => {
  if (localStorage.getItem("ganafy_closed") === "true") return;

  const idx = localStorage.getItem("ganafy_song_index");
  const time = localStorage.getItem("ganafy_time");

  if (idx !== null) {
    currentIndex = Number(idx);
    loadSong(currentIndex);
    if (time) audio.currentTime = Number(time);
  }
};
