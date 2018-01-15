quantum
.factory('procedureService', ['$http', function($http) {
    function getProcedureList() {
    	return $http({
    		url: "/getProcedureList",
    		method: "GET"
    	});
    }

    function getExistingProcedureIds(){
    	return $http({
    		url:"/getExistingProcedureIds",
    		method:GET
    	})
    }

    function downloadProcedure(id){
        return $http({
            url:"/getProcedureData",
            method: "GET",
            params: {"id": id}
        })
    }

    return { 
        getProcedureList : getProcedureList,
        getExistingProcedureIds : getExistingProcedureIds,
        downloadProcedure : downloadProcedure
    }
}]);