(function (angular){
    'use strict';
    var app = angular.module('chatApp', ['ngRoute', 'ngAnimate'])
    .config(['$routeProvider', '$locationProvider',
        function ($routeProvider, $locationProvider)
        {
            $routeProvider
        .when('/',{
                templateUrl: '/home',
                controller: 'homeCtrl',
                controllerAs: 'vm'
            })
        //.when('/login', {
        //        templateUrl: '/login',
        //        controller: 'loginCtrl',
        //        controllerAs: 'vm'
        //    })
        //.when('/aboutus', {
        //        templateUrl: '/about',
        //        controller: 'aboutCtrl',
        //        controllerAs: 'vm'
        //    })
        //.when('/contactus', {
        //        templateUrl: '/contact',
        //        controller: 'contactCtrl',
        //        controllerAs: 'vm'
        //    })
        //.when('/register', {
        //        templateUrl: '/register',
        //        controller: 'registerCtrl',
        //        controllerAs: 'vm'
        //    })
        //.when('/profile', {
        //        templateUrl: '/profile',
        //        controller: 'profileCtrl',
        //        controllerAs: 'vm'
        //    })
        //.when('/onlines', {
        //        templateUrl: '/onlines',
        //        controller: 'onlinesCtrl',
        //        controllerAs: 'vm'
        //    })
        //.when('/user/:userid/', {
        //        templateUrl: 'chat',
        //        controller: 'chatCtrl',
        //        controllerAs: 'vm'
        //    })
        //.otherwise({ redirectTo: '/' })
            ;
            
            $locationProvider.html5Mode({ enabled: true, requireBase: false });
        }]);


})(window.angular);