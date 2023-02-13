let snake;
let x, y;
let coinX, coinY;
let score;
let tempDirection;
let direction;
let boardSize = 20;
let isGameover = true;
let game;
let speed;

// UI
let gameoverUI = document.getElementById("gameover_ui");
let scoreUI = document.querySelector(".current_score");
let bestScoreUI = document.querySelector(".best_score");

if (localStorage.getItem("bestScore") === null) {
  bestScoreUI.innerText = 0;
  localStorage.setItem("bestScore", 0);
} else {
  bestScoreUI.innerText = localStorage.getItem("bestScore");
}

document.onkeydown = KeyDownEventHandler;

function KeyDownEventHandler(e) {
  if (e.key === "ArrowUp" && direction !== 1) {
    tempDirection = 0;
  } else if (e.key === "ArrowDown" && direction !== 0) {
    tempDirection = 1;
  } else if (e.key === "ArrowLeft" && direction !== 3) {
    tempDirection = 2;
  } else if (e.key === "ArrowRight" && direction !== 2) {
    tempDirection = 3;
  } else if (e.key === "r" && isGameover == true) {
    Init();
  }
}

function MobileKeyDownEventHandler(num) {
  if (num === 0 && direction !== 1) {
    tempDirection = 0;
  } else if (num === 1 && direction !== 0) {
    tempDirection = 1;
  } else if (num === 2 && direction !== 3) {
    tempDirection = 2;
  } else if (num === 3 && direction !== 2) {
    tempDirection = 3;
  }
}

// 타일 생성
function DrawBoard() {
  let gameBoard = document.getElementById("game_board");
  gameBoard.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;

  gameBoard.innerHTML = "";

  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      let tile = document.createElement("div");
      tile.id = `${x}-${y}`;
      tile.className = "tile";
      gameBoard.append(tile);
    }
  }
}

// 이동
function Move() {
  direction = tempDirection;

  switch (direction) {
    case 0: y -= 1; break;
    case 1: y += 1; break;
    case 2: x -= 1; break;
    case 3: x += 1; break;
  }
}

// 머리 추가
function AppendHead() {
  if (snake.length > 0) {
    let prevHead = document.getElementById(`${snake[snake.length - 1][0]}-${snake[snake.length - 1][1]}`);
    prevHead.style.transform = null;

    if (snake.length > 1) {
      prevHead.className = "snake";
    }
  }

  snake.push(new Array(x, y));
  let head =  document.getElementById(`${x}-${y}`);
  head.className = "snake";
  head.classList.add("head");

  switch (direction) {
    case 0: head.style.transform = "rotateZ(270deg)"; break;
    case 1: head.style.transform = "rotateZ(90deg)"; break;
    case 2: head.style.transform = "rotateZ(180deg)"; break;
    case 3: head.style.transform = "rotateZ(0deg)"; break;
  }
}

// 꼬리 제거
function RemoveTail() {
  let tailX = snake[0][0];
  let tailY = snake[0][1];
  snake.shift();
  document.getElementById(`${tailX}-${tailY}`).className = "tile";
  document.getElementById(`${tailX}-${tailY}`).style.transform = null;

  if (snake.length > 1) {
    let tailX = snake[0][0];
    let tailY = snake[0][1];
    let tail2X = snake[1][0];
    let tail2Y = snake[1][1];

    let directionX = tail2X - tailX;
    let directionY = tail2Y - tailY;

    let tail = document.getElementById(`${tailX}-${tailY}`)

    if (directionX == 1) {
      tail.style.transform = "rotateY(0deg)";
    } else if (directionX == -1) {
      tail.style.transform = "rotateY(180deg)";
    } else if (directionY == 1) {
      tail.style.transform = "rotateZ(90deg)";
    } else if (directionY == -1) {
      tail.style.transform = "rotateZ(-90deg)";
    }

    tail.classList.add("tail");
  }
}

// 코인 획득 여부 체크
function CheckEatCoin() {
  let isEatCoin = coinX === x && coinY === y;

  if (isEatCoin) {
    score += 1;
    scoreUI.innerText = score;

    if (score > localStorage.getItem("bestScore")) {
      bestScoreUI.innerText = score;
      localStorage.setItem("bestScore", score);
    }
    SetCoin();
  } else {
    RemoveTail();
  }
}

// 코인 생성
function SetCoin() {
  let tileArray = document.getElementsByClassName("tile");
  let cointPostion = Math.floor(Math.random() * (tileArray.length - 0 + 1));
  let targetId = tileArray[cointPostion].id;
  coinX = targetId.split("-")[0] * 1;
  coinY = targetId.split("-")[1] * 1;
  document.getElementById(targetId).className = "coin";
}

// 충돌 체크
function CheckCrash() {
  let wallCrash = x + 1 > boardSize || x + 1 < 1 || y + 1 > boardSize || y + 1 < 1;
  let bodyCrash = wallCrash ? true : document.getElementById(`${x}-${y}`).classList == "snake";

  if (wallCrash || bodyCrash) {
    clearInterval(game);
    gameoverUI.className = "show";
    isGameover = true;
  }
}

function Game() {
  Move();
  CheckCrash();

  if (!isGameover) {
    AppendHead();
    CheckEatCoin();
  }
}

// 초기화
function Init() {
  snake = new Array();
  score = 0;
  tempDirection = 3;
  direction = 3;
  speed = 10;
  isGameover = false;
  gameoverUI.className = "";
  scoreUI.innerText = 0;
  bestScoreUI.innerText = localStorage.getItem("bestScore");
  DrawBoard();
  x = 1;
  y = 1;
  AppendHead();
  x = 2
  y = 1
  AppendHead();
  SetCoin();
  game = setInterval(Game, 1000 / speed);
}

