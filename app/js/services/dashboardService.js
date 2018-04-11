quantum
.factory('dashboardService', ['$http', '$window','procedureService', function($http, $window,procedureService) { 

    var locks = {
        lockLeft : false,
        lockRight : false
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

    function changeHeaderWithLocation(nextLocation,pid,ptitle,revNum,windowWidth){
        if(revNum !== ""){
            //from running instance,archived instance index and new instance page
            if(nextLocation === "/dashboard"){
                procedureService.setHeaderStyles('block','none','#ffffff','#000000','inline-block','none',windowWidth);
                procedureService.setProcedureName('','',"Home");
            } else if(nextLocation === "/dashboard/procedure/"+pid){
                procedureService.setHeaderStyles('none','block','#05aec3f2','#ffffff','none','inline-block',windowWidth);
                procedureService.setProcedureName(pid,ptitle,"Live");
            } else if(nextLocation === "/dashboard/procedure/running/"+pid){
                procedureService.setHeaderStyles('none','block','#05aec3f2','#ffffff','none','inline-block',windowWidth);
                procedureService.setProcedureName(pid,ptitle,"Open Procedure");
            } else if(nextLocation === "/dashboard/procedure/archived/"+pid){
                procedureService.setHeaderStyles('none','block','#000000','#ffffff','none','inline-block',windowWidth);
                procedureService.setProcedureName(pid,ptitle,"AS-Run Archive");
            }else if(nextLocation === "/dashboard/procedure/runninginstance/"+pid+"/"+revNum){
                procedureService.setHeaderStyles('none','block','#05aec3f2','#ffffff','none','inline-block',windowWidth);
                procedureService.setProcedureName(pid,ptitle,"Live");
            }else if(nextLocation === "/dashboard/procedure/archivedinstance/"+pid+"/"+revNum){
                procedureService.setHeaderStyles('none','block','#000000','#ffffff','none','inline-block',windowWidth);
                procedureService.setProcedureName(pid,ptitle,"AS-Run Archive");
            }else {
                procedureService.setHeaderStyles('block','none','#ffffff','#000000','inline-block','none',windowWidth);
                procedureService.setProcedureName('','',"Home");
            } 
  
        }else {
            // from running index page and archived index page
            if(nextLocation === "/dashboard"){
                procedureService.setHeaderStyles('block','none','#ffffff','#000000','inline-block','none',windowWidth);
                procedureService.setProcedureName('','',"Home");
            } else if(nextLocation === "/dashboard/procedure/"+pid){
                procedureService.setHeaderStyles('none','block','#05aec3f2','#ffffff','none','inline-block',windowWidth);
                procedureService.setProcedureName(pid, ptitle,"Live");
            } else if(nextLocation === "/dashboard/procedure/running/"+pid ){
                procedureService.setHeaderStyles('none','block','#05aec3f2','#ffffff','none','inline-block',windowWidth);
                procedureService.setProcedureName(pid, ptitle,"Open Procedure");
            } else if(nextLocation === "/dashboard/procedure/archived/"+pid){
                procedureService.setHeaderStyles('none','block','#000000','#ffffff','none','inline-block',windowWidth);
                procedureService.setProcedureName(pid, ptitle,"AS-Run Archive");
            }else if(nextLocation.includes("/dashboard/procedure/runninginstance/"+pid+"/")){
                procedureService.setHeaderStyles('none','block','#05aec3f2','#ffffff','none','inline-block',windowWidth);
                procedureService.setProcedureName(pid, ptitle,"Live");
            }else if(nextLocation.includes("/dashboard/procedure/archivedinstance/"+pid+"/")){
                procedureService.setHeaderStyles('none','block','#000000','#ffffff','none','inline-block',windowWidth);
                procedureService.setProcedureName(pid, ptitle,"AS-Run Archive");
            }else {
                procedureService.setHeaderStyles('block','none','#ffffff','#000000','inline-block','none',windowWidth);
                procedureService.setProcedureName('','',"Home");
            }    
        }
    }
    
	return {
        locks : locks,
        getLock : getLock,
        setLeftLock : setLeftLock,
        setRightLock : setRightLock,
        changeHeaderWithLocation : changeHeaderWithLocation
	}
}]);
