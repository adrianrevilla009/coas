
from odoo import http
from odoo.http import request
from collections import Counter
from odoo.addons.portal.controllers.portal import CustomerPortal


class CoasIncidents(CustomerPortal):

    @http.route(['/incidents/<int:kid_id>', '/incidents/all'],
                type='http', auth="user", website=True)
    def incidents(self, kid_id=None):
        children = self.get_connected_users_children()
        assistence_incidence = request.env.ref(
            "issue_education.assistance_issue_type_master")
        issue_types = request.env['school.college.issue.type'].sudo().search([
            ('issue_type_id', '=', assistence_incidence.id)])

        values = {'kids': children,
                  'type': "Incidences"}
        kids = (values['kids'] if kid_id is None else
                request.env['res.partner'].sudo().browse(kid_id))
        negative_issue_ids = request.env['school.issue'].sudo().search([
            ('student_id', 'in', kids.ids),
            ('school_issue_type_id.issue_type_id.gravity_scale_id.gravity_scale',
             '<=', '0'),
            ('school_issue_type_id', 'not in', issue_types.ids)])
        positive_issue_ids = request.env['school.issue'].sudo().search([
            ('student_id', 'in', kids.ids),
            ('school_issue_type_id.issue_type_id.gravity_scale_id.gravity_scale',
             '>', '0')])
        students = positive_issue_ids.mapped('student_id')
        positive_issues = request.env['school.issue'].sudo()

        if students:
            for kid in students:
                assistances = positive_issue_ids.filtered(
                    lambda z: z.student_id.id == kid.id)
                dates = assistances.mapped('issue_date')
                for date in dates:
                    assistances = positive_issue_ids.filtered(
                        lambda z: z.student_id.id == kid.id and z.issue_date == date)
                    positive_issues += min(assistances, key=lambda x: x.id)
        students = negative_issue_ids.mapped('student_id')
        negative_issues = request.env['school.issue'].sudo()
        if students:
            for kid in students:
                assistances = negative_issue_ids.filtered(
                    lambda z: z.student_id.id == kid.id)
                dates = assistances.mapped('issue_date')
                for date in dates:
                    assistances = negative_issue_ids.filtered(
                        lambda z: z.student_id.id == kid.id and z.issue_date == date)
                    negative_issues += min(assistances, key=lambda x: x.id)

        count_positive_issues = Counter(positive_issues)
        count_negative_issues = Counter(negative_issues)
        values.update({
            'positive_issue_ids': list(set(positive_issues)),
            'negative_issue_ids': list(set(negative_issues)),
            'count_positive_issues': count_positive_issues.values(),
            'count_negative_issues': count_negative_issues.values()})
        if kid_id is not None:
            values['selected_kid'] = request.env[
                'res.partner'].sudo().browse(kid_id)
        return http.request.render(
            'coas_education_website_incidents.coas_incidents_layout', values)

    @http.route(['/assistences/<int:kid_id>', '/assistences/all'], type='http',
                auth="user", website=True)
    def assistences(self, kid_id=None):
        children = self.get_connected_users_children()
        assistence_incidence = request.env.ref(
            "issue_education.assistance_issue_type_master")
        issue_types = request.env['school.college.issue.type'].sudo().search([
            ('issue_type_id', '=', assistence_incidence.id)])

        values = {'kids': children,
                  'type': "Assistences"}
        kids = (values['kids'] if kid_id is None else
                request.env['res.partner'].sudo().browse(kid_id))
        assistence_issue_ids = request.env['school.issue'].sudo().search([
            ('student_id', 'in', kids.ids),
            ('school_issue_type_id', 'in', issue_types.ids)])

        students = assistence_issue_ids.mapped('student_id')
        assistances_issues = request.env['school.issue'].sudo()
        if students:
            for kid in students:
                assistances = assistence_issue_ids.filtered(
                    lambda z: z.student_id.id == kid.id)
                dates = assistances.mapped('issue_date')
                for date in dates:
                    assistances = assistence_issue_ids.filtered(
                        lambda z: z.student_id.id == kid.id and z.issue_date == date)
                    assistances_issues += min(assistances, key=lambda x: x.id)

        count_assistence_issues = Counter(assistances_issues)
        values.update({
            'assistence_issue_ids': list(set(assistances_issues)),
            'count_assistence_issues': count_assistence_issues.values()})
        if kid_id is not None:
            values['selected_kid'] = request.env[
                'res.partner'].sudo().browse(kid_id)
        return http.request.render(
            'coas_education_website_incidents.coas_incidents_layout', values)

    @http.route(['/claims/<int:kid_id>', '/claims/all'], type='http',
                auth="user", website=True)
    def claims(self, kid_id=None):
        children = self.get_connected_users_children()
        assistence_incidence = request.env.ref(
            "issue_education.assistance_issue_type_master")
        issue_types = request.env['school.college.issue.type'].sudo().search([
            ('issue_type_id', '=', assistence_incidence.id)])
        values = {'kids': children}

        if kid_id is None:
            school_claims = request.env['school.claim']
            school_assistence_claims = request.env['school.claim']
            for kid in values['kids']:
                school_claims += request.env[
                    'school.issue'].sudo().search([('student_id', '=', kid.id),
                                                   ('school_issue_type_id',
                                                    'not in', issue_types.ids)
                                                   ]).mapped("claim_id")
                school_assistence_claims += request.env[
                    'school.issue'].sudo().search([('student_id', '=', kid.id),
                                                   ('school_issue_type_id',
                                                    'in', issue_types.ids)
                                                   ]).mapped("claim_id")
            values.update({
                'claim_ids': school_claims,
                'assistence_claim_ids': school_assistence_claims,
                })
            return http.request.render(
                'coas_education_website_incidents.coas_claims_layout', values)
        else:
            kid = request.env['res.partner'].sudo().browse(kid_id)
            school_claims = request.env['school.issue'].sudo().search(
                [('student_id', '=', kid.id),
                 ('school_issue_type_id', 'not in', issue_types.ids)
                 ]).mapped("claim_id")
            school_assistence_claims = request.env[
                'school.issue'].sudo().search(
                [('student_id', '=', kid.id), ('school_issue_type_id', 'in',
                                               issue_types.ids)]).mapped(
                                                   "claim_id")
            values.update({
                'selected_kid': kid,
                'claim_ids': school_claims,
                'assistence_claim_ids': school_assistence_claims,
                })
            return http.request.render(
                'coas_education_website_incidents.coas_claims_layout', values)

    def get_kid_values(self, children, current_academic_year):
        values = super(CoasIncidents, self).get_kid_values(
            children, current_academic_year)
        # issues
        assistence_incidence = request.env.ref(
            "issue_education.assistance_issue_type_master")
        issue_types = request.env[
            'school.college.issue.type'].sudo().search([
                ('issue_type_id', '=', assistence_incidence.id)])
        assistence_issue_ids = request.env[
            'school.issue'].sudo().search([
                ('student_id', 'in', children.ids),
                ('school_issue_type_id', 'in', issue_types.ids)])
        negative_issue_ids = request.env[
            'school.issue'].sudo().search([
                ('student_id', 'in', children.ids),
                ('school_issue_type_id.issue_type_id.gravity_scale_id.gravity_scale',
                 '<=', '0'),
                ('school_issue_type_id', 'not in', issue_types.ids)])
        positive_issue_ids = request.env['school.issue'].sudo().search([
            ('student_id', 'in', children.ids),
            ('school_issue_type_id.issue_type_id.gravity_scale_id.gravity_scale',
             '>', '0')])
        students = assistence_issue_ids.mapped('student_id')
        assistances_issues = request.env['school.issue'].sudo()
        if students:
            for kid in students:
                assistances = assistence_issue_ids.filtered(
                    lambda z: z.student_id.id == kid.id)
                dates = assistances.mapped('issue_date')
                for date in dates:
                    assistances = assistence_issue_ids.filtered(
                        lambda z: z.student_id.id == kid.id and z.issue_date == date)
                    assistances_issues += min(assistances, key=lambda x: x.id)
        students = positive_issue_ids.mapped('student_id')
        positive_issues = request.env['school.issue'].sudo()
        if students:
            for kid in students:
                assistances = positive_issue_ids.filtered(
                    lambda z: z.student_id.id == kid.id)
                dates = assistances.mapped('issue_date')
                for date in dates:
                    assistances = positive_issue_ids.filtered(
                        lambda z: z.student_id.id == kid.id and z.issue_date == date)
                    positive_issues += min(assistances, key=lambda x: x.id)
        students = negative_issue_ids.mapped('student_id')
        negative_issues = request.env['school.issue'].sudo()
        if students:
            for kid in students:
                assistances = negative_issue_ids.filtered(
                    lambda z: z.student_id.id == kid.id)
                dates = assistances.mapped('issue_date')
                for date in dates:
                    assistances = negative_issue_ids.filtered(
                        lambda z: z.student_id.id == kid.id and z.issue_date == date)
                    negative_issues += min(assistances, key=lambda x: x.id)
        values.update({
            'number_of_issues': len(positive_issues) + len(negative_issues),
            'number_of_issues2': len(assistances_issues)
            })
        return values
