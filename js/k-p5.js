function setup() {
	kApp.init();
}

function draw() {
	kApp.render.bg();
	
	if (kApp.game.settings.paused) {
		
	} else {
		//kApp.render.nebula();
		kApp.render.stars();
		kApp.render.grid();
		kApp.render.world();
		kApp.render.news();
		kApp.render.fps();
		kApp.game.update();
	}	
}

function checkBoundaries() {
	return mouseX > 0 && mouseY > 0 && mouseX < width && mouseY < height;
}

function mouseClicked() {
	if (checkBoundaries()) {
	}
}

function mousePressed() {
	if (checkBoundaries()) {
	}
}

function mouseDragged() {
	if (checkBoundaries()) {
	}
}
