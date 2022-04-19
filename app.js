
document.addEventListener("DOMContentLoaded", onLoad)
var frameCounter = 0;
var player;
var world; //This is that "Center" object
function onLoad(){
    player = document.querySelector(".object")
    player.collider = new Collider(new AlignedBox(new Vec2(-10,-10), new Vec2(10,10)), new Vec2(0,0))
    let empty = new Collider(new AlignedBox(new Vec2(50,50), new Vec2(100,100)), new Vec2(0,0)) 
    setInterval(gameLoop,1)
}
function gameLoop()
{
    frameCounter += 1

    player.collider.pos.x += input.horizontal * 5
    player.collider.pos.y += input.vertical * 5
    player.style.left = player.collider.pos.x + "px"
    player.style.top = -player.collider.pos.y + "px" 
    //console.log(`Frame : ${frameCounter}, ${player.posx}, ${input.vertical}`)
    frameCounter +=1
    //player.style.top = frameCounter + "px";
    Collision.runDetection()
    
}
