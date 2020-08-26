
from odoo import http
from odoo.http import request
from odoo.addons.portal.controllers.portal import CustomerPortal


class CoasCalifications(CustomerPortal):

    @http.route(['/califications/<int:kid_id>', '/califications/all'],
                type='http', auth="user", website=True)
    def califications(self, kid_id=None):
        current_academic_year = self.get_current_academic_year()
        children = self.get_connected_users_children()
        Education_record = request.env['education.record']
        values = {'kids': children}

        if kid_id is None:
            education_record_ids = Education_record.sudo().search(
                [('student_id', 'in', children.ids),
                 ('academic_year_id', 'in', current_academic_year.ids)])
            values.update({
                'education_record_ids': education_record_ids})
            return http.request.render(
                'coas_education_website_califications.coas_califications_layout',
                values)
        else:
            kid = request.env['res.partner'].sudo().browse(kid_id)
            education_record_ids = Education_record.sudo().search([
                ('student_id', '=', kid.id),
                ('academic_year_id', 'in', current_academic_year.ids),
                ])
            values.update({
                'selected_kid': kid,
                'education_record_ids': education_record_ids})
            return http.request.render(
                'coas_education_website_califications.coas_califications_layout',
                values)

    def get_kid_values(self, children, current_academic_year):
        values = super(CoasCalifications, self).get_kid_values(
            children, current_academic_year)
        # califications / academic report
        records_count = request.env[
            'education.record'].sudo().search_count([
                ('student_id', 'in', children.ids),
                ('academic_year_id', 'in', current_academic_year.ids),
                ])
        values.update({
            'number_of_records': records_count
            })
        return values
