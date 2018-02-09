describe('Test Suite for Dashboard Service', function () {
    var dashboardService, httpBackend;

    beforeEach(function () {
        // load the module
        module('quantum');

        // get your service, also get $httpBackend
        // $httpBackend will be a mock.
        inject(function (_$httpBackend_, _dashboardService_) {
            dashboardService = _dashboardService_;
            httpBackend = _$httpBackend_;
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
});
