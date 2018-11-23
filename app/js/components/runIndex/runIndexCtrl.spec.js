describe('Test Suite for Run Index Controller', function () {
    var controller,scope,procedureService, deferred, $q,dashboardService,$location,rootScope,userService;

    var windowMock = {
        innerWidth: 1000,
        user : {
            currentRole : {callsign : 'MD'}
        }
    };

    beforeEach(function () {
        // load the module
        module('quantum', function ($provide) {
            $provide.value('$window', windowMock);

        });

        inject(function($controller, $rootScope, _$q_, _procedureService_,$routeParams,$location,_dashboardService_,_userService_){
            scope = $rootScope.$new();
            rootScope = $rootScope;
            $q = _$q_;
            procedureService = _procedureService_;
            deferred = _$q_.defer();
            dashboardService = _dashboardService_;
            userService = _userService_;
            deferredHeaderStyles = _$q_.defer();
            deferredProcName = _$q_.defer();
            spyOn($location, 'url').and.returnValue('/dashboard/procedure/runninginstance/1.1/2/1');
            spyOn(procedureService, "getAllInstances").and.returnValue(deferred.promise);
            spyOn(procedureService, "setHeaderStyles").and.returnValue(deferredHeaderStyles.promise);
            spyOn(procedureService, "setProcedureName").and.returnValue(deferredProcName.promise);
            spyOn(userService, "getUserName").and.returnValue('John Smith');
            spyOn(userService,"getUserEmail").and.returnValue('jsmith@gmail.com');

            spyOn(procedureService,'getProcedureName').and.returnValue({
                id:"1.1",
                name:"Audacy Zero - Procedure Example",
                status:"",
                fullname:"Audacy Zero - Procedure Example.xlsx"
            });

            deferredHeaderChange =  _$q_.defer();
            spyOn(dashboardService, "changeHeaderWithLocation").and.returnValue(deferredHeaderChange.promise);

            deferredUserStatus = _$q_.defer();
            spyOn(procedureService, "setUserStatus").and.returnValue(deferredUserStatus.promise);

            controller = $controller('runIndexCtrl', {
                $scope: scope,
                $routeParams: {procID: '1.1'},
                procedureService: procedureService,
                dashboardService: dashboardService,
                userService: userService
            });
        });
    });

    it('should define the runIndex controller', function() {
        expect(controller).toBeDefined();
    });

    it('should define params and set it to routeParams', function() {
        expect(scope.params).toBeDefined();
        expect(scope.params.procID).toEqual('1.1');
    });

    it('should define sortType and set it to a default value startedAt', function() {
        expect(scope.sortType).toBeDefined();
        expect(scope.sortType).toEqual('startedAt');
    });

    it('should define sortReverse and set it to a default value false', function() {
        expect(scope.sortReverse).toBeDefined();
        expect(scope.sortReverse).toEqual(true);
    });

    it('should call the service to get all instances of a procedure', function() {
        var result  = { "instances" :[
                {
                    "openedBy": "Taruni Gattu(VIP)",
                    "Steps": [
                        {
                            "step": "1.0",
                            "info": "034.11:26:35 UTC Taruni Gattu(VIP)"
                        },
                        {
                            "step": "1.1",
                            "info": "034.11:26:36 UTC Taruni Gattu(VIP)"
                        },
                        {
                            "step": "1.2",
                            "info": ""
                        },
                        {
                            "step": "2.0",
                            "info": ""
                        },
                        {
                            "step": "2.1.0",
                            "info": ""
                        },
                        {
                            "step": "2.1.1",
                            "info": ""
                        },
                        {
                            "step": "2.1.2",
                            "info": ""
                        },
                        {
                            "step": "2.1.3",
                            "info": ""
                        },
                        {
                            "step": "2.2.0",
                            "info": ""
                        }
                    ],
                    "closedBy": "",
                    "startedAt": "2018 - 034.11:26:34 UTC",
                    "completedAt": "",
                    "revision": 1,
                    "running": true
                },
                {
                    "openedBy": "Taruni Gattu(VIP)",
                    "Steps": [
                        {
                            "step": "1.0",
                            "info": ""
                        },
                        {
                            "step": "1.1",
                            "info": ""
                        },
                        {
                            "step": "1.2",
                            "info": ""
                        },
                        {
                            "step": "2.0",
                            "info": "034.11:26:49 UTC Taruni Gattu(VIP)"
                        },
                        {
                            "step": "2.1.0",
                            "info": "034.11:26:50 UTC Taruni Gattu(VIP)"
                        },
                        {
                            "step": "2.1.1",
                            "info": ""
                        },
                        {
                            "step": "2.1.2",
                            "info": ""
                        },
                        {
                            "step": "2.1.3",
                            "info": ""
                        },
                        {
                            "step": "2.2.0",
                            "info": ""
                        }
                    ],
                    "closedBy": "",
                    "startedAt": "2018 - 034.11:26:49 UTC",
                    "completedAt": "",
                    "revision": 2,
                    "running": true
                }
            ],
            "title":"Audacy Zero - Procedure Example"
        }
        deferred.resolve({ data : result,status : 200});
    
        // We have to call digest cycle for this to work
        scope.$digest();
        expect(scope.livelist).toBeDefined();
        expect(procedureService.getAllInstances).toHaveBeenCalledWith(scope.params.procID);
        expect(scope.livelist.length).toEqual(result.instances.length);
        expect(scope.livelist).toEqual(result.instances);
        expect(scope.procedureid).toEqual(scope.params.procID);
        expect(scope.proceduretitle).toEqual(result.title);
        expect(procedureService.setHeaderStyles).toHaveBeenCalledWith('none','block','#05aec3f2','#ffffff','none','inline-block',1000);
        expect(procedureService.setProcedureName).toHaveBeenCalledWith(scope.procedureid ,scope.proceduretitle,"Open Procedure");
    });

    it('should set archivedlist to [] if there are no running instances of a procedure or running parameter is false', function() {
        var result  = { "instances" :[
                {
                    "openedBy": "Taruni Gattu(VIP)",
                    "Steps": [
                        {
                            "step": "1.0",
                            "info": "034.11:26:35 UTC Taruni Gattu(VIP)"
                        },
                        {
                            "step": "1.1",
                            "info": "034.11:26:36 UTC Taruni Gattu(VIP)"
                        },
                        {
                            "step": "1.2",
                            "info": ""
                        },
                        {
                            "step": "2.0",
                            "info": ""
                        },
                        {
                            "step": "2.1.0",
                            "info": ""
                        },
                        {
                            "step": "2.1.1",
                            "info": ""
                        },
                    ],
                    "closedBy": "",
                    "startedAt": "2018 - 034.11:26:34 UTC",
                    "completedAt": "",
                    "revision": 1,
                    "running": false
                },
                {
                    "openedBy": "Taruni Gattu(VIP)",
                    "Steps": [
                        {
                            "step": "1.0",
                            "info": ""
                        },
                        {
                            "step": "1.1",
                            "info": ""
                        },
                        {
                            "step": "1.2",
                            "info": ""
                        },
                        {
                            "step": "2.0",
                            "info": "034.11:26:49 UTC Taruni Gattu(VIP)"
                        },
                        {
                            "step": "2.1.0",
                            "info": "034.11:26:50 UTC Taruni Gattu(VIP)"
                        },
                        {
                            "step": "2.1.1",
                            "info": ""
                        },
                    ],
                    "closedBy": "",
                    "startedAt": "2018 - 034.11:26:49 UTC",
                    "completedAt": "",
                    "revision": 2,
                    "running": false
                }
            ],
             "procedure" : {   
                "sections": [],
                "eventname": "Audacy Zero",
                "lastuse": "2018 - 034.11:26:50 UTC",
                "title": "Audacy Zero - Procedure Example",
                "id": "1.1"
            },
            "title":"Audacy Zero - Procedure Example"
        }
        deferred.resolve({ data : result,status : 200});
    
        // We have to call digest cycle for this to work
        scope.$digest();
        expect(scope.livelist).toBeDefined();
        expect(procedureService.getAllInstances).toHaveBeenCalledWith(scope.params.procID);
        expect(scope.livelist).toEqual([]);
        expect(scope.procedureid).toEqual(scope.params.procID);
        expect(scope.proceduretitle).toEqual(result.procedure.title);
        expect(procedureService.setHeaderStyles).toHaveBeenCalledWith('none','block','#05aec3f2','#ffffff','none','inline-block',1000);
        expect(procedureService.setProcedureName).toHaveBeenCalledWith(scope.procedureid ,scope.proceduretitle,"Open Procedure");
    });

    it('should call changeHeaderWithLocation function on location change', function() {
        var newUrl = '/dashboard/procedure/runninginstance/1.1/2/1';
        var oldUrl = '/dashboard/procedure/running/1.1';
        deferredUserStatus.resolve({ data :{},status : 200});
        scope.$apply(function() {
            rootScope.$broadcast('$locationChangeStart', newUrl, oldUrl);
        });
        expect(dashboardService.changeHeaderWithLocation).toHaveBeenCalled();
    });


    it('should set user status as true and call changeHeaderWithLocation function on location change', function() {
        var newUrl = '/dashboard/procedure/runninginstance/1.1/2/1';
        var oldUrl = '/dashboard/procedure/running/1.1';
        deferredUserStatus.resolve({ data :{},status : 200});

        scope.$apply(function() {
            rootScope.$broadcast('$locationChangeStart', newUrl, oldUrl);
        });

        expect(procedureService.setUserStatus).toHaveBeenCalledWith(newUrl,'jsmith@gmail.com','John Smith','1.1',1,true);
        expect(dashboardService.changeHeaderWithLocation).toHaveBeenCalledWith(newUrl,'1.1','Audacy Zero - Procedure Example','',1000);
    });

});