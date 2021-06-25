'use strict';

angular.module('wfp', ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                controller: 'main',
                templateUrl: 'main.html'
            })
            .when('/runs', {
                controller: 'runsController',
                templateUrl: 'runs.html'
            })
            .when('/todo', {
                controller: 'todo',
                templateUrl: 'todo.html'
            })
            .when('/finished', {
                controller: 'finished',
                templateUrl: 'finished.html'
            })
            .when('/programmed', {
                controller: 'programmed',
                templateUrl: 'programmed.html'
            })
            .when('/procs', {
                controller: 'procs',
                templateUrl: 'procs.html'
            });
    })
    
    .run(function($rootScope) {
        
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
