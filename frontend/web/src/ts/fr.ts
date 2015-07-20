/// <reference path="../defi/jquery.d.ts"/>
/// <reference path="../defi/require.d.ts"/>

module Flights {
    export class FlightsController {
        constructor() {}

        public initialize() {
            console.log('initializing the Flights Controller');
            //this.trackEvents();
        }

        private trackEvents() {
            console.log('trackEvents');
            $("#sortBy").change((e) => {
              var sortByVal = $(e.currentTarget).val();
              $("#invForm input[name='sortBy']").val(sortByVal);
              $( "#invForm" ).submit();
            });

            $("a.gotoPage").click((e) => {
              e.preventDefault();
              var clickedPage = $(e.currentTarget).attr('data-page');
              $("#invForm input[name='page']").val(clickedPage);
              $( "#invForm" ).submit();
              return false;
            });

            $(".facet").click((e) => {
              var target = $(e.currentTarget);
              var facet = target.attr('name');
              var facetType = target.attr('type');
              var facetValue = target.attr('value');
              if(facetType === "radio"){
                $("#invForm input[name='"+facet+"']").val(facetValue);
              }else if(facetType === "checkbox"){
                var invFormElement = $("#invForm input[name='f-"+facet+"']");
                var facetValues = invFormElement.val();
                console.log(facet+" checked "+facetValues+" "+invFormElement.attr("name"));
                if(target.is(':checked')){
                  facetValues = facetValues+","+facetValue;
                }else{
                  facetValues = facetValues.replace(facetValue, '');
                  facetValues = facetValues.replace(/[,]+/g, ',');
                }
                invFormElement.val(facetValues);
                $( "#invForm" ).submit();
              }
            });
        }
    }
}

requirejs.config({
  //To get timely, correct error triggers in IE, force a define/shim exports
  //enforceDefine: true,
  paths: {
    jquery: [
      '../lib/jquery.min' // your fallback
    ],
    d3: [
      '../lib/d3.min' // your fallback
    ]
  },
  shim: {
    //jquerylazyload: ['jquery']
  }
});

//  requirejs(["app"]);
define(['jquery', 'd3'], function($, d3) {
  $( document ).ready(function() {
      console.log('registering Flights');
      var flightsController = new Flights.FlightsController();
      flightsController.initialize();
  });
});