var kApp = {
	init: function() {
		kApp.date.init();
		kApp.canvas.init();
		kApp.world.init();
		kApp.game.init();
		kApp.controls.init();
		kApp.events.init();
		kApp.render.init();
		kApp.data.init();
		kApp.ai.init();
		kApp.news.init();
	},
	log: function(s) {
		console.log(s);
	}
};

//$(window).on('scroll resize', getVisible);
function windowResized() {
	kApp.canvas.sizeCanvas();
}
