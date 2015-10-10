/// <reference path="../../defi/crossfilter.d.ts"/>
/// <reference path="../../defi/d3.d.ts"/>
/// <reference path="../models/FlightModels.ts"/>

module Flights {   
    /*
    export class ItineraryChart{
		private filter: CrossFilter.CrossFilter<TripDetail>;
        private all: CrossFilter.GroupAll<TripDetail>;
        private priceDim: CrossFilter.Dimension<TripDetail, number>;
        private sliceCharts: SliceChart[];
        
        public listByConds = {price: 1, duration: 2}
        public orderByConds = {asc: 1, desc: 2}
        
        constructor(public trips: Array<TripDetail>){
            this.filter = crossfilter<TripDetail>(trips);
            this.all = this.filter.groupAll();
            this.priceDim = this.filter.dimension((trip) => trip.saleTotal);
            this.sliceCharts = new Array<SliceChart>(trips[0].slices.length);
            for(var i=0; i < trips[0].slices.length; i++){
                this.sliceCharts[i] = new SliceChart(i, this.filter);
            }
        }

        
		public renderList(listBy:number, orderBy:number, listSize: number, slicePos: number) {
            var flightsList = listElement.selectAll(".flight")
                .data(this.getList(listBy, orderBy, listSize, slicePos), function (d) { return d.tripId; });
            flightsList.enter().append("div").attr("class", "flight").html((d) => d.html);
            flightsList.exit().remove();
            flightsList.order();
        }
        
        private getList(listBy:number, orderBy:number, listSize: number, slicePos: number) {
            if (listBy == this.listByConds.price) {
                return this.getSortedList(this.priceDim, orderBy, listSize);
            } else if (listBy == this.listByConds.duration) {
                return this.getSortedList(this.sliceCharts[slicePos].durationDim, orderBy, listSize);
            } 
        }

        private getSortedList(dimension: any, orderBy:number, listSize: number) {
            //console.log("getSortedList ", this.listByOrder);
            if (orderBy == this.orderByConds.asc) {
                return dimension.bottom(listSize);
            } else {
                return dimension.top(listSize);
            }
        }
    }
    export class SliceChart {
        public durationDim: CrossFilter.Dimension<TripDetail, number>;
        public originDepartTimeDim: CrossFilter.Dimension<TripDetail, Date>;
        public destArrivalTimeDim: CrossFilter.Dimension<TripDetail, Date>;
        public stopsDim: CrossFilter.Dimension<TripDetail, number>;
        public stopsGroup: CrossFilter.Group<TripDetail, number, number>;
        
        constructor(private slicePosition: number, private filter: CrossFilter.CrossFilter<TripDetail>) { 
            this.initializeDimensions();
            this.initializeGroups();    
        }
        public initializeDimensions(): void {
            this.durationDim = this.filter.dimension((itinerary) => itinerary.slices[this.slicePosition].duration); //done
            this.originDepartTimeDim = this.filter.dimension((itinerary) => itinerary.slices[this.slicePosition].departureTime);
            this.destArrivalTimeDim = this.filter.dimension((itinerary) => itinerary.slices[this.slicePosition].arrivalTimeInDest);
            this.stopsDim = this.filter.dimension((itinerary) => itinerary.slices[this.slicePosition].segments.length); //done
        }

        public initializeGroups(): void {
            this.stopsGroup = this.stopsDim.group((stops:number) => stops);
        }
	}
    */
}