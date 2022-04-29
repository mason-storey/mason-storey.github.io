// ARRAY OF SHAPE OBJECTS
// CONTAINS
//   TYPE        : TYPE OF SHAPE
//   shapeObject : SHAPE OBJECT 
const staticShapeArray = []; 
const pathArray = [];
var controlBusStrokeColour = "FFD700";

// DRAWS A RECTANGLE OF GIVEN WIDTH, HEIGHT, XPOS, YPOS
// RETURNS TRUE IF THE RECTANGLE WAS DRAWN, FALSE IF NOT
function drawRectangle(draw,xPos,yPos,width,height,colourStr,shapeUse){
    var shapePush = {type:"rect",object:"",use:shapeUse};

    if (validatePos(xPos,yPos)){
        // CREATING THE RECTANGLE AND ADDING IT TO THE RECTANGLE ARRAY
        var rect = draw.rect(width,height).move(xPos,yPos).fill('#'+colourStr).radius(20,20);
        shapePush.object = rect;
        staticShapeArray.push(shapePush); // PUSHING RECTANGLE AND INFORMATION TO RECTANGLE ARRAY

        // CONSOLE LOGGING BELOW HERE FOR TESTING PURPOSES 
        //console.log(rect.attr('color'));

        return true;
    }
    return false;
}

// DRAWS A CIRCLE OF GIVEN RADIUS, XPOS, YPOS
// RETURNS TRUE IF THE CIRCLE WAS DRAWN
function drawCircle(draw,xPos,yPos,radius,colourStr,shapeUse){
    var shapePush = {type:"circle",object:"",use:shapeUse};

    if (validatePos(xPos,yPos)){
        var circle = draw.circle(radius).move(xPos,yPos).fill('#'+colourStr);
        shapePush.object = circle;
        staticShapeArray.push(shapePush);
        return true;
    }
    return false;
}

// DRAWS A LINE OF GIVEN START XPOS, YPOS; END XPOS, YPOS AND WIDTH
// RETURNS TRUE IF LINE WAS DRAWN
function drawBus(draw,startXPos,startYPos,endXPos,endYPos,widthLine,colourStr,shapeUse,busText){
    var shapePush = {type:"line",object:"",use:shapeUse};

    if (validateLine(startXPos,startYPos,endXPos,endYPos)){
        var line = draw.line(0,0,endXPos-startXPos,endYPos-startYPos).move(startXPos,startYPos).stroke({color: "#"+colourStr,width:widthLine});
        shapePush.object=line;
        staticShapeArray.push(shapePush);
        draw.text(busText).x(startXPos + (endXPos-startXPos)/2-60).y(startYPos-30).fill("#e1e1e1");
        return true;
    }
    return false;
}

// DRAWS A PATH TO THE SCREEN 
function drawPath(draw,pathArgument,pathFill,strokeData,pathName){
    var pathArrayObject = {pathObject: "",pathName:""};
    var path = draw.path(pathArgument).fill(pathFill).stroke(strokeData);
    
    pathArrayObject.pathObject = path;
    pathArrayObject.pathName = pathName;
    pathArray.push(pathArrayObject);
    return true;
}


// FUNCTION TO DRAW REGISTER AT GIVEN POSITION WITH GIVEN DATA
function drawRegisterBox(draw,xPos,yPos,width,height,colourStr,title,value,shapeUse){
    drawRectangle(draw,xPos,yPos,width,height,colourStr,shapeUse);
    if (title != "CONTROL UNIT"){
        draw.text(title).x(xPos+10).y(yPos+height/5);
        draw.text(value.toString()).x(xPos+width/2-5).y(yPos+height*(3/5));
    } else {
        draw.text(title).x(xPos+width*0.38).y(yPos+height*0.38);
    }
}

// FUNCTION TO DRAW MEMORY ADDRESS
function drawMemoryAddress(draw,xPos,yPos,width,height,colourStr,memoryIndex,value,shapeUse){
    drawRectangle(draw,xPos,yPos,width,height,colourStr,shapeUse);
    draw.text("Mem Addr: "+ memoryIndex.toString()).x(xPos+10).y(yPos+height/5);
    draw.text("Val: " + value.toString()).x(xPos+10).y(yPos+height*(2/5));

    draw.text(translateValue(value)).x(xPos+10).y(yPos+height*(3/5));
}


