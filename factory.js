let div = document.createElement("div")
div.classList.add("object")
//This script contains functions for spawning objects into the game
class PopIn{
    /**
     * 
     * @param {ColliderShape} shape The collider shape the pop in takes on 
     * @param {Vec2} pos The position of the collider
     * @param {Vec2} velocity The velocity of the pop in
     * @param {Number} delay The delay in time before the pop in moves
     */
    constructor(shape, pos, velocity, delay)
    {
        let clone = div.cloneNode()
        clone.classList.add("popIn")
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
        clone.collider = new Collider(shape, pos, false)
        Delay(2000).then(() => {clone.collider.enabled = true;})
        Delay(7600).then(() => {clone.collider.destructor();})
        Delay(8000).then(() => {clone.remove();})
        world.appendChild(clone)
        return clone
    }
}