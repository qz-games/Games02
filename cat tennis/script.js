document.addEventListener("contextmenu", (event) => event.preventDefault());

let touchActive = false;
const catImages = document.querySelectorAll(".catImage");
const racketImages = document.querySelectorAll(".racketImage");
const ballImages = document.querySelectorAll(".ballImage");
const backgroundImages = document.querySelectorAll(".backgroundImage");
const playerRacketImages = document.querySelectorAll(".playerRacketImage");

const cat = document.getElementById("cat");
const ball = document.getElementById("ball");
const elementSelector = document.getElementById("elementSelector");
const racket = document.getElementById("racket");
const joystick = document.getElementById("joystick");
const background = document.getElementById("background");
const catRacketContainer = document.getElementById("catRacketContainer");
const catRacket = document.getElementById("catRacket");
const catContainer = document.getElementById("catContainer");
const racketCheckBox = document.getElementById("racketCheckbox");

const bgm = document.getElementById("bgm");
const catHitSound = document.getElementById("catHit");
const playerHitSound = document.getElementById("playerHit");
const three = document.getElementById("three");
const two = document.getElementById("two");
const one = document.getElementById("one");
const go = document.getElementById("go");

const startScreen = document.getElementById("startScreen");
const playScreen = document.getElementById("playScreen");

const catInput = document.getElementById("selectCatImage");
const racketInput = document.getElementById("selectRacketImage");
const ballInput = document.getElementById("selectBallImage");
const backgroundInput = document.getElementById("selectBackgroundImage");
const playerRacketInput = document.getElementById("selectPlayerRacketImage");
const count = document.getElementById("count");
const earthCount = document.getElementById("earthCount");

const moreButton = document.getElementById("moreButton");
const extraContainer = document.getElementById("extraContainer");
const randomContainer = document.getElementById("randomContainer");
const playButton = document.getElementById("playButton");
const startCount = document.getElementById("startCount");
const body = document.getElementById("body");
const moveContainer = document.getElementById("moveContainer");
const gameOverContainer = document.getElementById("gameOverContainer");
const gameOverScore = document.getElementById("gameOverScore");
const banner = document.getElementById("banner");

const catNballPosition = screen.availWidth > 600 ? 600 : screen.availWidth;
const randomPosition = screen.availWidth > 600 ? "25%" : "15%";

randomContainer.style.left = `${randomPosition}`;

catContainer.style.left = `${catNballPosition * 0.5 - 60}px`;
catContainer.style.top = `${screen.availHeight * 0.5 + 90}px`;
racket.style.left = `${body.getBoundingClientRect().width / 2 - 65}px`;
// playButton.style.left = `${body.getBoundingClientRect().width / 2 - 80}px`;

let lastTouchX = 0; // 이전 터치 X 위치를 저장하는 변수
let lastTouchY = 0; // 이전 터치 Y 위치를 저장하는 변수

let racketDirection = "left";
let catRacketX = 30;
let racketSpeed = screen.availWidth * 0.1;
let counter = 0;

let x = Math.floor(screen.availWidth * 0.5);
let y = Math.floor(screen.availHeight * 0.7);
let t = new Date().getTime() / 1000;
let ballScale = 1;

let playing = false;

let isTouching = false;
let gameTimer;

let selectedElement = "background";

let xSpeed = screen.availWidth * 0.2;
let ySpeed = -screen.availHeight * 1.5;
// const gravity = 1500; // 중력 가속도

let minScale = 0.5; // 최소 스케일 값
let maxScale = 1; // 최대 스케일 값
var lastTime = Date.now();

let tennisBall = "\uD83C\uDFBE";
let earth = "\uD83C\uDF0F";

earthCount.innerHTML = `${earth}&nbsp;&nbsp;${Math.floor(
  (new Date().getTime() - 1690900000000) * 0.4 + Math.random() * 100
).toLocaleString()}`;

window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag("js", new Date());
gtag("config", "G-XJ2CNF97FP");

//초기 페이지 playButton
function onPressStart() {
  gtag("event", "click start button");
  startScreen.style.display = "none";
  playScreen.style.display = "block";
}

// 게임 시작 버튼
function gameStart() {
  counter = 0;
  count.innerHTML = `${tennisBall}&nbsp;&nbsp;${counter}`;
  lastTime = Date.now() - 1;
  racket.style.display = "block";
  gameLoop();
  ballSpeed = -1;
  scaleFactor = 0.004;
  currentScale = 1;
  ballPosition = window.innerHeight * 0.8 - 50;
  playing = true;
  bgm.play();
  startCount.style.display = "none";
  //gif 초기화를 위한 코드
  startCount.src = "./three.png";
}

