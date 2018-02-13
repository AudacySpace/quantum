describe('Test Suite for Run Index Controller', function () {
    var controller,scope,procedureService, deferred, $q;

    beforeEach(function () {
        // load the module
        module('quantum');

        inject(function($controller, $rootScope, _$q_, _procedureService_,$routeParams){
            scope = $rootScope.$new();
            $q = _$q_;
            procedureService = _procedureService_;
            deferred = _$q_.defer();
            spyOn(procedureService, "getAllInstances").and.returnValue(deferred.promise);

            controller = $controller('runIndexCtrl', {
                $scope: scope,
                $routeParams: {procID: '1.1'},
                procedureService: procedureService
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

    it('should define sortType and set it to a default value procedurestarted', function() {
        expect(scope.sortType).toBeDefined();
        expect(scope.sortType).toEqual('procedurestarted');
    });

    it('should define sortReverse and set it to a default value false', function() {
        expect(scope.sortReverse).toBeDefined();
        expect(scope.sortReverse).toEqual(false);
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
    });

});