//This is my collision system scrapped together from the depths of my mind. 
//Can i figure something out without stack overflow
/*
So i've skimmed passages on real-time collision for video games out of curiosity since i make games on my own time
Im going to try my hand sweep and prune, or whatever that quite means 
*/
//--Vector 2 Data Object--//
class Vec2 
{
    constructor(x,y)
    {
        this.x = x;
        this.y = y;
    }
    add(a, b)
    { return new Vec2(a.x + b.x, a.y + b.y) }
    addSelf(a)
    { this.x += a.x; this.y += a.y}
    sub(a, b)
    { return new Vec2(a.x - b.x, a.y - b.y) }
    subSelf(a)
    { this.x -= a.x; this.y -= a.y }
}
class AABB //Axis Aligned Bounding Box, a box whose orientation is aligned with the axis of the world space, yes i know what it is
{
    constructor(min, max)
    {
        this.min = min
        this.max = max
    }
}
//---COLLIDER SHAPE DEFINITIONS---//
class ColliderShape 
{   }
class AlignedBox extends ColliderShape
{
    constructor(min, max)
    {
        super();
        this.min = min;
        this.max = max;
        this.type = "AABB";
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
    constructor(shape, pos) 
    {

        console.log(shape)
        if(shape.type == "AABB") //Box
        {
            this.AABB = new AABB(
                Vec2.sub(pos, shape.min),
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
        this.internalPos = pos; //Consider this the "before" position. This is the position that will be used for checking collision on a frame 
        this.pos = pos; //Consider this the "after" position. This one can be changed via code and the internal position will be moved to this after collision was checked. This is to ensure that the objects are accurately sorted by position
        
        this.index = Collision.addNewPhysicsObject(this) //Stores the index of the object in that array down there, for when we take an object out of the system
    }
    destructor() //Yes, i know this is not part of javascript, so i'll call it manually
    {
        Collision
    }

    
}
//---COLLISION DETECTION OBJECT---//
const Collision = 
{
    objects: [], //Reference to all collision objects
    /*
    Keep this array sorted by the x-position of all objects(preferably x since most screens are more wide than long)
    This way, we can just check for collision with all objects ahead in index, which prevents checking collision between objects twice
    And if something moves along the x-axis, we just need to check if the object's AABB min.x is less than the one before it
    */
    runDetection() //Runs the collision detection
    {
        //Check each object of our array
        console.log(this.objects.length)
        for (let index = 0; index < this.objects.length; index++) 
        {
            const objectA = this.objects[index];
            console.log("Are we here")
            console.log(`Index ${index}, position at ${objectA.internalPos}`)
            continue;
            
            let ahead = index + 1;
            let objectB = objects[ahead];
            colliderA = objectA.collider; //We're gonna be referencing these alot, so ya know, reference them now
            colliderB = objectB.collider;
            //Check for collision with every object ahead of this one in the array via AABB
            while(colliderA.AABB.max.x > objectB.collider.AABB.min.x)
            {
                //Check if we want them to collide
                //...
                //Check AABB overlap (and consider the fact that our AABB.min.x is already less than what is being checked against, along with the condition above)
                if(colliderA.AABB.max.y > colliderB.AABB.min.y & colliderB.AABB.max.y > colliderA.AABB.min.y)
                {
                    console.log("COLLISIONNNNNNNN")
                    //More in depth collision test
                }
                ahead++;
            }
            
            //Respond to shape change requests
            //Check if min.x is less than the object before this one in index.
                //If the start of the array is reached, or the object before is NOT less x-wise, insert
        }
             
    },
    addNewPhysicsObject(obj) //Basically an binary search to where to put the new object
    {
        console.log("Added new object")
        console.log(obj.collider)
        if(obj.collider instanceof Collider) //Make sure the object has a collider, of type collider
        {
            if(this.objects.length == 0) { this.objects.push(obj) } //Don't waste time on an empty array
            else
            {

            }
        }
    }
}