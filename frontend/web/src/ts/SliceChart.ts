/// <reference path="../defi/jquery.d.ts"/>
/// <reference path="../defi/d3.d.ts"/>
/// <reference path="../defi/nunjucks.d.ts"/>
/// <reference path="../defi/moment-timezone/moment-timezone.d.ts"/>
/// <reference path="data/FlightUIData.ts"/>
/// <reference path="SliceComponents.ts"/>

module Flights {
	
	export class LegLine{
        constructor(public id: String, public color: String, public flightPosition: number, public groundTime: String){}
    }
	declare var nunjuckjs;
	
	export class SliceChart {
		private comps: SliceComponents;    		
		private lineGen:D3.Svg.Line;
	
				
		public brushValues: {bottomPrevious: any[], leftPrevious: any[], rightPrevious: any[], topPrevious: any[]};	
		
		constructor(private chartNum: number, private flightUIData: FlightUIData) {	
			this.comps = new SliceComponents(chartNum, flightUIData);
			this.brushValues = {bottomPrevious: [], leftPrevious: [], rightPrevious: [], topPrevious: []};
		}
		
		public redrawFlights(dim: number, extent): void {
			var color = d3.scale.category20();
			var trips:Array<TripDetail> = itineraryChart.resize(dim, this.chartNum, extent);
			var legs:Array<LegLine[]> = new Array<LegLine[]>();
			var id: String;
			var colorValue: String;
			for (var i = 0; i < trips.length; i++){
				colorValue = color(i);
				for(var sl =0; sl < trips[i].slices.length; sl++){
					for(var seg = 0; seg < trips[i].slices[sl].segments.length; seg++){
						for(var leg = 0; leg < trips[i].slices[sl].segments[seg].legs.length; leg++){
							//console.log(trips[i].slices[sl].segments[seg].legs[leg]);
							id = trips[i].tripId+""+sl+""+seg+""+leg;
							//console.log(id, i, this.comps.axisScale.bottomScale(parseDate(trips[i].slices[sl].segments[seg].legs[leg].departTimeInOrigin)), this.comps.axisScale.positionScale(i));
							legs.push([new LegLine(id+""+this.comps.axisScale.positionScale(i), colorValue, i, trips[i].slices[sl].segments[seg].legs[leg].departTimeInOrigin),
									new LegLine(id+"1", colorValue, i, trips[i].slices[sl].segments[seg].legs[leg].arrivalTimeInOrigin)]);
							console.log();
						}
					}
				}
			}
			var path = this.comps.chartElements.mainChartElem.selectAll(".line").data(legs, (d:LegLine[]) => d[0].id).attr("class","line");
			path.enter().append("path")
					.attr('d', this.lineGen)
					.attr("class","line")
					.attr("id",(d:LegLine[]) => d[0].id)
					.style('stroke', (d:LegLine[]) => d[0].color)
					.style('stroke-width', 2)
					.style('fill', 'none');
			//path.transition().ease("linear").duration(250); 
			path.exit().remove();
			//path.order();
			var flightsList = listElement.selectAll(".flight")
                .data(trips, function (d) { return d.tripId; });
            flightsList.enter().append("div").attr("class", "flight").html((d) => nunjucks.render('flight-small.nunj', {'username':d.tripId}));
            flightsList.exit().remove();
            flightsList.order();            
		}
		
		public redrawAxis():void {
			this.comps.redrawAxis();
			
			this.lineGen = d3.svg.line()
				.x((d: LegLine) => {return this.flightUIData.axisSize.leftAxisSize
												+this.comps.axisScale.bottomScale(parseDate(d.groundTime));})
				.y((d: LegLine) => {return this.flightUIData.axisSize.topAxisSize + (0.9 * this.comps.axisScale.positionScale(d.flightPosition + 1));});
				
			this.comps.brush.leftBrush.y(this.comps.axisScale.leftScale).extent(this.currentBrushValue(this.comps.left));
			this.comps.brush.rightBrush.y(this.comps.axisScale.rightScale).extent(this.currentBrushValue(this.comps.right));					
            this.comps.brush.bottomBrush.x(this.comps.axisScale.bottomScale).extent(this.currentBrushValue(this.comps.bottom));			
            this.comps.brush.topBrush.x(this.comps.axisScale.topScale).extent(this.currentBrushValue(this.comps.top));
			
			this.comps.callAxis();
			this.comps.redrawAxisHandles();
		}
			
		public reCalculateUI(){	
			this.comps.calculateSvg();
			this.comps.calculateAxis();
			this.comps.brush = {
				bottomBrush: d3.svg.brush()
					.on("brush", () => this.brushed(this.comps.brush.bottomBrush, this.comps.bottom, this.comps.axisScale.bottomScale, dimType.departTimeDim)),
				leftBrush: d3.svg.brush()
					.on("brush", () => this.brushed(this.comps.brush.leftBrush, this.comps.left, this.comps.axisScale.leftScale, dimType.priceDim)),
				rightBrush: d3.svg.brush()
					.on("brush", () => this.brushed(this.comps.brush.rightBrush, this.comps.right, this.comps.axisScale.rightScale, dimType.durationDim)),
				topBrush: d3.svg.brush()
					.on("brush", () => this.brushed(this.comps.brush.topBrush, this.comps.top, this.comps.axisScale.topScale, dimType.arrivalTimeDim))}
				
		}
		
