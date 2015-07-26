/// <reference path="ChartsData.ts" />

module chart {
    export class UIDisplayController {

        private filtMinPrices: HTMLElement[] = [];
        private filtMinTAs: HTMLElement[] = [];
        private filtMaxPrices: HTMLElement[] = [];
        private filtMaxTAs: HTMLElement[] = [];

        constructor(private chartsData: ChartsData) {
            this.collectMinMaxFiltElements();
        }

        public updateFilteredSum(): number {
            var size = this.chartsData.minMaxStarGroups.size();
            var filteredSum = this.chartsData.filteredSumGroups.reduceSum((d) => d.count).all();
            var sum = 0;
            for (var i = 0; i < size; i++) {
                sum += filteredSum[i].value;
            }
            return sum;
        }
        public updateFiltMinMaxSummary(): void {
            var mm = this.chartsData.minMaxStarGroups.all();
            //console.log(mm);
            var minMaxPriceTA;
            for (var i = 0; i < 5; i++) {
                //if (mm[i] !== undefined) {
                minMaxPriceTA = this.getMinMaxPriceTA(mm, i);
                this.filtMinPrices[i].textContent = minMaxPriceTA.minPrice;
                this.filtMinTAs[i].textContent = minMaxPriceTA.minTA;
                this.filtMaxPrices[i].textContent = minMaxPriceTA.maxPrice;
                this.filtMaxTAs[i].textContent = minMaxPriceTA.maxTA;
                //}
            }
        }

        private getMinMaxPriceTA(mm, i) {
            //console.log(i);
            //console.log(mm[i]);
            var len = mm[i].value.minMaxArray.length;
            var minMaxPriceTA = { minPrice: "", minTA: "", maxPrice: "", maxTA: "" };
            if (len > 0) {
                minMaxPriceTA.minPrice = mm[i].value.minMaxArray[0].price;
                minMaxPriceTA.minTA = mm[i].value.minMaxArray[0].tripAdvisorRating;
                if (len > 1) {
                    minMaxPriceTA.maxPrice = mm[i].value.minMaxArray[len - 1].price;
                    minMaxPriceTA.maxTA = mm[i].value.minMaxArray[len - 1].tripAdvisorRating;
                } else {
                    minMaxPriceTA.maxPrice = mm[i].value.minMaxArray[0].price;
                    minMaxPriceTA.maxTA = mm[i].value.minMaxArray[0].tripAdvisorRating;
                }
            }
            return minMaxPriceTA;
        }

        public collectMinMaxStarByReduce() {
            var reduceAdd = function (p, v) {
                //console.log(p, v);
                if (p.min() === 0) {
                    //p.minMaxArray.unshift({ price: v.price, tripAdvisorRating: v.tripAdvisorRating });

                    p.minMaxArray.push({ price: v.price, tripAdvisorRating: v.tripAdvisorRating });
                    return p;
                } else {
                    if (v.price <= p.min()) { p.minMaxArray.unshift({ price: v.price, tripAdvisorRating: v.tripAdvisorRating }); }
                    if (v.price >= p.max()) { p.minMaxArray.push({ price: v.price, tripAdvisorRating: v.tripAdvisorRating }); }
                    return p;
                }
            };

            var reduceRemove = function (p, v) {
                var index = -1;
                for (var i = 0, len = p.minMaxArray.length; i < len; i++) {
                    if (p.minMaxArray[i].price === v.price) {
                        index = i;
                        break;
                    }
                }
                if (index >= 0) { p.minMaxArray.splice(index, 1); }
                return p;
            };

            var reduceInitial = function () {
                return {
                    minMaxArray: [],
                    max: function () {
                        return (this.minMaxArray.length > 0) ? this.minMaxArray[this.minMaxArray.length - 1].price : 0;
                    },
                    min: function () {
                        return (this.minMaxArray.length > 0) ? this.minMaxArray[0].price : 0;
                    },
                    maxTA: function () {
                        return (this.minMaxArray.length > 0) ? this.minMaxArray[this.minMaxArray.length - 1].tripAdvisorRating : "";
                    },
                    minTA: function () {
                        return (this.minMaxArray.length > 0) ? this.minMaxArray[0].tripAdvisorRating : "";
                    }
                };
            };
            this.chartsData.minMaxStarGroups = this.chartsData.minMaxStarDim.group((d) => {
                return d;
            }).reduce(reduceAdd, reduceRemove, reduceInitial);
        }
        private collectMinMaxFiltElements(): void {
            for (var i = 0; i < 5; i++) {
                this.filtMinPrices[i] = document.getElementById("starFiltMinPrice" + (i + 1));
                this.filtMinTAs[i] = document.getElementById("starFiltMinTA" + (i + 1));
                this.filtMaxPrices[i] = document.getElementById("starFiltMaxPrice" + (i + 1));
                this.filtMaxTAs[i] = document.getElementById("starFiltMaxTA" + (i + 1));
            }
            //console.log(this.filtMinPrices[i]);
        }
    }
}