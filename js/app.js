
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
    .state('animate', {
      url: '/animate',
      templateUrl: 'views/animate.html',
      controller: 'AnimateController',
      controllerAs: 'animate',
      resolve:{
        load: function (IconsService) {
          return IconsService.loadIcons();
        }
      }
    })
    .state('animate.viewer', {
      url: '/:uid1/to/:uid2',
      templateUrl: 'views/animate-viewer.html',
      controller: 'AnimateViewerController'
    });
});

app.controller("MainController", function($scope, $rootScope) {
  
  $scope.handleButtonCloseClick = function(){
    $rootScope.viewerOpen = false;
  }

  $scope.handleButtonCopyMouseLeave = function(e){
    angular.element(document.querySelectorAll(".buttonCopy")).removeClass('copied');
  }
}); 

app.controller("HomeController", function($http, $rootScope, $scope, IconsService, $q) {
  $rootScope.viewerOpen = false;
  $scope.icons = IconsService.getIcons();

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
    var title = icon.name;
    
    var data = {
      title                 : "CSS ICON: " + title,
      description           : title + " icon created with pure CSS, CSS ICON created via http://cssicon.space/",
      tags                  : ["CSS", "ICON", "CSSICON"],
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
  
})

app.controller("AnimateController", function($rootScope, $scope, IconsService, $state) {
  $rootScope.viewerOpen = false;
  $scope.icons = IconsService.getIcons();
  $scope.animateIconA = null;
  $scope.animateIconB = null;
  $scope.animateIconALock = false;
  $scope.animateIconBLock = false;
  $scope.animateIconToAssign = "A";
  assignAnimateIcon = function(icon) {
    if($scope.animateIconToAssign == "A") {
      if ($scope.animateIconA == null) {
        $scope.animateIconA = icon;
        if(!$scope.animateIconBLock) {
          $scope.animateIconToAssign = "B";
        }
      } else if ( icon.classNames != $scope.animateIconA.classNames) {
        $scope.animateIconA = icon;
        if(!$scope.animateIconBLock) {
          $scope.animateIconToAssign = "B";
        }
      }
    } else if($scope.animateIconToAssign == "B") {
      if ($scope.animateIconB == null) {
        $scope.animateIconB = icon;
        if(!$scope.animateIconALock) {
          $scope.animateIconToAssign = "A";
        }
      } else if ( icon.classNames != $scope.animateIconB.classNames) {
        $scope.animateIconB = icon;
        if(!$scope.animateIconALock) {
          $scope.animateIconToAssign = "A";
        }
      }
    }
  }
  $scope.iconAnimateClick = function(icon){
    assignAnimateIcon(icon);
    if ($scope.animateIconA && $scope.animateIconB) {
      $state.transitionTo('animate.viewer', {uid1: $scope.animateIconA.classNames, uid2: $scope.animateIconB.classNames});
    }
  }
});

app.controller('AnimateViewerController', function($rootScope, $scope, $filter, $stateParams) {
  $rootScope.viewerOpen = true;
  $scope.$parent.animateIconA = $scope.animateViewerIconA = $filter('filter')($scope.icons, {classNames: $stateParams.uid1}, true)[0];
  $scope.$parent.animateIconB = $scope.animateViewerIconB = $filter('filter')($scope.icons, {classNames: $stateParams.uid2}, true)[0];

  $scope.buttonPlayClick = function(){
    angular.element(document.querySelectorAll('.iconViewer .icon')).toggleClass($scope.animateViewerIconA.classNames).toggleClass($scope.animateViewerIconB.classNames);
    angular.element(document.querySelectorAll('.animateDirection')).toggleClass('AtoB').toggleClass('BtoA');
  }

  $scope.iconLockClick = function(lockedIcon){
    if(lockedIcon == "A") {
      $scope.$parent.animateIconALock = !$scope.$parent.animateIconALock;
      $scope.$parent.animateIconBLock = false;
      $scope.$parent.animateIconToAssign = "B";
    } else if(lockedIcon == "B") {
      $scope.$parent.animateIconBLock = !$scope.$parent.animateIconBLock;
      $scope.$parent.animateIconALock = false;
      $scope.$parent.animateIconToAssign = "A";
    }
  }

  $scope.animateGenerateHTML = function(icon1, icon2){
    if (icon1.htmlChildMarkup || icon2.htmlChildMarkup) {
      childHTML = "<i></i>";
    } else {
      childHTML = '';
    }
    var HTML = '<div class="' + icon1.classNames + ' icon">' + childHTML + '</div>'
    return HTML;
  }

  $scope.animateGenerateCSS = function(){
    var CSS = "/* get the styles for both icon*/\n@import \"http://cssicon.space/css/icons.css\";\n\n.icon, .icon:before, .icon:after, .icon i, .icon i:before, .icon i:after { \n  transition: all 0.4s ease;\n}\n/* this is merely a rough demo to showcase the potential of CSS ICON on animation, more crafted animation can go from here */";
    return CSS;
  }

  $scope.animateGenerateJS = function(icon1, icon2){
    var JS = "$('.icon').click(function(){\n  $(this)\n    .toggleClass('"+icon1.classNames+"')\n    .toggleClass('"+icon2.classNames+"');\n})";
    return JS;
  }
  var animateGenerateCodepenString = function(icon1, icon2){
    var html = $scope.animateGenerateHTML(icon1, icon2);
    var css = $scope.animateGenerateCSS();
    var js = '/* click on the icon to see the animation */\n' + $scope.animateGenerateJS(icon1, icon2);

    var title = icon1.classNames + " to " + icon2.classNames;
    
    var data = {
      title                 : "CSS ICON animate: " + title,
      description           : title + " icon animation created with pure CSS, CSS ICON animation created via http://cssicon.space/",
      tags                  : ["CSS", "ICON", "CSSICON", "animate", "animation"],
      editors               : "111", 
      layout                : "left", // top | left | right
      html                  : html,
      css                   : css,
      js                    : js,
      js_external           : "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js"
    }
    return JSON.stringify(data).replace(/"/g, "&​quot;").replace(/'/g, "&apos;");
  }
  $scope.animateJSONstring = animateGenerateCodepenString($scope.animateViewerIconA, $scope.animateViewerIconB);

  var htmlClipboard = new Clipboard('.html.buttonCopy', {
    text: function() {
      return $scope.animateGenerateHTML($scope.animateViewerIconA, $scope.animateViewerIconB);
    }
  });
  
  htmlClipboard.on('success', function(e) {
    console.log("html", e.trigger);
    angular.element(e.trigger).addClass('copied');
  });
  
  var cssClipboard = new Clipboard('.css.buttonCopy', {
    text: function() {
      return $scope.animateGenerateCSS();
    }
  });
  
  cssClipboard.on('success', function(e) {
    console.log("css", e.trigger);
    angular.element(e.trigger).addClass('copied');
  });

  var jsClipboard = new Clipboard('.js.buttonCopy', {
    text: function() {
      return $scope.animateGenerateJS($scope.animateViewerIconA, $scope.animateViewerIconB);
    }
  });
  
  jsClipboard.on('success', function(e) {
    console.log("js", e.trigger);
    angular.element(e.trigger).addClass('copied');
  });
})

app.service("IconsService", function($http, $q){
  var icons = null;
  // var url = "http://api.jsoneditoronline.org/v1/docs/995babe3c73846437f5f1d60549987f5/data";
  var url = "js/cssicon.json";

  var defer = false;
  this.loadIcons = function(){
    if(!defer){
      defer = $q.defer();
      $http.get(url).success(function (data) {
        icons = data;
        console.log('load json');
        defer.resolve();
      });
    }
    return defer.promise;
  }
  this.getIcons = function(){
    return icons;
  }
})

