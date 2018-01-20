quantum.controller('archivedIndexCtrl', function($scope,procedureService,$routeParams) {
    $scope.params = $routeParams;
    showArchivedList();

    function showArchivedList(){
        procedureService.getAllInstances($scope.params.procID).then(function(response){
            if(response.status === 200){
                //openedBy
                //startedAt
                //revision
                //closedBy
                //completedAt

                $scope.archivedlist = response.data.archivedinstances;
                $scope.procedureid = $scope.params.procID;
                $scope.proceduretitle = response.data.title;
            }
        });

    }


});


