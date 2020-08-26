/* Exams main functions */
$(document).ready(function() {
    "use strict";

    var url = window.location.href;
    if (url.includes('/exams/')) {
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
        if ($('#middle_column > div > h1').text() != 'No exams found') {
            /* Fill year select and get date data */
            let today = new Date();
            let select_year = today.getFullYear();
            window.values = [select_year - 1, select_year, select_year + 1];
            window.selectYear = document.getElementById("year");
            selectYear.options[0] = new Option(values[0].toString(), values[0]);
            selectYear.options[1] = new Option(values[1].toString(), values[1]);
            selectYear.options[2] = new Option(values[2].toString(), values[2]);
            window.currentMonth = today.getMonth();
            window.currentYear = today.getFullYear();
            window.selectMonth = document.getElementById("month");
            window.monthAndYear = document.getElementById("monthAndYear");
            /* Gets URL month and year for updating variables */
            var obtain_url_date = getUrlDate();
            if (!obtain_url_date == "") {
                let currentYear = parseInt(obtain_url_date[0]);
                let currentMonth = parseInt(obtain_url_date[1]);
            }
            /* Create and show the data */
            showCalendar(currentMonth, currentYear, monthAndYear, selectYear, selectMonth);
            changeData(currentMonth, currentYear);
            hideUnusedData();
            /* Select and button events */
            document.getElementById("previous").addEventListener("click", function() {
                currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
                currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
                if (values.includes(currentYear)) {
                    showCalendar(currentMonth, currentYear, monthAndYear, selectYear, selectMonth);
                    changeData(currentMonth, currentYear);
                    changeCalendarURL(currentMonth, currentYear, 'exams');
                }
            });
            document.getElementById("next").addEventListener("click", function() {
                currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
                currentMonth = (currentMonth + 1) % 12;
                if (values.includes(currentYear)) {
                    showCalendar(currentMonth, currentYear, monthAndYear, selectYear, selectMonth);
                    changeData(currentMonth, currentYear);
                    changeCalendarURL(currentMonth, currentYear, 'exams');
                }
            });
            document.getElementById("month").addEventListener("change", function() {
                currentYear = parseInt(selectYear.value);
                currentMonth = parseInt(selectMonth.value);
                showCalendar(currentMonth, currentYear, monthAndYear, selectYear, selectMonth);
                changeData(currentMonth, currentYear);
                changeCalendarURL(currentMonth, currentYear, 'exams');
            });
            document.getElementById("year").addEventListener("change", function() {
                currentYear = parseInt(selectYear.value);
                currentMonth = parseInt(selectMonth.value);
                showCalendar(currentMonth, currentYear, monthAndYear, selectYear, selectMonth);
                changeData(currentMonth, currentYear);
                changeCalendarURL(currentMonth, currentYear, 'exams');
            });

            /* Click function for mantaining selected kids color */
            $('#timetables_kid_list > li > a').click(function(e) {
                e.preventDefault();
                $('#kid_list > li > a').removeClass('active');
                $(this).addClass('active');
                var kid_id = $(this).find('span').text();
                var origin_url = window.location.origin;
                window.location.replace(origin_url.concat("/exams/").concat(kid_id).concat("/calendar/").concat(currentYear.toString() + currentMonth.toString()));
            });

        } else {
            var number_kids = $('#left_column > ul > li').length;
            if (number_kids == 0) {
                $('#middle_column > div > h1').html("No kids found for this user");
            }
        }
    }
});

