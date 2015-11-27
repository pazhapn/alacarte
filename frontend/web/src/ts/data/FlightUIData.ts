/// <reference path="../../defi/jquery.d.ts"/>
/// <reference path="../../defi/d3.d.ts"/>
/// <reference path="CommonData.ts"/>

module Flights {
	
	export class FlightUIData {
		public browser:{width: number, height: number};
		public sectionSize: {listWidthMinPixel:number, listWidthMinPercent: number, chartWidthMinPixel:number}	
		public axisSize: {bottomAxisSize: number, leftAxisSize: number, topAxisSize: number, rightAxisSize: number};		
        public chartSize: {width: number, height: number, xScaleWidth: number, yScaleHeight: number};
		public sectionElements: {listSection: any, chartSection: any};
		public brushSize: {bottomBrushSize: number, leftBrushSize: number, topBrushSize: number, rightBrushSize: number};
		public sectionMargin: number = 20;
		
		constructor(){			
			this.initializeUIElements();
		}	
		
		public reCalculateUIData(): void {
		    this.browser = {width:$(window).width(), height:$(window).height()};
			this.calculateSection();
			this.calculateMeasurements();
		}	
		
		private calculateMeasurements(): void {
			//this.chartSize = {width:(this.browser.width / 2) - 10, height:(this.browser.height/2) - 10, xScaleWidth:10, yScaleHeight:10};
			this.chartSize = {width:this.sectionElements.chartSection.width() - 4, height:(this.browser.height/2) - 4, xScaleWidth:10, yScaleHeight:10};
            this.chartSize.xScaleWidth = this.chartSize.width - this.axisSize.leftAxisSize - this.axisSize.rightAxisSize;	
            this.chartSize.yScaleHeight = this.chartSize.height-this.axisSize.topAxisSize-this.axisSize.bottomAxisSize;
			console.log('calculateMeasurements ', this.browser.width, Math.floor((this.browser.width/3) * 2) - 4, this.sectionElements.chartSection.width());	
		}
		
		private calculateSection(): void{
			if(this.browser.width/3 >= this.sectionSize.listWidthMinPixel){
				this.sectionElements.listSection.width(Math.floor(this.browser.width/3) - this.sectionMargin);
				this.sectionElements.chartSection.width(Math.floor((this.browser.width/3) * 2) - this.sectionMargin);
			}else{
				
				//TODO
			}
		}
		/**
		 * initialize section elements
		 * initialize brush, axis, section sizes
		 */
		private initializeUIElements(){
			this.sectionElements = {listSection: $("#listSection"), chartSection: $("#chartSection")};
			this.brushSize = {bottomBrushSize: 25, leftBrushSize: 25, topBrushSize: 25, rightBrushSize: 25};
			this.axisSize = {bottomAxisSize: 25, leftAxisSize: 50, topAxisSize: 25, rightAxisSize: 25};
			this.sectionSize = {listWidthMinPixel:200, listWidthMinPercent: 33, chartWidthMinPixel:800}
		}	
	}
}