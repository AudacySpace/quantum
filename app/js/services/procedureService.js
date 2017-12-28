quantum
.factory('procedureService', ['$http', function($http) {

    var procedure = {
        id:"",
        name:"",
        status:"",
        fullname : "",
    }
    function getProcedureList() {
    	return $http({
    		url: "/getProcedureList",
    		method: "GET"
    	});
    }

    function setProcedureName(id,name,status){
        procedure.id = id;
        procedure.name = name;
        procedure.status = status;
        procedure.fullname = status+":"+id+" - "+name;

    }
    function getProcedureName(){
        return procedure;
    }

    return { 
        getProcedureList : getProcedureList,
        setProcedureName : setProcedureName,
        getProcedureName : getProcedureName
    }
}]);