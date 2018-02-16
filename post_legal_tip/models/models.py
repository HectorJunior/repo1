# -*- coding: utf-8 -*-

from odoo import models, fields, api


# from ..controllers import server
class FiscalPosConfig(models.Model):

    _inherit = ['pos.config']
    
    activate_ley = fields.Boolean(
        string = u'10% de Ley',
    )

