'use strict';

angular.module('wfp').controller('procs', function ($scope, $http, UserData) {

    $scope.isAdmin = UserData.IsAdmin();
    $scope.tasks = [];

    // Al entrar pedir las tareas de este usuario
    $http.get('/procs').then(function (response) {
        // Y meterlas en el $scope
        $scope.tasks = response.data;
    });

    $scope.finalizarProceso = function (task) {
        var data = { wfid: task.id, user: task.user, wftid: task.wftid };
        console.log(data);
        $http.post("/procs", data).then(function (response) {
            $scope.message = response.data.message;
        });
    }
});