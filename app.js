
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
    label = document.getElementById("label")
    
    player.velocity = new Vec2(0,0)
    player.special = 1;
    let deadlyObj = document.createElement("div")
    deadlyObj.classList.add("object")
    deadlyObj.classList.add("popIn")
    let prompt = window.prompt("Enter box spawn count. Defaults to 2000 if NaN")
    prompt = parseInt(prompt)
    let circle = false
    player.collider = new Collider(new Circle(3), new Vec2(0,0))
    player.collider.onCollision = () => {label.textContent = "Colliding!"; label.style.backgroundColor = "#00ff00aa" }
    for (let i = 0; i < (prompt || 150); i++) {
        circle = Math.random() > 0.5
        let clone = deadlyObj.cloneNode()
        if(circle)
        {
            clone.classList.add("circle")
            let pos = new Vec2(Random(-800,800), Random(-370,350))
            let rad = Random(20, 50)
            clone.style.top = (-pos.y - rad) + "px"
            clone.style.left = (pos.x - rad) + "px"
            clone.style.height = 2 * rad + "px" //y-coords in html just had to be wierd and stupid
            clone.style.width = 2 * rad + "px"
            clone.collider = new Collider(new Circle(rad), pos)
            clone.collider.onCollision = () => {clone.collider.destructor(); clone.remove();}
            world.appendChild(clone)
        }
        else
        {
            let min = new Vec2(Random(-800,800), Random(-370,350)) //Create a min
            let max = new Vec2(Random(20,200) + min.x, Random(20,200) + min.y)
            clone.style.top = -max.y + "px"
            clone.style.left = min.x + "px"
            clone.style.height = (max.y - min.y) + "px" //y-coords in html just had to be wierd and stupid
            clone.style.width = (max.x - min.x) + "px"
            clone.collider = new Collider(new AlignedBox(min, max), new Vec2(0,0)) 
            clone.collider.onCollision = () => {clone.collider.destructor(); clone.remove();}
            world.appendChild(clone) 
        }
        
    }
    setInterval(gameLoop,0)
}

function gameLoop()
{
    label.textContent = `Not Colliding\n ${player.collider.pos.x}\n${player.collider.pos.y}`
    label.style.backgroundColor = "#ff0000aa"
    frameCounter += 1
    
    world.style.top = ((window.innerHeight / 2) + player.collider.pos.y) + "px";
    world.style.left = -(-(window.innerWidth / 2) + player.collider.pos.x) + "px";
    let inputVector = new Vec2(Input.horizontal, Input.vertical)
    let normalize = inputVector.Dist()
    normalize *= 1.5
    if(normalize != 0) { inputVector.x /= normalize; inputVector.y /= normalize; }
    player.velocity.AddSelf(inputVector)
    player.velocity.x /= 1.06
    player.velocity.y /= 1.06
    player.collider.pos.AddSelf(player.velocity)
    playerSVG.style.transform = `rotate(${(Math.atan2(player.velocity.y, player.velocity.x) * -180 / Math.PI) - 90}deg)`
    console.log(player.style.transform)
    player.style.left = player.collider.pos.x + "px"
    player.style.top = -player.collider.pos.y + "px" 
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
    //console.log(`Frame : ${frameCounter}, ${player.posx}, ${input.vertical}`)
    //player.style.top = frameCounter + "px";
    Collision.runDetection()
    
}
