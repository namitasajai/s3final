let minYchange = 0; //these two ranges determine line overlap and width
let maxYchange = 80;
let layers = 4;
let rotStripe = 0; //rotation of each stripe; try 10 or 90;
let alph = 255; //out of 255
let colRand = false; //true = random color; false = color from palette table
let filling = true;
let colorLines = false; //false for black lines
let sw = 3; //line width
let extraBlack = 0; //1 for some black line and white fills; 0 for neither; -2 for fewer colors;
let r, g, b;
let table;
let blurValue = 0;  
let canv; 
let blurUp = true; 
const draggable = Draggable.create("#knob", {
    type: "rotation",
    onDrag: function() {
      const angle = this.rotation % 360; // get angle in degrees
      blurValue = Math.round((angle / 18) - 10); // convert angle to a value between -10 and 10
      // do something with the value, such as update a display or send it to a server
    }
});



function preload() {
  table = loadTable("colors.csv", "csv", "header");
}

function setup() {
  let ring; 
  let canvWidth; 
  ring = createDiv();
  ring.id("ring");
  if (windowWidth < windowHeight) {
    ring.style("width", windowWidth-200 + "px");
    ring.style("height", windowWidth-200 + "px");
    ring.style("border-radius", "50%");
    ring.style("border", "solid 20px #1b1919");
    ring.style("position", "absolute");
    canv = createCanvas(windowWidth-200, windowWidth-200);
    canvWidth = windowWidth-200;
  } else {
    ring.style("width", windowHeight-200 + "px");
    ring.style("height", windowHeight-200 + "px");
    ring.style("border-radius", "50%");
    ring.style("border", "solid 20px #1b1919");
    ring.style("position", "absolute");
    canv = createCanvas(windowHeight-200, windowHeight-200);
    canvWidth = windowHeight-200;
  }
  ring.style("z-index", 1); 
  canv.style("z-index", 100); 
  canv.mousePressed(setup);
  ring.mousePressed(setup); 
  noStroke();
  angleMode(DEGREES);
  let end = 40; //where lines stop
  let palette = floor(random(676));
  for (let i = 0; i < layers; i++) {
    let y1;
    if (i == 0) {
      y1 = -height / 2 - 300;
    } else {
      y1 = -height / 2 + (height / layers) * i;
    }
    //starting height for each layer
    let y2 = y1,
      y3 = y1,
      y4 = y1,
      y5 = y1,
      y6 = y1;
    let rotLayer = 180; //layer rotation
    let rotThisStripe = 0;
    //keep going until all the lines are at the bottom
    while (
      (y1 < end) &
      (y2 < end) &
      (y3 < end) &
      (y4 < end) &
      (y5 < end) &
      (y6 < end) &
      (-maxYchange < minYchange)
    ) {
      y1 += random(minYchange, maxYchange);
      y2 += random(minYchange, maxYchange);
      y3 += random(minYchange, maxYchange);
      y4 += random(minYchange, maxYchange);
      y5 += random(minYchange, maxYchange);
      y6 += random(minYchange, maxYchange);
      if (colRand == true) {
        r = random(256);
        g = random(256);
        b = random(256);
      } else {
        let col = floor(random(5 + extraBlack));
        r = table.get(palette, col * 3);
        g = table.get(palette, col * 3 + 1);
        b = table.get(palette, col * 3 + 2);
      }
      if (filling == true) {
        fill(r, g, b, alph);
      } else {
        noFill();
      }
      if (colorLines == true) {
        stroke(r, g, b, alph);
      }
      push();
      translate(width / 2, height / 2);
      rotThisStripe += rotStripe; //rotating after each stripe
      rotate(rotThisStripe + rotLayer);
      let xStart = -width / 2;
      beginShape();
      curveVertex(xStart - 300, height / 2 + 500);
      curveVertex(xStart - 300, y1);
      curveVertex(xStart + (width / 5) * 1, y2);
      curveVertex(xStart + (width / 5) * 2, y3);
      curveVertex(xStart + (width / 5) * 3, y4);
      curveVertex(xStart + (width / 5) * 4, y5);
      curveVertex(width / 2 + 300, y6);
      curveVertex(width / 2 + 300, height / 2 + 500);
      endShape(CLOSE);
      pop();
    }
  }
  push(); 
    strokeWeight(2); 
    stroke(51);
    line(canvWidth/2-100, canvWidth/2, canvWidth/2+100, canvWidth/2);
    line(canvWidth/2, canvWidth/2-100, canvWidth/2, canvWidth/2+100);
  pop();
}

function draw() {
    smooth(); 
    if (blurValue < 0) {
        canv.style("filter", "blur(" + 0 + "px)");
    } else {
        canv.style("filter", "blur(" + blurValue + "px)");
    }
}


