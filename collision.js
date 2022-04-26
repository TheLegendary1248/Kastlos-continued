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
    //Addition Functions
    static Add(a, b)
    { return new Vec2(a.x + b.x, a.y + b.y) }
    AddSelf(a)
    { this.x += a.x; this.y += a.y}
    //Subtraction Functions
    static Sub(a, b)
    { return new Vec2(a.x - b.x, a.y - b.y) }
    SubSelf(a)
    { this.x -= a.x; this.y -= a.y }
    /**
     * Gets the distance squared of this vector
     * @returns {Number}
     */
    SqrDist()
    {return (this.x ** 2 + this.y ** 2)}
    /**
     * Gets the distance of this vector
     * @returns 
     */
    Dist()
    {return Math.sqrt(this.x ** 2 + this.y ** 2)}
    //Linear Interpolation Functions
    /**
     * Interpolates from vector start to end by 't'. This is unclamped
     * @param {Vec2} start 
     * @param {Vec2} end 
     * @param {Number} t 
     */
    static Lerp(a, b, t)
    {
        return new Vec2(Lerp(a.x, b.x, t), Lerp(a.y, b.y, t))
    }
    /**
     * Interpolates this vector towards the destination vector by 't'
     * @param {Vec2} dest The destination vector  
     * @param {Number} t The interpolation value
     */
    LerpSelf(dest, t)
    {
        this.x = Lerp(this.x, dest.x, t)
        this.y = Lerp(this.y, dest.y, t)
    }
}
/**
 * The class for holding AABB data
 */
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
/**
 * The class for representing an AABB as a collider
 */
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
            aabb.min = Vec2.Add(this.min, pos)
            aabb.max = Vec2.Add(this.max, pos)
        }
        else
        {
            aabb = new AABB(Vec2.Add(this.min, pos), Vec2.Add(this.max, pos))
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
    GetAABB(pos, aabb)
    {
        if(aabb)
        {
            aabb.min = new Vec2(pos.x - this.radius, pos.y - this.radius)
            aabb.max = new Vec2(pos.x + this.radius, pos.y + this.radius)
        }
        else
        {
            aabb = new AABB(new Vec2(pos.x - this.radius, pos.y - this.radius), new Vec2(pos.x + this.radius, pos.y + this.radius))
        }
        return aabb;
    }
}
//---COLLIDER---//
class Collider
{
    //https://stackoverflow.com/questions/8407622/set-type-for-function-parameters. Thanks to this keeping track of the expected type of my params
    /**
    * @param {ColliderShape} shape The shape our collider takes on
    * @param {Vec2} pos The position of the collider
    * @param {Boolean} enabled Should the collider start enabled. Default to true
    */
    constructor(shape, pos, enabled) 
    {
        if(shape.type == "AABB") //Box
        {
            this.AABB = new AABB(
                Vec2.Add(pos, shape.min),
                Vec2.Add(pos, shape.max)
            )
            
        }
        else if(shape.type == "Circle")
        {
            this.AABB = new AABB(
                Vec2.Sub(pos, new Vec2(shape.radius, shape.radius)),
                Vec2.Add(pos, new Vec2(shape.radius, shape.radius))
            )
        }
        this.internalShape = shape; //Consider this the "before" shape
        this.shape = shape; //Consider this the "after" shape
        this.internalPos = pos; //Consider this the "before" position. This is the position that will be used for checking collision on a frame 
        this.pos = pos; //Consider this the "after" position. This one can be changed via code and the internal position will be moved to this after collision was checked. This is to ensure that the objects are accurately sorted by position
        this.enabled = enabled ?? true; //yea i should'a saw that coming a mile away
        
        this.onCollision = null //Callback function
        this.markedToDelete = false;//Gets set to true
        Collision.addObject(this) //Stores the index of the object in that array down there, for when we take an object out of the system
    }
    destructor() //Yes, i know this is not part of javascript, so i'll call it manually
    {
        this.markedToDelete = true;
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
            //If we're marked to delete, remove us
            if(objectA.markedToDelete)
            {
                this.objects.splice(index--, 1)
                continue;
            }
            if(objectA.enabled) //If the collider is enabled for detection
            {
                let ahead = index + 1;
                let objectB = this.objects[ahead];
                function callCollision() { if(objectA.onCollision) {objectA.onCollision();} if(objectB.onCollision) {objectB.onCollision();}}
                //Check for collision with every object ahead of this one in the array via AABB. Sweep phase
                while(objectA.AABB.max.x > objectB.AABB.min.x)
                {
                    if(!objectB.markedToDelete) //If the collider we're checking against is to be removed
                    {
                        if(objectB.enabled) //If the collider we're checking against is enabled
                        {
                            if(objectA.AABB.max.y > objectB.AABB.min.y & objectB.AABB.max.y > objectA.AABB.min.y) //If AABB's overlaps
                            {
                                //Prune phase(I presume is what this part is called). The more in depth collision test
                                if(objectA.internalShape.type == "AABB" & objectB.internalShape.type == "AABB") //Box on Box (aka nothing todo cuz we just checked that)
                                    callCollision()
                                                                                //Hahaha this was objectA.... i hate myself
                                else if(objectA.internalShape.type == "Circle" & objectB.internalShape.type == "Circle") //Circle on Circle (the simplest)
                                {
                                    if((objectA.internalShape.radius + objectB.internalShape.radius) ** 2 > Vec2.Sub(objectA.internalPos, objectB.internalPos).SqrDist())
                                        callCollision()
                                }
                                else //Circle on Box(oh no)
                                {
                                    let box, circle
                                    if(objectA.internalShape.type == "AABB") { box = objectA; circle = objectB; }
                                    else { box = objectB; circle = objectA; }
                                    //console.log(`${(box.AABB.min.x < circle.internalPos.x) & (circle.internalPos.x < box.AABB.max.x)}, ${(box.AABB.min.y < circle.internalPos.y) & (circle.internalPos.y < box.AABB.max.y)}`)
                                    //If the circle origin lies in between either the x-span or y-span of the box AABB, then it's definitely colliding
                                    if((box.AABB.min.x < circle.internalPos.x & circle.internalPos.x < box.AABB.max.x) | (box.AABB.min.y < circle.internalPos.y & circle.internalPos.y < box.AABB.max.y))
                                        callCollision()
                                    else
                                    {
                                        //Get the corner point of the box closest to the circle
                                        let cornerPt = new Vec2( 
                                            box.AABB.max.x <= circle.pos.x ? box.AABB.max.x : box.AABB.min.x ,
                                            box.AABB.max.y <= circle.pos.y ? box.AABB.max.y : box.AABB.min.y);
                                        if(Vec2.Sub(circle.pos, cornerPt).SqrDist() < (circle.shape.radius ** 2)) //If the closest point is within range, call collision
                                            callCollision()
                                    }
                                }
                            }
                        }
                    }
                    //Remove the other object if marked to delete
                    else { this.objects.splice(ahead--, 1)}
                    ahead++;
                    //If at end of list, break out the loop, otherwise move onto the next object
                    if(ahead >= this.objects.length) { break; }
                    objectB = this.objects[ahead];
                }
            }

            //Respond to shape change requests
            objectA.AABB = objectA.shape.GetAABB(objectA.pos, objectA.AABB) //Update AABB
            objectA.internalShape = objectA.shape; //Change shape
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
            if(newIndex != index) Arraymove(this.objects, index, newIndex); //If there's no change in order, avoid the uneccesary work of moving the element  
        }
        //Leftover work for the last object
        let last = this.objects[this.objects.length - 1]
        last.AABB = last.shape.GetAABB(last.pos, last.AABB)
        last.internalShape - last.shape
        last.internalPos = last.pos
        let newIndex = this.objects.length - 2
        while(newIndex > -1) //If the start of the array is reached, or the object before is NOT less x-wise, insert
        {
            let prevObject = this.objects[newIndex]
            if(prevObject.AABB.min.x > last.AABB.min.x) newIndex--//Check if min.x is less than our object 
            else break
        }
        newIndex++;
        if(newIndex != this.objects.length - 1) Arraymove(this.objects, this.objects.length - 1, newIndex) //If there's no change in order, avoid the uneccesary work of moving the element
    },
    /**
     * TO BE USED BY COLLIDER ONLY
     * @param {Collider} obj The collider to be added 
     */
    addObject(obj) //Basically an binary search to where to put the new object
    {
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
    removeObject(obj) //THIS FUNCTION IS UNUSED
    {
        this.objects.splice(obj.index, 1);
    }
}
