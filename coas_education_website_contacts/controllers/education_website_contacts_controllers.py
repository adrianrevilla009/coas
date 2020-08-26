
from odoo import http
from odoo.http import request
from odoo.addons.portal.controllers.portal import CustomerPortal


class CoasContacts(CustomerPortal):

    @http.route(['/contacts', '/contacts/<int:kid_id>', '/contacts/all'],
                type='http', auth="user", website=True)
    def contacts(self, kid_id=None):
        current_academic_year = self.get_current_academic_year()
        Education_group_student_report = request.env[
            'education.group.student.timetable.report']
        children = self.get_connected_users_children()
        values = {'kids': children}

        if kid_id is None:
            report_values = []
            number_rows_values = []
            number_report_values = []
            total_reports = 0
            for kid in values['kids']:
                student_report_ids = []
                student_report_ids += Education_group_student_report.sudo(
                    ).search([('student_id', '=', kid.id),
                              ('academic_year_id', 'in',
                               current_academic_year.ids)])
                total_reports += len(student_report_ids)
                r_number = len(student_report_ids) / 4
                if (not r_number.is_integer()):
                    r_number = int(r_number) + 1
                number_report_values.append(len(student_report_ids))
                report_values.append(student_report_ids)
                number_rows_values.append(int(r_number))

            values.update({'report_ids': report_values,
                           'n_rows': number_rows_values,
                           'n_reports': number_report_values,
                           'total_reports': total_reports})
            return http.request.render(
                'coas_education_website_contacts.coas_contacts_layout',
                values)
        else:
            student_report_ids = []
            selected_kid_id = request.env[
                'res.partner'].sudo().search([('id', '=', kid_id)])
            student_report_ids += Education_group_student_report.sudo().search(
                [('student_id', '=', selected_kid_id.id),
                 ('academic_year_id', 'in', current_academic_year.ids)])
            r_number = len(student_report_ids) / 4
            if (not r_number.is_integer()):
                r_number = int(r_number) + 1

            values.update({
                'selected_kid': selected_kid_id,
                'report_ids': student_report_ids,
                'number_rows': int(r_number)})
            return http.request.render(
                'coas_education_website_contacts.coas_contacts_layout',
                values)

    def get_kid_values(self, children, current_academic_year):
        values = super(CoasContacts, self).get_kid_values(
            children, current_academic_year)
        # teachers
        student_reports = request.env[
            'education.group.student.timetable.report'].sudo().search([
                ('student_id', 'in', children.ids),
                ('academic_year_id', 'in', current_academic_year.ids),
            ])
        contacts_count = len(student_reports.mapped("professor_id"))
        values.update({
            'number_of_contacts': contacts_count
            })
        return values
