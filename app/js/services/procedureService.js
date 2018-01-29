quantum
.factory('procedureService', ['$http','$window', function($http,$window) {

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
    function getProcedureList() {
    	return $http({
    		url: "/getProcedureList",
    		method: "GET"
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

    function setHeaderStyles(icon1,icon2,bgcolor,fontcolor,icon3,icon4){
        if($window.innerWidth > 500){
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

    function saveProcedureInstance(id,usernamerole,lastuse) {
        return $http({
            url: "/saveProcedureInstance", 
            method: "POST",
            data: {"id":id,"usernamerole":usernamerole,"lastuse":lastuse}
        });
    }

    function setInfo(info,id,step,usernamerole,revision,lastuse){
        return $http({
            url: "/setInfo", 
            method: "POST",
            data: {"info":info,"id":id,"step":step,"usernamerole":usernamerole,"revision":revision,"lastuse":lastuse}
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
                }  
            }

            //set type icon 
            for(var k=0;k<psteps.length;k++){
                if(psteps[k].Type === "Heading"){

                }else if(psteps[k].Type === "Warning"){
                    psteps[k].typeicon = "fa fa-exclamation-triangle";
                }else if(psteps[k].Type === "Caution"){
                    psteps[k].typeicon = "fa fa-exclamation-circle";
                }else if(psteps[k].Type === "Record"){
                    psteps[k].typeicon = "fa fa-pencil-square-o";
                }else if(psteps[k].Type === "Verify"){
                    psteps[k].typeicon = "fa fa-check-circle-o";
                }else if(psteps[k].Type === "Action"){
                    psteps[k].typeicon = "fa fa-cog";
                }else if(psteps[k].Type === "Decision"){
                    psteps[k].typeicon = "fa fa-dot-circle-o";
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

        return psteps;

    }

    function showPList(id,index,headertype,liststeps){
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
        }

        return liststeps;

    }

    function checkIfEmpty(steps){
        var stepcount = 0;
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
    }

    function openNextSteps(steps,index){
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
            while(steps[newindex].headertype !== "mainheader"){
                steps[newindex].openstatus = true;
                steps[index].class = "fa fa-caret-down";
                if(newindex === steps.length-1){
                    break;
                }else {
                    newindex = newindex+1;
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
            }
        }
        return steps;
    }

    function archiveThisProcedure(steps){
        var count = 0;
        for(var i=0;i<steps.length;i++){
            if(steps[i].Info){
                count++;
            }
        }

        if(count === steps.length-1){
            return true;
        }else {
            return false;
        }
    }

    function getCompletedSteps(steps){
            for(var d=0;d<steps.length;d++){
                if(steps[d].Info !== ""){
                    steps[d].rowstyle = {
                        rowcolor : {backgroundColor:'#c6ecc6'}
                    };
                    steps[d].chkval = true;
                    steps[d].status = true;
                }
            }
        return steps;
    }

    return { 
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
        archiveThisProcedure : archiveThisProcedure,
        getCompletedSteps : getCompletedSteps
    }
}]);