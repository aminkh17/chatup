(function ()
{
    'use strict';
    
    angular.module('chatApp')
        .controller('profileCtrl', profileCtrl);

    function profileCtrl($location, $interval, $http, $uibModal, socket) {
        var vm = this;
        vm.checkLogin = checkLogin;
        vm.Chat = Chat;
        
        vm.notifyOnline = notifyOnline;

        function notifyOnline() {
            $http.post('/users/notify', { token: localStorage.token }).success(function (result) {
                vm.onlines = result.onlines;
                vm.me = result.me;
                socket.emit('authenticate', { token: localStorage.token });
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

        function Chat(friend) {
            //start a dialog to start chat.
            var friendModel = {
                _id: friend.id,
                local:{
                    name: friend.name,
                    username: friend.name,
                    email: friend.name
                }
            };
            var modalInstance = $uibModal.open({
                templateUrl: '/chat/' + friend.id,
                controller: 'chatCtrl',
                controllerAs: 'vm',
                size: 'md',
                resolve: {
                    items: function () {
                        return {friend: friendModel, me: vm.me};
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                
            }, function () {
                
            });
            

            //get chat history


        }
 

        checkLogin();
        notifyOnline();
        $interval(function () {
            notifyOnline();
        }, 4000);
    }

})();