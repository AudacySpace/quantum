quantum.controller('userSettingsCtrl', function($uibModalInstance, userService, mission, $window) {
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
            $window.alert("No mission without the Mission Director. Your role cannot be updated");
            $uibModalInstance.close($ctrl.cRole);
        } else {
            userService.setCurrentRole($ctrl.role.currentRole, mission.name)
            .then(function(response) {
                if(response.status == 200){
                    $window.alert("User's current role updated");
                    $uibModalInstance.close($ctrl.role.currentRole);
                }
            });
        }
    }
});
