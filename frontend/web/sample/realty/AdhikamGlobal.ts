/// <reference path="definitions/jquery.d.ts"/>
/// <reference path="definitions/underscore.d.ts"/>
/// <reference path="AdhikamControllers.ts"/>

module AdhikamGlobal {
    export var appMap: google.maps.Map;
    export var dataController: AdhikamMap.DataController = new AdhikamMap.DataController();
    export var searchDiv: string = "#searchDiv";
    export var templates: any[] = new Array();
    templates["ra"] = _.template('<div>' +
        '<div style="font-size:150%;padding:1px;"><strong><%= bed %>Bed/<%= bath %>Bath Apartment </strong></div> ' +
        '<% if (!_.isEmpty(propertyName)) {print(\'<div style="color:#5e91e2;"><strong>\'+propertyName+\'</strong></div>\');}%>' +
        '<div style="color:#ee974a;padding:1px;"><strong><% if (!_.isEmpty(neighbourHood)) {print(neighbourHood+",");}%> <%= city %></strong></div>' +
        '<div class="well pagination-centered" style="margin: 2px;background-color:#ffffff;border-top: 1px solid #FCFAFA;border-bottom: 1px solid #D9D4D4;height:250px;"> </div>' +
        '<div class="well" style="margin: 2px;padding:4px;"> Photos | Street | Floor Plan | Videos</div>' +
        '<div class="well pagination-centered" style="margin: 2px;padding:2px;background-color:#ffffff;border-top: 1px solid #FCFAFA;border-bottom: 1px solid #D9D4D4;height:45px;"> ' +
            '<div style="float:left;padding:3px;"><strong>Built Up Area <br/> <%= builtUpArea %></strong></div>' +
            '<div style="float:left;padding:3px;margin-left:20px;"><strong>Price <br/> <%= price %></strong></div>' +
        '</div>' +
        '<div class="well pagination-centered" style="margin: 2px;padding:2px;background-color:#ffffff;border-top: 1px solid #FCFAFA;border-bottom: 1px solid #D9D4D4;height:45px;"> ' +
            '<div style="float:left;padding:3px;"><strong>Locality Profile <br/> <a href="#">Available</a></strong></div>' +
        '</div>' +
        '<div class="well" style="margin: 2px;padding:4px;"> View Complete Listing</div>' +
        '</div>');

}
