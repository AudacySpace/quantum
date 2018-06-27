quantum.controller('userSettingsCtrl', function($uibModalInstance, userService, mission, $window,$scope,procedureService) {
    var $ctrl = this;

    $ctrl.cRole = {};

    userService.getCurrentRole(mission.name)
    .then(function(response) {
        if(response.status == 200){
            $ctrl.cRole = response.data;
            $ctrl.role = {
                currentRole : $ctrl.cRole
            };
        }
    });

    $ctrl.close = function() {
        $uibModalInstance.dismiss('cancel');
    };

    userService.getAllowedRoles(mission.name)
    .then(function(response) {
        if(response.status == 200){
            $ctrl.roles = response.data;
        }
    });

    $ctrl.updateRole = function(){
        if($ctrl.cRole.callsign == 'MD' && $ctrl.role.currentRole.callsign != 'MD') {
            var position = "bottom right";
            var queryId = '#logouttoaster';
            var delay = 5000;
            $scope.usermessage = 'No mission without the Mission Director. Your role cannot be updated';
            var alertstatus = procedureService.displayAlert($scope.usermessage,position,queryId,delay);
            if(alertstatus === true){
               $uibModalInstance.close($ctrl.cRole);
            }

        } else {
            userService.setCurrentRole($ctrl.role.currentRole, mission.name)
            .then(function(response) {
                if(response.status == 200){
                    var position = "bottom right";
                    var queryId = '#logouttoaster';
                    var delay = 5000;
                    $scope.usermessage = "User's current role updated";
                    var alertstatus = procedureService.displayAlert($scope.usermessage,position,queryId,delay);
                    if(alertstatus === true){
                       $uibModalInstance.close($ctrl.role.currentRole);
                    }
                }
            });
        }
    }
});
