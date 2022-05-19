// ARRAY OF SHAPE OBJECTS
// CONTAINS
//   TYPE        : TYPE OF SHAPE
//   shapeObject : SHAPE OBJECT 
const staticShapeArray = []; 
const pathArray = [];
var controlBusStrokeColour = "FFD700";
var busColour = "FFD700";
var ledOffColour = "F0F0F0";
var ledOnColour = "FF0000"
var backgroundRegisterColour = "E2E2E2";
var redColour = "FF0000"
var memoryAddressBoxValue = 0;
var simulatorRadix = 10;
var selectedExample = 0;

// EXAMPLE CODES STORED HERE
const examples = [
    [36,101,95,0,50,50],
    [63,123,95,60,157,92,168,192,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,1],
    [58,155,90,61,124,93,58,169,192,61,95,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,50,10,1,0]
];

// DRAWS A RECTANGLE OF GIVEN WIDTH, HEIGHT, XPOS, YPOS
// RETURNS TRUE IF THE RECTANGLE WAS DRAWN, FALSE IF NOT
function drawRectangle(draw,xPos,yPos,width,height,colourStr,shapeUse,roundEdges){
    var shapePush = {type:"rect",object:"",use:shapeUse};

    if (validatePos(xPos,yPos)){
        // CREATING THE RECTANGLE AND ADDING IT TO THE RECTANGLE ARRAY
        var rect = draw.rect(width,height).move(xPos,yPos).fill('#'+colourStr);
        if (roundEdges == true){
            rect.radius(20,20);
        }
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
    drawRectangle(draw,xPos,yPos,width,height,colourStr,shapeUse,true);
    if (title == "CONTROL UNIT"){
        draw.text(title).x(xPos+width*0.38).y(yPos+height*0.38);
    } else if (title == "CURRENT INSTRUCTION REGISTER"){
        var opcode = Math.floor(value/ (2**(bitSize-opcodeSize)));
        var operand = value % 2**(bitSize-opcodeSize);
        
        // DRAWING TITLE, OPCODE AND OPERAND TO REGISTER
        draw.text(title).x(xPos+10).y(yPos+height/5);
        draw.text(opcode.toString(simulatorRadix)).x(xPos+width/4-5).y(yPos+height*(3/5));
        draw.text(operand.toString(simulatorRadix)).x(xPos+width*3/4-5).y(yPos+height*(3/5));
    } else {
        draw.text(title).x(xPos+10).y(yPos+height/5);
        draw.text(padMemValue(value,simulatorRadix)).x(xPos+width/2-5).y(yPos+height*(3/5));
    }
}

// FUNCTION TO DRAW MEMORY ADDRESS
function drawMemoryAddress(draw,xPos,yPos,width,height,colourStr,memoryIndex,value,shapeUse){
    drawRectangle(draw,xPos,yPos,width,height,colourStr,shapeUse,true);
    draw.text("Mem Addr: "+ memoryIndex.toString()).x(xPos+10).y(yPos+height/5);
    draw.text("Val: " + padMemValue(value,simulatorRadix)).x(xPos+10).y(yPos+height*(2/5));
    draw.text(translateValue(value)).x(xPos+10).y(yPos+height*(3/5));
}

// FUNCTION TO PAD ZEROS OR 0x TO VALUE 
function padMemValue(value,simulatorRadix){
    var returnString = value.toString(simulatorRadix);

    // PADDING 0x or 0x0 TO HEXADECIMAL STRING
    if (simulatorRadix == 16){
        if (value < 16){
            returnString = "0x0" + returnString;
        } else {
            returnString = "0x" + returnString;
        }
    } 
    if (simulatorRadix == 2){
        while(returnString.length < bitSize){
            returnString = "0" + returnString;
        }
        returnString = returnString + "b";
    }
    return returnString;
}


// FUNCTION TO DRAW THE INFO BOX CONTAINING ALL OF THE OPCODES AND THEIR USES
function drawInfoBox(draw,xPos,yPos,width,height,colourStr){
    infoBoxData = [
        // - Halts Simulation Execution
        // - Loads data from given\n memory address
        // - Stores data to given\n memory adress
        // - Adds value at memory\n address to accumulator
        // - Subtracts value\n at memory address from accumulator
        //  - Branches to memory\n address if accumulator = 0
        // - Branches to memory\n address if accumulator = 0
        //
        {opcode:"000",information:"HALT"},
        {opcode:"001",information:"LOAD"},
        {opcode:"010",information:"STORE"},
        {opcode:"011",information:"ADD"},
        {opcode:"100",information:"SUBTRACT"},
        {opcode:"101",information:"BRANCH ZERO"},
        {opcode:"110",information:"BRANCH ALWAYS"},
        {opcode:"111",information:"unused"}
    ];
    drawRectangle(draw,xPos,yPos,width,height,colourStr,'infobox-background',true);

    draw.text("OPCODES").x(xPos+(width*0.1)).y(yPos+height*0.03);
    draw.text("INFORMATION").x(xPos+(width*0.4)).y(yPos+height*0.03);
    
    for (var tempI = 0; tempI < infoBoxData.length; tempI++){
        draw.text(infoBoxData[tempI].opcode).x(xPos+(width*0.2)).y(yPos+(height*0.9*(tempI+1))/8);
        draw.text(infoBoxData[tempI].information).x(xPos+(width*0.4)).y(yPos+(height*0.9*(tempI+1))/8);

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

    staticShapeArray[index].object.fill("#"+redColour);

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
        controlBusStrokeColour = busColour;
    } else {
        controlBusStrokeColour = redColour;
    }

    finRunningQueueObject();
}

// ANIMATES VALUE ON THE BUS
function animateValueOnBus(args){
    // GETTING VARIABLES FROM PASSED ARGS
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

    // CREATING GROUP OF CIRCLE AND TEXT
    var group = draw.group();
    group.add(circle);
    group.add(number);

    // CREATING MOVEMENT SIZE THAT WILL MOVE CIRCLE ALONG THE PATH IN 60 GOES
    var movementSpace = path.length()/refreshRate;

    // n IS POSITION ALONG THE PATH
    let n = 0;
    return function anim(timestamp){
        // GETS X AND Y COORDINATES OF POINT ON THE PATH AT GIVEN LENGTH n ALONG THE PATH
        let point = path.pointAt(n);
        // MOVES THE CIRCE TO THE POINT ON THE PATH 
        group.move(point.x - (group.width()/2), point.y - (group.height()/2) );
        n += movementSpace;

        // CHECKING IF THE CIRCLE HAS REACHED THE END OF THE PATH
        // IF TRUE IT REMOVES THE FUNCTION FROM THE QUEUE,
        // ELSE CONTINUES TO ANIMATE THE SHAPE ON THE PATH
        if (!( (group.x() + (group.width()/2)).toFixed(2) == (path.pointAt(999999999).x).toFixed(2) && (group.y() + (group.height()/2)).toFixed(2) == (path.pointAt(999999999).y).toFixed(2) )){
            requestAnimationFrame(anim);
        } else {

            drawSimulator(draw,window.innerWidth,window.innerHeight); 
            if (!(queue.length == 0)){
                queue[0].finishedRunning = true;
            }
        } 
    }
}

// DRAWING SIMULATOR FUNCTION
// DRAWING SIMULATOR WINDOW
function drawSimulator(draw,width,height){
    // DEFINING VARIABLES
    var busWidth = height/100;

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
    drawRectangle(draw,width*0.02,height*0.02,width*0.4,height*0.68,"00e541","cpu-background",true); // DRAWING BACKGROUND
    drawRegisterBox(draw,width*leftColumnX,height*programCounterY,width*leftColumnWidth,height*registerHeight,backgroundRegisterColour,"PROGRAM COUNTER",programCounterClass.getValue(),"cpu-pc"); // DRAWING PROGRAM COUNTER BOX
    drawRegisterBox(draw,width*rightColumnX,height*mainAddressRegisterY,width*rightColumnWidth,height*registerHeight,backgroundRegisterColour,"MAIN ADDRESS REGISTER",mainAddressRegisterClass.getValue(),"cpu-mar"); // DRAWING MAIN ADDRESS REGISTER BOX
    drawRegisterBox(draw,width*(rightColumnX*13/10),height*accumulatorY,width*(rightColumnWidth*(7/10)),height*registerHeight,backgroundRegisterColour,"ACCUMULATOR",accumulatorClass.getValue(),"cpu-acc"); // DRAWING ACCUMULATOR REGISTER BOX
    drawRegisterBox(draw,((width*rightColumnX)*1.5),height*mainDataRegisterY,width*rightColumnWidth/2,height*registerHeight,backgroundRegisterColour,"MAIN DATA REGISTER",mainDataRegisterClass.getValue(),"cpu-mdr"); // DRAWING MAIN DATA REGISTER BOX
    drawRegisterBox(draw,width*rightColumnX,height*currentInstructionRegisterY,width*rightColumnWidth,height*registerHeight,backgroundRegisterColour,"CURRENT INSTRUCTION REGISTER",currentInstructionRegisterClass.getValue(),"cpu-cir"); // DRAWING CURRENT INSTRUCTION REGISTER BOX
    drawRegisterBox(draw,width*rightColumnX,height*controlUnitY,width*rightColumnWidth,height*registerHeight,backgroundRegisterColour,"CONTROL UNIT",-1,"cpu-cir"); // DRAWING CURRENT INSTRUCTION REGISTER BOX
    drawInfoBox(draw, width*leftColumnX,height*infoBoxY,width*leftColumnWidth,height*0.5,backgroundRegisterColour); // DRAWING BOX CONTAINING INSTRUCTION INFO 

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
    drawBus(draw,width*0.42,height*0.08,width*0.58,height*0.08,busWidth,busColour,"buses-MAR","MAIN ADDRESS BUS");
    drawBus(draw,width*0.42,height*0.37,width*0.58,height*0.37,busWidth,busColour,"buses-MDR","MAIN DATA BUS");
    drawBus(draw,width*0.42,height*0.62,width*0.58,height*0.62,busWidth,controlBusStrokeColour,"buses-CB","CONTROL BUS");

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

    drawBus(draw,(width*(leftColumnWidth+leftColumnX)),(height*(programCounterY + (registerHeight)/2)),(width*(rightColumnX)),(height*(programCounterY + (registerHeight)/2)),busWidth,busColour,"buses-PCtoMAR","");
    drawBus(draw,(width*(rightColumnX + (rightColumnWidth)*(3/4))),(height*(mainDataRegisterY+registerHeight)),(width*(rightColumnX + (rightColumnWidth)*(3/4))),(height*currentInstructionRegisterY),busWidth,busColour,"buses-MDRtoCIR","");
    drawBus(draw,(width*(rightColumnX + (rightColumnWidth)*(3/4))),(height*(accumulatorY+registerHeight)),(width*(rightColumnX + (rightColumnWidth)*(3/4))),(height*mainDataRegisterY),busWidth,busColour,"buses-MDRtoACC","");
    drawBus(draw,(width*(rightColumnX + (rightColumnWidth)/2)),(height*(mainAddressRegisterY+registerHeight)),(width*(rightColumnX + (rightColumnWidth)/2)),(height*accumulatorY),busWidth,busColour,"buses-ACCtoMAR","");
    drawBus(draw,(width*(rightColumnX + (rightColumnWidth)*(2/5))),(height*(accumulatorY+registerHeight)),(width*(rightColumnX + (rightColumnWidth)*(2/5))),(height*currentInstructionRegisterY), busWidth, busColour,"buses-CIRtoACC","");
    drawBus(draw,(width*(rightColumnX + (rightColumnWidth)*(1/5))),(height*(mainAddressRegisterY+registerHeight)),(width*(rightColumnX + (rightColumnWidth)*(1/5))),(height*currentInstructionRegisterY),busWidth,busColour,"buses-CIRtoMAR","");

    // DRAWING MEMORY SIDE
    drawRectangle(draw,width*0.58,height*0.02,width*0.4,height*0.68,"a19400","memory-background",true);
    drawRectangle(draw,width*0.59,height*0.03,width*0.38,height*0.66,"e1e1e1","memory-background",true);
    // DRAWING MEMORY ADDRESSES
    for (var tempI = 0; tempI < randomAccessMemory.length; tempI++){
        memoryWidthStart = width*0.59;
        memoryHeightStart = height*0.03;
        memoryWidth = 0.38;
        memoryHeight = 0.66/(randomAccessMemory.length/4)

        drawMemoryAddress(draw,memoryWidthStart + ((memoryWidth*width/4)*(tempI%4)),memoryHeightStart+ (height*memoryHeight)*(Math.floor(tempI/4)),(memoryWidth*width/4),(height*memoryHeight),"b1b1b1",tempI,randomAccessMemory[tempI],"memory-address"+(tempI.toString()));
    }

    // DRAWING SWITCH INPUT
    var switchBoxHeight = 60 * (height/1007);
    var switchBoxWidth = 40 * (width/1920);
    var switchGap = 30 * (width/1920);
    var switchBackgroundColour = backgroundRegisterColour;
    var switchForegroundColour = "535353";
    var yPosSwitch = height*0.73;
    var switchBorderSize = 5;
    var switchHeight = (switchBoxHeight - switchBorderSize*2)/2;
    var switchWidth = (switchBoxWidth - switchBorderSize*2);
    var switchColour = "";

    for (var tempI = 0; tempI < bitSize; tempI++){
        // CREATING xPos OF EACH SWITCH
        var xPosSwitch = (width*0.1) + (tempI*switchBoxWidth) + (tempI*switchGap);

        // SETTING COLOUR OF SWITCH DEPENDING ON IF IT IS ON OR OFF
        if (switches[tempI] == 0){
            switchColour = "000000";
        } else {
            switchColour = "FF0000";
        }

        // DRAWING BACKGROUND, FOREGROUND, THEN SWITCH SQUARE
        drawRectangle(draw, xPosSwitch,yPosSwitch,switchBoxWidth,switchBoxHeight,switchBackgroundColour,"switchBackground-"+(tempI+1).toString(),false);
        drawRectangle(draw, xPosSwitch+switchBorderSize, yPosSwitch+switchBorderSize, switchBoxWidth-(switchBorderSize*2), switchBoxHeight-(switchBorderSize*2), switchForegroundColour,"switchForeground-"+(tempI+1).toString());

        // DRARWING SWITCH IN CORREST STATE
        drawRectangle(draw, xPosSwitch+switchBorderSize, yPosSwitch+switchBorderSize+(switchHeight * (1 - switches[tempI])), switchWidth, switchHeight, switchColour,"switch-"+(tempI+1).toString(), false);

        addSwitchClickEvent("switch-"+(tempI+1).toString());

    }

    // DRAWING LED OUTPUT 
    var ledRadius = width/1920 * 50;
    var ledGap = 30 * (width/1920);
    var ledHeight = 0.725;

    for (var tempI = 0; tempI < bitSize; tempI++){
        drawCircle(draw,(width*0.6) + (tempI*ledRadius) + (ledGap*tempI), height*ledHeight,ledRadius,ledOffColour,"led-"+(tempI+1).toString());
    }

    // DRAWING LED BUS
    var ledBusHeight = 0.73;

    for (var tempI = 0; tempI < bitSize; tempI++){
        var busX = width*0.6 + (ledRadius/2) + (ledRadius+ledGap)*tempI;
        var startY = height*ledHeight + ledRadius;
        var endY = height*ledBusHeight + ledRadius + busWidth;
        drawBus(draw,busX,startY,busX,endY,busWidth,busColour,"ledbus-"+(tempI+1).toString(),"");
    }
    
    // DRAWING BUS FROM MEMORY TO LEDS
    var endLedX = (width*0.6) + (ledRadius+ledGap)*bitSize;
    drawBus(draw,width*0.6 + ledRadius/2,height*ledBusHeight + ledRadius + ((busWidth)/2), endLedX,height*ledBusHeight + ledRadius + ((busWidth)/2), busWidth,busColour,"buses-LED","");
    drawBus(draw,endLedX,height*0.69,endLedX,height*ledBusHeight + ledRadius + busWidth,busWidth,busColour,"buses-LED2","");
    checkLEDS();

    // DRAWING USER INTERACTION BAR
    // SETTING SIZES OF BUTTONS  DPEENDING ON SCREEN SIZE
    drawRectangle(draw,0,height*0.8,width,height,"a2a2a2","userbar-background",true);

    var buttonWidth = 100 * (width/1920);
    var buttonHeight = 50 * (height/1007);
    // DRAWING RUN AND RESET BUTTONS
    var runButton = draw.foreignObject(width*0.1,height*0.05).x(width*0.03).y(height*0.84);
    var resetButton = draw.foreignObject(width*0.1,height*0.05).x(width*0.03).y(height*0.92);
    runButton.add('<span id="run"><button type="button" id="runButton" class="userButtons" style="width:'+buttonWidth.toString()+ 'px;height:'+ buttonHeight.toString() + 'px">RUN</button></span>');
    resetButton.add('<span id="reset"><button type="button" id="resetButton" class="userButtons" style="width:'+buttonWidth.toString()+'px; height:'+ buttonHeight.toString() + 'px">RESET</button></span>');

    // DRAWING STEP MODE CHECK AND STEP BUTTON
    var stepTickBox = draw.foreignObject(width*0.1,height*0.05).x(width*0.13).y(height*0.86);
    var nextStepBox = draw.foreignObject(width*0.1,height*0.05).x(width*0.13).y(height*0.92);

    // ADDING INPUT CHECKBOX AND STEP BUTTON
    stepTickBox.add('<span id="stepTickBox"><input type="checkbox" id="nextStepCheckBox" name="nextStepCheckBox"><label for="nextStepCheckBox">STEP MODE</label></span>');
    nextStepBox.add('<span id="nextStep"><button type="button" id="nextStep" class="userButtons" style="width:'+buttonWidth.toString()+ 'px;height:'+ buttonHeight.toString() + 'px">NEXT STEP</button></span>');

    // ADDING CHECK TO SEE IF STEPMODE IS TRUE OR FALSE, ADN THEN SETTING STEP TICK TO APPROPRIATE VALUE
    // ALSO ADDING HOOKS TO LISTEN FOR STEP MODE CHANGE AND
    // HOOK TO STEP BUTTON BEEN PRESSED
    checkStepMode();
    document.getElementById("nextStepCheckBox").addEventListener('change',updateStepMode);
    document.getElementById("nextStep").addEventListener('click',nextStepPressed);
    // ADDING HOOKS TO BUTTONS EVERY REDRAW
    // CHECKING FOR RUN AND RESET BUTTONS CLICK 
    document.getElementById('runButton').addEventListener("click", runFDEClick);
    document.getElementById('resetButton').addEventListener("click", resetFDEClick);

    // DRAWING RADIX SELECTION AREA
    draw.text("BASE SELECTION").x(width*0.22).y(height*0.84);
    var radixSelect = draw.foreignObject(width*0.1,height*0.1).x(width*0.22).y(height*0.86);
    radixSelect.add('<span id="radixSelect">'
    + '<select name="radixSelectTag" id="radixSelectTag">'
    + '<option id="binaryRadixSelect" value="binary">BINARY</option>'
    + '<option id="decimalRadixSelect" value="decimal">DECIMAL</option>'
    + '<option id="hexadecimalRadixSelect" value="hexadecimal">HEXADECIMAL</option>'
    + '</select></span');
    radixAddSelectedTag();

    // ADDING HOOK TO SELECT TO CHANGE RADIX OF SIMULATOR
    document.getElementById('radixSelectTag').addEventListener("change",updateRadix);

    // DRAWING EXAMPLES SELECTION AREA
    draw.text("LOAD EXAMPLES").x(width*0.32).y(height*0.84);
    var exampleSelect = draw.foreignObject(width*0.1,height*0.1).x(width*0.32).y(height*0.86)
    exampleSelect.add('<span id="exampleSelect">'
    + '<select name="exampleSelectTag" id="exampleSelectTag">'
    + '<option id="addTwoNumbersSelect" value="0">ADD TWO NUMS IN RAM</option>'
    + '<option id="multiplySelect" value="1">MULTIPLY 2 NUMS</option>'
    + '<option id="divideSelect" value="2">DIVIDE 2 NUMS</option>'
    + '</select></span');
    exampleAddSelectedTag();

    // DRAWING LOAD EXAMPLE BUTTON
    var exampleLoadButton = draw.foreignObject(width*0.1,height*0.05).x(width*0.32).y(height*0.92);
    exampleLoadButton.add('<span id="loadExample"><button type="button" id="loadExampleButton" class="userButtons" style="width:'+buttonWidth.toString()+ 'px;height:'+ buttonHeight.toString() + 'px">LOAD EXAMPLE</button></span>')

    // ADDING HOOK TO LOAD BUTTON
    document.getElementById('loadExampleButton').addEventListener("click",loadExample);

    // CREATING SPEED MODE TICK BOX
    var speedModeTickBox = draw.foreignObject(width*0.1,height*0.05).x(width*0.44).y(height*0.86);
    speedModeTickBox.add('<span id="speedModeTick"><input type="checkbox" id="speedModeTickBox" name="speedModeTickBox"><label for="speedModeTickBox">FAST EXECUTION</label></span>'); 
    checkSpeedMode();
    document.getElementById("speedModeTickBox").addEventListener('change',updateSpeedMode);


    // DRAWING CODE EDITOR 
    // DRAWING MEMORY ADDRESS SELECTOR INPUT BOX
    var selectMemoryAddress = draw.foreignObject(width*0.1,height*0.05).x(width*0.7).y(height*0.88);
    selectMemoryAddress.add('<span id="memAddrSelect"><input class="memoryAddressSelect" id="memoryAddressSelect" type="number" value="' + memoryAddressBoxValue.toString() + '" min=0 max="'+(2**(bitSize-opcodeSize)-1).toString()+'" style="width:'+buttonWidth.toString()+'px; height:'+ buttonHeight.toString() + 'px"/></span>');
    draw.text("MEMORY ADDRESS").x(width*0.7).y(height*0.86);

    // DRAWING MEMORY VALUE SELECTOR BOX
    var memoryValue = draw.foreignObject(width*0.1,height*0.05).x(width*0.8).y(height*0.88);
    memoryValue.add('<span id="memValueBox"><input class="memoryValue" id="memoryValue" value="' + randomAccessMemory[memoryAddressBoxValue].toString(simulatorRadix) + '" style="width:'+buttonWidth.toString()+'px; height:'+ buttonHeight.toString() + 'px"/></span>');
    draw.text("MEMORY VALUE").x(width*0.8).y(height*0.86);

    // ADDING HOOKS TO MEOMRY ADDRESS
    document.getElementById('memoryAddressSelect').addEventListener('change', updateMemoryInputValue);

    // CHECKING FOR ENTER BEEN PRESSED IN THE INPUT BOX 
    document.getElementById('memoryValue').addEventListener('keypress',function(event){
        if (event.key === "Enter"){
            event.preventDefault();
            inputValueToMemory();
        }
    });

}

// FUNCTION TO TAKE VALUE FROM THE INPUT BOX AND ADD IT TO MEMORY
function inputValueToMemory(){
    var updateValue = document.getElementById('memoryValue').value;
    var memoryAddress = parseInt(document.getElementById('memoryAddressSelect').value);
    memoryAddressBoxValue = memoryAddress;

    if (updateValue.slice(0,1) == "0x"){
        updateValue = parseInt(updateValue.slice(2,updateValue.length),16);
    } else if (updateValue.slice(updateValue.length-1,updateValue.length) == "b"){
        updateValue = parseInt(updateValue.slice(0,updateValue.length-1),2);
    } else if (Number.isInteger(updateValue)){
        updateValue=updateValue;
    }

    // REQUIRES UPDATEVALUE OT BE PARSED --- NEED TO CREATE PARSER FOR HEX, BIN AND DECIMAL
    if (updateValue > -1 && updateValue < (2**bitSize)){
        randomAccessMemory[parseInt(memoryAddress)] = parseInt(updateValue);
        if (memoryAddressBoxValue < (2**(bitSize-opcodeSize))-1){
            memoryAddressBoxValue += 1;
        }
    }

    drawSimulator(draw,window.innerWidth,window.innerHeight);
}

// FUNCTION TO UPDATE MEMORY INPUT VALUE WHEN MEMORY ADDRESS SELECTED IS CHANGED
function updateMemoryInputValue(){
    var memoryAddress = parseInt(document.getElementById('memoryAddressSelect').value);

    if (memoryAddress > 0 && memoryAddress < 2**(bitSize-opcodeSize)){
        document.getElementById('memoryValue').value = randomAccessMemory[memoryAddress].toString(simulatorRadix);
    } else {
        document.getElementById('memoryAddressSelect').value = 0;
    }
    
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
    if (!(queue.length == 0)){
        queue[0].finishedRunning = true;
    }
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
            returnString += "BRANCH ALWAYS "
            break;
        case 7:
            returnString += "unused "
            break;
    }

    returnString += operand.toString();

    return returnString;
}

