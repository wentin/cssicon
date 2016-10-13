var app = angular.module("iconApp", ['ngRoute']);

app.config(function($routeProvider){
  $routeProvider
    .when('/',{
      controller: 'HomeController',
      templateUrl: 'views/home.html',
      resolve:{
        icons: function (IconsService) {
            return IconsService.getIcons().then(function (response) {
                return response.data;
            });
        }
      }
    })
    .otherwise({
        redirectTo: '/'
    });
});

app.controller("HomeController", function($scope, icons) {
  $scope.viewerOpen = false;
  $scope.icons = icons;
}); 

app.service("IconsService", function($http){
  var url = "http://api.jsoneditoronline.org/v1/docs/995babe3c73846437f5f1d60549987f5/data";
  this.getIcons = function(){
    return $http.get(url);
  }
})
