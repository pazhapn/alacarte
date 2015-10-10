requirejs.config({
		  //To get timely, correct error triggers in IE, force a define/shim exports
			//enforceDefine: true,		  
			config: {
				'moment': {
					noGlobal: true
				}
			},
		  paths: {
		    jquery: [
		      '/static/lib/jquery-1.11.3.min' 
		    ],
		    d3: [
		      '/static/lib/d3.min' 
		    ],
			moment: [
		      '/static/lib/moment' 
		    ],
			momenttimezone: [
		      '/static/lib/moment-timezone' 
		    ],
		    crossfilter: [
		      '/static/lib/crossfilter' 
		    ],
		    app: [
		      '/static/scripts/app.un' 
		    ]
		  },
		  shim: {
		    d3: ['jquery'],
			moment: {deps:['jquery'], exports: "moment"},
			momenttimezone:['moment'],
			app:['d3','moment','momenttimezone']
		  }
		});
		//  requirejs(["app"]);
		define(['jquery', 'd3', 'moment', 'momenttimezone', 'crossfilter', 'app'], function($, d3, moment, timezone, crossfilter, app) {
			moment();
			$( document ).ready(function() {
				console.log(moment().format('dddd, MMMM Do YYYY, h:mm:ss a'));
				//console.log('registering Datas '+requestId);
		      var flightController = new Flights.FlightController();
		      flightController.getFlights("testing "+requestId);
		  });
		});