let playerItem = document.getElementById("player")
let debug = document.getElementById("debug")


let playerVelocity = 0;
let x = 300;

var intervalID = setInterval(()=>{
    x = x + playerVelocity;
    if(x> 624) {x= -24}
    if(x< -24) {x= 624}
    playerItem.setAttribute("transform", `translate(${x} 710)`)
},10);


let runLeft = () =>{
    playerItem.setAttribute("class", "running ")
    playerVelocity = -2;
}

let runRight = () =>{   
    playerItem.setAttribute("class", "running right")
    playerVelocity = 2;
}

let stopRunning = () =>{
    playerItem.setAttribute("class", "standing")
    playerVelocity = 0;
}


document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);
document.addEventListener('mousedown', handleMouseDown);
document.addEventListener('mouseup', handleKeyUp);
document.addEventListener('touchstart', handleTouchStart);
document.addEventListener('touchend', handleKeyUp);

document.addEventListener('long-press', function(e) {
    e.preventDefault();
  });

let currentKey = null

function handleMouseDown(e) {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    let pos = e.clientX/vw;
    if(pos >= 0.5){
        runRight()
    } else{
        runLeft()
    }
}

function handleTouchStart(e) {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    let pos = e.touches[0].pageX/vw;
    if(pos >= 0.5){
        runRight()
    } else{
        runLeft()
    }
}

function handleKeyDown(e) {
    if(e.code !== currentKey){
        currentKey = e.code;
        switch (e.code){
            case "ArrowRight":
                runRight()
            break
            case "ArrowLeft":
                runLeft()
            break
        }
    }   
}

function handleKeyUp(e) {
    currentKey = null;
    stopRunning()
}