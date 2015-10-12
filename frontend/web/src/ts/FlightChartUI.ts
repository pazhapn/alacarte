/// <reference path="../defi/jquery.d.ts"/>
/// <reference path="../defi/d3.d.ts"/>
/// <reference path="../defi/moment-timezone/moment-timezone.d.ts"/>

module Flights {
	
	export class LegLine{
        constructor(public flightPosition: number, public groundTime: String){}
    }
    		
    export var lineGen:D3.Svg.Line;
	export class FlightChartUI {
		
		private chartElements: { mainChartElem: any, 
			leftAxisElem: any, leftScrubAxisElem: any, leftBrushElem: any, 
			bottomAxisElem: any, bottomScrubAxisElem: any,	bottomBrushElem: any, 
			rightAxisElem: any, rightBrushElem: any,			
			topAxisElem: any, topScrubAxisElem: any, topBrushElem: any};	
				
        private axis: {bottomAxis:D3.Svg.Axis, bottomScrubAxis: D3.Svg.Axis, leftAxis:D3.Svg.Axis, leftScrubAxis:D3.Svg.Axis, 
			rightAxis:D3.Svg.Axis, topAxis:D3.Svg.Axis, topScrubAxis: D3.Svg.Axis, positionAxis:D3.Svg.Axis};
			
		private axisScale: {bottomScale:D3.Scale.TimeScale, bottomScrubScale: D3.Scale.TimeScale, 
			leftScale:D3.Scale.QuantitiveScale, leftScrubScale:D3.Scale.QuantitiveScale, 
			rightScale:D3.Scale.QuantitiveScale,
			topScale:D3.Scale.TimeScale, topScrubScale: D3.Scale.TimeScale, 
			positionScale:D3.Scale.QuantitiveScale};	
				
        private brush: {bottomBrush: D3.Svg.Brush, leftBrush: D3.Svg.Brush, rightBrush: D3.Svg.Brush, topBrush: D3.Svg.Brush};

		constructor(private chartNum: number) {	
			this.initializeUIElements();
		}
		public redrawFlights(dim: number, extent): void {
			var trips:Array<TripDetail> = itineraryChart.resize(dim, this.chartNum, extent);
			var legs:Array<LegLine[]> = new Array<LegLine[]>();
			for (var i = 0; i < trips.length; i++){
				for(var sl =0; sl < trips[i].slices.length; sl++){
					for(var seg = 0; seg < trips[i].slices[sl].segments.length; seg++){
						for(var leg = 0; leg < trips[i].slices[sl].segments[seg].legs.length; leg++){
							//console.log(trips[i].slices[sl].segments[seg].legs[leg]);
							console.log(this.axisScale.bottomScale(parseDate(trips[i].slices[sl].segments[seg].legs[leg].departTimeInOrigin)));
							console.log(this.axisScale.positionScale(i));
							legs.push([new LegLine(i, trips[i].slices[sl].segments[seg].legs[leg].departTimeInOrigin),
									new LegLine(i, trips[i].slices[sl].segments[seg].legs[leg].arrivalTimeInOrigin)]);
						}
					}
				}
			}
			var path = this.chartElements.mainChartElem.selectAll(".line").data(legs).attr("class","line");
			path.enter().append("path")
					.attr('d', lineGen)
					.attr("class","line")
					.style('stroke', 'green')
					.style('stroke-width', 2)
					.style('fill', 'none');
			//path.transition().ease("linear").duration(250); 
			path.exit().remove();
		}
		
