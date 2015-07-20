/// <reference path="definitions/jquery.d.ts"/>
/// <reference path="definitions/google.maps.d.ts"/>
/// <reference path="AdhikamGlobal.ts"/>
/// <reference path="AdhikamModels.ts"/>

module AdhikamMap {

    export class POIController {
        private poiMarkers: google.maps.Marker[] = new Array();
                
        public updatePOIData(place: Place): void {
            console.log("entering getPOIData ", place);
            var poiUrl: string = "/assets/maps-json/places_ts.json";
            $.ajax({
                url: poiUrl,
                dataType: 'json',
                success: (data) => this.updatePOIMarkers(<Place[]> data)
            });
        }
        
        private updatePOIMarkers(places: Place[]): void {
            this.clearPOIMarkers();
            console.log("poiDataController going to add new markers ", places.length);
            if(places.length !== 0){
                for (var i = 0; i < places.length; i++) {
                    this.poiMarkers.push(this.createPOIMarker(places[i]));
                }
            }
            console.log("finished adding markers ", this.poiMarkers.length);
        }

        private createPOIMarker(place: Place): google.maps.Marker {
            return new google.maps.Marker({position: new google.maps.LatLng(place.lat, place.lng), map: AdhikamGlobal.appMap});
        }

        private clearPOIMarkers(): void {
            console.log("poiDataController going to clear previous markers ", this.poiMarkers.length);
            if(this.poiMarkers.length !== 0){
                for (var i = 0; i < this.poiMarkers.length; i++) {
                    this.poiMarkers[i].setMap(<google.maps.Map>null);
                    this.poiMarkers[i] = null;
                }
                this.poiMarkers.length = 0;
            }
        }
    }
}