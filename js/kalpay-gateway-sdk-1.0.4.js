! function(e) {
    var t = function() {},
        n = null;
    const o = () => {
        (n = new WebSocket("wss://dev.ws.invoice.kalpayinc.com")).onmessage = (t => {
            const {
                data: n
            } = t;
            if (n) {
                const t = JSON.parse(n),
                    o = !!t.isTransactionComplete && t.isTransactionComplete;
                e.superSDK.modal_rpc.completeTransactionCllbk(o, null), o ? broadcast("PAYMENT_SUCCEEDED") : broadcast("PAYMENT_FAILED")
            }
        })
    };
    o();
    var s = (t = !0) => {
            var n = e.superSDK,
                o = document.querySelector(n.settings.triggerer || "#supersdk-container-button");
            o && (o.disabled = t)
        },
        i = function() {
            e.superSDK.easyXDM && (e.superSDK.modal_rpc = new e.superSDK.easyXDM.Rpc({
                remote: "https://dev.gateway.kalpayinc.com/",
                onReady: broadcast("IFRAME_CHECKOUT_LOADED"),
                container: "supersdk-container",
                props: {
                    style: {
                        opacity: "1",
                        height: "100%",
                        position: "relative",
                        background: "none",
                        display: "block",
                        border: "0 none transparent",
                        margin: "0px",
                        padding: "0px",
                        "z-index": "2"
                    },
                    allowpaymentrequest: "true",
                    allowtransparency: !0,
                    width: "100%",
                    height: "100%"
                }
            }, {
                remote: {
                    loadSettingsAndPayload: {},
                    payment_status: {},
                    initTransactionCllbk: {},
                    initCbTransactionCllbk: {},
                    completeTransactionCllbk: {}
                },
                local: {
                    hideModal: a,
                    proceedPayment: r,
                    initTransaction: p,
                    initCbTransaction: l,
                    completeTransaction: u
                }
            }), e.superSDK.promoteSettings = function(t) {
                e.superSDK.modal_rpc.loadSettingsAndPayload(e.superSDK.settings, e.superSDK.items, e.superSDK.operators, t)
            }, s(!1))
        },
        r = function(t, n) {
            e.superSDK.modal_rpc.payment_status("PAYMENT_PENDING"), scenario = n, setTimeout(() => {
                broadcast(scenario), broadcast(t), e.superSDK.modal_rpc.payment_status(scenario)
            }, 1500 * Math.random())
        },
        a = function() {
            var e = document.getElementById("supersdk-container");
            e && (e.style.display = "none");
            var t = e && e.getElementsByClassName("supersdk-backdrop")[0];
            t && (t.style.background = null), broadcast("CHECKOUT_IFRAME_CLOSED")
        };
    t.prototype.ON_SITE = "on_site", t.prototype.OFF_SITE = "off_site", t.prototype.DEFAULT_BG_COLOR = "#6926bf", t.prototype.MODAL_TEMPLATE = '<div id="supersdk-container" style="z-index: 1000000000; position: fixed; top: 0px; display: none; left: 0px; height: 100%; width: 100%; backface-visibility: hidden; overflow-y: visible;"><div class="supersdk-backdrop" style="min-height: 100%; transition: all 0.3s ease-out 0s; position: fixed; top: 0px; left: 0px; width: 100%; height: 100%;"></div></div>';
    var c = function(n) {
        t.script = $script.noConflict(), t.script("https://kalpay-gateway-resources.s3.us-east-2.amazonaws.com/v0/supersdk.templating.min.js", function() {
            ! function() {
                if (!e.superSDK.templating) return;
                var t = e.superSDK.templating.template(e.superSDK.MODAL_TEMPLATE)();
                document.body.insertAdjacentHTML("beforeend", t)
            }()
        }), t.script("https://kalpay-gateway-resources.s3.us-east-2.amazonaws.com/v0/supersdk.rpc.min.js", function() {
            e.superSDK.easyXDM && (e.superSDK.rpc = new e.superSDK.easyXDM.Rpc({
                remote: "https://dev.service-backend.kalpayinc.com/invoiceservice/tunnel/",
                onReady: broadcast("IFRAME_TUNNEL_LOADED")
            }, {
                remote: {
                    apiTunnel: {}
                }
            }), e.superSDK.api = function(t, n, o, s) {
                const i = localStorage.getItem("supersdk.token");
                e.superSDK.rpc.apiTunnel(t, n, o, location.host, i, s)
            }), i(), n()
        })
    };
    t.prototype.init = function(t, n) {
        c(function() {
            var o, s;
            o = t, s = n, e.superSDK.api("/auth/login", "POST", o, function(e) {
                const {
                    data: t,
                    error: n
                } = e;
                t ? localStorage.setItem("supersdk.token", t.data) : localStorage.removeItem("supersdk.token"), s(e)
            })
        }), t = t || {}, this.settings = {
            api_key: t.api_key || null,
            processMode: t.processMode || this.ON_SITE
        }, this.items = [], this.operators = [], this.listen("CHECKOUT_IFRAME_CLOSED", function() {
            e.superSDK.modal_rpc.payment_status(""), e.superSDK.modal_rpc.destroy(), i()
        }), this.listen("PAYMENT_SUCCEEDED", function() {
            var t = e.superSDK;
            setTimeout(() => {
                a(), t.settings.success_url && (e.location = t.settings.success_url)
            }, 3e3)
        }), this.listen("PAYMENT_FAILED", function() {
            var t = e.superSDK;
            setTimeout(() => {
                a(), t.settings.failed_url && (e.location = t.settings.failed_url)
            }, 3e3)
        })
    }, t.prototype.setup = function(e) {
        e = e || {}, this.settings = {
            ...this.settings,
            store_name: e.store_name || null,
            store_logo_url: e.store_logo_url || null,
            frame_color: e.frame_color || this.DEFAULT_BG_COLOR,
            triggerer: e.triggerer || null,
            taxes: e.taxes || []
        }, s(!0)
    };
    var p = t => {
            const s = localStorage.getItem("supersdk.invoice") ? JSON.parse(localStorage.getItem("supersdk.invoice"))._id : null;
            let i = {
                payment: {
                    ...t,
                    type: "Payment",
                    currency: "xof"
                },
                invoiceId: s
            };
            e.superSDK.api("/transaction/init", "POST", i, function(t) {
                const {
                    data: i,
                    error: r
                } = t;
                if (i) e.superSDK.modal_rpc.initTransactionCllbk(!0, null), n && (1 === n.readyState ? n.send(JSON.stringify({
                    event: "invoice",
                    data: s
                })) : (o(), n.onopen = (e => {
                    n.send(JSON.stringify({
                        event: "invoice",
                        data: s
                    }))
                })));
                else {
                    const t = JSON.parse(r);
                    e.superSDK.modal_rpc.initTransactionCllbk(!1, t.message || t.data)
                }
            })
        },
        l = t => {
            const s = localStorage.getItem("supersdk.invoice") ? JSON.parse(localStorage.getItem("supersdk.invoice"))._id : null;
            let i = {
                payment: {
                    ...t,
                    type: "Payment",
                    currency: "xof"
                },
                invoiceId: s
            };
            e.superSDK.api("/transaction/init_cb", "POST", i, function(t) {
                const {
                    data: i,
                    error: r
                } = t;
                if (i) e.superSDK.modal_rpc.initCbTransactionCllbk(i.data, null), n && (1 === n.readyState ? n.send(JSON.stringify({
                    event: "invoice",
                    data: s
                })) : (o(), n.onopen = (e => {
                    n.send(JSON.stringify({
                        event: "invoice",
                        data: s
                    }))
                })));
                else {
                    const t = JSON.parse(r);
                    e.superSDK.modal_rpc.initCbTransactionCllbk(!1, t.message || t.data)
                }
            })
        },
        u = t => {
            let n = {
                ...t,
                invoiceId: localStorage.getItem("supersdk.invoice") ? JSON.parse(localStorage.getItem("supersdk.invoice"))._id : null
            };
            e.superSDK.api("/transaction/complete", "POST", n, function(t) {
                const {
                    data: n,
                    error: o
                } = t;
                n ? e.superSDK.modal_rpc.completeTransactionCllbk(!0, null) : e.superSDK.modal_rpc.completeTransactionCllbk(!1, JSON.parse(o).data)
            })
        };
    t.prototype.proceed = function(t) {
        ! function() {
            var e = document.getElementById("supersdk-container");
            e && (e.style.display = "block");
            var t = e && e.getElementsByClassName("supersdk-backdrop")[0];
            t && (t.style.background = "rgba(0, 0, 0, 0.05)")
        }(), e.superSDK.promoteSettings(function(t) {
            ! function() {
                const t = {
                    items: []
                };
                t.description = `${e.superSDK.settings.store_name}'s invoice`, t.source = "Gateway", e.superSDK.items.map(e => t.items.push({
                    name: e.name,
                    description: e.description || e.name,
                    price: e.unit_price,
                    quantity: e.quantity
                })), e.superSDK.api("/invoice", "POST", t, function(e) {
                    const {
                        data: t,
                        error: n
                    } = e;
                    t ? (broadcast("INVOICE_CREATED"), localStorage.setItem("supersdk.invoice", JSON.stringify(t.data))) : (console.error(n), localStorage.removeItem("supersdk.invoice"))
                })
            }(), broadcast(t)
        })
    }, t.prototype.setOperators = function(e) {
        e = e || [], this.operators = ["Kalpay", ...e]
    }, t.prototype.addItem = function(e) {
        e = e || {}, this.items.push({
            name: e.name || null,
            description: e.description || null,
            unit_price: e.unit_price || 0,
            quantity: e.quantity || 0,
            item_photo: e.item_photo || null
        })
    }, t.prototype.setNavigation = function(e) {
        e = e || {}, this.settings = {
            ...this.settings,
            success_url: e.success_url,
            failed_url: e.failed_url,
            back_url: e.back_url
        }
    };
    var d = {};
    t.prototype.listen = function(e, t) {
        void 0 === d[e] && (d[e] = []), d[e].push(t)
    }, t.prototype.unlisten = function(e, t) {
        if (d[e])
            for (let t = 0; t < d[e].length; t++) {
                d[e][t].splice(t, 1);
                break
            }
    }, broadcast = function(e) {
        if (d[e])
            for (let t = 0; t < d[e].length; t++) {
                (0, d[e][t])()
            }
    };
    var m = e.superSDK;
    t.prototype.noConflict = function() {
        return e.superSDK = m, new t
    }, e.superSDK = new t
}(window),
function(e, t) {
    "function" == typeof define ? define(t) : "undefined" != typeof module ? module.exports = t() : this.$script = t()
}(0, function() {
    var e, t = this,
        n = document,
        o = n.getElementsByTagName("head")[0],
        s = /^https?:\/\//,
        i = t.$script,
        r = {},
        a = {},
        c = {},
        p = {},
        l = !1,
        u = "push",
        d = "readyState",
        m = "onreadystatechange";

    function f(e, t, n) {
        for (n = 0, j = e.length; n < j; ++n)
            if (!t(e[n])) return l;
        return 1
    }

    function y(e, t) {
        f(e, function(e) {
            return !t(e)
        })
    }

    function S(t, n, o) {
        t = t[u] ? t : [t];
        var i = n && n.call,
            l = i ? n : o,
            d = i ? t.join("") : n,
            m = t.length;

        function _(e) {
            return e.call ? e() : r[e]
        }

        function D() {
            if (!--m)
                for (var e in r[d] = 1, l && l(), c) f(e.split("|"), _) && !y(c[e], _) && (c[e] = [])
        }
        return setTimeout(function() {
            y(t, function(t) {
                if (p[t]) return d && (a[d] = 1), 2 == p[t] && D();
                p[t] = 1, d && (a[d] = 1), g(!s.test(t) && e ? e + t + ".js" : t, D)
            })
        }, 0), S
    }

    function g(e, t) {
        var s = n.createElement("script"),
            i = l;
        s.onload = s.onerror = s[m] = function() {
            s[d] && !/^c|loade/.test(s[d]) || i || (s.onload = s[m] = null, i = 1, p[e] = 2, t())
        }, s.async = 1, s.src = e, o.insertBefore(s, o.firstChild)
    }
    return !n[d] && n.addEventListener && (n.addEventListener("DOMContentLoaded", function e() {
        n.removeEventListener("DOMContentLoaded", e, l), n[d] = "complete"
    }, l), n[d] = "loading"), S.get = g, S.order = function(e, t, n) {
        ! function o(s) {
            s = e.shift(), e.length ? S(s, o) : S(s, t, n)
        }()
    }, S.path = function(t) {
        e = t
    }, S.ready = function(e, t, n) {
        e = e[u] ? e : [e];
        var o, s = [];
        return !y(e, function(e) {
            r[e] || s[u](e)
        }) && f(e, function(e) {
            return r[e]
        }) ? t() : (o = e.join("|"), c[o] = c[o] || [], c[o][u](t), n && n(s)), S
    }, S.noConflict = function() {
        return t.$script = i, this
    }, S
}), "function" == typeof window.superSDK_Async && window.superSDK_Async();