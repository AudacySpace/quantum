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

    function getUserEmail() {
        if($window.user.google && $window.user.google.email) {
            return $window.user.google.email;
        } else {
            return "";
        }
    }

    //set mission name for user
    function setMissionForUser(email, mission) {
        return $http({
            url: "/setMissionForUser",
            method: "POST",
            data: {"email" : email, "mission" : mission}
        });
    }
    
	return {
        userRole : userRole,
        getUserName : getUserName,
        getUserEmail : getUserEmail,
        setMissionForUser : setMissionForUser
	}
}]);
