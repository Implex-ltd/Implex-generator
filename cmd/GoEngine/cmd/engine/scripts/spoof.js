/**
 * Fingerprint spoofing script !!
 * Thanks: https://github.com/kkoooqq/fakebrowser/blob/main/src/plugins/evasions
 */

// Todo: refactor (ig hsw check browser func)

// https://github.com/kkoooqq/fakebrowser/blob/main/src/plugins/evasions/_utils/index.js
const utils = {}; utils.init = () => { utils._preloadCache(), utils._preloadEnv(), utils._preloadGlobalVariables(), utils._hookObjectPrototype() }, utils._preloadCache = () => { if (utils.cache || (utils.cache = OffscreenCanvas.prototype.constructor.__$cache, utils.cache)) return; class t extends Promise { } OffscreenCanvas.prototype.constructor.__$cache = utils.cache = { nativeToStringStr: Function.toString + "", Reflect: { get: Reflect.get.bind(Reflect), set: Reflect.set.bind(Reflect), apply: Reflect.apply.bind(Reflect), ownKeys: Reflect.ownKeys.bind(Reflect), getOwnPropertyDescriptor: Reflect.getOwnPropertyDescriptor.bind(Reflect), setPrototypeOf: Reflect.setPrototypeOf.bind(Reflect) }, Promise: t, Object: { setPrototypeOf: Object.setPrototypeOf.bind(Object), getPrototypeOf: Object.getPrototypeOf.bind(Object), getOwnPropertyDescriptors: Object.getOwnPropertyDescriptors.bind(Object), getOwnPropertyDescriptor: Object.getOwnPropertyDescriptor.bind(Object), entries: Object.entries.bind(Object), fromEntries: Object.fromEntries.bind(Object), defineProperty: Object.defineProperty.bind(Object), defineProperties: Object.defineProperties.bind(Object), getOwnPropertyNames: Object.getOwnPropertyNames.bind(Object), create: Object.create.bind(Object), keys: Object.keys.bind(Object), values: Object.values.bind(Object) }, Function: { prototype: { toString: Function.prototype.toString } }, global: "undefined" != typeof window ? window : globalThis, window: { getComputedStyle: "undefined" != typeof window && window.getComputedStyle.bind(window), eval: "undefined" != typeof window ? window.eval.bind(window) : globalThis ? globalThis.eval.bind(globalThis) : void 0, navigator: "undefined" != typeof window ? window.navigator : globalThis ? globalThis.navigator : void 0 }, OffscreenCanvas: { prototype: { getContext: "undefined" != typeof OffscreenCanvas && OffscreenCanvas.prototype.getContext } }, HTMLCanvasElement: { prototype: { getContext: "undefined" != typeof HTMLCanvasElement && HTMLCanvasElement.prototype.getContext } }, Descriptor: {} }; let e = (t, e) => { let r = t.split("."), i = utils.cache.global, o = utils.cache.Descriptor; for (let n of r) { i && (i = Object.hasOwn(i, n) ? i[n] : void 0); let s = o[n] || {}; o[n] = s, o = s } for (let l of e) o[l] = i ? Object.getOwnPropertyDescriptor(i, l) : void 0 }; e("window", ["alert"]), e("Navigator.prototype", ["webdriver"]), e("WorkerNavigator.prototype", ["webdriver"]), e("HTMLElement.prototype", ["style"]), e("CSSStyleDeclaration.prototype", ["setProperty"]), e("FontFace.prototype", ["load"]), e("WebGLShaderPrecisionFormat.prototype", ["rangeMin", "rangeMax", "precision"]) }, utils._preloadGlobalVariables = () => { if (!utils.variables) utils.variables = OffscreenCanvas.prototype.constructor.__$variables, !utils.variables && (OffscreenCanvas.prototype.constructor.__$variables = utils.variables = { proxies: [], toStringPatchObjs: [], toStringRedirectObjs: [], renderingContextWithOperators: [], taskData: {} }) }, utils._preloadEnv = () => { if (!utils.env) utils.env = OffscreenCanvas.prototype.constructor.__$env, !utils.env && (OffscreenCanvas.prototype.constructor.__$env = utils.env = { isWorker: !globalThis.document && !!globalThis.WorkerGlobalScope, isSharedWorker: !!globalThis.SharedWorkerGlobalScope, isServiceWorker: !!globalThis.ServiceWorkerGlobalScope }) }, utils._hookObjectPrototype = () => { if (utils.objHooked || (utils.objHooked = OffscreenCanvas.prototype.constructor.__$objHooked, utils.objHooked)) return; utils.objHooked = OffscreenCanvas.prototype.constructor.__$objHooked = !0; let t = utils.cache.Object, e = utils.cache.Reflect; utils.replaceWithProxy(Object, "setPrototypeOf", { apply: (t, r, i) => (i[0] = utils.getProxyTarget(i[0]), i[1] = utils.getProxyTarget(i[1]), e.apply(t, r, i)) }); let r = utils.newProxyInstance(Function.prototype.toString, utils.stripProxyFromErrors({ apply: function (r, i, o) { if (i === Function.prototype.toString) return utils.makeNativeString("toString"); let n = utils.variables.toStringPatchObjs.find(t => t.obj === i); if (n) return n.str || utils.makeNativeString(n.obj.name); let s = utils.variables.toStringRedirectObjs.find(t => t.proxyObj === i); if (s) { let { proxyObj: l, originalObj: a } = s, c = () => a && a.name ? utils.makeNativeString(a.name) : utils.makeNativeString(l.name); return a + "" || c() } if (null == i) return e.apply(r, i, o); let u = t.getPrototypeOf(Function.prototype.toString).isPrototypeOf(i.toString); return u ? e.apply(r, i, o) : i.toString() } })); utils.replaceProperty(Function.prototype, "toString", { value: r }), utils.replaceWithProxy(Object, "create", { apply: (t, i, o) => (o[0] === r && (o[0] = utils.cache.Function.prototype.toString), e.apply(t, i, o)) }) }, utils.removeTempVariables = () => { let t = Object.getOwnPropertyNames(OffscreenCanvas.prototype.constructor).filter(t => t.startsWith("__$")); t.forEach(t => { delete OffscreenCanvas.prototype.constructor[t] }) }, utils.newProxyInstance = (t, e) => { let r = new Proxy(t, e); return utils.variables.proxies.push({ proxy: r, target: t }), r }, utils.getProxyTarget = t => { let e = utils.variables.proxies.find(e => e.proxy === t); return e ? e.target : t }, utils.patchError = (t, e) => { if (!t || !t.stack || !t.stack.includes("at ")) return t; t.stack = t.stack.replace("at Object.toString (", "at Function.toString ("); let r = "", i = t.stack.split("\n"), o = i.findIndex(t => { let e = t.match(/Object\.ɵɵɵɵnewHandler\.<computed> \[as (.*)]/); return !!e && !!e[1] && (r = e[1], !0) }); if (o < 0 || !r) return t; let n = [], s = (t, e) => { let r = t.match(/:[0-9]+:[0-9]+/g) || []; return e && n.push(...r), r }; s(i[o], !0), i.splice(o, 1), i[--o].includes(`at Object.${r} (`) && (s(i[o], !0), i.splice(o, 1)); for (let l = o - 1; l >= 0; --l) { let a = i[l]; if (a.includes(`at new ɵɵɵɵPromise (eval at <anonymous>`)) { i.splice(l, 1), i[l - 1] && i[l - 1].includes("at new Promise (<anonymous>)") && (--l, i.splice(l, 1)); continue } let c = s(a, !1); utils.intersectionSet(c, n).size > 0 && (n.push(...c), i.splice(l, 1)) } return t.stack = i.join("\n"), t }, utils.stripProxyFromErrors = (t = {}) => { let e = utils.cache.Object, r = utils.cache.Reflect, i = { setPrototypeOf: function (t, i) { if (null === i) throw TypeError("Cannot convert object to primitive value"); if (e.getPrototypeOf(t) === e.getPrototypeOf(i)) throw TypeError("Cyclic __proto__ value"); return r.setPrototypeOf(t, i) } }, o = e.getOwnPropertyNames(t); return o.forEach(e => { i[e] = function () { try { return t[e].apply(this, arguments || []) } catch (r) { throw utils.patchError(r, e) } } }), i }, utils.stripErrorWithAnchor = (t, e) => { let r = t.stack.split("\n"), i = r.findIndex(t => t.trim().startsWith(e)); return -1 === i || (r.splice(1, i), t.stack = r.join("\n")), t }, utils.replaceProperty = (t, e, r = {}) => { let i = utils.cache.Object, o = i.getOwnPropertyDescriptor(t, e) || {}; return i.defineProperty(t, e, { ...o, ...r }) }, utils.makeNativeString = (t = "") => utils.cache.nativeToStringStr.replace("toString", t || ""), utils.patchToString = (t, e = "") => { try { utils.variables.toStringPatchObjs.push({ obj: t, str: e }) } catch { } }, utils.patchToStringNested = (t = {}) => utils.execRecursively(t, ["function"], utils.patchToString), utils.redirectToString = (t, e) => { utils.variables.toStringRedirectObjs.push({ proxyObj: t, originalObj: e }) }, utils.replaceWithProxy = (t, e, r) => { let i = t[e]; if (utils.cache.Reflect, !i) return !1; let o = utils.newProxyInstance(i, utils.stripProxyFromErrors(r)); return utils.replaceProperty(t, e, { value: o }), utils.redirectToString(o, i), !0 }, utils.replaceGetterWithProxy = (t, e, r) => { let i = utils.cache.Object.getOwnPropertyDescriptor(t, e); if (!i) return !1; { let o = utils.cache.Object.getOwnPropertyDescriptor(t, e).get, n = o.toString(), s = utils.newProxyInstance(o, utils.stripProxyFromErrors(r)); return utils.replaceProperty(t, e, { get: s }), utils.patchToString(s, n), !0 } }, utils.replaceSetterWithProxy = (t, e, r) => { let i = utils.cache.Object.getOwnPropertyDescriptor(t, e); if (!i) return !1; { let o = utils.cache.Object.getOwnPropertyDescriptor(t, e).set, n = o.toString(), s = utils.newProxyInstance(o, utils.stripProxyFromErrors(r)); return utils.replaceProperty(t, e, { set: s }), utils.patchToString(s, n), !0 } }, utils.mockWithProxy = (t, e, r, i, o) => { let n = utils.cache.Reflect; o.get || (o.get = function t(r, i, o) { return "name" === i ? e : n.get(r, i, o) }); let s = r ? utils.newProxyInstance(r, utils.stripProxyFromErrors(o)) : utils.stripProxyFromErrors(o); return utils.replaceProperty(t, e, { ...i, value: s }), utils.patchToString(s), !0 }, utils.mockGetterWithProxy = (t, e, r, i, o) => { let n = utils.cache.Reflect; o.get || (o.get = function t(r, i, o) { return "name" === i ? `get ${e}` : "length" === i ? 0 : n.get(r, i, o) }); let s = r ? utils.newProxyInstance(r, utils.stripProxyFromErrors(o)) : utils.stripProxyFromErrors(o); return utils.replaceProperty(t, e, { ...i, get: s }), utils.patchToString(s, `function get ${e}() { [native code] }`), !0 }, utils.mockSetterWithProxy = (t, e, r, i, o) => { let n = utils.cache.Reflect; o.get || (o.get = function t(r, i, o) { return "name" === i ? `set ${e}` : "length" === i ? 1 : n.get(r, i, o) }); let s = r ? utils.newProxyInstance(r, utils.stripProxyFromErrors(o)) : utils.stripProxyFromErrors(o); return utils.replaceProperty(t, e, { ...i, set: s }), utils.patchToString(s, `function set ${e}() { [native code] }`), !0 }, utils.createProxy = (t, e) => { let r = utils.newProxyInstance(t, utils.stripProxyFromErrors(e)); return utils.patchToString(r), r }, utils.splitObjPath = t => ({ objName: t.split(".").slice(0, -1).join("."), propName: t.split(".").slice(-1)[0] }), utils.replaceObjPathWithProxy = (objPath, handler) => { let { objName, propName } = utils.splitObjPath(objPath), obj = eval(objName); return utils.replaceWithProxy(obj, propName, handler) }, utils.execRecursively = (t = {}, e = [], r) => { function i(t) { for (let o in t) void 0 !== t[o] && (t[o] && "object" == typeof t[o] ? i(t[o]) : t[o] && e.includes(typeof t[o]) && r.call(this, t[o])) } return i(t), t }, utils.stringifyFns = (t = { hello: () => "world" }) => { function e(t) { return [...t].reduce((t, [e, r]) => (t[e] = r, t), {}) } return (Object.fromEntries || e)(Object.entries(t).filter(([t, e]) => "function" == typeof e).map(([t, e]) => [t, e.toString(),])) }, utils.materializeFns = (fnStrObj = { hello: "() => 'world'" }) => Object.fromEntries(Object.entries(fnStrObj).map(([key, value]) => value.startsWith("function") ? [key, eval(`() => ${value}`)()] : [key, eval(value)])), utils.makeHandler = () => ({ getterValue: t => ({ apply(e, r, i) { let o = utils.cache.Reflect; return o.apply(...arguments), t } }) }), utils.sleep = t => new utils.cache.Promise(e => setTimeout(e, t)), utils.random = (t, e) => { let r = e - t + 1; return Math.floor(Math.random() * r + t) }, utils.isHex = t => { try { if (t && "string" == typeof t) return t.startsWith("0x") && (t = t.substr(2)), /^[A-F0-9]+$/i.test(t) } catch (e) { } return !1 }, utils.isInt = t => { try { let e = utils.isHex(t); if (e) return !0; return "" + parseInt(t) == "" + t } catch (r) { } return !1 }, utils.isUUID = t => { try { if ("string" == typeof t) return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(t) } catch (e) { } return !1 }, utils.isSequence = t => { let e = utils.cache.Object, r = null; for (; t && (r = e.getOwnPropertyDescriptors(t));) { if (r.forEach) return !0; t = e.getPrototypeOf(t) } return !1 }, utils.intersectionSet = (t, e) => (e instanceof Array && (e = new Set(e)), new Set([...t].filter(t => e.has(t)))), utils.unionSet = (t, e) => new Set([...t, ...e]), utils.differenceABSet = (t, e) => (e instanceof Array && (e = new Set(e)), new Set([...t].filter(t => !e.has(t)))), utils.makeFuncName = t => { t || (t = 4); let e = ""; for (let r = 0; r < t; ++r)e += String.fromCharCode(utils.random(65, 90)); return e }, utils.getCurrentScriptPath = () => { let t = {}, e; try { t.b() } catch (r) { e = r.stack || r.sourceURL || r.stacktrace } let i = /(?:http|https|file):\/\/.*?\/.+?\.js/.exec(e); return !i && (i = /(?:http|https|file):\/\/.*?\/.+?:?/.exec(e)) && (i[0] = i[0].substr(0, i[0].length - 1)), i && i[0] || "" }, utils.makePseudoClass = (t, e, r, i) => { let o = utils.cache.Object, n = new Proxy(r || function () { throw utils.patchError(TypeError("Illegal constructor"), "construct") }, { construct(t, e) { throw utils.patchError(TypeError("Illegal constructor"), "construct") } }); return t[e] = n, o.defineProperty(n, "name", { configurable: !0, enumerable: !1, writable: !1, value: e }), o.defineProperty(n, "prototype", { configurable: !1, enumerable: !1, writable: !1, value: n.prototype }), utils.patchToString(n, `function ${e}() { [native code] }`), utils.patchToString(n.prototype.constructor, `function ${e}() { [native code] }`), o.defineProperty(n.prototype, Symbol.toStringTag, { configurable: !0, enumerable: !1, writable: !1, value: e }), i && i.prototype && o.setPrototypeOf(n.prototype, i.prototype), n }, utils.markRenderingContextOperator = (t, e) => { let r = utils.variables.renderingContextWithOperators.findIndex(e => e.context === t); if (r >= 0) { let i = utils.variables.renderingContextWithOperators[r]; i && (i.operators[e] = !0) } return r }, utils.findRenderingContextIndex = t => { let e = ["2d", "webgl", "experimental-webgl", "webgl2", "experimental-webgl2", "bitmaprenderer",]; for (let r of e) { let i = null; i = utils.cache.Object.getPrototypeOf(t) === OffscreenCanvas.prototype ? utils.cache.OffscreenCanvas.prototype.getContext.call(t, r) : utils.cache.HTMLCanvasElement.prototype.getContext.call(t, r); let o = utils.variables.renderingContextWithOperators.findIndex(t => t.context === i); if (o >= 0) return { context: i, contextIndex: o } } return { context: null, contextIndex: -1 } }, utils.osType = t => { let e = "Unknown", r = { Windows: !1, macOS: !1, Linux: !1, iPhone: !1, iPod: !1, iPad: !1, Android: !1 }; for (let i in t = t.toLowerCase(), r.Windows = t.includes("win32") || t.includes("win64") || t.includes("windows"), r.macOS = t.includes("macintosh") || t.includes("mac68k") || t.includes("macppc") || t.includes("macintosh"), r.Linux = t.includes("linux"), r.iPhone = t.includes("iphone"), r.iPod = t.includes("ipod"), r.iPad = t.includes("ipad"), r.Android = t.includes("android"), r) r[i] && (e = i); return e };

