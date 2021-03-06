# Copyright (c) 2020 Adrian Revilla <adrianrevilla@avanzosc.es> - Avanzosc S.L.
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

{
    'name': 'Fleet Route Reports',
    'version': '12.0.1.0.0',
    "category": "Human Resources",
    'author':  "AvanzOSC",
    'license': "AGPL-3",
    'website': 'http://www.avanzosc.es',
    'depends': [
        'base',
        'fleet_route',
        'fleet_route_school',
        'fleet_route_support',
        'education_center_mail_template'
    ],
    'data': [
        'views/fleet_route_header_view.xml',
        'views/fleet_route_passenger_report_view.xml',
        'views/fleet_route_stop_report_view.xml',
        'views/fleet_route_issue_report_view.xml'
        ],
    'installable': True
}
