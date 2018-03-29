describe('Test Suite for Dashboard Service', function () {
    var dashboardService, httpBackend,procedureService;

    beforeEach(function () {
        // load the module
        module('quantum');

        procedureService = jasmine.createSpyObj('procedureService', ['setHeaderStyles', 'setProcedureName']);

        module(function($provide) {
            $provide.value('procedureService', procedureService);
        });

        // get your service, also get $httpBackend
        // $httpBackend will be a mock.
        inject(function (_$httpBackend_, _dashboardService_) {
            dashboardService = _dashboardService_;
            httpBackend = _$httpBackend_;
            // procedureService = _procedureService_;
            // deferred = _$q_.defer();
            // spyOn(procedureService, "setHeaderStyles").and.returnValue(deferred.promise);
            // spyOn(procedureService, "setProcedureName").and.returnValue(deferred.promise);
        });
    });

 
    // make sure no expectations were missed in your tests.
    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    //dashboardService should exist in the application
    it('should define the service dashboardService', function() {
        expect(dashboardService).toBeDefined();
    });

    it('should define the default locks variable', function() {
        expect(dashboardService.locks).toBeDefined();
        expect(dashboardService.locks).toEqual({ lockLeft : false, lockRight : false });
    });

    it('should define the getLock function', function() {
        expect(dashboardService.getLock).toBeDefined();
    });

    it('should return the locks variable when getLocks is called', function() {
        expect(dashboardService.getLock()).toEqual({ lockLeft : false, lockRight : false });
    });

    it('should define the setLeftLock function', function() {
        expect(dashboardService.setLeftLock).toBeDefined();
    });

    it('should set the left lock on dashboard when setLeftLock function is called', function() {
        dashboardService.setLeftLock(true);
        expect(dashboardService.locks).toEqual({ lockLeft : true, lockRight : false });
        
        dashboardService.setLeftLock(false);
        expect(dashboardService.locks).toEqual({ lockLeft : false, lockRight : false });
    });

    it('should define the setRightLock function', function() {
        expect(dashboardService.setRightLock).toBeDefined();
    });

    it('should set the right lock on dashboard when setRightLock function is called', function() {
        dashboardService.setRightLock(true);
        expect(dashboardService.locks).toEqual({ lockLeft : false, lockRight : true });
        
        dashboardService.setRightLock(false);
        expect(dashboardService.locks).toEqual({ lockLeft : false, lockRight : false });
    });

    it('should define the changeHeaderWithLocation function', function() {
        expect(dashboardService.changeHeaderWithLocation).toBeDefined();
    });

    it('should set procedure name and header styles when changeHeaderWithLocation function is called', function() {
        dashboardService.changeHeaderWithLocation('/dashboard','1.1','Procedure Example','',1000);
        expect(procedureService.setHeaderStyles).toHaveBeenCalledWith('block','none','#ffffff','#000000','inline-block','none',1000);
        expect(procedureService.setProcedureName).toHaveBeenCalledWith('','',"Home");        
    });

});
