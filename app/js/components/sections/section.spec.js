describe('Test Suite for Section Controller', function () {
    var controller,scope,procedureService,userService, deferred, $q,timeService,$interval,rootScope,dashboardService;
    var windowMock = {
        innerWidth: 1000,
        user : {
            currentRole : {callsign : 'MD'}
        },
        alert: function(message) {
            
        }
    };

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
            Type: 'Action', 
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
            typeicon: 'fa fa-cog'
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
            Type: 'Action', 
            Content: 'Close Procedure', 
            Role: 'MD', 
            Info: '034.11:26:49 UTC Taruni Gattu(VIP)', 
            index: 2, 
            class: 'fa fa-caret-right', 
            header: true, 
            headertype: 'mainheader', 
            headervalue: '2', 
            openstatus: true,
            typeicon: 'fa fa-cog'
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
            Info: ''
        }, 
        {   
            step: '1.1', 
            info: '', 
            Step: '1.1', 
            Type: 'Warning', 
            Content: 'Review applicable safety information, from documents located in Mission Specific Release Folder. Failure to consider guidelines may result in personal injury or death.', 
            Role: 'MD', 
            Info: ''
        }, 
        {   
            step: '1.2', 
            info: '', 
            Step: '1.2', 
            Type: 'Action', 
            Content: 'Make required safety announcement on VL-AZERO', 
            Role: 'MD', 
            Info: ''
        }, 
        {   
            step: '2.0', 
            info: '034.11:26:49 UTC Taruni Gattu(VIP)', 
            Step: '2.0', 
            Type: 'Action', 
            Content: 'Close Procedure', 
            Role: 'MD', 
            Info: '034.11:26:49 UTC Taruni Gattu(VIP)'
        }, 
        {
            step: '2.1.0', 
            info: '034.11:26:50 UTC Taruni Gattu(VIP)', 
            Step: '2.1.0', 
            Type: 'Action', 
            Content: 'Update the shift log with procedure close status / notes', 
            Role: 'MD', 
            Info: '034.11:26:50 UTC Taruni Gattu(VIP)'
        }, 
        {   
            step: '2.1.1', 
            info: '', 
            Step: '2.1.1', 
            Type: 'Action', 
            Content: 'Close the procedure in Quantum (complete this step)', 
            Role: 'MD', 
            Info: ''
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
            "procedure": {
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
                        "Step": "2.0",
                        "Type": "Action"
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
                "id": "1.1"
            },
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
            "procedure": {
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
                        "Step": "2.0",
                        "Type": "Action"
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
                "id": "1.2"
            },
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
            Type: 'Action', 
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
            Type: 'Action', 
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
            rowstyle: {rowcolor:{backgroundColor: '#c6ecc6' }}, 
            chkval: false, 
            status: false,
            recordedValue:""
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
            recordedValue:""
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
            recordedValue:""
        }, 
        {
            step: '2.0', 
            info: '034.11:26:49 UTC Taruni Gattu(VIP)', 
            Step: '2.0', 
            Type: 'Action', 
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
            typeicon: 'fa fa-cog', 
            status: true,
            recordedValue:""
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
            recordedValue:""
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
            recordedValue:""
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
            Type: 'Action', 
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


         inject(function($controller, $rootScope, _$q_, _procedureService_,$routeParams,_userService_,_timeService_,$interval,_dashboardService_){
            scope = $rootScope.$new();
            rootScope = $rootScope;
            $q = _$q_;
            $intervalSpy = jasmine.createSpy('$interval', $interval);
            procedureService = _procedureService_;
            userService = _userService_;
            timeService = _timeService_;
            dashboardService = _dashboardService_;

            deferredProcedureList = _$q_.defer();
            spyOn(procedureService, "getProcedureList").and.returnValue(deferredProcedureList.promise);
            deferredLiveInstanceData = _$q_.defer();
            spyOn(procedureService, "getLiveInstanceData").and.returnValue(deferredLiveInstanceData.promise);
            // deferredProcedureInstance = _$q_.defer();
            // spyOn(procedureService, "saveProcedureInstance").and.returnValue(deferredProcedureInstance.promise);
            deferredSetInfo = _$q_.defer();
            deferredInstanceCompleted = _$q_.defer();
            spyOn(procedureService, "setInstanceCompleted").and.returnValue(deferredInstanceCompleted.promise);
            
           
            //spyOn(procedureService, "getProcedureSection").and.returnValue(procSectionSteps);
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

            deferredHeaderChange =  _$q_.defer();
            spyOn(dashboardService, "changeHeaderWithLocation").and.returnValue(deferredHeaderChange.promise);

            controller = $controller('sectionCtrl', {
                $scope: scope,
                $routeParams: {procID: '1.1',revisionID:'2'},
                procedureService: procedureService,
                userService: userService,
                timeService: timeService,
                $interval: $intervalSpy
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

    it('should define clock', function() {
        expect(scope.clock).toBeDefined();
        expect(scope.clock).toEqual({utc : "000.00.00.00 UTC"});
    });

    it('should define updateClock', function() {
        expect(scope.updateClock).toBeDefined();
        expect(scope.clock).toEqual({utc : "000.00.00.00 UTC"});
    });

    it('should call $interval two times', function(){
        expect($intervalSpy).toHaveBeenCalled();
        expect($intervalSpy.calls.count()).toBe(1);
    });

    it('should call $interval on updateClock', function(){
        expect($intervalSpy).toHaveBeenCalledWith(scope.updateClock, 1000);
    });

    it('should define the function updateClock', function(){
        expect(scope.updateClock).toBeDefined();
    });

    it('should update time of the clock on call of updateClock', function(){
        scope.updateClock();
        expect(scope.clock.utc).toEqual('070.10:10:50 UTC');
    });

    it('should define procedure', function() {
        expect(scope.procedure).toBeDefined();
        expect(scope.procedure).toEqual({id : '', name : '', status : '',fullname : '' })
    });

    it('should define viewProcedure and call getProcedureList', function() {

        var newres = [
            {   

                Step: '',
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
                rowstyle: {rowcolor:{backgroundColor: '#c6ecc6' } }, 
                chkval: true, 
                status: true
            }, 
            {   
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
                Step: '2.0', 
                Type: 'Action', 
                Content: 'Close Procedure', 
                Role: 'MD', 
                Info: '', 
                index: 2, 
                class: 'fa fa-caret-right', 
                header: true, 
                headertype: 'mainheader', 
                headervalue: '2', 
                openstatus: true, 
                rowstyle: {rowcolor: {backgroundColor: '#c6ecc6' }}, 
                chkval: true,
                typeicon: 'fa fa-cog', 
                status: true
            }, 
            {
                Step: '2.1.0', 
                Type: 'Action', 
                Content: 'Update the shift log with procedure close status / notes', 
                Role: 'MD', 
                Info: '', 
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

        spyOn(procedureService, "getProcedureSection").and.returnValue(newres);
        deferredProcedureList.resolve({data : result,status:200});
        scope.$digest();
        expect(scope.steps).toBeDefined();
        scope.currentRevision = 2;
        expect(procedureService.getProcedureList).toHaveBeenCalled();
        expect(procedureService.getProcedureSection).toHaveBeenCalledWith(result[0].procedure.sections,'MD');
       
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
                recordedValue:""
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
                recordedValue:""
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
                recordedValue:""
            }, 
            {   
                step: '2.0', 
                info: '034.11:26:49 UTC Taruni Gattu(VIP)', 
                Step: '2.0', 
                Type: 'Action', 
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
                recordedValue:""
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
                recordedValue:""
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
                recordedValue:""
            }
        ];

        spyOn(procedureService, "checkIfEmpty").and.returnValue(false);  
        spyOn(procedureService, "setInfo").and.returnValue(mid_res);
        expect(scope.setInfo).toBeDefined();
        scope.steps = rep;
        scope.clock = {
                days : '070',
                minutes : '10',
                hours : '10',
                seconds : '50',
                utc : '070.10:10:50 UTC',
                year : '2018'};
        scope.currentRevision = {value:2};
        scope.setInfo(0,true);
        expect(procedureService.setInfo).toHaveBeenCalledWith("070.10:10:50 UTC John Smith(MD)",'1.1',0,'John Smith(MD)',2,"2018 - 070.10:10:50 UTC",'');
        expect(procedureService.openNextSteps).toHaveBeenCalledWith(mid_res,0);
        expect(procedureService.openNextSteps(mid_res,0)).toEqual(res);
    });

    it('should not archive a procedure when cancelled the confirmation', function() {
        var rep = [
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
                status: false
            }
        ];

        windowMock.confirm = function(message){
            return false;
        }

        spyOn(procedureService, "archiveThisProcedure").and.returnValue(true);  
        spyOn(procedureService, "setInfo").and.returnValue(deferredSetInfo.promise);
        spyOn(procedureService, "setProcedureName").and.callThrough();
        spyOn(procedureService, "setHeaderStyles").and.callThrough();


        deferredSetInfo.resolve({status:200});
        deferredInstanceCompleted.resolve({status:200,data : {procedure : {title: "Procedure Example"}}});
        scope.$digest();
        //expect(scope.steps).toBeDefined();
        expect(scope.setInfo).toBeDefined();
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
                status: false
            }
        ];
        scope.clock = {
                days : '070',
                minutes : '10',
                hours : '10',
                seconds : '53',
                utc : '070.10:10:53 UTC',
                year : '2018'
        };
        scope.currentRevision = 2;


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
        expect($intervalSpy.cancel.calls.count()).toBe(2);
    });

    it('should call changeHeaderWithLocation function on location change', function() {
        var newUrl = 'http://foourl.com';
        var oldUrl = 'http://barurl.com'

        scope.$apply(function() {
            rootScope.$broadcast('$locationChangeStart', newUrl, oldUrl);
        });
        expect(dashboardService.changeHeaderWithLocation).toHaveBeenCalled();
    });

});