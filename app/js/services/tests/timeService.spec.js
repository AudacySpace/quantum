describe('Test Suite for Time Service', function () {
    var timeService, httpBackend, interval;

    beforeEach(function () {
        // load the module
        module('quantum');

        // get your service, also get $httpBackend
        // $httpBackend will be a mock.
        inject(function (_$httpBackend_,_timeService_, _$interval_) {
            timeService = _timeService_;
            httpBackend = _$httpBackend_;
            interval = _$interval_;
        });
    });
 
    // make sure no expectations were missed in your tests.
    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    //dashboardService should exist in the application
    it('should define the service timeService', function() {
        expect(timeService).toBeDefined();
    });

    it('should define the getTime function', function() {
        expect(timeService.getTime).toBeDefined();
    });

    it('should get the default time when getTime function is called', function() {
        var result = timeService.getTime(0);
        var tyear = (new Date()).getFullYear();
        var expected = { 
            today: undefined, 
            days: '000', 
            hours: '00', 
            minutes: '00', 
            seconds: '00', 
            utc: '000.00:00:00 UTC', 
            year : tyear
        }

        expect(result).toEqual(expected);
    });

});