/* Tasks main functions */
$(document).ready(function() {
    "use strict";

    var url = window.location.href;
    if (url.includes('/tasks/')) {
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
        if ($('#middle_column > div > h1').text() != 'No tasks found') {
            /* Gets URL month and year for updating variables */
            var obtain_url_date = getUrlDate();
            if (!obtain_url_date == "") {
                var currentYear = parseInt(obtain_url_date[0]);
                var currentMonth = parseInt(obtain_url_date[1]);
            }
            changeData(currentMonth, currentYear);
            /* Date and subject filtering */
            document.getElementById("tasks_date").addEventListener("change", function() {
                $('#tasks_table').remove();
                changeData(currentMonth, currentYear);
            });
            document.getElementById("tasks_subject").addEventListener("change", function() {
                $('#tasks_table').remove();
                changeData(currentMonth, currentYear)
            });
        }
        /* Click function for mantaining selected kids color */
        $('#timetables_kid_list > li > a').click(function(e) {
            e.preventDefault();
            $('#kid_list > li > a').removeClass('active');
            $(this).addClass('active');
            var kid_id = $(this).find('span').text();
            var origin_url = window.location.origin;
            window.location.replace(origin_url.concat("/tasks/").concat(kid_id).concat("/calendar/").concat(currentYear.toString() + currentMonth.toString()));
        });

        /* Function for ordering table */
        $(document).on('click', '#tasks_table > thead > tr > th', function() {
            var table = $(this).parents('table').eq(0);
            if ($(this).index() > 0) {
                var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()));
                this.asc = !this.asc;
                if (!this.asc) {
                    rows = rows.reverse();
                }
                for (var i = 0; i < rows.length; i++) {
                    table.append(rows[i]);
                }
                setIcon($(this), this.asc);
            }
        })
    } else {
        var number_kids = $('#left_column > ul > li').length;
        if (number_kids == 0) {
            $('#middle_column > div > h1').html("No kids found for this user");
        }
    }
});

/* Function for generating filters text for tasks */
function fillTaskFilterData() {
    let selectDate = document.getElementById("tasks_date");
    let selectSubject = document.getElementById("tasks_subject");
    selectDate.options[0] = new Option("All dates", "All dates");
    selectDate.options[1] = new Option("This month", "This month");
    selectDate.options[2] = new Option("Past month", "Past month");
    selectDate.options[3] = new Option("This year", "This year");
    selectDate.selectedIndex = 0;
    var subjects = [];
    $('#tasks_table > tbody > tr').each(function() {
        var subject = $(this).find('td').eq(3).text().trim();
        if (subject) {
            subjects.push({ 'subject': subject });
        }
    });
    subjects = subjects.reduce((res, item) =>
        (!res.find(({ subject }) => subject == item.subject) ? res.push(item) : true, res), [])
    for (let i = 0; i < subjects.length; i++) {
        subjects[i]['subject'] = subjects[i]['subject'].split(']')[1].trim();
    }
    selectSubject.options[0] = new Option("All subjects", "All subjects");
    for (let i = 0; i < subjects.length; i++) {
        selectSubject.options[i + 1] = new Option(subjects[i]['subject'], subjects[i]['subject']);
    }
    selectSubject.selectedIndex = 0;
}

