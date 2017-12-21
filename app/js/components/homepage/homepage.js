angular.module('quantum')
.component('homepage', {
	transclude: true,
  	scope: true,
   	bindToController: true,
  	templateUrl: "./js/components/homepage/homepage.html",
  	controller: function($window,userService) {
		var $ctrl = this;
	 	$ctrl.name = userService.getUserName();
	 	$ctrl.role = userService.userRole;
	 	$ctrl.logout = function () {
			$window.location.href = '/logout';
    	};
	 }
});


