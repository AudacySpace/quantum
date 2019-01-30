angular.module('quantum')
.component('rightSidebar', {
    transclude: true,
    scope: true,
    bindToController: true,
    templateUrl: "./js/components/rightSidebar/right_sidebar.html",
    controller: function($window,userService,$mdToast,$location,procedureService,$mdSidenav,$mdDialog) {

        var $ctrl = this;
        $ctrl.name = userService.getUserName();
        $ctrl.role = userService.userRole;
        $ctrl.procedure = procedureService.getProcedureName();
        $ctrl.userList = userService.getOnlineUsers();
        getUserRole();

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


        $ctrl.showUploadModal = function(ev) {
            $mdDialog.show({
                controller: 'uploadCtrl',
                templateUrl: './js/components/procedures/upload.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: true // Only for -xs, -sm breakpoints.
            })
            .then(function(answer) {
            }, function() {
            });
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

