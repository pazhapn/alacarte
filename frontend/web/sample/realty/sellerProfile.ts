/// <reference path="definitions/jquery.d.ts"/>

module Dataentry {
    export class SellerProfile {
        static BUILDER: String = "b";
        static DEALER: String = "d";
        static OWNER: String = "o";

        private sellerType: String;
        private companyName: String;

        constructor() {}

        public addDisplayEvents() {
            $(this.sellerType).change(() => this.displayCarpetArea());
        }

        private displayCarpetArea() {
            if ($(this.sellerType).val().equals(SellerProfile.OWNER) ) {
                $(this.companyName).hide;
            } else {
                $(this.companyName).show;
            }
        }

    }
}


window.onload = () => {
    var sellerProfile = new Dataentry.SellerProfile();
    sellerProfile.addDisplayEvents();

};