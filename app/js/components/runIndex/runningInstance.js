quantum.controller('runningInstanceCtrl', function($scope,procedureService,$routeParams,userService,timeService,$interval,$window,dashboardService,$location) {
    $scope.params = $routeParams;
    $scope.role = userService.userRole;
    $scope.name = userService.getUserName();
    $scope.usernamerole =  $scope.name +"("+$scope.role.cRole.callsign+")";

    $scope.steps = [];

    $scope.currentRevision = parseInt($scope.params.revisionID);
    $scope.liveInstanceinterval = "";
    
    $scope.procedure = procedureService.getProcedureName();
    viewProcedure();

    $scope.updateLiveInstance = function(){
        procedureService.getLiveInstanceData($scope.params.procID,$scope.currentRevision).then(function(response){
            if(response.status === 200){
                if(response.data.Steps){
                    for(var a=0;a<response.data.Steps.length;a++){
                        $scope.steps[a].Info = response.data.Steps[a].info;
                        if($scope.steps[a].Info !== ""){
                            $scope.steps[a].chkval = true;
                            $scope.steps = procedureService.openNextSteps($scope.steps,a);
                        }
                    }
                    $scope.steps = procedureService.getCompletedSteps($scope.steps);
                    if($scope.steps[$scope.steps.length-1].Info !== ""){
                        procedureService.setProcedureName($scope.params.procID,$scope.procedure.name,"AS-Run Archive");
                        procedureService.setHeaderStyles('none','block','#000000','#ffffff','none','inline-block',$window.innerWidth);
                    }

                }else {

                }
            }
        });
    }

    $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);

    function viewProcedure(){
        procedureService.setProcedureName($scope.params.procID,$scope.procedure.name,"Live");
        procedureService.getProcedureList().then(function(response) {
            if(response.status === 200){
                for(var i=0;i<response.data.length;i++){
                    //if(parseFloat(response.data[i].procedure.id).toFixed(1) === $scope.params.procID){
                    if(response.data[i].procedure.id === $scope.params.procID){
                        for(var a=0;a<response.data[i].instances.length;a++){
                            if(response.data[i].instances[a].revision === parseInt($scope.params.revisionID)){
                                $scope.instances = response.data[i].instances[a];
                                $scope.steps = $scope.instances.Steps;
                            }
                        }
                        for(var b=0;b<response.data[i].procedure.sections.length;b++){
                            if($scope.steps[b].step === response.data[i].procedure.sections[b].Step){
                                $scope.steps[b].Step = response.data[i].procedure.sections[b].Step
                                $scope.steps[b].Type = response.data[i].procedure.sections[b].Type;
                                $scope.steps[b].Content = response.data[i].procedure.sections[b].Content;
                                $scope.steps[b].Role = response.data[i].procedure.sections[b].Role;
                                $scope.steps[b].Reference = response.data[i].procedure.sections[b].Reference;
                                $scope.steps[b].Info = $scope.steps[b].info;
                            }
                        }
                    }
                }
            }
            $scope.steps = procedureService.getProcedureSection($scope.steps,$scope.role.cRole.callsign);
            //completed steps
            $scope.steps = procedureService.getCompletedSteps($scope.steps);

            for(var a=0;a<$scope.steps.length;a++){
                if($scope.steps[a].Info !== ""){
                    $scope.steps = procedureService.openNextSteps($scope.steps,a);
                }
            }
        });
    }

    $scope.showPList = function(id,index,headertype){
        $scope.steps = procedureService.showPList(id,index,headertype,$scope.steps);
    }


    $scope.setInfo = function(index,stepstatus){
        if($scope.liveInstanceinterval) {
            $interval.cancel($scope.liveInstanceinterval);
            $scope.liveInstanceinterval = null;
        }

        var infotime = "";
        var starttime = "";
        var completetime = ""; 
        $scope.clock = timeService.getTime();
        if(index === $scope.steps.length-1){
            if($window.confirm("Do you want to close this procedure?")){
                $scope.steps[index].rowstyle = {
                    rowcolor : {backgroundColor:'#c6ecc6'}
                };
                $scope.steps[index].Info = $scope.clock.utc +" "+$scope.name +"("+$scope.role.cRole.callsign+")";
                infotime = $scope.clock.year+" - "+$scope.clock.utc;
                procedureService.setInfo($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,$scope.currentRevision,infotime,'').then(function(response){
                    if(response.status === 200){
                        completetime = $scope.clock.year+" - "+$scope.clock.utc;
                        procedureService.setInstanceCompleted($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,$scope.currentRevision,completetime).then(function(res){
                            if(res.status === 200){
                                for(var a=0;a<$scope.steps.length;a++){
                                    $scope.steps[a].status = true;
                                }
                                procedureService.setProcedureName($scope.params.procID,res.data.procedure.title,"AS-Run Archive");
                                procedureService.setHeaderStyles('none','block','#000000','#ffffff','none','inline-block',$window.innerWidth);
                            }
                        });
                        if($scope.liveInstanceinterval === null) {
                            $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                        }
                    }
                });
            }else {
                $scope.steps[index].chkval = false;
            }
        }else{
            if(stepstatus === true){
                if($scope.steps[index].contenttype === 'Input' && $scope.steps[index].recordedValue !== undefined){
                    $scope.steps[index].rowstyle = {
                        rowcolor : {backgroundColor:'#c6ecc6'}
                    }
                    $scope.steps[index].Info = $scope.clock.utc +" "+$scope.name +"("+$scope.role.cRole.callsign+")";
                    infotime = $scope.clock.year+" - "+$scope.clock.utc;
                    procedureService.setInfo($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,$scope.currentRevision,infotime,$scope.steps[index].recordedValue).then(function(response){
                        if($scope.liveInstanceinterval === null) {
                            $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                        }
                    });
                    $scope.steps = procedureService.openNextSteps($scope.steps,index);
                }else if($scope.steps[index].contenttype === 'Input' && $scope.steps[index].recordedValue === undefined){
                    alert("Please enter the telemetry value in the field and then check the checkbox");  
                    $scope.steps[index].chkval = false;   
                    $scope.steps[index].rowstyle = {
                        rowcolor : {backgroundColor:'#e9f6fb'}
                    }
                }else if($scope.steps[index].contenttype !== 'Input'){
                    $scope.steps[index].rowstyle = {
                        rowcolor : {backgroundColor:'#c6ecc6'}
                    }
                    $scope.steps[index].recordedValue = "";
                    $scope.steps[index].Info = $scope.clock.utc +" "+$scope.name +"("+$scope.role.cRole.callsign+")";
                    infotime = $scope.clock.year+" - "+$scope.clock.utc;
                    procedureService.setInfo($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,$scope.currentRevision,infotime,$scope.steps[index].recordedValue).then(function(response){
                        if($scope.liveInstanceinterval === null) {
                            $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                        }
                    });
                    $scope.steps = procedureService.openNextSteps($scope.steps,index);
                }
            }else{
                $scope.steps[index].Info = "";
                $scope.steps[index].rowstyle = {
                    rowcolor : {backgroundColor:'#e9f6fb'}
                    }
                if($scope.steps[index].recordedValue) {
                    $scope.steps[index].recordedValue = "";
                }
                infotime = $scope.clock.year+" - "+$scope.clock.utc;
                procedureService.setInfo("",$scope.params.procID,index,$scope.usernamerole,$scope.currentRevision,infotime,$scope.steps[index].recordedValue).then(function(response){
                    if($scope.liveInstanceinterval === null) {
                        $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                    }
                });
            }
        }
    }

    $scope.$on("$destroy", 
        function(event) {
            $interval.cancel($scope.liveInstanceinterval);
        }
    );

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
        dashboardService.changeHeaderWithLocation(loc,$scope.params.procID,$scope.procedure.name,$scope.params.revisionID,$window.innerWidth);     
    });
});


