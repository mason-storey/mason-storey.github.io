// DEFINING OF VARIABLES USED BY THE QUEUE HERE
var runningProgram; // 
var opcodeSize = 3;
var bitSize = 8;
var randomAccessMemory = [];
var stepMode = false;
var step = 0;
var speedMode = false;
var switches = [];
var refreshRate = 0;

// CREATING RAM AND SWITCHES ARRAYS
for (var tempI = 0; tempI < 2**(bitSize-opcodeSize); tempI++ ){ 
    randomAccessMemory.push(0);
}

for (var tempI = 0; tempI < bitSize; tempI++){
    switches.push(0);
}

// REGISTERS HAVE TO BE GLOBAL CLASSES
let accumulatorClass = new register();
let programCounterClass = new register();
let mainAddressRegisterClass = new register();
let mainDataRegisterClass = new register();
let currentInstructionRegisterClass = new register();

// DEFINING CONSTANTS.
// REGISTER SIZE CONSTANTS HERE
var leftColumnWidth = 0.15;
var rightColumnWidth = 0.2;
var registerHeight = 0.05;
var registerWidth = 0.2;
// CPU COLUMN X START POINTS
var leftColumnX = 0.03;
var rightColumnX = 0.2;
// REGISTER Y START POINTS
var programCounterY = 0.06;
var mainAddressRegisterY = 0.06;
var accumulatorY = 0.2;
var mainDataRegisterY = 0.35;
var currentInstructionRegisterY = 0.5;
var controlUnitY = 0.6;
var infoBoxY = 0.15;

// FETCH DECODE EXECUTE CYCLE FUNCTION
function FDE(){
    // LOADING NEXT INSTRUCTION
    fetchInstruction();

    // CHECKING THAT THE PROGRAM HAS NOT HALTED
    addToQueue(FDECheck,[]);

    // FINISHING RUNNING QUEUE OBJECT
    finRunningQueueObject();
}

// RESET FDE CPU AND MEMORY
function FDEReset(){
    for (var tempI = 0; tempI < 2**(bitSize-opcodeSize); tempI++){
        randomAccessMemory[tempI] = 0;
    }

    // SETTING VALUE OF ALL CLASSES TO 0
    accumulatorClass.setValue(0);
    programCounterClass.setValue(0);
    mainAddressRegisterClass.setValue(0);
    mainDataRegisterClass.setValue(0);
    currentInstructionRegisterClass.setValue(0);

    // SETTING ALL DRAWING VALUES TO 0
    memoryAddressBoxValue = 0;
    simulatorRadix = 10;
    selectedExample = 0;

    // CLEARING QUEUE, SHAPE AND PATH ARRAYS
    clearArray(queue);
    clearArray(staticShapeArray);
    clearArray(pathArray);

    drawSimulator(draw,window.innerWidth,window.innerHeight);
}

// FUNCTION TO REMOVE ALL ELEMENTS FROM AN ARRAY
function clearArray(array){
    while (array.length > 0){
        array.pop();
    }
}

// RE CALLING THE FETCH DECOE EXECUTE
function FDECheck(){
    if (  Math.floor(currentInstructionRegisterClass.getValue()/ (2**(bitSize-opcodeSize))) != 0){
        if (programCounterClass.getValue() < 31){
            addToQueue(incrementProgramCounter,[]);
    
            // DECODING + EXECUTING INSTRUCTION
            addToQueue(decodeInstruction,[]);

            // FETCHING NEXT INSTRUCTION
            addToQueue(FDE,[]);
        } else {
            addToQueue(halt,[]);
        }
        
    } else {
        addToQueue(halt,[]);
    }
    finRunningQueueObject();
}

// INCREMENTING PROGRAM COUNTER
function incrementProgramCounter(){
    programCounterClass.increment();
    finRunningQueueObject();
}

