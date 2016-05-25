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
            var chatList = [];
            angular.forEach(data, function (fr)
            {
                var c = {
                    message: fr.message,
                    sDate: fr.sDate
                };
                if (fr.meId == vm.me._id)
                {
                    c.from = 'me';
                    c.me = vm.me;
                    c.who = vm.you;
                }
                else
                {
                    c.from = 'U';
                    c.me = vm.you;
                    c.who = vm.me;
                }
                c.name = c.me.local.name;

                chatList.push(c);
            });
            vm.chatup = chatList;

        });

        vm.closeChat = function () {
            $uibModalInstance.dismiss('cancel');
        };
        
    }

})();