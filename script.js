var canvas = document.getElementById('pongCanvas');
var ctx = canvas.getContext('2d');

var color = '#ffffff';

var player1Score = 0;
var player2Score = 0;

//* scenery
var wallsX = canvas.width;
var wallsY = 2;
var divideX = 2;
var divideY = canvas.height;

//* defines the ball
var ball = 8;
var ballX = (canvas.width - ball) / 2;
var ballY = (canvas.height - ball) / 2;
var ballStart = [-2.5, 2.5]
var xBallSpeed = ballStart[Math.floor(Math.random()*ballStart.length)];
var yBallSpeed = ballStart[Math.floor(Math.random()*ballStart.length)];

//* defines the paddles
var paddleHeight = 50;
var paddleWidth = 7;
var player1X = 0;
var player1Y = (canvas.height - paddleHeight) / 2;
var player2X = (canvas.width - paddleWidth);
var player2Y = (canvas.height - paddleHeight) / 2;

/*
*** controls
 */

var wPressed = false;
var sPressed = false;
var upPressed = false;
var downPressed = false;
var gameToggle = false; //8 backspace

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function keyDownHandler(e) {
  if (e.keyCode === 87) {
    wPressed = true;
  }
  else if (e.keyCode === 83) {
    sPressed = true;
  }
  else if (e.keyCode === 38) {
    upPressed = true;
  }
  else if (e.keyCode === 40) {
    downPressed = true;
  }
  else if (e.keyCode === 8) {
    if (gameToggle === true) {
      gameToggle = false;
    }
    else {
      gameToggle = true;
      requestAnimationFrame(draw);
    }
  }
}

function keyUpHandler(e) {
  if (e.keyCode === 87) {
    wPressed = false;
  }
  else if (e.keyCode === 83) {
    sPressed = false;
  }
  else if (e.keyCode === 38) {
    upPressed = false;
  }
  else if (e.keyCode === 40) {
    downPressed = false;
  }
}

/*
*** end controls
 */

//* scenery shapes

function drawWallTop() {
  ctx.beginPath();
  ctx.rect(0, 0, wallsX, wallsY);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function drawWallBottom() {
  ctx.beginPath();
  ctx.rect(0, (canvas.height - wallsY), wallsX, wallsY);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function drawDivide() {
  ctx.beginPath();
  ctx.rect((canvas.width / 2) - (divideX / 2), 0, divideX, divideY);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

//* player and ball shapes

function drawPlayer1() {
  ctx.beginPath();
  ctx.rect(player1X, player1Y, paddleWidth, paddleHeight);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function drawPlayer2() {
  ctx.beginPath();
  ctx.rect(player2X, player2Y, paddleWidth, paddleHeight);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function drawBall() {
  ctx.beginPath();
  ctx.rect(ballX, ballY, ball, ball);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

/**
**** end shapes
 **/

//* keeping score

function drawPlayer1Score() {
  ctx.font = '24px Courier';
  ctx.fillStyle = color;
  ctx.fillText(player1Score, canvas.width * 0.25, 25);
}

function drawPlayer2Score() {
  ctx.font = '24px Courier';
  ctx.fillStyle = color;
  ctx.fillText(player2Score, canvas.width * 0.75, 25);
}

/**
**** painting the canvas and enabling collision detection
 **/

function draw() {

//* resets canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

//* draw scenery
  drawWallTop();
  drawWallBottom();
  drawDivide();

//* draw player and ball shapes
  drawBall();
  drawPlayer1();
  drawPlayer2();

//* draw score
  drawPlayer1Score();
  drawPlayer2Score();

/**
**** IF      // make ball collide with top and bottom
**** ELSE IF // player 1 paddle collsion
**** ELSE IF // player 2 paddle collision
 **/
  if (ballY + yBallSpeed > canvas.height - ball || ballY + yBallSpeed < 0) {
    yBallSpeed = -yBallSpeed;
  }
  else if (ballX + xBallSpeed < player1X + paddleWidth) {
    if (ballY > player1Y && ballY < player1Y + paddleHeight) {
      xBallSpeed = -xBallSpeed * 1.03; // multiplies speed on paddle collision
      yBallSpeed = yBallSpeed * 1.03;
    }
  }
  else if ((ballX + ball) + xBallSpeed > player2X) {
    if ((ballY + ball) > player2Y && (ballY + ball) < player2Y + paddleHeight) {
      xBallSpeed = -xBallSpeed * 1.03; // multiplies speed on paddle collision
      yBallSpeed = yBallSpeed * 1.03;
    }
  }

/**
**** scoring conditions and ball reset
 **/
//* player 1 score
  if (ballX + xBallSpeed > canvas.width - ball) {
    if (player1Score !== 9) {
      player1Score += 1;
      ballX = (canvas.width - ball) / 2;
      ballY = (canvas.height - ball) / 2;
      if (player1Score >= 5 || player2Score >= 5) {
        xBallSpeed = -3;
        yBallSpeed = ballStart[Math.floor(Math.random()*ballStart.length)] * 1.5;
      } else {
        xBallSpeed = -2;
        yBallSpeed = ballStart[Math.floor(Math.random()*ballStart.length)];
      }
    } else {
      alert("GAME OVER! Player 1 wins!")
      document.location.reload();
    }
  }
//* player 2 score
  else if (ballX + xBallSpeed < 0) {
    if (player2Score !== 9) {
      player2Score += 1;
      ballX = (canvas.width - ball) / 2;
      ballY = (canvas.height - ball) / 2;
      if (player2Score >= 5 || player1Score >= 5) {
        xBallSpeed = 3;
        yBallSpeed = ballStart[Math.floor(Math.random()*ballStart.length)] * 1.5;
      } else {
        xBallSpeed = 2;
        yBallSpeed = ballStart[Math.floor(Math.random()*ballStart.length)];
      }
    } else {
      alert("GAME OVER! Player 2 wins!")
      document.location.reload();
    }
  }

/**
**** paddle speed and collision with frame
 **/

//* Player 1
  if (wPressed && player1Y > wallsY) {
    player1Y -= 5;
  } else if (sPressed && player1Y < canvas.height - (paddleHeight - wallsY)) {
    player1Y += 5;
  }
//* Player2
  if (upPressed && player2Y > wallsY) {
    player2Y -= 5;
  } else if (downPressed && player2Y < canvas.height - (paddleHeight - wallsY)) {
    player2Y += 5;
  }

//* draws ball across the canvas
  ballX += xBallSpeed;
  ballY += yBallSpeed;

//* play and pause animation conditions
  if(gameToggle){
    requestAnimationFrame(draw);
  }
  else if (!gameToggle) {
    window.cancelAnimationFrame(requestAnimationFrame(draw));
  }
}

draw();
