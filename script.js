"use strict";

/* Music Pandit — Janta Swaras Practice
   Lesson and Tanpura players are intentionally independent. */

const $ = (id) => document.getElementById(id);
const notationDiv = $("notation");
const previewNotation = $("previewNotation");
const lessonSelect = $("lessonSelect");
const speedSelect = $("speedSelect");
const playBtn = $("playBtn");
const restartBtn = $("restartBtn");
const audioPlayer = $("audioPlayer");
const tanpuraPlayer = $("tanpuraPlayer");
const tanpuraBtn = $("tanpuraBtn");
const shrutiSelect = $("shrutiSelect");
const tanpuraVolume = $("tanpuraVolume");
const volumeValue = $("volumeValue");
const progressBar = $("progressBar");
const audioMessage = $("audioMessage");
const lessonTitle = $("lessonTitle");
const speedHint = $("speedHint");
const beats = [...document.querySelectorAll(".beat")];

const scale = ["S", "R", "G", "M", "P", "D", "N", "S′"];
const reverseScale = [...scale].reverse();
const paired = (notes) => notes.flatMap((note) => [note, note]);
const runRows = (notes) => Array.from({ length: notes.length - 1 }, (_, i) => paired(notes.slice(i, i + 2).flatMap((note) => [note, note])));
const ascentDescent = (builder) => [...builder(scale), ...builder(reverseScale)];

// Janta 1 and 2 preserve the original written sequences. The remaining lessons
// use the standard progressively varied Janta pattern across the same scale.
const lessonOne = [
  ["S", "S", "R", "R", "G", "G", "M", "M"], ["P", "P", "D", "D", "N", "N", "S′", "S′"],
  ["S′", "S′", "N", "N", "D", "D", "P", "P"], ["M", "M", "G", "G", "R", "R", "S", "S"]
];
const lessonTwo = [
  ["S","S","R","R","G","G","M","M"], ["R","R","G","G","M","M","P","P"], ["G","G","M","M","P","P","D","D"], ["M","M","P","P","D","D","N","N"], ["P","P","D","D","N","N","S′","S′"],
  ["S′","S′","N","N","D","D","P","P"], ["N","N","D","D","P","P","M","M"], ["D","D","P","P","M","M","G","G"], ["P","P","M","M","G","G","R","R"], ["M","M","G","G","R","R","S","S"]
];
// Janta 3–6 follow the exact alternating pattern from the supplied project:
// one variation, followed by its regular connecting sequence, in each direction.
const variantRows = (kind) => [scale, reverseScale].flatMap((notes) => Array.from({ length: 5 }, (_, i) => {
  const [a, b, c, d] = notes.slice(i, i + 4);
  const variation = {
    3: [a, a, b, b, c, c, b, b],
    4: [a, a, b, b, c, a, b, c],
    5: [a, a, b, a, a, b, a, b],
    6: [a, a, a, b, b, b, c, c]
  }[kind];
  return [variation, [a, a, b, b, c, c, d, d]];
}).flat());
const audioFiles = (number) => Object.fromEntries([1,2,3].map((speed) => [speed, `audios/Janta${number}_speed${speed}.mp3`]));
const lessons = {
  1: { notation: lessonOne, audio: audioFiles(1) }, 2: { notation: lessonTwo, audio: audioFiles(2) },
  3: { notation: variantRows(3), audio: audioFiles(3) }, 4: { notation: variantRows(4), audio: audioFiles(4) },
  5: { notation: variantRows(5), audio: audioFiles(5) }, 6: { notation: variantRows(6), audio: audioFiles(6) }
};
// # is a special character in a web address. Encode sharp Shrutis so, for
// example, D#_scale.mp3 is requested correctly as D%23_scale.mp3.
const tanpuraFiles = Object.fromEntries(
  ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
    .map((note) => [
      note,
      `tanpura/${encodeURIComponent(note)}_scale.mp3`
    ])
);

let currentLesson = 1, currentSpeed = 1, swaraBlocks = [], currentSwara = -1, currentBeat = -1;
let tanpuraPlaying = false, animationFrame = null;
const swaraDuration = () => ({ 1: 1, 2: .5, 3: .25 })[currentSpeed];
const swaraClass = (note) => ({ S: "s-note", R: "r-note", G: "g-note", M: "m-note", P: "p-note", D: "d-note", N: "n-note" })[note[0]] || "";

