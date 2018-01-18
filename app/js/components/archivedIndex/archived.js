quantum.controller('archivedIndexCtrl', function($scope,procedureService,$routeParams) {
    $scope.params = $routeParams;
    showArchivedList();

    function showArchivedList(){
        console.log($scope.params.procID);
        procedureService.getAllInstances($scope.params.procID).then(function(response){
            if(response.status === 200){
                //openedBy
                //startedAt
                //revision
                //closedBy
                //completedAt

                $scope.archivedlist = response.data.archivedinstances;
            }
        });

    }


});


