//This script handles the keyboard inputs
//Thanks to this info https://stackoverflow.com/questions/4416505/how-to-take-keyboard-input-in-javascript
const Input = 
{ 
    //These aren't used
    justHitKeys: [],
    justReleasedKeys: [],
    //Actually functioning stuff
    downKeys: [], 
    horizontal: 0, //Set to up/down
    vertical: 0, //Set to left/right
    fire: 0, //Set to spacebar
    getKeyDown(event)
    {
        //If the key isn't in the list, put it in
        if(!this.downKeys.includes(event.keyCode))
        { 
            this.downKeys.push(event.keyCode)
        }
        //Quality of life property setting
        if(event.keyCode == 37) this.horizontal = -1 //Left
        else if(event.keyCode == 38) this.vertical = 1 //Up
        else if(event.keyCode == 39) this.horizontal = 1 //Right
        else if(event.keyCode == 40) this.vertical = -1 //Down
        else if(event.keyCode == 32) this.fire = 1 // Spacebar
    } ,
    getKeyUp(event)
    {
        let m = this.downKeys.indexOf(event.keyCode)
        //If the key is in the list, get rid of it
        if(m != -1)
        {
            this.downKeys.splice(m, 1)
        }
        //Quality of life property setting
        if(event.keyCode == 37 ) this.horizontal = 0 //Left
        else if(event.keyCode == 38) this.vertical = 0 //Up
        else if(event.keyCode == 39) this.horizontal = 0 //Right
        else if(event.keyCode == 40) this.vertical = 0 //Down
        else if(event.keyCode == 32) this.fire = 0 // Spacebar
    }
    
}
//Attach listeners from the Input object
document.addEventListener("keydown", (e) => Input.getKeyDown(e))
document.addEventListener("keyup", (e) => Input.getKeyUp(e))
