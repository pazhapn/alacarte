/// <reference path="../../../src/defi/d3.d.ts" />
/// <reference path="../../../src/defi/crossfilter.d.ts" />
/// <reference path="../../../src/defi/jqueryui.d.ts" />

module hotelchart {
    export class FilterBarChart<T, TDimension, TKey, TValue> {
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
        private displayPrecision: number = 2;
        private snapPrecision: number = 0;

        //TODO 1. add ticks, 2. add bandwidth, 3. y axis, 4. label
        //TODO performance find min max using top(1) and bottom(1)
        //TODO filtel all if brush min, max equals min, max values
        constructor(private id: string, private hSlicer:CrossFilter.CrossFilter<T>,
            private dimension: CrossFilter.Dimension<T, TDimension>, private dimensionFunction,
            private group: CrossFilter.Group<T, TKey, TValue>, private groupFunction,
            private groupFactor, private tickCountXAxis,
            private chartsController: ChartsController<T, TDimension, TKey, TValue>) {
                this.xBarScale = d3.scale.linear().rangeRound([0, this.barWidth]);
                this.yBarScale = d3.scale.linear().rangeRound([this.barHeight, 0]);
                this.chartWidth = this.margin.left + this.barWidth + this.margin.right;
                this.chartHeight = this.margin.top + this.barHeight + this.margin.bottom;
                //this.minDisplay = document.querySelector(this.id + "-min");
                //this.maxDisplay = document.querySelector(this.id + "-max");
                this.minDisplay = $(this.id + "-min").spinner({
                    numberFormat: "n",
                    //change: () => this.trackMinChange(),
                    stop: () => this.trackMinChange()
                });
                this.maxDisplay = $(this.id + "-max").spinner({
                    numberFormat: "n",
                    //change: () => this.trackMaxChange(),
                    stop: () => this.trackMaxChange()
                });
                this.initializeChartElements();
                this.initializeBrushEvents();
        }
        /*
        private trackMinChange() {
            console.log("trackMaxChange before min value ", this.minDisplay.spinner("value"),
                this.minDisplay.spinner("option", "min"), this.minDisplay.spinner("option", "max"));
            console.log("trackMaxChange before max value ", this.maxDisplay.spinner("value"),
                this.maxDisplay.spinner("option", "min"), this.maxDisplay.spinner("option", "max"));
            this.maxDisplay.spinner("option", "min", this.getPrecisedValue(this.minDisplay.spinner("value") + this.snapPrecision));
            this.modifyBrushPosition();
            console.log("trackMaxChange after min value ", this.minDisplay.spinner("value"),
                this.minDisplay.spinner("option", "min"), this.minDisplay.spinner("option", "max"));
            console.log("trackMaxChange after max value ", this.maxDisplay.spinner("value"),
                this.maxDisplay.spinner("option", "min"), this.maxDisplay.spinner("option", "max"));
        }

        private trackMaxChange() {
            console.log("trackMaxChange before min value ", this.minDisplay.spinner("value"),
                this.minDisplay.spinner("option", "min"), this.minDisplay.spinner("option", "max"));
            console.log("trackMaxChange before max value ", this.maxDisplay.spinner("value"),
                this.maxDisplay.spinner("option", "min"), this.maxDisplay.spinner("option", "max"));
            this.minDisplay.spinner("option", "max", this.getPrecisedValue(this.maxDisplay.spinner("value") - this.snapPrecision));
            this.modifyBrushPosition();
            console.log("trackMaxChange after min value ", this.minDisplay.spinner("value"),
                this.minDisplay.spinner("option", "min"), this.minDisplay.spinner("option", "max"));
            console.log("trackMaxChange after max value ", this.maxDisplay.spinner("value"),
                this.maxDisplay.spinner("option", "min"), this.maxDisplay.spinner("option", "max"));
        }
            */
        private trackMinChange() {
            this.maxDisplay.spinner("option", "min", this.getPrecisedValue(this.minDisplay.spinner("value") + this.snapPrecision));
            this.modifyBrushPosition();
        }

