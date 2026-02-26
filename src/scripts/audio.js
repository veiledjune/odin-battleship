export function playSong() {
  const audio = new Audio('./audio/arcade-party.mp3');
  audio.loop = true;
  audio.play();
}

export const gameSounds = (() => {
  const miss = new Audio('./audio/miss.mp3');
  const hit = new Audio('./audio/hit.mp3');
  const playMiss = () => {
    miss.currentTime = 0;
    miss.play();
  };
  const playHit = () => {
    hit.currentTime = 0;
    hit.play();
  };
  return { playMiss, playHit };
})();
