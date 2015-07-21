/// <reference path="../defi/jquery.d.ts"/>
/// <reference path="FlightController.ts"/>

declare var requestId: string;

module Flights {
    export class DataController {
    
        constructor() {}
		
        public getFlights(formData: string): void {       
            console.log("retrieving requestId "+requestId);     
            var url: string = "/fr.json";
            $.ajax({
                method: "GET",
                url: url,
                dataType: 'json',
                success: (data) => this.updateFlightResults(<FlightResults> data)
            });
        }
        
        private updateFlightResults(flightResults: FlightResults): void {
            /*clear map contents
            this.clearMapContents();
            console.log("propertiesDataController going to add map results ");
            try {          
                //console.log("propertiesDataController going to add map results filterContent ", mapResults.filterContent);
                console.log("propertiesDataController going to add map results filterContent ");
                //create filter contents
                $("#searchDiv").append(mapResults.filterContent);       
                //create cluster markers
                this.clusterController.handleClusters(<Cluster[]> mapResults.clusters);
                //create REListing markers
                this.reController.handleREListings(<REListing[]> mapResults.reListings);
            }catch (e) {
                console.log("error ", e);
            }
            */
        }
	}
}
