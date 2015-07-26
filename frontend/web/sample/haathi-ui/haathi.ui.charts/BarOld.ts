/// <reference path="../../../../definitions/d3/d3.d.ts" />
/// <reference path="../../../../online/js/site/slicer-all.d.ts" />

module Chart {
    export class BarOld {
      // from coordinateGridChart start
        private GRID_LINE_CLASS = "grid-line";
        private HORIZONTAL_CLASS = "horizontal";
        private VERTICAL_CLASS = "vertical";

        private _parent;
        private _g;
        private _chartBodyG;

        private _x;
        private _xOriginalDomain;
        private _xAxis: any = d3.svg.axis();
        private _xUnits = this.dcUnitsIntegers;
        private _xAxisPadding = 0;
        private _xElasticity = false;

        private _y;
        private _yAxis: any = d3.svg.axis();
        private _yAxisMin;
        private _yAxisMax;
        private _yAxisHeight;
        private _yAxisPadding = 0;
        private _yElasticity = false;

        private _brush = d3.svg.brush();
        private _brushOn = true;
        private _round;

        private _renderHorizontalGridLine = false;
        private _renderVerticalGridLine = false;

        private _unitCount;

        private _clipPadding = 0;
      // from coordinateGridChart end

        // from marginable start
        private _margins = { top: 10, right: 50, bottom: 30, left: 30 };
        //from marginable end

        //from base chart start
        private _dimension;
        private _group;

        private _anchor;
        private _root;
        private _svg;

        private _width = 200;
        private _height = 200;

        private _transitionDuration = 500;
        //from base chart end

        //from bar chart start
        private MIN_BAR_WIDTH = 1;
        private DEFAULT_GAP_BETWEEN_BARS = 2;

        private _gap = this.DEFAULT_GAP_BETWEEN_BARS;
        private _centerBar = false;

        private _numberOfBars;
        private _barWidth;
        //from bar chart end
        constructor(private anchor: any) {
        }

        private select(s) {
            return this._root.select(s);
        }

        private resetSvg() {
            this.select("svg").remove();
            return this.generateSvg();
        }

        private generateSvg() {
            this._svg = this._root.append("svg")
                .attr("width", this._width)
                .attr("height", this._height);
            return this._svg;
        }

        private getClipPathId() {
            return this.anchor.replace('#', '') + "-clip";
        }

        private generateG(parent) {
            if (parent === undefined)
                this._parent = this._svg;
            else
                this._parent = parent;

            this._g = this._parent.append("g");

            this._chartBodyG = this._g.append("g").attr("class", "chart-body")
                .attr("transform", "translate(" + this._margins.left + ", " + this._margins.top + ")")
                .attr("clip-path", "url(#" + this.getClipPathId() + ")");

            return this._g;
        }

