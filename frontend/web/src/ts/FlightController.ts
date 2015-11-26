/// <reference path="../defi/require.d.ts"/>
/// <reference path="../defi/jquery.d.ts"/>
/// <reference path="../defi/d3.d.ts"/>
/// <reference path="../defi/moment-timezone/moment-timezone.d.ts"/>
/// <reference path="data/FlightUIData.ts"/>
/// <reference path="data/ItineraryData.ts"/>
/// <reference path="FullScreenFlightUI.ts"/>
/// <reference path="FlightChartUI.ts"/>

define(function (require) {
    moment = require("moment");
});

declare var requestId: string;

module Flights {
    
    export var listElement: D3.Selection = null;
	export var itineraryChart: ItineraryData = null;
    export var axisData: AxisData = null;
	export var parseDate = null;        
        
    export var listByConds = {price: 1, duration: 2};
    export var orderByConds = {asc: 1, desc: 2};
    export var dimType = {departTimeDim: 1, arrivalTimeDim: 2, priceDim: 3, durationDim: 4};
    export var currentValues = null;
    export var departZone;
    export var arrivalZone;
    
	export var flightUIData:FlightUIData;
		
    /**
     * FlightController getFlight() is the starting point for the flight search GUI screen
     * 
     */
    export class FlightController {
        private fullScreen: FullScreenFlightUI = null;
        
        constructor() {
            parseDate =d3.time.format("%Y-%m-%dT%H:%M%Z").parse;
            currentValues = {listBy: listByConds.price, orderBy: orderByConds.asc, listSize: 10, slicePos: 0}
            flightUIData = new FlightUIData();
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
                    this.calculateZones();
                    itineraryChart = new ItineraryData((<FlightSearchResults> data).itineraryResults.trips);
                    this.fullScreen.initializeCharts((<FlightSearchResults> data).itineraryResults.trips);
                    data = null;   //clean the received results hoping to get back memory                 
                }
            });
        }
        /**
         * Zones are used in the axis exact local timings display
         * TODO: pending label for Timezone in axis
         */
        private calculateZones(): void {
            console.log("now ",moment.version);
            departZone = moment.parseZone(axisData.dateAxisMinMaxList[0].departMin).utcOffset();
            arrivalZone = moment.parseZone(axisData.dateAxisMinMaxList[0].arrivalMax).utcOffset();
            console.log(departZone, arrivalZone);
        }
	}
}
