//This script handles the keyboard inputs
//Thanks to this info https://stackoverflow.com/questions/4416505/how-to-take-keyboard-input-in-javascript
const Input = 
{ 
    downKeys: [], 
    justHitKeys: [],
    justReleasedKeys: [],
    horizontal: 0, //Set to up/down
    vertical: 0, //Set to left/right
    fire: 0, 
    getKeyDown(event)
    {
        if(!this.downKeys.includes(event.keyCode))
        { 
            this.downKeys.push(event.keyCode)
        }
        if(event.keyCode == 37) this.horizontal = -1 //Left
        else if(event.keyCode == 38) this.vertical = 1 //Up
        else if(event.keyCode == 39) this.horizontal = 1 //Right
        else if(event.keyCode == 40) this.vertical = -1 //Down
        else if(event.keyCode == 32) this.fire = 1 // Spacebar
    } ,
    getKeyUp(event)
    {
        let m = this.downKeys.indexOf(event.keyCode)
        if(m != -1)
        {
            this.downKeys.splice(m, 1)
        }
        if(event.keyCode == 37 ) this.horizontal = 0 //Left
        else if(event.keyCode == 38) this.vertical = 0 //Up
        else if(event.keyCode == 39) this.horizontal = 0 //Right
        else if(event.keyCode == 40) this.vertical = 0 //Down
        else if(event.keyCode == 32) this.fire = 0 // Spacebar
    }
    
}
document.addEventListener("keydown", (e) => Input.getKeyDown(e))

document.addEventListener("keyup", (e) => Input.getKeyUp(e))
