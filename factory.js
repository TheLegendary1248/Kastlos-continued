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
        this.clone = div.cloneNode();
        let clone = this.clone;
        this.pos = pos;
        let self = this;
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
        if(velocity)
        {
            this.velocity = velocity
            if(delay) 
                Delay(delay).then(() =>
                    {
                        self.frameId = frame.addCallback(() => {self.Move()})
                    } 
                )
            else this.frameId = frame.addCallback(() => {self.Move()})
            Delay(7600).then(() => {self.Remove()})
        }
        this.collider = new Collider(shape, pos, false)
        
        Delay(2000).then(() => {self.collider.enabled = true;})
        Delay(7600).then(() => {self.collider.destructor();})
        Delay(8000).then(() => {self.clone.remove();})
        world.appendChild(clone)
    }
    Move()
    {
        this.pos.AddSelf(this.velocity)
        let shape = this.collider.shape
        let pos = this.pos
        if(this.collider.shape.type == "Circle")
        {
            this.clone.classList.add("circle")
            this.clone.style.top = (-pos.y - shape.radius) + "px"
            this.clone.style.left = (pos.x - shape.radius) + "px"
            this.clone.style.height = 2 * shape.radius + "px" 
            this.clone.style.width = 2 * shape.radius + "px"
        }
        else
        {
            this.clone.style.top = -(shape.max.y + pos.y) + "px"
            this.clone.style.left = (shape.min.x + pos.x) + "px"
            this.clone.style.height = (shape.max.y - shape.min.y) + "px" 
            this.clone.style.width = (shape.max.x - shape.min.x) + "px"
        }
    }
    Remove() {frame.removeCallback(this.frameId)}
}
