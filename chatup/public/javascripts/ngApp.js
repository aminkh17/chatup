﻿(function (angular){
    'use strict';
    
    var serverBaseUrl = 'http://localhost:3000/';

    
    var app = angular.module('chatApp', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'btford.socket-io'])
    .config(['$routeProvider', '$locationProvider', '$httpProvider',
        function ($routeProvider, $locationProvider, $httpProvider)
        {
            $routeProvider
        .when('/',{
                templateUrl: '/home',
                controller: 'homeCtrl',
                controllerAs: 'vm'
            })
        .when('/login', {
                templateUrl: '/users/login',
                controller: 'loginCtrl',
                controllerAs: 'vm'
            })
        .when('/aboutus', {
                templateUrl: '/about',
                controller: 'aboutCtrl',
                controllerAs: 'vm'
            })
        .when('/contactus', {
                templateUrl: '/contact',
                controller: 'contactCtrl',
                controllerAs: 'vm'
            })
        .when('/register', {
                templateUrl: '/register',
                controller: 'registerCtrl',
                controllerAs: 'vm'
            })
        .when('/profile', {
                templateUrl: '/dashboard',
                controller: 'profileCtrl',
                controllerAs: 'vm'
            })
        .when('/onlines', {
                templateUrl: '/onlines',
                controller: 'onlinesCtrl',
                controllerAs: 'vm'
            })
        .when('/user/:userid/', {
                templateUrl: 'chat',
                controller: 'chatCtrl',
                controllerAs: 'vm'
            })
        .otherwise({ redirectTo: '/' });
            
            $locationProvider.html5Mode({ enabled: true, requireBase: false });
            

            //$httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage)
            //    {
            //        return {
            //            'request': function (config)
            //            {
            //                config.headers = config.headers || {};
            //                if ($localStorage.token)
            //                {
            //                    config.headers.Authorization = 'Bearer ' + $localStorage.token;
            //                }
            //                return config;
            //            },
            //            'responseError': function (response)
            //            {
            //                if (response.status === 401 || response.status === 403)
            //                {
            //                    $location.path('/signin');
            //                }
            //                return $q.reject(response);
            //            }
            //        };
            //    }]);

        }]);


    app
    .factory('socket', function (socketFactory)
    {
        var myIoSocket = io.connect(serverBaseUrl);
        
        var socket = socketFactory({
            ioSocket: myIoSocket
        });
        
        return socket;
    })
    //.factory('socket', function (socketFactory, Auth)
    //{
        
    //    var socket, ioSocket, isAuthenticated,
    //        self = {
    //            getAuthenticated: function ()
    //            {
    //                return isAuthenticated;
    //            }
    //        };
    //    // by default the socket property is null and is not authenticated
    //    self.socket = socket;
    //    // initializer function to connect the socket for the first time after logging in to the app
    //    self.initialize = function ()
    //    {
    //        console.log('initializing socket');
            
    //        isAuthenticated = false;
            
    //        // socket.io now auto-configures its connection when we omit a connection url
    //        ioSocket = io('', {
    //            path: '/socket.io-client'
    //        });
            
    //        //call btford angular-socket-io library factory to connect to server at this point
    //        self.socket = socket = socketFactory({
    //            ioSocket: ioSocket
    //        });
            
    //        //---------------------
    //        //these listeners will only be applied once when socket.initialize is called
    //        //they will be triggered each time the socket connects/re-connects (e.g. when logging out and logging in again)
    //        //----------------------
    //        socket.on('authenticated', function ()
    //        {
    //            isAuthenticated = true;
    //            console.log('socket is jwt authenticated');
    //        });
    //        //---------------------
    //        socket.on('connect', function ()
    //        {
    //            //send the jwt
    //            socket.emit('authenticate', { token: Auth.getToken() });
    //        });
    //    };
        
    //    return self;

    //})
    .factory('socketAuth', function (socket, $q)
    {
        return {
            getAuthenticatedAsPromise: function ()
            {
                
                var listenForAuthentication = function ()
                {
                    console.log('listening for socket authentication');
                    var listenDeferred = $q.defer();
                    var authCallback = function ()
                    {
                        console.log('listening for socket authentication - done');
                        listenDeferred.resolve(true);
                    };
                    socket.socket.on('authenticated', authCallback);
                    return listenDeferred.promise;
                };
                
                if (!socket.socket)
                {
                    socket.initialize();
                    return listenForAuthentication();
                } else
                {
                    if (socket.getAuthenticated())
                    {
                        return $q.when(true);
                    } else
                    {
                        return listenForAuthentication();
                    }
                }
            }
        };
    });

})(window.angular);