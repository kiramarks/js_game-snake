'use strict';

const game = document.querySelector('.game');
const field = document.createElement('div');
const excel = document.getElementsByClassName('game__excel');

game.appendChild(field);
field.classList.add('game__field');

for (let i = 0; i < 100; i++) {
  const cell = document.createElement('div');

  field.appendChild(cell);
  cell.classList.add('game__excel');
}

let x = 1,
  y = 10;

for (let i = 0; i < excel.length; i++) {
  if (x > 10) {
    x = 1;
    y--;
  }
  excel[i].setAttribute('posX', x);
  excel[i].setAttribute('posY', y);
  x++;
}

// snake on random coords
function generateSnake() {
  const posX = Math.round(Math.random() * (10 - 3) + 3); // '3' to avoid 'null' value of posX
  const posY = Math.round(Math.random() * (10 - 1) + 1);

  return [posX, posY];
}

const snakeCoords = generateSnake();

const snakeBody = [
  document.querySelector(
    '[posX = "' + snakeCoords[0] + '"][posY = "' + snakeCoords[1] + '"]'),
  document.querySelector(
    '[posX = "' + (snakeCoords[0] - 1) + '"][posY = "' + snakeCoords[1] + '"]'),
  document.querySelector(
    '[posX = "' + (snakeCoords[0] - 2) + '"][posY = "' + snakeCoords[1] + '"]')
];

// paint the snake
snakeBody[0].classList.add('game__snake-head');

for (let i = 0; i < snakeBody.length; i++) {
  snakeBody[i].classList.add('game__snake-body');
}

let mouse;

function createMouse() {
  function generateMouse() {
    const posX = Math.round(Math.random() * (10 - 3) + 3); // '3' to avoid 'null' value of posX
    const posY = Math.round(Math.random() * (10 - 1) + 1);

    return [posX, posY];
  }

  const mouseCoords = generateMouse();

  mouse = document.querySelector(
    '[posX = "' + mouseCoords[0] + '"][posY = "' + mouseCoords[1] + '"]');

  // while loop to avoid the same snake's and mouse's coords
  while (mouse.classList.contains('game__snake-body')) {
    const mouseCoords = generateMouse();

    mouse = document.querySelector(
      '[posX = "' + mouseCoords[0] + '"][posY = "' + mouseCoords[1] + '"]');
  }

  mouse.classList.add('game__mouse');
}

createMouse();

let direction = 'right';
let steps = false;
let score = 0;
const scoreTable = document.querySelector('.game__score');

scoreTable.textContent = `Score: ${score}`;

function move() {
  const coords = [snakeBody[0].getAttribute('posX'), snakeBody[0].getAttribute('posY')];

  snakeBody[0].classList.remove('game__snake-head');
  snakeBody[snakeBody.length - 1].classList.remove('game__snake-body');
  snakeBody.pop();

  if (direction === 'right') {
    if (coords[0] < 10) {
      snakeBody.unshift(document.querySelector(
        '[posX = "' + (+coords[0] + 1) + '"][posY = "' + coords[1] + '"]'));
    } else {
      snakeBody.unshift(document.querySelector(
        '[posX = "1"][posY = "' + coords[1] + '"]'));
    }
  } else if (direction === 'left') {
    if (coords[0] > 1) {
      snakeBody.unshift(document.querySelector(
        '[posX = "' + (+coords[0] - 1) + '"][posY = "' + coords[1] + '"]'));
    } else {
      snakeBody.unshift(document.querySelector(
        '[posX = "10"][posY = "' + coords[1] + '"]'));
    }
  } else if (direction === 'up') {
    if (coords[1] < 10) {
      snakeBody.unshift(document.querySelector(
        '[posX = "' + coords[0] + '"][posY = "' + (+coords[1] + 1) + '"]'));
    } else {
      snakeBody.unshift(document.querySelector(
        '[posX = "' + coords[0] + '"][posY = "1"]'));
    }
  } else if (direction === 'down') {
    if (coords[1] > 1) {
      snakeBody.unshift(document.querySelector(
        '[posX = "' + coords[0] + '"][posY = "' + (+coords[1] - 1) + '"]'));
    } else {
      snakeBody.unshift(document.querySelector(
        '[posX = "' + coords[0] + '"][posY = "10"]'));
    }
  }

  // eating mouse
  if (snakeBody[0].getAttribute('posX') === mouse.getAttribute('posX')
  && snakeBody[0].getAttribute('posY') === mouse.getAttribute('posY')) {
    mouse.classList.remove('game__mouse');

    const a = snakeBody[snakeBody.length - 1].getAttribute('posX');
    const b = snakeBody[snakeBody.length - 1].getAttribute('posY');

    snakeBody.push(document.querySelector(
      '[posX = "' + a + '"][posY = "' + b + '"]'));

    createMouse();
    score++;
    scoreTable.textContent = `Score: ${score}`;
  }

  if (snakeBody[0].classList.contains('game__snake-body')) {
    const loseMsg = document.createElement('div');

    game.appendChild(loseMsg);
    loseMsg.classList.add('game__lose-msg');

    loseMsg.innerHTML = `
      <h1>Ooops! You lose!</h1>
      <div class="game__lose-img"></div>
      <button class="game__reset">Play Again</button>
      `;

    document.body.querySelector('.game__reset').addEventListener('click', () => {
      window.location.reload();
    });

    clearInterval(interval);

  }

  snakeBody[0].classList.add('game__snake-head');

  for (let i = 0; i < snakeBody.length; i++) {
    snakeBody[i].classList.add('game__snake-body');
  }

  steps = true;
}

const interval = setInterval(move, 300);

window.addEventListener('keydown', (e) => {
  if (steps === true) {
    if (e.keyCode === 37 && direction !== 'right') {
      direction = 'left';
      steps = false;
    } else if (e.keyCode === 38 && direction !== 'down') {
      direction = 'up';
      steps = false;
    } else if (e.keyCode === 39 && direction !== 'left') {
      direction = 'right';
      steps = false;
    } else if (e.keyCode === 40 && direction !== 'up') {
      direction = 'down';
      steps = false;
    }
  }
});