		public redrawAxis():void {    
			//console.log('started creating ui elements ', axisData.dateAxisMinMaxList[this.chartNum]);
            //this.axisScale.left.domain([d3.min(this.flightResults.trips.tripOption, this.priceMinFn), d3.max(this.flightResults.trips.tripOption, this.priceMaxFn)]);  
			this.axisScale.positionScale.domain([0,currentValues.listSize]);          
            this.axisScale.leftScale.domain([axisData.priceMin, axisData.priceMax]);
            this.chartElements.leftAxisElem.call(this.axis.leftAxis);
            this.axisScale.leftScrubScale.domain([axisData.priceMin, axisData.priceMax]);
            this.chartElements.leftScrubAxisElem.call(this.axis.leftScrubAxis);            
			this.brush.leftBrush.y(this.axisScale.leftScrubScale)
				.extent([axisData.priceMin, axisData.priceMax]);
            this.chartElements.leftBrushElem.call(this.brush.leftBrush)
				.selectAll("rect").attr("x", 0).attr("width", flightUIData.axisSize.leftScrubAxisSize);
				
			this.axisScale.rightScale.domain([axisData.dateAxisMinMaxList[this.chartNum].durationMin, axisData.dateAxisMinMaxList[this.chartNum].durationMax]);
            this.chartElements.rightAxisElem.call(this.axis.rightAxis);          
			this.brush.rightBrush.y(this.axisScale.rightScale)
				.extent([axisData.dateAxisMinMaxList[this.chartNum].durationMin, axisData.dateAxisMinMaxList[this.chartNum].durationMax]);
            this.chartElements.rightBrushElem.call(this.brush.rightBrush)
				.selectAll("rect").attr("x", (flightUIData.chartSize.width - flightUIData.axisSize.rightAxisSize)).attr("width", flightUIData.axisSize.rightAxisSize);
				
            this.axisScale.bottomScale.domain([parseDate(axisData.dateAxisMinMaxList[this.chartNum].departMinFullChart), parseDate(axisData.dateAxisMinMaxList[this.chartNum].departMaxFullChart)]);
            this.chartElements.bottomAxisElem.call(this.axis.bottomAxis);
            this.axisScale.bottomScrubScale.domain([parseDate(axisData.dateAxisMinMaxList[this.chartNum].departMin), parseDate(axisData.dateAxisMinMaxList[this.chartNum].departMax)]);
            this.chartElements.bottomScrubAxisElem.call(this.axis.bottomScrubAxis);
			this.brush.bottomBrush.x(this.axisScale.bottomScrubScale)
				.extent([parseDate(axisData.dateAxisMinMaxList[this.chartNum].departMin), parseDate(axisData.dateAxisMinMaxList[this.chartNum].departMax)]);
            this.chartElements.bottomBrushElem.call(this.brush.bottomBrush)
				.selectAll("rect").attr("y", +(flightUIData.chartSize.height - flightUIData.axisSize.bottomAxisSize)).attr("height", flightUIData.axisSize.bottomScrubAxisSize);
				
			this.axisScale.topScale.domain([parseDate(axisData.dateAxisMinMaxList[this.chartNum].arrivalMinFullChart), parseDate(axisData.dateAxisMinMaxList[this.chartNum].arrivalMaxFullChart)]);
            this.chartElements.topAxisElem.call(this.axis.topAxis);
            this.axisScale.topScrubScale.domain([parseDate(axisData.dateAxisMinMaxList[this.chartNum].arrivalMin), parseDate(axisData.dateAxisMinMaxList[this.chartNum].arrivalMax)]);
            this.chartElements.topScrubAxisElem.call(this.axis.topScrubAxis);
			this.brush.topBrush.x(this.axisScale.topScrubScale)
				.extent([parseDate(axisData.dateAxisMinMaxList[this.chartNum].arrivalMin), parseDate(axisData.dateAxisMinMaxList[this.chartNum].arrivalMax)]);
            this.chartElements.topBrushElem.call(this.brush.topBrush)
				.selectAll("rect").attr("y", +(flightUIData.axisSize.topAxisSize)).attr("height", flightUIData.axisSize.topScrubAxisSize);
			
			lineGen = d3.svg.line()
				.x((d: LegLine) => {return (flightUIData.axisSize.leftScrubAxisSize+flightUIData.axisSize.leftAxisSize)
												+this.axisScale.bottomScale(parseDate(d.groundTime));})
				.y((d: LegLine) => {return (flightUIData.axisSize.topAxisSize+flightUIData.axisSize.topScrubAxisSize)
												+0.9 * this.axisScale.positionScale(d.flightPosition + 1);});
        }
			
