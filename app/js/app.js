var quantum = angular.module('quantum', 
	['ngFileUpload', 'ngRoute', 'ngFileSaver','ngMaterial', 'ui.bootstrap', 'ui.select','xeditable','angularUtils.directives.dirPagination']);

quantum.constant('moment', moment);

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

	//route for running index
	.when('/dashboard/procedure/running/:procID', {
		templateUrl : './js/components/runIndex/running.html',
		controller  : 'runIndexCtrl'
	})

	 //route for archived index
	.when('/dashboard/procedure/archived/:procID', {
		templateUrl : './js/components/archivedIndex/archived.html',
		controller  : 'archivedIndexCtrl'
	})

		//route for running instance
	.when('/dashboard/procedure/runninginstance/:procID/:revisionID', {
		templateUrl : './js/components/sections/section.html',
		controller  : 'runningInstanceCtrl'
	})

	 //route for archived instance
	.when('/dashboard/procedure/archivedinstance/:procID/:revisionID', {
		templateUrl : './js/components/sections/section.html',
		controller  : 'archivedInstanceCtrl'
	})

	$locationProvider.html5Mode(true);
});

quantum.run(['editableOptions', function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
}]);
