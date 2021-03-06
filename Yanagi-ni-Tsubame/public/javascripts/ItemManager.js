var ItemManager = function(scene, player, getItems) {
	var itemsArray = [];

	var Item = function(data) {
		this.id = data.id;
		this.mesh = new THREE.Object3D();
		this.mesh.position.set(data.x, data.y, 0);
		this.halfSize = 0;

		switch(data.type) {
			case "exp":
			this.halfSize = 6;

			for (var i = 0; i < 8; i++) {
				var ix = i & 1;
				var iy = (i >> 1) & 1;
				var iz = (i >> 2) & 1;
				var g = new THREE.BoxGeometry(3, 3, 3);
				var m = new THREE.MeshLambertMaterial({color : 0xeeeeee});
				var box = new THREE.Mesh(g, m);
				box.position.set(2 - 4 * ix, 2 - 4 * iy, 2 - 4 * iz);
				this.mesh.add(box);
			}

			this.animate = function() {
				this.mesh.rotation.x += 0.05;
				this.mesh.rotation.y += 0.05;
			};
			break;
		}
	}

	this.localUpdate = function() {
		itemsArray.forEach(function(item) {
			item.animate();
		});

		// プレイヤーとアイテムの当たり判定
		var playerHitBox = new THREE.Box2(new THREE.Vector2(player.mesh.position.x - player.halfSize, player.mesh.position.y - player.halfSize),
			new THREE.Vector2(player.mesh.position.x + player.halfSize, player.mesh.position.y + player.halfSize));

		itemsArray.forEach(function(item) {
			var itemHitBox = new THREE.Box2(new THREE.Vector2(item.mesh.position.x - item.halfSize, item.mesh.position.y - item.halfSize),
				new THREE.Vector2(item.mesh.position.x + item.halfSize, item.mesh.position.y + item.halfSize));

			if(playerHitBox.isIntersectionBox(itemHitBox)) {
				getItems.push({ id : item.id });
			}
		});
	};

	this.update = function(allItems) {
		// 鯖にいないアイテムの検索
		var removeItemsID = [];
		itemsArray.forEach(function(item) {
			// TODO filter関数使いたかった
			var flag = true;
			for (var i = 0; i < allItems.length; i++) {
				if(allItems[i].id == item.id) {
					flag = false;
					break;
				}
			};

			if(flag) {
				removeItemsID.push(item.id);
			}
		});

		// アイテムの削除
		removeItemsID.forEach(function(rmItemID) {
			for (var i = 0; i < itemsArray.length; i++) {
				if(itemsArray[i].id == rmItemID) {
					scene.remove(itemsArray[i].mesh);
					itemsArray.splice(i, 1);
					break;
				}
			};
		});

		// アイテムが自前の配列に登録してあるか検索
		allItems.forEach(function(ai) {
				// 見つかれば位置の更新
				// そうじゃなければ新規登録
				var isFinded = false;

				itemsArray.forEach(function(item) {
					if(item.id == ai.id) {
						item.mesh.position.set(ai.x, ai.y, 0);
						isFinded = true;
					};
				});

				if(!isFinded) {
					var newItem = new Item(ai);
					itemsArray.push(newItem);
					scene.add(newItem.mesh);
				}
			});
	};
};