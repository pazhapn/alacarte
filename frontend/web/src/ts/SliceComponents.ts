/// <reference path="../defi/jquery.d.ts"/>
/// <reference path="../defi/d3.d.ts"/>
/// <reference path="../defi/nunjucks.d.ts"/>
/// <reference path="../defi/moment-timezone/moment-timezone.d.ts"/>
/// <reference path="data/FlightUIData.ts"/>

module Flights {
	
	export class SliceComponents {		
		public top:String = "t";
		public bottom:String = "b";
		public left:String = "l";
		public right:String = "r";
		
		public chartElements: { mainChartElem: any, 
			leftAxisElem: any, leftBrushElem: any, 
			bottomAxisElem: any, bottomBrushElem: any, 
			rightAxisElem: any, rightBrushElem: any,			
			topAxisElem: any, topBrushElem: any};
			
		public axis: {bottomAxis:D3.Svg.Axis, leftAxis:D3.Svg.Axis, rightAxis:D3.Svg.Axis, 
			topAxis:D3.Svg.Axis, positionAxis:D3.Svg.Axis};
			
		public axisScale: {bottomScale:D3.Scale.TimeScale,  
			leftScale:D3.Scale.QuantitiveScale, 
			rightScale:D3.Scale.QuantitiveScale,
			topScale:D3.Scale.TimeScale,  
			positionScale:D3.Scale.QuantitiveScale};	
				
        public brush: {bottomBrush: D3.Svg.Brush, leftBrush: D3.Svg.Brush, rightBrush: D3.Svg.Brush, topBrush: D3.Svg.Brush};
		
		private xArc: D3.Svg.Arc;
		private yArc: D3.Svg.Arc;
		private departZone: any;
		private arrivalZone: any;
		
		constructor(private chartNum: number, private flightUIData: FlightUIData) {	
			this.calculateZones();
			this.initializeUIElements();
		}		
		
        /**
         * Zones are used in the axis exact local timings display
         * TODO: pending label for Timezone in axis
         */
        private calculateZones(): void {
            console.log("now ",moment.version);
            this.departZone = moment.parseZone(axisData.dateAxisMinMaxList[0].departMin).utcOffset();
            this.arrivalZone = moment.parseZone(axisData.dateAxisMinMaxList[0].arrivalMax).utcOffset();
            console.log(this.departZone, this.arrivalZone);
        }
		
		public redrawAxis(): void {
			this.axisScale.positionScale.domain([0,currentValues.listSize]); 			         
            this.axisScale.leftScale.domain([axisData.priceMin, axisData.priceMax]);
			this.axisScale.rightScale.domain([axisData.dateAxisMinMaxList[this.chartNum].durationMin, axisData.dateAxisMinMaxList[this.chartNum].durationMax]);
            this.axisScale.bottomScale.domain([chartDate(parseDate(axisData.dateAxisMinMaxList[this.chartNum].departMinFullChart), -30), 
				chartDate(parseDate(axisData.dateAxisMinMaxList[this.chartNum].departMaxFullChart), 30)]);
				
			this.axisScale.topScale.domain([chartDate(parseDate(axisData.dateAxisMinMaxList[this.chartNum].arrivalMinFullChart), -30), 
				chartDate(parseDate(axisData.dateAxisMinMaxList[this.chartNum].arrivalMaxFullChart), 30)]);
		}
		
