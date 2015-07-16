/// <reference path="definitions/jquery.d.ts"/>
 
module Collector {

    // Class
    export class NNWorker {
        // Constructor
        constructor() { }

        public collectContent(): void {
            this.clearLeftAlign();
            this.addFormDiv();
            try {
                $("#propRef").val($(location).attr("href"));
                $("#bedrooms").val($("#bedroom_numLabel ~ td > span").text());
                $("#bathrooms").val($("#bathroom_numLabel ~ td > span").text());
                $("#propertyName").val($("#prop_nameLabel ~ td").text());
                this.getBuiltUpArea();
                this.getCarpetArea();
                this.parseTotalNumberOfFloors();
                this.parsePropertyFloorNumber();
                this.expectedPrice();
                this.propertyDescription(); 
                this.getPropertyAddress();
                this.getContactDetails();
                this.ageOfProperty();
                this.readyToMoveIn();
                this.getPhoneNumbers();
                this.getFurnish();
                this.getGeo();
            } catch (err) {
                console.log("err collectContent", err.message);
                console.log(err);
            }
        }
        private getBuiltUpArea(): void {
            try {
                $("#builtUpArea").val("1");
                var temp = $("#builtupArea_span").text();
                console.log("builtUpArea "+temp);
                if(temp !== null && typeof temp !== 'undefined'){
                    var t = temp.match(/[\d]+/g);
                    if(t !== null && typeof t !== 'undefined') temp = t[0];
                    temp = temp.trim();
                }
                if(temp !== null && typeof temp !== 'undefined' && temp.length > 0){
                    $("#builtUpArea").val(temp);
                }
                console.log("builtUpArea, "+temp+", "+$("#builtUpArea").val());
            } catch (err) {
                console.log("err #builtUpArea", err.message);
                console.log(err);
            }
        }
        private getCarpetArea(): void {
            try {
                $("#carpetArea").val("0");
                var temp = $("#carpetArea_span").text();
                console.log("carpetArea "+temp);
                if(temp !== null && typeof temp !== 'undefined'){
                    var t = temp.match(/[\d]+/g);
                    if(t !== null && typeof t !== 'undefined') temp = t[0];
                    temp = temp.trim();
                }
                if(temp !== null && typeof temp !== 'undefined' && temp.length > 0){
                    $("#carpetArea").val(temp);
                }
                console.log("carpetArea, "+temp+", "+$("#carpetArea").val());
            } catch (err) {
                console.log("err #carpetArea", err.message);
                console.log(err);
            }
        }