// LOAD INSTRUCTION FROM MEMORY AT ADDRESS OF PROGRAM 
function fetchInstruction(){
    if (!speedMode){
        animateOnBus("pc-mar","cpu-pc","cpu-mar",false,false);
        addToQueue(updateRegister,[programCounterClass,mainAddressRegisterClass,false]);  
        animateOnBus("lr-mab","cpu-mar","memory-address",false,false);
        animateOnBus("rl-mdb","memory-address","cpu-mdr",false,false);
        addToQueue(readFromMemory,[]); 
        animateOnBus("mdr-cir","cpu-mdr","cpu-cir",false,false);
        addToQueue(updateRegister,[mainDataRegisterClass,currentInstructionRegisterClass,false]); 
    } else {
        addToQueue(updateRegister,[programCounterClass,mainAddressRegisterClass,false]); 
        addToQueue(queueDrawSim,[]);
        addToQueue(readFromMemory,[]);
        addToQueue(queueDrawSim,[]); 
        addToQueue(updateRegister,[mainDataRegisterClass,currentInstructionRegisterClass,false]); 
        addToQueue(queueDrawSim,[]);
    }
        
}

// DECODING INSTRUCTION FROM MAIN DATA REGISTER
function decodeInstruction(){
    /// WORKING HERE ON DECODING INSTRUCTIONS
    var value = currentInstructionRegisterClass.getValue(); 

    var opcode = Math.floor(value/ (2**(bitSize-opcodeSize)) );

    // ALL THESE ARE ADDED IN REVERSE ORDER AS THEY ARE ADDED 
    // TO THE FONT OF THE QUEUE
    switch (opcode){
        case 1:         // LOAD
            addToFrontOfQueue(load,[]);
            break;
        case 2:         // STORE
            addToFrontOfQueue(store,[]);
            break;
        case 3:         // ADD
            addToFrontOfQueue(add,[]);
            break;
        case 4:         // SUBTRACT
            addToFrontOfQueue(subtract,[]);
            break;
        case 5:         // BRANCH ZERO
            addToFrontOfQueue(branchZero,[]);
            break;
        case 6:         // BRANCH > 0
            addToFrontOfQueue(branchAlways,[]);
            break;
        case 7:
            break;
    } 
    finRunningQueueObject();
}

// FUNCTIONS USED BY THE SIMULATOR TO EXECUTE INSTRUCTIONS
function halt(){
    window.alert("PROGRAM HAS FINISHED EXECUTING NOW");
    finRunningQueueObject();
}

function load(){
    // TO LOAD AN INSTRUCTION THE FOLLOWING STEPS WILL BE DONE
    // 1. SEND CIR OPCODE TO DECODE UNIT
    // 2. SEND CIR OPERAND TO MAIN ADDRESS REGISTER
    // 3. MAIN ADDRESS REGISTER -> MEMORY ADDRESS -> MAIN DATA REGISTER
    // 4. MAIN DATA REGISTER -> ACCUMULATOR
    // -------------------- DONE --------------------

    if (!speedMode){
        addToFrontOfQueue(updateRegister,[mainDataRegisterClass,accumulatorClass,false]);
        animateOnBus("mdr-acc","cpu-mdr","cpu-acc",true,false);
        addToFrontOfQueue(readFromMemory,[]);
        animateOnBus("rl-mdb","memory-address","cpu-mdr",true,false);
        animateOnBus("lr-mab","cpu-mar","memory-address",true,false);
        addToFrontOfQueue(updateRegister,[currentInstructionRegisterClass,mainAddressRegisterClass,true]);
        animateOnBus("cir-mar","cpu-cir","cpu-mar",true,true);
    } else {
        addToFrontOfQueue(updateRegister,[mainDataRegisterClass,accumulatorClass,false]);
        addToQueue(queueDrawSim,[]);
        addToFrontOfQueue(readFromMemory,[]);
        addToQueue(queueDrawSim,[]);
        addToFrontOfQueue(updateRegister,[currentInstructionRegisterClass,mainAddressRegisterClass,true]);
        addToQueue(queueDrawSim,[]);
    }
    
    //addToFrontOfQueue(highlightInstruction,[])

    // FINISHED ADDING TO QUEUE
    finRunningQueueObject();
}

