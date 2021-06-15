'use strict';

angular.module('wfp', ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                controller: 'main',
                templateUrl: 'main.html'
            })
            .when('/todo', {
                controller: 'todo',
                templateUrl: 'todo.html'
            });
    })
    .factory('UserData', function() {
        var user = {};
        var isAdmin = false;
        var logged = false;
        
        return {
            Register : function(userdata, isadmin) {
                user = userdata;
                isAdmin = isadmin;
                logged = true;
            },

            User : function() {
                return user;
            },

            IsAdmin : function() {
                return isAdmin;
            },

            IsLogged : function() {
                return logged;
            }
        };
    });
