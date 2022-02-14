// Diplay class - seperates the rendering logic from the main file.
// implementation of update method

class Display {
  constructor(canvasWidth) {
    this.canvasWidth = canvasWidth;
    // paralax bg layers
    this.layer1 = new ParallaxLayer(document.getElementById("layer1"));
    this.layer2 = new ParallaxLayer(document.getElementById("layer2"));
    this.layer3 = new ParallaxLayer(document.getElementById("layer3"));
    this.layer4 = new ParallaxLayer(document.getElementById("layer4"));
    this.layer5 = new ParallaxLayer(document.getElementById("layer5"));
    this.layer6 = new ParallaxLayer(document.getElementById("layer6"));
    this.layer7 = new ParallaxLayer(document.getElementById("layer-light"));
    this.layer8 = new ParallaxLayer(document.getElementById("layer8"));
    this.layer9 = new ParallaxLayer(document.getElementById("layer9"));
    this.layer10 = new ParallaxLayer(document.getElementById("layer10"));
    this.layer11 = new ParallaxLayer(document.getElementById("layer11"));
  }

  drawRect(context, rectObject) {
    context.fillStyle = rectObject.color;
    // console.log(context.fillStyle);
    context.fillRect(
      rectObject.x,
      rectObject.y,
      rectObject.width,
      rectObject.height
    );
  }

  drawBackground(context, height, width, color) {
    this.drawRect(context, {
      color: color,
      height: height,
      width: width,
      x: 0,
      y: 0,
    });
  }

  drawBackgroundParalax(context) {
    this.layer11.draw(context, 3);
    this.layer10.draw(context, 2.8);
    this.layer9.draw(context, 2.6);
    this.layer8.draw(context, 2.4);
    this.layer7.draw(context, 2);
    this.layer6.draw(context, 2);
    this.layer5.draw(context, 1.8);
    this.layer4.draw(context, 1.6);
    this.layer3.draw(context, 1.4);
    this.layer2.draw(context, 1.2);
    this.layer1.draw(context, 1);
  }

  drawPlayer(context, playerObj) {
    context.drawImage(
      playerObj.spriteSheet,
      playerObj.clippingX,
      0,
      playerObj.frameWidth,
      playerObj.spriteHeight,
      playerObj.x,
      playerObj.y,
      playerObj.frameWidth,
      playerObj.spriteHeight
    );
  }

  // main character is a layered circle (multiple circles with same origin/center-point)
  drawPowerLevel(context, circleObj) {
    // main character is a layered circle (multiple circles with same origin/center-point)
    for (let a = circleObj.playerLayers; a > 0; a--) {
      context.beginPath();
      context.arc(
        circleObj.x,
        circleObj.y,
        circleObj.radius + a * circleObj.increament,
        0,
        2 * Math.PI
      );
      // context.closePath();
      context.fillStyle = circleObj.colorPallate[a + 1];
      context.fill();
    }
  }

  drawObstacle(context, obstacleObj) {
    context.beginPath();
    context.arc(
      obstacleObj.x,
      obstacleObj.y,
      obstacleObj.radius,
      0,
      2 * Math.PI
    );
    context.strokeStyle = obstacleObj.color;
    context.lineWidth = 2;
    context.stroke();
  }
}

class ParallaxLayer {
  constructor(src) {
    this.x = 0;
    this.duplicateX = src.width;

    this.width = src.width;

    this.src = src;
  }
  draw(context, distance) {
    context.drawImage(this.src, this.x, 0);
    context.drawImage(this.src, this.duplicateX, 0);

    if (this.x < -this.width)
      this.x = this.width + this.duplicateX - LAYER_SPEED;
    else this.x -= LAYER_SPEED / distance;

    if (this.duplicateX < -this.width)
      this.duplicateX = this.width + this.x - LAYER_SPEED;
    else this.duplicateX -= LAYER_SPEED / distance;
  }
}
