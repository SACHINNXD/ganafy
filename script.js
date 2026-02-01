const playButton = document.getElementById("playButton");
const audio = document.getElementById("audio");

playButton.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playButton.textContent = "Pause";
  } else {
    audio.pause();
    playButton.textContent = "Play";
  }
});
