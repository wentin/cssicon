var app = angular.module("iconApp", ['ngRoute']);

app.config(function($routeProvider){
  $routeProvider
    .when('/',{
      controller: 'HomeController',
      templateUrl: 'views/home.html',
      resolve:{
        'MyDataService': function(DataService){
          return DataService.promise;
        }
      }
    })
    .otherwise({
        redirectTo: '/'
    });
});

app.service('DataService', function($http) {
  var myData = null;
  
  var url = "http://api.jsoneditoronline.org/v1/docs/995babe3c73846437f5f1d60549987f5/data";
  var promise = $http.get(url).success(function (data) {
    myData = data;
  });

  return {
    promise: promise,
    getIcons: function() {
      return myData;
    }
  }
});

app.controller("HomeController", function($scope, DataService) {
  $scope.viewerOpen = false;
  console.log("HomeController init");
  $scope.icons = DataService.getIcons();
}); 
