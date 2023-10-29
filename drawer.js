let hairStrokeLength = [24, 60];
let hairStrokeWidth = [1, 3];
let strokeDensity = 0.4;

function drawCat(_cat) {
    push();
    translate(_cat.x, _cat.y);

    let topPoint = {};
    let leftEnd = {};
    let rightEnd = {};
    let leftCurve = linear;
    let rightCurve = linear;

    if (_cat.bodyType == 0) {
        topPoint.x = random(-0.5 * _cat.width, -0.4 * _cat.width);
        topPoint.y = random(-0.9, -0.8) * _cat.height;

        leftEnd.x = random(-0.3, -0.2) * _cat.width;
        leftEnd.y = 0;

        rightEnd.x = random(0.2, 0.3) * _cat.width;
        rightEnd.y = 0;
    }
    else if (_cat.bodyType == 1) {
        topPoint.x = random(0.4 * _cat.width, 0.5 * _cat.width);
        topPoint.y = random(-0.8, -0.5) * _cat.height;

        leftEnd.x = random(-0.3, -0.2) * _cat.width;
        leftEnd.y = 0;

        rightEnd.x = random(0.2, 0.3) * _cat.width;
        rightEnd.y = 0;

        leftCurve = easeOutCirc;
    }
    else {
        topPoint.x = random(-0.2 * _cat.width, 0.2 * _cat.width);
        topPoint.y = -1.0 * _cat.height;

        leftEnd.x = random(-0.3, -0.2) * _cat.width;
        leftEnd.y = 0;

        rightEnd.x = random(0.2, 0.3) * _cat.width;
        rightEnd.y = 0;
    }

    hairTriangleLerpPos(topPoint, leftEnd, rightEnd, strokeDensity, leftCurve, rightCurve);
    pop();

    let tailRadius = min(_cat.width, _cat.height) * random(0.06, 0.12);
    let tailLength = max(_cat.width, _cat.height) * random(0.6, 2.4);

    if (_cat.bodyType == 0) {
        let tailX = _cat.x + rightEnd.x;
        let tailY = _cat.y + rightEnd.y;

        drawFlowTail(tailX, tailY, tailRadius, tailLength, 0);
    }
    else if(_cat.bodyType == 1)
    {
        let tailX = _cat.x + leftEnd.x;
        let tailY = _cat.y + leftEnd.y;

        drawFlowTail(tailX, tailY, tailRadius, tailLength, 180);
    }
    else
    {
        let tailX = _cat.x + random(-0.1, 0.1) * _cat.width;
        let tailY = _cat.y - 0.1 * _cat.height;

        drawFlowTail(tailX, tailY, tailRadius, tailLength, 90);
    }


    let headX = _cat.x + topPoint.x;
    let headY = _cat.y + topPoint.y;
    let headSize = max(_cat.width, _cat.height) * random(0.3, 0.6);
    drawCatHead(headX, headY, headSize);
}

function drawFlowTail(_x, _y, _size, _length, _startAngle) {
    let nowX = _x;
    let nowY = _y;
    let nowAngle = _startAngle;

    let density = strokeDensity * 0.7;
    let stepDist = 1.0 / density;
    let circleCount = _length * density;

    for (let i = 0; i < circleCount; i++) {
        nowX += sin(radians(nowAngle)) * stepDist;
        nowY -= cos(radians(nowAngle)) * stepDist;

        let newAngle = noise(nowX * 0.003, nowY * 0.003) * 720;
        nowAngle = lerp(nowAngle, newAngle, 0.12);

        drawCircleHair(nowX, nowY, _size / 2, density);
    }
}

