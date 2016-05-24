(function ()
{
    'use strict';
    
    angular.module('chatApp')
        .controller('chatCtrl', chatCtrl);

    function chatCtrl($http, items, $uibModalInstance, socket) {
        var vm = this;
        vm.you = items.friend;
        vm.me = items.me;

        vm.chatup = [];

        vm.send = function () {
            var msg = { from: 'me', 'me':vm.me, name: vm.me.name, 'who': vm.friend, message: vm.txt };
            socket.emit('chat', msg);
            vm.chatup.push(msg);
            vm.txt = '';
        };

        socket.on('chat', function (data) {
            console.log(data);
        });

        vm.closeChat = function () {
            $uibModalInstance.dismiss('cancel');
        };
        
    }

})();