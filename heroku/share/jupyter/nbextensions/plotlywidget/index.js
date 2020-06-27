define(["@jupyter-widgets/base"], function(__WEBPACK_EXTERNAL_MODULE_4__) { return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = {"name":"plotlywidget","version":"4.8.2","description":"The plotly JupyterLab extension","author":"The plotly.py team","license":"MIT","main":"src/index.js","repository":{"type":"git","url":"https://github.com/plotly/plotly.py"},"keywords":["jupyter","widgets","ipython","ipywidgets","plotly"],"files":["src/**/*.js","dist/*.js","style/*.*"],"scripts":{"build":"webpack","clean":"rimraf dist/ && rimraf  ../../python/plotly/plotlywidget/static'","test":"echo \"Error: no test specified\" && exit 1"},"devDependencies":{"webpack":"^3.10.0","rimraf":"^2.6.1","ify-loader":"^1.1.0","typescript":"~3.1.1"},"dependencies":{"plotly.js":"^1.54.5","@jupyter-widgets/base":"^2.0.0 || ^3.0.0","lodash":"^4.17.4"},"jupyterlab":{"extension":"src/jupyterlab-plugin.js"}}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

// Export widget models and views, and the npm package version number.
module.exports = __webpack_require__(3);
module.exports['version'] = __webpack_require__(1).version;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var widgets = __webpack_require__(4);
var _ = __webpack_require__(5);

window.PlotlyConfig = {MathJaxConfig: 'local'};
var Plotly = __webpack_require__(7);
var semver_range = "^" + __webpack_require__(1).version;

// Model
// =====
/**
 * A FigureModel holds a mirror copy of the state of a FigureWidget on
 * the Python side.  There is a one-to-one relationship between JavaScript
 * FigureModels and Python FigureWidgets. The JavaScript FigureModel is
 * initialized as soon as a Python FigureWidget initialized, this happens
 * even before the widget is first displayed in the Notebook
 * @type {widgets.DOMWidgetModel}
 */
var FigureModel = widgets.DOMWidgetModel.extend({

    defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
        // Model metadata
        // --------------
        _model_name: "FigureModel",
        _view_name: "FigureView",
        _model_module: "plotlywidget",
        _view_module: "plotlywidget",
        _view_module_version: semver_range,
        _model_module_version: semver_range,

        // Data and Layout
        // ---------------
        // The _data and _layout properties are synchronized with the
        // Python side on initialization only.  After initialization, these
        // properties are kept in sync through the use of the _py2js_*
        // messages
        _data: [],
        _layout: {},
        _config: {},

        // Python -> JS messages
        // ---------------------
        // Messages are implemented using trait properties. This is done so
        // that we can take advantage of ipywidget's binary serialization
        // protocol.
        //
        // Messages are sent by the Python side by assigning the message
        // contents to the appropriate _py2js_* property, and then immediately
        // setting it to None.  Messages are received by the JavaScript
        // side by registering property change callbacks in the initialize
        // methods for FigureModel and FigureView. e.g. (where this is a
        // FigureModel):
        //
        //      this.on('change:_py2js_addTraces', this.do_addTraces, this);
        //
        // Message handling methods, do_addTraces, are responsible for
        // performing the appropriate action if the message contents are
        // not null

        /**
         * @typedef {null|Object} Py2JsAddTracesMsg
         * @property {Array.<Object>} trace_data
         *  Array of traces to append to the end of the figure's current traces
         * @property {Number} trace_edit_id
         *  Edit ID to use when returning trace deltas using
         *  the _js2py_traceDeltas message.
         * @property {Number} layout_edit_id
         *  Edit ID to use when returning layout deltas using
         *  the _js2py_layoutDelta message.
         */
        _py2js_addTraces: null,

        /**
         * @typedef {null|Object} Py2JsDeleteTracesMsg
         * @property {Array.<Number>} delete_inds
         *  Array of indexes of traces to be deleted, in ascending order
         * @property {Number} trace_edit_id
         *  Edit ID to use when returning trace deltas using
         *  the _js2py_traceDeltas message.
         * @property {Number} layout_edit_id
         *  Edit ID to use when returning layout deltas using
         *  the _js2py_layoutDelta message.
         */
        _py2js_deleteTraces: null,

        /**
         * @typedef {null|Object} Py2JsMoveTracesMsg
         * @property {Array.<Number>} current_trace_inds
         *  Array of the current indexes of traces to be moved
         * @property {Array.<Number>} new_trace_inds
         *  Array of the new indexes that traces should be moved to.
         */
        _py2js_moveTraces: null,


        /**
         * @typedef {null|Object} Py2JsRestyleMsg
         * @property {Object} restyle_data
         *  Restyle data as accepted by Plotly.restyle
         * @property {null|Array.<Number>} restyle_traces
         *  Array of indexes of the traces that the resytle operation applies
         *  to, or null to apply the operation to all traces
         * @property {Number} trace_edit_id
         *  Edit ID to use when returning trace deltas using
         *  the _js2py_traceDeltas message
         * @property {Number} layout_edit_id
         *  Edit ID to use when returning layout deltas using
         *  the _js2py_layoutDelta message
         * @property {null|String} source_view_id
         *  view_id of the FigureView that triggered the original restyle
         *  event (e.g. by clicking the legend), or null if the restyle was
         *  triggered from Python
         */
        _py2js_restyle: null,

        /**
         * @typedef {null|Object} Py2JsRelayoutMsg
         * @property {Object} relayout_data
         *  Relayout data as accepted by Plotly.relayout
         * @property {Number} layout_edit_id
         *  Edit ID to use when returning layout deltas using
         *  the _js2py_layoutDelta message
         * @property {null|String} source_view_id
         *  view_id of the FigureView that triggered the original relayout
         *  event (e.g. by clicking the zoom button), or null if the
         *  relayout was triggered from Python
         */
        _py2js_relayout: null,

        /**
         * @typedef {null|Object} Py2JsUpdateMsg
         * @property {Object} style_data
         *  Style data as accepted by Plotly.update
         * @property {Object} layout_data
         *  Layout data as accepted by Plotly.update
         * @property {Array.<Number>} style_traces
         *  Array of indexes of the traces that the update operation applies
         *  to, or null to apply the operation to all traces
         * @property {Number} trace_edit_id
         *  Edit ID to use when returning trace deltas using
         *  the _js2py_traceDeltas message
         * @property {Number} layout_edit_id
         *  Edit ID to use when returning layout deltas using
         *  the _js2py_layoutDelta message
         * @property {null|String} source_view_id
         *  view_id of the FigureView that triggered the original update
         *  event (e.g. by clicking a button), or null if the update was
         *  triggered from Python
         */
        _py2js_update: null,

        /**
         * @typedef {null|Object} Py2JsAnimateMsg
         * @property {Object} style_data
         *  Style data as accepted by Plotly.animate
         * @property {Object} layout_data
         *  Layout data as accepted by Plotly.animate
         * @property {Array.<Number>} style_traces
         *  Array of indexes of the traces that the animate operation applies
         *  to, or null to apply the operation to all traces
         * @property {Object} animation_opts
         *  Animation options as accepted by Plotly.animate
         * @property {Number} trace_edit_id
         *  Edit ID to use when returning trace deltas using
         *  the _js2py_traceDeltas message
         * @property {Number} layout_edit_id
         *  Edit ID to use when returning layout deltas using
         *  the _js2py_layoutDelta message
         * @property {null|String} source_view_id
         *  view_id of the FigureView that triggered the original animate
         *  event (e.g. by clicking a button), or null if the update was
         *  triggered from Python
         */
        _py2js_animate: null,

        /**
         * @typedef {null|Object} Py2JsRemoveLayoutPropsMsg
         * @property {Array.<Array.<String|Number>>} remove_props
         *  Array of property paths to remove. Each propery path is an
         *  array of property names or array indexes that locate a property
         *  inside the _layout object
         */
        _py2js_removeLayoutProps: null,

        /**
         * @typedef {null|Object} Py2JsRemoveTracePropsMsg
         * @property {Number} remove_trace
         *  The index of the trace from which to remove properties
         * @property {Array.<Array.<String|Number>>} remove_props
         *  Array of property paths to remove. Each propery path is an
         *  array of property names or array indexes that locate a property
         *  inside the _data[remove_trace] object
         */
        _py2js_removeTraceProps: null,


        // JS -> Python messages
        // ---------------------
        // Messages are sent by the JavaScript side by assigning the
        // message contents to the appropriate _js2py_* property and then
        // calling the `touch` method on the view that triggered the
        // change. e.g. (where this is a FigureView):
        //
        //      this.model.set('_js2py_restyle', data);
        //      this.touch();
        //
        // The Python side is responsible for setting the property to None
        // after receiving the message.
        //
        // Message trigger logic is described in the corresponding
        // handle_plotly_* methods of FigureView

        /**
         * @typedef {null|Object} Js2PyRestyleMsg
         * @property {Object} style_data
         *  Style data that was passed to Plotly.restyle
         * @property {Array.<Number>} style_traces
         *  Array of indexes of the traces that the restyle operation
         *  was applied to, or null if applied to all traces
         * @property {String} source_view_id
         *  view_id of the FigureView that triggered the original restyle
         *  event (e.g. by clicking the legend)
         */
        _js2py_restyle: null,

        /**
         * @typedef {null|Object} Js2PyRelayoutMsg
         * @property {Object} relayout_data
         *  Relayout data that was passed to Plotly.relayout
         * @property {String} source_view_id
         *  view_id of the FigureView that triggered the original relayout
         *  event (e.g. by clicking the zoom button)
         */
        _js2py_relayout: null,

        /**
         * @typedef {null|Object} Js2PyUpdateMsg
         * @property {Object} style_data
         *  Style data that was passed to Plotly.update
         * @property {Object} layout_data
         *  Layout data that was passed to Plotly.update
         * @property {Array.<Number>} style_traces
         *  Array of indexes of the traces that the update operation applied
         *  to, or null if applied to all traces
         * @property {String} source_view_id
         *  view_id of the FigureView that triggered the original relayout
         *  event (e.g. by clicking the zoom button)
         */
        _js2py_update: null,

        /**
         * @typedef {null|Object} Js2PyLayoutDeltaMsg
         * @property {Object} layout_delta
         *  The layout delta object that contains all of the properties of
         *  _fullLayout that are not identical to those in the
         *  FigureModel's _layout property
         * @property {Number} layout_edit_id
         *  Edit ID of message that triggered the creation of layout delta
         */
        _js2py_layoutDelta: null,

        /**
         * @typedef {null|Object} Js2PyTraceDeltasMsg
         * @property {Array.<Object>} trace_deltas
         *  Array of trace delta objects. Each trace delta contains the
         *  trace's uid along with all of the properties of _fullData that
         *  are not identical to those in the FigureModel's _data property
         * @property {Number} trace_edit_id
         *  Edit ID of message that triggered the creation of trace deltas
         */
        _js2py_traceDeltas: null,


        /**
         * Object representing a collection of points for use in click, hover,
         * and selection events
         * @typedef {Object} Points
         * @property {Array.<Number>} trace_indexes
         *  Array of the trace index for each point
         * @property {Array.<Number>} point_indexes
         *  Array of the index of each point in its own trace
         * @property {null|Array.<Number>} xs
         *  Array of the x coordinate of each point (for cartesian trace types)
         *  or null (for non-cartesian trace types)
         * @property {null|Array.<Number>} ys
         *  Array of the y coordinate of each point (for cartesian trace types)
         *  or null (for non-cartesian trace types
         * @property {null|Array.<Number>} zs
         *  Array of the z coordinate of each point (for 3D cartesian
         *  trace types)
         *  or null (for non-3D-cartesian trace types)
         */

        /**
         * Object representing the state of the input devices during a
         * plotly event
         * @typedef {Object} InputDeviceState
         * @property {boolean} alt - true if alt key pressed,
         * false otherwise
         * @property {boolean} ctrl - true if ctrl key pressed,
         * false otherwise
         * @property {boolean} meta - true if meta key pressed,
         * false otherwise
         * @property {boolean} shift - true if shift key pressed,
         * false otherwise
         *
         * @property {boolean} button
         *  Indicates which button was pressed on the mouse to trigger the
         *  event.
         *    0: Main button pressed, usually the left button or the
         *       un-initialized state
         *    1: Auxiliary button pressed, usually the wheel button or
         *       the middle button (if present)
         *    2: Secondary button pressed, usually the right button
         *    3: Fourth button, typically the Browser Back button
         *    4: Fifth button, typically the Browser Forward button
         *
         * @property {boolean} buttons
         *  Indicates which buttons were pressed on the mouse when the event
         *  is triggered.
         *    0  : No button or un-initialized
         *    1  : Primary button (usually left)
         *    2  : Secondary button (usually right)
         *    4  : Auxilary button (usually middle or mouse wheel button)
         *    8  : 4th button (typically the "Browser Back" button)
         *    16 : 5th button (typically the "Browser Forward" button)
         *
         *  Combinations of buttons are represented by the sum of the codes
         *  above. e.g. a value of 7 indicates buttons 1 (primary),
         *  2 (secondary), and 4 (auxilary) were pressed during the event
         */

        /**
         * @typedef {Object} BoxSelectorState
         * @property {Array.<Number>} xrange
         *  Two element array containing the x-range of the box selection
         * @property {Array.<Number>} yrange
         *  Two element array containing the y-range of the box selection
         */

        /**
         * @typedef {Object} LassoSelectorState
         * @property {Array.<Number>} xs
         *  Array of the x-coordinates of the lasso selection region
         * @property {Array.<Number>} ys
         *  Array of the y-coordinates of the lasso selection region
         */

        /**
         * Object representing the state of the selection tool during a
         * plotly_select event
         * @typedef {Object} Selector
         * @property {String} type
         *  Selection type. One of: 'box', or 'lasso'
         * @property {BoxSelectorState|LassoSelectorState} selector_state
         */

        /**
         * @typedef {null|Object} Js2PyPointsCallbackMsg
         * @property {string} event_type
         *  Name of the triggering event. One of 'plotly_click',
         *  'plotly_hover', 'plotly_unhover', or 'plotly_selected'
         * @property {null|Points} points
         *  Points object for event
         * @property {null|InputDeviceState} device_state
         *  InputDeviceState object for event
         * @property {null|Selector} selector
         *  State of the selection tool for 'plotly_selected' events, null
         *  for other event types
         */
        _js2py_pointsCallback: null,

        // Message tracking
        // ----------------
        /**
         * @type {Number}
         * layout_edit_id of the last layout modification operation
         * requested by the Python side
         */
        _last_layout_edit_id: 0,

        /**
         * @type {Number}
         * trace_edit_id of the last trace modification operation
         * requested by the Python side
         */
        _last_trace_edit_id: 0
    }),

    /**
     * Initialize FigureModel. Called when the Python FigureWidget is first
     * constructed
     */
    initialize: function() {
        FigureModel.__super__.initialize.apply(this, arguments);

        this.on("change:_data", this.do_data, this);
        this.on("change:_layout", this.do_layout, this);
        this.on("change:_py2js_addTraces", this.do_addTraces, this);
        this.on("change:_py2js_deleteTraces", this.do_deleteTraces, this);
        this.on("change:_py2js_moveTraces", this.do_moveTraces, this);
        this.on("change:_py2js_restyle", this.do_restyle, this);
        this.on("change:_py2js_relayout", this.do_relayout, this);
        this.on("change:_py2js_update", this.do_update, this);
        this.on("change:_py2js_animate", this.do_animate, this);
        this.on("change:_py2js_removeLayoutProps",
            this.do_removeLayoutProps, this);
        this.on("change:_py2js_removeTraceProps",
            this.do_removeTraceProps, this);
    },

    /**
     * Input a trace index specification and return an Array of trace
     * indexes where:
     *
     *  - null|undefined -> Array of all traces
     *  - Trace index as Number -> Single element array of input index
     *  - Array of trace indexes -> Input array unchanged
     *
     * @param {undefined|null|Number|Array.<Number>} trace_indexes
     * @returns {Array.<Number>}
     *  Array of trace indexes
     * @private
     */
    _normalize_trace_indexes: function (trace_indexes) {
        if (trace_indexes === null || trace_indexes === undefined) {
            var numTraces = this.get("_data").length;
            trace_indexes = _.range(numTraces);
        }
        if (!Array.isArray(trace_indexes)) {
            // Make sure idx is an array
            trace_indexes = [trace_indexes];
        }
        return trace_indexes
    },

    /**
     * Log changes to the _data trait
     *
     * This should only happed on FigureModel initialization
     */
    do_data: function () {

    },

    /**
     * Log changes to the _layout trait
     *
     * This should only happed on FigureModel initialization
     */
    do_layout: function () {

    },

    /**
     * Handle addTraces message
     */
    do_addTraces: function () {
        // add trace to plot
        /** @type {Py2JsAddTracesMsg} */
        var msgData = this.get("_py2js_addTraces");

        if (msgData !== null) {
            var currentTraces = this.get("_data");
            var newTraces = msgData.trace_data;
            _.forEach(newTraces, function (newTrace) {
                currentTraces.push(newTrace);
            })
        }
    },

    /**
     * Handle deleteTraces message
     */
    do_deleteTraces: function () {
        // remove traces from plot

        /** @type {Py2JsDeleteTracesMsg} */
        var msgData = this.get("_py2js_deleteTraces");

        if (msgData !== null) {
            var delete_inds = msgData.delete_inds;
            var tracesData = this.get("_data");

            // Remove del inds in reverse order so indexes remain valid
            // throughout loop
            delete_inds.slice().reverse().forEach(function (del_ind) {
                tracesData.splice(del_ind, 1);
            });
        }
    },

    /**
     * Handle moveTraces message
     */
    do_moveTraces: function () {

        /** @type {Py2JsMoveTracesMsg} */
        var msgData = this.get("_py2js_moveTraces");

        if (msgData !== null) {
            var tracesData = this.get("_data");
            var currentInds = msgData.current_trace_inds;
            var newInds = msgData.new_trace_inds;

            performMoveTracesLike(tracesData, currentInds, newInds);
        }
    },

    /**
     * Handle restyle message
     */
    do_restyle: function () {

        /** @type {Py2JsRestyleMsg} */
        var msgData = this.get("_py2js_restyle");
        if (msgData !== null) {
            var restyleData = msgData.restyle_data;
            var restyleTraces = this._normalize_trace_indexes(
                msgData.restyle_traces);
            performRestyleLike(this.get("_data"), restyleData, restyleTraces);
        }
    },

    /**
     * Handle relayout message
     */
    do_relayout: function () {

        /** @type {Py2JsRelayoutMsg} */
        var msgData = this.get("_py2js_relayout");

        if (msgData !== null) {
            performRelayoutLike(this.get("_layout"), msgData.relayout_data);
        }
    },

    /**
     * Handle update message
     */
    do_update: function() {

        /** @type {Py2JsUpdateMsg} */
        var msgData = this.get("_py2js_update");

        if (msgData !== null) {
            var style = msgData.style_data;
            var layout = msgData.layout_data;
            var styleTraces = this._normalize_trace_indexes(
                msgData.style_traces);
            performRestyleLike(this.get("_data"), style, styleTraces);
            performRelayoutLike(this.get("_layout"), layout);
        }
    },

    /**
     * Handle animate message
     */
    do_animate: function () {

        /** @type {Py2JsAnimateMsg} */
        var msgData = this.get("_py2js_animate");
        if (msgData !== null) {

            var styles = msgData.style_data;
            var layout = msgData.layout_data;
            var trace_indexes = this._normalize_trace_indexes(
                msgData.style_traces);

            for (var i = 0; i < styles.length; i++) {
                var style = styles[i];
                var trace_index = trace_indexes[i];
                var trace = this.get("_data")[trace_index];
                performRelayoutLike(trace, style);
            }

            performRelayoutLike(this.get("_layout"), layout);
        }
    },

    /**
     * Handle removeLayoutProps message
     */
    do_removeLayoutProps: function () {
        /** @type {Py2JsRemoveLayoutPropsMsg} */
        var msgData = this.get("_py2js_removeLayoutProps");

        if (msgData !== null) {
            var keyPaths = msgData.remove_props;
            var layout = this.get("_layout");
            performRemoveProps(layout, keyPaths);
        }
    },

    /**
     * Handle removeTraceProps message
     */
    do_removeTraceProps: function () {
        /** @type {Py2JsRemoveTracePropsMsg} */
        var msgData = this.get("_py2js_removeTraceProps");
        if (msgData !== null) {
            var keyPaths = msgData.remove_props;
            var traceIndex = msgData.remove_trace;
            var trace = this.get("_data")[traceIndex];

            performRemoveProps(trace, keyPaths);
        }
    }
}, {
    serializers: _.extend({
        _data: { deserialize: py2js_deserializer,
            serialize: js2py_serializer},
        _layout: { deserialize: py2js_deserializer,
            serialize: js2py_serializer},
        _py2js_addTraces: { deserialize: py2js_deserializer,
            serialize: js2py_serializer},
        _py2js_deleteTraces: { deserialize: py2js_deserializer,
            serialize: js2py_serializer},
        _py2js_moveTraces: { deserialize: py2js_deserializer,
            serialize: js2py_serializer},
        _py2js_restyle: { deserialize: py2js_deserializer,
            serialize: js2py_serializer},
        _py2js_relayout: { deserialize: py2js_deserializer,
            serialize: js2py_serializer},
        _py2js_update: { deserialize: py2js_deserializer,
            serialize: js2py_serializer},
        _py2js_animate: { deserialize: py2js_deserializer,
            serialize: js2py_serializer},
        _py2js_removeLayoutProps: { deserialize: py2js_deserializer,
            serialize: js2py_serializer},
        _py2js_removeTraceProps: { deserialize: py2js_deserializer,
            serialize: js2py_serializer},
        _js2py_restyle: { deserialize: py2js_deserializer,
            serialize: js2py_serializer},
        _js2py_relayout: { deserialize: py2js_deserializer,
            serialize: js2py_serializer},
        _js2py_update: { deserialize: py2js_deserializer,
            serialize: js2py_serializer},
        _js2py_layoutDelta: { deserialize: py2js_deserializer,
            serialize: js2py_serializer},
        _js2py_traceDeltas: { deserialize: py2js_deserializer,
            serialize: js2py_serializer},
        _js2py_pointsCallback: { deserialize: py2js_deserializer,
            serialize: js2py_serializer}
    }, widgets.DOMWidgetModel.serializers)
});

// View
// ====
/**
 * A FigureView manages the visual presentation of a single Plotly.js
 * figure for a single notebook output cell. Each FigureView has a
 * reference to FigureModel.  Multiple views may share a single model
 * instance, as is the case when a Python FigureWidget is displayed in
 * multiple notebook output cells.
 *
 * @type {widgets.DOMWidgetView}
 */
var FigureView = widgets.DOMWidgetView.extend({

    /**
     * The perform_render method is called by processPhosphorMessage
     * after the widget's DOM element has been attached to the notebook
     * output cell. This happens after the initialize of the
     * FigureModel, and it won't happen at all if the Python FigureWidget
     * is never displayed in a notebook output cell
     */
    perform_render: function() {

        var that = this;

        // Wire up message property callbacks
        // ----------------------------------
        // Python -> JS event properties
        this.model.on("change:_py2js_addTraces",
            this.do_addTraces, this);
        this.model.on("change:_py2js_deleteTraces",
            this.do_deleteTraces, this);
        this.model.on("change:_py2js_moveTraces",
            this.do_moveTraces, this);
        this.model.on("change:_py2js_restyle",
            this.do_restyle, this);
        this.model.on("change:_py2js_relayout",
            this.do_relayout, this);
        this.model.on("change:_py2js_update",
            this.do_update, this);
        this.model.on("change:_py2js_animate",
            this.do_animate, this);

        // MathJax configuration
        // ---------------------
        if (window.MathJax) {
            MathJax.Hub.Config({SVG: {font: "STIX-Web"}});
        }

        // Get message ids
        // ---------------------
        var layout_edit_id = this.model.get("_last_layout_edit_id");
        var trace_edit_id = this.model.get("_last_trace_edit_id");

        // Set view UID
        // ------------
        this.viewID = randstr();

        // Initialize Plotly.js figure
        // ---------------------------
        // We must clone the model's data and layout properties so that
        // the model is not directly mutated by the Plotly.js library.
        var initialTraces = _.cloneDeep(this.model.get("_data"));
        var initialLayout = _.cloneDeep(this.model.get("_layout"));
        var config = this.model.get("_config");

        Plotly.newPlot(that.el, initialTraces, initialLayout, config).then(
            function () {

                // ### Send trace deltas ###
                // We create an array of deltas corresponding to the new
                // traces.
                that._sendTraceDeltas(trace_edit_id);

                // ### Send layout delta ###
                that._sendLayoutDelta(layout_edit_id);

                // Wire up plotly event callbacks
                that.el.on("plotly_restyle",
                    function (update) {
                        that.handle_plotly_restyle(update)
                    });
                that.el.on("plotly_relayout",
                    function (update) {
                        that.handle_plotly_relayout(update)
                    });
                that.el.on("plotly_update",
                    function (update) {
                        that.handle_plotly_update(update)
                    });
                that.el.on("plotly_click",
                    function (update) {
                        that.handle_plotly_click(update)
                    });
                that.el.on("plotly_hover",
                    function (update) {
                        that.handle_plotly_hover(update)
                    });
                that.el.on("plotly_unhover",
                    function (update) {
                        that.handle_plotly_unhover(update)
                    });
                that.el.on("plotly_selected",
                    function (update) {
                        that.handle_plotly_selected(update)
                    });
                that.el.on("plotly_deselect",
                    function (update) {
                        that.handle_plotly_deselect(update)
                    });
                that.el.on("plotly_doubleclick",
                    function (update) {
                        that.handle_plotly_doubleclick(update)
                    });

                // Emit event indicating that the widget has finished
                // rendering
                var event = new CustomEvent("plotlywidget-after-render",
                    { "detail": {"element": that.el, 'viewID': that.viewID}});

                // Dispatch/Trigger/Fire the event
                document.dispatchEvent(event);
            });
    },

    /**
     * Respond to phosphorjs events
     */
    processPhosphorMessage: function(msg) {
        FigureView.__super__.processPhosphorMessage.apply(this, arguments);
        var that = this;
        switch (msg.type) {
            case 'before-attach':
                // Render an initial empty figure. This establishes with
                // the page that the element will not be empty, avoiding
                // some occasions where the dynamic sizing behavior leads
                // to collapsed figure dimensions.
                var axisHidden = {
                    showgrid: false, showline: false, tickvals: []};

                Plotly.newPlot(that.el, [], {
                    xaxis: axisHidden, yaxis: axisHidden
                });

                window.addEventListener("resize", function(){
                    that.autosizeFigure();
                });
                break;
            case 'after-attach':
                // Rendering actual figure in the after-attach event allows
                // Plotly.js to size the figure to fill the available element
                this.perform_render();
                break;
            case 'resize':
                this.autosizeFigure();
                break
        }
    },

    autosizeFigure: function() {
        var that = this;
        var layout = that.model.get('_layout');
        if (_.isNil(layout) ||
            _.isNil(layout.width)) {
            Plotly.Plots.resize(that.el).then(function(){
                var layout_edit_id = that.model.get(
                    "_last_layout_edit_id");
                that._sendLayoutDelta(layout_edit_id);
            });
        }
    },

    /**
     * Purge Plotly.js data structures from the notebook output display
     * element when the view is destroyed
     */
    destroy: function() {
        Plotly.purge(this.el);
    },

    /**
     * Return the figure's _fullData array merged with its data array
     *
     * The merge ensures that for any properties that el._fullData and
     * el.data have in common, we return the version from el.data
     *
     * Named colorscales are one example of why this is needed. The el.data
     * array will hold named colorscale strings (e.g. 'Viridis'), while the
     * el._fullData array will hold the actual colorscale array. e.g.
     *
     *      el.data[0].marker.colorscale == 'Viridis' but
     *      el._fullData[0].marker.colorscale = [[..., ...], ...]
     *
     * Performing the merge allows our FigureModel to retain the 'Viridis'
     * string, rather than having it overridded by the colorscale array.
     *
     */
    getFullData: function () {
        return _.mergeWith({}, this.el._fullData, this.el.data,
            fullMergeCustomizer)
    },

    /**
     * Return the figure's _fullLayout object merged with its layout object
     *
     * See getFullData documentation for discussion of why the merge is
     * necessary
     */
    getFullLayout: function () {
        return _.mergeWith({}, this.el._fullLayout, this.el.layout,
            fullMergeCustomizer);
    },

    /**
     * Build Points data structure from data supplied by the plotly_click,
     * plotly_hover, or plotly_select events
     * @param {Object} data
     * @returns {null|Points}
     */
    buildPointsObject: function (data) {

        var pointsObject;
        if (data.hasOwnProperty("points")) {
            // Most cartesian plots
            var pointObjects = data["points"];
            var numPoints = pointObjects.length;
            pointsObject = {
                "trace_indexes": new Array(numPoints),
                "point_indexes": new Array(numPoints),
                "xs": new Array(numPoints),
                "ys": new Array(numPoints)};


                for (var p = 0; p < numPoints; p++) {
                pointsObject["trace_indexes"][p] =
                    pointObjects[p]["curveNumber"];
                pointsObject["point_indexes"][p] =
                    pointObjects[p]["pointNumber"];
                pointsObject["xs"][p] =
                    pointObjects[p]["x"];
                pointsObject["ys"][p] =
                    pointObjects[p]["y"];
            }

            // Add z if present
            var hasZ = pointObjects[0] !==
                undefined && pointObjects[0].hasOwnProperty("z");
            if (hasZ) {
                pointsObject["zs"] = new Array(numPoints);
                for (p = 0; p < numPoints; p++) {
                    pointsObject["zs"][p] = pointObjects[p]["z"];
                }
            }

            return pointsObject
        } else {
            return null
        }
    },

    /**
     * Build InputDeviceState data structure from data supplied by the
     * plotly_click, plotly_hover, or plotly_select events
     * @param {Object} data
     * @returns {null|InputDeviceState}
     */
    buildInputDeviceStateObject: function (data) {
        var event = data["event"];
        if (event === undefined) {
            return null;
        } else {
            /** @type {InputDeviceState} */
            var inputDeviceState = {
                // Keyboard modifiers
                "alt": event["altKey"],
                "ctrl": event["ctrlKey"],
                "meta": event["metaKey"],
                "shift": event["shiftKey"],

                // Mouse buttons
                "button": event["button"],
                "buttons": event["buttons"]
            };
            return inputDeviceState
        }
    },

    /**
     * Build Selector data structure from data supplied by the
     * plotly_select event
     * @param data
     * @returns {null|Selector}
     */
    buildSelectorObject: function(data) {

        var selectorObject;

        if (data.hasOwnProperty("range")) {
            // Box selection
            selectorObject = {
                type: "box",
                selector_state: {
                    xrange: data["range"]["x"],
                    yrange: data["range"]["y"]
                }
            };
        } else if (data.hasOwnProperty("lassoPoints")) {
            // Lasso selection
            selectorObject = {
                type: "lasso",
                selector_state: {
                    xs: data["lassoPoints"]["x"],
                    ys: data["lassoPoints"]["y"]
                }
            };
        } else {
            selectorObject = null;
        }
        return selectorObject
    },

    /**
     * Handle ploty_restyle events emitted by the Plotly.js library
     * @param data
     */
    handle_plotly_restyle: function (data) {

        if (data === null || data === undefined) {
            // No data to report to the Python side
            return
        }

        if (data[0] && data[0].hasOwnProperty("_doNotReportToPy")) {
            // Restyle originated on the Python side
            return
        }

        // Unpack data
        var styleData = data[0];
        var styleTraces = data[1];

        // Construct restyle message to send to the Python side
        /** @type {Js2PyRestyleMsg} */
        var restyleMsg = {
            style_data: styleData,
            style_traces: styleTraces,
            source_view_id: this.viewID
        };

        this.model.set("_js2py_restyle", restyleMsg);
        this.touch();
    },

    /**
     * Handle plotly_relayout events emitted by the Plotly.js library
     * @param data
     */
    handle_plotly_relayout: function (data) {

        if (data === null || data === undefined) {
            // No data to report to the Python side
            return
        }

        if (data.hasOwnProperty("_doNotReportToPy")) {
            // Relayout originated on the Python side
            return
        }

        /** @type {Js2PyRelayoutMsg} */
        var relayoutMsg = {
            relayout_data: data,
            source_view_id: this.viewID
        };

        this.model.set("_js2py_relayout", relayoutMsg);
        this.touch();
    },

    /**
     * Handle plotly_update events emitted by the Plotly.js library
     * @param data
     */
    handle_plotly_update: function (data) {

        if (data === null || data === undefined) {
            // No data to report to the Python side
            return
        }

        if (data["data"] &&
            data["data"][0].hasOwnProperty("_doNotReportToPy")) {
            // Update originated on the Python side
            return
        }

        /** @type {Js2PyUpdateMsg} */
        var updateMsg = {
            style_data: data["data"][0],
            style_traces: data["data"][1],
            layout_data: data["layout"],
            source_view_id: this.viewID
        };

        // Log message
        this.model.set("_js2py_update", updateMsg);
        this.touch();
    },

    /**
     * Handle plotly_click events emitted by the Plotly.js library
     * @param data
     */
    handle_plotly_click: function (data) {
        this._send_points_callback_message(data, "plotly_click");
    },

    /**
     * Handle plotly_hover events emitted by the Plotly.js library
     * @param data
     */
    handle_plotly_hover: function (data) {
        this._send_points_callback_message(data, "plotly_hover");
    },

    /**
     * Handle plotly_unhover events emitted by the Plotly.js library
     * @param data
     */
    handle_plotly_unhover: function (data) {
        this._send_points_callback_message(data, "plotly_unhover");
    },

    /**
     * Handle plotly_selected events emitted by the Plotly.js library
     * @param data
     */
    handle_plotly_selected: function (data) {
        this._send_points_callback_message(data, "plotly_selected");
    },

    /**
     * Handle plotly_deselect events emitted by the Plotly.js library
     * @param data
     */
    handle_plotly_deselect: function (data) {
        data = {
            points : []
        }
        this._send_points_callback_message(data, "plotly_deselect");
    },

    /**
     * Build and send a points callback message to the Python side
     *
     * @param {Object} data
     *  data object as provided by the plotly_click, plotly_hover,
     *  plotly_unhover, or plotly_selected events
     * @param {String} event_type
     *  Name of the triggering event. One of 'plotly_click',
     *  'plotly_hover', 'plotly_unhover', or 'plotly_selected'
     * @private
     */
    _send_points_callback_message: function (data, event_type) {
        if (data === null || data === undefined) {
            // No data to report to the Python side
            return;
        }

        /** @type {Js2PyPointsCallbackMsg} */
        var pointsMsg = {
            event_type: event_type,
            points: this.buildPointsObject(data),
            device_state: this.buildInputDeviceStateObject(data),
            selector: this.buildSelectorObject(data)
        };

        if (pointsMsg["points"] !== null &&
            pointsMsg["points"] !== undefined) {

            this.model.set("_js2py_pointsCallback", pointsMsg);
            this.touch();
        }
    },

    /**
     * Stub for future handling of plotly_doubleclick
     * @param data
     */
    handle_plotly_doubleclick: function (data) {},


    /**
     * Handle Plotly.addTraces request
     */
    do_addTraces: function () {

        /** @type {Py2JsAddTracesMsg} */
        var msgData = this.model.get("_py2js_addTraces");

        if (msgData !== null) {

            // Save off original number of traces
            var prevNumTraces = this.el.data.length;

            var that = this;
            Plotly.addTraces(this.el, msgData.trace_data).then(function () {

                // ### Send trace deltas ###
                that._sendTraceDeltas(msgData.trace_edit_id);

                // ### Send layout delta ###
                var layout_edit_id = msgData.layout_edit_id;
                that._sendLayoutDelta(layout_edit_id);
            });
        }
    },

    /**
     * Handle Plotly.deleteTraces request
     */
    do_deleteTraces: function () {

        /** @type {Py2JsDeleteTracesMsg} */
        var msgData = this.model.get("_py2js_deleteTraces");

        if (msgData  !== null){
            var delete_inds = msgData.delete_inds;
            var that = this;
            Plotly.deleteTraces(this.el, delete_inds).then(function () {

                // ### Send trace deltas ###
                var trace_edit_id = msgData.trace_edit_id;
                that._sendTraceDeltas(trace_edit_id);

                // ### Send layout delta ###
                var layout_edit_id = msgData.layout_edit_id;
                that._sendLayoutDelta(layout_edit_id);
            });
        }
    },

    /**
     * Handle Plotly.moveTraces request
     */
    do_moveTraces: function () {

        /** @type {Py2JsMoveTracesMsg} */
        var msgData = this.model.get("_py2js_moveTraces");

        if (msgData !== null){
            // Unpack message
            var currentInds = msgData.current_trace_inds;
            var newInds = msgData.new_trace_inds;

            // Check if the new trace indexes are actually different than
            // the current indexes
            var inds_equal = _.isEqual(currentInds, newInds);

            if (!inds_equal) {
                Plotly.moveTraces(this.el, currentInds, newInds)
            }
        }
    },

    /**
     * Handle Plotly.restyle request
     */
    do_restyle: function () {

        /** @type {Py2JsRestyleMsg} */
        var msgData = this.model.get("_py2js_restyle");
        if (msgData !== null) {
            var restyleData = msgData.restyle_data;
            var traceIndexes = this.model._normalize_trace_indexes(
                msgData.restyle_traces);

            restyleData["_doNotReportToPy"] = true;
            Plotly.restyle(this.el, restyleData, traceIndexes);

            // ### Send trace deltas ###
            // We create an array of deltas corresponding to the restyled
            // traces.
            this._sendTraceDeltas(msgData.trace_edit_id);

            // ### Send layout delta ###
            var layout_edit_id = msgData.layout_edit_id;
            this._sendLayoutDelta(layout_edit_id);
        }
    },

    /**
     * Handle Plotly.relayout request
     */
    do_relayout: function () {

        /** @type {Py2JsRelayoutMsg} */
        var msgData = this.model.get("_py2js_relayout");
        if (msgData !== null) {
            if (msgData.source_view_id !== this.viewID) {
                var relayoutData = msgData.relayout_data;
                relayoutData["_doNotReportToPy"] = true;
                Plotly.relayout(this.el, msgData.relayout_data);
            }

            // ### Send layout delta ###
            var layout_edit_id = msgData.layout_edit_id;
            this._sendLayoutDelta(layout_edit_id);
        }
    },

    /**
     * Handle Plotly.update request
     */
    do_update: function () {

        /** @type {Py2JsUpdateMsg} */
        var msgData = this.model.get("_py2js_update");

        if (msgData !== null) {
            var style = msgData.style_data || {};
            var layout = msgData.layout_data || {};
            var traceIndexes = this.model._normalize_trace_indexes(
                msgData.style_traces);

            style["_doNotReportToPy"] = true;
                Plotly.update(this.el, style, layout, traceIndexes);

            // ### Send trace deltas ###
            // We create an array of deltas corresponding to the updated
            // traces.
            this._sendTraceDeltas(msgData.trace_edit_id);

            // ### Send layout delta ###
            var layout_edit_id = msgData.layout_edit_id;
            this._sendLayoutDelta(layout_edit_id);
        }
    },

    /**
     * Handle Plotly.animate request
     */
    do_animate: function() {

        /** @type {Py2JsAnimateMsg} */
        var msgData = this.model.get("_py2js_animate");

        if (msgData !== null) {

            // Unpack params
            // var animationData = msgData[0];
            var animationOpts = msgData.animation_opts;

            var styles = msgData.style_data;
            var layout = msgData.layout_data;
            var traceIndexes = this.model._normalize_trace_indexes(
                msgData.style_traces);

            var animationData = {
                data: styles,
                layout: layout,
                traces: traceIndexes
            };

            animationData["_doNotReportToPy"] = true;
            var that = this;

            Plotly.animate(this.el, animationData, animationOpts).then(
                function () {

                    // ### Send trace deltas ###
                    // We create an array of deltas corresponding to the
                    // animated traces.
                    that._sendTraceDeltas(msgData.trace_edit_id);

                    // ### Send layout delta ###
                    var layout_edit_id = msgData.layout_edit_id;
                    that._sendLayoutDelta(layout_edit_id);
                });

        }
    },

    /**
     * Construct layout delta object and send layoutDelta message to the
     * Python side
     *
     * @param layout_edit_id
     *  Edit ID of message that triggered the creation of the layout delta
     * @private
     */
    _sendLayoutDelta: function(layout_edit_id) {
        // ### Handle layout delta ###
        var layout_delta = createDeltaObject(
            this.getFullLayout(),
            this.model.get("_layout"));

        /** @type{Js2PyLayoutDeltaMsg} */
        var layoutDeltaMsg = {
            layout_delta: layout_delta,
            layout_edit_id: layout_edit_id};

        this.model.set("_js2py_layoutDelta", layoutDeltaMsg);
        this.touch();
    },

    /**
     * Construct trace deltas array for the requested trace indexes and
     * send traceDeltas message to the Python side
     *  Array of indexes of traces for which to compute deltas
     * @param trace_edit_id
     *  Edit ID of message that triggered the creation of trace deltas
     * @private
     */
    _sendTraceDeltas: function (trace_edit_id) {

        var trace_data = this.model.get("_data");
        var traceIndexes = _.range(trace_data.length);
        var trace_deltas = new Array(traceIndexes.length);

        var fullData = this.getFullData();
        for (var i = 0; i < traceIndexes.length; i++) {
            var traceInd = traceIndexes[i];
            trace_deltas[i] = createDeltaObject(
                fullData[traceInd], trace_data[traceInd]);
        }

        /** @type{Js2PyTraceDeltasMsg} */
        var traceDeltasMsg = {
            trace_deltas: trace_deltas,
            trace_edit_id: trace_edit_id};

        this.model.set("_js2py_traceDeltas", traceDeltasMsg);
        this.touch();
    }
});

// Serialization
/**
 * Create a mapping from numpy dtype strings to corresponding typed array
 * constructors
 */
var numpy_dtype_to_typedarray_type = {
    int8: Int8Array,
    int16: Int16Array,
    int32: Int32Array,
    uint8: Uint8Array,
    uint16: Uint16Array,
    uint32: Uint32Array,
    float32: Float32Array,
    float64: Float64Array
};

function serializeTypedArray(v) {
    var numpyType;
    if (v instanceof Int8Array) {
        numpyType = 'int8';
    } else if (v instanceof Int16Array) {
        numpyType = 'int16';
    } else if (v instanceof Int32Array) {
        numpyType = 'int32';
    } else if (v instanceof Uint8Array) {
        numpyType = 'uint8';
    } else if (v instanceof Uint16Array) {
        numpyType = 'uint16';
    } else if (v instanceof Uint32Array) {
        numpyType = 'uint32';
    } else if (v instanceof Float32Array) {
        numpyType = 'float32';
    } else if (v instanceof Float64Array) {
        numpyType = 'float64';
    } else {
        // Don't understand it, return as is
        return v;
    }
    var res = {
        dtype: numpyType,
        shape: [v.length],
        value: v.buffer
    };
    return res
}

/**
 * ipywidget JavaScript -> Python serializer
 */
function js2py_serializer(v, widgetManager) {
    var res;

    if (_.isTypedArray(v)) {
        res = serializeTypedArray(v);
    } else if (Array.isArray(v)) {
        // Serialize array elements recursively
        res = new Array(v.length);
        for (var i = 0; i < v.length; i++) {
            res[i] = js2py_serializer(v[i]);
        }
    } else if (_.isPlainObject(v)) {
        // Serialize object properties recursively
        res = {};
        for (var p in v) {
            if (v.hasOwnProperty(p)) {
                res[p] = js2py_serializer(v[p]);
            }
        }
    } else if (v === undefined) {
        // Translate undefined into '_undefined_' sentinal string. The
        // Python _js_to_py deserializer will convert this into an
        // Undefined object
        res = "_undefined_";
    } else {
        // Primitive value to transfer directly
        res = v;
    }
    return res
}

/**
 * ipywidget Python -> Javascript deserializer
 */
function py2js_deserializer(v, widgetManager) {
    var res;

    if (Array.isArray(v)) {
        // Deserialize array elements recursively
        res = new Array(v.length);
        for (var i = 0; i < v.length; i++) {
            res[i] = py2js_deserializer(v[i]);
        }
    } else if (_.isPlainObject(v)) {
        if ((_.has(v, 'value') || _.has(v, 'buffer')) &&
            _.has(v, 'dtype') &&
            _.has(v, 'shape')) {
            // Deserialize special buffer/dtype/shape objects into typed arrays
            // These objects correspond to numpy arrays on the Python side
            //
            // Note plotly.py<=3.1.1 called the buffer object `buffer`
            // This was renamed `value` in 3.2 to work around a naming conflict
            // when saving widget state to a notebook.
            var typedarray_type = numpy_dtype_to_typedarray_type[v.dtype];
            var buffer = _.has(v, 'value')? v.value.buffer: v.buffer.buffer;
            res = new typedarray_type(buffer);
        } else {
            // Deserialize object properties recursively
            res = {};
            for (var p in v) {
                if (v.hasOwnProperty(p)) {
                    res[p] = py2js_deserializer(v[p]);
                }
            }
        }
    } else if (v === "_undefined_") {
        // Convert the _undefined_ sentinal into undefined
        res = undefined;
    } else {
        // Accept primitive value directly
        res = v;
    }
    return res
}

/**
 * Return whether the input value is a typed array
 * @param potentialTypedArray
 *  Value to examine
 * @returns {boolean}
 */
function isTypedArray(potentialTypedArray) {
    return ArrayBuffer.isView(potentialTypedArray) &&
        !(potentialTypedArray instanceof DataView);
}

/**
 * Customizer for use with lodash's mergeWith function
 *
 * The customizer ensures that typed arrays are not converted into standard
 * arrays during the recursive merge
 *
 * See: https://lodash.com/docs/latest#mergeWith
 */
function fullMergeCustomizer(objValue, srcValue, key) {
    if (key[0] === '_') {
        // Don't recurse into private properties
        return null
    } else if (isTypedArray(srcValue)) {
        // Return typed arrays directly, don't recurse inside
        return srcValue
    }
}

/**
 * Reform a Plotly.relayout like operation on an input object
 *
 * @param {Object} parentObj
 *  The object that the relayout operation should be applied to
 * @param {Object} relayoutData
 *  An relayout object as accepted by Plotly.relayout
 *
 *  Examples:
 *      var d = {foo {bar [5, 10]}};
 *      performRelayoutLike(d, {'foo.bar': [0, 1]});
 *      d -> {foo: {bar: [0, 1]}}
 *
 *      var d = {foo {bar [5, 10]}};
 *      performRelayoutLike(d, {'baz': 34});
 *      d -> {foo: {bar: [5, 10]}, baz: 34}
 *
 *      var d = {foo: {bar: [5, 10]};
 *      performRelayoutLike(d, {'foo.baz[1]': 17});
 *      d -> {foo: {bar: [5, 17]}}
 *
 */
function performRelayoutLike(parentObj, relayoutData) {
    // Perform a relayout style operation on a given parent object
    for (var rawKey in relayoutData) {
        if (!relayoutData.hasOwnProperty(rawKey)) {
            continue
        }

        // Extract value for this key
        var relayoutVal = relayoutData[rawKey];

        // Set property value
        if (relayoutVal === null) {
            _.unset(parentObj, rawKey);
        } else {
            _.set(parentObj, rawKey, relayoutVal);
        }
    }
}

/**
 * Perform a Plotly.restyle like operation on an input object array
 *
 * @param {Array.<Object>} parentArray
 *  The object that the restyle operation should be applied to
 * @param {Object} restyleData
 *  A restyle object as accepted by Plotly.restyle
 * @param {Array.<Number>} restyleTraces
 *  Array of indexes of the traces that the resytle operation applies to
 *
 *  Examples:
 *      var d = [{foo: {bar: 1}}, {}, {}]
 *      performRestyleLike(d, {'foo.bar': 2}, [0])
 *      d -> [{foo: {bar: 2}}, {}, {}]
 *
 *      var d = [{foo: {bar: 1}}, {}, {}]
 *      performRestyleLike(d, {'foo.bar': 2}, [0, 1, 2])
 *      d -> [{foo: {bar: 2}}, {foo: {bar: 2}}, {foo: {bar: 2}}]
 *
 *      var d = [{foo: {bar: 1}}, {}, {}]
 *      performRestyleLike(d, {'foo.bar': [2, 3, 4]}, [0, 1, 2])
 *      d -> [{foo: {bar: 2}}, {foo: {bar: 3}}, {foo: {bar: 4}}]
 *
 */
function performRestyleLike(parentArray, restyleData, restyleTraces) {
    // Loop over the properties of restyleData
    for (var rawKey in restyleData) {
        if (!restyleData.hasOwnProperty(rawKey)) { continue }

        // Extract value for property and normalize into a value list
        var valArray = restyleData[rawKey];
        if (!Array.isArray(valArray)) {
            valArray = [valArray]
        }

        // Loop over the indexes of the traces being restyled
        for (var i = 0; i < restyleTraces.length; i++) {

            // Get trace object
            var traceInd = restyleTraces[i];
            var trace = parentArray[traceInd];

            // Extract value for this trace
            var singleVal = valArray[i % valArray.length];

            // Set property value
            if (singleVal === null) {
                _.unset(trace, rawKey);
            } else if (singleVal !== undefined){
                _.set(trace, rawKey, singleVal);
            }
        }
    }
}

/**
 * Perform a Plotly.moveTraces like operation on an input object array
 * @param parentArray
 *  The object that the moveTraces operation should be applied to
 * @param currentInds
 *  Array of the current indexes of traces to be moved
 * @param newInds
 *  Array of the new indexes that traces selected by currentInds should be
 *  moved to.
 *
 *  Examples:
 *      var d = [{foo: 0}, {foo: 1}, {foo: 2}]
 *      performMoveTracesLike(d, [0, 1], [2, 0])
 *      d -> [{foo: 1}, {foo: 2}, {foo: 0}]
 *
 *      var d = [{foo: 0}, {foo: 1}, {foo: 2}]
 *      performMoveTracesLike(d, [0, 2], [1, 2])
 *      d -> [{foo: 1}, {foo: 0}, {foo: 2}]
 */
function performMoveTracesLike(parentArray, currentInds, newInds) {

    // ### Remove by currentInds in reverse order ###
    var movingTracesData = [];
    for (var ci = currentInds.length - 1; ci >= 0; ci--) {
        // Insert moving parentArray at beginning of the list
        movingTracesData.splice(0, 0, parentArray[currentInds[ci]]);
        parentArray.splice(currentInds[ci], 1);
    }

    // ### Sort newInds and movingTracesData by newInds ###
    var newIndexSortedArrays = _(newInds).zip(movingTracesData)
        .sortBy(0)
        .unzip()
        .value();

    newInds = newIndexSortedArrays[0];
    movingTracesData = newIndexSortedArrays[1];

    // ### Insert by newInds in forward order ###
    for (var ni = 0; ni < newInds.length; ni++) {
        parentArray.splice(newInds[ni], 0, movingTracesData[ni]);
    }
}

/**
 * Remove nested properties from a parent object
 * @param {Object} parentObj
 *  Parent object from which properties or nested properties should be removed
 * @param {Array.<Array.<Number|String>>} keyPaths
 *  Array of key paths for properties that should be removed. Each key path
 *  is an array of properties names or array indexes that reference a
 *  property to be removed
 *
 *  Examples:
 *      var d = {foo: [{bar: 0}, {bar: 1}], baz: 32}
 *      performRemoveProps(d, ['baz'])
 *      d -> {foo: [{bar: 0}, {bar: 1}]}
 *
 *      var d = {foo: [{bar: 0}, {bar: 1}], baz: 32}
 *      performRemoveProps(d, ['foo[1].bar', 'baz'])
 *      d -> {foo: [{bar: 0}, {}]}
 *
 */
function performRemoveProps(parentObj, keyPaths) {

    for(var i=0; i < keyPaths.length; i++) {
        var keyPath = keyPaths[i];
        _.unset(parentObj, keyPath);
    }
}


/**
 * Return object that contains all properties in fullObj that are not
 * identical to the corresponding properties in removeObj
 *
 * Properties of fullObj and removeObj may be objects or arrays of objects
 *
 * Returned object is a deep clone of the properties of the input objects
 *
 * @param {Object} fullObj
 * @param {Object} removeObj
 *
 *  Examples:
 *      var fullD = {foo: [{bar: 0}, {bar: 1}], baz: 32}
 *      var removeD = {baz: 32}
 *      createDeltaObject(fullD, removeD)
 *          -> {foo: [{bar: 0}, {bar: 1}]}
 *
 *      var fullD = {foo: [{bar: 0}, {bar: 1}], baz: 32}
 *      var removeD = {baz: 45}
 *      createDeltaObject(fullD, removeD)
 *          -> {foo: [{bar: 0}, {bar: 1}], baz: 32}
 *
 *      var fullD = {foo: [{bar: 0}, {bar: 1}], baz: 32}
 *      var removeD = {foo: [{bar: 0}, {bar: 1}]}
 *      createDeltaObject(fullD, removeD)
 *          -> {baz: 32}
 *
 */
function createDeltaObject(fullObj, removeObj) {

    // Initialize result as object or array
    var res;
    if(Array.isArray(fullObj)) {
        res = new Array(fullObj.length);
    } else {
        res = {};
    }

    // Initialize removeObj to empty object if not specified
    if (removeObj === null || removeObj === undefined) {
        removeObj = {};
    }

    // Iterate over object properties or array indices
    for (var p in fullObj) {
        if (p[0] !== "_" &&  // Don't consider private properties
            fullObj.hasOwnProperty(p) &&  // Exclude parent properties
            fullObj[p] !== null  // Exclude cases where fullObj doesn't
                                 // have the property
        ) {
            // Compute object equality
            var props_equal;
            props_equal = _.isEqual(fullObj[p], removeObj[p]);

            // Perform recursive comparison if props are not equal
            if (!props_equal || p === "uid") {  // Let uids through

                // property has non-null value in fullObj that doesn't
                // match the value in removeObj
                var fullVal = fullObj[p];
                if (removeObj.hasOwnProperty(p) &&
                    typeof fullVal === "object") {
                    // Recurse over object properties
                    if(Array.isArray(fullVal)) {

                        if (fullVal.length > 0 &&
                            typeof(fullVal[0]) === "object") {
                            // We have an object array
                            res[p] = new Array(fullVal.length);
                            for (var i = 0; i < fullVal.length; i++) {
                                if (!Array.isArray(removeObj[p]) ||
                                    removeObj[p].length <= i) {

                                    res[p][i] = fullVal[i]
                                } else {
                                    res[p][i] = createDeltaObject(fullVal[i],
                                        removeObj[p][i]);
                                }
                            }
                        } else {
                            // We have a primitive array or typed array
                            res[p] = fullVal;
                        }
                    } else { // object
                        var full_obj = createDeltaObject(fullVal,
                            removeObj[p]);
                        if (Object.keys(full_obj).length > 0) {
                            // new object is not empty
                            res[p] = full_obj;
                        }
                    }
                } else if (typeof fullVal === "object" &&
                    !Array.isArray(fullVal)) {
                    // Return 'clone' of fullVal
                    // We don't use a standard clone method so that we keep
                    // the special case handling of this method
                    res[p] = createDeltaObject(fullVal, {});

                } else if (fullVal !== undefined &&
                    typeof fullVal !== 'function') {
                    // No recursion necessary, Just keep value from fullObj.
                    // But skip values with function type
                    res[p] = fullVal;
                }
            }
        }
    }
    return res
}

function randstr(existing, bits, base, _recursion) {
    if(!base) base = 16;
    if(bits === undefined) bits = 24;
    if(bits <= 0) return '0';

    var digits = Math.log(Math.pow(2, bits)) / Math.log(base);
    var res = '';
    var i, b, x;

    for(i = 2; digits === Infinity; i *= 2) {
        digits = Math.log(Math.pow(2, bits / i)) / Math.log(base) * i;
    }

    var rem = digits - Math.floor(digits);

    for(i = 0; i < Math.floor(digits); i++) {
        x = Math.floor(Math.random() * base).toString(base);
        res = x + res;
    }

    if(rem) {
        b = Math.pow(base, rem);
        x = Math.floor(Math.random() * b).toString(base);
        res = x + res;
    }

    var parsed = parseInt(res, base);
    if((existing && existing[res]) ||
        (parsed !== Infinity && parsed >= Math.pow(2, bits))) {
        if(_recursion > 10) {
            lib.warn('randstr failed uniqueness');
            return res;
        }
        return randstr(existing, bits, base, (_recursion || 0) + 1);
    } else return res;
}

module.exports = {
    FigureView : FigureView,
    FigureModel: FigureModel
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, module) {var __WEBPACK_AMD_DEFINE_RESULT__;/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
;(function() {

  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
  var undefined;

  /** Used as the semantic version number. */
  var VERSION = '4.17.13';

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;

  /** Error message constants. */
  var CORE_ERROR_TEXT = 'Unsupported core-js use. Try https://npms.io/search?q=ponyfill.',
      FUNC_ERROR_TEXT = 'Expected a function';

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED = '__lodash_hash_undefined__';

  /** Used as the maximum memoize cache size. */
  var MAX_MEMOIZE_SIZE = 500;

  /** Used as the internal argument placeholder. */
  var PLACEHOLDER = '__lodash_placeholder__';

  /** Used to compose bitmasks for cloning. */
  var CLONE_DEEP_FLAG = 1,
      CLONE_FLAT_FLAG = 2,
      CLONE_SYMBOLS_FLAG = 4;

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG = 1,
      COMPARE_UNORDERED_FLAG = 2;

  /** Used to compose bitmasks for function metadata. */
  var WRAP_BIND_FLAG = 1,
      WRAP_BIND_KEY_FLAG = 2,
      WRAP_CURRY_BOUND_FLAG = 4,
      WRAP_CURRY_FLAG = 8,
      WRAP_CURRY_RIGHT_FLAG = 16,
      WRAP_PARTIAL_FLAG = 32,
      WRAP_PARTIAL_RIGHT_FLAG = 64,
      WRAP_ARY_FLAG = 128,
      WRAP_REARG_FLAG = 256,
      WRAP_FLIP_FLAG = 512;

  /** Used as default options for `_.truncate`. */
  var DEFAULT_TRUNC_LENGTH = 30,
      DEFAULT_TRUNC_OMISSION = '...';

  /** Used to detect hot functions by number of calls within a span of milliseconds. */
  var HOT_COUNT = 800,
      HOT_SPAN = 16;

  /** Used to indicate the type of lazy iteratees. */
  var LAZY_FILTER_FLAG = 1,
      LAZY_MAP_FLAG = 2,
      LAZY_WHILE_FLAG = 3;

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0,
      MAX_SAFE_INTEGER = 9007199254740991,
      MAX_INTEGER = 1.7976931348623157e+308,
      NAN = 0 / 0;

  /** Used as references for the maximum length and index of an array. */
  var MAX_ARRAY_LENGTH = 4294967295,
      MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1,
      HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;

  /** Used to associate wrap methods with their bit flags. */
  var wrapFlags = [
    ['ary', WRAP_ARY_FLAG],
    ['bind', WRAP_BIND_FLAG],
    ['bindKey', WRAP_BIND_KEY_FLAG],
    ['curry', WRAP_CURRY_FLAG],
    ['curryRight', WRAP_CURRY_RIGHT_FLAG],
    ['flip', WRAP_FLIP_FLAG],
    ['partial', WRAP_PARTIAL_FLAG],
    ['partialRight', WRAP_PARTIAL_RIGHT_FLAG],
    ['rearg', WRAP_REARG_FLAG]
  ];

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      asyncTag = '[object AsyncFunction]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      domExcTag = '[object DOMException]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      nullTag = '[object Null]',
      objectTag = '[object Object]',
      promiseTag = '[object Promise]',
      proxyTag = '[object Proxy]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      symbolTag = '[object Symbol]',
      undefinedTag = '[object Undefined]',
      weakMapTag = '[object WeakMap]',
      weakSetTag = '[object WeakSet]';

  var arrayBufferTag = '[object ArrayBuffer]',
      dataViewTag = '[object DataView]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';

  /** Used to match empty string literals in compiled template source. */
  var reEmptyStringLeading = /\b__p \+= '';/g,
      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

  /** Used to match HTML entities and HTML characters. */
  var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g,
      reUnescapedHtml = /[&<>"']/g,
      reHasEscapedHtml = RegExp(reEscapedHtml.source),
      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

  /** Used to match template delimiters. */
  var reEscape = /<%-([\s\S]+?)%>/g,
      reEvaluate = /<%([\s\S]+?)%>/g,
      reInterpolate = /<%=([\s\S]+?)%>/g;

  /** Used to match property names within property paths. */
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      reIsPlainProp = /^\w*$/,
      rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
      reHasRegExpChar = RegExp(reRegExpChar.source);

  /** Used to match leading and trailing whitespace. */
  var reTrim = /^\s+|\s+$/g,
      reTrimStart = /^\s+/,
      reTrimEnd = /\s+$/;

  /** Used to match wrap detail comments. */
  var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,
      reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/,
      reSplitDetails = /,? & /;

  /** Used to match words composed of alphanumeric characters. */
  var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;

  /** Used to match backslashes in property paths. */
  var reEscapeChar = /\\(\\)?/g;

  /**
   * Used to match
   * [ES template delimiters](http://ecma-international.org/ecma-262/7.0/#sec-template-literal-lexical-components).
   */
  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

  /** Used to match `RegExp` flags from their coerced string values. */
  var reFlags = /\w*$/;

  /** Used to detect bad signed hexadecimal string values. */
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

  /** Used to detect binary string values. */
  var reIsBinary = /^0b[01]+$/i;

  /** Used to detect host constructors (Safari). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used to detect octal string values. */
  var reIsOctal = /^0o[0-7]+$/i;

  /** Used to detect unsigned integer values. */
  var reIsUint = /^(?:0|[1-9]\d*)$/;

  /** Used to match Latin Unicode letters (excluding mathematical operators). */
  var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;

  /** Used to ensure capturing order of template delimiters. */
  var reNoMatch = /($^)/;

  /** Used to match unescaped characters in compiled string literals. */
  var reUnescapedString = /['\n\r\u2028\u2029\\]/g;

  /** Used to compose unicode character classes. */
  var rsAstralRange = '\\ud800-\\udfff',
      rsComboMarksRange = '\\u0300-\\u036f',
      reComboHalfMarksRange = '\\ufe20-\\ufe2f',
      rsComboSymbolsRange = '\\u20d0-\\u20ff',
      rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
      rsDingbatRange = '\\u2700-\\u27bf',
      rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
      rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
      rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
      rsPunctuationRange = '\\u2000-\\u206f',
      rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
      rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
      rsVarRange = '\\ufe0e\\ufe0f',
      rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;

  /** Used to compose unicode capture groups. */
  var rsApos = "['\u2019]",
      rsAstral = '[' + rsAstralRange + ']',
      rsBreak = '[' + rsBreakRange + ']',
      rsCombo = '[' + rsComboRange + ']',
      rsDigits = '\\d+',
      rsDingbat = '[' + rsDingbatRange + ']',
      rsLower = '[' + rsLowerRange + ']',
      rsMisc = '[^' + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
      rsFitz = '\\ud83c[\\udffb-\\udfff]',
      rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
      rsNonAstral = '[^' + rsAstralRange + ']',
      rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
      rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
      rsUpper = '[' + rsUpperRange + ']',
      rsZWJ = '\\u200d';

  /** Used to compose unicode regexes. */
  var rsMiscLower = '(?:' + rsLower + '|' + rsMisc + ')',
      rsMiscUpper = '(?:' + rsUpper + '|' + rsMisc + ')',
      rsOptContrLower = '(?:' + rsApos + '(?:d|ll|m|re|s|t|ve))?',
      rsOptContrUpper = '(?:' + rsApos + '(?:D|LL|M|RE|S|T|VE))?',
      reOptMod = rsModifier + '?',
      rsOptVar = '[' + rsVarRange + ']?',
      rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
      rsOrdLower = '\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])',
      rsOrdUpper = '\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])',
      rsSeq = rsOptVar + reOptMod + rsOptJoin,
      rsEmoji = '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq,
      rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

  /** Used to match apostrophes. */
  var reApos = RegExp(rsApos, 'g');

  /**
   * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
   * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
   */
  var reComboMark = RegExp(rsCombo, 'g');

  /** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
  var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

  /** Used to match complex or compound words. */
  var reUnicodeWord = RegExp([
    rsUpper + '?' + rsLower + '+' + rsOptContrLower + '(?=' + [rsBreak, rsUpper, '$'].join('|') + ')',
    rsMiscUpper + '+' + rsOptContrUpper + '(?=' + [rsBreak, rsUpper + rsMiscLower, '$'].join('|') + ')',
    rsUpper + '?' + rsMiscLower + '+' + rsOptContrLower,
    rsUpper + '+' + rsOptContrUpper,
    rsOrdUpper,
    rsOrdLower,
    rsDigits,
    rsEmoji
  ].join('|'), 'g');

  /** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
  var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');

  /** Used to detect strings that need a more robust regexp to match words. */
  var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;

  /** Used to assign default `context` object properties. */
  var contextProps = [
    'Array', 'Buffer', 'DataView', 'Date', 'Error', 'Float32Array', 'Float64Array',
    'Function', 'Int8Array', 'Int16Array', 'Int32Array', 'Map', 'Math', 'Object',
    'Promise', 'RegExp', 'Set', 'String', 'Symbol', 'TypeError', 'Uint8Array',
    'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'WeakMap',
    '_', 'clearTimeout', 'isFinite', 'parseInt', 'setTimeout'
  ];

  /** Used to make template sourceURLs easier to identify. */
  var templateCounter = -1;

  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
  typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
  typedArrayTags[errorTag] = typedArrayTags[funcTag] =
  typedArrayTags[mapTag] = typedArrayTags[numberTag] =
  typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
  typedArrayTags[setTag] = typedArrayTags[stringTag] =
  typedArrayTags[weakMapTag] = false;

  /** Used to identify `toStringTag` values supported by `_.clone`. */
  var cloneableTags = {};
  cloneableTags[argsTag] = cloneableTags[arrayTag] =
  cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
  cloneableTags[boolTag] = cloneableTags[dateTag] =
  cloneableTags[float32Tag] = cloneableTags[float64Tag] =
  cloneableTags[int8Tag] = cloneableTags[int16Tag] =
  cloneableTags[int32Tag] = cloneableTags[mapTag] =
  cloneableTags[numberTag] = cloneableTags[objectTag] =
  cloneableTags[regexpTag] = cloneableTags[setTag] =
  cloneableTags[stringTag] = cloneableTags[symbolTag] =
  cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
  cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
  cloneableTags[errorTag] = cloneableTags[funcTag] =
  cloneableTags[weakMapTag] = false;

  /** Used to map Latin Unicode letters to basic Latin letters. */
  var deburredLetters = {
    // Latin-1 Supplement block.
    '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
    '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
    '\xc7': 'C',  '\xe7': 'c',
    '\xd0': 'D',  '\xf0': 'd',
    '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
    '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
    '\xcc': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
    '\xec': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
    '\xd1': 'N',  '\xf1': 'n',
    '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
    '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
    '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
    '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
    '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
    '\xc6': 'Ae', '\xe6': 'ae',
    '\xde': 'Th', '\xfe': 'th',
    '\xdf': 'ss',
    // Latin Extended-A block.
    '\u0100': 'A',  '\u0102': 'A', '\u0104': 'A',
    '\u0101': 'a',  '\u0103': 'a', '\u0105': 'a',
    '\u0106': 'C',  '\u0108': 'C', '\u010a': 'C', '\u010c': 'C',
    '\u0107': 'c',  '\u0109': 'c', '\u010b': 'c', '\u010d': 'c',
    '\u010e': 'D',  '\u0110': 'D', '\u010f': 'd', '\u0111': 'd',
    '\u0112': 'E',  '\u0114': 'E', '\u0116': 'E', '\u0118': 'E', '\u011a': 'E',
    '\u0113': 'e',  '\u0115': 'e', '\u0117': 'e', '\u0119': 'e', '\u011b': 'e',
    '\u011c': 'G',  '\u011e': 'G', '\u0120': 'G', '\u0122': 'G',
    '\u011d': 'g',  '\u011f': 'g', '\u0121': 'g', '\u0123': 'g',
    '\u0124': 'H',  '\u0126': 'H', '\u0125': 'h', '\u0127': 'h',
    '\u0128': 'I',  '\u012a': 'I', '\u012c': 'I', '\u012e': 'I', '\u0130': 'I',
    '\u0129': 'i',  '\u012b': 'i', '\u012d': 'i', '\u012f': 'i', '\u0131': 'i',
    '\u0134': 'J',  '\u0135': 'j',
    '\u0136': 'K',  '\u0137': 'k', '\u0138': 'k',
    '\u0139': 'L',  '\u013b': 'L', '\u013d': 'L', '\u013f': 'L', '\u0141': 'L',
    '\u013a': 'l',  '\u013c': 'l', '\u013e': 'l', '\u0140': 'l', '\u0142': 'l',
    '\u0143': 'N',  '\u0145': 'N', '\u0147': 'N', '\u014a': 'N',
    '\u0144': 'n',  '\u0146': 'n', '\u0148': 'n', '\u014b': 'n',
    '\u014c': 'O',  '\u014e': 'O', '\u0150': 'O',
    '\u014d': 'o',  '\u014f': 'o', '\u0151': 'o',
    '\u0154': 'R',  '\u0156': 'R', '\u0158': 'R',
    '\u0155': 'r',  '\u0157': 'r', '\u0159': 'r',
    '\u015a': 'S',  '\u015c': 'S', '\u015e': 'S', '\u0160': 'S',
    '\u015b': 's',  '\u015d': 's', '\u015f': 's', '\u0161': 's',
    '\u0162': 'T',  '\u0164': 'T', '\u0166': 'T',
    '\u0163': 't',  '\u0165': 't', '\u0167': 't',
    '\u0168': 'U',  '\u016a': 'U', '\u016c': 'U', '\u016e': 'U', '\u0170': 'U', '\u0172': 'U',
    '\u0169': 'u',  '\u016b': 'u', '\u016d': 'u', '\u016f': 'u', '\u0171': 'u', '\u0173': 'u',
    '\u0174': 'W',  '\u0175': 'w',
    '\u0176': 'Y',  '\u0177': 'y', '\u0178': 'Y',
    '\u0179': 'Z',  '\u017b': 'Z', '\u017d': 'Z',
    '\u017a': 'z',  '\u017c': 'z', '\u017e': 'z',
    '\u0132': 'IJ', '\u0133': 'ij',
    '\u0152': 'Oe', '\u0153': 'oe',
    '\u0149': "'n", '\u017f': 's'
  };

  /** Used to map characters to HTML entities. */
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  /** Used to map HTML entities to characters. */
  var htmlUnescapes = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'"
  };

  /** Used to escape characters for inclusion in compiled string literals. */
  var stringEscapes = {
    '\\': '\\',
    "'": "'",
    '\n': 'n',
    '\r': 'r',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  /** Built-in method references without a dependency on `root`. */
  var freeParseFloat = parseFloat,
      freeParseInt = parseInt;

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = freeGlobal || freeSelf || Function('return this')();

  /** Detect free variable `exports`. */
  var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports;

  /** Detect free variable `process` from Node.js. */
  var freeProcess = moduleExports && freeGlobal.process;

  /** Used to access faster Node.js helpers. */
  var nodeUtil = (function() {
    try {
      // Use `util.types` for Node.js 10+.
      var types = freeModule && freeModule.require && freeModule.require('util').types;

      if (types) {
        return types;
      }

      // Legacy `process.binding('util')` for Node.js < 10.
      return freeProcess && freeProcess.binding && freeProcess.binding('util');
    } catch (e) {}
  }());

  /* Node.js helper references. */
  var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer,
      nodeIsDate = nodeUtil && nodeUtil.isDate,
      nodeIsMap = nodeUtil && nodeUtil.isMap,
      nodeIsRegExp = nodeUtil && nodeUtil.isRegExp,
      nodeIsSet = nodeUtil && nodeUtil.isSet,
      nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

  /*--------------------------------------------------------------------------*/

  /**
   * A faster alternative to `Function#apply`, this function invokes `func`
   * with the `this` binding of `thisArg` and the arguments of `args`.
   *
   * @private
   * @param {Function} func The function to invoke.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {Array} args The arguments to invoke `func` with.
   * @returns {*} Returns the result of `func`.
   */
  function apply(func, thisArg, args) {
    switch (args.length) {
      case 0: return func.call(thisArg);
      case 1: return func.call(thisArg, args[0]);
      case 2: return func.call(thisArg, args[0], args[1]);
      case 3: return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
  }

  /**
   * A specialized version of `baseAggregator` for arrays.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} setter The function to set `accumulator` values.
   * @param {Function} iteratee The iteratee to transform keys.
   * @param {Object} accumulator The initial aggregated object.
   * @returns {Function} Returns `accumulator`.
   */
  function arrayAggregator(array, setter, iteratee, accumulator) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      var value = array[index];
      setter(accumulator, value, iteratee(value), array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.forEach` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEach(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * A specialized version of `_.forEachRight` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEachRight(array, iteratee) {
    var length = array == null ? 0 : array.length;

    while (length--) {
      if (iteratee(array[length], length, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * A specialized version of `_.every` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if all elements pass the predicate check,
   *  else `false`.
   */
  function arrayEvery(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (!predicate(array[index], index, array)) {
        return false;
      }
    }
    return true;
  }

  /**
   * A specialized version of `_.filter` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   */
  function arrayFilter(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }

  /**
   * A specialized version of `_.includes` for arrays without support for
   * specifying an index to search from.
   *
   * @private
   * @param {Array} [array] The array to inspect.
   * @param {*} target The value to search for.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */
  function arrayIncludes(array, value) {
    var length = array == null ? 0 : array.length;
    return !!length && baseIndexOf(array, value, 0) > -1;
  }

  /**
   * This function is like `arrayIncludes` except that it accepts a comparator.
   *
   * @private
   * @param {Array} [array] The array to inspect.
   * @param {*} target The value to search for.
   * @param {Function} comparator The comparator invoked per element.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */
  function arrayIncludesWith(array, value, comparator) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (comparator(value, array[index])) {
        return true;
      }
    }
    return false;
  }

  /**
   * A specialized version of `_.map` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function arrayMap(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length,
        result = Array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }

  /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */
  function arrayPush(array, values) {
    var index = -1,
        length = values.length,
        offset = array.length;

    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }

  /**
   * A specialized version of `_.reduce` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @param {boolean} [initAccum] Specify using the first element of `array` as
   *  the initial value.
   * @returns {*} Returns the accumulated value.
   */
  function arrayReduce(array, iteratee, accumulator, initAccum) {
    var index = -1,
        length = array == null ? 0 : array.length;

    if (initAccum && length) {
      accumulator = array[++index];
    }
    while (++index < length) {
      accumulator = iteratee(accumulator, array[index], index, array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.reduceRight` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @param {boolean} [initAccum] Specify using the last element of `array` as
   *  the initial value.
   * @returns {*} Returns the accumulated value.
   */
  function arrayReduceRight(array, iteratee, accumulator, initAccum) {
    var length = array == null ? 0 : array.length;
    if (initAccum && length) {
      accumulator = array[--length];
    }
    while (length--) {
      accumulator = iteratee(accumulator, array[length], length, array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.some` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if any element passes the predicate check,
   *  else `false`.
   */
  function arraySome(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Gets the size of an ASCII `string`.
   *
   * @private
   * @param {string} string The string inspect.
   * @returns {number} Returns the string size.
   */
  var asciiSize = baseProperty('length');

  /**
   * Converts an ASCII `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */
  function asciiToArray(string) {
    return string.split('');
  }

  /**
   * Splits an ASCII `string` into an array of its words.
   *
   * @private
   * @param {string} The string to inspect.
   * @returns {Array} Returns the words of `string`.
   */
  function asciiWords(string) {
    return string.match(reAsciiWord) || [];
  }

  /**
   * The base implementation of methods like `_.findKey` and `_.findLastKey`,
   * without support for iteratee shorthands, which iterates over `collection`
   * using `eachFunc`.
   *
   * @private
   * @param {Array|Object} collection The collection to inspect.
   * @param {Function} predicate The function invoked per iteration.
   * @param {Function} eachFunc The function to iterate over `collection`.
   * @returns {*} Returns the found element or its key, else `undefined`.
   */
  function baseFindKey(collection, predicate, eachFunc) {
    var result;
    eachFunc(collection, function(value, key, collection) {
      if (predicate(value, key, collection)) {
        result = key;
        return false;
      }
    });
    return result;
  }

  /**
   * The base implementation of `_.findIndex` and `_.findLastIndex` without
   * support for iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Function} predicate The function invoked per iteration.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseFindIndex(array, predicate, fromIndex, fromRight) {
    var length = array.length,
        index = fromIndex + (fromRight ? 1 : -1);

    while ((fromRight ? index-- : ++index < length)) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOf(array, value, fromIndex) {
    return value === value
      ? strictIndexOf(array, value, fromIndex)
      : baseFindIndex(array, baseIsNaN, fromIndex);
  }

  /**
   * This function is like `baseIndexOf` except that it accepts a comparator.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @param {Function} comparator The comparator invoked per element.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOfWith(array, value, fromIndex, comparator) {
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (comparator(array[index], value)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.isNaN` without support for number objects.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
   */
  function baseIsNaN(value) {
    return value !== value;
  }

  /**
   * The base implementation of `_.mean` and `_.meanBy` without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {number} Returns the mean.
   */
  function baseMean(array, iteratee) {
    var length = array == null ? 0 : array.length;
    return length ? (baseSum(array, iteratee) / length) : NAN;
  }

  /**
   * The base implementation of `_.property` without support for deep paths.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @returns {Function} Returns the new accessor function.
   */
  function baseProperty(key) {
    return function(object) {
      return object == null ? undefined : object[key];
    };
  }

  /**
   * The base implementation of `_.propertyOf` without support for deep paths.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Function} Returns the new accessor function.
   */
  function basePropertyOf(object) {
    return function(key) {
      return object == null ? undefined : object[key];
    };
  }

  /**
   * The base implementation of `_.reduce` and `_.reduceRight`, without support
   * for iteratee shorthands, which iterates over `collection` using `eachFunc`.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} accumulator The initial value.
   * @param {boolean} initAccum Specify using the first or last element of
   *  `collection` as the initial value.
   * @param {Function} eachFunc The function to iterate over `collection`.
   * @returns {*} Returns the accumulated value.
   */
  function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
    eachFunc(collection, function(value, index, collection) {
      accumulator = initAccum
        ? (initAccum = false, value)
        : iteratee(accumulator, value, index, collection);
    });
    return accumulator;
  }

  /**
   * The base implementation of `_.sortBy` which uses `comparer` to define the
   * sort order of `array` and replaces criteria objects with their corresponding
   * values.
   *
   * @private
   * @param {Array} array The array to sort.
   * @param {Function} comparer The function to define sort order.
   * @returns {Array} Returns `array`.
   */
  function baseSortBy(array, comparer) {
    var length = array.length;

    array.sort(comparer);
    while (length--) {
      array[length] = array[length].value;
    }
    return array;
  }

  /**
   * The base implementation of `_.sum` and `_.sumBy` without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {number} Returns the sum.
   */
  function baseSum(array, iteratee) {
    var result,
        index = -1,
        length = array.length;

    while (++index < length) {
      var current = iteratee(array[index]);
      if (current !== undefined) {
        result = result === undefined ? current : (result + current);
      }
    }
    return result;
  }

  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */
  function baseTimes(n, iteratee) {
    var index = -1,
        result = Array(n);

    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }

  /**
   * The base implementation of `_.toPairs` and `_.toPairsIn` which creates an array
   * of key-value pairs for `object` corresponding to the property names of `props`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} props The property names to get values for.
   * @returns {Object} Returns the key-value pairs.
   */
  function baseToPairs(object, props) {
    return arrayMap(props, function(key) {
      return [key, object[key]];
    });
  }

  /**
   * The base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }

  /**
   * The base implementation of `_.values` and `_.valuesIn` which creates an
   * array of `object` property values corresponding to the property names
   * of `props`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} props The property names to get values for.
   * @returns {Object} Returns the array of property values.
   */
  function baseValues(object, props) {
    return arrayMap(props, function(key) {
      return object[key];
    });
  }

  /**
   * Checks if a `cache` value for `key` exists.
   *
   * @private
   * @param {Object} cache The cache to query.
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function cacheHas(cache, key) {
    return cache.has(key);
  }

  /**
   * Used by `_.trim` and `_.trimStart` to get the index of the first string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {Array} strSymbols The string symbols to inspect.
   * @param {Array} chrSymbols The character symbols to find.
   * @returns {number} Returns the index of the first unmatched string symbol.
   */
  function charsStartIndex(strSymbols, chrSymbols) {
    var index = -1,
        length = strSymbols.length;

    while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
    return index;
  }

  /**
   * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {Array} strSymbols The string symbols to inspect.
   * @param {Array} chrSymbols The character symbols to find.
   * @returns {number} Returns the index of the last unmatched string symbol.
   */
  function charsEndIndex(strSymbols, chrSymbols) {
    var index = strSymbols.length;

    while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
    return index;
  }

  /**
   * Gets the number of `placeholder` occurrences in `array`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} placeholder The placeholder to search for.
   * @returns {number} Returns the placeholder count.
   */
  function countHolders(array, placeholder) {
    var length = array.length,
        result = 0;

    while (length--) {
      if (array[length] === placeholder) {
        ++result;
      }
    }
    return result;
  }

  /**
   * Used by `_.deburr` to convert Latin-1 Supplement and Latin Extended-A
   * letters to basic Latin letters.
   *
   * @private
   * @param {string} letter The matched letter to deburr.
   * @returns {string} Returns the deburred letter.
   */
  var deburrLetter = basePropertyOf(deburredLetters);

  /**
   * Used by `_.escape` to convert characters to HTML entities.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  var escapeHtmlChar = basePropertyOf(htmlEscapes);

  /**
   * Used by `_.template` to escape characters for inclusion in compiled string literals.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeStringChar(chr) {
    return '\\' + stringEscapes[chr];
  }

  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }

  /**
   * Checks if `string` contains Unicode symbols.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {boolean} Returns `true` if a symbol is found, else `false`.
   */
  function hasUnicode(string) {
    return reHasUnicode.test(string);
  }

  /**
   * Checks if `string` contains a word composed of Unicode symbols.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {boolean} Returns `true` if a word is found, else `false`.
   */
  function hasUnicodeWord(string) {
    return reHasUnicodeWord.test(string);
  }

  /**
   * Converts `iterator` to an array.
   *
   * @private
   * @param {Object} iterator The iterator to convert.
   * @returns {Array} Returns the converted array.
   */
  function iteratorToArray(iterator) {
    var data,
        result = [];

    while (!(data = iterator.next()).done) {
      result.push(data.value);
    }
    return result;
  }

  /**
   * Converts `map` to its key-value pairs.
   *
   * @private
   * @param {Object} map The map to convert.
   * @returns {Array} Returns the key-value pairs.
   */
  function mapToArray(map) {
    var index = -1,
        result = Array(map.size);

    map.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }

  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }

  /**
   * Replaces all `placeholder` elements in `array` with an internal placeholder
   * and returns an array of their indexes.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {*} placeholder The placeholder to replace.
   * @returns {Array} Returns the new array of placeholder indexes.
   */
  function replaceHolders(array, placeholder) {
    var index = -1,
        length = array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (value === placeholder || value === PLACEHOLDER) {
        array[index] = PLACEHOLDER;
        result[resIndex++] = index;
      }
    }
    return result;
  }

  /**
   * Converts `set` to an array of its values.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the values.
   */
  function setToArray(set) {
    var index = -1,
        result = Array(set.size);

    set.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }

  /**
   * Converts `set` to its value-value pairs.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the value-value pairs.
   */
  function setToPairs(set) {
    var index = -1,
        result = Array(set.size);

    set.forEach(function(value) {
      result[++index] = [value, value];
    });
    return result;
  }

  /**
   * A specialized version of `_.indexOf` which performs strict equality
   * comparisons of values, i.e. `===`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function strictIndexOf(array, value, fromIndex) {
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * A specialized version of `_.lastIndexOf` which performs strict equality
   * comparisons of values, i.e. `===`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function strictLastIndexOf(array, value, fromIndex) {
    var index = fromIndex + 1;
    while (index--) {
      if (array[index] === value) {
        return index;
      }
    }
    return index;
  }

  /**
   * Gets the number of symbols in `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the string size.
   */
  function stringSize(string) {
    return hasUnicode(string)
      ? unicodeSize(string)
      : asciiSize(string);
  }

  /**
   * Converts `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */
  function stringToArray(string) {
    return hasUnicode(string)
      ? unicodeToArray(string)
      : asciiToArray(string);
  }

  /**
   * Used by `_.unescape` to convert HTML entities to characters.
   *
   * @private
   * @param {string} chr The matched character to unescape.
   * @returns {string} Returns the unescaped character.
   */
  var unescapeHtmlChar = basePropertyOf(htmlUnescapes);

  /**
   * Gets the size of a Unicode `string`.
   *
   * @private
   * @param {string} string The string inspect.
   * @returns {number} Returns the string size.
   */
  function unicodeSize(string) {
    var result = reUnicode.lastIndex = 0;
    while (reUnicode.test(string)) {
      ++result;
    }
    return result;
  }

  /**
   * Converts a Unicode `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */
  function unicodeToArray(string) {
    return string.match(reUnicode) || [];
  }

  /**
   * Splits a Unicode `string` into an array of its words.
   *
   * @private
   * @param {string} The string to inspect.
   * @returns {Array} Returns the words of `string`.
   */
  function unicodeWords(string) {
    return string.match(reUnicodeWord) || [];
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Create a new pristine `lodash` function using the `context` object.
   *
   * @static
   * @memberOf _
   * @since 1.1.0
   * @category Util
   * @param {Object} [context=root] The context object.
   * @returns {Function} Returns a new `lodash` function.
   * @example
   *
   * _.mixin({ 'foo': _.constant('foo') });
   *
   * var lodash = _.runInContext();
   * lodash.mixin({ 'bar': lodash.constant('bar') });
   *
   * _.isFunction(_.foo);
   * // => true
   * _.isFunction(_.bar);
   * // => false
   *
   * lodash.isFunction(lodash.foo);
   * // => false
   * lodash.isFunction(lodash.bar);
   * // => true
   *
   * // Create a suped-up `defer` in Node.js.
   * var defer = _.runInContext({ 'setTimeout': setImmediate }).defer;
   */
  var runInContext = (function runInContext(context) {
    context = context == null ? root : _.defaults(root.Object(), context, _.pick(root, contextProps));

    /** Built-in constructor references. */
    var Array = context.Array,
        Date = context.Date,
        Error = context.Error,
        Function = context.Function,
        Math = context.Math,
        Object = context.Object,
        RegExp = context.RegExp,
        String = context.String,
        TypeError = context.TypeError;

    /** Used for built-in method references. */
    var arrayProto = Array.prototype,
        funcProto = Function.prototype,
        objectProto = Object.prototype;

    /** Used to detect overreaching core-js shims. */
    var coreJsData = context['__core-js_shared__'];

    /** Used to resolve the decompiled source of functions. */
    var funcToString = funcProto.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /** Used to generate unique IDs. */
    var idCounter = 0;

    /** Used to detect methods masquerading as native. */
    var maskSrcKey = (function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
      return uid ? ('Symbol(src)_1.' + uid) : '';
    }());

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString = objectProto.toString;

    /** Used to infer the `Object` constructor. */
    var objectCtorString = funcToString.call(Object);

    /** Used to restore the original `_` reference in `_.noConflict`. */
    var oldDash = root._;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /** Built-in value references. */
    var Buffer = moduleExports ? context.Buffer : undefined,
        Symbol = context.Symbol,
        Uint8Array = context.Uint8Array,
        allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined,
        getPrototype = overArg(Object.getPrototypeOf, Object),
        objectCreate = Object.create,
        propertyIsEnumerable = objectProto.propertyIsEnumerable,
        splice = arrayProto.splice,
        spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined,
        symIterator = Symbol ? Symbol.iterator : undefined,
        symToStringTag = Symbol ? Symbol.toStringTag : undefined;

    var defineProperty = (function() {
      try {
        var func = getNative(Object, 'defineProperty');
        func({}, '', {});
        return func;
      } catch (e) {}
    }());

    /** Mocked built-ins. */
    var ctxClearTimeout = context.clearTimeout !== root.clearTimeout && context.clearTimeout,
        ctxNow = Date && Date.now !== root.Date.now && Date.now,
        ctxSetTimeout = context.setTimeout !== root.setTimeout && context.setTimeout;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeCeil = Math.ceil,
        nativeFloor = Math.floor,
        nativeGetSymbols = Object.getOwnPropertySymbols,
        nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
        nativeIsFinite = context.isFinite,
        nativeJoin = arrayProto.join,
        nativeKeys = overArg(Object.keys, Object),
        nativeMax = Math.max,
        nativeMin = Math.min,
        nativeNow = Date.now,
        nativeParseInt = context.parseInt,
        nativeRandom = Math.random,
        nativeReverse = arrayProto.reverse;

    /* Built-in method references that are verified to be native. */
    var DataView = getNative(context, 'DataView'),
        Map = getNative(context, 'Map'),
        Promise = getNative(context, 'Promise'),
        Set = getNative(context, 'Set'),
        WeakMap = getNative(context, 'WeakMap'),
        nativeCreate = getNative(Object, 'create');

    /** Used to store function metadata. */
    var metaMap = WeakMap && new WeakMap;

    /** Used to lookup unminified function names. */
    var realNames = {};

    /** Used to detect maps, sets, and weakmaps. */
    var dataViewCtorString = toSource(DataView),
        mapCtorString = toSource(Map),
        promiseCtorString = toSource(Promise),
        setCtorString = toSource(Set),
        weakMapCtorString = toSource(WeakMap);

    /** Used to convert symbols to primitives and strings. */
    var symbolProto = Symbol ? Symbol.prototype : undefined,
        symbolValueOf = symbolProto ? symbolProto.valueOf : undefined,
        symbolToString = symbolProto ? symbolProto.toString : undefined;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object which wraps `value` to enable implicit method
     * chain sequences. Methods that operate on and return arrays, collections,
     * and functions can be chained together. Methods that retrieve a single value
     * or may return a primitive value will automatically end the chain sequence
     * and return the unwrapped value. Otherwise, the value must be unwrapped
     * with `_#value`.
     *
     * Explicit chain sequences, which must be unwrapped with `_#value`, may be
     * enabled using `_.chain`.
     *
     * The execution of chained methods is lazy, that is, it's deferred until
     * `_#value` is implicitly or explicitly called.
     *
     * Lazy evaluation allows several methods to support shortcut fusion.
     * Shortcut fusion is an optimization to merge iteratee calls; this avoids
     * the creation of intermediate arrays and can greatly reduce the number of
     * iteratee executions. Sections of a chain sequence qualify for shortcut
     * fusion if the section is applied to an array and iteratees accept only
     * one argument. The heuristic for whether a section qualifies for shortcut
     * fusion is subject to change.
     *
     * Chaining is supported in custom builds as long as the `_#value` method is
     * directly or indirectly included in the build.
     *
     * In addition to lodash methods, wrappers have `Array` and `String` methods.
     *
     * The wrapper `Array` methods are:
     * `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
     *
     * The wrapper `String` methods are:
     * `replace` and `split`
     *
     * The wrapper methods that support shortcut fusion are:
     * `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
     * `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
     * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`
     *
     * The chainable wrapper methods are:
     * `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`,
     * `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`,
     * `commit`, `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`,
     * `curry`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`,
     * `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`,
     * `dropRightWhile`, `dropWhile`, `extend`, `extendWith`, `fill`, `filter`,
     * `flatMap`, `flatMapDeep`, `flatMapDepth`, `flatten`, `flattenDeep`,
     * `flattenDepth`, `flip`, `flow`, `flowRight`, `fromPairs`, `functions`,
     * `functionsIn`, `groupBy`, `initial`, `intersection`, `intersectionBy`,
     * `intersectionWith`, `invert`, `invertBy`, `invokeMap`, `iteratee`, `keyBy`,
     * `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`, `matchesProperty`,
     * `memoize`, `merge`, `mergeWith`, `method`, `methodOf`, `mixin`, `negate`,
     * `nthArg`, `omit`, `omitBy`, `once`, `orderBy`, `over`, `overArgs`,
     * `overEvery`, `overSome`, `partial`, `partialRight`, `partition`, `pick`,
     * `pickBy`, `plant`, `property`, `propertyOf`, `pull`, `pullAll`, `pullAllBy`,
     * `pullAllWith`, `pullAt`, `push`, `range`, `rangeRight`, `rearg`, `reject`,
     * `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`, `shuffle`,
     * `slice`, `sort`, `sortBy`, `splice`, `spread`, `tail`, `take`, `takeRight`,
     * `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`, `toArray`,
     * `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`, `unary`,
     * `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`, `unset`,
     * `unshift`, `unzip`, `unzipWith`, `update`, `updateWith`, `values`,
     * `valuesIn`, `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`,
     * `zipObject`, `zipObjectDeep`, and `zipWith`
     *
     * The wrapper methods that are **not** chainable by default are:
     * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
     * `cloneDeep`, `cloneDeepWith`, `cloneWith`, `conformsTo`, `deburr`,
     * `defaultTo`, `divide`, `each`, `eachRight`, `endsWith`, `eq`, `escape`,
     * `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`, `findLast`,
     * `findLastIndex`, `findLastKey`, `first`, `floor`, `forEach`, `forEachRight`,
     * `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `get`, `gt`, `gte`, `has`,
     * `hasIn`, `head`, `identity`, `includes`, `indexOf`, `inRange`, `invoke`,
     * `isArguments`, `isArray`, `isArrayBuffer`, `isArrayLike`, `isArrayLikeObject`,
     * `isBoolean`, `isBuffer`, `isDate`, `isElement`, `isEmpty`, `isEqual`,
     * `isEqualWith`, `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`,
     * `isMap`, `isMatch`, `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`,
     * `isNumber`, `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`,
     * `isSafeInteger`, `isSet`, `isString`, `isUndefined`, `isTypedArray`,
     * `isWeakMap`, `isWeakSet`, `join`, `kebabCase`, `last`, `lastIndexOf`,
     * `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `meanBy`,
     * `min`, `minBy`, `multiply`, `noConflict`, `noop`, `now`, `nth`, `pad`,
     * `padEnd`, `padStart`, `parseInt`, `pop`, `random`, `reduce`, `reduceRight`,
     * `repeat`, `result`, `round`, `runInContext`, `sample`, `shift`, `size`,
     * `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedLastIndex`,
     * `sortedLastIndexBy`, `startCase`, `startsWith`, `stubArray`, `stubFalse`,
     * `stubObject`, `stubString`, `stubTrue`, `subtract`, `sum`, `sumBy`,
     * `template`, `times`, `toFinite`, `toInteger`, `toJSON`, `toLength`,
     * `toLower`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`,
     * `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`,
     * `upperFirst`, `value`, and `words`
     *
     * @name _
     * @constructor
     * @category Seq
     * @param {*} value The value to wrap in a `lodash` instance.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var wrapped = _([1, 2, 3]);
     *
     * // Returns an unwrapped value.
     * wrapped.reduce(_.add);
     * // => 6
     *
     * // Returns a wrapped value.
     * var squares = wrapped.map(square);
     *
     * _.isArray(squares);
     * // => false
     *
     * _.isArray(squares.value());
     * // => true
     */
    function lodash(value) {
      if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
        if (value instanceof LodashWrapper) {
          return value;
        }
        if (hasOwnProperty.call(value, '__wrapped__')) {
          return wrapperClone(value);
        }
      }
      return new LodashWrapper(value);
    }

    /**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} proto The object to inherit from.
     * @returns {Object} Returns the new object.
     */
    var baseCreate = (function() {
      function object() {}
      return function(proto) {
        if (!isObject(proto)) {
          return {};
        }
        if (objectCreate) {
          return objectCreate(proto);
        }
        object.prototype = proto;
        var result = new object;
        object.prototype = undefined;
        return result;
      };
    }());

    /**
     * The function whose prototype chain sequence wrappers inherit from.
     *
     * @private
     */
    function baseLodash() {
      // No operation performed.
    }

    /**
     * The base constructor for creating `lodash` wrapper objects.
     *
     * @private
     * @param {*} value The value to wrap.
     * @param {boolean} [chainAll] Enable explicit method chain sequences.
     */
    function LodashWrapper(value, chainAll) {
      this.__wrapped__ = value;
      this.__actions__ = [];
      this.__chain__ = !!chainAll;
      this.__index__ = 0;
      this.__values__ = undefined;
    }

    /**
     * By default, the template delimiters used by lodash are like those in
     * embedded Ruby (ERB) as well as ES2015 template strings. Change the
     * following template settings to use alternative delimiters.
     *
     * @static
     * @memberOf _
     * @type {Object}
     */
    lodash.templateSettings = {

      /**
       * Used to detect `data` property values to be HTML-escaped.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      'escape': reEscape,

      /**
       * Used to detect code to be evaluated.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      'evaluate': reEvaluate,

      /**
       * Used to detect `data` property values to inject.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      'interpolate': reInterpolate,

      /**
       * Used to reference the data object in the template text.
       *
       * @memberOf _.templateSettings
       * @type {string}
       */
      'variable': '',

      /**
       * Used to import variables into the compiled template.
       *
       * @memberOf _.templateSettings
       * @type {Object}
       */
      'imports': {

        /**
         * A reference to the `lodash` function.
         *
         * @memberOf _.templateSettings.imports
         * @type {Function}
         */
        '_': lodash
      }
    };

    // Ensure wrappers are instances of `baseLodash`.
    lodash.prototype = baseLodash.prototype;
    lodash.prototype.constructor = lodash;

    LodashWrapper.prototype = baseCreate(baseLodash.prototype);
    LodashWrapper.prototype.constructor = LodashWrapper;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
     *
     * @private
     * @constructor
     * @param {*} value The value to wrap.
     */
    function LazyWrapper(value) {
      this.__wrapped__ = value;
      this.__actions__ = [];
      this.__dir__ = 1;
      this.__filtered__ = false;
      this.__iteratees__ = [];
      this.__takeCount__ = MAX_ARRAY_LENGTH;
      this.__views__ = [];
    }

    /**
     * Creates a clone of the lazy wrapper object.
     *
     * @private
     * @name clone
     * @memberOf LazyWrapper
     * @returns {Object} Returns the cloned `LazyWrapper` object.
     */
    function lazyClone() {
      var result = new LazyWrapper(this.__wrapped__);
      result.__actions__ = copyArray(this.__actions__);
      result.__dir__ = this.__dir__;
      result.__filtered__ = this.__filtered__;
      result.__iteratees__ = copyArray(this.__iteratees__);
      result.__takeCount__ = this.__takeCount__;
      result.__views__ = copyArray(this.__views__);
      return result;
    }

    /**
     * Reverses the direction of lazy iteration.
     *
     * @private
     * @name reverse
     * @memberOf LazyWrapper
     * @returns {Object} Returns the new reversed `LazyWrapper` object.
     */
    function lazyReverse() {
      if (this.__filtered__) {
        var result = new LazyWrapper(this);
        result.__dir__ = -1;
        result.__filtered__ = true;
      } else {
        result = this.clone();
        result.__dir__ *= -1;
      }
      return result;
    }

    /**
     * Extracts the unwrapped value from its lazy wrapper.
     *
     * @private
     * @name value
     * @memberOf LazyWrapper
     * @returns {*} Returns the unwrapped value.
     */
    function lazyValue() {
      var array = this.__wrapped__.value(),
          dir = this.__dir__,
          isArr = isArray(array),
          isRight = dir < 0,
          arrLength = isArr ? array.length : 0,
          view = getView(0, arrLength, this.__views__),
          start = view.start,
          end = view.end,
          length = end - start,
          index = isRight ? end : (start - 1),
          iteratees = this.__iteratees__,
          iterLength = iteratees.length,
          resIndex = 0,
          takeCount = nativeMin(length, this.__takeCount__);

      if (!isArr || (!isRight && arrLength == length && takeCount == length)) {
        return baseWrapperValue(array, this.__actions__);
      }
      var result = [];

      outer:
      while (length-- && resIndex < takeCount) {
        index += dir;

        var iterIndex = -1,
            value = array[index];

        while (++iterIndex < iterLength) {
          var data = iteratees[iterIndex],
              iteratee = data.iteratee,
              type = data.type,
              computed = iteratee(value);

          if (type == LAZY_MAP_FLAG) {
            value = computed;
          } else if (!computed) {
            if (type == LAZY_FILTER_FLAG) {
              continue outer;
            } else {
              break outer;
            }
          }
        }
        result[resIndex++] = value;
      }
      return result;
    }

    // Ensure `LazyWrapper` is an instance of `baseLodash`.
    LazyWrapper.prototype = baseCreate(baseLodash.prototype);
    LazyWrapper.prototype.constructor = LazyWrapper;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a hash object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Hash(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the hash.
     *
     * @private
     * @name clear
     * @memberOf Hash
     */
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the hash.
     *
     * @private
     * @name delete
     * @memberOf Hash
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function hashDelete(key) {
      var result = this.has(key) && delete this.__data__[key];
      this.size -= result ? 1 : 0;
      return result;
    }

    /**
     * Gets the hash value for `key`.
     *
     * @private
     * @name get
     * @memberOf Hash
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? undefined : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : undefined;
    }

    /**
     * Checks if a hash value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Hash
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
    }

    /**
     * Sets the hash `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Hash
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the hash instance.
     */
    function hashSet(key, value) {
      var data = this.__data__;
      this.size += this.has(key) ? 0 : 1;
      data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
      return this;
    }

    // Add methods to `Hash`.
    Hash.prototype.clear = hashClear;
    Hash.prototype['delete'] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;

    /*------------------------------------------------------------------------*/

    /**
     * Creates an list cache object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function ListCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the list cache.
     *
     * @private
     * @name clear
     * @memberOf ListCache
     */
    function listCacheClear() {
      this.__data__ = [];
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the list cache.
     *
     * @private
     * @name delete
     * @memberOf ListCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function listCacheDelete(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      --this.size;
      return true;
    }

    /**
     * Gets the list cache value for `key`.
     *
     * @private
     * @name get
     * @memberOf ListCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function listCacheGet(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      return index < 0 ? undefined : data[index][1];
    }

    /**
     * Checks if a list cache value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf ListCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }

    /**
     * Sets the list cache `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf ListCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the list cache instance.
     */
    function listCacheSet(key, value) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        ++this.size;
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }

    // Add methods to `ListCache`.
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype['delete'] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a map cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function MapCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the map.
     *
     * @private
     * @name clear
     * @memberOf MapCache
     */
    function mapCacheClear() {
      this.size = 0;
      this.__data__ = {
        'hash': new Hash,
        'map': new (Map || ListCache),
        'string': new Hash
      };
    }

    /**
     * Removes `key` and its value from the map.
     *
     * @private
     * @name delete
     * @memberOf MapCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function mapCacheDelete(key) {
      var result = getMapData(this, key)['delete'](key);
      this.size -= result ? 1 : 0;
      return result;
    }

    /**
     * Gets the map value for `key`.
     *
     * @private
     * @name get
     * @memberOf MapCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }

    /**
     * Checks if a map value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf MapCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }

    /**
     * Sets the map `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf MapCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the map cache instance.
     */
    function mapCacheSet(key, value) {
      var data = getMapData(this, key),
          size = data.size;

      data.set(key, value);
      this.size += data.size == size ? 0 : 1;
      return this;
    }

    // Add methods to `MapCache`.
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype['delete'] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;

    /*------------------------------------------------------------------------*/

    /**
     *
     * Creates an array cache object to store unique values.
     *
     * @private
     * @constructor
     * @param {Array} [values] The values to cache.
     */
    function SetCache(values) {
      var index = -1,
          length = values == null ? 0 : values.length;

      this.__data__ = new MapCache;
      while (++index < length) {
        this.add(values[index]);
      }
    }

    /**
     * Adds `value` to the array cache.
     *
     * @private
     * @name add
     * @memberOf SetCache
     * @alias push
     * @param {*} value The value to cache.
     * @returns {Object} Returns the cache instance.
     */
    function setCacheAdd(value) {
      this.__data__.set(value, HASH_UNDEFINED);
      return this;
    }

    /**
     * Checks if `value` is in the array cache.
     *
     * @private
     * @name has
     * @memberOf SetCache
     * @param {*} value The value to search for.
     * @returns {number} Returns `true` if `value` is found, else `false`.
     */
    function setCacheHas(value) {
      return this.__data__.has(value);
    }

    // Add methods to `SetCache`.
    SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
    SetCache.prototype.has = setCacheHas;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a stack cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Stack(entries) {
      var data = this.__data__ = new ListCache(entries);
      this.size = data.size;
    }

    /**
     * Removes all key-value entries from the stack.
     *
     * @private
     * @name clear
     * @memberOf Stack
     */
    function stackClear() {
      this.__data__ = new ListCache;
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the stack.
     *
     * @private
     * @name delete
     * @memberOf Stack
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function stackDelete(key) {
      var data = this.__data__,
          result = data['delete'](key);

      this.size = data.size;
      return result;
    }

    /**
     * Gets the stack value for `key`.
     *
     * @private
     * @name get
     * @memberOf Stack
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function stackGet(key) {
      return this.__data__.get(key);
    }

    /**
     * Checks if a stack value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Stack
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function stackHas(key) {
      return this.__data__.has(key);
    }

    /**
     * Sets the stack `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Stack
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the stack cache instance.
     */
    function stackSet(key, value) {
      var data = this.__data__;
      if (data instanceof ListCache) {
        var pairs = data.__data__;
        if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
          pairs.push([key, value]);
          this.size = ++data.size;
          return this;
        }
        data = this.__data__ = new MapCache(pairs);
      }
      data.set(key, value);
      this.size = data.size;
      return this;
    }

    // Add methods to `Stack`.
    Stack.prototype.clear = stackClear;
    Stack.prototype['delete'] = stackDelete;
    Stack.prototype.get = stackGet;
    Stack.prototype.has = stackHas;
    Stack.prototype.set = stackSet;

    /*------------------------------------------------------------------------*/

    /**
     * Creates an array of the enumerable property names of the array-like `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @param {boolean} inherited Specify returning inherited property names.
     * @returns {Array} Returns the array of property names.
     */
    function arrayLikeKeys(value, inherited) {
      var isArr = isArray(value),
          isArg = !isArr && isArguments(value),
          isBuff = !isArr && !isArg && isBuffer(value),
          isType = !isArr && !isArg && !isBuff && isTypedArray(value),
          skipIndexes = isArr || isArg || isBuff || isType,
          result = skipIndexes ? baseTimes(value.length, String) : [],
          length = result.length;

      for (var key in value) {
        if ((inherited || hasOwnProperty.call(value, key)) &&
            !(skipIndexes && (
               // Safari 9 has enumerable `arguments.length` in strict mode.
               key == 'length' ||
               // Node.js 0.10 has enumerable non-index properties on buffers.
               (isBuff && (key == 'offset' || key == 'parent')) ||
               // PhantomJS 2 has enumerable non-index properties on typed arrays.
               (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
               // Skip index properties.
               isIndex(key, length)
            ))) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * A specialized version of `_.sample` for arrays.
     *
     * @private
     * @param {Array} array The array to sample.
     * @returns {*} Returns the random element.
     */
    function arraySample(array) {
      var length = array.length;
      return length ? array[baseRandom(0, length - 1)] : undefined;
    }

    /**
     * A specialized version of `_.sampleSize` for arrays.
     *
     * @private
     * @param {Array} array The array to sample.
     * @param {number} n The number of elements to sample.
     * @returns {Array} Returns the random elements.
     */
    function arraySampleSize(array, n) {
      return shuffleSelf(copyArray(array), baseClamp(n, 0, array.length));
    }

    /**
     * A specialized version of `_.shuffle` for arrays.
     *
     * @private
     * @param {Array} array The array to shuffle.
     * @returns {Array} Returns the new shuffled array.
     */
    function arrayShuffle(array) {
      return shuffleSelf(copyArray(array));
    }

    /**
     * This function is like `assignValue` except that it doesn't assign
     * `undefined` values.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function assignMergeValue(object, key, value) {
      if ((value !== undefined && !eq(object[key], value)) ||
          (value === undefined && !(key in object))) {
        baseAssignValue(object, key, value);
      }
    }

    /**
     * Assigns `value` to `key` of `object` if the existing value is not equivalent
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function assignValue(object, key, value) {
      var objValue = object[key];
      if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
          (value === undefined && !(key in object))) {
        baseAssignValue(object, key, value);
      }
    }

    /**
     * Gets the index at which the `key` is found in `array` of key-value pairs.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} key The key to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }

    /**
     * Aggregates elements of `collection` on `accumulator` with keys transformed
     * by `iteratee` and values set by `setter`.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} setter The function to set `accumulator` values.
     * @param {Function} iteratee The iteratee to transform keys.
     * @param {Object} accumulator The initial aggregated object.
     * @returns {Function} Returns `accumulator`.
     */
    function baseAggregator(collection, setter, iteratee, accumulator) {
      baseEach(collection, function(value, key, collection) {
        setter(accumulator, value, iteratee(value), collection);
      });
      return accumulator;
    }

    /**
     * The base implementation of `_.assign` without support for multiple sources
     * or `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */
    function baseAssign(object, source) {
      return object && copyObject(source, keys(source), object);
    }

    /**
     * The base implementation of `_.assignIn` without support for multiple sources
     * or `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */
    function baseAssignIn(object, source) {
      return object && copyObject(source, keysIn(source), object);
    }

    /**
     * The base implementation of `assignValue` and `assignMergeValue` without
     * value checks.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function baseAssignValue(object, key, value) {
      if (key == '__proto__' && defineProperty) {
        defineProperty(object, key, {
          'configurable': true,
          'enumerable': true,
          'value': value,
          'writable': true
        });
      } else {
        object[key] = value;
      }
    }

    /**
     * The base implementation of `_.at` without support for individual paths.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {string[]} paths The property paths to pick.
     * @returns {Array} Returns the picked elements.
     */
    function baseAt(object, paths) {
      var index = -1,
          length = paths.length,
          result = Array(length),
          skip = object == null;

      while (++index < length) {
        result[index] = skip ? undefined : get(object, paths[index]);
      }
      return result;
    }

    /**
     * The base implementation of `_.clamp` which doesn't coerce arguments.
     *
     * @private
     * @param {number} number The number to clamp.
     * @param {number} [lower] The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the clamped number.
     */
    function baseClamp(number, lower, upper) {
      if (number === number) {
        if (upper !== undefined) {
          number = number <= upper ? number : upper;
        }
        if (lower !== undefined) {
          number = number >= lower ? number : lower;
        }
      }
      return number;
    }

    /**
     * The base implementation of `_.clone` and `_.cloneDeep` which tracks
     * traversed objects.
     *
     * @private
     * @param {*} value The value to clone.
     * @param {boolean} bitmask The bitmask flags.
     *  1 - Deep clone
     *  2 - Flatten inherited properties
     *  4 - Clone symbols
     * @param {Function} [customizer] The function to customize cloning.
     * @param {string} [key] The key of `value`.
     * @param {Object} [object] The parent object of `value`.
     * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
     * @returns {*} Returns the cloned value.
     */
    function baseClone(value, bitmask, customizer, key, object, stack) {
      var result,
          isDeep = bitmask & CLONE_DEEP_FLAG,
          isFlat = bitmask & CLONE_FLAT_FLAG,
          isFull = bitmask & CLONE_SYMBOLS_FLAG;

      if (customizer) {
        result = object ? customizer(value, key, object, stack) : customizer(value);
      }
      if (result !== undefined) {
        return result;
      }
      if (!isObject(value)) {
        return value;
      }
      var isArr = isArray(value);
      if (isArr) {
        result = initCloneArray(value);
        if (!isDeep) {
          return copyArray(value, result);
        }
      } else {
        var tag = getTag(value),
            isFunc = tag == funcTag || tag == genTag;

        if (isBuffer(value)) {
          return cloneBuffer(value, isDeep);
        }
        if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
          result = (isFlat || isFunc) ? {} : initCloneObject(value);
          if (!isDeep) {
            return isFlat
              ? copySymbolsIn(value, baseAssignIn(result, value))
              : copySymbols(value, baseAssign(result, value));
          }
        } else {
          if (!cloneableTags[tag]) {
            return object ? value : {};
          }
          result = initCloneByTag(value, tag, isDeep);
        }
      }
      // Check for circular references and return its corresponding clone.
      stack || (stack = new Stack);
      var stacked = stack.get(value);
      if (stacked) {
        return stacked;
      }
      stack.set(value, result);

      if (isSet(value)) {
        value.forEach(function(subValue) {
          result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
        });
      } else if (isMap(value)) {
        value.forEach(function(subValue, key) {
          result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
        });
      }

      var keysFunc = isFull
        ? (isFlat ? getAllKeysIn : getAllKeys)
        : (isFlat ? keysIn : keys);

      var props = isArr ? undefined : keysFunc(value);
      arrayEach(props || value, function(subValue, key) {
        if (props) {
          key = subValue;
          subValue = value[key];
        }
        // Recursively populate clone (susceptible to call stack limits).
        assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
      });
      return result;
    }

    /**
     * The base implementation of `_.conforms` which doesn't clone `source`.
     *
     * @private
     * @param {Object} source The object of property predicates to conform to.
     * @returns {Function} Returns the new spec function.
     */
    function baseConforms(source) {
      var props = keys(source);
      return function(object) {
        return baseConformsTo(object, source, props);
      };
    }

    /**
     * The base implementation of `_.conformsTo` which accepts `props` to check.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property predicates to conform to.
     * @returns {boolean} Returns `true` if `object` conforms, else `false`.
     */
    function baseConformsTo(object, source, props) {
      var length = props.length;
      if (object == null) {
        return !length;
      }
      object = Object(object);
      while (length--) {
        var key = props[length],
            predicate = source[key],
            value = object[key];

        if ((value === undefined && !(key in object)) || !predicate(value)) {
          return false;
        }
      }
      return true;
    }

    /**
     * The base implementation of `_.delay` and `_.defer` which accepts `args`
     * to provide to `func`.
     *
     * @private
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {Array} args The arguments to provide to `func`.
     * @returns {number|Object} Returns the timer id or timeout object.
     */
    function baseDelay(func, wait, args) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return setTimeout(function() { func.apply(undefined, args); }, wait);
    }

    /**
     * The base implementation of methods like `_.difference` without support
     * for excluding multiple arrays or iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Array} values The values to exclude.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     */
    function baseDifference(array, values, iteratee, comparator) {
      var index = -1,
          includes = arrayIncludes,
          isCommon = true,
          length = array.length,
          result = [],
          valuesLength = values.length;

      if (!length) {
        return result;
      }
      if (iteratee) {
        values = arrayMap(values, baseUnary(iteratee));
      }
      if (comparator) {
        includes = arrayIncludesWith;
        isCommon = false;
      }
      else if (values.length >= LARGE_ARRAY_SIZE) {
        includes = cacheHas;
        isCommon = false;
        values = new SetCache(values);
      }
      outer:
      while (++index < length) {
        var value = array[index],
            computed = iteratee == null ? value : iteratee(value);

        value = (comparator || value !== 0) ? value : 0;
        if (isCommon && computed === computed) {
          var valuesIndex = valuesLength;
          while (valuesIndex--) {
            if (values[valuesIndex] === computed) {
              continue outer;
            }
          }
          result.push(value);
        }
        else if (!includes(values, computed, comparator)) {
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.forEach` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     */
    var baseEach = createBaseEach(baseForOwn);

    /**
     * The base implementation of `_.forEachRight` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     */
    var baseEachRight = createBaseEach(baseForOwnRight, true);

    /**
     * The base implementation of `_.every` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`
     */
    function baseEvery(collection, predicate) {
      var result = true;
      baseEach(collection, function(value, index, collection) {
        result = !!predicate(value, index, collection);
        return result;
      });
      return result;
    }

    /**
     * The base implementation of methods like `_.max` and `_.min` which accepts a
     * `comparator` to determine the extremum value.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The iteratee invoked per iteration.
     * @param {Function} comparator The comparator used to compare values.
     * @returns {*} Returns the extremum value.
     */
    function baseExtremum(array, iteratee, comparator) {
      var index = -1,
          length = array.length;

      while (++index < length) {
        var value = array[index],
            current = iteratee(value);

        if (current != null && (computed === undefined
              ? (current === current && !isSymbol(current))
              : comparator(current, computed)
            )) {
          var computed = current,
              result = value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.fill` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     */
    function baseFill(array, value, start, end) {
      var length = array.length;

      start = toInteger(start);
      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = (end === undefined || end > length) ? length : toInteger(end);
      if (end < 0) {
        end += length;
      }
      end = start > end ? 0 : toLength(end);
      while (start < end) {
        array[start++] = value;
      }
      return array;
    }

    /**
     * The base implementation of `_.filter` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */
    function baseFilter(collection, predicate) {
      var result = [];
      baseEach(collection, function(value, index, collection) {
        if (predicate(value, index, collection)) {
          result.push(value);
        }
      });
      return result;
    }

    /**
     * The base implementation of `_.flatten` with support for restricting flattening.
     *
     * @private
     * @param {Array} array The array to flatten.
     * @param {number} depth The maximum recursion depth.
     * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
     * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
     * @param {Array} [result=[]] The initial result value.
     * @returns {Array} Returns the new flattened array.
     */
    function baseFlatten(array, depth, predicate, isStrict, result) {
      var index = -1,
          length = array.length;

      predicate || (predicate = isFlattenable);
      result || (result = []);

      while (++index < length) {
        var value = array[index];
        if (depth > 0 && predicate(value)) {
          if (depth > 1) {
            // Recursively flatten arrays (susceptible to call stack limits).
            baseFlatten(value, depth - 1, predicate, isStrict, result);
          } else {
            arrayPush(result, value);
          }
        } else if (!isStrict) {
          result[result.length] = value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `baseForOwn` which iterates over `object`
     * properties returned by `keysFunc` and invokes `iteratee` for each property.
     * Iteratee functions may exit iteration early by explicitly returning `false`.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseFor = createBaseFor();

    /**
     * This function is like `baseFor` except that it iterates over properties
     * in the opposite order.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseForRight = createBaseFor(true);

    /**
     * The base implementation of `_.forOwn` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwn(object, iteratee) {
      return object && baseFor(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.forOwnRight` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwnRight(object, iteratee) {
      return object && baseForRight(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.functions` which creates an array of
     * `object` function property names filtered from `props`.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Array} props The property names to filter.
     * @returns {Array} Returns the function names.
     */
    function baseFunctions(object, props) {
      return arrayFilter(props, function(key) {
        return isFunction(object[key]);
      });
    }

    /**
     * The base implementation of `_.get` without support for default values.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @returns {*} Returns the resolved value.
     */
    function baseGet(object, path) {
      path = castPath(path, object);

      var index = 0,
          length = path.length;

      while (object != null && index < length) {
        object = object[toKey(path[index++])];
      }
      return (index && index == length) ? object : undefined;
    }

    /**
     * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
     * `keysFunc` and `symbolsFunc` to get the enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @param {Function} symbolsFunc The function to get the symbols of `object`.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function baseGetAllKeys(object, keysFunc, symbolsFunc) {
      var result = keysFunc(object);
      return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
    }

    /**
     * The base implementation of `getTag` without fallbacks for buggy environments.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    function baseGetTag(value) {
      if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
      }
      return (symToStringTag && symToStringTag in Object(value))
        ? getRawTag(value)
        : objectToString(value);
    }

    /**
     * The base implementation of `_.gt` which doesn't coerce arguments.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than `other`,
     *  else `false`.
     */
    function baseGt(value, other) {
      return value > other;
    }

    /**
     * The base implementation of `_.has` without support for deep paths.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {Array|string} key The key to check.
     * @returns {boolean} Returns `true` if `key` exists, else `false`.
     */
    function baseHas(object, key) {
      return object != null && hasOwnProperty.call(object, key);
    }

    /**
     * The base implementation of `_.hasIn` without support for deep paths.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {Array|string} key The key to check.
     * @returns {boolean} Returns `true` if `key` exists, else `false`.
     */
    function baseHasIn(object, key) {
      return object != null && key in Object(object);
    }

    /**
     * The base implementation of `_.inRange` which doesn't coerce arguments.
     *
     * @private
     * @param {number} number The number to check.
     * @param {number} start The start of the range.
     * @param {number} end The end of the range.
     * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
     */
    function baseInRange(number, start, end) {
      return number >= nativeMin(start, end) && number < nativeMax(start, end);
    }

    /**
     * The base implementation of methods like `_.intersection`, without support
     * for iteratee shorthands, that accepts an array of arrays to inspect.
     *
     * @private
     * @param {Array} arrays The arrays to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of shared values.
     */
    function baseIntersection(arrays, iteratee, comparator) {
      var includes = comparator ? arrayIncludesWith : arrayIncludes,
          length = arrays[0].length,
          othLength = arrays.length,
          othIndex = othLength,
          caches = Array(othLength),
          maxLength = Infinity,
          result = [];

      while (othIndex--) {
        var array = arrays[othIndex];
        if (othIndex && iteratee) {
          array = arrayMap(array, baseUnary(iteratee));
        }
        maxLength = nativeMin(array.length, maxLength);
        caches[othIndex] = !comparator && (iteratee || (length >= 120 && array.length >= 120))
          ? new SetCache(othIndex && array)
          : undefined;
      }
      array = arrays[0];

      var index = -1,
          seen = caches[0];

      outer:
      while (++index < length && result.length < maxLength) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        value = (comparator || value !== 0) ? value : 0;
        if (!(seen
              ? cacheHas(seen, computed)
              : includes(result, computed, comparator)
            )) {
          othIndex = othLength;
          while (--othIndex) {
            var cache = caches[othIndex];
            if (!(cache
                  ? cacheHas(cache, computed)
                  : includes(arrays[othIndex], computed, comparator))
                ) {
              continue outer;
            }
          }
          if (seen) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.invert` and `_.invertBy` which inverts
     * `object` with values transformed by `iteratee` and set by `setter`.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} setter The function to set `accumulator` values.
     * @param {Function} iteratee The iteratee to transform values.
     * @param {Object} accumulator The initial inverted object.
     * @returns {Function} Returns `accumulator`.
     */
    function baseInverter(object, setter, iteratee, accumulator) {
      baseForOwn(object, function(value, key, object) {
        setter(accumulator, iteratee(value), key, object);
      });
      return accumulator;
    }

    /**
     * The base implementation of `_.invoke` without support for individual
     * method arguments.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the method to invoke.
     * @param {Array} args The arguments to invoke the method with.
     * @returns {*} Returns the result of the invoked method.
     */
    function baseInvoke(object, path, args) {
      path = castPath(path, object);
      object = parent(object, path);
      var func = object == null ? object : object[toKey(last(path))];
      return func == null ? undefined : apply(func, object, args);
    }

    /**
     * The base implementation of `_.isArguments`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     */
    function baseIsArguments(value) {
      return isObjectLike(value) && baseGetTag(value) == argsTag;
    }

    /**
     * The base implementation of `_.isArrayBuffer` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
     */
    function baseIsArrayBuffer(value) {
      return isObjectLike(value) && baseGetTag(value) == arrayBufferTag;
    }

    /**
     * The base implementation of `_.isDate` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
     */
    function baseIsDate(value) {
      return isObjectLike(value) && baseGetTag(value) == dateTag;
    }

    /**
     * The base implementation of `_.isEqual` which supports partial comparisons
     * and tracks traversed objects.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {boolean} bitmask The bitmask flags.
     *  1 - Unordered comparison
     *  2 - Partial comparison
     * @param {Function} [customizer] The function to customize comparisons.
     * @param {Object} [stack] Tracks traversed `value` and `other` objects.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     */
    function baseIsEqual(value, other, bitmask, customizer, stack) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
        return value !== value && other !== other;
      }
      return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
    }

    /**
     * A specialized version of `baseIsEqual` for arrays and objects which performs
     * deep comparisons and tracks traversed objects enabling objects with circular
     * references to be compared.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} [stack] Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
      var objIsArr = isArray(object),
          othIsArr = isArray(other),
          objTag = objIsArr ? arrayTag : getTag(object),
          othTag = othIsArr ? arrayTag : getTag(other);

      objTag = objTag == argsTag ? objectTag : objTag;
      othTag = othTag == argsTag ? objectTag : othTag;

      var objIsObj = objTag == objectTag,
          othIsObj = othTag == objectTag,
          isSameTag = objTag == othTag;

      if (isSameTag && isBuffer(object)) {
        if (!isBuffer(other)) {
          return false;
        }
        objIsArr = true;
        objIsObj = false;
      }
      if (isSameTag && !objIsObj) {
        stack || (stack = new Stack);
        return (objIsArr || isTypedArray(object))
          ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
          : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
      }
      if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
        var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
            othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

        if (objIsWrapped || othIsWrapped) {
          var objUnwrapped = objIsWrapped ? object.value() : object,
              othUnwrapped = othIsWrapped ? other.value() : other;

          stack || (stack = new Stack);
          return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
        }
      }
      if (!isSameTag) {
        return false;
      }
      stack || (stack = new Stack);
      return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
    }

    /**
     * The base implementation of `_.isMap` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a map, else `false`.
     */
    function baseIsMap(value) {
      return isObjectLike(value) && getTag(value) == mapTag;
    }

    /**
     * The base implementation of `_.isMatch` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @param {Array} matchData The property names, values, and compare flags to match.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     */
    function baseIsMatch(object, source, matchData, customizer) {
      var index = matchData.length,
          length = index,
          noCustomizer = !customizer;

      if (object == null) {
        return !length;
      }
      object = Object(object);
      while (index--) {
        var data = matchData[index];
        if ((noCustomizer && data[2])
              ? data[1] !== object[data[0]]
              : !(data[0] in object)
            ) {
          return false;
        }
      }
      while (++index < length) {
        data = matchData[index];
        var key = data[0],
            objValue = object[key],
            srcValue = data[1];

        if (noCustomizer && data[2]) {
          if (objValue === undefined && !(key in object)) {
            return false;
          }
        } else {
          var stack = new Stack;
          if (customizer) {
            var result = customizer(objValue, srcValue, key, object, source, stack);
          }
          if (!(result === undefined
                ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)
                : result
              )) {
            return false;
          }
        }
      }
      return true;
    }

    /**
     * The base implementation of `_.isNative` without bad shim checks.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     */
    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }

    /**
     * The base implementation of `_.isRegExp` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
     */
    function baseIsRegExp(value) {
      return isObjectLike(value) && baseGetTag(value) == regexpTag;
    }

    /**
     * The base implementation of `_.isSet` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a set, else `false`.
     */
    function baseIsSet(value) {
      return isObjectLike(value) && getTag(value) == setTag;
    }

    /**
     * The base implementation of `_.isTypedArray` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     */
    function baseIsTypedArray(value) {
      return isObjectLike(value) &&
        isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
    }

    /**
     * The base implementation of `_.iteratee`.
     *
     * @private
     * @param {*} [value=_.identity] The value to convert to an iteratee.
     * @returns {Function} Returns the iteratee.
     */
    function baseIteratee(value) {
      // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
      // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
      if (typeof value == 'function') {
        return value;
      }
      if (value == null) {
        return identity;
      }
      if (typeof value == 'object') {
        return isArray(value)
          ? baseMatchesProperty(value[0], value[1])
          : baseMatches(value);
      }
      return property(value);
    }

    /**
     * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeys(object) {
      if (!isPrototype(object)) {
        return nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty.call(object, key) && key != 'constructor') {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeysIn(object) {
      if (!isObject(object)) {
        return nativeKeysIn(object);
      }
      var isProto = isPrototype(object),
          result = [];

      for (var key in object) {
        if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.lt` which doesn't coerce arguments.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than `other`,
     *  else `false`.
     */
    function baseLt(value, other) {
      return value < other;
    }

    /**
     * The base implementation of `_.map` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */
    function baseMap(collection, iteratee) {
      var index = -1,
          result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function(value, key, collection) {
        result[++index] = iteratee(value, key, collection);
      });
      return result;
    }

    /**
     * The base implementation of `_.matches` which doesn't clone `source`.
     *
     * @private
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new spec function.
     */
    function baseMatches(source) {
      var matchData = getMatchData(source);
      if (matchData.length == 1 && matchData[0][2]) {
        return matchesStrictComparable(matchData[0][0], matchData[0][1]);
      }
      return function(object) {
        return object === source || baseIsMatch(object, source, matchData);
      };
    }

    /**
     * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
     *
     * @private
     * @param {string} path The path of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new spec function.
     */
    function baseMatchesProperty(path, srcValue) {
      if (isKey(path) && isStrictComparable(srcValue)) {
        return matchesStrictComparable(toKey(path), srcValue);
      }
      return function(object) {
        var objValue = get(object, path);
        return (objValue === undefined && objValue === srcValue)
          ? hasIn(object, path)
          : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
      };
    }

    /**
     * The base implementation of `_.merge` without support for multiple sources.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {number} srcIndex The index of `source`.
     * @param {Function} [customizer] The function to customize merged values.
     * @param {Object} [stack] Tracks traversed source values and their merged
     *  counterparts.
     */
    function baseMerge(object, source, srcIndex, customizer, stack) {
      if (object === source) {
        return;
      }
      baseFor(source, function(srcValue, key) {
        stack || (stack = new Stack);
        if (isObject(srcValue)) {
          baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
        }
        else {
          var newValue = customizer
            ? customizer(safeGet(object, key), srcValue, (key + ''), object, source, stack)
            : undefined;

          if (newValue === undefined) {
            newValue = srcValue;
          }
          assignMergeValue(object, key, newValue);
        }
      }, keysIn);
    }

    /**
     * A specialized version of `baseMerge` for arrays and objects which performs
     * deep merges and tracks traversed objects enabling objects with circular
     * references to be merged.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {string} key The key of the value to merge.
     * @param {number} srcIndex The index of `source`.
     * @param {Function} mergeFunc The function to merge values.
     * @param {Function} [customizer] The function to customize assigned values.
     * @param {Object} [stack] Tracks traversed source values and their merged
     *  counterparts.
     */
    function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
      var objValue = safeGet(object, key),
          srcValue = safeGet(source, key),
          stacked = stack.get(srcValue);

      if (stacked) {
        assignMergeValue(object, key, stacked);
        return;
      }
      var newValue = customizer
        ? customizer(objValue, srcValue, (key + ''), object, source, stack)
        : undefined;

      var isCommon = newValue === undefined;

      if (isCommon) {
        var isArr = isArray(srcValue),
            isBuff = !isArr && isBuffer(srcValue),
            isTyped = !isArr && !isBuff && isTypedArray(srcValue);

        newValue = srcValue;
        if (isArr || isBuff || isTyped) {
          if (isArray(objValue)) {
            newValue = objValue;
          }
          else if (isArrayLikeObject(objValue)) {
            newValue = copyArray(objValue);
          }
          else if (isBuff) {
            isCommon = false;
            newValue = cloneBuffer(srcValue, true);
          }
          else if (isTyped) {
            isCommon = false;
            newValue = cloneTypedArray(srcValue, true);
          }
          else {
            newValue = [];
          }
        }
        else if (isPlainObject(srcValue) || isArguments(srcValue)) {
          newValue = objValue;
          if (isArguments(objValue)) {
            newValue = toPlainObject(objValue);
          }
          else if (!isObject(objValue) || isFunction(objValue)) {
            newValue = initCloneObject(srcValue);
          }
        }
        else {
          isCommon = false;
        }
      }
      if (isCommon) {
        // Recursively merge objects and arrays (susceptible to call stack limits).
        stack.set(srcValue, newValue);
        mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
        stack['delete'](srcValue);
      }
      assignMergeValue(object, key, newValue);
    }

    /**
     * The base implementation of `_.nth` which doesn't coerce arguments.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {number} n The index of the element to return.
     * @returns {*} Returns the nth element of `array`.
     */
    function baseNth(array, n) {
      var length = array.length;
      if (!length) {
        return;
      }
      n += n < 0 ? length : 0;
      return isIndex(n, length) ? array[n] : undefined;
    }

    /**
     * The base implementation of `_.orderBy` without param guards.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
     * @param {string[]} orders The sort orders of `iteratees`.
     * @returns {Array} Returns the new sorted array.
     */
    function baseOrderBy(collection, iteratees, orders) {
      var index = -1;
      iteratees = arrayMap(iteratees.length ? iteratees : [identity], baseUnary(getIteratee()));

      var result = baseMap(collection, function(value, key, collection) {
        var criteria = arrayMap(iteratees, function(iteratee) {
          return iteratee(value);
        });
        return { 'criteria': criteria, 'index': ++index, 'value': value };
      });

      return baseSortBy(result, function(object, other) {
        return compareMultiple(object, other, orders);
      });
    }

    /**
     * The base implementation of `_.pick` without support for individual
     * property identifiers.
     *
     * @private
     * @param {Object} object The source object.
     * @param {string[]} paths The property paths to pick.
     * @returns {Object} Returns the new object.
     */
    function basePick(object, paths) {
      return basePickBy(object, paths, function(value, path) {
        return hasIn(object, path);
      });
    }

    /**
     * The base implementation of  `_.pickBy` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The source object.
     * @param {string[]} paths The property paths to pick.
     * @param {Function} predicate The function invoked per property.
     * @returns {Object} Returns the new object.
     */
    function basePickBy(object, paths, predicate) {
      var index = -1,
          length = paths.length,
          result = {};

      while (++index < length) {
        var path = paths[index],
            value = baseGet(object, path);

        if (predicate(value, path)) {
          baseSet(result, castPath(path, object), value);
        }
      }
      return result;
    }

    /**
     * A specialized version of `baseProperty` which supports deep paths.
     *
     * @private
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new accessor function.
     */
    function basePropertyDeep(path) {
      return function(object) {
        return baseGet(object, path);
      };
    }

    /**
     * The base implementation of `_.pullAllBy` without support for iteratee
     * shorthands.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns `array`.
     */
    function basePullAll(array, values, iteratee, comparator) {
      var indexOf = comparator ? baseIndexOfWith : baseIndexOf,
          index = -1,
          length = values.length,
          seen = array;

      if (array === values) {
        values = copyArray(values);
      }
      if (iteratee) {
        seen = arrayMap(array, baseUnary(iteratee));
      }
      while (++index < length) {
        var fromIndex = 0,
            value = values[index],
            computed = iteratee ? iteratee(value) : value;

        while ((fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1) {
          if (seen !== array) {
            splice.call(seen, fromIndex, 1);
          }
          splice.call(array, fromIndex, 1);
        }
      }
      return array;
    }

    /**
     * The base implementation of `_.pullAt` without support for individual
     * indexes or capturing the removed elements.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {number[]} indexes The indexes of elements to remove.
     * @returns {Array} Returns `array`.
     */
    function basePullAt(array, indexes) {
      var length = array ? indexes.length : 0,
          lastIndex = length - 1;

      while (length--) {
        var index = indexes[length];
        if (length == lastIndex || index !== previous) {
          var previous = index;
          if (isIndex(index)) {
            splice.call(array, index, 1);
          } else {
            baseUnset(array, index);
          }
        }
      }
      return array;
    }

    /**
     * The base implementation of `_.random` without support for returning
     * floating-point numbers.
     *
     * @private
     * @param {number} lower The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the random number.
     */
    function baseRandom(lower, upper) {
      return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
    }

    /**
     * The base implementation of `_.range` and `_.rangeRight` which doesn't
     * coerce arguments.
     *
     * @private
     * @param {number} start The start of the range.
     * @param {number} end The end of the range.
     * @param {number} step The value to increment or decrement by.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Array} Returns the range of numbers.
     */
    function baseRange(start, end, step, fromRight) {
      var index = -1,
          length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
          result = Array(length);

      while (length--) {
        result[fromRight ? length : ++index] = start;
        start += step;
      }
      return result;
    }

    /**
     * The base implementation of `_.repeat` which doesn't coerce arguments.
     *
     * @private
     * @param {string} string The string to repeat.
     * @param {number} n The number of times to repeat the string.
     * @returns {string} Returns the repeated string.
     */
    function baseRepeat(string, n) {
      var result = '';
      if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
        return result;
      }
      // Leverage the exponentiation by squaring algorithm for a faster repeat.
      // See https://en.wikipedia.org/wiki/Exponentiation_by_squaring for more details.
      do {
        if (n % 2) {
          result += string;
        }
        n = nativeFloor(n / 2);
        if (n) {
          string += string;
        }
      } while (n);

      return result;
    }

    /**
     * The base implementation of `_.rest` which doesn't validate or coerce arguments.
     *
     * @private
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @returns {Function} Returns the new function.
     */
    function baseRest(func, start) {
      return setToString(overRest(func, start, identity), func + '');
    }

    /**
     * The base implementation of `_.sample`.
     *
     * @private
     * @param {Array|Object} collection The collection to sample.
     * @returns {*} Returns the random element.
     */
    function baseSample(collection) {
      return arraySample(values(collection));
    }

    /**
     * The base implementation of `_.sampleSize` without param guards.
     *
     * @private
     * @param {Array|Object} collection The collection to sample.
     * @param {number} n The number of elements to sample.
     * @returns {Array} Returns the random elements.
     */
    function baseSampleSize(collection, n) {
      var array = values(collection);
      return shuffleSelf(array, baseClamp(n, 0, array.length));
    }

    /**
     * The base implementation of `_.set`.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @param {Function} [customizer] The function to customize path creation.
     * @returns {Object} Returns `object`.
     */
    function baseSet(object, path, value, customizer) {
      if (!isObject(object)) {
        return object;
      }
      path = castPath(path, object);

      var index = -1,
          length = path.length,
          lastIndex = length - 1,
          nested = object;

      while (nested != null && ++index < length) {
        var key = toKey(path[index]),
            newValue = value;

        if (index != lastIndex) {
          var objValue = nested[key];
          newValue = customizer ? customizer(objValue, key, nested) : undefined;
          if (newValue === undefined) {
            newValue = isObject(objValue)
              ? objValue
              : (isIndex(path[index + 1]) ? [] : {});
          }
        }
        assignValue(nested, key, newValue);
        nested = nested[key];
      }
      return object;
    }

    /**
     * The base implementation of `setData` without support for hot loop shorting.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var baseSetData = !metaMap ? identity : function(func, data) {
      metaMap.set(func, data);
      return func;
    };

    /**
     * The base implementation of `setToString` without support for hot loop shorting.
     *
     * @private
     * @param {Function} func The function to modify.
     * @param {Function} string The `toString` result.
     * @returns {Function} Returns `func`.
     */
    var baseSetToString = !defineProperty ? identity : function(func, string) {
      return defineProperty(func, 'toString', {
        'configurable': true,
        'enumerable': false,
        'value': constant(string),
        'writable': true
      });
    };

    /**
     * The base implementation of `_.shuffle`.
     *
     * @private
     * @param {Array|Object} collection The collection to shuffle.
     * @returns {Array} Returns the new shuffled array.
     */
    function baseShuffle(collection) {
      return shuffleSelf(values(collection));
    }

    /**
     * The base implementation of `_.slice` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseSlice(array, start, end) {
      var index = -1,
          length = array.length;

      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = end > length ? length : end;
      if (end < 0) {
        end += length;
      }
      length = start > end ? 0 : ((end - start) >>> 0);
      start >>>= 0;

      var result = Array(length);
      while (++index < length) {
        result[index] = array[index + start];
      }
      return result;
    }

    /**
     * The base implementation of `_.some` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     */
    function baseSome(collection, predicate) {
      var result;

      baseEach(collection, function(value, index, collection) {
        result = predicate(value, index, collection);
        return !result;
      });
      return !!result;
    }

    /**
     * The base implementation of `_.sortedIndex` and `_.sortedLastIndex` which
     * performs a binary search of `array` to determine the index at which `value`
     * should be inserted into `array` in order to maintain its sort order.
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */
    function baseSortedIndex(array, value, retHighest) {
      var low = 0,
          high = array == null ? low : array.length;

      if (typeof value == 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
        while (low < high) {
          var mid = (low + high) >>> 1,
              computed = array[mid];

          if (computed !== null && !isSymbol(computed) &&
              (retHighest ? (computed <= value) : (computed < value))) {
            low = mid + 1;
          } else {
            high = mid;
          }
        }
        return high;
      }
      return baseSortedIndexBy(array, value, identity, retHighest);
    }

    /**
     * The base implementation of `_.sortedIndexBy` and `_.sortedLastIndexBy`
     * which invokes `iteratee` for `value` and each element of `array` to compute
     * their sort ranking. The iteratee is invoked with one argument; (value).
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} iteratee The iteratee invoked per element.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */
    function baseSortedIndexBy(array, value, iteratee, retHighest) {
      value = iteratee(value);

      var low = 0,
          high = array == null ? 0 : array.length,
          valIsNaN = value !== value,
          valIsNull = value === null,
          valIsSymbol = isSymbol(value),
          valIsUndefined = value === undefined;

      while (low < high) {
        var mid = nativeFloor((low + high) / 2),
            computed = iteratee(array[mid]),
            othIsDefined = computed !== undefined,
            othIsNull = computed === null,
            othIsReflexive = computed === computed,
            othIsSymbol = isSymbol(computed);

        if (valIsNaN) {
          var setLow = retHighest || othIsReflexive;
        } else if (valIsUndefined) {
          setLow = othIsReflexive && (retHighest || othIsDefined);
        } else if (valIsNull) {
          setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
        } else if (valIsSymbol) {
          setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
        } else if (othIsNull || othIsSymbol) {
          setLow = false;
        } else {
          setLow = retHighest ? (computed <= value) : (computed < value);
        }
        if (setLow) {
          low = mid + 1;
        } else {
          high = mid;
        }
      }
      return nativeMin(high, MAX_ARRAY_INDEX);
    }

    /**
     * The base implementation of `_.sortedUniq` and `_.sortedUniqBy` without
     * support for iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     */
    function baseSortedUniq(array, iteratee) {
      var index = -1,
          length = array.length,
          resIndex = 0,
          result = [];

      while (++index < length) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        if (!index || !eq(computed, seen)) {
          var seen = computed;
          result[resIndex++] = value === 0 ? 0 : value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.toNumber` which doesn't ensure correct
     * conversions of binary, hexadecimal, or octal string values.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {number} Returns the number.
     */
    function baseToNumber(value) {
      if (typeof value == 'number') {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      return +value;
    }

    /**
     * The base implementation of `_.toString` which doesn't convert nullish
     * values to empty strings.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {string} Returns the string.
     */
    function baseToString(value) {
      // Exit early for strings to avoid a performance hit in some environments.
      if (typeof value == 'string') {
        return value;
      }
      if (isArray(value)) {
        // Recursively convert values (susceptible to call stack limits).
        return arrayMap(value, baseToString) + '';
      }
      if (isSymbol(value)) {
        return symbolToString ? symbolToString.call(value) : '';
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
    }

    /**
     * The base implementation of `_.uniqBy` without support for iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     */
    function baseUniq(array, iteratee, comparator) {
      var index = -1,
          includes = arrayIncludes,
          length = array.length,
          isCommon = true,
          result = [],
          seen = result;

      if (comparator) {
        isCommon = false;
        includes = arrayIncludesWith;
      }
      else if (length >= LARGE_ARRAY_SIZE) {
        var set = iteratee ? null : createSet(array);
        if (set) {
          return setToArray(set);
        }
        isCommon = false;
        includes = cacheHas;
        seen = new SetCache;
      }
      else {
        seen = iteratee ? [] : result;
      }
      outer:
      while (++index < length) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        value = (comparator || value !== 0) ? value : 0;
        if (isCommon && computed === computed) {
          var seenIndex = seen.length;
          while (seenIndex--) {
            if (seen[seenIndex] === computed) {
              continue outer;
            }
          }
          if (iteratee) {
            seen.push(computed);
          }
          result.push(value);
        }
        else if (!includes(seen, computed, comparator)) {
          if (seen !== result) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.unset`.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {Array|string} path The property path to unset.
     * @returns {boolean} Returns `true` if the property is deleted, else `false`.
     */
    function baseUnset(object, path) {
      path = castPath(path, object);
      object = parent(object, path);
      return object == null || delete object[toKey(last(path))];
    }

    /**
     * The base implementation of `_.update`.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to update.
     * @param {Function} updater The function to produce the updated value.
     * @param {Function} [customizer] The function to customize path creation.
     * @returns {Object} Returns `object`.
     */
    function baseUpdate(object, path, updater, customizer) {
      return baseSet(object, path, updater(baseGet(object, path)), customizer);
    }

    /**
     * The base implementation of methods like `_.dropWhile` and `_.takeWhile`
     * without support for iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {Function} predicate The function invoked per iteration.
     * @param {boolean} [isDrop] Specify dropping elements instead of taking them.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseWhile(array, predicate, isDrop, fromRight) {
      var length = array.length,
          index = fromRight ? length : -1;

      while ((fromRight ? index-- : ++index < length) &&
        predicate(array[index], index, array)) {}

      return isDrop
        ? baseSlice(array, (fromRight ? 0 : index), (fromRight ? index + 1 : length))
        : baseSlice(array, (fromRight ? index + 1 : 0), (fromRight ? length : index));
    }

    /**
     * The base implementation of `wrapperValue` which returns the result of
     * performing a sequence of actions on the unwrapped `value`, where each
     * successive action is supplied the return value of the previous.
     *
     * @private
     * @param {*} value The unwrapped value.
     * @param {Array} actions Actions to perform to resolve the unwrapped value.
     * @returns {*} Returns the resolved value.
     */
    function baseWrapperValue(value, actions) {
      var result = value;
      if (result instanceof LazyWrapper) {
        result = result.value();
      }
      return arrayReduce(actions, function(result, action) {
        return action.func.apply(action.thisArg, arrayPush([result], action.args));
      }, result);
    }

    /**
     * The base implementation of methods like `_.xor`, without support for
     * iteratee shorthands, that accepts an array of arrays to inspect.
     *
     * @private
     * @param {Array} arrays The arrays to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of values.
     */
    function baseXor(arrays, iteratee, comparator) {
      var length = arrays.length;
      if (length < 2) {
        return length ? baseUniq(arrays[0]) : [];
      }
      var index = -1,
          result = Array(length);

      while (++index < length) {
        var array = arrays[index],
            othIndex = -1;

        while (++othIndex < length) {
          if (othIndex != index) {
            result[index] = baseDifference(result[index] || array, arrays[othIndex], iteratee, comparator);
          }
        }
      }
      return baseUniq(baseFlatten(result, 1), iteratee, comparator);
    }

    /**
     * This base implementation of `_.zipObject` which assigns values using `assignFunc`.
     *
     * @private
     * @param {Array} props The property identifiers.
     * @param {Array} values The property values.
     * @param {Function} assignFunc The function to assign values.
     * @returns {Object} Returns the new object.
     */
    function baseZipObject(props, values, assignFunc) {
      var index = -1,
          length = props.length,
          valsLength = values.length,
          result = {};

      while (++index < length) {
        var value = index < valsLength ? values[index] : undefined;
        assignFunc(result, props[index], value);
      }
      return result;
    }

    /**
     * Casts `value` to an empty array if it's not an array like object.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {Array|Object} Returns the cast array-like object.
     */
    function castArrayLikeObject(value) {
      return isArrayLikeObject(value) ? value : [];
    }

    /**
     * Casts `value` to `identity` if it's not a function.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {Function} Returns cast function.
     */
    function castFunction(value) {
      return typeof value == 'function' ? value : identity;
    }

    /**
     * Casts `value` to a path array if it's not one.
     *
     * @private
     * @param {*} value The value to inspect.
     * @param {Object} [object] The object to query keys on.
     * @returns {Array} Returns the cast property path array.
     */
    function castPath(value, object) {
      if (isArray(value)) {
        return value;
      }
      return isKey(value, object) ? [value] : stringToPath(toString(value));
    }

    /**
     * A `baseRest` alias which can be replaced with `identity` by module
     * replacement plugins.
     *
     * @private
     * @type {Function}
     * @param {Function} func The function to apply a rest parameter to.
     * @returns {Function} Returns the new function.
     */
    var castRest = baseRest;

    /**
     * Casts `array` to a slice if it's needed.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {number} start The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the cast slice.
     */
    function castSlice(array, start, end) {
      var length = array.length;
      end = end === undefined ? length : end;
      return (!start && end >= length) ? array : baseSlice(array, start, end);
    }

    /**
     * A simple wrapper around the global [`clearTimeout`](https://mdn.io/clearTimeout).
     *
     * @private
     * @param {number|Object} id The timer id or timeout object of the timer to clear.
     */
    var clearTimeout = ctxClearTimeout || function(id) {
      return root.clearTimeout(id);
    };

    /**
     * Creates a clone of  `buffer`.
     *
     * @private
     * @param {Buffer} buffer The buffer to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Buffer} Returns the cloned buffer.
     */
    function cloneBuffer(buffer, isDeep) {
      if (isDeep) {
        return buffer.slice();
      }
      var length = buffer.length,
          result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

      buffer.copy(result);
      return result;
    }

    /**
     * Creates a clone of `arrayBuffer`.
     *
     * @private
     * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
     * @returns {ArrayBuffer} Returns the cloned array buffer.
     */
    function cloneArrayBuffer(arrayBuffer) {
      var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
      new Uint8Array(result).set(new Uint8Array(arrayBuffer));
      return result;
    }

    /**
     * Creates a clone of `dataView`.
     *
     * @private
     * @param {Object} dataView The data view to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned data view.
     */
    function cloneDataView(dataView, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
      return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
    }

    /**
     * Creates a clone of `regexp`.
     *
     * @private
     * @param {Object} regexp The regexp to clone.
     * @returns {Object} Returns the cloned regexp.
     */
    function cloneRegExp(regexp) {
      var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
      result.lastIndex = regexp.lastIndex;
      return result;
    }

    /**
     * Creates a clone of the `symbol` object.
     *
     * @private
     * @param {Object} symbol The symbol object to clone.
     * @returns {Object} Returns the cloned symbol object.
     */
    function cloneSymbol(symbol) {
      return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
    }

    /**
     * Creates a clone of `typedArray`.
     *
     * @private
     * @param {Object} typedArray The typed array to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned typed array.
     */
    function cloneTypedArray(typedArray, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
      return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
    }

    /**
     * Compares values to sort them in ascending order.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {number} Returns the sort order indicator for `value`.
     */
    function compareAscending(value, other) {
      if (value !== other) {
        var valIsDefined = value !== undefined,
            valIsNull = value === null,
            valIsReflexive = value === value,
            valIsSymbol = isSymbol(value);

        var othIsDefined = other !== undefined,
            othIsNull = other === null,
            othIsReflexive = other === other,
            othIsSymbol = isSymbol(other);

        if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
            (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
            (valIsNull && othIsDefined && othIsReflexive) ||
            (!valIsDefined && othIsReflexive) ||
            !valIsReflexive) {
          return 1;
        }
        if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
            (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
            (othIsNull && valIsDefined && valIsReflexive) ||
            (!othIsDefined && valIsReflexive) ||
            !othIsReflexive) {
          return -1;
        }
      }
      return 0;
    }

    /**
     * Used by `_.orderBy` to compare multiple properties of a value to another
     * and stable sort them.
     *
     * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
     * specify an order of "desc" for descending or "asc" for ascending sort order
     * of corresponding values.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {boolean[]|string[]} orders The order to sort by for each property.
     * @returns {number} Returns the sort order indicator for `object`.
     */
    function compareMultiple(object, other, orders) {
      var index = -1,
          objCriteria = object.criteria,
          othCriteria = other.criteria,
          length = objCriteria.length,
          ordersLength = orders.length;

      while (++index < length) {
        var result = compareAscending(objCriteria[index], othCriteria[index]);
        if (result) {
          if (index >= ordersLength) {
            return result;
          }
          var order = orders[index];
          return result * (order == 'desc' ? -1 : 1);
        }
      }
      // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
      // that causes it, under certain circumstances, to provide the same value for
      // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
      // for more details.
      //
      // This also ensures a stable sort in V8 and other engines.
      // See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.
      return object.index - other.index;
    }

    /**
     * Creates an array that is the composition of partially applied arguments,
     * placeholders, and provided arguments into a single array of arguments.
     *
     * @private
     * @param {Array} args The provided arguments.
     * @param {Array} partials The arguments to prepend to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @params {boolean} [isCurried] Specify composing for a curried function.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgs(args, partials, holders, isCurried) {
      var argsIndex = -1,
          argsLength = args.length,
          holdersLength = holders.length,
          leftIndex = -1,
          leftLength = partials.length,
          rangeLength = nativeMax(argsLength - holdersLength, 0),
          result = Array(leftLength + rangeLength),
          isUncurried = !isCurried;

      while (++leftIndex < leftLength) {
        result[leftIndex] = partials[leftIndex];
      }
      while (++argsIndex < holdersLength) {
        if (isUncurried || argsIndex < argsLength) {
          result[holders[argsIndex]] = args[argsIndex];
        }
      }
      while (rangeLength--) {
        result[leftIndex++] = args[argsIndex++];
      }
      return result;
    }

    /**
     * This function is like `composeArgs` except that the arguments composition
     * is tailored for `_.partialRight`.
     *
     * @private
     * @param {Array} args The provided arguments.
     * @param {Array} partials The arguments to append to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @params {boolean} [isCurried] Specify composing for a curried function.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgsRight(args, partials, holders, isCurried) {
      var argsIndex = -1,
          argsLength = args.length,
          holdersIndex = -1,
          holdersLength = holders.length,
          rightIndex = -1,
          rightLength = partials.length,
          rangeLength = nativeMax(argsLength - holdersLength, 0),
          result = Array(rangeLength + rightLength),
          isUncurried = !isCurried;

      while (++argsIndex < rangeLength) {
        result[argsIndex] = args[argsIndex];
      }
      var offset = argsIndex;
      while (++rightIndex < rightLength) {
        result[offset + rightIndex] = partials[rightIndex];
      }
      while (++holdersIndex < holdersLength) {
        if (isUncurried || argsIndex < argsLength) {
          result[offset + holders[holdersIndex]] = args[argsIndex++];
        }
      }
      return result;
    }

    /**
     * Copies the values of `source` to `array`.
     *
     * @private
     * @param {Array} source The array to copy values from.
     * @param {Array} [array=[]] The array to copy values to.
     * @returns {Array} Returns `array`.
     */
    function copyArray(source, array) {
      var index = -1,
          length = source.length;

      array || (array = Array(length));
      while (++index < length) {
        array[index] = source[index];
      }
      return array;
    }

    /**
     * Copies properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy properties from.
     * @param {Array} props The property identifiers to copy.
     * @param {Object} [object={}] The object to copy properties to.
     * @param {Function} [customizer] The function to customize copied values.
     * @returns {Object} Returns `object`.
     */
    function copyObject(source, props, object, customizer) {
      var isNew = !object;
      object || (object = {});

      var index = -1,
          length = props.length;

      while (++index < length) {
        var key = props[index];

        var newValue = customizer
          ? customizer(object[key], source[key], key, object, source)
          : undefined;

        if (newValue === undefined) {
          newValue = source[key];
        }
        if (isNew) {
          baseAssignValue(object, key, newValue);
        } else {
          assignValue(object, key, newValue);
        }
      }
      return object;
    }

    /**
     * Copies own symbols of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy symbols from.
     * @param {Object} [object={}] The object to copy symbols to.
     * @returns {Object} Returns `object`.
     */
    function copySymbols(source, object) {
      return copyObject(source, getSymbols(source), object);
    }

    /**
     * Copies own and inherited symbols of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy symbols from.
     * @param {Object} [object={}] The object to copy symbols to.
     * @returns {Object} Returns `object`.
     */
    function copySymbolsIn(source, object) {
      return copyObject(source, getSymbolsIn(source), object);
    }

    /**
     * Creates a function like `_.groupBy`.
     *
     * @private
     * @param {Function} setter The function to set accumulator values.
     * @param {Function} [initializer] The accumulator object initializer.
     * @returns {Function} Returns the new aggregator function.
     */
    function createAggregator(setter, initializer) {
      return function(collection, iteratee) {
        var func = isArray(collection) ? arrayAggregator : baseAggregator,
            accumulator = initializer ? initializer() : {};

        return func(collection, setter, getIteratee(iteratee, 2), accumulator);
      };
    }

    /**
     * Creates a function like `_.assign`.
     *
     * @private
     * @param {Function} assigner The function to assign values.
     * @returns {Function} Returns the new assigner function.
     */
    function createAssigner(assigner) {
      return baseRest(function(object, sources) {
        var index = -1,
            length = sources.length,
            customizer = length > 1 ? sources[length - 1] : undefined,
            guard = length > 2 ? sources[2] : undefined;

        customizer = (assigner.length > 3 && typeof customizer == 'function')
          ? (length--, customizer)
          : undefined;

        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
          customizer = length < 3 ? undefined : customizer;
          length = 1;
        }
        object = Object(object);
        while (++index < length) {
          var source = sources[index];
          if (source) {
            assigner(object, source, index, customizer);
          }
        }
        return object;
      });
    }

    /**
     * Creates a `baseEach` or `baseEachRight` function.
     *
     * @private
     * @param {Function} eachFunc The function to iterate over a collection.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseEach(eachFunc, fromRight) {
      return function(collection, iteratee) {
        if (collection == null) {
          return collection;
        }
        if (!isArrayLike(collection)) {
          return eachFunc(collection, iteratee);
        }
        var length = collection.length,
            index = fromRight ? length : -1,
            iterable = Object(collection);

        while ((fromRight ? index-- : ++index < length)) {
          if (iteratee(iterable[index], index, iterable) === false) {
            break;
          }
        }
        return collection;
      };
    }

    /**
     * Creates a base function for methods like `_.forIn` and `_.forOwn`.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseFor(fromRight) {
      return function(object, iteratee, keysFunc) {
        var index = -1,
            iterable = Object(object),
            props = keysFunc(object),
            length = props.length;

        while (length--) {
          var key = props[fromRight ? length : ++index];
          if (iteratee(iterable[key], key, iterable) === false) {
            break;
          }
        }
        return object;
      };
    }

    /**
     * Creates a function that wraps `func` to invoke it with the optional `this`
     * binding of `thisArg`.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createBind(func, bitmask, thisArg) {
      var isBind = bitmask & WRAP_BIND_FLAG,
          Ctor = createCtor(func);

      function wrapper() {
        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
        return fn.apply(isBind ? thisArg : this, arguments);
      }
      return wrapper;
    }

    /**
     * Creates a function like `_.lowerFirst`.
     *
     * @private
     * @param {string} methodName The name of the `String` case method to use.
     * @returns {Function} Returns the new case function.
     */
    function createCaseFirst(methodName) {
      return function(string) {
        string = toString(string);

        var strSymbols = hasUnicode(string)
          ? stringToArray(string)
          : undefined;

        var chr = strSymbols
          ? strSymbols[0]
          : string.charAt(0);

        var trailing = strSymbols
          ? castSlice(strSymbols, 1).join('')
          : string.slice(1);

        return chr[methodName]() + trailing;
      };
    }

    /**
     * Creates a function like `_.camelCase`.
     *
     * @private
     * @param {Function} callback The function to combine each word.
     * @returns {Function} Returns the new compounder function.
     */
    function createCompounder(callback) {
      return function(string) {
        return arrayReduce(words(deburr(string).replace(reApos, '')), callback, '');
      };
    }

    /**
     * Creates a function that produces an instance of `Ctor` regardless of
     * whether it was invoked as part of a `new` expression or by `call` or `apply`.
     *
     * @private
     * @param {Function} Ctor The constructor to wrap.
     * @returns {Function} Returns the new wrapped function.
     */
    function createCtor(Ctor) {
      return function() {
        // Use a `switch` statement to work with class constructors. See
        // http://ecma-international.org/ecma-262/7.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
        // for more details.
        var args = arguments;
        switch (args.length) {
          case 0: return new Ctor;
          case 1: return new Ctor(args[0]);
          case 2: return new Ctor(args[0], args[1]);
          case 3: return new Ctor(args[0], args[1], args[2]);
          case 4: return new Ctor(args[0], args[1], args[2], args[3]);
          case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
          case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
          case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        }
        var thisBinding = baseCreate(Ctor.prototype),
            result = Ctor.apply(thisBinding, args);

        // Mimic the constructor's `return` behavior.
        // See https://es5.github.io/#x13.2.2 for more details.
        return isObject(result) ? result : thisBinding;
      };
    }

    /**
     * Creates a function that wraps `func` to enable currying.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {number} arity The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createCurry(func, bitmask, arity) {
      var Ctor = createCtor(func);

      function wrapper() {
        var length = arguments.length,
            args = Array(length),
            index = length,
            placeholder = getHolder(wrapper);

        while (index--) {
          args[index] = arguments[index];
        }
        var holders = (length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder)
          ? []
          : replaceHolders(args, placeholder);

        length -= holders.length;
        if (length < arity) {
          return createRecurry(
            func, bitmask, createHybrid, wrapper.placeholder, undefined,
            args, holders, undefined, undefined, arity - length);
        }
        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
        return apply(fn, this, args);
      }
      return wrapper;
    }

    /**
     * Creates a `_.find` or `_.findLast` function.
     *
     * @private
     * @param {Function} findIndexFunc The function to find the collection index.
     * @returns {Function} Returns the new find function.
     */
    function createFind(findIndexFunc) {
      return function(collection, predicate, fromIndex) {
        var iterable = Object(collection);
        if (!isArrayLike(collection)) {
          var iteratee = getIteratee(predicate, 3);
          collection = keys(collection);
          predicate = function(key) { return iteratee(iterable[key], key, iterable); };
        }
        var index = findIndexFunc(collection, predicate, fromIndex);
        return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
      };
    }

    /**
     * Creates a `_.flow` or `_.flowRight` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new flow function.
     */
    function createFlow(fromRight) {
      return flatRest(function(funcs) {
        var length = funcs.length,
            index = length,
            prereq = LodashWrapper.prototype.thru;

        if (fromRight) {
          funcs.reverse();
        }
        while (index--) {
          var func = funcs[index];
          if (typeof func != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
          }
          if (prereq && !wrapper && getFuncName(func) == 'wrapper') {
            var wrapper = new LodashWrapper([], true);
          }
        }
        index = wrapper ? index : length;
        while (++index < length) {
          func = funcs[index];

          var funcName = getFuncName(func),
              data = funcName == 'wrapper' ? getData(func) : undefined;

          if (data && isLaziable(data[0]) &&
                data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG | WRAP_REARG_FLAG) &&
                !data[4].length && data[9] == 1
              ) {
            wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
          } else {
            wrapper = (func.length == 1 && isLaziable(func))
              ? wrapper[funcName]()
              : wrapper.thru(func);
          }
        }
        return function() {
          var args = arguments,
              value = args[0];

          if (wrapper && args.length == 1 && isArray(value)) {
            return wrapper.plant(value).value();
          }
          var index = 0,
              result = length ? funcs[index].apply(this, args) : value;

          while (++index < length) {
            result = funcs[index].call(this, result);
          }
          return result;
        };
      });
    }

    /**
     * Creates a function that wraps `func` to invoke it with optional `this`
     * binding of `thisArg`, partial application, and currying.
     *
     * @private
     * @param {Function|string} func The function or method name to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to prepend to those provided to
     *  the new function.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [partialsRight] The arguments to append to those provided
     *  to the new function.
     * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
      var isAry = bitmask & WRAP_ARY_FLAG,
          isBind = bitmask & WRAP_BIND_FLAG,
          isBindKey = bitmask & WRAP_BIND_KEY_FLAG,
          isCurried = bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG),
          isFlip = bitmask & WRAP_FLIP_FLAG,
          Ctor = isBindKey ? undefined : createCtor(func);

      function wrapper() {
        var length = arguments.length,
            args = Array(length),
            index = length;

        while (index--) {
          args[index] = arguments[index];
        }
        if (isCurried) {
          var placeholder = getHolder(wrapper),
              holdersCount = countHolders(args, placeholder);
        }
        if (partials) {
          args = composeArgs(args, partials, holders, isCurried);
        }
        if (partialsRight) {
          args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
        }
        length -= holdersCount;
        if (isCurried && length < arity) {
          var newHolders = replaceHolders(args, placeholder);
          return createRecurry(
            func, bitmask, createHybrid, wrapper.placeholder, thisArg,
            args, newHolders, argPos, ary, arity - length
          );
        }
        var thisBinding = isBind ? thisArg : this,
            fn = isBindKey ? thisBinding[func] : func;

        length = args.length;
        if (argPos) {
          args = reorder(args, argPos);
        } else if (isFlip && length > 1) {
          args.reverse();
        }
        if (isAry && ary < length) {
          args.length = ary;
        }
        if (this && this !== root && this instanceof wrapper) {
          fn = Ctor || createCtor(fn);
        }
        return fn.apply(thisBinding, args);
      }
      return wrapper;
    }

    /**
     * Creates a function like `_.invertBy`.
     *
     * @private
     * @param {Function} setter The function to set accumulator values.
     * @param {Function} toIteratee The function to resolve iteratees.
     * @returns {Function} Returns the new inverter function.
     */
    function createInverter(setter, toIteratee) {
      return function(object, iteratee) {
        return baseInverter(object, setter, toIteratee(iteratee), {});
      };
    }

    /**
     * Creates a function that performs a mathematical operation on two values.
     *
     * @private
     * @param {Function} operator The function to perform the operation.
     * @param {number} [defaultValue] The value used for `undefined` arguments.
     * @returns {Function} Returns the new mathematical operation function.
     */
    function createMathOperation(operator, defaultValue) {
      return function(value, other) {
        var result;
        if (value === undefined && other === undefined) {
          return defaultValue;
        }
        if (value !== undefined) {
          result = value;
        }
        if (other !== undefined) {
          if (result === undefined) {
            return other;
          }
          if (typeof value == 'string' || typeof other == 'string') {
            value = baseToString(value);
            other = baseToString(other);
          } else {
            value = baseToNumber(value);
            other = baseToNumber(other);
          }
          result = operator(value, other);
        }
        return result;
      };
    }

    /**
     * Creates a function like `_.over`.
     *
     * @private
     * @param {Function} arrayFunc The function to iterate over iteratees.
     * @returns {Function} Returns the new over function.
     */
    function createOver(arrayFunc) {
      return flatRest(function(iteratees) {
        iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
        return baseRest(function(args) {
          var thisArg = this;
          return arrayFunc(iteratees, function(iteratee) {
            return apply(iteratee, thisArg, args);
          });
        });
      });
    }

    /**
     * Creates the padding for `string` based on `length`. The `chars` string
     * is truncated if the number of characters exceeds `length`.
     *
     * @private
     * @param {number} length The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padding for `string`.
     */
    function createPadding(length, chars) {
      chars = chars === undefined ? ' ' : baseToString(chars);

      var charsLength = chars.length;
      if (charsLength < 2) {
        return charsLength ? baseRepeat(chars, length) : chars;
      }
      var result = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
      return hasUnicode(chars)
        ? castSlice(stringToArray(result), 0, length).join('')
        : result.slice(0, length);
    }

    /**
     * Creates a function that wraps `func` to invoke it with the `this` binding
     * of `thisArg` and `partials` prepended to the arguments it receives.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {Array} partials The arguments to prepend to those provided to
     *  the new function.
     * @returns {Function} Returns the new wrapped function.
     */
    function createPartial(func, bitmask, thisArg, partials) {
      var isBind = bitmask & WRAP_BIND_FLAG,
          Ctor = createCtor(func);

      function wrapper() {
        var argsIndex = -1,
            argsLength = arguments.length,
            leftIndex = -1,
            leftLength = partials.length,
            args = Array(leftLength + argsLength),
            fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;

        while (++leftIndex < leftLength) {
          args[leftIndex] = partials[leftIndex];
        }
        while (argsLength--) {
          args[leftIndex++] = arguments[++argsIndex];
        }
        return apply(fn, isBind ? thisArg : this, args);
      }
      return wrapper;
    }

    /**
     * Creates a `_.range` or `_.rangeRight` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new range function.
     */
    function createRange(fromRight) {
      return function(start, end, step) {
        if (step && typeof step != 'number' && isIterateeCall(start, end, step)) {
          end = step = undefined;
        }
        // Ensure the sign of `-0` is preserved.
        start = toFinite(start);
        if (end === undefined) {
          end = start;
          start = 0;
        } else {
          end = toFinite(end);
        }
        step = step === undefined ? (start < end ? 1 : -1) : toFinite(step);
        return baseRange(start, end, step, fromRight);
      };
    }

    /**
     * Creates a function that performs a relational operation on two values.
     *
     * @private
     * @param {Function} operator The function to perform the operation.
     * @returns {Function} Returns the new relational operation function.
     */
    function createRelationalOperation(operator) {
      return function(value, other) {
        if (!(typeof value == 'string' && typeof other == 'string')) {
          value = toNumber(value);
          other = toNumber(other);
        }
        return operator(value, other);
      };
    }

    /**
     * Creates a function that wraps `func` to continue currying.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {Function} wrapFunc The function to create the `func` wrapper.
     * @param {*} placeholder The placeholder value.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to prepend to those provided to
     *  the new function.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
      var isCurry = bitmask & WRAP_CURRY_FLAG,
          newHolders = isCurry ? holders : undefined,
          newHoldersRight = isCurry ? undefined : holders,
          newPartials = isCurry ? partials : undefined,
          newPartialsRight = isCurry ? undefined : partials;

      bitmask |= (isCurry ? WRAP_PARTIAL_FLAG : WRAP_PARTIAL_RIGHT_FLAG);
      bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG : WRAP_PARTIAL_FLAG);

      if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {
        bitmask &= ~(WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG);
      }
      var newData = [
        func, bitmask, thisArg, newPartials, newHolders, newPartialsRight,
        newHoldersRight, argPos, ary, arity
      ];

      var result = wrapFunc.apply(undefined, newData);
      if (isLaziable(func)) {
        setData(result, newData);
      }
      result.placeholder = placeholder;
      return setWrapToString(result, func, bitmask);
    }

    /**
     * Creates a function like `_.round`.
     *
     * @private
     * @param {string} methodName The name of the `Math` method to use when rounding.
     * @returns {Function} Returns the new round function.
     */
    function createRound(methodName) {
      var func = Math[methodName];
      return function(number, precision) {
        number = toNumber(number);
        precision = precision == null ? 0 : nativeMin(toInteger(precision), 292);
        if (precision && nativeIsFinite(number)) {
          // Shift with exponential notation to avoid floating-point issues.
          // See [MDN](https://mdn.io/round#Examples) for more details.
          var pair = (toString(number) + 'e').split('e'),
              value = func(pair[0] + 'e' + (+pair[1] + precision));

          pair = (toString(value) + 'e').split('e');
          return +(pair[0] + 'e' + (+pair[1] - precision));
        }
        return func(number);
      };
    }

    /**
     * Creates a set object of `values`.
     *
     * @private
     * @param {Array} values The values to add to the set.
     * @returns {Object} Returns the new set.
     */
    var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
      return new Set(values);
    };

    /**
     * Creates a `_.toPairs` or `_.toPairsIn` function.
     *
     * @private
     * @param {Function} keysFunc The function to get the keys of a given object.
     * @returns {Function} Returns the new pairs function.
     */
    function createToPairs(keysFunc) {
      return function(object) {
        var tag = getTag(object);
        if (tag == mapTag) {
          return mapToArray(object);
        }
        if (tag == setTag) {
          return setToPairs(object);
        }
        return baseToPairs(object, keysFunc(object));
      };
    }

    /**
     * Creates a function that either curries or invokes `func` with optional
     * `this` binding and partially applied arguments.
     *
     * @private
     * @param {Function|string} func The function or method name to wrap.
     * @param {number} bitmask The bitmask flags.
     *    1 - `_.bind`
     *    2 - `_.bindKey`
     *    4 - `_.curry` or `_.curryRight` of a bound function
     *    8 - `_.curry`
     *   16 - `_.curryRight`
     *   32 - `_.partial`
     *   64 - `_.partialRight`
     *  128 - `_.rearg`
     *  256 - `_.ary`
     *  512 - `_.flip`
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to be partially applied.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
      var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;
      if (!isBindKey && typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var length = partials ? partials.length : 0;
      if (!length) {
        bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);
        partials = holders = undefined;
      }
      ary = ary === undefined ? ary : nativeMax(toInteger(ary), 0);
      arity = arity === undefined ? arity : toInteger(arity);
      length -= holders ? holders.length : 0;

      if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {
        var partialsRight = partials,
            holdersRight = holders;

        partials = holders = undefined;
      }
      var data = isBindKey ? undefined : getData(func);

      var newData = [
        func, bitmask, thisArg, partials, holders, partialsRight, holdersRight,
        argPos, ary, arity
      ];

      if (data) {
        mergeData(newData, data);
      }
      func = newData[0];
      bitmask = newData[1];
      thisArg = newData[2];
      partials = newData[3];
      holders = newData[4];
      arity = newData[9] = newData[9] === undefined
        ? (isBindKey ? 0 : func.length)
        : nativeMax(newData[9] - length, 0);

      if (!arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG)) {
        bitmask &= ~(WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG);
      }
      if (!bitmask || bitmask == WRAP_BIND_FLAG) {
        var result = createBind(func, bitmask, thisArg);
      } else if (bitmask == WRAP_CURRY_FLAG || bitmask == WRAP_CURRY_RIGHT_FLAG) {
        result = createCurry(func, bitmask, arity);
      } else if ((bitmask == WRAP_PARTIAL_FLAG || bitmask == (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG)) && !holders.length) {
        result = createPartial(func, bitmask, thisArg, partials);
      } else {
        result = createHybrid.apply(undefined, newData);
      }
      var setter = data ? baseSetData : setData;
      return setWrapToString(setter(result, newData), func, bitmask);
    }

    /**
     * Used by `_.defaults` to customize its `_.assignIn` use to assign properties
     * of source objects to the destination object for all destination properties
     * that resolve to `undefined`.
     *
     * @private
     * @param {*} objValue The destination value.
     * @param {*} srcValue The source value.
     * @param {string} key The key of the property to assign.
     * @param {Object} object The parent object of `objValue`.
     * @returns {*} Returns the value to assign.
     */
    function customDefaultsAssignIn(objValue, srcValue, key, object) {
      if (objValue === undefined ||
          (eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))) {
        return srcValue;
      }
      return objValue;
    }

    /**
     * Used by `_.defaultsDeep` to customize its `_.merge` use to merge source
     * objects into destination objects that are passed thru.
     *
     * @private
     * @param {*} objValue The destination value.
     * @param {*} srcValue The source value.
     * @param {string} key The key of the property to merge.
     * @param {Object} object The parent object of `objValue`.
     * @param {Object} source The parent object of `srcValue`.
     * @param {Object} [stack] Tracks traversed source values and their merged
     *  counterparts.
     * @returns {*} Returns the value to assign.
     */
    function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {
      if (isObject(objValue) && isObject(srcValue)) {
        // Recursively merge objects and arrays (susceptible to call stack limits).
        stack.set(srcValue, objValue);
        baseMerge(objValue, srcValue, undefined, customDefaultsMerge, stack);
        stack['delete'](srcValue);
      }
      return objValue;
    }

    /**
     * Used by `_.omit` to customize its `_.cloneDeep` use to only clone plain
     * objects.
     *
     * @private
     * @param {*} value The value to inspect.
     * @param {string} key The key of the property to inspect.
     * @returns {*} Returns the uncloned value or `undefined` to defer cloning to `_.cloneDeep`.
     */
    function customOmitClone(value) {
      return isPlainObject(value) ? undefined : value;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for arrays with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Array} array The array to compare.
     * @param {Array} other The other array to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `array` and `other` objects.
     * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
     */
    function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
          arrLength = array.length,
          othLength = other.length;

      if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(array);
      if (stacked && stack.get(other)) {
        return stacked == other;
      }
      var index = -1,
          result = true,
          seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

      stack.set(array, other);
      stack.set(other, array);

      // Ignore non-index properties.
      while (++index < arrLength) {
        var arrValue = array[index],
            othValue = other[index];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, arrValue, index, other, array, stack)
            : customizer(arrValue, othValue, index, array, other, stack);
        }
        if (compared !== undefined) {
          if (compared) {
            continue;
          }
          result = false;
          break;
        }
        // Recursively compare arrays (susceptible to call stack limits).
        if (seen) {
          if (!arraySome(other, function(othValue, othIndex) {
                if (!cacheHas(seen, othIndex) &&
                    (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
                  return seen.push(othIndex);
                }
              })) {
            result = false;
            break;
          }
        } else if (!(
              arrValue === othValue ||
                equalFunc(arrValue, othValue, bitmask, customizer, stack)
            )) {
          result = false;
          break;
        }
      }
      stack['delete'](array);
      stack['delete'](other);
      return result;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for comparing objects of
     * the same `toStringTag`.
     *
     * **Note:** This function only supports comparing values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {string} tag The `toStringTag` of the objects to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
      switch (tag) {
        case dataViewTag:
          if ((object.byteLength != other.byteLength) ||
              (object.byteOffset != other.byteOffset)) {
            return false;
          }
          object = object.buffer;
          other = other.buffer;

        case arrayBufferTag:
          if ((object.byteLength != other.byteLength) ||
              !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
            return false;
          }
          return true;

        case boolTag:
        case dateTag:
        case numberTag:
          // Coerce booleans to `1` or `0` and dates to milliseconds.
          // Invalid dates are coerced to `NaN`.
          return eq(+object, +other);

        case errorTag:
          return object.name == other.name && object.message == other.message;

        case regexpTag:
        case stringTag:
          // Coerce regexes to strings and treat strings, primitives and objects,
          // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
          // for more details.
          return object == (other + '');

        case mapTag:
          var convert = mapToArray;

        case setTag:
          var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
          convert || (convert = setToArray);

          if (object.size != other.size && !isPartial) {
            return false;
          }
          // Assume cyclic values are equal.
          var stacked = stack.get(object);
          if (stacked) {
            return stacked == other;
          }
          bitmask |= COMPARE_UNORDERED_FLAG;

          // Recursively compare objects (susceptible to call stack limits).
          stack.set(object, other);
          var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
          stack['delete'](object);
          return result;

        case symbolTag:
          if (symbolValueOf) {
            return symbolValueOf.call(object) == symbolValueOf.call(other);
          }
      }
      return false;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for objects with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
          objProps = getAllKeys(object),
          objLength = objProps.length,
          othProps = getAllKeys(other),
          othLength = othProps.length;

      if (objLength != othLength && !isPartial) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
          return false;
        }
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked && stack.get(other)) {
        return stacked == other;
      }
      var result = true;
      stack.set(object, other);
      stack.set(other, object);

      var skipCtor = isPartial;
      while (++index < objLength) {
        key = objProps[index];
        var objValue = object[key],
            othValue = other[key];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, objValue, key, other, object, stack)
            : customizer(objValue, othValue, key, object, other, stack);
        }
        // Recursively compare objects (susceptible to call stack limits).
        if (!(compared === undefined
              ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
              : compared
            )) {
          result = false;
          break;
        }
        skipCtor || (skipCtor = key == 'constructor');
      }
      if (result && !skipCtor) {
        var objCtor = object.constructor,
            othCtor = other.constructor;

        // Non `Object` object instances with different constructors are not equal.
        if (objCtor != othCtor &&
            ('constructor' in object && 'constructor' in other) &&
            !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
              typeof othCtor == 'function' && othCtor instanceof othCtor)) {
          result = false;
        }
      }
      stack['delete'](object);
      stack['delete'](other);
      return result;
    }

    /**
     * A specialized version of `baseRest` which flattens the rest array.
     *
     * @private
     * @param {Function} func The function to apply a rest parameter to.
     * @returns {Function} Returns the new function.
     */
    function flatRest(func) {
      return setToString(overRest(func, undefined, flatten), func + '');
    }

    /**
     * Creates an array of own enumerable property names and symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function getAllKeys(object) {
      return baseGetAllKeys(object, keys, getSymbols);
    }

    /**
     * Creates an array of own and inherited enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function getAllKeysIn(object) {
      return baseGetAllKeys(object, keysIn, getSymbolsIn);
    }

    /**
     * Gets metadata for `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {*} Returns the metadata for `func`.
     */
    var getData = !metaMap ? noop : function(func) {
      return metaMap.get(func);
    };

    /**
     * Gets the name of `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {string} Returns the function name.
     */
    function getFuncName(func) {
      var result = (func.name + ''),
          array = realNames[result],
          length = hasOwnProperty.call(realNames, result) ? array.length : 0;

      while (length--) {
        var data = array[length],
            otherFunc = data.func;
        if (otherFunc == null || otherFunc == func) {
          return data.name;
        }
      }
      return result;
    }

    /**
     * Gets the argument placeholder value for `func`.
     *
     * @private
     * @param {Function} func The function to inspect.
     * @returns {*} Returns the placeholder value.
     */
    function getHolder(func) {
      var object = hasOwnProperty.call(lodash, 'placeholder') ? lodash : func;
      return object.placeholder;
    }

    /**
     * Gets the appropriate "iteratee" function. If `_.iteratee` is customized,
     * this function returns the custom method, otherwise it returns `baseIteratee`.
     * If arguments are provided, the chosen function is invoked with them and
     * its result is returned.
     *
     * @private
     * @param {*} [value] The value to convert to an iteratee.
     * @param {number} [arity] The arity of the created iteratee.
     * @returns {Function} Returns the chosen function or its result.
     */
    function getIteratee() {
      var result = lodash.iteratee || iteratee;
      result = result === iteratee ? baseIteratee : result;
      return arguments.length ? result(arguments[0], arguments[1]) : result;
    }

    /**
     * Gets the data for `map`.
     *
     * @private
     * @param {Object} map The map to query.
     * @param {string} key The reference key.
     * @returns {*} Returns the map data.
     */
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key)
        ? data[typeof key == 'string' ? 'string' : 'hash']
        : data.map;
    }

    /**
     * Gets the property names, values, and compare flags of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the match data of `object`.
     */
    function getMatchData(object) {
      var result = keys(object),
          length = result.length;

      while (length--) {
        var key = result[length],
            value = object[key];

        result[length] = [key, value, isStrictComparable(value)];
      }
      return result;
    }

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : undefined;
    }

    /**
     * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the raw `toStringTag`.
     */
    function getRawTag(value) {
      var isOwn = hasOwnProperty.call(value, symToStringTag),
          tag = value[symToStringTag];

      try {
        value[symToStringTag] = undefined;
        var unmasked = true;
      } catch (e) {}

      var result = nativeObjectToString.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag] = tag;
        } else {
          delete value[symToStringTag];
        }
      }
      return result;
    }

    /**
     * Creates an array of the own enumerable symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
      if (object == null) {
        return [];
      }
      object = Object(object);
      return arrayFilter(nativeGetSymbols(object), function(symbol) {
        return propertyIsEnumerable.call(object, symbol);
      });
    };

    /**
     * Creates an array of the own and inherited enumerable symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
      var result = [];
      while (object) {
        arrayPush(result, getSymbols(object));
        object = getPrototype(object);
      }
      return result;
    };

    /**
     * Gets the `toStringTag` of `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    var getTag = baseGetTag;

    // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
    if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
        (Map && getTag(new Map) != mapTag) ||
        (Promise && getTag(Promise.resolve()) != promiseTag) ||
        (Set && getTag(new Set) != setTag) ||
        (WeakMap && getTag(new WeakMap) != weakMapTag)) {
      getTag = function(value) {
        var result = baseGetTag(value),
            Ctor = result == objectTag ? value.constructor : undefined,
            ctorString = Ctor ? toSource(Ctor) : '';

        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString: return dataViewTag;
            case mapCtorString: return mapTag;
            case promiseCtorString: return promiseTag;
            case setCtorString: return setTag;
            case weakMapCtorString: return weakMapTag;
          }
        }
        return result;
      };
    }

    /**
     * Gets the view, applying any `transforms` to the `start` and `end` positions.
     *
     * @private
     * @param {number} start The start of the view.
     * @param {number} end The end of the view.
     * @param {Array} transforms The transformations to apply to the view.
     * @returns {Object} Returns an object containing the `start` and `end`
     *  positions of the view.
     */
    function getView(start, end, transforms) {
      var index = -1,
          length = transforms.length;

      while (++index < length) {
        var data = transforms[index],
            size = data.size;

        switch (data.type) {
          case 'drop':      start += size; break;
          case 'dropRight': end -= size; break;
          case 'take':      end = nativeMin(end, start + size); break;
          case 'takeRight': start = nativeMax(start, end - size); break;
        }
      }
      return { 'start': start, 'end': end };
    }

    /**
     * Extracts wrapper details from the `source` body comment.
     *
     * @private
     * @param {string} source The source to inspect.
     * @returns {Array} Returns the wrapper details.
     */
    function getWrapDetails(source) {
      var match = source.match(reWrapDetails);
      return match ? match[1].split(reSplitDetails) : [];
    }

    /**
     * Checks if `path` exists on `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @param {Function} hasFunc The function to check properties.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     */
    function hasPath(object, path, hasFunc) {
      path = castPath(path, object);

      var index = -1,
          length = path.length,
          result = false;

      while (++index < length) {
        var key = toKey(path[index]);
        if (!(result = object != null && hasFunc(object, key))) {
          break;
        }
        object = object[key];
      }
      if (result || ++index != length) {
        return result;
      }
      length = object == null ? 0 : object.length;
      return !!length && isLength(length) && isIndex(key, length) &&
        (isArray(object) || isArguments(object));
    }

    /**
     * Initializes an array clone.
     *
     * @private
     * @param {Array} array The array to clone.
     * @returns {Array} Returns the initialized clone.
     */
    function initCloneArray(array) {
      var length = array.length,
          result = new array.constructor(length);

      // Add properties assigned by `RegExp#exec`.
      if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
        result.index = array.index;
        result.input = array.input;
      }
      return result;
    }

    /**
     * Initializes an object clone.
     *
     * @private
     * @param {Object} object The object to clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneObject(object) {
      return (typeof object.constructor == 'function' && !isPrototype(object))
        ? baseCreate(getPrototype(object))
        : {};
    }

    /**
     * Initializes an object clone based on its `toStringTag`.
     *
     * **Note:** This function only supports cloning values with tags of
     * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
     *
     * @private
     * @param {Object} object The object to clone.
     * @param {string} tag The `toStringTag` of the object to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneByTag(object, tag, isDeep) {
      var Ctor = object.constructor;
      switch (tag) {
        case arrayBufferTag:
          return cloneArrayBuffer(object);

        case boolTag:
        case dateTag:
          return new Ctor(+object);

        case dataViewTag:
          return cloneDataView(object, isDeep);

        case float32Tag: case float64Tag:
        case int8Tag: case int16Tag: case int32Tag:
        case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
          return cloneTypedArray(object, isDeep);

        case mapTag:
          return new Ctor;

        case numberTag:
        case stringTag:
          return new Ctor(object);

        case regexpTag:
          return cloneRegExp(object);

        case setTag:
          return new Ctor;

        case symbolTag:
          return cloneSymbol(object);
      }
    }

    /**
     * Inserts wrapper `details` in a comment at the top of the `source` body.
     *
     * @private
     * @param {string} source The source to modify.
     * @returns {Array} details The details to insert.
     * @returns {string} Returns the modified source.
     */
    function insertWrapDetails(source, details) {
      var length = details.length;
      if (!length) {
        return source;
      }
      var lastIndex = length - 1;
      details[lastIndex] = (length > 1 ? '& ' : '') + details[lastIndex];
      details = details.join(length > 2 ? ', ' : ' ');
      return source.replace(reWrapComment, '{\n/* [wrapped with ' + details + '] */\n');
    }

    /**
     * Checks if `value` is a flattenable `arguments` object or array.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
     */
    function isFlattenable(value) {
      return isArray(value) || isArguments(value) ||
        !!(spreadableSymbol && value && value[spreadableSymbol]);
    }

    /**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */
    function isIndex(value, length) {
      var type = typeof value;
      length = length == null ? MAX_SAFE_INTEGER : length;

      return !!length &&
        (type == 'number' ||
          (type != 'symbol' && reIsUint.test(value))) &&
            (value > -1 && value % 1 == 0 && value < length);
    }

    /**
     * Checks if the given arguments are from an iteratee call.
     *
     * @private
     * @param {*} value The potential iteratee value argument.
     * @param {*} index The potential iteratee index or key argument.
     * @param {*} object The potential iteratee object argument.
     * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
     *  else `false`.
     */
    function isIterateeCall(value, index, object) {
      if (!isObject(object)) {
        return false;
      }
      var type = typeof index;
      if (type == 'number'
            ? (isArrayLike(object) && isIndex(index, object.length))
            : (type == 'string' && index in object)
          ) {
        return eq(object[index], value);
      }
      return false;
    }

    /**
     * Checks if `value` is a property name and not a property path.
     *
     * @private
     * @param {*} value The value to check.
     * @param {Object} [object] The object to query keys on.
     * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
     */
    function isKey(value, object) {
      if (isArray(value)) {
        return false;
      }
      var type = typeof value;
      if (type == 'number' || type == 'symbol' || type == 'boolean' ||
          value == null || isSymbol(value)) {
        return true;
      }
      return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
        (object != null && value in Object(object));
    }

    /**
     * Checks if `value` is suitable for use as unique object key.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
     */
    function isKeyable(value) {
      var type = typeof value;
      return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
        ? (value !== '__proto__')
        : (value === null);
    }

    /**
     * Checks if `func` has a lazy counterpart.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` has a lazy counterpart,
     *  else `false`.
     */
    function isLaziable(func) {
      var funcName = getFuncName(func),
          other = lodash[funcName];

      if (typeof other != 'function' || !(funcName in LazyWrapper.prototype)) {
        return false;
      }
      if (func === other) {
        return true;
      }
      var data = getData(other);
      return !!data && func === data[0];
    }

    /**
     * Checks if `func` has its source masked.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` is masked, else `false`.
     */
    function isMasked(func) {
      return !!maskSrcKey && (maskSrcKey in func);
    }

    /**
     * Checks if `func` is capable of being masked.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `func` is maskable, else `false`.
     */
    var isMaskable = coreJsData ? isFunction : stubFalse;

    /**
     * Checks if `value` is likely a prototype object.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
     */
    function isPrototype(value) {
      var Ctor = value && value.constructor,
          proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

      return value === proto;
    }

    /**
     * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` if suitable for strict
     *  equality comparisons, else `false`.
     */
    function isStrictComparable(value) {
      return value === value && !isObject(value);
    }

    /**
     * A specialized version of `matchesProperty` for source values suitable
     * for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {string} key The key of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new spec function.
     */
    function matchesStrictComparable(key, srcValue) {
      return function(object) {
        if (object == null) {
          return false;
        }
        return object[key] === srcValue &&
          (srcValue !== undefined || (key in Object(object)));
      };
    }

    /**
     * A specialized version of `_.memoize` which clears the memoized function's
     * cache when it exceeds `MAX_MEMOIZE_SIZE`.
     *
     * @private
     * @param {Function} func The function to have its output memoized.
     * @returns {Function} Returns the new memoized function.
     */
    function memoizeCapped(func) {
      var result = memoize(func, function(key) {
        if (cache.size === MAX_MEMOIZE_SIZE) {
          cache.clear();
        }
        return key;
      });

      var cache = result.cache;
      return result;
    }

    /**
     * Merges the function metadata of `source` into `data`.
     *
     * Merging metadata reduces the number of wrappers used to invoke a function.
     * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
     * may be applied regardless of execution order. Methods like `_.ary` and
     * `_.rearg` modify function arguments, making the order in which they are
     * executed important, preventing the merging of metadata. However, we make
     * an exception for a safe combined case where curried functions have `_.ary`
     * and or `_.rearg` applied.
     *
     * @private
     * @param {Array} data The destination metadata.
     * @param {Array} source The source metadata.
     * @returns {Array} Returns `data`.
     */
    function mergeData(data, source) {
      var bitmask = data[1],
          srcBitmask = source[1],
          newBitmask = bitmask | srcBitmask,
          isCommon = newBitmask < (WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG | WRAP_ARY_FLAG);

      var isCombo =
        ((srcBitmask == WRAP_ARY_FLAG) && (bitmask == WRAP_CURRY_FLAG)) ||
        ((srcBitmask == WRAP_ARY_FLAG) && (bitmask == WRAP_REARG_FLAG) && (data[7].length <= source[8])) ||
        ((srcBitmask == (WRAP_ARY_FLAG | WRAP_REARG_FLAG)) && (source[7].length <= source[8]) && (bitmask == WRAP_CURRY_FLAG));

      // Exit early if metadata can't be merged.
      if (!(isCommon || isCombo)) {
        return data;
      }
      // Use source `thisArg` if available.
      if (srcBitmask & WRAP_BIND_FLAG) {
        data[2] = source[2];
        // Set when currying a bound function.
        newBitmask |= bitmask & WRAP_BIND_FLAG ? 0 : WRAP_CURRY_BOUND_FLAG;
      }
      // Compose partial arguments.
      var value = source[3];
      if (value) {
        var partials = data[3];
        data[3] = partials ? composeArgs(partials, value, source[4]) : value;
        data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
      }
      // Compose partial right arguments.
      value = source[5];
      if (value) {
        partials = data[5];
        data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
        data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
      }
      // Use source `argPos` if available.
      value = source[7];
      if (value) {
        data[7] = value;
      }
      // Use source `ary` if it's smaller.
      if (srcBitmask & WRAP_ARY_FLAG) {
        data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
      }
      // Use source `arity` if one is not provided.
      if (data[9] == null) {
        data[9] = source[9];
      }
      // Use source `func` and merge bitmasks.
      data[0] = source[0];
      data[1] = newBitmask;

      return data;
    }

    /**
     * This function is like
     * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * except that it includes inherited enumerable properties.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function nativeKeysIn(object) {
      var result = [];
      if (object != null) {
        for (var key in Object(object)) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * Converts `value` to a string using `Object.prototype.toString`.
     *
     * @private
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     */
    function objectToString(value) {
      return nativeObjectToString.call(value);
    }

    /**
     * A specialized version of `baseRest` which transforms the rest array.
     *
     * @private
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @param {Function} transform The rest array transform.
     * @returns {Function} Returns the new function.
     */
    function overRest(func, start, transform) {
      start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
      return function() {
        var args = arguments,
            index = -1,
            length = nativeMax(args.length - start, 0),
            array = Array(length);

        while (++index < length) {
          array[index] = args[start + index];
        }
        index = -1;
        var otherArgs = Array(start + 1);
        while (++index < start) {
          otherArgs[index] = args[index];
        }
        otherArgs[start] = transform(array);
        return apply(func, this, otherArgs);
      };
    }

    /**
     * Gets the parent value at `path` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array} path The path to get the parent value of.
     * @returns {*} Returns the parent value.
     */
    function parent(object, path) {
      return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
    }

    /**
     * Reorder `array` according to the specified indexes where the element at
     * the first index is assigned as the first element, the element at
     * the second index is assigned as the second element, and so on.
     *
     * @private
     * @param {Array} array The array to reorder.
     * @param {Array} indexes The arranged array indexes.
     * @returns {Array} Returns `array`.
     */
    function reorder(array, indexes) {
      var arrLength = array.length,
          length = nativeMin(indexes.length, arrLength),
          oldArray = copyArray(array);

      while (length--) {
        var index = indexes[length];
        array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
      }
      return array;
    }

    /**
     * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the property to get.
     * @returns {*} Returns the property value.
     */
    function safeGet(object, key) {
      if (key === 'constructor' && typeof object[key] === 'function') {
        return;
      }

      if (key == '__proto__') {
        return;
      }

      return object[key];
    }

    /**
     * Sets metadata for `func`.
     *
     * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
     * period of time, it will trip its breaker and transition to an identity
     * function to avoid garbage collection pauses in V8. See
     * [V8 issue 2070](https://bugs.chromium.org/p/v8/issues/detail?id=2070)
     * for more details.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var setData = shortOut(baseSetData);

    /**
     * A simple wrapper around the global [`setTimeout`](https://mdn.io/setTimeout).
     *
     * @private
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @returns {number|Object} Returns the timer id or timeout object.
     */
    var setTimeout = ctxSetTimeout || function(func, wait) {
      return root.setTimeout(func, wait);
    };

    /**
     * Sets the `toString` method of `func` to return `string`.
     *
     * @private
     * @param {Function} func The function to modify.
     * @param {Function} string The `toString` result.
     * @returns {Function} Returns `func`.
     */
    var setToString = shortOut(baseSetToString);

    /**
     * Sets the `toString` method of `wrapper` to mimic the source of `reference`
     * with wrapper details in a comment at the top of the source body.
     *
     * @private
     * @param {Function} wrapper The function to modify.
     * @param {Function} reference The reference function.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @returns {Function} Returns `wrapper`.
     */
    function setWrapToString(wrapper, reference, bitmask) {
      var source = (reference + '');
      return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
    }

    /**
     * Creates a function that'll short out and invoke `identity` instead
     * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
     * milliseconds.
     *
     * @private
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new shortable function.
     */
    function shortOut(func) {
      var count = 0,
          lastCalled = 0;

      return function() {
        var stamp = nativeNow(),
            remaining = HOT_SPAN - (stamp - lastCalled);

        lastCalled = stamp;
        if (remaining > 0) {
          if (++count >= HOT_COUNT) {
            return arguments[0];
          }
        } else {
          count = 0;
        }
        return func.apply(undefined, arguments);
      };
    }

    /**
     * A specialized version of `_.shuffle` which mutates and sets the size of `array`.
     *
     * @private
     * @param {Array} array The array to shuffle.
     * @param {number} [size=array.length] The size of `array`.
     * @returns {Array} Returns `array`.
     */
    function shuffleSelf(array, size) {
      var index = -1,
          length = array.length,
          lastIndex = length - 1;

      size = size === undefined ? length : size;
      while (++index < size) {
        var rand = baseRandom(index, lastIndex),
            value = array[rand];

        array[rand] = array[index];
        array[index] = value;
      }
      array.length = size;
      return array;
    }

    /**
     * Converts `string` to a property path array.
     *
     * @private
     * @param {string} string The string to convert.
     * @returns {Array} Returns the property path array.
     */
    var stringToPath = memoizeCapped(function(string) {
      var result = [];
      if (string.charCodeAt(0) === 46 /* . */) {
        result.push('');
      }
      string.replace(rePropName, function(match, number, quote, subString) {
        result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
      });
      return result;
    });

    /**
     * Converts `value` to a string key if it's not a string or symbol.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {string|symbol} Returns the key.
     */
    function toKey(value) {
      if (typeof value == 'string' || isSymbol(value)) {
        return value;
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
    }

    /**
     * Converts `func` to its source code.
     *
     * @private
     * @param {Function} func The function to convert.
     * @returns {string} Returns the source code.
     */
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {}
        try {
          return (func + '');
        } catch (e) {}
      }
      return '';
    }

    /**
     * Updates wrapper `details` based on `bitmask` flags.
     *
     * @private
     * @returns {Array} details The details to modify.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @returns {Array} Returns `details`.
     */
    function updateWrapDetails(details, bitmask) {
      arrayEach(wrapFlags, function(pair) {
        var value = '_.' + pair[0];
        if ((bitmask & pair[1]) && !arrayIncludes(details, value)) {
          details.push(value);
        }
      });
      return details.sort();
    }

    /**
     * Creates a clone of `wrapper`.
     *
     * @private
     * @param {Object} wrapper The wrapper to clone.
     * @returns {Object} Returns the cloned wrapper.
     */
    function wrapperClone(wrapper) {
      if (wrapper instanceof LazyWrapper) {
        return wrapper.clone();
      }
      var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
      result.__actions__ = copyArray(wrapper.__actions__);
      result.__index__  = wrapper.__index__;
      result.__values__ = wrapper.__values__;
      return result;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an array of elements split into groups the length of `size`.
     * If `array` can't be split evenly, the final chunk will be the remaining
     * elements.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to process.
     * @param {number} [size=1] The length of each chunk
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the new array of chunks.
     * @example
     *
     * _.chunk(['a', 'b', 'c', 'd'], 2);
     * // => [['a', 'b'], ['c', 'd']]
     *
     * _.chunk(['a', 'b', 'c', 'd'], 3);
     * // => [['a', 'b', 'c'], ['d']]
     */
    function chunk(array, size, guard) {
      if ((guard ? isIterateeCall(array, size, guard) : size === undefined)) {
        size = 1;
      } else {
        size = nativeMax(toInteger(size), 0);
      }
      var length = array == null ? 0 : array.length;
      if (!length || size < 1) {
        return [];
      }
      var index = 0,
          resIndex = 0,
          result = Array(nativeCeil(length / size));

      while (index < length) {
        result[resIndex++] = baseSlice(array, index, (index += size));
      }
      return result;
    }

    /**
     * Creates an array with all falsey values removed. The values `false`, `null`,
     * `0`, `""`, `undefined`, and `NaN` are falsey.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to compact.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.compact([0, 1, false, 2, '', 3]);
     * // => [1, 2, 3]
     */
    function compact(array) {
      var index = -1,
          length = array == null ? 0 : array.length,
          resIndex = 0,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (value) {
          result[resIndex++] = value;
        }
      }
      return result;
    }

    /**
     * Creates a new array concatenating `array` with any additional arrays
     * and/or values.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to concatenate.
     * @param {...*} [values] The values to concatenate.
     * @returns {Array} Returns the new concatenated array.
     * @example
     *
     * var array = [1];
     * var other = _.concat(array, 2, [3], [[4]]);
     *
     * console.log(other);
     * // => [1, 2, 3, [4]]
     *
     * console.log(array);
     * // => [1]
     */
    function concat() {
      var length = arguments.length;
      if (!length) {
        return [];
      }
      var args = Array(length - 1),
          array = arguments[0],
          index = length;

      while (index--) {
        args[index - 1] = arguments[index];
      }
      return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
    }

    /**
     * Creates an array of `array` values not included in the other given arrays
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons. The order and references of result values are
     * determined by the first array.
     *
     * **Note:** Unlike `_.pullAll`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @see _.without, _.xor
     * @example
     *
     * _.difference([2, 1], [2, 3]);
     * // => [1]
     */
    var difference = baseRest(function(array, values) {
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true))
        : [];
    });

    /**
     * This method is like `_.difference` except that it accepts `iteratee` which
     * is invoked for each element of `array` and `values` to generate the criterion
     * by which they're compared. The order and references of result values are
     * determined by the first array. The iteratee is invoked with one argument:
     * (value).
     *
     * **Note:** Unlike `_.pullAllBy`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The values to exclude.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor);
     * // => [1.2]
     *
     * // The `_.property` iteratee shorthand.
     * _.differenceBy([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], 'x');
     * // => [{ 'x': 2 }]
     */
    var differenceBy = baseRest(function(array, values) {
      var iteratee = last(values);
      if (isArrayLikeObject(iteratee)) {
        iteratee = undefined;
      }
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), getIteratee(iteratee, 2))
        : [];
    });

    /**
     * This method is like `_.difference` except that it accepts `comparator`
     * which is invoked to compare elements of `array` to `values`. The order and
     * references of result values are determined by the first array. The comparator
     * is invoked with two arguments: (arrVal, othVal).
     *
     * **Note:** Unlike `_.pullAllWith`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The values to exclude.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     *
     * _.differenceWith(objects, [{ 'x': 1, 'y': 2 }], _.isEqual);
     * // => [{ 'x': 2, 'y': 1 }]
     */
    var differenceWith = baseRest(function(array, values) {
      var comparator = last(values);
      if (isArrayLikeObject(comparator)) {
        comparator = undefined;
      }
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), undefined, comparator)
        : [];
    });

    /**
     * Creates a slice of `array` with `n` elements dropped from the beginning.
     *
     * @static
     * @memberOf _
     * @since 0.5.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.drop([1, 2, 3]);
     * // => [2, 3]
     *
     * _.drop([1, 2, 3], 2);
     * // => [3]
     *
     * _.drop([1, 2, 3], 5);
     * // => []
     *
     * _.drop([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function drop(array, n, guard) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      return baseSlice(array, n < 0 ? 0 : n, length);
    }

    /**
     * Creates a slice of `array` with `n` elements dropped from the end.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropRight([1, 2, 3]);
     * // => [1, 2]
     *
     * _.dropRight([1, 2, 3], 2);
     * // => [1]
     *
     * _.dropRight([1, 2, 3], 5);
     * // => []
     *
     * _.dropRight([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function dropRight(array, n, guard) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      n = length - n;
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` excluding elements dropped from the end.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * invoked with three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.dropRightWhile(users, function(o) { return !o.active; });
     * // => objects for ['barney']
     *
     * // The `_.matches` iteratee shorthand.
     * _.dropRightWhile(users, { 'user': 'pebbles', 'active': false });
     * // => objects for ['barney', 'fred']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.dropRightWhile(users, ['active', false]);
     * // => objects for ['barney']
     *
     * // The `_.property` iteratee shorthand.
     * _.dropRightWhile(users, 'active');
     * // => objects for ['barney', 'fred', 'pebbles']
     */
    function dropRightWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3), true, true)
        : [];
    }

    /**
     * Creates a slice of `array` excluding elements dropped from the beginning.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * invoked with three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.dropWhile(users, function(o) { return !o.active; });
     * // => objects for ['pebbles']
     *
     * // The `_.matches` iteratee shorthand.
     * _.dropWhile(users, { 'user': 'barney', 'active': false });
     * // => objects for ['fred', 'pebbles']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.dropWhile(users, ['active', false]);
     * // => objects for ['pebbles']
     *
     * // The `_.property` iteratee shorthand.
     * _.dropWhile(users, 'active');
     * // => objects for ['barney', 'fred', 'pebbles']
     */
    function dropWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3), true)
        : [];
    }

    /**
     * Fills elements of `array` with `value` from `start` up to, but not
     * including, `end`.
     *
     * **Note:** This method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 3.2.0
     * @category Array
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _.fill(array, 'a');
     * console.log(array);
     * // => ['a', 'a', 'a']
     *
     * _.fill(Array(3), 2);
     * // => [2, 2, 2]
     *
     * _.fill([4, 6, 8, 10], '*', 1, 3);
     * // => [4, '*', '*', 10]
     */
    function fill(array, value, start, end) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      if (start && typeof start != 'number' && isIterateeCall(array, value, start)) {
        start = 0;
        end = length;
      }
      return baseFill(array, value, start, end);
    }

    /**
     * This method is like `_.find` except that it returns the index of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * @static
     * @memberOf _
     * @since 1.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.findIndex(users, function(o) { return o.user == 'barney'; });
     * // => 0
     *
     * // The `_.matches` iteratee shorthand.
     * _.findIndex(users, { 'user': 'fred', 'active': false });
     * // => 1
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findIndex(users, ['active', false]);
     * // => 0
     *
     * // The `_.property` iteratee shorthand.
     * _.findIndex(users, 'active');
     * // => 2
     */
    function findIndex(array, predicate, fromIndex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = fromIndex == null ? 0 : toInteger(fromIndex);
      if (index < 0) {
        index = nativeMax(length + index, 0);
      }
      return baseFindIndex(array, getIteratee(predicate, 3), index);
    }

    /**
     * This method is like `_.findIndex` except that it iterates over elements
     * of `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param {number} [fromIndex=array.length-1] The index to search from.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.findLastIndex(users, function(o) { return o.user == 'pebbles'; });
     * // => 2
     *
     * // The `_.matches` iteratee shorthand.
     * _.findLastIndex(users, { 'user': 'barney', 'active': true });
     * // => 0
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findLastIndex(users, ['active', false]);
     * // => 2
     *
     * // The `_.property` iteratee shorthand.
     * _.findLastIndex(users, 'active');
     * // => 0
     */
    function findLastIndex(array, predicate, fromIndex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = length - 1;
      if (fromIndex !== undefined) {
        index = toInteger(fromIndex);
        index = fromIndex < 0
          ? nativeMax(length + index, 0)
          : nativeMin(index, length - 1);
      }
      return baseFindIndex(array, getIteratee(predicate, 3), index, true);
    }

    /**
     * Flattens `array` a single level deep.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to flatten.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flatten([1, [2, [3, [4]], 5]]);
     * // => [1, 2, [3, [4]], 5]
     */
    function flatten(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseFlatten(array, 1) : [];
    }

    /**
     * Recursively flattens `array`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to flatten.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flattenDeep([1, [2, [3, [4]], 5]]);
     * // => [1, 2, 3, 4, 5]
     */
    function flattenDeep(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseFlatten(array, INFINITY) : [];
    }

    /**
     * Recursively flatten `array` up to `depth` times.
     *
     * @static
     * @memberOf _
     * @since 4.4.0
     * @category Array
     * @param {Array} array The array to flatten.
     * @param {number} [depth=1] The maximum recursion depth.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * var array = [1, [2, [3, [4]], 5]];
     *
     * _.flattenDepth(array, 1);
     * // => [1, 2, [3, [4]], 5]
     *
     * _.flattenDepth(array, 2);
     * // => [1, 2, 3, [4], 5]
     */
    function flattenDepth(array, depth) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      depth = depth === undefined ? 1 : toInteger(depth);
      return baseFlatten(array, depth);
    }

    /**
     * The inverse of `_.toPairs`; this method returns an object composed
     * from key-value `pairs`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} pairs The key-value pairs.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.fromPairs([['a', 1], ['b', 2]]);
     * // => { 'a': 1, 'b': 2 }
     */
    function fromPairs(pairs) {
      var index = -1,
          length = pairs == null ? 0 : pairs.length,
          result = {};

      while (++index < length) {
        var pair = pairs[index];
        result[pair[0]] = pair[1];
      }
      return result;
    }

    /**
     * Gets the first element of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @alias first
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the first element of `array`.
     * @example
     *
     * _.head([1, 2, 3]);
     * // => 1
     *
     * _.head([]);
     * // => undefined
     */
    function head(array) {
      return (array && array.length) ? array[0] : undefined;
    }

    /**
     * Gets the index at which the first occurrence of `value` is found in `array`
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons. If `fromIndex` is negative, it's used as the
     * offset from the end of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.indexOf([1, 2, 1, 2], 2);
     * // => 1
     *
     * // Search from the `fromIndex`.
     * _.indexOf([1, 2, 1, 2], 2, 2);
     * // => 3
     */
    function indexOf(array, value, fromIndex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = fromIndex == null ? 0 : toInteger(fromIndex);
      if (index < 0) {
        index = nativeMax(length + index, 0);
      }
      return baseIndexOf(array, value, index);
    }

    /**
     * Gets all but the last element of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.initial([1, 2, 3]);
     * // => [1, 2]
     */
    function initial(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseSlice(array, 0, -1) : [];
    }

    /**
     * Creates an array of unique values that are included in all given arrays
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons. The order and references of result values are
     * determined by the first array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of intersecting values.
     * @example
     *
     * _.intersection([2, 1], [2, 3]);
     * // => [2]
     */
    var intersection = baseRest(function(arrays) {
      var mapped = arrayMap(arrays, castArrayLikeObject);
      return (mapped.length && mapped[0] === arrays[0])
        ? baseIntersection(mapped)
        : [];
    });

    /**
     * This method is like `_.intersection` except that it accepts `iteratee`
     * which is invoked for each element of each `arrays` to generate the criterion
     * by which they're compared. The order and references of result values are
     * determined by the first array. The iteratee is invoked with one argument:
     * (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of intersecting values.
     * @example
     *
     * _.intersectionBy([2.1, 1.2], [2.3, 3.4], Math.floor);
     * // => [2.1]
     *
     * // The `_.property` iteratee shorthand.
     * _.intersectionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }]
     */
    var intersectionBy = baseRest(function(arrays) {
      var iteratee = last(arrays),
          mapped = arrayMap(arrays, castArrayLikeObject);

      if (iteratee === last(mapped)) {
        iteratee = undefined;
      } else {
        mapped.pop();
      }
      return (mapped.length && mapped[0] === arrays[0])
        ? baseIntersection(mapped, getIteratee(iteratee, 2))
        : [];
    });

    /**
     * This method is like `_.intersection` except that it accepts `comparator`
     * which is invoked to compare elements of `arrays`. The order and references
     * of result values are determined by the first array. The comparator is
     * invoked with two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of intersecting values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.intersectionWith(objects, others, _.isEqual);
     * // => [{ 'x': 1, 'y': 2 }]
     */
    var intersectionWith = baseRest(function(arrays) {
      var comparator = last(arrays),
          mapped = arrayMap(arrays, castArrayLikeObject);

      comparator = typeof comparator == 'function' ? comparator : undefined;
      if (comparator) {
        mapped.pop();
      }
      return (mapped.length && mapped[0] === arrays[0])
        ? baseIntersection(mapped, undefined, comparator)
        : [];
    });

    /**
     * Converts all elements in `array` into a string separated by `separator`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to convert.
     * @param {string} [separator=','] The element separator.
     * @returns {string} Returns the joined string.
     * @example
     *
     * _.join(['a', 'b', 'c'], '~');
     * // => 'a~b~c'
     */
    function join(array, separator) {
      return array == null ? '' : nativeJoin.call(array, separator);
    }

    /**
     * Gets the last element of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the last element of `array`.
     * @example
     *
     * _.last([1, 2, 3]);
     * // => 3
     */
    function last(array) {
      var length = array == null ? 0 : array.length;
      return length ? array[length - 1] : undefined;
    }

    /**
     * This method is like `_.indexOf` except that it iterates over elements of
     * `array` from right to left.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=array.length-1] The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.lastIndexOf([1, 2, 1, 2], 2);
     * // => 3
     *
     * // Search from the `fromIndex`.
     * _.lastIndexOf([1, 2, 1, 2], 2, 2);
     * // => 1
     */
    function lastIndexOf(array, value, fromIndex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = length;
      if (fromIndex !== undefined) {
        index = toInteger(fromIndex);
        index = index < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
      }
      return value === value
        ? strictLastIndexOf(array, value, index)
        : baseFindIndex(array, baseIsNaN, index, true);
    }

    /**
     * Gets the element at index `n` of `array`. If `n` is negative, the nth
     * element from the end is returned.
     *
     * @static
     * @memberOf _
     * @since 4.11.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=0] The index of the element to return.
     * @returns {*} Returns the nth element of `array`.
     * @example
     *
     * var array = ['a', 'b', 'c', 'd'];
     *
     * _.nth(array, 1);
     * // => 'b'
     *
     * _.nth(array, -2);
     * // => 'c';
     */
    function nth(array, n) {
      return (array && array.length) ? baseNth(array, toInteger(n)) : undefined;
    }

    /**
     * Removes all given values from `array` using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * **Note:** Unlike `_.without`, this method mutates `array`. Use `_.remove`
     * to remove elements from an array by predicate.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...*} [values] The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
     *
     * _.pull(array, 'a', 'c');
     * console.log(array);
     * // => ['b', 'b']
     */
    var pull = baseRest(pullAll);

    /**
     * This method is like `_.pull` except that it accepts an array of values to remove.
     *
     * **Note:** Unlike `_.difference`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
     *
     * _.pullAll(array, ['a', 'c']);
     * console.log(array);
     * // => ['b', 'b']
     */
    function pullAll(array, values) {
      return (array && array.length && values && values.length)
        ? basePullAll(array, values)
        : array;
    }

    /**
     * This method is like `_.pullAll` except that it accepts `iteratee` which is
     * invoked for each element of `array` and `values` to generate the criterion
     * by which they're compared. The iteratee is invoked with one argument: (value).
     *
     * **Note:** Unlike `_.differenceBy`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [{ 'x': 1 }, { 'x': 2 }, { 'x': 3 }, { 'x': 1 }];
     *
     * _.pullAllBy(array, [{ 'x': 1 }, { 'x': 3 }], 'x');
     * console.log(array);
     * // => [{ 'x': 2 }]
     */
    function pullAllBy(array, values, iteratee) {
      return (array && array.length && values && values.length)
        ? basePullAll(array, values, getIteratee(iteratee, 2))
        : array;
    }

    /**
     * This method is like `_.pullAll` except that it accepts `comparator` which
     * is invoked to compare elements of `array` to `values`. The comparator is
     * invoked with two arguments: (arrVal, othVal).
     *
     * **Note:** Unlike `_.differenceWith`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 4.6.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [{ 'x': 1, 'y': 2 }, { 'x': 3, 'y': 4 }, { 'x': 5, 'y': 6 }];
     *
     * _.pullAllWith(array, [{ 'x': 3, 'y': 4 }], _.isEqual);
     * console.log(array);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 5, 'y': 6 }]
     */
    function pullAllWith(array, values, comparator) {
      return (array && array.length && values && values.length)
        ? basePullAll(array, values, undefined, comparator)
        : array;
    }

    /**
     * Removes elements from `array` corresponding to `indexes` and returns an
     * array of removed elements.
     *
     * **Note:** Unlike `_.at`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...(number|number[])} [indexes] The indexes of elements to remove.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = ['a', 'b', 'c', 'd'];
     * var pulled = _.pullAt(array, [1, 3]);
     *
     * console.log(array);
     * // => ['a', 'c']
     *
     * console.log(pulled);
     * // => ['b', 'd']
     */
    var pullAt = flatRest(function(array, indexes) {
      var length = array == null ? 0 : array.length,
          result = baseAt(array, indexes);

      basePullAt(array, arrayMap(indexes, function(index) {
        return isIndex(index, length) ? +index : index;
      }).sort(compareAscending));

      return result;
    });

    /**
     * Removes all elements from `array` that `predicate` returns truthy for
     * and returns an array of the removed elements. The predicate is invoked
     * with three arguments: (value, index, array).
     *
     * **Note:** Unlike `_.filter`, this method mutates `array`. Use `_.pull`
     * to pull elements from an array by value.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = [1, 2, 3, 4];
     * var evens = _.remove(array, function(n) {
     *   return n % 2 == 0;
     * });
     *
     * console.log(array);
     * // => [1, 3]
     *
     * console.log(evens);
     * // => [2, 4]
     */
    function remove(array, predicate) {
      var result = [];
      if (!(array && array.length)) {
        return result;
      }
      var index = -1,
          indexes = [],
          length = array.length;

      predicate = getIteratee(predicate, 3);
      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result.push(value);
          indexes.push(index);
        }
      }
      basePullAt(array, indexes);
      return result;
    }

    /**
     * Reverses `array` so that the first element becomes the last, the second
     * element becomes the second to last, and so on.
     *
     * **Note:** This method mutates `array` and is based on
     * [`Array#reverse`](https://mdn.io/Array/reverse).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _.reverse(array);
     * // => [3, 2, 1]
     *
     * console.log(array);
     * // => [3, 2, 1]
     */
    function reverse(array) {
      return array == null ? array : nativeReverse.call(array);
    }

    /**
     * Creates a slice of `array` from `start` up to, but not including, `end`.
     *
     * **Note:** This method is used instead of
     * [`Array#slice`](https://mdn.io/Array/slice) to ensure dense arrays are
     * returned.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function slice(array, start, end) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
        start = 0;
        end = length;
      }
      else {
        start = start == null ? 0 : toInteger(start);
        end = end === undefined ? length : toInteger(end);
      }
      return baseSlice(array, start, end);
    }

    /**
     * Uses a binary search to determine the lowest index at which `value`
     * should be inserted into `array` in order to maintain its sort order.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedIndex([30, 50], 40);
     * // => 1
     */
    function sortedIndex(array, value) {
      return baseSortedIndex(array, value);
    }

    /**
     * This method is like `_.sortedIndex` except that it accepts `iteratee`
     * which is invoked for `value` and each element of `array` to compute their
     * sort ranking. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * var objects = [{ 'x': 4 }, { 'x': 5 }];
     *
     * _.sortedIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
     * // => 0
     *
     * // The `_.property` iteratee shorthand.
     * _.sortedIndexBy(objects, { 'x': 4 }, 'x');
     * // => 0
     */
    function sortedIndexBy(array, value, iteratee) {
      return baseSortedIndexBy(array, value, getIteratee(iteratee, 2));
    }

    /**
     * This method is like `_.indexOf` except that it performs a binary
     * search on a sorted `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.sortedIndexOf([4, 5, 5, 5, 6], 5);
     * // => 1
     */
    function sortedIndexOf(array, value) {
      var length = array == null ? 0 : array.length;
      if (length) {
        var index = baseSortedIndex(array, value);
        if (index < length && eq(array[index], value)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * This method is like `_.sortedIndex` except that it returns the highest
     * index at which `value` should be inserted into `array` in order to
     * maintain its sort order.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedLastIndex([4, 5, 5, 5, 6], 5);
     * // => 4
     */
    function sortedLastIndex(array, value) {
      return baseSortedIndex(array, value, true);
    }

    /**
     * This method is like `_.sortedLastIndex` except that it accepts `iteratee`
     * which is invoked for `value` and each element of `array` to compute their
     * sort ranking. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * var objects = [{ 'x': 4 }, { 'x': 5 }];
     *
     * _.sortedLastIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
     * // => 1
     *
     * // The `_.property` iteratee shorthand.
     * _.sortedLastIndexBy(objects, { 'x': 4 }, 'x');
     * // => 1
     */
    function sortedLastIndexBy(array, value, iteratee) {
      return baseSortedIndexBy(array, value, getIteratee(iteratee, 2), true);
    }

    /**
     * This method is like `_.lastIndexOf` except that it performs a binary
     * search on a sorted `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.sortedLastIndexOf([4, 5, 5, 5, 6], 5);
     * // => 3
     */
    function sortedLastIndexOf(array, value) {
      var length = array == null ? 0 : array.length;
      if (length) {
        var index = baseSortedIndex(array, value, true) - 1;
        if (eq(array[index], value)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * This method is like `_.uniq` except that it's designed and optimized
     * for sorted arrays.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.sortedUniq([1, 1, 2]);
     * // => [1, 2]
     */
    function sortedUniq(array) {
      return (array && array.length)
        ? baseSortedUniq(array)
        : [];
    }

    /**
     * This method is like `_.uniqBy` except that it's designed and optimized
     * for sorted arrays.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.sortedUniqBy([1.1, 1.2, 2.3, 2.4], Math.floor);
     * // => [1.1, 2.3]
     */
    function sortedUniqBy(array, iteratee) {
      return (array && array.length)
        ? baseSortedUniq(array, getIteratee(iteratee, 2))
        : [];
    }

    /**
     * Gets all but the first element of `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.tail([1, 2, 3]);
     * // => [2, 3]
     */
    function tail(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseSlice(array, 1, length) : [];
    }

    /**
     * Creates a slice of `array` with `n` elements taken from the beginning.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.take([1, 2, 3]);
     * // => [1]
     *
     * _.take([1, 2, 3], 2);
     * // => [1, 2]
     *
     * _.take([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.take([1, 2, 3], 0);
     * // => []
     */
    function take(array, n, guard) {
      if (!(array && array.length)) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` with `n` elements taken from the end.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeRight([1, 2, 3]);
     * // => [3]
     *
     * _.takeRight([1, 2, 3], 2);
     * // => [2, 3]
     *
     * _.takeRight([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.takeRight([1, 2, 3], 0);
     * // => []
     */
    function takeRight(array, n, guard) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      n = length - n;
      return baseSlice(array, n < 0 ? 0 : n, length);
    }

    /**
     * Creates a slice of `array` with elements taken from the end. Elements are
     * taken until `predicate` returns falsey. The predicate is invoked with
     * three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.takeRightWhile(users, function(o) { return !o.active; });
     * // => objects for ['fred', 'pebbles']
     *
     * // The `_.matches` iteratee shorthand.
     * _.takeRightWhile(users, { 'user': 'pebbles', 'active': false });
     * // => objects for ['pebbles']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.takeRightWhile(users, ['active', false]);
     * // => objects for ['fred', 'pebbles']
     *
     * // The `_.property` iteratee shorthand.
     * _.takeRightWhile(users, 'active');
     * // => []
     */
    function takeRightWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3), false, true)
        : [];
    }

    /**
     * Creates a slice of `array` with elements taken from the beginning. Elements
     * are taken until `predicate` returns falsey. The predicate is invoked with
     * three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.takeWhile(users, function(o) { return !o.active; });
     * // => objects for ['barney', 'fred']
     *
     * // The `_.matches` iteratee shorthand.
     * _.takeWhile(users, { 'user': 'barney', 'active': false });
     * // => objects for ['barney']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.takeWhile(users, ['active', false]);
     * // => objects for ['barney', 'fred']
     *
     * // The `_.property` iteratee shorthand.
     * _.takeWhile(users, 'active');
     * // => []
     */
    function takeWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3))
        : [];
    }

    /**
     * Creates an array of unique values, in order, from all given arrays using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * _.union([2], [1, 2]);
     * // => [2, 1]
     */
    var union = baseRest(function(arrays) {
      return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
    });

    /**
     * This method is like `_.union` except that it accepts `iteratee` which is
     * invoked for each element of each `arrays` to generate the criterion by
     * which uniqueness is computed. Result values are chosen from the first
     * array in which the value occurs. The iteratee is invoked with one argument:
     * (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * _.unionBy([2.1], [1.2, 2.3], Math.floor);
     * // => [2.1, 1.2]
     *
     * // The `_.property` iteratee shorthand.
     * _.unionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    var unionBy = baseRest(function(arrays) {
      var iteratee = last(arrays);
      if (isArrayLikeObject(iteratee)) {
        iteratee = undefined;
      }
      return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), getIteratee(iteratee, 2));
    });

    /**
     * This method is like `_.union` except that it accepts `comparator` which
     * is invoked to compare elements of `arrays`. Result values are chosen from
     * the first array in which the value occurs. The comparator is invoked
     * with two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.unionWith(objects, others, _.isEqual);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
     */
    var unionWith = baseRest(function(arrays) {
      var comparator = last(arrays);
      comparator = typeof comparator == 'function' ? comparator : undefined;
      return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined, comparator);
    });

    /**
     * Creates a duplicate-free version of an array, using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons, in which only the first occurrence of each element
     * is kept. The order of result values is determined by the order they occur
     * in the array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.uniq([2, 1, 2]);
     * // => [2, 1]
     */
    function uniq(array) {
      return (array && array.length) ? baseUniq(array) : [];
    }

    /**
     * This method is like `_.uniq` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the criterion by which
     * uniqueness is computed. The order of result values is determined by the
     * order they occur in the array. The iteratee is invoked with one argument:
     * (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.uniqBy([2.1, 1.2, 2.3], Math.floor);
     * // => [2.1, 1.2]
     *
     * // The `_.property` iteratee shorthand.
     * _.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    function uniqBy(array, iteratee) {
      return (array && array.length) ? baseUniq(array, getIteratee(iteratee, 2)) : [];
    }

    /**
     * This method is like `_.uniq` except that it accepts `comparator` which
     * is invoked to compare elements of `array`. The order of result values is
     * determined by the order they occur in the array.The comparator is invoked
     * with two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.uniqWith(objects, _.isEqual);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }]
     */
    function uniqWith(array, comparator) {
      comparator = typeof comparator == 'function' ? comparator : undefined;
      return (array && array.length) ? baseUniq(array, undefined, comparator) : [];
    }

    /**
     * This method is like `_.zip` except that it accepts an array of grouped
     * elements and creates an array regrouping the elements to their pre-zip
     * configuration.
     *
     * @static
     * @memberOf _
     * @since 1.2.0
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip(['a', 'b'], [1, 2], [true, false]);
     * // => [['a', 1, true], ['b', 2, false]]
     *
     * _.unzip(zipped);
     * // => [['a', 'b'], [1, 2], [true, false]]
     */
    function unzip(array) {
      if (!(array && array.length)) {
        return [];
      }
      var length = 0;
      array = arrayFilter(array, function(group) {
        if (isArrayLikeObject(group)) {
          length = nativeMax(group.length, length);
          return true;
        }
      });
      return baseTimes(length, function(index) {
        return arrayMap(array, baseProperty(index));
      });
    }

    /**
     * This method is like `_.unzip` except that it accepts `iteratee` to specify
     * how regrouped values should be combined. The iteratee is invoked with the
     * elements of each group: (...group).
     *
     * @static
     * @memberOf _
     * @since 3.8.0
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @param {Function} [iteratee=_.identity] The function to combine
     *  regrouped values.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip([1, 2], [10, 20], [100, 200]);
     * // => [[1, 10, 100], [2, 20, 200]]
     *
     * _.unzipWith(zipped, _.add);
     * // => [3, 30, 300]
     */
    function unzipWith(array, iteratee) {
      if (!(array && array.length)) {
        return [];
      }
      var result = unzip(array);
      if (iteratee == null) {
        return result;
      }
      return arrayMap(result, function(group) {
        return apply(iteratee, undefined, group);
      });
    }

    /**
     * Creates an array excluding all given values using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * **Note:** Unlike `_.pull`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...*} [values] The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @see _.difference, _.xor
     * @example
     *
     * _.without([2, 1, 2, 3], 1, 2);
     * // => [3]
     */
    var without = baseRest(function(array, values) {
      return isArrayLikeObject(array)
        ? baseDifference(array, values)
        : [];
    });

    /**
     * Creates an array of unique values that is the
     * [symmetric difference](https://en.wikipedia.org/wiki/Symmetric_difference)
     * of the given arrays. The order of result values is determined by the order
     * they occur in the arrays.
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of filtered values.
     * @see _.difference, _.without
     * @example
     *
     * _.xor([2, 1], [2, 3]);
     * // => [1, 3]
     */
    var xor = baseRest(function(arrays) {
      return baseXor(arrayFilter(arrays, isArrayLikeObject));
    });

    /**
     * This method is like `_.xor` except that it accepts `iteratee` which is
     * invoked for each element of each `arrays` to generate the criterion by
     * which by which they're compared. The order of result values is determined
     * by the order they occur in the arrays. The iteratee is invoked with one
     * argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.xorBy([2.1, 1.2], [2.3, 3.4], Math.floor);
     * // => [1.2, 3.4]
     *
     * // The `_.property` iteratee shorthand.
     * _.xorBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 2 }]
     */
    var xorBy = baseRest(function(arrays) {
      var iteratee = last(arrays);
      if (isArrayLikeObject(iteratee)) {
        iteratee = undefined;
      }
      return baseXor(arrayFilter(arrays, isArrayLikeObject), getIteratee(iteratee, 2));
    });

    /**
     * This method is like `_.xor` except that it accepts `comparator` which is
     * invoked to compare elements of `arrays`. The order of result values is
     * determined by the order they occur in the arrays. The comparator is invoked
     * with two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.xorWith(objects, others, _.isEqual);
     * // => [{ 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
     */
    var xorWith = baseRest(function(arrays) {
      var comparator = last(arrays);
      comparator = typeof comparator == 'function' ? comparator : undefined;
      return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined, comparator);
    });

    /**
     * Creates an array of grouped elements, the first of which contains the
     * first elements of the given arrays, the second of which contains the
     * second elements of the given arrays, and so on.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zip(['a', 'b'], [1, 2], [true, false]);
     * // => [['a', 1, true], ['b', 2, false]]
     */
    var zip = baseRest(unzip);

    /**
     * This method is like `_.fromPairs` except that it accepts two arrays,
     * one of property identifiers and one of corresponding values.
     *
     * @static
     * @memberOf _
     * @since 0.4.0
     * @category Array
     * @param {Array} [props=[]] The property identifiers.
     * @param {Array} [values=[]] The property values.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.zipObject(['a', 'b'], [1, 2]);
     * // => { 'a': 1, 'b': 2 }
     */
    function zipObject(props, values) {
      return baseZipObject(props || [], values || [], assignValue);
    }

    /**
     * This method is like `_.zipObject` except that it supports property paths.
     *
     * @static
     * @memberOf _
     * @since 4.1.0
     * @category Array
     * @param {Array} [props=[]] The property identifiers.
     * @param {Array} [values=[]] The property values.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.zipObjectDeep(['a.b[0].c', 'a.b[1].d'], [1, 2]);
     * // => { 'a': { 'b': [{ 'c': 1 }, { 'd': 2 }] } }
     */
    function zipObjectDeep(props, values) {
      return baseZipObject(props || [], values || [], baseSet);
    }

    /**
     * This method is like `_.zip` except that it accepts `iteratee` to specify
     * how grouped values should be combined. The iteratee is invoked with the
     * elements of each group: (...group).
     *
     * @static
     * @memberOf _
     * @since 3.8.0
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @param {Function} [iteratee=_.identity] The function to combine
     *  grouped values.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zipWith([1, 2], [10, 20], [100, 200], function(a, b, c) {
     *   return a + b + c;
     * });
     * // => [111, 222]
     */
    var zipWith = baseRest(function(arrays) {
      var length = arrays.length,
          iteratee = length > 1 ? arrays[length - 1] : undefined;

      iteratee = typeof iteratee == 'function' ? (arrays.pop(), iteratee) : undefined;
      return unzipWith(arrays, iteratee);
    });

    /*------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` wrapper instance that wraps `value` with explicit method
     * chain sequences enabled. The result of such sequences must be unwrapped
     * with `_#value`.
     *
     * @static
     * @memberOf _
     * @since 1.3.0
     * @category Seq
     * @param {*} value The value to wrap.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36 },
     *   { 'user': 'fred',    'age': 40 },
     *   { 'user': 'pebbles', 'age': 1 }
     * ];
     *
     * var youngest = _
     *   .chain(users)
     *   .sortBy('age')
     *   .map(function(o) {
     *     return o.user + ' is ' + o.age;
     *   })
     *   .head()
     *   .value();
     * // => 'pebbles is 1'
     */
    function chain(value) {
      var result = lodash(value);
      result.__chain__ = true;
      return result;
    }

    /**
     * This method invokes `interceptor` and returns `value`. The interceptor
     * is invoked with one argument; (value). The purpose of this method is to
     * "tap into" a method chain sequence in order to modify intermediate results.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Seq
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @returns {*} Returns `value`.
     * @example
     *
     * _([1, 2, 3])
     *  .tap(function(array) {
     *    // Mutate input array.
     *    array.pop();
     *  })
     *  .reverse()
     *  .value();
     * // => [2, 1]
     */
    function tap(value, interceptor) {
      interceptor(value);
      return value;
    }

    /**
     * This method is like `_.tap` except that it returns the result of `interceptor`.
     * The purpose of this method is to "pass thru" values replacing intermediate
     * results in a method chain sequence.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Seq
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @returns {*} Returns the result of `interceptor`.
     * @example
     *
     * _('  abc  ')
     *  .chain()
     *  .trim()
     *  .thru(function(value) {
     *    return [value];
     *  })
     *  .value();
     * // => ['abc']
     */
    function thru(value, interceptor) {
      return interceptor(value);
    }

    /**
     * This method is the wrapper version of `_.at`.
     *
     * @name at
     * @memberOf _
     * @since 1.0.0
     * @category Seq
     * @param {...(string|string[])} [paths] The property paths to pick.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
     *
     * _(object).at(['a[0].b.c', 'a[1]']).value();
     * // => [3, 4]
     */
    var wrapperAt = flatRest(function(paths) {
      var length = paths.length,
          start = length ? paths[0] : 0,
          value = this.__wrapped__,
          interceptor = function(object) { return baseAt(object, paths); };

      if (length > 1 || this.__actions__.length ||
          !(value instanceof LazyWrapper) || !isIndex(start)) {
        return this.thru(interceptor);
      }
      value = value.slice(start, +start + (length ? 1 : 0));
      value.__actions__.push({
        'func': thru,
        'args': [interceptor],
        'thisArg': undefined
      });
      return new LodashWrapper(value, this.__chain__).thru(function(array) {
        if (length && !array.length) {
          array.push(undefined);
        }
        return array;
      });
    });

    /**
     * Creates a `lodash` wrapper instance with explicit method chain sequences enabled.
     *
     * @name chain
     * @memberOf _
     * @since 0.1.0
     * @category Seq
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * // A sequence without explicit chaining.
     * _(users).head();
     * // => { 'user': 'barney', 'age': 36 }
     *
     * // A sequence with explicit chaining.
     * _(users)
     *   .chain()
     *   .head()
     *   .pick('user')
     *   .value();
     * // => { 'user': 'barney' }
     */
    function wrapperChain() {
      return chain(this);
    }

    /**
     * Executes the chain sequence and returns the wrapped result.
     *
     * @name commit
     * @memberOf _
     * @since 3.2.0
     * @category Seq
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2];
     * var wrapped = _(array).push(3);
     *
     * console.log(array);
     * // => [1, 2]
     *
     * wrapped = wrapped.commit();
     * console.log(array);
     * // => [1, 2, 3]
     *
     * wrapped.last();
     * // => 3
     *
     * console.log(array);
     * // => [1, 2, 3]
     */
    function wrapperCommit() {
      return new LodashWrapper(this.value(), this.__chain__);
    }

    /**
     * Gets the next value on a wrapped object following the
     * [iterator protocol](https://mdn.io/iteration_protocols#iterator).
     *
     * @name next
     * @memberOf _
     * @since 4.0.0
     * @category Seq
     * @returns {Object} Returns the next iterator value.
     * @example
     *
     * var wrapped = _([1, 2]);
     *
     * wrapped.next();
     * // => { 'done': false, 'value': 1 }
     *
     * wrapped.next();
     * // => { 'done': false, 'value': 2 }
     *
     * wrapped.next();
     * // => { 'done': true, 'value': undefined }
     */
    function wrapperNext() {
      if (this.__values__ === undefined) {
        this.__values__ = toArray(this.value());
      }
      var done = this.__index__ >= this.__values__.length,
          value = done ? undefined : this.__values__[this.__index__++];

      return { 'done': done, 'value': value };
    }

    /**
     * Enables the wrapper to be iterable.
     *
     * @name Symbol.iterator
     * @memberOf _
     * @since 4.0.0
     * @category Seq
     * @returns {Object} Returns the wrapper object.
     * @example
     *
     * var wrapped = _([1, 2]);
     *
     * wrapped[Symbol.iterator]() === wrapped;
     * // => true
     *
     * Array.from(wrapped);
     * // => [1, 2]
     */
    function wrapperToIterator() {
      return this;
    }

    /**
     * Creates a clone of the chain sequence planting `value` as the wrapped value.
     *
     * @name plant
     * @memberOf _
     * @since 3.2.0
     * @category Seq
     * @param {*} value The value to plant.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var wrapped = _([1, 2]).map(square);
     * var other = wrapped.plant([3, 4]);
     *
     * other.value();
     * // => [9, 16]
     *
     * wrapped.value();
     * // => [1, 4]
     */
    function wrapperPlant(value) {
      var result,
          parent = this;

      while (parent instanceof baseLodash) {
        var clone = wrapperClone(parent);
        clone.__index__ = 0;
        clone.__values__ = undefined;
        if (result) {
          previous.__wrapped__ = clone;
        } else {
          result = clone;
        }
        var previous = clone;
        parent = parent.__wrapped__;
      }
      previous.__wrapped__ = value;
      return result;
    }

    /**
     * This method is the wrapper version of `_.reverse`.
     *
     * **Note:** This method mutates the wrapped array.
     *
     * @name reverse
     * @memberOf _
     * @since 0.1.0
     * @category Seq
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _(array).reverse().value()
     * // => [3, 2, 1]
     *
     * console.log(array);
     * // => [3, 2, 1]
     */
    function wrapperReverse() {
      var value = this.__wrapped__;
      if (value instanceof LazyWrapper) {
        var wrapped = value;
        if (this.__actions__.length) {
          wrapped = new LazyWrapper(this);
        }
        wrapped = wrapped.reverse();
        wrapped.__actions__.push({
          'func': thru,
          'args': [reverse],
          'thisArg': undefined
        });
        return new LodashWrapper(wrapped, this.__chain__);
      }
      return this.thru(reverse);
    }

    /**
     * Executes the chain sequence to resolve the unwrapped value.
     *
     * @name value
     * @memberOf _
     * @since 0.1.0
     * @alias toJSON, valueOf
     * @category Seq
     * @returns {*} Returns the resolved unwrapped value.
     * @example
     *
     * _([1, 2, 3]).value();
     * // => [1, 2, 3]
     */
    function wrapperValue() {
      return baseWrapperValue(this.__wrapped__, this.__actions__);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` thru `iteratee`. The corresponding value of
     * each key is the number of times the key was returned by `iteratee`. The
     * iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 0.5.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.countBy([6.1, 4.2, 6.3], Math.floor);
     * // => { '4': 1, '6': 2 }
     *
     * // The `_.property` iteratee shorthand.
     * _.countBy(['one', 'two', 'three'], 'length');
     * // => { '3': 2, '5': 1 }
     */
    var countBy = createAggregator(function(result, value, key) {
      if (hasOwnProperty.call(result, key)) {
        ++result[key];
      } else {
        baseAssignValue(result, key, 1);
      }
    });

    /**
     * Checks if `predicate` returns truthy for **all** elements of `collection`.
     * Iteration is stopped once `predicate` returns falsey. The predicate is
     * invoked with three arguments: (value, index|key, collection).
     *
     * **Note:** This method returns `true` for
     * [empty collections](https://en.wikipedia.org/wiki/Empty_set) because
     * [everything is true](https://en.wikipedia.org/wiki/Vacuous_truth) of
     * elements of empty collections.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`.
     * @example
     *
     * _.every([true, 1, null, 'yes'], Boolean);
     * // => false
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * // The `_.matches` iteratee shorthand.
     * _.every(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.every(users, ['active', false]);
     * // => true
     *
     * // The `_.property` iteratee shorthand.
     * _.every(users, 'active');
     * // => false
     */
    function every(collection, predicate, guard) {
      var func = isArray(collection) ? arrayEvery : baseEvery;
      if (guard && isIterateeCall(collection, predicate, guard)) {
        predicate = undefined;
      }
      return func(collection, getIteratee(predicate, 3));
    }

    /**
     * Iterates over elements of `collection`, returning an array of all elements
     * `predicate` returns truthy for. The predicate is invoked with three
     * arguments: (value, index|key, collection).
     *
     * **Note:** Unlike `_.remove`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     * @see _.reject
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * _.filter(users, function(o) { return !o.active; });
     * // => objects for ['fred']
     *
     * // The `_.matches` iteratee shorthand.
     * _.filter(users, { 'age': 36, 'active': true });
     * // => objects for ['barney']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.filter(users, ['active', false]);
     * // => objects for ['fred']
     *
     * // The `_.property` iteratee shorthand.
     * _.filter(users, 'active');
     * // => objects for ['barney']
     */
    function filter(collection, predicate) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      return func(collection, getIteratee(predicate, 3));
    }

    /**
     * Iterates over elements of `collection`, returning the first element
     * `predicate` returns truthy for. The predicate is invoked with three
     * arguments: (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': true },
     *   { 'user': 'fred',    'age': 40, 'active': false },
     *   { 'user': 'pebbles', 'age': 1,  'active': true }
     * ];
     *
     * _.find(users, function(o) { return o.age < 40; });
     * // => object for 'barney'
     *
     * // The `_.matches` iteratee shorthand.
     * _.find(users, { 'age': 1, 'active': true });
     * // => object for 'pebbles'
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.find(users, ['active', false]);
     * // => object for 'fred'
     *
     * // The `_.property` iteratee shorthand.
     * _.find(users, 'active');
     * // => object for 'barney'
     */
    var find = createFind(findIndex);

    /**
     * This method is like `_.find` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param {number} [fromIndex=collection.length-1] The index to search from.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * _.findLast([1, 2, 3, 4], function(n) {
     *   return n % 2 == 1;
     * });
     * // => 3
     */
    var findLast = createFind(findLastIndex);

    /**
     * Creates a flattened array of values by running each element in `collection`
     * thru `iteratee` and flattening the mapped results. The iteratee is invoked
     * with three arguments: (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * function duplicate(n) {
     *   return [n, n];
     * }
     *
     * _.flatMap([1, 2], duplicate);
     * // => [1, 1, 2, 2]
     */
    function flatMap(collection, iteratee) {
      return baseFlatten(map(collection, iteratee), 1);
    }

    /**
     * This method is like `_.flatMap` except that it recursively flattens the
     * mapped results.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * function duplicate(n) {
     *   return [[[n, n]]];
     * }
     *
     * _.flatMapDeep([1, 2], duplicate);
     * // => [1, 1, 2, 2]
     */
    function flatMapDeep(collection, iteratee) {
      return baseFlatten(map(collection, iteratee), INFINITY);
    }

    /**
     * This method is like `_.flatMap` except that it recursively flattens the
     * mapped results up to `depth` times.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {number} [depth=1] The maximum recursion depth.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * function duplicate(n) {
     *   return [[[n, n]]];
     * }
     *
     * _.flatMapDepth([1, 2], duplicate, 2);
     * // => [[1, 1], [2, 2]]
     */
    function flatMapDepth(collection, iteratee, depth) {
      depth = depth === undefined ? 1 : toInteger(depth);
      return baseFlatten(map(collection, iteratee), depth);
    }

    /**
     * Iterates over elements of `collection` and invokes `iteratee` for each element.
     * The iteratee is invoked with three arguments: (value, index|key, collection).
     * Iteratee functions may exit iteration early by explicitly returning `false`.
     *
     * **Note:** As with other "Collections" methods, objects with a "length"
     * property are iterated like arrays. To avoid this behavior use `_.forIn`
     * or `_.forOwn` for object iteration.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @alias each
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     * @see _.forEachRight
     * @example
     *
     * _.forEach([1, 2], function(value) {
     *   console.log(value);
     * });
     * // => Logs `1` then `2`.
     *
     * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'a' then 'b' (iteration order is not guaranteed).
     */
    function forEach(collection, iteratee) {
      var func = isArray(collection) ? arrayEach : baseEach;
      return func(collection, getIteratee(iteratee, 3));
    }

    /**
     * This method is like `_.forEach` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @alias eachRight
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     * @see _.forEach
     * @example
     *
     * _.forEachRight([1, 2], function(value) {
     *   console.log(value);
     * });
     * // => Logs `2` then `1`.
     */
    function forEachRight(collection, iteratee) {
      var func = isArray(collection) ? arrayEachRight : baseEachRight;
      return func(collection, getIteratee(iteratee, 3));
    }

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` thru `iteratee`. The order of grouped values
     * is determined by the order they occur in `collection`. The corresponding
     * value of each key is an array of elements responsible for generating the
     * key. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.groupBy([6.1, 4.2, 6.3], Math.floor);
     * // => { '4': [4.2], '6': [6.1, 6.3] }
     *
     * // The `_.property` iteratee shorthand.
     * _.groupBy(['one', 'two', 'three'], 'length');
     * // => { '3': ['one', 'two'], '5': ['three'] }
     */
    var groupBy = createAggregator(function(result, value, key) {
      if (hasOwnProperty.call(result, key)) {
        result[key].push(value);
      } else {
        baseAssignValue(result, key, [value]);
      }
    });

    /**
     * Checks if `value` is in `collection`. If `collection` is a string, it's
     * checked for a substring of `value`, otherwise
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * is used for equality comparisons. If `fromIndex` is negative, it's used as
     * the offset from the end of `collection`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object|string} collection The collection to inspect.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=0] The index to search from.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
     * @returns {boolean} Returns `true` if `value` is found, else `false`.
     * @example
     *
     * _.includes([1, 2, 3], 1);
     * // => true
     *
     * _.includes([1, 2, 3], 1, 2);
     * // => false
     *
     * _.includes({ 'a': 1, 'b': 2 }, 1);
     * // => true
     *
     * _.includes('abcd', 'bc');
     * // => true
     */
    function includes(collection, value, fromIndex, guard) {
      collection = isArrayLike(collection) ? collection : values(collection);
      fromIndex = (fromIndex && !guard) ? toInteger(fromIndex) : 0;

      var length = collection.length;
      if (fromIndex < 0) {
        fromIndex = nativeMax(length + fromIndex, 0);
      }
      return isString(collection)
        ? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)
        : (!!length && baseIndexOf(collection, value, fromIndex) > -1);
    }

    /**
     * Invokes the method at `path` of each element in `collection`, returning
     * an array of the results of each invoked method. Any additional arguments
     * are provided to each invoked method. If `path` is a function, it's invoked
     * for, and `this` bound to, each element in `collection`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Array|Function|string} path The path of the method to invoke or
     *  the function invoked per iteration.
     * @param {...*} [args] The arguments to invoke each method with.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * _.invokeMap([[5, 1, 7], [3, 2, 1]], 'sort');
     * // => [[1, 5, 7], [1, 2, 3]]
     *
     * _.invokeMap([123, 456], String.prototype.split, '');
     * // => [['1', '2', '3'], ['4', '5', '6']]
     */
    var invokeMap = baseRest(function(collection, path, args) {
      var index = -1,
          isFunc = typeof path == 'function',
          result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function(value) {
        result[++index] = isFunc ? apply(path, value, args) : baseInvoke(value, path, args);
      });
      return result;
    });

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` thru `iteratee`. The corresponding value of
     * each key is the last element responsible for generating the key. The
     * iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * var array = [
     *   { 'dir': 'left', 'code': 97 },
     *   { 'dir': 'right', 'code': 100 }
     * ];
     *
     * _.keyBy(array, function(o) {
     *   return String.fromCharCode(o.code);
     * });
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     *
     * _.keyBy(array, 'dir');
     * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
     */
    var keyBy = createAggregator(function(result, value, key) {
      baseAssignValue(result, key, value);
    });

    /**
     * Creates an array of values by running each element in `collection` thru
     * `iteratee`. The iteratee is invoked with three arguments:
     * (value, index|key, collection).
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
     *
     * The guarded methods are:
     * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
     * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
     * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
     * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * _.map([4, 8], square);
     * // => [16, 64]
     *
     * _.map({ 'a': 4, 'b': 8 }, square);
     * // => [16, 64] (iteration order is not guaranteed)
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * // The `_.property` iteratee shorthand.
     * _.map(users, 'user');
     * // => ['barney', 'fred']
     */
    function map(collection, iteratee) {
      var func = isArray(collection) ? arrayMap : baseMap;
      return func(collection, getIteratee(iteratee, 3));
    }

    /**
     * This method is like `_.sortBy` except that it allows specifying the sort
     * orders of the iteratees to sort by. If `orders` is unspecified, all values
     * are sorted in ascending order. Otherwise, specify an order of "desc" for
     * descending or "asc" for ascending sort order of corresponding values.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Array[]|Function[]|Object[]|string[]} [iteratees=[_.identity]]
     *  The iteratees to sort by.
     * @param {string[]} [orders] The sort orders of `iteratees`.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 34 },
     *   { 'user': 'fred',   'age': 40 },
     *   { 'user': 'barney', 'age': 36 }
     * ];
     *
     * // Sort by `user` in ascending order and by `age` in descending order.
     * _.orderBy(users, ['user', 'age'], ['asc', 'desc']);
     * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
     */
    function orderBy(collection, iteratees, orders, guard) {
      if (collection == null) {
        return [];
      }
      if (!isArray(iteratees)) {
        iteratees = iteratees == null ? [] : [iteratees];
      }
      orders = guard ? undefined : orders;
      if (!isArray(orders)) {
        orders = orders == null ? [] : [orders];
      }
      return baseOrderBy(collection, iteratees, orders);
    }

    /**
     * Creates an array of elements split into two groups, the first of which
     * contains elements `predicate` returns truthy for, the second of which
     * contains elements `predicate` returns falsey for. The predicate is
     * invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the array of grouped elements.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': false },
     *   { 'user': 'fred',    'age': 40, 'active': true },
     *   { 'user': 'pebbles', 'age': 1,  'active': false }
     * ];
     *
     * _.partition(users, function(o) { return o.active; });
     * // => objects for [['fred'], ['barney', 'pebbles']]
     *
     * // The `_.matches` iteratee shorthand.
     * _.partition(users, { 'age': 1, 'active': false });
     * // => objects for [['pebbles'], ['barney', 'fred']]
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.partition(users, ['active', false]);
     * // => objects for [['barney', 'pebbles'], ['fred']]
     *
     * // The `_.property` iteratee shorthand.
     * _.partition(users, 'active');
     * // => objects for [['fred'], ['barney', 'pebbles']]
     */
    var partition = createAggregator(function(result, value, key) {
      result[key ? 0 : 1].push(value);
    }, function() { return [[], []]; });

    /**
     * Reduces `collection` to a value which is the accumulated result of running
     * each element in `collection` thru `iteratee`, where each successive
     * invocation is supplied the return value of the previous. If `accumulator`
     * is not given, the first element of `collection` is used as the initial
     * value. The iteratee is invoked with four arguments:
     * (accumulator, value, index|key, collection).
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.reduce`, `_.reduceRight`, and `_.transform`.
     *
     * The guarded methods are:
     * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
     * and `sortBy`
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @returns {*} Returns the accumulated value.
     * @see _.reduceRight
     * @example
     *
     * _.reduce([1, 2], function(sum, n) {
     *   return sum + n;
     * }, 0);
     * // => 3
     *
     * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
     *   (result[value] || (result[value] = [])).push(key);
     *   return result;
     * }, {});
     * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
     */
    function reduce(collection, iteratee, accumulator) {
      var func = isArray(collection) ? arrayReduce : baseReduce,
          initAccum = arguments.length < 3;

      return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEach);
    }

    /**
     * This method is like `_.reduce` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @returns {*} Returns the accumulated value.
     * @see _.reduce
     * @example
     *
     * var array = [[0, 1], [2, 3], [4, 5]];
     *
     * _.reduceRight(array, function(flattened, other) {
     *   return flattened.concat(other);
     * }, []);
     * // => [4, 5, 2, 3, 0, 1]
     */
    function reduceRight(collection, iteratee, accumulator) {
      var func = isArray(collection) ? arrayReduceRight : baseReduce,
          initAccum = arguments.length < 3;

      return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEachRight);
    }

    /**
     * The opposite of `_.filter`; this method returns the elements of `collection`
     * that `predicate` does **not** return truthy for.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     * @see _.filter
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false },
     *   { 'user': 'fred',   'age': 40, 'active': true }
     * ];
     *
     * _.reject(users, function(o) { return !o.active; });
     * // => objects for ['fred']
     *
     * // The `_.matches` iteratee shorthand.
     * _.reject(users, { 'age': 40, 'active': true });
     * // => objects for ['barney']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.reject(users, ['active', false]);
     * // => objects for ['fred']
     *
     * // The `_.property` iteratee shorthand.
     * _.reject(users, 'active');
     * // => objects for ['barney']
     */
    function reject(collection, predicate) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      return func(collection, negate(getIteratee(predicate, 3)));
    }

    /**
     * Gets a random element from `collection`.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to sample.
     * @returns {*} Returns the random element.
     * @example
     *
     * _.sample([1, 2, 3, 4]);
     * // => 2
     */
    function sample(collection) {
      var func = isArray(collection) ? arraySample : baseSample;
      return func(collection);
    }

    /**
     * Gets `n` random elements at unique keys from `collection` up to the
     * size of `collection`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to sample.
     * @param {number} [n=1] The number of elements to sample.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the random elements.
     * @example
     *
     * _.sampleSize([1, 2, 3], 2);
     * // => [3, 1]
     *
     * _.sampleSize([1, 2, 3], 4);
     * // => [2, 3, 1]
     */
    function sampleSize(collection, n, guard) {
      if ((guard ? isIterateeCall(collection, n, guard) : n === undefined)) {
        n = 1;
      } else {
        n = toInteger(n);
      }
      var func = isArray(collection) ? arraySampleSize : baseSampleSize;
      return func(collection, n);
    }

    /**
     * Creates an array of shuffled values, using a version of the
     * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to shuffle.
     * @returns {Array} Returns the new shuffled array.
     * @example
     *
     * _.shuffle([1, 2, 3, 4]);
     * // => [4, 1, 3, 2]
     */
    function shuffle(collection) {
      var func = isArray(collection) ? arrayShuffle : baseShuffle;
      return func(collection);
    }

    /**
     * Gets the size of `collection` by returning its length for array-like
     * values or the number of own enumerable string keyed properties for objects.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object|string} collection The collection to inspect.
     * @returns {number} Returns the collection size.
     * @example
     *
     * _.size([1, 2, 3]);
     * // => 3
     *
     * _.size({ 'a': 1, 'b': 2 });
     * // => 2
     *
     * _.size('pebbles');
     * // => 7
     */
    function size(collection) {
      if (collection == null) {
        return 0;
      }
      if (isArrayLike(collection)) {
        return isString(collection) ? stringSize(collection) : collection.length;
      }
      var tag = getTag(collection);
      if (tag == mapTag || tag == setTag) {
        return collection.size;
      }
      return baseKeys(collection).length;
    }

    /**
     * Checks if `predicate` returns truthy for **any** element of `collection`.
     * Iteration is stopped once `predicate` returns truthy. The predicate is
     * invoked with three arguments: (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     * @example
     *
     * _.some([null, 0, 'yes', false], Boolean);
     * // => true
     *
     * var users = [
     *   { 'user': 'barney', 'active': true },
     *   { 'user': 'fred',   'active': false }
     * ];
     *
     * // The `_.matches` iteratee shorthand.
     * _.some(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.some(users, ['active', false]);
     * // => true
     *
     * // The `_.property` iteratee shorthand.
     * _.some(users, 'active');
     * // => true
     */
    function some(collection, predicate, guard) {
      var func = isArray(collection) ? arraySome : baseSome;
      if (guard && isIterateeCall(collection, predicate, guard)) {
        predicate = undefined;
      }
      return func(collection, getIteratee(predicate, 3));
    }

    /**
     * Creates an array of elements, sorted in ascending order by the results of
     * running each element in a collection thru each iteratee. This method
     * performs a stable sort, that is, it preserves the original sort order of
     * equal elements. The iteratees are invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {...(Function|Function[])} [iteratees=[_.identity]]
     *  The iteratees to sort by.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 },
     *   { 'user': 'barney', 'age': 34 }
     * ];
     *
     * _.sortBy(users, [function(o) { return o.user; }]);
     * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
     *
     * _.sortBy(users, ['user', 'age']);
     * // => objects for [['barney', 34], ['barney', 36], ['fred', 40], ['fred', 48]]
     */
    var sortBy = baseRest(function(collection, iteratees) {
      if (collection == null) {
        return [];
      }
      var length = iteratees.length;
      if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
        iteratees = [];
      } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
        iteratees = [iteratees[0]];
      }
      return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
    });

    /*------------------------------------------------------------------------*/

    /**
     * Gets the timestamp of the number of milliseconds that have elapsed since
     * the Unix epoch (1 January 1970 00:00:00 UTC).
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Date
     * @returns {number} Returns the timestamp.
     * @example
     *
     * _.defer(function(stamp) {
     *   console.log(_.now() - stamp);
     * }, _.now());
     * // => Logs the number of milliseconds it took for the deferred invocation.
     */
    var now = ctxNow || function() {
      return root.Date.now();
    };

    /*------------------------------------------------------------------------*/

    /**
     * The opposite of `_.before`; this method creates a function that invokes
     * `func` once it's called `n` or more times.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {number} n The number of calls before `func` is invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var saves = ['profile', 'settings'];
     *
     * var done = _.after(saves.length, function() {
     *   console.log('done saving!');
     * });
     *
     * _.forEach(saves, function(type) {
     *   asyncSave({ 'type': type, 'complete': done });
     * });
     * // => Logs 'done saving!' after the two async saves have completed.
     */
    function after(n, func) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      n = toInteger(n);
      return function() {
        if (--n < 1) {
          return func.apply(this, arguments);
        }
      };
    }

    /**
     * Creates a function that invokes `func`, with up to `n` arguments,
     * ignoring any additional arguments.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} func The function to cap arguments for.
     * @param {number} [n=func.length] The arity cap.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the new capped function.
     * @example
     *
     * _.map(['6', '8', '10'], _.ary(parseInt, 1));
     * // => [6, 8, 10]
     */
    function ary(func, n, guard) {
      n = guard ? undefined : n;
      n = (func && n == null) ? func.length : n;
      return createWrap(func, WRAP_ARY_FLAG, undefined, undefined, undefined, undefined, n);
    }

    /**
     * Creates a function that invokes `func`, with the `this` binding and arguments
     * of the created function, while it's called less than `n` times. Subsequent
     * calls to the created function return the result of the last `func` invocation.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {number} n The number of calls at which `func` is no longer invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * jQuery(element).on('click', _.before(5, addContactToList));
     * // => Allows adding up to 4 contacts to the list.
     */
    function before(n, func) {
      var result;
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      n = toInteger(n);
      return function() {
        if (--n > 0) {
          result = func.apply(this, arguments);
        }
        if (n <= 1) {
          func = undefined;
        }
        return result;
      };
    }

    /**
     * Creates a function that invokes `func` with the `this` binding of `thisArg`
     * and `partials` prepended to the arguments it receives.
     *
     * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for partially applied arguments.
     *
     * **Note:** Unlike native `Function#bind`, this method doesn't set the "length"
     * property of bound functions.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to bind.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * function greet(greeting, punctuation) {
     *   return greeting + ' ' + this.user + punctuation;
     * }
     *
     * var object = { 'user': 'fred' };
     *
     * var bound = _.bind(greet, object, 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * // Bound with placeholders.
     * var bound = _.bind(greet, object, _, '!');
     * bound('hi');
     * // => 'hi fred!'
     */
    var bind = baseRest(function(func, thisArg, partials) {
      var bitmask = WRAP_BIND_FLAG;
      if (partials.length) {
        var holders = replaceHolders(partials, getHolder(bind));
        bitmask |= WRAP_PARTIAL_FLAG;
      }
      return createWrap(func, bitmask, thisArg, partials, holders);
    });

    /**
     * Creates a function that invokes the method at `object[key]` with `partials`
     * prepended to the arguments it receives.
     *
     * This method differs from `_.bind` by allowing bound functions to reference
     * methods that may be redefined or don't yet exist. See
     * [Peter Michaux's article](http://peter.michaux.ca/articles/lazy-function-definition-pattern)
     * for more details.
     *
     * The `_.bindKey.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * @static
     * @memberOf _
     * @since 0.10.0
     * @category Function
     * @param {Object} object The object to invoke the method on.
     * @param {string} key The key of the method.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var object = {
     *   'user': 'fred',
     *   'greet': function(greeting, punctuation) {
     *     return greeting + ' ' + this.user + punctuation;
     *   }
     * };
     *
     * var bound = _.bindKey(object, 'greet', 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * object.greet = function(greeting, punctuation) {
     *   return greeting + 'ya ' + this.user + punctuation;
     * };
     *
     * bound('!');
     * // => 'hiya fred!'
     *
     * // Bound with placeholders.
     * var bound = _.bindKey(object, 'greet', _, '!');
     * bound('hi');
     * // => 'hiya fred!'
     */
    var bindKey = baseRest(function(object, key, partials) {
      var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG;
      if (partials.length) {
        var holders = replaceHolders(partials, getHolder(bindKey));
        bitmask |= WRAP_PARTIAL_FLAG;
      }
      return createWrap(key, bitmask, object, partials, holders);
    });

    /**
     * Creates a function that accepts arguments of `func` and either invokes
     * `func` returning its result, if at least `arity` number of arguments have
     * been provided, or returns a function that accepts the remaining `func`
     * arguments, and so on. The arity of `func` may be specified if `func.length`
     * is not sufficient.
     *
     * The `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for provided arguments.
     *
     * **Note:** This method doesn't set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curry(abc);
     *
     * curried(1)(2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // Curried with placeholders.
     * curried(1)(_, 3)(2);
     * // => [1, 2, 3]
     */
    function curry(func, arity, guard) {
      arity = guard ? undefined : arity;
      var result = createWrap(func, WRAP_CURRY_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
      result.placeholder = curry.placeholder;
      return result;
    }

    /**
     * This method is like `_.curry` except that arguments are applied to `func`
     * in the manner of `_.partialRight` instead of `_.partial`.
     *
     * The `_.curryRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for provided arguments.
     *
     * **Note:** This method doesn't set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curryRight(abc);
     *
     * curried(3)(2)(1);
     * // => [1, 2, 3]
     *
     * curried(2, 3)(1);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // Curried with placeholders.
     * curried(3)(1, _)(2);
     * // => [1, 2, 3]
     */
    function curryRight(func, arity, guard) {
      arity = guard ? undefined : arity;
      var result = createWrap(func, WRAP_CURRY_RIGHT_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
      result.placeholder = curryRight.placeholder;
      return result;
    }

    /**
     * Creates a debounced function that delays invoking `func` until after `wait`
     * milliseconds have elapsed since the last time the debounced function was
     * invoked. The debounced function comes with a `cancel` method to cancel
     * delayed `func` invocations and a `flush` method to immediately invoke them.
     * Provide `options` to indicate whether `func` should be invoked on the
     * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
     * with the last arguments provided to the debounced function. Subsequent
     * calls to the debounced function return the result of the last `func`
     * invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is
     * invoked on the trailing edge of the timeout only if the debounced function
     * is invoked more than once during the `wait` timeout.
     *
     * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
     * until to the next tick, similar to `setTimeout` with a timeout of `0`.
     *
     * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
     * for details over the differences between `_.debounce` and `_.throttle`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to debounce.
     * @param {number} [wait=0] The number of milliseconds to delay.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.leading=false]
     *  Specify invoking on the leading edge of the timeout.
     * @param {number} [options.maxWait]
     *  The maximum time `func` is allowed to be delayed before it's invoked.
     * @param {boolean} [options.trailing=true]
     *  Specify invoking on the trailing edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @example
     *
     * // Avoid costly calculations while the window size is in flux.
     * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
     *
     * // Invoke `sendMail` when clicked, debouncing subsequent calls.
     * jQuery(element).on('click', _.debounce(sendMail, 300, {
     *   'leading': true,
     *   'trailing': false
     * }));
     *
     * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
     * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
     * var source = new EventSource('/stream');
     * jQuery(source).on('message', debounced);
     *
     * // Cancel the trailing debounced invocation.
     * jQuery(window).on('popstate', debounced.cancel);
     */
    function debounce(func, wait, options) {
      var lastArgs,
          lastThis,
          maxWait,
          result,
          timerId,
          lastCallTime,
          lastInvokeTime = 0,
          leading = false,
          maxing = false,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      wait = toNumber(wait) || 0;
      if (isObject(options)) {
        leading = !!options.leading;
        maxing = 'maxWait' in options;
        maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }

      function invokeFunc(time) {
        var args = lastArgs,
            thisArg = lastThis;

        lastArgs = lastThis = undefined;
        lastInvokeTime = time;
        result = func.apply(thisArg, args);
        return result;
      }

      function leadingEdge(time) {
        // Reset any `maxWait` timer.
        lastInvokeTime = time;
        // Start the timer for the trailing edge.
        timerId = setTimeout(timerExpired, wait);
        // Invoke the leading edge.
        return leading ? invokeFunc(time) : result;
      }

      function remainingWait(time) {
        var timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime,
            timeWaiting = wait - timeSinceLastCall;

        return maxing
          ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
          : timeWaiting;
      }

      function shouldInvoke(time) {
        var timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime;

        // Either this is the first call, activity has stopped and we're at the
        // trailing edge, the system time has gone backwards and we're treating
        // it as the trailing edge, or we've hit the `maxWait` limit.
        return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
          (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
      }

      function timerExpired() {
        var time = now();
        if (shouldInvoke(time)) {
          return trailingEdge(time);
        }
        // Restart the timer.
        timerId = setTimeout(timerExpired, remainingWait(time));
      }

      function trailingEdge(time) {
        timerId = undefined;

        // Only invoke if we have `lastArgs` which means `func` has been
        // debounced at least once.
        if (trailing && lastArgs) {
          return invokeFunc(time);
        }
        lastArgs = lastThis = undefined;
        return result;
      }

      function cancel() {
        if (timerId !== undefined) {
          clearTimeout(timerId);
        }
        lastInvokeTime = 0;
        lastArgs = lastCallTime = lastThis = timerId = undefined;
      }

      function flush() {
        return timerId === undefined ? result : trailingEdge(now());
      }

      function debounced() {
        var time = now(),
            isInvoking = shouldInvoke(time);

        lastArgs = arguments;
        lastThis = this;
        lastCallTime = time;

        if (isInvoking) {
          if (timerId === undefined) {
            return leadingEdge(lastCallTime);
          }
          if (maxing) {
            // Handle invocations in a tight loop.
            clearTimeout(timerId);
            timerId = setTimeout(timerExpired, wait);
            return invokeFunc(lastCallTime);
          }
        }
        if (timerId === undefined) {
          timerId = setTimeout(timerExpired, wait);
        }
        return result;
      }
      debounced.cancel = cancel;
      debounced.flush = flush;
      return debounced;
    }

    /**
     * Defers invoking the `func` until the current call stack has cleared. Any
     * additional arguments are provided to `func` when it's invoked.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to defer.
     * @param {...*} [args] The arguments to invoke `func` with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.defer(function(text) {
     *   console.log(text);
     * }, 'deferred');
     * // => Logs 'deferred' after one millisecond.
     */
    var defer = baseRest(function(func, args) {
      return baseDelay(func, 1, args);
    });

    /**
     * Invokes `func` after `wait` milliseconds. Any additional arguments are
     * provided to `func` when it's invoked.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {...*} [args] The arguments to invoke `func` with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.delay(function(text) {
     *   console.log(text);
     * }, 1000, 'later');
     * // => Logs 'later' after one second.
     */
    var delay = baseRest(function(func, wait, args) {
      return baseDelay(func, toNumber(wait) || 0, args);
    });

    /**
     * Creates a function that invokes `func` with arguments reversed.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Function
     * @param {Function} func The function to flip arguments for.
     * @returns {Function} Returns the new flipped function.
     * @example
     *
     * var flipped = _.flip(function() {
     *   return _.toArray(arguments);
     * });
     *
     * flipped('a', 'b', 'c', 'd');
     * // => ['d', 'c', 'b', 'a']
     */
    function flip(func) {
      return createWrap(func, WRAP_FLIP_FLAG);
    }

    /**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * provided, it determines the cache key for storing the result based on the
     * arguments provided to the memoized function. By default, the first argument
     * provided to the memoized function is used as the map cache key. The `func`
     * is invoked with the `this` binding of the memoized function.
     *
     * **Note:** The cache is exposed as the `cache` property on the memoized
     * function. Its creation may be customized by replacing the `_.memoize.Cache`
     * constructor with one whose instances implement the
     * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
     * method interface of `clear`, `delete`, `get`, `has`, and `set`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] The function to resolve the cache key.
     * @returns {Function} Returns the new memoized function.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     * var other = { 'c': 3, 'd': 4 };
     *
     * var values = _.memoize(_.values);
     * values(object);
     * // => [1, 2]
     *
     * values(other);
     * // => [3, 4]
     *
     * object.a = 2;
     * values(object);
     * // => [1, 2]
     *
     * // Modify the result cache.
     * values.cache.set(object, ['a', 'b']);
     * values(object);
     * // => ['a', 'b']
     *
     * // Replace `_.memoize.Cache`.
     * _.memoize.Cache = WeakMap;
     */
    function memoize(func, resolver) {
      if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var memoized = function() {
        var args = arguments,
            key = resolver ? resolver.apply(this, args) : args[0],
            cache = memoized.cache;

        if (cache.has(key)) {
          return cache.get(key);
        }
        var result = func.apply(this, args);
        memoized.cache = cache.set(key, result) || cache;
        return result;
      };
      memoized.cache = new (memoize.Cache || MapCache);
      return memoized;
    }

    // Expose `MapCache`.
    memoize.Cache = MapCache;

    /**
     * Creates a function that negates the result of the predicate `func`. The
     * `func` predicate is invoked with the `this` binding and arguments of the
     * created function.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} predicate The predicate to negate.
     * @returns {Function} Returns the new negated function.
     * @example
     *
     * function isEven(n) {
     *   return n % 2 == 0;
     * }
     *
     * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
     * // => [1, 3, 5]
     */
    function negate(predicate) {
      if (typeof predicate != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return function() {
        var args = arguments;
        switch (args.length) {
          case 0: return !predicate.call(this);
          case 1: return !predicate.call(this, args[0]);
          case 2: return !predicate.call(this, args[0], args[1]);
          case 3: return !predicate.call(this, args[0], args[1], args[2]);
        }
        return !predicate.apply(this, args);
      };
    }

    /**
     * Creates a function that is restricted to invoking `func` once. Repeat calls
     * to the function return the value of the first invocation. The `func` is
     * invoked with the `this` binding and arguments of the created function.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var initialize = _.once(createApplication);
     * initialize();
     * initialize();
     * // => `createApplication` is invoked once
     */
    function once(func) {
      return before(2, func);
    }

    /**
     * Creates a function that invokes `func` with its arguments transformed.
     *
     * @static
     * @since 4.0.0
     * @memberOf _
     * @category Function
     * @param {Function} func The function to wrap.
     * @param {...(Function|Function[])} [transforms=[_.identity]]
     *  The argument transforms.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function doubled(n) {
     *   return n * 2;
     * }
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var func = _.overArgs(function(x, y) {
     *   return [x, y];
     * }, [square, doubled]);
     *
     * func(9, 3);
     * // => [81, 6]
     *
     * func(10, 5);
     * // => [100, 10]
     */
    var overArgs = castRest(function(func, transforms) {
      transforms = (transforms.length == 1 && isArray(transforms[0]))
        ? arrayMap(transforms[0], baseUnary(getIteratee()))
        : arrayMap(baseFlatten(transforms, 1), baseUnary(getIteratee()));

      var funcsLength = transforms.length;
      return baseRest(function(args) {
        var index = -1,
            length = nativeMin(args.length, funcsLength);

        while (++index < length) {
          args[index] = transforms[index].call(this, args[index]);
        }
        return apply(func, this, args);
      });
    });

    /**
     * Creates a function that invokes `func` with `partials` prepended to the
     * arguments it receives. This method is like `_.bind` except it does **not**
     * alter the `this` binding.
     *
     * The `_.partial.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method doesn't set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @since 0.2.0
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * function greet(greeting, name) {
     *   return greeting + ' ' + name;
     * }
     *
     * var sayHelloTo = _.partial(greet, 'hello');
     * sayHelloTo('fred');
     * // => 'hello fred'
     *
     * // Partially applied with placeholders.
     * var greetFred = _.partial(greet, _, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     */
    var partial = baseRest(function(func, partials) {
      var holders = replaceHolders(partials, getHolder(partial));
      return createWrap(func, WRAP_PARTIAL_FLAG, undefined, partials, holders);
    });

    /**
     * This method is like `_.partial` except that partially applied arguments
     * are appended to the arguments it receives.
     *
     * The `_.partialRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method doesn't set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @since 1.0.0
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * function greet(greeting, name) {
     *   return greeting + ' ' + name;
     * }
     *
     * var greetFred = _.partialRight(greet, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     *
     * // Partially applied with placeholders.
     * var sayHelloTo = _.partialRight(greet, 'hello', _);
     * sayHelloTo('fred');
     * // => 'hello fred'
     */
    var partialRight = baseRest(function(func, partials) {
      var holders = replaceHolders(partials, getHolder(partialRight));
      return createWrap(func, WRAP_PARTIAL_RIGHT_FLAG, undefined, partials, holders);
    });

    /**
     * Creates a function that invokes `func` with arguments arranged according
     * to the specified `indexes` where the argument value at the first index is
     * provided as the first argument, the argument value at the second index is
     * provided as the second argument, and so on.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} func The function to rearrange arguments for.
     * @param {...(number|number[])} indexes The arranged argument indexes.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var rearged = _.rearg(function(a, b, c) {
     *   return [a, b, c];
     * }, [2, 0, 1]);
     *
     * rearged('b', 'c', 'a')
     * // => ['a', 'b', 'c']
     */
    var rearg = flatRest(function(func, indexes) {
      return createWrap(func, WRAP_REARG_FLAG, undefined, undefined, undefined, indexes);
    });

    /**
     * Creates a function that invokes `func` with the `this` binding of the
     * created function and arguments from `start` and beyond provided as
     * an array.
     *
     * **Note:** This method is based on the
     * [rest parameter](https://mdn.io/rest_parameters).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Function
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.rest(function(what, names) {
     *   return what + ' ' + _.initial(names).join(', ') +
     *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
     * });
     *
     * say('hello', 'fred', 'barney', 'pebbles');
     * // => 'hello fred, barney, & pebbles'
     */
    function rest(func, start) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      start = start === undefined ? start : toInteger(start);
      return baseRest(func, start);
    }

    /**
     * Creates a function that invokes `func` with the `this` binding of the
     * create function and an array of arguments much like
     * [`Function#apply`](http://www.ecma-international.org/ecma-262/7.0/#sec-function.prototype.apply).
     *
     * **Note:** This method is based on the
     * [spread operator](https://mdn.io/spread_operator).
     *
     * @static
     * @memberOf _
     * @since 3.2.0
     * @category Function
     * @param {Function} func The function to spread arguments over.
     * @param {number} [start=0] The start position of the spread.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.spread(function(who, what) {
     *   return who + ' says ' + what;
     * });
     *
     * say(['fred', 'hello']);
     * // => 'fred says hello'
     *
     * var numbers = Promise.all([
     *   Promise.resolve(40),
     *   Promise.resolve(36)
     * ]);
     *
     * numbers.then(_.spread(function(x, y) {
     *   return x + y;
     * }));
     * // => a Promise of 76
     */
    function spread(func, start) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      start = start == null ? 0 : nativeMax(toInteger(start), 0);
      return baseRest(function(args) {
        var array = args[start],
            otherArgs = castSlice(args, 0, start);

        if (array) {
          arrayPush(otherArgs, array);
        }
        return apply(func, this, otherArgs);
      });
    }

    /**
     * Creates a throttled function that only invokes `func` at most once per
     * every `wait` milliseconds. The throttled function comes with a `cancel`
     * method to cancel delayed `func` invocations and a `flush` method to
     * immediately invoke them. Provide `options` to indicate whether `func`
     * should be invoked on the leading and/or trailing edge of the `wait`
     * timeout. The `func` is invoked with the last arguments provided to the
     * throttled function. Subsequent calls to the throttled function return the
     * result of the last `func` invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is
     * invoked on the trailing edge of the timeout only if the throttled function
     * is invoked more than once during the `wait` timeout.
     *
     * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
     * until to the next tick, similar to `setTimeout` with a timeout of `0`.
     *
     * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
     * for details over the differences between `_.throttle` and `_.debounce`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to throttle.
     * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.leading=true]
     *  Specify invoking on the leading edge of the timeout.
     * @param {boolean} [options.trailing=true]
     *  Specify invoking on the trailing edge of the timeout.
     * @returns {Function} Returns the new throttled function.
     * @example
     *
     * // Avoid excessively updating the position while scrolling.
     * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
     *
     * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
     * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
     * jQuery(element).on('click', throttled);
     *
     * // Cancel the trailing throttled invocation.
     * jQuery(window).on('popstate', throttled.cancel);
     */
    function throttle(func, wait, options) {
      var leading = true,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      if (isObject(options)) {
        leading = 'leading' in options ? !!options.leading : leading;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }
      return debounce(func, wait, {
        'leading': leading,
        'maxWait': wait,
        'trailing': trailing
      });
    }

    /**
     * Creates a function that accepts up to one argument, ignoring any
     * additional arguments.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Function
     * @param {Function} func The function to cap arguments for.
     * @returns {Function} Returns the new capped function.
     * @example
     *
     * _.map(['6', '8', '10'], _.unary(parseInt));
     * // => [6, 8, 10]
     */
    function unary(func) {
      return ary(func, 1);
    }

    /**
     * Creates a function that provides `value` to `wrapper` as its first
     * argument. Any additional arguments provided to the function are appended
     * to those provided to the `wrapper`. The wrapper is invoked with the `this`
     * binding of the created function.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {*} value The value to wrap.
     * @param {Function} [wrapper=identity] The wrapper function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var p = _.wrap(_.escape, function(func, text) {
     *   return '<p>' + func(text) + '</p>';
     * });
     *
     * p('fred, barney, & pebbles');
     * // => '<p>fred, barney, &amp; pebbles</p>'
     */
    function wrap(value, wrapper) {
      return partial(castFunction(wrapper), value);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Casts `value` as an array if it's not one.
     *
     * @static
     * @memberOf _
     * @since 4.4.0
     * @category Lang
     * @param {*} value The value to inspect.
     * @returns {Array} Returns the cast array.
     * @example
     *
     * _.castArray(1);
     * // => [1]
     *
     * _.castArray({ 'a': 1 });
     * // => [{ 'a': 1 }]
     *
     * _.castArray('abc');
     * // => ['abc']
     *
     * _.castArray(null);
     * // => [null]
     *
     * _.castArray(undefined);
     * // => [undefined]
     *
     * _.castArray();
     * // => []
     *
     * var array = [1, 2, 3];
     * console.log(_.castArray(array) === array);
     * // => true
     */
    function castArray() {
      if (!arguments.length) {
        return [];
      }
      var value = arguments[0];
      return isArray(value) ? value : [value];
    }

    /**
     * Creates a shallow clone of `value`.
     *
     * **Note:** This method is loosely based on the
     * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
     * and supports cloning arrays, array buffers, booleans, date objects, maps,
     * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
     * arrays. The own enumerable properties of `arguments` objects are cloned
     * as plain objects. An empty object is returned for uncloneable values such
     * as error objects, functions, DOM nodes, and WeakMaps.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to clone.
     * @returns {*} Returns the cloned value.
     * @see _.cloneDeep
     * @example
     *
     * var objects = [{ 'a': 1 }, { 'b': 2 }];
     *
     * var shallow = _.clone(objects);
     * console.log(shallow[0] === objects[0]);
     * // => true
     */
    function clone(value) {
      return baseClone(value, CLONE_SYMBOLS_FLAG);
    }

    /**
     * This method is like `_.clone` except that it accepts `customizer` which
     * is invoked to produce the cloned value. If `customizer` returns `undefined`,
     * cloning is handled by the method instead. The `customizer` is invoked with
     * up to four arguments; (value [, index|key, object, stack]).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to clone.
     * @param {Function} [customizer] The function to customize cloning.
     * @returns {*} Returns the cloned value.
     * @see _.cloneDeepWith
     * @example
     *
     * function customizer(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(false);
     *   }
     * }
     *
     * var el = _.cloneWith(document.body, customizer);
     *
     * console.log(el === document.body);
     * // => false
     * console.log(el.nodeName);
     * // => 'BODY'
     * console.log(el.childNodes.length);
     * // => 0
     */
    function cloneWith(value, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return baseClone(value, CLONE_SYMBOLS_FLAG, customizer);
    }

    /**
     * This method is like `_.clone` except that it recursively clones `value`.
     *
     * @static
     * @memberOf _
     * @since 1.0.0
     * @category Lang
     * @param {*} value The value to recursively clone.
     * @returns {*} Returns the deep cloned value.
     * @see _.clone
     * @example
     *
     * var objects = [{ 'a': 1 }, { 'b': 2 }];
     *
     * var deep = _.cloneDeep(objects);
     * console.log(deep[0] === objects[0]);
     * // => false
     */
    function cloneDeep(value) {
      return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
    }

    /**
     * This method is like `_.cloneWith` except that it recursively clones `value`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to recursively clone.
     * @param {Function} [customizer] The function to customize cloning.
     * @returns {*} Returns the deep cloned value.
     * @see _.cloneWith
     * @example
     *
     * function customizer(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(true);
     *   }
     * }
     *
     * var el = _.cloneDeepWith(document.body, customizer);
     *
     * console.log(el === document.body);
     * // => false
     * console.log(el.nodeName);
     * // => 'BODY'
     * console.log(el.childNodes.length);
     * // => 20
     */
    function cloneDeepWith(value, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG, customizer);
    }

    /**
     * Checks if `object` conforms to `source` by invoking the predicate
     * properties of `source` with the corresponding property values of `object`.
     *
     * **Note:** This method is equivalent to `_.conforms` when `source` is
     * partially applied.
     *
     * @static
     * @memberOf _
     * @since 4.14.0
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property predicates to conform to.
     * @returns {boolean} Returns `true` if `object` conforms, else `false`.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     *
     * _.conformsTo(object, { 'b': function(n) { return n > 1; } });
     * // => true
     *
     * _.conformsTo(object, { 'b': function(n) { return n > 2; } });
     * // => false
     */
    function conformsTo(object, source) {
      return source == null || baseConformsTo(object, source, keys(source));
    }

    /**
     * Performs a
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * comparison between two values to determine if they are equivalent.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.eq(object, object);
     * // => true
     *
     * _.eq(object, other);
     * // => false
     *
     * _.eq('a', 'a');
     * // => true
     *
     * _.eq('a', Object('a'));
     * // => false
     *
     * _.eq(NaN, NaN);
     * // => true
     */
    function eq(value, other) {
      return value === other || (value !== value && other !== other);
    }

    /**
     * Checks if `value` is greater than `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than `other`,
     *  else `false`.
     * @see _.lt
     * @example
     *
     * _.gt(3, 1);
     * // => true
     *
     * _.gt(3, 3);
     * // => false
     *
     * _.gt(1, 3);
     * // => false
     */
    var gt = createRelationalOperation(baseGt);

    /**
     * Checks if `value` is greater than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than or equal to
     *  `other`, else `false`.
     * @see _.lte
     * @example
     *
     * _.gte(3, 1);
     * // => true
     *
     * _.gte(3, 3);
     * // => true
     *
     * _.gte(1, 3);
     * // => false
     */
    var gte = createRelationalOperation(function(value, other) {
      return value >= other;
    });

    /**
     * Checks if `value` is likely an `arguments` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     *  else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
      return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
        !propertyIsEnumerable.call(value, 'callee');
    };

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(document.body.children);
     * // => false
     *
     * _.isArray('abc');
     * // => false
     *
     * _.isArray(_.noop);
     * // => false
     */
    var isArray = Array.isArray;

    /**
     * Checks if `value` is classified as an `ArrayBuffer` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
     * @example
     *
     * _.isArrayBuffer(new ArrayBuffer(2));
     * // => true
     *
     * _.isArrayBuffer(new Array(2));
     * // => false
     */
    var isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;

    /**
     * Checks if `value` is array-like. A value is considered array-like if it's
     * not a function and has a `value.length` that's an integer greater than or
     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     * @example
     *
     * _.isArrayLike([1, 2, 3]);
     * // => true
     *
     * _.isArrayLike(document.body.children);
     * // => true
     *
     * _.isArrayLike('abc');
     * // => true
     *
     * _.isArrayLike(_.noop);
     * // => false
     */
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }

    /**
     * This method is like `_.isArrayLike` except that it also checks if `value`
     * is an object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array-like object,
     *  else `false`.
     * @example
     *
     * _.isArrayLikeObject([1, 2, 3]);
     * // => true
     *
     * _.isArrayLikeObject(document.body.children);
     * // => true
     *
     * _.isArrayLikeObject('abc');
     * // => false
     *
     * _.isArrayLikeObject(_.noop);
     * // => false
     */
    function isArrayLikeObject(value) {
      return isObjectLike(value) && isArrayLike(value);
    }

    /**
     * Checks if `value` is classified as a boolean primitive or object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a boolean, else `false`.
     * @example
     *
     * _.isBoolean(false);
     * // => true
     *
     * _.isBoolean(null);
     * // => false
     */
    function isBoolean(value) {
      return value === true || value === false ||
        (isObjectLike(value) && baseGetTag(value) == boolTag);
    }

    /**
     * Checks if `value` is a buffer.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
     * @example
     *
     * _.isBuffer(new Buffer(2));
     * // => true
     *
     * _.isBuffer(new Uint8Array(2));
     * // => false
     */
    var isBuffer = nativeIsBuffer || stubFalse;

    /**
     * Checks if `value` is classified as a `Date` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
     * @example
     *
     * _.isDate(new Date);
     * // => true
     *
     * _.isDate('Mon April 23 2012');
     * // => false
     */
    var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;

    /**
     * Checks if `value` is likely a DOM element.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
     * @example
     *
     * _.isElement(document.body);
     * // => true
     *
     * _.isElement('<body>');
     * // => false
     */
    function isElement(value) {
      return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
    }

    /**
     * Checks if `value` is an empty object, collection, map, or set.
     *
     * Objects are considered empty if they have no own enumerable string keyed
     * properties.
     *
     * Array-like values such as `arguments` objects, arrays, buffers, strings, or
     * jQuery-like collections are considered empty if they have a `length` of `0`.
     * Similarly, maps and sets are considered empty if they have a `size` of `0`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is empty, else `false`.
     * @example
     *
     * _.isEmpty(null);
     * // => true
     *
     * _.isEmpty(true);
     * // => true
     *
     * _.isEmpty(1);
     * // => true
     *
     * _.isEmpty([1, 2, 3]);
     * // => false
     *
     * _.isEmpty({ 'a': 1 });
     * // => false
     */
    function isEmpty(value) {
      if (value == null) {
        return true;
      }
      if (isArrayLike(value) &&
          (isArray(value) || typeof value == 'string' || typeof value.splice == 'function' ||
            isBuffer(value) || isTypedArray(value) || isArguments(value))) {
        return !value.length;
      }
      var tag = getTag(value);
      if (tag == mapTag || tag == setTag) {
        return !value.size;
      }
      if (isPrototype(value)) {
        return !baseKeys(value).length;
      }
      for (var key in value) {
        if (hasOwnProperty.call(value, key)) {
          return false;
        }
      }
      return true;
    }

    /**
     * Performs a deep comparison between two values to determine if they are
     * equivalent.
     *
     * **Note:** This method supports comparing arrays, array buffers, booleans,
     * date objects, error objects, maps, numbers, `Object` objects, regexes,
     * sets, strings, symbols, and typed arrays. `Object` objects are compared
     * by their own, not inherited, enumerable properties. Functions and DOM
     * nodes are compared by strict equality, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.isEqual(object, other);
     * // => true
     *
     * object === other;
     * // => false
     */
    function isEqual(value, other) {
      return baseIsEqual(value, other);
    }

    /**
     * This method is like `_.isEqual` except that it accepts `customizer` which
     * is invoked to compare values. If `customizer` returns `undefined`, comparisons
     * are handled by the method instead. The `customizer` is invoked with up to
     * six arguments: (objValue, othValue [, index|key, object, other, stack]).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * function isGreeting(value) {
     *   return /^h(?:i|ello)$/.test(value);
     * }
     *
     * function customizer(objValue, othValue) {
     *   if (isGreeting(objValue) && isGreeting(othValue)) {
     *     return true;
     *   }
     * }
     *
     * var array = ['hello', 'goodbye'];
     * var other = ['hi', 'goodbye'];
     *
     * _.isEqualWith(array, other, customizer);
     * // => true
     */
    function isEqualWith(value, other, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      var result = customizer ? customizer(value, other) : undefined;
      return result === undefined ? baseIsEqual(value, other, undefined, customizer) : !!result;
    }

    /**
     * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
     * `SyntaxError`, `TypeError`, or `URIError` object.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
     * @example
     *
     * _.isError(new Error);
     * // => true
     *
     * _.isError(Error);
     * // => false
     */
    function isError(value) {
      if (!isObjectLike(value)) {
        return false;
      }
      var tag = baseGetTag(value);
      return tag == errorTag || tag == domExcTag ||
        (typeof value.message == 'string' && typeof value.name == 'string' && !isPlainObject(value));
    }

    /**
     * Checks if `value` is a finite primitive number.
     *
     * **Note:** This method is based on
     * [`Number.isFinite`](https://mdn.io/Number/isFinite).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
     * @example
     *
     * _.isFinite(3);
     * // => true
     *
     * _.isFinite(Number.MIN_VALUE);
     * // => true
     *
     * _.isFinite(Infinity);
     * // => false
     *
     * _.isFinite('3');
     * // => false
     */
    function isFinite(value) {
      return typeof value == 'number' && nativeIsFinite(value);
    }

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      if (!isObject(value)) {
        return false;
      }
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 9 which returns 'object' for typed arrays and other constructors.
      var tag = baseGetTag(value);
      return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
    }

    /**
     * Checks if `value` is an integer.
     *
     * **Note:** This method is based on
     * [`Number.isInteger`](https://mdn.io/Number/isInteger).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an integer, else `false`.
     * @example
     *
     * _.isInteger(3);
     * // => true
     *
     * _.isInteger(Number.MIN_VALUE);
     * // => false
     *
     * _.isInteger(Infinity);
     * // => false
     *
     * _.isInteger('3');
     * // => false
     */
    function isInteger(value) {
      return typeof value == 'number' && value == toInteger(value);
    }

    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This method is loosely based on
     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     * @example
     *
     * _.isLength(3);
     * // => true
     *
     * _.isLength(Number.MIN_VALUE);
     * // => false
     *
     * _.isLength(Infinity);
     * // => false
     *
     * _.isLength('3');
     * // => false
     */
    function isLength(value) {
      return typeof value == 'number' &&
        value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */
    function isObject(value) {
      var type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */
    function isObjectLike(value) {
      return value != null && typeof value == 'object';
    }

    /**
     * Checks if `value` is classified as a `Map` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a map, else `false`.
     * @example
     *
     * _.isMap(new Map);
     * // => true
     *
     * _.isMap(new WeakMap);
     * // => false
     */
    var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

    /**
     * Performs a partial deep comparison between `object` and `source` to
     * determine if `object` contains equivalent property values.
     *
     * **Note:** This method is equivalent to `_.matches` when `source` is
     * partially applied.
     *
     * Partial comparisons will match empty array and empty object `source`
     * values against any array or object value, respectively. See `_.isEqual`
     * for a list of supported value comparisons.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     *
     * _.isMatch(object, { 'b': 2 });
     * // => true
     *
     * _.isMatch(object, { 'b': 1 });
     * // => false
     */
    function isMatch(object, source) {
      return object === source || baseIsMatch(object, source, getMatchData(source));
    }

    /**
     * This method is like `_.isMatch` except that it accepts `customizer` which
     * is invoked to compare values. If `customizer` returns `undefined`, comparisons
     * are handled by the method instead. The `customizer` is invoked with five
     * arguments: (objValue, srcValue, index|key, object, source).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     * @example
     *
     * function isGreeting(value) {
     *   return /^h(?:i|ello)$/.test(value);
     * }
     *
     * function customizer(objValue, srcValue) {
     *   if (isGreeting(objValue) && isGreeting(srcValue)) {
     *     return true;
     *   }
     * }
     *
     * var object = { 'greeting': 'hello' };
     * var source = { 'greeting': 'hi' };
     *
     * _.isMatchWith(object, source, customizer);
     * // => true
     */
    function isMatchWith(object, source, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return baseIsMatch(object, source, getMatchData(source), customizer);
    }

    /**
     * Checks if `value` is `NaN`.
     *
     * **Note:** This method is based on
     * [`Number.isNaN`](https://mdn.io/Number/isNaN) and is not the same as
     * global [`isNaN`](https://mdn.io/isNaN) which returns `true` for
     * `undefined` and other non-number values.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
     * @example
     *
     * _.isNaN(NaN);
     * // => true
     *
     * _.isNaN(new Number(NaN));
     * // => true
     *
     * isNaN(undefined);
     * // => true
     *
     * _.isNaN(undefined);
     * // => false
     */
    function isNaN(value) {
      // An `NaN` primitive is the only value that is not equal to itself.
      // Perform the `toStringTag` check first to avoid errors with some
      // ActiveX objects in IE.
      return isNumber(value) && value != +value;
    }

    /**
     * Checks if `value` is a pristine native function.
     *
     * **Note:** This method can't reliably detect native functions in the presence
     * of the core-js package because core-js circumvents this kind of detection.
     * Despite multiple requests, the core-js maintainer has made it clear: any
     * attempt to fix the detection will be obstructed. As a result, we're left
     * with little choice but to throw an error. Unfortunately, this also affects
     * packages, like [babel-polyfill](https://www.npmjs.com/package/babel-polyfill),
     * which rely on core-js.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     * @example
     *
     * _.isNative(Array.prototype.push);
     * // => true
     *
     * _.isNative(_);
     * // => false
     */
    function isNative(value) {
      if (isMaskable(value)) {
        throw new Error(CORE_ERROR_TEXT);
      }
      return baseIsNative(value);
    }

    /**
     * Checks if `value` is `null`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
     * @example
     *
     * _.isNull(null);
     * // => true
     *
     * _.isNull(void 0);
     * // => false
     */
    function isNull(value) {
      return value === null;
    }

    /**
     * Checks if `value` is `null` or `undefined`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is nullish, else `false`.
     * @example
     *
     * _.isNil(null);
     * // => true
     *
     * _.isNil(void 0);
     * // => true
     *
     * _.isNil(NaN);
     * // => false
     */
    function isNil(value) {
      return value == null;
    }

    /**
     * Checks if `value` is classified as a `Number` primitive or object.
     *
     * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
     * classified as numbers, use the `_.isFinite` method.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a number, else `false`.
     * @example
     *
     * _.isNumber(3);
     * // => true
     *
     * _.isNumber(Number.MIN_VALUE);
     * // => true
     *
     * _.isNumber(Infinity);
     * // => true
     *
     * _.isNumber('3');
     * // => false
     */
    function isNumber(value) {
      return typeof value == 'number' ||
        (isObjectLike(value) && baseGetTag(value) == numberTag);
    }

    /**
     * Checks if `value` is a plain object, that is, an object created by the
     * `Object` constructor or one with a `[[Prototype]]` of `null`.
     *
     * @static
     * @memberOf _
     * @since 0.8.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * _.isPlainObject(new Foo);
     * // => false
     *
     * _.isPlainObject([1, 2, 3]);
     * // => false
     *
     * _.isPlainObject({ 'x': 0, 'y': 0 });
     * // => true
     *
     * _.isPlainObject(Object.create(null));
     * // => true
     */
    function isPlainObject(value) {
      if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
        return false;
      }
      var proto = getPrototype(value);
      if (proto === null) {
        return true;
      }
      var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
      return typeof Ctor == 'function' && Ctor instanceof Ctor &&
        funcToString.call(Ctor) == objectCtorString;
    }

    /**
     * Checks if `value` is classified as a `RegExp` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
     * @example
     *
     * _.isRegExp(/abc/);
     * // => true
     *
     * _.isRegExp('/abc/');
     * // => false
     */
    var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;

    /**
     * Checks if `value` is a safe integer. An integer is safe if it's an IEEE-754
     * double precision number which isn't the result of a rounded unsafe integer.
     *
     * **Note:** This method is based on
     * [`Number.isSafeInteger`](https://mdn.io/Number/isSafeInteger).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a safe integer, else `false`.
     * @example
     *
     * _.isSafeInteger(3);
     * // => true
     *
     * _.isSafeInteger(Number.MIN_VALUE);
     * // => false
     *
     * _.isSafeInteger(Infinity);
     * // => false
     *
     * _.isSafeInteger('3');
     * // => false
     */
    function isSafeInteger(value) {
      return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is classified as a `Set` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a set, else `false`.
     * @example
     *
     * _.isSet(new Set);
     * // => true
     *
     * _.isSet(new WeakSet);
     * // => false
     */
    var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

    /**
     * Checks if `value` is classified as a `String` primitive or object.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a string, else `false`.
     * @example
     *
     * _.isString('abc');
     * // => true
     *
     * _.isString(1);
     * // => false
     */
    function isString(value) {
      return typeof value == 'string' ||
        (!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag);
    }

    /**
     * Checks if `value` is classified as a `Symbol` primitive or object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
     * @example
     *
     * _.isSymbol(Symbol.iterator);
     * // => true
     *
     * _.isSymbol('abc');
     * // => false
     */
    function isSymbol(value) {
      return typeof value == 'symbol' ||
        (isObjectLike(value) && baseGetTag(value) == symbolTag);
    }

    /**
     * Checks if `value` is classified as a typed array.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     * @example
     *
     * _.isTypedArray(new Uint8Array);
     * // => true
     *
     * _.isTypedArray([]);
     * // => false
     */
    var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

    /**
     * Checks if `value` is `undefined`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
     * @example
     *
     * _.isUndefined(void 0);
     * // => true
     *
     * _.isUndefined(null);
     * // => false
     */
    function isUndefined(value) {
      return value === undefined;
    }

    /**
     * Checks if `value` is classified as a `WeakMap` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a weak map, else `false`.
     * @example
     *
     * _.isWeakMap(new WeakMap);
     * // => true
     *
     * _.isWeakMap(new Map);
     * // => false
     */
    function isWeakMap(value) {
      return isObjectLike(value) && getTag(value) == weakMapTag;
    }

    /**
     * Checks if `value` is classified as a `WeakSet` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a weak set, else `false`.
     * @example
     *
     * _.isWeakSet(new WeakSet);
     * // => true
     *
     * _.isWeakSet(new Set);
     * // => false
     */
    function isWeakSet(value) {
      return isObjectLike(value) && baseGetTag(value) == weakSetTag;
    }

    /**
     * Checks if `value` is less than `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than `other`,
     *  else `false`.
     * @see _.gt
     * @example
     *
     * _.lt(1, 3);
     * // => true
     *
     * _.lt(3, 3);
     * // => false
     *
     * _.lt(3, 1);
     * // => false
     */
    var lt = createRelationalOperation(baseLt);

    /**
     * Checks if `value` is less than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than or equal to
     *  `other`, else `false`.
     * @see _.gte
     * @example
     *
     * _.lte(1, 3);
     * // => true
     *
     * _.lte(3, 3);
     * // => true
     *
     * _.lte(3, 1);
     * // => false
     */
    var lte = createRelationalOperation(function(value, other) {
      return value <= other;
    });

    /**
     * Converts `value` to an array.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Array} Returns the converted array.
     * @example
     *
     * _.toArray({ 'a': 1, 'b': 2 });
     * // => [1, 2]
     *
     * _.toArray('abc');
     * // => ['a', 'b', 'c']
     *
     * _.toArray(1);
     * // => []
     *
     * _.toArray(null);
     * // => []
     */
    function toArray(value) {
      if (!value) {
        return [];
      }
      if (isArrayLike(value)) {
        return isString(value) ? stringToArray(value) : copyArray(value);
      }
      if (symIterator && value[symIterator]) {
        return iteratorToArray(value[symIterator]());
      }
      var tag = getTag(value),
          func = tag == mapTag ? mapToArray : (tag == setTag ? setToArray : values);

      return func(value);
    }

    /**
     * Converts `value` to a finite number.
     *
     * @static
     * @memberOf _
     * @since 4.12.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted number.
     * @example
     *
     * _.toFinite(3.2);
     * // => 3.2
     *
     * _.toFinite(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toFinite(Infinity);
     * // => 1.7976931348623157e+308
     *
     * _.toFinite('3.2');
     * // => 3.2
     */
    function toFinite(value) {
      if (!value) {
        return value === 0 ? value : 0;
      }
      value = toNumber(value);
      if (value === INFINITY || value === -INFINITY) {
        var sign = (value < 0 ? -1 : 1);
        return sign * MAX_INTEGER;
      }
      return value === value ? value : 0;
    }

    /**
     * Converts `value` to an integer.
     *
     * **Note:** This method is loosely based on
     * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.toInteger(3.2);
     * // => 3
     *
     * _.toInteger(Number.MIN_VALUE);
     * // => 0
     *
     * _.toInteger(Infinity);
     * // => 1.7976931348623157e+308
     *
     * _.toInteger('3.2');
     * // => 3
     */
    function toInteger(value) {
      var result = toFinite(value),
          remainder = result % 1;

      return result === result ? (remainder ? result - remainder : result) : 0;
    }

    /**
     * Converts `value` to an integer suitable for use as the length of an
     * array-like object.
     *
     * **Note:** This method is based on
     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.toLength(3.2);
     * // => 3
     *
     * _.toLength(Number.MIN_VALUE);
     * // => 0
     *
     * _.toLength(Infinity);
     * // => 4294967295
     *
     * _.toLength('3.2');
     * // => 3
     */
    function toLength(value) {
      return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
    }

    /**
     * Converts `value` to a number.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to process.
     * @returns {number} Returns the number.
     * @example
     *
     * _.toNumber(3.2);
     * // => 3.2
     *
     * _.toNumber(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toNumber(Infinity);
     * // => Infinity
     *
     * _.toNumber('3.2');
     * // => 3.2
     */
    function toNumber(value) {
      if (typeof value == 'number') {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      if (isObject(value)) {
        var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
        value = isObject(other) ? (other + '') : other;
      }
      if (typeof value != 'string') {
        return value === 0 ? value : +value;
      }
      value = value.replace(reTrim, '');
      var isBinary = reIsBinary.test(value);
      return (isBinary || reIsOctal.test(value))
        ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
        : (reIsBadHex.test(value) ? NAN : +value);
    }

    /**
     * Converts `value` to a plain object flattening inherited enumerable string
     * keyed properties of `value` to own properties of the plain object.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Object} Returns the converted plain object.
     * @example
     *
     * function Foo() {
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.assign({ 'a': 1 }, new Foo);
     * // => { 'a': 1, 'b': 2 }
     *
     * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
     * // => { 'a': 1, 'b': 2, 'c': 3 }
     */
    function toPlainObject(value) {
      return copyObject(value, keysIn(value));
    }

    /**
     * Converts `value` to a safe integer. A safe integer can be compared and
     * represented correctly.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.toSafeInteger(3.2);
     * // => 3
     *
     * _.toSafeInteger(Number.MIN_VALUE);
     * // => 0
     *
     * _.toSafeInteger(Infinity);
     * // => 9007199254740991
     *
     * _.toSafeInteger('3.2');
     * // => 3
     */
    function toSafeInteger(value) {
      return value
        ? baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER)
        : (value === 0 ? value : 0);
    }

    /**
     * Converts `value` to a string. An empty string is returned for `null`
     * and `undefined` values. The sign of `-0` is preserved.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.toString(null);
     * // => ''
     *
     * _.toString(-0);
     * // => '-0'
     *
     * _.toString([1, 2, 3]);
     * // => '1,2,3'
     */
    function toString(value) {
      return value == null ? '' : baseToString(value);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Assigns own enumerable string keyed properties of source objects to the
     * destination object. Source objects are applied from left to right.
     * Subsequent sources overwrite property assignments of previous sources.
     *
     * **Note:** This method mutates `object` and is loosely based on
     * [`Object.assign`](https://mdn.io/Object/assign).
     *
     * @static
     * @memberOf _
     * @since 0.10.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.assignIn
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * function Bar() {
     *   this.c = 3;
     * }
     *
     * Foo.prototype.b = 2;
     * Bar.prototype.d = 4;
     *
     * _.assign({ 'a': 0 }, new Foo, new Bar);
     * // => { 'a': 1, 'c': 3 }
     */
    var assign = createAssigner(function(object, source) {
      if (isPrototype(source) || isArrayLike(source)) {
        copyObject(source, keys(source), object);
        return;
      }
      for (var key in source) {
        if (hasOwnProperty.call(source, key)) {
          assignValue(object, key, source[key]);
        }
      }
    });

    /**
     * This method is like `_.assign` except that it iterates over own and
     * inherited source properties.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias extend
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.assign
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * function Bar() {
     *   this.c = 3;
     * }
     *
     * Foo.prototype.b = 2;
     * Bar.prototype.d = 4;
     *
     * _.assignIn({ 'a': 0 }, new Foo, new Bar);
     * // => { 'a': 1, 'b': 2, 'c': 3, 'd': 4 }
     */
    var assignIn = createAssigner(function(object, source) {
      copyObject(source, keysIn(source), object);
    });

    /**
     * This method is like `_.assignIn` except that it accepts `customizer`
     * which is invoked to produce the assigned values. If `customizer` returns
     * `undefined`, assignment is handled by the method instead. The `customizer`
     * is invoked with five arguments: (objValue, srcValue, key, object, source).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias extendWith
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @see _.assignWith
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   return _.isUndefined(objValue) ? srcValue : objValue;
     * }
     *
     * var defaults = _.partialRight(_.assignInWith, customizer);
     *
     * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
     * // => { 'a': 1, 'b': 2 }
     */
    var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
      copyObject(source, keysIn(source), object, customizer);
    });

    /**
     * This method is like `_.assign` except that it accepts `customizer`
     * which is invoked to produce the assigned values. If `customizer` returns
     * `undefined`, assignment is handled by the method instead. The `customizer`
     * is invoked with five arguments: (objValue, srcValue, key, object, source).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @see _.assignInWith
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   return _.isUndefined(objValue) ? srcValue : objValue;
     * }
     *
     * var defaults = _.partialRight(_.assignWith, customizer);
     *
     * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
     * // => { 'a': 1, 'b': 2 }
     */
    var assignWith = createAssigner(function(object, source, srcIndex, customizer) {
      copyObject(source, keys(source), object, customizer);
    });

    /**
     * Creates an array of values corresponding to `paths` of `object`.
     *
     * @static
     * @memberOf _
     * @since 1.0.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {...(string|string[])} [paths] The property paths to pick.
     * @returns {Array} Returns the picked values.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
     *
     * _.at(object, ['a[0].b.c', 'a[1]']);
     * // => [3, 4]
     */
    var at = flatRest(baseAt);

    /**
     * Creates an object that inherits from the `prototype` object. If a
     * `properties` object is given, its own enumerable string keyed properties
     * are assigned to the created object.
     *
     * @static
     * @memberOf _
     * @since 2.3.0
     * @category Object
     * @param {Object} prototype The object to inherit from.
     * @param {Object} [properties] The properties to assign to the object.
     * @returns {Object} Returns the new object.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * function Circle() {
     *   Shape.call(this);
     * }
     *
     * Circle.prototype = _.create(Shape.prototype, {
     *   'constructor': Circle
     * });
     *
     * var circle = new Circle;
     * circle instanceof Circle;
     * // => true
     *
     * circle instanceof Shape;
     * // => true
     */
    function create(prototype, properties) {
      var result = baseCreate(prototype);
      return properties == null ? result : baseAssign(result, properties);
    }

    /**
     * Assigns own and inherited enumerable string keyed properties of source
     * objects to the destination object for all destination properties that
     * resolve to `undefined`. Source objects are applied from left to right.
     * Once a property is set, additional values of the same property are ignored.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.defaultsDeep
     * @example
     *
     * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
     * // => { 'a': 1, 'b': 2 }
     */
    var defaults = baseRest(function(object, sources) {
      object = Object(object);

      var index = -1;
      var length = sources.length;
      var guard = length > 2 ? sources[2] : undefined;

      if (guard && isIterateeCall(sources[0], sources[1], guard)) {
        length = 1;
      }

      while (++index < length) {
        var source = sources[index];
        var props = keysIn(source);
        var propsIndex = -1;
        var propsLength = props.length;

        while (++propsIndex < propsLength) {
          var key = props[propsIndex];
          var value = object[key];

          if (value === undefined ||
              (eq(value, objectProto[key]) && !hasOwnProperty.call(object, key))) {
            object[key] = source[key];
          }
        }
      }

      return object;
    });

    /**
     * This method is like `_.defaults` except that it recursively assigns
     * default properties.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.defaults
     * @example
     *
     * _.defaultsDeep({ 'a': { 'b': 2 } }, { 'a': { 'b': 1, 'c': 3 } });
     * // => { 'a': { 'b': 2, 'c': 3 } }
     */
    var defaultsDeep = baseRest(function(args) {
      args.push(undefined, customDefaultsMerge);
      return apply(mergeWith, undefined, args);
    });

    /**
     * This method is like `_.find` except that it returns the key of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * @static
     * @memberOf _
     * @since 1.1.0
     * @category Object
     * @param {Object} object The object to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {string|undefined} Returns the key of the matched element,
     *  else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findKey(users, function(o) { return o.age < 40; });
     * // => 'barney' (iteration order is not guaranteed)
     *
     * // The `_.matches` iteratee shorthand.
     * _.findKey(users, { 'age': 1, 'active': true });
     * // => 'pebbles'
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findKey(users, ['active', false]);
     * // => 'fred'
     *
     * // The `_.property` iteratee shorthand.
     * _.findKey(users, 'active');
     * // => 'barney'
     */
    function findKey(object, predicate) {
      return baseFindKey(object, getIteratee(predicate, 3), baseForOwn);
    }

    /**
     * This method is like `_.findKey` except that it iterates over elements of
     * a collection in the opposite order.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Object
     * @param {Object} object The object to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {string|undefined} Returns the key of the matched element,
     *  else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findLastKey(users, function(o) { return o.age < 40; });
     * // => returns 'pebbles' assuming `_.findKey` returns 'barney'
     *
     * // The `_.matches` iteratee shorthand.
     * _.findLastKey(users, { 'age': 36, 'active': true });
     * // => 'barney'
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findLastKey(users, ['active', false]);
     * // => 'fred'
     *
     * // The `_.property` iteratee shorthand.
     * _.findLastKey(users, 'active');
     * // => 'pebbles'
     */
    function findLastKey(object, predicate) {
      return baseFindKey(object, getIteratee(predicate, 3), baseForOwnRight);
    }

    /**
     * Iterates over own and inherited enumerable string keyed properties of an
     * object and invokes `iteratee` for each property. The iteratee is invoked
     * with three arguments: (value, key, object). Iteratee functions may exit
     * iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @since 0.3.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forInRight
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forIn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'a', 'b', then 'c' (iteration order is not guaranteed).
     */
    function forIn(object, iteratee) {
      return object == null
        ? object
        : baseFor(object, getIteratee(iteratee, 3), keysIn);
    }

    /**
     * This method is like `_.forIn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forIn
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forInRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'c', 'b', then 'a' assuming `_.forIn` logs 'a', 'b', then 'c'.
     */
    function forInRight(object, iteratee) {
      return object == null
        ? object
        : baseForRight(object, getIteratee(iteratee, 3), keysIn);
    }

    /**
     * Iterates over own enumerable string keyed properties of an object and
     * invokes `iteratee` for each property. The iteratee is invoked with three
     * arguments: (value, key, object). Iteratee functions may exit iteration
     * early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @since 0.3.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forOwnRight
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'a' then 'b' (iteration order is not guaranteed).
     */
    function forOwn(object, iteratee) {
      return object && baseForOwn(object, getIteratee(iteratee, 3));
    }

    /**
     * This method is like `_.forOwn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forOwn
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwnRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'b' then 'a' assuming `_.forOwn` logs 'a' then 'b'.
     */
    function forOwnRight(object, iteratee) {
      return object && baseForOwnRight(object, getIteratee(iteratee, 3));
    }

    /**
     * Creates an array of function property names from own enumerable properties
     * of `object`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the function names.
     * @see _.functionsIn
     * @example
     *
     * function Foo() {
     *   this.a = _.constant('a');
     *   this.b = _.constant('b');
     * }
     *
     * Foo.prototype.c = _.constant('c');
     *
     * _.functions(new Foo);
     * // => ['a', 'b']
     */
    function functions(object) {
      return object == null ? [] : baseFunctions(object, keys(object));
    }

    /**
     * Creates an array of function property names from own and inherited
     * enumerable properties of `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the function names.
     * @see _.functions
     * @example
     *
     * function Foo() {
     *   this.a = _.constant('a');
     *   this.b = _.constant('b');
     * }
     *
     * Foo.prototype.c = _.constant('c');
     *
     * _.functionsIn(new Foo);
     * // => ['a', 'b', 'c']
     */
    function functionsIn(object) {
      return object == null ? [] : baseFunctions(object, keysIn(object));
    }

    /**
     * Gets the value at `path` of `object`. If the resolved value is
     * `undefined`, the `defaultValue` is returned in its place.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @param {*} [defaultValue] The value returned for `undefined` resolved values.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.get(object, 'a[0].b.c');
     * // => 3
     *
     * _.get(object, ['a', '0', 'b', 'c']);
     * // => 3
     *
     * _.get(object, 'a.b.c', 'default');
     * // => 'default'
     */
    function get(object, path, defaultValue) {
      var result = object == null ? undefined : baseGet(object, path);
      return result === undefined ? defaultValue : result;
    }

    /**
     * Checks if `path` is a direct property of `object`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     * @example
     *
     * var object = { 'a': { 'b': 2 } };
     * var other = _.create({ 'a': _.create({ 'b': 2 }) });
     *
     * _.has(object, 'a');
     * // => true
     *
     * _.has(object, 'a.b');
     * // => true
     *
     * _.has(object, ['a', 'b']);
     * // => true
     *
     * _.has(other, 'a');
     * // => false
     */
    function has(object, path) {
      return object != null && hasPath(object, path, baseHas);
    }

    /**
     * Checks if `path` is a direct or inherited property of `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     * @example
     *
     * var object = _.create({ 'a': _.create({ 'b': 2 }) });
     *
     * _.hasIn(object, 'a');
     * // => true
     *
     * _.hasIn(object, 'a.b');
     * // => true
     *
     * _.hasIn(object, ['a', 'b']);
     * // => true
     *
     * _.hasIn(object, 'b');
     * // => false
     */
    function hasIn(object, path) {
      return object != null && hasPath(object, path, baseHasIn);
    }

    /**
     * Creates an object composed of the inverted keys and values of `object`.
     * If `object` contains duplicate values, subsequent values overwrite
     * property assignments of previous values.
     *
     * @static
     * @memberOf _
     * @since 0.7.0
     * @category Object
     * @param {Object} object The object to invert.
     * @returns {Object} Returns the new inverted object.
     * @example
     *
     * var object = { 'a': 1, 'b': 2, 'c': 1 };
     *
     * _.invert(object);
     * // => { '1': 'c', '2': 'b' }
     */
    var invert = createInverter(function(result, value, key) {
      if (value != null &&
          typeof value.toString != 'function') {
        value = nativeObjectToString.call(value);
      }

      result[value] = key;
    }, constant(identity));

    /**
     * This method is like `_.invert` except that the inverted object is generated
     * from the results of running each element of `object` thru `iteratee`. The
     * corresponding inverted value of each inverted key is an array of keys
     * responsible for generating the inverted value. The iteratee is invoked
     * with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.1.0
     * @category Object
     * @param {Object} object The object to invert.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Object} Returns the new inverted object.
     * @example
     *
     * var object = { 'a': 1, 'b': 2, 'c': 1 };
     *
     * _.invertBy(object);
     * // => { '1': ['a', 'c'], '2': ['b'] }
     *
     * _.invertBy(object, function(value) {
     *   return 'group' + value;
     * });
     * // => { 'group1': ['a', 'c'], 'group2': ['b'] }
     */
    var invertBy = createInverter(function(result, value, key) {
      if (value != null &&
          typeof value.toString != 'function') {
        value = nativeObjectToString.call(value);
      }

      if (hasOwnProperty.call(result, value)) {
        result[value].push(key);
      } else {
        result[value] = [key];
      }
    }, getIteratee);

    /**
     * Invokes the method at `path` of `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the method to invoke.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {*} Returns the result of the invoked method.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': [1, 2, 3, 4] } }] };
     *
     * _.invoke(object, 'a[0].b.c.slice', 1, 3);
     * // => [2, 3]
     */
    var invoke = baseRest(baseInvoke);

    /**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */
    function keys(object) {
      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    }

    /**
     * Creates an array of the own and inherited enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keysIn(new Foo);
     * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
     */
    function keysIn(object) {
      return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
    }

    /**
     * The opposite of `_.mapValues`; this method creates an object with the
     * same values as `object` and keys generated by running each own enumerable
     * string keyed property of `object` thru `iteratee`. The iteratee is invoked
     * with three arguments: (value, key, object).
     *
     * @static
     * @memberOf _
     * @since 3.8.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns the new mapped object.
     * @see _.mapValues
     * @example
     *
     * _.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
     *   return key + value;
     * });
     * // => { 'a1': 1, 'b2': 2 }
     */
    function mapKeys(object, iteratee) {
      var result = {};
      iteratee = getIteratee(iteratee, 3);

      baseForOwn(object, function(value, key, object) {
        baseAssignValue(result, iteratee(value, key, object), value);
      });
      return result;
    }

    /**
     * Creates an object with the same keys as `object` and values generated
     * by running each own enumerable string keyed property of `object` thru
     * `iteratee`. The iteratee is invoked with three arguments:
     * (value, key, object).
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns the new mapped object.
     * @see _.mapKeys
     * @example
     *
     * var users = {
     *   'fred':    { 'user': 'fred',    'age': 40 },
     *   'pebbles': { 'user': 'pebbles', 'age': 1 }
     * };
     *
     * _.mapValues(users, function(o) { return o.age; });
     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
     *
     * // The `_.property` iteratee shorthand.
     * _.mapValues(users, 'age');
     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
     */
    function mapValues(object, iteratee) {
      var result = {};
      iteratee = getIteratee(iteratee, 3);

      baseForOwn(object, function(value, key, object) {
        baseAssignValue(result, key, iteratee(value, key, object));
      });
      return result;
    }

    /**
     * This method is like `_.assign` except that it recursively merges own and
     * inherited enumerable string keyed properties of source objects into the
     * destination object. Source properties that resolve to `undefined` are
     * skipped if a destination value exists. Array and plain object properties
     * are merged recursively. Other objects and value types are overridden by
     * assignment. Source objects are applied from left to right. Subsequent
     * sources overwrite property assignments of previous sources.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 0.5.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = {
     *   'a': [{ 'b': 2 }, { 'd': 4 }]
     * };
     *
     * var other = {
     *   'a': [{ 'c': 3 }, { 'e': 5 }]
     * };
     *
     * _.merge(object, other);
     * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
     */
    var merge = createAssigner(function(object, source, srcIndex) {
      baseMerge(object, source, srcIndex);
    });

    /**
     * This method is like `_.merge` except that it accepts `customizer` which
     * is invoked to produce the merged values of the destination and source
     * properties. If `customizer` returns `undefined`, merging is handled by the
     * method instead. The `customizer` is invoked with six arguments:
     * (objValue, srcValue, key, object, source, stack).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @param {Function} customizer The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   if (_.isArray(objValue)) {
     *     return objValue.concat(srcValue);
     *   }
     * }
     *
     * var object = { 'a': [1], 'b': [2] };
     * var other = { 'a': [3], 'b': [4] };
     *
     * _.mergeWith(object, other, customizer);
     * // => { 'a': [1, 3], 'b': [2, 4] }
     */
    var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
      baseMerge(object, source, srcIndex, customizer);
    });

    /**
     * The opposite of `_.pick`; this method creates an object composed of the
     * own and inherited enumerable property paths of `object` that are not omitted.
     *
     * **Note:** This method is considerably slower than `_.pick`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {...(string|string[])} [paths] The property paths to omit.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.omit(object, ['a', 'c']);
     * // => { 'b': '2' }
     */
    var omit = flatRest(function(object, paths) {
      var result = {};
      if (object == null) {
        return result;
      }
      var isDeep = false;
      paths = arrayMap(paths, function(path) {
        path = castPath(path, object);
        isDeep || (isDeep = path.length > 1);
        return path;
      });
      copyObject(object, getAllKeysIn(object), result);
      if (isDeep) {
        result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
      }
      var length = paths.length;
      while (length--) {
        baseUnset(result, paths[length]);
      }
      return result;
    });

    /**
     * The opposite of `_.pickBy`; this method creates an object composed of
     * the own and inherited enumerable string keyed properties of `object` that
     * `predicate` doesn't return truthy for. The predicate is invoked with two
     * arguments: (value, key).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The source object.
     * @param {Function} [predicate=_.identity] The function invoked per property.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.omitBy(object, _.isNumber);
     * // => { 'b': '2' }
     */
    function omitBy(object, predicate) {
      return pickBy(object, negate(getIteratee(predicate)));
    }

    /**
     * Creates an object composed of the picked `object` properties.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {...(string|string[])} [paths] The property paths to pick.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.pick(object, ['a', 'c']);
     * // => { 'a': 1, 'c': 3 }
     */
    var pick = flatRest(function(object, paths) {
      return object == null ? {} : basePick(object, paths);
    });

    /**
     * Creates an object composed of the `object` properties `predicate` returns
     * truthy for. The predicate is invoked with two arguments: (value, key).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The source object.
     * @param {Function} [predicate=_.identity] The function invoked per property.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.pickBy(object, _.isNumber);
     * // => { 'a': 1, 'c': 3 }
     */
    function pickBy(object, predicate) {
      if (object == null) {
        return {};
      }
      var props = arrayMap(getAllKeysIn(object), function(prop) {
        return [prop];
      });
      predicate = getIteratee(predicate);
      return basePickBy(object, props, function(value, path) {
        return predicate(value, path[0]);
      });
    }

    /**
     * This method is like `_.get` except that if the resolved value is a
     * function it's invoked with the `this` binding of its parent object and
     * its result is returned.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to resolve.
     * @param {*} [defaultValue] The value returned for `undefined` resolved values.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
     *
     * _.result(object, 'a[0].b.c1');
     * // => 3
     *
     * _.result(object, 'a[0].b.c2');
     * // => 4
     *
     * _.result(object, 'a[0].b.c3', 'default');
     * // => 'default'
     *
     * _.result(object, 'a[0].b.c3', _.constant('default'));
     * // => 'default'
     */
    function result(object, path, defaultValue) {
      path = castPath(path, object);

      var index = -1,
          length = path.length;

      // Ensure the loop is entered when path is empty.
      if (!length) {
        length = 1;
        object = undefined;
      }
      while (++index < length) {
        var value = object == null ? undefined : object[toKey(path[index])];
        if (value === undefined) {
          index = length;
          value = defaultValue;
        }
        object = isFunction(value) ? value.call(object) : value;
      }
      return object;
    }

    /**
     * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
     * it's created. Arrays are created for missing index properties while objects
     * are created for all other missing properties. Use `_.setWith` to customize
     * `path` creation.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.set(object, 'a[0].b.c', 4);
     * console.log(object.a[0].b.c);
     * // => 4
     *
     * _.set(object, ['x', '0', 'y', 'z'], 5);
     * console.log(object.x[0].y.z);
     * // => 5
     */
    function set(object, path, value) {
      return object == null ? object : baseSet(object, path, value);
    }

    /**
     * This method is like `_.set` except that it accepts `customizer` which is
     * invoked to produce the objects of `path`.  If `customizer` returns `undefined`
     * path creation is handled by the method instead. The `customizer` is invoked
     * with three arguments: (nsValue, key, nsObject).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = {};
     *
     * _.setWith(object, '[0][1]', 'a', Object);
     * // => { '0': { '1': 'a' } }
     */
    function setWith(object, path, value, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return object == null ? object : baseSet(object, path, value, customizer);
    }

    /**
     * Creates an array of own enumerable string keyed-value pairs for `object`
     * which can be consumed by `_.fromPairs`. If `object` is a map or set, its
     * entries are returned.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias entries
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the key-value pairs.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.toPairs(new Foo);
     * // => [['a', 1], ['b', 2]] (iteration order is not guaranteed)
     */
    var toPairs = createToPairs(keys);

    /**
     * Creates an array of own and inherited enumerable string keyed-value pairs
     * for `object` which can be consumed by `_.fromPairs`. If `object` is a map
     * or set, its entries are returned.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias entriesIn
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the key-value pairs.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.toPairsIn(new Foo);
     * // => [['a', 1], ['b', 2], ['c', 3]] (iteration order is not guaranteed)
     */
    var toPairsIn = createToPairs(keysIn);

    /**
     * An alternative to `_.reduce`; this method transforms `object` to a new
     * `accumulator` object which is the result of running each of its own
     * enumerable string keyed properties thru `iteratee`, with each invocation
     * potentially mutating the `accumulator` object. If `accumulator` is not
     * provided, a new object with the same `[[Prototype]]` will be used. The
     * iteratee is invoked with four arguments: (accumulator, value, key, object).
     * Iteratee functions may exit iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @since 1.3.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The custom accumulator value.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * _.transform([2, 3, 4], function(result, n) {
     *   result.push(n *= n);
     *   return n % 2 == 0;
     * }, []);
     * // => [4, 9]
     *
     * _.transform({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
     *   (result[value] || (result[value] = [])).push(key);
     * }, {});
     * // => { '1': ['a', 'c'], '2': ['b'] }
     */
    function transform(object, iteratee, accumulator) {
      var isArr = isArray(object),
          isArrLike = isArr || isBuffer(object) || isTypedArray(object);

      iteratee = getIteratee(iteratee, 4);
      if (accumulator == null) {
        var Ctor = object && object.constructor;
        if (isArrLike) {
          accumulator = isArr ? new Ctor : [];
        }
        else if (isObject(object)) {
          accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
        }
        else {
          accumulator = {};
        }
      }
      (isArrLike ? arrayEach : baseForOwn)(object, function(value, index, object) {
        return iteratee(accumulator, value, index, object);
      });
      return accumulator;
    }

    /**
     * Removes the property at `path` of `object`.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to unset.
     * @returns {boolean} Returns `true` if the property is deleted, else `false`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 7 } }] };
     * _.unset(object, 'a[0].b.c');
     * // => true
     *
     * console.log(object);
     * // => { 'a': [{ 'b': {} }] };
     *
     * _.unset(object, ['a', '0', 'b', 'c']);
     * // => true
     *
     * console.log(object);
     * // => { 'a': [{ 'b': {} }] };
     */
    function unset(object, path) {
      return object == null ? true : baseUnset(object, path);
    }

    /**
     * This method is like `_.set` except that accepts `updater` to produce the
     * value to set. Use `_.updateWith` to customize `path` creation. The `updater`
     * is invoked with one argument: (value).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.6.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {Function} updater The function to produce the updated value.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.update(object, 'a[0].b.c', function(n) { return n * n; });
     * console.log(object.a[0].b.c);
     * // => 9
     *
     * _.update(object, 'x[0].y.z', function(n) { return n ? n + 1 : 0; });
     * console.log(object.x[0].y.z);
     * // => 0
     */
    function update(object, path, updater) {
      return object == null ? object : baseUpdate(object, path, castFunction(updater));
    }

    /**
     * This method is like `_.update` except that it accepts `customizer` which is
     * invoked to produce the objects of `path`.  If `customizer` returns `undefined`
     * path creation is handled by the method instead. The `customizer` is invoked
     * with three arguments: (nsValue, key, nsObject).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.6.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {Function} updater The function to produce the updated value.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = {};
     *
     * _.updateWith(object, '[0][1]', _.constant('a'), Object);
     * // => { '0': { '1': 'a' } }
     */
    function updateWith(object, path, updater, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return object == null ? object : baseUpdate(object, path, castFunction(updater), customizer);
    }

    /**
     * Creates an array of the own enumerable string keyed property values of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.values(new Foo);
     * // => [1, 2] (iteration order is not guaranteed)
     *
     * _.values('hi');
     * // => ['h', 'i']
     */
    function values(object) {
      return object == null ? [] : baseValues(object, keys(object));
    }

    /**
     * Creates an array of the own and inherited enumerable string keyed property
     * values of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.valuesIn(new Foo);
     * // => [1, 2, 3] (iteration order is not guaranteed)
     */
    function valuesIn(object) {
      return object == null ? [] : baseValues(object, keysIn(object));
    }

    /*------------------------------------------------------------------------*/

    /**
     * Clamps `number` within the inclusive `lower` and `upper` bounds.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Number
     * @param {number} number The number to clamp.
     * @param {number} [lower] The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the clamped number.
     * @example
     *
     * _.clamp(-10, -5, 5);
     * // => -5
     *
     * _.clamp(10, -5, 5);
     * // => 5
     */
    function clamp(number, lower, upper) {
      if (upper === undefined) {
        upper = lower;
        lower = undefined;
      }
      if (upper !== undefined) {
        upper = toNumber(upper);
        upper = upper === upper ? upper : 0;
      }
      if (lower !== undefined) {
        lower = toNumber(lower);
        lower = lower === lower ? lower : 0;
      }
      return baseClamp(toNumber(number), lower, upper);
    }

    /**
     * Checks if `n` is between `start` and up to, but not including, `end`. If
     * `end` is not specified, it's set to `start` with `start` then set to `0`.
     * If `start` is greater than `end` the params are swapped to support
     * negative ranges.
     *
     * @static
     * @memberOf _
     * @since 3.3.0
     * @category Number
     * @param {number} number The number to check.
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
     * @see _.range, _.rangeRight
     * @example
     *
     * _.inRange(3, 2, 4);
     * // => true
     *
     * _.inRange(4, 8);
     * // => true
     *
     * _.inRange(4, 2);
     * // => false
     *
     * _.inRange(2, 2);
     * // => false
     *
     * _.inRange(1.2, 2);
     * // => true
     *
     * _.inRange(5.2, 4);
     * // => false
     *
     * _.inRange(-3, -2, -6);
     * // => true
     */
    function inRange(number, start, end) {
      start = toFinite(start);
      if (end === undefined) {
        end = start;
        start = 0;
      } else {
        end = toFinite(end);
      }
      number = toNumber(number);
      return baseInRange(number, start, end);
    }

    /**
     * Produces a random number between the inclusive `lower` and `upper` bounds.
     * If only one argument is provided a number between `0` and the given number
     * is returned. If `floating` is `true`, or either `lower` or `upper` are
     * floats, a floating-point number is returned instead of an integer.
     *
     * **Note:** JavaScript follows the IEEE-754 standard for resolving
     * floating-point values which can produce unexpected results.
     *
     * @static
     * @memberOf _
     * @since 0.7.0
     * @category Number
     * @param {number} [lower=0] The lower bound.
     * @param {number} [upper=1] The upper bound.
     * @param {boolean} [floating] Specify returning a floating-point number.
     * @returns {number} Returns the random number.
     * @example
     *
     * _.random(0, 5);
     * // => an integer between 0 and 5
     *
     * _.random(5);
     * // => also an integer between 0 and 5
     *
     * _.random(5, true);
     * // => a floating-point number between 0 and 5
     *
     * _.random(1.2, 5.2);
     * // => a floating-point number between 1.2 and 5.2
     */
    function random(lower, upper, floating) {
      if (floating && typeof floating != 'boolean' && isIterateeCall(lower, upper, floating)) {
        upper = floating = undefined;
      }
      if (floating === undefined) {
        if (typeof upper == 'boolean') {
          floating = upper;
          upper = undefined;
        }
        else if (typeof lower == 'boolean') {
          floating = lower;
          lower = undefined;
        }
      }
      if (lower === undefined && upper === undefined) {
        lower = 0;
        upper = 1;
      }
      else {
        lower = toFinite(lower);
        if (upper === undefined) {
          upper = lower;
          lower = 0;
        } else {
          upper = toFinite(upper);
        }
      }
      if (lower > upper) {
        var temp = lower;
        lower = upper;
        upper = temp;
      }
      if (floating || lower % 1 || upper % 1) {
        var rand = nativeRandom();
        return nativeMin(lower + (rand * (upper - lower + freeParseFloat('1e-' + ((rand + '').length - 1)))), upper);
      }
      return baseRandom(lower, upper);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the camel cased string.
     * @example
     *
     * _.camelCase('Foo Bar');
     * // => 'fooBar'
     *
     * _.camelCase('--foo-bar--');
     * // => 'fooBar'
     *
     * _.camelCase('__FOO_BAR__');
     * // => 'fooBar'
     */
    var camelCase = createCompounder(function(result, word, index) {
      word = word.toLowerCase();
      return result + (index ? capitalize(word) : word);
    });

    /**
     * Converts the first character of `string` to upper case and the remaining
     * to lower case.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to capitalize.
     * @returns {string} Returns the capitalized string.
     * @example
     *
     * _.capitalize('FRED');
     * // => 'Fred'
     */
    function capitalize(string) {
      return upperFirst(toString(string).toLowerCase());
    }

    /**
     * Deburrs `string` by converting
     * [Latin-1 Supplement](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
     * and [Latin Extended-A](https://en.wikipedia.org/wiki/Latin_Extended-A)
     * letters to basic Latin letters and removing
     * [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to deburr.
     * @returns {string} Returns the deburred string.
     * @example
     *
     * _.deburr('déjà vu');
     * // => 'deja vu'
     */
    function deburr(string) {
      string = toString(string);
      return string && string.replace(reLatin, deburrLetter).replace(reComboMark, '');
    }

    /**
     * Checks if `string` ends with the given target string.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {string} [target] The string to search for.
     * @param {number} [position=string.length] The position to search up to.
     * @returns {boolean} Returns `true` if `string` ends with `target`,
     *  else `false`.
     * @example
     *
     * _.endsWith('abc', 'c');
     * // => true
     *
     * _.endsWith('abc', 'b');
     * // => false
     *
     * _.endsWith('abc', 'b', 2);
     * // => true
     */
    function endsWith(string, target, position) {
      string = toString(string);
      target = baseToString(target);

      var length = string.length;
      position = position === undefined
        ? length
        : baseClamp(toInteger(position), 0, length);

      var end = position;
      position -= target.length;
      return position >= 0 && string.slice(position, end) == target;
    }

    /**
     * Converts the characters "&", "<", ">", '"', and "'" in `string` to their
     * corresponding HTML entities.
     *
     * **Note:** No other characters are escaped. To escape additional
     * characters use a third-party library like [_he_](https://mths.be/he).
     *
     * Though the ">" character is escaped for symmetry, characters like
     * ">" and "/" don't need escaping in HTML and have no special meaning
     * unless they're part of a tag or unquoted attribute value. See
     * [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
     * (under "semi-related fun fact") for more details.
     *
     * When working with HTML you should always
     * [quote attribute values](http://wonko.com/post/html-escaping) to reduce
     * XSS vectors.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escape('fred, barney, & pebbles');
     * // => 'fred, barney, &amp; pebbles'
     */
    function escape(string) {
      string = toString(string);
      return (string && reHasUnescapedHtml.test(string))
        ? string.replace(reUnescapedHtml, escapeHtmlChar)
        : string;
    }

    /**
     * Escapes the `RegExp` special characters "^", "$", "\", ".", "*", "+",
     * "?", "(", ")", "[", "]", "{", "}", and "|" in `string`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escapeRegExp('[lodash](https://lodash.com/)');
     * // => '\[lodash\]\(https://lodash\.com/\)'
     */
    function escapeRegExp(string) {
      string = toString(string);
      return (string && reHasRegExpChar.test(string))
        ? string.replace(reRegExpChar, '\\$&')
        : string;
    }

    /**
     * Converts `string` to
     * [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the kebab cased string.
     * @example
     *
     * _.kebabCase('Foo Bar');
     * // => 'foo-bar'
     *
     * _.kebabCase('fooBar');
     * // => 'foo-bar'
     *
     * _.kebabCase('__FOO_BAR__');
     * // => 'foo-bar'
     */
    var kebabCase = createCompounder(function(result, word, index) {
      return result + (index ? '-' : '') + word.toLowerCase();
    });

    /**
     * Converts `string`, as space separated words, to lower case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the lower cased string.
     * @example
     *
     * _.lowerCase('--Foo-Bar--');
     * // => 'foo bar'
     *
     * _.lowerCase('fooBar');
     * // => 'foo bar'
     *
     * _.lowerCase('__FOO_BAR__');
     * // => 'foo bar'
     */
    var lowerCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + word.toLowerCase();
    });

    /**
     * Converts the first character of `string` to lower case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.lowerFirst('Fred');
     * // => 'fred'
     *
     * _.lowerFirst('FRED');
     * // => 'fRED'
     */
    var lowerFirst = createCaseFirst('toLowerCase');

    /**
     * Pads `string` on the left and right sides if it's shorter than `length`.
     * Padding characters are truncated if they can't be evenly divided by `length`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.pad('abc', 8);
     * // => '  abc   '
     *
     * _.pad('abc', 8, '_-');
     * // => '_-abc_-_'
     *
     * _.pad('abc', 3);
     * // => 'abc'
     */
    function pad(string, length, chars) {
      string = toString(string);
      length = toInteger(length);

      var strLength = length ? stringSize(string) : 0;
      if (!length || strLength >= length) {
        return string;
      }
      var mid = (length - strLength) / 2;
      return (
        createPadding(nativeFloor(mid), chars) +
        string +
        createPadding(nativeCeil(mid), chars)
      );
    }

    /**
     * Pads `string` on the right side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padEnd('abc', 6);
     * // => 'abc   '
     *
     * _.padEnd('abc', 6, '_-');
     * // => 'abc_-_'
     *
     * _.padEnd('abc', 3);
     * // => 'abc'
     */
    function padEnd(string, length, chars) {
      string = toString(string);
      length = toInteger(length);

      var strLength = length ? stringSize(string) : 0;
      return (length && strLength < length)
        ? (string + createPadding(length - strLength, chars))
        : string;
    }

    /**
     * Pads `string` on the left side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padStart('abc', 6);
     * // => '   abc'
     *
     * _.padStart('abc', 6, '_-');
     * // => '_-_abc'
     *
     * _.padStart('abc', 3);
     * // => 'abc'
     */
    function padStart(string, length, chars) {
      string = toString(string);
      length = toInteger(length);

      var strLength = length ? stringSize(string) : 0;
      return (length && strLength < length)
        ? (createPadding(length - strLength, chars) + string)
        : string;
    }

    /**
     * Converts `string` to an integer of the specified radix. If `radix` is
     * `undefined` or `0`, a `radix` of `10` is used unless `value` is a
     * hexadecimal, in which case a `radix` of `16` is used.
     *
     * **Note:** This method aligns with the
     * [ES5 implementation](https://es5.github.io/#x15.1.2.2) of `parseInt`.
     *
     * @static
     * @memberOf _
     * @since 1.1.0
     * @category String
     * @param {string} string The string to convert.
     * @param {number} [radix=10] The radix to interpret `value` by.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.parseInt('08');
     * // => 8
     *
     * _.map(['6', '08', '10'], _.parseInt);
     * // => [6, 8, 10]
     */
    function parseInt(string, radix, guard) {
      if (guard || radix == null) {
        radix = 0;
      } else if (radix) {
        radix = +radix;
      }
      return nativeParseInt(toString(string).replace(reTrimStart, ''), radix || 0);
    }

    /**
     * Repeats the given string `n` times.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to repeat.
     * @param {number} [n=1] The number of times to repeat the string.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the repeated string.
     * @example
     *
     * _.repeat('*', 3);
     * // => '***'
     *
     * _.repeat('abc', 2);
     * // => 'abcabc'
     *
     * _.repeat('abc', 0);
     * // => ''
     */
    function repeat(string, n, guard) {
      if ((guard ? isIterateeCall(string, n, guard) : n === undefined)) {
        n = 1;
      } else {
        n = toInteger(n);
      }
      return baseRepeat(toString(string), n);
    }

    /**
     * Replaces matches for `pattern` in `string` with `replacement`.
     *
     * **Note:** This method is based on
     * [`String#replace`](https://mdn.io/String/replace).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to modify.
     * @param {RegExp|string} pattern The pattern to replace.
     * @param {Function|string} replacement The match replacement.
     * @returns {string} Returns the modified string.
     * @example
     *
     * _.replace('Hi Fred', 'Fred', 'Barney');
     * // => 'Hi Barney'
     */
    function replace() {
      var args = arguments,
          string = toString(args[0]);

      return args.length < 3 ? string : string.replace(args[1], args[2]);
    }

    /**
     * Converts `string` to
     * [snake case](https://en.wikipedia.org/wiki/Snake_case).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the snake cased string.
     * @example
     *
     * _.snakeCase('Foo Bar');
     * // => 'foo_bar'
     *
     * _.snakeCase('fooBar');
     * // => 'foo_bar'
     *
     * _.snakeCase('--FOO-BAR--');
     * // => 'foo_bar'
     */
    var snakeCase = createCompounder(function(result, word, index) {
      return result + (index ? '_' : '') + word.toLowerCase();
    });

    /**
     * Splits `string` by `separator`.
     *
     * **Note:** This method is based on
     * [`String#split`](https://mdn.io/String/split).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to split.
     * @param {RegExp|string} separator The separator pattern to split by.
     * @param {number} [limit] The length to truncate results to.
     * @returns {Array} Returns the string segments.
     * @example
     *
     * _.split('a-b-c', '-', 2);
     * // => ['a', 'b']
     */
    function split(string, separator, limit) {
      if (limit && typeof limit != 'number' && isIterateeCall(string, separator, limit)) {
        separator = limit = undefined;
      }
      limit = limit === undefined ? MAX_ARRAY_LENGTH : limit >>> 0;
      if (!limit) {
        return [];
      }
      string = toString(string);
      if (string && (
            typeof separator == 'string' ||
            (separator != null && !isRegExp(separator))
          )) {
        separator = baseToString(separator);
        if (!separator && hasUnicode(string)) {
          return castSlice(stringToArray(string), 0, limit);
        }
      }
      return string.split(separator, limit);
    }

    /**
     * Converts `string` to
     * [start case](https://en.wikipedia.org/wiki/Letter_case#Stylistic_or_specialised_usage).
     *
     * @static
     * @memberOf _
     * @since 3.1.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the start cased string.
     * @example
     *
     * _.startCase('--foo-bar--');
     * // => 'Foo Bar'
     *
     * _.startCase('fooBar');
     * // => 'Foo Bar'
     *
     * _.startCase('__FOO_BAR__');
     * // => 'FOO BAR'
     */
    var startCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + upperFirst(word);
    });

    /**
     * Checks if `string` starts with the given target string.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {string} [target] The string to search for.
     * @param {number} [position=0] The position to search from.
     * @returns {boolean} Returns `true` if `string` starts with `target`,
     *  else `false`.
     * @example
     *
     * _.startsWith('abc', 'a');
     * // => true
     *
     * _.startsWith('abc', 'b');
     * // => false
     *
     * _.startsWith('abc', 'b', 1);
     * // => true
     */
    function startsWith(string, target, position) {
      string = toString(string);
      position = position == null
        ? 0
        : baseClamp(toInteger(position), 0, string.length);

      target = baseToString(target);
      return string.slice(position, position + target.length) == target;
    }

    /**
     * Creates a compiled template function that can interpolate data properties
     * in "interpolate" delimiters, HTML-escape interpolated data properties in
     * "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
     * properties may be accessed as free variables in the template. If a setting
     * object is given, it takes precedence over `_.templateSettings` values.
     *
     * **Note:** In the development build `_.template` utilizes
     * [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
     * for easier debugging.
     *
     * For more information on precompiling templates see
     * [lodash's custom builds documentation](https://lodash.com/custom-builds).
     *
     * For more information on Chrome extension sandboxes see
     * [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category String
     * @param {string} [string=''] The template string.
     * @param {Object} [options={}] The options object.
     * @param {RegExp} [options.escape=_.templateSettings.escape]
     *  The HTML "escape" delimiter.
     * @param {RegExp} [options.evaluate=_.templateSettings.evaluate]
     *  The "evaluate" delimiter.
     * @param {Object} [options.imports=_.templateSettings.imports]
     *  An object to import into the template as free variables.
     * @param {RegExp} [options.interpolate=_.templateSettings.interpolate]
     *  The "interpolate" delimiter.
     * @param {string} [options.sourceURL='lodash.templateSources[n]']
     *  The sourceURL of the compiled template.
     * @param {string} [options.variable='obj']
     *  The data object variable name.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the compiled template function.
     * @example
     *
     * // Use the "interpolate" delimiter to create a compiled template.
     * var compiled = _.template('hello <%= user %>!');
     * compiled({ 'user': 'fred' });
     * // => 'hello fred!'
     *
     * // Use the HTML "escape" delimiter to escape data property values.
     * var compiled = _.template('<b><%- value %></b>');
     * compiled({ 'value': '<script>' });
     * // => '<b>&lt;script&gt;</b>'
     *
     * // Use the "evaluate" delimiter to execute JavaScript and generate HTML.
     * var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // Use the internal `print` function in "evaluate" delimiters.
     * var compiled = _.template('<% print("hello " + user); %>!');
     * compiled({ 'user': 'barney' });
     * // => 'hello barney!'
     *
     * // Use the ES template literal delimiter as an "interpolate" delimiter.
     * // Disable support by replacing the "interpolate" delimiter.
     * var compiled = _.template('hello ${ user }!');
     * compiled({ 'user': 'pebbles' });
     * // => 'hello pebbles!'
     *
     * // Use backslashes to treat delimiters as plain text.
     * var compiled = _.template('<%= "\\<%- value %\\>" %>');
     * compiled({ 'value': 'ignored' });
     * // => '<%- value %>'
     *
     * // Use the `imports` option to import `jQuery` as `jq`.
     * var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
     * var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // Use the `sourceURL` option to specify a custom sourceURL for the template.
     * var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
     * compiled(data);
     * // => Find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector.
     *
     * // Use the `variable` option to ensure a with-statement isn't used in the compiled template.
     * var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
     * compiled.source;
     * // => function(data) {
     * //   var __t, __p = '';
     * //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
     * //   return __p;
     * // }
     *
     * // Use custom template delimiters.
     * _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
     * var compiled = _.template('hello {{ user }}!');
     * compiled({ 'user': 'mustache' });
     * // => 'hello mustache!'
     *
     * // Use the `source` property to inline compiled templates for meaningful
     * // line numbers in error messages and stack traces.
     * fs.writeFileSync(path.join(process.cwd(), 'jst.js'), '\
     *   var JST = {\
     *     "main": ' + _.template(mainText).source + '\
     *   };\
     * ');
     */
    function template(string, options, guard) {
      // Based on John Resig's `tmpl` implementation
      // (http://ejohn.org/blog/javascript-micro-templating/)
      // and Laura Doktorova's doT.js (https://github.com/olado/doT).
      var settings = lodash.templateSettings;

      if (guard && isIterateeCall(string, options, guard)) {
        options = undefined;
      }
      string = toString(string);
      options = assignInWith({}, options, settings, customDefaultsAssignIn);

      var imports = assignInWith({}, options.imports, settings.imports, customDefaultsAssignIn),
          importsKeys = keys(imports),
          importsValues = baseValues(imports, importsKeys);

      var isEscaping,
          isEvaluating,
          index = 0,
          interpolate = options.interpolate || reNoMatch,
          source = "__p += '";

      // Compile the regexp to match each delimiter.
      var reDelimiters = RegExp(
        (options.escape || reNoMatch).source + '|' +
        interpolate.source + '|' +
        (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
        (options.evaluate || reNoMatch).source + '|$'
      , 'g');

      // Use a sourceURL for easier debugging.
      // The sourceURL gets injected into the source that's eval-ed, so be careful
      // with lookup (in case of e.g. prototype pollution), and strip newlines if any.
      // A newline wouldn't be a valid sourceURL anyway, and it'd enable code injection.
      var sourceURL = '//# sourceURL=' +
        (hasOwnProperty.call(options, 'sourceURL')
          ? (options.sourceURL + '').replace(/[\r\n]/g, ' ')
          : ('lodash.templateSources[' + (++templateCounter) + ']')
        ) + '\n';

      string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
        interpolateValue || (interpolateValue = esTemplateValue);

        // Escape characters that can't be included in string literals.
        source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);

        // Replace delimiters with snippets.
        if (escapeValue) {
          isEscaping = true;
          source += "' +\n__e(" + escapeValue + ") +\n'";
        }
        if (evaluateValue) {
          isEvaluating = true;
          source += "';\n" + evaluateValue + ";\n__p += '";
        }
        if (interpolateValue) {
          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
        }
        index = offset + match.length;

        // The JS engine embedded in Adobe products needs `match` returned in
        // order to produce the correct `offset` value.
        return match;
      });

      source += "';\n";

      // If `variable` is not specified wrap a with-statement around the generated
      // code to add the data object to the top of the scope chain.
      // Like with sourceURL, we take care to not check the option's prototype,
      // as this configuration is a code injection vector.
      var variable = hasOwnProperty.call(options, 'variable') && options.variable;
      if (!variable) {
        source = 'with (obj) {\n' + source + '\n}\n';
      }
      // Cleanup code by stripping empty strings.
      source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
        .replace(reEmptyStringMiddle, '$1')
        .replace(reEmptyStringTrailing, '$1;');

      // Frame code as the function body.
      source = 'function(' + (variable || 'obj') + ') {\n' +
        (variable
          ? ''
          : 'obj || (obj = {});\n'
        ) +
        "var __t, __p = ''" +
        (isEscaping
           ? ', __e = _.escape'
           : ''
        ) +
        (isEvaluating
          ? ', __j = Array.prototype.join;\n' +
            "function print() { __p += __j.call(arguments, '') }\n"
          : ';\n'
        ) +
        source +
        'return __p\n}';

      var result = attempt(function() {
        return Function(importsKeys, sourceURL + 'return ' + source)
          .apply(undefined, importsValues);
      });

      // Provide the compiled function's source by its `toString` method or
      // the `source` property as a convenience for inlining compiled templates.
      result.source = source;
      if (isError(result)) {
        throw result;
      }
      return result;
    }

    /**
     * Converts `string`, as a whole, to lower case just like
     * [String#toLowerCase](https://mdn.io/toLowerCase).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the lower cased string.
     * @example
     *
     * _.toLower('--Foo-Bar--');
     * // => '--foo-bar--'
     *
     * _.toLower('fooBar');
     * // => 'foobar'
     *
     * _.toLower('__FOO_BAR__');
     * // => '__foo_bar__'
     */
    function toLower(value) {
      return toString(value).toLowerCase();
    }

    /**
     * Converts `string`, as a whole, to upper case just like
     * [String#toUpperCase](https://mdn.io/toUpperCase).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the upper cased string.
     * @example
     *
     * _.toUpper('--foo-bar--');
     * // => '--FOO-BAR--'
     *
     * _.toUpper('fooBar');
     * // => 'FOOBAR'
     *
     * _.toUpper('__foo_bar__');
     * // => '__FOO_BAR__'
     */
    function toUpper(value) {
      return toString(value).toUpperCase();
    }

    /**
     * Removes leading and trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trim('  abc  ');
     * // => 'abc'
     *
     * _.trim('-_-abc-_-', '_-');
     * // => 'abc'
     *
     * _.map(['  foo  ', '  bar  '], _.trim);
     * // => ['foo', 'bar']
     */
    function trim(string, chars, guard) {
      string = toString(string);
      if (string && (guard || chars === undefined)) {
        return string.replace(reTrim, '');
      }
      if (!string || !(chars = baseToString(chars))) {
        return string;
      }
      var strSymbols = stringToArray(string),
          chrSymbols = stringToArray(chars),
          start = charsStartIndex(strSymbols, chrSymbols),
          end = charsEndIndex(strSymbols, chrSymbols) + 1;

      return castSlice(strSymbols, start, end).join('');
    }

    /**
     * Removes trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimEnd('  abc  ');
     * // => '  abc'
     *
     * _.trimEnd('-_-abc-_-', '_-');
     * // => '-_-abc'
     */
    function trimEnd(string, chars, guard) {
      string = toString(string);
      if (string && (guard || chars === undefined)) {
        return string.replace(reTrimEnd, '');
      }
      if (!string || !(chars = baseToString(chars))) {
        return string;
      }
      var strSymbols = stringToArray(string),
          end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;

      return castSlice(strSymbols, 0, end).join('');
    }

    /**
     * Removes leading whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimStart('  abc  ');
     * // => 'abc  '
     *
     * _.trimStart('-_-abc-_-', '_-');
     * // => 'abc-_-'
     */
    function trimStart(string, chars, guard) {
      string = toString(string);
      if (string && (guard || chars === undefined)) {
        return string.replace(reTrimStart, '');
      }
      if (!string || !(chars = baseToString(chars))) {
        return string;
      }
      var strSymbols = stringToArray(string),
          start = charsStartIndex(strSymbols, stringToArray(chars));

      return castSlice(strSymbols, start).join('');
    }

    /**
     * Truncates `string` if it's longer than the given maximum string length.
     * The last characters of the truncated string are replaced with the omission
     * string which defaults to "...".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to truncate.
     * @param {Object} [options={}] The options object.
     * @param {number} [options.length=30] The maximum string length.
     * @param {string} [options.omission='...'] The string to indicate text is omitted.
     * @param {RegExp|string} [options.separator] The separator pattern to truncate to.
     * @returns {string} Returns the truncated string.
     * @example
     *
     * _.truncate('hi-diddly-ho there, neighborino');
     * // => 'hi-diddly-ho there, neighbo...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': ' '
     * });
     * // => 'hi-diddly-ho there,...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': /,? +/
     * });
     * // => 'hi-diddly-ho there...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'omission': ' [...]'
     * });
     * // => 'hi-diddly-ho there, neig [...]'
     */
    function truncate(string, options) {
      var length = DEFAULT_TRUNC_LENGTH,
          omission = DEFAULT_TRUNC_OMISSION;

      if (isObject(options)) {
        var separator = 'separator' in options ? options.separator : separator;
        length = 'length' in options ? toInteger(options.length) : length;
        omission = 'omission' in options ? baseToString(options.omission) : omission;
      }
      string = toString(string);

      var strLength = string.length;
      if (hasUnicode(string)) {
        var strSymbols = stringToArray(string);
        strLength = strSymbols.length;
      }
      if (length >= strLength) {
        return string;
      }
      var end = length - stringSize(omission);
      if (end < 1) {
        return omission;
      }
      var result = strSymbols
        ? castSlice(strSymbols, 0, end).join('')
        : string.slice(0, end);

      if (separator === undefined) {
        return result + omission;
      }
      if (strSymbols) {
        end += (result.length - end);
      }
      if (isRegExp(separator)) {
        if (string.slice(end).search(separator)) {
          var match,
              substring = result;

          if (!separator.global) {
            separator = RegExp(separator.source, toString(reFlags.exec(separator)) + 'g');
          }
          separator.lastIndex = 0;
          while ((match = separator.exec(substring))) {
            var newEnd = match.index;
          }
          result = result.slice(0, newEnd === undefined ? end : newEnd);
        }
      } else if (string.indexOf(baseToString(separator), end) != end) {
        var index = result.lastIndexOf(separator);
        if (index > -1) {
          result = result.slice(0, index);
        }
      }
      return result + omission;
    }

    /**
     * The inverse of `_.escape`; this method converts the HTML entities
     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to
     * their corresponding characters.
     *
     * **Note:** No other HTML entities are unescaped. To unescape additional
     * HTML entities use a third-party library like [_he_](https://mths.be/he).
     *
     * @static
     * @memberOf _
     * @since 0.6.0
     * @category String
     * @param {string} [string=''] The string to unescape.
     * @returns {string} Returns the unescaped string.
     * @example
     *
     * _.unescape('fred, barney, &amp; pebbles');
     * // => 'fred, barney, & pebbles'
     */
    function unescape(string) {
      string = toString(string);
      return (string && reHasEscapedHtml.test(string))
        ? string.replace(reEscapedHtml, unescapeHtmlChar)
        : string;
    }

    /**
     * Converts `string`, as space separated words, to upper case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the upper cased string.
     * @example
     *
     * _.upperCase('--foo-bar');
     * // => 'FOO BAR'
     *
     * _.upperCase('fooBar');
     * // => 'FOO BAR'
     *
     * _.upperCase('__foo_bar__');
     * // => 'FOO BAR'
     */
    var upperCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + word.toUpperCase();
    });

    /**
     * Converts the first character of `string` to upper case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.upperFirst('fred');
     * // => 'Fred'
     *
     * _.upperFirst('FRED');
     * // => 'FRED'
     */
    var upperFirst = createCaseFirst('toUpperCase');

    /**
     * Splits `string` into an array of its words.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {RegExp|string} [pattern] The pattern to match words.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the words of `string`.
     * @example
     *
     * _.words('fred, barney, & pebbles');
     * // => ['fred', 'barney', 'pebbles']
     *
     * _.words('fred, barney, & pebbles', /[^, ]+/g);
     * // => ['fred', 'barney', '&', 'pebbles']
     */
    function words(string, pattern, guard) {
      string = toString(string);
      pattern = guard ? undefined : pattern;

      if (pattern === undefined) {
        return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
      }
      return string.match(pattern) || [];
    }

    /*------------------------------------------------------------------------*/

    /**
     * Attempts to invoke `func`, returning either the result or the caught error
     * object. Any additional arguments are provided to `func` when it's invoked.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {Function} func The function to attempt.
     * @param {...*} [args] The arguments to invoke `func` with.
     * @returns {*} Returns the `func` result or error object.
     * @example
     *
     * // Avoid throwing errors for invalid selectors.
     * var elements = _.attempt(function(selector) {
     *   return document.querySelectorAll(selector);
     * }, '>_>');
     *
     * if (_.isError(elements)) {
     *   elements = [];
     * }
     */
    var attempt = baseRest(function(func, args) {
      try {
        return apply(func, undefined, args);
      } catch (e) {
        return isError(e) ? e : new Error(e);
      }
    });

    /**
     * Binds methods of an object to the object itself, overwriting the existing
     * method.
     *
     * **Note:** This method doesn't set the "length" property of bound functions.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {Object} object The object to bind and assign the bound methods to.
     * @param {...(string|string[])} methodNames The object method names to bind.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var view = {
     *   'label': 'docs',
     *   'click': function() {
     *     console.log('clicked ' + this.label);
     *   }
     * };
     *
     * _.bindAll(view, ['click']);
     * jQuery(element).on('click', view.click);
     * // => Logs 'clicked docs' when clicked.
     */
    var bindAll = flatRest(function(object, methodNames) {
      arrayEach(methodNames, function(key) {
        key = toKey(key);
        baseAssignValue(object, key, bind(object[key], object));
      });
      return object;
    });

    /**
     * Creates a function that iterates over `pairs` and invokes the corresponding
     * function of the first predicate to return truthy. The predicate-function
     * pairs are invoked with the `this` binding and arguments of the created
     * function.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {Array} pairs The predicate-function pairs.
     * @returns {Function} Returns the new composite function.
     * @example
     *
     * var func = _.cond([
     *   [_.matches({ 'a': 1 }),           _.constant('matches A')],
     *   [_.conforms({ 'b': _.isNumber }), _.constant('matches B')],
     *   [_.stubTrue,                      _.constant('no match')]
     * ]);
     *
     * func({ 'a': 1, 'b': 2 });
     * // => 'matches A'
     *
     * func({ 'a': 0, 'b': 1 });
     * // => 'matches B'
     *
     * func({ 'a': '1', 'b': '2' });
     * // => 'no match'
     */
    function cond(pairs) {
      var length = pairs == null ? 0 : pairs.length,
          toIteratee = getIteratee();

      pairs = !length ? [] : arrayMap(pairs, function(pair) {
        if (typeof pair[1] != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        return [toIteratee(pair[0]), pair[1]];
      });

      return baseRest(function(args) {
        var index = -1;
        while (++index < length) {
          var pair = pairs[index];
          if (apply(pair[0], this, args)) {
            return apply(pair[1], this, args);
          }
        }
      });
    }

    /**
     * Creates a function that invokes the predicate properties of `source` with
     * the corresponding property values of a given object, returning `true` if
     * all predicates return truthy, else `false`.
     *
     * **Note:** The created function is equivalent to `_.conformsTo` with
     * `source` partially applied.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {Object} source The object of property predicates to conform to.
     * @returns {Function} Returns the new spec function.
     * @example
     *
     * var objects = [
     *   { 'a': 2, 'b': 1 },
     *   { 'a': 1, 'b': 2 }
     * ];
     *
     * _.filter(objects, _.conforms({ 'b': function(n) { return n > 1; } }));
     * // => [{ 'a': 1, 'b': 2 }]
     */
    function conforms(source) {
      return baseConforms(baseClone(source, CLONE_DEEP_FLAG));
    }

    /**
     * Creates a function that returns `value`.
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Util
     * @param {*} value The value to return from the new function.
     * @returns {Function} Returns the new constant function.
     * @example
     *
     * var objects = _.times(2, _.constant({ 'a': 1 }));
     *
     * console.log(objects);
     * // => [{ 'a': 1 }, { 'a': 1 }]
     *
     * console.log(objects[0] === objects[1]);
     * // => true
     */
    function constant(value) {
      return function() {
        return value;
      };
    }

    /**
     * Checks `value` to determine whether a default value should be returned in
     * its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
     * or `undefined`.
     *
     * @static
     * @memberOf _
     * @since 4.14.0
     * @category Util
     * @param {*} value The value to check.
     * @param {*} defaultValue The default value.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * _.defaultTo(1, 10);
     * // => 1
     *
     * _.defaultTo(undefined, 10);
     * // => 10
     */
    function defaultTo(value, defaultValue) {
      return (value == null || value !== value) ? defaultValue : value;
    }

    /**
     * Creates a function that returns the result of invoking the given functions
     * with the `this` binding of the created function, where each successive
     * invocation is supplied the return value of the previous.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {...(Function|Function[])} [funcs] The functions to invoke.
     * @returns {Function} Returns the new composite function.
     * @see _.flowRight
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flow([_.add, square]);
     * addSquare(1, 2);
     * // => 9
     */
    var flow = createFlow();

    /**
     * This method is like `_.flow` except that it creates a function that
     * invokes the given functions from right to left.
     *
     * @static
     * @since 3.0.0
     * @memberOf _
     * @category Util
     * @param {...(Function|Function[])} [funcs] The functions to invoke.
     * @returns {Function} Returns the new composite function.
     * @see _.flow
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flowRight([square, _.add]);
     * addSquare(1, 2);
     * // => 9
     */
    var flowRight = createFlow(true);

    /**
     * This method returns the first argument it receives.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {*} value Any value.
     * @returns {*} Returns `value`.
     * @example
     *
     * var object = { 'a': 1 };
     *
     * console.log(_.identity(object) === object);
     * // => true
     */
    function identity(value) {
      return value;
    }

    /**
     * Creates a function that invokes `func` with the arguments of the created
     * function. If `func` is a property name, the created function returns the
     * property value for a given element. If `func` is an array or object, the
     * created function returns `true` for elements that contain the equivalent
     * source properties, otherwise it returns `false`.
     *
     * @static
     * @since 4.0.0
     * @memberOf _
     * @category Util
     * @param {*} [func=_.identity] The value to convert to a callback.
     * @returns {Function} Returns the callback.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * // The `_.matches` iteratee shorthand.
     * _.filter(users, _.iteratee({ 'user': 'barney', 'active': true }));
     * // => [{ 'user': 'barney', 'age': 36, 'active': true }]
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.filter(users, _.iteratee(['user', 'fred']));
     * // => [{ 'user': 'fred', 'age': 40 }]
     *
     * // The `_.property` iteratee shorthand.
     * _.map(users, _.iteratee('user'));
     * // => ['barney', 'fred']
     *
     * // Create custom iteratee shorthands.
     * _.iteratee = _.wrap(_.iteratee, function(iteratee, func) {
     *   return !_.isRegExp(func) ? iteratee(func) : function(string) {
     *     return func.test(string);
     *   };
     * });
     *
     * _.filter(['abc', 'def'], /ef/);
     * // => ['def']
     */
    function iteratee(func) {
      return baseIteratee(typeof func == 'function' ? func : baseClone(func, CLONE_DEEP_FLAG));
    }

    /**
     * Creates a function that performs a partial deep comparison between a given
     * object and `source`, returning `true` if the given object has equivalent
     * property values, else `false`.
     *
     * **Note:** The created function is equivalent to `_.isMatch` with `source`
     * partially applied.
     *
     * Partial comparisons will match empty array and empty object `source`
     * values against any array or object value, respectively. See `_.isEqual`
     * for a list of supported value comparisons.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new spec function.
     * @example
     *
     * var objects = [
     *   { 'a': 1, 'b': 2, 'c': 3 },
     *   { 'a': 4, 'b': 5, 'c': 6 }
     * ];
     *
     * _.filter(objects, _.matches({ 'a': 4, 'c': 6 }));
     * // => [{ 'a': 4, 'b': 5, 'c': 6 }]
     */
    function matches(source) {
      return baseMatches(baseClone(source, CLONE_DEEP_FLAG));
    }

    /**
     * Creates a function that performs a partial deep comparison between the
     * value at `path` of a given object to `srcValue`, returning `true` if the
     * object value is equivalent, else `false`.
     *
     * **Note:** Partial comparisons will match empty array and empty object
     * `srcValue` values against any array or object value, respectively. See
     * `_.isEqual` for a list of supported value comparisons.
     *
     * @static
     * @memberOf _
     * @since 3.2.0
     * @category Util
     * @param {Array|string} path The path of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new spec function.
     * @example
     *
     * var objects = [
     *   { 'a': 1, 'b': 2, 'c': 3 },
     *   { 'a': 4, 'b': 5, 'c': 6 }
     * ];
     *
     * _.find(objects, _.matchesProperty('a', 4));
     * // => { 'a': 4, 'b': 5, 'c': 6 }
     */
    function matchesProperty(path, srcValue) {
      return baseMatchesProperty(path, baseClone(srcValue, CLONE_DEEP_FLAG));
    }

    /**
     * Creates a function that invokes the method at `path` of a given object.
     * Any additional arguments are provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Util
     * @param {Array|string} path The path of the method to invoke.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new invoker function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': _.constant(2) } },
     *   { 'a': { 'b': _.constant(1) } }
     * ];
     *
     * _.map(objects, _.method('a.b'));
     * // => [2, 1]
     *
     * _.map(objects, _.method(['a', 'b']));
     * // => [2, 1]
     */
    var method = baseRest(function(path, args) {
      return function(object) {
        return baseInvoke(object, path, args);
      };
    });

    /**
     * The opposite of `_.method`; this method creates a function that invokes
     * the method at a given path of `object`. Any additional arguments are
     * provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Util
     * @param {Object} object The object to query.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new invoker function.
     * @example
     *
     * var array = _.times(3, _.constant),
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.methodOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.methodOf(object));
     * // => [2, 0]
     */
    var methodOf = baseRest(function(object, args) {
      return function(path) {
        return baseInvoke(object, path, args);
      };
    });

    /**
     * Adds all own enumerable string keyed function properties of a source
     * object to the destination object. If `object` is a function, then methods
     * are added to its prototype as well.
     *
     * **Note:** Use `_.runInContext` to create a pristine `lodash` function to
     * avoid conflicts caused by modifying the original.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {Function|Object} [object=lodash] The destination object.
     * @param {Object} source The object of functions to add.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.chain=true] Specify whether mixins are chainable.
     * @returns {Function|Object} Returns `object`.
     * @example
     *
     * function vowels(string) {
     *   return _.filter(string, function(v) {
     *     return /[aeiou]/i.test(v);
     *   });
     * }
     *
     * _.mixin({ 'vowels': vowels });
     * _.vowels('fred');
     * // => ['e']
     *
     * _('fred').vowels().value();
     * // => ['e']
     *
     * _.mixin({ 'vowels': vowels }, { 'chain': false });
     * _('fred').vowels();
     * // => ['e']
     */
    function mixin(object, source, options) {
      var props = keys(source),
          methodNames = baseFunctions(source, props);

      if (options == null &&
          !(isObject(source) && (methodNames.length || !props.length))) {
        options = source;
        source = object;
        object = this;
        methodNames = baseFunctions(source, keys(source));
      }
      var chain = !(isObject(options) && 'chain' in options) || !!options.chain,
          isFunc = isFunction(object);

      arrayEach(methodNames, function(methodName) {
        var func = source[methodName];
        object[methodName] = func;
        if (isFunc) {
          object.prototype[methodName] = function() {
            var chainAll = this.__chain__;
            if (chain || chainAll) {
              var result = object(this.__wrapped__),
                  actions = result.__actions__ = copyArray(this.__actions__);

              actions.push({ 'func': func, 'args': arguments, 'thisArg': object });
              result.__chain__ = chainAll;
              return result;
            }
            return func.apply(object, arrayPush([this.value()], arguments));
          };
        }
      });

      return object;
    }

    /**
     * Reverts the `_` variable to its previous value and returns a reference to
     * the `lodash` function.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @returns {Function} Returns the `lodash` function.
     * @example
     *
     * var lodash = _.noConflict();
     */
    function noConflict() {
      if (root._ === this) {
        root._ = oldDash;
      }
      return this;
    }

    /**
     * This method returns `undefined`.
     *
     * @static
     * @memberOf _
     * @since 2.3.0
     * @category Util
     * @example
     *
     * _.times(2, _.noop);
     * // => [undefined, undefined]
     */
    function noop() {
      // No operation performed.
    }

    /**
     * Creates a function that gets the argument at index `n`. If `n` is negative,
     * the nth argument from the end is returned.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {number} [n=0] The index of the argument to return.
     * @returns {Function} Returns the new pass-thru function.
     * @example
     *
     * var func = _.nthArg(1);
     * func('a', 'b', 'c', 'd');
     * // => 'b'
     *
     * var func = _.nthArg(-2);
     * func('a', 'b', 'c', 'd');
     * // => 'c'
     */
    function nthArg(n) {
      n = toInteger(n);
      return baseRest(function(args) {
        return baseNth(args, n);
      });
    }

    /**
     * Creates a function that invokes `iteratees` with the arguments it receives
     * and returns their results.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {...(Function|Function[])} [iteratees=[_.identity]]
     *  The iteratees to invoke.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.over([Math.max, Math.min]);
     *
     * func(1, 2, 3, 4);
     * // => [4, 1]
     */
    var over = createOver(arrayMap);

    /**
     * Creates a function that checks if **all** of the `predicates` return
     * truthy when invoked with the arguments it receives.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {...(Function|Function[])} [predicates=[_.identity]]
     *  The predicates to check.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.overEvery([Boolean, isFinite]);
     *
     * func('1');
     * // => true
     *
     * func(null);
     * // => false
     *
     * func(NaN);
     * // => false
     */
    var overEvery = createOver(arrayEvery);

    /**
     * Creates a function that checks if **any** of the `predicates` return
     * truthy when invoked with the arguments it receives.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {...(Function|Function[])} [predicates=[_.identity]]
     *  The predicates to check.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.overSome([Boolean, isFinite]);
     *
     * func('1');
     * // => true
     *
     * func(null);
     * // => true
     *
     * func(NaN);
     * // => false
     */
    var overSome = createOver(arraySome);

    /**
     * Creates a function that returns the value at `path` of a given object.
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Util
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new accessor function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': 2 } },
     *   { 'a': { 'b': 1 } }
     * ];
     *
     * _.map(objects, _.property('a.b'));
     * // => [2, 1]
     *
     * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
     * // => [1, 2]
     */
    function property(path) {
      return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
    }

    /**
     * The opposite of `_.property`; this method creates a function that returns
     * the value at a given path of `object`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {Object} object The object to query.
     * @returns {Function} Returns the new accessor function.
     * @example
     *
     * var array = [0, 1, 2],
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.propertyOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.propertyOf(object));
     * // => [2, 0]
     */
    function propertyOf(object) {
      return function(path) {
        return object == null ? undefined : baseGet(object, path);
      };
    }

    /**
     * Creates an array of numbers (positive and/or negative) progressing from
     * `start` up to, but not including, `end`. A step of `-1` is used if a negative
     * `start` is specified without an `end` or `step`. If `end` is not specified,
     * it's set to `start` with `start` then set to `0`.
     *
     * **Note:** JavaScript follows the IEEE-754 standard for resolving
     * floating-point values which can produce unexpected results.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns the range of numbers.
     * @see _.inRange, _.rangeRight
     * @example
     *
     * _.range(4);
     * // => [0, 1, 2, 3]
     *
     * _.range(-4);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 5);
     * // => [1, 2, 3, 4]
     *
     * _.range(0, 20, 5);
     * // => [0, 5, 10, 15]
     *
     * _.range(0, -4, -1);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.range(0);
     * // => []
     */
    var range = createRange();

    /**
     * This method is like `_.range` except that it populates values in
     * descending order.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns the range of numbers.
     * @see _.inRange, _.range
     * @example
     *
     * _.rangeRight(4);
     * // => [3, 2, 1, 0]
     *
     * _.rangeRight(-4);
     * // => [-3, -2, -1, 0]
     *
     * _.rangeRight(1, 5);
     * // => [4, 3, 2, 1]
     *
     * _.rangeRight(0, 20, 5);
     * // => [15, 10, 5, 0]
     *
     * _.rangeRight(0, -4, -1);
     * // => [-3, -2, -1, 0]
     *
     * _.rangeRight(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.rangeRight(0);
     * // => []
     */
    var rangeRight = createRange(true);

    /**
     * This method returns a new empty array.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {Array} Returns the new empty array.
     * @example
     *
     * var arrays = _.times(2, _.stubArray);
     *
     * console.log(arrays);
     * // => [[], []]
     *
     * console.log(arrays[0] === arrays[1]);
     * // => false
     */
    function stubArray() {
      return [];
    }

    /**
     * This method returns `false`.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {boolean} Returns `false`.
     * @example
     *
     * _.times(2, _.stubFalse);
     * // => [false, false]
     */
    function stubFalse() {
      return false;
    }

    /**
     * This method returns a new empty object.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {Object} Returns the new empty object.
     * @example
     *
     * var objects = _.times(2, _.stubObject);
     *
     * console.log(objects);
     * // => [{}, {}]
     *
     * console.log(objects[0] === objects[1]);
     * // => false
     */
    function stubObject() {
      return {};
    }

    /**
     * This method returns an empty string.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {string} Returns the empty string.
     * @example
     *
     * _.times(2, _.stubString);
     * // => ['', '']
     */
    function stubString() {
      return '';
    }

    /**
     * This method returns `true`.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {boolean} Returns `true`.
     * @example
     *
     * _.times(2, _.stubTrue);
     * // => [true, true]
     */
    function stubTrue() {
      return true;
    }

    /**
     * Invokes the iteratee `n` times, returning an array of the results of
     * each invocation. The iteratee is invoked with one argument; (index).
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * _.times(3, String);
     * // => ['0', '1', '2']
     *
     *  _.times(4, _.constant(0));
     * // => [0, 0, 0, 0]
     */
    function times(n, iteratee) {
      n = toInteger(n);
      if (n < 1 || n > MAX_SAFE_INTEGER) {
        return [];
      }
      var index = MAX_ARRAY_LENGTH,
          length = nativeMin(n, MAX_ARRAY_LENGTH);

      iteratee = getIteratee(iteratee);
      n -= MAX_ARRAY_LENGTH;

      var result = baseTimes(length, iteratee);
      while (++index < n) {
        iteratee(index);
      }
      return result;
    }

    /**
     * Converts `value` to a property path array.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {*} value The value to convert.
     * @returns {Array} Returns the new property path array.
     * @example
     *
     * _.toPath('a.b.c');
     * // => ['a', 'b', 'c']
     *
     * _.toPath('a[0].b.c');
     * // => ['a', '0', 'b', 'c']
     */
    function toPath(value) {
      if (isArray(value)) {
        return arrayMap(value, toKey);
      }
      return isSymbol(value) ? [value] : copyArray(stringToPath(toString(value)));
    }

    /**
     * Generates a unique ID. If `prefix` is given, the ID is appended to it.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {string} [prefix=''] The value to prefix the ID with.
     * @returns {string} Returns the unique ID.
     * @example
     *
     * _.uniqueId('contact_');
     * // => 'contact_104'
     *
     * _.uniqueId();
     * // => '105'
     */
    function uniqueId(prefix) {
      var id = ++idCounter;
      return toString(prefix) + id;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Adds two numbers.
     *
     * @static
     * @memberOf _
     * @since 3.4.0
     * @category Math
     * @param {number} augend The first number in an addition.
     * @param {number} addend The second number in an addition.
     * @returns {number} Returns the total.
     * @example
     *
     * _.add(6, 4);
     * // => 10
     */
    var add = createMathOperation(function(augend, addend) {
      return augend + addend;
    }, 0);

    /**
     * Computes `number` rounded up to `precision`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Math
     * @param {number} number The number to round up.
     * @param {number} [precision=0] The precision to round up to.
     * @returns {number} Returns the rounded up number.
     * @example
     *
     * _.ceil(4.006);
     * // => 5
     *
     * _.ceil(6.004, 2);
     * // => 6.01
     *
     * _.ceil(6040, -2);
     * // => 6100
     */
    var ceil = createRound('ceil');

    /**
     * Divide two numbers.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Math
     * @param {number} dividend The first number in a division.
     * @param {number} divisor The second number in a division.
     * @returns {number} Returns the quotient.
     * @example
     *
     * _.divide(6, 4);
     * // => 1.5
     */
    var divide = createMathOperation(function(dividend, divisor) {
      return dividend / divisor;
    }, 1);

    /**
     * Computes `number` rounded down to `precision`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Math
     * @param {number} number The number to round down.
     * @param {number} [precision=0] The precision to round down to.
     * @returns {number} Returns the rounded down number.
     * @example
     *
     * _.floor(4.006);
     * // => 4
     *
     * _.floor(0.046, 2);
     * // => 0.04
     *
     * _.floor(4060, -2);
     * // => 4000
     */
    var floor = createRound('floor');

    /**
     * Computes the maximum value of `array`. If `array` is empty or falsey,
     * `undefined` is returned.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * _.max([4, 2, 8, 6]);
     * // => 8
     *
     * _.max([]);
     * // => undefined
     */
    function max(array) {
      return (array && array.length)
        ? baseExtremum(array, identity, baseGt)
        : undefined;
    }

    /**
     * This method is like `_.max` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the criterion by which
     * the value is ranked. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * var objects = [{ 'n': 1 }, { 'n': 2 }];
     *
     * _.maxBy(objects, function(o) { return o.n; });
     * // => { 'n': 2 }
     *
     * // The `_.property` iteratee shorthand.
     * _.maxBy(objects, 'n');
     * // => { 'n': 2 }
     */
    function maxBy(array, iteratee) {
      return (array && array.length)
        ? baseExtremum(array, getIteratee(iteratee, 2), baseGt)
        : undefined;
    }

    /**
     * Computes the mean of the values in `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {number} Returns the mean.
     * @example
     *
     * _.mean([4, 2, 8, 6]);
     * // => 5
     */
    function mean(array) {
      return baseMean(array, identity);
    }

    /**
     * This method is like `_.mean` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the value to be averaged.
     * The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the mean.
     * @example
     *
     * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
     *
     * _.meanBy(objects, function(o) { return o.n; });
     * // => 5
     *
     * // The `_.property` iteratee shorthand.
     * _.meanBy(objects, 'n');
     * // => 5
     */
    function meanBy(array, iteratee) {
      return baseMean(array, getIteratee(iteratee, 2));
    }

    /**
     * Computes the minimum value of `array`. If `array` is empty or falsey,
     * `undefined` is returned.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * _.min([4, 2, 8, 6]);
     * // => 2
     *
     * _.min([]);
     * // => undefined
     */
    function min(array) {
      return (array && array.length)
        ? baseExtremum(array, identity, baseLt)
        : undefined;
    }

    /**
     * This method is like `_.min` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the criterion by which
     * the value is ranked. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * var objects = [{ 'n': 1 }, { 'n': 2 }];
     *
     * _.minBy(objects, function(o) { return o.n; });
     * // => { 'n': 1 }
     *
     * // The `_.property` iteratee shorthand.
     * _.minBy(objects, 'n');
     * // => { 'n': 1 }
     */
    function minBy(array, iteratee) {
      return (array && array.length)
        ? baseExtremum(array, getIteratee(iteratee, 2), baseLt)
        : undefined;
    }

    /**
     * Multiply two numbers.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Math
     * @param {number} multiplier The first number in a multiplication.
     * @param {number} multiplicand The second number in a multiplication.
     * @returns {number} Returns the product.
     * @example
     *
     * _.multiply(6, 4);
     * // => 24
     */
    var multiply = createMathOperation(function(multiplier, multiplicand) {
      return multiplier * multiplicand;
    }, 1);

    /**
     * Computes `number` rounded to `precision`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Math
     * @param {number} number The number to round.
     * @param {number} [precision=0] The precision to round to.
     * @returns {number} Returns the rounded number.
     * @example
     *
     * _.round(4.006);
     * // => 4
     *
     * _.round(4.006, 2);
     * // => 4.01
     *
     * _.round(4060, -2);
     * // => 4100
     */
    var round = createRound('round');

    /**
     * Subtract two numbers.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {number} minuend The first number in a subtraction.
     * @param {number} subtrahend The second number in a subtraction.
     * @returns {number} Returns the difference.
     * @example
     *
     * _.subtract(6, 4);
     * // => 2
     */
    var subtract = createMathOperation(function(minuend, subtrahend) {
      return minuend - subtrahend;
    }, 0);

    /**
     * Computes the sum of the values in `array`.
     *
     * @static
     * @memberOf _
     * @since 3.4.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {number} Returns the sum.
     * @example
     *
     * _.sum([4, 2, 8, 6]);
     * // => 20
     */
    function sum(array) {
      return (array && array.length)
        ? baseSum(array, identity)
        : 0;
    }

    /**
     * This method is like `_.sum` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the value to be summed.
     * The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the sum.
     * @example
     *
     * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
     *
     * _.sumBy(objects, function(o) { return o.n; });
     * // => 20
     *
     * // The `_.property` iteratee shorthand.
     * _.sumBy(objects, 'n');
     * // => 20
     */
    function sumBy(array, iteratee) {
      return (array && array.length)
        ? baseSum(array, getIteratee(iteratee, 2))
        : 0;
    }

    /*------------------------------------------------------------------------*/

    // Add methods that return wrapped values in chain sequences.
    lodash.after = after;
    lodash.ary = ary;
    lodash.assign = assign;
    lodash.assignIn = assignIn;
    lodash.assignInWith = assignInWith;
    lodash.assignWith = assignWith;
    lodash.at = at;
    lodash.before = before;
    lodash.bind = bind;
    lodash.bindAll = bindAll;
    lodash.bindKey = bindKey;
    lodash.castArray = castArray;
    lodash.chain = chain;
    lodash.chunk = chunk;
    lodash.compact = compact;
    lodash.concat = concat;
    lodash.cond = cond;
    lodash.conforms = conforms;
    lodash.constant = constant;
    lodash.countBy = countBy;
    lodash.create = create;
    lodash.curry = curry;
    lodash.curryRight = curryRight;
    lodash.debounce = debounce;
    lodash.defaults = defaults;
    lodash.defaultsDeep = defaultsDeep;
    lodash.defer = defer;
    lodash.delay = delay;
    lodash.difference = difference;
    lodash.differenceBy = differenceBy;
    lodash.differenceWith = differenceWith;
    lodash.drop = drop;
    lodash.dropRight = dropRight;
    lodash.dropRightWhile = dropRightWhile;
    lodash.dropWhile = dropWhile;
    lodash.fill = fill;
    lodash.filter = filter;
    lodash.flatMap = flatMap;
    lodash.flatMapDeep = flatMapDeep;
    lodash.flatMapDepth = flatMapDepth;
    lodash.flatten = flatten;
    lodash.flattenDeep = flattenDeep;
    lodash.flattenDepth = flattenDepth;
    lodash.flip = flip;
    lodash.flow = flow;
    lodash.flowRight = flowRight;
    lodash.fromPairs = fromPairs;
    lodash.functions = functions;
    lodash.functionsIn = functionsIn;
    lodash.groupBy = groupBy;
    lodash.initial = initial;
    lodash.intersection = intersection;
    lodash.intersectionBy = intersectionBy;
    lodash.intersectionWith = intersectionWith;
    lodash.invert = invert;
    lodash.invertBy = invertBy;
    lodash.invokeMap = invokeMap;
    lodash.iteratee = iteratee;
    lodash.keyBy = keyBy;
    lodash.keys = keys;
    lodash.keysIn = keysIn;
    lodash.map = map;
    lodash.mapKeys = mapKeys;
    lodash.mapValues = mapValues;
    lodash.matches = matches;
    lodash.matchesProperty = matchesProperty;
    lodash.memoize = memoize;
    lodash.merge = merge;
    lodash.mergeWith = mergeWith;
    lodash.method = method;
    lodash.methodOf = methodOf;
    lodash.mixin = mixin;
    lodash.negate = negate;
    lodash.nthArg = nthArg;
    lodash.omit = omit;
    lodash.omitBy = omitBy;
    lodash.once = once;
    lodash.orderBy = orderBy;
    lodash.over = over;
    lodash.overArgs = overArgs;
    lodash.overEvery = overEvery;
    lodash.overSome = overSome;
    lodash.partial = partial;
    lodash.partialRight = partialRight;
    lodash.partition = partition;
    lodash.pick = pick;
    lodash.pickBy = pickBy;
    lodash.property = property;
    lodash.propertyOf = propertyOf;
    lodash.pull = pull;
    lodash.pullAll = pullAll;
    lodash.pullAllBy = pullAllBy;
    lodash.pullAllWith = pullAllWith;
    lodash.pullAt = pullAt;
    lodash.range = range;
    lodash.rangeRight = rangeRight;
    lodash.rearg = rearg;
    lodash.reject = reject;
    lodash.remove = remove;
    lodash.rest = rest;
    lodash.reverse = reverse;
    lodash.sampleSize = sampleSize;
    lodash.set = set;
    lodash.setWith = setWith;
    lodash.shuffle = shuffle;
    lodash.slice = slice;
    lodash.sortBy = sortBy;
    lodash.sortedUniq = sortedUniq;
    lodash.sortedUniqBy = sortedUniqBy;
    lodash.split = split;
    lodash.spread = spread;
    lodash.tail = tail;
    lodash.take = take;
    lodash.takeRight = takeRight;
    lodash.takeRightWhile = takeRightWhile;
    lodash.takeWhile = takeWhile;
    lodash.tap = tap;
    lodash.throttle = throttle;
    lodash.thru = thru;
    lodash.toArray = toArray;
    lodash.toPairs = toPairs;
    lodash.toPairsIn = toPairsIn;
    lodash.toPath = toPath;
    lodash.toPlainObject = toPlainObject;
    lodash.transform = transform;
    lodash.unary = unary;
    lodash.union = union;
    lodash.unionBy = unionBy;
    lodash.unionWith = unionWith;
    lodash.uniq = uniq;
    lodash.uniqBy = uniqBy;
    lodash.uniqWith = uniqWith;
    lodash.unset = unset;
    lodash.unzip = unzip;
    lodash.unzipWith = unzipWith;
    lodash.update = update;
    lodash.updateWith = updateWith;
    lodash.values = values;
    lodash.valuesIn = valuesIn;
    lodash.without = without;
    lodash.words = words;
    lodash.wrap = wrap;
    lodash.xor = xor;
    lodash.xorBy = xorBy;
    lodash.xorWith = xorWith;
    lodash.zip = zip;
    lodash.zipObject = zipObject;
    lodash.zipObjectDeep = zipObjectDeep;
    lodash.zipWith = zipWith;

    // Add aliases.
    lodash.entries = toPairs;
    lodash.entriesIn = toPairsIn;
    lodash.extend = assignIn;
    lodash.extendWith = assignInWith;

    // Add methods to `lodash.prototype`.
    mixin(lodash, lodash);

    /*------------------------------------------------------------------------*/

    // Add methods that return unwrapped values in chain sequences.
    lodash.add = add;
    lodash.attempt = attempt;
    lodash.camelCase = camelCase;
    lodash.capitalize = capitalize;
    lodash.ceil = ceil;
    lodash.clamp = clamp;
    lodash.clone = clone;
    lodash.cloneDeep = cloneDeep;
    lodash.cloneDeepWith = cloneDeepWith;
    lodash.cloneWith = cloneWith;
    lodash.conformsTo = conformsTo;
    lodash.deburr = deburr;
    lodash.defaultTo = defaultTo;
    lodash.divide = divide;
    lodash.endsWith = endsWith;
    lodash.eq = eq;
    lodash.escape = escape;
    lodash.escapeRegExp = escapeRegExp;
    lodash.every = every;
    lodash.find = find;
    lodash.findIndex = findIndex;
    lodash.findKey = findKey;
    lodash.findLast = findLast;
    lodash.findLastIndex = findLastIndex;
    lodash.findLastKey = findLastKey;
    lodash.floor = floor;
    lodash.forEach = forEach;
    lodash.forEachRight = forEachRight;
    lodash.forIn = forIn;
    lodash.forInRight = forInRight;
    lodash.forOwn = forOwn;
    lodash.forOwnRight = forOwnRight;
    lodash.get = get;
    lodash.gt = gt;
    lodash.gte = gte;
    lodash.has = has;
    lodash.hasIn = hasIn;
    lodash.head = head;
    lodash.identity = identity;
    lodash.includes = includes;
    lodash.indexOf = indexOf;
    lodash.inRange = inRange;
    lodash.invoke = invoke;
    lodash.isArguments = isArguments;
    lodash.isArray = isArray;
    lodash.isArrayBuffer = isArrayBuffer;
    lodash.isArrayLike = isArrayLike;
    lodash.isArrayLikeObject = isArrayLikeObject;
    lodash.isBoolean = isBoolean;
    lodash.isBuffer = isBuffer;
    lodash.isDate = isDate;
    lodash.isElement = isElement;
    lodash.isEmpty = isEmpty;
    lodash.isEqual = isEqual;
    lodash.isEqualWith = isEqualWith;
    lodash.isError = isError;
    lodash.isFinite = isFinite;
    lodash.isFunction = isFunction;
    lodash.isInteger = isInteger;
    lodash.isLength = isLength;
    lodash.isMap = isMap;
    lodash.isMatch = isMatch;
    lodash.isMatchWith = isMatchWith;
    lodash.isNaN = isNaN;
    lodash.isNative = isNative;
    lodash.isNil = isNil;
    lodash.isNull = isNull;
    lodash.isNumber = isNumber;
    lodash.isObject = isObject;
    lodash.isObjectLike = isObjectLike;
    lodash.isPlainObject = isPlainObject;
    lodash.isRegExp = isRegExp;
    lodash.isSafeInteger = isSafeInteger;
    lodash.isSet = isSet;
    lodash.isString = isString;
    lodash.isSymbol = isSymbol;
    lodash.isTypedArray = isTypedArray;
    lodash.isUndefined = isUndefined;
    lodash.isWeakMap = isWeakMap;
    lodash.isWeakSet = isWeakSet;
    lodash.join = join;
    lodash.kebabCase = kebabCase;
    lodash.last = last;
    lodash.lastIndexOf = lastIndexOf;
    lodash.lowerCase = lowerCase;
    lodash.lowerFirst = lowerFirst;
    lodash.lt = lt;
    lodash.lte = lte;
    lodash.max = max;
    lodash.maxBy = maxBy;
    lodash.mean = mean;
    lodash.meanBy = meanBy;
    lodash.min = min;
    lodash.minBy = minBy;
    lodash.stubArray = stubArray;
    lodash.stubFalse = stubFalse;
    lodash.stubObject = stubObject;
    lodash.stubString = stubString;
    lodash.stubTrue = stubTrue;
    lodash.multiply = multiply;
    lodash.nth = nth;
    lodash.noConflict = noConflict;
    lodash.noop = noop;
    lodash.now = now;
    lodash.pad = pad;
    lodash.padEnd = padEnd;
    lodash.padStart = padStart;
    lodash.parseInt = parseInt;
    lodash.random = random;
    lodash.reduce = reduce;
    lodash.reduceRight = reduceRight;
    lodash.repeat = repeat;
    lodash.replace = replace;
    lodash.result = result;
    lodash.round = round;
    lodash.runInContext = runInContext;
    lodash.sample = sample;
    lodash.size = size;
    lodash.snakeCase = snakeCase;
    lodash.some = some;
    lodash.sortedIndex = sortedIndex;
    lodash.sortedIndexBy = sortedIndexBy;
    lodash.sortedIndexOf = sortedIndexOf;
    lodash.sortedLastIndex = sortedLastIndex;
    lodash.sortedLastIndexBy = sortedLastIndexBy;
    lodash.sortedLastIndexOf = sortedLastIndexOf;
    lodash.startCase = startCase;
    lodash.startsWith = startsWith;
    lodash.subtract = subtract;
    lodash.sum = sum;
    lodash.sumBy = sumBy;
    lodash.template = template;
    lodash.times = times;
    lodash.toFinite = toFinite;
    lodash.toInteger = toInteger;
    lodash.toLength = toLength;
    lodash.toLower = toLower;
    lodash.toNumber = toNumber;
    lodash.toSafeInteger = toSafeInteger;
    lodash.toString = toString;
    lodash.toUpper = toUpper;
    lodash.trim = trim;
    lodash.trimEnd = trimEnd;
    lodash.trimStart = trimStart;
    lodash.truncate = truncate;
    lodash.unescape = unescape;
    lodash.uniqueId = uniqueId;
    lodash.upperCase = upperCase;
    lodash.upperFirst = upperFirst;

    // Add aliases.
    lodash.each = forEach;
    lodash.eachRight = forEachRight;
    lodash.first = head;

    mixin(lodash, (function() {
      var source = {};
      baseForOwn(lodash, function(func, methodName) {
        if (!hasOwnProperty.call(lodash.prototype, methodName)) {
          source[methodName] = func;
        }
      });
      return source;
    }()), { 'chain': false });

    /*------------------------------------------------------------------------*/

    /**
     * The semantic version number.
     *
     * @static
     * @memberOf _
     * @type {string}
     */
    lodash.VERSION = VERSION;

    // Assign default placeholders.
    arrayEach(['bind', 'bindKey', 'curry', 'curryRight', 'partial', 'partialRight'], function(methodName) {
      lodash[methodName].placeholder = lodash;
    });

    // Add `LazyWrapper` methods for `_.drop` and `_.take` variants.
    arrayEach(['drop', 'take'], function(methodName, index) {
      LazyWrapper.prototype[methodName] = function(n) {
        n = n === undefined ? 1 : nativeMax(toInteger(n), 0);

        var result = (this.__filtered__ && !index)
          ? new LazyWrapper(this)
          : this.clone();

        if (result.__filtered__) {
          result.__takeCount__ = nativeMin(n, result.__takeCount__);
        } else {
          result.__views__.push({
            'size': nativeMin(n, MAX_ARRAY_LENGTH),
            'type': methodName + (result.__dir__ < 0 ? 'Right' : '')
          });
        }
        return result;
      };

      LazyWrapper.prototype[methodName + 'Right'] = function(n) {
        return this.reverse()[methodName](n).reverse();
      };
    });

    // Add `LazyWrapper` methods that accept an `iteratee` value.
    arrayEach(['filter', 'map', 'takeWhile'], function(methodName, index) {
      var type = index + 1,
          isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;

      LazyWrapper.prototype[methodName] = function(iteratee) {
        var result = this.clone();
        result.__iteratees__.push({
          'iteratee': getIteratee(iteratee, 3),
          'type': type
        });
        result.__filtered__ = result.__filtered__ || isFilter;
        return result;
      };
    });

    // Add `LazyWrapper` methods for `_.head` and `_.last`.
    arrayEach(['head', 'last'], function(methodName, index) {
      var takeName = 'take' + (index ? 'Right' : '');

      LazyWrapper.prototype[methodName] = function() {
        return this[takeName](1).value()[0];
      };
    });

    // Add `LazyWrapper` methods for `_.initial` and `_.tail`.
    arrayEach(['initial', 'tail'], function(methodName, index) {
      var dropName = 'drop' + (index ? '' : 'Right');

      LazyWrapper.prototype[methodName] = function() {
        return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
      };
    });

    LazyWrapper.prototype.compact = function() {
      return this.filter(identity);
    };

    LazyWrapper.prototype.find = function(predicate) {
      return this.filter(predicate).head();
    };

    LazyWrapper.prototype.findLast = function(predicate) {
      return this.reverse().find(predicate);
    };

    LazyWrapper.prototype.invokeMap = baseRest(function(path, args) {
      if (typeof path == 'function') {
        return new LazyWrapper(this);
      }
      return this.map(function(value) {
        return baseInvoke(value, path, args);
      });
    });

    LazyWrapper.prototype.reject = function(predicate) {
      return this.filter(negate(getIteratee(predicate)));
    };

    LazyWrapper.prototype.slice = function(start, end) {
      start = toInteger(start);

      var result = this;
      if (result.__filtered__ && (start > 0 || end < 0)) {
        return new LazyWrapper(result);
      }
      if (start < 0) {
        result = result.takeRight(-start);
      } else if (start) {
        result = result.drop(start);
      }
      if (end !== undefined) {
        end = toInteger(end);
        result = end < 0 ? result.dropRight(-end) : result.take(end - start);
      }
      return result;
    };

    LazyWrapper.prototype.takeRightWhile = function(predicate) {
      return this.reverse().takeWhile(predicate).reverse();
    };

    LazyWrapper.prototype.toArray = function() {
      return this.take(MAX_ARRAY_LENGTH);
    };

    // Add `LazyWrapper` methods to `lodash.prototype`.
    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
      var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName),
          isTaker = /^(?:head|last)$/.test(methodName),
          lodashFunc = lodash[isTaker ? ('take' + (methodName == 'last' ? 'Right' : '')) : methodName],
          retUnwrapped = isTaker || /^find/.test(methodName);

      if (!lodashFunc) {
        return;
      }
      lodash.prototype[methodName] = function() {
        var value = this.__wrapped__,
            args = isTaker ? [1] : arguments,
            isLazy = value instanceof LazyWrapper,
            iteratee = args[0],
            useLazy = isLazy || isArray(value);

        var interceptor = function(value) {
          var result = lodashFunc.apply(lodash, arrayPush([value], args));
          return (isTaker && chainAll) ? result[0] : result;
        };

        if (useLazy && checkIteratee && typeof iteratee == 'function' && iteratee.length != 1) {
          // Avoid lazy use if the iteratee has a "length" value other than `1`.
          isLazy = useLazy = false;
        }
        var chainAll = this.__chain__,
            isHybrid = !!this.__actions__.length,
            isUnwrapped = retUnwrapped && !chainAll,
            onlyLazy = isLazy && !isHybrid;

        if (!retUnwrapped && useLazy) {
          value = onlyLazy ? value : new LazyWrapper(this);
          var result = func.apply(value, args);
          result.__actions__.push({ 'func': thru, 'args': [interceptor], 'thisArg': undefined });
          return new LodashWrapper(result, chainAll);
        }
        if (isUnwrapped && onlyLazy) {
          return func.apply(this, args);
        }
        result = this.thru(interceptor);
        return isUnwrapped ? (isTaker ? result.value()[0] : result.value()) : result;
      };
    });

    // Add `Array` methods to `lodash.prototype`.
    arrayEach(['pop', 'push', 'shift', 'sort', 'splice', 'unshift'], function(methodName) {
      var func = arrayProto[methodName],
          chainName = /^(?:push|sort|unshift)$/.test(methodName) ? 'tap' : 'thru',
          retUnwrapped = /^(?:pop|shift)$/.test(methodName);

      lodash.prototype[methodName] = function() {
        var args = arguments;
        if (retUnwrapped && !this.__chain__) {
          var value = this.value();
          return func.apply(isArray(value) ? value : [], args);
        }
        return this[chainName](function(value) {
          return func.apply(isArray(value) ? value : [], args);
        });
      };
    });

    // Map minified method names to their real names.
    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
      var lodashFunc = lodash[methodName];
      if (lodashFunc) {
        var key = lodashFunc.name + '';
        if (!hasOwnProperty.call(realNames, key)) {
          realNames[key] = [];
        }
        realNames[key].push({ 'name': methodName, 'func': lodashFunc });
      }
    });

    realNames[createHybrid(undefined, WRAP_BIND_KEY_FLAG).name] = [{
      'name': 'wrapper',
      'func': undefined
    }];

    // Add methods to `LazyWrapper`.
    LazyWrapper.prototype.clone = lazyClone;
    LazyWrapper.prototype.reverse = lazyReverse;
    LazyWrapper.prototype.value = lazyValue;

    // Add chain sequence methods to the `lodash` wrapper.
    lodash.prototype.at = wrapperAt;
    lodash.prototype.chain = wrapperChain;
    lodash.prototype.commit = wrapperCommit;
    lodash.prototype.next = wrapperNext;
    lodash.prototype.plant = wrapperPlant;
    lodash.prototype.reverse = wrapperReverse;
    lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;

    // Add lazy aliases.
    lodash.prototype.first = lodash.prototype.head;

    if (symIterator) {
      lodash.prototype[symIterator] = wrapperToIterator;
    }
    return lodash;
  });

  /*--------------------------------------------------------------------------*/

  // Export lodash.
  var _ = runInContext();

  // Some AMD build optimizers, like r.js, check for condition patterns like:
  if (true) {
    // Expose Lodash on the global object to prevent errors when Lodash is
    // loaded by a script tag in the presence of an AMD loader.
    // See http://requirejs.org/docs/errors.html#mismatch for more details.
    // Use `_.noConflict` to remove Lodash from the global object.
    root._ = _;

    // Define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module.
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
      return _;
    }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }
  // Check for `exports` after `define` in case a build optimizer adds it.
  else if (freeModule) {
    // Export for Node.js.
    (freeModule.exports = _)._ = _;
    // Export for CommonJS support.
    freeExports._ = _;
  }
  else {
    // Export to the global object.
    root._ = _;
  }
}.call(this));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(6)(module)))

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var require;var require;/**
* plotly.js v1.54.5
* Copyright 2012-2020, Plotly, Inc.
* All rights reserved.
* Licensed under the MIT license
*/
!function(t){if(true)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).Plotly=t()}}((function(){return function t(e,r,n){function a(o,s){if(!r[o]){if(!e[o]){var l="function"==typeof require&&require;if(!s&&l)return require(o,!0);if(i)return i(o,!0);var c=new Error("Cannot find module '"+o+"'");throw c.code="MODULE_NOT_FOUND",c}var u=r[o]={exports:{}};e[o][0].call(u.exports,(function(t){return a(e[o][1][t]||t)}),u,u.exports,t,e,r,n)}return r[o].exports}for(var i="function"==typeof require&&require,o=0;o<n.length;o++)a(n[o]);return a}({1:[function(t,e,r){"use strict";var n=t("../src/lib"),a={"X,X div":"direction:ltr;font-family:'Open Sans', verdana, arial, sans-serif;margin:0;padding:0;","X input,X button":"font-family:'Open Sans', verdana, arial, sans-serif;","X input:focus,X button:focus":"outline:none;","X a":"text-decoration:none;","X a:hover":"text-decoration:none;","X .crisp":"shape-rendering:crispEdges;","X .user-select-none":"-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none;","X svg":"overflow:hidden;","X svg a":"fill:#447adb;","X svg a:hover":"fill:#3c6dc5;","X .main-svg":"position:absolute;top:0;left:0;pointer-events:none;","X .main-svg .draglayer":"pointer-events:all;","X .cursor-default":"cursor:default;","X .cursor-pointer":"cursor:pointer;","X .cursor-crosshair":"cursor:crosshair;","X .cursor-move":"cursor:move;","X .cursor-col-resize":"cursor:col-resize;","X .cursor-row-resize":"cursor:row-resize;","X .cursor-ns-resize":"cursor:ns-resize;","X .cursor-ew-resize":"cursor:ew-resize;","X .cursor-sw-resize":"cursor:sw-resize;","X .cursor-s-resize":"cursor:s-resize;","X .cursor-se-resize":"cursor:se-resize;","X .cursor-w-resize":"cursor:w-resize;","X .cursor-e-resize":"cursor:e-resize;","X .cursor-nw-resize":"cursor:nw-resize;","X .cursor-n-resize":"cursor:n-resize;","X .cursor-ne-resize":"cursor:ne-resize;","X .cursor-grab":"cursor:-webkit-grab;cursor:grab;","X .modebar":"position:absolute;top:2px;right:2px;","X .ease-bg":"-webkit-transition:background-color 0.3s ease 0s;-moz-transition:background-color 0.3s ease 0s;-ms-transition:background-color 0.3s ease 0s;-o-transition:background-color 0.3s ease 0s;transition:background-color 0.3s ease 0s;","X .modebar--hover>:not(.watermark)":"opacity:0;-webkit-transition:opacity 0.3s ease 0s;-moz-transition:opacity 0.3s ease 0s;-ms-transition:opacity 0.3s ease 0s;-o-transition:opacity 0.3s ease 0s;transition:opacity 0.3s ease 0s;","X:hover .modebar--hover .modebar-group":"opacity:1;","X .modebar-group":"float:left;display:inline-block;box-sizing:border-box;padding-left:8px;position:relative;vertical-align:middle;white-space:nowrap;","X .modebar-btn":"position:relative;font-size:16px;padding:3px 4px;height:22px;cursor:pointer;line-height:normal;box-sizing:border-box;","X .modebar-btn svg":"position:relative;top:2px;","X .modebar.vertical":"display:flex;flex-direction:column;flex-wrap:wrap;align-content:flex-end;max-height:100%;","X .modebar.vertical svg":"top:-1px;","X .modebar.vertical .modebar-group":"display:block;float:none;padding-left:0px;padding-bottom:8px;","X .modebar.vertical .modebar-group .modebar-btn":"display:block;text-align:center;","X [data-title]:before,X [data-title]:after":"position:absolute;-webkit-transform:translate3d(0, 0, 0);-moz-transform:translate3d(0, 0, 0);-ms-transform:translate3d(0, 0, 0);-o-transform:translate3d(0, 0, 0);transform:translate3d(0, 0, 0);display:none;opacity:0;z-index:1001;pointer-events:none;top:110%;right:50%;","X [data-title]:hover:before,X [data-title]:hover:after":"display:block;opacity:1;","X [data-title]:before":"content:'';position:absolute;background:transparent;border:6px solid transparent;z-index:1002;margin-top:-12px;border-bottom-color:#69738a;margin-right:-6px;","X [data-title]:after":"content:attr(data-title);background:#69738a;color:white;padding:8px 10px;font-size:12px;line-height:12px;white-space:nowrap;margin-right:-18px;border-radius:2px;","X .vertical [data-title]:before,X .vertical [data-title]:after":"top:0%;right:200%;","X .vertical [data-title]:before":"border:6px solid transparent;border-left-color:#69738a;margin-top:8px;margin-right:-30px;","X .select-outline":"fill:none;stroke-width:1;shape-rendering:crispEdges;","X .select-outline-1":"stroke:white;","X .select-outline-2":"stroke:black;stroke-dasharray:2px 2px;",Y:"font-family:'Open Sans', verdana, arial, sans-serif;position:fixed;top:50px;right:20px;z-index:10000;font-size:10pt;max-width:180px;","Y p":"margin:0;","Y .notifier-note":"min-width:180px;max-width:250px;border:1px solid #fff;z-index:3000;margin:0;background-color:#8c97af;background-color:rgba(140,151,175,0.9);color:#fff;padding:10px;overflow-wrap:break-word;word-wrap:break-word;-ms-hyphens:auto;-webkit-hyphens:auto;hyphens:auto;","Y .notifier-close":"color:#fff;opacity:0.8;float:right;padding:0 5px;background:none;border:none;font-size:20px;font-weight:bold;line-height:20px;","Y .notifier-close:hover":"color:#444;text-decoration:none;cursor:pointer;"};for(var i in a){var o=i.replace(/^,/," ,").replace(/X/g,".js-plotly-plot .plotly").replace(/Y/g,".plotly-notifier");n.addStyleRule(o,a[i])}},{"../src/lib":728}],2:[function(t,e,r){"use strict";e.exports=t("../src/transforms/aggregate")},{"../src/transforms/aggregate":1310}],3:[function(t,e,r){"use strict";e.exports=t("../src/traces/bar")},{"../src/traces/bar":877}],4:[function(t,e,r){"use strict";e.exports=t("../src/traces/barpolar")},{"../src/traces/barpolar":890}],5:[function(t,e,r){"use strict";e.exports=t("../src/traces/box")},{"../src/traces/box":900}],6:[function(t,e,r){"use strict";e.exports=t("../src/components/calendars")},{"../src/components/calendars":593}],7:[function(t,e,r){"use strict";e.exports=t("../src/traces/candlestick")},{"../src/traces/candlestick":909}],8:[function(t,e,r){"use strict";e.exports=t("../src/traces/carpet")},{"../src/traces/carpet":928}],9:[function(t,e,r){"use strict";e.exports=t("../src/traces/choropleth")},{"../src/traces/choropleth":942}],10:[function(t,e,r){"use strict";e.exports=t("../src/traces/choroplethmapbox")},{"../src/traces/choroplethmapbox":949}],11:[function(t,e,r){"use strict";e.exports=t("../src/traces/cone")},{"../src/traces/cone":955}],12:[function(t,e,r){"use strict";e.exports=t("../src/traces/contour")},{"../src/traces/contour":970}],13:[function(t,e,r){"use strict";e.exports=t("../src/traces/contourcarpet")},{"../src/traces/contourcarpet":981}],14:[function(t,e,r){"use strict";e.exports=t("../src/core")},{"../src/core":706}],15:[function(t,e,r){"use strict";e.exports=t("../src/traces/densitymapbox")},{"../src/traces/densitymapbox":989}],16:[function(t,e,r){"use strict";e.exports=t("../src/transforms/filter")},{"../src/transforms/filter":1311}],17:[function(t,e,r){"use strict";e.exports=t("../src/traces/funnel")},{"../src/traces/funnel":999}],18:[function(t,e,r){"use strict";e.exports=t("../src/traces/funnelarea")},{"../src/traces/funnelarea":1008}],19:[function(t,e,r){"use strict";e.exports=t("../src/transforms/groupby")},{"../src/transforms/groupby":1312}],20:[function(t,e,r){"use strict";e.exports=t("../src/traces/heatmap")},{"../src/traces/heatmap":1021}],21:[function(t,e,r){"use strict";e.exports=t("../src/traces/heatmapgl")},{"../src/traces/heatmapgl":1030}],22:[function(t,e,r){"use strict";e.exports=t("../src/traces/histogram")},{"../src/traces/histogram":1042}],23:[function(t,e,r){"use strict";e.exports=t("../src/traces/histogram2d")},{"../src/traces/histogram2d":1048}],24:[function(t,e,r){"use strict";e.exports=t("../src/traces/histogram2dcontour")},{"../src/traces/histogram2dcontour":1052}],25:[function(t,e,r){"use strict";e.exports=t("../src/traces/image")},{"../src/traces/image":1059}],26:[function(t,e,r){"use strict";var n=t("./core");n.register([t("./bar"),t("./box"),t("./heatmap"),t("./histogram"),t("./histogram2d"),t("./histogram2dcontour"),t("./contour"),t("./scatterternary"),t("./violin"),t("./funnel"),t("./waterfall"),t("./image"),t("./pie"),t("./sunburst"),t("./treemap"),t("./funnelarea"),t("./scatter3d"),t("./surface"),t("./isosurface"),t("./volume"),t("./mesh3d"),t("./cone"),t("./streamtube"),t("./scattergeo"),t("./choropleth"),t("./scattergl"),t("./splom"),t("./pointcloud"),t("./heatmapgl"),t("./parcoords"),t("./parcats"),t("./scattermapbox"),t("./choroplethmapbox"),t("./densitymapbox"),t("./sankey"),t("./indicator"),t("./table"),t("./carpet"),t("./scattercarpet"),t("./contourcarpet"),t("./ohlc"),t("./candlestick"),t("./scatterpolar"),t("./scatterpolargl"),t("./barpolar")]),n.register([t("./aggregate"),t("./filter"),t("./groupby"),t("./sort")]),n.register([t("./calendars")]),e.exports=n},{"./aggregate":2,"./bar":3,"./barpolar":4,"./box":5,"./calendars":6,"./candlestick":7,"./carpet":8,"./choropleth":9,"./choroplethmapbox":10,"./cone":11,"./contour":12,"./contourcarpet":13,"./core":14,"./densitymapbox":15,"./filter":16,"./funnel":17,"./funnelarea":18,"./groupby":19,"./heatmap":20,"./heatmapgl":21,"./histogram":22,"./histogram2d":23,"./histogram2dcontour":24,"./image":25,"./indicator":27,"./isosurface":28,"./mesh3d":29,"./ohlc":30,"./parcats":31,"./parcoords":32,"./pie":33,"./pointcloud":34,"./sankey":35,"./scatter3d":36,"./scattercarpet":37,"./scattergeo":38,"./scattergl":39,"./scattermapbox":40,"./scatterpolar":41,"./scatterpolargl":42,"./scatterternary":43,"./sort":44,"./splom":45,"./streamtube":46,"./sunburst":47,"./surface":48,"./table":49,"./treemap":50,"./violin":51,"./volume":52,"./waterfall":53}],27:[function(t,e,r){"use strict";e.exports=t("../src/traces/indicator")},{"../src/traces/indicator":1067}],28:[function(t,e,r){"use strict";e.exports=t("../src/traces/isosurface")},{"../src/traces/isosurface":1073}],29:[function(t,e,r){"use strict";e.exports=t("../src/traces/mesh3d")},{"../src/traces/mesh3d":1078}],30:[function(t,e,r){"use strict";e.exports=t("../src/traces/ohlc")},{"../src/traces/ohlc":1083}],31:[function(t,e,r){"use strict";e.exports=t("../src/traces/parcats")},{"../src/traces/parcats":1092}],32:[function(t,e,r){"use strict";e.exports=t("../src/traces/parcoords")},{"../src/traces/parcoords":1102}],33:[function(t,e,r){"use strict";e.exports=t("../src/traces/pie")},{"../src/traces/pie":1113}],34:[function(t,e,r){"use strict";e.exports=t("../src/traces/pointcloud")},{"../src/traces/pointcloud":1122}],35:[function(t,e,r){"use strict";e.exports=t("../src/traces/sankey")},{"../src/traces/sankey":1128}],36:[function(t,e,r){"use strict";e.exports=t("../src/traces/scatter3d")},{"../src/traces/scatter3d":1165}],37:[function(t,e,r){"use strict";e.exports=t("../src/traces/scattercarpet")},{"../src/traces/scattercarpet":1172}],38:[function(t,e,r){"use strict";e.exports=t("../src/traces/scattergeo")},{"../src/traces/scattergeo":1180}],39:[function(t,e,r){"use strict";e.exports=t("../src/traces/scattergl")},{"../src/traces/scattergl":1193}],40:[function(t,e,r){"use strict";e.exports=t("../src/traces/scattermapbox")},{"../src/traces/scattermapbox":1203}],41:[function(t,e,r){"use strict";e.exports=t("../src/traces/scatterpolar")},{"../src/traces/scatterpolar":1211}],42:[function(t,e,r){"use strict";e.exports=t("../src/traces/scatterpolargl")},{"../src/traces/scatterpolargl":1218}],43:[function(t,e,r){"use strict";e.exports=t("../src/traces/scatterternary")},{"../src/traces/scatterternary":1226}],44:[function(t,e,r){"use strict";e.exports=t("../src/transforms/sort")},{"../src/transforms/sort":1314}],45:[function(t,e,r){"use strict";e.exports=t("../src/traces/splom")},{"../src/traces/splom":1235}],46:[function(t,e,r){"use strict";e.exports=t("../src/traces/streamtube")},{"../src/traces/streamtube":1243}],47:[function(t,e,r){"use strict";e.exports=t("../src/traces/sunburst")},{"../src/traces/sunburst":1251}],48:[function(t,e,r){"use strict";e.exports=t("../src/traces/surface")},{"../src/traces/surface":1260}],49:[function(t,e,r){"use strict";e.exports=t("../src/traces/table")},{"../src/traces/table":1268}],50:[function(t,e,r){"use strict";e.exports=t("../src/traces/treemap")},{"../src/traces/treemap":1277}],51:[function(t,e,r){"use strict";e.exports=t("../src/traces/violin")},{"../src/traces/violin":1289}],52:[function(t,e,r){"use strict";e.exports=t("../src/traces/volume")},{"../src/traces/volume":1297}],53:[function(t,e,r){"use strict";e.exports=t("../src/traces/waterfall")},{"../src/traces/waterfall":1305}],54:[function(t,e,r){"use strict";e.exports=function(t){var e=(t=t||{}).eye||[0,0,1],r=t.center||[0,0,0],s=t.up||[0,1,0],l=t.distanceLimits||[0,1/0],c=t.mode||"turntable",u=n(),h=a(),f=i();return u.setDistanceLimits(l[0],l[1]),u.lookAt(0,e,r,s),h.setDistanceLimits(l[0],l[1]),h.lookAt(0,e,r,s),f.setDistanceLimits(l[0],l[1]),f.lookAt(0,e,r,s),new o({turntable:u,orbit:h,matrix:f},c)};var n=t("turntable-camera-controller"),a=t("orbit-camera-controller"),i=t("matrix-camera-controller");function o(t,e){this._controllerNames=Object.keys(t),this._controllerList=this._controllerNames.map((function(e){return t[e]})),this._mode=e,this._active=t[e],this._active||(this._mode="turntable",this._active=t.turntable),this.modes=this._controllerNames,this.computedMatrix=this._active.computedMatrix,this.computedEye=this._active.computedEye,this.computedUp=this._active.computedUp,this.computedCenter=this._active.computedCenter,this.computedRadius=this._active.computedRadius}var s=o.prototype;[["flush",1],["idle",1],["lookAt",4],["rotate",4],["pan",4],["translate",4],["setMatrix",2],["setDistanceLimits",2],["setDistance",2]].forEach((function(t){for(var e=t[0],r=[],n=0;n<t[1];++n)r.push("a"+n);var a="var cc=this._controllerList;for(var i=0;i<cc.length;++i){cc[i]."+t[0]+"("+r.join()+")}";s[e]=Function.apply(null,r.concat(a))})),s.recalcMatrix=function(t){this._active.recalcMatrix(t)},s.getDistance=function(t){return this._active.getDistance(t)},s.getDistanceLimits=function(t){return this._active.getDistanceLimits(t)},s.lastT=function(){return this._active.lastT()},s.setMode=function(t){if(t!==this._mode){var e=this._controllerNames.indexOf(t);if(!(e<0)){var r=this._active,n=this._controllerList[e],a=Math.max(r.lastT(),n.lastT());r.recalcMatrix(a),n.setMatrix(a,r.computedMatrix),this._active=n,this._mode=t,this.computedMatrix=this._active.computedMatrix,this.computedEye=this._active.computedEye,this.computedUp=this._active.computedUp,this.computedCenter=this._active.computedCenter,this.computedRadius=this._active.computedRadius}}},s.getMode=function(){return this._mode}},{"matrix-camera-controller":433,"orbit-camera-controller":454,"turntable-camera-controller":533}],55:[function(t,e,r){!function(n,a){"object"==typeof r&&"undefined"!=typeof e?a(r,t("d3-array"),t("d3-collection"),t("d3-shape"),t("elementary-circuits-directed-graph")):a(n.d3=n.d3||{},n.d3,n.d3,n.d3,null)}(this,(function(t,e,r,n,a){"use strict";function i(t){return t.target.depth}function o(t,e){return t.sourceLinks.length?t.depth:e-1}function s(t){return function(){return t}}a=a&&a.hasOwnProperty("default")?a.default:a;var l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};function c(t,e){return h(t.source,e.source)||t.index-e.index}function u(t,e){return h(t.target,e.target)||t.index-e.index}function h(t,e){return t.partOfCycle===e.partOfCycle?t.y0-e.y0:"top"===t.circularLinkType||"bottom"===e.circularLinkType?-1:1}function f(t){return t.value}function p(t){return(t.y0+t.y1)/2}function d(t){return p(t.source)}function g(t){return p(t.target)}function m(t){return t.index}function v(t){return t.nodes}function y(t){return t.links}function x(t,e){var r=t.get(e);if(!r)throw new Error("missing: "+e);return r}function b(t,e){return e(t)}function _(t,e,r){var n=0;if(null===r){for(var i=[],o=0;o<t.links.length;o++){var s=t.links[o],l=s.source.index,c=s.target.index;i[l]||(i[l]=[]),i[c]||(i[c]=[]),-1===i[l].indexOf(c)&&i[l].push(c)}var u=a(i);u.sort((function(t,e){return t.length-e.length}));var h={};for(o=0;o<u.length;o++){var f=u[o].slice(-2);h[f[0]]||(h[f[0]]={}),h[f[0]][f[1]]=!0}t.links.forEach((function(t){var e=t.target.index,r=t.source.index;e===r||h[r]&&h[r][e]?(t.circular=!0,t.circularLinkID=n,n+=1):t.circular=!1}))}else t.links.forEach((function(t){t.source[r]<t.target[r]?t.circular=!1:(t.circular=!0,t.circularLinkID=n,n+=1)}))}function w(t,e){var r=0,n=0;t.links.forEach((function(a){a.circular&&(a.source.circularLinkType||a.target.circularLinkType?a.circularLinkType=a.source.circularLinkType?a.source.circularLinkType:a.target.circularLinkType:a.circularLinkType=r<n?"top":"bottom","top"==a.circularLinkType?r+=1:n+=1,t.nodes.forEach((function(t){b(t,e)!=b(a.source,e)&&b(t,e)!=b(a.target,e)||(t.circularLinkType=a.circularLinkType)})))})),t.links.forEach((function(t){t.circular&&(t.source.circularLinkType==t.target.circularLinkType&&(t.circularLinkType=t.source.circularLinkType),H(t,e)&&(t.circularLinkType=t.source.circularLinkType))}))}function T(t){var e=Math.abs(t.y1-t.y0),r=Math.abs(t.target.x0-t.source.x1);return Math.atan(r/e)}function k(t,e){var r=0;t.sourceLinks.forEach((function(t){r=t.circular&&!H(t,e)?r+1:r}));var n=0;return t.targetLinks.forEach((function(t){n=t.circular&&!H(t,e)?n+1:n})),r+n}function A(t){var e=t.source.sourceLinks,r=0;e.forEach((function(t){r=t.circular?r+1:r}));var n=t.target.targetLinks,a=0;return n.forEach((function(t){a=t.circular?a+1:a})),!(r>1||a>1)}function M(t,e,r){return t.sort(E),t.forEach((function(n,a){var i,o,s=0;if(H(n,r)&&A(n))n.circularPathData.verticalBuffer=s+n.width/2;else{for(var l=0;l<a;l++)if(i=t[a],o=t[l],!(i.source.column<o.target.column||i.target.column>o.source.column)){var c=t[l].circularPathData.verticalBuffer+t[l].width/2+e;s=c>s?c:s}n.circularPathData.verticalBuffer=s+n.width/2}})),t}function S(t,r,a,i){var o=e.min(t.links,(function(t){return t.source.y0}));t.links.forEach((function(t){t.circular&&(t.circularPathData={})})),M(t.links.filter((function(t){return"top"==t.circularLinkType})),r,i),M(t.links.filter((function(t){return"bottom"==t.circularLinkType})),r,i),t.links.forEach((function(e){if(e.circular){if(e.circularPathData.arcRadius=e.width+10,e.circularPathData.leftNodeBuffer=5,e.circularPathData.rightNodeBuffer=5,e.circularPathData.sourceWidth=e.source.x1-e.source.x0,e.circularPathData.sourceX=e.source.x0+e.circularPathData.sourceWidth,e.circularPathData.targetX=e.target.x0,e.circularPathData.sourceY=e.y0,e.circularPathData.targetY=e.y1,H(e,i)&&A(e))e.circularPathData.leftSmallArcRadius=10+e.width/2,e.circularPathData.leftLargeArcRadius=10+e.width/2,e.circularPathData.rightSmallArcRadius=10+e.width/2,e.circularPathData.rightLargeArcRadius=10+e.width/2,"bottom"==e.circularLinkType?(e.circularPathData.verticalFullExtent=e.source.y1+25+e.circularPathData.verticalBuffer,e.circularPathData.verticalLeftInnerExtent=e.circularPathData.verticalFullExtent-e.circularPathData.leftLargeArcRadius,e.circularPathData.verticalRightInnerExtent=e.circularPathData.verticalFullExtent-e.circularPathData.rightLargeArcRadius):(e.circularPathData.verticalFullExtent=e.source.y0-25-e.circularPathData.verticalBuffer,e.circularPathData.verticalLeftInnerExtent=e.circularPathData.verticalFullExtent+e.circularPathData.leftLargeArcRadius,e.circularPathData.verticalRightInnerExtent=e.circularPathData.verticalFullExtent+e.circularPathData.rightLargeArcRadius);else{var s=e.source.column,l=e.circularLinkType,c=t.links.filter((function(t){return t.source.column==s&&t.circularLinkType==l}));"bottom"==e.circularLinkType?c.sort(L):c.sort(C);var u=0;c.forEach((function(t,n){t.circularLinkID==e.circularLinkID&&(e.circularPathData.leftSmallArcRadius=10+e.width/2+u,e.circularPathData.leftLargeArcRadius=10+e.width/2+n*r+u),u+=t.width})),s=e.target.column,c=t.links.filter((function(t){return t.target.column==s&&t.circularLinkType==l})),"bottom"==e.circularLinkType?c.sort(I):c.sort(P),u=0,c.forEach((function(t,n){t.circularLinkID==e.circularLinkID&&(e.circularPathData.rightSmallArcRadius=10+e.width/2+u,e.circularPathData.rightLargeArcRadius=10+e.width/2+n*r+u),u+=t.width})),"bottom"==e.circularLinkType?(e.circularPathData.verticalFullExtent=Math.max(a,e.source.y1,e.target.y1)+25+e.circularPathData.verticalBuffer,e.circularPathData.verticalLeftInnerExtent=e.circularPathData.verticalFullExtent-e.circularPathData.leftLargeArcRadius,e.circularPathData.verticalRightInnerExtent=e.circularPathData.verticalFullExtent-e.circularPathData.rightLargeArcRadius):(e.circularPathData.verticalFullExtent=o-25-e.circularPathData.verticalBuffer,e.circularPathData.verticalLeftInnerExtent=e.circularPathData.verticalFullExtent+e.circularPathData.leftLargeArcRadius,e.circularPathData.verticalRightInnerExtent=e.circularPathData.verticalFullExtent+e.circularPathData.rightLargeArcRadius)}e.circularPathData.leftInnerExtent=e.circularPathData.sourceX+e.circularPathData.leftNodeBuffer,e.circularPathData.rightInnerExtent=e.circularPathData.targetX-e.circularPathData.rightNodeBuffer,e.circularPathData.leftFullExtent=e.circularPathData.sourceX+e.circularPathData.leftLargeArcRadius+e.circularPathData.leftNodeBuffer,e.circularPathData.rightFullExtent=e.circularPathData.targetX-e.circularPathData.rightLargeArcRadius-e.circularPathData.rightNodeBuffer}if(e.circular)e.path=function(t){var e="";e="top"==t.circularLinkType?"M"+t.circularPathData.sourceX+" "+t.circularPathData.sourceY+" L"+t.circularPathData.leftInnerExtent+" "+t.circularPathData.sourceY+" A"+t.circularPathData.leftLargeArcRadius+" "+t.circularPathData.leftSmallArcRadius+" 0 0 0 "+t.circularPathData.leftFullExtent+" "+(t.circularPathData.sourceY-t.circularPathData.leftSmallArcRadius)+" L"+t.circularPathData.leftFullExtent+" "+t.circularPathData.verticalLeftInnerExtent+" A"+t.circularPathData.leftLargeArcRadius+" "+t.circularPathData.leftLargeArcRadius+" 0 0 0 "+t.circularPathData.leftInnerExtent+" "+t.circularPathData.verticalFullExtent+" L"+t.circularPathData.rightInnerExtent+" "+t.circularPathData.verticalFullExtent+" A"+t.circularPathData.rightLargeArcRadius+" "+t.circularPathData.rightLargeArcRadius+" 0 0 0 "+t.circularPathData.rightFullExtent+" "+t.circularPathData.verticalRightInnerExtent+" L"+t.circularPathData.rightFullExtent+" "+(t.circularPathData.targetY-t.circularPathData.rightSmallArcRadius)+" A"+t.circularPathData.rightLargeArcRadius+" "+t.circularPathData.rightSmallArcRadius+" 0 0 0 "+t.circularPathData.rightInnerExtent+" "+t.circularPathData.targetY+" L"+t.circularPathData.targetX+" "+t.circularPathData.targetY:"M"+t.circularPathData.sourceX+" "+t.circularPathData.sourceY+" L"+t.circularPathData.leftInnerExtent+" "+t.circularPathData.sourceY+" A"+t.circularPathData.leftLargeArcRadius+" "+t.circularPathData.leftSmallArcRadius+" 0 0 1 "+t.circularPathData.leftFullExtent+" "+(t.circularPathData.sourceY+t.circularPathData.leftSmallArcRadius)+" L"+t.circularPathData.leftFullExtent+" "+t.circularPathData.verticalLeftInnerExtent+" A"+t.circularPathData.leftLargeArcRadius+" "+t.circularPathData.leftLargeArcRadius+" 0 0 1 "+t.circularPathData.leftInnerExtent+" "+t.circularPathData.verticalFullExtent+" L"+t.circularPathData.rightInnerExtent+" "+t.circularPathData.verticalFullExtent+" A"+t.circularPathData.rightLargeArcRadius+" "+t.circularPathData.rightLargeArcRadius+" 0 0 1 "+t.circularPathData.rightFullExtent+" "+t.circularPathData.verticalRightInnerExtent+" L"+t.circularPathData.rightFullExtent+" "+(t.circularPathData.targetY+t.circularPathData.rightSmallArcRadius)+" A"+t.circularPathData.rightLargeArcRadius+" "+t.circularPathData.rightSmallArcRadius+" 0 0 1 "+t.circularPathData.rightInnerExtent+" "+t.circularPathData.targetY+" L"+t.circularPathData.targetX+" "+t.circularPathData.targetY;return e}(e);else{var h=n.linkHorizontal().source((function(t){return[t.source.x0+(t.source.x1-t.source.x0),t.y0]})).target((function(t){return[t.target.x0,t.y1]}));e.path=h(e)}}))}function E(t,e){return z(t)==z(e)?"bottom"==t.circularLinkType?L(t,e):C(t,e):z(e)-z(t)}function C(t,e){return t.y0-e.y0}function L(t,e){return e.y0-t.y0}function P(t,e){return t.y1-e.y1}function I(t,e){return e.y1-t.y1}function z(t){return t.target.column-t.source.column}function O(t){return t.target.x0-t.source.x1}function D(t,e){var r=T(t),n=O(e)/Math.tan(r);return"up"==q(t)?t.y1+n:t.y1-n}function R(t,e){var r=T(t),n=O(e)/Math.tan(r);return"up"==q(t)?t.y1-n:t.y1+n}function F(t,e,r,n){t.links.forEach((function(a){if(!a.circular&&a.target.column-a.source.column>1){var i=a.source.column+1,o=a.target.column-1,s=1,l=o-i+1;for(s=1;i<=o;i++,s++)t.nodes.forEach((function(o){if(o.column==i){var c,u=s/(l+1),h=Math.pow(1-u,3),f=3*u*Math.pow(1-u,2),p=3*Math.pow(u,2)*(1-u),d=Math.pow(u,3),g=h*a.y0+f*a.y0+p*a.y1+d*a.y1,m=g-a.width/2,v=g+a.width/2;m>o.y0&&m<o.y1?(c=o.y1-m+10,c="bottom"==o.circularLinkType?c:-c,o=N(o,c,e,r),t.nodes.forEach((function(t){b(t,n)!=b(o,n)&&t.column==o.column&&B(o,t)&&N(t,c,e,r)}))):(v>o.y0&&v<o.y1||m<o.y0&&v>o.y1)&&(c=v-o.y0+10,o=N(o,c,e,r),t.nodes.forEach((function(t){b(t,n)!=b(o,n)&&t.column==o.column&&t.y0<o.y1&&t.y1>o.y1&&N(t,c,e,r)})))}}))}}))}function B(t,e){return t.y0>e.y0&&t.y0<e.y1||(t.y1>e.y0&&t.y1<e.y1||t.y0<e.y0&&t.y1>e.y1)}function N(t,e,r,n){return t.y0+e>=r&&t.y1+e<=n&&(t.y0=t.y0+e,t.y1=t.y1+e,t.targetLinks.forEach((function(t){t.y1=t.y1+e})),t.sourceLinks.forEach((function(t){t.y0=t.y0+e}))),t}function j(t,e,r,n){t.nodes.forEach((function(a){n&&a.y+(a.y1-a.y0)>e&&(a.y=a.y-(a.y+(a.y1-a.y0)-e));var i=t.links.filter((function(t){return b(t.source,r)==b(a,r)})),o=i.length;o>1&&i.sort((function(t,e){if(!t.circular&&!e.circular){if(t.target.column==e.target.column)return t.y1-e.y1;if(!U(t,e))return t.y1-e.y1;if(t.target.column>e.target.column){var r=R(e,t);return t.y1-r}if(e.target.column>t.target.column)return R(t,e)-e.y1}return t.circular&&!e.circular?"top"==t.circularLinkType?-1:1:e.circular&&!t.circular?"top"==e.circularLinkType?1:-1:t.circular&&e.circular?t.circularLinkType===e.circularLinkType&&"top"==t.circularLinkType?t.target.column===e.target.column?t.target.y1-e.target.y1:e.target.column-t.target.column:t.circularLinkType===e.circularLinkType&&"bottom"==t.circularLinkType?t.target.column===e.target.column?e.target.y1-t.target.y1:t.target.column-e.target.column:"top"==t.circularLinkType?-1:1:void 0}));var s=a.y0;i.forEach((function(t){t.y0=s+t.width/2,s+=t.width})),i.forEach((function(t,e){if("bottom"==t.circularLinkType){for(var r=e+1,n=0;r<o;r++)n+=i[r].width;t.y0=a.y1-n-t.width/2}}))}))}function V(t,e,r){t.nodes.forEach((function(e){var n=t.links.filter((function(t){return b(t.target,r)==b(e,r)})),a=n.length;a>1&&n.sort((function(t,e){if(!t.circular&&!e.circular){if(t.source.column==e.source.column)return t.y0-e.y0;if(!U(t,e))return t.y0-e.y0;if(e.source.column<t.source.column){var r=D(e,t);return t.y0-r}if(t.source.column<e.source.column)return D(t,e)-e.y0}return t.circular&&!e.circular?"top"==t.circularLinkType?-1:1:e.circular&&!t.circular?"top"==e.circularLinkType?1:-1:t.circular&&e.circular?t.circularLinkType===e.circularLinkType&&"top"==t.circularLinkType?t.source.column===e.source.column?t.source.y1-e.source.y1:t.source.column-e.source.column:t.circularLinkType===e.circularLinkType&&"bottom"==t.circularLinkType?t.source.column===e.source.column?t.source.y1-e.source.y1:e.source.column-t.source.column:"top"==t.circularLinkType?-1:1:void 0}));var i=e.y0;n.forEach((function(t){t.y1=i+t.width/2,i+=t.width})),n.forEach((function(t,r){if("bottom"==t.circularLinkType){for(var i=r+1,o=0;i<a;i++)o+=n[i].width;t.y1=e.y1-o-t.width/2}}))}))}function U(t,e){return q(t)==q(e)}function q(t){return t.y0-t.y1>0?"up":"down"}function H(t,e){return b(t.source,e)==b(t.target,e)}function G(t,r,n){var a=t.nodes,i=t.links,o=!1,s=!1;if(i.forEach((function(t){"top"==t.circularLinkType?o=!0:"bottom"==t.circularLinkType&&(s=!0)})),0==o||0==s){var l=e.min(a,(function(t){return t.y0})),c=(n-r)/(e.max(a,(function(t){return t.y1}))-l);a.forEach((function(t){var e=(t.y1-t.y0)*c;t.y0=(t.y0-l)*c,t.y1=t.y0+e})),i.forEach((function(t){t.y0=(t.y0-l)*c,t.y1=(t.y1-l)*c,t.width=t.width*c}))}}t.sankeyCircular=function(){var t,n,a=0,i=0,b=1,T=1,A=24,M=m,E=o,C=v,L=y,P=32,I=2,z=null;function O(){var t={nodes:C.apply(null,arguments),links:L.apply(null,arguments)};D(t),_(t,M,z),R(t),B(t),w(t,M),N(t,P,M),U(t);for(var e=4,r=0;r<e;r++)j(t,T,M),V(t,T,M),F(t,i,T,M),j(t,T,M),V(t,T,M);return G(t,i,T),S(t,I,T,M),t}function D(t){t.nodes.forEach((function(t,e){t.index=e,t.sourceLinks=[],t.targetLinks=[]}));var e=r.map(t.nodes,M);return t.links.forEach((function(t,r){t.index=r;var n=t.source,a=t.target;"object"!==("undefined"==typeof n?"undefined":l(n))&&(n=t.source=x(e,n)),"object"!==("undefined"==typeof a?"undefined":l(a))&&(a=t.target=x(e,a)),n.sourceLinks.push(t),a.targetLinks.push(t)})),t}function R(t){t.nodes.forEach((function(t){t.partOfCycle=!1,t.value=Math.max(e.sum(t.sourceLinks,f),e.sum(t.targetLinks,f)),t.sourceLinks.forEach((function(e){e.circular&&(t.partOfCycle=!0,t.circularLinkType=e.circularLinkType)})),t.targetLinks.forEach((function(e){e.circular&&(t.partOfCycle=!0,t.circularLinkType=e.circularLinkType)}))}))}function B(t){var e,r,n;for(e=t.nodes,r=[],n=0;e.length;++n,e=r,r=[])e.forEach((function(t){t.depth=n,t.sourceLinks.forEach((function(t){r.indexOf(t.target)<0&&!t.circular&&r.push(t.target)}))}));for(e=t.nodes,r=[],n=0;e.length;++n,e=r,r=[])e.forEach((function(t){t.height=n,t.targetLinks.forEach((function(t){r.indexOf(t.source)<0&&!t.circular&&r.push(t.source)}))}));t.nodes.forEach((function(t){t.column=Math.floor(E.call(null,t,n))}))}function N(o,s,l){var c=r.nest().key((function(t){return t.column})).sortKeys(e.ascending).entries(o.nodes).map((function(t){return t.values}));!function(r){if(n){var s=1/0;c.forEach((function(t){var e=T*n/(t.length+1);s=e<s?e:s})),t=s}var l=e.min(c,(function(r){return(T-i-(r.length-1)*t)/e.sum(r,f)}));l*=.3,o.links.forEach((function(t){t.width=t.value*l}));var u=function(t){var r=0,n=0,a=0,i=0,o=e.max(t.nodes,(function(t){return t.column}));return t.links.forEach((function(t){t.circular&&("top"==t.circularLinkType?r+=t.width:n+=t.width,0==t.target.column&&(i+=t.width),t.source.column==o&&(a+=t.width))})),{top:r=r>0?r+25+10:r,bottom:n=n>0?n+25+10:n,left:i=i>0?i+25+10:i,right:a=a>0?a+25+10:a}}(o),h=function(t,r){var n=e.max(t.nodes,(function(t){return t.column})),o=b-a,s=T-i,l=o/(o+r.right+r.left),c=s/(s+r.top+r.bottom);return a=a*l+r.left,b=0==r.right?b:b*l,i=i*c+r.top,T*=c,t.nodes.forEach((function(t){t.x0=a+t.column*((b-a-A)/n),t.x1=t.x0+A})),c}(o,u);l*=h,o.links.forEach((function(t){t.width=t.value*l})),c.forEach((function(t){var e=t.length;t.forEach((function(t,n){t.depth==c.length-1&&1==e||0==t.depth&&1==e?(t.y0=T/2-t.value*l,t.y1=t.y0+t.value*l):t.partOfCycle?0==k(t,r)?(t.y0=T/2+n,t.y1=t.y0+t.value*l):"top"==t.circularLinkType?(t.y0=i+n,t.y1=t.y0+t.value*l):(t.y0=T-t.value*l-n,t.y1=t.y0+t.value*l):0==u.top||0==u.bottom?(t.y0=(T-i)/e*n,t.y1=t.y0+t.value*l):(t.y0=(T-i)/2-e/2+n,t.y1=t.y0+t.value*l)}))}))}(l),y();for(var u=1,m=s;m>0;--m)v(u*=.99,l),y();function v(t,r){var n=c.length;c.forEach((function(a){var i=a.length,o=a[0].depth;a.forEach((function(a){var s;if(a.sourceLinks.length||a.targetLinks.length)if(a.partOfCycle&&k(a,r)>0);else if(0==o&&1==i)s=a.y1-a.y0,a.y0=T/2-s/2,a.y1=T/2+s/2;else if(o==n-1&&1==i)s=a.y1-a.y0,a.y0=T/2-s/2,a.y1=T/2+s/2;else{var l=e.mean(a.sourceLinks,g),c=e.mean(a.targetLinks,d),u=((l&&c?(l+c)/2:l||c)-p(a))*t;a.y0+=u,a.y1+=u}}))}))}function y(){c.forEach((function(e){var r,n,a,o=i,s=e.length;for(e.sort(h),a=0;a<s;++a)(n=o-(r=e[a]).y0)>0&&(r.y0+=n,r.y1+=n),o=r.y1+t;if((n=o-t-T)>0)for(o=r.y0-=n,r.y1-=n,a=s-2;a>=0;--a)(n=(r=e[a]).y1+t-o)>0&&(r.y0-=n,r.y1-=n),o=r.y0}))}}function U(t){t.nodes.forEach((function(t){t.sourceLinks.sort(u),t.targetLinks.sort(c)})),t.nodes.forEach((function(t){var e=t.y0,r=e,n=t.y1,a=n;t.sourceLinks.forEach((function(t){t.circular?(t.y0=n-t.width/2,n-=t.width):(t.y0=e+t.width/2,e+=t.width)})),t.targetLinks.forEach((function(t){t.circular?(t.y1=a-t.width/2,a-=t.width):(t.y1=r+t.width/2,r+=t.width)}))}))}return O.nodeId=function(t){return arguments.length?(M="function"==typeof t?t:s(t),O):M},O.nodeAlign=function(t){return arguments.length?(E="function"==typeof t?t:s(t),O):E},O.nodeWidth=function(t){return arguments.length?(A=+t,O):A},O.nodePadding=function(e){return arguments.length?(t=+e,O):t},O.nodes=function(t){return arguments.length?(C="function"==typeof t?t:s(t),O):C},O.links=function(t){return arguments.length?(L="function"==typeof t?t:s(t),O):L},O.size=function(t){return arguments.length?(a=i=0,b=+t[0],T=+t[1],O):[b-a,T-i]},O.extent=function(t){return arguments.length?(a=+t[0][0],b=+t[1][0],i=+t[0][1],T=+t[1][1],O):[[a,i],[b,T]]},O.iterations=function(t){return arguments.length?(P=+t,O):P},O.circularLinkGap=function(t){return arguments.length?(I=+t,O):I},O.nodePaddingRatio=function(t){return arguments.length?(n=+t,O):n},O.sortNodes=function(t){return arguments.length?(z=t,O):z},O.update=function(t){return w(t,M),U(t),t.links.forEach((function(t){t.circular&&(t.circularLinkType=t.y0+t.y1<T?"top":"bottom",t.source.circularLinkType=t.circularLinkType,t.target.circularLinkType=t.circularLinkType)})),j(t,T,M,!1),V(t,T,M),S(t,I,T,M),t},O},t.sankeyCenter=function(t){return t.targetLinks.length?t.depth:t.sourceLinks.length?e.min(t.sourceLinks,i)-1:0},t.sankeyLeft=function(t){return t.depth},t.sankeyRight=function(t,e){return e-1-t.height},t.sankeyJustify=o,Object.defineProperty(t,"__esModule",{value:!0})}))},{"d3-array":153,"d3-collection":154,"d3-shape":162,"elementary-circuits-directed-graph":174}],56:[function(t,e,r){!function(n,a){"object"==typeof r&&"undefined"!=typeof e?a(r,t("d3-array"),t("d3-collection"),t("d3-shape")):a(n.d3=n.d3||{},n.d3,n.d3,n.d3)}(this,(function(t,e,r,n){"use strict";function a(t){return t.target.depth}function i(t,e){return t.sourceLinks.length?t.depth:e-1}function o(t){return function(){return t}}function s(t,e){return c(t.source,e.source)||t.index-e.index}function l(t,e){return c(t.target,e.target)||t.index-e.index}function c(t,e){return t.y0-e.y0}function u(t){return t.value}function h(t){return(t.y0+t.y1)/2}function f(t){return h(t.source)*t.value}function p(t){return h(t.target)*t.value}function d(t){return t.index}function g(t){return t.nodes}function m(t){return t.links}function v(t,e){var r=t.get(e);if(!r)throw new Error("missing: "+e);return r}function y(t){return[t.source.x1,t.y0]}function x(t){return[t.target.x0,t.y1]}t.sankey=function(){var t=0,n=0,a=1,y=1,x=24,b=8,_=d,w=i,T=g,k=m,A=32;function M(){var t={nodes:T.apply(null,arguments),links:k.apply(null,arguments)};return S(t),E(t),C(t),L(t),P(t),t}function S(t){t.nodes.forEach((function(t,e){t.index=e,t.sourceLinks=[],t.targetLinks=[]}));var e=r.map(t.nodes,_);t.links.forEach((function(t,r){t.index=r;var n=t.source,a=t.target;"object"!=typeof n&&(n=t.source=v(e,n)),"object"!=typeof a&&(a=t.target=v(e,a)),n.sourceLinks.push(t),a.targetLinks.push(t)}))}function E(t){t.nodes.forEach((function(t){t.value=Math.max(e.sum(t.sourceLinks,u),e.sum(t.targetLinks,u))}))}function C(e){var r,n,i;for(r=e.nodes,n=[],i=0;r.length;++i,r=n,n=[])r.forEach((function(t){t.depth=i,t.sourceLinks.forEach((function(t){n.indexOf(t.target)<0&&n.push(t.target)}))}));for(r=e.nodes,n=[],i=0;r.length;++i,r=n,n=[])r.forEach((function(t){t.height=i,t.targetLinks.forEach((function(t){n.indexOf(t.source)<0&&n.push(t.source)}))}));var o=(a-t-x)/(i-1);e.nodes.forEach((function(e){e.x1=(e.x0=t+Math.max(0,Math.min(i-1,Math.floor(w.call(null,e,i))))*o)+x}))}function L(t){var a=r.nest().key((function(t){return t.x0})).sortKeys(e.ascending).entries(t.nodes).map((function(t){return t.values}));!function(){var r=e.max(a,(function(t){return t.length})),i=2/3*(y-n)/(r-1);b>i&&(b=i);var o=e.min(a,(function(t){return(y-n-(t.length-1)*b)/e.sum(t,u)}));a.forEach((function(t){t.forEach((function(t,e){t.y1=(t.y0=e)+t.value*o}))})),t.links.forEach((function(t){t.width=t.value*o}))}(),d();for(var i=1,o=A;o>0;--o)l(i*=.99),d(),s(i),d();function s(t){a.forEach((function(r){r.forEach((function(r){if(r.targetLinks.length){var n=(e.sum(r.targetLinks,f)/e.sum(r.targetLinks,u)-h(r))*t;r.y0+=n,r.y1+=n}}))}))}function l(t){a.slice().reverse().forEach((function(r){r.forEach((function(r){if(r.sourceLinks.length){var n=(e.sum(r.sourceLinks,p)/e.sum(r.sourceLinks,u)-h(r))*t;r.y0+=n,r.y1+=n}}))}))}function d(){a.forEach((function(t){var e,r,a,i=n,o=t.length;for(t.sort(c),a=0;a<o;++a)(r=i-(e=t[a]).y0)>0&&(e.y0+=r,e.y1+=r),i=e.y1+b;if((r=i-b-y)>0)for(i=e.y0-=r,e.y1-=r,a=o-2;a>=0;--a)(r=(e=t[a]).y1+b-i)>0&&(e.y0-=r,e.y1-=r),i=e.y0}))}}function P(t){t.nodes.forEach((function(t){t.sourceLinks.sort(l),t.targetLinks.sort(s)})),t.nodes.forEach((function(t){var e=t.y0,r=e;t.sourceLinks.forEach((function(t){t.y0=e+t.width/2,e+=t.width})),t.targetLinks.forEach((function(t){t.y1=r+t.width/2,r+=t.width}))}))}return M.update=function(t){return P(t),t},M.nodeId=function(t){return arguments.length?(_="function"==typeof t?t:o(t),M):_},M.nodeAlign=function(t){return arguments.length?(w="function"==typeof t?t:o(t),M):w},M.nodeWidth=function(t){return arguments.length?(x=+t,M):x},M.nodePadding=function(t){return arguments.length?(b=+t,M):b},M.nodes=function(t){return arguments.length?(T="function"==typeof t?t:o(t),M):T},M.links=function(t){return arguments.length?(k="function"==typeof t?t:o(t),M):k},M.size=function(e){return arguments.length?(t=n=0,a=+e[0],y=+e[1],M):[a-t,y-n]},M.extent=function(e){return arguments.length?(t=+e[0][0],a=+e[1][0],n=+e[0][1],y=+e[1][1],M):[[t,n],[a,y]]},M.iterations=function(t){return arguments.length?(A=+t,M):A},M},t.sankeyCenter=function(t){return t.targetLinks.length?t.depth:t.sourceLinks.length?e.min(t.sourceLinks,a)-1:0},t.sankeyLeft=function(t){return t.depth},t.sankeyRight=function(t,e){return e-1-t.height},t.sankeyJustify=i,t.sankeyLinkHorizontal=function(){return n.linkHorizontal().source(y).target(x)},Object.defineProperty(t,"__esModule",{value:!0})}))},{"d3-array":153,"d3-collection":154,"d3-shape":162}],57:[function(t,e,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=t("@turf/meta");function a(t){var e=0;if(t&&t.length>0){e+=Math.abs(i(t[0]));for(var r=1;r<t.length;r++)e-=Math.abs(i(t[r]))}return e}function i(t){var e,r,n,a,i,s,l=0,c=t.length;if(c>2){for(s=0;s<c;s++)s===c-2?(n=c-2,a=c-1,i=0):s===c-1?(n=c-1,a=0,i=1):(n=s,a=s+1,i=s+2),e=t[n],r=t[a],l+=(o(t[i][0])-o(e[0]))*Math.sin(o(r[1]));l=6378137*l*6378137/2}return l}function o(t){return t*Math.PI/180}r.default=function(t){return n.geomReduce(t,(function(t,e){return t+function(t){var e,r=0;switch(t.type){case"Polygon":return a(t.coordinates);case"MultiPolygon":for(e=0;e<t.coordinates.length;e++)r+=a(t.coordinates[e]);return r;case"Point":case"MultiPoint":case"LineString":case"MultiLineString":return 0}return 0}(e)}),0)}},{"@turf/meta":61}],58:[function(t,e,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=t("@turf/meta");r.default=function(t){var e=[1/0,1/0,-1/0,-1/0];return n.coordEach(t,(function(t){e[0]>t[0]&&(e[0]=t[0]),e[1]>t[1]&&(e[1]=t[1]),e[2]<t[0]&&(e[2]=t[0]),e[3]<t[1]&&(e[3]=t[1])})),e}},{"@turf/meta":61}],59:[function(t,e,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=t("@turf/meta"),a=t("@turf/helpers");r.default=function(t,e){void 0===e&&(e={});var r=0,i=0,o=0;return n.coordEach(t,(function(t){r+=t[0],i+=t[1],o++})),a.point([r/o,i/o],e.properties)}},{"@turf/helpers":60,"@turf/meta":61}],60:[function(t,e,r){"use strict";function n(t,e,r){void 0===r&&(r={});var n={type:"Feature"};return(0===r.id||r.id)&&(n.id=r.id),r.bbox&&(n.bbox=r.bbox),n.properties=e||{},n.geometry=t,n}function a(t,e,r){return void 0===r&&(r={}),n({type:"Point",coordinates:t},e,r)}function i(t,e,r){void 0===r&&(r={});for(var a=0,i=t;a<i.length;a++){var o=i[a];if(o.length<4)throw new Error("Each LinearRing of a Polygon must have 4 or more Positions.");for(var s=0;s<o[o.length-1].length;s++)if(o[o.length-1][s]!==o[0][s])throw new Error("First and last Position are not equivalent.")}return n({type:"Polygon",coordinates:t},e,r)}function o(t,e,r){if(void 0===r&&(r={}),t.length<2)throw new Error("coordinates must be an array of two or more positions");return n({type:"LineString",coordinates:t},e,r)}function s(t,e){void 0===e&&(e={});var r={type:"FeatureCollection"};return e.id&&(r.id=e.id),e.bbox&&(r.bbox=e.bbox),r.features=t,r}function l(t,e,r){return void 0===r&&(r={}),n({type:"MultiLineString",coordinates:t},e,r)}function c(t,e,r){return void 0===r&&(r={}),n({type:"MultiPoint",coordinates:t},e,r)}function u(t,e,r){return void 0===r&&(r={}),n({type:"MultiPolygon",coordinates:t},e,r)}function h(t,e){void 0===e&&(e="kilometers");var n=r.factors[e];if(!n)throw new Error(e+" units is invalid");return t*n}function f(t,e){void 0===e&&(e="kilometers");var n=r.factors[e];if(!n)throw new Error(e+" units is invalid");return t/n}function p(t){return 180*(t%(2*Math.PI))/Math.PI}function d(t){return!isNaN(t)&&null!==t&&!Array.isArray(t)&&!/^\s*$/.test(t)}Object.defineProperty(r,"__esModule",{value:!0}),r.earthRadius=6371008.8,r.factors={centimeters:100*r.earthRadius,centimetres:100*r.earthRadius,degrees:r.earthRadius/111325,feet:3.28084*r.earthRadius,inches:39.37*r.earthRadius,kilometers:r.earthRadius/1e3,kilometres:r.earthRadius/1e3,meters:r.earthRadius,metres:r.earthRadius,miles:r.earthRadius/1609.344,millimeters:1e3*r.earthRadius,millimetres:1e3*r.earthRadius,nauticalmiles:r.earthRadius/1852,radians:1,yards:r.earthRadius/1.0936},r.unitsFactors={centimeters:100,centimetres:100,degrees:1/111325,feet:3.28084,inches:39.37,kilometers:.001,kilometres:.001,meters:1,metres:1,miles:1/1609.344,millimeters:1e3,millimetres:1e3,nauticalmiles:1/1852,radians:1/r.earthRadius,yards:1/1.0936},r.areaFactors={acres:247105e-9,centimeters:1e4,centimetres:1e4,feet:10.763910417,inches:1550.003100006,kilometers:1e-6,kilometres:1e-6,meters:1,metres:1,miles:386e-9,millimeters:1e6,millimetres:1e6,yards:1.195990046},r.feature=n,r.geometry=function(t,e,r){switch(void 0===r&&(r={}),t){case"Point":return a(e).geometry;case"LineString":return o(e).geometry;case"Polygon":return i(e).geometry;case"MultiPoint":return c(e).geometry;case"MultiLineString":return l(e).geometry;case"MultiPolygon":return u(e).geometry;default:throw new Error(t+" is invalid")}},r.point=a,r.points=function(t,e,r){return void 0===r&&(r={}),s(t.map((function(t){return a(t,e)})),r)},r.polygon=i,r.polygons=function(t,e,r){return void 0===r&&(r={}),s(t.map((function(t){return i(t,e)})),r)},r.lineString=o,r.lineStrings=function(t,e,r){return void 0===r&&(r={}),s(t.map((function(t){return o(t,e)})),r)},r.featureCollection=s,r.multiLineString=l,r.multiPoint=c,r.multiPolygon=u,r.geometryCollection=function(t,e,r){return void 0===r&&(r={}),n({type:"GeometryCollection",geometries:t},e,r)},r.round=function(t,e){if(void 0===e&&(e=0),e&&!(e>=0))throw new Error("precision must be a positive number");var r=Math.pow(10,e||0);return Math.round(t*r)/r},r.radiansToLength=h,r.lengthToRadians=f,r.lengthToDegrees=function(t,e){return p(f(t,e))},r.bearingToAzimuth=function(t){var e=t%360;return e<0&&(e+=360),e},r.radiansToDegrees=p,r.degreesToRadians=function(t){return t%360*Math.PI/180},r.convertLength=function(t,e,r){if(void 0===e&&(e="kilometers"),void 0===r&&(r="kilometers"),!(t>=0))throw new Error("length must be a positive number");return h(f(t,e),r)},r.convertArea=function(t,e,n){if(void 0===e&&(e="meters"),void 0===n&&(n="kilometers"),!(t>=0))throw new Error("area must be a positive number");var a=r.areaFactors[e];if(!a)throw new Error("invalid original units");var i=r.areaFactors[n];if(!i)throw new Error("invalid final units");return t/a*i},r.isNumber=d,r.isObject=function(t){return!!t&&t.constructor===Object},r.validateBBox=function(t){if(!t)throw new Error("bbox is required");if(!Array.isArray(t))throw new Error("bbox must be an Array");if(4!==t.length&&6!==t.length)throw new Error("bbox must be an Array of 4 or 6 numbers");t.forEach((function(t){if(!d(t))throw new Error("bbox must only contain numbers")}))},r.validateId=function(t){if(!t)throw new Error("id is required");if(-1===["string","number"].indexOf(typeof t))throw new Error("id must be a number or a string")},r.radians2degrees=function(){throw new Error("method has been renamed to `radiansToDegrees`")},r.degrees2radians=function(){throw new Error("method has been renamed to `degreesToRadians`")},r.distanceToDegrees=function(){throw new Error("method has been renamed to `lengthToDegrees`")},r.distanceToRadians=function(){throw new Error("method has been renamed to `lengthToRadians`")},r.radiansToDistance=function(){throw new Error("method has been renamed to `radiansToLength`")},r.bearingToAngle=function(){throw new Error("method has been renamed to `bearingToAzimuth`")},r.convertDistance=function(){throw new Error("method has been renamed to `convertLength`")}},{}],61:[function(t,e,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=t("@turf/helpers");function a(t,e,r){if(null!==t)for(var n,i,o,s,l,c,u,h,f=0,p=0,d=t.type,g="FeatureCollection"===d,m="Feature"===d,v=g?t.features.length:1,y=0;y<v;y++){l=(h=!!(u=g?t.features[y].geometry:m?t.geometry:t)&&"GeometryCollection"===u.type)?u.geometries.length:1;for(var x=0;x<l;x++){var b=0,_=0;if(null!==(s=h?u.geometries[x]:u)){c=s.coordinates;var w=s.type;switch(f=!r||"Polygon"!==w&&"MultiPolygon"!==w?0:1,w){case null:break;case"Point":if(!1===e(c,p,y,b,_))return!1;p++,b++;break;case"LineString":case"MultiPoint":for(n=0;n<c.length;n++){if(!1===e(c[n],p,y,b,_))return!1;p++,"MultiPoint"===w&&b++}"LineString"===w&&b++;break;case"Polygon":case"MultiLineString":for(n=0;n<c.length;n++){for(i=0;i<c[n].length-f;i++){if(!1===e(c[n][i],p,y,b,_))return!1;p++}"MultiLineString"===w&&b++,"Polygon"===w&&_++}"Polygon"===w&&b++;break;case"MultiPolygon":for(n=0;n<c.length;n++){for(_=0,i=0;i<c[n].length;i++){for(o=0;o<c[n][i].length-f;o++){if(!1===e(c[n][i][o],p,y,b,_))return!1;p++}_++}b++}break;case"GeometryCollection":for(n=0;n<s.geometries.length;n++)if(!1===a(s.geometries[n],e,r))return!1;break;default:throw new Error("Unknown Geometry Type")}}}}}function i(t,e){var r;switch(t.type){case"FeatureCollection":for(r=0;r<t.features.length&&!1!==e(t.features[r].properties,r);r++);break;case"Feature":e(t.properties,0)}}function o(t,e){if("Feature"===t.type)e(t,0);else if("FeatureCollection"===t.type)for(var r=0;r<t.features.length&&!1!==e(t.features[r],r);r++);}function s(t,e){var r,n,a,i,o,s,l,c,u,h,f=0,p="FeatureCollection"===t.type,d="Feature"===t.type,g=p?t.features.length:1;for(r=0;r<g;r++){for(s=p?t.features[r].geometry:d?t.geometry:t,c=p?t.features[r].properties:d?t.properties:{},u=p?t.features[r].bbox:d?t.bbox:void 0,h=p?t.features[r].id:d?t.id:void 0,o=(l=!!s&&"GeometryCollection"===s.type)?s.geometries.length:1,a=0;a<o;a++)if(null!==(i=l?s.geometries[a]:s))switch(i.type){case"Point":case"LineString":case"MultiPoint":case"Polygon":case"MultiLineString":case"MultiPolygon":if(!1===e(i,f,c,u,h))return!1;break;case"GeometryCollection":for(n=0;n<i.geometries.length;n++)if(!1===e(i.geometries[n],f,c,u,h))return!1;break;default:throw new Error("Unknown Geometry Type")}else if(!1===e(null,f,c,u,h))return!1;f++}}function l(t,e){s(t,(function(t,r,a,i,o){var s,l=null===t?null:t.type;switch(l){case null:case"Point":case"LineString":case"Polygon":return!1!==e(n.feature(t,a,{bbox:i,id:o}),r,0)&&void 0}switch(l){case"MultiPoint":s="Point";break;case"MultiLineString":s="LineString";break;case"MultiPolygon":s="Polygon"}for(var c=0;c<t.coordinates.length;c++){var u={type:s,coordinates:t.coordinates[c]};if(!1===e(n.feature(u,a),r,c))return!1}}))}function c(t,e){l(t,(function(t,r,i){var o=0;if(t.geometry){var s=t.geometry.type;if("Point"!==s&&"MultiPoint"!==s){var l,c=0,u=0,h=0;return!1!==a(t,(function(a,s,f,p,d){if(void 0===l||r>c||p>u||d>h)return l=a,c=r,u=p,h=d,void(o=0);var g=n.lineString([l,a],t.properties);if(!1===e(g,r,i,d,o))return!1;o++,l=a}))&&void 0}}}))}function u(t,e){if(!t)throw new Error("geojson is required");l(t,(function(t,r,a){if(null!==t.geometry){var i=t.geometry.type,o=t.geometry.coordinates;switch(i){case"LineString":if(!1===e(t,r,a,0,0))return!1;break;case"Polygon":for(var s=0;s<o.length;s++)if(!1===e(n.lineString(o[s],t.properties),r,a,s))return!1}}}))}r.coordEach=a,r.coordReduce=function(t,e,r,n){var i=r;return a(t,(function(t,n,a,o,s){i=0===n&&void 0===r?t:e(i,t,n,a,o,s)}),n),i},r.propEach=i,r.propReduce=function(t,e,r){var n=r;return i(t,(function(t,a){n=0===a&&void 0===r?t:e(n,t,a)})),n},r.featureEach=o,r.featureReduce=function(t,e,r){var n=r;return o(t,(function(t,a){n=0===a&&void 0===r?t:e(n,t,a)})),n},r.coordAll=function(t){var e=[];return a(t,(function(t){e.push(t)})),e},r.geomEach=s,r.geomReduce=function(t,e,r){var n=r;return s(t,(function(t,a,i,o,s){n=0===a&&void 0===r?t:e(n,t,a,i,o,s)})),n},r.flattenEach=l,r.flattenReduce=function(t,e,r){var n=r;return l(t,(function(t,a,i){n=0===a&&0===i&&void 0===r?t:e(n,t,a,i)})),n},r.segmentEach=c,r.segmentReduce=function(t,e,r){var n=r,a=!1;return c(t,(function(t,i,o,s,l){n=!1===a&&void 0===r?t:e(n,t,i,o,s,l),a=!0})),n},r.lineEach=u,r.lineReduce=function(t,e,r){var n=r;return u(t,(function(t,a,i,o){n=0===a&&void 0===r?t:e(n,t,a,i,o)})),n},r.findSegment=function(t,e){if(e=e||{},!n.isObject(e))throw new Error("options is invalid");var r,a=e.featureIndex||0,i=e.multiFeatureIndex||0,o=e.geometryIndex||0,s=e.segmentIndex||0,l=e.properties;switch(t.type){case"FeatureCollection":a<0&&(a=t.features.length+a),l=l||t.features[a].properties,r=t.features[a].geometry;break;case"Feature":l=l||t.properties,r=t.geometry;break;case"Point":case"MultiPoint":return null;case"LineString":case"Polygon":case"MultiLineString":case"MultiPolygon":r=t;break;default:throw new Error("geojson is invalid")}if(null===r)return null;var c=r.coordinates;switch(r.type){case"Point":case"MultiPoint":return null;case"LineString":return s<0&&(s=c.length+s-1),n.lineString([c[s],c[s+1]],l,e);case"Polygon":return o<0&&(o=c.length+o),s<0&&(s=c[o].length+s-1),n.lineString([c[o][s],c[o][s+1]],l,e);case"MultiLineString":return i<0&&(i=c.length+i),s<0&&(s=c[i].length+s-1),n.lineString([c[i][s],c[i][s+1]],l,e);case"MultiPolygon":return i<0&&(i=c.length+i),o<0&&(o=c[i].length+o),s<0&&(s=c[i][o].length-s-1),n.lineString([c[i][o][s],c[i][o][s+1]],l,e)}throw new Error("geojson is invalid")},r.findPoint=function(t,e){if(e=e||{},!n.isObject(e))throw new Error("options is invalid");var r,a=e.featureIndex||0,i=e.multiFeatureIndex||0,o=e.geometryIndex||0,s=e.coordIndex||0,l=e.properties;switch(t.type){case"FeatureCollection":a<0&&(a=t.features.length+a),l=l||t.features[a].properties,r=t.features[a].geometry;break;case"Feature":l=l||t.properties,r=t.geometry;break;case"Point":case"MultiPoint":return null;case"LineString":case"Polygon":case"MultiLineString":case"MultiPolygon":r=t;break;default:throw new Error("geojson is invalid")}if(null===r)return null;var c=r.coordinates;switch(r.type){case"Point":return n.point(c,l,e);case"MultiPoint":return i<0&&(i=c.length+i),n.point(c[i],l,e);case"LineString":return s<0&&(s=c.length+s),n.point(c[s],l,e);case"Polygon":return o<0&&(o=c.length+o),s<0&&(s=c[o].length+s),n.point(c[o][s],l,e);case"MultiLineString":return i<0&&(i=c.length+i),s<0&&(s=c[i].length+s),n.point(c[i][s],l,e);case"MultiPolygon":return i<0&&(i=c.length+i),o<0&&(o=c[i].length+o),s<0&&(s=c[i][o].length-s),n.point(c[i][o][s],l,e)}throw new Error("geojson is invalid")}},{"@turf/helpers":60}],62:[function(t,e,r){"use strict";var n="undefined"==typeof WeakMap?t("weak-map"):WeakMap,a=t("gl-buffer"),i=t("gl-vao"),o=new n;e.exports=function(t){var e=o.get(t),r=e&&(e._triangleBuffer.handle||e._triangleBuffer.buffer);if(!r||!t.isBuffer(r)){var n=a(t,new Float32Array([-1,-1,-1,4,4,-1]));(e=i(t,[{buffer:n,type:t.FLOAT,size:2}]))._triangleBuffer=n,o.set(t,e)}e.bind(),t.drawArrays(t.TRIANGLES,0,3),e.unbind()}},{"gl-buffer":253,"gl-vao":327,"weak-map":554}],63:[function(t,e,r){e.exports=function(t){var e=0,r=0,n=0,a=0;return t.map((function(t){var i=(t=t.slice())[0],o=i.toUpperCase();if(i!=o)switch(t[0]=o,i){case"a":t[6]+=n,t[7]+=a;break;case"v":t[1]+=a;break;case"h":t[1]+=n;break;default:for(var s=1;s<t.length;)t[s++]+=n,t[s++]+=a}switch(o){case"Z":n=e,a=r;break;case"H":n=t[1];break;case"V":a=t[1];break;case"M":n=e=t[1],a=r=t[2];break;default:n=t[t.length-2],a=t[t.length-1]}return t}))}},{}],64:[function(t,e,r){var n=t("pad-left");e.exports=function(t,e,r){e="number"==typeof e?e:1,r=r||": ";var a=t.split(/\r?\n/),i=String(a.length+e-1).length;return a.map((function(t,a){var o=a+e,s=String(o).length;return n(o,i-s)+r+t})).join("\n")}},{"pad-left":455}],65:[function(t,e,r){"use strict";e.exports=function(t){var e=t.length;if(0===e)return[];if(1===e)return[0];for(var r=t[0].length,n=[t[0]],i=[0],o=1;o<e;++o)if(n.push(t[o]),a(n,r)){if(i.push(o),i.length===r+1)return i}else n.pop();return i};var n=t("robust-orientation");function a(t,e){for(var r=new Array(e+1),a=0;a<t.length;++a)r[a]=t[a];for(a=0;a<=t.length;++a){for(var i=t.length;i<=e;++i){for(var o=new Array(e),s=0;s<e;++s)o[s]=Math.pow(i+1-a,s);r[i]=o}if(n.apply(void 0,r))return!0}return!1}},{"robust-orientation":500}],66:[function(t,e,r){"use strict";e.exports=function(t,e){return n(e).filter((function(r){for(var n=new Array(r.length),i=0;i<r.length;++i)n[i]=e[r[i]];return a(n)*t<1}))};var n=t("delaunay-triangulate"),a=t("circumradius")},{circumradius:116,"delaunay-triangulate":166}],67:[function(t,e,r){e.exports=function(t,e){return a(n(t,e))};var n=t("alpha-complex"),a=t("simplicial-complex-boundary")},{"alpha-complex":66,"simplicial-complex-boundary":507}],68:[function(t,e,r){"use strict";e.exports=function(t,e){if(!t||null==t.length)throw Error("Argument should be an array");e=null==e?1:Math.floor(e);for(var r=Array(2*e),n=0;n<e;n++){for(var a=-1/0,i=1/0,o=n,s=t.length;o<s;o+=e)t[o]>a&&(a=t[o]),t[o]<i&&(i=t[o]);r[n]=i,r[e+n]=a}return r}},{}],69:[function(t,e,r){"use strict";var n=t("array-bounds");e.exports=function(t,e,r){if(!t||null==t.length)throw Error("Argument should be an array");null==e&&(e=1);null==r&&(r=n(t,e));for(var a=0;a<e;a++){var i=r[e+a],o=r[a],s=a,l=t.length;if(i===1/0&&o===-1/0)for(s=a;s<l;s+=e)t[s]=t[s]===i?1:t[s]===o?0:.5;else if(i===1/0)for(s=a;s<l;s+=e)t[s]=t[s]===i?1:0;else if(o===-1/0)for(s=a;s<l;s+=e)t[s]=t[s]===o?0:1;else{var c=i-o;for(s=a;s<l;s+=e)isNaN(t[s])||(t[s]=0===c?.5:(t[s]-o)/c)}}return t}},{"array-bounds":68}],70:[function(t,e,r){e.exports=function(t,e){var r="number"==typeof t,n="number"==typeof e;r&&!n?(e=t,t=0):r||n||(t=0,e=0);var a=(e|=0)-(t|=0);if(a<0)throw new Error("array length must be positive");for(var i=new Array(a),o=0,s=t;o<a;o++,s++)i[o]=s;return i}},{}],71:[function(t,e,r){(function(r){"use strict";var n=t("object-assign");
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */function a(t,e){if(t===e)return 0;for(var r=t.length,n=e.length,a=0,i=Math.min(r,n);a<i;++a)if(t[a]!==e[a]){r=t[a],n=e[a];break}return r<n?-1:n<r?1:0}function i(t){return r.Buffer&&"function"==typeof r.Buffer.isBuffer?r.Buffer.isBuffer(t):!(null==t||!t._isBuffer)}var o=t("util/"),s=Object.prototype.hasOwnProperty,l=Array.prototype.slice,c="foo"===function(){}.name;function u(t){return Object.prototype.toString.call(t)}function h(t){return!i(t)&&("function"==typeof r.ArrayBuffer&&("function"==typeof ArrayBuffer.isView?ArrayBuffer.isView(t):!!t&&(t instanceof DataView||!!(t.buffer&&t.buffer instanceof ArrayBuffer))))}var f=e.exports=y,p=/\s*function\s+([^\(\s]*)\s*/;function d(t){if(o.isFunction(t)){if(c)return t.name;var e=t.toString().match(p);return e&&e[1]}}function g(t,e){return"string"==typeof t?t.length<e?t:t.slice(0,e):t}function m(t){if(c||!o.isFunction(t))return o.inspect(t);var e=d(t);return"[Function"+(e?": "+e:"")+"]"}function v(t,e,r,n,a){throw new f.AssertionError({message:r,actual:t,expected:e,operator:n,stackStartFunction:a})}function y(t,e){t||v(t,!0,e,"==",f.ok)}function x(t,e,r,n){if(t===e)return!0;if(i(t)&&i(e))return 0===a(t,e);if(o.isDate(t)&&o.isDate(e))return t.getTime()===e.getTime();if(o.isRegExp(t)&&o.isRegExp(e))return t.source===e.source&&t.global===e.global&&t.multiline===e.multiline&&t.lastIndex===e.lastIndex&&t.ignoreCase===e.ignoreCase;if(null!==t&&"object"==typeof t||null!==e&&"object"==typeof e){if(h(t)&&h(e)&&u(t)===u(e)&&!(t instanceof Float32Array||t instanceof Float64Array))return 0===a(new Uint8Array(t.buffer),new Uint8Array(e.buffer));if(i(t)!==i(e))return!1;var s=(n=n||{actual:[],expected:[]}).actual.indexOf(t);return-1!==s&&s===n.expected.indexOf(e)||(n.actual.push(t),n.expected.push(e),function(t,e,r,n){if(null==t||null==e)return!1;if(o.isPrimitive(t)||o.isPrimitive(e))return t===e;if(r&&Object.getPrototypeOf(t)!==Object.getPrototypeOf(e))return!1;var a=b(t),i=b(e);if(a&&!i||!a&&i)return!1;if(a)return t=l.call(t),e=l.call(e),x(t,e,r);var s,c,u=T(t),h=T(e);if(u.length!==h.length)return!1;for(u.sort(),h.sort(),c=u.length-1;c>=0;c--)if(u[c]!==h[c])return!1;for(c=u.length-1;c>=0;c--)if(s=u[c],!x(t[s],e[s],r,n))return!1;return!0}(t,e,r,n))}return r?t===e:t==e}function b(t){return"[object Arguments]"==Object.prototype.toString.call(t)}function _(t,e){if(!t||!e)return!1;if("[object RegExp]"==Object.prototype.toString.call(e))return e.test(t);try{if(t instanceof e)return!0}catch(t){}return!Error.isPrototypeOf(e)&&!0===e.call({},t)}function w(t,e,r,n){var a;if("function"!=typeof e)throw new TypeError('"block" argument must be a function');"string"==typeof r&&(n=r,r=null),a=function(t){var e;try{t()}catch(t){e=t}return e}(e),n=(r&&r.name?" ("+r.name+").":".")+(n?" "+n:"."),t&&!a&&v(a,r,"Missing expected exception"+n);var i="string"==typeof n,s=!t&&a&&!r;if((!t&&o.isError(a)&&i&&_(a,r)||s)&&v(a,r,"Got unwanted exception"+n),t&&a&&r&&!_(a,r)||!t&&a)throw a}f.AssertionError=function(t){this.name="AssertionError",this.actual=t.actual,this.expected=t.expected,this.operator=t.operator,t.message?(this.message=t.message,this.generatedMessage=!1):(this.message=function(t){return g(m(t.actual),128)+" "+t.operator+" "+g(m(t.expected),128)}(this),this.generatedMessage=!0);var e=t.stackStartFunction||v;if(Error.captureStackTrace)Error.captureStackTrace(this,e);else{var r=new Error;if(r.stack){var n=r.stack,a=d(e),i=n.indexOf("\n"+a);if(i>=0){var o=n.indexOf("\n",i+1);n=n.substring(o+1)}this.stack=n}}},o.inherits(f.AssertionError,Error),f.fail=v,f.ok=y,f.equal=function(t,e,r){t!=e&&v(t,e,r,"==",f.equal)},f.notEqual=function(t,e,r){t==e&&v(t,e,r,"!=",f.notEqual)},f.deepEqual=function(t,e,r){x(t,e,!1)||v(t,e,r,"deepEqual",f.deepEqual)},f.deepStrictEqual=function(t,e,r){x(t,e,!0)||v(t,e,r,"deepStrictEqual",f.deepStrictEqual)},f.notDeepEqual=function(t,e,r){x(t,e,!1)&&v(t,e,r,"notDeepEqual",f.notDeepEqual)},f.notDeepStrictEqual=function t(e,r,n){x(e,r,!0)&&v(e,r,n,"notDeepStrictEqual",t)},f.strictEqual=function(t,e,r){t!==e&&v(t,e,r,"===",f.strictEqual)},f.notStrictEqual=function(t,e,r){t===e&&v(t,e,r,"!==",f.notStrictEqual)},f.throws=function(t,e,r){w(!0,t,e,r)},f.doesNotThrow=function(t,e,r){w(!1,t,e,r)},f.ifError=function(t){if(t)throw t},f.strict=n((function t(e,r){e||v(e,!0,r,"==",t)}),f,{equal:f.strictEqual,deepEqual:f.deepStrictEqual,notEqual:f.notStrictEqual,notDeepEqual:f.notDeepStrictEqual}),f.strict.strict=f.strict;var T=Object.keys||function(t){var e=[];for(var r in t)s.call(t,r)&&e.push(r);return e}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"object-assign":452,"util/":74}],72:[function(t,e,r){"function"==typeof Object.create?e.exports=function(t,e){t.super_=e,t.prototype=Object.create(e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}})}:e.exports=function(t,e){t.super_=e;var r=function(){};r.prototype=e.prototype,t.prototype=new r,t.prototype.constructor=t}},{}],73:[function(t,e,r){e.exports=function(t){return t&&"object"==typeof t&&"function"==typeof t.copy&&"function"==typeof t.fill&&"function"==typeof t.readUInt8}},{}],74:[function(t,e,r){(function(e,n){var a=/%[sdj%]/g;r.format=function(t){if(!v(t)){for(var e=[],r=0;r<arguments.length;r++)e.push(s(arguments[r]));return e.join(" ")}r=1;for(var n=arguments,i=n.length,o=String(t).replace(a,(function(t){if("%%"===t)return"%";if(r>=i)return t;switch(t){case"%s":return String(n[r++]);case"%d":return Number(n[r++]);case"%j":try{return JSON.stringify(n[r++])}catch(t){return"[Circular]"}default:return t}})),l=n[r];r<i;l=n[++r])g(l)||!b(l)?o+=" "+l:o+=" "+s(l);return o},r.deprecate=function(t,a){if(y(n.process))return function(){return r.deprecate(t,a).apply(this,arguments)};if(!0===e.noDeprecation)return t;var i=!1;return function(){if(!i){if(e.throwDeprecation)throw new Error(a);e.traceDeprecation?console.trace(a):console.error(a),i=!0}return t.apply(this,arguments)}};var i,o={};function s(t,e){var n={seen:[],stylize:c};return arguments.length>=3&&(n.depth=arguments[2]),arguments.length>=4&&(n.colors=arguments[3]),d(e)?n.showHidden=e:e&&r._extend(n,e),y(n.showHidden)&&(n.showHidden=!1),y(n.depth)&&(n.depth=2),y(n.colors)&&(n.colors=!1),y(n.customInspect)&&(n.customInspect=!0),n.colors&&(n.stylize=l),u(n,t,n.depth)}function l(t,e){var r=s.styles[e];return r?"\x1b["+s.colors[r][0]+"m"+t+"\x1b["+s.colors[r][1]+"m":t}function c(t,e){return t}function u(t,e,n){if(t.customInspect&&e&&T(e.inspect)&&e.inspect!==r.inspect&&(!e.constructor||e.constructor.prototype!==e)){var a=e.inspect(n,t);return v(a)||(a=u(t,a,n)),a}var i=function(t,e){if(y(e))return t.stylize("undefined","undefined");if(v(e)){var r="'"+JSON.stringify(e).replace(/^"|"$/g,"").replace(/'/g,"\\'").replace(/\\"/g,'"')+"'";return t.stylize(r,"string")}if(m(e))return t.stylize(""+e,"number");if(d(e))return t.stylize(""+e,"boolean");if(g(e))return t.stylize("null","null")}(t,e);if(i)return i;var o=Object.keys(e),s=function(t){var e={};return t.forEach((function(t,r){e[t]=!0})),e}(o);if(t.showHidden&&(o=Object.getOwnPropertyNames(e)),w(e)&&(o.indexOf("message")>=0||o.indexOf("description")>=0))return h(e);if(0===o.length){if(T(e)){var l=e.name?": "+e.name:"";return t.stylize("[Function"+l+"]","special")}if(x(e))return t.stylize(RegExp.prototype.toString.call(e),"regexp");if(_(e))return t.stylize(Date.prototype.toString.call(e),"date");if(w(e))return h(e)}var c,b="",k=!1,A=["{","}"];(p(e)&&(k=!0,A=["[","]"]),T(e))&&(b=" [Function"+(e.name?": "+e.name:"")+"]");return x(e)&&(b=" "+RegExp.prototype.toString.call(e)),_(e)&&(b=" "+Date.prototype.toUTCString.call(e)),w(e)&&(b=" "+h(e)),0!==o.length||k&&0!=e.length?n<0?x(e)?t.stylize(RegExp.prototype.toString.call(e),"regexp"):t.stylize("[Object]","special"):(t.seen.push(e),c=k?function(t,e,r,n,a){for(var i=[],o=0,s=e.length;o<s;++o)E(e,String(o))?i.push(f(t,e,r,n,String(o),!0)):i.push("");return a.forEach((function(a){a.match(/^\d+$/)||i.push(f(t,e,r,n,a,!0))})),i}(t,e,n,s,o):o.map((function(r){return f(t,e,n,s,r,k)})),t.seen.pop(),function(t,e,r){if(t.reduce((function(t,e){return e.indexOf("\n")>=0&&0,t+e.replace(/\u001b\[\d\d?m/g,"").length+1}),0)>60)return r[0]+(""===e?"":e+"\n ")+" "+t.join(",\n  ")+" "+r[1];return r[0]+e+" "+t.join(", ")+" "+r[1]}(c,b,A)):A[0]+b+A[1]}function h(t){return"["+Error.prototype.toString.call(t)+"]"}function f(t,e,r,n,a,i){var o,s,l;if((l=Object.getOwnPropertyDescriptor(e,a)||{value:e[a]}).get?s=l.set?t.stylize("[Getter/Setter]","special"):t.stylize("[Getter]","special"):l.set&&(s=t.stylize("[Setter]","special")),E(n,a)||(o="["+a+"]"),s||(t.seen.indexOf(l.value)<0?(s=g(r)?u(t,l.value,null):u(t,l.value,r-1)).indexOf("\n")>-1&&(s=i?s.split("\n").map((function(t){return"  "+t})).join("\n").substr(2):"\n"+s.split("\n").map((function(t){return"   "+t})).join("\n")):s=t.stylize("[Circular]","special")),y(o)){if(i&&a.match(/^\d+$/))return s;(o=JSON.stringify(""+a)).match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)?(o=o.substr(1,o.length-2),o=t.stylize(o,"name")):(o=o.replace(/'/g,"\\'").replace(/\\"/g,'"').replace(/(^"|"$)/g,"'"),o=t.stylize(o,"string"))}return o+": "+s}function p(t){return Array.isArray(t)}function d(t){return"boolean"==typeof t}function g(t){return null===t}function m(t){return"number"==typeof t}function v(t){return"string"==typeof t}function y(t){return void 0===t}function x(t){return b(t)&&"[object RegExp]"===k(t)}function b(t){return"object"==typeof t&&null!==t}function _(t){return b(t)&&"[object Date]"===k(t)}function w(t){return b(t)&&("[object Error]"===k(t)||t instanceof Error)}function T(t){return"function"==typeof t}function k(t){return Object.prototype.toString.call(t)}function A(t){return t<10?"0"+t.toString(10):t.toString(10)}r.debuglog=function(t){if(y(i)&&(i=e.env.NODE_DEBUG||""),t=t.toUpperCase(),!o[t])if(new RegExp("\\b"+t+"\\b","i").test(i)){var n=e.pid;o[t]=function(){var e=r.format.apply(r,arguments);console.error("%s %d: %s",t,n,e)}}else o[t]=function(){};return o[t]},r.inspect=s,s.colors={bold:[1,22],italic:[3,23],underline:[4,24],inverse:[7,27],white:[37,39],grey:[90,39],black:[30,39],blue:[34,39],cyan:[36,39],green:[32,39],magenta:[35,39],red:[31,39],yellow:[33,39]},s.styles={special:"cyan",number:"yellow",boolean:"yellow",undefined:"grey",null:"bold",string:"green",date:"magenta",regexp:"red"},r.isArray=p,r.isBoolean=d,r.isNull=g,r.isNullOrUndefined=function(t){return null==t},r.isNumber=m,r.isString=v,r.isSymbol=function(t){return"symbol"==typeof t},r.isUndefined=y,r.isRegExp=x,r.isObject=b,r.isDate=_,r.isError=w,r.isFunction=T,r.isPrimitive=function(t){return null===t||"boolean"==typeof t||"number"==typeof t||"string"==typeof t||"symbol"==typeof t||"undefined"==typeof t},r.isBuffer=t("./support/isBuffer");var M=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];function S(){var t=new Date,e=[A(t.getHours()),A(t.getMinutes()),A(t.getSeconds())].join(":");return[t.getDate(),M[t.getMonth()],e].join(" ")}function E(t,e){return Object.prototype.hasOwnProperty.call(t,e)}r.log=function(){console.log("%s - %s",S(),r.format.apply(r,arguments))},r.inherits=t("inherits"),r._extend=function(t,e){if(!e||!b(e))return t;for(var r=Object.keys(e),n=r.length;n--;)t[r[n]]=e[r[n]];return t}}).call(this,t("_process"),"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./support/isBuffer":73,_process:480,inherits:72}],75:[function(t,e,r){e.exports=function(t){return atob(t)}},{}],76:[function(t,e,r){"use strict";e.exports=function(t,e){for(var r=e.length,i=new Array(r+1),o=0;o<r;++o){for(var s=new Array(r+1),l=0;l<=r;++l)s[l]=t[l][o];i[o]=s}i[r]=new Array(r+1);for(o=0;o<=r;++o)i[r][o]=1;var c=new Array(r+1);for(o=0;o<r;++o)c[o]=e[o];c[r]=1;var u=n(i,c),h=a(u[r+1]);0===h&&(h=1);var f=new Array(r+1);for(o=0;o<=r;++o)f[o]=a(u[o])/h;return f};var n=t("robust-linear-solve");function a(t){for(var e=0,r=0;r<t.length;++r)e+=t[r];return e}},{"robust-linear-solve":499}],77:[function(t,e,r){"use strict";r.byteLength=function(t){var e=c(t),r=e[0],n=e[1];return 3*(r+n)/4-n},r.toByteArray=function(t){var e,r,n=c(t),o=n[0],s=n[1],l=new i(function(t,e,r){return 3*(e+r)/4-r}(0,o,s)),u=0,h=s>0?o-4:o;for(r=0;r<h;r+=4)e=a[t.charCodeAt(r)]<<18|a[t.charCodeAt(r+1)]<<12|a[t.charCodeAt(r+2)]<<6|a[t.charCodeAt(r+3)],l[u++]=e>>16&255,l[u++]=e>>8&255,l[u++]=255&e;2===s&&(e=a[t.charCodeAt(r)]<<2|a[t.charCodeAt(r+1)]>>4,l[u++]=255&e);1===s&&(e=a[t.charCodeAt(r)]<<10|a[t.charCodeAt(r+1)]<<4|a[t.charCodeAt(r+2)]>>2,l[u++]=e>>8&255,l[u++]=255&e);return l},r.fromByteArray=function(t){for(var e,r=t.length,a=r%3,i=[],o=0,s=r-a;o<s;o+=16383)i.push(u(t,o,o+16383>s?s:o+16383));1===a?(e=t[r-1],i.push(n[e>>2]+n[e<<4&63]+"==")):2===a&&(e=(t[r-2]<<8)+t[r-1],i.push(n[e>>10]+n[e>>4&63]+n[e<<2&63]+"="));return i.join("")};for(var n=[],a=[],i="undefined"!=typeof Uint8Array?Uint8Array:Array,o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",s=0,l=o.length;s<l;++s)n[s]=o[s],a[o.charCodeAt(s)]=s;function c(t){var e=t.length;if(e%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var r=t.indexOf("=");return-1===r&&(r=e),[r,r===e?0:4-r%4]}function u(t,e,r){for(var a,i,o=[],s=e;s<r;s+=3)a=(t[s]<<16&16711680)+(t[s+1]<<8&65280)+(255&t[s+2]),o.push(n[(i=a)>>18&63]+n[i>>12&63]+n[i>>6&63]+n[63&i]);return o.join("")}a["-".charCodeAt(0)]=62,a["_".charCodeAt(0)]=63},{}],78:[function(t,e,r){"use strict";var n=t("./lib/rationalize");e.exports=function(t,e){return n(t[0].mul(e[1]).add(e[0].mul(t[1])),t[1].mul(e[1]))}},{"./lib/rationalize":88}],79:[function(t,e,r){"use strict";e.exports=function(t,e){return t[0].mul(e[1]).cmp(e[0].mul(t[1]))}},{}],80:[function(t,e,r){"use strict";var n=t("./lib/rationalize");e.exports=function(t,e){return n(t[0].mul(e[1]),t[1].mul(e[0]))}},{"./lib/rationalize":88}],81:[function(t,e,r){"use strict";var n=t("./is-rat"),a=t("./lib/is-bn"),i=t("./lib/num-to-bn"),o=t("./lib/str-to-bn"),s=t("./lib/rationalize"),l=t("./div");e.exports=function t(e,r){if(n(e))return r?l(e,t(r)):[e[0].clone(),e[1].clone()];var c,u,h=0;if(a(e))c=e.clone();else if("string"==typeof e)c=o(e);else{if(0===e)return[i(0),i(1)];if(e===Math.floor(e))c=i(e);else{for(;e!==Math.floor(e);)e*=Math.pow(2,256),h-=256;c=i(e)}}if(n(r))c.mul(r[1]),u=r[0].clone();else if(a(r))u=r.clone();else if("string"==typeof r)u=o(r);else if(r)if(r===Math.floor(r))u=i(r);else{for(;r!==Math.floor(r);)r*=Math.pow(2,256),h+=256;u=i(r)}else u=i(1);h>0?c=c.ushln(h):h<0&&(u=u.ushln(-h));return s(c,u)}},{"./div":80,"./is-rat":82,"./lib/is-bn":86,"./lib/num-to-bn":87,"./lib/rationalize":88,"./lib/str-to-bn":89}],82:[function(t,e,r){"use strict";var n=t("./lib/is-bn");e.exports=function(t){return Array.isArray(t)&&2===t.length&&n(t[0])&&n(t[1])}},{"./lib/is-bn":86}],83:[function(t,e,r){"use strict";var n=t("bn.js");e.exports=function(t){return t.cmp(new n(0))}},{"bn.js":97}],84:[function(t,e,r){"use strict";var n=t("./bn-sign");e.exports=function(t){var e=t.length,r=t.words,a=0;if(1===e)a=r[0];else if(2===e)a=r[0]+67108864*r[1];else for(var i=0;i<e;i++){var o=r[i];a+=o*Math.pow(67108864,i)}return n(t)*a}},{"./bn-sign":83}],85:[function(t,e,r){"use strict";var n=t("double-bits"),a=t("bit-twiddle").countTrailingZeros;e.exports=function(t){var e=a(n.lo(t));if(e<32)return e;var r=a(n.hi(t));if(r>20)return 52;return r+32}},{"bit-twiddle":95,"double-bits":168}],86:[function(t,e,r){"use strict";t("bn.js");e.exports=function(t){return t&&"object"==typeof t&&Boolean(t.words)}},{"bn.js":97}],87:[function(t,e,r){"use strict";var n=t("bn.js"),a=t("double-bits");e.exports=function(t){var e=a.exponent(t);return e<52?new n(t):new n(t*Math.pow(2,52-e)).ushln(e-52)}},{"bn.js":97,"double-bits":168}],88:[function(t,e,r){"use strict";var n=t("./num-to-bn"),a=t("./bn-sign");e.exports=function(t,e){var r=a(t),i=a(e);if(0===r)return[n(0),n(1)];if(0===i)return[n(0),n(0)];i<0&&(t=t.neg(),e=e.neg());var o=t.gcd(e);if(o.cmpn(1))return[t.div(o),e.div(o)];return[t,e]}},{"./bn-sign":83,"./num-to-bn":87}],89:[function(t,e,r){"use strict";var n=t("bn.js");e.exports=function(t){return new n(t)}},{"bn.js":97}],90:[function(t,e,r){"use strict";var n=t("./lib/rationalize");e.exports=function(t,e){return n(t[0].mul(e[0]),t[1].mul(e[1]))}},{"./lib/rationalize":88}],91:[function(t,e,r){"use strict";var n=t("./lib/bn-sign");e.exports=function(t){return n(t[0])*n(t[1])}},{"./lib/bn-sign":83}],92:[function(t,e,r){"use strict";var n=t("./lib/rationalize");e.exports=function(t,e){return n(t[0].mul(e[1]).sub(t[1].mul(e[0])),t[1].mul(e[1]))}},{"./lib/rationalize":88}],93:[function(t,e,r){"use strict";var n=t("./lib/bn-to-num"),a=t("./lib/ctz");e.exports=function(t){var e=t[0],r=t[1];if(0===e.cmpn(0))return 0;var i=e.abs().divmod(r.abs()),o=i.div,s=n(o),l=i.mod,c=e.negative!==r.negative?-1:1;if(0===l.cmpn(0))return c*s;if(s){var u=a(s)+4,h=n(l.ushln(u).divRound(r));return c*(s+h*Math.pow(2,-u))}var f=r.bitLength()-l.bitLength()+53;h=n(l.ushln(f).divRound(r));return f<1023?c*h*Math.pow(2,-f):(h*=Math.pow(2,-1023),c*h*Math.pow(2,1023-f))}},{"./lib/bn-to-num":84,"./lib/ctz":85}],94:[function(t,e,r){"use strict";function n(t,e,r,n,a){var i=["function ",t,"(a,l,h,",n.join(","),"){",a?"":"var i=",r?"l-1":"h+1",";while(l<=h){var m=(l+h)>>>1,x=a[m]"];return a?e.indexOf("c")<0?i.push(";if(x===y){return m}else if(x<=y){"):i.push(";var p=c(x,y);if(p===0){return m}else if(p<=0){"):i.push(";if(",e,"){i=m;"),r?i.push("l=m+1}else{h=m-1}"):i.push("h=m-1}else{l=m+1}"),i.push("}"),a?i.push("return -1};"):i.push("return i};"),i.join("")}function a(t,e,r,a){return new Function([n("A","x"+t+"y",e,["y"],a),n("P","c(x,y)"+t+"0",e,["y","c"],a),"function dispatchBsearch",r,"(a,y,c,l,h){if(typeof(c)==='function'){return P(a,(l===void 0)?0:l|0,(h===void 0)?a.length-1:h|0,y,c)}else{return A(a,(c===void 0)?0:c|0,(l===void 0)?a.length-1:l|0,y)}}return dispatchBsearch",r].join(""))()}e.exports={ge:a(">=",!1,"GE"),gt:a(">",!1,"GT"),lt:a("<",!0,"LT"),le:a("<=",!0,"LE"),eq:a("-",!0,"EQ",!0)}},{}],95:[function(t,e,r){"use strict";function n(t){var e=32;return(t&=-t)&&e--,65535&t&&(e-=16),16711935&t&&(e-=8),252645135&t&&(e-=4),858993459&t&&(e-=2),1431655765&t&&(e-=1),e}r.INT_BITS=32,r.INT_MAX=2147483647,r.INT_MIN=-1<<31,r.sign=function(t){return(t>0)-(t<0)},r.abs=function(t){var e=t>>31;return(t^e)-e},r.min=function(t,e){return e^(t^e)&-(t<e)},r.max=function(t,e){return t^(t^e)&-(t<e)},r.isPow2=function(t){return!(t&t-1||!t)},r.log2=function(t){var e,r;return e=(t>65535)<<4,e|=r=((t>>>=e)>255)<<3,e|=r=((t>>>=r)>15)<<2,(e|=r=((t>>>=r)>3)<<1)|(t>>>=r)>>1},r.log10=function(t){return t>=1e9?9:t>=1e8?8:t>=1e7?7:t>=1e6?6:t>=1e5?5:t>=1e4?4:t>=1e3?3:t>=100?2:t>=10?1:0},r.popCount=function(t){return 16843009*((t=(858993459&(t-=t>>>1&1431655765))+(t>>>2&858993459))+(t>>>4)&252645135)>>>24},r.countTrailingZeros=n,r.nextPow2=function(t){return t+=0===t,--t,t|=t>>>1,t|=t>>>2,t|=t>>>4,t|=t>>>8,(t|=t>>>16)+1},r.prevPow2=function(t){return t|=t>>>1,t|=t>>>2,t|=t>>>4,t|=t>>>8,(t|=t>>>16)-(t>>>1)},r.parity=function(t){return t^=t>>>16,t^=t>>>8,t^=t>>>4,27030>>>(t&=15)&1};var a=new Array(256);!function(t){for(var e=0;e<256;++e){var r=e,n=e,a=7;for(r>>>=1;r;r>>>=1)n<<=1,n|=1&r,--a;t[e]=n<<a&255}}(a),r.reverse=function(t){return a[255&t]<<24|a[t>>>8&255]<<16|a[t>>>16&255]<<8|a[t>>>24&255]},r.interleave2=function(t,e){return(t=1431655765&((t=858993459&((t=252645135&((t=16711935&((t&=65535)|t<<8))|t<<4))|t<<2))|t<<1))|(e=1431655765&((e=858993459&((e=252645135&((e=16711935&((e&=65535)|e<<8))|e<<4))|e<<2))|e<<1))<<1},r.deinterleave2=function(t,e){return(t=65535&((t=16711935&((t=252645135&((t=858993459&((t=t>>>e&1431655765)|t>>>1))|t>>>2))|t>>>4))|t>>>16))<<16>>16},r.interleave3=function(t,e,r){return t=1227133513&((t=3272356035&((t=251719695&((t=4278190335&((t&=1023)|t<<16))|t<<8))|t<<4))|t<<2),(t|=(e=1227133513&((e=3272356035&((e=251719695&((e=4278190335&((e&=1023)|e<<16))|e<<8))|e<<4))|e<<2))<<1)|(r=1227133513&((r=3272356035&((r=251719695&((r=4278190335&((r&=1023)|r<<16))|r<<8))|r<<4))|r<<2))<<2},r.deinterleave3=function(t,e){return(t=1023&((t=4278190335&((t=251719695&((t=3272356035&((t=t>>>e&1227133513)|t>>>2))|t>>>4))|t>>>8))|t>>>16))<<22>>22},r.nextCombination=function(t){var e=t|t-1;return e+1|(~e&-~e)-1>>>n(t)+1}},{}],96:[function(t,e,r){"use strict";var n=t("clamp");e.exports=function(t,e){e||(e={});var r,o,s,l,c,u,h,f,p,d,g,m=null==e.cutoff?.25:e.cutoff,v=null==e.radius?8:e.radius,y=e.channel||0;if(ArrayBuffer.isView(t)||Array.isArray(t)){if(!e.width||!e.height)throw Error("For raw data width and height should be provided by options");r=e.width,o=e.height,l=t,u=e.stride?e.stride:Math.floor(t.length/r/o)}else window.HTMLCanvasElement&&t instanceof window.HTMLCanvasElement?(h=(f=t).getContext("2d"),r=f.width,o=f.height,p=h.getImageData(0,0,r,o),l=p.data,u=4):window.CanvasRenderingContext2D&&t instanceof window.CanvasRenderingContext2D?(f=t.canvas,h=t,r=f.width,o=f.height,p=h.getImageData(0,0,r,o),l=p.data,u=4):window.ImageData&&t instanceof window.ImageData&&(p=t,r=t.width,o=t.height,l=p.data,u=4);if(s=Math.max(r,o),window.Uint8ClampedArray&&l instanceof window.Uint8ClampedArray||window.Uint8Array&&l instanceof window.Uint8Array)for(c=l,l=Array(r*o),d=0,g=c.length;d<g;d++)l[d]=c[d*u+y]/255;else if(1!==u)throw Error("Raw data can have only 1 value per pixel");var x=Array(r*o),b=Array(r*o),_=Array(s),w=Array(s),T=Array(s+1),k=Array(s);for(d=0,g=r*o;d<g;d++){var A=l[d];x[d]=1===A?0:0===A?a:Math.pow(Math.max(0,.5-A),2),b[d]=1===A?a:0===A?0:Math.pow(Math.max(0,A-.5),2)}i(x,r,o,_,w,k,T),i(b,r,o,_,w,k,T);var M=window.Float32Array?new Float32Array(r*o):new Array(r*o);for(d=0,g=r*o;d<g;d++)M[d]=n(1-((x[d]-b[d])/v+m),0,1);return M};var a=1e20;function i(t,e,r,n,a,i,s){for(var l=0;l<e;l++){for(var c=0;c<r;c++)n[c]=t[c*e+l];for(o(n,a,i,s,r),c=0;c<r;c++)t[c*e+l]=a[c]}for(c=0;c<r;c++){for(l=0;l<e;l++)n[l]=t[c*e+l];for(o(n,a,i,s,e),l=0;l<e;l++)t[c*e+l]=Math.sqrt(a[l])}}function o(t,e,r,n,i){r[0]=0,n[0]=-a,n[1]=+a;for(var o=1,s=0;o<i;o++){for(var l=(t[o]+o*o-(t[r[s]]+r[s]*r[s]))/(2*o-2*r[s]);l<=n[s];)s--,l=(t[o]+o*o-(t[r[s]]+r[s]*r[s]))/(2*o-2*r[s]);r[++s]=o,n[s]=l,n[s+1]=+a}for(o=0,s=0;o<i;o++){for(;n[s+1]<o;)s++;e[o]=(o-r[s])*(o-r[s])+t[r[s]]}}},{clamp:117}],97:[function(t,e,r){!function(e,r){"use strict";function n(t,e){if(!t)throw new Error(e||"Assertion failed")}function a(t,e){t.super_=e;var r=function(){};r.prototype=e.prototype,t.prototype=new r,t.prototype.constructor=t}function i(t,e,r){if(i.isBN(t))return t;this.negative=0,this.words=null,this.length=0,this.red=null,null!==t&&("le"!==e&&"be"!==e||(r=e,e=10),this._init(t||0,e||10,r||"be"))}var o;"object"==typeof e?e.exports=i:r.BN=i,i.BN=i,i.wordSize=26;try{o=t("buffer").Buffer}catch(t){}function s(t,e,r){for(var n=0,a=Math.min(t.length,r),i=e;i<a;i++){var o=t.charCodeAt(i)-48;n<<=4,n|=o>=49&&o<=54?o-49+10:o>=17&&o<=22?o-17+10:15&o}return n}function l(t,e,r,n){for(var a=0,i=Math.min(t.length,r),o=e;o<i;o++){var s=t.charCodeAt(o)-48;a*=n,a+=s>=49?s-49+10:s>=17?s-17+10:s}return a}i.isBN=function(t){return t instanceof i||null!==t&&"object"==typeof t&&t.constructor.wordSize===i.wordSize&&Array.isArray(t.words)},i.max=function(t,e){return t.cmp(e)>0?t:e},i.min=function(t,e){return t.cmp(e)<0?t:e},i.prototype._init=function(t,e,r){if("number"==typeof t)return this._initNumber(t,e,r);if("object"==typeof t)return this._initArray(t,e,r);"hex"===e&&(e=16),n(e===(0|e)&&e>=2&&e<=36);var a=0;"-"===(t=t.toString().replace(/\s+/g,""))[0]&&a++,16===e?this._parseHex(t,a):this._parseBase(t,e,a),"-"===t[0]&&(this.negative=1),this.strip(),"le"===r&&this._initArray(this.toArray(),e,r)},i.prototype._initNumber=function(t,e,r){t<0&&(this.negative=1,t=-t),t<67108864?(this.words=[67108863&t],this.length=1):t<4503599627370496?(this.words=[67108863&t,t/67108864&67108863],this.length=2):(n(t<9007199254740992),this.words=[67108863&t,t/67108864&67108863,1],this.length=3),"le"===r&&this._initArray(this.toArray(),e,r)},i.prototype._initArray=function(t,e,r){if(n("number"==typeof t.length),t.length<=0)return this.words=[0],this.length=1,this;this.length=Math.ceil(t.length/3),this.words=new Array(this.length);for(var a=0;a<this.length;a++)this.words[a]=0;var i,o,s=0;if("be"===r)for(a=t.length-1,i=0;a>=0;a-=3)o=t[a]|t[a-1]<<8|t[a-2]<<16,this.words[i]|=o<<s&67108863,this.words[i+1]=o>>>26-s&67108863,(s+=24)>=26&&(s-=26,i++);else if("le"===r)for(a=0,i=0;a<t.length;a+=3)o=t[a]|t[a+1]<<8|t[a+2]<<16,this.words[i]|=o<<s&67108863,this.words[i+1]=o>>>26-s&67108863,(s+=24)>=26&&(s-=26,i++);return this.strip()},i.prototype._parseHex=function(t,e){this.length=Math.ceil((t.length-e)/6),this.words=new Array(this.length);for(var r=0;r<this.length;r++)this.words[r]=0;var n,a,i=0;for(r=t.length-6,n=0;r>=e;r-=6)a=s(t,r,r+6),this.words[n]|=a<<i&67108863,this.words[n+1]|=a>>>26-i&4194303,(i+=24)>=26&&(i-=26,n++);r+6!==e&&(a=s(t,e,r+6),this.words[n]|=a<<i&67108863,this.words[n+1]|=a>>>26-i&4194303),this.strip()},i.prototype._parseBase=function(t,e,r){this.words=[0],this.length=1;for(var n=0,a=1;a<=67108863;a*=e)n++;n--,a=a/e|0;for(var i=t.length-r,o=i%n,s=Math.min(i,i-o)+r,c=0,u=r;u<s;u+=n)c=l(t,u,u+n,e),this.imuln(a),this.words[0]+c<67108864?this.words[0]+=c:this._iaddn(c);if(0!==o){var h=1;for(c=l(t,u,t.length,e),u=0;u<o;u++)h*=e;this.imuln(h),this.words[0]+c<67108864?this.words[0]+=c:this._iaddn(c)}},i.prototype.copy=function(t){t.words=new Array(this.length);for(var e=0;e<this.length;e++)t.words[e]=this.words[e];t.length=this.length,t.negative=this.negative,t.red=this.red},i.prototype.clone=function(){var t=new i(null);return this.copy(t),t},i.prototype._expand=function(t){for(;this.length<t;)this.words[this.length++]=0;return this},i.prototype.strip=function(){for(;this.length>1&&0===this.words[this.length-1];)this.length--;return this._normSign()},i.prototype._normSign=function(){return 1===this.length&&0===this.words[0]&&(this.negative=0),this},i.prototype.inspect=function(){return(this.red?"<BN-R: ":"<BN: ")+this.toString(16)+">"};var c=["","0","00","000","0000","00000","000000","0000000","00000000","000000000","0000000000","00000000000","000000000000","0000000000000","00000000000000","000000000000000","0000000000000000","00000000000000000","000000000000000000","0000000000000000000","00000000000000000000","000000000000000000000","0000000000000000000000","00000000000000000000000","000000000000000000000000","0000000000000000000000000"],u=[0,0,25,16,12,11,10,9,8,8,7,7,7,7,6,6,6,6,6,6,6,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],h=[0,0,33554432,43046721,16777216,48828125,60466176,40353607,16777216,43046721,1e7,19487171,35831808,62748517,7529536,11390625,16777216,24137569,34012224,47045881,64e6,4084101,5153632,6436343,7962624,9765625,11881376,14348907,17210368,20511149,243e5,28629151,33554432,39135393,45435424,52521875,60466176];function f(t,e,r){r.negative=e.negative^t.negative;var n=t.length+e.length|0;r.length=n,n=n-1|0;var a=0|t.words[0],i=0|e.words[0],o=a*i,s=67108863&o,l=o/67108864|0;r.words[0]=s;for(var c=1;c<n;c++){for(var u=l>>>26,h=67108863&l,f=Math.min(c,e.length-1),p=Math.max(0,c-t.length+1);p<=f;p++){var d=c-p|0;u+=(o=(a=0|t.words[d])*(i=0|e.words[p])+h)/67108864|0,h=67108863&o}r.words[c]=0|h,l=0|u}return 0!==l?r.words[c]=0|l:r.length--,r.strip()}i.prototype.toString=function(t,e){var r;if(e=0|e||1,16===(t=t||10)||"hex"===t){r="";for(var a=0,i=0,o=0;o<this.length;o++){var s=this.words[o],l=(16777215&(s<<a|i)).toString(16);r=0!==(i=s>>>24-a&16777215)||o!==this.length-1?c[6-l.length]+l+r:l+r,(a+=2)>=26&&(a-=26,o--)}for(0!==i&&(r=i.toString(16)+r);r.length%e!=0;)r="0"+r;return 0!==this.negative&&(r="-"+r),r}if(t===(0|t)&&t>=2&&t<=36){var f=u[t],p=h[t];r="";var d=this.clone();for(d.negative=0;!d.isZero();){var g=d.modn(p).toString(t);r=(d=d.idivn(p)).isZero()?g+r:c[f-g.length]+g+r}for(this.isZero()&&(r="0"+r);r.length%e!=0;)r="0"+r;return 0!==this.negative&&(r="-"+r),r}n(!1,"Base should be between 2 and 36")},i.prototype.toNumber=function(){var t=this.words[0];return 2===this.length?t+=67108864*this.words[1]:3===this.length&&1===this.words[2]?t+=4503599627370496+67108864*this.words[1]:this.length>2&&n(!1,"Number can only safely store up to 53 bits"),0!==this.negative?-t:t},i.prototype.toJSON=function(){return this.toString(16)},i.prototype.toBuffer=function(t,e){return n("undefined"!=typeof o),this.toArrayLike(o,t,e)},i.prototype.toArray=function(t,e){return this.toArrayLike(Array,t,e)},i.prototype.toArrayLike=function(t,e,r){var a=this.byteLength(),i=r||Math.max(1,a);n(a<=i,"byte array longer than desired length"),n(i>0,"Requested array length <= 0"),this.strip();var o,s,l="le"===e,c=new t(i),u=this.clone();if(l){for(s=0;!u.isZero();s++)o=u.andln(255),u.iushrn(8),c[s]=o;for(;s<i;s++)c[s]=0}else{for(s=0;s<i-a;s++)c[s]=0;for(s=0;!u.isZero();s++)o=u.andln(255),u.iushrn(8),c[i-s-1]=o}return c},Math.clz32?i.prototype._countBits=function(t){return 32-Math.clz32(t)}:i.prototype._countBits=function(t){var e=t,r=0;return e>=4096&&(r+=13,e>>>=13),e>=64&&(r+=7,e>>>=7),e>=8&&(r+=4,e>>>=4),e>=2&&(r+=2,e>>>=2),r+e},i.prototype._zeroBits=function(t){if(0===t)return 26;var e=t,r=0;return 0==(8191&e)&&(r+=13,e>>>=13),0==(127&e)&&(r+=7,e>>>=7),0==(15&e)&&(r+=4,e>>>=4),0==(3&e)&&(r+=2,e>>>=2),0==(1&e)&&r++,r},i.prototype.bitLength=function(){var t=this.words[this.length-1],e=this._countBits(t);return 26*(this.length-1)+e},i.prototype.zeroBits=function(){if(this.isZero())return 0;for(var t=0,e=0;e<this.length;e++){var r=this._zeroBits(this.words[e]);if(t+=r,26!==r)break}return t},i.prototype.byteLength=function(){return Math.ceil(this.bitLength()/8)},i.prototype.toTwos=function(t){return 0!==this.negative?this.abs().inotn(t).iaddn(1):this.clone()},i.prototype.fromTwos=function(t){return this.testn(t-1)?this.notn(t).iaddn(1).ineg():this.clone()},i.prototype.isNeg=function(){return 0!==this.negative},i.prototype.neg=function(){return this.clone().ineg()},i.prototype.ineg=function(){return this.isZero()||(this.negative^=1),this},i.prototype.iuor=function(t){for(;this.length<t.length;)this.words[this.length++]=0;for(var e=0;e<t.length;e++)this.words[e]=this.words[e]|t.words[e];return this.strip()},i.prototype.ior=function(t){return n(0==(this.negative|t.negative)),this.iuor(t)},i.prototype.or=function(t){return this.length>t.length?this.clone().ior(t):t.clone().ior(this)},i.prototype.uor=function(t){return this.length>t.length?this.clone().iuor(t):t.clone().iuor(this)},i.prototype.iuand=function(t){var e;e=this.length>t.length?t:this;for(var r=0;r<e.length;r++)this.words[r]=this.words[r]&t.words[r];return this.length=e.length,this.strip()},i.prototype.iand=function(t){return n(0==(this.negative|t.negative)),this.iuand(t)},i.prototype.and=function(t){return this.length>t.length?this.clone().iand(t):t.clone().iand(this)},i.prototype.uand=function(t){return this.length>t.length?this.clone().iuand(t):t.clone().iuand(this)},i.prototype.iuxor=function(t){var e,r;this.length>t.length?(e=this,r=t):(e=t,r=this);for(var n=0;n<r.length;n++)this.words[n]=e.words[n]^r.words[n];if(this!==e)for(;n<e.length;n++)this.words[n]=e.words[n];return this.length=e.length,this.strip()},i.prototype.ixor=function(t){return n(0==(this.negative|t.negative)),this.iuxor(t)},i.prototype.xor=function(t){return this.length>t.length?this.clone().ixor(t):t.clone().ixor(this)},i.prototype.uxor=function(t){return this.length>t.length?this.clone().iuxor(t):t.clone().iuxor(this)},i.prototype.inotn=function(t){n("number"==typeof t&&t>=0);var e=0|Math.ceil(t/26),r=t%26;this._expand(e),r>0&&e--;for(var a=0;a<e;a++)this.words[a]=67108863&~this.words[a];return r>0&&(this.words[a]=~this.words[a]&67108863>>26-r),this.strip()},i.prototype.notn=function(t){return this.clone().inotn(t)},i.prototype.setn=function(t,e){n("number"==typeof t&&t>=0);var r=t/26|0,a=t%26;return this._expand(r+1),this.words[r]=e?this.words[r]|1<<a:this.words[r]&~(1<<a),this.strip()},i.prototype.iadd=function(t){var e,r,n;if(0!==this.negative&&0===t.negative)return this.negative=0,e=this.isub(t),this.negative^=1,this._normSign();if(0===this.negative&&0!==t.negative)return t.negative=0,e=this.isub(t),t.negative=1,e._normSign();this.length>t.length?(r=this,n=t):(r=t,n=this);for(var a=0,i=0;i<n.length;i++)e=(0|r.words[i])+(0|n.words[i])+a,this.words[i]=67108863&e,a=e>>>26;for(;0!==a&&i<r.length;i++)e=(0|r.words[i])+a,this.words[i]=67108863&e,a=e>>>26;if(this.length=r.length,0!==a)this.words[this.length]=a,this.length++;else if(r!==this)for(;i<r.length;i++)this.words[i]=r.words[i];return this},i.prototype.add=function(t){var e;return 0!==t.negative&&0===this.negative?(t.negative=0,e=this.sub(t),t.negative^=1,e):0===t.negative&&0!==this.negative?(this.negative=0,e=t.sub(this),this.negative=1,e):this.length>t.length?this.clone().iadd(t):t.clone().iadd(this)},i.prototype.isub=function(t){if(0!==t.negative){t.negative=0;var e=this.iadd(t);return t.negative=1,e._normSign()}if(0!==this.negative)return this.negative=0,this.iadd(t),this.negative=1,this._normSign();var r,n,a=this.cmp(t);if(0===a)return this.negative=0,this.length=1,this.words[0]=0,this;a>0?(r=this,n=t):(r=t,n=this);for(var i=0,o=0;o<n.length;o++)i=(e=(0|r.words[o])-(0|n.words[o])+i)>>26,this.words[o]=67108863&e;for(;0!==i&&o<r.length;o++)i=(e=(0|r.words[o])+i)>>26,this.words[o]=67108863&e;if(0===i&&o<r.length&&r!==this)for(;o<r.length;o++)this.words[o]=r.words[o];return this.length=Math.max(this.length,o),r!==this&&(this.negative=1),this.strip()},i.prototype.sub=function(t){return this.clone().isub(t)};var p=function(t,e,r){var n,a,i,o=t.words,s=e.words,l=r.words,c=0,u=0|o[0],h=8191&u,f=u>>>13,p=0|o[1],d=8191&p,g=p>>>13,m=0|o[2],v=8191&m,y=m>>>13,x=0|o[3],b=8191&x,_=x>>>13,w=0|o[4],T=8191&w,k=w>>>13,A=0|o[5],M=8191&A,S=A>>>13,E=0|o[6],C=8191&E,L=E>>>13,P=0|o[7],I=8191&P,z=P>>>13,O=0|o[8],D=8191&O,R=O>>>13,F=0|o[9],B=8191&F,N=F>>>13,j=0|s[0],V=8191&j,U=j>>>13,q=0|s[1],H=8191&q,G=q>>>13,Y=0|s[2],W=8191&Y,Z=Y>>>13,X=0|s[3],J=8191&X,K=X>>>13,Q=0|s[4],$=8191&Q,tt=Q>>>13,et=0|s[5],rt=8191&et,nt=et>>>13,at=0|s[6],it=8191&at,ot=at>>>13,st=0|s[7],lt=8191&st,ct=st>>>13,ut=0|s[8],ht=8191&ut,ft=ut>>>13,pt=0|s[9],dt=8191&pt,gt=pt>>>13;r.negative=t.negative^e.negative,r.length=19;var mt=(c+(n=Math.imul(h,V))|0)+((8191&(a=(a=Math.imul(h,U))+Math.imul(f,V)|0))<<13)|0;c=((i=Math.imul(f,U))+(a>>>13)|0)+(mt>>>26)|0,mt&=67108863,n=Math.imul(d,V),a=(a=Math.imul(d,U))+Math.imul(g,V)|0,i=Math.imul(g,U);var vt=(c+(n=n+Math.imul(h,H)|0)|0)+((8191&(a=(a=a+Math.imul(h,G)|0)+Math.imul(f,H)|0))<<13)|0;c=((i=i+Math.imul(f,G)|0)+(a>>>13)|0)+(vt>>>26)|0,vt&=67108863,n=Math.imul(v,V),a=(a=Math.imul(v,U))+Math.imul(y,V)|0,i=Math.imul(y,U),n=n+Math.imul(d,H)|0,a=(a=a+Math.imul(d,G)|0)+Math.imul(g,H)|0,i=i+Math.imul(g,G)|0;var yt=(c+(n=n+Math.imul(h,W)|0)|0)+((8191&(a=(a=a+Math.imul(h,Z)|0)+Math.imul(f,W)|0))<<13)|0;c=((i=i+Math.imul(f,Z)|0)+(a>>>13)|0)+(yt>>>26)|0,yt&=67108863,n=Math.imul(b,V),a=(a=Math.imul(b,U))+Math.imul(_,V)|0,i=Math.imul(_,U),n=n+Math.imul(v,H)|0,a=(a=a+Math.imul(v,G)|0)+Math.imul(y,H)|0,i=i+Math.imul(y,G)|0,n=n+Math.imul(d,W)|0,a=(a=a+Math.imul(d,Z)|0)+Math.imul(g,W)|0,i=i+Math.imul(g,Z)|0;var xt=(c+(n=n+Math.imul(h,J)|0)|0)+((8191&(a=(a=a+Math.imul(h,K)|0)+Math.imul(f,J)|0))<<13)|0;c=((i=i+Math.imul(f,K)|0)+(a>>>13)|0)+(xt>>>26)|0,xt&=67108863,n=Math.imul(T,V),a=(a=Math.imul(T,U))+Math.imul(k,V)|0,i=Math.imul(k,U),n=n+Math.imul(b,H)|0,a=(a=a+Math.imul(b,G)|0)+Math.imul(_,H)|0,i=i+Math.imul(_,G)|0,n=n+Math.imul(v,W)|0,a=(a=a+Math.imul(v,Z)|0)+Math.imul(y,W)|0,i=i+Math.imul(y,Z)|0,n=n+Math.imul(d,J)|0,a=(a=a+Math.imul(d,K)|0)+Math.imul(g,J)|0,i=i+Math.imul(g,K)|0;var bt=(c+(n=n+Math.imul(h,$)|0)|0)+((8191&(a=(a=a+Math.imul(h,tt)|0)+Math.imul(f,$)|0))<<13)|0;c=((i=i+Math.imul(f,tt)|0)+(a>>>13)|0)+(bt>>>26)|0,bt&=67108863,n=Math.imul(M,V),a=(a=Math.imul(M,U))+Math.imul(S,V)|0,i=Math.imul(S,U),n=n+Math.imul(T,H)|0,a=(a=a+Math.imul(T,G)|0)+Math.imul(k,H)|0,i=i+Math.imul(k,G)|0,n=n+Math.imul(b,W)|0,a=(a=a+Math.imul(b,Z)|0)+Math.imul(_,W)|0,i=i+Math.imul(_,Z)|0,n=n+Math.imul(v,J)|0,a=(a=a+Math.imul(v,K)|0)+Math.imul(y,J)|0,i=i+Math.imul(y,K)|0,n=n+Math.imul(d,$)|0,a=(a=a+Math.imul(d,tt)|0)+Math.imul(g,$)|0,i=i+Math.imul(g,tt)|0;var _t=(c+(n=n+Math.imul(h,rt)|0)|0)+((8191&(a=(a=a+Math.imul(h,nt)|0)+Math.imul(f,rt)|0))<<13)|0;c=((i=i+Math.imul(f,nt)|0)+(a>>>13)|0)+(_t>>>26)|0,_t&=67108863,n=Math.imul(C,V),a=(a=Math.imul(C,U))+Math.imul(L,V)|0,i=Math.imul(L,U),n=n+Math.imul(M,H)|0,a=(a=a+Math.imul(M,G)|0)+Math.imul(S,H)|0,i=i+Math.imul(S,G)|0,n=n+Math.imul(T,W)|0,a=(a=a+Math.imul(T,Z)|0)+Math.imul(k,W)|0,i=i+Math.imul(k,Z)|0,n=n+Math.imul(b,J)|0,a=(a=a+Math.imul(b,K)|0)+Math.imul(_,J)|0,i=i+Math.imul(_,K)|0,n=n+Math.imul(v,$)|0,a=(a=a+Math.imul(v,tt)|0)+Math.imul(y,$)|0,i=i+Math.imul(y,tt)|0,n=n+Math.imul(d,rt)|0,a=(a=a+Math.imul(d,nt)|0)+Math.imul(g,rt)|0,i=i+Math.imul(g,nt)|0;var wt=(c+(n=n+Math.imul(h,it)|0)|0)+((8191&(a=(a=a+Math.imul(h,ot)|0)+Math.imul(f,it)|0))<<13)|0;c=((i=i+Math.imul(f,ot)|0)+(a>>>13)|0)+(wt>>>26)|0,wt&=67108863,n=Math.imul(I,V),a=(a=Math.imul(I,U))+Math.imul(z,V)|0,i=Math.imul(z,U),n=n+Math.imul(C,H)|0,a=(a=a+Math.imul(C,G)|0)+Math.imul(L,H)|0,i=i+Math.imul(L,G)|0,n=n+Math.imul(M,W)|0,a=(a=a+Math.imul(M,Z)|0)+Math.imul(S,W)|0,i=i+Math.imul(S,Z)|0,n=n+Math.imul(T,J)|0,a=(a=a+Math.imul(T,K)|0)+Math.imul(k,J)|0,i=i+Math.imul(k,K)|0,n=n+Math.imul(b,$)|0,a=(a=a+Math.imul(b,tt)|0)+Math.imul(_,$)|0,i=i+Math.imul(_,tt)|0,n=n+Math.imul(v,rt)|0,a=(a=a+Math.imul(v,nt)|0)+Math.imul(y,rt)|0,i=i+Math.imul(y,nt)|0,n=n+Math.imul(d,it)|0,a=(a=a+Math.imul(d,ot)|0)+Math.imul(g,it)|0,i=i+Math.imul(g,ot)|0;var Tt=(c+(n=n+Math.imul(h,lt)|0)|0)+((8191&(a=(a=a+Math.imul(h,ct)|0)+Math.imul(f,lt)|0))<<13)|0;c=((i=i+Math.imul(f,ct)|0)+(a>>>13)|0)+(Tt>>>26)|0,Tt&=67108863,n=Math.imul(D,V),a=(a=Math.imul(D,U))+Math.imul(R,V)|0,i=Math.imul(R,U),n=n+Math.imul(I,H)|0,a=(a=a+Math.imul(I,G)|0)+Math.imul(z,H)|0,i=i+Math.imul(z,G)|0,n=n+Math.imul(C,W)|0,a=(a=a+Math.imul(C,Z)|0)+Math.imul(L,W)|0,i=i+Math.imul(L,Z)|0,n=n+Math.imul(M,J)|0,a=(a=a+Math.imul(M,K)|0)+Math.imul(S,J)|0,i=i+Math.imul(S,K)|0,n=n+Math.imul(T,$)|0,a=(a=a+Math.imul(T,tt)|0)+Math.imul(k,$)|0,i=i+Math.imul(k,tt)|0,n=n+Math.imul(b,rt)|0,a=(a=a+Math.imul(b,nt)|0)+Math.imul(_,rt)|0,i=i+Math.imul(_,nt)|0,n=n+Math.imul(v,it)|0,a=(a=a+Math.imul(v,ot)|0)+Math.imul(y,it)|0,i=i+Math.imul(y,ot)|0,n=n+Math.imul(d,lt)|0,a=(a=a+Math.imul(d,ct)|0)+Math.imul(g,lt)|0,i=i+Math.imul(g,ct)|0;var kt=(c+(n=n+Math.imul(h,ht)|0)|0)+((8191&(a=(a=a+Math.imul(h,ft)|0)+Math.imul(f,ht)|0))<<13)|0;c=((i=i+Math.imul(f,ft)|0)+(a>>>13)|0)+(kt>>>26)|0,kt&=67108863,n=Math.imul(B,V),a=(a=Math.imul(B,U))+Math.imul(N,V)|0,i=Math.imul(N,U),n=n+Math.imul(D,H)|0,a=(a=a+Math.imul(D,G)|0)+Math.imul(R,H)|0,i=i+Math.imul(R,G)|0,n=n+Math.imul(I,W)|0,a=(a=a+Math.imul(I,Z)|0)+Math.imul(z,W)|0,i=i+Math.imul(z,Z)|0,n=n+Math.imul(C,J)|0,a=(a=a+Math.imul(C,K)|0)+Math.imul(L,J)|0,i=i+Math.imul(L,K)|0,n=n+Math.imul(M,$)|0,a=(a=a+Math.imul(M,tt)|0)+Math.imul(S,$)|0,i=i+Math.imul(S,tt)|0,n=n+Math.imul(T,rt)|0,a=(a=a+Math.imul(T,nt)|0)+Math.imul(k,rt)|0,i=i+Math.imul(k,nt)|0,n=n+Math.imul(b,it)|0,a=(a=a+Math.imul(b,ot)|0)+Math.imul(_,it)|0,i=i+Math.imul(_,ot)|0,n=n+Math.imul(v,lt)|0,a=(a=a+Math.imul(v,ct)|0)+Math.imul(y,lt)|0,i=i+Math.imul(y,ct)|0,n=n+Math.imul(d,ht)|0,a=(a=a+Math.imul(d,ft)|0)+Math.imul(g,ht)|0,i=i+Math.imul(g,ft)|0;var At=(c+(n=n+Math.imul(h,dt)|0)|0)+((8191&(a=(a=a+Math.imul(h,gt)|0)+Math.imul(f,dt)|0))<<13)|0;c=((i=i+Math.imul(f,gt)|0)+(a>>>13)|0)+(At>>>26)|0,At&=67108863,n=Math.imul(B,H),a=(a=Math.imul(B,G))+Math.imul(N,H)|0,i=Math.imul(N,G),n=n+Math.imul(D,W)|0,a=(a=a+Math.imul(D,Z)|0)+Math.imul(R,W)|0,i=i+Math.imul(R,Z)|0,n=n+Math.imul(I,J)|0,a=(a=a+Math.imul(I,K)|0)+Math.imul(z,J)|0,i=i+Math.imul(z,K)|0,n=n+Math.imul(C,$)|0,a=(a=a+Math.imul(C,tt)|0)+Math.imul(L,$)|0,i=i+Math.imul(L,tt)|0,n=n+Math.imul(M,rt)|0,a=(a=a+Math.imul(M,nt)|0)+Math.imul(S,rt)|0,i=i+Math.imul(S,nt)|0,n=n+Math.imul(T,it)|0,a=(a=a+Math.imul(T,ot)|0)+Math.imul(k,it)|0,i=i+Math.imul(k,ot)|0,n=n+Math.imul(b,lt)|0,a=(a=a+Math.imul(b,ct)|0)+Math.imul(_,lt)|0,i=i+Math.imul(_,ct)|0,n=n+Math.imul(v,ht)|0,a=(a=a+Math.imul(v,ft)|0)+Math.imul(y,ht)|0,i=i+Math.imul(y,ft)|0;var Mt=(c+(n=n+Math.imul(d,dt)|0)|0)+((8191&(a=(a=a+Math.imul(d,gt)|0)+Math.imul(g,dt)|0))<<13)|0;c=((i=i+Math.imul(g,gt)|0)+(a>>>13)|0)+(Mt>>>26)|0,Mt&=67108863,n=Math.imul(B,W),a=(a=Math.imul(B,Z))+Math.imul(N,W)|0,i=Math.imul(N,Z),n=n+Math.imul(D,J)|0,a=(a=a+Math.imul(D,K)|0)+Math.imul(R,J)|0,i=i+Math.imul(R,K)|0,n=n+Math.imul(I,$)|0,a=(a=a+Math.imul(I,tt)|0)+Math.imul(z,$)|0,i=i+Math.imul(z,tt)|0,n=n+Math.imul(C,rt)|0,a=(a=a+Math.imul(C,nt)|0)+Math.imul(L,rt)|0,i=i+Math.imul(L,nt)|0,n=n+Math.imul(M,it)|0,a=(a=a+Math.imul(M,ot)|0)+Math.imul(S,it)|0,i=i+Math.imul(S,ot)|0,n=n+Math.imul(T,lt)|0,a=(a=a+Math.imul(T,ct)|0)+Math.imul(k,lt)|0,i=i+Math.imul(k,ct)|0,n=n+Math.imul(b,ht)|0,a=(a=a+Math.imul(b,ft)|0)+Math.imul(_,ht)|0,i=i+Math.imul(_,ft)|0;var St=(c+(n=n+Math.imul(v,dt)|0)|0)+((8191&(a=(a=a+Math.imul(v,gt)|0)+Math.imul(y,dt)|0))<<13)|0;c=((i=i+Math.imul(y,gt)|0)+(a>>>13)|0)+(St>>>26)|0,St&=67108863,n=Math.imul(B,J),a=(a=Math.imul(B,K))+Math.imul(N,J)|0,i=Math.imul(N,K),n=n+Math.imul(D,$)|0,a=(a=a+Math.imul(D,tt)|0)+Math.imul(R,$)|0,i=i+Math.imul(R,tt)|0,n=n+Math.imul(I,rt)|0,a=(a=a+Math.imul(I,nt)|0)+Math.imul(z,rt)|0,i=i+Math.imul(z,nt)|0,n=n+Math.imul(C,it)|0,a=(a=a+Math.imul(C,ot)|0)+Math.imul(L,it)|0,i=i+Math.imul(L,ot)|0,n=n+Math.imul(M,lt)|0,a=(a=a+Math.imul(M,ct)|0)+Math.imul(S,lt)|0,i=i+Math.imul(S,ct)|0,n=n+Math.imul(T,ht)|0,a=(a=a+Math.imul(T,ft)|0)+Math.imul(k,ht)|0,i=i+Math.imul(k,ft)|0;var Et=(c+(n=n+Math.imul(b,dt)|0)|0)+((8191&(a=(a=a+Math.imul(b,gt)|0)+Math.imul(_,dt)|0))<<13)|0;c=((i=i+Math.imul(_,gt)|0)+(a>>>13)|0)+(Et>>>26)|0,Et&=67108863,n=Math.imul(B,$),a=(a=Math.imul(B,tt))+Math.imul(N,$)|0,i=Math.imul(N,tt),n=n+Math.imul(D,rt)|0,a=(a=a+Math.imul(D,nt)|0)+Math.imul(R,rt)|0,i=i+Math.imul(R,nt)|0,n=n+Math.imul(I,it)|0,a=(a=a+Math.imul(I,ot)|0)+Math.imul(z,it)|0,i=i+Math.imul(z,ot)|0,n=n+Math.imul(C,lt)|0,a=(a=a+Math.imul(C,ct)|0)+Math.imul(L,lt)|0,i=i+Math.imul(L,ct)|0,n=n+Math.imul(M,ht)|0,a=(a=a+Math.imul(M,ft)|0)+Math.imul(S,ht)|0,i=i+Math.imul(S,ft)|0;var Ct=(c+(n=n+Math.imul(T,dt)|0)|0)+((8191&(a=(a=a+Math.imul(T,gt)|0)+Math.imul(k,dt)|0))<<13)|0;c=((i=i+Math.imul(k,gt)|0)+(a>>>13)|0)+(Ct>>>26)|0,Ct&=67108863,n=Math.imul(B,rt),a=(a=Math.imul(B,nt))+Math.imul(N,rt)|0,i=Math.imul(N,nt),n=n+Math.imul(D,it)|0,a=(a=a+Math.imul(D,ot)|0)+Math.imul(R,it)|0,i=i+Math.imul(R,ot)|0,n=n+Math.imul(I,lt)|0,a=(a=a+Math.imul(I,ct)|0)+Math.imul(z,lt)|0,i=i+Math.imul(z,ct)|0,n=n+Math.imul(C,ht)|0,a=(a=a+Math.imul(C,ft)|0)+Math.imul(L,ht)|0,i=i+Math.imul(L,ft)|0;var Lt=(c+(n=n+Math.imul(M,dt)|0)|0)+((8191&(a=(a=a+Math.imul(M,gt)|0)+Math.imul(S,dt)|0))<<13)|0;c=((i=i+Math.imul(S,gt)|0)+(a>>>13)|0)+(Lt>>>26)|0,Lt&=67108863,n=Math.imul(B,it),a=(a=Math.imul(B,ot))+Math.imul(N,it)|0,i=Math.imul(N,ot),n=n+Math.imul(D,lt)|0,a=(a=a+Math.imul(D,ct)|0)+Math.imul(R,lt)|0,i=i+Math.imul(R,ct)|0,n=n+Math.imul(I,ht)|0,a=(a=a+Math.imul(I,ft)|0)+Math.imul(z,ht)|0,i=i+Math.imul(z,ft)|0;var Pt=(c+(n=n+Math.imul(C,dt)|0)|0)+((8191&(a=(a=a+Math.imul(C,gt)|0)+Math.imul(L,dt)|0))<<13)|0;c=((i=i+Math.imul(L,gt)|0)+(a>>>13)|0)+(Pt>>>26)|0,Pt&=67108863,n=Math.imul(B,lt),a=(a=Math.imul(B,ct))+Math.imul(N,lt)|0,i=Math.imul(N,ct),n=n+Math.imul(D,ht)|0,a=(a=a+Math.imul(D,ft)|0)+Math.imul(R,ht)|0,i=i+Math.imul(R,ft)|0;var It=(c+(n=n+Math.imul(I,dt)|0)|0)+((8191&(a=(a=a+Math.imul(I,gt)|0)+Math.imul(z,dt)|0))<<13)|0;c=((i=i+Math.imul(z,gt)|0)+(a>>>13)|0)+(It>>>26)|0,It&=67108863,n=Math.imul(B,ht),a=(a=Math.imul(B,ft))+Math.imul(N,ht)|0,i=Math.imul(N,ft);var zt=(c+(n=n+Math.imul(D,dt)|0)|0)+((8191&(a=(a=a+Math.imul(D,gt)|0)+Math.imul(R,dt)|0))<<13)|0;c=((i=i+Math.imul(R,gt)|0)+(a>>>13)|0)+(zt>>>26)|0,zt&=67108863;var Ot=(c+(n=Math.imul(B,dt))|0)+((8191&(a=(a=Math.imul(B,gt))+Math.imul(N,dt)|0))<<13)|0;return c=((i=Math.imul(N,gt))+(a>>>13)|0)+(Ot>>>26)|0,Ot&=67108863,l[0]=mt,l[1]=vt,l[2]=yt,l[3]=xt,l[4]=bt,l[5]=_t,l[6]=wt,l[7]=Tt,l[8]=kt,l[9]=At,l[10]=Mt,l[11]=St,l[12]=Et,l[13]=Ct,l[14]=Lt,l[15]=Pt,l[16]=It,l[17]=zt,l[18]=Ot,0!==c&&(l[19]=c,r.length++),r};function d(t,e,r){return(new g).mulp(t,e,r)}function g(t,e){this.x=t,this.y=e}Math.imul||(p=f),i.prototype.mulTo=function(t,e){var r=this.length+t.length;return 10===this.length&&10===t.length?p(this,t,e):r<63?f(this,t,e):r<1024?function(t,e,r){r.negative=e.negative^t.negative,r.length=t.length+e.length;for(var n=0,a=0,i=0;i<r.length-1;i++){var o=a;a=0;for(var s=67108863&n,l=Math.min(i,e.length-1),c=Math.max(0,i-t.length+1);c<=l;c++){var u=i-c,h=(0|t.words[u])*(0|e.words[c]),f=67108863&h;s=67108863&(f=f+s|0),a+=(o=(o=o+(h/67108864|0)|0)+(f>>>26)|0)>>>26,o&=67108863}r.words[i]=s,n=o,o=a}return 0!==n?r.words[i]=n:r.length--,r.strip()}(this,t,e):d(this,t,e)},g.prototype.makeRBT=function(t){for(var e=new Array(t),r=i.prototype._countBits(t)-1,n=0;n<t;n++)e[n]=this.revBin(n,r,t);return e},g.prototype.revBin=function(t,e,r){if(0===t||t===r-1)return t;for(var n=0,a=0;a<e;a++)n|=(1&t)<<e-a-1,t>>=1;return n},g.prototype.permute=function(t,e,r,n,a,i){for(var o=0;o<i;o++)n[o]=e[t[o]],a[o]=r[t[o]]},g.prototype.transform=function(t,e,r,n,a,i){this.permute(i,t,e,r,n,a);for(var o=1;o<a;o<<=1)for(var s=o<<1,l=Math.cos(2*Math.PI/s),c=Math.sin(2*Math.PI/s),u=0;u<a;u+=s)for(var h=l,f=c,p=0;p<o;p++){var d=r[u+p],g=n[u+p],m=r[u+p+o],v=n[u+p+o],y=h*m-f*v;v=h*v+f*m,m=y,r[u+p]=d+m,n[u+p]=g+v,r[u+p+o]=d-m,n[u+p+o]=g-v,p!==s&&(y=l*h-c*f,f=l*f+c*h,h=y)}},g.prototype.guessLen13b=function(t,e){var r=1|Math.max(e,t),n=1&r,a=0;for(r=r/2|0;r;r>>>=1)a++;return 1<<a+1+n},g.prototype.conjugate=function(t,e,r){if(!(r<=1))for(var n=0;n<r/2;n++){var a=t[n];t[n]=t[r-n-1],t[r-n-1]=a,a=e[n],e[n]=-e[r-n-1],e[r-n-1]=-a}},g.prototype.normalize13b=function(t,e){for(var r=0,n=0;n<e/2;n++){var a=8192*Math.round(t[2*n+1]/e)+Math.round(t[2*n]/e)+r;t[n]=67108863&a,r=a<67108864?0:a/67108864|0}return t},g.prototype.convert13b=function(t,e,r,a){for(var i=0,o=0;o<e;o++)i+=0|t[o],r[2*o]=8191&i,i>>>=13,r[2*o+1]=8191&i,i>>>=13;for(o=2*e;o<a;++o)r[o]=0;n(0===i),n(0==(-8192&i))},g.prototype.stub=function(t){for(var e=new Array(t),r=0;r<t;r++)e[r]=0;return e},g.prototype.mulp=function(t,e,r){var n=2*this.guessLen13b(t.length,e.length),a=this.makeRBT(n),i=this.stub(n),o=new Array(n),s=new Array(n),l=new Array(n),c=new Array(n),u=new Array(n),h=new Array(n),f=r.words;f.length=n,this.convert13b(t.words,t.length,o,n),this.convert13b(e.words,e.length,c,n),this.transform(o,i,s,l,n,a),this.transform(c,i,u,h,n,a);for(var p=0;p<n;p++){var d=s[p]*u[p]-l[p]*h[p];l[p]=s[p]*h[p]+l[p]*u[p],s[p]=d}return this.conjugate(s,l,n),this.transform(s,l,f,i,n,a),this.conjugate(f,i,n),this.normalize13b(f,n),r.negative=t.negative^e.negative,r.length=t.length+e.length,r.strip()},i.prototype.mul=function(t){var e=new i(null);return e.words=new Array(this.length+t.length),this.mulTo(t,e)},i.prototype.mulf=function(t){var e=new i(null);return e.words=new Array(this.length+t.length),d(this,t,e)},i.prototype.imul=function(t){return this.clone().mulTo(t,this)},i.prototype.imuln=function(t){n("number"==typeof t),n(t<67108864);for(var e=0,r=0;r<this.length;r++){var a=(0|this.words[r])*t,i=(67108863&a)+(67108863&e);e>>=26,e+=a/67108864|0,e+=i>>>26,this.words[r]=67108863&i}return 0!==e&&(this.words[r]=e,this.length++),this},i.prototype.muln=function(t){return this.clone().imuln(t)},i.prototype.sqr=function(){return this.mul(this)},i.prototype.isqr=function(){return this.imul(this.clone())},i.prototype.pow=function(t){var e=function(t){for(var e=new Array(t.bitLength()),r=0;r<e.length;r++){var n=r/26|0,a=r%26;e[r]=(t.words[n]&1<<a)>>>a}return e}(t);if(0===e.length)return new i(1);for(var r=this,n=0;n<e.length&&0===e[n];n++,r=r.sqr());if(++n<e.length)for(var a=r.sqr();n<e.length;n++,a=a.sqr())0!==e[n]&&(r=r.mul(a));return r},i.prototype.iushln=function(t){n("number"==typeof t&&t>=0);var e,r=t%26,a=(t-r)/26,i=67108863>>>26-r<<26-r;if(0!==r){var o=0;for(e=0;e<this.length;e++){var s=this.words[e]&i,l=(0|this.words[e])-s<<r;this.words[e]=l|o,o=s>>>26-r}o&&(this.words[e]=o,this.length++)}if(0!==a){for(e=this.length-1;e>=0;e--)this.words[e+a]=this.words[e];for(e=0;e<a;e++)this.words[e]=0;this.length+=a}return this.strip()},i.prototype.ishln=function(t){return n(0===this.negative),this.iushln(t)},i.prototype.iushrn=function(t,e,r){var a;n("number"==typeof t&&t>=0),a=e?(e-e%26)/26:0;var i=t%26,o=Math.min((t-i)/26,this.length),s=67108863^67108863>>>i<<i,l=r;if(a-=o,a=Math.max(0,a),l){for(var c=0;c<o;c++)l.words[c]=this.words[c];l.length=o}if(0===o);else if(this.length>o)for(this.length-=o,c=0;c<this.length;c++)this.words[c]=this.words[c+o];else this.words[0]=0,this.length=1;var u=0;for(c=this.length-1;c>=0&&(0!==u||c>=a);c--){var h=0|this.words[c];this.words[c]=u<<26-i|h>>>i,u=h&s}return l&&0!==u&&(l.words[l.length++]=u),0===this.length&&(this.words[0]=0,this.length=1),this.strip()},i.prototype.ishrn=function(t,e,r){return n(0===this.negative),this.iushrn(t,e,r)},i.prototype.shln=function(t){return this.clone().ishln(t)},i.prototype.ushln=function(t){return this.clone().iushln(t)},i.prototype.shrn=function(t){return this.clone().ishrn(t)},i.prototype.ushrn=function(t){return this.clone().iushrn(t)},i.prototype.testn=function(t){n("number"==typeof t&&t>=0);var e=t%26,r=(t-e)/26,a=1<<e;return!(this.length<=r)&&!!(this.words[r]&a)},i.prototype.imaskn=function(t){n("number"==typeof t&&t>=0);var e=t%26,r=(t-e)/26;if(n(0===this.negative,"imaskn works only with positive numbers"),this.length<=r)return this;if(0!==e&&r++,this.length=Math.min(r,this.length),0!==e){var a=67108863^67108863>>>e<<e;this.words[this.length-1]&=a}return this.strip()},i.prototype.maskn=function(t){return this.clone().imaskn(t)},i.prototype.iaddn=function(t){return n("number"==typeof t),n(t<67108864),t<0?this.isubn(-t):0!==this.negative?1===this.length&&(0|this.words[0])<t?(this.words[0]=t-(0|this.words[0]),this.negative=0,this):(this.negative=0,this.isubn(t),this.negative=1,this):this._iaddn(t)},i.prototype._iaddn=function(t){this.words[0]+=t;for(var e=0;e<this.length&&this.words[e]>=67108864;e++)this.words[e]-=67108864,e===this.length-1?this.words[e+1]=1:this.words[e+1]++;return this.length=Math.max(this.length,e+1),this},i.prototype.isubn=function(t){if(n("number"==typeof t),n(t<67108864),t<0)return this.iaddn(-t);if(0!==this.negative)return this.negative=0,this.iaddn(t),this.negative=1,this;if(this.words[0]-=t,1===this.length&&this.words[0]<0)this.words[0]=-this.words[0],this.negative=1;else for(var e=0;e<this.length&&this.words[e]<0;e++)this.words[e]+=67108864,this.words[e+1]-=1;return this.strip()},i.prototype.addn=function(t){return this.clone().iaddn(t)},i.prototype.subn=function(t){return this.clone().isubn(t)},i.prototype.iabs=function(){return this.negative=0,this},i.prototype.abs=function(){return this.clone().iabs()},i.prototype._ishlnsubmul=function(t,e,r){var a,i,o=t.length+r;this._expand(o);var s=0;for(a=0;a<t.length;a++){i=(0|this.words[a+r])+s;var l=(0|t.words[a])*e;s=((i-=67108863&l)>>26)-(l/67108864|0),this.words[a+r]=67108863&i}for(;a<this.length-r;a++)s=(i=(0|this.words[a+r])+s)>>26,this.words[a+r]=67108863&i;if(0===s)return this.strip();for(n(-1===s),s=0,a=0;a<this.length;a++)s=(i=-(0|this.words[a])+s)>>26,this.words[a]=67108863&i;return this.negative=1,this.strip()},i.prototype._wordDiv=function(t,e){var r=(this.length,t.length),n=this.clone(),a=t,o=0|a.words[a.length-1];0!==(r=26-this._countBits(o))&&(a=a.ushln(r),n.iushln(r),o=0|a.words[a.length-1]);var s,l=n.length-a.length;if("mod"!==e){(s=new i(null)).length=l+1,s.words=new Array(s.length);for(var c=0;c<s.length;c++)s.words[c]=0}var u=n.clone()._ishlnsubmul(a,1,l);0===u.negative&&(n=u,s&&(s.words[l]=1));for(var h=l-1;h>=0;h--){var f=67108864*(0|n.words[a.length+h])+(0|n.words[a.length+h-1]);for(f=Math.min(f/o|0,67108863),n._ishlnsubmul(a,f,h);0!==n.negative;)f--,n.negative=0,n._ishlnsubmul(a,1,h),n.isZero()||(n.negative^=1);s&&(s.words[h]=f)}return s&&s.strip(),n.strip(),"div"!==e&&0!==r&&n.iushrn(r),{div:s||null,mod:n}},i.prototype.divmod=function(t,e,r){return n(!t.isZero()),this.isZero()?{div:new i(0),mod:new i(0)}:0!==this.negative&&0===t.negative?(s=this.neg().divmod(t,e),"mod"!==e&&(a=s.div.neg()),"div"!==e&&(o=s.mod.neg(),r&&0!==o.negative&&o.iadd(t)),{div:a,mod:o}):0===this.negative&&0!==t.negative?(s=this.divmod(t.neg(),e),"mod"!==e&&(a=s.div.neg()),{div:a,mod:s.mod}):0!=(this.negative&t.negative)?(s=this.neg().divmod(t.neg(),e),"div"!==e&&(o=s.mod.neg(),r&&0!==o.negative&&o.isub(t)),{div:s.div,mod:o}):t.length>this.length||this.cmp(t)<0?{div:new i(0),mod:this}:1===t.length?"div"===e?{div:this.divn(t.words[0]),mod:null}:"mod"===e?{div:null,mod:new i(this.modn(t.words[0]))}:{div:this.divn(t.words[0]),mod:new i(this.modn(t.words[0]))}:this._wordDiv(t,e);var a,o,s},i.prototype.div=function(t){return this.divmod(t,"div",!1).div},i.prototype.mod=function(t){return this.divmod(t,"mod",!1).mod},i.prototype.umod=function(t){return this.divmod(t,"mod",!0).mod},i.prototype.divRound=function(t){var e=this.divmod(t);if(e.mod.isZero())return e.div;var r=0!==e.div.negative?e.mod.isub(t):e.mod,n=t.ushrn(1),a=t.andln(1),i=r.cmp(n);return i<0||1===a&&0===i?e.div:0!==e.div.negative?e.div.isubn(1):e.div.iaddn(1)},i.prototype.modn=function(t){n(t<=67108863);for(var e=(1<<26)%t,r=0,a=this.length-1;a>=0;a--)r=(e*r+(0|this.words[a]))%t;return r},i.prototype.idivn=function(t){n(t<=67108863);for(var e=0,r=this.length-1;r>=0;r--){var a=(0|this.words[r])+67108864*e;this.words[r]=a/t|0,e=a%t}return this.strip()},i.prototype.divn=function(t){return this.clone().idivn(t)},i.prototype.egcd=function(t){n(0===t.negative),n(!t.isZero());var e=this,r=t.clone();e=0!==e.negative?e.umod(t):e.clone();for(var a=new i(1),o=new i(0),s=new i(0),l=new i(1),c=0;e.isEven()&&r.isEven();)e.iushrn(1),r.iushrn(1),++c;for(var u=r.clone(),h=e.clone();!e.isZero();){for(var f=0,p=1;0==(e.words[0]&p)&&f<26;++f,p<<=1);if(f>0)for(e.iushrn(f);f-- >0;)(a.isOdd()||o.isOdd())&&(a.iadd(u),o.isub(h)),a.iushrn(1),o.iushrn(1);for(var d=0,g=1;0==(r.words[0]&g)&&d<26;++d,g<<=1);if(d>0)for(r.iushrn(d);d-- >0;)(s.isOdd()||l.isOdd())&&(s.iadd(u),l.isub(h)),s.iushrn(1),l.iushrn(1);e.cmp(r)>=0?(e.isub(r),a.isub(s),o.isub(l)):(r.isub(e),s.isub(a),l.isub(o))}return{a:s,b:l,gcd:r.iushln(c)}},i.prototype._invmp=function(t){n(0===t.negative),n(!t.isZero());var e=this,r=t.clone();e=0!==e.negative?e.umod(t):e.clone();for(var a,o=new i(1),s=new i(0),l=r.clone();e.cmpn(1)>0&&r.cmpn(1)>0;){for(var c=0,u=1;0==(e.words[0]&u)&&c<26;++c,u<<=1);if(c>0)for(e.iushrn(c);c-- >0;)o.isOdd()&&o.iadd(l),o.iushrn(1);for(var h=0,f=1;0==(r.words[0]&f)&&h<26;++h,f<<=1);if(h>0)for(r.iushrn(h);h-- >0;)s.isOdd()&&s.iadd(l),s.iushrn(1);e.cmp(r)>=0?(e.isub(r),o.isub(s)):(r.isub(e),s.isub(o))}return(a=0===e.cmpn(1)?o:s).cmpn(0)<0&&a.iadd(t),a},i.prototype.gcd=function(t){if(this.isZero())return t.abs();if(t.isZero())return this.abs();var e=this.clone(),r=t.clone();e.negative=0,r.negative=0;for(var n=0;e.isEven()&&r.isEven();n++)e.iushrn(1),r.iushrn(1);for(;;){for(;e.isEven();)e.iushrn(1);for(;r.isEven();)r.iushrn(1);var a=e.cmp(r);if(a<0){var i=e;e=r,r=i}else if(0===a||0===r.cmpn(1))break;e.isub(r)}return r.iushln(n)},i.prototype.invm=function(t){return this.egcd(t).a.umod(t)},i.prototype.isEven=function(){return 0==(1&this.words[0])},i.prototype.isOdd=function(){return 1==(1&this.words[0])},i.prototype.andln=function(t){return this.words[0]&t},i.prototype.bincn=function(t){n("number"==typeof t);var e=t%26,r=(t-e)/26,a=1<<e;if(this.length<=r)return this._expand(r+1),this.words[r]|=a,this;for(var i=a,o=r;0!==i&&o<this.length;o++){var s=0|this.words[o];i=(s+=i)>>>26,s&=67108863,this.words[o]=s}return 0!==i&&(this.words[o]=i,this.length++),this},i.prototype.isZero=function(){return 1===this.length&&0===this.words[0]},i.prototype.cmpn=function(t){var e,r=t<0;if(0!==this.negative&&!r)return-1;if(0===this.negative&&r)return 1;if(this.strip(),this.length>1)e=1;else{r&&(t=-t),n(t<=67108863,"Number is too big");var a=0|this.words[0];e=a===t?0:a<t?-1:1}return 0!==this.negative?0|-e:e},i.prototype.cmp=function(t){if(0!==this.negative&&0===t.negative)return-1;if(0===this.negative&&0!==t.negative)return 1;var e=this.ucmp(t);return 0!==this.negative?0|-e:e},i.prototype.ucmp=function(t){if(this.length>t.length)return 1;if(this.length<t.length)return-1;for(var e=0,r=this.length-1;r>=0;r--){var n=0|this.words[r],a=0|t.words[r];if(n!==a){n<a?e=-1:n>a&&(e=1);break}}return e},i.prototype.gtn=function(t){return 1===this.cmpn(t)},i.prototype.gt=function(t){return 1===this.cmp(t)},i.prototype.gten=function(t){return this.cmpn(t)>=0},i.prototype.gte=function(t){return this.cmp(t)>=0},i.prototype.ltn=function(t){return-1===this.cmpn(t)},i.prototype.lt=function(t){return-1===this.cmp(t)},i.prototype.lten=function(t){return this.cmpn(t)<=0},i.prototype.lte=function(t){return this.cmp(t)<=0},i.prototype.eqn=function(t){return 0===this.cmpn(t)},i.prototype.eq=function(t){return 0===this.cmp(t)},i.red=function(t){return new w(t)},i.prototype.toRed=function(t){return n(!this.red,"Already a number in reduction context"),n(0===this.negative,"red works only with positives"),t.convertTo(this)._forceRed(t)},i.prototype.fromRed=function(){return n(this.red,"fromRed works only with numbers in reduction context"),this.red.convertFrom(this)},i.prototype._forceRed=function(t){return this.red=t,this},i.prototype.forceRed=function(t){return n(!this.red,"Already a number in reduction context"),this._forceRed(t)},i.prototype.redAdd=function(t){return n(this.red,"redAdd works only with red numbers"),this.red.add(this,t)},i.prototype.redIAdd=function(t){return n(this.red,"redIAdd works only with red numbers"),this.red.iadd(this,t)},i.prototype.redSub=function(t){return n(this.red,"redSub works only with red numbers"),this.red.sub(this,t)},i.prototype.redISub=function(t){return n(this.red,"redISub works only with red numbers"),this.red.isub(this,t)},i.prototype.redShl=function(t){return n(this.red,"redShl works only with red numbers"),this.red.shl(this,t)},i.prototype.redMul=function(t){return n(this.red,"redMul works only with red numbers"),this.red._verify2(this,t),this.red.mul(this,t)},i.prototype.redIMul=function(t){return n(this.red,"redMul works only with red numbers"),this.red._verify2(this,t),this.red.imul(this,t)},i.prototype.redSqr=function(){return n(this.red,"redSqr works only with red numbers"),this.red._verify1(this),this.red.sqr(this)},i.prototype.redISqr=function(){return n(this.red,"redISqr works only with red numbers"),this.red._verify1(this),this.red.isqr(this)},i.prototype.redSqrt=function(){return n(this.red,"redSqrt works only with red numbers"),this.red._verify1(this),this.red.sqrt(this)},i.prototype.redInvm=function(){return n(this.red,"redInvm works only with red numbers"),this.red._verify1(this),this.red.invm(this)},i.prototype.redNeg=function(){return n(this.red,"redNeg works only with red numbers"),this.red._verify1(this),this.red.neg(this)},i.prototype.redPow=function(t){return n(this.red&&!t.red,"redPow(normalNum)"),this.red._verify1(this),this.red.pow(this,t)};var m={k256:null,p224:null,p192:null,p25519:null};function v(t,e){this.name=t,this.p=new i(e,16),this.n=this.p.bitLength(),this.k=new i(1).iushln(this.n).isub(this.p),this.tmp=this._tmp()}function y(){v.call(this,"k256","ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f")}function x(){v.call(this,"p224","ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001")}function b(){v.call(this,"p192","ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff")}function _(){v.call(this,"25519","7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed")}function w(t){if("string"==typeof t){var e=i._prime(t);this.m=e.p,this.prime=e}else n(t.gtn(1),"modulus must be greater than 1"),this.m=t,this.prime=null}function T(t){w.call(this,t),this.shift=this.m.bitLength(),this.shift%26!=0&&(this.shift+=26-this.shift%26),this.r=new i(1).iushln(this.shift),this.r2=this.imod(this.r.sqr()),this.rinv=this.r._invmp(this.m),this.minv=this.rinv.mul(this.r).isubn(1).div(this.m),this.minv=this.minv.umod(this.r),this.minv=this.r.sub(this.minv)}v.prototype._tmp=function(){var t=new i(null);return t.words=new Array(Math.ceil(this.n/13)),t},v.prototype.ireduce=function(t){var e,r=t;do{this.split(r,this.tmp),e=(r=(r=this.imulK(r)).iadd(this.tmp)).bitLength()}while(e>this.n);var n=e<this.n?-1:r.ucmp(this.p);return 0===n?(r.words[0]=0,r.length=1):n>0?r.isub(this.p):r.strip(),r},v.prototype.split=function(t,e){t.iushrn(this.n,0,e)},v.prototype.imulK=function(t){return t.imul(this.k)},a(y,v),y.prototype.split=function(t,e){for(var r=Math.min(t.length,9),n=0;n<r;n++)e.words[n]=t.words[n];if(e.length=r,t.length<=9)return t.words[0]=0,void(t.length=1);var a=t.words[9];for(e.words[e.length++]=4194303&a,n=10;n<t.length;n++){var i=0|t.words[n];t.words[n-10]=(4194303&i)<<4|a>>>22,a=i}a>>>=22,t.words[n-10]=a,0===a&&t.length>10?t.length-=10:t.length-=9},y.prototype.imulK=function(t){t.words[t.length]=0,t.words[t.length+1]=0,t.length+=2;for(var e=0,r=0;r<t.length;r++){var n=0|t.words[r];e+=977*n,t.words[r]=67108863&e,e=64*n+(e/67108864|0)}return 0===t.words[t.length-1]&&(t.length--,0===t.words[t.length-1]&&t.length--),t},a(x,v),a(b,v),a(_,v),_.prototype.imulK=function(t){for(var e=0,r=0;r<t.length;r++){var n=19*(0|t.words[r])+e,a=67108863&n;n>>>=26,t.words[r]=a,e=n}return 0!==e&&(t.words[t.length++]=e),t},i._prime=function(t){if(m[t])return m[t];var e;if("k256"===t)e=new y;else if("p224"===t)e=new x;else if("p192"===t)e=new b;else{if("p25519"!==t)throw new Error("Unknown prime "+t);e=new _}return m[t]=e,e},w.prototype._verify1=function(t){n(0===t.negative,"red works only with positives"),n(t.red,"red works only with red numbers")},w.prototype._verify2=function(t,e){n(0==(t.negative|e.negative),"red works only with positives"),n(t.red&&t.red===e.red,"red works only with red numbers")},w.prototype.imod=function(t){return this.prime?this.prime.ireduce(t)._forceRed(this):t.umod(this.m)._forceRed(this)},w.prototype.neg=function(t){return t.isZero()?t.clone():this.m.sub(t)._forceRed(this)},w.prototype.add=function(t,e){this._verify2(t,e);var r=t.add(e);return r.cmp(this.m)>=0&&r.isub(this.m),r._forceRed(this)},w.prototype.iadd=function(t,e){this._verify2(t,e);var r=t.iadd(e);return r.cmp(this.m)>=0&&r.isub(this.m),r},w.prototype.sub=function(t,e){this._verify2(t,e);var r=t.sub(e);return r.cmpn(0)<0&&r.iadd(this.m),r._forceRed(this)},w.prototype.isub=function(t,e){this._verify2(t,e);var r=t.isub(e);return r.cmpn(0)<0&&r.iadd(this.m),r},w.prototype.shl=function(t,e){return this._verify1(t),this.imod(t.ushln(e))},w.prototype.imul=function(t,e){return this._verify2(t,e),this.imod(t.imul(e))},w.prototype.mul=function(t,e){return this._verify2(t,e),this.imod(t.mul(e))},w.prototype.isqr=function(t){return this.imul(t,t.clone())},w.prototype.sqr=function(t){return this.mul(t,t)},w.prototype.sqrt=function(t){if(t.isZero())return t.clone();var e=this.m.andln(3);if(n(e%2==1),3===e){var r=this.m.add(new i(1)).iushrn(2);return this.pow(t,r)}for(var a=this.m.subn(1),o=0;!a.isZero()&&0===a.andln(1);)o++,a.iushrn(1);n(!a.isZero());var s=new i(1).toRed(this),l=s.redNeg(),c=this.m.subn(1).iushrn(1),u=this.m.bitLength();for(u=new i(2*u*u).toRed(this);0!==this.pow(u,c).cmp(l);)u.redIAdd(l);for(var h=this.pow(u,a),f=this.pow(t,a.addn(1).iushrn(1)),p=this.pow(t,a),d=o;0!==p.cmp(s);){for(var g=p,m=0;0!==g.cmp(s);m++)g=g.redSqr();n(m<d);var v=this.pow(h,new i(1).iushln(d-m-1));f=f.redMul(v),h=v.redSqr(),p=p.redMul(h),d=m}return f},w.prototype.invm=function(t){var e=t._invmp(this.m);return 0!==e.negative?(e.negative=0,this.imod(e).redNeg()):this.imod(e)},w.prototype.pow=function(t,e){if(e.isZero())return new i(1).toRed(this);if(0===e.cmpn(1))return t.clone();var r=new Array(16);r[0]=new i(1).toRed(this),r[1]=t;for(var n=2;n<r.length;n++)r[n]=this.mul(r[n-1],t);var a=r[0],o=0,s=0,l=e.bitLength()%26;for(0===l&&(l=26),n=e.length-1;n>=0;n--){for(var c=e.words[n],u=l-1;u>=0;u--){var h=c>>u&1;a!==r[0]&&(a=this.sqr(a)),0!==h||0!==o?(o<<=1,o|=h,(4===++s||0===n&&0===u)&&(a=this.mul(a,r[o]),s=0,o=0)):s=0}l=26}return a},w.prototype.convertTo=function(t){var e=t.umod(this.m);return e===t?e.clone():e},w.prototype.convertFrom=function(t){var e=t.clone();return e.red=null,e},i.mont=function(t){return new T(t)},a(T,w),T.prototype.convertTo=function(t){return this.imod(t.ushln(this.shift))},T.prototype.convertFrom=function(t){var e=this.imod(t.mul(this.rinv));return e.red=null,e},T.prototype.imul=function(t,e){if(t.isZero()||e.isZero())return t.words[0]=0,t.length=1,t;var r=t.imul(e),n=r.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),a=r.isub(n).iushrn(this.shift),i=a;return a.cmp(this.m)>=0?i=a.isub(this.m):a.cmpn(0)<0&&(i=a.iadd(this.m)),i._forceRed(this)},T.prototype.mul=function(t,e){if(t.isZero()||e.isZero())return new i(0)._forceRed(this);var r=t.mul(e),n=r.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),a=r.isub(n).iushrn(this.shift),o=a;return a.cmp(this.m)>=0?o=a.isub(this.m):a.cmpn(0)<0&&(o=a.iadd(this.m)),o._forceRed(this)},T.prototype.invm=function(t){return this.imod(t._invmp(this.m).mul(this.r2))._forceRed(this)}}("undefined"==typeof e||e,this)},{buffer:106}],98:[function(t,e,r){"use strict";e.exports=function(t){var e,r,n,a=t.length,i=0;for(e=0;e<a;++e)i+=t[e].length;var o=new Array(i),s=0;for(e=0;e<a;++e){var l=t[e],c=l.length;for(r=0;r<c;++r){var u=o[s++]=new Array(c-1),h=0;for(n=0;n<c;++n)n!==r&&(u[h++]=l[n]);if(1&r){var f=u[1];u[1]=u[0],u[0]=f}}}return o}},{}],99:[function(t,e,r){"use strict";e.exports=function(t,e,r){switch(arguments.length){case 1:return h(t);case 2:return"function"==typeof e?c(t,t,e,!0):f(t,e);case 3:return c(t,e,r,!1);default:throw new Error("box-intersect: Invalid arguments")}};var n,a=t("typedarray-pool"),i=t("./lib/sweep"),o=t("./lib/intersect");function s(t,e){for(var r=0;r<t;++r)if(!(e[r]<=e[r+t]))return!0;return!1}function l(t,e,r,n){for(var a=0,i=0,o=0,l=t.length;o<l;++o){var c=t[o];if(!s(e,c)){for(var u=0;u<2*e;++u)r[a++]=c[u];n[i++]=o}}return i}function c(t,e,r,n){var s=t.length,c=e.length;if(!(s<=0||c<=0)){var u=t[0].length>>>1;if(!(u<=0)){var h,f=a.mallocDouble(2*u*s),p=a.mallocInt32(s);if((s=l(t,u,f,p))>0){if(1===u&&n)i.init(s),h=i.sweepComplete(u,r,0,s,f,p,0,s,f,p);else{var d=a.mallocDouble(2*u*c),g=a.mallocInt32(c);(c=l(e,u,d,g))>0&&(i.init(s+c),h=1===u?i.sweepBipartite(u,r,0,s,f,p,0,c,d,g):o(u,r,n,s,f,p,c,d,g),a.free(d),a.free(g))}a.free(f),a.free(p)}return h}}}function u(t,e){n.push([t,e])}function h(t){return n=[],c(t,t,u,!0),n}function f(t,e){return n=[],c(t,e,u,!1),n}},{"./lib/intersect":101,"./lib/sweep":105,"typedarray-pool":547}],100:[function(t,e,r){"use strict";var n=["d","ax","vv","rs","re","rb","ri","bs","be","bb","bi"];function a(t){var e="bruteForce"+(t?"Full":"Partial"),r=[],a=n.slice();t||a.splice(3,0,"fp");var i=["function "+e+"("+a.join()+"){"];function o(e,a){var o=function(t,e,r){var a="bruteForce"+(t?"Red":"Blue")+(e?"Flip":"")+(r?"Full":""),i=["function ",a,"(",n.join(),"){","var ","es","=2*","d",";"],o="for(var i=rs,rp=es*rs;i<re;++i,rp+=es){var x0=rb[ax+rp],x1=rb[ax+rp+d],xi=ri[i];",s="for(var j=bs,bp=es*bs;j<be;++j,bp+=es){var y0=bb[ax+bp],"+(r?"y1=bb[ax+bp+d],":"")+"yi=bi[j];";return t?i.push(o,"Q",":",s):i.push(s,"Q",":",o),r?i.push("if(y1<x0||x1<y0)continue;"):e?i.push("if(y0<=x0||x1<y0)continue;"):i.push("if(y0<x0||x1<y0)continue;"),i.push("for(var k=ax+1;k<d;++k){var r0=rb[k+rp],r1=rb[k+d+rp],b0=bb[k+bp],b1=bb[k+d+bp];if(r1<b0||b1<r0)continue Q;}var rv=vv("),e?i.push("yi,xi"):i.push("xi,yi"),i.push(");if(rv!==void 0)return rv;}}}"),{name:a,code:i.join("")}}(e,a,t);r.push(o.code),i.push("return "+o.name+"("+n.join()+");")}i.push("if(re-rs>be-bs){"),t?(o(!0,!1),i.push("}else{"),o(!1,!1)):(i.push("if(fp){"),o(!0,!0),i.push("}else{"),o(!0,!1),i.push("}}else{if(fp){"),o(!1,!0),i.push("}else{"),o(!1,!1),i.push("}")),i.push("}}return "+e);var s=r.join("")+i.join("");return new Function(s)()}r.partial=a(!1),r.full=a(!0)},{}],101:[function(t,e,r){"use strict";e.exports=function(t,e,r,i,u,w,T,k,A){!function(t,e){var r=8*a.log2(e+1)*(t+1)|0,i=a.nextPow2(6*r);v.length<i&&(n.free(v),v=n.mallocInt32(i));var o=a.nextPow2(2*r);y.length<o&&(n.free(y),y=n.mallocDouble(o))}(t,i+T);var M,S=0,E=2*t;x(S++,0,0,i,0,T,r?16:0,-1/0,1/0),r||x(S++,0,0,T,0,i,1,-1/0,1/0);for(;S>0;){var C=6*(S-=1),L=v[C],P=v[C+1],I=v[C+2],z=v[C+3],O=v[C+4],D=v[C+5],R=2*S,F=y[R],B=y[R+1],N=1&D,j=!!(16&D),V=u,U=w,q=k,H=A;if(N&&(V=k,U=A,q=u,H=w),!(2&D&&(I=p(t,L,P,I,V,U,B),P>=I)||4&D&&(P=d(t,L,P,I,V,U,F))>=I)){var G=I-P,Y=O-z;if(j){if(t*G*(G+Y)<1<<22){if(void 0!==(M=l.scanComplete(t,L,e,P,I,V,U,z,O,q,H)))return M;continue}}else{if(t*Math.min(G,Y)<128){if(void 0!==(M=o(t,L,e,N,P,I,V,U,z,O,q,H)))return M;continue}if(t*G*Y<1<<22){if(void 0!==(M=l.scanBipartite(t,L,e,N,P,I,V,U,z,O,q,H)))return M;continue}}var W=h(t,L,P,I,V,U,F,B);if(P<W)if(t*(W-P)<128){if(void 0!==(M=s(t,L+1,e,P,W,V,U,z,O,q,H)))return M}else if(L===t-2){if(void 0!==(M=N?l.sweepBipartite(t,e,z,O,q,H,P,W,V,U):l.sweepBipartite(t,e,P,W,V,U,z,O,q,H)))return M}else x(S++,L+1,P,W,z,O,N,-1/0,1/0),x(S++,L+1,z,O,P,W,1^N,-1/0,1/0);if(W<I){var Z=c(t,L,z,O,q,H),X=q[E*Z+L],J=f(t,L,Z,O,q,H,X);if(J<O&&x(S++,L,W,I,J,O,(4|N)+(j?16:0),X,B),z<Z&&x(S++,L,W,I,z,Z,(2|N)+(j?16:0),F,X),Z+1===J){if(void 0!==(M=j?_(t,L,e,W,I,V,U,Z,q,H[Z]):b(t,L,e,N,W,I,V,U,Z,q,H[Z])))return M}else if(Z<J){var K;if(j){if(K=g(t,L,W,I,V,U,X),W<K){var Q=f(t,L,W,K,V,U,X);if(L===t-2){if(W<Q&&void 0!==(M=l.sweepComplete(t,e,W,Q,V,U,Z,J,q,H)))return M;if(Q<K&&void 0!==(M=l.sweepBipartite(t,e,Q,K,V,U,Z,J,q,H)))return M}else W<Q&&x(S++,L+1,W,Q,Z,J,16,-1/0,1/0),Q<K&&(x(S++,L+1,Q,K,Z,J,0,-1/0,1/0),x(S++,L+1,Z,J,Q,K,1,-1/0,1/0))}}else K=N?m(t,L,W,I,V,U,X):g(t,L,W,I,V,U,X),W<K&&(L===t-2?M=N?l.sweepBipartite(t,e,Z,J,q,H,W,K,V,U):l.sweepBipartite(t,e,W,K,V,U,Z,J,q,H):(x(S++,L+1,W,K,Z,J,N,-1/0,1/0),x(S++,L+1,Z,J,W,K,1^N,-1/0,1/0)))}}}}};var n=t("typedarray-pool"),a=t("bit-twiddle"),i=t("./brute"),o=i.partial,s=i.full,l=t("./sweep"),c=t("./median"),u=t("./partition"),h=u("!(lo>=p0)&&!(p1>=hi)",["p0","p1"]),f=u("lo===p0",["p0"]),p=u("lo<p0",["p0"]),d=u("hi<=p0",["p0"]),g=u("lo<=p0&&p0<=hi",["p0"]),m=u("lo<p0&&p0<=hi",["p0"]),v=n.mallocInt32(1024),y=n.mallocDouble(1024);function x(t,e,r,n,a,i,o,s,l){var c=6*t;v[c]=e,v[c+1]=r,v[c+2]=n,v[c+3]=a,v[c+4]=i,v[c+5]=o;var u=2*t;y[u]=s,y[u+1]=l}function b(t,e,r,n,a,i,o,s,l,c,u){var h=2*t,f=l*h,p=c[f+e];t:for(var d=a,g=a*h;d<i;++d,g+=h){var m=o[g+e],v=o[g+e+t];if(!(p<m||v<p)&&(!n||p!==m)){for(var y,x=s[d],b=e+1;b<t;++b){m=o[g+b],v=o[g+b+t];var _=c[f+b],w=c[f+b+t];if(v<_||w<m)continue t}if(void 0!==(y=n?r(u,x):r(x,u)))return y}}}function _(t,e,r,n,a,i,o,s,l,c){var u=2*t,h=s*u,f=l[h+e];t:for(var p=n,d=n*u;p<a;++p,d+=u){var g=o[p];if(g!==c){var m=i[d+e],v=i[d+e+t];if(!(f<m||v<f)){for(var y=e+1;y<t;++y){m=i[d+y],v=i[d+y+t];var x=l[h+y],b=l[h+y+t];if(v<x||b<m)continue t}var _=r(g,c);if(void 0!==_)return _}}}}},{"./brute":100,"./median":102,"./partition":103,"./sweep":105,"bit-twiddle":95,"typedarray-pool":547}],102:[function(t,e,r){"use strict";e.exports=function(t,e,r,i,o,s){if(i<=r+1)return r;var l=r,c=i,u=i+r>>>1,h=2*t,f=u,p=o[h*u+e];for(;l<c;){if(c-l<8){a(t,e,l,c,o,s),p=o[h*u+e];break}var d=c-l,g=Math.random()*d+l|0,m=o[h*g+e],v=Math.random()*d+l|0,y=o[h*v+e],x=Math.random()*d+l|0,b=o[h*x+e];m<=y?b>=y?(f=v,p=y):m>=b?(f=g,p=m):(f=x,p=b):y>=b?(f=v,p=y):b>=m?(f=g,p=m):(f=x,p=b);for(var _=h*(c-1),w=h*f,T=0;T<h;++T,++_,++w){var k=o[_];o[_]=o[w],o[w]=k}var A=s[c-1];s[c-1]=s[f],s[f]=A,f=n(t,e,l,c-1,o,s,p);for(_=h*(c-1),w=h*f,T=0;T<h;++T,++_,++w){k=o[_];o[_]=o[w],o[w]=k}A=s[c-1];if(s[c-1]=s[f],s[f]=A,u<f){for(c=f-1;l<c&&o[h*(c-1)+e]===p;)c-=1;c+=1}else{if(!(f<u))break;for(l=f+1;l<c&&o[h*l+e]===p;)l+=1}}return n(t,e,r,u,o,s,o[h*u+e])};var n=t("./partition")("lo<p0",["p0"]);function a(t,e,r,n,a,i){for(var o=2*t,s=o*(r+1)+e,l=r+1;l<n;++l,s+=o)for(var c=a[s],u=l,h=o*(l-1);u>r&&a[h+e]>c;--u,h-=o){for(var f=h,p=h+o,d=0;d<o;++d,++f,++p){var g=a[f];a[f]=a[p],a[p]=g}var m=i[u];i[u]=i[u-1],i[u-1]=m}}},{"./partition":103}],103:[function(t,e,r){"use strict";e.exports=function(t,e){var r="abcdef".split("").concat(e),n=[];t.indexOf("lo")>=0&&n.push("lo=e[k+n]");t.indexOf("hi")>=0&&n.push("hi=e[k+o]");return r.push("for(var j=2*a,k=j*c,l=k,m=c,n=b,o=a+b,p=c;d>p;++p,k+=j){var _;if($)if(m===p)m+=1,l+=j;else{for(var s=0;j>s;++s){var t=e[k+s];e[k+s]=e[l],e[l++]=t}var u=f[p];f[p]=f[m],f[m++]=u}}return m".replace("_",n.join()).replace("$",t)),Function.apply(void 0,r)}},{}],104:[function(t,e,r){"use strict";e.exports=function(t,e){e<=128?n(0,e-1,t):function t(e,r,u){var h=(r-e+1)/6|0,f=e+h,p=r-h,d=e+r>>1,g=d-h,m=d+h,v=f,y=g,x=d,b=m,_=p,w=e+1,T=r-1,k=0;l(v,y,u)&&(k=v,v=y,y=k);l(b,_,u)&&(k=b,b=_,_=k);l(v,x,u)&&(k=v,v=x,x=k);l(y,x,u)&&(k=y,y=x,x=k);l(v,b,u)&&(k=v,v=b,b=k);l(x,b,u)&&(k=x,x=b,b=k);l(y,_,u)&&(k=y,y=_,_=k);l(y,x,u)&&(k=y,y=x,x=k);l(b,_,u)&&(k=b,b=_,_=k);for(var A=u[2*y],M=u[2*y+1],S=u[2*b],E=u[2*b+1],C=2*v,L=2*x,P=2*_,I=2*f,z=2*d,O=2*p,D=0;D<2;++D){var R=u[C+D],F=u[L+D],B=u[P+D];u[I+D]=R,u[z+D]=F,u[O+D]=B}i(g,e,u),i(m,r,u);for(var N=w;N<=T;++N)if(c(N,A,M,u))N!==w&&a(N,w,u),++w;else if(!c(N,S,E,u))for(;;){if(c(T,S,E,u)){c(T,A,M,u)?(o(N,w,T,u),++w,--T):(a(N,T,u),--T);break}if(--T<N)break}s(e,w-1,A,M,u),s(r,T+1,S,E,u),w-2-e<=32?n(e,w-2,u):t(e,w-2,u);r-(T+2)<=32?n(T+2,r,u):t(T+2,r,u);T-w<=32?n(w,T,u):t(w,T,u)}(0,e-1,t)};function n(t,e,r){for(var n=2*(t+1),a=t+1;a<=e;++a){for(var i=r[n++],o=r[n++],s=a,l=n-2;s-- >t;){var c=r[l-2],u=r[l-1];if(c<i)break;if(c===i&&u<o)break;r[l]=c,r[l+1]=u,l-=2}r[l]=i,r[l+1]=o}}function a(t,e,r){e*=2;var n=r[t*=2],a=r[t+1];r[t]=r[e],r[t+1]=r[e+1],r[e]=n,r[e+1]=a}function i(t,e,r){e*=2,r[t*=2]=r[e],r[t+1]=r[e+1]}function o(t,e,r,n){e*=2,r*=2;var a=n[t*=2],i=n[t+1];n[t]=n[e],n[t+1]=n[e+1],n[e]=n[r],n[e+1]=n[r+1],n[r]=a,n[r+1]=i}function s(t,e,r,n,a){e*=2,a[t*=2]=a[e],a[e]=r,a[t+1]=a[e+1],a[e+1]=n}function l(t,e,r){e*=2;var n=r[t*=2],a=r[e];return!(n<a)&&(n!==a||r[t+1]>r[e+1])}function c(t,e,r,n){var a=n[t*=2];return a<e||a===e&&n[t+1]<r}},{}],105:[function(t,e,r){"use strict";e.exports={init:function(t){var e=a.nextPow2(t);o.length<e&&(n.free(o),o=n.mallocInt32(e));s.length<e&&(n.free(s),s=n.mallocInt32(e));l.length<e&&(n.free(l),l=n.mallocInt32(e));c.length<e&&(n.free(c),c=n.mallocInt32(e));u.length<e&&(n.free(u),u=n.mallocInt32(e));h.length<e&&(n.free(h),h=n.mallocInt32(e));var r=8*e;f.length<r&&(n.free(f),f=n.mallocDouble(r))},sweepBipartite:function(t,e,r,n,a,u,h,g,m,v){for(var y=0,x=2*t,b=t-1,_=x-1,w=r;w<n;++w){var T=u[w],k=x*w;f[y++]=a[k+b],f[y++]=-(T+1),f[y++]=a[k+_],f[y++]=T}for(w=h;w<g;++w){T=v[w]+(1<<28);var A=x*w;f[y++]=m[A+b],f[y++]=-T,f[y++]=m[A+_],f[y++]=T}var M=y>>>1;i(f,M);var S=0,E=0;for(w=0;w<M;++w){var C=0|f[2*w+1];if(C>=1<<28)p(l,c,E--,C=C-(1<<28)|0);else if(C>=0)p(o,s,S--,C);else if(C<=-(1<<28)){C=-C-(1<<28)|0;for(var L=0;L<S;++L){if(void 0!==(P=e(o[L],C)))return P}d(l,c,E++,C)}else{C=-C-1|0;for(L=0;L<E;++L){var P;if(void 0!==(P=e(C,l[L])))return P}d(o,s,S++,C)}}},sweepComplete:function(t,e,r,n,a,g,m,v,y,x){for(var b=0,_=2*t,w=t-1,T=_-1,k=r;k<n;++k){var A=g[k]+1<<1,M=_*k;f[b++]=a[M+w],f[b++]=-A,f[b++]=a[M+T],f[b++]=A}for(k=m;k<v;++k){A=x[k]+1<<1;var S=_*k;f[b++]=y[S+w],f[b++]=1|-A,f[b++]=y[S+T],f[b++]=1|A}var E=b>>>1;i(f,E);var C=0,L=0,P=0;for(k=0;k<E;++k){var I=0|f[2*k+1],z=1&I;if(k<E-1&&I>>1==f[2*k+3]>>1&&(z=2,k+=1),I<0){for(var O=-(I>>1)-1,D=0;D<P;++D){if(void 0!==(R=e(u[D],O)))return R}if(0!==z)for(D=0;D<C;++D){if(void 0!==(R=e(o[D],O)))return R}if(1!==z)for(D=0;D<L;++D){var R;if(void 0!==(R=e(l[D],O)))return R}0===z?d(o,s,C++,O):1===z?d(l,c,L++,O):2===z&&d(u,h,P++,O)}else{O=(I>>1)-1;0===z?p(o,s,C--,O):1===z?p(l,c,L--,O):2===z&&p(u,h,P--,O)}}},scanBipartite:function(t,e,r,n,a,l,c,u,h,g,m,v){var y=0,x=2*t,b=e,_=e+t,w=1,T=1;n?T=1<<28:w=1<<28;for(var k=a;k<l;++k){var A=k+w,M=x*k;f[y++]=c[M+b],f[y++]=-A,f[y++]=c[M+_],f[y++]=A}for(k=h;k<g;++k){A=k+T;var S=x*k;f[y++]=m[S+b],f[y++]=-A}var E=y>>>1;i(f,E);var C=0;for(k=0;k<E;++k){var L=0|f[2*k+1];if(L<0){var P=!1;if((A=-L)>=1<<28?(P=!n,A-=1<<28):(P=!!n,A-=1),P)d(o,s,C++,A);else{var I=v[A],z=x*A,O=m[z+e+1],D=m[z+e+1+t];t:for(var R=0;R<C;++R){var F=o[R],B=x*F;if(!(D<c[B+e+1]||c[B+e+1+t]<O)){for(var N=e+2;N<t;++N)if(m[z+N+t]<c[B+N]||c[B+N+t]<m[z+N])continue t;var j,V=u[F];if(void 0!==(j=n?r(I,V):r(V,I)))return j}}}}else p(o,s,C--,L-w)}},scanComplete:function(t,e,r,n,a,s,l,c,u,h,p){for(var d=0,g=2*t,m=e,v=e+t,y=n;y<a;++y){var x=y+(1<<28),b=g*y;f[d++]=s[b+m],f[d++]=-x,f[d++]=s[b+v],f[d++]=x}for(y=c;y<u;++y){x=y+1;var _=g*y;f[d++]=h[_+m],f[d++]=-x}var w=d>>>1;i(f,w);var T=0;for(y=0;y<w;++y){var k=0|f[2*y+1];if(k<0){if((x=-k)>=1<<28)o[T++]=x-(1<<28);else{var A=p[x-=1],M=g*x,S=h[M+e+1],E=h[M+e+1+t];t:for(var C=0;C<T;++C){var L=o[C],P=l[L];if(P===A)break;var I=g*L;if(!(E<s[I+e+1]||s[I+e+1+t]<S)){for(var z=e+2;z<t;++z)if(h[M+z+t]<s[I+z]||s[I+z+t]<h[M+z])continue t;var O=r(P,A);if(void 0!==O)return O}}}}else{for(x=k-(1<<28),C=T-1;C>=0;--C)if(o[C]===x){for(z=C+1;z<T;++z)o[z-1]=o[z];break}--T}}}};var n=t("typedarray-pool"),a=t("bit-twiddle"),i=t("./sort"),o=n.mallocInt32(1024),s=n.mallocInt32(1024),l=n.mallocInt32(1024),c=n.mallocInt32(1024),u=n.mallocInt32(1024),h=n.mallocInt32(1024),f=n.mallocDouble(8192);function p(t,e,r,n){var a=e[n],i=t[r-1];t[a]=i,e[i]=a}function d(t,e,r,n){t[r]=n,e[n]=r}},{"./sort":104,"bit-twiddle":95,"typedarray-pool":547}],106:[function(t,e,r){},{}],107:[function(t,e,r){var n=Object.create||function(t){var e=function(){};return e.prototype=t,new e},a=Object.keys||function(t){var e=[];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.push(r);return r},i=Function.prototype.bind||function(t){var e=this;return function(){return e.apply(t,arguments)}};function o(){this._events&&Object.prototype.hasOwnProperty.call(this,"_events")||(this._events=n(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0}e.exports=o,o.EventEmitter=o,o.prototype._events=void 0,o.prototype._maxListeners=void 0;var s,l=10;try{var c={};Object.defineProperty&&Object.defineProperty(c,"x",{value:0}),s=0===c.x}catch(t){s=!1}function u(t){return void 0===t._maxListeners?o.defaultMaxListeners:t._maxListeners}function h(t,e,r){if(e)t.call(r);else for(var n=t.length,a=_(t,n),i=0;i<n;++i)a[i].call(r)}function f(t,e,r,n){if(e)t.call(r,n);else for(var a=t.length,i=_(t,a),o=0;o<a;++o)i[o].call(r,n)}function p(t,e,r,n,a){if(e)t.call(r,n,a);else for(var i=t.length,o=_(t,i),s=0;s<i;++s)o[s].call(r,n,a)}function d(t,e,r,n,a,i){if(e)t.call(r,n,a,i);else for(var o=t.length,s=_(t,o),l=0;l<o;++l)s[l].call(r,n,a,i)}function g(t,e,r,n){if(e)t.apply(r,n);else for(var a=t.length,i=_(t,a),o=0;o<a;++o)i[o].apply(r,n)}function m(t,e,r,a){var i,o,s;if("function"!=typeof r)throw new TypeError('"listener" argument must be a function');if((o=t._events)?(o.newListener&&(t.emit("newListener",e,r.listener?r.listener:r),o=t._events),s=o[e]):(o=t._events=n(null),t._eventsCount=0),s){if("function"==typeof s?s=o[e]=a?[r,s]:[s,r]:a?s.unshift(r):s.push(r),!s.warned&&(i=u(t))&&i>0&&s.length>i){s.warned=!0;var l=new Error("Possible EventEmitter memory leak detected. "+s.length+' "'+String(e)+'" listeners added. Use emitter.setMaxListeners() to increase limit.');l.name="MaxListenersExceededWarning",l.emitter=t,l.type=e,l.count=s.length,"object"==typeof console&&console.warn&&console.warn("%s: %s",l.name,l.message)}}else s=o[e]=r,++t._eventsCount;return t}function v(){if(!this.fired)switch(this.target.removeListener(this.type,this.wrapFn),this.fired=!0,arguments.length){case 0:return this.listener.call(this.target);case 1:return this.listener.call(this.target,arguments[0]);case 2:return this.listener.call(this.target,arguments[0],arguments[1]);case 3:return this.listener.call(this.target,arguments[0],arguments[1],arguments[2]);default:for(var t=new Array(arguments.length),e=0;e<t.length;++e)t[e]=arguments[e];this.listener.apply(this.target,t)}}function y(t,e,r){var n={fired:!1,wrapFn:void 0,target:t,type:e,listener:r},a=i.call(v,n);return a.listener=r,n.wrapFn=a,a}function x(t,e,r){var n=t._events;if(!n)return[];var a=n[e];return a?"function"==typeof a?r?[a.listener||a]:[a]:r?function(t){for(var e=new Array(t.length),r=0;r<e.length;++r)e[r]=t[r].listener||t[r];return e}(a):_(a,a.length):[]}function b(t){var e=this._events;if(e){var r=e[t];if("function"==typeof r)return 1;if(r)return r.length}return 0}function _(t,e){for(var r=new Array(e),n=0;n<e;++n)r[n]=t[n];return r}s?Object.defineProperty(o,"defaultMaxListeners",{enumerable:!0,get:function(){return l},set:function(t){if("number"!=typeof t||t<0||t!=t)throw new TypeError('"defaultMaxListeners" must be a positive number');l=t}}):o.defaultMaxListeners=l,o.prototype.setMaxListeners=function(t){if("number"!=typeof t||t<0||isNaN(t))throw new TypeError('"n" argument must be a positive number');return this._maxListeners=t,this},o.prototype.getMaxListeners=function(){return u(this)},o.prototype.emit=function(t){var e,r,n,a,i,o,s="error"===t;if(o=this._events)s=s&&null==o.error;else if(!s)return!1;if(s){if(arguments.length>1&&(e=arguments[1]),e instanceof Error)throw e;var l=new Error('Unhandled "error" event. ('+e+")");throw l.context=e,l}if(!(r=o[t]))return!1;var c="function"==typeof r;switch(n=arguments.length){case 1:h(r,c,this);break;case 2:f(r,c,this,arguments[1]);break;case 3:p(r,c,this,arguments[1],arguments[2]);break;case 4:d(r,c,this,arguments[1],arguments[2],arguments[3]);break;default:for(a=new Array(n-1),i=1;i<n;i++)a[i-1]=arguments[i];g(r,c,this,a)}return!0},o.prototype.addListener=function(t,e){return m(this,t,e,!1)},o.prototype.on=o.prototype.addListener,o.prototype.prependListener=function(t,e){return m(this,t,e,!0)},o.prototype.once=function(t,e){if("function"!=typeof e)throw new TypeError('"listener" argument must be a function');return this.on(t,y(this,t,e)),this},o.prototype.prependOnceListener=function(t,e){if("function"!=typeof e)throw new TypeError('"listener" argument must be a function');return this.prependListener(t,y(this,t,e)),this},o.prototype.removeListener=function(t,e){var r,a,i,o,s;if("function"!=typeof e)throw new TypeError('"listener" argument must be a function');if(!(a=this._events))return this;if(!(r=a[t]))return this;if(r===e||r.listener===e)0==--this._eventsCount?this._events=n(null):(delete a[t],a.removeListener&&this.emit("removeListener",t,r.listener||e));else if("function"!=typeof r){for(i=-1,o=r.length-1;o>=0;o--)if(r[o]===e||r[o].listener===e){s=r[o].listener,i=o;break}if(i<0)return this;0===i?r.shift():function(t,e){for(var r=e,n=r+1,a=t.length;n<a;r+=1,n+=1)t[r]=t[n];t.pop()}(r,i),1===r.length&&(a[t]=r[0]),a.removeListener&&this.emit("removeListener",t,s||e)}return this},o.prototype.removeAllListeners=function(t){var e,r,i;if(!(r=this._events))return this;if(!r.removeListener)return 0===arguments.length?(this._events=n(null),this._eventsCount=0):r[t]&&(0==--this._eventsCount?this._events=n(null):delete r[t]),this;if(0===arguments.length){var o,s=a(r);for(i=0;i<s.length;++i)"removeListener"!==(o=s[i])&&this.removeAllListeners(o);return this.removeAllListeners("removeListener"),this._events=n(null),this._eventsCount=0,this}if("function"==typeof(e=r[t]))this.removeListener(t,e);else if(e)for(i=e.length-1;i>=0;i--)this.removeListener(t,e[i]);return this},o.prototype.listeners=function(t){return x(this,t,!0)},o.prototype.rawListeners=function(t){return x(this,t,!1)},o.listenerCount=function(t,e){return"function"==typeof t.listenerCount?t.listenerCount(e):b.call(t,e)},o.prototype.listenerCount=b,o.prototype.eventNames=function(){return this._eventsCount>0?Reflect.ownKeys(this._events):[]}},{}],108:[function(t,e,r){(function(e){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   v4.2.8+1e68dce6
 */
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
"use strict";var n=Object.getOwnPropertySymbols,a=Object.prototype.hasOwnProperty,i=Object.prototype.propertyIsEnumerable;function o(t){if(null==t)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(t)}e.exports=function(){try{if(!Object.assign)return!1;var t=new String("abc");if(t[5]="de","5"===Object.getOwnPropertyNames(t)[0])return!1;for(var e={},r=0;r<10;r++)e["_"+String.fromCharCode(r)]=r;if("0123456789"!==Object.getOwnPropertyNames(e).map((function(t){return e[t]})).join(""))return!1;var n={};return"abcdefghijklmnopqrst".split("").forEach((function(t){n[t]=t})),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},n)).join("")}catch(t){return!1}}()?Object.assign:function(t,e){for(var r,s,l=o(t),c=1;c<arguments.length;c++){for(var u in r=Object(arguments[c]))a.call(r,u)&&(l[u]=r[u]);if(n){s=n(r);for(var h=0;h<s.length;h++)i.call(r,s[h])&&(l[s[h]]=r[s[h]])}}return l}},{}],453:[function(t,e,r){"use strict";e.exports=function(t,e,r,n,a,i,o,s,l,c){var u=e+i+c;if(h>0){var h=Math.sqrt(u+1);t[0]=.5*(o-l)/h,t[1]=.5*(s-n)/h,t[2]=.5*(r-i)/h,t[3]=.5*h}else{var f=Math.max(e,i,c);h=Math.sqrt(2*f-u+1);e>=f?(t[0]=.5*h,t[1]=.5*(a+r)/h,t[2]=.5*(s+n)/h,t[3]=.5*(o-l)/h):i>=f?(t[0]=.5*(r+a)/h,t[1]=.5*h,t[2]=.5*(l+o)/h,t[3]=.5*(s-n)/h):(t[0]=.5*(n+s)/h,t[1]=.5*(o+l)/h,t[2]=.5*h,t[3]=.5*(r-a)/h)}return t}},{}],454:[function(t,e,r){"use strict";e.exports=function(t){var e=(t=t||{}).center||[0,0,0],r=t.rotation||[0,0,0,1],n=t.radius||1;e=[].slice.call(e,0,3),u(r=[].slice.call(r,0,4),r);var a=new h(r,e,Math.log(n));a.setDistanceLimits(t.zoomMin,t.zoomMax),("eye"in t||"up"in t)&&a.lookAt(0,t.eye,t.center,t.up);return a};var n=t("filtered-vector"),a=t("gl-mat4/lookAt"),i=t("gl-mat4/fromQuat"),o=t("gl-mat4/invert"),s=t("./lib/quatFromFrame");function l(t,e,r){return Math.sqrt(Math.pow(t,2)+Math.pow(e,2)+Math.pow(r,2))}function c(t,e,r,n){return Math.sqrt(Math.pow(t,2)+Math.pow(e,2)+Math.pow(r,2)+Math.pow(n,2))}function u(t,e){var r=e[0],n=e[1],a=e[2],i=e[3],o=c(r,n,a,i);o>1e-6?(t[0]=r/o,t[1]=n/o,t[2]=a/o,t[3]=i/o):(t[0]=t[1]=t[2]=0,t[3]=1)}function h(t,e,r){this.radius=n([r]),this.center=n(e),this.rotation=n(t),this.computedRadius=this.radius.curve(0),this.computedCenter=this.center.curve(0),this.computedRotation=this.rotation.curve(0),this.computedUp=[.1,0,0],this.computedEye=[.1,0,0],this.computedMatrix=[.1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],this.recalcMatrix(0)}var f=h.prototype;f.lastT=function(){return Math.max(this.radius.lastT(),this.center.lastT(),this.rotation.lastT())},f.recalcMatrix=function(t){this.radius.curve(t),this.center.curve(t),this.rotation.curve(t);var e=this.computedRotation;u(e,e);var r=this.computedMatrix;i(r,e);var n=this.computedCenter,a=this.computedEye,o=this.computedUp,s=Math.exp(this.computedRadius[0]);a[0]=n[0]+s*r[2],a[1]=n[1]+s*r[6],a[2]=n[2]+s*r[10],o[0]=r[1],o[1]=r[5],o[2]=r[9];for(var l=0;l<3;++l){for(var c=0,h=0;h<3;++h)c+=r[l+4*h]*a[h];r[12+l]=-c}},f.getMatrix=function(t,e){this.recalcMatrix(t);var r=this.computedMatrix;if(e){for(var n=0;n<16;++n)e[n]=r[n];return e}return r},f.idle=function(t){this.center.idle(t),this.radius.idle(t),this.rotation.idle(t)},f.flush=function(t){this.center.flush(t),this.radius.flush(t),this.rotation.flush(t)},f.pan=function(t,e,r,n){e=e||0,r=r||0,n=n||0,this.recalcMatrix(t);var a=this.computedMatrix,i=a[1],o=a[5],s=a[9],c=l(i,o,s);i/=c,o/=c,s/=c;var u=a[0],h=a[4],f=a[8],p=u*i+h*o+f*s,d=l(u-=i*p,h-=o*p,f-=s*p);u/=d,h/=d,f/=d;var g=a[2],m=a[6],v=a[10],y=g*i+m*o+v*s,x=g*u+m*h+v*f,b=l(g-=y*i+x*u,m-=y*o+x*h,v-=y*s+x*f);g/=b,m/=b,v/=b;var _=u*e+i*r,w=h*e+o*r,T=f*e+s*r;this.center.move(t,_,w,T);var k=Math.exp(this.computedRadius[0]);k=Math.max(1e-4,k+n),this.radius.set(t,Math.log(k))},f.rotate=function(t,e,r,n){this.recalcMatrix(t),e=e||0,r=r||0;var a=this.computedMatrix,i=a[0],o=a[4],s=a[8],u=a[1],h=a[5],f=a[9],p=a[2],d=a[6],g=a[10],m=e*i+r*u,v=e*o+r*h,y=e*s+r*f,x=-(d*y-g*v),b=-(g*m-p*y),_=-(p*v-d*m),w=Math.sqrt(Math.max(0,1-Math.pow(x,2)-Math.pow(b,2)-Math.pow(_,2))),T=c(x,b,_,w);T>1e-6?(x/=T,b/=T,_/=T,w/=T):(x=b=_=0,w=1);var k=this.computedRotation,A=k[0],M=k[1],S=k[2],E=k[3],C=A*w+E*x+M*_-S*b,L=M*w+E*b+S*x-A*_,P=S*w+E*_+A*b-M*x,I=E*w-A*x-M*b-S*_;if(n){x=p,b=d,_=g;var z=Math.sin(n)/l(x,b,_);x*=z,b*=z,_*=z,I=I*(w=Math.cos(e))-(C=C*w+I*x+L*_-P*b)*x-(L=L*w+I*b+P*x-C*_)*b-(P=P*w+I*_+C*b-L*x)*_}var O=c(C,L,P,I);O>1e-6?(C/=O,L/=O,P/=O,I/=O):(C=L=P=0,I=1),this.rotation.set(t,C,L,P,I)},f.lookAt=function(t,e,r,n){this.recalcMatrix(t),r=r||this.computedCenter,e=e||this.computedEye,n=n||this.computedUp;var i=this.computedMatrix;a(i,e,r,n);var o=this.computedRotation;s(o,i[0],i[1],i[2],i[4],i[5],i[6],i[8],i[9],i[10]),u(o,o),this.rotation.set(t,o[0],o[1],o[2],o[3]);for(var l=0,c=0;c<3;++c)l+=Math.pow(r[c]-e[c],2);this.radius.set(t,.5*Math.log(Math.max(l,1e-6))),this.center.set(t,r[0],r[1],r[2])},f.translate=function(t,e,r,n){this.center.move(t,e||0,r||0,n||0)},f.setMatrix=function(t,e){var r=this.computedRotation;s(r,e[0],e[1],e[2],e[4],e[5],e[6],e[8],e[9],e[10]),u(r,r),this.rotation.set(t,r[0],r[1],r[2],r[3]);var n=this.computedMatrix;o(n,e);var a=n[15];if(Math.abs(a)>1e-6){var i=n[12]/a,l=n[13]/a,c=n[14]/a;this.recalcMatrix(t);var h=Math.exp(this.computedRadius[0]);this.center.set(t,i-n[2]*h,l-n[6]*h,c-n[10]*h),this.radius.idle(t)}else this.center.idle(t),this.radius.idle(t)},f.setDistance=function(t,e){e>0&&this.radius.set(t,Math.log(e))},f.setDistanceLimits=function(t,e){t=t>0?Math.log(t):-1/0,e=e>0?Math.log(e):1/0,e=Math.max(e,t),this.radius.bounds[0][0]=t,this.radius.bounds[1][0]=e},f.getDistanceLimits=function(t){var e=this.radius.bounds;return t?(t[0]=Math.exp(e[0][0]),t[1]=Math.exp(e[1][0]),t):[Math.exp(e[0][0]),Math.exp(e[1][0])]},f.toJSON=function(){return this.recalcMatrix(this.lastT()),{center:this.computedCenter.slice(),rotation:this.computedRotation.slice(),distance:Math.log(this.computedRadius[0]),zoomMin:this.radius.bounds[0][0],zoomMax:this.radius.bounds[1][0]}},f.fromJSON=function(t){var e=this.lastT(),r=t.center;r&&this.center.set(e,r[0],r[1],r[2]);var n=t.rotation;n&&this.rotation.set(e,n[0],n[1],n[2],n[3]);var a=t.distance;a&&a>0&&this.radius.set(e,Math.log(a)),this.setDistanceLimits(t.zoomMin,t.zoomMax)}},{"./lib/quatFromFrame":453,"filtered-vector":237,"gl-mat4/fromQuat":270,"gl-mat4/invert":273,"gl-mat4/lookAt":274}],455:[function(t,e,r){
/*!
 * pad-left <https://github.com/jonschlinkert/pad-left>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT license.
 */
"use strict";var n=t("repeat-string");e.exports=function(t,e,r){return n(r="undefined"!=typeof r?r+"":" ",e)+t}},{"repeat-string":493}],456:[function(t,e,r){"use strict";function n(t,e){if("string"!=typeof t)return[t];var r=[t];"string"==typeof e||Array.isArray(e)?e={brackets:e}:e||(e={});var n=e.brackets?Array.isArray(e.brackets)?e.brackets:[e.brackets]:["{}","[]","()"],a=e.escape||"___",i=!!e.flat;n.forEach((function(t){var e=new RegExp(["\\",t[0],"[^\\",t[0],"\\",t[1],"]*\\",t[1]].join("")),n=[];function i(e,i,o){var s=r.push(e.slice(t[0].length,-t[1].length))-1;return n.push(s),a+s+a}r.forEach((function(t,n){for(var a,o=0;t!=a;)if(a=t,t=t.replace(e,i),o++>1e4)throw Error("References have circular dependency. Please, check them.");r[n]=t})),n=n.reverse(),r=r.map((function(e){return n.forEach((function(r){e=e.replace(new RegExp("(\\"+a+r+"\\"+a+")","g"),t[0]+"$1"+t[1])})),e}))}));var o=new RegExp("\\"+a+"([0-9]+)\\"+a);return i?r:function t(e,r,n){for(var a,i=[],s=0;a=o.exec(e);){if(s++>1e4)throw Error("Circular references in parenthesis");i.push(e.slice(0,a.index)),i.push(t(r[a[1]],r)),e=e.slice(a.index+a[0].length)}return i.push(e),i}(r[0],r)}function a(t,e){if(e&&e.flat){var r,n=e&&e.escape||"___",a=t[0];if(!a)return"";for(var i=new RegExp("\\"+n+"([0-9]+)\\"+n),o=0;a!=r;){if(o++>1e4)throw Error("Circular references in "+t);r=a,a=a.replace(i,s)}return a}return t.reduce((function t(e,r){return Array.isArray(r)&&(r=r.reduce(t,"")),e+r}),"");function s(e,r){if(null==t[r])throw Error("Reference "+r+"is undefined");return t[r]}}function i(t,e){return Array.isArray(t)?a(t,e):n(t,e)}i.parse=n,i.stringify=a,e.exports=i},{}],457:[function(t,e,r){"use strict";var n=t("pick-by-alias");e.exports=function(t){var e;arguments.length>1&&(t=arguments);"string"==typeof t?t=t.split(/\s/).map(parseFloat):"number"==typeof t&&(t=[t]);t.length&&"number"==typeof t[0]?e=1===t.length?{width:t[0],height:t[0],x:0,y:0}:2===t.length?{width:t[0],height:t[1],x:0,y:0}:{x:t[0],y:t[1],width:t[2]-t[0]||0,height:t[3]-t[1]||0}:t&&(t=n(t,{left:"x l left Left",top:"y t top Top",width:"w width W Width",height:"h height W Width",bottom:"b bottom Bottom",right:"r right Right"}),e={x:t.left||0,y:t.top||0},null==t.width?t.right?e.width=t.right-e.x:e.width=0:e.width=t.width,null==t.height?t.bottom?e.height=t.bottom-e.y:e.height=0:e.height=t.height);return e}},{"pick-by-alias":463}],458:[function(t,e,r){e.exports=function(t){var e=[];return t.replace(a,(function(t,r,a){var o=r.toLowerCase();for(a=function(t){var e=t.match(i);return e?e.map(Number):[]}(a),"m"==o&&a.length>2&&(e.push([r].concat(a.splice(0,2))),o="l",r="m"==r?"l":"L");;){if(a.length==n[o])return a.unshift(r),e.push(a);if(a.length<n[o])throw new Error("malformed path data");e.push([r].concat(a.splice(0,n[o])))}})),e};var n={a:7,c:6,h:1,l:2,m:2,q:4,s:4,t:2,v:1,z:0},a=/([astvzqmhlc])([^astvzqmhlc]*)/gi;var i=/-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/gi},{}],459:[function(t,e,r){e.exports=function(t,e){e||(e=[0,""]),t=String(t);var r=parseFloat(t,10);return e[0]=r,e[1]=t.match(/[\d.\-\+]*\s*(.*)/)[1]||"",e}},{}],460:[function(t,e,r){(function(t){(function(){var r,n,a,i,o,s;"undefined"!=typeof performance&&null!==performance&&performance.now?e.exports=function(){return performance.now()}:"undefined"!=typeof t&&null!==t&&t.hrtime?(e.exports=function(){return(r()-o)/1e6},n=t.hrtime,i=(r=function(){var t;return 1e9*(t=n())[0]+t[1]})(),s=1e9*t.uptime(),o=i-s):Date.now?(e.exports=function(){return Date.now()-a},a=Date.now()):(e.exports=function(){return(new Date).getTime()-a},a=(new Date).getTime())}).call(this)}).call(this,t("_process"))},{_process:480}],461:[function(t,e,r){"use strict";e.exports=function(t){var e=t.length;if(e<32){for(var r=1,a=0;a<e;++a)for(var i=0;i<a;++i)if(t[a]<t[i])r=-r;else if(t[a]===t[i])return 0;return r}var o=n.mallocUint8(e);for(a=0;a<e;++a)o[a]=0;for(r=1,a=0;a<e;++a)if(!o[a]){var s=1;o[a]=1;for(i=t[a];i!==a;i=t[i]){if(o[i])return n.freeUint8(o),0;s+=1,o[i]=1}1&s||(r=-r)}return n.freeUint8(o),r};var n=t("typedarray-pool")},{"typedarray-pool":547}],462:[function(t,e,r){"use strict";var n=t("typedarray-pool"),a=t("invert-permutation");r.rank=function(t){var e=t.length;switch(e){case 0:case 1:return 0;case 2:return t[1]}var r,i,o,s=n.mallocUint32(e),l=n.mallocUint32(e),c=0;for(a(t,l),o=0;o<e;++o)s[o]=t[o];for(o=e-1;o>0;--o)i=l[o],r=s[o],s[o]=s[i],s[i]=r,l[o]=l[r],l[r]=i,c=(c+r)*o;return n.freeUint32(l),n.freeUint32(s),c},r.unrank=function(t,e,r){switch(t){case 0:return r||[];case 1:return r?(r[0]=0,r):[0];case 2:return r?(e?(r[0]=0,r[1]=1):(r[0]=1,r[1]=0),r):e?[0,1]:[1,0]}var n,a,i,o=1;for((r=r||new Array(t))[0]=0,i=1;i<t;++i)r[i]=i,o=o*i|0;for(i=t-1;i>0;--i)e=e-(n=e/o|0)*o|0,o=o/i|0,a=0|r[i],r[i]=0|r[n],r[n]=0|a;return r}},{"invert-permutation":415,"typedarray-pool":547}],463:[function(t,e,r){"use strict";e.exports=function(t,e,r){var n,i,o={};if("string"==typeof e&&(e=a(e)),Array.isArray(e)){var s={};for(i=0;i<e.length;i++)s[e[i]]=!0;e=s}for(n in e)e[n]=a(e[n]);var l={};for(n in e){var c=e[n];if(Array.isArray(c))for(i=0;i<c.length;i++){var u=c[i];if(r&&(l[u]=!0),u in t){if(o[n]=t[u],r)for(var h=i;h<c.length;h++)l[c[h]]=!0;break}}else n in t&&(e[n]&&(o[n]=t[n]),r&&(l[n]=!0))}if(r)for(n in t)l[n]||(o[n]=t[n]);return o};var n={};function a(t){return n[t]?n[t]:("string"==typeof t&&(t=n[t]=t.split(/\s*,\s*|\s+/)),t)}},{}],464:[function(t,e,r){"use strict";e.exports=function(t,e){for(var r=0|e.length,a=t.length,i=[new Array(r),new Array(r)],o=0;o<r;++o)i[0][o]=[],i[1][o]=[];for(o=0;o<a;++o){var s=t[o];i[0][s[0]].push(s),i[1][s[1]].push(s)}var l=[];for(o=0;o<r;++o)i[0][o].length+i[1][o].length===0&&l.push([o]);function c(t,e){var r=i[e][t[e]];r.splice(r.indexOf(t),1)}function u(t,r,a){for(var o,s,l,u=0;u<2;++u)if(i[u][r].length>0){o=i[u][r][0],l=u;break}s=o[1^l];for(var h=0;h<2;++h)for(var f=i[h][r],p=0;p<f.length;++p){var d=f[p],g=d[1^h];n(e[t],e[r],e[s],e[g])>0&&(o=d,s=g,l=h)}return a||o&&c(o,l),s}function h(t,r){var a=i[r][t][0],o=[t];c(a,r);for(var s=a[1^r];;){for(;s!==t;)o.push(s),s=u(o[o.length-2],s,!1);if(i[0][t].length+i[1][t].length===0)break;var l=o[o.length-1],h=t,f=o[1],p=u(l,h,!0);if(n(e[l],e[h],e[f],e[p])<0)break;o.push(t),s=u(l,h)}return o}function f(t,e){return e[1]===e[e.length-1]}for(o=0;o<r;++o)for(var p=0;p<2;++p){for(var d=[];i[p][o].length>0;){i[0][o].length;var g=h(o,p);f(0,g)?d.push.apply(d,g):(d.length>0&&l.push(d),d=g)}d.length>0&&l.push(d)}return l};var n=t("compare-angle")},{"compare-angle":129}],465:[function(t,e,r){"use strict";e.exports=function(t,e){for(var r=n(t,e.length),a=new Array(e.length),i=new Array(e.length),o=[],s=0;s<e.length;++s){var l=r[s].length;i[s]=l,a[s]=!0,l<=1&&o.push(s)}for(;o.length>0;){var c=o.pop();a[c]=!1;var u=r[c];for(s=0;s<u.length;++s){var h=u[s];0==--i[h]&&o.push(h)}}var f=new Array(e.length),p=[];for(s=0;s<e.length;++s)if(a[s]){c=p.length;f[s]=c,p.push(e[s])}else f[s]=-1;var d=[];for(s=0;s<t.length;++s){var g=t[s];a[g[0]]&&a[g[1]]&&d.push([f[g[0]],f[g[1]]])}return[d,p]};var n=t("edges-to-adjacency-list")},{"edges-to-adjacency-list":173}],466:[function(t,e,r){"use strict";e.exports=function(t,e){var r=c(t,e);t=r[0];for(var h=(e=r[1]).length,f=(t.length,n(t,e.length)),p=0;p<h;++p)if(f[p].length%2==1)throw new Error("planar-graph-to-polyline: graph must be manifold");var d=a(t,e);var g=(d=d.filter((function(t){for(var r=t.length,n=[0],a=0;a<r;++a){var i=e[t[a]],l=e[t[(a+1)%r]],c=o(-i[0],i[1]),u=o(-i[0],l[1]),h=o(l[0],i[1]),f=o(l[0],l[1]);n=s(n,s(s(c,u),s(h,f)))}return n[n.length-1]>0}))).length,m=new Array(g),v=new Array(g);for(p=0;p<g;++p){m[p]=p;var y=new Array(g),x=d[p].map((function(t){return e[t]})),b=i([x]),_=0;t:for(var w=0;w<g;++w)if(y[w]=0,p!==w){for(var T=(q=d[w]).length,k=0;k<T;++k){var A=b(e[q[k]]);if(0!==A){A<0&&(y[w]=1,_+=1);continue t}}y[w]=1,_+=1}v[p]=[_,p,y]}v.sort((function(t,e){return e[0]-t[0]}));for(p=0;p<g;++p){var M=(y=v[p])[1],S=y[2];for(w=0;w<g;++w)S[w]&&(m[w]=M)}var E=function(t){for(var e=new Array(t),r=0;r<t;++r)e[r]=[];return e}(g);for(p=0;p<g;++p)E[p].push(m[p]),E[m[p]].push(p);var C={},L=u(h,!1);for(p=0;p<g;++p)for(T=(q=d[p]).length,w=0;w<T;++w){var P=q[w],I=q[(w+1)%T],z=Math.min(P,I)+":"+Math.max(P,I);if(z in C){var O=C[z];E[O].push(p),E[p].push(O),L[P]=L[I]=!0}else C[z]=p}function D(t){for(var e=t.length,r=0;r<e;++r)if(!L[t[r]])return!1;return!0}var R=[],F=u(g,-1);for(p=0;p<g;++p)m[p]!==p||D(d[p])?F[p]=-1:(R.push(p),F[p]=0);r=[];for(;R.length>0;){var B=R.pop(),N=E[B];l(N,(function(t,e){return t-e}));var j,V=N.length,U=F[B];if(0===U){var q=d[B];j=[q]}for(p=0;p<V;++p){var H=N[p];if(!(F[H]>=0))if(F[H]=1^U,R.push(H),0===U)D(q=d[H])||(q.reverse(),j.push(q))}0===U&&r.push(j)}return r};var n=t("edges-to-adjacency-list"),a=t("planar-dual"),i=t("point-in-big-polygon"),o=t("two-product"),s=t("robust-sum"),l=t("uniq"),c=t("./lib/trim-leaves");function u(t,e){for(var r=new Array(t),n=0;n<t;++n)r[n]=e;return r}},{"./lib/trim-leaves":465,"edges-to-adjacency-list":173,"planar-dual":464,"point-in-big-polygon":470,"robust-sum":505,"two-product":534,uniq:549}],467:[function(t,e,r){"use strict";e.exports=t("./quad")},{"./quad":468}],468:[function(t,e,r){"use strict";var n=t("binary-search-bounds"),a=t("clamp"),i=t("parse-rect"),o=t("array-bounds"),s=t("pick-by-alias"),l=t("defined"),c=t("flatten-vertex-data"),u=t("is-obj"),h=t("dtype"),f=t("math-log2");function p(t,e){for(var r=e[0],n=e[1],i=1/(e[2]-r),o=1/(e[3]-n),s=new Array(t.length),l=0,c=t.length/2;l<c;l++)s[2*l]=a((t[2*l]-r)*i,0,1),s[2*l+1]=a((t[2*l+1]-n)*o,0,1);return s}e.exports=function(t,e){e||(e={}),t=c(t,"float64"),e=s(e,{bounds:"range bounds dataBox databox",maxDepth:"depth maxDepth maxdepth level maxLevel maxlevel levels",dtype:"type dtype format out dst output destination"});var r=l(e.maxDepth,255),a=l(e.bounds,o(t,2));a[0]===a[2]&&a[2]++,a[1]===a[3]&&a[3]++;var d,g=p(t,a),m=t.length>>>1;e.dtype||(e.dtype="array"),"string"==typeof e.dtype?d=new(h(e.dtype))(m):e.dtype&&(d=e.dtype,Array.isArray(d)&&(d.length=m));for(var v=0;v<m;++v)d[v]=v;var y=[],x=[],b=[],_=[];!function t(e,n,a,i,o,s){if(!i.length)return null;var l=y[o]||(y[o]=[]),c=b[o]||(b[o]=[]),u=x[o]||(x[o]=[]),h=l.length;if(++o>r||s>1073741824){for(var f=0;f<i.length;f++)l.push(i[f]),c.push(s),u.push(null,null,null,null);return h}if(l.push(i[0]),c.push(s),i.length<=1)return u.push(null,null,null,null),h;for(var p=.5*a,d=e+p,m=n+p,v=[],_=[],w=[],T=[],k=1,A=i.length;k<A;k++){var M=i[k],S=g[2*M],E=g[2*M+1];S<d?E<m?v.push(M):_.push(M):E<m?w.push(M):T.push(M)}return s<<=2,u.push(t(e,n,p,v,o,s),t(e,m,p,_,o,s+1),t(d,n,p,w,o,s+2),t(d,m,p,T,o,s+3)),h}(0,0,1,d,0,1);for(var w=0,T=0;T<y.length;T++){var k=y[T];if(d.set)d.set(k,w);else for(var A=0,M=k.length;A<M;A++)d[A+w]=k[A];var S=w+y[T].length;_[T]=[w,S],w=S}return d.range=function(){var e,r=[],n=arguments.length;for(;n--;)r[n]=arguments[n];if(u(r[r.length-1])){var o=r.pop();r.length||null==o.x&&null==o.l&&null==o.left||(r=[o],e={}),e=s(o,{level:"level maxLevel",d:"d diam diameter r radius px pxSize pixel pixelSize maxD size minSize",lod:"lod details ranges offsets"})}else e={};r.length||(r=a);var c=i.apply(void 0,r),h=[Math.min(c.x,c.x+c.width),Math.min(c.y,c.y+c.height),Math.max(c.x,c.x+c.width),Math.max(c.y,c.y+c.height)],d=h[0],g=h[1],m=h[2],v=h[3],b=p([d,g,m,v],a),_=b[0],w=b[1],T=b[2],k=b[3],A=l(e.level,y.length);if(null!=e.d){var M;"number"==typeof e.d?M=[e.d,e.d]:e.d.length&&(M=e.d),A=Math.min(Math.max(Math.ceil(-f(Math.abs(M[0])/(a[2]-a[0]))),Math.ceil(-f(Math.abs(M[1])/(a[3]-a[1])))),A)}if(A=Math.min(A,y.length),e.lod)return E(_,w,T,k,A);var S=[];function C(e,r,n,a,i,o){if(null!==i&&null!==o&&!(_>e+n||w>r+n||T<e||k<r||a>=A||i===o)){var s=y[a];void 0===o&&(o=s.length);for(var l=i;l<o;l++){var c=s[l],u=t[2*c],h=t[2*c+1];u>=d&&u<=m&&h>=g&&h<=v&&S.push(c)}var f=x[a],p=f[4*i+0],b=f[4*i+1],M=f[4*i+2],E=f[4*i+3],P=L(f,i+1),I=.5*n,z=a+1;C(e,r,I,z,p,b||M||E||P),C(e,r+I,I,z,b,M||E||P),C(e+I,r,I,z,M,E||P),C(e+I,r+I,I,z,E,P)}}function L(t,e){for(var r=null,n=0;null===r;)if(r=t[4*e+n],++n>t.length)return null;return r}return C(0,0,1,0,0,1),S},d;function E(t,e,r,a,i){for(var o=[],s=0;s<i;s++){var l=b[s],c=_[s][0],u=C(t,e,s),h=C(r,a,s),f=n.ge(l,u),p=n.gt(l,h,f,l.length-1);o[s]=[f+c,p+c]}return o}function C(t,e,r){for(var n=1,a=.5,i=.5,o=.5,s=0;s<r;s++)n<<=2,n+=t<a?e<i?0:1:e<i?2:3,o*=.5,a+=t<a?-o:o,i+=e<i?-o:o;return n}}},{"array-bounds":68,"binary-search-bounds":94,clamp:117,defined:165,dtype:170,"flatten-vertex-data":239,"is-obj":421,"math-log2":432,"parse-rect":457,"pick-by-alias":463}],469:[function(t,e,r){arguments[4][238][0].apply(r,arguments)},{dup:238}],470:[function(t,e,r){e.exports=function(t){for(var e=t.length,r=[],i=[],s=0;s<e;++s)for(var u=t[s],h=u.length,f=h-1,p=0;p<h;f=p++){var d=u[f],g=u[p];d[0]===g[0]?i.push([d,g]):r.push([d,g])}if(0===r.length)return 0===i.length?c:(m=l(i),function(t){return m(t[0],t[1])?0:1});var m;var v=a(r),y=function(t,e){return function(r){var a=o.le(e,r[0]);if(a<0)return 1;var i=t[a];if(!i){if(!(a>0&&e[a]===r[0]))return 1;i=t[a-1]}for(var s=1;i;){var l=i.key,c=n(r,l[0],l[1]);if(l[0][0]<l[1][0])if(c<0)i=i.left;else{if(!(c>0))return 0;s=-1,i=i.right}else if(c>0)i=i.left;else{if(!(c<0))return 0;s=1,i=i.right}}return s}}(v.slabs,v.coordinates);return 0===i.length?y:function(t,e){return function(r){return t(r[0],r[1])?0:e(r)}}(l(i),y)};var n=t("robust-orientation")[3],a=t("slab-decomposition"),i=t("interval-tree-1d"),o=t("binary-search-bounds");function s(){return!0}function l(t){for(var e={},r=0;r<t.length;++r){var n=t[r],a=n[0][0],o=n[0][1],l=n[1][1],c=[Math.min(o,l),Math.max(o,l)];a in e?e[a].push(c):e[a]=[c]}var u={},h=Object.keys(e);for(r=0;r<h.length;++r){var f=e[h[r]];u[h[r]]=i(f)}return function(t){return function(e,r){var n=t[e];return!!n&&!!n.queryPoint(r,s)}}(u)}function c(t){return 1}},{"binary-search-bounds":469,"interval-tree-1d":413,"robust-orientation":500,"slab-decomposition":517}],471:[function(t,e,r){
/*
 * @copyright 2016 Sean Connelly (@voidqk), http://syntheti.cc
 * @license MIT
 * @preserve Project Home: https://github.com/voidqk/polybooljs
 */
var n,a=t("./lib/build-log"),i=t("./lib/epsilon"),o=t("./lib/intersecter"),s=t("./lib/segment-chainer"),l=t("./lib/segment-selector"),c=t("./lib/geojson"),u=!1,h=i();function f(t,e,r){var a=n.segments(t),i=n.segments(e),o=r(n.combine(a,i));return n.polygon(o)}n={buildLog:function(t){return!0===t?u=a():!1===t&&(u=!1),!1!==u&&u.list},epsilon:function(t){return h.epsilon(t)},segments:function(t){var e=o(!0,h,u);return t.regions.forEach(e.addRegion),{segments:e.calculate(t.inverted),inverted:t.inverted}},combine:function(t,e){return{combined:o(!1,h,u).calculate(t.segments,t.inverted,e.segments,e.inverted),inverted1:t.inverted,inverted2:e.inverted}},selectUnion:function(t){return{segments:l.union(t.combined,u),inverted:t.inverted1||t.inverted2}},selectIntersect:function(t){return{segments:l.intersect(t.combined,u),inverted:t.inverted1&&t.inverted2}},selectDifference:function(t){return{segments:l.difference(t.combined,u),inverted:t.inverted1&&!t.inverted2}},selectDifferenceRev:function(t){return{segments:l.differenceRev(t.combined,u),inverted:!t.inverted1&&t.inverted2}},selectXor:function(t){return{segments:l.xor(t.combined,u),inverted:t.inverted1!==t.inverted2}},polygon:function(t){return{regions:s(t.segments,h,u),inverted:t.inverted}},polygonFromGeoJSON:function(t){return c.toPolygon(n,t)},polygonToGeoJSON:function(t){return c.fromPolygon(n,h,t)},union:function(t,e){return f(t,e,n.selectUnion)},intersect:function(t,e){return f(t,e,n.selectIntersect)},difference:function(t,e){return f(t,e,n.selectDifference)},differenceRev:function(t,e){return f(t,e,n.selectDifferenceRev)},xor:function(t,e){return f(t,e,n.selectXor)}},"object"==typeof window&&(window.PolyBool=n),e.exports=n},{"./lib/build-log":472,"./lib/epsilon":473,"./lib/geojson":474,"./lib/intersecter":475,"./lib/segment-chainer":477,"./lib/segment-selector":478}],472:[function(t,e,r){e.exports=function(){var t,e=0,r=!1;function n(e,r){return t.list.push({type:e,data:r?JSON.parse(JSON.stringify(r)):void 0}),t}return t={list:[],segmentId:function(){return e++},checkIntersection:function(t,e){return n("check",{seg1:t,seg2:e})},segmentChop:function(t,e){return n("div_seg",{seg:t,pt:e}),n("chop",{seg:t,pt:e})},statusRemove:function(t){return n("pop_seg",{seg:t})},segmentUpdate:function(t){return n("seg_update",{seg:t})},segmentNew:function(t,e){return n("new_seg",{seg:t,primary:e})},segmentRemove:function(t){return n("rem_seg",{seg:t})},tempStatus:function(t,e,r){return n("temp_status",{seg:t,above:e,below:r})},rewind:function(t){return n("rewind",{seg:t})},status:function(t,e,r){return n("status",{seg:t,above:e,below:r})},vert:function(e){return e===r?t:(r=e,n("vert",{x:e}))},log:function(t){return"string"!=typeof t&&(t=JSON.stringify(t,!1,"  ")),n("log",{txt:t})},reset:function(){return n("reset")},selected:function(t){return n("selected",{segs:t})},chainStart:function(t){return n("chain_start",{seg:t})},chainRemoveHead:function(t,e){return n("chain_rem_head",{index:t,pt:e})},chainRemoveTail:function(t,e){return n("chain_rem_tail",{index:t,pt:e})},chainNew:function(t,e){return n("chain_new",{pt1:t,pt2:e})},chainMatch:function(t){return n("chain_match",{index:t})},chainClose:function(t){return n("chain_close",{index:t})},chainAddHead:function(t,e){return n("chain_add_head",{index:t,pt:e})},chainAddTail:function(t,e){return n("chain_add_tail",{index:t,pt:e})},chainConnect:function(t,e){return n("chain_con",{index1:t,index2:e})},chainReverse:function(t){return n("chain_rev",{index:t})},chainJoin:function(t,e){return n("chain_join",{index1:t,index2:e})},done:function(){return n("done")}}}},{}],473:[function(t,e,r){e.exports=function(t){"number"!=typeof t&&(t=1e-10);var e={epsilon:function(e){return"number"==typeof e&&(t=e),t},pointAboveOrOnLine:function(e,r,n){var a=r[0],i=r[1],o=n[0],s=n[1],l=e[0];return(o-a)*(e[1]-i)-(s-i)*(l-a)>=-t},pointBetween:function(e,r,n){var a=e[1]-r[1],i=n[0]-r[0],o=e[0]-r[0],s=n[1]-r[1],l=o*i+a*s;return!(l<t)&&!(l-(i*i+s*s)>-t)},pointsSameX:function(e,r){return Math.abs(e[0]-r[0])<t},pointsSameY:function(e,r){return Math.abs(e[1]-r[1])<t},pointsSame:function(t,r){return e.pointsSameX(t,r)&&e.pointsSameY(t,r)},pointsCompare:function(t,r){return e.pointsSameX(t,r)?e.pointsSameY(t,r)?0:t[1]<r[1]?-1:1:t[0]<r[0]?-1:1},pointsCollinear:function(e,r,n){var a=e[0]-r[0],i=e[1]-r[1],o=r[0]-n[0],s=r[1]-n[1];return Math.abs(a*s-o*i)<t},linesIntersect:function(e,r,n,a){var i=r[0]-e[0],o=r[1]-e[1],s=a[0]-n[0],l=a[1]-n[1],c=i*l-o*s;if(Math.abs(c)<t)return!1;var u=e[0]-n[0],h=e[1]-n[1],f=(s*h-l*u)/c,p=(i*h-o*u)/c,d={alongA:0,alongB:0,pt:[e[0]+f*i,e[1]+f*o]};return d.alongA=f<=-t?-2:f<t?-1:f-1<=-t?0:f-1<t?1:2,d.alongB=p<=-t?-2:p<t?-1:p-1<=-t?0:p-1<t?1:2,d},pointInsideRegion:function(e,r){for(var n=e[0],a=e[1],i=r[r.length-1][0],o=r[r.length-1][1],s=!1,l=0;l<r.length;l++){var c=r[l][0],u=r[l][1];u-a>t!=o-a>t&&(i-c)*(a-u)/(o-u)+c-n>t&&(s=!s),i=c,o=u}return s}};return e}},{}],474:[function(t,e,r){var n={toPolygon:function(t,e){function r(e){if(e.length<=0)return t.segments({inverted:!1,regions:[]});function r(e){var r=e.slice(0,e.length-1);return t.segments({inverted:!1,regions:[r]})}for(var n=r(e[0]),a=1;a<e.length;a++)n=t.selectDifference(t.combine(n,r(e[a])));return n}if("Polygon"===e.type)return t.polygon(r(e.coordinates));if("MultiPolygon"===e.type){for(var n=t.segments({inverted:!1,regions:[]}),a=0;a<e.coordinates.length;a++)n=t.selectUnion(t.combine(n,r(e.coordinates[a])));return t.polygon(n)}throw new Error("PolyBool: Cannot convert GeoJSON object to PolyBool polygon")},fromPolygon:function(t,e,r){function n(t,r){return e.pointInsideRegion([.5*(t[0][0]+t[1][0]),.5*(t[0][1]+t[1][1])],r)}function a(t){return{region:t,children:[]}}r=t.polygon(t.segments(r));var i=a(null);function o(t,e){for(var r=0;r<t.children.length;r++){if(n(e,(s=t.children[r]).region))return void o(s,e)}var i=a(e);for(r=0;r<t.children.length;r++){var s;n((s=t.children[r]).region,e)&&(i.children.push(s),t.children.splice(r,1),r--)}t.children.push(i)}for(var s=0;s<r.regions.length;s++){var l=r.regions[s];l.length<3||o(i,l)}function c(t,e){for(var r=0,n=t[t.length-1][0],a=t[t.length-1][1],i=[],o=0;o<t.length;o++){var s=t[o][0],l=t[o][1];i.push([s,l]),r+=l*n-s*a,n=s,a=l}return r<0!==e&&i.reverse(),i.push([i[0][0],i[0][1]]),i}var u=[];function h(t){var e=[c(t.region,!1)];u.push(e);for(var r=0;r<t.children.length;r++)e.push(f(t.children[r]))}function f(t){for(var e=0;e<t.children.length;e++)h(t.children[e]);return c(t.region,!0)}for(s=0;s<i.children.length;s++)h(i.children[s]);return u.length<=0?{type:"Polygon",coordinates:[]}:1==u.length?{type:"Polygon",coordinates:u[0]}:{type:"MultiPolygon",coordinates:u}}};e.exports=n},{}],475:[function(t,e,r){var n=t("./linked-list");e.exports=function(t,e,r){function a(t,e,n){return{id:r?r.segmentId():-1,start:t,end:e,myFill:{above:n.myFill.above,below:n.myFill.below},otherFill:null}}var i=n.create();function o(t,r){i.insertBefore(t,(function(n){return function(t,r,n,a,i,o){var s=e.pointsCompare(r,i);return 0!==s?s:e.pointsSame(n,o)?0:t!==a?t?1:-1:e.pointAboveOrOnLine(n,a?i:o,a?o:i)?1:-1}(t.isStart,t.pt,r,n.isStart,n.pt,n.other.pt)<0}))}function s(t,e){var r=function(t,e){var r=n.node({isStart:!0,pt:t.start,seg:t,primary:e,other:null,status:null});return o(r,t.end),r}(t,e);return function(t,e,r){var a=n.node({isStart:!1,pt:e.end,seg:e,primary:r,other:t,status:null});t.other=a,o(a,t.pt)}(r,t,e),r}function l(t,e){var n=a(e,t.seg.end,t.seg);return function(t,e){r&&r.segmentChop(t.seg,e),t.other.remove(),t.seg.end=e,t.other.pt=e,o(t.other,t.pt)}(t,e),s(n,t.primary)}function c(a,o){var s=n.create();function c(t){return s.findTransition((function(r){var n,a,i,o,s,l;return(n=t,a=r.ev,i=n.seg.start,o=n.seg.end,s=a.seg.start,l=a.seg.end,e.pointsCollinear(i,s,l)?e.pointsCollinear(o,s,l)||e.pointAboveOrOnLine(o,s,l)?1:-1:e.pointAboveOrOnLine(i,s,l)?1:-1)>0}))}function u(t,n){var a=t.seg,i=n.seg,o=a.start,s=a.end,c=i.start,u=i.end;r&&r.checkIntersection(a,i);var h=e.linesIntersect(o,s,c,u);if(!1===h){if(!e.pointsCollinear(o,s,c))return!1;if(e.pointsSame(o,u)||e.pointsSame(s,c))return!1;var f=e.pointsSame(o,c),p=e.pointsSame(s,u);if(f&&p)return n;var d=!f&&e.pointBetween(o,c,u),g=!p&&e.pointBetween(s,c,u);if(f)return g?l(n,s):l(t,u),n;d&&(p||(g?l(n,s):l(t,u)),l(n,o))}else 0===h.alongA&&(-1===h.alongB?l(t,c):0===h.alongB?l(t,h.pt):1===h.alongB&&l(t,u)),0===h.alongB&&(-1===h.alongA?l(n,o):0===h.alongA?l(n,h.pt):1===h.alongA&&l(n,s));return!1}for(var h=[];!i.isEmpty();){var f=i.getHead();if(r&&r.vert(f.pt[0]),f.isStart){r&&r.segmentNew(f.seg,f.primary);var p=c(f),d=p.before?p.before.ev:null,g=p.after?p.after.ev:null;function m(){if(d){var t=u(f,d);if(t)return t}return!!g&&u(f,g)}r&&r.tempStatus(f.seg,!!d&&d.seg,!!g&&g.seg);var v,y=m();if(y){var x;if(t)(x=null===f.seg.myFill.below||f.seg.myFill.above!==f.seg.myFill.below)&&(y.seg.myFill.above=!y.seg.myFill.above);else y.seg.otherFill=f.seg.myFill;r&&r.segmentUpdate(y.seg),f.other.remove(),f.remove()}if(i.getHead()!==f){r&&r.rewind(f.seg);continue}if(t)x=null===f.seg.myFill.below||f.seg.myFill.above!==f.seg.myFill.below,f.seg.myFill.below=g?g.seg.myFill.above:a,f.seg.myFill.above=x?!f.seg.myFill.below:f.seg.myFill.below;else if(null===f.seg.otherFill)v=g?f.primary===g.primary?g.seg.otherFill.above:g.seg.myFill.above:f.primary?o:a,f.seg.otherFill={above:v,below:v};r&&r.status(f.seg,!!d&&d.seg,!!g&&g.seg),f.other.status=p.insert(n.node({ev:f}))}else{var b=f.status;if(null===b)throw new Error("PolyBool: Zero-length segment detected; your epsilon is probably too small or too large");if(s.exists(b.prev)&&s.exists(b.next)&&u(b.prev.ev,b.next.ev),r&&r.statusRemove(b.ev.seg),b.remove(),!f.primary){var _=f.seg.myFill;f.seg.myFill=f.seg.otherFill,f.seg.otherFill=_}h.push(f.seg)}i.getHead().remove()}return r&&r.done(),h}return t?{addRegion:function(t){for(var n,a,i,o=t[t.length-1],l=0;l<t.length;l++){n=o,o=t[l];var c=e.pointsCompare(n,o);0!==c&&s((a=c<0?n:o,i=c<0?o:n,{id:r?r.segmentId():-1,start:a,end:i,myFill:{above:null,below:null},otherFill:null}),!0)}},calculate:function(t){return c(t,!1)}}:{calculate:function(t,e,r,n){return t.forEach((function(t){s(a(t.start,t.end,t),!0)})),r.forEach((function(t){s(a(t.start,t.end,t),!1)})),c(e,n)}}}},{"./linked-list":476}],476:[function(t,e,r){e.exports={create:function(){var t={root:{root:!0,next:null},exists:function(e){return null!==e&&e!==t.root},isEmpty:function(){return null===t.root.next},getHead:function(){return t.root.next},insertBefore:function(e,r){for(var n=t.root,a=t.root.next;null!==a;){if(r(a))return e.prev=a.prev,e.next=a,a.prev.next=e,void(a.prev=e);n=a,a=a.next}n.next=e,e.prev=n,e.next=null},findTransition:function(e){for(var r=t.root,n=t.root.next;null!==n&&!e(n);)r=n,n=n.next;return{before:r===t.root?null:r,after:n,insert:function(t){return t.prev=r,t.next=n,r.next=t,null!==n&&(n.prev=t),t}}}};return t},node:function(t){return t.prev=null,t.next=null,t.remove=function(){t.prev.next=t.next,t.next&&(t.next.prev=t.prev),t.prev=null,t.next=null},t}}},{}],477:[function(t,e,r){e.exports=function(t,e,r){var n=[],a=[];return t.forEach((function(t){var i=t.start,o=t.end;if(e.pointsSame(i,o))console.warn("PolyBool: Warning: Zero-length segment detected; your epsilon is probably too small or too large");else{r&&r.chainStart(t);for(var s={index:0,matches_head:!1,matches_pt1:!1},l={index:0,matches_head:!1,matches_pt1:!1},c=s,u=0;u<n.length;u++){var h=(m=n[u])[0],f=(m[1],m[m.length-1]);m[m.length-2];if(e.pointsSame(h,i)){if(k(u,!0,!0))break}else if(e.pointsSame(h,o)){if(k(u,!0,!1))break}else if(e.pointsSame(f,i)){if(k(u,!1,!0))break}else if(e.pointsSame(f,o)&&k(u,!1,!1))break}if(c===s)return n.push([i,o]),void(r&&r.chainNew(i,o));if(c===l){r&&r.chainMatch(s.index);var p=s.index,d=s.matches_pt1?o:i,g=s.matches_head,m=n[p],v=g?m[0]:m[m.length-1],y=g?m[1]:m[m.length-2],x=g?m[m.length-1]:m[0],b=g?m[m.length-2]:m[1];return e.pointsCollinear(y,v,d)&&(g?(r&&r.chainRemoveHead(s.index,d),m.shift()):(r&&r.chainRemoveTail(s.index,d),m.pop()),v=y),e.pointsSame(x,d)?(n.splice(p,1),e.pointsCollinear(b,x,v)&&(g?(r&&r.chainRemoveTail(s.index,v),m.pop()):(r&&r.chainRemoveHead(s.index,v),m.shift())),r&&r.chainClose(s.index),void a.push(m)):void(g?(r&&r.chainAddHead(s.index,d),m.unshift(d)):(r&&r.chainAddTail(s.index,d),m.push(d)))}var _=s.index,w=l.index;r&&r.chainConnect(_,w);var T=n[_].length<n[w].length;s.matches_head?l.matches_head?T?(A(_),M(_,w)):(A(w),M(w,_)):M(w,_):l.matches_head?M(_,w):T?(A(_),M(w,_)):(A(w),M(_,w))}function k(t,e,r){return c.index=t,c.matches_head=e,c.matches_pt1=r,c===s?(c=l,!1):(c=null,!0)}function A(t){r&&r.chainReverse(t),n[t].reverse()}function M(t,a){var i=n[t],o=n[a],s=i[i.length-1],l=i[i.length-2],c=o[0],u=o[1];e.pointsCollinear(l,s,c)&&(r&&r.chainRemoveTail(t,s),i.pop(),s=l),e.pointsCollinear(s,c,u)&&(r&&r.chainRemoveHead(a,c),o.shift()),r&&r.chainJoin(t,a),n[t]=i.concat(o),n.splice(a,1)}})),a}},{}],478:[function(t,e,r){function n(t,e,r){var n=[];return t.forEach((function(t){var a=(t.myFill.above?8:0)+(t.myFill.below?4:0)+(t.otherFill&&t.otherFill.above?2:0)+(t.otherFill&&t.otherFill.below?1:0);0!==e[a]&&n.push({id:r?r.segmentId():-1,start:t.start,end:t.end,myFill:{above:1===e[a],below:2===e[a]},otherFill:null})})),r&&r.selected(n),n}var a={union:function(t,e){return n(t,[0,2,1,0,2,2,0,0,1,0,1,0,0,0,0,0],e)},intersect:function(t,e){return n(t,[0,0,0,0,0,2,0,2,0,0,1,1,0,2,1,0],e)},difference:function(t,e){return n(t,[0,0,0,0,2,0,2,0,1,1,0,0,0,1,2,0],e)},differenceRev:function(t,e){return n(t,[0,2,1,0,0,0,1,1,0,2,0,2,0,0,0,0],e)},xor:function(t,e){return n(t,[0,2,1,0,2,0,0,1,1,0,0,2,0,1,2,0],e)}};e.exports=a},{}],479:[function(t,e,r){"use strict";var n=new Float64Array(4),a=new Float64Array(4),i=new Float64Array(4);e.exports=function(t,e,r,o,s){n.length<o.length&&(n=new Float64Array(o.length),a=new Float64Array(o.length),i=new Float64Array(o.length));for(var l=0;l<o.length;++l)n[l]=t[l]-o[l],a[l]=e[l]-t[l],i[l]=r[l]-t[l];var c=0,u=0,h=0,f=0,p=0,d=0;for(l=0;l<o.length;++l){var g=a[l],m=i[l],v=n[l];c+=g*g,u+=g*m,h+=m*m,f+=v*g,p+=v*m,d+=v*v}var y,x,b,_,w,T=Math.abs(c*h-u*u),k=u*p-h*f,A=u*f-c*p;if(k+A<=T)if(k<0)A<0&&f<0?(A=0,-f>=c?(k=1,y=c+2*f+d):y=f*(k=-f/c)+d):(k=0,p>=0?(A=0,y=d):-p>=h?(A=1,y=h+2*p+d):y=p*(A=-p/h)+d);else if(A<0)A=0,f>=0?(k=0,y=d):-f>=c?(k=1,y=c+2*f+d):y=f*(k=-f/c)+d;else{var M=1/T;y=(k*=M)*(c*k+u*(A*=M)+2*f)+A*(u*k+h*A+2*p)+d}else k<0?(b=h+p)>(x=u+f)?(_=b-x)>=(w=c-2*u+h)?(k=1,A=0,y=c+2*f+d):y=(k=_/w)*(c*k+u*(A=1-k)+2*f)+A*(u*k+h*A+2*p)+d:(k=0,b<=0?(A=1,y=h+2*p+d):p>=0?(A=0,y=d):y=p*(A=-p/h)+d):A<0?(b=c+f)>(x=u+p)?(_=b-x)>=(w=c-2*u+h)?(A=1,k=0,y=h+2*p+d):y=(k=1-(A=_/w))*(c*k+u*A+2*f)+A*(u*k+h*A+2*p)+d:(A=0,b<=0?(k=1,y=c+2*f+d):f>=0?(k=0,y=d):y=f*(k=-f/c)+d):(_=h+p-u-f)<=0?(k=0,A=1,y=h+2*p+d):_>=(w=c-2*u+h)?(k=1,A=0,y=c+2*f+d):y=(k=_/w)*(c*k+u*(A=1-k)+2*f)+A*(u*k+h*A+2*p)+d;var S=1-k-A;for(l=0;l<o.length;++l)s[l]=S*t[l]+k*e[l]+A*r[l];return y<0?0:y}},{}],480:[function(t,e,r){var n,a,i=e.exports={};function o(){throw new Error("setTimeout has not been defined")}function s(){throw new Error("clearTimeout has not been defined")}function l(t){if(n===setTimeout)return setTimeout(t,0);if((n===o||!n)&&setTimeout)return n=setTimeout,setTimeout(t,0);try{return n(t,0)}catch(e){try{return n.call(null,t,0)}catch(e){return n.call(this,t,0)}}}!function(){try{n="function"==typeof setTimeout?setTimeout:o}catch(t){n=o}try{a="function"==typeof clearTimeout?clearTimeout:s}catch(t){a=s}}();var c,u=[],h=!1,f=-1;function p(){h&&c&&(h=!1,c.length?u=c.concat(u):f=-1,u.length&&d())}function d(){if(!h){var t=l(p);h=!0;for(var e=u.length;e;){for(c=u,u=[];++f<e;)c&&c[f].run();f=-1,e=u.length}c=null,h=!1,function(t){if(a===clearTimeout)return clearTimeout(t);if((a===s||!a)&&clearTimeout)return a=clearTimeout,clearTimeout(t);try{a(t)}catch(e){try{return a.call(null,t)}catch(e){return a.call(this,t)}}}(t)}}function g(t,e){this.fun=t,this.array=e}function m(){}i.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)e[r-1]=arguments[r];u.push(new g(t,e)),1!==u.length||h||l(d)},g.prototype.run=function(){this.fun.apply(null,this.array)},i.title="browser",i.browser=!0,i.env={},i.argv=[],i.version="",i.versions={},i.on=m,i.addListener=m,i.once=m,i.off=m,i.removeListener=m,i.removeAllListeners=m,i.emit=m,i.prependListener=m,i.prependOnceListener=m,i.listeners=function(t){return[]},i.binding=function(t){throw new Error("process.binding is not supported")},i.cwd=function(){return"/"},i.chdir=function(t){throw new Error("process.chdir is not supported")},i.umask=function(){return 0}},{}],481:[function(t,e,r){e.exports=t("gl-quat/slerp")},{"gl-quat/slerp":299}],482:[function(t,e,r){(function(r){for(var n=t("performance-now"),a="undefined"==typeof window?r:window,i=["moz","webkit"],o="AnimationFrame",s=a["request"+o],l=a["cancel"+o]||a["cancelRequest"+o],c=0;!s&&c<i.length;c++)s=a[i[c]+"Request"+o],l=a[i[c]+"Cancel"+o]||a[i[c]+"CancelRequest"+o];if(!s||!l){var u=0,h=0,f=[];s=function(t){if(0===f.length){var e=n(),r=Math.max(0,1e3/60-(e-u));u=r+e,setTimeout((function(){var t=f.slice(0);f.length=0;for(var e=0;e<t.length;e++)if(!t[e].cancelled)try{t[e].callback(u)}catch(t){setTimeout((function(){throw t}),0)}}),Math.round(r))}return f.push({handle:++h,callback:t,cancelled:!1}),h},l=function(t){for(var e=0;e<f.length;e++)f[e].handle===t&&(f[e].cancelled=!0)}}e.exports=function(t){return s.call(a,t)},e.exports.cancel=function(){l.apply(a,arguments)},e.exports.polyfill=function(t){t||(t=a),t.requestAnimationFrame=s,t.cancelAnimationFrame=l}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"performance-now":460}],483:[function(t,e,r){"use strict";var n=t("big-rat/add");e.exports=function(t,e){for(var r=t.length,a=new Array(r),i=0;i<r;++i)a[i]=n(t[i],e[i]);return a}},{"big-rat/add":78}],484:[function(t,e,r){"use strict";e.exports=function(t){for(var e=new Array(t.length),r=0;r<t.length;++r)e[r]=n(t[r]);return e};var n=t("big-rat")},{"big-rat":81}],485:[function(t,e,r){"use strict";var n=t("big-rat"),a=t("big-rat/mul");e.exports=function(t,e){for(var r=n(e),i=t.length,o=new Array(i),s=0;s<i;++s)o[s]=a(t[s],r);return o}},{"big-rat":81,"big-rat/mul":90}],486:[function(t,e,r){"use strict";var n=t("big-rat/sub");e.exports=function(t,e){for(var r=t.length,a=new Array(r),i=0;i<r;++i)a[i]=n(t[i],e[i]);return a}},{"big-rat/sub":92}],487:[function(t,e,r){"use strict";var n=t("compare-cell"),a=t("compare-oriented-cell"),i=t("cell-orientation");e.exports=function(t){t.sort(a);for(var e=t.length,r=0,o=0;o<e;++o){var s=t[o],l=i(s);if(0!==l){if(r>0){var c=t[r-1];if(0===n(s,c)&&i(c)!==l){r-=1;continue}}t[r++]=s}}return t.length=r,t}},{"cell-orientation":114,"compare-cell":130,"compare-oriented-cell":131}],488:[function(t,e,r){"use strict";var n=t("array-bounds"),a=t("color-normalize"),i=t("update-diff"),o=t("pick-by-alias"),s=t("object-assign"),l=t("flatten-vertex-data"),c=t("to-float32"),u=c.float32,h=c.fract32;e.exports=function(t,e){"function"==typeof t?(e||(e={}),e.regl=t):e=t;e.length&&(e.positions=e);if(!(t=e.regl).hasExtension("ANGLE_instanced_arrays"))throw Error("regl-error2d: `ANGLE_instanced_arrays` extension should be enabled");var r,c,p,d,g,m,v=t._gl,y={color:"black",capSize:5,lineWidth:1,opacity:1,viewport:null,range:null,offset:0,count:0,bounds:null,positions:[],errors:[]},x=[];return d=t.buffer({usage:"dynamic",type:"uint8",data:new Uint8Array(0)}),c=t.buffer({usage:"dynamic",type:"float",data:new Uint8Array(0)}),p=t.buffer({usage:"dynamic",type:"float",data:new Uint8Array(0)}),g=t.buffer({usage:"dynamic",type:"float",data:new Uint8Array(0)}),m=t.buffer({usage:"static",type:"float",data:f}),T(e),r=t({vert:"\n\t\tprecision highp float;\n\n\t\tattribute vec2 position, positionFract;\n\t\tattribute vec4 error;\n\t\tattribute vec4 color;\n\n\t\tattribute vec2 direction, lineOffset, capOffset;\n\n\t\tuniform vec4 viewport;\n\t\tuniform float lineWidth, capSize;\n\t\tuniform vec2 scale, scaleFract, translate, translateFract;\n\n\t\tvarying vec4 fragColor;\n\n\t\tvoid main() {\n\t\t\tfragColor = color / 255.;\n\n\t\t\tvec2 pixelOffset = lineWidth * lineOffset + (capSize + lineWidth) * capOffset;\n\n\t\t\tvec2 dxy = -step(.5, direction.xy) * error.xz + step(direction.xy, vec2(-.5)) * error.yw;\n\n\t\t\tvec2 position = position + dxy;\n\n\t\t\tvec2 pos = (position + translate) * scale\n\t\t\t\t+ (positionFract + translateFract) * scale\n\t\t\t\t+ (position + translate) * scaleFract\n\t\t\t\t+ (positionFract + translateFract) * scaleFract;\n\n\t\t\tpos += pixelOffset / viewport.zw;\n\n\t\t\tgl_Position = vec4(pos * 2. - 1., 0, 1);\n\t\t}\n\t\t",frag:"\n\t\tprecision highp float;\n\n\t\tvarying vec4 fragColor;\n\n\t\tuniform float opacity;\n\n\t\tvoid main() {\n\t\t\tgl_FragColor = fragColor;\n\t\t\tgl_FragColor.a *= opacity;\n\t\t}\n\t\t",uniforms:{range:t.prop("range"),lineWidth:t.prop("lineWidth"),capSize:t.prop("capSize"),opacity:t.prop("opacity"),scale:t.prop("scale"),translate:t.prop("translate"),scaleFract:t.prop("scaleFract"),translateFract:t.prop("translateFract"),viewport:function(t,e){return[e.viewport.x,e.viewport.y,t.viewportWidth,t.viewportHeight]}},attributes:{color:{buffer:d,offset:function(t,e){return 4*e.offset},divisor:1},position:{buffer:c,offset:function(t,e){return 8*e.offset},divisor:1},positionFract:{buffer:p,offset:function(t,e){return 8*e.offset},divisor:1},error:{buffer:g,offset:function(t,e){return 16*e.offset},divisor:1},direction:{buffer:m,stride:24,offset:0},lineOffset:{buffer:m,stride:24,offset:8},capOffset:{buffer:m,stride:24,offset:16}},primitive:"triangles",blend:{enable:!0,color:[0,0,0,0],equation:{rgb:"add",alpha:"add"},func:{srcRGB:"src alpha",dstRGB:"one minus src alpha",srcAlpha:"one minus dst alpha",dstAlpha:"one"}},depth:{enable:!1},scissor:{enable:!0,box:t.prop("viewport")},viewport:t.prop("viewport"),stencil:!1,instances:t.prop("count"),count:f.length}),s(b,{update:T,draw:_,destroy:k,regl:t,gl:v,canvas:v.canvas,groups:x}),b;function b(t){t?T(t):null===t&&k(),_()}function _(e){if("number"==typeof e)return w(e);e&&!Array.isArray(e)&&(e=[e]),t._refresh(),x.forEach((function(t,r){t&&(e&&(e[r]?t.draw=!0:t.draw=!1),t.draw?w(r):t.draw=!0)}))}function w(t){"number"==typeof t&&(t=x[t]),null!=t&&t&&t.count&&t.color&&t.opacity&&t.positions&&t.positions.length>1&&(t.scaleRatio=[t.scale[0]*t.viewport.width,t.scale[1]*t.viewport.height],r(t),t.after&&t.after(t))}function T(t){if(t){null!=t.length?"number"==typeof t[0]&&(t=[{positions:t}]):Array.isArray(t)||(t=[t]);var e=0,r=0;if(b.groups=x=t.map((function(t,c){var u=x[c];return t?("function"==typeof t?t={after:t}:"number"==typeof t[0]&&(t={positions:t}),t=o(t,{color:"color colors fill",capSize:"capSize cap capsize cap-size",lineWidth:"lineWidth line-width width line thickness",opacity:"opacity alpha",range:"range dataBox",viewport:"viewport viewBox",errors:"errors error",positions:"positions position data points"}),u||(x[c]=u={id:c,scale:null,translate:null,scaleFract:null,translateFract:null,draw:!0},t=s({},y,t)),i(u,t,[{lineWidth:function(t){return.5*+t},capSize:function(t){return.5*+t},opacity:parseFloat,errors:function(t){return t=l(t),r+=t.length,t},positions:function(t,r){return t=l(t,"float64"),r.count=Math.floor(t.length/2),r.bounds=n(t,2),r.offset=e,e+=r.count,t}},{color:function(t,e){var r=e.count;if(t||(t="transparent"),!Array.isArray(t)||"number"==typeof t[0]){var n=t;t=Array(r);for(var i=0;i<r;i++)t[i]=n}if(t.length<r)throw Error("Not enough colors");for(var o=new Uint8Array(4*r),s=0;s<r;s++){var l=a(t[s],"uint8");o.set(l,4*s)}return o},range:function(t,e,r){var n=e.bounds;return t||(t=n),e.scale=[1/(t[2]-t[0]),1/(t[3]-t[1])],e.translate=[-t[0],-t[1]],e.scaleFract=h(e.scale),e.translateFract=h(e.translate),t},viewport:function(t){var e;return Array.isArray(t)?e={x:t[0],y:t[1],width:t[2]-t[0],height:t[3]-t[1]}:t?(e={x:t.x||t.left||0,y:t.y||t.top||0},t.right?e.width=t.right-e.x:e.width=t.w||t.width||0,t.bottom?e.height=t.bottom-e.y:e.height=t.h||t.height||0):e={x:0,y:0,width:v.drawingBufferWidth,height:v.drawingBufferHeight},e}}]),u):u})),e||r){var f=x.reduce((function(t,e,r){return t+(e?e.count:0)}),0),m=new Float64Array(2*f),_=new Uint8Array(4*f),w=new Float32Array(4*f);x.forEach((function(t,e){if(t){var r=t.positions,n=t.count,a=t.offset,i=t.color,o=t.errors;n&&(_.set(i,4*a),w.set(o,4*a),m.set(r,2*a))}})),c(u(m)),p(h(m)),d(_),g(w)}}}function k(){c.destroy(),p.destroy(),d.destroy(),g.destroy(),m.destroy()}};var f=[[1,0,0,1,0,0],[1,0,0,-1,0,0],[-1,0,0,-1,0,0],[-1,0,0,-1,0,0],[-1,0,0,1,0,0],[1,0,0,1,0,0],[1,0,-1,0,0,1],[1,0,-1,0,0,-1],[1,0,1,0,0,-1],[1,0,1,0,0,-1],[1,0,1,0,0,1],[1,0,-1,0,0,1],[-1,0,-1,0,0,1],[-1,0,-1,0,0,-1],[-1,0,1,0,0,-1],[-1,0,1,0,0,-1],[-1,0,1,0,0,1],[-1,0,-1,0,0,1],[0,1,1,0,0,0],[0,1,-1,0,0,0],[0,-1,-1,0,0,0],[0,-1,-1,0,0,0],[0,1,1,0,0,0],[0,-1,1,0,0,0],[0,1,0,-1,1,0],[0,1,0,-1,-1,0],[0,1,0,1,-1,0],[0,1,0,1,1,0],[0,1,0,-1,1,0],[0,1,0,1,-1,0],[0,-1,0,-1,1,0],[0,-1,0,-1,-1,0],[0,-1,0,1,-1,0],[0,-1,0,1,1,0],[0,-1,0,-1,1,0],[0,-1,0,1,-1,0]]},{"array-bounds":68,"color-normalize":122,"flatten-vertex-data":239,"object-assign":452,"pick-by-alias":463,"to-float32":529,"update-diff":551}],489:[function(t,e,r){"use strict";var n=t("color-normalize"),a=t("array-bounds"),i=t("object-assign"),o=t("glslify"),s=t("pick-by-alias"),l=t("flatten-vertex-data"),c=t("earcut"),u=t("array-normalize"),h=t("to-float32"),f=h.float32,p=h.fract32,d=t("es6-weak-map"),g=t("parse-rect");function m(t,e){if(!(this instanceof m))return new m(t,e);if("function"==typeof t?(e||(e={}),e.regl=t):e=t,e.length&&(e.positions=e),!(t=e.regl).hasExtension("ANGLE_instanced_arrays"))throw Error("regl-error2d: `ANGLE_instanced_arrays` extension should be enabled");this.gl=t._gl,this.regl=t,this.passes=[],this.shaders=m.shaders.has(t)?m.shaders.get(t):m.shaders.set(t,m.createShaders(t)).get(t),this.update(e)}e.exports=m,m.dashMult=2,m.maxPatternLength=256,m.precisionThreshold=3e6,m.maxPoints=1e4,m.maxLines=2048,m.shaders=new d,m.createShaders=function(t){var e,r=t.buffer({usage:"static",type:"float",data:[0,1,0,0,1,1,1,0]}),n={primitive:"triangle strip",instances:t.prop("count"),count:4,offset:0,uniforms:{miterMode:function(t,e){return"round"===e.join?2:1},miterLimit:t.prop("miterLimit"),scale:t.prop("scale"),scaleFract:t.prop("scaleFract"),translateFract:t.prop("translateFract"),translate:t.prop("translate"),thickness:t.prop("thickness"),dashPattern:t.prop("dashTexture"),opacity:t.prop("opacity"),pixelRatio:t.context("pixelRatio"),id:t.prop("id"),dashSize:t.prop("dashLength"),viewport:function(t,e){return[e.viewport.x,e.viewport.y,t.viewportWidth,t.viewportHeight]},depth:t.prop("depth")},blend:{enable:!0,color:[0,0,0,0],equation:{rgb:"add",alpha:"add"},func:{srcRGB:"src alpha",dstRGB:"one minus src alpha",srcAlpha:"one minus dst alpha",dstAlpha:"one"}},depth:{enable:function(t,e){return!e.overlay}},stencil:{enable:!1},scissor:{enable:!0,box:t.prop("viewport")},viewport:t.prop("viewport")},a=t(i({vert:o(["precision highp float;\n#define GLSLIFY 1\n\nattribute vec2 aCoord, bCoord, aCoordFract, bCoordFract;\nattribute vec4 color;\nattribute float lineEnd, lineTop;\n\nuniform vec2 scale, scaleFract, translate, translateFract;\nuniform float thickness, pixelRatio, id, depth;\nuniform vec4 viewport;\n\nvarying vec4 fragColor;\nvarying vec2 tangent;\n\nvec2 project(vec2 position, vec2 positionFract, vec2 scale, vec2 scaleFract, vec2 translate, vec2 translateFract) {\n\t// the order is important\n\treturn position * scale + translate\n       + positionFract * scale + translateFract\n       + position * scaleFract\n       + positionFract * scaleFract;\n}\n\nvoid main() {\n\tfloat lineStart = 1. - lineEnd;\n\tfloat lineOffset = lineTop * 2. - 1.;\n\n\tvec2 diff = (bCoord + bCoordFract - aCoord - aCoordFract);\n\ttangent = normalize(diff * scale * viewport.zw);\n\tvec2 normal = vec2(-tangent.y, tangent.x);\n\n\tvec2 position = project(aCoord, aCoordFract, scale, scaleFract, translate, translateFract) * lineStart\n\t\t+ project(bCoord, bCoordFract, scale, scaleFract, translate, translateFract) * lineEnd\n\n\t\t+ thickness * normal * .5 * lineOffset / viewport.zw;\n\n\tgl_Position = vec4(position * 2.0 - 1.0, depth, 1);\n\n\tfragColor = color / 255.;\n}\n"]),frag:o(["precision highp float;\n#define GLSLIFY 1\n\nuniform sampler2D dashPattern;\n\nuniform float dashSize, pixelRatio, thickness, opacity, id;\n\nvarying vec4 fragColor;\nvarying vec2 tangent;\n\nvoid main() {\n\tfloat alpha = 1.;\n\n\tfloat t = fract(dot(tangent, gl_FragCoord.xy) / dashSize) * .5 + .25;\n\tfloat dash = texture2D(dashPattern, vec2(t, .5)).r;\n\n\tgl_FragColor = fragColor;\n\tgl_FragColor.a *= alpha * opacity * dash;\n}\n"]),attributes:{lineEnd:{buffer:r,divisor:0,stride:8,offset:0},lineTop:{buffer:r,divisor:0,stride:8,offset:4},aCoord:{buffer:t.prop("positionBuffer"),stride:8,offset:8,divisor:1},bCoord:{buffer:t.prop("positionBuffer"),stride:8,offset:16,divisor:1},aCoordFract:{buffer:t.prop("positionFractBuffer"),stride:8,offset:8,divisor:1},bCoordFract:{buffer:t.prop("positionFractBuffer"),stride:8,offset:16,divisor:1},color:{buffer:t.prop("colorBuffer"),stride:4,offset:0,divisor:1}}},n));try{e=t(i({cull:{enable:!0,face:"back"},vert:o(["precision highp float;\n#define GLSLIFY 1\n\nattribute vec2 aCoord, bCoord, nextCoord, prevCoord;\nattribute vec4 aColor, bColor;\nattribute float lineEnd, lineTop;\n\nuniform vec2 scale, translate;\nuniform float thickness, pixelRatio, id, depth;\nuniform vec4 viewport;\nuniform float miterLimit, miterMode;\n\nvarying vec4 fragColor;\nvarying vec4 startCutoff, endCutoff;\nvarying vec2 tangent;\nvarying vec2 startCoord, endCoord;\nvarying float enableStartMiter, enableEndMiter;\n\nconst float REVERSE_THRESHOLD = -.875;\nconst float MIN_DIFF = 1e-6;\n\n// TODO: possible optimizations: avoid overcalculating all for vertices and calc just one instead\n// TODO: precalculate dot products, normalize things beforehead etc.\n// TODO: refactor to rectangular algorithm\n\nfloat distToLine(vec2 p, vec2 a, vec2 b) {\n\tvec2 diff = b - a;\n\tvec2 perp = normalize(vec2(-diff.y, diff.x));\n\treturn dot(p - a, perp);\n}\n\nbool isNaN( float val ){\n  return ( val < 0.0 || 0.0 < val || val == 0.0 ) ? false : true;\n}\n\nvoid main() {\n\tvec2 aCoord = aCoord, bCoord = bCoord, prevCoord = prevCoord, nextCoord = nextCoord;\n\n  vec2 adjustedScale;\n  adjustedScale.x = (abs(scale.x) < MIN_DIFF) ? MIN_DIFF : scale.x;\n  adjustedScale.y = (abs(scale.y) < MIN_DIFF) ? MIN_DIFF : scale.y;\n\n  vec2 scaleRatio = adjustedScale * viewport.zw;\n\tvec2 normalWidth = thickness / scaleRatio;\n\n\tfloat lineStart = 1. - lineEnd;\n\tfloat lineBot = 1. - lineTop;\n\n\tfragColor = (lineStart * aColor + lineEnd * bColor) / 255.;\n\n\tif (isNaN(aCoord.x) || isNaN(aCoord.y) || isNaN(bCoord.x) || isNaN(bCoord.y)) return;\n\n\tif (aCoord == prevCoord) prevCoord = aCoord + normalize(bCoord - aCoord);\n\tif (bCoord == nextCoord) nextCoord = bCoord - normalize(bCoord - aCoord);\n\n\tvec2 prevDiff = aCoord - prevCoord;\n\tvec2 currDiff = bCoord - aCoord;\n\tvec2 nextDiff = nextCoord - bCoord;\n\n\tvec2 prevTangent = normalize(prevDiff * scaleRatio);\n\tvec2 currTangent = normalize(currDiff * scaleRatio);\n\tvec2 nextTangent = normalize(nextDiff * scaleRatio);\n\n\tvec2 prevNormal = vec2(-prevTangent.y, prevTangent.x);\n\tvec2 currNormal = vec2(-currTangent.y, currTangent.x);\n\tvec2 nextNormal = vec2(-nextTangent.y, nextTangent.x);\n\n\tvec2 startJoinDirection = normalize(prevTangent - currTangent);\n\tvec2 endJoinDirection = normalize(currTangent - nextTangent);\n\n\t// collapsed/unidirectional segment cases\n\t// FIXME: there should be more elegant solution\n\tvec2 prevTanDiff = abs(prevTangent - currTangent);\n\tvec2 nextTanDiff = abs(nextTangent - currTangent);\n\tif (max(prevTanDiff.x, prevTanDiff.y) < MIN_DIFF) {\n\t\tstartJoinDirection = currNormal;\n\t}\n\tif (max(nextTanDiff.x, nextTanDiff.y) < MIN_DIFF) {\n\t\tendJoinDirection = currNormal;\n\t}\n\tif (aCoord == bCoord) {\n\t\tendJoinDirection = startJoinDirection;\n\t\tcurrNormal = prevNormal;\n\t\tcurrTangent = prevTangent;\n\t}\n\n\ttangent = currTangent;\n\n\t//calculate join shifts relative to normals\n\tfloat startJoinShift = dot(currNormal, startJoinDirection);\n\tfloat endJoinShift = dot(currNormal, endJoinDirection);\n\n\tfloat startMiterRatio = abs(1. / startJoinShift);\n\tfloat endMiterRatio = abs(1. / endJoinShift);\n\n\tvec2 startJoin = startJoinDirection * startMiterRatio;\n\tvec2 endJoin = endJoinDirection * endMiterRatio;\n\n\tvec2 startTopJoin, startBotJoin, endTopJoin, endBotJoin;\n\tstartTopJoin = sign(startJoinShift) * startJoin * .5;\n\tstartBotJoin = -startTopJoin;\n\n\tendTopJoin = sign(endJoinShift) * endJoin * .5;\n\tendBotJoin = -endTopJoin;\n\n\tvec2 aTopCoord = aCoord + normalWidth * startTopJoin;\n\tvec2 bTopCoord = bCoord + normalWidth * endTopJoin;\n\tvec2 aBotCoord = aCoord + normalWidth * startBotJoin;\n\tvec2 bBotCoord = bCoord + normalWidth * endBotJoin;\n\n\t//miter anti-clipping\n\tfloat baClipping = distToLine(bCoord, aCoord, aBotCoord) / dot(normalize(normalWidth * endBotJoin), normalize(normalWidth.yx * vec2(-startBotJoin.y, startBotJoin.x)));\n\tfloat abClipping = distToLine(aCoord, bCoord, bTopCoord) / dot(normalize(normalWidth * startBotJoin), normalize(normalWidth.yx * vec2(-endBotJoin.y, endBotJoin.x)));\n\n\t//prevent close to reverse direction switch\n\tbool prevReverse = dot(currTangent, prevTangent) <= REVERSE_THRESHOLD && abs(dot(currTangent, prevNormal)) * min(length(prevDiff), length(currDiff)) <  length(normalWidth * currNormal);\n\tbool nextReverse = dot(currTangent, nextTangent) <= REVERSE_THRESHOLD && abs(dot(currTangent, nextNormal)) * min(length(nextDiff), length(currDiff)) <  length(normalWidth * currNormal);\n\n\tif (prevReverse) {\n\t\t//make join rectangular\n\t\tvec2 miterShift = normalWidth * startJoinDirection * miterLimit * .5;\n\t\tfloat normalAdjust = 1. - min(miterLimit / startMiterRatio, 1.);\n\t\taBotCoord = aCoord + miterShift - normalAdjust * normalWidth * currNormal * .5;\n\t\taTopCoord = aCoord + miterShift + normalAdjust * normalWidth * currNormal * .5;\n\t}\n\telse if (!nextReverse && baClipping > 0. && baClipping < length(normalWidth * endBotJoin)) {\n\t\t//handle miter clipping\n\t\tbTopCoord -= normalWidth * endTopJoin;\n\t\tbTopCoord += normalize(endTopJoin * normalWidth) * baClipping;\n\t}\n\n\tif (nextReverse) {\n\t\t//make join rectangular\n\t\tvec2 miterShift = normalWidth * endJoinDirection * miterLimit * .5;\n\t\tfloat normalAdjust = 1. - min(miterLimit / endMiterRatio, 1.);\n\t\tbBotCoord = bCoord + miterShift - normalAdjust * normalWidth * currNormal * .5;\n\t\tbTopCoord = bCoord + miterShift + normalAdjust * normalWidth * currNormal * .5;\n\t}\n\telse if (!prevReverse && abClipping > 0. && abClipping < length(normalWidth * startBotJoin)) {\n\t\t//handle miter clipping\n\t\taBotCoord -= normalWidth * startBotJoin;\n\t\taBotCoord += normalize(startBotJoin * normalWidth) * abClipping;\n\t}\n\n\tvec2 aTopPosition = (aTopCoord) * adjustedScale + translate;\n\tvec2 aBotPosition = (aBotCoord) * adjustedScale + translate;\n\n\tvec2 bTopPosition = (bTopCoord) * adjustedScale + translate;\n\tvec2 bBotPosition = (bBotCoord) * adjustedScale + translate;\n\n\t//position is normalized 0..1 coord on the screen\n\tvec2 position = (aTopPosition * lineTop + aBotPosition * lineBot) * lineStart + (bTopPosition * lineTop + bBotPosition * lineBot) * lineEnd;\n\n\tstartCoord = aCoord * scaleRatio + translate * viewport.zw + viewport.xy;\n\tendCoord = bCoord * scaleRatio + translate * viewport.zw + viewport.xy;\n\n\tgl_Position = vec4(position  * 2.0 - 1.0, depth, 1);\n\n\tenableStartMiter = step(dot(currTangent, prevTangent), .5);\n\tenableEndMiter = step(dot(currTangent, nextTangent), .5);\n\n\t//bevel miter cutoffs\n\tif (miterMode == 1.) {\n\t\tif (enableStartMiter == 1.) {\n\t\t\tvec2 startMiterWidth = vec2(startJoinDirection) * thickness * miterLimit * .5;\n\t\t\tstartCutoff = vec4(aCoord, aCoord);\n\t\t\tstartCutoff.zw += vec2(-startJoinDirection.y, startJoinDirection.x) / scaleRatio;\n\t\t\tstartCutoff = startCutoff * scaleRatio.xyxy + translate.xyxy * viewport.zwzw;\n\t\t\tstartCutoff += viewport.xyxy;\n\t\t\tstartCutoff += startMiterWidth.xyxy;\n\t\t}\n\n\t\tif (enableEndMiter == 1.) {\n\t\t\tvec2 endMiterWidth = vec2(endJoinDirection) * thickness * miterLimit * .5;\n\t\t\tendCutoff = vec4(bCoord, bCoord);\n\t\t\tendCutoff.zw += vec2(-endJoinDirection.y, endJoinDirection.x)  / scaleRatio;\n\t\t\tendCutoff = endCutoff * scaleRatio.xyxy + translate.xyxy * viewport.zwzw;\n\t\t\tendCutoff += viewport.xyxy;\n\t\t\tendCutoff += endMiterWidth.xyxy;\n\t\t}\n\t}\n\n\t//round miter cutoffs\n\telse if (miterMode == 2.) {\n\t\tif (enableStartMiter == 1.) {\n\t\t\tvec2 startMiterWidth = vec2(startJoinDirection) * thickness * abs(dot(startJoinDirection, currNormal)) * .5;\n\t\t\tstartCutoff = vec4(aCoord, aCoord);\n\t\t\tstartCutoff.zw += vec2(-startJoinDirection.y, startJoinDirection.x) / scaleRatio;\n\t\t\tstartCutoff = startCutoff * scaleRatio.xyxy + translate.xyxy * viewport.zwzw;\n\t\t\tstartCutoff += viewport.xyxy;\n\t\t\tstartCutoff += startMiterWidth.xyxy;\n\t\t}\n\n\t\tif (enableEndMiter == 1.) {\n\t\t\tvec2 endMiterWidth = vec2(endJoinDirection) * thickness * abs(dot(endJoinDirection, currNormal)) * .5;\n\t\t\tendCutoff = vec4(bCoord, bCoord);\n\t\t\tendCutoff.zw += vec2(-endJoinDirection.y, endJoinDirection.x)  / scaleRatio;\n\t\t\tendCutoff = endCutoff * scaleRatio.xyxy + translate.xyxy * viewport.zwzw;\n\t\t\tendCutoff += viewport.xyxy;\n\t\t\tendCutoff += endMiterWidth.xyxy;\n\t\t}\n\t}\n}\n"]),frag:o(["precision highp float;\n#define GLSLIFY 1\n\nuniform sampler2D dashPattern;\nuniform float dashSize, pixelRatio, thickness, opacity, id, miterMode;\n\nvarying vec4 fragColor;\nvarying vec2 tangent;\nvarying vec4 startCutoff, endCutoff;\nvarying vec2 startCoord, endCoord;\nvarying float enableStartMiter, enableEndMiter;\n\nfloat distToLine(vec2 p, vec2 a, vec2 b) {\n\tvec2 diff = b - a;\n\tvec2 perp = normalize(vec2(-diff.y, diff.x));\n\treturn dot(p - a, perp);\n}\n\nvoid main() {\n\tfloat alpha = 1., distToStart, distToEnd;\n\tfloat cutoff = thickness * .5;\n\n\t//bevel miter\n\tif (miterMode == 1.) {\n\t\tif (enableStartMiter == 1.) {\n\t\t\tdistToStart = distToLine(gl_FragCoord.xy, startCutoff.xy, startCutoff.zw);\n\t\t\tif (distToStart < -1.) {\n\t\t\t\tdiscard;\n\t\t\t\treturn;\n\t\t\t}\n\t\t\talpha *= min(max(distToStart + 1., 0.), 1.);\n\t\t}\n\n\t\tif (enableEndMiter == 1.) {\n\t\t\tdistToEnd = distToLine(gl_FragCoord.xy, endCutoff.xy, endCutoff.zw);\n\t\t\tif (distToEnd < -1.) {\n\t\t\t\tdiscard;\n\t\t\t\treturn;\n\t\t\t}\n\t\t\talpha *= min(max(distToEnd + 1., 0.), 1.);\n\t\t}\n\t}\n\n\t// round miter\n\telse if (miterMode == 2.) {\n\t\tif (enableStartMiter == 1.) {\n\t\t\tdistToStart = distToLine(gl_FragCoord.xy, startCutoff.xy, startCutoff.zw);\n\t\t\tif (distToStart < 0.) {\n\t\t\t\tfloat radius = length(gl_FragCoord.xy - startCoord);\n\n\t\t\t\tif(radius > cutoff + .5) {\n\t\t\t\t\tdiscard;\n\t\t\t\t\treturn;\n\t\t\t\t}\n\n\t\t\t\talpha -= smoothstep(cutoff - .5, cutoff + .5, radius);\n\t\t\t}\n\t\t}\n\n\t\tif (enableEndMiter == 1.) {\n\t\t\tdistToEnd = distToLine(gl_FragCoord.xy, endCutoff.xy, endCutoff.zw);\n\t\t\tif (distToEnd < 0.) {\n\t\t\t\tfloat radius = length(gl_FragCoord.xy - endCoord);\n\n\t\t\t\tif(radius > cutoff + .5) {\n\t\t\t\t\tdiscard;\n\t\t\t\t\treturn;\n\t\t\t\t}\n\n\t\t\t\talpha -= smoothstep(cutoff - .5, cutoff + .5, radius);\n\t\t\t}\n\t\t}\n\t}\n\n\tfloat t = fract(dot(tangent, gl_FragCoord.xy) / dashSize) * .5 + .25;\n\tfloat dash = texture2D(dashPattern, vec2(t, .5)).r;\n\n\tgl_FragColor = fragColor;\n\tgl_FragColor.a *= alpha * opacity * dash;\n}\n"]),attributes:{lineEnd:{buffer:r,divisor:0,stride:8,offset:0},lineTop:{buffer:r,divisor:0,stride:8,offset:4},aColor:{buffer:t.prop("colorBuffer"),stride:4,offset:0,divisor:1},bColor:{buffer:t.prop("colorBuffer"),stride:4,offset:4,divisor:1},prevCoord:{buffer:t.prop("positionBuffer"),stride:8,offset:0,divisor:1},aCoord:{buffer:t.prop("positionBuffer"),stride:8,offset:8,divisor:1},bCoord:{buffer:t.prop("positionBuffer"),stride:8,offset:16,divisor:1},nextCoord:{buffer:t.prop("positionBuffer"),stride:8,offset:24,divisor:1}}},n))}catch(t){e=a}return{fill:t({primitive:"triangle",elements:function(t,e){return e.triangles},offset:0,vert:o(["precision highp float;\n#define GLSLIFY 1\n\nattribute vec2 position, positionFract;\n\nuniform vec4 color;\nuniform vec2 scale, scaleFract, translate, translateFract;\nuniform float pixelRatio, id;\nuniform vec4 viewport;\nuniform float opacity;\n\nvarying vec4 fragColor;\n\nconst float MAX_LINES = 256.;\n\nvoid main() {\n\tfloat depth = (MAX_LINES - 4. - id) / (MAX_LINES);\n\n\tvec2 position = position * scale + translate\n       + positionFract * scale + translateFract\n       + position * scaleFract\n       + positionFract * scaleFract;\n\n\tgl_Position = vec4(position * 2.0 - 1.0, depth, 1);\n\n\tfragColor = color / 255.;\n\tfragColor.a *= opacity;\n}\n"]),frag:o(["precision highp float;\n#define GLSLIFY 1\n\nvarying vec4 fragColor;\n\nvoid main() {\n\tgl_FragColor = fragColor;\n}\n"]),uniforms:{scale:t.prop("scale"),color:t.prop("fill"),scaleFract:t.prop("scaleFract"),translateFract:t.prop("translateFract"),translate:t.prop("translate"),opacity:t.prop("opacity"),pixelRatio:t.context("pixelRatio"),id:t.prop("id"),viewport:function(t,e){return[e.viewport.x,e.viewport.y,t.viewportWidth,t.viewportHeight]}},attributes:{position:{buffer:t.prop("positionBuffer"),stride:8,offset:8},positionFract:{buffer:t.prop("positionFractBuffer"),stride:8,offset:8}},blend:n.blend,depth:{enable:!1},scissor:n.scissor,stencil:n.stencil,viewport:n.viewport}),rect:a,miter:e}},m.defaults={dashes:null,join:"miter",miterLimit:1,thickness:10,cap:"square",color:"black",opacity:1,overlay:!1,viewport:null,range:null,close:!1,fill:null},m.prototype.render=function(){for(var t,e=[],r=arguments.length;r--;)e[r]=arguments[r];e.length&&(t=this).update.apply(t,e),this.draw()},m.prototype.draw=function(){for(var t=this,e=[],r=arguments.length;r--;)e[r]=arguments[r];return(e.length?e:this.passes).forEach((function(e,r){var n;if(e&&Array.isArray(e))return(n=t).draw.apply(n,e);"number"==typeof e&&(e=t.passes[e]),e&&e.count>1&&e.opacity&&(t.regl._refresh(),e.fill&&e.triangles&&e.triangles.length>2&&t.shaders.fill(e),e.thickness&&(e.scale[0]*e.viewport.width>m.precisionThreshold||e.scale[1]*e.viewport.height>m.precisionThreshold||"rect"===e.join||!e.join&&(e.thickness<=2||e.count>=m.maxPoints)?t.shaders.rect(e):t.shaders.miter(e)))})),this},m.prototype.update=function(t){var e=this;if(t){null!=t.length?"number"==typeof t[0]&&(t=[{positions:t}]):Array.isArray(t)||(t=[t]);var r=this.regl,o=this.gl;if(t.forEach((function(t,h){var d=e.passes[h];if(void 0!==t)if(null!==t){if("number"==typeof t[0]&&(t={positions:t}),t=s(t,{positions:"positions points data coords",thickness:"thickness lineWidth lineWidths line-width linewidth width stroke-width strokewidth strokeWidth",join:"lineJoin linejoin join type mode",miterLimit:"miterlimit miterLimit",dashes:"dash dashes dasharray dash-array dashArray",color:"color colour stroke colors colours stroke-color strokeColor",fill:"fill fill-color fillColor",opacity:"alpha opacity",overlay:"overlay crease overlap intersect",close:"closed close closed-path closePath",range:"range dataBox",viewport:"viewport viewBox",hole:"holes hole hollow"}),d||(e.passes[h]=d={id:h,scale:null,scaleFract:null,translate:null,translateFract:null,count:0,hole:[],depth:0,dashLength:1,dashTexture:r.texture({channels:1,data:new Uint8Array([255]),width:1,height:1,mag:"linear",min:"linear"}),colorBuffer:r.buffer({usage:"dynamic",type:"uint8",data:new Uint8Array}),positionBuffer:r.buffer({usage:"dynamic",type:"float",data:new Uint8Array}),positionFractBuffer:r.buffer({usage:"dynamic",type:"float",data:new Uint8Array})},t=i({},m.defaults,t)),null!=t.thickness&&(d.thickness=parseFloat(t.thickness)),null!=t.opacity&&(d.opacity=parseFloat(t.opacity)),null!=t.miterLimit&&(d.miterLimit=parseFloat(t.miterLimit)),null!=t.overlay&&(d.overlay=!!t.overlay,h<m.maxLines&&(d.depth=2*(m.maxLines-1-h%m.maxLines)/m.maxLines-1)),null!=t.join&&(d.join=t.join),null!=t.hole&&(d.hole=t.hole),null!=t.fill&&(d.fill=t.fill?n(t.fill,"uint8"):null),null!=t.viewport&&(d.viewport=g(t.viewport)),d.viewport||(d.viewport=g([o.drawingBufferWidth,o.drawingBufferHeight])),null!=t.close&&(d.close=t.close),null===t.positions&&(t.positions=[]),t.positions){var v,y;if(t.positions.x&&t.positions.y){var x=t.positions.x,b=t.positions.y;y=d.count=Math.max(x.length,b.length),v=new Float64Array(2*y);for(var _=0;_<y;_++)v[2*_]=x[_],v[2*_+1]=b[_]}else v=l(t.positions,"float64"),y=d.count=Math.floor(v.length/2);var w=d.bounds=a(v,2);if(d.fill){for(var T=[],k={},A=0,M=0,S=0,E=d.count;M<E;M++){var C=v[2*M],L=v[2*M+1];isNaN(C)||isNaN(L)||null==C||null==L?(C=v[2*A],L=v[2*A+1],k[M]=A):A=M,T[S++]=C,T[S++]=L}for(var P=c(T,d.hole||[]),I=0,z=P.length;I<z;I++)null!=k[P[I]]&&(P[I]=k[P[I]]);d.triangles=P}var O=new Float64Array(v);u(O,2,w);var D=new Float64Array(2*y+6);d.close?v[0]===v[2*y-2]&&v[1]===v[2*y-1]?(D[0]=O[2*y-4],D[1]=O[2*y-3]):(D[0]=O[2*y-2],D[1]=O[2*y-1]):(D[0]=O[0],D[1]=O[1]),D.set(O,2),d.close?v[0]===v[2*y-2]&&v[1]===v[2*y-1]?(D[2*y+2]=O[2],D[2*y+3]=O[3],d.count-=1):(D[2*y+2]=O[0],D[2*y+3]=O[1],D[2*y+4]=O[2],D[2*y+5]=O[3]):(D[2*y+2]=O[2*y-2],D[2*y+3]=O[2*y-1],D[2*y+4]=O[2*y-2],D[2*y+5]=O[2*y-1]),d.positionBuffer(f(D)),d.positionFractBuffer(p(D))}if(t.range?d.range=t.range:d.range||(d.range=d.bounds),(t.range||t.positions)&&d.count){var R=d.bounds,F=R[2]-R[0],B=R[3]-R[1],N=d.range[2]-d.range[0],j=d.range[3]-d.range[1];d.scale=[F/N,B/j],d.translate=[-d.range[0]/N+R[0]/N||0,-d.range[1]/j+R[1]/j||0],d.scaleFract=p(d.scale),d.translateFract=p(d.translate)}if(t.dashes){var V,U=0;if(!t.dashes||t.dashes.length<2)U=1,V=new Uint8Array([255,255,255,255,255,255,255,255]);else{U=0;for(var q=0;q<t.dashes.length;++q)U+=t.dashes[q];V=new Uint8Array(U*m.dashMult);for(var H=0,G=255,Y=0;Y<2;Y++)for(var W=0;W<t.dashes.length;++W){for(var Z=0,X=t.dashes[W]*m.dashMult*.5;Z<X;++Z)V[H++]=G;G^=255}}d.dashLength=U,d.dashTexture({channels:1,data:V,width:V.length,height:1,mag:"linear",min:"linear"},0,0)}if(t.color){var J=d.count,K=t.color;K||(K="transparent");var Q=new Uint8Array(4*J+4);if(Array.isArray(K)&&"number"!=typeof K[0]){for(var $=0;$<J;$++){var tt=n(K[$],"uint8");Q.set(tt,4*$)}Q.set(n(K[0],"uint8"),4*J)}else for(var et=n(K,"uint8"),rt=0;rt<J+1;rt++)Q.set(et,4*rt);d.colorBuffer({usage:"dynamic",type:"uint8",data:Q})}}else e.passes[h]=null})),t.length<this.passes.length){for(var h=t.length;h<this.passes.length;h++){var d=this.passes[h];d&&(d.colorBuffer.destroy(),d.positionBuffer.destroy(),d.dashTexture.destroy())}this.passes.length=t.length}for(var v=[],y=0;y<this.passes.length;y++)null!==this.passes[y]&&v.push(this.passes[y]);return this.passes=v,this}},m.prototype.destroy=function(){return this.passes.forEach((function(t){t.colorBuffer.destroy(),t.positionBuffer.destroy(),t.dashTexture.destroy()})),this.passes.length=0,this}},{"array-bounds":68,"array-normalize":69,"color-normalize":122,earcut:172,"es6-weak-map":228,"flatten-vertex-data":239,glslify:408,"object-assign":452,"parse-rect":457,"pick-by-alias":463,"to-float32":529}],490:[function(t,e,r){"use strict";function n(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(t)))return;var r=[],n=!0,a=!1,i=void 0;try{for(var o,s=t[Symbol.iterator]();!(n=(o=s.next()).done)&&(r.push(o.value),!e||r.length!==e);n=!0);}catch(t){a=!0,i=t}finally{try{n||null==s.return||s.return()}finally{if(a)throw i}}return r}(t,e)||i(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function a(t){return function(t){if(Array.isArray(t))return o(t)}(t)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||i(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function i(t,e){if(t){if("string"==typeof t)return o(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(r):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?o(t,e):void 0}}function o(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}var s=t("color-normalize"),l=t("array-bounds"),c=t("color-id"),u=t("point-cluster"),h=t("object-assign"),f=t("glslify"),p=t("pick-by-alias"),d=t("update-diff"),g=t("flatten-vertex-data"),m=t("is-iexplorer"),v=t("to-float32"),y=t("parse-rect"),x=b;function b(t,e){var r=this;if(!(this instanceof b))return new b(t,e);"function"==typeof t?(e||(e={}),e.regl=t):(e=t,t=null),e&&e.length&&(e.positions=e);var n,a=(t=e.regl)._gl,i=[];this.tooManyColors=m,n=t.texture({data:new Uint8Array(1020),width:255,height:1,type:"uint8",format:"rgba",wrapS:"clamp",wrapT:"clamp",mag:"nearest",min:"nearest"}),h(this,{regl:t,gl:a,groups:[],markerCache:[null],markerTextures:[null],palette:i,paletteIds:{},paletteTexture:n,maxColors:255,maxSize:100,canvas:a.canvas}),this.update(e);var o={uniforms:{pixelRatio:t.context("pixelRatio"),palette:n,paletteSize:function(t,e){return[r.tooManyColors?0:255,n.height]},scale:t.prop("scale"),scaleFract:t.prop("scaleFract"),translate:t.prop("translate"),translateFract:t.prop("translateFract"),opacity:t.prop("opacity"),marker:t.prop("markerTexture")},attributes:{x:function(t,e){return e.xAttr||{buffer:e.positionBuffer,stride:8,offset:0}},y:function(t,e){return e.yAttr||{buffer:e.positionBuffer,stride:8,offset:4}},xFract:function(t,e){return e.xAttr?{constant:[0,0]}:{buffer:e.positionFractBuffer,stride:8,offset:0}},yFract:function(t,e){return e.yAttr?{constant:[0,0]}:{buffer:e.positionFractBuffer,stride:8,offset:4}},size:function(t,e){return e.size.length?{buffer:e.sizeBuffer,stride:2,offset:0}:{constant:[Math.round(255*e.size/r.maxSize)]}},borderSize:function(t,e){return e.borderSize.length?{buffer:e.sizeBuffer,stride:2,offset:1}:{constant:[Math.round(255*e.borderSize/r.maxSize)]}},colorId:function(t,e){return e.color.length?{buffer:e.colorBuffer,stride:r.tooManyColors?8:4,offset:0}:{constant:r.tooManyColors?i.slice(4*e.color,4*e.color+4):[e.color]}},borderColorId:function(t,e){return e.borderColor.length?{buffer:e.colorBuffer,stride:r.tooManyColors?8:4,offset:r.tooManyColors?4:2}:{constant:r.tooManyColors?i.slice(4*e.borderColor,4*e.borderColor+4):[e.borderColor]}},isActive:function(t,e){return!0===e.activation?{constant:[1]}:e.activation?e.activation:{constant:[0]}}},blend:{enable:!0,color:[0,0,0,1],func:{srcRGB:"src alpha",dstRGB:"one minus src alpha",srcAlpha:"one minus dst alpha",dstAlpha:"one"}},scissor:{enable:!0,box:t.prop("viewport")},viewport:t.prop("viewport"),stencil:{enable:!1},depth:{enable:!1},elements:t.prop("elements"),count:t.prop("count"),offset:t.prop("offset"),primitive:"points"},s=h({},o);s.frag=f(["precision highp float;\n#define GLSLIFY 1\n\nvarying vec4 fragColor, fragBorderColor;\nvarying float fragWidth, fragBorderColorLevel, fragColorLevel;\n\nuniform sampler2D marker;\nuniform float pixelRatio, opacity;\n\nfloat smoothStep(float x, float y) {\n  return 1.0 / (1.0 + exp(50.0*(x - y)));\n}\n\nvoid main() {\n  float dist = texture2D(marker, gl_PointCoord).r, delta = fragWidth;\n\n  // max-distance alpha\n  if (dist < 0.003) discard;\n\n  // null-border case\n  if (fragBorderColorLevel == fragColorLevel || fragBorderColor.a == 0.) {\n    float colorAmt = smoothstep(.5 - delta, .5 + delta, dist);\n    gl_FragColor = vec4(fragColor.rgb, colorAmt * fragColor.a * opacity);\n  }\n  else {\n    float borderColorAmt = smoothstep(fragBorderColorLevel - delta, fragBorderColorLevel + delta, dist);\n    float colorAmt = smoothstep(fragColorLevel - delta, fragColorLevel + delta, dist);\n\n    vec4 color = fragBorderColor;\n    color.a *= borderColorAmt;\n    color = mix(color, fragColor, colorAmt);\n    color.a *= opacity;\n\n    gl_FragColor = color;\n  }\n\n}\n"]),s.vert=f(["precision highp float;\n#define GLSLIFY 1\n\nattribute float x, y, xFract, yFract;\nattribute float size, borderSize;\nattribute vec4 colorId, borderColorId;\nattribute float isActive;\n\nuniform vec2 scale, scaleFract, translate, translateFract, paletteSize;\nuniform float pixelRatio;\nuniform sampler2D palette;\n\nconst float maxSize = 100.;\nconst float borderLevel = .5;\n\nvarying vec4 fragColor, fragBorderColor;\nvarying float fragPointSize, fragBorderRadius, fragWidth, fragBorderColorLevel, fragColorLevel;\n\nbool isDirect = (paletteSize.x < 1.);\n\nvec4 getColor(vec4 id) {\n  return isDirect ? id / 255. : texture2D(palette,\n    vec2(\n      (id.x + .5) / paletteSize.x,\n      (id.y + .5) / paletteSize.y\n    )\n  );\n}\n\nvoid main() {\n  if (isActive == 0.) return;\n\n  vec2 position = vec2(x, y);\n  vec2 positionFract = vec2(xFract, yFract);\n\n  vec4 color = getColor(colorId);\n  vec4 borderColor = getColor(borderColorId);\n\n  float size = size * maxSize / 255.;\n  float borderSize = borderSize * maxSize / 255.;\n\n  gl_PointSize = 2. * size * pixelRatio;\n  fragPointSize = size * pixelRatio;\n\n  vec2 pos = (position + translate) * scale\n      + (positionFract + translateFract) * scale\n      + (position + translate) * scaleFract\n      + (positionFract + translateFract) * scaleFract;\n\n  gl_Position = vec4(pos * 2. - 1., 0, 1);\n\n  fragColor = color;\n  fragBorderColor = borderColor;\n  fragWidth = 1. / gl_PointSize;\n\n  fragBorderColorLevel = clamp(borderLevel - borderLevel * borderSize / size, 0., 1.);\n  fragColorLevel = clamp(borderLevel + (1. - borderLevel) * borderSize / size, 0., 1.);\n}"]),this.drawMarker=t(s);var l=h({},o);l.frag=f(["precision highp float;\n#define GLSLIFY 1\n\nvarying vec4 fragColor, fragBorderColor;\n\nuniform float opacity;\nvarying float fragBorderRadius, fragWidth;\n\nfloat smoothStep(float edge0, float edge1, float x) {\n\tfloat t;\n\tt = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);\n\treturn t * t * (3.0 - 2.0 * t);\n}\n\nvoid main() {\n\tfloat radius, alpha = 1.0, delta = fragWidth;\n\n\tradius = length(2.0 * gl_PointCoord.xy - 1.0);\n\n\tif (radius > 1.0 + delta) {\n\t\tdiscard;\n\t}\n\n\talpha -= smoothstep(1.0 - delta, 1.0 + delta, radius);\n\n\tfloat borderRadius = fragBorderRadius;\n\tfloat ratio = smoothstep(borderRadius - delta, borderRadius + delta, radius);\n\tvec4 color = mix(fragColor, fragBorderColor, ratio);\n\tcolor.a *= alpha * opacity;\n\tgl_FragColor = color;\n}\n"]),l.vert=f(["precision highp float;\n#define GLSLIFY 1\n\nattribute float x, y, xFract, yFract;\nattribute float size, borderSize;\nattribute vec4 colorId, borderColorId;\nattribute float isActive;\n\nuniform vec2 scale, scaleFract, translate, translateFract;\nuniform float pixelRatio;\nuniform sampler2D palette;\nuniform vec2 paletteSize;\n\nconst float maxSize = 100.;\n\nvarying vec4 fragColor, fragBorderColor;\nvarying float fragBorderRadius, fragWidth;\n\nbool isDirect = (paletteSize.x < 1.);\n\nvec4 getColor(vec4 id) {\n  return isDirect ? id / 255. : texture2D(palette,\n    vec2(\n      (id.x + .5) / paletteSize.x,\n      (id.y + .5) / paletteSize.y\n    )\n  );\n}\n\nvoid main() {\n  // ignore inactive points\n  if (isActive == 0.) return;\n\n  vec2 position = vec2(x, y);\n  vec2 positionFract = vec2(xFract, yFract);\n\n  vec4 color = getColor(colorId);\n  vec4 borderColor = getColor(borderColorId);\n\n  float size = size * maxSize / 255.;\n  float borderSize = borderSize * maxSize / 255.;\n\n  gl_PointSize = (size + borderSize) * pixelRatio;\n\n  vec2 pos = (position + translate) * scale\n      + (positionFract + translateFract) * scale\n      + (position + translate) * scaleFract\n      + (positionFract + translateFract) * scaleFract;\n\n  gl_Position = vec4(pos * 2. - 1., 0, 1);\n\n  fragBorderRadius = 1. - 2. * borderSize / (size + borderSize);\n  fragColor = color;\n  fragBorderColor = borderColor.a == 0. || borderSize == 0. ? vec4(color.rgb, 0.) : borderColor;\n  fragWidth = 1. / gl_PointSize;\n}\n"]),m&&(l.frag=l.frag.replace("smoothstep","smoothStep"),s.frag=s.frag.replace("smoothstep","smoothStep")),this.drawCircle=t(l)}b.defaults={color:"black",borderColor:"transparent",borderSize:0,size:12,opacity:1,marker:void 0,viewport:null,range:null,pixelSize:null,count:0,offset:0,bounds:null,positions:[],snap:1e4},b.prototype.render=function(){return arguments.length&&this.update.apply(this,arguments),this.draw(),this},b.prototype.draw=function(){for(var t=this,e=arguments.length,r=new Array(e),n=0;n<e;n++)r[n]=arguments[n];var a=this.groups;if(1===r.length&&Array.isArray(r[0])&&(null===r[0][0]||Array.isArray(r[0][0]))&&(r=r[0]),this.regl._refresh(),r.length)for(var i=0;i<r.length;i++)this.drawItem(i,r[i]);else a.forEach((function(e,r){t.drawItem(r)}));return this},b.prototype.drawItem=function(t,e){var r=this.groups,n=r[t];if("number"==typeof e&&(t=e,n=r[e],e=null),n&&n.count&&n.opacity){n.activation[0]&&this.drawCircle(this.getMarkerDrawOptions(0,n,e));for(var i=[],o=1;o<n.activation.length;o++)n.activation[o]&&(!0===n.activation[o]||n.activation[o].data.length)&&i.push.apply(i,a(this.getMarkerDrawOptions(o,n,e)));i.length&&this.drawMarker(i)}},b.prototype.getMarkerDrawOptions=function(t,e,r){var a=e.range,i=e.tree,o=e.viewport,s=e.activation,l=e.selectionBuffer,c=e.count;this.regl;if(!i)return r?[h({},e,{markerTexture:this.markerTextures[t],activation:s[t],count:r.length,elements:r,offset:0})]:[h({},e,{markerTexture:this.markerTextures[t],activation:s[t],offset:0})];var u=[],f=i.range(a,{lod:!0,px:[(a[2]-a[0])/o.width,(a[3]-a[1])/o.height]});if(r){for(var p=s[t].data,d=new Uint8Array(c),g=0;g<r.length;g++){var m=r[g];d[m]=p?p[m]:1}l.subdata(d)}for(var v=f.length;v--;){var y=n(f[v],2),x=y[0],b=y[1];u.push(h({},e,{markerTexture:this.markerTextures[t],activation:r?l:s[t],offset:x,count:b-x}))}return u},b.prototype.update=function(){for(var t=this,e=arguments.length,r=new Array(e),n=0;n<e;n++)r[n]=arguments[n];if(r.length){1===r.length&&Array.isArray(r[0])&&(r=r[0]);var a=this.groups,i=this.gl,o=this.regl,s=this.maxSize,c=this.maxColors,f=this.palette;this.groups=a=r.map((function(e,r){var n=a[r];if(void 0===e)return n;null===e?e={positions:null}:"function"==typeof e?e={ondraw:e}:"number"==typeof e[0]&&(e={positions:e}),null===(e=p(e,{positions:"positions data points",snap:"snap cluster lod tree",size:"sizes size radius",borderSize:"borderSizes borderSize border-size bordersize borderWidth borderWidths border-width borderwidth stroke-width strokeWidth strokewidth outline",color:"colors color fill fill-color fillColor",borderColor:"borderColors borderColor stroke stroke-color strokeColor",marker:"markers marker shape",range:"range dataBox databox",viewport:"viewport viewPort viewBox viewbox",opacity:"opacity alpha transparency",bounds:"bound bounds boundaries limits",tooManyColors:"tooManyColors palette paletteMode optimizePalette enablePalette"})).positions&&(e.positions=[]),null!=e.tooManyColors&&(t.tooManyColors=e.tooManyColors),n||(a[r]=n={id:r,scale:null,translate:null,scaleFract:null,translateFract:null,activation:[],selectionBuffer:o.buffer({data:new Uint8Array(0),usage:"stream",type:"uint8"}),sizeBuffer:o.buffer({data:new Uint8Array(0),usage:"dynamic",type:"uint8"}),colorBuffer:o.buffer({data:new Uint8Array(0),usage:"dynamic",type:"uint8"}),positionBuffer:o.buffer({data:new Uint8Array(0),usage:"dynamic",type:"float"}),positionFractBuffer:o.buffer({data:new Uint8Array(0),usage:"dynamic",type:"float"})},e=h({},b.defaults,e)),e.positions&&!("marker"in e)&&(e.marker=n.marker,delete n.marker),e.marker&&!("positions"in e)&&(e.positions=n.positions,delete n.positions);var m=0,x=0;if(d(n,e,[{snap:!0,size:function(t,e){return null==t&&(t=b.defaults.size),m+=t&&t.length?1:0,t},borderSize:function(t,e){return null==t&&(t=b.defaults.borderSize),m+=t&&t.length?1:0,t},opacity:parseFloat,color:function(e,r){return null==e&&(e=b.defaults.color),e=t.updateColor(e),x++,e},borderColor:function(e,r){return null==e&&(e=b.defaults.borderColor),e=t.updateColor(e),x++,e},bounds:function(t,e,r){return"range"in r||(r.range=null),t},positions:function(t,e,r){var n=e.snap,a=e.positionBuffer,i=e.positionFractBuffer,s=e.selectionBuffer;if(t.x||t.y)return t.x.length?e.xAttr={buffer:o.buffer(t.x),offset:0,stride:4,count:t.x.length}:e.xAttr={buffer:t.x.buffer,offset:4*t.x.offset||0,stride:4*(t.x.stride||1),count:t.x.count},t.y.length?e.yAttr={buffer:o.buffer(t.y),offset:0,stride:4,count:t.y.length}:e.yAttr={buffer:t.y.buffer,offset:4*t.y.offset||0,stride:4*(t.y.stride||1),count:t.y.count},e.count=Math.max(e.xAttr.count,e.yAttr.count),t;t=g(t,"float64");var c=e.count=Math.floor(t.length/2),h=e.bounds=c?l(t,2):null;if(r.range||e.range||(delete e.range,r.range=h),r.marker||e.marker||(delete e.marker,r.marker=null),n&&(!0===n||c>n)?e.tree=u(t,{bounds:h}):n&&n.length&&(e.tree=n),e.tree){var f={primitive:"points",usage:"static",data:e.tree,type:"uint32"};e.elements?e.elements(f):e.elements=o.elements(f)}return a({data:v.float(t),usage:"dynamic"}),i({data:v.fract(t),usage:"dynamic"}),s({data:new Uint8Array(c),type:"uint8",usage:"stream"}),t}},{marker:function(e,r,n){var a=r.activation;if(a.forEach((function(t){return t&&t.destroy&&t.destroy()})),a.length=0,e&&"number"!=typeof e[0]){for(var i=[],s=0,l=Math.min(e.length,r.count);s<l;s++){var c=t.addMarker(e[s]);i[c]||(i[c]=new Uint8Array(r.count)),i[c][s]=1}for(var u=0;u<i.length;u++)if(i[u]){var h={data:i[u],type:"uint8",usage:"static"};a[u]?a[u](h):a[u]=o.buffer(h),a[u].data=i[u]}}else{a[t.addMarker(e)]=!0}return e},range:function(t,e,r){var n=e.bounds;if(n)return t||(t=n),e.scale=[1/(t[2]-t[0]),1/(t[3]-t[1])],e.translate=[-t[0],-t[1]],e.scaleFract=v.fract(e.scale),e.translateFract=v.fract(e.translate),t},viewport:function(t){return y(t||[i.drawingBufferWidth,i.drawingBufferHeight])}}]),m){var _=n,w=_.count,T=_.size,k=_.borderSize,A=_.sizeBuffer,M=new Uint8Array(2*w);if(T.length||k.length)for(var S=0;S<w;S++)M[2*S]=Math.round(255*(null==T[S]?T:T[S])/s),M[2*S+1]=Math.round(255*(null==k[S]?k:k[S])/s);A({data:M,usage:"dynamic"})}if(x){var E,C=n,L=C.count,P=C.color,I=C.borderColor,z=C.colorBuffer;if(t.tooManyColors){if(P.length||I.length){E=new Uint8Array(8*L);for(var O=0;O<L;O++){var D=P[O];E[8*O]=f[4*D],E[8*O+1]=f[4*D+1],E[8*O+2]=f[4*D+2],E[8*O+3]=f[4*D+3];var R=I[O];E[8*O+4]=f[4*R],E[8*O+5]=f[4*R+1],E[8*O+6]=f[4*R+2],E[8*O+7]=f[4*R+3]}}}else if(P.length||I.length){E=new Uint8Array(4*L+2);for(var F=0;F<L;F++)null!=P[F]&&(E[4*F]=P[F]%c,E[4*F+1]=Math.floor(P[F]/c)),null!=I[F]&&(E[4*F+2]=I[F]%c,E[4*F+3]=Math.floor(I[F]/c))}z({data:E||new Uint8Array(0),type:"uint8",usage:"dynamic"})}return n}))}},b.prototype.addMarker=function(t){var e,r=this.markerTextures,n=this.regl,a=this.markerCache,i=null==t?0:a.indexOf(t);if(i>=0)return i;if(t instanceof Uint8Array||t instanceof Uint8ClampedArray)e=t;else{e=new Uint8Array(t.length);for(var o=0,s=t.length;o<s;o++)e[o]=255*t[o]}var l=Math.floor(Math.sqrt(e.length));return i=r.length,a.push(t),r.push(n.texture({channels:1,data:e,radius:l,mag:"linear",min:"linear"})),i},b.prototype.updateColor=function(t){var e=this.paletteIds,r=this.palette,n=this.maxColors;Array.isArray(t)||(t=[t]);var a=[];if("number"==typeof t[0]){var i=[];if(Array.isArray(t))for(var o=0;o<t.length;o+=4)i.push(t.slice(o,o+4));else for(var l=0;l<t.length;l+=4)i.push(t.subarray(l,l+4));t=i}for(var u=0;u<t.length;u++){var h=t[u];h=s(h,"uint8");var f=c(h,!1);if(null==e[f]){var p=r.length;e[f]=Math.floor(p/4),r[p]=h[0],r[p+1]=h[1],r[p+2]=h[2],r[p+3]=h[3]}a[u]=e[f]}return!this.tooManyColors&&r.length>4*n&&(this.tooManyColors=!0),this.updatePalette(r),1===a.length?a[0]:a},b.prototype.updatePalette=function(t){if(!this.tooManyColors){var e=this.maxColors,r=this.paletteTexture,n=Math.ceil(.25*t.length/e);if(n>1)for(var a=.25*(t=t.slice()).length%e;a<n*e;a++)t.push(0,0,0,0);r.height<n&&r.resize(e,n),r.subimage({width:Math.min(.25*t.length,e),height:n,data:t},0,0)}},b.prototype.destroy=function(){return this.groups.forEach((function(t){t.sizeBuffer.destroy(),t.positionBuffer.destroy(),t.positionFractBuffer.destroy(),t.colorBuffer.destroy(),t.activation.forEach((function(t){return t&&t.destroy&&t.destroy()})),t.selectionBuffer.destroy(),t.elements&&t.elements.destroy()})),this.groups.length=0,this.paletteTexture.destroy(),this.markerTextures.forEach((function(t){return t&&t.destroy&&t.destroy()})),this};var _=t("object-assign");e.exports=function(t,e){var r=new x(t,e),n=r.render.bind(r);return _(n,{render:n,update:r.update.bind(r),draw:r.draw.bind(r),destroy:r.destroy.bind(r),regl:r.regl,gl:r.gl,canvas:r.gl.canvas,groups:r.groups,markers:r.markerCache,palette:r.palette}),n}},{"array-bounds":68,"color-id":120,"color-normalize":122,"flatten-vertex-data":239,glslify:408,"is-iexplorer":419,"object-assign":452,"parse-rect":457,"pick-by-alias":463,"point-cluster":467,"to-float32":529,"update-diff":551}],491:[function(t,e,r){"use strict";var n=t("regl-scatter2d"),a=t("pick-by-alias"),i=t("array-bounds"),o=t("raf"),s=t("array-range"),l=t("parse-rect"),c=t("flatten-vertex-data");function u(t,e){if(!(this instanceof u))return new u(t,e);this.traces=[],this.passes={},this.regl=t,this.scatter=n(t),this.canvas=this.scatter.canvas}function h(t,e,r){return(null!=t.id?t.id:t)<<16|(255&e)<<8|255&r}function f(t,e,r){var n,a,i,o,s=t[e],l=t[r];return s.length>2?(s[0],s[2],n=s[1],a=s[3]):s.length?(n=s[0],a=s[1]):(s.x,n=s.y,s.x+s.width,a=s.y+s.height),l.length>2?(i=l[0],o=l[2],l[1],l[3]):l.length?(i=l[0],o=l[1]):(i=l.x,l.y,o=l.x+l.width,l.y+l.height),[i,n,o,a]}function p(t){if("number"==typeof t)return[t,t,t,t];if(2===t.length)return[t[0],t[1],t[0],t[1]];var e=l(t);return[e.x,e.y,e.x+e.width,e.y+e.height]}e.exports=u,u.prototype.render=function(){for(var t,e=this,r=[],n=arguments.length;n--;)r[n]=arguments[n];return r.length&&(t=this).update.apply(t,r),this.regl.attributes.preserveDrawingBuffer?this.draw():(this.dirty?null==this.planned&&(this.planned=o((function(){e.draw(),e.dirty=!0,e.planned=null}))):(this.draw(),this.dirty=!0,o((function(){e.dirty=!1}))),this)},u.prototype.update=function(){for(var t,e=[],r=arguments.length;r--;)e[r]=arguments[r];if(e.length){for(var n=0;n<e.length;n++)this.updateItem(n,e[n]);this.traces=this.traces.filter(Boolean);for(var a=[],i=0,o=0;o<this.traces.length;o++){for(var s=this.traces[o],l=this.traces[o].passes,c=0;c<l.length;c++)a.push(this.passes[l[c]]);s.passOffset=i,i+=s.passes.length}return(t=this.scatter).update.apply(t,a),this}},u.prototype.updateItem=function(t,e){var r=this.regl;if(null===e)return this.traces[t]=null,this;if(!e)return this;var n,o=a(e,{data:"data items columns rows values dimensions samples x",snap:"snap cluster",size:"sizes size radius",color:"colors color fill fill-color fillColor",opacity:"opacity alpha transparency opaque",borderSize:"borderSizes borderSize border-size bordersize borderWidth borderWidths border-width borderwidth stroke-width strokeWidth strokewidth outline",borderColor:"borderColors borderColor bordercolor stroke stroke-color strokeColor",marker:"markers marker shape",range:"range ranges databox dataBox",viewport:"viewport viewBox viewbox",domain:"domain domains area areas",padding:"pad padding paddings pads margin margins",transpose:"transpose transposed",diagonal:"diagonal diag showDiagonal",upper:"upper up top upperhalf upperHalf showupperhalf showUpper showUpperHalf",lower:"lower low bottom lowerhalf lowerHalf showlowerhalf showLowerHalf showLower"}),s=this.traces[t]||(this.traces[t]={id:t,buffer:r.buffer({usage:"dynamic",type:"float",data:new Uint8Array}),color:"black",marker:null,size:12,borderColor:"transparent",borderSize:1,viewport:l([r._gl.drawingBufferWidth,r._gl.drawingBufferHeight]),padding:[0,0,0,0],opacity:1,diagonal:!0,upper:!0,lower:!0});if(null!=o.color&&(s.color=o.color),null!=o.size&&(s.size=o.size),null!=o.marker&&(s.marker=o.marker),null!=o.borderColor&&(s.borderColor=o.borderColor),null!=o.borderSize&&(s.borderSize=o.borderSize),null!=o.opacity&&(s.opacity=o.opacity),o.viewport&&(s.viewport=l(o.viewport)),null!=o.diagonal&&(s.diagonal=o.diagonal),null!=o.upper&&(s.upper=o.upper),null!=o.lower&&(s.lower=o.lower),o.data){s.buffer(c(o.data)),s.columns=o.data.length,s.count=o.data[0].length,s.bounds=[];for(var u=0;u<s.columns;u++)s.bounds[u]=i(o.data[u],1)}o.range&&(s.range=o.range,n=s.range&&"number"!=typeof s.range[0]),o.domain&&(s.domain=o.domain);var d=!1;null!=o.padding&&(Array.isArray(o.padding)&&o.padding.length===s.columns&&"number"==typeof o.padding[o.padding.length-1]?(s.padding=o.padding.map(p),d=!0):s.padding=p(o.padding));var g=s.columns,m=s.count,v=s.viewport.width,y=s.viewport.height,x=s.viewport.x,b=s.viewport.y,_=v/g,w=y/g;s.passes=[];for(var T=0;T<g;T++)for(var k=0;k<g;k++)if((s.diagonal||k!==T)&&(s.upper||!(T>k))&&(s.lower||!(T<k))){var A=h(s.id,T,k),M=this.passes[A]||(this.passes[A]={});if(o.data&&(o.transpose?M.positions={x:{buffer:s.buffer,offset:k,count:m,stride:g},y:{buffer:s.buffer,offset:T,count:m,stride:g}}:M.positions={x:{buffer:s.buffer,offset:k*m,count:m},y:{buffer:s.buffer,offset:T*m,count:m}},M.bounds=f(s.bounds,T,k)),o.domain||o.viewport||o.data){var S=d?f(s.padding,T,k):s.padding;if(s.domain){var E=f(s.domain,T,k),C=E[0],L=E[1],P=E[2],I=E[3];M.viewport=[x+C*v+S[0],b+L*y+S[1],x+P*v-S[2],b+I*y-S[3]]}else M.viewport=[x+k*_+_*S[0],b+T*w+w*S[1],x+(k+1)*_-_*S[2],b+(T+1)*w-w*S[3]]}o.color&&(M.color=s.color),o.size&&(M.size=s.size),o.marker&&(M.marker=s.marker),o.borderSize&&(M.borderSize=s.borderSize),o.borderColor&&(M.borderColor=s.borderColor),o.opacity&&(M.opacity=s.opacity),o.range&&(M.range=n?f(s.range,T,k):s.range||M.bounds),s.passes.push(A)}return this},u.prototype.draw=function(){for(var t,e=[],r=arguments.length;r--;)e[r]=arguments[r];if(e.length){for(var n=[],a=0;a<e.length;a++)if("number"==typeof e[a]){var i=this.traces[e[a]],o=i.passes,l=i.passOffset;n.push.apply(n,s(l,l+o.length))}else if(e[a].length){var c=e[a],u=this.traces[a],h=u.passes,f=u.passOffset;h=h.map((function(t,e){n[f+e]=c}))}(t=this.scatter).draw.apply(t,n)}else this.scatter.draw();return this},u.prototype.destroy=function(){return this.traces.forEach((function(t){t.buffer&&t.buffer.destroy&&t.buffer.destroy()})),this.traces=null,this.passes=null,this.scatter.destroy(),this}},{"array-bounds":68,"array-range":70,"flatten-vertex-data":239,"parse-rect":457,"pick-by-alias":463,raf:482,"regl-scatter2d":490}],492:[function(t,e,r){!function(t,n){"object"==typeof r&&"undefined"!=typeof e?e.exports=n():t.createREGL=n()}(this,(function(){function t(t,e){this.id=U++,this.type=t,this.data=e}function e(t){return"["+function t(e){if(0===e.length)return[];var r=e.charAt(0),n=e.charAt(e.length-1);if(1<e.length&&r===n&&('"'===r||"'"===r))return['"'+e.substr(1,e.length-2).replace(/\\/g,"\\\\").replace(/"/g,'\\"')+'"'];if(r=/\[(false|true|null|\d+|'[^']*'|"[^"]*")\]/.exec(e))return t(e.substr(0,r.index)).concat(t(r[1])).concat(t(e.substr(r.index+r[0].length)));if(1===(r=e.split(".")).length)return['"'+e.replace(/\\/g,"\\\\").replace(/"/g,'\\"')+'"'];for(e=[],n=0;n<r.length;++n)e=e.concat(t(r[n]));return e}(t).join("][")+"]"}function r(t){return"string"==typeof t?t.split():t}function n(t){return"string"==typeof t?document.querySelector(t):t}function a(t){var e,a,i,o,s=t||{};t={};var l=[],c=[],u="undefined"==typeof window?1:window.devicePixelRatio,h=!1,f=function(t){},p=function(){};if("string"==typeof s?e=document.querySelector(s):"object"==typeof s&&("string"==typeof s.nodeName&&"function"==typeof s.appendChild&&"function"==typeof s.getBoundingClientRect?e=s:"function"==typeof s.drawArrays||"function"==typeof s.drawElements?i=(o=s).canvas:("gl"in s?o=s.gl:"canvas"in s?i=n(s.canvas):"container"in s&&(a=n(s.container)),"attributes"in s&&(t=s.attributes),"extensions"in s&&(l=r(s.extensions)),"optionalExtensions"in s&&(c=r(s.optionalExtensions)),"onDone"in s&&(f=s.onDone),"profile"in s&&(h=!!s.profile),"pixelRatio"in s&&(u=+s.pixelRatio))),e&&("canvas"===e.nodeName.toLowerCase()?i=e:a=e),!o){if(!i){if(!(e=function(t,e,r){function n(){var e=window.innerWidth,n=window.innerHeight;t!==document.body&&(e=(n=t.getBoundingClientRect()).right-n.left,n=n.bottom-n.top),i.width=r*e,i.height=r*n,V(i.style,{width:e+"px",height:n+"px"})}var a,i=document.createElement("canvas");return V(i.style,{border:0,margin:0,padding:0,top:0,left:0}),t.appendChild(i),t===document.body&&(i.style.position="absolute",V(t.style,{margin:0,padding:0})),t!==document.body&&"function"==typeof ResizeObserver?(a=new ResizeObserver((function(){setTimeout(n)}))).observe(t):window.addEventListener("resize",n,!1),n(),{canvas:i,onDestroy:function(){a?a.disconnect():window.removeEventListener("resize",n),t.removeChild(i)}}}(a||document.body,0,u)))return null;i=e.canvas,p=e.onDestroy}void 0===t.premultipliedAlpha&&(t.premultipliedAlpha=!0),o=function(t,e){function r(r){try{return t.getContext(r,e)}catch(t){return null}}return r("webgl")||r("experimental-webgl")||r("webgl-experimental")}(i,t)}return o?{gl:o,canvas:i,container:a,extensions:l,optionalExtensions:c,pixelRatio:u,profile:h,onDone:f,onDestroy:p}:(p(),f("webgl not supported, try upgrading your browser or graphics drivers http://get.webgl.org"),null)}function i(t,e){for(var r=Array(t),n=0;n<t;++n)r[n]=e(n);return r}function o(t){var e,r;return e=(65535<t)<<4,e|=r=(255<(t>>>=e))<<3,(e|=r=(15<(t>>>=r))<<2)|(r=(3<(t>>>=r))<<1)|t>>>r>>1}function s(){function t(t){t:{for(var e=16;268435456>=e;e*=16)if(t<=e){t=e;break t}t=0}return 0<(e=r[o(t)>>2]).length?e.pop():new ArrayBuffer(t)}function e(t){r[o(t.byteLength)>>2].push(t)}var r=i(8,(function(){return[]}));return{alloc:t,free:e,allocType:function(e,r){var n=null;switch(e){case 5120:n=new Int8Array(t(r),0,r);break;case 5121:n=new Uint8Array(t(r),0,r);break;case 5122:n=new Int16Array(t(2*r),0,r);break;case 5123:n=new Uint16Array(t(2*r),0,r);break;case 5124:n=new Int32Array(t(4*r),0,r);break;case 5125:n=new Uint32Array(t(4*r),0,r);break;case 5126:n=new Float32Array(t(4*r),0,r);break;default:return null}return n.length!==r?n.subarray(0,r):n},freeType:function(t){e(t.buffer)}}}function l(t){return!!t&&"object"==typeof t&&Array.isArray(t.shape)&&Array.isArray(t.stride)&&"number"==typeof t.offset&&t.shape.length===t.stride.length&&(Array.isArray(t.data)||Z(t.data))}function c(t,e,r,n,a,i){for(var o=0;o<e;++o)for(var s=t[o],l=0;l<r;++l)for(var c=s[l],u=0;u<n;++u)a[i++]=c[u]}function u(t){return 0|K[Object.prototype.toString.call(t)]}function h(t,e){for(var r=0;r<e.length;++r)t[r]=e[r]}function f(t,e,r,n,a,i,o){for(var s=0,l=0;l<r;++l)for(var c=0;c<n;++c)t[s++]=e[a*l+i*c+o]}function p(t,e,r,n){function a(e){this.id=c++,this.buffer=t.createBuffer(),this.type=e,this.usage=35044,this.byteLength=0,this.dimension=1,this.dtype=5121,this.persistentData=null,r.profile&&(this.stats={size:0})}function i(e,r,n){e.byteLength=r.byteLength,t.bufferData(e.type,r,n)}function o(t,e,r,n,a,o){if(t.usage=r,Array.isArray(e)){if(t.dtype=n||5126,0<e.length)if(Array.isArray(e[0])){a=et(e);for(var s=n=1;s<a.length;++s)n*=a[s];t.dimension=n,i(t,e=tt(e,a,t.dtype),r),o?t.persistentData=e:Y.freeType(e)}else"number"==typeof e[0]?(t.dimension=a,h(a=Y.allocType(t.dtype,e.length),e),i(t,a,r),o?t.persistentData=a:Y.freeType(a)):Z(e[0])&&(t.dimension=e[0].length,t.dtype=n||u(e[0])||5126,i(t,e=tt(e,[e.length,e[0].length],t.dtype),r),o?t.persistentData=e:Y.freeType(e))}else if(Z(e))t.dtype=n||u(e),t.dimension=a,i(t,e,r),o&&(t.persistentData=new Uint8Array(new Uint8Array(e.buffer)));else if(l(e)){a=e.shape;var c=e.stride,p=(s=e.offset,0),d=0,g=0,m=0;1===a.length?(p=a[0],d=1,g=c[0],m=0):2===a.length&&(p=a[0],d=a[1],g=c[0],m=c[1]),t.dtype=n||u(e.data)||5126,t.dimension=d,f(a=Y.allocType(t.dtype,p*d),e.data,p,d,g,m,s),i(t,a,r),o?t.persistentData=a:Y.freeType(a)}else e instanceof ArrayBuffer&&(t.dtype=5121,t.dimension=a,i(t,e,r),o&&(t.persistentData=new Uint8Array(new Uint8Array(e))))}function s(r){e.bufferCount--,n(r),t.deleteBuffer(r.buffer),r.buffer=null,delete p[r.id]}var c=0,p={};a.prototype.bind=function(){t.bindBuffer(this.type,this.buffer)},a.prototype.destroy=function(){s(this)};var d=[];return r.profile&&(e.getTotalBufferSize=function(){var t=0;return Object.keys(p).forEach((function(e){t+=p[e].stats.size})),t}),{create:function(n,i,c,d){function g(e){var n=35044,a=null,i=0,s=0,c=1;return Array.isArray(e)||Z(e)||l(e)||e instanceof ArrayBuffer?a=e:"number"==typeof e?i=0|e:e&&("data"in e&&(a=e.data),"usage"in e&&(n=$[e.usage]),"type"in e&&(s=Q[e.type]),"dimension"in e&&(c=0|e.dimension),"length"in e&&(i=0|e.length)),m.bind(),a?o(m,a,n,s,c,d):(i&&t.bufferData(m.type,i,n),m.dtype=s||5121,m.usage=n,m.dimension=c,m.byteLength=i),r.profile&&(m.stats.size=m.byteLength*rt[m.dtype]),g}e.bufferCount++;var m=new a(i);return p[m.id]=m,c||g(n),g._reglType="buffer",g._buffer=m,g.subdata=function(e,r){var n,a=0|(r||0);if(m.bind(),Z(e)||e instanceof ArrayBuffer)t.bufferSubData(m.type,a,e);else if(Array.isArray(e)){if(0<e.length)if("number"==typeof e[0]){var i=Y.allocType(m.dtype,e.length);h(i,e),t.bufferSubData(m.type,a,i),Y.freeType(i)}else(Array.isArray(e[0])||Z(e[0]))&&(n=et(e),i=tt(e,n,m.dtype),t.bufferSubData(m.type,a,i),Y.freeType(i))}else if(l(e)){n=e.shape;var o=e.stride,s=i=0,c=0,p=0;1===n.length?(i=n[0],s=1,c=o[0],p=0):2===n.length&&(i=n[0],s=n[1],c=o[0],p=o[1]),n=Array.isArray(e.data)?m.dtype:u(e.data),f(n=Y.allocType(n,i*s),e.data,i,s,c,p,e.offset),t.bufferSubData(m.type,a,n),Y.freeType(n)}return g},r.profile&&(g.stats=m.stats),g.destroy=function(){s(m)},g},createStream:function(t,e){var r=d.pop();return r||(r=new a(t)),r.bind(),o(r,e,35040,0,1,!1),r},destroyStream:function(t){d.push(t)},clear:function(){X(p).forEach(s),d.forEach(s)},getBuffer:function(t){return t&&t._buffer instanceof a?t._buffer:null},restore:function(){X(p).forEach((function(e){e.buffer=t.createBuffer(),t.bindBuffer(e.type,e.buffer),t.bufferData(e.type,e.persistentData||e.byteLength,e.usage)}))},_initBuffer:o}}function d(t,e,r,n){function a(t){this.id=c++,s[this.id]=this,this.buffer=t,this.primType=4,this.type=this.vertCount=0}function i(n,a,i,o,s,c,u){var h;if(n.buffer.bind(),a?((h=u)||Z(a)&&(!l(a)||Z(a.data))||(h=e.oes_element_index_uint?5125:5123),r._initBuffer(n.buffer,a,i,h,3)):(t.bufferData(34963,c,i),n.buffer.dtype=h||5121,n.buffer.usage=i,n.buffer.dimension=3,n.buffer.byteLength=c),h=u,!u){switch(n.buffer.dtype){case 5121:case 5120:h=5121;break;case 5123:case 5122:h=5123;break;case 5125:case 5124:h=5125}n.buffer.dtype=h}n.type=h,0>(a=s)&&(a=n.buffer.byteLength,5123===h?a>>=1:5125===h&&(a>>=2)),n.vertCount=a,a=o,0>o&&(a=4,1===(o=n.buffer.dimension)&&(a=0),2===o&&(a=1),3===o&&(a=4)),n.primType=a}function o(t){n.elementsCount--,delete s[t.id],t.buffer.destroy(),t.buffer=null}var s={},c=0,u={uint8:5121,uint16:5123};e.oes_element_index_uint&&(u.uint32=5125),a.prototype.bind=function(){this.buffer.bind()};var h=[];return{create:function(t,e){function s(t){if(t)if("number"==typeof t)c(t),h.primType=4,h.vertCount=0|t,h.type=5121;else{var e=null,r=35044,n=-1,a=-1,o=0,f=0;Array.isArray(t)||Z(t)||l(t)?e=t:("data"in t&&(e=t.data),"usage"in t&&(r=$[t.usage]),"primitive"in t&&(n=nt[t.primitive]),"count"in t&&(a=0|t.count),"type"in t&&(f=u[t.type]),"length"in t?o=0|t.length:(o=a,5123===f||5122===f?o*=2:5125!==f&&5124!==f||(o*=4))),i(h,e,r,n,a,o,f)}else c(),h.primType=4,h.vertCount=0,h.type=5121;return s}var c=r.create(null,34963,!0),h=new a(c._buffer);return n.elementsCount++,s(t),s._reglType="elements",s._elements=h,s.subdata=function(t,e){return c.subdata(t,e),s},s.destroy=function(){o(h)},s},createStream:function(t){var e=h.pop();return e||(e=new a(r.create(null,34963,!0,!1)._buffer)),i(e,t,35040,-1,-1,0,0),e},destroyStream:function(t){h.push(t)},getElements:function(t){return"function"==typeof t&&t._elements instanceof a?t._elements:null},clear:function(){X(s).forEach(o)}}}function g(t){for(var e=Y.allocType(5123,t.length),r=0;r<t.length;++r)if(isNaN(t[r]))e[r]=65535;else if(1/0===t[r])e[r]=31744;else if(-1/0===t[r])e[r]=64512;else{at[0]=t[r];var n=(i=it[0])>>>31<<15,a=(i<<1>>>24)-127,i=i>>13&1023;e[r]=-24>a?n:-14>a?n+(i+1024>>-14-a):15<a?n+31744:n+(a+15<<10)+i}return e}function m(t){return Array.isArray(t)||Z(t)}function v(t){return"[object "+t+"]"}function y(t){return Array.isArray(t)&&(0===t.length||"number"==typeof t[0])}function x(t){return!(!Array.isArray(t)||0===t.length||!m(t[0]))}function b(t){return Object.prototype.toString.call(t)}function _(t){if(!t)return!1;var e=b(t);return 0<=gt.indexOf(e)||(y(t)||x(t)||l(t))}function w(t,e){36193===t.type?(t.data=g(e),Y.freeType(e)):t.data=e}function T(t,e,r,n,a,i){if(t="undefined"!=typeof vt[t]?vt[t]:lt[t]*mt[e],i&&(t*=6),a){for(n=0;1<=r;)n+=t*r*r,r/=2;return n}return t*r*n}function k(t,e,r,n,a,i,o){function s(){this.format=this.internalformat=6408,this.type=5121,this.flipY=this.premultiplyAlpha=this.compressed=!1,this.unpackAlignment=1,this.colorSpace=37444,this.channels=this.height=this.width=0}function c(t,e){t.internalformat=e.internalformat,t.format=e.format,t.type=e.type,t.compressed=e.compressed,t.premultiplyAlpha=e.premultiplyAlpha,t.flipY=e.flipY,t.unpackAlignment=e.unpackAlignment,t.colorSpace=e.colorSpace,t.width=e.width,t.height=e.height,t.channels=e.channels}function u(t,e){if("object"==typeof e&&e){"premultiplyAlpha"in e&&(t.premultiplyAlpha=e.premultiplyAlpha),"flipY"in e&&(t.flipY=e.flipY),"alignment"in e&&(t.unpackAlignment=e.alignment),"colorSpace"in e&&(t.colorSpace=q[e.colorSpace]),"type"in e&&(t.type=H[e.type]);var r=t.width,n=t.height,a=t.channels,i=!1;"shape"in e?(r=e.shape[0],n=e.shape[1],3===e.shape.length&&(a=e.shape[2],i=!0)):("radius"in e&&(r=n=e.radius),"width"in e&&(r=e.width),"height"in e&&(n=e.height),"channels"in e&&(a=e.channels,i=!0)),t.width=0|r,t.height=0|n,t.channels=0|a,r=!1,"format"in e&&(r=e.format,n=t.internalformat=G[r],t.format=it[n],r in H&&!("type"in e)&&(t.type=H[r]),r in W&&(t.compressed=!0),r=!0),!i&&r?t.channels=lt[t.format]:i&&!r&&t.channels!==st[t.format]&&(t.format=t.internalformat=st[t.channels])}}function h(e){t.pixelStorei(37440,e.flipY),t.pixelStorei(37441,e.premultiplyAlpha),t.pixelStorei(37443,e.colorSpace),t.pixelStorei(3317,e.unpackAlignment)}function f(){s.call(this),this.yOffset=this.xOffset=0,this.data=null,this.needsFree=!1,this.element=null,this.needsCopy=!1}function p(t,e){var r=null;if(_(e)?r=e:e&&(u(t,e),"x"in e&&(t.xOffset=0|e.x),"y"in e&&(t.yOffset=0|e.y),_(e.data)&&(r=e.data)),e.copy){var n=a.viewportWidth,i=a.viewportHeight;t.width=t.width||n-t.xOffset,t.height=t.height||i-t.yOffset,t.needsCopy=!0}else if(r){if(Z(r))t.channels=t.channels||4,t.data=r,"type"in e||5121!==t.type||(t.type=0|K[Object.prototype.toString.call(r)]);else if(y(r)){switch(t.channels=t.channels||4,i=(n=r).length,t.type){case 5121:case 5123:case 5125:case 5126:(i=Y.allocType(t.type,i)).set(n),t.data=i;break;case 36193:t.data=g(n)}t.alignment=1,t.needsFree=!0}else if(l(r)){n=r.data,Array.isArray(n)||5121!==t.type||(t.type=0|K[Object.prototype.toString.call(n)]);i=r.shape;var o,s,c,h,f=r.stride;3===i.length?(c=i[2],h=f[2]):h=c=1,o=i[0],s=i[1],i=f[0],f=f[1],t.alignment=1,t.width=o,t.height=s,t.channels=c,t.format=t.internalformat=st[c],t.needsFree=!0,o=h,r=r.offset,c=t.width,h=t.height,s=t.channels;for(var p=Y.allocType(36193===t.type?5126:t.type,c*h*s),d=0,v=0;v<h;++v)for(var T=0;T<c;++T)for(var k=0;k<s;++k)p[d++]=n[i*T+f*v+o*k+r];w(t,p)}else if(b(r)===ct||b(r)===ut||b(r)===ht)b(r)===ct||b(r)===ut?t.element=r:t.element=r.canvas,t.width=t.element.width,t.height=t.element.height,t.channels=4;else if(b(r)===ft)t.element=r,t.width=r.width,t.height=r.height,t.channels=4;else if(b(r)===pt)t.element=r,t.width=r.naturalWidth,t.height=r.naturalHeight,t.channels=4;else if(b(r)===dt)t.element=r,t.width=r.videoWidth,t.height=r.videoHeight,t.channels=4;else if(x(r)){for(n=t.width||r[0].length,i=t.height||r.length,f=t.channels,f=m(r[0][0])?f||r[0][0].length:f||1,o=J.shape(r),c=1,h=0;h<o.length;++h)c*=o[h];c=Y.allocType(36193===t.type?5126:t.type,c),J.flatten(r,o,"",c),w(t,c),t.alignment=1,t.width=n,t.height=i,t.channels=f,t.format=t.internalformat=st[f],t.needsFree=!0}}else t.width=t.width||1,t.height=t.height||1,t.channels=t.channels||4}function d(e,r,a,i,o){var s=e.element,l=e.data,c=e.internalformat,u=e.format,f=e.type,p=e.width,d=e.height;h(e),s?t.texSubImage2D(r,o,a,i,u,f,s):e.compressed?t.compressedTexSubImage2D(r,o,a,i,c,p,d,l):e.needsCopy?(n(),t.copyTexSubImage2D(r,o,a,i,e.xOffset,e.yOffset,p,d)):t.texSubImage2D(r,o,a,i,p,d,u,f,l)}function v(){return gt.pop()||new f}function k(t){t.needsFree&&Y.freeType(t.data),f.call(t),gt.push(t)}function A(){s.call(this),this.genMipmaps=!1,this.mipmapHint=4352,this.mipmask=0,this.images=Array(16)}function M(t,e,r){var n=t.images[0]=v();t.mipmask=1,n.width=t.width=e,n.height=t.height=r,n.channels=t.channels=4}function S(t,e){var r=null;if(_(e))c(r=t.images[0]=v(),t),p(r,e),t.mipmask=1;else if(u(t,e),Array.isArray(e.mipmap))for(var n=e.mipmap,a=0;a<n.length;++a)c(r=t.images[a]=v(),t),r.width>>=a,r.height>>=a,p(r,n[a]),t.mipmask|=1<<a;else c(r=t.images[0]=v(),t),p(r,e),t.mipmask=1;c(t,t.images[0])}function E(e,r){for(var a=e.images,i=0;i<a.length&&a[i];++i){var o=a[i],s=r,l=i,c=o.element,u=o.data,f=o.internalformat,p=o.format,d=o.type,g=o.width,m=o.height;h(o),c?t.texImage2D(s,l,p,p,d,c):o.compressed?t.compressedTexImage2D(s,l,f,g,m,0,u):o.needsCopy?(n(),t.copyTexImage2D(s,l,p,o.xOffset,o.yOffset,g,m,0)):t.texImage2D(s,l,p,g,m,0,p,d,u||null)}}function C(){var t=mt.pop()||new A;s.call(t);for(var e=t.mipmask=0;16>e;++e)t.images[e]=null;return t}function L(t){for(var e=t.images,r=0;r<e.length;++r)e[r]&&k(e[r]),e[r]=null;mt.push(t)}function P(){this.magFilter=this.minFilter=9728,this.wrapT=this.wrapS=33071,this.anisotropic=1,this.genMipmaps=!1,this.mipmapHint=4352}function I(t,e){"min"in e&&(t.minFilter=U[e.min],0<=ot.indexOf(t.minFilter)&&!("faces"in e)&&(t.genMipmaps=!0)),"mag"in e&&(t.magFilter=j[e.mag]);var r=t.wrapS,n=t.wrapT;if("wrap"in e){var a=e.wrap;"string"==typeof a?r=n=N[a]:Array.isArray(a)&&(r=N[a[0]],n=N[a[1]])}else"wrapS"in e&&(r=N[e.wrapS]),"wrapT"in e&&(n=N[e.wrapT]);if(t.wrapS=r,t.wrapT=n,"anisotropic"in e&&(t.anisotropic=e.anisotropic),"mipmap"in e){switch(r=!1,typeof e.mipmap){case"string":t.mipmapHint=B[e.mipmap],r=t.genMipmaps=!0;break;case"boolean":r=t.genMipmaps=e.mipmap;break;case"object":t.genMipmaps=!1,r=!0}!r||"min"in e||(t.minFilter=9984)}}function z(r,n){t.texParameteri(n,10241,r.minFilter),t.texParameteri(n,10240,r.magFilter),t.texParameteri(n,10242,r.wrapS),t.texParameteri(n,10243,r.wrapT),e.ext_texture_filter_anisotropic&&t.texParameteri(n,34046,r.anisotropic),r.genMipmaps&&(t.hint(33170,r.mipmapHint),t.generateMipmap(n))}function O(e){s.call(this),this.mipmask=0,this.internalformat=6408,this.id=vt++,this.refCount=1,this.target=e,this.texture=t.createTexture(),this.unit=-1,this.bindCount=0,this.texInfo=new P,o.profile&&(this.stats={size:0})}function D(e){t.activeTexture(33984),t.bindTexture(e.target,e.texture)}function R(){var e=bt[0];e?t.bindTexture(e.target,e.texture):t.bindTexture(3553,null)}function F(e){var r=e.texture,n=e.unit,a=e.target;0<=n&&(t.activeTexture(33984+n),t.bindTexture(a,null),bt[n]=null),t.deleteTexture(r),e.texture=null,e.params=null,e.pixels=null,e.refCount=0,delete yt[e.id],i.textureCount--}var B={"don't care":4352,"dont care":4352,nice:4354,fast:4353},N={repeat:10497,clamp:33071,mirror:33648},j={nearest:9728,linear:9729},U=V({mipmap:9987,"nearest mipmap nearest":9984,"linear mipmap nearest":9985,"nearest mipmap linear":9986,"linear mipmap linear":9987},j),q={none:0,browser:37444},H={uint8:5121,rgba4:32819,rgb565:33635,"rgb5 a1":32820},G={alpha:6406,luminance:6409,"luminance alpha":6410,rgb:6407,rgba:6408,rgba4:32854,"rgb5 a1":32855,rgb565:36194},W={};e.ext_srgb&&(G.srgb=35904,G.srgba=35906),e.oes_texture_float&&(H.float32=H.float=5126),e.oes_texture_half_float&&(H.float16=H["half float"]=36193),e.webgl_depth_texture&&(V(G,{depth:6402,"depth stencil":34041}),V(H,{uint16:5123,uint32:5125,"depth stencil":34042})),e.webgl_compressed_texture_s3tc&&V(W,{"rgb s3tc dxt1":33776,"rgba s3tc dxt1":33777,"rgba s3tc dxt3":33778,"rgba s3tc dxt5":33779}),e.webgl_compressed_texture_atc&&V(W,{"rgb atc":35986,"rgba atc explicit alpha":35987,"rgba atc interpolated alpha":34798}),e.webgl_compressed_texture_pvrtc&&V(W,{"rgb pvrtc 4bppv1":35840,"rgb pvrtc 2bppv1":35841,"rgba pvrtc 4bppv1":35842,"rgba pvrtc 2bppv1":35843}),e.webgl_compressed_texture_etc1&&(W["rgb etc1"]=36196);var Q=Array.prototype.slice.call(t.getParameter(34467));Object.keys(W).forEach((function(t){var e=W[t];0<=Q.indexOf(e)&&(G[t]=e)}));var $=Object.keys(G);r.textureFormats=$;var tt=[];Object.keys(G).forEach((function(t){tt[G[t]]=t}));var et=[];Object.keys(H).forEach((function(t){et[H[t]]=t}));var rt=[];Object.keys(j).forEach((function(t){rt[j[t]]=t}));var nt=[];Object.keys(U).forEach((function(t){nt[U[t]]=t}));var at=[];Object.keys(N).forEach((function(t){at[N[t]]=t}));var it=$.reduce((function(t,r){var n=G[r];return 6409===n||6406===n||6409===n||6410===n||6402===n||34041===n||e.ext_srgb&&(35904===n||35906===n)?t[n]=n:32855===n||0<=r.indexOf("rgba")?t[n]=6408:t[n]=6407,t}),{}),gt=[],mt=[],vt=0,yt={},xt=r.maxTextureUnits,bt=Array(xt).map((function(){return null}));return V(O.prototype,{bind:function(){this.bindCount+=1;var e=this.unit;if(0>e){for(var r=0;r<xt;++r){var n=bt[r];if(n){if(0<n.bindCount)continue;n.unit=-1}bt[r]=this,e=r;break}o.profile&&i.maxTextureUnits<e+1&&(i.maxTextureUnits=e+1),this.unit=e,t.activeTexture(33984+e),t.bindTexture(this.target,this.texture)}return e},unbind:function(){--this.bindCount},decRef:function(){0>=--this.refCount&&F(this)}}),o.profile&&(i.getTotalTextureSize=function(){var t=0;return Object.keys(yt).forEach((function(e){t+=yt[e].stats.size})),t}),{create2D:function(e,r){function n(t,e){var r=a.texInfo;P.call(r);var i=C();return"number"==typeof t?M(i,0|t,"number"==typeof e?0|e:0|t):t?(I(r,t),S(i,t)):M(i,1,1),r.genMipmaps&&(i.mipmask=(i.width<<1)-1),a.mipmask=i.mipmask,c(a,i),a.internalformat=i.internalformat,n.width=i.width,n.height=i.height,D(a),E(i,3553),z(r,3553),R(),L(i),o.profile&&(a.stats.size=T(a.internalformat,a.type,i.width,i.height,r.genMipmaps,!1)),n.format=tt[a.internalformat],n.type=et[a.type],n.mag=rt[r.magFilter],n.min=nt[r.minFilter],n.wrapS=at[r.wrapS],n.wrapT=at[r.wrapT],n}var a=new O(3553);return yt[a.id]=a,i.textureCount++,n(e,r),n.subimage=function(t,e,r,i){e|=0,r|=0,i|=0;var o=v();return c(o,a),o.width=0,o.height=0,p(o,t),o.width=o.width||(a.width>>i)-e,o.height=o.height||(a.height>>i)-r,D(a),d(o,3553,e,r,i),R(),k(o),n},n.resize=function(e,r){var i=0|e,s=0|r||i;if(i===a.width&&s===a.height)return n;n.width=a.width=i,n.height=a.height=s,D(a);for(var l=0;a.mipmask>>l;++l){var c=i>>l,u=s>>l;if(!c||!u)break;t.texImage2D(3553,l,a.format,c,u,0,a.format,a.type,null)}return R(),o.profile&&(a.stats.size=T(a.internalformat,a.type,i,s,!1,!1)),n},n._reglType="texture2d",n._texture=a,o.profile&&(n.stats=a.stats),n.destroy=function(){a.decRef()},n},createCube:function(e,r,n,a,s,l){function h(t,e,r,n,a,i){var s,l=f.texInfo;for(P.call(l),s=0;6>s;++s)g[s]=C();if("number"!=typeof t&&t){if("object"==typeof t)if(e)S(g[0],t),S(g[1],e),S(g[2],r),S(g[3],n),S(g[4],a),S(g[5],i);else if(I(l,t),u(f,t),"faces"in t)for(t=t.faces,s=0;6>s;++s)c(g[s],f),S(g[s],t[s]);else for(s=0;6>s;++s)S(g[s],t)}else for(t=0|t||1,s=0;6>s;++s)M(g[s],t,t);for(c(f,g[0]),f.mipmask=l.genMipmaps?(g[0].width<<1)-1:g[0].mipmask,f.internalformat=g[0].internalformat,h.width=g[0].width,h.height=g[0].height,D(f),s=0;6>s;++s)E(g[s],34069+s);for(z(l,34067),R(),o.profile&&(f.stats.size=T(f.internalformat,f.type,h.width,h.height,l.genMipmaps,!0)),h.format=tt[f.internalformat],h.type=et[f.type],h.mag=rt[l.magFilter],h.min=nt[l.minFilter],h.wrapS=at[l.wrapS],h.wrapT=at[l.wrapT],s=0;6>s;++s)L(g[s]);return h}var f=new O(34067);yt[f.id]=f,i.cubeCount++;var g=Array(6);return h(e,r,n,a,s,l),h.subimage=function(t,e,r,n,a){r|=0,n|=0,a|=0;var i=v();return c(i,f),i.width=0,i.height=0,p(i,e),i.width=i.width||(f.width>>a)-r,i.height=i.height||(f.height>>a)-n,D(f),d(i,34069+t,r,n,a),R(),k(i),h},h.resize=function(e){if((e|=0)!==f.width){h.width=f.width=e,h.height=f.height=e,D(f);for(var r=0;6>r;++r)for(var n=0;f.mipmask>>n;++n)t.texImage2D(34069+r,n,f.format,e>>n,e>>n,0,f.format,f.type,null);return R(),o.profile&&(f.stats.size=T(f.internalformat,f.type,h.width,h.height,!1,!0)),h}},h._reglType="textureCube",h._texture=f,o.profile&&(h.stats=f.stats),h.destroy=function(){f.decRef()},h},clear:function(){for(var e=0;e<xt;++e)t.activeTexture(33984+e),t.bindTexture(3553,null),bt[e]=null;X(yt).forEach(F),i.cubeCount=0,i.textureCount=0},getTexture:function(t){return null},restore:function(){for(var e=0;e<xt;++e){var r=bt[e];r&&(r.bindCount=0,r.unit=-1,bt[e]=null)}X(yt).forEach((function(e){e.texture=t.createTexture(),t.bindTexture(e.target,e.texture);for(var r=0;32>r;++r)if(0!=(e.mipmask&1<<r))if(3553===e.target)t.texImage2D(3553,r,e.internalformat,e.width>>r,e.height>>r,0,e.internalformat,e.type,null);else for(var n=0;6>n;++n)t.texImage2D(34069+n,r,e.internalformat,e.width>>r,e.height>>r,0,e.internalformat,e.type,null);z(e.texInfo,e.target)}))}}}function A(t,e,r,n,a,i){function o(t,e,r){this.target=t,this.texture=e,this.renderbuffer=r;var n=t=0;e?(t=e.width,n=e.height):r&&(t=r.width,n=r.height),this.width=t,this.height=n}function s(t){t&&(t.texture&&t.texture._texture.decRef(),t.renderbuffer&&t.renderbuffer._renderbuffer.decRef())}function l(t,e,r){t&&(t.texture?t.texture._texture.refCount+=1:t.renderbuffer._renderbuffer.refCount+=1)}function c(e,r){r&&(r.texture?t.framebufferTexture2D(36160,e,r.target,r.texture._texture.texture,0):t.framebufferRenderbuffer(36160,e,36161,r.renderbuffer._renderbuffer.renderbuffer))}function u(t){var e=3553,r=null,n=null,a=t;return"object"==typeof t&&(a=t.data,"target"in t&&(e=0|t.target)),"texture2d"===(t=a._reglType)||"textureCube"===t?r=a:"renderbuffer"===t&&(n=a,e=36161),new o(e,r,n)}function h(t,e,r,i,s){return r?((t=n.create2D({width:t,height:e,format:i,type:s}))._texture.refCount=0,new o(3553,t,null)):((t=a.create({width:t,height:e,format:i}))._renderbuffer.refCount=0,new o(36161,null,t))}function f(t){return t&&(t.texture||t.renderbuffer)}function p(t,e,r){t&&(t.texture?t.texture.resize(e,r):t.renderbuffer&&t.renderbuffer.resize(e,r),t.width=e,t.height=r)}function d(){this.id=T++,k[this.id]=this,this.framebuffer=t.createFramebuffer(),this.height=this.width=0,this.colorAttachments=[],this.depthStencilAttachment=this.stencilAttachment=this.depthAttachment=null}function g(t){t.colorAttachments.forEach(s),s(t.depthAttachment),s(t.stencilAttachment),s(t.depthStencilAttachment)}function m(e){t.deleteFramebuffer(e.framebuffer),e.framebuffer=null,i.framebufferCount--,delete k[e.id]}function v(e){var n;t.bindFramebuffer(36160,e.framebuffer);var a=e.colorAttachments;for(n=0;n<a.length;++n)c(36064+n,a[n]);for(n=a.length;n<r.maxColorAttachments;++n)t.framebufferTexture2D(36160,36064+n,3553,null,0);t.framebufferTexture2D(36160,33306,3553,null,0),t.framebufferTexture2D(36160,36096,3553,null,0),t.framebufferTexture2D(36160,36128,3553,null,0),c(36096,e.depthAttachment),c(36128,e.stencilAttachment),c(33306,e.depthStencilAttachment),t.checkFramebufferStatus(36160),t.isContextLost(),t.bindFramebuffer(36160,x.next?x.next.framebuffer:null),x.cur=x.next,t.getError()}function y(t,e){function r(t,e){var a,i=0,o=0,s=!0,c=!0;a=null;var p=!0,d="rgba",m="uint8",y=1,x=null,w=null,T=null,k=!1;"number"==typeof t?(i=0|t,o=0|e||i):t?("shape"in t?(i=(o=t.shape)[0],o=o[1]):("radius"in t&&(i=o=t.radius),"width"in t&&(i=t.width),"height"in t&&(o=t.height)),("color"in t||"colors"in t)&&(a=t.color||t.colors,Array.isArray(a)),a||("colorCount"in t&&(y=0|t.colorCount),"colorTexture"in t&&(p=!!t.colorTexture,d="rgba4"),"colorType"in t&&(m=t.colorType,!p)&&("half float"===m||"float16"===m?d="rgba16f":"float"!==m&&"float32"!==m||(d="rgba32f")),"colorFormat"in t&&(d=t.colorFormat,0<=b.indexOf(d)?p=!0:0<=_.indexOf(d)&&(p=!1))),("depthTexture"in t||"depthStencilTexture"in t)&&(k=!(!t.depthTexture&&!t.depthStencilTexture)),"depth"in t&&("boolean"==typeof t.depth?s=t.depth:(x=t.depth,c=!1)),"stencil"in t&&("boolean"==typeof t.stencil?c=t.stencil:(w=t.stencil,s=!1)),"depthStencil"in t&&("boolean"==typeof t.depthStencil?s=c=t.depthStencil:(T=t.depthStencil,c=s=!1))):i=o=1;var A=null,M=null,S=null,E=null;if(Array.isArray(a))A=a.map(u);else if(a)A=[u(a)];else for(A=Array(y),a=0;a<y;++a)A[a]=h(i,o,p,d,m);for(i=i||A[0].width,o=o||A[0].height,x?M=u(x):s&&!c&&(M=h(i,o,k,"depth","uint32")),w?S=u(w):c&&!s&&(S=h(i,o,!1,"stencil","uint8")),T?E=u(T):!x&&!w&&c&&s&&(E=h(i,o,k,"depth stencil","depth stencil")),s=null,a=0;a<A.length;++a)l(A[a]),A[a]&&A[a].texture&&(c=bt[A[a].texture._texture.format]*_t[A[a].texture._texture.type],null===s&&(s=c));return l(M),l(S),l(E),g(n),n.width=i,n.height=o,n.colorAttachments=A,n.depthAttachment=M,n.stencilAttachment=S,n.depthStencilAttachment=E,r.color=A.map(f),r.depth=f(M),r.stencil=f(S),r.depthStencil=f(E),r.width=n.width,r.height=n.height,v(n),r}var n=new d;return i.framebufferCount++,r(t,e),V(r,{resize:function(t,e){var a=Math.max(0|t,1),i=Math.max(0|e||a,1);if(a===n.width&&i===n.height)return r;for(var o=n.colorAttachments,s=0;s<o.length;++s)p(o[s],a,i);return p(n.depthAttachment,a,i),p(n.stencilAttachment,a,i),p(n.depthStencilAttachment,a,i),n.width=r.width=a,n.height=r.height=i,v(n),r},_reglType:"framebuffer",_framebuffer:n,destroy:function(){m(n),g(n)},use:function(t){x.setFBO({framebuffer:r},t)}})}var x={cur:null,next:null,dirty:!1,setFBO:null},b=["rgba"],_=["rgba4","rgb565","rgb5 a1"];e.ext_srgb&&_.push("srgba"),e.ext_color_buffer_half_float&&_.push("rgba16f","rgb16f"),e.webgl_color_buffer_float&&_.push("rgba32f");var w=["uint8"];e.oes_texture_half_float&&w.push("half float","float16"),e.oes_texture_float&&w.push("float","float32");var T=0,k={};return V(x,{getFramebuffer:function(t){return"function"==typeof t&&"framebuffer"===t._reglType&&(t=t._framebuffer)instanceof d?t:null},create:y,createCube:function(t){function e(t){var a,i={color:null},o=0,s=null;a="rgba";var l="uint8",c=1;if("number"==typeof t?o=0|t:t?("shape"in t?o=t.shape[0]:("radius"in t&&(o=0|t.radius),"width"in t?o=0|t.width:"height"in t&&(o=0|t.height)),("color"in t||"colors"in t)&&(s=t.color||t.colors,Array.isArray(s)),s||("colorCount"in t&&(c=0|t.colorCount),"colorType"in t&&(l=t.colorType),"colorFormat"in t&&(a=t.colorFormat)),"depth"in t&&(i.depth=t.depth),"stencil"in t&&(i.stencil=t.stencil),"depthStencil"in t&&(i.depthStencil=t.depthStencil)):o=1,s)if(Array.isArray(s))for(t=[],a=0;a<s.length;++a)t[a]=s[a];else t=[s];else for(t=Array(c),s={radius:o,format:a,type:l},a=0;a<c;++a)t[a]=n.createCube(s);for(i.color=Array(t.length),a=0;a<t.length;++a)c=t[a],o=o||c.width,i.color[a]={target:34069,data:t[a]};for(a=0;6>a;++a){for(c=0;c<t.length;++c)i.color[c].target=34069+a;0<a&&(i.depth=r[0].depth,i.stencil=r[0].stencil,i.depthStencil=r[0].depthStencil),r[a]?r[a](i):r[a]=y(i)}return V(e,{width:o,height:o,color:t})}var r=Array(6);return e(t),V(e,{faces:r,resize:function(t){var n=0|t;if(n===e.width)return e;var a=e.color;for(t=0;t<a.length;++t)a[t].resize(n);for(t=0;6>t;++t)r[t].resize(n);return e.width=e.height=n,e},_reglType:"framebufferCube",destroy:function(){r.forEach((function(t){t.destroy()}))}})},clear:function(){X(k).forEach(m)},restore:function(){x.cur=null,x.next=null,x.dirty=!0,X(k).forEach((function(e){e.framebuffer=t.createFramebuffer(),v(e)}))}})}function M(){this.w=this.z=this.y=this.x=this.state=0,this.buffer=null,this.size=0,this.normalized=!1,this.type=5126,this.divisor=this.stride=this.offset=0}function S(t,e,r,n,a){function i(){this.id=++c,this.attributes=[];var t=e.oes_vertex_array_object;this.vao=t?t.createVertexArrayOES():null,u[this.id]=this,this.buffers=[]}var o=r.maxAttributes,s=Array(o);for(r=0;r<o;++r)s[r]=new M;var c=0,u={},h={Record:M,scope:{},state:s,currentVAO:null,targetVAO:null,restore:e.oes_vertex_array_object?function(){e.oes_vertex_array_object&&X(u).forEach((function(t){t.refresh()}))}:function(){},createVAO:function(t){function e(t){for(var n=0;n<r.buffers.length;++n)r.buffers[n].destroy();r.buffers.length=0,(n=r.attributes).length=t.length;for(var i=0;i<t.length;++i){var o=t[i],s=n[i]=new M;Array.isArray(o)||Z(o)||l(o)?(o=a.create(o,34962,!1,!0),s.buffer=a.getBuffer(o),s.size=0|s.buffer.dimension,s.normalized=!1,s.type=s.buffer.dtype,s.offset=0,s.stride=0,s.divisor=0,s.state=1,r.buffers.push(o)):a.getBuffer(o)?(s.buffer=a.getBuffer(o),s.size=0|s.buffer.dimension,s.normalized=!1,s.type=s.buffer.dtype,s.offset=0,s.stride=0,s.divisor=0,s.state=1):a.getBuffer(o.buffer)?(s.buffer=a.getBuffer(o.buffer),s.size=0|(+o.size||s.buffer.dimension),s.normalized=!!o.normalized||!1,s.type="type"in o?Q[o.type]:s.buffer.dtype,s.offset=0|(o.offset||0),s.stride=0|(o.stride||0),s.divisor=0|(o.divisor||0),s.state=1):"x"in o&&(s.x=+o.x||0,s.y=+o.y||0,s.z=+o.z||0,s.w=+o.w||0,s.state=2)}return r.refresh(),e}var r=new i;return n.vaoCount+=1,e.destroy=function(){r.destroy()},e._vao=r,e._reglType="vao",e(t)},getVAO:function(t){return"function"==typeof t&&t._vao?t._vao:null},destroyBuffer:function(e){for(var r=0;r<s.length;++r){var n=s[r];n.buffer===e&&(t.disableVertexAttribArray(r),n.buffer=null)}},setVAO:e.oes_vertex_array_object?function(t){if(t!==h.currentVAO){var r=e.oes_vertex_array_object;t?r.bindVertexArrayOES(t.vao):r.bindVertexArrayOES(null),h.currentVAO=t}}:function(r){if(r!==h.currentVAO){if(r)r.bindAttrs();else for(var n=e.angle_instanced_arrays,a=0;a<s.length;++a){var i=s[a];i.buffer?(t.enableVertexAttribArray(a),t.vertexAttribPointer(a,i.size,i.type,i.normalized,i.stride,i.offfset),n&&n.vertexAttribDivisorANGLE(a,i.divisor)):(t.disableVertexAttribArray(a),t.vertexAttrib4f(a,i.x,i.y,i.z,i.w))}h.currentVAO=r}},clear:e.oes_vertex_array_object?function(){X(u).forEach((function(t){t.destroy()}))}:function(){}};return i.prototype.bindAttrs=function(){for(var r=e.angle_instanced_arrays,n=this.attributes,a=0;a<n.length;++a){var i=n[a];i.buffer?(t.enableVertexAttribArray(a),t.bindBuffer(34962,i.buffer.buffer),t.vertexAttribPointer(a,i.size,i.type,i.normalized,i.stride,i.offset),r&&r.vertexAttribDivisorANGLE(a,i.divisor)):(t.disableVertexAttribArray(a),t.vertexAttrib4f(a,i.x,i.y,i.z,i.w))}for(r=n.length;r<o;++r)t.disableVertexAttribArray(r)},i.prototype.refresh=function(){var t=e.oes_vertex_array_object;t&&(t.bindVertexArrayOES(this.vao),this.bindAttrs(),h.currentVAO=this)},i.prototype.destroy=function(){if(this.vao){var t=e.oes_vertex_array_object;this===h.currentVAO&&(h.currentVAO=null,t.bindVertexArrayOES(null)),t.deleteVertexArrayOES(this.vao),this.vao=null}u[this.id]&&(delete u[this.id],--n.vaoCount)},h}function E(t,e,r,n){function a(t,e,r,n){this.name=t,this.id=e,this.location=r,this.info=n}function i(t,e){for(var r=0;r<t.length;++r)if(t[r].id===e.id)return void(t[r].location=e.location);t.push(e)}function o(r,n,a){if(!(o=(a=35632===r?c:u)[n])){var i=e.str(n),o=t.createShader(r);t.shaderSource(o,i),t.compileShader(o),a[n]=o}return o}function s(t,e){this.id=p++,this.fragId=t,this.vertId=e,this.program=null,this.uniforms=[],this.attributes=[],n.profile&&(this.stats={uniformsCount:0,attributesCount:0})}function l(r,s,l){var c;c=o(35632,r.fragId);var u=o(35633,r.vertId);if(s=r.program=t.createProgram(),t.attachShader(s,c),t.attachShader(s,u),l)for(c=0;c<l.length;++c)u=l[c],t.bindAttribLocation(s,u[0],u[1]);t.linkProgram(s),u=t.getProgramParameter(s,35718),n.profile&&(r.stats.uniformsCount=u);var h=r.uniforms;for(c=0;c<u;++c)if(l=t.getActiveUniform(s,c))if(1<l.size)for(var f=0;f<l.size;++f){var p=l.name.replace("[0]","["+f+"]");i(h,new a(p,e.id(p),t.getUniformLocation(s,p),l))}else i(h,new a(l.name,e.id(l.name),t.getUniformLocation(s,l.name),l));for(u=t.getProgramParameter(s,35721),n.profile&&(r.stats.attributesCount=u),r=r.attributes,c=0;c<u;++c)(l=t.getActiveAttrib(s,c))&&i(r,new a(l.name,e.id(l.name),t.getAttribLocation(s,l.name),l))}var c={},u={},h={},f=[],p=0;return n.profile&&(r.getMaxUniformsCount=function(){var t=0;return f.forEach((function(e){e.stats.uniformsCount>t&&(t=e.stats.uniformsCount)})),t},r.getMaxAttributesCount=function(){var t=0;return f.forEach((function(e){e.stats.attributesCount>t&&(t=e.stats.attributesCount)})),t}),{clear:function(){var e=t.deleteShader.bind(t);X(c).forEach(e),c={},X(u).forEach(e),u={},f.forEach((function(e){t.deleteProgram(e.program)})),f.length=0,h={},r.shaderCount=0},program:function(t,e,n,a){var i=h[e];i||(i=h[e]={});var o=i[t];return o&&!a?o:(e=new s(e,t),r.shaderCount++,l(e,n,a),o||(i[t]=e),f.push(e),e)},restore:function(){c={},u={};for(var t=0;t<f.length;++t)l(f[t],null,f[t].attributes.map((function(t){return[t.location,t.name]})))},shader:o,frag:-1,vert:-1}}function C(t,e,r,n,a,i,o){function s(a){var i;i=null===e.next?5121:e.next.colorAttachments[0].texture._texture.type;var o=0,s=0,l=n.framebufferWidth,c=n.framebufferHeight,u=null;return Z(a)?u=a:a&&(o=0|a.x,s=0|a.y,l=0|(a.width||n.framebufferWidth-o),c=0|(a.height||n.framebufferHeight-s),u=a.data||null),r(),a=l*c*4,u||(5121===i?u=new Uint8Array(a):5126===i&&(u=u||new Float32Array(a))),t.pixelStorei(3333,4),t.readPixels(o,s,l,c,6408,i,u),u}return function(t){return t&&"framebuffer"in t?function(t){var r;return e.setFBO({framebuffer:t.framebuffer},(function(){r=s(t)})),r}(t):s(t)}}function L(t){return Array.prototype.slice.call(t)}function P(t){return L(t).join("")}function I(){function t(){var t=[],e=[];return V((function(){t.push.apply(t,L(arguments))}),{def:function(){var n="v"+r++;return e.push(n),0<arguments.length&&(t.push(n,"="),t.push.apply(t,L(arguments)),t.push(";")),n},toString:function(){return P([0<e.length?"var "+e.join(",")+";":"",P(t)])}})}function e(){function e(t,e){n(t,e,"=",r.def(t,e),";")}var r=t(),n=t(),a=r.toString,i=n.toString;return V((function(){r.apply(r,L(arguments))}),{def:r.def,entry:r,exit:n,save:e,set:function(t,n,a){e(t,n),r(t,n,"=",a,";")},toString:function(){return a()+i()}})}var r=0,n=[],a=[],i=t(),o={};return{global:i,link:function(t){for(var e=0;e<a.length;++e)if(a[e]===t)return n[e];return e="g"+r++,n.push(e),a.push(t),e},block:t,proc:function(t,r){function n(){var t="a"+a.length;return a.push(t),t}var a=[];r=r||0;for(var i=0;i<r;++i)n();var s=(i=e()).toString;return o[t]=V(i,{arg:n,toString:function(){return P(["function(",a.join(),"){",s(),"}"])}})},scope:e,cond:function(){var t=P(arguments),r=e(),n=e(),a=r.toString,i=n.toString;return V(r,{then:function(){return r.apply(r,L(arguments)),this},else:function(){return n.apply(n,L(arguments)),this},toString:function(){var e=i();return e&&(e="else{"+e+"}"),P(["if(",t,"){",a(),"}",e])}})},compile:function(){var t=['"use strict";',i,"return {"];Object.keys(o).forEach((function(e){t.push('"',e,'":',o[e].toString(),",")})),t.push("}");var e=P(t).replace(/;/g,";\n").replace(/}/g,"}\n").replace(/{/g,"{\n");return Function.apply(null,n.concat(e)).apply(null,a)}}}function z(t){return Array.isArray(t)||Z(t)||l(t)}function O(t){return t.sort((function(t,e){return"viewport"===t?-1:"viewport"===e?1:t<e?-1:1}))}function D(t,e,r,n){this.thisDep=t,this.contextDep=e,this.propDep=r,this.append=n}function R(t){return t&&!(t.thisDep||t.contextDep||t.propDep)}function F(t){return new D(!1,!1,!1,t)}function B(t,e){var r=t.type;return 0===r?new D(!0,1<=(r=t.data.length),2<=r,e):4===r?new D((r=t.data).thisDep,r.contextDep,r.propDep,e):new D(3===r,2===r,1===r,e)}function N(t,e,r,n,a,o,s,l,c,u,h,f,p,d,g){function v(t){return t.replace(".","_")}function y(t,e,r){var n=v(t);rt.push(t),et[n]=tt[n]=!!r,at[n]=e}function x(t,e,r){var n=v(t);rt.push(t),Array.isArray(r)?(tt[n]=r.slice(),et[n]=r.slice()):tt[n]=et[n]=r,it[n]=e}function b(){var t=I(),r=t.link,n=t.global;t.id=lt++,t.batchId="0";var a=r(ot),i=t.shared={props:"a0"};Object.keys(ot).forEach((function(t){i[t]=n.def(a,".",t)}));var o=t.next={},s=t.current={};Object.keys(it).forEach((function(t){Array.isArray(tt[t])&&(o[t]=n.def(i.next,".",t),s[t]=n.def(i.current,".",t))}));var l=t.constants={};Object.keys(st).forEach((function(t){l[t]=n.def(JSON.stringify(st[t]))})),t.invoke=function(e,n){switch(n.type){case 0:var a=["this",i.context,i.props,t.batchId];return e.def(r(n.data),".call(",a.slice(0,Math.max(n.data.length+1,4)),")");case 1:return e.def(i.props,n.data);case 2:return e.def(i.context,n.data);case 3:return e.def("this",n.data);case 4:return n.data.append(t,e),n.data.ref}},t.attribCache={};var c={};return t.scopeAttrib=function(t){if((t=e.id(t))in c)return c[t];var n=u.scope[t];return n||(n=u.scope[t]=new X),c[t]=r(n)},t}function _(t,e){var r=t.static,n=t.dynamic;if("framebuffer"in r){var a=r.framebuffer;return a?(a=l.getFramebuffer(a),F((function(t,e){var r=t.link(a),n=t.shared;return e.set(n.framebuffer,".next",r),n=n.context,e.set(n,".framebufferWidth",r+".width"),e.set(n,".framebufferHeight",r+".height"),r}))):F((function(t,e){var r=t.shared;return e.set(r.framebuffer,".next","null"),r=r.context,e.set(r,".framebufferWidth",r+".drawingBufferWidth"),e.set(r,".framebufferHeight",r+".drawingBufferHeight"),"null"}))}if("framebuffer"in n){var i=n.framebuffer;return B(i,(function(t,e){var r=t.invoke(e,i),n=t.shared,a=n.framebuffer;r=e.def(a,".getFramebuffer(",r,")");return e.set(a,".next",r),n=n.context,e.set(n,".framebufferWidth",r+"?"+r+".width:"+n+".drawingBufferWidth"),e.set(n,".framebufferHeight",r+"?"+r+".height:"+n+".drawingBufferHeight"),r}))}return null}function w(t,r,n){function a(t){if(t in i){var r=e.id(i[t]);return(t=F((function(){return r}))).id=r,t}if(t in o){var n=o[t];return B(n,(function(t,e){var r=t.invoke(e,n);return e.def(t.shared.strings,".id(",r,")")}))}return null}var i=t.static,o=t.dynamic,s=a("frag"),l=a("vert"),c=null;return R(s)&&R(l)?(c=h.program(l.id,s.id,null,n),t=F((function(t,e){return t.link(c)}))):t=new D(s&&s.thisDep||l&&l.thisDep,s&&s.contextDep||l&&l.contextDep,s&&s.propDep||l&&l.propDep,(function(t,e){var r,n,a=t.shared.shader;return r=s?s.append(t,e):e.def(a,".","frag"),n=l?l.append(t,e):e.def(a,".","vert"),e.def(a+".program("+n+","+r+")")})),{frag:s,vert:l,progVar:t,program:c}}function T(t,e){function r(t,e){if(t in n){var r=0|n[t];return F((function(t,n){return e&&(t.OFFSET=r),r}))}if(t in a){var o=a[t];return B(o,(function(t,r){var n=t.invoke(r,o);return e&&(t.OFFSET=n),n}))}return e&&i?F((function(t,e){return t.OFFSET="0",0})):null}var n=t.static,a=t.dynamic,i=function(){if("elements"in n){var t=n.elements;z(t)?t=o.getElements(o.create(t,!0)):t&&(t=o.getElements(t));var e=F((function(e,r){if(t){var n=e.link(t);return e.ELEMENTS=n}return e.ELEMENTS=null}));return e.value=t,e}if("elements"in a){var r=a.elements;return B(r,(function(t,e){var n=(a=t.shared).isBufferArgs,a=a.elements,i=t.invoke(e,r),o=e.def("null");n=e.def(n,"(",i,")"),i=t.cond(n).then(o,"=",a,".createStream(",i,");").else(o,"=",a,".getElements(",i,");");return e.entry(i),e.exit(t.cond(n).then(a,".destroyStream(",o,");")),t.ELEMENTS=o}))}return null}(),s=r("offset",!0);return{elements:i,primitive:function(){if("primitive"in n){var t=n.primitive;return F((function(e,r){return nt[t]}))}if("primitive"in a){var e=a.primitive;return B(e,(function(t,r){var n=t.constants.primTypes,a=t.invoke(r,e);return r.def(n,"[",a,"]")}))}return i?R(i)?i.value?F((function(t,e){return e.def(t.ELEMENTS,".primType")})):F((function(){return 4})):new D(i.thisDep,i.contextDep,i.propDep,(function(t,e){var r=t.ELEMENTS;return e.def(r,"?",r,".primType:",4)})):null}(),count:function(){if("count"in n){var t=0|n.count;return F((function(){return t}))}if("count"in a){var e=a.count;return B(e,(function(t,r){return t.invoke(r,e)}))}return i?R(i)?i?s?new D(s.thisDep,s.contextDep,s.propDep,(function(t,e){return e.def(t.ELEMENTS,".vertCount-",t.OFFSET)})):F((function(t,e){return e.def(t.ELEMENTS,".vertCount")})):F((function(){return-1})):new D(i.thisDep||s.thisDep,i.contextDep||s.contextDep,i.propDep||s.propDep,(function(t,e){var r=t.ELEMENTS;return t.OFFSET?e.def(r,"?",r,".vertCount-",t.OFFSET,":-1"):e.def(r,"?",r,".vertCount:-1")})):null}(),instances:r("instances",!1),offset:s}}function k(t,r){var n=t.static,i=t.dynamic,o={};return Object.keys(n).forEach((function(t){var r=n[t],i=e.id(t),s=new X;if(z(r))s.state=1,s.buffer=a.getBuffer(a.create(r,34962,!1,!0)),s.type=0;else if(c=a.getBuffer(r))s.state=1,s.buffer=c,s.type=0;else if("constant"in r){var l=r.constant;s.buffer="null",s.state=2,"number"==typeof l?s.x=l:wt.forEach((function(t,e){e<l.length&&(s[t]=l[e])}))}else{var c=z(r.buffer)?a.getBuffer(a.create(r.buffer,34962,!1,!0)):a.getBuffer(r.buffer),u=0|r.offset,h=0|r.stride,f=0|r.size,p=!!r.normalized,d=0;"type"in r&&(d=Q[r.type]),r=0|r.divisor,s.buffer=c,s.state=1,s.size=f,s.normalized=p,s.type=d||c.dtype,s.offset=u,s.stride=h,s.divisor=r}o[t]=F((function(t,e){var r=t.attribCache;if(i in r)return r[i];var n={isStream:!1};return Object.keys(s).forEach((function(t){n[t]=s[t]})),s.buffer&&(n.buffer=t.link(s.buffer),n.type=n.type||n.buffer+".dtype"),r[i]=n}))})),Object.keys(i).forEach((function(t){var e=i[t];o[t]=B(e,(function(t,r){function n(t){r(l[t],"=",a,".",t,"|0;")}var a=t.invoke(r,e),i=t.shared,o=t.constants,s=i.isBufferArgs,l=(i=i.buffer,{isStream:r.def(!1)}),c=new X;c.state=1,Object.keys(c).forEach((function(t){l[t]=r.def(""+c[t])}));var u=l.buffer,h=l.type;return r("if(",s,"(",a,")){",l.isStream,"=true;",u,"=",i,".createStream(",34962,",",a,");",h,"=",u,".dtype;","}else{",u,"=",i,".getBuffer(",a,");","if(",u,"){",h,"=",u,".dtype;",'}else if("constant" in ',a,"){",l.state,"=",2,";","if(typeof "+a+'.constant === "number"){',l[wt[0]],"=",a,".constant;",wt.slice(1).map((function(t){return l[t]})).join("="),"=0;","}else{",wt.map((function(t,e){return l[t]+"="+a+".constant.length>"+e+"?"+a+".constant["+e+"]:0;"})).join(""),"}}else{","if(",s,"(",a,".buffer)){",u,"=",i,".createStream(",34962,",",a,".buffer);","}else{",u,"=",i,".getBuffer(",a,".buffer);","}",h,'="type" in ',a,"?",o.glTypes,"[",a,".type]:",u,".dtype;",l.normalized,"=!!",a,".normalized;"),n("size"),n("offset"),n("stride"),n("divisor"),r("}}"),r.exit("if(",l.isStream,"){",i,".destroyStream(",u,");","}"),l}))})),o}function A(t,e,n,a,o){function s(t){var e=c[t];e&&(f[t]=e)}var l=function(t,e){if("string"==typeof(r=t.static).frag&&"string"==typeof r.vert){if(0<Object.keys(e.dynamic).length)return null;var r=e.static,n=Object.keys(r);if(0<n.length&&"number"==typeof r[n[0]]){for(var a=[],i=0;i<n.length;++i)a.push([0|r[n[i]],n[i]]);return a}}return null}(t,e),c=function(t,e,r){function n(t){if(t in a){var r=a[t];t=!0;var n,o,s=0|r.x,l=0|r.y;return"width"in r?n=0|r.width:t=!1,"height"in r?o=0|r.height:t=!1,new D(!t&&e&&e.thisDep,!t&&e&&e.contextDep,!t&&e&&e.propDep,(function(t,e){var a=t.shared.context,i=n;"width"in r||(i=e.def(a,".","framebufferWidth","-",s));var c=o;return"height"in r||(c=e.def(a,".","framebufferHeight","-",l)),[s,l,i,c]}))}if(t in i){var c=i[t];return t=B(c,(function(t,e){var r=t.invoke(e,c),n=t.shared.context,a=e.def(r,".x|0"),i=e.def(r,".y|0");return[a,i,e.def('"width" in ',r,"?",r,".width|0:","(",n,".","framebufferWidth","-",a,")"),r=e.def('"height" in ',r,"?",r,".height|0:","(",n,".","framebufferHeight","-",i,")")]})),e&&(t.thisDep=t.thisDep||e.thisDep,t.contextDep=t.contextDep||e.contextDep,t.propDep=t.propDep||e.propDep),t}return e?new D(e.thisDep,e.contextDep,e.propDep,(function(t,e){var r=t.shared.context;return[0,0,e.def(r,".","framebufferWidth"),e.def(r,".","framebufferHeight")]})):null}var a=t.static,i=t.dynamic;if(t=n("viewport")){var o=t;t=new D(t.thisDep,t.contextDep,t.propDep,(function(t,e){var r=o.append(t,e),n=t.shared.context;return e.set(n,".viewportWidth",r[2]),e.set(n,".viewportHeight",r[3]),r}))}return{viewport:t,scissor_box:n("scissor.box")}}(t,d=_(t)),h=T(t),f=function(t,e){var r=t.static,n=t.dynamic,a={};return rt.forEach((function(t){function e(e,i){if(t in r){var s=e(r[t]);a[o]=F((function(){return s}))}else if(t in n){var l=n[t];a[o]=B(l,(function(t,e){return i(t,e,t.invoke(e,l))}))}}var o=v(t);switch(t){case"cull.enable":case"blend.enable":case"dither":case"stencil.enable":case"depth.enable":case"scissor.enable":case"polygonOffset.enable":case"sample.alpha":case"sample.enable":case"depth.mask":return e((function(t){return t}),(function(t,e,r){return r}));case"depth.func":return e((function(t){return At[t]}),(function(t,e,r){return e.def(t.constants.compareFuncs,"[",r,"]")}));case"depth.range":return e((function(t){return t}),(function(t,e,r){return[e.def("+",r,"[0]"),e=e.def("+",r,"[1]")]}));case"blend.func":return e((function(t){return[kt["srcRGB"in t?t.srcRGB:t.src],kt["dstRGB"in t?t.dstRGB:t.dst],kt["srcAlpha"in t?t.srcAlpha:t.src],kt["dstAlpha"in t?t.dstAlpha:t.dst]]}),(function(t,e,r){function n(t,n){return e.def('"',t,n,'" in ',r,"?",r,".",t,n,":",r,".",t)}t=t.constants.blendFuncs;var a=n("src","RGB"),i=n("dst","RGB"),o=(a=e.def(t,"[",a,"]"),e.def(t,"[",n("src","Alpha"),"]"));return[a,i=e.def(t,"[",i,"]"),o,t=e.def(t,"[",n("dst","Alpha"),"]")]}));case"blend.equation":return e((function(t){return"string"==typeof t?[J[t],J[t]]:"object"==typeof t?[J[t.rgb],J[t.alpha]]:void 0}),(function(t,e,r){var n=t.constants.blendEquations,a=e.def(),i=e.def();return(t=t.cond("typeof ",r,'==="string"')).then(a,"=",i,"=",n,"[",r,"];"),t.else(a,"=",n,"[",r,".rgb];",i,"=",n,"[",r,".alpha];"),e(t),[a,i]}));case"blend.color":return e((function(t){return i(4,(function(e){return+t[e]}))}),(function(t,e,r){return i(4,(function(t){return e.def("+",r,"[",t,"]")}))}));case"stencil.mask":return e((function(t){return 0|t}),(function(t,e,r){return e.def(r,"|0")}));case"stencil.func":return e((function(t){return[At[t.cmp||"keep"],t.ref||0,"mask"in t?t.mask:-1]}),(function(t,e,r){return[t=e.def('"cmp" in ',r,"?",t.constants.compareFuncs,"[",r,".cmp]",":",7680),e.def(r,".ref|0"),e=e.def('"mask" in ',r,"?",r,".mask|0:-1")]}));case"stencil.opFront":case"stencil.opBack":return e((function(e){return["stencil.opBack"===t?1029:1028,Mt[e.fail||"keep"],Mt[e.zfail||"keep"],Mt[e.zpass||"keep"]]}),(function(e,r,n){function a(t){return r.def('"',t,'" in ',n,"?",i,"[",n,".",t,"]:",7680)}var i=e.constants.stencilOps;return["stencil.opBack"===t?1029:1028,a("fail"),a("zfail"),a("zpass")]}));case"polygonOffset.offset":return e((function(t){return[0|t.factor,0|t.units]}),(function(t,e,r){return[e.def(r,".factor|0"),e=e.def(r,".units|0")]}));case"cull.face":return e((function(t){var e=0;return"front"===t?e=1028:"back"===t&&(e=1029),e}),(function(t,e,r){return e.def(r,'==="front"?',1028,":",1029)}));case"lineWidth":return e((function(t){return t}),(function(t,e,r){return r}));case"frontFace":return e((function(t){return St[t]}),(function(t,e,r){return e.def(r+'==="cw"?2304:2305')}));case"colorMask":return e((function(t){return t.map((function(t){return!!t}))}),(function(t,e,r){return i(4,(function(t){return"!!"+r+"["+t+"]"}))}));case"sample.coverage":return e((function(t){return["value"in t?t.value:1,!!t.invert]}),(function(t,e,r){return[e.def('"value" in ',r,"?+",r,".value:1"),e=e.def("!!",r,".invert")]}))}})),a}(t),p=w(t,0,l);s("viewport"),s(v("scissor.box"));var d,g=0<Object.keys(f).length;if((d={framebuffer:d,draw:h,shader:p,state:f,dirty:g,scopeVAO:null,drawVAO:null,useVAO:!1,attributes:{}}).profile=function(t){var e,r=t.static;if(t=t.dynamic,"profile"in r){var n=!!r.profile;(e=F((function(t,e){return n}))).enable=n}else if("profile"in t){var a=t.profile;e=B(a,(function(t,e){return t.invoke(e,a)}))}return e}(t),d.uniforms=function(t,e){var r=t.static,n=t.dynamic,a={};return Object.keys(r).forEach((function(t){var e,n=r[t];if("number"==typeof n||"boolean"==typeof n)e=F((function(){return n}));else if("function"==typeof n){var o=n._reglType;"texture2d"===o||"textureCube"===o?e=F((function(t){return t.link(n)})):"framebuffer"!==o&&"framebufferCube"!==o||(e=F((function(t){return t.link(n.color[0])})))}else m(n)&&(e=F((function(t){return t.global.def("[",i(n.length,(function(t){return n[t]})),"]")})));e.value=n,a[t]=e})),Object.keys(n).forEach((function(t){var e=n[t];a[t]=B(e,(function(t,r){return t.invoke(r,e)}))})),a}(n),d.drawVAO=d.scopeVAO=function(t,e){var r=t.static,n=t.dynamic;if("vao"in r){var a=r.vao;return null!==a&&null===u.getVAO(a)&&(a=u.createVAO(a)),F((function(t){return t.link(u.getVAO(a))}))}if("vao"in n){var i=n.vao;return B(i,(function(t,e){var r=t.invoke(e,i);return e.def(t.shared.vao+".getVAO("+r+")")}))}return null}(t),!d.drawVAO&&p.program&&!l&&r.angle_instanced_arrays){var y=!0;if(t=p.program.attributes.map((function(t){return t=e.static[t],y=y&&!!t,t})),y&&0<t.length){var x=u.getVAO(u.createVAO(t));d.drawVAO=new D(null,null,null,(function(t,e){return t.link(x)})),d.useVAO=!0}}return l?d.useVAO=!0:d.attributes=k(e),d.context=function(t){var e=t.static,r=t.dynamic,n={};return Object.keys(e).forEach((function(t){var r=e[t];n[t]=F((function(t,e){return"number"==typeof r||"boolean"==typeof r?""+r:t.link(r)}))})),Object.keys(r).forEach((function(t){var e=r[t];n[t]=B(e,(function(t,r){return t.invoke(r,e)}))})),n}(a),d}function M(t,e,r){var n=t.shared.context,a=t.scope();Object.keys(r).forEach((function(i){e.save(n,"."+i),a(n,".",i,"=",r[i].append(t,e),";")})),e(a)}function S(t,e,r,n){var a,i=(s=t.shared).gl,o=s.framebuffer;$&&(a=e.def(s.extensions,".webgl_draw_buffers"));var s=(l=t.constants).drawBuffer,l=l.backBuffer;t=r?r.append(t,e):e.def(o,".next"),n||e("if(",t,"!==",o,".cur){"),e("if(",t,"){",i,".bindFramebuffer(",36160,",",t,".framebuffer);"),$&&e(a,".drawBuffersWEBGL(",s,"[",t,".colorAttachments.length]);"),e("}else{",i,".bindFramebuffer(",36160,",null);"),$&&e(a,".drawBuffersWEBGL(",l,");"),e("}",o,".cur=",t,";"),n||e("}")}function E(t,e,r){var n=t.shared,a=n.gl,o=t.current,s=t.next,l=n.current,c=n.next,u=t.cond(l,".dirty");rt.forEach((function(e){var n,h;if(!((e=v(e))in r.state))if(e in s){n=s[e],h=o[e];var f=i(tt[e].length,(function(t){return u.def(n,"[",t,"]")}));u(t.cond(f.map((function(t,e){return t+"!=="+h+"["+e+"]"})).join("||")).then(a,".",it[e],"(",f,");",f.map((function(t,e){return h+"["+e+"]="+t})).join(";"),";"))}else n=u.def(c,".",e),f=t.cond(n,"!==",l,".",e),u(f),e in at?f(t.cond(n).then(a,".enable(",at[e],");").else(a,".disable(",at[e],");"),l,".",e,"=",n,";"):f(a,".",it[e],"(",n,");",l,".",e,"=",n,";")})),0===Object.keys(r.state).length&&u(l,".dirty=false;"),e(u)}function C(t,e,r,n){var a=t.shared,i=t.current,o=a.current,s=a.gl;O(Object.keys(r)).forEach((function(a){var l=r[a];if(!n||n(l)){var c=l.append(t,e);if(at[a]){var u=at[a];R(l)?e(s,c?".enable(":".disable(",u,");"):e(t.cond(c).then(s,".enable(",u,");").else(s,".disable(",u,");")),e(o,".",a,"=",c,";")}else if(m(c)){var h=i[a];e(s,".",it[a],"(",c,");",c.map((function(t,e){return h+"["+e+"]="+t})).join(";"),";")}else e(s,".",it[a],"(",c,");",o,".",a,"=",c,";")}}))}function L(t,e){K&&(t.instancing=e.def(t.shared.extensions,".angle_instanced_arrays"))}function P(t,e,r,n,a){function i(){return"undefined"==typeof performance?"Date.now()":"performance.now()"}function o(t){t(c=e.def(),"=",i(),";"),"string"==typeof a?t(f,".count+=",a,";"):t(f,".count++;"),d&&(n?t(u=e.def(),"=",g,".getNumPendingQueries();"):t(g,".beginQuery(",f,");"))}function s(t){t(f,".cpuTime+=",i(),"-",c,";"),d&&(n?t(g,".pushScopeStats(",u,",",g,".getNumPendingQueries(),",f,");"):t(g,".endQuery();"))}function l(t){var r=e.def(p,".profile");e(p,".profile=",t,";"),e.exit(p,".profile=",r,";")}var c,u,h=t.shared,f=t.stats,p=h.current,g=h.timer;if(r=r.profile){if(R(r))return void(r.enable?(o(e),s(e.exit),l("true")):l("false"));l(r=r.append(t,e))}else r=e.def(p,".profile");o(h=t.block()),e("if(",r,"){",h,"}"),s(t=t.block()),e.exit("if(",r,"){",t,"}")}function N(t,e,r,n,a){function i(r,n,a){function i(){e("if(!",u,".buffer){",l,".enableVertexAttribArray(",c,");}");var r,i=a.type;r=a.size?e.def(a.size,"||",n):n,e("if(",u,".type!==",i,"||",u,".size!==",r,"||",p.map((function(t){return u+"."+t+"!=="+a[t]})).join("||"),"){",l,".bindBuffer(",34962,",",h,".buffer);",l,".vertexAttribPointer(",[c,r,i,a.normalized,a.stride,a.offset],");",u,".type=",i,";",u,".size=",r,";",p.map((function(t){return u+"."+t+"="+a[t]+";"})).join(""),"}"),K&&(i=a.divisor,e("if(",u,".divisor!==",i,"){",t.instancing,".vertexAttribDivisorANGLE(",[c,i],");",u,".divisor=",i,";}"))}function s(){e("if(",u,".buffer){",l,".disableVertexAttribArray(",c,");",u,".buffer=null;","}if(",wt.map((function(t,e){return u+"."+t+"!=="+f[e]})).join("||"),"){",l,".vertexAttrib4f(",c,",",f,");",wt.map((function(t,e){return u+"."+t+"="+f[e]+";"})).join(""),"}")}var l=o.gl,c=e.def(r,".location"),u=e.def(o.attributes,"[",c,"]");r=a.state;var h=a.buffer,f=[a.x,a.y,a.z,a.w],p=["buffer","normalized","offset","stride"];1===r?i():2===r?s():(e("if(",r,"===",1,"){"),i(),e("}else{"),s(),e("}"))}var o=t.shared;n.forEach((function(n){var o,s=n.name,l=r.attributes[s];if(l){if(!a(l))return;o=l.append(t,e)}else{if(!a(Et))return;var c=t.scopeAttrib(s);o={},Object.keys(new X).forEach((function(t){o[t]=e.def(c,".",t)}))}i(t.link(n),function(t){switch(t){case 35664:case 35667:case 35671:return 2;case 35665:case 35668:case 35672:return 3;case 35666:case 35669:case 35673:return 4;default:return 1}}(n.info.type),o)}))}function j(t,r,n,a,o){for(var s,l=t.shared,c=l.gl,u=0;u<a.length;++u){var h,f=(g=a[u]).name,p=g.info.type,d=n.uniforms[f],g=t.link(g)+".location";if(d){if(!o(d))continue;if(R(d)){if(f=d.value,35678===p||35680===p)r(c,".uniform1i(",g,",",(p=t.link(f._texture||f.color[0]._texture))+".bind());"),r.exit(p,".unbind();");else if(35674===p||35675===p||35676===p)d=2,35675===p?d=3:35676===p&&(d=4),r(c,".uniformMatrix",d,"fv(",g,",false,",f=t.global.def("new Float32Array(["+Array.prototype.slice.call(f)+"])"),");");else{switch(p){case 5126:s="1f";break;case 35664:s="2f";break;case 35665:s="3f";break;case 35666:s="4f";break;case 35670:case 5124:s="1i";break;case 35671:case 35667:s="2i";break;case 35672:case 35668:s="3i";break;case 35673:s="4i";break;case 35669:s="4i"}r(c,".uniform",s,"(",g,",",m(f)?Array.prototype.slice.call(f):f,");")}continue}h=d.append(t,r)}else{if(!o(Et))continue;h=r.def(l.uniforms,"[",e.id(f),"]")}switch(35678===p?r("if(",h,"&&",h,'._reglType==="framebuffer"){',h,"=",h,".color[0];","}"):35680===p&&r("if(",h,"&&",h,'._reglType==="framebufferCube"){',h,"=",h,".color[0];","}"),f=1,p){case 35678:case 35680:p=r.def(h,"._texture"),r(c,".uniform1i(",g,",",p,".bind());"),r.exit(p,".unbind();");continue;case 5124:case 35670:s="1i";break;case 35667:case 35671:s="2i",f=2;break;case 35668:case 35672:s="3i",f=3;break;case 35669:case 35673:s="4i",f=4;break;case 5126:s="1f";break;case 35664:s="2f",f=2;break;case 35665:s="3f",f=3;break;case 35666:s="4f",f=4;break;case 35674:s="Matrix2fv";break;case 35675:s="Matrix3fv";break;case 35676:s="Matrix4fv"}if(r(c,".uniform",s,"(",g,","),"M"===s.charAt(0)){g=Math.pow(p-35674+2,2);var v=t.global.def("new Float32Array(",g,")");r("false,(Array.isArray(",h,")||",h," instanceof Float32Array)?",h,":(",i(g,(function(t){return v+"["+t+"]="+h+"["+t+"]"})),",",v,")")}else r(1<f?i(f,(function(t){return h+"["+t+"]"})):h);r(");")}}function V(t,e,r,n){function a(a){var i=f[a];return i?i.contextDep&&n.contextDynamic||i.propDep?i.append(t,r):i.append(t,e):e.def(h,".",a)}function i(){function t(){r(l,".drawElementsInstancedANGLE(",[d,m,v,g+"<<(("+v+"-5121)>>1)",s],");")}function e(){r(l,".drawArraysInstancedANGLE(",[d,g,m,s],");")}p?y?t():(r("if(",p,"){"),t(),r("}else{"),e(),r("}")):e()}function o(){function t(){r(u+".drawElements("+[d,m,v,g+"<<(("+v+"-5121)>>1)"]+");")}function e(){r(u+".drawArrays("+[d,g,m]+");")}p?y?t():(r("if(",p,"){"),t(),r("}else{"),e(),r("}")):e()}var s,l,c=t.shared,u=c.gl,h=c.draw,f=n.draw,p=function(){var a=f.elements,i=e;return a?((a.contextDep&&n.contextDynamic||a.propDep)&&(i=r),a=a.append(t,i)):a=i.def(h,".","elements"),a&&i("if("+a+")"+u+".bindBuffer(34963,"+a+".buffer.buffer);"),a}(),d=a("primitive"),g=a("offset"),m=function(){var a=f.count,i=e;return a?((a.contextDep&&n.contextDynamic||a.propDep)&&(i=r),a=a.append(t,i)):a=i.def(h,".","count"),a}();if("number"==typeof m){if(0===m)return}else r("if(",m,"){"),r.exit("}");K&&(s=a("instances"),l=t.instancing);var v=p+".type",y=f.elements&&R(f.elements);K&&("number"!=typeof s||0<=s)?"string"==typeof s?(r("if(",s,">0){"),i(),r("}else if(",s,"<0){"),o(),r("}")):i():o()}function U(t,e,r,n,a){return a=(e=b()).proc("body",a),K&&(e.instancing=a.def(e.shared.extensions,".angle_instanced_arrays")),t(e,a,r,n),e.compile().body}function H(t,e,r,n){L(t,e),r.useVAO?r.drawVAO?e(t.shared.vao,".setVAO(",r.drawVAO.append(t,e),");"):e(t.shared.vao,".setVAO(",t.shared.vao,".targetVAO);"):(e(t.shared.vao,".setVAO(null);"),N(t,e,r,n.attributes,(function(){return!0}))),j(t,e,r,n.uniforms,(function(){return!0})),V(t,e,e,r)}function G(t,e,r,n){function a(){return!0}t.batchId="a1",L(t,e),N(t,e,r,n.attributes,a),j(t,e,r,n.uniforms,a),V(t,e,e,r)}function Y(t,e,r,n){function a(t){return t.contextDep&&o||t.propDep}function i(t){return!a(t)}L(t,e);var o=r.contextDep,s=e.def(),l=e.def();t.shared.props=l,t.batchId=s;var c=t.scope(),u=t.scope();e(c.entry,"for(",s,"=0;",s,"<","a1",";++",s,"){",l,"=","a0","[",s,"];",u,"}",c.exit),r.needsContext&&M(t,u,r.context),r.needsFramebuffer&&S(t,u,r.framebuffer),C(t,u,r.state,a),r.profile&&a(r.profile)&&P(t,u,r,!1,!0),n?(r.useVAO?r.drawVAO?a(r.drawVAO)?u(t.shared.vao,".setVAO(",r.drawVAO.append(t,u),");"):c(t.shared.vao,".setVAO(",r.drawVAO.append(t,c),");"):c(t.shared.vao,".setVAO(",t.shared.vao,".targetVAO);"):(c(t.shared.vao,".setVAO(null);"),N(t,c,r,n.attributes,i),N(t,u,r,n.attributes,a)),j(t,c,r,n.uniforms,i),j(t,u,r,n.uniforms,a),V(t,c,u,r)):(e=t.global.def("{}"),n=r.shader.progVar.append(t,u),l=u.def(n,".id"),c=u.def(e,"[",l,"]"),u(t.shared.gl,".useProgram(",n,".program);","if(!",c,"){",c,"=",e,"[",l,"]=",t.link((function(e){return U(G,t,r,e,2)})),"(",n,");}",c,".call(this,a0[",s,"],",s,");"))}function W(t,r){function n(e){var n=r.shader[e];n&&a.set(i.shader,"."+e,n.append(t,a))}var a=t.proc("scope",3);t.batchId="a2";var i=t.shared,o=i.current;M(t,a,r.context),r.framebuffer&&r.framebuffer.append(t,a),O(Object.keys(r.state)).forEach((function(e){var n=r.state[e].append(t,a);m(n)?n.forEach((function(r,n){a.set(t.next[e],"["+n+"]",r)})):a.set(i.next,"."+e,n)})),P(t,a,r,!0,!0),["elements","offset","count","instances","primitive"].forEach((function(e){var n=r.draw[e];n&&a.set(i.draw,"."+e,""+n.append(t,a))})),Object.keys(r.uniforms).forEach((function(n){a.set(i.uniforms,"["+e.id(n)+"]",r.uniforms[n].append(t,a))})),Object.keys(r.attributes).forEach((function(e){var n=r.attributes[e].append(t,a),i=t.scopeAttrib(e);Object.keys(new X).forEach((function(t){a.set(i,"."+t,n[t])}))})),r.scopeVAO&&a.set(i.vao,".targetVAO",r.scopeVAO.append(t,a)),n("vert"),n("frag"),0<Object.keys(r.state).length&&(a(o,".dirty=true;"),a.exit(o,".dirty=true;")),a("a1(",t.shared.context,",a0,",t.batchId,");")}function Z(t,e,r){var n=e.static[r];if(n&&function(t){if("object"==typeof t&&!m(t)){for(var e=Object.keys(t),r=0;r<e.length;++r)if(q.isDynamic(t[e[r]]))return!0;return!1}}(n)){var a=t.global,i=Object.keys(n),o=!1,s=!1,l=!1,c=t.global.def("{}");i.forEach((function(e){var r=n[e];if(q.isDynamic(r))"function"==typeof r&&(r=n[e]=q.unbox(r)),e=B(r,null),o=o||e.thisDep,l=l||e.propDep,s=s||e.contextDep;else{switch(a(c,".",e,"="),typeof r){case"number":a(r);break;case"string":a('"',r,'"');break;case"object":Array.isArray(r)&&a("[",r.join(),"]");break;default:a(t.link(r))}a(";")}})),e.dynamic[r]=new q.DynamicVariable(4,{thisDep:o,contextDep:s,propDep:l,ref:c,append:function(t,e){i.forEach((function(r){var a=n[r];q.isDynamic(a)&&(a=t.invoke(e,a),e(c,".",r,"=",a,";"))}))}}),delete e.static[r]}}var X=u.Record,J={add:32774,subtract:32778,"reverse subtract":32779};r.ext_blend_minmax&&(J.min=32775,J.max=32776);var K=r.angle_instanced_arrays,$=r.webgl_draw_buffers,tt={dirty:!0,profile:g.profile},et={},rt=[],at={},it={};y("dither",3024),y("blend.enable",3042),x("blend.color","blendColor",[0,0,0,0]),x("blend.equation","blendEquationSeparate",[32774,32774]),x("blend.func","blendFuncSeparate",[1,0,1,0]),y("depth.enable",2929,!0),x("depth.func","depthFunc",513),x("depth.range","depthRange",[0,1]),x("depth.mask","depthMask",!0),x("colorMask","colorMask",[!0,!0,!0,!0]),y("cull.enable",2884),x("cull.face","cullFace",1029),x("frontFace","frontFace",2305),x("lineWidth","lineWidth",1),y("polygonOffset.enable",32823),x("polygonOffset.offset","polygonOffset",[0,0]),y("sample.alpha",32926),y("sample.enable",32928),x("sample.coverage","sampleCoverage",[1,!1]),y("stencil.enable",2960),x("stencil.mask","stencilMask",-1),x("stencil.func","stencilFunc",[519,0,-1]),x("stencil.opFront","stencilOpSeparate",[1028,7680,7680,7680]),x("stencil.opBack","stencilOpSeparate",[1029,7680,7680,7680]),y("scissor.enable",3089),x("scissor.box","scissor",[0,0,t.drawingBufferWidth,t.drawingBufferHeight]),x("viewport","viewport",[0,0,t.drawingBufferWidth,t.drawingBufferHeight]);var ot={gl:t,context:p,strings:e,next:et,current:tt,draw:f,elements:o,buffer:a,shader:h,attributes:u.state,vao:u,uniforms:c,framebuffer:l,extensions:r,timer:d,isBufferArgs:z},st={primTypes:nt,compareFuncs:At,blendFuncs:kt,blendEquations:J,stencilOps:Mt,glTypes:Q,orientationType:St};$&&(st.backBuffer=[1029],st.drawBuffer=i(n.maxDrawbuffers,(function(t){return 0===t?[0]:i(t,(function(t){return 36064+t}))})));var lt=0;return{next:et,current:tt,procs:function(){var t=b(),e=t.proc("poll"),a=t.proc("refresh"),o=t.block();e(o),a(o);var s,l=t.shared,c=l.gl,u=l.next,h=l.current;o(h,".dirty=false;"),S(t,e),S(t,a,null,!0),K&&(s=t.link(K)),r.oes_vertex_array_object&&a(t.link(r.oes_vertex_array_object),".bindVertexArrayOES(null);");for(var f=0;f<n.maxAttributes;++f){var p=a.def(l.attributes,"[",f,"]"),d=t.cond(p,".buffer");d.then(c,".enableVertexAttribArray(",f,");",c,".bindBuffer(",34962,",",p,".buffer.buffer);",c,".vertexAttribPointer(",f,",",p,".size,",p,".type,",p,".normalized,",p,".stride,",p,".offset);").else(c,".disableVertexAttribArray(",f,");",c,".vertexAttrib4f(",f,",",p,".x,",p,".y,",p,".z,",p,".w);",p,".buffer=null;"),a(d),K&&a(s,".vertexAttribDivisorANGLE(",f,",",p,".divisor);")}return a(t.shared.vao,".currentVAO=null;",t.shared.vao,".setVAO(",t.shared.vao,".targetVAO);"),Object.keys(at).forEach((function(r){var n=at[r],i=o.def(u,".",r),s=t.block();s("if(",i,"){",c,".enable(",n,")}else{",c,".disable(",n,")}",h,".",r,"=",i,";"),a(s),e("if(",i,"!==",h,".",r,"){",s,"}")})),Object.keys(it).forEach((function(r){var n,s,l=it[r],f=tt[r],p=t.block();p(c,".",l,"("),m(f)?(l=f.length,n=t.global.def(u,".",r),s=t.global.def(h,".",r),p(i(l,(function(t){return n+"["+t+"]"})),");",i(l,(function(t){return s+"["+t+"]="+n+"["+t+"];"})).join("")),e("if(",i(l,(function(t){return n+"["+t+"]!=="+s+"["+t+"]"})).join("||"),"){",p,"}")):(n=o.def(u,".",r),s=o.def(h,".",r),p(n,");",h,".",r,"=",n,";"),e("if(",n,"!==",s,"){",p,"}")),a(p)})),t.compile()}(),compile:function(t,e,r,n,a){var i=b();return i.stats=i.link(a),Object.keys(e.static).forEach((function(t){Z(i,e,t)})),Tt.forEach((function(e){Z(i,t,e)})),r=A(t,e,r,n),function(t,e){var r=t.proc("draw",1);L(t,r),M(t,r,e.context),S(t,r,e.framebuffer),E(t,r,e),C(t,r,e.state),P(t,r,e,!1,!0);var n=e.shader.progVar.append(t,r);if(r(t.shared.gl,".useProgram(",n,".program);"),e.shader.program)H(t,r,e,e.shader.program);else{r(t.shared.vao,".setVAO(null);");var a=t.global.def("{}"),i=r.def(n,".id"),o=r.def(a,"[",i,"]");r(t.cond(o).then(o,".call(this,a0);").else(o,"=",a,"[",i,"]=",t.link((function(r){return U(H,t,e,r,1)})),"(",n,");",o,".call(this,a0);"))}0<Object.keys(e.state).length&&r(t.shared.current,".dirty=true;")}(i,r),W(i,r),function(t,e){function r(t){return t.contextDep&&a||t.propDep}var n=t.proc("batch",2);t.batchId="0",L(t,n);var a=!1,i=!0;Object.keys(e.context).forEach((function(t){a=a||e.context[t].propDep})),a||(M(t,n,e.context),i=!1);var o=!1;if((s=e.framebuffer)?(s.propDep?a=o=!0:s.contextDep&&a&&(o=!0),o||S(t,n,s)):S(t,n,null),e.state.viewport&&e.state.viewport.propDep&&(a=!0),E(t,n,e),C(t,n,e.state,(function(t){return!r(t)})),e.profile&&r(e.profile)||P(t,n,e,!1,"a1"),e.contextDep=a,e.needsContext=i,e.needsFramebuffer=o,(i=e.shader.progVar).contextDep&&a||i.propDep)Y(t,n,e,null);else if(i=i.append(t,n),n(t.shared.gl,".useProgram(",i,".program);"),e.shader.program)Y(t,n,e,e.shader.program);else{n(t.shared.vao,".setVAO(null);");var s=t.global.def("{}"),l=(o=n.def(i,".id"),n.def(s,"[",o,"]"));n(t.cond(l).then(l,".call(this,a0,a1);").else(l,"=",s,"[",o,"]=",t.link((function(r){return U(Y,t,e,r,2)})),"(",i,");",l,".call(this,a0,a1);"))}0<Object.keys(e.state).length&&n(t.shared.current,".dirty=true;")}(i,r),i.compile()}}}function j(t,e){for(var r=0;r<t.length;++r)if(t[r]===e)return r;return-1}var V=function(t,e){for(var r=Object.keys(e),n=0;n<r.length;++n)t[r[n]]=e[r[n]];return t},U=0,q={DynamicVariable:t,define:function(r,n){return new t(r,e(n+""))},isDynamic:function(e){return"function"==typeof e&&!e._reglType||e instanceof t},unbox:function(e,r){return"function"==typeof e?new t(0,e):e},accessor:e},H={next:"function"==typeof requestAnimationFrame?function(t){return requestAnimationFrame(t)}:function(t){return setTimeout(t,16)},cancel:"function"==typeof cancelAnimationFrame?function(t){return cancelAnimationFrame(t)}:clearTimeout},G="undefined"!=typeof performance&&performance.now?function(){return performance.now()}:function(){return+new Date},Y=s();Y.zero=s();var W=function(t,e){var r=1;e.ext_texture_filter_anisotropic&&(r=t.getParameter(34047));var n=1,a=1;e.webgl_draw_buffers&&(n=t.getParameter(34852),a=t.getParameter(36063));var i=!!e.oes_texture_float;if(i){i=t.createTexture(),t.bindTexture(3553,i),t.texImage2D(3553,0,6408,1,1,0,6408,5126,null);var o=t.createFramebuffer();if(t.bindFramebuffer(36160,o),t.framebufferTexture2D(36160,36064,3553,i,0),t.bindTexture(3553,null),36053!==t.checkFramebufferStatus(36160))i=!1;else{t.viewport(0,0,1,1),t.clearColor(1,0,0,1),t.clear(16384);var s=Y.allocType(5126,4);t.readPixels(0,0,1,1,6408,5126,s),t.getError()?i=!1:(t.deleteFramebuffer(o),t.deleteTexture(i),i=1===s[0]),Y.freeType(s)}}return s=!0,"undefined"!=typeof navigator&&(/MSIE/.test(navigator.userAgent)||/Trident\//.test(navigator.appVersion)||/Edge/.test(navigator.userAgent))||(s=t.createTexture(),o=Y.allocType(5121,36),t.activeTexture(33984),t.bindTexture(34067,s),t.texImage2D(34069,0,6408,3,3,0,6408,5121,o),Y.freeType(o),t.bindTexture(34067,null),t.deleteTexture(s),s=!t.getError()),{colorBits:[t.getParameter(3410),t.getParameter(3411),t.getParameter(3412),t.getParameter(3413)],depthBits:t.getParameter(3414),stencilBits:t.getParameter(3415),subpixelBits:t.getParameter(3408),extensions:Object.keys(e).filter((function(t){return!!e[t]})),maxAnisotropic:r,maxDrawbuffers:n,maxColorAttachments:a,pointSizeDims:t.getParameter(33901),lineWidthDims:t.getParameter(33902),maxViewportDims:t.getParameter(3386),maxCombinedTextureUnits:t.getParameter(35661),maxCubeMapSize:t.getParameter(34076),maxRenderbufferSize:t.getParameter(34024),maxTextureUnits:t.getParameter(34930),maxTextureSize:t.getParameter(3379),maxAttributes:t.getParameter(34921),maxVertexUniforms:t.getParameter(36347),maxVertexTextureUnits:t.getParameter(35660),maxVaryingVectors:t.getParameter(36348),maxFragmentUniforms:t.getParameter(36349),glsl:t.getParameter(35724),renderer:t.getParameter(7937),vendor:t.getParameter(7936),version:t.getParameter(7938),readFloat:i,npotTextureCube:s}},Z=function(t){return t instanceof Uint8Array||t instanceof Uint16Array||t instanceof Uint32Array||t instanceof Int8Array||t instanceof Int16Array||t instanceof Int32Array||t instanceof Float32Array||t instanceof Float64Array||t instanceof Uint8ClampedArray},X=function(t){return Object.keys(t).map((function(e){return t[e]}))},J={shape:function(t){for(var e=[];t.length;t=t[0])e.push(t.length);return e},flatten:function(t,e,r,n){var a=1;if(e.length)for(var i=0;i<e.length;++i)a*=e[i];else a=0;switch(r=n||Y.allocType(r,a),e.length){case 0:break;case 1:for(n=e[0],e=0;e<n;++e)r[e]=t[e];break;case 2:for(n=e[0],e=e[1],i=a=0;i<n;++i)for(var o=t[i],s=0;s<e;++s)r[a++]=o[s];break;case 3:c(t,e[0],e[1],e[2],r,0);break;default:!function t(e,r,n,a,i){for(var o=1,s=n+1;s<r.length;++s)o*=r[s];var l=r[n];if(4==r.length-n){var u=r[n+1],h=r[n+2];for(r=r[n+3],s=0;s<l;++s)c(e[s],u,h,r,a,i),i+=o}else for(s=0;s<l;++s)t(e[s],r,n+1,a,i),i+=o}(t,e,0,r,0)}return r}},K={"[object Int8Array]":5120,"[object Int16Array]":5122,"[object Int32Array]":5124,"[object Uint8Array]":5121,"[object Uint8ClampedArray]":5121,"[object Uint16Array]":5123,"[object Uint32Array]":5125,"[object Float32Array]":5126,"[object Float64Array]":5121,"[object ArrayBuffer]":5121},Q={int8:5120,int16:5122,int32:5124,uint8:5121,uint16:5123,uint32:5125,float:5126,float32:5126},$={dynamic:35048,stream:35040,static:35044},tt=J.flatten,et=J.shape,rt=[];rt[5120]=1,rt[5122]=2,rt[5124]=4,rt[5121]=1,rt[5123]=2,rt[5125]=4,rt[5126]=4;var nt={points:0,point:0,lines:1,line:1,triangles:4,triangle:4,"line loop":2,"line strip":3,"triangle strip":5,"triangle fan":6},at=new Float32Array(1),it=new Uint32Array(at.buffer),ot=[9984,9986,9985,9987],st=[0,6409,6410,6407,6408],lt={};lt[6409]=lt[6406]=lt[6402]=1,lt[34041]=lt[6410]=2,lt[6407]=lt[35904]=3,lt[6408]=lt[35906]=4;var ct=v("HTMLCanvasElement"),ut=v("OffscreenCanvas"),ht=v("CanvasRenderingContext2D"),ft=v("ImageBitmap"),pt=v("HTMLImageElement"),dt=v("HTMLVideoElement"),gt=Object.keys(K).concat([ct,ut,ht,ft,pt,dt]),mt=[];mt[5121]=1,mt[5126]=4,mt[36193]=2,mt[5123]=2,mt[5125]=4;var vt=[];vt[32854]=2,vt[32855]=2,vt[36194]=2,vt[34041]=4,vt[33776]=.5,vt[33777]=.5,vt[33778]=1,vt[33779]=1,vt[35986]=.5,vt[35987]=1,vt[34798]=1,vt[35840]=.5,vt[35841]=.25,vt[35842]=.5,vt[35843]=.25,vt[36196]=.5;var yt=[];yt[32854]=2,yt[32855]=2,yt[36194]=2,yt[33189]=2,yt[36168]=1,yt[34041]=4,yt[35907]=4,yt[34836]=16,yt[34842]=8,yt[34843]=6;var xt=function(t,e,r,n,a){function i(t){this.id=c++,this.refCount=1,this.renderbuffer=t,this.format=32854,this.height=this.width=0,a.profile&&(this.stats={size:0})}function o(e){var r=e.renderbuffer;t.bindRenderbuffer(36161,null),t.deleteRenderbuffer(r),e.renderbuffer=null,e.refCount=0,delete u[e.id],n.renderbufferCount--}var s={rgba4:32854,rgb565:36194,"rgb5 a1":32855,depth:33189,stencil:36168,"depth stencil":34041};e.ext_srgb&&(s.srgba=35907),e.ext_color_buffer_half_float&&(s.rgba16f=34842,s.rgb16f=34843),e.webgl_color_buffer_float&&(s.rgba32f=34836);var l=[];Object.keys(s).forEach((function(t){l[s[t]]=t}));var c=0,u={};return i.prototype.decRef=function(){0>=--this.refCount&&o(this)},a.profile&&(n.getTotalRenderbufferSize=function(){var t=0;return Object.keys(u).forEach((function(e){t+=u[e].stats.size})),t}),{create:function(e,r){function o(e,r){var n=0,i=0,u=32854;if("object"==typeof e&&e?("shape"in e?(n=0|(i=e.shape)[0],i=0|i[1]):("radius"in e&&(n=i=0|e.radius),"width"in e&&(n=0|e.width),"height"in e&&(i=0|e.height)),"format"in e&&(u=s[e.format])):"number"==typeof e?(n=0|e,i="number"==typeof r?0|r:n):e||(n=i=1),n!==c.width||i!==c.height||u!==c.format)return o.width=c.width=n,o.height=c.height=i,c.format=u,t.bindRenderbuffer(36161,c.renderbuffer),t.renderbufferStorage(36161,u,n,i),a.profile&&(c.stats.size=yt[c.format]*c.width*c.height),o.format=l[c.format],o}var c=new i(t.createRenderbuffer());return u[c.id]=c,n.renderbufferCount++,o(e,r),o.resize=function(e,r){var n=0|e,i=0|r||n;return n===c.width&&i===c.height||(o.width=c.width=n,o.height=c.height=i,t.bindRenderbuffer(36161,c.renderbuffer),t.renderbufferStorage(36161,c.format,n,i),a.profile&&(c.stats.size=yt[c.format]*c.width*c.height)),o},o._reglType="renderbuffer",o._renderbuffer=c,a.profile&&(o.stats=c.stats),o.destroy=function(){c.decRef()},o},clear:function(){X(u).forEach(o)},restore:function(){X(u).forEach((function(e){e.renderbuffer=t.createRenderbuffer(),t.bindRenderbuffer(36161,e.renderbuffer),t.renderbufferStorage(36161,e.format,e.width,e.height)})),t.bindRenderbuffer(36161,null)}}},bt=[];bt[6408]=4,bt[6407]=3;var _t=[];_t[5121]=1,_t[5126]=4,_t[36193]=2;var wt=["x","y","z","w"],Tt="blend.func blend.equation stencil.func stencil.opFront stencil.opBack sample.coverage viewport scissor.box polygonOffset.offset".split(" "),kt={0:0,1:1,zero:0,one:1,"src color":768,"one minus src color":769,"src alpha":770,"one minus src alpha":771,"dst color":774,"one minus dst color":775,"dst alpha":772,"one minus dst alpha":773,"constant color":32769,"one minus constant color":32770,"constant alpha":32771,"one minus constant alpha":32772,"src alpha saturate":776},At={never:512,less:513,"<":513,equal:514,"=":514,"==":514,"===":514,lequal:515,"<=":515,greater:516,">":516,notequal:517,"!=":517,"!==":517,gequal:518,">=":518,always:519},Mt={0:0,zero:0,keep:7680,replace:7681,increment:7682,decrement:7683,"increment wrap":34055,"decrement wrap":34056,invert:5386},St={cw:2304,ccw:2305},Et=new D(!1,!1,!1,(function(){}));return function(t){function e(){if(0===J.length)w&&w.update(),tt=null;else{tt=H.next(e),h();for(var t=J.length-1;0<=t;--t){var r=J[t];r&&r(P,null,0)}m.flush(),w&&w.update()}}function r(){!tt&&0<J.length&&(tt=H.next(e))}function n(){tt&&(H.cancel(e),tt=null)}function i(t){t.preventDefault(),n(),K.forEach((function(t){t()}))}function o(t){m.getError(),y.restore(),R.restore(),z.restore(),F.restore(),B.restore(),U.restore(),O.restore(),w&&w.restore(),Y.procs.refresh(),r(),Q.forEach((function(t){t()}))}function s(t){function e(t){var e={},r={};return Object.keys(t).forEach((function(n){var a=t[n];q.isDynamic(a)?r[n]=q.unbox(a,n):e[n]=a})),{dynamic:r,static:e}}var r=e(t.context||{}),n=e(t.uniforms||{}),a=e(t.attributes||{}),i=e(function(t){function e(t){if(t in r){var e=r[t];delete r[t],Object.keys(e).forEach((function(n){r[t+"."+n]=e[n]}))}}var r=V({},t);return delete r.uniforms,delete r.attributes,delete r.context,delete r.vao,"stencil"in r&&r.stencil.op&&(r.stencil.opBack=r.stencil.opFront=r.stencil.op,delete r.stencil.op),e("blend"),e("depth"),e("cull"),e("stencil"),e("polygonOffset"),e("scissor"),e("sample"),"vao"in t&&(r.vao=t.vao),r}(t));t={gpuTime:0,cpuTime:0,count:0};var o=(r=Y.compile(i,a,n,r,t)).draw,s=r.batch,l=r.scope,c=[];return V((function(t,e){var r;if("function"==typeof t)return l.call(this,null,t,0);if("function"==typeof e)if("number"==typeof t)for(r=0;r<t;++r)l.call(this,null,e,r);else{if(!Array.isArray(t))return l.call(this,t,e,0);for(r=0;r<t.length;++r)l.call(this,t[r],e,r)}else if("number"==typeof t){if(0<t)return s.call(this,function(t){for(;c.length<t;)c.push(null);return c}(0|t),0|t)}else{if(!Array.isArray(t))return o.call(this,t);if(t.length)return s.call(this,t,t.length)}}),{stats:t})}function l(t,e){var r=0;Y.procs.poll();var n=e.color;n&&(m.clearColor(+n[0]||0,+n[1]||0,+n[2]||0,+n[3]||0),r|=16384),"depth"in e&&(m.clearDepth(+e.depth),r|=256),"stencil"in e&&(m.clearStencil(0|e.stencil),r|=1024),m.clear(r)}function c(t){return J.push(t),r(),{cancel:function(){var e=j(J,t);J[e]=function t(){var e=j(J,t);J[e]=J[J.length-1],--J.length,0>=J.length&&n()}}}}function u(){var t=Z.viewport,e=Z.scissor_box;t[0]=t[1]=e[0]=e[1]=0,P.viewportWidth=P.framebufferWidth=P.drawingBufferWidth=t[2]=e[2]=m.drawingBufferWidth,P.viewportHeight=P.framebufferHeight=P.drawingBufferHeight=t[3]=e[3]=m.drawingBufferHeight}function h(){P.tick+=1,P.time=g(),u(),Y.procs.poll()}function f(){u(),Y.procs.refresh(),w&&w.update()}function g(){return(G()-T)/1e3}if(!(t=a(t)))return null;var m=t.gl,v=m.getContextAttributes();m.isContextLost();var y=function(t,e){function r(e){var r;e=e.toLowerCase();try{r=n[e]=t.getExtension(e)}catch(t){}return!!r}for(var n={},a=0;a<e.extensions.length;++a){var i=e.extensions[a];if(!r(i))return e.onDestroy(),e.onDone('"'+i+'" extension is not supported by the current WebGL context, try upgrading your system or a different browser'),null}return e.optionalExtensions.forEach(r),{extensions:n,restore:function(){Object.keys(n).forEach((function(t){if(n[t]&&!r(t))throw Error("(regl): error restoring extension "+t)}))}}}(m,t);if(!y)return null;var x=function(){var t={"":0},e=[""];return{id:function(r){var n=t[r];return n||(n=t[r]=e.length,e.push(r),n)},str:function(t){return e[t]}}}(),b={vaoCount:0,bufferCount:0,elementsCount:0,framebufferCount:0,shaderCount:0,textureCount:0,cubeCount:0,renderbufferCount:0,maxTextureUnits:0},_=y.extensions,w=function(t,e){function r(){this.endQueryIndex=this.startQueryIndex=-1,this.sum=0,this.stats=null}function n(t,e,n){var a=o.pop()||new r;a.startQueryIndex=t,a.endQueryIndex=e,a.sum=0,a.stats=n,s.push(a)}if(!e.ext_disjoint_timer_query)return null;var a=[],i=[],o=[],s=[],l=[],c=[];return{beginQuery:function(t){var r=a.pop()||e.ext_disjoint_timer_query.createQueryEXT();e.ext_disjoint_timer_query.beginQueryEXT(35007,r),i.push(r),n(i.length-1,i.length,t)},endQuery:function(){e.ext_disjoint_timer_query.endQueryEXT(35007)},pushScopeStats:n,update:function(){var t,r;if(0!==(t=i.length)){c.length=Math.max(c.length,t+1),l.length=Math.max(l.length,t+1),l[0]=0;var n=c[0]=0;for(r=t=0;r<i.length;++r){var u=i[r];e.ext_disjoint_timer_query.getQueryObjectEXT(u,34919)?(n+=e.ext_disjoint_timer_query.getQueryObjectEXT(u,34918),a.push(u)):i[t++]=u,l[r+1]=n,c[r+1]=t}for(i.length=t,r=t=0;r<s.length;++r){var h=(n=s[r]).startQueryIndex;u=n.endQueryIndex;n.sum+=l[u]-l[h],h=c[h],(u=c[u])===h?(n.stats.gpuTime+=n.sum/1e6,o.push(n)):(n.startQueryIndex=h,n.endQueryIndex=u,s[t++]=n)}s.length=t}},getNumPendingQueries:function(){return i.length},clear:function(){a.push.apply(a,i);for(var t=0;t<a.length;t++)e.ext_disjoint_timer_query.deleteQueryEXT(a[t]);i.length=0,a.length=0},restore:function(){i.length=0,a.length=0}}}(0,_),T=G(),M=m.drawingBufferWidth,L=m.drawingBufferHeight,P={tick:0,time:0,viewportWidth:M,viewportHeight:L,framebufferWidth:M,framebufferHeight:L,drawingBufferWidth:M,drawingBufferHeight:L,pixelRatio:t.pixelRatio},I=W(m,_),z=p(m,b,t,(function(t){return O.destroyBuffer(t)})),O=S(m,_,I,b,z),D=d(m,_,z,b),R=E(m,x,b,t),F=k(m,_,I,(function(){Y.procs.poll()}),P,b,t),B=xt(m,_,0,b,t),U=A(m,_,I,F,B,b),Y=N(m,x,_,I,z,D,0,U,{},O,R,{elements:null,primitive:4,count:-1,offset:0,instances:-1},P,w,t),Z=(x=C(m,U,Y.procs.poll,P),Y.next),X=m.canvas,J=[],K=[],Q=[],$=[t.onDestroy],tt=null;X&&(X.addEventListener("webglcontextlost",i,!1),X.addEventListener("webglcontextrestored",o,!1));var et=U.setFBO=s({framebuffer:q.define.call(null,1,"framebuffer")});return f(),v=V(s,{clear:function(t){if("framebuffer"in t)if(t.framebuffer&&"framebufferCube"===t.framebuffer_reglType)for(var e=0;6>e;++e)et(V({framebuffer:t.framebuffer.faces[e]},t),l);else et(t,l);else l(0,t)},prop:q.define.bind(null,1),context:q.define.bind(null,2),this:q.define.bind(null,3),draw:s({}),buffer:function(t){return z.create(t,34962,!1,!1)},elements:function(t){return D.create(t,!1)},texture:F.create2D,cube:F.createCube,renderbuffer:B.create,framebuffer:U.create,framebufferCube:U.createCube,vao:O.createVAO,attributes:v,frame:c,on:function(t,e){var r;switch(t){case"frame":return c(e);case"lost":r=K;break;case"restore":r=Q;break;case"destroy":r=$}return r.push(e),{cancel:function(){for(var t=0;t<r.length;++t)if(r[t]===e){r[t]=r[r.length-1],r.pop();break}}}},limits:I,hasExtension:function(t){return 0<=I.extensions.indexOf(t.toLowerCase())},read:x,destroy:function(){J.length=0,n(),X&&(X.removeEventListener("webglcontextlost",i),X.removeEventListener("webglcontextrestored",o)),R.clear(),U.clear(),B.clear(),F.clear(),D.clear(),z.clear(),O.clear(),w&&w.clear(),$.forEach((function(t){t()}))},_gl:m,_refresh:f,poll:function(){h(),w&&w.update()},now:g,stats:b}),t.onDone(null,v),v}}))},{}],493:[function(t,e,r){
/*!
 * repeat-string <https://github.com/jonschlinkert/repeat-string>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ })
/******/ ])});;