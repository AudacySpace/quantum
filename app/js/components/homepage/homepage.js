angular.module('quantum')
.component('homepage', {
	transclude: true,
  	scope: true,
   	bindToController: true,
  	templateUrl: "./js/components/homepage/homepage.html",
  	controller: function($window,userService,$location,$routeParams) {

		var $ctrl = this;
	 	$ctrl.name = userService.getUserName();
	 	$ctrl.role = userService.userRole;
	 	$ctrl.logout = function () {
			$window.location.href = '/logout';
    	};

    	$ctrl.$location = $location;
    	$ctrl.$routeParams = $routeParams;
    	$ctrl.procedure = procedureService.getProcedureName();
	 }
});


