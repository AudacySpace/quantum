quantum.controller('runIndexCtrl', function($scope,procedureService,$routeParams,$window,dashboardService,$location,userService) {
    $scope.params = $routeParams;
    $scope.sortType = 'procedurestarted'; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order
    $scope.livelist = [];
    $scope.loadcount = 0;
    $scope.loadstatus = true;
    $scope.procedure = procedureService.getProcedureName();
    showRunningList();

    function showRunningList(){
        if($scope.loadcount === 0){
            $scope.loadstatus = true;
        }
        procedureService.getAllInstances($scope.params.procID).then(function(response){
            if(response.status === 200){
                //openedBy
                //startedAt
                //revision
                $scope.livelist = [];
                for(var i=0;i<response.data.instances.length;i++){
                    if(response.data.instances[i].running === true){
                        $scope.livelist.push(response.data.instances[i]);
                    }
                }
                $scope.procedureid = $scope.params.procID;
                $scope.proceduretitle = response.data.title;
            }
            procedureService.setHeaderStyles('none','block','#05aec3f2','#ffffff','none','inline-block',$window.innerWidth);
            procedureService.setProcedureName($scope.procedureid ,$scope.proceduretitle,"Open Procedure");
            $scope.loadstatus = false;
            $scope.loadcount++;
        });
    }

    $scope.$on('$locationChangeStart', function(evnt, next, current){ 
        var loc = $location.url(); 
        var revNumOp = loc.split("/");
        var emailaddress = userService.getUserEmail();
        var name = userService.getUserName();
        var currentRevision;
        var status;
 
        if(revNumOp.length === 7 && revNumOp[3] === "runninginstance"){
            currentRevision = parseInt(revNumOp[6]);
            status = true
            procedureService.setCurrentViewRevision(currentRevision);
            procedureService.setUserStatus(loc,emailaddress,name,$scope.params.procID,currentRevision,status).then(function(response){
                if(response.status === 200){
                    dashboardService.changeHeaderWithLocation(loc,$scope.params.procID,$scope.procedure.name,'',$window.innerWidth);
                }
            },function(error){
            }); 
        }else {
            dashboardService.changeHeaderWithLocation(loc,$scope.params.procID,$scope.procedure.name,'',$window.innerWidth);
        }
    });
});


