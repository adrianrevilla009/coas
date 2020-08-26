$(document).ready(function() {
    "use strict";

    var url = window.location.href;
    if (url.includes('/meetings/')) {
        var current_id = window.location.pathname.split('/')[2];
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
        if ($('#middle_column > div > h1').text() != 'No meetings found') {
            /* Fill year select and get date data */
            let today = new Date();
            let select_year = today.getFullYear();
            let values = [select_year - 1, select_year, select_year + 1];
            let selectYear = document.getElementById("year");
            selectYear.options[0] = new Option(values[0].toString(), values[0]);
            selectYear.options[1] = new Option(values[1].toString(), values[1]);
            selectYear.options[2] = new Option(values[2].toString(), values[2]);
            let currentMonth = today.getMonth();
            let currentYear = today.getFullYear();
            let selectMonth = document.getElementById("month");
            let monthAndYear = document.getElementById("monthAndYear");
            /* Get events data and show it */
            var events = getEventData();
            if (events.length > 0) {
                showCalendar(currentMonth, currentYear, monthAndYear, selectYear, selectMonth);
                fillEventData(events, currentMonth, currentYear);
            }
            /* Select and button events */
            document.getElementById("previous").addEventListener("click", function() {
                currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
                currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
                if (values.includes(currentYear)) {
                    showCalendar(currentMonth, currentYear, monthAndYear, selectYear, selectMonth);
                    fillEventData(events, currentMonth, currentYear);
                    changeCalendarURL(currentMonth, currentYear, 'events');
                }
            });
            document.getElementById("next").addEventListener("click", function() {
                currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
                currentMonth = (currentMonth + 1) % 12;
                if (values.includes(currentYear)) {
                    showCalendar(currentMonth, currentYear, monthAndYear, selectYear, selectMonth);
                    fillEventData(events, currentMonth, currentYear);
                    changeCalendarURL(currentMonth, currentYear, 'events');
                }
            });
            document.getElementById("month").addEventListener("change", function() {
                currentYear = parseInt(selectYear.value);
                currentMonth = parseInt(selectMonth.value);
                showCalendar(currentMonth, currentYear, monthAndYear, selectYear, selectMonth);
                fillEventData(events, currentMonth, currentYear);
                changeCalendarURL(currentMonth, currentYear, 'events');
            });
            document.getElementById("year").addEventListener("change", function() {
                currentYear = parseInt(selectYear.value);
                currentMonth = parseInt(selectMonth.value);
                showCalendar(currentMonth, currentYear, monthAndYear, selectYear, selectMonth);
                fillEventData(events, currentMonth, currentYear);
                changeCalendarURL(currentMonth, currentYear, 'events');
            });
            /* Gets URL month and year for updating variables */
            var obtain_url_date = getUrlDate();
            if (!obtain_url_date == "") {
                currentYear = parseInt(obtain_url_date[0]);
                currentMonth = parseInt(obtain_url_date[1]);
            }
        }

    } else {
        var number_kids = $('#left_column > ul > li').length;
        if (number_kids == 0) {
            $('#middle_column > div > h1').html("No kids found for this user");
        }
    }
});


/* Get all event data */
function getEventData() {
    var event_ids = $('#student_calendar_events > ul > li');
    var events = [];
    event_ids.each(function() {
        events.push({
            'kid': $(this).find('p').eq(0).text().trim(),
            'teacher': $(this).find('p').eq(1).text().trim(),
            'category': $(this).find('p').eq(2).text().trim(),
            'start_time': $(this).find('p').eq(3).text().trim(),
            'stop_time': $(this).find('p').eq(4).text().trim(),
            'state': $(this).find('p').eq(5).text().trim(),
            'id': $(this).find('p').eq(6).text().trim(),
        })
    });
    return events;
}

/* Generates calendar data for events */
function fillEventData(events, currentMonth, currentYear) {
    var color_array = JSON.parse(window.localStorage.getItem("session_color_array"));
    var cells = $('#calendar-body > tr > td');
    cells.each(function() {
        $(this).find('.event_data').remove();
        for (let i = 0; i < events.length; i++) {
            if ((parseInt(events[i]['start_time'].split(' ')[0].trim().split('-')[1]) - 1) == parseInt(currentMonth) && parseInt(events[i]['start_time'].split(' ')[0].trim().split('-')[0]) == parseInt(currentYear)) {
                if (parseInt($(this).text()) == parseInt(events[i]['start_time'].split(' ')[0].trim().split('-')[2])) {
                    $(this).append('<div class="event_data"><small>'
                        + events[i]['category'].fontsize(1) + '</small><br /><small>'
                        + events[i]['teacher'].fontsize(1) + '</small><br /><small> '
                        + (events[i]['start_time'].split(':')[0] + ":" + events[i]['start_time'].split(':')[1]).fontsize(1) + '</small><br /><small style="display: none;">'
                        + events[i]['kid'].fontsize(1) + '</small><small style="display:none;">'
                        + events[i]['id'].fontsize(1) + '</small><small style="display:none;">'
                        + events[i]['state'].fontsize(1) + '</small><button onclick="accept_meeting(' + events[i]['id'] + ')">Accept</button><button onclick="change_meeting(' + events[i]['id'] + ')">Change date</button></div>');
                }
            }

        }
    });
    var events = $('.event_data');
    events.each(function() {
        for (var k = 0; k < color_array.length; k++) {
            if ($(this).find('small').eq(3).text().trim() == color_array[k]['kid'].trim()) {
                $(this).css("background-color", color_array[k]['color']);
                if (wc_hex_is_light(color_array[k]['color'])) {
                    $(this).css("color", "#6c757d");
                } else {
                    $(this).css("color", "white");
                }
                if (window.location.pathname.includes("meetings/all/")) {
                    $(this).find('small').eq(3).css('display', 'block');
                }
            }
        }
    });
    events.each(function() {
        if ($(this).find('small').eq(5).find('font').text() != 'draft') {
            $(this).find('button').eq(0).css('display', 'none');
            $(this).find('small').eq(5).css('display', 'block');
            $(this).find('small').eq(5).find('font').text('---- CONFIRMED ----');
        }
    })
}

