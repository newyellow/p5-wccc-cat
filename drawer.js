

function drawCatBody(_cat) {
    push();
    translate(_cat.x, _cat.y);

    let topPoint = {
        x: random(-0.5 * _cat.width, 0.1 * _cat.width),
        y: -0.8 * _cat.height
    };

    let leftEnd = {
        x: -0.25 * _cat.width,
        y: 0
    };

    let rightEnd = {
        x: 0.5 * _cat.width,
        y: 0
    };

    let strokeDensity = 0.3;
    let pointCount = _cat.height * strokeDensity;

    for (let i = 0; i < pointCount; i++) {
        let t = i / (pointCount - 1);
        let animatedT = _cat.bodyCurve(t);

        let leftX = lerp(topPoint.x, leftEnd.x, t);
        let leftY = lerp(topPoint.y, leftEnd.y, t);

        let rightX = lerp(topPoint.x, rightEnd.x, animatedT);
        let rightY = lerp(topPoint.y, rightEnd.y, t);

        let lineDist = dist(leftX, leftY, rightX, rightY);
        let linePointCount = max(1, lineDist * strokeDensity);

        for (let j = 0; j < linePointCount; j++) {
            let lineT = j / (linePointCount - 1);

            let drawX = lerp(leftX, rightX, lineT);
            let drawY = lerp(leftY, rightY, lineT);

            drawHairStroke(drawX, drawY, random(1, 3), random(6, 36));
        }
    }

    pop();

    let tailX = _cat.x + rightEnd.x;
    let tailY = _cat.y + rightEnd.y;

    drawFlowTail(tailX, tailY, 10, 300, 0);

    let headX = _cat.x + topPoint.x;
    let headY = _cat.y + topPoint.y;
    drawCatHead(headX, headY, 100);
}

function drawFlowTail(_x, _y, _size, _length, _startAngle) {
    let nowX = _x;
    let nowY = _y;
    let nowAngle = _startAngle;

    let density = 0.3;
    let stepDist = 1.0 / density;
    let circleCount = _length * density;

    for (let i = 0; i < circleCount; i++) {
        nowX += sin(radians(nowAngle)) * stepDist;
        nowY -= cos(radians(nowAngle)) * stepDist;

        let newAngle = noise(nowX * 0.01, nowY * 0.01) * 720;
        nowAngle = lerp(nowAngle, newAngle, 0.06);

        drawCircleHair(nowX, nowY, _size / 2, density);
    }
}

function drawCatHead(_x, _y, _radius) {

    // circle(_x, _y, _radius);

    push();
    translate(_x, _y);

    let density = 0.4;
    let faceOutThickness = _radius * 0.2;

    let leftUpAngle = -60;
    let rightUpAngle = 60;
    let botAngle = 180;

    let topLeftPoint = {
        x: sin(radians(leftUpAngle)) * _radius / 2,
        y: -cos(radians(leftUpAngle)) * _radius / 2
    };

    let topRightPoint = {
        x: sin(radians(rightUpAngle)) * _radius / 2,
        y: -cos(radians(rightUpAngle)) * _radius / 2
    };

    let botPoint = {
        x: sin(radians(botAngle)) * _radius / 2,
        y: -cos(radians(botAngle)) * _radius / 2
    };

    // stroke('red');
    // line(topLeftPoint.x, topLeftPoint.y, topRightPoint.x, topRightPoint.y);
    // line(topRightPoint.x, topRightPoint.y, botPoint.x, botPoint.y);
    // line(botPoint.x, botPoint.y, topLeftPoint.x, topLeftPoint.y);

    stroke('black');

    // draw top strokes
    let topDist = dist(topLeftPoint.x, topLeftPoint.y, topRightPoint.x, topRightPoint.y);
    let topPointCount = topDist * density;

    for (let x = 0; x < topPointCount; x++) {
        let xt = x / (topPointCount - 1);
        let outRatio = sin(radians(180 * xt));

        let upX = lerp(topLeftPoint.x, topRightPoint.x, xt);
        let upY = lerp(topLeftPoint.y, topRightPoint.y, xt) - outRatio * faceOutThickness / 2;

        let downX = lerp(topLeftPoint.x, topRightPoint.x, xt);
        let downY = lerp(topLeftPoint.y, topRightPoint.y, xt);

        let strokeLineDist = dist(upX, upY, downX, downY);
        let strokeLineCount = int(max(1, strokeLineDist * density));

        // drawHairStroke(upX, upY, random(1, 3), random(6, 12));
        // drawHairStroke(downX, downY, random(1, 3), random(6, 12));
        for (let y = 0; y < strokeLineCount; y++) {

            let yt = y / (strokeLineCount - 1);

            if (strokeLineCount == 1)
                yt = 0.5;

            let drawX = lerp(upX, downX, yt);
            let drawY = lerp(upY, downY, yt);

            drawHairStroke(drawX, drawY, random(1, 3), random(6, 12));
        }
    }

    // draw face body
    let faceHeight = dist(topLeftPoint.x, topLeftPoint.y, botPoint.x, botPoint.y);
    let faceBodyPointCount = faceHeight * density;

    for (let x = 0; x < faceBodyPointCount; x++) {
        let t = x / (faceBodyPointCount - 1);
        let leftAnimatedT = easeInCirc(t);
        let rightAnimatedT = easeInCirc(t);

        let leftOutRatio = sin(radians(180 * t));
        let rightOutRatio = sin(radians(180 * t));

        let leftX = lerp(topLeftPoint.x, botPoint.x, t) - leftOutRatio * faceOutThickness;
        let leftY = lerp(topLeftPoint.y, botPoint.y, t);

        let rightX = lerp(topRightPoint.x, botPoint.x, t) + rightOutRatio * faceOutThickness;
        let rightY = lerp(topRightPoint.y, botPoint.y, t);

        let lineDist = dist(leftX, leftY, rightX, rightY);
        let linePointCount = int(max(1, lineDist * density));

        for(let y=0; y<linePointCount; y++){
            let yt = y / (linePointCount - 1);

            let drawX = lerp(leftX, rightX, yt);
            let drawY = lerp(leftY, rightY, yt);

            drawHairStroke(drawX, drawY, random(1, 3), random(6, 12));
        }
    }
    pop();
}