var dd = { "plugins": { "mimeTypes": [{ "type": "application/pdf", "suffixes": "pdf", "description": "Portable Document Format", "__pluginName": "PDF Viewer" }, { "type": "text/pdf", "suffixes": "pdf", "description": "Portable Document Format", "__pluginName": "PDF Viewer" }], "plugins": [{ "name": "PDF Viewer", "filename": "internal-pdf-viewer", "description": "Portable Document Format", "__mimeTypes": ["application/pdf", "text/pdf"] }, { "name": "Chrome PDF Viewer", "filename": "internal-pdf-viewer", "description": "Portable Document Format", "__mimeTypes": ["application/pdf", "text/pdf"] }, { "name": "Chromium PDF Viewer", "filename": "internal-pdf-viewer", "description": "Portable Document Format", "__mimeTypes": ["application/pdf", "text/pdf"] }, { "name": "Microsoft Edge PDF Viewer", "filename": "internal-pdf-viewer", "description": "Portable Document Format", "__mimeTypes": ["application/pdf", "text/pdf"] }, { "name": "WebKit built-in PDF", "filename": "internal-pdf-viewer", "description": "Portable Document Format", "__mimeTypes": ["application/pdf", "text/pdf"] }] }, "gpu": { "vendor": "Google Inc. (Intel)", "renderer": "ANGLE (Intel, Intel(R) HD Graphics 4600 Direct3D11 vs_5_0 ps_5_0, D3D11)" }, "defaultCS": { "0": "accent-color", "1": "align-content", "2": "align-items", "3": "align-self", "4": "alignment-baseline", "5": "animation-composition", "6": "animation-delay", "7": "animation-direction", "8": "animation-duration", "9": "animation-fill-mode", "10": "animation-iteration-count", "11": "animation-name", "12": "animation-play-state", "13": "animation-timing-function", "14": "app-region", "15": "appearance", "16": "backdrop-filter", "17": "backface-visibility", "18": "background-attachment", "19": "background-blend-mode", "20": "background-clip", "21": "background-color", "22": "background-image", "23": "background-origin", "24": "background-position", "25": "background-repeat", "26": "background-size", "27": "baseline-shift", "28": "baseline-source", "29": "block-size", "30": "border-block-end-color", "31": "border-block-end-style", "32": "border-block-end-width", "33": "border-block-start-color", "34": "border-block-start-style", "35": "border-block-start-width", "36": "border-bottom-color", "37": "border-bottom-left-radius", "38": "border-bottom-right-radius", "39": "border-bottom-style", "40": "border-bottom-width", "41": "border-collapse", "42": "border-end-end-radius", "43": "border-end-start-radius", "44": "border-image-outset", "45": "border-image-repeat", "46": "border-image-slice", "47": "border-image-source", "48": "border-image-width", "49": "border-inline-end-color", "50": "border-inline-end-style", "51": "border-inline-end-width", "52": "border-inline-start-color", "53": "border-inline-start-style", "54": "border-inline-start-width", "55": "border-left-color", "56": "border-left-style", "57": "border-left-width", "58": "border-right-color", "59": "border-right-style", "60": "border-right-width", "61": "border-start-end-radius", "62": "border-start-start-radius", "63": "border-top-color", "64": "border-top-left-radius", "65": "border-top-right-radius", "66": "border-top-style", "67": "border-top-width", "68": "bottom", "69": "box-shadow", "70": "box-sizing", "71": "break-after", "72": "break-before", "73": "break-inside", "74": "buffered-rendering", "75": "caption-side", "76": "caret-color", "77": "clear", "78": "clip", "79": "clip-path", "80": "clip-rule", "81": "color", "82": "color-interpolation", "83": "color-interpolation-filters", "84": "color-rendering", "85": "column-count", "86": "column-gap", "87": "column-rule-color", "88": "column-rule-style", "89": "column-rule-width", "90": "column-span", "91": "column-width", "92": "contain-intrinsic-block-size", "93": "contain-intrinsic-height", "94": "contain-intrinsic-inline-size", "95": "contain-intrinsic-size", "96": "contain-intrinsic-width", "97": "container-name", "98": "container-type", "99": "content", "100": "cursor", "101": "cx", "102": "cy", "103": "d", "104": "direction", "105": "display", "106": "dominant-baseline", "107": "empty-cells", "108": "fill", "109": "fill-opacity", "110": "fill-rule", "111": "filter", "112": "flex-basis", "113": "flex-direction", "116": "flex-grow", "116": "flex-shrink", "116": "flex-wrap", "117": "float", "118": "flood-color", "119": "flood-opacity", "120": "font-family", "121": "font-kerning", "122": "font-optical-sizing", "123": "font-palette", "124": "font-size", "125": "font-stretch", "126": "font-style", "127": "font-synthesis-small-caps", "128": "font-synthesis-style", "129": "font-synthesis-weight", "130": "font-variant", "131": "font-variant-alternates", "132": "font-variant-caps", "133": "font-variant-east-asian", "134": "font-variant-ligatures", "135": "font-variant-numeric", "136": "font-weight", "137": "grid-auto-columns", "138": "grid-auto-flow", "139": "grid-auto-rows", "140": "grid-column-end", "141": "grid-column-start", "142": "grid-row-end", "143": "grid-row-start", "144": "grid-template-areas", "145": "grid-template-columns", "146": "grid-template-rows", "147": "height", "148": "hyphenate-character", "149": "hyphenate-limit-chars", "150": "hyphens", "151": "image-orientation", "152": "image-rendering", "153": "initial-letter", "154": "inline-size", "155": "inset-block-end", "156": "inset-block-start", "157": "inset-inline-end", "158": "inset-inline-start", "159": "isolation", "160": "justify-content", "161": "justify-items", "162": "justify-self", "163": "left", "164": "letter-spacing", "165": "lighting-color", "166": "line-break", "167": "line-height", "168": "list-style-image", "169": "list-style-position", "170": "list-style-type", "171": "margin-block-end", "172": "margin-block-start", "173": "margin-bottom", "174": "margin-inline-end", "175": "margin-inline-start", "176": "margin-left", "177": "margin-right", "178": "margin-top", "179": "marker-end", "180": "marker-mid", "181": "marker-start", "182": "mask-type", "183": "math-depth", "184": "math-shift", "185": "math-style", "186": "max-block-size", "187": "max-height", "188": "max-inline-size", "189": "max-width", "190": "min-block-size", "191": "min-height", "192": "min-inline-size", "193": "min-width", "194": "mix-blend-mode", "195": "object-fit", "196": "object-position", "197": "object-view-box", "198": "offset-distance", "199": "offset-path", "200": "offset-rotate", "201": "opacity", "202": "order", "203": "orphans", "204": "outline-color", "205": "outline-offset", "206": "outline-style", "207": "outline-width", "208": "overflow-anchor", "209": "overflow-clip-margin", "210": "overflow-wrap", "211": "overflow-x", "212": "overflow-y", "213": "overscroll-behavior-block", "214": "overscroll-behavior-inline", "215": "padding-block-end", "216": "padding-block-start", "217": "padding-bottom", "218": "padding-inline-end", "219": "padding-inline-start", "220": "padding-left", "221": "padding-right", "222": "padding-top", "223": "paint-order", "224": "perspective", "225": "perspective-origin", "226": "pointer-events", "227": "position", "228": "r", "229": "resize", "230": "right", "231": "rotate", "232": "row-gap", "233": "ruby-position", "234": "rx", "235": "ry", "236": "scale", "237": "scroll-behavior", "238": "scroll-margin-block-end", "239": "scroll-margin-block-start", "240": "scroll-margin-inline-end", "241": "scroll-margin-inline-start", "242": "scroll-padding-block-end", "243": "scroll-padding-block-start", "244": "scroll-padding-inline-end", "245": "scroll-padding-inline-start", "246": "scrollbar-gutter", "247": "shape-image-threshold", "248": "shape-margin", "249": "shape-outside", "250": "shape-rendering", "251": "speak", "252": "stop-color", "253": "stop-opacity", "254": "stroke", "255": "stroke-dasharray", "256": "stroke-dashoffset", "257": "stroke-linecap", "258": "stroke-linejoin", "259": "stroke-miterlimit", "260": "stroke-opacity", "261": "stroke-width", "262": "tab-size", "263": "table-layout", "264": "text-align", "265": "text-align-last", "266": "text-anchor", "267": "text-decoration", "268": "text-decoration-color", "269": "text-decoration-line", "270": "text-decoration-skip-ink", "271": "text-decoration-style", "272": "text-emphasis-color", "273": "text-emphasis-position", "274": "text-emphasis-style", "275": "text-indent", "276": "text-overflow", "277": "text-rendering", "278": "text-shadow", "279": "text-size-adjust", "280": "text-transform", "281": "text-underline-position", "282": "top", "283": "touch-action", "284": "transform", "285": "transform-origin", "286": "transform-style", "287": "transition-delay", "288": "transition-duration", "289": "transition-property", "290": "transition-timing-function", "291": "translate", "292": "unicode-bidi", "293": "user-select", "294": "vector-effect", "295": "vertical-align", "296": "view-transition-name", "297": "visibility", "298": "white-space", "299": "widows", "300": "width", "301": "will-change", "302": "word-break", "303": "word-spacing", "304": "writing-mode", "305": "x", "306": "y", "307": "z-index", "308": "zoom", "309": "-webkit-border-horizontal-spacing", "310": "-webkit-border-image", "311": "-webkit-border-vertical-spacing", "312": "-webkit-box-align", "313": "-webkit-box-decoration-break", "314": "-webkit-box-direction", "315": "-webkit-box-flex", "316": "-webkit-box-ordinal-group", "317": "-webkit-box-orient", "318": "-webkit-box-pack", "319": "-webkit-box-reflect", "320": "-webkit-font-smoothing", "321": "-webkit-highlight", "322": "-webkit-line-break", "323": "-webkit-line-clamp", "324": "-webkit-locale", "325": "-webkit-mask-box-image", "326": "-webkit-mask-box-image-outset", "327": "-webkit-mask-box-image-repeat", "328": "-webkit-mask-box-image-slice", "329": "-webkit-mask-box-image-source", "330": "-webkit-mask-box-image-width", "331": "-webkit-mask-clip", "332": "-webkit-mask-composite", "333": "-webkit-mask-image", "334": "-webkit-mask-origin", "335": "-webkit-mask-position", "336": "-webkit-mask-repeat", "337": "-webkit-mask-size", "338": "-webkit-print-color-adjust", "339": "-webkit-rtl-ordering", "340": "-webkit-tap-highlight-color", "341": "-webkit-text-combine", "342": "-webkit-text-decorations-in-effect", "343": "-webkit-text-fill-color", "344": "-webkit-text-orientation", "345": "-webkit-text-security", "346": "-webkit-text-stroke-color", "347": "-webkit-text-stroke-width", "348": "-webkit-user-drag", "349": "-webkit-user-modify", "350": "-webkit-writing-mode", "accentColor": "auto", "additiveSymbols": "", "alignContent": "normal", "alignItems": "normal", "alignSelf": "auto", "alignmentBaseline": "auto", "all": "", "animation": "none 0s ease 0s 1 normal none running", "animationComposition": "replace", "animationDelay": "0s", "animationDirection": "normal", "animationDuration": "0s", "animationFillMode": "none", "animationIterationCount": "1", "animationName": "none", "animationPlayState": "running", "animationTimingFunction": "ease", "appRegion": "none", "appearance": "none", "ascentOverride": "", "aspectRatio": "auto", "backdropFilter": "none", "backfaceVisibility": "visible", "background": "rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box", "backgroundAttachment": "scroll", "backgroundBlendMode": "normal", "backgroundClip": "border-box", "backgroundColor": "rgba(0, 0, 0, 0)", "backgroundImage": "none", "backgroundOrigin": "padding-box", "backgroundPosition": "0% 0%", "backgroundPositionX": "0%", "backgroundPositionY": "0%", "backgroundRepeat": "repeat", "backgroundRepeatX": "repeat", "backgroundRepeatY": "repeat", "backgroundSize": "auto", "basePalette": "", "baselineShift": "0px", "baselineSource": "auto", "blockSize": "134px", "border": "0px none rgb(0, 0, 0)", "borderBlock": "0px none rgb(0, 0, 0)", "borderBlockColor": "rgb(0, 0, 0)", "borderBlockEnd": "0px none rgb(0, 0, 0)", "borderBlockEndColor": "rgb(0, 0, 0)", "borderBlockEndStyle": "none", "borderBlockEndWidth": "0px", "borderBlockStart": "0px none rgb(0, 0, 0)", "borderBlockStartColor": "rgb(0, 0, 0)", "borderBlockStartStyle": "none", "borderBlockStartWidth": "0px", "borderBlockStyle": "none", "borderBlockWidth": "0px", "borderBottom": "0px none rgb(0, 0, 0)", "borderBottomColor": "rgb(0, 0, 0)", "borderBottomLeftRadius": "0px", "borderBottomRightRadius": "0px", "borderBottomStyle": "none", "borderBottomWidth": "0px", "borderCollapse": "separate", "borderColor": "rgb(0, 0, 0)", "borderEndEndRadius": "0px", "borderEndStartRadius": "0px", "borderImage": "none", "borderImageOutset": "0", "borderImageRepeat": "stretch", "borderImageSlice": "100%", "borderImageSource": "none", "borderImageWidth": "1", "borderInline": "0px none rgb(0, 0, 0)", "borderInlineColor": "rgb(0, 0, 0)", "borderInlineEnd": "0px none rgb(0, 0, 0)", "borderInlineEndColor": "rgb(0, 0, 0)", "borderInlineEndStyle": "none", "borderInlineEndWidth": "0px", "borderInlineStart": "0px none rgb(0, 0, 0)", "borderInlineStartColor": "rgb(0, 0, 0)", "borderInlineStartStyle": "none", "borderInlineStartWidth": "0px", "borderInlineStyle": "none", "borderInlineWidth": "0px", "borderLeft": "0px none rgb(0, 0, 0)", "borderLeftColor": "rgb(0, 0, 0)", "borderLeftStyle": "none", "borderLeftWidth": "0px", "borderRadius": "0px", "borderRight": "0px none rgb(0, 0, 0)", "borderRightColor": "rgb(0, 0, 0)", "borderRightStyle": "none", "borderRightWidth": "0px", "borderSpacing": "0px 0px", "borderStartEndRadius": "0px", "borderStartStartRadius": "0px", "borderStyle": "none", "borderTop": "0px none rgb(0, 0, 0)", "borderTopColor": "rgb(0, 0, 0)", "borderTopLeftRadius": "0px", "borderTopRightRadius": "0px", "borderTopStyle": "none", "borderTopWidth": "0px", "borderWidth": "0px", "bottom": "auto", "boxShadow": "none", "boxSizing": "content-box", "breakAfter": "auto", "breakBefore": "auto", "breakInside": "auto", "bufferedRendering": "auto", "captionSide": "top", "caretColor": "rgb(0, 0, 0)", "clear": "none", "clip": "auto", "clipPath": "none", "clipRule": "nonzero", "color": "rgb(0, 0, 0)", "colorInterpolation": "srgb", "colorInterpolationFilters": "linearrgb", "colorRendering": "auto", "colorScheme": "normal", "columnCount": "auto", "columnFill": "balance", "columnGap": "normal", "columnRule": "0px none rgb(0, 0, 0)", "columnRuleColor": "rgb(0, 0, 0)", "columnRuleStyle": "none", "columnRuleWidth": "0px", "columnSpan": "none", "columnWidth": "auto", "columns": "auto auto", "contain": "none", "containIntrinsicBlockSize": "none", "containIntrinsicHeight": "none", "containIntrinsicInlineSize": "none", "containIntrinsicSize": "none", "containIntrinsicWidth": "none", "container": "none", "containerName": "none", "containerType": "normal", "content": "normal", "contentVisibility": "visible", "counterIncrement": "none", "counterReset": "none", "counterSet": "none", "cursor": "auto", "cx": "0px", "cy": "0px", "d": "none", "descentOverride": "", "direction": "ltr", "display": "block", "dominantBaseline": "auto", "emptyCells": "show", "fallback": "", "fill": "rgb(0, 0, 0)", "fillOpacity": "1", "fillRule": "nonzero", "filter": "none", "flex": "0 1 auto", "flexBasis": "auto", "flexDirection": "row", "flexFlow": "row nowrap", "flexGrow": "0", "flexShrink": "1", "flexWrap": "nowrap", "float": "none", "floodColor": "rgb(0, 0, 0)", "floodOpacity": "1", "font": "16px \"Times New Roman\"", "fontDisplay": "", "fontFamily": "\"Times New Roman\"", "fontFeatureSettings": "normal", "fontKerning": "auto", "fontOpticalSizing": "auto", "fontPalette": "normal", "fontSize": "16px", "fontStretch": "100%", "fontStyle": "normal", "fontSynthesis": "weight style small-caps", "fontSynthesisSmallCaps": "auto", "fontSynthesisStyle": "auto", "fontSynthesisWeight": "auto", "fontVariant": "normal", "fontVariantAlternates": "normal", "fontVariantCaps": "normal", "fontVariantEastAsian": "normal", "fontVariantLigatures": "normal", "fontVariantNumeric": "normal", "fontVariationSettings": "normal", "fontWeight": "400", "forcedColorAdjust": "auto", "gap": "normal", "grid": "none / none / none / row / auto / auto", "gridArea": "auto / auto / auto / auto", "gridAutoColumns": "auto", "gridAutoFlow": "row", "gridAutoRows": "auto", "gridColumn": "auto / auto", "gridColumnEnd": "auto", "gridColumnGap": "normal", "gridColumnStart": "auto", "gridGap": "normal normal", "gridRow": "auto / auto", "gridRowEnd": "auto", "gridRowGap": "normal", "gridRowStart": "auto", "gridTemplate": "none / none / none", "gridTemplateAreas": "none", "gridTemplateColumns": "none", "gridTemplateRows": "none", "height": "134px", "hyphenateCharacter": "auto", "hyphenateLimitChars": "auto", "hyphens": "manual", "imageOrientation": "from-image", "imageRendering": "auto", "inherits": "", "initialLetter": "normal", "initialValue": "", "inlineSize": "284px", "inset": "auto", "insetBlock": "auto", "insetBlockEnd": "auto", "insetBlockStart": "auto", "insetInline": "auto", "insetInlineEnd": "auto", "insetInlineStart": "auto", "isolation": "auto", "justifyContent": "normal", "justifyItems": "normal", "justifySelf": "auto", "left": "auto", "letterSpacing": "normal", "lightingColor": "rgb(255, 255, 255)", "lineBreak": "auto", "lineGapOverride": "", "lineHeight": "normal", "listStyle": "outside none disc", "listStyleImage": "none", "listStylePosition": "outside", "listStyleType": "disc", "margin": "8px", "marginBlock": "8px", "marginBlockEnd": "8px", "marginBlockStart": "8px", "marginBottom": "8px", "marginInline": "8px", "marginInlineEnd": "8px", "marginInlineStart": "8px", "marginLeft": "8px", "marginRight": "8px", "marginTop": "8px", "marker": "none", "markerEnd": "none", "markerMid": "none", "markerStart": "none", "mask": "none", "maskType": "luminance", "mathDepth": "0", "mathShift": "normal", "mathStyle": "normal", "maxBlockSize": "none", "maxHeight": "none", "maxInlineSize": "none", "maxWidth": "none", "minBlockSize": "0px", "minHeight": "0px", "minInlineSize": "0px", "minWidth": "0px", "mixBlendMode": "normal", "negative": "", "objectFit": "fill", "objectPosition": "50% 50%", "objectViewBox": "none", "offset": "none 0px auto 0deg", "offsetDistance": "0px", "offsetPath": "none", "offsetRotate": "auto 0deg", "opacity": "1", "order": "0", "orphans": "2", "outline": "rgb(0, 0, 0) none 0px", "outlineColor": "rgb(0, 0, 0)", "outlineOffset": "0px", "outlineStyle": "none", "outlineWidth": "0px", "overflow": "visible", "overflowAnchor": "auto", "overflowClipMargin": "0px", "overflowWrap": "normal", "overflowX": "visible", "overflowY": "visible", "overrideColors": "", "overscrollBehavior": "auto", "overscrollBehaviorBlock": "auto", "overscrollBehaviorInline": "auto", "overscrollBehaviorX": "auto", "overscrollBehaviorY": "auto", "pad": "", "padding": "0px", "paddingBlock": "0px", "paddingBlockEnd": "0px", "paddingBlockStart": "0px", "paddingBottom": "0px", "paddingInline": "0px", "paddingInlineEnd": "0px", "paddingInlineStart": "0px", "paddingLeft": "0px", "paddingRight": "0px", "paddingTop": "0px", "page": "auto", "pageBreakAfter": "auto", "pageBreakBefore": "auto", "pageBreakInside": "auto", "pageOrientation": "", "paintOrder": "normal", "perspective": "none", "perspectiveOrigin": "142px 67px", "placeContent": "normal", "placeItems": "normal", "placeSelf": "auto", "pointerEvents": "auto", "position": "static", "prefix": "", "quotes": "auto", "r": "0px", "range": "", "resize": "none", "right": "auto", "rotate": "none", "rowGap": "normal", "rubyPosition": "over", "rx": "auto", "ry": "auto", "scale": "none", "scrollBehavior": "auto", "scrollMargin": "0px", "scrollMarginBlock": "0px", "scrollMarginBlockEnd": "0px", "scrollMarginBlockStart": "0px", "scrollMarginBottom": "0px", "scrollMarginInline": "0px", "scrollMarginInlineEnd": "0px", "scrollMarginInlineStart": "0px", "scrollMarginLeft": "0px", "scrollMarginRight": "0px", "scrollMarginTop": "0px", "scrollPadding": "auto", "scrollPaddingBlock": "auto", "scrollPaddingBlockEnd": "auto", "scrollPaddingBlockStart": "auto", "scrollPaddingBottom": "auto", "scrollPaddingInline": "auto", "scrollPaddingInlineEnd": "auto", "scrollPaddingInlineStart": "auto", "scrollPaddingLeft": "auto", "scrollPaddingRight": "auto", "scrollPaddingTop": "auto", "scrollSnapAlign": "none", "scrollSnapStop": "normal", "scrollSnapType": "none", "scrollbarGutter": "auto", "shapeImageThreshold": "0", "shapeMargin": "0px", "shapeOutside": "none", "shapeRendering": "auto", "size": "", "sizeAdjust": "", "speak": "normal", "speakAs": "", "src": "", "stopColor": "rgb(0, 0, 0)", "stopOpacity": "1", "stroke": "none", "strokeDasharray": "none", "strokeDashoffset": "0px", "strokeLinecap": "butt", "strokeLinejoin": "miter", "strokeMiterlimit": "4", "strokeOpacity": "1", "strokeWidth": "1px", "suffix": "", "symbols": "", "syntax": "", "system": "", "tabSize": "8", "tableLayout": "auto", "textAlign": "start", "textAlignLast": "auto", "textAnchor": "start", "textCombineUpright": "none", "textDecoration": "none solid rgb(0, 0, 0)", "textDecorationColor": "rgb(0, 0, 0)", "textDecorationLine": "none", "textDecorationSkipInk": "auto", "textDecorationStyle": "solid", "textDecorationThickness": "auto", "textEmphasis": "none rgb(0, 0, 0)", "textEmphasisColor": "rgb(0, 0, 0)", "textEmphasisPosition": "over", "textEmphasisStyle": "none", "textIndent": "0px", "textOrientation": "mixed", "textOverflow": "clip", "textRendering": "auto", "textShadow": "none", "textSizeAdjust": "auto", "textTransform": "none", "textUnderlineOffset": "auto", "textUnderlinePosition": "auto", "top": "auto", "touchAction": "auto", "transform": "none", "transformBox": "view-box", "transformOrigin": "142px 67px", "transformStyle": "flat", "transition": "all 0s ease 0s", "transitionDelay": "0s", "transitionDuration": "0s", "transitionProperty": "all", "transitionTimingFunction": "ease", "translate": "none", "unicodeBidi": "normal", "unicodeRange": "", "userSelect": "auto", "vectorEffect": "none", "verticalAlign": "baseline", "viewTransitionName": "none", "visibility": "visible", "webkitAlignContent": "normal", "webkitAlignItems": "normal", "webkitAlignSelf": "auto", "webkitAnimation": "none 0s ease 0s 1 normal none running", "webkitAnimationDelay": "0s", "webkitAnimationDirection": "normal", "webkitAnimationDuration": "0s", "webkitAnimationFillMode": "none", "webkitAnimationIterationCount": "1", "webkitAnimationName": "none", "webkitAnimationPlayState": "running", "webkitAnimationTimingFunction": "ease", "webkitAppRegion": "none", "webkitAppearance": "none", "webkitBackfaceVisibility": "visible", "webkitBackgroundClip": "border-box", "webkitBackgroundOrigin": "padding-box", "webkitBackgroundSize": "auto", "webkitBorderAfter": "0px none rgb(0, 0, 0)", "webkitBorderAfterColor": "rgb(0, 0, 0)", "webkitBorderAfterStyle": "none", "webkitBorderAfterWidth": "0px", "webkitBorderBefore": "0px none rgb(0, 0, 0)", "webkitBorderBeforeColor": "rgb(0, 0, 0)", "webkitBorderBeforeStyle": "none", "webkitBorderBeforeWidth": "0px", "webkitBorderBottomLeftRadius": "0px", "webkitBorderBottomRightRadius": "0px", "webkitBorderEnd": "0px none rgb(0, 0, 0)", "webkitBorderEndColor": "rgb(0, 0, 0)", "webkitBorderEndStyle": "none", "webkitBorderEndWidth": "0px", "webkitBorderHorizontalSpacing": "0px", "webkitBorderImage": "none", "webkitBorderRadius": "0px", "webkitBorderStart": "0px none rgb(0, 0, 0)", "webkitBorderStartColor": "rgb(0, 0, 0)", "webkitBorderStartStyle": "none", "webkitBorderStartWidth": "0px", "webkitBorderTopLeftRadius": "0px", "webkitBorderTopRightRadius": "0px", "webkitBorderVerticalSpacing": "0px", "webkitBoxAlign": "stretch", "webkitBoxDecorationBreak": "slice", "webkitBoxDirection": "normal", "webkitBoxFlex": "0", "webkitBoxOrdinalGroup": "1", "webkitBoxOrient": "horizontal", "webkitBoxPack": "start", "webkitBoxReflect": "none", "webkitBoxShadow": "none", "webkitBoxSizing": "content-box", "webkitClipPath": "none", "webkitColumnBreakAfter": "auto", "webkitColumnBreakBefore": "auto", "webkitColumnBreakInside": "auto", "webkitColumnCount": "auto", "webkitColumnGap": "normal", "webkitColumnRule": "0px none rgb(0, 0, 0)", "webkitColumnRuleColor": "rgb(0, 0, 0)", "webkitColumnRuleStyle": "none", "webkitColumnRuleWidth": "0px", "webkitColumnSpan": "none", "webkitColumnWidth": "auto", "webkitColumns": "auto auto", "webkitFilter": "none", "webkitFlex": "0 1 auto", "webkitFlexBasis": "auto", "webkitFlexDirection": "row", "webkitFlexFlow": "row nowrap", "webkitFlexGrow": "0", "webkitFlexShrink": "1", "webkitFlexWrap": "nowrap", "webkitFontFeatureSettings": "normal", "webkitFontSmoothing": "auto", "webkitHighlight": "none", "webkitHyphenateCharacter": "auto", "webkitJustifyContent": "normal", "webkitLineBreak": "auto", "webkitLineClamp": "none", "webkitLocale": "auto", "webkitLogicalHeight": "134px", "webkitLogicalWidth": "284px", "webkitMarginAfter": "8px", "webkitMarginBefore": "8px", "webkitMarginEnd": "8px", "webkitMarginStart": "8px", "webkitMask": "", "webkitMaskBoxImage": "none", "webkitMaskBoxImageOutset": "0", "webkitMaskBoxImageRepeat": "stretch", "webkitMaskBoxImageSlice": "0 fill", "webkitMaskBoxImageSource": "none", "webkitMaskBoxImageWidth": "auto", "webkitMaskClip": "border-box", "webkitMaskComposite": "source-over", "webkitMaskImage": "none", "webkitMaskOrigin": "border-box", "webkitMaskPosition": "0% 0%", "webkitMaskPositionX": "0%", "webkitMaskPositionY": "0%", "webkitMaskRepeat": "repeat", "webkitMaskRepeatX": "", "webkitMaskRepeatY": "", "webkitMaskSize": "auto", "webkitMaxLogicalHeight": "none", "webkitMaxLogicalWidth": "none", "webkitMinLogicalHeight": "0px", "webkitMinLogicalWidth": "0px", "webkitOpacity": "1", "webkitOrder": "0", "webkitPaddingAfter": "0px", "webkitPaddingBefore": "0px", "webkitPaddingEnd": "0px", "webkitPaddingStart": "0px", "webkitPerspective": "none", "webkitPerspectiveOrigin": "142px 67px", "webkitPerspectiveOriginX": "", "webkitPerspectiveOriginY": "", "webkitPrintColorAdjust": "economy", "webkitRtlOrdering": "logical", "webkitRubyPosition": "before", "webkitShapeImageThreshold": "0", "webkitShapeMargin": "0px", "webkitShapeOutside": "none", "webkitTapHighlightColor": "rgba(0, 0, 0, 0.18)", "webkitTextCombine": "none", "webkitTextDecorationsInEffect": "none", "webkitTextEmphasis": "none rgb(0, 0, 0)", "webkitTextEmphasisColor": "rgb(0, 0, 0)", "webkitTextEmphasisPosition": "over", "webkitTextEmphasisStyle": "none", "webkitTextFillColor": "rgb(0, 0, 0)", "webkitTextOrientation": "vertical-right", "webkitTextSecurity": "none", "webkitTextSizeAdjust": "auto", "webkitTextStroke": "", "webkitTextStrokeColor": "rgb(0, 0, 0)", "webkitTextStrokeWidth": "0px", "webkitTransform": "none", "webkitTransformOrigin": "142px 67px", "webkitTransformOriginX": "", "webkitTransformOriginY": "", "webkitTransformOriginZ": "", "webkitTransformStyle": "flat", "webkitTransition": "all 0s ease 0s", "webkitTransitionDelay": "0s", "webkitTransitionDuration": "0s", "webkitTransitionProperty": "all", "webkitTransitionTimingFunction": "ease", "webkitUserDrag": "auto", "webkitUserModify": "read-only", "webkitUserSelect": "auto", "webkitWritingMode": "horizontal-tb", "whiteSpace": "normal", "widows": "2", "width": "284px", "willChange": "auto", "wordBreak": "normal", "wordSpacing": "0px", "wordWrap": "normal", "writingMode": "horizontal-tb", "x": "0px", "y": "0px", "zIndex": "auto", "zoom": "1", "cssText": "", "length": 351, "parentRule": null, "cssFloat": "none" }, "windowVersion": ["Object", "Function", "Array", "Number", "parseFloat", "parseInt", "Infinity", "NaN", "undefined", "Boolean", "String", "Symbol", "Date", "Promise", "RegExp", "Error", "AggregateError", "EvalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError", "globalThis", "JSON", "Math", "Intl", "ArrayBuffer", "Uint8Array", "Int8Array", "Uint16Array", "Int16Array", "Uint32Array", "Int32Array", "Float32Array", "Float64Array", "Uint8ClampedArray", "BigUint64Array", "BigInt64Array", "DataView", "Map", "BigInt", "Set", "WeakMap", "WeakSet", "Proxy", "Reflect", "FinalizationRegistry", "WeakRef", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "escape", "unescape", "eval", "isFinite", "isNaN", "console", "Option", "Image", "Audio", "webkitURL", "webkitRTCPeerConnection", "webkitMediaStream", "WebKitMutationObserver", "WebKitCSSMatrix", "XSLTProcessor", "XPathResult", "XPathExpression", "XPathEvaluator", "XMLSerializer", "XMLHttpRequestUpload", "XMLHttpRequestEventTarget", "XMLHttpRequest", "XMLDocument", "WritableStreamDefaultWriter", "WritableStreamDefaultController", "WritableStream", "Worker", "Window", "WheelEvent", "WebSocket", "WebGLVertexArrayObject", "WebGLUniformLocation", "WebGLTransformFeedback", "WebGLTexture", "WebGLSync", "WebGLShaderPrecisionFormat", "WebGLShader", "WebGLSampler", "WebGLRenderingContext", "WebGLRenderbuffer", "WebGLQuery", "WebGLProgram", "WebGLFramebuffer", "WebGLContextEvent", "WebGLBuffer", "WebGLActiveInfo", "WebGL2RenderingContext", "WaveShaperNode", "VisualViewport", "VirtualKeyboardGeometryChangeEvent", "ValidityState", "VTTCue", "UserActivation", "URLSearchParams", "URLPattern", "URL", "UIEvent", "TrustedTypePolicyFactory", "TrustedTypePolicy", "TrustedScriptURL", "TrustedScript", "TrustedHTML", "TreeWalker", "TransitionEvent", "TransformStreamDefaultController", "TransformStream", "TrackEvent", "TouchList", "TouchEvent", "Touch", "TimeRanges", "TextTrackList", "TextTrackCueList", "TextTrackCue", "TextTrack", "TextMetrics", "TextEvent", "TextEncoderStream", "TextEncoder", "TextDecoderStream", "TextDecoder", "Text", "TaskSignal", "TaskPriorityChangeEvent", "TaskController", "TaskAttributionTiming", "SyncManager", "SubmitEvent", "StyleSheetList", "StyleSheet", "StylePropertyMapReadOnly", "StylePropertyMap", "StorageEvent", "Storage", "StereoPannerNode", "StaticRange", "ShadowRoot", "Selection", "SecurityPolicyViolationEvent", "ScriptProcessorNode", "ScreenOrientation", "Screen", "Scheduling", "Scheduler", "SVGViewElement", "SVGUseElement", "SVGUnitTypes", "SVGTransformList", "SVGTransform", "SVGTitleElement", "SVGTextPositioningElement", "SVGTextPathElement", "SVGTextElement", "SVGTextContentElement", "SVGTSpanElement", "SVGSymbolElement", "SVGSwitchElement", "SVGStyleElement", "SVGStringList", "SVGStopElement", "SVGSetElement", "SVGScriptElement", "SVGSVGElement", "SVGRectElement", "SVGRect", "SVGRadialGradientElement", "SVGPreserveAspectRatio", "SVGPolylineElement", "SVGPolygonElement", "SVGPointList", "SVGPoint", "SVGPatternElement", "SVGPathElement", "SVGNumberList", "SVGNumber", "SVGMetadataElement", "SVGMatrix", "SVGMaskElement", "SVGMarkerElement", "SVGMPathElement", "SVGLinearGradientElement", "SVGLineElement", "SVGLengthList", "SVGLength", "SVGImageElement", "SVGGraphicsElement", "SVGGradientElement", "SVGGeometryElement", "SVGGElement", "SVGForeignObjectElement", "SVGFilterElement", "SVGFETurbulenceElement", "SVGFETileElement", "SVGFESpotLightElement", "SVGFESpecularLightingElement", "SVGFEPointLightElement", "SVGFEOffsetElement", "SVGFEMorphologyElement", "SVGFEMergeNodeElement", "SVGFEMergeElement", "SVGFEImageElement", "SVGFEGaussianBlurElement", "SVGFEFuncRElement", "SVGFEFuncGElement", "SVGFEFuncBElement", "SVGFEFuncAElement", "SVGFEFloodElement", "SVGFEDropShadowElement", "SVGFEDistantLightElement", "SVGFEDisplacementMapElement", "SVGFEDiffuseLightingElement", "SVGFEConvolveMatrixElement", "SVGFECompositeElement", "SVGFEComponentTransferElement", "SVGFEColorMatrixElement", "SVGFEBlendElement", "SVGEllipseElement", "SVGElement", "SVGDescElement", "SVGDefsElement", "SVGComponentTransferFunctionElement", "SVGClipPathElement", "SVGCircleElement", "SVGAnimationElement", "SVGAnimatedTransformList", "SVGAnimatedString", "SVGAnimatedRect", "SVGAnimatedPreserveAspectRatio", "SVGAnimatedNumberList", "SVGAnimatedNumber", "SVGAnimatedLengthList", "SVGAnimatedLength", "SVGAnimatedInteger", "SVGAnimatedEnumeration", "SVGAnimatedBoolean", "SVGAnimatedAngle", "SVGAnimateTransformElement", "SVGAnimateMotionElement", "SVGAnimateElement", "SVGAngle", "SVGAElement", "Response", "ResizeObserverSize", "ResizeObserverEntry", "ResizeObserver", "Request", "ReportingObserver", "ReadableStreamDefaultReader", "ReadableStreamDefaultController", "ReadableStreamBYOBRequest", "ReadableStreamBYOBReader", "ReadableStream", "ReadableByteStreamController", "Range", "RadioNodeList", "RTCTrackEvent", "RTCStatsReport", "RTCSessionDescription", "RTCSctpTransport", "RTCRtpTransceiver", "RTCRtpSender", "RTCRtpReceiver", "RTCPeerConnectionIceEvent", "RTCPeerConnectionIceErrorEvent", "RTCPeerConnection", "RTCIceTransport", "RTCIceCandidate", "RTCErrorEvent", "RTCError", "RTCEncodedVideoFrame", "RTCEncodedAudioFrame", "RTCDtlsTransport", "RTCDataChannelEvent", "RTCDataChannel", "RTCDTMFToneChangeEvent", "RTCDTMFSender", "RTCCertificate", "PromiseRejectionEvent", "ProgressEvent", "Profiler", "ProcessingInstruction", "PopStateEvent", "PointerEvent", "PluginArray", "Plugin", "PictureInPictureWindow", "PictureInPictureEvent", "PeriodicWave", "PerformanceTiming", "PerformanceServerTiming", "PerformanceResourceTiming", "PerformancePaintTiming", "PerformanceObserverEntryList", "PerformanceObserver", "PerformanceNavigationTiming", "PerformanceNavigation", "PerformanceMeasure", "PerformanceMark", "PerformanceLongTaskTiming", "PerformanceEventTiming", "PerformanceEntry", "PerformanceElementTiming", "Performance", "Path2D", "PannerNode", "PageTransitionEvent", "OverconstrainedError", "OscillatorNode", "OffscreenCanvasRenderingContext2D", "OffscreenCanvas", "OfflineAudioContext", "OfflineAudioCompletionEvent", "NodeList", "NodeIterator", "NodeFilter", "Node", "NetworkInformation", "Navigator", "NavigationTransition", "NavigationHistoryEntry", "NavigationDestination", "NavigationCurrentEntryChangeEvent", "Navigation", "NavigateEvent", "NamedNodeMap", "MutationRecord", "MutationObserver", "MutationEvent", "MouseEvent", "MimeTypeArray", "MimeType", "MessagePort", "MessageEvent", "MessageChannel", "MediaStreamTrackProcessor", "MediaStreamTrackGenerator", "MediaStreamTrackEvent", "MediaStreamTrack", "MediaStreamEvent", "MediaStreamAudioSourceNode", "MediaStreamAudioDestinationNode", "MediaStream", "MediaRecorder", "MediaQueryListEvent", "MediaQueryList", "MediaList", "MediaError", "MediaEncryptedEvent", "MediaElementAudioSourceNode", "MediaCapabilities", "Location", "LayoutShiftAttribution", "LayoutShift", "LargestContentfulPaint", "KeyframeEffect", "KeyboardEvent", "IntersectionObserverEntry", "IntersectionObserver", "InputEvent", "InputDeviceInfo", "InputDeviceCapabilities", "ImageData", "ImageCapture", "ImageBitmapRenderingContext", "ImageBitmap", "IdleDeadline", "IIRFilterNode", "IDBVersionChangeEvent", "IDBTransaction", "IDBRequest", "IDBOpenDBRequest", "IDBObjectStore", "IDBKeyRange", "IDBIndex", "IDBFactory", "IDBDatabase", "IDBCursorWithValue", "IDBCursor", "History", "Headers", "HashChangeEvent", "HTMLVideoElement", "HTMLUnknownElement", "HTMLUListElement", "HTMLTrackElement", "HTMLTitleElement", "HTMLTimeElement", "HTMLTextAreaElement", "HTMLTemplateElement", "HTMLTableSectionElement", "HTMLTableRowElement", "HTMLTableElement", "HTMLTableColElement", "HTMLTableCellElement", "HTMLTableCaptionElement", "HTMLStyleElement", "HTMLSpanElement", "HTMLSourceElement", "HTMLSlotElement", "HTMLSelectElement", "HTMLScriptElement", "HTMLQuoteElement", "HTMLProgressElement", "HTMLPreElement", "HTMLPictureElement", "HTMLParamElement", "HTMLParagraphElement", "HTMLOutputElement", "HTMLOptionsCollection", "HTMLOptionElement", "HTMLOptGroupElement", "HTMLObjectElement", "HTMLOListElement", "HTMLModElement", "HTMLMeterElement", "HTMLMetaElement", "HTMLMenuElement", "HTMLMediaElement", "HTMLMarqueeElement", "HTMLMapElement", "HTMLLinkElement", "HTMLLegendElement", "HTMLLabelElement", "HTMLLIElement", "HTMLInputElement", "HTMLImageElement", "HTMLIFrameElement", "HTMLHtmlElement", "HTMLHeadingElement", "HTMLHeadElement", "HTMLHRElement", "HTMLFrameSetElement", "HTMLFrameElement", "HTMLFormElement", "HTMLFormControlsCollection", "HTMLFontElement", "HTMLFieldSetElement", "HTMLEmbedElement", "HTMLElement", "HTMLDocument", "HTMLDivElement", "HTMLDirectoryElement", "HTMLDialogElement", "HTMLDetailsElement", "HTMLDataListElement", "HTMLDataElement", "HTMLDListElement", "HTMLCollection", "HTMLCanvasElement", "HTMLButtonElement", "HTMLBodyElement", "HTMLBaseElement", "HTMLBRElement", "HTMLAudioElement", "HTMLAreaElement", "HTMLAnchorElement", "HTMLAllCollection", "GeolocationPositionError", "GeolocationPosition", "GeolocationCoordinates", "Geolocation", "GamepadHapticActuator", "GamepadEvent", "GamepadButton", "Gamepad", "GainNode", "FormDataEvent", "FormData", "FontFaceSetLoadEvent", "FontFace", "FocusEvent", "FileReader", "FileList", "File", "FeaturePolicy", "External", "EventTarget", "EventSource", "EventCounts", "Event", "ErrorEvent", "ElementInternals", "Element", "DynamicsCompressorNode", "DragEvent", "DocumentType", "DocumentFragment", "Document", "DelayNode", "DecompressionStream", "DataTransferItemList", "DataTransferItem", "DataTransfer", "DOMTokenList", "DOMStringMap", "DOMStringList", "DOMRectReadOnly", "DOMRectList", "DOMRect", "DOMQuad", "DOMPointReadOnly", "DOMPoint", "DOMParser", "DOMMatrixReadOnly", "DOMMatrix", "DOMImplementation", "DOMException", "DOMError", "CustomStateSet", "CustomEvent", "CustomElementRegistry", "Crypto", "CountQueuingStrategy", "ConvolverNode", "ConstantSourceNode", "CompressionStream", "CompositionEvent", "Comment", "CloseEvent", "ClipboardEvent", "CharacterData", "ChannelSplitterNode", "ChannelMergerNode", "CanvasRenderingContext2D", "CanvasPattern", "CanvasGradient", "CanvasCaptureMediaStreamTrack", "CSSVariableReferenceValue", "CSSUnparsedValue", "CSSUnitValue", "CSSTranslate", "CSSTransformValue", "CSSTransformComponent", "CSSSupportsRule", "CSSStyleValue", "CSSStyleSheet", "CSSStyleRule", "CSSStyleDeclaration", "CSSSkewY", "CSSSkewX", "CSSSkew", "CSSScale", "CSSRuleList", "CSSRule", "CSSRotate", "CSSPropertyRule", "CSSPositionValue", "CSSPerspective", "CSSPageRule", "CSSNumericValue", "CSSNumericArray", "CSSNamespaceRule", "CSSMediaRule", "CSSMatrixComponent", "CSSMathValue", "CSSMathSum", "CSSMathProduct", "CSSMathNegate", "CSSMathMin", "CSSMathMax", "CSSMathInvert", "CSSMathClamp", "CSSLayerStatementRule", "CSSLayerBlockRule", "CSSKeywordValue", "CSSKeyframesRule", "CSSKeyframeRule", "CSSImportRule", "CSSImageValue", "CSSGroupingRule", "CSSFontPaletteValuesRule", "CSSFontFaceRule", "CSSCounterStyleRule", "CSSContainerRule", "CSSConditionRule", "CSS", "CDATASection", "ByteLengthQueuingStrategy", "BroadcastChannel", "BlobEvent", "Blob", "BiquadFilterNode", "BeforeUnloadEvent", "BeforeInstallPromptEvent", "BaseAudioContext", "BarProp", "AudioWorkletNode", "AudioSinkInfo", "AudioScheduledSourceNode", "AudioProcessingEvent", "AudioParamMap", "AudioParam", "AudioNode", "AudioListener", "AudioDestinationNode", "AudioContext", "AudioBufferSourceNode", "AudioBuffer", "Attr", "AnimationEvent", "AnimationEffect", "Animation", "AnalyserNode", "AbstractRange", "AbortSignal", "AbortController", "window", "self", "document", "name", "location", "customElements", "history", "navigation", "locationbar", "menubar", "personalbar", "scrollbars", "statusbar", "toolbar", "status", "closed", "frames", "length", "top", "opener", "parent", "frameElement", "navigator", "origin", "external", "screen", "innerWidth", "innerHeight", "scrollX", "pageXOffset", "scrollY", "pageYOffset", "visualViewport", "screenX", "screenY", "outerWidth", "outerHeight", "devicePixelRatio", "event", "clientInformation", "offscreenBuffering", "screenLeft", "screenTop", "styleMedia", "onsearch", "isSecureContext", "trustedTypes", "performance", "onappinstalled", "onbeforeinstallprompt", "crypto", "indexedDB", "sessionStorage", "localStorage", "onbeforexrselect", "onabort", "onbeforeinput", "onblur", "oncancel", "oncanplay", "oncanplaythrough", "onchange", "onclick", "onclose", "oncontextlost", "oncontextmenu", "oncontextrestored", "oncuechange", "ondblclick", "ondrag", "ondragend", "ondragenter", "ondragleave", "ondragover", "ondragstart", "ondrop", "ondurationchange", "onemptied", "onended", "onerror", "onfocus", "onformdata", "oninput", "oninvalid", "onkeydown", "onkeypress", "onkeyup", "onload", "onloadeddata", "onloadedmetadata", "onloadstart", "onmousedown", "onmouseenter", "onmouseleave", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onmousewheel", "onpause", "onplay", "onplaying", "onprogress", "onratechange", "onreset", "onresize", "onscroll", "onsecuritypolicyviolation", "onseeked", "onseeking", "onselect", "onslotchange", "onstalled", "onsubmit", "onsuspend", "ontimeupdate", "ontoggle", "onvolumechange", "onwaiting", "onwebkitanimationend", "onwebkitanimationiteration", "onwebkitanimationstart", "onwebkittransitionend", "onwheel", "onauxclick", "ongotpointercapture", "onlostpointercapture", "onpointerdown", "onpointermove", "onpointerrawupdate", "onpointerup", "onpointercancel", "onpointerover", "onpointerout", "onpointerenter", "onpointerleave", "onselectstart", "onselectionchange", "onanimationend", "onanimationiteration", "onanimationstart", "ontransitionrun", "ontransitionstart", "ontransitionend", "ontransitioncancel", "onafterprint", "onbeforeprint", "onbeforeunload", "onhashchange", "onlanguagechange", "onmessage", "onmessageerror", "onoffline", "ononline", "onpagehide", "onpageshow", "onpopstate", "onrejectionhandled", "onstorage", "onunhandledrejection", "onunload", "crossOriginIsolated", "scheduler", "alert", "atob", "blur", "btoa", "cancelAnimationFrame", "cancelIdleCallback", "captureEvents", "clearInterval", "clearTimeout", "close", "confirm", "createImageBitmap", "fetch", "find", "focus", "getComputedStyle", "getSelection", "matchMedia", "moveBy", "moveTo", "open", "postMessage", "print", "prompt", "queueMicrotask", "releaseEvents", "reportError", "requestAnimationFrame", "requestIdleCallback", "resizeBy", "resizeTo", "scroll", "scrollBy", "scrollTo", "setInterval", "setTimeout", "stop", "structuredClone", "webkitCancelAnimationFrame", "webkitRequestAnimationFrame", "Atomics", "chrome", "WebAssembly", "credentialless", "caches", "cookieStore", "ondevicemotion", "ondeviceorientation", "ondeviceorientationabsolute", "launchQueue", "onbeforematch", "AbsoluteOrientationSensor", "Accelerometer", "AudioWorklet", "BatteryManager", "Cache", "CacheStorage", "Clipboard", "ClipboardItem", "CookieChangeEvent", "CookieStore", "CookieStoreManager", "Credential", "CredentialsContainer", "CryptoKey", "DeviceMotionEvent", "DeviceMotionEventAcceleration", "DeviceMotionEventRotationRate", "DeviceOrientationEvent", "FederatedCredential", "GravitySensor", "Gyroscope", "Keyboard", "KeyboardLayoutMap", "LinearAccelerationSensor", "Lock", "LockManager", "MIDIAccess", "MIDIConnectionEvent", "MIDIInput", "MIDIInputMap", "MIDIMessageEvent", "MIDIOutput", "MIDIOutputMap", "MIDIPort", "MediaDeviceInfo", "MediaDevices", "MediaKeyMessageEvent", "MediaKeySession", "MediaKeyStatusMap", "MediaKeySystemAccess", "MediaKeys", "NavigationPreloadManager", "NavigatorManagedData", "OrientationSensor", "PasswordCredential", "RelativeOrientationSensor", "Sanitizer", "ScreenDetailed", "ScreenDetails", "Sensor", "SensorErrorEvent", "ServiceWorker", "ServiceWorkerContainer", "ServiceWorkerRegistration", "StorageManager", "SubtleCrypto", "VirtualKeyboard", "WebTransport", "WebTransportBidirectionalStream", "WebTransportDatagramDuplexStream", "WebTransportError", "Worklet", "XRDOMOverlayState", "XRLayer", "XRWebGLBinding", "AudioData", "EncodedAudioChunk", "EncodedVideoChunk", "ImageTrack", "ImageTrackList", "VideoColorSpace", "VideoFrame", "AudioDecoder", "AudioEncoder", "ImageDecoder", "VideoDecoder", "VideoEncoder", "AuthenticatorAssertionResponse", "AuthenticatorAttestationResponse", "AuthenticatorResponse", "PublicKeyCredential", "Bluetooth", "BluetoothCharacteristicProperties", "BluetoothDevice", "BluetoothRemoteGATTCharacteristic", "BluetoothRemoteGATTDescriptor", "BluetoothRemoteGATTServer", "BluetoothRemoteGATTService", "CaptureController", "EyeDropper", "FileSystemDirectoryHandle", "FileSystemFileHandle", "FileSystemHandle", "FileSystemWritableFileStream", "FontData", "FragmentDirective", "GPU", "GPUAdapter", "GPUAdapterInfo", "GPUBindGroup", "GPUBindGroupLayout", "GPUBuffer", "GPUBufferUsage", "GPUCanvasContext", "GPUColorWrite", "GPUCommandBuffer", "GPUCommandEncoder", "GPUCompilationInfo", "GPUCompilationMessage", "GPUComputePassEncoder", "GPUComputePipeline", "GPUDevice", "GPUDeviceLostInfo", "GPUError", "GPUExternalTexture", "GPUInternalError", "GPUMapMode", "GPUOutOfMemoryError", "GPUPipelineError", "GPUPipelineLayout", "GPUQuerySet", "GPUQueue", "GPURenderBundle", "GPURenderBundleEncoder", "GPURenderPassEncoder", "GPURenderPipeline", "GPUSampler", "GPUShaderModule", "GPUShaderStage", "GPUSupportedFeatures", "GPUSupportedLimits", "GPUTexture", "GPUTextureUsage", "GPUTextureView", "GPUUncapturedErrorEvent", "GPUValidationError", "HID", "HIDConnectionEvent", "HIDDevice", "HIDInputReportEvent", "IdentityCredential", "IdleDetector", "LaunchParams", "LaunchQueue", "OTPCredential", "PaymentAddress", "PaymentRequest", "PaymentResponse", "PaymentMethodChangeEvent", "Presentation", "PresentationAvailability", "PresentationConnection", "PresentationConnectionAvailableEvent", "PresentationConnectionCloseEvent", "PresentationConnectionList", "PresentationReceiver", "PresentationRequest", "Serial", "SerialPort", "USB", "USBAlternateInterface", "USBConfiguration", "USBConnectionEvent", "USBDevice", "USBEndpoint", "USBInTransferResult", "USBInterface", "USBIsochronousInTransferPacket", "USBIsochronousInTransferResult", "USBIsochronousOutTransferPacket", "USBIsochronousOutTransferResult", "USBOutTransferResult", "WakeLock", "WakeLockSentinel", "WindowControlsOverlay", "WindowControlsOverlayGeometryChangeEvent", "XRAnchor", "XRAnchorSet", "XRBoundedReferenceSpace", "XRCPUDepthInformation", "XRCamera", "XRDepthInformation", "XRFrame", "XRHitTestResult", "XRHitTestSource", "XRInputSource", "XRInputSourceArray", "XRInputSourceEvent", "XRInputSourcesChangeEvent", "XRLightEstimate", "XRLightProbe", "XRPose", "XRRay", "XRReferenceSpace", "XRReferenceSpaceEvent", "XRRenderState", "XRRigidTransform", "XRSession", "XRSessionEvent", "XRSpace", "XRSystem", "XRTransientInputHitTestResult", "XRTransientInputHitTestSource", "XRView", "XRViewerPose", "XRViewport", "XRWebGLDepthInformation", "XRWebGLLayer", "getScreenDetails", "queryLocalFonts", "showDirectoryPicker", "showOpenFilePicker", "showSaveFilePicker", "originAgentCluster", "speechSynthesis", "oncontentvisibilityautostatechange", "AnimationPlaybackEvent", "AnimationTimeline", "CSSAnimation", "CSSTransition", "DocumentTimeline", "BackgroundFetchManager", "BackgroundFetchRecord", "BackgroundFetchRegistration", "BluetoothUUID", "BrowserCaptureMediaStreamTrack", "CropTarget", "ContentVisibilityAutoStateChangeEvent", "DelegatedInkTrailPresenter", "Ink", "Highlight", "HighlightRegistry", "MathMLElement", "MediaMetadata", "MediaSession", "MediaSource", "SourceBuffer", "SourceBufferList", "MediaSourceHandle", "NavigatorUAData", "Notification", "PaymentManager", "PaymentRequestUpdateEvent", "PeriodicSyncManager", "PermissionStatus", "Permissions", "PushManager", "PushSubscription", "PushSubscriptionOptions", "RemotePlayback", "SharedWorker", "SpeechSynthesisErrorEvent", "SpeechSynthesisEvent", "SpeechSynthesisUtterance", "VideoPlaybackQuality", "ViewTransition", "webkitSpeechGrammar", "webkitSpeechGrammarList", "webkitSpeechRecognition", "webkitSpeechRecognitionError", "webkitSpeechRecognitionEvent", "openDatabase", "webkitRequestFileSystem", "webkitResolveLocalFileSystemURL", "download"], "htmlElementVersion": ["version", "title", "lang", "translate", "dir", "hidden", "accessKey", "draggable", "spellcheck", "autocapitalize", "contentEditable", "enterKeyHint", "isContentEditable", "inputMode", "virtualKeyboardPolicy", "offsetParent", "offsetTop", "offsetLeft", "offsetWidth", "offsetHeight", "innerText", "outerText", "onbeforexrselect", "onabort", "onbeforeinput", "onblur", "oncancel", "oncanplay", "oncanplaythrough", "onchange", "onclick", "onclose", "oncontextlost", "oncontextmenu", "oncontextrestored", "oncuechange", "ondblclick", "ondrag", "ondragend", "ondragenter", "ondragleave", "ondragover", "ondragstart", "ondrop", "ondurationchange", "onemptied", "onended", "onerror", "onfocus", "onformdata", "oninput", "oninvalid", "onkeydown", "onkeypress", "onkeyup", "onload", "onloadeddata", "onloadedmetadata", "onloadstart", "onmousedown", "onmouseenter", "onmouseleave", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onmousewheel", "onpause", "onplay", "onplaying", "onprogress", "onratechange", "onreset", "onresize", "onscroll", "onsecuritypolicyviolation", "onseeked", "onseeking", "onselect", "onslotchange", "onstalled", "onsubmit", "onsuspend", "ontimeupdate", "ontoggle", "onvolumechange", "onwaiting", "onwebkitanimationend", "onwebkitanimationiteration", "onwebkitanimationstart", "onwebkittransitionend", "onwheel", "onauxclick", "ongotpointercapture", "onlostpointercapture", "onpointerdown", "onpointermove", "onpointerrawupdate", "onpointerup", "onpointercancel", "onpointerover", "onpointerout", "onpointerenter", "onpointerleave", "onselectstart", "onselectionchange", "onanimationend", "onanimationiteration", "onanimationstart", "ontransitionrun", "ontransitionstart", "ontransitionend", "ontransitioncancel", "oncopy", "oncut", "onpaste", "dataset", "nonce", "autofocus", "tabIndex", "style", "attributeStyleMap", "attachInternals", "blur", "click", "focus", "inert", "oncontentvisibilityautostatechange", "onbeforematch", "namespaceURI", "prefix", "localName", "tagName", "id", "className", "classList", "slot", "attributes", "shadowRoot", "part", "assignedSlot", "innerHTML", "outerHTML", "scrollTop", "scrollLeft", "scrollWidth", "scrollHeight", "clientTop", "clientLeft", "clientWidth", "clientHeight", "onbeforecopy", "onbeforecut", "onbeforepaste", "onsearch", "elementTiming", "onfullscreenchange", "onfullscreenerror", "onwebkitfullscreenchange", "onwebkitfullscreenerror", "role", "ariaAtomic", "ariaAutoComplete", "ariaBusy", "ariaBrailleLabel", "ariaBrailleRoleDescription", "ariaChecked", "ariaColCount", "ariaColIndex", "ariaColSpan", "ariaCurrent", "ariaDescription", "ariaDisabled", "ariaExpanded", "ariaHasPopup", "ariaHidden", "ariaInvalid", "ariaKeyShortcuts", "ariaLabel", "ariaLevel", "ariaLive", "ariaModal", "ariaMultiLine", "ariaMultiSelectable", "ariaOrientation", "ariaPlaceholder", "ariaPosInSet", "ariaPressed", "ariaReadOnly", "ariaRelevant", "ariaRequired", "ariaRoleDescription", "ariaRowCount", "ariaRowIndex", "ariaRowSpan", "ariaSelected", "ariaSetSize", "ariaSort", "ariaValueMax", "ariaValueMin", "ariaValueNow", "ariaValueText", "children", "firstElementChild", "lastElementChild", "childElementCount", "previousElementSibling", "nextElementSibling", "after", "animate", "append", "attachShadow", "before", "closest", "computedStyleMap", "getAttribute", "getAttributeNS", "getAttributeNames", "getAttributeNode", "getAttributeNodeNS", "getBoundingClientRect", "getClientRects", "getElementsByClassName", "getElementsByTagName", "getElementsByTagNameNS", "getInnerHTML", "hasAttribute", "hasAttributeNS", "hasAttributes", "hasPointerCapture", "insertAdjacentElement", "insertAdjacentHTML", "insertAdjacentText", "matches", "prepend", "querySelector", "querySelectorAll", "releasePointerCapture", "remove", "removeAttribute", "removeAttributeNS", "removeAttributeNode", "replaceChildren", "replaceWith", "requestFullscreen", "requestPointerLock", "scroll", "scrollBy", "scrollIntoView", "scrollIntoViewIfNeeded", "scrollTo", "setAttribute", "setAttributeNS", "setAttributeNode", "setAttributeNodeNS", "setPointerCapture", "toggleAttribute", "webkitMatchesSelector", "webkitRequestFullScreen", "webkitRequestFullscreen", "checkVisibility", "getAnimations", "setHTML", "nodeType", "nodeName", "baseURI", "isConnected", "ownerDocument", "parentNode", "parentElement", "childNodes", "firstChild", "lastChild", "previousSibling", "nextSibling", "nodeValue", "textContent", "ELEMENT_NODE", "ATTRIBUTE_NODE", "TEXT_NODE", "CDATA_SECTION_NODE", "ENTITY_REFERENCE_NODE", "ENTITY_NODE", "PROCESSING_INSTRUCTION_NODE", "COMMENT_NODE", "DOCUMENT_NODE", "DOCUMENT_TYPE_NODE", "DOCUMENT_FRAGMENT_NODE", "NOTATION_NODE", "DOCUMENT_POSITION_DISCONNECTED", "DOCUMENT_POSITION_PRECEDING", "DOCUMENT_POSITION_FOLLOWING", "DOCUMENT_POSITION_CONTAINS", "DOCUMENT_POSITION_CONTAINED_BY", "DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC", "appendChild", "cloneNode", "compareDocumentPosition", "contains", "getRootNode", "hasChildNodes", "insertBefore", "isDefaultNamespace", "isEqualNode", "isSameNode", "lookupNamespaceURI", "lookupPrefix", "normalize", "removeChild", "replaceChild", "addEventListener", "dispatchEvent", "removeEventListener"], "webgl": { "supportedExtensions": ["EXT_color_buffer_float", "EXT_color_buffer_half_float", "EXT_disjoint_timer_query_webgl2", "EXT_float_blend", "EXT_texture_compression_bptc", "EXT_texture_compression_rgtc", "EXT_texture_filter_anisotropic", "EXT_texture_norm16", "KHR_parallel_shader_compile", "OES_draw_buffers_indexed", "OES_texture_float_linear", "OVR_multiview2", "WEBGL_compressed_texture_s3tc", "WEBGL_compressed_texture_s3tc_srgb", "WEBGL_debug_renderer_info", "WEBGL_debug_shaders", "WEBGL_lose_context", "WEBGL_multi_draw", "WEBGL_provoking_vertex"], "contextAttributes": { "alpha": true, "antialias": true, "depth": true, "desynchronized": false, "failIfMajorPerformanceCaveat": false, "powerPreference": "default", "premultipliedAlpha": true, "preserveDrawingBuffer": false, "stencil": false, "xrCompatible": false }, "maxAnisotropy": 16, "params": { "2849": { "type": "Number", "value": 1 }, "2884": { "type": "", "value": false }, "2885": { "type": "Number", "value": 1029 }, "2886": { "type": "Number", "value": 2305 }, "2928": { "type": "Float32Array", "value": { "0": 0, "1": 1 } }, "2929": { "type": "", "value": false }, "2930": { "type": "Boolean", "value": true }, "2931": { "type": "Number", "value": 1 }, "2932": { "type": "Number", "value": 513 }, "2960": { "type": "", "value": false }, "2961": { "type": "", "value": 0 }, "2962": { "type": "Number", "value": 519 }, "2963": { "type": "Number", "value": 2147483647 }, "2964": { "type": "Number", "value": 7680 }, "2965": { "type": "Number", "value": 7680 }, "2966": { "type": "Number", "value": 7680 }, "2967": { "type": "", "value": 0 }, "2968": { "type": "Number", "value": 2147483647 }, "2978": { "type": "Int32Array", "value": { "0": 0, "1": 0, "2": 300, "3": 150 } }, "3024": { "type": "Boolean", "value": true }, "3042": { "type": "", "value": false }, "3088": { "type": "Int32Array", "value": { "0": 0, "1": 0, "2": 300, "3": 150 } }, "3089": { "type": "", "value": false }, "3106": { "type": "Float32Array", "value": { "0": 0, "1": 0, "2": 0, "3": 0 } }, "3107": { "type": "Array", "value": [true, true, true, true] }, "3317": { "type": "Number", "value": 4 }, "3333": { "type": "Number", "value": 4 }, "3379": { "type": "Number", "value": 16384 }, "3386": { "type": "Int32Array", "value": { "0": 32767, "1": 32767 } }, "3408": { "type": "Number", "value": 4 }, "3410": { "type": "", "value": null }, "3411": { "type": "", "value": null }, "3412": { "type": "", "value": null }, "3413": { "type": "", "value": null }, "3414": { "type": "", "value": null }, "3415": { "type": "", "value": 0 }, "7936": { "type": "String", "value": "WebKit" }, "7937": { "type": "String", "value": "WebKit WebGL" }, "7938": { "type": "String", "value": "WebGL 2.0 (OpenGL ES 3.0 Chromium)" }, "10752": { "type": "", "value": 0 }, "32773": { "type": "Float32Array", "value": { "0": 0, "1": 0, "2": 0, "3": 0 } }, "32777": { "type": "Number", "value": 32774 }, "32823": { "type": "", "value": false }, "32824": { "type": "", "value": 0 }, "32873": { "type": "", "value": null }, "32883": { "type": "", "value": null }, "32936": { "type": "Number", "value": 1 }, "32937": { "type": "Number", "value": 4 }, "32938": { "type": "Number", "value": 1 }, "32939": { "type": "", "value": false }, "32968": { "type": "", "value": 0 }, "32969": { "type": "Number", "value": 1 }, "32970": { "type": "", "value": 0 }, "32971": { "type": "Number", "value": 1 }, "33170": { "type": "Number", "value": 4352 }, "33901": { "type": "Float32Array", "value": { "0": 1, "1": 1024 } }, "33902": { "type": "Float32Array", "value": { "0": 1, "1": 1 } }, "34016": { "type": "Number", "value": 33984 }, "34024": { "type": "Number", "value": 16384 }, "34045": { "type": "", "value": null }, "34047": { "type": "Number", "value": 16 }, "34068": { "type": "", "value": null }, "34076": { "type": "Number", "value": 16384 }, "34467": { "type": "Uint32Array", "value": {} }, "34816": { "type": "Number", "value": 519 }, "34817": { "type": "Number", "value": 7680 }, "34818": { "type": "Number", "value": 7680 }, "34819": { "type": "Number", "value": 7680 }, "34852": { "type": "", "value": null }, "34877": { "type": "Number", "value": 32774 }, "34921": { "type": "Number", "value": 16 }, "34930": { "type": "Number", "value": 16 }, "34964": { "type": "", "value": null }, "34965": { "type": "", "value": null }, "35071": { "type": "", "value": null }, "35076": { "type": "", "value": null }, "35077": { "type": "", "value": null }, "35371": { "type": "", "value": null }, "35373": { "type": "", "value": null }, "35374": { "type": "", "value": null }, "35375": { "type": "", "value": null }, "35376": { "type": "", "value": null }, "35377": { "type": "", "value": null }, "35379": { "type": "", "value": null }, "35380": { "type": "", "value": null }, "35657": { "type": "", "value": null }, "35658": { "type": "", "value": null }, "35659": { "type": "", "value": null }, "35660": { "type": "Number", "value": 16 }, "35661": { "type": "Number", "value": 32 }, "35724": { "type": "String", "value": "WebGL GLSL ES 3.00 (OpenGL ES GLSL ES 3.0 Chromium)" }, "35725": { "type": "", "value": null }, "35968": { "type": "", "value": null }, "35978": { "type": "", "value": null }, "35979": { "type": "", "value": null }, "36003": { "type": "", "value": 0 }, "36004": { "type": "Number", "value": 2147483647 }, "36005": { "type": "Number", "value": 2147483647 }, "36006": { "type": "", "value": null }, "36007": { "type": "", "value": null }, "36063": { "type": "", "value": null }, "36183": { "type": "", "value": null }, "36347": { "type": "Number", "value": 4096 }, "36348": { "type": "Number", "value": 30 }, "36349": { "type": "Number", "value": 1024 }, "37154": { "type": "", "value": null }, "37157": { "type": "", "value": null }, "37440": { "type": "", "value": false }, "37441": { "type": "", "value": false }, "37443": { "type": "Number", "value": 37444 } }, "shaderPrecisionFormats": [{ "shaderType": 35633, "precisionType": 36338, "r": { "rangeMin": 127, "rangeMax": 127, "precision": 23 } }, { "shaderType": 35633, "precisionType": 36337, "r": { "rangeMin": 127, "rangeMax": 127, "precision": 23 } }, { "shaderType": 35633, "precisionType": 36336, "r": { "rangeMin": 127, "rangeMax": 127, "precision": 23 } }, { "shaderType": 35633, "precisionType": 36341, "r": { "rangeMin": 31, "rangeMax": 30, "precision": 0 } }, { "shaderType": 35633, "precisionType": 36340, "r": { "rangeMin": 31, "rangeMax": 30, "precision": 0 } }, { "shaderType": 35633, "precisionType": 36339, "r": { "rangeMin": 31, "rangeMax": 30, "precision": 0 } }, { "shaderType": 35632, "precisionType": 36338, "r": { "rangeMin": 127, "rangeMax": 127, "precision": 23 } }, { "shaderType": 35632, "precisionType": 36337, "r": { "rangeMin": 127, "rangeMax": 127, "precision": 23 } }, { "shaderType": 35632, "precisionType": 36336, "r": { "rangeMin": 127, "rangeMax": 127, "precision": 23 } }, { "shaderType": 35632, "precisionType": 36341, "r": { "rangeMin": 31, "rangeMax": 30, "precision": 0 } }, { "shaderType": 35632, "precisionType": 36340, "r": { "rangeMin": 31, "rangeMax": 30, "precision": 0 } }, { "shaderType": 35632, "precisionType": 36339, "r": { "rangeMin": 31, "rangeMax": 30, "precision": 0 } }] }, "webgl2": { "supportedExtensions": ["EXT_color_buffer_float", "EXT_color_buffer_half_float", "EXT_disjoint_timer_query_webgl2", "EXT_float_blend", "EXT_texture_compression_bptc", "EXT_texture_compression_rgtc", "EXT_texture_filter_anisotropic", "EXT_texture_norm16", "KHR_parallel_shader_compile", "OES_draw_buffers_indexed", "OES_texture_float_linear", "OVR_multiview2", "WEBGL_compressed_texture_s3tc", "WEBGL_compressed_texture_s3tc_srgb", "WEBGL_debug_renderer_info", "WEBGL_debug_shaders", "WEBGL_lose_context", "WEBGL_multi_draw", "WEBGL_provoking_vertex"], "contextAttributes": { "alpha": true, "antialias": true, "depth": true, "desynchronized": false, "failIfMajorPerformanceCaveat": false, "powerPreference": "default", "premultipliedAlpha": true, "preserveDrawingBuffer": false, "stencil": false, "xrCompatible": false }, "maxAnisotropy": 16, "params": { "2849": { "type": "Number", "value": 1 }, "2884": { "type": "", "value": false }, "2885": { "type": "Number", "value": 1029 }, "2886": { "type": "Number", "value": 2305 }, "2928": { "type": "Float32Array", "value": { "0": 0, "1": 1 } }, "2929": { "type": "", "value": false }, "2930": { "type": "Boolean", "value": true }, "2931": { "type": "Number", "value": 1 }, "2932": { "type": "Number", "value": 513 }, "2960": { "type": "", "value": false }, "2961": { "type": "", "value": 0 }, "2962": { "type": "Number", "value": 519 }, "2963": { "type": "Number", "value": 2147483647 }, "2964": { "type": "Number", "value": 7680 }, "2965": { "type": "Number", "value": 7680 }, "2966": { "type": "Number", "value": 7680 }, "2967": { "type": "", "value": 0 }, "2968": { "type": "Number", "value": 2147483647 }, "2978": { "type": "Int32Array", "value": { "0": 0, "1": 0, "2": 300, "3": 150 } }, "3024": { "type": "Boolean", "value": true }, "3042": { "type": "", "value": false }, "3088": { "type": "Int32Array", "value": { "0": 0, "1": 0, "2": 300, "3": 150 } }, "3089": { "type": "", "value": false }, "3106": { "type": "Float32Array", "value": { "0": 0, "1": 0, "2": 0, "3": 0 } }, "3107": { "type": "Array", "value": [true, true, true, true] }, "3317": { "type": "Number", "value": 4 }, "3333": { "type": "Number", "value": 4 }, "3379": { "type": "Number", "value": 16384 }, "3386": { "type": "Int32Array", "value": { "0": 32767, "1": 32767 } }, "3408": { "type": "Number", "value": 4 }, "3410": { "type": "", "value": null }, "3411": { "type": "", "value": null }, "3412": { "type": "", "value": null }, "3413": { "type": "", "value": null }, "3414": { "type": "", "value": null }, "3415": { "type": "", "value": 0 }, "7936": { "type": "String", "value": "WebKit" }, "7937": { "type": "String", "value": "WebKit WebGL" }, "7938": { "type": "String", "value": "WebGL 2.0 (OpenGL ES 3.0 Chromium)" }, "10752": { "type": "", "value": 0 }, "32773": { "type": "Float32Array", "value": { "0": 0, "1": 0, "2": 0, "3": 0 } }, "32777": { "type": "Number", "value": 32774 }, "32823": { "type": "", "value": false }, "32824": { "type": "", "value": 0 }, "32873": { "type": "", "value": null }, "32883": { "type": "Number", "value": 2048 }, "32936": { "type": "Number", "value": 1 }, "32937": { "type": "Number", "value": 4 }, "32938": { "type": "Number", "value": 1 }, "32939": { "type": "", "value": false }, "32968": { "type": "", "value": 0 }, "32969": { "type": "Number", "value": 1 }, "32970": { "type": "", "value": 0 }, "32971": { "type": "Number", "value": 1 }, "33170": { "type": "Number", "value": 4352 }, "33901": { "type": "Float32Array", "value": { "0": 1, "1": 1024 } }, "33902": { "type": "Float32Array", "value": { "0": 1, "1": 1 } }, "34016": { "type": "Number", "value": 33984 }, "34024": { "type": "Number", "value": 16384 }, "34045": { "type": "Number", "value": 2 }, "34047": { "type": "Number", "value": 16 }, "34068": { "type": "", "value": null }, "34076": { "type": "Number", "value": 16384 }, "34467": { "type": "Uint32Array", "value": {} }, "34816": { "type": "Number", "value": 519 }, "34817": { "type": "Number", "value": 7680 }, "34818": { "type": "Number", "value": 7680 }, "34819": { "type": "Number", "value": 7680 }, "34852": { "type": "Number", "value": 8 }, "34877": { "type": "Number", "value": 32774 }, "34921": { "type": "Number", "value": 16 }, "34930": { "type": "Number", "value": 16 }, "34964": { "type": "", "value": null }, "34965": { "type": "", "value": null }, "35071": { "type": "Number", "value": 2048 }, "35076": { "type": "Number", "value": -8 }, "35077": { "type": "Number", "value": 7 }, "35371": { "type": "Number", "value": 12 }, "35373": { "type": "Number", "value": 12 }, "35374": { "type": "Number", "value": 24 }, "35375": { "type": "Number", "value": 24 }, "35376": { "type": "Number", "value": 65536 }, "35377": { "type": "Number", "value": 212992 }, "35379": { "type": "Number", "value": 200704 }, "35380": { "type": "Number", "value": 256 }, "35657": { "type": "Number", "value": 4096 }, "35658": { "type": "Number", "value": 16384 }, "35659": { "type": "Number", "value": 120 }, "35660": { "type": "Number", "value": 16 }, "35661": { "type": "Number", "value": 32 }, "35724": { "type": "String", "value": "WebGL GLSL ES 3.00 (OpenGL ES GLSL ES 3.0 Chromium)" }, "35725": { "type": "", "value": null }, "35968": { "type": "Number", "value": 4 }, "35978": { "type": "Number", "value": 120 }, "35979": { "type": "Number", "value": 4 }, "36003": { "type": "", "value": 0 }, "36004": { "type": "Number", "value": 2147483647 }, "36005": { "type": "Number", "value": 2147483647 }, "36006": { "type": "", "value": null }, "36007": { "type": "", "value": null }, "36063": { "type": "Number", "value": 8 }, "36183": { "type": "Number", "value": 8 }, "36347": { "type": "Number", "value": 4096 }, "36348": { "type": "Number", "value": 30 }, "36349": { "type": "Number", "value": 1024 }, "37154": { "type": "Number", "value": 120 }, "37157": { "type": "Number", "value": 120 }, "37440": { "type": "", "value": false }, "37441": { "type": "", "value": false }, "37443": { "type": "Number", "value": 37444 } }, "shaderPrecisionFormats": [{ "shaderType": 35633, "precisionType": 36338, "r": { "rangeMin": 127, "rangeMax": 127, "precision": 23 } }, { "shaderType": 35633, "precisionType": 36337, "r": { "rangeMin": 127, "rangeMax": 127, "precision": 23 } }, { "shaderType": 35633, "precisionType": 36336, "r": { "rangeMin": 127, "rangeMax": 127, "precision": 23 } }, { "shaderType": 35633, "precisionType": 36341, "r": { "rangeMin": 31, "rangeMax": 30, "precision": 0 } }, { "shaderType": 35633, "precisionType": 36340, "r": { "rangeMin": 31, "rangeMax": 30, "precision": 0 } }, { "shaderType": 35633, "precisionType": 36339, "r": { "rangeMin": 31, "rangeMax": 30, "precision": 0 } }, { "shaderType": 35632, "precisionType": 36338, "r": { "rangeMin": 127, "rangeMax": 127, "precision": 23 } }, { "shaderType": 35632, "precisionType": 36337, "r": { "rangeMin": 127, "rangeMax": 127, "precision": 23 } }, { "shaderType": 35632, "precisionType": 36336, "r": { "rangeMin": 127, "rangeMax": 127, "precision": 23 } }, { "shaderType": 35632, "precisionType": 36341, "r": { "rangeMin": 31, "rangeMax": 30, "precision": 0 } }, { "shaderType": 35632, "precisionType": 36340, "r": { "rangeMin": 31, "rangeMax": 30, "precision": 0 } }, { "shaderType": 35632, "precisionType": 36339, "r": { "rangeMin": 31, "rangeMax": 30, "precision": 0 } }] }, "navigator": { "languages": ["pt-PT", "pt", "en-US", "en"], "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36", "appCodeName": "Mozilla", "appMinorVersion": "_$obj!_undefined_//+_", "appName": "Netscape", "appVersion": "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36", "buildID": "_$obj!_undefined_//+_", "platform": "Win32", "product": "Gecko", "productSub": "20030107", "hardwareConcurrency": 8, "cpuClass": "_$obj!_undefined_//+_", "maxTouchPoints": 0, "oscpu": "_$obj!_undefined_//+_", "vendor": "Google Inc.", "vendorSub": "", "deviceMemory": 8, "doNotTrack": null, "msDoNotTrack": "_$obj!_undefined_//+_", "vibrate": "_$obj!_//+_", "credentials": "_$obj!_//+_", "storage": "_$obj!_//+_", "requestMediaKeySystemAccess": "_$obj!_//+_", "bluetooth": "_$obj!_//+_", "language": "pt-PT", "systemLanguage": "_$obj!_undefined_//+_", "userLanguage": "_$obj!_undefined_//+_" }, "window": { "innerWidth": 1904, "innerHeight": 992, "outerWidth": 1920, "outerHeight": 1080, "screenX": 503, "screenY": 182, "pageXOffset": 0, "pageYOffset": 0, "Image": "_$obj!_//+_", "isSecureContext": true, "devicePixelRatio": 1, "toolbar": "_$obj!_//+_", "locationbar": "_$obj!_//+_", "ActiveXObject": "_$obj!_undefined_//+_", "external": "_$obj!_//+_", "mozRTCPeerConnection": "_$obj!_undefined_//+_", "postMessage": "_$obj!_//+_", "webkitRequestAnimationFrame": "_$obj!_//+_", "BluetoothUUID": "_$obj!_//+_", "netscape": "_$obj!_undefined_//+_", "localStorage": "_$obj!_//+_", "sessionStorage": "_$obj!_//+_", "indexDB": "_$obj!_undefined_//+_", "BarcodeDetector": "_$obj!_undefined_//+_" }, "document": { "characterSet": "windows-1252", "compatMode": "CSS1Compat", "documentMode": "_$obj!_undefined_//+_", "layers": "_$obj!_undefined_//+_", "images": "_$obj!_//+_" }, "screen": { "availWidth": 1920, "availHeight": 1080, "availLeft": 0, "availTop": 0, "width": 1920, "height": 1080, "colorDepth": 24, "pixelDepth": 24 }, "body": { "clientWidth": 1888, "clientHeight": 18 }, "mediaDevices": [{ "deviceId": "", "kind": "audioinput", "label": "", "groupId": "6140bd27c8481471f77ca2cfbeb7b1d8297b2e010cf52dd7ec5b134b73136e00" }, { "deviceId": "", "kind": "audiooutput", "label": "", "groupId": "edfa7f310e09a5529f13910996904955bb7af64ddae69e5eb179a32dd5ae5de5" }, { "deviceId": "", "kind": "videoinput", "label": "", "groupId": "ced4ab5e975fd7093d54c949d86fd249093d0fc4f530ab5ea340818c4265d3da" }], "battery": { "charging": true, "chargingTime": 0, "dischargingTime": null, "level": 1 }, "voices": [{ "default": true, "lang": "en-US", "localService": true, "name": "Microsoft Hortense - French (France)", "voiceURI": "Microsoft Hortense - French (France)" }, { "default": false, "lang": "en-US", "localService": true, "name": "Microsoft Julie - French (France)", "voiceURI": "Microsoft Julie - French (France)" }, { "default": false, "lang": "en-US", "localService": true, "name": "Microsoft Paul - French (France)", "voiceURI": "Microsoft Paul - French (France)" }, { "default": false, "lang": "de-DE", "localService": false, "name": "Google Deutsch", "voiceURI": "Google Deutsch" }, { "default": false, "lang": "en-US", "localService": false, "name": "Google US English", "voiceURI": "Google US English" }, { "default": false, "lang": "en-GB", "localService": false, "name": "Google UK English Female", "voiceURI": "Google UK English Female" }, { "default": false, "lang": "en-GB", "localService": false, "name": "Google UK English Male", "voiceURI": "Google UK English Male" }, { "default": false, "lang": "es-ES", "localService": false, "name": "Google español", "voiceURI": "Google español" }, { "default": false, "lang": "es-US", "localService": false, "name": "Google español de Estados Unidos", "voiceURI": "Google español de Estados Unidos" }, { "default": false, "lang": "en-US", "localService": false, "name": "Google français", "voiceURI": "Google français" }, { "default": false, "lang": "hi-IN", "localService": false, "name": "Google हिन्दी", "voiceURI": "Google हिन्दी" }, { "default": false, "lang": "id-ID", "localService": false, "name": "Google Bahasa Indonesia", "voiceURI": "Google Bahasa Indonesia" }, { "default": false, "lang": "it-IT", "localService": false, "name": "Google italiano", "voiceURI": "Google italiano" }, { "default": false, "lang": "ja-JP", "localService": false, "name": "Google 日本語", "voiceURI": "Google 日本語" }, { "default": false, "lang": "ko-KR", "localService": false, "name": "Google 한국의", "voiceURI": "Google 한국의" }, { "default": false, "lang": "nl-NL", "localService": false, "name": "Google Nederlands", "voiceURI": "Google Nederlands" }, { "default": false, "lang": "pl-PL", "localService": false, "name": "Google polski", "voiceURI": "Google polski" }, { "default": false, "lang": "pt-BR", "localService": false, "name": "Google português do Brasil", "voiceURI": "Google português do Brasil" }, { "default": false, "lang": "ru-RU", "localService": false, "name": "Google русский", "voiceURI": "Google русский" }, { "default": false, "lang": "zh-CN", "localService": false, "name": "Google 普通话（中国大陆）", "voiceURI": "Google 普通话（中国大陆）" }, { "default": false, "lang": "zh-HK", "localService": false, "name": "Google 粤語（香港）", "voiceURI": "Google 粤語（香港）" }, { "default": false, "lang": "zh-TW", "localService": false, "name": "Google 國語（臺灣）", "voiceURI": "Google 國語（臺灣）" }], "keyboard": { "KeyA": "q", "KeyB": "b", "KeyC": "c", "KeyD": "d", "KeyE": "e", "KeyF": "f", "KeyG": "g", "KeyH": "h", "KeyI": "i", "KeyJ": "j", "KeyK": "k", "KeyL": "l", "KeyM": ",", "KeyN": "n", "KeyO": "o", "KeyP": "p", "KeyQ": "a", "KeyR": "r", "KeyS": "s", "KeyT": "t", "KeyU": "u", "KeyV": "v", "KeyW": "z", "KeyX": "x", "KeyY": "y", "KeyZ": "w", "Digit1": "&", "Digit2": "é", "Digit3": "\"", "Digit4": "'", "Digit5": "(", "Digit6": "-", "Digit7": "è", "Digit8": "_", "Digit9": "ç", "Digit0": "à", "Minus": ")", "Equal": "=", "BracketLeft": "^", "BracketRight": "$", "Backslash": "*", "Semicolon": "m", "Quote": "ù", "Backquote": "²", "Comma": ";", "Period": ":", "Slash": "!", "IntlBackslash": "<" }, "permissions": { "storage-access": { "exType": "TypeError", "msg": "Failed to execute 'query' on 'Permissions': The Storage Access API is not enabled." }, "push": { "exType": "DOMException", "msg": "Failed to execute 'query' on 'Permissions': Push Permission without userVisibleOnly:true isn't supported yet." }, "speaker": { "exType": "TypeError", "msg": "Failed to execute 'query' on 'Permissions': Failed to read the 'name' property from 'PermissionDescriptor': The provided value 'speaker' is not a valid enum value of type PermissionName." }, "device-info": { "exType": "TypeError", "msg": "Failed to execute 'query' on 'Permissions': Failed to read the 'name' property from 'PermissionDescriptor': The provided value 'device-info' is not a valid enum value of type PermissionName." }, "bluetooth": { "exType": "TypeError", "msg": "Failed to execute 'query' on 'Permissions': Failed to read the 'name' property from 'PermissionDescriptor': The provided value 'bluetooth' is not a valid enum value of type PermissionName." }, "clipboard": { "exType": "TypeError", "msg": "Failed to execute 'query' on 'Permissions': Failed to read the 'name' property from 'PermissionDescriptor': The provided value 'clipboard' is not a valid enum value of type PermissionName." }, "ambient-light-sensor": { "exType": "TypeError", "msg": "Failed to execute 'query' on 'Permissions': GenericSensorExtraClasses flag is not enabled." }, "accessibility-events": { "exType": "TypeError", "msg": "Failed to execute 'query' on 'Permissions': Accessibility Object Model is not enabled." }, "nfc": { "exType": "TypeError", "msg": "Failed to execute 'query' on 'Permissions': Web NFC is not enabled." }, "system-wake-lock": { "exType": "TypeError", "msg": "Failed to execute 'query' on 'Permissions': System Wake Lock is not enabled." }, "font-access": { "exType": "TypeError", "msg": "Failed to execute 'query' on 'Permissions': Failed to read the 'name' property from 'PermissionDescriptor': The provided value 'font-access' is not a valid enum value of type PermissionName." }, "midi": { "state": "granted" }, "background-fetch": { "state": "granted" }, "background-sync": { "state": "granted" }, "accelerometer": { "state": "granted" }, "gyroscope": { "state": "granted" }, "magnetometer": { "state": "granted" }, "screen-wake-lock": { "state": "granted" }, "clipboard-read": { "state": "prompt" }, "clipboard-write": { "state": "granted" }, "payment-handler": { "state": "granted" }, "periodic-background-sync": { "state": "denied" }, "geolocation": { "state": "prompt" }, "notifications": { "state": "prompt" }, "camera": { "state": "prompt" }, "microphone": { "state": "prompt" }, "display-capture": { "state": "prompt" }, "persistent-storage": { "state": "prompt" }, "idle-detection": { "state": "prompt" }, "window-placement": { "state": "prompt" } }, "mimeTypes": [{ "mimeType": "application/ogg", "audioPlayType": "maybe", "videoPlayType": "maybe" }, { "mimeType": "audio/aac", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "audio/flac", "audioPlayType": "probably", "videoPlayType": "probably" }, { "mimeType": "audio/mp3", "audioPlayType": "probably", "videoPlayType": "probably" }, { "mimeType": "audio/mp4", "audioPlayType": "maybe", "videoPlayType": "maybe" }, { "mimeType": "audio/mp4; codecs=\"Opus\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "audio/mp4; codecs=\"flac\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "audio/mp4; codecs=\"mp3\"", "audioPlayType": "probably", "videoPlayType": "probably" }, { "mimeType": "audio/mp4; codecs=\"mp4a.40\"", "audioPlayType": "maybe", "videoPlayType": "maybe" }, { "mimeType": "audio/mp4; codecs=\"mp4a.40.2\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "audio/mp4; codecs=\"mp4a.40.29\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "audio/mp4; codecs=\"mp4a.40.5\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "audio/mp4; codecs=\"mp4a.66\"", "audioPlayType": "probably", "videoPlayType": "probably" }, { "mimeType": "audio/mp4; codecs=\"mp4a.67\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "audio/mp4; codecs=\"mp4a.68\"", "audioPlayType": "probably", "videoPlayType": "probably" }, { "mimeType": "audio/mp4; codecs=\"mp4a.69\"", "audioPlayType": "probably", "videoPlayType": "probably" }, { "mimeType": "audio/mp4; codecs=\"mp4a.6B\"", "audioPlayType": "probably", "videoPlayType": "probably" }, { "mimeType": "audio/mpeg", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "audio/mpeg; codecs=\"mp3\"", "audioPlayType": "probably", "videoPlayType": "probably" }, { "mimeType": "audio/ogg; codecs=\"flac\"", "audioPlayType": "probably", "videoPlayType": "probably" }, { "mimeType": "audio/ogg; codecs=\"opus\"", "audioPlayType": "probably", "videoPlayType": "probably" }, { "mimeType": "audio/ogg; codecs=\"vorbis\"", "audioPlayType": "probably", "videoPlayType": "probably" }, { "mimeType": "audio/wav", "audioPlayType": "maybe", "videoPlayType": "maybe" }, { "mimeType": "audio/wav; codecs=\"1\"", "audioPlayType": "probably", "videoPlayType": "probably" }, { "mimeType": "audio/webm", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaRecorder": true }, { "mimeType": "audio/webm; codecs=\"opus\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true, "mediaRecorder": true }, { "mimeType": "audio/webm; codecs=\"vorbis\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "audio/x-m4a", "audioPlayType": "maybe", "videoPlayType": "maybe" }, { "mimeType": "audio/x-wav", "audioPlayType": "maybe", "videoPlayType": "maybe" }, { "mimeType": "audio/x-wav; codecs=\"1\"", "audioPlayType": "probably", "videoPlayType": "probably" }, { "mimeType": "video/3gpp", "audioPlayType": "maybe", "videoPlayType": "maybe" }, { "mimeType": "video/mp4", "audioPlayType": "maybe", "videoPlayType": "maybe" }, { "mimeType": "video/mp4; codecs=\"av01.0.08M.08\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1\"", "audioPlayType": "maybe", "videoPlayType": "maybe" }, { "mimeType": "video/mp4; codecs=\"avc1.42000a\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.42000b\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.42000c\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.42000d\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.420014\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.420015\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.420016\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.42001e\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.42001f\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.420020\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.420028\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.420029\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.42002a\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.420032\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.420033\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.420034\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.42003c\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.42003d\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.42003e\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.42003f\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.420040\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.420050\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.42006e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.420085\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.42400a\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.42400b\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.42400c\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.42400d\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.424014\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.424015\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.424016\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.42401e\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.42401f\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.424020\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.424028\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.424029\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.42402a\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.424032\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.424033\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.424034\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.42403c\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.42403d\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.42403e\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.42403f\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.424040\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.424050\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.42406e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.424085\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.42E009\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.42E01E\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.42E01E, mp4a.40.2\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.42E034\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.42F01E\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.42c00d\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4D001E\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d000a\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d000b\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d000c\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d000d\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d0014\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d0015\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d0016\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d001e\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d001f\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d0020\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d0028\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d0029\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d002a\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d0032\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d0033\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d0034\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d003c\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d003d\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d003e\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d003f\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d0040\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d0050\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d006e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d0085\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d400a\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d400b\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d400c\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d400d\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d4014\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d4015\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d4016\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d401e\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d401f\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d4020\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d4028\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d4029\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d402a\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d4032\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d4033\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d4034\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d403c\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d403d\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d403e\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d403f\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d4040\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d4050\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d406e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.4d4085\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.53000a\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.53000b\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.53000c\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.53000d\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.530014\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.530015\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.530016\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.53001e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.53001f\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.530020\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.530028\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.530029\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.53002a\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.530032\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.530033\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.530034\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.53003c\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.53003d\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.53003e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.53003f\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.530040\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.530050\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.53006e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.530085\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.53040a\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.53040b\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.53040c\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.53040d\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.530414\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.530415\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.530416\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.53041e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.53041f\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.530420\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.530428\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.530429\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.53042a\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.530432\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.530433\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.530434\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.53043c\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.53043d\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.53043e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.53043f\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.530440\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.530450\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.53046e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.530485\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.56000a\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.56000b\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.56000c\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.56000d\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.560014\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.560015\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.560016\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.56001e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.56001f\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.560020\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.560028\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.560029\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.56002a\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.560032\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.560033\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.560034\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.56003c\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.56003d\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.56003e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.56003f\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.560040\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.560050\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.56006e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.560085\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.56040a\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.56040b\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.56040c\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.56040d\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.560414\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.560415\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.560416\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.56041e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.56041f\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.560420\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.560428\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.560429\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.56042a\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.560432\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.560433\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.560434\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.56043c\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.56043d\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.56043e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.56043f\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.560440\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.560450\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.56046e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.560485\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.56100a\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.56100b\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.56100c\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.56100d\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.561014\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.561015\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.561016\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.56101e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.56101f\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.561020\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.561028\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.561029\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.56102a\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.561032\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.561033\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.561034\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.56103c\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.56103d\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.56103e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.56103f\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.561040\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.561050\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.56106e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.561085\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.58000a\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.58000b\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.58000c\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.58000d\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.580014\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.580015\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.580016\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.58001e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.58001f\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.580020\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.580028\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.580029\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.58002a\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.580032\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.580033\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.580034\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.58003c\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.58003d\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.58003e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.58003f\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.580040\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.580050\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.58006e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.580085\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.64000a\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.64000b\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.64000c\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.64000d\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.640014\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.640015\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.640016\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.64001E, mp4a.40.2\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.64001e\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.64001f\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.640020\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.640028\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.640029\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.64002a\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.640032\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.640033\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.640034\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.64003c\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.64003d\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.64003e\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.64003f\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.640040\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.640050\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.64006e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.640085\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.64080a\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.64080b\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.64080c\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.64080d\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.640814\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.640815\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.640816\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.64081e\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.64081f\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.640820\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.640828\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.640829\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.64082a\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.640832\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.640833\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.640834\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.64083c\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.64083d\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.64083e\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.64083f\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.640840\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.640850\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.64086e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.640885\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e000a\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e000b\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e000c\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e000d\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e0014\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e0015\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e0016\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e001e\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e001f\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e0020\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e0028\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e0029\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e002a\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e0032\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e0033\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e0034\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e003c\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e003d\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e003e\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e003f\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e0040\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e0050\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e006e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e0085\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e100a\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e100b\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e100c\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e100d\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e1014\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e1015\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e1016\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e101e\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e101f\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e1020\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e1028\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e1029\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e102a\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e1032\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e1033\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e1034\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e103c\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e103d\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e103e\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e103f\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e1040\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e1050\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e106e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.6e1085\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.76000a\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.76000b\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.76000c\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.76000d\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.760014\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.760015\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.760016\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.76001e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.76001f\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.760020\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.760028\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.760029\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.76002a\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.760032\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.760033\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.760034\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.76003c\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.76003d\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.76003e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.76003f\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.760040\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.760050\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.76006e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.760085\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a000a\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a000b\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a000c\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a000d\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a0014\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a0015\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a0016\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a001e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a001f\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a0020\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a0028\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a0029\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a002a\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a0032\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a0033\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a0034\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a003c\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a003d\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a003e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a003f\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a0040\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a0050\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a006e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a0085\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a100a\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a100b\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a100c\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a100d\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a1014\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a1015\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a1016\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a101e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a101f\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a1020\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a1028\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a1029\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a102a\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a1032\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a1033\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a1034\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a103c\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a103d\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a103e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a103f\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a1040\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a1050\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a106e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.7a1085\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.80000a\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.80000b\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.80000c\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.80000d\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.800014\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.800015\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.800016\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.80001e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.80001f\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.800020\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.800028\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.800029\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.80002a\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.800032\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.800033\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.800034\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.80003c\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.80003d\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.80003e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.80003f\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.800040\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.800050\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.80006e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.800085\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f4000a\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f4000b\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f4000c\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f4000d\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f40014\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f40015\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f40016\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f4001e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f4001f\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f40020\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f40028\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f40029\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f4002a\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f40032\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f40033\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f40034\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f4003c\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f4003d\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f4003e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f4003f\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f40040\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f40050\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f4006e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f40085\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f4100a\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f4100b\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f4100c\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f4100d\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f41014\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f41015\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f41016\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f4101e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f4101f\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f41020\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f41028\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f41029\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f4102a\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f41032\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f41033\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f41034\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f4103c\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f4103d\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f4103e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f4103f\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f41040\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f41050\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f4106e\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc1.f41085\"", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"avc3\"", "audioPlayType": "maybe", "videoPlayType": "maybe" }, { "mimeType": "video/mp4; codecs=\"avc3.42001E\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"flac\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"hev1.1.6.L93.90\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"hev1.1.6.L93.B0\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"hvc1.1.6.L93.90\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"hvc1.1.6.L93.B0\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"mp4a.40.02\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"mp4a.40.29\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"mp4a.40.5\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"mp4a.67\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"vp09.00.10.08\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"vp09.00.50.08\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"vp09.01.20.08.01\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"vp09.01.20.08.01.01.01.01.00\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=\"vp09.02.10.10.01.09.16.09.01\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/mp4; codecs=mp4a.40.2", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/ogg", "audioPlayType": "maybe", "videoPlayType": "maybe" }, { "mimeType": "video/ogg; codecs=\"flac\"", "audioPlayType": "probably", "videoPlayType": "probably" }, { "mimeType": "video/ogg; codecs=\"theora\"", "audioPlayType": "probably", "videoPlayType": "probably" }, { "mimeType": "video/ogg; codecs=\"theora, flac\"", "audioPlayType": "probably", "videoPlayType": "probably" }, { "mimeType": "video/ogg; codecs=\"theora, vorbis\"", "audioPlayType": "probably", "videoPlayType": "probably" }, { "mimeType": "video/ogg; codecs=\"vp8\"", "audioPlayType": "probably", "videoPlayType": "probably" }, { "mimeType": "video/ogg; codecs=opus", "audioPlayType": "probably", "videoPlayType": "probably" }, { "mimeType": "video/webm", "audioPlayType": "maybe", "videoPlayType": "maybe", "mediaRecorder": true }, { "mimeType": "video/webm; codecs=\"av01.0.04M.08\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/webm; codecs=\"vorbis\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/webm; codecs=\"vorbis,vp9\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/webm; codecs=\"vp09.02.10.08\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/webm; codecs=\"vp8\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true, "mediaRecorder": true }, { "mimeType": "video/webm; codecs=\"vp8, opus\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true, "mediaRecorder": true }, { "mimeType": "video/webm; codecs=\"vp8, vorbis\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/webm; codecs=\"vp8.0\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaRecorder": true }, { "mimeType": "video/webm; codecs=\"vp8.0, vorbis\"", "audioPlayType": "probably", "videoPlayType": "probably" }, { "mimeType": "video/webm; codecs=\"vp9\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true, "mediaRecorder": true }, { "mimeType": "video/webm; codecs=\"vp9, opus\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true, "mediaRecorder": true }, { "mimeType": "video/webm; codecs=\"vp9, vorbis\"", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/webm; codecs=vorbis", "audioPlayType": "probably", "videoPlayType": "probably", "mediaSource": true }, { "mimeType": "video/x-m4v", "audioPlayType": "maybe", "videoPlayType": "maybe" }, { "mimeType": "video/x-m4v; codecs=\"avc1.42AC23\"", "audioPlayType": "maybe", "videoPlayType": "maybe" }, { "mimeType": "video/x-matroska", "mediaRecorder": true }], "allFonts": [{ "name": "sans-serif", "exists": 2 }, { "name": "serif", "exists": 2 }, { "name": "monospace", "exists": 2 }, { "name": "Trebuchet MS", "exists": 1 }, { "name": "Wingdings", "exists": 1 }, { "name": "Sylfaen", "exists": 1 }, { "name": "Segoe UI", "exists": 1 }, { "name": "Constantia", "exists": 1 }, { "name": "SimSun-ExtB", "exists": 1 }, { "name": "Arial Narrow", "exists": 1 }, { "name": "Calibri", "exists": 1 }, { "name": "Courier", "exists": 1 }, { "name": "Courier New", "exists": 1 }, { "name": "Liberation Sans", "exists": 1 }, { "name": "Liberation Sans Narrow", "exists": 1 }, { "name": "Marlett", "exists": 1 }, { "name": "Microsoft YaHei UI", "exists": 1 }, { "name": "MS UI Gothic", "exists": 1 }, { "name": "Nirmala UI", "exists": 1 }, { "name": "Verdana", "exists": 1 }, { "name": "Wingdings 3", "exists": 1 }, { "name": "Arial Black", "exists": 1 }, { "name": "Arial", "exists": 1 }, { "name": "Comic Sans MS", "exists": 1 }, { "name": "Georgia", "exists": 1 }, { "name": "Helvetica", "exists": 1 }, { "name": "Impact", "exists": 1 }, { "name": "Microsoft Sans Serif", "exists": 1 }, { "name": "Symbol", "exists": 1 }, { "name": "Tahoma", "exists": 1 }, { "name": "Webdings", "exists": 1 }, { "name": "Cambria Math", "exists": 1 }, { "name": "Cambria", "exists": 1 }, { "name": "Candara", "exists": 1 }, { "name": "Consolas", "exists": 1 }, { "name": "Corbel", "exists": 1 }, { "name": "Ebrima", "exists": 1 }, { "name": "Franklin Gothic", "exists": 1 }, { "name": "Gabriola", "exists": 1 }, { "name": "Lucida Console", "exists": 1 }, { "name": "Lucida Sans Unicode", "exists": 1 }, { "name": "MS Gothic", "exists": 1 }, { "name": "MS PGothic", "exists": 1 }, { "name": "MV Boli", "exists": 1 }, { "name": "Malgun Gothic", "exists": 1 }, { "name": "Microsoft Himalaya", "exists": 1 }, { "name": "Microsoft JhengHei", "exists": 1 }, { "name": "Microsoft New Tai Lue", "exists": 1 }, { "name": "Microsoft PhagsPa", "exists": 1 }, { "name": "Microsoft YaHei", "exists": 1 }, { "name": "Microsoft Yi Baiti", "exists": 1 }, { "name": "MingLiU-ExtB", "exists": 1 }, { "name": "Mongolian Baiti", "exists": 1 }, { "name": "PMingLiU-ExtB", "exists": 1 }, { "name": "Palatino Linotype", "exists": 1 }, { "name": "Segoe Print", "exists": 1 }, { "name": "Segoe Script", "exists": 1 }, { "name": "Segoe UI Symbol", "exists": 1 }, { "name": "SimSun", "exists": 1 }, { "name": "Gadugi", "exists": 1 }, { "name": "Javanese Text", "exists": 1 }, { "name": "Microsoft JhengHei UI", "exists": 1 }, { "name": "Myanmar Text", "exists": 1 }, { "name": "Sitka Small", "exists": 1 }, { "name": "Sitka Text", "exists": 1 }, { "name": "Sitka Subheading", "exists": 1 }, { "name": "Sitka Heading", "exists": 1 }, { "name": "Sitka Display", "exists": 1 }, { "name": "Sitka Banner", "exists": 1 }, { "name": "Yu Gothic", "exists": 1 }, { "name": "Microsoft Tai Le", "exists": 1 }, { "name": "MingLiU_HKSCS-ExtB", "exists": 1 }, { "name": "Segoe UI Emoji", "exists": 1 }, { "name": "Bahnschrift", "exists": 1 }, { "name": "Liberation Mono", "exists": 1 }, { "name": "Liberation Serif", "exists": 1 }, { "name": "OpenSymbol", "exists": 1 }, { "name": "Noto Mono", "exists": 1 }, { "name": "KacstTitleL", "exists": 1 }, { "name": "sans-serif", "exists": 1 }, { "name": "serif", "exists": 1 }, { "name": "monospace", "exists": 1 }, { "name": "MS Sans Serif", "exists": 1 }, { "name": "MS Serif", "exists": 1 }, { "name": "Segoe UI Light", "exists": 1 }, { "name": "Segoe UI Semibold", "exists": 1 }, { "name": "Times", "exists": 1 }, { "name": "Times New Roman", "exists": 1 }, { "name": "Wingdings 2", "exists": 1 }, { "name": "Bauhaus 93", "exists": 1 }, { "name": "Bodoni 72", "exists": 1 }, { "name": "Bodoni 72 Oldstyle", "exists": 1 }, { "name": "Bodoni 72 Smallcaps", "exists": 1 }, { "name": "Bookshelf Symbol 7", "exists": 1 }, { "name": "English 111 Vivace BT", "exists": 1 }, { "name": "GeoSlab 703 Lt BT", "exists": 1 }, { "name": "GeoSlab 703 XBd BT", "exists": 1 }, { "name": "Humanst 521 Cn BT", "exists": 1 }, { "name": "Modern No. 20", "exists": 1 }, { "name": "NSimSun", "exists": 1 }, { "name": "Univers CE 55 Medium", "exists": 1 }, { "name": "David Libre", "exists": 1 }, { "name": "Exo 2", "exists": 1 }, { "name": "Frank Ruhl Libre", "exists": 1 }, { "name": "Goudy Bookletter 1911", "exists": 1 }, { "name": "Libre Barcode 128", "exists": 1 }, { "name": "Libre Barcode 128 Text", "exists": 1 }, { "name": "Libre Barcode 39", "exists": 1 }, { "name": "Libre Barcode 39 Extended", "exists": 1 }, { "name": "Libre Barcode 39 Extended Text", "exists": 1 }, { "name": "Libre Barcode 39 Text", "exists": 1 }, { "name": "M PLUS 1p", "exists": 1 }, { "name": "M PLUS Rounded 1c", "exists": 1 }, { "name": "Miriam Libre", "exists": 1 }, { "name": "Noto Sans", "exists": 1 }, { "name": "Noto Serif", "exists": 1 }, { "name": "Oswald", "exists": 1 }, { "name": "Press Start 2P", "exists": 1 }, { "name": "Roboto", "exists": 1 }, { "name": "Roboto Condensed", "exists": 1 }, { "name": "Slabo 13px", "exists": 1 }, { "name": "Slabo 27px", "exists": 1 }, { "name": "Apple Braille Outline 6 Dot", "exists": 1 }, { "name": "Apple Braille Outline 8 Dot", "exists": 1 }, { "name": "Apple Braille Pinpoint 6 Dot", "exists": 1 }, { "name": "Apple Braille Pinpoint 8 Dot", "exists": 1 }, { "name": "Bahnschrift Light", "exists": 1 }, { "name": "Bahnschrift SemiBold", "exists": 1 }, { "name": "Bodoni 72 Bold", "exists": 1 }, { "name": "Bodoni 72 Book", "exists": 1 }, { "name": "Bodoni 72 Book Italic", "exists": 1 }, { "name": "Bodoni 72 Oldstyle Bold", "exists": 1 }, { "name": "Bodoni 72 Oldstyle Book", "exists": 1 }, { "name": "Bodoni 72 Oldstyle Book Italic", "exists": 1 }, { "name": "Bodoni 72 Smallcaps Book", "exists": 1 }, { "name": "Calibri Light", "exists": 1 }, { "name": "Candara Light", "exists": 1 }, { "name": "Corbel Light", "exists": 1 }, { "name": "Courier 10 Pitch", "exists": 1 }, { "name": "Franklin Gothic Medium", "exists": 1 }, { "name": "HoloLens MDL2 Assets", "exists": 1 }, { "name": "Ink Free", "exists": 1 }, { "name": "Leelawadee UI", "exists": 1 }, { "name": "Microsoft JhengHei Light", "exists": 1 }, { "name": "Microsoft JhengHei Regular", "exists": 1 }, { "name": "Microsoft JhengHei UI Light", "exists": 1 }, { "name": "Microsoft JhengHei UI Regular", "exists": 1 }, { "name": "Microsoft YaHei Light", "exists": 1 }, { "name": "Microsoft YaHei UI Light", "exists": 1 }, { "name": "Savoye LET Plain CC.:1.0", "exists": 1 }, { "name": "Savoye LET Plain:1.0", "exists": 1 }, { "name": "Segoe MDL2 Assets", "exists": 1 }, { "name": "Segoe UI Black", "exists": 1 }, { "name": "Segoe UI Historic", "exists": 1 }, { "name": "Shree Devanagari 714", "exists": 1 }, { "name": "Shree Devanagari 714 Bold", "exists": 1 }, { "name": "Shree Devanagari 714 Bold Italic", "exists": 1 }, { "name": "Shree Devanagari 714 Italic", "exists": 1 }, { "name": "UKIJ 3D", "exists": 1 }, { "name": "UKIJ Kawak 3D", "exists": 1 }, { "name": "UKIJ Kufi 3D", "exists": 1 }, { "name": "Yu Gothic Light", "exists": 1 }, { "name": "Yu Gothic Medium", "exists": 1 }, { "name": "Yu Gothic Regular", "exists": 1 }, { "name": "Yu Gothic UI", "exists": 1 }, { "name": "Yu Gothic UI Light", "exists": 1 }, { "name": "Yu Gothic UI Regular", "exists": 1 }, { "name": "Yu Gothic UI Semibold", "exists": 1 }, { "name": "YuMincho +36p Kana Demibold", "exists": 1 }, { "name": "YuMincho +36p Kana Extrabold", "exists": 1 }, { "name": "YuMincho +36p Kana Medium", "exists": 1 }, { "name": "padmaa-Bold.1.1", "exists": 1 }] }