        public submitForm(): void {
            console.log("submitForm called ");
            var dataHolder: DataHolder = new DataHolder();
            dataHolder.ageOfProperty = $("#ageOfProperty").val();
            dataHolder.bathrooms = $("#bathrooms").val();
            dataHolder.bedrooms = $("#bedrooms").val();
            dataHolder.builtUpArea = $("#builtUpArea").val();
            dataHolder.carpetArea = $("#carpetArea").val();
            dataHolder.city = $("#city").val();
            dataHolder.companyAddress = $("#companyAddress").val();
            dataHolder.companyName = $("#companyName").val();
            dataHolder.companyProfile = $("#companyProfile").val();
            dataHolder.companyUrl = $("#companyUrl").val();
            dataHolder.propertyEmailId = $("#propertyEmailId").val();
            dataHolder.propertyMobile = $("#propertyMobile").val();
	        dataHolder.propertyPerson = $("#propertyPerson").val();
            dataHolder.expectedPrice = $("#expectedPrice").val();
            dataHolder.furnished = $("#furnished").val();
            dataHolder.neighborhood = $("#neighborhood").val();
            dataHolder.ownerType = $("#ownerType").val();
            dataHolder.plotArea = $("#plotArea").val();
            dataHolder.propertyAddress = $("#propertyAddress").val();
            dataHolder.propertyDescription = $("#propertyDescription").val();
            dataHolder.propertyFloorNumber = $("#propertyFloorNumber").val();
            dataHolder.propertyName = $("#propertyName").val();
            dataHolder.propertyType = $("#propertyType").val();
            dataHolder.readyToMoveIn = $("#readyToMoveIn").val();
            dataHolder.sellOrRent = $("#sellOrRent").val();
            dataHolder.totalNumberOfFloors = $("#totalNumberOfFloors").val();
            dataHolder.latitude = $("#latitude").val();
            dataHolder.longitude = $("#longitude").val();

            console.log("submitForm " + JSON.stringify(dataHolder));
            /*
            var url: string = "/fullfacet";
            $.ajax({
                url: url,
                data: JSON.stringify(dataHolder),
                contentType: 'text/plain',
                type: 'POST',
                dataType: 'html',
                success: (data) => this.changeFacetHelper(data, facetName)
            });    
            */
        }
        private getGeo() {
            try{
                var temp = $("#map_canvas").attr("onclick");
                if (temp !== null && typeof temp !== 'undefined') {
                    var p: string[] = temp.substring(temp.indexOf("prop_desc"), temp.length).split(",");
                    $("#latitude").val(p[1].match(/[\d\.]+/g)[0]);
                    $("#longitude").val(p[2].match(/[\d\.]+/g)[0]);
                }
            } catch (err) {
                console.log("err getGeo", err.message);
                console.log(err);
            }
        }
        private getFurnish() {
            var temp = $("#furnishLabel ~ td").text();
            $("#furnished").val("u");
            if (temp !== null && typeof temp !== 'undefined') {
                if (temp.indexOf("emi") > 0) {
                    $("#furnished").val("s");
                } else if (temp.indexOf("nf") >= 0) {
                    $("#furnished").val("u");
                } else if (temp.indexOf("fur") >= 0) {
                    $("#furnished").val("f");
                }
            }
        }

        private getPhoneNumbers(): void {
            var temp = $("input.btnsprit.brown1_btn.mt5").attr("onclick");;
            console.log("getPhoneNumbers temp "+temp);
            var phoneNumber = "";
            if(temp !== null && typeof temp !== 'undefined' && temp.length > 0){
                temp = temp.substring(temp.indexOf("openViewPhoneNoInline(event,this")+"openViewPhoneNoInline(event,this".length, temp.length);
                var t = temp.match(/[\d\-]+/g);
                console.log("getPhoneNumbers t "+t);
                if (t !== null && typeof t !== 'undefined') {
                    for (var i = 0; i < t.length; i++) {
                        if (t[i].length > 8) {
                            phoneNumber = phoneNumber + t[i] + ", ";
                        }
                    }
                }
            }
            console.log("getPhoneNumbers temp "+phoneNumber);
            $("#propertyMobile").val(phoneNumber);
        }
        private getContactDetails(): void {
            var temp = $("div.m5.f12 td.f12 span.b").text();
            if (temp !== null && typeof temp !== 'undefined') {
                    temp = temp.replace(/\s{2,}/g, ' ');
                    temp = temp.trim();
            }
            $("#propertyPerson").val(temp);
            temp = $("div.m5.f12 td.f12 span.f12").text();
            if (temp !== null && typeof temp !== 'undefined') {
                    temp = temp.replace(/\s{2,}/g, ' ');
                    temp = temp.trim();
            }
            $("#companyName").val(temp);
            temp = $("div.m5.f11 td.lp10.f12 span.f12").text();
            if (temp !== null && typeof temp !== 'undefined') {
                    temp = temp.replace(/\s{2,}/g, ' ');
                    temp = temp.trim();
            }
            $("#companyAddress").val(temp);
            $("#companyUrl").val($("div.f12.mt15 span.blue").text());

            temp = $("#moreDetails").text();
            if (temp !== null && typeof temp !== 'undefined' && temp.length > 0) {
                temp = temp.replace("Less", "");
            } else {
                temp = $("#lessDetails").text();
            }
            if (temp !== null && typeof temp !== 'undefined' && temp.length > 0) {
                temp = temp.replace("About Company:", "");
            }
            $("#companyProfile").val(temp);
        }

