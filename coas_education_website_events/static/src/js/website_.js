$(document).ready(function() {
    "use strict";

    var url = window.location.href;
    if (url.includes('/event') && $('#left_column').length !== 0) {
    	$('#middle_column').prepend('<div id="event_filters" class="row justify-content-center"></div>');
    	generateEventFilters();
    	changeEventBagNumbers();
    	changeEventFilterData();
        /* Filtering events */
        document.getElementById("kid_filter").addEventListener("change", function() {
            changeEventFilterData();
        });
        document.getElementById("course_filter").addEventListener("change", function() {
            changeEventFilterData();
        });
        document.getElementById("level_filter").addEventListener("change", function() {
            changeEventFilterData();
        });
        document.getElementById("group_filter").addEventListener("change", function() {
            changeEventFilterData();
        });
    }
    
});

/* Changes the visibility of events according to filters */
function changeEventFilterData(){
	var filters_data = getEventFilterData();
	var event_ids = $('#middle_column > ul > li');
	event_ids.each(function() {
		if ($(this).css('display','none')){
			 $(this).css('display','block');
		}
	});
	event_ids.each(function() {
		if ($(this).css('display','block')){
			var event_id = $(this).find('#event_id').text().trim();
			var selected_event_data = getSelectedEventData(event_id);
			if(filters_data[0] != 'All kids'){
				var b = false;
				for (let i=0; i<selected_event_data['participants'].length; i++){
					if (selected_event_data['participants'][i]['kid_id'] == filters_data[0]){
						b = true;
					}
				}
				if (!b){
					$(this).css('display','none');
					return;
				}
			}
			
			if(filters_data[1] != 'All courses'){
				if (selected_event_data['course_id'] != filters_data[1]) {
					$(this).css('display','none');
					return;
				}
			}
			if(filters_data[2] != 'All levels'){
				if (selected_event_data['level_id'] != filters_data[2]) {
					$(this).css('display','none');
					return;
				}
			}
			if(filters_data[3] != 'All groups'){
				if (selected_event_data['group_id'] != filters_data[3]) {
					$(this).css('display','none');
					return;
				}
			}
		}
	});
	
	var kid_array = JSON.parse(window.localStorage.getItem("kid_array"));
	event_ids.each(function() {
		var event_id = $(this).find('#event_id').text().trim();
		var has_participant = checkEventParticipant(kid_array,getSelectedEventData(event_id));
		if (!has_participant){
			$(this).css('display','none');
		}
	});
	
}

/* Get filtering strings */
function getEventFilterData(){
	var filters_data = []
	filters_data[0] = document.getElementById("kid_filter").value;
	filters_data[1] = document.getElementById("course_filter").value;
	filters_data[2] = document.getElementById("level_filter").value;
	filters_data[3] = document.getElementById("group_filter").value;
	return filters_data;
}

/* Get event data by id */
function getSelectedEventData(event_id){
	var event_data = getEventData2();
	for(let i=0; i< event_data.length; i++){
		if (event_data[i]['event_id'] == event_id){
			return event_data[i];
		}
	}
}

