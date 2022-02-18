// todo : implement engine class if possible

//player design : a circle madeup of multiple circle layers (to have total 10 layers), first three circles/layers are lit (has power) at the start of the game.
// everytime player gets a powerUp, a circle layer is lit up and player gains a power point. Plyer looses one if he gets hit by a low level enemy
// player gets killed instantly if got hit by the high level enemy.
window.onload = function () {
  const canvas = document.getElementById("gameCanvas");
  console.log(canvas);

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
  });
  document.addEventListener("keyup", (e) => {
    control.keyUp(e);
    // console.log(control.keys);
    // game.move(game.player);
  });

  let lastUpdateTime = Date.now();
  const timePerFrame = TIME_PER_FRAME;

  const loop = function () {
    const currentTime = Date.now();
    if (currentTime - lastUpdateTime >= timePerFrame) {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      display.drawBackgroundParalax(ctx);
      // display.drawBackground(ctx, CANVAS_HEIGHT, CANVAS_WIDTH, "black");

      game.player.update();
      game.update(game.player);
      display.drawPlayer(ctx, game.player);

      game.powerUps.forEach((pu) => {
        display.drawObstacle(ctx, pu);
        game.areColided(game.player, pu);
        game.player.isColided = false;
      });
      game.updateObstacle();
      // console.log("fps1", 1000 / (currentTime - lastUpdateTime));   -->> FPS counter
      lastUpdateTime = currentTime;
    }
    requestAnimationFrame(loop);
  };

  loop();
};
