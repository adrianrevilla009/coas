/* When page is loaded the selected kid is marked */
$(document).ready(function() {
    "use strict";
    
    var url = window.location.href;
    if (url.includes('/califications/')) {
        var current_id = window.location.pathname.replace('/califications/', '');
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
        var number_kids = $('#left_column > ul > li').length;
        if (number_kids == 0) {
            $('#middle_column > div > h1').html("No kids found for this user");
        }

    }
});

/*
 * When a kid is selected in the list, it makes the redirection to the
 * corresponding page
 */
$(document).ready(function() {
    "use strict";

    var url = window.location.href;
    if (url.includes('/califications/')) {
        if ($('#middle_column > div > h1').text() != 'No califications found') {
            document.getElementById("nav_panel_all_califications").style.display = "none";
            document.getElementById("all_marks_button").style.display = "none";
            $("#evaluation_marks_button").css("background-color", "#e9ecef");
            $("#competence_marks_button").css("background-color", "#e9ecef");
            $("#exam_marks_button").css("background-color", "#e9ecef");
            $("#evaluation_marks_button").css("border-color", "#e9ecef");
            $("#competence_marks_button").css("border-color", "#e9ecef");
            $("#exam_marks_button").css("border-color", "#e9ecef");
            $("#evaluation_marks_button").css("color", "#00A09D");
            $("#competence_marks_button").css("color", "#00A09D");
            $("#exam_marks_button").css("color", "#00A09D");
            /* Get and fill the data */
            var califications = getCalificationsData();
            createCalificationsTable(califications);
            fillSubjectData();
            /* Nav tabs events */
            document.getElementById("nav_href_1eval").addEventListener("click", function() {
                /* Background */
                document.getElementById("nav_panel_1eval").style.backgroundColor = "#00A09D";
                document.getElementById("nav_panel_2eval").style.backgroundColor = "#e9ecef";
                document.getElementById("nav_panel_3eval").style.backgroundColor = "#e9ecef";
                document.getElementById("nav_panel_global").style.backgroundColor = "#e9ecef";
                document.getElementById("nav_panel_all_califications").style.backgroundColor = "#e9ecef";
                /* Icon */
                document.getElementById("nav_icon_1eval").style.color = "white";
                document.getElementById("nav_icon_2eval").style.color = "#00A09D";
                document.getElementById("nav_icon_3eval").style.color = "#00A09D";
                document.getElementById("nav_icon_global").style.color = "#00A09D";
                document.getElementById("nav_icon_all_califications").style.color = "#00A09D";
                /* Text */
                document.getElementById("nav_href_1eval").style.color = "white";
                document.getElementById("nav_href_2eval").style.color = "#00A09D";
                document.getElementById("nav_href_3eval").style.color = "#00A09D";
                document.getElementById("nav_href_global").style.color = "#00A09D";
                document.getElementById("nav_href_all_califications").style.color = "#00A09D";
                /* Buttons */
                resetButtons();
                /* Change filters */
                changeFilterBar();
                document.getElementById("califications_subject").selectedIndex = 0;
                var califications = getCalificationsData();
                var params = getParameters();
                filterCalificationsData(califications, params[0], params[1], params[2]);
            });
            document.getElementById("nav_href_2eval").addEventListener("click", function() {
                document.getElementById("nav_panel_2eval").style.backgroundColor = "#00A09D";
                document.getElementById("nav_panel_1eval").style.backgroundColor = "#e9ecef";
                document.getElementById("nav_panel_3eval").style.backgroundColor = "#e9ecef";
                document.getElementById("nav_panel_global").style.backgroundColor = "#e9ecef";
                document.getElementById("nav_panel_all_califications").style.backgroundColor = "#e9ecef";
                document.getElementById("nav_icon_2eval").style.color = "white";
                document.getElementById("nav_icon_1eval").style.color = "#00A09D";
                document.getElementById("nav_icon_3eval").style.color = "#00A09D";
                document.getElementById("nav_icon_global").style.color = "#00A09D";
                document.getElementById("nav_icon_all_califications").style.color = "#00A09D";
                document.getElementById("nav_href_2eval").style.color = "white";
                document.getElementById("nav_href_1eval").style.color = "#00A09D";
                document.getElementById("nav_href_3eval").style.color = "#00A09D";
                document.getElementById("nav_href_global").style.color = "#00A09D";
                document.getElementById("nav_href_all_califications").style.color = "#00A09D";
                resetButtons();
                changeFilterBar();
                document.getElementById("califications_subject").selectedIndex = 0;
                var califications = getCalificationsData();
                var params = getParameters();
                filterCalificationsData(califications, params[0], params[1], params[2]);
            });
            document.getElementById("nav_href_3eval").addEventListener("click", function() {
                document.getElementById("nav_panel_3eval").style.backgroundColor = "#00A09D";
                document.getElementById("nav_panel_2eval").style.backgroundColor = "#e9ecef";
                document.getElementById("nav_panel_1eval").style.backgroundColor = "#e9ecef";
                document.getElementById("nav_panel_global").style.backgroundColor = "#e9ecef";
                document.getElementById("nav_panel_all_califications").style.backgroundColor = "#e9ecef";
                document.getElementById("nav_icon_3eval").style.color = "white";
                document.getElementById("nav_icon_2eval").style.color = "#00A09D";
                document.getElementById("nav_icon_1eval").style.color = "#00A09D";
                document.getElementById("nav_icon_global").style.color = "#00A09D";
                document.getElementById("nav_icon_all_califications").style.color = "#00A09D";
                document.getElementById("nav_href_3eval").style.color = "white";
                document.getElementById("nav_href_2eval").style.color = "#00A09D";
                document.getElementById("nav_href_1eval").style.color = "#00A09D";
                document.getElementById("nav_href_global").style.color = "#00A09D";
                document.getElementById("nav_href_all_califications").style.color = "#00A09D";
                resetButtons();
                changeFilterBar();
                document.getElementById("califications_subject").selectedIndex = 0;
                var califications = getCalificationsData();
                var params = getParameters();
                filterCalificationsData(califications, params[0], params[1], params[2]);
            });
            document.getElementById("nav_href_global").addEventListener("click", function() {
                document.getElementById("nav_panel_global").style.backgroundColor = "#00A09D";
                document.getElementById("nav_panel_2eval").style.backgroundColor = "#e9ecef";
                document.getElementById("nav_panel_3eval").style.backgroundColor = "#e9ecef";
                document.getElementById("nav_panel_1eval").style.backgroundColor = "#e9ecef";
                document.getElementById("nav_panel_all_califications").style.backgroundColor = "#e9ecef";
                document.getElementById("nav_icon_global").style.color = "white";
                document.getElementById("nav_icon_2eval").style.color = "#00A09D";
                document.getElementById("nav_icon_3eval").style.color = "#00A09D";
                document.getElementById("nav_icon_1eval").style.color = "#00A09D";
                document.getElementById("nav_icon_all_califications").style.color = "#00A09D";
                document.getElementById("nav_href_global").style.color = "white";
                document.getElementById("nav_href_2eval").style.color = "#00A09D";
                document.getElementById("nav_href_3eval").style.color = "#00A09D";
                document.getElementById("nav_href_1eval").style.color = "#00A09D";
                document.getElementById("nav_href_all_califications").style.color = "#00A09D";
                resetButtons();
                changeFilterBar();
                document.getElementById("califications_subject").selectedIndex = 0;
                var califications = getCalificationsData();
                var params = getParameters();
                filterCalificationsData(califications, params[0], params[1], params[2]);
            });
            document.getElementById("nav_href_all_califications").addEventListener("click", function() {
                document.getElementById("nav_panel_all_califications").style.backgroundColor = "#00A09D";
                document.getElementById("nav_panel_2eval").style.backgroundColor = "#e9ecef";
                document.getElementById("nav_panel_3eval").style.backgroundColor = "#e9ecef";
                document.getElementById("nav_panel_1eval").style.backgroundColor = "#e9ecef";
                document.getElementById("nav_panel_global").style.backgroundColor = "#e9ecef";
                document.getElementById("nav_icon_all_califications").style.color = "white";
                document.getElementById("nav_icon_2eval").style.color = "#00A09D";
                document.getElementById("nav_icon_3eval").style.color = "#00A09D";
                document.getElementById("nav_icon_1eval").style.color = "#00A09D";
                document.getElementById("nav_icon_global").style.color = "#00A09D";
                document.getElementById("nav_href_all_califications").style.color = "white";
                document.getElementById("nav_href_2eval").style.color = "#00A09D";
                document.getElementById("nav_href_3eval").style.color = "#00A09D";
                document.getElementById("nav_href_1eval").style.color = "#00A09D";
                document.getElementById("nav_href_global").style.color = "#00A09D";
                resetButtons();
                changeFilterBar();
                document.getElementById("califications_subject").selectedIndex = 0;
                var califications = getCalificationsData();
                var params = getParameters();
                filterCalificationsData(califications, params[0], params[1], params[2]);
            });
            /* Subject filtering */
            document.getElementById("califications_subject").addEventListener("change", function() {
                var califications = getCalificationsData();
                var params = getParameters();
                filterCalificationsData(califications, params[0], params[1], params[2]);
                
            });
            /* Button redirection */
            $(document).on('click', '#evaluation_marks_button', function() {
                var califications = getCalificationsData();
                var params = getParameters("evaluation");
                filterCalificationsData(califications, params[0], params[1], params[2]);
                document.getElementById("all_marks_button").style.display = "block";
                $("#evaluation_marks_button").css("background-color", "#00A09D");
                $("#competence_marks_button").css("background-color", "#e9ecef");
                $("#exam_marks_button").css("background-color", "#e9ecef");
                $("#all_marks_button").css("background-color", "#e9ecef");
                $("#evaluation_marks_button").css("border-color", "#00A09D");
                $("#competence_marks_button").css("border-color", "#e9ecef");
                $("#exam_marks_button").css("border-color", "#e9ecef");
                $("#all_marks_button").css("border-color", "#e9ecef");
                $("#evaluation_marks_button").css("color", "white");
                $("#competence_marks_button").css("color", "#00A09D");
                $("#exam_marks_button").css("color", "#00A09D");
                $("#all_marks_button").css("color", "#00A09D");
                if ($('#all_marks_button').css("display") == "block") {
                    $('#califications_subject').css("margin-left", "5%");
                }
            });

            $(document).on('click', '#competence_marks_button', function() {
                var califications = getCalificationsData();
                var params = getParameters("competence");
                filterCalificationsData(califications, params[0], params[1], params[2]);
                document.getElementById("all_marks_button").style.display = "block";
                $("#evaluation_marks_button").css("background-color", "#e9ecef");
                $("#competence_marks_button").css("background-color", "#00A09D");
                $("#exam_marks_button").css("background-color", "#e9ecef");
                $("#all_marks_button").css("background-color", "#e9ecef");
                $("#evaluation_marks_button").css("border-color", "#e9ecef");
                $("#competence_marks_button").css("border-color", "#00A09D");
                $("#exam_marks_button").css("border-color", "#e9ecef");
                $("#all_marks_button").css("border-color", "#e9ecef");
                $("#evaluation_marks_button").css("color", "#00A09D");
                $("#competence_marks_button").css("color", "white");
                $("#exam_marks_button").css("color", "#00A09D");
                $("#all_marks_button").css("color", "#00A09D");
                if ($('#all_marks_button').css("display") == "block") {
                    $('#califications_subject').css("margin-left", "5%");
                }
            });

            $(document).on('click', '#exam_marks_button', function() {
                var califications = getCalificationsData();
                var params = getParameters("exam");
                filterCalificationsData(califications, params[0], params[1], params[2]);
                document.getElementById("all_marks_button").style.display = "block";
                $("#evaluation_marks_button").css("background-color", "#e9ecef");
                $("#competence_marks_button").css("background-color", "#e9ecef");
                $("#exam_marks_button").css("background-color", "#00A09D");
                $("#all_marks_button").css("background-color", "#e9ecef");
                $("#evaluation_marks_button").css("border-color", "#e9ecef");
                $("#competence_marks_button").css("border-color", "#e9ecef");
                $("#exam_marks_button").css("border-color", "#00A09D");
                $("#all_marks_button").css("border-color", "#e9ecef");
                $("#evaluation_marks_button").css("color", "#00A09D");
                $("#competence_marks_button").css("color", "#00A09D");
                $("#exam_marks_button").css("color", "white");
                $("#all_marks_button").css("color", "#00A09D");
                if ($('#all_marks_button').css("display") == "block") {
                    $('#califications_subject').css("margin-left", "5%");
                }
            });

            $(document).on('click', '#all_marks_button', function() {
                var califications = getCalificationsData();
                var params = getParameters("all");
                filterCalificationsData(califications, params[0], params[1], params[2]);
                $("#evaluation_marks_button").css("background-color", "#e9ecef");
                $("#competence_marks_button").css("background-color", "#e9ecef");
                $("#exam_marks_button").css("background-color", "#e9ecef");
                $("#all_marks_button").css("background-color", "#00A09D");
                $("#evaluation_marks_button").css("border-color", "#e9ecef");
                $("#competence_marks_button").css("border-color", "#e9ecef");
                $("#exam_marks_button").css("border-color", "#e9ecef");
                $("#all_marks_button").css("border-color", "#00A09D");
                $("#evaluation_marks_button").css("color", "#00A09D");
                $("#competence_marks_button").css("color", "#00A09D");
                $("#exam_marks_button").css("color", "#00A09D");
                $("#all_marks_button").css("color", "white");
            });

        }
    }
    /* Function for ordering the table */
    $('#califications_table > thead > tr > th').click(function() {
        var table = $(this).parents('table').eq(0);
        var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()));
        this.asc = !this.asc;
        if (!this.asc) {
            rows = rows.reverse();
        }
        for (var i = 0; i < rows.length; i++) {
            table.append(rows[i]);
        }
        setIcon($(this), this.asc);
    })

});

