"use strict";

var creativityServices = angular.module('creativityServices', ['ngResource']);

creativityServices.service('AssemblToolsService', ['$window', '$rootScope', '$log', function ($window, $rootScope, $log) {
  this.resourceToUrl = function(str)
  {
    var start = "local:";
    if ( str.indexOf(start) == 0 )
    {
      str = "/data/" + str.slice(start.length);
    }
    return str;
  };
}]);

creativityServices.service('VoteWidgetService', ['$window', '$rootScope', '$log', '$http', function ($window, $rootScope, $log, $http) {

  this.mandatory_settings_fields = [];

  this.optional_settings_fields = [
    {
      "key": "padding",
      "type": "integer",
      "label": "Padding in item",
      "default": 60,
      "description": "Empty space (in pixels) between the border of the votable item and its axis"
    },
    {
      "key": "minWidth",
      "type": "integer",
      "label": "Minimum width",
      "defaultAdmin": 600,
      "description": "Minimum width of the total voting area, in pixels (CSS property)"
    },
    {
      "key": "minHeight",
      "type": "integer",
      "label": "Minimum height",
      "defaultAdmin": 600,
      "description": "Minimum height of the total voting area, in pixels (CSS property)"
    },
    {
      "key": "displayStyle",
      "type": "select",
      "label": "Display style",
      "default": "classic",
      "description": "How voting items will be displayed ('classic' or 'table')",
      "options": {
        "classic": "classic",
        "table": "table"
      }
    },
    {
      "key": "background",
      "type": "text",
      "description": "Color or effect (CSS style) for the background of the page",
      "defaultAdmin":"#F2ECF8"
    },
    {
      "key": "showVoter",
      "label": "Show voter",
      "type": "select",
      "description": "Display 'You will be voting as \"name\".', and place it at the top or at the bottom of the screen",
      "default":"false",
      "options": {
        "false": "false",
        "top": "top",
        "bottom": "bottom"
      }
    },
    {
      "key": "showCriterionDescription",
      "label": "Show criterion description",
      "type": "select",
      "description": "Different ways of displaying the description associated to each criterion",
      "default":"tooltip",
      "options": {
        "false": "false",
        "tooltip": "tooltip",
        "text": "text"
      }
    }
  ];

  this.mandatory_item_fields = [];

  this.optional_item_fields = [
    {
      "key": "width",
      "type": "integer",
      "label": "Width",
      "default": 300
    },
    {
      "key": "height",
      "type": "integer",
      "label": "Height",
      "default": 300
    }
  ];

  this.mandatory_criterion_fields = [
    {
      "key": "entity_id",
      "type": "criterion",
      "label": "Criterion entity id"
    },
    {
      "key": "name",
      "type": "text",
      "label": "Name"
    },
    {
      "key": "valueMin",
      "type": "integer",
      "default": 0,
      "description": "The minimum value which can be voted"
    },
    {
      "key": "valueMax",
      "type": "integer",
      "default": 100,
      "description": "The maximum value which can be voted"
    }
  ];

  this.optional_criterion_fields = [
    {
      "key": "description",
      "type": "text",
      "description": "Text which will be shown around the votable item"
    },
    {
      "key": "valueDefault",
      "type": "integer",
      "label": "default value",
      "description": "Value on which the votable item will be initially set"
    },
    {
      "key": "descriptionMin",
      "type": "text",
      "description": "Text which will be shown around the minimum value of the axis"
    },
    {
      "key": "descriptionMax",
      "type": "text",
      "description": "Text which will be shown around the maximum value of the axis"
    },
    {
      "key": "ticks",
      "label": "number of ticks",
      "type": "integer",
      "default": 5,
      "description": "Indicative number of ticks to be shown on the axis"
    },
    {
      "key": "colorMin",
      "type": "text",
      "description": "Color of the minimum value",
      "defaultAdmin":"#ff0000"
    },
    {
      "key": "colorMax",
      "type": "text",
      "description": "Color of the maximum value",
      "defaultAdmin":"#00ff00"
    },
    {
      "key": "colorAverage",
      "type": "text",
      "description": "Color of the average value",
      "defaultAdmin":"#ffff00"
    },
    {
      "key": "colorCursor",
      "type": "text",
      "description": "Color of the draggable cursor",
      "defaultAdmin":"#000000"
    }
  ];

  this.addDefaultFields = function(obj, default_fields){
    var sz = default_fields.length;
    for ( var i = 0; i < sz; ++i )
    {
      var field = default_fields[i];
      if ( !obj.hasOwnProperty(field.key)
        && field.hasOwnProperty("default") )
      {
        obj[field.key] = field.default;
      }
    }
    return obj;
  };

  this.getFieldDefaultValue = function (default_fields, field_name, for_admin){
    // var default_value = ''; // /!\ setting it to an empty string does not create the property!
    var default_value = "something";
    var optional_field = default_fields.find(function(e){
      return ( e.key == field_name );
    });
    if ( optional_field != undefined ){
      if ( for_admin == true && optional_field.hasOwnProperty("defaultAdmin") )
        default_value = optional_field.defaultAdmin;
      else if ( optional_field.hasOwnProperty("default") )
        default_value = optional_field.default;
      else if ( optional_field.hasOwnProperty("type") )
      {
        if ( optional_field.type == "integer" )
          default_value = 0;
      }
    }
    return default_value;
  };

  this.sendJson = function(method, endpoint, post_data, result_holder){
    console.log("putJson()");

    $http({
        method: method,
        url: endpoint,
        data: post_data,
        //data: $.param(post_data),
        headers: {'Content-Type': 'application/json'}
        //headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(data, status, headers){
        console.log("success");
        if ( result_holder )
          result_holder.text("Success!");
        console.log("data:");
        console.log(data);
        console.log("status:");
        console.log(status);
        console.log("headers:");
        console.log(headers);
    }).error(function(data, status, headers, config){
        console.log("error");
        if ( result_holder )
          result_holder.text("Error");
        console.log("data:");
        console.log(data);
        console.log("status:");
        console.log(status);
        console.log("headers:");
        console.log(headers);
    });
  };

  this.putJson = function(endpoint, post_data, result_holder){
    this.sendJson('PUT', endpoint, post_data, result_holder);
  };

  this.postJson = function(endpoint, post_data, result_holder){
    this.sendJson('POST', endpoint, post_data, result_holder);
  };

}]);



