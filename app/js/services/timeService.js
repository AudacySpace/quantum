quantum
.factory('timeService', ['moment', function(moment) {
    var time = "";

    function getTime() {
        var days, h, m, s, clock, tyear;
        var time = moment().utc();

        if(time) {
            tyear = time.year();
            days = checkDays(time.dayOfYear());
            h = checkTime(time.hours());
            m = checkTime(time.minutes());
            s = checkTime(time.seconds());
            clock = days + "." + h + ":" + m + ":" + s + " " + "UTC";
        } else {
            days = "000",
            h = "00",
            m = "00",
            s = "00",
            clock = days + "." + h + ":" + m + ":" + s + " " + "UTC";
        }

        return {
            "today" : time,
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
        getTime : getTime
    }
}]);
