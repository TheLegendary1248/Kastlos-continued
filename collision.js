//This is my collision system scrapped together from the depths of my mind. 
//Can i figure something out without stack overflow
/*
So i've skimmed passages on real-time collision for video games out of curiosity since i make games on my own time
Im going to try my hand sweep and prune, or whatever that quite means 
*/
//--Vector 2 Data Object--//
class Vec2 
{
    /**
     * @param {Number} x 
     * @param {Number} y 
     */
    constructor(x,y)
    {
        this.x = x;
        this.y = y;
    }
    static add(a, b)
    { return new Vec2(a.x + b.x, a.y + b.y) }
    addSelf(a)
    { this.x += a.x; this.y += a.y}
    static sub(a, b)
    { return new Vec2(a.x - b.x, a.y - b.y) }
    subSelf(a)
    { this.x -= a.x; this.y -= a.y }
}
class AABB //Axis Aligned Bounding Box, a box whose orientation is aligned with the axis of the world space, yes i know what it is
{
    /** @param {Vec2} min The lower left point @param {Vec2} max The higher right point */
    constructor(min, max)
    {
        this.min = min
        this.max = max
    }
}
//---COLLIDER SHAPE DEFINITIONS---//
class ColliderShape 
{  
    /**
     * @param {Vec2} pos The position of the shape in world space
     * @param {AABB} aabb The AABB to be modified incase allocation is to be avoided
     * @returns {AABB} Returns the given AABB, now modified. If one wasn't provided, a new one is made
     */
   GetAABB(pos, aabb) {return null;} 
}   
class AlignedBox extends ColliderShape
{
    /**
     * 
     * @param {Vec2} min The minimum point of the box.
     * @param {Vec2} max The maximum point of the box.
     */
    constructor(min, max)
    {
        super();
        if(min.x > max.x | min.y > max.y) throw "Attempted to create an AlignedBox shape with invalid points"
        this.min = min;
        this.max = max;
        this.type = "AABB";
    }
    GetAABB(pos, aabb)
    {
        if(aabb)
        {
            aabb.min = Vec2.add(this.min, pos)
            aabb.max = Vec2.add(this.max, pos)
        }
        else
        {
            aabb = new AABB(new Vec2())
        }
        return aabb;
    }
}
class Circle extends ColliderShape
{
    constructor(radius)
    { 
        super();
        this.radius = radius;
        this.type = "Circle";
    }
}
//---COLLIDER---//
class Collider
{
    //https://stackoverflow.com/questions/8407622/set-type-for-function-parameters. Thanks to this keeping track of the expected type of my params
    /**
    * @param {ColliderShape} shape The shape our collider takes on
    * @param {Vec2} pos The position of the collider
    * @param {Boolean} enabled Should the collider start enabled
    */
    constructor(shape, pos, enabled) 
    {
        if(shape.type == "AABB") //Box
        {
            this.AABB = new AABB(
                Vec2.add(pos, shape.min),
                Vec2.add(pos, shape.max)
            )
            
        }
        else if(shape.type == "Circle")
        {
            this.AABB = new AABB(
                Vec2.sub(pos, new Vec2(shape.radius, shape.radius)),
                Vec2.add(pos, new Vec2(shape.radius, shape.radius))
            )
        }
        this.shape = shape;
        this.internalPos = pos; //Consider this the "before" position. This is the position that will be used for checking collision on a frame 
        this.pos = pos; //Consider this the "after" position. This one can be changed via code and the internal position will be moved to this after collision was checked. This is to ensure that the objects are accurately sorted by position
        this.enabled = enabled || true //I read the docs, fool! Yes I comprehend how this works(ableit with some dif because it's new) https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators
        //Basically, for the line above, incase enabled isn't a boolean, it's set to true by default
        this.index = Collision.addObject(this) //Stores the index of the object in that array down there, for when we take an object out of the system
        this.onCollision = null //Callback function
    
    }
    destructor() //Yes, i know this is not part of javascript, so i'll call it manually
    {
        Collision.removeObject()
    }

    
}
//---COLLISION DETECTION OBJECT---//
const Collision = 
{
    objects: [], //Reference to all collider objects
    /*
    Keep this array sorted by the x-position of all objects(preferably x since most screens are more wide than long)
    This way, we can just check for collision with all objects ahead in index, which prevents checking collision between objects twice
    And if something moves along the x-axis, we just need to check if the object's AABB min.x is less than the one before it
    */
    runDetection() //Runs the collision detection
    {   
        //Check every object in our array. Minus 1 in length for the fact that we're only checking for collision forwards in the array
        for (let index = 0; index < this.objects.length - 1; index++) 
        {
            const objectA = this.objects[index];
            if(objectA.enabled) //If the collider is enabled for detection
            {
                let ahead = index + 1;
                let objectB = this.objects[ahead];
                //Check for collision with every object ahead of this one in the array via AABB
                while(objectA.AABB.max.x > objectB.AABB.min.x)
                {
                    if(objectB.enabled)
                    //Check if we want them to collide
                    //...
                    //Check AABB overlap (and consider the fact that our AABB.min.x is already less than what is being checked against, along with the condition above)
                    if(objectA.AABB.max.y > objectB.AABB.min.y & objectB.AABB.max.y > objectA.AABB.min.y)
                    {
                        if(objectA.shape.type == "AABB" & objectB.shape.type == "AABB") //Box on Box (aka nothing todo cuz we just checked that)
                        {

                        }
                        else if(objectA.shape.type == "Circle" & objectA.shape.type == "Circle") //Circle on Circle (the simplest)
                        {

                        }
                        else //Circle on Box(oh no)
                        {
                            
                        }
                        //More in depth collision test
                    }
                    ahead++;
                    if(ahead >= this.objects.length) { break }
                    objectB = this.objects[ahead];
                }
            }

            //Respond to shape change requests
            objectA.AABB = objectA.shape.GetAABB(objectA.pos, objectA.AABB) //Update AABB
            objectA.internalPos = objectA.pos; //Move collider
            //Change position in array if necessary
            let newIndex = index - 1
            while(newIndex > -1) //If the start of the array is reached, or the object before is NOT less x-wise, insert
            {
                let prevObject = this.objects[newIndex]
                if(prevObject.AABB.min.x > objectA.AABB.min.x) newIndex--//Check if min.x is less than our object 
                else break
            }
            newIndex++;
            if(newIndex != index) arraymove(this.objects, index, newIndex); //If there's no change in order, avoid the uneccesary work of moving the element  
        }
        //Leftover work for the last object
        let last = this.objects[this.objects.length - 1]
        last.AABB = last.shape.GetAABB(last.pos, last.AABB)
        last.internalPos = last.pos
        let newIndex = this.objects.length - 2
        while(newIndex > -1) //If the start of the array is reached, or the object before is NOT less x-wise, insert
        {
            let prevObject = this.objects[newIndex]
            if(prevObject.AABB.min.x > last.AABB.min.x) newIndex--//Check if min.x is less than our object 
            else break
        }
        newIndex++;
        if(newIndex != this.objects.length - 1) arraymove(this.objects, this.objects.length - 1, newIndex) //If there's no change in order, avoid the uneccesary work of moving the element
    },
    /**
     * TO BE USED BY COLLIDER ONLY
     * @param {Collider} obj The collider to be added 
     */
    addObject(obj) //Basically an binary search to where to put the new object
    {
        console.log("Added new object")
        console.log(obj)
        if(obj instanceof Collider) //Make sure the object has a collider, of type collider
        {
            if(this.objects.length == 0) { this.objects.push(obj) } //Don't waste time on an empty array
            else
            {
                this.objects.push(obj)
            }
        }
    } ,
    /**
     * TO BE USED BY COLLIDER ONLY
     * @param {Collider} obj The collider to be removed 
     */
    removeObject(obj) //
    {
        this.objects.splice(obj.index, 1);
    }
}
//https://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another Move an array element from one index to another
//I mean, i would've come up with this, but i was wondering if js was "feature-rich" enough to have a function with native code to deal with this
/**
 * Moves an element in an array from one index to another
 * @param {Array} arr 
 * @param {Number} fromIndex 
 * @param {Number} toIndex 
 */
function arraymove(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}