// FUNCTION TO CHECK THE OUTPUT REGISTER VALUE AND CHANGE THE OUTPUT LEDS IF NEEDED
function checkLEDS(){
    // GETTING MEMORY ADDRESS
    // GETS VALEU FROM MEMORY ADDRESS AND CONVERTS IT TO BINARY
    var maxMemoryAddress = (2**(bitSize-opcodeSize))-1;
    var binaryValue = randomAccessMemory[maxMemoryAddress].toString(2);

    // PADDING ZEROS TO THE FRONT OF THE BINARY VALUE IF SHORTER THAN THE BITSIZE
    while (binaryValue.length < 8){
        binaryValue = "0" + binaryValue;
    }

    // ITERATING THROUGH EACH BINARY VALUE TO SEE IF IT IS 1 OR 0
    // IF 1, LED IS SET TO ON, ELSE LED IS SET TO OFF 
    for (var tempI = 0; tempI < binaryValue.length; tempI++){
        var binaryDigit = binaryValue[tempI];

        if (binaryDigit == "1"){
            setLedOnOff("led-"+(tempI+1).toString(),"on");
        } else {
            setLedOnOff("led-"+(tempI+1).toString(),"off");
        }
    }
}

// FUNCTION TO SET LED ON
function setLedOnOff(led,status){
    // GETS LED FROM STATIC SHAPE ARRAY
    const index = staticShapeArray.findIndex((element) => element.use === led);

    // SETS LED TO REQUIRED COLOUR TAKEN FROM status
    if (status == "on"){
        staticShapeArray[index].object.fill("#"+ledOnColour);
    } else {
        staticShapeArray[index].object.fill("#"+ledOffColour);
    }
    
}

