quantum
.factory('timeService', ['$interval', '$http', function($interval, $http) {
    // var telemetry = {};
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
                    // telemetry['time'] = response.data.timestamp;
                    time = response.data.timestamp;
                }else{
                    // telemetry = {};
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
            var tyear = today.getFullYear();
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

        if(clock === "000.00:00:00 UTC"){
            tyear = (new Date()).getFullYear();
        }

        return {
            "today" : today,
            "days" : days, 
            "hours" : h,
            "minutes" : m,
            "seconds" : s,
            "utc" : clock,
            "year" : tyear
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

    return {
        getTime : getTime,
        time : time,
    }
}]);
  















