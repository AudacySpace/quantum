angular.module('quantum')
.component('homepage', {
	transclude: true,
  	scope: true,
   	bindToController: true,
  	templateUrl: "./js/components/homepage/homepage.html",
  	controller: function($window,userService,procedureService,$mdSidenav,dashboardService) {

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
	}
});