creativityServices.factory('globalConfig', function($http){

    var api_rest = 'test/config_test.json';

    return {
        fetch : function() {
            return $http.get(api_rest);
        }
    }

});


//CONFIG
creativityServices.factory('configTestingService', [function(){
  return {
    init: function(){
      
    },
    testCall: function(){
      $.ajax({
        url:'http://localhost:6543/data/Discussion/1/widgets',
        type:'POST',
        data: {
           type:'MultiCriterionVotingWidget',
           settings: JSON.stringify({"idea":"local:Idea/2"})
        },
        success: function(data, textStatus, jqXHR){

           getConfig(jqXHR.getResponseHeader('location'));
        },
        error: function(jqXHR, textStatus, errorThrown){

           console.log(jqXHR);

        }
      });

      function getConfig(value){
        var widget = value.split(':');
        console.log('http://localhost:6543/data/'+widget[1]);
      }
    },
    getConfiguration: function(url, fnSuccess, fnError){
      fnSuccess = fnSuccess || function (data){console.log("data:");console.log(data);};
      fnError = fnError || function(jqXHR, textStatus, errorThrown){};
      $.ajax({
        url:url,
        type:'GET',
        data: {},
        success: fnSuccess,
        error: fnError
      });
    }
  }

}]);


//CARD inspire me: send an idea to assembl
creativityServices.factory('sendIdeaService', ['$resource',function($resource){
    return $resource('http://localhost:6543/api/v1/discussion/:discussionId/posts')
}]);

// WIP: use Angular's REST and Custom Services as our Model for Messages
creativityServices.factory('Discussion', ['$resource', function($resource){
    return $resource('http://localhost:6543/data/Discussion/:discussionId', {}, {
        query: {method:'GET', params:{discussionId:'1'}, isArray:false}
        });
}]);

