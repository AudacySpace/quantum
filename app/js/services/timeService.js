quantum
.factory('timeService', ['$interval', '$http', function($interval, $http) {
    var telemetry = {};
    var time = "";
    var missionName = 'AZero';

    getTimestamp(missionName);

    function getTimestamp(missionName) {
        $interval(function () { 
            $http({
                url: "/getTimestamp", 
                method: "GET",
                params: {'mission' : 'AZero'}
            }).then(function success(response) {
                if(response.data){
                    //console.log(response.data);
                    telemetry['time'] = response.data.timestamp;
                    time = response.data.timestamp;
                }else{
                    telemetry = {};
                }

            }, function error(response){
                console.log(response);
            });
        },1000);
    }

    function getTime(offset) {
        var days = "000",
            h = "00",
            m = "00",
            s = "00",
            clock = days + "." + h + ":" + m + ":" + s + " " + "UTC";

        if(time != "") {
            var today = new Date(time);
            var todayZone = new Date(today.getTime() + (3600000*offset) + (today.getTimezoneOffset() * 60000));
            var start = new Date(todayZone.getFullYear(), 0, 0);
            var diff = todayZone - start;
            h = todayZone.getHours();
            m = todayZone.getMinutes();
            s = todayZone.getSeconds();
            days = Math.floor(diff/(1000*60*60*24));
            days = checkDays(days);
            h = checkTime(h);
            m = checkTime(m);
            s = checkTime(s);
            clock = days + "." + h + ":" + m + ":" + s + " " + "UTC";
        }

        return {
            "today" : today,
            "days" : days, 
            "hours" : h,
            "minutes" : m,
            "seconds" : s,
            "utc" : clock
        };
    }

    function checkTime(i) {
        if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
        return i;
    }

    function checkDays(d) {
        if (d < 10) {
            d = "00" + d;
        } else if (d < 100) {
            d = "0" + d;
        }
        return d;
    }

    function countdown(target) {
        var targettimestamp;
        if(typeof target === "string"){
            targettimestamp = new Date(target);
        }else {
            targettimestamp = target;
        }
        var days = "000",
            hours = "00",
            minutes = "00",
            seconds = "00",
            sign = '';

        if(time != "") {
            var today = new Date(time);
            var currentDate = new Date(today.getTime() + (today.getTimezoneOffset() * 60000));
            var signedDiff = targettimestamp - currentDate;

            //remove sign to calculate individual numbers
            var difference = Math.abs(signedDiff);
            // Time calculations for days, hours, minutes and seconds
            var days = Math.floor(difference / (1000 * 60 * 60 * 24));
            var hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((difference % (1000 * 60)) / 1000);

            // define sign
            if (signedDiff < 0) {
                sign = '+';
            } else {
                sign = '-';   
            }

            days = checkDays(days);
            hours = checkTime(hours);
            minutes = checkTime(minutes);
            seconds = checkTime(seconds);
        }

        return {
            "days" : days,
            "hours" : hours,
            "minutes" : minutes,
            "seconds" : seconds,
            "sign" : sign
        };
    }

    return {
        telemetry : telemetry,
        getTime : getTime,
        time : time
    }
}]);
  















