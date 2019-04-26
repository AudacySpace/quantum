quantum
.factory('procedureService', ['$http','$window','$mdToast','userService','$rootScope', function($http,$window,$mdToast,userService,$rootScope) {

    var procedure = {
        id:"",
        name:"",
        status:"",
        fullname : ""
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

    var validRoles = {
        callsigns:""
    }

    var procLinks = {
        listOfProcs: []
    }

    var procs = {
        revisions:[]
    }

    var headingType = {'name': 'Heading'};

    //Function to get procedures uploaded
    function getProcedureList() {
    	return $http({
    		url: "/getProcedureList",
    		method: "GET",
            params:{}
    	});
    }

    //Function to set the procedure name currently created or viewed to be set for header title and tab title
    function setProcedureName(id,name,status){
        var loc = $window.location.pathname;
        var revNumOp = loc.split("/");
        if(status !== 'Home'){
            procedure.id = id;
            procedure.name = name;
            procedure.status = status;
            procedure.fullname = status+":"+id+" - "+name;
            //get tab title based on url
            if(revNumOp.length === 5){
                if(revNumOp.includes("running")){
                    $rootScope.title = "Live Index - "+id+" | Quantum";
                }else if(revNumOp.includes("archived")){
                    $rootScope.title = "Archive Index - "+id+" | Quantum";
                }
            }else {
                $rootScope.title = "Procedure "+id+" | Quantum ";
            }  
        }else {
            procedure.id = "";
            procedure.name = "";
            procedure.status = "";
            procedure.fullname = "";
            $rootScope.title = "Quantum";
        }
    }

    //Function to get the procedure name to be used in controllers
    function getProcedureName(){
        return procedure;
    }

    //Function to set the quantum icon and dashboard header style based on the size of the page
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

    //Function to get the quantum icon style to be used in controllers
    function getHeaderStyles(){
        return header;
    }

    //Function to download procedure using get request with procedure index number as identifier
    function downloadProcedure(id){
        return $http({
            url:"/getProcedureData",
            method: "GET",
            params: {"id": id}
        })
    }

    //Function to get the quantum icon styles
    function getIconStyles(){
        return icons;
    }

    //Function to save the procedure instance
    function saveProcedureInstance(id,usernamerole,lastuse,username,email,userstatus) {
        return $http({
            url: "/saveProcedureInstance", 
            method: "POST",
            data: {"id":id,"usernamerole":usernamerole,"lastuse":lastuse,"username":username,"email":email,"status":userstatus}
        });
    }

    //Function to set the info(user name ,callsign and timestamp) when checkbox is checked 
    // or remove the info when unchecked
    function setInfo(info,id,step,usernamerole,revision,lastuse,recordedValue,steptype){
        return $http({
            url: "/setInfo", 
            method: "POST",
            data: {"info":info,"id":id,"step":step,"usernamerole":usernamerole,"revision":revision,"lastuse":lastuse,"recordedValue":recordedValue,"steptype":steptype}
        });  
    }

    //Function to save the active instance in archived instances when the last step is executed
    function setInstanceCompleted(info,id,step,usernamerole,revision,lastuse){
        return $http({
            url: "/setInstanceCompleted", 
            method: "POST",
            data: {"info":info,"id":id,"step":step,"usernamerole":usernamerole,"revision":revision,"lastuse":lastuse}
        }); 
    }

    //Function to get procedure instance step data from database
    function getLiveInstanceData(pid,revision){
        return $http({
            url:"/getLiveInstanceData",
            method: "GET",
            params: {'procedureID' : pid,'currentRevision':revision}
        });
    }

    //Function to get all the instances of a procedure
    function getAllInstances(pid){
        return $http({
            url:"/getAllInstances",
            method: "GET",
            params: {'procedureID' : pid}
        });
    }

    //Function to create procedure instance display using the step type,step number,step role,reference
    function getProcedureSection(psteps,callsign){
        if(psteps && psteps.length > 0 && callsign !== ''){
            for(var j=0;j<psteps.length;j++){
                var step = psteps[j].Step.replace(/\s/g, '');
                if(step.includes(".0") === true && step.indexOf(".") === step.lastIndexOf(".")){
                    var splitOp = [];
                    splitOp =  psteps[j].Step.split('.');
                    var joinOpPre = splitOp.splice(0,splitOp.length-1);
                    var joinOp = joinOpPre.join('');

                    psteps[j].index = parseFloat(psteps[j].Step);
                    psteps[j].class = "fa fa-caret-right";
                    psteps[j].header = true; 
                    psteps[j].headertype = "mainheader";
                    psteps[j].headervalue = psteps[j].Step.split(".")[0];
                    psteps[j].subheadervalue = joinOp;
                    psteps[j].openstatus = true;
                    psteps[j].rowstyle = {
                        rowcolor: {backgroundColor:'#bee4f3'}
                    };
                    psteps[j].sectionbtn = {
                        styles:{color:''}
                    };
                    psteps[j].chkval = false;
                    psteps[j].checkbox = false;

                }else if(step.includes(".0") === true && step.indexOf(".") !== step.lastIndexOf(".")){
                    var splitOp = [];
                    splitOp =  psteps[j].Step.split('.');
                    var joinOpPre = splitOp.splice(0,splitOp.length-1);
                    var joinOp = joinOpPre.join('');

                    psteps[j].index = parseFloat(psteps[j].Step);
                    psteps[j].class = "fa fa-caret-right";
                    psteps[j].header = true; 
                    psteps[j].headertype = "subheader";
                    psteps[j].subheadervalue = joinOp;
                    psteps[j].headervalue = psteps[j].Step.split(".")[0];
                    psteps[j].openstatus = false;
                    psteps[j].rowstyle = {
                        rowcolor: {
                            backgroundColor:'#d4edf7'
                        }
                    };
                    psteps[j].sectionbtn = {
                        styles:{color:''}
                    };
                    psteps[j].chkval = false;
                    psteps[j].checkbox = false;
                }else {
                    var splitOp = [];
                    splitOp =  psteps[j].Step.split('.');
                    var joinOpPre = splitOp.splice(0,splitOp.length-1);
                    var joinOp = joinOpPre.join('');

                    psteps[j].index = parseFloat(psteps[j].Step);
                    psteps[j].class = "fa fa-caret-right"; 
                    psteps[j].header = false;
                    psteps[j].headertype = "listitem";
                    psteps[j].headervalue = psteps[j].Step.split(".")[0];
                    psteps[j].subheadervalue = joinOp;
                    psteps[j].openstatus = false;
                    psteps[j].rowstyle = {
                        rowcolor: {backgroundColor:'#e9f6fb'}
                    };
                    psteps[j].sectionbtn = {
                        styles:{color:''}
                    };
                    psteps[j].chkval = false;
                    psteps[j].checkbox = true;
                }  
            }

            //set type icon 
            for(var k=0;k<psteps.length;k++){
                var typeOfStep = psteps[k].Type.replace(/\s/g, '');
                if(typeOfStep.toUpperCase() === "HEADING"){
                    psteps[k].typeicon = "";
                    psteps[k].typecolor = {color:""};
                    psteps[k].contenttype = 'String';
                    psteps[k].buttonStatus = "";
                    if(!psteps[k].hasOwnProperty("comments")){
                        psteps[k].comments = "";
                    }
                }else if(typeOfStep.toUpperCase() === "WARNING"){
                    psteps[k].typeicon = "fa fa-exclamation-triangle";
                    psteps[k].typecolor = {color:"#ff0000"};
                    psteps[k].contenttype = 'AlertInfo';
                    psteps[k].buttonStatus = "";
                    if(!psteps[k].hasOwnProperty("comments")){
                        psteps[k].comments = "";
                    }
                }else if(typeOfStep.toUpperCase() === "CAUTION"){
                    psteps[k].typeicon = "fa fa-exclamation-triangle";
                    psteps[k].typecolor = {color:"#ffcc00"};
                    psteps[k].contenttype = 'AlertInfo';
                    psteps[k].buttonStatus = "";
                    if(!psteps[k].hasOwnProperty("comments")){
                        psteps[k].comments = "";
                    }
                }else if(typeOfStep.toUpperCase() === "RECORD"){
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
                }else if(typeOfStep.toUpperCase() === "VERIFY"){
                    psteps[k].typeicon = "fa fa-check-circle-o";
                    psteps[k].typecolor = {color:""};
                    psteps[k].contenttype = 'String';
                    psteps[k].buttonStatus = "";
                    if(!psteps[k].hasOwnProperty("comments")){
                        psteps[k].comments = "";
                    }
                }else if(typeOfStep.toUpperCase() === "ACTION"){
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
                }else if(typeOfStep.toUpperCase() === "DECISION"){
                    psteps[k].typeicon = "fa fa-dot-circle-o";
                    psteps[k].typecolor = {color:""};
                    psteps[k].contenttype = 'DecisionInfo';
                    psteps[k].buttonStatus = "";
                    if(!psteps[k].hasOwnProperty("comments")){
                        psteps[k].comments = "";
                    }                   
                }else if(typeOfStep.toUpperCase() === "INFO"){
                    psteps[k].typeicon = "fa fa-info-circle";
                    psteps[k].typecolor = {color:""};
                    psteps[k].contenttype = 'String';
                    psteps[k].buttonStatus = "";
                    if(!psteps[k].hasOwnProperty("comments")){
                        psteps[k].comments = "";
                    }
                }
            }

            //check for role and disable the steps if not permitted
            for(var a=0;a<psteps.length;a++){
                psteps[a].Role = psteps[a].Role.toUpperCase();
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

    //Function to get procedure links of the dependent procedures to be executed in a decision step
    function getValidLinks(procList,steps){
        //check for dependent procedures
        for(var a=0;a<steps.length;a++){
            if(steps[a].Procedures){
                steps[a].dependentProcedures = [];
                var listOfProcs = [];
                var dependentProcedures = getDependentProcedures(steps[a]);
                for(var b=0;b<dependentProcedures.length;b++){
                    for(var c=0;c<procList.length;c++){
                        if(dependentProcedures[b] === procList[c].procedureID){
                            if(procList[c].instances.length > 0){
                                var running = 0;
                                var latestInstance;
                                for(var i=0;i<procList[c].instances.length;i++){
                                    if(procList[c].instances[i].running === true){
                                        running++;
                                        latestInstance = procList[c].instances[i].revision;
                                    }
                                }

                                if(running > 0){
                                    listOfProcs.push({
                                        "id":procList[c].procedureID,
                                        "version":procList[c].versions.length,
                                        "revision":latestInstance,
                                        "running":running,
                                        "exists":true
                                    });
                                }else {
                                    listOfProcs.push({
                                        "id":procList[c].procedureID,
                                        "version":procList[c].versions.length,
                                        "revision":"",
                                        "running":0,
                                        "exists":true
                                    });
                                }
                            }else {
                                listOfProcs.push({
                                    "id":procList[c].procedureID,
                                    "version":procList[c].versions.length,
                                    "revision":"",
                                    "running":0,
                                    "exists":true
                                });
                            }
                        }else if(c === procList.length -1 && dependentProcedures[b] !== procList[c].procedureID && ifFound(listOfProcs,dependentProcedures[b]) === false){
                            listOfProcs.push({
                                "id":dependentProcedures[b],
                                "version":"",
                                "revision":"",
                                "running":0,
                                "exists":false
                            });
                        }
                    }
                }
                steps[a].dependentProcedures = listOfProcs;
            }else {
                 steps[a].dependentProcedures = [];
            }
        }
        return steps;
    }

    //Function to toggle the arrow icon status of a section
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
                        }else if(index === parseInt(liststeps[i].headervalue) && liststeps[i].headertype === "listitem"){
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

    //Function to get all the completed steps with their step colors
    function getCompletedSteps(steps){
        if(steps.length > 0){
            for(var d=0;d<steps.length;d++){
                if(steps[d].Info !== ""){
                    if(steps[d].headertype === 'mainheader'){
                        steps[d].rowstyle = {
                            rowcolor : {
                                backgroundColor:'#9fdf9f'
                            }
                        };
                    }else if(steps[d].headertype === 'subheader'){
                        steps[d].rowstyle = {
                            rowcolor : {
                                backgroundColor:'#b3e6b3'
                            }
                        };
                    }else if(steps[d].headertype === 'listitem'){
                        steps[d].rowstyle = {
                            rowcolor : {
                                backgroundColor:'#c6ecc6'
                            }
                        };
                    }
                    // steps[d].rowstyle = {
                    //     rowcolor : {
                    //         backgroundColor:'#c6ecc6'
                    //     }
                    // };
                    steps[d].chkval = true;
                }else {
                    if(steps[d].headertype === 'mainheader'){
                        steps[d].rowstyle = {
                            rowcolor : {backgroundColor:'#bee4f3'}
                        };
                    }else if(steps[d].headertype === 'subheader'){
                        steps[d].rowstyle = {
                            rowcolor : {backgroundColor:'#d4edf7'}
                        };
                    }else if(steps[d].headertype === 'listitem'){
                        steps[d].rowstyle = {
                            rowcolor : {backgroundColor:'#e9f6fb'}
                        };  
                    }
                    // steps[d].rowstyle = {
                    //     rowcolor : {backgroundColor:'#e9f6fb'}
                    // };
                    steps[d].chkval = false;
                }
            }
        }
        return steps;
    }

    //Function to split a string and save to the array based on a delimiter
    function createArrayOfString(content,delimiter){
        var arrayOfContents = [];
        arrayOfContents = content.split(delimiter);
        return arrayOfContents;
    }

    //Function to set the current view revision obtained when instance is saved
    function setCurrentViewRevision(revisionNum){
        currentViewRevision.value = revisionNum;
    }

    //Function to get the current view revision to be used by controllers
    function getCurrentViewRevision(){
        return currentViewRevision
    }

    //Function to create a procedure link to be able to display in a decision step
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

    //Function to disable steps when in archived mode
    function disableSteps(steps){
        if(steps.length > 0){
            for(var d=0;d<steps.length;d++){
                if(steps[d].Info !== ""){
                    if(steps[d].headertype === 'mainheader'){
                        steps[d].rowstyle = {
                            rowcolor : {backgroundColor:'#9fdf9f'}
                        };
                    }else if(steps[d].headertype === 'subheader'){
                        steps[d].rowstyle = {
                            rowcolor : {backgroundColor:'#b3e6b3'}
                        };
                    }else if(steps[d].headertype === 'listitem'){
                        steps[d].rowstyle = {
                            rowcolor : {backgroundColor:'#c6ecc6'}
                        };
                    }

                    steps[d].chkval = true;
                    steps[d].status = true;
                }else {
                    steps[d].status = true;
                }
            }
        }
        return steps;
    }

    //Function to store comments for a procedure step in database
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
                psteps[a].Role = psteps[a].Role.toUpperCase();
                if(psteps[a].Role.includes(callsign)){
                    psteps[a].status = false;
                }else {
                    psteps[a].status = true;
                }
            }
        }
        return psteps;
    }

    //Function to get the main section header index of a step
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

    //Function to get the next main section header index of a step
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

    //Function to get the sub section index of a step
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

    //Function to get the next sub section index of a step
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


    //Function to get step permissions based on the step role
    function getStepPermissions(psteps,callsign){
        var len = psteps.length;
        //check for role and disable the steps if not permitted
        for(var a=0;a<len;a++){
            psteps[a].Role = psteps[a].Role.toUpperCase();
            if(psteps[a].Role.includes(callsign)){
                psteps[a].status = false;
            }else {
                psteps[a].status = true;
            }
        }
        return psteps;
    }

    //Function to display angular material toast to display error or success messages
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

    //Function to set user online or offline status based on the page url
    function setUserStatus(location,emailaddress,username,pid,revision,status){
        var locationOp1 = location.split("/"); // to split the current location string
        if(locationOp1.length === 4){
            //location: /dashboard/procedure/:procID
            return $http({
                url: "/setUserStatus", 
                method: "POST",
                data: {"email":emailaddress,"status":status,"pid":pid,"username":username,"revision":revision}
            });
        }
        else if(locationOp1.length === 6){ // if length is 6,then the current location is running instance
            //location: /dashboard/procedure/runninginstance/:procID/:revisionID
            return $http({
                url: "/setUserStatus", 
                method: "POST",
                data: {"email":emailaddress,"status":status,"pid":pid,"username":username,"revision":revision}
            });
        }else {
            // for all other locations in the application
            return $http({
                url: "/setUserStatus", 
                method: "POST",
                data: {"email":emailaddress,"status":status,"pid":pid,"username":username,"revision":revision}
            });
        }
    }

    //Function to update procedure name
    function updateProcedureName(procId,newprocedurename){
        return $http({
            url: "/updateProcedureName", 
            method: "POST",
            data: {"procId":procId,"newprocedurename":newprocedurename}
        }); 
    }

    //Function to get all roles used in quantum
    function getQuantumRoles(){
        return $http({
            url:"/getQuantumRoles",
            method: "GET",
            params: {}
        });
    }

    //Function to set roles
    function setQuantumRoles(roles){
        validRoles.callsigns = roles;
    }

    //Function to get all valid roles
    function getValidRoles(){
        return validRoles;
    }

    //Function to get all dependent procedures index numbers of a decision step
    function getDependentProcedures(step){
        var stepProcedures = [];
        var stepProceduresParams = [];
        var stepProc = "";
        if(step.Procedures.length > 0){
            stepProc = step.Procedures.replace(/\s/g, '');
            if(stepProc.includes(",")){
                stepProcedures = stepProc.split(",");
                return stepProcedures;
            }
        }
    }

    //Function to check if the procedures in a decision step exist previously in the database
    function ifFound(procList,elem){
        var found = false;
        for(var i = 0; i < procList.length; i++) {
            if (procList[i].id == elem) {
                found = true;
                break;
            }
        }
        return found;
    }

    //Function to set procedure instance with revision number
    function setprocRevisions(procid,revision){
        procs.revisions.push({
            "procId":procid,
            "revision":revision
        });
    }

    //Function to get procedure instance with revision number
    function getprocRevisions(){
        return procs;
    }

    //Function to sections headers of a steps
    function getAllParents(steps){
        for(var a=0;a<steps.length;a++){
            var stepParent = getParentTag(steps[a]);
            var isParent = ifParentExists(stepParent,steps);
            if(isParent.status === true){
                steps[a].parent = stepParent.step;
                steps[a].parentIndex = isParent.index;
            }else if(isParent.status === false){
                steps[a].parent = '';
                steps[a].parentIndex = '';
            }
        }
        return steps;
    }

    //Function to check if a parent exists for a step
    function ifParentExists(pTag,steps){
        var parentStatus = {'status':false,'index':''};
        if(pTag.step && pTag.step.length > 0){
            for(var i=0;i<steps.length;i++){
                if(steps[i].Step === pTag.step && steps[i].Type.toUpperCase() === headingType.name.toUpperCase()){
                    parentStatus.status = true;
                    parentStatus.index = i;
                    break;
                }
            }
        }else {
            parentStatus.status = false;
            parentStatus.index = '';
        }

        return parentStatus;
    }

    //Function to get parent-section header number based on step number
    function getParentTag(step){
        var pTag = {
            step:''
        };
        if(step.Type.toUpperCase() !== headingType.name.toUpperCase()){
            var splitOp = [];
            splitOp = step.Step.split('.');
            var joinOpPre = splitOp.splice(0,splitOp.length-1)
            var joinOp = joinOpPre.join('.');
            pTag.step = joinOp+'.0';
        }else if(step.Type.toUpperCase() === headingType.name.toUpperCase()){
            if(step.Step.length > 3){
                var splitOp = [];
                splitOp = step.Step.split('.');
                var joinOpPre = splitOp.slice(0,splitOp.length-2)
                var joinOp = joinOpPre.join('.');
                pTag.step = joinOp+'.0';
            }else {
                pTag = {
                    step:''
                };
            }

        }
        return pTag;
    }

    //Function to display steps arrow icon status based on section header toggle status
    function showstepList(id,steps){
        var listSteps = [];
        if(steps[id].class === "fa fa-caret-right"){
            steps[id].class = "fa fa-caret-down";
            for(var i=id+1;i<steps.length;i++){
                if(steps[i].parent === steps[id].Step){
                    steps[i].openstatus = true;
                    listSteps.push(steps[i]);
                }
            }
        }else if(steps[id].class === "fa fa-caret-down"){
            steps[id].class = "fa fa-caret-right";
            for(var j=id+1;j<steps.length;j++){
                if(steps[j].parent === steps[id].Step){
                    if(steps[j].class="fa fa-caret-down"){
                        steps[j].class="fa fa-caret-right";
                    }
                    steps[j].openstatus = false;
                    listSteps.push(steps[j]);
                }
            }


            for(var a=id+1;a<steps.length;a++){
                if(steps[id].headertype === "mainheader"){
                    if(steps[a].headervalue === steps[id].headervalue){
                        steps[a].openstatus = false;
                        if(steps[a].class="fa fa-caret-down"){
                            steps[a].class="fa fa-caret-right";
                        }
                    }
                }else if(steps[id].headertype === "subheader"){
                    if(steps[a].headervalue === steps[id].headervalue && steps[a].subheadervalue.includes(steps[id].subheadervalue)){
                        steps[a].openstatus = false;
                        if(steps[a].class="fa fa-caret-down"){
                            steps[a].class="fa fa-caret-right";
                        }
                    }
                }
            }

        }
        return steps;
    }

    //Function to get all siblings of a step
    function getSiblings(index,steps,stepParent){
        var siblings = [];
        if(stepParent.length > 0){
            for(var i=0;i<steps.length;i++){
                if(steps[i].parent === stepParent && i !== index){
                    siblings.push({"index":i,"step":steps[i]});
                }
            }
        }else {
            siblings = [];
        }
        return siblings;
    }

    //Function to get parents of a section and if its children are completed and set parents as done
    function getAllParentList(parentIndex,steps){
        var allParents = [];
        var allCompParents = [];
        //get all parents
        for(var a=parentIndex-1;a>=0;a--){
            if(steps[a].headervalue === steps[parentIndex].headervalue && steps[a].headertype !== 'listitem' && steps[a].Step.length < steps[parentIndex].Step.length){
                allParents.push({'parent':steps[a],'children':[],'index':a});
            }
        }
        //check its children
        // for all the parents in allParents check if all steps are completed
        for(var b=0;b<allParents.length;b++){
            for(var c=0;c<steps.length;c++){
                if(steps[c].parent === allParents[b].parent.Step){
                    allParents[b].children.push(steps[c]);
                }
            }
        }

        for(var d=0;d<allParents.length;d++){
            var childrenLen = allParents[d].children.length;
            var compcount = 0;
            for(var k=0;k<childrenLen;k++){
                if(allParents[d].children[k].Info && allParents[d].children[k].Info.length > 0){
                    compcount++;
                }
            }
            if(childrenLen === compcount){
                allParents[d].parent.Info = "done";
                allParents = checkallParents(allParents[d].parent.Step,allParents);
                allCompParents.push(allParents[d]);
            }

        }

        //finalize parents
        return allCompParents;
    }

    //Function to unset all parents of a section of a step when unchecked
    function getAllParentTree(parentIndex,steps){
        var allParents = [];
        var allCompParents = [];
        //get all parents
        for(var a=parentIndex-1;a>=0;a--){
            if(steps[a].headervalue === steps[parentIndex].headervalue && steps[a].headertype !== 'listitem' && steps[a].Step.length < steps[parentIndex].Step.length){
                steps[a].Info = "";
                allParents.push({'parent':steps[a],'children':[],'index':a});
            }
        }
        //check its children
        // for all the parents in allParents check if all steps are completed
        for(var b=0;b<allParents.length;b++){
            for(var c=0;c<steps.length;c++){
                if(steps[c].parent === allParents[b].parent.Step){
                    allParents[b].children.push(steps[c]);
                }
            }
        }

        for(var d=0;d<allParents.length;d++){
            allParents[d].parent.Info = "";
            allParents = nocheckallParents(allParents[d].parent.Step,allParents);
            allCompParents.push(allParents[d]);
        }

        //finalize parents
        return allCompParents;
    }


    function checkallParents(step,allParents){
        for(var a=0;a<allParents.length;a++){
            for(var b=0;b<allParents[a].children.length;b++){
                if(allParents[a].children[b].Step === step){
                    allParents[a].children[b].Info = 'done';
                    break;
                }
            }
        }
        return allParents;
    }

    function nocheckallParents(step,allParents){
        for(var a=0;a<allParents.length;a++){
            for(var b=0;b<allParents[a].children.length;b++){
                if(allParents[a].children[b].Step === step){
                    allParents[a].children[b].Info = '';
                    break;
                }
            }
        }
        return allParents;
    }

    //Function to set info for section header
    function setParentsInfo(parentsArray,id,usernamerole,revision,lastuse,inputStepValues,info){
        return $http({
            url: "/setParentsInfo", 
            method: "POST",
            data: {"parentsArray":parentsArray,"id":id,"usernamerole":usernamerole,"revision":revision,"lastuse":lastuse,"inputStepValues":inputStepValues,"info":info}
        }); 
    }

    function getStepHeadingName(){
        return headingType;
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
        setUserStatus : setUserStatus,
        updateProcedureName : updateProcedureName,
        getQuantumRoles : getQuantumRoles,
        setQuantumRoles : setQuantumRoles,
        getValidRoles : getValidRoles,
        getValidLinks : getValidLinks,
        setprocRevisions : setprocRevisions,
        getprocRevisions : getprocRevisions,
        getAllParents : getAllParents,
        showstepList : showstepList,
        getSiblings : getSiblings,
        getAllParentList : getAllParentList,
        setParentsInfo : setParentsInfo,
        getAllParentTree : getAllParentTree,
        nocheckallParents : nocheckallParents,
        getStepHeadingName : getStepHeadingName
    }
}]);