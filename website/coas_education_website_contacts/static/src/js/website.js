$(document).ready(function() {
    "use strict";
    if (window.location.pathname == '/contacts') {
        window.location.replace(window.location.origin.concat("/contacts/all"));
    }

    var url = window.location.href;
    if (url.includes('/contacts/')) {
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
    if (url.includes('/contacts/') && $('#middle_column > div > h1').text() != 'No contacts found') {
        if (window.location.pathname.includes('/all')) {
            createAllKidReportRows();
        } else {
            createKidReportRows();
        }

    }
});

/* Creates contacts structure and gets selected kid data */
function createKidReportRows() {
    var n_rows = $('#r_data_5').text();
    var data = $('#datos_ocultos > ul > li');
    var index = 0;
    let tbl = document.getElementById("kid_contacts_data_body");
    /* Create title with course */
    if (data.get(index) != null) {
        var text_course = document.createTextNode($('#r_data_6').text()); 
        //+ ": "+ data.eq(0).find('#r_data_2').text().split("]")[1]);
        let kid_data_div = document.createElement("div");
        let img = document.createElement('img');
        let h2 = document.createElement("h2");
        let img_div = document.createElement("div");
        let txt_div = document.createElement("div");
        img_div.setAttribute('class', 'col-lg-2');
        txt_div.setAttribute('class', 'col-lg-10');
        kid_data_div.setAttribute('id', 'kid_data');
        kid_data_div.setAttribute('class', 'row');
        img.setAttribute('src', $('#r_data_17').attr('src'));
        h2.appendChild(text_course);
        tbl.appendChild(kid_data_div);
        kid_data_div.appendChild(img_div);
        kid_data_div.appendChild(txt_div);
        img_div.appendChild(img);
        txt_div.appendChild(h2);
    }
    /* Create rows */
    for (let i = 0; i < parseInt(n_rows); i++) {
        let row = document.createElement("div");
        row.classList.add('row');
        tbl.appendChild(row);
        /* Create columns and data for rows */
        for (let j = 0; j < 4; j++) {
            if (data.get(index) != null) {
                let col = document.createElement("div");
                col.classList.add('col-lg-3');
                let media = document.createElement("div");
                media.classList.add('media');
                col.appendChild(media);
                let left_div = document.createElement("div");
                let right_div = document.createElement("div");
                left_div.setAttribute('id', 'left_div');
                right_div.setAttribute('id', 'right_div');
                media.appendChild(left_div);
                media.appendChild(right_div);
                let span_name = document.createElement("span");
                let span_subject = document.createElement("span");
                let span_email = document.createElement("span");
                var img = document.createElement('img');
                span_name.classList.add('label');
                span_name.classList.add('label-default');
                span_subject.classList.add('label');
                span_subject.classList.add('label-default');
                span_email.classList.add('label');
                span_email.classList.add('label-default');
                let text_name = document.createTextNode(data.eq(index).find('#r_data_0').text().trim());
                let text_subject = document
                        .createTextNode(data.eq(index).find('#r_data_1').text().trim().split("]")[1]);
                let text_email = document.createTextNode(data.eq(index).find('#r_data_3').text().trim());
                var src = data.eq(index).find('#r_data_4').attr('src');
                img.setAttribute('src', src);
                span_name.appendChild(text_name);
                span_subject.appendChild(text_subject);
                span_email.appendChild(text_email);
                right_div.appendChild(document.createElement("p").appendChild(span_name));
                right_div.appendChild(document.createElement("p").appendChild(span_subject));
                right_div.appendChild(document.createElement("p").appendChild(span_email));
                left_div.appendChild(img);
                row.appendChild(col);
                index++;
            } else {
                break;
            }
        }
    }
    /* Format styles */
    var labels = $('.media');
    labels.each(function() {
        $(this).find('span').append('<hr>');
        $(this).find('span').find('hr').css("margin", "0em");
        $(this).find('span').find('hr').css("border-width", "2px");
    });
    labels.each(function() {
        $(this).find('span').last().find('hr').css("display", "none");
    });
}

/* Creates contacts structure and gets all kids data */
function createAllKidReportRows() {
    var data = getAllKidReportData();
    for (i=0; i<data.length; i++) {
        if (parseInt(data[i]['number_of_reports']) === 0) {
            data.splice(i, 1);
        }
    }
    let tbl = document.getElementById("allkid_contacts_data_body");
    for (let i = 0; i < data.length; i++) {
        var index = 0;
        var text_course = document.createTextNode(data[i]['kid']);
        //+ ": "+ data[i]['kid_reports'][1]['course']);
        let kid_data_div = document.createElement("div");
        let img2 = document.createElement('img');
        let h2 = document.createElement("h2");
        let img_div = document.createElement("div");
        let txt_div = document.createElement("div");
        img_div.setAttribute('class', 'col-lg-2');
        txt_div.setAttribute('class', 'col-lg-10');
        kid_data_div.setAttribute('id', 'kid_data');
        kid_data_div.setAttribute('class', 'row');
        img2.setAttribute('src', $('#r_data_16').attr('src'));
        h2.appendChild(text_course);
        tbl.appendChild(kid_data_div);
        kid_data_div.appendChild(img_div);
        kid_data_div.appendChild(txt_div);
        img_div.appendChild(img2);
        txt_div.appendChild(h2);
        /* Create rows */
        for (let j = 0; j < data[i]['number_of_rows']; j++) {
            let row = document.createElement("div");
            row.classList.add('row');
            tbl.appendChild(row);
            /* Create columns and data for rows */
            for (let k = 0; k < 4; k++) {
                if (data[i]['kid_reports'][index] != null) {
                    let col = document.createElement("div");
                    col.classList.add('col-lg-3');
                    let media = document.createElement("div");
                    media.classList.add('media');
                    col.appendChild(media);
                    let left_div = document.createElement("div");
                    let right_div = document.createElement("div");
                    left_div.setAttribute('id', 'left_div');
                    right_div.setAttribute('id', 'right_div');
                    media.appendChild(left_div);
                    media.appendChild(right_div);
                    let span_name = document.createElement("span");
                    let span_subject = document.createElement("span");
                    let span_email = document.createElement("span");
                    var img = document.createElement('img');
                    span_name.classList.add('label');
                    span_name.classList.add('label-default');
                    span_subject.classList.add('label');
                    span_subject.classList.add('label-default');
                    span_email.classList.add('label');
                    span_email.classList.add('label-default');
                    let text_name = document.createTextNode(data[i]['kid_reports'][index]['teacher']);
                    let text_subject = document.createTextNode(data[i]['kid_reports'][index]['subject']);
                    let text_email = document.createTextNode(data[i]['kid_reports'][index]['email']);
                    var src = data[i]['kid_reports'][index]['img'];
                    img.setAttribute('src', src);
                    span_name.appendChild(text_name);
                    span_subject.appendChild(text_subject);
                    span_email.appendChild(text_email);
                    right_div.appendChild(document.createElement("p").appendChild(span_name));
                    right_div.appendChild(document.createElement("p").appendChild(span_subject));
                    right_div.appendChild(document.createElement("p").appendChild(span_email));
                    left_div.appendChild(img);
                    row.appendChild(col);
                    index++;
                } else {
                    break;
                }
            }
        }
    }
    /* Format styles */
    var labels = $('.media');
    labels.each(function() {
        $(this).find('span').append('<hr>');
        $(this).find('span').find('hr').css("margin", "0em");
        $(this).find('span').find('hr').css("border-width", "2px");
    });
    labels.each(function() {
        $(this).find('span').last().find('hr').css("display", "none");
    });
}

/* Function for formating all kid data */
function getAllKidReportData() {
    var reports = $('#datos_ocultos_2 > ul:nth-child(1) > li');
    var kids = $('#datos_ocultos_2 > ul:nth-child(2) > li');
    var data = []
    var total_reports = parseInt($('#datos_ocultos_2 > p').text().trim());
    var count = 0;
    kids.each(function(index) {
        if (count <= total_reports) {
            var number_of_rows = parseInt($('#datos_ocultos_2 > ul:nth-child(3) > li').eq(index).find('p').text()
                    .trim());
            var kid = $(this).find('p').text().trim();
            var number_of_reports = parseInt($('#datos_ocultos_2 > ul:nth-child(4) > li').eq(index).find('p').text()
                    .trim());
            var kid_reports = reports.slice(count, count + number_of_reports);
            var kid_report_data = [];
            kid_reports.each(function() {
                var teacher = $(this).find('#r_data_7').text().trim();
                var subject = $(this).find('#r_data_8').text().trim().split("]")[1];
                var course = $(this).find('#r_data_9').text().trim();
                var email = $(this).find('#r_data_10').text().trim();
                var img = $(this).find('#r_data_11').attr('src');
                kid_report_data.push({
                    'teacher' : teacher ? teacher : 'Teacher not defined',
                    'subject' : subject ? subject : 'Subject not defined',
                    'course' : course ? course : 'Course not defined',
                    'email' : email ? email : 'Email not defined',
                    'img' : img,
                });
            });
            count = count + number_of_reports;
            data.push({
                'kid' : kid,
                'number_of_reports' : number_of_reports,
                'number_of_rows' : number_of_rows,
                'kid_reports' : kid_report_data,
            });
        }
    });
    return data;
}
