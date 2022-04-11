kApp.world = {
	settings: {
		qzones: 50000, // approximate number of zones (will be a power of 2 after conversion).
		rrect: null,
		crect: null,
		ratio: 0.9, // ratio of world to full space
		zones: [],
		coordZones: [],
		coordMax: []
	},
	
	zoneTypes: [
		{ 
			type: "lnd",
		  	name: "Land",
		  	color: { r: 188, g: 147, b: 84}
		},
		{ 
			type: "fst",
		  	name: "Forest",
		  	color: { r: 34, g: 139, b: 34}
		},
		{ 
			type: "mtn",
		  	name: "Mountain",
		  	color: { r: 171, g: 88, b: 62}
		},
		{
			type: "swt",
		 	name: "Shallow Water",
		 	color: { r: 116, g: 204, b: 244}
		},
		{
			type: "mwt",
		 	name: "Medium Water",
		 	color: { r: 28, g: 163, b: 236}
		},
		{
			type: "dwt",
		 	name: "Deep Water",
		 	color: { r: 15, g: 137, b: 218}
		}
	],
	
	init: function() {
		kApp.log("world.init");
		var qzones = kApp.world.settings.qzones;
		var zones = kApp.world.settings.zones;
		var coordZones = kApp.world.settings.coordZones;
		var coordMax = kApp.world.settings.coordMax;
		var rrect = kApp.world.settings.rrect;
		var rarea = rrect.width * rrect.height;
		var rzonearea = rarea / qzones;
		var rgrid = Math.sqrt(rzonearea);
		var rgridx = rrect.width/Math.ceil(rrect.width / rgrid);
		var rgridy = rrect.height/Math.ceil(rrect.height / rgrid);
		var ix=0
		for (var x=rrect.xMin; ; ix++) {
			x=rrect.xMin + ix*rgridx;
			if (x+0.5*rgridx>rrect.xMax) break;
			coordZones[ix] = [];
			var iy = 0;
			for (var y=rrect.yMin; ; iy++) {
				y=rrect.yMin + iy*rgridy;
				if (y+0.5*rgridy>rrect.yMax) break;
				var wzrrect = new kApp.geom.rrect(x, y, x+rgridx, y+rgridy);
				var wzcrect = kApp.geom.rRect2cRect(wzrrect);
				var wztype = kApp.world.zoneTypes[0];
				var wz = new WorldZone(wzrrect, wzcrect, wztype);
				zones.push(wz);
				coordZones[ix][iy] = wz;
				coordMax.x = ix;
				coordMax.y = iy; 
			}
		}
		kApp.world.generateTypes();
	},
	
	generateTypes: function() {
		var coordZones = kApp.world.settings.coordZones;
		var coordMax = kApp.world.settings.coordMax;
		for (var ix=0; ix<=coordMax.x; ix++) {
			for (var iy=0; iy<=coordMax.y; iy++) {
				var wz = coordZones[ix][iy];
				wz.type = kApp.world.randomWorldZoneType(); 
			}
		}
	},
	
	randomWorldZoneType: function() {
		var t = kApp.random.inArray(kApp.world.zoneTypes);
		return t;
	}
}

function WorldZone(rrect, crect, type) {
	this.rrect = rrect;
	this.crect = crect;
	this.type = type;
}