// FUNCTION TO DRAW THE INFO BOX CONTAINING ALL OF THE OPCODES AND THEIR USES
function drawInfoBox(draw,xPos,yPos,width,height,colourStr){
    infoBoxData = [
        {opcode:"000",information:"HALT - Halts Simulation Execution"},
        {opcode:"001",information:"LOAD - Loads data from given\n memory address"},
        {opcode:"010",information:"STORE - Stores data to given\n memory adress"},
        {opcode:"011",information:"ADD - Adds value at memory\n address to accumulator"},
        {opcode:"100",information:"SUBTRACT - Subtracts value\n at memory address from accumulator"},
        {opcode:"101",information:"BRANCHZERO - Branches to memory\n address if accumulator = 0"},
        {opcode:"110",information:"BRANCH GREATHER THAN 0 - \nBranches to memory address if \naccumulator > 0"},
        {opcode:"111",information:"unused"}
    ];
    drawRectangle(draw,xPos,yPos,width,height,colourStr,'infobox-background');

    draw.text("OPCODES").x(xPos+(width*0.2)).y(yPos+height*0.03);
    draw.text("INFORMATION").x(xPos+(width*0.5)).y(yPos+height*0.03);
    
    for (var tempI = 0; tempI < infoBoxData.length; tempI++){
        draw.text(infoBoxData[tempI].opcode).x(xPos+(width*0.1)).y(yPos+(height*0.9*(tempI+1))/8);
        draw.text(infoBoxData[tempI].information).x(xPos+(width*0.3)).y(yPos+(height*0.9*(tempI+1))/8);

    }
}


// CHECK THAT A POSITION OF AN OBJECT IS ON SCREEN, ELSE IT DOES NOT DRAW THE OBJECT
function validatePos(xPos,yPos){
    if (xPos >= 0 && xPos <= window.innerWidth && yPos >= 0 && yPos <= window.innerHeight){
        return true;
    } else {
        return false;
    }
}

// CHECK THAT A POSITION OF A LINE IS ON THE SCREEN; IF NOT NO OBJECT IS DRAWN
function validateLine(startXPos,startYPos,endXPos,endYPos){
    if (startXPos >= 0 &&
        startXPos <= window.innerWidth &&
        endXPos >= 0 && 
        endXPos <= window.innerWidth &&
        startYPos >= 0 &&
        startYPos <= window.innerHeight &&
        endYPos >= 0 &&
        endYPos <= window.innerHeight){
            return true;
        } else {
            return false;
        }
}

// FUNCTION TO HIGHLIGHT A REGISTER
function highlightRegister(passedArgs){
    var register = passedArgs[0];

    // FIXING BUG OF HIGHLIGHTING WRONG MEMORY ADDRESS 
    // DUE TO PASSING OLD VALUE DIRECT TO FUNCTION OVER GETTING
    // VALUE FROM REGISTER CLASS
    if (register == "memory-address"){
        register += mainAddressRegisterClass.getValue().toString();
    }

    const index = staticShapeArray.findIndex((element) => element.use === register);
    var holdColour = staticShapeArray[index].object.attr('fill');

    staticShapeArray[index].object.fill("#FF0000");

    setTimeout( function() {
        staticShapeArray[index].object.fill(holdColour);
        finRunningQueueObject();
    },1000);
}

// FUNCTION TO ANIMATE A VALUE ON A BUS FROM A SOURCE REGISTER TO A DESTINATION REGISTER
function animateOnBus(bus,sourceRegister,destinationRegister,frontTick,operandTick){
    // IF FRONT TICK IS TRUE, THEN addToFrontQueue IS USED INSTEAD OF ADD TO QUEUE
    
    // QUEUEING STEPS NEEDED TO ANIMATE VALUE ON A BUS
    if (frontTick){
        addToFrontOfQueue(highlightRegister,[destinationRegister]);
        addToFrontOfQueue(animateValueOnBus,[bus,sourceRegister,operandTick]);
        addToFrontOfQueue(highlightRegister,[sourceRegister]);
    } else {
        addToQueue(highlightRegister,[sourceRegister]);
        addToQueue(animateValueOnBus,[bus,sourceRegister,operandTick]);
        addToQueue(highlightRegister,[destinationRegister]);
    }
}

