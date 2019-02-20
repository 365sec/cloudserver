webpackJsonp([1], {
    "1/oy": function (t, a) {
    }, "9M+g": function (t, a) {
    }, GfHa: function (t, a) {
    }, Id91: function (t, a) {
    }, Jmt5: function (t, a) {
    }, NHnr: function (t, a, e) {
        "use strict";
        Object.defineProperty(a, "__esModule", {value: !0});
        var s = e("7+uW"), n = {
                render: function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("div", {attrs: {id: "app"}}, [a("RouterView")], 1)
                }, staticRenderFns: []
            }, i = e("VU/8")({name: "App"}, n, !1, null, null, null).exports, r = e("/ocq"), l = e("lbHh"), c = e.n(l),
            o = e("NYxO"), d = e("//Fk"), _ = e.n(d), v = e("mtWM"), p = e.n(v), u = {
                sql: "SQL 注入",
                command: "命令执行",
                xxe: "XXE 外部实体加载",
                directory: "目录遍历",
                rename: "文件重命名",
                readFile: "任意文件下载",
                include: "任意文件包含",
                writeFile: "任意文件写入",
                ssrf: "SSRF 服务端请求伪造",
                ognl: "OGNL 代码执行",
                webdav: "任意文件上传 (PUT)",
                fileUpload: "任意文件上传",
                deserialization: "Transformer 反序列化",
                webshell: "WebShell 后门",
                xss: "XSS 跨站脚本攻击",
                callable: "WebShell - 变形后门",
                webshell_eval: "WebShell - 中国菜刀",
                webshell_command: "WebShell - 命令执行",
                webshell_file_put_contents: "WebShell - 后门上传"
            }, m = {block: "拦截请求", log: "记录日志", ignore: "忽略放行"};

        function h(t) {
            return u[t] ? u[t] : t
        }

        var f = p.a.create({baseURL: "/", timeout: 8e3});
        f.interceptors.request.use(function (t) {
            return t
        }, function (t) {
            console.error(t), _.a.reject(t)
        }), f.interceptors.response.use(function (t) {
            if (200 === t.status) {
                var a = t.data;
                return 0 !== a.status ? 401 === a.status ? (c.a.set("RASP_AUTH_ID", null), void(location.href = "/#/login")) : (alert("API 接口出错: " + a.status + " - " + a.description), _.a.reject(a)) : a.data
            }
            alert("HTTP 请求出错: 响应码 " + t.status)
        }, function (t) {
            return console.error(t), _.a.reject(t)
        }), s.default.use(o.a);
        var g = new o.a.Store({
                state: {app_list: [], current_app: {}}, mutations: {
                    setCurrentApp: function (t, a) {
                        this.state.current_app = a
                    }, setAppList: function (t, a) {
                        this.state.app_list = a
                    }
                }, actions: {
                    loadAppList: function (t, a) {
                        var e = t.commit;
                        f.post("v1/api/app/get", {page: 1, perpage: 100}).then(function (t) {
                            var s = t.data;
                            if (e("setAppList", s), a) {
                                var n = s.find(function (t) {
                                    return t.id === a
                                });
                                n ? e("setCurrentApp", n) : (alert("没有这个应用: " + a), e("setCurrentApp", s[0]))
                            } else e("setCurrentApp", s[0])
                        })
                    }
                }, getters: {
                    app_list: function (t) {
                        return t.app_list
                    }, current_app: function (t) {
                        return t.current_app
                    }
                }
            }), b = {
                name: "Login", data: function () {
                    return {username: "openrasp", password: ""}
                }, methods: {
                    doLogin: function () {
                        var t = this;
                        return f.post("v1/user/login", {
                            username: this.username,
                            password: this.password
                        }).then(function (a) {
                            t.$router.replace({name: "dashboard"})
                        })
                    }
                }
            }, C = {
                render: function () {
                    var t = this, a = t.$createElement, e = t._self._c || a;
                    return e("div", {staticClass: "container"}, [e("div", {
                        staticClass: "row",
                        staticStyle: {height: "100vh"}
                    }, [e("div", {staticClass: "col col-login m-auto"}, [e("form", {
                        staticClass: "card",
                        on: {
                            submit: function (a) {
                                t.doLogin()
                            }
                        }
                    }, [e("div", {staticClass: "card-body p-6"}, [e("div", {staticClass: "card-title"}, [t._v("\n            OpenRASP 管理后台登录\n          ")]), t._v(" "), e("div", {staticClass: "form-group"}, [e("label", {staticClass: "form-label"}, [t._v("\n              用户名\n            ")]), t._v(" "), e("input", {
                        directives: [{
                            name: "model",
                            rawName: "v-model",
                            value: t.username,
                            expression: "username"
                        }],
                        staticClass: "form-control",
                        attrs: {type: "text"},
                        domProps: {value: t.username},
                        on: {
                            input: function (a) {
                                a.target.composing || (t.username = a.target.value)
                            }
                        }
                    })]), t._v(" "), e("div", {staticClass: "form-group"}, [t._m(0), t._v(" "), e("input", {
                        directives: [{
                            name: "model",
                            rawName: "v-model",
                            value: t.password,
                            expression: "password"
                        }],
                        staticClass: "form-control",
                        attrs: {type: "password", placeholder: "输入密码"},
                        domProps: {value: t.password},
                        on: {
                            input: function (a) {
                                a.target.composing || (t.password = a.target.value)
                            }
                        }
                    })]), t._v(" "), e("div", {staticClass: "form-footer"}, [e("button", {
                        staticClass: "btn btn-primary btn-block",
                        attrs: {type: "submit", plain: !0},
                        on: {
                            click: function (a) {
                                a.preventDefault(), t.doLogin()
                            }
                        }
                    }, [t._v("\n              登录\n            ")])])])])])])])
                }, staticRenderFns: [function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("label", {staticClass: "form-label"}, [this._v("\n              密码\n              "), a("a", {
                        staticClass: "float-right small",
                        attrs: {href: "https://rasp.baidu.com/doc", target: "_blank"}
                    }, [this._v("\n                忘记密码?\n              ")])])
                }]
            }, k = e("VU/8")(b, C, !1, null, null, null).exports, y = e("Dd8w"), w = e.n(y), x = e("0+QU"), j = e.n(x),
            E = {
                name: "TopAttackType", components: {VueC3: j.a}, data: function () {
                    return {data: [], category_handler: new s.default}
                }, methods: {
                    setData: function (t) {
                        this.data = t;
                        var a = {
                            size: {height: 192},
                            data: {columns: t, type: "pie", names: u},
                            axis: {},
                            legend: {show: !1},
                            padding: {bottom: 0, top: 0}
                        };
                        this.category_handler.$emit("init", a)
                    }
                }
            }, P = {
                render: function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("div", {staticStyle: {height: "12rem"}}, [a("VueC3", {
                        directives: [{
                            name: "show",
                            rawName: "v-show",
                            value: this.data.length,
                            expression: "data.length"
                        }], attrs: {handler: this.category_handler}
                    }), this._v(" "), a("p", {
                        directives: [{
                            name: "show",
                            rawName: "v-show",
                            value: !this.data.length,
                            expression: "! data.length"
                        }],
                        staticClass: "text-center",
                        staticStyle: {display: "flex", "justify-content": "center", height: "100%", "align-items": "center"}
                    }, [this._v("\n    暂无数据\n  ")])], 1)
                }, staticRenderFns: []
            }, A = e("VU/8")(E, P, !1, null, null, null).exports, S = {
                name: "TopAttackUa", components: {VueC3: j.a}, data: function () {
                    return {source_handler: new s.default, data: []}
                }, methods: {
                    setData: function (t) {
                        this.data = t;
                        var a = {
                            size: {height: 192},
                            data: {columns: this.data, type: "donut", names: u},
                            axis: {x: {tick: {width: 200}}},
                            legend: {show: !1},
                            padding: {bottom: 0, top: 0},
                            tooltip: {
                                format: {
                                    name: function (t, a, e, s) {
                                        return t.length > 70 ? t.substr(0, 70) + " ..." : t
                                    }
                                }
                            }
                        };
                        this.source_handler.$emit("init", a)
                    }
                }
            }, D = {
                render: function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("div", {staticStyle: {height: "12rem"}}, [a("VueC3", {
                        directives: [{
                            name: "show",
                            rawName: "v-show",
                            value: this.data.length,
                            expression: "data.length"
                        }], attrs: {handler: this.source_handler}
                    }), this._v(" "), a("p", {
                        directives: [{
                            name: "show",
                            rawName: "v-show",
                            value: !this.data.length,
                            expression: "! data.length"
                        }],
                        staticClass: "text-center",
                        staticStyle: {display: "flex", "justify-content": "center", height: "100%", "align-items": "center"}
                    }, [this._v("\n    暂无数据\n  ")])], 1)
                }, staticRenderFns: []
            }, M = e("VU/8")(S, D, !1, null, null, null).exports, R = {
                name: "EventTrend", components: {VueC3: j.a}, data: function () {
                    return {trend_handler: new s.default}
                }, methods: {
                    setData: function (t) {
                        var a = this;
                        t.data[0].unshift("拦截请求"), t.data[1].unshift("记录日志");
                        var e = {
                            size: {height: 250},
                            data: {
                                columns: t.data,
                                type: "area",
                                groups: [["data1", "data2"]],
                                colors: {data1: "#467fcf", data2: "#5eba00"},
                                names: {data1: "拦截数量", data2: "日志数量"}
                            },
                            axis: {
                                y: {padding: {bottom: 0}, show: !1, tick: {outer: !1}},
                                x: {padding: {left: 0, right: 0}, show: !1}
                            },
                            legend: {position: "inset", padding: 0, inset: {anchor: "top-left", x: 20, y: 8, step: 10}},
                            tooltip: {
                                format: {
                                    title: function (e) {
                                        return a.moment(t.labels[e]).format("YYYY-MM-DD")
                                    }
                                }
                            },
                            padding: {bottom: 0, left: -1, right: -1},
                            point: {show: !1}
                        };
                        this.trend_handler.$emit("init", e)
                    }
                }
            }, U = {
                render: function () {
                    var t = this.$createElement;
                    return (this._self._c || t)("VueC3", {
                        staticStyle: {height: "15rem"},
                        attrs: {handler: this.trend_handler}
                    })
                }, staticRenderFns: []
            }, T = {
                name: "Dashboard",
                components: {TopAttackType: A, TopAttackUa: M, EventTrend: e("VU/8")(R, U, !1, null, null, null).exports},
                data: function () {
                    return {}
                },
                computed: w()({}, Object(o.c)(["current_app"])),
                watch: {
                    current_app: function () {
                        this.loadChartData()
                    }
                },
                mounted: function () {
                    this.current_app.id && this.loadChartData()
                },
                methods: {
                    loadChartData: function () {
                        var t = this, a = {
                            app_id: this.current_app.id,
                            size: 10,
                            start_time: 1e3 * this.moment().subtract(1, "months").unix(),
                            end_time: 1e3 * this.moment().unix(),
                            interval: "day",
                            time_zone: "+08:00"
                        };
                        this.api_request("v1/api/log/attack/aggr/type", a, function (a) {
                            t.$refs.top_attack_type.setData(a)
                        }), this.api_request("v1/api/log/attack/aggr/ua", a, function (a) {
                            t.$refs.top_attack_ua.setData(a)
                        }), this.api_request("v1/api/log/attack/aggr/time", a, function (a) {
                            t.$refs.event_trend.setData(a)
                        })
                    }
                }
            }, L = {
                render: function () {
                    var t = this, a = t.$createElement, e = t._self._c || a;
                    return e("div", {staticClass: "my-3 my-md-4"}, [e("div", {staticClass: "container"}, [t._e(), t._v(" "), e("div", {staticClass: "row row-cards"}, [e("div", {staticClass: "col-lg-6"}, [e("div", {staticClass: "card"}, [t._m(6), t._v(" "), e("EventTrend", {ref: "event_trend"})], 1)]), t._v(" "), e("div", {staticClass: "col-md-6"}, [e("div", {staticClass: "row"}, [e("div", {staticClass: "col-sm-6"}, [e("div", {staticClass: "card"}, [t._m(7), t._v(" "), e("div", {staticClass: "card-body"}, [e("TopAttackUa", {ref: "top_attack_ua"})], 1)])]), t._v(" "), e("div", {staticClass: "col-sm-6"}, [e("div", {staticClass: "card"}, [t._m(8), t._v(" "), e("div", {staticClass: "card-body"}, [e("TopAttackType", {ref: "top_attack_type"})], 1)])])])])])])])
                }, staticRenderFns: [function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("div", {staticClass: "col-6 col-sm-4 col-lg-2"}, [a("div", {staticClass: "card"}, [a("div", {staticClass: "card-body p-3 text-center"}, [a("div", {staticClass: "text-right text-green"}, [this._v("\n              6%\n              "), a("i", {staticClass: "fe fe-chevron-up"})]), this._v(" "), a("div", {staticClass: "h1 m-0"}, [a("span", {staticClass: "text-danger"}, [this._v("\n                1\n              ")])]), this._v(" "), a("div", {staticClass: "text-muted mb-4"}, [this._v("\n              未处理\n            ")])])])])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("div", {staticClass: "col-6 col-sm-4 col-lg-2"}, [a("div", {staticClass: "card"}, [a("div", {staticClass: "card-body p-3 text-center"}, [a("div", {staticClass: "text-right text-red"}, [this._v("\n              -3%\n              "), a("i", {staticClass: "fe fe-chevron-down"})]), this._v(" "), a("div", {staticClass: "h1 m-0"}, [this._v("\n              17\n            ")]), this._v(" "), a("div", {staticClass: "text-muted mb-4"}, [this._v("\n              拦截数量\n            ")])])])])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("div", {staticClass: "col-6 col-sm-4 col-lg-2"}, [a("div", {staticClass: "card"}, [a("div", {staticClass: "card-body p-3 text-center"}, [a("div", {staticClass: "text-right text-green"}, [this._v("\n              9%\n              "), a("i", {staticClass: "fe fe-chevron-up"})]), this._v(" "), a("div", {staticClass: "h1 m-0"}, [this._v("\n              7\n            ")]), this._v(" "), a("div", {staticClass: "text-muted mb-4"}, [this._v("\n              放行数量\n            ")])])])])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("div", {staticClass: "col-6 col-sm-4 col-lg-2"}, [a("div", {staticClass: "card"}, [a("div", {staticClass: "card-body p-3 text-center"}, [a("div", {staticClass: "text-right text-green"}, [this._v("\n              3%\n              "), a("i", {staticClass: "fe fe-chevron-up"})]), this._v(" "), a("div", {staticClass: "h1 m-0"}, [this._v("\n              1\n            ")]), this._v(" "), a("div", {staticClass: "text-muted mb-4"}, [this._v("\n              在线主机\n            ")])])])])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("div", {staticClass: "col-6 col-sm-4 col-lg-2"}, [a("div", {staticClass: "card"}, [a("div", {staticClass: "card-body p-3 text-center"}, [a("div", {staticClass: "text-right text-red"}, [this._v("\n              -2%\n              "), a("i", {staticClass: "fe fe-chevron-down"})]), this._v(" "), a("div", {staticClass: "h1 m-0"}, [this._v("\n              3\n            ")]), this._v(" "), a("div", {staticClass: "text-muted mb-4"}, [this._v("\n              失联主机\n            ")])])])])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("div", {staticClass: "col-6 col-sm-4 col-lg-2"}, [a("div", {staticClass: "card"}, [a("div", {staticClass: "card-body p-3 text-center"}, [a("div", {staticClass: "text-right text-red"}, [this._v("\n              -1%\n              "), a("i", {staticClass: "fe fe-chevron-down"})]), this._v(" "), a("div", {staticClass: "h1 m-0"}, [this._v("\n              10d\n            ")]), this._v(" "), a("div", {staticClass: "text-muted mb-4"}, [this._v("\n              运行时间\n            ")])])])])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("div", {staticClass: "card-header"}, [a("h3", {staticClass: "card-title"}, [this._v("\n              攻击趋势\n            ")])])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("div", {staticClass: "card-header"}, [a("h3", {staticClass: "card-title"}, [this._v("\n                  TOP 10 攻击UA\n                ")])])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("div", {staticClass: "card-header"}, [a("h3", {staticClass: "card-title"}, [this._v("\n                  TOP 10 攻击类型\n                ")])])
                }]
            }, N = e("VU/8")(T, L, !1, null, null, null).exports, q = e("PJh5"), F = e.n(q), z = {
                render: function () {
                    var t = this, a = t.$createElement, e = t._self._c || a;
                    return e("div", ["3001" == t.data.policy_id ? e("div", [e("div", {staticClass: "h6"}, [t._v("\n            配置文件路径\n        ")]), t._v(" "), e("p", [t._v("\n            " + t._s(t.data.policy_params.config_file) + "\n        ")]), t._v(" "), e("div", {staticClass: "h6"}, [t._v("\n            问题描述\n        ")]), t._v(" "), t._m(0)]) : t._e(), t._v(" "), "3005" == t.data.policy_id ? e("div", [e("div", {staticClass: "h6"}, [t._v("\n            配置文件路径\n        ")]), t._v(" "), e("p", [t._v("\n            " + t._s(t.data.policy_params.config_file) + "\n        ")]), t._v(" "), e("div", {staticClass: "h6"}, [t._v("\n            问题描述\n        ")]), t._v(" "), t._m(1)]) : t._e(), t._v(" "), "3007" == t.data.policy_id ? e("div", [e("div", {staticClass: "h6"}, [t._v("\n            配置文件路径\n        ")]), t._v(" "), e("p", [t._v("\n            " + t._s(t.data.policy_params.config_file) + "\n        ")]), t._v(" "), e("div", {staticClass: "h6"}, [t._v("\n            问题描述\n        ")]), t._v(" "), t._m(2)]) : t._e(), t._v(" "), "3002" == t.data.policy_id ? e("div", [e("div", {staticClass: "h6"}, [t._v("\n            进程 PID\n        ")]), t._v(" "), e("p", [t._v("\n            " + t._s(t.data.policy_params.pid) + "\n        ")]), t._v(" "), e("div", {staticClass: "h6"}, [t._v("\n            问题描述\n        ")]), t._v(" "), t._m(3)]) : t._e(), t._v(" "), "3003" == t.data.policy_id ? e("div", [e("div", {staticClass: "h6"}, [t._v("\n            配置文件路径\n        ")]), t._v(" "), e("p", [t._v("\n            " + t._s(t.data.policy_params.config_file) + "\n        ")]), t._v(" "), e("div", {staticClass: "h6"}, [t._v("\n            弱口令\n        ")]), t._v(" "), e("p", [t._v("\n            " + t._s(t.data.policy_params.username) + ":" + t._s(t.data.policy_params.password) + "\n        ")]), t._v(" "), e("div", {staticClass: "h6"}, [t._v("\n            问题描述\n        ")]), t._v(" "), t._m(4)]) : t._e(), t._v(" "), "3004" == t.data.policy_id ? e("div", [e("div", {staticClass: "h6"}, [t._v("\n            webapps 路径\n        ")]), t._v(" "), e("p", [t._v("\n            " + t._s(t.data.policy_params.path) + "\n        ")]), t._v(" "), e("div", {staticClass: "h6"}, [t._v("\n            未删除的默认应用列表\n        ")]), t._v(" "), e("p", [t._v("\n            " + t._s(t.data.policy_params.apps.join(", ")) + "\n        ")]), t._v(" "), e("div", {staticClass: "h6"}, [t._v("\n            问题描述\n        ")]), t._v(" "), t._m(5)]) : t._e(), t._v(" "), "3006" == t.data.policy_id ? e("div", [t.data.policy_params.connectionString ? e("div", {staticClass: "h6"}, [t._v("\n            connectionString\n        ")]) : t._e(), t._v(" "), t.data.policy_params.connectionString ? e("p", [t._v("\n            " + t._s(t.data.policy_params.connectionString) + "\n        ")]) : t._e(), t._v(" "), e("div", {staticClass: "h6"}, [t._v("\n            数据库类型\n        ")]), t._v(" "), e("p", [t._v("\n            " + t._s(t.data.policy_params.server) + "\n        ")]), t._v(" "), e("div", {staticClass: "h6"}, [t._v("\n            用户名\n        ")]), t._v(" "), e("p", [t._v("\n            " + t._s(t.data.policy_params.username) + "\n        ")]), t._v(" "), e("div", {staticClass: "h6"}, [t._v("\n            应用堆栈\n        ")]), t._v(" "), e("pre", [t._v(t._s(t.data.stack_trace))]), t._v(" "), e("div", {staticClass: "h6"}, [t._v("\n            问题描述\n        ")]), t._v(" "), t._m(6)]) : t._e(), t._v(" "), "4001" == t.data.policy_id ? e("div", [e("div", {staticClass: "h6"}, [t._v("\n            问题描述\n        ")]), t._v(" "), t._m(7)]) : t._e(), t._v(" "), "4002" == t.data.policy_id ? e("div", [e("div", {staticClass: "h6"}, [t._v("\n            问题描述\n        ")]), t._v(" "), t._m(8)]) : t._e(), t._v(" "), "4003" == t.data.policy_id ? e("div", [e("div", {staticClass: "h6"}, [t._v("\n            问题描述\n        ")]), t._v(" "), t._m(9)]) : t._e(), t._v(" "), "4004" == t.data.policy_id ? e("div", [e("div", {staticClass: "h6"}, [t._v("\n            问题描述\n        ")]), t._v(" "), t._m(10)]) : t._e()])
                }, staticRenderFns: [function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("p", [this._v("\n            JSESSIONID 未开启 httpOnly，若开启可提升服务器对XSS的防范效果。\n            "), a("a", {
                        attrs: {
                            href: "https://rasp.baidu.com/doc/usage/security_policy.html#3001",
                            target: "_blank"
                        }
                    }, [this._v("点击这里")]), this._v("了解更多。\n        ")])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("p", [this._v("\n            开启 Directory Listing 功能，可能会泄露项目代码、配置等敏感信息。\n            "), a("a", {
                        attrs: {
                            href: "https://rasp.baidu.com/doc/usage/security_policy.html#3005",
                            target: "_blank"
                        }
                    }, [this._v("点击这里")]), this._v("了解更多。\n        ")])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("p", [this._v("\n            以 root/Administrator/system 权限启动应用服务器，会产生巨大的风险。\n            "), a("a", {
                        attrs: {
                            href: "https://rasp.baidu.com/doc/usage/security_policy.html#3007",
                            target: "_blank"
                        }
                    }, [this._v("点击这里")]), this._v("了解更多。\n        ")])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("p", [this._v("\n            以root权限启动应用服务器，会产生巨大的风险。\n            "), a("a", {
                        attrs: {
                            href: "https://rasp.baidu.com/doc/usage/security_policy.html#3002",
                            target: "_blank"
                        }
                    }, [this._v("点击这里")]), this._v("了解更多。\n        ")])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("p", [this._v("\n            Tomcat 管理后台存在弱口令，若管理后台对外暴露，会有被入侵的风险。\n            "), a("a", {
                        attrs: {
                            href: "https://rasp.baidu.com/doc/usage/security_policy.html#3003",
                            target: "_blank"
                        }
                    }, [this._v("点击这里")]), this._v("了解更多。\n        ")])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("p", [this._v("\n            没有删除 tomcat 默认的 app，或多或少会泄露敏感信息，或者造成管理后台对外暴露的风险。\n            "), a("a", {
                        attrs: {
                            href: "https://rasp.baidu.com/doc/usage/security_policy.html#3004",
                            target: "_blank"
                        }
                    }, [this._v("点击这里")]), this._v("了解更多。\n        ")])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("p", [this._v("\n            当存在SQL注入漏洞，使用高权限账号连接数据库会带来更大风险，泄露更多的数据。\n            "), a("a", {
                        attrs: {
                            href: "https://rasp.baidu.com/doc/usage/security_policy.html#3004",
                            target: "_blank"
                        }
                    }, [this._v("点击这里")]), this._v("了解更多。\n        ")])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("p", [this._v("\n            allow_url_include 没有关闭，当应用存在文件包含、任意文件读取等漏洞，开启这个配置会让应用更加容易被入侵。\n            "), a("a", {
                        attrs: {
                            href: "https://rasp.baidu.com/doc/usage/security_policy.html#4001",
                            target: "_blank"
                        }
                    }, [this._v("点击这里")]), this._v("了解更多。\n        ")])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("p", [this._v("\n            expose_php 没有关闭，会泄露PHP版本号。\n            "), a("a", {
                        attrs: {
                            href: "https://rasp.baidu.com/doc/usage/security_policy.html#4002",
                            target: "_blank"
                        }
                    }, [this._v("点击这里")]), this._v("了解更多。\n        ")])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("p", [this._v("\n            display_errors 没有关闭，用户可以在前台看到PHP程序的错误信息。\n            "), a("a", {
                        attrs: {
                            href: "https://rasp.baidu.com/doc/usage/security_policy.html#4002",
                            target: "_blank"
                        }
                    }, [this._v("点击这里")]), this._v("了解更多。\n        ")])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("p", [this._v("\n            yaml.decode_php 没有关闭，将允许YAML反序列化PHP对象。若应用存在漏洞，可导致服务器被入侵。\n            "), a("a", {
                        attrs: {
                            href: "https://rasp.baidu.com/doc/usage/security_policy.html#4002",
                            target: "_blank"
                        }
                    }, [this._v("点击这里")]), this._v("了解更多。\n        ")])
                }]
            }, O = {
                name: "baselineDetailModal", data: function () {
                    return {data: {}}
                }, methods: {
                    showModal: function (t) {
                        this.data = t, this.$refs.baseline_params.setData(t), $("#showBaselineDetailModal").modal()
                    }
                }, components: {
                    baseline_params: e("VU/8")({
                        name: "baseline_params", data: function () {
                            return {data: {policy_params: {}}}
                        }, methods: {
                            setData: function (t) {
                                this.data = t
                            }
                        }
                    }, z, !1, null, null, null).exports
                }
            }, H = {
                render: function () {
                    var t = this, a = t.$createElement, e = t._self._c || a;
                    return e("div", {
                        staticClass: "modal no-fade",
                        attrs: {id: "showBaselineDetailModal", tabindex: "-1", role: "dialog"}
                    }, [e("div", {
                        staticClass: "modal-dialog modal-lg",
                        attrs: {role: "document"}
                    }, [e("div", {staticClass: "modal-content"}, [t._m(0), t._v(" "), e("div", {
                        staticClass: "modal-body",
                        staticStyle: {"padding-top": "0"}
                    }, [t._m(1), t._v(" "), e("br"), t._v(" "), e("div", {
                        staticClass: "tab-content",
                        attrs: {id: "myTabContent"}
                    }, [e("div", {
                        staticClass: "tab-pane fade show active",
                        attrs: {id: "vuln", role: "tabpanel", "aria-labelledby": "home-tab"}
                    }, [e("div", {staticClass: "h6"}, [t._v("\n              报警时间\n            ")]), t._v(" "), e("p", [t._v(t._s(t.moment(t.data.event_time).format("YYYY-MM-DD HH:mm:ss")))]), t._v(" "), e("div", {staticClass: "h6"}, [t._v("\n              报警消息\n            ")]), t._v(" "), e("p", [t._v("\n              [" + t._s(t.data.policy_id) + "] " + t._s(t.data.message) + "\n            ")]), t._v(" "), e("baseline_params", {ref: "baseline_params"})], 1), t._v(" "), e("div", {
                        staticClass: "tab-pane fade",
                        attrs: {id: "profile", role: "tabpanel", "aria-labelledby": "profile-tab"}
                    }, [e("div", {staticClass: "h6"}, [t._v("\n              主机名称\n            ")]), t._v(" "), e("p", [t._v(t._s(t.data.server_hostname))]), t._v(" "), e("div", {staticClass: "h6"}, [t._v("\n              服务器 IP\n            ")]), t._v(" "), e("ul", t._l(t.data.server_nic, function (a) {
                        return e("li", {key: a.name}, [t._v(t._s(a.name) + ": " + t._s(a.ip))])
                    })), t._v(" "), e("div", {staticClass: "h6"}, [t._v("\n              应用版本\n            ")]), t._v(" "), e("p", [t._v(t._s(t.data.server_type) + "/" + t._s(t.data.server_version))])])])]), t._v(" "), t._m(2)])])])
                }, staticRenderFns: [function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("div", {staticClass: "modal-header"}, [a("h5", {staticClass: "modal-title"}, [this._v("基线详情")]), this._v(" "), a("button", {
                        staticClass: "close",
                        attrs: {type: "button", "data-dismiss": "modal", "aria-label": "Close"}
                    })])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("ul", {
                        staticClass: "nav nav-tabs",
                        attrs: {id: "myTab", role: "tablist"}
                    }, [a("li", {staticClass: "nav-item"}, [a("a", {
                        staticClass: "nav-link active",
                        attrs: {id: "home-tab", "data-toggle": "tab", href: "#vuln"}
                    }, [this._v("报警信息")])]), this._v(" "), a("li", {staticClass: "nav-item"}, [a("a", {
                        staticClass: "nav-link",
                        attrs: {id: "profile-tab", "data-toggle": "tab", href: "#profile", role: "tab"}
                    }, [this._v("资产信息")])])])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("div", {staticClass: "modal-footer"}, [a("button", {
                        staticClass: "btn btn-primary",
                        attrs: {"data-dismiss": "modal"}
                    }, [this._v("关闭")])])
                }]
            }, V = e("VU/8")(O, H, !1, null, null, null).exports, I = (e("PL/P"), {
                name: "DatePicker", data: function () {
                    return {start: F()().subtract(1, "months").startOf("day"), end: F()().endOf("day")}
                }, mounted: function () {
                    var t = this;
                    this.$nextTick(function () {
                        window.$(this.$el).daterangepicker({startDate: t.start, endDate: t.end}, function (a, e, s) {
                            t.start = a, t.end = e, t.$emit("selected")
                        })
                    })
                }
            }), Y = {
                render: function () {
                    var t = this.$createElement;
                    return (this._self._c || t)("input", {
                        staticClass: "form-control pull-right",
                        attrs: {type: "text", name: "dates"}
                    })
                }, staticRenderFns: []
            }, W = e("VU/8")(I, Y, !1, null, null, null).exports, B = e("RiEM"), J = e.n(B), X = {
                name: "Baseline", components: {baselineDetailModal: V, DatePicker: W}, data: function () {
                    return {data: [], loading: !1, currentPage: 1, hostname: "", total: 0}
                }, computed: w()({}, Object(o.c)(["current_app"])), watch: {
                    current_app: function () {
                        this.loadEvents(1)
                    }
                }, mounted: function () {
                    this.current_app.id && this.loadEvents(1)
                }, methods: {
                    showBaselineDetailModal: function (t) {
                        this.$refs.baselineDetailModal.showModal(t)
                    }, loadEvents: function (t) {
                        var a = this, e = {
                            data: {
                                app_id: this.current_app.id,
                                start_time: this.$refs.datePicker.start.valueOf(),
                                end_time: this.$refs.datePicker.end.valueOf()
                            }, page: t, perpage: 10
                        };
                        return this.hostname && (J()(this.hostname) ? e.data.local_ip = this.hostname : e.data.server_hostname = this.hostname), this.loading = !0, this.request.post("v1/api/log/policy/search", e).then(function (e) {
                            a.currentPage = t, a.data = e.data, a.total = e.total, a.loading = !1
                        })
                    }
                }
            }, G = {
                render: function () {
                    var t = this, a = t.$createElement, e = t._self._c || a;
                    return e("div", {staticClass: "my-3 my-md-5"}, [e("div", {staticClass: "container"}, [e("div", {staticClass: "page-header"}, [e("h1", {staticClass: "page-title"}, [t._v("\n        基线检查\n      ")]), t._v(" "), e("div", {staticClass: "page-options d-flex"}, [e("div", {staticClass: "input-icon ml-2 w-50"}, [t._m(0), t._v(" "), e("DatePicker", {
                        ref: "datePicker",
                        on: {
                            selected: function (a) {
                                t.loadEvents(1)
                            }
                        }
                    })], 1), t._v(" "), e("div", {staticClass: "input-icon ml-2"}, [t._m(1), t._v(" "), e("input", {
                        directives: [{
                            name: "model",
                            rawName: "v-model",
                            value: t.hostname,
                            expression: "hostname"
                        }],
                        staticClass: "form-control w-10",
                        attrs: {type: "text", placeholder: "搜索主机或者IP"},
                        domProps: {value: t.hostname},
                        on: {
                            input: function (a) {
                                a.target.composing || (t.hostname = a.target.value)
                            }
                        }
                    })]), t._v(" "), e("button", {
                        staticClass: "btn btn-primary ml-2", on: {
                            click: function (a) {
                                t.loadEvents(1)
                            }
                        }
                    }, [t._v("\n          搜索\n        ")])])]), t._v(" "), e("div", {staticClass: "card"}, [e("div", {staticClass: "card-body"}, [t.loading ? e("vue-loading", {
                        attrs: {
                            type: "spiningDubbles",
                            color: "rgb(90, 193, 221)",
                            size: {width: "50px", height: "50px"}
                        }
                    }) : t._e(), t._v(" "), t.loading ? t._e() : e("table", {staticClass: "table table-hover table-bordered"}, [t._m(2), t._v(" "), e("tbody", t._l(t.data, function (a) {
                        return e("tr", {key: a.id}, [e("td", {attrs: {nowrap: ""}}, [t._v("\n                " + t._s(t.moment(a.event_time).format("YYYY-MM-DD")) + "\n                "), e("br"), t._v("\n                " + t._s(t.moment(a.event_time).format("HH:mm:ss")) + "\n              ")]), t._v(" "), e("td", {attrs: {nowrap: ""}}, [t._v("\n                " + t._s(a.server_type) + "/" + t._s(a.server_version) + "\n              ")]), t._v(" "), e("td", {attrs: {nowrap: ""}}, [t._v("\n                " + t._s(a.server_hostname) + "\n              ")]), t._v(" "), e("td", [t._v("\n                [" + t._s(a.policy_id) + "] " + t._s(a.message) + "\n              ")]), t._v(" "), e("td", {attrs: {nowrap: ""}}, [e("a", {
                            attrs: {href: "javascript:"},
                            on: {
                                click: function (e) {
                                    t.showBaselineDetailModal(a)
                                }
                            }
                        }, [t._v("\n                  查看详情\n                ")])])])
                    }))]), t._v(" "), t.loading ? t._e() : e("nav", [e("b-pagination", {
                        attrs: {
                            align: "center",
                            "total-rows": t.total,
                            "per-page": 10
                        }, on: {
                            change: function (a) {
                                t.loadEvents(a)
                            }
                        }, model: {
                            value: t.currentPage, callback: function (a) {
                                t.currentPage = a
                            }, expression: "currentPage"
                        }
                    })], 1)], 1)])]), t._v(" "), e("baselineDetailModal", {ref: "baselineDetailModal"})], 1)
                }, staticRenderFns: [function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("span", {staticClass: "input-icon-addon"}, [a("i", {staticClass: "fe fe-calendar"})])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("span", {staticClass: "input-icon-addon"}, [a("i", {staticClass: "fe fe-search"})])
                }, function () {
                    var t = this, a = t.$createElement, e = t._self._c || a;
                    return e("thead", [e("tr", [e("th", {attrs: {nowrap: ""}}, [t._v("\n                报警时间\n              ")]), t._v(" "), e("th", {attrs: {nowrap: ""}}, [t._v("\n                应用信息\n              ")]), t._v(" "), e("th", {attrs: {nowrap: ""}}, [t._v("\n                主机信息\n              ")]), t._v(" "), e("th", [t._v("\n                报警内容\n              ")]), t._v(" "), e("th", [t._v("\n                操作\n              ")])])])
                }]
            }, Q = e("VU/8")(X, G, !1, null, null, null).exports, K = {
                name: "Hosts", data: function () {
                    return {
                        data: [],
                        loading: !1,
                        currentPage: 1,
                        total: 0,
                        hostname: "",
                        filter: {online: !0, offline: !0}
                    }
                }, computed: w()({}, Object(o.c)(["current_app"])), watch: {
                    current_app: function () {
                        this.loadRaspList(1)
                    }, filter: {
                        handler: function () {
                            this.loadRaspList(1)
                        }, deep: !0
                    }
                }, mounted: function () {
                    this.current_app.id && this.loadRaspList(1)
                }, methods: {
                    loadRaspList: function (t) {
                        var a = this;
                        if (!this.filter.online && !this.filter.offline) return this.currentPage = t, this.data = [], this.total = 0, void(this.loading = !1);
                        var e = {data: {app_id: this.current_app.id}, page: t, perpage: 10};
                        return this.hostname && (J()(this.hostname) ? e.data.register_ip = this.hostname : e.data.hostname = this.hostname), this.filter.online && !this.filter.offline ? e.data.online = !0 : !this.filter.online && this.filter.offline && (e.data.online = !1), this.loading = !0, this.request.post("v1/api/rasp/search", e).then(function (e) {
                            a.currentPage = t, a.data = e.data, a.total = e.total, a.loading = !1
                        })
                    }, doDelete: function (t) {
                        if (confirm("确认删除? 删除前请先在主机端卸载 OpenRASP agent")) {
                            var a = {id: t.id};
                            this.api_request("v1/api/rasp/delete", a, function (t) {
                                this.loadRaspList()
                            })
                        }
                    }
                }
            }, Z = {
                render: function () {
                    var t = this, a = t.$createElement, e = t._self._c || a;
                    return e("div", {staticClass: "my-3 my-md-5"}, [e("div", {staticClass: "container"}, [e("div", {staticClass: "page-header"}, [e("h1", {staticClass: "page-title"}, [t._v("\n        Agent 管理\n      ")]), t._v(" "), e("div", {staticClass: "page-options d-flex"}, [e("div", [e("b-dropdown", {attrs: {text: "主机状态"}}, [e("div", {staticClass: "row px-2"}, [e("div", {staticClass: "col-6"}, [e("label", {staticClass: "custom-switch"}, [e("input", {
                        directives: [{
                            name: "model",
                            rawName: "v-model",
                            value: t.filter.online,
                            expression: "filter.online"
                        }],
                        staticClass: "custom-switch-input",
                        attrs: {type: "checkbox", checked: "filter.online"},
                        domProps: {checked: Array.isArray(t.filter.online) ? t._i(t.filter.online, null) > -1 : t.filter.online},
                        on: {
                            change: [function (a) {
                                var e = t.filter.online, s = a.target, n = !!s.checked;
                                if (Array.isArray(e)) {
                                    var i = t._i(e, null);
                                    s.checked ? i < 0 && t.$set(t.filter, "online", e.concat([null])) : i > -1 && t.$set(t.filter, "online", e.slice(0, i).concat(e.slice(i + 1)))
                                } else t.$set(t.filter, "online", n)
                            }, function (a) {
                                t.$emit("selected")
                            }]
                        }
                    }), t._v(" "), e("span", {staticClass: "custom-switch-indicator"}), t._v(" "), e("span", {staticClass: "custom-switch-description"}, [t._v("\n                    在线\n                  ")])])]), t._v(" "), e("div", {staticClass: "col-6"}, [e("label", {staticClass: "custom-switch"}, [e("input", {
                        directives: [{
                            name: "model",
                            rawName: "v-model",
                            value: t.filter.offline,
                            expression: "filter.offline"
                        }],
                        staticClass: "custom-switch-input",
                        attrs: {type: "checkbox", checked: "filter.offline"},
                        domProps: {checked: Array.isArray(t.filter.offline) ? t._i(t.filter.offline, null) > -1 : t.filter.offline},
                        on: {
                            change: [function (a) {
                                var e = t.filter.offline, s = a.target, n = !!s.checked;
                                if (Array.isArray(e)) {
                                    var i = t._i(e, null);
                                    s.checked ? i < 0 && t.$set(t.filter, "offline", e.concat([null])) : i > -1 && t.$set(t.filter, "offline", e.slice(0, i).concat(e.slice(i + 1)))
                                } else t.$set(t.filter, "offline", n)
                            }, function (a) {
                                t.$emit("selected")
                            }]
                        }
                    }), t._v(" "), e("span", {staticClass: "custom-switch-indicator"}), t._v(" "), e("span", {staticClass: "custom-switch-description"}, [t._v("\n                    离线\n                  ")])])])])])], 1), t._v(" "), e("div", {staticClass: "input-icon ml-2"}, [t._m(0), t._v(" "), e("input", {
                        directives: [{
                            name: "model",
                            rawName: "v-model",
                            value: t.hostname,
                            expression: "hostname"
                        }],
                        staticClass: "form-control w-10",
                        attrs: {type: "text", placeholder: "搜索主机或者IP"},
                        domProps: {value: t.hostname},
                        on: {
                            input: function (a) {
                                a.target.composing || (t.hostname = a.target.value)
                            }
                        }
                    })]), t._v(" "), e("button", {
                        staticClass: "btn btn-primary ml-2", on: {
                            click: function (a) {
                                t.loadRaspList(1)
                            }
                        }
                    }, [t._v("\n          搜索\n        ")])])]), t._v(" "), e("div", {staticClass: "card"}, [e("div", {staticClass: "card-body"}, [t.loading ? e("vue-loading", {
                        attrs: {
                            type: "spiningDubbles",
                            color: "rgb(90, 193, 221)",
                            size: {width: "50px", height: "50px"}
                        }
                    }) : t._e(), t._v(" "), t.loading ? t._e() : e("table", {staticClass: "table table-hover table-bordered"}, [t._m(1), t._v(" "), e("tbody", t._l(t.data, function (a) {
                        return e("tr", {key: a.id}, [e("td", [t._v("\n                " + t._s(a.hostname) + "\n              ")]), t._v(" "), e("td", {attrs: {nowrap: ""}}, [t._v("\n                " + t._s(a.register_ip) + "\n              ")]), t._v(" "), e("td", {attrs: {nowrap: ""}}, [t._v("\n                " + t._s(a.language) + "/" + t._s(a.version) + " "), e("br"), t._v("\n                official/" + t._s(a.plugin_version) + "\n              ")]), t._v(" "), e("td", [t._v("\n                " + t._s(a.rasp_home) + "\n              ")]), t._v(" "), e("td", {attrs: {nowrap: ""}}, [t._v("\n                " + t._s(t.moment(1e3 * a.last_heartbeat_time).format("YYYY-MM-DD")) + " "), e("br"), t._v("\n                " + t._s(t.moment(1e3 * a.last_heartbeat_time).format("HH:mm:ss")) + "\n              ")]), t._v(" "), e("td", {attrs: {nowrap: ""}}, [a.online ? t._e() : e("span", {staticClass: "text-danger"}, [t._v("\n                  离线\n                ")]), t._v(" "), a.online ? e("span", [t._v("\n                  正常\n                ")]) : t._e()]), t._v(" "), e("td", {attrs: {nowrap: ""}}, [e("a", {
                            attrs: {href: "javascript:"},
                            on: {
                                click: function (e) {
                                    t.doDelete(a)
                                }
                            }
                        }, [t._v("\n                  删除\n                ")])])])
                    }))]), t._v(" "), t.loading ? t._e() : e("nav", [e("b-pagination", {
                        attrs: {
                            align: "center",
                            "total-rows": t.total,
                            "per-page": 10
                        }, on: {
                            change: function (a) {
                                t.loadRaspList(a)
                            }
                        }, model: {
                            value: t.currentPage, callback: function (a) {
                                t.currentPage = a
                            }, expression: "currentPage"
                        }
                    })], 1)], 1)])])])
                }, staticRenderFns: [function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("span", {staticClass: "input-icon-addon"}, [a("i", {staticClass: "fe fe-search"})])
                }, function () {
                    var t = this, a = t.$createElement, e = t._self._c || a;
                    return e("thead", [e("tr", [e("th", {attrs: {nowrap: ""}}, [t._v("\n                主机名\n              ")]), t._v(" "), e("th", [t._v("\n                IP\n              ")]), t._v(" "), e("th", [t._v("\n                RASP 版本\n              ")]), t._v(" "), e("th", [t._v("\n                RASP 目录\n              ")]), t._v(" "), e("th", [t._v("\n                上次通信\n              ")]), t._v(" "), e("th", [t._v("\n                状态\n              ")]), t._v(" "), e("th", [t._v("\n                操作\n              ")])])])
                }]
            }, tt = e("VU/8")(K, Z, !1, null, null, null).exports, at = {
                name: "AlarmSettings", data: function () {
                    return {data: {email_alarm_conf: {recv_addr: []}, ding_alarm_conf: {}, http_alarm_conf: {}}}
                }, computed: w()({}, Object(o.c)(["current_app"])), methods: {
                    setData: function (t) {
                        this.data = t
                    }, saveSettings: function (t) {
                        var a = {app_id: this.current_app.id}, e = "报警设置保存成功";
                        switch (t) {
                            case"email":
                                a.email_alarm_conf = this.data.email_alarm_conf, "string" == typeof a.email_alarm_conf.recv_addr && (a.email_alarm_conf.recv_addr = a.email_alarm_conf.recv_addr.split(/\s*[,;]\s*/)), e = "邮件报警设置保存成功";
                                break;
                            case"ding":
                                a.ding_alarm_conf = this.data.ding_alarm_conf, "string" == typeof a.ding_alarm_conf.recv_user && (a.ding_alarm_conf.recv_user = a.ding_alarm_conf.recv_user.split(/\s*[,;]\s*/)), "string" == typeof a.ding_alarm_conf.recv_party && (a.ding_alarm_conf.recv_party = a.ding_alarm_conf.recv_party.split(/\s*[,;]\s*/)), e = "钉钉报警设置保存成功";
                                break;
                            case"http":
                                a.http_alarm_conf = this.data.http_alarm_conf, "string" == typeof a.http_alarm_conf.recv_addr && (a.http_alarm_conf.recv_addr = [a.http_alarm_conf.recv_addr]), e = "HTTP 推送设置保存成功"
                        }
                        this.api_request("v1/api/app/alarm/config", a, function (t) {
                            alert(e)
                        })
                    }, testSettings: function (t) {
                        var a = {app_id: this.current_app.id}, e = "v1/api/app/" + t + "/test";
                        this.api_request(e, a, function (t) {
                            alert("发送成功")
                        })
                    }
                }
            }, et = {
                render: function () {
                    var t = this, a = t.$createElement, e = t._self._c || a;
                    return e("div", [e("div", {staticClass: "card"}, [t._m(0), t._v(" "), e("div", {staticClass: "card-body"}, [e("div", {staticClass: "form-group"}, [t._m(1), t._v(" "), e("input", {
                        directives: [{
                            name: "model",
                            rawName: "v-model",
                            value: t.data.email_alarm_conf.recv_addr,
                            expression: "data.email_alarm_conf.recv_addr"
                        }],
                        staticClass: "form-control",
                        attrs: {type: "text"},
                        domProps: {value: t.data.email_alarm_conf.recv_addr},
                        on: {
                            input: function (a) {
                                a.target.composing || t.$set(t.data.email_alarm_conf, "recv_addr", a.target.value)
                            }
                        }
                    })]), t._v(" "), e("div", {staticClass: "form-group"}, [e("label", {staticClass: "form-label"}, [t._v("\n          报警标题\n        ")]), t._v(" "), e("input", {
                        directives: [{
                            name: "model",
                            rawName: "v-model",
                            value: t.data.email_alarm_conf.subject,
                            expression: "data.email_alarm_conf.subject"
                        }],
                        staticClass: "form-control",
                        attrs: {type: "text"},
                        domProps: {value: t.data.email_alarm_conf.subject},
                        on: {
                            input: function (a) {
                                a.target.composing || t.$set(t.data.email_alarm_conf, "subject", a.target.value)
                            }
                        }
                    })]), t._v(" "), e("div", {staticClass: "form-group"}, [e("label", {staticClass: "form-label"}, [t._v("\n          邮件服务器地址\n        ")]), t._v(" "), e("input", {
                        directives: [{
                            name: "model",
                            rawName: "v-model",
                            value: t.data.email_alarm_conf.server_addr,
                            expression: "data.email_alarm_conf.server_addr"
                        }],
                        staticClass: "form-control",
                        attrs: {type: "text"},
                        domProps: {value: t.data.email_alarm_conf.server_addr},
                        on: {
                            input: function (a) {
                                a.target.composing || t.$set(t.data.email_alarm_conf, "server_addr", a.target.value)
                            }
                        }
                    })]), t._v(" "), e("div", {staticClass: "form-group"}, [e("label", {staticClass: "form-label"}, [t._v("\n          邮箱账号\n        ")]), t._v(" "), e("input", {
                        directives: [{
                            name: "model",
                            rawName: "v-model",
                            value: t.data.email_alarm_conf.username,
                            expression: "data.email_alarm_conf.username"
                        }],
                        staticClass: "form-control",
                        attrs: {type: "email"},
                        domProps: {value: t.data.email_alarm_conf.username},
                        on: {
                            input: function (a) {
                                a.target.composing || t.$set(t.data.email_alarm_conf, "username", a.target.value)
                            }
                        }
                    })]), t._v(" "), e("div", {staticClass: "form-group"}, [e("label", {staticClass: "form-label"}, [t._v("\n          邮箱密码\n        ")]), t._v(" "), e("input", {
                        directives: [{
                            name: "model",
                            rawName: "v-model",
                            value: t.data.email_alarm_conf.password,
                            expression: "data.email_alarm_conf.password"
                        }],
                        staticClass: "form-control",
                        attrs: {type: "text"},
                        domProps: {value: t.data.email_alarm_conf.password},
                        on: {
                            input: function (a) {
                                a.target.composing || t.$set(t.data.email_alarm_conf, "password", a.target.value)
                            }
                        }
                    })]), t._v(" "), e("div", {staticClass: "form-group"}, [e("label", {staticClass: "custom-switch"}, [e("input", {
                        directives: [{
                            name: "model",
                            rawName: "v-model",
                            value: t.data.email_alarm_conf.enable,
                            expression: "data.email_alarm_conf.enable"
                        }],
                        staticClass: "custom-switch-input",
                        attrs: {type: "checkbox", checked: "data.email_alarm_conf.enable"},
                        domProps: {checked: Array.isArray(t.data.email_alarm_conf.enable) ? t._i(t.data.email_alarm_conf.enable, null) > -1 : t.data.email_alarm_conf.enable},
                        on: {
                            change: function (a) {
                                var e = t.data.email_alarm_conf.enable, s = a.target, n = !!s.checked;
                                if (Array.isArray(e)) {
                                    var i = t._i(e, null);
                                    s.checked ? i < 0 && t.$set(t.data.email_alarm_conf, "enable", e.concat([null])) : i > -1 && t.$set(t.data.email_alarm_conf, "enable", e.slice(0, i).concat(e.slice(i + 1)))
                                } else t.$set(t.data.email_alarm_conf, "enable", n)
                            }
                        }
                    }), t._v(" "), e("span", {staticClass: "custom-switch-indicator"}), t._v(" "), e("span", {staticClass: "custom-switch-description"}, [t._v("\n            开启邮件报警\n          ")])])])]), t._v(" "), e("div", {staticClass: "card-footer"}, [e("button", {
                        staticClass: "btn btn-primary",
                        attrs: {type: "submit"},
                        on: {
                            click: function (a) {
                                t.saveSettings("email")
                            }
                        }
                    }, [t._v("\n        保存\n      ")]), t._v(" "), e("button", {
                        staticClass: "btn btn-info pull-right",
                        attrs: {type: "submit"},
                        on: {
                            click: function (a) {
                                t.testSettings("email")
                            }
                        }
                    }, [t._v("\n        发送测试数据\n      ")])])]), t._v(" "), e("div", {staticClass: "card"}, [t._m(2), t._v(" "), e("div", {staticClass: "card-body"}, [e("div", {staticClass: "form-group"}, [t._m(3), t._v(" "), e("input", {
                        directives: [{
                            name: "model",
                            rawName: "v-model",
                            value: t.data.http_alarm_conf.recv_addr,
                            expression: "data.http_alarm_conf.recv_addr"
                        }],
                        staticClass: "form-control",
                        attrs: {type: "text"},
                        domProps: {value: t.data.http_alarm_conf.recv_addr},
                        on: {
                            input: function (a) {
                                a.target.composing || t.$set(t.data.http_alarm_conf, "recv_addr", a.target.value)
                            }
                        }
                    })]), t._v(" "), e("div", {staticClass: "form-group"}, [e("label", {staticClass: "custom-switch"}, [e("input", {
                        directives: [{
                            name: "model",
                            rawName: "v-model",
                            value: t.data.http_alarm_conf.enable,
                            expression: "data.http_alarm_conf.enable"
                        }],
                        staticClass: "custom-switch-input",
                        attrs: {type: "checkbox", checked: "data.http_alarm_conf.enable"},
                        domProps: {checked: Array.isArray(t.data.http_alarm_conf.enable) ? t._i(t.data.http_alarm_conf.enable, null) > -1 : t.data.http_alarm_conf.enable},
                        on: {
                            change: function (a) {
                                var e = t.data.http_alarm_conf.enable, s = a.target, n = !!s.checked;
                                if (Array.isArray(e)) {
                                    var i = t._i(e, null);
                                    s.checked ? i < 0 && t.$set(t.data.http_alarm_conf, "enable", e.concat([null])) : i > -1 && t.$set(t.data.http_alarm_conf, "enable", e.slice(0, i).concat(e.slice(i + 1)))
                                } else t.$set(t.data.http_alarm_conf, "enable", n)
                            }
                        }
                    }), t._v(" "), e("span", {staticClass: "custom-switch-indicator"}), t._v(" "), e("span", {staticClass: "custom-switch-description"}, [t._v("\n            开启报警推送\n          ")])])])]), t._v(" "), e("div", {staticClass: "card-footer"}, [e("button", {
                        staticClass: "btn btn-primary",
                        attrs: {type: "submit"},
                        on: {
                            click: function (a) {
                                t.saveSettings("http")
                            }
                        }
                    }, [t._v("\n        保存\n      ")]), t._v(" "), e("button", {
                        staticClass: "btn btn-info pull-right",
                        attrs: {type: "submit"},
                        on: {
                            click: function (a) {
                                t.testSettings("http")
                            }
                        }
                    }, [t._v("\n        发送测试数据\n      ")])])]), t._v(" "), e("div", {staticClass: "card"}, [t._m(4), t._v(" "), e("div", {staticClass: "card-body"}, [e("div", {staticClass: "form-group"}, [t._m(5), t._v(" "), e("input", {
                        directives: [{
                            name: "model",
                            rawName: "v-model",
                            value: t.data.ding_alarm_conf.recv_user,
                            expression: "data.ding_alarm_conf.recv_user"
                        }],
                        staticClass: "form-control",
                        attrs: {type: "text"},
                        domProps: {value: t.data.ding_alarm_conf.recv_user},
                        on: {
                            input: function (a) {
                                a.target.composing || t.$set(t.data.ding_alarm_conf, "recv_user", a.target.value)
                            }
                        }
                    })]), t._v(" "), e("div", {staticClass: "form-group"}, [e("label", {staticClass: "form-label"}, [t._v("\n          推送部门列表\n        ")]), t._v(" "), e("input", {
                        directives: [{
                            name: "model",
                            rawName: "v-model",
                            value: t.data.ding_alarm_conf.recv_party,
                            expression: "data.ding_alarm_conf.recv_party"
                        }],
                        staticClass: "form-control",
                        attrs: {type: "text"},
                        domProps: {value: t.data.ding_alarm_conf.recv_party},
                        on: {
                            input: function (a) {
                                a.target.composing || t.$set(t.data.ding_alarm_conf, "recv_party", a.target.value)
                            }
                        }
                    })]), t._v(" "), e("div", {staticClass: "form-group"}, [e("label", {staticClass: "form-label"}, [t._v("\n          Corp ID\n        ")]), t._v(" "), e("input", {
                        directives: [{
                            name: "model",
                            rawName: "v-model",
                            value: t.data.ding_alarm_conf.corp_id,
                            expression: "data.ding_alarm_conf.corp_id"
                        }],
                        staticClass: "form-control",
                        attrs: {type: "text"},
                        domProps: {value: t.data.ding_alarm_conf.corp_id},
                        on: {
                            input: function (a) {
                                a.target.composing || t.$set(t.data.ding_alarm_conf, "corp_id", a.target.value)
                            }
                        }
                    })]), t._v(" "), e("div", {staticClass: "form-group"}, [e("label", {staticClass: "form-label"}, [t._v("\n          Corp Secret\n        ")]), t._v(" "), e("input", {
                        directives: [{
                            name: "model",
                            rawName: "v-model",
                            value: t.data.ding_alarm_conf.corp_secret,
                            expression: "data.ding_alarm_conf.corp_secret"
                        }],
                        staticClass: "form-control",
                        attrs: {type: "text"},
                        domProps: {value: t.data.ding_alarm_conf.corp_secret},
                        on: {
                            input: function (a) {
                                a.target.composing || t.$set(t.data.ding_alarm_conf, "corp_secret", a.target.value)
                            }
                        }
                    })]), t._v(" "), e("div", {staticClass: "form-group"}, [e("label", {staticClass: "form-label"}, [t._v("\n          Agent ID\n        ")]), t._v(" "), e("input", {
                        directives: [{
                            name: "model",
                            rawName: "v-model",
                            value: t.data.ding_alarm_conf.agent_id,
                            expression: "data.ding_alarm_conf.agent_id"
                        }],
                        staticClass: "form-control",
                        attrs: {type: "text"},
                        domProps: {value: t.data.ding_alarm_conf.agent_id},
                        on: {
                            input: function (a) {
                                a.target.composing || t.$set(t.data.ding_alarm_conf, "agent_id", a.target.value)
                            }
                        }
                    })]), t._v(" "), e("div", {staticClass: "form-group"}, [e("label", {staticClass: "custom-switch"}, [e("input", {
                        directives: [{
                            name: "model",
                            rawName: "v-model",
                            value: t.data.ding_alarm_conf.enable,
                            expression: "data.ding_alarm_conf.enable"
                        }],
                        staticClass: "custom-switch-input",
                        attrs: {type: "checkbox", checked: "data.ding_alarm_conf.enable"},
                        domProps: {checked: Array.isArray(t.data.ding_alarm_conf.enable) ? t._i(t.data.ding_alarm_conf.enable, null) > -1 : t.data.ding_alarm_conf.enable},
                        on: {
                            change: function (a) {
                                var e = t.data.ding_alarm_conf.enable, s = a.target, n = !!s.checked;
                                if (Array.isArray(e)) {
                                    var i = t._i(e, null);
                                    s.checked ? i < 0 && t.$set(t.data.ding_alarm_conf, "enable", e.concat([null])) : i > -1 && t.$set(t.data.ding_alarm_conf, "enable", e.slice(0, i).concat(e.slice(i + 1)))
                                } else t.$set(t.data.ding_alarm_conf, "enable", n)
                            }
                        }
                    }), t._v(" "), e("span", {staticClass: "custom-switch-indicator"}), t._v(" "), e("span", {staticClass: "custom-switch-description"}, [t._v("\n            开启钉钉推送\n          ")])])])]), t._v(" "), e("div", {staticClass: "card-footer"}, [e("button", {
                        staticClass: "btn btn-primary",
                        attrs: {type: "submit"},
                        on: {
                            click: function (a) {
                                t.saveSettings("ding")
                            }
                        }
                    }, [t._v("\n        保存\n      ")]), t._v(" "), e("button", {
                        staticClass: "btn btn-info pull-right",
                        attrs: {type: "submit"},
                        on: {
                            click: function (a) {
                                t.testSettings("ding")
                            }
                        }
                    }, [t._v("\n        发送测试数据\n      ")])])])])
                }, staticRenderFns: [function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("div", {staticClass: "card-header"}, [a("h3", {staticClass: "card-title"}, [this._v("\n        邮件报警\n      ")]), this._v(" "), a("div", {staticClass: "card-options"})])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("label", {staticClass: "form-label"}, [this._v("\n          推送邮箱地址\n          "), a("a", {attrs: {href: "javascript:"}}, [this._v("\n            [帮助文档]\n          ")])])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("div", {staticClass: "card-header"}, [a("h3", {staticClass: "card-title"}, [this._v("\n        HTTP 推送\n      ")])])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("label", {staticClass: "form-label"}, [this._v("\n          HTTP/HTTPS URL\n          "), a("a", {attrs: {href: "javascript:"}}, [this._v("\n            [帮助文档]\n          ")])])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("div", {staticClass: "card-header"}, [a("h3", {staticClass: "card-title"}, [this._v("\n        钉钉集成\n      ")])])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("label", {staticClass: "form-label"}, [this._v("\n          推送用户列表\n          "), a("a", {attrs: {href: "javascript:"}}, [this._v("\n            [帮助文档]\n          ")])])
                }]
            }, st = e("VU/8")(at, et, !1, null, null, null).exports, nt = e("mvHQ"), it = e.n(nt), rt = {
                name: "appEditModal", data: function () {
                    return {data: {}, is_edit: !1}
                }, methods: {
                    showModal: function (t, a) {
                        this.data = JSON.parse(it()(t)), this.is_edit = a, $("#appEditModal").modal()
                    }, saveApp: function () {
                        var t = {data: this.data, is_edit: this.is_edit};
                        this.$emit("save", t)
                    }
                }
            }, lt = {
                render: function () {
                    var t = this, a = t.$createElement, e = t._self._c || a;
                    return e("div", {
                        staticClass: "modal no-fade",
                        attrs: {id: "appEditModal", tabindex: "-1", role: "dialog"}
                    }, [e("div", {
                        staticClass: "modal-dialog",
                        attrs: {role: "document"}
                    }, [e("div", {staticClass: "modal-content"}, [t._m(0), t._v(" "), e("div", {staticClass: "modal-body"}, [e("div", {staticClass: "form-group"}, [e("label", [t._v("应用名称")]), t._v(" "), e("input", {
                        directives: [{
                            name: "model",
                            rawName: "v-model",
                            value: t.data.name,
                            expression: "data.name"
                        }],
                        staticClass: "form-control",
                        attrs: {type: "text"},
                        domProps: {value: t.data.name},
                        on: {
                            input: function (a) {
                                a.target.composing || t.$set(t.data, "name", a.target.value)
                            }
                        }
                    })]), t._v(" "), e("div", {staticClass: "form-group"}, [e("label", [t._v("应用备注")]), t._v(" "), e("input", {
                        directives: [{
                            name: "model",
                            rawName: "v-model",
                            value: t.data.description,
                            expression: "data.description"
                        }],
                        staticClass: "form-control",
                        attrs: {type: "text"},
                        domProps: {value: t.data.description},
                        on: {
                            input: function (a) {
                                a.target.composing || t.$set(t.data, "description", a.target.value)
                            }
                        }
                    })]), t._v(" "), e("div", {staticClass: "form-group"}, [e("label", [t._v("应用语言")]), t._v(" "), e("select", {
                        directives: [{
                            name: "model",
                            rawName: "v-model",
                            value: t.data.language,
                            expression: "data.language"
                        }], staticClass: "form-control", on: {
                            change: function (a) {
                                var e = Array.prototype.filter.call(a.target.options, function (t) {
                                    return t.selected
                                }).map(function (t) {
                                    return "_value" in t ? t._value : t.value
                                });
                                t.$set(t.data, "language", a.target.multiple ? e : e[0])
                            }
                        }
                    }, [e("option", {attrs: {value: "java"}}, [t._v("java")]), t._v(" "), e("option", {attrs: {value: "php"}}, [t._v("php")])])])]), t._v(" "), e("div", {staticClass: "modal-footer"}, [e("button", {
                        staticClass: "btn btn-primary",
                        attrs: {"data-dismiss": "modal"},
                        on: {
                            click: function (a) {
                                t.saveApp()
                            }
                        }
                    }, [t._v("保存")]), t._v(" "), e("button", {
                        staticClass: "btn btn-default",
                        attrs: {"data-dismiss": "modal"}
                    }, [t._v("关闭")])])])])])
                }, staticRenderFns: [function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("div", {staticClass: "modal-header"}, [a("h5", {staticClass: "modal-title"}, [this._v("添加/编辑 应用")]), this._v(" "), a("button", {
                        staticClass: "close",
                        attrs: {type: "button", "data-dismiss": "modal", "aria-label": "Close"}
                    })])
                }]
            }, ct = {
                name: "AppSettings",
                components: {appEditModal: e("VU/8")(rt, lt, !1, null, null, null).exports},
                data: function () {
                    return {data: [], loading: !1, total: 0, currentPage: 1}
                },
                computed: w()({}, Object(o.c)(["current_app"])),
                watch: {
                    current_app: function () {
                        this.loadApps(1)
                    }
                },
                mounted: function () {
                    this.loadApps(1)
                },
                methods: w()({}, Object(o.b)(["loadAppList"]), {
                    loadApps: function (t) {
                        var a = this;
                        return this.loading = !0, this.request.post("v1/api/app/get", {
                            page: t,
                            perpage: 10
                        }).then(function (e) {
                            a.currentPage = t, a.data = e.data, a.total = e.total, a.loading = !1
                        })
                    }, deleteApp: function (t) {
                        if (confirm("确认操作")) {
                            var a = this, e = {id: t.id};
                            this.api_request("v1/api/app/delete", e, function (t) {
                                a.loadApps(1)
                            })
                        }
                    }, editApp: function (t, a) {
                        this.$refs.appEditModal.showModal({
                            app_id: t.id,
                            name: t.name,
                            language: t.language,
                            description: t.description
                        }, a)
                    }, onEdit: function (t) {
                        var a = this, e = t.is_edit, s = t.data;
                        this.request.post(e ? "v1/api/app/config" : "v1/api/app", s).then(function () {
                            a.loadApps(1), a.loadAppList(a.current_app.id)
                        })
                    }
                })
            }, ot = {
                render: function () {
                    var t = this, a = t.$createElement, e = t._self._c || a;
                    return e("div", [e("div", {staticClass: "card"}, [t._m(0), t._v(" "), e("div", {staticClass: "card-body"}, [t.loading ? e("vue-loading", {
                        attrs: {
                            type: "spiningDubbles",
                            color: "rgb(90, 193, 221)",
                            size: {width: "50px", height: "50px"}
                        }
                    }) : t._e(), t._v(" "), t.loading ? t._e() : e("table", {staticClass: "table table-bordered table-hover"}, [t._m(1), t._v(" "), e("tbody", t._l(t.data, function (a) {
                        return e("tr", {key: a.id}, [e("td", [t._v("\n              " + t._s(a.name) + "\n            ")]), t._v(" "), e("td", [t._v("\n              " + t._s(a.language) + "\n            ")]), t._v(" "), e("td", [t._v("\n              " + t._s(a.description) + "\n            ")]), t._v(" "), e("td", [e("a", {
                            attrs: {href: "javascript:"},
                            on: {
                                click: function (e) {
                                    t.editApp(a, !0)
                                }
                            }
                        }, [t._v("\n                编辑\n              ")]), t._v(" "), e("a", {
                            attrs: {href: "javascript:"},
                            on: {
                                click: function (e) {
                                    t.deleteApp(a)
                                }
                            }
                        }, [t._v("\n                删除\n              ")])])])
                    }))]), t._v(" "), t.loading ? t._e() : e("nav", [e("b-pagination", {
                        attrs: {
                            align: "center",
                            "total-rows": t.total,
                            "per-page": 10
                        }, on: {change: t.loadApps}, model: {
                            value: t.currentPage, callback: function (a) {
                                t.currentPage = a
                            }, expression: "currentPage"
                        }
                    })], 1)], 1), t._v(" "), e("div", {staticClass: "card-footer text-right"}, [e("div", {staticClass: "d-flex"}, [e("button", {
                        staticClass: "btn btn-primary",
                        on: {
                            click: function (a) {
                                t.editApp({})
                            }
                        }
                    }, [t._v("\n          添加\n        ")])])])]), t._v(" "), e("appEditModal", {
                        ref: "appEditModal",
                        on: {
                            save: function (a) {
                                t.onEdit(a)
                            }
                        }
                    })], 1)
                }, staticRenderFns: [function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("div", {staticClass: "card-header"}, [a("h3", {staticClass: "card-title"}, [this._v("\n        应用管理\n      ")])])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("thead", [a("th", [this._v("\n            名称\n          ")]), this._v(" "), a("th", [this._v("\n            语言\n          ")]), this._v(" "), a("th", [this._v("\n            备注\n          ")]), this._v(" "), a("th", [this._v("\n            操作\n          ")])])
                }]
            }, dt = e("VU/8")(ct, ot, !1, null, null, null).exports, _t = {
                name: "AuthSettings", data: function () {
                    return {data: [], total: 0, currentPage: 1, loading: !1, oldpass: "", newpass1: "", newpass2: ""}
                }, mounted: function () {
                    this.loadTokens(1)
                }, methods: {
                    changePass: function () {
                        this.oldpass.length > 0 && this.newpass1.length > 0 && this.newpass1 == this.newpass2 ? this.api_request("v1/user/update", {
                            old_password: this.oldpass,
                            new_password: this.newpass1
                        }, function (t) {
                            alert("密码修改成功")
                        }) : alert("两次密码输入不一致，请重新输入")
                    }, createToken: function () {
                        var t = this, a = prompt("请输入备注信息");
                        a && a.length && t.api_request("v1/api/token", {description: a}, function (a) {
                            t.loadTokens(1)
                        })
                    }, editToken: function (t) {
                        var a = this, e = prompt("请输入新的备注信息");
                        e && this.api_request("v1/api/token", {description: e, token: t.token}, function (t) {
                            a.loadTokens(1)
                        })
                    }, deleteToken: function (t) {
                        if (confirm("删除 " + t.token + " 吗")) {
                            var a = this, e = {token: t.token};
                            this.api_request("v1/api/token/delete", e, function (t) {
                                a.loadTokens(1)
                            })
                        }
                    }, loadTokens: function (t) {
                        var a = this;
                        return this.loading = !0, this.request.post("v1/api/token/get", {
                            page: t,
                            perpage: 10
                        }).then(function (e) {
                            a.currentPage = t, a.data = e.data, a.total = e.total, a.loading = !1
                        })
                    }
                }
            }, vt = {
                render: function () {
                    var t = this, a = t.$createElement, e = t._self._c || a;
                    return e("div", [e("div", {staticClass: "card"}, [t._m(0), t._v(" "), e("div", {staticClass: "card-body"}, [e("div", {staticClass: "form-group"}, [e("label", {staticClass: "form-label"}, [t._v("\n          原密码\n        ")]), t._v(" "), e("input", {
                        directives: [{
                            name: "model",
                            rawName: "v-model",
                            value: t.oldpass,
                            expression: "oldpass"
                        }],
                        staticClass: "form-control",
                        attrs: {type: "password"},
                        domProps: {value: t.oldpass},
                        on: {
                            input: function (a) {
                                a.target.composing || (t.oldpass = a.target.value)
                            }
                        }
                    })]), t._v(" "), e("div", {staticClass: "form-group"}, [e("label", {staticClass: "form-label"}, [t._v("\n          新密码\n        ")]), t._v(" "), e("input", {
                        directives: [{
                            name: "model",
                            rawName: "v-model",
                            value: t.newpass1,
                            expression: "newpass1"
                        }],
                        staticClass: "form-control",
                        attrs: {type: "password"},
                        domProps: {value: t.newpass1},
                        on: {
                            input: function (a) {
                                a.target.composing || (t.newpass1 = a.target.value)
                            }
                        }
                    })]), t._v(" "), e("div", {staticClass: "form-group"}, [e("label", {staticClass: "form-label"}, [t._v("\n          再次输入新密码\n        ")]), t._v(" "), e("input", {
                        directives: [{
                            name: "model",
                            rawName: "v-model",
                            value: t.newpass2,
                            expression: "newpass2"
                        }],
                        staticClass: "form-control",
                        attrs: {type: "password"},
                        domProps: {value: t.newpass2},
                        on: {
                            input: function (a) {
                                a.target.composing || (t.newpass2 = a.target.value)
                            }
                        }
                    })])]), t._v(" "), e("div", {staticClass: "card-footer text-right"}, [e("div", {staticClass: "d-flex"}, [e("button", {
                        staticClass: "btn btn-primary",
                        on: {
                            click: function (a) {
                                t.changePass()
                            }
                        }
                    }, [t._v("\n          保存\n        ")])])])]), t._v(" "), e("div", {staticClass: "card"}, [t._m(1), t._v(" "), e("div", {staticClass: "card-body"}, [t.loading ? e("vue-loading", {
                        attrs: {
                            type: "spiningDubbles",
                            color: "rgb(90, 193, 221)",
                            size: {width: "50px", height: "50px"}
                        }
                    }) : t._e(), t._v(" "), t.loading ? t._e() : e("table", {staticClass: "table table-striped table-bordered"}, [t._m(2), t._v(" "), e("tbody", t._l(t.data, function (a) {
                        return e("tr", {key: a.token}, [e("td", {attrs: {nowrap: ""}}, [t._v("\n              " + t._s(a.token) + "\n            ")]), t._v(" "), e("td", [t._v("\n              " + t._s(a.description) + "\n            ")]), t._v(" "), e("td", {attrs: {nowrap: ""}}, [e("a", {
                            attrs: {href: "javascript:"},
                            on: {
                                click: function (e) {
                                    t.editToken(a)
                                }
                            }
                        }, [t._v("\n                编辑\n              ")]), t._v(" "), e("a", {
                            attrs: {href: "javascript:"},
                            on: {
                                click: function (e) {
                                    t.deleteToken(a)
                                }
                            }
                        }, [t._v("\n                删除\n              ")])])])
                    }))]), t._v(" "), t.loading ? t._e() : e("nav", [e("b-pagination", {
                        attrs: {
                            align: "center",
                            "total-rows": t.total,
                            "per-page": 10
                        }, on: {change: t.loadTokens}, model: {
                            value: t.currentPage, callback: function (a) {
                                t.currentPage = a
                            }, expression: "currentPage"
                        }
                    })], 1)], 1), t._v(" "), e("div", {staticClass: "card-footer text-right"}, [e("div", {staticClass: "d-flex"}, [e("button", {
                        staticClass: "btn btn-primary",
                        on: {
                            click: function (a) {
                                t.createToken()
                            }
                        }
                    }, [t._v("\n          创建\n        ")])])])])])
                }, staticRenderFns: [function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("div", {staticClass: "card-header"}, [a("h3", {staticClass: "card-title"}, [this._v("\n        修改登录密码\n      ")])])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("div", {staticClass: "card-header"}, [a("h3", {staticClass: "card-title"}, [this._v("\n        TOKEN 管理\n      ")])])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("thead", [a("tr", [a("th", [this._v("\n              Token\n            ")]), this._v(" "), a("th", [this._v("\n              备注\n            ")]), this._v(" "), a("th", [this._v("\n              操作\n            ")])])])
                }]
            }, pt = e("VU/8")(_t, vt, !1, null, null, null).exports, ut = {
                name: "GeneralSettings", data: function () {
                    return {data: {rasp_config: {}}}
                }, computed: w()({}, Object(o.c)(["current_app"])), methods: {
                    setData: function (t) {
                        this.data = t
                    }, doSave: function () {
                        var t = {app_id: this.current_app.id, config: this.data};
                        this.api_request("v1/api/app/general/config", t, function (t) {
                            alert("保存成功")
                        })
                    }
                }
            }, mt = {
                render: function () {
                    var t = this, a = t.$createElement, e = t._self._c || a;
                    return e("div", [e("div", {staticClass: "card"}, [t._m(0), t._v(" "), e("div", {staticClass: "card-body"}, [e("div", {staticClass: "form-group"}, [t._m(1), t._v(" "), e("input", {
                        directives: [{
                            name: "model",
                            rawName: "v-model",
                            value: t.data["clientip.header"],
                            expression: "data['clientip.header']"
                        }],
                        staticClass: "form-control",
                        attrs: {type: "text", name: "example-text-input"},
                        domProps: {value: t.data["clientip.header"]},
                        on: {
                            input: function (a) {
                                a.target.composing || t.$set(t.data, "clientip.header", a.target.value)
                            }
                        }
                    })]), t._v(" "), e("div", {staticClass: "form-group"}, [e("label", {staticClass: "form-label"}, [t._v("\n          自定义拦截状态码\n        ")]), t._v(" "), e("b-form-select", {
                        attrs: {options: [302, 403, 404, 500]},
                        model: {
                            value: t.data["block.status_code"], callback: function (a) {
                                t.$set(t.data, "block.status_code", a)
                            }, expression: "data['block.status_code']"
                        }
                    })], 1), t._v(" "), e("div", {staticClass: "form-group"}, [t._m(2), t._v(" "), e("input", {
                        directives: [{
                            name: "model",
                            rawName: "v-model",
                            value: t.data["block.redirect_url"],
                            expression: "data['block.redirect_url']"
                        }],
                        staticClass: "form-control",
                        attrs: {type: "text", name: "example-text-input"},
                        domProps: {value: t.data["block.redirect_url"]},
                        on: {
                            input: function (a) {
                                a.target.composing || t.$set(t.data, "block.redirect_url", a.target.value)
                            }
                        }
                    })]), t._v(" "), e("div", {staticClass: "form-group"}, [t._m(3), t._v(" "), e("textarea", {
                        directives: [{
                            name: "model",
                            rawName: "v-model",
                            value: t.data["block.content_html"],
                            expression: "data['block.content_html']"
                        }],
                        staticClass: "form-control",
                        attrs: {type: "text"},
                        domProps: {value: t.data["block.content_html"]},
                        on: {
                            input: function (a) {
                                a.target.composing || t.$set(t.data, "block.content_html", a.target.value)
                            }
                        }
                    })]), t._v(" "), e("div", {staticClass: "form-group"}, [t._m(4), t._v(" "), e("textarea", {
                        directives: [{
                            name: "model",
                            rawName: "v-model",
                            value: t.data["block.content_xml"],
                            expression: "data['block.content_xml']"
                        }],
                        staticClass: "form-control",
                        attrs: {type: "text"},
                        domProps: {value: t.data["block.content_xml"]},
                        on: {
                            input: function (a) {
                                a.target.composing || t.$set(t.data, "block.content_xml", a.target.value)
                            }
                        }
                    })]), t._v(" "), e("div", {staticClass: "form-group"}, [t._m(5), t._v(" "), e("textarea", {
                        directives: [{
                            name: "model",
                            rawName: "v-model",
                            value: t.data["block.content_json"],
                            expression: "data['block.content_json']"
                        }],
                        staticClass: "form-control",
                        attrs: {type: "text"},
                        domProps: {value: t.data["block.content_json"]},
                        on: {
                            input: function (a) {
                                a.target.composing || t.$set(t.data, "block.content_json", a.target.value)
                            }
                        }
                    })])]), t._v(" "), e("div", {staticClass: "card-footer text-right"}, [e("div", {staticClass: "d-flex"}, [e("button", {
                        staticClass: "btn btn-primary",
                        attrs: {type: "submit"},
                        on: {
                            click: function (a) {
                                t.doSave()
                            }
                        }
                    }, [t._v("\n          保存\n        ")])])])])])
                }, staticRenderFns: [function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("div", {staticClass: "card-header"}, [a("h3", {staticClass: "card-title"}, [this._v("\n        通用设置\n      ")])])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("label", {staticClass: "form-label"}, [this._v("\n          真实 IP header\n          "), a("a", {attrs: {href: "javascript:"}}, [this._v("\n            [帮助文档]\n          ")])])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("label", {staticClass: "form-label"}, [this._v("\n          自定义拦截跳转页面\n          "), a("a", {attrs: {href: "javascript:"}}, [this._v("\n            [帮助文档]\n          ")])])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("label", {staticClass: "form-label"}, [this._v("\n          自定义HTML响应内容\n          "), a("a", {attrs: {href: "javascript:"}}, [this._v("\n            [帮助文档]\n          ")])])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("label", {staticClass: "form-label"}, [this._v("\n          自定义XML响应内容\n          "), a("a", {attrs: {href: "javascript:"}}, [this._v("\n            [帮助文档]\n          ")])])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("label", {staticClass: "form-label"}, [this._v("\n          自定义JSON响应内容\n          "), a("a", {attrs: {href: "javascript:"}}, [this._v("\n            [帮助文档]\n          ")])])
                }]
            }, ht = e("VU/8")(ut, mt, !1, null, null, null).exports, ft = e("fZjL"), gt = e.n(ft), bt = {
                name: "WhitelistEditModal", data: function () {
                    return {data: {hook: {}}, index: !1, attack_types: u}
                }, mounted: function () {
                }, methods: {
                    showModal: function (t, a) {
                        this.data = JSON.parse(it()(t)), this.index = a, $("#whitelistEditModal").modal()
                    }, saveApp: function () {
                        this.data.url && (this.data.url.startsWith("http://") || this.data.url.startsWith("https://") ? alert("URL 无需以 http/https 开头，请删除") : ($("#whitelistEditModal").modal("hide"), this.$emit("save", {
                            data: this.data,
                            index: this.index
                        })))
                    }
                }
            }, Ct = {
                render: function () {
                    var t = this, a = t.$createElement, e = t._self._c || a;
                    return e("div", {
                        staticClass: "modal no-fade",
                        attrs: {id: "whitelistEditModal", tabindex: "-1", role: "dialog"}
                    }, [e("div", {
                        staticClass: "modal-dialog",
                        attrs: {role: "document"}
                    }, [e("div", {staticClass: "modal-content"}, [t._m(0), t._v(" "), e("div", {staticClass: "modal-body"}, [e("div", {staticClass: "form-group"}, [e("label", [t._v("URL - 不区分 http/https")]), t._v(" "), e("input", {
                        directives: [{
                            name: "model",
                            rawName: "v-model",
                            value: t.data.url,
                            expression: "data.url"
                        }],
                        staticClass: "form-control",
                        attrs: {type: "text", maxlen: "200"},
                        domProps: {value: t.data.url},
                        on: {
                            input: function (a) {
                                a.target.composing || t.$set(t.data, "url", a.target.value)
                            }
                        }
                    })]), t._v(" "), e("div", {staticClass: "form-group"}, [e("label", [t._v("检测点")]), t._v(" "), e("div", {staticClass: "row"}, [e("div", {staticClass: "col-12"}, [e("label", {staticClass: "custom-switch"}, [e("input", {
                        directives: [{
                            name: "model",
                            rawName: "v-model",
                            value: t.data.hook.all,
                            expression: "data.hook.all"
                        }],
                        staticClass: "custom-switch-input",
                        attrs: {type: "checkbox", checked: "data.hook.all"},
                        domProps: {checked: Array.isArray(t.data.hook.all) ? t._i(t.data.hook.all, null) > -1 : t.data.hook.all},
                        on: {
                            change: function (a) {
                                var e = t.data.hook.all, s = a.target, n = !!s.checked;
                                if (Array.isArray(e)) {
                                    var i = t._i(e, null);
                                    s.checked ? i < 0 && t.$set(t.data.hook, "all", e.concat([null])) : i > -1 && t.$set(t.data.hook, "all", e.slice(0, i).concat(e.slice(i + 1)))
                                } else t.$set(t.data.hook, "all", n)
                            }
                        }
                    }), t._v(" "), e("span", {staticClass: "custom-switch-indicator"}), t._v(" "), e("span", {staticClass: "custom-switch-description"}, [t._v("\n                  关闭所有检测点\n                ")])])])]), t._v(" "), t.data.hook.all ? t._e() : e("div", {staticClass: "row"}, t._l(t.attack_types, function (a, s) {
                        return e("div", {
                            key: s,
                            staticClass: "col-6"
                        }, [e("label", {staticClass: "custom-switch"}, [e("input", {
                            directives: [{
                                name: "model",
                                rawName: "v-model",
                                value: t.data.hook[s],
                                expression: "data.hook[key]"
                            }],
                            staticClass: "custom-switch-input",
                            attrs: {type: "checkbox", checked: "data.hook[key]"},
                            domProps: {checked: Array.isArray(t.data.hook[s]) ? t._i(t.data.hook[s], null) > -1 : t.data.hook[s]},
                            on: {
                                change: function (a) {
                                    var e = t.data.hook[s], n = a.target, i = !!n.checked;
                                    if (Array.isArray(e)) {
                                        var r = t._i(e, null);
                                        n.checked ? r < 0 && t.$set(t.data.hook, s, e.concat([null])) : r > -1 && t.$set(t.data.hook, s, e.slice(0, r).concat(e.slice(r + 1)))
                                    } else t.$set(t.data.hook, s, i)
                                }
                            }
                        }), t._v(" "), e("span", {staticClass: "custom-switch-indicator"}), t._v(" "), e("span", {staticClass: "custom-switch-description"}, [t._v("\n                  " + t._s(a) + "\n                ")])])])
                    }))])]), t._v(" "), e("div", {staticClass: "modal-footer"}, [e("button", {
                        staticClass: "btn btn-primary",
                        on: {
                            click: function (a) {
                                t.saveApp()
                            }
                        }
                    }, [t._v("\n          保存\n        ")]), t._v(" "), e("button", {
                        staticClass: "btn btn-default",
                        attrs: {"data-dismiss": "modal"}
                    }, [t._v("\n          关闭\n        ")])])])])])
                }, staticRenderFns: [function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("div", {staticClass: "modal-header"}, [a("h5", {staticClass: "modal-title"}, [this._v("\n          添加/编辑 白名单\n        ")]), this._v(" "), a("button", {
                        staticClass: "close",
                        attrs: {type: "button", "data-dismiss": "modal", "aria-label": "Close"}
                    })])
                }]
            }, kt = e("VU/8")(bt, Ct, !1, null, null, null).exports, yt = {
                name: "WhitelistSettings",
                data: function () {
                    return {data: [], whitelist_all: !1}
                },
                computed: w()({}, Object(o.c)(["current_app"])),
                methods: {
                    attack_type2name: h, whitelist2str: function (t) {
                        var a = [];
                        return gt()(t).forEach(function (e) {
                            t[e] && a.push(h(e))
                        }), a
                    }, setData: function (t) {
                        this.data = t
                    }, onEdit: function (t) {
                        void 0 === t.index ? this.data.push(t.data) : this.data.splice(t.index, 1, t.data)
                    }, showModal: function (t, a) {
                        void 0 === a && this.data.length >= 200 ? alert("为了保证性能，白名单最多支持 200 条") : this.$refs.whitelistEditModal.showModal(t, a)
                    }, deleteItem: function (t) {
                        confirm("确认删除") && this.data.splice(t, 1)
                    }, doSave: function () {
                        var t = {app_id: this.current_app.id, config: this.data};
                        this.api_request("v1/api/app/whitelist/config", t, function (t) {
                            alert("保存成功")
                        })
                    }
                },
                components: {whitelistEditModal: kt}
            }, wt = {
                render: function () {
                    var t = this, a = t.$createElement, e = t._self._c || a;
                    return e("div", [e("div", {staticClass: "card"}, [t._m(0), t._v(" "), e("div", {staticClass: "card-body"}, [e("p", [t._v("最多允许200个URL，单条URL长度限制为200字符")]), t._v(" "), e("table", {staticClass: "table table-bordered table-hover"}, [t._m(1), t._v(" "), e("tbody", t._l(t.data, function (a, s) {
                        return e("tr", {key: s}, [e("td", {attrs: {nowrap: ""}}, [t._v("\n              " + t._s(s + 1) + "\n            ")]), t._v(" "), e("td", [t._v("\n              " + t._s(a.url) + "\n            ")]), t._v(" "), e("td", [a.hook.all ? e("span", [t._v("\n                所有 Hook 点\n              ")]) : t._e(), t._v(" "), a.hook.all ? t._e() : e("span", [t._v("\n                " + t._s(t.whitelist2str(a.hook).join(", ")) + "\n              ")])]), t._v(" "), e("td", {attrs: {nowrap: ""}}, [e("a", {
                            attrs: {href: "javascript:"},
                            on: {
                                click: function (e) {
                                    t.showModal(a, s)
                                }
                            }
                        }, [t._v("\n                编辑\n              ")]), t._v(" "), e("a", {
                            attrs: {href: "javascript:"},
                            on: {
                                click: function (a) {
                                    t.deleteItem(s)
                                }
                            }
                        }, [t._v("\n                删除\n              ")])])])
                    }))])]), t._v(" "), e("div", {staticClass: "card-footer"}, [e("button", {
                        staticClass: "btn btn-info",
                        on: {
                            click: function (a) {
                                t.showModal({hook: {}})
                            }
                        }
                    }, [t._v("\n        添加\n      ")]), t._v(" "), e("button", {
                        staticClass: "btn btn-primary pull-right",
                        on: {
                            click: function (a) {
                                t.doSave()
                            }
                        }
                    }, [t._v("\n        保存\n      ")])])]), t._v(" "), e("whitelistEditModal", {
                        ref: "whitelistEditModal",
                        on: {
                            save: function (a) {
                                t.onEdit(a)
                            }
                        }
                    })], 1)
                }, staticRenderFns: [function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("div", {staticClass: "card-header"}, [a("h3", {staticClass: "card-title"}, [this._v("\n        防护引擎白名单\n      ")])])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("thead", [a("th", {attrs: {nowrap: ""}}, [this._v("\n            #\n          ")]), this._v(" "), a("th", [this._v("\n            URL\n          ")]), this._v(" "), a("th", [this._v("\n            检测点\n          ")]), this._v(" "), a("th", [this._v("\n            操作\n          ")])])
                }]
            }, xt = e("VU/8")(yt, wt, !1, null, null, null).exports, jt = e("gRE1"), $t = e.n(jt), Et = {
                name: "AlgorithmSettings", data: function () {
                    return {items: {}, data: {meta: {}}}
                }, computed: w()({}, Object(o.c)(["current_app"])), watch: {
                    current_app: function () {
                        this.loadConfig()
                    }
                }, mounted: function () {
                    this.current_app.id && this.loadConfig()
                }, methods: {
                    attack_type2name: h, loadConfig: function () {
                        if (this.current_app.selected_plugin_id.length) {
                            var t = this, a = {id: this.current_app.selected_plugin_id};
                            this.api_request("v1/api/plugin/get", a, function (a) {
                                var s = a.algorithm_config, n = {};
                                t.data = a.algorithm_config, gt()(s).forEach(function (t) {
                                    if (-1 != t.indexOf("_")) {
                                        var a = t.split("_")[0];
                                        n[a] || (n[a] = {name: a, items: []}), n[a].items.push({
                                            name: s[t].name,
                                            key: t
                                        })
                                    }
                                }), gt()(n).forEach(function (t) {
                                    n[t].items.sort(e)
                                }), t.items = $t()(n)
                            })
                        }

                        function e(t, a) {
                            return t.name.localeCompare(a.name)
                        }
                    }, saveConfig: function () {
                        var t = {id: this.current_app.selected_plugin_id, config: this.data};
                        this.api_request("v1/api/plugin/algorithm/config", t, function (t) {
                            alert("保存成功")
                        })
                    }, resetConfig: function () {
                        if (confirm("还原默认配置？")) {
                            var t = this, a = {id: this.current_app.selected_plugin_id};
                            t.api_request("v1/api/plugin/algorithm/restore", a, function (a) {
                                alert("恢复成功，点击刷新"), t.loadConfig()
                            })
                        }
                    }
                }
            }, Pt = {
                render: function () {
                    var t = this, a = t.$createElement, e = t._self._c || a;
                    return e("div", [e("div", {staticClass: "card"}, [t._m(0), t._v(" "), e("div", {staticClass: "card-body"}, [t.current_app.selected_plugin_id && t.current_app.selected_plugin_id.length ? t._e() : e("p", [t._v("\n        你还没有选择插件，请在「插件管理」中进行设置\n      ")]), t._v(" "), t.current_app.selected_plugin_id && t.current_app.selected_plugin_id.length ? e("div", {staticClass: "form-group"}, [e("div", {staticClass: "form-label"}, [t._v("\n          快速设置\n        ")]), t._v(" "), e("label", {staticClass: "custom-switch"}, [e("input", {
                        directives: [{
                            name: "model",
                            rawName: "v-model",
                            value: t.data.meta.all_log,
                            expression: "data.meta.all_log"
                        }],
                        staticClass: "custom-switch-input",
                        attrs: {type: "checkbox", name: "custom-switch-checkbox"},
                        domProps: {checked: Array.isArray(t.data.meta.all_log) ? t._i(t.data.meta.all_log, null) > -1 : t.data.meta.all_log},
                        on: {
                            change: function (a) {
                                var e = t.data.meta.all_log, s = a.target, n = !!s.checked;
                                if (Array.isArray(e)) {
                                    var i = t._i(e, null);
                                    s.checked ? i < 0 && t.$set(t.data.meta, "all_log", e.concat([null])) : i > -1 && t.$set(t.data.meta, "all_log", e.slice(0, i).concat(e.slice(i + 1)))
                                } else t.$set(t.data.meta, "all_log", n)
                            }
                        }
                    }), t._v(" "), e("span", {staticClass: "custom-switch-indicator"}), t._v(" "), e("span", {staticClass: "custom-switch-description"}, [t._v("\n            将所有算法设置为「记录日志」模式\n          ")])])]) : t._e(), t._v(" "), t._l(t.items, function (a) {
                        return t.current_app.selected_plugin_id && t.current_app.selected_plugin_id.length ? e("div", {
                            key: a.name,
                            staticClass: "form-group"
                        }, [e("div", {staticClass: "form-label"}, [t._v("\n          " + t._s(t.attack_type2name(a.name)) + "\n        ")]), t._v(" "), t._l(a.items, function (a) {
                            return e("div", {key: a.key}, [e("form", {attrs: {disabled: "true"}}, [e("div", {staticClass: "selectgroup"}, [e("label", {staticClass: "selectgroup-item"}, [e("input", {
                                directives: [{
                                    name: "model",
                                    rawName: "v-model",
                                    value: t.data[a.key].action,
                                    expression: "data[item.key].action"
                                }],
                                staticClass: "selectgroup-input",
                                attrs: {type: "radio", name: "value", value: "block"},
                                domProps: {checked: t._q(t.data[a.key].action, "block")},
                                on: {
                                    change: function (e) {
                                        t.$set(t.data[a.key], "action", "block")
                                    }
                                }
                            }), t._v(" "), e("span", {staticClass: "selectgroup-button"}, [t._v("\n                  拦截攻击\n                ")])]), t._v(" "), e("label", {staticClass: "selectgroup-item"}, [e("input", {
                                directives: [{
                                    name: "model",
                                    rawName: "v-model",
                                    value: t.data[a.key].action,
                                    expression: "data[item.key].action"
                                }],
                                staticClass: "selectgroup-input",
                                attrs: {type: "radio", name: "value", value: "log"},
                                domProps: {checked: t._q(t.data[a.key].action, "log")},
                                on: {
                                    change: function (e) {
                                        t.$set(t.data[a.key], "action", "log")
                                    }
                                }
                            }), t._v(" "), e("span", {staticClass: "selectgroup-button"}, [t._v("\n                  记录日志\n                ")])]), t._v(" "), e("label", {staticClass: "selectgroup-item"}, [e("input", {
                                directives: [{
                                    name: "model",
                                    rawName: "v-model",
                                    value: t.data[a.key].action,
                                    expression: "data[item.key].action"
                                }],
                                staticClass: "selectgroup-input",
                                attrs: {type: "radio", name: "value", value: "ignore"},
                                domProps: {checked: t._q(t.data[a.key].action, "ignore")},
                                on: {
                                    change: function (e) {
                                        t.$set(t.data[a.key], "action", "ignore")
                                    }
                                }
                            }), t._v(" "), e("span", {staticClass: "selectgroup-button"}, [t._v("\n                  完全忽略\n                ")])])]), t._v(" "), e("p", {
                                staticStyle: {
                                    display: "inline",
                                    "margin-left": "10px"
                                }
                            }, [t._v("\n              " + t._s(a.name) + "\n              "), t.data[a.key].reference ? e("a", {
                                attrs: {
                                    target: "_blank",
                                    href: t.data[a.key].reference
                                }
                            }, [t._v("\n                [帮助文档]\n              ")]) : t._e()])])])
                        })], 2) : t._e()
                    })], 2), t._v(" "), t.current_app.selected_plugin_id && t.current_app.selected_plugin_id.length ? e("div", {staticClass: "card-footer"}, [e("button", {
                        staticClass: "btn btn-primary",
                        attrs: {type: "submit"},
                        on: {
                            click: function (a) {
                                t.saveConfig()
                            }
                        }
                    }, [t._v("\n        保存\n      ")]), t._v(" "), e("button", {
                        staticClass: "btn btn-info pull-right",
                        attrs: {type: "submit"},
                        on: {
                            click: function (a) {
                                t.resetConfig()
                            }
                        }
                    }, [t._v("\n        重置\n      ")])]) : t._e()])])
                }, staticRenderFns: [function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("div", {staticClass: "card-header"}, [a("h3", {staticClass: "card-title"}, [this._v("\n        防护设置\n      ")])])
                }]
            }, At = {
                name: "Settings",
                components: {
                    AlarmSettings: st,
                    WhitelistSettings: xt,
                    AppSettings: dt,
                    AuthSettings: pt,
                    AlgorithmSettings: e("VU/8")(Et, Pt, !1, null, null, null).exports,
                    GeneralSettings: ht
                },
                data: function () {
                    return {
                        tab_names: ["general", "alarm", "whitelist", "algorithm", "auth", "app"],
                        tab_index: 0,
                        data: {},
                        loading: !1
                    }
                },
                computed: w()({}, Object(o.c)(["current_app"]), {
                    setting_tab: function () {
                        return this.$route.params.setting_tab
                    }
                }),
                watch: {
                    current_app: function () {
                        this.loadSettings()
                    }, setting_tab: "setTabIndex"
                },
                mounted: function () {
                    this.setTabIndex(this.setting_tab), this.current_app.id && this.loadSettings()
                },
                methods: {
                    loadSettings: function () {
                        var t = this, a = {app_id: this.current_app.id};
                        t.loading = !0, this.api_request("v1/api/app/get", a, function (a) {
                            t.loading = !1, t.$refs.generalSettings.setData(a.general_config), t.$refs.whitelistSettings.setData(a.whitelist_config), t.$refs.alarmSettings.setData({
                                ding_alarm_conf: a.ding_alarm_conf,
                                http_alarm_conf: a.http_alarm_conf,
                                email_alarm_conf: a.email_alarm_conf
                            })
                        })
                    }, setTabIndex: function (t) {
                        this.tab_index = this.tab_names.indexOf(t) || 0
                    }, onTabIndex: function (t) {
                        this.$router.push({params: {setting_tab: this.tab_names[t]}})
                    }
                }
            }, St = {
                render: function () {
                    var t = this, a = t.$createElement, e = t._self._c || a;
                    return e("div", {staticClass: "my-3 my-md-5"}, [e("div", {staticClass: "container"}, [e("b-tabs", {
                        staticClass: "w-100",
                        attrs: {
                            vertical: "",
                            "nav-wrapper-class": "col-3",
                            "nav-class": "list-group list-group-transparent"
                        },
                        on: {input: t.onTabIndex},
                        model: {
                            value: t.tab_index, callback: function (a) {
                                t.tab_index = a
                            }, expression: "tab_index"
                        }
                    }, [e("b-tab", {attrs: {"title-link-class": "list-group-item border-0 w-100"}}, [e("template", {slot: "title"}, [e("span", {staticClass: "icon mr-3"}, [e("i", {staticClass: "fe fe-settings"})]), t._v("\n          通用设置\n        ")]), t._v(" "), e("GeneralSettings", {ref: "generalSettings"})], 2), t._v(" "), e("b-tab", {attrs: {"title-link-class": "list-group-item border-0 w-100"}}, [e("template", {slot: "title"}, [e("span", {staticClass: "icon mr-3"}, [e("i", {staticClass: "fe fe-alert-triangle"})]), t._v("\n          报警设置\n        ")]), t._v(" "), e("AlarmSettings", {ref: "alarmSettings"})], 2), t._v(" "), e("b-tab", {attrs: {"title-link-class": "list-group-item border-0 w-100"}}, [e("template", {slot: "title"}, [e("span", {staticClass: "icon mr-3"}, [e("i", {staticClass: "fe fe-list"})]), t._v("\n          黑白名单\n        ")]), t._v(" "), e("WhitelistSettings", {ref: "whitelistSettings"})], 2), t._v(" "), e("b-tab", {attrs: {"title-link-class": "list-group-item border-0 w-100"}}, [e("template", {slot: "title"}, [e("span", {staticClass: "icon mr-3"}, [e("i", {staticClass: "fe fe-filter"})]), t._v("\n          防护设置\n        ")]), t._v(" "), e("AlgorithmSettings", {ref: "algorithmSettings"})], 2), t._v(" "), e("b-tab", {attrs: {"title-link-class": "list-group-item border-0 w-100"}}, [e("template", {slot: "title"}, [e("span", {staticClass: "icon mr-3"}, [e("i", {staticClass: "fe fe-user"})]), t._v("\n          登录认证\n        ")]), t._v(" "), e("AuthSettings", {ref: "authSettings"})], 2), t._v(" "), e("b-tab", {attrs: {"title-link-class": "list-group-item border-0 w-100"}}, [e("template", {slot: "title"}, [e("span", {staticClass: "icon mr-3"}, [e("i", {staticClass: "fe fe-server"})]), t._v("\n          应用管理\n        ")]), t._v(" "), e("AppSettings", {ref: "appSettings"})], 2)], 1)], 1)])
                }, staticRenderFns: []
            }, Dt = e("VU/8")(At, St, !1, null, null, null).exports, Mt = {
                name: "FileUpload", data: function () {
                    return {file: void 0}
                }, mounted: function () {
                }, methods: {
                    clear: function () {
                        this.$refs.fileInput.value = "", this.file = void 0
                    }, handleFileChange: function (t, a) {
                        console.log("got", a), this.file = a[0], this.$emit("input", a[0])
                    }
                }, components: {}
            }, Rt = {
                render: function () {
                    var t = this, a = t.$createElement, e = t._self._c || a;
                    return e("div", {staticClass: "custom-file"}, [e("input", {
                        ref: "fileInput",
                        staticClass: "custom-file-input",
                        attrs: {type: "file"},
                        on: {
                            change: function (a) {
                                t.handleFileChange(a.target.name, a.target.files)
                            }
                        }
                    }), t._v(" "), t.file ? e("label", {staticClass: "custom-file-label"}, [t._v(t._s(t.file.name))]) : t._e(), t._v(" "), t.file ? t._e() : e("label", {staticClass: "custom-file-label"}, [t._v("选择插件")])])
                }, staticRenderFns: []
            }, Ut = e("VU/8")(Mt, Rt, !1, null, null, null).exports, Tt = {
                name: "Plugins", data: function () {
                    return {currentPage: 1, total: 1, data: [], loading: !1}
                }, computed: w()({}, Object(o.c)(["current_app"])), watch: {
                    current_app: function () {
                        this.loadPluginList(1)
                    }
                }, mounted: function () {
                    this.current_app.id && this.loadPluginList(1)
                }, methods: w()({}, Object(o.b)(["loadAppList"]), {
                    loadPluginList: function (t) {
                        var a = this;
                        return this.loading = !0, this.request.post("v1/api/app/plugin/get", {
                            page: t,
                            perpage: 10,
                            app_id: this.current_app.id
                        }).then(function (e) {
                            a.currentPage = t, a.data = e.data, a.total = e.total, a.loading = !1
                        })
                    }, doDownload: function (t) {
                        var a = {id: t.id};
                        p()({
                            url: "/v1/api/plugin/download",
                            method: "POST",
                            data: it()(a),
                            responseType: "blob"
                        }).then(function (t) {
                            var a = window.URL.createObjectURL(new Blob([t.data])), e = document.createElement("a");
                            e.href = a, e.setAttribute("download", "plugin.js"), document.body.appendChild(e), e.click()
                        })
                    }, doUpload: function () {
                        var t = this, a = this.$refs.fileUpload.file;
                        if (a) {
                            var e = new FormData;
                            e.append("plugin", a), this.api_request("v1/api/plugin?app_id=" + t.current_app.id, e, function (a) {
                                t.loadPluginList(1), t.$refs.fileUpload.clear()
                            })
                        }
                    }, doDelete: function (t) {
                        var a = this, e = {id: t.id};
                        confirm("确认删除?") && this.api_request("v1/api/plugin/delete", e, function (t) {
                            a.loadPluginList(1)
                        })
                    }, doSelect: function (t) {
                        if (confirm("确认下发?")) {
                            var a = this, e = {app_id: a.current_app.id, plugin_id: t.id};
                            a.api_request("v1/api/app/plugin/select", e, function (t) {
                                a.loadAppList(a.current_app.id)
                            })
                        }
                    }
                }), components: {FileUpload: Ut}
            }, Lt = {
                render: function () {
                    var t = this, a = t.$createElement, e = t._self._c || a;
                    return e("div", {staticClass: "my-3 my-md-5"}, [e("div", {staticClass: "container"}, [e("div", {staticClass: "page-header"}, [e("h1", {staticClass: "page-title"}, [t._v("\n        插件管理\n      ")]), t._v(" "), e("div", {staticClass: "page-options d-flex"}, [e("FileUpload", {ref: "fileUpload"})], 1), t._v(" "), e("button", {
                        staticClass: "btn btn-primary ml-2",
                        on: {
                            click: function (a) {
                                t.doUpload()
                            }
                        }
                    }, [t._v("\n        提交\n      ")]), t._v(" "), e("button", {
                        staticClass: "btn btn-info ml-2",
                        on: {
                            click: function (a) {
                                t.loadPluginList(1)
                            }
                        }
                    }, [t._v("\n        刷新\n      ")])]), t._v(" "), e("div", {staticClass: "card"}, [e("div", {staticClass: "card-body"}, [t.loading ? e("vue-loading", {
                        attrs: {
                            type: "spiningDubbles",
                            color: "rgb(90, 193, 221)",
                            size: {width: "50px", height: "50px"}
                        }
                    }) : t._e(), t._v(" "), t.loading ? t._e() : e("table", {staticClass: "table table-bordered"}, [t._m(0), t._v(" "), e("tbody", t._l(t.data, function (a) {
                        return e("tr", {key: a.id}, [e("td", [t._v(t._s(t.moment(a.upload_time).format("YYYY-MM-DD HH:mm:ss")))]), t._v(" "), e("td", [t._v("official: " + t._s(a.version))]), t._v(" "), e("td", [t.current_app.selected_plugin_id == a.id ? e("span", [t._v("\n                  是\n                ")]) : t._e()]), t._v(" "), e("td", [e("a", {
                            attrs: {href: "javascript:"},
                            on: {
                                click: function (e) {
                                    t.doSelect(a)
                                }
                            }
                        }, [t._v("\n                  推送\n                ")]), t._v("  \n                "), e("a", {
                            attrs: {href: "javascript:"},
                            on: {
                                click: function (e) {
                                    t.doDownload(a)
                                }
                            }
                        }, [t._v("\n                  下载\n                ")]), t._v("  \n                "), e("a", {
                            attrs: {href: "javascript:"},
                            on: {
                                click: function (e) {
                                    t.doDelete(a)
                                }
                            }
                        }, [t._v("\n                  删除\n                ")])])])
                    }))]), t._v(" "), t.loading ? t._e() : e("nav", [e("b-pagination", {
                        attrs: {
                            align: "center",
                            "total-rows": t.total,
                            "per-page": 10
                        }, on: {
                            change: function (a) {
                                t.loadPluginList(a)
                            }
                        }, model: {
                            value: t.currentPage, callback: function (a) {
                                t.currentPage = a
                            }, expression: "currentPage"
                        }
                    })], 1)], 1)])])])
                }, staticRenderFns: [function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("thead", [a("tr", [a("th", [this._v("上传时间")]), this._v(" "), a("th", [this._v("插件版本")]), this._v(" "), a("th", [this._v("当前版本")]), this._v(" "), a("th", [this._v("操作")])])])
                }]
            }, Nt = e("VU/8")(Tt, Lt, !1, null, null, null).exports, qt = {
                name: "Audit", data: function () {
                    return {data: [], loading: !1, currentPage: 1, srcip: "", total: 0}
                }, computed: w()({}, Object(o.c)(["current_app"])), watch: {
                    current_app: function () {
                        this.loadAudit(1)
                    }
                }, mounted: function () {
                    this.current_app.id && this.loadAudit(1)
                }, methods: {
                    loadAudit: function (t) {
                        var a = this;
                        return this.loading = !0, this.request.post("v1/api/operation/search", {
                            page: t,
                            perpage: 10,
                            start_time: this.$refs.datePicker.start.valueOf(),
                            end_time: this.$refs.datePicker.end.valueOf(),
                            data: {}
                        }).then(function (e) {
                            a.currentPage = t, a.data = e.data, a.total = e.total, a.loading = !1
                        })
                    }
                }, components: {DatePicker: W}
            }, Ft = {
                render: function () {
                    var t = this, a = t.$createElement, e = t._self._c || a;
                    return e("div", {staticClass: "my-3 my-md-5"}, [e("div", {staticClass: "container"}, [e("div", {staticClass: "page-header"}, [e("h1", {staticClass: "page-title"}, [t._v("\n        操作审计\n      ")]), t._v(" "), e("div", {staticClass: "page-options d-flex"}, [e("div", {staticClass: "input-icon ml-2 w-100"}, [t._m(0), t._v(" "), e("DatePicker", {
                        ref: "datePicker",
                        on: {
                            selected: function (a) {
                                t.loadAudit(1)
                            }
                        }
                    })], 1), t._v(" "), e("button", {
                        staticClass: "btn btn-primary ml-2", on: {
                            click: function (a) {
                                t.loadAudit(1)
                            }
                        }
                    }, [t._v("\n          搜索\n        ")])])]), t._v(" "), e("div", {staticClass: "card"}, [e("div", {staticClass: "card-body"}, [t.loading ? e("vue-loading", {
                        attrs: {
                            type: "spiningDubbles",
                            color: "rgb(90, 193, 221)",
                            size: {width: "50px", height: "50px"}
                        }
                    }) : t._e(), t._v(" "), t.loading ? t._e() : e("table", {staticClass: "table table-bordered"}, [t._m(1), t._v(" "), e("tbody", t._l(t.data, function (a) {
                        return e("tr", {key: a.id}, [e("td", {attrs: {nowrap: ""}}, [t._v("\n                " + t._s(t.moment(a.time).format("YYYY-MM-DD HH:mm:ss")) + "\n              ")]), t._v(" "), e("td", [t._v(t._s(a.content))]), t._v(" "), e("td", {attrs: {nowrap: ""}}, [t._v("\n                " + t._s(a.user.length ? a.user : "-") + "\n              ")]), t._v(" "), e("td", {attrs: {nowrap: ""}}, [t._v("\n                " + t._s(a.ip) + "\n              ")])])
                    }))]), t._v(" "), t.loading ? t._e() : e("nav", [e("b-pagination", {
                        attrs: {
                            align: "center",
                            "total-rows": t.total,
                            "per-page": 10
                        }, on: {
                            change: function (a) {
                                t.loadAudit(a)
                            }
                        }, model: {
                            value: t.currentPage, callback: function (a) {
                                t.currentPage = a
                            }, expression: "currentPage"
                        }
                    })], 1)], 1)])])])
                }, staticRenderFns: [function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("span", {staticClass: "input-icon-addon"}, [a("i", {staticClass: "fe fe-calendar"})])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("thead", [a("tr", [a("th", [this._v("操作时间")]), this._v(" "), a("th", [this._v("操作内容")]), this._v(" "), a("th", [this._v("操作人")]), this._v(" "), a("th", [this._v("IP 地址")])])])
                }]
            }, zt = e("VU/8")(qt, Ft, !1, null, null, null).exports, Ot = {
                render: function () {
                    var t = this, a = t.$createElement, e = t._self._c || a;
                    return e("div", {staticClass: "event-detail"}, ["sql" == t.data.attack_type ? e("div", [e("div", {staticClass: "h6"}, [t._v("\n            数据库类型\n        ")]), t._v(" "), e("p", [t._v("\n            " + t._s(t.data.attack_params.server) + "\n        ")]), t._v(" "), e("div", {staticClass: "h6"}, [t._v("\n            执行的SQL语句\n        ")]), t._v(" "), e("p", [t._v("\n            " + t._s(t.data.attack_params.query) + "\n        ")])]) : t._e(), t._v(" "), "directory" == t.data.attack_type ? e("div", [e("div", {staticClass: "h6"}, [t._v("\n            读取的目录\n        ")]), t._v(" "), e("p", [t._v("\n            " + t._s(t.data.attack_params.path) + "\n        ")]), t._v(" "), e("div", {staticClass: "h6"}, [t._v("\n            读取的目录 - 真实路径\n        ")]), t._v(" "), e("p", [t._v("\n            " + t._s(t.data.attack_params.realpath) + "\n        ")])]) : t._e(), t._v(" "), "readFile" == t.data.attack_type ? e("div", [e("div", {staticClass: "h6"}, [t._v("\n            读取的文件\n        ")]), t._v(" "), e("p", [t._v("\n            " + t._s(t.data.attack_params.path) + "\n        ")]), t._v(" "), e("div", {staticClass: "h6"}, [t._v("\n            读取的文件 - 真实路径\n        ")]), t._v(" "), e("p", [t._v("\n            " + t._s(t.data.attack_params.realpath) + "\n        ")])]) : t._e(), t._v(" "), "writeFile" == t.data.attack_type ? e("div", [e("div", {staticClass: "h6"}, [t._v("\n            写入的文件\n        ")]), t._v(" "), e("p", [t._v("\n            " + t._s(t.data.attack_params.name) + "\n        ")]), t._v(" "), e("div", {staticClass: "h6"}, [t._v("\n            写入的文件 - 真实路径\n        ")]), t._v(" "), e("p", [t._v("\n            " + t._s(t.data.attack_params.realpath) + "\n        ")])]) : t._e(), t._v(" "), "include" == t.data.attack_type ? e("div", [e("div", {staticClass: "h6"}, [t._v("\n            要包含的文件\n        ")]), t._v(" "), e("p", [t._v("\n            " + t._s(t.data.attack_params.url) + "\n        ")]), t._v(" "), e("div", {staticClass: "h6"}, [t._v("\n            要包含的文件 - 真实路径\n        ")]), t._v(" "), e("p", [t._v("\n            " + t._s(t.data.attack_params.realpath) + "\n        ")])]) : t._e(), t._v(" "), "webdav" == t.data.attack_type ? e("div", [e("div", {staticClass: "h6"}, [t._v("\n            源文件\n        ")]), t._v(" "), e("p", [t._v("\n            " + t._s(t.data.attack_params.source) + "\n        ")]), t._v(" "), e("div", {staticClass: "h6"}, [t._v("\n            目标文件\n        ")]), t._v(" "), e("p", [t._v("\n            " + t._s(t.data.attack_params.dest) + "\n        ")])]) : t._e(), t._v(" "), "fileUpload" == t.data.attack_type ? e("div", [e("div", {staticClass: "h6"}, [t._v("\n            上传的文件名\n        ")]), t._v(" "), e("p", [t._v("\n            " + t._s(t.data.attack_params.filename) + "\n        ")]), t._v(" "), e("div", {staticClass: "h6"}, [t._v("\n            上传的文件内容 - 前4KB\n        ")]), t._v(" "), e("p", [t._v("\n            " + t._s(t.data.attack_params.content) + "\n        ")])]) : t._e(), t._v(" "), "rename" == t.data.attack_type ? e("div", [e("div", {staticClass: "h6"}, [t._v("\n            源文件\n        ")]), t._v(" "), e("p", [t._v("\n            " + t._s(t.data.attack_params.source) + "\n        ")]), t._v(" "), e("div", {staticClass: "h6"}, [t._v("\n            目标文件\n        ")]), t._v(" "), e("p", [t._v("\n            " + t._s(t.data.attack_params.dest) + "\n        ")])]) : t._e(), t._v(" "), "command" == t.data.attack_type ? e("div", [e("div", {staticClass: "h6"}, [t._v("\n            要执行的命令\n        ")]), t._v(" "), e("p", [t._v("\n            " + t._s(t.data.attack_params.command) + "\n        ")])]) : t._e(), t._v(" "), "xxe" == t.data.attack_type ? e("div", [e("div", {staticClass: "h6"}, [t._v("\n            要加载的外部实体\n        ")]), t._v(" "), e("p", [t._v("\n            " + t._s(t.data.attack_params.entity) + "\n        ")])]) : t._e(), t._v(" "), "ognl" == t.data.attack_type ? e("div", [e("div", {staticClass: "h6"}, [t._v("\n            要执行的OGNL表达式\n        ")]), t._v(" "), e("p", [t._v("\n            " + t._s(t.data.attack_params.expression) + "\n        ")])]) : t._e(), t._v(" "), "deserialization" == t.data.attack_type ? e("div", [e("div", {staticClass: "h6"}, [t._v("\n            要生成的Java类名\n        ")]), t._v(" "), e("p", [t._v("\n            " + t._s(t.data.attack_params.clazz) + "\n        ")])]) : t._e(), t._v(" "), "ssrf" == t.data.attack_type ? e("div", [e("div", {staticClass: "h6"}, [t._v("\n            要访问的 URL\n        ")]), t._v(" "), e("p", [t._v("\n            " + t._s(t.data.attack_params.url) + "\n        ")]), t._v(" "), e("div", {staticClass: "h6"}, [t._v("\n            IP 信息\n        ")]), t._v(" "), e("p", [t._v("\n            " + t._s(t.data.attack_params.ip) + "\n        ")])]) : t._e(), t._v(" "), "webshell_eval" == t.data.attack_type ? e("div", [e("div", {staticClass: "h6"}, [t._v("\n            菜刀要 eval 的内容\n        ")]), t._v(" "), e("p", [t._v("\n            " + t._s(t.data.attack_params.eval) + "\n        ")])]) : t._e(), t._v(" "), "webshell_command" == t.data.attack_type ? e("div", [e("div", {staticClass: "h6"}, [t._v("\n            WebShell 要执行的命令\n        ")]), t._v(" "), e("p", [t._v("\n            " + t._s(t.data.attack_params.command) + "\n        ")])]) : t._e(), t._v(" "), "webshell_file_put_contents" == t.data.attack_type ? e("div", [e("div", {staticClass: "h6"}, [t._v("\n            WebShell 要写入的文件\n        ")]), t._v(" "), e("p", [t._v("\n            " + t._s(t.data.attack_params.name) + "\n        ")]), t._v(" "), e("div", {staticClass: "h6"}, [t._v("\n            WebShell 要写入的文件 - 真实路径\n        ")]), t._v(" "), e("p", [t._v("\n            " + t._s(t.data.attack_params.realpath) + "\n        ")])]) : t._e(), t._v(" "), "callable" == t.data.attack_type ? e("div", [e("div", {staticClass: "h6"}, [t._v("\n            后门要执行的函数\n        ")]), t._v(" "), e("p", [t._v("\n            " + t._s(t.data.attack_params.function) + "()\n        ")])]) : t._e()])
                }, staticRenderFns: []
            }, Ht = {
                name: "EventDetailModal",
                components: {
                    attack_params: e("VU/8")({
                        name: "attack_params", data: function () {
                            return {data: {attack_params: {}}}
                        }, methods: {
                            setData: function (t) {
                                this.data = t
                            }
                        }
                    }, Ot, !1, null, null, null).exports
                },
                data: function () {
                    return {data: {url: "", attack_location: {}}}
                },
                methods: {
                    attack_type2name: h, showModal: function (t) {
                        this.data = t, this.$refs.attack_params.setData(t), $("#showEventDetailModal").modal()
                    }
                }
            }, Vt = {
                render: function () {
                    var t = this, a = t.$createElement, e = t._self._c || a;
                    return e("div", {
                        staticClass: "modal no-fade",
                        attrs: {id: "showEventDetailModal", tabindex: "-1", role: "dialog"}
                    }, [e("div", {
                        staticClass: "modal-dialog modal-lg",
                        attrs: {role: "document"}
                    }, [e("div", {staticClass: "modal-content"}, [t._m(0), t._v(" "), e("div", {
                        staticClass: "modal-body",
                        staticStyle: {"padding-top": "0"}
                    }, [t._m(1), t._v(" "), e("br"), t._v(" "), e("div", {
                        staticClass: "tab-content",
                        attrs: {id: "myTabContent"}
                    }, [e("div", {
                        staticClass: "tab-pane fade show active",
                        attrs: {id: "vuln", role: "tabpanel", "aria-labelledby": "home-tab"}
                    }, [e("div", {staticClass: "h6"}, [t._v("\n              报警时间\n            ")]), t._v(" "), e("p", [t._v(t._s(t.moment(t.data.event_time).format("YYYY-MM-DD HH:mm:ss")))]), t._v(" "), e("div", {staticClass: "h6"}, [t._v("\n              报警消息\n            ")]), t._v(" "), e("p", {staticStyle: {"word-break": "break-all"}}, [t._v("\n              [" + t._s(t.attack_type2name(t.data.attack_type)) + "] " + t._s(t.data.plugin_message) + "\n            ")]), t._v(" "), e("attack_params", {ref: "attack_params"}), t._v(" "), e("div", {staticClass: "h6"}, [t._v("\n              应用堆栈\n            ")]), t._v(" "), e("pre", [t._v(t._s(t.data.stack_trace))])], 1), t._v(" "), e("div", {
                        staticClass: "tab-pane fade",
                        attrs: {id: "home", role: "tabpanel", "aria-labelledby": "home-tab"}
                    }, [e("div", {staticClass: "h6"}, [t._v("\n              请求编号\n            ")]), t._v(" "), e("p", [t._v(t._s(t.data.request_id))]), t._v(" "), e("div", {staticClass: "h6"}, [t._v("\n              请求 URL\n            ")]), t._v(" "), e("p", {staticStyle: {"word-break": "break-all"}}, [t._v("\n              " + t._s(t.data.request_method ? t.data.request_method.toUpperCase() : "") + " "), e("a", {
                        attrs: {target: "_blank"},
                        on: {href: t.data.url}
                    }, [t._v("\n                " + t._s(t.data.url) + "\n              ")])]), t._v(" "), e("div", {staticClass: "h6"}, [t._v("\n              请求来源\n            ")]), t._v(" "), e("p", [t._v("\n              " + t._s(t.data.attack_source) + "\n              "), "-" != t.data.attack_location.location_zh_cn ? e("span", [t._v("\n                " + t._s(t.data.attack_location.location_zh_cn) + "\n              ")]) : t._e()]), t._v(" "), e("div", {staticClass: "h6"}, [t._v("\n              请求 Referer\n            ")]), t._v(" "), e("p", {
                        staticStyle: {
                            "white-space": "normal",
                            "word-break": "break-all"
                        }
                    }, [t._v("\n              " + t._s(t.data.referer ? t.data.referer : "-") + "\n            ")]), t._v(" "), e("div", {staticClass: "h6"}, [t._v("\n              请求 UA\n            ")]), t._v(" "), e("p", {staticStyle: {"word-break": "break-all"}}, [t._v("\n              " + t._s(t.data.user_agent ? t.data.user_agent : "-") + "\n            ")]), t._v(" "), t.data.body ? e("div", {staticClass: "h6"}, [t._v("\n              请求 BODY\n            ")]) : t._e(), t._v(" "), t.data.body ? e("pre", {
                        staticStyle: {
                            "white-space": "normal",
                            "word-break": "break-all"
                        }
                    }, [t._v(t._s(t.data.body ? t.data.body : "-"))]) : t._e()]), t._v(" "), e("div", {
                        staticClass: "tab-pane fade",
                        attrs: {id: "profile", role: "tabpanel", "aria-labelledby": "profile-tab"}
                    }, [e("div", {staticClass: "h6"}, [t._v("\n              主机名称\n            ")]), t._v(" "), e("p", [t._v(t._s(t.data.server_hostname))]), t._v(" "), e("div", {staticClass: "h6"}, [t._v("\n              服务器 IP\n            ")]), t._v(" "), e("ul", t._l(t.data.server_nic, function (a) {
                        return e("li", {key: a.name}, [t._v("\n                " + t._s(a.name) + ": " + t._s(a.ip) + "\n              ")])
                    })), t._v(" "), e("div", {staticClass: "h6"}, [t._v("\n              应用版本\n            ")]), t._v(" "), e("p", {staticStyle: {"word-break": "break-all"}}, [t._v("\n              " + t._s(t.data.server_type) + "/" + t._s(t.data.server_version) + "\n            ")])]), t._v(" "), e("div", {
                        staticClass: "tab-pane fade",
                        attrs: {id: "contact", role: "tabpanel", "aria-labelledby": "contact-tab"}
                    }, [t._v("\n            暂无\n          ")])])]), t._v(" "), t._m(2)])])])
                }, staticRenderFns: [function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("div", {staticClass: "modal-header"}, [a("h5", {staticClass: "modal-title"}, [this._v("\n          报警详情\n        ")]), this._v(" "), a("button", {
                        staticClass: "close",
                        attrs: {type: "button", "data-dismiss": "modal", "aria-label": "Close"}
                    })])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("ul", {
                        staticClass: "nav nav-tabs",
                        attrs: {id: "myTab", role: "tablist"}
                    }, [a("li", {staticClass: "nav-item"}, [a("a", {
                        staticClass: "nav-link active",
                        attrs: {id: "home-tab", "data-toggle": "tab", href: "#vuln"}
                    }, [this._v("\n              漏洞详情\n            ")])]), this._v(" "), a("li", {staticClass: "nav-item"}, [a("a", {
                        staticClass: "nav-link",
                        attrs: {id: "home-tab", "data-toggle": "tab", href: "#home"}
                    }, [this._v("\n              请求信息\n            ")])]), this._v(" "), a("li", {staticClass: "nav-item"}, [a("a", {
                        staticClass: "nav-link",
                        attrs: {id: "profile-tab", "data-toggle": "tab", href: "#profile", role: "tab"}
                    }, [this._v("\n              资产信息\n            ")])]), this._v(" "), a("li", {staticClass: "nav-item"}, [a("a", {
                        staticClass: "nav-link",
                        attrs: {id: "contact-tab", "data-toggle": "tab", href: "#contact", role: "tab"}
                    }, [this._v("\n              修复建议\n            ")])])])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("div", {staticClass: "modal-footer"}, [a("button", {
                        staticClass: "btn btn-primary",
                        attrs: {"data-dismiss": "modal"}
                    }, [this._v("\n          关闭\n        ")])])
                }]
            }, It = {
                name: "EventTypePicker", data: function () {
                    return {categories: [], all_checked: !0}
                }, mounted: function () {
                    var t = [];
                    gt()(u).forEach(function (a) {
                        "webshell" != a && t.push({name: u[a], id: a, checked: !0})
                    }), this.categories = t
                }, methods: {
                    toggle_all: function () {
                        var t = this;
                        this.categories.forEach(function (a) {
                            a.checked = t.all_checked
                        }), this.$emit("selected")
                    }, selected: function () {
                        var t = [];
                        return this.categories.forEach(function (a) {
                            a.checked && t.push(a.id)
                        }), t
                    }
                }
            }, Yt = {
                render: function () {
                    var t = this, a = t.$createElement, e = t._self._c || a;
                    return e("div", {staticClass: "dropdown ml-2"}, [e("button", {
                        staticClass: "btn btn-secondary dropdown-toggle",
                        attrs: {type: "button", "data-toggle": "dropdown"}
                    }, [t._v("\n    攻击类型\n  ")]), t._v(" "), e("ul", {
                        staticClass: "dropdown-menu dropdown-menu-right dropdown-menu-arrow keep-open-on-click",
                        staticStyle: {width: "440px", padding: "10px"}
                    }, [e("div", {staticClass: "row"}, [e("div", {staticClass: "col-6"}, [e("label", {staticClass: "custom-switch"}, [e("input", {
                        directives: [{
                            name: "model",
                            rawName: "v-model",
                            value: t.all_checked,
                            expression: "all_checked"
                        }],
                        staticClass: "custom-switch-input",
                        attrs: {type: "checkbox", checked: "all_checked"},
                        domProps: {checked: Array.isArray(t.all_checked) ? t._i(t.all_checked, null) > -1 : t.all_checked},
                        on: {
                            change: [function (a) {
                                var e = t.all_checked, s = a.target, n = !!s.checked;
                                if (Array.isArray(e)) {
                                    var i = t._i(e, null);
                                    s.checked ? i < 0 && (t.all_checked = e.concat([null])) : i > -1 && (t.all_checked = e.slice(0, i).concat(e.slice(i + 1)))
                                } else t.all_checked = n
                            }, function (a) {
                                t.toggle_all()
                            }]
                        }
                    }), t._v(" "), e("span", {staticClass: "custom-switch-indicator"}), t._v(" "), e("span", {staticClass: "custom-switch-description"}, [t._v("\n            全选\n          ")])])])]), t._v(" "), e("div", {staticClass: "row"}, t._l(t.categories, function (a) {
                        return e("div", {
                            key: a.id,
                            staticClass: "col-6"
                        }, [e("label", {staticClass: "custom-switch"}, [e("input", {
                            directives: [{
                                name: "model",
                                rawName: "v-model",
                                value: a.checked,
                                expression: "c.checked"
                            }],
                            staticClass: "custom-switch-input",
                            attrs: {type: "checkbox", checked: "c.checked"},
                            domProps: {checked: Array.isArray(a.checked) ? t._i(a.checked, null) > -1 : a.checked},
                            on: {
                                change: [function (e) {
                                    var s = a.checked, n = e.target, i = !!n.checked;
                                    if (Array.isArray(s)) {
                                        var r = t._i(s, null);
                                        n.checked ? r < 0 && t.$set(a, "checked", s.concat([null])) : r > -1 && t.$set(a, "checked", s.slice(0, r).concat(s.slice(r + 1)))
                                    } else t.$set(a, "checked", i)
                                }, function (a) {
                                    t.$emit("selected")
                                }]
                            }
                        }), t._v(" "), e("span", {staticClass: "custom-switch-indicator"}), t._v(" "), e("span", {staticClass: "custom-switch-description"}, [t._v("\n            " + t._s(a.name) + "\n          ")])])])
                    }))])])
                }, staticRenderFns: []
            }, Wt = {
                name: "Events",
                components: {
                    EventDetailModal: e("VU/8")(Ht, Vt, !1, null, null, null).exports,
                    DatePicker: W,
                    EventTypePicker: e("VU/8")(It, Yt, !1, null, null, null).exports
                },
                data: function () {
                    return {data: [], loading: !1, currentPage: 1, srcip: "", total: 0}
                },
                computed: w()({}, Object(o.c)(["current_app"])),
                watch: {
                    current_app: function () {
                        this.loadEvents(1)
                    }
                },
                mounted: function () {
                    this.current_app.id && this.loadEvents(1)
                },
                methods: {
                    attack_type2name: h, block_status2name: function (t) {
                        return m[t] ? m[t] : t
                    }, showEventDetail: function (t) {
                        this.$refs.showEventDetail.showModal(t)
                    }, loadEvents: function (t) {
                        var a = this;
                        return this.loading = !0, this.request.post("v1/api/log/attack/search", {
                            data: {
                                start_time: this.$refs.datePicker.start.valueOf(),
                                end_time: this.$refs.datePicker.end.valueOf(),
                                attack_type: this.$refs.eventTypePicker.selected(),
                                attack_source: this.srcip,
                                app_id: this.current_app.id
                            }, page: t, perpage: 10
                        }).then(function (e) {
                            a.currentPage = t, a.data = e.data, a.total = e.total, a.loading = !1
                        })
                    }
                }
            }, Bt = {
                render: function () {
                    var t = this, a = t.$createElement, e = t._self._c || a;
                    return e("div", {staticClass: "my-3 my-md-5"}, [e("div", {staticClass: "container"}, [e("div", {staticClass: "page-header"}, [e("h1", {staticClass: "page-title"}, [t._v("\n        攻击事件\n      ")]), t._v(" "), e("div", {staticClass: "page-options d-flex"}, [e("div", {staticClass: "input-icon ml-2 w-50"}, [t._m(0), t._v(" "), e("DatePicker", {
                        ref: "datePicker",
                        on: {
                            selected: function (a) {
                                t.loadEvents(1)
                            }
                        }
                    })], 1), t._v(" "), e("EventTypePicker", {
                        ref: "eventTypePicker", on: {
                            selected: function (a) {
                                t.loadEvents(1)
                            }
                        }
                    }), t._v(" "), e("div", {staticClass: "input-icon ml-2"}, [t._m(1), t._v(" "), e("input", {
                        directives: [{
                            name: "model",
                            rawName: "v-model",
                            value: t.srcip,
                            expression: "srcip"
                        }],
                        staticClass: "form-control w-10",
                        attrs: {type: "text", placeholder: "攻击来源"},
                        domProps: {value: t.srcip},
                        on: {
                            input: function (a) {
                                a.target.composing || (t.srcip = a.target.value)
                            }
                        }
                    })]), t._v(" "), e("button", {
                        staticClass: "btn btn-primary ml-2", on: {
                            click: function (a) {
                                t.loadEvents(1)
                            }
                        }
                    }, [t._v("\n          搜索\n        ")])], 1)]), t._v(" "), e("div", {staticClass: "card"}, [e("div", {staticClass: "card-body"}, [t.loading ? e("VueLoading", {
                        attrs: {
                            type: "spiningDubbles",
                            color: "rgb(90, 193, 221)",
                            size: {width: "50px", height: "50px"}
                        }
                    }) : t._e(), t._v(" "), t.loading ? t._e() : e("table", {staticClass: "table table-striped table-bordered"}, [t._m(2), t._v(" "), e("tbody", t._l(t.data, function (a) {
                        return e("tr", {key: a.id}, [e("td", {attrs: {nowrap: ""}}, [t._v("\n                " + t._s(t.moment(a.event_time).format("YYYY-MM-DD")) + "\n                "), e("br"), t._v("\n                " + t._s(t.moment(a.event_time).format("HH:mm:ss")) + "\n              ")]), t._v(" "), e("td", {staticStyle: {"max-width": "500px"}}, [e("a", {
                            attrs: {
                                href: a.url,
                                target: "_blank"
                            }
                        }, [t._v("\n                  " + t._s(a.url) + "\n                ")])]), t._v(" "), e("td", {attrs: {nowrap: ""}}, [t._v("\n                " + t._s(a.attack_source) + "\n              ")]), t._v(" "), e("td", {attrs: {nowrap: ""}}, [t._v("\n                " + t._s(t.block_status2name(a.intercept_state)) + "\n              ")]), t._v(" "), e("td", {attrs: {nowrap: ""}}, [e("span", {staticClass: "tag tag-danger"}, [t._v("\n                  " + t._s(t.attack_type2name(a.attack_type)) + "\n                ")])]), t._v(" "), e("td", [t._v("\n                " + t._s(a.plugin_message) + "\n              ")]), t._v(" "), e("td", {attrs: {nowrap: ""}}, [e("a", {
                            attrs: {href: "javascript:"},
                            on: {
                                click: function (e) {
                                    t.showEventDetail(a)
                                }
                            }
                        }, [t._v("\n                  查看详情\n                ")])])])
                    }))]), t._v(" "), t.loading ? t._e() : e("nav", [e("b-pagination", {
                        attrs: {
                            align: "center",
                            "total-rows": t.total,
                            "per-page": 10
                        }, on: {
                            change: function (a) {
                                t.loadEvents(a)
                            }
                        }, model: {
                            value: t.currentPage, callback: function (a) {
                                t.currentPage = a
                            }, expression: "currentPage"
                        }
                    })], 1)], 1)])]), t._v(" "), e("EventDetailModal", {ref: "showEventDetail"})], 1)
                }, staticRenderFns: [function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("span", {staticClass: "input-icon-addon"}, [a("i", {staticClass: "fe fe-calendar"})])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("span", {staticClass: "input-icon-addon"}, [a("i", {staticClass: "fe fe-search"})])
                }, function () {
                    var t = this, a = t.$createElement, e = t._self._c || a;
                    return e("thead", [e("tr", [e("th", [t._v("\n                攻击时间\n              ")]), t._v(" "), e("th", [t._v("\n                URL\n              ")]), t._v(" "), e("th", [t._v("\n                攻击来源\n              ")]), t._v(" "), e("th", [t._v("\n                拦截状态\n              ")]), t._v(" "), e("th", {attrs: {nowrap: ""}}, [t._v("\n                攻击类型\n              ")]), t._v(" "), e("th", [t._v("\n                报警消息\n              ")]), t._v(" "), e("th", [t._v("\n                操作\n              ")])])])
                }]
            }, Jt = e("VU/8")(Wt, Bt, !1, null, null, null).exports, Xt = {
                name: "AddHostModal", data: function () {
                    return {data: {}, location: location, agent_domain: ""}
                }, computed: w()({}, Object(o.c)(["current_app"])), methods: {
                    showModal: function (t) {
                        var a = this;
                        return this.request.post("v1/api/agentdomain/get", {}).then(function (t) {
                            a.agent_domain = t.agent_domain, $("#addHostModal").modal()
                        })
                    }
                }
            }, Gt = {
                render: function () {
                    var t = this, a = t.$createElement, e = t._self._c || a;
                    return e("div", {
                        staticClass: "modal no-fade",
                        attrs: {id: "addHostModal", tabindex: "-1", role: "dialog"}
                    }, [e("div", {
                        staticClass: "modal-dialog",
                        attrs: {role: "document"}
                    }, [e("div", {staticClass: "modal-content"}, [t._m(0), t._v(" "), e("div", {
                        staticClass: "modal-body",
                        staticStyle: {"padding-top": "0"}
                    }, [t._m(1), t._v(" "), e("br"), t._v(" "), e("div", {
                        staticClass: "tab-content",
                        attrs: {id: "myTabContent"}
                    }, [e("div", {
                        staticClass: "tab-pane fade show active",
                        attrs: {id: "java-tab"}
                    }, [e("h4", [t._v("1. 下载 Java Agent 安装包")]), t._v(" "), e("pre", {staticStyle: {"white-space": "inherit"}}, [t._v("wget http://" + t._s(t.location.host) + "/packages/rasp-java.tar.gz"), e("br"), t._v("tar -xvf rasp-java.tar.gz"), e("br"), t._v("cd rasp-*/")]), t._v(" "), e("h4", [t._v("2. 执行 RaspInstall 进行安装")]), t._v(" "), e("pre", {staticStyle: {"white-space": "inherit"}}, [t._v("java -jar RaspInstall.jar -install /path/to/tomcat -appid " + t._s(t.current_app.id) + " -appsecret " + t._s(t.current_app.secret) + " -backendurl " + t._s(t.agent_domain))]), t._v(" "), e("h4", [t._v("3. 重启 Tomcat/JBoss/SpringBoot 应用服务器")]), t._v(" "), t._m(2)]), t._v(" "), e("div", {
                        staticClass: "tab-pane fade",
                        attrs: {id: "php-tab"}
                    }, [e("h4", [t._v("1. 下载 PHP 安装包")]), t._v(" "), e("pre", {staticStyle: {"white-space": "inherit"}}, [t._v("wget http://" + t._s(t.location.host) + "/packages/rasp-php.tar.gz")]), t._v(" "), e("h4", [t._v("2. 执行 install.php 进行安装")]), t._v(" "), e("pre", {staticStyle: {"white-space": "inherit"}}, [t._v("php install.php -d /opt/rasp --app-id " + t._s(t.current_app.id) + " --app-secret " + t._s(t.current_app.secret) + " --backend-url " + t._s(t.agent_domain))]), t._v(" "), e("h4", [t._v("3. 重启 PHP-FPM 或者 Apache 服务器")]), t._v(" "), e("pre", {staticStyle: {"white-space": "inherit"}}, [t._v("service php-fpm restart")]), t._v(" "), e("p", [t._v("-或者-")]), t._v(" "), e("pre", {staticStyle: {"white-space": "inherit"}}, [t._v("apachectl -k restart")])])])]), t._v(" "), t._m(3)])])])
                }, staticRenderFns: [function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("div", {staticClass: "modal-header"}, [a("h5", {staticClass: "modal-title"}, [this._v("\n          添加主机\n        ")]), this._v(" "), a("button", {
                        staticClass: "close",
                        attrs: {type: "button", "data-dismiss": "modal", "aria-label": "Close"}
                    })])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("ul", {
                        staticClass: "nav nav-tabs",
                        attrs: {id: "myTab", role: "tablist"}
                    }, [a("li", {staticClass: "nav-item"}, [a("a", {
                        staticClass: "nav-link active",
                        attrs: {"data-toggle": "tab", href: "#java-tab"}
                    }, [this._v("\n              Java 服务器\n            ")])]), this._v(" "), a("li", {staticClass: "nav-item"}, [a("a", {
                        staticClass: "nav-link",
                        attrs: {"data-toggle": "tab", href: "#php-tab"}
                    }, [this._v("\n              PHP 服务器\n            ")])])])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("pre", {staticStyle: {"white-space": "inherit"}}, [this._v("/path/to/tomcat/bin/shutdown.sh"), a("br"), this._v("/path/to/tomcat/bin/startup.sh")])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("div", {staticClass: "modal-footer"}, [a("button", {
                        staticClass: "btn btn-secondary mr-auto",
                        attrs: {href: "https://rasp.baidu.com/doc/install/software.html", target: "_blank"}
                    }, [this._v("\n          了解更多\n        ")]), this._v(" "), a("button", {
                        staticClass: "btn btn-primary",
                        attrs: {"data-dismiss": "modal"}
                    }, [this._v("\n          关闭\n        ")])])
                }]
            }, Qt = {
                name: "Navigation",
                components: {AddHostModal: e("VU/8")(Xt, Gt, !1, null, null, null).exports},
                computed: w()({}, Object(o.c)(["current_app", "app_list"])),
                watch: {
                    current_app: function (t) {
                        this.$router.push({name: this.$route.name, params: {app_id: t.id}})
                    }
                },
                methods: w()({}, Object(o.b)(["loadAppList"]), Object(o.d)(["setCurrentApp"]), {
                    showAddHostModal: function () {
                        this.$refs.addHost.showModal()
                    }, doLogout: function () {
                        return this.request.post("v1/user/logout", {}).then(function (t) {
                            c.a.set("RASP_AUTH_ID", null), location.href = "/#/login"
                        })
                    }
                })
            }, Kt = {
                render: function () {
                    var t = this, a = t.$createElement, e = t._self._c || a;
                    return e("div", [e("div", {staticClass: "header py-4"}, [e("div", {staticClass: "container"}, [e("div", {staticClass: "d-flex"}, [e("div", {staticClass: "dropdown"}, [e("a", {
                        staticClass: "nav-link pr-0 leading-none",
                        staticStyle: {"padding-left": "0"},
                        attrs: {href: "javascript:", "data-toggle": "dropdown"}
                    }, [e("span", {
                        staticClass: "avatar",
                        style: {"background-image": t.current_app.language ? "url(/static/images/lang/" + t.current_app.language + ".png)" : void 0}
                    }), t._v(" "), e("span", {staticClass: "ml-2 d-none d-lg-block"}, [t._m(0), t._v(" "), e("small", {staticClass: "text-default d-block mt-1"}, [t._v("\n                " + t._s(t.current_app.name) + "\n              ")])])]), t._v(" "), e("div", {staticClass: "dropdown-menu dropdown-menu-left dropdown-menu-arrow"}, [t._l(t.app_list, function (a) {
                        return e("a", {
                            key: a.id,
                            staticClass: "dropdown-item",
                            attrs: {href: "javascript:"},
                            on: {
                                click: function (e) {
                                    e.preventDefault(), t.setCurrentApp(a)
                                }
                            }
                        }, [e("i", {staticClass: "dropdown-icon fe fe-lock"}), t._v("\n              " + t._s(a.name) + " ( " + t._s(a.lang) + " " + t._s(a.id) + " )\n            ")])
                    }), t._v(" "), e("div", {staticClass: "dropdown-divider"}), t._v(" "), e("router-link", {
                        staticClass: "dropdown-item",
                        attrs: {to: {name: "settings", params: {setting_tab: "app"}}}
                    }, [e("i", {staticClass: "dropdown-icon fe fe-settings"}), t._v("\n              应用管理\n            ")])], 2)]), t._v(" "), e("div", {staticClass: "d-flex order-lg-2 ml-auto"}, [e("div", {staticClass: "nav-item d-none d-md-flex"}, [e("a", {
                        staticClass: "btn btn-sm btn-outline-primary",
                        attrs: {href: "javascript:"},
                        on: {click: t.showAddHostModal}
                    }, [t._v("\n              添加主机\n            ")])]), t._v(" "), e("div", {staticClass: "dropdown"}, [t._m(1), t._v(" "), e("div", {
                        staticClass: "dropdown-menu dropdown-menu-right dropdown-menu-arrow",
                        attrs: {"x-placement": "bottom-end"}
                    }, [e("a", {
                        staticClass: "dropdown-item", attrs: {href: "javascript:"}, on: {
                            click: function (a) {
                                t.doLogout()
                            }
                        }
                    }, [e("i", {staticClass: "dropdown-icon fe fe-log-out"}), t._v(" 退出登录\n              ")])])])]), t._v(" "), t._m(2)])])]), t._v(" "), e("div", {
                        staticClass: "header collapse d-lg-flex p-0",
                        attrs: {id: "headerMenuCollapse"}
                    }, [e("div", {staticClass: "container"}, [e("div", {staticClass: "row align-items-center"}, [e("div", {staticClass: "col-lg order-lg-first"}, [t.current_app.id ? e("ul", {staticClass: "nav nav-tabs border-0 flex-column flex-lg-row"}, [e("li", {staticClass: "nav-item"}, [e("RouterLink", {
                        staticClass: "nav-link",
                        attrs: {to: {name: "dashboard", params: {app_id: t.current_app.id}}}
                    }, [e("i", {staticClass: "fe fe-home"}), t._v("\n                安全总览\n              ")])], 1), t._v(" "), e("li", {staticClass: "nav-item"}, [e("RouterLink", {
                        staticClass: "nav-link",
                        attrs: {to: {name: "events", params: {app_id: t.current_app.id}}}
                    }, [e("i", {staticClass: "fe fe-bell"}), t._v("\n                攻击事件\n              ")])], 1), t._v(" "), e("li", {staticClass: "nav-item dropdown"}, [e("RouterLink", {
                        staticClass: "nav-link",
                        attrs: {to: {name: "baseline", params: {app_id: t.current_app.id}}}
                    }, [e("i", {staticClass: "fe fe-check-square"}), t._v("\n                安全基线\n              ")])], 1), t._v(" "), e("li", {staticClass: "nav-item"}, [e("RouterLink", {
                        staticClass: "nav-link",
                        attrs: {to: {name: "hosts", params: {app_id: t.current_app.id}}}
                    }, [e("i", {staticClass: "fe fe-cloud"}), t._v("\n                主机管理\n              ")])], 1), t._v(" "), e("li", {staticClass: "nav-item"}, [e("RouterLink", {
                        staticClass: "nav-link",
                        attrs: {to: {name: "plugins", params: {app_id: t.current_app.id}}}
                    }, [e("i", {staticClass: "fe fe-zap"}), t._v("\n                插件管理\n              ")])], 1), t._v(" "), e("li", {staticClass: "nav-item"}, [e("RouterLink", {
                        staticClass: "nav-link",
                        attrs: {to: {name: "audit", params: {app_id: t.current_app.id}}}
                    }, [e("i", {staticClass: "fe fe-user-check"}), t._v("\n                操作审计\n              ")])], 1), t._v(" "), e("li", {staticClass: "nav-item dropdown"}, [e("RouterLink", {
                        staticClass: "nav-link",
                        attrs: {to: {name: "settings", params: {app_id: t.current_app.id}}}
                    }, [e("i", {staticClass: "fe fe-settings"}), t._v("\n                系统设置\n              ")])], 1), t._v(" "), t._m(3), t._v(" "), t._m(4)]) : t._e()])])])]), t._v(" "), e("AddHostModal", {ref: "addHost"})], 1)
                }, staticRenderFns: [function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("span", {
                        staticClass: "text-muted",
                        staticStyle: {"margin-left": "-2px"}
                    }, [this._v("\n                当前应用\n                "), a("i", {staticClass: "fa fa-caret-down"})])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("a", {
                        staticClass: "nav-link pr-0 leading-none",
                        attrs: {href: "javascript:", "data-toggle": "dropdown"}
                    }, [a("span", {staticClass: "ml-2 d-none d-lg-block"}, [a("span", {staticClass: "text-default"}, [this._v("\n                  openrasp "), a("i", {staticClass: "fa fa-caret-down"})]), this._v(" "), a("small", {staticClass: "text-muted d-block mt-1"}, [this._v("\n                  管理员权限\n                ")])])])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("a", {
                        staticClass: "header-toggler d-lg-none ml-3 ml-lg-0",
                        attrs: {href: "#", "data-toggle": "collapse", "data-target": "#headerMenuCollapse"}
                    }, [a("span", {staticClass: "header-toggler-icon"})])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("li", {staticClass: "nav-item"}, [a("a", {
                        staticClass: "nav-link",
                        attrs: {href: "https://rasp.baidu.com/doc", target: "_blank"}
                    }, [a("i", {staticClass: "fe fe-file-text"}), this._v("\n                帮助文档\n              ")])])
                }, function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("li", {staticClass: "nav-item"}, [a("a", {
                        staticClass: "nav-link",
                        attrs: {href: "https://rasp.baidu.com/#section-support", target: "_blank"}
                    }, [a("i", {staticClass: "fa fa-qq"}), this._v("\n                技术支持\n              ")])])
                }]
            }, Zt = {
                render: function () {
                    this.$createElement;
                    this._self._c;
                    return this._m(0)
                }, staticRenderFns: [function () {
                    var t = this, a = t.$createElement, e = t._self._c || a;
                    return e("footer", {staticClass: "footer"}, [e("div", {staticClass: "container"}, [e("div", {staticClass: "row align-items-center flex-row-reverse"}, [e("div", {staticClass: "col-auto ml-lg-auto"}, [e("div", {staticClass: "row align-items-center"}, [e("div", {staticClass: "col-auto"}, [e("ul", {staticClass: "list-inline list-inline-dots mb-0"}, [e("li", {staticClass: "list-inline-item"}, [e("a", {
                        attrs: {
                            href: "https://rasp.baidu.com/",
                            target: "_blank"
                        }
                    }, [t._v("官方网站")])]), t._v(" "), e("li", {staticClass: "list-inline-item"}, [e("a", {
                        attrs: {
                            href: "https://rasp.baidu.com/#section-books",
                            target: "_blank"
                        }
                    }, [t._v("最佳实践")])])])]), t._v(" "), e("div", {staticClass: "col-auto"}, [e("a", {
                        staticClass: "btn btn-outline-primary btn-sm",
                        attrs: {href: "https://github.com/baidu/openrasp"}
                    }, [t._v("源代码")])])])]), t._v(" "), e("div", {staticClass: "col-12 col-lg-auto mt-3 mt-lg-0 text-center"}, [t._v("\n        Copyright © 2018 "), e("a", {
                        attrs: {
                            href: "https://rasp.baidu.com",
                            target: "_blank"
                        }
                    }, [t._v("Baidu Inc")]), t._v("，本页面基于 "), e("a", {
                        attrs: {
                            href: "https://github.com/tabler/tabler",
                            target: "_blank"
                        }
                    }, [t._v("Tabler")]), t._v(" 开源模板开发\n      ")])])])])
                }]
            }, ta = {
                name: "Main",
                components: {
                    Navigation: e("VU/8")(Qt, Kt, !1, null, null, null).exports,
                    Footer: e("VU/8")(null, Zt, !1, null, null, null).exports
                }
            }, aa = {
                render: function () {
                    var t = this.$createElement, a = this._self._c || t;
                    return a("div", {
                        staticClass: "page",
                        attrs: {id: "main"}
                    }, [a("div", {staticStyle: {"min-height": "calc(100vh - 67px)"}}, [a("Navigation"), this._v(" "), a("RouterView", {
                        staticStyle: {
                            "min-height": "100%",
                            "margin-bottom": "-50px"
                        }
                    })], 1), this._v(" "), a("Footer", {staticStyle: {height: "67px"}})], 1)
                }, staticRenderFns: []
            }, ea = e("VU/8")(ta, aa, !1, null, null, null).exports;
        s.default.use(r.a);
        var sa = new r.a({
                routes: [{path: "/login", name: "login", component: k}, {
                    path: "/",
                    beforeEnter: function (t, a, e) {
                        c.a.get("RASP_AUTH_ID") ? g.dispatch("loadAppList", t.params.app_id).then(function () {
                            return e()
                        }).catch(function (t) {
                            console.error(t), e({name: "500"})
                        }) : e({name: "login"})
                    },
                    component: ea,
                    children: [{path: "dashboard/:app_id", name: "dashboard", component: N}, {
                        path: "hosts/:app_id/",
                        name: "hosts",
                        component: tt
                    }, {path: "audit/:app_id/", name: "audit", component: zt}, {
                        path: "settings/:setting_tab/:app_id/",
                        name: "settings",
                        component: Dt
                    }, {path: "plugins/:app_id/", name: "plugins", component: Nt}, {
                        path: "baseline/:app_id/",
                        name: "baseline",
                        component: Q
                    }, {path: "events/:app_id/", name: "events", component: Jt}, {path: "*", redirect: {name: "dashboard"}}]
                }, {path: "*", redirect: {name: "dashboard"}}], linkExactActiveClass: "active"
            }), na = e("e6fC"),
            ia = (e("K3J8"), e("Jmt5"), e("9M+g"), e("kD4L"), e("lkn4"), e("x9ll"), e("fUvK"), e("f4zI"));
        s.default.mixin({
            filters: {
                capitalize: function (t) {
                    return t ? (t = t.toString()).charAt(0).toUpperCase() + t.slice(1) : ""
                }
            }, components: {VueLoading: ia.VueLoading}, data: function () {
                return {request: f}
            }, mounted: function () {
                $(document).on("click.bs.dropdown.data-api", ".dropdown .keep-open-on-click", function (t) {
                    t.stopPropagation()
                })
            }, methods: {
                moment: function () {
                    return F.a.apply(void 0, arguments)
                }, api_request: function (t, a, e, s) {
                    var n = "/";
                    p.a.post(n + t, a).then(function (a) {
                        200 != a.status ? alert("HTTP 请求出错: 响应码 " + a.status) : 0 != a.data.status ? s ? s(a.data.status, a.data.description) : alert("API 接口出错: " + a.data.status + " - " + a.data.description) : (console.log(t, a.data.data), e(a.data.data))
                    }).catch(function (a) {
                        console.log("axios 错误: ", t, a)
                    })
                }
            }
        }), s.default.use(na.a), window.$ = window.jQuery = e("7t+N"), s.default.config.productionTip = !1, s.default.prototype.$http = p.a, new s.default({
            el: "#app",
            router: sa,
            store: g,
            render: function (t) {
                return t(i)
            }
        })
    }, kD4L: function (t, a) {
    }, lkn4: function (t, a) {
    }, uslO: function (t, a, e) {
        var s = {
            "./af": "3CJN",
            "./af.js": "3CJN",
            "./ar": "3MVc",
            "./ar-dz": "tkWw",
            "./ar-dz.js": "tkWw",
            "./ar-kw": "j8cJ",
            "./ar-kw.js": "j8cJ",
            "./ar-ly": "wPpW",
            "./ar-ly.js": "wPpW",
            "./ar-ma": "dURR",
            "./ar-ma.js": "dURR",
            "./ar-sa": "7OnE",
            "./ar-sa.js": "7OnE",
            "./ar-tn": "BEem",
            "./ar-tn.js": "BEem",
            "./ar.js": "3MVc",
            "./az": "eHwN",
            "./az.js": "eHwN",
            "./be": "3hfc",
            "./be.js": "3hfc",
            "./bg": "lOED",
            "./bg.js": "lOED",
            "./bm": "hng5",
            "./bm.js": "hng5",
            "./bn": "aM0x",
            "./bn.js": "aM0x",
            "./bo": "w2Hs",
            "./bo.js": "w2Hs",
            "./br": "OSsP",
            "./br.js": "OSsP",
            "./bs": "aqvp",
            "./bs.js": "aqvp",
            "./ca": "wIgY",
            "./ca.js": "wIgY",
            "./cs": "ssxj",
            "./cs.js": "ssxj",
            "./cv": "N3vo",
            "./cv.js": "N3vo",
            "./cy": "ZFGz",
            "./cy.js": "ZFGz",
            "./da": "YBA/",
            "./da.js": "YBA/",
            "./de": "DOkx",
            "./de-at": "8v14",
            "./de-at.js": "8v14",
            "./de-ch": "Frex",
            "./de-ch.js": "Frex",
            "./de.js": "DOkx",
            "./dv": "rIuo",
            "./dv.js": "rIuo",
            "./el": "CFqe",
            "./el.js": "CFqe",
            "./en-au": "Sjoy",
            "./en-au.js": "Sjoy",
            "./en-ca": "Tqun",
            "./en-ca.js": "Tqun",
            "./en-gb": "hPuz",
            "./en-gb.js": "hPuz",
            "./en-ie": "ALEw",
            "./en-ie.js": "ALEw",
            "./en-il": "QZk1",
            "./en-il.js": "QZk1",
            "./en-nz": "dyB6",
            "./en-nz.js": "dyB6",
            "./eo": "Nd3h",
            "./eo.js": "Nd3h",
            "./es": "LT9G",
            "./es-do": "7MHZ",
            "./es-do.js": "7MHZ",
            "./es-us": "INcR",
            "./es-us.js": "INcR",
            "./es.js": "LT9G",
            "./et": "XlWM",
            "./et.js": "XlWM",
            "./eu": "sqLM",
            "./eu.js": "sqLM",
            "./fa": "2pmY",
            "./fa.js": "2pmY",
            "./fi": "nS2h",
            "./fi.js": "nS2h",
            "./fo": "OVPi",
            "./fo.js": "OVPi",
            "./fr": "tzHd",
            "./fr-ca": "bXQP",
            "./fr-ca.js": "bXQP",
            "./fr-ch": "VK9h",
            "./fr-ch.js": "VK9h",
            "./fr.js": "tzHd",
            "./fy": "g7KF",
            "./fy.js": "g7KF",
            "./gd": "nLOz",
            "./gd.js": "nLOz",
            "./gl": "FuaP",
            "./gl.js": "FuaP",
            "./gom-latn": "+27R",
            "./gom-latn.js": "+27R",
            "./gu": "rtsW",
            "./gu.js": "rtsW",
            "./he": "Nzt2",
            "./he.js": "Nzt2",
            "./hi": "ETHv",
            "./hi.js": "ETHv",
            "./hr": "V4qH",
            "./hr.js": "V4qH",
            "./hu": "xne+",
            "./hu.js": "xne+",
            "./hy-am": "GrS7",
            "./hy-am.js": "GrS7",
            "./id": "yRTJ",
            "./id.js": "yRTJ",
            "./is": "upln",
            "./is.js": "upln",
            "./it": "FKXc",
            "./it.js": "FKXc",
            "./ja": "ORgI",
            "./ja.js": "ORgI",
            "./jv": "JwiF",
            "./jv.js": "JwiF",
            "./ka": "RnJI",
            "./ka.js": "RnJI",
            "./kk": "j+vx",
            "./kk.js": "j+vx",
            "./km": "5j66",
            "./km.js": "5j66",
            "./kn": "gEQe",
            "./kn.js": "gEQe",
            "./ko": "eBB/",
            "./ko.js": "eBB/",
            "./ky": "6cf8",
            "./ky.js": "6cf8",
            "./lb": "z3hR",
            "./lb.js": "z3hR",
            "./lo": "nE8X",
            "./lo.js": "nE8X",
            "./lt": "/6P1",
            "./lt.js": "/6P1",
            "./lv": "jxEH",
            "./lv.js": "jxEH",
            "./me": "svD2",
            "./me.js": "svD2",
            "./mi": "gEU3",
            "./mi.js": "gEU3",
            "./mk": "Ab7C",
            "./mk.js": "Ab7C",
            "./ml": "oo1B",
            "./ml.js": "oo1B",
            "./mn": "CqHt",
            "./mn.js": "CqHt",
            "./mr": "5vPg",
            "./mr.js": "5vPg",
            "./ms": "ooba",
            "./ms-my": "G++c",
            "./ms-my.js": "G++c",
            "./ms.js": "ooba",
            "./mt": "oCzW",
            "./mt.js": "oCzW",
            "./my": "F+2e",
            "./my.js": "F+2e",
            "./nb": "FlzV",
            "./nb.js": "FlzV",
            "./ne": "/mhn",
            "./ne.js": "/mhn",
            "./nl": "3K28",
            "./nl-be": "Bp2f",
            "./nl-be.js": "Bp2f",
            "./nl.js": "3K28",
            "./nn": "C7av",
            "./nn.js": "C7av",
            "./pa-in": "pfs9",
            "./pa-in.js": "pfs9",
            "./pl": "7LV+",
            "./pl.js": "7LV+",
            "./pt": "ZoSI",
            "./pt-br": "AoDM",
            "./pt-br.js": "AoDM",
            "./pt.js": "ZoSI",
            "./ro": "wT5f",
            "./ro.js": "wT5f",
            "./ru": "ulq9",
            "./ru.js": "ulq9",
            "./sd": "fW1y",
            "./sd.js": "fW1y",
            "./se": "5Omq",
            "./se.js": "5Omq",
            "./si": "Lgqo",
            "./si.js": "Lgqo",
            "./sk": "OUMt",
            "./sk.js": "OUMt",
            "./sl": "2s1U",
            "./sl.js": "2s1U",
            "./sq": "V0td",
            "./sq.js": "V0td",
            "./sr": "f4W3",
            "./sr-cyrl": "c1x4",
            "./sr-cyrl.js": "c1x4",
            "./sr.js": "f4W3",
            "./ss": "7Q8x",
            "./ss.js": "7Q8x",
            "./sv": "Fpqq",
            "./sv.js": "Fpqq",
            "./sw": "DSXN",
            "./sw.js": "DSXN",
            "./ta": "+7/x",
            "./ta.js": "+7/x",
            "./te": "Nlnz",
            "./te.js": "Nlnz",
            "./tet": "gUgh",
            "./tet.js": "gUgh",
            "./tg": "5SNd",
            "./tg.js": "5SNd",
            "./th": "XzD+",
            "./th.js": "XzD+",
            "./tl-ph": "3LKG",
            "./tl-ph.js": "3LKG",
            "./tlh": "m7yE",
            "./tlh.js": "m7yE",
            "./tr": "k+5o",
            "./tr.js": "k+5o",
            "./tzl": "iNtv",
            "./tzl.js": "iNtv",
            "./tzm": "FRPF",
            "./tzm-latn": "krPU",
            "./tzm-latn.js": "krPU",
            "./tzm.js": "FRPF",
            "./ug-cn": "To0v",
            "./ug-cn.js": "To0v",
            "./uk": "ntHu",
            "./uk.js": "ntHu",
            "./ur": "uSe8",
            "./ur.js": "uSe8",
            "./uz": "XU1s",
            "./uz-latn": "/bsm",
            "./uz-latn.js": "/bsm",
            "./uz.js": "XU1s",
            "./vi": "0X8Q",
            "./vi.js": "0X8Q",
            "./x-pseudo": "e/KL",
            "./x-pseudo.js": "e/KL",
            "./yo": "YXlc",
            "./yo.js": "YXlc",
            "./zh-cn": "Vz2w",
            "./zh-cn.js": "Vz2w",
            "./zh-hk": "ZUyn",
            "./zh-hk.js": "ZUyn",
            "./zh-tw": "BbgG",
            "./zh-tw.js": "BbgG"
        };

        function n(t) {
            return e(i(t))
        }

        function i(t) {
            var a = s[t];
            if (!(a + 1)) throw new Error("Cannot find module '" + t + "'.");
            return a
        }

        n.keys = function () {
            return Object.keys(s)
        }, n.resolve = i, t.exports = n, n.id = "uslO"
    }, x9ll: function (t, a) {
    }, zj2Q: function (t, a) {
    }
}, ["NHnr"]);
//# sourceMappingURL=app.f73cd6dc69f535a33ae7.js.map