/* Fills calendar depending on (selected nav + kid/all kids selected) */
function changeData(currentMonth, currentYear) {
    $('#no_exam_title').remove();
    $('#no_task_title').remove();
    if (window.location.pathname.includes("exams")) {
        if (!$('#kid_list > li > a[class*="active"]').text()) {
            var exams = getExamKidData("all");
        } else {
            var exams = getExamKidData("kid");
        }
        if (exams.length > 0) {
            fillExamKiddata(exams, currentMonth, currentYear);
        } else {
            $('#div_calendar > div').css("display","none");
            let h2 = document.createElement("h2");
            h2.setAttribute('id', 'no_exam_title');
            $('#middle_column > div').append(h2);
            if ($('#left_column > ul > li').length == 0){
        		var text = document.createTextNode("No kids found for this user");
        	}else{
        		var text = document.createTextNode("No exams found");
        	}
            h2.appendChild(text);
        }
    }
    if (window.location.pathname.includes("tasks")) {
        if (!$('#kid_list > li > a[class*="active"]').text()) {
            var tasks = getTaskKidData("all");
        } else {
            var tasks = getTaskKidData("kid");
        }
        if (tasks.length > 0) {
            fillTaskData(tasks);
            if ($('#tasks_date option').length == 0 && $('#tasks_subject option').length == 0) {
                fillTaskFilterData();
            }
            var filtered_tasks = filterTaskData(tasks);
            if (tasks != filtered_tasks) {
                fillTaskData(filtered_tasks);
            }
            $('#div_tasks').css("display", "block");
            if ($('#kid_list > li > a[class*="active"]').text()) {
                $('#tasks_table > thead > tr > th:nth-child(2)').css('display', 'none');
                $('#tasks_table > tbody > tr').each(function() {
                    $(this).find('td:nth-child(2)').css('display', 'none');
                });
            }
        } else {
            $('#task_table_body > div').remove();
            let h2 = document.createElement("h2");
            h2.setAttribute('id', 'no_task_title');
            $('#middle_column > div').append(h2);
            if ($('#left_column > ul > li').length == 0){
        		var text = document.createTextNode("No kids found for this user");
        	}else{
        		var text = document.createTextNode("No tasks found");
        	}
            h2.appendChild(text);
            $('#div_tasks').css("display", "none");
        }
    }
    hideUnusedData();
}

/* Get tasks data */
function getTaskKidData(str) {
    var tasks = $('#tasks_data > div');
    var formated_tasks = [];
    if (str == "all") {
        tasks.each(function() {
            var kid = $(this).find('p').eq(0).text().trim();
            var description = $(this).find('p').eq(1).text().trim();
            var date = $(this).find('p').eq(2).text().trim();
            var subject = $(this).find('p').eq(3).text().trim();
            formated_tasks.push({
                'kid': kid,
                'description': description,
                'date': date,
                'subject': subject,
            })
        });
    } else {
        var selected_kid = $('#kid_list > li > a[class*="active"]').text().replace(window.location.pathname.split('/')[2], '').trim();
        tasks.each(function() {
            var kid = $(this).find('p').eq(0).text().trim();
            if (kid == selected_kid) {
                var description = $(this).find('p').eq(1).text().trim();
                var date = $(this).find('p').eq(2).text().trim();
                var subject = $(this).find('p').eq(3).text().trim();
                formated_tasks.push({
                    'kid': kid,
                    'description': description,
                    'date': date,
                    'subject': subject,
                })
            }
        });
    }
    return formated_tasks;
}