// GETS REGISTER VALUE FROM REGISTER TEXT NAME
function getRegisterValue(register){
    switch (register){
        case "cpu-pc":
            return programCounterClass.getValue();
        case "cpu-mar":
            return mainAddressRegisterClass.getValue();
        case "cpu-mdr":
            return mainDataRegisterClass.getValue();
        case "cpu-acc":
            return accumulatorClass.getValue();
        case "cpu-cir":
            return currentInstructionRegisterClass.getValue();
    }
}

// GETS MEMORY VALUE FROM GIVEN MEMORY ADDRESS
function getMemoryValue(memoryAddress){    
    return randomAccessMemory[mainAddressRegisterClass.getValue()];
}

// HIGHLIGHTS CONTROL BUS
function highlightControlBus(){
    if (controlBusStrokeColour == "FF0000"){
        controlBusStrokeColour = "FFD700";
    } else {
        controlBusStrokeColour = "FF0000";
    }

    finRunningQueueObject();
}

// ANIMATES VALUE ON THE BUS
function animateValueOnBus(args){
    var operandTick = args[2];
    // GETTING THE VALUE TO BE DISPLAYED ON THE BUS
    if(args[1].includes("memory-address")){
        var valueOnBus = getMemoryValue(args[1]);
    } else {
        var valueOnBus = getRegisterValue(args[1]);
    }

    if (operandTick == true){
        valueOnBus = valueOnBus % 2**(bitSize-opcodeSize);
    }

    const index = pathArray.findIndex((element) => element.pathName === args[0]);
    const path = pathArray[index].pathObject;
    requestAnimationFrame(requestAnimateValOnBus(path,valueOnBus));
}

// ANIMATES A CIRCLE WITH A VALUE IN IT, ONTO A GIVEN BUS
// DELETES THE CIRCLE ONCE REACHED THE END OF THE BUS
function requestAnimateValOnBus(path,value){
    // CREATING THE CIRCLE 
    var circle = draw.circle(30).fill('#F0F0F0');
    var number = draw.text(value.toString()).x(10);

    var group = draw.group();
    group.add(circle);
    group.add(number);

    // n IS POSITION ALONG THE PATH
    let n = 0;
    return function anim(timestamp){
        // GETS X AND Y COORDINATES OF POINT ON THE PATH AT GIVEN LENGTH n ALONG THE PATH
        let point = path.pointAt(n);
        // MOVES THE CIRCE TO THE POINT ON THE PATH 
        group.move(point.x - (group.width()/2), point.y - (group.height()/2) );
        n += 2

        // CHECKING IF THE CIRCLE HAS REACHED THE END OF THE PATH
        // IF TRUE IT REMOVES THE FUNCTION FROM THE QUEUE,
        // ELSE CONTINUES TO ANIMATE THE SHAPE ON THE PATH
        if (!( (group.x() + (group.width()/2))==(path.pointAt(999999999).x) && (group.y() + (group.height()/2))==(path.pointAt(999999999).y) )){
            requestAnimationFrame(anim);
        } else {

            drawSimulator(draw,window.innerWidth,window.innerHeight); 
            queue[0].finishedRunning = true;
        } 
    }


}

