/// <reference path="definitions/jquery.d.ts"/>
/// <reference path="definitions/jquery.validation-1.10.d.ts"/>

module PostProperty {
    export class ResidentialController {
        constructor() {}

        public initialize() {
            console.log('initializing the app');
            this.trackEvents();
            //this.controlCorporateElems();
            //this.handlePropertyType();
            //this.handleAgeOfProperty();
        }

        private trackEvents() {
            $("input[name=ownerType]:radio").change(() => this.controlCorporateElems());
            $("input[name=sellOrRent]:radio,#propertyType").change(() => this.handlePropertyType());
            $("#ageOfProperty").change(() => this.handleAgeOfProperty());
        }
        
        private handleAgeOfProperty() {
            console.log("handle ageOfProperty "+$("#ageOfProperty").val());
            if ($("#ageOfProperty").val() === "90") {
                $(".moveIn").show();
            } else {
                $(".moveIn").hide();
            }
        }

        private handlePropertyType() {
            console.log("handle property fields "+$("#propertyType").val());
            var propertyType: String = $("#propertyType").val();
            if (propertyType === "rs" && !$("#bedrooms").attr("disabled")) {
                $("#bedrooms").val("1");
                $("#bedrooms").attr("disabled", true);
            }
            if (propertyType !== "rs" && $("#bedrooms").attr("disabled")) {
                $("#bedrooms").attr("disabled", false);
            }
            if (propertyType === "rh" || propertyType === "rv" || propertyType === "rfh") {
                $(".plot").show();
                $(".indProp").hide();
            } else {
                $(".plot").hide();
                $(".indProp").show();
            }
        }
        
        private controlCorporateElems() {
            if ($('input:radio[name=ownerType]:checked').val() === "o") {
                $(".corp").hide();
            } else {
                $(".corp").show();
            }
        }
    }
}

window.onload = () => {
    console.log('creating the app');
    var residentialController = new PostProperty.ResidentialController();
    residentialController.initialize();
};