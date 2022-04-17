document.addEventListener("DOMContentLoaded", onLoad)
var frameCounter = 0;
var player;
var world; //This is that "Center" object
function onLoad(){
    player = document.querySelector(".object")
    player.posx = 0
    player.posy = 0
    setInterval(gameLoop,16)
}
function gameLoop()
{
    frameCounter += 1

    player.posx += input.horizontal
    player.posy += input.vertical
    player.style.left = player.posx + "px"
    player.style.top = -player.posy + "px" 
    //console.log(`Frame : ${frameCounter}, ${player.posx}, ${input.vertical}`)
    frameCounter +=1
    //player.style.top = frameCounter + "px";
    
}
