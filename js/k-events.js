kApp.events = {
	init: function() {
	},
	
	changeTurnRate: function() {
		var $that = $(this);
		var change = parseFloat($that.data("rate-change"), 10);
		var newRate = kApp.game.settings.turnRatePerMs * change;
		newRate = Math.max(newRate, kApp.game.settings.minTurnRatePerMs);
		newRate = Math.min(newRate, kApp.game.settings.maxTurnRatePerMs);
		kApp.game.settings.turnRatePerMs = newRate;
		kApp.data.updateGame();
	},
	
	resetTurnRate: function() {
		kApp.game.settings.turnRatePerMs = kApp.game.settings.defaultTurnRatePerMs; 
		kApp.data.updateGame();
	},
	
	startGame: function() {
		kApp.game.start();
	}
}
