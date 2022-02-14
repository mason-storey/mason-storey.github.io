// DEFINING QUEUE CONSTANT HERE
// QUEUE IS AN ARRAY OF ARRAYS
// ELEMENTS IN EACH ARRAY WIL BE AS FOLLOWS
//   - [0]: True/False array -- WILL INDICATE IF THE FUNCTION ASSOCIATED WITH THIS ARRAY HAS STARTED AND FINISHED RUNNING
//   - [1]: function         -- WILL BE THE FUNCTION ASSOCIATED WITH THE OBJECT
//   - [2]: data list        -- LIST OF DATA ASSOCIATED WITH THE QUEUE OBJECT
const queue = [];

// DEFINING SHAPE ARRAY - MULTI-DIMENTIONAL ARRAY
//   - [0]: shape type       -- CONTAINS A STRING DEFINING THE SHAPE TYPE
//   - [1]: shape data       -- CONTAINS ANY ARGUMENTS NEEDED FOR THE SHAPE TO BE DRAWN
const shapeArray = [];
const pathArray = []

// DEFINING FUNCTIONS USED BY THE QUEUE HERE

// ADDING TO THE QUEUE
// TAKES ONE QUEUE AND AN OBJECT AS A PARAMETER
function addToQueue(queue,object){
    queue.push(object);
}

// REMOVING OBJECT FROM THE FRONT OF A QUEUE
// TAKES A QUEUE OBJECT AS A PARAMETER
function removeFromFrontQueue(queue){
    queue.shift();
}

// QUEUE TIMEOUT PROCESS
function runQueue(queue){
    // QUEUE PROCESS WILL RUN CONTINUALLY IN THE BACKGROUND
    // INTERVAL TO RUN THIS PROCESS EVERY 50ms
    setInterval(function(){
        // CHECKING THERE ARE OBJECTS IN THE QUEUE
        if (queue.length > 0){
            // CHECKING IF THE OBJECT AT THE FRONT OF THE QUEUE HAS STARTED RUNNING
            if (queue[0][0][0] == false){
                runNextQueueEvent(queue);
                queue[0][0][0] = true;
            }

            // CHECKING IF THE OBJECT AT THE FRONT OF THE QUEUE HAS FINISHED RUNNING
            if (queue[0][0][1] == true){
                /// REMOVES THE COMPLETED OBJECT FROM THE QUEUE
                removeFromFrontQueue(queue);
            } 
        }
    }, 50);
}

// QUEUE EVENT RUNNER
function runNextQueueEvent(queue){
    // CALLS THE FUNCTION STORED IN THE QUEUE AT [0][1]
    // PASSES THE ARGUMENTS STORES IN THE QUEUE AT [0][2]
    queue[0][1](queue[0][2]);
}

// CHECKS BUTTON PRESSED TO ADD OBJECT TO QUEUE
function addObjectToQueue(){
    // GETTING SELECTED FUNCTION FROM THE USER
    selectedFunction = document.getElementById("functions").value;

    // GETTING TEXT FROM USER TO DISPLAY INTO THE TEXT BOX
    // GETTING RANDOM TIME DELAY TO KEEP TEXT IN TEXT BOX
    text = document.getElementById("textInput").value;
    randTimeDisplay = Math.floor(Math.random()*10)+1;

    // GETTING SHAPE AND PATH
    var shape = draw.circle(30).move(-100,-100).fill("#f06");
    shapeArray.push(shape)

    switch(selectedFunction){
        case "1": passFunction = displayToScreen; passArgs = [text,randTimeDisplay,"textBox"]; break;
        case "2": passFunction = animateShape; passArgs = [shapeArray[0],pathArray[0]]; break;
    }

    addToQueue(queue,[[false,false],passFunction,passArgs]);

}


// MISCELLANEOUS FUNCTIONS
// DISPLAYS TEXT TO TEXT BOX ON SCREEN
function displayToScreen(args){
    // PRINTING TEXT TO CONSOLE

    textBox = document.getElementById(args[2]);

    textBox.value = args[0];
    setTimeout(function(){
        textBox.value = "";
        // ENDING THE FUNCTION HERE
        queue[0][0][1] = true;
    },args[1]*1000)
}

// CALLING ANIMATE SHAPE
function animateShape(args){
    console.log(args);
    requestAnimationFrame(animateShapeRequested(args[0],args[1],args[1].length()));
}

function animateShapeRequested(element,path,length){
    let n = 0;
    return function anim(timestamp){
        let point = path.pointAt(n);
        element.move(point.x - (element.width()/2), point.y - (element.height()/2) );
        n += 2

        if (!( (element.x() + (element.width()/2))==(path.pointAt(999999999).x) && (element.y() + (element.height()/2))==(path.pointAt(999999999).y) )){
            requestAnimationFrame(anim);
        } else {
            n = 0;
            console.log(drawPath(draw, pathTest,'none',{color:'#f06',width:4, linecap:'round',linejoin:'round'})); // DRAWING PATH 
            
            queue[0][0][1] = true;
        } 
    }
}

function drawPath(draw,pathArgument,pathFill,strokeData){
    var path = draw.path(pathArgument).fill(pathFill).stroke(strokeData);
    pathArray.push(path);
    return true;
}

// SETTING UP JAVASCRIPT WHEN PAGE IS FINISHED LOADING
// MAIN FUNCTION HERE
window.onload = function(){
    // STARTING QUEUE RUNNING
    runQueue(queue);

    // DEFINING DRAW
    draw = SVG().addTo('#drawArea').size(500,500);
    pathTest = "M100 250 H300";

    // DRAWING PATH TO SCREEN 
    console.log(drawPath(draw, pathTest,'none',{color:'#f06',width:4, linecap:'round',linejoin:'round'})); // DRAWING PATH 
    
    console.log(pathArray[0].length());
    // EVENT LISTENER TO BUTTON BEEN CLICKED
    document.getElementById('addShapeButton').addEventListener("click",addObjectToQueue);
}