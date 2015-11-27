/// <reference path="../../defi/crossfilter.d.ts"/>
/// <reference path="../../defi/d3.d.ts"/>
/// <reference path="CommonData.ts"/>
/// <reference path="../models/FlightModels.ts"/>

module Flights {  
    export class ItineraryData{
        
		private filter: CrossFilter.CrossFilter<TripDetail>;
        private all: CrossFilter.GroupAll<TripDetail>;
        private priceDim: CrossFilter.Dimension<TripDetail, number>;
        private sliceCharts: SliceData[];
        
        constructor(public trips: Array<TripDetail>){
            this.filter = crossfilter<TripDetail>(trips);
            this.all = this.filter.groupAll();
            this.priceDim = this.filter.dimension((trip) => trip.saleTotal);
            this.sliceCharts = new Array<SliceData>(trips[0].slices.length);
            for(var i=0; i < trips[0].slices.length; i++){
                this.sliceCharts[i] = new SliceData(i, this.filter);
            }
        }
        public resize(dim: number, slicePos: number, extent): Array<TripDetail>{
            //console.log("resize ",dim, slicePos, extent);
            if(extent != null){
                if(dim == dimType.departTimeDim){
                    this.sliceCharts[slicePos].departDim.filterRange(extent);
                }else if(dim == dimType.arrivalTimeDim){
                    this.sliceCharts[slicePos].arrivalDim.filterRange(extent);
                }else if(dim == dimType.durationDim){
                    this.sliceCharts[slicePos].durationDim.filterRange(extent);
                }else if(dim == dimType.priceDim){
                    this.priceDim.filterRange(extent);
                }
            }
            return this.renderList();
        }
		
        private renderList(): Array<TripDetail> {
            //console.log("renderList ",currentValues.listBy, currentValues.orderBy, currentValues.listSize, currentValues.slicePos);
            //console.log("renderList ",this.getList(currentValues.listBy, currentValues.orderBy, currentValues.listSize, currentValues.slicePos));
            return this.getList(currentValues.listBy, currentValues.orderBy, currentValues.listSize, currentValues.slicePos);
        }
        
        private getList(listBy:number, orderBy:number, listSize: number, slicePos: number): Array<TripDetail> {
            if (listBy == listByConds.price) {
                return this.getSortedList(this.priceDim, orderBy, listSize);
            } else if (listBy == listByConds.duration) {
                return this.getSortedList(this.sliceCharts[slicePos].durationDim, orderBy, listSize);
            } 
        }

        private getSortedList(dimension: any, orderBy:number, listSize: number): Array<TripDetail>{
            //console.log("getSortedList ", this.listByOrder);
            if (orderBy == orderByConds.asc) {
                return dimension.bottom(listSize);
            } else {
                return dimension.top(listSize);
            }
        }
    }
    export class SliceData {
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