/* Generates task table */
function fillTaskData(tasks) {
    /* Delete existing data */
    $('#task_table_body > div').remove();
    /* Create main elements */
    var tbl_div = document.getElementById("task_table_body");
    let container = document.createElement("div");
    container.setAttribute('class', 'container');
    tbl_div.appendChild(container);
    var tbl = document.createElement("table");
    tbl.setAttribute('class', 'table table-stripped');
    tbl.setAttribute('id', 'tasks_table');
    container.appendChild(tbl);
    /* Table head */
    var tbl_head = document.createElement("thead");
    tbl.appendChild(tbl_head);
    var tbl_row = document.createElement("tr");
    tbl_head.appendChild(tbl_row);
    var tbl_head_th = document.createElement("th");
    var tbl_head_th2 = document.createElement("th");
    var tbl_head_th3 = document.createElement("th");
    var tbl_head_th4 = document.createElement("th");
    var tbl_head_th5 = document.createElement("th");
    tbl_head_th.setAttribute('scope', 'col');
    tbl_head_th.setAttribute('class', 'short-column');
    tbl_head_th2.setAttribute('scope', 'col');
    tbl_head_th2.setAttribute('class', 'long-column');
    tbl_head_th3.setAttribute('scope', 'col');
    tbl_head_th3.setAttribute('class', 'long-column');
    tbl_head_th4.setAttribute('scope', 'col');
    tbl_head_th4.setAttribute('class', 'short-column');
    tbl_head_th5.setAttribute('scope', 'col');
    tbl_head_th5.setAttribute('class', 'long-column');
    tbl_row.appendChild(tbl_head_th);
    tbl_row.appendChild(tbl_head_th2);
    tbl_row.appendChild(tbl_head_th3);
    tbl_row.appendChild(tbl_head_th4);
    tbl_row.appendChild(tbl_head_th5);
    var num_text = document.createTextNode('#');
    var kid_text = document.createTextNode('Kid');
    var homework_description_text = document.createTextNode('Homework');
    var homework_date_text = document.createTextNode('Date');
    var homework_subject_text = document.createTextNode('Subject');
    tbl_head_th.appendChild(num_text);
    tbl_head_th2.appendChild(kid_text);
    tbl_head_th3.appendChild(homework_description_text);
    tbl_head_th4.appendChild(homework_date_text);
    tbl_head_th5.appendChild(homework_subject_text);
    /* Table body */
    var tbl_body = document.createElement("tbody");
    tbl.appendChild(tbl_body);
    for (let i = 0; i < tasks.length; i++) {
        var tbl_row = document.createElement("tr");
        tbl_body.appendChild(tbl_row);
        var tbl_body_th = document.createElement("th");
        tbl_body_th.setAttribute('scope', 'row');
        var num_text = document.createTextNode(i + 1);
        tbl_body_th.appendChild(num_text);
        tbl_row.appendChild(tbl_body_th);
        var tbl_body_td = document.createElement("td");
        var kid_text = document.createTextNode(tasks[i]['kid']);
        tbl_body_td.appendChild(kid_text);
        tbl_row.appendChild(tbl_body_td);
        var tbl_body_td_2 = document.createElement("td");
        var homework_description_text = document.createTextNode(tasks[i]['description']);
        tbl_body_td_2.appendChild(homework_description_text);
        tbl_row.appendChild(tbl_body_td_2);
        var tbl_body_td_3 = document.createElement("td");
        var homework_date_text = document.createTextNode(tasks[i]['date']);
        tbl_body_td_3.appendChild(homework_date_text);
        tbl_row.appendChild(tbl_body_td_3);
        var tbl_body_td_4 = document.createElement("td");
        var homework_subject_text = document.createTextNode(tasks[i]['subject']);
        tbl_body_td_4.appendChild(homework_subject_text);
        tbl_row.appendChild(tbl_body_td_4);
    }
}

/* Generates exams data */
function fillExamKiddata(exams, currentMonth, currentYear) {
    var color_array = JSON.parse(window.localStorage.getItem("session_color_array"));
    var cells = $('#calendar-body > tr > td');
    cells.each(function() {
        $(this).find('.exam_event').remove();
        for (let i = 0; i < exams.length; i++) {
            if ((parseInt(exams[i]['date'].split('-')[1]) - 1) == parseInt(currentMonth) && parseInt(exams[i]['date'].split('-')[0]) == parseInt(currentYear)) {
                if (parseInt($(this).text()) == parseInt(exams[i]['date'].split('-')[2])) {
                    $(this).append('<div class="exam_event"><small>'
                        + exams[i]['name'].fontsize(1) + '</small><br /><small>( '
                        + exams[i]['type'].fontsize(1) + ' )</small><br /><small> '
                        + exams[i]['percent'].fontsize(1) + ' % </small><br /><small style="display: none;">'
                        + exams[i]['kid'].fontsize(1) + '</small></div>');
                }
            }
        }
    });
    var exams = $('.exam_event');
    exams.each(function() {
        for (var k = 0; k < color_array.length; k++) {
            if ($(this).find('small').eq(3).text().trim() == color_array[k]['kid'].trim()) {
                $(this).css("background-color", color_array[k]['color']);
                if (wc_hex_is_light(color_array[k]['color'])) {
                    $(this).css("color", "#6c757d");
                } else {
                    $(this).css("color", "white");
                }
                if (!$('#kid_list > li > a[class*="active"]').text()) {
                    $(this).find('small').eq(3).css('display', 'block');
                }
            }
        }
    });
}

