// game world is built using these classes. Main class - Game() takes in gameHeight and gameWidth, which are basically the dimentions of the canvas.
// Player class defines the dimentions, color, initial location etc.
// velocityX and velocityY, gravity are what their names suggest; defines the physics of the game.
// update method is recalled at each frame using requestAnimationFrame Loop

// todo jump

// todo velocity implementation

// todo gravity implementation

class Game {
  constructor(gameHeight, gameWidth, pressedKeys) {
    this.gameHeight = gameHeight;
    this.gameWidth = gameWidth;
    this.pressedKeys = pressedKeys;
    this.inAirHeight = 0;
    this.powerUps = [];

    this.player = new Player();
  }
  // colider detector, detects colidation with the borders of the game. (excluding the margin at the bottom - ground)
  colide(character) {
    if (character.x + character.width > this.gameWidth || character.x < 0) {
      character.velocityX = 0;
      character.x < 0 ? (character.x += 0.05) : (character.x -= 0.05);
    } else {
      character.velocityX = 0;
    }
    if (character.y + character.height > CANVAS_HEIGHT - BASE_HEIGHT) {
      character.y = CANVAS_HEIGHT - BASE_HEIGHT - character.height;
    } else if (character.y < 0) {
      character.y = 0;
    }
  }

  // function to detect colidation between two characters.
  // character1 & character2 = {x: , y: , height: , width: } their position on the canvas
  // returns -> true if they colide, false if not.

  areColided(character1, character2) {
    let colideX;
    let colideY;

    // checking if colide cordinates exists or not (to know what colide cordinates are, read comment in Player() Class)
    const character1_x1 = character1.colideX1
      ? character1.colideX1
      : character1.x;
    const character1_x2 = character1.colideX2
      ? character1.colideX2
      : character1.x + character1.width;

    const character2_x1 = character2.colideX1
      ? character2.colideX1
      : character2.x;
    const character2_x2 = character2.colideX2
      ? character2.colideX2
      : character2.x + character2.width;

    if (
      (character1_x1 > character2_x1 && character1_x1 < character2_x2) ||
      (character2_x1 > character1_x1 && character2_x1 < character1_x2)
    ) {
      colideX = true;
    } else {
      return false;
    }
    if (
      (character1.y > character2.y &&
        character1.y < character2.height + character2.y) ||
      (character2.y > character1.y &&
        character2.y < character1.height + character1.y)
    ) {
      colideY = true;
    } else {
      return false;
    }
    if (colideX && colideY && !(character1.isColided || character2.isColided)) {
      character1.isColided = true;
      character2.isColided = true;
      return true;
    }
  }

  // updates the character, moves/jumps etc
  update(character) {
    if (this.pressedKeys.length == 0) {
      character.isRunning = false;
      LAYER_SPEED = 0;
      if (!character.inAction) {
        character.setSpriteSheet("hero-idle", 6);
        // character.y = HERO_HEIGHT;
        this.moveToOrigin(character, character.origin);
      }
    }

    this.colide(character);

    // cant run/jump while performing an action move
    if (!character.inAction) {
      if (this.pressedKeys.indexOf("ArrowRight") > -1) {
        character.setSpriteSheet("hero-run", 8);
        // this.move(character, "right");
        LAYER_SPEED = LAYER_SPEED_DEFAULT;
      }
      if (
        this.pressedKeys.indexOf("ArrowLeft") > -1 &&
        character.x >= character.origin().x
      ) {
        this.move(character, "left");
        LAYER_SPEED = 0;
        // this.setSpriteSheet("hero-run", 8);
      }
      if (this.pressedKeys.indexOf("ArrowUp") > -1 || character.inAir) {
        character.setSpriteSheet("hero-run", 8);
        this.jump(character, character.origin());
      }
    }

    // action - sword moves, wont work while character is running, jumping (is inAir) or performing another action move
    if (!character.inAction && !character.isRunning && !character.inAir) {
      if (this.pressedKeys.indexOf("Control") > -1) {
        this.strike("action1", character);
      }
      if (this.pressedKeys.indexOf("Alt") > -1) {
        this.strike("action2", character);
      }
      if (this.pressedKeys.indexOf("Shift") > -1) {
        this.strike("action3", character);
      }
    }
  }

