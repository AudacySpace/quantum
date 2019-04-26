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
        inject(function (_$httpBackend_, _dashboardService_,_procedureService_) {
            dashboardService = _dashboardService_;
            httpBackend = _$httpBackend_;
            procedureService = _procedureService_;
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
        expect(dashboardService.locks).toEqual({ lockRight : false });
    });

    it('should define the getLock function', function() {
        expect(dashboardService.getLock).toBeDefined();
    });

    it('should return the locks variable when getLocks is called', function() {
        expect(dashboardService.getLock()).toEqual({ lockRight : false });
    });

    it('should define the setRightLock function', function() {
        expect(dashboardService.setRightLock).toBeDefined();
    });

    it('should set the right lock on dashboard when setRightLock function is called', function() {
        dashboardService.setRightLock(true);
        expect(dashboardService.locks).toEqual({ lockRight : true });
        
        dashboardService.setRightLock(false);
        expect(dashboardService.locks).toEqual({ lockRight : false });
    });

    it('should define the changeHeaderWithLocation function', function() {
        expect(dashboardService.changeHeaderWithLocation).toBeDefined();
    });

    it('should set procedure name and header styles when changeHeaderWithLocation function is called', function() {
        dashboardService.changeHeaderWithLocation('/dashboard','1.1','Procedure Example','',1000);
        expect(procedureService.setHeaderStyles).toHaveBeenCalledWith('block','none','#ffffff','#000000','inline-block','none',1000);
        expect(procedureService.setProcedureName).toHaveBeenCalledWith('','',"Home");        
    });

    it('should diplay upload procedure option when the location url is at dashboard home',function(){
        dashboardService.changeHeaderWithLocation('/dashboard','1.1','Procedure Example','',1000);
        var loc = dashboardService.getHeaderLocation();
        expect(loc).toEqual({url:'/dashboard',liveindexStatus:false,archiveindexStatus:false,userListStatus:false});
    });

    it('should diplay upload procedure option,links to live and archived index pages and user list when the location url is at new instance',function(){
        dashboardService.changeHeaderWithLocation('/dashboard/procedure/1.1','1.1','Procedure Example','2',1000);
        var loc = dashboardService.getHeaderLocation();
        expect(loc).toEqual({url:'/dashboard/procedure/1.1',liveindexStatus:true,archiveindexStatus:true,userListStatus:true});
    });

    it('should diplay upload procedure option,links to live and archived index pages and user list when the location url is active instance',function(){
        dashboardService.changeHeaderWithLocation('/dashboard/procedure/runninginstance/1.1/2','1.1','Procedure Example','2',1000);
        var loc = dashboardService.getHeaderLocation();
        expect(loc).toEqual({url:'/dashboard/procedure/runninginstance/1.1/2',liveindexStatus:true,archiveindexStatus:true,userListStatus:true});
    });

    it('should diplay upload procedure option,links to live and archived index pages and not user list when the location url is at preview page of procedure',function(){
        dashboardService.changeHeaderWithLocation('/dashboard/viewProcedure/1.1','1.1','Procedure Example','',1000);
        var loc = dashboardService.getHeaderLocation();
        expect(loc).toEqual({url:'/dashboard/viewProcedure/1.1',liveindexStatus:true,archiveindexStatus:true,userListStatus:false});
    });

    it('should diplay upload procedure option,links to live index pages and not user list when the location url is at archived instance page of procedure',function(){
        dashboardService.changeHeaderWithLocation('/dashboard/procedure/archivedinstance/1.1/3','1.1','Procedure Example','3',1000);
        var loc = dashboardService.getHeaderLocation();
        expect(loc).toEqual({url:'/dashboard/procedure/archivedinstance/1.1/3',liveindexStatus:true,archiveindexStatus:true,userListStatus:false});
    });

    it('should diplay upload procedure option,links to live index page and not user list when the location url is at archived index page of procedure',function(){
        dashboardService.changeHeaderWithLocation('/dashboard/procedure/archived/1.1','1.1','Procedure Example','',1000);
        var loc = dashboardService.getHeaderLocation();
        expect(loc).toEqual({url:'/dashboard/procedure/archived/1.1',liveindexStatus:true,archiveindexStatus:false,userListStatus:false});
    });

    it('should diplay upload procedure option,links to archived index page and not user list when the location url is at live index page of procedure',function(){
        dashboardService.changeHeaderWithLocation('/dashboard/procedure/running/1.1','1.1','Procedure Example','',1000);
        var loc = dashboardService.getHeaderLocation();
        expect(loc).toEqual({url:'/dashboard/procedure/running/1.1',liveindexStatus:false,archiveindexStatus:true,userListStatus:false});
    });

});