/* Get exams data */
function getExamKidData(str) {
    var exams;
    if (str == "all") {
        exams = $('#all_kid_exams_data > div');
    } else {
        exams = $('#selected_kid_exams_data > div');
    }
    var formated_exams = [];
    exams.each(function() {
        var exam_data_id = $(this).find('p').eq(0).text().trim();
        var exam_data_name = $(this).find('p').eq(1).text().trim();
        var exam_data_type = $(this).find('p').eq(2).text().trim();
        var exam_data_percent = $(this).find('p').eq(3).text().trim();
        var exam_data_date = $(this).find('p').eq(4).text().trim();
        var exam_data_kid = $(this).find('p').eq(5).text().trim();
        formated_exams.push({
            'id': exam_data_id,
            'name': exam_data_name,
            'type': exam_data_type,
            'percent': exam_data_percent,
            'date': exam_data_date,
            'kid': exam_data_kid,
        });
    });
    if (str == "all") {
        formated_exams = formated_exams.reduce((res, item) =>
            (!res.find(({ id, kid }) => id == item.id && kid == item.kid) ? res.push(item) : true, res), [])
    } else {
        formated_exams = formated_exams.reduce((res, item) =>
            (!res.find(({ id }) => id == item.id) ? res.push(item) : true, res), [])
    }
    formated_exams.sort(function(a, b) {
        return a.kid.localeCompare(b.kid);
    });
    return formated_exams;
}
/* Returns coincident kids between kid list and another list */
function filterKidList(kid_list) {
    var kid_array = []
    var my_kid_list = $('#kid_list > li > a');
    my_kid_list.each(function() {
        var kid = $(this).text().trim();
        var number = $(this).find('span').text().trim();
        kid = kid.split("\n").join("").replace(number, "").trim();
        for (let i = 0; i < kid_list.length; i++) {
            if (kid == kid_list[i]) {
                kid_array.push(kid);
            }
        }
    });
    return kid_array;
}
/* Filters data */
function filterTaskData(tasks) {
    var task_date = $("#tasks_date > option:selected").html();
    var task_subject = $("#tasks_subject > option:selected").html();
    var task_date_formated = [];
    var task_subject_formated = [];

    let today = new Date();
    let currentMonth = today.getMonth() + 1;
    let currentYear = today.getFullYear();

    if (task_date != 'All dates') {
        for (let i = 0; i < tasks.length; i++) {
            var month = tasks[i]['date'].split('-')[1].trim();
            var year = tasks[i]['date'].split('-')[0].trim();
            if (task_date == "This month") {
                if (currentMonth == parseInt(month)) {
                    task_date_formated.push(tasks[i]);
                }
            } else if (task_date == "Past month") {
                if (currentMonth == 1) {
                    var pastMonth = 12;
                } else {
                    var pastMonth = currentMonth - 1;
                }
                if (pastMonth == parseInt(month)) {
                    task_date_formated.push(tasks[i]);
                }
            } else if (task_date == "This year") {
                if (year.toString() == currentYear.toString()) {
                    task_date_formated.push(tasks[i]);
                }
            }
        }
    } else {
        task_date_formated = tasks;
    }
    if (task_subject != 'All subjects') {
        for (let i = 0; i < task_date_formated.length; i++) {
            if (task_date_formated[i]['subject'] != "") {
                var subject = task_date_formated[i]['subject'].split("] ")[1].trim();
            } else {
                var subject = task_date_formated[i]['subject'];
            }
            if (task_subject == subject) {
                task_subject_formated.push(task_date_formated[i]);
            }
        }
    } else {
        task_subject_formated = task_date_formated;
    }
    return task_subject_formated;
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
}
