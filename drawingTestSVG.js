// REFACTORIZING drawingTest.js WITH THE USE OF 
// SVG INSTEAD OF CANVAS
const rectArray = []; // CONTAINS rect OBJECT [0], HORIZONTAL DIRECTION [1], VERTICAL DIRECTION [2]
const circleArray = [];
const lineArray = [];
const pathArray = [];

const speed = 300; // SETS THE SPEED OF OBJECTS IN PIXELS / SECOND
const refreshDelay = 7; // TIME INTERVAL FOR REFRESH UPDATES

// RESIZING THE SVG WINDOW HERE 
function resizeSVG(){
    // SETS THE SIZE OF THE SVG FRAME TO THE SIZE OF THE BROWSER WINDOW
    draw.size(window.innerWidth,window.innerHeight);
    if (rectArray.length != 0){
        rectArray[0][0].size(window.innerWidth,window.innerHeight)
    }
    
}

// ANIMATE INTERVAL FUNCITON DEFINED HERE
function animate(){
    // ONLY ANIMATES RECTANGLES IF THERE ARE MORE THAN 1 RECTANGLES IN RECTARRAY
    if (rectArray.length > 1) {
        myvar = setInterval(animateRects,refreshDelay); // ANIMATES ALL RECTANGLES WITH A 50ms DELAY 
    }
    
    // ANIMATES LINES IF THERE ARE MORE THAN 0 LINES IN LINEARRAY
    if (lineArray.length > 0){
        myvar = setInterval(animateLine,refreshDelay);
    }
}

// ANIMATION OF RECTANGLE DONE HERE
function animateRects(){
    for (let count = 1; count < rectArray.length; count++){
        // MOVES EVERY RECTANGLE IN RECTARRAY, EXCLUDING BACKGROUND RECTANGLE
        rectArray[count][0].move(rectArray[count][0].attr('x') + rectArray[count][1]*(speed*(refreshDelay/1000)), rectArray[count][0].attr('y') + rectArray[count][2]*(speed*(refreshDelay/1000)));
    }
    // CHECKS TO SEE IF ANY RECTANGLES ARE COLLIDING WITH ANY WALLS 
    checkDirectionRects();
}

// LINE ANIMATION DONE HERE
function animateLine(){
    for (let count = 0; count<lineArray.length; count++){
        // ROTATES ALL LINES IN LINE ARRAY
        lineArray[count].rotate(1);
    }
}

// VALIDATION THAT BLOCK HAS NOT HIT THE EDGE
function checkDirectionRects(){
    for (let count = 1; count < rectArray.length; count++){
        // CHECKING LEFT AND RIGHT EDGE OF THE SCREEN
        if ( ( rectArray[count][0].attr('x') < 0 )  || ( (rectArray[count][0].attr('x') + rectArray[count][0].attr('width') ) > window.innerWidth) ) {
            // INVERTS X VELOCITY
            rectArray[count][1] *= -1;
        }

        if ( ( rectArray[count][0].attr('y') < 0 )  || ( (rectArray[count][0].attr('y') + rectArray[count][0].attr('height') ) > window.innerHeight) ) {
            // INVERTS Y VELOCITY
            rectArray[count][2] *= -1;
        }
    }
}


// DRAWS A RECTANGLE OF GIVEN WIDTH, HEIGHT, XPOS, YPOS
// RETURNS TRUE IF THE RECTANGLE WAS DRAWN, FALSE IF NOT
function drawRectangle(draw,xPos,yPos,width,height,colourStr,directionArray){
    if (validatePos(xPos,yPos)){
        // CREATING THE RECTANGLE AND ADDING IT TO THE RECTANGLE ARRAY
        var rect = draw.rect(width,height).move(xPos,yPos).fill('#'+colourStr);
        rectArray.push([rect,directionArray[0],directionArray[1]]); // PUSHING RECTANGLE AND INFORMATION TO RECTANGLE ARRAY

        // CONSOLE LOGGING BELOW HERE FOR TESTING PURPOSES 
        //console.log(rect.attr('color'));

        return true;
    }
    return false;
}

// DRAWS A CIRCLE OF GIVEN RADIUS, XPOS, YPOS
// RETURNS TRUE IF THE CIRCLE WAS DRAWN
function drawCircle(draw,xPos,yPos,radius,colourStr){
    if (validatePos(xPos,yPos)){
        var circle = draw.circle(radius).move(xPos,yPos).fill('#'+colourStr);
        circleArray.push(circle);
        return true;
    }
    return false;
}