/* FUnction for changing filter bar appearence */
function changeFilterBar() {
    $('#nav_panel_1eval').removeClass("col-md-3");
    $('#nav_panel_2eval').removeClass("col-md-3");
    $('#nav_panel_3eval').removeClass("col-md-3");
    $('#nav_panel_global').removeClass("col-md-3");
    $('#nav_panel_1eval').addClass("col-md-2");
    $('#nav_panel_2eval').addClass("col-md-2");
    $('#nav_panel_3eval').addClass("col-md-2");
    $('#nav_panel_global').addClass("col-md-2");
    document.getElementById("nav_panel_global").style.float = "left";
    document.getElementById("nav_panel_all_califications").style.float = "right";
    document.getElementById("nav_panel_all_califications").style.display = "block";
}

/* Get all califications data */
function getCalificationsData() {
    var califications = [];
    $('#middle_column > div > div > div.panel.panel-default > div > div > ul > li').each(function() {
        califications.push({
            'kid': $(this).find('p').eq(0).text().trim(),
            'date': $(this).find('p').eq(1).text().trim(),
            'subject': $(this).find('p').eq(8).text().trim(),
            'name': $(this).find('p').eq(3).text().trim(),
            'percent': $(this).find('p').eq(4).text().trim(),
            'teacher': $(this).find('p').eq(5).text().trim(),
            'mark': $(this).find('p').eq(6).text().trim(),
            'evaluation': $(this).find('p').eq(7).text().trim(),
            'competence': $(this).find('p').eq(2).text().trim(),
            'global_check': $(this).find('p').eq(9).text().trim(),
            'eval_check': $(this).find('p').eq(10).text().trim(),
        });
    });
    return califications;
}