  // updater heper functions
  // character = {x: , y: , ...}
  // direction -> string with either of two values - "left" or "right"
  move(character, direction) {
    character.isRunning = true;
    switch (direction) {
      case "right":
        character.x += character.velocityX;
        break;
      case "left":
        character.x -= character.velocityX;
        break;
      case "up":
        character.y -= character.velocityY;
        break;
    }
  }

  //  needs improvement, but doable for now.
  //  origin -> origin coordinates of the character.
  jump(character, origin) {
    if (!character.inAir) {
      character.inAir = true;
      this.inAirHeight = 0;
    } else {
      if (!character.falling) {
        console.log(character.y);
        // speed at which the character should jump in the upward directions, higher the character is in the air slower it gets, due to gravity. the velocity reduces.
        const speed =
          character.velocityY *
          (15 - (this.inAirHeight * 15) / character.jumpHeight);

        character.y -= speed;
        this.inAirHeight += speed;

        // will make character.falling true, if the character has reached the needed height, i.e. jumpHeight-2
        this.inAirHeight > character.jumpHeight - 15
          ? (character.falling = true)
          : (character.falling = false);
      } else {
        // should run when the character has reached the threshold height/ peak point, i.e. jumpHeight -2.

        const speed =
          character.velocityY *
          (15 - (this.inAirHeight * 15) / character.jumpHeight);
        character.y += speed;
        this.inAirHeight -= speed;

        if (character.y >= origin.y) {
          this.inAirHeight = 0;
          character.falling = character.inAir = false;
        }
      }
    }
  }

  // actionnnnn
  strike(typeOfAction, character) {
    character.inAction = true;
    character.colideX1 = character.colideX1Default;
    character.colideX2 = character.x + character.width;
    LAYER_SPEED = 0;
    switch (typeOfAction) {
      case "action1":
        character.setSpriteSheet("hero-sword1", 4);
        break;
      case "action2":
        character.setSpriteSheet("hero-sword2", 4);
        break;
      case "action3":
        character.setSpriteSheet("hero-sword3", 4);
        break;
      default:
        break;
    }
    setTimeout(() => {
      character.inAction = false;
      character.y = HERO_HEIGHT;
      character.colideX1 = character.colideX1Default;
      character.colideX2 = character.colideX2Default;
      character.setSpriteSheet("hero-idle", 6);
    }, 780);
  }

  // character = {height: , width: , x: , y: , ...}
  // origin = {x: , y:}
  moveToOrigin(character, origin) {
    if (character.x > origin.x) {
      this.move(character, "left");
    }
    if (character.y > origin.y) {
      this.move(character, "up");
    }
  }

  updateObstacle() {
    this.generateObstacle();
    this.powerUps.forEach((pu, index) => {
      if (pu.x < 0 || (pu.isColided && this.player.inAction)) {
        pu.killIt();
        if (pu.isDied) {
          this.powerUps.splice(index, 1);
        }
      }
      pu.update();
      this.move(pu, "left");
    });
  }

  generateObstacle() {
    if (Math.random() > 0.995) {
      const powerUp = new PowerUp();
      this.powerUps.push(powerUp);
    }
  }
}

class PowerLevel {
  constructor(radius, x, y) {
    this.radius = radius;
    this.height = this.width = radius * 2;
    this.playerLayers = 4;
    this.colorPallate = [
      "#03045E",
      "#023E8A",
      "#0077B6",
      "#0096C7",
      "#00B4D8",
      "#48CAE4",
      "90E0EF",
    ];
    this.x = this.radius * 2 + this.increament * this.playerLayers + x;
    this.y = y;
  }
}

