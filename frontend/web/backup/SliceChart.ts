/// <reference path="../defi/jquery.d.ts"/>
/// <reference path="../defi/d3.d.ts"/>
/// <reference path="../defi/nunjucks.d.ts"/>
/// <reference path="../defi/moment-timezone/moment-timezone.d.ts"/>

module Flights {
	
	export class LegLine{
        constructor(public id: String, public color: String, public flightPosition: number, public groundTime: String){}
    }
    		
    export var lineGen:D3.Svg.Line;
	declare var nunjuckjs;
	
	export class SliceChart {
		private top:String = "t";
		private bottom:String = "b";
		private left:String = "l";
		private right:String = "r";
		
		private chartElements: { mainChartElem: any, 
			leftAxisElem: any, leftBrushElem: any, 
			bottomAxisElem: any, bottomBrushElem: any, 
			rightAxisElem: any, rightBrushElem: any,			
			topAxisElem: any, topBrushElem: any};	
				
        private axis: {bottomAxis:D3.Svg.Axis, leftAxis:D3.Svg.Axis, rightAxis:D3.Svg.Axis, 
			topAxis:D3.Svg.Axis, positionAxis:D3.Svg.Axis};
			
		private axisScale: {bottomScale:D3.Scale.TimeScale,  
			leftScale:D3.Scale.QuantitiveScale, 
			rightScale:D3.Scale.QuantitiveScale,
			topScale:D3.Scale.TimeScale,  
			positionScale:D3.Scale.QuantitiveScale};	
				
        private brush: {bottomBrush: D3.Svg.Brush, leftBrush: D3.Svg.Brush, rightBrush: D3.Svg.Brush, topBrush: D3.Svg.Brush};
		private brushValues: {bottomPrevious: any[], leftPrevious: any[], rightPrevious: any[], topPrevious: any[]};
		private xArc: D3.Svg.Arc;
		private yArc: D3.Svg.Arc;
		