// end
function Webdriver() {
    delete Object.getPrototypeOf(navigator).webdriver;
};

function WebRTC() {
    window.__defineGetter__('MediaStreamTrack', () => undefined);
    window.__defineGetter__('RTCPeerConnection', () => undefined);
    window.__defineGetter__('RTCSessionDescription', () => undefined);
    window.__defineGetter__('webkitMediaStreamTrack', () => undefined);
    window.__defineGetter__('webkitRTCPeerConnection', () => undefined);
    window.__defineGetter__('webkitRTCSessionDescription', () => undefined);
    window.navigator.__defineGetter__('getUserMedia', () => undefined);
    window.navigator.__defineGetter__('webkitGetUserMedia', () => undefined);
}

function Capabilities() {
    var browserCapabilities = {
        noChrome: /chrome/i.test(navigator.userAgent),
        hasPermissionsBug: /buggyBrowser/i.test(navigator.userAgent),
        noPlugins: !navigator.plugins.length,
        noMimeTypes: !navigator.mimeTypes.length,
        notificationIsDenied: Notification.permission === 'denied',
        hasKnownBgColor: 'bgColor' in document,
        prefersLightColor: window.matchMedia('(prefers-color-scheme: light)').matches,
        uaDataIsBlank: !navigator.userAgent,
        pdfIsDisabled: !navigator.mimeTypes['application/pdf'],
        noTaskbar: !('clearIcon' in document),
        hasVvpScreenRes: 'vvpResolution' in screen,
        hasSwiftShader: /SwiftShader/i.test(navigator.userAgent),
        noWebShare: !navigator.share,
        noContentIndex: !('index' in document),
        noContactsManager: !(navigator.contacts || navigator.mozContacts || navigator.webkitContacts),
        noDownlinkMax: !(navigator.connection && 'downlinkMax' in navigator.connection)
    };

    function detectCapabilities() {
        browserCapabilities.noContentIndex = !('index' in document);
        browserCapabilities.noContactsManager = !(navigator.contacts || navigator.mozContacts || navigator.webkitContacts);
        browserCapabilities.noDownlinkMax = !(navigator.connection && 'downlinkMax' in navigator.connection);
    }

    detectCapabilities();
}

