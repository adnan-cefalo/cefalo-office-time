$(document).ready(function(){
    if(typeof localStorage.entryHours !== 'undefined') $('#entryHours').val(localStorage.entryHours);
    if(typeof localStorage.entryMinutes !== 'undefined') $('#entryMinutes').val(localStorage.entryMinutes);
    if(typeof localStorage.stayHours !== 'undefined') $('#stayHours').val(localStorage.stayHours);
    if(typeof localStorage.stayMinutes !== 'undefined') $('#stayMinutes').val(localStorage.stayMinutes);

    $.getJSON('http://attendance.cefalolab.com/Report/GetAllUsers', {}, function (data) {

        $.each(data, function(i, user){
            var el = $('<option/>')
                .attr('value', user.AttSysUserId)
                .text(user.Name);

            if(user.AttSysUserId == localStorage.employeeID) {
                el.attr('selected', 'selected');
            }


            el.appendTo($('#employeeId'));
        });
    }).fail(function() {
        $('#options').hide();
        $('#not-logged-in').removeClass('hidden');
    });

    $('form').submit(function(e){
        e.preventDefault();

        localStorage.clear();

        localStorage.hasSettings = 'true';

        localStorage.employeeID = $('#employeeId').val();
        localStorage.entryHours = $('#entryHours').val();
        localStorage.entryMinutes = $('#entryMinutes').val();
        localStorage.stayHours = $('#stayHours').val();
        localStorage.stayMinutes = $('#stayMinutes').val();

        $('.saved').show().delay(3000).fadeOut();
        chrome.alarms.clearAll();

    });
});