// FUNCTION TO ADD CLCIK EVENT FOR SWITCHES
function addSwitchClickEvent(switchName){
    // GETTING SWITCH SHAPE FROM SHAPE ARRAY
    // GETTING NUMBER OF SWITCH
    var switchIndexInShapeArray = staticShapeArray.findIndex((element) => element.use === switchName);
    var switchNumber = parseInt(switchName.slice(switchName.length-1))-1;

    // GETTING THE SWITCH OBJECT WHICH WILL MOVE
    var switchObject = staticShapeArray[switchIndexInShapeArray].object;

    

    // SWITCH WILL CHANGE POSITION WHEN CLICKED
    switchObject.click(function(){
         if (switches[switchNumber] == 1){
            switches[switchNumber] = 0;
            setMemAddr30Value();
            drawSimulator(draw,window.innerWidth,window.innerHeight);
         } else {
            switches[switchNumber] = 1;
            setMemAddr30Value();
            drawSimulator(draw,window.innerWidth,window.innerHeight);
         }
    });
}

// SETTING THE VALEU OF MEMORY ADDRESS 30 TO THE ONE REPRESENTED BY THE SWITCHES
function setMemAddr30Value(){
    var switchesValue = 0;

    // ITERATING THROUGH SWITCHES, ADDING IF SWITCH IS HIGH
    for (var tempI = 0; tempI < bitSize; tempI++){
        switchesValue += (2**(bitSize-1-tempI))*switches[tempI];
    }

    // SETTING MEMORY ADDRESS
    randomAccessMemory[30] = switchesValue; 
}

