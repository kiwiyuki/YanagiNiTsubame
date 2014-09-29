var Player = function(_id, _x, _y, _hp, _score, _color) {
	return {
		id: _id,
		x: _x,
		y: _y,
		shots: [],
		hp: _hp,
		score: _score,
		state: "NORMAL",
		color: _color
	};
};

var Shots = function() {
	// return {
	// 	id: 
	// };
};


var Enemy = function(_x, _y, _type) {
	this.id = "" + Date.now() + Math.random();
	this.x = _x;
	this.y = _y;
	this.type = _type;
	this.hp = 0;
	this.atk = 0;
	this.point = 0;
	this.counter = 0;

	switch(_type) {
		// ヤナギニツバメ零号機
		case 'test':
		this.hp = 40;
		this.atk = 1;
		this.point = 10;
		var speed = 3;
		var d = 360;

		this.update = function() {
			// 移動
			this.x += speed;

			if(this.x > _x + d) {
				this.x = _x + d;
				speed = -speed;
			} else if (this.x < _x - d) {
				this.x = _x - d;
				speed = -speed;
			}

			// 発生から1分で自動的に死ぬ
			this.counter++;
			if(this.counter > 3600) {
				this.hp = 0;
			}
		};
		break;
	}
};

var Item = function(_id, _x, _y, _vx, _vy, _type) {
	this.id = _id;
	this.x = _x;
	this.y = _y;
	this.vx = _vx;
	this.vy = _vy;
	this.type = _type;
	this.point = 0;
	this.counter = 0;

	switch(_type) {
		case "test":
		var d = 0.1;
		this.point = 100;

		this.update = function() {
			this.x += this.vx;
			this.y += this.vy;
			this.vx -= d;
			this.vy -= d;
			if(this.vx < 0 || this.vy < 0) {
				this.vx = 0;
				this.vy = 0;
			}
			this.counter++;
			if(this.counter > 3600) {
				//TODO アイテムの消える処理
			}
		};
		break;	
	}
};

module.exports = {
	Player: Player,
	Enemy: Enemy,
	Item: Item
};