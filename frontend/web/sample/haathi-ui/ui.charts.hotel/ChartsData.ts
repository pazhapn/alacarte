/// <reference path="../../../src/defi/crossfilter.d.ts" />

module hotelchart {
    export class ChartsData<T, TDimension, TKey, TValue> {

        public slicer: CrossFilter.CrossFilter<T>;
        private all: CrossFilter.GroupAll<T>;
        public priceDim: CrossFilter.Dimension<T, TDimension>;
        public hotelRatingDim: CrossFilter.Dimension<T, TDimension>;
        public tripAdvisorRatingDim: CrossFilter.Dimension<T, TDimension>;
        public minMaxStarDim: CrossFilter.Dimension<T, TDimension>;

        public priceDimFunc: any;
        public hotelRatingDimFunc: any;
        public tripAdvisorRatingDimFunc: any;
        public minMaxStarDimFunc: any;

        public priceGroups: CrossFilter.Group<T, TKey, TValue>;
        public ratingGroups: CrossFilter.Group<T, TKey, TValue>;
        public tripAdvisorGroups: CrossFilter.Group<T, TKey, TValue>;
        public filteredSumGroups: CrossFilter.Group<T, TKey, TValue>;
        public minMaxStarGroups: CrossFilter.Group<T, TKey, TValue>;
        public filteredRecCountGroups: CrossFilter.Group<T, TKey, TValue>;

        public priceGroupsFunc: any;
        public tripAdvisorGroupsFunc: any;
                
        public priceGroupFactor: number = 25;
        public hotelRatingGroupFactor: number = 1;
        public tripAdvisorGroupFactor: number = 0.5;

        constructor() {
        }

        public initializeDimensions(): void {
            this.all = this.slicer.groupAll();
            this.priceDim = this.slicer.dimension((this.priceDimFunc = (d: any) => d.price));
            this.hotelRatingDim = this.slicer.dimension((this.hotelRatingDimFunc = (d: any) => d.hotelRating));
            this.tripAdvisorRatingDim = this.slicer.dimension((this.tripAdvisorRatingDimFunc = (d: any) => d.tripAdvisorRating));
            //this.minMaxStarDim = this.slicer.dimension((this.minMaxStarDimFunc = (d: any) => d.minMax));
            this.minMaxStarDim = this.slicer.dimension(this.hotelRatingDimFunc);
        }

        public initializeGroups(): void {
            var minGroupValue = d3.min(this.slicer.getData(), this.priceDimFunc);
            var maxGroupValue = d3.max(this.slicer.getData(), this.priceDimFunc);
            this.priceGroupFactor = Math.ceil((maxGroupValue - minGroupValue) / 12);

            this.priceGroups = this.priceDim.group((this.priceGroupsFunc = (d: any) => {
                if (d < this.priceGroupFactor) { return 0; }
                var m = Math.floor(((d / this.priceGroupFactor) / 100) * 100);
                return (d % this.priceGroupFactor > 0) ? m : (m - 1);
                //return m;
            }));
            /*
            this.ratingGroups = this.hotelRatingDim.group((d) => {
                if (d < this.hotelRatingGroupFactor) { return 0; }
                var m = Math.floor(((d / this.hotelRatingGroupFactor) / 100) * 100);
                //console.log("rating ", d, d % this.hotelRatingGroupFactor, m);
                return (d % this.hotelRatingGroupFactor > 0) ? m : (m - 1);
                //return m;
            });
            */

            this.ratingGroups = this.hotelRatingDim.group((d) => {
                //console.log("ratinggroups :", d);
                return d;
            });
            this.tripAdvisorGroups = this.tripAdvisorRatingDim.group((this.tripAdvisorGroupsFunc = (d: any) => {
                if (!d || d < this.tripAdvisorGroupFactor) { return 1; }
                var m = Math.floor(((d / this.tripAdvisorGroupFactor) / 100) * 100);
                //console.log("rating ", d, d % this.tripAdvisorGroupFactor, (d % this.tripAdvisorGroupFactor > 0) ? m : (m - 1));
                return (d % this.tripAdvisorGroupFactor > 0) ? m : (m - 1);
                //return m;
            }));
            this.filteredSumGroups = this.minMaxStarDim.group((d) => {
                return d;
            });
            this.filteredRecCountGroups = this.minMaxStarDim.group((d) => {
                return d;
            });
        }
    }
}