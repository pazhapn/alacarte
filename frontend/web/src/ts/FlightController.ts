/// <reference path="../defi/require.d.ts"/>
/// <reference path="../defi/jquery.d.ts"/>
/// <reference path="../defi/d3.d.ts"/>
/// <reference path="../defi/moment-timezone/moment-timezone.d.ts"/>
/// <reference path="FlightScreenUI.ts"/>
/// <reference path="FlightUIData.ts"/>
/// <reference path="FlightChartUI.ts"/>
/// <reference path="ui/ItineraryChart.ts"/>

define(function (require) {
    moment = require("moment");
});

declare var requestId: string;

module Flights {
    
    export var listElement: D3.Selection = null;
	export var itineraryChart: ItineraryChart = null;
    export var axisData: AxisData = null;
	export var parseDate = null;        
        
    export var listByConds = {price: 1, duration: 2};
    export var orderByConds = {asc: 1, desc: 2};
    export var dimType = {departTimeDim: 1, arrivalTimeDim: 2, priceDim: 3, durationDim: 4};
    export var currentValues = null;
    export var departZone;
    export var arrivalZone;
    
	export var flightUIData:FlightUIData;
		
    
    export class FlightController {
        private ui: FlightScreenUI = null;
        
        constructor() {
            parseDate =d3.time.format("%Y-%m-%dT%H:%M%Z").parse;
            currentValues = {listBy: listByConds.price, orderBy: orderByConds.asc, listSize: 10, slicePos: 0}
            flightUIData = new FlightUIData();
            this.ui = new FlightScreenUI();
        }
        
        public getFlights(formData: string): void {       
            console.log("retrieving requestId "+requestId);     
            var url: string = "/static/backend.json";
            $.ajax({
                method: "GET",
                url: url,
                dataType: 'json',
                success: (data) => {  
                    axisData = (<FlightSearchResults> data).axisData;
                    console.log("now ",moment.version);
                    departZone = moment.parseZone(axisData.dateAxisMinMaxList[0].departMin).utcOffset();
                    arrivalZone = moment.parseZone(axisData.dateAxisMinMaxList[0].arrivalMax).utcOffset();
                    console.log(departZone, arrivalZone);
                    itineraryChart = new ItineraryChart((<FlightSearchResults> data).itineraryResults.trips);
                    this.ui.initializeCharts((<FlightSearchResults> data).itineraryResults.trips);
                    //itineraryChart.renderList();
                    //itineraryChart.resize(0, 0, null);
                    data = null;                    
                }
            });
        }
	}
}
