/// <reference path="../../../src/defi/dot.d.ts" />
/// <reference path="../../../src/defi/d3.d.ts" />
/// <reference path="ChartsData.ts" />

module hotelchart {
    export class UIPaginationController<T, TDimension, TKey, TValue> {

        private static sortAsc: string = "a";
        private static sortDesc: string = "d";


        private listPage;
        private pageNavPrev;
        private pageNavCurr;
        private pageNavNext;

        private listByIconElements: any[] = [];
        private sortByElements: any[] = [];
        private listByElements: string[] = ["p", "s", "t"];
        private pagePosition: number = 1;
        private pageCount: number = 50;
        public listByConds = {
            "price": "p", "priceByOrder": UIPaginationController.sortAsc,
            "hotelRating": "s", "hotelRatingByOrder": UIPaginationController.sortDesc,
            "tripAdvisorRating": "t", "tripAdvisorRatingByOrder": UIPaginationController.sortDesc
        };
        private listBy: string;
        private listByOrder: string;
        private hotelTemplate;
        private paginationTemplate;
        private hotelsListElement;
        private filteredCount: HTMLElement;

        constructor(private chartsData: ChartsData<T, TDimension, TKey, TValue>) {
            this.hotelsListElement = d3.select("#hotels-list");
            this.filteredCount = document.getElementById("filteredCount");
            this.listBy = this.listByConds.price;
            this.listByOrder = this.listByConds.priceByOrder;
            this.createTemplate();
            //this.buildPaginationTemplate();
            this.createPaginationElements();
            this.createListByElements();
            this.createListeners();
        }

        //TODO clear listeners
        public shutdown(): void {

        }

        //TODO sort by href should be disabled based on listBy value
        public setListBy(l: string) {
            //console.log("listBy before ", this.listBy, this.listByOrder);
            var listBySame: boolean = (this.listBy === l);
            if (listBySame) {
                //change display order
                if (this.listByOrder === UIPaginationController.sortAsc) {
                    this.listByOrder = UIPaginationController.sortDesc;
                } else {
                    this.listByOrder = UIPaginationController.sortAsc;
                }
            } else {
                //change display type
                this.listBy = l;
                this.listByOrder = this.getDisplayOrder();
            }
            for (var i = 0; i < this.listByElements.length; i++ ) {
                //console.log("list by elem ", i, this.listByElements[i]);
                if (this.listBy !== this.listByElements[i]) {
                    this.listByIconElements[this.listByElements[i]].className = "";
                    this.sortByElements[this.listByElements[i]].className = "sorting";
                } else {
                    this.sortByElements[this.listByElements[i]].className = "sorting pure-menu-selected";
                    if (this.listByOrder === UIPaginationController.sortAsc) {
                        this.listByIconElements[this.listBy].className = "fa fa-sort-numeric-asc";
                    } else {
                        this.listByIconElements[this.listBy].className = "fa fa-sort-numeric-desc";
                    }
                }
            }
            //console.log("listBy after ", this.listBy, this.listByOrder);
            this.displayInitialPage();
        }

