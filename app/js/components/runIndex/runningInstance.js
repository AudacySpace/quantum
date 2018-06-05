quantum.controller('runningInstanceCtrl', function($scope,procedureService,$routeParams,userService,timeService,$interval,$window,dashboardService,$location) {
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
    }

    $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);

    function viewProcedure(){
        $scope.inputStepValues = [];
        $scope.tempValues = [];
        procedureService.setProcedureName($scope.params.procID,$scope.procedure.name,"Live");
        procedureService.getProcedureList().then(function(response) {
            if(response.status === 200){
                for(var i=0;i<response.data.length;i++){
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
            if($window.confirm("Do you want to close this procedure?")){
                $scope.steps[index].rowstyle = {
                    rowcolor : {backgroundColor:'#c6ecc6'}
                };
                $scope.steps[index].Info = $scope.clock.utc +" "+$scope.name +"("+$scope.role.cRole.callsign+")";
                infotime = $scope.clock.year+" - "+$scope.clock.utc;
                procedureService.setInfo($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,$scope.currentRevision,infotime,$scope.inputStepValues[index].ivalue,$scope.steps[index].contenttype).then(function(response){
                    if(response.status === 200){
                        completetime = $scope.clock.year+" - "+$scope.clock.utc;

                        //check if all the steps in the section are completed and set section header color and timestamp
                        var mainheaderIndex = "";
                        var nextmainheaderIndex = "";
                        var subheaderIndex = "";
                        var nextsubheaderIndex = "";

                        //check if there exists a sub header
                        for(var a=0;a<index;a++){
                            if($scope.steps[a].index === $scope.steps[index].index && $scope.steps[a].headertype === "subheader"){
                                subheaderIndex = a;
                                break; 
                            }
                        }

                        //If no subheader check for main header
                        if(subheaderIndex === ""){
                            for(var a=0;a<index;a++){
                                if($scope.steps[a].headervalue === $scope.steps[index].headervalue && $scope.steps[a].headertype === "mainheader"){
                                    mainheaderIndex = a;
                                    break; 
                                }
                            }
                        }

                        if(subheaderIndex !== ""){
                            var finalCount1 = 0;
                            var finalCountnew1 = 0;
                            for(var k=subheaderIndex+1;k<index;k++){
                                if($scope.steps[k].Info && $scope.steps[k].Info.length > 0){
                                    finalCount1++;
                                }
                            }

                            // to set main header info
                            for(var a=0;a<index;a++){
                                if($scope.steps[a].headervalue === $scope.steps[index].headervalue && $scope.steps[a].headertype === "mainheader"){
                                    mainheaderIndex = a;
                                    break; 
                                }
                            }


                            if(finalCount1 === (index - subheaderIndex - 1)){
                                if($scope.liveInstanceinterval) {
                                    $interval.cancel($scope.liveInstanceinterval);
                                    $scope.liveInstanceinterval = null;
                                }
                                $scope.steps[subheaderIndex].rowstyle = {
                                    rowcolor : {backgroundColor:'#c6ecc6'}
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
                                            rowcolor : {backgroundColor:'#c6ecc6'}
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
                            }
                        }else if(mainheaderIndex !== ""){
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
                                    rowcolor : {backgroundColor:'#c6ecc6'}
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
                    procedureService.setInfo($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,$scope.currentRevision,infotime,$scope.inputStepValues[index].ivalue,$scope.steps[index].contenttype).then(function(response){  
                        if($scope.liveInstanceinterval === null) {
                            $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                        }
                        // get main header or sub header for the step
                        //check for all the rest of the steps in that section if completed
                            //if completed mark header as done
                            //if not ,then dont mark as done
                            // var mainheaderIndex = "";
                            // var subheaderIndex = ""; 

                        //check if all the steps in the section are completed and set section header color and timestamp
                        var mainheaderIndex = "";
                        var nextmainheaderIndex = "";
                        var subheaderIndex = "";
                        var nextsubheaderIndex = "";

                        //check if there exists a sub header
                        for(var a=0;a<index;a++){
                            if($scope.steps[a].index === $scope.steps[index].index && $scope.steps[a].headertype === "subheader"){
                                subheaderIndex = a;
                                for(var s=a+1;s<$scope.steps.length;s++){
                                    if($scope.steps[s].headertype === "subheader" && $scope.steps[s].index !== $scope.steps[index].index && $scope.steps[s].headervalue === $scope.steps[index].headervalue){
                                        nextsubheaderIndex = s;
                                        break;
                                    }
                                }
                                break; 
                            }
                        }

                        //If no subheader check for main header
                        if(subheaderIndex === ""){
                            for(var a=0;a<index;a++){
                                if($scope.steps[a].headervalue === $scope.steps[index].headervalue && $scope.steps[a].headertype === "mainheader"){
                                    mainheaderIndex = a;
                                    for(var s=a+1;s<$scope.steps.length;s++){
                                        if($scope.steps[s].headertype === "mainheader"){
                                            nextmainheaderIndex = s;
                                            break;
                                        }
                                    }
                                    break; 
                                }
                            }
                        }

                        if(subheaderIndex !== ""){
                            var finalCount1 = 0;
                            var finalCountnew1 = 0;
                            if(nextsubheaderIndex === ""){
                                for(var s=subheaderIndex+1;s<$scope.steps.length;s++){
                                    if($scope.steps[s].headertype === "listitem" && $scope.steps[s].index !== $scope.steps[index].index){
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

                            if(nextsubheaderIndex === "" && nextsubheaderIndex.length === 0){
                                for(var s=subheaderIndex+1;s<$scope.steps.length;s++){
                                    if($scope.steps[s].headertype === "listitem" && $scope.steps[s].index !== $scope.steps[index].index && $scope.steps[s].headervalue === $scope.steps[index].headervalue){
                                        nextsubheaderIndex = s;
                                        break;
                                    }
                                }
                            }

                            // to add main header info 
                            for(var a=0;a<index;a++){
                                if($scope.steps[a].headervalue === $scope.steps[index].headervalue && $scope.steps[a].headertype === "mainheader"){
                                    mainheaderIndex = a;
                                    for(var s=a+1;s<$scope.steps.length;s++){
                                        if($scope.steps[s].headertype === "mainheader"){
                                            nextmainheaderIndex = s;
                                            break;
                                        }
                                    }
                                    break; 
                                }
                            }

                            var mIndex = mainheaderIndex + 1;
                            for(var k=mIndex;k<nextmainheaderIndex;k++){
                                if($scope.steps[k].Info && $scope.steps[k].Info.length > 0){
                                    finalCountnew1++;
                                }
                            }

                            if(finalCount1 === (nextsubheaderIndex - subheaderIndex - 1) && finalCountnew1 !== (nextmainheaderIndex - mainheaderIndex - 1)){
                                if($scope.liveInstanceinterval) {
                                    $interval.cancel($scope.liveInstanceinterval);
                                    $scope.liveInstanceinterval = null;
                                }
                                $scope.steps[subheaderIndex].rowstyle = {
                                    rowcolor : {backgroundColor:'#c6ecc6'}
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
                                            rowcolor : {backgroundColor:'#c6ecc6'}
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

                            }else if(finalCount1 === (nextsubheaderIndex - subheaderIndex - 1) && finalCountnew1 === (nextmainheaderIndex - mainheaderIndex - 1)){
                                if($scope.liveInstanceinterval) {
                                    $interval.cancel($scope.liveInstanceinterval);
                                    $scope.liveInstanceinterval = null;
                                }
                                $scope.steps[subheaderIndex].rowstyle = {
                                    rowcolor : {backgroundColor:'#c6ecc6'}
                                } 
                                $scope.steps[mainheaderIndex].rowstyle = {
                                    rowcolor : {backgroundColor:'#c6ecc6'}
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
                        }else if(mainheaderIndex !== ""){
                            var finalCount2 = 0;
                            for(var k=mainheaderIndex+1;k<nextmainheaderIndex;k++){
                                if($scope.steps[k].Info && $scope.steps[k].Info.length > 0){
                                    finalCount2++;
                                }
                            }
                            if(finalCount2 === (nextmainheaderIndex - mainheaderIndex - 1) ){
                                if($scope.liveInstanceinterval) {
                                    $interval.cancel($scope.liveInstanceinterval);
                                    $scope.liveInstanceinterval = null;
                                }
                                $scope.steps[mainheaderIndex].rowstyle = {
                                    rowcolor : {backgroundColor:'#c6ecc6'}
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
                    $scope.steps[index].Info = $scope.clock.utc +" "+$scope.name +"("+$scope.role.cRole.callsign+")";
                    infotime = $scope.clock.year+" - "+$scope.clock.utc;
                    procedureService.setInfo($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,$scope.currentRevision,infotime,$scope.inputStepValues[index].ivalue,$scope.steps[index].contenttype).then(function(response){  
                        if($scope.liveInstanceinterval === null) {
                            $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                        }

                        //check if all the steps in the section are completed and set section header color and timestamp
                        var mainheaderIndex = "";
                        var nextmainheaderIndex = "";
                        var subheaderIndex = "";
                        var nextsubheaderIndex = "";

                        //check if there exists a sub header
                        for(var a=0;a<index;a++){
                            if($scope.steps[a].index === $scope.steps[index].index && $scope.steps[a].headertype === "subheader"){
                               subheaderIndex = a;
                                    for(var s=a+1;s<$scope.steps.length;s++){
                                        if($scope.steps[s].headertype === "subheader" && $scope.steps[s].index !== $scope.steps[index].index && $scope.steps[s].headervalue === $scope.steps[index].headervalue){
                                            nextsubheaderIndex = s;
                                            break;
                                        }
                                    }
                                    break; 
                            }
                        }

                        //If no subheader check for main header
                        if(subheaderIndex === ""){
                            for(var a=0;a<index;a++){
                                if($scope.steps[a].headervalue === $scope.steps[index].headervalue && $scope.steps[a].headertype === "mainheader"){
                                    mainheaderIndex = a;
                                    for(var s=a+1;s<$scope.steps.length;s++){
                                        if($scope.steps[s].headertype === "mainheader"){
                                            nextmainheaderIndex = s;
                                            break;
                                        }
                                    }
                                    break; 
                                }
                            }
                        }

                        if(subheaderIndex !== ""){
                            var finalCount1 = 0;
                            var finalCountnew1 = 0;
                            if(nextsubheaderIndex === ""){
                                for(var s=subheaderIndex+1;s<$scope.steps.length;s++){
                                    if($scope.steps[s].headertype === "listitem" && $scope.steps[s].index !== $scope.steps[index].index){
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

                            if(nextsubheaderIndex === "" && nextsubheaderIndex.length === 0){
                                for(var s=subheaderIndex+1;s<$scope.steps.length;s++){
                                    if($scope.steps[s].headertype === "listitem" && $scope.steps[s].index !== $scope.steps[index].index && $scope.steps[s].headervalue === $scope.steps[index].headervalue){
                                        nextsubheaderIndex = s;
                                        break;
                                    }
                                }
                            }


                            // to add main header info 
                            for(var a=0;a<index;a++){
                                if($scope.steps[a].headervalue === $scope.steps[index].headervalue && $scope.steps[a].headertype === "mainheader"){
                                    mainheaderIndex = a;
                                    for(var s=a+1;s<$scope.steps.length;s++){
                                        if($scope.steps[s].headertype === "mainheader"){
                                            nextmainheaderIndex = s;
                                            break;
                                        }
                                    }
                                    break; 
                                }
                            }

                            var mIndex = mainheaderIndex + 1;
                            for(var k=mIndex;k<nextmainheaderIndex;k++){
                                if($scope.steps[k].Info && $scope.steps[k].Info.length > 0){
                                    finalCountnew1++;
                                }
                            }

                            if(finalCount1 === (nextsubheaderIndex - subheaderIndex - 1) && finalCountnew1 !== (nextmainheaderIndex - mainheaderIndex - 1)){
                                if($scope.liveInstanceinterval) {
                                    $interval.cancel($scope.liveInstanceinterval);
                                    $scope.liveInstanceinterval = null;
                                }
                                $scope.steps[subheaderIndex].rowstyle = {
                                    rowcolor : {backgroundColor:'#c6ecc6'}
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
                                            rowcolor : {backgroundColor:'#c6ecc6'}
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
                            }else if(finalCount1 === (nextsubheaderIndex - subheaderIndex - 1) && finalCountnew1 === (nextmainheaderIndex - mainheaderIndex - 1)){
                                if($scope.liveInstanceinterval) {
                                    $interval.cancel($scope.liveInstanceinterval);
                                    $scope.liveInstanceinterval = null;
                                }
                                $scope.steps[subheaderIndex].rowstyle = {
                                    rowcolor : {backgroundColor:'#c6ecc6'}
                                } 
                                $scope.steps[subheaderIndex].Info = $scope.clock.utc;
                                $scope.steps[mainheaderIndex].rowstyle = {
                                    rowcolor : {backgroundColor:'#c6ecc6'}
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
                        }else if(mainheaderIndex !== ""){
                            var finalCount2 = 0;
                            for(var k=mainheaderIndex+1;k<nextmainheaderIndex;k++){
                                if($scope.steps[k].Info && $scope.steps[k].Info.length > 0){
                                    finalCount2++;
                                }
                            }
                            if(finalCount2 === (nextmainheaderIndex - mainheaderIndex - 1) ){
                                if($scope.liveInstanceinterval) {
                                    $interval.cancel($scope.liveInstanceinterval);
                                    $scope.liveInstanceinterval = null;
                                }
                                $scope.steps[mainheaderIndex].rowstyle = {
                                    rowcolor : {backgroundColor:'#c6ecc6'}
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
                    for(var a=0;a<index;a++){
                        if($scope.steps[a].index === $scope.steps[index].index && $scope.steps[a].headertype === "subheader"){
                            subheaderIndex = a;
                            for(var s=a+1;s<$scope.steps.length;s++){
                                if($scope.steps[s].headertype === "subheader" && $scope.steps[s].index !== $scope.steps[index].index){
                                    nextsubheaderIndex = s;
                                    break;
                                }
                            }
                            break; 
                        }
                    }

                    //If no subheader check for main header
                    if(subheaderIndex === ""){
                        for(var a=0;a<index;a++){
                            if($scope.steps[a].headervalue === $scope.steps[index].headervalue && $scope.steps[a].headertype === "mainheader"){
                                mainheaderIndex = a;
                                for(var s=a+1;s<$scope.steps.length;s++){
                                    if($scope.steps[s].headertype === "mainheader"){
                                        nextmainheaderIndex = s;
                                        break;
                                    }
                                }
                                break; 
                            }
                        }
                    }

                    if(subheaderIndex !== ""){
                        var finalCount1 = 0;
                        var finalCountnew1 = 0;
                        if(nextsubheaderIndex === ""){
                            for(var s=subheaderIndex+1;s<$scope.steps.length;s++){
                                if($scope.steps[s].headertype === "listitem" && $scope.steps[s].index !== $scope.steps[index].index){
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

                        for(var a=0;a<index;a++){
                            if($scope.steps[a].headervalue === $scope.steps[index].headervalue && $scope.steps[a].headertype === "mainheader"){
                                mainheaderIndex = a;
                                for(var s=a+1;s<$scope.steps.length;s++){
                                    if($scope.steps[s].headertype === "mainheader"){
                                        nextmainheaderIndex = s;
                                        break;
                                    }
                                }
                                break; 
                            }
                        }

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
                    }else if(mainheaderIndex !== ""){
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
                                rowcolor : {backgroundColor:'#c6ecc6'}
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
            $window.alert("Please enter value and then click Set");
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

});


