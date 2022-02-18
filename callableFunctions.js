// DEFINING VARIABLES NEEDED FOR THE SIMULATION HERE
var accumulator = 0;
var programCounter = 0;
var mainAddressRegister = 0;
var mainDataRegister = 0;
var currentInstructionRegister = 0;
var randomAccessMemory = [31,62,36,0,0,0,0,0,0,0,0,0,0,0,50,100];
var userInput = 0;

var mode = 2; // MODES: 0- Binary, 1- Hex, 2- Denary

var runningProgram;



// DEFINING THE FUNCTIONS AVAILABLE
// 0000 - END - ENDS THE CURRENT PROGRAM EXECUTION, DISPLAYS END TO THE USER
function end(){
    window.alert("PROGRAM HAS FINISHED EXECUTING NOW");
    clearInterval(runningProgram);
    return true;
}

// 0001 - LOAD - LOADS VALUE FROM MEMORY ADDRESS TO ACCUMULATOR
function load(memoryAddress){
    mainAddressRegister = memoryAddress;
    accumulator = randomAccessMemory[memoryAddress];
}

// 0010 - STORE - STORES VALUE IN ACCUMULATOR TO MEMORY ADDRESS SPECIFIED
function store(memoryAddress){
    console.log(memoryAddress);
    randomAccessMemory[memoryAddress] = accumulator;
}

// 0011 - ADD - ADDS VALUE AT THE MEMORY ADDRESS TO THE ACCUMULATOR
function add(memoryAddress){
    accumulator += randomAccessMemory[memoryAddress];
}

// 0100 - SUBTRACT
function subtract(memoryAddress){
    accumulator -= randomAccessMemory[memoryAddress]
}

// 0101 - BRANCH IF ZERO - SETS PROGRAM COUNTER TO VALUE OF THE OPERAND IF ACCUMULATOR = 0
function branchZero(){
    if (accumulator = 0){
        programCounter = getOperand(mainDataRegister);
    }
}

// 0110 - BRANCH IF GREATER THAN ZERO - SETS PROGRAM COUNTER TO VALUE OF THE OPERAND IF ACCUMULATOR > 0
function branchGreaterThanZero(){
    if (accumulator > 0){
        programCounter = getOperand(mainDataRegister)
    }
}

// 0111 - OUTPUT TO LEDS
function output(){
    window.alert(accumulator.toString());
}

// 1000 - INPUT FROM USER - GETS INPUT FROM USER AND LOADS IT TO THE ACCUMULATOR
function input(){
    var userInput = window.prompt("Enter a value: ");

    accumulator = parseInt(userInput);
}

// FUNCTION FOR VALIDATING A USER INPUT
function validateUserInput(input){
    validInput = false;
    switch (mode){
        // BINARY CHECK
        case "0": validInput = true; break;

        // HEXADECIMAL CHECK
        case "1": validInput = true; break;

        // DENARY CHECK
        case "2": validInput = true; break;
    }

    return validInput;
}


// FUNCTION TO GET OPCODE FROM A STRING OF DATA
function getOpcode(dataPassed){
    return Math.floor(dataPassed/16);
}

// FUNCTION TO GET OPERAND FROM A STRING OF DATA
function getOperand(dataPassed){
    return dataPassed%16;
}

// LOADS VALUE FROM MEMORY ADDRESS TO DATA REGISTER
function toDataRegister(memoryAddress){
    mainDataRegister = randomAccessMemory[memoryAddress];
}

// PROCESSING DATA REGISTER HERE
function processDataRegister(){
    // THIS SPLITS THE 8 BIT NUMBER INTO THE OP CODE AND OPERAND
    var opcode = getOpcode(mainDataRegister); // DIVIDING BY 16 AS THIS IS THE NUMBER OF VALUES A 4 BIT NUMBER CAN HAVE
    var operand = getOperand(mainDataRegister); // RETURNS THE REMAINDER OF THE DATA REGISTER DIVIDED BY 16;

    switch(opcode){
        case 0: end(); break;
        case 1: load(operand); break;
        case 2: store(operand); break;
        case 3: add(operand); break;
        case 4: subtract(operand); break;
        case 5: branchZero(); break;
        case 6: branchGreaterThanZero(); break;
        case 7: output(); break;
        case 8: input(); break;
    }
}


// STARTING PROCESSING OF INSTRUCTIONS
function startProcessing(){
    randomAccessMemory = getMemoryValues();

    runningProgram = setInterval(function(){
        toDataRegister(programCounter);
        displayRegisters();
        setTimeout(function(){
            processDataRegister(mainDataRegister);
            displayRegisters();
            displayMemory();
        },1000)
    
        programCounter += 1;
    }, 2000);

}

// DISPLAY MEMORY 
function displayMemory(){
    outString = "";
    for (var i = 0; i < randomAccessMemory.length; i++){
        outString += randomAccessMemory[i].toString();
        outString += "\n";
    }

    textBox = document.getElementById("contentTarget");

    textBox.value = outString;
}

// DISPLAY VALUES TO REGISTERS
function displayRegisters(){
    var programCounterBox = document.getElementById("programCounterHTMLBox");
    programCounterBox.value = programCounter;

    var accumulatorBox = document.getElementById("accumulatorHTMLBox");
    accumulatorBox.value = accumulator;

    var currentInstructionRegisterBox = document.getElementById("currentInstructionRegisterHTMLBox");
    currentInstructionRegisterBox.value = currentInstructionRegister;

    var mainAddressRegisterBox = document.getElementById("mainAddressRegisterHTMLBox");
    mainAddressRegisterBox.value = mainAddressRegister;

    var mainDataRegisterBox = document.getElementById("mainDataRegisterHTMLBox");
    mainDataRegisterBox.value = mainDataRegister;
}


// FUNCTION TO GET MEMORY VALUES
function getMemoryValues(){
    var textBox = document.getElementById("contentTarget");

    var returnMemory = textBox.value.split("\n");
    returnMemory.pop();

    for (var i =0; i < returnMemory.length; i++){
        returnMemory[i] = parseInt(returnMemory[i]);
    }

    return returnMemory;

}


window.onload = function(){
    // DISPLAYING THE MEMORY AND CURRENT VALUE OF THE REGISTERS
    displayMemory();
    displayRegisters();

    // WAITING FOR CLICK OF THE START BUTTON
    document.getElementById("startProgramButton").addEventListener("click",startProcessing);;
    document.getElementById("inputFile").addEventListener("change",getFile);

}