		constructor(private chartNum: number) {	
			this.initializeUIElements();
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
							//console.log(id, i, this.axisScale.bottomScale(parseDate(trips[i].slices[sl].segments[seg].legs[leg].departTimeInOrigin)), this.axisScale.positionScale(i));
							legs.push([new LegLine(id+""+this.axisScale.positionScale(i), colorValue, i, trips[i].slices[sl].segments[seg].legs[leg].departTimeInOrigin),
									new LegLine(id+"1", colorValue, i, trips[i].slices[sl].segments[seg].legs[leg].arrivalTimeInOrigin)]);
							console.log();
						}
					}
				}
			}
			var path = this.chartElements.mainChartElem.selectAll(".line").data(legs, (d:LegLine[]) => d[0].id).attr("class","line");
			path.enter().append("path")
					.attr('d', lineGen)
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
			this.axisScale.positionScale.domain([0,currentValues.listSize]); 
			         
            this.axisScale.leftScale.domain([axisData.priceMin, axisData.priceMax]);
            this.chartElements.leftAxisElem.call(this.axis.leftAxis);         
			this.brush.leftBrush.y(this.axisScale.leftScale).extent(this.currentBrushValue(this.left));
            var leftBar = this.chartElements.leftBrushElem.call(this.brush.leftBrush);
			leftBar.selectAll("rect")
				.attr("x", (flightUIData.axisSize.leftAxisSize - flightUIData.brushSize.leftBrushSize))
				.attr("width", flightUIData.brushSize.leftBrushSize);
			leftBar.selectAll(".resize").selectAll("path").remove();
			leftBar.selectAll(".resize").append("path")
				.attr("transform", "translate("+(flightUIData.axisSize.leftAxisSize  -0.5 *  flightUIData.brushSize.leftBrushSize )+", "+ 0 + ") rotate(90)")
				.attr("d", this.yArc);	
			this.axisScale.rightScale.domain([axisData.dateAxisMinMaxList[this.chartNum].durationMin, axisData.dateAxisMinMaxList[this.chartNum].durationMax]);
            this.chartElements.rightAxisElem.call(this.axis.rightAxis);          
			this.brush.rightBrush.y(this.axisScale.rightScale)
				.extent(this.currentBrushValue(this.right));
            var rightBar = this.chartElements.rightBrushElem.call(this.brush.rightBrush);
			rightBar.selectAll("rect")
				.attr("x", (flightUIData.chartSize.width - flightUIData.axisSize.rightAxisSize))
				.attr("width", flightUIData.axisSize.rightAxisSize);			
			rightBar.selectAll(".resize").selectAll("path").remove();
			rightBar.selectAll(".resize").append("path")
				.attr("transform", "translate("+(flightUIData.chartSize.width  -0.5 *  flightUIData.brushSize.rightBrushSize )+", "+ 0 + ") rotate(90)")
				.attr("d", this.yArc);	
					
            this.axisScale.bottomScale.domain([this.chartDate(parseDate(axisData.dateAxisMinMaxList[this.chartNum].departMinFullChart), -30), this.chartDate(parseDate(axisData.dateAxisMinMaxList[this.chartNum].departMaxFullChart), 30)]);
            this.chartElements.bottomAxisElem.call(this.axis.bottomAxis);
            this.brush.bottomBrush.x(this.axisScale.bottomScale)
				.extent(this.currentBrushValue(this.bottom));
            var bottomBar = this.chartElements.bottomBrushElem.call(this.brush.bottomBrush);
			bottomBar.selectAll(".resize").selectAll("path").remove();
			bottomBar.selectAll(".resize").append("path")
				.attr("transform", "translate(0," +  (flightUIData.chartSize.height - 0.5 * flightUIData.axisSize.bottomAxisSize) + ")")
				.attr("d", this.xArc);
			bottomBar.selectAll("rect")
				.attr("y", +(flightUIData.chartSize.height - flightUIData.axisSize.bottomAxisSize))
				.attr("height", flightUIData.axisSize.bottomAxisSize);
				
			this.axisScale.topScale.domain([this.chartDate(parseDate(axisData.dateAxisMinMaxList[this.chartNum].arrivalMinFullChart), -30), this.chartDate(parseDate(axisData.dateAxisMinMaxList[this.chartNum].arrivalMaxFullChart), 30)]);
            this.chartElements.topAxisElem.call(this.axis.topAxis);
            this.brush.topBrush.x(this.axisScale.topScale)
				.extent(this.currentBrushValue(this.top));
            var topBar = this.chartElements.topBrushElem.call(this.brush.topBrush);
			topBar.selectAll("rect")
				.attr("y", +(flightUIData.axisSize.topAxisSize))
				.attr("height", flightUIData.axisSize.topAxisSize);
			
			topBar.selectAll(".resize").selectAll("path").remove();
			topBar.selectAll(".resize").append("path")
				.attr("transform", "translate(0," +  1.5 * flightUIData.axisSize.topAxisSize + ")")
				.attr("d", this.xArc);
			lineGen = d3.svg.line()
				.x((d: LegLine) => {return flightUIData.axisSize.leftAxisSize
												+this.axisScale.bottomScale(parseDate(d.groundTime));})
				.y((d: LegLine) => {return flightUIData.axisSize.topAxisSize + (0.9 * this.axisScale.positionScale(d.flightPosition + 1));});
        }
			
		public reCalculateUI(){	
			this.calculateSvg();
			this.calculateAxis();
		}
		
		private chartDate(date: Date, minutes: number): Date{
			return new Date(date.getTime() + minutes*60000);
		}
		private calculateSvg(): void {
			console.log('calculate svg elements ', this.chartNum);	
			this.chartElements.mainChartElem.attr("width", flightUIData.chartSize.width).attr("height", flightUIData.chartSize.height);
			
			this.chartElements.bottomAxisElem.attr("class", "x axis")			
				.attr("transform", "translate("+flightUIData.axisSize.leftAxisSize
					+" ,"+(flightUIData.chartSize.height - flightUIData.axisSize.bottomAxisSize)+")");
			this.chartElements.bottomBrushElem.attr("class", "x brush")
				.attr("transform", "translate("+flightUIData.axisSize.leftAxisSize+")");
				
			this.chartElements.leftAxisElem.attr("class", "y axis")
				.attr("transform", "translate("+flightUIData.axisSize.leftAxisSize+" ,"+flightUIData.axisSize.topAxisSize+")");
			this.chartElements.leftBrushElem.attr("class", "y brush")
				.attr("transform", "translate(0,"+flightUIData.axisSize.topAxisSize+")");
					
			this.chartElements.rightAxisElem.attr("class", "y axis")
				.attr("transform", "translate("+(flightUIData.chartSize.width - flightUIData.axisSize.rightAxisSize)+" ,"+flightUIData.axisSize.topAxisSize+")");
			this.chartElements.rightBrushElem.attr("class", "y brush")
				.attr("transform", "translate(0,"+flightUIData.axisSize.topAxisSize+")");
				
			this.chartElements.topAxisElem.attr("class", "x axis")			
				.attr("transform", "translate("+flightUIData.axisSize.leftAxisSize
					+" ,"+flightUIData.axisSize.topAxisSize+")");
			this.chartElements.topBrushElem.attr("class", "x brush")
				.attr("transform", "translate("+flightUIData.axisSize.leftAxisSize+", "+(-flightUIData.axisSize.topAxisSize)+")");
		}
		
		private calculateAxis(): void {
			this.axisScale = {
				bottomScale: d3.time.scale().range([0, flightUIData.chartSize.xScaleWidth]), 
				leftScale: d3.scale.linear().range([0, flightUIData.chartSize.yScaleHeight]),
				rightScale: d3.scale.linear().range([0, flightUIData.chartSize.yScaleHeight]),
				topScale: d3.time.scale().range([0, flightUIData.chartSize.xScaleWidth]), 
				positionScale: d3.scale.linear().range([0, flightUIData.chartSize.yScaleHeight]) 
				}
			this.axis = {
				bottomAxis: d3.svg.axis().orient("bottom").scale(this.axisScale.bottomScale).tickFormat((data) => moment(data).utcOffset(departZone).format("h A Do")),
				leftAxis: d3.svg.axis().orient("left").scale(this.axisScale.leftScale).tickFormat(d3.format("s")), 
				rightAxis: d3.svg.axis().orient("right").scale(this.axisScale.rightScale).tickFormat(d3.format("s")),
				topAxis: d3.svg.axis().orient("top").scale(this.axisScale.topScale).tickFormat((data) => moment(data).utcOffset(arrivalZone).format("h A Do")), 
				positionAxis: d3.svg.axis().orient("right").scale(this.axisScale.positionScale)
				};
			this.brush = {
				bottomBrush: d3.svg.brush()
					.on("brush", () => this.brushed(this.brush.bottomBrush, this.bottom, this.axisScale.bottomScale, dimType.departTimeDim)),
				leftBrush: d3.svg.brush()
					.on("brush", () => this.brushed(this.brush.leftBrush, this.left, this.axisScale.leftScale, dimType.priceDim)),
				rightBrush: d3.svg.brush()
					.on("brush", () => this.brushed(this.brush.rightBrush, this.right, this.axisScale.rightScale, dimType.durationDim)),
				topBrush: d3.svg.brush()
					.on("brush", () => this.brushed(this.brush.topBrush, this.top, this.axisScale.topScale, dimType.arrivalTimeDim))}
				
		}
		
		private initializeUIElements(){
			var drawArea = d3.select("#chartSection").append("div").attr("id", "chart"+this.chartNum).append("svg");
			this.chartElements = {mainChartElem: drawArea, 
				leftAxisElem: drawArea.append("g"), leftBrushElem: drawArea.append("g"), 
				bottomAxisElem: drawArea.append("g"), bottomBrushElem: drawArea.append("g"), 
				rightAxisElem: drawArea.append("g"), rightBrushElem: drawArea.append("g"), 
				topAxisElem: drawArea.append("g"), topBrushElem: drawArea.append("g")
				};
			this.xArc = d3.svg.arc().innerRadius(flightUIData.brushSize.topBrushSize/2).startAngle(0).endAngle(function(d, i) { return i ? -Math.PI : Math.PI; })
			this.yArc = d3.svg.arc().outerRadius(flightUIData.brushSize.leftBrushSize/2).startAngle(0)
				.endAngle(function(d, i) { console.log("d and i", d, i); return -i ? Math.PI : -Math.PI; })
		}	
		
		private currentBrushValue(brushType: String): any[]{
			if(brushType === this.left){
				if(this.brushValues.leftPrevious == null || this.brushValues.leftPrevious.length == 0){
					this.brushValues.leftPrevious = [axisData.priceMin, axisData.priceMax];
				}
				return this.brushValues.leftPrevious;
			}else if(brushType === this.right){
				if(this.brushValues.rightPrevious == null || this.brushValues.rightPrevious.length == 0){
					this.brushValues.rightPrevious = [axisData.dateAxisMinMaxList[this.chartNum].durationMin, axisData.dateAxisMinMaxList[this.chartNum].durationMax];
				}
				return this.brushValues.rightPrevious;
			}else if(brushType === this.top){
				if(this.brushValues.topPrevious == null || this.brushValues.topPrevious.length == 0){
					this.brushValues.topPrevious = [this.chartDate(parseDate(axisData.dateAxisMinMaxList[this.chartNum].arrivalMin), -30), this.chartDate(parseDate(axisData.dateAxisMinMaxList[this.chartNum].arrivalMax), 30)];
				}
				return this.brushValues.topPrevious;
			}else if(brushType === this.bottom){
				console.log("calling brush min max check ", this.brushValues.bottomPrevious[1], this.chartDate(parseDate(axisData.dateAxisMinMaxList[this.chartNum].departMax), 30));
				if(this.brushValues.bottomPrevious == null || this.brushValues.bottomPrevious.length == 0){
					this.brushValues.bottomPrevious = [this.chartDate(parseDate(axisData.dateAxisMinMaxList[this.chartNum].departMin), -30), this.chartDate(parseDate(axisData.dateAxisMinMaxList[this.chartNum].departMax), 30)];
				}
				return this.brushValues.bottomPrevious;
			}
			return [];
		}
		
		/*
		private currentBrushValueOld(brushType: String): any[]{
			if(brushType === this.left){
				if(this.brushValues.leftPrevious == null || this.brushValues.leftPrevious.length == 0){
					this.brushValues.leftPrevious = [axisData.priceMin, axisData.priceMax];
				}else if(this.brushValues.leftPrevious[0] < axisData.priceMin){
					this.brushValues.leftPrevious[0] = axisData.priceMin;
				}else if(this.brushValues.leftPrevious[1] > axisData.priceMax){
					this.brushValues.leftPrevious[1] = axisData.priceMax;
				}
				return this.brushValues.leftPrevious;
			}else if(brushType === this.right){
				if(this.brushValues.rightPrevious == null || this.brushValues.rightPrevious.length == 0){
					this.brushValues.rightPrevious = [axisData.dateAxisMinMaxList[this.chartNum].durationMin, axisData.dateAxisMinMaxList[this.chartNum].durationMax];
				}else if(this.brushValues.rightPrevious[0] < axisData.dateAxisMinMaxList[this.chartNum].durationMin){
					this.brushValues.rightPrevious[0] = axisData.dateAxisMinMaxList[this.chartNum].durationMin;
				}else if(this.brushValues.rightPrevious[1] > axisData.dateAxisMinMaxList[this.chartNum].durationMax){
					this.brushValues.rightPrevious[1] = axisData.dateAxisMinMaxList[this.chartNum].durationMax;
				}
				return this.brushValues.rightPrevious;
			}else if(brushType === this.top){
				if(this.brushValues.topPrevious == null || this.brushValues.topPrevious.length == 0){
					this.brushValues.topPrevious = [this.chartDate(parseDate(axisData.dateAxisMinMaxList[this.chartNum].arrivalMin), -30), this.chartDate(parseDate(axisData.dateAxisMinMaxList[this.chartNum].arrivalMax), 30)];
				}else if(this.brushValues.topPrevious[0] < this.chartDate(parseDate(axisData.dateAxisMinMaxList[this.chartNum].arrivalMin), -30)){
					this.brushValues.topPrevious[0] = this.chartDate(parseDate(axisData.dateAxisMinMaxList[this.chartNum].arrivalMin), -30);
				}else if(this.brushValues.topPrevious[1] > this.chartDate(parseDate(axisData.dateAxisMinMaxList[this.chartNum].arrivalMax), 30)){
					this.brushValues.topPrevious[1] = this.chartDate(parseDate(axisData.dateAxisMinMaxList[this.chartNum].arrivalMax), 30);
				}
				return this.brushValues.topPrevious;
			}else if(brushType === this.bottom){
				console.log("calling brush min max check ", this.brushValues.bottomPrevious[1], this.chartDate(parseDate(axisData.dateAxisMinMaxList[this.chartNum].departMax), 30));
				if(this.brushValues.bottomPrevious == null || this.brushValues.bottomPrevious.length == 0){
					this.brushValues.bottomPrevious = [this.chartDate(parseDate(axisData.dateAxisMinMaxList[this.chartNum].departMin), -30), this.chartDate(parseDate(axisData.dateAxisMinMaxList[this.chartNum].departMax), 30)];
				}else if(this.brushValues.bottomPrevious[0] < this.chartDate(parseDate(axisData.dateAxisMinMaxList[this.chartNum].departMin), -30)){
					this.brushValues.bottomPrevious[0] = this.chartDate(parseDate(axisData.dateAxisMinMaxList[this.chartNum].departMin), -30);
				}else if(this.brushValues.bottomPrevious[1] > this.chartDate(parseDate(axisData.dateAxisMinMaxList[this.chartNum].departMax), 30)){
					this.brushValues.bottomPrevious[1] = this.chartDate(parseDate(axisData.dateAxisMinMaxList[this.chartNum].departMax), 30);
				}
				return this.brushValues.bottomPrevious;
			}
			return [];
		}
		*/
		private setPreviousValue(brushType: String): void{
			if(brushType === this.left){
				this.brushValues.leftPrevious = this.brush.leftBrush.extent();
			}else if(brushType === this.right){
				this.brushValues.rightPrevious = this.brush.rightBrush.extent();
			}else if(brushType === this.top){
				this.brushValues.topPrevious = this.brush.topBrush.extent();
			}else if(brushType === this.bottom){
				this.brushValues.bottomPrevious = this.brush.bottomBrush.extent();
			}
		}
		private getPreviousBrush(brushType: String): any[]{
			if(brushType === this.left){
				return this.brushValues.leftPrevious;
			}else if(brushType === this.right){
				return this.brushValues.rightPrevious;
			}else if(brushType === this.top){
				return this.brushValues.topPrevious;
			}else if(brushType === this.bottom){
				return this.brushValues.bottomPrevious;
			}
		}
		private redrawBrush(brush: D3.Svg.Brush, brushType: String): void{ 
			if(brushType === this.left){
				this.chartElements.leftBrushElem.call(brush);
			}else if(brushType === this.right){
				this.chartElements.rightBrushElem.call(brush);
			}else if(brushType === this.top){
				this.chartElements.topBrushElem.call(brush);
			}else if(brushType === this.bottom){
				this.chartElements.bottomBrushElem.call(brush);
			}
		}
		private isBrushChanged(brush: D3.Svg.Brush, brushType: String, scale: D3.Scale.Scale): boolean{
			var brushChanged = true;
			var brushExtent= brush.extent();
			var previousBrushExtent= this.getPreviousBrush(brushType);
			//in case of click outside the bar focussed area
			if(brushExtent[0] == brushExtent[1] ) {
				brushChanged = false;
			}else if(brushType === this.top && 
				(brushExtent[0] < this.chartDate(parseDate(axisData.dateAxisMinMaxList[this.chartNum].arrivalMin), -30)
				|| brushExtent[1] > this.chartDate(parseDate(axisData.dateAxisMinMaxList[this.chartNum].arrivalMax), 30))){
				brushChanged = false;
			}else if(brushType === this.bottom && 
				(brushExtent[0] < this.chartDate(parseDate(axisData.dateAxisMinMaxList[this.chartNum].departMin), -30)
				|| brushExtent[1] > this.chartDate(parseDate(axisData.dateAxisMinMaxList[this.chartNum].departMax), 30))){
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
				this.redrawBrush(brush, brushType);
			}
		}
	}
}