# Copyright 2020 Adrian  - AvanzOSC
# License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl.html).

from odoo import fields, models


class EventEvents(models.Model):
    _inherit = 'event.event'

    level_id = fields.Many2one(
        string='Education Level',
        comodel_name='education.level')
    course_id = fields.Many2one(
        string='Course',
        comodel_name='education.course')
    group_id = fields.Many2one(
        string='Education Group',
        comodel_name='education.group')
