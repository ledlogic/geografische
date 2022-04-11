kApp.bg = {
	count: 0,
	initialized: 0,
	stars: [],
	init: function(size) {
		if (!kApp.bg.initialized) {
			kApp.bg.starsArr(1000);
			kApp.bg.initialized = true;
		}
	},
	// star constructor
	star: function() {
		this.rPt = kApp.random.rPtInRrect();
		this.intensity = Math.random();
	},
	starsArr: function(count) {
		for (var i=0; i<count; i++) {
			kApp.bg.stars[kApp.bg.stars.length] = new kApp.bg.star();
		}
		kApp.bg.count = kApp.bg.stars.length;
	}
};
