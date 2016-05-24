(function ()
{
    'use strict';
    
    angular.module('chatApp')
        .controller('chatCtrl', chatCtrl);

    function chatCtrl($http, items, $uibModalInstance) {
        var vm = this;
        vm.you = items.friend;
        vm.me = items.me;

        vm.send = function () {

        };

        vm.closeChat = function () {
            $uibModalInstance.dismiss('cancel');
        };
        
    }

})();