        private getPropertyAddress(): void {
            var neighborhood = $("#cssBox > h1 > a:eq(0)").text();
            console.log("neighborhood "+neighborhood);
            $("#neighborhood").val(neighborhood);
            var temp = $("#cssBox > h1 > a:eq(1)").text();
            if (temp !== null && typeof temp !== 'undefined') {
                temp = temp.replace("Central","");
                temp = temp.replace("North","");
                temp = temp.replace("Others","");
                temp = temp.replace("South","");
                temp = temp.replace("West","");
                temp = temp.trim();
            }
            console.log("city "+temp);
            if (temp !== null && typeof temp !== 'undefined' && temp.length > 0) {
                $("#city").val(temp);
            }
            var address = $("#cssBox > div.vp3").text();
            console.log("address "+address);
            try{
                if (address !== null && typeof address !== 'undefined') {
                    address = address.replace("Property Address:", "");
                    if (neighborhood !== null && typeof neighborhood !== 'undefined' && neighborhood.length > 0) {
                        address = address.substring(0, address.lastIndexOf(neighborhood));
                        address = address.trim();
                    }
                }
            } catch (err) {
                console.log("err #propertyAddress", err.message);
                console.log(err);
            }
            console.log("address "+address);
            $("#propertyAddress").val(address);
        }

        private propertyDescription(): void {
            try {
                var temp: string = $("div.prop-para.f12").children("div").text(); 
                console.log("propertyDescription "+temp);
                if(temp !== null && typeof temp !== 'undefined'){
                    temp = temp.substring(temp.indexOf("Property Description:"), temp.length);
                    temp = temp.replace("Property Description:","");
                    temp = temp.trim();
                }
                console.log("propertyDescription "+temp);
                $("#propertyDescription").val(temp);
            } catch (err) {
                console.log("err #propertyDescription", err.message);
                console.log(err);
            }
        }

        private parseTotalNumberOfFloors(): void {
            try {
                $("#totalNumberOfFloors").val("1");
                var temp = $("#total_floorLabel ~ td").text();
                console.log("totalNumberOfFloors "+temp);
                if(temp !== null && typeof temp !== 'undefined'){
                    var t = temp.match(/[\d]+/g);
                    if(t !== null && typeof t !== 'undefined') temp = t.join("");
                    temp = temp.replace(/\s{2,}/g, ' ');
                    temp = temp.trim();
                }
                console.log("totalNumberOfFloors, "+temp+", "+$("#totalNumberOfFloors").val());
                if(temp !== null && typeof temp !== 'undefined' && temp.length > 0){
                    $("#totalNumberOfFloors").val(temp);
                }
                console.log("totalNumberOfFloors, "+temp+", "+$("#totalNumberOfFloors").val());
            } catch (err) {
                console.log("err #totalNumberOfFloors", err.message);
                console.log(err);
            }
        }

        private parsePropertyFloorNumber(): void {
            try {
                $("#propertyFloorNumber").val("0");
                var temp = $("#floor_numLabel ~ td").text();
                console.log("propertyFloorNumber "+temp);
                if(temp !== null && typeof temp !== 'undefined'){
                    var t = temp.match(/[\d]+/g);
                    if(t !== null && typeof t !== 'undefined') temp = t.join("");
                    temp = temp.replace(/\s{2,}/g, ' ');
                    temp = temp.trim();
                }
                console.log("propertyFloorNumber, "+temp+", "+$("#propertyFloorNumber").val());
                if(temp !== null && typeof temp !== 'undefined' && temp.length > 0){
                    $("#propertyFloorNumber").val(temp);
                }
                console.log("propertyFloorNumber, "+temp+", "+$("#propertyFloorNumber").val());
            } catch (err) {
                console.log("err #propertyFloorNumber", err.message);
                console.log(err);
            }
        }