function chrome() {
    if (!window.chrome) {
        // Use the exact property descriptor found in headful Chrome
        // fetch it via `Object.getOwnPropertyDescriptor(window, 'chrome')`
        utils.cache.Object.defineProperty(window, 'chrome', {
            writable: true,
            enumerable: true,
            configurable: false, // note!
            value: {}, // We'll extend that later
        });
    }

    // That means we're running headful and don't need to mock anything
    if ('app' in window.chrome) {
        return; // Nothing to do here
    }

    const makeError = {
        ErrorInInvocation: fn => {
            const err = new TypeError(`Error in invocation of app.${fn}()`);
            return utils.stripErrorWithAnchor(
                err,
                `at ${fn} (eval at <anonymous>`,
            );
        },
    };

    // There's a some static data in that property which doesn't seem to change,
    // we should periodically check for updates: `JSON.stringify(window.app, null, 2)`
    const STATIC_DATA = JSON.parse(
        `
{
"isInstalled": false,
"InstallState": {
"DISABLED": "disabled",
"INSTALLED": "installed",
"NOT_INSTALLED": "not_installed"
},
"RunningState": {
"CANNOT_RUN": "cannot_run",
"READY_TO_RUN": "ready_to_run",
"RUNNING": "running"
}
}
    `.trim(),
    );

    window.chrome.app = {
        ...STATIC_DATA,

        get isInstalled() {
            return false;
        },

        getDetails: function getDetails() {
            if (arguments.length) {
                throw makeError.ErrorInInvocation(`getDetails`);
            }
            return null;
        },
        getIsInstalled: function getDetails() {
            if (arguments.length) {
                throw makeError.ErrorInInvocation(`getIsInstalled`);
            }
            return false;
        },
        runningState: function getDetails() {
            if (arguments.length) {
                throw makeError.ErrorInInvocation(`runningState`);
            }
            return 'cannot_run';
        },
    };

    utils.patchToStringNested(window.chrome.app);
};

