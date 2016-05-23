(function ()
{
    'use strict';
    
    angular.module('chatApp')
        .controller('loginCtrl', loginCtrl);

    function loginCtrl($http){
        var vm = this;
        vm.active = 'login'; 
        
        vm.regUser = {};

        vm.doLogin = doLogin;
        vm.doRegister = doRegister;

        function doLogin(){
            var obj = {};
            $http.post('/users/login', obj).success(function (result)
            {

            });
        }

        function doRegister(){
            if (vm.regUser.password != vm.regUser.passwordConfirm)
            {
                return err('Password and confirmation password do not match.');
            }
            $http.post('/users/register', vm.regUser)
            .success(function (result){
                vm.active = 'login';
            })
            .error(function (result){
                err(result);
            });
        }

        function err(msg){
            vm.message = msg;
        }
            
    }


})();