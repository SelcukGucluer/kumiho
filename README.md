# Kumiho
Javascript Canvas 2D game lib


## kullanımı 


```javascript
c=document.getElementById("myCanvas");
 ctx=c.getContext("2d");   

    
var myGame = {
	Canvas:c,
	Context:ctx,

	Init: function()
	{
		//your code run once
	},

	Update: function()
	{
        	//your game logic, core macanics
        
	},
	
	Draw: function()
	{      
		// rendering the objects
        
	}
};

Kumiho.Run(myGame);
```
