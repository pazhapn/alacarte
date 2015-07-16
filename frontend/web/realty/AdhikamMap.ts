/// <reference path="definitions/jquery.d.ts"/>
/// <reference path="definitions/google.maps.d.ts"/>
/// <reference path="AdhikamGlobal.ts"/>
/// <reference path="AdhikamModels.ts"/>

module AdhikamMap {

    export class MapCenter {
        private mapDragging: bool = false;
        private idleSkipped: bool = false;
        private centerPlace: Place = null;
        private clearReact: number = 0;

        constructor (place: Place) {
            var myOptions: google.maps.MapOptions = {
                center: new google.maps.LatLng(place.lat, place.lng),
                zoom: 12,
                minZoom: 12,
                maxZoom: 19,
                panControl: false,
                zoomControl: true,
                mapTypeControl: true,
                mapTypeControlOptions: {
                    position:google.maps.ControlPosition.TOP_RIGHT
                },
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.DEFAULT,
                    position:google.maps.ControlPosition.RIGHT_TOP
                },
                streetViewControl: false,
                overviewMapControl: false,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            AdhikamGlobal.appMap = new google.maps.Map($("#map_canvas")[0], myOptions);
            this.addMapListeners();
            console.log("initMap done, ");
        }
        
        private addMapListeners(): void {
            google.maps.event.addListener(AdhikamGlobal.appMap, 'dragstart', () => this.mapDragging = true); 
            google.maps.event.addListener(AdhikamGlobal.appMap, 'idle', () => {
                if (this.mapDragging) {
                    return;
                }
                console.log("idle event activated ", AdhikamGlobal.appMap.getZoom());
                this.reactToMapChange();
            });
            google.maps.event.addListener(AdhikamGlobal.appMap, 'dragend', () => {
                this.mapDragging = false;
                console.log("dragend event activated");
                this.reactToMapChange();
            });
        }
        private reactToMapChange(): void {
            console.log("reactToMapChange");
            $("#searchDiv").hide();
            $("#detailsDiv").hide();
            clearTimeout(this.clearReact);
            this.clearReact = setTimeout(() => this.delayedReact(), 1000);
        }
        private delayedReact(): void {
            console.log("delayedReact");
            AdhikamGlobal.dataController.updateMapData();
        }
        public setCenterPlace(centerPlace: Place): void {
            this.centerPlace = centerPlace;
        }

        private resetCenterPlace(): void {
            this.centerPlace = null;
        }
        /*
        private addMapListeners(): void {
            google.maps.event.addListener(AdhikamGlobal.appMap, 'dragstart', () => this.mapDragging = true;); 
            google.maps.event.addListener(AdhikamGlobal.appMap, 'bounds_changed', () => this.idleSkipped = false;);
            google.maps.event.addListener(AdhikamGlobal.appMap, 'idle', () => {
                if (this.mapDragging) {
                    this.idleSkipped = true;
                    return;
                }
                this.idleSkipped = false;
                console.log("idle event activated ", AdhikamGlobal.appMap.getZoom());
                this.reactToMapChange();
            });
            google.maps.event.addListener(AdhikamGlobal.appMap, 'dragend', function() {
                this.mapDragging = false;
                if (this.idleSkipped == true) {
                    console.log("dragend event activated");
                    this.reactToMapChange();
                    this.idleSkipped = false;
                }
            });
        }
        private reactToMapChange(): void {
            AdhikamGlobal.dataController.updateREData();
            if(this.centerPlace != null){
                AdhikamGlobal.dataController.updatePOIData(this.centerPlace);
                this.resetCenterPlace();
            }
        }
        */
    }
}