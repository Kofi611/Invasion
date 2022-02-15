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

layers([
  "bg",
  "obj",
  "ui",
], "obj");

var score = 0
var scoreRecord = 0
var alienSpawnSpeed = 1
var alienSpeed = 50



scene("title", () => {
  add([
    text("Invasion"),
    layer("ui"),
    pos((width()/2), 100),
    origin("center")
  ])

  add([
    text("Play"),
    layer("ui"),
    pos((width()/2), 200),
    area(),
    "play",
    origin("center")
  ])

  onClick("play", (play) => go("game"))
})

scene("game", () => {

  score = 0
  scoreRecord = 0
  alienSpawnSpeed = 1
  alienSpeed = 50
  const music = play("TheNovisBase", {
    volume: 0.5,
    loop: true
  })

  const player = add([
    sprite("ship"),
    pos(80, 40),
    scale(0.1),
    area(),
    origin("center"),
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
    ])
  })

  loop(alienSpawnSpeed, ()  => {
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

  onCollide("bullet", "alien", (bullet, alien) => {
    destroy(alien),
    score += 1
    scoreDisplay.text = "Score:" + score
  })

  onUpdate("alien", (alien) => {
    if (alien.pos.y >= height()) {
      go("lose")
    }
  })

  const scoreDisplay = add([
    text("Score: 0", {
      size: 48
    }),
    pos(width() - 250, 50),
    layer("ui"),
  ])
})

scene("lose", () => {
  add([
    text("Game Over"),
    pos(center()),
    origin("center")
  ])
  add([
    text("Your Score: " + score),
    pos(width()/2, height()/2 + 50),
    origin("center")
  ])

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

  onClick("restart", (restart) => go("game"))
  onClick("menu", (menu) => go("title"))

  const music = play("BothOfUs", {
    volume: 0.5,
    loop: true
  })
})

go("title")
