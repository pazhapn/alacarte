/// <reference path="../../../../definitions/d3/d3.d.ts" />
/// <reference path="../../../../definitions/sockjs/sockjs.d.ts" />
/// <reference path="../../../../online/js/site/slicer-all.d.ts" />
/// <reference path="UIRequest.ts" />
/// <reference path="BarChart.ts" />
/// <reference path="CheckBoxFilter.ts" />
/// <reference path="ChartsData.ts" />
/// <reference path="UIPaginationController.ts" />
/// <reference path="UIDisplayController.ts" />

module chart {
    export class ChartsController {

        private chartInitialized: boolean;
        private charts;
        private checkboxes;
        private sock: SockJS;
        private displayListSize: number = 10;
        private minMaxStar: any[];
        private minPrices: HTMLElement[] = [];
        private minTAs: HTMLElement[] = [];
        private maxPrices: HTMLElement[] = [];
        private maxTAs: HTMLElement[] = [];
        private paginationController: UIPaginationController;
        private displayController: UIDisplayController;
        private chartsData: ChartsData;

        constructor(private sockUrl: string, private requestId: string) {
            this.chartInitialized = false;
            this.chartsData = new ChartsData();
            this.createSockJs();
            this.paginationController = new UIPaginationController(this.chartsData);
            this.displayController = new UIDisplayController(this.chartsData);
            this.paginationController.setListBy(this.paginationController.listByConds.price);
            //this.collectMinMaxElements();
        }

        public addRecords(data: any[]) {
            this.chartsData.slicer.addRecords(data);
            this.collectPriceMinMaxForStar();
            if (!this.chartInitialized) {
                this.chartInitialized = true;
                this.chartsData.initializeDimensions();
                this.chartsData.initializeGroups();
                this.displayController.collectMinMaxStarByReduce();
                this.initializeCharts();
                this.initializeCheckBoxes();
                this.renderAllCharts();
            }
        }

        public setListBy(l: string) {
            this.paginationController.setListBy(l);
        }
        /*
        private collectMinMaxElements(): void {
            for (var i = 1; i < 6; i++) {
                this.minPrices[i] = document.getElementById("starMinPrice" + i);
                this.minTAs[i] = document.getElementById("starMinTA" + i);
                this.maxPrices[i] = document.getElementById("starMaxPrice" + i);
                this.maxTAs[i] = document.getElementById("starMaxTA" + i);
            }
        }
        private updateMinMaxSummary(): void {
            //console.log(this.minMaxStar);
            for (var i = 1; i < 6; i++) {
                this.minPrices[i].textContent = this.minMaxStar[i].min.price;
                this.minTAs[i].textContent  = (this.minMaxStar[i].min.tripAdvisorRating === undefined) ? "" : this.minMaxStar[i].min.tripAdvisorRating;
                this.maxPrices[i].textContent  = this.minMaxStar[i].max.price;
                this.maxTAs[i].textContent  = (this.minMaxStar[i].max.tripAdvisorRating === undefined) ? "" : this.minMaxStar[i].max.tripAdvisorRating;
            }
        }
        */

        private createSockJs(): void {
            this.sock = new SockJS(this.sockUrl);
            this.sock.onopen = () => this.sock.send(JSON.stringify(new UIRequest(this.requestId, UIRequest.CLIENT_READY)))
            this.sock.onmessage = (e) => {
                var hotelsResponse = JSON.parse(e.data);
                //console.log('hotelsResponse', hotelsResponse);
                this.addRecords(hotelsResponse.hotels);
            }
            this.sock.onclose = () => { console.log('close'); }
        }

        private renderAllCharts(): void {
            for (var j = 0; j < this.charts.length; j++) {
                this.charts[j].renderChartForNewData();
            }
            this.renderCommonPortions();
            this.paginationController.displayInitialPage();
        }

        public reRenderAllChartsPortions(): void {
            for (var j = 0; j < this.charts.length; j++) {
                this.charts[j].renderChartPortions();
            }
            this.renderCommonPortions();
        }

        private renderCommonPortions() {
            for (var i = 0; i < this.checkboxes.length; i++) {
                this.checkboxes[i].renderCheckBoxes();
            }
            this.displayController.updateFilteredSum();
            this.displayController.updateFiltMinMaxSummary();
        }
        private initializeCharts(): void {
            this.charts = [
                new chart.BarChart("#price-chart", this.chartsData.slicer, this.chartsData.priceDim, this.chartsData.priceGroups, this.chartsData.priceGroupFactor, 0),
                //new chart.BarChart("#rating-chart", this.chartsData.slicer, this.chartsData.hotelRatingDim, this.chartsData.ratingGroups, this.chartsData.hotelRatingGroupFactor, 5),
                new chart.BarChart("#trip-advisor-chart", this.chartsData.slicer, this.chartsData.tripAdvisorRatingDim, this.chartsData.tripAdvisorGroups, this.chartsData.tripAdvisorGroupFactor, 0)
            ];
            this.charts[0].on("brush", () => this.reRenderAllChartsPortions())
                .on("brushend", () => {
                    this.reRenderAllChartsPortions();
                    this.paginationController.displayInitialPage();
                });

            this.charts[1].on("brush", () => this.reRenderAllChartsPortions())
                .on("brushend", () => {
                    this.reRenderAllChartsPortions();
                    this.paginationController.displayInitialPage();
                });
            this.charts[1].setDisplayPrecision(1);
            /*
            this.charts[2].on("brush", () => this.reRenderAllChartsPortions())
                .on("brushend", () => {
                    this.reRenderAllChartsPortions();
                    this.paginationController.displayInitialPage();
                });
            this.charts[2].setDisplayPrecision(2);
            */
        }
        private initializeCheckBoxes(): void {
            this.checkboxes = [
                new chart.CheckBoxFilter("rating-chart", this.chartsData.slicer, this.chartsData.hotelRatingDim, this.chartsData.ratingGroups, this),
            ];
        }

        private collectPriceMinMaxForStar() {
            var data: any[] = this.chartsData.slicer.getData();
            this.minMaxStar = [];
            var star;
            for (var i = 0; i < data.length; i++){
                star = Math.floor(data[i].hotelRating);
                if (!this.minMaxStar[star]) {
                    this.minMaxStar[star] = {
                        min: { price: data[i].price, tripAdvisorRating: data[i].tripAdvisorRating },
                        max: { price: data[i].price, tripAdvisorRating: data[i].tripAdvisorRating }
                    };
                }
                if (data[i].price < this.minMaxStar[star].min.price) {
                    this.minMaxStar[star].min.price = data[i].price;
                    this.minMaxStar[star].min.tripAdvisorRating = data[i].tripAdvisorRating;
                }
                if (data[i].price > this.minMaxStar[star].max.price) {
                    this.minMaxStar[star].max.price = data[i].price;
                    this.minMaxStar[star].max.tripAdvisorRating = data[i].tripAdvisorRating;
                }
            }
            //this.updateMinMaxSummary();
        }
    }
}
