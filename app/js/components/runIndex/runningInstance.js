quantum.controller('runningInstanceCtrl', function($scope,procedureService,$routeParams,userService,timeService,$interval,$window,dashboardService,$location,$uibModal) {
    $scope.params = $routeParams;
    $scope.role = userService.userRole;
    $scope.name = userService.getUserName();
    $scope.usernamerole =  $scope.name +"("+$scope.role.cRole.callsign+")";

    $scope.steps = [];
    $scope.inputStepValues = [];

    $scope.tempValues = [];
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

                }else {

                }
            }
        });

        var curLocation = $location.url();
        console.log(curLocation);
    }

    $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);

    function viewProcedure(){
        $scope.inputStepValues = [];
        $scope.tempValues = [];
        procedureService.setProcedureName($scope.params.procID,$scope.procedure.name,"Live");
        procedureService.getProcedureList().then(function(response) {
            if(response.status === 200){
                for(var i=0;i<response.data.length;i++){
                    if(response.data[i].procedureID === $scope.params.procID){
                        for(var a=0;a<response.data[i].instances.length;a++){
                            if(response.data[i].instances[a].revision === parseInt($scope.params.revisionID)){
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
                                $scope.steps[b].Reference = response.data[i].sections[b].Reference;
                                $scope.steps[b].Info = $scope.steps[b].info;

                                $scope.inputStepValues.push({
                                    snum:$scope.steps[b].Step,
                                    ivalue:""
                                });

                                $scope.tempValues.push({
                                    snum:$scope.steps[b].Step,
                                    ivalue:"",
                                    comments:""
                                });
                            }
                        }
                    }
                }
            }
            $scope.steps = procedureService.getProcedureSection($scope.steps,$scope.role.cRole.callsign);
            $scope.steps = procedureService.openFirstStep($scope.steps,$scope.role.cRole.callsign);
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
            // call uibModal here
            var messages = {
                confirmMsg: 'Do you want to close this procedure?'
            }
            confirmProcedureUpdate(messages,index);
        }else{
            if(stepstatus === true){
                if($scope.steps[index].contenttype === 'Input' && $scope.inputStepValues[index].ivalue.length > 0){  
                    $scope.steps[index].rowstyle = {
                        rowcolor : {
                            'background':'-moz-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                            'background':'-o-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                            'background':'linear-gradient(to left, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                            'background-size': '200% 100%',
                            'background-position':'right bottom',
                            'margin-left':'10px',
                            'transition':'all 0.3s linear'
                        }
                    }
                    $scope.steps[index].recordedValue = $scope.inputStepValues[index].ivalue;
                    $scope.tempValues[index].ivalue = "";
                    $scope.steps[index].buttonStatus = "";
                    $scope.steps[index].Info = $scope.clock.utc +" "+$scope.name +"("+$scope.role.cRole.callsign+")";
                    infotime = $scope.clock.year+" - "+$scope.clock.utc;
                    procedureService.setInfo($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,$scope.currentRevision,infotime,$scope.inputStepValues[index].ivalue,$scope.steps[index].contenttype).then(function(response){  
                        if($scope.liveInstanceinterval === null) {
                            $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                        }
                         // get main header or sub header for the step
                        //check for all the rest of the steps in that section if completed
                            //if completed mark header as done
                            //if not ,then dont mark as not done

                        //check if all the steps in the section are completed and set section header color and timestamp
                        var mainheaderIndex = ""; // to store section header index
                        var nextmainheaderIndex = ""; // to store next section header index
                        var subheaderIndex = ""; // to store sub section header index
                        var nextsubheaderIndex = ""; // to store next sub section header index

                        //check if there exists a sub header
                        subheaderIndex = procedureService.getSubSectionHeaderIndex($scope.steps,index);
                        nextsubheaderIndex = procedureService.getNextSubSectionHeaderIndex($scope.steps,subheaderIndex,index);

                        //If no subheader check for main header
                        if(subheaderIndex === -1){
                            mainheaderIndex = procedureService.getSectionHeaderIndex($scope.steps,index);
                            nextmainheaderIndex = procedureService.getNextSectionHeaderIndex($scope.steps,mainheaderIndex,index);
                        }

                        if(subheaderIndex && subheaderIndex !== -1){
                            var finalCount1 = 0;
                            var finalCountnew1 = 0;
                            if(nextsubheaderIndex === -1 ){
                                for(var s=subheaderIndex+1;s<$scope.steps.length;s++){
                                    if($scope.steps[s].headertype === "listitem" && $scope.steps[s].index !== $scope.steps[index].index && $scope.steps[s].headervalue === $scope.steps[index].headervalue){
                                        nextsubheaderIndex = s;
                                        break;
                                    }
                                }
                            }
                            for(var k=subheaderIndex+1;k<nextsubheaderIndex;k++){
                                if($scope.steps[k].Info && $scope.steps[k].Info.length > 0){
                                    finalCount1++;
                                }
                            }

                            // to add main header info 
                            mainheaderIndex = procedureService.getSectionHeaderIndex($scope.steps,index);
                            nextmainheaderIndex = procedureService.getNextSectionHeaderIndex($scope.steps,mainheaderIndex,index);

                            var mIndex = mainheaderIndex + 1;
                            for(var k=mIndex;k<nextmainheaderIndex;k++){
                                if($scope.steps[k].Info && $scope.steps[k].Info.length > 0){
                                    finalCountnew1++;
                                }
                            }

                            if(finalCount1 === (nextsubheaderIndex - subheaderIndex - 1) && nextmainheaderIndex !== 1 && finalCountnew1 !== (nextmainheaderIndex - mainheaderIndex - 1)){
                                if($scope.liveInstanceinterval) {
                                    $interval.cancel($scope.liveInstanceinterval);
                                    $scope.liveInstanceinterval = null;
                                }
                                $scope.steps[subheaderIndex].rowstyle = {
                                    rowcolor : {
                                        'background':'-moz-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                        'background':'-o-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                        'background':'linear-gradient(to left, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                        'background-size': '200% 100%',
                                        'background-position':'right bottom',
                                        'margin-left':'10px',
                                        'transition':'all 0.3s linear'
                                    }
                                } 
                                $scope.steps[subheaderIndex].Info = $scope.clock.utc;

                                procedureService.setInfo($scope.steps[subheaderIndex].Info,$scope.params.procID,subheaderIndex,$scope.usernamerole,$scope.currentRevision,infotime,$scope.inputStepValues[subheaderIndex].ivalue,$scope.steps[subheaderIndex].contenttype).then(function(response){   
                                    finalCountnew1 = 0;
                                    for(var k=mIndex;k<nextmainheaderIndex;k++){
                                        if($scope.steps[k].Info && $scope.steps[k].Info.length > 0){
                                            finalCountnew1++;
                                        }
                                    }

                                    if(finalCountnew1 === (nextmainheaderIndex - mainheaderIndex - 1)){
                                        $scope.steps[mainheaderIndex].rowstyle = {
                                            rowcolor : {
                                                'background':'-moz-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                                'background':'-o-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                                'background':'linear-gradient(to left, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                                'background-size': '200% 100%',
                                                'background-position':'right bottom',
                                                'margin-left':'10px',
                                                'transition':'all 0.3s linear'
                                            }
                                        } 
                                        $scope.steps[mainheaderIndex].Info = $scope.clock.utc;
                                        procedureService.setInfo($scope.steps[mainheaderIndex].Info,$scope.params.procID,mainheaderIndex,$scope.usernamerole,$scope.currentRevision,infotime,$scope.inputStepValues[mainheaderIndex].ivalue,$scope.steps[mainheaderIndex].contenttype).then(function(response){   
                                            if($scope.liveInstanceinterval === null) {
                                                $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                                            }
                                        });
                                    }else {
                                        if($scope.liveInstanceinterval === null) {
                                            $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                                        }
                                    }
                                });

                            }else if(finalCount1 === (nextsubheaderIndex - subheaderIndex - 1) && nextmainheaderIndex !== 1 && finalCountnew1 === (nextmainheaderIndex - mainheaderIndex - 1)){
                                if($scope.liveInstanceinterval) {
                                    $interval.cancel($scope.liveInstanceinterval);
                                    $scope.liveInstanceinterval = null;
                                }
                                $scope.steps[subheaderIndex].rowstyle = {
                                    rowcolor : {
                                        'background':'-moz-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                        'background':'-o-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                        'background':'linear-gradient(to left, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                        'background-size': '200% 100%',
                                        'background-position':'right bottom',
                                        'margin-left':'10px',
                                        'transition':'all 0.3s linear'
                                    }
                                } 
                                $scope.steps[mainheaderIndex].rowstyle = {
                                    rowcolor : {
                                        'background':'-moz-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                        'background':'-o-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                        'background':'linear-gradient(to left, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                        'background-size': '200% 100%',
                                        'background-position':'right bottom',
                                        'margin-left':'10px',
                                        'transition':'all 0.3s linear'
                                    }
                                } 
                                $scope.steps[subheaderIndex].Info = $scope.clock.utc;
                                $scope.steps[mainheaderIndex].Info = $scope.clock.utc;
                                procedureService.setInfo($scope.steps[subheaderIndex].Info,$scope.params.procID,subheaderIndex,$scope.usernamerole,$scope.currentRevision,infotime,$scope.inputStepValues[subheaderIndex].ivalue,$scope.steps[subheaderIndex].contenttype).then(function(response){   
                                    procedureService.setInfo($scope.steps[mainheaderIndex].Info,$scope.params.procID,mainheaderIndex,$scope.usernamerole,$scope.currentRevision,infotime,$scope.inputStepValues[mainheaderIndex].ivalue,$scope.steps[mainheaderIndex].contenttype).then(function(response){   
                                        if($scope.liveInstanceinterval === null) {
                                            $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                                        }
                                    });
                                });
                            }
                        }else if(mainheaderIndex >= 0){
                            var finalCount2 = 0;
                            for(var k=mainheaderIndex+1;k<nextmainheaderIndex;k++){
                                if($scope.steps[k].Info && $scope.steps[k].Info.length > 0){
                                    finalCount2++;
                                }
                            }
                            if( nextmainheaderIndex !== 1 && finalCount2 === (nextmainheaderIndex - mainheaderIndex - 1) ){
                                if($scope.liveInstanceinterval) {
                                    $interval.cancel($scope.liveInstanceinterval);
                                    $scope.liveInstanceinterval = null;
                                }
                                $scope.steps[mainheaderIndex].rowstyle = {
                                    rowcolor : {
                                        'background':'-moz-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                        'background':'-o-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                        'background':'linear-gradient(to left, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                        'background-size': '200% 100%',
                                        'background-position':'right bottom',
                                        'margin-left':'10px',
                                        'transition':'all 0.3s linear'
                                    }
                                } 
                                $scope.steps[mainheaderIndex].Info = $scope.clock.utc;
                                procedureService.setInfo($scope.steps[mainheaderIndex].Info,$scope.params.procID,mainheaderIndex,$scope.usernamerole,$scope.currentRevision,infotime,$scope.inputStepValues[mainheaderIndex].ivalue,$scope.steps[mainheaderIndex].contenttype).then(function(response){   
                                    if($scope.liveInstanceinterval === null) {
                                        $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                                    }
                                });
                            }
                        }   
                    });
                    $scope.steps = procedureService.openNextSteps($scope.steps,index);
                }else if($scope.steps[index].contenttype === 'Input' && $scope.inputStepValues[index].ivalue.length === 0){  
                    var position = "right";
                    var queryId = "#objectid-"+index;
                    var delay = false;
                    $scope.usermessage = 'Please enter the telemetry value in the field,click Set and then mark the checkbox.';
                    var alertstatus = procedureService.displayAlert($scope.usermessage,position,queryId,delay);   
                    $scope.steps[index].chkval = false;   
                    $scope.steps[index].rowstyle = {
                        rowcolor : {backgroundColor:'#e9f6fb'}
                    }
                    if($scope.liveInstanceinterval === null) {
                        $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                    }
                }else if($scope.steps[index].contenttype !== 'Input'){
                    $scope.steps[index].rowstyle = {
                        rowcolor : {
                            'background':'-moz-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                            'background':'-o-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                            'background':'linear-gradient(to left, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                            'background-size': '200% 100%',
                            'background-position':'right bottom',
                            'margin-left':'10px',
                            'transition':'all 0.3s linear'
                        }
                    }
                    $scope.steps[index].recordedValue = "";
                    $scope.steps[index].Info = $scope.clock.utc +" "+$scope.name +"("+$scope.role.cRole.callsign+")";
                    infotime = $scope.clock.year+" - "+$scope.clock.utc;
                    procedureService.setInfo($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,$scope.currentRevision,infotime,$scope.inputStepValues[index].ivalue,$scope.steps[index].contenttype).then(function(response){  
                        if($scope.liveInstanceinterval === null) {
                            $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                        }

                        //check if all the steps in the section are completed and set section header color and timestamp
                        var mainheaderIndex = ""; // to store section header index
                        var nextmainheaderIndex = ""; // to store next section header index
                        var subheaderIndex = ""; // to store sub section header index
                        var nextsubheaderIndex = ""; // to store next sub section header index

                        //check if there exists a sub header
                        subheaderIndex = procedureService.getSubSectionHeaderIndex($scope.steps,index);
                        nextsubheaderIndex = procedureService.getNextSubSectionHeaderIndex($scope.steps,subheaderIndex,index);

                        //If no subheader check for main header
                        if(subheaderIndex === -1){
                            mainheaderIndex = procedureService.getSectionHeaderIndex($scope.steps,index);
                            nextmainheaderIndex = procedureService.getNextSectionHeaderIndex($scope.steps,mainheaderIndex,index);
                        }

                        if(subheaderIndex && subheaderIndex !== -1){
                            var finalCount1 = 0;
                            var finalCountnew1 = 0;

                            if(nextsubheaderIndex === -1){
                                for(var s=subheaderIndex+1;s<$scope.steps.length;s++){
                                    if($scope.steps[s].headertype === "listitem" && $scope.steps[s].index !== $scope.steps[index].index && $scope.steps[s].headervalue === $scope.steps[index].headervalue){
                                        nextsubheaderIndex = s;
                                        break;
                                    }
                                }
                            }
                            for(var k=subheaderIndex+1;k<nextsubheaderIndex;k++){
                                if($scope.steps[k].Info && $scope.steps[k].Info.length > 0){
                                    finalCount1++;
                                }
                            }


                            // to add main header info 
                            mainheaderIndex = procedureService.getSectionHeaderIndex($scope.steps,index);
                            nextmainheaderIndex = procedureService.getNextSectionHeaderIndex($scope.steps,mainheaderIndex,index);

                            var mIndex = mainheaderIndex + 1;
                            for(var k=mIndex;k<nextmainheaderIndex;k++){
                                if($scope.steps[k].Info && $scope.steps[k].Info.length > 0){
                                    finalCountnew1++;
                                }
                            }
                            if(finalCount1 === (nextsubheaderIndex - subheaderIndex - 1) && nextmainheaderIndex !== 1 && finalCountnew1 !== (nextmainheaderIndex - mainheaderIndex - 1)){
                                if($scope.liveInstanceinterval) {
                                    $interval.cancel($scope.liveInstanceinterval);
                                    $scope.liveInstanceinterval = null;
                                }
                                $scope.steps[subheaderIndex].rowstyle = {
                                    rowcolor : {
                                        'background':'-moz-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                        'background':'-o-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                        'background':'linear-gradient(to left, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                        'background-size': '200% 100%',
                                        'background-position':'right bottom',
                                        'margin-left':'10px',
                                        'transition':'all 0.3s linear'
                                    }
                                } 
                                $scope.steps[subheaderIndex].Info = $scope.clock.utc;
                                procedureService.setInfo($scope.steps[subheaderIndex].Info,$scope.params.procID,subheaderIndex,$scope.usernamerole,$scope.currentRevision,infotime,$scope.inputStepValues[subheaderIndex].ivalue,$scope.steps[subheaderIndex].contenttype).then(function(response){   
                                    finalCountnew1 = 0;
                                    for(var k=mIndex;k<nextmainheaderIndex;k++){
                                        if($scope.steps[k].Info && $scope.steps[k].Info.length > 0){
                                            finalCountnew1++;
                                        }
                                    }
                                    if(finalCountnew1 === (nextmainheaderIndex - mainheaderIndex - 1)){
                                        $scope.steps[mainheaderIndex].rowstyle = {
                                            rowcolor : {
                                                'background':'-moz-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                                'background':'-o-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                                'background':'linear-gradient(to left, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                                'background-size': '200% 100%',
                                                'background-position':'right bottom',
                                                'margin-left':'10px',
                                                'transition':'all 0.3s linear'
                                            }
                                        } 
                                        $scope.steps[mainheaderIndex].Info = $scope.clock.utc;
                                        procedureService.setInfo($scope.steps[mainheaderIndex].Info,$scope.params.procID,mainheaderIndex,$scope.usernamerole,$scope.currentRevision,infotime,$scope.inputStepValues[mainheaderIndex].ivalue,$scope.steps[mainheaderIndex].contenttype).then(function(response){   
                                            if($scope.liveInstanceinterval === null) {
                                                $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                                            }
                                        });
                                    }else {
                                        if($scope.liveInstanceinterval === null) {
                                            $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                                        }
                                    }

                                });
                            }else if(finalCount1 === (nextsubheaderIndex - subheaderIndex - 1) && nextmainheaderIndex !== 1 && finalCountnew1 === (nextmainheaderIndex - mainheaderIndex - 1)){
                                if($scope.liveInstanceinterval) {
                                    $interval.cancel($scope.liveInstanceinterval);
                                    $scope.liveInstanceinterval = null;
                                }
                                $scope.steps[subheaderIndex].rowstyle = {
                                    rowcolor : {
                                        'background':'-moz-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                        'background':'-o-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                        'background':'linear-gradient(to left, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                        'background-size': '200% 100%',
                                        'background-position':'right bottom',
                                        'margin-left':'10px',
                                        'transition':'all 0.3s linear'
                                    }
                                } 
                                $scope.steps[subheaderIndex].Info = $scope.clock.utc;
                                $scope.steps[mainheaderIndex].rowstyle = {
                                    rowcolor : {
                                        'background':'-moz-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                        'background':'-o-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                        'background':'linear-gradient(to left, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                        'background-size': '200% 100%',
                                        'background-position':'right bottom',
                                        'margin-left':'10px',
                                        'transition':'all 0.3s linear'
                                    }
                                } 
                                $scope.steps[mainheaderIndex].Info = $scope.clock.utc;
                                procedureService.setInfo($scope.steps[subheaderIndex].Info,$scope.params.procID,subheaderIndex,$scope.usernamerole,$scope.currentRevision,infotime,$scope.inputStepValues[subheaderIndex].ivalue,$scope.steps[subheaderIndex].contenttype).then(function(response){   
                                    procedureService.setInfo($scope.steps[mainheaderIndex].Info,$scope.params.procID,mainheaderIndex,$scope.usernamerole,$scope.currentRevision,infotime,$scope.inputStepValues[mainheaderIndex].ivalue,$scope.steps[mainheaderIndex].contenttype).then(function(response){   
                                        if($scope.liveInstanceinterval === null) {
                                            $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                                        }
                                    });
                                });
                            }
                        }else if(mainheaderIndex >= 0){
                            var finalCount2 = 0;
                            for(var k=mainheaderIndex+1;k<nextmainheaderIndex;k++){
                                if($scope.steps[k].Info && $scope.steps[k].Info.length > 0){
                                    finalCount2++;
                                }
                            }
  
                            if(nextmainheaderIndex !== -1 && finalCount2 === (nextmainheaderIndex - mainheaderIndex - 1) ){
                                if($scope.liveInstanceinterval) {
                                    $interval.cancel($scope.liveInstanceinterval);
                                    $scope.liveInstanceinterval = null;
                                }
                                $scope.steps[mainheaderIndex].rowstyle = {
                                    rowcolor : {
                                        'background':'-moz-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                        'background':'-o-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                        'background':'linear-gradient(to left, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                        'background-size': '200% 100%',
                                        'background-position':'right bottom',
                                        'margin-left':'10px',
                                        'transition':'all 0.3s linear'
                                    }
                                } 
                                $scope.steps[mainheaderIndex].Info = $scope.clock.utc;
                                procedureService.setInfo($scope.steps[mainheaderIndex].Info,$scope.params.procID,mainheaderIndex,$scope.usernamerole,$scope.currentRevision,infotime,$scope.inputStepValues[mainheaderIndex].ivalue,$scope.steps[mainheaderIndex].contenttype).then(function(response){   
                                    if($scope.liveInstanceinterval === null) {
                                        $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                                    }
                                });
                            }
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
                $scope.steps[index].buttonStatus = "";
                infotime = $scope.clock.year+" - "+$scope.clock.utc;
                procedureService.setInfo("",$scope.params.procID,index,$scope.usernamerole,$scope.currentRevision,infotime,$scope.inputStepValues[index].ivalue,$scope.steps[index].contenttype).then(function(response){   
                    if($scope.liveInstanceinterval === null) {
                        $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                    }

                    //check if all the steps in the section are completed and set section header color and timestamp
                    var mainheaderIndex = "";
                    var nextmainheaderIndex = "";
                    var subheaderIndex = "";
                    var nextsubheaderIndex = "";

                    //check if there exists a sub header
                    subheaderIndex = procedureService.getSubSectionHeaderIndex($scope.steps,index);
                    nextsubheaderIndex = procedureService.getNextSubSectionHeaderIndex($scope.steps,subheaderIndex,index);

                    //If no subheader check for main header
                    if(subheaderIndex === -1){
                        mainheaderIndex = procedureService.getSectionHeaderIndex($scope.steps,index);
                        nextmainheaderIndex = procedureService.getNextSectionHeaderIndex($scope.steps,mainheaderIndex,index);
                    }

                    if(subheaderIndex && subheaderIndex !== -1){
                        var finalCount1 = 0;
                        var finalCountnew1 = 0;
                        if(nextsubheaderIndex === -1){
                            for(var s=subheaderIndex+1;s<$scope.steps.length;s++){
                                if($scope.steps[s].headertype === "listitem" && $scope.steps[s].index !== $scope.steps[index].index && $scope.steps[s].headervalue === $scope.steps[index].headervalue){
                                    nextsubheaderIndex = s;
                                    break;
                                }
                            }
                        }
                        for(var k=subheaderIndex+1;k<nextsubheaderIndex;k++){
                            if($scope.steps[k].Info && $scope.steps[k].Info.length > 0){
                                finalCount1++;
                            }
                        }

                        // to remove main header info if exits
                        mainheaderIndex = procedureService.getSectionHeaderIndex($scope.steps,index);
                        nextmainheaderIndex = procedureService.getNextSectionHeaderIndex($scope.steps,mainheaderIndex,index);

                        for(var k=mainheaderIndex+1;k<nextmainheaderIndex;k++){
                            if($scope.steps[k].Info && $scope.steps[k].Info.length > 0){
                                finalCountnew1++;
                            }
                        }

                       
                        if($scope.steps[mainheaderIndex].Info.length === 0 && finalCount1 !== (nextsubheaderIndex - subheaderIndex - 1)){
                            if($scope.liveInstanceinterval) {
                                $interval.cancel($scope.liveInstanceinterval);
                                $scope.liveInstanceinterval = null;
                            }
                            $scope.steps[subheaderIndex].rowstyle = {
                                rowcolor : {backgroundColor:'#e9f6fb'}
                            } 
                            $scope.steps[subheaderIndex].Info = "";
                            procedureService.setInfo("",$scope.params.procID,subheaderIndex,$scope.usernamerole,$scope.currentRevision,infotime,$scope.inputStepValues[subheaderIndex].ivalue,$scope.steps[subheaderIndex].contenttype).then(function(response){   
                                if($scope.liveInstanceinterval === null) {
                                    $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                                }
                            });
                        }else if($scope.steps[mainheaderIndex].Info.length > 0 && finalCountnew1 !== (nextmainheaderIndex - mainheaderIndex - 1)){
                            if($scope.liveInstanceinterval) {
                                $interval.cancel($scope.liveInstanceinterval);
                                $scope.liveInstanceinterval = null;
                            }
                            $scope.steps[mainheaderIndex].rowstyle = {
                                rowcolor : {backgroundColor:'#e9f6fb'}
                            };
                            $scope.steps[subheaderIndex].rowstyle = {
                                rowcolor : {backgroundColor:'#e9f6fb'}
                            }
                            $scope.steps[subheaderIndex].Info = "";
                            $scope.steps[mainheaderIndex].Info = "";
                            procedureService.setInfo("",$scope.params.procID,subheaderIndex,$scope.usernamerole,$scope.currentRevision,infotime,$scope.inputStepValues[subheaderIndex].ivalue,$scope.steps[subheaderIndex].contenttype).then(function(response){   
                                procedureService.setInfo("",$scope.params.procID,mainheaderIndex,$scope.usernamerole,$scope.currentRevision,infotime,$scope.inputStepValues[mainheaderIndex].ivalue,$scope.steps[mainheaderIndex].contenttype).then(function(response){   
                                if($scope.liveInstanceinterval === null) {
                                    $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                                }
                            });
                            });

                        }else {
                            if($scope.liveInstanceinterval) {
                                $interval.cancel($scope.liveInstanceinterval);
                                $scope.liveInstanceinterval = null;
                            }
                            $scope.steps[mainheaderIndex].rowstyle = {
                                rowcolor : {backgroundColor:'#e9f6fb'}
                            };
                            $scope.steps[subheaderIndex].rowstyle = {
                                rowcolor : {backgroundColor:'#e9f6fb'}
                            }

                            $scope.steps[subheaderIndex].Info = "";
                            procedureService.setInfo("",$scope.params.procID,subheaderIndex,$scope.usernamerole,$scope.currentRevision,infotime,$scope.inputStepValues[subheaderIndex].ivalue,$scope.steps[subheaderIndex].contenttype).then(function(response){   
                                procedureService.setInfo("",$scope.params.procID,mainheaderIndex,$scope.usernamerole,$scope.currentRevision,infotime,$scope.inputStepValues[mainheaderIndex].ivalue,$scope.steps[mainheaderIndex].contenttype).then(function(response){   
                                    if($scope.liveInstanceinterval === null) {
                                        $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                                    }
                                });
                            });
                        }
                    }else if(mainheaderIndex >=0){
                        var finalCount2 = 0;
                        for(var k=mainheaderIndex+1;k<nextmainheaderIndex;k++){
                            if($scope.steps[k].Info){
                                finalCount2++;
                            }
                        }

                        if(finalCount2 === (nextmainheaderIndex - mainheaderIndex - 1) ){
                            if($scope.liveInstanceinterval) {
                                $interval.cancel($scope.liveInstanceinterval);
                                $scope.liveInstanceinterval = null;
                            }
                            $scope.steps[mainheaderIndex].rowstyle = {
                                rowcolor : {
                                    'background':'-moz-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                    'background':'-o-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                    'background':'linear-gradient(to left, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                    'background-size': '200% 100%',
                                    'background-position':'right bottom',
                                    'margin-left':'10px',
                                    'transition':'all 0.3s linear'
                                }
                            } 
                            $scope.steps[mainheaderIndex].Info = $scope.clock.utc;
                            procedureService.setInfo($scope.steps[mainheaderIndex].Info,$scope.params.procID,mainheaderIndex,$scope.usernamerole,$scope.currentRevision,infotime,$scope.inputStepValues[mainheaderIndex].ivalue,$scope.steps[mainheaderIndex].contenttype).then(function(response){   
                                if($scope.liveInstanceinterval === null) {
                                    $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                                }
                            });
                        }else {
                            if($scope.liveInstanceinterval) {
                                $interval.cancel($scope.liveInstanceinterval);
                                $scope.liveInstanceinterval = null;
                            }
                            $scope.steps[mainheaderIndex].rowstyle = {
                                rowcolor : {backgroundColor:'#e9f6fb'}
                            } 
                            $scope.steps[mainheaderIndex].Info = "";
                            procedureService.setInfo("",$scope.params.procID,mainheaderIndex,$scope.usernamerole,$scope.currentRevision,infotime,$scope.inputStepValues[mainheaderIndex].ivalue,$scope.steps[mainheaderIndex].contenttype).then(function(response){   
                                if($scope.liveInstanceinterval === null) {
                                    $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                                }
                            });
                        }
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
            var position = "left";
            var queryId = "#object-"+index;
            var delay = false;
            $scope.usermessage = 'Please enter value and then click Set';
            var alertstatus = procedureService.displayAlert($scope.usermessage,position,queryId,delay);
        }

    }

    $scope.whenTyping = function(index){
        $scope.steps[index].buttonStatus = {outline: 0};
    }

    $scope.whenTypingComments = function(index){
        $scope.tempValues[index].comments = $scope.steps[index].comments; 
    }

    $scope.saveComments = function(comments,index){
        $scope.clock = timeService.getTime();
        var commentTime = $scope.clock.year+" - "+$scope.clock.utc;
        if($scope.liveInstanceinterval) {
            $interval.cancel($scope.liveInstanceinterval);
            $scope.liveInstanceinterval = null;
        }
        procedureService.setComments($scope.params.procID,$scope.params.revisionID,index,comments,commentTime).then(function(response){
            $scope.steps[index].comments = comments;
            $scope.tempValues[index].comments = "";
            if($scope.liveInstanceinterval === null) {
                $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
            }
        });
    }

    function confirmProcedureUpdate(messages,index){
        //Ask user to update or not
        $uibModal.open({
            templateUrl: './js/components/procedures/userConfirmation.html',
            controller: 'confirmCtrl',
            controllerAs: '$ctrl',
            resolve: {
                usermessage: messages,
                filedata:{}
            },
            backdrop: 'static',
            keyboard: false
        }).result.then(function(response,status){
            //handle modal close with response
               $scope.steps[index].rowstyle = {
                    rowcolor : {
                        'background':'-moz-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                        'background':'-o-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                        'background':'linear-gradient(to left, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                        'background-size': '200% 100%',
                        'background-position':'right bottom',
                        'margin-left':'10px',
                        'transition':'all 0.3s linear'
                    }
                };
                $scope.steps[index].Info = $scope.clock.utc +" "+$scope.name +"("+$scope.role.cRole.callsign+")";
                infotime = $scope.clock.year+" - "+$scope.clock.utc;
                procedureService.setInfo($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,$scope.currentRevision,infotime,$scope.inputStepValues[index].ivalue,$scope.steps[index].contenttype).then(function(response){
                    if(response.status === 200){
                        completetime = $scope.clock.year+" - "+$scope.clock.utc;

                        //check if all the steps in the section are completed and set section header color and timestamp
                        var mainheaderIndex = ""; // to store section header index
                        var nextmainheaderIndex = ""; // to store next section header index
                        var subheaderIndex = ""; // to store sub section header index
                        var nextsubheaderIndex = ""; // to store next sub section header index

                        //check if there exists a sub header 
                        subheaderIndex = procedureService.getSubSectionHeaderIndex($scope.steps,index);

                        //If no subheader check for main header
                        if(subheaderIndex === -1){
                            mainheaderIndex = procedureService.getSectionHeaderIndex($scope.steps,index);
                        }

                        if(subheaderIndex && subheaderIndex !== -1){
                            var finalCount1 = 0; // to store count of steps completed in a subsection
                            var finalCountnew1 = 0; // to store count of steps completed in a section

                            //loop through steps and get the count
                            for(var k=subheaderIndex+1;k<index;k++){
                                if($scope.steps[k].Info && $scope.steps[k].Info.length > 0){
                                    finalCount1++;
                                }
                            }

                            // to set main header info
                            mainheaderIndex = procedureService.getSectionHeaderIndex($scope.steps,index);

                            if(finalCount1 === (index - subheaderIndex - 1)){
                                if($scope.liveInstanceinterval) {
                                    $interval.cancel($scope.liveInstanceinterval);
                                    $scope.liveInstanceinterval = null;
                                }
                                $scope.steps[subheaderIndex].rowstyle = {
                                    rowcolor : {
                                        'background':'-moz-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                        'background':'-o-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                        'background':'linear-gradient(to left, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                        'background-size': '200% 100%',
                                        'background-position':'right bottom',
                                        'margin-left':'10px',
                                        'transition':'all 0.3s linear'
                                    }
                                } 

                                $scope.steps[subheaderIndex].Info = $scope.clock.utc;
                                procedureService.setInfo($scope.steps[subheaderIndex].Info,$scope.params.procID,subheaderIndex,$scope.usernamerole,$scope.currentRevision,infotime,$scope.inputStepValues[subheaderIndex].ivalue,$scope.steps[subheaderIndex].contenttype).then(function(response){   
                                    finalCountnew1 = 0;
                                    for(var k=mainheaderIndex+1;k<index;k++){
                                        if($scope.steps[k].Info && $scope.steps[k].Info.length > 0){
                                            finalCountnew1++;
                                        }
                                    }
                                    if(finalCountnew1 === (index - mainheaderIndex - 1)){
                                        $scope.steps[mainheaderIndex].rowstyle = {
                                            rowcolor : {
                                                'background':'-moz-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                                'background':'-o-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                                'background':'linear-gradient(to left, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                                'background-size': '200% 100%',
                                                'background-position':'right bottom',
                                                'margin-left':'10px',
                                                'transition':'all 0.3s linear'
                                            }
                                        } 

                                        $scope.steps[mainheaderIndex].Info = $scope.clock.utc;

                                        procedureService.setInfo($scope.steps[mainheaderIndex].Info,$scope.params.procID,mainheaderIndex,$scope.usernamerole,$scope.currentRevision,infotime,$scope.inputStepValues[mainheaderIndex].ivalue,$scope.steps[mainheaderIndex].contenttype).then(function(response){   
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
                                        });
                                    }else {
                                        procedureService.setInstanceCompleted($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,$scope.currentRevision,completetime).then(function(res){
                                                if(res.status === 200){
                                                    for(var a=0;a<$scope.steps.length;a++){
                                                        $scope.steps[a].status = true;
                                                    }
                                                    procedureService.setProcedureName($scope.params.procID,res.data.procedure.title,"AS-Run Archive");
                                                    procedureService.setHeaderStyles('none','block','#000000','#ffffff','none','inline-block',$window.innerWidth);
                                                }

                                                if($scope.liveInstanceinterval === null) {
                                                    $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                                                }
                                        });
                                    }
                                });
                            }else {
                                procedureService.setInstanceCompleted($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,$scope.currentRevision,completetime).then(function(res){
                                    if(res.status === 200){
                                        for(var a=0;a<$scope.steps.length;a++){
                                            $scope.steps[a].status = true;
                                        }
                                        procedureService.setProcedureName($scope.params.procID,res.data.procedure.title,"AS-Run Archive");
                                        procedureService.setHeaderStyles('none','block','#000000','#ffffff','none','inline-block',$window.innerWidth);
                                    }

                                    if($scope.liveInstanceinterval === null) {
                                        $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                                    }
                                });

                            }
                        }else if(mainheaderIndex >=0){
                            var finalCount2 = 0;
                            for(var k=mainheaderIndex+1;k<index;k++){
                                if($scope.steps[k].Info && $scope.steps[k].Info.length > 0){
                                    finalCount2++;
                                }
                            }
                            if(finalCount2 === (index  - mainheaderIndex - 1) ){
                                if($scope.liveInstanceinterval) {
                                    $interval.cancel($scope.liveInstanceinterval);
                                    $scope.liveInstanceinterval = null;
                                }
                                $scope.steps[mainheaderIndex].rowstyle = {
                                    rowcolor : {
                                        'background':'-moz-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                        'background':'-o-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                        'background':'linear-gradient(to left, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                                        'background-size': '200% 100%',
                                        'background-position':'right bottom',
                                        'margin-left':'10px',
                                        'transition':'all 0.3s linear'
                                    }
                                } 
                                $scope.steps[mainheaderIndex].Info = $scope.clock.utc;
                                procedureService.setInfo($scope.steps[mainheaderIndex].Info,$scope.params.procID,mainheaderIndex,$scope.usernamerole,$scope.currentRevision,infotime,$scope.inputStepValues[mainheaderIndex].ivalue,$scope.steps[mainheaderIndex].contenttype).then(function(response){   
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
                                });
                            }else {
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
                        }
                    }
                });
        },function () {
            //handle modal dismiss
            // if close procedure confirmation is cancelled
            $scope.steps[index].chkval = false;
            if($scope.liveInstanceinterval === null) {
                $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
            }
        });
    }

    $scope.$watch('role.cRole',function(newvalue,oldvalue){
        $scope.steps = procedureService.getStepPermissions($scope.steps,newvalue.callsign);
    });

});