        private trackMaxChange() {
            this.minDisplay.spinner("option", "max", this.getPrecisedValue(this.maxDisplay.spinner("value") - this.snapPrecision));
            this.modifyBrushPosition();
        }

        private modifyBrushPosition(): void {
            this.brush.extent([this.minDisplay.spinner("value"), this.maxDisplay.spinner("value")]);
            this.renderCharts();
            this.chartsController.renderAllCharts();
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
            var minGroupValue = d3.min(this.hSlicer.getData(), this.dimensionFunction);
            var maxGroupValue = d3.max(this.hSlicer.getData(), this.dimensionFunction);
            this.minX = Math.floor(this.groupFunction(minGroupValue) * this.groupFactor);
            this.maxX = Math.ceil(maxGroupValue / this.groupFactor) * this.groupFactor;
            //console.log("minx ", this.minX, this.maxX);
            this.minDisplay.spinner("option", "min", this.minX);
            this.minDisplay.spinner("option", "max", this.maxX - this.snapPrecision);
            this.maxDisplay.spinner("option", "min", this.minX + this.snapPrecision);
            this.maxDisplay.spinner("option", "max", this.maxX);
            this.xBarScale = this.xBarScale.domain([this.minX, this.maxX]);
        }

        private calculateScales(groups: any[]): void {
            this.calculateMinMaxXvalues(groups);
            this.yBarScale = this.yBarScale.domain([0, this.group.top(1)[0].value]);
            this.yAxis = this.yAxis.scale(this.yBarScale);
            this.calculateBandwidth(groups);
            this.xAxis = this.xAxis.scale(this.xBarScale).tickFormat((d) => {
                //console.log("tick ", d);
                //if (this.groupFactor > 1000) { return Math.floor(d / 1000) + "K"; }
                if (this.groupFactor > 1000) { return Math.floor(d / 1000); }
                else { return d; }
            });

            if (this.tickCountXAxis > 0) {
                this.xAxis = this.xAxis.ticks(this.tickCountXAxis);
            }
            this.brush = this.brush.x(this.xBarScale);
        }
        public resetBrush(): void {
            //console.log("resetBrush called");
            this.calculateScales(this.group.all());
            this.brush.extent([this.minX, this.maxX]);
            //console.log("resetBrush called ", this.brush.extent());
        }
        public renderCharts(): void {
            //console.log("this.brushingElement this.id ", this.brushingElement, this.id, this.brushingElement === this.id);
            if (!this.brushingElement || this.brushingElement !== this.id) {
                //console.log("rendering chart ", this.id);
                //this.calculateScales(this.group.all());
                this.renderYAxis();
                this.renderXAxis();
                this.renderBars();
                var extent = this.brush.extent();
                //console.log("brush extent to set ", extent);
                if (extent[0] === this.minX && extent[1] === this.minX) {
                    extent = [this.minX, this.maxX];
                    this.previousExtent = [this.minX, this.maxX];
                }
                this.renderBrush(extent);
                //this.bars.exit().attr('height', (d, i) => 0).remove();
                //this.barCounts.exit().attr('height', (d, i) => 0).remove();
                this.brushDirtyReset();
            }
        }

