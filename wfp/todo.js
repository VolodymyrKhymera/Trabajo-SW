'use strict';

angular.module('wfp')
    .controller('todo', function($scope, $http) {
        
        $scope.tasks = [];

        // Al entrar pedir las tareas de este usuario
        $http.get('/todo').then(function(response) {
            // Y meterlas en el $scope
            $scope.tasks = response.data;
        });
        
        $scope.finalizarProceso = function(task){
            var data = {taskID: task.id, wtid: task.wtid};
            console.log(data);
            $http.post("/todo",data).then(function(response){
                $scope.message = response.data.message;
            });
        }
        
    });