function onPressBack() {
  gtag("event", "click back button");
  playing = false;
  bgm.pause();
  startScreen.style.display = "flex";
  playScreen.style.display = "none";
  startCount.style.display = "none";
  moveContainer.style.display = "flex";
  gameOverContainer.style.display = "none";
  counter = 0;
  count.innerHTML = `${tennisBall}&nbsp;&nbsp;${counter}`;
  //gif 초기화를 위한 코드
  startCount.src = "./three.png";
}

function onPressMore() {
  gtag("event", "click more button");
  extraContainer.style.display = "flex";
  moreButton.style.display = "none";
}

document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    // 탭이 비활성화되면 오디오를 일시정지
    bgm.pause();
  } else {
    // 탭이 다시 활성화되면 오디오를 재생
    bgm.play();
  }
});

var gravity = 0.0018;
var ballHeight = 120;
var ballPosition = window.innerHeight * 0.8 - 50;
var ballLeft;
var ballSpeed = 20;
var scaleFactor = -0.006;
var currentScale = 1;
var oneThirdScreen = window.innerHeight * 0.4 + 50;
var twoThirdScreen = window.innerHeight * 0.8 + 50;
var direction = 1; // 공의 움직임 방향을 결정합니다.
var moveSpeed = 0.7; // 공의 좌우 이동 속도입니다.
ball.style.left = window.innerWidth > 600 ? 600 : window.innerWidth / 2 + "px";

function gameLoop() {
  var currentTime = Date.now();
  var dt = currentTime - lastTime;
  lastTime = currentTime;
  if (playing) {
    if (ballPosition + ballHeight > oneThirdScreen && scaleFactor > 0 && ballSpeed > 0) {
      collisionDetection();
      count.innerHTML = `${tennisBall}&nbsp;&nbsp;${counter.toLocaleString()}`;
      earthCount.innerHTML = `${earth}&nbsp;&nbsp;${Math.floor(
        (new Date().getTime() - 1690900000000) * 0.4 + Math.random() * 100
      ).toLocaleString()}`;
      playerHitSound.play();
      ballSpeed = -0.5;
      scaleFactor = -0.004;
      currentScale = 4;
      direction = -direction; // 공의 움직임 방향을 반대로 변경합니다.
    } else if (ballPosition + ballHeight > twoThirdScreen && scaleFactor < 0 && ballSpeed > 0) {
      catHitSound.play();
      ball.style.left = catNballPosition / 2 + "px";

      racketDirection = racketDirection === "left" ? "right" : "left";
      catRacketX = 0;
      if (racketDirection === "left") {
        catRacket.style.transform = `rotate(-20deg)`;
      } else {
        catRacket.style.transform = `rotate(20deg)`;
      }
      ballSpeed = -1;
      scaleFactor = 0.004;
      currentScale = 1;
    } else {
      racketSpeed = racketDirection === "left" ? 0.001 * dt : -(0.001 * dt);
      catRacketX = catRacketX + racketSpeed * dt;

      currentScale += scaleFactor * dt;
    }

    if (currentScale > 5) {
      currentScale = 5;
    }
    if (currentScale < 1) {
      currentScale = 1;
    }
    catRacketContainer.style.left = `${catRacketX}px`;

    ball.style.scale = currentScale;

    // 공의 left 속성을 조정하여 공을 오른쪽과 왼쪽으로 움직입니다.
    var currentLeft = parseFloat(ball.style.left) || 0;

    ballLeft = currentLeft + moveSpeed * direction;

    // 공이 화면 밖으로 나가지 않도록 합니다.
    if (ballLeft < 0) ballLeft = 0;
    if (ballLeft > window.innerWidth - ballHeight) ballLeft = catNballPosition - ballHeight;

    ball.style.left = ballLeft + "px";

    ballSpeed += gravity * dt;
    ballPosition += ballSpeed * dt;

    ball.style.top = ballPosition + "px";

    requestAnimationFrame(gameLoop);
  }
}

//조이스틱 및 플레이어 라켓 부분
var active = false;

var currentX;
var currentY;
var initialX;
var initialY;
var xOffset = 0;
var yOffset = 0;

