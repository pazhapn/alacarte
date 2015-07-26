/// <reference path="../../../src/defi/d3.d.ts" />
/// <reference path="../../../src/defi/sockjs.d.ts" />
/// <reference path="../../../src/defi/crossfilter.d.ts" />
/// <reference path="UIRequest.ts" />
/// <reference path="FilterBarChart.ts" />
/// <reference path="FilterCheckBox.ts" />
/// <reference path="ChartsData.ts" />
/// <reference path="UIPaginationController.ts" />
/// <reference path="UIDisplayController.ts" />

module hotelchart {
    export class ChartsController<T, TDimension, TKey, TValue> {
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
        private paginationController: UIPaginationController<T, TDimension, TKey, TValue>;
        private displayController: UIDisplayController<T, TDimension, TKey, TValue>;
        private chartsData: ChartsData<T, TDimension, TKey, TValue>;
        private recordCount: HTMLElement;
        private happening: HTMLElement;
        private happeningBar: HTMLElement;
        private alertMessageTimeout: any;

        constructor(private sockUrl: string, private requestId: string) {
            this.chartInitialized = false;
            this.chartsData = new ChartsData();
            this.createSockJs();
            this.paginationController = new UIPaginationController(this.chartsData);
            this.displayController = new UIDisplayController(this.chartsData);
            this.recordCount = document.getElementById("recordCount");
            this.happening = document.getElementById("happening");
            this.happeningBar = document.getElementById("happeningBar");
            //this.collectMinMaxElements();
        }

        public addRecords(data: any[]) {
            if (!this.chartInitialized) {
                this.chartInitialized = true;
                this.chartsData.slicer = crossfilter<T>(data);
                this.chartsData.initializeDimensions();
                this.chartsData.initializeGroups();
                this.displayController.collectMinMaxStarByReduce();
                this.initializeCharts();
                this.initializeCheckBoxes();
                //this.paginationController.setListBy(this.paginationController.listByConds.price);
            } else {
                this.chartsData.slicer.add(data);
                this.chartsData.initializeGroups();
                this.displayController.collectMinMaxStarByReduce();
                //this.charts[0].resetBrush();//price brush has to be reset for every new data addition
            }
            console.log("added new records");
            this.recordCount.textContent = this.chartsData.slicer.getData().length.toString();
            this.resetAllBrushes();
            this.renderAllCharts();
            //this.collectPriceMinMaxForStar();
        }

        public setListBy(l: string) {
            this.paginationController.setListBy(l);
        }
        public displayPrevPage(): void {
            this.paginationController.displayPrevPage();
        }
        public displayNextPage(): void {
            this.paginationController.displayNextPage();
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
                this.minTAs[i].textContent  = 
        (this.minMaxStar[i].min.tripAdvisorRating === undefined) ? "" : this.minMaxStar[i].min.tripAdvisorRating;
                this.maxPrices[i].textContent  = this.minMaxStar[i].max.price;
                this.maxTAs[i].textContent  = 
        (this.minMaxStar[i].max.tripAdvisorRating === undefined) ? "" : this.minMaxStar[i].max.tripAdvisorRating;
            }
        }
        */

        private createSockJs(): void {
            this.sock = new SockJS(this.sockUrl);
            this.sock.onopen = () => this.sock.send(JSON.stringify(new UIRequest(this.requestId, UIRequest.CLIENT_READY)))
            this.sock.onmessage = (e) => {
                if (e.data === "close") {
                //console.log('e.data', e.data);
                    this.sock.close();
                } else {
                    var hotelsResponse = JSON.parse(e.data);
                    if (hotelsResponse.responseType === "results") {
                        console.log('hotelsResponse ', hotelsResponse.hotels.length);
                        this.displayHappening(hotelsResponse.notifyMessage);
                        this.addRecords(hotelsResponse.hotels);
                    } else if (hotelsResponse.responseType === "notify") {
                        console.log('notifyMessage ', hotelsResponse.notifyMessage);
                        this.displayHappening(hotelsResponse.notifyMessage);
                    }
                }
            }
            this.sock.onclose = () => { console.log('close message received'); }
        }

        private clearHappening(): void {
            this.alertMessageTimeout = setTimeout(() => {
                this.happening.textContent = "";
                this.happeningBar.style.display = "none";
            }, 5000);
        }

        private displayHappening(message: string): void {
            this.clearHappening();
            this.happening.textContent = message;
            this.happeningBar.style.display = "block";
        }

        public renderAllCharts(): void {
            this.renderCharts();
            this.paginationController.displayInitialPage();
        }
        private resetAllBrushes(): void {
            for (var j = 0; j < this.charts.length; j++) {
                this.charts[j].resetBrush();
            }
        }
        private renderCharts() {
            for (var j = 0; j < this.charts.length; j++) {
                this.charts[j].renderCharts();
            }
            for (var i = 0; i < this.checkboxes.length; i++) {
                this.checkboxes[i].renderCheckBoxes();
            }
            this.displayController.updateFilteredSum();
            this.displayController.updateFiltMinMaxSummary();
        }
        private initializeCharts(): void {
            this.charts = [
                new FilterBarChart("#price-chart", this.chartsData.slicer, this.chartsData.priceDim,
                    this.chartsData.priceDimFunc, this.chartsData.priceGroups, this.chartsData.priceGroupsFunc,
                    this.chartsData.priceGroupFactor, 0, this),
                //new chart.BarChart("#rating-chart", this.chartsData.slicer, this.chartsData.hotelRatingDim, 
                //this.chartsData.ratingGroups, this.chartsData.hotelRatingGroupFactor, 5),
                new FilterBarChart("#trip-advisor-chart", this.chartsData.slicer, this.chartsData.tripAdvisorRatingDim,
                    this.chartsData.tripAdvisorRatingDimFunc, this.chartsData.tripAdvisorGroups,
                    this.chartsData.tripAdvisorGroupsFunc, this.chartsData.tripAdvisorGroupFactor, 0, this)
            ];
            this.charts[0].on("brush", () => this.renderAllCharts())
                .on("brushend", () => {
                    this.renderAllCharts();
                });
            this.charts[1].setDisplayPrecision(0);
            this.charts[0].setSnapPrecision(100);
            this.charts[1].on("brush", () => this.renderAllCharts())
                .on("brushend", () => {
                    this.renderAllCharts();
                });
            this.charts[1].setDisplayPrecision(1);
            this.charts[1].setSnapPrecision(0.1);
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
                new FilterCheckBox("rating-chart", this.chartsData.slicer, this.chartsData.hotelRatingDim,
                    this.chartsData.ratingGroups, this),
            ];
        }
        /*
        private collectPriceMinMaxForStar() {
            var data: any[] = this.chartsData.slicer.getData();
            this.minMaxStar = [];
            var star;
            for (var i = 0; i < data.length; i++) {
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
        */
    }
}