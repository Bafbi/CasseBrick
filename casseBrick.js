const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let x = canvas.width/2;
let y = canvas.height-50;
const baseDX = 1.5
const baseDY = -3
let dx = baseDX;
let dy = baseDY;
const ballRadius = 10;
let ballColor = "#0095DD"
let paddleColor = "#0095DD"
let paddleHeight = 10;
let paddleWidth = 70;
let paddleX = (canvas.width-paddleWidth)/2;
let paddleY = canvas.height-paddleHeight-10
let rightPressed = false;
let leftPressed = false;
let pause = false;
let score = 0;
let live = 3;
let onCanvas = false
let difficulty = 1

let brickRowCount = 3;
let brickColumnCount = 6;
const brickPadding = 10;
let brickWidth = canvas.width / brickColumnCount - brickPadding;
const brickHeight = 20;
const brickOffsetTop = 30;
let brickOffsetLeft = (canvas.width - (brickWidth + brickPadding) * brickColumnCount) + brickPadding / 2;
reloadValues()

var bricks = [];
for(let c=0; c<brickColumnCount; c++) {
  bricks[c] = [];
  for(let r=0; r<brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

draw();

function drawBricks() {
  for(let c=0; c<brickColumnCount; c++) {
      for(let r=0; r<brickRowCount; r++) {
        if (bricks[c][r].status == 1) {
          let brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
          let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = "#0095DD";
          ctx.fill();
          ctx.closePath();
        }

      }
  }
}

function bricksCollision() {
  for(var c=0; c<brickColumnCount; c++) {
      for(var r=0; r<brickRowCount; r++) {
        if (bricks[c][r].status == 1) {
          let brick = bricks[c][r];
          if (x + dx > brick.x && x + dx < brick.x+brickWidth && y + dy > brick.y && y + dy < brick.y+brickHeight) {
            brick.status = 0;
            dy = -dy;
            score++;
            if (score == brickRowCount*brickColumnCount) {
              alert(`Vous avez gagné avec ${score} points, Bravo!`);
              document.location.reload();
              clearInterval(interval);
            }
          }
        }
      }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Score : ${score}`, 8, 20);
}

function drawLive() {
  ctx.font = "16xp Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Vie : ${live}`, canvas.width-65, 20);
}

function drawTest() {
  ctx.font = "16xp Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Vitesse : ${paddleWidth}`, canvas.width / 2, 20);
}

  function drawBall() {
      ctx.beginPath();
      ctx.arc(x, y, ballRadius, 0, Math.PI*2);
      ctx.fillStyle = ballColor;
      ctx.fill();
      ctx.closePath();
  }

  function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = paddleColor;
    ctx.fill();
    ctx.closePath();
  }

  document.getElementById("paddleWidthSlider").oninput = function() {
    paddleWidth = document.getElementById("paddleWidthSlider").value;
    document.getElementById("paddleWidthValue").innerHTML = "Paddle Width : " + paddleWidth;
  }
  document.getElementById("paddleHeightSlider").oninput = function() {
    paddleHeight = document.getElementById("paddleHeightSlider").value;
    document.getElementById("paddleHeightValue").innerHTML = "Paddle Height : " + paddleHeight;
    paddleY = canvas.height-paddleHeight-10
  }
  document.getElementById("brickRowCountSlider").oninput = function() {
    brickRowCount = document.getElementById("brickRowCountSlider").value;
    document.getElementById("brickRowCountValue").innerHTML = "Brick Row : " + brickRowCount;
  }
  document.getElementById("brickColumnCountSlider").oninput = function() {
    brickColumnCount = document.getElementById("brickColumnCountSlider").value;
    document.getElementById("brickColumnCountValue").innerHTML = "Brick Column : " + brickColumnCount;
    brickWidth = canvas.width / brickColumnCount - brickPadding;
    brickOffsetLeft = (canvas.width - (brickWidth + brickPadding) * brickColumnCount) + brickPadding / 2;
  }

  function reloadValues() {
    document.getElementById("paddleWidthValue").innerHTML = "Paddle Width : " + paddleWidth;
    document.getElementById("paddleHeightValue").innerHTML = "Paddle Height : " + paddleHeight;
    document.getElementById("brickRowCountValue").innerHTML = "Brick Row : " + brickRowCount;
    document.getElementById("brickColumnCountValue").innerHTML = "Brick Column : " + brickColumnCount;
  }

  function draw() {
    if (pause == false) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBall();
      drawPaddle();
      drawBricks();
      bricksCollision();
      drawScore();
      drawLive();
      drawTest();

      x += dx;
      y += dy;

      if (paddleX < (x + dx) && (x + dx) < (paddleX + paddleWidth) && paddleY < (y + dy)) {
        dx = Math.round((dx + 0.6 * (2.5 * Math.atan(-((paddleX - x) + paddleWidth / 2) / 8 * difficulty))) * 100) / 100;
        dy = -dy * 1.05;
        paddleColor = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
        difficulty ++
      }
      else if (y + dy - ballRadius < 0) {
        dy = -dy;
        ballColor = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
      }
      else if (x + dx - ballRadius < 0 || x + dx + ballRadius > canvas.width) {
        dx = -dx;
        ballColor = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
      }
      else if (y + dy + ballRadius > canvas.height) {
        live--
        if (!live) {
          live = 3;
          x = canvas.width / 2;
          y = canvas. height - 30;
          dx = baseDX;
          dy = baseDY;
          setTimeout(pause = true, 50);
        } else {
          x = canvas.width / 2;
          y = canvas. height - 30;
          dx = baseDX;
          dy = baseDY;
        }

      }

      if(rightPressed && paddleX + paddleWidth < canvas.width) {
        paddleX += 6;
      }
      else if(leftPressed && paddleX > 0) {
        paddleX -= 6;
      }
    }
    requestAnimationFrame(draw);
  }


  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  document.addEventListener("mousemove", mouseMoveHandler, false);
  canvas.addEventListener("mouseenter", function(mouseEnterCanvas) {
    onCanvas = true;
  }, false);

  canvas.addEventListener("mouseleave", function(mouseLeaveCanvas) {
    onCanvas = false;
  }, false);

  function mouseMoveHandler(e) {
    let relativeX = e.offsetX;
    let relativeY = e.offsetY;
    if (onCanvas && relativeX > paddleWidth/2 && relativeX < canvas.width - paddleWidth/2) {
      paddleX = relativeX - paddleWidth/2;
    }

  }

  function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight" || e.key == "d") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft" || e.key == "q") {
        leftPressed = true;
    }
    else if(e.key == "p" && !pause) {
      pause = true
    }
    else if(e.key == "p" && pause) {
      pause = false
    }
  }

  function keyUpHandler(e) {
      if(e.key == "Right" || e.key == "ArrowRight" || e.key == "d") {
          rightPressed = false;
      }
      else if(e.key == "Left" || e.key == "ArrowLeft" || e.key == "q") {
          leftPressed = false;
      }
  }