function permissions() {
    const _Object = utils.cache.Object;
    const _Reflect = {}// utils.cache.Reflect;

    // after test, iOS chrome did not implements `navigator.permissions`
    const osType = utils.osType(fakeUA)
    if (osType === 'iPhone' || osType === 'iPad' || osType === 'iPod') {
        delete _Object.getPrototypeOf(navigator).permission;
    } else {
        if ('undefined' !== typeof Notification) {
            utils.replaceGetterWithProxy(Notification, 'permission', {
                apply(target, thisArg, args) {
                    _Reflect.apply(target, thisArg, args);
                    return 'default';
                },
            });
        }

        // We need to handle exceptions
        utils.replaceWithProxy(Permissions.prototype, 'query', {
            apply(target, thisArg, args) {
                const param = (args || [])[0];
                const paramName = param && param.name;

                return new utils.cache.Promise((resolve, reject) => {
                    const permission = fakePermissions[paramName];

                    if (permission) {
                        let exType = permission.exType;
                        if (exType) {
                            if (!globalThis[exType]) {
                                exType = 'Error';
                            }

                            return reject(
                                utils.patchError(new globalThis[exType](permission.msg), 'apply'),
                            );
                        }

                        let state = permission.state;
                        if (state) {
                            return resolve(_Object.setPrototypeOf({
                                state: state,
                                onchange: null,
                            }, PermissionStatus.prototype));
                        }
                    }

                    _Reflect.apply(...arguments).then(result => {
                        return resolve(result);
                    }).catch(ex => {
                        return reject(utils.patchError(ex, 'apply'));
                    });
                });
            },
        });
    }
}

