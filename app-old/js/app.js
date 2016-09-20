var app = angular.module("resourcesApp", []);
app.controller("MainCtrl", ['$scope','$http', function($scope, $http) { 
	$http.get('js/cssicon.json').success (function(data){ 
		$scope.icons = data; 
	}); 
}] ); 
