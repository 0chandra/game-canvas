class Npc {
  constructor(
    velX,
    velY,
    jumpHeight,
    x,
    maxPower,
    defaultSprite,
    defaultSpriteFrameNumber,
    deathSpriteSheet,
    numberOfFramesDeath
  ) {
    this.velocityX = velX;
    this.velocityY = velY;
    this.gravity = GRAVITY;
    this.jumpHeight = jumpHeight;
    this.inAir = false;
    this.falling = false;
    this.isColided = false;
    this.inAction = false;
    this.isRunning = false;
    this.hasDealtBlow = false;
    this.maxPower = maxPower;
    this.power = this.maxPower;

    this.defaultSprite = defaultSprite;
    this.defaultSpriteFrameNumber = defaultSpriteFrameNumber;
    this.width =
      document.getElementById(defaultSprite).width /
      this.defaultSpriteFrameNumber;
    this.setSpriteSheet(defaultSprite, this.defaultSpriteFrameNumber);

    this.defaultHeight =
      CANVAS_HEIGHT -
      BASE_HEIGHT -
      document.getElementById(defaultSprite).height;

    // death spriteSheet
    this.deathSpriteSheet = deathSpriteSheet;
    this.numberOfFramesDeath = numberOfFramesDeath;

    // / size at which the spriteSheet is to be clipped (dimention of the character in the spritesheet)
    this.clippingX = 0;
    this.clippingY = 0;

    this.x = x;
    this.y = this.defaultHeight;

    // variable to keep track of the last update frame
    this.lastUpdate = Date.now();
    this.playerFrameIndex = 0;
  }

  setSpriteSheet(spriteSheetId, numberOfFrames) {
    this.spriteSheet = document.getElementById(spriteSheetId);

    this.timePerFrame = (100 / numberOfFrames) * 6;

    // spriteSheet dimentions
    this.spriteWidth = this.spriteSheet.width;
    this.spriteHeight = this.spriteSheet.height;
    this.height = this.spriteSheet.height;

    // single frame/sprite width; height is same as spriteHeight
    this.numberOfFrames = numberOfFrames;
    this.frameWidth = this.spriteWidth / this.numberOfFrames;
    this.width = this.frameWidth;
  }

  update() {
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

    // <<<<----->>>
    if (Date.now() - this.lastUpdate >= this.timePerFrame) {
      this.clippingX = this.playerFrameIndex * this.frameWidth;
      this.clippingY = this.spriteHeight;

      if (this.isDied) {
        return;
      }

      this.playerFrameIndex++;
      if (this.playerFrameIndex >= this.numberOfFrames) {
        this.playerFrameIndex = 0;
      }
      this.lastUpdate = Date.now();
    }
  }

  takeDamage() {
    this.isColided = false;
    console.log(this.power);
    if (this.power < 1) {
      this.killIt();
      return;
    }
    this.power--;
  }

  killIt() {
    if (this.deathSpriteSheet) {
      this.setSpriteSheet(this.deathSpriteSheet, this.numberOfFramesDeath);
    }
    if (this.playerFrameIndex >= this.numberOfFramesDeath - 1) {
      this.defaultVelocityX = 0;
      this.isDied = true;
    }
  }
}

class Player extends Npc {
  constructor() {
    super(0, 2, 150, 100, 2, "hero-idle", 6, "hero-death", 9);
    this.characterWidth = 40; //hero's actual width

    this.setSpriteSheet("hero-idle", 6);
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
      this.y = this.defaultHeight - 40;
    }

    // single frame/sprite width; height is same as spriteHeight
    this.numberOfFrames = numberOfFrames;
    this.frameWidth = this.spriteWidth / this.numberOfFrames;
    this.width = this.frameWidth;
  }

  origin() {
    return {
      x: 50,
      y: this.defaultHeight,
    };
  }
}

class Worm extends Npc {
  constructor() {
    super(1.4, 0.2, 0, CANVAS_WIDTH, 1, "worm-walk", 9, "worm-death", 8);

    this.defaultVelocityX = 1 + Math.random();
    this.velocityX = this.defaultVelocityX;

    // this.setSpriteSheet("worm-walk", 9);

    this.characterWidth = 52;
  }
}

class Skeleton extends Npc {
  constructor() {
    super(1, 0.1, 0, CANVAS_WIDTH, 2, "skeleton-walk", 4, "skeleton-death", 4);

    this.defaultVelocityX = 1 + Math.random();
    this.velocityX = this.defaultVelocityX;

    this.characterWidth = 52;
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

class obstacles {
  // benign limitations
}
