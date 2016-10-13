
var app = angular.module("iconApp", ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'views/home.html',
      controller: 'HomeController',
      reload: true,
      resolve:{
        load: function (IconsService) {
          return IconsService.loadIcons();
        }
      }
    })
    .state('home.icon', {
      url: 'icon/:uid',
      templateUrl: 'views/icon-viewer.html',
      controller: 'IconController'
    })
        
});

app.controller("MainController", function($http, $scope, $scope, $q) {
  var generateHTML = $scope.generateHTML = function(icon){
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
    return CSS;
  }
  
  var generateCodepenString = function(icon){
    var html = generateHTML(icon);
    var css = generateCSS(icon);
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

  var openIconPanel = $scope.openIconPanel = function(icon){
    $scope.selectedIcon = icon;

    $scope.selectedIcon.cssBlocks = {};
    var iconName = icon.classNames;
    var cssIconHttp = $http.get('../css/icons/' + iconName + '/main.css').then(function(res){
      $scope.selectedIcon.cssBlocks.cssIcon = res.data;
    }, function(){
      $scope.selectedIcon.cssBlocks.cssIcon = false;
    });

    var cssIconBeforeHttp = $http.get('../css/icons/' + iconName + '/before.css').then(function(res){
      $scope.selectedIcon.cssBlocks.cssIconBefore = res.data;
    }, function(){
      $scope.selectedIcon.cssBlocks.cssIconBefore = false;
    });

    var cssIconAfterHttp = $http.get('../css/icons/' + iconName + '/after.css').then(function(res){
      $scope.selectedIcon.cssBlocks.cssIconAfter = res.data;
    }, function(){
      $scope.selectedIcon.cssBlocks.cssIconAfter = false;
    });

    var cssChildHttp = $http.get('../css/icons/' + iconName + '/i.css').then(function(res){
      $scope.selectedIcon.cssBlocks.cssChild = res.data;
    }, function(){
      $scope.selectedIcon.cssBlocks.cssChild = false;
    });

    var cssChildBeforeHttp = $http.get('../css/icons/' + iconName + '/i-before.css').then(function(res){
      $scope.selectedIcon.cssBlocks.cssChildBefore = res.data;
    }, function(){
      $scope.selectedIcon.cssBlocks.cssChildBefore = false;
    });

    var cssChildAfterHttp = $http.get('../css/icons/' + iconName + '/i-after.css').then(function(res){
      $scope.selectedIcon.cssBlocks.cssChildAfter = res.data;
    }, function(){
      $scope.selectedIcon.cssBlocks.cssChildAfter = false;
    });

    $q.all([cssIconHttp, cssIconBeforeHttp, cssIconAfterHttp, cssChildHttp, cssChildBeforeHttp, cssChildAfterHttp, ]).then(function(){
      $scope.JSONstring = generateCodepenString($scope.selectedIcon);
    });
  }

  var htmlClipboard = new Clipboard('.html.buttonCopy', {
    text: function() {
      return generateHTML($scope.selectedIcon);
    }
  });
  
  htmlClipboard.on('success', function(e) {
    console.log("html", e.trigger);
    angular.element(e.trigger).addClass('copied');
  });
  
  var cssClipboard = new Clipboard('.css.buttonCopy', {
    text: function() {
        return generateCSS($scope.selectedIcon);
    }
  });
  
  cssClipboard.on('success', function(e) {
    console.log("css", e.trigger);
    angular.element(e.trigger).addClass('copied');
  });
}); 

app.controller("HomeController", function($rootScope, $scope, IconsService) {
  $rootScope.viewerOpen = false;
  $scope.icons = IconsService.getIcons();

}); 

app.controller('IconController', function($rootScope, $scope, $filter, $stateParams) {
  $rootScope.viewerOpen = true;
  var icon = $filter('filter')($scope.icons, {classNames: $stateParams.uid}, true)[0];
  
  if (icon.classNames == "C" || 
      icon.classNames == "S" || 
      icon.classNames == "I" || 
      icon.classNames == "O" || 
      icon.classNames == "N" ) {
    $rootScope.letterIconViewerOpen = true;
  } else {
    $rootScope.letterIconViewerOpen = false;
  }

  $scope.openIconPanel(icon);
  
  $scope.handleButtonCloseClick = function(){
    $rootScope.viewerOpen = false;
  }

  $scope.handleButtonCopyMouseLeave = function(e){
    angular.element(document.querySelectorAll(".buttonCopy")).removeClass('copied');
  }
})

app.service("IconsService", function($http, $q){
  var icons = null;
  var url = "http://api.jsoneditoronline.org/v1/docs/995babe3c73846437f5f1d60549987f5/data";
  // var url = "js/cssicon.json";

  // var defer = false;
  this.loadIcons = function(){
    // if(!defer){
      defer = $q.defer();
      $http.get(url).success(function (data) {
        icons = data;
        console.log('load json');
        defer.resolve();
      });
    // }
    return defer.promise;
  }
  this.getIcons = function(){
    return icons;
  }
})

app.directive("iconViewer", function() {
  return {
    replace: 'true',
    templateUrl : 'views/icon-viewer.html',
  };
});
