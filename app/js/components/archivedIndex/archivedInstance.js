quantum.controller('archivedInstanceCtrl', function($scope,procedureService,$routeParams,userService,$window,dashboardService,$location) {
    $scope.params = $routeParams;
    $scope.role = userService.userRole;
    $scope.procedure = procedureService.getProcedureName();
    $scope.icons = {
        usersicon: {
            'display':'none',
        }
    }

    viewProcedure();

    function viewProcedure(){
        procedureService.getProcedureList().then(function(response) {
            if(response.status === 200){
                for(var i=0;i<response.data.length;i++){
                    if(response.data[i].procedureID === $scope.params.procID){
                        for(var a=0;a<response.data[i].instances.length;a++){
                            if(parseInt(response.data[i].instances[a].revision) === parseInt($scope.params.revisionID)){
                                $scope.instances = response.data[i].instances[a];
                                $scope.steps = $scope.instances.Steps;

                            }
                        }
                        for(var b=0;b<response.data[i].sections.length;b++){
                            if($scope.steps[b].step === response.data[i].sections[b].Step){
                                $scope.steps[b].Step = response.data[i].sections[b].Step
                                $scope.steps[b].Type = response.data[i].sections[b].Type;
                                $scope.steps[b].Content = response.data[i].sections[b].Content;
                                $scope.steps[b].Role = response.data[i].sections[b].Role;
                                $scope.steps[b].Info = $scope.steps[b].info;
                            }
                        }
                    }
                }

                $scope.steps = procedureService.getProcedureSection($scope.steps,$scope.role.cRole.callsign);
                $scope.steps = procedureService.disableSteps($scope.steps);
            }
        });
    }

    $scope.showPList = function(id,index,headertype){
        $scope.steps = procedureService.showPList(id,index,headertype,$scope.steps);
    }

    $scope.changeColor = function(status,pid,ptitle){
        if(status === "Live"){
            procedureService.setHeaderStyles('none','block','#05aec3f2','#ffffff','none','inline-block',$window.innerWidth);
            procedureService.setProcedureName(pid,ptitle,"Open Procedure");

        }else if(status === "Archived") {
            procedureService.setHeaderStyles('none','block','#000000','#ffffff','none','inline-block',$window.innerWidth);
            procedureService.setProcedureName(pid,ptitle,"AS-Run Archive");

        }
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
            status = true;
        }else if(revNumOp.length === 6 && revNumOp[3] === "archivedinstance"){
            currentRevision = parseInt(revNumOp[5]);
            status = false;
        }else if(revNumOp.length === 2 || revNumOp.length === 5){
            currentRevision = "";
            status = false;
        }
        console.log($scope.params.procID);
        procedureService.setUserStatus(loc,emailaddress,name,$scope.params.procID,currentRevision,status).then(function(response){
            if(response.status === 200){
                dashboardService.changeHeaderWithLocation(loc,$scope.params.procID,$scope.procedure.name,$scope.params.revisionID,$window.innerWidth); 
            }
        },function(error){
            
        });        
    });
});


