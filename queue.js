// DEFINING QUEUE CONSTANT HERE
// QUEUE IS AN ARRAY OF OBJECTS
// ELEMENTS IN EACH OBJECT WIL BE AS FOLLOWS
//   - startedRunning: True/False       -- WILL INDICATE IF THE FUNCTION ASSOCIATED WITH THIS ARRAY HAS STARTED RUNNING
//   - finishedRunning: True/False      -- WILL INDICATE IF THE FUNCTION ASSOCIATED WITH THIS ARRAY HAS STARTED RUNNING
//   - passFunction: function           -- WILL BE THE FUNCTION ASSOCIATED WITH THE OBJECT
//   - passArguemnts: list of arguments -- LIST OF ARGUMENTS ASSOCIATED WITH THE QUEUE OBJECT
const queue = [];

// DEFINING FUNCTIONS USED BY THE QUEUE HERE
// ADDING TO THE QUEUE
// TAKES FUNCTION TO QUEUE AND ARGUMENTS FOR THAT FUNCTION
function addToQueue(funct,args){
    queue.push({startedRunning:false,finishedRunning:false,passFunction:funct,passArguments:args});
}

// ADDS FUNCTION TO THE BEGINNING OF THE QUEUE
// NEEDED AS WE DO NOT KNOW WHAT AN INSTRUCTION MIGHT BE IN MEMORY THEREFORE
// WE MAY NEED TO PRIORITY QUEUE SOME ELEMENTS BEORE OTHERS IN THE QUEUE HAPPEN
function addToFrontOfQueue(funct,args){
    queue.splice(1,0,{startedRunning:false,finishedRunning:false,passFunction:funct,passArguments:args});
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
            if (queue[0].startedRunning == false){
                runNextQueueEvent(queue);
                queue[0].startedRunning = true;
            }

            // CHECKING IF THE OBJECT AT THE FRONT OF THE QUEUE HAS FINISHED RUNNING
            if (queue[0].finishedRunning == true){
                if (stepMode){
                    if (step == 1){
                        removeFromFrontQueue(queue);
                        console.log(queue);
                        step = 0;
                    }
                } else {
                    removeFromFrontQueue(queue);
                    //console.log(queue);
                }
                /// REMOVES THE COMPLETED OBJECT FROM THE QUEUE
                
            } 
        }
    }, 50);
}

// QUEUE EVENT RUNNER
function runNextQueueEvent(queue){
    // CALLS THE FUNCTION STORED IN THE QUEUE AT [0].passFunction
    // PASSES THE ARGUMENTS STORES IN THE QUEUE AT [0].passArguments
    queue[0].passFunction(queue[0].passArguments);
}


// CHECKS BUTTON PRESSED TO ADD OBJECT TO QUEUE
function addObjectToQueue(){
    let passObject = {startedRunning:false,finishedRunning:false,passFunction:"",passArguments:""};

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
        case "1": passObject.passFunction = displayToScreen; passObject.passArguments = [text,randTimeDisplay,"textBox"]; break;
        case "2": passObject.passFunction = animateShape; passObject.passArguments = [shapeArray[0],pathArray[0]]; break;
    }

    addToQueue(queue,passObject);
}