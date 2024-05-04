
/*
python -m http.server 8000 --directory ./contents^C
*/
var constMaxTileCount = 40;

function Number1D() {
	var self = this;
	self.array = function(n) {
		var res = Array.from({length: n});
	}
	self.zeros = function(n) {
		var res = Array.from({length: n}, () => 0);
	}
	self.ones = function(n) {
		var res = Array.from({length: n}, () => 1);
	}
	self.arange = function(n, m) {
		var size = m - n;
		var res = Array.from({size}, (_, index) => index + n);
		return res;
	}
	self.clone = function(a) {
		var res = [...a];
		return res;
	}
	self.shuffle = function(a) {
		var res = [...a];
		for (var i = res.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			[res[i], res[j]] = [res[j], res[i]]; // 要素を入れ替える
		}
		return res;
	}

	self.repeatArray = function(a, n) {
		var res = [];
		for(var i = 0; i < n; i += 1) {
			res = res.concat(a);
		}
		return res;
	}
}

var n1d = new Number1D();

function LoopInclement(charactersString) {
	var self = this;
	self.characters = [...charactersString];
	self.index = 0;
	self.get = function() {
		var me = this;
		var character = me.characters[me.index];
		me.index += 1;
		return character;
	}
}

function Index() {
    var self = this;
	
	self.alphabetLowerCharacters = Array.from({ length: 26 }, (_, index) => String.fromCharCode(97 + index));
	self.alphabetUpperCharacters = Array.from({ length: 26 }, (_, index) => String.fromCharCode(65 + index));
	self.alphabetCharacters = self.alphabetLowerCharacters.concat(self.alphabetUpperCharacters);
	self.numberCharacters = Array.from({ length: 10 }, (_, index) => String(index));
	self.symbolCharacters = ["-", "_", "!", "#", "$", "%", "&", "^", "(", ")", "+", "*", "/"];

	self.mainMatrixElement = function() {
		return $("#div-encrypto-matrix-main");
	}
	self.tileTemplateElement = function() {
		return $("#div-tile-template");
	}
	
	self.getSeedNumber = function() {
		var me = this;
		var seedNumberString = $("#input-seed-number").val();
		return parseInt(seedNumberString);
	}
	
	self.clearMainMatrixView = function() {
		var me = this;
		me.mainMatrixElement().empty()
	}
	
	self.createTileClone = function() {
		var me = this;
		var clone = me.tileTemplateElement().clone();
		return clone;
	}
	self.createTile = function(centerCharacter, cornerCharacters) {
		var me = this;
		var cloneTile = me.createTileClone();
		console.log("#####", cloneTile.find("[name='center']"));
		cloneTile.find("[name='center']").text(centerCharacter);
		var elements = [
			cloneTile.find("[name='top-left']"),
			cloneTile.find("[name='top-right']"),
			cloneTile.find("[name='bottom-right']"),
			cloneTile.find("[name='bottom-left']"),
		];
		cornerCharacters.forEach(function(character, index) {
			elements[index].text(character);
		});
		return cloneTile;
	}
	
	self.filledOverMaxTile = function(characters) {
		var me = this;
		var length = characters.length;
		var digitsMultipleFactor = Math.ceil(constMaxTileCount / length);
		var res = n1d.repeatArray(characters, digitsMultipleFactor);
		return res;
	}

	self.createCryproValues = function() {
		var me = this;
		var items = [];
		var symbolCharacters4 = n1d.shuffle(me.symbolCharacters).slice(0, 4);
		var rootCharacters = [].concat(
			me.numberCharacters,
			me.alphabetLowerCharacters,
			symbolCharacters4
		);
		console.log("### rootCharacters", rootCharacters);
		var originNumberCharacters = n1d.clone(me.numberCharacters);
		var numberCharacters = me.filledOverMaxTile(originNumberCharacters);
		var originAlphabetNumberCharacters = me.numberCharacters.concat(me.alphabetLowerCharacters, me.alphabetUpperCharacters);
		var alphabetNumberCharacters = me.filledOverMaxTile(originAlphabetNumberCharacters);
		var originAalphabetNumberSymbolCharacters = me.numberCharacters.concat(me.alphabetLowerCharacters, me.alphabetUpperCharacters, me.symbolCharacters);
		var alphabetNumberSymbolCharacters = me.filledOverMaxTile(originAalphabetNumberSymbolCharacters);
		var correspondenceCharacters = n1d.clone(rootCharacters);
		numberCharacters = n1d.shuffle(numberCharacters);
		alphabetNumberCharacters = n1d.shuffle(alphabetNumberCharacters);
		alphabetNumberSymbolCharacters = n1d.shuffle(alphabetNumberSymbolCharacters);
		correspondenceCharacters = n1d.shuffle(correspondenceCharacters);
		
		for(var i = 0; i < constMaxTileCount; i += 1) {
			items.push({
				"center": String(rootCharacters[i]),
				"top-left": String(numberCharacters[i]),
				"top-right": String(alphabetNumberCharacters[i]),
				"bottom-right": String(alphabetNumberSymbolCharacters[i]),
				"bottom-left": String(correspondenceCharacters[i]),
			});
		}
		return items;
	}
	
	self.createTileCoordinates = function() {
		var me = this;
		var width = 91.0;
		var height = 55.0;
		var startLeft = 1;
		var startTop = 1;
		var margin = 1;
		var tileWidth = 10;
		var tileHeight = 10;
		var coordinates = [];
		for(var x = 0; x < 8; x += 1) {
			for(var y = 0; y < 5; y += 1) {
				coordinates.push({
					"left": startLeft + tileWidth * x + margin,
					"top": startTop + tileHeight * y + margin
				});
			}
		}
		return coordinates;
	}
	self.createTileElements = function() {
		var me = this;
		var allTileElements = [];
		for(var i = 0; i < constMaxTileCount; i += 1) {
			var tile = me.createTile(String(i), [0, 9, 8, 7].map(x => String(x)));
			allTileElements.push(tile);
		}
		return allTileElements;
	}
	self.updateMainMatrix = function() {
		var me = this;
		var values = me.createCryproValues();
		var coordinates = me.createTileCoordinates();
		var tiles = me.createTileElements();
		for(var i = 0; i < constMaxTileCount; i += 1) {
			var value = values[i];
			var coordinate = coordinates[i];
			var tile = tiles[i];
            tile.css({
                position: 'absolute',
                left: coordinate["left"] + "mm",
                top: coordinate["top"] + "mm",
                width: '9mm',
                height: '9mm',
                //backgroundColor: '#'+Math.floor(Math.random()*16777215).toString(16) // ランダムな背景色
            });
			tile.find("[name=center]").val(value["center"]);
			tile.find("[name=top-left]").val(value["top-left"]);
			tile.find("[name=top-right]").val(value["top-right"]);
			tile.find("[name=bottom-left]").val(value["bottom-left"]);
			tile.find("[name=bottom-right]").val(value["bottom-right"]);
		}
		
		me.clearMainMatrixView();
		tiles.forEach(function(tileElement) {
			tileElement.show();
			me.mainMatrixElement().append(tileElement);
		});
	}
	
    self.start = function() {
        console.log("APPLY INDEX.JS ************************");
		var me = this;
		me.updateMainMatrix();
		/*
		console.log("self.alphabetLowerCharacters", self.alphabetLowerCharacters);
		console.log("self.alphabetUpperCharacters", self.alphabetUpperCharacters);
		console.log("self.numberCharacters", self.numberCharacters);
		console.log("self.symbolCharacters", self.symbolCharacters);
		var tileValues = me.setupValues();
		console.log(tileValues);
		*/
    }
}

