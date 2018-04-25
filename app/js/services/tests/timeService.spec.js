describe('Test Suite for Time Service', function () {
    var timeService;

    //Load the main module of your application
    beforeEach(module('quantum'));
    
    beforeEach(function () {
        //Prepare the mocks
        module(function ($provide) {
            $provide.constant('moment', function () {
                //Remember, moment is always available in the global scope
                return moment(1520737182000);
            })
        });

        // get your service
        inject(function (_timeService_) {
            timeService = _timeService_;
        });
    });

    //timeService should exist in the application
    it('should define the service timeService', function() {
        expect(timeService).toBeDefined();
    });

    it('should define the getTime function', function() {
        expect(timeService.getTime).toBeDefined();
    });

    it('should get the system time in UTC when getTime function is called', function() {
        var result = timeService.getTime();

        var expected = { 
            today: undefined, 
            days: '000', 
            hours: '00', 
            minutes: '00', 
            seconds: '00', 
            utc: '000.00:00:00 UTC', 
            year : '00'
        }

        expect(result.days).toEqual('070');
        expect(result.hours).toEqual('02');
        expect(result.minutes).toEqual(59);
        expect(result.seconds).toEqual(42);
        expect(result.utc).toEqual('070.02:59:42 UTC');
        expect(result.year).toEqual(2018);
    });

});
