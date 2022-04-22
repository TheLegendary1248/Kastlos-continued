
document.addEventListener("DOMContentLoaded", onLoad)
var frameCounter = 0;
var player;
var playerSVG;
var world; //This is that "Center" object
var label;
function onLoad(){
    player = document.getElementById("player")
    playerSVG = document.getElementById("playerSVG")
    world = document.getElementById("center")
    world.pos = new Vec2(0,0)
    label = document.getElementById("label")
    player.velocity = new Vec2(0,0)
    player.special = 1;
    let deadlyObj = document.createElement("div")
    deadlyObj.classList.add("object")
    deadlyObj.classList.add("popIn")
    let prompt = window.prompt("Enter box spawn count. Defaults to 500 if NaN")
    prompt = parseInt(prompt)
    let circle = false
    player.collider = new Collider(new Circle(3), new Vec2(0,0))
    player.collider.onCollision = () => {label.textContent = "Colliding!"; label.style.backgroundColor = "#00ff00aa" }
    for (let i = 0; i < (prompt || 500); i++) {
        circle = Math.random() > 0.5

        if(circle)
        {
            let pos = new Vec2(Random(-1000,1000), Random(-1000,1000))
            let rad = Random(20, 50)
            Delay(Random(0, 20000)).then(() => new PopIn(new Circle(rad), pos))
        }
        else
        {
            let min = new Vec2(Random(-100,-50), Random(-100,-50)) //Create a min
            let max = new Vec2(Random(50,100), Random(50, 100))
            let pos = new Vec2(Random(-1000,1000), Random(-1000, 1000))
            Delay(Random(0, 20000)).then(() => new PopIn(new AlignedBox(min, max), pos))
        }
        
    }
    setInterval(gameLoop,0)
}

function gameLoop()
{
    //Collision Detection Label
    label.textContent = `Not Colliding\n ${player.collider.pos.x}\n${player.collider.pos.y}`
    label.style.backgroundColor = "#ff0000aa"
    frameCounter += 1
    //Set the world position. This pretty much acts as the camera now...
    newWorldPos = new Vec2(-(-(window.innerWidth / 2) + player.collider.pos.x) ,((window.innerHeight / 2) + player.collider.pos.y))
    world.pos = Vec2.Lerp(world.pos, newWorldPos, 0.1)
    world.style.top = world.pos.y + "px";
    world.style.left = world.pos.x + "px";
    //Input speed for the player
    let inputVector = new Vec2(Input.horizontal, Input.vertical)
    let normalize = inputVector.Dist()
    normalize *= 1.5
    if(normalize != 0) { inputVector.x /= normalize; inputVector.y /= normalize; }
    player.velocity.AddSelf(inputVector)
    player.velocity.x /= 1.06
    player.velocity.y /= 1.06
    player.collider.pos.AddSelf(player.velocity)
    //Rotate player to direction of velocity
    playerSVG.style.transform = `rotate(${(Math.atan2(player.velocity.y, player.velocity.x) * -180 / Math.PI) - 90}deg)`
    player.style.left = player.collider.pos.x + "px"
    player.style.top = -player.collider.pos.y + "px" 
    //Dash the player if possible and spacebar is pressed
    if(player.special) 
    { 
        if(Input.fire) 
        {
            player.special = 0; 
            let dist = player.velocity.Dist();
            dist /= 200
            player.collider.pos.AddSelf(new Vec2(player.velocity.x / dist, player.velocity.y / dist)) 
            Delay(1500).then(() => {player.special = 1;})
        }
    }
    Collision.runDetection()
    
}
