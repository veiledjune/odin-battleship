export function playSong() {
  const audio = new Audio('./audio/arcade-party.mp3');
  audio.loop = true;
  audio.play();
}
