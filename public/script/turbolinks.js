/*
Turbolinks 5.0.0.beta4
Copyright © 2016 Basecamp, LLC
 */
(function() {
	this.Turbolinks = {
		supported: function() {
			return null != window.history.pushState && null != window.requestAnimationFrame
		}(),
		visit: function(t, e) {
			return Turbolinks.controller.visit(t, e)
		},
		clearCache: function() {
			return Turbolinks.controller.clearCache()
		}
	}
}).call(this),
	function() {
		var t, e;
		Turbolinks.copyObject = function(t) {
			var e, r, n;
			r = {};
			for (e in t) n = t[e], r[e] = n;
			return r
		}, Turbolinks.closest = function(e, r) {
			return t.call(e, r)
		}, t = function() {
			var t, r;
			return t = document.documentElement, null != (r = t.closest) ? r : function(t) {
				var r;
				for (r = this; r;) {
					if (r.nodeType === Node.ELEMENT_NODE && e.call(r, t)) return r;
					r = r.parentNode
				}
			}
		}(), Turbolinks.defer = function(t) {
			return setTimeout(t, 1)
		}, Turbolinks.dispatch = function(t, e) {
			var r, n, o, i, s;
			return i = null != e ? e : {}, s = i.target, r = i.cancelable, n = i.data, o = document.createEvent("Events"), o.initEvent(t, !0, r === !0), o.data = null != n ? n : {}, (null != s ? s : document).dispatchEvent(o), o
		}, Turbolinks.match = function(t, r) {
			return e.call(t, r)
		}, e = function() {
			var t, e, r, n;
			return t = document.documentElement, null != (e = null != (r = null != (n = t.matchesSelector) ? n : t.webkitMatchesSelector) ? r : t.msMatchesSelector) ? e : t.mozMatchesSelector
		}(), Turbolinks.uuid = function() {
			var t, e, r;
			for (r = "", t = e = 1; 36 >= e; t = ++e) r += 9 === t || 14 === t || 19 === t || 24 === t ? "-" : 15 === t ? "4" : 20 === t ? (Math.floor(4 * Math.random()) + 8).toString(16) : Math.floor(15 * Math.random()).toString(16);
			return r
		}
	}.call(this),
	function() {
		Turbolinks.Location = function() {
			function t(t) {
				var e, r;
				null == t && (t = ""), r = document.createElement("a"), r.href = t.toString(), this.absoluteURL = r.href, e = r.hash.length, 2 > e ? this.requestURL = this.absoluteURL : (this.requestURL = this.absoluteURL.slice(0, -e), this.anchor = r.hash.slice(1))
			}
			var e, r, n, o;
			return t.wrap = function(t) {
				return t instanceof this ? t : new this(t)
			}, t.prototype.getOrigin = function() {
				return this.absoluteURL.split("/", 3).join("/")
			}, t.prototype.getPath = function() {
				var t, e;
				return null != (t = null != (e = this.absoluteURL.match(/\/\/[^\/]*(\/[^?;]*)/)) ? e[1] : void 0) ? t : "/"
			}, t.prototype.getPathComponents = function() {
				return this.getPath().split("/").slice(1)
			}, t.prototype.getLastPathComponent = function() {
				return this.getPathComponents().slice(-1)[0]
			}, t.prototype.getExtension = function() {
				var t;
				return null != (t = this.getLastPathComponent().match(/\.[^.]*$/)) ? t[0] : void 0
			}, t.prototype.isHTML = function() {
				var t;
				return t = this.getExtension(), ".html" === t || null == t
			}, t.prototype.isPrefixedBy = function(t) {
				var e;
				return e = r(t), this.isEqualTo(t) || o(this.absoluteURL, e)
			}, t.prototype.isEqualTo = function(t) {
				return this.absoluteURL === (null != t ? t.absoluteURL : void 0)
			}, t.prototype.toCacheKey = function() {
				return this.requestURL
			}, t.prototype.toJSON = function() {
				return this.absoluteURL
			}, t.prototype.toString = function() {
				return this.absoluteURL
			}, t.prototype.valueOf = function() {
				return this.absoluteURL
			}, r = function(t) {
				return e(t.getOrigin() + t.getPath())
			}, e = function(t) {
				return n(t, "/") ? t : t + "/"
			}, o = function(t, e) {
				return t.slice(0, e.length) === e
			}, n = function(t, e) {
				return t.slice(-e.length) === e
			}, t
		}()
	}.call(this),
	function() {
		var t = function(t, e) {
			return function() {
				return t.apply(e, arguments)
			}
		};
		Turbolinks.HttpRequest = function() {
			function e(e, r, n) {
				this.delegate = e, this.requestCanceled = t(this.requestCanceled, this), this.requestTimedOut = t(this.requestTimedOut, this), this.requestFailed = t(this.requestFailed, this), this.requestLoaded = t(this.requestLoaded, this), this.requestProgressed = t(this.requestProgressed, this), this.url = Turbolinks.Location.wrap(r).requestURL, this.referrer = Turbolinks.Location.wrap(n).absoluteURL, this.createXHR()
			}
			return e.NETWORK_FAILURE = 0, e.TIMEOUT_FAILURE = -1, e.timeout = 60, e.prototype.send = function() {
				var t;
				return this.xhr && !this.sent ? (this.notifyApplicationBeforeRequestStart(), this.setProgress(0), this.xhr.send(), this.sent = !0, "function" == typeof(t = this.delegate).requestStarted ? t.requestStarted() : void 0) : void 0
			}, e.prototype.cancel = function() {
				return this.xhr && this.sent ? this.xhr.abort() : void 0
			}, e.prototype.requestProgressed = function(t) {
				return t.lengthComputable ? this.setProgress(t.loaded / t.total) : void 0
			}, e.prototype.requestLoaded = function() {
				return this.endRequest(function(t) {
					return function() {
						var e;
						return 200 <= (e = t.xhr.status) && 300 > e ? t.delegate.requestCompletedWithResponse(t.xhr.responseText, t.xhr.getResponseHeader("Turbolinks-Location")) : (t.failed = !0, t.delegate.requestFailedWithStatusCode(t.xhr.status, t.xhr.responseText))
					}
				}(this))
			}, e.prototype.requestFailed = function() {
				return this.endRequest(function(t) {
					return function() {
						return t.failed = !0, t.delegate.requestFailedWithStatusCode(t.constructor.NETWORK_FAILURE)
					}
				}(this))
			}, e.prototype.requestTimedOut = function() {
				return this.endRequest(function(t) {
					return function() {
						return t.failed = !0, t.delegate.requestFailedWithStatusCode(t.constructor.TIMEOUT_FAILURE)
					}
				}(this))
			}, e.prototype.requestCanceled = function() {
				return this.endRequest()
			}, e.prototype.notifyApplicationBeforeRequestStart = function() {
				return Turbolinks.dispatch("turbolinks:request-start", {
					data: {
						url: this.url,
						xhr: this.xhr
					}
				})
			}, e.prototype.notifyApplicationAfterRequestEnd = function() {
				return Turbolinks.dispatch("turbolinks:request-end", {
					data: {
						url: this.url,
						xhr: this.xhr
					}
				})
			}, e.prototype.createXHR = function() {
				return this.xhr = new XMLHttpRequest, this.xhr.open("GET", this.url, !0), this.xhr.timeout = 1e3 * this.constructor.timeout, this.xhr.setRequestHeader("Accept", "text/html, application/xhtml+xml"), this.xhr.setRequestHeader("Turbolinks-Referrer", this.referrer), this.xhr.onprogress = this.requestProgressed, this.xhr.onload = this.requestLoaded, this.xhr.onerror = this.requestFailed, this.xhr.ontimeout = this.requestTimedOut, this.xhr.onabort = this.requestCanceled
			}, e.prototype.endRequest = function(t) {
				return this.xhr ? (this.notifyApplicationAfterRequestEnd(), null != t && t.call(this), this.destroy()) : void 0
			}, e.prototype.setProgress = function(t) {
				var e;
				return this.progress = t, "function" == typeof(e = this.delegate).requestProgressed ? e.requestProgressed(this.progress) : void 0
			}, e.prototype.destroy = function() {
				var t;
				return this.setProgress(1), "function" == typeof(t = this.delegate).requestFinished && t.requestFinished(), this.delegate = null, this.xhr = null
			}, e
		}()
	}.call(this),
	function() {
		var t = function(t, e) {
			return function() {
				return t.apply(e, arguments)
			}
		};
		Turbolinks.ProgressBar = function() {
			function e() {
				this.trickle = t(this.trickle, this), this.stylesheetElement = this.createStylesheetElement(), this.progressElement = this.createProgressElement()
			}
			var r;
			return r = 300, e.defaultCSS = ".turbolinks-progress-bar {\n  position: fixed;\n  display: block;\n  top: 0;\n  left: 0;\n  height: 3px;\n  background: #0076ff;\n  z-index: 9999;\n  transition: width " + r + "ms ease-out, opacity " + r / 2 + "ms " + r / 2 + "ms ease-in;\n  transform: translate3d(0, 0, 0);\n}", e.prototype.show = function() {
				return this.visible ? void 0 : (this.visible = !0, this.installStylesheetElement(), this.installProgressElement(), this.startTrickling())
			}, e.prototype.hide = function() {
				return this.visible && !this.hiding ? (this.hiding = !0, this.fadeProgressElement(function(t) {
					return function() {
						return t.uninstallProgressElement(), t.stopTrickling(), t.visible = !1, t.hiding = !1
					}
				}(this))) : void 0
			}, e.prototype.setValue = function(t) {
				return this.value = t, this.refresh()
			}, e.prototype.installStylesheetElement = function() {
				return document.head.insertBefore(this.stylesheetElement, document.head.firstChild)
			}, e.prototype.installProgressElement = function() {
				return this.progressElement.style.width = 0, this.progressElement.style.opacity = 1, document.documentElement.insertBefore(this.progressElement, document.body), this.refresh()
			}, e.prototype.fadeProgressElement = function(t) {
				return this.progressElement.style.opacity = 0, setTimeout(t, 1.5 * r)
			}, e.prototype.uninstallProgressElement = function() {
				return this.progressElement.parentNode ? document.documentElement.removeChild(this.progressElement) : void 0
			}, e.prototype.startTrickling = function() {
				return null != this.trickleInterval ? this.trickleInterval : this.trickleInterval = setInterval(this.trickle, r)
			}, e.prototype.stopTrickling = function() {
				return clearInterval(this.trickleInterval), this.trickleInterval = null
			}, e.prototype.trickle = function() {
				return this.setValue(this.value + Math.random() / 100)
			}, e.prototype.refresh = function() {
				return requestAnimationFrame(function(t) {
					return function() {
						return t.progressElement.style.width = 10 + 90 * t.value + "%"
					}
				}(this))
			}, e.prototype.createStylesheetElement = function() {
				var t;
				return t = document.createElement("style"), t.type = "text/css", t.textContent = this.constructor.defaultCSS, t
			}, e.prototype.createProgressElement = function() {
				var t;
				return t = document.createElement("div"), t.classList.add("turbolinks-progress-bar"), t
			}, e
		}()
	}.call(this),
	function() {
		var t = function(t, e) {
			return function() {
				return t.apply(e, arguments)
			}
		};
		Turbolinks.BrowserAdapter = function() {
			function e(e) {
				this.controller = e, this.showProgressBar = t(this.showProgressBar, this), this.progressBar = new Turbolinks.ProgressBar
			}
			var r, n, o, i;
			return i = Turbolinks.HttpRequest, r = i.NETWORK_FAILURE, o = i.TIMEOUT_FAILURE, n = 500, e.prototype.visitProposedToLocationWithAction = function(t, e) {
				return this.controller.startVisitToLocationWithAction(t, e)
			}, e.prototype.visitStarted = function(t) {
				return t.issueRequest(), t.changeHistory(), t.loadCachedSnapshot()
			}, e.prototype.visitRequestStarted = function(t) {
				return this.progressBar.setValue(0), t.hasCachedSnapshot() || "restore" !== t.action ? this.showProgressBarAfterDelay() : this.showProgressBar()
			}, e.prototype.visitRequestProgressed = function(t) {
				return this.progressBar.setValue(t.progress)
			}, e.prototype.visitRequestCompleted = function(t) {
				return t.loadResponse()
			}, e.prototype.visitRequestFailedWithStatusCode = function(t, e) {
				switch (e) {
					case r:
					case o:
						return this.reload();
					default:
						return t.loadResponse()
				}
			}, e.prototype.visitRequestFinished = function(t) {
				return this.hideProgressBar()
			}, e.prototype.visitCompleted = function(t) {
				return t.followRedirect()
			}, e.prototype.pageInvalidated = function() {
				return this.reload()
			}, e.prototype.showProgressBarAfterDelay = function() {
				return this.progressBarTimeout = setTimeout(this.showProgressBar, n)
			}, e.prototype.showProgressBar = function() {
				return this.progressBar.show()
			}, e.prototype.hideProgressBar = function() {
				return this.progressBar.hide(), clearTimeout(this.progressBarTimeout)
			}, e.prototype.reload = function() {
				return window.location.reload()
			}, e
		}()
	}.call(this),
	function() {
		var t, e = function(t, e) {
			return function() {
				return t.apply(e, arguments)
			}
		};
		t = !1, addEventListener("load", function() {
			return Turbolinks.defer(function() {
				return t = !0
			})
		}, !1), Turbolinks.History = function() {
			function r(t) {
				this.delegate = t, this.onPopState = e(this.onPopState, this)
			}
			return r.prototype.start = function() {
				return this.started ? void 0 : (addEventListener("popstate", this.onPopState, !1), this.started = !0)
			}, r.prototype.stop = function() {
				return this.started ? (removeEventListener("popstate", this.onPopState, !1), this.started = !1) : void 0
			}, r.prototype.push = function(t, e) {
				return t = Turbolinks.Location.wrap(t), this.update("push", t, e)
			}, r.prototype.replace = function(t, e) {
				return t = Turbolinks.Location.wrap(t), this.update("replace", t, e)
			}, r.prototype.onPopState = function(t) {
				var e, r, n, o;
				return this.shouldHandlePopState() && (o = null != (r = t.state) ? r.turbolinks : void 0) ? (e = Turbolinks.Location.wrap(window.location), n = o.restorationIdentifier, this.delegate.historyPoppedToLocationWithRestorationIdentifier(e, n)) : void 0
			}, r.prototype.shouldHandlePopState = function() {
				return t === !0
			}, r.prototype.update = function(t, e, r) {
				var n;
				return n = {
					turbolinks: {
						restorationIdentifier: r
					}
				}, history[t + "State"](n, null, e)
			}, r
		}()
	}.call(this),
	function() {
		Turbolinks.Snapshot = function() {
			function t(t) {
				var e, r;
				r = t.head, e = t.body, this.head = null != r ? r : document.createElement("head"), this.body = null != e ? e : document.createElement("body")
			}
			return t.wrap = function(t) {
				return t instanceof this ? t : this.fromHTML(t)
			}, t.fromHTML = function(t) {
				var e;
				return e = document.createElement("html"), e.innerHTML = t, this.fromElement(e)
			}, t.fromElement = function(t) {
				return new this({
					head: t.querySelector("head"),
					body: t.querySelector("body")
				})
			}, t.prototype.getRootLocation = function() {
				var t, e;
				return e = null != (t = this.getSetting("root")) ? t : "/", new Turbolinks.Location(e)
			}, t.prototype.getCacheControlValue = function() {
				return this.getSetting("cache-control")
			}, t.prototype.hasAnchor = function(t) {
				return null != this.body.querySelector("#" + t)
			}, t.prototype.isPreviewable = function() {
				return "no-preview" !== this.getCacheControlValue()
			}, t.prototype.getSetting = function(t) {
				var e, r;
				return r = this.head.querySelectorAll("meta[name='turbolinks-" + t + "']"), e = r[r.length - 1], null != e ? e.getAttribute("content") : void 0
			}, t
		}()
	}.call(this),
	function() {
		var t = [].slice;
		Turbolinks.Renderer = function() {
			function e() {}
			var r;
			return e.render = function() {
				var e, r, n, o;
				return n = arguments[0], r = arguments[1], e = 3 <= arguments.length ? t.call(arguments, 2) : [], o = function(t, e, r) {
					r.prototype = t.prototype;
					var n = new r,
						o = t.apply(n, e);
					return Object(o) === o ? o : n
				}(this, e, function() {}), o.delegate = n, o.render(r), o
			}, e.prototype.renderView = function(t) {
				return this.delegate.viewWillRender(this.newBody), t(), this.delegate.viewRendered(this.newBody)
			}, e.prototype.invalidateView = function() {
				return this.delegate.viewInvalidated()
			}, e.prototype.cloneScriptElement = function(t) {
				var e;
				return "false" === t.getAttribute("data-turbolinks-eval") ? t.cloneNode(!0) : (e = document.createElement("script"), e.textContent = t.textContent, r(e, t), e)
			}, r = function(t, e) {
				var r, n, o, i, s, a, u;
				for (i = e.attributes, a = [], r = 0, n = i.length; n > r; r++) s = i[r], o = s.name, u = s.value, a.push(t.setAttribute(o, u));
				return a
			}, e
		}()
	}.call(this),
	function() {
		Turbolinks.HeadDetails = function() {
			function t(t) {
				var e, r, i, s, a, u, l;
				for (this.element = t, this.elements = {}, l = this.element.childNodes, s = 0, u = l.length; u > s; s++) i = l[s], i.nodeType === Node.ELEMENT_NODE && (a = i.outerHTML, r = null != (e = this.elements)[a] ? e[a] : e[a] = {
					type: o(i),
					tracked: n(i),
					elements: []
				}, r.elements.push(i))
			}
			var e, r, n, o;
			return t.prototype.hasElementWithKey = function(t) {
				return t in this.elements
			}, t.prototype.getTrackedElementSignature = function() {
				var t, e;
				return function() {
					var r, n;
					r = this.elements, n = [];
					for (t in r) e = r[t].tracked, e && n.push(t);
					return n
				}.call(this).join("")
			}, t.prototype.getScriptElementsNotInDetails = function(t) {
				return this.getElementsMatchingTypeNotInDetails("script", t)
			}, t.prototype.getStylesheetElementsNotInDetails = function(t) {
				return this.getElementsMatchingTypeNotInDetails("stylesheet", t)
			}, t.prototype.getElementsMatchingTypeNotInDetails = function(t, e) {
				var r, n, o, i, s, a;
				o = this.elements, s = [];
				for (n in o) i = o[n], a = i.type, r = i.elements, a !== t || e.hasElementWithKey(n) || s.push(r[0]);
				return s
			}, t.prototype.getProvisionalElements = function() {
				var t, e, r, n, o, i, s;
				r = [], n = this.elements;
				for (e in n) o = n[e], s = o.type, i = o.tracked, t = o.elements, null != s || i ? t.length > 1 && r.push.apply(r, t.slice(1)) : r.push.apply(r, t);
				return r
			}, o = function(t) {
				return e(t) ? "script" : r(t) ? "stylesheet" : void 0
			}, n = function(t) {
				return "reload" === t.getAttribute("data-turbolinks-track")
			}, e = function(t) {
				var e;
				return e = t.tagName.toLowerCase(), "script" === e
			}, r = function(t) {
				var e;
				return e = t.tagName.toLowerCase(), "style" === e || "link" === e && "stylesheet" === t.getAttribute("rel")
			}, t
		}()
	}.call(this),
	function() {
		var t = function(t, r) {
				function n() {
					this.constructor = t
				}
				for (var o in r) e.call(r, o) && (t[o] = r[o]);
				return n.prototype = r.prototype, t.prototype = new n, t.__super__ = r.prototype, t
			},
			e = {}.hasOwnProperty;
		Turbolinks.SnapshotRenderer = function(e) {
			function r(t, e) {
				this.currentSnapshot = t, this.newSnapshot = e, this.currentHeadDetails = new Turbolinks.HeadDetails(this.currentSnapshot.head), this.newHeadDetails = new Turbolinks.HeadDetails(this.newSnapshot.head), this.newBody = this.newSnapshot.body.cloneNode(!0)
			}
			return t(r, e), r.prototype.render = function(t) {
				return this.trackedElementsAreIdentical() ? (this.mergeHead(), this.renderView(function(e) {
					return function() {
						return e.replaceBody(), e.focusFirstAutofocusableElement(), t()
					}
				}(this))) : this.invalidateView()
			}, r.prototype.mergeHead = function() {
				return this.copyNewHeadStylesheetElements(), this.copyNewHeadScriptElements(), this.removeCurrentHeadProvisionalElements(), this.copyNewHeadProvisionalElements()
			}, r.prototype.replaceBody = function() {
				return this.activateBodyScriptElements(), this.importBodyPermanentElements(), this.assignNewBody()
			}, r.prototype.trackedElementsAreIdentical = function() {
				return this.currentHeadDetails.getTrackedElementSignature() === this.newHeadDetails.getTrackedElementSignature()
			}, r.prototype.copyNewHeadStylesheetElements = function() {
				var t, e, r, n, o;
				for (n = this.getNewHeadStylesheetElements(), o = [], e = 0, r = n.length; r > e; e++) t = n[e], o.push(document.head.appendChild(t.cloneNode(!0)));
				return o
			}, r.prototype.copyNewHeadScriptElements = function() {
				var t, e, r, n, o;
				for (n = this.getNewHeadScriptElements(), o = [], e = 0, r = n.length; r > e; e++) t = n[e], o.push(document.head.appendChild(this.cloneScriptElement(t)));
				return o
			}, r.prototype.removeCurrentHeadProvisionalElements = function() {
				var t, e, r, n, o;
				for (n = this.getCurrentHeadProvisionalElements(), o = [], e = 0, r = n.length; r > e; e++) t = n[e], o.push(document.head.removeChild(t));
				return o
			}, r.prototype.copyNewHeadProvisionalElements = function() {
				var t, e, r, n, o;
				for (n = this.getNewHeadProvisionalElements(), o = [], e = 0, r = n.length; r > e; e++) t = n[e], o.push(document.head.appendChild(t.cloneNode(!0)));
				return o
			}, r.prototype.importBodyPermanentElements = function() {
				var t, e, r, n, o, i;
				for (n = this.getNewBodyPermanentElements(), i = [], e = 0, r = n.length; r > e; e++) o = n[e], (t = this.findCurrentBodyPermanentElement(o)) ? i.push(o.parentNode.replaceChild(t, o)) : i.push(void 0);
				return i
			}, r.prototype.activateBodyScriptElements = function() {
				var t, e, r, n, o, i;
				for (n = this.getNewBodyScriptElements(), i = [], e = 0, r = n.length; r > e; e++) o = n[e], t = this.cloneScriptElement(o), i.push(o.parentNode.replaceChild(t, o));
				return i
			}, r.prototype.assignNewBody = function() {
				return document.body = this.newBody
			}, r.prototype.focusFirstAutofocusableElement = function() {
				var t;
				return null != (t = this.findFirstAutofocusableElement()) ? t.focus() : void 0
			}, r.prototype.getNewHeadStylesheetElements = function() {
				return this.newHeadDetails.getStylesheetElementsNotInDetails(this.currentHeadDetails)
			}, r.prototype.getNewHeadScriptElements = function() {
				return this.newHeadDetails.getScriptElementsNotInDetails(this.currentHeadDetails)
			}, r.prototype.getCurrentHeadProvisionalElements = function() {
				return this.currentHeadDetails.getProvisionalElements()
			}, r.prototype.getNewHeadProvisionalElements = function() {
				return this.newHeadDetails.getProvisionalElements()
			}, r.prototype.getNewBodyPermanentElements = function() {
				return this.newBody.querySelectorAll("[id][data-turbolinks-permanent]")
			}, r.prototype.findCurrentBodyPermanentElement = function(t) {
				return document.body.querySelector("#" + t.id + "[data-turbolinks-permanent]")
			}, r.prototype.getNewBodyScriptElements = function() {
				return this.newBody.querySelectorAll("script")
			}, r.prototype.findFirstAutofocusableElement = function() {
				return document.body.querySelector("[autofocus]")
			}, r
		}(Turbolinks.Renderer)
	}.call(this),
	function() {
		var t = function(t, r) {
				function n() {
					this.constructor = t
				}
				for (var o in r) e.call(r, o) && (t[o] = r[o]);
				return n.prototype = r.prototype, t.prototype = new n, t.__super__ = r.prototype, t
			},
			e = {}.hasOwnProperty;
		Turbolinks.ErrorRenderer = function(e) {
			function r(t) {
				this.html = t
			}
			return t(r, e), r.prototype.render = function(t) {
				return this.renderView(function(e) {
					return function() {
						return e.replaceDocumentHTML(), e.activateBodyScriptElements(), t()
					}
				}(this))
			}, r.prototype.replaceDocumentHTML = function() {
				return document.documentElement.innerHTML = this.html
			}, r.prototype.activateBodyScriptElements = function() {
				var t, e, r, n, o, i;
				for (n = this.getScriptElements(), i = [], e = 0, r = n.length; r > e; e++) o = n[e], t = this.cloneScriptElement(o), i.push(o.parentNode.replaceChild(t, o));
				return i
			}, r.prototype.getScriptElements = function() {
				return document.documentElement.querySelectorAll("script")
			}, r
		}(Turbolinks.Renderer)
	}.call(this),
	function() {
		Turbolinks.View = function() {
			function t(t) {
				this.delegate = t, this.element = document.documentElement
			}
			return t.prototype.getRootLocation = function() {
				return this.getSnapshot().getRootLocation()
			}, t.prototype.getCacheControlValue = function() {
				return this.getSnapshot().getCacheControlValue()
			}, t.prototype.getSnapshot = function(t) {
				var e, r;
				return e = (null != t ? t : {
					clone: !1
				}).clone, r = e ? this.element.cloneNode(!0) : this.element, Turbolinks.Snapshot.fromElement(r)
			}, t.prototype.render = function(t, e) {
				var r, n, o;
				return o = t.snapshot, r = t.error, n = t.isPreview, this.markAsPreview(n), null != o ? this.renderSnapshot(o, e) : this.renderError(r, e)
			}, t.prototype.markAsPreview = function(t) {
				return t ? this.element.setAttribute("data-turbolinks-preview", "") : this.element.removeAttribute("data-turbolinks-preview")
			}, t.prototype.renderSnapshot = function(t, e) {
				return Turbolinks.SnapshotRenderer.render(this.delegate, e, this.getSnapshot(), Turbolinks.Snapshot.wrap(t))
			}, t.prototype.renderError = function(t, e) {
				return Turbolinks.ErrorRenderer.render(this.delegate, e, t)
			}, t
		}()
	}.call(this),
	function() {
		var t = function(t, e) {
			return function() {
				return t.apply(e, arguments)
			}
		};
		Turbolinks.ScrollManager = function() {
			function e(e) {
				this.delegate = e, this.onScroll = t(this.onScroll, this)
			}
			return e.prototype.start = function() {
				return this.started ? void 0 : (addEventListener("scroll", this.onScroll, !1), this.onScroll(), this.started = !0)
			}, e.prototype.stop = function() {
				return this.started ? (removeEventListener("scroll", this.onScroll, !1), this.started = !1) : void 0
			}, e.prototype.scrollToElement = function(t) {
				return t.scrollIntoView()
			}, e.prototype.scrollToPosition = function(t) {
				var e, r;
				return e = t.x, r = t.y, window.scrollTo(e, r)
			}, e.prototype.onScroll = function(t) {
				return this.updatePosition({
					x: window.pageXOffset,
					y: window.pageYOffset
				})
			}, e.prototype.updatePosition = function(t) {
				var e;
				return this.position = t, null != (e = this.delegate) ? e.scrollPositionChanged(this.position) : void 0
			}, e
		}()
	}.call(this),
	function() {
		Turbolinks.Cache = function() {
			function t(t) {
				this.size = t, this.keys = [], this.snapshots = {}
			}
			var e;
			return t.prototype.has = function(t) {
				var r;
				return r = e(t), r in this.snapshots
			}, t.prototype.get = function(t) {
				var e;
				if (this.has(t)) return e = this.read(t), this.touch(t), e
			}, t.prototype.put = function(t, e) {
				return this.write(t, e), this.touch(t), e
			}, t.prototype.read = function(t) {
				var r;
				return r = e(t), this.snapshots[r]
			}, t.prototype.write = function(t, r) {
				var n;
				return n = e(t), this.snapshots[n] = r
			}, t.prototype.touch = function(t) {
				var r, n;
				return n = e(t), r = this.keys.indexOf(n), r > -1 && this.keys.splice(r, 1), this.keys.unshift(n), this.trim()
			}, t.prototype.trim = function() {
				var t, e, r, n, o;
				for (n = this.keys.splice(this.size), o = [], t = 0, r = n.length; r > t; t++) e = n[t], o.push(delete this.snapshots[e]);
				return o
			}, e = function(t) {
				return Turbolinks.Location.wrap(t).toCacheKey()
			}, t
		}()
	}.call(this),
	function() {
		var t = function(t, e) {
			return function() {
				return t.apply(e, arguments)
			}
		};
		Turbolinks.Visit = function() {
			function e(e, r, n) {
				this.controller = e, this.action = n, this.performScroll = t(this.performScroll, this), this.identifier = Turbolinks.uuid(), this.location = Turbolinks.Location.wrap(r), this.adapter = this.controller.adapter, this.state = "initialized", this.timingMetrics = {}
			}
			var r;
			return e.prototype.start = function() {
				return "initialized" === this.state ? (this.recordTimingMetric("visitStart"), this.state = "started", this.adapter.visitStarted(this)) : void 0
			}, e.prototype.cancel = function() {
				var t;
				return "started" === this.state ? (null != (t = this.request) && t.cancel(), this.cancelRender(), this.state = "canceled") : void 0
			}, e.prototype.complete = function() {
				var t;
				return "started" === this.state ? (this.recordTimingMetric("visitEnd"), this.state = "completed", "function" == typeof(t = this.adapter).visitCompleted && t.visitCompleted(this), this.controller.visitCompleted(this)) : void 0
			}, e.prototype.fail = function() {
				var t;
				return "started" === this.state ? (this.state = "failed", "function" == typeof(t = this.adapter).visitFailed ? t.visitFailed(this) : void 0) : void 0
			}, e.prototype.changeHistory = function() {
				var t, e;
				return this.historyChanged ? void 0 : (t = this.location.isEqualTo(this.referrer) ? "replace" : this.action, e = r(t), this.controller[e](this.location, this.restorationIdentifier), this.historyChanged = !0)
			}, e.prototype.issueRequest = function() {
				return this.shouldIssueRequest() && null == this.request ? (this.progress = 0, this.request = new Turbolinks.HttpRequest(this, this.location, this.referrer), this.request.send()) : void 0
			}, e.prototype.getCachedSnapshot = function() {
				var t;
				return !(t = this.controller.getCachedSnapshotForLocation(this.location)) || null != this.location.anchor && !t.hasAnchor(this.location.anchor) || "restore" !== this.action && !t.isPreviewable() ? void 0 : t
			}, e.prototype.hasCachedSnapshot = function() {
				return null != this.getCachedSnapshot()
			}, e.prototype.loadCachedSnapshot = function() {
				var t, e;
				return (e = this.getCachedSnapshot()) ? (t = this.shouldIssueRequest(), this.render(function() {
					var r;
					return this.cacheSnapshot(), this.controller.render({
						snapshot: e,
						isPreview: t
					}, this.performScroll), "function" == typeof(r = this.adapter).visitRendered && r.visitRendered(this), t ? void 0 : this.complete()
				})) : void 0
			}, e.prototype.loadResponse = function() {
				return null != this.response ? this.render(function() {
					var t, e;
					return this.cacheSnapshot(), this.request.failed ? (this.controller.render({
						error: this.response
					}, this.performScroll), "function" == typeof(t = this.adapter).visitRendered && t.visitRendered(this), this.fail()) : (this.controller.render({
						snapshot: this.response
					}, this.performScroll), "function" == typeof(e = this.adapter).visitRendered && e.visitRendered(this), this.complete())
				}) : void 0
			}, e.prototype.followRedirect = function() {
				return this.redirectedToLocation && !this.followedRedirect ? (this.location = this.redirectedToLocation, this.controller.replaceHistoryWithLocationAndRestorationIdentifier(this.redirectedToLocation, this.restorationIdentifier), this.followedRedirect = !0) : void 0
			}, e.prototype.requestStarted = function() {
				var t;
				return this.recordTimingMetric("requestStart"), "function" == typeof(t = this.adapter).visitRequestStarted ? t.visitRequestStarted(this) : void 0
			}, e.prototype.requestProgressed = function(t) {
				var e;
				return this.progress = t, "function" == typeof(e = this.adapter).visitRequestProgressed ? e.visitRequestProgressed(this) : void 0
			}, e.prototype.requestCompletedWithResponse = function(t, e) {
				return this.response = t, null != e && (this.redirectedToLocation = Turbolinks.Location.wrap(e)), this.adapter.visitRequestCompleted(this)
			}, e.prototype.requestFailedWithStatusCode = function(t, e) {
				return this.response = e, this.adapter.visitRequestFailedWithStatusCode(this, t)
			}, e.prototype.requestFinished = function() {
				var t;
				return this.recordTimingMetric("requestEnd"), "function" == typeof(t = this.adapter).visitRequestFinished ? t.visitRequestFinished(this) : void 0
			}, e.prototype.performScroll = function() {
				return this.scrolled ? void 0 : ("restore" === this.action ? this.scrollToRestoredPosition() || this.scrollToTop() : this.scrollToAnchor() || this.scrollToTop(), this.scrolled = !0)
			}, e.prototype.scrollToRestoredPosition = function() {
				var t, e;
				return t = null != (e = this.restorationData) ? e.scrollPosition : void 0, null != t ? (this.controller.scrollToPosition(t), !0) : void 0
			}, e.prototype.scrollToAnchor = function() {
				return null != this.location.anchor ? (this.controller.scrollToAnchor(this.location.anchor), !0) : void 0
			}, e.prototype.scrollToTop = function() {
				return this.controller.scrollToPosition({
					x: 0,
					y: 0
				})
			}, e.prototype.recordTimingMetric = function(t) {
				var e;
				return null != (e = this.timingMetrics)[t] ? e[t] : e[t] = (new Date).getTime()
			}, e.prototype.getTimingMetrics = function() {
				return Turbolinks.copyObject(this.timingMetrics)
			}, r = function(t) {
				switch (t) {
					case "replace":
						return "replaceHistoryWithLocationAndRestorationIdentifier";
					case "advance":
					case "restore":
						return "pushHistoryWithLocationAndRestorationIdentifier"
				}
			}, e.prototype.shouldIssueRequest = function() {
				return "restore" === this.action ? !this.hasCachedSnapshot() : !0
			}, e.prototype.cacheSnapshot = function() {
				return this.snapshotCached ? void 0 : (this.controller.cacheSnapshot(), this.snapshotCached = !0)
			}, e.prototype.render = function(t) {
				return this.cancelRender(), this.frame = requestAnimationFrame(function(e) {
					return function() {
						return e.frame = null, t.call(e)
					}
				}(this))
			}, e.prototype.cancelRender = function() {
				return this.frame ? cancelAnimationFrame(this.frame) : void 0
			}, e
		}()
	}.call(this),
	function() {
		var t = function(t, e) {
			return function() {
				return t.apply(e, arguments)
			}
		};
		Turbolinks.Controller = function() {
				function e() {
					this.clickBubbled = t(this.clickBubbled, this), this.clickCaptured = t(this.clickCaptured, this), this.pageLoaded = t(this.pageLoaded, this), this.history = new Turbolinks.History(this), this.view = new Turbolinks.View(this), this.scrollManager = new Turbolinks.ScrollManager(this), this.restorationData = {}, this.clearCache()
				}
				return e.prototype.start = function() {
					return this.started ? void 0 : (addEventListener("click", this.clickCaptured, !0), addEventListener("DOMContentLoaded", this.pageLoaded, !1), this.scrollManager.start(), this.startHistory(), this.started = !0, this.enabled = !0)
				}, e.prototype.disable = function() {
					return this.enabled = !1
				}, e.prototype.stop = function() {
					return this.started ? (removeEventListener("click", this.clickCaptured, !0), removeEventListener("DOMContentLoaded", this.pageLoaded, !1), this.scrollManager.stop(), this.stopHistory(), this.started = !1) : void 0
				}, e.prototype.clearCache = function() {
					return this.cache = new Turbolinks.Cache(10)
				}, e.prototype.visit = function(t, e) {
					var r, n;
					return null == e && (e = {}), t = Turbolinks.Location.wrap(t), this.applicationAllowsVisitingLocation(t) ? this.locationIsVisitable(t) ? (r = null != (n = e.action) ? n : "advance", this.adapter.visitProposedToLocationWithAction(t, r)) : window.location = t : void 0
				}, e.prototype.startVisitToLocationWithAction = function(t, e, r) {
					var n;
					return Turbolinks.supported ? (n = this.getRestorationDataForIdentifier(r), this.startVisit(t, e, {
						restorationData: n
					})) : window.location = t
				}, e.prototype.startHistory = function() {
					return this.location = Turbolinks.Location.wrap(window.location), this.restorationIdentifier = Turbolinks.uuid(), this.history.start(), this.history.replace(this.location, this.restorationIdentifier)
				}, e.prototype.stopHistory = function() {
					return this.history.stop()
				}, e.prototype.pushHistoryWithLocationAndRestorationIdentifier = function(t, e) {
					return this.restorationIdentifier = e, this.location = Turbolinks.Location.wrap(t), this.history.push(this.location, this.restorationIdentifier)
				}, e.prototype.replaceHistoryWithLocationAndRestorationIdentifier = function(t, e) {
					return this.restorationIdentifier = e, this.location = Turbolinks.Location.wrap(t), this.history.replace(this.location, this.restorationIdentifier)
				}, e.prototype.historyPoppedToLocationWithRestorationIdentifier = function(t, e) {
					var r;
					return this.restorationIdentifier = e, this.enabled ? (r = this.getRestorationDataForIdentifier(this.restorationIdentifier), this.startVisit(t, "restore", {
						restorationIdentifier: this.restorationIdentifier,
						restorationData: r,
						historyChanged: !0
					}), this.location = Turbolinks.Location.wrap(t)) : this.adapter.pageInvalidated()
				}, e.prototype.getCachedSnapshotForLocation = function(t) {
					return this.cache.get(t)
				}, e.prototype.shouldCacheSnapshot = function() {
					return "no-cache" !== this.view.getCacheControlValue()
				}, e.prototype.cacheSnapshot = function() {
					var t;
					return this.shouldCacheSnapshot() ? (this.notifyApplicationBeforeCachingSnapshot(), t = this.view.getSnapshot({
						clone: !0
					}), this.cache.put(this.lastRenderedLocation, t)) : void 0
				}, e.prototype.scrollToAnchor = function(t) {
					var e;
					return (e = document.getElementById(t)) ? this.scrollToElement(e) : this.scrollToPosition({
						x: 0,
						y: 0
					})
				}, e.prototype.scrollToElement = function(t) {
					return this.scrollManager.scrollToElement(t)
				}, e.prototype.scrollToPosition = function(t) {
					return this.scrollManager.scrollToPosition(t)
				}, e.prototype.scrollPositionChanged = function(t) {
					var e;
					return e = this.getCurrentRestorationData(), e.scrollPosition = t
				}, e.prototype.render = function(t, e) {
					return this.view.render(t, e)
				}, e.prototype.viewInvalidated = function() {
					return this.adapter.pageInvalidated()
				}, e.prototype.viewWillRender = function(t) {
					return this.notifyApplicationBeforeRender(t)
				}, e.prototype.viewRendered = function() {
					return this.lastRenderedLocation = this.currentVisit.location, this.notifyApplicationAfterRender()
				}, e.prototype.pageLoaded = function() {
					return this.lastRenderedLocation = this.location, this.notifyApplicationAfterPageLoad()
				}, e.prototype.clickCaptured = function() {
					return removeEventListener("click", this.clickBubbled, !1), addEventListener("click", this.clickBubbled, !1)
				}, e.prototype.clickBubbled = function(t) {
					var e, r, n;
					return this.enabled && this.clickEventIsSignificant(t) && (r = this.getVisitableLinkForNode(t.target)) && (n = this.getVisitableLocationForLink(r)) && this.applicationAllowsFollowingLinkToLocation(r, n) ? (t.preventDefault(), e = this.getActionForLink(r), this.visit(n, {
						action: e
					})) : void 0
				}, e.prototype.applicationAllowsFollowingLinkToLocation = function(t, e) {
					var r;
					return r = this.notifyApplicationAfterClickingLinkToLocation(t, e), !r.defaultPrevented
				}, e.prototype.applicationAllowsVisitingLocation = function(t) {
					var e;
					return e = this.notifyApplicationBeforeVisitingLocation(t), !e.defaultPrevented
				}, e.prototype.notifyApplicationAfterClickingLinkToLocation = function(t, e) {
					return Turbolinks.dispatch("turbolinks:click", {
						target: t,
						data: {
							url: e.absoluteURL
						},
						cancelable: !0
					})
				}, e.prototype.notifyApplicationBeforeVisitingLocation = function(t) {
					return Turbolinks.dispatch("turbolinks:before-visit", {
						data: {
							url: t.absoluteURL
						},
						cancelable: !0
					})
				}, e.prototype.notifyApplicationAfterVisitingLocation = function(t) {
					return Turbolinks.dispatch("turbolinks:visit", {
						data: {
							url: t.absoluteURL
						}
					})
				}, e.prototype.notifyApplicationBeforeCachingSnapshot = function() {
					return Turbolinks.dispatch("turbolinks:before-cache")
				}, e.prototype.notifyApplicationBeforeRender = function(t) {
					return Turbolinks.dispatch("turbolinks:before-render", {
						data: {
							newBody: t
						}
					})
				}, e.prototype.notifyApplicationAfterRender = function() {
					return Turbolinks.dispatch("turbolinks:render")
				}, e.prototype.notifyApplicationAfterPageLoad = function(t) {
					return null == t && (t = {}), Turbolinks.dispatch("turbolinks:load", {
						data: {
							url: this.location.absoluteURL,
							timing: t
						}
					})
				}, e.prototype.startVisit = function(t, e, r) {
					var n;
					return null != (n = this.currentVisit) && n.cancel(), this.currentVisit = this.createVisit(t, e, r), this.currentVisit.start(), this.notifyApplicationAfterVisitingLocation(t)
				}, e.prototype.createVisit = function(t, e, r) {
					var n, o, i, s, a;
					return o = null != r ? r : {}, s = o.restorationIdentifier, i = o.restorationData, n = o.historyChanged, a = new Turbolinks.Visit(this, t, e), a.restorationIdentifier = null != s ? s : Turbolinks.uuid(), a.restorationData = Turbolinks.copyObject(i), a.historyChanged = n, a.referrer = this.location, a
				}, e.prototype.visitCompleted = function(t) {
					return this.notifyApplicationAfterPageLoad(t.getTimingMetrics())
				}, e.prototype.clickEventIsSignificant = function(t) {
					return !(t.defaultPrevented || t.target.isContentEditable || t.which > 1 || t.altKey || t.ctrlKey || t.metaKey || t.shiftKey)
				}, e.prototype.getVisitableLinkForNode = function(t) {
					return this.nodeIsVisitable(t) ? Turbolinks.closest(t, "a[href]:not([target])") : void 0
				}, e.prototype.getVisitableLocationForLink = function(t) {
					var e;
					return e = new Turbolinks.Location(t.href), this.locationIsVisitable(e) ? e : void 0
				}, e.prototype.getActionForLink = function(t) {
					var e;
					return null != (e = t.getAttribute("data-turbolinks-action")) ? e : "advance"
				}, e.prototype.nodeIsVisitable = function(t) {
					var e;
					return (e = Turbolinks.closest(t, "[data-turbolinks]")) ? "false" !== e.getAttribute("data-turbolinks") : !0
				}, e.prototype.locationIsVisitable = function(t) {
					return t.isPrefixedBy(this.view.getRootLocation()) && t.isHTML()
				}, e.prototype.getCurrentRestorationData = function() {
					return this.getRestorationDataForIdentifier(this.restorationIdentifier)
				}, e.prototype.getRestorationDataForIdentifier = function(t) {
					var e;
					return null != (e = this.restorationData)[t] ? e[t] : e[t] = {}
				}, e
			}(),
			function() {
				var t;
				return Turbolinks.controller = t = new Turbolinks.Controller, t.adapter = new Turbolinks.BrowserAdapter(t), t.start()
			}()
	}.call(this);