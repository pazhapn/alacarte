/// <reference path="../defi/jquery.d.ts"/>
/// <reference path="../defi/d3.d.ts"/>
/// <reference path="data/FlightUIData.ts"/>
/// <reference path="SliceChart.ts"/>

module Flights {
	export class FullScreenFlightUI {	
		private sliceChart: SliceChart[];
		private flightUIData: FlightUIData;
			
		constructor() {	
			this.sliceChart = new Array<SliceChart>();
			this.flightUIData = new FlightUIData();
            this.registerBrowserResize();
		}
		
		public initializeCharts(trips: Array<TripDetail>){	
            for(var i=0; i < trips[0].slices.length; i++){
                this.sliceChart[i] = new SliceChart(i, this.flightUIData);
            }
			this.resetScreen();
		}
		
        private registerBrowserResize(): void {		
			//$(document).ready(() => this.resetScreen());    // When the page first loads, no longer needed
			$(window).resize(() => this.resetScreen()); 
        }
        
        private resetScreen(): void{
            console.log('resetScreen');
            this.reCalculateScreen();
			this.reDrawCharts();
        }        
		     
		/**
		* for better visual display first redraw chart outlay and then draw data
		*/           
		private reDrawCharts(){
            if(axisData != null) {
				for(var i=0; i < this.sliceChart.length; i++){
					this.sliceChart[i].redrawAxis();
				}
				for(var i=0; i < this.sliceChart.length; i++){
					this.sliceChart[i].redrawFlights(0, null);
				}
            }
		}
        		
		private reCalculateScreen(){
		    // Get the dimensions of the viewport
			this.flightUIData.reCalculateUIData();
			for(var i=0; i < this.sliceChart.length; i++){
                this.sliceChart[i].reCalculateUI();
            }
		}
	}
}