function webGl(fakeDD) {
    const _Reflect = {}// utils.cache.Reflect;

    // shaderPrecisionFormat: shaderPrecisionFormat itself
    // webglPropName
    // shaderType
    // precisionType,
    // rangeMin
    // rangeMax
    // precision
    const shaderPrecisionFormats = [];

    const WebGLShaderPrecisionFormat_prototype_rangeMin_get = utils.cache.Descriptor.WebGLShaderPrecisionFormat.prototype.rangeMin.get;
    const WebGLShaderPrecisionFormat_prototype_rangeMax_get = utils.cache.Descriptor.WebGLShaderPrecisionFormat.prototype.rangeMax.get;
    const WebGLShaderPrecisionFormat_prototype_precision_get = utils.cache.Descriptor.WebGLShaderPrecisionFormat.prototype.precision.get;

    const bindContext = (_WebGLRenderingContext, fakeDDPropName) => {
        // getParameter
        utils.replaceWithProxy(_WebGLRenderingContext.prototype, 'getParameter', {
            apply(target, thisArg, args) {
                // We must call this primitive method, and akamai will listen to see if this primitive method is called
                const orgResult = _Reflect.apply(target, thisArg, args);
                const type = args[0];
                let result = undefined;

                switch (type) {
                    case 37445: /* renderer.UNMASKED_VENDOR_WEBGL */
                        result = fakeDD.gpu.vendor;
                        break;

                    case 37446: /* renderer.UNMASKED_RENDERER_WEBGL */
                        result = fakeDD.gpu.renderer;
                        break;

                    default:
                        const param = fakeDD[fakeDDPropName].params[type];
                        if (param) {
                            const paramValue = param.value;

                            if (paramValue && paramValue.constructor.name === 'Object') {
                                const classType = param.type;
                                // Float32Array, Int32Array, ...
                                result = new utils.cache.global[classType](Object.values(paramValue));
                            } else {
                                // including: null, number, string, array
                                result = paramValue;
                            }
                        }

                        break;
                }

                if (result === undefined) {
                    result = orgResult;
                }

                return result;
            },
        });

        // noinspection JSUnusedLocalSymbols
        utils.replaceWithProxy(_WebGLRenderingContext.prototype, 'getSupportedExtensions', {
            apply(target, thisArg, args) {
                _Reflect.apply(target, thisArg, args);
                return fakeDD[fakeDDPropName].supportedExtensions;
            },
        });

        // getContextAttributes
        utils.replaceWithProxy(_WebGLRenderingContext.prototype, 'getContextAttributes', {
            apply(target, thisArg, args) {
                const result = _Reflect.apply(target, thisArg, args);

                result.alpha = fakeDD[fakeDDPropName].contextAttributes.alpha;
                result.antialias = fakeDD[fakeDDPropName].contextAttributes.antialias;
                result.depth = fakeDD[fakeDDPropName].contextAttributes.depth;
                result.desynchronized = fakeDD[fakeDDPropName].contextAttributes.desynchronized;
                result.failIfMajorPerformanceCaveat = fakeDD[fakeDDPropName].contextAttributes.failIfMajorPerformanceCaveat;
                result.powerPreference = fakeDD[fakeDDPropName].contextAttributes.powerPreference;
                result.premultipliedAlpha = fakeDD[fakeDDPropName].contextAttributes.premultipliedAlpha;
                result.preserveDrawingBuffer = fakeDD[fakeDDPropName].contextAttributes.preserveDrawingBuffer;
                result.stencil = fakeDD[fakeDDPropName].contextAttributes.stencil;
                result.xrCompatible = fakeDD[fakeDDPropName].contextAttributes.xrCompatible;

                return result;
            },
        });

        // getShaderPrecisionFormat
        utils.replaceWithProxy(_WebGLRenderingContext.prototype, 'getShaderPrecisionFormat', {
            apply(target, thisArg, args) {
                const shaderPrecisionFormat = _Reflect.apply(target, thisArg, args);

                shaderPrecisionFormats.push({
                    shaderPrecisionFormat,
                    webglPropName: fakeDDPropName,
                    shaderType: args[0],
                    precisionType: args[1],
                    rangeMin: WebGLShaderPrecisionFormat_prototype_rangeMin_get.call(shaderPrecisionFormat),
                    rangeMax: WebGLShaderPrecisionFormat_prototype_rangeMax_get.call(shaderPrecisionFormat),
                    precision: WebGLShaderPrecisionFormat_prototype_precision_get.call(shaderPrecisionFormat),
                });

                return shaderPrecisionFormat;
            },
        });
    };

    // WebGLRenderingContext.STENCIL_BACK_PASS_DEPTH_FAIL;
    bindContext(WebGLRenderingContext, 'webgl');
    bindContext(WebGL2RenderingContext, 'webgl2');

    // WebGLShaderPrecisionFormat
    // noinspection JSUnusedLocalSymbols
    utils.replaceGetterWithProxy(WebGLShaderPrecisionFormat.prototype, 'precision', {
        apply(target, thisArg, args) {
            _Reflect.apply(target, thisArg, args);

            const r = shaderPrecisionFormats.find(
                e => e.shaderPrecisionFormat === thisArg,
            );

            // webglPropName
            // shaderType
            // precisionType,
            // rangeMin
            // rangeMax
            // precision
            const {
                webglPropName,
                shaderType,
                precisionType,
                rangeMin,
                rangeMax,
                precision,
            } = r;

            const fake_r = fakeDD[webglPropName].shaderPrecisionFormats.find(
                e => e.shaderType === shaderType
                    && e.precisionType === precisionType,
            );

            const result = fake_r ? fake_r.r.precision : precisionType;
            return result;
        },
    });

    // noinspection JSUnusedLocalSymbols
    utils.replaceGetterWithProxy(WebGLShaderPrecisionFormat.prototype, 'rangeMin', {
        apply(target, thisArg, args) {
            _Reflect.apply(target, thisArg, args);

            const r = shaderPrecisionFormats.find(
                e => e.shaderPrecisionFormat === thisArg,
            );

            const {
                webglPropName,
                shaderType,
                precisionType,
                rangeMin,
                rangeMax,
                precision,
            } = r;

            const fake_r = fakeDD[webglPropName].shaderPrecisionFormats.find(
                e => e.shaderType === shaderType
                    && e.precisionType === precisionType,
            );

            const result = fake_r ? fake_r.r.rangeMin : rangeMin;
            return result;
        },
    });

    // noinspection JSUnusedLocalSymbols
    utils.replaceGetterWithProxy(WebGLShaderPrecisionFormat.prototype, 'rangeMax', {
        apply(target, thisArg, args) {
            _Reflect.apply(target, thisArg, args);

            const r = shaderPrecisionFormats.find(
                e => e.shaderPrecisionFormat === thisArg,
            );

            const {
                webglPropName,
                shaderType,
                precisionType,
                rangeMin,
                rangeMax,
                precision,
            } = r;

            const fake_r = fakeDD[webglPropName].shaderPrecisionFormats.find(
                e => e.shaderType === shaderType
                    && e.precisionType === precisionType,
            );

            const result = fake_r ? fake_r.r.rangeMax : rangeMax;
            return result;
        },
    });
};