class Player {
  constructor() {
    this.velocityX = 0;
    this.velocityY = 2;
    this.gravity = 4;
    this.jumpHeight = 150;
    this.inAir = false;
    this.falling = false;
    this.isColided = false;
    this.inAction = false;
    this.isRunning = false;
    this.characterWidth = 40; //hero's actual width

    this.setSpriteSheet("hero-idle", 6);

    this.x = 100;
    this.y = HERO_HEIGHT;

    // character cordinates
    // character width and cordinates of the character -> colidation in x-axis works by detecting if the 2nd object is between 1st object's
    // first and second point in the x-axis (x and x+object's width), but the the character.width is actually the
    // width of a single frame from the spriteSheet. so to make funtion work correctly,
    // we need to add margin (half of the character's width) to the center point of the frame (character.width).
    // hence, character's cordinates -> (character.x + character.width/2 - character.character.width/2 , character.x + character.width/2 + character.character.width/2)
    this.colideX1Default = this.x + this.width / 2 - this.characterWidth / 2;
    this.colideX2Default = this.x + this.width / 2 + this.characterWidth / 2;

    this.colideX1 = this.colideX1Default;
    this.colideX2 = this.colideX2Default;

    // size at which the spriteSheet is to be clipped (dimention of the character in the spritesheet)
    this.clippingX = 0;
    this.clippingY = 0;

    // variable to keep track of the last update frame
    this.lastUpdate = Date.now();
    this.playerFrameIndex = 0;
  }

  setSpriteSheet(spriteSheetId, numberOfFrames) {
    if (this.inAction || this.inAir) {
      this.playerFrameIndex = 0;
    }

    this.spriteSheet = document.getElementById(spriteSheetId);

    this.timePerFrame = (100 / numberOfFrames) * 6;

    // spriteSheet dimentions
    this.spriteWidth = this.spriteSheet.width;
    this.spriteHeight = this.spriteSheet.height;
    this.height = this.spriteSheet.height;
    HERO_SPRITE_HEIGHT = this.height;
    if (this.inAction) {
      this.y = HERO_HEIGHT - 40;
    }

    // single frame/sprite width; height is same as spriteHeight
    this.numberOfFrames = numberOfFrames;
    this.frameWidth = this.spriteWidth / this.numberOfFrames;
    this.width = this.frameWidth;
  }

  update() {
    if (Date.now() - this.lastUpdate >= this.timePerFrame) {
      this.clippingX = this.playerFrameIndex * this.frameWidth;
      this.clippingY = this.spriteHeight;

      this.playerFrameIndex++;
      if (this.playerFrameIndex >= this.numberOfFrames) {
        this.playerFrameIndex = 0;
      }
      this.lastUpdate = Date.now();
    }
  }

  origin() {
    return {
      x: 50,
      y: HERO_HEIGHT,
    };
  }
}

class PowerUp {
  // player's strength increases whenever it touches these.
  // displayed as litup circle layers
  // player changes colors every powerup
  constructor() {
    this.radius = 8 * (1 + Math.random());
    this.color = "#52b788";
    this.isKillable = true;
    this.width = this.height = this.radius * 2;
    this.x = CANVAS_WIDTH + 8;
    this.y =
      CANVAS_HEIGHT - (8 + BASE_HEIGHT + (200 - BASE_HEIGHT) * Math.random());

    this.defaultVelocityX = 2.5 * (1 + Math.random());
    this.velocityX = this.defaultVelocityX;
    this.isColided = false;
    this.isDied = false;
  }
  update() {
    this.velocityX = this.defaultVelocityX + LAYER_SPEED;
  }
  killIt() {
    this.radius -= 1.2;
    if (this.radius < 1) {
      this.isDied = true;
    }
  }
}

class Enemy {
  // two kinds of enimies:
  // 1. kills the player in an instant : shows us rarely
  // 2. weakens the player (decreases the power number)
}

class obstacles {
  // benign limitations
}
