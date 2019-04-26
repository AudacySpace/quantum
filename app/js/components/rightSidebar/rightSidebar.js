angular.module('quantum')
.component('rightSidebar', {
    transclude: true,
    scope: true,
    bindToController: true,
    templateUrl: "./js/components/rightSidebar/right_sidebar.html",
    controller: function($window,userService,$mdToast,$location,procedureService,$mdSidenav,$mdDialog,dashboardService) {

        var $ctrl = this;
        $ctrl.name = userService.getUserName();
        $ctrl.role = userService.userRole;
        $ctrl.procedure = procedureService.getProcedureName();
        $ctrl.userList = userService.getOnlineUsers();
        $ctrl.location = dashboardService.getHeaderLocation();
        $ctrl.procedure = procedureService.getProcedureName();
        $ctrl.userMenu = false;
        getUserRole();

        //Function to logout from quantum and set the user status to offline
        $ctrl.logout = function () {
            var loc = $location.url();
            var temp = loc.split('/');
            var emailaddress = userService.getUserEmail();
            var revNum = procedureService.getCurrentViewRevision();
            var status = false;
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
                    var currentRevision = parseInt(revNum.value);
                    procedureService.setUserStatus(loc,emailaddress,$ctrl.name,$ctrl.procedure.id,currentRevision,status).then(function(response){
                        if(response.data.status === false){
                            $window.location.href = '/logout';
                        }
                    },function(error){
                    }); 
                });
            }else {
                var currentRevision;
                if(revNum.value !== ""){
                    currentRevision = parseInt(revNum.value);
                }else {
                    currentRevision = "";
                }

                if($ctrl.procedure.id !== ""){
                    procedureService.setUserStatus(loc,emailaddress,$ctrl.name,$ctrl.procedure.id,currentRevision,status).then(function(response){
                        if(response.data.status === false){
                            $window.location.href = '/logout';
                        }
                    },function(error){

                    }); 
                }else {
                    //logout from home page
                    $window.location.href = '/logout';
                } 
            }
        };

        // Function to open the upload procedure modal.
        // All the supporting validation functions exist in uploads js file of procedures folder
        $ctrl.showUploadModal = function(ev) {
            dashboardService.setSidePanelButton({
                "display":"block",
                'outline': 'none',
                'transform': 'translate3d(0, 0, 0)',
                '-webkit-transition': 'all 0.3s ease-in',
                '-moz-transition': 'all 0.3s ease-in',
                '-ms-transition': 'all 0.3s ease-in',
                '-o-transition': 'all 0.3s ease-in',
                'transition': 'all 0.3s ease-in',
                'tranisition-delay':'1s'
            });
            dashboardService.setRightLock(false);
            $mdDialog.show({
                controller: 'uploadCtrl',
                templateUrl: './js/components/procedures/upload.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:false,
                fullscreen: true // Only for -xs, -sm breakpoints.
            })
            .then(function(answer) {
            }, function() {
            });
        };

        // toggle the user list menu
        $ctrl.showUsers = function(){
            $ctrl.userMenu = !$ctrl.userMenu;
        }

        //Function to display user role as VIP if Quantum is viewed in screen sizes less than 768px
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

        //Function to hide the right side bar menu
        $ctrl.hideSideMenu = function(){
            dashboardService.setSidePanelButton({
                "display":"block",
                'outline': 'none',
                'transform': 'translate3d(0, 0, 0)',
                '-webkit-transition': 'all 0.3s ease-in',
                '-moz-transition': 'all 0.3s ease-in',
                '-ms-transition': 'all 0.3s ease-in',
                '-o-transition': 'all 0.3s ease-in',
                'transition': 'all 0.3s ease-in',
                'tranisition-delay':'1s'
            });
            dashboardService.setRightLock(false);
        }

     }
});

