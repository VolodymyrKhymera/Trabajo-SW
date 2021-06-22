'use strict'
angular.module('wfp').controller('runsController', function($scope, $http,$rootScope){
  $http.get('/runs')
  .then(function(response) {
    $scope.processes=response.data;
    
  });

      $scope.startProcess1 = function(){
      ////Funcion a la que llamamos al pulsar los bototones de comenzar un proceso
      //console.log("Hemos llamado la funcion");
      $http.post('/post',{ user: $rootScope.userr.name, selectedProcess: '1' }).then(function(res){
          $scope.message = res.data.message;
      });
    }

    $scope.startProcess2 = function(){
      ////Funcion a la que llamamos al pulsar los bototones de comenzar un proceso
      //console.log("Hemos llamado la funcion");
      $http.post('/post',{ user: $rootScope.userr.name, selectedProcess: '2'}).then(function(res){
          $scope.message = res.data.message;
      });
    }

    $scope.startProcess3 = function(){
      ////Funcion a la que llamamos al pulsar los bototones de comenzar un proceso
      //console.log("Hemos llamado la funcion");
      $http.post('/post',{ user: $rootScope.userr.name, selectedProcess: '3'}).then(function(res){
          $scope.message = res.data.message;
      });
    }
});