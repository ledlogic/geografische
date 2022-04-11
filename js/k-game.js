kApp.game = {
	settings: {
		turn: 1,
		defaultTurnRatePerMs: 0.000025,
		turnRatePerMs: 0.000025,
		maxTurnRatePerMs: 0.0008,     // about 1 turn/second
		minTurnRatePerMs: 0.00000625,   // about 100 deltas/second
		lastCheckMs: 0,
		spacetime: 100,
		started: false,
		paused: false
	},
	
	init: function() {
		var time = "0,0,0,0";
	},
	
	start: function() {
		kApp.game.settings.started = true;
		kApp.game.settings.paused = false;
		var newMs = kApp.date.getMs();
		kApp.game.settings.lastCheckMs = newMs;

		kApp.news.add("", "Game: started");
		kApp.game.newTurn();
	},
	
	ptInSystem: function(rPt) {
		var ret = _.find(kApp.game.systems, function(system) {
			return kApp.geom.ptInCircle(rPt, system.rPt, system.radius + kApp.geom.rDistance);
		});
		return ret;
	},
	
	update: function() {
		// if game not yet started, pause
		if (!kApp.game.settings.started) {
			return;
		}
		if (kApp.game.settings.paused) {
			return;
		}
		
		var turn = kApp.game.settings.turn;
		var newMs = kApp.date.getMs();
		var lastCheckMs = kApp.game.settings.lastCheckMs;
		var turnRatePerMs = kApp.game.settings.turnRatePerMs;
		
		if (newMs > lastCheckMs) {
			// update turn data
			kApp.game.settings.turn += (newMs - lastCheckMs) * turnRatePerMs;
			
			// prevent from skipping too far past turn boundary!
			var turnFloor = Math.floor(turn);
			kApp.game.settings.turn = Math.min(turnFloor + 1, kApp.game.settings.turn);
			
			kApp.game.settings.lastCheckMs = newMs;
			kApp.data.updateGame();
			
			// update news
			kApp.news.update(newMs);		
		}
	},
	
	endTurn: function() {
		kApp.log("endTurn");
		kApp.news.endTurn();
		
		// stop time
		kApp.game.settings.paused = true;
		
		// resolve battles at systems
		kApp.game.resolveBattles();
		
		// update population
		kApp.game.logisticGrowthCalc();
		
		// start new turn / restart time
		//setTimeout("kApp.game.start()", 5000);
		setTimeout("kApp.game.start()", 100);
	},
	
	newTurn: function() {
		kApp.log("newTurn");
		kApp.news.addTurn();
	},

	// @see https://codesandbox.io/s/function-plot-jxudi?file=/src/index.js
	initialSystemLogisticGrowthModel: function(system) {
		kApp.log("system.name[" + system.name + "]");
		var c0 = system.ships[system.ships.length-1];
		kApp.log("c0[" + c0 + "]");
		var c = c0 + Math.random() * 10.0 + 5.0;
		kApp.log("c[" + c + "]");
		var b = Math.random() * 0.3 + 0.2;
		kApp.log("b[" + b + "]");
		//var a = Math.exp(b + 10.0);
		var a = c / c0 - 1.0;
		kApp.log("a[" + a + "]");
		system.lgm = {
			c0: c0,
			a: a,
			b: b,
			c: c
		};
	},
	
	systemLogisticGrowthCalc: function(system) {
		var cstart = system.ships[system.ships.length-1];
		
		var c0 = system.lgm.c0
		var x = (kApp.game.settings.turn - 1.0);
		var y = system.lgm.c / ( 1 + system.lgm.a * Math.exp(-system.lgm.b * x));
		var cdelta = Math.floor(y-cstart);
		var cnew = cstart + cdelta;
		kApp.log("c0[" + c0 + "], cstart[" + cstart + "], cdelta[" + cdelta + "], cnew[" + cnew + "], x[" + x + "], y[" + y + "]");
		
		if (cdelta) {
			system.ships[system.ships.length-1] = cnew;
			kApp.news.addSystemGrowth(system, cdelta, cnew);
		}
	},
	
	logisticGrowthCalc: function() {
		_.each(kApp.game.systems, function(system) {
			kApp.game.systemLogisticGrowthCalc(system);
		});
	},
	
	// if count exists for ship type, adds to a human-readable string
	shipsToDescription: function(ships) {
		var ret = [];
		for (var i=0; i<ships.length;i++) {
			var q = ships[i];
			if (q) {
				ret.push(q + " " + kApp.game.ships[i].name);
			}
		}
		if (ret.length) {
			ret[ret.length-1] = " and " + ret[ret.length-1]; 
		}
		// oxford comma list
		return ret.join(", ");
	},
	
	shipCount: function(ships, delta) {
		// way to preclude defense rating for systems
		if (!delta) {
			delta = 0;
		}
		
		// system ships
		var count = 0;
		for (var i=0; i<ships.length-delta;i++) {
			count += ships[i];
		}		
		return count;
	}	

};
