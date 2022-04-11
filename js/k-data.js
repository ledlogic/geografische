kApp.data = {
	init: function() {
		this.showGame();
	},
	
	showGame: function() {
		var h = [];
		h.push("<table id=\"k-game-data-table\">");

		h.push("<tr>");
		h.push("<th>");
		h.push("Turn");
		h.push("</th>");
		h.push("<td class=\"k-game-turn\">");
		h.push("<span id=\"k-game-turn-value\">");
		h.push("</span>");
		if (!kApp.game.settings.started) {
			h.push("<button class=\"k-data-button k-game-start\" >Start</button>");
		}
		h.push("</td>");
		h.push("</tr>");
		
		h.push("<tr>");
		h.push("<th>");
		h.push("Rate");
		h.push("</th>");
		h.push("<td class=\"k-game-turn-rate\">");
		h.push("<button class=\"k-data-button k-game-turn-rate-decr\" data-rate-change=\"0.5\">-</button>");
		h.push("<span id=\"k-game-turn-rate-value\">");
		h.push("</span>");
		h.push("<button class=\"k-data-button k-game-turn-rate-incr\" data-rate-change=\"2.0\">+</button>");
		h.push(" ");
		h.push("<button class=\"k-data-button k-game-turn-rate-reset\">Reset</button>");
		h.push("</tr>");
		
		h.push("</table>");
		
		$("#k-game-data").html(h.join(""));
		$("#k-game").fadeIn();
		
		kApp.data.updateGame();
		
		var $buttons = $(".k-game-turn-rate-decr, .k-game-turn-rate-incr");
		$buttons.on("click", kApp.events.changeTurnRate);
		
		var $reset = $(".k-game-turn-rate-reset");
		$reset.on("click", kApp.events.resetTurnRate);
	},
	
	updateGame: function() {
		var turn = (Math.round(kApp.game.settings.turn * 100) / 100).toFixed(2);
		var rate = Math.round(1.0/kApp.game.settings.turnRatePerMs);
		$("#k-game-turn-value").html(turn);
		$("#k-game-turn-rate-value").html("1/"+rate);
	}
};