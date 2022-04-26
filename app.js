//Element that's supposed to contain the entire window
var main;
//Not sure now this one's purpose
var frameCounter = 0;
//The player element
var player;
//The player's SVG element, used for rotation
var playerSVG;
//The world element, effectively acting as a camera as it can move every child element of it
var world; 
//Start timestamp. A Date object
var startTime;
//The timer HTML element
var timer;
//The id of the game's interval callback
var intervalId;
//The score HTML element
var scoreContainer;
//The id of the object spawner interval callback
var objectInterval;
//The title HTML element
var title;
const gameLoop = //A sort of homebrewed event system, calling every callback attached to the 'dict' object
{
    dict: {},
    currentId: 0,
    /**
     * Adds a callback that'll be called every frame in the game
     * @param {Function} e 
     * @returns {Number} Id of the callback. Use it to remove the callback later
     */
    addCallback(e)
    {
        this.dict[this.currentId] = e
        return this.currentId++
    },
    /**
     * Removes the callback that was attached using the opposite function
     * @param {Number} e 
     */
    removeCallback(e)
    {
        delete this.dict[e]
    },
    /**
     * Called every gameloop
     */
    callFrame()
    {
      Object.keys(this.dict).forEach((e) => this.dict[e]())  
    }
}
function onLoad(){
    //Get elements on load
    main = document.getElementById("main")
    main.classList.add("start")
    title = document.getElementById("title")
    title.classList.add("fadeTitle")
    scoreContainer = document.getElementById("scoreContainer")
    timer = document.getElementById("timer")
    player = document.getElementById("player")
    playerSVG = document.getElementById("playerSVG")
    world = document.getElementById("center")
    world.pos = new Vec2(0,0)
    label = document.getElementById("label")
    //Setup the player
    player.velocity = new Vec2(0,0)
    player.special = 1;
    player.collider = new Collider(new Circle(3), new Vec2(0,0))
    player.collider.onCollision = gameOver
    //Start the gameloop
    intervalId = setInterval(mainLoop,8)
    Spawn()
    objectInterval = setInterval(Spawn, 5000)
    //Get start time of the game
    startTime = new Date().getTime();
}
let objCount = 10
let wave = 0
function Spawn()
{
    //Very basic spawning algorithm
    let circle = false;
    objCount += wave * 0.7
    for (let i = 0; i < objCount; i++) {
        circle = Math.random() > 0.5
        let pos = new Vec2(Random(-750,750), Random(-750,750))
        //Set a velocity on Waves 2+
        let vel
        if(wave > 2) vel = new Vec2(Random(-2,2), Random(-2,2))
        let delay
        //Set a delay on the velocity on Waves 4+
        if(wave > 4) delay = Random(500, 4000)
        if(circle)
        {
            //Randomize values for the circle
            let pos = new Vec2(Random(-1000,1000), Random(-1000,1000))
            let rad = Random(10, 30)
            Delay(Random(0, 2000)).then(() => new PopIn(new Circle(rad), pos, vel, delay))
        }
        else
        {
            //Randomize values for the rectangle
            let min = new Vec2(Random(-50,-25), Random(-50,-25)) //Create a min
            let max = new Vec2(Random(25,50), Random(25, 50))
            Delay(Random(0, 2000)).then(() => new PopIn(new AlignedBox(min, max), pos, vel, delay))
        }
    }
    console.log(++wave)
    console.log(objCount)
}
function mainLoop()
{
    //Update timer
    //https://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript Ty so much ppl of the internet
    let nowTime = new Date().getTime() - startTime;
    timer.textContent = `${Math.floor((nowTime % 3600000) / 60000)}m: ${('00' + Math.floor((nowTime % 60000) / 1000)).slice(-2)}s; ${('0000' + (nowTime % 1000)).slice(-3)}ms`;
    //Collision Detection Label
    /*
    label.textContent = `Not Colliding\n ${player.collider.pos.x}\n${player.collider.pos.y}`
    label.style.backgroundColor = "#ff0000aa"
    */
    frameCounter += 1
    //Set the world position. This pretty much acts as the camera now...
    newWorldPos = new Vec2(-(-(window.innerWidth / 2) + player.collider.pos.x) ,((window.innerHeight / 2) + player.collider.pos.y))
    world.pos = Vec2.Lerp(world.pos, newWorldPos, 0.1)
    world.style.top = world.pos.y + "px";
    world.style.left = world.pos.x + "px";
    //Input speed for the player
    let inputVector = new Vec2(Input.horizontal, Input.vertical)
    let normalize = inputVector.Dist()
    normalize *= 1.5 //Multiple to get a desired 'force'
    if(normalize != 0) { inputVector.x /= normalize; inputVector.y /= normalize; } //This avoids the divide by zero problem
    player.velocity.AddSelf(inputVector)
    //Simulate inertia
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
            DashImpact(player.collider.pos)
            player.collider.pos.AddSelf(new Vec2(player.velocity.x / dist, player.velocity.y / dist)) 
            Delay(1500).then(() => {player.special = 1;})
        }
    }
    //If the player is outside the boundary
    if(player.collider.pos.SqrDist() > (750 ** 2)) gameOver()
    //Misc loop
    gameLoop.callFrame()
    Collision.runDetection()
}
function gameOver()
{
    console.log(Collision.objects.length)
    //Add classes to trigger animations
    world.classList.add("worldGameOver")
    scoreContainer.classList.add("scoreGameOver")
    //Clear the interval callbacks
    clearInterval(intervalId)
    clearInterval(objectInterval)
}