/* Creates filtering select elements */
function generateEventFilters(){
	let div_select = document.getElementById("event_filters");
	let kid_select = document.createElement("select");
	let course_select = document.createElement("select");
	let level_select = document.createElement("select");
	let group_select = document.createElement("select");
	kid_select.setAttribute('id', 'kid_filter');
	course_select.setAttribute('id', 'course_filter');
	level_select.setAttribute('id', 'level_filter');
	group_select.setAttribute('id', 'group_filter');
	kid_select.setAttribute('class', 'form-control col-sm-2');
	course_select.setAttribute('class', 'form-control col-sm-2');
	level_select.setAttribute('class', 'form-control col-sm-2');
	group_select.setAttribute('class', 'form-control col-sm-2');
	div_select.appendChild(kid_select)
    div_select.appendChild(course_select)
	div_select.appendChild(level_select)
	div_select.appendChild(group_select)
	
	var event_ids = getEventData2();
	var kid_array = JSON.parse(window.localStorage.getItem("kid_array"));
	var event_students = []
	var event_courses = []
	var event_levels = []
	var event_groups = []
	for (let i = 0; i < event_ids.length; i++) {
		var b = true;
		for (let j = 0; j < event_ids[i]['participants'].length; j++) {
			if (!kid_array.includes(event_ids[i]['participants'][j]['kid_id'])){
				b = false;
				continue;
			}
		}
		
		if (b){
			for (let j = 0; j < event_ids[i]['participants'].length; j++) {
			 if (event_ids[i]['participants'][j]['kid_name']) {
			     event_students.push({
			         'kid_name': event_ids[i]['participants'][j]['kid_name'],
			         'kid_id': event_ids[i]['participants'][j]['kid_id'],
			        });
			 }
			}
			if (event_ids[i]['course_name']) {
			    event_courses.push({
			        'course_name': event_ids[i]['course_name'],
			        'course_id': event_ids[i]['course_id'],
			       });
			}
			if (event_ids[i]['level_name']) {
			    event_levels.push({
			        'level_name': event_ids[i]['level_name'],
			        'level_id': event_ids[i]['level_id'],
			       });
			}
			if (event_ids[i]['group_name']) {
			    event_groups.push({
			        'group_name': event_ids[i]['group_name'],
			        'group_id': event_ids[i]['group_id'],
			       });
			}
		}
	}

    event_students = event_students.reduce((res, item) =>
    (!res.find(({ kid_name, kid_id }) => kid_name == item.kid_name && kid_id == item.kid_id) ? res.push(item) : true, res), [])
	event_courses = event_courses.reduce((res, item) =>
    (!res.find(({ course_name, course_id }) => course_name == item.course_name && course_id == item.course_id) ? res.push(item) : true, res), [])
    event_levels = event_levels.reduce((res, item) =>
    (!res.find(({ level_name, level_id }) => level_name == item.level_name && level_id == item.level_id) ? res.push(item) : true, res), [])
    event_groups = event_groups.reduce((res, item) =>
    (!res.find(({ group_name, group_id }) => group_name == item.group_name && group_id == item.group_id) ? res.push(item) : true, res), [])

    kid_select.options[0] = new Option("All kids", "All kids");
    course_select.options[0] = new Option("All courses", "All courses");
    level_select.options[0] = new Option("All levels", "All levels");
    group_select.options[0] = new Option("All groups", "All groups");
    for (let i = 0; i < event_students.length; i++) {
    	kid_select.options[i+1] = new Option(event_students[i]['kid_name'], event_students[i]['kid_id']);
    }
    for (let i = 0; i < event_courses.length; i++) {
    	course_select.options[i+1] = new Option(event_courses[i]['course_name'], event_courses[i]['course_id']);
    }
    for (let i = 0; i < event_levels.length; i++) {
    	level_select.options[i+1] = new Option(event_levels[i]['level_name'], event_levels[i]['level_id']);
    }
    for (let i = 0; i < event_groups.length; i++) {
    	group_select.options[i+1] = new Option(event_groups[i]['group_name'], event_groups[i]['group_id']);
    }
    checkActiveKid();
    course_select.selectedIndex = 0;
    level_select.selectedIndex = 0;
    group_select.selectedIndex = 0;
    
}

/* Get all event data */
function getEventData2(){
	var event_ids = $('#website_calendar_events > ul > li');
	var events = [];
    event_ids.each(function(index) {
    	var participants = [];
        events.push({
            'event_id': $(this).find('#e_data_1').text().trim(),
            'course_name': $(this).find('#e_data_4').text().trim(),
            'level_name': $(this).find('#e_data_5').text().trim(),
            'group_name': $(this).find('#e_data_6').text().trim(),
            'event_name': $(this).find('#e_data_7').text().trim(),
            'event_participating': $(this).find('#e_data_8').text().trim(),
            'event_online': $(this).find('#e_data_9').text().trim(),
            'event_published': $(this).find('#e_data_10').text().trim(),
            'event_organizer_id': $(this).find('#e_data_11').text().trim(),
            'event_organizer_name': $(this).find('#e_data_12').text().trim(),
            'event_date_start': $(this).find('#e_data_13').text().trim(),
            'event_date_end': $(this).find('#e_data_14').text().trim(),
            'event_city': $(this).find('#e_data_15').text().trim(),
            'event_country': $(this).find('#e_data_16').text().trim(),
            'event_type': $(this).find('#e_data_17').text().trim(),
            'course_id': $(this).find('#e_data_18').text().trim(),
            'level_id': $(this).find('#e_data_19').text().trim(),
            'group_id': $(this).find('#e_data_20').text().trim(),
        });
        var participant_ids = $(this).find('ul').find('li');
        participant_ids.each(function() {
        	participants.push({
                'kid_id': $(this).find('p').eq(0).text().trim(),
                'kid_name': $(this).find('p').eq(1).text().trim(),
        	})
        });
        events[index]['participants'] = participants;
    });
    return events;
	
}

