(function ()
{
    'use strict';
    
    angular.module('chatApp')
        .controller('chatCtrl', chatCtrl);

    function chatCtrl($http, items, $uibModalInstance, socket) {
        var vm = this;
        vm.you = items.friend;
        vm.me = items.me;

        vm.send = function () {
            socket.emit('chat', { from: vm.me, to: vm.friend, msg: vm.txt });
        };

        vm.closeChat = function () {
            $uibModalInstance.dismiss('cancel');
        };
        
    }

})();