        private readyToMoveIn(): void {
            try {
                var temp = $("#availabilityLabel ~ td span").text();
                console.log("readyToMoveIn "+temp);
                if(temp !== null && typeof temp !== 'undefined'){
                    var t = temp.match(/[\d]+/g);
                    if(t !== null && typeof t !== 'undefined') temp = t.join("");
                    temp = temp.replace(/\s{2,}/g, ' ');
                    temp = temp.trim();
                }
                console.log("readyToMoveIn "+temp);
                if(temp !== null && typeof temp !== 'undefined' && temp.length > 2){
                    $("#readyToMoveIn").val(temp);
                }else {
                    $("#readyToMoveIn").val("2013");
                }
            } catch (err) {
                console.log("err #readyToMoveIn", err.message);
                console.log(err);
            }
        }

        private ageOfProperty(): void {
            $("#ageOfProperty").val("90");
            try {
                var temp = $("#ageLabel ~ td > span").text();
                console.log("ageOfProperty "+temp);
                if(temp !== null && typeof temp !== 'undefined' && temp.length > 0){
                    if (temp.indexOf("Construction") > 0) {
                        $("#ageOfProperty").val("90");
                        return;
                    }
                    var t = temp.match(/[\d\-]+/g);
                    if(t !== null && typeof t !== 'undefined') temp = t.join("");
                    temp = temp.trim();
                    if (temp === "0-1") {
                        $("#ageOfProperty").val("1");
                    } else if (temp === "1-5"){
                        $("#ageOfProperty").val("5");
                    } else if (temp === "5-10"){
                        $("#ageOfProperty").val("12");
                    } else if (temp === "10"){
                        $("#ageOfProperty").val("12");
                    }
                }
            } catch (err) {
                console.log("err #ageOfProperty", err.message);
                console.log(err);
            }
        }

