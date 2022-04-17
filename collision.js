//This is my collision system scrapped together from the depths of my mind. 
//Can i figure something out without stack overflow
/*
So i've skimmed passages on real-time collision for video games out of curiosity since i make games on my own time
Im going to try my hand sweep and prune, or whatever that quite means 
*/

//Base collision object
const collision = 
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
        for (let index = 0; index < objects.length - 1; index++) 
        {
            const objectA = objects[index];
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
        this.objects.i
    }
}