
from odoo import fields, http
from odoo.http import request
from odoo.addons.portal.controllers.portal import CustomerPortal


class CoasMain(CustomerPortal):

    @http.route(['/main', '/main/<int:kid_id>'], type='http', auth="user",
                website=True)
    def main(self, kid_id=None):
        current_academic_year = self.get_current_academic_year()
        today = fields.Date.today()
        current_year = today.year
        current_month = today.month - 1
        children = self.get_connected_users_children()
        values = {
            'kids': children,
            'current_year': current_year,
            'current_month': current_month,
            'number_of_kids': len(children),
        }

        if kid_id:
            kid = request.env['res.partner'].sudo().browse(kid_id)
            values['selected_kid'] = kid
            values.update(self.get_kid_values(kid, current_academic_year))
        else:
            values.update(self.get_kid_values(children, current_academic_year))
        return http.request.render(
            'coas_education_website_main.coas_main_layout', values)

    def get_kid_values(self, children, current_academic_year):
        # invoice/orders
        invoices_count = request.env[
            'account.invoice'].sudo().search_count([
                ('partner_id.child_ids', 'in', children.ids),
                ])
        orders_count = request.env['sale.order'].sudo().search_count([
            ('child_id', 'in', children.ids),
            ('academic_year_id', 'in', current_academic_year.ids),
            ])
        # blogs
        news_count = request.env['blog.post'].sudo().search_count([])
        values = {
            'number_of_invoices': invoices_count,
            'number_of_orders': orders_count,
            'number_of_news': news_count,
            }
        return values

    def get_connected_users_children(self):
        connected_user_id = request.env.user
        Res_partner = request.env['res.partner']
        partner_ids = []
        if connected_user_id._is_superuser() or connected_user_id._is_admin():
            partner_ids = Res_partner.sudo().search([
                ('educational_category', '=', 'student')])
        else:
            if connected_user_id.partner_id.educational_category == 'student':
                partner_ids = Res_partner.sudo().search([
                    ('educational_category', '=', 'student'),
                    ('id', '=', connected_user_id.partner_id.id)])
            else:
                partner_ids = connected_user_id.partner_id.progenitor_child_ids
        return partner_ids

    def get_current_academic_year(self):
        return request.env['education.academic_year'].sudo().search(
            [('current', '=', True)])