		public redrawBrush(brush: D3.Svg.Brush, brushType: String): void{ 
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
		public callAxis(): void {
            this.chartElements.leftAxisElem.call(this.axis.leftAxis); 
            this.chartElements.rightAxisElem.call(this.axis.rightAxis);   
            this.chartElements.bottomAxisElem.call(this.axis.bottomAxis);  
            this.chartElements.topAxisElem.call(this.axis.topAxis);  
		}
		
		public redrawAxisHandles(): void {
            var leftBar = this.chartElements.leftBrushElem.call(this.brush.leftBrush);
			leftBar.selectAll("rect")
				.attr("x", (this.flightUIData.axisSize.leftAxisSize - this.flightUIData.brushSize.leftBrushSize))
				.attr("width", this.flightUIData.brushSize.leftBrushSize);
			leftBar.selectAll(".resize").selectAll("path").remove();
			leftBar.selectAll(".resize").append("path")
				.attr("transform", "translate("+(this.flightUIData.axisSize.leftAxisSize  -0.5 *  this.flightUIData.brushSize.leftBrushSize )+", "+ 0 + ") rotate(90)")
				.attr("d", this.yArc);	  
				
            var rightBar = this.chartElements.rightBrushElem.call(this.brush.rightBrush);
			rightBar.selectAll("rect")
				.attr("x", (this.flightUIData.chartSize.width - this.flightUIData.axisSize.rightAxisSize))
				.attr("width", this.flightUIData.axisSize.rightAxisSize);			
			rightBar.selectAll(".resize").selectAll("path").remove();
			rightBar.selectAll(".resize").append("path")
				.attr("transform", "translate("+(this.flightUIData.chartSize.width  -0.5 *  this.flightUIData.brushSize.rightBrushSize )+", "+ 0 + ") rotate(90)")
				.attr("d", this.yArc);	
            var bottomBar = this.chartElements.bottomBrushElem.call(this.brush.bottomBrush);
			bottomBar.selectAll(".resize").selectAll("path").remove();
			bottomBar.selectAll(".resize").append("path")
				.attr("transform", "translate(0," +  (this.flightUIData.chartSize.height - 0.5 * this.flightUIData.axisSize.bottomAxisSize) + ")")
				.attr("d", this.xArc);
			bottomBar.selectAll("rect")
				.attr("y", +(this.flightUIData.chartSize.height - this.flightUIData.axisSize.bottomAxisSize))
				.attr("height", this.flightUIData.axisSize.bottomAxisSize);
            var topBar = this.chartElements.topBrushElem.call(this.brush.topBrush);
			topBar.selectAll("rect")
				.attr("y", +(this.flightUIData.axisSize.topAxisSize))
				.attr("height", this.flightUIData.axisSize.topAxisSize);
			
			topBar.selectAll(".resize").selectAll("path").remove();
			topBar.selectAll(".resize").append("path")
				.attr("transform", "translate(0," +  1.5 * this.flightUIData.axisSize.topAxisSize + ")")
				.attr("d", this.xArc);
		}	
		
		public calculateAxis(): void {
			this.axisScale = {
				bottomScale: d3.time.scale().range([0, this.flightUIData.chartSize.xScaleWidth]), 
				leftScale: d3.scale.linear().range([0, this.flightUIData.chartSize.yScaleHeight]),
				rightScale: d3.scale.linear().range([0, this.flightUIData.chartSize.yScaleHeight]),
				topScale: d3.time.scale().range([0, this.flightUIData.chartSize.xScaleWidth]), 
				positionScale: d3.scale.linear().range([0, this.flightUIData.chartSize.yScaleHeight]) 
				}
			this.axis = {
				bottomAxis: d3.svg.axis().orient("bottom").scale(this.axisScale.bottomScale).tickFormat((data) => moment(data).utcOffset(this.departZone).format("h A Do")),
				leftAxis: d3.svg.axis().orient("left").scale(this.axisScale.leftScale).tickFormat(d3.format("s")), 
				rightAxis: d3.svg.axis().orient("right").scale(this.axisScale.rightScale).tickFormat(d3.format("s")),
				topAxis: d3.svg.axis().orient("top").scale(this.axisScale.topScale).tickFormat((data) => moment(data).utcOffset(this.arrivalZone).format("h A Do")), 
				positionAxis: d3.svg.axis().orient("right").scale(this.axisScale.positionScale)
				};				
		}
		
		public calculateSvg(): void {
			console.log('calculate svg elements ', this.chartNum);	
			this.chartElements.mainChartElem.attr("width", this.flightUIData.chartSize.width).attr("height", this.flightUIData.chartSize.height);
			
			this.chartElements.bottomAxisElem.attr("class", "x axis")			
				.attr("transform", "translate("+this.flightUIData.axisSize.leftAxisSize
					+" ,"+(this.flightUIData.chartSize.height - this.flightUIData.axisSize.bottomAxisSize)+")");
			this.chartElements.bottomBrushElem.attr("class", "x brush")
				.attr("transform", "translate("+this.flightUIData.axisSize.leftAxisSize+")");
				
			this.chartElements.leftAxisElem.attr("class", "y axis")
				.attr("transform", "translate("+this.flightUIData.axisSize.leftAxisSize+" ,"+this.flightUIData.axisSize.topAxisSize+")");
			this.chartElements.leftBrushElem.attr("class", "y brush")
				.attr("transform", "translate(0,"+this.flightUIData.axisSize.topAxisSize+")");
					
			this.chartElements.rightAxisElem.attr("class", "y axis")
				.attr("transform", "translate("+(this.flightUIData.chartSize.width - this.flightUIData.axisSize.rightAxisSize)+" ,"+this.flightUIData.axisSize.topAxisSize+")");
			this.chartElements.rightBrushElem.attr("class", "y brush")
				.attr("transform", "translate(0,"+this.flightUIData.axisSize.topAxisSize+")");
				
			this.chartElements.topAxisElem.attr("class", "x axis")			
				.attr("transform", "translate("+this.flightUIData.axisSize.leftAxisSize
					+" ,"+this.flightUIData.axisSize.topAxisSize+")");
			this.chartElements.topBrushElem.attr("class", "x brush")
				.attr("transform", "translate("+this.flightUIData.axisSize.leftAxisSize+", "+(-this.flightUIData.axisSize.topAxisSize)+")");
		}	
		/*
		public chartDate(date: Date, minutes: number): Date{
			return new Date(date.getTime() + minutes*60000);
		}
		*/
		private initializeUIElements(){
			var drawArea = d3.select("#chartSection").append("div").attr("id", "chart"+this.chartNum).append("svg");
			this.chartElements = {mainChartElem: drawArea, 
				leftAxisElem: drawArea.append("g"), leftBrushElem: drawArea.append("g"), 
				bottomAxisElem: drawArea.append("g"), bottomBrushElem: drawArea.append("g"), 
				rightAxisElem: drawArea.append("g"), rightBrushElem: drawArea.append("g"), 
				topAxisElem: drawArea.append("g"), topBrushElem: drawArea.append("g")
				};
			this.xArc = d3.svg.arc().innerRadius(this.flightUIData.brushSize.topBrushSize/2).startAngle(0).endAngle(function(d, i) { return i ? -Math.PI : Math.PI; })
			this.yArc = d3.svg.arc().outerRadius(this.flightUIData.brushSize.leftBrushSize/2).startAngle(0)
				.endAngle(function(d, i) { console.log("d and i", d, i); return -i ? Math.PI : -Math.PI; })
		}	
	}	
}