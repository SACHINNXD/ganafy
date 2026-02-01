/* ================= AUDIO ELEMENT ================= */
const audio = document.getElementById("audio");

/* ================= SONG DATA ================= */
const songRows = document.querySelectorAll(".songRow");
const songs = [];

songRows.forEach(row => {
  songs.push({
    src: row.dataset.audio,
    title: row.dataset.title,
    img: row.dataset.image
  });
});

/* ================= STATE ================= */
let currentIndex = 0;
let shuffle = false;
let repeat = false;

/* ================= BOTTOM PLAYER ELEMENTS ================= */
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

/* ================= VOLUME ================= */
const volumeSlider = document.getElementById("volumeSlider");
if (volumeSlider) {
  audio.volume = volumeSlider.value / 100;

  volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value / 100;
  });
}

/* ================= MINI PLAYER ================= */
const miniPlayer = document.getElementById("miniPlayer");
const miniAlbum = document.getElementById("miniAlbum");
const miniTitle = document.getElementById("miniTitle");
const miniPlay = document.getElementById("miniPlay");

/* ================= FULLSCREEN PLAYER ================= */
const fullscreenPlayer = document.getElementById("fullscreenPlayer");
const fsAlbum = document.getElementById("fsAlbum");
const fsTitle = document.getElementById("fsTitle");
const fsPlay = document.getElementById("fsPlay");
const fsNext = document.getElementById("fsNext");
const fsPrev = document.getElementById("fsPrev");
const exitFullscreen = document.getElementById("exitFullscreen");

/* ================= LOAD SONG ================= */
function loadSong(index) {
  const song = songs[index];

  audio.src = song.src;

  if (bottomAlbum) bottomAlbum.src = song.img;
  if (miniAlbum) miniAlbum.src = song.img;
  if (fsAlbum) fsAlbum.src = song.img;

  if (bottomTrack) bottomTrack.textContent = song.title;
  if (miniTitle) miniTitle.textContent = song.title;
  if (fsTitle) fsTitle.textContent = song.title;

  audio.play();

  if (bottomBar) {
    bottomBar.style.display = "flex";
  }
}

/* ================= SONG CLICK (DESKTOP + MOBILE SAFE) ================= */
songRows.forEach(row => {

  /* DESKTOP CLICK */
  row.addEventListener("click", () => {
    currentIndex = Number(row.dataset.index);
    loadSong(currentIndex);
  });

  /* MOBILE TOUCH */
  row.addEventListener("touchstart", (e) => {
    e.preventDefault(); // prevents ghost click on mobile
    currentIndex = Number(row.dataset.index);
    loadSong(currentIndex);
  });

  /* POINTER (UNIFIED INPUT) */
  row.addEventListener("pointerdown", () => {
    currentIndex = Number(row.dataset.index);
    loadSong(currentIndex);
  });

});

/* ================= PLAY / PAUSE ================= */
function togglePlay() {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

if (bottomPlay) bottomPlay.addEventListener("click", togglePlay);
if (miniPlay) miniPlay.addEventListener("click", togglePlay);
if (fsPlay) fsPlay.addEventListener("click", togglePlay);

audio.addEventListener("play", () => {
  if (bottomPlay) bottomPlay.textContent = "❚❚";
  if (miniPlay) miniPlay.textContent = "❚❚";
  if (fsPlay) fsPlay.textContent = "❚❚";
});

audio.addEventListener("pause", () => {
  if (bottomPlay) bottomPlay.textContent = "▶";
  if (miniPlay) miniPlay.textContent = "▶";
  if (fsPlay) fsPlay.textContent = "▶";
});

/* ================= NEXT / PREVIOUS ================= */
if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    if (shuffle) {
      currentIndex = Math.floor(Math.random() * songs.length);
    } else {
      currentIndex = (currentIndex + 1) % songs.length;
    }
    loadSong(currentIndex);
  });
}

if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    loadSong(currentIndex);
  });
}

/* ================= SHUFFLE / REPEAT ================= */
if (shuffleBtn) {
  shuffleBtn.addEventListener("click", () => {
    shuffle = !shuffle;
  });
}

if (repeatBtn) {
  repeatBtn.addEventListener("click", () => {
    repeat = !repeat;
  });
}

/* ================= TIME + SEEK ================= */
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;

  if (progress) {
    progress.value = (audio.currentTime / audio.duration) * 100;
  }

  if (currentTimeEl) {
    currentTimeEl.textContent = formatTime(audio.currentTime);
  }

  if (totalTimeEl) {
    totalTimeEl.textContent = formatTime(audio.duration);
  }
});

if (progress) {
  progress.addEventListener("input", () => {
    audio.currentTime = (progress.value / 100) * audio.duration;
  });
}

audio.addEventListener("ended", () => {
  if (repeat) {
    loadSong(currentIndex);
  } else if (nextBtn) {
    nextBtn.click();
  }
});

/* ================= MINI PLAYER TOGGLE ================= */
if (miniBtn && miniPlayer) {
  miniBtn.addEventListener("click", () => {
    if (miniPlayer.style.display === "block") {
      miniPlayer.style.display = "none";
    } else {
      miniPlayer.style.display = "block";
    }
  });
}

/* ================= FULLSCREEN TOGGLE ================= */
if (fullscreenBtn && fullscreenPlayer) {
  fullscreenBtn.addEventListener("click", () => {
    fullscreenPlayer.style.display = "flex";
  });
}

if (exitFullscreen && fullscreenPlayer) {
  exitFullscreen.addEventListener("click", () => {
    fullscreenPlayer.style.display = "none";
  });
}

/* ================= DRAG MINI PLAYER (MOUSE + TOUCH) ================= */
let dragging = false;
let offsetX = 0;
let offsetY = 0;

if (miniPlayer) {

  miniPlayer.addEventListener("mousedown", (e) => {
    dragging = true;
    offsetX = e.offsetX;
    offsetY = e.offsetY;
  });

  miniPlayer.addEventListener("touchstart", (e) => {
    dragging = true;
    const touch = e.touches[0];
    offsetX = touch.clientX - miniPlayer.offsetLeft;
    offsetY = touch.clientY - miniPlayer.offsetTop;
  });

  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    miniPlayer.style.left = e.pageX - offsetX + "px";
    miniPlayer.style.top = e.pageY - offsetY + "px";
  });

  document.addEventListener("touchmove", (e) => {
    if (!dragging) return;
    const touch = e.touches[0];
    miniPlayer.style.left = touch.clientX - offsetX + "px";
    miniPlayer.style.top = touch.clientY - offsetY + "px";
  });

  document.addEventListener("mouseup", () => {
    dragging = false;
  });

  document.addEventListener("touchend", () => {
    dragging = false;
  });

}

/* ================= UTILITY ================= */
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return minutes + ":" + String(secs).padStart(2, "0");
}
