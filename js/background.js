chrome.alarms.onAlarm.addListener(function( alarm ) {
    chrome.notifications.create( '', {
        type: 'basic',
        iconUrl: '../images/done.png',
        title: 'Good Job!',
        message: 'You fulfilled your office time for today!'
    }, function(notificationId) {});
});