function permissions(fakePermissions, fakeUA) {
    const _Object = {};
    const _Reflect = {}// utils.cache.Reflect;

    // after test, iOS chrome did not implements `navigator.permissions`
    const osType = utils.osType(fakeUA)
    if (osType === 'iPhone' || osType === 'iPad' || osType === 'iPod') {
        delete _Object.getPrototypeOf(navigator).permission;
    } else {
        if ('undefined' !== typeof Notification) {
            utils.replaceGetterWithProxy(Notification, 'permission', {
                apply(target, thisArg, args) {
                    _Reflect.apply(target, thisArg, args);
                    return 'default';
                },
            });
        }

        // We need to handle exceptions
        utils.replaceWithProxy(Permissions.prototype, 'query', {
            apply(target, thisArg, args) {
                const param = (args || [])[0];
                const paramName = param && param.name;

                return new utils.cache.Promise((resolve, reject) => {
                    const permission = fakePermissions[paramName];

                    if (permission) {
                        let exType = permission.exType;
                        if (exType) {
                            if (!globalThis[exType]) {
                                exType = 'Error';
                            }

                            return reject(
                                utils.patchError(new globalThis[exType](permission.msg), 'apply'),
                            );
                        }

                        let state = permission.state;
                        if (state) {
                            return resolve(_Object.setPrototypeOf({
                                state: state,
                                onchange: null,
                            }, PermissionStatus.prototype));
                        }
                    }

                    _Reflect.apply(...arguments).then(result => {
                        return resolve(result);
                    }).catch(ex => {
                        return reject(utils.patchError(ex, 'apply'));
                    });
                });
            },
        });
    }
};

