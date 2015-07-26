/// <reference path="../../../../online/js/site/slicer-all.d.ts" />

module chart {
    export class ChartsData {

        public slicer: slicer.Slicer;
        private all: slicer.GroupAll;
        public priceDim: slicer.Dimension;
        public hotelRatingDim: slicer.Dimension;
        public tripAdvisorRatingDim: slicer.Dimension;
        public minMaxStarDim: slicer.Dimension;


        public priceGroups: slicer.Group;
        public ratingGroups: slicer.Group;
        public tripAdvisorGroups: slicer.Group;
        public filteredSumGroups: slicer.Group;
        public minMaxStarGroups: slicer.Group;
        public filteredRecCountGroups: slicer.Group;

        public priceGroupFactor: number = 25;
        public hotelRatingGroupFactor: number = 1;
        public tripAdvisorGroupFactor: number = 0.5;

        constructor() {
            this.slicer = new slicer.Slicer();
        }

        public initializeDimensions(): void {
            this.all = this.slicer.groupAll();
            this.priceDim = this.slicer.dimension((d) => d.price);
            this.hotelRatingDim = this.slicer.dimension((d) => d.hotelRating);
            this.tripAdvisorRatingDim = this.slicer.dimension((d) => d.tripAdvisorRating);
            this.minMaxStarDim = this.slicer.dimension((d) => d.minMax);
        }

        public initializeGroups(): void {
            var minGroupValue = d3.min(this.slicer.getData(), this.priceDim.value);
            var maxGroupValue = d3.max(this.slicer.getData(), this.priceDim.value);
            this.priceGroupFactor = Math.ceil((maxGroupValue - minGroupValue) / 10);

            this.priceGroups = this.priceDim.group((d) => {
                if (d < this.priceGroupFactor) { return 0; }
                var m = Math.floor(((d / this.priceGroupFactor) / 100) * 100);
                return (d % this.priceGroupFactor > 0) ? m : (m - 1);
                //return m;
            });
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
                return d;
            });
            this.tripAdvisorGroups = this.tripAdvisorRatingDim.group((d) => {
                if (!d || d < this.tripAdvisorGroupFactor) { return 1; }
                var m = Math.floor(((d / this.tripAdvisorGroupFactor) / 100) * 100);
                //console.log("rating ", d, d % this.tripAdvisorGroupFactor, (d % this.tripAdvisorGroupFactor > 0) ? m : (m - 1));
                return (d % this.tripAdvisorGroupFactor > 0) ? m : (m - 1);
                //return m;
            });
            this.filteredSumGroups = this.minMaxStarDim.group((d) => {
                return d;
            });
            this.filteredRecCountGroups = this.minMaxStarDim.group((d) => {
                return d;
            });
        }
    }
}