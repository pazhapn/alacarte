/// <reference path="../../../../definitions/dotjs/dot.d.ts" />
/// <reference path="ChartsData.ts" />

module chart {
    export class UIPaginationController {

        private listPage: HTMLElement;
        private listPagePrev: HTMLElement;
        private listPageNum: HTMLElement;
        private listPageNext: HTMLElement;
        private pagePosition: number = 1;
        private pageCount: number = 10;
        public listByConds = { "price": "p", "hotelRating": "s", "tripAdvisorRating": "t" };
        private listBy: string;
        private hotelTemplate;
        private paginationTemplate;
        private hotelsListElement;

        constructor(private chartsData: ChartsData) {
            this.hotelsListElement = d3.select("#hotels-list");
            this.listBy = this.listByConds.price;
            this.createTemplate();
            //this.buildPaginationTemplate();
            this.createPaginationElements();
            this.createListeners();
        }

        //TODO clear listeners
        public shutdown(): void {

        }

        //TODO sort by href should be disabled based on listBy value
        public setListBy(l: string) {
            var listBySame: boolean = (this.listBy === l);
            this.listBy = l;
            if (!listBySame) {
                this.displayInitialPage();
            }
            console.log("listBy ", this.listBy);
        }

        private renderList() {
            var hotelsList = this.hotelsListElement.selectAll(".hotel")
                .data(this.getList(this.pageCount), function (d) { return d.hotelId; });
            hotelsList.enter().append("div").attr("class", "hotel").html((d) => this.hotelTemplate(d));
            hotelsList.exit().remove();
            hotelsList.order();
        }

        public displayInitialPage(): void {
            this.pagePosition = 1;
            this.buildPagination();
            this.renderList();
        }

        private displayPrevPage(): void {
            --this.pagePosition;
            this.buildPagination();
            this.renderList();
        }

        private displayNextPage(): void {
            ++this.pagePosition;
            this.buildPagination();
            this.renderList();
        }

        private createPaginationElements(): void {
            this.listPage = document.getElementById("listPage");
            this.listPagePrev = document.getElementById("listPagePrev");
            this.listPageNum = document.getElementById("listPageNum");
            this.listPageNext = document.getElementById("listPageNext");
            //console.log(this.listPage);
        }

        private createListeners(): void {
            this.listPagePrev.addEventListener("click", () => this.displayPrevPage(), false);
            this.listPageNext.addEventListener("click", () => this.displayNextPage(), false);
        }

        private getList(count: number) {
            if (!this.listBy || this.listBy === this.listByConds.price) {
                return this.chartsData.priceDim.bottomFrom(count, (this.pagePosition - 1) * this.pageCount);
            } else if (this.listBy === this.listByConds.hotelRating) {
                return this.chartsData.hotelRatingDim.topFrom(count, (this.pagePosition - 1) * this.pageCount);
            } else if (this.listBy === this.listByConds.tripAdvisorRating) {
                return this.chartsData.tripAdvisorRatingDim.topFrom(count, (this.pagePosition - 1) * this.pageCount);
            }
        }

        private buildPagination() {
            console.log("buildPagination ", this.pagePosition);
            var totalrecords = 0;
            var reducedCountGroups = this.chartsData.filteredRecCountGroups.reduceCount();
            var size = reducedCountGroups.size();
            var countGroups = reducedCountGroups.all();
            console.log("CountGroups ", size, reducedCountGroups,countGroups);
            for (var j = 0; j < size; j++) {
                totalrecords += countGroups[j].value;
            }

            /*
            if (totalrecords > 0) {
                var numOfPages = Math.ceil(totalrecords / this.pageCount);
                var paginationContent;
                if (numOfPages > 1) {
                    this.paginationTemplate({ numOfPages: numOfPages, pages: d3.range(2, numOfPages + 1) });
                } else {
                    this.paginationTemplate({ numOfPages: numOfPages, pages: [] });
                }
                console.log(paginationContent);
                this.listPage.html(paginationContent);
            }
            */
            if (totalrecords > 0) {
                this.listPage.style.display = "block";
                if (this.pagePosition === 1) {
                    this.listPagePrev.style.display = "none";
                } else {
                    this.listPagePrev.style.display = "block";
                }
                this.listPageNum.textContent = this.pagePosition.toString();
                var numOfPages = Math.ceil(totalrecords / this.pageCount);
                if (numOfPages > 1 && numOfPages > this.pagePosition) {
                    this.listPageNext.style.display = "block";
                } else {
                    this.listPageNext.style.display = "none";
                }
            } else {
                this.listPage.style.display = "none";
            }
        }

        private createTemplate(): void {
            this.hotelTemplate = doT.template("<div class='hotelTitle'> {{=it.name}}</div>" +
            "<div class='hotelRating'> Rating: {{=it.hotelRating}}</div><div class='hotelTARating'> TA: {{=it.tripAdvisorRating || ''}}</div>" +
                "<div class='hotelPrice'>Price: {{=it.price}}</div>");
            //console.log(this.hotelTemplate);
        }
        /*
        private buildPaginationTemplate() {
            this.paginationTemplate = doT.template("<ul class='pure-paginator'>" +
                "{{? it.numOfPages > 1 }} <li><a class='pure-button prev' href ='#'>&#171;</a></li>{{?}}" +
                "<li><a class='pure-button pure-button-active' href='#'> 1 </a></li>" +
                "{{~it.pages :value:index }}<li><a class='pure-button' href='#'>{{=value}}</a></li>{{~}}" +
                "{{? it.numOfPages > 1 }} <li><a class='pure-button next' href ='#'>&#187;</a></li>{{?}}" +
                "</ul>"
                );
            //console.log(this.paginationTemplate);
        }
        */
    }
}