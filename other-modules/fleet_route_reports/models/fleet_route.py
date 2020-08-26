# Copyright 2020 Adrian Revilla - AvanzOSC
# License AGPL-3 - See http://www.gnu.org/licenses/agpl-3.0.html
from odoo import models, api


class FleetRoute(models.Model):
    _inherit = 'fleet.route'

    @api.multi
    def _get_report_base_filename(self):
        self.ensure_one()
        return self.display_name

    @api.multi
    def _get_route_passenger_issues(self, student_id, route_id, issue_type):
        self.ensure_one()
        Fleet_route_support = self.env['fleet.route.support']
        if issue_type == 'high':
            return Fleet_route_support.sudo().search_count(
                [('high_stop_route_id', '=', route_id),
                 ('student_id', '=', student_id),
                 ('type', '=', 'high')])
        elif issue_type == 'low':
            return Fleet_route_support.sudo().search_count(
                [('low_stop_route_id', '=', route_id),
                 ('student_id', '=', student_id),
                 ('type', '=', 'low')])
        elif issue_type == 'change':
            return Fleet_route_support.sudo().search_count(
                ['|', ('low_stop_route_id', '=', route_id),
                 ('high_stop_route_id', '=', route_id),
                 ('student_id', '=', student_id),
                 ('type', '=', 'change')])
        else:
            return (Fleet_route_support.sudo().search_count(
                [('high_stop_route_id', '=', route_id),
                 ('student_id', '=', student_id),
                 ('type', '=', 'high')]) +
                Fleet_route_support.sudo().search_count(
                [('low_stop_route_id', '=', route_id),
                 ('student_id', '=', student_id),
                 ('type', '=', 'low')]) +
                Fleet_route_support.sudo().search_count(
                ['|', ('low_stop_route_id', '=', route_id),
                 ('high_stop_route_id', '=', route_id),
                 ('student_id', '=', student_id),
                 ('type', '=', 'change')]))
