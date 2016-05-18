(function (angular){
    'use strict';
    var app = angular.module('chatApp', ['ngRoute', 'ngAnimate'])
    .config(['$routeProvider', '$locationProvider',
        function ($routeProvider, $locationProvider)
        {
            $routeProvider
        .when('/Book/:bookId', {
                templateUrl: 'book.html',
                controller: 'BookCtrl',
                controllerAs: 'book'
            })
        .when('/Book/:bookId/ch/:chapterId', {
                templateUrl: 'chapter.html',
                controller: 'ChapterCtrl',
                controllerAs: 'chapter'
            });
            
            $locationProvider.html5Mode(true);
        }]);


})(window.angular);