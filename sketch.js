
async function setup() {
  createCanvas(800, 1000);
  colorMode(HSB);
  background(0, 0, 90);


  let demoCat = new Cat(400, 500, 300, 200);
  drawCatBody(demoCat);

}

// async sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}