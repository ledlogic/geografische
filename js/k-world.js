kApp.world = {
	settings: {
		qzones: 25000, // approximate number of zones (will be a power of 2 after conversion).
		rrect: null,
		crect: null,
		ratio: 0.9, // ratio of world to full space
		coordZones: [],
		coordMax: []
	},
	
	zoneTypes: [
		{
			i:0,
			zoneType: "lnd",
			contType: "L",
		  	name: "Land",
		  	color: { r: 188, g: 147, b: 84}
		},
		{ 
			i:1,
			zoneType: "grs",
			contType: "L",
		  	name: "Grassland",
		  	color: { r: 158, g: 230, b: 141}
		},
		{ 
			i:2,
			zoneType: "fst",
			contType: "L",
		  	name: "Forest",
		  	color: { r: 34, g: 139, b: 34}
		},
		{ 
			i:3,
			zoneType: "mtn",
			contType: "L",
		  	name: "Mountain",
		  	color: { r: 193, g: 188, b: 167}
		},
		{
			i:4,
			zoneType: "swt",
			contType: "W",
		 	name: "Shallow Water",
		 	color: { r: 116, g: 204, b: 244}
		},
		{
			i:5,
			zoneType: "mwt",
			contType: "W",
		 	name: "Medium Water",
		 	color: { r: 28, g: 163, b: 236}
		},
		{
			i:6,
			zoneType: "dwt",
			contType: "W",
		 	name: "Deep Water",
		 	color: { r: 15, g: 137, b: 218}
		}
	],
	
	init: function() {
		kApp.log("world.init");
		
		var zoneTypes = kApp.world.zoneTypes;
		kApp.log(["59:",zoneTypes]);
		
		var qzones = kApp.world.settings.qzones;
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
			kApp.world.settings.coordZones[ix] = [];
			var iy = 0;
			for (var y=rrect.yMin; ; iy++) {
				y=rrect.yMin + iy*rgridy;
				if (y+0.5*rgridy>rrect.yMax) break;
				var wzrrect = new kApp.geom.rrect(x, y, x+rgridx, y+rgridy);
				var wzcrect = kApp.geom.rRect2cRect(wzrrect);
				var wztype = kApp.world.zoneTypes[0];
				var wz = new WorldZone(ix, iy, wzrrect, wzcrect, wztype);
				kApp.world.settings.coordZones[ix][iy] = wz;
				coordMax.x = ix;
				coordMax.y = iy; 
			}
		}
		kApp.world.generateTypes();
	},
	
	generateTypes: function() {
		kApp.log("generateTypes");
		
		kApp.log("setting initial zone types");
		var coordZones = kApp.world.settings.coordZones;
		var coordMax = kApp.world.settings.coordMax;
		for (var ix=0; ix<=coordMax.x; ix++) {
			for (var iy=0; iy<=coordMax.y; iy++) {
				var wz = coordZones[ix][iy];

				// randomly change some from basic land				
				if (Math.random() > 0.375) {
					var zoneType = kApp.world.randomWorldZoneType();
					wz.initialZoneType = zoneType;
					wz.zoneType = zoneType;
				}
			}
		}
		
		kApp.log("averaging types");
		var passes = 2;
		for (var i=0; i<passes; i++) {
			for (var ix=0; ix<=coordMax.x; ix++) {
				for (var iy=0; iy<=coordMax.y; iy++) {
					var wz = coordZones[ix][iy];
					wz.zoneType = kApp.world.getSurroundingZoneType(ix, iy);
				}
			}
			
			for (var ix=0; ix<=coordMax.x; ix++) {
				for (var iy=0; iy<=coordMax.y; iy++) {
					var wz = coordZones[ix][iy];
					wz.initialZoneType = wz.zoneType;
				}
			}
		}
	},
	
	getSurroundingZoneType: function(ix, iy) {
		var coordZones = kApp.world.settings.coordZones;
		var coordMax = kApp.world.settings.coordMax;
		var typeCount = {};
		var zoneTypes = kApp.world.zoneTypes;
		
		for (var i=0; i<zoneTypes.length; i++) {
			typeCount[i] = 0;
		}
		
		var hits = 0;
		for (var x = Math.max(ix-1, 0); x <= Math.min(ix+1, coordMax.x); x+=1) {
			kApp.log(["144:",x]);
			for (var y = Math.max(iy-1, 0); y <= Math.min(iy+1, coordMax.y); y+=1) {
				var coordZone = coordZones[x][y];
				var zoneType = coordZone.initialZoneType;
				var typeIndex = zoneType.i;
				typeCount[typeIndex]++;
				hits++;
			} 
		}
		//kApp.log(["142:",typeCount]);
		
		var maxType = null;
		var maxZoneQty = -1;
		for (var i=0; i<zoneTypes.length; i++) {
			if (typeCount[i] > maxZoneQty) {
				maxType = zoneTypes[i];
				maxZoneQty = typeCount[i];
			}
		}

		//kApp.log(["172:",maxZoneQty,hits]);

		if (maxZoneQty == 1) {
		 	var coordZone = coordZones[ix][iy];
			maxType = coordZone.zoneType;
		}
		
		//kApp.log(["174:",maxType]);
		
		return maxType;
	},
	
	randomWorldZoneType: function() {
		var i = kApp.random.intBetween(1, 3);
		var t = kApp.world.zoneTypes[i];
		return t;
	}
}

function WorldZone(ix, iy, rrect, crect, zoneType) {
	this.ix = ix;
	this.iy = iy;
	this.rrect = rrect;
	this.crect = crect;
	this.zoneType = zoneType;
	this.initialZoneType = zoneType;
}