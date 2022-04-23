Welcome to Kastlös, is what it would be called if I had time to make the title clickable to start the game

Kastlös is a partially finished bullet-hell, inspired by the fact that's pretty much what I could scramble together from my collision system that took most of the time to get together
Unlike what I intended to do if I had more time, and didn't spend soo much of it on petty mistakes and the whole controversial 'this' problem, I would've added patterns, more style and complexity to it's entirety.

No external technologies involved at all(despite some stack overflow searches), infact, I didn't even use canvas. All objects of the game use HTML divs and CSS to put some nice effects together
And yes, you heard it correctly, I put together simple collision detection system, my first time ever too, WITH sweep and prune, or at least what I think is sweep and prune, entirely in a language I now have a love/hate relationship with yet barely know. More hate than love though
If you should ask, it handled 5000 objects pretty well(without CSS styling, that takes up alot) on my Intel 11th Gen i7, with some lag

Controls:
Arrow keys to move. Sorry if you're a WASD or ESDF fan
Space to 'dash' 

Known bugs/problems:
- Switching tabs will both
    - Likely allow you to get a better time since JS runs at a slower pace
    - Desync the CSS animations from what is actually is happening. Animations will play from where they left off of, or from the start if the element they're attached to was created while on another tab 
    - Require refresh to replay. I didn't get a gameloop in
    - I may have forgot to 'properly' add in colliders, because what's supposed to happen is that it'll use a binary search to figure out where to put them. Instead, they're just pushed to the end of the list, so they sort themselves out in realtime with worst case O(n) complexity, n being number of colliders in the list(excluding speed required to do a splice)
