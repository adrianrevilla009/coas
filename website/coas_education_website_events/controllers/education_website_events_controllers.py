
from odoo import http
from odoo.http import request
from datetime import date, datetime
from odoo.addons.portal.controllers.portal import CustomerPortal


class CoasCalendarEvents(CustomerPortal):
    _inherit = ['mail.thread']

    @http.route(['/meetings/<int:kid_id>/calendar/<int:date_number>',
                 '/meetings/all/calendar/<int:date_number>',
                 '/meetings_accept/<int:kid_id>/<int:meeting_id>',
                 '/meetings_accept/all/<int:meeting_id>',
                 '/meetings_change/<int:kid_id>/<int:meeting_id>/<string:date_text>/<string:time_text>',
                 '/meetings_change/all/<int:meeting_id>/<string:date_text>/<string:time_text>'],
                 type='http', auth="user", website=True)
    def meetings(self, kid_id=None, date_number=None, meeting_id=None,
                 date_text=None, time_text=None):
        children = self.get_connected_users_children()
        current_year = date.today().year
        current_month = date.today().month - 1
        current_academic_year = self.get_current_academic_year()
        Calendar_event = request.env['calendar.event']
        values = {'kids': children,
                  'current_year': current_year,
                  'current_month': current_month}

        if meeting_id:
            event = Calendar_event.sudo().search(
                [('id', '=', meeting_id)])
            if date_text and time_text:
                date_ = date_text.replace('_', '-')
                time = time_text.replace('_', ':') + ":00"
                start_date = str(event.start_datetime).split(" ")[0]
                start_time = str(event.start_datetime).split(" ")[1]
                stop_date = str(event.stop_datetime).split(" ")[0]
                stop_time = str(event.stop_datetime).split(" ")[1]
                diference = datetime(int(start_date.split("-")[0]),
                                     int(start_date.split("-")[1]),
                                     int(start_date.split("-")[2]),
                                     int(start_time.split(":")[0]),
                                     int(start_time.split(":")[1]),
                                     int(start_time.split(":")[2])) - datetime(
                                         int(stop_date.split("-")[0]),
                                         int(stop_date.split("-")[1]),
                                         int(stop_date.split("-")[2]),
                                         int(stop_time.split(":")[0]),
                                         int(stop_time.split(":")[1]),
                                         int(stop_time.split(":")[2]))
                inserted_date = datetime(int(date_.split("-")[0]),
                                         int(date_.split("-")[1]),
                                         int(date_.split("-")[2]),
                                         int(time.split(":")[0]),
                                         int(time.split(":")[1]),
                                         int(time.split(":")[2]))
                event.sudo().write({
                    'stop_datetime': (inserted_date - diference),
                    'start_datetime': date_ + " " + time})
                msg_body_html = "<p>Meeting date changed to: " + str(
                    inserted_date) + "</p>"
                msg_body = "Meeting date changed to: " + str(
                    inserted_date)
            else:
                event.sudo().write({'state': 'open'})
                msg_body_html = "<p>Meeting confirmed !</p>"
                msg_body = "Meeting confirmed !"
            event.message_post(body=msg_body_html)
            mail_pool = request.env['mail.mail']
            for follower in event.message_follower_ids:
                mail_values = {
                    'subject': 'Calendar event change',
                    'email_to': follower.partner_id.email,
                    'body_html': msg_body_html,
                    'model': 'calendar.event',
                    'res_id': event.id,
                    'body': msg_body}
                msg_id = mail_pool.sudo().create(mail_values)
                if msg_id:
                    mail_pool.sudo().send([msg_id])

        if kid_id is None:
            education_event_ids = Calendar_event.sudo().search([
                ('website_published', '=', True),
                ('supervised_year_id.school_year_id', 'in',
                 current_academic_year.ids),
                ('student_id', 'in', values['kids'].ids)])
            values.update({'education_event_ids': education_event_ids})
            return http.request.render(
                'coas_education_website_events.coas_events_layout', values)
        else:
            kid = request.env['res.partner'].sudo().browse(kid_id)
            education_event_ids = Calendar_event.sudo().search([
                ('website_published', '=', True),
                ('supervised_year_id.school_year_id', 'in',
                 current_academic_year.ids),
                ('student_id', '=', kid.id)])
            values.update({
                'selected_kid': kid,
                'education_event_ids': education_event_ids})
            return http.request.render(
                'coas_education_website_events.coas_events_layout',
                values)

    def get_kid_values(self, children, current_academic_year):
        values = super(CoasCalendarEvents, self).get_kid_values(
            children, current_academic_year)
        # education events
        education_events_count = request.env[
            'calendar.event'].sudo().search_count(
                [('website_published', '=', True),
                 ('supervised_year_id.school_year_id', 'in',
                  current_academic_year.ids),
                 ('student_id', 'in', children.ids)])
        # events
        events_count = request.env[
            'event.event'].sudo().search_count(
                [('registration_ids.partner_id', 'in', children.ids)])
        values.update({
            'number_of_events': education_events_count,
            'number_of_events2': events_count
            })
        return values
