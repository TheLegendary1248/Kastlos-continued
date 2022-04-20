
document.addEventListener("DOMContentLoaded", onLoad)
var frameCounter = 0;
var player;
var world; //This is that "Center" object
var label;
function onLoad(){
    player = document.querySelector(".object")
    world = document.getElementById("center")
    label = document.getElementById("label")
    player.collider = new Collider(new AlignedBox(new Vec2(-2,-2), new Vec2(2,2)), new Vec2(0,0))
    player.xVel = 0;
    player.yVel = 0;
    player.collider.onCollision = () => {label.textContent = "Colliding!"; label.style.backgroundColor = "#00ff00aa" }
    let deadlyBox = document.createElement("div")
    deadlyBox.classList.add("deadlyBox")
    let prompt = window.prompt("Enter box spawn count. Defaults to 2000 if NaN")
    prompt = parseInt(prompt)
    console.log(prompt)
    for (let i = 0; i < (prompt || 2000); i++) {
        
        let min = new Vec2(Random(-800,800), Random(-370,350)) //Create a min
        let max = new Vec2(Random(4,20) + min.x, Random(4,20) + min.y)
        let clone = deadlyBox.cloneNode()
        clone.style.top = -max.y + "px"
        clone.style.left = min.x + "px"
        clone.style.height = (max.y - min.y) + "px" //y-coords in html just had to be wierd and stupid
        clone.style.width = (max.x - min.x) + "px"
        clone.collider = new Collider(new AlignedBox(min, max), new Vec2(0,0)) 
        world.appendChild(clone) 
    }
    setInterval(gameLoop,0)
}
function Random(a, b)
{
    return (Math.random() * (b - a)) + a
}
function gameLoop()
{
    label.textContent = "Not Colliding"
    label.style.backgroundColor = "#ff0000aa"
    frameCounter += 1
    world.style.top = ((window.innerHeight / 2) + player.collider.pos.y) + "px";
    world.style.left = -(-(window.innerWidth / 2) + player.collider.pos.x) + "px";
    player.xVel += input.horizontal / 2
    player.yVel += input.vertical / 2
    player.xVel /= 1.08
    player.yVel /= 1.08
    player.collider.pos.x += player.xVel
    player.collider.pos.y += player.yVel
    player.style.left = player.collider.pos.x + "px"
    player.style.top = -player.collider.pos.y + "px" 
    //console.log(`Frame : ${frameCounter}, ${player.posx}, ${input.vertical}`)
    //player.style.top = frameCounter + "px";
    Collision.runDetection()
    
}
