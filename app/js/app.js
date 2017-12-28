var quantum = angular.module('quantum', ['ngFileUpload', 'ngRoute']);

// routes
quantum.config(function($routeProvider, $locationProvider) {
	$routeProvider

	// route for the dashboard page with procedures list
	.when('/dashboard', {
		templateUrl : './js/components/procedures/procedure.html',
		controller  : 'procedureCtrl'
	})

	//route for the individual procedure with steps
	.when('/dashboard/procedure/:procID', {
		templateUrl : './js/components/sections/section.html',
		controller  : 'sectionCtrl'
	})

	$locationProvider.html5Mode(true);
});
