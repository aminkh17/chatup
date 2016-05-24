(function ()
{
    'use strict';
    
    angular.module('chatApp')
        .controller('profileCtrl', profileCtrl);

    function profileCtrl($location, $interval, $http) {
        var vm = this;
        vm.checkLogin = checkLogin;

        vm.notifyOnline = notifyOnline;

        function notifyOnline() {
            $http.post('/users/notify', { token: localStorage.token }).success(function (result) {
                vm.onlines = result.onlines;
            });
        }

        function checkLogin() {
            $http.post('/users/check', { token: localStorage.token }).success(function (res) {

            })
            .error(function (res) {
                window.localStorage.removeItem('token');
                window.location = "/";
            });
        }


        checkLogin();
        notifyOnline();
    }

})();