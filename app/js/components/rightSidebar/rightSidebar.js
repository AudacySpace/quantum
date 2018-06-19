angular.module('quantum')
.component('rightSidebar', {
    transclude: true,
    scope: true,
    bindToController: true,
    templateUrl: "./js/components/rightSidebar/right_sidebar.html",
    controller: function($window,userService,$mdToast,$location,procedureService,$mdSidenav) {

        var $ctrl = this;
        $ctrl.name = userService.getUserName();
        $ctrl.role = userService.userRole;
        getUserRole();

        $ctrl.logout = function () {
            var loc = $location.url();
            var temp = loc.split('/');
            if(temp.length === 4 && temp[1] === 'dashboard' && temp[2] === 'procedure'){
                var revNum = procedureService.getCurrentViewRevision();
                var pinTo = 'bottom right';
                var toast = $mdToast.simple()
                                    .textContent('This procedure instance is saved in the Live Index with revision number: '+revNum.value)
                                    .action('OK')
                                    .hideDelay(5000)
                                    .highlightAction(true)
                                    .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
                                    .position(pinTo);
                $mdSidenav('right').close();
                $mdToast.show(toast).then(function(response) {
                    if ( response == 'ok' ) {
                    
                    }
                    $window.location.href = '/logout';
                });
            }else {
                $window.location.href = '/logout';
            }
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

