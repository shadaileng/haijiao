(e => {
    function t(t) {
        for (var i, n, s = t[0], c = t[1], l = t[2], d = 0, m = []; d < s.length; d++)
            n = s[d],
            Object.prototype.hasOwnProperty.call(o, n) && o[n] && m.push(o[n][0]),
            o[n] = 0;
        for (i in c)
            Object.prototype.hasOwnProperty.call(c, i) && (e[i] = c[i]);
        for (u && u(t); m.length; )
            m.shift()();
        return r.push.apply(r, l || []),
        a()
    }
    function a() {
        for (var e, t = 0; t < r.length; t++) {
            for (var a = r[t], i = !0, n = 1; n < a.length; n++) {
                var c = a[n];
                0 !== o[c] && (i = !1)
            }
            i && (r.splice(t--, 1),
            e = s(s.s = a[0]))
        }
        return e
    }
    var i = {}
      , n = {
        app: 0
    }
      , o = {
        app: 0
    }
      , r = [];
    function s(t) {
        var a;
        return (i[t] || (a = i[t] = {
            i: t,
            l: !1,
            exports: {}
        },
        e[t].call(a.exports, a, a.exports, s),
        a.l = !0,
        a)).exports
    }
    s.e = function(e) {
        var t, a, i, r, c, l = [], d = (n[e] ? l.push(n[e]) : 0 !== n[e] && {
            "homepage~relation~user": 1,
            "homepage~user": 1,
            homepage: 1,
            relation: 1,
            "topic~user": 1,
            user: 1,
            "index~search~topic": 1,
            "index~topic": 1,
            index: 1,
            topic: 1,
            search: 1,
            oauth: 1,
            pay: 1,
            "chunk-819ade8a": 1
        }[e] && l.push(n[e] = new Promise((function(t, a) {
            for (var i = "css/" + ({
                "homepage~relation~user": "homepage~relation~user",
                "homepage~user": "homepage~user",
                homepage: "homepage",
                relation: "relation",
                "topic~user": "topic~user",
                user: "user",
                "index~search~topic": "index~search~topic",
                "index~topic": "index~topic",
                index: "index",
                "pay~topic": "pay~topic",
                topic: "topic",
                search: "search",
                oauth: "oauth",
                pay: "pay"
            }[e] || e) + "." + {
                "homepage~relation~user": "d9b2ecec",
                "homepage~user": "090305e5",
                homepage: "569a1a9a",
                relation: "b626c3ef",
                "topic~user": "0032be62",
                user: "b15f4f96",
                "index~search~topic": "af2c714a",
                "index~topic": "ee0b8e0d",
                index: "71ab0dc7",
                "pay~topic": "31d6cfe0",
                topic: "078588e0",
                search: "2966cba9",
                oauth: "ce3d7581",
                pay: "324492b0",
                "chunk-819ade8a": "28eb0e0a"
            }[e] + ".css", o = s.p + i, r = document.getElementsByTagName("link"), c = 0; c < r.length; c++) {
                var l = (d = r[c]).getAttribute("data-href") || d.getAttribute("href");
                if ("stylesheet" === d.rel && (l === i || l === o))
                    return t()
            }
            var d, u = document.getElementsByTagName("style");
            for (c = 0; c < u.length; c++)
                if ((l = (d = u[c]).getAttribute("data-href")) === i || l === o)
                    return t();
            var m = document.createElement("link");
            m.rel = "stylesheet",
            m.type = "text/css",
            m.onload = t,
            m.onerror = function(t) {
                t = t && t.target && t.target.src || o;
                var i = new Error("Loading CSS chunk " + e + " failed.\n(" + t + ")");
                i.code = "CSS_CHUNK_LOAD_FAILED",
                i.request = t,
                delete n[e],
                m.parentNode.removeChild(m),
                a(i)
            }
            ,
            m.href = o,
            document.getElementsByTagName("head")[0].appendChild(m)
        }
        )).then((function() {
            n[e] = 0
        }
        ))),
        o[e]);
        return 0 !== d && (d ? l.push(d[2]) : (c = new Promise((function(t, a) {
            d = o[e] = [t, a]
        }
        )),
        l.push(d[2] = c),
        (t = document.createElement("script")).charset = "utf-8",
        t.timeout = 120,
        s.nc && t.setAttribute("nonce", s.nc),
        t.src = s.p + "js/" + ({
            "homepage~relation~user": "homepage~relation~user",
            "homepage~user": "homepage~user",
            homepage: "homepage",
            relation: "relation",
            "topic~user": "topic~user",
            user: "user",
            "index~search~topic": "index~search~topic",
            "index~topic": "index~topic",
            index: "index",
            "pay~topic": "pay~topic",
            topic: "topic",
            search: "search",
            oauth: "oauth",
            pay: "pay"
        }[c = e] || c) + "." + {
            "homepage~relation~user": "08137c95",
            "homepage~user": "935d9914",
            homepage: "802ba0e9",
            relation: "f7711c23",
            "topic~user": "1ffd93bd",
            user: "5144ac6f",
            "index~search~topic": "5b7525da",
            "index~topic": "cc66495a",
            index: "639b26f7",
            "pay~topic": "11d44a43",
            topic: "bee8e5b4",
            search: "4f09591a",
            oauth: "42eb8fa2",
            pay: "d1806f59",
            "chunk-819ade8a": "d2bce1ed"
        }[c] + ".js",
        a = new Error,
        i = function(i) {
            t.onerror = t.onload = null,
            clearTimeout(r);
            var n, s = o[e];
            0 !== s && (s && (n = i && ("load" === i.type ? "missing" : i.type),
            i = i && i.target && i.target.src,
            a.message = "Loading chunk " + e + " failed.\n(" + n + ": " + i + ")",
            a.name = "ChunkLoadError",
            a.type = n,
            a.request = i,
            s[1](a)),
            o[e] = void 0)
        }
        ,
        r = setTimeout((function() {
            i({
                type: "timeout",
                target: t
            })
        }
        ), 12e4),
        t.onerror = t.onload = i,
        document.head.appendChild(t))),
        Promise.all(l)
    }
    ,
    s.m = e,
    s.c = i,
    s.d = function(e, t, a) {
        s.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: a
        })
    }
    ,
    s.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }
    ,
    s.t = function(e, t) {
        if (1 & t && (e = s(e)),
        8 & t)
            return e;
        if (4 & t && "object" == typeof e && e && e.__esModule)
            return e;
        var a = Object.create(null);
        if (s.r(a),
        Object.defineProperty(a, "default", {
            enumerable: !0,
            value: e
        }),
        2 & t && "string" != typeof e)
            for (var i in e)
                s.d(a, i, function(t) {
                    return e[t]
                }
                .bind(null, i));
        return a
    }
    ,
    s.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default
        }
        : function() {
            return e
        }
        ;
        return s.d(t, "a", t),
        t
    }
    ,
    s.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }
    ,
    s.p = "/",
    s.oe = function(e) {
        throw e
    }
    ;
    var c = (l = window.webpackJsonp = window.webpackJsonp || []).push.bind(l);
    l.push = t;
    for (var l = l.slice(), d = 0; d < l.length; d++)
        t(l[d]);
    var u = c;
    r.push([0, "chunk-vendors"]),
    a()
}
)({
    0: function(e, t, a) {
        e.exports = a("56d7")
    },
    "01fc": function(e, t, a) {},
    "0303": function(e, t, a) {
        a.r(t);
        var i = {
            data() {
                return {
                    visible: !1,
                    text: "",
                    title: "",
                    cancelText: "",
                    okText: "",
                    donttip: !1,
                    checked: !1
                }
            },
            methods: {
                close(e) {
                    this.visible = !1,
                    this.$destroy(!0),
                    this.$el.parentNode.removeChild(this.$el)
                },
                cance() {
                    this.onCancel && this.onCancel(),
                    this.close()
                },
                ok() {
                    this.onOk && (this.donttip ? this.onOk({
                        donttip: !!this.checked
                    }) : this.onOk()),
                    this.close()
                }
            }
        };
        a("c6a9"),
        a = a("2877"),
        a = Object(a.a)(i, (function() {
            var e = this
              , t = e._self._c;
            return e.visible ? t("div", {
                staticClass: "_confirm__",
                attrs: {
                    id: "hj_modal_confirm"
                }
            }, [t("div", {
                staticClass: "md-modal"
            }, [t("div", {
                staticClass: "md-content",
                class: e.visible ? "md-show" : ""
            }, [t("div", {
                staticClass: "container"
            }, [t("p", {
                staticClass: "title mb-0"
            }, [e._v(e._s(e.title))]), t("div", {
                staticClass: "mb-0 message",
                domProps: {
                    innerHTML: e._s(e.text)
                }
            }), e.donttip ? t("div", {
                staticClass: "donttip"
            }, [t("el-checkbox", {
                model: {
                    value: e.checked,
                    callback: function(t) {
                        e.checked = t
                    },
                    expression: "checked"
                }
            }, [e._v("不再提示")])], 1) : e._e(), t("div", {
                staticClass: "btn-group"
            }, [t("div", {
                staticClass: "f",
                on: {
                    click: e.cance
                }
            }, [e._v(e._s(e.cancelText))]), t("div", {
                staticClass: "l",
                on: {
                    click: e.ok
                }
            }, [e._v(e._s(e.okText))])])])])])]) : e._e()
        }
        ), [], !1, null, "89419cba", null);
        t.default = a.exports
    },
    "0837": function(e, t, a) {
        a("1236");
        var i = a("6b26");
        t.a = {
            data() {
                return {
                    lockB: !1,
                    lockTopBool: !1
                }
            },
            provide() {
                return {
                    userInfo: Object({
                        NODE_ENV: "production",
                        BASE_URL: "/"
                    }).NUXT_ENV_PLATFORM ? this.userInfo : i.a.get(i.a.USER) ? JSON.parse(i.a.get(i.a.USER)) : {}
                }
            },
            methods: {
                isLockTop(e=null) {
                    try {
                        this.lockB = !0,
                        e || document.documentElement.scrollTop || document.body.scrollTop,
                        this.lockTopBool = 350 <= e
                    } catch (e) {}
                }
            }
        }
    },
    "0a46": function(e, t, a) {
        t.a = "/images/emoji/"
    },
    1: function(e, t) {},
    "111d": function(e, t, a) {
        a("b949")
    },
    1221: function(e, t, a) {
        var i = a("e77a")
          , n = {
            props: ["closeVerify", "isShow"],
            components: {
                dragVerifyImgChip: a("5c9f").a
            },
            nsme: "verify",
            data() {
                return {
                    isPassing: !1,
                    catcha: {
                        blocky: 0,
                        imgurl: "",
                        miniimgurl: "",
                        text: "向右滑动完成拼图",
                        h: 150,
                        w: 265,
                        sh: 45,
                        sw: 55,
                        modifyImg: ""
                    },
                    img: "",
                    img1: i.a,
                    img2: i.b
                }
            },
            methods: {
                pass() {},
                reimg() {
                    this.img1 ? (this.img = this.img1,
                    this.img1 = "") : this.img1 = this.img
                },
                closeFn() {
                    this.closeVerify()
                }
            },
            watch: {
                isPassing: {
                    handler(e) {
                        e && this.$emit("submit", {
                            isPassing: !0
                        }),
                        this.password && 6 == this.password.length && e && this.$toast.loading({
                            message: "信息验证中...",
                            forbidClick: !0,
                            duration: 0
                        })
                    }
                }
            }
        };
        a("550b"),
        a = a("2877"),
        a = Object(a.a)(n, (function() {
            var e = this
              , t = e._self._c;
            return t("el-dialog", {
                attrs: {
                    visible: e.isShow,
                    "custom-class": "overlay",
                    "before-close": e.closeFn,
                    "append-to-body": !0,
                    "show-close": !1,
                    width: "305px",
                    title: "请完成图片验证",
                    center: "",
                    top: "28vh"
                },
                on: {
                    "update:visible": function(t) {
                        e.isShow = t
                    }
                }
            }, [t("div", {
                on: {
                    click: function(e) {
                        e.stopPropagation()
                    }
                }
            }, [t("drag-verify-img-chip", {
                ref: "dragVerify",
                attrs: {
                    imgsrc: e.img1 || e.img2,
                    isPassing: e.isPassing,
                    showRefresh: !e.isPassing,
                    refreshIcon: "el-icon-refresh-right",
                    text: "请按住滑块拖动",
                    successText: "验证通过",
                    handlerIcon: "el-icon-d-arrow-right",
                    successIcon: "el-icon-circle-check"
                },
                on: {
                    "update:isPassing": function(t) {
                        e.isPassing = t
                    },
                    "update:is-passing": function(t) {
                        e.isPassing = t
                    },
                    refresh: e.reimg,
                    passcallback: e.pass
                }
            })], 1)])
        }
        ), [], !1, null, "745cd729", null);
        t.a = a.exports
    },
    1261: function(e, t, a) {
        a.d(t, "a", (function() {
            return n
        }
        )),
        a.d(t, "b", (function() {
            return o
        }
        )),
        a.d(t, "c", (function() {
            return r
        }
        ));
        var i = a("6b26");
        let n = "relation_"
          , o = [{
            path: "/relation/focus",
            name: "relation_focus",
            meta: {
                title: "我关注的",
                menu: !0,
                hideBg: !0
            },
            component: () => Promise.all([a.e("homepage~relation~user"), a.e("relation")]).then(a.bind(null, "cadc"))
        }, {
            path: "/relation/fans",
            name: "relation_fans",
            meta: {
                title: "我的粉丝",
                menu: !0,
                hideBg: !0
            },
            component: () => Promise.all([a.e("homepage~relation~user"), a.e("relation")]).then(a.bind(null, "a75b"))
        }, {
            path: "/relation/friend",
            name: "relation_friend",
            meta: {
                title: "我的好友",
                menu: !0,
                hideBg: !0
            },
            component: () => Promise.all([a.e("homepage~relation~user"), a.e("relation")]).then(a.bind(null, "9c31"))
        }]
          , r = {
            path: "/relation",
            name: "relation",
            component: () => Promise.all([a.e("homepage~relation~user"), a.e("relation")]).then(a.bind(null, "ac4a")),
            beforeEnter: (e, t, a) => {
                i.a.isLogon() ? a() : window.location.href = "/"
            }
            ,
            children: [...o]
        }
    },
    1764: function(e, t, a) {},
    1890: function(e, t, a) {
        a.d(t, "b", (function() {
            return i
        }
        )),
        a.d(t, "a", (function() {
            return n
        }
        )),
        a.d(t, "c", (function() {
            return o
        }
        ));
        let i = 901
          , n = [{
            path: "/homepage/:uid",
            name: "homepage_index",
            props: e => ({
                params: e.params
            }),
            meta: {
                title: "全部帖子",
                menu: !0,
                hideBg: !0,
                activeMenu: i,
                type: 0
            },
            component: () => Promise.all([a.e("homepage~relation~user"), a.e("homepage~user"), a.e("homepage")]).then(a.bind(null, "f572"))
        }, {
            path: "/homepage/last/:uid",
            name: "homepage_last",
            props: e => ({
                params: e.params
            }),
            meta: {
                title: "最新",
                menu: !0,
                hideBg: !0,
                activeMenu: i,
                type: 1
            },
            component: () => Promise.all([a.e("homepage~relation~user"), a.e("homepage~user"), a.e("homepage")]).then(a.bind(null, "f572"))
        }, {
            path: "/homepage/essence/:uid",
            name: "homepage_essence",
            props: e => ({
                params: e.params
            }),
            meta: {
                title: "精华",
                menu: !0,
                hideBg: !0,
                activeMenu: i,
                type: 3
            },
            component: () => Promise.all([a.e("homepage~relation~user"), a.e("homepage~user"), a.e("homepage")]).then(a.bind(null, "f572"))
        }, {
            path: "/homepage/reward/:uid",
            name: "homepage_reward",
            props: e => ({
                params: e.params
            }),
            meta: {
                title: "悬赏",
                menu: !0,
                hideBg: !0,
                activeMenu: i,
                type: 4
            },
            component: () => Promise.all([a.e("homepage~relation~user"), a.e("homepage~user"), a.e("homepage")]).then(a.bind(null, "f572"))
        }, {
            path: "/homepage/sell/:uid",
            name: "homepage_sell",
            props: e => ({
                params: e.params
            }),
            meta: {
                title: "出售",
                menu: !0,
                hideBg: !0,
                activeMenu: i,
                type: 5
            },
            component: () => Promise.all([a.e("homepage~relation~user"), a.e("homepage~user"), a.e("homepage")]).then(a.bind(null, "f572"))
        }]
          , o = {
            path: "/homepage",
            name: "homepage",
            component: () => Promise.all([a.e("homepage~relation~user"), a.e("homepage~user"), a.e("homepage")]).then(a.bind(null, "a6ea")),
            children: [...n]
        }
    },
    "1b9a": function(e, t) {
        e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAYAAAA4TnrqAAAACXBIWXMAAAsSAAALEgHS3X78AAAEzUlEQVR4nO2cMY/URhTH/yQ0KSJOSgVNqFBEkwM36biSBuVSpuIojMuclA/AfQCiQGnccA2iJJ+Auy6NI64CIUXcCQkqJE6gKN2hgTd7o5mx572xvevZ9U9aadczu97973vP/3n27pmTkxNM8Phq0onPJJaASSwBk1gCJrEEnA1NLap6HcAagP/LPPvbmbBCtFqHoqqvA/jJ2PSizLPHzsQVIRRZ69bjH5wZCVJU9Zr+bGWe7XE/wcrVrKKqdwAcAniqbkVVP3QmNRASy65Rz5wZiVBU9UZR1UqkOwDOGe/6JtXlIK1pqEKUdnARwPsyz5ITq6hq9d5V9FxzBk/Z5ARCq1j4ItghhW1SUF3apkgKwapbQbFSpKjqLQD3rHRr433L2IxW65Aaqi4B2AmknEOZZ2ecjR6WIrIo5VQk3XQGwxxwJyZvHQwrECMUuCmIlCOLUk4d5b53BmWwTWlyYjGtgITliyyhFZDA9o5J1CyyAocRQv3lbHFhizXqyIq1AgCO6ei47YxYlHmWdhp2tAJKKF38Q6Z039jntwB+BXADwHkA/wB4ZHYlRpeGHa2AFkql7Y/OqIsZVX8AuE1CKa4CuEvR/ZnRRFYPVuCAhFK335xRP89o35dIHB+/a3uxcLF6sgJaKNBrcdHFfaNlvo60xaWhqkuUcq86CrWrPiwV6ieCxTOMNHzpjJzyUd9bSGRFdAWa2C3zbAuntU66gN7Dad9OCXbJmQQ80nfmKlYHK+Djfpln28brSj3Ysf32qMjr2vWRjoYP9IS5tGg6WgEft8o8e2i89mFElO6XedZWqxwGr1k9dAVsZkIRHD/lQ9wiHywNe+wKaI6pkM8+ZFHVKg1/dmbyYDt3Te9iDdAVQINQ6ozMn85MPuzWjKY3sQbsCigPtUknTsx9PXFmylhMZPVoBWwODA9l0jm9Y07rdRKrZytgo9orW7ZQ9MXE1ikNu+9uEiXWAFbAZmY2rf2u0367Ik5BxFiHAayAzf0GodY62AQbcXGHJLIGsAI+bA9lco/ZduEQFVkssUiop85AvzQKVVT1Zs+RHHXNBjeyRMsCIY6HMjF8W5949xWCW7OiwpZBq1CEtO0SxGNFWHDF6moAfajD93qbUEVV91mnNPvOFiYsscg93/K0NWLRZrPxUiaqU9z2sITGfYZgWwcqvqp+/KIO77HGjr5ZnyufYdiEIYgWS2RKjdbt57Q0LmTVJwpCTt5rNj30XqcMGtM+RKflDom3Z5o8shk+8VhCxbSHhTRGdIjBO6Uk3lqZZ8GDxDz8HPfCNR+jufKvQ3tYwlGZZxdjnzymM9JDtHhsOl1IPCaxor9xAZ0uTV+1X1h0WomsmlhRrRnNMol1FFhhHEl+1ORjWcTS60x1RL1CS7NdWi3s6+shnGcJGZN12Is0o00nNXon9ciam1BIXKy5CoWExZq7UEhUrIUIhQTFWphQSEyshQqFhMRauFBIRKxRCIWRieXrCIxGKEjFUj/ZKKr6QlHV3zmDEVDDT7NjnQQJntiYN+zlDglk9pw+lHnWdv14rIAbY/1bBIlYlwF8Y21+XubZf87kJUWShl87W1YMiVjvrMcfVimqIDwj/QbAvwDeAnhN91eK6a83BUx/YydgEkvAJBYXAJ8AIfzE08w2bVkAAAAASUVORK5CYII="
    },
    "1f24": function(e, t, a) {
        a.d(t, "j", (function() {
            return r
        }
        )),
        a.d(t, "f", (function() {
            return s
        }
        )),
        a.d(t, "i", (function() {
            return c
        }
        )),
        a.d(t, "g", (function() {
            return l
        }
        )),
        a.d(t, "v", (function() {
            return d
        }
        )),
        a.d(t, "z", (function() {
            return u
        }
        )),
        a.d(t, "e", (function() {
            return m
        }
        )),
        a.d(t, "u", (function() {
            return p
        }
        )),
        a.d(t, "a", (function() {
            return h
        }
        )),
        a.d(t, "c", (function() {
            return g
        }
        )),
        a.d(t, "k", (function() {
            return f
        }
        )),
        a.d(t, "r", (function() {
            return v
        }
        )),
        a.d(t, "w", (function() {
            return b
        }
        )),
        a.d(t, "q", (function() {
            return w
        }
        )),
        a.d(t, "l", (function() {
            return A
        }
        )),
        a.d(t, "m", (function() {
            return E
        }
        )),
        a.d(t, "x", (function() {
            return O
        }
        )),
        a.d(t, "y", (function() {
            return y
        }
        )),
        a.d(t, "p", (function() {
            return C
        }
        )),
        a.d(t, "o", (function() {
            return M
        }
        )),
        a.d(t, "h", (function() {
            return I
        }
        )),
        a.d(t, "s", (function() {
            return D
        }
        )),
        a.d(t, "d", (function() {
            return P
        }
        )),
        a.d(t, "n", (function() {
            return x
        }
        )),
        a.d(t, "b", (function() {
            return j
        }
        )),
        a.d(t, "t", (function() {
            return T
        }
        ));
        var i = a("ec7a")
          , n = a("546c")
          , o = (t = a("4328"),
        a.n(t));
        function r() {
            return i.a.get(n.a + "/user/current?date=" + (new Date).getTime())
        }
        function s(e) {
            return i.a.get(n.a + "/topic/node/topics", {
                params: e
            })
        }
        function c(e) {
            return i.a.get(n.a + "/favorite/favorite", {
                params: e
            })
        }
        function l(e) {
            return i.a.get(n.a + "/tag/tags", {
                params: e
            })
        }
        function d(e) {
            return i.a.post(n.a + "/topic/create", e)
        }
        function u(e) {
            return i.a.post(n.a + "/topic/edit", e)
        }
        function m(e) {
            return i.a.get(n.a + "/topic/node", {
                params: e
            })
        }
        function p() {
            return i.a.get(n.a + "/vip/querySaleTopicStatus")
        }
        function h(e) {
            return i.a.get(n.a + "/favorite/add", {
                params: e
            })
        }
        function g(e) {
            return i.a.get(n.a + "/favorite/delete", {
                params: e
            })
        }
        function f(e) {
            return i.a.get(n.a + "/topic/edit", {
                params: e
            })
        }
        function v(e) {
            return i.a.get(n.a + "/user/favorite", {
                params: e
            })
        }
        function b(e) {
            return i.a.post(n.a + "/chat/message", o.a.stringify(e), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                }
            })
        }
        function w(e) {
            return i.a.get(n.a + "/topic/node/topics", {
                params: e
            })
        }
        function A() {
            return i.a.get(n.a + "/user/favorite/users")
        }
        function E() {
            return i.a.get(n.a + "/user/fans")
        }
        function O(e) {
            return i.a.get(n.a + "/user/favorite", {
                params: e
            })
        }
        function y() {
            return i.a.post(n.a + "/user/user_sign_in")
        }
        function C() {
            return i.a.get(n.a + "/task/getTaskStatus")
        }
        function M(e) {
            return i.a.get(n.a + "/vip/getNumber?type=" + e)
        }
        function I(e) {
            return i.a.get(n.a + "/vip/queryFreeNum", {
                params: e
            })
        }
        function D() {
            return i.a.get(n.a + "/vip/queryDisCardNum")
        }
        function P() {
            return i.a.get(n.a + "/topic/global/topics")
        }
        function x(e) {
            return i.a.get(n.a + "/upload/medialist", {
                params: e
            })
        }
        function j(e) {
            return i.a.post(n.a + "/upload/delete", e, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
        }
        function T(e) {
            return i.a.get(n.a + "/store/give_hot_gift", {
                params: e
            })
        }
        window.uploadUrl
    },
    "1fe7": function(e, t, a) {
        a("251c")
    },
    "21e4": function(e, t, a) {
        a.d(t, "b", (function() {
            return o
        }
        )),
        a.d(t, "c", (function() {
            return r
        }
        )),
        a.d(t, "f", (function() {
            return s
        }
        )),
        a.d(t, "d", (function() {
            return c
        }
        )),
        a.d(t, "a", (function() {
            return l
        }
        )),
        a.d(t, "g", (function() {
            return d
        }
        )),
        a.d(t, "e", (function() {
            return u
        }
        ));
        var i = a("ec7a")
          , n = a("546c");
        let o = e => i.a.get(n.a + "/captcha/request" + e)
          , r = () => i.a.get(n.a + "/captcha/request?t=signupCaptcha")
          , s = e => i.a.post(n.a + "/login/signup", e)
          , c = e => i.a.post(n.a + "/login/signin", e)
          , l = e => i.a.post(n.a + "/user/password/find", e)
          , d = e => i.a.post(n.a + "/user/password/reset", e)
          , u = e => i.a.get(n.a + "/captcha/isNeed?captchaKey=" + e)
    },
    "251c": function(e, t, a) {},
    "268e": function(e, t, a) {
        a("73ee")
    },
    "29ad": function(e, t, a) {
        a.d(t, "b", (function() {
            return u
        }
        )),
        a.d(t, "a", (function() {
            return m
        }
        )),
        a.d(t, "c", (function() {
            return p
        }
        )),
        a("14d9"),
        a("e9f5"),
        a("7d54");
        var i, n, o, r, s = a("b1fb"), c = a("0a46"), l = {};
        for (i in s.d)
            l[i] = s.d[i];
        for (n in s.a)
            l[n] = s.a[n];
        for (o in s.b)
            l[o] = s.b[o];
        for (r in s.c)
            l[r] = s.c[r];
        function d(e) {
            if (-1 == e.indexOf("[emoji]") || -1 == e.indexOf("[/emoji]"))
                return [];
            {
                let t = [];
                return e.split("[/emoji]").forEach(e => {
                    -1 != e.indexOf("[emoji]") && t.push(e.split("[emoji]")[1])
                }
                ),
                t
            }
        }
        function u(e) {
            var t;
            return -1 != e.indexOf("[emoji]") && -1 != e.indexOf("[/emoji]") && 0 != (t = d(e)).length && t.forEach(t => {
                for (var a in l)
                    t == a && (e = e.replace(`[emoji]${t}[/emoji]`, l[a].showName))
            }
            ),
            e = -1 != (e = -1 != e.indexOf("[/door]") ? e.replace(/\[door\]\d*\[\/door\]/g, "[传送门]") : e).indexOf("[/book]") ? e.replace(/\[book\]\d*\[\/book\]/g, "[去看书]") : e
        }
        function m(e) {
            var t = d(e);
            return 0 != t.length && t.forEach(t => {
                for (var a in l)
                    t == a && (e = a < 100 ? e.replace(`[emoji]${t}[/emoji]`, `<img src="${c.a + l[a].img}" data-emoji="${t}"/>`) : e.replace(`[emoji]${t}[/emoji]`, `<img src="${c.a + l[a].img}" data-emoji="${t}" data-emojiv="true"/>`))
            }
            ),
            e
        }
        function p(e) {
            var t = document.querySelectorAll("[data-emoji]");
            return 0 != t.length && t.forEach(t => {
                var a = t.getAttribute("data-emoji");
                t = t.getAttribute("src");
                e = (e = (e = (e = e.replace(`<img src="${t}" data-emoji="${a}"/>`, `[emoji]${a}[/emoji]`)).replace(`<img src="${t}" data-emoji="${a}">`, `[emoji]${a}[/emoji]`)).replace(`<img src="${t}" data-emoji="${a}" data-emojiv="true">`, `[emoji]${a}[/emoji]`)).replace(`<img src="${t}" data-emoji="${a}" data-emojiv="true"/>`, `[emoji]${a}[/emoji]`)
            }
            ),
            e
        }
    },
    "2d44": function(e, t, a) {},
    "31ee": function(e, t, a) {
        a("91cd")
    },
    3930: function(e, t, a) {
        a("a234")
    },
    "3dfd": function(e, t, a) {
        var i = a("492a")
          , n = a("0837")
          , o = (a("14d9"),
        a("2f62"))
          , r = {
            name: "HjLevelUpgrade",
            props: {
                level: {
                    type: [String, Number]
                }
            },
            data() {
                return {
                    show: !1
                }
            },
            computed: {
                ...Object(o.e)({
                    levelUpgrade: e => e.levelUpgrade
                })
            },
            methods: {
                ...Object(o.d)(["updateLevelUpgrade"]),
                opens() {
                    this.$router.push({
                        name: "member"
                    }),
                    this.updateLevelUpgrade(!1)
                }
            }
        }
          , s = (a("a228"),
        a("2877"))
          , c = (r = Object(s.a)(r, (function() {
            var e = this
              , t = e._self._c;
            return e.levelUpgrade ? t("div", {
                staticClass: "_hj-levelUpgrade"
            }, [t("div", {
                staticClass: "_hj-container"
            }, [t("div", {
                staticClass: "iconclose",
                on: {
                    click: function(t) {
                        return e.updateLevelUpgrade(!1)
                    }
                }
            }, [t("i", {
                staticClass: "el-icon-close"
            })]), t("img", {
                attrs: {
                    src: a("6ac4"),
                    alt: "专属"
                }
            }), t("div", {
                staticClass: "btnopen"
            }, [t("div", {
                staticClass: "btnonw",
                on: {
                    click: e.opens
                }
            }, [e._v("立即开通")]), t("div", {
                staticClass: "overflow"
            })])])]) : e._e()
        }
        ), [], !1, null, "2bdc59b3", null).exports,
        a("dafe"))
          , l = {
            name: "videoDialog",
            components: {},
            data() {
                return {
                    videoPlayer: null
                }
            },
            computed: {
                ...Object(o.c)({
                    videoData: "getVideoData"
                })
            },
            watch: {},
            methods: {
                ...Object(o.d)({
                    updateVideoData: "updateVideoData"
                }),
                handleClose(e) {
                    this.updateVideoData({
                        show: !1
                    }),
                    this.videoPlayer && this.videoPlayer.destroy(),
                    e()
                }
            },
            created() {},
            mounted() {
                this.$nextTick( () => {
                    let e = this.videoData.keyPath;
                    this.videoPlayer = new DPlayer({
                        container: document.querySelector(".main-player"),
                        autoplay: !0,
                        video: {
                            url: this.videoData.url,
                            type: "customHls",
                            customType: {
                                customHls: function(t, a) {
                                    var i = new Hls({
                                        debug: !1,
                                        p2pConfig: {
                                            live: !1
                                        }
                                    });
                                    i.on(Hls.Events.MANIFEST_PARSED, (function(t, a) {
                                        let i = 0;
                                        if (null != a.levels[0].details.fragments && a.levels[0].details.fragments.length)
                                            for (var n = e + a.levels[0].details.fragments[0].levelkey.reluri; i <= a.levels[0].details.fragments.length - 1; ) {
                                                a.levels[0].details.fragments[i].levelkey.reluri = n;
                                                var o = a.levels[0].details.fragments[i].relurl;
                                                -1 === o.indexOf("http") && (a.levels[0].details.fragments[i].relurl = e + o),
                                                i++
                                            }
                                    }
                                    )),
                                    i.loadSource(t.src),
                                    i.attachMedia(t)
                                }
                            }
                        }
                    })
                }
                )
            },
            beforeCreate() {},
            beforeMount() {},
            beforeUpdate() {},
            updated() {},
            beforeDestroy() {},
            destroyed() {},
            activated() {}
        }
          , d = (l = (a("db2b"),
        a("db3c"),
        Object(s.a)(l, (function() {
            var e = this
              , t = e._self._c;
            return e.videoData.show ? t("el-dialog", {
                staticClass: "my-dialog2",
                attrs: {
                    title: e.videoData.name,
                    visible: e.videoData.show,
                    width: "950px",
                    "before-close": e.handleClose
                },
                on: {
                    "update:visible": function(t) {
                        return e.$set(e.videoData, "show", t)
                    }
                }
            }, [t("div", {
                staticClass: "main-player"
            }), t("div", {
                staticClass: "bottom-box"
            })]) : e._e()
        }
        ), [], !1, null, "d8f45762", null).exports),
        a("6434"));
        let u = 0
          , m = {
            data() {
                return {
                    firstDialog: !1,
                    dialogVisible: !1,
                    secondedsign: !1,
                    time: 3,
                    res: {}
                }
            },
            computed: {
                ...Object(o.c)({
                    videoData: "getVideoData"
                }),
                ...Object(o.e)(["openvip"])
            },
            methods: {
                ...Object(o.b)(["update_userinfo"]),
                showOldDialog() {
                    this.firstDialog = !1,
                    this.dialogVisible = !0
                },
                showSeconed() {
                    this.dialogVisible = !1,
                    this.secondedsign = !0,
                    u = setInterval( () => {
                        this.time--,
                        this.time <= 0 && (clearInterval(u),
                        this.secondedsign = !1,
                        this.cope())
                    }
                    , 1e3)
                },
                seconedC() {
                    this.secondedsign = !1,
                    this.dialogVisible = !1,
                    this.firstDialog = !1,
                    this.cope()
                },
                cope() {
                    sessionStorage.setItem("pageOpen", 1);
                    var e = this.$store.state.configUrl;
                    e = `haijiao社区回家方式发邮件获取最新域名: ${e.customerService}\n                        海外永久网址(翻墙): ${e.domainAbroad.replace("https://", "")}\n                        今日大陆域名为: ` + e.domain.replace("https://", "");
                    Object(c.g)(e),
                    u && clearInterval(u)
                }
            },
            mounted() {
                this.$store.state.isLogin || null !== sessionStorage.getItem("pageOpen") || (this.firstDialog = !0,
                this.dialogVisible = !1,
                this.secondedsign = !1)
            }
        }
          , p = m
          , h = (a("6b54"),
        Object(s.a)(p, (function() {
            var e = this
              , t = e._self._c;
            return t("div", [t("el-dialog", {
                attrs: {
                    visible: e.firstDialog,
                    width: "45%",
                    "custom-class": "luodiye_dialog",
                    center: "",
                    "close-on-click-modal": !1,
                    "show-close": !1
                },
                on: {
                    "update:visible": function(t) {
                        e.firstDialog = t
                    }
                }
            }, [t("span", {
                staticClass: "dialog-title",
                attrs: {
                    slot: "title"
                },
                slot: "title"
            }), t("div", {
                staticClass: "luodi_ye_box"
            }, [t("div", [t("b", [e._v("⚠️重要提示⚠️")]), t("p", [e._v("亲爱的海友们：")]), t("p", {
                staticStyle: {
                    "margin-bottom": "14px"
                }
            }, [e._v(" 如果您发现通过访问我们官方提供的域名时，页面被劫持跳转到其他非我们官方网站，请立即采取以下操作：- ")]), t("span", [e._v("1. 将整个过程录制成完整的视频；")]), t("span", [e._v("2. 联系我们的在线客服发视频给我们")]), t("p", [e._v("我们将进行核实，如果情况属实，并且您是第一个发现该域名问题的用户，您将获得以下奖励：")]), t("p", [e._v("1个月 VIP4 会员 （如已是会员时间延长一个月）")])])]), t("span", {
                staticClass: "dialog-footer",
                attrs: {
                    slot: "footer"
                },
                slot: "footer"
            }, [t("el-button", {
                staticStyle: {
                    "margin-top": "20px",
                    "min-width": "150px"
                },
                attrs: {
                    type: "primary",
                    round: ""
                },
                on: {
                    click: e.showOldDialog
                }
            }, [e._v("我知道了")])], 1)]), t("el-dialog", {
                attrs: {
                    visible: e.dialogVisible,
                    width: "45%",
                    "custom-class": "luodiye_dialog",
                    center: "",
                    "close-on-click-modal": !1,
                    "show-close": !1
                },
                on: {
                    "update:visible": function(t) {
                        e.dialogVisible = t
                    }
                }
            }, [t("span", {
                staticClass: "dialog-title",
                attrs: {
                    slot: "title"
                },
                slot: "title"
            }), t("div", {
                staticClass: "luodi_ye_box"
            }, [t("div", [t("p", [e._v("您正在访问最棒的海外华人社区， 请确保年满18周岁才可以继续访问呦。")]), t("p", [e._v("为了保证您不会迷路，请收藏5个以上网址 否则可能会无法访问")]), t("p", [e._v(" 获取最新域名:"), t("span", {
                staticStyle: {
                    color: "#007aff"
                }
            }, [e._v(e._s(e.$store.state.configUrl.customerService))])]), t("p", [e._v(" 海角海外永久网址(翻墙): "), t("span", {
                staticStyle: {
                    color: "#007aff"
                }
            }, [e._v(e._s(e.$store.state.configUrl.domainAbroad.replace("https://", "")))])]), t("p", [e._v(" 今日大陆直接访问网址为: "), t("span", {
                staticStyle: {
                    color: "#007aff"
                }
            }, [e._v(e._s(e.$store.state.configUrl.domain.replace("https://", "")))])]), t("p", [e._v("如果进入后有某些网络问题，请切换 "), t("span", {
                staticStyle: {
                    color: "#dd5d57"
                }
            }, [e._v("（电信或联通）")]), e._v(" 网络")]), t("p", [t("span", {
                staticStyle: {
                    color: "#dd5d57"
                }
            }, [e._v("移动网络")]), e._v(" 对于本社区的支持不太稳定。")])])]), t("span", {
                staticClass: "dialog-footer",
                attrs: {
                    slot: "footer"
                },
                slot: "footer"
            }, [t("el-button", {
                staticStyle: {
                    "margin-top": "20px",
                    "min-width": "150px"
                },
                attrs: {
                    type: "primary",
                    round: ""
                },
                on: {
                    click: e.showSeconed
                }
            }, [e._v("我知道了")])], 1)]), t("el-dialog", {
                attrs: {
                    visible: e.secondedsign,
                    width: "45%",
                    "custom-class": "luodiye_dialog",
                    "close-on-click-modal": !1,
                    "show-close": !1
                },
                on: {
                    "update:visible": function(t) {
                        e.secondedsign = t
                    }
                }
            }, [t("span", {
                staticClass: "dialog-title",
                attrs: {
                    slot: "title"
                },
                slot: "title"
            }), t("div", {
                staticClass: "luodi_yes_box"
            }, [t("div", [t("p", {
                staticStyle: {
                    color: "#007aff",
                    "text-align": "center"
                }
            }, [t("span", {
                attrs: {
                    id: "timeCount"
                }
            }, [e._v(e._s(e.time))]), e._v("秒后自动进入本站 ")]), t("p", [e._v("海角社区不会搜集您的实名信息。")]), t("p", [e._v("已经自动复制本站域名以及邮箱，请粘贴到微信、QQ或者备忘录里保存。")]), t("p", [e._v(" 本站由于经常被屏蔽域名，"), t("span", {
                staticStyle: {
                    color: "#dd5d57"
                }
            }, [e._v("请务必多保留至少5个域名地址")]), e._v("，以防迷路。未保存可能导致无法访问。 ")]), t("p", [e._v("如果您觉得很棒，可以转发本站地址发送给您的好友一起分享呢。")]), t("p", [e._v("感谢～")])])]), t("span", {
                staticClass: "dialog-footer",
                attrs: {
                    slot: "footer"
                },
                slot: "footer"
            }, [t("span", {
                staticStyle: {
                    color: "#007aff",
                    cursor: "pointer"
                },
                on: {
                    click: e.seconedC
                }
            }, [e._v("好 (" + e._s(e.time) + ")")])])])], 1)
        }
        ), [], !1, null, null, null))
          , g = h.exports
          , f = {
            data() {
                return {
                    selfservice: !1
                }
            },
            computed: {
                ...Object(o.c)({
                    videoData: "getVideoData"
                }),
                ...Object(o.e)(["openvip"])
            },
            watch: {
                openvip(e) {
                    1 == e && this.$refs.openvip && this.$refs.openvip.onshow()
                },
                $route(e, t) {
                    -1 < e.path.indexOf("personal") || -1 < e.path.indexOf("message") || -1 < e.path.indexOf("task") || -1 < e.path.indexOf("mall/") || -1 < e.path.indexOf("post/") && -1 === e.path.indexOf("details") || -1 < e.path.indexOf("member") ? document.getElementById("tidio-chat") && (document.getElementById("tidio-chat").style.display = "block") : document.getElementById("tidio-chat") && (document.getElementById("tidio-chat").style.display = "none")
                }
            },
            mixins: [n.a],
            created() {
                document.getElementById("body").classList.add("bg-color"),
                Object(c.n)()
            },
            mounted() {
                document.title = this.MainObj.name + "社区";
                var e = document.getElementById("initializeView")
                  , t = Object(c.e)()
                  , a = ("IE" == t || "IE11" == t ? e && e.removeNode(!0) : e && e.remove(),
                this);
                this.$store.state.configUrl.customerServiceUrl && (-1 < this.$store.state.configUrl.customerServiceUrl.indexOf("tidio") ? ((t = document.createElement("script")).src = this.$store.state.configUrl.customerServiceUrl,
                document.getElementsByTagName("head")[0].appendChild(t),
                t.onload = function() {
                    a.selfservice = !1,
                    setTimeout( () => {
                        document.getElementById("tidio-chat") && (-1 < a.$route.path.indexOf("personal") || -1 < a.$route.path.indexOf("message") || -1 < a.$route.path.indexOf("task") || -1 < a.$route.path.indexOf("mall/") || -1 < a.$route.path.indexOf("post/") && -1 === a.$route.path.indexOf("/details") || -1 < a.$route.path.indexOf("member") ? document.getElementById("tidio-chat").style.display = "block" : document.getElementById("tidio-chat").style.display = "none")
                    }
                    , 500)
                }
                ,
                t.onerror = function() {}
                ) : this.selfservice = !0)
            },
            methods: {
                ...Object(o.b)(["update_userinfo"]),
                openKf() {
                    this.$store.state.configUrl.customerServiceUrl ? -1 < this.$store.state.configUrl.customerServiceUrl.indexOf("tidio") || window.open(this.$store.state.configUrl.customerServiceUrl, "_blank") : this.$message.warning("当前人工客服尚未开启，请通过邮件联系我们。")
                }
            },
            components: {
                HjToolbar: i.a,
                levelUpgrade: r,
                videoDialog: l,
                openVip: d.a,
                FirstTips: g
            }
        }
          , v = f
          , b = (a("4d43"),
        Object(s.a)(v, (function() {
            var e = this
              , t = e._self._c;
            return t("div", {
                staticClass: "filter-bg",
                attrs: {
                    id: "app"
                }
            }, [t("hj-toolbar", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: e.$store.state.showTopHead,
                    expression: "$store.state.showTopHead"
                }]
            }), t("div", {
                staticStyle: {
                    "margin-top": "45px"
                }
            }, [t("router-view")], 1), t("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: e.$store.state.showBg,
                    expression: "$store.state.showBg"
                }],
                staticClass: "position-fixed w-100 h-100",
                attrs: {
                    id: "fixed_bg"
                }
            }), t("level-upgrade", {
                ref: "levelupgrade"
            }), e.selfservice ? t("div", {
                staticClass: "customer-service",
                on: {
                    click: e.openKf
                }
            }) : e._e(), e.videoData.show ? t("video-dialog") : e._e(), t("open-vip", {
                ref: "openvip",
                on: {
                    openvip: e.update_userinfo
                }
            }), t("FirstTips")], 1)
        }
        ), [], !1, null, null, null));
        t.a = b.exports
    },
    4360: function(e, t, a) {
        a("e9c4");
        var i = a("1f24")
          , n = a("81ee")
          , o = (a("caad"),
        a("14d9"),
        a("b5aa"))
          , r = {
            state: {
                count: 0,
                focusList: {
                    updatetime: 0,
                    list: []
                },
                fansList: {
                    updatetime: 0,
                    list: []
                },
                backpackList: {
                    updatetime: 0,
                    list: []
                },
                personalLetter: []
            },
            getters: {
                getUnRead: e => {
                    var t;
                    let a = 0;
                    for (t of e.personalLetter)
                        t.un_read && (a += t.un_read);
                    return a
                }
                ,
                getFocusList: e => (e.count,
                e.focusList.list),
                getFansList: e => (e.count,
                e.fansList.list),
                getFriendList: e => {
                    e.count;
                    var t, a = e.focusList.list, i = (e = e.fansList.list,
                    []);
                    for (t of a)
                        i.push(t.userId);
                    if (!i.length)
                        return [];
                    var n, o = [];
                    for (n of e)
                        i.includes(n.userId) && o.push(n);
                    return o
                }
                ,
                getBackpackList: e => (e.count,
                e.backpackList.list),
                getTopCard: e => {
                    e = e.backpackList.list || [];
                    var t = []
                      , a = [101, 102, 103];
                    try {
                        for (var i of e)
                            a.includes(i.itemId) && t.push(i)
                    } catch (e) {}
                    return t
                }
                ,
                getNameCard: e => s(e.backpackList.list || [], [888]),
                getSignatureCard: e => s(e.backpackList.list || [], [555]),
                getPortraitCard: e => s(e.backpackList.list || [], [666])
            },
            mutations: {
                setCount(e) {
                    var t = e.count;
                    e.count = 99 <= t ? 1 : t + 1
                },
                setFocusList(e, t=[]) {
                    e.focusList = {
                        updatetime: c(),
                        list: t
                    }
                },
                setFansList(e, t=[]) {
                    e.fansList = {
                        updatetime: c(),
                        list: t
                    }
                },
                setBackpackList(e, t=[]) {
                    e.backpackList = {
                        updatetime: c(),
                        list: t
                    }
                },
                setPersonalLetter(e, t=[]) {
                    e.personalLetter = t
                }
            },
            actions: {
                asyncFocusList(e, t=!1) {
                    return new Promise((function(a, n) {
                        var {updatetime: o, list: r} = e.state.focusList;
                        t || l(o) ? Object(i.l)().then(t => {
                            t && (e.commit("setFocusList", t.data),
                            e.commit("setCount"),
                            a(t.data))
                        }
                        ).catch(e => {
                            n(e)
                        }
                        ) : a(r)
                    }
                    ))
                },
                asyncFansList(e, t=!1) {
                    return new Promise((function(a, n) {
                        var {updatetime: o, list: r} = e.state.fansList;
                        t || l(o) ? Object(i.m)().then(t => {
                            t && (e.commit("setFansList", t.data),
                            e.commit("setCount"),
                            a(t.data))
                        }
                        ).catch(e => {
                            n(e)
                        }
                        ) : a(r)
                    }
                    ))
                },
                asyncBackpackList(e, t=!1) {
                    return new Promise((function(a, i) {
                        var {updatetime: n, list: r} = e.state.backpackList;
                        t || l(n) ? Object(o.s)().then(t => {
                            t && (e.commit("setBackpackList", t.data),
                            e.commit("setCount"),
                            a(t.data))
                        }
                        ).catch(e => {
                            i(e)
                        }
                        ) : a(r)
                    }
                    ))
                },
                asyncPersonalLetter(e) {
                    return new Promise((function(t, a) {
                        Object(o.C)().then(a => {
                            a && (a.data ? (e.commit("setPersonalLetter", a.data),
                            t(a.data)) : (e.commit("setPersonalLetter", []),
                            t([])))
                        }
                        ).catch(e => {
                            a(e)
                        }
                        )
                    }
                    ))
                }
            }
        };
        function s(e=[], t=[]) {
            let a = !1;
            for (var i of e)
                if (t.includes(i.itemId)) {
                    a = !0;
                    break
                }
            return a
        }
        function c() {
            return Date.parse(new Date) / 1e3
        }
        function l(e=0, t=30) {
            return c() - e > t
        }
        var d = a("2b0e")
          , u = a("2f62")
          , m = a("6b26");
        d.default.use(u.a),
        t.a = new u.a.Store({
            state: {
                isloading: !1,
                memberState: !0,
                userInfo: {
                    smallAvatar: "",
                    username: ""
                },
                showBg: !0,
                showTopHead: !0,
                isLogin: !1,
                configUrl: {},
                money: {
                    diamond: 0,
                    gold: 0,
                    score: 0
                },
                routerMenu: [],
                unReadNum: 0,
                levelUpgrade: !1,
                menuBottomShow: {
                    noticeName: "公告",
                    projectName: "活动",
                    feedbackName: "建议"
                },
                nodever: 0,
                videoData: {
                    show: !1,
                    name: "",
                    id: "",
                    url: "",
                    image: ""
                },
                openvip: !1
            },
            getters: {
                getVideoData: e => e.videoData,
                memberState: e => !!e.isLogin && e.memberState,
                userInfo: e => e.isLogin ? e.userInfo : {},
                user_worth: e => {
                    var t;
                    return e.isLogin ? (({diamond: e, gold: t} = e.userInfo),
                    {
                        diamond: e,
                        gold: t
                    }) : {
                        diamond: 0,
                        gold: 0
                    }
                }
            },
            mutations: {
                updateVideoData(e, t) {
                    for (var a in t)
                        e.videoData[a] = t[a]
                },
                updateopenvip(e, t) {
                    e.openvip = !e.openvip
                },
                updateNodever(e, t) {
                    e.nodever = t
                },
                updateMenuBottomShow(e, t) {
                    e.menuBottomShow = t
                },
                updateLevelUpgrade(e, t) {
                    e.levelUpgrade = !!t
                },
                updateUnReadNum(e, t) {
                    e.unReadNum = t
                },
                updateMemberState(e, t) {
                    e.memberState = t
                },
                updateRouterMenu(e, t) {
                    e.routerMenu = t
                },
                updateMoney(e, t) {
                    e.money = t
                },
                updateLogin(e, t=!1) {
                    e.isLogin = t
                },
                updateUserInfo(e, t={}) {
                    let a = {};
                    var i;
                    a = t.hasOwnProperty("id") ? t : {
                        ...e.userInfo,
                        ...t
                    },
                    t.hasOwnProperty("diamond") && (i = t.diamond) && (t.diamond = i / 100),
                    e.isloading = !0,
                    e.userInfo = a,
                    e.money.gold = a.gold,
                    e.money.diamond = a.diamond,
                    m.a.set(m.a.USER, JSON.stringify(a), m.a.MAXEXPIRESTIME)
                },
                updateBgShow(e, t=!0) {
                    e.showBg = t
                },
                updateTopHeadShow(e, t=!0) {
                    e.showTopHead = t
                },
                updateConfigUrl(e, t) {
                    e.configUrl = t
                }
            },
            actions: {
                update_userinfo(e) {
                    return new Promise((function(t, a) {
                        Object(i.j)().then(a => {
                            a && (e.commit("updateUserInfo", a.data),
                            e.commit("updateLogin", !0),
                            t(a.data))
                        }
                        ).catch(t => {
                            a(t),
                            e.commit("updateLogin", !1)
                        }
                        )
                    }
                    ))
                },
                update_vipSwitch(e) {
                    return new Promise((function(t, a) {
                        Object(n.h)().then(a => {
                            e.commit("updateMemberState", !!a.data),
                            t(a.data)
                        }
                        ).catch(t => {
                            e.commit("updateMemberState", !1),
                            a(t)
                        }
                        )
                    }
                    ))
                }
            },
            modules: {
                relation: r
            }
        })
    },
    "492a": function(e, t, a) {
        a("14d9"),
        a("3db2"),
        a("450d");
        var i = a("58b8")
          , n = (i = a.n(i),
        a("1236"),
        a("2f62"))
          , o = a("6b26")
          , r = a("9d4b")
          , s = (n = {
            computed: {
                ...Object(n.c)({
                    userWorth: "user_worth",
                    getUnRead: "getUnRead"
                })
            },
            methods: {
                async updateLogin() {
                    var e = this;
                    if ("addArticle" === this.$route.name)
                        this.$hjConfirm("还没有发布成功，如果现在离开当前页面，可能会丢失所有未保存的内容，是否确认离开？", {
                            async onOk() {
                                try {
                                    await Object(r.B)(),
                                    o.a.remove(o.a.TOKEN),
                                    o.a.remove(o.a.ID),
                                    o.a.remove(o.a.USER),
                                    o.a.set(o.a.NOTLOGIN, o.a.NOTLOGIN, 31536e3),
                                    e.$store.commit("updateLogin", !1),
                                    e.$router.replace("/login")
                                } catch (e) {}
                            }
                        });
                    else
                        try {
                            await Object(r.B)(),
                            o.a.remove(o.a.TOKEN),
                            o.a.remove(o.a.ID),
                            o.a.remove(o.a.USER),
                            o.a.set(o.a.NOTLOGIN, o.a.NOTLOGIN, 31536e3),
                            this.$store.commit("updateLogin", !1),
                            this.$router.replace("/login")
                        } catch (e) {}
                },
                tomessage() {
                    this.$router.push("/message")
                },
                handleLogout() {
                    this.$confirm("真的要注销登录吗 ?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }).then( () => {
                        Object(r.B)().then();
                        var e = JSON.parse(sessionStorage.getItem("response"));
                        e = null == e || null == (e = e.data) ? void 0 : e.vip_domain;
                        e == location.origin && sessionStorage.setItem("vipPath", "true"),
                        o.a.remove(o.a.TOKEN),
                        o.a.remove(o.a.ID),
                        o.a.remove(o.a.USER),
                        o.a.set(o.a.NOTLOGIN, o.a.NOTLOGIN, 31536e3),
                        this.$store.commit("updateLogin", !1),
                        e == location.origin ? window.location.href = "/login" : window.location.href = "/"
                    }
                    ).catch( () => {}
                    )
                }
            },
            filters: {
                showName(e) {
                    return 6 < e.length ? e.slice(0, 6) + "..." : e
                }
            }
        },
        a("5913"),
        a("2877"))
          , c = (n = Object(s.a)(n, (function() {
            var e = this
              , t = e._self._c;
            return t("div", {
                staticClass: "navigation"
            }, [t("div", {
                staticClass: "useravatarContainer activation"
            }, [t("div", {
                staticClass: "useravatar"
            }, [t("user-avatar", {
                attrs: {
                    src: e.$store.state.userInfo.avatar,
                    avatarbg: e.$store.state.userInfo.title.icon,
                    size: "30px"
                },
                on: {
                    onclick: function(t) {
                        return e.$router.push({
                            name: "post_release"
                        })
                    }
                }
            })], 1), t("div", {
                staticClass: "dropdown"
            }, [t("div", {
                staticClass: "nickname"
            }, [e._v(e._s(e.$store.state.userInfo.nickname))]), t("div", {
                staticClass: "userWorth"
            }, [t("div", {
                staticClass: "gold"
            }, [e._v(e._s(e.userWorth.gold))]), t("div", {
                staticClass: "diamond"
            }, [e._v(e._s(e.userWorth.diamond))])]), t("div", {
                staticClass: "dropdownList"
            }, [t("router-link", {
                staticClass: "dropdown_text dropdown_icon1",
                attrs: {
                    tag: "div",
                    to: {
                        name: "personal_datum"
                    }
                }
            }, [e._v("个人资料 ")]), t("router-link", {
                staticClass: "dropdown_text dropdown_icon2",
                attrs: {
                    tag: "div",
                    to: {
                        name: "member"
                    }
                }
            }, [e._v("会员中心 ")]), t("router-link", {
                staticClass: "dropdown_text dropdown_icon3",
                attrs: {
                    tag: "div",
                    to: {
                        name: "personal_wallet"
                    }
                }
            }, [e._v("我的钱包 ")]), t("router-link", {
                staticClass: "dropdown_text dropdown_icon4",
                attrs: {
                    tag: "div",
                    to: {
                        name: "personal_backpack"
                    }
                }
            }, [e._v("我的背包 ")]), t("div", {
                staticClass: "dropdown_text dropdown_icon5",
                on: {
                    click: function(t) {
                        return e.$message.warning("功能待开发")
                    }
                }
            }, [e._v("设置")]), t("div", {
                staticClass: "dropdown_text dropdown_icon6",
                on: {
                    click: e.updateLogin
                }
            }, [e._v("切换账号")]), t("div", {
                staticClass: "dropdown_text dropdown_icon7",
                on: {
                    click: e.handleLogout
                }
            }, [e._v("退出登录")])], 1)])]), t("router-link", {
                staticClass: "navigation_text",
                attrs: {
                    tag: "div",
                    to: {
                        name: "message_interactive"
                    }
                }
            }, [t("el-badge", {
                staticClass: "item",
                attrs: {
                    "is-dot": 0 < e.getUnRead
                }
            }, [e._v("消息")])], 1), t("router-link", {
                staticClass: "navigation_text",
                attrs: {
                    tag: "div",
                    to: {
                        name: "post_collection"
                    }
                }
            }, [e._v("收藏")]), t("router-link", {
                staticClass: "navigation_text",
                attrs: {
                    tag: "div",
                    to: {
                        name: "post_footprint"
                    }
                }
            }, [e._v("足迹")]), t("router-link", {
                staticClass: "navigation_text",
                attrs: {
                    tag: "div",
                    to: {
                        name: "post_drafts"
                    }
                }
            }, [e._v("草稿箱")]), t("router-link", {
                staticClass: "navigation_button",
                attrs: {
                    tag: "div",
                    to: {
                        name: "addArticle"
                    }
                }
            }, [e._v("发帖")])], 1)
        }
        ), [], !1, null, null, null).exports,
        a("ade3"));
        Object(c.a)(class {
            static get() {
                var e = sessionStorage.getItem(this.HREF);
                return e && "" !== e ? e : ""
            }
            static set() {
                sessionStorage.setItem(this.HREF, window.location.href)
            }
            static remove() {
                sessionStorage.removeItem(this.HREF)
            }
        }
        , "HREF", "href"),
        c = {
            methods: {
                toreg() {
                    this.$router.push("/register")
                },
                login() {
                    this.$router.push({
                        path: "/login",
                        query: {
                            back: this.$route.path
                        }
                    })
                }
            }
        },
        a("8b80"),
        c = Object(s.a)(c, (function() {
            var e = this
              , t = e._self._c;
            return t("div", {
                staticClass: "loginChange d-flex"
            }, [t("div", {
                staticClass: "login c-pointer",
                on: {
                    click: e.login
                }
            }, [e._v("登录")]), t("div", {
                staticClass: "register ml-1"
            }, [t("a", {
                attrs: {
                    href: "javascript:void(0);"
                },
                on: {
                    click: e.toreg
                }
            }, [e._v("注册")])])])
        }
        ), [], !1, null, null, null).exports,
        a("8566"),
        n = {
            props: {
                searchBool: {
                    type: Boolean,
                    default: !0
                },
                lockTopBool: !1
            },
            data() {
                return {
                    visible: !1,
                    state: ""
                }
            },
            mounted() {},
            computed: {
                showSearchText() {
                    return "" !== this.state ? this.visible = !0 : this.visible = !1,
                    10 < this.state.length ? this.state.substr(0, 9) + "..." : this.state
                }
            },
            methods: {
                searchKey(e) {
                    "" !== this.state && (o.a.isLogon() ? (this.navigateTo(e),
                    this.visible = !1) : (this.visible = !1,
                    this.$loginWindow()))
                },
                navigateTo(e) {
                    switch (e) {
                    case 1:
                        this.$router.push({
                            path: "/es",
                            query: {
                                key: this.state,
                                node_id: 0,
                                type: 1
                            }
                        });
                        break;
                    case 2:
                        this.$router.push({
                            path: "/es",
                            query: {
                                key: this.state,
                                type: 2
                            }
                        });
                        break;
                    case 3:
                        this.$router.push({
                            path: "/es",
                            query: {
                                key: this.state,
                                type: 3
                            }
                        });
                        break;
                    case 4:
                        this.$router.push({
                            path: "/es",
                            query: {
                                key: this.state,
                                type: 4
                            }
                        })
                    }
                }
            },
            components: {
                HjUserMenu: n,
                HjNoLogin: c,
                ElAutocomplete: i.a
            }
        },
        a("3930"),
        c = Object(s.a)(n, (function() {
            var e = this
              , t = e._self._c;
            return t("div", {
                class: e.lockTopBool ? "top-bar-fixed" : "",
                attrs: {
                    id: "hj-toolbar"
                }
            }, [t("div", {
                staticClass: "d-flex justify-content-between align-items-center",
                attrs: {
                    id: "toolbar-container"
                }
            }, [t("div", {
                staticClass: "hj-logo"
            }, [t("h1", {
                staticClass: "mb-0"
            }, [t("a", {
                attrs: {
                    href: "javascript:void(0);"
                },
                on: {
                    click: function(t) {
                        return e.$router.push("/home")
                    }
                }
            }, [t("img", {
                staticStyle: {
                    "margin-top": "-8px"
                },
                attrs: {
                    width: "70px",
                    height: "32px",
                    src: "/images/common/project/logo.png"
                }
            })])])]), "Es" != e.$route.name ? t("div", {
                staticClass: "hj-search d-flex align-items-center position-relative"
            }, [t("div", {
                staticClass: "text"
            }, [e._v("论坛")]), t("div", {
                staticClass: "suffix"
            }), t("el-input", {
                staticClass: "hj-input",
                attrs: {
                    size: "mini",
                    placeholder: "搜贴，搜人，搜标签"
                },
                nativeOn: {
                    keyup: function(t) {
                        return !t.type.indexOf("key") && e._k(t.keyCode, "enter", 13, t.key, "Enter") ? null : e.searchKey(1)
                    }
                },
                model: {
                    value: e.state,
                    callback: function(t) {
                        e.state = t
                    },
                    expression: "state"
                }
            }, [t("i", {
                staticClass: "el-icon-search c-pointer",
                staticStyle: {
                    "margin-top": "6px",
                    color: "#535453",
                    "font-size": "16px"
                },
                attrs: {
                    slot: "suffix"
                },
                on: {
                    click: function(t) {
                        return e.searchKey(1)
                    }
                },
                slot: "suffix"
            })]), t("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: "" !== e.state && e.visible,
                    expression: "state !== '' && visible"
                }],
                staticClass: "top-search-type position-absolute",
                attrs: {
                    id: "top_search_type"
                }
            }, [t("ul", [t("li", {
                on: {
                    click: function(t) {
                        return e.searchKey(1)
                    }
                }
            }, [t("a", [e._v("含有"), t("strong", [e._v(e._s(e.showSearchText))]), e._v("的内容>>")])]), t("li", {
                on: {
                    click: function(t) {
                        return e.searchKey(2)
                    }
                }
            }, [t("a", [e._v("名为"), t("strong", [e._v(e._s(e.showSearchText))]), e._v("的人>>")])]), t("li", {
                on: {
                    click: function(t) {
                        return e.searchKey(3)
                    }
                }
            }, [t("a", [e._v("包含"), t("strong", [e._v(e._s(e.showSearchText))]), e._v("标签的帖子>>")])]), t("li", {
                on: {
                    click: function(t) {
                        return e.searchKey(4)
                    }
                }
            }, [t("a", [e._v("包含"), t("strong", [e._v(e._s(e.showSearchText))]), e._v("标签的人>>")])]), t("li", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: !1,
                    expression: "false"
                }],
                on: {
                    click: function(t) {
                        return e.searchKey(3)
                    }
                }
            }, [t("a", [e._v("去"), t("strong", [e._v(e._s(e.showSearchText))]), e._v("的标签>>")])])])])], 1) : e._e(), t("div", {
                staticClass: "hj-slot"
            }, [e.$store.state.isLogin ? t("hj-user-menu") : t("hj-no-login")], 1)])])
        }
        ), [], !1, null, null, null),
        t.a = c.exports
    },
    "4b54": function(e, t, a) {},
    "4d43": function(e, t, a) {
        a("77e5")
    },
    "4dae": function(e, t, a) {},
    "546c": function(e, t, a) {
        t.a = "/api"
    },
    "550b": function(e, t, a) {
        a("e141")
    },
    "56d7": function(module, __webpack_exports__, __webpack_require__) {
        __webpack_require__.r(__webpack_exports__);
        var core_js_modules_es_iterator_constructor_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("e9f5")
          , core_js_modules_es_iterator_constructor_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(core_js_modules_es_iterator_constructor_js__WEBPACK_IMPORTED_MODULE_0__)
          , core_js_modules_es_iterator_filter_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("910d")
          , core_js_modules_es_iterator_filter_js__WEBPACK_IMPORTED_MODULE_1___default = __webpack_require__.n(core_js_modules_es_iterator_filter_js__WEBPACK_IMPORTED_MODULE_1__)
          , core_js_modules_es_iterator_for_each_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("7d54")
          , core_js_modules_es_iterator_for_each_js__WEBPACK_IMPORTED_MODULE_2___default = __webpack_require__.n(core_js_modules_es_iterator_for_each_js__WEBPACK_IMPORTED_MODULE_2__)
          , core_js_modules_es_json_parse_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("1236")
          , core_js_modules_es_json_parse_js__WEBPACK_IMPORTED_MODULE_3___default = __webpack_require__.n(core_js_modules_es_json_parse_js__WEBPACK_IMPORTED_MODULE_3__)
          , core_js_modules_es_json_stringify_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("e9c4")
          , core_js_modules_es_json_stringify_js__WEBPACK_IMPORTED_MODULE_4___default = __webpack_require__.n(core_js_modules_es_json_stringify_js__WEBPACK_IMPORTED_MODULE_4__)
          , vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("2b0e")
          , _App_vue__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("3dfd")
          , _router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("a18c")
          , _store__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("4360")
          , _assets_css_common_init_min_css__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("01fc")
          , _assets_css_common_init_min_css__WEBPACK_IMPORTED_MODULE_9___default = __webpack_require__.n(_assets_css_common_init_min_css__WEBPACK_IMPORTED_MODULE_9__)
          , _assets_css_video_js_min_css__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("fe6a")
          , _assets_css_video_js_min_css__WEBPACK_IMPORTED_MODULE_10___default = __webpack_require__.n(_assets_css_video_js_min_css__WEBPACK_IMPORTED_MODULE_10__)
          , _assets_css_fonts_font_2183866_jzy86exutus_css__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("4b54")
          , _assets_css_fonts_font_2183866_jzy86exutus_css__WEBPACK_IMPORTED_MODULE_11___default = __webpack_require__.n(_assets_css_fonts_font_2183866_jzy86exutus_css__WEBPACK_IMPORTED_MODULE_11__)
          , _plug_element__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("e48b")
          , _globalSlots__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("ac1f")
          , _plug_permission__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("703e")
          , _plug_vue_quill_editor__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("cbc2")
          , intersection_observer__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("5abe")
          , intersection_observer__WEBPACK_IMPORTED_MODULE_16___default = __webpack_require__.n(intersection_observer__WEBPACK_IMPORTED_MODULE_16__)
          , _utils_filter__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__("7897")
          , _utils_directives__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__("91ae")
          , _utils_http__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__("ec7a")
          , element_ui_lib_theme_chalk_base_css__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__("450d")
          , element_ui_lib_theme_chalk_base_css__WEBPACK_IMPORTED_MODULE_20___default = __webpack_require__.n(element_ui_lib_theme_chalk_base_css__WEBPACK_IMPORTED_MODULE_20__)
          , _utils_cookie__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__("6b26")
          , element_ui_lib_transitions_collapse_transition__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__("5488")
          , element_ui_lib_transitions_collapse_transition__WEBPACK_IMPORTED_MODULE_22___default = __webpack_require__.n(element_ui_lib_transitions_collapse_transition__WEBPACK_IMPORTED_MODULE_22__)
          , _api_ssr_index_js__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__("9d4b")
          , quill__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__("9339")
          , quill__WEBPACK_IMPORTED_MODULE_24___default = __webpack_require__.n(quill__WEBPACK_IMPORTED_MODULE_24__)
          , quill_dist_quill_core_css__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__("a753")
          , quill_dist_quill_core_css__WEBPACK_IMPORTED_MODULE_25___default = __webpack_require__.n(quill_dist_quill_core_css__WEBPACK_IMPORTED_MODULE_25__)
          , quill_dist_quill_snow_css__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__("8096")
          , quill_dist_quill_snow_css__WEBPACK_IMPORTED_MODULE_26___default = __webpack_require__.n(quill_dist_quill_snow_css__WEBPACK_IMPORTED_MODULE_26__)
          , _components_userAvatar__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__("adce")
          , _components_advertising__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__("82f5");
        async function init(cb) {
            let res;
            try {
                res = await Object(_api_ssr_index_js__WEBPACK_IMPORTED_MODULE_23__.o)()
            } catch (error) {
                res = {
                    totalJavascript: "<script async=\"async\" src=\"https://img.maskanalyse.com/node/script?appId=hj-all&channel=默认\"><\/script>\n<script>\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n\n  gtag('config', 'G-H4G4E5X3FL');\n<\/script>",
                    domainAbroad: "https://www.haijiao.com",
                    domain: "https://hjf3e.com",
                    customerService: "haijiao2021@gmail.com",
                    customerServiceUrl: "https://direct.lc.chat/12670278",
                    bookCity: "/book/#/pages/public/middle",
                    isVipDomain: !1,
                    hjMovie: "https://mv.hjdfcf.com"
                }
            }
            addscript(res.data.totalJavascript),
            res.data.customerServiceUrl = eval("(" + res.data.customerServiceUrl + ")"),
            res.data.customerServiceUrl[0].enable || res.data.customerServiceUrl[1].enable ? res.data.customerServiceUrl[0].enable ? res.data.customerServiceUrl = res.data.customerServiceUrl[0].url : res.data.customerServiceUrl = res.data.customerServiceUrl[1].url : res.data.customerServiceUrl = "",
            _store__WEBPACK_IMPORTED_MODULE_8__.a.commit("updateConfigUrl", res.data),
            sessionStorage.setItem("config", JSON.stringify(res.data));
            let isVipDomain = res.data.isVipDomain;
            if (isVipDomain) {
                let e = getQueryVariable("jump");
                if (e) {
                    let t = JSON.parse(decodeURIComponent(e))
                      , {token: a, ref: i, user: n, vip_domain: o, type: r} = t.data;
                    sessionStorage.setItem("response", JSON.stringify(t)),
                    _utils_cookie__WEBPACK_IMPORTED_MODULE_21__.a.set(_utils_cookie__WEBPACK_IMPORTED_MODULE_21__.a.TOKEN, a, _utils_cookie__WEBPACK_IMPORTED_MODULE_21__.a.EXPIRESTIME),
                    _utils_cookie__WEBPACK_IMPORTED_MODULE_21__.a.set(_utils_cookie__WEBPACK_IMPORTED_MODULE_21__.a.ID, n.id, _utils_cookie__WEBPACK_IMPORTED_MODULE_21__.a.EXPIRESTIME),
                    _utils_cookie__WEBPACK_IMPORTED_MODULE_21__.a.set(_utils_cookie__WEBPACK_IMPORTED_MODULE_21__.a.USER, JSON.stringify(n), _utils_cookie__WEBPACK_IMPORTED_MODULE_21__.a.EXPIRESTIME),
                    _store__WEBPACK_IMPORTED_MODULE_8__.a.commit("updateLogin", !0),
                    _store__WEBPACK_IMPORTED_MODULE_8__.a.commit("updateUserInfo", n),
                    _utils_cookie__WEBPACK_IMPORTED_MODULE_21__.a.remove(_utils_cookie__WEBPACK_IMPORTED_MODULE_21__.a.NOTLOGIN),
                    window.location.search = "",
                    cb(!0)
                } else {
                    let e = _utils_cookie__WEBPACK_IMPORTED_MODULE_21__.a.get(_utils_cookie__WEBPACK_IMPORTED_MODULE_21__.a.TOKEN);
                    "/login" == window.location.pathname || e ? cb(!0) : (window.location.href = "/login",
                    cb(!1))
                }
            } else
                cb(!0)
        }
        function addscript(e="") {
            var t;
            for (t of document.querySelectorAll("script[class]"))
                t.remove();
            if (e && -1 != e.indexOf("<script")) {
                var a, i = e.split("<\/script>"), n = /<script.*>/gi;
                for (a in i) {
                    var o = i[a];
                    if ("" != o) {
                        var r, s = document.createElement("script");
                        s.type = "text/javascript",
                        s.setAttribute("class", "stics");
                        try {
                            -1 != o.indexOf("src=") ? "" != o.split('src="')[1].split('"')[0] && (s.src = o.split('src="')[1].split('"')[0],
                            document.body.appendChild(s)) : "" != (r = o.replace(n, "")) && (s.appendChild(document.createTextNode(r)),
                            document.body.appendChild(s))
                        } catch (e) {}
                    }
                }
            }
        }
        function getQueryVariable(e) {
            for (var t = window.location.search.substring(1).split("&"), a = 0; a < t.length; a++) {
                var i = t[a].split("=");
                if (i[0] == e)
                    return i[1]
            }
            return !1
        }
        vue__WEBPACK_IMPORTED_MODULE_5__.default.config.productionTip = !1,
        vue__WEBPACK_IMPORTED_MODULE_5__.default.component("user-avatar", _components_userAvatar__WEBPACK_IMPORTED_MODULE_27__.a),
        vue__WEBPACK_IMPORTED_MODULE_5__.default.component("advertising", _components_advertising__WEBPACK_IMPORTED_MODULE_28__.a),
        vue__WEBPACK_IMPORTED_MODULE_5__.default.component(element_ui_lib_transitions_collapse_transition__WEBPACK_IMPORTED_MODULE_22___default.a.name, element_ui_lib_transitions_collapse_transition__WEBPACK_IMPORTED_MODULE_22___default.a),
        vue__WEBPACK_IMPORTED_MODULE_5__.default.prototype.$axios = _utils_http__WEBPACK_IMPORTED_MODULE_19__.a,
        vue__WEBPACK_IMPORTED_MODULE_5__.default.use(_globalSlots__WEBPACK_IMPORTED_MODULE_13__.a),
        vue__WEBPACK_IMPORTED_MODULE_5__.default.use(_plug_element__WEBPACK_IMPORTED_MODULE_12__.a),
        vue__WEBPACK_IMPORTED_MODULE_5__.default.use(_plug_vue_quill_editor__WEBPACK_IMPORTED_MODULE_15__.a),
        vue__WEBPACK_IMPORTED_MODULE_5__.default.prototype.MainObj = {
            name: "海角"
        },
        vue__WEBPACK_IMPORTED_MODULE_5__.default.prototype.timeToStr = function(e, t) {
            if (t) {
                t = (t += "").split(" ");
                var a, i, n = {
                    "Y+": t[0].split("-")[0],
                    "m+": t[0].split("-")[1],
                    "d+": t[0].split("-")[2],
                    "H+": t[1].split(":")[0],
                    "M+": t[1].split(":")[1],
                    "S+": t[1].split(":")[2]
                };
                for (i in n)
                    (a = new RegExp("(" + i + ")").exec(e)) && (e = e.replace(a[1], 1 == a[1].length ? n[i] : n[i].padStart(a[1].length, "0")));
                return e
            }
        }
        ,
        vue__WEBPACK_IMPORTED_MODULE_5__.default.prototype.MoneyShow = function(e, t) {
            return 2 == t ? (e / 100).toFixed(2) : e
        }
        ,
        vue__WEBPACK_IMPORTED_MODULE_5__.default.prototype.SpliceURL = () => {
            var e = JSON.parse(sessionStorage.config);
            return {
                url: (null == e ? void 0 : e.domain) + window.location.pathname + window.location.search,
                address: null == e ? void 0 : e.domain,
                pathname: window.location.pathname,
                search: window.location.search
            }
        }
        ,
        _router__WEBPACK_IMPORTED_MODULE_7__.a.beforeEach( (e, t, a) => {
            e.name && !t.name && _utils_cookie__WEBPACK_IMPORTED_MODULE_21__.a.get(_utils_cookie__WEBPACK_IMPORTED_MODULE_21__.a.TOKEN) && (_store__WEBPACK_IMPORTED_MODULE_8__.a.dispatch("update_userinfo"),
            _store__WEBPACK_IMPORTED_MODULE_8__.a.dispatch("asyncPersonalLetter")),
            e.meta.hideBg ? _store__WEBPACK_IMPORTED_MODULE_8__.a.commit("updateBgShow", !1) : _store__WEBPACK_IMPORTED_MODULE_8__.a.commit("updateBgShow", !0),
            e.meta.hideTopHead ? _store__WEBPACK_IMPORTED_MODULE_8__.a.commit("updateTopHeadShow", !1) : _store__WEBPACK_IMPORTED_MODULE_8__.a.commit("updateTopHeadShow", !0),
            e.meta.title ? document.title = e.meta.title : document.title = vue__WEBPACK_IMPORTED_MODULE_5__.default.prototype.MainObj.name + "社区",
            t = _store__WEBPACK_IMPORTED_MODULE_8__.a.state.configUrl.totalJavascript,
            t && addscript(t),
            a()
        }
        ),
        Object.keys(_utils_filter__WEBPACK_IMPORTED_MODULE_17__.a).forEach(e => {
            vue__WEBPACK_IMPORTED_MODULE_5__.default.filter(e, _utils_filter__WEBPACK_IMPORTED_MODULE_17__.a[e])
        }
        ),
        init(e => {
            e && new vue__WEBPACK_IMPORTED_MODULE_5__.default({
                router: _router__WEBPACK_IMPORTED_MODULE_7__.a,
                store: _store__WEBPACK_IMPORTED_MODULE_8__.a,
                render: e => e(_App_vue__WEBPACK_IMPORTED_MODULE_6__.a)
            }).$mount("#app")
        }
        )
    },
    5913: function(e, t, a) {
        a("bc73")
    },
    "5c9f": function(e, t, a) {
        var i = {
            name: "dragVerifyImgChip",
            props: {
                isPassing: {
                    type: Boolean,
                    default: !1
                },
                width: {
                    type: Number,
                    default: 265
                },
                height: {
                    type: Number,
                    default: 40
                },
                text: {
                    type: String,
                    default: "swiping to the right side"
                },
                successText: {
                    type: String,
                    default: "success"
                },
                background: {
                    type: String,
                    default: "#eee"
                },
                progressBarBg: {
                    type: String,
                    default: "#76c61d"
                },
                completedBg: {
                    type: String,
                    default: "#76c61d"
                },
                circle: {
                    type: Boolean,
                    default: !1
                },
                radius: {
                    type: String,
                    default: "4px"
                },
                handlerIcon: {
                    type: String
                },
                successIcon: {
                    type: String
                },
                handlerBg: {
                    type: String,
                    default: "#448fe6"
                },
                textSize: {
                    type: String,
                    default: "14px"
                },
                textColor: {
                    type: String,
                    default: "#333"
                },
                imgsrc: {
                    type: String
                },
                barWidth: {
                    type: Number,
                    default: 20
                },
                barRadius: {
                    type: Number,
                    default: 8
                },
                showRefresh: {
                    type: Boolean,
                    default: !1
                },
                refreshIcon: {
                    type: String
                },
                showTips: {
                    type: Boolean,
                    default: !0
                },
                successTip: {
                    type: String,
                    default: "验证通过，超过80%用户"
                },
                failTip: {
                    type: String,
                    default: "验证未通过，拖动滑块将悬浮图像正确合并"
                },
                diffWidth: {
                    type: Number,
                    default: 20
                }
            },
            mounted: function() {
                var e = this.$refs.dragVerify;
                e.style.setProperty("--textColor", this.textColor),
                e.style.setProperty("--width", Math.floor(this.width / 2) + "px"),
                e.style.setProperty("--pwidth", -Math.floor(this.width / 2) + "px")
            },
            computed: {
                handlerStyle: function() {
                    return {
                        width: this.height + "px",
                        height: this.height + "px",
                        background: this.handlerBg
                    }
                },
                message: function() {
                    return this.isPassing ? "" : this.text
                },
                successMessage: function() {
                    return this.isPassing ? this.successText : ""
                },
                dragVerifyStyle: function() {
                    return {
                        width: this.width + "px",
                        height: this.height + "px",
                        lineHeight: this.height + "px",
                        background: this.background,
                        borderRadius: this.circle ? this.height / 2 + "px" : this.radius
                    }
                },
                dragVerifyImgStyle: function() {
                    return {
                        width: this.width + "px",
                        position: "relative",
                        overflow: "hidden"
                    }
                },
                progressBarStyle: function() {
                    return {
                        background: this.progressBarBg,
                        height: this.height + "px",
                        borderRadius: this.circle ? this.height / 2 + "px 0 0 " + this.height / 2 + "px" : this.radius
                    }
                },
                textStyle: function() {
                    return {
                        height: this.height + "px",
                        width: this.width + "px",
                        fontSize: this.textSize
                    }
                }
            },
            data() {
                return {
                    isMoving: !1,
                    x: 0,
                    isOk: !1,
                    isKeep: !1,
                    clipBarx: 0,
                    showErrorTip: !1
                }
            },
            methods: {
                draw: function(e, t, a, i) {
                    var n = this.barWidth
                      , o = this.barRadius
                      , r = Math.PI;
                    e.beginPath(),
                    e.moveTo(t, a),
                    e.arc(t + n / 2, a - o + 2, o, .72 * r, 2.26 * r),
                    e.lineTo(t + n, a),
                    e.arc(t + n + o - 2, a + n / 2, o, 1.21 * r, 2.78 * r),
                    e.lineTo(t + n, a + n),
                    e.lineTo(t, a + n),
                    e.arc(t + o - 2, a + n / 2, o + .4, 2.76 * r, 1.24 * r, !0),
                    e.lineTo(t, a),
                    e.lineWidth = 2,
                    e.fillStyle = "rgba(255, 255, 255, 0.8)",
                    e.strokeStyle = "rgba(255, 255, 255, 0.8)",
                    e.stroke(),
                    e[i](),
                    e.globalCompositeOperation = "destination-over"
                },
                checkimgLoaded: function() {
                    var e = this.barWidth
                      , t = this.$refs.checkImg.height
                      , a = this.$refs.checkImg.width
                      , i = Math.floor(this.width / 2)
                      , n = (i = i + Math.ceil(Math.random() * (i - e - this.barRadius - 5)),
                    25 + Math.floor(Math.random() * (t - e - 25 - 20)))
                      , o = (this.$refs.maincanvas.setAttribute("width", a),
                    this.$refs.maincanvas.setAttribute("height", t),
                    this.$refs.maincanvas.style.display = "block",
                    this.$refs.maincanvas.getContext("2d"))
                      , r = (o = (this.draw(o, i, n, "fill"),
                    this.clipBarx = i,
                    this.$refs.movecanvas),
                    e = (o.setAttribute("width", a),
                    o.setAttribute("height", t),
                    this.$refs.movecanvas.style.display = "block",
                    e + 2 * this.barRadius + 3),
                    this.$refs.movecanvas.getContext("2d"));
                    r.clearRect(0, 0, a, t),
                    this.draw(r, i, n, "clip"),
                    r.drawImage(this.$refs.checkImg, 0, 0, a, t),
                    n = n - 2 * this.barRadius - 1,
                    a = r.getImageData(i, n, e, e);
                    o.setAttribute("width", e),
                    o.setAttribute("height", t),
                    r.putImageData(a, 0, n)
                },
                dragStart: function(e) {
                    this.isPassing || (this.isMoving = !0,
                    this.x = e.pageX || e.touches[0].pageX),
                    this.showBar = !0,
                    this.showErrorTip = !1,
                    this.$emit("handlerMove")
                },
                dragMoving: function(e) {
                    this.isMoving && !this.isPassing && (e = (e.pageX || e.touches[0].pageX) - this.x,
                    this.$refs.handler.style.left = e + "px",
                    this.$refs.progressBar.style.width = e + this.height / 2 + "px",
                    this.$refs.movecanvas.style.left = e + "px")
                },
                dragFinish: function(e) {
                    var t;
                    this.isMoving && !this.isPassing && (e = (e.pageX || e.changedTouches[0].pageX) - this.x,
                    Math.abs(e - this.clipBarx) > this.diffWidth ? (this.isOk = !0,
                    t = this,
                    setTimeout((function() {
                        t.$refs.handler.style.left = "0",
                        t.$refs.progressBar.style.width = "0",
                        t.$refs.movecanvas.style.left = "0",
                        t.isOk = !1
                    }
                    ), 500),
                    this.$emit("passfail"),
                    setTimeout((function() {
                        t.$emit("refresh")
                    }
                    ), 500),
                    this.showErrorTip = !0) : this.passVerify(),
                    this.isMoving = !1)
                },
                passVerify: function() {
                    this.$emit("update:isPassing", !0),
                    this.isMoving = !1,
                    this.$refs.handler.children[0].className = this.successIcon,
                    this.$refs.progressBar.style.background = this.completedBg,
                    this.$refs.message.style["-webkit-text-fill-color"] = "unset",
                    this.$refs.message.style.animation = "slidetounlock2 3s infinite",
                    this.$refs.progressBar.style.color = "#fff",
                    this.$refs.progressBar.style.fontSize = this.textSize,
                    this.isKeep = !0,
                    setTimeout( () => {
                        this.$refs.movecanvas.style.left = this.clipBarx + "px",
                        setTimeout( () => {
                            this.isKeep = !1,
                            this.$refs.maincanvas.style.display = "none",
                            this.$refs.movecanvas.style.display = "none"
                        }
                        , 200)
                    }
                    , 100),
                    this.$emit("passcallback")
                },
                reset: function() {
                    this.reImg(),
                    this.checkimgLoaded()
                },
                reImg: function() {
                    this.$emit("update:isPassing", !1);
                    var e, t = this.$options.data();
                    for (e in t)
                        Object.prototype.hasOwnProperty.call(t, e) && (this[e] = t[e]);
                    var a = this.$refs.handler
                      , i = this.$refs.message;
                    a.style.left = "0",
                    this.$refs.progressBar.style.width = "0",
                    a.children[0].className = this.handlerIcon,
                    i.style["-webkit-text-fill-color"] = "transparent",
                    i.style.animation = "slidetounlock 3s infinite",
                    i.style.color = this.background,
                    this.$refs.movecanvas.style.left = "0px"
                },
                refreshimg: function() {
                    this.$emit("refresh")
                }
            },
            watch: {
                imgsrc: {
                    immediate: !1,
                    handler: function() {
                        this.reImg()
                    }
                }
            }
        };
        a("31ee"),
        a("a327"),
        a = a("2877"),
        a = Object(a.a)(i, (function() {
            var e = this
              , t = e._self._c;
            return t("div", {
                staticClass: "drag-verify-container"
            }, [t("div", {
                style: e.dragVerifyImgStyle
            }, [t("img", {
                ref: "checkImg",
                staticStyle: {
                    width: "100%"
                },
                attrs: {
                    crossOrigin: "anonymous",
                    src: e.imgsrc,
                    alt: ""
                },
                on: {
                    load: e.checkimgLoaded
                }
            }), t("canvas", {
                ref: "maincanvas",
                staticClass: "main-canvas"
            }), t("canvas", {
                ref: "movecanvas",
                staticClass: "move-canvas",
                class: {
                    goFirst: e.isOk,
                    goKeep: e.isKeep
                }
            }), e.showRefresh && !e.isPassing ? t("div", {
                staticClass: "refresh"
            }, [t("i", {
                class: e.refreshIcon,
                on: {
                    click: e.refreshimg
                }
            })]) : e._e(), e.showTips && e.isPassing ? t("div", {
                staticClass: "tips success"
            }, [e._v(e._s(e.successTip))]) : e._e(), e.showTips && !e.isPassing && e.showErrorTip ? t("div", {
                staticClass: "tips danger"
            }, [e._v(e._s(e.failTip))]) : e._e()]), t("div", {
                ref: "dragVerify",
                staticClass: "drag_verify",
                style: e.dragVerifyStyle,
                on: {
                    mousemove: e.dragMoving,
                    mouseup: e.dragFinish,
                    mouseleave: e.dragFinish,
                    touchmove: e.dragMoving,
                    touchend: e.dragFinish
                }
            }, [t("div", {
                ref: "progressBar",
                staticClass: "dv_progress_bar",
                class: {
                    goFirst2: e.isOk
                },
                style: e.progressBarStyle
            }, [e._v(" " + e._s(e.successMessage) + " ")]), t("div", {
                ref: "message",
                staticClass: "dv_text",
                style: e.textStyle
            }, [e._v(" " + e._s(e.message) + " ")]), t("div", {
                ref: "handler",
                staticClass: "dv_handler dv_handler_bg",
                class: {
                    goFirst: e.isOk
                },
                style: e.handlerStyle,
                on: {
                    mousedown: e.dragStart,
                    touchstart: e.dragStart
                }
            }, [t("i", {
                class: e.handlerIcon
            })])])])
        }
        ), [], !1, null, "1c720be6", null);
        t.a = a.exports
    },
    "5e1c": function(e, t, a) {
        a("caad"),
        a("14d9"),
        a("1236");
        var i = a("bc3a")
          , n = (i = a.n(i),
        a("2b0e"))
          , o = a("a18c")
          , r = a("4360")
          , s = a("6b26");
        class c {
            static main(e, t=null, a=!0) {
                try {
                    var i = e.data
                      , n = e;
                    if (500 === n.status)
                        throw "抱歉，服务器出错了";
                    if (502 === n.status)
                        throw "抱歉，服务器出错了";
                    if (504 === n.status)
                        throw "抱歉，服务器出错了";
                    var [o,r,c=!0] = [i, t, a]
                      , {errorCode: l, message: d, success: u} = o;
                    if (0 !== l || !0 !== u)
                        throw 1 === l ? ((e => {
                            e ? (e.set(s.a.NOTLOGIN, s.a.NOTLOGIN, {
                                path: "/",
                                maxAge: s.a.MAXEXPIRESTIME
                            }),
                            e.set(s.a.TOKEN, "", {
                                path: "/",
                                maxAge: -1
                            }),
                            e.set(s.a.ID, "", {
                                path: "/",
                                maxAge: -1
                            }),
                            e.set(s.a.USER, "", {
                                path: "/",
                                maxAge: -1
                            })) : (s.a.set(s.a.NOTLOGIN, s.a.NOTLOGIN, s.a.MAXEXPIRESTIME),
                            s.a.remove(s.a.TOKEN),
                            s.a.remove(s.a.USER),
                            s.a.remove(s.a.ID))
                        }
                        )(r),
                        d) : c ? o : d;
                    return e
                } catch (e) {
                    throw e
                }
            }
        }
        var l = a("dafe")
          , d = a("27ae");
        let u = n.default.prototype
          , m = {
            ErrorNotLogin: 1,
            CaptchaError: 1e3,
            ForbiddenError: 1001,
            UserDisabled: 1002,
            InObservationPeriod: 1003,
            UserDisabledOther: 1004
        };
        i.a.interceptors.request.use(async e => {
            e.timeout || (e.timeout = 3e4),
            -1 != e.url.indexOf("/upload") && (e.timeout = 36e4);
            var {token: t, id: a} = await s.a.RequestParams();
            return t && (e.headers["X-User-Token"] = t),
            a && (e.headers["X-User-Id"] = a),
            e.headers.pcVer = 2,
            e
        }
        );
        var p = !1;
        i.a.interceptors.response.use(async e => {
            var t = e.config.url.toLowerCase();
            if (e.config && (-1 != t.indexOf(".hj") || -1 != t.indexOf(".jpg.txt") || -1 != t.indexOf(".jpeg.txt") || -1 != t.indexOf(".png.txt") || -1 != t.indexOf(".gif.txt")))
                return e;
            if (e.config && -1 != e.config.url.indexOf("/login/conf"))
                return e.data.isEncrypted && (e.data.data = JSON.parse(d.Base64.decode(d.Base64.decode(d.Base64.decode(e.data.data))))),
                e.data.data.redirectTo && (window.location.href = "" + e.data.data.redirectTo + window.location.pathname + window.location.search),
                e.data;
            if (e && e.headers && (e.headers.reload || e.headers.Reload) && window.location.reload(!0),
            e && e.data && 3 == e.data.errorCode)
                "/login" != location.pathname && (o.a.push("/login"),
                sessionStorage.setItem("vipPath", "true"),
                s.a.remove(s.a.TOKEN),
                s.a.remove(s.a.ID),
                s.a.remove(s.a.USER),
                s.a.set(s.a.NOTLOGIN, s.a.NOTLOGIN, 31536e3),
                r.a.commit("updateLogin", !1));
            else if (e && e.data && 1006 == e.data.errorCode)
                u.$confirm({
                    title: "提示",
                    message: e.data.message,
                    confirmButtonText: "我知道了",
                    center: !0
                });
            else if (e && e.data && e.data.errorCode == m.ErrorNotLogin)
                r.a.commit("updateLogin", !1),
                s.a.remove(s.a.TOKEN),
                s.a.remove(s.a.ID),
                s.a.remove(s.a.USER),
                s.a.set(s.a.NOTLOGIN, s.a.NOTLOGIN, 31536e3),
                u.$message.close(),
                p || (p = !0,
                u.$confirm("您的登录令牌已过期，是否重新登录?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then( () => {
                    p = !1,
                    u.$loginWindow()
                }
                ).catch( () => {
                    p = !1,
                    "Index" != o.a.history.current.name && "Details" != o.a.history.current.name && o.a.push("/home")
                }
                ));
            else if (e && e.data && e.data.errorCode == m.UserDisabled)
                r.a.commit("updateLogin", !1),
                s.a.remove(s.a.TOKEN),
                s.a.remove(s.a.ID),
                s.a.remove(s.a.USER),
                s.a.set(s.a.NOTLOGIN, s.a.NOTLOGIN, 31536e3),
                u.$message.close(),
                u.$message.error(e.data.message),
                "Index" != o.a.history.current.name && "Details" != o.a.history.current.name && "Login" != o.a.history.current.name && o.a.push("/home");
            else {
                if (e && e.data && e.data.errorCode == m.UserDisabledOther)
                    return "Index" != o.a.history.current.name && "homepage_index" != o.a.history.current.name && u.$message.error(e.data.message),
                    e.data;
                if (!e || !e.data || e.data.errorCode != m.InObservationPeriod)
                    return e && e.data && 1010 == e.data.errorCode ? (t = `满足下列规则无法自助删除：\n 1.出售帖被购买人数大于等于10。 \n 2.回复数大于等于100的帖。 \n 联系官方客服说明删帖原因。 \n 客服联系方式：${r.a.state.configUrl.customerService || "暂无"} <button class="ClipboardBtn">复制</button> \n \n 格式为： \n \n 用户ID： \n 用户昵称： \n 帖子ID： \n 需要删除的理由： \n \n 由官方后台为您处理。`,
                    u.$alert(`<pre style="text-align:left;">${t}</pre>`, "对不起，您无法删除这个帖子", {
                        confirmButtonText: "关闭",
                        showClose: !1,
                        center: !0,
                        dangerouslyUseHTMLString: !0
                    }),
                    setTimeout( () => {
                        document.querySelector(".ClipboardBtn").addEventListener("click", () => {
                            Object(l.g)(r.a.state.configUrl.customerService, "复制成功")
                        }
                        )
                    }
                    , 0),
                    Promise.resolve({
                        errorCode: 1010
                    })) : (u.$message.close(),
                    t = await c.main(e, null, ["/api/store/give_hot_gift"].includes(e.config.url)),
                    t.data.isEncrypted && (t.data.data.results ? e.data.data.results = JSON.parse(d.Base64.decode(d.Base64.decode(d.Base64.decode(t.data.data.results)))) : -1 <= d.Base64.decode(d.Base64.decode(d.Base64.decode(t.data.data))).indexOf("{") ? e.data.data = JSON.parse(d.Base64.decode(d.Base64.decode(d.Base64.decode(t.data.data)))) : e.data.data = d.Base64.decode(d.Base64.decode(d.Base64.decode(t.data.data)))),
                    e.data);
                r.a.commit("updateLogin", !1),
                s.a.remove(s.a.TOKEN),
                s.a.remove(s.a.ID),
                s.a.remove(s.a.USER),
                s.a.set(s.a.NOTLOGIN, s.a.NOTLOGIN, 31536e3),
                u.$message.close(),
                u.$message.error(e.data.message),
                "Index" != o.a.history.current.name && "Details" != o.a.history.current.name && o.a.push("/home")
            }
        }
        ),
        t.a = i.a
    },
    6434: function(e, t, a) {
        a("caad"),
        a("14d9");
        var i = a("81ee")
          , n = a("21e4")
          , o = a("b5aa")
          , r = a("1221")
          , s = a("2f62");
        r = {
            components: {
                Verify: r.a
            },
            data() {
                return {
                    show: !1,
                    vipInfo: [],
                    levelChoose: "",
                    levelData: [],
                    durationChoose: "",
                    period: {},
                    h: 0,
                    m: 0,
                    s: 0,
                    showSm: {
                        chatCountForDay: 3,
                        diamondSaleTopic: !0,
                        discountCardId: 0,
                        discountCardNum: 0,
                        exchangeCountForDay: 1,
                        exchangeLimitForDay: 0,
                        goldSaleTopic: !1,
                        rechargeGoldRatio: 10,
                        subscribeCountForMoth: 3,
                        transferDiamond: !0
                    },
                    isShow: !1,
                    needVerify: {},
                    isPassing: !1
                }
            },
            filters: {
                timeText: function(e) {
                    return {
                        price1M: "1个月",
                        price3M: "3个月",
                        price6M: "6个月",
                        price12M: "12个月",
                        priceForever: "永久"
                    }[e] || "未知"
                },
                discountCarString(e) {
                    return 301 == e ? "九折卡" : 302 == e ? "八折卡" : 303 == e ? "七折卡" : "未知"
                }
            },
            watch: {
                show(e) {
                    0 == e && this.$store.commit("updateopenvip")
                }
            },
            computed: {
                ...Object(s.c)({
                    userInfo: "userInfo"
                }),
                price() {
                    var e, t = this.durationData, a = this.durationChoose;
                    let i = 0;
                    for (e of t)
                        e.value == a && (i = this.MoneyShow(e.price, 2));
                    return i
                },
                durationData() {
                    var e, t = this.levelChoose;
                    if ("" == t)
                        return [];
                    let a = {};
                    for (e of this.vipInfo)
                        if (e.level == t) {
                            a = e;
                            break
                        }
                    let {level: i, status: n, ...o} = a;
                    var r, s = [];
                    for (r in o)
                        s.push({
                            label: r,
                            value: r,
                            price: o[r]
                        });
                    return s
                }
            },
            created() {
                this.initTimer()
            },
            methods: {
                initTimer() {
                    var e, t = this;
                    e = 864e5,
                    setInterval( () => {
                        e -= 1e3,
                        t.h = parseInt(e / 1e3 / 60 / 60),
                        t.m = parseInt(e / 1e3 / 60 % 60),
                        t.s = parseInt(e / 1e3 % 60),
                        t.h = t.h < 10 ? "0" + t.h : t.h,
                        t.m = t.m < 10 ? "0" + t.m : t.m,
                        t.s = t.s < 10 ? "0" + t.s : t.s,
                        e <= 0 && (e = 864e5)
                    }
                    , 1e3)
                },
                async onchange(e, t=0) {
                    let a = {};
                    var i;
                    for (i of this.vipInfo)
                        if (i.level == e.value) {
                            a = i;
                            break
                        }
                    var n, r = ["level", "status"], s = this.period;
                    for (n in a)
                        if (!r.includes(n) && s.hasOwnProperty(n) && s[n]) {
                            this.durationChoose = n;
                            break
                        }
                    var c = await Object(o.E)({
                        vip: e.value
                    });
                    0 == c.errorCode && c.data && (this.showSm = c.data),
                    t && (this.levelChoose = e.value)
                },
                onshow() {
                    this.$nextTick( () => {
                        Object(i.g)().then(e => {
                            var t, {vipList: e, period: a} = e.data, i = (this.period = a,
                            []);
                            for (t of e)
                                i.push({
                                    label: "VIP" + t.level,
                                    value: t.level
                                });
                            this.levelData = i,
                            this.vipInfo = e,
                            this.show = !0,
                            i.length && (this.levelChoose = i[0].value,
                            this.onchange({
                                value: i[0].value
                            }))
                        }
                        ).catch(e => {}
                        )
                    }
                    )
                },
                async onopen() {
                    this.userInfo.diamond < this.price ? (this.needVerify = await this.getCaptcha(),
                    this.needVerify.data ? this.isShow = !0 : window.open(window.location.origin + "/personal/wallet")) : this.$confirm.confirm(`开通VIP${this.levelChoose || "未知"},需花费${parseInt(this.price)}钻石,请确认购买`, "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }).then( () => {
                        this.buyonopen()
                    }
                    ).catch( () => {}
                    )
                },
                buyonopen() {
                    var e = {
                        level: this.levelChoose,
                        month: this.durationChoose
                    };
                    Object(i.f)(e).then(e => {
                        this.$emit("openvip"),
                        this.$message.success("开通成功"),
                        this.show = !1
                    }
                    ).catch(e => {
                        this.$message.warning(e)
                    }
                    )
                },
                async getCaptcha() {
                    return Object(n.e)("preBuyCaptcha")
                },
                async submit(e) {
                    e.isPassing && window.open(window.location.origin + "/personal/wallet")
                },
                closeVerify() {
                    this.isShow = !1
                }
            }
        },
        a("ec3e"),
        s = a("2877"),
        a = Object(s.a)(r, (function() {
            var e = this
              , t = e._self._c;
            return t("div", [t("el-dialog", {
                attrs: {
                    top: "20vh",
                    "show-close": !1,
                    visible: e.show,
                    "modal-append-to-body": !0,
                    width: "720px",
                    "destroy-on-close": !1,
                    "custom-class": "my-dialog"
                },
                on: {
                    "update:visible": function(t) {
                        e.show = t
                    }
                }
            }, [t("div", {
                staticClass: "dialog-box"
            }, [t("div", {
                staticClass: "dialog_user"
            }, [t("user-avatar", {
                attrs: {
                    src: e.userInfo.avatar,
                    showVip: !0,
                    vipLevel: e.userInfo.vip
                }
            }), t("div", {
                staticClass: "userInfo"
            }, [t("div", {
                staticClass: "nickname"
            }, [e._v(e._s(e.userInfo.nickname))]), t("div", {
                staticClass: "vipExpiresTime"
            }, [e._v(e._s(e.userInfo.vipExpiresTime))])]), t("div", {
                staticClass: "iconclose",
                on: {
                    click: function(t) {
                        e.show = !1
                    }
                }
            }, [t("i", {
                staticClass: "el-icon-close"
            })])], 1), e.levelData.length ? [t("div", {
                staticClass: "levelist"
            }, e._l(e.levelData, (function(a) {
                return t("div", {
                    key: a.value,
                    staticClass: "leveitem",
                    class: {
                        choose: a.value == e.levelChoose
                    },
                    on: {
                        click: function(t) {
                            return e.onchange(a, 1)
                        }
                    }
                }, [t("div", {
                    staticClass: "vipicon",
                    class: [a.label]
                }, [e._v(e._s(a.label))])])
            }
            )), 0), t("div", {
                staticClass: "durationlist"
            }, [e._l(e.durationData, (function(a) {
                return [e.period[a.value] ? t("div", {
                    key: a.value,
                    staticClass: "durationitem",
                    class: {
                        choose: e.durationChoose == a.value
                    },
                    on: {
                        click: function(t) {
                            e.durationChoose = a.value
                        }
                    }
                }, [t("div", {
                    staticClass: "label"
                }, [e._v(e._s(e._f("timeText")(a.label)))]), t("div", {
                    staticClass: "price",
                    style: "price12M" == a.value ? "margin-top:-14px" : ""
                }, [t("div", {
                    staticClass: "diamond"
                }, [e._v(e._s(parseInt(a.price / 100)))])]), t("div", {
                    directives: [{
                        name: "show",
                        rawName: "v-show",
                        value: "price12M" == a.value,
                        expression: "item.value == 'price12M'"
                    }],
                    staticClass: "price2"
                }, [1 == e.levelChoose ? t("span", {
                    staticClass: "diamond"
                }, [e._v("1200")]) : 2 == e.levelChoose ? t("span", {
                    staticClass: "diamond"
                }, [e._v("1800")]) : 3 == e.levelChoose ? t("span", {
                    staticClass: "diamond"
                }, [e._v("2400")]) : 4 == e.levelChoose ? t("span", {
                    staticClass: "diamond"
                }, [e._v("3600")]) : e._e()]), "price12M" == a.value ? t("span", {
                    staticClass: "xsth"
                }, [e._v("限时特惠")]) : e._e()]) : e._e()]
            }
            ))], 2)] : e._e(), "price12M" == e.durationChoose ? t("div", {
                staticClass: "timer-box"
            }, [t("p", [e._v("限时特惠，距结束还剩")]), t("div", [t("span", {
                staticClass: "time1"
            }, [e._v(e._s(e.h))]), t("span", [e._v("时")]), t("span", {
                staticClass: "time1"
            }, [e._v(e._s(e.m))]), t("span", [e._v("分")]), t("span", {
                staticClass: "time1"
            }, [e._v(e._s(e.s))]), t("span", [e._v("秒")])])]) : e._e(), t("div", {
                staticClass: "onbuy",
                on: {
                    click: e.onopen
                }
            }, [e._v(e._s(e.userInfo.diamond >= e.price ? "立即购买" : "当前钻石不足，请先充值"))]), t("div", {
                staticClass: "balance"
            }, [e._v("钻石余额:" + e._s(e.userInfo.diamond))]), t("div", {
                staticClass: "qxsm"
            }, [t("div", {
                staticClass: "title"
            }, [t("span"), t("span", [e._v("权限说明")]), t("span")]), t("div", {
                staticClass: "list"
            }, [t("ul", [t("li", [t("span", [e._v("每月提款次数")]), t("span", [e._v(e._s(e.showSm.exchangeCountForDay) + "次")])]), t("li", [t("span", [e._v("每日提款上限")]), t("span", [e._v(e._s(e.MoneyShow(e.showSm.exchangeLimitForDay, 2)))])]), t("li", [t("span", [e._v("每日免费私信条数")]), t("span", [e._v(e._s(e.showSm.chatCountForDay) + "条")])]), t("li", [t("span", [e._v("钻石兑金币赠送比例")]), t("span", [e._v(e._s(e.showSm.rechargeGoldRatio) + "%")])]), t("li", [t("span", [e._v("每月免费订阅次数")]), t("span", [e._v(e._s(e.showSm.subscribeCountForMoth) + "次")])]), e.showSm.discountCardId && e.showSm.discountCardNum ? t("li", [t("span", [e._v("每月赠送打折卡")]), t("span", [e._v(e._s(e._f("discountCarString")(e.showSm.discountCardId)) + e._s(e.showSm.discountCardNum) + "张")])]) : e._e()])])])], 2)]), e.isShow ? t("verify", {
                attrs: {
                    closeVerify: e.closeVerify,
                    isShow: e.isShow
                },
                on: {
                    submit: e.submit
                }
            }) : e._e()], 1)
        }
        ), [], !1, null, "1e045b87", null);
        t.a = a.exports
    },
    "67f5": function(e, t, a) {
        a.d(t, "l", (function() {
            return n
        }
        )),
        a.d(t, "k", (function() {
            return o
        }
        )),
        a.d(t, "n", (function() {
            return r
        }
        )),
        a.d(t, "m", (function() {
            return s
        }
        )),
        a.d(t, "d", (function() {
            return c
        }
        )),
        a.d(t, "c", (function() {
            return l
        }
        )),
        a.d(t, "b", (function() {
            return d
        }
        )),
        a.d(t, "a", (function() {
            return u
        }
        )),
        a.d(t, "h", (function() {
            return m
        }
        )),
        a.d(t, "g", (function() {
            return p
        }
        )),
        a.d(t, "f", (function() {
            return h
        }
        )),
        a.d(t, "e", (function() {
            return g
        }
        )),
        a.d(t, "j", (function() {
            return f
        }
        )),
        a.d(t, "i", (function() {
            return v
        }
        )),
        a.d(t, "o", (function() {
            return b
        }
        ));
        var i = a("6b26");
        let n = 101
          , o = [{
            path: "/post/release",
            name: "post_release",
            meta: {
                title: "我发布的",
                menu: !0,
                activeMenu: n,
                hideBg: !0
            },
            component: () => Promise.all([a.e("homepage~relation~user"), a.e("topic~user"), a.e("homepage~user"), a.e("user")]).then(a.bind(null, "74c8"))
        }, {
            path: "/post/reply",
            name: "post_reply",
            meta: {
                title: "我回复的",
                menu: !0,
                activeMenu: n,
                hideBg: !0
            },
            component: () => Promise.all([a.e("homepage~relation~user"), a.e("topic~user"), a.e("homepage~user"), a.e("user")]).then(a.bind(null, "bfb1"))
        }, {
            path: "/post/comments",
            name: "post_comments",
            meta: {
                title: "我评论的",
                menu: !0,
                activeMenu: n,
                hideBg: !0
            },
            component: () => Promise.all([a.e("homepage~relation~user"), a.e("topic~user"), a.e("homepage~user"), a.e("user")]).then(a.bind(null, "4b0e"))
        }, {
            path: "/post/give",
            name: "post_give",
            meta: {
                title: "我点赞的",
                menu: !0,
                activeMenu: n,
                hideBg: !0
            },
            component: () => Promise.all([a.e("homepage~relation~user"), a.e("topic~user"), a.e("homepage~user"), a.e("user")]).then(a.bind(null, "919f"))
        }, {
            path: "/post/sell",
            name: "post_sell",
            meta: {
                title: "我出售的",
                menu: !0,
                activeMenu: n,
                hideBg: !0
            },
            component: () => Promise.all([a.e("homepage~relation~user"), a.e("topic~user"), a.e("homepage~user"), a.e("user")]).then(a.bind(null, "35c0"))
        }, {
            path: "/post/reward",
            name: "post_reward",
            meta: {
                title: "我的悬赏",
                menu: !0,
                activeMenu: n,
                hideBg: !0
            },
            component: () => Promise.all([a.e("homepage~relation~user"), a.e("topic~user"), a.e("homepage~user"), a.e("user")]).then(a.bind(null, "e4d9"))
        }, {
            path: "/post/collection",
            name: "post_collection",
            meta: {
                title: "收藏",
                menu: !0,
                activeMenu: n,
                hideBg: !0
            },
            component: () => Promise.all([a.e("homepage~relation~user"), a.e("topic~user"), a.e("homepage~user"), a.e("user")]).then(a.bind(null, "f7f4"))
        }, {
            path: "/post/footprint",
            name: "post_footprint",
            meta: {
                title: "足迹",
                menu: !0,
                activeMenu: n,
                hideBg: !0
            },
            component: () => Promise.all([a.e("homepage~relation~user"), a.e("topic~user"), a.e("homepage~user"), a.e("user")]).then(a.bind(null, "8e6e"))
        }, {
            path: "/post/drafts",
            name: "post_drafts",
            meta: {
                title: "草稿箱",
                menu: !0,
                activeMenu: n,
                hideBg: !0
            },
            component: () => Promise.all([a.e("homepage~relation~user"), a.e("topic~user"), a.e("homepage~user"), a.e("user")]).then(a.bind(null, "6e3a"))
        }]
          , r = 201
          , s = [{
            path: "/task/index",
            name: "task_index",
            meta: {
                title: "任务中心",
                menu: !0,
                activeMenu: r,
                hideBg: !0
            },
            component: () => Promise.all([a.e("homepage~relation~user"), a.e("topic~user"), a.e("homepage~user"), a.e("user")]).then(a.bind(null, "9e14"))
        }]
          , c = 301
          , l = [{
            path: "/member",
            name: "member",
            meta: {
                title: "会员中心",
                menu: !0,
                activeMenu: c,
                hideBg: !0
            },
            component: () => Promise.all([a.e("homepage~relation~user"), a.e("topic~user"), a.e("homepage~user"), a.e("user")]).then(a.bind(null, "9488"))
        }]
          , d = 401
          , u = [{
            path: "/mall/diamond",
            name: "mall_diamond",
            meta: {
                title: "钻石道具",
                menu: !0,
                activeMenu: d,
                hideBg: !0
            },
            component: () => Promise.all([a.e("homepage~relation~user"), a.e("topic~user"), a.e("homepage~user"), a.e("user")]).then(a.bind(null, "cdbd"))
        }, {
            path: "/mall/gold",
            name: "mall_gold",
            meta: {
                title: "金币道具",
                menu: !0,
                activeMenu: d,
                hideBg: !0
            },
            component: () => Promise.all([a.e("homepage~relation~user"), a.e("topic~user"), a.e("homepage~user"), a.e("user")]).then(a.bind(null, "f718"))
        }]
          , m = 701
          , p = [{
            path: "/movie",
            name: "movie",
            meta: {
                title: "海角影城",
                menu: !0,
                activeMenu: m,
                hideBg: !0
            },
            component: () => Promise.all([a.e("homepage~relation~user"), a.e("topic~user"), a.e("homepage~user"), a.e("user")]).then(a.bind(null, "9488"))
        }]
          , h = 501
          , g = [{
            path: "/message/interactive",
            name: "message_interactive",
            meta: {
                title: "互动消息",
                menu: !0,
                activeMenu: h,
                hideBg: !0
            },
            component: () => Promise.all([a.e("homepage~relation~user"), a.e("topic~user"), a.e("homepage~user"), a.e("user")]).then(a.bind(null, "f19f"))
        }, {
            path: "/message/system",
            name: "message_system",
            meta: {
                title: "系统消息",
                menu: !0,
                activeMenu: h,
                hideBg: !0
            },
            component: () => Promise.all([a.e("homepage~relation~user"), a.e("topic~user"), a.e("homepage~user"), a.e("user")]).then(a.bind(null, "9d05"))
        }, {
            path: "/message/gift",
            name: "message_gift",
            meta: {
                title: "礼物消息",
                menu: !0,
                activeMenu: h,
                hideBg: !0
            },
            component: () => Promise.all([a.e("homepage~relation~user"), a.e("topic~user"), a.e("homepage~user"), a.e("user")]).then(a.bind(null, "4d60"))
        }, {
            path: "/message/direct/:target",
            name: "message_direct",
            props: e => ({
                params: e.params
            }),
            meta: {
                title: "私信",
                menu: !0,
                activeMenu: h,
                hideBg: !0
            },
            component: () => Promise.all([a.e("homepage~relation~user"), a.e("topic~user"), a.e("homepage~user"), a.e("user")]).then(a.bind(null, "bd06"))
        }]
          , f = 601
          , v = [{
            path: "/personal/datum",
            name: "personal_datum",
            meta: {
                title: "个人资料",
                menu: !0,
                hideBg: !0,
                activeMenu: f
            },
            component: () => Promise.all([a.e("homepage~relation~user"), a.e("topic~user"), a.e("homepage~user"), a.e("user")]).then(a.bind(null, "cf41"))
        }, {
            path: "/personal/wallet",
            name: "personal_wallet",
            meta: {
                title: "我的钱包",
                menu: !0,
                hideBg: !0,
                activeMenu: f
            },
            component: () => Promise.all([a.e("homepage~relation~user"), a.e("topic~user"), a.e("homepage~user"), a.e("user")]).then(a.bind(null, "5b47"))
        }, {
            path: "/personal/withdrawals",
            name: "personal_withdrawals",
            meta: {
                title: "提款",
                menu: !1,
                point: "personal_wallet",
                hideBg: !0,
                activeMenu: f
            },
            component: () => Promise.all([a.e("homepage~relation~user"), a.e("topic~user"), a.e("homepage~user"), a.e("user")]).then(a.bind(null, "55c8"))
        }, {
            path: "/personal/records",
            name: "personal_records",
            meta: {
                title: "提款记录",
                menu: !1,
                point: "personal_wallet",
                hideBg: !0,
                activeMenu: f
            },
            component: () => Promise.all([a.e("homepage~relation~user"), a.e("topic~user"), a.e("homepage~user"), a.e("user")]).then(a.bind(null, "f296"))
        }, {
            path: "/personal/backpack",
            name: "personal_backpack",
            meta: {
                title: "我的背包",
                menu: !0,
                hideBg: !0,
                activeMenu: f
            },
            component: () => Promise.all([a.e("homepage~relation~user"), a.e("topic~user"), a.e("homepage~user"), a.e("user")]).then(a.bind(null, "5318"))
        }, {
            path: "/personal/giftrecord",
            name: "personal_giftrecord",
            meta: {
                title: "道具礼物记录",
                menu: !0,
                hideBg: !0,
                activeMenu: f
            },
            component: () => Promise.all([a.e("homepage~relation~user"), a.e("topic~user"), a.e("homepage~user"), a.e("user")]).then(a.bind(null, "bc0a"))
        }, {
            path: "/gold/transactionlist",
            name: "personal_wallet2",
            meta: {
                title: "我的钱包",
                menu: !0,
                hideBg: !0,
                activeMenu: f
            },
            component: () => Promise.all([a.e("homepage~relation~user"), a.e("topic~user"), a.e("homepage~user"), a.e("user")]).then(a.bind(null, "5b47"))
        }]
          , b = {
            path: "/users",
            name: "users",
            component: () => Promise.all([a.e("homepage~relation~user"), a.e("topic~user"), a.e("homepage~user"), a.e("user")]).then(a.bind(null, "ac4a")),
            beforeEnter: (e, t, a) => {
                i.a.isLogon() ? a() : window.location.href = "/"
            }
            ,
            children: [...o, ...s, ...l, ...p, ...u, ...g, ...v]
        }
    },
    "6ac4": function(e, t, a) {
        e.exports = a.p + "img/background.e9dade4f.png"
    },
    "6b26": function(e, t, a) {
        a.d(t, "a", (function() {
            return i
        }
        )),
        t = a("ade3");
        class i {
            static RequestParams() {
                let e, t;
                return this.get(this.TOKEN) && "" !== this.get(this.TOKEN) && (e = this.get(this.TOKEN)),
                this.get(this.ID) && "" !== this.get(this.ID) && (t = this.get(this.ID)),
                {
                    token: e,
                    id: t
                }
            }
            static set(e, t, a) {
                var i = new Date;
                i.setTime(i.getTime() + a),
                document.cookie = e + "=" + escape(t) + ";expires=" + i.toGMTString() + ";path =/"
            }
            static get(e) {
                if (0 < document.cookie.length) {
                    var t = document.cookie.indexOf(e + "=");
                    if (-1 != t) {
                        t = t + e.length + 1;
                        let a = document.cookie.indexOf(";", t);
                        return -1 == a && (a = document.cookie.length),
                        unescape(document.cookie.substring(t, a))
                    }
                }
                return ""
            }
            static remove(e) {
                this.set(e, "", -1)
            }
            static isLogon() {
                return !(this.get(this.NOTLOGIN) || !this.get(this.TOKEN))
            }
            static logout() {
                this.remove(this.TOKEN),
                this.remove(this.ID),
                this.remove(this.USER),
                this.set(this.NOTLOGIN, this.NOTLOGIN, this.MAXEXPIRESTIME),
                window.location.href = "/"
            }
        }
        Object(t.a)(i, "NOTLOGIN", "NOTLOGIN"),
        Object(t.a)(i, "TOKEN", "token"),
        Object(t.a)(i, "USER", "user"),
        Object(t.a)(i, "ID", "uid"),
        Object(t.a)(i, "EXPIRESTIME", 6048e5),
        Object(t.a)(i, "MAXEXPIRESTIME", 31536e6)
    },
    "6b54": function(e, t, a) {
        a("6d63")
    },
    "6b9c": function(e, t, a) {},
    "6d63": function(e, t, a) {},
    "703e": function(e, t, a) {
        var i = a("a18c")
          , n = a("323e")
          , o = a.n(n);
        o.a.configure({
            easing: "ease",
            speed: 500,
            showSpinner: !1
        }),
        i.a.beforeEach( (e, t, a) => {
            o.a.start(),
            a()
        }
        ),
        i.a.afterEach( () => {
            o.a.done()
        }
        )
    },
    "73ee": function(e, t, a) {},
    "77e5": function(e, t, a) {},
    7897: function(e, t, a) {
        var i = a("dafe");
        t.a = {
            formatSeconds: e => {
                e = parseInt(e);
                var t = 0
                  , a = 0
                  , i = 0;
                return 60 < e && (t = parseInt(e / 60),
                e = parseInt(e % 60),
                60 < t) && (a = parseInt(t / 60),
                t = parseInt(t % 60),
                24 < a) && (i = parseInt(a / 24),
                a = parseInt(a % 24)),
                e = "",
                0 < t && (e = parseInt(t) + "分" + e),
                0 < a && (e = parseInt(a) + "小时" + e),
                0 < i ? parseInt(i) + "天" + e : e
            }
            ,
            avatarUrl: e => -1 != ((e = e) + "").indexOf("http") ? e : +e == e && e <= 80 && 0 <= e && "" != e ? `images/common/avatar/${e}.jpg` : "images/common/avatar/0.jpg",
            formatTime: (e, t=0) => {
                var a, n, o, r, s, [e,t=0] = [e, t];
                return null != e && "" != e ? -1 < e.indexOf("0001-01-01") ? "-" : (({Year: e, Month: a, Date: n, Hours: o, Minutes: r, Seconds: s} = Object(i.d)(e)),
                1 == t ? a + "-" + n : 2 == t ? e + `-${a}-` + n : 3 == t ? o + ":" + r : e + `-${a}-${n} ${o}:${r}:` + s) : ""
            }
            ,
            moneyType: e => 1 == +e ? "金币" : "钻石",
            showNumber: e => {
                var t;
                return +e != e ? "00" : (t = +e) < 1e3 ? e : 1e3 <= t && t < 1e5 ? Math.floor(t / 10) / 100 + "k" : 1e4 <= t && t < 1e6 ? (Math.floor(t / 10) / 100).toString().slice(0, 5) + "k" : 1e6 <= t ? Math.floor(t / 1e4) / 100 + "M" : void 0
            }
            ,
            newshowNumber: e => -1 !== e && e < 100 ? e : "99+",
            diamondShow: (e, t=1) => ([e,t=1] = [e, t],
            (2 != t ? e / 100 : e).toFixed(2)),
            bankCode: (e="") => {
                var t;
                return "" != e && 4 < (t = e.length) ? e.substring(t - 4) : e
            }
        }
    },
    "7e11": function(e, t, a) {
        a.d(t, "n", (function() {
            return o
        }
        )),
        a.d(t, "f", (function() {
            return r
        }
        )),
        a.d(t, "i", (function() {
            return s
        }
        )),
        a.d(t, "j", (function() {
            return c
        }
        )),
        a.d(t, "g", (function() {
            return l
        }
        )),
        a.d(t, "e", (function() {
            return d
        }
        )),
        a.d(t, "d", (function() {
            return u
        }
        )),
        a.d(t, "k", (function() {
            return m
        }
        )),
        a.d(t, "m", (function() {
            return p
        }
        )),
        a.d(t, "h", (function() {
            return h
        }
        )),
        a.d(t, "l", (function() {
            return g
        }
        )),
        a.d(t, "a", (function() {
            return f
        }
        )),
        a.d(t, "b", (function() {
            return v
        }
        )),
        a.d(t, "c", (function() {
            return b
        }
        )),
        a.d(t, "o", (function() {
            return O
        }
        )),
        a.d(t, "q", (function() {
            return y
        }
        )),
        a.d(t, "p", (function() {
            return C
        }
        )),
        a("14d9"),
        a("e9f5"),
        a("ab43");
        var i = a("ec7a")
          , n = a("546c");
        let o = "SHUFFLING_KEY"
          , r = "DETAILS_CRKEY"
          , s = "DETAILS_LLKEY"
          , c = "DETAILS_LRKEY"
          , l = "DETAILS_CTKEY"
          , d = "DETAILS_CCKEY"
          , u = "DETAILS_CBKEY"
          , m = "DETAILS_LTKEY"
          , p = "DETAILS_RTKEY"
          , h = "DETAILS_LBKEY"
          , g = "DETAILS_RBKEY"
          , f = "DETAILS_BTKEY"
          , v = "DETAILS_BYSKEY"
          , b = "DETAILS_BYXKEY";
        var w = [];
        for (let M = 0; M < 100; M++) {
            var A = 5 * M + 5;
            A % 2 != 0 && w.push(A)
        }
        let E = [{
            id: 1,
            width: 598,
            height: 250,
            key: o,
            tag: "轮播"
        }, {
            id: 2,
            width: 188,
            height: 397,
            key: r,
            tag: "页面右侧"
        }, {
            id: 3,
            width: 116,
            height: 94,
            key: s,
            tag: "页面左侧"
        }, {
            id: 4,
            width: 116,
            height: 94,
            key: c,
            tag: "页面右侧"
        }, {
            id: 5,
            width: 1e3,
            height: 65,
            key: l,
            tag: "顶部"
        }, {
            id: 6,
            width: 1e3,
            height: 65,
            key: d,
            tag: "中部"
        }, {
            id: 7,
            width: 1e3,
            height: 65,
            key: u,
            tag: "底部"
        }, {
            id: 8,
            width: 180,
            height: 350,
            key: m,
            tag: "首页左上"
        }, {
            id: 9,
            width: 180,
            height: 350,
            key: p,
            tag: "首页右上"
        }, {
            id: 10,
            width: 180,
            height: 350,
            key: h,
            tag: "首页左下"
        }, {
            id: 11,
            width: 180,
            height: 350,
            key: g,
            tag: "首页右下"
        }, {
            id: 12,
            width: 662,
            height: 120,
            key: f,
            tag: "板块顶部"
        }, {
            id: 13,
            width: 180,
            height: 350,
            key: v,
            tag: "板块右上"
        }, {
            id: 14,
            width: 180,
            height: 350,
            key: b,
            tag: "板块右下"
        }];
        function O(e="") {
            let t = {
                width: 0,
                height: 0
            };
            for (var a of E)
                a.key == e && (t = a);
            return t
        }
        function y(e="", t=0) {
            try {
                var a = O(e);
                a.hasOwnProperty("tag") && statistics_fuzhu(["_trackEvent", "PC端", "广告点击", a.tag + " ID:" + t])
            } catch (e) {}
        }
        function C(e="") {
            let t = null;
            for (var a of E)
                a.key == e && (t = a);
            if (t) {
                let {width: e, tag: a, height: o} = t;
                return new Promise((function(t, r) {
                    i.a.post(n.a + "/banner/banner_list", {
                        width: e,
                        tag: a,
                        height: o,
                        clientType: 2
                    }).then(e => {
                        let i = e.data;
                        i && setTimeout( () => {
                            var e, t = i.map(e => e.id);
                            t = ["_trackEvent", "PC端", "广告浏览", a + " IDS:" + t.join(",")];
                            try {
                                (e || window._czc) && ((e = e || window._czc || []).push(["_setAccount", 1279772811]),
                                e.push(t))
                            } catch (e) {}
                        }
                        , 4e3),
                        t(e)
                    }
                    ).catch(e => {
                        r(e)
                    }
                    )
                }
                ))
            }
            return new Promise((function(e) {
                e({
                    errorCode: 0,
                    message: "参数异常",
                    success: !1
                })
            }
            ))
        }
    },
    "81ee": function(e, t, a) {
        a.d(t, "h", (function() {
            return o
        }
        )),
        a.d(t, "g", (function() {
            return r
        }
        )),
        a.d(t, "e", (function() {
            return s
        }
        )),
        a.d(t, "c", (function() {
            return c
        }
        )),
        a.d(t, "d", (function() {
            return l
        }
        )),
        a.d(t, "f", (function() {
            return d
        }
        )),
        a.d(t, "a", (function() {
            return u
        }
        )),
        a.d(t, "b", (function() {
            return m
        }
        )),
        a("caad");
        var i = a("ec7a")
          , n = a("546c");
        let o = () => i.a.get(n.a + "/vip/vipSwitch")
          , r = () => i.a.get(n.a + "/vip/vipList");
        function s(e="") {
            if (["privateChat", "subscribe"].includes(e))
                return i.a.get(n.a + "/vip/queryFreeNum?type=" + e)
        }
        function c() {
            return i.a.get(n.a + "/vip/getWithdrawInfo")
        }
        function l(e={}) {
            return i.a.post(n.a + "/vip/postWithdrawOrder", e)
        }
        function d(e) {
            return i.a.post(n.a + "/vip/recharge", e)
        }
        function u(e) {
            return i.a.get(n.a + "/topic/att/" + e)
        }
        function m(e) {
            return i.a.post(n.a + "/attachment", e)
        }
    },
    "82f5": function(e, t, a) {
        a("caad"),
        a("14d9"),
        a("1236");
        var i = a("6b26")
          , n = a("7e11");
        let o = {
            props: {
                nopadding: {
                    type: Boolean,
                    default: !1
                },
                showtype: {
                    type: Number,
                    required: !0,
                    default: 0,
                    validator(e) {
                        return [0, 1, 2].includes(e)
                    }
                },
                position: {
                    type: [Number, String],
                    required: !0,
                    default: 0,
                    validator(e) {
                        return [n.n, n.i, n.j, n.f, n.g, n.e, n.d, n.k, n.m, n.h, n.l, n.a, n.b, n.c].includes(e)
                    }
                },
                indexes: {
                    type: [Number],
                    default: 0
                },
                limit: {
                    type: [Number],
                    default: 0
                },
                propsDataList: {
                    type: Array,
                    default: () => []
                }
            },
            computed: {
                itemdata() {
                    return this.propsDataList[this.indexes]
                },
                onshow() {
                    var e = this.showtype
                      , t = this.isShow;
                    if ([1, 2].includes(e))
                        return !(!this.dataList.length || !t);
                    if (0 == e && (t = this.dataList,
                    t.length)) {
                        let e = !1;
                        for (var a of t)
                            if (a.show) {
                                e = !0;
                                break
                            }
                        return e
                    }
                    return !1
                },
                containersize() {
                    var e = Object(n.o)(this.position).width;
                    return {
                        width: e + "px"
                    }
                },
                boxstyle() {
                    var e = this.showtype;
                    return [1, 2].includes(e) ? 1 == e ? {
                        left: "0px"
                    } : {
                        right: "0px"
                    } : {}
                }
            },
            created() {
                let e = this.showtype;
                [0, 1, 2].includes(e) && Object(n.p)(this.position).then(t => {
                    if (t = t.data || [],
                    0 == e)
                        for (var a of t)
                            a.show = !0;
                    var i = this.limit;
                    i && t.length > i ? this.dataList = t.slice(0, i) : this.dataList = t
                }
                ).catch( () => {
                    this.dataList = []
                }
                )
            },
            data() {
                return {
                    isShow: !0,
                    current: 0,
                    dataList: []
                }
            },
            methods: {
                closeBanner(e) {
                    var t;
                    this.$store.state.isLogin ? (t = null == (t = JSON.parse(sessionStorage.getItem("response"))) || null == (t = t.data) ? void 0 : t.user,
                    Number(null == t ? void 0 : t.vip) <= 0 ? this.$confirm({
                        message: "您还不是会员，无法使用会员权益<br /> 开通会员即可免除站内广告 <br /> 并且还有专属会员路线可以使用",
                        confirmButtonText: "开通VIP",
                        cancelButtonText: "我再想想",
                        showCancelButton: !0,
                        dangerouslyUseHTMLString: !0,
                        center: !0
                    }).then( () => {
                        this.$router.push("/member")
                    }
                    ) : null != e && e.show ? e.show = !1 : this.isShow = !1) : this.$confirm({
                        title: "提示",
                        message: "您未登录，是否前往登录？",
                        confirmButtonText: "登录"
                    }).then( () => {
                        this.$router.push("/login")
                    }
                    )
                },
                toTopTopic(e) {
                    if (e.url) {
                        Object(n.q)(this.position, e.id);
                        var t = e.url.replace(/^\s*|\s*$/g, "");
                        if (-1 != e.url.indexOf("api/banner/jump_yl")) {
                            var {token: e, id: a} = i.a.RequestParams();
                            if (e && a)
                                return window.open(t + `?uid=${a}&token=` + e),
                                !1
                        }
                        window.open(t)
                    }
                }
            }
        }
          , r = o
          , s = (a("952a"),
        a("2877"))
          , c = Object(s.a)(r, (function() {
            var e = this
              , t = e._self._c;
            return e.onshow ? t("div", {
                staticClass: "containeradvertising",
                class: {
                    haslist: 0 == e.showtype,
                    nopadding: 0 == e.showtype && e.nopadding,
                    hasfixed: 1 == e.showtype || 2 == e.showtype
                },
                style: e.boxstyle
            }, [1 == e.showtype || 2 == e.showtype ? [t("div", {
                staticClass: "shutdown"
            }, [t("div", {
                staticClass: "icontext",
                on: {
                    click: function(t) {
                        return t.stopPropagation(),
                        e.closeBanner.apply(null, arguments)
                    }
                }
            }, [e._v("关闭")])]), t("div", {
                staticClass: "layoutContainer"
            }, [e._l(e.dataList, (function(a) {
                return t("div", {
                    key: a.id,
                    staticClass: "listContainer",
                    on: {
                        click: function(t) {
                            return t.stopPropagation(),
                            e.toTopTopic(a)
                        }
                    }
                }, [t("div", {
                    staticClass: "imgcontainer",
                    style: e.containersize
                }, [t("img", {
                    directives: [{
                        name: "lazyloadimg",
                        rawName: "v-lazyloadimg",
                        value: {
                            remoteUrl: a.imgUrl + ".txt",
                            id: a.id
                        },
                        expression: "{ remoteUrl: item.imgUrl + '.txt', id: item.id }"
                    }],
                    staticStyle: {
                        "max-width": "116px",
                        "object-fit": "cover",
                        margin: "auto"
                    },
                    attrs: {
                        "data-id": a.id
                    }
                })]), t("div", {
                    staticClass: "imgname",
                    style: e.containersize
                }, [e._v(e._s(a.name))])])
            }
            )), t("div", {
                staticClass: "prompt"
            }, [t("div", {
                staticClass: "promptrow",
                on: {
                    click: function(t) {
                        return t.stopPropagation(),
                        e.closeBanner.apply(null, arguments)
                    }
                }
            }, [t("div", {
                staticClass: "prompttext"
            }, [e._v("广告")]), e._m(0)])])], 2)] : [e._l(e.dataList, (function(a) {
                return [a.show ? t("div", {
                    key: a.id,
                    staticClass: "listContainer",
                    style: e.containersize,
                    on: {
                        click: function(t) {
                            return t.stopPropagation(),
                            e.toTopTopic(a)
                        }
                    }
                }, [t("img", {
                    directives: [{
                        name: "lazyloadimg",
                        rawName: "v-lazyloadimg",
                        value: {
                            remoteUrl: a.imgUrl + ".txt",
                            id: a.id
                        },
                        expression: "{ remoteUrl: item.imgUrl + '.txt', id: item.id }"
                    }],
                    staticStyle: {
                        "object-fit": "cover",
                        margin: "auto",
                        display: "block"
                    },
                    attrs: {
                        "data-id": a.id
                    }
                }), t("div", {
                    staticClass: "promptrow",
                    on: {
                        click: function(t) {
                            return t.stopPropagation(),
                            e.closeBanner(a)
                        }
                    }
                }, [t("div", {
                    staticClass: "prompttext"
                }, [e._v("广告")]), e._m(1, !0)])]) : e._e()]
            }
            ))]], 2) : e._e()
        }
        ), [function() {
            var e = this._self._c;
            return e("div", {
                staticClass: "promptclose"
            }, [e("i", {
                staticClass: "el-icon-close"
            })])
        }
        , function() {
            var e = this._self._c;
            return e("div", {
                staticClass: "promptclose"
            }, [e("i", {
                staticClass: "el-icon-close"
            })])
        }
        ], !1, null, "3e891ec2", null);
        t.a = c.exports
    },
    8566: function(e, t, a) {
        a.d(t, "a", (function() {
            return r
        }
        )),
        a("14d9"),
        a("e9f5"),
        a("7d54"),
        a("e9c4");
        let i = Object.prototype.toString;
        function n(e) {
            return encodeURIComponent(e).replace("/%40/g", "@").replace("/%3A/ig", ":").replace("/%24/g", "$").replace("/%2C/ig", ",").replace("/%20/g", "+").replace("/%5B/ig", "[").replace("/%5D/ig", "]")
        }
        function o(e, t) {
            if (t) {
                let o = [];
                Object.keys(t).forEach(e => {
                    var a = t[e];
                    if (null != a) {
                        let t = [];
                        Array.isArray(a) ? (t = a,
                        e += "[]") : t = [a],
                        t.forEach(t => {
                            var a;
                            a = t,
                            "[object Date]" === i.call(a) ? t = t.toISOString() : null !== (a = t) && "object" == typeof a && (t = JSON.stringify(t)),
                            o.push(n(e) + "=" + n(t))
                        }
                        )
                    }
                }
                );
                var a = o.join("&");
                a && (e += (-1 === e.indexOf("?") ? "?" : "&") + a)
            }
            return e
        }
        class r {
            static get() {
                {
                    var {hash: e, href: t} = window.location
                      , e = (e = (t = "" === e ? t : e).lastIndexOf("?"),
                    t.substr(e + 1, t.length));
                    let a = {};
                    return 0 === (t = e.toString().split("&")).length ? {} : (t.forEach(e => {
                        e = e.split("="),
                        a[decodeURIComponent(e[0])] = decodeURIComponent(e[1])
                    }
                    ),
                    a)
                }
            }
            static set(e, t) {
                return o(e, t)
            }
        }
    },
    "86f4": function(e, t, a) {},
    "8b80": function(e, t, a) {
        a("2d44")
    },
    "91ae": function(e, t, a) {
        a("9e1f"),
        a("450d");
        var i = a("6ed5")
          , n = a.n(i)
          , o = (i = (a("0fb7"),
        a("f529")),
        a.n(i))
          , r = (a("e9f5"),
        a("f665"),
        a("7d54"),
        a("1236"),
        a("dafe"))
          , s = (i = a("2b0e"),
        a("81ee"))
          , c = a("1f24")
          , l = a("4360")
          , d = a("da92");
        let u = i.default.prototype;
        function m(e) {
            return -1 !== e && e < 100 ? e : "99+"
        }
        function p(e) {
            var t;
            return +e != e ? "00" : (t = +e) < 1e3 ? e : 1e3 < t && t < 1e5 ? Math.floor(t / 10) / 100 + "k" : 1e4 < t && t < 1e6 ? (Math.floor(t / 10) / 100).toString().slice(0, 5) + "k" : 1e6 < t ? Math.floor(t / 1e4) / 100 + "M" : void 0
        }
        async function h(t, a, i) {
            try {
                let e = document.querySelectorAll(".video-div")
                  , m = document.querySelectorAll(".video-div-btn");
                var r = !0;
                for (let p = 0; p < e.length; p++)
                    if (-1 != e[p].getAttribute("data-url").indexOf(".mp4"))
                        o.a.error("视频格式错误请联系管理员");
                    else {
                        e[p].getAttribute("class");
                        let o = 0
                          , h = (e[p].getAttribute("data-preview") && (o = +e[p].getAttribute("data-preview")),
                        "undefined" !== e[p].getAttribute("key-path") && e[p].getAttribute("key-path") ? e[p].getAttribute("key-path") : "");
                        var c = e[p].getAttribute("data-id") || ""
                          , d = {
                            id: Number(c),
                            resource_id: Number(i.topicId),
                            resource_type: "topic",
                            line: ""
                        }
                          , u = await Object(s.b)(d);
                        Number(i.topicId);
                        let g = new DPlayer({
                            container: document.getElementById(e[p].id),
                            video: {
                                url: u.data.remoteUrl,
                                type: "customHls",
                                customType: {
                                    customHls: function(e, t) {
                                        var a = new Hls({
                                            debug: !1,
                                            p2pConfig: {
                                                live: !1
                                            }
                                        });
                                        a.on(Hls.Events.MANIFEST_PARSED, (function(e, t) {
                                            let a = 0;
                                            if (null != t.levels[0].details.fragments && t.levels[0].details.fragments.length)
                                                for (var i = h + t.levels[0].details.fragments[0].levelkey.reluri; a <= t.levels[0].details.fragments.length - 1; ) {
                                                    t.levels[0].details.fragments[a].levelkey.reluri = i;
                                                    var n = t.levels[0].details.fragments[a].relurl;
                                                    -1 === n.indexOf("http") && (t.levels[0].details.fragments[a].relurl = h + n),
                                                    a++
                                                }
                                        }
                                        )),
                                        a.loadSource(e.src),
                                        a.attachMedia(e)
                                    }
                                }
                            }
                        })
                          , f = a[a.length - 1].id;
                        Object(s.a)(a[a.length - 1].id).then(e => {
                            var t = /class="sell-btn"[^>]*>[^<]*<video.*?<\/video>/.test(i.content);
                            if (!i.sale || 0 != i.sale.is_buy || !t) {
                                let t = "";
                                return e.data.forEach( (e, a) => {
                                    t += `<button key-path="${e.keyPath}" data-id="${i.topicId}" data-url="${e.url}" data-index="${a}" class="switchVideo">${e.name}</button>`
                                }
                                ),
                                m[p].innerHTML += `<div class="dPl.getAttribute('data-url')ayerBtn">${t}</div>`,
                                e.data
                            }
                        }
                        ).then(t => {
                            i.sale && 0 == i.sale.is_buy || document.querySelectorAll(".switchVideo").forEach( (t, a) => {
                                t.addEventListener("click", async a => {
                                    var i = t.getAttribute("data-index")
                                      , o = (t.getAttribute("data-url"),
                                    t.getAttribute("data-id"))
                                      , r = 2 === Number(i) ? "vip" : 1 === Number(i) ? "normal2" : "normal1";
                                    r = {
                                        id: Number(f),
                                        resource_id: Number(o),
                                        resource_type: "topic",
                                        line: r
                                    },
                                    r = await Object(s.b)(r),
                                    Number(o),
                                    o = JSON.parse(sessionStorage.getItem("response")),
                                    o = null == o || null == (o = o.data) ? void 0 : o.user;
                                    0 == Number(null == o ? void 0 : o.vip) && 2 == i || !(2 !== i || 0 < Number(null == o ? void 0 : o.vip) && 2 === i) ? n.a.alert("此线路提供给VIP 1 以上用户使用，请升级/开通后切换。", {
                                        title: "提示",
                                        confirmButtonText: "确认",
                                        showCancelButton: !0,
                                        cancelButtonText: "取消"
                                    }).then( () => {
                                        l.a.commit("updateopenvip", !0)
                                    }
                                    ) : (o = g.video.currentTime,
                                    (i = new DPlayer({
                                        container: document.getElementById(e[p].id),
                                        video: {
                                            url: r.data.remoteUrl,
                                            type: "customHls",
                                            customType: {
                                                customHls: function(e, t) {
                                                    var a = new Hls({
                                                        debug: !1,
                                                        p2pConfig: {
                                                            live: !1
                                                        }
                                                    });
                                                    a.on(Hls.Events.MANIFEST_PARSED, (function(e, t) {
                                                        let a = 0;
                                                        if (null != t.levels[0].details.fragments && t.levels[0].details.fragments.length)
                                                            for (var i = h + t.levels[0].details.fragments[0].levelkey.reluri; a <= t.levels[0].details.fragments.length - 1; ) {
                                                                t.levels[0].details.fragments[a].levelkey.reluri = i;
                                                                var n = t.levels[0].details.fragments[a].relurl;
                                                                -1 === n.indexOf("http") && (t.levels[0].details.fragments[a].relurl = h + n),
                                                                a++
                                                            }
                                                    }
                                                    )),
                                                    a.loadSource(e.src),
                                                    a.attachMedia(e)
                                                }
                                            }
                                        }
                                    })).seek(o),
                                    i.toggle())
                                }
                                )
                            }
                            )
                        }
                        ),
                        (t.$data.dPlayer = g).on("timeupdate", (function() {
                            0 < o && g.video.currentTime > o && (this.pause(),
                            r) && (r = !1,
                            n.a.alert("请购买出售内容，观看完整视频", "提示", {
                                confirmButtonText: "确定",
                                callback: e => {
                                    r = !0
                                }
                            }))
                        }
                        )),
                        g.on("ended", (function() {
                            r && 0 < o && (r = !1,
                            n.a.alert("请购买出售内容，观看完整视频", "提示", {
                                confirmButtonText: "确定",
                                callback: e => {
                                    r = !0
                                }
                            }))
                        }
                        ))
                    }
            } catch (e) {}
        }
        i.default.directive("content", {
            inserted(e, t) {
                setTimeout( () => {
                    let i = new IntersectionObserver(e => {
                        e.forEach(e => {
                            let n = e.target
                              , [o,s,l,g,f] = t.value
                              , v = "" + (o || "");
                            if (-1 !== v.indexOf("[/link]") && (v = v.replace(/\[link\]\s*(.*?)\s*\[\/link\]/gi, (e, t) => (t = t.trim(),
                            `<a href="${/^https?:\/\//i.test(t) ? t : "https://" + t}" target="_blank" rel="noopener noreferrer" style="color:#409EFF;">${t}</a>`))),
                            !1 === l || l) {
                                var b;
                                if (-1 != v.indexOf("[/sell]"))
                                    for (b of v.split("[/sell]")) {
                                        if (-1 == b.indexOf("[sell]"))
                                            break;
                                        var w = b.split("[sell]")[1]
                                          , A = `[sell]${w}[/sell]`;
                                        let e = '<div class="hjsell-container">';
                                        l ? (e += `<div class="hssell-title">此贴售价${1 == l.money_type ? l.amount + "金币" : (l.amount / 100).toFixed(2) + "钻石"}，已有${m((null == l ? void 0 : l.buyCount) || 0)}人购买</div>`,
                                        0 < l.buy_index ? e += `<div class="hssell-title" style="color:red;height:.4rem;line-height:.4rem">您是第${l.buy_index}个购买者</div>` : l.buy_index < 0 && (e += '<div class="hssell-title" style="color:red;height:.4rem;line-height:.4rem">您还未购买</div>')) : e += '<div class="hssell-title">此处为购买内容</div>',
                                        e += `<div class="hssell-content">${w}</div>\n                  </div>`,
                                        v = v.replace(A, e)
                                    }
                                if (-1 != v.indexOf('class="sell-btn"') && l && -1 == v.indexOf("<video")) {
                                    let t = ""
                                      , a = ""
                                      , i = 0
                                      , n = 0;
                                    if (s && 0 < s.length && s.forEach(e => {
                                        "video" == e.category && (t = e.remoteUrl,
                                        i = e.id,
                                        a = e.keyPath,
                                        n = e.video_time_length)
                                    }
                                    ),
                                    t && i) {
                                        e = (v = -1 != v.indexOf("<p>") ? (v = v.replace(/<p>/g, "")).replace(/<\/\p>/g, "") : v).split('class="sell-btn"')[1].split("[door]")[0].split('data-floor="0">')[1];
                                        let o = e;
                                        o = (o = o.split("<br />")[0]).split("<br/>")[0];
                                        var E = `<div class="preview-title" style="border:none">\n                            <div data-id="${i}">出售内容包含${0 == n ? "" : "[" + (e => {
                                            if (e && +e == e) {
                                                let t = ""
                                                  , a = "";
                                                return 1 <= e / 60 / 60 && (t = parseInt(e / 60 / 60) + "时"),
                                                1 <= e / 60 % 60 && (a = parseInt(e / 60 % 60) + "分"),
                                                t + a + (e % 60 + "秒")
                                            }
                                            return "--秒"
                                        }
                                        )(n) + "]"}视频，以下是预览30秒视频，请点击购买出售内容，查看完整视频</div>\n                            <div class="video-div" data-id="${i}" key-path="${a}" id="video_${i}" data-url="${t}" data-preview="30" style="margin-bottom:-80px"></div>\n                            <div data-id="${i}" key-path="${a}"  id="video_${i}" class="video-div-btn" data-url="${t}" data-preview="30" ></div>\n                            </div>${o}\n                            </div>`;
                                        v = v.replace(e, E)
                                    }
                                }
                            }
                            var O;
                            -1 != v.indexOf("[/door]") && v.split("[/door]").forEach(e => {
                                if (-1 != e.indexOf("[door]")) {
                                    let n = e.split("[door]")[1]
                                      , o = null == f || null == (e = f.doors) ? void 0 : e.find(e => 1 == e.type && e.id == n);
                                    e = a("1b9a");
                                    var t = a("f01f")
                                      , i = `<span>${m((null == o ? void 0 : o.view_count) || 0)} 浏览</span>\n                <span>${m((null == o ? void 0 : o.comment_count) || 0)} 评论</span>\n                <span style="visibility: ${-1 == (null == o ? void 0 : o.buy_count) ? "hidden" : "inherit"};">${m((null == o ? void 0 : o.buy_count) || 0)} 人已购买</span>`;
                                    i = `<div class="door-box" data-door="${n}" data-isValid="${o.dest_valid}" onclick="window.open('/post/details?pid=${o.id}');">\n                <div class="door-box-text">\n                <h3>${o.dest_valid ? null == o ? void 0 : o.title : "传送门已失效！"}</h3>\n                <div>\n                 ${o.dest_valid ? i : ""}\n                </div>\n                </div>\n                <div class="door-box-img" style="display:${null == o || !o.dest_valid || null != o && o.img_url ? "block" : "none"}">\n                <img src="${o.dest_valid ? e : t}" data-id="${null == o ? void 0 : o.img_url}" data-img_url="${null == o ? void 0 : o.img_url}" />\n                </div>\n                </div>`;
                                    v = v.replace(`[door]${n}[/door]`, i)
                                }
                            }
                            ),
                            -1 != v.indexOf("[/book]") && v.split("[/book]").forEach(e => {
                                if (-1 != e.indexOf("[book]")) {
                                    let o = e.split("[book]")[1];
                                    e = a("1b9a");
                                    var t = a("f01f");
                                    let r = null == f || null == (n = f.doors) ? void 0 : n.find(e => 2 == e.type && e.id == o);
                                    var i = (n = null == r ? void 0 : r.book_score) ? d.a.divide(n, 100) : 0;
                                    i = `<span>${p((null == r ? void 0 : r.view_count) || 0)} 浏览</span>\n                <span>${i} 评分</span>\n                <span style="visibility: ${-1 == (null == r ? void 0 : r.buy_count) ? "hidden" : "inherit"};">${p((null == r ? void 0 : r.buy_count) || 0)} 人已购买</span>`,
                                    i = `<div class="book-box" data-book="${o}" data-isValid="${r.dest_valid}">\n                <div class="door-box-text">\n                    <h3>${r.dest_valid ? null == r ? void 0 : r.title : "传送门已失效!"}</h3>\n                    <div style="color:red;font-size:12px">注：此传送门是书城传送门，仅支持移动端点击，电脑版暂不支持。</div>\n                    <div>${r.dest_valid ? i : ""}</div>\n                </div>\n                <div class="door-box-img" style="display:${null == r || !r.dest_valid || null != r && r.img_url ? "block" : "none"}">\n                <img src="${r.dest_valid ? e : t}" data-id="${null == r ? void 0 : r.img_url}" data-img_url="${null == r ? void 0 : r.img_url}" />\n                </div>\n                </div>`;
                                    v = v.replace(`[book]${o}[/book]`, i)
                                }
                                var n
                            }
                            ),
                            setTimeout( () => {
                                document.querySelectorAll("[data-img_url]").forEach(e => {
                                    e = e.getAttribute("data-img_url"),
                                    "undefined" != e && Object(r.a)(e, e, () => {}
                                    )
                                }
                                )
                            }
                            , 200),
                            -1 != v.indexOf("[/link]") && v.split("[/link]").forEach(e => {
                                var t, a;
                                -1 != e.indexOf("[link") && (a = `<div class="text-open-link">\n                <p>${t = null == (t = e.match(/\[link+(.*)\]+(.*)/)) ? void 0 : t[2]}</p>\n                <div><a href="${null == (e = null == (e = e.match(/\[link+(.*)\]/)) ? void 0 : e[1].match(/[url=&#34;]+(.*)+(&#34;)/)) ? void 0 : e[1]}" target="_blank">点我去看看</a></div>\n                </div>`,
                                v = v.replace(`[link url=&#34;${null == e ? void 0 : e[1]}&#34;]${t}[/link]`, a))
                            }
                            );
                            let y = 0;
                            if (-1 != v.indexOf("<img") || -1 != v.indexOf("</video>"))
                                if (v = (v = (v = (v = (v = (v = v.replace(/src="(\S)*\.hj"/gi, 'src="/images/common/project/loading.gif"')).replace(/src="(\S)*\.jpg.txt"/gi, 'src="/images/common/project/loading.gif"')).replace(/src="(\S)*\.jpeg.txt"/gi, 'src="/images/common/project/loading.gif"')).replace(/src="(\S)*\.png.txt"/gi, 'src="/images/common/project/loading.gif"')).replace(/src="(\S)*\.gif.txt"/gi, 'src="/images/common/project/loading.gif"')).replace(/src=""/gi, 'src="/images/common/project/loading.gif"'),
                                s)
                                    for (var C of s)
                                        "video" == C.category && (O = `<div class="video-div" data-id="${C.id}" id="video_${C.id}_${(new Date).getTime()}" key-path="${C.keyPath}" data-url="${C.remoteUrl}"></div><div data-id="${C.id}" id="video_${C.id}_${(new Date).getTime()}" class="video-div-btn" key-path="${C.keyPath}" data-url="${C.remoteUrl}"></div>`,
                                        v = v.replace(/\<video([\s\S]*)<\/video>/gi, O)),
                                        Object(r.h)(C).finally( () => {
                                            y++,
                                            s.length == y && setTimeout( () => {
                                                Object(r.f)()
                                            }
                                            , 500)
                                        }
                                        );
                                else
                                    setTimeout( () => {
                                        Object(r.f)()
                                    }
                                    , 500);
                            -1 != v.indexOf('class="video-div"') && (async () => {
                                try {
                                    var e, t;
                                    (await Object(c.j)()).success ? setTimeout( () => {
                                        h(g, s, f),
                                        Object(r.f)()
                                    }
                                    , 550) : (e = a("9a8c"),
                                    t = `\n                                <div class="novdedio">\n                                    <img resource-id="${f.topicId}" data-id="${f.attachments[f.attachments.length - 1].id}" src="/images/common/project/loading.gif"  />\n                                    <img class="palyerbtn" src="${e}"/>\n                                </div>`,
                                    v = v.replace(/<div\s+class="video-div"[^>]*>(.*?)<\/div>/g, t),
                                    n.innerHTML = v,
                                    setTimeout( () => {
                                        document.querySelectorAll(".novdedio").forEach( (e, t) => {
                                            e.addEventListener("click", async e => {
                                                u.$loginWindow()
                                            }
                                            )
                                        }
                                        )
                                    }
                                    , 500))
                                } catch (e) {
                                    return e
                                }
                            }
                            )(),
                            n.innerHTML = v,
                            i.unobserve(n)
                        }
                        )
                    }
                    );
                    i.observe(e)
                }
                , 50)
            }
        }),
        i.default.directive("lazyloadimg", {
            bind: function(e, t) {
                let a = new IntersectionObserver(e => {
                    e.forEach(e => {
                        e = e.target,
                        function e(t, a, i) {
                            a.src = "/images/common/project/loading.gif",
                            a.setAttribute("lazy", "loading"),
                            Object(r.h)(t.value).then(n => {
                                a.src = n,
                                a.onload = function() {
                                    a.setAttribute("lazy", "loaded")
                                }
                                ,
                                a.onerror = function() {
                                    a.src = "/images/common/setqrimg2.png",
                                    a.setAttribute("lazy", "error"),
                                    a.onload = null,
                                    a.onerror = null,
                                    a.onclick = function(n) {
                                        window.event ? window.event.cancelBubble = !0 : n.stopPropagation(),
                                        e(t, a, i)
                                    }
                                }
                            }
                            ).finally( () => {
                                i.unobserve(a)
                            }
                            )
                        }(t, e, a)
                    }
                    )
                }
                );
                a.observe(e)
            }
        })
    },
    "91cd": function(e, t, a) {},
    "934d": function(e, t, a) {},
    "952a": function(e, t, a) {
        a("1764")
    },
    9604: function(e, t, a) {},
    "9a8c": function(e, t, a) {
        e.exports = a.p + "img/player.ea6eb11b.png"
    },
    "9d4b": function(e, t, a) {
        a.d(t, "q", (function() {
            return o
        }
        )),
        a.d(t, "o", (function() {
            return r
        }
        )),
        a.d(t, "n", (function() {
            return c
        }
        )),
        a.d(t, "t", (function() {
            return l
        }
        )),
        a.d(t, "h", (function() {
            return d
        }
        )),
        a.d(t, "j", (function() {
            return u
        }
        )),
        a.d(t, "p", (function() {
            return m
        }
        )),
        a.d(t, "C", (function() {
            return p
        }
        )),
        a.d(t, "k", (function() {
            return h
        }
        )),
        a.d(t, "x", (function() {
            return g
        }
        )),
        a.d(t, "f", (function() {
            return f
        }
        )),
        a.d(t, "i", (function() {
            return v
        }
        )),
        a.d(t, "g", (function() {
            return b
        }
        )),
        a.d(t, "d", (function() {
            return w
        }
        )),
        a.d(t, "c", (function() {
            return A
        }
        )),
        a.d(t, "a", (function() {
            return E
        }
        )),
        a.d(t, "u", (function() {
            return O
        }
        )),
        a.d(t, "b", (function() {
            return y
        }
        )),
        a.d(t, "y", (function() {
            return C
        }
        )),
        a.d(t, "z", (function() {
            return M
        }
        )),
        a.d(t, "e", (function() {
            return I
        }
        )),
        a.d(t, "v", (function() {
            return D
        }
        )),
        a.d(t, "w", (function() {
            return P
        }
        )),
        a.d(t, "A", (function() {
            return x
        }
        )),
        a.d(t, "l", (function() {
            return j
        }
        )),
        a.d(t, "m", (function() {
            return T
        }
        )),
        a.d(t, "B", (function() {
            return R
        }
        )),
        a.d(t, "r", (function() {
            return z
        }
        )),
        a.d(t, "s", (function() {
            return B
        }
        ));
        var i = a("546c")
          , n = a("ec7a");
        function o(e) {
            return n.a.get(i.a + "/topic/nodes_by_ver/v2?ver=" + e)
        }
        function r() {
            return n.a.get(i.a + "/login/conf")
        }
        let s = {
            0: "/topic/hot/topics",
            1: "/topic/node/news",
            2: "/topic/node/topics?type=1&nodeId=258",
            3: "/topic/node/topics?type=7",
            4: "/topic/node/topics?type=3&nodeId=0",
            5: "/topic/node/topics?type=0&nodeId=14",
            6: "/topic/node/topics?type=1&nodeId=0"
        };
        function c(e) {
            var t = e.type;
            return e.page || (e.page = 1),
            delete e.type,
            n.a.get(i.a + s[t || 0], {
                params: e
            })
        }
        function l() {
            return n.a.get(i.a + "/topic/foot/topics")
        }
        function d(e) {
            return n.a.get(i.a + "/topic/" + e)
        }
        function u(e) {
            var {topic_id: e, search_type: t, page: a=1, limit: o=20} = e;
            return n.a.get(i.a + `/comment/reply_list?page=${a}&limit=${o}&topic_id=${e}&search_type=` + t)
        }
        function m(e) {
            var {replyId: e, page: t, limit: a} = e;
            return this.$axios.get(i.a + `/comment/comment_list?replyId=${e}&page=${t || 1}&limit=` + a)
        }
        function p(e, t, a) {
            return this.$axios.post(i.a + "/upload", e, {
                onUploadProgress: e => {
                    e = e.loaded / e.total * 100 | 0,
                    a && a(e)
                }
            }, t)
        }
        function h() {
            return this.$axios.get(i.a + "/user/favorite/users")
        }
        function g(e) {
            return this.$axios.post(i.a + "/comment/reply", e)
        }
        function f(e) {
            return this.$axios.post(i.a + "/comment/create", e)
        }
        function v(e) {
            return n.a.get(i.a + "/topic/like", {
                params: e
            })
        }
        function b(e) {
            return n.a.get(i.a + "/favorite/favorite", {
                params: e
            })
        }
        function w(e, t, a) {
            return this.$axios.post(i.a + "/topic/like/" + e, t, a)
        }
        function A(e) {
            return this.$axios.get(i.a + "/favorite/delete", {
                params: e
            })
        }
        function E(e) {
            return this.$axios.get(i.a + "/favorite/add", {
                params: e
            })
        }
        function O(e, t) {
            return this.$axios.get(i.a + `/${e}/searchV2`, {
                params: t
            })
        }
        function y(e) {
            return this.$axios.get(i.a + "/user/favorite", {
                params: e
            })
        }
        function C(e, t) {
            return this.$axios.post(i.a + "/topic/buy/sell", e, t)
        }
        function M(e) {
            return this.$axios.get(i.a + "/comment/subscribe", {
                params: e
            })
        }
        function I(e) {
            return n.a.post(i.a + "/topic/cancel/reward/" + e)
        }
        function D(e) {
            return n.a.get(i.a + "/topic/search_topic_by_tag", {
                params: e
            })
        }
        function P(e) {
            return n.a.get(i.a + "/user/search_user_by_tag", {
                params: e
            })
        }
        function x(e) {
            return n.a.post(i.a + "/user_pack/topic_top", e)
        }
        function j(e) {
            return n.a.get(i.a + "/ranking/give_reward", {
                params: e
            })
        }
        function T(e) {
            return n.a.get(i.a + "/user/famous", {
                params: e
            })
        }
        function R() {
            return n.a.get(i.a + "/login/signout")
        }
        function z(e) {
            return n.a.get(i.a + "/ranking/rank", {
                params: e
            })
        }
        function B(e) {
            return n.a.get(i.a + "/topic/quantify", {
                params: e
            })
        }
    },
    a18c: function(e, t, a) {
        var i = a("2b0e")
          , n = a("8c4f")
          , o = a("6b26")
          , r = a("67f5")
          , s = a("1261");
        r = [{
            path: "/home",
            name: "Index",
            meta: {
                hideBg: !0,
                title: ""
            },
            component: () => Promise.all([a.e("index~search~topic"), a.e("index~topic"), a.e("index")]).then(a.bind(null, "7677"))
        }, {
            path: "/post/details",
            name: "Details",
            meta: {
                hideBg: !0,
                title: "帖子详情"
            },
            component: () => Promise.all([a.e("index~search~topic"), a.e("index~topic"), a.e("topic~user"), a.e("pay~topic"), a.e("topic")]).then(a.bind(null, "e836"))
        }, {
            path: "/es",
            name: "Es",
            meta: {
                hideBg: !0,
                title: "搜索"
            },
            component: () => Promise.all([a.e("index~search~topic"), a.e("search")]).then(a.bind(null, "6fc9"))
        }, {
            path: "/article",
            name: "article",
            meta: {
                hideBg: !0
            },
            component: () => Promise.all([a.e("index~search~topic"), a.e("index~topic"), a.e("topic~user"), a.e("pay~topic"), a.e("topic")]).then(a.bind(null, "230c"))
        }, {
            path: "/login",
            name: "Login",
            meta: {
                hideTopHead: !0
            },
            component: () => a.e("oauth").then(a.bind(null, "e40f"))
        }, {
            path: "/register",
            name: "Register",
            meta: {
                hideTopHead: !0
            },
            component: () => a.e("oauth").then(a.bind(null, "a73b"))
        }, {
            path: "/forget",
            name: "Forget",
            meta: {
                hideTopHead: !0
            },
            component: () => a.e("oauth").then(a.bind(null, "f420"))
        }, {
            path: "/setnewpwd",
            name: "updatePwd",
            meta: {
                hideTopHead: !0
            },
            component: () => a.e("oauth").then(a.bind(null, "8458"))
        }, {
            path: "/oauth",
            component: () => Promise.all([a.e("index~search~topic"), a.e("index~topic"), a.e("topic~user"), a.e("pay~topic"), a.e("topic")]).then(a.bind(null, "9709")),
            beforeEnter: (e, t, a) => {
                o.a.isLogon() ? a() : window.location.href = "/"
            }
            ,
            children: [{
                path: "/addArticle",
                name: "addArticle",
                component: () => Promise.all([a.e("index~search~topic"), a.e("index~topic"), a.e("topic~user"), a.e("pay~topic"), a.e("topic")]).then(a.bind(null, "a91c"))
            }, {
                path: "/updateArticle",
                name: "updateArticle",
                component: () => Promise.all([a.e("index~search~topic"), a.e("index~topic"), a.e("topic~user"), a.e("pay~topic"), a.e("topic")]).then(a.bind(null, "4c4e"))
            }]
        }, a("1890").c, r.o, s.c, {
            path: "/pay/alipay",
            name: "alipayPage",
            meta: {
                title: "支付宝支付",
                hideBg: !0,
                hideTopHead: !0
            },
            component: () => Promise.all([a.e("pay~topic"), a.e("pay")]).then(a.bind(null, "bd26"))
        }, {
            path: "/pay/threepay",
            name: "threePayPage",
            meta: {
                title: "支付宝支付",
                hideBg: !0,
                hideTopHead: !0
            },
            component: () => Promise.all([a.e("pay~topic"), a.e("pay")]).then(a.bind(null, "045d"))
        }, {
            path: "/error",
            name: "error",
            meta: {
                title: "错误",
                hideBg: !0
            },
            component: () => Promise.all([a.e("index~search~topic"), a.e("index~topic"), a.e("index")]).then(a.bind(null, "52cd"))
        }, {
            path: "*",
            name: "error",
            meta: {
                title: "错误",
                hideBg: !0
            },
            component: () => Promise.all([a.e("index~search~topic"), a.e("index~topic"), a.e("index")]).then(a.bind(null, "52cd"))
        }],
        i.default.use(n.a),
        s = new n.a({
            mode: "history",
            base: "/",
            routes: r
        });
        t.a = s
    },
    a1b3: function(e, t, a) {
        a("934d")
    },
    a228: function(e, t, a) {
        a("9604")
    },
    a234: function(e, t, a) {},
    a327: function(e, t, a) {
        a("4dae")
    },
    ac1f: function(e, t, a) {
        var i = {
            name: "HjGap",
            props: {
                height: {
                    type: [String, Number],
                    default() {
                        return 10
                    }
                },
                marginTop: {
                    type: [String, Number],
                    default() {
                        return 0
                    }
                },
                marginBottom: {
                    type: [String, Number],
                    default() {
                        return 0
                    }
                },
                backgroundColor: {
                    type: String,
                    default() {
                        return "transparent"
                    }
                }
            }
        }
          , n = a("2877")
          , o = Object(n.a)(i, (function() {
            return (0,
            this._self._c)("div", {
                staticClass: "__hj_gap",
                staticStyle: {
                    width: "100%"
                },
                style: {
                    height: this.height + "px",
                    backgroundColor: this.backgroundColor
                }
            })
        }
        ), [], !1, null, null, null).exports
          , r = (i = (o.install = e => e.component(o.name, o),
        o),
        {
            name: "HjLevel",
            props: {
                level: {
                    type: [String, Number]
                }
            }
        })
          , s = (a("111d"),
        Object(n.a)(r, (function() {
            var e = this;
            return (0,
            e._self._c)("div", {
                staticClass: "_hj-level d-inline",
                on: {
                    click: function(t) {
                        return e.$emit("onlevel")
                    }
                }
            }, [e._v("Lv " + e._s(e.$slots.default[0].text))])
        }
        ), [], !1, null, null, null).exports)
          , c = (r = (s.install = e => e.component(s.name, s),
        s),
        {
            name: "HjDiyModal",
            props: {
                visible: {
                    type: Boolean,
                    default: !1,
                    validator(e) {
                        return !e || "boolean" == typeof e
                    }
                },
                baColor: {
                    type: String,
                    default: "transparent"
                }
            },
            methods: {
                close(e) {
                    "c_modal md-show" === e.target._prevClass && this.$emit("cancel")
                }
            }
        })
          , l = (a("268e"),
        Object(n.a)(c, (function() {
            var e = this
              , t = e._self._c;
            return t("div", {
                staticClass: "hj-modal",
                class: e.visible ? "md-show" : "",
                style: "background-color: " + e.baColor,
                on: {
                    "!click": function(t) {
                        return e.close(t)
                    }
                }
            }, [t("div", {
                staticClass: "md-modal"
            }, [t("div", {
                staticClass: "md-content",
                class: e.visible ? "md-show" : ""
            }, [e._t("default")], 2)])])
        }
        ), [], !1, null, "34b2cfb1", null).exports);
        l.install = e => e.components(l.name, l),
        n = l;
        let d = a("2b0e").default.extend(a("d932").default)
          , u = 1
          , m = e => {
            var t = "notice-" + u++;
            e = e || {},
            e = new d({
                data: e
            });
            return m.id = t,
            m.vm = e.$mount(),
            m.vm.visible = !0,
            m.dom = m.vm.$el,
            document.body.appendChild(m.dom),
            m.vm
        }
        ;
        var p = m
          , h = a("e338");
        let g = [i, r, n];
        c = e => {
            g.forEach(t => {
                e.component(t.name, t)
            }
            ),
            e.prototype.$loginWindow = p,
            e.prototype.$hjConfirm = h.a
        }
        ,
        "undefined" != typeof window && window.Vue && c(window.Vue),
        t.a = {
            version: "1.1.0",
            install: c,
            HjGap: i,
            HjLevel: r,
            HjDiyModal: n,
            LoginWindow: p,
            Confirm: h.a
        }
    },
    adce: function(e, t, a) {
        a("caad"),
        a("1236"),
        a("e9c4");
        var i = {
            name: "headicon",
            props: {
                src: {
                    type: [String, Number],
                    default: ""
                },
                certified: {
                    type: Boolean,
                    default: !1
                },
                size: {
                    type: [String, Number],
                    default: "65px"
                },
                radius: {
                    type: String,
                    default: "50%"
                },
                showVip: {
                    type: Boolean,
                    default: !1
                },
                vipLevel: {
                    type: Number,
                    default: 0,
                    validator: function(e) {
                        return [0, 1, 2, 3, 4].includes(e)
                    }
                },
                showFamous: {
                    type: Boolean,
                    default: !1
                },
                iconSize: {
                    type: Number,
                    default: 15
                },
                avatarbg: {
                    type: String,
                    default: ""
                },
                origin: {
                    type: Boolean,
                    default: !1
                },
                expert: {
                    type: Boolean,
                    default: !1
                }
            },
            data() {
                return {
                    userHeadIcon: ""
                }
            },
            computed: {
                containerStyle() {
                    var e = this.size;
                    return {
                        width: e,
                        height: e
                    }
                },
                vipicon() {
                    let e = "";
                    var t = this.vipLevel;
                    return this.showVip && t ? `/images/common/vip${t}2x.png` : e
                }
            },
            watch: {
                src: {
                    handler(e) {
                        this.oninit(e)
                    }
                }
            },
            created() {
                this.$nextTick( () => {
                    this.oninit(this.src)
                }
                )
            },
            methods: {
                oninit(e="") {
                    -1 == ("" + e).indexOf("http") ? this.userHeadIcon = "" == e ? "/images/common/avatar/0.jpg" : `/images/common/avatar/${e}.jpg` : this.userHeadIcon = JSON.parse(JSON.stringify(e)) + ".txt"
                },
                headiconErr(e) {
                    e = e.srcElement;
                    var t = e.getAttribute("data-load");
                    if (t && "error" == t)
                        return e.onerror = null,
                        !1;
                    e.setAttribute("data-load", "error"),
                    e.src = "/images/common/avatar/setqrimg2.png",
                    e.onerror = null
                }
            }
        };
        a("a1b3"),
        a = a("2877"),
        a = Object(a.a)(i, (function() {
            var e = this
              , t = e._self._c;
            return t("div", {
                staticClass: "portraitcontainer",
                style: e.containerStyle,
                on: {
                    click: function(t) {
                        return e.$emit("onclick")
                    }
                }
            }, [-1 != e.userHeadIcon.indexOf("http") ? t("img", {
                directives: [{
                    name: "lazyloadimg",
                    rawName: "v-lazyloadimg",
                    value: {
                        remoteUrl: e.userHeadIcon,
                        id: e.userHeadIcon.substring(e.userHeadIcon.lastIndexOf("/") + 1)
                    },
                    expression: "{ remoteUrl: userHeadIcon, id: userHeadIcon.substring(userHeadIcon.lastIndexOf('/') + 1) }"
                }],
                staticClass: "portrait",
                style: "border-radius:" + e.radius,
                attrs: {
                    alt: "",
                    "data-id": e.userHeadIcon.substring(e.userHeadIcon.lastIndexOf("/") + 1)
                }
            }) : t("img", {
                staticClass: "portrait",
                style: "border-radius:" + e.radius,
                attrs: {
                    src: e.userHeadIcon,
                    data: e.certified + "",
                    "data-a": e.showFamous + ""
                },
                on: {
                    error: e.headiconErr
                }
            }), e.avatarbg ? t("img", {
                staticClass: "avatar-bg",
                attrs: {
                    src: e.avatarbg
                }
            }) : e._e(), e.showVip && e.vipLevel || e.showFamous || e.certified || e.expert || e.origin ? t("div", {
                staticClass: "snglecontainer",
                class: {
                    liangeg: e.showVip && e.vipLevel && e.showFamous
                }
            }, [e.expert ? [t("img", {
                staticClass: "usericon famousicon",
                attrs: {
                    src: "/images/common/expert.png"
                }
            })] : e._e(), e.origin ? [t("img", {
                staticClass: "usericon famousicon",
                attrs: {
                    src: "/images/common/original.png"
                }
            })] : e._e(), e.showFamous ? [t("img", {
                staticClass: "usericon famousicon",
                attrs: {
                    src: "/images/common/famous-icon.png"
                }
            })] : e.certified && !e.showFamous ? [t("img", {
                staticClass: "usericon famousicon",
                attrs: {
                    src: "/images/common/certified-icon.png"
                }
            })] : e._e(), e.showVip && e.vipLevel ? [t("img", {
                staticClass: "usericon vipicon",
                attrs: {
                    src: e.vipicon
                }
            })] : e._e()], 2) : e._e()])
        }
        ), [], !1, null, "7b25cd09", null);
        t.a = a.exports
    },
    b1fb: function(e, t, a) {
        a.d(t, "d", (function() {
            return i
        }
        )),
        a.d(t, "a", (function() {
            return n
        }
        )),
        a.d(t, "b", (function() {
            return o
        }
        )),
        a.d(t, "c", (function() {
            return r
        }
        ));
        let i = {
            "001": {
                showName: "[Emm]",
                img: "emoji_001.png",
                content: "[emoji]001[/emoji]"
            },
            "002": {
                showName: "[白眼]",
                img: "emoji_002.png",
                content: "[emoji]002[/emoji]"
            },
            "003": {
                showName: "[悲伤]",
                img: "emoji_003.png",
                content: "[emoji]003[/emoji]"
            },
            "004": {
                showName: "[打脸]",
                img: "emoji_004.png",
                content: "[emoji]004[/emoji]"
            },
            "005": {
                showName: "[大哭]",
                img: "emoji_005.png",
                content: "[emoji]005[/emoji]"
            },
            "006": {
                showName: "[呆]",
                img: "emoji_006.png",
                content: "[emoji]006[/emoji]"
            },
            "007": {
                showName: "[呆滞]",
                img: "emoji_007.png",
                content: "[emoji]007[/emoji]"
            },
            "008": {
                showName: "[得意]",
                img: "emoji_008.png",
                content: "[emoji]008[/emoji]"
            },
            "009": {
                showName: "[对眼]",
                img: "emoji_009.png",
                content: "[emoji]009[/emoji]"
            },
            "010": {
                showName: "[愤怒]",
                img: "emoji_010.png",
                content: "[emoji]010[/emoji]"
            },
            "011": {
                showName: "[尴尬]",
                img: "emoji_011.png",
                content: "[emoji]011[/emoji]"
            },
            "012": {
                showName: "[狗带]",
                img: "emoji_012.png",
                content: "[emoji]012[/emoji]"
            },
            "013": {
                showName: "[狗头]",
                img: "emoji_013.png",
                content: "[emoji]013[/emoji]"
            },
            "014": {
                showName: "[坏笑]",
                img: "emoji_014.png",
                content: "[emoji]014[/emoji]"
            },
            "015": {
                showName: "[挤眉]",
                img: "emoji_015.png",
                content: "[emoji]015[/emoji]"
            },
            "016": {
                showName: "[惊呆]",
                img: "emoji_016.png",
                content: "[emoji]016[/emoji]"
            },
            "017": {
                showName: "[惊讶]",
                img: "emoji_017.png",
                content: "[emoji]017[/emoji]"
            },
            "018": {
                showName: "[囧]",
                img: "emoji_018.png",
                content: "[emoji]018[/emoji]"
            },
            "019": {
                showName: "[渴望]",
                img: "emoji_019.png",
                content: "[emoji]019[/emoji]"
            },
            "020": {
                showName: "[裂开]",
                img: "emoji_020.png",
                content: "[emoji]020[/emoji]"
            },
            "021": {
                showName: "[亲亲]",
                img: "emoji_021.png",
                content: "[emoji]021[/emoji]"
            },
            "022": {
                showName: "[色]",
                img: "emoji_022.png",
                content: "[emoji]022[/emoji]"
            },
            "023": {
                showName: "[调皮]",
                img: "emoji_023.png",
                content: "[emoji]023[/emoji]"
            },
            "024": {
                showName: "[偷笑]",
                img: "emoji_024.png",
                content: "[emoji]024[/emoji]"
            },
            "025": {
                showName: "[吐]",
                img: "emoji_025.png",
                content: "[emoji]025[/emoji]"
            },
            "026": {
                showName: "[无语]",
                img: "emoji_026.png",
                content: "[emoji]026[/emoji]"
            },
            "027": {
                showName: "[笑哭]",
                img: "emoji_027.png",
                content: "[emoji]027[/emoji]"
            },
            "028": {
                showName: "[斜眼笑]",
                img: "emoji_028.png",
                content: "[emoji]028[/emoji]"
            },
            "029": {
                showName: "[疑问]",
                img: "emoji_029.png",
                content: "[emoji]029[/emoji]"
            },
            "030": {
                showName: "[晕头]",
                img: "emoji_030.png",
                content: "[emoji]030[/emoji]"
            },
            "031": {
                showName: "[皱眉]",
                img: "emoji_031.png",
                content: "[emoji]031[/emoji]"
            },
            "032": {
                showName: "[猪头]",
                img: "emoji_032.png",
                content: "[emoji]032[/emoji]"
            }
        }
          , n = {
            101: {
                showName: "[晕]",
                img: "emoji_101.png",
                content: "[emoji]101[/emoji]"
            },
            102: {
                showName: "[渴求]",
                img: "emoji_102.png",
                content: "[emoji]102[/emoji]"
            },
            103: {
                showName: "[阴险]",
                img: "emoji_103.png",
                content: "[emoji]103[/emoji]"
            },
            104: {
                showName: "[调皮蛋]",
                img: "emoji_104.png",
                content: "[emoji]104[/emoji]"
            },
            105: {
                showName: "[流泪]",
                img: "emoji_105.png",
                content: "[emoji]105[/emoji]"
            },
            106: {
                showName: "[惊]",
                img: "emoji_106.png",
                content: "[emoji]106[/emoji]"
            },
            107: {
                showName: "[淡然]",
                img: "emoji_107.png",
                content: "[emoji]107[/emoji]"
            },
            108: {
                showName: "[可怜]",
                img: "emoji_108.png",
                content: "[emoji]108[/emoji]"
            },
            109: {
                showName: "[亲一下]",
                img: "emoji_109.png",
                content: "[emoji]109[/emoji]"
            },
            110: {
                showName: "[微笑]",
                img: "emoji_110.png",
                content: "[emoji]110[/emoji]"
            }
        }
          , o = {
            201: {
                showName: "[赞]",
                img: "emoji_201.png",
                content: "[emoji]201[/emoji]"
            },
            202: {
                showName: "[恋爱]",
                img: "emoji_202.png",
                content: "[emoji]202[/emoji]"
            },
            203: {
                showName: "[认真]",
                img: "emoji_203.png",
                content: "[emoji]203[/emoji]"
            },
            204: {
                showName: "[瞪眼]",
                img: "emoji_204.png",
                content: "[emoji]204[/emoji]"
            },
            205: {
                showName: "[卑微]",
                img: "emoji_205.png",
                content: "[emoji]205[/emoji]"
            },
            206: {
                showName: "[色眼]",
                img: "emoji_206.png",
                content: "[emoji]206[/emoji]"
            },
            207: {
                showName: "[闭眼笑]",
                img: "emoji_207.png",
                content: "[emoji]207[/emoji]"
            },
            208: {
                showName: "[飞吻]",
                img: "emoji_208.png",
                content: "[emoji]208[/emoji]"
            }
        }
          , r = {
            301: {
                showName: "[开心]",
                img: "emoji_301.png",
                content: "[emoji]301[/emoji]"
            },
            302: {
                showName: "[唱歌]",
                img: "emoji_302.png",
                content: "[emoji]302[/emoji]"
            },
            303: {
                showName: "[可爱]",
                img: "emoji_303.png",
                content: "[emoji]303[/emoji]"
            },
            304: {
                showName: "[哼]",
                img: "emoji_304.png",
                content: "[emoji]304[/emoji]"
            },
            305: {
                showName: "[可乐]",
                img: "emoji_305.png",
                content: "[emoji]305[/emoji]"
            },
            306: {
                showName: "[比心]",
                img: "emoji_306.png",
                content: "[emoji]306[/emoji]"
            },
            307: {
                showName: "[吃手手]",
                img: "emoji_307.png",
                content: "[emoji]307[/emoji]"
            },
            308: {
                showName: "[不约]",
                img: "emoji_308.png",
                content: "[emoji]308[/emoji]"
            },
            309: {
                showName: "[略略略]",
                img: "emoji_309.png",
                content: "[emoji]309[/emoji]"
            }
        }
    },
    b5aa: function(e, t, a) {
        a.d(t, "A", (function() {
            return r
        }
        )),
        a.d(t, "m", (function() {
            return s
        }
        )),
        a.d(t, "P", (function() {
            return c
        }
        )),
        a.d(t, "T", (function() {
            return l
        }
        )),
        a.d(t, "Q", (function() {
            return d
        }
        )),
        a.d(t, "R", (function() {
            return u
        }
        )),
        a.d(t, "G", (function() {
            return m
        }
        )),
        a.d(t, "j", (function() {
            return p
        }
        )),
        a.d(t, "L", (function() {
            return h
        }
        )),
        a.d(t, "M", (function() {
            return g
        }
        )),
        a.d(t, "q", (function() {
            return f
        }
        )),
        a.d(t, "t", (function() {
            return v
        }
        )),
        a.d(t, "i", (function() {
            return b
        }
        )),
        a.d(t, "h", (function() {
            return w
        }
        )),
        a.d(t, "e", (function() {
            return A
        }
        )),
        a.d(t, "f", (function() {
            return E
        }
        )),
        a.d(t, "r", (function() {
            return O
        }
        )),
        a.d(t, "F", (function() {
            return y
        }
        )),
        a.d(t, "s", (function() {
            return C
        }
        )),
        a.d(t, "z", (function() {
            return M
        }
        )),
        a.d(t, "D", (function() {
            return I
        }
        )),
        a.d(t, "p", (function() {
            return D
        }
        )),
        a.d(t, "a", (function() {
            return P
        }
        )),
        a.d(t, "C", (function() {
            return x
        }
        )),
        a.d(t, "b", (function() {
            return j
        }
        )),
        a.d(t, "c", (function() {
            return T
        }
        )),
        a.d(t, "g", (function() {
            return R
        }
        )),
        a.d(t, "bb", (function() {
            return z
        }
        )),
        a.d(t, "ab", (function() {
            return B
        }
        )),
        a.d(t, "y", (function() {
            return L
        }
        )),
        a.d(t, "x", (function() {
            return N
        }
        )),
        a.d(t, "O", (function() {
            return Z
        }
        )),
        a.d(t, "B", (function() {
            return W
        }
        )),
        a.d(t, "u", (function() {
            return k
        }
        )),
        a.d(t, "k", (function() {
            return U
        }
        )),
        a.d(t, "n", (function() {
            return G
        }
        )),
        a.d(t, "Y", (function() {
            return H
        }
        )),
        a.d(t, "w", (function() {
            return S
        }
        )),
        a.d(t, "H", (function() {
            return q
        }
        )),
        a.d(t, "V", (function() {
            return K
        }
        )),
        a.d(t, "W", (function() {
            return Y
        }
        )),
        a.d(t, "Z", (function() {
            return F
        }
        )),
        a.d(t, "X", (function() {
            return Q
        }
        )),
        a.d(t, "S", (function() {
            return X
        }
        )),
        a.d(t, "o", (function() {
            return V
        }
        )),
        a.d(t, "d", (function() {
            return J
        }
        )),
        a.d(t, "E", (function() {
            return _
        }
        )),
        a.d(t, "N", (function() {
            return $
        }
        )),
        a.d(t, "U", (function() {
            return ee
        }
        )),
        a.d(t, "J", (function() {
            return te
        }
        )),
        a.d(t, "K", (function() {
            return ae
        }
        )),
        a.d(t, "l", (function() {
            return ie
        }
        )),
        a.d(t, "I", (function() {
            return ne
        }
        )),
        a.d(t, "v", (function() {
            return oe
        }
        ));
        var i = a("5e1c")
          , n = a("ec7a")
          , o = a("546c");
        function r() {
            return n.a.get(o.a + "/tag/user_parent_tags")
        }
        function s(e) {
            return n.a.get(o.a + "/tag/user_tags", {
                params: e
            })
        }
        function c(e) {
            return n.a.post(o.a + "/user/update_tags", e)
        }
        function l(e) {
            return n.a.post(o.a + "/user/update_avatar", e)
        }
        function d(e) {
            return n.a.post(o.a + "/user/update/password", e)
        }
        function u(e) {
            return n.a.post(o.a + "/user/update/phone", e)
        }
        function m(e) {
            return n.a.get(o.a + "/topic/mine/topics", {
                params: e
            })
        }
        function p(e) {
            return n.a.post(o.a + "/topic/delete/" + e)
        }
        function h(e) {
            return n.a.get(o.a + "/topic/mine_reward", {
                params: e
            })
        }
        function g(e) {
            return n.a.get(o.a + "/topic/mine_sale", {
                params: e
            })
        }
        function f(e) {
            return n.a.get(o.a + "/comment/my_comment_list", {
                params: e
            })
        }
        function v(e) {
            return n.a.get(o.a + "/comment/my_reply_list", {
                params: e
            })
        }
        function b(e) {
            return n.a.get(o.a + "/topic/remove_topic_pending", {
                params: e
            })
        }
        function w(e) {
            return n.a.get(o.a + "/topic/remove-topic-scratch", {
                params: e
            })
        }
        function A(e) {
            return n.a.get(o.a + "/topic/check-exists-scratch/" + e.pending_id)
        }
        function E(e) {
            return n.a.get(o.a + "/topic/check-topic-pending-status/" + e.pending_id)
        }
        function O(e) {
            return n.a.get(o.a + "/topic/like/topics", {
                params: e
            })
        }
        function y() {
            return n.a.get(o.a + "/topic/foot/topics")
        }
        function C() {
            return n.a.get(o.a + "/store/user_pack")
        }
        function M(e) {
            return n.a.get(o.a + "/store/log", {
                params: e
            })
        }
        function I(e) {
            return n.a.get(o.a + "/user/info/" + e)
        }
        function D(e) {
            return n.a.get(o.a + "/user/messages", {
                params: e
            })
        }
        function P(e) {
            return n.a.post(o.a + "/user/delete/message?mid=" + e)
        }
        function x() {
            return n.a.get(o.a + "/chat/list")
        }
        function j(e) {
            return n.a.get(o.a + "/chat/delete", {
                params: e
            })
        }
        function T(e) {
            return n.a.get(o.a + "/chat/messages", {
                params: e
            })
        }
        function R() {
            return n.a.post(o.a + "/chat/read_all")
        }
        function z(e) {
            return n.a.get(o.a + "/user/wealth_gold_log", {
                params: e
            })
        }
        function B(e) {
            return n.a.get(o.a + "/user/wealth_diamond_log", {
                params: e
            })
        }
        function L(e) {
            return n.a.get(o.a + "/store/list", {
                params: e
            })
        }
        function N(e) {
            return n.a.get(o.a + "/store/buy", {
                params: e
            })
        }
        function Z(e) {
            return n.a.get(o.a + "/store/give", {
                params: e
            })
        }
        function W() {
            return n.a.get(o.a + "/user/wealth")
        }
        function k(e) {
            return n.a.get(o.a + "/comment/reply_edit", {
                params: e
            })
        }
        function U(e) {
            return n.a.post(o.a + "/comment/reply_edit", e)
        }
        function G(e) {
            return n.a.get(o.a + "/topic/mine/scratches", {
                params: e
            })
        }
        function H(e={}) {
            return n.a.post(o.a + "/user/base_info", e)
        }
        function S() {
            return n.a.get(o.a + "/user/signature/status")
        }
        function q() {
            return n.a.get(o.a + "/user/nickname/status")
        }
        function K(e) {
            return n.a.post(o.a + "/user/update/nickname", e)
        }
        function Y(e) {
            return n.a.post(o.a + "/user/update/signature", e)
        }
        function F(e) {
            return n.a.post(o.a + "/user_bank/editUserBank", e)
        }
        function Q(e, t, a) {
            return i.a.post(o.a + "/upload/avatar", e, {
                onUploadProgress: e => {
                    e = e.loaded / e.total * 100 | 0,
                    a && a(e)
                }
            }, t)
        }
        function X(e) {
            return n.a.post(o.a + "/user/set_pay_password", e)
        }
        function V(e) {
            return n.a.get(o.a + "/vip/withdraw/list", {
                params: e
            })
        }
        function J(e) {
            return n.a.get(o.a + "/store/buy_give", {
                params: e
            })
        }
        function _(e) {
            return n.a.get(o.a + "/vip/getVipInfo", {
                params: e
            })
        }
        function $(e) {
            return n.a.get(o.a + "/user/search_by_id", {
                params: e
            })
        }
        function ee(e) {
            return n.a.post(o.a + "/vip/transfer/create", e)
        }
        function te() {
            return n.a.get(o.a + "/recharge/channel?plat=1")
        }
        function ae(e) {
            return n.a.post(o.a + "/recharge/create", e)
        }
        function ie() {
            return n.a.get(o.a + "/exchange/gold/item")
        }
        function ne(e) {
            return n.a.post(o.a + "/exchange/gold", e)
        }
        function oe(e) {
            return n.a.get(o.a + "/topic/buy_list", {
                params: e
            })
        }
    },
    b949: function(e, t, a) {},
    bc73: function(e, t, a) {},
    c6a9: function(e, t, a) {
        a("fbd2")
    },
    cbc2: function(e, t, a) {
        var i = a("2b0e")
          , n = a("17c6")
          , o = a.n(n)
          , r = (n = a("9339"),
        a("953d"))
          , s = r.Quill.import("blots/block/embed");
        class c extends s {
            static create(e) {
                var t = super.create();
                return t.setAttribute("src", e.url),
                t.setAttribute("controls", !0),
                t.setAttribute("controlsList", "nodownload"),
                t.setAttribute("id", "showaudio"),
                t.setAttribute("data-id", e.id),
                t
            }
            static value(e) {
                return {
                    url: e.getAttribute("src"),
                    id: e.getAttribute("data-id")
                }
            }
        }
        c.blotName = "audio",
        c.tagName = "audio",
        s = c,
        a("13d5"),
        a = r.Quill.import("blots/block/embed");
        let l = r.Quill.import("formats/link")
          , d = ["height", "width"];
        class u extends a {
            static create(e) {
                var t = super.create(e);
                return t.setAttribute("controls", "controls"),
                t.setAttribute("type", "video/mp4"),
                t.setAttribute("src", this.sanitize(e.url)),
                t.setAttribute("style", `width:${e.width};height:${e.height};`),
                t.setAttribute("data-id", e.id),
                t.setAttribute("webkit-playsinline", !0),
                t.setAttribute("playsinline", !0),
                t.setAttribute("x5-playsinline", !0),
                t.setAttribute("x5-video-orientation", "portraint"),
                t.setAttribute("x5-video-player-type", "h5"),
                t
            }
            static formats(e) {
                return d.reduce( (t, a) => (e.hasAttribute(a) && (t[a] = e.getAttribute(a)),
                t), {})
            }
            static sanitize(e) {
                return l.sanitize(e)
            }
            static value(e) {
                return {
                    url: e.getAttribute("src"),
                    width: e.getAttribute("style") ? e.getAttribute("style").split(";")[0].split(":")[1] : "",
                    height: e.getAttribute("style") ? e.getAttribute("style").split(";")[1].split(":")[1] : "",
                    id: e.getAttribute("data-id")
                }
            }
            format(e, t) {
                -1 < d.indexOf(e) ? t ? this.domNode.setAttribute(e, t) : this.domNode.removeAttribute(e) : super.format(e, t)
            }
            html() {
                var e = this.value().video;
                return `<a href="${e}">${e}</a>`
            }
        }
        u.blotName = "video",
        u.className = "ql-video",
        u.tagName = "video",
        a = u,
        r = r.Quill.import("blots/block/embed");
        class m extends r {
            static create(e) {
                var t = super.create();
                return t.setAttribute("href", e.url),
                t.setAttribute("target", "_blank"),
                t.setAttribute("download", e.name),
                t.setAttribute("id", "link-url"),
                t.setAttribute("data-id", e.id),
                t.innerText = e.name,
                t
            }
            static value(e) {
                return {
                    url: e.getAttribute("src"),
                    id: e.getAttribute("data-id"),
                    name: e.innerText
                }
            }
        }
        m.blotName = "link",
        m.tagName = "a",
        r = m,
        n.register(s, !0),
        n.register(a, !0),
        n.register(r, !0),
        s = n.imports["blots/embed"];
        class p extends s {
            static create(e) {
                var t = super.create();
                return e.url ? e.emoji ? (t.setAttribute("src", e.url),
                t.setAttribute("data-emoji", e.id),
                e.vip && t.setAttribute("data-emojiv", !0)) : (t.setAttribute("src", e.url),
                t.setAttribute("data-id", e.id),
                e.video && t.setAttribute("data-video", e.video)) : t.setAttribute("src", e),
                t
            }
            static value(e) {
                return e.getAttribute("data-emoji") ? {
                    url: e.getAttribute("src"),
                    id: e.getAttribute("data-emoji"),
                    vip: e.getAttribute("data-emojiv"),
                    emoji: !0,
                    video: e.getAttribute("data-video")
                } : {
                    url: e.getAttribute("src"),
                    id: e.getAttribute("data-id"),
                    video: e.getAttribute("data-video")
                }
            }
        }
        p.blotName = "image",
        p.tagName = "img",
        n.register(p),
        i.default.use(o.a),
        t.a = {
            install(e) {
                e.use(o.a)
            }
        }
    },
    d932: function(e, t, a) {
        a.r(t),
        a("e9c4");
        var i = a("8237")
          , n = a.n(i)
          , o = a("21e4")
          , r = a("6b26")
          , s = a("dafe");
        i = {
            name: "loginWindow",
            data() {
                return {
                    isDisabled: !1,
                    visible: !1,
                    reload: !1,
                    codeUrl: "",
                    checked: "",
                    form: {
                        Username: "",
                        Password: "",
                        CaptchaCode: "",
                        CaptchaId: "",
                        Ref: "",
                        Sign: ""
                    },
                    rules: {
                        loginName: [{
                            required: !0,
                            message: "请输入登录名",
                            trigger: "blur"
                        }],
                        password: [{
                            required: !0,
                            message: "请输入密码",
                            trigger: "blur"
                        }],
                        captchaCode: [{
                            required: !0,
                            message: "请输入验证码",
                            trigger: "blur"
                        }]
                    }
                }
            },
            methods: {
                toastFunc(e, t) {
                    let a = e.data.vip_domain;
                    var i = e.data.type;
                    if (1 != i)
                        if (2 == i)
                            this.setUserInfo(e);
                        else if (3 == i)
                            this.$confirm({
                                title: "会员特权",
                                message: "会员路线可以免广告，而且不会丢失本站哟",
                                confirmButtonText: "开通VIP",
                                cancelButtonText: "我在想想",
                                showCancelButton: !0,
                                center: !0
                            }).then( () => {
                                t.setUserInfo(e, !1),
                                window.location.href = "/member"
                            }
                            ).catch(a => {
                                t.setUserInfo(e)
                            }
                            );
                        else if (4 == i) {
                            let i = encodeURIComponent(JSON.stringify(e));
                            this.$confirm({
                                message: `您是会员，可以尝试会员线路访问<br/> 享受免广告的同时，还不会轻易丢失本站 <br/> 会员线路是：<br/><span style="color:#498ede;">${a}</span>   <button style="color:#498ede;background: transparent;border: 1px solid #498ede;border-radius: 4px;" class="ClipboardBtn">复制保存</button>`,
                                confirmButtonText: "带我去",
                                cancelButtonText: "先不去",
                                showCancelButton: !0,
                                dangerouslyUseHTMLString: !0
                            }).then( () => {
                                t.setUserInfo(e),
                                window.open(a + "?jump=" + i)
                            }
                            ).catch( () => {
                                t.setUserInfo(e)
                            }
                            ),
                            setTimeout( () => {
                                document.querySelector(".ClipboardBtn").addEventListener("click", () => {
                                    Object(s.g)(a, "复制成功")
                                }
                                )
                            }
                            , 0)
                        }
                    return !0
                },
                setUserInfo(e, t=!0) {
                    this.$message.success("登录成功");
                    var {token: a, user: i} = e.data;
                    sessionStorage.setItem("response", JSON.stringify(e)),
                    r.a.set(r.a.TOKEN, a, r.a.EXPIRESTIME),
                    r.a.set(r.a.ID, i.id, r.a.EXPIRESTIME),
                    r.a.set(r.a.USER, JSON.stringify(i), r.a.EXPIRESTIME),
                    r.a.remove(r.a.NOTLOGIN),
                    this.isLoginError = !1,
                    this.isLoginText = "",
                    t && setTimeout( () => {
                        window.location.reload()
                    }
                    , 0)
                },
                async handleSubmit(e) {
                    this.isDisabled = !0;
                    try {
                        this.form.Sign = n()(this.form.Username + this.form.Password + navigator.userAgent);
                        var t = await Object(o.d)(this.form);
                        0 == t.errorCode && t.success && this.toastFunc(t, this)
                    } catch (e) {
                        this.isDisabled = !1,
                        this.$message.error(e)
                    } finally {
                        this.loading = !this.loading,
                        this.disabled = !this.disabled,
                        this.isDisabled = !1
                    }
                },
                async getCodeImg() {
                    try {
                        var {captchaUrl: e, captchaId: t} = (await Object(o.c)()).data;
                        this.form.CaptchaId = t,
                        this.codeUrl = e
                    } catch (e) {}
                },
                close() {
                    this.visible = !1,
                    this.$destroy(!0),
                    this.$el.parentNode.removeChild(this.$el)
                }
            },
            created() {}
        },
        a("1fe7"),
        a = a("2877"),
        a = Object(a.a)(i, (function() {
            var e = this
              , t = e._self._c;
            return e.visible ? t("div", {
                staticClass: "login__window__",
                attrs: {
                    id: "hj_login__window__"
                }
            }, [t("div", {
                staticClass: "login-ssr",
                class: e.reload && "reload",
                attrs: {
                    id: "hj__ssr__box"
                }
            }, [t("div", {
                staticClass: "login-box"
            }, [t("h2", {
                staticClass: "login-title mb-0 text-left",
                attrs: {
                    slot: "title"
                },
                slot: "title"
            }, [t("span", [e._v("登录")]), t("i", {
                staticClass: "el-icon-close login-title-close hjbox-cursor",
                on: {
                    click: e.close
                }
            })]), t("el-form", {
                ref: "ruleForm",
                staticClass: "login-form",
                attrs: {
                    rules: e.rules,
                    model: e.form,
                    "status-icon": "",
                    "label-width": "0px"
                }
            }, [t("el-form-item", {
                attrs: {
                    label: "",
                    prop: "Username"
                }
            }, [t("el-input", {
                attrs: {
                    placeholder: "请输入用户名",
                    autocomplete: "off"
                },
                model: {
                    value: e.form.Username,
                    callback: function(t) {
                        e.$set(e.form, "Username", t)
                    },
                    expression: "form.Username"
                }
            }, [t("i", {
                staticClass: "el-input__icon el-icon-user",
                attrs: {
                    slot: "prefix"
                },
                slot: "prefix"
            })])], 1), t("el-form-item", {
                attrs: {
                    label: "",
                    prop: "Password"
                }
            }, [t("el-input", {
                attrs: {
                    type: "Password",
                    placeholder: "请输入密码",
                    autocomplete: "off"
                },
                model: {
                    value: e.form.Password,
                    callback: function(t) {
                        e.$set(e.form, "Password", t)
                    },
                    expression: "form.Password"
                }
            }, [t("i", {
                staticClass: "el-input__icon el-icon-lock",
                attrs: {
                    slot: "prefix"
                },
                slot: "prefix"
            })])], 1), t("el-form-item", [t("div", {
                staticClass: "d-flex justify-content-between"
            }, [t("div", [t("el-checkbox", {
                model: {
                    value: e.checked,
                    callback: function(t) {
                        e.checked = t
                    },
                    expression: "checked"
                }
            }, [e._v("记住用户名")])], 1), t("div", [t("a", {
                staticClass: "login-form-forgot mr-2",
                attrs: {
                    href: "/register"
                }
            }, [e._v("注册")]), t("a", {
                staticClass: "login-form-forgot",
                attrs: {
                    href: "/forget"
                }
            }, [e._v("忘记密码？")])])]), t("el-button", {
                staticClass: "login-form-button",
                attrs: {
                    type: "primary",
                    disabled: e.isDisabled
                },
                on: {
                    click: function(t) {
                        return e.handleSubmit("form")
                    }
                }
            }, [e._v("登 录")]), t("p", {
                staticClass: "text-right block-a"
            }, [t("a", {
                attrs: {
                    href: "javascript:void(0);"
                },
                on: {
                    click: e.close
                }
            }, [e._v("暂不登录")])])], 1)], 1)], 1)])]) : e._e()
        }
        ), [], !1, null, null, null);
        t.default = a.exports
    },
    dafe: function(e, t, a) {
        a.d(t, "i", (function() {
            return d
        }
        )),
        a.d(t, "d", (function() {
            return u
        }
        )),
        a.d(t, "c", (function() {
            return m
        }
        )),
        a.d(t, "b", (function() {
            return p
        }
        )),
        a.d(t, "l", (function() {
            return h
        }
        )),
        a.d(t, "m", (function() {
            return g
        }
        )),
        a.d(t, "f", (function() {
            return f
        }
        )),
        a.d(t, "h", (function() {
            return v
        }
        )),
        a.d(t, "a", (function() {
            return b
        }
        )),
        a.d(t, "n", (function() {
            return A
        }
        )),
        a.d(t, "j", (function() {
            return E
        }
        )),
        a.d(t, "k", (function() {
            return O
        }
        )),
        a.d(t, "e", (function() {
            return y
        }
        )),
        a.d(t, "g", (function() {
            return C
        }
        )),
        a("0fb7"),
        a("450d");
        t = a("f529");
        var i = a.n(t)
          , n = (a("14d9"),
        a("e9f5"),
        a("7d54"),
        a("1236"),
        a("e9c4"),
        new (a("2b0e").default));
        let o = "initialize"
          , r = "remind"
          , s = "setDoor"
          , c = "setBook";
        var l = a("29ad");
        a("bc3a");
        let d = {
            news: 1,
            original: 145,
            notice: 14,
            project: 15,
            majorEvents: 258,
            feedback: 283,
            qa: 99999
        };
        function u(e=null) {
            let t = new Date;
            return e && (t = new Date(e)),
            e = Date.parse(t),
            {
                Year: t.getFullYear(),
                Month: 9 < t.getMonth() + 1 ? t.getMonth() + 1 : "0" + (t.getMonth() + 1),
                Date: 9 < t.getDate() ? t.getDate() : "0" + t.getDate(),
                Hours: 9 < t.getHours() ? t.getHours() : "0" + t.getHours(),
                Minutes: 9 < t.getMinutes() ? t.getMinutes() : "0" + t.getMinutes(),
                Seconds: 9 < t.getSeconds() ? t.getSeconds() : "0" + t.getSeconds(),
                Weeks: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][t.getDay()],
                timestamp: e / 1e3,
                millisecond: e
            }
        }
        function m(e, t) {
            return e && 0 != e.length && t && e.forEach(e => {
                "video" === e.category && (e = `<img data-id="${e.id}" data-video="${e.remoteUrl}" src="/images/common/videos2x.png" data-img="${e.coverUrl}"/>`,
                t = t.replace(/\<video([\s\S]*)<\/video>/gi, e))
            }
            ),
            t
        }
        function p(e) {
            var t;
            if (e)
                return t = document.querySelector("[data-video]"),
                -1 != e.indexOf("data-video") && t && (t = `<video src="${t.getAttribute("src")}" data-id="${t.getAttribute("data-id")}"></video>`,
                e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = e.replace(/\<img src="(\S)*" data-id="(\S)*"\ data-video="(\S)*"\/>/g, t)).replace(/\<img src="(\S)*" data-id="(\S)*"\ data-video="(\S)*">/g, t)).replace(/\<img src="(\S)*" data-id="(\S)*"\ data-video="(\S)*"\/>/g, t)).replace(/\<img src="(\S)*" data-id="(\S)*"\ data-video="(\S)*">/g, t)).replace(/\<img src="(\S)*" data-id="(\S)*"\ data-video="(\S)*" key-video="(\S)*">/g, t)).replace(/\<img src="(\S)*" data-id="(\S)*"\ data-video="(\S)*" key-video="(\S)*"\/>/g, t)).replace(/\<img src="(\S)*" data-id="(\S)*"\ data-video="(\S)*" key-video="(\S)*" lazy="loaded">/g, t)).replace(/\<img src="(\S)*" data-id="(\S)*"\ data-video="(\S)*" key-video="(\S)*" lazy="loaded" \/>/g, t)).replace(/\<img src="(\S)*" data-id="(\S)*"\ data-video="(\S)*" key-video="(\S)*" data-url="(\S)*">/g, t)).replace(/\<img src="(\S)*" data-id="(\S)*"\ data-video="(\S)*" key-video="(\S)*" data-url="(\S)*" lazy="loaded">/g, t)).replace(/\<img src="(\S)*" data-id="(\S)*"\ data-video="(\S)*" key-video="(\S)*" data-url="(\S)*"\/>/g, t)).replace(/\<img src="(\S)*" data-id="(\S)*"\ data-video="(\S)*" key-video="(\S)*" data-url="(\S)*" lazy="loaded"\/>/g, t)).replace(/\<img src="(\S)*" data-id="(\S)*"\ data-video="(\S)*" lazy="loaded">/g, t)).replace(/\<img src="(\S)*" data-id="(\S)*"\ data-video="(\S)*" lazy="loaded"\/>/g, t)).replace(/\<img src="(\S)*" data-id="(\S)*"\ data-video="(\S)*" data-url="(\S)*"\/>/g, t)).replace(/\<img src="(\S)*" data-id="(\S)*"\ data-video="(\S)*" data-url="(\S)*">/g, t)).replace(/\<img src="(\S)*" data-id="(\S)*"\ data-video="(\S)*" data-url="(\S)*" lazy="loaded">/g, t)).replace(/\<img src="(\S)*" data-id="(\S)*"\ data-video="(\S)*" data-url="(\S)*" lazy="loaded"\/>/g, t)).replace(/\<img src="(\S)*" data-id="(\S)*"\ data-video="(\S)*" lazy="error">/g, t)).replace(/\<img src="(\S)*" data-id="(\S)*"\ data-video="(\S)*" lazy="error" \/>/g, t)),
                e
        }
        function h(e) {
            return (e = (e = (e = (e = e.replace(/\<img src="(\S)*" data-id="(\S)*"\/>/g, "[图片]")).replace(/\<img src="(\S)*" data-id="(\S)*">/g, "[图片]")).replace(/\<video class="ql-video" controls="controls" type="video\/mp4" src="(\S)*" style="(\S)*"\><\/video>/g, "[视频]")).replace(/\<video class="ql-video" controls="controls" type="video\/mp4" src="(\S)*" style="(\S)*" data-id="(\S)*" webkit-playsinline="true" playsinline="true" x5-playsinline="true" x5-video-orientation="portraint" x5-video-player-type="h5"\><\/video>/g, "[视频]")).replace(/\<video src="(\S)*" data-id="(\S)*"\><\/video>/g, "[视频]")
        }
        function g(e) {
            return e = h(e),
            (e = (e = (e = Object(l.b)(e)).replace(/<(\/)?(a|p|i|b|span)+>/g, "")).replace(/<span data-uid="(\S)*" {2}class="at-box">/g, "")).replace(/<.*?>/gi, "")
        }
        function f() {
            n.$emit(o);
            var e = document.querySelectorAll("[data-id]");
            e && 0 < e.length && e.forEach(e => {
                e.getAttribute("data-id") || (e.style.display = "none")
            }
            ),
            e = document.querySelectorAll(".html-box .at-box"),
            e && 0 < e.length && (e.forEach((function(e) {
                e.onclick = function() {
                    var e = this.getAttribute("data-uid");
                    n.$emit(r, e)
                }
            }
            )),
            document.querySelector(".html-box .at-box").onclick = function() {
                var e = this.getAttribute("data-uid");
                n.$emit(r, e)
            }
            ),
            e = document.querySelectorAll(".html-box .door-box"),
            e && 0 < e.length && (e.forEach((function(e) {
                e.onclick = function() {
                    var e = this.getAttribute("data-door");
                    n.$emit(s, e)
                }
            }
            )),
            document.querySelector(".html-box .door-box").onclick = function() {
                var e = this.getAttribute("data-door");
                n.$emit(s, e)
            }
            ),
            e = document.querySelectorAll(".html-box .book-box");
            e && 0 < e.length && (e.forEach((function(e) {
                e.onclick = function() {
                    var e = this.getAttribute("data-book");
                    n.$emit(c, e)
                }
            }
            )),
            document.querySelector(".html-box .book-box").onclick = function() {
                var e = this.getAttribute("data-book");
                n.$emit(c, e)
            }
            )
        }
        function v(e, t=0) {
            return new Promise((function(t, a) {
                try {
                    let a = e.remoteUrl;
                    if (a = "video" == e.category ? e.coverUrl : a)
                        -1 != a.indexOf(".hj") || -1 != a.indexOf(".txt") ? b(a, e.id, e => {
                            t(e)
                        }
                        ) : t(a);
                    else {
                        var i = e.id;
                        let t = document.querySelector('[data-id="' + i + '"]') || document.querySelector('[data-showimg="' + i + '"]');
                        var n = document.querySelectorAll('[data-id="' + i + '"]');
                        n && 1 < n.length && n.forEach(e => {
                            "IMAGE" == e.nodeName && (t = e)
                        }
                        ),
                        t && ("VIDEO" == t.nodeName || "AUDIO" == t.nodeName) || (t.src = "/images/common/setqrimg2.png",
                        t.setAttribute("lazy", "error"))
                    }
                } catch (a) {}
            }
            ))
        }
        function b(e, t, a) {
            $.ajax({
                type: "get",
                url: e,
                dataType: "text",
                success: function(i) {
                    var n = document.querySelectorAll('[data-id="' + t + '"]') || document.querySelectorAll('[data-showimg="' + t + '"]');
                    if (!i)
                        return n && 0 < n.length && n.forEach(e => {
                            e && ("VIDEO" == e.nodeName || "AUDIO" == e.nodeName) || (e.src = "/images/common/setqrimg2.png",
                            e.setAttribute("lazy", "error"))
                        }
                        ),
                        !1;
                    let o = (new w).decode(i);
                    -1 != o.indexOf("base64") ? (n && 0 < n.length && n.forEach(i => {
                        (!i || "VIDEO" != i.nodeName && "AUDIO" != i.nodeName) && (i.src = o,
                        i.setAttribute("lazy", "loaded"),
                        i.onerror = function() {
                            i.onload = null,
                            i.onerror = null,
                            i.src = "/images/common/setqrimg2.png",
                            i.onclick = function() {
                                b(e, t, a)
                            }
                        }
                        ,
                        i.getAttribute("data-src")) && setTimeout( () => {
                            i.removeAttribute("data-src")
                        }
                        , 300)
                    }
                    ),
                    a(o)) : n && 0 < n.length && n.forEach(e => {
                        e && ("VIDEO" == e.nodeName || "AUDIO" == e.nodeName) || (e.src = "/images/common/setqrimg2.png",
                        e.setAttribute("lazy", "error"))
                    }
                    )
                },
                error: function(i) {
                    var n = document.querySelectorAll('[data-id="' + t + '"]') || document.querySelectorAll('[data-showimg="' + t + '"]');
                    n && 0 < n.length && n.forEach(i => {
                        i && "VIDEO" == i.nodeName || (i.src = "images/common/setqrimg2.png",
                        i.setAttribute("lazy", "error"),
                        i.onerror = function() {
                            i.onload = null,
                            i.onerror = null,
                            i.onclick = function() {
                                b(e, t, a)
                            }
                        }
                        )
                    }
                    )
                }
            })
        }
        function w() {
            var e = "ABCD*EFGHIJKLMNOPQRSTUVWX#YZabcdefghijklmnopqrstuvwxyz1234567890"
              , t = (this.encode = function(a) {
                var i, n, o, r, s, c, l = "", d = 0;
                for (a = t(a); d < a.length; )
                    o = (i = a.charCodeAt(d++)) >> 2,
                    r = (3 & i) << 4 | (i = a.charCodeAt(d++)) >> 4,
                    s = (15 & i) << 2 | (n = a.charCodeAt(d++)) >> 6,
                    c = 63 & n,
                    isNaN(i) ? s = c = 64 : isNaN(n) && (c = 64),
                    l = l + e.charAt(o) + e.charAt(r) + e.charAt(s) + e.charAt(c);
                return l
            }
            ,
            this.decode = function(t) {
                var i, n, o, r, s, c, l = "", d = 0;
                for (t = t.replace(/[^A-Za-z0-9\*\#]/g, ""); d < t.length; )
                    o = e.indexOf(t.charAt(d++)),
                    i = (15 & (r = e.indexOf(t.charAt(d++)))) << 4 | (s = e.indexOf(t.charAt(d++))) >> 2,
                    n = (3 & s) << 6 | (c = e.indexOf(t.charAt(d++))),
                    l += String.fromCharCode(o << 2 | r >> 4),
                    64 != s && (l += String.fromCharCode(i)),
                    64 != c && (l += String.fromCharCode(n));
                return a(l)
            }
            ,
            function(e) {
                e = e.replace(/\r\n/g, "\n");
                for (var t = "", a = 0; a < e.length; a++) {
                    var i = e.charCodeAt(a);
                    i < 128 ? t += String.fromCharCode(i) : t = 127 < i && i < 2048 ? (t += String.fromCharCode(i >> 6 | 192)) + String.fromCharCode(63 & i | 128) : (t = (t += String.fromCharCode(i >> 12 | 224)) + String.fromCharCode(i >> 6 & 63 | 128)) + String.fromCharCode(63 & i | 128)
                }
                return t
            }
            )
              , a = function(e) {
                for (var t, a, i = "", n = 0, o = 0; n < e.length; )
                    (t = e.charCodeAt(n)) < 128 ? (i += String.fromCharCode(t),
                    n++) : 191 < t && t < 224 ? (o = e.charCodeAt(n + 1),
                    i += String.fromCharCode((31 & t) << 6 | 63 & o),
                    n += 2) : (o = e.charCodeAt(n + 1),
                    a = e.charCodeAt(n + 2),
                    i += String.fromCharCode((15 & t) << 12 | (63 & o) << 6 | 63 & a),
                    n += 3);
                return i
            }
        }
        function A() {
            window.ActiveXObject || "ActiveXObject"in window ? document.addEventListener("beforepaste", (function() {
                var e;
                window.clipboardData && "" != (e = window.clipboardData.getData("text")) && null != e && window.clipboardData.setData("text", e)
            }
            )) : document.addEventListener("paste", (function(e) {
                var t;
                "INPUT" != e.target.nodeName && "TEXTAREA" != e.target.nodeName && "ql-editor" == e.target.className && (e.preventDefault(),
                t = e.clipboardData) && t.items && (t = (t = (t = e.clipboardData.getData("text")).replace(/\r\n/g, "<br>")).replace(/\n/g, "<br>"),
                (e = document.createElement("div")).innerHTML = t,
                (t = window.getSelection().getRangeAt(0)).deleteContents(),
                t.insertNode(e))
            }
            )),
            document.oncontextmenu = function() {
                event.returnValue = !0
            }
            ,
            document.onselectstart = function() {}
            ,
            document.oncopy = function() {}
            ,
            document.onkeydown = function() {}
        }
        function E(e, t) {
            return t = new RegExp("(" + t + ")","g"),
            e.replace(t, '<em style="color: #DD0000;font-style: normal;">$1</em>')
        }
        function O(e) {
            Array.isArray(e) && e.forEach(e => {
                Array.isArray(e.attachments) && e.attachments.forEach(e => {
                    -1 !== e.remoteUrl.indexOf(".m3u8") && (e.remoteUrl = e.remoteUrl.replace(".m3u8", ".png"))
                }
                )
            }
            )
        }
        function y() {
            return window.ActiveXobject || "ActiveXObject"in window ? "IE" : /Trident\/7\./.test(navigator.userAgent) ? "IE11" : void 0
        }
        let C = function(e, t) {
            {
                let t = e
                  , i = document.querySelector("#copy-input");
                i || ((i = document.createElement("textarea")).id = "copy-input",
                i.readOnly = "readOnly",
                i.style.position = "fixed",
                i.style.top = "45%",
                i.style.left = "-1000px",
                i.style.zIndex = "-1000",
                document.body.appendChild(i)),
                i.value = t;
                e = i;
                var a, n = 0, o = t.length;
                e.createTextRange ? ((a = e.createTextRange()).collapse(!0),
                a.moveStart("character", n),
                a.moveEnd("character", o - n),
                a.select()) : (e.setSelectionRange(n, o),
                e.focus()),
                document.execCommand("copy") && document.execCommand("copy"),
                i.blur(),
                document.body.removeChild(i)
            }
            t && i()({
                message: t,
                type: "success"
            })
        }
    },
    db2b: function(e, t, a) {
        a("86f4")
    },
    db3c: function(e, t, a) {
        a("6b9c")
    },
    e141: function(e, t, a) {},
    e338: function(e, t, a) {
        let i = a("2b0e")
          , n = i.default.extend(a("0303").default)
          , o = 1
          , r = (e="", t) => {
            var a = "notice-" + o++;
            t = Object.assign({
                title: "提示",
                cancelText: "取消",
                okText: "确认"
            }, t),
            t.text = e,
            e = new n({
                data: t
            });
            return r.id = a,
            r.vm = e.$mount(),
            r.vm.visible = !0,
            r.dom = r.vm.$el,
            document.body.appendChild(r.dom),
            r.vm
        }
        ;
        t.a = r
    },
    e48b: function(e, t, a) {
        a("9e1f"),
        a("450d");
        var i = a("6ed5")
          , n = a.n(i)
          , o = (i = (a("0fb7"),
        a("f529")),
        a.n(i))
          , r = (i = (a("9d4c"),
        a("e450")),
        a.n(i))
          , s = (i = (a("2986"),
        a("14e9")),
        a.n(i))
          , c = (i = (a("1760"),
        a("9883")),
        a.n(i))
          , l = (i = (a("a7cc"),
        a("df33")),
        a.n(i))
          , d = (i = (a("826b"),
        a("c263")),
        a.n(i))
          , u = (i = (a("5466"),
        a("ecdf")),
        a.n(i))
          , m = (i = (a("8bd8"),
        a("4cb2")),
        a.n(i))
          , p = (i = (a("4ca3"),
        a("443e")),
        a.n(i))
          , h = (i = (a("fe07"),
        a("6ac5")),
        a.n(i))
          , g = (i = (a("06f1"),
        a("6ac9")),
        a.n(i))
          , f = (i = (a("672e"),
        a("101e")),
        a.n(i))
          , v = (i = (a("560b"),
        a("dcdc")),
        a.n(i))
          , b = (i = (a("b8e0"),
        a("a4c4")),
        a.n(i))
          , w = (i = (a("bd49"),
        a("18ff")),
        a.n(i))
          , A = (i = (a("960d"),
        a("defb")),
        a.n(i))
          , E = (i = (a("cb70"),
        a("b370")),
        a.n(i))
          , O = (i = (a("186a"),
        a("301f")),
        a.n(i))
          , y = (i = (a("96dc"),
        a("9cea")),
        a.n(i))
          , C = (i = (a("b84d"),
        a("c216")),
        a.n(i))
          , M = (i = (a("8f24"),
        a("76b9")),
        a.n(i))
          , I = (i = (a("be4f"),
        a("896a")),
        a.n(i))
          , D = (i = (a("f4f9"),
        a("c2cc")),
        a.n(i))
          , P = (i = (a("cbb5"),
        a("8bbc")),
        a.n(i))
          , x = (i = (a("7a0f"),
        a("0f6c")),
        a.n(i))
          , j = (i = (a("6611"),
        a("e772")),
        a.n(i))
          , T = (i = (a("b5d8"),
        a("f494")),
        a.n(i))
          , R = (i = (a("075a"),
        a("72aa")),
        a.n(i))
          , z = (i = (a("1951"),
        a("eedf")),
        a.n(i))
          , B = (i = (a("eca7"),
        a("3787")),
        a.n(i))
          , L = (i = (a("425f"),
        a("4105")),
        a.n(i))
          , N = (i = (a("e612"),
        a("dd87")),
        a.n(i))
          , Z = (i = (a("38a0"),
        a("ad41")),
        a.n(i))
          , W = (i = (a("e3ea"),
        a("7bc3")),
        a.n(i))
          , k = (i = (a("1f1a"),
        a("4e4b")),
        a.n(i))
          , U = (i = (a("e2f3"),
        a("06f9")),
        a.n(i))
          , G = (i = (a("f225"),
        a("89a9")),
        a.n(i))
          , H = (i = (a("3db2"),
        a("58b8")),
        a.n(i))
          , S = (i = (a("10cb"),
        a("f3ad")),
        a.n(i))
          , q = (i = (a("d4df"),
        a("7fc1")),
        a.n(i));
        t.a = {
            install(e) {
                e.use(q.a),
                e.use(S.a),
                e.use(H.a),
                e.use(G.a),
                e.use(U.a),
                e.use(k.a),
                e.use(W.a),
                e.use(Z.a),
                e.use(N.a),
                e.use(L.a),
                e.use(B.a),
                e.use(z.a),
                e.use(R.a),
                e.use(T.a),
                e.use(j.a),
                e.use(x.a),
                e.use(P.a),
                e.use(D.a),
                e.use(I.a),
                e.use(M.a),
                e.use(C.a),
                e.use(y.a),
                e.use(O.a),
                e.use(E.a),
                e.use(A.a),
                e.use(w.a),
                e.use(b.a),
                e.use(v.a),
                e.use(f.a),
                e.use(g.a),
                e.use(h.a),
                e.use(p.a),
                e.use(m.a),
                e.use(u.a),
                e.use(d.a),
                e.use(l.a),
                e.use(c.a),
                e.use(s.a),
                e.use(r.a),
                e.prototype.$message = o.a,
                e.prototype.$confirm = n.a,
                e.prototype.$confirm2 = n.a.confirm,
                e.prototype.$alert = n.a.alert
            }
        }
    },
    e77a: function(e, t, a) {
        a.d(t, "a", (function() {
            return i
        }
        )),
        a.d(t, "b", (function() {
            return n
        }
        ));
        let i = "data:image/png;base64,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"
          , n = "data:image/png;base64,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"
    },
    ec3e: function(e, t, a) {
        a("f479")
    },
    ec7a: function(e, t, a) {
        var i = a("5e1c");
        t.a = {
            get: function(e, t) {
                return i.a.get(e, t)
            },
            post: function(e, t, a) {
                return i.a.post(e, t, a)
            }
        }
    },
    f01f: function(e, t, a) {
        e.exports = a.p + "img/2x_invalid.44af0b89.png"
    },
    f479: function(e, t, a) {},
    fbd2: function(e, t, a) {},
    fe6a: function(e, t, a) {}
});
