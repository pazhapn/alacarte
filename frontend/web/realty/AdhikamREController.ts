/// <reference path="definitions/jquery.d.ts"/>
/// <reference path="definitions/google.maps.d.ts"/>
/// <reference path="AdhikamGlobal.ts"/>
/// <reference path="AdhikamModels.ts"/>

module AdhikamMap {

    export class REController {
        private baseMarkers: google.maps.Marker[];
        private pageListeners: google.maps.MapsEventListener[];
        private reListingImages: google.maps.MarkerImage[];

        constructor () {
            this.baseMarkers = new Array();
            this.pageListeners = new Array();
            this.reListingImages = new Array();
            this.buildPropertyImages();
        }

        public clearREListings(): void {
            console.log("propertiesDataController going to clear previous Res ", this.baseMarkers.length);
            //clear markers
            if(this.baseMarkers.length !== 0){
                for (var i = 0; i < this.baseMarkers.length; i++) {
                    this.baseMarkers[i].setMap(<google.maps.Map>null);
                    this.baseMarkers[i] = null;
                }
            }
            this.baseMarkers.length = 0;
            //clear listeners
            if (this.pageListeners.length !== 0) {
                for (var i = 0; i < this.pageListeners.length; i++) {
                    google.maps.event.removeListener(this.pageListeners[i]);
                }
            }
        }
        

        public handleREListings(reListings: REListing[]): void {
            console.log("propertiesDataController going to add reListings ", reListings);
            var reListingSize: number = jQuery.isEmptyObject(reListings) ? 0 : reListings.length;
            console.log("propertiesDataController going to add reListing size ", reListingSize);
            for (var i = 0; i < reListingSize; i++) {
                this.createREListingMarker(<REListing>reListings[i]);
            }
            console.log("finished adding reListingMarkers ", this.baseMarkers.length);  
        }
        
        private createREListingMarker(reListing: REListing): void {
            this.addREListingMarker(reListing);
            //this.addPolyline(reListing);
        }
        
        private getPropertyImage(reListing: REListing): google.maps.MarkerImage {
            if (reListing.propType === "ra") {
                return this.reListingImages["ra"];
            } 
        }
        private buildPropertyImages(): void {
            var image: google.maps.MarkerImage = new google.maps.MarkerImage('assets/img/site/apartment.png');
            this.reListingImages["ra"] = image;
        }

        private addREListingMarker(reListing: REListing): void {
            //create marker and reListing marker
            var marker: google.maps.Marker = new google.maps.Marker({
                position: new google.maps.LatLng(reListing.center.lat, reListing.center.lng), 
                map: AdhikamGlobal.appMap, icon: this.getPropertyImage(reListing),  
                zIndex: 10
            });
            console.log("marker ", marker);
            this.baseMarkers.push(marker);
            //create marker listeners
            this.pageListeners.push( google.maps.event.addListener(marker, 'click', () => { 
                console.log("clicked ind property ", reListing.center);
                //AdhikamGlobal.dataController.
                $("#detailsHolder").children().remove();
                $("#detailsHolder").append(AdhikamGlobal.templates[reListing.propType](reListing));
                $("#detailsDiv").show();
            }));
        }
        /*
        public updateREData(): void {
            console.log("time to do db query ", AdhikamGlobal.appMap.getBounds().getNorthEast().toString(),
                AdhikamGlobal.appMap.getBounds().getSouthWest().toString());
            var reUrl: string = "/assets/maps-json/reProperties_ts.json";
            $.ajax({
                url: reUrl,
                dataType: 'json',
                success: (data) => this.updateMapResultMarkers(<MapResults> data);
            });
        }
        */
    }
}