   ////////////////////////////////////////////////////////////////////
    //                          css OBJECT
    // this is the object for inline css
    /////////////////////////////////////////////////////////////////////

    css = {
        addCSS: function () {
            try {
                if (!$u.hasContent($j('link[href*="jquery-ui.css"]'))) {
                    $j("<link>").appendTo("head").attr({
                        rel  : "stylesheet",
                        type : "text/css",
                        href : "https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.14/themes/smoothness/jquery-ui.css"
                    });
                }

                $j("<style type='text/css'>" + css.farbtastic + "</style>").appendTo("head");
                $j("<style type='text/css'>" + css.caap + "</style>").appendTo("head");
                return true;
            } catch (err) {
                con.error("ERROR in addCSS: " + err);
                return false;
            }
        },

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        caap: "#caap_div, #caap_top, #caap_topmin, #caap_playbuttondiv {-moz-border-radius: 5px; -webkit-border-radius: 5px; border-radius: 5px;}" +
              "#caap_top {text-align: left;}" +
              "#caap_div, #caap_top, .caap_ff, .ui-dialog-title {font-family: 'Lucida Grande', tahoma, verdana, arial, sans-serif;}" +
              ".caap_fs {font-size: 10px;}" +
              "#caap_div, #caap_top, .caap_fn, .ui-dialog-title, .ui-button-text, .ui-state-highlight {font-size: 11px;}" +
              ".ui-state-highlight {line-height: 10px;}" +
              ".caap_ww {width: 100%;}" +
              ".caap_w90 {width: 90%}" +
              ".caap_in {padding-left: 5%;}" +
              ".caap_ul {list-style-type: none; padding: 0px; margin: 0px; height: 11px; line-height: 10px;}" +
              ".caap_tl {text-align: left;}" +
              ".caap_tr {text-align: right;}" +
              ".caap_tc {text-align: center;}" +
              ".caap_table {width: 100%; border-collapse: collapse; border-spacing: 0px; font-size: 10px; text-align: left;}" +
              ".caap_caption {width: 100%; border-collapse: collapse; border-spacing: 0px; font-weight: bold;text-align: center;}" +
              ".sorting_asc {background: url(data:image/gif;base64," + image64['asc'] + ") no-repeat center right;}" +
              ".sorting_desc {background: url(data:image/gif;base64," + image64['desc'] + ") no-repeat center right;}" +
              ".sorting {background: url(data:image/gif;base64," + image64['bg'] + ") no-repeat center right;}" +
              ".sorting, .sorting_asc, .sorting_desc {font-size: 10px; font-weight: bold; text-align: left; cursor: pointer; * cursor: hand;}" +
              ".caap_table td, .odd, .even, .odd td, .even td {font-size: 10px; text-align: left;}",

        farbtastic: ".farbtastic {position: relative;}" +
                    ".farbtastic * {position: absolute; cursor: crosshair;}" +
                    ".farbtastic, .farbtastic .wheel {width: 195px; height: 195px;}" +
                    ".farbtastic .color, .farbtastic .overlay {top: 47px; left: 47px; width: 101px; height: 101px;}" +
                    ".farbtastic .wheel {background: url(data:image/png;base64," + image64['wheel'] + ") no-repeat; width: 195px; height: 195px;}" +
                    ".farbtastic .overlay {background: url(data:image/png;base64," + image64['mask'] + ") no-repeat;}" +
                    ".farbtastic .marker {width: 17px; height: 17px; margin: -8px 0 0 -8px; overflow: hidden; background: url(data:image/png;base64," + image64['marker'] + ") no-repeat;}"
        /*jslint sub: false */
    };