function drawCatHead(_x, _y, _radius) {

    // circle(_x, _y, _radius);

    push();
    translate(_x, _y);

    let density = strokeDensity;
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

        for (let y = 0; y < strokeLineCount; y++) {

            let yt = y / (strokeLineCount - 1);

            if (strokeLineCount == 1)
                yt = 0.5;

            let drawX = lerp(upX, downX, yt);
            let drawY = lerp(upY, downY, yt);

            drawHairStroke(drawX, drawY, random(hairStrokeWidth[0], hairStrokeWidth[1]), random(hairStrokeLength[0], hairStrokeLength[1]));
        }
    }

    // draw face body
    hairTriangleSinAdd(botPoint, topLeftPoint, topRightPoint, density, faceOutThickness, null, faceOutThickness, null);

    // draw left ear
    let earHeight = _radius * 0.5;
    let earWidth = _radius * 0.3;

    let earLeftTopPoint = {
        x: topLeftPoint.x,
        y: topLeftPoint.y - earHeight
    };

    let earLeftPoint = {
        x: topLeftPoint.x,
        y: topLeftPoint.y
    };

    let earRightPoint = {
        x: topLeftPoint.x + earWidth,
        y: topLeftPoint.y
    };

    hairTriangle(earLeftTopPoint, earLeftPoint, earRightPoint, density);

    // draw right ear
    earRightTopPoint = {
        x: topRightPoint.x,
        y: topRightPoint.y - earHeight
    };

    earLeftPoint = {
        x: topRightPoint.x - earWidth,
        y: topRightPoint.y
    };

    earRightPoint = {
        x: topRightPoint.x,
        y: topRightPoint.y
    };

    hairTriangle(earRightTopPoint, earLeftPoint, earRightPoint, density);

    // left eye
    let eyeDistRatio = random(0.2, 0.3);
    let eyeSizeRatio = random(0.12, 0.24);
    let eyeAspectRatio = random(0.3, 1.0);

    let leftEyeX = -_radius * (eyeDistRatio + eyeSizeRatio) / 2;
    let leftEyeY = 0.06 * _radius;

    let rightEyeX = _radius * (eyeDistRatio + eyeSizeRatio) / 2;
    let rightEyeY = 0.06 * _radius;

    let eyeSize = _radius * eyeSizeRatio;
    fill(0, 0, 100);

    ellipse(leftEyeX, leftEyeY, eyeSize, eyeSize * eyeAspectRatio);
    ellipse(rightEyeX, rightEyeY, eyeSize, eyeSize * eyeAspectRatio);

    let eyeBallSizeRatio = random(0.2, 0.8);
    let eyeBallSize = eyeSize * eyeBallSizeRatio;

    fill(0, 0, 0);
    ellipse(leftEyeX, leftEyeY, eyeBallSize, eyeBallSize);
    ellipse(rightEyeX, rightEyeY, eyeBallSize, eyeBallSize);
    pop();
}

function drawCircleHair(_x, _y, _size, _density) {
    let strokeCount = TWO_PI * _size * _density;

    for (let i = 0; i < strokeCount; i++) {
        let t = i / strokeCount;
        let angle = t * TWO_PI;
        let nowX = _x + sin(angle) * _size;
        let nowY = _y - cos(angle) * _size;

        drawHairStroke(nowX, nowY, random(hairStrokeWidth[0], hairStrokeWidth[1]), random(hairStrokeLength[0], hairStrokeLength[1]));
    }
}

function hairTriangleLerpPos(_pointUp, _pointLeft, _pointRight, _density, _leftCurve, _rightCurve) {
    let centerX = (_pointLeft.x + _pointRight.x) / 2;
    let centerY = (_pointLeft.y + _pointRight.y) / 2;

    let triangleHeight = dist(_pointUp.x, _pointUp.y, centerX, centerY);

    let pointCount = triangleHeight * _density;

    for (let y = 0; y < pointCount; y++) {
        let yt = y / (pointCount - 1);
        let leftT = _leftCurve(yt);
        let rightT = _rightCurve(yt);

        let leftX = lerp(_pointUp.x, _pointLeft.x, leftT);
        let leftY = lerp(_pointUp.y, _pointLeft.y, yt);

        let rightX = lerp(_pointUp.x, _pointRight.x, rightT);
        let rightY = lerp(_pointUp.y, _pointRight.y, yt);

        let lineDist = dist(leftX, leftY, rightX, rightY);
        let linePointCount = int(max(1, lineDist * _density));

        for (let x = 0; x < linePointCount; x++) {
            let xt = x / (linePointCount - 1);

            let drawX = lerp(leftX, rightX, xt);
            let drawY = lerp(leftY, rightY, xt);

            drawHairStroke(drawX, drawY, random(hairStrokeWidth[0], hairStrokeWidth[1]), random(hairStrokeLength[0], hairStrokeLength[1]));
            // circle(drawX, drawY, 3);
        }
    }
}

