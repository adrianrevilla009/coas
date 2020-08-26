/* Table comparer functions */
function comparer(index) {
    if (window.location.pathname.includes('/exam_tasks/') || window.location.pathname.includes('/incidents/')) {
        index = index - 1;
    }
    return function(a, b) {
        var valA = getCellValue(a, index), valB = getCellValue(b, index);
        return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.localeCompare(valB);
    }
}
function getCellValue(row, index) {
    return $(row).children('td').eq(index).html();
}
function setIcon(element, asc) {
    $("th").each(function() {
        $(this).removeClass("sorting");
        $(this).removeClass("asc");
        $(this).removeClass("desc");
    });
    element.addClass("sorting");
    if (asc)
        element.addClass("asc");
    else
        element.addClass("desc");
}

/* Creates color for each kid in the list */
function generateColorsForKidList() {
    var color_array = []
    var my_kid_list = $('#kid_list > li > a');
    my_kid_list.each(function() {
        var kid = $(this).text().trim();
        var number = $(this).find('span').text().trim();
        kid = kid.split("\n").join("").replace(number, "").trim();
        color_array.push({
            color : getRandomColor(),
            kid : kid,
        });
    });
    return color_array;
}
/* Decides if a color is light or dark */
function wc_hex_is_light(color) {
    const hex = color.replace('#', '');
    const c_r = parseInt(hex.substr(0, 2), 16);
    const c_g = parseInt(hex.substr(2, 2), 16);
    const c_b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;
    return brightness > 155;
}

/* Generates a random color */
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/* Creates calendar structure */
function showCalendar(month, year, monthAndYear, selectYear, selectMonth) {
    let firstDay = (new Date(year, month)).getDay() - 1;
    if (firstDay == -1) {
        firstDay = 6;
    }
    let daysInMonth = 32 - new Date(year, month, 32).getDate();
    let tbl = document.getElementById("calendar-body");
    let months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
    tbl.innerHTML = "";
    monthAndYear.innerHTML = months[month] + " " + year;
    selectYear.value = year;
    selectMonth.value = month;
    let date = 1;
    for (let i = 0; i < 6; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < 7; j++) {
            if (i == 0 && j < firstDay) {
                let cell = document.createElement("td");
                let cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
            } else if (date > daysInMonth) {
                break;
            } else {
                let cell = document.createElement("td");
                let cellText = document.createTextNode(date);
                cell.appendChild(cellText);
                row.appendChild(cell);
                date++;
            }
        }
        tbl.appendChild(row);
    }
}

/* Gets year and month stored in url */
function getUrlDate() {
    var path = window.location.pathname.split('/');
    if (path.length == 5) {
        var data = path[4]
        if (data.length == 5 || data.length == 6) {
            var return_data = [ data.substring(0, 4), data.substring(4, data.length) ];
        }
        return return_data;
    } else {
        return "";
    }
}

/* Formats hour for tables */
function getHourFormated(hour_text) {
    var hour_data = hour_text.split(".")[0];
    var min_data = hour_text.split(".")[1];
    if (hour_data != undefined && min_data != undefined) {
        if (hour_data.length == 1) {
            hour_data = "0" + hour_data.toString();
        }
        if (min_data.length == 1) {
            min_data = min_data.toString() + "0";
        } else if (min_data.length > 2) {
            min_data = parseInt(parseFloat("0." + hour_text.toString().split('.')[1]) * 60 + 0.1).toString();
            if (min_data.length == 1) {
                min_data = "0" + min_data;
            }

        }
        return hour_data + ":" + min_data;
    }
}

/* Changes url when calendar selects are changed */
function changeCalendarURL(currentMonth, currentYear, url_text) {
    var date = currentYear.toString() + currentMonth.toString();
    if (!window.location.pathname.includes(url_text)) {
        var url_slash = "/".concat(url_text).concat("/");
        var path = window.location.pathname.concat(url_slash).concat(date);
    } else {
        var path_parts = window.location.pathname.split('/');
        var path = window.location.pathname.replace(path_parts[4], date);
    }
    if (url_text == "calendar") {
        window.location.replace(window.location.origin.concat(path));
    } else if (url_text == "exam_task") {
        history.pushState({
            id : 'exam_task'
        }, 'Exam Task Layout', window.location.origin.concat(path));
    } else if (url_text == "meetings") {
        history.pushState({
            id : 'meetings'
        }, 'Meetings Layout', window.location.origin.concat(path));
    }
}

/* Formats display name */
function formatDisplayName(display_name) {
    try {
        if (display_name.charAt(display_name.length - 1) == ']') {
            display_name = display_name.split('[')[0];
        } else if (display_name.charAt(0) == '[') {
            display_name = display_name.split(']')[1];
        }
    } catch (error) {
        console.error(error);
    }
    return display_name;
}
