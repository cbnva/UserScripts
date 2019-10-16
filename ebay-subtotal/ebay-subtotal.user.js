// ==UserScript==
// @name         eBay Subtotal
// @version      0.1
// @description  Add a real subtotal to eBay Order Details print view
// @author       Jeremy Lee
// @match        https://www.ebay.com/vod/FetchOrderDetails*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var waitForEl = function(selector, callback) {
        if (jQuery(selector).length) {
            callback();
        } else {
            setTimeout(function() {
                waitForEl(selector, callback);
            }, 100);
        }
    };
    waitForEl('#orderCost_itemSubtotal_print', function(){
        function parseElementFloat(elementID) {
            var element = document.getElementById(elementID);
            if(!element) {
                return 0;
            }
            var text = element.innerText;
            text = text.replace("$","").replace(",","");
            if(!text || text.toLowerCase== "free") {
                return 0;
            }
            return parseFloat(text);
        }

        var itemCost = parseElementFloat('orderCost_itemSubtotal_print');
        var shipping = parseElementFloat('orderCost_shippingHandling_print');
        var discount = parseElementFloat('orderCost_itemDiscount_print');
        var discount2 = parseElementFloat('orderCost_incentives_print');
        var subtotal = itemCost + shipping + discount + discount2;

        var subtotalLabel = document.getElementById('orderCost_itemSubtotal_print').previousElementSibling;
        subtotalLabel.innerHTML = 'Item Total';

        var subtotalAfterSibling = document.getElementById('orderCost_refund_print');
        if(!subtotalAfterSibling) {
            subtotalAfterSibling = document.getElementById('orderCost_gst_print');
        }
        //debugger;
        $('<tr><td style="text-decoration: underline;">Subtotal</td><td style="text-decoration: underline; font-weight: bold;">$' + subtotal.toFixed(2) + '</td></tr>', subtotalAfterSibling).insertBefore(subtotalAfterSibling.parentElement);
    });
})();