function hairTriangle(_pointUp, _pointLeft, _pointRight, _density, _leftOutAmount = 0, _leftOutCurve = null, _rightOutAmount = 0, _rightOutCurve = null) {
    let centerX = (_pointLeft.x + _pointRight.x) / 2;
    let centerY = (_pointLeft.y + _pointRight.y) / 2;

    let triangleHeight = dist(_pointUp.x, _pointUp.y, centerX, centerY);

    let pointCount = triangleHeight * _density;

    for (let y = 0; y < pointCount; y++) {
        let yt = y / (pointCount - 1);

        let leftX = lerp(_pointUp.x, _pointLeft.x, yt);
        let leftY = lerp(_pointUp.y, _pointLeft.y, yt);

        let rightX = lerp(_pointUp.x, _pointRight.x, yt);
        let rightY = lerp(_pointUp.y, _pointRight.y, yt);

        if (_leftOutAmount != 0 && _leftOutCurve != null) {
            let leftOutRatio = _leftOutCurve(yt);
            leftX -= leftOutRatio * _leftOutAmount;
        }

        if (_rightOutAmount != 0 && _rightOutCurve != null) {
            let rightOutRatio = _rightOutCurve(yt);
            rightX += rightOutRatio * _rightOutAmount;
        }

        let lineDist = dist(leftX, leftY, rightX, rightY);
        let linePointCount = int(max(1, lineDist * _density));

        for (let x = 0; x < linePointCount; x++) {
            let xt = x / (linePointCount - 1);

            let drawX = lerp(leftX, rightX, xt);
            let drawY = lerp(leftY, rightY, xt);

            drawHairStroke(drawX, drawY, random(hairStrokeWidth[0], hairStrokeWidth[1]), random(hairStrokeLength[0], hairStrokeLength[1]));
            // circle(drawX, drawY, 3);
        }
    }
}

function hairTriangleSinAdd(_pointUp, _pointLeft, _pointRight, _density, _leftOutAmount = 0, _leftOutCurve = null, _rightOutAmount = 0, _rightOutCurve = null) {
    let centerX = (_pointLeft.x + _pointRight.x) / 2;
    let centerY = (_pointLeft.y + _pointRight.y) / 2;

    let triangleHeight = dist(_pointUp.x, _pointUp.y, centerX, centerY);

    let pointCount = triangleHeight * _density;

    for (let y = 0; y < pointCount; y++) {
        let yt = y / (pointCount - 1);

        let leftX = lerp(_pointUp.x, _pointLeft.x, yt);
        let leftY = lerp(_pointUp.y, _pointLeft.y, yt);

        let rightX = lerp(_pointUp.x, _pointRight.x, yt);
        let rightY = lerp(_pointUp.y, _pointRight.y, yt);

        if (_leftOutAmount != 0) {
            let leftOutT = yt;

            if (_leftOutCurve != null)
                leftOutT = _leftOutCurve(yt);

            let leftOutRatio = sin(radians(180 * leftOutT));
            leftX -= leftOutRatio * _leftOutAmount;
        }

        if (_rightOutAmount != 0) {
            let rightOutT = yt;

            if (_rightOutCurve != null)
                rightOutT = _rightOutCurve(yt);

            let rightOutRatio = sin(radians(180 * rightOutT));
            rightX += rightOutRatio * _rightOutAmount;
        }

        let lineDist = dist(leftX, leftY, rightX, rightY);
        let linePointCount = int(max(1, lineDist * _density));

        for (let x = 0; x < linePointCount; x++) {
            let xt = x / (linePointCount - 1);

            let drawX = lerp(leftX, rightX, xt);
            let drawY = lerp(leftY, rightY, xt);

            drawHairStroke(drawX, drawY, random(hairStrokeWidth[0], hairStrokeWidth[1]), random(hairStrokeLength[0], hairStrokeLength[1]));
            // circle(drawX, drawY, 3);
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

        let angleNoise = noise(nowX * 0.012, nowY * 0.012);
        angle += lerp(-10, 10, angleNoise);

        nowX += sin(radians(angle)) * stepLength;
        nowY -= cos(radians(angle)) * stepLength;

        if(isNaN(nowX) || isNaN(nowY))
        continue;

        circle(nowX, nowY, nowSize);
    }
}

function drawBlocks (_blockData) {
    for (let i = 0; i < _blockData.length; i++) {
        let block = _blockData[i];
        fill(0, 0, random(60, 100));
        rect(block.x, block.y, block.w, block.h);
    }
}

function drawSketchLine (_x1, _y1, _x2, _y2, _thickness)
{
    let lineDist = dist(_x1, _y1, _x2, _y2);
    let pointCount = lineDist * strokeDensity;

    for (let i = 0; i < pointCount; i++) {
        let t = i / (pointCount - 1);

        let x = lerp(_x1, _x2, t);
        let y = lerp(_y1, _y2, t);

        push();
        translate(x, y);

        strokeWeight(random(1, 6));
        line(0, -0.5 * _thickness, 0, 0.5 * _thickness);
        pop();
    }
}