		private currentBrushValue(brushType: String): any[]{
			switch(brushType){
				case this.comps.left:
					if(this.brushValues.leftPrevious == null || this.brushValues.leftPrevious.length == 0){
						this.brushValues.leftPrevious = [axisData.priceMin, axisData.priceMax];
					}
					return this.brushValues.leftPrevious;
				case this.comps.right:
					if(this.brushValues.rightPrevious == null || this.brushValues.rightPrevious.length == 0){
						this.brushValues.rightPrevious = [axisData.dateAxisMinMaxList[this.chartNum].durationMin, axisData.dateAxisMinMaxList[this.chartNum].durationMax];
					}
					return this.brushValues.rightPrevious;
				case this.comps.top:
					if(this.brushValues.topPrevious == null || this.brushValues.topPrevious.length == 0){
						this.brushValues.topPrevious = [chartDate(parseDate(axisData.dateAxisMinMaxList[this.chartNum].arrivalMin), -30), chartDate(parseDate(axisData.dateAxisMinMaxList[this.chartNum].arrivalMax), 30)];
					}
					return this.brushValues.topPrevious;
				case this.comps.bottom:
					console.log("calling brush min max check ", this.brushValues.bottomPrevious[1], chartDate(parseDate(axisData.dateAxisMinMaxList[this.chartNum].departMax), 30));
					if(this.brushValues.bottomPrevious == null || this.brushValues.bottomPrevious.length == 0){
						this.brushValues.bottomPrevious = [chartDate(parseDate(axisData.dateAxisMinMaxList[this.chartNum].departMin), -30), chartDate(parseDate(axisData.dateAxisMinMaxList[this.chartNum].departMax), 30)];
					}
					return this.brushValues.bottomPrevious;
			}
			return [];
		}
		
		private setPreviousValue(brushType: String): void{			
			switch(brushType){
				case this.comps.left:
					this.brushValues.leftPrevious = this.comps.brush.leftBrush.extent(); break;
				case this.comps.right:
					this.brushValues.rightPrevious = this.comps.brush.rightBrush.extent(); break;
				case this.comps.top:
					this.brushValues.topPrevious = this.comps.brush.topBrush.extent(); break;
				case this.comps.bottom:
					this.brushValues.bottomPrevious = this.comps.brush.bottomBrush.extent(); break;
			}
			/*
			if(brushType === this.comps.left){
				this.brushValues.leftPrevious = this.comps.brush.leftBrush.extent();
			}else if(brushType === this.comps.right){
				this.brushValues.rightPrevious = this.comps.brush.rightBrush.extent();
			}else if(brushType === this.comps.top){
				this.brushValues.topPrevious = this.comps.brush.topBrush.extent();
			}else if(brushType === this.comps.bottom){
				this.brushValues.bottomPrevious = this.comps.brush.bottomBrush.extent();
			}
			*/
		}
		private getPreviousBrush(brushType: String): any[]{
			switch(brushType){
				case this.comps.left:
					return this.brushValues.leftPrevious;
				case this.comps.right:
					return this.brushValues.rightPrevious;
				case this.comps.top:
					return this.brushValues.topPrevious;
				case this.comps.bottom:
					return this.brushValues.bottomPrevious;
			}
			/*
			if(brushType === this.comps.left){
				return this.brushValues.leftPrevious;
			}else if(brushType === this.comps.right){
				return this.brushValues.rightPrevious;
			}else if(brushType === this.comps.top){
				return this.brushValues.topPrevious;
			}else if(brushType === this.comps.bottom){
				return this.brushValues.bottomPrevious;
			}
			*/
		}
		private isBrushChanged(brush: D3.Svg.Brush, brushType: String, scale: D3.Scale.Scale): boolean{
			var brushChanged = true;
			var brushExtent= brush.extent();
			var previousBrushExtent= this.getPreviousBrush(brushType);
			//in case of click outside the bar focussed area
			if(brushExtent[0] == brushExtent[1] ) {
				brushChanged = false;
			}else if(brushType === this.comps.top && 
				(brushExtent[0] < chartDate(parseDate(axisData.dateAxisMinMaxList[this.chartNum].arrivalMin), -30)
				|| brushExtent[1] > chartDate(parseDate(axisData.dateAxisMinMaxList[this.chartNum].arrivalMax), 30))){
				brushChanged = false;
			}else if(brushType === this.comps.bottom && 
				(brushExtent[0] < chartDate(parseDate(axisData.dateAxisMinMaxList[this.chartNum].departMin), -30)
				|| brushExtent[1] > chartDate(parseDate(axisData.dateAxisMinMaxList[this.chartNum].departMax), 30))){
				brushChanged = false;
			}
			return brushChanged;
		}
		private brushed(brush: D3.Svg.Brush, brushType: String, scale: D3.Scale.Scale, dim: number): void{
			//console.log("brushed start ", brush.extent());
			var brushChanged = this.isBrushChanged(brush, brushType, scale);
			//var brushChanged = this.redrawBrush(brush, brushType);
			//console.log("brushed end ", brush.extent());
			if(brushChanged) {
				//console.log("brushed redrawFlights ", brush.extent());
				this.setPreviousValue(brushType);
				this.redrawFlights(dim, brush.extent());
			}else{
				brush.extent(this.getPreviousBrush(brushType));
				this.comps.redrawBrush(brush, brushType);
			}
		}
	}
}