/* Fill table with data */
function createCalificationsTable(califications) {
    var tbl_body = document.getElementById("califications_table_body");
    for (let i = 0; i < califications.length; i++) {
        var tbl_row = document.createElement("tr");
        tbl_body.appendChild(tbl_row);
        var tbl_body_td = document.createElement("td");
        var kid_text = document.createTextNode(califications[i]['kid']);
        tbl_body_td.appendChild(kid_text);
        tbl_row.appendChild(tbl_body_td);
        var tbl_body_td2 = document.createElement("td");
        var date_text = document.createTextNode(califications[i]['date']);
        tbl_body_td2.appendChild(date_text);
        tbl_row.appendChild(tbl_body_td2);
        var tbl_body_td3 = document.createElement("td");
        var subject_text = document.createTextNode(califications[i]['subject']);
        tbl_body_td3.appendChild(subject_text);
        tbl_row.appendChild(tbl_body_td3);
        var tbl_body_td4 = document.createElement("td");
        var name_text = document.createTextNode(califications[i]['name']);
        tbl_body_td4.appendChild(name_text);
        tbl_row.appendChild(tbl_body_td4);
        var tbl_body_td5 = document.createElement("td");
        var percent_text = document.createTextNode(califications[i]['percent']);
        tbl_body_td5.appendChild(percent_text);
        tbl_row.appendChild(tbl_body_td5);
        var tbl_body_td6 = document.createElement("td");
        var teacher_text = document.createTextNode(califications[i]['teacher']);
        tbl_body_td6.appendChild(teacher_text);
        tbl_row.appendChild(tbl_body_td6);
        var tbl_body_td7 = document.createElement("td");
        var mark_text = document.createTextNode(califications[i]['mark']);
        tbl_body_td7.appendChild(mark_text);
        tbl_row.appendChild(tbl_body_td7);
        var tbl_body_td8 = document.createElement("td");
        var evaluation_text = document.createTextNode(califications[i]['evaluation']);
        tbl_body_td8.appendChild(evaluation_text);
        tbl_row.appendChild(tbl_body_td8);
        var tbl_body_td9 = document.createElement("td");
        var competence_text = document.createTextNode(califications[i]['competence']);
        tbl_body_td9.appendChild(competence_text);
        tbl_row.appendChild(tbl_body_td9);
        var tbl_body_td10 = document.createElement("td");
        var c_global_text = document.createTextNode(califications[i]['global_check']);
        tbl_body_td10.appendChild(c_global_text);
        tbl_row.appendChild(tbl_body_td10);
        var tbl_body_td11 = document.createElement("td");
        var c_eval_text = document.createTextNode(califications[i]['eval_check']);
        tbl_body_td11.appendChild(c_eval_text);
        tbl_row.appendChild(tbl_body_td11);
    }
    
    $('#califications_table > tbody > tr').each(function() {
        $(this).find('td:nth-child(8)').css("display", "none");
        $(this).find('td:nth-child(9)').css("display", "none");
        $(this).find('td:nth-child(10)').css("display", "none");
        $(this).find('td:nth-child(11)').css("display", "none");
    });
    if ($('#kid_list > li > a[class*="active"]').text()) {
        $('#califications_table > thead > tr > th:nth-child(1)').css('display', 'none');
        $('#califications_table_body > tr').each(function() {
            $(this).find('td').eq(0).css('display', 'none');
        });
    }
}

