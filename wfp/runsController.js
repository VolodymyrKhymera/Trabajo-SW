'use strict'

angular.module('wfp').controller('runsController', function($scope, $http) {
  $http.get('/runs')
  .then(function(response) {
    $scope.message="Llega la respuesta del servidor";
    $scope.processes=response.data;
  });

});