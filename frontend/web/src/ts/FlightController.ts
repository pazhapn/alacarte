/// <reference path="../defi/require.d.ts"/>
/// <reference path="../defi/jquery.d.ts"/>
/// <reference path="../defi/d3.d.ts"/>
/// <reference path="../defi/moment-timezone/moment-timezone.d.ts"/>
/// <reference path="data/FlightUIData.ts"/>
/// <reference path="data/ItineraryData.ts"/>
/// <reference path="FullScreenFlightUI.ts"/>

define(function (require) {
    moment = require("moment");
});

declare var requestId: string;

module Flights {
    
	export var itineraryChart: ItineraryData = null;
    export var axisData: AxisData = null;
		
    /**
     * FlightController getFlight() is the starting point for the flight search GUI screen
     * 
     */
    export class FlightController {
        private fullScreen: FullScreenFlightUI = null;
        
        constructor() {
            this.fullScreen = new FullScreenFlightUI();
        }
        
        /**
         * requestId is used for getting the previously submitted request results to appear in the 
         * current screen. could use diff mechanism in future, in case all are done in SPA
         * 
         * 1. once the results are received, we create slice & dice crossfilter data in ItineraryData 
         */
        public getFlights(): void {       
            console.log("retrieving requestId "+requestId);   
            //var url: string = "/static/backend.json?requestId="+requestId+;  
            var url: string = "/static/backend.json";//hard coded for dev purpose
            $.ajax({
                method: "GET",
                url: url,
                dataType: 'json',
                success: (data) => {  
                    axisData = (<FlightSearchResults> data).axisData;
                    itineraryChart = new ItineraryData((<FlightSearchResults> data).itineraryResults.trips);
                    this.fullScreen.initializeCharts((<FlightSearchResults> data).itineraryResults.trips);
                    data = null;   //clean the received results hoping to get back memory                 
                }
            });
        }
	}
}
