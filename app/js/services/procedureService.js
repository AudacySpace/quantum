quantum
.factory('procedureService', ['$http', function($http) {

    var procedure = {
        id:"",
        name:"",
        status:"",
        fullname : "",
    }
    var icons = {
        icon1style:"",
        icon2style:""
    }
    var header = {
        styles:{}
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

    function setHeaderStyles(icon1,icon2,bgcolor,fontcolor){
        icons.icon1style = {display:icon1};
        icons.icon2style = {display:icon2};
        header.styles = {backgroundColor:bgcolor,color:fontcolor};
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

    function saveProcedureInstance(id,usernamerole,starttime) {
        return $http({
            url: "/saveProcedureInstance", 
            method: "POST",
            data: {"id":id,"usernamerole":usernamerole,"starttime":starttime}
        });
    }

    function setInfo(info,id,step,usernamerole,revision){
        return $http({
            url: "/setInfo", 
            method: "POST",
            data: {"info":info,"id":id,"step":step,"usernamerole":usernamerole,"revision":revision}
        });  
    }

    return { 
        setProcedureName : setProcedureName,
        getProcedureName : getProcedureName,
        setHeaderStyles : setHeaderStyles,
        getHeaderStyles : getHeaderStyles,
        getIconStyles : getIconStyles,
        saveProcedureInstance : saveProcedureInstance,
        setInfo : setInfo,
        downloadProcedure : downloadProcedure
    }
}]);