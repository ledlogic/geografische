kApp.render = {
	settings: {
		grid: {
			major: false,
			minor: false,
			ellipses: false,
			ordinals: false
		},
		moves: {
			delta: 0.04,
			velocity: 4,
			init: function() {
				kApp.render.settings.moves.start = 0;
				kApp.render.settings.moves.end = kApp.render.settings.moves.delta;				
			},
			incr: function(dist) {
				kApp.render.settings.moves.start += kApp.render.settings.moves.velocity / dist;
				kApp.render.settings.moves.end = Math.min(kApp.render.settings.moves.end + kApp.render.settings.moves.velocity / dist, 1.0);
				if (kApp.render.settings.moves.start >= 1 - 0.05) {
					kApp.render.settings.moves.init();
				}
			}
		}
	},
	
	init: function() {
		kApp.render.settings.moves.init();
	},
	
	fps: function() {
		var fps = frameRate();
		fill(255);
		stroke(0);
		textSize(14);
		textStyle(NORMAL);
		textFont('Microgramma Extd D');
		
		var y = kApp.geom.map.crect.height - 10;
		text("FPS: " + fps.toFixed(0), 10, y);
	},
	
	bg: function() {
		background(30,30,30);
	},
	
	grid: function() {
		var major = 100;
		var minor = 20;
		
		var xMin = kApp.geom.map.rrect.xMin;
		xMin = Math.floor(xMin / major - 1) * major;		
		var xMax = kApp.geom.map.rrect.xMax;
		xMax = Math.ceil(xMax / major + 1) * major;
		
		var yMin = kApp.geom.map.rrect.yMin;
		yMin = Math.floor(yMin / major - 1) * major;
		var yMax = kApp.geom.map.rrect.yMax;
		yMax = Math.ceil(yMax / major + 1) * major;

		// minor gridlines
		if (kApp.render.settings.grid.minor) {
			stroke(25, 25, 75);
			for (var x=xMin; x<=xMax; x+= minor) {
				var pt1 = kApp.geom.rPt2Cpt(x, yMin);
				var pt2 = kApp.geom.rPt2Cpt(x, yMax);
				line(Math.max(0,pt1.x), Math.max(0,pt1.y), Math.min(kApp.geom.map.crect.width,pt2.x), Math.min(kApp.geom.map.crect.height,pt2.y));
			}
			
			for (var y=yMin; y<=yMax; y+= minor) {
				var pt1 = kApp.geom.rPt2Cpt(xMin, y);
				var pt2 = kApp.geom.rPt2Cpt(xMax, y);
				line(Math.max(0,pt1.x), Math.max(0,pt1.y), Math.min(kApp.geom.map.crect.width,pt2.x), Math.min(kApp.geom.map.crect.height,pt2.y));
			}
		}
		
		// major gridlines
		if (kApp.render.settings.grid.major) {
			stroke(40, 40, 100);
	
			for (var x=xMin; x<=xMax; x+= major) {
				var pt1 = kApp.geom.rPt2Cpt(x, yMin);
				var pt2 = kApp.geom.rPt2Cpt(x, yMax);
				line(Math.max(0,pt1.x), Math.max(0,pt1.y), Math.min(kApp.geom.map.crect.width,pt2.x), Math.min(kApp.geom.map.crect.height,pt2.y));
			}
					
			for (var y=yMin; y<=yMax; y+= major) {
				var pt1 = kApp.geom.rPt2Cpt(xMin, y);
				var pt2 = kApp.geom.rPt2Cpt(xMax, y);
				line(Math.max(0,pt1.x), Math.max(0,pt1.y), Math.min(kApp.geom.map.crect.width,pt2.x), Math.min(kApp.geom.map.crect.height,pt2.y));
			}
		}
		
		// major ellipses
		if (kApp.render.settings.grid.ellipses) {
			noFill();
			var pt1 = kApp.geom.rPt2Cpt(0, 0);
			for (var x=xMin; x<0; x+= major) {
				var pt2 = kApp.geom.rPt2Cpt(-x, 0);
				var pt3 = kApp.geom.rPt2Cpt(x, 0);
				var w = Math.abs(pt2.x-pt3.x);
				var h = Math.abs(pt2.x-pt3.x);
				ellipse(pt1.x, pt1.y, w, h);
			}
		}
		
		// ordinal gridlines
		if (kApp.render.settings.grid.ordinals) {
			stroke(110, 110, 110);
			{
				var pt1 = kApp.geom.rPt2Cpt(0, yMin);
				var pt2 = kApp.geom.rPt2Cpt(0, yMax);
				line(Math.max(0,pt1.x), Math.max(0,pt1.y), Math.min(kApp.geom.map.crect.width,pt2.x), Math.min(kApp.geom.map.crect.height,pt2.y));
			}
			
			for (var y=yMin; y<=yMax; y+= major) {
				var pt1 = kApp.geom.rPt2Cpt(xMin, 0);
				var pt2 = kApp.geom.rPt2Cpt(xMax, 0);
				line(Math.max(0,pt1.x), Math.max(0,pt1.y), Math.min(kApp.geom.map.crect.width,pt2.x), Math.min(kApp.geom.map.crect.height,pt2.y));
			}
		}
	},
		
	star: function(s) {
		var st = Math.round(s.intensity*255);
		stroke(st);
		var pt = kApp.geom.rPt2Cpt(s.rPt.x, s.rPt.y);
		point(pt.x, pt.y);
	},
	stars: function() {
		for (var i=0;i<kApp.bg.stars.length;i++) {
			var s = kApp.bg.stars[i];
			kApp.render.star(s);
		}
	},
	
	news: function() {
		var x0 = 10;
		var y0 = 20;
		var yDelta = 20;
		for (var i=0; i<kApp.news.items.length; i++) {
			var item = kApp.news.items[i];
			if (item.active > 0.1) {
				textSize(14);
				textFont("Calibri");
				textStyle(ITALIC);
				var itemColor = color(item.team ? item.team : "(100,220,100)");
				itemColor.setAlpha(Math.round(255 * item.active));
				fill(itemColor);
				var t = item.text;
				text(t, x0, (i * yDelta) + y0);
			}
		}
	},
	
	world: function() {
		kApp.render.worldBoard();
		kApp.render.worldZones();
	},
	
	worldBoard: function() {
		var left = kApp.world.settings.crect.xMin;
		var width = kApp.world.settings.crect.width;
		
		var top = kApp.world.settings.crect.yMin;
		var height = kApp.world.settings.crect.height;

		fill(0,0,0);
		stroke(200, 200, 200);
		rect(left, top, width, height);
	},
	
	worldZones: function() {
		var coordZones = kApp.world.settings.coordZones;
		var coordMax = kApp.world.settings.coordMax;
		for (var x = 0; x < coordMax.x; x++) {
			for (var y = 0; y < coordMax.y; y++) {
				var coordZone = coordZones[x][y];
				kApp.render.worldZone(coordZone);
			}
		}
	},
	
	worldZone: function(wz) {
		var left = wz.crect.xMin;
		var width = wz.crect.width;
		var top = wz.crect.yMin;
		var height = wz.crect.height;
		smooth();
		var t = wz.zoneType;	
		stroke(t.color.r, t.color.g, t.color.b);
		fill(t.color.r, t.color.g, t.color.b);
		rect(left, top, width, height);
	}
};
