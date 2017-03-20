(function () {
	'use strict';

	var maze = [
	//						East
	//  0, 1, 2, 3, 4, 5, 6, 7, 8, 9
		[-1, 0,-1,-1,-1,-1,-1,-1,-1,-1], 	// 0
		[-1, 0,-1, 0, 0, 0,-1,-1, 0,-1], 	// 1
		[-1, 0,-1, 0,-1, 0,-1, 0, 0,-1], 	// 2
		[-1, 0,-1, 0,-1, 0,-1, 0,-1,-1], 	// 3
		[-1, 0, 0, 0,-1, 0,-1, 0, 0,-1], 	// 4
		[-1,-1,-1,-1,-1, 0,-1,-1, 0,-1], 	// 5
		[-1, 0, 0, 0, 0, 0,-1, 0, 0,-1], 	// 6
		[-1, 0,-1,-1,-1,-1,-1, 0, 0,-1], 	// 7
		[-1, 0,-1,-1,-1,-1,-1,-1,-1,-1], 	// 8
		[-1, 0, 0, 0, 0, 0, 0, 0, 0,-1], 	// 9
		[-1,-1,-1,-1,-1,-1,-1,-1,99,-1] 	// 10
	//						West
	];

	// General directions:
	//

	var character = {
		facing: 'west',
		position: {
			y: 0, x: 1 	// Initial positions, maze enterance
		}
	};

	function toMyLeft (character) {
		var hasWall = false;
		switch (character.facing) {
			case 'south':
				hasWall = maze[character.position.y + 1][character.position.x] == -1; // west of me
				break;
			case 'west':
				hasWall = maze[character.position.y][character.position.x + 1] == -1; // south of me
				break;
			case 'north':
				hasWall = maze[character.position.y - 1][character.position.x] == -1; // east of me
				break;
			case 'east':
				hasWall = maze[character.position.y][character.position.x + 1] == -1; // north of me
				break;
		}
		return hasWall;
	}

	function inFrontOfMe (character) {
		var hasWall = false;
		switch (character.facing) {
			case 'south':
				hasWall = maze[character.position.y][character.position.x + 1] == -1;
				break;
			case 'west':
				hasWall = maze[character.position.y + 1][character.position.x] == -1;
				break;
			case 'north':
				hasWall = maze[character.position.y][character.position.x - 1] == -1;
				break;
			case 'east':
				hasWall = maze[character.position.y - 1][character.position.x] == -1;
				break;
		}
		return hasWall;
	}

	function toMyRight (character) {
		var hasWall = false;
		switch (character.facing) {
			case 'south':
				hasWall = maze[character.position.y - 1][character.position.x] == -1; // east of me
				break;
			case 'west':
				hasWall = maze[character.position.y][character.position.x - 1] == -1; // north of me
				break;
			case 'north':
				hasWall = maze[character.position.y + 1][character.position.x] == -1; // west of me
				break;
			case 'east':
				hasWall = maze[character.position.y][character.position.x + 1] == -1; // south of me
				break;
		}
		return hasWall;
	}

	function turnLeft (character) {
		switch (character.facing) {
			case 'south':
				character.position.y = character.position.y + 1;
				character.facing = 'west';
				break;
			case 'west':
				character.position.x = character.position.x + 1;
				character.facing = 'south';
				break;
			case 'north':
				character.position.y = character.position.y - 1;
				character.facing = 'east';
				break;
			case 'east':
				character.position.x = character.position.x - 1;
				character.facing = 'norht';
				break;
		}

		return character;
	}

	function turnRight (character) {
		switch (character.facing) {
			case 'south':
				character.position.y = character.position.y - 1;
				character.facing = 'east';
				break;
			case 'west':
				character.position.x = character.position.x - 1; // go north
				character.facing = 'north';
				break;
			case 'north':
				character.position.y = character.position.y + 1;
				character.facing = 'west';
				break;
			case 'east':
				character.position.x = character.position.x + 1; // go south
				character.facing = 'south';
				break;
		}

		return character;
	}

	function goForward (character) {
		switch (character.facing) {
			case 'south':
				character.position.x = character.position.x + 1;
				break;
			case 'west':
				character.position.y = character.position.y + 1;
				break;
			case 'north':
				character.position.x = character.position.x - 1;
				break;
			case 'east':
				character.position.y = character.position.y - 1;
				break;
		}

		return character;
	}

	function goBackward (character) {
		switch (character.facing) {
			case 'south':
				character.position.x = character.position.x - 1;
				character.facing = 'north';
				break;
			case 'west':
				character.position.y = character.position.y - 1;
				character.facing = 'east';
				break;
			case 'north':
				character.position.x = character.position.x + 1;
				character.facing = 'south';
				break;
			case 'east':
				character.position.y = character.position.y + 1;
				character.facing = 'west';
				break;
		}

		return character;
	}

	function move(moveData) {
		maze[moveData.character.position.y][moveData.character.position.x] = ++moveData.originalValue;
		if (!toMyRight(moveData.character)) {
			moveData.character = turnRight(moveData.character);
		} else if (!inFrontOfMe(moveData.character)) {
			moveData.character =  goForward(moveData.character);
		} else if (!toMyLeft(character)) {
			moveData.character = turnLeft(moveData.character);
		} else {
			moveData.character = goBackward(moveData.character);
		}
		return moveData.character;
	}

	function renderMazeOnPage() {
		for (var i = 0; i < maze.length; i++) {
			for (var j = 0; j < maze[0].length; j++) {
				var renderThis = document.createElement('div');
				if (maze[i][j] == -1) {
					renderThis.setAttribute('class', 'wall-block');
				} else if (maze[i][j] === 0) {
					renderThis.setAttribute('class', 'empty-space animtae');
					renderThis.setAttribute('id', 'pos_' + i + '_' + j);
				} else if (maze[i][j] === 99) {
					var targetImage = document.createElement('img');
					targetImage.setAttribute('src', '../resources/images/cheese.png');
					targetImage.setAttribute('style', 'height: 21px; width: 21px; margin: -4px 0 4px;');
					renderThis.setAttribute('class', 'empty-space animate');
					renderThis.appendChild(targetImage);
				}

				mazeContainer.appendChild(renderThis);
			}
		}
	}

	function unRenderChaeacter(lastPosition) {
		var footstepsCube = document.querySelector('#pos_' + lastPosition.y + '_' + lastPosition.x);
		// footstepsCube.removeChild(footstepsCube.childNodes[0]);
	}

	function renderChaeacter (character) {
		var y = character.position.y,
			x = character.position.x,
			facing = character.facing;

		var characterCube = $('#pos_' + y + '_' + x);
		if (characterCube) {
			switch (facing) {
				case 'south':
					characterImage.setAttribute('class', 'character-south');
					break;
				case 'west':
					characterImage.setAttribute('class', 'character-west');
					break;
				case 'north':
					characterImage.setAttribute('class', 'character-north');
					break;
				case 'east':
					characterImage.setAttribute('class', 'character-east');
					break;
			}
			characterCube.append(characterImage).delay(1000);
		}
	}

	function renderMaze() {
		for (var i = 0; i < maze.length; i++) {
			var line = '';
			for (var j = 0; j < maze[0].length; j++) {
				var renderThis = ' ';
				if (maze[i][j] !== '*') {
					if (maze[i][j] == -1) { renderThis = 'O'; }
					if (maze[i][j] > 0) { renderThis = maze[i][j]; }
				} else {
					renderThis = '*';
				}
				line += renderThis;
			}
			console.log(line);
		}
		console.log(' ');
	}

	function wait() {
		for (var i = 0; i < 100; i++) {
			console.log('1');
		}
	}

	function resetMaze() {
		character = {
				facing: 'west',
				position: {
					y: 0, x: 1 	// Initial positions, maze enterance
				}
			};
	}

	function startMaze() {
		resetMaze();
		var steps = 0;
		while ((maze[character.position.y][character.position.x] !== 99) && (steps < 80)) {
			if (maze[character.position.y][character.position.x] == 99) { break; }
			var preserveValue = maze[character.position.y][character.position.x];
			var preservePosition = character.position;
			maze[character.position.y][character.position.x] = '*';
			renderMaze();
			steps++;
			character = move({ character: character, originalValue: preserveValue });
			renderChaeacter(character);
			//unRenderChaeacter(preservePosition);

			console.log('Steps: ', steps);
		}
	}

	var mazeContainer = document.querySelector('.maze-container');
	var characterImage = document.createElement('img');
		characterImage.src = '../resources/images/mouse.png';
		characterImage.setAttribute('style', 'height: 21px; width: 21px; margin: -4px 0 4px;');

	var btn = document.querySelector('#start-button');
	btn.addEventListener('click', startMaze);

	renderMazeOnPage();
	renderChaeacter (character);
}());
