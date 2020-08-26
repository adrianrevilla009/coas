
from odoo import fields, http
from odoo.http import request
from datetime import date
from odoo.addons.portal.controllers.portal import CustomerPortal


class CoasExamTasks(CustomerPortal):

    @http.route(['/tasks/<int:kid_id>',
                 '/tasks/all'
                 ], type='http', auth="user",
                website=True)
    def tasks(self, kid_id=None):
        current_year = date.today().year
        current_month = date.today().month - 1
        children = self.get_connected_users_children()
        current_academic_year = self.get_current_academic_year()
        Education_group_homework_report = request.env[
            'education.group.homework.report']
        values = {'kids': children,
                  'current_year': current_year,
                  'current_month': current_month}

        if kid_id is None:
            # tasks
            record_task_ids = Education_group_homework_report.sudo().search([
                ('student_id', 'in', children.ids),
                ('academic_year_id', 'in', current_academic_year.ids),
                ])
            values.update({
                'record_task_ids': record_task_ids})
            return http.request.render(
                'coas_education_website_exam_tasks.coas_task_layout',
                values)
        else:
            selected_kid_id = request.env[
                'res.partner'].sudo().search([('id', '=', kid_id)])
            # tasks
            record_task_ids = Education_group_homework_report.sudo().search([
                ('student_id', '=', selected_kid_id.id),
                ('academic_year_id', 'in', current_academic_year.ids),
                ])
            values.update({
                'selected_kid': selected_kid_id,
                'record_task_ids': record_task_ids})
            return http.request.render(
                'coas_education_website_exam_tasks.coas_task_layout', values)

    @http.route(['/exams/<int:kid_id>',
                 '/exams/<int:kid_id>/calendar/<int:date_number>',
                 '/exams/all/calendar/<int:date_number>'
                 ], type='http', auth="user",
                website=True)
    def exams(self, kid_id=None, date_number=None):
        current_year = date.today().year
        current_month = date.today().month - 1
        children = self.get_connected_users_children()
        Education_record = request.env['education.record']
        values = {'kids': children,
                  'current_year': current_year,
                  'current_month': current_month}

        if kid_id is None:
            # exams
            record_exam_ids = Education_record.sudo().search([
                ('student_id', 'in', children.ids),
                ('exam_id', '!=', False),
                ('date', '>=', fields.Date.today()),
            ])
            values.update({
                'record_exam_ids': record_exam_ids})
            return http.request.render(
                'coas_education_website_exam_tasks.coas_exam_layout', values)
        else:
            selected_kid_id = request.env[
                'res.partner'].sudo().search([('id', '=', kid_id)])
            # exams
            record_exam_ids = Education_record.sudo().search([
                ('student_id', '=', selected_kid_id.id),
                ('exam_id', '!=', False),
                ('date', '>=', fields.Date.today()),
            ])
            print(record_exam_ids)
            values.update({
                'selected_kid': selected_kid_id,
                'record_exam_ids': record_exam_ids})
            return http.request.render(
                'coas_education_website_exam_tasks.coas_exam_layout', values)

    def get_kid_values(self, children, current_academic_year):
        values = super(CoasExamTasks, self).get_kid_values(
            children, current_academic_year)
        # exams and homeworks
        record_exams_count = request.env[
            'education.record'].sudo().search_count([
                ('student_id', 'in', children.ids),
                ('exam_id', '!=', False),
                ('date', '>=', fields.Date.today()),
                ])
        record_tasks_count = request.env[
            'education.group.homework.report'].sudo().search_count([
                ('student_id', 'in', children.ids),
                ('academic_year_id', 'in', current_academic_year.ids),
            ])
        values.update({
            'number_of_tasks': record_tasks_count,
            'number_of_exams': record_exams_count
            })
        return values
