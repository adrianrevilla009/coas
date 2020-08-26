# Copyright 2020 Adrian Revilla - AvanzOSC
# License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl.html).

from odoo import models


class CalendarEvents(models.Model):
    _name = 'calendar.event'
    _inherit = ['calendar.event', 'website.seo.metadata',
                'website.published.multi.mixin']