        private getDisplayOrder() {
            if (this.listBy === this.listByConds.price) {
                return this.listByConds.priceByOrder;
            } else if (this.listBy === this.listByConds.hotelRating) {
                return this.listByConds.hotelRatingByOrder;
                //} else if(this.listBy === this.listByConds.tripAdvisorRating) {
            }else{
                return this.listByConds.tripAdvisorRatingByOrder;
            }
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

        public displayPrevPage(): void {
            --this.pagePosition;
            this.buildPagination();
            this.renderList();
        }

        public displayNextPage(): void {
            ++this.pagePosition;
            this.buildPagination();
            this.renderList();
        }

        private createPaginationElements(): void {
            this.listPage = document.getElementsByClassName("listPage");
            this.pageNavPrev = document.getElementsByClassName("pageNavPrev");
            this.pageNavCurr = document.getElementsByClassName("pageNavCurr");
            this.pageNavNext = document.getElementsByClassName("pageNavNext");
            //console.log(this.listPage);
        }

        private createListByElements(): void {
            /*
            this.listByIconElements[this.listByConds.price] = document.getElementById("listBy" + this.listByConds.price);
            this.listByIconElements[this.listByConds.hotelRating] = document.getElementById("listBy" + this.listByConds.hotelRating);
            this.listByIconElements[this.listByConds.tripAdvisorRating] = document.getElementById("listBy" + this.listByConds.tripAdvisorRating);
            */
            for (var i = 0; i < this.listByElements.length; i++) {
                this.listByIconElements[this.listByElements[i]] = document.getElementById("listBy" + this.listByElements[i]);
                this.sortByElements[this.listByElements[i]] = document.getElementById("sortBy" + this.listByElements[i]);
            }
        }

        private createListeners(): void {
        }

        private getList(count: number) {
            if (this.listBy === this.listByConds.price) {
                return this.getSortedList(this.chartsData.priceDim, count);
            } else if (this.listBy === this.listByConds.hotelRating) {
                return this.getSortedList(this.chartsData.hotelRatingDim, count);
            } else if (this.listBy === this.listByConds.tripAdvisorRating) {
                return this.getSortedList(this.chartsData.tripAdvisorRatingDim, count);
            }
        }

        private getSortedList(dimension: any, count: number) {
            //console.log("getSortedList ", this.listByOrder);
            if (this.listByOrder === UIPaginationController.sortAsc) {
                return dimension.bottomFrom(count, (this.pagePosition - 1) * this.pageCount);
            } else {
                return dimension.topFrom(count, (this.pagePosition - 1) * this.pageCount);
            }
        }

        private buildPagination() {
            //console.log("buildPagination ", this.pagePosition);
            var totalrecords = 0;
            var reducedCountGroups = this.chartsData.filteredRecCountGroups.reduceCount();
            var size = reducedCountGroups.size();
            var countGroups = reducedCountGroups.all();
            //console.log("CountGroups ", size, reducedCountGroups,countGroups);
            for (var j = 0; j < size; j++) {
                totalrecords += countGroups[j].value;
            }

            this.filteredCount.textContent = totalrecords.toString();
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
                for (var listPageBlock = 0; listPageBlock < this.listPage.length; listPageBlock++) {
                    this.listPage[listPageBlock].style.display = "block";
                }
                if (this.pagePosition === 1) {
                    for (var pageNavPrevNone = 0; pageNavPrevNone < this.pageNavPrev.length; pageNavPrevNone++) {
                        this.pageNavPrev[pageNavPrevNone].style.display = "none";
                    }
                } else {
                    for (var pageNavPrevBlock = 0; pageNavPrevBlock < this.pageNavPrev.length; pageNavPrevBlock++) {
                        this.pageNavPrev[pageNavPrevBlock].style.display = "block";
                    }
                }
                for (var i = 0; i < this.pageNavCurr.length; i++) {
                    this.pageNavCurr[i].textContent = this.pagePosition.toString();
                }
                var numOfPages = Math.ceil(totalrecords / this.pageCount);
                if (numOfPages > 1 && numOfPages > this.pagePosition) {
                    for (var pageNavNextBlock = 0; pageNavNextBlock < this.pageNavNext.length; pageNavNextBlock++) {
                        this.pageNavNext[pageNavNextBlock].style.display = "block";
                    }
                } else {
                    for (var pageNavNextNone = 0; pageNavNextNone < this.pageNavNext.length; pageNavNextNone++) {
                        this.pageNavNext[pageNavNextNone].style.display = "none";
                    }
                }
            } else {
                for (var listPageNone = 0; listPageNone < this.listPage.length; listPageNone++) {
                    this.listPage[listPageNone].style.display = "none";
                }
            }
        }

        private createTemplate(): void {
            this.hotelTemplate = doT.template(
                "<div class='innerHotel pure-g'>" +
                    "<div class='pure-u-1-5'>{{? it.thumbNailUrl}}<img src='http://images.travelnow.com{{= it.thumbNailUrl}}'/>{{?}}</div>" +
                    "<div class='pure-u-3-5'>" +
                        "<div class='hotelTitle'> <strong> {{=it.name}} </strong> " +
                            "{{? it.hotelRating === 5 }}" +
                                "<i class=\"fa fa-star listStars\"></i><i class=\"fa fa-star listStars\"></i>" +
                                "<i class=\"fa fa-star listStars\"></i><i class=\"fa fa-star listStars\"></i>" +
                                "<i class=\"fa fa-star listStars\"></i>" +
                            "{{?? it.hotelRating === 4}}" +
                                "<i class=\"fa fa-star listStars\"></i><i class=\"fa fa-star listStars\"></i>" +
                                "<i class=\"fa fa-star listStars\"></i><i class=\"fa fa-star listStars\"></i>" +
                            "{{?? it.hotelRating === 3}}" +
                                "<i class=\"fa fa-star listStars\"></i><i class=\"fa fa-star listStars\"></i>" +
                                "<i class=\"fa fa-star listStars\"></i>" +
                            "{{?? it.hotelRating === 2}}" +
                                "<i class=\"fa fa-star listStars\"></i><i class=\"fa fa-star listStars\"></i>" +
                            "{{?? it.hotelRating === 1}}" +
                                "<i class=\"fa fa-star listStars\"></i>" +
                            "{{??}}{{?}}" +
                            "<div class='hotelAddress'>{{=it.address}}, {{=it.city}}</div>" +
                            "{{? it.tripAdvisorRating }}<div class='hotelTARating'> {{=it.tripAdvisorRating}}<span class=\"hotelTARatingText\"> out of </span>5</div>{{?}}" +
                        "</div>" +
                    "</div>" +
                    "<div class='pure-u-1-5' > " +
                        "<div class='hotelPrice'><i class='fa fa-inr curr-inr'></i> {{= Math.round(it.price)}}</div>" +
                    "</div>"+
                "</div>"
                );
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