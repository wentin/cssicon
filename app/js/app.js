var app = angular.module("iconApp", []);
app.controller("MainCtrl", ['$scope','$http', '$filter', function($scope, $http, $filter) { 
  $http.get('http://api.jsoneditoronline.org/v1/docs/f26dbdc8aa88e459fb89a95b7067bf15/data').success(function(data){ 
    $scope.icons = data; 
    $scope.viewerOpen = false;
    
    $scope.selectedIcon = $scope.icons[0];
    
    var generateHTML;
    $scope.generateHTML = generateHTML = function(icon){
      if (icon.htmlChildMarkup) {
        childHTML = "<i></i>";
      } else {
        childHTML = '';
      }
      var HTML = '<div class="' + icon.classNames + ' icon">' + childHTML + '</div>'
      return HTML;
    }
    
    var generateCSS = function(icon){
      var CSS = "";
      if (icon.cssBlocks.cssIcon) {
        CSS += icon.cssBlocks.cssIcon + '\n';
      }
      if (icon.cssBlocks.cssIconBefore) {
        CSS += icon.cssBlocks.cssIconBefore + '\n';
      }
      if (icon.cssBlocks.cssIconAfter) {
        CSS += icon.cssBlocks.cssIconAfter + '\n';
      }
      if (icon.cssBlocks.cssChild) {
        CSS += icon.cssBlocks.cssChild + '\n';
      }
      if (icon.cssBlocks.cssChildBefore) {
        CSS += icon.cssBlocks.cssChildBefore + '\n';
      }
      if (icon.cssBlocks.cssChildAfter) {
        CSS += icon.cssBlocks.cssChildAfter + '\n';
      }
      CSS += ".icon {\n  position: absolute;\n}\n.icon:before, .icon:after {\n  content: '';\n  position: absolute;\n  display: block;\n}\n" ;
      if (icon.htmlChildMarkup) {
        CSS += ".icon i {\n  position: absolute;\n}\n.icon i:before, .icon i:after {\n  content: '';\n  position: absolute;\n  display: block;\n}\n";
      } 
      return CSS;
    }
    
    var generateCodepenString = function(icon){
      var html = "<div class='iconWrapper'>\n\t" + generateHTML(icon) + "\n</div>";
      var css = generateCSS(icon);
      css += ".iconWrapper {\n  position: relative;\n  width: 21px;\n  height: 21px;\n}\n"
      if (icon.cssHidden) {
        css += icon.cssHidden + '\n';
      }
      var title = icon.name + " icon";
      
      var data = {
        title                 : title,
        description           : title + " created with pure css",
        editors               : "110", 
        layout                : "left", // top | left | right
        html                  : html,
        css                   : css,
      }
      return JSON.stringify(data).replace(/"/g, "&​quot;").replace(/'/g, "&apos;");
    }
    
    $scope.handleIconClick = function(icon){
      $scope.selectedIcon = icon;
      $scope.viewerOpen = true;
      $scope.JSONstring = generateCodepenString(icon);
      
      var htmlClipboard = new Clipboard('.html.buttonCopy', {
          text: function() {
              return generateHTML(icon);
          }
      });
      
      htmlClipboard.on('success', function(e) {
          console.log("html", e);
      });
      
      var cssClipboard = new Clipboard('.css.buttonCopy', {
          text: function() {
              return generateCSS(icon);
          }
      });
      
      cssClipboard.on('success', function(e) {
          console.log("css", e);
      });
      
    }
    
    $scope.handleButtonCloseClick = function(icon){
      $scope.viewerOpen = false;
    }
    
  }); 
}] ); 
