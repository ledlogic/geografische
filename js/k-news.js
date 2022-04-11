kApp.news = {
	items: [],
	displayMs: 15 * 1000,
	maxDisplay: 16,

	init: function() {
	},
	
	add: function(team, text) {
		var that = this;
		var ms = kApp.date.getMs();
		var item = {
			ms: ms,
			team: team,
			text: text,
			active: 1.0
		}
		that.items.unshift(item);
		kApp.news.checkItemCount();
		//kApp.log(that.items);
	},
	
	update: function(newMs) {
		_.each(kApp.news.items, function(item) {
			kApp.news.checkExpiration(item, newMs);
		});
	},
	
	checkExpiration: function(item, newMs) {
		if (item.active) {
			var displayMs = kApp.news.displayMs;
			var active = (displayMs + item.ms - newMs) / displayMs;
			item.active = Math.max(0, active);
		}
	},
	
	checkItemCount: function() {
		var activeCount = 0;
		_.each(kApp.news.items, function(item) {
			if (item.active) {
				activeCount++;
			}
			if (activeCount > kApp.news.maxDisplay) {
				item.active = 0;
			}
		});
	}
};