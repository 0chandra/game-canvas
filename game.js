// game world is built using these classes. Main class - Game() takes in gameHeight and gameWidth, which are basically the dimentions of the canvas.
// Player class defines the dimentions, color, initial location etc.
// velocityX and velocityY, gravity are what their names suggest; defines the physics of the game.
// update method is recalled at each frame using requestAnimationFrame Loop

// TODO remove unnecessary console.log
// TODO display no. of killed enemies
// TODO if crosses a particular no. of kills, start the boss fight

class Game {
  constructor(gameHeight, gameWidth, pressedKeys) {
    this.gameHeight = gameHeight;
    this.gameWidth = gameWidth;
    this.pressedKeys = pressedKeys;
    this.inAirHeight = 0;
    this.pause = false;
    this.powerUps = [];
    this.enemies = { generateEnemy: true, enemyArray: [], killedEnemies: 0 };
    this.attacks = []; //only airborne attacks
    this.pauseMenu = {
      x: CANVAS_WIDTH - 40,
      y: 40,
      fontSize: "20",
      backgroundColor: "rgb(0,0,0,.50)",
      message: "Game Paused",
      resumeButton: {
        x: CANVAS_WIDTH / 2 - 150 / 2,
        y: CANVAS_HEIGHT / 2 - 40 / 2,
        width: 150,
        height: 40,
        fontSize: "25px",
        message: "resume",
        color: "black",
      },
    };

    this.player = new Player();
    this.powerLevel = new PowerLevel(15, 100, 50);
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
    let colideX = false;
    let colideY = false;

    // checking if colide cordinates exists or not (to know what colide cordinates are, read comment in Npc() Class -> update() function)
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
      // console.log("character2Height", character2.height);
      colideY = true;
    } else {
      return false;
    }
    if (colideX && colideY && !(character1.isColided || character2.isColided)) {
      character1.isColided = true;
      character2.isColided = true;
      console.log("im innn im innn 2222313");
      return true;
    }
  }

  // updates the character, moves/jumps etc
  update(character) {
    if (this.pressedKeys.length == 0) {
      character.isRunning = false;
      LAYER_SPEED = 0;
      if (!character.inAction && character.power > 0) {
        character.setSpriteSheet(
          character.defaultSprite,
          character.defaultSpriteFrameNumber
        );
        // character.y = HERO_HEIGHT;
        this.moveToOrigin(character, character.origin);
      }
    }

    this.colide(character);

    // cant run/jump while performing an action move
    if (!character.inAction && character.power > 0) {
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
        this.strike(character, "hero-sword1", 4);
      }
      if (this.pressedKeys.indexOf("Alt") > -1) {
        this.strike(character, "hero-sword2", 4);
      }
      if (this.pressedKeys.indexOf("Shift") > -1) {
        this.strike(character, "hero-sword3", 4);
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

  // sword moves
  strike(character, sprite, numberOfFrames) {
    if (character.power < 1) {
      return;
    }
    character.inAction = true;
    character.colideX1 = character.colideX1Default;
    character.colideX2 = character.x + character.width;
    LAYER_SPEED = 0;

    // sets the sprite
    character.setSpriteSheet(sprite, numberOfFrames);

    // will change the spriteSheet back to default
    setTimeout(() => {
      character.inAction = false;
      character.hasDealtBlow = false;
      character.y = character.defaultHeight; //HERO-HEIGHT
      character.colideX1 = character.colideX1Default;
      character.colideX2 = character.colideX2Default;

      if (character.power > 1) {
        character.playerFrameIndex = 0;
        character.setSpriteSheet(
          character.defaultSprite,
          character.defaultSpriteFrameNumber
        );
        character.inAction = false;
      }
    }, 780);
  }

  // airborne attacks
  attack(character, sprite, numberOfFrames) {
    if (character.power < 1) {
      return;
    }

    if (!character.inAction) {
      character.inAction = true;
      character.setSpriteSheet(sprite, numberOfFrames);
    }

    setTimeout(() => {
      const attack = new AirBorneAttack(
        character.x,
        character.y + 10,
        character.airAttackSprite.spriteSheet,
        character.airAttackSprite.numberOfFrames
      );

      this.attacks.push(attack);
      character.setDefaultSprite();
      character.inAction = false;
    }, 780);

    //
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

  updateEnemies() {
    if (this.enemies.generateEnemy) {
      setInterval(() => {
        if (!this.pause) {
          this.generateEnemy();
        }
      }, 4000 + 2000 * Math.random());
    }
    this.enemies.generateEnemy = false;
    this.enemies.enemyArray.forEach((enemy, index) => {
      if (
        this.player.colideX2Default > enemy.x &&
        this.player.colideX1Default < enemy.x
      ) {
        if (!enemy.inAction && enemy.canStrike) {
          this.strike(
            enemy,
            enemy.strikeSpriteSheet,
            enemy.strikeNumberOfFrames
          );
        }
      }
      // dealing damage, reducing power of the character
      if (enemy.isColided && this.player.inAction) {
        enemy.takeDamage();
        // this.player.inAction = false;
      }

      if (enemy.inAction && !enemy.hasDealtBlow && enemy.isColided) {
        this.player.takeDamage();
        enemy.hasDealtBlow = true;
      }
      if (enemy.x + enemy.characterWidth < 0) {
        this.enemies.enemyArray.splice(index, 1);
      }
      if (enemy.canAttackAirBorne && !enemy.inAction) {
        if (4 * Math.random() > 3.95 && !enemy.inAction) {
          this.attack(
            enemy,
            enemy.attackSprite.spriteSheet,
            enemy.attackSprite.numberOfFrames
          );
        }
      }

      enemy.velocityX = enemy.defaultVelocityX + LAYER_SPEED;
      this.move(enemy, "left");
      enemy.update();
    });
  }

  generateEnemy() {
    const enemy = Math.random() < 0.5 ? new Skeleton() : new Worm();
    this.enemies.enemyArray.push(enemy);
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

  score(x, y) {
    return {
      font: "monospace",
      fontSize: "30px",
      content: this.player.power,
      color: "black",
      x: x,
      y: y,
    };
  }

  isOver(clickedX, clickedY, clickShape, h, w) {
    const height = typeof h === "undefined" ? clickShape.height : h;
    const width = typeof w === "undefined" ? clickShape.width : w;

    // console.log(height, width, h, w);

    console.log(
      clickedX < clickShape.x + width,
      clickedX > clickShape.x,
      clickedY < clickShape.y + height,
      clickedY > clickShape.y
    );

    if (
      clickedX < clickShape.x + width &&
      clickedX > clickShape.x &&
      clickedY < clickShape.y + height &&
      clickedY > clickShape.y
    ) {
      return true;
    }
    return false;
  }
}
