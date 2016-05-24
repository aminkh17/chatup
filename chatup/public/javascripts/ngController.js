(function ()
{
    'use strict';
    
    angular.module('chatApp')
        .controller('mainCtrl', mainCtrl);

    function mainCtrl($scope, $routeParams, $location, $interval, $http){
        var vm = this;
        vm.checkLogin = checkLogin;
        vm.logout = logout;
        vm.login = window.localStorage.token;

        vm.activeMenuClass = activeMenuClass;

        function activeMenuClass(nav) {
            if ($location.path() == nav)
                return 'active';
        }

        $interval(function () {
            //checkLogin();
        }, 10000);
        
        function logout() {
            vm.login = undefined;
            window.localStorage.removeItem('token');
            $http.get('/users/logout').success(function (res) {
            });
            window.location = "/";

        }
     
        function checkLogin() {
            $http.post('/users/check', { token: localStorage.token }).success(function (res) {

            })
            .error(function (res) {
                window.localStorage.removeItem('token');

            });
        }
    }

})();