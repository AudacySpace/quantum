quantum.controller('userSettingsCtrl', function($uibModalInstance, userService, mission, $window,$scope,procedureService) {
    var $ctrl = this;

    $ctrl.cRole = {};

    //Service to fetch the current role selected by the user in Quantum
    userService.getCurrentRole(mission.name)
    .then(function(response) {
        if(response.status == 200){
            $ctrl.cRole = response.data;
            $ctrl.role = {
                currentRole : $ctrl.cRole
            };
        }
    });

    //Function to close the user settings modal 
    $ctrl.close = function() {
        $uibModalInstance.dismiss('cancel');
    };

    //Function to get allowed roles assigned to the user
    userService.getAllowedRoles(mission.name)
    .then(function(response) {
        if(response.status == 200){
            $ctrl.roles = response.data;
        }
    });

    //Function to save the change in role by user
    $ctrl.updateRole = function(){
        userService.getRoles()
        .then(function(response) {
            if(response.status == 200) {
                for(var a in response.data.roles){
                    if(response.data.roles[a].name === $ctrl.role.currentRole.name){
                        $ctrl.role.currentRole.callsign = response.data.roles[a].callsign;
                        break;
                    }
                }
                userService.setCurrentRole($ctrl.role.currentRole, mission.name)
                .then(function(response) {
                    if(response.status == 200){
                        var position = "bottom right";
                        var queryId = '#logouttoaster';
                        var delay = 5000;
                        $scope.usermessage = "User's current role updated!";
                        var alertstatus = procedureService.displayAlert($scope.usermessage,position,queryId,delay);
                        if(alertstatus === true){
                            $uibModalInstance.close($ctrl.role.currentRole);
                        }
                        $uibModalInstance.close($ctrl.role.currentRole);
                    }else {
                        var position = "bottom right";
                        var queryId = '#usersettingstoaster';
                        var delay = 5000;
                        $scope.usermessage = "An error occurred.User's role not updated!";
                        var alertstatus = procedureService.displayAlert($scope.usermessage,position,queryId,delay);
                    }
                });
            }else {
                var position = "bottom right";
                var queryId = '#usersettingstoaster';
                var delay = 5000;
                $scope.usermessage = "An error occurred.User's role not updated!";
                var alertstatus = procedureService.displayAlert($scope.usermessage,position,queryId,delay);
            }
        });
    }
});
