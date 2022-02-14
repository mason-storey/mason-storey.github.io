// DEFINING QUEUE CONSTANT HERE
// QUEUE IS AN ARRAY OF ARRAYS
// ELEMENTS IN EACH ARRAY WIL BE AS FOLLOWS
//   - [0]: True/False -- WILL INDICATE IF THE FUNCTION ASSOCIATED WITH THIS ARRAY HAS FINISHED RUNNING
//   - [1]: function   -- WILL BE THE FUNCTION ASSOCIATED WITH THE SHAPE
//   = [2]: shape      -- WILL BE THE SHAPE NEEDED FOR THE FUNCTION ABOVE TO RUN
const queue = [];

// DEFINING FUNCTIONS USED BY THE QUEUE HERE

// ADDING TO THE QUEUE
// TAKES ONE QUEUE AND AN OBJECT AS A PARAMETER
function addToQueue(queue,object){
    return queue.push(object);
}

// REMOVING OBJECT FROM THE FRONT OF A QUEUE
// TAKES A QUEUE OBJECT AS A PARAMETER
function removeFromFrontQueue(queue){
    return queue.slice(1,queue.length);
}

// QUEUE TIMEOUT PROCESS
function runQueue(queue){
    // QUEUE PROCESS WILL RUN CONTINUALLY IN THE BACKGROUND
    end = False;
    while (not (end)){
        // TIMEOUT FOR CHECKING THE STATUS OF THE CURRENT QUEUE OBJECT
        setTimeout(function(){
            // CHECKING TO SEE IF THE ANIMATION AT THE FRONT OF THE QUEUE HAS FINISHED
            if (queue[0][0] == True){

                removeFromFrontQueue(queue);

                // CHECKING THERE ARE ITEMS LEFT IN THE QUEUE
                if (queue.length == 0){
                    break;
                } else {
                    runNextQueueEvent(queue);
                }
            }
        },20);
    }
}

// QUEUE EVENT RUNNER
function runNextQueueEvent(queue){
    queue[0]
}

// MISCELLANEOUS FUNCTIONS
// DRAW SHAPE MOVING TO SCREEN
function drawShape(){

}

// FUNCTION TO ADD SHAPE TO QUEUE
function addShape(){
    
}

// CHECKS BUTTON PRESSED TO ADD OBJECT TO QUEUE







// SETTING UP JAVASCRIPT WHEN PAGE IS FINISHED LOADING
window.onload = function(){
    runQueue(queue);
    document.getElementById('addShapeButton').addEventListener("click",addShape);
}