// DRAWING SIMULATOR FUNCTION
// DRAWING SIMULATOR WINDOW
function drawSimulator(draw,width,height){
    // CLEARS THE DRAW WINDOW
    draw.clear();

    // REMOVING OLD SHAPES FROM STATIC SHAPE ARRAY
    while (staticShapeArray.length > 0){
        staticShapeArray.pop();
    }

    // REMOVING OLD PATHS FROM PATHARRAY
    // CAUSED BUG WITH CIRCLES AND NUMBERS NOT MOVING ON THE PROPER GOLD PATHS
    while(pathArray.length > 0){
        pathArray.pop();
    }
    
    // DRAWING CPU SIDE
    drawRectangle(draw,width*0.02,height*0.02,width*0.4,height*0.68,"00e541","cpu-background"); // DRAWING BACKGROUND
    drawRegisterBox(draw,width*leftColumnX,height*programCounterY,width*leftColumnWidth,height*registerHeight,"e2e2e2","PROGRAM COUNTER",programCounterClass.getValue(),"cpu-pc"); // DRAWING PROGRAM COUNTER BOX
    drawRegisterBox(draw,width*rightColumnX,height*mainAddressRegisterY,width*rightColumnWidth,height*registerHeight,"e2e2e2","MAIN ADDRESS REGISTER",mainAddressRegisterClass.getValue(),"cpu-mar"); // DRAWING MAIN ADDRESS REGISTER BOX
    drawRegisterBox(draw,width*(rightColumnX*13/10),height*accumulatorY,width*(rightColumnWidth*(7/10)),height*registerHeight,"e2e2e2","ACCUMULATOR",accumulatorClass.getValue(),"cpu-acc"); // DRAWING ACCUMULATOR REGISTER BOX
    drawRegisterBox(draw,((width*rightColumnX)*1.5),height*mainDataRegisterY,width*rightColumnWidth/2,height*registerHeight,"e2e2e2","MAIN DATA REGISTER",mainDataRegisterClass.getValue(),"cpu-mdr"); // DRAWING MAIN DATA REGISTER BOX
    drawRegisterBox(draw,width*rightColumnX,height*currentInstructionRegisterY,width*rightColumnWidth,height*registerHeight,"e2e2e2","CURRENT INSTRUCTION REGISTER",currentInstructionRegisterClass.getValue(),"cpu-cir"); // DRAWING CURRENT INSTRUCTION REGISTER BOX
    drawRegisterBox(draw,width*rightColumnX,height*controlUnitY,width*rightColumnWidth,height*registerHeight,"e2e2e2","CONTROL UNIT",-1,"cpu-cir"); // DRAWING CURRENT INSTRUCTION REGISTER BOX
    drawInfoBox(draw, width*leftColumnX,height*infoBoxY,width*leftColumnWidth,height*0.5,"e2e2e2"); // DRAWING BOX CONTAINING INSTRUCTION INFO 

    // DRAWING MEMORY SIDE
    drawRectangle(draw,width*0.58,height*0.02,width*0.4,height*0.68,"a19400","memory-background");
    drawRectangle(draw,width*0.59,height*0.03,width*0.38,height*0.66,"e1e1e1","memory-background");
    // DRAWING MEMORY ADDRESSES
    for (var tempI = 0; tempI < randomAccessMemory.length; tempI++){
        memoryWidthStart = width*0.59;
        memoryHeightStart = height*0.03;
        memoryWidth = 0.38;
        memoryHeight = 0.66/(randomAccessMemory.length/4)

        drawMemoryAddress(draw,memoryWidthStart + ((memoryWidth*width/4)*(tempI%4)),memoryHeightStart+ (height*memoryHeight)*(Math.floor(tempI/4)),(memoryWidth*width/4),(height*memoryHeight),"b1b1b1",tempI,randomAccessMemory[tempI],"memory-address"+(tempI.toString()));
    }

    // DRAWING BUSSES
    // startXPos,startYPos,endXPos,endYPos,widthLine,colourStr,shapeUse
    // THESE BUSSES ARE FOR CPU <-> MEMORY
    pathMAB = "M" + (width*0.42).toString() + " " + (height*0.08).toString() + " H" + (width*0.58).toString();
    pathMDB = "M" + (width*0.42).toString() + " " + (height*0.37).toString() + " H" + (width*0.58).toString();
    pathCB = "M" + (width*0.42).toString() + " " + (height*0.62).toString() + " H" + (width*0.58).toString();
    pathMDBMemToCPU = "M" + (width*0.58).toString() + " " + (height*0.37).toString() + " H" + (width*0.42).toString();

    // DRAWING THE PATHS THAT THE MOVING OBJECTS WILL FOLLOW
    // BELOW PATHS AND BUSSES THAT ARE CPU <-> MEMORY
    drawPath(draw,pathMAB,'none',{color:"#00A7A7",width:1},"lr-mab"); // LEFT TO RIGHT MAIN ADDRESS BUS
    drawPath(draw,pathMDB,'none',{color:"#00A7A7",width:1},'lr-mdb'); // LEFT TO RIGHT MAIN DATA BUS
    drawPath(draw,pathCB,'none',{color:"#00A7A7",width:1}),'lr-cb'; // LEFT TO RIGHT CONTROL BUS
    drawPath(draw,pathMDBMemToCPU,'none',{color:"#00A7A7",width:1},'rl-mdb'); // RIGHT TO LEFT MAIN DATA BUS
    drawBus(draw,width*0.42,height*0.08,width*0.58,height*0.08,height/100,"FFD700","buses-MAR","MAIN ADDRESS BUS");
    drawBus(draw,width*0.42,height*0.37,width*0.58,height*0.37,height/100,"FFD700","buses-MDR","MAIN DATA BUS");
    drawBus(draw,width*0.42,height*0.62,width*0.58,height*0.62,height/100,controlBusStrokeColour,"buses-CB","CONTROL BUS");

    // PATHS FOR INTNERNAL CPU BUSSES
    pathPCtoMAR =  "M" + (width*(leftColumnWidth+leftColumnX)).toString() + " " + (height*(programCounterY + (registerHeight)/2)).toString() + " H" + (width*rightColumnX).toString();
    pathMDRtoCIR = "M" + (width*(rightColumnX + (rightColumnWidth)*(3/4))).toString() + " " + (height*(mainDataRegisterY+registerHeight)).toString() + " V" + (height*currentInstructionRegisterY).toString(); 
    pathMDRtoACC = "M" + (width*(rightColumnX + (rightColumnWidth)*(3/4))).toString() + " " + (height*mainDataRegisterY).toString() + " V" + (height*(accumulatorY+registerHeight)).toString();
    pathACCtoMDR = "M" + (width*(rightColumnX + (rightColumnWidth)*(3/4))).toString() + " " + (height*(accumulatorY+registerHeight)).toString() + " V" + (height*mainDataRegisterY).toString();
    pathACCtoMAR = "M" + (width*(rightColumnX + (rightColumnWidth)/2)).toString() + " " + (height*accumulatorY).toString() + " V" + (height*(mainAddressRegisterY+registerHeight)).toString(); 
    pathCIRtoACC = "M" + (width*(rightColumnX + (rightColumnWidth)*(2/5))).toString() + " " + (height*(currentInstructionRegisterY)).toString() + " V" + (height*(accumulatorY+registerHeight)).toString(); 
    pathCIRtoMAR = "M" + (width*(rightColumnX + (rightColumnWidth)*(1/5))).toString() + " " + (height*(currentInstructionRegisterY)).toString() + " V" + (height*(mainAddressRegisterY+registerHeight)).toString(); 


    // DRAWING INTERNAL CPU BUSSES BETWEEN REGISTERS
    drawPath(draw,pathPCtoMAR,'none',{color:"#00A7A7",width:1},'pc-mar'); // PROGRAM COUNTER -> MAIN ADDRESS REGISTER
    drawPath(draw,pathMDRtoCIR,'none',{color:"#00A7A7",width:1},'mdr-cir'); // MAIN DATA REGISTER -> CURRENT INSTRUCTION REGISTER
    drawPath(draw,pathMDRtoACC,'none',{color:"#00A7A7",width:1},'mdr-acc'); // MAIN DATA REGISTER -> ACCUMULATOR
    drawPath(draw,pathACCtoMAR,'none',{color:"#00A7A7",width:1},'acc-mar'); // ACCUMULATOR -> MAIN ADDRESS REGISTER
    drawPath(draw,pathACCtoMDR,'none',{color:"#00A7A7",width:1},'acc-mdr'); // ACCUMULATOR -> MAIN DATA REGISTER
    drawPath(draw,pathCIRtoACC,'none',{color:"#00A7A7",width:1},'cir-acc'); // CURRENT INSTRUCTION REGISTER -> ACCUMULATOR
    drawPath(draw,pathCIRtoMAR,'none',{color:"#00A7A7",width:1},'cir-mar'); // CURRENT INSTRUCTION REGISTER -> MAIN ADDRESS REGISTER

    drawBus(draw,(width*(leftColumnWidth+leftColumnX)),(height*(programCounterY + (registerHeight)/2)),(width*(rightColumnX)),(height*(programCounterY + (registerHeight)/2)),height/100,"FFD700","buses-PCtoMAR","");
    drawBus(draw,(width*(rightColumnX + (rightColumnWidth)*(3/4))),(height*(mainDataRegisterY+registerHeight)),(width*(rightColumnX + (rightColumnWidth)*(3/4))),(height*currentInstructionRegisterY),height/100,"FFD700","buses-MDRtoCIR","");
    drawBus(draw,(width*(rightColumnX + (rightColumnWidth)*(3/4))),(height*(accumulatorY+registerHeight)),(width*(rightColumnX + (rightColumnWidth)*(3/4))),(height*mainDataRegisterY),height/100,"FFD700","buses-MDRtoACC","");
    drawBus(draw,(width*(rightColumnX + (rightColumnWidth)/2)),(height*(mainAddressRegisterY+registerHeight)),(width*(rightColumnX + (rightColumnWidth)/2)),(height*accumulatorY),height/100,"FFD700","buses-ACCtoMAR","");
    drawBus(draw,(width*(rightColumnX + (rightColumnWidth)*(2/5))),(height*(accumulatorY+registerHeight)),(width*(rightColumnX + (rightColumnWidth)*(2/5))),(height*currentInstructionRegisterY), height/100, "FFD700","buses-CIRtoACC","");
    drawBus(draw,(width*(rightColumnX + (rightColumnWidth)*(1/5))),(height*(mainAddressRegisterY+registerHeight)),(width*(rightColumnX + (rightColumnWidth)*(1/5))),(height*currentInstructionRegisterY),height/100,"FFD700","buses-CIRtoMAR","");


    // DRAWING LED OUTPUT 

    // DRAWING USER INTERACTION BAR
    // SETTING SIZES OF BUTTONS  DPEENDING ON SCREEN SIZE
    drawRectangle(draw,0,height*0.8,width,height,"a2a2a2","userbar-background");

    var buttonWidth = 100 * (width/1920);
    var buttonHeight = 50 * (height/1007);

    // DRAWING RUN AND RESET BUTTONS
    var span = document.createElement('span');
    var runButton = draw.foreignObject(width*0.1,height*0.05).x(width*0.03).y(height*0.84);
    var resetButton = draw.foreignObject(width*0.1,height*0.05).x(width*0.03).y(height*0.92);

    // TESTING 

    runButton.add('<span id="run"><button type="button" id="runButton" class="userButtons" style="width:'+buttonWidth.toString()+ 'px;height:'+ buttonHeight.toString() + 'px">RUN</button></span>');
    resetButton.add(SVG('<span id="reset"><button type="button" id="resetButton" class="userButtons" style="width:'+buttonWidth.toString()+'px; height:'+ buttonHeight.toString() + 'px">RESET</button></span>'));

    // ADDING HOOKS TO BUTTONS EVERY REDRAW
    // CHECKING FOR RUN AND RESET BUTTONS
    document.getElementById('runButton').addEventListener("click", runFDEClick);

    // RESETTING THE QUEUE AND 
    document.getElementById('resetButton').addEventListener("click", resetFDEClick);

    // DRAWING CODE EDITOR 
    var selectMemoryAddress = draw.foreignObject(width*0.1,height*0.05).x(width*0.6).y(height*0.88);
    selectMemoryAddress.add('<span id="memAddrSelect"><input class="memoryAddressSelect" id="memoryAddressSelect" type="number" value="0" min=0 max="'+(2**(bitSize-opcodeSize)-1).toString()+'" style="width:'+buttonWidth.toString()+'px; height:'+ buttonHeight.toString() + 'px"/></span>');

    var memoryValue = draw.foreignObject(width*0.1,height*0.05).x(width*0.7).y(height*0.88);
    memoryValue.add('<span id="memValueBox"><input class="memoryValue" id="memoryValue" type="number" style="width:'+buttonWidth.toString()+'px; height:'+ buttonHeight.toString() + 'px"/></span>');

    document.getElementById('memoryAddressSelect').addEventListener('change', updateMemoryInputValue);

    document.getElementById('memoryValue').addEventListener('keypress',function(event){
        if (event.key === "Enter"){
            event.preventDefault();
            inputValueToMemory();
        }
    });

}

