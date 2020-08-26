$(document).ready(function() {
    "use strict";

    var url = window.location.href;
    if (url.includes('/timetables/')) {
        var current_id = window.location.pathname.split('/')[2];
        if ($('#middle_column > div > h1').text() != 'No timetables found') {
            if (window.localStorage.getItem("nav_timetables") == "calendar"){
            	document.getElementById("nav_panel_calendar").style.backgroundColor = "#00A09D";
                document.getElementById("nav_icon_calendar").style.color = "white";
                document.getElementById("nav_href_calendar").style.color = "white";
                document.getElementById("div_agenda_hidden").style.display = "none";
            }else if (window.localStorage.getItem("nav_timetables") == "agenda"){
            	document.getElementById("nav_panel_agenda").style.backgroundColor = "#00A09D";
                document.getElementById("nav_icon_agenda").style.color = "white";
                document.getElementById("nav_href_agenda").style.color = "white";
                document.getElementById("div_calendar_hidden").style.display = "none";
            }
        }
        if (Number.isInteger(parseInt(current_id, 10))) {
            var b = $('span.badge');
            b.each(function() {
                var badge_value = $(this).text().trim();
                if (badge_value == current_id) {
                    var active_a = $(this).closest('a');
                    $(active_a).addClass('active');
                }
            });
        } else {
            var number_kids = $('#left_column > ul > li').length;
            if (number_kids == 0) {
                $('#middle_column > div > h1').html("No kids found for this user");
            }
        }

    }

});