/* Fills select data for subjects */
function fillSubjectData() {
    var subjects = []
    let selectSubject = document.getElementById("califications_subject");
    $('#califications_table_body > tr').each(function() {
        var subject = $(this).find('td').eq(2).text();
        if (subject) {
            subjects.push({ 'subject': subject });
        }
    });
    subjects = subjects.reduce((res, item) =>
        (!res.find(({ subject }) => subject == item.subject) ? res.push(item) : true, res), [])
    selectSubject.options[0] = new Option("All subjects", "All subjects");
    for (let i = 0; i < subjects.length; i++) {
        selectSubject.options[i + 1] = new Option(subjects[i]['subject'].split("] ")[1], subjects[i]['subject'].split("] ")[1]);
    }
}

/* Reset buttons styles */
function resetButtons() {
    document.getElementById("all_marks_button").style.display = "none";
    $("#evaluation_marks_button").css("background-color", "#e9ecef");
    $("#competence_marks_button").css("background-color", "#e9ecef");
    $("#exam_marks_button").css("background-color", "#e9ecef");
    $("#all_marks_button").css("background-color", "#e9ecef");
    $("#evaluation_marks_button").css("border-color", "#e9ecef");
    $("#competence_marks_button").css("border-color", "#e9ecef");
    $("#exam_marks_button").css("border-color", "#e9ecef");
    $("#all_marks_button").css("border-color", "#e9ecef");
    $("#evaluation_marks_button").css("color", "#00A09D");
    $("#competence_marks_button").css("color", "#00A09D");
    $("#exam_marks_button").css("color", "#00A09D");
    $("#all_marks_button").css("color", "#00A09D");
}

