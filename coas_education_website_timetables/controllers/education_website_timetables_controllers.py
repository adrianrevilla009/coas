
from odoo import http
from odoo.http import request
from datetime import date
from odoo.addons.portal.controllers.portal import CustomerPortal


class CoasTimetables(CustomerPortal):

    @http.route(['/timetables',
                 '/timetables/<int:kid_id>',
                 '/timetables/<int:kid_id>/calendar/<int:date_number>',
                 '/timetables/all/calendar/<int:date_number>'], type='http',
                auth="user", website=True)
    def timetables(self, kid_id=None, date_number=None):
        children = self.get_connected_users_children()
        current_year = date.today().year
        current_month = date.today().month - 1
        current_academic_year = self.get_current_academic_year()
        Education_group_student_timetable_report = request.env[
            'education.group.student.timetable.report']
        values = {'kids': children,
                  'current_year': current_year,
                  'current_month': current_month}

        if kid_id is None:
            if date_number is None:
                return http.request.render(
                    'coas_education_website_timetables.coas_timetables_layout',
                    values)
            else:
                timetables_ids = Education_group_student_timetable_report.sudo(
                    ).search([
                        ('student_id', 'in', children.ids),
                        ('academic_year_id', 'in', current_academic_year.ids),
                        ])
                values.update({'timetables_ids': timetables_ids})
                return http.request.render(
                    'coas_education_website_timetables.coas_timetables_layout',
                    values)
        else:
            selected_kid_id = request.env['res.partner'].sudo().browse(kid_id)
            timetables_ids = Education_group_student_timetable_report.sudo(
                ).search([
                    ('student_id', '=', selected_kid_id.id),
                    ('academic_year_id', 'in', current_academic_year.ids),
                    ])
            values.update({
                'timetables_ids': timetables_ids,
                'selected_kid': selected_kid_id})
            return http.request.render(
                'coas_education_website_timetables.coas_timetables_layout',
                values)

    def get_kid_values(self, children, current_academic_year):
        values = super(CoasTimetables, self).get_kid_values(
            children, current_academic_year)
        # timetables / classes
        timetables_count = request.env[
            'education.group.student.timetable.report'].sudo(
                ).search_count([
                    ('student_id', 'in', children.ids),
                    ('academic_year_id', 'in', current_academic_year.ids),
                    ])
        values.update({
            'number_of_timetables': timetables_count
            })
        return values
