# -*- coding: utf-8 -*-
{
    'name': "Pos Propina Legal",

    'summary': """
        Agrega la funcionalidad de usar el 10% de ley, en el Punto de Venta""",

    'description': """
        Usar la propina legal en el Pos.
    """,

    'author': "Neotec",
    'website': "http://gruponeotec.com",
    'category': 'Neotec/Pos',
    'version': '0.1',

    # any module necessary for this one to work correctly
    'depends': ['base','point_of_sale'],

    # always loaded
    'data': [
        'data/products.xml',
        'views/views.xml',
        'views/templates.xml',
    ],
    'qweb': [
        'static/src/xml/custom_pos.xml',
    ],

    "installable": True,

}