function store(){
    // TO STORE A VALUE FROM ACCUMULATOR TO MEMORY THE FOLLOWING STEPS WILL BE DONE
    // 1. SEND CIR OPCODE TO DECODE UNIT
    // 2. SEND CIR OPERAND TO MAIN ADDRESS REGISTER
    // 2. SEND ACC VALUE TO MAIN DATA REGISTER
    // 3. SET CONTROL BUS TO 1 TO INDICATE A WRITE OPERATION
    // 4. MAIN DATA REGISTER -> MEOMRY ADDRESS
    // 5. SET CONTROL BUS TO 0 TO GO BACK TO READ
    // -------------------- DONE --------------------
    if (!speedMode){
        addToFrontOfQueue(highlightControlBus,[]);
        addToFrontOfQueue(updateMemory,[])
        animateOnBus("lr-mdb","cpu-mdr","memory-address",true,false);
        animateOnBus("lr-mab","cpu-mar","memory-address",true,false);
        addToFrontOfQueue(highlightControlBus,[]);
        addToFrontOfQueue(updateRegister,[accumulatorClass,mainDataRegisterClass,false]);
        animateOnBus("acc-mdr","cpu-acc","cpu-mdr",true,false)
        addToFrontOfQueue(updateRegister,[currentInstructionRegisterClass,mainAddressRegisterClass,true]);
        animateOnBus("cir-mar","cpu-cir","cpu-mar",true,true);
        //addToFrontOfQueue(highlightInstruction,[]);
    } else {
        addToFrontOfQueue(highlightControlBus,[]);
        addToQueue(queueDrawSim,[]);
        addToFrontOfQueue(updateMemory,[])
        addToQueue(queueDrawSim,[]);
        addToFrontOfQueue(highlightControlBus,[]);
        addToQueue(queueDrawSim,[]);
        addToFrontOfQueue(updateRegister,[accumulatorClass,mainDataRegisterClass,false]);
        addToQueue(queueDrawSim,[]);
        addToFrontOfQueue(updateRegister,[currentInstructionRegisterClass,mainAddressRegisterClass,true]);
        addToQueue(queueDrawSim,[]);
    }

    finRunningQueueObject();
}

function add(){
    // TO ADD A VALUE FROM AN ADDRESS TO THE ACCUMULATOR THE FOLLOWING STEPS MUST HAPPEN
    // 1. SEND CIR OPCODE TO DECODE UNIT
    // 2. SEND CIR OPERAND TO MAIN ADDRESS REGISTER
    // 3. SEND MAIN ADDRESS REGISTER TO MEMORY 
    // 4. RECEIVE DATA FROM MEMORY TO MAIN DATA REGISTER
    // 5. SEND MAIN DATA REGISTER TO ACCUMULATOR 
    // -------------------- DONE --------------------
    if (!speedMode){
        addToFrontOfQueue(addToAccFromMDR,[false]);
        animateOnBus("mdr-acc","cpu-mdr","cpu-acc",true,false);
        addToFrontOfQueue(readFromMemory,[]);
        animateOnBus("rl-mdb","memory-address","cpu-mdr",true,false);
        animateOnBus("lr-mab","cpu-mar","memory-address",true,false);
        addToFrontOfQueue(updateRegister,[currentInstructionRegisterClass,mainAddressRegisterClass,true]);
        animateOnBus("cir-mar","cpu-cir","cpu-mar",true,true);
        //addToFrontOfQueue(highlightInstruction,[]);
    } else {
        addToFrontOfQueue(addToAccFromMDR,[false]);
        addToQueue(queueDrawSim,[]);
        addToFrontOfQueue(readFromMemory,[]);
        addToQueue(queueDrawSim,[]);
        addToFrontOfQueue(updateRegister,[currentInstructionRegisterClass,mainAddressRegisterClass,true]);
        addToQueue(queueDrawSim,[]);
    }


    
    finRunningQueueObject();
}

