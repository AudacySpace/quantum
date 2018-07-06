quantum
.factory('procedureService', ['$http','$window','$mdToast', function($http,$window,$mdToast) {

    var procedure = {
        id:"",
        name:"",
        status:"",
        fullname : "",
    }
    var icons = {
        icon1style:"",
        icon2style:"",
        icon3style:"",
        icon4style:""
    }
    var header = {
        styles:{},
        namestyles:{}
    };

    var currentViewRevision = {
        value:""
    }

    function getProcedureList() {
    	return $http({
    		url: "/getProcedureList",
    		method: "GET",
            data:{}
    	});
    }

    function setProcedureName(id,name,status){
        if(status !== 'Home'){
            procedure.id = id;
            procedure.name = name;
            procedure.status = status;
            procedure.fullname = status+":"+id+" - "+name;
        }else {
            procedure.id = "";
            procedure.name = "";
            procedure.status = "";
            procedure.fullname = "";
        }
    }

    function getProcedureName(){
        return procedure;
    }

    function setHeaderStyles(icon1,icon2,bgcolor,fontcolor,icon3,icon4,windowWidth){
        if(windowWidth > 500){
            icons.icon1style = {display:icon1};
            icons.icon2style = {display:icon2};
            icons.icon3style = {display:'none'};
            icons.icon4style = {display:'none'};
        }else {
            icons.icon1style = {display:'none'};
            icons.icon2style = {display:'none'};
            icons.icon3style = {display:icon3};
            icons.icon4style = {display:icon4};
        }
        header.styles = {backgroundColor:bgcolor,color:fontcolor};
        header.namestyles = {color:fontcolor};
    }

    function getHeaderStyles(){
        return header;
    }

    function downloadProcedure(id){
        return $http({
            url:"/getProcedureData",
            method: "GET",
            params: {"id": id}
        })
    }

    function getIconStyles(){
        return icons;
    }

    function saveProcedureInstance(id,usernamerole,lastuse,username,email) {
        return $http({
            url: "/saveProcedureInstance", 
            method: "POST",
            data: {"id":id,"usernamerole":usernamerole,"lastuse":lastuse,"username":username,"email":email}
        });
    }

    function setInfo(info,id,step,usernamerole,revision,lastuse,recordedValue,steptype){
        return $http({
            url: "/setInfo", 
            method: "POST",
            data: {"info":info,"id":id,"step":step,"usernamerole":usernamerole,"revision":revision,"lastuse":lastuse,"recordedValue":recordedValue,"steptype":steptype}
        });  
    }

    function setInstanceCompleted(info,id,step,usernamerole,revision,lastuse){
        return $http({
            url: "/setInstanceCompleted", 
            method: "POST",
            data: {"info":info,"id":id,"step":step,"usernamerole":usernamerole,"revision":revision,"lastuse":lastuse}
        }); 
    }

    function getLiveInstanceData(pid,revision){
        return $http({
            url:"/getLiveInstanceData",
            method: "GET",
            params: {'procedureID' : pid,'currentRevision':revision}
        });
    }

    function getAllInstances(pid){
        return $http({
            url:"/getAllInstances",
            method: "GET",
            params: {'procedureID' : pid}
        });
    }

    function getProcedureSection(psteps,callsign){
        if(psteps && psteps.length > 0 && callsign !== ''){
            for(var j=0;j<psteps.length;j++){
                if(psteps[j].Step.includes(".0") === true && psteps[j].Step.indexOf(".") === psteps[j].Step.lastIndexOf(".")){
                    psteps[j].index = parseFloat(psteps[j].Step);
                    psteps[j].class = "fa fa-caret-right";
                    psteps[j].header = true; 
                    psteps[j].headertype = "mainheader";
                    psteps[j].headervalue = psteps[j].Step.split(".")[0];
                    psteps[j].openstatus = true;
                    psteps[j].rowstyle = {
                        rowcolor: {backgroundColor:'#e9f6fb'}
                    };
                    psteps[j].chkval = false;
                    psteps[j].checkbox = false;

                }else if(psteps[j].Step.includes(".0") === true && psteps[j].Step.indexOf(".") !== psteps[j].Step.lastIndexOf(".")){
                    psteps[j].index = parseFloat(psteps[j].Step);
                    psteps[j].class = "fa fa-caret-down";
                    psteps[j].header = true; 
                    psteps[j].headertype = "subheader";
                    psteps[j].headervalue = psteps[j].Step.split(".")[0];
                    psteps[j].openstatus = false;
                    psteps[j].rowstyle = {
                        rowcolor: {
                            backgroundColor:'#e9f6fb'
                        }
                    };
                    psteps[j].chkval = false;
                    psteps[j].checkbox = false;
                }else {
                    psteps[j].index = parseFloat(psteps[j].Step);
                    psteps[j].class = "fa fa-caret-right"; 
                    psteps[j].header = false;
                    psteps[j].headertype = "listitem";
                    psteps[j].headervalue = psteps[j].Step.split(".")[0];
                    psteps[j].openstatus = false;
                    psteps[j].rowstyle = {
                        rowcolor: {backgroundColor:'#e9f6fb'}
                    };
                    psteps[j].chkval = false;
                    psteps[j].checkbox = true;
                }  
            }

            //set type icon 
            for(var k=0;k<psteps.length;k++){
                if(psteps[k].Type === "Heading"){
                    psteps[k].typeicon = "";
                    psteps[k].typecolor = {color:""};
                    psteps[k].contenttype = 'String';
                    psteps[k].buttonStatus = "";
                    if(!psteps[k].hasOwnProperty("comments")){
                        psteps[k].comments = "";
                    }
                }else if(psteps[k].Type === "Warning"){
                    psteps[k].typeicon = "fa fa-exclamation-triangle";
                    psteps[k].typecolor = {color:"#ff0000"};
                    psteps[k].contenttype = 'AlertInfo';
                    psteps[k].buttonStatus = "";
                    if(!psteps[k].hasOwnProperty("comments")){
                        psteps[k].comments = "";
                    }
                }else if(psteps[k].Type === "Caution"){
                    psteps[k].typeicon = "fa fa-exclamation-triangle";
                    psteps[k].typecolor = {color:"#ffcc00"};
                    psteps[k].contenttype = 'AlertInfo';
                    psteps[k].buttonStatus = "";
                    if(!psteps[k].hasOwnProperty("comments")){
                        psteps[k].comments = "";
                    }
                }else if(psteps[k].Type === "Record"){
                    psteps[k].typeicon = "fa fa-pencil-square-o";
                    psteps[k].typecolor = {color:""};
                    psteps[k].contenttype = 'Input';
                    psteps[k].buttonStatus = "";
                    if(!psteps[k].hasOwnProperty("comments")){
                        psteps[k].comments = "";
                    }
                    if(!psteps[k].hasOwnProperty("recordedValue")){
                        psteps[k].recordedValue = "";
                    }
                }else if(psteps[k].Type === "Verify"){
                    psteps[k].typeicon = "fa fa-check-circle-o";
                    psteps[k].typecolor = {color:""};
                    psteps[k].contenttype = 'String';
                    psteps[k].buttonStatus = "";
                    if(!psteps[k].hasOwnProperty("comments")){
                        psteps[k].comments = "";
                    }
                }else if(psteps[k].Type === "Action"){
                    psteps[k].typeicon = "fa fa-cog";
                    psteps[k].typecolor = {color:""};
                    psteps[k].buttonStatus = "";
                    if(!psteps[k].hasOwnProperty("comments")){
                        psteps[k].comments = "";
                    }
                    if(psteps[k].Content.indexOf('\r\n') !== -1){
                        //Command type steps
                        psteps[k].Content = createArrayOfString(psteps[k].Content,'\r\n');
                        psteps[k].contenttype = 'Array';
                    }else if(psteps[k].Content.indexOf('\n') !== -1){
                        //Command type steps
                        psteps[k].Content = createArrayOfString(psteps[k].Content,'\n');
                        psteps[k].contenttype = 'Array';

                    }else{
                        //General action steps
                        psteps[k].contenttype = 'String';
                    }
                }else if(psteps[k].Type === "Decision"){
                    psteps[k].typeicon = "fa fa-dot-circle-o";
                    psteps[k].typecolor = {color:""};
                    psteps[k].contenttype = 'DecisionInfo';
                    psteps[k].buttonStatus = "";
                    if(!psteps[k].hasOwnProperty("comments")){
                        psteps[k].comments = "";
                    }
                    if(psteps[k].Reference){
                        psteps[k].procedureLinkDetails = getProcedureLink(psteps[k].Reference);
                    }else {
                        psteps[k].procedureLinkDetails = [];
                    }
                   
                }
            }

            //check for role and disable the steps if not permitted
            for(var a=0;a<psteps.length;a++){
                if(psteps[a].Role.includes(callsign)){
                    psteps[a].status = false;
                }else {
                    psteps[a].status = true;
                }
            }

        }else {
            psteps = [];
            callsign = "";
        }
        return psteps;
    }

    function showPList(id,index,headertype,liststeps){
        if(id !== "" && index !== "" && headertype !== "" && liststeps.length > 0){
            if(headertype === "mainheader"){
                if(liststeps[id].class === "fa fa-caret-down"){
                    liststeps[id].class = "fa fa-caret-right"
                    for(var i=0;i<liststeps.length;i++){
                        if(index === parseInt(liststeps[i].headervalue) && liststeps[i].headertype === "subheader"){
                            liststeps[i].openstatus = false;
                        }
                        else if(index === parseInt(liststeps[i].headervalue) && liststeps[i].headertype === "listitem"){
                            liststeps[i].openstatus = false;
                        }
                    }
                }else if(liststeps[id].class === "fa fa-caret-right"){
                    liststeps[id].class = "fa fa-caret-down"
                    for(var i=0;i<liststeps.length;i++){
                        if(index === parseInt(liststeps[i].headervalue) && liststeps[i].headertype === "subheader"){
                            liststeps[i].class = "fa fa-caret-down";
                            liststeps[i].openstatus = true;
                        }else  if(index === parseInt(liststeps[i].headervalue) && liststeps[i].headertype === "listitem"){
                            liststeps[i].class = "fa fa-caret-right";
                            liststeps[i].openstatus = true;
                        }
                    }
                }

            }else if(headertype === "subheader"){
                if(liststeps[id].class === "fa fa-caret-down"){
                    liststeps[id].class = "fa fa-caret-right"
                    for(var i=0;i<liststeps.length;i++){
                        if(index === liststeps[i].index && liststeps[i].headertype === "listitem" ){
                            liststeps[i].openstatus = false;   
                        }
                    }
                }else if(liststeps[id].class === "fa fa-caret-right"){
                    liststeps[id].class = "fa fa-caret-down"
                    for(var i=0;i<liststeps.length;i++){
                        if(index === liststeps[i].index && liststeps[i].headertype === "listitem" ){
                            liststeps[i].openstatus = true;   
                        }
                    }
                }
            }else if(headertype === "listitem"){

            }
        }else {
            liststeps = [];
        }
        
        return liststeps;

    }

    function checkIfEmpty(steps){
        var stepcount = 0;
        if(steps.length > 0){
            for(var i=0;i<steps.length;i++){
                if(steps[i].Info === undefined){
                    stepcount++;
                }
            }
            if(stepcount === steps.length){
                return true;
            }else {
                return false;
            }
        }else {
            return "No steps available!";
        }
    }

    function openNextSteps(steps,index){
        if(steps.length > 0 && index !== ""){
            var newindex = index+1;
            if(steps[index].headertype === "mainheader"){
                while(steps[newindex].headertype !== "mainheader" && index !== steps.length-1){
                    steps[newindex].openstatus = true;
                    steps[index].class = "fa fa-caret-down";
                    if(newindex === steps.length-1){
                        break;
                    }else {
                        newindex = newindex+1;
                    }   
                }
            }else if(steps[index].headertype === "subheader" && index !== steps.length-1){
                //steps[index].openstatus = true;
                if(steps[index-1].headertype === "mainheader"){
                    steps[index-1].class = "fa fa-caret-down";
                }
                while(steps[newindex].headertype !== "mainheader"){
                    steps[newindex].openstatus = true;
                    steps[index].class = "fa fa-caret-down";
                    if(newindex === steps.length-1){
                        break;
                    }else {
                        newindex = newindex+1;
                    }   
                }
                for(var a=0;a<steps.length;a++){
                    if(steps[a].headervalue === steps[index].headervalue){
                        steps[a].openstatus = true;
                    }
                }
            }else if(steps[index].headertype === "listitem" && index !== steps.length-1){
                if(steps[newindex].headertype === "mainheader"){
                    steps[newindex].class = "fa fa-caret-down";
                    steps[newindex].openstatus = true;
                    steps[index].class = "fa fa-caret-right";
                    var newind = newindex+1;
                    while(steps[newind].headertype !== "mainheader"){
                        steps[newind].openstatus = true;
                        if(newind === steps.length-1){
                            break;
                        }else {
                            newind = newind+1;
                        }
                    }

                    for(var a=0;a<steps.length;a++){
                        if(steps[a].headervalue === steps[index].headervalue){
                            steps[a].openstatus = true;
                        }
                    }

                }else {
                    for(var a=0;a<steps.length;a++){
                        if(steps[a].headervalue === steps[index].headervalue){
                            steps[a].openstatus = true;
                        }
                    }
                }
            }
        }
        return steps;
    }

    function getCompletedSteps(steps){
        if(steps.length > 0){
            for(var d=0;d<steps.length;d++){
                if(steps[d].Info !== ""){
                    steps[d].rowstyle = {
                        rowcolor : {
                            backgroundColor:'#c6ecc6'
                        }
                    };
                    steps[d].chkval = true;
                }else {
                    steps[d].rowstyle = {
                        rowcolor : {backgroundColor:'#e9f6fb'}
                    };
                    steps[d].chkval = false;
                }
            }
        }
        return steps;
    }

    function createArrayOfString(content,delimiter){
        var arrayOfContents = [];
        arrayOfContents = content.split(delimiter);
        return arrayOfContents;
    }

    function setCurrentViewRevision(revisionNum){
        currentViewRevision.value = revisionNum;
    }

    function getCurrentViewRevision(){
        return currentViewRevision
    }

    function getProcedureLink(decisiondetails){
         var procedureLinkDetails = [];
        if(decisiondetails.includes("\r\n")){
            var linkdetails = createArrayOfString(decisiondetails,"\r\n");
            for(var k=0;k<linkdetails.length;k++){
                var pid = createArrayOfString(linkdetails[k],':');
                var procedurelink = '/dashboard/procedure/'+pid[1];
                procedureLinkDetails.push({
                    "link":procedurelink,
                    "pid":pid[1]
                });
            }
        }else if(decisiondetails.includes("\n")){
            var linkdetails = createArrayOfString(decisiondetails,"\n");
            for(var k=0;k<linkdetails.length;k++){
                var pid = createArrayOfString(linkdetails[k],':');
                var procedurelink = '/dashboard/procedure/'+pid[1];
                procedureLinkDetails.push({
                    "link":procedurelink,
                    "pid":pid[1]
                });
            }

        }else {
            var pid = createArrayOfString(decisiondetails,':');
            var procedurelink = '/dashboard/procedure/'+pid[1];
            procedureLinkDetails.push({
                "link":procedurelink,
                "pid":pid[1]
            });
        }
        return procedureLinkDetails;
    }

    function disableSteps(steps){
        if(steps.length > 0){
            for(var d=0;d<steps.length;d++){
                if(steps[d].Info !== ""){
                    steps[d].rowstyle = {
                        rowcolor : {backgroundColor:'#c6ecc6'}
                    };
                    steps[d].chkval = true;
                    steps[d].status = true;
                }else {
                    steps[d].status = true;
                }
            }
        }
        return steps;
    }

    function setComments(pid,prevision,index,comments,lastuse){
        return $http({
            url: "/setComments", 
            method: "POST",
            data: {"pid":pid,"prevision":prevision,"index":index,"comments":comments,"lastuse":lastuse}
        });
    }

    function openFirstStep(psteps,callsign){
        if(psteps && psteps.length > 0){
            for(var j=0;j<psteps.length;j++){
                if(psteps[j].Step.includes(".0") === true && psteps[j].Step.indexOf(".") === psteps[j].Step.lastIndexOf(".")){
                    psteps[j].class = "fa fa-caret-down";
                    var nextIndex = j+1;
                    while(psteps[nextIndex].Step.includes(".0") === false && nextIndex !== psteps.length-1){
                        psteps[nextIndex].openstatus = true;
                        psteps[nextIndex].class = "fa fa-caret-right";
                        nextIndex = nextIndex + 1;
                    }
                    break;
                }
            }

            for(var a=0;a<psteps.length;a++){
                if(psteps[a].Role.includes(callsign)){
                    psteps[a].status = false;
                }else {
                    psteps[a].status = true;
                }
            }
        }
        return psteps;
    }

    function getSectionHeaderIndex(steps,currentIndex) {
        var sectionHeader;
        for(var a=0;a<currentIndex;a++){
            if(steps[a].headervalue === steps[currentIndex].headervalue && steps[a].headertype === "mainheader"){
                sectionHeader = a;
                break; 
            }
        }
        if(sectionHeader >=0){
            return sectionHeader;
        }else {
            return -1;
        }
        
    }

    function getNextSectionHeaderIndex(steps,mainHeaderIndex,currentIndex){
        var nextsectionHeader;
        for(var s=mainHeaderIndex+1;s<steps.length;s++){
            if(steps[s].headertype === "mainheader"){
                nextsectionHeader = s;
                break;
            }
        }

        if(nextsectionHeader >= 0){
            return nextsectionHeader;
        }else {
            return -1;
        }

    }

    function getSubSectionHeaderIndex(steps,currentIndex){
        var subsectionHeader;
        for(var i=0;i<currentIndex;i++){
            if(steps[i].index === steps[currentIndex].index && steps[i].headertype === "subheader"){
                subsectionHeader = i;
                break;
            }
        }
        if(subsectionHeader >= 0){
             return subsectionHeader;
         }else {
            return -1;
         }
       
    }

    function getNextSubSectionHeaderIndex(steps,mainSubHeaderIndex,currentIndex){
        var nextsubheaderIndex;
        for(var s=mainSubHeaderIndex+1;s<steps.length;s++){
            if(steps[s].headertype === "subheader" && steps[s].index !== steps[currentIndex].index && steps[s].index !== steps[currentIndex].index && steps[s].headervalue === steps[currentIndex].headervalue){
                nextsubheaderIndex = s;
                break;
            }
        }
        if(nextsubheaderIndex >= 0){
             return nextsubheaderIndex;
         }else {
            return -1;
         }
    }


    function getStepPermissions(psteps,callsign){
        var len = psteps.length;
        //check for role and disable the steps if not permitted
        for(var a=0;a<len;a++){
            if(psteps[a].Role.includes(callsign)){
                psteps[a].status = false;
            }else {
                psteps[a].status = true;
            }
        }
        return psteps;
    }

      function displayAlert(message,position,queryId,delay){
        //var pinTo = 'top left';
        var toast = $mdToast.simple()
                            .textContent(message)
                            .action('OK')
                            .parent(document.querySelectorAll(queryId))
                            .hideDelay(delay)
                            .highlightAction(true)
                            .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
                            .position(position);

        $mdToast.show(toast).then(function(response) {
            if ( response == 'ok' ) {
            }
        },function(error){
            // console.log(error);
        });
        return true;
    }

    function setUserStatus(location,emailaddress,username,pid,revision){
        var locationOp1 = location.split("/"); // to split the current location string
        console.log(locationOp1);
        if(locationOp1.length === 4){ // if length is 4,then the current location is new instance
            //location: /dashboard/procedure/:procID
            console.log("here");
            console.log(pid);
            return $http({
                url: "/setUserStatus", 
                method: "POST",
                data: {"email":emailaddress,"status":true,"pid":pid,"username":username,"revision":revision}
            });
        }else if(locationOp1.length === 6){ // if length is 6,then the current location is running instance
            //location: /dashboard/procedure/runninginstance/:procID/:revisionID
            return $http({
                url: "/setUserStatus", 
                method: "POST",
                data: {"email":emailaddress,"status":true,"pid":pid,"username":username,"revision":revision}
            });
        }else {
            // for all other locations in the application
            return $http({
                url: "/setUserStatus", 
                method: "POST",
                data: {"email":emailaddress,"status":false,"pid":pid,"username":username,"revision":revision}
            });
        }
    }

    return { 
        procedure : procedure,
        icons : icons,
        header : header,
        getProcedureList : getProcedureList,
        setProcedureName : setProcedureName,
        getProcedureName : getProcedureName,
        setHeaderStyles : setHeaderStyles,
        getHeaderStyles : getHeaderStyles,
        getIconStyles : getIconStyles,
        saveProcedureInstance : saveProcedureInstance,
        setInfo : setInfo,
        downloadProcedure : downloadProcedure,
        setInstanceCompleted : setInstanceCompleted,
        getLiveInstanceData : getLiveInstanceData,
        getAllInstances : getAllInstances,
        getProcedureSection : getProcedureSection,
        showPList : showPList,
        checkIfEmpty : checkIfEmpty,
        openNextSteps : openNextSteps,
        getCompletedSteps : getCompletedSteps,
        setCurrentViewRevision : setCurrentViewRevision,
        getCurrentViewRevision : getCurrentViewRevision,
        disableSteps : disableSteps,
        setComments : setComments,
        openFirstStep : openFirstStep,
        getSectionHeaderIndex : getSectionHeaderIndex,
        getNextSectionHeaderIndex : getNextSectionHeaderIndex,
        getSubSectionHeaderIndex : getSubSectionHeaderIndex,
        getNextSubSectionHeaderIndex : getNextSubSectionHeaderIndex,
        getStepPermissions : getStepPermissions,
        displayAlert : displayAlert,
        setUserStatus : setUserStatus
    }
}]);