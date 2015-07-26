/// <reference path="ChartsData.ts" />

module hotelchart {
    export class UIDisplayController<T, TDimension, TKey, TValue> {

        private filtMinPrices: HTMLElement[] = [];
        private filtMinTAs: HTMLElement[] = [];
        private filtMaxPrices: HTMLElement[] = [];
        private filtMaxTAs: HTMLElement[] = [];

        constructor(private chartsData: ChartsData<T, TDimension, TKey, TValue>) {
            this.collectMinMaxFiltElements();
        }

        public updateFilteredSum(): void {
            var size = this.chartsData.minMaxStarGroups.size();
            var filteredSum = this.chartsData.filteredSumGroups.reduceSum((d: any) => d.count).all();
            var sum = 0;
            for (var i = 0; i < size; i++) {
                sum += filteredSum[i].value;
            }
        }
        public updateFiltMinMaxSummary(): void {
            var mm = this.chartsData.minMaxStarGroups.all();
            var size = mm.length;
            //console.log(mm);
            var minMaxPriceTA;
            var fieldToChange;
            for (var i = 0; i < size; i++) {
                fieldToChange = mm[i].key;
                //fieldToChange -= 1;
                //console.log("updateFiltMinMaxSummary fieldToChange ", fieldToChange);
                minMaxPriceTA = this.getMinMaxPriceTA(mm, i);
                if (minMaxPriceTA.minPrice) {
                    this.filtMinPrices[fieldToChange].innerHTML = "<i class=\"fa fa-inr curr-inr\"></i> " + Math.round(minMaxPriceTA.minPrice) + " - ";
                } else {
                    this.filtMinPrices[fieldToChange].innerHTML = "";
                }
                if (minMaxPriceTA.maxPrice) {
                    this.filtMaxPrices[fieldToChange].innerHTML = "<i class=\"fa fa-inr curr-inr\"></i> " + Math.round(minMaxPriceTA.maxPrice);
                } else {
                    this.filtMaxPrices[fieldToChange].innerHTML = "";
                }
            }
        }

        private getMinMaxPriceTA(mm, i) {
            //console.log("getMinMaxPriceTA i ",i);
            //console.log("getMinMaxPriceTA mm[i] ",mm[i]);
            var len = mm[i].value.minMaxArray.length;
            var minMaxPriceTA = { minPrice: "", minTA: "", maxPrice: "", maxTA: "", size: 0 };
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
                    },
                    size: function () {
                        return this.minMaxArray.length;
                    }
                };
            };
            this.chartsData.minMaxStarGroups = this.chartsData.minMaxStarDim.group((d) => {
                return d;
            }).reduce(reduceAdd, reduceRemove, reduceInitial);
        }
        private collectMinMaxFiltElements(): void {
            for (var i = 0; i < 6; i++) {
                this.filtMinPrices[i] = document.getElementById("starFiltMinPrice" + i);
                this.filtMinTAs[i] = document.getElementById("starFiltMinTA" + i);
                this.filtMaxPrices[i] = document.getElementById("starFiltMaxPrice" + i);
                this.filtMaxTAs[i] = document.getElementById("starFiltMaxTA" + i);
            }
            //console.log(this.filtMinPrices[i]);
        }
    }
}