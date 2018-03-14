// Be descriptive with titles here. The describe and it titles combined read like a sentence.
describe('Test Suite for User Service', function() {

	var userService, httpBackend;

    var windowMock = { user : 
    	{_id: "594417df3d2dd966dcb43afd", 
            google: {
                email: "john.smith@gmail.com", 
                name: "John Smith", 
                id: "112313425445562239891"
            },
            missions : [
            {
                name: "Quantum",
                currentRole : {
                    name: "Mission Director", 
                    callsign: "MD"
                },
                allowedRoles : [
                {
                    name: "Mission Director", 
                    callsign: "MD"
                },
                {
                    name: "Observer", 
                    callsign: "VIP"
                },
                { 
                    name : 'Proxy Director', 
                    callsign : 'PRX'
                }
                ]
            }]
        }
    };

    beforeEach(function () {
        // load the module with a mock window object
        module('quantum', function ($provide) {
        	$provide.value('$window', windowMock);
        });
 
        // get your service, also get $httpBackend
        // $httpBackend will be a mock.
        inject(function (_$httpBackend_, _userService_) {
            userService = _userService_;
            httpBackend = _$httpBackend_;
        });
    });
 
    // make sure no expectations were missed in your tests.
    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    //userService should exist in the application
    it('userService should exist', function() {
    	expect(userService).toBeDefined();
    });

    it('userService should get the user name', function () {
        var userName = "John Smith";
        expect(userService.getUserName()).toEqual(userName);
    });

    it('userService should get the user email', function () {
        var email = "john.smith@gmail.com";
        expect(userService.getUserEmail()).toEqual(email);
    });

    it('userService should be able to set the mission name for the user', function () {
        var mission = "Quantum";

        httpBackend.expectPOST("/setMissionForUser")
            .respond(200, {});

        userService.setMissionForUser(windowMock.user.google.email, mission).then( function(response){
            expect(response.status).toBe(200);
        });

        httpBackend.flush();
    });

    it('userService should get the user current role', function () {
        var actualRole;
        var role = { 
            name: "Mission Director",
            callsign: "MD"
        };
        var mission = "Quantum";

        httpBackend.expectGET("/getCurrentRole?email=john.smith@gmail.com&mission=Quantum")
            .respond(200, role);

        userService.getCurrentRole(mission).then( function(response){
            actualRole = response.data;
            expect(response.status).toBe(200);
            expect(actualRole).toBeDefined();
            expect(actualRole).toEqual(role);
        });

        httpBackend.flush();
    });

    it('userService should get allowed roles of the user', function () {
        var roles;
        var allowedRoles = [
            {
                name: "Mission Director", 
                callsign: "MD"
            },
            {
                name: "Observer", 
                callsign: "VIP"
            }
        ];
        var mission = "Quantum";

        httpBackend.expectGET("/getAllowedRoles?email=john.smith@gmail.com&mission=Quantum")
            .respond(200, allowedRoles);

        userService.getAllowedRoles(mission).then( function(response){
            roles = response.data;
            expect(response.status).toBe(200);
            expect(roles).toBeDefined();
            expect(roles).toEqual(allowedRoles);
            expect(roles.length).toEqual(2);
        });

        httpBackend.flush();
    });

    it('userService should be able to post the current role of the user', function () {
        var email = "john.smith@gmail.com";
        var role = { 
            name : 'Proxy Director',
            callsign : 'PRX'
        }
        var mission = "Quantum";

        httpBackend.expectPOST("/setUserRole")
            .respond(200, {});

        userService.setCurrentRole(email, role, mission).then( function(response){
            expect(response.status).toBe(200);
        });

        httpBackend.flush();
    });

});