/* Changes accept meeting box redirection URL */
$(document).ready(function() {
    "use strict";

      var url = window.location.href;
      if (url.includes('/meetings_accept/') || url.includes('/meetings_change/')) {
        var kid = window.location.pathname.split("/")[2];
        let today = new Date();
        let currentMonth = today.getMonth();
        let currentYear = today.getFullYear();
        window.location.replace("/meetings/".concat(kid).concat("/calendar/").concat(currentYear).concat(currentMonth));
    }
});

/* Generates meeting accept box */
function accept_meeting(event_id) {
    swal({
        title: "Are you sure?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                swal("Meeting accepted!", {
                    icon: "success",
                    button: false,
                });
                if ($('#kid_list > li > a[class*="active"]').text()) {
                    var kid_id = $('#kid_list > li > a[class*="active"]').find('span').text().trim();
                    window.location.replace(window.location.origin.concat("/meetings_accept/").concat(kid_id).concat("/").concat(event_id));
                } else {
                    window.location.replace(window.location.origin.concat("/meetings_accept/all/").concat(event_id));
                }
            } else {
                swal({
                    title: "Do it another time!",
                    confirm: true,
                    dangerMode: true,
                });
            }
        });
}

/* Changes meeting data accept box */
function change_meeting(event_id) {
    $('#event_change_data > p:nth-child(1)').empty();
    $('#event_change_data > p:nth-child(2)').empty();
    swal({
        title: "Change meeting date!",
        confirm: true,
        dangerMode: true,
    })
        .then(function() {
            swal({
                content: "input",
                title: "Insert date",
                text: "Day / Month / Year (dd/mm/yyyy)",
                confirm: true,
                dangerMode: true,
            })
                .then(function(value) {
                    $('#event_change_data > p:nth-child(1)').text(value);
                    swal({
                        content: "input",
                        title: "Insert hour",
                        text: "Hour : Minutes (hh:mm)",
                        confirm: true,
                        dangerMode: true,
                    })
                        .then(function(value) {
                            $('#event_change_data > p:nth-child(2)').text(value);
                        })
                        .then(() => {
                            var date = $('#event_change_data > p:nth-child(1)').text();
                            var hour = $('#event_change_data > p:nth-child(2)').text();
                            var str = validateData(date, hour);
                            if (typeof (str) == "string") {
                                swal({
                                    title: str,
                                    icon: "warning",
                                    dangerMode: true,
                                })
                            } else {
                                swal({
                                    title: "Date changed correctly!",
                                    icon: "success",
                                    button: false,
                                }).then(() => {
                                    if ($('#kid_list > li > a[class*="active"]').text()) {
                                        var kid_id = $('#kid_list > li > a[class*="active"]').find('span').text().trim();
                                        window.location.replace(window.location.origin.concat("/meetings_change/").concat(kid_id).concat("/").concat(event_id).concat('/').concat(str[0]).concat("/").concat(str[1]));
                                    } else {
                                        window.location.replace(window.location.origin.concat("/meetings_change/all/").concat(event_id).concat('/').concat(str[0]).concat("/").concat(str[1]));
                                    }
                                })
                            }
                        });
                });
        });
}

/* Validates date format */
function validateData(date, hour) {
    if (date == "" || hour == "") {
        return "Error: No empty fields!";
    }
    var date_slices = date.split('/');
    var hour_slices = hour.split(':');
    if (date_slices.length != 3) {
        return "Error: Date has to be / format!";
    }
    if (hour_slices.length != 2) {
        return "Error: Hour has to be : format!";
    }
    if (!(date_slices[0].length == 2 || date_slices[0].length == 1) || !(date_slices[1].length == 2 || date_slices[1].length == 1) || date_slices[2].length != 4) {
        return "Error: Date has to be dd/mm/yyyy format!";
    }
    if (hour_slices[0].length != 2 || hour_slices[1].length != 2) {
        return "Error: Hour has to be hh:mm format!";
    }
    try {
        if (date_slices[0].length == 2 && date_slices[0][0] == "0") {
            date_slices[0] = date_slices[0][1];
        }
        if (date_slices[1].length == 2 && date_slices[1][0] == "0") {
            date_slices[1] = date_slices[1][1];
        }
        var year = parseInt(date_slices[2]);
        var month = parseInt(date_slices[1]) - 1;
        var day = parseInt(date_slices[0]);
        if (!(month >= 0 && month < 12 && day > 0 && day <= daysInMonth(month, year))) {
            return "Error: No valid date!";
        }
    } catch (error) {
        return "Error: No valid date!";
    }
    try {
        var hour_ = parseInt(hour_slices[0]);
        var min = parseInt(hour_slices[1]);
        if (!(hour_ >= 0 && hour_ <= 23 && min >= 0 && min <= 59)) {
            return "Error: No valid hour!";
        }

    } catch (error) {
        return "Error: No valid hour!";
    }
    return [date_slices[2].concat("_").concat(date_slices[1]).concat("_").concat(date_slices[0]), hour_slices[0].concat('_').concat(hour_slices[1])];
}

/* Checks if a day exists in a month */
var daysInMonth = function(m, y) {
    switch (m) {
        case 1:
            return (y % 4 == 0 && y % 100) || y % 400 == 0 ? 29 : 28;
        case 8: case 3: case 5: case 10:
            return 30;
        default:
            return 31
    }
};
