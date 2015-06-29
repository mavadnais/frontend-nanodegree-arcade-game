function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var GameObject = function(x, y, sprite) {
	this.x = x;
	this.y = y;
	this.sprite = sprite;
};

GameObject.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    GameObject.call(this, 0, 0, 'images/enemy-bug.png');
	this.setRandomStartPosition();
	this.setRandomSpeed();
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
	
	if (this.x > 5 * 101) {
		this.setRandomStartPosition();
		this.setRandomSpeed();
	}
};

Enemy.prototype.setRandomStartPosition = function() {
	this.x = -1 * 101;
	this.y = getRandomInt(1, 3) * 83 - 20;
};

Enemy.prototype.setRandomSpeed = function() {
	this.speed = getRandomArbitrary(100, 500);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
	GameObject.call(this, 0, 0, 'images/char-boy.png');
	this.resetToStartPosition();	
};

Player.prototype = Object.create(GameObject.prototype);
Player.prototype.constructor = Player;

Player.prototype.resetToStartPosition = function() {
	this.xGrid = 2;
	this.yGrid = 5;
	this.updateGridPosition();
};

Player.prototype.update = function() {
	if (this.yGrid <= 0) {
		this.resetToStartPosition();
	}
};

Player.prototype.handleInput = function(key) {
	switch (key) {
		case 'left':
			if (this.xGrid > 0)
				this.xGrid--;
			break;
		case 'right':
			if (this.xGrid < 4)
				this.xGrid++;
			break;
		case 'up':
			if (this.yGrid > 0)
				this.yGrid--;
			break;
		case 'down':
			if (this.yGrid < 5)
				this.yGrid++;
			break;
	}
	this.updateGridPosition();
};

Player.prototype.updateGridPosition = function() {
	this.x = this.xGrid * 101;
	this.y = this.yGrid * 83 - 20;
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
