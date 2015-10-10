/// <reference path="../../defi/crossfilter.d.ts"/>
/// <reference path="../../defi/d3.d.ts"/>
/// <reference path="../models/FlightModels.ts"/>

module Flights {  
    export class LegLine{
        public flightPosition: number;
        public groundTime: String;
    }
    export class ItineraryChart{
        
		private filter: CrossFilter.CrossFilter<TripDetail>;
        private all: CrossFilter.GroupAll<TripDetail>;
        private priceDim: CrossFilter.Dimension<TripDetail, number>;
        private sliceCharts: SliceChart[];
        
        constructor(public trips: Array<TripDetail>){
            this.filter = crossfilter<TripDetail>(trips);
            this.all = this.filter.groupAll();
            this.priceDim = this.filter.dimension((trip) => trip.saleTotal);
            this.sliceCharts = new Array<SliceChart>(trips[0].slices.length);
            for(var i=0; i < trips[0].slices.length; i++){
                this.sliceCharts[i] = new SliceChart(i, this.filter);
            }
        }
        public resize(dim: number, slicePos: number, extent): any[]{
            console.log("resize ",dim, slicePos, extent);
            if(dim == dimType.departTimeDim){
                this.sliceCharts[slicePos].departDim.filterRange(extent);
            }else if(dim == dimType.arrivalTimeDim){
                this.sliceCharts[slicePos].arrivalDim.filterRange(extent);
            }else if(dim == dimType.durationDim){
                this.sliceCharts[slicePos].durationDim.filterRange(extent);
            }else if(dim == dimType.priceDim){
                this.priceDim.filterRange(extent);
            }
            return this.renderList();
        }
		
        public renderList(): any[] {
            console.log("renderList ",currentValues.listBy, currentValues.orderBy, currentValues.listSize, currentValues.slicePos);
            //console.log("renderList ",this.getList(currentValues.listBy, currentValues.orderBy, currentValues.listSize, currentValues.slicePos));
            var data = this.getList(currentValues.listBy, currentValues.orderBy, currentValues.listSize, currentValues.slicePos);
            var flightsList = listElement.selectAll(".flight")
                .data(data, function (d) { return d.tripId; });
            flightsList.enter().append("div").attr("class", "flight").html((d) => d.html);
            flightsList.exit().remove();
            flightsList.order();
            return data;
        }
        
        private getList(listBy:number, orderBy:number, listSize: number, slicePos: number) {
            if (listBy == listByConds.price) {
                return this.getSortedList(this.priceDim, orderBy, listSize);
            } else if (listBy == listByConds.duration) {
                return this.getSortedList(this.sliceCharts[slicePos].durationDim, orderBy, listSize);
            } 
        }

        private getSortedList(dimension: any, orderBy:number, listSize: number) {
            //console.log("getSortedList ", this.listByOrder);
            if (orderBy == orderByConds.asc) {
                return dimension.bottom(listSize);
            } else {
                return dimension.top(listSize);
            }
        }
    }
    export class SliceChart {
        public durationDim: CrossFilter.Dimension<TripDetail, number>;
        public departDim: CrossFilter.Dimension<TripDetail, Date>;
        public arrivalDim: CrossFilter.Dimension<TripDetail, Date>;
        public stopsDim: CrossFilter.Dimension<TripDetail, number>;
        public stopsGroup: CrossFilter.Group<TripDetail, number, number>;
        
        constructor(private slicePosition: number, private filter: CrossFilter.CrossFilter<TripDetail>) { 
            this.initializeDimensions();
            this.initializeGroups();    
        }
        public initializeDimensions(): void {
            this.durationDim = this.filter.dimension((itinerary) => itinerary.slices[this.slicePosition].duration); //done
            this.departDim = this.filter.dimension((itinerary) => parseDate(itinerary.slices[this.slicePosition].departureTime));
            this.arrivalDim = this.filter.dimension((itinerary) => parseDate(itinerary.slices[this.slicePosition].arrivalTime));
            this.stopsDim = this.filter.dimension((itinerary) => itinerary.slices[this.slicePosition].segments.length); //done
        }

        public initializeGroups(): void {
            this.stopsGroup = this.stopsDim.group((stops:number) => stops);
        }
	}
}