/// <reference path="../../../../definitions/d3/d3.d.ts" />
/// <reference path="../../../../online/js/site/slicer-all.d.ts" />

module chart {
    export class BarChart {

        private margin = { top: 10, right: 10, bottom: 40, left: 10 };
        
        private elastic = { margin: true, x: true, y: true };
        private barWidth = 260;
        private barHeight = 100;
        private xBarScale;
        private yBarScale;
        private xAxis = d3.svg.axis().orient("bottom");
        private yAxis = d3.svg.axis().orient("left");
        private brush = d3.svg.brush();
        private brushDirty;
        private chartWidth;
        private chartHeight;
        private bars;
        private barCounts;
        private bandWidth: number = 10;
        private bandWidthGap: number = 2;
        private svg;
        private g;
        private xg;
        private yg;
        private gBrush;
        private brushingElement;
        private brushHeight = 20;
        private xAxisHeight = 20;
        private yAxisWidth = 10;
        private minDisplay;
        private maxDisplay;
        private minX;
        private maxX;
        private previousExtent: any[];
        private minGroupValue;
        private maxGroupValue;
        private displayPrecision: number = 2;

        //TODO 1. add ticks, 2. add bandwidth, 3. y axis, 4. label
        //TODO performance find min max using top(1) and bottom(1)
        //TODO filtel all if brush min, max equals min, max values
        constructor(private id: string, private hSlicer: slicer.Slicer,
            private dimension: slicer.Dimension, private group: slicer.Group,
            private groupFactor, private tickCountXAxis) {
                this.xBarScale = d3.scale.linear().rangeRound([0, this.barWidth]);
                this.yBarScale = d3.scale.linear().rangeRound([this.barHeight, 0]);
                this.chartWidth = this.margin.left + this.barWidth + this.margin.right;
                this.chartHeight = this.margin.top + this.barHeight + this.margin.bottom;
                this.minDisplay = document.querySelector(this.id + "-min");
                this.maxDisplay = document.querySelector(this.id + "-max");
                this.initializeChartElements();
                this.initializeBrushEvents();
        }

        private calculateBandwidth(groups: any[]) {            
            var minDiff = 999999;
            var tempMinDiff;
            for (var i = 0; i < groups.length - 1; i++) {
                tempMinDiff = groups[i + 1].key - groups[i].key;
                if (tempMinDiff < minDiff) {
                    minDiff = tempMinDiff;
                }
            }
            var maxKey = d3.max(groups, (d) => d.key);
            this.bandWidth = this.xBarScale(maxKey * this.groupFactor) - this.xBarScale((maxKey - minDiff) * this.groupFactor) - this.bandWidthGap;
        }

        private calculateMinMaxXvalues(groups: any[]): void {
            this.minGroupValue = d3.min(this.hSlicer.getData(), this.dimension.value);
            this.maxGroupValue = d3.max(this.hSlicer.getData(), this.dimension.value);
            this.minX = Math.floor(this.group.key(this.minGroupValue) * this.groupFactor);
            this.maxX = Math.ceil(this.maxGroupValue / this.groupFactor) * this.groupFactor;
            //console.log("minx ", this.minX, this.maxX);
            this.xBarScale = this.xBarScale.domain([this.minX, this.maxX]);
        }

        private calculateScales(groups: any[]): void {
            this.calculateMinMaxXvalues(groups);
            this.yBarScale = this.yBarScale.domain([0, this.group.top(1)[0].value]);
            this.yAxis = this.yAxis.scale(this.yBarScale);
            this.calculateBandwidth(groups);
            this.xAxis = this.xAxis.scale(this.xBarScale).tickFormat((d) => {
                //console.log("tick ", d);
                if (this.groupFactor > 1000) { return Math.floor(d / 1000 ) +"K"; }
                else { return d; }
            });

            if (this.tickCountXAxis > 0) {
                this.xAxis = this.xAxis.ticks(this.tickCountXAxis);
            }
            this.brush = this.brush.x(this.xBarScale);
        }
        
        public renderChartForNewData(): void {
            var groups = this.group.all();
            this.calculateScales(groups);
            //this.bandWidth = this.barWidth / d3.max(groups, (d) => d.key) - 1;
            this.renderYAxis();
            this.renderXAxis();
            this.bars = this.g.selectAll("rect.bar").data(groups);
            this.bars.enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", (d, i) => { return this.xBarScale(d.key * this.groupFactor) })
                .attr("y", (d, i) => this.yBarScale(d.value))
                .attr('width', this.bandWidth)
                .attr('height', (d, i) => this.barHeight - this.yBarScale(d.value))
                .attr('title', "");
            
            this.barCounts = this.g.selectAll("text").data(groups);
            this.barCounts.enter()
                .append("text")
                .text((d) => d.value)
                .attr("text-anchor", "middle")
                .attr("x", (d, i) => this.xBarScale(d.key * this.groupFactor) + this.bandWidth / 2)
                .attr("y", (d, i) => this.yBarScale(d.value))
                .attr("font-family", "sans-serif")
                .attr("font-size", "0.75em")
                .attr("fill", "black");
            this.renderBrush([this.minX, this.maxX]);
            this.brushDirtyReset();
        }

