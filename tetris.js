const dict = {
  "red": "🟥",
  "orange": "🟧",
  "yellow": "🟨",
  "green": "🟩",
  "blue": "🟦",
  "purple": "🟪",
  "brown": "🟫",
  "black": "⬛",
  "white": "⬜"
}

var speed = 1000;

const maxSpeed = speed/2;

const background = "black"

const rowCount = 20;
var grid = [];
const columnCount = 10;
var place;
var next;
var hold;
var running = true;
const nextCount = 6;
var score;
var draw;
var to;


function start() {
  grid = [] //new Array(rowCount * columnCount).fill(new slot());
  for (let i = 0; i < rowCount * columnCount; i++) {
    grid[i] = new slot();
  }

  score = 0;
  running = true;
  place = null;
  hold = null;
  document.querySelector('#hold').innerHTML = ''
  next = null;
  //reRender()

  spawn();

  tick()
}

document.onload = start();

function tick() {
  draw = []

  down();

  document.querySelector('#score').innerHTML = "Score: " + score;

  reRender()
}

function reRender() {
  for (let y = 0; y < rowCount; y++) {
    for (let x = 0; x < columnCount; x++) {
      let slot = grid[(y * columnCount) + x];
      if (slot.color != null) {
        setSquare(x, y, slot.color)
      } else {
        setSquare(x, y, background)
      }
    }
  }
  if (place != null) {
    drawPreview()
    drawShape(place, null)
  }
  document.querySelector('#main').innerHTML = get()
}

function resetTO() {
  if (to != null) {
    clearTimeout(to)
  }
  if (running) {
    to = setTimeout(tick, speed);
  }
}

function slot() {
  this.color = null;
}

function spawn() {
  if (next == null) {
    next = [];
    for (let i = 0; i < nextCount; i++) {
      next[i] = new shape(Math.round(Math.random() * 6));
    }
  }
  place = next.shift();
  next.push(new shape(Math.round(Math.random() * 6)));
  newNext();
}

function shape(rng) {
  this.id = rng;

  this.squares = gen(rng, this);

  this.rot = 0;

  this.check = function() {
    for (let i of this.squares) {
      if ((this.y + i.y + 1) >= rowCount || (getSquare(this.x + i.x, this.y + i.y + 1) != null && getSquare(this.x + i.x, this.y + i.y + 1).color != null)) {
        return true;
      }
    }
    return false;
  };

  if (this.check()) {
    end();
  }

  this.down = function() {
    for (let i of this.squares) {
      if (this.check()) {
        return false;
      }
    }
    this.y++;
    return true;
  };

  this.rotate = function() {
    for (let i of this.squares) {
      if (getSquare(this.x - i.y, this.y + i.x) != null && getSquare(this.x - i.y, this.y + i.x).color != null) {
        return;
      }
    }
    if (this.id != 3) {
      for (let i of this.squares) {
        let x = i.x;
        let y = i.y;

        i.x = -y;
        i.y = x;
      }
      contain(this);
    }
  };

  this.place = function() {
    for (let i of this.squares) {
      if (getSquare(this.x + i.x, this.y + i.y) != null) {
        getSquare(this.x + i.x, this.y + i.y).color = this.col;
      }
    }
    check(this.squares);
    spawn();
  };

  this.left = function() {
    for (let i of this.squares) {
      if (this.x + i.x - 1 >= columnCount || this.x + i.x - 1 < 0 || (this.y + i.y > 0 && getSquare(this.x + i.x - 1, this.y + i.y).color != null)) {
        return;
      }
    }
    this.x--;
  };

  this.right = function() {
    for (let i of this.squares) {
      if (this.x + i.x + 1 >= columnCount || this.x + i.x + 1 < 0 || (this.y + i.y > 0 && getSquare(this.x + i.x + 1, this.y + i.y).color != null)) {
        return;
      }
    }
    this.x++;
  };
}

function gen(seed, shape) {
  shape.x = columnCount / 2 - 1;
  shape.y = 0;
  switch (seed) {
    case 0:
      shape.col = "orange"
      shape.width = 3;
      return [new sh(0, 1), new sh(-1, 1), new sh(1, 1), new sh(1, 0)];
    case 1:
      shape.col = "blue"
      shape.width = 3;
      return [new sh(0, 1), new sh(-1, 1), new sh(1, 1), new sh(-1, 0)];
    case 2:
      shape.col = "brown"
      shape.width = 4;
      return [new sh(0, 0), new sh(-1, 0), new sh(1, 0), new sh(2, 0)];
    case 3:
      shape.col = "yellow"
      shape.width = 2;
      return [new sh(0, 1), new sh(0, 0), new sh(1, 1), new sh(1, 0)];
    case 4:
      shape.col = "red"
      shape.width = 3;
      return [new sh(0, 1), new sh(-1, 0), new sh(1, 1), new sh(0, 0)];
    case 5:
      shape.col = "green"
      shape.width = 3;
      return [new sh(0, 1), new sh(-1, 1), new sh(1, 0), new sh(0, 0)];
    case 6:
      shape.col = "purple"
      shape.y = 1;
      shape.width = 3;
      return [new sh(-1, 0), new sh(0, 0), new sh(0, -1), new sh(1, 0)];
  }
}

function sh(x, y) {
  this.x = x;
  this.y = y;

  return this;
}

function getSquare(x, y) {
  return grid[y * columnCount + x];
}

function down() {
  resetTO()
  if (!place.down()) {
    place.place();
    return false;
  }
  return true;
}