        private dataSet(): boolean {
            return this._dimension !== undefined && this._group !== undefined
        }
        private appendOrSelect(parent, name) {
            var element = parent.select(name);
            if (element.empty()) element = parent.append(name);
            return element;
        }
        private xUnitCount() {
            if (this._unitCount === undefined) {
                var units = this._xUnits()(this._x.domain()[0], this._x.domain()[1], this._x.domain());

                if (units instanceof Array)
                    this._unitCount = units.length;
                else
                    this._unitCount = units;
            }

            return this._unitCount;
        }
        /*
        private prepareOrdinalXAxis (count) {
            if (!count)
                count = _chart.xUnitCount();
            var range = [];
            var currentPosition = 0;
            var increment = _chart.xAxisLength() / count;
            for (var i = 0; i < count; i++) {
                range[i] = currentPosition;
                currentPosition += increment;
            }
            _x.range(range);
        }

        private renderXAxis(g) {
            var axisXG = g.selectAll("g.x");

            if (axisXG.empty())
                axisXG = g.append("g")
                    .attr("class", "axis x")
                    .attr("transform", "translate(" + _chart.margins().left + "," + _chart.xAxisY() + ")");

            dc.transition(axisXG, _chart.transitionDuration())
                .call(_xAxis);
        }
        */
        private prepareXAxis(g) {
            if (this._xElasticity && !this.isOrdinal()) {
                //this._x.domain([_chart.xAxisMin(), _chart.xAxisMax()]);//pending
            }
            else if (this.isOrdinal() && this._x.domain().length === 0) {
                //this._x.domain(_chart.computeOrderedGroups().map(function (kv) { return kv.key; }));//pending
            }

            if (this.isOrdinal()) {
                //this.prepareOrdinalXAxis();//pending
            } else {
                this._x.range([0, this.xAxisLength()]);
            }

            this._xAxis = this._xAxis.scale(this._x).orient("bottom");

            this.renderVerticalGridLines(g);
        }
        private prepareYAxis(g) {
            if (this._y === undefined || this._yElasticity) {
                this._y = d3.scale.linear();
                this._y.domain([this._yAxisMin, this._yAxisMax]).rangeRound([this._yAxisHeight, 0]);
            }

            this._y.range([this._yAxisHeight, 0]);
            this._yAxis = this._yAxis.scale(this._y).orient("left");

            this.renderHorizontalGridLines(g);
        }
        private transition = function (selections, duration, callback ?: any) {
            if (duration <= 0 || duration === undefined)
                return selections;

            var s = selections
                .transition()
                .duration(duration);

            if (callback instanceof Function) {
                callback(s);
            }

            return s;
        }
        private renderVerticalGridLines(g) {
            var gridLineG = g.selectAll("g." + this.VERTICAL_CLASS);

            if (this._renderVerticalGridLine) {
                if (gridLineG.empty())
                    gridLineG = g.insert("g", ":first-child")
                        .attr("class", this.GRID_LINE_CLASS + " " + this.VERTICAL_CLASS)
                        .attr("transform", "translate(" + this.yAxisX() + "," + this._margins.top + ")");

                var ticks = this._xAxis.tickValues() ? this._xAxis.tickValues() : this._x.ticks(this._xAxis.ticks()[0]);

                var lines = gridLineG.selectAll("line")
                    .data(ticks);

                // enter
                var linesGEnter = lines.enter()
                    .append("line")
                    .attr("x1", function (d) {
                        return this._x(d);
                    })
                    .attr("y1", this.xAxisY() - this._margins.top)
                    .attr("x2", function (d) {
                        return this._x(d);
                    })
                    .attr("y2", 0)
                    .attr("opacity", 0);
                this.transition(linesGEnter, this._transitionDuration)
                    .attr("opacity", 1);

                // update
                this.transition(lines, this._transitionDuration)
                    .attr("x1", function (d) {
                        return this._x(d);
                    })
                    .attr("y1", this.xAxisY() - this._margins.top)
                    .attr("x2", function (d) {
                        return this._x(d);
                    })
                    .attr("y2", 0);

                // exit
                lines.exit().remove();
            }
            else {
                gridLineG.selectAll("line").remove();
            }
        }


        private renderHorizontalGridLines(g) {
            var gridLineG = g.selectAll("g." + this.HORIZONTAL_CLASS);

            if (this._renderHorizontalGridLine) {
                var ticks = this._yAxis.tickValues() ? this._yAxis.tickValues() : this._y.ticks(this._yAxis.ticks()[0]);

                if (gridLineG.empty())
                    gridLineG = g.insert("g", ":first-child")
                        .attr("class", this.GRID_LINE_CLASS + " " + this.HORIZONTAL_CLASS)
                        .attr("transform", "translate(" + this.yAxisX() + "," + this._margins.top + ")");

                var lines = gridLineG.selectAll("line")
                    .data(ticks);

                // enter
                var linesGEnter = lines.enter()
                    .append("line")
                    .attr("x1", 1)
                    .attr("y1", function (d) {
                        return this._y(d);
                    })
                    .attr("x2", this.xAxisLength())
                    .attr("y2", function (d) {
                        return this._y(d);
                    })
                    .attr("opacity", 0);
                this.transition(linesGEnter, this._transitionDuration)
                    .attr("opacity", 1);

                // update
                this.transition(lines, this._transitionDuration)
                    .attr("x1", 1)
                    .attr("y1", function (d) {
                        return this._y(d);
                    })
                    .attr("x2", this.xAxisLength())
                    .attr("y2", function (d) {
                        return this._y(d);
                    });

                // exit
                lines.exit().remove();
            }
            else {
                gridLineG.selectAll("line").remove();
            }
        }

