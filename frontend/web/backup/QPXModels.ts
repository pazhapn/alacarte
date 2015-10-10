module Flights {	
	/*
	export class QPXResults{
		constructor (
			public trips: TripOptionsResponse
		){}		
	}
	export class TripOptionsResponse{
		constructor (
			//public data: Data,
			public requestId: string,
			public tripOption: Array<TripOption>
		){}	
	}
	export class TripOption{
		constructor (
			public id: string,
			public pricing: Array<PricingInfo>,
			public saleTotal: string,
			public slice: Array<SliceInfo>
		){}	
	}	
	export class PricingInfo{
		constructor (
			public baseFareTotal: string,
			public fare: Array<FareInfo>,
			public fareCalculation: string,
			public latestTicketingTime: string,
			public passengers: PassengerCounts,
			public ptc: string,
			public refundable: boolean,
			public saleFareTotal: string,
			public saleTaxTotal: string,
			public saleTotal: string,
			public segmentPricing: Array<SegmentPricing>,
			public tax: Array<TaxInfo>
		){}		
	}
	export class SegmentPricing{
		constructor (
			public fareId: string,
			public freeBaggageOption: Array<FreeBaggageAllowance>,
			public segmentId: string
		){}		
	}
	export class FreeBaggageAllowance{//missing some fields BagDescriptor
		constructor (
			public kilos: number,
			public kilosPerPiece: number,
			public pieces: number,
			public pounds: number
		){}		
	}
	export class TaxInfo{
		constructor (
			public chargeType: string,
			public code: string,
			public country: string,
			public id: string,
			public salePrice: string
		){}		
	}
	export class SliceInfo{
		constructor (
			public duration: number,
			public segment: Array<SegmentInfo>
		){}		
	}
	export class PassengerCounts{
		constructor (
			public adultCount: number,
			public childCount: number,
			public infantInLapCount: number,
			public infantInSeatCount: number,
			public seniorCount: number
		){}		
	}
	export class FareInfo{
		constructor (
			public basisCode: string,
			public carrier: string,
			public destination: string,
			public id: string,
			public origin: string
		){}		
	}
	export class SegmentInfo{
		constructor (
			public bookingCode: string,
			public bookingCodeCount: number,
			public cabin: string,
			public connectionDuration: number,
			public duration: number,
			public flight: FlightInfo,
			public id: string,
			public leg: Array<LegInfo>
		){}		
	}
	export class FlightInfo{
		constructor (
			public carrier: string,
			public number: string
		){}		
	}
	export class LegInfo{
		constructor (
			public aircraft: string,
			public arrivalTime: string,
			public changePlane: boolean,
			public connectionDuration: number,
			public departureTime: string,
			public destination: string,
			public destinationTerminal: string,
			public duration: number,
			public id: string,
			public meal: string,
			public mileage: number,
			public onTimePerformance: number,
			public operatingDisclosure: string,
			public origin: string,
			public originTerminal: string
		){}		
	}
	*/
	/*
	export class Data{
		constructor (
			public aircraft: Array<AircraftData>,
			public airport: Array<AirportData>,
			public carrier: Array<CarrierData>,
			public city: Array<CityData>,
			public tax: Array<CityData>
		){}	
	}
	export class FlightResults{
		constructor (
			public totalResultsCount: number,
			public complete: boolean,
			public intlFlight: boolean,
			public currencySign: string,
			public minPrice: number,
			public maxPrice: number,
			public paxCount: number,
			public infantCount: number,
			public onwardTakeOffStart: Date,
			public onwardTakeOffEnd: Date,
			public onwardLandingStart: Date,
			public onwardLandingEnd: Date,
			public returnTakeOffStart: Date,
			public returnTakeOffEnd: Date,
			public returnLandingStart: Date,
			public returnLandingEnd: Date,
			public onwardMinDuration: number,
			public onwardMaxDuration: number,
			public returnMinDuration: number,
			public returnMaxDuration: number,
			public totalMinDuration: number,
			public totalMaxDuration: number
		) { }
		
	}
	*/
}