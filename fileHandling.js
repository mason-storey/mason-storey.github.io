// FILE DORPPING HERE
async function loadFile(event){
    event.preventDefault();
    const input = event.target

    var filesDropped = event.dataTransfer.files;
    var file = filesDropped[0];
    var textFromFile = await file.text();

    lineArray = textFromFile.split("\r\n")
    for (var tempInt = 0; tempInt < lineArray.length;tempInt++){
        if (Number.isInteger(parseInt(lineArray[tempInt]))){
            if (lineArray[tempInt] > -1 && lineArray[tempInt] < (2**bitSize)-1){
                randomAccessMemory[tempInt] = parseInt(lineArray[tempInt]);
            } else {
                randomAccessMemory[tempInt] = 0;
                console.log("code error on line " + tempInt);
            }   
        } else {
            randomAccessMemory[tempInt] = 0;
            console.log("code error on line " + tempInt);
        }
    }

    while (randomAccessMemory.length > 32){
        randomAccessMemory.pop();
    }

    drawSimulator(draw,window.innerWidth,window.innerHeight);
}

// REMOVING DEFAULT BROWSER DROP AND OPEN TEXT FILE 
function removeDefaultDropFunctions(){
    window.addEventListener("dragover",function(e){
        e = e || event;
        e.preventDefault();
      },false);
      window.addEventListener("drop",function(e){
        e = e || event;
        e.preventDefault();
      },false);
}