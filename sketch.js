//
// Weekly Creative Coding Challenge Topic 'Cat'
//
//
// Check the challenge page if you would like to join:
// https://openprocessing.org/curation/78544 
//
// Hi Raphaël!
// For this week's topic, my first attempt is to draw
// multiple cats and create their tails to look like a
// flow field generative art.
//
// However, the cat density was insufficient to produce
// such an effect. Maybe I need to take another shot. 
// Anyway, I did love the texture of the cat hair!


let _mainHue = 0;

async function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  background(0, 0, 90);

  noStroke();
  fill(0, 0, 0);

  // random cat hair length
  let catHairLengthRandom = random();
  if (catHairLengthRandom < 0.2)
    hairStrokeLength = [1, 6]
  else if (catHairLengthRandom < 0.4)
    hairStrokeLength = [3, 12]
  else if (catHairLengthRandom < 0.6)
    hairStrokeLength = [6, 18]
  else if (catHairLengthRandom < 0.8)
    hairStrokeLength = [9, 24]
  else
    hairStrokeLength = [24, 60]


  mainHue = random(0, 360);


  let blocks = subdivideRect(0, 0, width, height, 0);

  drawBlocks(blocks);

  stroke('black');

  for (let i = 0; i < blocks.length; i++) {

    // draw block
    let x1 = blocks[i].x;
    let y1 = blocks[i].y + blocks[i].h;
    let x2 = blocks[i].x + blocks[i].w;
    let y2 = y1;

    let strokeHue = processHue(mainHue + random(-30, 30));
    let strokeSat = random(40, 60);
    let strokeBri = random(80, 100);

    if(random() < 0.16)
      strokeHue = processHue(strokeHue + 180);

    let thickness = min(blocks[i].w, blocks[i].h) * random(0.02, 0.06);
    blendMode(MULTIPLY);
    stroke(strokeHue, strokeSat, strokeBri);
    drawSketchLine(x1, y1, x2, y2, thickness);


    let isCat = random() < 0.8;

    if (isCat) {
      let catWidth = random(0.4, 0.9) * blocks[i].w;
      let catHeight = random(0.4, 0.8) * blocks[i].h;
      let catPosRatio = random(-0.1, 0.1);

      let catX = blocks[i].x + 0.5 * blocks[i].w + catPosRatio * blocks[i].w;
      let catY = blocks[i].y + blocks[i].h;
      let newCat = new Cat(catX, catY, catWidth, catHeight);

      let catHue = mainHue + random(-20, 20);
      let catSat = random(10, 60);
      let catBri = random(0, 20);

      blendMode(BLEND);
      noStroke();
      fill(catHue, catSat, catBri, 0.8);
      drawCat(newCat);
      await sleep(1);
    }
  }

}

// async sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}