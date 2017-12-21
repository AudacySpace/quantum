quantum
.factory('userService', ['$http', '$window', function($http, $window) { 
    var userRole = {
        cRole : $window.user.currentRole
    };

    function getUserName() {
        if($window.user.google && $window.user.google.name) {
            return $window.user.google.name;
        } else {
            return "";
        }
    }

    function getCurrentCallSign() {
        if($window.user.currentRole && $window.user.currentRole.callsign) {
            console.log($window.user)
            return $window.user.currentRole.callsign;
        } else {
            return "";
        }
    }
    
	return {
        userRole : userRole,
        getUserName : getUserName,
        getCurrentCallSign : getCurrentCallSign
	}
}]);
