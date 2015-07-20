/// <reference path="definitions/google.maps.d.ts"/>

module AdhikamMap {

    export class MapResults {
        constructor (public filterContent: string, public reListings: REListing[], 
            public clusters: Cluster[]) { }

        public getListingsSize(): number {
            return jQuery.isEmptyObject(this.reListings) ? 0 : this.reListings.length;
        }

        public getClustersSize(): number {
            return jQuery.isEmptyObject(this.clusters) ? 0 : this.clusters.length;
        }
    }

    export class Cluster {
        constructor (public count: number, public center: LatLng, 
            public boundingBox: BoundingBox, public listingIds: string[]) { }
    }

    export class LatLng {
        constructor (public lat: number, public lng: number) { }
    }

    export class BoundingBox {

        constructor (public topLeftLat: number, public topLeftLng: number, 
            public bottomRightLat: number, public bottomRightLng: number) { 
        }
    }

    export class REListing {   
        constructor(public propType: string, public center: LatLng,
            public propId: string, public builtUpArea: number,
            public bed: number, public bath: number,
            public price: number, public neighbourHood: string, 
            public city: string, public propertyName: string) { }
    }

    export class Place {
        public placeName: string;
        public neighbourHood: string;
        public city: string;
        public lat: number;
        public lng: number;
        public poiType: string;

        constructor (lat: number, lng: number) {
            this.lat = lat;
            this.lng = lng;
        }
    }
    
    export class ClusterMarker extends google.maps.OverlayView {

        private span: HTMLElement;
        private div: HTMLElement;

        constructor (values: any) {
            super();
            // Initialization
            this.setValues(values);
            this.span = document.createElement('span');
            this.div = document.createElement('div');
            // Here go the label styles
            this.span.style.cssText = 'position: relative; left: -50%; top: -10px; ' +
                          'white-space: nowrap;color:#ffffff;' +
                          'padding: 2px;font-family: Arial; font-weight: bold;' +
                          'font-size: 12px;';
            this.div.appendChild(this.span);
            this.div.style.cssText = 'position: absolute; display: none';
        }

        public getMarkerDiv(): HTMLElement {
            return this.div;
        }

        onAdd(): void {
            console.log("cluster marker onadd ");
            var pane: Element = this.getPanes().overlayImage;
            pane.appendChild(this.div);
            //google.maps.event.addListener(this, 'click', () => 
        }

        onRemove(): void {
            console.log("cluster marker onRemove ");
            this.div.parentNode.removeChild(this.div);
        }

        draw(): void {
            var projection: google.maps.MapCanvasProjection = this.getProjection();
            var position: google.maps.Point = projection.fromLatLngToDivPixel(this.get('position'));
            this.div.style.left = position.x + 'px';
            this.div.style.top = position.y + 'px';
            this.div.style.display = 'block';
            this.div.style.zIndex = this.get('zIndex'); //ALLOW LABEL TO OVERLAY MARKER
            this.span.innerHTML = this.get('text').toString();
        }
    }
}
