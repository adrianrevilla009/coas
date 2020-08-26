$(document).ready(function() {
    "use strict";

    var url = window.location.href;
    if (url.includes('/incidents/') || url.includes('/assistences/') || url.includes('/claims/')) {
        if (url.includes('/incidents/') || url.includes('/assistences/')) {
            if (window.location.pathname.includes("/incidents/")){
                var current_id = window.location.pathname.replace('/incidents/', '');
            }else if (window.location.pathname.includes("/assistences/")){
                var current_id = window.location.pathname.replace('/assistences/', '');
            }
        } else {
            var current_id = window.location.pathname.replace('/claims/', '');
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
    if (url.includes('/incidents/') || url.includes('/assistences/')) {
        /* Control and fill issue data */
        var issues = getIssueData();
        if (issues[0].length == 0 && issues[1].length == 0 && issues[2].length == 0) {
            let issue_div = document.getElementById("issues_body");
            let container = document.createElement("div");
            container.setAttribute('class', 'container');
            issue_div.appendChild(container);
            let h2 = document.createElement("h2");
            container.appendChild(h2);
            if ($('#kid_list > li > a[class*="active"]').text()) {
                var title_text = document.createTextNode("No issues found");
            } else {
            	if ($('#left_column > ul > li').length == 0){
            		var title_text = document.createTextNode("No kids found for this user");
            	}else{
            		var title_text = document.createTextNode("No issues found");
            	}
            }
            h2.appendChild(title_text);
            document.getElementById("issues_filters").style.display = "none";
        } else {
            document.getElementById("issues_filters").style.display = "block";
            fillIssueData(issues);
            fillIssueFilterData();
            calculateTotalGravity();
        }
        /* Date filtering */
        document.getElementById("date").addEventListener("change", function() {
            $('#issues_body > div').remove();
            var filtered_issues = filterData(issues);
            fillIssueData(filtered_issues);
            calculateTotalGravity();
        });
        /* Subject filtering */
        document.getElementById("subject").addEventListener("change", function() {
            $('#issues_body > div').remove();
            var filtered_issues = filterData(issues);
            fillIssueData(filtered_issues);
            calculateTotalGravity();
        });

        /* Functions for ordering the tables */
        $(document).on('click', '#negative_issues > thead > tr > th', function() {
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
        });
        $(document).on('click', '#positive_issues > thead > tr > th', function() {
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
        });
        $(document).on('click', '#assistence_issues > thead > tr > th', function() {
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
        });
        /* Function for redirecting the button */
        $(document).on('click', '#issues_filters > div > input', function() {
            if (window.location.pathname.includes("/incidents/")){
                sessionStorage.setItem('type', 'Incidents');
                window.location.replace(window.location.pathname.replace(window.location.pathname.split('/')[1], 'claims'));
            }else if (window.location.pathname.includes("/assistences/")){
                sessionStorage.setItem('type', 'Assistences');
                window.location.replace(window.location.pathname.replace(window.location.pathname.split('/')[1], 'claims'));
            }
        });
    } else  if (url.includes('/claims/')) {
        /* Control and fill claim data */
        var claims = getClaimData();
        if (claims.length == 0) {
            let issue_div = document.getElementById("claims_body");
            let container = document.createElement("div");
            container.setAttribute('class', 'container');
            issue_div.appendChild(container);
            let h2 = document.createElement("h2");
            container.appendChild(h2);
            if ($('#kid_list > li > a[class*="active"]').text()) {
                var title_text = document.createTextNode("No claims for this kid.");
            } else {
                var title_text = document.createTextNode("No claims for any of the kids.");
            }
            h2.appendChild(title_text);
            $('#claims_body > div > h2').css('color','#6c757d');
            $('#claims_body > div > h2').css('text-align','center');
            document.getElementById("claims_filters").style.display = "none";
        } else {
            document.getElementById("claims_filters").style.display = "block";
            fillClaimData(claims);
            fillClaimFilterData();
        }
        if ($('#kid_list > li > a[class*="active"]').text()) {
            $('#claims_table > thead > tr > th:nth-child(2)').css('display', 'none');
            $('#claims_table > tbody > tr').each(function() {
                $(this).find('td').eq(0).css('display', 'none');
            });
        }
        if (sessionStorage.getItem('type') == "Incidents"){
            $('#claims_filters > div > input').attr('value','Incidents');
        } else if(sessionStorage.getItem('type') =="Assistences"){
            $('#claims_filters > div > input').attr('value','Assistences');
        }
        /* Date filtering */
        document.getElementById("date2").addEventListener("change", function() {
            $('#claims_body > div').remove();
            var filtered_claims = filterData(claims);
            fillClaimData(filtered_claims);
        });
        /* Subject filtering */
        document.getElementById("subject2").addEventListener("change", function() {
            $('#claims_body > div').remove();
            var filtered_claims = filterData(claims);
            fillClaimData(filtered_claims);
        });
        /* Function for ordering the table */
        $(document).on('click', '#claim_table > thead > tr > th', function() {
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
        });
        /* Function for redirecting the button */
        $(document).on('click', '#claims_filters > div > input', function() {
            if (sessionStorage.getItem('type') == "Incidents"){
                sessionStorage.removeItem('type');
                window.location.replace(window.location.pathname.replace(window.location.pathname.split('/')[1], 'incidents'));
            }else if(sessionStorage.getItem('type') =="Assistences"){
                sessionStorage.removeItem('type');
                window.location.replace(window.location.pathname.replace(window.location.pathname.split('/')[1], 'assistences'));
            }
        });
    }

});

/* Function for calculating gravity */
function calculateTotalGravity() {
    var assistence_rows = $('#assistence_issues > tbody > tr');
    var negative_rows = $('#negative_issues > tbody > tr');
    var positive_rows = $('#positive_issues > tbody > tr');
    if (assistence_rows.length) {
        var assistence_gravity_total = 0;
        assistence_rows.each(function() {
            if ($(this).find('td').eq(5).text()) {
                assistence_gravity_total += parseInt($(this).find('td').eq(5).text());
            }
        });
        $('#assistence_issues').prev().append("      ( Gravity: " + assistence_gravity_total + " )");
    }
    if (negative_rows.length) {
        var negative_gravity_total = 0;
        negative_rows.each(function() {
            if ($(this).find('td').eq(5).text()) {
                negative_gravity_total += parseInt($(this).find('td').eq(5).text());
            }
        });
        $('#negative_issues').prev().append("      ( Gravity: " + negative_gravity_total + " )");
    }
    if (positive_rows.length) {
        var positive_gravity_total = 0;
        positive_rows.each(function() {
            if ($(this).find('td').eq(5).text()) {
                positive_gravity_total += parseInt($(this).find('td').eq(5).text());
            }
        });
        $('#positive_issues').prev().append("      ( Gravity: " + positive_gravity_total + " )");
    }

}

/* Message control for filters */
function checkTextMessages() {
    if ($('#positive_issues > tbody > tr').length == 0) {
        $('#positive_issues').remove();
        $('h2:contains("Positive issues")').remove();
    }
    if ($('#negative_issues > tbody > tr').length == 0) {
        $('#negative_issues').remove();
        $('h2:contains("Negative issues")').remove();
    }
    if ($('#assistence_issues > tbody > tr').length == 0) {
        $('#assistence_issues').remove();
        $('h2:contains("Assistence issues")').remove();
    }
    if ($('#claim_table > tbody > tr').length == 0) {
        $('#claim_table').remove();
    }
}

/* Function for generating filters text for claims*/
function fillClaimFilterData() {
    let selectDate = document.getElementById("date2");
    let selectSubject = document.getElementById("subject2");
    selectDate.options[0] = new Option("All dates", "All dates");
    selectDate.options[1] = new Option("This month", "This month");
    selectDate.options[2] = new Option("Past month", "Past month");
    selectDate.options[3] = new Option("This year", "This year");
    selectDate.selectedIndex = 0;
    var rows = $('#claim_table > tbody > tr');
    var subjects = [];
    rows.each(function() {
        var subject = $(this).find('td').eq(7).text().trim();
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

/* Function for generating filters text for issues*/
function fillIssueFilterData() {
    let selectDate = document.getElementById("date");
    let selectSubject = document.getElementById("subject");
    selectDate.options[0] = new Option("All dates", "All dates");
    selectDate.options[1] = new Option("This month", "This month");
    selectDate.options[2] = new Option("Past month", "Past month");
    selectDate.options[3] = new Option("This year", "This year");
    selectDate.selectedIndex = 0;
    var rows = $('#assistence_issues > tbody > tr').add($('#positive_issues > tbody > tr')).add($('#negative_issues > tbody > tr'));
    var subjects = [];
    rows.each(function() {
        var subject = $(this).find('td').eq(2).text().trim();
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

/* Generates issues table */
function createTable(id, container, title, issues) {
    var h2 = document.createElement("h2");
    h2.setAttribute('id', 'table_title');
    var title_text = document.createTextNode(title);
    h2.appendChild(title_text);
    var tbl = document.createElement("table");
    tbl.setAttribute('class', 'table table-stripped');
    tbl.setAttribute('id', id);
    container.appendChild(h2);
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
    var tbl_head_th6 = document.createElement("th");
    var tbl_head_th7 = document.createElement("th");
    var tbl_head_th8 = document.createElement("th");
    var tbl_head_th9 = document.createElement("th");
    tbl_head_th.setAttribute('scope', 'col');
    tbl_head_th.setAttribute('class', 'short-column');
    tbl_head_th2.setAttribute('scope', 'col');
    tbl_head_th2.setAttribute('class', 'long-column');
    tbl_head_th3.setAttribute('scope', 'col');
    tbl_head_th3.setAttribute('class', 'short-column');
    tbl_head_th4.setAttribute('scope', 'col');
    tbl_head_th4.setAttribute('class', 'long-column');
    tbl_head_th5.setAttribute('scope', 'col');
    tbl_head_th5.setAttribute('class', 'long-column');
    tbl_head_th6.setAttribute('scope', 'col');
    tbl_head_th6.setAttribute('class', 'short-column');
    tbl_head_th7.setAttribute('scope', 'col');
    tbl_head_th7.setAttribute('class', 'short-column');
    tbl_head_th8.setAttribute('scope', 'col');
    tbl_head_th8.setAttribute('class', 'short-column');
    tbl_head_th9.setAttribute('scope', 'col');
    tbl_head_th9.setAttribute('class', 'short-column');
    tbl_row.appendChild(tbl_head_th);
    tbl_row.appendChild(tbl_head_th2);
    tbl_row.appendChild(tbl_head_th3);
    tbl_row.appendChild(tbl_head_th4);
    tbl_row.appendChild(tbl_head_th5);
    tbl_row.appendChild(tbl_head_th6);
    tbl_row.appendChild(tbl_head_th7);
    tbl_row.appendChild(tbl_head_th8);
    tbl_row.appendChild(tbl_head_th9);
    var num_text = document.createTextNode('#');
    var kid_text = document.createTextNode('Kid');
    var date_text = document.createTextNode('Date');
    var subject_text = document.createTextNode('Subject');
    var teacher_text = document.createTextNode('Teacher');
    var type_text = document.createTextNode('Issue type');
    var gravity_text = document.createTextNode('Gravity');
    var note_text = document.createTextNode('Notes');
    var count_text = document.createTextNode('Count');
    tbl_head_th.appendChild(num_text);
    tbl_head_th2.appendChild(kid_text);
    tbl_head_th3.appendChild(date_text);
    tbl_head_th4.appendChild(subject_text);
    tbl_head_th5.appendChild(teacher_text);
    tbl_head_th6.appendChild(type_text);
    tbl_head_th7.appendChild(gravity_text);
    tbl_head_th8.appendChild(note_text);
    tbl_head_th9.appendChild(count_text);
    /* Table body */
    var tbl_body = document.createElement("tbody");
    tbl.appendChild(tbl_body);
    for (let i = 0; i < issues.length; i++) {
        var tbl_row = document.createElement("tr");
        tbl_body.appendChild(tbl_row);
        var tbl_body_th = document.createElement("th");
        tbl_body_th.setAttribute('scope', 'row');
        var num_text = document.createTextNode(i + 1);
        tbl_body_th.appendChild(num_text);
        tbl_row.appendChild(tbl_body_th);
        var tbl_body_td = document.createElement("td");
        var kid_text = document.createTextNode(issues[i]['kid']);
        tbl_body_td.appendChild(kid_text);
        tbl_row.appendChild(tbl_body_td);
        var tbl_body_td_2 = document.createElement("td");
        var date_text = document.createTextNode(issues[i]['date']);
        tbl_body_td_2.appendChild(date_text);
        tbl_row.appendChild(tbl_body_td_2);
        var tbl_body_td_3 = document.createElement("td");
        var subject_text = document.createTextNode(issues[i]['subject']);
        tbl_body_td_3.appendChild(subject_text);
        tbl_row.appendChild(tbl_body_td_3);
        var tbl_body_td_4 = document.createElement("td");
        var teacher_text = document.createTextNode(issues[i]['teacher']);
        tbl_body_td_4.appendChild(teacher_text);
        tbl_row.appendChild(tbl_body_td_4);
        var tbl_body_td_5 = document.createElement("td");
        var type_text = document.createTextNode(issues[i]['type']);
        tbl_body_td_5.appendChild(type_text);
        tbl_row.appendChild(tbl_body_td_5);
        var tbl_body_td_7 = document.createElement("td");
        var gravity_text = document.createTextNode(issues[i]['gravity']);
        tbl_body_td_7.appendChild(gravity_text);
        tbl_row.appendChild(tbl_body_td_7);
        var tbl_body_td_8 = document.createElement("td");
        var notes_text = document.createTextNode(issues[i]['notes']);
        tbl_body_td_8.appendChild(notes_text);
        tbl_row.appendChild(tbl_body_td_8);
        var tbl_body_td_9 = document.createElement("td");
        var count_text = document.createTextNode(issues[i]['count']);
        tbl_body_td_9.appendChild(count_text);
        tbl_row.appendChild(tbl_body_td_9);
    }
}

/* Function for counting repeated issue rows */
function countRepeatedRows() {
    var assistences_count = [], positives_count = [], negatives_count = [];
    var assistences = [], positives = [], negatives = [];
    $('#student_incidents > ul:nth-child(4) > li').each(function() {
        assistences_count.push($(this).text().trim());
    });
    $('#student_incidents > ul:nth-child(5) > li').each(function() {
        positives_count.push($(this).text().trim());
    });
    $('#student_incidents > ul:nth-child(6) > li').each(function() {
        negatives_count.push($(this).text().trim());
    });
    $('#student_incidents > ul:nth-child(1) > li').each(function(index) {
        assistences.push({
            'id': $(this).find('#i_data_0').text().trim(),
            'count': assistences_count[index]
        });
    });
    $('#student_incidents > ul:nth-child(2) > li').each(function(index) {
        positives.push({
            'id': $(this).find('#i_data_0').text().trim(),
            'count': positives_count[index]
        });
    });
    $('#student_incidents > ul:nth-child(3) > li').each(function(index) {
        negatives.push({
            'id': $(this).find('#i_data_0').text().trim(),
            'count': negatives_count[index]
        });
    });
    return [assistences, positives, negatives]
};

/* Generates claims table */
function fillClaimData(claims) {
    let claim_div = document.getElementById("claims_body");
    let container = document.createElement("div");
    container.setAttribute('class', 'container');
    claim_div.appendChild(container);
    var tbl = document.createElement("table");
    tbl.setAttribute('class', 'table table-stripped');
    tbl.setAttribute('id', "claim_table");
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
    var tbl_head_th6 = document.createElement("th");
    var tbl_head_th7 = document.createElement("th");
    tbl_head_th.setAttribute('scope', 'col');
    tbl_head_th.setAttribute('class', 'short-column');
    tbl_head_th2.setAttribute('scope', 'col');
    tbl_head_th2.setAttribute('class', 'long-column');
    tbl_head_th3.setAttribute('scope', 'col');
    tbl_head_th3.setAttribute('class', 'short-column');
    tbl_head_th4.setAttribute('scope', 'col');
    tbl_head_th4.setAttribute('class', 'long-column');
    tbl_head_th5.setAttribute('scope', 'col');
    tbl_head_th5.setAttribute('class', 'short-column');
    tbl_head_th6.setAttribute('scope', 'col');
    tbl_head_th6.setAttribute('class', 'long-column');
    tbl_head_th7.setAttribute('scope', 'col');
    tbl_head_th7.setAttribute('class', 'long-column');
    tbl_row.appendChild(tbl_head_th);
    tbl_row.appendChild(tbl_head_th2);
    tbl_row.appendChild(tbl_head_th3);
    tbl_row.appendChild(tbl_head_th4);
    tbl_row.appendChild(tbl_head_th5);
    tbl_row.appendChild(tbl_head_th6);
    tbl_row.appendChild(tbl_head_th7);
    var num_text = document.createTextNode('#');
    var kid_text = document.createTextNode('Kid');
    var date_text = document.createTextNode('Date');
    var description_text = document.createTextNode('Description');
    var gravity_text = document.createTextNode('Gravity');
    var teacher_text = document.createTextNode('Teacher');
    var subject_text = document.createTextNode('Subject');
    tbl_head_th.appendChild(num_text);
    tbl_head_th2.appendChild(kid_text);
    tbl_head_th3.appendChild(date_text);
    tbl_head_th4.appendChild(description_text);
    tbl_head_th5.appendChild(gravity_text);
    tbl_head_th6.appendChild(teacher_text);
    tbl_head_th7.appendChild(subject_text);
    /* Table body */
    var tbl_body = document.createElement("tbody");
    tbl.appendChild(tbl_body);
    for (let i = 0; i < claims.length; i++) {
        var tbl_row = document.createElement("tr");
        tbl_body.appendChild(tbl_row);
        var tbl_body_th = document.createElement("th");
        tbl_body_th.setAttribute('scope', 'row');
        var num_text = document.createTextNode(i + 1);
        tbl_body_th.appendChild(num_text);
        tbl_row.appendChild(tbl_body_th);
        var tbl_body_td = document.createElement("td");
        var kid_text = document.createTextNode(claims[i]['kid']);
        tbl_body_td.appendChild(kid_text);
        tbl_row.appendChild(tbl_body_td);
        var tbl_body_td_2 = document.createElement("td");
        var date_text = document.createTextNode(claims[i]['date']);
        tbl_body_td_2.appendChild(date_text);
        tbl_row.appendChild(tbl_body_td_2);
        var tbl_body_td_3 = document.createElement("td");
        var description_text = document.createTextNode(claims[i]['description']);
        tbl_body_td_3.appendChild(description_text);
        tbl_row.appendChild(tbl_body_td_3);
        var tbl_body_td_4 = document.createElement("td");
        var gravity_text = document.createTextNode(claims[i]['gravity']);
        tbl_body_td_4.appendChild(gravity_text);
        tbl_row.appendChild(tbl_body_td_4);
        var tbl_body_td_5 = document.createElement("td");
        var teacher_text = document.createTextNode(claims[i]['teacher']);
        tbl_body_td_5.appendChild(teacher_text);
        tbl_row.appendChild(tbl_body_td_5);
        var tbl_body_td_6 = document.createElement("td");
        var subject_text = document.createTextNode(claims[i]['subject']);
        tbl_body_td_6.appendChild(subject_text);
        tbl_row.appendChild(tbl_body_td_6);
    }
}

/* Creates all issue tables */
function fillIssueData(issues) {
    let issue_div = document.getElementById("issues_body");
    let container = document.createElement("div");
    container.setAttribute('class', 'container');
    issue_div.appendChild(container);
    if (issues[0].length) {
        createTable("assistence_issues", container, "Assistence issues", issues[0]);
    }
    if (issues[1].length) {
        createTable("positive_issues", container, "Positive issues", issues[1]);
    }
    if (issues[2].length) {
        createTable("negative_issues", container, "Negative issues", issues[2]);
    }
    if ($('#kid_list > li > a[class*="active"]').text()) {
        $('#assistence_issues > thead > tr > th:nth-child(2)').css('display', 'none');
        $('#positive_issues > thead > tr > th:nth-child(2)').css('display', 'none');
        $('#negative_issues > thead > tr > th:nth-child(2)').css('display', 'none');
        $('#assistence_issues > tbody > tr').each(function() {
            $(this).find('td').eq(0).css('display', 'none');
        });
        $('#positive_issues > tbody > tr').each(function() {
            $(this).find('td').eq(0).css('display', 'none');
        });
        $('#negative_issues > tbody > tr').each(function() {
            $(this).find('td').eq(0).css('display', 'none');
        });
    }
    hideNoNeededColumns();
}

/* Gets claims data */
function getClaimData() {
    if (sessionStorage.getItem('type') == "Incidents"){
        var claim_ids = $('#student_claims > ul:nth-child(1) > li');
    }else if(sessionStorage.getItem('type') =="Assistences"){
        var claim_ids = $('#student_claims > ul:nth-child(2) > li');
    }
    var claims = []
    claim_ids.each(function() {
        claims.push({
            'kid': $(this).find('p').eq(0).text().trim(),
            'date': $(this).find('p').eq(1).text().trim(),
            'description': $(this).find('p').eq(2).text().trim(),
            'gravity': $(this).find('p').eq(3).text().trim(),
            'teacher': $(this).find('p').eq(4).text().trim(),
            'subject': $(this).find('p').eq(5).text().trim(),
        })
    });
    return claims;
}

/*  Get issues data */
function getIssueData() {
    var assistence_issue_ids = $('#student_incidents > ul:nth-child(1) > li');
    var positive_issue_ids = $('#student_incidents > ul:nth-child(2) > li');
    var negative_issue_ids = $('#student_incidents > ul:nth-child(3) > li');
    var assistences = [];
    var positives = [];
    var negatives = [];
    assistence_issue_ids.each(function() {
        assistences.push({
            'kid': $(this).find('p').eq(0).text().trim(),
            'date': $(this).find('p').eq(1).text().trim(),
            'subject': $(this).find('p').eq(2).text().trim(),
            'teacher': $(this).find('p').eq(3).text().trim(),
            'type': $(this).find('p').eq(4).text().trim(),
            'gravity': $(this).find('p').eq(5).text().trim(),
            'notes': $(this).find('p').eq(6).text().trim(),
            'id': $(this).find('#i_data_0').text().trim(),
        })
    });
    positive_issue_ids.each(function() {
        positives.push({
            'kid': $(this).find('p').eq(0).text().trim(),
            'date': $(this).find('p').eq(1).text().trim(),
            'subject': $(this).find('p').eq(2).text().trim(),
            'teacher': $(this).find('p').eq(3).text().trim(),
            'type': $(this).find('p').eq(4).text().trim(),
            'gravity': $(this).find('p').eq(5).text().trim(),
            'notes': $(this).find('p').eq(6).text().trim(),
            'id': $(this).find('#i_data_0').text().trim(),
        })
    });
    negative_issue_ids.each(function() {
        negatives.push({
            'kid': $(this).find('p').eq(0).text().trim(),
            'date': $(this).find('p').eq(1).text().trim(),
            'subject': $(this).find('p').eq(2).text().trim(),
            'teacher': $(this).find('p').eq(3).text().trim(),
            'type': $(this).find('p').eq(4).text().trim(),
            'gravity': $(this).find('p').eq(5).text().trim(),
            'notes': $(this).find('p').eq(6).text().trim(),
            'id': $(this).find('#i_data_0').text().trim(),
        })
    });

    var counted_issues = countRepeatedRows();
    var issues = [assistences, positives, negatives];

    for (let i = 0; i < assistences.length; i++) {
        for (let j = 0; j < counted_issues[0].length; j++) {
            if (assistences[i]['id'] == counted_issues[0][j]['id']) {
                assistences[i]['count'] = counted_issues[0][j]['count'];
            }
        }
    }
    for (let i = 0; i < positives.length; i++) {
        for (let j = 0; j < counted_issues[1].length; j++) {
            if (positives[i]['id'] == counted_issues[1][j]['id']) {
                positives[i]['count'] = counted_issues[1][j]['count'];
            }
        }
    }
    for (let i = 0; i < negatives.length; i++) {
        for (let j = 0; j < counted_issues[2].length; j++) {
            if (negatives[i]['id'] == counted_issues[2][j]['id']) {
                negatives[i]['count'] = counted_issues[2][j]['count'];
            }
        }
    }
    return issues;
}

/* Function for hide some columns not needed */
function hideNoNeededColumns() {
    $('#assistence_issues > thead > tr > th:nth-child(4), #assistence_issues > tbody> tr > td:nth-child(4)').hide();
    $('#assistence_issues > thead > tr > th:nth-child(5), #assistence_issues > tbody> tr > td:nth-child(5)').hide();
    $('#positive_issues > thead > tr > th:nth-child(9), #positive_issues > tbody > tr > td:nth-child(9)').hide();
    $('#negative_issues > thead > tr > th:nth-child(9), #negative_issues > tbody > tr > td:nth-child(9)').hide();
}


/* Function for filtering data */
function filterData(data) {
    var issue_date = $("#date > option:selected").html();
    var issue_subject = $("#subject > option:selected").html();
    var claim_date = $("#date2 > option:selected").html();
    var claim_subject = $("#subject2 > option:selected").html();
    var issue_date_formated = [];
    var claim_date_formated = [];
    var issue_subject_formated = [];
    var claim_subject_formated = [];

    let today = new Date();
    let currentMonth = today.getMonth() + 1;
    let currentYear = today.getFullYear();

    if (window.location.pathname.includes('incidents') || window.location.pathname.includes('assistences')) {
        /* Incident date filter */
        if (issue_date != 'All dates') {
            for (let j = 0; j < data.length; j++) {
                var a = [];
                for (let i = 0; i < data[j].length; i++) {
                    var month = data[j][i]['date'].split('-')[1].trim();
                    var year = data[j][i]['date'].split('-')[0].trim();
                    if (issue_date == "This month") {
                        if (currentMonth == parseInt(month)) {
                            a.push(data[j][i]);
                        }
                    } else if (issue_date == "Past month") {
                        if (currentMonth == 1) {
                            var pastMonth = 12;
                        } else {
                            var pastMonth = currentMonth - 1;
                        }
                        if (pastMonth == parseInt(month)) {
                            a.push(data[j][i]);
                        }
                    } else if (issue_date == "This year") {
                        if (year.toString() == currentYear.toString()) {
                            a.push(data[j][i]);
                        }
                    }
                }
                issue_date_formated.push(a);
            }
        } else {
            issue_date_formated = data;
        }
        /* Incident subject filter */
        if (issue_subject != 'All subjects') {
            for (let j = 0; j < issue_date_formated.length; j++) {
                var a = [];
                for (let i = 0; i < issue_date_formated[j].length; i++) {
                    if (issue_date_formated[j][i]['subject'] != "") {
                        var subject = issue_date_formated[j][i]['subject'].split("] ")[1].trim();
                    } else {
                        var subject = issue_date_formated[j][i]['subject'];
                    }
                    if (issue_subject == subject) {
                        a.push(issue_date_formated[j][i]);
                    }
                }
                issue_subject_formated.push(a);
            }
        } else {
            issue_subject_formated = issue_date_formated;
        }
        checkTextMessages();
        return issue_subject_formated;

    } else if (window.location.pathname.includes('claims')) {
        /* Claim date filter */
        if (claim_date != 'All dates') {
            for (let i = 0; i < data.length; i++) {
                var month = data[i]['date'].split('-')[1].trim();
                var year = data[i]['date'].split('-')[0].trim();
                if (claim_date == "This month") {
                    if (currentMonth == parseInt(month)) {
                        claim_date_formated.push(data[i]);
                    }
                } else if (claim_date == "Past month") {
                    if (currentMonth == 1) {
                        var pastMonth = 12;
                    } else {
                        var pastMonth = currentMonth - 1;
                    }
                    if (pastMonth == parseInt(month)) {
                        claim_date_formated.push(data[i]);
                    }
                } else if (claim_date == "This year") {
                    if (year.toString() == currentYear.toString()) {
                        claim_date_formated.push(data[i]);
                    }
                }
            }
        } else {
            claim_date_formated = data;
        }
        /* Claim subject filter */
        if (claim_subject != 'All subjects') {
            for (let i = 0; i < claim_date_formated.length; i++) {
                if (claim_date_formated[i]['subject'] != ""){
                    var subject = claim_date_formated[i]['subject'].split("] ")[1].trim();
                }else{
                    var subject = claim_date_formated[i]['subject'];
                }
                if (claim_subject == subject) {
                    claim_subject_formated.push(claim_date_formated[i]);
                }
            }
        } else {
            claim_subject_formated = claim_date_formated;
        }
        checkTextMessages();
        return claim_subject_formated;
    }
}