		public reCalculateUI(){	
			this.calculateSvg();
			this.calculateAxis();
		}
		private calculateSvg(): void {
			console.log('calculate svg elements ', this.chartNum);	
			this.chartElements.mainChartElem.attr("width", flightUIData.chartSize.width).attr("height", flightUIData.chartSize.height);
			
			this.chartElements.bottomAxisElem.attr("class", "x axis")			
				.attr("transform", "translate("+(flightUIData.axisSize.leftScrubAxisSize+flightUIData.axisSize.leftAxisSize)
					+" ,"+(flightUIData.chartSize.height -flightUIData.axisSize.bottomScrubAxisSize - flightUIData.axisSize.bottomAxisSize)+")");
			this.chartElements.bottomScrubAxisElem.attr("class", "x axis")
				.attr("transform", "translate("+(flightUIData.axisSize.leftScrubAxisSize+flightUIData.axisSize.leftAxisSize)
					+" ,"+(flightUIData.chartSize.height - flightUIData.axisSize.bottomScrubAxisSize)+")");
			this.chartElements.bottomBrushElem.attr("class", "x brush")
				.attr("transform", "translate("+(flightUIData.axisSize.leftScrubAxisSize+flightUIData.axisSize.leftAxisSize)+")");
				
			this.chartElements.leftAxisElem.attr("class", "y axis")
				.attr("transform", "translate("+(flightUIData.axisSize.leftScrubAxisSize+flightUIData.axisSize.leftAxisSize)+" ,"+(flightUIData.axisSize.topAxisSize+flightUIData.axisSize.topScrubAxisSize)+")");
			this.chartElements.leftScrubAxisElem.attr("class", "y axis")
				.attr("transform", "translate("+flightUIData.axisSize.leftScrubAxisSize+" ,"+(flightUIData.axisSize.topAxisSize+flightUIData.axisSize.topScrubAxisSize)+")");
			this.chartElements.leftBrushElem.attr("class", "y brush")
				.attr("transform", "translate(0,"+(flightUIData.axisSize.topAxisSize+flightUIData.axisSize.topScrubAxisSize)+")");
					
			this.chartElements.rightAxisElem.attr("class", "y axis")
				.attr("transform", "translate("+(flightUIData.chartSize.width - flightUIData.axisSize.rightAxisSize)+" ,"+(flightUIData.axisSize.topAxisSize+flightUIData.axisSize.topScrubAxisSize)+")");
			this.chartElements.rightBrushElem.attr("class", "y brush")
				.attr("transform", "translate(0,"+(flightUIData.axisSize.topAxisSize+flightUIData.axisSize.topScrubAxisSize)+")");
				
			this.chartElements.topAxisElem.attr("class", "x axis")			
				.attr("transform", "translate("+(flightUIData.axisSize.leftScrubAxisSize+flightUIData.axisSize.leftAxisSize)
					+" ,"+(flightUIData.axisSize.topAxisSize+flightUIData.axisSize.topScrubAxisSize)+")");
			this.chartElements.topScrubAxisElem.attr("class", "x axis")
				.attr("transform", "translate("+(flightUIData.axisSize.leftScrubAxisSize+flightUIData.axisSize.leftAxisSize)
					+" ,"+(flightUIData.axisSize.topScrubAxisSize)+")");
			this.chartElements.topBrushElem.attr("class", "x brush")
				.attr("transform", "translate("+(flightUIData.axisSize.leftScrubAxisSize+flightUIData.axisSize.leftAxisSize)+", "+(-flightUIData.axisSize.topScrubAxisSize)+")");
		}
		