/* Filters data */
function filterCalificationsData(califications, evaluation, subject, competence) {
    var formated_array = []
    var formated_evaluations = []
    var formated_competences = []
    $('#califications_table > tbody > tr').each(function() {
        $(this).remove();
    });
    if (evaluation != "") {
        if (evaluation == "1eval") {
            for (let i = 0; i < califications.length; i++) {
                if (califications[i]['evaluation'] == "first") {
                    formated_array.push(califications[i]);
                }
            }
        } else if (evaluation == "2eval") {
            for (let i = 0; i < califications.length; i++) {
                if (califications[i]['evaluation'] == "second") {
                    formated_array.push(califications[i]);
                }
            }
        } else if (evaluation == "3eval") {
            for (let i = 0; i < califications.length; i++) {
                if (califications[i]['evaluation'] == "third") {
                    formated_array.push(califications[i]);
                }
            }
        } else if (evaluation == "global") {
            for (let i = 0; i < califications.length; i++) {
                if (califications[i]['evaluation'] == "final") {
                    formated_array.push(califications[i]);
                }
            }
        } else if (evaluation == "all") {
            for (let i = 0; i < califications.length; i++) {
                formated_array.push(califications[i]);
            }
        }
    }
    if (subject != "") {
        if (subject != "All subjects") {
            for (let i = 0; i < formated_array.length; i++) {
                if (formated_array[i]['subject'].includes(subject)) {
                    formated_evaluations.push(formated_array[i]);
                }
            }
        } else {
            formated_evaluations = formated_array;
        }

    }
    if (competence != "") {
        if (competence != "all") {
            for (let i = 0; i < formated_evaluations.length; i++) {
                if (formated_evaluations[i]['eval_check'] == "True" && competence == "evaluation") {
                    formated_competences.push(formated_evaluations[i]);
                } else if (formated_evaluations[i]['global_check'] == "True" && competence == "exam") {
                    formated_competences.push(formated_evaluations[i]);
                } else if ((formated_evaluations[i]['eval_check'] == "" && formated_evaluations[i]['global_check'] == "") && competence == "competence") {
                    formated_competences.push(formated_evaluations[i]);
                }
            }
        } else {
            formated_competences = formated_evaluations;
        }
    }
    createCalificationsTable(formated_competences);
}

/* Get filter parameters */
function getParameters(str) {
    var evaluation = "";
    var competence = "";
    if ($('#nav_panel_1eval').css("background-color") == "rgb(0, 160, 157)") {
        evaluation = "1eval";
    } else if ($('#nav_panel_2eval').css("background-color") == "rgb(0, 160, 157)") {
        evaluation = "2eval";
    } else if ($('#nav_panel_3eval').css("background-color") == "rgb(0, 160, 157)") {
        evaluation = "3eval";
    } else if ($('#nav_panel_global').css("background-color") == "rgb(0, 160, 157)") {
        evaluation = "global"
    } else if ($('#nav_panel_all_califications').css("background-color") == "rgb(0, 160, 157)") {
        evaluation = "all"
    } else {
        evaluation = "all";
    }
    var subject = $("#califications_subject > option:selected").html();
    if (str == "evaluation"){
        competence = "evaluation";
    } else if (str == "competence"){
        competence = "competence";
    }else if(str == "exam"){
        competence = "exam";
    }else if(str == "all"){
        competence = "all";
    }else{
        competence = "all";
    }
    return [evaluation, subject, competence];
    
}
