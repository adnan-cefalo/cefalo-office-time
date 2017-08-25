var stayMinutes = parseInt(localStorage.stayHours)*60+parseInt(localStorage.stayMinutes);

$(document).ready(function(){
    $('body').on('click', 'a', function(){
        chrome.tabs.create({url: $(this).attr('href')});
        return false;
    });


    var query_params = {
        userId: localStorage.employeeID,
        fromDateString: moment().format('DD-MMM-YYYY'),
        toDateString: moment().format('DD-MMM-YYYY'),
        includeWeekend: false,
        includeholiday: false,
        statusType: null
    };

    var url = 'http://attendance.cefalolab.com/Report/GetEmployeeAttendanceRecords?';

    if(localStorage.hasSettings !== 'true'){
        $('#not-configured')
            .show()
            .click(function(){
                chrome.runtime.openOptionsPage();
            });

        $('#present').hide();
        $('.status').hide();
    }
    else if(typeof localStorage.lastUpdate !== 'undefined' && moment().diff(localStorage.lastUpdate, 'minutes', false) < 2){
        setCounter();
    }
    else {
        $.getJSON(url, query_params, function (data) {
            if( typeof data[0] === 'undefined' || data[0].Status === 'Absent' ) {
                $('#absent').show();
                $('#present').hide();
                $('.status').hide();
            }
            else {
                localStorage.startTime = data[0].EntryTime;
                localStorage.lastUpdate = moment();
                localStorage.serverStatus = data[0].Status;
                localStorage.lastEntry = data[0].ExitTime;

                setCounter();
            }
        })
            .fail(function(){

                $('#not-logged-in')
                    .show();

                $('#present').hide();
                $('.status').hide();
            });
    }
});

function setCounter() {
    var entryTime = localStorage.startTime;

    $('#counter').countdown({
        end_time: moment(entryTime, "HH: mm").add(stayMinutes, 'minutes').toISOString(),
        show_day: false,
        // show_second: false,
    });

    var startTime = moment(entryTime, "HH: mm");
    var endTime = moment(entryTime, "HH: mm").add(stayMinutes, 'minutes');

    if(localStorage.lastTimeup !== moment().format('D-MMM-YYYY') && endTime.isAfter()){
        localStorage.lastTimeup = moment().format('D-MMM-YYYY');

        chrome.alarms.create('timeup', {
            when: endTime.valueOf()
        });
    }

    var spentMinutes = moment().diff(startTime, 'minutes');
    var spentHours = parseInt(spentMinutes / 60);
    spentMinutes %= 60;
    $('.stay-duration').text(spentHours+ ' hours and '+ spentMinutes + ' minutes ');

    $('.server-status').text(localStorage.serverStatus);
    switch (localStorage.serverStatus) {
        case 'Normal':
            $('.server-status').addClass('green-bg');
            break;
        case 'Absent':
            $('.server-status').addClass('red-bg');
            break;
        default:
            $('.server-status').addClass('yellow-bg');
            break;
    }
    $('.last-entry').text(moment(localStorage.lastEntry, 'HH: mm').format('hh:mma'));

    if(moment().isAfter(endTime)){
        $('#present').hide();
        $('#full').show();

        if(endTime.isBefore(moment(localStorage.lastEntry, 'HH: mm'))) $('#full').addClass('late');
        return;
    }

    $('.login-time').text(startTime.format('h:mma'));
    $('.logout-time').text(endTime.format('h:mma'));

    if(startTime.isBefore(moment(localStorage.entryHours+": "+localStorage.entryMinutes, "HH: mm"))){
        $('.login-time').addClass('green');
    }
    else {
        $('.login-time').addClass('yellow');
    }
}