		private calculateAxis(): void {
			//console.log('calculate axis elements ');
			this.axisScale = {
				bottomScale: d3.time.scale().range([0, flightUIData.chartSize.xScaleWidth]), 
				bottomScrubScale: d3.time.scale().range([0, flightUIData.chartSize.xScaleWidth]),  
				leftScale: d3.scale.linear().range([0, flightUIData.chartSize.yScaleHeight]),
				leftScrubScale: d3.scale.linear().range([0, flightUIData.chartSize.yScaleHeight]),  
				rightScale: d3.scale.linear().range([0, flightUIData.chartSize.yScaleHeight]),
				topScale: d3.time.scale().range([0, flightUIData.chartSize.xScaleWidth]), 
				topScrubScale: d3.time.scale().range([0, flightUIData.chartSize.xScaleWidth]),
				positionScale: d3.scale.linear().range([0, flightUIData.chartSize.yScaleHeight]) 
				}
			this.axis = {
				//bottomAxis: d3.svg.axis().orient("bottom").scale(this.axisScale.bottomScale).tickFormat(d3.time.format("%d %b %I %p")), 
				bottomAxis: d3.svg.axis().orient("bottom").scale(this.axisScale.bottomScale).tickFormat((data) => moment(data).utcOffset(departZone).format("h A Do")),
				bottomScrubAxis: d3.svg.axis().orient("bottom").scale(this.axisScale.bottomScrubScale).tickFormat((data) => moment(data).utcOffset(departZone).format("h A Do")), 
				leftAxis: d3.svg.axis().orient("left").scale(this.axisScale.leftScale).tickFormat(d3.format("s")), 
				leftScrubAxis: d3.svg.axis().orient("left").scale(this.axisScale.leftScrubScale).tickFormat(d3.format("s")), 
				rightAxis: d3.svg.axis().orient("right").scale(this.axisScale.rightScale).tickFormat(d3.format("s")),
				//topAxis: d3.svg.axis().orient("top").scale(this.axisScale.topScale).tickFormat(d3.time.format("%d %b %I %p %Z")), 
				topAxis: d3.svg.axis().orient("top").scale(this.axisScale.topScale).tickFormat((data) => moment(data).utcOffset(arrivalZone).format("h A Do")), 
				topScrubAxis: d3.svg.axis().orient("top").scale(this.axisScale.topScrubScale).tickFormat((data) => moment(data).utcOffset(arrivalZone).format("h A Do")),
				positionAxis: d3.svg.axis().orient("right").scale(this.axisScale.positionScale)
				};
			this.brush = {
				bottomBrush: d3.svg.brush()
					.on("brush", () => this.brushed(this.brush.bottomBrush, this.axisScale.bottomScrubScale, dimType.departTimeDim)),
				leftBrush: d3.svg.brush()
					.on("brush", () => this.brushed(this.brush.leftBrush, this.axisScale.leftScrubScale, dimType.priceDim)),
				rightBrush: d3.svg.brush()
					.on("brush", () => this.brushed(this.brush.rightBrush, this.axisScale.rightScale, dimType.durationDim)),
				topBrush: d3.svg.brush()
					.on("brush", () => this.brushed(this.brush.topBrush, this.axisScale.topScrubScale, dimType.arrivalTimeDim))}				
		}
		private initializeUIElements(){
			var drawArea = d3.select("#chartSection").append("div").attr("id", "chart"+this.chartNum).append("svg");
			this.chartElements = {
				mainChartElem: drawArea, 
				leftAxisElem: drawArea.append("g"), 
				leftScrubAxisElem: drawArea.append("g"), 
				leftBrushElem: drawArea.append("g"), 
				bottomAxisElem: drawArea.append("g"),
				bottomScrubAxisElem: drawArea.append("g"), 
				bottomBrushElem: drawArea.append("g"), 
				rightAxisElem: drawArea.append("g"), 
				rightBrushElem: drawArea.append("g"),
				topScrubAxisElem: drawArea.append("g"), 
				topBrushElem: drawArea.append("g"),
				topAxisElem: drawArea.append("g")};
			//this.path = this.chartElements.mainChartElem.selectAll("path");
		}	
		
		private brushed(brush: D3.Svg.Brush, scale: D3.Scale.Scale, dim: number): void{
			var extent = brush.empty() ? scale.domain() : brush.extent();
			//console.log("brushed ", extent);
			this.redrawFlights(dim, extent);
		}
	}
}