function subtract(){
    // TO ADD A VALUE FROM AN ADDRESS TO THE ACCUMULATOR THE FOLLOWING STEPS MUST HAPPEN
    // 1. SEND CIR OPCODE TO DECODE UNIT
    // 2. SEND CIR OPERAND TO MAIN ADDRESS REGISTER
    // 3. SEND MAIN ADDRESS REGISTER TO MEMORY 
    // 4. RECEIVE DATA FROM MEMORY TO MAIN DATA REGISTER
    // 5. SEND MAIN DATA REGISTER TO ACCUMULATOR 
    // -------------------- DONE --------------------
    if (!speedMode){
        addToFrontOfQueue(addToAccFromMDR,[true]);
        animateOnBus("mdr-acc","cpu-mdr","cpu-acc",true,false);
        addToFrontOfQueue(readFromMemory,[]);
        animateOnBus("rl-mdb","memory-address","cpu-mdr",true,false);
        animateOnBus("lr-mab","cpu-mar","memory-address",true,false);
        addToFrontOfQueue(updateRegister,[currentInstructionRegisterClass,mainAddressRegisterClass,true]);
        animateOnBus("cir-mar","cpu-cir","cpu-mar",true,true);
        //addToFrontOfQueue(highlightInstruction,[]);
    } else {
        addToFrontOfQueue(addToAccFromMDR,[true]);
        addToQueue(queueDrawSim,[]);
        addToFrontOfQueue(readFromMemory,[]);
        addToQueue(queueDrawSim,[]);
        addToFrontOfQueue(updateRegister,[currentInstructionRegisterClass,mainAddressRegisterClass,true]);
        addToQueue(queueDrawSim,[]);
    }

    finRunningQueueObject();
}

function branchZero(){
    // TO BRANCH TO ADDRESS IF ACC = 0 
    // 1. SEND CIR OPCODE TO DECODE UNIT
    // 2. CHECK ACCUMULATOR VALUE
    // 3. IF 0 SEND CIR OPERAND TO PROGRAM COUNTER
    // --------------- DONE -----------------------

    addToFrontOfQueue(checkAccumulatorBranch,[]);
    //addToFrontOfQueue(highlightInstruction,[]);
    finRunningQueueObject();
}

function branchAlways(){
    // TO BRANCH ALWAYS
    // 1. SEND CIR OPCODE TO DECODE UNIT
    // 2. SEND CIR OPERAND TO PROGRAM COUNTER
    if (!speedMode){
        addToFrontOfQueue(highlightRegister,["cpu-pc"]);
        //addToFrontOfQueue(highlightInstruction,[]);
        addToFrontOfQueue(branchPCChange,[]);
    } else {
        addToFrontOfQueue(branchPCChange,[]);
        addToQueue(queueDrawSim,[]);
    }

    
    finRunningQueueObject();
}

// CHECKING ACCUMULATOR 
function checkAccumulatorBranch(){
    // CHECKS ACCUMULATOR VALUE
    // IF ZERO PROGRAM COUNTER BECOMES 
    // OPERAND VALUE
    if (!speedMode){
        if (accumulatorClass.getValue() == 0){
            addToFrontOfQueue(branchPCChange,[]);
            addToFrontOfQueue(highlightRegister,["cpu-pc"]);    
        } 
    
        addToFrontOfQueue(highlightRegister,["cpu-acc"]);    
    } else {
        if (accumulatorClass.getValue() == 0){
            addToFrontOfQueue(branchPCChange,[]);
        }
    }
    
    // FINISHED RUNNING QUEUE OBJECT
    finRunningQueueObject();
}