/* Checks active kid when main redirection */
function checkActiveKid(){
	var active_kid = window.localStorage.getItem("active_kid");
	if (active_kid == 'all'){
		document.getElementById('kid_filter').selectedIndex = 0;
	}else{
		var options = document.getElementById('kid_filter').options;
		for(let i=0; i<options.length; i++){
			if (options[i].value == active_kid){
				document.getElementById('kid_filter').selectedIndex = options[i].index;
			}
		}
	}
	window.localStorage.setItem("active_kid", "all");
}

/* Check if a event has any user kid as participant */
function checkEventParticipant(kid_ids, selected_event_id){
	var b = false;
	for (let i=0; i<kid_ids.length; i++){
		for (let j=0; j< selected_event_id['participants'].length; j++){
			if (kid_ids[i] == selected_event_id['participants'][j]['kid_id']){
				b = true;
			}
		}
	}
	return b;
}

/* Changes event period dates */
function changeEventBagNumbers() {
	var numbers = window.localStorage.getItem("event_numbers_array");
	if (!numbers){
		var event_numbers = getEventBagNumbers();
		window.localStorage.setItem("event_numbers_array", JSON.stringify(event_numbers));
		$('#left_column > ul > li:nth-child(1) > a > span').html(event_numbers['next_events']);
		$('#left_column > ul > li:nth-child(2) > a > span').html(event_numbers['today_events']);
		$('#left_column > ul > li:nth-child(3) > a > span').html(event_numbers['week_events']);
		$('#left_column > ul > li:nth-child(4) > a > span').html(event_numbers['nextweek_events']);
		$('#left_column > ul > li:nth-child(5) > a > span').html(event_numbers['month_events']);
		$('#left_column > ul > li:nth-child(6) > a > span').html(event_numbers['nextmonth_events']);
	}else{
		var event_numbers = JSON.parse(window.localStorage.getItem("event_numbers_array"));
		$('#left_column > ul > li:nth-child(1) > a > span').html(event_numbers['next_events']);
		$('#left_column > ul > li:nth-child(2) > a > span').html(event_numbers['today_events']);
		$('#left_column > ul > li:nth-child(3) > a > span').html(event_numbers['week_events']);
		$('#left_column > ul > li:nth-child(4) > a > span').html(event_numbers['nextweek_events']);
		$('#left_column > ul > li:nth-child(5) > a > span').html(event_numbers['month_events']);
		$('#left_column > ul > li:nth-child(6) > a > span').html(event_numbers['nextmonth_events']);
	}
	
}