// FUNCTION TO TAKE VALUE FROM THE INPUT BOX AND ADD IT TO MEMORY
function inputValueToMemory(){
    var updateValue = parseInt(document.getElementById('memoryValue').value);
    var memoryAddress = parseInt(document.getElementById('memoryAddressSelect').value);

    // REQUIRES UPDATEVALUE OT BE PARSED --- NEED TO CREATE PARSER FOR HEX, BIN AND DECIMAL
    if (updateValue > -1 && updateValue < (2**bitSize) -1){
        randomAccessMemory[parseInt(memoryAddress)] = parseInt(updateValue);
    }

    drawSimulator(draw,window.innerWidth,window.innerHeight);
}

// FUNCTION TO UPDATE MEMORY INPUT VALUE WHEN MEMORY ADDRESS SELECTED IS CHANGED
function updateMemoryInputValue(){
    var memoryAddress = parseInt(document.getElementById('memoryAddressSelect').value);

    document.getElementById('memoryValue').value = randomAccessMemory[memoryAddress];
}

// UPDATES VALUE OF REGISTER BASED ON WHAT IS PASSED TO IT
function updateRegister(passedArgs){
    sourceReg = passedArgs[0];
    destReg = passedArgs[1];
    operandTick = passedArgs[2];

    // SETTING THE VALUE OF THE DESTINATION REGISTER TO THE SOURCE REGISTER
    if (operandTick){
        destReg.setValue(sourceReg.getValue() % 2**(bitSize-opcodeSize));
    } else {
        destReg.setValue(sourceReg.getValue());
    }
    
    // REDRAWING THE SIMULATOR | FINISHED RUNNING QUEUE INDICATOR
    finRunningQueueObject();
}

