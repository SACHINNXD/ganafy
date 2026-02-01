const audio = document.getElementById("audio");
const songRows = document.querySelectorAll(".songRow");

const songs = [...songRows].map(r => ({
  src: r.dataset.audio,
  title: r.dataset.title,
  img: r.dataset.image
}));

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
const closeBtn = document.getElementById("closePlayer");

/* MINI */
const miniPlayer = document.getElementById("miniPlayer");
const miniAlbum = document.getElementById("miniAlbum");
const miniTitle = document.getElementById("miniTitle");
const miniPlay = document.getElementById("miniPlay");

/* FULLSCREEN */
const fsPlayer = document.getElementById("fullscreenPlayer");
const fsAlbum = document.getElementById("fsAlbum");
const fsTitle = document.getElementById("fsTitle");
const fsPlay = document.getElementById("fsPlay");
const fsNext = document.getElementById("fsNext");
const fsPrev = document.getElementById("fsPrev");
const exitFs = document.getElementById("exitFullscreen");

let index = 0, shuffle=false, repeat=false;

/* LOAD SONG */
function load(i){
  index=i;
  audio.src=songs[i].src;
  bottomAlbum.src=miniAlbum.src=fsAlbum.src=songs[i].img;
  bottomTrack.textContent=miniTitle.textContent=fsTitle.textContent=songs[i].title;
  audio.play();
  bottomBar.style.display="flex";
}

/* CLICK SONG */
songRows.forEach(r=>r.onclick=()=>load(+r.dataset.index));

/* PLAY/PAUSE */
bottomPlay.onclick=miniPlay.onclick=fsPlay.onclick=
  ()=>audio.paused?audio.play():audio.pause();

audio.onplay=()=>bottomPlay.textContent=miniPlay.textContent=fsPlay.textContent="❚❚";
audio.onpause=()=>bottomPlay.textContent=miniPlay.textContent=fsPlay.textContent="▶";

/* NEXT / PREV */
nextBtn.onclick=fsNext.onclick=()=>load(shuffle?Math.floor(Math.random()*songs.length):(index+1)%songs.length);
prevBtn.onclick=fsPrev.onclick=()=>load((index-1+songs.length)%songs.length);

shuffleBtn.onclick=()=>shuffle=!shuffle;
repeatBtn.onclick=()=>repeat=!repeat;

/* TIME */
audio.ontimeupdate=()=>{
  if(!audio.duration) return;
  progress.value=(audio.currentTime/audio.duration)*100;
  currentTimeEl.textContent=format(audio.currentTime);
  totalTimeEl.textContent=format(audio.duration);
};
progress.oninput=()=>audio.currentTime=(progress.value/100)*audio.duration;
audio.onended=()=>repeat?load(index):nextBtn.click();

/* MINI TOGGLE */
miniBtn.onclick=()=>{
  const on=miniPlayer.style.display==="flex";
  miniPlayer.style.display=on?"none":"flex";
  bottomBar.style.display=on?"flex":"none";
};

/* FULLSCREEN TOGGLE */
fullscreenBtn.onclick=()=>fsPlayer.style.display="flex";
exitFs.onclick=()=>fsPlayer.style.display="none";

/* DRAG MINI */
let drag=false,dx,dy;
miniPlayer.onmousedown=e=>{drag=true;dx=e.offsetX;dy=e.offsetY;}
document.onmousemove=e=>drag&&(miniPlayer.style.left=e.pageX-dx+"px",miniPlayer.style.top=e.pageY-dy+"px");
document.onmouseup=()=>drag=false;

function format(t){return Math.floor(t/60)+":"+String(Math.floor(t%60)).padStart(2,"0");}