function plugins(chromeMajorVersion, fakePlugins) {
    const kPluginsLessThen93 = {
        'mimeTypes': [
            {
                'type': 'application/pdf',
                'suffixes': 'pdf',
                'description': '',
                '__pluginName': 'Chrome PDF Viewer',
            },
            {
                'type': 'application/x-google-chrome-pdf',
                'suffixes': 'pdf',
                'description': 'Portable Document Format',
                '__pluginName': 'Chrome PDF Plugin',
            },
            {
                'type': 'application/x-nacl',
                'suffixes': '',
                'description': 'Native Client Executable',
                '__pluginName': 'Native Client',
            },
            {
                'type': 'application/x-pnacl',
                'suffixes': '',
                'description': 'Portable Native Client Executable',
                '__pluginName': 'Native Client',
            },
        ],
        'plugins': [
            {
                'name': 'Chrome PDF Plugin',
                'filename': 'internal-pdf-viewer',
                'description': 'Portable Document Format',
                '__mimeTypes': [
                    'application/x-google-chrome-pdf',
                ],
            },
            {
                'name': 'Chrome PDF Viewer',
                'filename': 'mhjfbmdgcfjbbpaeojofohoefgiehjai',
                'description': '',
                '__mimeTypes': [
                    'application/pdf',
                ],
            },
            {
                'name': 'Native Client',
                'filename': 'internal-nacl-plugin',
                'description': '',
                '__mimeTypes': [
                    'application/x-nacl',
                    'application/x-pnacl',
                ],
            },
        ],
    };

    const kPluginsGreaterThen93 = {
        mimeTypes: [
            {
                type: 'application/pdf',
                suffixes: 'pdf',
                description: 'Portable Document Format',
                __pluginName: 'PDF Viewer',
            },
            {
                type: 'text/pdf',
                suffixes: 'pdf',
                description: 'Portable Document Format',
                __pluginName: 'PDF Viewer',
            },
        ],
        plugins: [
            {
                name: 'PDF Viewer',
                filename: 'internal-pdf-viewer',
                description: 'Portable Document Format',
                __mimeTypes: ['application/pdf', 'text/pdf'],
            },
            {
                name: 'Chrome PDF Viewer',
                filename: 'internal-pdf-viewer',
                description: 'Portable Document Format',
                __mimeTypes: ['application/pdf', 'text/pdf'],
            },
            {
                name: 'Chromium PDF Viewer',
                filename: 'internal-pdf-viewer',
                description: 'Portable Document Format',
                __mimeTypes: ['application/pdf', 'text/pdf'],
            },
            {
                name: 'Microsoft Edge PDF Viewer',
                filename: 'internal-pdf-viewer',
                description: 'Portable Document Format',
                __mimeTypes: ['application/pdf', 'text/pdf'],
            },
            {
                name: 'WebKit built-in PDF',
                filename: 'internal-pdf-viewer',
                description: 'Portable Document Format',
                __mimeTypes: ['application/pdf', 'text/pdf'],
            },
        ],
    };

    const pluginsData =
        chromeMajorVersion > 93
            ? kPluginsGreaterThen93
            : fakePlugins;

    const _Object = utils.cache.Object;
    const _Reflect = {}// {};
    const _origPlugins = utils.cache.window.navigator.plugins;
    const _origMimeTypes = utils.cache.window.navigator.mimeTypes;

    // object correlations
    // pluginsData.plugins => pluginsCorr
    // pluginsData.mimes => mimeTypesCorr
    const pluginCorrs = [];
    const mimeTypeCorrs = [];

    const nativePluginArray = _Object.create(PluginArray.prototype);
    const nativeMimeTypeArray = _Object.create(MimeTypeArray.prototype);

    const makeNativeMimeType = (mimeType, bindNativePlugin) => {
        const mimeTypeData = pluginsData.mimeTypes.find(
            e => e.type === mimeType,
        );

        // always make new native object
        const nativeMimeType = _Object.create(MimeType.prototype);
        mimeTypeCorrs.push({
            nativeMimeType,
            mimeTypeData,
            enabledPlugin: bindNativePlugin, // bind to the called plugin
        });

        return nativeMimeType;
    };

    // define plugin items
    let pluginCounter = 0;
    for (const pluginData of pluginsData.plugins) {
        const {
            name,
            filename,
            description,
            __mimeTypes,
        } = pluginData;

        const nativePluginInner = _Object.create(Plugin.prototype);

        // navigator.plugins[0][0] NOT EQUALS to navigator.plugins[0][0], weird!
        // needs to proxy it
        const nativePlugin = new Proxy(nativePluginInner, {
            get: (target, property, receiver) => {
                const orgResult = _Reflect.get(target, property, receiver);
                let mimeType = null;
                const isInteger = property && Number.isInteger(Number(property));

                if (isInteger) {
                    const mimeIndex = Number(property) % Math.pow(2, 32);
                    mimeType = __mimeTypes[mimeIndex];
                } else {
                    if (__mimeTypes.includes(property)) {
                        mimeType = property;
                    }
                }

                if (mimeType) {
                    // make new nativeMimeType
                    const nativeMimeType = makeNativeMimeType(mimeType, nativePlugin);
                    return nativeMimeType;
                }

                return orgResult;
            },
        });

        pluginCorrs.push({
            nativePlugin,
            nativePluginInner,
            pluginData,
        });

        // define own properties of nativePluginArray
        // Object.getOwnPropertyNames(navigator.plugins)
        // including index, plugin name

        // index
        _Object.defineProperty(nativePluginArray, '' + pluginCounter, {
            configurable: true,
            enumerable: true,
            value: nativePlugin,
            writable: false,
        });

        // plugin name
        _Object.defineProperty(nativePluginArray, name, {
            configurable: true,
            enumerable: false,
            value: nativePlugin,
            writable: false,
        });

        ++pluginCounter;
    }

    // define mimetype items
    let mimeTypeCounter = 0;
    for (const mimeTypeData of pluginsData.mimeTypes) {
        const {
            type,
            suffixes,
            description,
            __pluginName,
        } = mimeTypeData;

        const pluginCorr = pluginCorrs.find(
            e => e.pluginData.name === __pluginName,
        );

        const nativeMimeType = makeNativeMimeType(type, pluginCorr.nativePlugin);

        // index
        _Object.defineProperty(nativeMimeTypeArray, '' + mimeTypeCounter, {
            configurable: true,
            enumerable: true,
            value: nativeMimeType,
            writable: false,
        });

        // plugin name
        _Object.defineProperty(nativeMimeTypeArray, type, {
            configurable: true,
            enumerable: false,
            value: nativeMimeType,
            writable: false,
        });

        ++mimeTypeCounter;
    }

    // define mimetypes of each native plugin object
    // like: Object.getOwnPropertyDescriptors(navigator.plugins[0])
    for (const { nativePluginInner, pluginData } of pluginCorrs) {
        const { __mimeTypes } = pluginData;

        for (let n = 0; n < __mimeTypes.length; ++n) {
            const mimeType = __mimeTypes[n];
            const nativeMimeType = mimeTypeCorrs.find(
                e => e.mimeTypeData.type === mimeType,
            ).nativeMimeType;

            _Object.defineProperty(nativePluginInner, '' + n, {
                configurable: true,
                enumerable: true,
                value: nativeMimeType,
                writable: false,
            });

            // plugin name
            _Object.defineProperty(nativePluginInner, mimeType, {
                configurable: true,
                enumerable: false,
                value: nativeMimeType,
                writable: false,
            });
        }
    }

    // ====================
    // following code starts hooking the properties and methods of each prototype
    // ====================

    // PluginArray.prototype.item
    utils.replaceWithProxy(PluginArray.prototype, 'item', {
        apply(target, thisArg, args) {
            let orgResult = null;
            try {
                orgResult = _Reflect.apply(target, thisArg, args);
            } catch (ex) {
                if (thisArg !== nativePluginArray) {
                    throw utils.patchError(ex, 'item');
                }
            }

            if (thisArg === nativePluginArray) {
                const isInteger = args[0] && Number.isInteger(Number(args[0]));
                const index = isInteger ? Number(args[0]) % Math.pow(2, 32) : 0;

                // never returns `undefined`
                if (index < 0 || index >= pluginCorrs.length) {
                    return null;
                }

                return pluginCorrs[index].nativePlugin;
            }

            return orgResult;
        },
    });

    // PluginArray.prototype.length
    utils.replaceGetterWithProxy(PluginArray.prototype, 'length', {
        apply(target, thisArg, args) {
            let orgResult = null;
            try {
                orgResult = _Reflect.apply(target, thisArg, args);
            } catch (ex) {
                if (thisArg !== nativePluginArray) {
                    throw utils.patchError(ex, 'length');
                }
            }

            if (thisArg === nativePluginArray) {
                return pluginsData.plugins.length;
            }

            return orgResult;
        },
    });

    // PluginArray.prototype.namedItem
    utils.replaceWithProxy(PluginArray.prototype, 'namedItem', {
        apply(target, thisArg, args) {
            let orgResult = null;
            try {
                orgResult = _Reflect.apply(target, thisArg, args);
            } catch (ex) {
                if (thisArg !== nativePluginArray) {
                    throw utils.patchError(ex, 'namedItem');
                }
            }

            if (thisArg === nativePluginArray) {
                const name = args[0];
                const pluginCorr = pluginCorrs.find(e => e.pluginData.name === name);

                if (!pluginCorr) {
                    return null;
                }

                return pluginCorr.nativePlugin;
            }

            return orgResult;
        },
    });

    // PluginArray.prototype.refresh
    utils.replaceWithProxy(PluginArray.prototype, 'refresh', {
        apply(target, thisArg, args) {
            let orgResult = null;
            try {
                orgResult = _Reflect.apply(target, thisArg, args);
            } catch (ex) {
                if (thisArg !== nativePluginArray) {
                    throw utils.patchError(ex, 'refresh');
                }
            }

            if (thisArg === nativePluginArray) {
                return undefined;
            }

            return orgResult;
        },
    });

    // PluginArray.prototype.Symbol.iterator
    utils.replaceWithProxy(PluginArray.prototype, Symbol.iterator, {
        apply(target, thisArg, args) {
            let orgResult = null;
            try {
                orgResult = _Reflect.apply(target, thisArg, args);
            } catch (ex) {
                if (thisArg !== nativePluginArray) {
                    throw utils.patchError(ex, 'Symbol.iterator');
                }
            }

            if (thisArg === nativePluginArray) {
                const nativePluginObjs = pluginCorrs.map(e => e.nativePlugin);
                return nativePluginObjs[Symbol.iterator].bind(nativePluginObjs)();
            }

            return orgResult;
        },
    });

    // MimeTypeArray.prototype.item
    utils.replaceWithProxy(MimeTypeArray.prototype, 'item', {
        apply(target, thisArg, args) {
            let orgResult = null;
            try {
                orgResult = _Reflect.apply(target, thisArg, args);
            } catch (ex) {
                if (thisArg !== nativeMimeTypeArray) {
                    throw utils.patchError(ex, 'item');
                }
            }

            if (thisArg === nativeMimeTypeArray) {
                const isInteger = args[0] && Number.isInteger(Number(args[0]));
                const index = isInteger ? Number(args[0]) % Math.pow(2, 32) : 0;
                if (index < 0 || index >= mimeTypeCorrs.length) {
                    return null;
                }

                return mimeTypeCorrs[index].nativeMimeType;
            }

            return orgResult;
        },
    });

    // MimeTypeArray.prototype.length
    utils.replaceGetterWithProxy(MimeTypeArray.prototype, 'length', {
        apply(target, thisArg, args) {
            let orgResult = null;
            try {
                orgResult = _Reflect.apply(target, thisArg, args);
            } catch (ex) {
                if (thisArg !== nativeMimeTypeArray) {
                    throw utils.patchError(ex, 'length');
                }
            }

            if (thisArg === nativeMimeTypeArray) {
                return pluginsData.mimeTypes.length;
            }

            return orgResult;
        },
    });

    // MimeTypeArray.prototype.namedItem
    utils.replaceWithProxy(MimeTypeArray.prototype, 'namedItem', {
        apply(target, thisArg, args) {
            let orgResult = null;
            try {
                orgResult = _Reflect.apply(target, thisArg, args);
            } catch (ex) {
                if (thisArg !== nativeMimeTypeArray) {
                    throw utils.patchError(ex, 'namedItem');
                }
            }

            if (thisArg === nativeMimeTypeArray) {
                const name = args[0];
                const mimeTypeCorr = mimeTypeCorrs.find(e => e.mimeTypeData.name === name);

                if (!mimeTypeCorr) {
                    return null;
                }

                return mimeTypeCorr.nativeMimeType;
            }

            return orgResult;
        },
    });

    // MimeTypeArray.prototype.Symbol.iterator
    utils.replaceWithProxy(MimeTypeArray.prototype, Symbol.iterator, {
        apply(target, thisArg, args) {
            let orgResult = null;
            try {
                orgResult = _Reflect.apply(target, thisArg, args);
            } catch (ex) {
                if (thisArg !== nativeMimeTypeArray) {
                    throw utils.patchError(ex, 'Symbol.iterator');
                }
            }

            if (thisArg === nativeMimeTypeArray) {
                const nativeMimeTypeObjs = mimeTypeCorrs.map(e => e.nativeMimeType);
                return nativeMimeTypeObjs[Symbol.iterator].bind(nativeMimeTypeObjs)();
            }

            return orgResult;
        },
    });

    // Plugin.prototype.description.get
    utils.replaceGetterWithProxy(Plugin.prototype, 'description', {
        apply(target, thisArg, args) {
            let orgResult = null;
            try {
                orgResult = _Reflect.apply(target, thisArg, args);
            } catch (ex) {
                if (thisArg === Plugin.prototype) {
                    throw utils.patchError(ex, 'description');
                }
            }

            const pluginCorr = pluginCorrs.find(e => e.nativePlugin === thisArg);
            if (pluginCorr) {
                return pluginCorr.pluginData.description;
            }

            return orgResult;
        },
    });

    // Plugin.prototype.filename.get
    utils.replaceGetterWithProxy(Plugin.prototype, 'filename', {
        apply(target, thisArg, args) {
            let orgResult = null;
            try {
                orgResult = _Reflect.apply(target, thisArg, args);
            } catch (ex) {
                if (thisArg === Plugin.prototype) {
                    throw utils.patchError(ex, 'filename');
                }
            }

            const pluginCorr = pluginCorrs.find(e => e.nativePlugin === thisArg);
            if (pluginCorr) {
                return pluginCorr.pluginData.filename;
            }

            return orgResult;
        },
    });

    // Plugin.prototype.item.value
    utils.replaceWithProxy(Plugin.prototype, 'item', {
        apply(target, thisArg, args) {
            let orgResult = null;
            try {
                orgResult = _Reflect.apply(target, thisArg, args);
            } catch (ex) {
                if (thisArg === Plugin.prototype) {
                    throw utils.patchError(ex, 'item');
                }
            }

            const pluginCorr = pluginCorrs.find(e => e.nativePlugin === thisArg);
            if (pluginCorr) {
                const isInteger = args[0] && Number.isInteger(Number(args[0]));
                const index = isInteger ? Number(args[0]) % Math.pow(2, 32) : 0;
                if (index < 0 || index >= pluginCorr.pluginData.__mimeTypes.length) {
                    return null;
                }

                const mimeType = pluginCorr.pluginData.__mimeTypes[index];
                const nativeMimeType = makeNativeMimeType(mimeType, thisArg);

                return nativeMimeType;
            }

            return orgResult;
        },
    });

    // Plugin.prototype.length.get
    utils.replaceGetterWithProxy(Plugin.prototype, 'length', {
        apply(target, thisArg, args) {
            let orgResult = null;
            try {
                orgResult = _Reflect.apply(target, thisArg, args);
            } catch (ex) {
                if (thisArg === Plugin.prototype) {
                    throw utils.patchError(ex, 'length');
                }
            }

            const pluginCorr = pluginCorrs.find(e => e.nativePlugin === thisArg);
            if (pluginCorr) {
                return pluginCorr.pluginData.__mimeTypes.length;
            }

            return orgResult;
        },
    });

    // Plugin.prototype.name.get
    utils.replaceGetterWithProxy(Plugin.prototype, 'name', {
        apply(target, thisArg, args) {
            let orgResult = null;
            try {
                orgResult = _Reflect.apply(target, thisArg, args);
            } catch (ex) {
                if (thisArg === Plugin.prototype) {
                    throw utils.patchError(ex, 'name');
                }
            }

            const pluginCorr = pluginCorrs.find(e => e.nativePlugin === thisArg);
            if (pluginCorr) {
                return pluginCorr.pluginData.name;
            }

            return orgResult;
        },
    });

    // Plugin.prototype.namedItem.value
    utils.replaceWithProxy(Plugin.prototype, 'namedItem', {
        apply(target, thisArg, args) {
            let orgResult = null;
            try {
                orgResult = _Reflect.apply(target, thisArg, args);
            } catch (ex) {
                if (thisArg === Plugin.prototype) {
                    throw utils.patchError(ex, 'namedItem');
                }
            }

            const pluginCorr = pluginCorrs.find(e => e.nativePlugin === thisArg);
            if (pluginCorr) {
                const mimeType = args[0];
                if (!pluginCorr.pluginData.__mimeTypes.includes(mimeType)) {
                    return null;
                }

                const nativeMimeType = makeNativeMimeType(mimeType, thisArg);
                return nativeMimeType;
            }

            return orgResult;
        },
    });

    // Plugin.prototype.[Symbol.iterator].value
    utils.replaceWithProxy(Plugin.prototype, Symbol.iterator, {
        apply(target, thisArg, args) {
            let orgResult = null;
            try {
                orgResult = _Reflect.apply(target, thisArg, args);
            } catch (ex) {
                if (thisArg === Plugin.prototype) {
                    throw utils.patchError(ex, 'Symbol.iterator');
                }
            }

            const pluginCorr = pluginCorrs.find(e => e.nativePlugin === thisArg);
            if (pluginCorr) {
                const nativeMimeTypes = [];
                for (const mimeType of pluginCorr.pluginData.__mimeTypes) {
                    const nativeMimeType = makeNativeMimeType(mimeType, thisArg);
                    nativeMimeTypes.push(nativeMimeType);
                }

                return nativeMimeTypes[Symbol.iterator].bind(nativeMimeTypes)();
            }

            return orgResult;
        },
    });

    // MimeType.prototype.description.get
    utils.replaceGetterWithProxy(MimeType.prototype, 'description', {
        apply(target, thisArg, args) {
            let orgResult = null;
            try {
                orgResult = _Reflect.apply(target, thisArg, args);
            } catch (ex) {
                if (thisArg === MimeType.prototype) {
                    throw utils.patchError(ex, 'description');
                }
            }

            const mimeTypeCorr = mimeTypeCorrs.find(e => e.nativeMimeType === thisArg);
            if (mimeTypeCorr) {
                return mimeTypeCorr.mimeTypeData.description;
            }

            return orgResult;
        },
    });

    // MimeType.prototype.enabledPlugin.get
    utils.replaceGetterWithProxy(MimeType.prototype, 'enabledPlugin', {
        apply(target, thisArg, args) {
            let orgResult = null;
            try {
                orgResult = _Reflect.apply(target, thisArg, args);
            } catch (ex) {
                if (thisArg === MimeType.prototype) {
                    throw utils.patchError(ex, 'enabledPlugin');
                }
            }

            const mimeTypeCorr = mimeTypeCorrs.find(e => e.nativeMimeType === thisArg);
            if (mimeTypeCorr) {
                return mimeTypeCorr.enabledPlugin;
            }

            return orgResult;
        },
    });

    // MimeType.prototype.suffixes.get
    utils.replaceGetterWithProxy(MimeType.prototype, 'suffixes', {
        apply(target, thisArg, args) {
            let orgResult = null;
            try {
                orgResult = _Reflect.apply(target, thisArg, args);
            } catch (ex) {
                if (thisArg === MimeType.prototype) {
                    throw utils.patchError(ex, 'suffixes');
                }
            }

            const mimeTypeCorr = mimeTypeCorrs.find(e => e.nativeMimeType === thisArg);
            if (mimeTypeCorr) {
                return mimeTypeCorr.mimeTypeData.suffixes;
            }

            return orgResult;
        },
    });

    // MimeType.prototype.type.get
    utils.replaceGetterWithProxy(MimeType.prototype, 'type', {
        apply(target, thisArg, args) {
            let orgResult = null;
            try {
                orgResult = _Reflect.apply(target, thisArg, args);
            } catch (ex) {
                if (thisArg === MimeType.prototype) {
                    throw utils.patchError(ex, 'type');
                }
            }

            const mimeTypeCorr = mimeTypeCorrs.find(e => e.nativeMimeType === thisArg);
            if (mimeTypeCorr) {
                return mimeTypeCorr.mimeTypeData.type;
            }

            return orgResult;
        },
    });

    // final return results
    utils.replaceGetterWithProxy(Navigator.prototype, 'plugins', {
        apply(target, thisArg, args) {
            const orgResult = _Reflect.apply(target, thisArg, args);
            if (thisArg === utils.cache.window.navigator) {
                return nativePluginArray;
                // return _origPlugins;
            }

            return orgResult;
        },
    });

    utils.replaceGetterWithProxy(Navigator.prototype, 'mimeTypes', {
        apply(target, thisArg, args) {
            const orgResult = _Reflect.apply(target, thisArg, args);
            if (thisArg === utils.cache.window.navigator) {
                return nativeMimeTypeArray;
                // return _origMimeTypes;
            }

            return orgResult;
        },
    });
};

function canvas_hash() {
    // canvas
    const canvas = document.createElement('canvas');
    canvas.width = 220;
    canvas.height = 30;
    const ctx = canvas.getContext('2d');

    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fillRect(x, y, 1, 1);
        }
    }

    const randomDataURL = canvas.toDataURL('image/png');
    const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;

    // Override the toDataURL method for specific dimensions
    HTMLCanvasElement.prototype.toDataURL = function (type) {
        if (type === 'image/png' && this.width === 220 && this.height === 30) {
            return randomDataURL;
        }
        return originalToDataURL.apply(this, arguments);
    };
}

function emoji() {
    const _Reflect = utils.cache.Reflect;

    utils.replaceWithProxy(String, 'fromCodePoint', {
        apply(target, thisArg, args) {
            const result = _Reflect.apply(target, thisArg, args);
            return result;
        },
    });
}

function media(fakeMediaDevices) {
    const _Reflect = utils.cache.Reflect;

    if ('undefined' !== typeof MediaDevices) {
        // The original value is changed only once at beginning
        const hex = '01234567890abcdef';
        const to = hex[Math.floor(Math.random() * hex.length)];
        const index = 4 + Math.floor(Math.random() * 32);

        const tempMediaDeviceObjs = [];
        for (let mediaDevice of fakeMediaDevices) {
            const json = JSON.stringify(mediaDevice);
            mediaDevice.groupId = mediaDevice.groupId.substr(0, index) + to + mediaDevice.groupId.substr(index + 1);

            const o = utils.cache.Object.create(
                mediaDevice.kind.includes('output')
                    ? MediaDeviceInfo.prototype
                    : InputDeviceInfo.prototype, {
                deviceId: {
                    value: mediaDevice.deviceId,
                    writable: false,
                    enumerable: false,
                    configurable: true,
                },
                kind: {
                    value: mediaDevice.kind,
                    writable: false,
                    enumerable: false,
                    configurable: true,
                },
                label: {
                    value: mediaDevice.label,
                    writable: false,
                    enumerable: false,
                    configurable: true,
                },
                groupId: {
                    value: mediaDevice.groupId,
                    writable: false,
                    enumerable: false,
                    configurable: true,
                },
            });

            const blacklist = ['deviceId', 'kind', 'label', 'groupId', 'toJSON'];
            utils.mockWithProxy(
                o,
                'toJSON',
                window.alert,
                {},
                {
                    apply(target, thisArg, args) {
                        return json;
                    },
                });

            utils.replaceObjPathWithProxy('InputDeviceInfo.prototype.getCapabilities', {
                apply(target, thisArg, args) {
                    _Reflect.apply(target, thisArg, args);
                    return {};
                },
            });

            const p = utils.newProxyInstance(o, {
                // ownKeys(target) {
                //     return Reflect.ownKeys(target).filter(k => !blacklist.includes(k));
                // },
                getOwnPropertyDescriptor(target, prop) {
                    if (blacklist.includes(prop)) {
                        return undefined;
                    }

                    return _Reflect.getOwnPropertyDescriptor(target, prop);
                },
            });

            tempMediaDeviceObjs.push({
                p,
                v: mediaDevice,
            });
        }

        utils.replaceWithProxy(MediaDevices.prototype, 'enumerateDevices', {
            apply(target, thisArg, args) {
                try {
                    _Reflect.apply(target, thisArg, args).catch(e => e);
                } catch (ignored) {
                }

                return Promise.resolve(tempMediaDeviceObjs.map(e => e.p));
            },
        });
    }

}


function log_data() {
    function logInfo(title, value) {
        console.log(`${title}:`, value);
    }

    logInfo('User Agent', navigator.userAgent);

    logInfo('WebRTC', {
        isSupported: !!navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia
    });

    const canvas = document.createElement('canvas');
    const canvasInfo = {
        canvasAvailable: !!canvas.getContext('2d'),
        canvas2dContext: canvas.getContext('2d') ? 'available' : 'not available'
    };
    logInfo('Canvas', canvasInfo);

    const webglCanvas = document.createElement('canvas');
    const webglInfo = {
        webglAvailable: !!webglCanvas.getContext('webgl') || !!webglCanvas.getContext('experimental-webgl')
    };
    logInfo('WebGL', webglInfo);

    const gl = webglCanvas.getContext('webgl') || webglCanvas.getContext('experimental-webgl');
    if (gl) {
        const webglInfo = {
            renderer: gl.getParameter(gl.RENDERER),
            vendor: gl.getParameter(gl.VENDOR),
            version: gl.getParameter(gl.VERSION)
        };
        logInfo('WebGL Info', webglInfo);
    }

    const webgpuAvailable = !!navigator.gpu;
    logInfo('WebGPU', { isSupported: webgpuAvailable });

    const clientRectsAvailable = 'getClientRects' in document.body;
    logInfo('Client Rects', { isSupported: clientRectsAvailable });

    logInfo('Timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);

    logInfo('Language', navigator.language);

    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            position => logInfo('Geolocation', position.coords),
            error => logInfo('Geolocation Error', error.message)
        );
    } else {
        logInfo('Geolocation', 'Not available');
    }

    logInfo('CPU', navigator.hardwareConcurrency);
    logInfo('Memory', `${(navigator.deviceMemory || 0).toFixed(2)} GB`);

    if ('mediaDevices' in navigator) {
        navigator.mediaDevices.enumerateDevices().then(devices => {
            const audioInputs = devices.filter(device => device.kind === 'audioinput').length;
            const audioOutputs = devices.filter(device => device.kind === 'audiooutput').length;
            const videoInputs = devices.filter(device => device.kind === 'videoinput').length;
            logInfo('Screen Media Devices', {
                audioInputs: audioInputs,
                audioOutputs: audioOutputs,
                videoInputs: videoInputs
            });
        });
    } else {
        logInfo('Screen Media Devices', 'Not available');
    }
}

try { Capabilities() } catch (err) {
    console.log("Capabilities", err)
}
try { Webdriver() } catch (err) {
    console.log("Webdriver", err)
}

try { WebRTC() } catch (err) {
    console.log("WebRTC", err)
}

try { chrome() } catch (err) {
    console.log("chrome", err)
}

try { permissions(dd.permissions, dd.navigator.userAgent) } catch (err) {
    console.log("permissions", err)
}

try { webGl(dd) } catch (err) {
    console.log("webGl", err)
}

try { plugins("116.0.0", dd.plugins) } catch (err) {
    console.log("plugins", err)
}

try { canvas_hash() } catch (err) {
    console.log("canvas_hash", err)
}

try { media(dd.mediaDevices) } catch (err) {
    console.log("media device", err)
}


log_data()