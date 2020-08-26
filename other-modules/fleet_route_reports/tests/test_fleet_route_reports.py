# Copyright 2020 Adrian Revilla - AvanzOSC
# License AGPL-3 - See http://www.gnu.org/licenses/agpl-3.0.html
from odoo.tests import common


@common.at_install(False)
@common.post_install(True)
class TestFleetRouteReports(common.SavepointCase):

    @classmethod
    def setUpClass(cls):
        super(TestFleetRouteReports, cls).setUpClass()
        cls.fleet_route_model = cls.env['fleet.route']
        cls.fleet_route_name_model = cls.env['fleet.route.name']
        cls.fleet_route_stop_model = cls.env['fleet.route.stop']
        cls.fleet_route_support_model = cls.env['fleet.route.support']
        cls.fleet_route_stop_passenger_model = cls.env[
            'fleet.route.stop.passenger']
        cls.res_partner_model = cls.env['res.partner']

        cls.res_partner_1 = cls.res_partner_model.create({
            'firstname': 'Partner',
            'lastname': 'For',
            'lastname2': 'Route',
            'educational_category': 'student'
        })
        cls.fleet_route_name_1 = cls.fleet_route_name_model.create({
            'name': 'Fleet route name 1'
        })
        cls.fleet_route_1 = cls.fleet_route_model.create({
            'name_id': cls.fleet_route_name_1.id
        })
        cls.fleet_route_stop_1 = cls.fleet_route_stop_model.create({
            'name': 'Fleet route stop 1',
            'route_id': cls.fleet_route_1.id
        })
        cls.fleet_route_stop_passenger_1 = (
            cls.fleet_route_stop_passenger_model.create({
                'stop_id': cls.fleet_route_stop_1.id,
                'partner_id': cls.res_partner_1.id
                }))
        cls.fleet_route_support_1 = cls.fleet_route_support_model.create({
            'student_id': cls.res_partner_1.id,
            'type': 'high',
            'high_stop_id': cls.fleet_route_stop_1.id
        })
        cls.fleet_route_support_2 = cls.fleet_route_support_model.create({
            'student_id': cls.res_partner_1.id,
            'type': 'low',
            'low_stop_id': cls.fleet_route_stop_1.id
        })
        cls.fleet_route_support_3 = cls.fleet_route_support_model.create({
            'student_id': cls.res_partner_1.id,
            'type': 'change',
            'high_stop_id': cls.fleet_route_stop_1.id,
            'low_stop_id': cls.fleet_route_stop_1.id
        })

    def test_fleet_route_reports(self):
        self.fleet_route_1._get_report_base_filename()
        number_high_issues = (
            self.fleet_route_1._get_route_passenger_issues(
                self.res_partner_1.id, self.fleet_route_1.id, 'high'))
        number_low_issues = (
            self.fleet_route_1._get_route_passenger_issues(
                self.res_partner_1.id, self.fleet_route_1.id, 'low'))
        number_change_issues = (
            self.fleet_route_1._get_route_passenger_issues(
                self.res_partner_1.id, self.fleet_route_1.id, 'change'))
        number_total_issues = (
            self.fleet_route_1._get_route_passenger_issues(
                self.res_partner_1.id, self.fleet_route_1.id, 'total'))
        self.assertEquals(number_high_issues, 1)
        self.assertEquals(number_low_issues, 1)
        self.assertEquals(number_change_issues, 1)
        self.assertEquals(number_total_issues, 3)
