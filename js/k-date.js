kApp.date = {
	config: {
		startMs: 0
	},
	init: function() {
		kApp.date.config.startMs = kApp.date.getMs();
	},
	getMs: function() {
		var d = new Date();
		var t = d.getTime();
		t -= kApp.date.config.startMs;
		return t;
	}
}