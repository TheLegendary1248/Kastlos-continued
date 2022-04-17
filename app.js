document.addEventListener("DOMContentLoaded", onLoad)
var frameCounter = 0;
var player;
var world; //This is that "Center" object
function onLoad(){
    player = document.querySelector(".object")
    player.x = 0
    player.y = 0
    setInterval(gameLoop,16)
}
function gameLoop()
{
    frameCounter += 1

    player.x += input.horizontal
    player.y += input.vertical
    player.style.left = player.x + "px"
    player.style.top = -player.y + "px" 
    console.log(`Frame : ${frameCounter}, ${input.horizontal}, ${input.vertical}`)
    frameCounter +=1
    //player.style.top = frameCounter + "px";
    
}