// FUNCTION TO CHECK IF STEP MODE BOX IS TICKED
function checkStepMode(){
    var stepModeTickBoxChecked = document.getElementById("nextStepCheckBox");

    if (stepMode == true){
        stepModeTickBoxChecked.checked = true;
    } else {
        stepModeTickBoxChecked.checked = false;
    }
}

// FUNCTION TO UPDATE STEP MODE VALUE ON CLICK OF CHECK BOX 
function updateStepMode(){
    var stepModeTickBoxChecked = document.getElementById("nextStepCheckBox").checked;
    
    stepMode = stepModeTickBoxChecked;
}

// FUNCTION TO GO TO NEXT STEP
function nextStepPressed(){
    step = 1;
}

// FUNCTION TO CHECK IF SPEED MODE IS TICKED OR NOT
function checkSpeedMode(){
    var speedModeTickBoxChecked= document.getElementById("speedModeTickBox");

    if (speedMode == true){
        speedModeTickBoxChecked.checked = true;
    } else {
        speedModeTickBoxChecked.checked = false;
    }
}

// FUNCTION TO UPDATE SPEED MODE VALUE ON CLICK OF CHECK BOX
function updateSpeedMode(){
    var speedModeTickBoxChecked = document.getElementById("speedModeTickBox").checked;

    speedMode = speedModeTickBoxChecked;
}


