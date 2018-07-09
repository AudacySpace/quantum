describe('Test Suite for Run Instance Controller', function () {
    var controller,scope,procedureService,userService, deferred, $q,timeService,$interval,location,dashboardService,rootScope;
    var windowMock = {
        innerWidth: 1000,
        user : {
            currentRole : {callsign : 'MD'}
        }
    };

    var modalInstance = { open: function() {} };

    var steps = [
        {   
            step: '1.0',
            info: '',
            Step: '1.0',
            Type: 'Heading', 
            Content: 'Pre-Action Safety Information', 
            Role: 'MD', 
            Info: '', 
            index: 1, 
            class: 'fa fa-caret-right', 
            header: true, 
            headertype: 'mainheader', 
            headervalue: '1', 
            openstatus: true, 
            rowstyle: {rowcolor:{backgroundColor: '#e9f6fb' } }, 
            chkval: false, 
            status: false
        }, 
        {   
            step: '1.1', 
            info: '', 
            Step: '1.1', 
            Type: 'Warning', 
            Content: 'Review applicable safety information, from documents located in Mission Specific Release Folder. Failure to consider guidelines may result in personal injury or death.', 
            Role: 'MD', 
            Info: '', 
            index: 1.1, 
            class: 'fa fa-caret-right', 
            header: false, 
            headertype: 'listitem', 
            headervalue: '1', 
            openstatus: false, 
            rowstyle: {rowcolor:{backgroundColor: '#e9f6fb' } }, 
            chkval: false, 
            typeicon: 'fa fa-exclamation-triangle', 
            status: false
        }, 
        {   
            step: '1.2', 
            info: '', 
            Step: '1.2', 
            Type: 'Action', 
            Content: 'Make required safety announcement on VL-AZERO', 
            Role: 'MD', 
            Info: '', 
            index: 1.2, 
            class: 'fa fa-caret-right', 
            header: false, 
            headertype: 'listitem', 
            headervalue: '1', 
            openstatus: false, 
            rowstyle: {rowcolor: {backgroundColor: '#e9f6fb' }}, 
            chkval: false, 
            typeicon: 'fa fa-cog', 
            status: false
        }, 
        {   
            step: '2.0', 
            info: '034.11:26:49 UTC Taruni Gattu(VIP)', 
            Step: '2.0', 
            Type: undefined, 
            Content: 'Close Procedure', 
            Role: 'MD', 
            Info: '034.11:26:49 UTC Taruni Gattu(VIP)', 
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
            info: '034.11:26:50 UTC Taruni Gattu(VIP)', 
            Step: '2.1.0', 
            Type: 'Action', 
            Content: 'Update the shift log with procedure close status / notes', 
            Role: 'MD', 
            Info: '034.11:26:50 UTC Taruni Gattu(VIP)', 
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
        {   
            step: '2.1.1', 
            info: '', 
            Step: '2.1.1', 
            Type: 'Action', 
            Content: 'Close the procedure in Quantum (complete this step)', 
            Role: 'MD', 
            Info: '', 
            index: 2.1, 
            class: 'fa fa-caret-right', 
            header: false, 
            headertype: 'listitem', 
            headervalue: '2', 
            openstatus: false, 
            rowstyle: {rowcolor: {backgroundColor: '#e9f6fb' }}, 
            chkval: false, 
            typeicon: 'fa fa-cog', 
            status: false
        }
    ];

    var procSectionSteps = [
        {   
            step: '1.0',
            info: '',
            Step: '1.0',
            Type: 'Heading', 
            Content: 'Pre-Action Safety Information', 
            Role: 'MD', 
            Info: '', 
            index: 1, 
            class: 'fa fa-caret-right', 
            header: true, 
            headertype: 'mainheader', 
            headervalue: '1', 
            openstatus: true
        }, 
        {   
            step: '1.1', 
            info: '', 
            Step: '1.1', 
            Type: 'Warning', 
            Content: 'Review applicable safety information, from documents located in Mission Specific Release Folder. Failure to consider guidelines may result in personal injury or death.', 
            Role: 'MD', 
            Info: '', 
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
            info: '', 
            Step: '1.2', 
            Type: 'Action', 
            Content: 'Make required safety announcement on VL-AZERO', 
            Role: 'MD', 
            Info: '', 
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
            info: '034.11:26:49 UTC Taruni Gattu(VIP)', 
            Step: '2.0', 
            Type: undefined, 
            Content: 'Close Procedure', 
            Role: 'MD', 
            Info: '034.11:26:49 UTC Taruni Gattu(VIP)', 
            index: 2, 
            class: 'fa fa-caret-right', 
            header: true, 
            headertype: 'mainheader', 
            headervalue: '2', 
            openstatus: true
        }, 
        {
            step: '2.1.0', 
            info: '034.11:26:50 UTC Taruni Gattu(VIP)', 
            Step: '2.1.0', 
            Type: 'Action', 
            Content: 'Update the shift log with procedure close status / notes', 
            Role: 'MD', 
            Info: '034.11:26:50 UTC Taruni Gattu(VIP)', 
            index: 2.1, 
            class: 'fa fa-caret-down', 
            header: true, 
            headertype: 'subheader', 
            headervalue: '2', 
            openstatus: false, 
            typeicon: 'fa fa-cog'
        }, 
        {   
            step: '2.1.1', 
            info: '', 
            Step: '2.1.1', 
            Type: 'Action', 
            Content: 'Close the procedure in Quantum (complete this step)', 
            Role: 'MD', 
            Info: '', 
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
            info: '',
            Step: '1.0',
            Type: 'Heading', 
            Content: 'Pre-Action Safety Information', 
            Role: 'MD', 
            Info: '',
            Reference: undefined
        }, 
        {   
            step: '1.1', 
            info: '', 
            Step: '1.1', 
            Type: 'Warning', 
            Content: 'Review applicable safety information, from documents located in Mission Specific Release Folder. Failure to consider guidelines may result in personal injury or death.', 
            Role: 'MD', 
            Info: '',
            Reference : 'http://somewhere on the net'
        }, 
        {   
            step: '1.2', 
            info: '', 
            Step: '1.2', 
            Type: 'Action', 
            Content: 'Make required safety announcement on VL-AZERO', 
            Role: 'MD', 
            Info: '',
            Reference: undefined
        }, 
        {   
            step: '2.0', 
            info: '034.11:26:49 UTC Taruni Gattu(VIP)', 
            Step: '2.0', 
            Type: undefined, 
            Content: 'Close Procedure', 
            Role: 'MD', 
            Info: '034.11:26:49 UTC Taruni Gattu(VIP)',
            Reference: undefined
        }, 
        {
            step: '2.1.0', 
            info: '034.11:26:50 UTC Taruni Gattu(VIP)', 
            Step: '2.1.0', 
            Type: 'Action', 
            Content: 'Update the shift log with procedure close status / notes', 
            Role: 'MD', 
            Info: '034.11:26:50 UTC Taruni Gattu(VIP)',
            Reference: undefined
        }, 
        {   
            step: '2.1.1', 
            info: '', 
            Step: '2.1.1', 
            Type: 'Action', 
            Content: 'Close the procedure in Quantum (complete this step)', 
            Role: 'MD', 
            Info: '',
            Reference: undefined
        }
    ];

    var result = [
        {
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
                    "closedBy": "Taruni Gattu(VIP)",
                    "startedAt": "2018 - 034.11:26:35 UTC",
                    "completedAt": "2018 - 034.11:26:40 UTC",
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
            info: '',
            Step: '1.0',
            Type: 'Heading', 
            Content: 'Pre-Action Safety Information', 
            Role: 'MD', 
            Info: '', 
            index: 1, 
            class: 'fa fa-caret-right', 
            header: true, 
            headertype: 'mainheader', 
            headervalue: '1', 
            openstatus: true, 
            rowstyle: {rowcolor:{backgroundColor: '#e9f6fb' } }, 
            chkval: false, 
            status: false
        }, 
        {   
            step: '1.1', 
            info: '', 
            Step: '1.1', 
            Type: 'Warning', 
            Content: 'Review applicable safety information, from documents located in Mission Specific Release Folder. Failure to consider guidelines may result in personal injury or death.', 
            Role: 'MD', 
            Info: '', 
            index: 1.1, 
            class: 'fa fa-caret-right', 
            header: false, 
            headertype: 'listitem', 
            headervalue: '1', 
            openstatus: false, 
            rowstyle: {rowcolor:{backgroundColor: '#e9f6fb' } }, 
            chkval: false, 
            typeicon: 'fa fa-exclamation-triangle', 
            status: false
        }, 
        {   
            step: '1.2', 
            info: '', 
            Step: '1.2', 
            Type: 'Action', 
            Content: 'Make required safety announcement on VL-AZERO', 
            Role: 'MD', 
            Info: '', 
            index: 1.2, 
            class: 'fa fa-caret-right', 
            header: false, 
            headertype: 'listitem', 
            headervalue: '1', 
            openstatus: false, 
            rowstyle: {rowcolor: {backgroundColor: '#e9f6fb' }}, 
            chkval: false, 
            typeicon: 'fa fa-cog', 
            status: false
        }, 
        {   
            step: '2.0', 
            info: '034.11:26:49 UTC Taruni Gattu(VIP)', 
            Step: '2.0', 
            Type: undefined, 
            Content: 'Close Procedure', 
            Role: 'MD', 
            Info: '034.11:26:49 UTC Taruni Gattu(VIP)', 
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
            info: '034.11:26:50 UTC Taruni Gattu(VIP)', 
            Step: '2.1.0', 
            Type: 'Action', 
            Content: 'Update the shift log with procedure close status / notes', 
            Role: 'MD', 
            Info: '034.11:26:50 UTC Taruni Gattu(VIP)', 
            index: 2.1, 
            class: 'fa fa-caret-down', 
            header: true, 
            headertype: 'subheader', 
            headervalue: '2', 
            openstatus: true, 
            rowstyle: {rowcolor: {backgroundColor: '#c6ecc6' }}, 
            chkval: true, 
            typeicon: 'fa fa-cog', 
            status: true
        }, 
        {   
            step: '2.1.1', 
            info: '', 
            Step: '2.1.1', 
            Type: 'Action', 
            Content: 'Close the procedure in Quantum (complete this step)', 
            Role: 'MD', 
            Info: '', 
            index: 2.1, 
            class: 'fa fa-caret-right', 
            header: false, 
            headertype: 'listitem', 
            headervalue: '2', 
            openstatus: true, 
            rowstyle: {rowcolor: {backgroundColor: '#e9f6fb' }}, 
            chkval: false, 
            typeicon: 'fa fa-cog', 
            status: false
        }
    ];

    var lsteps = [
        {   
            step: '1.0',
            info: '',
            Step: '1.0',
            Type: 'Heading', 
            Content: 'Pre-Action Safety Information', 
            Role: 'MD', 
            Info: '', 
            index: 1, 
            class: 'fa fa-caret-right', 
            header: true, 
            headertype: 'mainheader', 
            headervalue: '1', 
            openstatus: true, 
            rowstyle: {rowcolor:{backgroundColor: '#e9f6fb' } }, 
            chkval: false, 
            status: false
        }, 
        {   
            step: '1.1', 
            info: '', 
            Step: '1.1', 
            Type: 'Warning', 
            Content: 'Review applicable safety information, from documents located in Mission Specific Release Folder. Failure to consider guidelines may result in personal injury or death.', 
            Role: 'MD', 
            Info: '', 
            index: 1.1, 
            class: 'fa fa-caret-right', 
            header: false, 
            headertype: 'listitem', 
            headervalue: '1', 
            openstatus: true, 
            rowstyle: {rowcolor:{backgroundColor: '#e9f6fb' } }, 
            chkval: false, 
            typeicon: 'fa fa-exclamation-triangle', 
            status: false
        }, 
        {   
            step: '1.2', 
            info: '', 
            Step: '1.2', 
            Type: 'Action', 
            Content: 'Make required safety announcement on VL-AZERO', 
            Role: 'MD', 
            Info: '', 
            index: 1.2, 
            class: 'fa fa-caret-right', 
            header: false, 
            headertype: 'listitem', 
            headervalue: '1', 
            openstatus: true, 
            rowstyle: {rowcolor: {backgroundColor: '#e9f6fb' }}, 
            chkval: false, 
            typeicon: 'fa fa-cog', 
            status: false
        }, 
        {   
            step: '2.0', 
            info: '034.11:26:49 UTC Taruni Gattu(VIP)', 
            Step: '2.0', 
            Type: undefined, 
            Content: 'Close Procedure', 
            Role: 'MD', 
            Info: '034.11:26:49 UTC Taruni Gattu(VIP)', 
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
            info: '034.11:26:50 UTC Taruni Gattu(VIP)', 
            Step: '2.1.0', 
            Type: 'Action', 
            Content: 'Update the shift log with procedure close status / notes', 
            Role: 'MD', 
            Info: '034.11:26:50 UTC Taruni Gattu(VIP)', 
            index: 2.1, 
            class: 'fa fa-caret-down', 
            header: true, 
            headertype: 'subheader', 
            headervalue: '2', 
            openstatus: true, 
            rowstyle: {rowcolor: {backgroundColor: '#c6ecc6' }}, 
            chkval: true, 
            typeicon: 'fa fa-cog', 
            status: true
        }, 
        {   
            step: '2.1.1', 
            info: '', 
            Step: '2.1.1', 
            Type: 'Action', 
            Content: 'Close the procedure in Quantum (complete this step)', 
            Role: 'MD', 
            Info: '', 
            index: 2.1, 
            class: 'fa fa-caret-right', 
            header: false, 
            headertype: 'listitem', 
            headervalue: '2', 
            openstatus: true, 
            rowstyle: {rowcolor: {backgroundColor: '#e9f6fb' }}, 
            chkval: false, 
            typeicon: 'fa fa-cog', 
            status: false
        }
    ];


    var mid_res = [
        {
            step: '1.0', 
            info: '', 
            Step: '1.0', 
            Type: 'Heading', 
            Content: 'Pre-Action Safety Information', 
            Role: 'MD', 
            Info: '070.10:10:50 UTC John Smith(MD)', 
            index: 1, 
            class: 'fa fa-caret-right', 
            header: true, 
            headertype: 'mainheader', 
            headervalue: '1', 
            openstatus: true, 
            rowstyle: {
                rowcolor : {
                    // backgroundColor:'#c6ecc6'
                    'background':'-moz-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                    'background':'-o-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                    'background':'linear-gradient(to left, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                    'background-size': '200% 100%',
                    'background-position':'right bottom',
                    'margin-left':'10px',
                    'transition':'all 0.3s linear'
                }
            }, 
            chkval: false, 
            status: false,
            recordedValue:"",
            contenttype:"String",
            buttonStatus: '',
            comments:""
        },
        {
            step: '1.1', 
            info: '', 
            Step: '1.1', 
            Type: 'Warning', 
            Content: 'Review applicable safety information, from documents located in Mission Specific Release Folder. Failure to consider guidelines may result in personal injury or death.', 
            Role: 'MD', 
            Info: '', 
            index: 1.1, 
            class: 'fa fa-caret-right', 
            header: false, 
            headertype: 'listitem', 
            headervalue: '1', 
            openstatus: false, 
            rowstyle: {rowcolor:{backgroundColor: '#e9f6fb' }} , 
            chkval: false, 
            typeicon: 'fa fa-exclamation-triangle', 
            status: false,
            recordedValue:"",
            contenttype:"AlertInfo",
            buttonStatus: '',
            comments:""
        },
        {
            step: '1.2', 
            info: '', 
            Step: '1.2', 
            Type: 'Action', 
            Content: 'Make required safety announcement on VL-AZERO', 
            Role: 'MD', 
            Info: '', 
            index: 1.2, 
            class: 'fa fa-caret-right', 
            header: false, 
            headertype: 'listitem', 
            headervalue: '1', 
            openstatus: false, 
            rowstyle: {rowcolor:{backgroundColor: '#e9f6fb' }} , 
            chkval: false, 
            typeicon: 'fa fa-cog', 
            status: false,
            recordedValue:"",
            contenttype:"Array",
            buttonStatus: '',
            comments:""
        }, 
        {
            step: '2.0', 
            info: '034.11:26:49 UTC Taruni Gattu(VIP)', 
            Step: '2.0', 
            Type: 'Heading', 
            Content: 'Close Procedure', 
            Role: 'MD', 
            Info: '034.11:26:49 UTC Taruni Gattu(VIP)', 
            index: 2, 
            class: 'fa fa-caret-right', 
            header: true, 
            headertype: 'mainheader', 
            headervalue: '2', 
            openstatus: true, 
            rowstyle: {rowcolor:{backgroundColor: '#c6ecc6' }}, 
            chkval: true, 
            status: true,
            recordedValue:"",
            contenttype:"String",
            buttonStatus: '',
            comments:""
        },
        {
            step: '2.1.0', 
            info: '034.11:26:50 UTC Taruni Gattu(VIP)', 
            Step: '2.1.0', 
            Type: 'Action', 
            Content: 'Update the shift log with procedure close status / notes', 
            Role: 'MD', 
            Info: '034.11:26:50 UTC Taruni Gattu(VIP)', 
            index: 2.1, 
            class: 'fa fa-caret-down', 
            header: true, 
            headertype: 'subheader', 
            headervalue: '2', 
            openstatus: false, 
            rowstyle: {rowcolor:{backgroundColor: '#c6ecc6' }}, 
            chkval: true, 
            typeicon: 'fa fa-cog', 
            status: true,
            recordedValue:"",
            contenttype:"Array",
            buttonStatus: '',
            comments:""
        }, 
        {
            step: '2.1.1', 
            info: '', 
            Step: '2.1.1', 
            Type: 'Action', 
            Content: 'Close the procedure in Quantum (complete this step)', 
            Role: 'MD', 
            Info: '', 
            index: 2.1, 
            class: 'fa fa-caret-right', 
            header: false, 
            headertype: 'listitem', 
            headervalue: '2', 
            openstatus: false, 
            rowstyle: {rowcolor:{backgroundColor: '#e9f6fb' }}, 
            chkval: false, 
            typeicon: 'fa fa-cog', 
            status: false,
            recordedValue:"",
            contenttype:"String",
            buttonStatus: '',
            comments:""
        }
    ];

    var res = [
        {   
            step: '1.0',
            info: '070.10:10:50 UTC John Smith(MD)',
            Step: '1.0',
            Type: 'Heading', 
            Content: 'Pre-Action Safety Information', 
            Role: 'MD', 
            Info: '070.10:10:50 UTC John Smith(MD)', 
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
            info: '', 
            Step: '1.1', 
            Type: 'Warning', 
            Content: 'Review applicable safety information, from documents located in Mission Specific Release Folder. Failure to consider guidelines may result in personal injury or death.', 
            Role: 'MD', 
            Info: '', 
            index: 1.1, 
            class: 'fa fa-caret-right', 
            header: false, 
            headertype: 'listitem', 
            headervalue: '1', 
            openstatus: true, 
            rowstyle: {rowcolor:{backgroundColor: '#e9f6fb' } }, 
            chkval: false, 
            typeicon: 'fa fa-exclamation-triangle', 
            status: false
        }, 
        {   
            step: '1.2', 
            info: '', 
            Step: '1.2', 
            Type: 'Action', 
            Content: 'Make required safety announcement on VL-AZERO', 
            Role: 'MD', 
            Info: '', 
            index: 1.2, 
            class: 'fa fa-caret-right', 
            header: false, 
            headertype: 'listitem', 
            headervalue: '1', 
            openstatus: true, 
            rowstyle: {rowcolor: {backgroundColor: '#e9f6fb' }}, 
            chkval: false, 
            typeicon: 'fa fa-cog', 
            status: false
        }, 
        {   
            step: '2.0', 
            info: '034.11:26:49 UTC Taruni Gattu(VIP)', 
            Step: '2.0', 
            Type: undefined, 
            Content: 'Close Procedure', 
            Role: 'MD', 
            Info: '034.11:26:49 UTC Taruni Gattu(VIP)', 
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
            info: '034.11:26:50 UTC Taruni Gattu(VIP)', 
            Step: '2.1.0', 
            Type: 'Action', 
            Content: 'Update the shift log with procedure close status / notes', 
            Role: 'MD', 
            Info: '034.11:26:50 UTC Taruni Gattu(VIP)', 
            index: 2.1, 
            class: 'fa fa-caret-down', 
            header: true, 
            headertype: 'subheader', 
            headervalue: '2', 
            openstatus: true, 
            rowstyle: {rowcolor: {backgroundColor: '#c6ecc6' }}, 
            chkval: true, 
            typeicon: 'fa fa-cog', 
            status: true
        }, 
        {   
            step: '2.1.1', 
            info: '', 
            Step: '2.1.1', 
            Type: 'Action', 
            Content: 'Close the procedure in Quantum (complete this step)', 
            Role: 'MD', 
            Info: '', 
            index: 2.1, 
            class: 'fa fa-caret-right', 
            header: false, 
            headertype: 'listitem', 
            headervalue: '2', 
            openstatus: true, 
            rowstyle: {rowcolor: {backgroundColor: '#e9f6fb' }}, 
            chkval: false, 
            typeicon: 'fa fa-cog', 
            status: false
        }
    ];


     beforeEach(function () {
         // load the module
        module('quantum', function ($provide) {
            $provide.value('$window', windowMock);

        });

        //Prepare the mocks
        module(function ($provide) {
            $provide.constant('moment', function () {
                //Remember, moment is always available in the global scope
                return moment();
            })
        });

        inject(function($controller, $rootScope, _$q_, _procedureService_,$routeParams,_userService_,_timeService_,$interval,$location,_dashboardService_){
            scope = $rootScope.$new();
            rootScope = $rootScope;
            $q = _$q_;
            $intervalSpy = jasmine.createSpy('$interval', $interval);
            procedureService = _procedureService_;
            userService = _userService_;
            timeService = _timeService_;
            location = $location;
            dashboardService = _dashboardService_;

            deferredProcedureList = _$q_.defer();
            spyOn(procedureService, "getProcedureList").and.returnValue(deferredProcedureList.promise);
            deferredLiveInstanceData = _$q_.defer();
            spyOn(procedureService, "getLiveInstanceData").and.returnValue(deferredLiveInstanceData.promise);
            deferredProcedureInstance = _$q_.defer();
            spyOn(procedureService, "saveProcedureInstance").and.returnValue(deferredProcedureInstance.promise);
            deferredSetInfo = _$q_.defer();
            deferredSetComments = _$q_.defer();
            deferredInstanceCompleted = _$q_.defer();
            spyOn(procedureService, "setInstanceCompleted").and.returnValue(deferredInstanceCompleted.promise);

            deferredHeaderChange =  _$q_.defer();
            spyOn(dashboardService, "changeHeaderWithLocation").and.returnValue(deferredHeaderChange.promise);
            spyOn(procedureService, "getProcedureSection").and.returnValue(procSectionSteps);
            spyOn(procedureService, "getCompletedSteps").and.returnValue(steps);
            spyOn(procedureService, "openNextSteps").and.returnValue(res);
            spyOn(procedureService, "showPList").and.returnValue(lsteps);
            // spyOn(procedureService, "checkIfEmpty").and.returnValue(false);            

            spyOn(userService, "getUserName").and.returnValue('John Smith');
            spyOn(timeService, "getTime").and.returnValue({
                days : '070',
                minutes : '10',
                hours : '10',
                seconds : '50',
                utc : '070.10:10:50 UTC',
                year : '2018'
            });

            spyOn(procedureService, "getProcedureName").and.returnValue({id : '', name : '', status : '',fullname : ''});

            deferredUserStatus = _$q_.defer();
            spyOn(procedureService, "setUserStatus").and.returnValue(deferredUserStatus.promise);

            controller = $controller('runningInstanceCtrl', {
                $scope: scope,
                $routeParams: {procID: '1.1',revisionID:'2'},
                procedureService: procedureService,
                userService: userService,
                timeService: timeService,
                $interval: $intervalSpy,
                $location: location,
                dashboardService: dashboardService,
                $uibModal : modalInstance
            });
        });
    });

    it('should define the running Instance controller', function() {
        expect(controller).toBeDefined();
    });

    it('should define params and set it to routeParams', function() {
        expect(scope.params).toBeDefined();
        expect(scope.params.procID).toEqual('1.1');
    });

    it('should define user role,name and usernamerole', function() {
        expect(scope.role).toBeDefined();
        expect(scope.role).toEqual(userService.userRole);
        expect(scope.name).toBeDefined();
        expect(scope.name).toEqual('John Smith');
        expect(scope.usernamerole).toBeDefined();
        expect(scope.usernamerole).toEqual('John Smith(MD)');
    });

    it('should call $interval once', function(){
        expect($intervalSpy).toHaveBeenCalled();
        expect($intervalSpy.calls.count()).toBe(1);
    });

    it('should call $interval on updateClock and updateLiveInstancefunction', function(){
        expect($intervalSpy).toHaveBeenCalledWith(scope.updateLiveInstance, 5000);
    });

    it('should define procedure', function() {
        expect(scope.procedure).toBeDefined();
        expect(scope.procedure).toEqual({id : '', name : '', status : '',fullname : '' })
    });

    it('should define viewProcedure and call getProcedureList and updateliveInstance', function() {
        var resultSteps = {   
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

        deferredProcedureList.resolve({data : result,status:200});
        deferredLiveInstanceData.resolve({ data : resultSteps,status : 200});

        scope.$digest();
        expect(scope.steps).toBeDefined();
        expect(scope.currentRevision).toBeDefined();
        expect(procedureService.getProcedureList).toHaveBeenCalled();


        expect(procedureService.getProcedureSection).toHaveBeenCalledWith(stepsT,scope.role.cRole.callsign);
        expect(procedureService.getCompletedSteps).toHaveBeenCalledWith(procSectionSteps);
        expect(procedureService.openNextSteps).toHaveBeenCalled();
        expect(scope.steps).toEqual(res);

        expect(scope.updateLiveInstance).toBeDefined();
        scope.updateLiveInstance();
        expect(procedureService.getLiveInstanceData).toHaveBeenCalledWith('1.1',2);
        expect(scope.steps).toEqual(res);

    });


    it('should define showPList and call showPlist', function() {
        var id = 0;
        var index = 1;
        var headertype = "mainheader";

        expect(scope.showPList).toBeDefined();
        scope.steps = steps;
        scope.showPList(id,index,headertype);
        
        expect(procedureService.showPList).toHaveBeenCalledWith(id,index,headertype,steps);
        expect(scope.steps).toEqual(lsteps);
    });

    it('should define setInfo and set Info for a saved procedure instance', function() {
        var rep = [
            {   
                step: '1.0',
                info: '',
                Step: '1.0',
                Type: 'Heading', 
                Content: 'Pre-Action Safety Information', 
                Role: 'MD', 
                Info: '', 
                index: 1, 
                class: 'fa fa-caret-right', 
                header: true, 
                headertype: 'mainheader', 
                headervalue: '1', 
                openstatus: true, 
                rowstyle: {rowcolor:{backgroundColor: '#e9f6fb' } }, 
                chkval: false, 
                status: false,
                recordedValue: "",
                contenttype : "String",
                buttonStatus: '',
                comments:""
            }, 
            {   
                step: '1.1', 
                info: '', 
                Step: '1.1', 
                Type: 'Warning', 
                Content: 'Review applicable safety information, from documents located in Mission Specific Release Folder. Failure to consider guidelines may result in personal injury or death.', 
                Role: 'MD', 
                Info: '', 
                index: 1.1, 
                class: 'fa fa-caret-right', 
                header: false, 
                headertype: 'listitem', 
                headervalue: '1', 
                openstatus: false, 
                rowstyle: {rowcolor:{backgroundColor: '#e9f6fb' } }, 
                chkval: false, 
                typeicon: 'fa fa-exclamation-triangle', 
                status: false,
                recordedValue: "",
                contenttype : "AlertInfo",
                buttonStatus: '',
                comments:""
            }, 
            {   
                step: '1.2', 
                info: '', 
                Step: '1.2', 
                Type: 'Action', 
                Content: 'Make required safety announcement on VL-AZERO', 
                Role: 'MD', 
                Info: '', 
                index: 1.2, 
                class: 'fa fa-caret-right', 
                header: false, 
                headertype: 'listitem', 
                headervalue: '1', 
                openstatus: false, 
                rowstyle: {rowcolor: {backgroundColor: '#e9f6fb' }}, 
                chkval: false, 
                typeicon: 'fa fa-cog', 
                status: false,
                recordedValue: "",
                contenttype : "Array",
                buttonStatus: '',
                comments:""
            }, 
            {   
                step: '2.0', 
                info: '034.11:26:49 UTC Taruni Gattu(VIP)', 
                Step: '2.0', 
                Type: 'Heading', 
                Content: 'Close Procedure', 
                Role: 'MD', 
                Info: '034.11:26:49 UTC Taruni Gattu(VIP)', 
                index: 2, 
                class: 'fa fa-caret-right', 
                header: true, 
                headertype: 'mainheader', 
                headervalue: '2', 
                openstatus: true, 
                rowstyle: {rowcolor: {backgroundColor: '#c6ecc6' }}, 
                chkval: true, 
                status: true,
                recordedValue: "",
                contenttype : "String",
                buttonStatus: '',
                comments:""
            }, 
            {
                step: '2.1.0', 
                info: '034.11:26:50 UTC Taruni Gattu(VIP)', 
                Step: '2.1.0', 
                Type: 'Action', 
                Content: 'Update the shift log with procedure close status / notes', 
                Role: 'MD', 
                Info: '034.11:26:50 UTC Taruni Gattu(VIP)', 
                index: 2.1, 
                class: 'fa fa-caret-down', 
                header: true, 
                headertype: 'subheader', 
                headervalue: '2', 
                openstatus: false, 
                rowstyle: {rowcolor: {backgroundColor: '#c6ecc6' }}, 
                chkval: true, 
                typeicon: 'fa fa-cog', 
                status: true,
                recordedValue: "",
                contenttype : "Array",
                buttonStatus: '',
                comments:""
            }, 
            {   step: '2.1.1', 
                info: '', 
                Step: '2.1.1', 
                Type: 'Action', 
                Content: 'Close the procedure in Quantum (complete this step)', 
                Role: 'MD', 
                Info: '', 
                index: 2.1, 
                class: 'fa fa-caret-right', 
                header: false, 
                headertype: 'listitem', 
                headervalue: '2', 
                openstatus: false, 
                rowstyle: {rowcolor: {backgroundColor: '#e9f6fb' }}, 
                chkval: false, 
                typeicon: 'fa fa-cog', 
                status: false,
                recordedValue: "",
                contenttype : "String",
                buttonStatus: '',
                comments:""
            }
        ];

        spyOn(procedureService, "checkIfEmpty").and.returnValue(false);  
        //spyOn(procedureService, "setInfo").and.returnValue(mid_res);
        spyOn(procedureService, "setInfo").and.returnValue(deferredSetInfo.promise);
        expect(scope.setInfo).toBeDefined();
        scope.steps = rep;
        scope.inputStepValues = [
            {
                "snum":"",
                "ivalue":""
            },
            {
                "snum":"",
                "ivalue":""
            },
            {
                "snum":"",
                "ivalue":""
            },
            {
                "snum":"",
                "ivalue":""
            },
            {
                "snum":"",
                "ivalue":""
            },
            {
                "snum":"",
                "ivalue":""
            }
        ];
        scope.tempValues = [
            {
                "snum":"",
                "ivalue":"",
                "comments":""
            },
            {
                "snum":"",
                "ivalue":"",
                "comments":""
            },
            {
                "snum":"",
                "ivalue":"",
                "comments":""
            },
            {
                "snum":"",
                "ivalue":"",
                "comments":""
            },
            {
                "snum":"",
                "ivalue":"",
                "comments":""
            },
            {
                "snum":"",
                "ivalue":"",
                "comments":""
            }
        ];
        scope.setInfo(0,true);
        expect(timeService.getTime).toHaveBeenCalled();
        expect(procedureService.setInfo).toHaveBeenCalledWith("070.10:10:50 UTC John Smith(MD)",'1.1',0,'John Smith(MD)',2,"2018 - 070.10:10:50 UTC","","String");
        expect(procedureService.openNextSteps).toHaveBeenCalledWith(mid_res,0);
        expect(procedureService.openNextSteps(mid_res,0)).toEqual(res);
    });

    it('should not set Info for a procedure step if the input field is empty', function() {
        var rep = [
            {   
                step: '1.0',
                info: '',
                Step: '1.0',
                Type: 'Heading', 
                Content: 'Pre-Action Safety Information', 
                Role: 'MD', 
                Info: '', 
                index: 1, 
                class: 'fa fa-caret-right', 
                header: true, 
                headertype: 'mainheader', 
                headervalue: '1', 
                openstatus: true, 
                rowstyle: {rowcolor:{backgroundColor: '#e9f6fb' } }, 
                chkval: false, 
                status: false,
                recordedValue: "",
                contenttype : "String",
                buttonStatus: '',
                comments:""
            }, 
            {   
                step: '1.1', 
                info: '', 
                Step: '1.1', 
                Type: 'Record', 
                Content: 'Review applicable safety information, from documents located in Mission Specific Release Folder. Failure to consider guidelines may result in personal injury or death.', 
                Role: 'MD', 
                Info: '', 
                index: 1.1, 
                class: 'fa fa-caret-right', 
                header: false, 
                headertype: 'listitem', 
                headervalue: '1', 
                openstatus: false, 
                rowstyle: {rowcolor:{backgroundColor: '#e9f6fb' } }, 
                chkval: false, 
                typeicon: 'fa fa-exclamation-triangle', 
                status: false,
                recordedValue: "",
                contenttype : "Input",
                buttonStatus: '',
                comments:""
            }, 
            {   
                step: '1.2', 
                info: '', 
                Step: '1.2', 
                Type: 'Action', 
                Content: 'Make required safety announcement on VL-AZERO', 
                Role: 'MD', 
                Info: '', 
                index: 1.2, 
                class: 'fa fa-caret-right', 
                header: false, 
                headertype: 'listitem', 
                headervalue: '1', 
                openstatus: false, 
                rowstyle: {rowcolor: {backgroundColor: '#e9f6fb' }}, 
                chkval: false, 
                typeicon: 'fa fa-cog', 
                status: false,
                recordedValue: "",
                contenttype : "Array",
                buttonStatus: '',
                comments:""
            }, 
            {   
                step: '2.0', 
                info: '034.11:26:49 UTC Taruni Gattu(VIP)', 
                Step: '2.0', 
                Type: 'Heading', 
                Content: 'Close Procedure', 
                Role: 'MD', 
                Info: '034.11:26:49 UTC Taruni Gattu(VIP)', 
                index: 2, 
                class: 'fa fa-caret-right', 
                header: true, 
                headertype: 'mainheader', 
                headervalue: '2', 
                openstatus: true, 
                rowstyle: {rowcolor: {backgroundColor: '#c6ecc6' }}, 
                chkval: true, 
                status: true,
                recordedValue: "",
                contenttype : "String",
                buttonStatus: '',
                comments:""
            }, 
            {
                step: '2.1.0', 
                info: '034.11:26:50 UTC Taruni Gattu(VIP)', 
                Step: '2.1.0', 
                Type: 'Action', 
                Content: 'Update the shift log with procedure close status / notes', 
                Role: 'MD', 
                Info: '034.11:26:50 UTC Taruni Gattu(VIP)', 
                index: 2.1, 
                class: 'fa fa-caret-down', 
                header: true, 
                headertype: 'subheader', 
                headervalue: '2', 
                openstatus: false, 
                rowstyle: {rowcolor: {backgroundColor: '#c6ecc6' }}, 
                chkval: true, 
                typeicon: 'fa fa-cog', 
                status: true,
                recordedValue: "",
                contenttype : "Array",
                buttonStatus: '',
                comments:""
            }, 
            {   step: '2.1.1', 
                info: '', 
                Step: '2.1.1', 
                Type: 'Action', 
                Content: 'Close the procedure in Quantum (complete this step)', 
                Role: 'MD', 
                Info: '', 
                index: 2.1, 
                class: 'fa fa-caret-right', 
                header: false, 
                headertype: 'listitem', 
                headervalue: '2', 
                openstatus: false, 
                rowstyle: {rowcolor: {backgroundColor: '#e9f6fb' }}, 
                chkval: false, 
                typeicon: 'fa fa-cog', 
                status: false,
                recordedValue: "",
                contenttype : "String",
                buttonStatus: '',
                comments:""
            }
        ];

        // spyOn(procedureService, "checkIfEmpty").and.returnValue(false);  
        //spyOn(procedureService, "setInfo").and.returnValue(mid_res);
        spyOn(procedureService, "setInfo").and.returnValue(deferredSetInfo.promise);
        expect(scope.setInfo).toBeDefined();
        scope.steps = rep;
        scope.inputStepValues = [
            {
                "snum":"",
                "ivalue":""
            },
            {
                "snum":"",
                "ivalue":""
            },
            {
                "snum":"",
                "ivalue":""
            },
            {
                "snum":"",
                "ivalue":""
            },
            {
                "snum":"",
                "ivalue":""
            },
            {
                "snum":"",
                "ivalue":""
            }
        ];
        scope.tempValues = [
            {
                "snum":"",
                "ivalue":"",
                "comments":""
            },
            {
                "snum":"",
                "ivalue":"",
                "comments":""
            },
            {
                "snum":"",
                "ivalue":"",
                "comments":""
            },
            {
                "snum":"",
                "ivalue":"",
                "comments":""
            },
            {
                "snum":"",
                "ivalue":"",
                "comments":""
            },
            {
                "snum":"",
                "ivalue":"",
                "comments":""
            }
        ];
        scope.setInfo(1,true);
        expect(scope.usermessage).toEqual('Please enter the telemetry value in the field,click Set and then mark the checkbox.');
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


    it('should cancel interval when scope is destroyed', function(){
        spyOn($intervalSpy, 'cancel');
        scope.$destroy();
        expect($intervalSpy.cancel.calls.count()).toBe(1);
    });

    it('should call changeHeaderWithLocation function on location change', function() {
        var newUrl = '/dashboard';
        var oldUrl = '/dashboard/procedure/runninginstance/1.1/1';
        
        deferredUserStatus.resolve({ data :{},status : 200});
        scope.$apply(function() {
            rootScope.$broadcast('$locationChangeStart', newUrl, oldUrl);
        });
        expect(dashboardService.changeHeaderWithLocation).toHaveBeenCalled();
    });

    it('should set input value on call to updateInputValue function', function() {
        scope.inputStepValues = [
            {
                "snum":"",
                "ivalue":""
            },
            {
                "snum":"",
                "ivalue":""
            },
            {
                "snum":"",
                "ivalue":""
            },
            {
                "snum":"",
                "ivalue":""
            },
            {
                "snum":"",
                "ivalue":""
            },
            {
                "snum":"",
                "ivalue":""
            }
        ];

        scope.steps = [
            {   
                step: '1.0',
                info: '',
                Step: '1.0',
                Type: 'Heading', 
                Content: 'Pre-Action Safety Information', 
                Role: 'MD', 
                Info: '', 
                index: 1, 
                class: 'fa fa-caret-right', 
                header: true, 
                headertype: 'mainheader', 
                headervalue: '1', 
                openstatus: true, 
                rowstyle: {rowcolor:{backgroundColor: '#e9f6fb' } }, 
                chkval: false, 
                status: false,
                recordedValue:"",
                contenttype: "String"
            }, 
            {   
                step: '1.1', 
                info: '', 
                Step: '1.1', 
                Type: 'Warning', 
                Content: 'Review applicable safety information, from documents located in Mission Specific Release Folder. Failure to consider guidelines may result in personal injury or death.', 
                Role: 'MD', 
                Info: '', 
                index: 1.1, 
                class: 'fa fa-caret-right', 
                header: false, 
                headertype: 'listitem', 
                headervalue: '1', 
                openstatus: false, 
                rowstyle: {rowcolor:{backgroundColor: '#e9f6fb' } }, 
                chkval: false, 
                typeicon: 'fa fa-exclamation-triangle', 
                status: false,
                recordedValue:"",
                contenttype: "AlertInfo"
            }, 
            {   
                step: '1.2', 
                info: '', 
                Step: '1.2', 
                Type: 'Action', 
                Content: 'Make required safety announcement on VL-AZERO', 
                Role: 'MD', 
                Info: '', 
                index: 1.2, 
                class: 'fa fa-caret-right', 
                header: false, 
                headertype: 'listitem', 
                headervalue: '1', 
                openstatus: false, 
                rowstyle: {rowcolor: {backgroundColor: '#e9f6fb' }}, 
                chkval: false, 
                typeicon: 'fa fa-cog', 
                status: false,
                recordedValue:"",
                contenttype: "Array"
            }, 
            {   
                step: '2.0', 
                info: '034.11:26:49 UTC Taruni Gattu(VIP)', 
                Step: '2.0', 
                Type: 'Heading', 
                Content: 'Close Procedure', 
                Role: 'MD', 
                Info: '034.11:26:49 UTC Taruni Gattu(VIP)', 
                index: 2, 
                class: 'fa fa-caret-right', 
                header: true, 
                headertype: 'mainheader', 
                headervalue: '2', 
                openstatus: true, 
                rowstyle: {rowcolor: {backgroundColor: '#c6ecc6' }}, 
                chkval: true, 
                typeicon: 'fa fa-cog',
                status: true,
                recordedValue:"",
                contenttype: "String"
            }, 
            {
                step: '2.1.0', 
                info: '034.11:26:50 UTC Taruni Gattu(VIP)', 
                Step: '2.1.0', 
                Type: 'Action', 
                Content: 'Update the shift log with procedure close status / notes', 
                Role: 'MD', 
                Info: '034.11:26:50 UTC Taruni Gattu(VIP)', 
                index: 2.1, 
                class: 'fa fa-caret-down', 
                header: true, 
                headertype: 'subheader', 
                headervalue: '2', 
                openstatus: false, 
                rowstyle: {rowcolor: {backgroundColor: '#c6ecc6' }}, 
                chkval: true, 
                typeicon: 'fa fa-cog', 
                status: true,
                recordedValue:"",
                contenttype: "Array"
            }, 
            {   step: '2.1.1', 
                info: '', 
                Step: '2.1.1', 
                Type: 'Action', 
                Content: 'Close the procedure in Quantum (complete this step)', 
                Role: 'MD', 
                Info: '', 
                index: 2.1, 
                class: 'fa fa-caret-right', 
                header: false, 
                headertype: 'listitem', 
                headervalue: '2', 
                openstatus: false, 
                rowstyle: {rowcolor: {backgroundColor: '#e9f6fb' }}, 
                chkval: false, 
                typeicon: 'fa fa-cog', 
                status: false,
                recordedValue:"",
                contenttype: "String"
            }
        ];
        scope.updateInputValue(0,"123");
        expect(scope.inputStepValues[0].ivalue).toEqual("123");
        expect(scope.steps[0].buttonStatus).toEqual({backgroundColor:'#07D1EA',color:'#fff',outline: 0});
    });

    it('should alert user when no input entered but updateInputValue function is called', function() {
        scope.inputStepValues = [
            {
                "snum":"",
                "ivalue":""
            },
            {
                "snum":"",
                "ivalue":""
            },
            {
                "snum":"",
                "ivalue":""
            },
            {
                "snum":"",
                "ivalue":""
            },
            {
                "snum":"",
                "ivalue":""
            },
            {
                "snum":"",
                "ivalue":""
            }
        ];

        scope.steps = [
            {   
                step: '1.0',
                info: '',
                Step: '1.0',
                Type: 'Heading', 
                Content: 'Pre-Action Safety Information', 
                Role: 'MD', 
                Info: '', 
                index: 1, 
                class: 'fa fa-caret-right', 
                header: true, 
                headertype: 'mainheader', 
                headervalue: '1', 
                openstatus: true, 
                rowstyle: {rowcolor:{backgroundColor: '#e9f6fb' } }, 
                chkval: false, 
                status: false,
                recordedValue:"",
                contenttype: "String"
            }, 
            {   
                step: '1.1', 
                info: '', 
                Step: '1.1', 
                Type: 'Warning', 
                Content: 'Review applicable safety information, from documents located in Mission Specific Release Folder. Failure to consider guidelines may result in personal injury or death.', 
                Role: 'MD', 
                Info: '', 
                index: 1.1, 
                class: 'fa fa-caret-right', 
                header: false, 
                headertype: 'listitem', 
                headervalue: '1', 
                openstatus: false, 
                rowstyle: {rowcolor:{backgroundColor: '#e9f6fb' } }, 
                chkval: false, 
                typeicon: 'fa fa-exclamation-triangle', 
                status: false,
                recordedValue:"",
                contenttype: "AlertInfo"
            }, 
            {   
                step: '1.2', 
                info: '', 
                Step: '1.2', 
                Type: 'Action', 
                Content: 'Make required safety announcement on VL-AZERO', 
                Role: 'MD', 
                Info: '', 
                index: 1.2, 
                class: 'fa fa-caret-right', 
                header: false, 
                headertype: 'listitem', 
                headervalue: '1', 
                openstatus: false, 
                rowstyle: {rowcolor: {backgroundColor: '#e9f6fb' }}, 
                chkval: false, 
                typeicon: 'fa fa-cog', 
                status: false,
                recordedValue:"",
                contenttype: "Array"
            }, 
            {   
                step: '2.0', 
                info: '034.11:26:49 UTC Taruni Gattu(VIP)', 
                Step: '2.0', 
                Type: 'Heading', 
                Content: 'Close Procedure', 
                Role: 'MD', 
                Info: '034.11:26:49 UTC Taruni Gattu(VIP)', 
                index: 2, 
                class: 'fa fa-caret-right', 
                header: true, 
                headertype: 'mainheader', 
                headervalue: '2', 
                openstatus: true, 
                rowstyle: {rowcolor: {backgroundColor: '#c6ecc6' }}, 
                chkval: true, 
                typeicon: 'fa fa-cog',
                status: true,
                recordedValue:"",
                contenttype: "String"
            }, 
            {
                step: '2.1.0', 
                info: '034.11:26:50 UTC Taruni Gattu(VIP)', 
                Step: '2.1.0', 
                Type: 'Action', 
                Content: 'Update the shift log with procedure close status / notes', 
                Role: 'MD', 
                Info: '034.11:26:50 UTC Taruni Gattu(VIP)', 
                index: 2.1, 
                class: 'fa fa-caret-down', 
                header: true, 
                headertype: 'subheader', 
                headervalue: '2', 
                openstatus: false, 
                rowstyle: {rowcolor: {backgroundColor: '#c6ecc6' }}, 
                chkval: true, 
                typeicon: 'fa fa-cog', 
                status: true,
                recordedValue:"",
                contenttype: "Array"
            }, 
            {   step: '2.1.1', 
                info: '', 
                Step: '2.1.1', 
                Type: 'Action', 
                Content: 'Close the procedure in Quantum (complete this step)', 
                Role: 'MD', 
                Info: '', 
                index: 2.1, 
                class: 'fa fa-caret-right', 
                header: false, 
                headertype: 'listitem', 
                headervalue: '2', 
                openstatus: false, 
                rowstyle: {rowcolor: {backgroundColor: '#e9f6fb' }}, 
                chkval: false, 
                typeicon: 'fa fa-cog', 
                status: false,
                recordedValue:"",
                contenttype: "String"
            }
        ];
       
        scope.updateInputValue(0,"");
        expect(scope.usermessage).toEqual('Please enter value and then click Set');
    });

    it('should set buttonStatus when whentyping is called', function() {
        scope.steps = [
            {   
                step: '1.0',
                info: '',
                Step: '1.0',
                Type: 'Heading', 
                Content: 'Pre-Action Safety Information', 
                Role: 'MD', 
                Info: '', 
                index: 1, 
                class: 'fa fa-caret-right', 
                header: true, 
                headertype: 'mainheader', 
                headervalue: '1', 
                openstatus: true, 
                rowstyle: {rowcolor:{backgroundColor: '#e9f6fb' } }, 
                chkval: false, 
                status: false,
                recordedValue:"",
                contenttype: "String"
            }, 
            {   
                step: '1.1', 
                info: '', 
                Step: '1.1', 
                Type: 'Warning', 
                Content: 'Review applicable safety information, from documents located in Mission Specific Release Folder. Failure to consider guidelines may result in personal injury or death.', 
                Role: 'MD', 
                Info: '', 
                index: 1.1, 
                class: 'fa fa-caret-right', 
                header: false, 
                headertype: 'listitem', 
                headervalue: '1', 
                openstatus: false, 
                rowstyle: {rowcolor:{backgroundColor: '#e9f6fb' } }, 
                chkval: false, 
                typeicon: 'fa fa-exclamation-triangle', 
                status: false,
                recordedValue:"",
                contenttype: "AlertInfo"
            }, 
            {   
                step: '1.2', 
                info: '', 
                Step: '1.2', 
                Type: 'Action', 
                Content: 'Make required safety announcement on VL-AZERO', 
                Role: 'MD', 
                Info: '', 
                index: 1.2, 
                class: 'fa fa-caret-right', 
                header: false, 
                headertype: 'listitem', 
                headervalue: '1', 
                openstatus: false, 
                rowstyle: {rowcolor: {backgroundColor: '#e9f6fb' }}, 
                chkval: false, 
                typeicon: 'fa fa-cog', 
                status: false,
                recordedValue:"",
                contenttype: "Array"
            }, 
            {   
                step: '2.0', 
                info: '034.11:26:49 UTC Taruni Gattu(VIP)', 
                Step: '2.0', 
                Type: 'Heading', 
                Content: 'Close Procedure', 
                Role: 'MD', 
                Info: '034.11:26:49 UTC Taruni Gattu(VIP)', 
                index: 2, 
                class: 'fa fa-caret-right', 
                header: true, 
                headertype: 'mainheader', 
                headervalue: '2', 
                openstatus: true, 
                rowstyle: {rowcolor: {backgroundColor: '#c6ecc6' }}, 
                chkval: true, 
                typeicon: 'fa fa-cog',
                status: true,
                recordedValue:"",
                contenttype: "String"
            }, 
            {
                step: '2.1.0', 
                info: '034.11:26:50 UTC Taruni Gattu(VIP)', 
                Step: '2.1.0', 
                Type: 'Action', 
                Content: 'Update the shift log with procedure close status / notes', 
                Role: 'MD', 
                Info: '034.11:26:50 UTC Taruni Gattu(VIP)', 
                index: 2.1, 
                class: 'fa fa-caret-down', 
                header: true, 
                headertype: 'subheader', 
                headervalue: '2', 
                openstatus: false, 
                rowstyle: {rowcolor: {backgroundColor: '#c6ecc6' }}, 
                chkval: true, 
                typeicon: 'fa fa-cog', 
                status: true,
                recordedValue:"",
                contenttype: "Array"
            }, 
            {   step: '2.1.1', 
                info: '', 
                Step: '2.1.1', 
                Type: 'Action', 
                Content: 'Close the procedure in Quantum (complete this step)', 
                Role: 'MD', 
                Info: '', 
                index: 2.1, 
                class: 'fa fa-caret-right', 
                header: false, 
                headertype: 'listitem', 
                headervalue: '2', 
                openstatus: false, 
                rowstyle: {rowcolor: {backgroundColor: '#e9f6fb' }}, 
                chkval: false, 
                typeicon: 'fa fa-cog', 
                status: false,
                recordedValue:"",
                contenttype: "String"
            }
        ];
        scope.whenTyping(0);
        expect(scope.steps[0].buttonStatus).toEqual({outline: 0});
    });

    it('should set text area previously saved value when whenTypingComments is called', function() {
        scope.tempValues = [
            {
                "snum":"",
                "ivalue":"",
                "comments":""
            },
            {
                "snum":"",
                "ivalue":"",
                "comments":""
            },
            {
                "snum":"",
                "ivalue":"",
                "comments":""
            },
            {
                "snum":"",
                "ivalue":"",
                "comments":""
            },
            {
                "snum":"",
                "ivalue":"",
                "comments":""
            },
            {
                "snum":"",
                "ivalue":"",
                "comments":""
            }
        ];
        scope.steps = [
            {   
                step: '1.0',
                info: '',
                Step: '1.0',
                Type: 'Heading', 
                Content: 'Pre-Action Safety Information', 
                Role: 'MD', 
                Info: '', 
                index: 1, 
                class: 'fa fa-caret-right', 
                header: true, 
                headertype: 'mainheader', 
                headervalue: '1', 
                openstatus: true, 
                rowstyle: {rowcolor:{backgroundColor: '#e9f6fb' } }, 
                chkval: false, 
                status: false,
                recordedValue:"",
                contenttype: "String",
                comments:"test comment"
            }, 
            {   
                step: '1.1', 
                info: '', 
                Step: '1.1', 
                Type: 'Warning', 
                Content: 'Review applicable safety information, from documents located in Mission Specific Release Folder. Failure to consider guidelines may result in personal injury or death.', 
                Role: 'MD', 
                Info: '', 
                index: 1.1, 
                class: 'fa fa-caret-right', 
                header: false, 
                headertype: 'listitem', 
                headervalue: '1', 
                openstatus: false, 
                rowstyle: {rowcolor:{backgroundColor: '#e9f6fb' } }, 
                chkval: false, 
                typeicon: 'fa fa-exclamation-triangle', 
                status: false,
                recordedValue:"",
                contenttype: "AlertInfo",
                comments:""
            }, 
            {   
                step: '1.2', 
                info: '', 
                Step: '1.2', 
                Type: 'Action', 
                Content: 'Make required safety announcement on VL-AZERO', 
                Role: 'MD', 
                Info: '', 
                index: 1.2, 
                class: 'fa fa-caret-right', 
                header: false, 
                headertype: 'listitem', 
                headervalue: '1', 
                openstatus: false, 
                rowstyle: {rowcolor: {backgroundColor: '#e9f6fb' }}, 
                chkval: false, 
                typeicon: 'fa fa-cog', 
                status: false,
                recordedValue:"",
                contenttype: "Array",
                comments:""
            }, 
            {   
                step: '2.0', 
                info: '034.11:26:49 UTC Taruni Gattu(VIP)', 
                Step: '2.0', 
                Type: 'Heading', 
                Content: 'Close Procedure', 
                Role: 'MD', 
                Info: '034.11:26:49 UTC Taruni Gattu(VIP)', 
                index: 2, 
                class: 'fa fa-caret-right', 
                header: true, 
                headertype: 'mainheader', 
                headervalue: '2', 
                openstatus: true, 
                rowstyle: {rowcolor: {backgroundColor: '#c6ecc6' }}, 
                chkval: true, 
                typeicon: 'fa fa-cog',
                status: true,
                recordedValue:"",
                contenttype: "String",
                comments:""
            }, 
            {
                step: '2.1.0', 
                info: '034.11:26:50 UTC Taruni Gattu(VIP)', 
                Step: '2.1.0', 
                Type: 'Action', 
                Content: 'Update the shift log with procedure close status / notes', 
                Role: 'MD', 
                Info: '034.11:26:50 UTC Taruni Gattu(VIP)', 
                index: 2.1, 
                class: 'fa fa-caret-down', 
                header: true, 
                headertype: 'subheader', 
                headervalue: '2', 
                openstatus: false, 
                rowstyle: {rowcolor: {backgroundColor: '#c6ecc6' }}, 
                chkval: true, 
                typeicon: 'fa fa-cog', 
                status: true,
                recordedValue:"",
                contenttype: "Array",
                comments:""
            }, 
            {   step: '2.1.1', 
                info: '', 
                Step: '2.1.1', 
                Type: 'Action', 
                Content: 'Close the procedure in Quantum (complete this step)', 
                Role: 'MD', 
                Info: '', 
                index: 2.1, 
                class: 'fa fa-caret-right', 
                header: false, 
                headertype: 'listitem', 
                headervalue: '2', 
                openstatus: false, 
                rowstyle: {rowcolor: {backgroundColor: '#e9f6fb' }}, 
                chkval: false, 
                typeicon: 'fa fa-cog', 
                status: false,
                recordedValue:"",
                contenttype: "String",
                comments:""
            }
        ];
        scope.whenTypingComments(0);
        expect(scope.tempValues[0].comments).toEqual("test comment");
    });

    
    it('should store comments in the database when saveComments is called', function() {
        var rep = [
            {   
                step: '1.0',
                info: '',
                Step: '1.0',
                Type: 'Heading', 
                Content: 'Pre-Action Safety Information', 
                Role: 'MD', 
                Info: '', 
                index: 1, 
                class: 'fa fa-caret-right', 
                header: true, 
                headertype: 'mainheader', 
                headervalue: '1', 
                openstatus: true, 
                rowstyle: {rowcolor:{backgroundColor: '#e9f6fb' } }, 
                chkval: false, 
                status: false,
                recordedValue:"",
                contenttype: "String",
                buttonStatus: '',
                comments:""
            }, 
            {   
                step: '1.1', 
                info: '', 
                Step: '1.1', 
                Type: 'Warning', 
                Content: 'Review applicable safety information, from documents located in Mission Specific Release Folder. Failure to consider guidelines may result in personal injury or death.', 
                Role: 'MD', 
                Info: '', 
                index: 1.1, 
                class: 'fa fa-caret-right', 
                header: false, 
                headertype: 'listitem', 
                headervalue: '1', 
                openstatus: false, 
                rowstyle: {rowcolor:{backgroundColor: '#e9f6fb' } }, 
                chkval: false, 
                typeicon: 'fa fa-exclamation-triangle', 
                status: false,
                recordedValue:"",
                contenttype: "AlertInfo",
                buttonStatus: '',
                comments:""
            }, 
            {   
                step: '1.2', 
                info: '', 
                Step: '1.2', 
                Type: 'Action', 
                Content: 'Make required safety announcement on VL-AZERO', 
                Role: 'MD', 
                Info: '', 
                index: 1.2, 
                class: 'fa fa-caret-right', 
                header: false, 
                headertype: 'listitem', 
                headervalue: '1', 
                openstatus: false, 
                rowstyle: {rowcolor: {backgroundColor: '#e9f6fb' }}, 
                chkval: false, 
                typeicon: 'fa fa-cog', 
                status: false,
                recordedValue:"",
                contenttype: "Array",
                buttonStatus: '',
                comments:""
            }, 
            {   
                step: '2.0', 
                info: '034.11:26:49 UTC Taruni Gattu(VIP)', 
                Step: '2.0', 
                Type: 'Heading', 
                Content: 'Close Procedure', 
                Role: 'MD', 
                Info: '034.11:26:49 UTC Taruni Gattu(VIP)', 
                index: 2, 
                class: 'fa fa-caret-right', 
                header: true, 
                headertype: 'mainheader', 
                headervalue: '2', 
                openstatus: true, 
                rowstyle: {rowcolor: {backgroundColor: '#c6ecc6' }}, 
                chkval: true, 
                typeicon: 'fa fa-cog',
                status: true,
                recordedValue:"",
                contenttype: "String",
                buttonStatus: '',
                comments:""
            }, 
            {
                step: '2.1.0', 
                info: '034.11:26:50 UTC Taruni Gattu(VIP)', 
                Step: '2.1.0', 
                Type: 'Action', 
                Content: 'Update the shift log with procedure close status / notes', 
                Role: 'MD', 
                Info: '034.11:26:50 UTC Taruni Gattu(VIP)', 
                index: 2.1, 
                class: 'fa fa-caret-down', 
                header: true, 
                headertype: 'subheader', 
                headervalue: '2', 
                openstatus: false, 
                rowstyle: {rowcolor: {backgroundColor: '#c6ecc6' }}, 
                chkval: true, 
                typeicon: 'fa fa-cog', 
                status: true,
                recordedValue:"",
                contenttype: "Array",
                buttonStatus: '',
                comments:""
            }, 
            {   step: '2.1.1', 
                info: '', 
                Step: '2.1.1', 
                Type: 'Action', 
                Content: 'Close the procedure in Quantum (complete this step)', 
                Role: 'MD', 
                Info: '', 
                index: 2.1, 
                class: 'fa fa-caret-right', 
                header: false, 
                headertype: 'listitem', 
                headervalue: '2', 
                openstatus: false, 
                rowstyle: {rowcolor: {backgroundColor: '#e9f6fb' }}, 
                chkval: false, 
                typeicon: 'fa fa-cog', 
                status: false,
                recordedValue:"",
                contenttype: "String",
                buttonStatus: '',
                comments:""
            }
        ];

        spyOn(procedureService, "setComments").and.returnValue(deferredSetComments.promise);
        expect(scope.saveComments).toBeDefined();
        scope.steps = rep;
        scope.inputStepValues = [
            {
                "snum":"",
                "ivalue":""
            },
            {
                "snum":"",
                "ivalue":""
            },
            {
                "snum":"",
                "ivalue":""
            },
            {
                "snum":"",
                "ivalue":""
            },
            {
                "snum":"",
                "ivalue":""
            },
            {
                "snum":"",
                "ivalue":""
            }
        ];
        scope.tempValues = [
            {
                "snum":"",
                "ivalue":"",
                "comments":""
            },
            {
                "snum":"",
                "ivalue":"",
                "comments":""
            },
            {
                "snum":"",
                "ivalue":"",
                "comments":""
            },
            {
                "snum":"",
                "ivalue":"",
                "comments":""
            },
            {
                "snum":"",
                "ivalue":"",
                "comments":""
            },
            {
                "snum":"",
                "ivalue":"",
                "comments":""
            }
        ];

        scope.params = {
            procID : '1.1',
            revisionID: 2
        }

        deferredSetInfo.resolve({status:200});
        scope.$digest();
        scope.saveComments("test comment",0);
        expect(timeService.getTime).toHaveBeenCalled();
        expect(procedureService.setComments).toHaveBeenCalledWith('1.1',2,0,"test comment",'2018 - 070.10:10:50 UTC');
        expect(scope.clock).toEqual({
            days : '070',
            minutes : '10',
            hours : '10',
            seconds : '50',
            utc : '070.10:10:50 UTC',
            year : '2018'
        });
    });

    it('should open a modal to confirm closing a procedure and archive the procedure on click on Ok', function() {
        scope.steps = [
            {   
                step: '1.0',
                info: '070.10:10:50 UTC John Smith(MD)',
                Step: '1.0',
                Type: 'Heading', 
                Content: 'Pre-Action Safety Information', 
                Role: 'MD', 
                Info: '070.10:10:50 UTC John Smith(MD)', 
                index: 1, 
                class: 'fa fa-caret-right', 
                header: true, 
                headertype: 'mainheader', 
                headervalue: '1', 
                openstatus: true, 
                rowstyle: {rowcolor:{backgroundColor: '#c6ecc6' } }, 
                chkval: true, 
                ivalue:'',
                status: true
            }, 
            {   
                step: '1.1', 
                info: '070.10:10:51 UTC John Smith(MD)', 
                Step: '1.1', 
                Type: 'Warning', 
                Content: 'Review applicable safety information, from documents located in Mission Specific Release Folder. Failure to consider guidelines may result in personal injury or death.', 
                Role: 'MD', 
                Info: '070.10:10:51 UTC John Smith(MD)', 
                index: 1.1, 
                class: 'fa fa-caret-right', 
                header: false, 
                headertype: 'listitem', 
                headervalue: '1', 
                openstatus: true, 
                rowstyle: {rowcolor:{backgroundColor: '#e9f6fb' } }, 
                chkval: true, 
                ivalue:'',
                typeicon: 'fa fa-exclamation-triangle', 
                status: true
            }, 
            {   
                step: '1.2', 
                info: '070.10:10:52 UTC John Smith(MD)', 
                Step: '1.2', 
                Type: 'Action', 
                Content: 'Make required safety announcement on VL-AZERO', 
                Role: 'MD', 
                Info: '070.10:10:52 UTC John Smith(MD)', 
                index: 1.2, 
                class: 'fa fa-caret-right', 
                header: false, 
                headertype: 'listitem', 
                headervalue: '1', 
                openstatus: true, 
                rowstyle: {rowcolor: {backgroundColor: '#e9f6fb' }}, 
                chkval: true, 
                ivalue: '',
                typeicon: 'fa fa-cog', 
                status: true
            }, 
            {   
                step: '2.0', 
                info: '034.11:26:49 UTC Taruni Gattu(VIP)', 
                Step: '2.0', 
                Type: undefined, 
                Content: 'Close Procedure', 
                Role: 'MD', 
                Info: '034.11:26:49 UTC Taruni Gattu(VIP)', 
                index: 2, 
                class: 'fa fa-caret-right', 
                header: true, 
                headertype: 'mainheader', 
                headervalue: '2', 
                openstatus: true, 
                rowstyle: {rowcolor: {backgroundColor: '#c6ecc6' }}, 
                chkval: true, 
                ivalue:'',
                status: true
            }, 
            {
                step: '2.1.0', 
                info: '034.11:26:50 UTC Taruni Gattu(VIP)', 
                Step: '2.1.0', 
                Type: 'Action', 
                Content: 'Update the shift log with procedure close status / notes', 
                Role: 'MD', 
                Info: '034.11:26:50 UTC Taruni Gattu(VIP)', 
                index: 2.1, 
                class: 'fa fa-caret-down', 
                header: true, 
                headertype: 'subheader', 
                headervalue: '2', 
                openstatus: true, 
                rowstyle: {rowcolor: {backgroundColor: '#c6ecc6' }}, 
                chkval: true, 
                ivalue: '',
                typeicon: 'fa fa-cog', 
                status: true
            }, 
            {   step: '2.1.1', 
                info: '', 
                Step: '2.1.1', 
                Type: 'Action', 
                Content: 'Close the procedure in Quantum (complete this step)', 
                Role: 'MD', 
                Info: '', 
                index: 2.1, 
                class: 'fa fa-caret-right', 
                header: false, 
                headertype: 'listitem', 
                headervalue: '2', 
                openstatus: true, 
                rowstyle: {rowcolor: {backgroundColor: '#e9f6fb' }}, 
                chkval: false, 
                typeicon: 'fa fa-cog', 
                ivalue: '',
                status: false
            }
        ];

        scope.currentRevision = 2;

        var fakeModal = {
            result: {
                then: function(confirmCallback, cancelCallback) {
                    //Store the callbacks for later when the user clicks on the OK or Cancel button of the dialog
                    this.confirmCallBack = confirmCallback;
                    this.cancelCallback = cancelCallback;
                }
            }
        };
        scope.inputStepValues = [
            {
                snum:scope.steps[0].Step,
                ivalue:""
            },
            {
                snum:scope.steps[1].Step,
                ivalue:""
            },
            {
                snum:scope.steps[2].Step,
                ivalue:""
            },
            {
                snum:scope.steps[3].Step,
                ivalue:""
            },
            {
                snum:scope.steps[4].Step,
                ivalue:""
            },
            {
                snum:scope.steps[5].Step,
                ivalue:""
            }
        ]

        var modalResult = {};
        var mockModalInstance = { result: $q.resolve(modalResult,true) };
        spyOn(mockModalInstance.result, 'then').and.callThrough();
        spyOn(modalInstance, 'open').and.returnValue(mockModalInstance);
        spyOn(procedureService, "setInfo").and.returnValue(deferredSetInfo.promise);
        spyOn(procedureService, "setProcedureName").and.callThrough();
        spyOn(procedureService, "setHeaderStyles").and.callThrough();

        deferredSetInfo.resolve({status:200});
        deferredInstanceCompleted.resolve({status:200,data : {procedure : {title: "Procedure Example"}}});
        scope.setInfo(5,true);
        scope.$digest();
        expect(scope.setInfo).toBeDefined();
        expect(modalInstance.open).toHaveBeenCalled();
        expect(mockModalInstance.result.then).toHaveBeenCalledWith(jasmine.any(Function),jasmine.any(Function));
        expect(scope.steps[5].Info).toEqual('070.10:10:50 UTC John Smith(MD)');

    });

});