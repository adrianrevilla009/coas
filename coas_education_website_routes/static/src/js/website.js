/* Route layout functions */
$(document).ready(function() {
    "use strict";

    var url = window.location.href;
    if (url.includes('/routes/')) {
        var current_id = window.location.pathname.replace('/routes/', '');
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

        if ($('#left_column > ul > li').length > 0 && $('#middle_columna > div > h1').text() != 'No routes found') {
            /* Get kids and creates table */
            var kid_ids = [];
            if ($('#kid_list > li > a[class*="active"]').text()) {
                kid_ids.push($('#kid_list > li > a[class*="active"]').find('span').text().trim());
            } else {
                $('#kid_list > li > a').find('span').each(function() {
                    kid_ids.push($(this).text().trim());
                });
            }
            createKidTables(kid_ids);
            if ($('#kid_list > li > a[class*="active"]').text()) {
                $('#routes_table > thead > tr > th:nth-child(1)').css('display', 'none');
                $('#routes_table > tbody > tr').each(function() {
                    $(this).find('td').eq(0).css('display', 'none');
                });
            }
        } else {
            if ($('#left_column > ul > li').length == 0) {
                $('#middle_columna > div > h1').html("No kids found for this user");
            }
        }
        /* Function for ordering the table */
        $('#routes_table > thead > tr > th').click(function() {
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
        });
    }
});

/* Route support layout functions */
$(document).ready(
        function() {
            "use strict";
            var url = window.location.href;
            if (url.includes('/route_support/')) {
                var current_id = window.location.pathname.replace('/route_support/', '');
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

                if ($('#left_column > ul > li').length > 0
                        && $('#middle_columna > div > h1').text() != 'No route support found') {
                    var kid_ids = [];
                    if ($('#kid_list > li > a[class*="active"]').text()) {
                        kid_ids.push($('#kid_list > li > a[class*="active"]').find('span').text().trim());
                    } else {
                        $('#kid_list > li > a').find('span').each(function() {
                            kid_ids.push($(this).text().trim());
                        });
                    }
                    createKidIssueTables(kid_ids);
                    if ($('#kid_list > li > a[class*="active"]').text()) {
                        $('#routes_table > thead > tr > th:nth-child(1)').css('display', 'none');
                        $('#routes_table > tbody > tr').each(function() {
                            $(this).find('td').eq(0).css('display', 'none');
                        });
                    }
                } else {
                    if ($('#left_column > ul > li').length == 0) {
                        $('#middle_columna > div > h1').html("No kids found for this user");
                    }
                }
                $('#route_support_table > thead > tr > th').click(function() {
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
                });
            }

        });

/* Fills table with kid data */
function createKidTables(kid_ids) {
    for (let i = 0; i < kid_ids.length; i++) {
        var kid_data = getKidData(kid_ids[i]);
        for (let k = 0; k < kid_data.length; k++) {
            $('#routes_table > tbody').append(
                    '<tr><td>' + kid_data[k]['name'] + '</td><td>' + getHourFormated(kid_data[k]['estimated_time'])
                            + '</td><td>' + kid_data[k]['street'] + '</td><td>' + kid_data[k]['country'] + '</td><td>'
                            + kid_data[k]['notes'] + '</td><td>' + kid_data[k]['stop'] + '</td><td>'
                            + kid_data[k]['route'] + '</td><td>' + kid_data[k]['manager'] + '</td></tr>');
        }
    }
}

/* Get kids data */
function getKidData(kid_id) {
    var all_kid_data = $('#student_routes > ul > li');
    var kid_data = [];
    all_kid_data.each(function() {
        if ($(this).find('p').eq(1).text().trim() == kid_id) {
            kid_data.push({
                'name' : $(this).find('p').eq(0).text().trim(),
                'estimated_time' : $(this).find('p').eq(2).text().trim(),
                'notes' : $(this).find('p').eq(3).text().trim(),
                'street' : $(this).find('p').eq(4).text().trim(),
                'country' : $(this).find('p').eq(5).text().trim(),
                'start_date' : $(this).find('p').eq(6).text().trim(),
                'end_date' : $(this).find('p').eq(7).text().trim(),
                'stop' : formatDisplayName($(this).find('p').eq(8).text().trim()),
                'route' : formatDisplayName($(this).find('p').eq(9).text().trim()),
                'manager' : $(this).find('p').eq(10).text().trim(),
            })
        }
    });
    return kid_data;
}

/* Get kids issue data */
function getKidIssueData(kid_id) {
    var all_kid_data = $('#student_route_support > ul > li');
    var kid_data = [];
    all_kid_data.each(function() {
        if ($(this).find('p').eq(1).text().trim() == kid_id) {
            kid_data.push({
                'name' : $(this).find('p').eq(0).text().trim(),
                'date' : $(this).find('p').eq(2).text().trim(),
                'type' : $(this).find('p').eq(3).text().trim(),
                'high_stop_name' : formatDisplayName($(this).find('p').eq(4).text().trim()),
                'high_stop_route_name' : formatDisplayName($(this).find('p').eq(5).text().trim()),
                'high_stop_direction' : $(this).find('p').eq(6).text().trim(),
                'low_stop_name' : formatDisplayName($(this).find('p').eq(7).text().trim()),
                'low_stop_route_name' : formatDisplayName($(this).find('p').eq(8).text().trim()),
                'low_stop_direction' : $(this).find('p').eq(9).text().trim(),
                'low_stop_type' : $(this).find('p').eq(11).text().trim(),
                'notes' : $(this).find('p').eq(10).text().trim(),
            })
        }
    });
    console.log(kid_data)
    return kid_data;
}

/* Fills table with kid data */
function createKidIssueTables(kid_ids) {
    for (let i = 0; i < kid_ids.length; i++) {
        var kid_data = getKidIssueData(kid_ids[i]);
        for (let k = 0; k < kid_data.length; k++) {
            $('#route_support_table > tbody').append(
                    '<tr><td>' + kid_data[k]['name'] + '</td><td>' + getHourFormated(kid_data[k]['date']) + '</td><td>'
                            + kid_data[k]['type'] + '</td><td>' + kid_data[k]['high_stop_name'] + '</td><td>'
                            + kid_data[k]['high_stop_route_name'] + '</td><td>' + kid_data[k]['high_stop_direction']
                            + '</td><td>' + kid_data[k]['low_stop_name'] + '</td><td>'
                            + kid_data[k]['low_stop_route_name'] + '</td><td>' + kid_data[k]['low_stop_direction']
                            + '</td><td>' + kid_data[k]['low_stop_type'] + '</td><td>' + kid_data[k]['notes']
                            + '</td></tr>');
        }
    }
}