function drawShape(shap, colorOverride) {
  for (let x of shap.squares) {
    if (colorOverride != null) {
      setSquare((shap.x + x.x), (shap.y + x.y), colorOverride)
    } else {
      setSquare((shap.x + x.x), (shap.y + x.y), shap.col)
    }
  }
}

function newNext() {
  document.querySelector('#next').innerHTML = "";
  for (let i = 0; i < nextCount; i++) {
    var li = document.createElement("li");
    var p = document.createElement("p");
    p.innerHTML = addStationary(next[i]);
    li.appendChild(p);
    document.querySelector('#next').appendChild(li);
  }
}

function addStationary(shap, colorOverride) {

  yes = new Array(getColumns(shap) * (getRows(shap))).fill(dict.white);

  soffset = 0;

  for (let x of shap.squares) {
    if (x.x < soffset) {
      soffset = x.x;
    }
  }

  yoffset = 0;

  for (let x of shap.squares) {
    if (x.y < yoffset) {
      yoffset = x.y;
    }
  }

  for (let x of shap.squares) {
    yes[(x.y - yoffset) * getColumns(shap) + (x.x - soffset)] = dict[shap.col]
  }

  let txt = ""
  y = 0;
  for (let x of yes) {
    if (y != 0 && y % getColumns(shap) == 0) {
      txt = txt + "<br/>"
    }
    txt = txt + x
    y++
  }

  const invis = '<span style="opacity:0">' + dict.white + '</span>'

  txt = txt.replaceAll(dict.white, invis)

  return txt;
}

function getColumns(shap) {
  let ret = []
  for (let x of shap.squares) {
    if (!ret.includes(x.x)) {
      ret.push(x.x)
    }
  }
  return ret.length
}

function getRows(shap) {
  let ret = []
  for (let x of shap.squares) {
    if (!ret.includes(x.y)) {
      ret.push(x.y)
    }
  }
  return ret.length
}

function drawPreview(xs) {
  let shap = Object.assign({}, place);
  while (true) {
    if (shap.check()) {
      drawShape(shap, "white")
      return
    }
    shap.down()
  }
}

function setSquare(x, y, color) {
  draw[y * columnCount + x] = dict[color]
}

function get() {
  let txt = ""
  let y = 0
  for (let x of draw) {
    if (y != 0 && y % columnCount == 0) {
      txt = txt + "<br/>"
    }
    txt = txt + x
    y++
  }
  return txt
}

document.addEventListener('keydown', function(event) {
	if (running) {
  switch (event.key) {
    case "r":
    case "w":
    case "ArrowUp":
      rot();
      reRender()
      break;
    case "a":
    case "ArrowLeft":
      place.left();
      reRender()
      break;
    case "s":
    case "ArrowDown":
      down();
      reRender()
      break;
    case " ":
      allTheWay();
      reRender()
      break;
    case "d":
    case "ArrowRight":
      place.right();
      reRender()
      break;
    case "1":
      swapHold();
      reRender()
      break;
      }
  } else {
  	start();
  }
});

function check(shapes) {
  let rows = [];
  if (shapes == null) {
    for (i = 0; i < rowCount; i++) {
      rows.push(i);
    }
  } else {
    for (let i of shapes) {
      if (!rows.includes(place.y + i.y)) {
        rows.push(place.y + i.y);
      }
    }
  }
  rows = sortArray(rows);
  rows.reverse();
  for (let y of rows) {
    if (checkRow(y)) {
      check(null);
    }
  }
}

function sortArray(rows) {
  let yes = [];
  for (let i of rows) {
    if (yes.length == 0) {
      yes.push(i);
    } else if (yes.length == 1) {
      if (i > yes[0]) {
        yes.push(i);
      } else {
        yes.unshift(i);
      }
    } else {
      if (i < yes[0]) {
        yes.unshift(i);
        continue;
      }
      if (i > yes[yes.length - 1]) {
        yes.push(i);
        continue;
      }
      for (let e = 0; e < yes.length - 1; e++) {
        if (i > yes[e] && i < yes[e + 1]) {
          yes.splice(e + 1, 0, i);
          break;
        }
      }
    }
  }
  return yes;
}

function checkRow(row) {
  let bad = false;
  for (let x = 0; x < columnCount; x++) {
    if (getSquare(x, row).color == null) {
      bad = true;
      break;
    }
  }
  if (!bad) {
    clearRow(row);
    return true;
  }
  return false;
}

function rot() {
  place.rotate(place);
}

function end() {
  running = false;
}

function contain(shape) {
  let move = 0;
  for (let i of shape.squares) {
    if (shape.x + i.x < 0 && shape.x + i.x < move) {
      move = -(shape.x + i.x);
    } else if (shape.x + i.x + 1 > columnCount && (columnCount - (shape.x + i.x + 1)) < move) {
      move = (columnCount - (shape.x + i.x + 1));
    }
  }
  shape.x += move;
}

function allTheWay() {
  while (true) {
    if (!down()) {
      break;
    }
  }
}

function clearRow(row) {
  if (speed > maxSpeed) {
  	speed-=10;
  }
  score++;
  for (let i = (row) * (columnCount); i < (row + 1) * (columnCount); i++) {
    grid[i].color = null;
  }
  for (let y = row; y > 1; y--) {
    for (let x = 0; x < columnCount; x++) {
      if (getSquare(x, y) != null) {
        getSquare(x, y).color = getSquare(x, y - 1).color;
      }
    }
  }
}

function swapHold() {
  if (hold == null) {
    hold = place;
    spawn();
  } else {
    let e = hold;
    let f = place;
    hold = place;
    place = e;

    place.x = f.x;
    place.y = f.y;

    contain(place);
  }
  document.querySelector('#hold').innerHTML = addStationary(hold);
}
