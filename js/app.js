function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var gridWidth = 101;
var gridHeight = 83;

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

GameObject.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	
	if (debug) {
		ctx.beginPath();
		ctx.rect(this.x + this.collisionRectXOffset, this.y + this.collisionRectYOffset, this.collisionRectWidth, this.collisionRectHeight);
		ctx.lineWidth = 5;
		ctx.strokeStyle = 'red';
		ctx.stroke();
		ctx.closePath();
	}
};

GameObject.prototype.setGridPosition = function(xGrid, yGrid) {
	this.xGrid = xGrid;
	this.yGrid = yGrid;
	this.updateGridPosition();
};

GameObject.prototype.setXGridPosition = function(xGrid) {
	this.xGrid = xGrid;
	this.updateGridPosition();
};

GameObject.prototype.setYGridPosition = function(yGrid) {
	this.yGrid = yGrid;
	this.updateGridPosition();
};

GameObject.prototype.updateGridPosition = function() {
	this.x = this.xGrid * gridWidth;
	this.y = this.yGrid * gridHeight + this.yOffset;
};

GameObject.prototype.isCollision = function(gameObject) {
	return (Math.abs((this.x + this.collisionRectXOffset) - (gameObject.x + gameObject.collisionRectXOffset)) * 2 <
		(this.collisionRectWidth + gameObject.collisionRectWidth)) &&
		(Math.abs((this.y + this.collisionRectYOffset) - (gameObject.y + gameObject.collisionRectYOffset)) * 2 <
		(this.collisionRectHeight + gameObject.collisionRectHeight));	
};


// Enemies our player must avoid
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
	
	if (this.x > 5 * gridWidth) {
		this.setRandomStartPosition();
		this.setRandomSpeed();
	}
};

Enemy.prototype.setRandomStartPosition = function() {
	this.setGridPosition(-1, getRandomInt(1, 3));
};

Enemy.prototype.setRandomSpeed = function() {
	this.speed = getRandomArbitrary(100, 500);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
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

Player.prototype.resetToStartPosition = function() {
	this.setGridPosition(2, 5);
};

Player.prototype.update = function() {
	if (this.yGrid <= 0) 
		this.resetToStartPosition();
};

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