function dragStart(e) {
  if (e.type === "touchstart") {
    initialX = e.touches[0].clientX - xOffset;
    initialY = e.touches[0].clientY - yOffset;
  } else {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
  }
  racket.style.scale = 0.9;

  active = true;
}

function dragEnd(e) {
  initialX = currentX;
  initialY = currentY;
  active = false;
}
let VcurrentX;
function drag(e) {
  e.preventDefault();

  if (active) {
    if (e.type === "touchmove") {
      currentX = e.touches[0].clientX - initialX;
      currentY = e.touches[0].clientY - initialY;
    } else {
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
    }

    VcurrentX = currentX * 1.5;
    xOffset = currentX;
    yOffset = currentY;
    if (currentX * 1.5 > window.innerWidth / 2) {
      VcurrentX = window.innerWidth / 2;
      xOffset = 0;
    }
    if (currentX * 1.5 < -window.innerWidth / 2) {
      VcurrentX = -(window.innerWidth / 2);
      xOffset = 0;
    }
    setTranslate(VcurrentX, currentY * 1.5, racket);
  }
}

function setTranslate(xPos, yPos, el) {
  el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}

window.addEventListener("touchstart", dragStart, false);
window.addEventListener("touchend", dragEnd, false);
window.addEventListener("touchmove", drag, false);

window.addEventListener("mousedown", dragStart, false);
window.addEventListener("mouseup", dragEnd, false);
window.addEventListener("mousemove", drag, false);

function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

function collisionDetection() {
  const distX = Math.abs(ballLeft - racket.getBoundingClientRect().left);
  const distY = Math.abs(ballPosition - racket.getBoundingClientRect().top / 2);
  const rpStart = racket.getBoundingClientRect().left;
  const rpLast = racket.getBoundingClientRect().left + racket.getBoundingClientRect().width;

  const bpStart = ball.getBoundingClientRect().left;
  const bpLast = ball.getBoundingClientRect().left + ball.getBoundingClientRect().width;

  const rpYStart = racket.getBoundingClientRect().top;
  const rpYLast = racket.getBoundingClientRect().bottom - 140;

  const bpYStart = ball.getBoundingClientRect().top;
  const bpYLast = ball.getBoundingClientRect().bottom;

  if (rpLast >= bpStart && rpStart <= bpLast && rpYLast >= bpYStart && rpYStart <= bpYLast) {
    counter = counter + 1;
  } else {
    bgm.pause();
    playing = false;
    ball.style.left = window.innerWidth > 600 ? 600 : window.innerWidth / 2 + "px";
    gameOverScore.innerHTML = `${tennisBall}&nbsp;&nbsp;${counter}&nbsp;&nbsp;POINT`;
    ball.style.display = "none";
    racket.style.display = "none";
    gameOverContainer.style.display = "flex";
    setTimeout(() => {
      moveContainer.style.display = "flex";
    }, 1500);
    isTouching = false;
  }
}

let currentSoundIndex = 0;

const soundNames = ["three", "two", "one", "go"];

function playSound(soundName) {
  const audio = new Audio(`${soundName}.mp3`);
  audio.play();
}

function playSoundsSequentially() {
  if (playing && currentSoundIndex < soundNames.length) {
    playSound(soundNames[currentSoundIndex]);
    startCount.style.backgroundImage = `url(${soundNames[currentSoundIndex]}.png)`;
    currentSoundIndex++;
    setTimeout(playSoundsSequentially, 950); // 1초 간격으로 다음 사운드 재생
  }
}

function touchClick() {
  isTouching = true;
  playing = true;
  currentSoundIndex = 0;
  ball.style.display = "block";
  racket.style.display = "block";
  gameOverContainer.style.display = "none";
  moveContainer.style.display = "none";
  startCount.style.display = "block";
  playSoundsSequentially();

  clearTimeout(gameTimer);

  gameTimer = setTimeout(() => {
    if (playing) {
      gameStart();
    }
  }, 4000);
}

function touchDrag() {
  if (isTouching) {
  }
}

function touchOut() {
  isTouching = false;
}

moveContainer.addEventListener("mousedown", touchClick, false);
moveContainer.addEventListener("mousemove", touchDrag, false);
moveContainer.addEventListener("mouseup", touchOut, false);

moveContainer.addEventListener("touchstart", touchClick, false);
moveContainer.addEventListener("touchmove", touchDrag, false);
moveContainer.addEventListener("touchend", touchOut, false);

function onClickFidgetTown() {
  gtag("event", "click fidgetTown");
}
