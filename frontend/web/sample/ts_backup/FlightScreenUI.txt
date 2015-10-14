/// <reference path="../defi/jquery.d.ts"/>
/// <reference path="../defi/d3.d.ts"/>
/// <reference path="FlightUIData.ts"/>
/// <reference path="FlightChartUI.ts"/>

module Flights {
	export class FlightScreenUI {	
		private flightChartUIs: FlightChartUI[];
			
		constructor() {	
			this.flightChartUIs = new Array<FlightChartUI>();
			this.initializeUIElements();
            this.registerBrowserResize();
		}
		
		public initializeCharts(trips: Array<TripDetail>){			
            for(var i=0; i < trips[0].slices.length; i++){
                this.flightChartUIs[i] = new FlightChartUI(i);
            }
			this.resetScreen();
		}
		
        private registerBrowserResize(): void {		
			//$(document).ready(() => this.resetScreen());    // When the page first loads
			$(window).resize(() => this.resetScreen()); 
        }
        
        private resetScreen(): void{
            console.log('resetScreen');
            this.reCalculateScreen();
            if(axisData != null) {                
				for(var i=0; i < this.flightChartUIs.length; i++){
					this.flightChartUIs[i].redrawAxis();
					this.flightChartUIs[i].redrawFlights(0, null);
				}
            }
        }
        
        		
		private reCalculateScreen(){
		    // Get the dimensions of the viewport
		    flightUIData.browser = {width:$(window).width(), height:$(window).height()};
			this.calculateSection();
			this.calculateMeasurements();
			for(var i=0; i < this.flightChartUIs.length; i++){
                this.flightChartUIs[i].reCalculateUI();
            }
		}
		
		private calculateMeasurements(): void {
			//this.chartSize = {width:(this.browser.width / 2) - 10, height:(this.browser.height/2) - 10, xScaleWidth:10, yScaleHeight:10};
			flightUIData.chartSize = {width:flightUIData.sectionElements.chartSection.width() - 4, height:(flightUIData.browser.height/2) - 4, xScaleWidth:10, yScaleHeight:10};
            flightUIData.chartSize.xScaleWidth = flightUIData.chartSize.width - flightUIData.axisSize.leftScrubAxisSize - flightUIData.axisSize.leftAxisSize - flightUIData.axisSize.rightAxisSize;	
            flightUIData.chartSize.yScaleHeight = flightUIData.chartSize.height-flightUIData.axisSize.topAxisSize-flightUIData.axisSize.topScrubAxisSize-flightUIData.axisSize.bottomAxisSize-flightUIData.axisSize.bottomScrubAxisSize;
			console.log('calculateMeasurements ', flightUIData.browser.width, Math.floor((flightUIData.browser.width/3) * 2) - 4, flightUIData.sectionElements.chartSection.width());	
		}
		
		private calculateSection(): void{
			if(flightUIData.browser.width/3 >= flightUIData.sectionSize.listWidthMinPixel){
				flightUIData.sectionElements.listSection.width(Math.floor(flightUIData.browser.width/3) - flightUIData.sectionMargin);
				flightUIData.sectionElements.chartSection.width(Math.floor((flightUIData.browser.width/3) * 2) - flightUIData.sectionMargin);
			}else{
				
				//TODO
			}
		}
		
		private initializeUIElements(){
			flightUIData.sectionElements = {listSection: $("#listSection"), chartSection: $("#chartSection")};
			listElement = d3.select("#flights-list");
			flightUIData.axisSize = {bottomAxisSize: 20, bottomScrubAxisSize: 20, leftAxisSize: 25, leftScrubAxisSize: 25, topAxisSize: 20, topScrubAxisSize: 20, rightAxisSize: 50};
			flightUIData.sectionSize = {listWidthMinPixel:200, listWidthMinPercent: 33, chartWidthMinPixel:800}
		}	
	}
}