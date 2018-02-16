odoo.define('pos_legal_tip.pos', function (require) {
    "use strict";

    // var chrome = require('point_of_sale.chrome');
    // var screens = require('point_of_sale.screens');
    // var gui = require('point_of_sale.gui');
    // var PopupWidget = require('point_of_sale.popups');
    // var posModels = require('point_of_sale.models');
    // var Model = require('web.DataModel');
    // var core = require('web.core');
    // var formats = require('web.formats');

    // var _t = core._t;

    var gui = require('point_of_sale.gui');
    var chrome = require('point_of_sale.chrome');
    var core = require('web.core');
    var screens = require('point_of_sale.screens');
    var posModels = require('point_of_sale.models');
    var Model = require('web.DataModel');
    var formats = require('web.formats');
    var web_data = require('web.data');
    var QWeb = core.qweb;
    var framework = require('web.framework');
    var isChargingLegalTip = null;
    var actualTip = 0.0;
    var contador = 0;
    var tipProduct = null;
    var tipTotal;
    var printLegalTip;
    var totalOrder;
    var totalOrderWithTip;


    chrome.Chrome.include({

        loading_hide: function () {
            this._super();

            isChargingLegalTip = this.pos.config.activate_ley;
            printLegalTip = this.pos.config.activate_ley;

            if (!isChargingLegalTip) {
                $('#legalTip').hide();

            }


            if (isChargingLegalTip) {

                if (tipProduct === null) {

                    if (this.pos.config.tip_product_id) {
                        tipProduct = this.pos.db.get_product_by_id(this.pos.config.tip_product_id[0]);

                    } else {

                        this.gui.show_popup('error', {
                            'title': 'Error: Producto para 10% de Ley',
                            'body': 'No se ha seleccionado el producto para colocar 10% de Ley, por favor configurarlo.',
                            'cancel': function () {
                                this.gui.show_screen('products');
                            }
                        });
                    }



                }
            }




        }

    });

    screens.OrderWidget.include({

        renderElement: function (scrollbottom) {
            var self = this;
            this._super(scrollbottom);

            if (isChargingLegalTip != null) {
                if (!isChargingLegalTip) {
                    $('#legalTip').hide();

                }
                printLegalTip = true;
            }


        },
        //En esta parte cambia el impuesto
        update_summary: function () {

            var order = this.pos.get_order();
            if (!order.get_orderlines().length) {
                return;
            }

            var self = this;
            if (isChargingLegalTip) {
                var total = order ? order.get_total_with_tax() : 0;
                var taxes = order ? order.get_total_tax() : 0; // fixed to get only the tax
                var total_without_tax = order ? order.get_total_without_tax() : 0;
                var legalTip;

                legalTip = total_without_tax * 0.10;
                // totalOrder = this.format_currency(total_without_tax);
                tipTotal = legalTip;
                // totalOrderWithTip = this.format_currency(total);


                this.el.querySelector('.summary .total > .value').textContent = this.format_currency(total);
                this.el.querySelector('.summary .total .subentry .value').textContent = this.format_currency(taxes);
                this.el.querySelector('#legalTip > span').textContent = this.format_currency(legalTip);


            } else {

                this._super();
                var lTipE = $('#legalTip');
                if (lTipE) {
                    lTipE.remove();
                }

            }

        },

    });


    screens.PaymentScreenWidget.include({

        validate_order: function (force_validation) {

            if (this.order_is_valid(force_validation)) {
                var order = this.pos.get_order();

                if (printLegalTip) {
                    order.set_tip(tipTotal);
                }
                printLegalTip = false;

                this.finalize_validation();
            }
        }



    });




    // Change Order get_total_with_tax return if legal tip is enabled
    posModels.Order.prototype.get_total_with_tax = function () {

        if (isChargingLegalTip) {
            var subtotal = this.get_total_without_tax();
            var legalTip = neotec_interface_models.roundTo2(subtotal * 0.10);
            var total_with_tax = subtotal + this.get_total_tax();
            var total = total_with_tax + legalTip;

            if (!printLegalTip) {
                return this.get_total_without_tax() + this.get_total_tax();
            }

            return total;
            //return this.get_total_without_tax() + this.get_total_tax();
        }

        return this.get_total_without_tax() + this.get_total_tax();
    };






});