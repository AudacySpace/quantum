describe('Test Suite for Archived Instance Controller', function () {
    var controller,scope,procedureService,userService, deferred, $q,location,dashboardService,rootScope,$location;
    var windowMock = {
        innerWidth: 1000,
        user : {
            currentRole : {callsign : 'MD'}
        }
    };

    var steps = [
            {   
                step: '1.0',
                info: '034.11:26:35 UTC Taruni Gattu(VIP)',
                Step: '1.0',
                Type: 'Heading', 
                Content: 'Pre-Action Safety Information', 
                Role: 'MD', 
                Info: '034.11:26:35 UTC Taruni Gattu(VIP)', 
                index: 1, 
                class: 'fa fa-caret-right', 
                header: true, 
                headertype: 'mainheader', 
                headervalue: '1', 
                openstatus: true, 
                rowstyle: {rowcolor:{backgroundColor: '#c6ecc6' } }, 
                chkval: true, 
                status: true
            }, 
            {   
                step: '1.1', 
                info: '034.11:26:36 UTC Taruni Gattu(VIP)', 
                Step: '1.1', 
                Type: 'Warning', 
                Content: 'Review applicable safety information, from documents located in Mission Specific Release Folder. Failure to consider guidelines may result in personal injury or death.', 
                Role: 'MD', 
                Info: '034.11:26:36 UTC Taruni Gattu(VIP)', 
                index: 1.1, 
                class: 'fa fa-caret-right', 
                header: false, 
                headertype: 'listitem', 
                headervalue: '1', 
                openstatus: false, 
                rowstyle: {rowcolor:{backgroundColor: '#c6ecc6' } }, 
                chkval: true, 
                typeicon: 'fa fa-exclamation-triangle', 
                status: true
            }, 
            {   
                step: '1.2', 
                info: '034.11:26:37 UTC Taruni Gattu(VIP)', 
                Step: '1.2', 
                Type: 'Action', 
                Content: 'Make required safety announcement on VL-AZERO', 
                Role: 'MD', 
                Info: '034.11:26:37 UTC Taruni Gattu(VIP)', 
                index: 1.2, 
                class: 'fa fa-caret-right', 
                header: false, 
                headertype: 'listitem', 
                headervalue: '1', 
                openstatus: false, 
                rowstyle: {rowcolor: {backgroundColor: '#c6ecc6' }}, 
                chkval: true, 
                typeicon: 'fa fa-cog', 
                status: true
            }, 
            {   
                step: '2.0', 
                info: '034.11:26:38 UTC Taruni Gattu(VIP)', 
                Step: '2.0', 
                Type: undefined, 
                Content: 'Close Procedure', 
                Role: 'MD', 
                Info: '034.11:26:38 UTC Taruni Gattu(VIP)', 
                index: 2, 
                class: 'fa fa-caret-right', 
                header: true, 
                headertype: 'mainheader', 
                headervalue: '2', 
                openstatus: true, 
                rowstyle: {rowcolor: {backgroundColor: '#c6ecc6' }}, 
                chkval: true, 
                status: true
            }, 
            {
                step: '2.1.0', 
                info: '034.11:26:39 UTC Taruni Gattu(VIP)', 
                Step: '2.1.0', 
                Type: 'Action', 
                Content: 'Update the shift log with procedure close status / notes', 
                Role: 'MD', 
                Info: '034.11:26:39 UTC Taruni Gattu(VIP)', 
                index: 2.1, 
                class: 'fa fa-caret-down', 
                header: true, 
                headertype: 'subheader', 
                headervalue: '2', 
                openstatus: false, 
                rowstyle: {rowcolor: {backgroundColor: '#c6ecc6' }}, 
                chkval: true, 
                typeicon: 'fa fa-cog', 
                status: true
            }, 
            {   step: '2.1.1', 
                info: '034.11:26:40 UTC Taruni Gattu(VIP)', 
                Step: '2.1.1', 
                Type: 'Action', 
                Content: 'Close the procedure in Quantum (complete this step)', 
                Role: 'MD', 
                Info: '034.11:26:40 UTC Taruni Gattu(VIP)', 
                index: 2.1, 
                class: 'fa fa-caret-right', 
                header: false, 
                headertype: 'listitem', 
                headervalue: '2', 
                openstatus: false, 
                rowstyle: {rowcolor: {backgroundColor: '#c6ecc6' }}, 
                chkval: true, 
                typeicon: 'fa fa-cog', 
                status: true
            }
        ];

    var procSectionSteps = [
                {   
                    step: '1.0',
                    info: '034.11:26:35 UTC Taruni Gattu(VIP)',
                    Step: '1.0',
                    Type: 'Heading', 
                    Content: 'Pre-Action Safety Information', 
                    Role: 'MD', 
                    Info: '034.11:26:35 UTC Taruni Gattu(VIP)', 
                    index: 1, 
                    class: 'fa fa-caret-right', 
                    header: true, 
                    headertype: 'mainheader', 
                    headervalue: '1', 
                    openstatus: true
                }, 
                {   
                    step: '1.1', 
                    info: '034.11:26:36 UTC Taruni Gattu(VIP)', 
                    Step: '1.1', 
                    Type: 'Warning', 
                    Content: 'Review applicable safety information, from documents located in Mission Specific Release Folder. Failure to consider guidelines may result in personal injury or death.', 
                    Role: 'MD', 
                    Info: '034.11:26:36 UTC Taruni Gattu(VIP)', 
                    index: 1.1, 
                    class: 'fa fa-caret-right', 
                    header: false, 
                    headertype: 'listitem', 
                    headervalue: '1', 
                    openstatus: false, 
                    typeicon: 'fa fa-exclamation-triangle'
                }, 
                {   
                    step: '1.2', 
                    info: '034.11:26:37 UTC Taruni Gattu(VIP)', 
                    Step: '1.2', 
                    Type: 'Action', 
                    Content: 'Make required safety announcement on VL-AZERO', 
                    Role: 'MD', 
                    Info: '034.11:26:37 UTC Taruni Gattu(VIP)', 
                    index: 1.2, 
                    class: 'fa fa-caret-right', 
                    header: false, 
                    headertype: 'listitem', 
                    headervalue: '1', 
                    openstatus: false,  
                    typeicon: 'fa fa-cog'
                }, 
                {   
                    step: '2.0', 
                    info: '034.11:26:38 UTC Taruni Gattu(VIP)', 
                    Step: '2.0', 
                    Type: undefined, 
                    Content: 'Close Procedure', 
                    Role: 'MD', 
                    Info: '034.11:26:38 UTC Taruni Gattu(VIP)', 
                    index: 2, 
                    class: 'fa fa-caret-right', 
                    header: true, 
                    headertype: 'mainheader', 
                    headervalue: '2', 
                    openstatus: true
                }, 
                {
                    step: '2.1.0', 
                    info: '034.11:26:39 UTC Taruni Gattu(VIP)', 
                    Step: '2.1.0', 
                    Type: 'Action', 
                    Content: 'Update the shift log with procedure close status / notes', 
                    Role: 'MD', 
                    Info: '034.11:26:39 UTC Taruni Gattu(VIP)', 
                    index: 2.1, 
                    class: 'fa fa-caret-down', 
                    header: true, 
                    headertype: 'subheader', 
                    headervalue: '2', 
                    openstatus: false, 
                    typeicon: 'fa fa-cog'
                }, 
                {   step: '2.1.1', 
                    info: '034.11:26:40 UTC Taruni Gattu(VIP)', 
                    Step: '2.1.1', 
                    Type: 'Action', 
                    Content: 'Close the procedure in Quantum (complete this step)', 
                    Role: 'MD', 
                    Info: '034.11:26:40 UTC Taruni Gattu(VIP)', 
                    index: 2.1, 
                    class: 'fa fa-caret-right', 
                    header: false, 
                    headertype: 'listitem', 
                    headervalue: '2', 
                    openstatus: false
                }
            ];    

    var stepsT = [
                {   
                    step: '1.0',
                    info: '034.11:26:35 UTC Taruni Gattu(VIP)',
                    Step: '1.0',
                    Type: 'Heading', 
                    Content: 'Pre-Action Safety Information', 
                    Role: 'MD', 
                    Info: '034.11:26:35 UTC Taruni Gattu(VIP)',
                    dependentProcedures: [  ]
                }, 
                {   
                    step: '1.1', 
                    info: '034.11:26:36 UTC Taruni Gattu(VIP)', 
                    Step: '1.1', 
                    Type: 'Warning', 
                    Content: 'Review applicable safety information, from documents located in Mission Specific Release Folder. Failure to consider guidelines may result in personal injury or death.', 
                    Role: 'MD', 
                    Info: '034.11:26:36 UTC Taruni Gattu(VIP)',
                    Reference: 'http://somewhere on the net',
                    dependentProcedures: [  ]
                }, 
                {   
                    step: '1.2', 
                    info: '034.11:26:37 UTC Taruni Gattu(VIP)', 
                    Step: '1.2', 
                    Type: 'Action', 
                    Content: 'Make required safety announcement on VL-AZERO', 
                    Role: 'MD', 
                    Info: '034.11:26:37 UTC Taruni Gattu(VIP)',
                    dependentProcedures: [  ]
                }, 
                {   
                    step: '2.0', 
                    info: '034.11:26:38 UTC Taruni Gattu(VIP)', 
                    Step: '2.0', 
                    Type: undefined, 
                    Content: 'Close Procedure', 
                    Role: 'MD', 
                    Info: '034.11:26:38 UTC Taruni Gattu(VIP)',
                    dependentProcedures: [  ]
                }, 
                {
                    step: '2.1.0', 
                    info: '034.11:26:39 UTC Taruni Gattu(VIP)', 
                    Step: '2.1.0', 
                    Type: 'Action', 
                    Content: 'Update the shift log with procedure close status / notes', 
                    Role: 'MD', 
                    Info: '034.11:26:39 UTC Taruni Gattu(VIP)',
                    dependentProcedures: [  ]
                }, 
                {   step: '2.1.1', 
                    info: '034.11:26:40 UTC Taruni Gattu(VIP)', 
                    Step: '2.1.1', 
                    Type: 'Action', 
                    Content: 'Close the procedure in Quantum (complete this step)', 
                    Role: 'MD', 
                    Info: '034.11:26:40 UTC Taruni Gattu(VIP)',
                    dependentProcedures: [  ]
                }
            ];

    var result = [{
            "_id": "5a78b26a5fa10701004acb4c",
            "instances": [
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
                            "info": "034.11:26:37 UTC Taruni Gattu(VIP)"
                        },
                        {
                            "step": "2.0",
                            "info": "034.11:26:38 UTC Taruni Gattu(VIP)"
                        },
                        {
                            "step": "2.1.0",
                            "info": "034.11:26:39 UTC Taruni Gattu(VIP)"
                        },
                        {
                            "step": "2.1.1",
                            "info": "034.11:26:40 UTC Taruni Gattu(VIP)"
                        }
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
                        }
         
                    ],
                    "closedBy": "",
                    "startedAt": "2018 - 034.11:26:49 UTC",
                    "completedAt": "",
                    "revision": 2,
                    "running": true
                }
            ],
            "versions":[[
                    {
                        "Content": "Pre-Action Safety Information",
                        "Type": "Heading",
                        "Role": "MD",
                        "Step": "1.0"
                    },
                    {
                        "Reference": "http://somewhere on the net",
                        "Content": "Review applicable safety information, from documents located in Mission Specific Release Folder. Failure to consider guidelines may result in personal injury or death.",
                        "Type": "Warning",
                        "Role": "MD",
                        "Step": "1.1"
                    },
                    {
                        "Content": "Make required safety announcement on VL-AZERO",
                        "Type": "Action",
                        "Role": "MD",
                        "Step": "1.2"
                    },
                    {
                        "Content": "Close Procedure",
                        "Role": "MD",
                        "Step": "2.0"
                    },
                    {
                        "Content": "Update the shift log with procedure close status / notes",
                        "Type": "Action",
                        "Role": "MD",
                        "Step": "2.1.0"
                    },
                    {
                        "Content": "Close the procedure in Quantum (complete this step)",
                        "Type": "Action",
                        "Role": "MD",
                        "Step": "2.1.1"
                    } 
                ],
                [
                    {
                        "Content": "Pre-Action Safety Information",
                        "Type": "Heading",
                        "Role": "MD",
                        "Step": "1.0"
                    },
                    {
                        "Reference": "http://somewhere on the net",
                        "Content": "Review applicable safety information, from documents located in Mission Specific Release Folder. Failure to consider guidelines may result in personal injury or death.",
                        "Type": "Warning",
                        "Role": "MD",
                        "Step": "1.1"
                    },
                    {
                        "Content": "Make required safety announcement on VL-AZERO",
                        "Type": "Action",
                        "Role": "MD",
                        "Step": "1.2"
                    },
                    {
                        "Content": "Close Procedure",
                        "Role": "MD",
                        "Step": "2.0"
                    },
                    {
                        "Content": "Update the shift log with procedure close status / notes",
                        "Type": "Action",
                        "Role": "MD",
                        "Step": "2.1.0"
                    },
                    {
                        "Content": "Close the procedure in Quantum (complete this step)",
                        "Type": "Action",
                        "Role": "MD",
                        "Step": "2.1.1"
                    } 
                ]
            ],
            "sections": [
                    {
                        "Content": "Pre-Action Safety Information",
                        "Type": "Heading",
                        "Role": "MD",
                        "Step": "1.0"
                    },
                    {
                        "Reference": "http://somewhere on the net",
                        "Content": "Review applicable safety information, from documents located in Mission Specific Release Folder. Failure to consider guidelines may result in personal injury or death.",
                        "Type": "Warning",
                        "Role": "MD",
                        "Step": "1.1"
                    },
                    {
                        "Content": "Make required safety announcement on VL-AZERO",
                        "Type": "Action",
                        "Role": "MD",
                        "Step": "1.2"
                    },
                    {
                        "Content": "Close Procedure",
                        "Role": "MD",
                        "Step": "2.0"
                    },
                    {
                        "Content": "Update the shift log with procedure close status / notes",
                        "Type": "Action",
                        "Role": "MD",
                        "Step": "2.1.0"
                    },
                    {
                        "Content": "Close the procedure in Quantum (complete this step)",
                        "Type": "Action",
                        "Role": "MD",
                        "Step": "2.1.1"
                    } 
                ],
                "eventname": "Audacy Zero",
                "lastuse": "2018 - 034.11:26:50 UTC",
                "title": "Audacy Zero - Procedure Example",
                "procedureID": "1.1",
                "__v": 6
        },
        {
            "_id": "5a78b2745fa10701004acb4d",
            "instances": [
                {
                    "openedBy": "Taruni Gattu(VIP)",
                    "Steps": [
                        {
                            "step": "1.0",
                            "info": "034.11:26:58 UTC Taruni Gattu(VIP)"
                        },
                        {
                            "step": "1.1",
                            "info": "034.11:26:59 UTC Taruni Gattu(VIP)"
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
                        }
                    ],
                    "closedBy": "",
                    "startedAt": "2018 - 034.11:26:58 UTC",
                    "completedAt": "",
                    "revision": 1,
                    "running": true
                }
            ],
            "versions":[[
                    {
                        "Content": "Pre-Action Safety Information",
                        "Type": "Heading",
                        "Role": "MD",
                        "Step": "1.0"
                    },
                    {
                        "Reference": "http://somewhere on the net",
                        "Content": "Review applicable safety information, from documents located in Mission Specific Release Folder. Failure to consider guidelines may result in personal injury or death.",
                        "Type": "Warning",
                        "Role": "MD",
                        "Step": "1.1"
                    },
                    {
                        "Content": "Make required safety announcement on VL-AZERO",
                        "Type": "Action",
                        "Role": "MD",
                        "Step": "1.2"
                    },
                    {
                        "Content": "Close Procedure",
                        "Role": "MD",
                        "Step": "2.0"
                    },
                    {
                        "Content": "Update the shift log with procedure close status / notes",
                        "Type": "Action",
                        "Role": "MD",
                        "Step": "2.1.0"
                    },
                    {
                        "Content": "Close the procedure in Quantum (complete this step)",
                        "Type": "Action",
                        "Role": "MD",
                        "Step": "2.1.1"
                    }
                ],[{
                        "Content": "Pre-Action Safety Information",
                        "Type": "Heading",
                        "Role": "MD",
                        "Step": "1.0"
                    },
                    {
                        "Reference": "http://somewhere on the net",
                        "Content": "Review applicable safety information, from documents located in Mission Specific Release Folder. Failure to consider guidelines may result in personal injury or death.",
                        "Type": "Warning",
                        "Role": "MD",
                        "Step": "1.1"
                    },
                    {
                        "Content": "Make required safety announcement on VL-AZERO",
                        "Type": "Action",
                        "Role": "MD",
                        "Step": "1.2"
                    },
                    {
                        "Content": "Close Procedure",
                        "Role": "MD",
                        "Step": "2.0"
                    },
                    {
                        "Content": "Update the shift log with procedure close status / notes",
                        "Type": "Action",
                        "Role": "MD",
                        "Step": "2.1.0"
                    },
                    {
                        "Content": "Close the procedure in Quantum (complete this step)",
                        "Type": "Action",
                        "Role": "MD",
                        "Step": "2.1.1"
                    }
                ]
            ],
            "sections": [
                    {
                        "Content": "Pre-Action Safety Information",
                        "Type": "Heading",
                        "Role": "MD",
                        "Step": "1.0"
                    },
                    {
                        "Reference": "http://somewhere on the net",
                        "Content": "Review applicable safety information, from documents located in Mission Specific Release Folder. Failure to consider guidelines may result in personal injury or death.",
                        "Type": "Warning",
                        "Role": "MD",
                        "Step": "1.1"
                    },
                    {
                        "Content": "Make required safety announcement on VL-AZERO",
                        "Type": "Action",
                        "Role": "MD",
                        "Step": "1.2"
                    },
                    {
                        "Content": "Close Procedure",
                        "Role": "MD",
                        "Step": "2.0"
                    },
                    {
                        "Content": "Update the shift log with procedure close status / notes",
                        "Type": "Action",
                        "Role": "MD",
                        "Step": "2.1.0"
                    },
                    {
                        "Content": "Close the procedure in Quantum (complete this step)",
                        "Type": "Action",
                        "Role": "MD",
                        "Step": "2.1.1"
                    }
                ],
                "eventname": "Audacy Zero",
                "lastuse": "2018 - 034.11:26:59 UTC",
                "title": "Audacy Zero - OBC Bootup",
                "procedureID": "1.2",
                "__v": 3
        }];

        var liststeps = [
            {   
                step: '1.0',
                info: '034.11:26:35 UTC Taruni Gattu(VIP)',
                Step: '1.0',
                Type: 'Heading', 
                Content: 'Pre-Action Safety Information', 
                Role: 'MD', 
                Info: '034.11:26:35 UTC Taruni Gattu(VIP)', 
                index: 1, 
                class: 'fa fa-caret-right', 
                header: true, 
                headertype: 'mainheader', 
                headervalue: '1', 
                openstatus: true, 
                rowstyle: {rowcolor:{backgroundColor: '#c6ecc6' } }, 
                chkval: true, 
                status: true
            }, 
            {   
                step: '1.1', 
                info: '034.11:26:36 UTC Taruni Gattu(VIP)', 
                Step: '1.1', 
                Type: 'Warning', 
                Content: 'Review applicable safety information, from documents located in Mission Specific Release Folder. Failure to consider guidelines may result in personal injury or death.', 
                Role: 'MD', 
                Info: '034.11:26:36 UTC Taruni Gattu(VIP)', 
                index: 1.1, 
                class: 'fa fa-caret-right', 
                header: false, 
                headertype: 'listitem', 
                headervalue: '1', 
                openstatus: true, 
                rowstyle: {rowcolor:{backgroundColor: '#c6ecc6' } }, 
                chkval: true, 
                typeicon: 'fa fa-exclamation-triangle', 
                status: true
            }, 
            {   
                step: '1.2', 
                info: '034.11:26:37 UTC Taruni Gattu(VIP)', 
                Step: '1.2', 
                Type: 'Action', 
                Content: 'Make required safety announcement on VL-AZERO', 
                Role: 'MD', 
                Info: '034.11:26:37 UTC Taruni Gattu(VIP)', 
                index: 1.2, 
                class: 'fa fa-caret-right', 
                header: false, 
                headertype: 'listitem', 
                headervalue: '1', 
                openstatus: true, 
                rowstyle: {rowcolor: {backgroundColor: '#c6ecc6' }}, 
                chkval: true, 
                typeicon: 'fa fa-cog', 
                status: true
            }, 
            {   
                step: '2.0', 
                info: '034.11:26:38 UTC Taruni Gattu(VIP)', 
                Step: '2.0', 
                Type: undefined, 
                Content: 'Close Procedure', 
                Role: 'MD', 
                Info: '034.11:26:38 UTC Taruni Gattu(VIP)', 
                index: 2, 
                class: 'fa fa-caret-right', 
                header: true, 
                headertype: 'mainheader', 
                headervalue: '2', 
                openstatus: true, 
                rowstyle: {rowcolor: {backgroundColor: '#c6ecc6' }}, 
                chkval: true, 
                status: true
            }, 
            {
                step: '2.1.0', 
                info: '034.11:26:39 UTC Taruni Gattu(VIP)', 
                Step: '2.1.0', 
                Type: 'Action', 
                Content: 'Update the shift log with procedure close status / notes', 
                Role: 'MD', 
                Info: '034.11:26:39 UTC Taruni Gattu(VIP)', 
                index: 2.1, 
                class: 'fa fa-caret-down', 
                header: true, 
                headertype: 'subheader', 
                headervalue: '2', 
                openstatus: false, 
                rowstyle: {rowcolor: {backgroundColor: '#c6ecc6' }}, 
                chkval: true, 
                typeicon: 'fa fa-cog', 
                status: true
            }, 
            {   step: '2.1.1', 
                info: '034.11:26:40 UTC Taruni Gattu(VIP)', 
                Step: '2.1.1', 
                Type: 'Action', 
                Content: 'Close the procedure in Quantum (complete this step)', 
                Role: 'MD', 
                Info: '034.11:26:40 UTC Taruni Gattu(VIP)', 
                index: 2.1, 
                class: 'fa fa-caret-right', 
                header: false, 
                headertype: 'listitem', 
                headervalue: '2', 
                openstatus: false, 
                rowstyle: {rowcolor: {backgroundColor: '#c6ecc6' }}, 
                chkval: true, 
                typeicon: 'fa fa-cog', 
                status: true
            }
        ];

     beforeEach(function () {
         // load the module
        module('quantum', function ($provide) {
            $provide.value('$window', windowMock);

        });

         inject(function($controller, $rootScope, _$q_, _procedureService_,$routeParams,_userService_,$location,_dashboardService_){
            scope = $rootScope.$new();
            rootScope = $rootScope;
            $q = _$q_;
            procedureService = _procedureService_;
            userService = _userService_;
            deferredProcedureList = _$q_.defer();
            location = $location;
            dashboardService = _dashboardService_;
            spyOn($location, 'url').and.returnValue('/dashboard');
            spyOn(procedureService, "getProcedureList").and.returnValue(deferredProcedureList.promise);

            spyOn(procedureService, "getProcedureSection").and.returnValue(procSectionSteps);
            spyOn(procedureService, "showPList").and.returnValue(liststeps);
            spyOn(procedureService, "disableSteps").and.returnValue(steps);
            spyOn(userService, "getUserName").and.returnValue('John Smith');
            spyOn(userService,"getUserEmail").and.returnValue('jsmith@gmail.com');
            
            deferredHeaderChange =  _$q_.defer();
            spyOn(dashboardService, "changeHeaderWithLocation").and.returnValue(deferredHeaderChange.promise);

            deferredUserStatus = _$q_.defer();
            spyOn(procedureService, "setUserStatus").and.returnValue(deferredUserStatus.promise);

            spyOn(procedureService,'getProcedureName').and.returnValue({
                id:"1.1",
                name:"Audacy Zero - Procedure Example",
                status:"",
                fullname:"Audacy Zero - Procedure Example.xlsx"
            });

            controller = $controller('archivedInstanceCtrl', {
                $scope: scope,
                $routeParams: {procID: '1.1',versionID:'2',revisionID:'1'},
                procedureService: procedureService,
                userService: userService,
                $location: location,
                dashboardService: dashboardService
            });
        });
    });

    it('should define the archivedInstance controller', function() {
        expect(controller).toBeDefined();
    });

    it('should define params and set it to routeParams', function() {
        expect(scope.params).toBeDefined();
        expect(scope.params.procID).toEqual('1.1');
    });

    it('should define user role', function() {
        expect(scope.role).toBeDefined();
        expect(scope.role).toEqual(userService.userRole);
    });

    it('should call the service to get all procedures', function() {
        var newres1 = [
            {   

                Step: '1.0',
                Type: 'Heading', 
                Content: 'Pre-Action Safety Information', 
                Role: 'MD', 
                dependentProcedures: []
            }, 
            {   
                Step: '1.1', 
                Type: 'Warning', 
                Content: 'Review applicable safety information, from documents located in Mission Specific Release Folder. Failure to consider guidelines may result in personal injury or death.', 
                Role: 'MD', 
                dependentProcedures: []
            }, 
            {   
                Step: '1.2',
                Type: 'Action', 
                Content: 'Make required safety announcement on VL-AZERO', 
                Role: 'MD', 
                dependentProcedures: []
            }, 
            {   
                Step: '2.0', 
                Type: 'Action', 
                Content: 'Close Procedure', 
                Role: 'MD', 
                dependentProcedures: []
            }, 
            {
                Step: '2.1.0', 
                Type: 'Action', 
                Content: 'Update the shift log with procedure close status / notes', 
                Role: 'MD', 
                dependentProcedures: []
            }, 
            {   
                Step: '2.1.1', 
                Type: 'Action', 
                Content: 'Close the procedure in Quantum (complete this step)', 
                Role: 'MD', 
                dependentProcedures: []
            }
        ];

        deferredProcedureList.resolve({ data : result,status: 200});
        spyOn(procedureService, "getValidLinks").and.returnValue(newres1);
    
        // We have to call digest cycle for this to work
        scope.$digest();
        expect(scope.steps).toBeDefined();
        expect(procedureService.getProcedureList).toHaveBeenCalled();
        expect(procedureService.getValidLinks).toHaveBeenCalled();
        expect(procedureService.getProcedureSection).toHaveBeenCalledWith(newres1,scope.role.cRole.callsign);
        expect(procedureService.disableSteps).toHaveBeenCalledWith(procSectionSteps);
        expect(scope.steps).toEqual(steps);

    });

    it('should define showPList and call showPlist', function() {
        var id = 0;
        var index = 1;
        var headertype = "mainheader";

        expect(scope.showPList).toBeDefined();
        scope.steps = steps;
        scope.showPList(id,index,headertype);
        
        expect(procedureService.showPList).toHaveBeenCalledWith(id,index,headertype,steps);
        expect(scope.steps).toEqual(liststeps);

    });

    it('should define procedure', function() {
        expect(scope.procedure).toBeDefined();
        expect(scope.procedure).toEqual({
            id:"1.1",
            name:"Audacy Zero - Procedure Example",
            status:"",
            fullname:"Audacy Zero - Procedure Example.xlsx"})
    });

    it('should change Color of the header panel to blue when clicked on Live Index', function(){
        spyOn(procedureService, "setProcedureName").and.callThrough();
        spyOn(procedureService, "setHeaderStyles").and.callThrough();
        scope.changeColor("Live","1.1","Procedure Example");
        expect(procedureService.setHeaderStyles).toHaveBeenCalledWith('none','block','#05aec3f2','#ffffff','none','inline-block',1000);
        expect(procedureService.setProcedureName).toHaveBeenCalledWith("1.1","Procedure Example","Open Procedure");
    });

    it('should change Color of the header panel to black when clicked on AS-Run Archive Index', function(){
        spyOn(procedureService, "setProcedureName").and.callThrough();
        spyOn(procedureService, "setHeaderStyles").and.callThrough();
        scope.changeColor("Archived","1.1","Procedure Example");
        expect(procedureService.setHeaderStyles).toHaveBeenCalledWith('none','block','#000000','#ffffff','none','inline-block',1000);
        expect(procedureService.setProcedureName).toHaveBeenCalledWith("1.1","Procedure Example","AS-Run Archive");
    });

    it('should call changeHeaderWithLocation function on location change', function() {
        var newUrl = '/dashboard';
        var oldUrl = '/dashboard/procedure/archivedinstance/1.1/1';
        deferredUserStatus.resolve({ data :{},status : 200});
        scope.$apply(function() {
            rootScope.$broadcast('$locationChangeStart', newUrl, oldUrl);
        });
        expect(dashboardService.changeHeaderWithLocation).toHaveBeenCalled();
    });

    it('should set user status as false and call changeHeaderWithLocation function on location change', function() {
        var newUrl = '/dashboard';
        var oldUrl = '/dashboard/procedure/archivedinstance/1.1/1';
        deferredUserStatus.resolve({ data :{},status : 200});

        scope.$apply(function() {
            rootScope.$broadcast('$locationChangeStart', newUrl, oldUrl);
        });

        expect(procedureService.setUserStatus).toHaveBeenCalledWith(newUrl,'jsmith@gmail.com','John Smith','1.1','',false);
        expect(dashboardService.changeHeaderWithLocation).toHaveBeenCalledWith(newUrl,'1.1','Audacy Zero - Procedure Example','1',1000);
    });

    it('should define and assign styles for users icon', function() {
        expect(scope.icons).toBeDefined();
        expect(scope.icons.usersicon).toEqual({
            'display':'none'
        });
    });


});