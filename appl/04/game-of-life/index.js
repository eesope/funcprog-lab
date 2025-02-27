import init, { Cell, Universe } from "./pkg/game_of_life.js";

const CELL_SIZE = 10;  //px
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
//const DEAD_COLOR = "rgb(255,0,0)";
const ALIVE_COLOR = "#000000";


init().then((wasm) => {  // note wasm here
  const universe = Universe.new();
  const width = universe.width();
  const height = universe.height();

  const canvas = document.getElementById("game-of-life-canvas");
  canvas.height = (CELL_SIZE + 1) * height + 1;
  canvas.width = (CELL_SIZE + 1) * width + 1;
  
  const ctx = canvas.getContext('2d');

  canvas.addEventListener("click", event => {
    const boundingRect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / boundingRect.width;
    const scaleY = canvas.height / boundingRect.height;

    const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
    const canvasTop = (event.clientY - boundingRect.top) * scaleY;

    const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + 1)), height - 1);
    const col = Math.min(Math.floor(canvasLeft / (CELL_SIZE + 1)), width - 1);

    universe.toggle_cell(row, col);

    drawGrid();
    drawCells();
  });

  let animationId = null

  const renderLoop = () => {
    universe.tick();

    drawGrid();
    drawCells();

    animationId = requestAnimationFrame(renderLoop);
  };

  const isPaused = () => {
    return animationId === null;
  }

  const playPauseButton = document.getElementById("play-pause");

  const play = () => {
    playPauseButton.textContent = "Pause";
    renderLoop();
  }

  const pause = () => {
    playPauseButton.textContent = "Play"
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  playPauseButton.addEventListener("click", event => {
    if (isPaused()) {
      play();
    } else {
      pause();
    }
  });

  const drawGrid = () => {
    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;

    // vertical lines
    for (let i = 0; i <= width; i++) {
      ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
      ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
    }

    //horizontal lines
    for (let j = 0; j <= height; j++) {
      ctx.moveTo(0,                           j * (CELL_SIZE + 1) + 1);
      ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
    }

    ctx.stroke();
  };

  const getIndex = (row, column) => {
    return row * width + column;
  };

  const drawCells = () => {
    const cellsPtr = universe.cells();
    // note use of wasm below to access memory buffer
    const cells = new Uint8Array(wasm.memory.buffer, cellsPtr, width * height);

    ctx.beginPath();

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const idx = getIndex(row, col);

        ctx.fillStyle = cells[idx] === Cell.Dead
          ? DEAD_COLOR
          : ALIVE_COLOR;

        ctx.fillRect(
          col * (CELL_SIZE + 1) + 1,
          row * (CELL_SIZE + 1) + 1,
          CELL_SIZE,
          CELL_SIZE
        );
      }
    }
    ctx.stroke();
  };

  drawGrid();
  drawCells();
  play();
});