        private expectedPrice(): void {
            try {
                var temp = $("div.f14.orange.ml_15 > span.b").text();
                if(temp !== null && typeof temp !== 'undefined'){
                    var lakh: number = temp.indexOf("Lac");
                    var crore: number = temp.indexOf("Crore");
                    var t = temp.match(/[\d]+/g);
                    if(t !== null && typeof t !== 'undefined') temp = t.join("");
                    temp = temp.replace(/\s{2,}/g, ' ');
                    temp = temp.trim();
                    if (lakh > 0 && temp.length == 2) {
                        temp = temp + "00000";
                    }else if (lakh > 0 && temp.length == 3) {
                        temp = temp + "0000";
                    }else if (lakh > 0 && temp.length == 4) {
                        temp = temp + "000";
                    }
                    if (crore > 0 && temp.length == 2) {
                        temp = temp + "0000000";
                    }else if (crore > 0 && temp.length == 3) {
                        temp = temp + "000000";
                    }else if (crore > 0 && temp.length == 4) {
                        temp = temp + "00000";
                    }
                }
                $("#expectedPrice").val(temp); 
            } catch (err) {
                console.log("err #expectedPrice", err.message);
                console.log(err);
            }
        }
        private addFormDiv(): void {
            $('body').append('<div style="border:1px solid black;float:right;z-index:1001;background-color:white;max-width:480px;position:fixed;top:0;right:0;">' +
                '<form id="subForm" method="post" action="http://localhost:9000/back/post-data">' +
                '<table>' +
                '<tr><td>bedrooms</td><td><input type="text" name="bedrooms" id="bedrooms" value=""></td>' + // done
                '<td>bathrooms</td><td><input type="text" name="bathrooms" id="bathrooms" value=""></td></tr>' +// done
                '<tr><td>builtUpArea</td><td><input type="text" name="builtUpArea" id="builtUpArea" value=""></td>' +// done
                '<td>carpetArea</td><td><input type="text" name="carpetArea" id="carpetArea" value="0"></td></tr>' +
                //'<input type="text" name="plotArea" id="plotArea" value="0"></td>'+
                '<tr><td>totalFloors</td><td><input type="text" name="totalNumberOfFloors" id="totalNumberOfFloors" value=""></td>' +// done
                '<td>propertyFloor</td><td><input type="text" name="propertyFloorNumber" id="propertyFloorNumber" value=""></td></tr>' +// done
                '<tr><td>TotalPrice</td><td><input type="text" name="expectedPrice" id="expectedPrice" value=""></td>' +// done
                '<td>propName</td><td><input type="text" name="propertyName" id="propertyName" value=""></td></tr>' +// done
                '<tr><td>Description</td><td><input type="text" name="propertyDescription" id="propertyDescription" value=""></td>' +// done
                '<td>city</td><td><input type="text" name="city" id="city" value=""></td></tr>' +// done
                '<tr><td>neighbor</td><td><input type="text" name="neighborhood" id="neighborhood" value=""></td>' +// done
                '<td>propAddress</td><td><input type="text" name="propertyAddress" id="propertyAddress" value=""></td></tr>' +// done
                '<tr><td>contactPerson</td><td><input type="text" name="propertyPerson" id="propertyPerson" value=""></td>' +// done
                '<td>contactMobile</td><td><input type="text" name="propertyMobile" id="propertyMobile" value=""></td></tr>' +// done
                '<tr><td>contactEmailId</td><td><input type="text" name="propertyEmailId" id="propertyEmailId" value=""></td>' +
                '<td>companyName</td><td><input type="text" name="companyName" id="companyName" value=""></td></tr>' +// done
                '<tr><td>companyUrl</td><td><input type="text" name="companyUrl" id="companyUrl" value=""></td>' +// done
                '<td>companyAddress</td><td><input type="text" name="companyAddress" id="companyAddress" value=""></td></tr>' +// done
                '<tr><td>companyProfile</td><td><input type="text" name="companyProfile" id="companyProfile" value=""></td>' +// done
                '<td>ageOfProperty</td><td><select id="ageOfProperty" name="ageOfProperty">' +
                    '<option value="90">Construction</option>' +
                    '<option value="99" selected="selected">Just Built</option>' +
                    '<option value="1"> < 1 year</option>' +
                    '<option value="3">1+ to 3 yrs</option>' +
                    '<option value="5">3+ to 5 yrs</option>' +
                    '<option value="8">5+ to 8 yrs</option>' +
                    '<option value="12">8+ to 12 yrs</option>' +
                    '<option value="20">12+ to 20 yrs</option>' +
                    '<option value="21">20+ yrs</option>' +
                '</select></td></tr>' +
                '<tr><td>readyToMoveIn</td><td><select id="readyToMoveIn" name="readyToMoveIn">' +
                    '<option value="2013" selected="selected"> by 2013</option>' +
                    '<option value="2014"> by 2014</option>' +
                    '<option value="2015"> by 2015</option>' +
                    '<option value="2016"> by 2016</option>' +
                    '<option value="2017"> by 2017</option>' +
                    '<option value="2018"> by 2018</option>' +
                    '<option value="2019"> by 2019</option>' +
                    '<option value="2020"> by 2020</option>' +
                '</select></td>' +
                '<td>furnished</td><td><select id="furnished" name="furnished">' +
                    '<option value="u" selected="selected">Unfurnished</option>' +
                    '<option value="s">Semi Furnished</option>' +
                    '<option value="f">Furnished</option>' +
                '</select></td></tr>' +
                '<input type="hidden" name="ownerType" value="b"/>' +
                '<input type="hidden" name="sellOrRent" value="s"/>' +
                /*
                '<tr><td>ownerType</td><td><select name="ownerType" id="ownerType">'+
                    '<option value="b">Builder</option>'+
                '</select></td>'+
                '<td>sellOrRent</td><td><select name="sellOrRent" id="sellOrRent">'+
                    '<option value="s">Sell</option>'+
                '</select></td></tr>'+
                */
                '<tr><td>latitude</td><td><input type="text" name="latitude" id="latitude" value=""></td>' +// done
                '<td>longitude</td><td><input type="text" name="longitude" id="longitude" value=""></td></tr>' +
                '<tr><td>propertyType</td><td><select name="propertyType" id="propertyType">' +
                    '<option value="ra">Residential Apartment</option>' +
                '</select></td>' +             
                '<td>Project Id</td><td><input type="text" name="projectId" id="projectId" ></td></tr>' +   
                '<tr><td colspan="3"><input type="text" name="propRef" id="propRef" size="55"/></td>' +
                '<td><input type="submit" value="Post property" id="subButton"></td></tr>' +
                '</form>' +
                /*
                '<script><\/script><script>' +
                    'function submitForm() {' +
                     '   console.log("submitForm called ");' +
                      '  var dataHolder: DataHolder = new DataHolder();' +
                       ' dataHolder.ageOfProperty = $("#ageOfProperty").val();' +
                        'dataHolder.bathrooms = $("#bathrooms").val();' +
                        'dataHolder.bedrooms = $("#bedrooms").val();' +
                        'dataHolder.builtUpArea = $("#builtUpArea").val();' +
                        'dataHolder.carpetArea = $("#carpetArea").val();' +
                        'dataHolder.city = $("#city").val();' +
                        'dataHolder.companyAddress = $("#companyAddress").val();' +
                        'dataHolder.companyName = $("#companyName").val();' +
                        'dataHolder.companyProfile = $("#companyProfile").val();' +
                       ' dataHolder.companyUrl = $("#companyUrl").val();' +
                       ' dataHolder.propertyEmailId = $("#propertyEmailId").val();' +
                       ' dataHolder.propertyMobile = $("#propertyMobile").val();' +
                       ' dataHolder.propertyPerson = $("#propertyPerson").val();' +
                       ' dataHolder.expectedPrice = $("#expectedPrice").val();' +
                       ' dataHolder.furnished = $("#furnished").val();' +
                       ' dataHolder.neighborhood = $("#neighborhood").val();' +
                        'dataHolder.ownerType = $("#ownerType").val();' +
                        'dataHolder.plotArea = $("#plotArea").val();' +
                        'dataHolder.propertyAddress = $("#propertyAddress").val();' +
                        'dataHolder.propertyDescription = $("#propertyDescription").val();' +
                        'dataHolder.propertyFloorNumber = $("#propertyFloorNumber").val();' +
                        'dataHolder.propertyName = $("#propertyName").val();' +
                        'dataHolder.propertyType = $("#propertyType").val();' +
                        'dataHolder.readyToMoveIn = $("#readyToMoveIn").val();' +
                        'dataHolder.sellOrRent = $("#sellOrRent").val();' +
                        'dataHolder.totalNumberOfFloors = $("#totalNumberOfFloors").val();' +
                        'dataHolder.latitude = $("#latitude").val();' +
                        'dataHolder.longitude = $("#longitude").val();' +

                        'console.log("submitForm " + JSON.stringify(dataHolder));' +
                        'var url = "/back/post-parse";' +
                        '$.ajax({' +
                         '   url: url,' +
                         '   data: JSON.stringify(dataHolder),' +
                         '   contentType: "text/plain",' +
                         '   type: "POST",' +
                         '  dataType: "html",' +
                         '   success: function(data){$("#result").html(data);}' +
                        '});    ' +
                    '}' +
                '<\/script>'+
                */
                '</div>'
                );
        }
        private clearLeftAlign(): void {
            $('div').removeClass('c');
            $('fixme').remove();
            $('.mainContainer ').css('margin', '0');
        }
    }

    class DataHolder {
        public ageOfProperty: string;
	    public bathrooms: string;
	    public bedrooms: string;
	    public builtUpArea: string;
	    public carpetArea: string;
	    public city: string;
	    public companyName: string;
	    public companyAddress: string;
	    public companyProfile: string;
	    public companyUrl: string;
	    public propertyEmailId: string;
	    public propertyMobile: string;
	    public propertyPerson: string;
	    public expectedPrice: string;
	    public furnished: string;
	    public neighborhood: string;
	    public ownerType: string;
	    public plotArea: string;
	    public propertyAddress: string;
	    public propertyDescription: string;
	    public propertyFloorNumber: string;
	    public propertyName: string;
	    public propertyType: string;
	    public readyToMoveIn: string;
	    public sellOrRent: string;
	    public totalNumberOfFloors: string;
	    public latitude: string;
	    public longitude: string;
	    public propRef: string;
    }

}
