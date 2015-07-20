/// <reference path="definitions/jquery.d.ts"/>
/// <reference path="AdhikamGlobal.ts"/>

// Module
module NavigationHandler {

    // Class
    export class FacetController {
        // Constructor
        constructor () { }

        public swapFacetForms(facetName: string, disable:bool): void {
           // $("#fullform" + facetName).hide();             
            var checkedVals = $("#invSearchForm #" + facetName).val().split("~");
            //$("#form" + facetName).show();
            $("#form" + facetName+" input:checkbox[name=" + facetName+"]").each(function () {
                if ($.inArray(this.value, checkedVals) > -1) {
                    this.checked = true;
                }
            });
            $("#form" + facetName).show();
        }

        public removeFacet(facetName: string, forMap: bool): void {
            console.log("clearFacet called "+facetName);
            $("#invSearchForm").children("#" + facetName).remove();
            this.submitSearchForm(forMap);
        }
        private changeFacetFormHelper(data: HTMLElement, facetName: string): void {
            $("#form" + facetName).children().remove();
            $("#form" + facetName).append(data);  
            this.swapFacetForms(facetName, false);
        }
        public changeFacetForm(facetName: string): void {
            console.log("changeFacetForm called " + facetName);
            $("#form" + facetName).hide();
            var map = new Object();
            map["full"] = facetName;        
            $("#invSearchForm").children().each(function() {
                if (this.name !== facetName) {
                    if (map[this.name] !== undefined) {
                        map[this.name] = map[this.name]+"~"+this.value;
                    } else {
                        map[this.name] = this.value;
                    }
                }
            });
            console.log("changeFacetForm map " + JSON.stringify(map));
            var url: string = "/fullfacet";
            $.ajax({
                url: url,
                data: JSON.stringify(map),
                contentType: 'text/plain',
                type: 'POST',
                dataType: 'html',
                success: (data) => this.changeFacetFormHelper(data, facetName)
            });    
        }

        public gotoPage(param: string, pageNum: string): void {
            $('<input>').attr({
                type: 'hidden',
                name: param,
                value: pageNum
            }).appendTo("#invSearchForm");
            this.submitSearchForm(false);
        }

        public addParamSubmitFacet(facetName: string, facetValue: string, forMap: bool): void {
            $('<input>').attr({
                type: 'hidden',
                name: facetName,
                value: facetValue
            }).appendTo("#invSearchForm");
            this.submitSearchForm(forMap);
        }

        public submitFacet(facetName: string, forMap: bool): void {
            try {
                var checkedVals = new Array[];
                console.log("submitChange called " + $('input[name=' + facetName + ']').length);
                console.log("submitChange called " + $('input[name=' + facetName + ']:checked').length);
                $('input[name=' + facetName + ']:checked').each(
                    function () { if($.inArray(this.value, checkedVals) === -1)checkedVals.push(this.value); }
                );
                console.log("submitChange called " + checkedVals.join("~"));
                $("#invSearchForm #" + facetName).remove();
                console.log("submitChange invSearchForm before " + $("#invSearchForm").html());
                $('<input>').attr({
                    type: 'hidden',
                    name: facetName,
                    value: checkedVals.join("~")
                }).appendTo("#invSearchForm");
                console.log("submitChange invSearchForm after " + $("#invSearchForm").html());
                this.submitSearchForm(forMap);
            } catch (err) {
                console.log("errd ",err.message);
                console.log(err);
            }
        }

        public refineFacet(facetName: string): void {
            var fieldChecked: bool = false;
            $('input[name=' + facetName+']:checked').each(function() {
                fieldChecked = true;
                return;
            });
            if (fieldChecked) {
                $("#ref" + facetName).show();
            } else {
                $("#ref" + facetName).hide();
            }
        }

        public clearCheck(facetName: string): void {
            $('input:checkbox[name=' + facetName+']:checked').each(function() {
                this.checked = false;
            });
            $("#ref" + facetName).hide();
        }

        private submitSearchForm(forMap: bool): void {
            //$("#invSearchForm").children("input.th").remove();
            if (forMap) {
                AdhikamGlobal.dataController.updateMapData();
            } else {
                $("#invSearchForm").submit();
            }
        }
    }

}

var fc = new NavigationHandler.FacetController();