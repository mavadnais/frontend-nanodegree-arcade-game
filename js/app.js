// Function that returns a random float between min and max
// From StackOverflow website
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

// Function that returns a random integer between min and max
// From StackOverflow website
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Variables holding the grid width and height of the cells in the level
var gridWidth = 101;
var gridHeight = 83;

// Base class for the game objects
var GameObject = function(sprite) {
	this.sprite = sprite;
	this.x = 0;
	this.y = 0;
	this.xGrid = 0;
	this.yGrid = 0;
	this.yOffset = -23;
	this.collisionRectXOffset = 0;
	this.collisionRectYOffset = 0;
	this.collisionRectWidth = 101;
	this.collisionRectHeight = 171;
};

// Method to render game objects
GameObject.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	
    // If the debug flag is set draw the collision rectangle in red over the image
	if (debug) {
		ctx.beginPath();
		ctx.rect(this.x + this.collisionRectXOffset, this.y + this.collisionRectYOffset, this.collisionRectWidth, this.collisionRectHeight);
		ctx.lineWidth = 5;
		ctx.strokeStyle = 'red';
		ctx.stroke();
		ctx.closePath();
	}
};

// Method to set the grid position of the game object
GameObject.prototype.setGridPosition = function(xGrid, yGrid) {
	this.xGrid = xGrid;
	this.yGrid = yGrid;
	this.updateGridPosition();
};

// Method to set the X grid position of the game object
GameObject.prototype.setXGridPosition = function(xGrid) {
	this.xGrid = xGrid;
	this.updateGridPosition();
};

// Method to set the Y grid position of the game object
GameObject.prototype.setYGridPosition = function(yGrid) {
	this.yGrid = yGrid;
	this.updateGridPosition();
};

// Method to update the actual x, y pixel coordinates based on the x, y grid coordinates
GameObject.prototype.updateGridPosition = function() {
	this.x = this.xGrid * gridWidth;
	this.y = this.yGrid * gridHeight + this.yOffset;
};

// Method that returns whether there is a collision with another game object passed as a parameter
// Adapted from a post on the StackOverflow website
GameObject.prototype.isCollision = function(gameObject) {
	return (Math.abs((this.x + this.collisionRectXOffset) - (gameObject.x + gameObject.collisionRectXOffset)) * 2 <
		(this.collisionRectWidth + gameObject.collisionRectWidth)) &&
		(Math.abs((this.y + this.collisionRectYOffset) - (gameObject.y + gameObject.collisionRectYOffset)) * 2 <
		(this.collisionRectHeight + gameObject.collisionRectHeight));	
};


// Enemies our player must avoid
// Enemies are a sub-class of GameObject
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    GameObject.call(this, 'images/enemy-bug.png');
	this.setRandomStartPosition();
	this.setRandomSpeed();
	this.collisionRectXOffset = 5;
	this.collisionRectYOffset = 87.5;
	this.collisionRectWidth = 91;
	this.collisionRectHeight = 55;
};

Enemy.prototype = Object.create(GameObject.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
	this.x += this.speed * dt;
	
    // If the enemy is completely off the edge of the level
    // respawn it with a random start position and random speed
	if (this.x > 5 * gridWidth) {
		this.setRandomStartPosition();
		this.setRandomSpeed();
	}
};

// Method to set a random start position on one of the three streets for the enemy
Enemy.prototype.setRandomStartPosition = function() {
	this.setGridPosition(-1, getRandomInt(1, 3));
};

// Method to set the random speed of the enemy
Enemy.prototype.setRandomSpeed = function() {
	this.speed = getRandomArbitrary(100, 500);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
// The Player class is a sub-class of GameObject
var Player = function() {
	GameObject.call(this, 'images/char-boy.png');
	this.resetToStartPosition();
	this.collisionRectXOffset = 22.5;
	this.collisionRectYOffset = 87.5;
	this.collisionRectWidth = 55;
	this.collisionRectHeight = 55;
};

Player.prototype = Object.create(GameObject.prototype);
Player.prototype.constructor = Player;

// Method to reset the player to its start position at the bottom middle of the level
Player.prototype.resetToStartPosition = function() {
	this.setGridPosition(2, 5);
};

// Update Method for the Player
Player.prototype.update = function() {
    // If the player has reached the water, reset it to its start position
	if (this.yGrid <= 0) 
		this.resetToStartPosition();
};

// Method to handle input to move the player.
// If the input does not move the player out of the level, moves the player to a new location
Player.prototype.handleInput = function(key) {
	switch (key) {
		case 'left':
			if (this.xGrid > 0)
				this.setXGridPosition(this.xGrid - 1);
			break;
		case 'right':
			if (this.xGrid < 4)
				this.setXGridPosition(this.xGrid + 1);
			break;
		case 'up':
			if (this.yGrid > 0)
				this.setYGridPosition(this.yGrid - 1);
			break;
		case 'down':
			if (this.yGrid < 5)
				this.setYGridPosition(this.yGrid + 1);
			break;
	}
};



// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var numEnemies = 3;
var allEnemies = [];
for (var i = 0; i < numEnemies; i++) {
	allEnemies.push(new Enemy());
}

var player = new Player();
var debug = false;

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
