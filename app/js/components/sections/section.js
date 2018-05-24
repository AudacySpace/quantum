quantum.controller('sectionCtrl', function($scope, $routeParams,procedureService,userService,timeService,$interval,$window,dashboardService,$location) {
	$scope.params = $routeParams;
	$scope.role = userService.userRole;
    $scope.name = userService.getUserName();
    $scope.usernamerole =  $scope.name +"("+$scope.role.cRole.callsign+")";

    $scope.steps = [];
    $scope.inputStepValues = [];

    $scope.tempValues = [];

    $scope.currentRevision = procedureService.getCurrentViewRevision();
    $scope.liveInstanceinterval = "";
    $scope.procedure = procedureService.getProcedureName();
	viewProcedure();

    $scope.updateLiveInstance = function(){
        procedureService.getLiveInstanceData($scope.params.procID,$scope.currentRevision.value).then(function(response){
            if(response.status === 200){
                for(var a=0;a<response.data.Steps.length;a++){
                    $scope.steps[a].Info = response.data.Steps[a].info;
                    if(response.data.Steps[a].hasOwnProperty("recordedValue")){
                       $scope.steps[a].recordedValue = response.data.Steps[a].recordedValue; 
                    }
                    if(response.data.Steps[a].hasOwnProperty("comments")){
                        $scope.steps[a].comments = response.data.Steps[a].comments; 
                    }
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
            }
        });
    }

    $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);

	function viewProcedure(){
        $scope.inputStepValues = [];
        $scope.tempValues = [];
        procedureService.setHeaderStyles('none','block','#05aec3f2','#ffffff','none','inline-block',$window.innerWidth);
        procedureService.getProcedureList().then(function(response) {
            for(var i=0;i<response.data.length;i++){
                if(response.data[i].procedure.id === $scope.params.procID){
                   	$scope.steps = response.data[i].procedure.sections;
                    $scope.procedure.name = response.data[i].procedure.title;
				}
			}

            for(var a=0;a<$scope.steps.length;a++){
                $scope.inputStepValues.push({
                    snum:$scope.steps[a].Step,
                    ivalue:""
                });

                $scope.tempValues.push({
                    snum:$scope.steps[a].Step,
                    ivalue:"",
                    status:false
                });
            }
            $scope.steps = procedureService.getProcedureSection($scope.steps,$scope.role.cRole.callsign); 
            procedureService.setProcedureName($scope.params.procID,$scope.procedure.name,"Live");
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
                procedureService.setInfo($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,$scope.currentRevision.value,infotime,'').then(function(response){
                    if(response.status === 200){
                        completetime = $scope.clock.year+" - "+$scope.clock.utc;
                        procedureService.setInstanceCompleted($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,$scope.currentRevision.value,completetime).then(function(res){
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
                if($scope.steps[index].contenttype === 'Input' && $scope.inputStepValues[index].ivalue.length > 0){  
                    $scope.steps[index].rowstyle = {
                        rowcolor : {backgroundColor:'#c6ecc6'}
                    }
                    $scope.steps[index].recordedValue = $scope.inputStepValues[index].ivalue;
                    $scope.tempValues[index].ivalue = "";
                    $scope.steps[index].buttonStatus = "";
                    $scope.steps[index].Info = $scope.clock.utc +" "+$scope.name +"("+$scope.role.cRole.callsign+")";
                    infotime = $scope.clock.year+" - "+$scope.clock.utc;

                    procedureService.setInfo($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,$scope.currentRevision.value,infotime,$scope.inputStepValues[index].ivalue,$scope.steps[index].contenttype,$scope.steps[index].comments).then(function(response){
                        if($scope.liveInstanceinterval === null) {
                            $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                        }
                    });
                    $scope.steps = procedureService.openNextSteps($scope.steps,index);

                }else if($scope.steps[index].contenttype === 'Input' && $scope.inputStepValues[index].ivalue.length === 0){  
                    alert("Please enter the telemetry value in the field,click Set and then mark the checkbox"); 
                    $scope.steps[index].chkval = false;  
                    $scope.steps[index].rowstyle = {
                        rowcolor : {backgroundColor:'#e9f6fb'}
                    }                      
                }else if($scope.steps[index].contenttype !== 'Input'){
                    $scope.steps[index].rowstyle = {
                        rowcolor : {backgroundColor:'#c6ecc6'}
                    }
                    $scope.steps[index].recordedValue = "";
                    $scope.steps[index].buttonStatus = "";
                    $scope.steps[index].Info = $scope.clock.utc +" "+$scope.name +"("+$scope.role.cRole.callsign+")";
                    infotime = $scope.clock.year+" - "+$scope.clock.utc;

                    procedureService.setInfo($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,$scope.currentRevision.value,infotime,$scope.inputStepValues[index].ivalue,$scope.steps[index].contenttype,$scope.steps[index].comments).then(function(response){   
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

                $scope.inputStepValues[index].ivalue = "";
                if($scope.steps[index].recordedValue) {
                    $scope.steps[index].recordedValue = "";
                }
                $scope.steps[index].comments = "";
                infotime = $scope.clock.year+" - "+$scope.clock.utc;
                procedureService.setInfo("",$scope.params.procID,index,$scope.usernamerole,$scope.currentRevision.value,infotime,$scope.inputStepValues[index].ivalue,$scope.steps[index].contenttype,$scope.steps[index].comments).then(function(response){
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

    $scope.updateInputValue = function(index,value){
        if(value.length > 0){
            $scope.inputStepValues[index].ivalue = value;
            $scope.steps[index].buttonStatus = {backgroundColor:'#07D1EA',color:'#fff',outline: 0};
        }else {
            $window.alert("Please enter value and then click Set");
        }
    }

    $scope.whenTyping = function(index){
        $scope.steps[index].buttonStatus = {outline: 0};
    }

});


