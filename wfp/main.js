'use strict';

angular.module('wfp')
    .controller('main', function($scope, $http, UserData) {

        $scope.IsLogged = UserData.IsLogged();

        if ($scope.IsLogged) {
            // for the main menu
            $scope.user = UserData.User();
            $scope.isAdmin = UserData.IsAdmin();
        } else {
            // Only for the login form
            $scope.username = '';
            $scope.password = '';
            $scope.errormsg = '';

            $scope.formSubmit = function() {
                var data = { user: $scope.username, passwd: $scope.password };

                $http.post("/login", data).then(function(response) {
                    if ('errormsg' in response.data) {
                        // Usuario rechazado
                        $scope.errormsg = "Usuario rechazado";
                    } else {
                        // Usuario aceptado
                        UserData.Register(
                            response.data.user,
                            response.data.isAdmin
                        );
                        // Actualizar el $scope
                        $scope.errormsg = '';
                        $scope.IsLogged = true;
                        $scope.user = response.data.user;
                        $scope.isAdmin = response.data.isAdmin;
                    }
                }, function(response) {
                    // Http Error
                    $scope.errormsg = 'Fallo de autentificación';
                });
            };
        }
    });