// FUNCTION TO UPDATE RADIX OF SIMULATOR
function updateRadix(){
    var selectedRadix = document.getElementById("radixSelectTag").value;

    if (selectedRadix == "binary"){
        simulatorRadix = 2;
    } else if (selectedRadix == "decimal") {
        simulatorRadix = 10;
    } else {
        simulatorRadix = 16;
    }

    updateMemoryValueInputBox();

    drawSimulator(draw,window.innerWidth,window.innerHeight);
}

// FUNCTION TO UPDATE INPUT BOX FOR MEMORY VALUE WHEN RADIX IS CHANGED
function updateMemoryValueInputBox(){
    var currentMemoryAddress = parseInt(document.getElementById('memoryAddressSelect').value);
    document.getElementById('memoryValue').value = randomAccessMemory[currentMemoryAddress].toString(simulatorRadix);
}

// FUNCTION TO ADD SELECTED TAG TO OPTION OF DROPDOWN RADIX SET
function radixAddSelectedTag(){
    if (simulatorRadix == 2){
        document.getElementById("binaryRadixSelect").setAttribute('selected','selected');
    } else if(simulatorRadix == 10) {
        document.getElementById("decimalRadixSelect").setAttribute('selected','selected');
    } else {
        document.getElementById("hexadecimalRadixSelect").setAttribute('selected','selected');
    }
}

