/// <reference path="../defi/jquery.d.ts"/>
/// <reference path="../defi/d3.d.ts"/>

module Flights {
	export class FlightUIData {
		public browser:{width: number, height: number};
		public sectionSize: {listWidthMinPixel:number, listWidthMinPercent: number, chartWidthMinPixel:number}	
		public axisSize: {bottomAxisSize: number, bottomScrubAxisSize: number, leftAxisSize: number, leftScrubAxisSize: number, 
			topAxisSize: number, topScrubAxisSize: number, rightAxisSize: number};		
        public chartSize: {width: number, height: number, xScaleWidth: number, yScaleHeight: number};
		public sectionElements: {listSection: any, chartSection: any};
		
		public sectionMargin: number = 20;
		
	}
}