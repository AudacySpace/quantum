quantum.controller('archivedIndexCtrl', function($scope,procedureService,$routeParams,$window,dashboardService,$location,userService) {
    $scope.params = $routeParams;
    $scope.sortType     = 'procedurecompleted'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.archivedlist = [];
    $scope.loadcount = 0;
    $scope.loadstatus = true;
    showArchivedList();

    function showArchivedList(){
        if($scope.loadcount === 0){
            $scope.loadstatus = true;
        }
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
            procedureService.setHeaderStyles('none','block','#000000','#ffffff','none','inline-block',$window.innerWidth);
            procedureService.setProcedureName( $scope.procedureid, $scope.proceduretitle,"AS-Run Archive");
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
        if(revNumOp.length === 4){
            currentRevision = parseInt(revNumOp[3]);
            status = true;
        }else if(revNumOp.length === 6 && revNumOp[3] === "runninginstance"){
            currentRevision = parseInt(revNumOp[5]);
            status = true
            procedureService.setCurrentViewRevision(currentRevision);
        }else if(revNumOp.length === 6 && revNumOp[3] === "archivedinstance"){
            currentRevision = parseInt(revNumOp[5]);
            status = false;
            procedureService.setCurrentViewRevision(currentRevision);
        }
        else if(revNumOp.length === 2 || revNumOp.length === 5){
            currentRevision = "";
            status = false;
        }

        procedureService.setUserStatus(loc,emailaddress,name,$scope.procedureid,currentRevision,status).then(function(response){
            if(response.status === 200){
                dashboardService.changeHeaderWithLocation(loc,$scope.params.procID,$scope.proceduretitle,'',$window.innerWidth);
            } 
        },function(error){
        });  
    });

    $scope.changeColor = function(status,pid,ptitle){
        if(status === "Live"){
            procedureService.setHeaderStyles('none','block','#05aec3f2','#ffffff','none','inline-block',$window.innerWidth);
            procedureService.setProcedureName(pid,ptitle,"Open Procedure");

        }else if(status === "Archived") {
            procedureService.setHeaderStyles('none','block','#000000','#ffffff','none','inline-block',$window.innerWidth);
            procedureService.setProcedureName(pid,ptitle,"AS-Run Archive");

        }
    }
});