$(document).ready(function() {
    "use strict";

    var url = window.location.href;
    if (url.includes('/timetables/') && $('#middle_column > div > h1').text() != 'No timetables found') {
        /* Fill year select and get date data */
        let today = new Date();
        let currentMonth = today.getMonth();
        let currentYear = today.getFullYear();
        let select_year = today.getFullYear();
        var obtain_url_date = getUrlDate();
        if (!obtain_url_date == "") {
            currentYear = parseInt(obtain_url_date[0]);
            currentMonth = parseInt(obtain_url_date[1]);
        }
        var values = [select_year - 1, select_year, select_year + 1];
        let selectYear = document.getElementById("year");
        selectYear.options[0] = new Option(values[0].toString(), values[0]);
        selectYear.options[1] = new Option(values[1].toString(), values[1]);
        selectYear.options[2] = new Option(values[2].toString(), values[2]);
        let selectMonth = document.getElementById("month");
        let monthAndYear = document.getElementById("monthAndYear");

        /* Click function for mantaining selected kids color */
        $('#timetables_kid_list > li > a').click(function(e) {
            e.preventDefault();
            $('#kid_list > li > a').removeClass('active');
            $(this).addClass('active');
            var kid_id = $(this).find('span').text();
            var origin_url = window.location.origin;
            window.location.replace(origin_url.concat("/timetables/").concat(kid_id).concat("/calendar/").concat(currentYear.toString() + currentMonth.toString()));
        });
        /* Create and show data */
        if (window.location.pathname.includes("timetables/all/")) {
            var events = getKidsEventData();
            showCalendar(currentMonth, currentYear, monthAndYear, selectYear, selectMonth);
            fillCalendar2(events, currentYear);
            showAgenda(events);
            fillAgenda2(events, currentYear);
            hideUnusedData();
        } else {
            var events = getKidsEventData();
            if (!window.localStorage.getItem("session_color_array_events")){
                window.localStorage.setItem("session_color_array_events", JSON.stringify(generateColorForEvents(events)));
            }
            showCalendar(currentMonth, currentYear, monthAndYear, selectYear, selectMonth);
            fillCalendar(events, currentYear);
            showAgenda(events);
            fillAgenda(events, currentYear);
            hideUnusedData();
        }

        /* Select and button events */
        document.getElementById("previous").addEventListener("click", function() {
            currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
            currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
            if (values.includes(currentYear)) {
                showCalendar(currentMonth, currentYear, monthAndYear, selectYear, selectMonth);
                changeCalendarURL(currentMonth, currentYear, 'calendar');
            }
        });
        document.getElementById("next").addEventListener("click", function() {
            currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
            currentMonth = (currentMonth + 1) % 12;
            if (values.includes(currentYear)) {
                showCalendar(currentMonth, currentYear, monthAndYear, selectYear, selectMonth);
                changeCalendarURL(currentMonth, currentYear, 'calendar');
            }
        });
        document.getElementById("month").addEventListener("change", function() {
            currentYear = parseInt(selectYear.value);
            currentMonth = parseInt(selectMonth.value);
            showCalendar(currentMonth, currentYear, monthAndYear, selectYear, selectMonth);
            changeCalendarURL(currentMonth, currentYear, 'calendar');
        });
        document.getElementById("year").addEventListener("change", function() {
            currentYear = parseInt(selectYear.value);
            currentMonth = parseInt(selectMonth.value);
            showCalendar(currentMonth, currentYear, monthAndYear, selectYear, selectMonth);
            changeCalendarURL(currentMonth, currentYear, 'calendar');
        });

        /* Nav tabs events */
        document.getElementById("nav_href_calendar").addEventListener("click", function() {
            /* Background */
            document.getElementById("nav_panel_calendar").style.backgroundColor = "#00A09D";
            document.getElementById("nav_panel_agenda").style.backgroundColor = "#e9ecef";
            /* Icon */
            document.getElementById("nav_icon_calendar").style.color = "white";
            document.getElementById("nav_icon_agenda").style.color = "#00A09D";
            /* Text */
            document.getElementById("nav_href_calendar").style.color = "white";
            document.getElementById("nav_href_agenda").style.color = "#00A09D";
            /* Divs */
            document.getElementById("div_calendar_hidden").style.display = "block";
            document.getElementById("div_agenda_hidden").style.display = "none";
            /* Redirection event */
            window.localStorage.setItem("nav_timetables", "calendar");
        });

        document.getElementById("nav_href_agenda").addEventListener("click", function() {
            document.getElementById("nav_panel_calendar").style.backgroundColor = "#e9ecef";
            document.getElementById("nav_panel_agenda").style.backgroundColor = "#00A09D";
            document.getElementById("nav_icon_calendar").style.color = "#00A09D";
            document.getElementById("nav_icon_agenda").style.color = "white";
            document.getElementById("nav_href_calendar").style.color = "#00A09D";
            document.getElementById("nav_href_agenda").style.color = "white";
            document.getElementById("div_calendar_hidden").style.display = "none";
            document.getElementById("div_agenda_hidden").style.display = "block";
            window.localStorage.setItem("nav_timetables", "agenda");
        });
    }

    /* Fill events for all kids in agenda */
    function fillAgenda2(events, current_year) {
        /* Fills time column */
        var hours_array = events.reduce((res, item) =>
            (!res.find(({ hour_from, hour_to }) => hour_from == item.hour_from && hour_to == item.hour_to) ? res.push(item) : true, res), [])
        hours_array.sort((a, b) => (a.hour_from > b.hour_from) ? 1 : -1);
        for (let i = 0; i < hours_array.length; i++) {
            $('#agenda-body > tr:nth-child(' + (i + 1) + ') > td:nth-child(1)').html(hours_array[i]['hour_from'] + "-" + hours_array[i]['hour_to']);
        }
        /* Create events */
        var celdas = $('#agenda-body > tr > td');
        celdas.each(function() {
            for (let i = 0; i < events.length; i++) {
                var day = getDayFormated($(this).index() - 1);
                var hour = $('#agenda-body > tr:nth-child(' + ($(this).closest('tr').index() + 1) + ') > td:nth-child(1)').text();
                if (day == events[i]['day'] && hour == (events[i]['hour_from'] + "-" + events[i]['hour_to']) && ((events[i]['academic_year'].split('-')[0].trim().includes(current_year) || events[i]['academic_year'].split('-')[1].trim().includes(current_year)))) {
                    $(this).append('<div class="timetable_event"><small>'
                        + events[i]['subject'].fontsize(1) + '</small><br /><small>'
                        + events[i]['kid'].fontsize(1) + '</small></div>');
                }
            }
        });
        /* Change style format */
        var color_array = JSON.parse(window.localStorage.getItem("session_color_array"));
        celdas.each(function() {
            var celda_event = $(this).find('.timetable_event');
            celda_event.each(function() {
                for (let j = 0; j < color_array.length; j++) {
                    if ($(this).find('small').last().text() == color_array[j]['kid']) {
                        $(this).css("background-color", color_array[j]['color']);
                        if (wc_hex_is_light(color_array[j]['color'])) {
                            $(this).css("color", "#6c757d");
                        } else {
                            $(this).css("color", "white");
                        }
                    }
                }
            });
        });
    }

    /* Fill events for all kids in calendar */
    function fillCalendar2(events, current_year) {
        events.sort((a, b) => (a.subject > b.subject) ? 1 : -1);
        var cells = $('#calendar-body > tr > td');
        cells.each(function() {
            for (let i = 0; i < events.length; i++) {
                if ($(this).text().length && (events[i]['academic_year'].split('-')[0].trim().includes(current_year) || events[i]['academic_year'].split('-')[1].trim().includes(current_year))) {
                    if (events[i]['day'] == getDayFormated($(this).index())) {
                        $(this).append('<div class="timetable_event"><small>'
                            + events[i]['hour_from'].fontsize(1) + ' - '
                            + events[i]['hour_to'].fontsize(1) + '</small><br /><small>'
                            + events[i]['subject'].fontsize(1) + '</small><br /><small> '
                            + events[i]['kid'].fontsize(1) + '</small></div>');
                    }
                }
            }
        });
        var colors_kids = JSON.parse(window.localStorage.getItem("session_color_array"));
        for (let k = 0; k < colors_kids.length; k++) {
            var events = $('.timetable_event');
            events.each(function() {
                if ($(this).find('small').last().text().trim() == colors_kids[k]['kid']) {
                    $(this).css("background-color", colors_kids[k]['color']);
                    if (wc_hex_is_light(colors_kids[k]['color'])) {
                        $(this).css("color", "#6c757d");
                    } else {
                        $(this).css("color", "white");
                    }
                }
            });
        }
    }

    /* Fill events for selected kid in agenda */
    function fillAgenda(events, current_year) {
        var hours_array = events.reduce((res, item) =>
            (!res.find(({ hour_from, hour_to }) => hour_from == item.hour_from && hour_to == item.hour_to) ? res.push(item) : true, res), [])
        for (let i = 0; i < hours_array.length; i++) {
            $('#agenda-body > tr:nth-child(' + (i + 1) + ') > td:nth-child(1)').html(hours_array[i]['hour_from'] + "-" + hours_array[i]['hour_to']);
        }
        var celdas = $('#agenda-body > tr > td');
        for (let i = 0; i < events.length; i++) {
            celdas.each(function() {
                if (((events[i]['academic_year'].split('-')[0].trim().includes(current_year) || events[i]['academic_year'].split('-')[1].trim().includes(current_year)))) {
                    var day = getDayFormated($(this).index() - 1);
                    var hour = $('#agenda-body > tr:nth-child(' + ($(this).closest('tr').index() + 1) + ') > td:nth-child(1)').text();
                    if (day == events[i]['day'] && hour == (events[i]['hour_from'] + "-" + events[i]['hour_to'])) {
                        $(this).append('<div class="timetable_event"><small>'
                            + events[i]['subject'].fontsize(1) + '</small></div>');
                    }
                }
            });
        }
        var events = events.reduce((res, item) =>
            (!res.find(({ hour_from, hour_to, subject }) => hour_from == item.hour_from && hour_to == item.hour_to && subject == item.subject) ? res.push(item) : true, res), [])
        events.sort((a, b) => (a.subject > b.subject) ? 1 : -1);
        var color_for_events = generateColorForEvents(events);
        if (!window.localStorage.getItem("session_color_array_events")){
            window.localStorage.setItem("session_color_array_events", JSON.stringify(generateColorForEvents(events)));
        }
       var color_for_events = JSON.parse(window.localStorage.getItem("session_color_array_events"));
        celdas.each(function() {
            var celda_event = $(this).find('.timetable_event');
            celda_event.each(function() {
                for (let j = 0; j < color_for_events.length; j++) {
                    if ($(this).find('small').text() == color_for_events[j]['event']) {
                        $(this).css("background-color", color_for_events[j]['color']);
                        if (wc_hex_is_light(color_for_events[j]['color'])) {
                            $(this).css("color", "#6c757d");
                        } else {
                            $(this).css("color", "white");
                        }
                    }
                }
            });
        });
    }

    /* Fill events for selected kid in calendar */
    function fillCalendar(events, current_year) {
        var color_for_events = JSON.parse(window.localStorage.getItem("session_color_array_events"));
        var celdas = $('#calendar-body > tr > td');
        for (let i = 0; i < events.length; i++) {
            var kid = $('#kid_list > li > a[class*="active"]').text().replace(window.location.pathname.split('/')[2], '').trim();
            if (kid == events[i]['kid'] && (events[i]['academic_year'].split('-')[0].trim().includes(current_year) || events[i]['academic_year'].split('-')[1].trim().includes(current_year))) {
                celdas.each(function() {
                    if ($(this).text().trim().length && getDayFormated($(this).index()) == events[i]['day']) {
                        $(this).append('<div class="timetable_event"><small>'
                            + events[i]['hour_from'].fontsize(1) + ' - '
                            + events[i]['hour_to'].fontsize(1) + '</small><br /><small> '
                            + events[i]['subject'].fontsize(1) + '</small></div>');
                    }
                });
            }
        }
        var events = $('.timetable_event');
        events.each(function() {
            for (var k = 0; k < color_for_events.length; k++) {
                if ($(this).find('small').last().text().trim() == color_for_events[k]['event'].trim()) {
                    $(this).css("background-color", color_for_events[k]['color']);
                    if (wc_hex_is_light(color_for_events[k]['color'])) {
                        $(this).css("color", "#6c757d");
                    } else {
                        $(this).css("color", "white");
                    }
                }
            }
        });
    }


    /* Creates agenda structure */
    function showAgenda(events) {
        var hours_array = events.reduce((res, item) =>
            (!res.find(({ hour_from, hour_to }) => hour_from == item.hour_from && hour_to == item.hour_to) ? res.push(item) : true, res), [])
        monthAndYear2.innerHTML = $('#monthAndYear').text();
        let tbl = document.getElementById("agenda-body");
        for (let i = 0; i < hours_array.length; i++) {
            let row = document.createElement("tr");
            for (let j = 0; j < 8; j++) {
                let cell = document.createElement("td");
                let cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
            tbl.appendChild(row);
        }
    }

    /* Gets all kid events */
    function getKidsEventData() {
        var events = $('#datos_ocultos > ul > li');
        var hours_array = [];
        events.each(function() {
            var year = $(this).find('p').eq(0).text().trim();
            var subject = $(this).find('p').eq(1).text().trim();
            var code = $(this).find('p').eq(2).text().trim();
            var kid = $(this).find('p').eq(3).text().trim();
            var day = $(this).find('p').eq(4).text().trim();
            var hour_from = $(this).find('p').eq(5).text().trim();
            var hour_to = $(this).find('p').eq(6).text().trim();
            if (day && hour_from && hour_to) {
                hours_array.push({
                    academic_year: year,
                    subject: subject.replace(code, '').replace(']', '').replace('[', '').trim(),
                    day: getDayFormated(day),
                    hour_from: getHourFormated(hour_from),
                    hour_to: getHourFormated(hour_to),
                    kid: kid
                });
            }
        });
        /* Sort events by time */
        hours_array.sort(function(a, b) {
            return a.hour_from.localeCompare(b.hour_from);
        });
        hours_array.sort(function(a, b) {
            if (a.hour_from == b.hour_from) {
                return a.hour_to.localeCompare(b.hour_to);
            }
        });
        /* Delete repeated elements */
        hours_array = hours_array.reduce((res, item) =>
            (!res.find(({ hour_from, hour_to, day, subject, kid, academic_year }) => hour_from == item.hour_from && hour_to == item.hour_to && day == item.day && subject == item.subject && kid == item.kid && academic_year == item.academic_year) ? res.push(item) : true, res), [])
        return hours_array;
    }

    /* Generates color for each event */
    function generateColorForEvents(events) {
        var color_array = []
        var eventos = events.reduce((res, item) =>
            (!res.find(({ subject }) => subject == item.subject) ? res.push(item) : true, res), [])
        for (let i = 0; i < eventos.length; i++) {
            color_array.push({
                color: getRandomColor(),
                event: eventos[i]['subject'],
            });
        }
        return color_array;
    }

    /* Returns string depending on parameter number */
    function getDayFormated(week_day_text) {
        switch (parseInt(week_day_text)) {
            case 0:
                var day = "Mon";
                break;
            case 1:
                var day = "Tue";
                break;
            case 2:
                var day = "Wed";
                break;
            case 3:
                var day = "Thu";
                break;
            case 4:
                var day = "Fri";
                break;
            case 5:
                var day = "Sat";
                break;
            case 6:
                var day = "Sun";
                break;
        }
        return day;
    }
    
    // Hides unused table columns
    function hideUnusedData(){
    		$("#calendar > thead > tr > th:nth-child(6)").css("display", "none");
    		$("#calendar > thead > tr > th:nth-child(7)").css("display", "none");
    		$("#calendar > tbody > tr ").each(function() {
    			$(this).find("td").eq(5).css("display", "none");
    			$(this).find("td").eq(6).css("display", "none");
    		});
    		$("#calendar > tbody > tr ").each(function() {
    			var b = "False";
    			$(this).find("td").each(function() {
    				if($(this).index() != 5 && $(this).index() != 6 && $(this).text() != ""){
    					b = "True";
    				}
    			});
    			if (b == "False"){
    				$(this).css("display","none");
    			}
    		});	
    		$("#agenda > thead > tr > th:nth-child(7)").css("display", "none");
    		$("#agenda > thead > tr > th:nth-child(8)").css("display", "none");
    		$("#agenda > tbody > tr ").each(function() {
    			$(this).find("td").eq(6).css("display", "none");
    			$(this).find("td").eq(7).css("display", "none");
    		});  		
    }
});
