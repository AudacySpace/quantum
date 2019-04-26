quantum.controller('archivedInstanceCtrl', function($scope,procedureService,$routeParams,userService,$window,dashboardService,$location,$rootScope,timeService) {
    $scope.params = $routeParams;
    $scope.role = userService.userRole;
    $scope.procedure = procedureService.getProcedureName();
    $scope.icons = {
        usersicon: {
            'display':'none',
        }
    }
    $scope.running = false;
    $rootScope.title = "Procedure "+$scope.procedure.id+" | Quantum";

    //Function to set the display status of live index , archive index and user list based on the url
    dashboardService.setHeaderLocation($location.url,true,true,false);  
    viewProcedure();

    //Function to set Header styles to archived instance mode and get the instance from the procedure list
    function viewProcedure(){
        procedureService.setHeaderStyles('none','block','#000000','#ffffff','none','inline-block',$window.innerWidth);
        procedureService.getProcedureList().then(function(response) {
            if(response.status === 200){
                for(var i=0;i<response.data.length;i++){
                    if(response.data[i].procedureID === $scope.params.procID){
                        for(var a=0;a<response.data[i].instances.length;a++){
                            if(parseInt(response.data[i].instances[a].revision) === parseInt($scope.params.revisionID)){
                                $scope.instances = response.data[i].instances[a];
                                $scope.steps = $scope.instances.Steps;
                                $scope.procedure.name = response.data[i].title;

                            }
                        }
                        var newVersion = response.data[i].versions[parseInt($scope.params.versionID) - 1];
                        for(var b=0;b<newVersion.length;b++){
                            if($scope.steps[b].step === newVersion[b].Step){
                                $scope.steps[b].Step = newVersion[b].Step
                                $scope.steps[b].Type = newVersion[b].Type;
                                $scope.steps[b].Content = newVersion[b].Content;
                                $scope.steps[b].Role = newVersion[b].Role;
                                $scope.steps[b].Info = $scope.steps[b].info;
                                if(newVersion[b].hasOwnProperty("Reference") && newVersion[b].Reference.length > 0){
                                    $scope.steps[b].Reference = newVersion[b].Reference;
                                }
                                if(newVersion[b].hasOwnProperty("Procedures") && newVersion[b].Procedures.length > 0){
                                    $scope.steps[b].Procedures = newVersion[b].Procedures;
                                }
                                
                            }
                        }
                    }
                }
                procedureService.setProcedureName($scope.params.procID, $scope.procedure.name,"AS-Run Archive");
                $scope.steps = procedureService.getValidLinks(response.data,$scope.steps);
                $scope.steps = procedureService.getProcedureSection($scope.steps,$scope.role.cRole.callsign);
                $scope.steps = procedureService.getAllParents($scope.steps);
                $scope.steps = procedureService.disableSteps($scope.steps);
            }
        });
    }

    // Function to show or hide the section or subsection
    $scope.showPList = function(id,index,headertype,type){
        var headingTypeName = procedureService.getStepHeadingName();
        if(type.toUpperCase() === headingTypeName.name.toUpperCase()){
            $scope.steps = procedureService.showstepList(id,$scope.steps);
        }
    }

    //Function to set header styles and add title to the header of the dashboard
    $scope.changeColor = function(status,pid,ptitle){
        if(status === "Live"){
            procedureService.setHeaderStyles('none','block','#05aec3f2','#ffffff','none','inline-block',$window.innerWidth);
            procedureService.setProcedureName(pid,ptitle,"Open Procedure");

        }else if(status === "Archived") {
            procedureService.setHeaderStyles('none','block','#000000','#ffffff','none','inline-block',$window.innerWidth);
            procedureService.setProcedureName(pid,ptitle,"AS-Run Archive");

        }
    }

    //Function to create a new instance of a procedure from the procedure links in a step
    $scope.createNewProc = function(pid){
        $scope.clock = timeService.getTime();
        var starttime = $scope.clock.year+" - "+$scope.clock.utc;
        var emailaddress = userService.getUserEmail();
        var userstatus = true;

        procedureService.saveProcedureInstance(pid,$scope.usernamerole,starttime,$scope.name,emailaddress,userstatus).then(function(response){
            if(response.status === 200){
                procedureService.setCurrentViewRevision(response.data.revision);
                procedureService.setprocRevisions(pid,response.data.revision);
            }
        });
    }

    //locationChangeStart is used to check the change the url when using browser back and forward buttons
    // and change the header based on the url location 
    $scope.$on('$locationChangeStart', function(evnt, next, current){  
        var loc = $location.url();
        var revNumOp = loc.split("/");
        var emailaddress = userService.getUserEmail();
        var name = userService.getUserName();
        var currentRevision;
        var status;

        if(revNumOp.length === 2 || revNumOp.length === 5){
            if(revNumOp.length === 2){
                $rootScope.title = "Quantum";
            }else if(revNumOp.length === 5){
                if(revNumOp.includes("running")){
                    $rootScope.title = "Live Index - "+$scope.procedure.id+" | Quantum";
                }else if(revNumOp.includes("archived")){
                    $rootScope.title = "Archive Index - "+$scope.procedure.id+" | Quantum";
                }
            }
            var proc = procedureService.getCurrentViewRevision();
            currentRevision = proc.value;
            status = false;
            procedureService.setUserStatus(loc,emailaddress,name,$scope.params.procID,currentRevision,status).then(function(response){
                if(response.status === 200){
                    dashboardService.changeHeaderWithLocation(loc,$scope.params.procID,$scope.procedure.name,$scope.params.revisionID,$window.innerWidth); 
                }
            },function(error){}); 
        }
    });
});