        private renderBars(): void {
            this.bars = this.g.selectAll("rect.bar").data(this.group.all());

            this.bars.enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", (d, i) => { return this.xBarScale(d.key * this.groupFactor) })
                .attr("y", (d, i) => this.yBarScale(d.value))
                .attr('width', this.bandWidth)
                .attr('height', (d, i) => this.barHeight - this.yBarScale(d.value))
                .attr('title', "");

            this.bars.transition().duration(10)
                .attr("x", (d, i) => this.xBarScale(d.key * this.groupFactor))
                .attr("y", (d, i) => this.yBarScale(d.value))
                .attr('width', this.bandWidth)
                .attr('height', (d, i) => this.barHeight - this.yBarScale(d.value))
                .attr('title', "temp");

            this.bars.exit().remove();

            this.barCounts = this.g.selectAll("text").data(this.group.all());

            this.barCounts.enter()
                .append("text")
                .text((d) => d.value)
                .attr("text-anchor", "middle")
                .attr("x", (d, i) => this.xBarScale(d.key * this.groupFactor) + this.bandWidth / 2)
                .attr("y", (d, i) => this.yBarScale(d.value))
                .attr("font-family", "arial")
                .attr("font-size", "0.75em")
                .attr("fill", "black");

            this.barCounts.transition().duration(10)
                .text((d) => (d.value > 0) ? d.value : "")
                .attr("text-anchor", "middle")
                .attr("x", (d, i) => this.xBarScale(d.key * this.groupFactor) + this.bandWidth / 2)
                .attr("y", (d, i) => this.yBarScale(d.value))
                .attr("font-family", "arial")
                .attr("font-size", "0.75em")
                .attr("fill", "black");


            this.barCounts.exit().remove();
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
            //console.log("this.brushDirty", this.brushDirty);
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
                    .attr("font-family", "arial")
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
            //console.log("renderbrush before call ", this.id, extent[0], extent[1]);
            this.brush.extent(extent);
            this.gBrush.attr("width", this.barWidth + this.bandWidth);
            this.gBrush.call(this.brush);
            this.gBrush.selectAll("rect")
                .attr("height", this.brushHeight);
            this.gBrush.selectAll(".resize").append("path")
                .attr("transform", "translate(0,-" + this.brushHeight + ")");
            //console.log("renderbrush after call ", this.id, this.brush.extent()[0], this.brush.extent()[1]);
            //this.hiliteBarsSelected(this.brush.extent());
            this.handleBrushMove(extent);
        }

