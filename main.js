// todo : implement engine class if possible

//player design : a circle madeup of multiple circle layers (to have total 10 layers), first three circles/layers are lit (has power) at the start of the game.
// everytime player gets a powerUp, a circle layer is lit up and player gains a power point. Plyer looses one if he gets hit by a low level enemy
// player gets killed instantly if got hit by the high level enemy.

// ANCHOR comment the code more.

window.onload = function () {
  const canvas = document.getElementById("gameCanvas");

  const ctx = canvas.getContext("2d");

  canvas.height = CANVAS_HEIGHT;
  canvas.width = CANVAS_WIDTH;

  const control = new Control();
  const game = new Game(CANVAS_HEIGHT, CANVAS_WIDTH, control.keys);
  const display = new Display(CANVAS_WIDTH);

  // eventListners for controls
  document.addEventListener("keydown", (e) => {
    control.keyDown(e);
    // game.move(game.player);
    // eventListner to pause game when pressed 'esc' keyDown
    if (e.key == "Escape") {
      console.log("lololol");
      game.pause = !game.pause;
      if (!game.pause) {
        loop();
      }
    }
  });
  document.addEventListener("keyup", (e) => {
    control.keyUp(e);
    // console.log(control.keys);
    // game.move(game.player);
  });

  // checks if window/tab is minimized or not and set the state game.pause accordingly
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState == "hidden") {
      game.pause = true;
    }
  });
  // TODO implement reset/restart-game feature
  // checks if user has clicked on pause icon, if yes -> changes game.pause state
  canvas.addEventListener("click", (e) => {
    const clickedX = e.clientX;
    const clickedY = e.clientY;

    const clickShape = game.pauseMenu;

    // tried using isOver() function here as well but textAlign = 'center' is fucking it over, so improvising here

    if (
      clickedX > clickShape.x - clickShape.fontSize / 2 &&
      clickedX > clickShape.x &&
      clickedY < clickShape.y + clickShape.fontSize / 2 &&
      clickedY > clickShape.y - clickShape.fontSize
    ) {
      game.pause = !game.pause;
      if (!game.pause) {
        loop();
      }
    }

    // console.log(game.isOver(clickedX, clickedY, game.pauseMenu.resumeButton));

    if (
      game.pause &&
      game.isOver(clickedX, clickedY, game.pauseMenu.resumeButton)
    ) {
      console.log("imin");

      game.pause = false;
      loop();
    }
  });

  let lastUpdateTime = Date.now();
  const timePerFrame = TIME_PER_FRAME;

  const loop = function () {
    console.log(game.enemies.enemyArray);
    if (game.pause) {
      display.drawPauseMenu(ctx, game.pauseMenu, game.pauseMenu.resumeButton);
      return;
    }
    if (game.player.isDied) {
      setTimeout(() => {
        game.pauseMenu.message = "You Ded, f5 to restart the game";
        game.pause = true;
      }, 250);
    }
    const currentTime = Date.now();
    if (currentTime - lastUpdateTime >= timePerFrame) {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      display.drawBackgroundParalax(ctx);
      // display.drawBackground(ctx, CANVAS_HEIGHT, CANVAS_WIDTH, "black");

      game.player.update();
      game.update(game.player);
      display.drawCharacter(ctx, game.player);

      game.enemies.enemyArray.forEach((enemy) => {
        display.drawCharacter(ctx, enemy);
        game.areColided(game.player, enemy);
        game.player.isColided = false;
      });

      game.attacks.forEach((attack, index) => {
        display.drawCharacter(ctx, attack);
        attack.update();
        attack.x -= attack.velocityX + LAYER_SPEED;
        if (game.areColided(game.player, attack)) {
          if (!attack.hasDealtBlow) {
            game.player.power--;
            game.attacks.slice(index, 1);
            game.player.isColided = false;
          }
        }
      });

      game.updateEnemies();
      display.drawText(ctx, game.gameStats(100, 40).health);
      display.drawText(ctx, game.gameStats(280, 40).kills);
      display.drawMenu(ctx, game.pauseMenu);

      display.drawPowerLevel(ctx, game.powerLevel);
      // console.log("fps1", 1000 / (currentTime - lastUpdateTime));   -->> FPS counter
      lastUpdateTime = currentTime;
    }
    requestAnimationFrame(loop);
  };

  loop();
};
