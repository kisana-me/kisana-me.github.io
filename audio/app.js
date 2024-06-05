const grid = document.getElementById('grid');
const bassGrid = document.getElementById('bassGrid');
const gridLengthInput = document.getElementById('gridLength');
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const speedControl = document.getElementById('speed');
let notes = [];
let bassNotes = [];
let currentStep = 0;
let isPlaying = false;
let intervalId;
let oscs = [];  // Oscillator instances for main notes
let bassOscs = [];  // Oscillator instances for bass notes

function createGrids() {
  const length = parseInt(gridLengthInput.value);
  grid.innerHTML = '';
  bassGrid.innerHTML = '';
  notes = Array.from({ length: 16 }, () => Array(length).fill(false));
  bassNotes = Array.from({ length: 16 }, () => Array(length).fill(false));
  grid.style.gridTemplateColumns = `repeat(${length}, 20px)`;
  bassGrid.style.gridTemplateColumns = `repeat(${length}, 20px)`;

  for (let row = 0; row < 16; row++) {
    for (let col = 0; col < length; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener('click', () => toggleNote(cell, row, col, 'main'));
      grid.appendChild(cell);

      const bassCell = document.createElement('div');
      bassCell.classList.add('cell');
      bassCell.dataset.row = row;
      bassCell.dataset.col = col;
      bassCell.addEventListener('click', () => toggleNote(bassCell, row, col, 'bass'));
      bassGrid.appendChild(bassCell);
    }
  }
}

function toggleNote(cell, row, col, type) {
  if (type === 'main') {
    notes[row][col] = !notes[row][col];
    cell.classList.toggle('active');
  } else if (type === 'bass') {
    bassNotes[row][col] = !bassNotes[row][col];
    cell.classList.toggle('bassActive');
  }
}

function playMusic() {
  if (isPlaying) {
    clearInterval(intervalId);
    isPlaying = false;
    document.querySelectorAll('.current').forEach(cell => cell.classList.remove('current'));
    document.querySelectorAll('.bassCurrent').forEach(cell => cell.classList.remove('bassCurrent'));
    stopAllOscillators();
    return;
  }
  
  isPlaying = true;
  currentStep = 0;
  intervalId = setInterval(step, parseInt(speedControl.value));
}

function step() {
  const length = parseInt(gridLengthInput.value);
  
  if (currentStep >= length) {
    currentStep = 0;
    clearInterval(intervalId);
    isPlaying = false;
    stopAllOscillators();
    return;
  }
  
  document.querySelectorAll('.current').forEach(cell => cell.classList.remove('current'));
  document.querySelectorAll('.bassCurrent').forEach(cell => cell.classList.remove('bassCurrent'));
  
  for (let row = 0; row < 16; row++) {
    const cell = grid.querySelector(`.cell[data-row="${row}"][data-col="${currentStep}"]`);
    const bassCell = bassGrid.querySelector(`.cell[data-row="${row}"][data-col="${currentStep}"]`);
    cell.classList.add('current');
    bassCell.classList.add('bassCurrent');

    if (notes[row][currentStep]) {
      if (!oscs[row]) {
        oscs[row] = playSound(row, 'main');
      }
    } else {
      if (oscs[row]) {
        stopSound(row, 'main');
        oscs[row] = null;
      }
    }

    if (bassNotes[row][currentStep]) {
      if (!bassOscs[row]) {
        bassOscs[row] = playSound(row, 'bass');
      }
    } else {
      if (bassOscs[row]) {
        stopSound(row, 'bass');
        bassOscs[row] = null;
      }
    }
  }
  
  currentStep++;
}

function playSound(pitch, type) {
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.connect(gain);
  gain.connect(audioContext.destination);
  osc.type = 'square';
  if (type === 'main') {
    osc.frequency.setValueAtTime(440 * Math.pow(2, (16 - pitch - 9) / 12), audioContext.currentTime);
    gain.gain.setValueAtTime(0.5, audioContext.currentTime);
  } else if (type === 'bass') {
    osc.frequency.setValueAtTime(440 * Math.pow(2, (16 - pitch - 21) / 12), audioContext.currentTime); // Adjust for lower octave
    gain.gain.setValueAtTime(0.5, audioContext.currentTime);
  }
  osc.start(audioContext.currentTime);
  return { osc, gain };
}

function stopSound(row, type) {
  const { osc, gain } = type === 'main' ? oscs[row] : bassOscs[row];
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
  osc.stop(audioContext.currentTime + 0.2);
}

function stopAllOscillators() {
  oscs.forEach((osc, row) => {
    if (osc) {
      stopSound(row, 'main');
    }
  });
  bassOscs.forEach((osc, row) => {
    if (osc) {
      stopSound(row, 'bass');
    }
  });
  oscs = [];
  bassOscs = [];
}

// Initialize the grids with default length
createGrids();
