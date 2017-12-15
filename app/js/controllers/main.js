quantum
.controller('mainController', function ($scope,$window) {
   	$scope.logout = function () {
        $window.location.href = '/logout';
    };
});