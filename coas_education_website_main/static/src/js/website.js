$(document).ready(function() {
    "use strict";

    var url = window.location.href;
    if (url.includes('/main')) {
        /* Checks when is only unique and none kid */
        if ($('#kid_list > li').length == 1 && window.localStorage.getItem("active_kid") == 'all') {
            window.localStorage.removeItem("active_kid")
            $('#kid_list > li > a').eq(0).addClass('active');
            $('#kid_list > li > a')[0].click();
        } else if ($('#kid_list > li').length == 0) {
            $('#middle_column > div > h1').html("No kids found for this user");
        }
        /* Checks when a kid is selected */
        if (url.includes('/main/')) {
            var current_id = window.location.pathname.replace('/main/', '');
            if (Number.isInteger(parseInt(current_id, 10))) {
                var b = $('span.badge');
                b.each(function() {
                    var badge_value = $(this).text().trim();
                    if (badge_value == current_id) {
                        var active_a = $(this).closest('a');
                        $(active_a).addClass('active');
                    }
                });
            }
        }
    
    /* Set's some storage variables */
    if (!window.localStorage.getItem("nav_timetables")) {
        window.localStorage.setItem("nav_timetables", "calendar");
    }
    if (!window.localStorage.getItem("session_color_array")) {
        window.localStorage.setItem("session_color_array", JSON.stringify(generateColorsForKidList()))
    }
    if (!window.localStorage.getItem("kid_array")) {
        window.localStorage.setItem("kid_array", JSON.stringify(getKidList()))
    }
    if ($('#kid_list > li > a[class*="active"]').text()) {
        var kid_id = $('#kid_list > li > a[class*="active"]').find('span').text().trim();
        window.localStorage.setItem("active_kid", kid_id);
    } else {
        window.localStorage.setItem("active_kid", "all");
    }
    window.localStorage.removeItem("event_numbers_array");
    }
});

/* Get users kids */
function getKidList() {
    var kid_ids = [];
    $('#kid_list > li > a > span').each(function() {
        kid_ids.push($(this).text().trim())
    });
    return kid_ids;
}
