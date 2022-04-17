//This script handles the keyboard inputs
//Thanks to this info https://stackoverflow.com/questions/4416505/how-to-take-keyboard-input-in-javascript
const input = 
{ 
    downKeys: [], 
    justHitKeys: [],
    justReleasedKeys: [],
    horizontal: 0, //Set to up/down
    vertical: 0, //Set to left/right
    getKeyDown(event)
    {
        console.log("Got key")
        if(!this.downKeys.includes(event.keyCode))
        { 
            this.downKeys.push(event.keyCode)
        }
        if(event.keyCode == 37) this.horizontal = -1 //Left
        else if(event.keyCode == 38) this.vertical = 1 //Up
        else if(event.keyCode == 39) this.horizontal = 1 //Right
        else if(event.keyCode == 40) this.vertical = -1 //Down
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
    }
    
}
document.addEventListener("keydown", (e) => input.getKeyDown(e))

document.addEventListener("keyup", (e) => input.getKeyUp(e))
