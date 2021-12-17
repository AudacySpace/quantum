quantum
.factory('userService', ['$http', '$window', function($http, $window) { 

    var userRole = {
        cRole : $window.user.currentRole
    };

    var userList = {
        online: []
    }

    function getUserName() {
        if($window.user.azure_ad && $window.user.azure_ad.name) {
            return $window.user.azure_ad.name;
        } else {
            return "";
        }
    }

    function getUserEmail() {
        if($window.user.azure_ad && $window.user.azure_ad.email) {
            return $window.user.azure_ad.email;
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

    function getCurrentRole(mission) {
        return $http({
            url: "/getCurrentRole",
            method: "GET",
            params: {"email": $window.user.azure_ad.email, "mission" : mission}
        });
    }

    function getAllowedRoles(mission) {
        return $http({
            url: "/getAllowedRoles",
            method: "GET",
            params: {"email": $window.user.azure_ad.email, "mission" : mission}
        });
    }

    function setCurrentRole(role, mission) {
        userRole.cRole = role;
        var email = getUserEmail();
        return $http({
            url: "/setUserRole",
            method: "POST",
            data: {"email" : email, "role" : role, "mission" : mission}
        });
    }

    function getUsers(mission) {
        return $http({
            url: "/getUsers",
            method: "GET",
            params: { "mission" : mission }
        });
    }

    function getRoles() {
        return $http({
                url: "/getRoles",
                method: "GET"
            });
    }

    function setAllowedRoles(user, roles, mission) {
        return $http({
            url: "/setAllowedRoles",
            method: "POST",
            data: {"email" : user.azure_ad.email, "roles" : roles, "mission": mission}
        });
    }

    function getUsersCurrentRole(mission,userList){
        return $http({
            url: "/getUsersCurrentRole",
            method: "GET",
            params: {"mission" : mission,"userList":userList}
        });
    }

    function setOnlineUsers(users){
        userList.online = users;
    }

    function getOnlineUsers(){
        return userList;
    }

    function setActiveUsers(activeUsers){
        var userLen = activeUsers.length;
        var userList = [];
        var currentUserEmail = getUserEmail();
        //for loop to get all the current users
        for(var i=0;i<userLen;i++){
            if(activeUsers[i].status === true && activeUsers[i].email !== currentUserEmail){
                var userdetails = new Object();
                userdetails.name = activeUsers[i].name;
                userdetails.status = activeUsers[i].status;
                userdetails.email = activeUsers[i].email;
                userdetails.role = {};
                userList.push(userdetails);
            }
        }

        return userList;
    }
 
	return {
        userRole : userRole,
        getUserName : getUserName,
        getUserEmail : getUserEmail,
        setMissionForUser : setMissionForUser,
        getCurrentRole : getCurrentRole,
        getAllowedRoles : getAllowedRoles,
        setCurrentRole : setCurrentRole,
        getUsers : getUsers,
        getRoles : getRoles,
        setAllowedRoles : setAllowedRoles,
        setOnlineUsers : setOnlineUsers,
        getOnlineUsers  : getOnlineUsers,
        getUsersCurrentRole : getUsersCurrentRole,
        setActiveUsers : setActiveUsers
	}
}]);
