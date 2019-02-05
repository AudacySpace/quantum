quantum
.factory('dashboardService', ['$http', '$window','procedureService', function($http, $window,procedureService) { 

    var locks = {
        lockLeft : false,
        lockRight : false
    };

    var location = {
        url:"",
        liveindexStatus:false,
        archiveindexStatus:false,
        userListStatus:false
    }

    var sidePanel = {
       btnStyle:{"display":'block','outline': 'none','transform': 'translate3d(0, 0, 0)'}
    };

    function getLock(){
        return locks;
    }

    function setLeftLock(lock){
        locks.lockLeft = lock;
    }

    function setRightLock(lock){
       locks.lockRight = lock; 
    }

    function setHeaderLocation(nextLocation,liveindexStatus,archiveindexStatus,userListStatus){
        location.url = nextLocation;
        location.liveindexStatus = liveindexStatus;
        location.archiveindexStatus = archiveindexStatus;
        location.userListStatus = userListStatus;
    }

    function changeHeaderWithLocation(nextLocation,pid,ptitle,revNum,windowWidth){
        if(revNum !== ""){
            //from running instance,archived instance index and new instance page
            if(nextLocation === "/dashboard"){
                procedureService.setHeaderStyles('block','none','#ffffff','#000000','inline-block','none',windowWidth);
                procedureService.setProcedureName('','',"Home");
                setHeaderLocation(nextLocation,false,false,false);
            } else if(nextLocation === "/dashboard/procedure/"+pid){
                procedureService.setHeaderStyles('none','block','#05aec3f2','#ffffff','none','inline-block',windowWidth);
                procedureService.setProcedureName(pid,ptitle,"Live");
                setHeaderLocation(nextLocation,true,true,true);
            } else if(nextLocation === "/dashboard/procedure/running/"+pid){
                procedureService.setHeaderStyles('none','block','#05aec3f2','#ffffff','none','inline-block',windowWidth);
                procedureService.setProcedureName(pid,ptitle,"Open Procedure");
                setHeaderLocation(nextLocation,false,true,false);
            } else if(nextLocation === "/dashboard/procedure/archived/"+pid){
                procedureService.setHeaderStyles('none','block','#000000','#ffffff','none','inline-block',windowWidth);
                procedureService.setProcedureName(pid,ptitle,"AS-Run Archive");
                 setHeaderLocation(nextLocation,true,false,false);
            }else if(nextLocation === "/dashboard/procedure/runninginstance/"+pid+"/"+revNum){
                procedureService.setHeaderStyles('none','block','#05aec3f2','#ffffff','none','inline-block',windowWidth);
                procedureService.setProcedureName(pid,ptitle,"Live");
                 setHeaderLocation(nextLocation,true,true,true);
            }else if(nextLocation === "/dashboard/procedure/archivedinstance/"+pid+"/"+revNum){
                procedureService.setHeaderStyles('none','block','#000000','#ffffff','none','inline-block',windowWidth);
                procedureService.setProcedureName(pid,ptitle,"AS-Run Archive");
                setHeaderLocation(nextLocation,true,true,false);
            }else if(nextLocation === "/dashboard/viewProcedure/"+pid){
                procedureService.setHeaderStyles('block','none','#ffffff','#000000','none','inline-block',windowWidth);
                procedureService.setProcedureName(pid,ptitle,"Preview Procedure");
                setHeaderLocation(nextLocation,true,true,false);
            }else {
                procedureService.setHeaderStyles('block','none','#ffffff','#000000','inline-block','none',windowWidth);
                procedureService.setProcedureName('','',"Home");
                setHeaderLocation(nextLocation,false,false,false);
            } 
  
        }else {
            // from running index page and archived index page
            if(nextLocation === "/dashboard"){
                procedureService.setHeaderStyles('block','none','#ffffff','#000000','inline-block','none',windowWidth);
                procedureService.setProcedureName('','',"Home");
                 setHeaderLocation(nextLocation,false,false,false);
            } else if(nextLocation === "/dashboard/procedure/"+pid){
                procedureService.setHeaderStyles('none','block','#05aec3f2','#ffffff','none','inline-block',windowWidth);
                procedureService.setProcedureName(pid, ptitle,"Live");
                setHeaderLocation(nextLocation,true,true,true);
            } else if(nextLocation === "/dashboard/procedure/running/"+pid ){
                procedureService.setHeaderStyles('none','block','#05aec3f2','#ffffff','none','inline-block',windowWidth);
                procedureService.setProcedureName(pid, ptitle,"Open Procedure");
                setHeaderLocation(nextLocation,false,true,false);
            } else if(nextLocation === "/dashboard/procedure/archived/"+pid){
                procedureService.setHeaderStyles('none','block','#000000','#ffffff','none','inline-block',windowWidth);
                procedureService.setProcedureName(pid, ptitle,"AS-Run Archive");
                setHeaderLocation(nextLocation,true,false,false);
            }else if(nextLocation.includes("/dashboard/procedure/runninginstance/"+pid+"/")){
                procedureService.setHeaderStyles('none','block','#05aec3f2','#ffffff','none','inline-block',windowWidth);
                procedureService.setProcedureName(pid, ptitle,"Live");
                setHeaderLocation(nextLocation,true,true,true);
            }else if(nextLocation.includes("/dashboard/procedure/archivedinstance/"+pid+"/")){
                procedureService.setHeaderStyles('none','block','#000000','#ffffff','none','inline-block',windowWidth);
                procedureService.setProcedureName(pid, ptitle,"AS-Run Archive");
                setHeaderLocation(nextLocation,true,true,false);
            }else if(nextLocation === "/dashboard/viewProcedure/"+pid){
                procedureService.setHeaderStyles('block','none','#ffffff','#000000','none','inline-block',windowWidth);
                procedureService.setProcedureName(pid,ptitle,"Preview Procedure");
                setHeaderLocation(nextLocation,true,true,false);
            }else {
                procedureService.setHeaderStyles('block','none','#ffffff','#000000','inline-block','none',windowWidth);
                procedureService.setProcedureName('','',"Home");
                setHeaderLocation(nextLocation,false,false,false);
            }    
        }
    }

    function getHeaderLocation(){
        return location;
    }

    function setSidePanelButton(button){
        sidePanel.btnStyle = button;
    }
    function getSidePanelButton(){
        return sidePanel;
    }
    
	return {
        locks : locks,
        getLock : getLock,
        setLeftLock : setLeftLock,
        setRightLock : setRightLock,
        changeHeaderWithLocation : changeHeaderWithLocation,
        setHeaderLocation : setHeaderLocation,
        getHeaderLocation : getHeaderLocation,
        setSidePanelButton : setSidePanelButton,
        getSidePanelButton : getSidePanelButton
	}
}]);
