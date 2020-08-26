
from odoo import http
from odoo.http import request
from odoo.addons.portal.controllers.portal import CustomerPortal


class CoasRoutes(CustomerPortal):

    @http.route(['/routes/<int:kid_id>', '/routes/all'],
                type='http', auth="user", website=True)
    def routes(self, kid_id=None):
        children = self.get_connected_users_children()
        Fleet_route_stop_passenger = request.env[
            'fleet.route.stop.passenger']
        values = {'kids': children}

        if kid_id is None:
            route_ids = Fleet_route_stop_passenger.sudo().search(
                [('partner_id', 'in', children.ids)])
            values.update({'route_ids': route_ids})
            return http.request.render(
                'coas_education_website_routes.coas_routes_layout', values)
        else:
            kid = request.env['res.partner'].sudo().browse(kid_id)
            route_ids = Fleet_route_stop_passenger.sudo().search(
                [('partner_id', '=', kid.id)])
            values.update({'route_ids': route_ids,
                           'selected_kid': kid})
            return http.request.render(
                'coas_education_website_routes.coas_routes_layout', values)

    @http.route(['/route_support/<int:kid_id>', '/route_support/all'],
                type='http', auth="user", website=True)
    def route_support(self, kid_id=None):
        children = self.get_connected_users_children()
        Fleet_route_support = request.env['fleet.route.support']
        values = {'kids': children}

        if kid_id is None:
            route_support_ids = Fleet_route_support.sudo().search(
                [('student_id', 'in', children.ids)])
            values.update({'route_support_ids': route_support_ids})
            return http.request.render(
                'coas_education_website_routes.coas_route_support_layout',
                values)
        else:
            kid = request.env['res.partner'].sudo().browse(kid_id)
            route_support_ids = Fleet_route_support.sudo().search(
                [('student_id', '=', kid.id)])
            values.update({'route_support_ids': route_support_ids,
                           'selected_kid': kid})
            return http.request.render(
                'coas_education_website_routes.coas_route_support_layout',
                values)

    def get_kid_values(self, children, current_academic_year):
        values = super(CoasRoutes, self).get_kid_values(
            children, current_academic_year)
        # routes
        routes_count = request.env[
            'fleet.route.stop.passenger'].sudo().search_count(
                [('partner_id', 'in', children.ids)])
        # route issues
        route_issues_count = request.env[
            'fleet.route.support'].sudo().search_count(
                [('student_id', 'in', children.ids)])
        values.update({
            'number_of_routes': routes_count,
            'number_of_issues3': route_issues_count
            })
        return values