        private xAxisY() {
            return (this._height - this._margins.bottom);
        }
        private yAxisX() {
            return this._margins.left;
        }
        private xAxisLength() {
            return this.effectiveWidth();
        }

        private yAxisHeight() {
            return this.effectiveHeight();
        }

        private effectiveWidth() {
            return this._width - this._margins.left - this._margins.right;
        }

        private effectiveHeight() {
            return this._height - this._margins.top - this._margins.bottom;
        }

        private generateClipPath() {
            var defs = this.appendOrSelect(this._parent, "defs");

            var chartBodyClip = this.appendOrSelect(defs, "clipPath").attr("id", this.getClipPathId());

            var padding = this._clipPadding * 2;

            this.appendOrSelect(chartBodyClip, "rect")
                .attr("width", this.xAxisLength() + padding)
                .attr("height", this.yAxisHeight() + padding);
        }
        private isOrdinal() {
            return this._xUnits === this.dcUnitsOrdinal;
        }

        private getNumberOfBars() {
            if (this._numberOfBars === undefined) {
                this._numberOfBars = _chart.xUnitCount();
            }

            return this._numberOfBars;
        }

        private calculateBarWidth() {
            if (this._barWidth === undefined) {
                var numberOfBars = this.isOrdinal() ? getNumberOfBars() + 1 : getNumberOfBars();

                var w = Math.floor((this.xAxisLength() - (numberOfBars - 1) * _gap) / numberOfBars);

                if (w == Infinity || isNaN(w) || w < MIN_BAR_WIDTH)
                    w = MIN_BAR_WIDTH;

                _barWidth = w;
            }
        }

        private plotData() {
            this.calculateBarWidth();

            var bars = this._chartBodyG.selectAll("rect.bar")
            .data(this._group);

            bars.enter()
                .append("rect")
                .attr("class", "bar")
                .attr("fill", function (d) {
                    return d3.scale.category10()(i);
                })
                .append("title").text("temp");

            if (this.isOrdinal())
                bars.on("click", onClick);

            dc.transition(bars, this._transitionDuration)
                .attr("x", function (d) {
                    var x = this._x(d.x);
                    if (_centerBar) x -= _barWidth / 2;
                    return dc.utils.safeNumber(x);
                })
                .attr("y", function (d) {
                    var y = _chart.y()(d.y + d.y0);

                    if (d.y < 0)
                        y -= barHeight(d);

                    return dc.utils.safeNumber(y);
                })
                .attr("width", _barWidth)
                .attr("height", function (d) {
                    return barHeight(d);
                })
                .select("title").text(_chart.title());

            dc.transition(bars.exit(), _chart.transitionDuration())
                .attr("height", 0)
                .remove();
        }

        private doRender() {
            //throw exception if x is missing

            this.resetSvg();

            if (this.dataSet()) {
                this.generateG(null);

                this.generateClipPath();
                this.prepareXAxis(this._g);
                this.prepareYAxis(this._g);

                this.plotData();

                this.renderXAxis(this._g);
                this.renderYAxis(this._g);

                this.renderBrush(this._g);

                this.enableMouseZoom();
            }

            return this;
        }

        public render() {
            //_listeners.preRender(_chart);

            //throw exception if dimension is missing

            //throw exception if group is missing

            var result = this.doRender();

            if (_legend) _legend.render();

            _chart.activateRenderlets("postRender");

            return result;
        }

        private dcUnitsIntegers = function (s ?: any, e ?: any) {
            return Math.abs(e - s);
        }

        private dcUnitsOrdinal = function (s, e, domain) {
            return domain;
        }
    }
}