console.log("Welcome to spotify.com : The world of musicccccc...");

let songs = [];
let currentIndex = 0;
let audio = new Audio();

const songThumb = document.querySelector(".song-thum");
const songName = document.getElementById("song-name");
const artistName = document.getElementById("artist-name");

const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const seekBar = document.getElementById("seek-bar");
const currentTime = document.getElementById("current-time");
const totalTime = document.getElementById("total-time");

const volumeControl = document.getElementById("volumeControl");

const trendingContainer = document.getElementById("trendingSongs");

async function loadSongs() {
  const response = await fetch("songs.json");
  songs = await response.json();
  displaySongs();
}

function displaySongs() {
  trendingContainer.innerHTML = "";

  songs.forEach((song, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="song-thumbnail">
        <img src="${song.cover}" alt="${song.title}">
        <a class="play-btn"><img src="play-btn.svg"></a>
      </div>
      <h1>${song.title}</h1>
      <p>${song.artist}</p>
    `;

    card.addEventListener("click", () => {
      loadSong(index);
      playSong();
    });

    trendingContainer.appendChild(card);
  });
}

function loadSong(index) {
  currentIndex = index;
  let track = songs[index];

  audio.src = track.file;
  songThumb.src = track.cover;
  songName.textContent = track.title;
  artistName.textContent = track.artist;

  audio.addEventListener("loadedmetadata", () => {
    seekBar.max = audio.duration;
    totalTime.textContent = formatTime(audio.duration);
  });
}

function playSong() {
  audio.play();
  playBtn.src = "pause-btn.svg";
}

function pauseSong() {
  audio.pause();
  playBtn.src = "play-btn.svg";
}

playBtn.addEventListener("click", () => {
  if (audio.paused) playSong();
  else pauseSong();
});

function formatTime(sec) {
  let minutes = Math.floor(sec / 60);
  let seconds = Math.floor(sec % 60);
  return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
}

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % songs.length;
  loadSong(currentIndex);
  playSong();
});

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex);
  playSong();
});

audio.addEventListener("timeupdate", () => {
  seekBar.value = audio.currentTime;
  currentTime.textContent = formatTime(audio.currentTime);
});

seekBar.addEventListener("input", () => {
  audio.currentTime = seekBar.value;
});

volumeControl.addEventListener("input", () => {
  audio.volume = volumeControl.value / 100;
});

audio.addEventListener("ended", () => {
  currentIndex = (currentIndex + 1) % songs.length;
  loadSong(currentIndex);
  playSong();
});

loadSongs();
