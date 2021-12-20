// Be descriptive with titles here. The describe and it titles combined read like a sentence.
describe('Test Suite for User Service', function() {

	var userService, httpBackend;

    var windowMock = { user : 
    	{_id: "594417df3d2dd966dcb43afd", 
            azure_ad: {
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

        userService.setMissionForUser(windowMock.user.azure_ad.email, mission).then( function(response){
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

    it('userService should get all the users', function () {
        var mission = "Quantum";
        var users;
        var result = [{
            _id: "594417df3d2dd966dcb43afd",
            azure_ad: {
                email: "john.smith@gmail.com",
                name: "John Smith",
                id: "112313425445562239891"
            },
            missions: [{
                name: "Quantum",
                currentRole: {
                    name: "Observer",
                    callsign: "VIP"
                },
                allowedRoles: [
                {
                    name: "Observer",
                    callsign: "VIP"
                }]
            }]
        }];

        httpBackend.expectGET('/getUsers?mission=Quantum').respond(200, result);

        userService.getUsers(mission).then( function(response){
            users = response.data;
            expect(response.status).toBe(200);
            expect(users).toBeDefined();
            expect(users.length).toBeGreaterThan(0);
            expect(users.length).toEqual(1);
        });

        httpBackend.flush();
    });

    it('userService should be able to set the allowed roles of the user', function () {
        var roles = [
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

        httpBackend.expectPOST("/setAllowedRoles")
            .respond(200, {});

        userService.setAllowedRoles(windowMock.user, roles, mission).then( function(response){
            expect(response.status).toBe(200);
        });

        httpBackend.flush();
    });

});