        private getPrecisedValue(value: number): any {
            if (this.displayPrecision === 0) {
                return Math.round(value);
            } else {
                return value.toFixed(this.displayPrecision);
            }
        }
        private renderMinMaxvalues(extent: any[]) {
            //console.log("renderMinMaxvalues ", extent);
            this.minDisplay.spinner("value", this.getPrecisedValue(extent[0]));
            this.maxDisplay.spinner("value", this.getPrecisedValue(extent[1]));
            /*
            if (this.displayPrecision === 0) {
                this.minDisplay.innerHTML = Math.round(extent[0]);
                this.maxDisplay.innerHTML = Math.round(extent[1]);
            } else {
                this.minDisplay.innerHTML = extent[0].toFixed(this.displayPrecision);
                this.maxDisplay.innerHTML = extent[1].toFixed(this.displayPrecision);
            }
            */
            /*            
            this.minDisplay.innerHTML = this.xBarScale.invert(this.xBarScale(extent[0])).toFixed(this.displayPrecision);
            this.maxDisplay.innerHTML = this.xBarScale.invert(this.xBarScale(extent[1])).toFixed(this.displayPrecision);
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
                        //console.log("selection ", i, " extent ", this.groupFunction(extent[0]), d.key, this.groupFunction(extent[1]));
                        //return this.xBarScale(extent[0]) <= this.xBarScale(d.key * this.groupFactor)
                        //&& this.xBarScale(d.key * this.groupFactor) + this.bandWidth + this.bandWidthGap <= this.xBarScale(extent[1]);
                        //return extent[0] <= d.key * this.groupFactor && d.key * this.groupFactor < extent[1];
                        //return (this.groupFunction(extent[0]) <= d.key && this.group.size() >= i + 1) && (d.key < this.groupFunction(extent[1]) || (this.group.size() === i + 1 && d.key <= this.groupFunction(extent[1])));
                        return (this.groupFunction(extent[0]) <= d.key && this.group.size() > i)
                            && (d.key < this.groupFunction(extent[1]) || (this.group.size() === i + 1 && extent[1] >= this.maxGroupValue));
                    });
            }
        }
        */

        private hiliteBarsSelected(extent: any[]) {
            //console.log("hiliteBarsSelected ", extent);
            if (extent) {
                this.g.selectAll('.bar').classed("selected",
                    (d, i) => {
                        //console.log("key ",i, this.minX, this.groupFunction(extent[0]), d.key, this.groupFunction(extent[1]));
                        return (this.groupFunction(extent[0]) < d.key || (this.groupFunction(extent[0]) <= d.key && i === 0))
                            && (d.key <= this.groupFunction(extent[1]));
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
            //console.log("filter range applied ", extent);
            this.dimension.filterRange(extent);
            this.hiliteBarsSelected(extent);
            this.renderMinMaxvalues(extent);
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
            //console.log("brushEnd start");
            if (!d3.event.sourceEvent) {
                return; // only transition after input
            }
            //console.log("brushEnd continue ", this.brush.extent());
            if (!this.brush.empty()) {
                this.previousExtent = this.getSnappingExtent(this.brush.extent());
            }
            //console.log("brush end previousExtent ", this.previousExtent);
            this.renderBrush(this.previousExtent);
            this.brushingElement = "";
            this.minDisplay.spinner("option", "max", this.previousExtent[1] - this.snapPrecision);
            this.maxDisplay.spinner("option", "min", this.previousExtent[0] + this.snapPrecision);
        }

        private initializeBrushEvents(): void {
            this.brush.on("brushstart.chart", () => this.brushStart());
            this.brush.on("brush.chart", () => this.brushMove());
            this.brush.on("brushend.chart", () => this.brushEnd());
            d3.rebind(this, this.brush, "on");
        }

        private getSnappingExtent(extent: any): any {
            var a0, a1, t0, t1;
            var minVal = extent[0];
            var maxVal = extent[1];
            if (this.snapPrecision < 1 && this.snapPrecision !== 0) {
                a0 = Math.round(minVal * 10) / 10;
                a1 = Math.round(maxVal * 10) / 10;
            } else if (this.snapPrecision >= 1) {
                if (minVal !== this.minX) {
                    t0 = minVal / this.snapPrecision;
                    a0 = Math.floor(t0);
                    //console.log("getSnappingExtent before ", minVal, this.snapPrecision, a0);
                    a0 = ((t0 - a0) < 0.5) ? a0 : a0 + 1;
                    //console.log("getSnappingExtent before ", a0);
                    a0 = a0 * this.snapPrecision;
                    //console.log("getSnappingExtent before ", a0);
                } else {
                    a0 = this.minX;
                }

                if (maxVal !== this.maxX) {
                    t1 = maxVal / this.snapPrecision;
                    a1 = Math.floor(t1);
                    a1 = ((t1 - a1) < 0.5) ? a1 : a1 + 1;
                    a1 = a1 * this.snapPrecision;
                } else {
                    a1 = this.maxX;
                }
            }
            if (a0 === a1) {
                if (a1 < this.maxX) {
                    a1 = a1 + this.snapPrecision;
                } else {
                    a0 = a0 - this.snapPrecision;
                }
            }
            //console.log("getSnappingExtent before ", a0, a1);
            if (a0 < this.minX) {
                a0 = this.minX;
            } else if (a0 > this.maxX) {
                a0 = this.maxX;
            }
            if (a1 < this.minX) {
                a1 = this.minX;
            } else if (a1 > this.maxX) {
                a1 = this.maxX;
            }
            //console.log("getSnappingExtent ", a0, a1);
            return [a0, a1];
        }


        public setDisplayPrecision(t: number): void {
            this.displayPrecision = t;
        }

        public setSnapPrecision(t: number): void {
            this.snapPrecision = t;
            this.minDisplay.spinner("option", "step", this.snapPrecision);
            this.maxDisplay.spinner("option", "step", this.snapPrecision);
        }
    }
}