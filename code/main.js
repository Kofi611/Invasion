import kaboom from "kaboom"
// initialize context
kaboom({
  background: [0, 0, 0],
});

// load assets
loadSprite("ship", "sprites/ship.png")
//music from dlsounds
loadSound("TheNovisBase", "sounds/TheNovisBase.wav")
//music by ZakharValaha from pixabay
loadSound("AmbientPianoStrings", "sounds/AmbientPianoStrings.mp3")
//music by madirfan from pixabay
loadSound("BothOfUs", "sounds/BothOfUs.mp3")
loadSound("explosion", "sounds/ArcadeExplosion.wav")

layers([
  "bg",
  "obj",
  "ui",
], "obj");

var score = 0
var scoreRecord = 0
var alienSpawnSpeed = 1
var alienSpeed = 50
var health = 100
const Width = width()
const Height = height()

replit.setData("highscore", score);

scene("title", () => {
  
  const menuMusic = play("AmbientPianoStrings", {
    volume: 0.5,
    loop: true
  })
  menuMusic.play()
  
  add([
    text("Invasion"),
    layer("ui"),
    pos((width() / 2), 100),
    origin("center")
  ])

  add([
    text("Play"),
    layer("ui"),
    pos((width() / 2), 200),
    area(),
    "play",
    origin("center")
  ])

  onClick("play", (play) => {
    go("game");
    menuMusic.pause()
  })
})

scene("game", () => {

  score = 0
  scoreRecord = 0
  alienSpawnSpeed = 1
  alienSpeed = 50
  health = 100
  const gameMusic = play("TheNovisBase", {
    volume: 0.5,
    loop: true
  })

  const starCount = 500;
  const starSpeed = 5;
  var stars = [];

  function spawnStars() {
    for (let i = 0; i < starCount; i++) {
      const newStar = {
        xpos: rand(1, width()),
        ypos: rand(1, height())
      };
      stars.push(newStar);
    }
  }

  spawnStars();

  onUpdate(() => {
    stars.forEach((star) => {
      //star.ypos += starSpeed;
      const intensity = rand(1, 255);

      drawRect({
        width: 2,
        height: 2,
        pos: vec2(star.xpos, star.ypos),
        color: rgb(intensity, intensity, intensity)
      });
    })
  });

  const player = add([
    sprite("ship"),
    pos(80, 40),
    scale(0.1),
    area(),
    origin("center"),
    "player"
  ])

  onMouseMove(() => {
    player.moveTo(mousePos())
  })

  onMousePress(() => {
    add([
      rect(5, 5),
      pos(mousePos()),
      area(),
      origin("center"),
      move(UP, 200),
      cleanup(3),
      "bullet",
      color(rgb(123, 104, 238))
    ])
  })

  loop(alienSpawnSpeed, () => {
    add([
      rect(20, 20),
      pos(rand(10, width(-10)), 10),
      origin("center"),
      area(),
      move(DOWN, alienSpeed),
      cleanup(3),
      color(102, 255, 51),
      "alien"
    ])
  })

  onUpdate(() => {
    if (score - scoreRecord >= 20) {
      scoreRecord = score;
      alienSpawnSpeed /= 1.25;
      alienSpeed *= 2
    }
  })

  const scoreDisplay = add([
    text("Score: 0", {
      size: 48
    }),
    pos(width() - 250, 50),
    layer("ui"),
  ])

  const healthDisplay = add([
    text("Health: 100", {
      size: 48
    }),
    pos(0 + 50, 50),
    layer("ui"),
  ])

  onCollide("bullet", "alien", (bullet, alien) => {
    destroy(alien),
      score += 1
      if (health < 100) {
        health+= parseInt(rand(1, 5))
        healthDisplay.text = "Health:" + health
      }
    scoreDisplay.text = "Score:" + score
  })

  onCollide("alien", "player", (alien, player) => {
    destroy(alien),
      health -= parseInt(rand(3, 12))
      healthDisplay.text = "Health:" + health
    play("explosion", {
      volume: 0.75
    })
  })

  onUpdate(() => {
    if (health > 100) {
      health = 100;
      healthDisplay.text = "Health:" + health
    }
    if (health <= 0) {
      gameMusic.pause()
      go("lose")
    }
  })

  onUpdate("alien", (alien) => {
    if (alien.pos.y >= height()) {
      gameMusic.pause()
      go("lose")
    }
  })
})

scene("lose", () => {
  add([
    text("Game Over"),
    pos(Width/2, Height/2 - 50),
    origin("center")
  ])
  add([
    text("Your Score: " + score),
    pos(width() / 2, height()/2),
    origin("center")
  ])

  replit.getData("highscore").then((highscore) => {
    if (score > highscore) {
      highscore = score;
      replit.setData("highscore", highscore);
    }

    add([
      text("High Score: " + highscore),
      pos(Width/2, Height/2+50),
      origin("center")
    ])
  })

  add([
    text("Play Again"),
    pos(50, height() - 100),
    "restart",
    area()
  ])

  add([
    text("Main Menu"),
    pos(width() - 450, height() - 100),
    "menu",
    area()
  ])

  onClick("restart", (restart) => {
    go("game");
    loseMusic.pause()
  })
  onClick("menu", (menu) => {
    go("title");
    loseMusic.pause()
  })

  const loseMusic = play("BothOfUs", {
    volume: 0.5,
    loop: true
  })
})

go("title")