function renderRows(container, rows) {
  container.replaceChildren();
  return rows.flatMap((row) => {
    const rowElement = document.createElement("div"); rowElement.className = "swara-row";
    const spans = row.map((note) => { const span = document.createElement("span"); span.className = `swara ${swaraClass(note)}`; span.textContent = note; rowElement.append(span); return span; });
    container.append(rowElement); return spans;
  });
}
function resetVisuals() { swaraBlocks.forEach((block) => block.classList.remove("active")); beats.forEach((beat) => beat.classList.remove("active")); progressBar.style.width = "0%"; currentSwara = currentBeat = -1; }
function loadLesson() {
  currentLesson = Number(lessonSelect.value); const rows = lessons[currentLesson].notation; const split = Math.ceil(rows.length / 2);
  swaraBlocks = [...renderRows(notationDiv, rows.slice(0, split)), ...renderRows(previewNotation, rows.slice(split))];
  lessonTitle.textContent = `Janta ${currentLesson}`; loadLessonAudio(); resetVisuals();
}
function loadLessonAudio() { audioPlayer.pause(); audioPlayer.src = lessons[currentLesson].audio[currentSpeed]; audioPlayer.load(); playBtn.textContent = "▶ Play"; audioMessage.textContent = ""; }
function updateVisuals() {
  if (audioPlayer.paused) return;
  const swaraIndex = Math.floor(audioPlayer.currentTime / swaraDuration());
  if (swaraIndex !== currentSwara) { swaraBlocks.forEach((block) => block.classList.remove("active")); swaraBlocks[swaraIndex]?.classList.add("active"); currentSwara = swaraIndex; }
  const beatIndex = Math.floor(audioPlayer.currentTime) % 8;
  if (beatIndex !== currentBeat) { beats.forEach((beat) => beat.classList.remove("active")); beats[beatIndex]?.classList.add("active"); currentBeat = beatIndex; }
  if (Number.isFinite(audioPlayer.duration) && audioPlayer.duration > 0) progressBar.style.width = `${audioPlayer.currentTime / audioPlayer.duration * 100}%`;
}
function animate() { updateVisuals(); if (!audioPlayer.paused) animationFrame = requestAnimationFrame(animate); }
function stopAnimation() { if (animationFrame) cancelAnimationFrame(animationFrame); animationFrame = null; }
function loadTanpura() { tanpuraPlayer.src = tanpuraFiles[shrutiSelect.value]; tanpuraPlayer.loop = true; tanpuraPlayer.volume = Number(tanpuraVolume.value) / 100; tanpuraPlayer.load(); }
function setTanpuraButton() { tanpuraBtn.textContent = tanpuraPlaying ? "■ Stop Tanpura" : "▶ Start Tanpura"; }

lessonSelect.addEventListener("change", loadLesson);
speedSelect.addEventListener("change", () => { currentSpeed = Number(speedSelect.value); speedHint.textContent = `${currentSpeed}${currentSpeed === 1 ? "st" : currentSpeed === 2 ? "nd" : "rd"} speed · ${2 ** (currentSpeed - 1)} swaras per beat`; loadLessonAudio(); resetVisuals(); });
playBtn.addEventListener("click", async () => { if (audioPlayer.paused) { try { await audioPlayer.play(); playBtn.textContent = "⏸ Pause"; animate(); } catch { audioMessage.textContent = "Lesson audio was not found. Add the MP3 files to the audios folder."; } } else audioPlayer.pause(); });
restartBtn.addEventListener("click", () => { audioPlayer.pause(); audioPlayer.currentTime = 0; resetVisuals(); playBtn.textContent = "▶ Play"; });
audioPlayer.addEventListener("pause", () => { stopAnimation(); if (!audioPlayer.ended) playBtn.textContent = "▶ Play"; });
audioPlayer.addEventListener("ended", () => { resetVisuals(); playBtn.textContent = "▶ Play"; });
audioPlayer.addEventListener("error", () => { if (audioPlayer.currentSrc) audioMessage.textContent = "Lesson audio was not found. Add the MP3 files to the audios folder."; });

tanpuraBtn.addEventListener("click", async () => { if (tanpuraPlaying) { tanpuraPlayer.pause(); tanpuraPlayer.currentTime = 0; tanpuraPlaying = false; } else { try { await tanpuraPlayer.play(); tanpuraPlaying = true; } catch { audioMessage.textContent = "Tanpura audio was not found. Add the selected scale MP3 to the tanpura folder."; } } setTanpuraButton(); });
shrutiSelect.addEventListener("change", async () => { const resume = tanpuraPlaying; localStorage.setItem("mp_shruti", shrutiSelect.value); loadTanpura(); if (resume) { try { await tanpuraPlayer.play(); } catch { tanpuraPlaying = false; } } setTanpuraButton(); });
tanpuraVolume.addEventListener("input", () => { tanpuraPlayer.volume = Number(tanpuraVolume.value) / 100; volumeValue.textContent = `${tanpuraVolume.value}%`; localStorage.setItem("mp_tanpura_volume", tanpuraVolume.value); });
tanpuraPlayer.addEventListener("error", () => { if (tanpuraPlayer.currentSrc) audioMessage.textContent = "Tanpura audio was not found. Add the selected scale MP3 to the tanpura folder."; });
document.addEventListener("keydown", (event) => { if (["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement.tagName)) return; if (event.code === "Space") { event.preventDefault(); playBtn.click(); } if (event.key.toLowerCase() === "r") restartBtn.click(); if (event.key.toLowerCase() === "t") tanpuraBtn.click(); });

const savedShruti = localStorage.getItem("mp_shruti"), savedVolume = localStorage.getItem("mp_tanpura_volume");
if (savedShruti && tanpuraFiles[savedShruti]) shrutiSelect.value = savedShruti;
if (savedVolume !== null) tanpuraVolume.value = savedVolume;
volumeValue.textContent = `${tanpuraVolume.value}%`; loadTanpura(); loadLesson();
