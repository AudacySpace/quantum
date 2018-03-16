angular.module('quantum')
.component('rightSidebar', {
    transclude: true,
    scope: true,
    bindToController: true,
    templateUrl: "./js/components/rightSidebar/right_sidebar.html",
    controller: function($window,userService) {

        var $ctrl = this;
        $ctrl.name = userService.getUserName();
        $ctrl.role = userService.userRole;
        getUserRole();

        $ctrl.logout = function () {
            $window.location.href = '/logout';
        };

        function getUserRole() {
            if ($window.innerWidth <= 768){
                $ctrl.role = {
                    cRole : {
                        "name": "Observer",
                        "callsign": "VIP"
                    }
                };
            } else {
                $ctrl.role = userService.userRole;
            }
        }

     }
});

