kApp.controls = {
	$cmd: null,
	
	init: function() {
		var $cmd = $("#cmd");
		$cmd.on('keypress',function(e) {
			var code = e.keyCode || e.which
		    if(code === 13) {
		    	kApp.events.cmdEnter();
		    }
		});
		kApp.controls.$cmd = $cmd;
		
		var $build = $("#build");
		$build.on('click',function(e) {
			kApp.events.build();
		});

		var $move = $("#move");
		$move.on('click',function(e) {
			kApp.events.move();
		});
	},
	cmdVal: function() {
		var $cmd = kApp.controls.$cmd;
	   	var cmd = $cmd.val();
	   	return cmd;
	}
};
