/// <reference path="definitions/jquery.d.ts"/>
/// <reference path="definitions/google.maps.d.ts"/>
/// <reference path="definitions/json.d.ts"/>
/// <reference path="AdhikamGlobal.ts"/>
/// <reference path="AdhikamModels.ts"/>
/// <reference path="AdhikamREController.ts"/>
/// <reference path="AdhikamClusterController.ts"/>
/// <reference path="AdhikamPOIController.ts"/>

module AdhikamMap {    
    
    export class DataController {

        private reController: REController;
        private clusterController: ClusterController;
        private prevMapReq: JQueryXHR = null;

        constructor () {
            this.reController = new REController();
            this.clusterController = new ClusterController();
        }

        public searchProperties(formData: string): void {            
            var url: string = "/assets/maps-json/mapresults.json";
            $.ajax({
                type: "POST",
                url: url,
                data: formData,
                dataType: 'json',
                success: (data) => this.updateMapResults(<MapResults> data)
            });
        }

        /*
        public updateMapData(): void {  
            var url: string = "/assets/maps-json/mapresults.json";
            $.getJSON(url, (data) => {
                    console.log("data ", data);
                    this.updateMapResultMarkers(<MapResults> data);
                }
            );
        }
        */

        public updateMapData(): void {
            this.cancelPendingRequest();
            this.addMapRequestParams();
            this.submitMapRequest();
        }

        private updateMapResults(mapResults: MapResults): void {
            //clear map contents
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
        }

        private submitMapRequest(): void {
            var map = new Object();  
            $("#invSearchForm").children().each(function() {
                map[this.name] = this.value;
            });
            console.log("changeFacetForm map " + JSON.stringify(map));
            var url: string = "/map-search";
            this.prevMapReq = $.ajax({
                url: url,
                data: JSON.stringify(map),
                contentType: 'text/plain',
                type: 'POST',
                dataType: 'html',
                success: (data) => {
                    //console.log("data ", JSON.parse(data));
                    this.updateMapResults(<MapResults> JSON.parse(data));
                }
            });    
        }

        private addMapRequestParams(): void {
            var mapCenter: google.maps.LatLng = AdhikamGlobal.appMap.getCenter();
            var mapBound: google.maps.LatLngBounds = AdhikamGlobal.appMap.getBounds();
            var center: string = mapCenter.lat() + "!" + mapCenter.lng();
            var zoom: number = AdhikamGlobal.appMap.getZoom();
            var bound = mapBound.getSouthWest().lat() + "!" + mapBound.getSouthWest().lng()+
                "!" + mapBound.getNorthEast().lat() + "!" + mapBound.getNorthEast().lng();
            $("#invSearchForm > #zoom").val(zoom);
            $("#invSearchForm > #center").val(center);
            $("#invSearchForm > #bound").val(bound);
        }

        private cancelPendingRequest(): void {      
            if(this.prevMapReq && this.prevMapReq.readyState != 4){
                this.prevMapReq.abort();
            }    
        }

        //clear markers and listeners attached to the viewport
        private clearMapContents(): void {
            //clear clusters
            this.clusterController.clearClusters();
            //clear REListings
            this.reController.clearREListings();
            // clear filter content
            $("#searchDiv").children().remove();
        }
    }
}