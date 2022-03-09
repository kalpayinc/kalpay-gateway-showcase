! function(e) {
    var t = function() {},
        n = null;
    const o = () => {
        const t = "https:" === e.location.protocol ? "wss://" : "ws://";
        (n = new WebSocket(`${t}dev.ws.invoice.kalpayinc.com`)).onmessage = (t => {
            const {
                data: n
            } = t;
            if (n) {
                const t = JSON.parse(n),
                    o = !!t.isTransactionComplete && t.isTransactionComplete;
                e.superSDK.modal_rpc.completeTransactionCllbk(o, null)
            }
        })
    };
    o();
    var s = function() {
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
                    completeTransactionCllbk: {}
                },
                local: {
                    hideModal: i,
                    proceedPayment: r,
                    initTransaction: c,
                    completeTransaction: p
                }
            }), e.superSDK.promoteSettings = function(t) {
                e.superSDK.modal_rpc.loadSettingsAndPayload(e.superSDK.settings, e.superSDK.items, e.superSDK.operators, t)
            })
        },
        r = function(t, n) {
            e.superSDK.modal_rpc.payment_status("PAYMENT_PENDING"), scenario = n, setTimeout(() => {
                broadcast(scenario), broadcast(t), e.superSDK.modal_rpc.payment_status(scenario)
            }, 1500 * Math.random())
        },
        i = function() {
            var e = document.getElementById("supersdk-container");
            e && (e.style.display = "none");
            var t = e && e.getElementsByClassName("supersdk-backdrop")[0];
            t && (t.style.background = null), broadcast("CHECKOUT_IFRAME_CLOSED")
        };
    t.prototype.ON_SITE = "on_site", t.prototype.OFF_SITE = "off_site", t.prototype.DEFAULT_BG_COLOR = "#6926bf", t.prototype.MODAL_TEMPLATE = '<div id="supersdk-container" style="z-index: 1000000000; position: fixed; top: 0px; display: none; left: 0px; height: 100%; width: 100%; backface-visibility: hidden; overflow-y: visible;"><div class="supersdk-backdrop" style="min-height: 100%; transition: all 0.3s ease-out 0s; position: fixed; top: 0px; left: 0px; width: 100%; height: 100%;"></div></div>';
    var a = function(n) {
        t.script = $script.noConflict(), t.script("https://kalpay-gateway-resources.s3.us-east-2.amazonaws.com/v0/supersdk.templating.js", function() {
            ! function() {
                if (!e.superSDK.templating) return;
                var t = e.superSDK.templating.template(e.superSDK.MODAL_TEMPLATE)();
                document.body.insertAdjacentHTML("beforeend", t)
            }()
        }), t.script("https://kalpay-gateway-resources.s3.us-east-2.amazonaws.com/v0/supersdk.rpc.js", function() {
            e.superSDK.easyXDM && (e.superSDK.rpc = new e.superSDK.easyXDM.Rpc({
                remote: "https://dev.service-backend.kalpayinc.com/invoiceservice/tunnel/",
                onReady: broadcast("IFRAME_TUNNEL_LOADED")
            }, {
                remote: {
                    apiTunnel: {}
                }
            }), e.superSDK.api = function(t, n, o, s) {
                const r = localStorage.getItem("supersdk.token");
                e.superSDK.rpc.apiTunnel(t, n, o, location.host, r, s)
            }), s(), e.superSDK.easyXDM && (e.superSDK.app_rpc = new e.superSDK.easyXDM.Rpc({
                remote: "https://dev.gateway.kalpayinc.com/",
                onReady: broadcast("APP_GATEWAY_LOADED")
            }, {
                remote: {
                    alertTest: {}
                }
            })), n()
        })
    };
    t.prototype.init = function(t, n) {
        a(function() {
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
            e.superSDK.modal_rpc.payment_status(""), e.superSDK.modal_rpc.destroy(), s()
        }), this.listen("PAYMENT_SUCCEEDED", function() {
            var t = e.superSDK;
            setTimeout(() => {
                i(), t.settings.success_url && (e.location = t.settings.success_url)
            }, 1e3)
        }), this.listen("PAYMENT_FAILED", function() {
            var t = e.superSDK;
            setTimeout(() => {
                i(), t.settings.failed_url && (e.location = t.settings.failed_url)
            }, 1e3)
        })
    }, t.prototype.setup = function(e) {
        e = e || {}, this.settings = {
            ...this.settings,
            store_name: e.store_name || null,
            store_logo_url: e.store_logo_url || null,
            frame_color: e.frame_color || this.DEFAULT_BG_COLOR,
            triggerer: e.triggerer || null,
            taxes: e.taxes || []
        }
    };
    var c = t => {
            const s = localStorage.getItem("supersdk.invoice") ? JSON.parse(localStorage.getItem("supersdk.invoice"))._id : null;
            let r = {
                payment: {
                    ...t,
                    type: "Payment",
                    currency: "xof"
                },
                invoiceId: s
            };
            e.superSDK.api("/transaction/init", "POST", r, function(t) {
                const {
                    data: r,
                    error: i
                } = t;
                if (r) e.superSDK.modal_rpc.initTransactionCllbk(!0, null), n && 1 === n.readyState ? n.send(JSON.stringify({
                    event: "invoice",
                    data: s
                })) : (o(), n.send(JSON.stringify({
                    event: "invoice",
                    data: s
                }))), console.log("is ws_client up : ", n && 1 === n.readyState);
                else {
                    const t = JSON.parse(i);
                    e.superSDK.modal_rpc.initTransactionCllbk(!1, t.message || t.data)
                }
            })
        },
        p = t => {
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
    var u = {};
    t.prototype.listen = function(e, t) {
        void 0 === u[e] && (u[e] = []), u[e].push(t)
    }, t.prototype.unlisten = function(e, t) {
        if (u[e])
            for (let t = 0; t < u[e].length; t++) {
                u[e][t].splice(t, 1);
                break
            }
    }, broadcast = function(e) {
        if (u[e])
            for (let t = 0; t < u[e].length; t++) {
                (0, u[e][t])()
            }
    };
    var l = e.superSDK;
    t.prototype.noConflict = function() {
        return e.superSDK = l, new t
    }, e.superSDK = new t
}(window),
function(e, t) {
    "function" == typeof define ? define(t) : "undefined" != typeof module ? module.exports = t() : this.$script = t()
}(0, function() {
    var e, t = this,
        n = document,
        o = n.getElementsByTagName("head")[0],
        s = /^https?:\/\//,
        r = t.$script,
        i = {},
        a = {},
        c = {},
        p = {},
        u = !1,
        l = "push",
        d = "readyState",
        m = "onreadystatechange";

    function f(e, t, n) {
        for (n = 0, j = e.length; n < j; ++n)
            if (!t(e[n])) return u;
        return 1
    }

    function y(e, t) {
        f(e, function(e) {
            return !t(e)
        })
    }

    function S(t, n, o) {
        t = t[l] ? t : [t];
        var r = n && n.call,
            u = r ? n : o,
            d = r ? t.join("") : n,
            m = t.length;

        function _(e) {
            return e.call ? e() : i[e]
        }

        function D() {
            if (!--m)
                for (var e in i[d] = 1, u && u(), c) f(e.split("|"), _) && !y(c[e], _) && (c[e] = [])
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
            r = u;
        s.onload = s.onerror = s[m] = function() {
            s[d] && !/^c|loade/.test(s[d]) || r || (s.onload = s[m] = null, r = 1, p[e] = 2, t())
        }, s.async = 1, s.src = e, o.insertBefore(s, o.firstChild)
    }
    return !n[d] && n.addEventListener && (n.addEventListener("DOMContentLoaded", function e() {
        n.removeEventListener("DOMContentLoaded", e, u), n[d] = "complete"
    }, u), n[d] = "loading"), S.get = g, S.order = function(e, t, n) {
        ! function o(s) {
            s = e.shift(), e.length ? S(s, o) : S(s, t, n)
        }()
    }, S.path = function(t) {
        e = t
    }, S.ready = function(e, t, n) {
        e = e[l] ? e : [e];
        var o, s = [];
        return !y(e, function(e) {
            i[e] || s[l](e)
        }) && f(e, function(e) {
            return i[e]
        }) ? t() : (o = e.join("|"), c[o] = c[o] || [], c[o][l](t), n && n(s)), S
    }, S.noConflict = function() {
        return t.$script = r, this
    }, S
}), "function" == typeof window.superSDK_Async && window.superSDK_Async();