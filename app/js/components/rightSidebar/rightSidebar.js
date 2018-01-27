angular.module('quantum')
.component('rightSidebar', {
    transclude: true,
    scope: true,
    bindToController: true,
    templateUrl: "./js/components/rightSidebar/right_sidebar.html",
    controller: function($window,userService,$mdSidenav,dashboardService) {

        var $ctrl = this;
        $ctrl.name = userService.getUserName();
        $ctrl.role = userService.userRole;

        $ctrl.locks = dashboardService.getLock();
        $ctrl.logout = function () {
            $window.location.href = '/logout';
        };

        $ctrl.openRightNav = function(){
            if($window.innerWidth < 800){
                if ($window.innerWidth < 800){
                    $mdSidenav('right').open();
                } else {
                    $ctrl.locks.lockRight = !$ctrl.locks.lockRight;
                    dashboardService.setRightLock($ctrl.locks.lockRight); 
                }
            }

        }
     }
});