function drawCircleHair(_x, _y, _size, _density) {
    let strokeCount = TWO_PI * _size * _density;

    for (let i = 0; i < strokeCount; i++) {
        let t = i / strokeCount;
        let angle = t * TWO_PI;
        let nowX = _x + sin(angle) * _size;
        let nowY = _y - cos(angle) * _size;

        drawHairStroke(nowX, nowY, 1, random(3, 12));
    }
}

function hairTriangle(_pointUp, _pointLeft, _pointRight, _density, _leftOutAmount = 0, _leftOutCurve = null, _rightOutAmount = 0, _rightOutCurve = null)
{
    let centerX = (_pointLeft.x + _pointRight.x) / 2;
    let centerY = (_pointLeft.y + _pointRight.y) / 2;

    let triangleHeight = dist(_pointUp.x, _pointUp.y, centerX, centerY);

    let pointCount = triangleHeight * _density;

    for(let y=0; y< pointCount; y++)
    {
        let yt = y / (pointCount - 1);

        let leftX = lerp(_pointUp.x, _pointLeft.x, yt);
        let leftY = lerp(_pointUp.y, _pointLeft.y, yt);

        let rightX = lerp(_pointUp.x, _pointRight.x, yt);
        let rightY = lerp(_pointUp.y, _pointRight.y, yt);

        if(_leftOutAmount != 0 && _leftOutCurve != null)
        {
            let leftOutRatio = sin(180 * _leftOutCurve(yt));
            leftX -= leftOutRatio * _leftOutAmount;
        }

        if(_rightOutAmount != 0 && _rightOutCurve != null)
        {
            let rightOutRatio = sin(180 * _rightOutCurve(yt));
            rightX += rightOutRatio * _rightOutAmount;
        }

        let lineDist = dist(leftX, leftY, rightX, rightY);
        let linePointCount = int(max(1, lineDist * _density));

        for(let x=0; x<linePointCount; x++)
        {
            let xt = x / (linePointCount - 1);

            let drawX = lerp(leftX, rightX, xt);
            let drawY = lerp(leftY, rightY, xt);

            drawHairStroke(drawX, drawY, random(1, 3), random(6, 12));
        }
    }
}

function drawHairStroke(_x, _y, _size, _tailLength) {
    circle(_x, _y, _size);

    let density = 0.5;
    let strokeCount = _tailLength * density;
    let stepLength = 1.0 / density;

    let angle = 0;
    let nowX = _x;
    let nowY = _y;

    for (let i = 0; i < strokeCount; i++) {
        let t = i / strokeCount;
        let animatedT = easeInOutSine(t);
        let nowSize = lerp(_size, 0, animatedT);

        let angleNoise = noise(nowX * 0.01, nowY * 0.01);
        angle += lerp(-10, 10, angleNoise);

        nowX += sin(radians(angle)) * stepLength;
        nowY -= cos(radians(angle)) * stepLength;

        circle(nowX, nowY, nowSize);

    }
}