// FUNCTION TO UPDATE THE MEMORY
function updateMemory(){
    var memoryAddress = mainAddressRegisterClass.getValue();
    var data = mainDataRegisterClass.getValue();
    
    randomAccessMemory[memoryAddress] = data;
    finRunningQueueObject();
}

// READS DATA VALUE FROM MEMORY TO MAIN DATA REGISTER
function readFromMemory(passedArgs){
    sourceMemoryValue = randomAccessMemory[mainAddressRegisterClass.getValue()];
    destinationRegister = mainDataRegisterClass;

    // SETTING VALUE OF MAIN DATA RAGISTER TO VALUE FROM MEMORY
    destinationRegister.setValue(sourceMemoryValue);

    // REDRAWING THE SIMULATOR | FINISHED RUNNING QUEUE INDICATOR
    finRunningQueueObject();
}

// FUNCTION TO INDICATE TO QUEUE THAT OBJECT HAS FINISHED RUNNING
function finRunningQueueObject(){
    drawSimulator(draw,window.innerWidth,window.innerHeight);
    queue[0].finishedRunning = true;
}

// TRANSLATING VALUE IN MEMORY TO OP CODE AND MEMORY ADDRESS
function translateValue(value){
    var returnString = "";

    var opcode = Math.floor(value/ (2**(bitSize-opcodeSize)) );
    var operand = value % 2**(bitSize-opcodeSize);

    switch(opcode){
        case 0:
            returnString += "HALT "
            break;
        case 1:
            returnString += "LOAD "
            break;
        case 2:
            returnString += "STORE "
            break;
        case 3:
            returnString += "ADD "
            break;
        case 4:
            returnString += "SUB "
            break;
        case 5:
            returnString += "BRANCH ZERO "
            break;
        case 6:
            returnString += "BRANCH > 0 "
            break;
        case 7:
            returnString += "unused "
            break;
    }

    returnString += operand.toString();

    return returnString;
}

// RUN FDE FROM CLICK
function runFDEClick(){
    if (queue.length == 0){
        addToQueue(FDE,[]);
    }
}

// RESET FDE FROM CLICK
function resetFDEClick(){
    var stepModeHoldState = stepMode;
    stepMode = true;
    if (queue.length > 0){
        while(queue[0].finishedRunning = false){
        };
    }

    while (queue.length != 0){
        queue.pop();
    }

    FDEReset();
    stepMode = stepModeHoldState;
}