// DRAWS A LINE OF GIVEN START XPOS, YPOS; END XPOS, YPOS AND WIDTH
// RETURNS TRUE IF LINE WAS DRAWN
function drawLine(draw,startXPos,startYPos,endXPos,endYPos,widthLine,colourStr){
    if (validateLine(startXPos,startYPos,endXPos,endYPos)){
        var line = draw.line(0,0,endXPos-startXPos,endYPos-startYPos).move(startXPos,startYPos).stroke({color: "#"+colourStr,width:widthLine});
        lineArray.push(line);
        return true;
    }
    return false;
}

// DRAWS PATH TO SCREEN
// RETURNS TRUE IF PATH WAS DRAWN
function drawPath(draw,pathArgument,pathFill,strokeData){
    var path = draw.path(pathArgument).fill(pathFill).stroke(strokeData);
    pathArray.push(path);
    return true;
}

// CHECK THAT A POSITION OF AN OBJECT IS ON SCREEN
function validatePos(xPos,yPos){
    if (xPos >= 0 && xPos <= window.innerWidth && yPos >= 0 && yPos <= window.innerHeight){
        return true;
    } else {
        return false;
    }
}

// CHECKS THAT AT LEAST 1 END POINT OF A LINE IS WITHIN THE SCREEN 
function validateLine(startXPos,startYPos,endXPos,endYPos){
    if ((startXPos >= 0 && startXPos <= window.innerWidth && startYPos >= 0 && startYPos <= window.innerHeight) || (endXPos >= 0 && endXPos <= window.innerWidth && endYPos >= 0 && endYPos <= window.innerHeight)){
        return true;
    } else {
        return false;
    }
}

// MOVING AN ELEMENT ALONG A PATH
function movePath(element,path,length){
    let n = 0;
    return function anim(timestamp){
        let point = path.pointAt(n);
        element.move(point.x - (element.width()/2) ,point.y - (element.height()/2) );
        n += 2;

        if (!( (element.x() + (element.width()/2))==(path.pointAt(999999999).x) && (element.y() + (element.height()/2))==(path.pointAt(999999999).y) )){
            requestAnimationFrame(anim);
        } else {
            n = 0;
            requestAnimationFrame(anim);
        }    
    }
}

// MAIN FUNCTION CALLED HERE, WAITING FOR WINDOW TO FULLY LOAD TO
window.onload = function(){
    // DEFINING OUR SVG WINDOW, CREATING GLOBAL DRAW. 
    draw = SVG().addTo('body').size(window.innerWidth,window.innerHeight);

    // TEST CURVES
    // M100 100 H200 C200 100 250 100 250 150 V 250
    // 'M200 100 A50 50 0 0 1 200 200 A50 50 0 0 1 200 100' - CIRCLE RADIUS 50, CENTRE X=200 Y=150
    // DEFINING TEST VARIABLES HERE
    pathOne = 'M100 100 H200 A50 50 0 0 1 250 150 V 250';
    pathTwo = 'M500 500 V800 C 550 800 625 720 700 500 V500';

    // LISTENING FOR A RESIZE OF THE WINDOW 
    window.addEventListener('resize', resizeSVG, false); //ADDS EVENT LISTENER FOR THE RESIZING OF THE WINDOW
    resizeSVG();

    // DRAWING AND LOGGING THE DRAWING OF RECTS, CIRCLES, ETC...
    console.log(drawRectangle(draw,0,0,window.innerWidth,window.innerHeight,"222222",[0,0])) // BACKGROUND RECTANGLE

    //console.log(drawRectangle(draw,200,200,50,50,"f06",[1,1]));
    //console.log(drawLine(draw,150,150,450,450,5,"f06"));
    //console.log(drawRectangle(draw,window.innerWidth,window.innerHeight,100,50,"f06"));
    //console.log(drawCircle(draw,450,500,35,"f13d4a"));

    // TESTING A RECTANGE FOLLOWING A PATH
    console.log(drawPath(draw, pathOne,'none',{color:'#f06',width:4, linecap:'round',linejoin:'round'})); // DRAWING PATH 
    console.log(drawRectangle(draw, 500,500,50,50,"e02",[0,0]));

    console.log(drawPath(draw,pathTwo,'none',{color:'#f06',width:4, linecap:'round',linejoin:'round'}));
    console.log(drawCircle(draw,50,50,50,"e02"));

    // ANIMATION
    //animate();

    var rectOne = rectArray[1][0];
    var pathOne = pathArray[0];

    var circleOne = circleArray[0];
    var pathTwo = pathArray[1];


    

    requestAnimationFrame(movePath(rectOne,pathOne,pathOne.length()));
    requestAnimationFrame(movePath(circleOne,pathTwo,pathTwo.length()));
}






