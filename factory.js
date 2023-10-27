//Pre-create a div element to be used in the following functions
let div = document.createElement("div")
div.classList.add("object")
//This script contains functions for spawning objects into the game
class PopIn{
    /**
     * Creates a simple pop-in object. Warning: parameters are not cloned and will be used by reference
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
                        this.callId = gameLoop.addCallback(() => {this.Move();})
                    } 
                )
            else this.callId = gameLoop.addCallback(() => {this.Move();})
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
        //console.log(this)
    }
    //Attached to game loop to use velocity
    Move()
    {
        //console.log(this.callId)
        this.pos.AddSelf(this.velocity)
        if(this.collider.shape.type == "Circle")
        {
            this.clone.style.top = (-this.pos.y - this.collider.shape.radius) + "px"
            this.clone.style.left = (this.pos.x - this.collider.shape.radius) + "px"
        }
        else
        {
            this.clone.style.top = -(this.collider.shape.max.y + this.pos.y) + "px"
            this.clone.style.left = (this.collider.shape.min.x + this.pos.x) + "px"
        }
        //console.log(this.pos)
    }
    Remove() {gameLoop.removeCallback(this.callId)}
}
/**
 * This class will automatically change the velocity of the given object to face the player
 */
class Homing{

}
//
/**
 * This class will change the velocity of the given object to face the player when within a growing distance from the player
 */
class StalledRebound{
    constructor(obj){

    }
}
/**
 * This class will automatically change the velocity of a given object to face the player until it reaches a max velocity
 */
class HomeToMaxVel{

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
//!!!!!!!!!!!!!!!!USE AN 'OPTIONS' OBJECT FUTURE ME!!!!!!!!!!!!!!!!!!!!!
/**
 * Produces a cage from four box pop-ins
 * @param {Vec2} size Size of the cage
 * @param {Number} width Width of the cage border INWARDS
 * @param {Vec2} pos Position of the cage
 * @param {Array<Boolean>} boolArr An array of booleans telling which walls of the cage should exist, in clockwise order
 * @param {Vec2} vel The speed of the cage's walls, corresponding to their side
 * @param {Boolean} mirror If true, each wall will instead mirror the velocity, originating with the top wall
 */
function Cage(size, width, pos, boolArr, vel, mirror)
{
    //Top
    if(boolArr ? boolArr[0] : true) 
    {   
        new PopIn(
        new AlignedBox(new Vec2(pos.x - size.x, pos.y + size.y - width), new Vec2(pos.x + size.x, pos.y + size.y)), 
        pos.Clone(),
        vel ? (mirror ? vel.Clone() : new Vec2(0, vel.y)) : null)
    }
    //Bottom
    if(boolArr ? boolArr[2] : true) 
    {
        new PopIn(
        new AlignedBox(new Vec2(pos.x - size.x, pos.y - size.y), new Vec2(pos.x + size.x, pos.y - size.y + width)), 
        pos.Clone(),
        vel ? (mirror ? new Vec2(-vel.x, -vel.y) : new Vec2(0, -vel.y)) : null)
    }
    //Left
    if(boolArr ? boolArr[3] : true) 
    {
        new PopIn(
        new AlignedBox(new Vec2(pos.x - size.x, pos.y - size.y), new Vec2(pos.x - size.x + width, pos.y + size.y)), 
        pos.Clone(),
        vel ? (mirror ? new Vec2(-vel.y, vel.x) : new Vec2(-vel.x, 0)) : null)
    }
    //Right
    if(boolArr ? boolArr[1] : true)
    {
        new PopIn(
        new AlignedBox(new Vec2(pos.x + size.x - width, pos.y - size.y), new Vec2(pos.x + size.x, pos.y + size.y)), 
        pos.Clone(),
        vel ? (mirror ? new Vec2(vel.y, -vel.x) : new Vec2(vel.x, 0)) : null)
    }
}
/**
 * Recursively creates cages
 * @param {Number} steps Number of steps this function should take
 * @param {Number} interval Delay between steps
 * @param {Vec2} sizeStart Base size cage
 * @param {Vec2} sizeStep The sizes of following cages
 * @param {Number} width The width of the cages
 * @param {Vec2} pos Center position
 * @param {Function} boolFunc A function that takes two arguments(wall, step) and returns a boolean. Walls are represented in their clockwise order {top: 0, right: 1, bottom: 2, left: 3}
 * @param {Vec2} vel 
 * @param {Boolean} mirror 
 */
function RecursiveCage(steps, interval, sizeStart, sizeStep, width, pos, boolFunc, vel, mirror)
{
    for (let i = 0; i <= steps; i++) {
        Delay(interval * i).then(() =>
        {
            Cage(Vec2.Add(sizeStart, Vec2.Scale(sizeStep, i)), 
            width,
            pos.Clone(),
            [boolFunc(i,0),boolFunc(i,1),boolFunc(i,2),boolFunc(i,3)],
            vel,
            mirror)
        })
    }
}
/**
 * Creates a ring of circles that move tangent to the ring
 * @param {Vec2} pos Position of the ring center
 * @param {Number} count Number of circles that make up the ring
 * @param {Number} offset Offset the circles are from the ring
 * @param {Number} speed Speed of the circles
 * @param {Number} ringSize Size of the ring
 * @param {Number} circleSize Size of the circles
 */
function CircleRing(pos, count, offset, speed, ringSize, circleSize)
{
    for (let i = 0; i <= count; i++) {
        let angleInterval = (i / count) * Math.PI * 2 
        let ringOff = new Vec2(Math.sin(angleInterval), Math.cos(angleInterval))
        new PopIn(
            new Circle(circleSize),
            Vec2.Add(Vec2.Add(pos, Vec2.Scale(ringOff, ringSize)), Vec2.Scale(new Vec2(-ringOff.y, ringOff.x),offset)),
            Vec2.Scale(new Vec2(-ringOff.y, ringOff.x), speed)
        )
    }
}
/**
 * Creates a ring of circles that move tangent to the ring
 * @param {Vec2} pos Position of the ring center
 * @param {Number} count Number of circles that make up the ring
 * @param {Number} offset Offset the circles are from the ring
 * @param {Number} speed Speed of the circles
 * @param {Number} ringSize Size of the ring
 * @param {Number} circleSize Size of the circles
 * @param {Number} ringSizeStep The increment of the ring size
 * @param {Number} Interval The interval of time between spawns
 */
function Spiral(pos, count, ringSize, ringSizeStep, circleSize, interval, speed, offset, angleStart, angleInterval)
{
    for (let i = 0; i <= count; i++) {
        let angle = angleStart + (i * angleInterval) 
        let ringOff = new Vec2(Math.sin(angle), Math.cos(angle))
        if(interval) Delay(interval * i).then(() => 
            { new PopIn(
                new Circle(circleSize),
                Vec2.Add(Vec2.Add(pos, Vec2.Scale(ringOff, ringSize + (i * ringSizeStep))), Vec2.Scale(new Vec2(-ringOff.y, ringOff.x),offset)),
                Vec2.Scale(new Vec2(-ringOff.y, ringOff.x), speed)); 
            }
        )
        else 
            new PopIn(
                new Circle(circleSize),
                Vec2.Add(Vec2.Add(pos, Vec2.Scale(ringOff, ringSize + (i * ringSizeStep))), Vec2.Scale(new Vec2(-ringOff.y, ringOff.x),offset)),
                Vec2.Scale(new Vec2(-ringOff.y, ringOff.x), speed)
            )
    }
}
/**
 * Punches out a grid of equally sized blocks
 * @param {Vec2} pos Position of the grid
 * @param {Number} size Size of the grid 
 * @param {Number} dices Number of times to slice the grid, on both axis 
 * @param {Number} interval Time between punches
 */
function GridPunch(pos, size, dices, interval){
    let min = new Vec2(pos.x - size, pos.y - size)
    let max = new Vec2(pos.x + size, pos.y + size)
    let grid = new Array(dices ** 2)
    for(let p = 0; p < dices ** 2; p++)
    {
        grid[p] = {x: p % dices, y: Math.floor(p / dices)}
    }
    shuffle(grid)
    for(let p = 0; p < dices ** 2; p++)
    {
        Delay(interval * p).then(()=>
        {
            new PopIn(
                new AlignedBox(
                    new Vec2(
                        Lerp(min.x, max.x, grid[p].x / dices), 
                        Lerp(min.y, max.y, grid[p].y / dices)
                    ),
                    new Vec2(
                        Lerp(min.x, max.x, (grid[p].x + 1) / dices), 
                        Lerp(min.y, max.y, (grid[p].y + 1) / dices)
                    )
                ),
                new Vec2(0,0)
            )
        })
    }
}
function Checkerboard()
{

}
function CarpetBomb(pos, count, extent, angle, interval){

}
/**
 * Spawns a box that spans the arena 
 * @param {bool} isVertical 
 * @param {Number} coord The x or y coordinate depending on the above
 * @param {Number} width The width of the laser
 * @param {Number} speed The strafe speed of the laser
 */
function Laser(isVertical, coord, width, speed){
    new PopIn(
        new AlignedBox(
            new Vec2(
                isVertical ? coord - width : -2000,
                isVertical ? -2000 : coord - width
            ),
            new Vec2(
                isVertical ? coord + width : 2000,
                isVertical ? 2000 : coord + width
            )
        ),
        new Vec2(0,0),
        speed ? new Vec2(isVertical ? speed : 0, isVertical ? 0 : speed) : null 
    )
}
function PatternRain()
{

}
/**
 * Grates a span of the arena from the given side with boxes
 * @param {Number} side A number 0-3 telling which side to grate from, clockwise direction
 * @param {Vec2} span The span of the slicing
 * @param {Number} slices Number of slices
 * @param {Vec2} sliceSize A vector telling the size of each slice. 
 * @param {Number} interval Time between slices
 * @param {Number} speed The speed of the slices
 */
function Grate(side, span, slices, sliceSize, speed, interval = 0, offset = 1500)
{
    let isVertical = (side == 0 | side == 2)
    let spawnPos = new Vec2(
        isVertical ? span.x : (side == 1 ? offset : -offset),
        isVertical ? (side == 0 ? offset : -offset) : span.x 
    )
    let dif = (span.y - span.x) / slices
    let actualSize = new Vec2(isVertical ? sliceSize.x / 2 : sliceSize.y / 2, isVertical ? sliceSize.y / 2 : sliceSize.x / 2)
    let min = new Vec2(-actualSize.x, -actualSize.y)
    for (let i = 0; i <= slices; i++) {
        let spawn = Vec2.Add(spawnPos, new Vec2( isVertical ? dif * i: 0, isVertical ? 0 : dif * i))
        Delay(interval * i).then(() =>
            {
                new PopIn(
                    new AlignedBox(min, actualSize),
                    spawn,
                    new Vec2(isVertical ? 0 : (side == 3 ? speed : -speed), isVertical ? (side == 2 ? speed : -speed) : 0)
                )
            }
        )
    }
}