        public renderChartPortions(): void {
            if (this.brushingElement !== this.id) {
                this.renderYAxis();
                this.bars = this.g.selectAll("rect.bar").data(this.group.all());
                this.bars.transition().duration(10)
                    .attr("x", (d, i) => this.xBarScale(d.key * this.groupFactor))
                    .attr("y", (d, i) => this.yBarScale(d.value))
                    .attr('width', this.bandWidth)
                    .attr('height', (d, i) => this.barHeight - this.yBarScale(d.value))
                    .attr('title', "temp");
                
                this.barCounts = this.g.selectAll("text").data(this.group.all());
                this.barCounts.transition().duration(10)
                    .text((d) => (d.value > 0)?d.value:"")
                    .attr("text-anchor", "middle")
                    .attr("x", (d, i) => this.xBarScale(d.key * this.groupFactor) + this.bandWidth / 2)
                    .attr("y", (d, i) => this.yBarScale(d.value))
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "0.75em")
                    .attr("fill", "black");
                //this.bars.exit().attr('height', (d, i) => 0).remove();
                //this.barCounts.exit().attr('height', (d, i) => 0).remove();
                this.brushDirtyReset();
            }
        }

        public filter(_) {
            if (_) {
                this.brush.extent(_);
                this.dimension.filterRange(_);
            } else {
                this.brush.clear();
                this.dimension.filterAll();
            }
            this.brushDirty = true;
            return this;
        }

