(function ()
{
    'use strict';
    
    angular.module('chatApp')
        .controller('loginCtrl', loginCtrl);

    function loginCtrl($http){
        var vm = this;
        vm.active = 'login'; 
        
        vm.regUser = {};
        vm.user = {};

        vm.doLogin = doLogin;
        vm.doRegister = doRegister;

        function doLogin(){
            $http.post('/users/login', vm.user).success(function (result)
            {
                console.log(result);
                $http.get('/users/check').success(function (res){
                    console.log(res);
                })
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
                vm.user.username = vm.regUser.username;
                vm.user.password = vm.regUser.password;
                vm.regUser.name = '';
                vm.regUser.username = '';
                vm.regUser.email = '';
                vm.regUser.password = '';
                vm.regUser.passwordConfirm = '';
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