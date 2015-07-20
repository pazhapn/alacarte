/// <reference path="definitions/jquery.d.ts"/>

module AdPost {
    class AdPageElements {
        public static formElem: String = "#postAd";
        public static ownerTypeElem: String = "#ownerType";
        public static corpClass: String = ".corp";
        public static corpSiteElem: String = "";
    }
    class Ad {
        public static OT_BUILDER: String = "b";
        public static OT_DEALER: String = "d";
        public static OT_OWNER: String = "o";

        public ownerType: String;
        
        constructor () { }
    }
    export class AdController {
        private ad: Ad;

        constructor() {
            this.ad = new Ad();
        }

        public initialize() {
            console.log('initializing the app');
            this.addDisplayEvents();
            this.controlCorporateElems();
        }

        private addDisplayEvents() {
            $(AdPageElements.ownerTypeElem).change(() => this.controlCorporateElems());
        }
        
        private controlCorporateElems() {
            var showElems: bool = ($(AdPageElements.ownerTypeElem).val() == Ad.OT_OWNER) ? false : true;
            $(AdPageElements.corpClass).toggle(showElems);
        }

        public toString() {
            $(AdPageElements.formElem).children().map(elem => console.log(elem));
        }
    }
}

window.onload = () => {
    console.log('creating the app');
    var adController = new AdPost.AdController();
    adController.initialize();
};