        private resizePath(d) {
            var e = +(d === "e"),
                x = e ? 1 : -1,
                y = this.brushHeight;
            return "M" + (0.5 * x) + "," + y
                + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6)
                + "V" + (2 * y - 6)
                + "A6,6 0 0 " + e + " " + (0.5 * x) + "," + (2 * y)
                + "Z"
                + "M" + (2.5 * x) + "," + (y + 8)
                + "V" + (2 * y - 8)
                + "M" + (4.5 * x) + "," + (y + 8)
                + "V" + (2 * y - 8);
        }

        private brushDirtyReset() {
            // Only redraw the brush if set externally.
            if (this.brushDirty) {
                this.brushDirty = false;
                this.brushMove();              
            }
            this.gBrush.selectAll(".resize").select("path").attr("d", (d) => this.resizePath(d));
        }

        private initializeChartElements() {
            this.svg = d3.select(this.id).append("svg")
                .append("g")
                .attr("width", this.chartWidth)
                .attr("height", this.chartHeight)
                .attr("transform", "translate(0," + this.margin.top + ")");
            /*
            this.svg.append("g")
                    .attr("transform", "translate(" + this.yAxisWidth + ",0)")
                .append("text").text("Price")
                    .attr("text-anchor", "middle")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "13px")
                    .attr("fill", "black");
            */
            this.g = this.svg.append("g")
                .attr("class", "barGroup")
                .attr("transform", "translate(" + this.yAxisWidth + ",0)")
                .attr("width", this.barWidth)
                .attr("height", this.barHeight);

            this.xg = this.svg.append("g")
                .attr("class", "xaxis")
                .attr("width", this.barWidth)
                .attr("height", this.xAxisHeight)
                .attr("transform", "translate(" + this.yAxisWidth + "," + this.barHeight + ")");
            
            this.yg = this.svg.append("g")
                .attr("class", "yaxis")
                .attr("width", this.yAxisWidth)
                .attr("height", this.barHeight)
                .attr("transform", "translate(" + this.yAxisWidth + ", 0)");
            //this.yg.call(this.yAxis);
            // Initialize the brush component with pretty resize handles.
            this.gBrush = this.svg.append("g")
                .attr("class", "brush")
                .attr("width", this.barWidth)
                .attr("height", this.brushHeight)
                .attr("transform", "translate(" + this.yAxisWidth + "," + this.barHeight + ")");
            //.attr("transform", "translate(" + this.margin.left + "," + (this.margin.top + this.height) + ")");
        }

        private renderXAxis(): void {
            this.xg.attr("width", this.barWidth + this.bandWidth);
            this.xg.call(this.xAxis);
        }

        private renderYAxis(): void {
            //this.yBarScale = this.yBarScale.domain([0, this.group.top(1)[0].value]);//NOTE this transitions y axis
            //this.yg.transition().duration(10).call(this.yAxis);
        }

        private renderBrush(extent: any[]): void {
            //console.log("renderbrush ", extent[0], extent[1]);
            this.brush.extent(extent);
            this.gBrush.attr("width", this.barWidth+ this.bandWidth);
            this.gBrush.call(this.brush);
            this.gBrush.selectAll("rect")
                .attr("height", this.brushHeight);
            this.gBrush.selectAll(".resize").append("path")
                .attr("transform", "translate(0,-" + this.brushHeight + ")");
            //this.hiliteBarsSelected(this.brush.extent());
            this.handleBrushMove(extent);
        }

        private renderMinMaxvalues(extent: any[]) {
            //console.log("renderMinMaxvalues ", extent);
            this.minDisplay.innerHTML = this.xBarScale.invert(this.xBarScale(extent[0])).toFixed(this.displayPrecision);
            this.maxDisplay.innerHTML = this.xBarScale.invert(this.xBarScale(extent[1])).toFixed(this.displayPrecision);
            /*
            console.log(this.xBarScale.invert(this.xBarScale(extent[0])).toFixed(this.displayPrecision),
                this.xBarScale.invert(this.xBarScale(extent[1])).toFixed(this.displayPrecision));
            */
        }
        /*
        private hiliteBarsSelected(extent: any[]) {
            if (extent) {
                this.renderMinMaxvalues(extent);
                this.g.selectAll('.bar').classed("selected",
                    (d, i) => {
                        //console.log("selection ", i, " extent ", this.group.key(extent[0]), d.key, this.group.key(extent[1]));
                        //return this.xBarScale(extent[0]) <= this.xBarScale(d.key * this.groupFactor)
                        //&& this.xBarScale(d.key * this.groupFactor) + this.bandWidth + this.bandWidthGap <= this.xBarScale(extent[1]);
                        //return extent[0] <= d.key * this.groupFactor && d.key * this.groupFactor < extent[1];
                        //return (this.group.key(extent[0]) <= d.key && this.group.size() >= i + 1) && (d.key < this.group.key(extent[1]) || (this.group.size() === i + 1 && d.key <= this.group.key(extent[1])));
                        return (this.group.key(extent[0]) <= d.key && this.group.size() > i)
                            && (d.key < this.group.key(extent[1]) || (this.group.size() === i + 1 && extent[1] >= this.maxGroupValue));
                    });
            }
        }
        */

        private hiliteBarsSelected(extent: any[]) {
            //console.log("hiliteBarsSelected ", extent);
            if (extent) {
                this.renderMinMaxvalues(extent);
                this.g.selectAll('.bar').classed("selected",
                    (d, i) => {
                        //console.log("key ",i, this.minX, this.group.key(extent[0]), d.key, this.group.key(extent[1]));
                        return (this.group.key(extent[0]) < d.key || (this.group.key(extent[0]) <= d.key && i === 0))
                             && (d.key <= this.group.key(extent[1]));
                    });
            }
        }

        private brushStart() {
            //this.svg.classed("selecting", true);
            this.brushingElement = this.id;
        }
        private brushMove() {
            this.handleBrushMove(this.brush.extent());
        }
        private handleBrushMove(extent: any[]) {
            /*
            var multiplyFactor: number = (this.displayPrecision === 1) ? 10 : 100;
            var extent: any[] = [Math.floor(brushExtent[0] * multiplyFactor) / multiplyFactor,
                Math.floor(brushExtent[1] * multiplyFactor) / multiplyFactor];
        */
            this.dimension.filterRange(extent);
            this.hiliteBarsSelected(extent);
        }
        /*
        private brushMove() {
            var extent: any[] = this.brush.extent();
            if (extent[1] === this.maxGroupValue) {
                this.dimension.filterRange([extent[0], extent[1] + 0.1]);
            } else {
                this.dimension.filterRange(extent);
            }
            this.hiliteBarsSelected(extent);
        }
        */
        private brushEnd() {
            console.log("brushEnd start");
            if (!d3.event.sourceEvent) {
                return; // only transition after input
            }
            console.log("brushEnd continue");
            var extent0 = this.brush.extent(), extent1 = [];
                //extent1 = extent0.map(Math.round);
            // if empty when rounded, use floor & ceil instead
            //if (extent1[0] >= extent1[1]) {

                var multiplyFactor: number = (this.displayPrecision === 1) ? 10 : 100;
            extent1[0] = Math.round((extent0[0] * multiplyFactor) / multiplyFactor);
            extent1[1] = Math.round((extent0[1] * multiplyFactor) / multiplyFactor);
            //}
            console.log("brushEnd ",extent0, extent1);
            if (this.brush.empty()) {
                //this.dimension.filterAll();
                if (!this.previousExtent) {
                    this.previousExtent = [this.minX, this.maxX];
                }
                //this.renderBrush(this.previousExtent);
                //this.brushMove();
            } else {
                //this.previousExtent = this.brush.extent();
                this.previousExtent = extent1;
            }
            console.log("brush end previousExtent ", this.previousExtent);
            this.renderBrush(this.previousExtent);
            this.brushingElement = "";
            //this.svg.classed("selecting", !this.brush.empty());
        }

        private initializeBrushEvents(): void {
            this.brush.on("brushstart.chart", () => this.brushStart());
            this.brush.on("brush.chart", () => this.brushMove());
            this.brush.on("brushend.chart", () => this.brushEnd());
            d3.rebind(this, this.brush, "on");
        }

        public setDisplayPrecision(t: number): void {
            this.displayPrecision = t;
        }
    }
}