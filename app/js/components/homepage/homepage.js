angular.module('quantum')
.component('homepage', {
	transclude: true,
  	scope: true,
   	bindToController: true,
  	templateUrl: "./js/components/homepage/homepage.html",
  	controller: function($window,userService,procedureService,$mdSidenav,dashboardService, $uibModal,$location,$mdToast) {

        var email = userService.getUserEmail();
        var mission = {
            name : 'Quantum'
        };

        //add user to the Quantum mission for role assignment
        function setMissionForUser(mname){
            userService.setMissionForUser(email, mname)
            .then(function(response){
                userService.userRole.cRole = response.data.currentRole;
            });
        }

        setMissionForUser(mission.name);

		var $ctrl = this;
	 	$ctrl.name = userService.getUserName();
	 	$ctrl.role = userService.userRole;

        $ctrl.locks = dashboardService.getLock();
    	$ctrl.procedure = procedureService.getProcedureName();
    	$ctrl.header = procedureService.getHeaderStyles();
    	$ctrl.icons = procedureService.getIconStyles();
      
    	$ctrl.setColor = function(){ 
    		procedureService.setHeaderStyles('block','none','#ffffff','#000000','inline-block','none',$window.innerWidth);
            procedureService.setProcedureName('','',"Home");
    	}

        $ctrl.openRightNav = function(){
            if($window.innerWidth < 800){
                if ($window.innerWidth < 800){
                    $mdSidenav('right').open();
                } else {
                    $ctrl.locks.lockRight = !$ctrl.locks.lockRight;
                    dashboardService.setRightLock($ctrl.locks.lockRight); 
                }
            }else {
                $ctrl.locks.lockRight = false;
                dashboardService.setRightLock($ctrl.locks.lockRight); 
            }
        }

        $ctrl.showSettings = function(){
            $uibModal.open({
                templateUrl: './js/components/homepage/userSettings.html',
                controller: 'userSettingsCtrl',
                controllerAs: '$ctrl',
                resolve: {
                    mission: mission
                }
            }).result.then(function(response){
                if(response) {
                    //use the response here;
                }
            },
            function () {
                //use this function for writing any code on modal close;
            });
        }

        $ctrl.showAdminMenu = function() {
            $uibModal.open({
                templateUrl: './js/components/homepage/adminMenu.html',
                controller: 'adminCtrl',
                controllerAs: '$ctrl',
                resolve: {
                    mission: mission
                }
            }).result.then(
            function(response){
                //handle modal close with response
            },
            function () {
                //handle modal dismiss
            });
        }

        $ctrl.logout = function () {
            var loc = $location.url();
            var temp = loc.split('/');
            var emailaddress = userService.getUserEmail();
            var revNum = procedureService.getCurrentViewRevision();
            var status = false;
            if(temp.length === 4 && temp[1] === 'dashboard' && temp[2] === 'procedure'){

                var pinTo = 'bottom right';
                var toast = $mdToast.simple()
                                    .textContent('This procedure instance is saved in the Live Index with revision number: '+revNum.value)
                                    .action('OK')
                                    .parent(document.querySelectorAll('#logouttoaster'))
                                    .hideDelay(5000)
                                    .highlightAction(true)
                                    .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
                                    .position(pinTo);

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
                    $window.location.href = '/logout';
                }
            }
        };
	}
});
