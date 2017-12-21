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
    return { 
        getProcedureList : getProcedureList,
        getExistingProcedureIds : getExistingProcedureIds
    }
}]);