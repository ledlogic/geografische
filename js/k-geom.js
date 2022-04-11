kApp.geom = {

	rDistance: 5,
		
	// map data
	map: {
		crect: [],
		rrect: []
	},	

	// pt constructors
	cPt: function(x, y) {
		this.x = x;
		this.y = y;

		this.toString = function() {
			return this.x + "," + this.y;
		}
	},
	rPt: function(x, y) {
		this.x = x;
		this.y = y;
		
		this.toString = function() {
			return this.x + "," + this.y;
		}
	},

	// rect constructors
	crect: function(xMin, yMin, xMax, yMax) {
		this.xMin = xMin;
		this.xMax = xMax;
		this.yMin = yMin;
		this.yMax = yMax;
		this.width = this.xMax - this.xMin;
		this.height  = this.yMax - this.yMin;
		this.xCenter = 0.5 * (this.xMax + this.xMin);
		this.yCenter = 0.5 * (this.yMax + this.yMin);
	},	
	rrect: function(xMin, yMin, xMax, yMax) {
		this.xMin = xMin;
		this.xMax = xMax;
		this.yMin = yMin;
		this.yMax = yMax;
		this.width = this.xMax - this.xMin;
		this.height  = this.yMax - this.yMin;
		this.xCenter = 0.5 * (this.xMax + this.xMin);
		this.yCenter = 0.5 * (this.yMax + this.yMin);
	},
	
	cPt2rPt: function(cx, cy) {
		var rrect = kApp.geom.map.rrect;
		var crect = kApp.geom.map.crect;
		var ret = new kApp.geom.rPt(
			Math.round(Math.round((cx - crect.xCenter)/crect.width*rrect.width) + rrect.xCenter),
			-Math.round(Math.round((cy - crect.yCenter)/crect.height*rrect.height) + rrect.yCenter)
		);
		return ret;
	},
	
	rPt2Cpt: function(rx, ry) {
		if (arguments.length == 1) {
			ry = rx.y;
			rx = rx.x;
		}
		var rrect = kApp.geom.map.rrect;
		var crect = kApp.geom.map.crect;
		var ret = new kApp.geom.cPt(
			Math.round((rx - rrect.xCenter)/rrect.width*crect.width) + crect.xCenter,
			-Math.round((ry - rrect.yCenter)/rrect.height*crect.height) + crect.yCenter
		);
		return ret;
	},
	
	rRect2cRect: function(rrect) {
		var ctl = kApp.geom.rPt2Cpt(rrect.xMin, rrect.yMax);
		var cbr = kApp.geom.rPt2Cpt(rrect.xMax, rrect.yMin);
		var crect = new kApp.geom.crect(ctl.x, ctl.y, cbr.x, cbr.y);
		return crect;	
	},
	
	dimR2C: function(dim) {
		var rrect = kApp.geom.map.rrect;
		var crect = kApp.geom.map.crect;
		var ret = Math.round(dim/rrect.width*crect.width);
		return ret;
	},
	
	rdist: function(rPt1, rPt2) {
		var xSq = Math.pow(rPt1.x - rPt2.x, 2);
		var ySq = Math.pow(rPt1.y - rPt2.y, 2);
		return Math.sqrt(xSq + ySq);
	},
	
	ptInCircle: function(rPt, ePt, eRadius) {
		var rDist = kApp.geom.rdist(rPt, ePt);
		ret = (rDist <= eRadius);
		return ret;
	},
	
	rPtBetween: function(rPt1, rPt2, ratio) {
		var vrPt = new kApp.geom.rPt(rPt2.x - rPt1.x, rPt2.y - rPt1.y);
		var srPt = new kApp.geom.rPt(ratio * vrPt.x, ratio * vrPt.y);
		var ret = new kApp.geom.rPt(rPt1.x + srPt.x, rPt1.y + srPt.y);
		return ret;
	},
	
	radians: function(rPt1, rPt2) {
		var r = Math.atan2(rPt2.y - rPt1.y, rPt2.x - rPt1.x);
		return r;
	},
	
	radius: function(rPt) {
		var xSq = Math.pow(rPt.x, 2);
		var ySq = Math.pow(rPt.y, 2);
		return Math.sqrt(xSq + ySq);
	},
	
	rTheta2rPt: function(radius, theta) {
		var x = radius * Math.cos(theta);
		var y = radius * Math.sin(theta);
		return new kApp.geom.rPt(x, y);
	},
	
	rPtAdd: function(rPt1, rPt2) {
		rPt1.x += rPt2.x;
		rPt1.y += rPt2.y;
	},
	
	// @see https://cscheng.info/2016/06/09/calculate-circle-line-intersection-with-javascript-and-p5js.html
	findCircleLineIntersections: function(r, x0, y0, m, b0) {
	    // circle: (x - x0)^2 + (y - y0)^2 = r^2
	    // line: y = m * x + b0
	    // r: circle radius
	    // x0: x value of circle centre
	    // y0: y value of circle centre
	    // m: slope
	    // b0: y-intercept

	    // get a, b, c values
	    var a = 1 + sq(m);
	    var b = -x0 * 2 + (m * (b0 - x0)) * 2;
	    var c = sq(x0) + sq(b0 - y0) - sq(r);

	    // get discriminant
	    var d = sq(b) - 4 * a * c;
	    if (d >= 0) {
	        // insert into quadratic formula
	        var intersections = [
	            (-b + sqrt(sq(b) - 4 * a * c)) / (2 * a),
	            (-b - sqrt(sq(b) - 4 * a * c)) / (2 * a)
	        ];
	        if (d == 0) {
	            // only 1 intersection
	            return [intersections[0]];
	        }
	        return intersections;
	    }
	    // no intersection
	    return [];
	},
	
	rPtsDelta: function(rPt1, rPt2) {
		var rPt = new kApp.geom.rPt(rPt2.x - rPt1.x, rPt2.y - rPt1.y);
		return rPt;
	},
	
	rPtsTomb: function(rPt1, rPt2) {
		var rPt = kApp.geom.rPtsDelta(rPt1, rPt2);
		var ret = {
			m: rPt.y / rPt.x,
		};
		ret.b = rPt1.y - ret.m * rPt1.x;
		return ret;
	},
	
	// circle center: rPt0
	// line point 1: rPt1
	// line point 2: rPt2
	findrPtCircleLineIntersections: function(r, rPt0, rPt1, rPt2) {
		//kApp.log("findrPtCircleLineIntersections, r[" + r + "], rPt0[" + rPt0 + "], rPt1[" + rPt1 + "], rPt2[" + rPt2 + "]");
		
		var mb = kApp.geom.rPtsTomb(rPt1, rPt2);
		return kApp.geom.findCircleLineIntersections(r, rPt0.x, rPt0.y, mb.m, mb.b);
	},
	
	geoMean: function(x1, x2) {
		var ret = Math.sqrt(x1 * x1 + x2 * x2);
		return ret;
	}

};