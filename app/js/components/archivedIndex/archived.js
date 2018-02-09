quantum.controller('archivedIndexCtrl', function($scope,procedureService,$routeParams) {
    $scope.params = $routeParams;
    $scope.sortType     = 'procedurecompleted'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    showArchivedList();

    function showArchivedList(){
        procedureService.getAllInstances($scope.params.procID).then(function(response){
            if(response.status === 200){
                //openedBy
                //startedAt
                //revision
                //closedBy
                //completedAt

                $scope.archivedlist = [];
                for(var i=0;i<response.data.instances.length;i++){
                    if(response.data.instances[i].running === false){
                        $scope.archivedlist.push(response.data.instances[i]);
                    }
                }
                $scope.procedureid = $scope.params.procID;
                $scope.proceduretitle = response.data.title;
            }
        });

    }


});


