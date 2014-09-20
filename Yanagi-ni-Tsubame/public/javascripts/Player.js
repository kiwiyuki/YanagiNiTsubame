var Player = function(scene, camera, domElement) {
	var speed = 3;
	var d = 0.8; // カメラ操作用
	var controls = {
		moveUp: false,
		moveDown: false,
		moveLeft: false,
		moveRight: false,
		shotUp: false,
		shotDown: false,
		shotLeft: false,
		shotRight: false
	};
	var canonRadius = 20;
	var canonAngle = 0;

	this.hp = 0;
	this.id = "";

	// イベントリスナー用
	this.domElement = (domElement !== undefined) ? domElement : document;
	
	this.mesh = new THREE.Object3D();

	// 本体メッシュ
	var core = new THREE.Object3D();
	for (var i = 0; i < 8; i++) {
		var ix = i & 1;
		var iy = (i >> 1) & 1;
		var iz = (i >> 2) & 1;
		var g = new THREE.BoxGeometry(4, 4, 4);
		var m = new THREE.MeshLambertMaterial({color : 0xff0000});
		var box = new THREE.Mesh(g, m);
		box.position.set(3 - 6 * ix, 3 - 6 * iy, 3 - 6 * iz);
		core.add(box);
	}
	this.mesh.add(core);

	console.log(this.mesh.position.x);

	// 砲台メッシュ
	var g = new THREE.SphereGeometry(3, 4, 4);
	var m = new THREE.MeshLambertMaterial({color: 0xff0000});
	var canon = new THREE.Mesh(g, m);
	canon.position.set(canonRadius, 0, 0);
	this.mesh.add(canon);

	// 弾の管理
	this.bullets = new THREE.Object3D();

	scene.add(this.mesh);
	scene.add(this.bullets);

	// 状態更新
	this.update = function() {
		if(controls.moveLeft) this.mesh.position.x -= speed;
		if(controls.moveUp) this.mesh.position.y += speed;
		if(controls.moveRight) this.mesh.position.x += speed;
		if(controls.moveDown) this.mesh.position.y -= speed;

		core.rotation.x += 0.05;
		core.rotation.y += 0.05;

		// カメラ移動
		var targetPositionX = camera.position.x * d + this.mesh.position.x * (1 - d);
		var targetPositionY = camera.position.y * d + this.mesh.position.y * (1 - d);
		camera.position.x = targetPositionX;
		camera.position.y = targetPositionY;
		camera.lookAt(new THREE.Vector3(targetPositionX, targetPositionY, 0));

		// ショット
		if(controls.shotLeft | controls.shotUp | controls.shotRight | controls.shotDown) {
			// 砲台移動
			var targetAngle = Math.atan2(controls.shotUp - controls.shotDown, controls.shotRight - controls.shotLeft);
			var halfPI = Math.PI / 2;
			if(canonAngle >= halfPI && targetAngle <= -halfPI) {
				canonAngle = canonAngle * d + (targetAngle + Math.PI * 2) * (1 - d);
			} else {
				canonAngle = canonAngle * d + targetAngle * (1 - d);
			}
			canon.position.set(canonRadius * Math.cos(canonAngle), canonRadius * Math.sin(canonAngle), 0);

			var g = new THREE.SphereGeometry(8, 6, 6);
			var m = new THREE.MeshBasicMaterial({color: 0xff0000});
			var bullet = new THREE.Mesh(g, m);
			bullet.position.set(this.mesh.position.x, this.mesh.position.y, 0);
			bullet.speedX = 6 * Math.cos(canonAngle);
			bullet.speedY = 6 * Math.sin(canonAngle);
			bullet.counter = 0;
			this.bullets.add(bullet);
		}

		// 自弾処理
		var removeBullets = [];
		this.bullets.children.forEach(function(b) {
			b.position.x += b.speedX;
			b.position.y += b.speedY;
			b.counter++;

			if(b.counter > 60) {
				removeBullets.push(b);
			}
		});

		// 自弾削除
		for (var i = 0; i < removeBullets.length; i++) {
			this.bullets.remove(removeBullets[i]);
		}
	};

	// イベントリスナー
	this.domElement.addEventListener('keydown', onKeyDown, false);
	this.domElement.addEventListener('keyup', onKeyUp, false);

	function onKeyDown(e) {
		switch(e.keyCode) {
			case 37: // key "Left"
			e.preventDefault();
			controls.shotLeft = true;
			break;

			case 38: // key "Up"
			e.preventDefault();
			controls.shotUp = true;
			break;

			case 39: // key "Right"
			e.preventDefault();
			controls.shotRight = true;
			break;

			case 40: // key "Down"
			e.preventDefault();
			controls.shotDown = true;
			break;

			// WASD
			case 65: // key "A"
			e.preventDefault();
			controls.moveLeft = true;
			break;

			case 87: // key "W"
			e.preventDefault();
			controls.moveUp = true;
			break;

			case 68: // key "D"
			e.preventDefault();
			controls.moveRight = true;
			break;

			case 83: // key "S"
			e.preventDefault();
			controls.moveDown = true;
			break;
		}
	}

	function onKeyUp(e) {
		switch(event.keyCode){
			case 37:
			e.preventDefault();
			controls.shotLeft = false;
			break;

			case 38:
			e.preventDefault();
			controls.shotUp = false;
			break;

			case 39:
			e.preventDefault();
			controls.shotRight = false;
			break;

			case 40:
			e.preventDefault();
			controls.shotDown = false;
			break;

			// WASD
			case 65: // key "A"
			e.preventDefault();
			controls.moveLeft = false;
			break;

			case 87: // key "W"
			e.preventDefault();
			controls.moveUp = false;
			break;

			case 68: // key "D"
			e.preventDefault();
			controls.moveRight = false;
			break;

			case 83: // key "S"
			e.preventDefault();
			controls.moveDown = false;
			break;
		}
	}
};