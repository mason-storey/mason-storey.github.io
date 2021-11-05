// REFACTORIZING drawingTest.js WITH THE USE OF 
// SVG INSTEAD OF CANVAS
const rectArray = []; // CONTAINS rect OBJECT [0], HORIZONTAL DIRECTION [1], VERTICAL DIRECTION [2]
const circleArray = [];

const speed = 300; // SETS THE SPEED OF OBJECTS IN PIXELS / SECOND
const refreshDelay = 7; // TIME INTERVAL FOR REFRESH UPDATES

// RESIZING THE SVG WINDOW HERE 
function resizeSVG(){
    // SETS THE SIZE OF THE SVG FRAME TO THE SIZE OF THE BROWSER WINDOW
    draw.size(window.innerWidth,window.innerHeight);
}

// ANIMATE INTERVAL FUNCITON DEFINED HERE
function animate(){
    myvar = setInterval(animateRects,refreshDelay); // ANIMATES ALL RECTANGLES WITH A 50ms DELAY 
}

// ANIMATION OF RECTANGLE DONE HERE
function animateRects(){
    for (let count = 1; count < rectArray.length; count++){
            rectArray[count][0].move(rectArray[count][0].attr('x') + rectArray[count][1]*(speed*(refreshDelay/1000)), rectArray[count][0].attr('y') + rectArray[count][2]*(speed*(refreshDelay/1000)));
    }
    checkDirectionRects();
}

// VALIDATION THAT BLOCK HAS NOT HIT THE EDGE
function checkDirectionRects(){
    for (let count = 1; count < rectArray.length; count++){
        // CHECKING LEFT AND RIGHT EDGE OF THE SCREEN
        if ( ( rectArray[count][0].attr('x') < 0 )  || ( (rectArray[count][0].attr('x') + rectArray[count][0].attr('width') ) > window.innerWidth) ) {
            rectArray[count][1] *= -1;
        }

        if ( ( rectArray[count][0].attr('y') < 0 )  || ( (rectArray[count][0].attr('y') + rectArray[count][0].attr('height') ) > window.innerHeight) ) {
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
        console.log(rect.attr('color'));

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

// CHECK THAT A POSITION OF AN OBJECT IS ON SCREEN
function validatePos(xPos,yPos){
    if (xPos >= 0 && xPos <= window.innerWidth && yPos >= 0 && yPos <= window.innerHeight){
        return true;
    } else {
        return false;
    }
}

// MAIN FUNCTION CALLED HERE, WAITING FOR WINDOW TO FULLY LOAD TO
window.onload = function(){
    // DEFINING OUR SVG WINDOW, CREATING GLOBAL DRAW. 
    draw = SVG().addTo('body').size(window.innerWidth,window.innerHeight);

    // LISTENING FOR A RESIZE OF THE WINDOW 
    window.addEventListener('resize', resizeSVG, false); //ADDS EVENT LISTENER FOR THE RESIZING OF THE WINDOW
    resizeSVG();

    // DRAWING AND LOGGING THE DRAWING OF RECTS, CIRCLES, ETC...
    console.log(drawRectangle(draw,0,0,window.innerWidth,window.innerHeight,"222222",[0,0]))
    console.log(drawRectangle(draw,200,200,50,50,"f06",[1,1]));
    //console.log(drawRectangle(draw,window.innerWidth,window.innerHeight,100,50,"f06"));
    //console.log(drawCircle(draw,450,500,35,"f13d4a"));

    // ANIMATING THE RECTANGLES
    animate();
}






