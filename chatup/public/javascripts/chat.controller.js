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
            if (vm.txt == undefined)
                vm.txt = '';
            var msg = { from: 'me', 'me':vm.me, name: vm.me.local.name, 'who': vm.you, message: vm.txt };
            socket.emit('chat', msg);
            if(msg.txt)
                vm.chatup.push(msg);
            vm.txt = '';
        };
        vm.send();
        socket.on('chat', function (data) {
            vm.chatup = data;
        });

        vm.closeChat = function () {
            $uibModalInstance.dismiss('cancel');
        };
        
    }

})();