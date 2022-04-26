//Pre-create a div element to be used in the following functions
let div = document.createElement("div")
div.classList.add("object")
//This script contains functions for spawning objects into the game
class PopIn{
    /**
     * Creates a simple pop-in object
     * @param {ColliderShape} shape The collider shape the pop in takes on 
     * @param {Vec2} pos The position of the collider
     * @param {Vec2} velocity The velocity of the pop in
     * @param {Number} delay The delay in time before the pop in moves
     */
    constructor(shape, pos, velocity, delay)
    {
        this.clone = div.cloneNode();
        this.pos = pos;
        //Removes the need for 'this' here
        let clone = this.clone;
        clone.classList.add("popIn")
        //Shape adjustment
        /*
        In HTML, the position of an element starts from the top left
        This means for a circle, we need to offset by the radius to get the center
        And to offset by the corresponding corner for boxes
        */
        if(shape.type == "Circle")
        {
            clone.classList.add("circle")
            clone.style.top = (-pos.y - shape.radius) + "px"
            clone.style.left = (pos.x - shape.radius) + "px"
            clone.style.height = 2 * shape.radius + "px" //y-coords in html just had to be wierd and stupid
            clone.style.width = 2 * shape.radius + "px"
        }
        else
        {
            clone.style.top = -(shape.max.y + pos.y) + "px"
            clone.style.left = (shape.min.x + pos.x) + "px"
            clone.style.height = (shape.max.y - shape.min.y) + "px" //y-coords in html just had to be wierd and stupid
            clone.style.width = (shape.max.x - shape.min.x) + "px"
        }
        //If a velocity was specified, add it as a property
        if(velocity)
        {
            this.velocity = velocity
            //Add the Move function to the game loop
            if(delay) //And if a delay was specified, add it via promise
                Delay(delay).then(() =>
                    {
                        this.callId = gameLoop.addCallback(() => {this.Move()})
                    } 
                )
            else this.callId = gameLoop.addCallback(() => {this.Move()})
            Delay(7600).then(() => {this.Remove()})
        }
        this.collider = new Collider(shape, pos, false)
        //Set the collider to enable precisely when the css animation colors the div black
        Delay(2000).then(() => {this.collider.enabled = true;})
        //Set the collider to destroy precisely when the css animation fades out
        Delay(7600).then(() => {this.collider.destructor();})
        //The destroy when the animation finishes
        Delay(8000).then(() => {this.clone.remove();})
        world.appendChild(clone)
    }
    //Attached to game loop to use velocity
    Move()
    {
        this.pos.AddSelf(this.velocity)
        let shape = this.collider.shape
        let pos = this.pos
        if(this.collider.shape.type == "Circle")
        {
            this.clone.style.top = (-pos.y - shape.radius) + "px"
            this.clone.style.left = (pos.x - shape.radius) + "px"
        }
        else
        {
            this.clone.style.top = -(shape.max.y + pos.y) + "px"
            this.clone.style.left = (shape.min.x + pos.x) + "px"
        }
    }
    Remove() {gameLoop.removeCallback(this.callId)}
}
/**
 * Creates the dash impact effect
 * @param {Vec2} pos 
 */
function DashImpact(pos)
{
    let clone = div.cloneNode()
    clone.classList.add("dashImpact")
    clone.style.top = -pos.y + "px"
    clone.style.left = pos.x + "px"
    clone.style.height = "10px"
    clone.style.width = "10px"
    world.appendChild(clone)
    Delay(500).then(() => {clone.remove();})
}
function Slash()
{

}