// FUNCTION TO CHANGE PROGRAM COUNTER TO OPCODE FROM CURRENT INSTRUCTION REGISTER
function branchPCChange(){
    var opcode = currentInstructionRegisterClass.getValue() % 2**(bitSize-opcodeSize);
    programCounterClass.setValue(opcode);

    finRunningQueueObject()
}

// ADDING OR SUBTRACTING VALUE TO ACC FROM MDR
function addToAccFromMDR(passedArgs){
    var subtractFlag = passedArgs[0];
    if (subtractFlag == true){
        accumulatorClass.setValue(accumulatorClass.getValue()-mainDataRegisterClass.getValue());
    } else {
        accumulatorClass.setValue(accumulatorClass.getValue()+mainDataRegisterClass.getValue());
    }
    finRunningQueueObject();
}

// RESIZING THE SIMULATOR WINDOW HERE
function resizeSimulator(){
    // SETTING DRAW WINDOW TO CURRENT WINDOW SIZE
    draw.size(window.innerWidth,window.innerHeight);

    // REDRAWING THE SIMULATOR
    drawSimulator(draw,window.innerWidth,window.innerHeight);
}

// GETTING THE REFRESH RATE OF THE MONITOR
// USED TO MAKE SURE THAT THERE IS A ONE SECOND 
// TRAVEL TIME FOR CIRCLES ALONG THE BUSES
function getScreenRefreshRate(callback, runIndefinitely){
    let requestId = null;
    let callbackTriggered = false;
    runIndefinitely = runIndefinitely || false;
    let count = 0;

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;
    }
    
    let DOMHighResTimeStampCollection = [];

    let triggerAnimation = function(DOMHighResTimeStamp){
        DOMHighResTimeStampCollection.unshift(DOMHighResTimeStamp);
        
        if (DOMHighResTimeStampCollection.length > 10) {
            let t0 = DOMHighResTimeStampCollection.pop();
            let fps = Math.floor(1000 * 10 / (DOMHighResTimeStamp - t0));

            if(!callbackTriggered){
                callback.call(undefined, fps, DOMHighResTimeStampCollection);
            }

            if(runIndefinitely){
                callbackTriggered = false;
            }else if (count == 1){
                callbackTriggered = true;
                refreshRate = fps;
            } else {
                callbackTriggered = false;
                count += 1;
            }
        }
        requestId = window.requestAnimationFrame(triggerAnimation);
    };
    
    window.requestAnimationFrame(triggerAnimation);

    // Stop after half second if it shouldn't run indefinitely
    if(!runIndefinitely){
        window.setTimeout(function(){
            window.cancelAnimationFrame(requestId);
            requestId = null;
        }, 500);
    }
}

// FUNCTION TO DRAW SIMULATOR WINDOW, USES QUEUE
function queueDrawSim(){
    drawSimulator(draw,window.innerWidth,window.innerHeight);
    finRunningQueueObject();
}

// MAIN CALL HERE WHEN WINDOW IS FULLY LOADED
// SIMULATOR WILL BEGIN RUNNING HERE
window.onload = function(){
    // ADDING DRAWING WINDOW TO THE BODY, SIZE OF THE CURRENT WINDOW
    draw = SVG().addTo('body').size(window.innerWidth,window.innerHeight);

    // DRAWS THE SIMULATOR TO THE SCREEN FOR THE FIRST TIME
    drawSimulator(draw,window.innerWidth,window.innerHeight);

    // ADDING RESIZING FUNCTION HERE
    window.addEventListener('resize', resizeSimulator, false);

    // ADDING LISTENING FOR FILE DROPPING HERE
    document.getElementById('simulatorWindow').addEventListener('drop',loadFile);
    removeDefaultDropFunctions();

    //GETTING MONITOR REFRESH RATE
    getScreenRefreshRate(function(FPS){});

    

    // BEGINS RUNNING OF THE QUEUE FUNCTION
    runQueue(queue);
}