/* Calculates event period dates */
function getEventBagNumbers(){
	var event_ids = $('#website_calendar_events > ul > li');
	var next_events = [], today_events = [], week_events = [], nextweek_events = [], month_events = [], nextmonth_events = [], past_events = []
	let today = new Date();
	var days_actual_week = getActualWeek();
	var days_next_week = getNextWeek(days_actual_week);
	var days_actual_month = getMonth(today.getMonth(), today.getFullYear());
	if (today.getMonth() != 11){
		var days_next_month = getMonth(today.getMonth()+1, today.getFullYear());
	}else{
		var days_next_month = getMonth(0, today.getFullYear()+1);
	}
	var today_formated = new Date().toISOString().slice(0, 10);
	if (today_formated.split('-')[1] != "11"){
		today_formated = today_formated.split('-')[0] + '-' +  (parseInt(today_formated.split('-')[1]) + 1).toString() + '-' + today_formated.split('-')[2]
	}else{
		today_formated = today_formated.split('-')[0] + '-' + '00' + '-' + (parseInt(today_formated.split('-')[2]) + 1).toString()
	}
	if (today_formated.split('-')[1].length == 1){
		today_formated = today_formated.split('-')[0] + '-0' + today_formated.split('-')[1] + '-' + today_formated.split('-')[2]
	}
	event_ids.each(function() {
		var event_id = $(this).find('#e_data_1').text().trim();
			var date_start = $(this).find('#e_data_13').text().trim();
			var date_end = $(this).find('#e_data_14').text().trim();
			date_start = new Date(date_start.split(' ')[0].split('-')[0],date_start.split(' ')[0].split('-')[1] , date_start.split(' ')[0].split('-')[2], date_start.split(' ')[1].split(':')[0], date_start.split(' ')[1].split(':')[1], date_start.split(' ')[1].split(':')[2],0);
			date_end = new Date(date_end.split(' ')[0].split('-')[0],date_end.split(' ')[0].split('-')[1] , date_end.split(' ')[0].split('-')[2], date_end.split(' ')[1].split(':')[0], date_end.split(' ')[1].split(':')[1], date_end.split(' ')[1].split(':')[2],0);
			
			var dates = [date_start.toISOString().slice(0, 10), date_end.toISOString().slice(0, 10), today_formated];
			// next events
			if (dates[1] > dates[2]) {
				next_events.push(event_id);
			}
			// today events
			if (dates[1] > dates[2] && dates[0] < dates[2]) {
				today_events.push(event_id);
			}
			// actual week events
			var days_between_dates = getDaysArray(date_start,date_end);
			var exists_in_actual_week = days_actual_week.some(r=> days_between_dates.includes(r));
			if (exists_in_actual_week) {
				week_events.push(event_id);
			}
			// next week events
			var exists_in_next_week = days_next_week.some(r=> days_between_dates.includes(r));
			if (exists_in_next_week) {
				nextweek_events.push(event_id);
			}
			// actual month events
			var exists_in_actual_month = days_actual_month.some(r=> days_between_dates.includes(r));
			if (exists_in_actual_month) {
				month_events.push(event_id);
			}
			// next month events
			var exists_in_next_month = days_next_month.some(r=> days_between_dates.includes(r));
			if (exists_in_next_month) {
				nextmonth_events.push(event_id);
			}
			// past events
			if (dates[1] < dates[2]) {
				past_events.push(event_id);
			}
		
	});
	var kid_array = JSON.parse(window.localStorage.getItem("kid_array"));
	event_ids.each(function() {
		var event_id = $(this).find('#e_data_1').text().trim();
		var has_participant = checkEventParticipant(kid_array,getSelectedEventData(event_id));
		if (!has_participant){
			next_events = next_events.filter(function(item) {
			    return item !== event_id
			})
			today_events = today_events.filter(function(item) {
			    return item !== event_id
			})
			week_events = week_events.filter(function(item) {
			    return item !== event_id
			})
			nextweek_events = nextweek_events.filter(function(item) {
			    return item !== event_id
			})
			month_events = month_events.filter(function(item) {
			    return item !== event_id
			})
			nextmonth_events = nextmonth_events.filter(function(item) {
			    return item !== event_id
			})
			past_events = past_events.filter(function(item) {
			    return item !== event_id
			})
		}
	});
	var numbers = {
			'next_events': next_events.length,
			'today_events': today_events.length,
			'week_events': week_events.length,
			'nextweek_events': nextweek_events.length,
			'month_events': month_events.length,
			'nextmonth_events': nextmonth_events.length,
			'past_events': past_events.length,
			}
	return numbers;
}

/* Get dates of given month */
function getMonth(month, year) {
	  var date = new Date(year, month, 1);
	  var days = [];
	  while (date.getMonth() === month) {
		var month_day = new Date(date).toISOString().slice(0, 10);
	    days.push(month_day);
	    date.setDate(date.getDate() + 1);
	  }
	  days = formatMonth(days);
	  days.shift();
	  var day = (parseInt(days[days.length-1].split('-')[2]) + 1).toString();
	  days[days.length] = days[days.length-1].split('-')[0] + '-' + days[days.length-1].split('-')[1] + '-' + day;
	  return days;
}

/* Get an array with dates between two given dates */
function getDaysArray(start, end) {
    for(var arr=[],dt=start; dt<=end; dt.setDate(dt.getDate()+1)){
        arr.push(new Date(dt).toISOString().slice(0, 10));
    }
    return arr;
};

/* Format month for odoo dates */
function formatMonth(days){
	for(let i=0;i<days.length;i++){
    	var month = (parseInt(days[i].split('-')[1]) + 1).toString();
    	if (month.length == 1){
    		month = "0" + month;
    	}
    	var day_formated = days[i].split('-')[0] + '-' + month + '-' +days[i].split('-')[2];
    	days[i] = day_formated;
    }
	return days;
}

/* Get dates of actual week */
function getActualWeek(){
	let curr = new Date ()
	let week = []
	let first = 0
	for (let i = 1; i <= 7; i++) {
		first = curr.getDate() - curr.getDay() + i
		let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
		week.push(day)
	}
	week = formatMonth(week);
	return week;	
}

/* Get dates of next week */
function getNextWeek(actual_week){
	var next_week_days = [];
	for(let i=0; i<actual_week.length;i++){
		var firstDay = new Date(actual_week[i]);
		var nextWeek = new Date(firstDay.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0,10);;
		next_week_days.push(nextWeek)
	}
	return next_week_days;
}