// FUNCTION TO LOAD EXAMPLE TO RAM BASED ON SELECTION
function loadExample(){
    // GETS VALUE FROM DROP DOWN SELECTION MENU
    // LOADS EXAMPLE TO RAM FROM PREMADE CODES
    var exampleSelection = document.getElementById('exampleSelectTag').value

    selectedExample = exampleSelection;

    // LOADING SELECTION TO RAM
    var exampleToLoad = examples[exampleSelection];

    for (var tempI = 0; tempI < exampleToLoad.length; tempI++){
        randomAccessMemory[tempI] = exampleToLoad[tempI];
    }

    // DRAWING SIMULATOR
    drawSimulator(draw, window.innerWidth, window.innerHeight);
}

// FUNCTION TO ADD SEELCTED TAG TO OPTION OF EXAMPLE LOAD DROP DOWN BOX
function exampleAddSelectedTag(){
    if (selectedExample == 1){
        document.getElementById("multiplySelect").setAttribute('selected','selected');
    } else if (selectedExample == 2){
        document.getElementById("divideSelect").setAttribute('selected','selected');
    } else {
        document.getElementById("addTwoNumbersSelect").setAttribute('selected','selected');
    }
}

// RUN FDE FROM CLICK
function runFDEClick(){
    if (queue.length == 0){
        addToQueue(FDE,[]);
    }
}

// RESET FDE FROM CLICK
function resetFDEClick(){
    FDEReset();

    // FIX FOR STEP MODE BUTTON ACTIVATING WHEN STEPMODE IS FALSE
    document.getElementById('nextStepCheckBox').checked = false;
}