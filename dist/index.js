(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/react/cjs/react.development.js
  var require_react_development = __commonJS({
    "node_modules/react/cjs/react.development.js"(exports, module) {
      "use strict";
      if (true) {
        (function() {
          "use strict";
          if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart === "function") {
            __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
          }
          var ReactVersion = "18.3.1";
          var REACT_ELEMENT_TYPE = Symbol.for("react.element");
          var REACT_PORTAL_TYPE = Symbol.for("react.portal");
          var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
          var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
          var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
          var REACT_PROVIDER_TYPE = Symbol.for("react.provider");
          var REACT_CONTEXT_TYPE = Symbol.for("react.context");
          var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
          var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
          var REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list");
          var REACT_MEMO_TYPE = Symbol.for("react.memo");
          var REACT_LAZY_TYPE = Symbol.for("react.lazy");
          var REACT_OFFSCREEN_TYPE = Symbol.for("react.offscreen");
          var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
          var FAUX_ITERATOR_SYMBOL = "@@iterator";
          function getIteratorFn(maybeIterable) {
            if (maybeIterable === null || typeof maybeIterable !== "object") {
              return null;
            }
            var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
            if (typeof maybeIterator === "function") {
              return maybeIterator;
            }
            return null;
          }
          var ReactCurrentDispatcher = {
            /**
             * @internal
             * @type {ReactComponent}
             */
            current: null
          };
          var ReactCurrentBatchConfig = {
            transition: null
          };
          var ReactCurrentActQueue = {
            current: null,
            // Used to reproduce behavior of `batchedUpdates` in legacy mode.
            isBatchingLegacy: false,
            didScheduleLegacyUpdate: false
          };
          var ReactCurrentOwner = {
            /**
             * @internal
             * @type {ReactComponent}
             */
            current: null
          };
          var ReactDebugCurrentFrame = {};
          var currentExtraStackFrame = null;
          function setExtraStackFrame(stack) {
            {
              currentExtraStackFrame = stack;
            }
          }
          {
            ReactDebugCurrentFrame.setExtraStackFrame = function(stack) {
              {
                currentExtraStackFrame = stack;
              }
            };
            ReactDebugCurrentFrame.getCurrentStack = null;
            ReactDebugCurrentFrame.getStackAddendum = function() {
              var stack = "";
              if (currentExtraStackFrame) {
                stack += currentExtraStackFrame;
              }
              var impl = ReactDebugCurrentFrame.getCurrentStack;
              if (impl) {
                stack += impl() || "";
              }
              return stack;
            };
          }
          var enableScopeAPI = false;
          var enableCacheElement = false;
          var enableTransitionTracing = false;
          var enableLegacyHidden = false;
          var enableDebugTracing = false;
          var ReactSharedInternals = {
            ReactCurrentDispatcher,
            ReactCurrentBatchConfig,
            ReactCurrentOwner
          };
          {
            ReactSharedInternals.ReactDebugCurrentFrame = ReactDebugCurrentFrame;
            ReactSharedInternals.ReactCurrentActQueue = ReactCurrentActQueue;
          }
          function warn(format) {
            {
              {
                for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                  args[_key - 1] = arguments[_key];
                }
                printWarning("warn", format, args);
              }
            }
          }
          function error(format) {
            {
              {
                for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                  args[_key2 - 1] = arguments[_key2];
                }
                printWarning("error", format, args);
              }
            }
          }
          function printWarning(level, format, args) {
            {
              var ReactDebugCurrentFrame2 = ReactSharedInternals.ReactDebugCurrentFrame;
              var stack = ReactDebugCurrentFrame2.getStackAddendum();
              if (stack !== "") {
                format += "%s";
                args = args.concat([stack]);
              }
              var argsWithFormat = args.map(function(item) {
                return String(item);
              });
              argsWithFormat.unshift("Warning: " + format);
              Function.prototype.apply.call(console[level], console, argsWithFormat);
            }
          }
          var didWarnStateUpdateForUnmountedComponent = {};
          function warnNoop(publicInstance, callerName) {
            {
              var _constructor = publicInstance.constructor;
              var componentName = _constructor && (_constructor.displayName || _constructor.name) || "ReactClass";
              var warningKey = componentName + "." + callerName;
              if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
                return;
              }
              error("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", callerName, componentName);
              didWarnStateUpdateForUnmountedComponent[warningKey] = true;
            }
          }
          var ReactNoopUpdateQueue = {
            /**
             * Checks whether or not this composite component is mounted.
             * @param {ReactClass} publicInstance The instance we want to test.
             * @return {boolean} True if mounted, false otherwise.
             * @protected
             * @final
             */
            isMounted: function(publicInstance) {
              return false;
            },
            /**
             * Forces an update. This should only be invoked when it is known with
             * certainty that we are **not** in a DOM transaction.
             *
             * You may want to call this when you know that some deeper aspect of the
             * component's state has changed but `setState` was not called.
             *
             * This will not invoke `shouldComponentUpdate`, but it will invoke
             * `componentWillUpdate` and `componentDidUpdate`.
             *
             * @param {ReactClass} publicInstance The instance that should rerender.
             * @param {?function} callback Called after component is updated.
             * @param {?string} callerName name of the calling function in the public API.
             * @internal
             */
            enqueueForceUpdate: function(publicInstance, callback, callerName) {
              warnNoop(publicInstance, "forceUpdate");
            },
            /**
             * Replaces all of the state. Always use this or `setState` to mutate state.
             * You should treat `this.state` as immutable.
             *
             * There is no guarantee that `this.state` will be immediately updated, so
             * accessing `this.state` after calling this method may return the old value.
             *
             * @param {ReactClass} publicInstance The instance that should rerender.
             * @param {object} completeState Next state.
             * @param {?function} callback Called after component is updated.
             * @param {?string} callerName name of the calling function in the public API.
             * @internal
             */
            enqueueReplaceState: function(publicInstance, completeState, callback, callerName) {
              warnNoop(publicInstance, "replaceState");
            },
            /**
             * Sets a subset of the state. This only exists because _pendingState is
             * internal. This provides a merging strategy that is not available to deep
             * properties which is confusing. TODO: Expose pendingState or don't use it
             * during the merge.
             *
             * @param {ReactClass} publicInstance The instance that should rerender.
             * @param {object} partialState Next partial state to be merged with state.
             * @param {?function} callback Called after component is updated.
             * @param {?string} Name of the calling function in the public API.
             * @internal
             */
            enqueueSetState: function(publicInstance, partialState, callback, callerName) {
              warnNoop(publicInstance, "setState");
            }
          };
          var assign = Object.assign;
          var emptyObject = {};
          {
            Object.freeze(emptyObject);
          }
          function Component(props, context, updater) {
            this.props = props;
            this.context = context;
            this.refs = emptyObject;
            this.updater = updater || ReactNoopUpdateQueue;
          }
          Component.prototype.isReactComponent = {};
          Component.prototype.setState = function(partialState, callback) {
            if (typeof partialState !== "object" && typeof partialState !== "function" && partialState != null) {
              throw new Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
            }
            this.updater.enqueueSetState(this, partialState, callback, "setState");
          };
          Component.prototype.forceUpdate = function(callback) {
            this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
          };
          {
            var deprecatedAPIs = {
              isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
              replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
            };
            var defineDeprecationWarning = function(methodName, info) {
              Object.defineProperty(Component.prototype, methodName, {
                get: function() {
                  warn("%s(...) is deprecated in plain JavaScript React classes. %s", info[0], info[1]);
                  return void 0;
                }
              });
            };
            for (var fnName in deprecatedAPIs) {
              if (deprecatedAPIs.hasOwnProperty(fnName)) {
                defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
              }
            }
          }
          function ComponentDummy() {
          }
          ComponentDummy.prototype = Component.prototype;
          function PureComponent(props, context, updater) {
            this.props = props;
            this.context = context;
            this.refs = emptyObject;
            this.updater = updater || ReactNoopUpdateQueue;
          }
          var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
          pureComponentPrototype.constructor = PureComponent;
          assign(pureComponentPrototype, Component.prototype);
          pureComponentPrototype.isPureReactComponent = true;
          function createRef() {
            var refObject = {
              current: null
            };
            {
              Object.seal(refObject);
            }
            return refObject;
          }
          var isArrayImpl = Array.isArray;
          function isArray(a) {
            return isArrayImpl(a);
          }
          function typeName(value) {
            {
              var hasToStringTag = typeof Symbol === "function" && Symbol.toStringTag;
              var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
              return type;
            }
          }
          function willCoercionThrow(value) {
            {
              try {
                testStringCoercion(value);
                return false;
              } catch (e) {
                return true;
              }
            }
          }
          function testStringCoercion(value) {
            return "" + value;
          }
          function checkKeyStringCoercion(value) {
            {
              if (willCoercionThrow(value)) {
                error("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", typeName(value));
                return testStringCoercion(value);
              }
            }
          }
          function getWrappedName(outerType, innerType, wrapperName) {
            var displayName = outerType.displayName;
            if (displayName) {
              return displayName;
            }
            var functionName = innerType.displayName || innerType.name || "";
            return functionName !== "" ? wrapperName + "(" + functionName + ")" : wrapperName;
          }
          function getContextName(type) {
            return type.displayName || "Context";
          }
          function getComponentNameFromType(type) {
            if (type == null) {
              return null;
            }
            {
              if (typeof type.tag === "number") {
                error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue.");
              }
            }
            if (typeof type === "function") {
              return type.displayName || type.name || null;
            }
            if (typeof type === "string") {
              return type;
            }
            switch (type) {
              case REACT_FRAGMENT_TYPE:
                return "Fragment";
              case REACT_PORTAL_TYPE:
                return "Portal";
              case REACT_PROFILER_TYPE:
                return "Profiler";
              case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
              case REACT_SUSPENSE_TYPE:
                return "Suspense";
              case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            }
            if (typeof type === "object") {
              switch (type.$$typeof) {
                case REACT_CONTEXT_TYPE:
                  var context = type;
                  return getContextName(context) + ".Consumer";
                case REACT_PROVIDER_TYPE:
                  var provider = type;
                  return getContextName(provider._context) + ".Provider";
                case REACT_FORWARD_REF_TYPE:
                  return getWrappedName(type, type.render, "ForwardRef");
                case REACT_MEMO_TYPE:
                  var outerName = type.displayName || null;
                  if (outerName !== null) {
                    return outerName;
                  }
                  return getComponentNameFromType(type.type) || "Memo";
                case REACT_LAZY_TYPE: {
                  var lazyComponent = type;
                  var payload = lazyComponent._payload;
                  var init = lazyComponent._init;
                  try {
                    return getComponentNameFromType(init(payload));
                  } catch (x) {
                    return null;
                  }
                }
              }
            }
            return null;
          }
          var hasOwnProperty = Object.prototype.hasOwnProperty;
          var RESERVED_PROPS = {
            key: true,
            ref: true,
            __self: true,
            __source: true
          };
          var specialPropKeyWarningShown, specialPropRefWarningShown, didWarnAboutStringRefs;
          {
            didWarnAboutStringRefs = {};
          }
          function hasValidRef(config) {
            {
              if (hasOwnProperty.call(config, "ref")) {
                var getter = Object.getOwnPropertyDescriptor(config, "ref").get;
                if (getter && getter.isReactWarning) {
                  return false;
                }
              }
            }
            return config.ref !== void 0;
          }
          function hasValidKey(config) {
            {
              if (hasOwnProperty.call(config, "key")) {
                var getter = Object.getOwnPropertyDescriptor(config, "key").get;
                if (getter && getter.isReactWarning) {
                  return false;
                }
              }
            }
            return config.key !== void 0;
          }
          function defineKeyPropWarningGetter(props, displayName) {
            var warnAboutAccessingKey = function() {
              {
                if (!specialPropKeyWarningShown) {
                  specialPropKeyWarningShown = true;
                  error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
                }
              }
            };
            warnAboutAccessingKey.isReactWarning = true;
            Object.defineProperty(props, "key", {
              get: warnAboutAccessingKey,
              configurable: true
            });
          }
          function defineRefPropWarningGetter(props, displayName) {
            var warnAboutAccessingRef = function() {
              {
                if (!specialPropRefWarningShown) {
                  specialPropRefWarningShown = true;
                  error("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
                }
              }
            };
            warnAboutAccessingRef.isReactWarning = true;
            Object.defineProperty(props, "ref", {
              get: warnAboutAccessingRef,
              configurable: true
            });
          }
          function warnIfStringRefCannotBeAutoConverted(config) {
            {
              if (typeof config.ref === "string" && ReactCurrentOwner.current && config.__self && ReactCurrentOwner.current.stateNode !== config.__self) {
                var componentName = getComponentNameFromType(ReactCurrentOwner.current.type);
                if (!didWarnAboutStringRefs[componentName]) {
                  error('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', componentName, config.ref);
                  didWarnAboutStringRefs[componentName] = true;
                }
              }
            }
          }
          var ReactElement = function(type, key, ref, self2, source, owner, props) {
            var element = {
              // This tag allows us to uniquely identify this as a React Element
              $$typeof: REACT_ELEMENT_TYPE,
              // Built-in properties that belong on the element
              type,
              key,
              ref,
              props,
              // Record the component responsible for creating this element.
              _owner: owner
            };
            {
              element._store = {};
              Object.defineProperty(element._store, "validated", {
                configurable: false,
                enumerable: false,
                writable: true,
                value: false
              });
              Object.defineProperty(element, "_self", {
                configurable: false,
                enumerable: false,
                writable: false,
                value: self2
              });
              Object.defineProperty(element, "_source", {
                configurable: false,
                enumerable: false,
                writable: false,
                value: source
              });
              if (Object.freeze) {
                Object.freeze(element.props);
                Object.freeze(element);
              }
            }
            return element;
          };
          function createElement(type, config, children) {
            var propName;
            var props = {};
            var key = null;
            var ref = null;
            var self2 = null;
            var source = null;
            if (config != null) {
              if (hasValidRef(config)) {
                ref = config.ref;
                {
                  warnIfStringRefCannotBeAutoConverted(config);
                }
              }
              if (hasValidKey(config)) {
                {
                  checkKeyStringCoercion(config.key);
                }
                key = "" + config.key;
              }
              self2 = config.__self === void 0 ? null : config.__self;
              source = config.__source === void 0 ? null : config.__source;
              for (propName in config) {
                if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
                  props[propName] = config[propName];
                }
              }
            }
            var childrenLength = arguments.length - 2;
            if (childrenLength === 1) {
              props.children = children;
            } else if (childrenLength > 1) {
              var childArray = Array(childrenLength);
              for (var i = 0; i < childrenLength; i++) {
                childArray[i] = arguments[i + 2];
              }
              {
                if (Object.freeze) {
                  Object.freeze(childArray);
                }
              }
              props.children = childArray;
            }
            if (type && type.defaultProps) {
              var defaultProps = type.defaultProps;
              for (propName in defaultProps) {
                if (props[propName] === void 0) {
                  props[propName] = defaultProps[propName];
                }
              }
            }
            {
              if (key || ref) {
                var displayName = typeof type === "function" ? type.displayName || type.name || "Unknown" : type;
                if (key) {
                  defineKeyPropWarningGetter(props, displayName);
                }
                if (ref) {
                  defineRefPropWarningGetter(props, displayName);
                }
              }
            }
            return ReactElement(type, key, ref, self2, source, ReactCurrentOwner.current, props);
          }
          function cloneAndReplaceKey(oldElement, newKey) {
            var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);
            return newElement;
          }
          function cloneElement(element, config, children) {
            if (element === null || element === void 0) {
              throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + element + ".");
            }
            var propName;
            var props = assign({}, element.props);
            var key = element.key;
            var ref = element.ref;
            var self2 = element._self;
            var source = element._source;
            var owner = element._owner;
            if (config != null) {
              if (hasValidRef(config)) {
                ref = config.ref;
                owner = ReactCurrentOwner.current;
              }
              if (hasValidKey(config)) {
                {
                  checkKeyStringCoercion(config.key);
                }
                key = "" + config.key;
              }
              var defaultProps;
              if (element.type && element.type.defaultProps) {
                defaultProps = element.type.defaultProps;
              }
              for (propName in config) {
                if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
                  if (config[propName] === void 0 && defaultProps !== void 0) {
                    props[propName] = defaultProps[propName];
                  } else {
                    props[propName] = config[propName];
                  }
                }
              }
            }
            var childrenLength = arguments.length - 2;
            if (childrenLength === 1) {
              props.children = children;
            } else if (childrenLength > 1) {
              var childArray = Array(childrenLength);
              for (var i = 0; i < childrenLength; i++) {
                childArray[i] = arguments[i + 2];
              }
              props.children = childArray;
            }
            return ReactElement(element.type, key, ref, self2, source, owner, props);
          }
          function isValidElement(object) {
            return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
          }
          var SEPARATOR = ".";
          var SUBSEPARATOR = ":";
          function escape(key) {
            var escapeRegex = /[=:]/g;
            var escaperLookup = {
              "=": "=0",
              ":": "=2"
            };
            var escapedString = key.replace(escapeRegex, function(match) {
              return escaperLookup[match];
            });
            return "$" + escapedString;
          }
          var didWarnAboutMaps = false;
          var userProvidedKeyEscapeRegex = /\/+/g;
          function escapeUserProvidedKey(text) {
            return text.replace(userProvidedKeyEscapeRegex, "$&/");
          }
          function getElementKey(element, index) {
            if (typeof element === "object" && element !== null && element.key != null) {
              {
                checkKeyStringCoercion(element.key);
              }
              return escape("" + element.key);
            }
            return index.toString(36);
          }
          function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
            var type = typeof children;
            if (type === "undefined" || type === "boolean") {
              children = null;
            }
            var invokeCallback = false;
            if (children === null) {
              invokeCallback = true;
            } else {
              switch (type) {
                case "string":
                case "number":
                  invokeCallback = true;
                  break;
                case "object":
                  switch (children.$$typeof) {
                    case REACT_ELEMENT_TYPE:
                    case REACT_PORTAL_TYPE:
                      invokeCallback = true;
                  }
              }
            }
            if (invokeCallback) {
              var _child = children;
              var mappedChild = callback(_child);
              var childKey = nameSoFar === "" ? SEPARATOR + getElementKey(_child, 0) : nameSoFar;
              if (isArray(mappedChild)) {
                var escapedChildKey = "";
                if (childKey != null) {
                  escapedChildKey = escapeUserProvidedKey(childKey) + "/";
                }
                mapIntoArray(mappedChild, array, escapedChildKey, "", function(c) {
                  return c;
                });
              } else if (mappedChild != null) {
                if (isValidElement(mappedChild)) {
                  {
                    if (mappedChild.key && (!_child || _child.key !== mappedChild.key)) {
                      checkKeyStringCoercion(mappedChild.key);
                    }
                  }
                  mappedChild = cloneAndReplaceKey(
                    mappedChild,
                    // Keep both the (mapped) and old keys if they differ, just as
                    // traverseAllChildren used to do for objects as children
                    escapedPrefix + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
                    (mappedChild.key && (!_child || _child.key !== mappedChild.key) ? (
                      // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
                      // eslint-disable-next-line react-internal/safe-string-coercion
                      escapeUserProvidedKey("" + mappedChild.key) + "/"
                    ) : "") + childKey
                  );
                }
                array.push(mappedChild);
              }
              return 1;
            }
            var child;
            var nextName;
            var subtreeCount = 0;
            var nextNamePrefix = nameSoFar === "" ? SEPARATOR : nameSoFar + SUBSEPARATOR;
            if (isArray(children)) {
              for (var i = 0; i < children.length; i++) {
                child = children[i];
                nextName = nextNamePrefix + getElementKey(child, i);
                subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
              }
            } else {
              var iteratorFn = getIteratorFn(children);
              if (typeof iteratorFn === "function") {
                var iterableChildren = children;
                {
                  if (iteratorFn === iterableChildren.entries) {
                    if (!didWarnAboutMaps) {
                      warn("Using Maps as children is not supported. Use an array of keyed ReactElements instead.");
                    }
                    didWarnAboutMaps = true;
                  }
                }
                var iterator = iteratorFn.call(iterableChildren);
                var step;
                var ii = 0;
                while (!(step = iterator.next()).done) {
                  child = step.value;
                  nextName = nextNamePrefix + getElementKey(child, ii++);
                  subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
                }
              } else if (type === "object") {
                var childrenString = String(children);
                throw new Error("Objects are not valid as a React child (found: " + (childrenString === "[object Object]" ? "object with keys {" + Object.keys(children).join(", ") + "}" : childrenString) + "). If you meant to render a collection of children, use an array instead.");
              }
            }
            return subtreeCount;
          }
          function mapChildren(children, func, context) {
            if (children == null) {
              return children;
            }
            var result = [];
            var count = 0;
            mapIntoArray(children, result, "", "", function(child) {
              return func.call(context, child, count++);
            });
            return result;
          }
          function countChildren(children) {
            var n = 0;
            mapChildren(children, function() {
              n++;
            });
            return n;
          }
          function forEachChildren(children, forEachFunc, forEachContext) {
            mapChildren(children, function() {
              forEachFunc.apply(this, arguments);
            }, forEachContext);
          }
          function toArray(children) {
            return mapChildren(children, function(child) {
              return child;
            }) || [];
          }
          function onlyChild(children) {
            if (!isValidElement(children)) {
              throw new Error("React.Children.only expected to receive a single React element child.");
            }
            return children;
          }
          function createContext(defaultValue) {
            var context = {
              $$typeof: REACT_CONTEXT_TYPE,
              // As a workaround to support multiple concurrent renderers, we categorize
              // some renderers as primary and others as secondary. We only expect
              // there to be two concurrent renderers at most: React Native (primary) and
              // Fabric (secondary); React DOM (primary) and React ART (secondary).
              // Secondary renderers store their context values on separate fields.
              _currentValue: defaultValue,
              _currentValue2: defaultValue,
              // Used to track how many concurrent renderers this context currently
              // supports within in a single renderer. Such as parallel server rendering.
              _threadCount: 0,
              // These are circular
              Provider: null,
              Consumer: null,
              // Add these to use same hidden class in VM as ServerContext
              _defaultValue: null,
              _globalName: null
            };
            context.Provider = {
              $$typeof: REACT_PROVIDER_TYPE,
              _context: context
            };
            var hasWarnedAboutUsingNestedContextConsumers = false;
            var hasWarnedAboutUsingConsumerProvider = false;
            var hasWarnedAboutDisplayNameOnConsumer = false;
            {
              var Consumer = {
                $$typeof: REACT_CONTEXT_TYPE,
                _context: context
              };
              Object.defineProperties(Consumer, {
                Provider: {
                  get: function() {
                    if (!hasWarnedAboutUsingConsumerProvider) {
                      hasWarnedAboutUsingConsumerProvider = true;
                      error("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?");
                    }
                    return context.Provider;
                  },
                  set: function(_Provider) {
                    context.Provider = _Provider;
                  }
                },
                _currentValue: {
                  get: function() {
                    return context._currentValue;
                  },
                  set: function(_currentValue) {
                    context._currentValue = _currentValue;
                  }
                },
                _currentValue2: {
                  get: function() {
                    return context._currentValue2;
                  },
                  set: function(_currentValue2) {
                    context._currentValue2 = _currentValue2;
                  }
                },
                _threadCount: {
                  get: function() {
                    return context._threadCount;
                  },
                  set: function(_threadCount) {
                    context._threadCount = _threadCount;
                  }
                },
                Consumer: {
                  get: function() {
                    if (!hasWarnedAboutUsingNestedContextConsumers) {
                      hasWarnedAboutUsingNestedContextConsumers = true;
                      error("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?");
                    }
                    return context.Consumer;
                  }
                },
                displayName: {
                  get: function() {
                    return context.displayName;
                  },
                  set: function(displayName) {
                    if (!hasWarnedAboutDisplayNameOnConsumer) {
                      warn("Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.", displayName);
                      hasWarnedAboutDisplayNameOnConsumer = true;
                    }
                  }
                }
              });
              context.Consumer = Consumer;
            }
            {
              context._currentRenderer = null;
              context._currentRenderer2 = null;
            }
            return context;
          }
          var Uninitialized = -1;
          var Pending = 0;
          var Resolved = 1;
          var Rejected = 2;
          function lazyInitializer(payload) {
            if (payload._status === Uninitialized) {
              var ctor = payload._result;
              var thenable = ctor();
              thenable.then(function(moduleObject2) {
                if (payload._status === Pending || payload._status === Uninitialized) {
                  var resolved = payload;
                  resolved._status = Resolved;
                  resolved._result = moduleObject2;
                }
              }, function(error2) {
                if (payload._status === Pending || payload._status === Uninitialized) {
                  var rejected = payload;
                  rejected._status = Rejected;
                  rejected._result = error2;
                }
              });
              if (payload._status === Uninitialized) {
                var pending = payload;
                pending._status = Pending;
                pending._result = thenable;
              }
            }
            if (payload._status === Resolved) {
              var moduleObject = payload._result;
              {
                if (moduleObject === void 0) {
                  error("lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))\n\nDid you accidentally put curly braces around the import?", moduleObject);
                }
              }
              {
                if (!("default" in moduleObject)) {
                  error("lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))", moduleObject);
                }
              }
              return moduleObject.default;
            } else {
              throw payload._result;
            }
          }
          function lazy(ctor) {
            var payload = {
              // We use these fields to store the result.
              _status: Uninitialized,
              _result: ctor
            };
            var lazyType = {
              $$typeof: REACT_LAZY_TYPE,
              _payload: payload,
              _init: lazyInitializer
            };
            {
              var defaultProps;
              var propTypes;
              Object.defineProperties(lazyType, {
                defaultProps: {
                  configurable: true,
                  get: function() {
                    return defaultProps;
                  },
                  set: function(newDefaultProps) {
                    error("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it.");
                    defaultProps = newDefaultProps;
                    Object.defineProperty(lazyType, "defaultProps", {
                      enumerable: true
                    });
                  }
                },
                propTypes: {
                  configurable: true,
                  get: function() {
                    return propTypes;
                  },
                  set: function(newPropTypes) {
                    error("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it.");
                    propTypes = newPropTypes;
                    Object.defineProperty(lazyType, "propTypes", {
                      enumerable: true
                    });
                  }
                }
              });
            }
            return lazyType;
          }
          function forwardRef(render) {
            {
              if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
                error("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).");
              } else if (typeof render !== "function") {
                error("forwardRef requires a render function but was given %s.", render === null ? "null" : typeof render);
              } else {
                if (render.length !== 0 && render.length !== 2) {
                  error("forwardRef render functions accept exactly two parameters: props and ref. %s", render.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined.");
                }
              }
              if (render != null) {
                if (render.defaultProps != null || render.propTypes != null) {
                  error("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
                }
              }
            }
            var elementType = {
              $$typeof: REACT_FORWARD_REF_TYPE,
              render
            };
            {
              var ownName;
              Object.defineProperty(elementType, "displayName", {
                enumerable: false,
                configurable: true,
                get: function() {
                  return ownName;
                },
                set: function(name) {
                  ownName = name;
                  if (!render.name && !render.displayName) {
                    render.displayName = name;
                  }
                }
              });
            }
            return elementType;
          }
          var REACT_MODULE_REFERENCE;
          {
            REACT_MODULE_REFERENCE = Symbol.for("react.module.reference");
          }
          function isValidElementType(type) {
            if (typeof type === "string" || typeof type === "function") {
              return true;
            }
            if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden || type === REACT_OFFSCREEN_TYPE || enableScopeAPI || enableCacheElement || enableTransitionTracing) {
              return true;
            }
            if (typeof type === "object" && type !== null) {
              if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || // This needs to include all possible module reference object
              // types supported by any Flight configuration anywhere since
              // we don't know which Flight build this will end up being used
              // with.
              type.$$typeof === REACT_MODULE_REFERENCE || type.getModuleId !== void 0) {
                return true;
              }
            }
            return false;
          }
          function memo(type, compare) {
            {
              if (!isValidElementType(type)) {
                error("memo: The first argument must be a component. Instead received: %s", type === null ? "null" : typeof type);
              }
            }
            var elementType = {
              $$typeof: REACT_MEMO_TYPE,
              type,
              compare: compare === void 0 ? null : compare
            };
            {
              var ownName;
              Object.defineProperty(elementType, "displayName", {
                enumerable: false,
                configurable: true,
                get: function() {
                  return ownName;
                },
                set: function(name) {
                  ownName = name;
                  if (!type.name && !type.displayName) {
                    type.displayName = name;
                  }
                }
              });
            }
            return elementType;
          }
          function resolveDispatcher() {
            var dispatcher = ReactCurrentDispatcher.current;
            {
              if (dispatcher === null) {
                error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.");
              }
            }
            return dispatcher;
          }
          function useContext(Context) {
            var dispatcher = resolveDispatcher();
            {
              if (Context._context !== void 0) {
                var realContext = Context._context;
                if (realContext.Consumer === Context) {
                  error("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?");
                } else if (realContext.Provider === Context) {
                  error("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
                }
              }
            }
            return dispatcher.useContext(Context);
          }
          function useState(initialState) {
            var dispatcher = resolveDispatcher();
            return dispatcher.useState(initialState);
          }
          function useReducer(reducer2, initialArg, init) {
            var dispatcher = resolveDispatcher();
            return dispatcher.useReducer(reducer2, initialArg, init);
          }
          function useRef(initialValue) {
            var dispatcher = resolveDispatcher();
            return dispatcher.useRef(initialValue);
          }
          function useEffect(create, deps) {
            var dispatcher = resolveDispatcher();
            return dispatcher.useEffect(create, deps);
          }
          function useInsertionEffect(create, deps) {
            var dispatcher = resolveDispatcher();
            return dispatcher.useInsertionEffect(create, deps);
          }
          function useLayoutEffect(create, deps) {
            var dispatcher = resolveDispatcher();
            return dispatcher.useLayoutEffect(create, deps);
          }
          function useCallback(callback, deps) {
            var dispatcher = resolveDispatcher();
            return dispatcher.useCallback(callback, deps);
          }
          function useMemo(create, deps) {
            var dispatcher = resolveDispatcher();
            return dispatcher.useMemo(create, deps);
          }
          function useImperativeHandle(ref, create, deps) {
            var dispatcher = resolveDispatcher();
            return dispatcher.useImperativeHandle(ref, create, deps);
          }
          function useDebugValue(value, formatterFn) {
            {
              var dispatcher = resolveDispatcher();
              return dispatcher.useDebugValue(value, formatterFn);
            }
          }
          function useTransition() {
            var dispatcher = resolveDispatcher();
            return dispatcher.useTransition();
          }
          function useDeferredValue(value) {
            var dispatcher = resolveDispatcher();
            return dispatcher.useDeferredValue(value);
          }
          function useId() {
            var dispatcher = resolveDispatcher();
            return dispatcher.useId();
          }
          function useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
            var dispatcher = resolveDispatcher();
            return dispatcher.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
          }
          var disabledDepth = 0;
          var prevLog;
          var prevInfo;
          var prevWarn;
          var prevError;
          var prevGroup;
          var prevGroupCollapsed;
          var prevGroupEnd;
          function disabledLog() {
          }
          disabledLog.__reactDisabledLog = true;
          function disableLogs() {
            {
              if (disabledDepth === 0) {
                prevLog = console.log;
                prevInfo = console.info;
                prevWarn = console.warn;
                prevError = console.error;
                prevGroup = console.group;
                prevGroupCollapsed = console.groupCollapsed;
                prevGroupEnd = console.groupEnd;
                var props = {
                  configurable: true,
                  enumerable: true,
                  value: disabledLog,
                  writable: true
                };
                Object.defineProperties(console, {
                  info: props,
                  log: props,
                  warn: props,
                  error: props,
                  group: props,
                  groupCollapsed: props,
                  groupEnd: props
                });
              }
              disabledDepth++;
            }
          }
          function reenableLogs() {
            {
              disabledDepth--;
              if (disabledDepth === 0) {
                var props = {
                  configurable: true,
                  enumerable: true,
                  writable: true
                };
                Object.defineProperties(console, {
                  log: assign({}, props, {
                    value: prevLog
                  }),
                  info: assign({}, props, {
                    value: prevInfo
                  }),
                  warn: assign({}, props, {
                    value: prevWarn
                  }),
                  error: assign({}, props, {
                    value: prevError
                  }),
                  group: assign({}, props, {
                    value: prevGroup
                  }),
                  groupCollapsed: assign({}, props, {
                    value: prevGroupCollapsed
                  }),
                  groupEnd: assign({}, props, {
                    value: prevGroupEnd
                  })
                });
              }
              if (disabledDepth < 0) {
                error("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
              }
            }
          }
          var ReactCurrentDispatcher$1 = ReactSharedInternals.ReactCurrentDispatcher;
          var prefix;
          function describeBuiltInComponentFrame(name, source, ownerFn) {
            {
              if (prefix === void 0) {
                try {
                  throw Error();
                } catch (x) {
                  var match = x.stack.trim().match(/\n( *(at )?)/);
                  prefix = match && match[1] || "";
                }
              }
              return "\n" + prefix + name;
            }
          }
          var reentry = false;
          var componentFrameCache;
          {
            var PossiblyWeakMap = typeof WeakMap === "function" ? WeakMap : Map;
            componentFrameCache = new PossiblyWeakMap();
          }
          function describeNativeComponentFrame(fn, construct) {
            if (!fn || reentry) {
              return "";
            }
            {
              var frame = componentFrameCache.get(fn);
              if (frame !== void 0) {
                return frame;
              }
            }
            var control;
            reentry = true;
            var previousPrepareStackTrace = Error.prepareStackTrace;
            Error.prepareStackTrace = void 0;
            var previousDispatcher;
            {
              previousDispatcher = ReactCurrentDispatcher$1.current;
              ReactCurrentDispatcher$1.current = null;
              disableLogs();
            }
            try {
              if (construct) {
                var Fake = function() {
                  throw Error();
                };
                Object.defineProperty(Fake.prototype, "props", {
                  set: function() {
                    throw Error();
                  }
                });
                if (typeof Reflect === "object" && Reflect.construct) {
                  try {
                    Reflect.construct(Fake, []);
                  } catch (x) {
                    control = x;
                  }
                  Reflect.construct(fn, [], Fake);
                } else {
                  try {
                    Fake.call();
                  } catch (x) {
                    control = x;
                  }
                  fn.call(Fake.prototype);
                }
              } else {
                try {
                  throw Error();
                } catch (x) {
                  control = x;
                }
                fn();
              }
            } catch (sample) {
              if (sample && control && typeof sample.stack === "string") {
                var sampleLines = sample.stack.split("\n");
                var controlLines = control.stack.split("\n");
                var s = sampleLines.length - 1;
                var c = controlLines.length - 1;
                while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
                  c--;
                }
                for (; s >= 1 && c >= 0; s--, c--) {
                  if (sampleLines[s] !== controlLines[c]) {
                    if (s !== 1 || c !== 1) {
                      do {
                        s--;
                        c--;
                        if (c < 0 || sampleLines[s] !== controlLines[c]) {
                          var _frame = "\n" + sampleLines[s].replace(" at new ", " at ");
                          if (fn.displayName && _frame.includes("<anonymous>")) {
                            _frame = _frame.replace("<anonymous>", fn.displayName);
                          }
                          {
                            if (typeof fn === "function") {
                              componentFrameCache.set(fn, _frame);
                            }
                          }
                          return _frame;
                        }
                      } while (s >= 1 && c >= 0);
                    }
                    break;
                  }
                }
              }
            } finally {
              reentry = false;
              {
                ReactCurrentDispatcher$1.current = previousDispatcher;
                reenableLogs();
              }
              Error.prepareStackTrace = previousPrepareStackTrace;
            }
            var name = fn ? fn.displayName || fn.name : "";
            var syntheticFrame = name ? describeBuiltInComponentFrame(name) : "";
            {
              if (typeof fn === "function") {
                componentFrameCache.set(fn, syntheticFrame);
              }
            }
            return syntheticFrame;
          }
          function describeFunctionComponentFrame(fn, source, ownerFn) {
            {
              return describeNativeComponentFrame(fn, false);
            }
          }
          function shouldConstruct(Component2) {
            var prototype = Component2.prototype;
            return !!(prototype && prototype.isReactComponent);
          }
          function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
            if (type == null) {
              return "";
            }
            if (typeof type === "function") {
              {
                return describeNativeComponentFrame(type, shouldConstruct(type));
              }
            }
            if (typeof type === "string") {
              return describeBuiltInComponentFrame(type);
            }
            switch (type) {
              case REACT_SUSPENSE_TYPE:
                return describeBuiltInComponentFrame("Suspense");
              case REACT_SUSPENSE_LIST_TYPE:
                return describeBuiltInComponentFrame("SuspenseList");
            }
            if (typeof type === "object") {
              switch (type.$$typeof) {
                case REACT_FORWARD_REF_TYPE:
                  return describeFunctionComponentFrame(type.render);
                case REACT_MEMO_TYPE:
                  return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);
                case REACT_LAZY_TYPE: {
                  var lazyComponent = type;
                  var payload = lazyComponent._payload;
                  var init = lazyComponent._init;
                  try {
                    return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
                  } catch (x) {
                  }
                }
              }
            }
            return "";
          }
          var loggedTypeFailures = {};
          var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
          function setCurrentlyValidatingElement(element) {
            {
              if (element) {
                var owner = element._owner;
                var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
                ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
              } else {
                ReactDebugCurrentFrame$1.setExtraStackFrame(null);
              }
            }
          }
          function checkPropTypes(typeSpecs, values, location, componentName, element) {
            {
              var has = Function.call.bind(hasOwnProperty);
              for (var typeSpecName in typeSpecs) {
                if (has(typeSpecs, typeSpecName)) {
                  var error$1 = void 0;
                  try {
                    if (typeof typeSpecs[typeSpecName] !== "function") {
                      var err = Error((componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                      err.name = "Invariant Violation";
                      throw err;
                    }
                    error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
                  } catch (ex) {
                    error$1 = ex;
                  }
                  if (error$1 && !(error$1 instanceof Error)) {
                    setCurrentlyValidatingElement(element);
                    error("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", componentName || "React class", location, typeSpecName, typeof error$1);
                    setCurrentlyValidatingElement(null);
                  }
                  if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
                    loggedTypeFailures[error$1.message] = true;
                    setCurrentlyValidatingElement(element);
                    error("Failed %s type: %s", location, error$1.message);
                    setCurrentlyValidatingElement(null);
                  }
                }
              }
            }
          }
          function setCurrentlyValidatingElement$1(element) {
            {
              if (element) {
                var owner = element._owner;
                var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
                setExtraStackFrame(stack);
              } else {
                setExtraStackFrame(null);
              }
            }
          }
          var propTypesMisspellWarningShown;
          {
            propTypesMisspellWarningShown = false;
          }
          function getDeclarationErrorAddendum() {
            if (ReactCurrentOwner.current) {
              var name = getComponentNameFromType(ReactCurrentOwner.current.type);
              if (name) {
                return "\n\nCheck the render method of `" + name + "`.";
              }
            }
            return "";
          }
          function getSourceInfoErrorAddendum(source) {
            if (source !== void 0) {
              var fileName = source.fileName.replace(/^.*[\\\/]/, "");
              var lineNumber = source.lineNumber;
              return "\n\nCheck your code at " + fileName + ":" + lineNumber + ".";
            }
            return "";
          }
          function getSourceInfoErrorAddendumForProps(elementProps) {
            if (elementProps !== null && elementProps !== void 0) {
              return getSourceInfoErrorAddendum(elementProps.__source);
            }
            return "";
          }
          var ownerHasKeyUseWarning = {};
          function getCurrentComponentErrorInfo(parentType) {
            var info = getDeclarationErrorAddendum();
            if (!info) {
              var parentName = typeof parentType === "string" ? parentType : parentType.displayName || parentType.name;
              if (parentName) {
                info = "\n\nCheck the top-level render call using <" + parentName + ">.";
              }
            }
            return info;
          }
          function validateExplicitKey(element, parentType) {
            if (!element._store || element._store.validated || element.key != null) {
              return;
            }
            element._store.validated = true;
            var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
            if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
              return;
            }
            ownerHasKeyUseWarning[currentComponentErrorInfo] = true;
            var childOwner = "";
            if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
              childOwner = " It was passed a child from " + getComponentNameFromType(element._owner.type) + ".";
            }
            {
              setCurrentlyValidatingElement$1(element);
              error('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner);
              setCurrentlyValidatingElement$1(null);
            }
          }
          function validateChildKeys(node, parentType) {
            if (typeof node !== "object") {
              return;
            }
            if (isArray(node)) {
              for (var i = 0; i < node.length; i++) {
                var child = node[i];
                if (isValidElement(child)) {
                  validateExplicitKey(child, parentType);
                }
              }
            } else if (isValidElement(node)) {
              if (node._store) {
                node._store.validated = true;
              }
            } else if (node) {
              var iteratorFn = getIteratorFn(node);
              if (typeof iteratorFn === "function") {
                if (iteratorFn !== node.entries) {
                  var iterator = iteratorFn.call(node);
                  var step;
                  while (!(step = iterator.next()).done) {
                    if (isValidElement(step.value)) {
                      validateExplicitKey(step.value, parentType);
                    }
                  }
                }
              }
            }
          }
          function validatePropTypes(element) {
            {
              var type = element.type;
              if (type === null || type === void 0 || typeof type === "string") {
                return;
              }
              var propTypes;
              if (typeof type === "function") {
                propTypes = type.propTypes;
              } else if (typeof type === "object" && (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
              // Inner props are checked in the reconciler.
              type.$$typeof === REACT_MEMO_TYPE)) {
                propTypes = type.propTypes;
              } else {
                return;
              }
              if (propTypes) {
                var name = getComponentNameFromType(type);
                checkPropTypes(propTypes, element.props, "prop", name, element);
              } else if (type.PropTypes !== void 0 && !propTypesMisspellWarningShown) {
                propTypesMisspellWarningShown = true;
                var _name = getComponentNameFromType(type);
                error("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", _name || "Unknown");
              }
              if (typeof type.getDefaultProps === "function" && !type.getDefaultProps.isReactClassApproved) {
                error("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
              }
            }
          }
          function validateFragmentProps(fragment) {
            {
              var keys = Object.keys(fragment.props);
              for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (key !== "children" && key !== "key") {
                  setCurrentlyValidatingElement$1(fragment);
                  error("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", key);
                  setCurrentlyValidatingElement$1(null);
                  break;
                }
              }
              if (fragment.ref !== null) {
                setCurrentlyValidatingElement$1(fragment);
                error("Invalid attribute `ref` supplied to `React.Fragment`.");
                setCurrentlyValidatingElement$1(null);
              }
            }
          }
          function createElementWithValidation(type, props, children) {
            var validType = isValidElementType(type);
            if (!validType) {
              var info = "";
              if (type === void 0 || typeof type === "object" && type !== null && Object.keys(type).length === 0) {
                info += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.";
              }
              var sourceInfo = getSourceInfoErrorAddendumForProps(props);
              if (sourceInfo) {
                info += sourceInfo;
              } else {
                info += getDeclarationErrorAddendum();
              }
              var typeString;
              if (type === null) {
                typeString = "null";
              } else if (isArray(type)) {
                typeString = "array";
              } else if (type !== void 0 && type.$$typeof === REACT_ELEMENT_TYPE) {
                typeString = "<" + (getComponentNameFromType(type.type) || "Unknown") + " />";
                info = " Did you accidentally export a JSX literal instead of a component?";
              } else {
                typeString = typeof type;
              }
              {
                error("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", typeString, info);
              }
            }
            var element = createElement.apply(this, arguments);
            if (element == null) {
              return element;
            }
            if (validType) {
              for (var i = 2; i < arguments.length; i++) {
                validateChildKeys(arguments[i], type);
              }
            }
            if (type === REACT_FRAGMENT_TYPE) {
              validateFragmentProps(element);
            } else {
              validatePropTypes(element);
            }
            return element;
          }
          var didWarnAboutDeprecatedCreateFactory = false;
          function createFactoryWithValidation(type) {
            var validatedFactory = createElementWithValidation.bind(null, type);
            validatedFactory.type = type;
            {
              if (!didWarnAboutDeprecatedCreateFactory) {
                didWarnAboutDeprecatedCreateFactory = true;
                warn("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.");
              }
              Object.defineProperty(validatedFactory, "type", {
                enumerable: false,
                get: function() {
                  warn("Factory.type is deprecated. Access the class directly before passing it to createFactory.");
                  Object.defineProperty(this, "type", {
                    value: type
                  });
                  return type;
                }
              });
            }
            return validatedFactory;
          }
          function cloneElementWithValidation(element, props, children) {
            var newElement = cloneElement.apply(this, arguments);
            for (var i = 2; i < arguments.length; i++) {
              validateChildKeys(arguments[i], newElement.type);
            }
            validatePropTypes(newElement);
            return newElement;
          }
          function startTransition(scope, options) {
            var prevTransition = ReactCurrentBatchConfig.transition;
            ReactCurrentBatchConfig.transition = {};
            var currentTransition = ReactCurrentBatchConfig.transition;
            {
              ReactCurrentBatchConfig.transition._updatedFibers = /* @__PURE__ */ new Set();
            }
            try {
              scope();
            } finally {
              ReactCurrentBatchConfig.transition = prevTransition;
              {
                if (prevTransition === null && currentTransition._updatedFibers) {
                  var updatedFibersCount = currentTransition._updatedFibers.size;
                  if (updatedFibersCount > 10) {
                    warn("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table.");
                  }
                  currentTransition._updatedFibers.clear();
                }
              }
            }
          }
          var didWarnAboutMessageChannel = false;
          var enqueueTaskImpl = null;
          function enqueueTask(task) {
            if (enqueueTaskImpl === null) {
              try {
                var requireString = ("require" + Math.random()).slice(0, 7);
                var nodeRequire = module && module[requireString];
                enqueueTaskImpl = nodeRequire.call(module, "timers").setImmediate;
              } catch (_err) {
                enqueueTaskImpl = function(callback) {
                  {
                    if (didWarnAboutMessageChannel === false) {
                      didWarnAboutMessageChannel = true;
                      if (typeof MessageChannel === "undefined") {
                        error("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning.");
                      }
                    }
                  }
                  var channel = new MessageChannel();
                  channel.port1.onmessage = callback;
                  channel.port2.postMessage(void 0);
                };
              }
            }
            return enqueueTaskImpl(task);
          }
          var actScopeDepth = 0;
          var didWarnNoAwaitAct = false;
          function act(callback) {
            {
              var prevActScopeDepth = actScopeDepth;
              actScopeDepth++;
              if (ReactCurrentActQueue.current === null) {
                ReactCurrentActQueue.current = [];
              }
              var prevIsBatchingLegacy = ReactCurrentActQueue.isBatchingLegacy;
              var result;
              try {
                ReactCurrentActQueue.isBatchingLegacy = true;
                result = callback();
                if (!prevIsBatchingLegacy && ReactCurrentActQueue.didScheduleLegacyUpdate) {
                  var queue = ReactCurrentActQueue.current;
                  if (queue !== null) {
                    ReactCurrentActQueue.didScheduleLegacyUpdate = false;
                    flushActQueue(queue);
                  }
                }
              } catch (error2) {
                popActScope(prevActScopeDepth);
                throw error2;
              } finally {
                ReactCurrentActQueue.isBatchingLegacy = prevIsBatchingLegacy;
              }
              if (result !== null && typeof result === "object" && typeof result.then === "function") {
                var thenableResult = result;
                var wasAwaited = false;
                var thenable = {
                  then: function(resolve, reject) {
                    wasAwaited = true;
                    thenableResult.then(function(returnValue2) {
                      popActScope(prevActScopeDepth);
                      if (actScopeDepth === 0) {
                        recursivelyFlushAsyncActWork(returnValue2, resolve, reject);
                      } else {
                        resolve(returnValue2);
                      }
                    }, function(error2) {
                      popActScope(prevActScopeDepth);
                      reject(error2);
                    });
                  }
                };
                {
                  if (!didWarnNoAwaitAct && typeof Promise !== "undefined") {
                    Promise.resolve().then(function() {
                    }).then(function() {
                      if (!wasAwaited) {
                        didWarnNoAwaitAct = true;
                        error("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);");
                      }
                    });
                  }
                }
                return thenable;
              } else {
                var returnValue = result;
                popActScope(prevActScopeDepth);
                if (actScopeDepth === 0) {
                  var _queue = ReactCurrentActQueue.current;
                  if (_queue !== null) {
                    flushActQueue(_queue);
                    ReactCurrentActQueue.current = null;
                  }
                  var _thenable = {
                    then: function(resolve, reject) {
                      if (ReactCurrentActQueue.current === null) {
                        ReactCurrentActQueue.current = [];
                        recursivelyFlushAsyncActWork(returnValue, resolve, reject);
                      } else {
                        resolve(returnValue);
                      }
                    }
                  };
                  return _thenable;
                } else {
                  var _thenable2 = {
                    then: function(resolve, reject) {
                      resolve(returnValue);
                    }
                  };
                  return _thenable2;
                }
              }
            }
          }
          function popActScope(prevActScopeDepth) {
            {
              if (prevActScopeDepth !== actScopeDepth - 1) {
                error("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. ");
              }
              actScopeDepth = prevActScopeDepth;
            }
          }
          function recursivelyFlushAsyncActWork(returnValue, resolve, reject) {
            {
              var queue = ReactCurrentActQueue.current;
              if (queue !== null) {
                try {
                  flushActQueue(queue);
                  enqueueTask(function() {
                    if (queue.length === 0) {
                      ReactCurrentActQueue.current = null;
                      resolve(returnValue);
                    } else {
                      recursivelyFlushAsyncActWork(returnValue, resolve, reject);
                    }
                  });
                } catch (error2) {
                  reject(error2);
                }
              } else {
                resolve(returnValue);
              }
            }
          }
          var isFlushing = false;
          function flushActQueue(queue) {
            {
              if (!isFlushing) {
                isFlushing = true;
                var i = 0;
                try {
                  for (; i < queue.length; i++) {
                    var callback = queue[i];
                    do {
                      callback = callback(true);
                    } while (callback !== null);
                  }
                  queue.length = 0;
                } catch (error2) {
                  queue = queue.slice(i + 1);
                  throw error2;
                } finally {
                  isFlushing = false;
                }
              }
            }
          }
          var createElement$1 = createElementWithValidation;
          var cloneElement$1 = cloneElementWithValidation;
          var createFactory = createFactoryWithValidation;
          var Children = {
            map: mapChildren,
            forEach: forEachChildren,
            count: countChildren,
            toArray,
            only: onlyChild
          };
          exports.Children = Children;
          exports.Component = Component;
          exports.Fragment = REACT_FRAGMENT_TYPE;
          exports.Profiler = REACT_PROFILER_TYPE;
          exports.PureComponent = PureComponent;
          exports.StrictMode = REACT_STRICT_MODE_TYPE;
          exports.Suspense = REACT_SUSPENSE_TYPE;
          exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ReactSharedInternals;
          exports.act = act;
          exports.cloneElement = cloneElement$1;
          exports.createContext = createContext;
          exports.createElement = createElement$1;
          exports.createFactory = createFactory;
          exports.createRef = createRef;
          exports.forwardRef = forwardRef;
          exports.isValidElement = isValidElement;
          exports.lazy = lazy;
          exports.memo = memo;
          exports.startTransition = startTransition;
          exports.unstable_act = act;
          exports.useCallback = useCallback;
          exports.useContext = useContext;
          exports.useDebugValue = useDebugValue;
          exports.useDeferredValue = useDeferredValue;
          exports.useEffect = useEffect;
          exports.useId = useId;
          exports.useImperativeHandle = useImperativeHandle;
          exports.useInsertionEffect = useInsertionEffect;
          exports.useLayoutEffect = useLayoutEffect;
          exports.useMemo = useMemo;
          exports.useReducer = useReducer;
          exports.useRef = useRef;
          exports.useState = useState;
          exports.useSyncExternalStore = useSyncExternalStore;
          exports.useTransition = useTransition;
          exports.version = ReactVersion;
          if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop === "function") {
            __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
          }
        })();
      }
    }
  });

  // node_modules/react/index.js
  var require_react = __commonJS({
    "node_modules/react/index.js"(exports, module) {
      "use strict";
      if (false) {
        module.exports = null;
      } else {
        module.exports = require_react_development();
      }
    }
  });

  // node_modules/sweetalert2/dist/sweetalert2.all.js
  var require_sweetalert2_all = __commonJS({
    "node_modules/sweetalert2/dist/sweetalert2.all.js"(exports, module) {
      (function(global, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Sweetalert2 = factory());
      })(exports, function() {
        "use strict";
        function _assertClassBrand(e, t, n) {
          if ("function" == typeof e ? e === t : e.has(t))
            return arguments.length < 3 ? t : n;
          throw new TypeError("Private element is not present on this object");
        }
        function _checkPrivateRedeclaration(e, t) {
          if (t.has(e))
            throw new TypeError("Cannot initialize the same private elements twice on an object");
        }
        function _classPrivateFieldGet2(s, a) {
          return s.get(_assertClassBrand(s, a));
        }
        function _classPrivateFieldInitSpec(e, t, a) {
          _checkPrivateRedeclaration(e, t), t.set(e, a);
        }
        function _classPrivateFieldSet2(s, a, r) {
          return s.set(_assertClassBrand(s, a), r), r;
        }
        const RESTORE_FOCUS_TIMEOUT = 100;
        const globalState = {};
        const focusPreviousActiveElement = () => {
          if (globalState.previousActiveElement instanceof HTMLElement) {
            globalState.previousActiveElement.focus();
            globalState.previousActiveElement = null;
          } else if (document.body) {
            document.body.focus();
          }
        };
        const restoreActiveElement = (returnFocus) => {
          return new Promise((resolve) => {
            if (!returnFocus) {
              return resolve();
            }
            const x = window.scrollX;
            const y = window.scrollY;
            globalState.restoreFocusTimeout = setTimeout(() => {
              focusPreviousActiveElement();
              resolve();
            }, RESTORE_FOCUS_TIMEOUT);
            window.scrollTo(x, y);
          });
        };
        const swalPrefix = "swal2-";
        const classNames = ["container", "shown", "height-auto", "iosfix", "popup", "modal", "no-backdrop", "no-transition", "toast", "toast-shown", "show", "hide", "close", "title", "html-container", "actions", "confirm", "deny", "cancel", "footer", "icon", "icon-content", "image", "input", "file", "range", "select", "radio", "checkbox", "label", "textarea", "inputerror", "input-label", "validation-message", "progress-steps", "active-progress-step", "progress-step", "progress-step-line", "loader", "loading", "styled", "top", "top-start", "top-end", "top-left", "top-right", "center", "center-start", "center-end", "center-left", "center-right", "bottom", "bottom-start", "bottom-end", "bottom-left", "bottom-right", "grow-row", "grow-column", "grow-fullscreen", "rtl", "timer-progress-bar", "timer-progress-bar-container", "scrollbar-measure", "icon-success", "icon-warning", "icon-info", "icon-question", "icon-error", "draggable", "dragging"];
        const swalClasses = classNames.reduce(
          (acc, className) => {
            acc[className] = swalPrefix + className;
            return acc;
          },
          /** @type {SwalClasses} */
          {}
        );
        const icons = ["success", "warning", "info", "question", "error"];
        const iconTypes = icons.reduce(
          (acc, icon) => {
            acc[icon] = swalPrefix + icon;
            return acc;
          },
          /** @type {SwalIcons} */
          {}
        );
        const consolePrefix = "SweetAlert2:";
        const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);
        const warn = (message) => {
          console.warn(`${consolePrefix} ${typeof message === "object" ? message.join(" ") : message}`);
        };
        const error = (message) => {
          console.error(`${consolePrefix} ${message}`);
        };
        const previousWarnOnceMessages = [];
        const warnOnce = (message) => {
          if (!previousWarnOnceMessages.includes(message)) {
            previousWarnOnceMessages.push(message);
            warn(message);
          }
        };
        const warnAboutDeprecation = (deprecatedParam, useInstead = null) => {
          warnOnce(`"${deprecatedParam}" is deprecated and will be removed in the next major release.${useInstead ? ` Use "${useInstead}" instead.` : ""}`);
        };
        const callIfFunction = (arg) => typeof arg === "function" ? arg() : arg;
        const hasToPromiseFn = (arg) => arg && typeof arg.toPromise === "function";
        const asPromise = (arg) => hasToPromiseFn(arg) ? arg.toPromise() : Promise.resolve(arg);
        const isPromise = (arg) => arg && Promise.resolve(arg) === arg;
        const isFirefox = () => navigator.userAgent.includes("Firefox");
        const getContainer = () => document.body.querySelector(`.${swalClasses.container}`);
        const elementBySelector = (selectorString) => {
          const container = getContainer();
          return container ? container.querySelector(selectorString) : null;
        };
        const elementByClass = (className) => {
          return elementBySelector(`.${className}`);
        };
        const getPopup = () => elementByClass(swalClasses.popup);
        const getIcon = () => elementByClass(swalClasses.icon);
        const getIconContent = () => elementByClass(swalClasses["icon-content"]);
        const getTitle = () => elementByClass(swalClasses.title);
        const getHtmlContainer = () => elementByClass(swalClasses["html-container"]);
        const getImage = () => elementByClass(swalClasses.image);
        const getProgressSteps = () => elementByClass(swalClasses["progress-steps"]);
        const getValidationMessage = () => elementByClass(swalClasses["validation-message"]);
        const getConfirmButton = () => (
          /** @type {HTMLButtonElement} */
          elementBySelector(`.${swalClasses.actions} .${swalClasses.confirm}`)
        );
        const getCancelButton = () => (
          /** @type {HTMLButtonElement} */
          elementBySelector(`.${swalClasses.actions} .${swalClasses.cancel}`)
        );
        const getDenyButton = () => (
          /** @type {HTMLButtonElement} */
          elementBySelector(`.${swalClasses.actions} .${swalClasses.deny}`)
        );
        const getInputLabel = () => elementByClass(swalClasses["input-label"]);
        const getLoader = () => elementBySelector(`.${swalClasses.loader}`);
        const getActions = () => elementByClass(swalClasses.actions);
        const getFooter = () => elementByClass(swalClasses.footer);
        const getTimerProgressBar = () => elementByClass(swalClasses["timer-progress-bar"]);
        const getCloseButton = () => elementByClass(swalClasses.close);
        const focusable = `
  a[href],
  area[href],
  input:not([disabled]),
  select:not([disabled]),
  textarea:not([disabled]),
  button:not([disabled]),
  iframe,
  object,
  embed,
  [tabindex="0"],
  [contenteditable],
  audio[controls],
  video[controls],
  summary
`;
        const getFocusableElements = () => {
          const popup = getPopup();
          if (!popup) {
            return [];
          }
          const focusableElementsWithTabindex = popup.querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])');
          const focusableElementsWithTabindexSorted = Array.from(focusableElementsWithTabindex).sort((a, b) => {
            const tabindexA = parseInt(a.getAttribute("tabindex") || "0");
            const tabindexB = parseInt(b.getAttribute("tabindex") || "0");
            if (tabindexA > tabindexB) {
              return 1;
            } else if (tabindexA < tabindexB) {
              return -1;
            }
            return 0;
          });
          const otherFocusableElements = popup.querySelectorAll(focusable);
          const otherFocusableElementsFiltered = Array.from(otherFocusableElements).filter((el) => el.getAttribute("tabindex") !== "-1");
          return [...new Set(focusableElementsWithTabindexSorted.concat(otherFocusableElementsFiltered))].filter((el) => isVisible$1(el));
        };
        const isModal = () => {
          return hasClass(document.body, swalClasses.shown) && !hasClass(document.body, swalClasses["toast-shown"]) && !hasClass(document.body, swalClasses["no-backdrop"]);
        };
        const isToast = () => {
          const popup = getPopup();
          if (!popup) {
            return false;
          }
          return hasClass(popup, swalClasses.toast);
        };
        const isLoading = () => {
          const popup = getPopup();
          if (!popup) {
            return false;
          }
          return popup.hasAttribute("data-loading");
        };
        const setInnerHtml = (elem, html) => {
          elem.textContent = "";
          if (html) {
            const parser = new DOMParser();
            const parsed = parser.parseFromString(html, `text/html`);
            const head = parsed.querySelector("head");
            if (head) {
              Array.from(head.childNodes).forEach((child) => {
                elem.appendChild(child);
              });
            }
            const body = parsed.querySelector("body");
            if (body) {
              Array.from(body.childNodes).forEach((child) => {
                if (child instanceof HTMLVideoElement || child instanceof HTMLAudioElement) {
                  elem.appendChild(child.cloneNode(true));
                } else {
                  elem.appendChild(child);
                }
              });
            }
          }
        };
        const hasClass = (elem, className) => {
          if (!className) {
            return false;
          }
          return className.split(/\s+/).every((cls) => elem.classList.contains(cls));
        };
        const removeCustomClasses = (elem, params) => {
          Array.from(elem.classList).forEach((className) => {
            if (!Object.values(swalClasses).includes(className) && !Object.values(iconTypes).includes(className) && !Object.values(params.showClass || {}).includes(className)) {
              elem.classList.remove(className);
            }
          });
        };
        const applyCustomClass = (elem, params, className) => {
          removeCustomClasses(elem, params);
          if (!params.customClass) {
            return;
          }
          const customClass = params.customClass[
            /** @type {keyof SweetAlertCustomClass} */
            className
          ];
          if (!customClass) {
            return;
          }
          if (typeof customClass !== "string" && !customClass.forEach) {
            warn(`Invalid type of customClass.${className}! Expected string or iterable object, got "${typeof customClass}"`);
            return;
          }
          addClass(elem, customClass);
        };
        const getInput$1 = (popup, inputClass) => {
          if (!inputClass) {
            return null;
          }
          switch (inputClass) {
            case "select":
            case "textarea":
            case "file":
              return popup.querySelector(`.${swalClasses.popup} > .${swalClasses[inputClass]}`);
            case "checkbox":
              return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.checkbox} input`);
            case "radio":
              return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.radio} input:checked`) || popup.querySelector(`.${swalClasses.popup} > .${swalClasses.radio} input:first-child`);
            case "range":
              return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.range} input`);
            default:
              return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.input}`);
          }
        };
        const focusInput = (input) => {
          input.focus();
          if (input.type !== "file") {
            const val = input.value;
            input.value = "";
            input.value = val;
          }
        };
        const toggleClass = (target, classList, condition) => {
          if (!target || !classList) {
            return;
          }
          const classes = typeof classList === "string" ? classList.split(/\s+/).filter(Boolean) : classList;
          const targets = Array.isArray(target) ? target : [target];
          targets.forEach((elem) => {
            classes.forEach((className) => {
              if (condition) {
                elem.classList.add(className);
              } else {
                elem.classList.remove(className);
              }
            });
          });
        };
        const addClass = (target, classList) => {
          toggleClass(target, classList, true);
        };
        const removeClass = (target, classList) => {
          toggleClass(target, classList, false);
        };
        const getDirectChildByClass = (elem, className) => (
          /** @type {HTMLElement | undefined} */
          Array.from(elem.children).find((child) => child instanceof HTMLElement && hasClass(child, className))
        );
        const applyNumericalStyle = (elem, property, value) => {
          if (value === `${parseInt(`${value}`)}`) {
            value = parseInt(value);
          }
          if (value || value === 0) {
            elem.style.setProperty(property, typeof value === "number" ? `${value}px` : (
              /** @type {string} */
              value
            ));
          } else {
            elem.style.removeProperty(property);
          }
        };
        const show = (elem, display = "flex") => {
          if (!elem) {
            return;
          }
          elem.style.display = display;
        };
        const hide = (elem) => {
          if (!elem) {
            return;
          }
          elem.style.display = "none";
        };
        const showWhenInnerHtmlPresent = (elem, display = "block") => {
          if (!elem) {
            return;
          }
          new MutationObserver(() => {
            toggle(elem, elem.innerHTML, display);
          }).observe(elem, {
            childList: true,
            subtree: true
          });
        };
        const setStyle = (parent, selector, property, value) => {
          const el = parent.querySelector(selector);
          if (el) {
            el.style.setProperty(property, value);
          }
        };
        const toggle = (elem, condition, display = "flex") => {
          if (condition) {
            show(elem, display);
          } else {
            hide(elem);
          }
        };
        const isVisible$1 = (elem) => Boolean(elem && (elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length));
        const allButtonsAreHidden = () => !isVisible$1(getConfirmButton()) && !isVisible$1(getDenyButton()) && !isVisible$1(getCancelButton());
        const isScrollable = (elem) => Boolean(elem.scrollHeight > elem.clientHeight);
        const selfOrParentIsScrollable = (element, stopElement) => {
          let parent = (
            /** @type {HTMLElement | null} */
            element
          );
          while (parent && parent !== stopElement) {
            if (isScrollable(parent)) {
              return true;
            }
            parent = parent.parentElement;
          }
          return false;
        };
        const hasCssAnimation = (elem) => {
          const style = window.getComputedStyle(elem);
          const animDuration = parseFloat(style.getPropertyValue("animation-duration") || "0");
          const transDuration = parseFloat(style.getPropertyValue("transition-duration") || "0");
          return animDuration > 0 || transDuration > 0;
        };
        const animateTimerProgressBar = (timer, reset = false) => {
          const timerProgressBar = getTimerProgressBar();
          if (!timerProgressBar) {
            return;
          }
          if (isVisible$1(timerProgressBar)) {
            if (reset) {
              timerProgressBar.style.transition = "none";
              timerProgressBar.style.width = "100%";
            }
            setTimeout(() => {
              timerProgressBar.style.transition = `width ${timer / 1e3}s linear`;
              timerProgressBar.style.width = "0%";
            }, 10);
          }
        };
        const stopTimerProgressBar = () => {
          const timerProgressBar = getTimerProgressBar();
          if (!timerProgressBar) {
            return;
          }
          const timerProgressBarWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
          timerProgressBar.style.removeProperty("transition");
          timerProgressBar.style.width = "100%";
          const timerProgressBarFullWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
          const timerProgressBarPercent = timerProgressBarWidth / timerProgressBarFullWidth * 100;
          timerProgressBar.style.width = `${timerProgressBarPercent}%`;
        };
        const isNodeEnv = () => typeof window === "undefined" || typeof document === "undefined";
        const sweetHTML = `
 <div aria-labelledby="${swalClasses.title}" aria-describedby="${swalClasses["html-container"]}" class="${swalClasses.popup}" tabindex="-1">
   <button type="button" class="${swalClasses.close}"></button>
   <ul class="${swalClasses["progress-steps"]}"></ul>
   <div class="${swalClasses.icon}"></div>
   <img class="${swalClasses.image}" />
   <h2 class="${swalClasses.title}" id="${swalClasses.title}"></h2>
   <div class="${swalClasses["html-container"]}" id="${swalClasses["html-container"]}"></div>
   <input class="${swalClasses.input}" id="${swalClasses.input}" />
   <input type="file" class="${swalClasses.file}" />
   <div class="${swalClasses.range}">
     <input type="range" />
     <output></output>
   </div>
   <select class="${swalClasses.select}" id="${swalClasses.select}"></select>
   <div class="${swalClasses.radio}"></div>
   <label class="${swalClasses.checkbox}">
     <input type="checkbox" id="${swalClasses.checkbox}" />
     <span class="${swalClasses.label}"></span>
   </label>
   <textarea class="${swalClasses.textarea}" id="${swalClasses.textarea}"></textarea>
   <div class="${swalClasses["validation-message"]}" id="${swalClasses["validation-message"]}"></div>
   <div class="${swalClasses.actions}">
     <div class="${swalClasses.loader}"></div>
     <button type="button" class="${swalClasses.confirm}"></button>
     <button type="button" class="${swalClasses.deny}"></button>
     <button type="button" class="${swalClasses.cancel}"></button>
   </div>
   <div class="${swalClasses.footer}"></div>
   <div class="${swalClasses["timer-progress-bar-container"]}">
     <div class="${swalClasses["timer-progress-bar"]}"></div>
   </div>
 </div>
`.replace(/(^|\n)\s*/g, "");
        const resetOldContainer = () => {
          const oldContainer = getContainer();
          if (!oldContainer) {
            return false;
          }
          oldContainer.remove();
          removeClass([document.documentElement, document.body], [
            swalClasses["no-backdrop"],
            swalClasses["toast-shown"],
            // @ts-ignore: 'has-column' is not defined in swalClasses but may be set dynamically
            swalClasses["has-column"]
          ]);
          return true;
        };
        const resetValidationMessage$1 = () => {
          if (globalState.currentInstance) {
            globalState.currentInstance.resetValidationMessage();
          }
        };
        const addInputChangeListeners = () => {
          const popup = getPopup();
          if (!popup) {
            return;
          }
          const input = getDirectChildByClass(popup, swalClasses.input);
          const file = getDirectChildByClass(popup, swalClasses.file);
          const range = popup.querySelector(`.${swalClasses.range} input`);
          const rangeOutput = popup.querySelector(`.${swalClasses.range} output`);
          const select = getDirectChildByClass(popup, swalClasses.select);
          const checkbox = popup.querySelector(`.${swalClasses.checkbox} input`);
          const textarea = getDirectChildByClass(popup, swalClasses.textarea);
          if (input) {
            input.oninput = resetValidationMessage$1;
          }
          if (file) {
            file.onchange = resetValidationMessage$1;
          }
          if (select) {
            select.onchange = resetValidationMessage$1;
          }
          if (checkbox) {
            checkbox.onchange = resetValidationMessage$1;
          }
          if (textarea) {
            textarea.oninput = resetValidationMessage$1;
          }
          if (range && rangeOutput) {
            range.oninput = () => {
              resetValidationMessage$1();
              rangeOutput.value = range.value;
            };
            range.onchange = () => {
              resetValidationMessage$1();
              rangeOutput.value = range.value;
            };
          }
        };
        const getTarget = (target) => {
          if (typeof target === "string") {
            const element = document.querySelector(target);
            if (!element) {
              throw new Error(`Target element "${target}" not found`);
            }
            return (
              /** @type {HTMLElement} */
              element
            );
          }
          return target;
        };
        const setupAccessibility = (params) => {
          const popup = getPopup();
          if (!popup) {
            return;
          }
          popup.setAttribute("role", params.toast ? "alert" : "dialog");
          popup.setAttribute("aria-live", params.toast ? "polite" : "assertive");
          if (!params.toast) {
            popup.setAttribute("aria-modal", "true");
          }
        };
        const setupRTL = (targetElement) => {
          if (window.getComputedStyle(targetElement).direction === "rtl") {
            addClass(getContainer(), swalClasses.rtl);
            globalState.isRTL = true;
          }
        };
        const init = (params) => {
          const oldContainerExisted = resetOldContainer();
          if (isNodeEnv()) {
            error("SweetAlert2 requires document to initialize");
            return;
          }
          const container = document.createElement("div");
          container.className = swalClasses.container;
          if (oldContainerExisted) {
            addClass(container, swalClasses["no-transition"]);
          }
          setInnerHtml(container, sweetHTML);
          container.dataset["swal2Theme"] = params.theme;
          const targetElement = getTarget(params.target || "body");
          targetElement.appendChild(container);
          if (params.topLayer) {
            container.setAttribute("popover", "");
            container.showPopover();
          }
          setupAccessibility(params);
          setupRTL(targetElement);
          addInputChangeListeners();
        };
        const parseHtmlToContainer = (param, target) => {
          if (param instanceof HTMLElement) {
            target.appendChild(param);
          } else if (typeof param === "object") {
            handleObject(param, target);
          } else if (param) {
            setInnerHtml(target, param);
          }
        };
        const handleObject = (param, target) => {
          if ("jquery" in param) {
            handleJqueryElem(target, param);
          } else {
            setInnerHtml(target, param.toString());
          }
        };
        const handleJqueryElem = (target, elem) => {
          target.textContent = "";
          if (0 in elem) {
            for (let i = 0; i in elem; i++) {
              target.appendChild(elem[i].cloneNode(true));
            }
          } else {
            target.appendChild(elem.cloneNode(true));
          }
        };
        const renderActions = (instance, params) => {
          const actions = getActions();
          const loader = getLoader();
          if (!actions || !loader) {
            return;
          }
          if (!params.showConfirmButton && !params.showDenyButton && !params.showCancelButton) {
            hide(actions);
          } else {
            show(actions);
          }
          applyCustomClass(actions, params, "actions");
          renderButtons(actions, loader, params);
          setInnerHtml(loader, params.loaderHtml || "");
          applyCustomClass(loader, params, "loader");
        };
        function renderButtons(actions, loader, params) {
          const confirmButton = getConfirmButton();
          const denyButton = getDenyButton();
          const cancelButton = getCancelButton();
          if (!confirmButton || !denyButton || !cancelButton) {
            return;
          }
          renderButton(confirmButton, "confirm", params);
          renderButton(denyButton, "deny", params);
          renderButton(cancelButton, "cancel", params);
          handleButtonsStyling(confirmButton, denyButton, cancelButton, params);
          if (params.reverseButtons) {
            if (params.toast) {
              actions.insertBefore(cancelButton, confirmButton);
              actions.insertBefore(denyButton, confirmButton);
            } else {
              actions.insertBefore(cancelButton, loader);
              actions.insertBefore(denyButton, loader);
              actions.insertBefore(confirmButton, loader);
            }
          }
        }
        function handleButtonsStyling(confirmButton, denyButton, cancelButton, params) {
          if (!params.buttonsStyling) {
            removeClass([confirmButton, denyButton, cancelButton], swalClasses.styled);
            return;
          }
          addClass([confirmButton, denyButton, cancelButton], swalClasses.styled);
          const buttons = [[confirmButton, "confirm", params.confirmButtonColor], [denyButton, "deny", params.denyButtonColor], [cancelButton, "cancel", params.cancelButtonColor]];
          buttons.forEach(([button, type, color]) => {
            if (color) {
              button.style.setProperty(`--swal2-${type}-button-background-color`, color);
            }
            applyOutlineColor(button);
          });
        }
        function applyOutlineColor(button) {
          const buttonStyle = window.getComputedStyle(button);
          if (buttonStyle.getPropertyValue("--swal2-action-button-focus-box-shadow")) {
            return;
          }
          const outlineColor = buttonStyle.backgroundColor.replace(/rgba?\((\d+), (\d+), (\d+).*/, "rgba($1, $2, $3, 0.5)");
          button.style.setProperty("--swal2-action-button-focus-box-shadow", buttonStyle.getPropertyValue("--swal2-outline").replace(/ rgba\(.*/, ` ${outlineColor}`));
        }
        function renderButton(button, buttonType, params) {
          const buttonName = (
            /** @type {'Confirm' | 'Deny' | 'Cancel'} */
            capitalizeFirstLetter(buttonType)
          );
          toggle(button, params[`show${buttonName}Button`], "inline-block");
          setInnerHtml(button, params[`${buttonType}ButtonText`] || "");
          button.setAttribute("aria-label", params[`${buttonType}ButtonAriaLabel`] || "");
          button.className = swalClasses[buttonType];
          applyCustomClass(button, params, `${buttonType}Button`);
        }
        const renderCloseButton = (instance, params) => {
          const closeButton = getCloseButton();
          if (!closeButton) {
            return;
          }
          setInnerHtml(closeButton, params.closeButtonHtml || "");
          applyCustomClass(closeButton, params, "closeButton");
          toggle(closeButton, params.showCloseButton);
          closeButton.setAttribute("aria-label", params.closeButtonAriaLabel || "");
        };
        const renderContainer = (instance, params) => {
          const container = getContainer();
          if (!container) {
            return;
          }
          handleBackdropParam(container, params.backdrop);
          handlePositionParam(container, params.position);
          handleGrowParam(container, params.grow);
          applyCustomClass(container, params, "container");
        };
        function handleBackdropParam(container, backdrop) {
          if (typeof backdrop === "string") {
            container.style.background = backdrop;
          } else if (!backdrop) {
            addClass([document.documentElement, document.body], swalClasses["no-backdrop"]);
          }
        }
        function handlePositionParam(container, position) {
          if (!position) {
            return;
          }
          if (position in swalClasses) {
            addClass(container, swalClasses[position]);
          } else {
            warn('The "position" parameter is not valid, defaulting to "center"');
            addClass(container, swalClasses.center);
          }
        }
        function handleGrowParam(container, grow) {
          if (!grow) {
            return;
          }
          addClass(container, swalClasses[`grow-${grow}`]);
        }
        var privateProps = {
          innerParams: /* @__PURE__ */ new WeakMap(),
          domCache: /* @__PURE__ */ new WeakMap(),
          focusedElement: /* @__PURE__ */ new WeakMap()
        };
        const inputClasses = ["input", "file", "range", "select", "radio", "checkbox", "textarea"];
        const renderInput = (instance, params) => {
          const popup = getPopup();
          if (!popup) {
            return;
          }
          const innerParams = privateProps.innerParams.get(instance);
          const rerender = !innerParams || params.input !== innerParams.input;
          inputClasses.forEach((inputClass) => {
            const inputContainer = getDirectChildByClass(popup, swalClasses[inputClass]);
            if (!inputContainer) {
              return;
            }
            setAttributes(inputClass, params.inputAttributes);
            inputContainer.className = swalClasses[inputClass];
            if (rerender) {
              hide(inputContainer);
            }
          });
          if (params.input) {
            if (rerender) {
              showInput(params);
            }
            setCustomClass(params);
          }
        };
        const showInput = (params) => {
          if (!params.input) {
            return;
          }
          if (!renderInputType[params.input]) {
            error(`Unexpected type of input! Expected ${Object.keys(renderInputType).join(" | ")}, got "${params.input}"`);
            return;
          }
          const inputContainer = getInputContainer(params.input);
          if (!inputContainer) {
            return;
          }
          const input = renderInputType[params.input](inputContainer, params);
          show(inputContainer);
          if (params.inputAutoFocus) {
            setTimeout(() => {
              focusInput(input);
            });
          }
        };
        const removeAttributes = (input) => {
          for (const {
            name
          } of Array.from(input.attributes)) {
            if (!["id", "type", "value", "style"].includes(name)) {
              input.removeAttribute(name);
            }
          }
        };
        const setAttributes = (inputClass, inputAttributes) => {
          const popup = getPopup();
          if (!popup) {
            return;
          }
          const input = getInput$1(popup, inputClass);
          if (!input) {
            return;
          }
          removeAttributes(input);
          for (const attr in inputAttributes) {
            input.setAttribute(attr, inputAttributes[attr]);
          }
        };
        const setCustomClass = (params) => {
          if (!params.input) {
            return;
          }
          const inputContainer = getInputContainer(params.input);
          if (inputContainer) {
            applyCustomClass(inputContainer, params, "input");
          }
        };
        const setInputPlaceholder = (input, params) => {
          if (!input.placeholder && params.inputPlaceholder) {
            input.placeholder = params.inputPlaceholder;
          }
        };
        const setInputLabel = (input, prependTo, params) => {
          if (params.inputLabel) {
            const label = document.createElement("label");
            const labelClass = swalClasses["input-label"];
            label.setAttribute("for", input.id);
            label.className = labelClass;
            if (typeof params.customClass === "object") {
              addClass(label, params.customClass.inputLabel);
            }
            label.innerText = params.inputLabel;
            prependTo.insertAdjacentElement("beforebegin", label);
          }
        };
        const getInputContainer = (inputType) => {
          const popup = getPopup();
          if (!popup) {
            return;
          }
          return getDirectChildByClass(popup, swalClasses[
            /** @type {SwalClass} */
            inputType
          ] || swalClasses.input);
        };
        const checkAndSetInputValue = (input, inputValue) => {
          if (["string", "number"].includes(typeof inputValue)) {
            input.value = `${inputValue}`;
          } else if (!isPromise(inputValue)) {
            warn(`Unexpected type of inputValue! Expected "string", "number" or "Promise", got "${typeof inputValue}"`);
          }
        };
        const renderInputType = {};
        renderInputType.text = renderInputType.email = renderInputType.password = renderInputType.number = renderInputType.tel = renderInputType.url = renderInputType.search = renderInputType.date = renderInputType["datetime-local"] = renderInputType.time = renderInputType.week = renderInputType.month = /** @type {(input: Input | HTMLElement, params: SweetAlertOptions) => Input} */
        (input, params) => {
          const inputElement = (
            /** @type {HTMLInputElement} */
            input
          );
          checkAndSetInputValue(inputElement, params.inputValue);
          setInputLabel(inputElement, inputElement, params);
          setInputPlaceholder(inputElement, params);
          inputElement.type = /** @type {string} */
          params.input;
          return inputElement;
        };
        renderInputType.file = (input, params) => {
          const inputElement = (
            /** @type {HTMLInputElement} */
            input
          );
          setInputLabel(inputElement, inputElement, params);
          setInputPlaceholder(inputElement, params);
          return inputElement;
        };
        renderInputType.range = (range, params) => {
          const rangeContainer = (
            /** @type {HTMLElement} */
            range
          );
          const rangeInput = rangeContainer.querySelector("input");
          const rangeOutput = rangeContainer.querySelector("output");
          if (rangeInput) {
            checkAndSetInputValue(rangeInput, params.inputValue);
            rangeInput.type = /** @type {string} */
            params.input;
            setInputLabel(
              rangeInput,
              /** @type {Input} */
              range,
              params
            );
          }
          if (rangeOutput) {
            checkAndSetInputValue(rangeOutput, params.inputValue);
          }
          return (
            /** @type {Input} */
            range
          );
        };
        renderInputType.select = (select, params) => {
          const selectElement = (
            /** @type {HTMLSelectElement} */
            select
          );
          selectElement.textContent = "";
          if (params.inputPlaceholder) {
            const placeholder = document.createElement("option");
            setInnerHtml(placeholder, params.inputPlaceholder);
            placeholder.value = "";
            placeholder.disabled = true;
            placeholder.selected = true;
            selectElement.appendChild(placeholder);
          }
          setInputLabel(selectElement, selectElement, params);
          return selectElement;
        };
        renderInputType.radio = (radio) => {
          const radioElement = (
            /** @type {HTMLElement} */
            radio
          );
          radioElement.textContent = "";
          return (
            /** @type {Input} */
            radio
          );
        };
        renderInputType.checkbox = (checkboxContainer, params) => {
          const popup = getPopup();
          if (!popup) {
            throw new Error("Popup not found");
          }
          const checkbox = getInput$1(popup, "checkbox");
          if (!checkbox) {
            throw new Error("Checkbox input not found");
          }
          checkbox.value = "1";
          checkbox.checked = Boolean(params.inputValue);
          const containerElement = (
            /** @type {HTMLElement} */
            checkboxContainer
          );
          const label = containerElement.querySelector("span");
          if (label) {
            const placeholderOrLabel = params.inputPlaceholder || params.inputLabel;
            if (placeholderOrLabel) {
              setInnerHtml(label, placeholderOrLabel);
            }
          }
          return checkbox;
        };
        renderInputType.textarea = (textarea, params) => {
          const textareaElement = (
            /** @type {HTMLTextAreaElement} */
            textarea
          );
          checkAndSetInputValue(textareaElement, params.inputValue);
          setInputPlaceholder(textareaElement, params);
          setInputLabel(textareaElement, textareaElement, params);
          const getMargin = (el) => parseInt(window.getComputedStyle(el).marginLeft) + parseInt(window.getComputedStyle(el).marginRight);
          setTimeout(() => {
            if ("MutationObserver" in window) {
              const popup = getPopup();
              if (!popup) {
                return;
              }
              const initialPopupWidth = parseInt(window.getComputedStyle(popup).width);
              const textareaResizeHandler = () => {
                if (!document.body.contains(textareaElement)) {
                  return;
                }
                const textareaWidth = textareaElement.offsetWidth + getMargin(textareaElement);
                const popupElement = getPopup();
                if (popupElement) {
                  if (textareaWidth > initialPopupWidth) {
                    popupElement.style.width = `${textareaWidth}px`;
                  } else {
                    applyNumericalStyle(popupElement, "width", params.width);
                  }
                }
              };
              new MutationObserver(textareaResizeHandler).observe(textareaElement, {
                attributes: true,
                attributeFilter: ["style"]
              });
            }
          });
          return textareaElement;
        };
        const renderContent = (instance, params) => {
          const htmlContainer = getHtmlContainer();
          if (!htmlContainer) {
            return;
          }
          showWhenInnerHtmlPresent(htmlContainer);
          applyCustomClass(htmlContainer, params, "htmlContainer");
          if (params.html) {
            parseHtmlToContainer(params.html, htmlContainer);
            show(htmlContainer, "block");
          } else if (params.text) {
            htmlContainer.textContent = params.text;
            show(htmlContainer, "block");
          } else {
            hide(htmlContainer);
          }
          renderInput(instance, params);
        };
        const renderFooter = (instance, params) => {
          const footer = getFooter();
          if (!footer) {
            return;
          }
          showWhenInnerHtmlPresent(footer);
          toggle(footer, Boolean(params.footer), "block");
          if (params.footer) {
            parseHtmlToContainer(params.footer, footer);
          }
          applyCustomClass(footer, params, "footer");
        };
        const renderIcon = (instance, params) => {
          const innerParams = privateProps.innerParams.get(instance);
          const icon = getIcon();
          if (!icon) {
            return;
          }
          if (innerParams && params.icon === innerParams.icon) {
            setContent(icon, params);
            applyStyles(icon, params);
            return;
          }
          if (!params.icon && !params.iconHtml) {
            hide(icon);
            return;
          }
          if (params.icon && Object.keys(iconTypes).indexOf(params.icon) === -1) {
            error(`Unknown icon! Expected "success", "error", "warning", "info" or "question", got "${params.icon}"`);
            hide(icon);
            return;
          }
          show(icon);
          setContent(icon, params);
          applyStyles(icon, params);
          addClass(icon, params.showClass && params.showClass.icon);
          const colorSchemeQueryList = window.matchMedia("(prefers-color-scheme: dark)");
          colorSchemeQueryList.addEventListener("change", adjustSuccessIconBackgroundColor);
        };
        const applyStyles = (icon, params) => {
          for (const [iconType, iconClassName] of Object.entries(iconTypes)) {
            if (params.icon !== iconType) {
              removeClass(icon, iconClassName);
            }
          }
          addClass(icon, params.icon && iconTypes[params.icon]);
          setColor(icon, params);
          adjustSuccessIconBackgroundColor();
          applyCustomClass(icon, params, "icon");
        };
        const adjustSuccessIconBackgroundColor = () => {
          const popup = getPopup();
          if (!popup) {
            return;
          }
          const popupBackgroundColor = window.getComputedStyle(popup).getPropertyValue("background-color");
          const successIconParts = popup.querySelectorAll("[class^=swal2-success-circular-line], .swal2-success-fix");
          successIconParts.forEach((part) => {
            part.style.backgroundColor = popupBackgroundColor;
          });
        };
        const successIconHtml = (params) => `
  ${params.animation ? '<div class="swal2-success-circular-line-left"></div>' : ""}
  <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>
  <div class="swal2-success-ring"></div>
  ${params.animation ? '<div class="swal2-success-fix"></div>' : ""}
  ${params.animation ? '<div class="swal2-success-circular-line-right"></div>' : ""}
`;
        const errorIconHtml = `
  <span class="swal2-x-mark">
    <span class="swal2-x-mark-line-left"></span>
    <span class="swal2-x-mark-line-right"></span>
  </span>
`;
        const setContent = (icon, params) => {
          if (!params.icon && !params.iconHtml) {
            return;
          }
          let oldContent = icon.innerHTML;
          let newContent = "";
          if (params.iconHtml) {
            newContent = iconContent(params.iconHtml);
          } else if (params.icon === "success") {
            newContent = successIconHtml(params);
            oldContent = oldContent.replace(/ style=".*?"/g, "");
          } else if (params.icon === "error") {
            newContent = errorIconHtml;
          } else if (params.icon) {
            const defaultIconHtml = {
              question: "?",
              warning: "!",
              info: "i"
            };
            newContent = iconContent(defaultIconHtml[params.icon]);
          }
          if (oldContent.trim() !== newContent.trim()) {
            setInnerHtml(icon, newContent);
          }
        };
        const setColor = (icon, params) => {
          if (!params.iconColor) {
            return;
          }
          icon.style.color = params.iconColor;
          icon.style.borderColor = params.iconColor;
          for (const sel of [".swal2-success-line-tip", ".swal2-success-line-long", ".swal2-x-mark-line-left", ".swal2-x-mark-line-right"]) {
            setStyle(icon, sel, "background-color", params.iconColor);
          }
          setStyle(icon, ".swal2-success-ring", "border-color", params.iconColor);
        };
        const iconContent = (content) => `<div class="${swalClasses["icon-content"]}">${content}</div>`;
        const renderImage = (instance, params) => {
          const image = getImage();
          if (!image) {
            return;
          }
          if (!params.imageUrl) {
            hide(image);
            return;
          }
          show(image, "");
          image.setAttribute("src", params.imageUrl);
          image.setAttribute("alt", params.imageAlt || "");
          applyNumericalStyle(image, "width", params.imageWidth);
          applyNumericalStyle(image, "height", params.imageHeight);
          image.className = swalClasses.image;
          applyCustomClass(image, params, "image");
        };
        let dragging = false;
        let mousedownX = 0;
        let mousedownY = 0;
        let initialX = 0;
        let initialY = 0;
        const addDraggableListeners = (popup) => {
          popup.addEventListener("mousedown", down);
          document.body.addEventListener("mousemove", move);
          popup.addEventListener("mouseup", up);
          popup.addEventListener("touchstart", down);
          document.body.addEventListener("touchmove", move);
          popup.addEventListener("touchend", up);
        };
        const removeDraggableListeners = (popup) => {
          popup.removeEventListener("mousedown", down);
          document.body.removeEventListener("mousemove", move);
          popup.removeEventListener("mouseup", up);
          popup.removeEventListener("touchstart", down);
          document.body.removeEventListener("touchmove", move);
          popup.removeEventListener("touchend", up);
        };
        const down = (event) => {
          const popup = getPopup();
          if (!popup) {
            return;
          }
          const icon = getIcon();
          if (event.target === popup || icon && icon.contains(
            /** @type {HTMLElement} */
            event.target
          )) {
            dragging = true;
            const clientXY = getClientXY(event);
            mousedownX = clientXY.clientX;
            mousedownY = clientXY.clientY;
            initialX = parseInt(popup.style.insetInlineStart) || 0;
            initialY = parseInt(popup.style.insetBlockStart) || 0;
            addClass(popup, "swal2-dragging");
          }
        };
        const move = (event) => {
          const popup = getPopup();
          if (!popup) {
            return;
          }
          if (dragging) {
            let {
              clientX,
              clientY
            } = getClientXY(event);
            const deltaX = clientX - mousedownX;
            popup.style.insetInlineStart = `${initialX + (globalState.isRTL ? -deltaX : deltaX)}px`;
            popup.style.insetBlockStart = `${initialY + (clientY - mousedownY)}px`;
          }
        };
        const up = () => {
          const popup = getPopup();
          dragging = false;
          removeClass(popup, "swal2-dragging");
        };
        const getClientXY = (event) => {
          const source = event.type.startsWith("touch") ? (
            /** @type {TouchEvent} */
            event.touches[0]
          ) : (
            /** @type {MouseEvent} */
            event
          );
          return {
            clientX: source.clientX,
            clientY: source.clientY
          };
        };
        const renderPopup = (instance, params) => {
          const container = getContainer();
          const popup = getPopup();
          if (!container || !popup) {
            return;
          }
          if (params.toast) {
            applyNumericalStyle(container, "width", params.width);
            popup.style.width = "100%";
            const loader = getLoader();
            if (loader) {
              popup.insertBefore(loader, getIcon());
            }
          } else {
            applyNumericalStyle(popup, "width", params.width);
          }
          applyNumericalStyle(popup, "padding", params.padding);
          if (params.color) {
            popup.style.color = params.color;
          }
          if (params.background) {
            popup.style.background = params.background;
          }
          hide(getValidationMessage());
          addClasses$1(popup, params);
          if (params.draggable && !params.toast) {
            addClass(popup, swalClasses.draggable);
            addDraggableListeners(popup);
          } else {
            removeClass(popup, swalClasses.draggable);
            removeDraggableListeners(popup);
          }
        };
        const addClasses$1 = (popup, params) => {
          const showClass = params.showClass || {};
          popup.className = `${swalClasses.popup} ${isVisible$1(popup) ? showClass.popup : ""}`;
          if (params.toast) {
            addClass([document.documentElement, document.body], swalClasses["toast-shown"]);
            addClass(popup, swalClasses.toast);
          } else {
            addClass(popup, swalClasses.modal);
          }
          applyCustomClass(popup, params, "popup");
          if (typeof params.customClass === "string") {
            addClass(popup, params.customClass);
          }
          if (params.icon) {
            addClass(popup, swalClasses[`icon-${params.icon}`]);
          }
        };
        const renderProgressSteps = (instance, params) => {
          const progressStepsContainer = getProgressSteps();
          if (!progressStepsContainer) {
            return;
          }
          const {
            progressSteps,
            currentProgressStep
          } = params;
          if (!progressSteps || progressSteps.length === 0 || currentProgressStep === void 0) {
            hide(progressStepsContainer);
            return;
          }
          show(progressStepsContainer);
          progressStepsContainer.textContent = "";
          if (currentProgressStep >= progressSteps.length) {
            warn("Invalid currentProgressStep parameter, it should be less than progressSteps.length (currentProgressStep like JS arrays starts from 0)");
          }
          progressSteps.forEach((step, index) => {
            const stepEl = createStepElement(step);
            progressStepsContainer.appendChild(stepEl);
            if (index === currentProgressStep) {
              addClass(stepEl, swalClasses["active-progress-step"]);
            }
            if (index !== progressSteps.length - 1) {
              const lineEl = createLineElement(params);
              progressStepsContainer.appendChild(lineEl);
            }
          });
        };
        const createStepElement = (step) => {
          const stepEl = document.createElement("li");
          addClass(stepEl, swalClasses["progress-step"]);
          setInnerHtml(stepEl, step);
          return stepEl;
        };
        const createLineElement = (params) => {
          const lineEl = document.createElement("li");
          addClass(lineEl, swalClasses["progress-step-line"]);
          if (params.progressStepsDistance) {
            applyNumericalStyle(lineEl, "width", params.progressStepsDistance);
          }
          return lineEl;
        };
        const renderTitle = (instance, params) => {
          const title = getTitle();
          if (!title) {
            return;
          }
          showWhenInnerHtmlPresent(title);
          toggle(title, Boolean(params.title || params.titleText), "block");
          if (params.title) {
            parseHtmlToContainer(params.title, title);
          }
          if (params.titleText) {
            title.innerText = params.titleText;
          }
          applyCustomClass(title, params, "title");
        };
        const render = (instance, params) => {
          var _globalState$eventEmi;
          renderPopup(instance, params);
          renderContainer(instance, params);
          renderProgressSteps(instance, params);
          renderIcon(instance, params);
          renderImage(instance, params);
          renderTitle(instance, params);
          renderCloseButton(instance, params);
          renderContent(instance, params);
          renderActions(instance, params);
          renderFooter(instance, params);
          const popup = getPopup();
          if (typeof params.didRender === "function" && popup) {
            params.didRender(popup);
          }
          (_globalState$eventEmi = globalState.eventEmitter) === null || _globalState$eventEmi === void 0 || _globalState$eventEmi.emit("didRender", popup);
        };
        const isVisible = () => {
          return isVisible$1(getPopup());
        };
        const clickConfirm = () => {
          var _dom$getConfirmButton;
          return (_dom$getConfirmButton = getConfirmButton()) === null || _dom$getConfirmButton === void 0 ? void 0 : _dom$getConfirmButton.click();
        };
        const clickDeny = () => {
          var _dom$getDenyButton;
          return (_dom$getDenyButton = getDenyButton()) === null || _dom$getDenyButton === void 0 ? void 0 : _dom$getDenyButton.click();
        };
        const clickCancel = () => {
          var _dom$getCancelButton;
          return (_dom$getCancelButton = getCancelButton()) === null || _dom$getCancelButton === void 0 ? void 0 : _dom$getCancelButton.click();
        };
        const DismissReason = Object.freeze({
          cancel: "cancel",
          backdrop: "backdrop",
          close: "close",
          esc: "esc",
          timer: "timer"
        });
        const removeKeydownHandler = (globalState2) => {
          if (globalState2.keydownTarget && globalState2.keydownHandlerAdded && globalState2.keydownHandler) {
            const handler = (
              /** @type {EventListenerOrEventListenerObject} */
              /** @type {unknown} */
              globalState2.keydownHandler
            );
            globalState2.keydownTarget.removeEventListener("keydown", handler, {
              capture: globalState2.keydownListenerCapture
            });
            globalState2.keydownHandlerAdded = false;
          }
        };
        const addKeydownHandler = (globalState2, innerParams, dismissWith) => {
          removeKeydownHandler(globalState2);
          if (!innerParams.toast) {
            const handler = (e) => keydownHandler(innerParams, e, dismissWith);
            globalState2.keydownHandler = handler;
            const target = innerParams.keydownListenerCapture ? window : getPopup();
            if (target) {
              globalState2.keydownTarget = target;
              globalState2.keydownListenerCapture = innerParams.keydownListenerCapture;
              const eventHandler = (
                /** @type {EventListenerOrEventListenerObject} */
                /** @type {unknown} */
                handler
              );
              globalState2.keydownTarget.addEventListener("keydown", eventHandler, {
                capture: globalState2.keydownListenerCapture
              });
              globalState2.keydownHandlerAdded = true;
            }
          }
        };
        const setFocus = (index, increment) => {
          var _dom$getPopup;
          const focusableElements = getFocusableElements();
          if (focusableElements.length) {
            index = index + increment;
            if (index === -2) {
              index = focusableElements.length - 1;
            }
            if (index === focusableElements.length) {
              index = 0;
            } else if (index === -1) {
              index = focusableElements.length - 1;
            }
            focusableElements[index].focus();
            if (isFirefox() && focusableElements[index] instanceof HTMLIFrameElement) {
              return false;
            }
            return true;
          }
          (_dom$getPopup = getPopup()) === null || _dom$getPopup === void 0 || _dom$getPopup.focus();
          return true;
        };
        const arrowKeysNextButton = ["ArrowRight", "ArrowDown"];
        const arrowKeysPreviousButton = ["ArrowLeft", "ArrowUp"];
        const keydownHandler = (innerParams, event, dismissWith) => {
          if (!innerParams) {
            return;
          }
          if (event.isComposing || event.keyCode === 229) {
            return;
          }
          if (innerParams.stopKeydownPropagation) {
            event.stopPropagation();
          }
          if (event.key === "Enter") {
            handleEnter(event, innerParams);
          } else if (event.key === "Tab") {
            handleTab(event);
          } else if ([...arrowKeysNextButton, ...arrowKeysPreviousButton].includes(event.key)) {
            handleArrows(event.key);
          } else if (event.key === "Escape") {
            handleEsc(event, innerParams, dismissWith);
          }
        };
        const handleEnter = (event, innerParams) => {
          if (!callIfFunction(innerParams.allowEnterKey)) {
            return;
          }
          const popup = getPopup();
          if (!popup || !innerParams.input) {
            return;
          }
          const input = getInput$1(popup, innerParams.input);
          if (event.target && input && event.target instanceof HTMLElement && event.target.outerHTML === input.outerHTML) {
            if (["textarea", "file"].includes(innerParams.input)) {
              return;
            }
            clickConfirm();
            event.preventDefault();
          }
        };
        const handleTab = (event) => {
          const targetElement = event.target;
          const focusableElements = getFocusableElements();
          const btnIndex = focusableElements.findIndex((el) => el === targetElement);
          let shouldPreventDefault = true;
          if (!event.shiftKey) {
            shouldPreventDefault = setFocus(btnIndex, 1);
          } else {
            shouldPreventDefault = setFocus(btnIndex, -1);
          }
          event.stopPropagation();
          if (shouldPreventDefault) {
            event.preventDefault();
          }
        };
        const handleArrows = (key) => {
          const actions = getActions();
          const confirmButton = getConfirmButton();
          const denyButton = getDenyButton();
          const cancelButton = getCancelButton();
          if (!actions || !confirmButton || !denyButton || !cancelButton) {
            return;
          }
          const buttons = [confirmButton, denyButton, cancelButton];
          if (document.activeElement instanceof HTMLElement && !buttons.includes(document.activeElement)) {
            return;
          }
          const sibling = arrowKeysNextButton.includes(key) ? "nextElementSibling" : "previousElementSibling";
          let buttonToFocus = document.activeElement;
          if (!buttonToFocus) {
            return;
          }
          for (let i = 0; i < actions.children.length; i++) {
            buttonToFocus = buttonToFocus[sibling];
            if (!buttonToFocus) {
              return;
            }
            if (buttonToFocus instanceof HTMLButtonElement && isVisible$1(buttonToFocus)) {
              break;
            }
          }
          if (buttonToFocus instanceof HTMLButtonElement) {
            buttonToFocus.focus();
          }
        };
        const handleEsc = (event, innerParams, dismissWith) => {
          event.preventDefault();
          if (callIfFunction(innerParams.allowEscapeKey)) {
            dismissWith(DismissReason.esc);
          }
        };
        var privateMethods = {
          swalPromiseResolve: /* @__PURE__ */ new WeakMap(),
          swalPromiseReject: /* @__PURE__ */ new WeakMap()
        };
        const setAriaHidden = () => {
          const container = getContainer();
          const bodyChildren = Array.from(document.body.children);
          bodyChildren.forEach((el) => {
            if (el.contains(container)) {
              return;
            }
            if (el.hasAttribute("aria-hidden")) {
              el.setAttribute("data-previous-aria-hidden", el.getAttribute("aria-hidden") || "");
            }
            el.setAttribute("aria-hidden", "true");
          });
        };
        const unsetAriaHidden = () => {
          const bodyChildren = Array.from(document.body.children);
          bodyChildren.forEach((el) => {
            if (el.hasAttribute("data-previous-aria-hidden")) {
              el.setAttribute("aria-hidden", el.getAttribute("data-previous-aria-hidden") || "");
              el.removeAttribute("data-previous-aria-hidden");
            } else {
              el.removeAttribute("aria-hidden");
            }
          });
        };
        const isSafariOrIOS = typeof window !== "undefined" && Boolean(window.GestureEvent);
        const isIOS = isSafariOrIOS && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        const iOSfix = () => {
          if (isSafariOrIOS && !hasClass(document.body, swalClasses.iosfix)) {
            const offset = document.body.scrollTop;
            document.body.style.top = `${offset * -1}px`;
            addClass(document.body, swalClasses.iosfix);
            lockBodyScroll();
          }
        };
        const lockBodyScroll = () => {
          const container = getContainer();
          if (!container) {
            return;
          }
          let preventTouchMove;
          container.ontouchstart = (event) => {
            preventTouchMove = shouldPreventTouchMove(event);
          };
          container.ontouchmove = (event) => {
            if (preventTouchMove) {
              event.preventDefault();
              event.stopPropagation();
            }
          };
        };
        const shouldPreventTouchMove = (event) => {
          const target = event.target;
          const container = getContainer();
          const htmlContainer = getHtmlContainer();
          if (!container || !htmlContainer) {
            return false;
          }
          if (isStylus(event) || isZoom(event)) {
            return false;
          }
          if (target === container) {
            return true;
          }
          if (!isScrollable(container) && target instanceof HTMLElement && !selfOrParentIsScrollable(target, htmlContainer) && // #2823
          target.tagName !== "INPUT" && // #1603
          target.tagName !== "TEXTAREA" && // #2266
          !(isScrollable(htmlContainer) && // #1944
          htmlContainer.contains(target))) {
            return true;
          }
          return false;
        };
        const isStylus = (event) => {
          return Boolean(event.touches && event.touches.length && // @ts-ignore - touchType is not a standard property
          event.touches[0].touchType === "stylus");
        };
        const isZoom = (event) => {
          return event.touches && event.touches.length > 1;
        };
        const undoIOSfix = () => {
          if (hasClass(document.body, swalClasses.iosfix)) {
            const offset = parseInt(document.body.style.top, 10);
            removeClass(document.body, swalClasses.iosfix);
            document.body.style.top = "";
            document.body.scrollTop = offset * -1;
          }
        };
        const measureScrollbar = () => {
          const scrollDiv = document.createElement("div");
          scrollDiv.className = swalClasses["scrollbar-measure"];
          document.body.appendChild(scrollDiv);
          const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
          document.body.removeChild(scrollDiv);
          return scrollbarWidth;
        };
        let previousBodyPadding = null;
        const replaceScrollbarWithPadding = (initialBodyOverflow) => {
          if (previousBodyPadding !== null) {
            return;
          }
          if (document.body.scrollHeight > window.innerHeight || initialBodyOverflow === "scroll") {
            previousBodyPadding = parseInt(window.getComputedStyle(document.body).getPropertyValue("padding-right"));
            document.body.style.paddingRight = `${previousBodyPadding + measureScrollbar()}px`;
          }
        };
        const undoReplaceScrollbarWithPadding = () => {
          if (previousBodyPadding !== null) {
            document.body.style.paddingRight = `${previousBodyPadding}px`;
            previousBodyPadding = null;
          }
        };
        function removePopupAndResetState(instance, container, returnFocus, didClose) {
          if (isToast()) {
            triggerDidCloseAndDispose(instance, didClose);
          } else {
            restoreActiveElement(returnFocus).then(() => triggerDidCloseAndDispose(instance, didClose));
            removeKeydownHandler(globalState);
          }
          if (isSafariOrIOS) {
            container.setAttribute("style", "display:none !important");
            container.removeAttribute("class");
            container.innerHTML = "";
          } else {
            container.remove();
          }
          if (isModal()) {
            undoReplaceScrollbarWithPadding();
            undoIOSfix();
            unsetAriaHidden();
          }
          removeBodyClasses();
        }
        function removeBodyClasses() {
          removeClass([document.documentElement, document.body], [swalClasses.shown, swalClasses["height-auto"], swalClasses["no-backdrop"], swalClasses["toast-shown"]]);
        }
        function close(resolveValue) {
          resolveValue = prepareResolveValue(resolveValue);
          const swalPromiseResolve = privateMethods.swalPromiseResolve.get(this);
          const didClose = triggerClosePopup(this);
          if (this.isAwaitingPromise) {
            if (!resolveValue.isDismissed) {
              handleAwaitingPromise(this);
              swalPromiseResolve(resolveValue);
            }
          } else if (didClose) {
            swalPromiseResolve(resolveValue);
          }
        }
        const triggerClosePopup = (instance) => {
          const popup = getPopup();
          if (!popup) {
            return false;
          }
          const innerParams = privateProps.innerParams.get(instance);
          if (!innerParams || hasClass(popup, innerParams.hideClass.popup)) {
            return false;
          }
          removeClass(popup, innerParams.showClass.popup);
          addClass(popup, innerParams.hideClass.popup);
          const backdrop = getContainer();
          removeClass(backdrop, innerParams.showClass.backdrop);
          addClass(backdrop, innerParams.hideClass.backdrop);
          handlePopupAnimation(instance, popup, innerParams);
          return true;
        };
        function rejectPromise(error2) {
          const rejectPromise2 = privateMethods.swalPromiseReject.get(this);
          handleAwaitingPromise(this);
          if (rejectPromise2) {
            rejectPromise2(error2);
          }
        }
        const handleAwaitingPromise = (instance) => {
          if (instance.isAwaitingPromise) {
            delete instance.isAwaitingPromise;
            if (!privateProps.innerParams.get(instance)) {
              instance._destroy();
            }
          }
        };
        const prepareResolveValue = (resolveValue) => {
          if (typeof resolveValue === "undefined") {
            return {
              isConfirmed: false,
              isDenied: false,
              isDismissed: true
            };
          }
          return Object.assign({
            isConfirmed: false,
            isDenied: false,
            isDismissed: false
          }, resolveValue);
        };
        const handlePopupAnimation = (instance, popup, innerParams) => {
          var _globalState$eventEmi;
          const container = getContainer();
          const animationIsSupported = hasCssAnimation(popup);
          if (typeof innerParams.willClose === "function") {
            innerParams.willClose(popup);
          }
          (_globalState$eventEmi = globalState.eventEmitter) === null || _globalState$eventEmi === void 0 || _globalState$eventEmi.emit("willClose", popup);
          if (animationIsSupported && container) {
            animatePopup(instance, popup, container, Boolean(innerParams.returnFocus), innerParams.didClose);
          } else if (container) {
            removePopupAndResetState(instance, container, Boolean(innerParams.returnFocus), innerParams.didClose);
          }
        };
        const animatePopup = (instance, popup, container, returnFocus, didClose) => {
          globalState.swalCloseEventFinishedCallback = removePopupAndResetState.bind(null, instance, container, returnFocus, didClose);
          const swalCloseAnimationFinished = function(e) {
            if (e.target === popup) {
              var _globalState$swalClos;
              (_globalState$swalClos = globalState.swalCloseEventFinishedCallback) === null || _globalState$swalClos === void 0 || _globalState$swalClos.call(globalState);
              delete globalState.swalCloseEventFinishedCallback;
              popup.removeEventListener("animationend", swalCloseAnimationFinished);
              popup.removeEventListener("transitionend", swalCloseAnimationFinished);
            }
          };
          popup.addEventListener("animationend", swalCloseAnimationFinished);
          popup.addEventListener("transitionend", swalCloseAnimationFinished);
        };
        const triggerDidCloseAndDispose = (instance, didClose) => {
          setTimeout(() => {
            var _globalState$eventEmi2;
            if (typeof didClose === "function") {
              didClose.bind(instance.params)();
            }
            (_globalState$eventEmi2 = globalState.eventEmitter) === null || _globalState$eventEmi2 === void 0 || _globalState$eventEmi2.emit("didClose");
            if (instance._destroy) {
              instance._destroy();
            }
          });
        };
        const showLoading = (buttonToReplace) => {
          let popup = getPopup();
          if (!popup) {
            new Swal6();
          }
          popup = getPopup();
          if (!popup) {
            return;
          }
          const loader = getLoader();
          if (isToast()) {
            hide(getIcon());
          } else {
            replaceButton(popup, buttonToReplace);
          }
          show(loader);
          popup.setAttribute("data-loading", "true");
          popup.setAttribute("aria-busy", "true");
          popup.focus();
        };
        const replaceButton = (popup, buttonToReplace) => {
          const actions = getActions();
          const loader = getLoader();
          if (!actions || !loader) {
            return;
          }
          if (!buttonToReplace && isVisible$1(getConfirmButton())) {
            buttonToReplace = getConfirmButton();
          }
          show(actions);
          if (buttonToReplace) {
            hide(buttonToReplace);
            loader.setAttribute("data-button-to-replace", buttonToReplace.className);
            actions.insertBefore(loader, buttonToReplace);
          }
          addClass([popup, actions], swalClasses.loading);
        };
        const handleInputOptionsAndValue = (instance, params) => {
          if (params.input === "select" || params.input === "radio") {
            handleInputOptions(instance, params);
          } else if (["text", "email", "number", "tel", "textarea"].some((i) => i === params.input) && (hasToPromiseFn(params.inputValue) || isPromise(params.inputValue))) {
            showLoading(getConfirmButton());
            handleInputValue(instance, params);
          }
        };
        const getInputValue = (instance, innerParams) => {
          const input = instance.getInput();
          if (!input) {
            return null;
          }
          switch (innerParams.input) {
            case "checkbox":
              return getCheckboxValue(input);
            case "radio":
              return getRadioValue(input);
            case "file":
              return getFileValue(input);
            default:
              return innerParams.inputAutoTrim ? input.value.trim() : input.value;
          }
        };
        const getCheckboxValue = (input) => input.checked ? 1 : 0;
        const getRadioValue = (input) => input.checked ? input.value : null;
        const getFileValue = (input) => input.files && input.files.length ? input.getAttribute("multiple") !== null ? input.files : input.files[0] : null;
        const handleInputOptions = (instance, params) => {
          const popup = getPopup();
          if (!popup) {
            return;
          }
          const processInputOptions = (inputOptions) => {
            if (params.input === "select") {
              populateSelectOptions(popup, formatInputOptions(inputOptions), params);
            } else if (params.input === "radio") {
              populateRadioOptions(popup, formatInputOptions(inputOptions), params);
            }
          };
          if (hasToPromiseFn(params.inputOptions) || isPromise(params.inputOptions)) {
            showLoading(getConfirmButton());
            asPromise(params.inputOptions).then((inputOptions) => {
              instance.hideLoading();
              processInputOptions(inputOptions);
            });
          } else if (typeof params.inputOptions === "object") {
            processInputOptions(params.inputOptions);
          } else {
            error(`Unexpected type of inputOptions! Expected object, Map or Promise, got ${typeof params.inputOptions}`);
          }
        };
        const handleInputValue = (instance, params) => {
          const input = instance.getInput();
          if (!input) {
            return;
          }
          hide(input);
          asPromise(params.inputValue).then((inputValue) => {
            input.value = params.input === "number" ? `${parseFloat(inputValue) || 0}` : `${inputValue}`;
            show(input);
            input.focus();
            instance.hideLoading();
          }).catch((err) => {
            error(`Error in inputValue promise: ${err}`);
            input.value = "";
            show(input);
            input.focus();
            instance.hideLoading();
          });
        };
        function populateSelectOptions(popup, inputOptions, params) {
          const select = getDirectChildByClass(popup, swalClasses.select);
          if (!select) {
            return;
          }
          const renderOption = (parent, optionLabel, optionValue) => {
            const option = document.createElement("option");
            option.value = optionValue;
            setInnerHtml(option, optionLabel);
            option.selected = isSelected(optionValue, params.inputValue);
            parent.appendChild(option);
          };
          inputOptions.forEach((inputOption) => {
            const optionValue = inputOption[0];
            const optionLabel = inputOption[1];
            if (Array.isArray(optionLabel)) {
              const optgroup = document.createElement("optgroup");
              optgroup.label = optionValue;
              optgroup.disabled = false;
              select.appendChild(optgroup);
              optionLabel.forEach((o) => renderOption(optgroup, o[1], o[0]));
            } else {
              renderOption(select, optionLabel, optionValue);
            }
          });
          select.focus();
        }
        function populateRadioOptions(popup, inputOptions, params) {
          const radio = getDirectChildByClass(popup, swalClasses.radio);
          if (!radio) {
            return;
          }
          inputOptions.forEach((inputOption) => {
            const radioValue = inputOption[0];
            const radioLabel = inputOption[1];
            const radioInput = document.createElement("input");
            const radioLabelElement = document.createElement("label");
            radioInput.type = "radio";
            radioInput.name = swalClasses.radio;
            radioInput.value = radioValue;
            if (isSelected(radioValue, params.inputValue)) {
              radioInput.checked = true;
            }
            const label = document.createElement("span");
            setInnerHtml(label, radioLabel);
            label.className = swalClasses.label;
            radioLabelElement.appendChild(radioInput);
            radioLabelElement.appendChild(label);
            radio.appendChild(radioLabelElement);
          });
          const radios = radio.querySelectorAll("input");
          if (radios.length) {
            radios[0].focus();
          }
        }
        const formatInputOptions = (inputOptions) => {
          const entries = inputOptions instanceof Map ? Array.from(inputOptions) : Object.entries(inputOptions);
          return entries.map(([key, value]) => [key, typeof value === "object" ? formatInputOptions(value) : value]);
        };
        const isSelected = (optionValue, inputValue) => Boolean(inputValue) && inputValue != null && inputValue.toString() === optionValue.toString();
        const handleConfirmButtonClick = (instance) => {
          const innerParams = privateProps.innerParams.get(instance);
          instance.disableButtons();
          if (innerParams.input) {
            handleConfirmOrDenyWithInput(instance, "confirm");
          } else {
            confirm(instance, true);
          }
        };
        const handleDenyButtonClick = (instance) => {
          const innerParams = privateProps.innerParams.get(instance);
          instance.disableButtons();
          if (innerParams.returnInputValueOnDeny) {
            handleConfirmOrDenyWithInput(instance, "deny");
          } else {
            deny(instance, false);
          }
        };
        const handleCancelButtonClick = (instance, dismissWith) => {
          instance.disableButtons();
          dismissWith(DismissReason.cancel);
        };
        const handleConfirmOrDenyWithInput = (instance, type) => {
          const innerParams = privateProps.innerParams.get(instance);
          if (!innerParams.input) {
            error(`The "input" parameter is needed to be set when using returnInputValueOn${capitalizeFirstLetter(type)}`);
            return;
          }
          const input = instance.getInput();
          const inputValue = getInputValue(instance, innerParams);
          if (innerParams.inputValidator) {
            handleInputValidator(instance, inputValue, type);
          } else if (input && !input.checkValidity()) {
            instance.enableButtons();
            instance.showValidationMessage(innerParams.validationMessage || input.validationMessage);
          } else if (type === "deny") {
            deny(instance, inputValue);
          } else {
            confirm(instance, inputValue);
          }
        };
        const handleInputValidator = (instance, inputValue, type) => {
          const innerParams = privateProps.innerParams.get(instance);
          instance.disableInput();
          const validationPromise = Promise.resolve().then(() => asPromise(innerParams.inputValidator(inputValue, innerParams.validationMessage)));
          validationPromise.then((validationMessage) => {
            instance.enableButtons();
            instance.enableInput();
            if (validationMessage) {
              instance.showValidationMessage(validationMessage);
            } else if (type === "deny") {
              deny(instance, inputValue);
            } else {
              confirm(instance, inputValue);
            }
          });
        };
        const deny = (instance, value) => {
          const innerParams = privateProps.innerParams.get(instance);
          if (innerParams.showLoaderOnDeny) {
            showLoading(getDenyButton());
          }
          if (innerParams.preDeny) {
            instance.isAwaitingPromise = true;
            const preDenyPromise = Promise.resolve().then(() => asPromise(innerParams.preDeny(value, innerParams.validationMessage)));
            preDenyPromise.then((preDenyValue) => {
              if (preDenyValue === false) {
                instance.hideLoading();
                handleAwaitingPromise(instance);
              } else {
                instance.close(
                  /** @type SweetAlertResult */
                  {
                    isDenied: true,
                    value: typeof preDenyValue === "undefined" ? value : preDenyValue
                  }
                );
              }
            }).catch((error2) => rejectWith(instance, error2));
          } else {
            instance.close(
              /** @type SweetAlertResult */
              {
                isDenied: true,
                value
              }
            );
          }
        };
        const succeedWith = (instance, value) => {
          instance.close(
            /** @type SweetAlertResult */
            {
              isConfirmed: true,
              value
            }
          );
        };
        const rejectWith = (instance, error2) => {
          instance.rejectPromise(error2);
        };
        const confirm = (instance, value) => {
          const innerParams = privateProps.innerParams.get(instance);
          if (innerParams.showLoaderOnConfirm) {
            showLoading();
          }
          if (innerParams.preConfirm) {
            instance.resetValidationMessage();
            instance.isAwaitingPromise = true;
            const preConfirmPromise = Promise.resolve().then(() => asPromise(innerParams.preConfirm(value, innerParams.validationMessage)));
            preConfirmPromise.then((preConfirmValue) => {
              if (isVisible$1(getValidationMessage()) || preConfirmValue === false) {
                instance.hideLoading();
                handleAwaitingPromise(instance);
              } else {
                succeedWith(instance, typeof preConfirmValue === "undefined" ? value : preConfirmValue);
              }
            }).catch((error2) => rejectWith(instance, error2));
          } else {
            succeedWith(instance, value);
          }
        };
        function hideLoading() {
          const innerParams = privateProps.innerParams.get(this);
          if (!innerParams) {
            return;
          }
          const domCache = privateProps.domCache.get(this);
          hide(domCache.loader);
          if (isToast()) {
            if (innerParams.icon) {
              show(getIcon());
            }
          } else {
            showRelatedButton(domCache);
          }
          removeClass([domCache.popup, domCache.actions], swalClasses.loading);
          domCache.popup.removeAttribute("aria-busy");
          domCache.popup.removeAttribute("data-loading");
          this.enableButtons();
        }
        const showRelatedButton = (domCache) => {
          const dataButtonToReplace = domCache.loader.getAttribute("data-button-to-replace");
          const buttonToReplace = dataButtonToReplace ? domCache.popup.getElementsByClassName(dataButtonToReplace) : [];
          if (buttonToReplace.length) {
            show(
              /** @type {HTMLElement} */
              buttonToReplace[0],
              "inline-block"
            );
          } else if (allButtonsAreHidden()) {
            hide(domCache.actions);
          }
        };
        function getInput() {
          const innerParams = privateProps.innerParams.get(this);
          const domCache = privateProps.domCache.get(this);
          if (!domCache) {
            return null;
          }
          return getInput$1(domCache.popup, innerParams.input);
        }
        function setButtonsDisabled(instance, buttons, disabled) {
          const domCache = privateProps.domCache.get(instance);
          buttons.forEach((button) => {
            domCache[button].disabled = disabled;
          });
        }
        function setInputDisabled(input, disabled) {
          const popup = getPopup();
          if (!popup || !input) {
            return;
          }
          if (input.type === "radio") {
            const radios = popup.querySelectorAll(`[name="${swalClasses.radio}"]`);
            radios.forEach((radio) => {
              radio.disabled = disabled;
            });
          } else {
            input.disabled = disabled;
          }
        }
        function enableButtons() {
          setButtonsDisabled(this, ["confirmButton", "denyButton", "cancelButton"], false);
          const focusedElement = privateProps.focusedElement.get(this);
          if (focusedElement instanceof HTMLElement && document.activeElement === document.body) {
            focusedElement.focus();
          }
          privateProps.focusedElement.delete(this);
        }
        function disableButtons() {
          privateProps.focusedElement.set(this, document.activeElement);
          setButtonsDisabled(this, ["confirmButton", "denyButton", "cancelButton"], true);
        }
        function enableInput() {
          setInputDisabled(this.getInput(), false);
        }
        function disableInput() {
          setInputDisabled(this.getInput(), true);
        }
        function showValidationMessage(error2) {
          const domCache = privateProps.domCache.get(this);
          const params = privateProps.innerParams.get(this);
          setInnerHtml(domCache.validationMessage, error2);
          domCache.validationMessage.className = swalClasses["validation-message"];
          if (params.customClass && params.customClass.validationMessage) {
            addClass(domCache.validationMessage, params.customClass.validationMessage);
          }
          show(domCache.validationMessage);
          const input = this.getInput();
          if (input) {
            input.setAttribute("aria-invalid", "true");
            input.setAttribute("aria-describedby", swalClasses["validation-message"]);
            focusInput(input);
            addClass(input, swalClasses.inputerror);
          }
        }
        function resetValidationMessage() {
          const domCache = privateProps.domCache.get(this);
          if (domCache.validationMessage) {
            hide(domCache.validationMessage);
          }
          const input = this.getInput();
          if (input) {
            input.removeAttribute("aria-invalid");
            input.removeAttribute("aria-describedby");
            removeClass(input, swalClasses.inputerror);
          }
        }
        const defaultParams = {
          title: "",
          titleText: "",
          text: "",
          html: "",
          footer: "",
          icon: void 0,
          iconColor: void 0,
          iconHtml: void 0,
          template: void 0,
          toast: false,
          draggable: false,
          animation: true,
          theme: "light",
          showClass: {
            popup: "swal2-show",
            backdrop: "swal2-backdrop-show",
            icon: "swal2-icon-show"
          },
          hideClass: {
            popup: "swal2-hide",
            backdrop: "swal2-backdrop-hide",
            icon: "swal2-icon-hide"
          },
          customClass: {},
          target: "body",
          color: void 0,
          backdrop: true,
          heightAuto: true,
          allowOutsideClick: true,
          allowEscapeKey: true,
          allowEnterKey: true,
          stopKeydownPropagation: true,
          keydownListenerCapture: false,
          showConfirmButton: true,
          showDenyButton: false,
          showCancelButton: false,
          preConfirm: void 0,
          preDeny: void 0,
          confirmButtonText: "OK",
          confirmButtonAriaLabel: "",
          confirmButtonColor: void 0,
          denyButtonText: "No",
          denyButtonAriaLabel: "",
          denyButtonColor: void 0,
          cancelButtonText: "Cancel",
          cancelButtonAriaLabel: "",
          cancelButtonColor: void 0,
          buttonsStyling: true,
          reverseButtons: false,
          focusConfirm: true,
          focusDeny: false,
          focusCancel: false,
          returnFocus: true,
          showCloseButton: false,
          closeButtonHtml: "&times;",
          closeButtonAriaLabel: "Close this dialog",
          loaderHtml: "",
          showLoaderOnConfirm: false,
          showLoaderOnDeny: false,
          imageUrl: void 0,
          imageWidth: void 0,
          imageHeight: void 0,
          imageAlt: "",
          timer: void 0,
          timerProgressBar: false,
          width: void 0,
          padding: void 0,
          background: void 0,
          input: void 0,
          inputPlaceholder: "",
          inputLabel: "",
          inputValue: "",
          inputOptions: {},
          inputAutoFocus: true,
          inputAutoTrim: true,
          inputAttributes: {},
          inputValidator: void 0,
          returnInputValueOnDeny: false,
          validationMessage: void 0,
          grow: false,
          position: "center",
          progressSteps: [],
          currentProgressStep: void 0,
          progressStepsDistance: void 0,
          willOpen: void 0,
          didOpen: void 0,
          didRender: void 0,
          willClose: void 0,
          didClose: void 0,
          didDestroy: void 0,
          scrollbarPadding: true,
          topLayer: false
        };
        const updatableParams = ["allowEscapeKey", "allowOutsideClick", "background", "buttonsStyling", "cancelButtonAriaLabel", "cancelButtonColor", "cancelButtonText", "closeButtonAriaLabel", "closeButtonHtml", "color", "confirmButtonAriaLabel", "confirmButtonColor", "confirmButtonText", "currentProgressStep", "customClass", "denyButtonAriaLabel", "denyButtonColor", "denyButtonText", "didClose", "didDestroy", "draggable", "footer", "hideClass", "html", "icon", "iconColor", "iconHtml", "imageAlt", "imageHeight", "imageUrl", "imageWidth", "preConfirm", "preDeny", "progressSteps", "returnFocus", "reverseButtons", "showCancelButton", "showCloseButton", "showConfirmButton", "showDenyButton", "text", "title", "titleText", "theme", "willClose"];
        const deprecatedParams = {
          allowEnterKey: void 0
        };
        const toastIncompatibleParams = ["allowOutsideClick", "allowEnterKey", "backdrop", "draggable", "focusConfirm", "focusDeny", "focusCancel", "returnFocus", "heightAuto", "keydownListenerCapture"];
        const isValidParameter = (paramName) => {
          return Object.prototype.hasOwnProperty.call(defaultParams, paramName);
        };
        const isUpdatableParameter = (paramName) => {
          return updatableParams.indexOf(paramName) !== -1;
        };
        const isDeprecatedParameter = (paramName) => {
          return deprecatedParams[paramName];
        };
        const checkIfParamIsValid = (param) => {
          if (!isValidParameter(param)) {
            warn(`Unknown parameter "${param}"`);
          }
        };
        const checkIfToastParamIsValid = (param) => {
          if (toastIncompatibleParams.includes(param)) {
            warn(`The parameter "${param}" is incompatible with toasts`);
          }
        };
        const checkIfParamIsDeprecated = (param) => {
          const isDeprecated = isDeprecatedParameter(param);
          if (isDeprecated) {
            warnAboutDeprecation(param, isDeprecated);
          }
        };
        const showWarningsForParams = (params) => {
          if (params.backdrop === false && params.allowOutsideClick) {
            warn('"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`');
          }
          if (params.theme && !["light", "dark", "auto", "minimal", "borderless", "bootstrap-4", "bootstrap-4-light", "bootstrap-4-dark", "bootstrap-5", "bootstrap-5-light", "bootstrap-5-dark", "material-ui", "material-ui-light", "material-ui-dark", "embed-iframe", "bulma", "bulma-light", "bulma-dark"].includes(params.theme)) {
            warn(`Invalid theme "${params.theme}"`);
          }
          for (const param in params) {
            checkIfParamIsValid(param);
            if (params.toast) {
              checkIfToastParamIsValid(param);
            }
            checkIfParamIsDeprecated(param);
          }
        };
        function update(params) {
          const container = getContainer();
          const popup = getPopup();
          const innerParams = privateProps.innerParams.get(this);
          if (!popup || hasClass(popup, innerParams.hideClass.popup)) {
            warn(`You're trying to update the closed or closing popup, that won't work. Use the update() method in preConfirm parameter or show a new popup.`);
            return;
          }
          const validUpdatableParams = filterValidParams(params);
          const updatedParams = Object.assign({}, innerParams, validUpdatableParams);
          showWarningsForParams(updatedParams);
          if (container) {
            container.dataset["swal2Theme"] = updatedParams.theme;
          }
          render(this, updatedParams);
          privateProps.innerParams.set(this, updatedParams);
          Object.defineProperties(this, {
            params: {
              value: Object.assign({}, this.params, params),
              writable: false,
              enumerable: true
            }
          });
        }
        const filterValidParams = (params) => {
          const validUpdatableParams = {};
          Object.keys(params).forEach((param) => {
            if (isUpdatableParameter(param)) {
              const typedParams = (
                /** @type {Record<string, any>} */
                params
              );
              validUpdatableParams[param] = typedParams[param];
            } else {
              warn(`Invalid parameter to update: ${param}`);
            }
          });
          return validUpdatableParams;
        };
        function _destroy() {
          var _globalState$eventEmi;
          const domCache = privateProps.domCache.get(this);
          const innerParams = privateProps.innerParams.get(this);
          if (!innerParams) {
            disposeWeakMaps(this);
            return;
          }
          if (domCache.popup && globalState.swalCloseEventFinishedCallback) {
            globalState.swalCloseEventFinishedCallback();
            delete globalState.swalCloseEventFinishedCallback;
          }
          if (typeof innerParams.didDestroy === "function") {
            innerParams.didDestroy();
          }
          (_globalState$eventEmi = globalState.eventEmitter) === null || _globalState$eventEmi === void 0 || _globalState$eventEmi.emit("didDestroy");
          disposeSwal(this);
        }
        const disposeSwal = (instance) => {
          disposeWeakMaps(instance);
          delete instance.params;
          delete globalState.keydownHandler;
          delete globalState.keydownTarget;
          delete globalState.currentInstance;
        };
        const disposeWeakMaps = (instance) => {
          if (instance.isAwaitingPromise) {
            unsetWeakMaps(privateProps, instance);
            instance.isAwaitingPromise = true;
          } else {
            unsetWeakMaps(privateMethods, instance);
            unsetWeakMaps(privateProps, instance);
            delete instance.isAwaitingPromise;
            delete instance.disableButtons;
            delete instance.enableButtons;
            delete instance.getInput;
            delete instance.disableInput;
            delete instance.enableInput;
            delete instance.hideLoading;
            delete instance.disableLoading;
            delete instance.showValidationMessage;
            delete instance.resetValidationMessage;
            delete instance.close;
            delete instance.closePopup;
            delete instance.closeModal;
            delete instance.closeToast;
            delete instance.rejectPromise;
            delete instance.update;
            delete instance._destroy;
          }
        };
        const unsetWeakMaps = (obj, instance) => {
          for (const i in obj) {
            obj[i].delete(instance);
          }
        };
        var instanceMethods = /* @__PURE__ */ Object.freeze({
          __proto__: null,
          _destroy,
          close,
          closeModal: close,
          closePopup: close,
          closeToast: close,
          disableButtons,
          disableInput,
          disableLoading: hideLoading,
          enableButtons,
          enableInput,
          getInput,
          handleAwaitingPromise,
          hideLoading,
          rejectPromise,
          resetValidationMessage,
          showValidationMessage,
          update
        });
        const handlePopupClick = (innerParams, domCache, dismissWith) => {
          if (innerParams.toast) {
            handleToastClick(innerParams, domCache, dismissWith);
          } else {
            handleModalMousedown(domCache);
            handleContainerMousedown(domCache);
            handleModalClick(innerParams, domCache, dismissWith);
          }
        };
        const handleToastClick = (innerParams, domCache, dismissWith) => {
          domCache.popup.onclick = () => {
            if (innerParams && (isAnyButtonShown(innerParams) || innerParams.timer || innerParams.input)) {
              return;
            }
            dismissWith(DismissReason.close);
          };
        };
        const isAnyButtonShown = (innerParams) => {
          return Boolean(innerParams.showConfirmButton || innerParams.showDenyButton || innerParams.showCancelButton || innerParams.showCloseButton);
        };
        let ignoreOutsideClick = false;
        const handleModalMousedown = (domCache) => {
          domCache.popup.onmousedown = () => {
            domCache.container.onmouseup = function(e) {
              domCache.container.onmouseup = () => {
              };
              if (e.target === domCache.container) {
                ignoreOutsideClick = true;
              }
            };
          };
        };
        const handleContainerMousedown = (domCache) => {
          domCache.container.onmousedown = (e) => {
            if (e.target === domCache.container) {
              e.preventDefault();
            }
            domCache.popup.onmouseup = function(e2) {
              domCache.popup.onmouseup = () => {
              };
              if (e2.target === domCache.popup || e2.target instanceof HTMLElement && domCache.popup.contains(e2.target)) {
                ignoreOutsideClick = true;
              }
            };
          };
        };
        const handleModalClick = (innerParams, domCache, dismissWith) => {
          domCache.container.onclick = (e) => {
            if (ignoreOutsideClick) {
              ignoreOutsideClick = false;
              return;
            }
            if (e.target === domCache.container && callIfFunction(innerParams.allowOutsideClick)) {
              dismissWith(DismissReason.backdrop);
            }
          };
        };
        const isJqueryElement = (elem) => typeof elem === "object" && elem !== null && "jquery" in elem;
        const isElement = (elem) => elem instanceof Element || isJqueryElement(elem);
        const argsToParams = (args) => {
          const params = {};
          if (typeof args[0] === "object" && !isElement(args[0])) {
            Object.assign(params, args[0]);
          } else {
            ["title", "html", "icon"].forEach((name, index) => {
              const arg = args[index];
              if (typeof arg === "string" || isElement(arg)) {
                params[name] = arg;
              } else if (arg !== void 0) {
                error(`Unexpected type of ${name}! Expected "string" or "Element", got ${typeof arg}`);
              }
            });
          }
          return (
            /** @type {SweetAlertOptions} */
            params
          );
        };
        function fire(...args) {
          return new this(...args);
        }
        function mixin(mixinParams) {
          class MixinSwal extends this {
            /**
             * @param {any} params
             * @param {any} priorityMixinParams
             */
            _main(params, priorityMixinParams) {
              return super._main(params, Object.assign({}, mixinParams, priorityMixinParams));
            }
          }
          return MixinSwal;
        }
        const getTimerLeft = () => {
          return globalState.timeout && globalState.timeout.getTimerLeft();
        };
        const stopTimer = () => {
          if (globalState.timeout) {
            stopTimerProgressBar();
            return globalState.timeout.stop();
          }
        };
        const resumeTimer = () => {
          if (globalState.timeout) {
            const remaining = globalState.timeout.start();
            animateTimerProgressBar(remaining);
            return remaining;
          }
        };
        const toggleTimer = () => {
          const timer = globalState.timeout;
          return timer && (timer.running ? stopTimer() : resumeTimer());
        };
        const increaseTimer = (ms) => {
          if (globalState.timeout) {
            const remaining = globalState.timeout.increase(ms);
            animateTimerProgressBar(remaining, true);
            return remaining;
          }
        };
        const isTimerRunning = () => {
          return Boolean(globalState.timeout && globalState.timeout.isRunning());
        };
        let bodyClickListenerAdded = false;
        const clickHandlers = {};
        function bindClickHandler(attr = "data-swal-template") {
          clickHandlers[attr] = this;
          if (!bodyClickListenerAdded) {
            document.body.addEventListener("click", bodyClickListener);
            bodyClickListenerAdded = true;
          }
        }
        const bodyClickListener = (event) => {
          for (let el = (
            /** @type {any} */
            event.target
          ); el && el !== document; el = el.parentNode) {
            for (const attr in clickHandlers) {
              const template = el.getAttribute && el.getAttribute(attr);
              if (template) {
                clickHandlers[attr].fire({
                  template
                });
                return;
              }
            }
          }
        };
        class EventEmitter {
          constructor() {
            this.events = {};
          }
          /**
           * @param {string} eventName
           * @returns {EventHandlers}
           */
          _getHandlersByEventName(eventName) {
            if (typeof this.events[eventName] === "undefined") {
              this.events[eventName] = [];
            }
            return this.events[eventName];
          }
          /**
           * @param {string} eventName
           * @param {EventHandler} eventHandler
           */
          on(eventName, eventHandler) {
            const currentHandlers = this._getHandlersByEventName(eventName);
            if (!currentHandlers.includes(eventHandler)) {
              currentHandlers.push(eventHandler);
            }
          }
          /**
           * @param {string} eventName
           * @param {EventHandler} eventHandler
           */
          once(eventName, eventHandler) {
            const onceFn = (...args) => {
              this.removeListener(eventName, onceFn);
              eventHandler.apply(this, args);
            };
            this.on(eventName, onceFn);
          }
          /**
           * @param {string} eventName
           * @param {...any} args
           */
          emit(eventName, ...args) {
            this._getHandlersByEventName(eventName).forEach(
              /**
               * @param {EventHandler} eventHandler
               */
              (eventHandler) => {
                try {
                  eventHandler.apply(this, args);
                } catch (error2) {
                  console.error(error2);
                }
              }
            );
          }
          /**
           * @param {string} eventName
           * @param {EventHandler} eventHandler
           */
          removeListener(eventName, eventHandler) {
            const currentHandlers = this._getHandlersByEventName(eventName);
            const index = currentHandlers.indexOf(eventHandler);
            if (index > -1) {
              currentHandlers.splice(index, 1);
            }
          }
          /**
           * @param {string} eventName
           */
          removeAllListeners(eventName) {
            if (this.events[eventName] !== void 0) {
              this.events[eventName].length = 0;
            }
          }
          reset() {
            this.events = {};
          }
        }
        globalState.eventEmitter = new EventEmitter();
        const on = (eventName, eventHandler) => {
          if (globalState.eventEmitter) {
            globalState.eventEmitter.on(eventName, eventHandler);
          }
        };
        const once = (eventName, eventHandler) => {
          if (globalState.eventEmitter) {
            globalState.eventEmitter.once(eventName, eventHandler);
          }
        };
        const off = (eventName, eventHandler) => {
          if (!globalState.eventEmitter) {
            return;
          }
          if (!eventName) {
            globalState.eventEmitter.reset();
            return;
          }
          if (eventHandler) {
            globalState.eventEmitter.removeListener(eventName, eventHandler);
          } else {
            globalState.eventEmitter.removeAllListeners(eventName);
          }
        };
        var staticMethods = /* @__PURE__ */ Object.freeze({
          __proto__: null,
          argsToParams,
          bindClickHandler,
          clickCancel,
          clickConfirm,
          clickDeny,
          enableLoading: showLoading,
          fire,
          getActions,
          getCancelButton,
          getCloseButton,
          getConfirmButton,
          getContainer,
          getDenyButton,
          getFocusableElements,
          getFooter,
          getHtmlContainer,
          getIcon,
          getIconContent,
          getImage,
          getInputLabel,
          getLoader,
          getPopup,
          getProgressSteps,
          getTimerLeft,
          getTimerProgressBar,
          getTitle,
          getValidationMessage,
          increaseTimer,
          isDeprecatedParameter,
          isLoading,
          isTimerRunning,
          isUpdatableParameter,
          isValidParameter,
          isVisible,
          mixin,
          off,
          on,
          once,
          resumeTimer,
          showLoading,
          stopTimer,
          toggleTimer
        });
        class Timer {
          /**
           * @param {() => void} callback
           * @param {number} delay
           */
          constructor(callback, delay) {
            this.callback = callback;
            this.remaining = delay;
            this.running = false;
            this.start();
          }
          /**
           * @returns {number}
           */
          start() {
            if (!this.running) {
              this.running = true;
              this.started = /* @__PURE__ */ new Date();
              this.id = setTimeout(this.callback, this.remaining);
            }
            return this.remaining;
          }
          /**
           * @returns {number}
           */
          stop() {
            if (this.started && this.running) {
              this.running = false;
              clearTimeout(this.id);
              this.remaining -= (/* @__PURE__ */ new Date()).getTime() - this.started.getTime();
            }
            return this.remaining;
          }
          /**
           * @param {number} n
           * @returns {number}
           */
          increase(n) {
            const running = this.running;
            if (running) {
              this.stop();
            }
            this.remaining += n;
            if (running) {
              this.start();
            }
            return this.remaining;
          }
          /**
           * @returns {number}
           */
          getTimerLeft() {
            if (this.running) {
              this.stop();
              this.start();
            }
            return this.remaining;
          }
          /**
           * @returns {boolean}
           */
          isRunning() {
            return this.running;
          }
        }
        const swalStringParams = ["swal-title", "swal-html", "swal-footer"];
        const getTemplateParams = (params) => {
          const template = typeof params.template === "string" ? (
            /** @type {HTMLTemplateElement} */
            document.querySelector(params.template)
          ) : params.template;
          if (!template) {
            return {};
          }
          const templateContent = template.content;
          showWarningsForElements(templateContent);
          const result = Object.assign(getSwalParams(templateContent), getSwalFunctionParams(templateContent), getSwalButtons(templateContent), getSwalImage(templateContent), getSwalIcon(templateContent), getSwalInput(templateContent), getSwalStringParams(templateContent, swalStringParams));
          return result;
        };
        const getSwalParams = (templateContent) => {
          const result = {};
          const swalParams = Array.from(templateContent.querySelectorAll("swal-param"));
          swalParams.forEach((param) => {
            showWarningsForAttributes(param, ["name", "value"]);
            const paramName = (
              /** @type {keyof SweetAlertOptions} */
              param.getAttribute("name")
            );
            const value = param.getAttribute("value");
            if (!paramName || !value) {
              return;
            }
            if (paramName in defaultParams && typeof defaultParams[
              /** @type {keyof typeof defaultParams} */
              paramName
            ] === "boolean") {
              result[paramName] = value !== "false";
            } else if (paramName in defaultParams && typeof defaultParams[
              /** @type {keyof typeof defaultParams} */
              paramName
            ] === "object") {
              result[paramName] = JSON.parse(value);
            } else {
              result[paramName] = value;
            }
          });
          return result;
        };
        const getSwalFunctionParams = (templateContent) => {
          const result = {};
          const swalFunctions = Array.from(templateContent.querySelectorAll("swal-function-param"));
          swalFunctions.forEach((param) => {
            const paramName = (
              /** @type {keyof SweetAlertOptions} */
              param.getAttribute("name")
            );
            const value = param.getAttribute("value");
            if (!paramName || !value) {
              return;
            }
            result[paramName] = new Function(`return ${value}`)();
          });
          return result;
        };
        const getSwalButtons = (templateContent) => {
          const result = {};
          const swalButtons = Array.from(templateContent.querySelectorAll("swal-button"));
          swalButtons.forEach((button) => {
            showWarningsForAttributes(button, ["type", "color", "aria-label"]);
            const type = button.getAttribute("type");
            if (!type || !["confirm", "cancel", "deny"].includes(type)) {
              return;
            }
            result[`${type}ButtonText`] = button.innerHTML;
            result[`show${capitalizeFirstLetter(type)}Button`] = true;
            const color = button.getAttribute("color");
            if (color !== null) {
              result[`${type}ButtonColor`] = color;
            }
            const ariaLabel = button.getAttribute("aria-label");
            if (ariaLabel !== null) {
              result[`${type}ButtonAriaLabel`] = ariaLabel;
            }
          });
          return result;
        };
        const getSwalImage = (templateContent) => {
          const result = {};
          const image = templateContent.querySelector("swal-image");
          if (image) {
            showWarningsForAttributes(image, ["src", "width", "height", "alt"]);
            const src = image.getAttribute("src");
            if (src !== null)
              result.imageUrl = src || void 0;
            const width = image.getAttribute("width");
            if (width !== null)
              result.imageWidth = width || void 0;
            const height = image.getAttribute("height");
            if (height !== null)
              result.imageHeight = height || void 0;
            const alt = image.getAttribute("alt");
            if (alt !== null)
              result.imageAlt = alt || void 0;
          }
          return result;
        };
        const getSwalIcon = (templateContent) => {
          const result = {};
          const icon = templateContent.querySelector("swal-icon");
          if (icon) {
            showWarningsForAttributes(icon, ["type", "color"]);
            if (icon.hasAttribute("type")) {
              result.icon = icon.getAttribute("type");
            }
            if (icon.hasAttribute("color")) {
              result.iconColor = icon.getAttribute("color");
            }
            result.iconHtml = icon.innerHTML;
          }
          return result;
        };
        const getSwalInput = (templateContent) => {
          const result = {};
          const input = templateContent.querySelector("swal-input");
          if (input) {
            showWarningsForAttributes(input, ["type", "label", "placeholder", "value"]);
            result.input = input.getAttribute("type") || "text";
            if (input.hasAttribute("label")) {
              result.inputLabel = input.getAttribute("label");
            }
            if (input.hasAttribute("placeholder")) {
              result.inputPlaceholder = input.getAttribute("placeholder");
            }
            if (input.hasAttribute("value")) {
              result.inputValue = input.getAttribute("value");
            }
          }
          const inputOptions = Array.from(templateContent.querySelectorAll("swal-input-option"));
          if (inputOptions.length) {
            result.inputOptions = {};
            inputOptions.forEach((option) => {
              showWarningsForAttributes(option, ["value"]);
              const optionValue = option.getAttribute("value");
              if (!optionValue) {
                return;
              }
              const optionName = option.innerHTML;
              result.inputOptions[optionValue] = optionName;
            });
          }
          return result;
        };
        const getSwalStringParams = (templateContent, paramNames) => {
          const result = {};
          for (const i in paramNames) {
            const paramName = paramNames[i];
            const tag = templateContent.querySelector(paramName);
            if (tag) {
              showWarningsForAttributes(tag, []);
              result[paramName.replace(/^swal-/, "")] = tag.innerHTML.trim();
            }
          }
          return result;
        };
        const showWarningsForElements = (templateContent) => {
          const allowedElements = swalStringParams.concat(["swal-param", "swal-function-param", "swal-button", "swal-image", "swal-icon", "swal-input", "swal-input-option"]);
          Array.from(templateContent.children).forEach((el) => {
            const tagName = el.tagName.toLowerCase();
            if (!allowedElements.includes(tagName)) {
              warn(`Unrecognized element <${tagName}>`);
            }
          });
        };
        const showWarningsForAttributes = (el, allowedAttributes) => {
          Array.from(el.attributes).forEach((attribute) => {
            if (allowedAttributes.indexOf(attribute.name) === -1) {
              warn([`Unrecognized attribute "${attribute.name}" on <${el.tagName.toLowerCase()}>.`, `${allowedAttributes.length ? `Allowed attributes are: ${allowedAttributes.join(", ")}` : "To set the value, use HTML within the element."}`]);
            }
          });
        };
        const SHOW_CLASS_TIMEOUT = 10;
        const openPopup = (params) => {
          var _globalState$eventEmi, _globalState$eventEmi2;
          const container = getContainer();
          const popup = getPopup();
          if (!container || !popup) {
            return;
          }
          if (typeof params.willOpen === "function") {
            params.willOpen(popup);
          }
          (_globalState$eventEmi = globalState.eventEmitter) === null || _globalState$eventEmi === void 0 || _globalState$eventEmi.emit("willOpen", popup);
          const bodyStyles = window.getComputedStyle(document.body);
          const initialBodyOverflow = bodyStyles.overflowY;
          addClasses(container, popup, params);
          setTimeout(() => {
            setScrollingVisibility(container, popup);
          }, SHOW_CLASS_TIMEOUT);
          if (isModal()) {
            fixScrollContainer(container, params.scrollbarPadding !== void 0 ? params.scrollbarPadding : false, initialBodyOverflow);
            setAriaHidden();
          }
          if (isIOS && params.backdrop === false && popup.scrollHeight > container.clientHeight) {
            container.style.pointerEvents = "auto";
          }
          if (!isToast() && !globalState.previousActiveElement) {
            globalState.previousActiveElement = document.activeElement;
          }
          if (typeof params.didOpen === "function") {
            const didOpen = params.didOpen;
            setTimeout(() => didOpen(popup));
          }
          (_globalState$eventEmi2 = globalState.eventEmitter) === null || _globalState$eventEmi2 === void 0 || _globalState$eventEmi2.emit("didOpen", popup);
        };
        const swalOpenAnimationFinished = (event) => {
          const popup = getPopup();
          if (!popup || event.target !== popup) {
            return;
          }
          const container = getContainer();
          if (!container) {
            return;
          }
          popup.removeEventListener("animationend", swalOpenAnimationFinished);
          popup.removeEventListener("transitionend", swalOpenAnimationFinished);
          container.style.overflowY = "auto";
          removeClass(container, swalClasses["no-transition"]);
        };
        const setScrollingVisibility = (container, popup) => {
          if (hasCssAnimation(popup)) {
            container.style.overflowY = "hidden";
            popup.addEventListener("animationend", swalOpenAnimationFinished);
            popup.addEventListener("transitionend", swalOpenAnimationFinished);
          } else {
            container.style.overflowY = "auto";
          }
        };
        const fixScrollContainer = (container, scrollbarPadding, initialBodyOverflow) => {
          iOSfix();
          if (scrollbarPadding && initialBodyOverflow !== "hidden") {
            replaceScrollbarWithPadding(initialBodyOverflow);
          }
          setTimeout(() => {
            container.scrollTop = 0;
          });
        };
        const addClasses = (container, popup, params) => {
          var _params$showClass;
          if ((_params$showClass = params.showClass) !== null && _params$showClass !== void 0 && _params$showClass.backdrop) {
            addClass(container, params.showClass.backdrop);
          }
          if (params.animation) {
            popup.style.setProperty("opacity", "0", "important");
            show(popup, "grid");
            setTimeout(() => {
              var _params$showClass2;
              if ((_params$showClass2 = params.showClass) !== null && _params$showClass2 !== void 0 && _params$showClass2.popup) {
                addClass(popup, params.showClass.popup);
              }
              popup.style.removeProperty("opacity");
            }, SHOW_CLASS_TIMEOUT);
          } else {
            show(popup, "grid");
          }
          addClass([document.documentElement, document.body], swalClasses.shown);
          if (params.heightAuto && params.backdrop && !params.toast) {
            addClass([document.documentElement, document.body], swalClasses["height-auto"]);
          }
        };
        var defaultInputValidators = {
          /**
           * @param {string} string
           * @param {string} [validationMessage]
           * @returns {Promise<string | void>}
           */
          email: (string, validationMessage) => {
            return /^[a-zA-Z0-9.+_'-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]+$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || "Invalid email address");
          },
          /**
           * @param {string} string
           * @param {string} [validationMessage]
           * @returns {Promise<string | void>}
           */
          url: (string, validationMessage) => {
            return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || "Invalid URL");
          }
        };
        function setDefaultInputValidators(params) {
          if (params.inputValidator) {
            return;
          }
          if (params.input === "email") {
            params.inputValidator = defaultInputValidators["email"];
          }
          if (params.input === "url") {
            params.inputValidator = defaultInputValidators["url"];
          }
        }
        function validateCustomTargetElement(params) {
          if (!params.target || typeof params.target === "string" && !document.querySelector(params.target) || typeof params.target !== "string" && !params.target.appendChild) {
            warn('Target parameter is not valid, defaulting to "body"');
            params.target = "body";
          }
        }
        function setParameters(params) {
          setDefaultInputValidators(params);
          if (params.showLoaderOnConfirm && !params.preConfirm) {
            warn("showLoaderOnConfirm is set to true, but preConfirm is not defined.\nshowLoaderOnConfirm should be used together with preConfirm, see usage example:\nhttps://sweetalert2.github.io/#ajax-request");
          }
          validateCustomTargetElement(params);
          if (typeof params.title === "string") {
            params.title = params.title.split("\n").join("<br />");
          }
          init(params);
        }
        let currentInstance;
        var _promise = /* @__PURE__ */ new WeakMap();
        class SweetAlert {
          /**
           * @param {...(SweetAlertOptions | string)} args
           * @this {SweetAlert}
           */
          constructor(...args) {
            _classPrivateFieldInitSpec(
              this,
              _promise,
              /** @type {Promise<SweetAlertResult>} */
              Promise.resolve({
                isConfirmed: false,
                isDenied: false,
                isDismissed: true
              })
            );
            if (typeof window === "undefined") {
              return;
            }
            currentInstance = this;
            const outerParams = Object.freeze(this.constructor.argsToParams(args));
            this.params = outerParams;
            this.isAwaitingPromise = false;
            _classPrivateFieldSet2(_promise, this, this._main(currentInstance.params));
          }
          /**
           * @param {any} userParams
           * @param {any} mixinParams
           */
          _main(userParams, mixinParams = {}) {
            showWarningsForParams(Object.assign({}, mixinParams, userParams));
            if (globalState.currentInstance) {
              const swalPromiseResolve = privateMethods.swalPromiseResolve.get(globalState.currentInstance);
              const {
                isAwaitingPromise
              } = globalState.currentInstance;
              globalState.currentInstance._destroy();
              if (!isAwaitingPromise) {
                swalPromiseResolve({
                  isDismissed: true
                });
              }
              if (isModal()) {
                unsetAriaHidden();
              }
            }
            globalState.currentInstance = currentInstance;
            const innerParams = prepareParams(userParams, mixinParams);
            setParameters(innerParams);
            Object.freeze(innerParams);
            if (globalState.timeout) {
              globalState.timeout.stop();
              delete globalState.timeout;
            }
            clearTimeout(globalState.restoreFocusTimeout);
            const domCache = populateDomCache(currentInstance);
            render(currentInstance, innerParams);
            privateProps.innerParams.set(currentInstance, innerParams);
            return swalPromise(currentInstance, domCache, innerParams);
          }
          // `catch` cannot be the name of a module export, so we define our thenable methods here instead
          /**
           * @param {any} onFulfilled
           */
          // oxlint-disable-next-line unicorn/no-thenable
          then(onFulfilled) {
            return _classPrivateFieldGet2(_promise, this).then(onFulfilled);
          }
          /**
           * @param {any} onFinally
           */
          finally(onFinally) {
            return _classPrivateFieldGet2(_promise, this).finally(onFinally);
          }
        }
        const swalPromise = (instance, domCache, innerParams) => {
          return new Promise((resolve, reject) => {
            const dismissWith = (dismiss) => {
              instance.close({
                isDismissed: true,
                dismiss,
                isConfirmed: false,
                isDenied: false
              });
            };
            privateMethods.swalPromiseResolve.set(instance, resolve);
            privateMethods.swalPromiseReject.set(instance, reject);
            domCache.confirmButton.onclick = () => {
              handleConfirmButtonClick(instance);
            };
            domCache.denyButton.onclick = () => {
              handleDenyButtonClick(instance);
            };
            domCache.cancelButton.onclick = () => {
              handleCancelButtonClick(instance, dismissWith);
            };
            domCache.closeButton.onclick = () => {
              dismissWith(DismissReason.close);
            };
            handlePopupClick(innerParams, domCache, dismissWith);
            addKeydownHandler(globalState, innerParams, dismissWith);
            handleInputOptionsAndValue(instance, innerParams);
            openPopup(innerParams);
            setupTimer(globalState, innerParams, dismissWith);
            initFocus(domCache, innerParams);
            setTimeout(() => {
              domCache.container.scrollTop = 0;
            });
          });
        };
        const prepareParams = (userParams, mixinParams) => {
          const templateParams = getTemplateParams(userParams);
          const params = Object.assign({}, defaultParams, mixinParams, templateParams, userParams);
          params.showClass = Object.assign({}, defaultParams.showClass, params.showClass);
          params.hideClass = Object.assign({}, defaultParams.hideClass, params.hideClass);
          if (params.animation === false) {
            params.showClass = {
              backdrop: "swal2-noanimation"
            };
            params.hideClass = {};
          }
          return params;
        };
        const populateDomCache = (instance) => {
          const domCache = (
            /** @type {DomCache} */
            {
              popup: (
                /** @type {HTMLElement} */
                getPopup()
              ),
              container: (
                /** @type {HTMLElement} */
                getContainer()
              ),
              actions: (
                /** @type {HTMLElement} */
                getActions()
              ),
              confirmButton: (
                /** @type {HTMLElement} */
                getConfirmButton()
              ),
              denyButton: (
                /** @type {HTMLElement} */
                getDenyButton()
              ),
              cancelButton: (
                /** @type {HTMLElement} */
                getCancelButton()
              ),
              loader: (
                /** @type {HTMLElement} */
                getLoader()
              ),
              closeButton: (
                /** @type {HTMLElement} */
                getCloseButton()
              ),
              validationMessage: (
                /** @type {HTMLElement} */
                getValidationMessage()
              ),
              progressSteps: (
                /** @type {HTMLElement} */
                getProgressSteps()
              )
            }
          );
          privateProps.domCache.set(instance, domCache);
          return domCache;
        };
        const setupTimer = (globalState2, innerParams, dismissWith) => {
          const timerProgressBar = getTimerProgressBar();
          hide(timerProgressBar);
          if (innerParams.timer) {
            globalState2.timeout = new Timer(() => {
              dismissWith("timer");
              delete globalState2.timeout;
            }, innerParams.timer);
            if (innerParams.timerProgressBar && timerProgressBar) {
              show(timerProgressBar);
              applyCustomClass(timerProgressBar, innerParams, "timerProgressBar");
              setTimeout(() => {
                if (globalState2.timeout && globalState2.timeout.running) {
                  animateTimerProgressBar(
                    /** @type {number} */
                    innerParams.timer
                  );
                }
              });
            }
          }
        };
        const initFocus = (domCache, innerParams) => {
          if (innerParams.toast) {
            return;
          }
          if (!callIfFunction(innerParams.allowEnterKey)) {
            warnAboutDeprecation("allowEnterKey", "preConfirm: () => false");
            domCache.popup.focus();
            return;
          }
          if (focusAutofocus(domCache)) {
            return;
          }
          if (focusButton(domCache, innerParams)) {
            return;
          }
          setFocus(-1, 1);
        };
        const focusAutofocus = (domCache) => {
          const autofocusElements = Array.from(domCache.popup.querySelectorAll("[autofocus]"));
          for (const autofocusElement of autofocusElements) {
            if (autofocusElement instanceof HTMLElement && isVisible$1(autofocusElement)) {
              autofocusElement.focus();
              return true;
            }
          }
          return false;
        };
        const focusButton = (domCache, innerParams) => {
          if (innerParams.focusDeny && isVisible$1(domCache.denyButton)) {
            domCache.denyButton.focus();
            return true;
          }
          if (innerParams.focusCancel && isVisible$1(domCache.cancelButton)) {
            domCache.cancelButton.focus();
            return true;
          }
          if (innerParams.focusConfirm && isVisible$1(domCache.confirmButton)) {
            domCache.confirmButton.focus();
            return true;
          }
          return false;
        };
        SweetAlert.prototype.disableButtons = disableButtons;
        SweetAlert.prototype.enableButtons = enableButtons;
        SweetAlert.prototype.getInput = getInput;
        SweetAlert.prototype.disableInput = disableInput;
        SweetAlert.prototype.enableInput = enableInput;
        SweetAlert.prototype.hideLoading = hideLoading;
        SweetAlert.prototype.disableLoading = hideLoading;
        SweetAlert.prototype.showValidationMessage = showValidationMessage;
        SweetAlert.prototype.resetValidationMessage = resetValidationMessage;
        SweetAlert.prototype.close = close;
        SweetAlert.prototype.closePopup = close;
        SweetAlert.prototype.closeModal = close;
        SweetAlert.prototype.closeToast = close;
        SweetAlert.prototype.rejectPromise = rejectPromise;
        SweetAlert.prototype.update = update;
        SweetAlert.prototype._destroy = _destroy;
        Object.assign(SweetAlert, staticMethods);
        Object.keys(instanceMethods).forEach((key) => {
          SweetAlert[key] = function(...args) {
            if (currentInstance && currentInstance[key]) {
              return currentInstance[key](...args);
            }
            return void 0;
          };
        });
        SweetAlert.DismissReason = DismissReason;
        SweetAlert.version = "11.26.25";
        const Swal6 = SweetAlert;
        Swal6.default = Swal6;
        return Swal6;
      });
      if (typeof exports !== "undefined" && exports.Sweetalert2) {
        exports.swal = exports.sweetAlert = exports.Swal = exports.SweetAlert = exports.Sweetalert2;
      }
      "undefined" != typeof document && function(e, t) {
        var n = e.createElement("style");
        if (e.getElementsByTagName("head")[0].appendChild(n), n.styleSheet)
          n.styleSheet.disabled || (n.styleSheet.cssText = t);
        else
          try {
            n.innerHTML = t;
          } catch (e2) {
            n.innerText = t;
          }
      }(document, ':root{--swal2-outline: 0 0 0 3px rgba(100, 150, 200, 0.5);--swal2-container-padding: 0.625em;--swal2-backdrop: rgba(0, 0, 0, 0.4);--swal2-backdrop-transition: background-color 0.15s;--swal2-width: 32em;--swal2-padding: 0 0 1.25em;--swal2-border: none;--swal2-border-radius: 0.3125rem;--swal2-background: white;--swal2-color: #545454;--swal2-show-animation: swal2-show 0.3s;--swal2-hide-animation: swal2-hide 0.15s forwards;--swal2-icon-zoom: 1;--swal2-title-padding: 0.8em 1em 0;--swal2-html-container-padding: 1em 1.6em 0.3em;--swal2-input-border: 1px solid #d9d9d9;--swal2-input-border-radius: 0.1875em;--swal2-input-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.06), 0 0 0 3px transparent;--swal2-input-background: transparent;--swal2-input-transition: border-color 0.2s, box-shadow 0.2s;--swal2-input-hover-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.06), 0 0 0 3px transparent;--swal2-input-focus-border: 1px solid #b4dbed;--swal2-input-focus-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.06), 0 0 0 3px rgba(100, 150, 200, 0.5);--swal2-progress-step-background: #add8e6;--swal2-validation-message-background: #f0f0f0;--swal2-validation-message-color: #666;--swal2-footer-border-color: #eee;--swal2-footer-background: transparent;--swal2-footer-color: inherit;--swal2-timer-progress-bar-background: rgba(0, 0, 0, 0.3);--swal2-close-button-position: initial;--swal2-close-button-inset: auto;--swal2-close-button-font-size: 2.5em;--swal2-close-button-color: #ccc;--swal2-close-button-transition: color 0.2s, box-shadow 0.2s;--swal2-close-button-outline: initial;--swal2-close-button-box-shadow: inset 0 0 0 3px transparent;--swal2-close-button-focus-box-shadow: inset var(--swal2-outline);--swal2-close-button-hover-transform: none;--swal2-actions-justify-content: center;--swal2-actions-width: auto;--swal2-actions-margin: 1.25em auto 0;--swal2-actions-padding: 0;--swal2-actions-border-radius: 0;--swal2-actions-background: transparent;--swal2-action-button-transition: background-color 0.2s, box-shadow 0.2s;--swal2-action-button-hover: black 10%;--swal2-action-button-active: black 10%;--swal2-confirm-button-box-shadow: none;--swal2-confirm-button-border-radius: 0.25em;--swal2-confirm-button-background-color: #7066e0;--swal2-confirm-button-color: #fff;--swal2-deny-button-box-shadow: none;--swal2-deny-button-border-radius: 0.25em;--swal2-deny-button-background-color: #dc3741;--swal2-deny-button-color: #fff;--swal2-cancel-button-box-shadow: none;--swal2-cancel-button-border-radius: 0.25em;--swal2-cancel-button-background-color: #6e7881;--swal2-cancel-button-color: #fff;--swal2-toast-show-animation: swal2-toast-show 0.5s;--swal2-toast-hide-animation: swal2-toast-hide 0.1s forwards;--swal2-toast-border: none;--swal2-toast-box-shadow: 0 0 1px hsl(0deg 0% 0% / 0.075), 0 1px 2px hsl(0deg 0% 0% / 0.075), 1px 2px 4px hsl(0deg 0% 0% / 0.075), 1px 3px 8px hsl(0deg 0% 0% / 0.075), 2px 4px 16px hsl(0deg 0% 0% / 0.075)}[data-swal2-theme=dark]{--swal2-dark-theme-black: #19191a;--swal2-dark-theme-white: #e1e1e1;--swal2-background: var(--swal2-dark-theme-black);--swal2-color: var(--swal2-dark-theme-white);--swal2-footer-border-color: #555;--swal2-input-background: color-mix(in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10%);--swal2-validation-message-background: color-mix( in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10% );--swal2-validation-message-color: var(--swal2-dark-theme-white);--swal2-timer-progress-bar-background: rgba(255, 255, 255, 0.7)}@media(prefers-color-scheme: dark){[data-swal2-theme=auto]{--swal2-dark-theme-black: #19191a;--swal2-dark-theme-white: #e1e1e1;--swal2-background: var(--swal2-dark-theme-black);--swal2-color: var(--swal2-dark-theme-white);--swal2-footer-border-color: #555;--swal2-input-background: color-mix(in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10%);--swal2-validation-message-background: color-mix( in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10% );--swal2-validation-message-color: var(--swal2-dark-theme-white);--swal2-timer-progress-bar-background: rgba(255, 255, 255, 0.7)}}body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:auto !important}body.swal2-no-backdrop .swal2-container{background-color:rgba(0,0,0,0) !important;pointer-events:none}body.swal2-no-backdrop .swal2-container .swal2-popup{pointer-events:auto}body.swal2-no-backdrop .swal2-container .swal2-modal{box-shadow:0 0 10px var(--swal2-backdrop)}body.swal2-toast-shown .swal2-container{box-sizing:border-box;width:360px;max-width:100%;background-color:rgba(0,0,0,0);pointer-events:none}body.swal2-toast-shown .swal2-container.swal2-top{inset:0 auto auto 50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{inset:0 0 auto auto}body.swal2-toast-shown .swal2-container.swal2-top-start,body.swal2-toast-shown .swal2-container.swal2-top-left{inset:0 auto auto 0}body.swal2-toast-shown .swal2-container.swal2-center-start,body.swal2-toast-shown .swal2-container.swal2-center-left{inset:50% auto auto 0;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{inset:50% auto auto 50%;transform:translate(-50%, -50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{inset:50% 0 auto auto;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-start,body.swal2-toast-shown .swal2-container.swal2-bottom-left{inset:auto auto 0 0}body.swal2-toast-shown .swal2-container.swal2-bottom{inset:auto auto 0 50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{inset:auto 0 0 auto}@media print{body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown){overflow-y:scroll !important}body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown) .swal2-container{position:static !important}}div:where(.swal2-container){display:grid;position:fixed;z-index:1060;inset:0;box-sizing:border-box;grid-template-areas:"top-start     top            top-end" "center-start  center         center-end" "bottom-start  bottom-center  bottom-end";grid-template-rows:minmax(min-content, auto) minmax(min-content, auto) minmax(min-content, auto);height:100%;padding:var(--swal2-container-padding);overflow-x:hidden;transition:var(--swal2-backdrop-transition);-webkit-overflow-scrolling:touch}div:where(.swal2-container).swal2-backdrop-show,div:where(.swal2-container).swal2-noanimation{background:var(--swal2-backdrop)}div:where(.swal2-container).swal2-backdrop-hide{background:rgba(0,0,0,0) !important}div:where(.swal2-container).swal2-top-start,div:where(.swal2-container).swal2-center-start,div:where(.swal2-container).swal2-bottom-start{grid-template-columns:minmax(0, 1fr) auto auto}div:where(.swal2-container).swal2-top,div:where(.swal2-container).swal2-center,div:where(.swal2-container).swal2-bottom{grid-template-columns:auto minmax(0, 1fr) auto}div:where(.swal2-container).swal2-top-end,div:where(.swal2-container).swal2-center-end,div:where(.swal2-container).swal2-bottom-end{grid-template-columns:auto auto minmax(0, 1fr)}div:where(.swal2-container).swal2-top-start>.swal2-popup{align-self:start}div:where(.swal2-container).swal2-top>.swal2-popup{grid-column:2;place-self:start center}div:where(.swal2-container).swal2-top-end>.swal2-popup,div:where(.swal2-container).swal2-top-right>.swal2-popup{grid-column:3;place-self:start end}div:where(.swal2-container).swal2-center-start>.swal2-popup,div:where(.swal2-container).swal2-center-left>.swal2-popup{grid-row:2;align-self:center}div:where(.swal2-container).swal2-center>.swal2-popup{grid-column:2;grid-row:2;place-self:center center}div:where(.swal2-container).swal2-center-end>.swal2-popup,div:where(.swal2-container).swal2-center-right>.swal2-popup{grid-column:3;grid-row:2;place-self:center end}div:where(.swal2-container).swal2-bottom-start>.swal2-popup,div:where(.swal2-container).swal2-bottom-left>.swal2-popup{grid-column:1;grid-row:3;align-self:end}div:where(.swal2-container).swal2-bottom>.swal2-popup{grid-column:2;grid-row:3;place-self:end center}div:where(.swal2-container).swal2-bottom-end>.swal2-popup,div:where(.swal2-container).swal2-bottom-right>.swal2-popup{grid-column:3;grid-row:3;place-self:end end}div:where(.swal2-container).swal2-grow-row>.swal2-popup,div:where(.swal2-container).swal2-grow-fullscreen>.swal2-popup{grid-column:1/4;width:100%}div:where(.swal2-container).swal2-grow-column>.swal2-popup,div:where(.swal2-container).swal2-grow-fullscreen>.swal2-popup{grid-row:1/4;align-self:stretch}div:where(.swal2-container).swal2-no-transition{transition:none !important}div:where(.swal2-container)[popover]{width:auto;border:0}div:where(.swal2-container) div:where(.swal2-popup){display:none;position:relative;box-sizing:border-box;grid-template-columns:minmax(0, 100%);width:var(--swal2-width);max-width:100%;padding:var(--swal2-padding);border:var(--swal2-border);border-radius:var(--swal2-border-radius);background:var(--swal2-background);color:var(--swal2-color);font-family:inherit;font-size:1rem}div:where(.swal2-container) div:where(.swal2-popup):focus{outline:none}div:where(.swal2-container) div:where(.swal2-popup).swal2-loading{overflow-y:hidden}div:where(.swal2-container) div:where(.swal2-popup).swal2-draggable{cursor:grab}div:where(.swal2-container) div:where(.swal2-popup).swal2-draggable div:where(.swal2-icon){cursor:grab}div:where(.swal2-container) div:where(.swal2-popup).swal2-dragging{cursor:grabbing}div:where(.swal2-container) div:where(.swal2-popup).swal2-dragging div:where(.swal2-icon){cursor:grabbing}div:where(.swal2-container) h2:where(.swal2-title){position:relative;max-width:100%;margin:0;padding:var(--swal2-title-padding);color:inherit;font-size:1.875em;font-weight:600;text-align:center;text-transform:none;overflow-wrap:break-word;cursor:initial}div:where(.swal2-container) div:where(.swal2-actions){display:flex;z-index:1;box-sizing:border-box;flex-wrap:wrap;align-items:center;justify-content:var(--swal2-actions-justify-content);width:var(--swal2-actions-width);margin:var(--swal2-actions-margin);padding:var(--swal2-actions-padding);border-radius:var(--swal2-actions-border-radius);background:var(--swal2-actions-background)}div:where(.swal2-container) div:where(.swal2-loader){display:none;align-items:center;justify-content:center;width:2.2em;height:2.2em;margin:0 1.875em;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border-width:.25em;border-style:solid;border-radius:100%;border-color:#2778c4 rgba(0,0,0,0) #2778c4 rgba(0,0,0,0)}div:where(.swal2-container) button:where(.swal2-styled){margin:.3125em;padding:.625em 1.1em;transition:var(--swal2-action-button-transition);border:none;box-shadow:0 0 0 3px rgba(0,0,0,0);font-weight:500}div:where(.swal2-container) button:where(.swal2-styled):not([disabled]){cursor:pointer}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-confirm){border-radius:var(--swal2-confirm-button-border-radius);background:initial;background-color:var(--swal2-confirm-button-background-color);box-shadow:var(--swal2-confirm-button-box-shadow);color:var(--swal2-confirm-button-color);font-size:1em}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-confirm):hover{background-color:color-mix(in srgb, var(--swal2-confirm-button-background-color), var(--swal2-action-button-hover))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-confirm):active{background-color:color-mix(in srgb, var(--swal2-confirm-button-background-color), var(--swal2-action-button-active))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-deny){border-radius:var(--swal2-deny-button-border-radius);background:initial;background-color:var(--swal2-deny-button-background-color);box-shadow:var(--swal2-deny-button-box-shadow);color:var(--swal2-deny-button-color);font-size:1em}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-deny):hover{background-color:color-mix(in srgb, var(--swal2-deny-button-background-color), var(--swal2-action-button-hover))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-deny):active{background-color:color-mix(in srgb, var(--swal2-deny-button-background-color), var(--swal2-action-button-active))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-cancel){border-radius:var(--swal2-cancel-button-border-radius);background:initial;background-color:var(--swal2-cancel-button-background-color);box-shadow:var(--swal2-cancel-button-box-shadow);color:var(--swal2-cancel-button-color);font-size:1em}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-cancel):hover{background-color:color-mix(in srgb, var(--swal2-cancel-button-background-color), var(--swal2-action-button-hover))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-cancel):active{background-color:color-mix(in srgb, var(--swal2-cancel-button-background-color), var(--swal2-action-button-active))}div:where(.swal2-container) button:where(.swal2-styled):focus-visible{outline:none;box-shadow:var(--swal2-action-button-focus-box-shadow)}div:where(.swal2-container) button:where(.swal2-styled)[disabled]:not(.swal2-loading){opacity:.4}div:where(.swal2-container) button:where(.swal2-styled)::-moz-focus-inner{border:0}div:where(.swal2-container) div:where(.swal2-footer){margin:1em 0 0;padding:1em 1em 0;border-top:1px solid var(--swal2-footer-border-color);background:var(--swal2-footer-background);color:var(--swal2-footer-color);font-size:1em;text-align:center;cursor:initial}div:where(.swal2-container) .swal2-timer-progress-bar-container{position:absolute;right:0;bottom:0;left:0;grid-column:auto !important;overflow:hidden;border-bottom-right-radius:var(--swal2-border-radius);border-bottom-left-radius:var(--swal2-border-radius)}div:where(.swal2-container) div:where(.swal2-timer-progress-bar){width:100%;height:.25em;background:var(--swal2-timer-progress-bar-background)}div:where(.swal2-container) img:where(.swal2-image){max-width:100%;margin:2em auto 1em;cursor:initial}div:where(.swal2-container) button:where(.swal2-close){position:var(--swal2-close-button-position);inset:var(--swal2-close-button-inset);z-index:2;align-items:center;justify-content:center;width:1.2em;height:1.2em;margin-top:0;margin-right:0;margin-bottom:-1.2em;padding:0;overflow:hidden;transition:var(--swal2-close-button-transition);border:none;border-radius:var(--swal2-border-radius);outline:var(--swal2-close-button-outline);background:rgba(0,0,0,0);color:var(--swal2-close-button-color);font-family:monospace;font-size:var(--swal2-close-button-font-size);cursor:pointer;justify-self:end}div:where(.swal2-container) button:where(.swal2-close):hover{transform:var(--swal2-close-button-hover-transform);background:rgba(0,0,0,0);color:#f27474}div:where(.swal2-container) button:where(.swal2-close):focus-visible{outline:none;box-shadow:var(--swal2-close-button-focus-box-shadow)}div:where(.swal2-container) button:where(.swal2-close)::-moz-focus-inner{border:0}div:where(.swal2-container) div:where(.swal2-html-container){z-index:1;justify-content:center;margin:0;padding:var(--swal2-html-container-padding);overflow:auto;color:inherit;font-size:1.125em;font-weight:normal;line-height:normal;text-align:center;overflow-wrap:break-word;word-break:break-word;cursor:initial}div:where(.swal2-container) input:where(.swal2-input),div:where(.swal2-container) input:where(.swal2-file),div:where(.swal2-container) textarea:where(.swal2-textarea),div:where(.swal2-container) select:where(.swal2-select),div:where(.swal2-container) div:where(.swal2-radio),div:where(.swal2-container) label:where(.swal2-checkbox){margin:1em 2em 3px}div:where(.swal2-container) input:where(.swal2-input),div:where(.swal2-container) input:where(.swal2-file),div:where(.swal2-container) textarea:where(.swal2-textarea){box-sizing:border-box;width:auto;transition:var(--swal2-input-transition);border:var(--swal2-input-border);border-radius:var(--swal2-input-border-radius);background:var(--swal2-input-background);box-shadow:var(--swal2-input-box-shadow);color:inherit;font-size:1.125em}div:where(.swal2-container) input:where(.swal2-input).swal2-inputerror,div:where(.swal2-container) input:where(.swal2-file).swal2-inputerror,div:where(.swal2-container) textarea:where(.swal2-textarea).swal2-inputerror{border-color:#f27474 !important;box-shadow:0 0 2px #f27474 !important}div:where(.swal2-container) input:where(.swal2-input):hover,div:where(.swal2-container) input:where(.swal2-file):hover,div:where(.swal2-container) textarea:where(.swal2-textarea):hover{box-shadow:var(--swal2-input-hover-box-shadow)}div:where(.swal2-container) input:where(.swal2-input):focus,div:where(.swal2-container) input:where(.swal2-file):focus,div:where(.swal2-container) textarea:where(.swal2-textarea):focus{border:var(--swal2-input-focus-border);outline:none;box-shadow:var(--swal2-input-focus-box-shadow)}div:where(.swal2-container) input:where(.swal2-input)::placeholder,div:where(.swal2-container) input:where(.swal2-file)::placeholder,div:where(.swal2-container) textarea:where(.swal2-textarea)::placeholder{color:#ccc}div:where(.swal2-container) .swal2-range{margin:1em 2em 3px;background:var(--swal2-background)}div:where(.swal2-container) .swal2-range input{width:80%}div:where(.swal2-container) .swal2-range output{width:20%;color:inherit;font-weight:600;text-align:center}div:where(.swal2-container) .swal2-range input,div:where(.swal2-container) .swal2-range output{height:2.625em;padding:0;font-size:1.125em;line-height:2.625em}div:where(.swal2-container) .swal2-input{height:2.625em;padding:0 .75em}div:where(.swal2-container) .swal2-file{width:75%;margin-right:auto;margin-left:auto;background:var(--swal2-input-background);font-size:1.125em}div:where(.swal2-container) .swal2-textarea{height:6.75em;padding:.75em}div:where(.swal2-container) .swal2-select{min-width:50%;max-width:100%;padding:.375em .625em;background:var(--swal2-input-background);color:inherit;font-size:1.125em}div:where(.swal2-container) .swal2-radio,div:where(.swal2-container) .swal2-checkbox{align-items:center;justify-content:center;background:var(--swal2-background);color:inherit}div:where(.swal2-container) .swal2-radio label,div:where(.swal2-container) .swal2-checkbox label{margin:0 .6em;font-size:1.125em}div:where(.swal2-container) .swal2-radio input,div:where(.swal2-container) .swal2-checkbox input{flex-shrink:0;margin:0 .4em}div:where(.swal2-container) label:where(.swal2-input-label){display:flex;justify-content:center;margin:1em auto 0}div:where(.swal2-container) div:where(.swal2-validation-message){align-items:center;justify-content:center;margin:1em 0 0;padding:.625em;overflow:hidden;background:var(--swal2-validation-message-background);color:var(--swal2-validation-message-color);font-size:1em;font-weight:300}div:where(.swal2-container) div:where(.swal2-validation-message)::before{content:"!";display:inline-block;width:1.5em;min-width:1.5em;height:1.5em;margin:0 .625em;border-radius:50%;background-color:#f27474;color:#fff;font-weight:600;line-height:1.5em;text-align:center}div:where(.swal2-container) .swal2-progress-steps{flex-wrap:wrap;align-items:center;max-width:100%;margin:1.25em auto;padding:0;background:rgba(0,0,0,0);font-weight:600}div:where(.swal2-container) .swal2-progress-steps li{display:inline-block;position:relative}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step{z-index:20;flex-shrink:0;width:2em;height:2em;border-radius:2em;background:#2778c4;color:#fff;line-height:2em;text-align:center}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:#2778c4}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step{background:var(--swal2-progress-step-background);color:#fff}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step-line{background:var(--swal2-progress-step-background)}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step-line{z-index:10;flex-shrink:0;width:2.5em;height:.4em;margin:0 -1px;background:#2778c4}div:where(.swal2-icon){position:relative;box-sizing:content-box;justify-content:center;width:5em;height:5em;margin:2.5em auto .6em;zoom:var(--swal2-icon-zoom);border:.25em solid rgba(0,0,0,0);border-radius:50%;border-color:#000;font-family:inherit;line-height:5em;cursor:default;user-select:none}div:where(.swal2-icon) .swal2-icon-content{display:flex;align-items:center;font-size:3.75em}div:where(.swal2-icon).swal2-error{border-color:#f27474;color:#f27474}div:where(.swal2-icon).swal2-error .swal2-x-mark{position:relative;flex-grow:1}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line]{display:block;position:absolute;top:2.3125em;width:2.9375em;height:.3125em;border-radius:.125em;background-color:#f27474}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;transform:rotate(45deg)}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-error.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-error.swal2-icon-show .swal2-x-mark{animation:swal2-animate-error-x-mark .5s}div:where(.swal2-icon).swal2-warning{border-color:#f8bb86;color:#f8bb86}div:where(.swal2-icon).swal2-warning.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-warning.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .5s}div:where(.swal2-icon).swal2-info{border-color:#3fc3ee;color:#3fc3ee}div:where(.swal2-icon).swal2-info.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-info.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .8s}div:where(.swal2-icon).swal2-question{border-color:#87adbd;color:#87adbd}div:where(.swal2-icon).swal2-question.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-question.swal2-icon-show .swal2-icon-content{animation:swal2-animate-question-mark .8s}div:where(.swal2-icon).swal2-success{border-color:#a5dc86;color:#a5dc86}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line]{position:absolute;width:3.75em;height:7.5em;border-radius:50%}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.4375em;left:-2.0635em;transform:rotate(-45deg);transform-origin:3.75em 3.75em;border-radius:7.5em 0 0 7.5em}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.6875em;left:1.875em;transform:rotate(-45deg);transform-origin:0 3.75em;border-radius:0 7.5em 7.5em 0}div:where(.swal2-icon).swal2-success .swal2-success-ring{position:absolute;z-index:2;top:-0.25em;left:-0.25em;box-sizing:content-box;width:100%;height:100%;border:.25em solid rgba(165,220,134,.3);border-radius:50%}div:where(.swal2-icon).swal2-success .swal2-success-fix{position:absolute;z-index:1;top:.5em;left:1.625em;width:.4375em;height:5.625em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-success [class^=swal2-success-line]{display:block;position:absolute;z-index:2;height:.3125em;border-radius:.125em;background-color:#a5dc86}div:where(.swal2-icon).swal2-success [class^=swal2-success-line][class$=tip]{top:2.875em;left:.8125em;width:1.5625em;transform:rotate(45deg)}div:where(.swal2-icon).swal2-success [class^=swal2-success-line][class$=long]{top:2.375em;right:.5em;width:2.9375em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-animate-success-line-tip .75s}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-animate-success-line-long .75s}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-circular-line-right{animation:swal2-rotate-success-circular-line 4.25s ease-in}[class^=swal2]{-webkit-tap-highlight-color:rgba(0,0,0,0)}.swal2-show{animation:var(--swal2-show-animation)}.swal2-hide{animation:var(--swal2-hide-animation)}.swal2-noanimation{transition:none}.swal2-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}.swal2-rtl .swal2-close{margin-right:initial;margin-left:0}.swal2-rtl .swal2-timer-progress-bar{right:0;left:auto}.swal2-toast{box-sizing:border-box;grid-column:1/4 !important;grid-row:1/4 !important;grid-template-columns:min-content auto min-content;padding:1em;overflow-y:hidden;border:var(--swal2-toast-border);background:var(--swal2-background);box-shadow:var(--swal2-toast-box-shadow);pointer-events:auto}.swal2-toast>*{grid-column:2}.swal2-toast h2:where(.swal2-title){margin:.5em 1em;padding:0;font-size:1em;text-align:initial}.swal2-toast .swal2-loading{justify-content:center}.swal2-toast input:where(.swal2-input){height:2em;margin:.5em;font-size:1em}.swal2-toast .swal2-validation-message{font-size:1em}.swal2-toast div:where(.swal2-footer){margin:.5em 0 0;padding:.5em 0 0;font-size:.8em}.swal2-toast button:where(.swal2-close){grid-column:3/3;grid-row:1/99;align-self:center;width:.8em;height:.8em;margin:0;font-size:2em}.swal2-toast div:where(.swal2-html-container){margin:.5em 1em;padding:0;overflow:initial;font-size:1em;text-align:initial}.swal2-toast div:where(.swal2-html-container):empty{padding:0}.swal2-toast .swal2-loader{grid-column:1;grid-row:1/99;align-self:center;width:2em;height:2em;margin:.25em}.swal2-toast .swal2-icon{grid-column:1;grid-row:1/99;align-self:center;width:2em;min-width:2em;height:2em;margin:0 .5em 0 0}.swal2-toast .swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:1.8em;font-weight:bold}.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-toast div:where(.swal2-actions){justify-content:flex-start;height:auto;margin:0;margin-top:.5em;padding:0 .5em}.swal2-toast button:where(.swal2-styled){margin:.25em .5em;padding:.4em .6em;font-size:1em}.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-toast .swal2-success [class^=swal2-success-circular-line]{position:absolute;width:1.6em;height:3em;border-radius:50%}.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.8em;left:-0.5em;transform:rotate(-45deg);transform-origin:2em 2em;border-radius:4em 0 0 4em}.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.25em;left:.9375em;transform-origin:0 1.5em;border-radius:0 4em 4em 0}.swal2-toast .swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-toast .swal2-success .swal2-success-fix{top:0;left:.4375em;width:.4375em;height:2.6875em}.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{top:1.125em;left:.1875em;width:.75em}.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{top:.9375em;right:.1875em;width:1.375em}.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-toast-animate-success-line-tip .75s}.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-toast-animate-success-line-long .75s}.swal2-toast.swal2-show{animation:var(--swal2-toast-show-animation)}.swal2-toast.swal2-hide{animation:var(--swal2-toast-hide-animation)}@keyframes swal2-show{0%{transform:translate3d(0, -50px, 0) scale(0.9);opacity:0}100%{transform:translate3d(0, 0, 0) scale(1);opacity:1}}@keyframes swal2-hide{0%{transform:translate3d(0, 0, 0) scale(1);opacity:1}100%{transform:translate3d(0, -50px, 0) scale(0.9);opacity:0}}@keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-0.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(0.4);opacity:0}50%{margin-top:1.625em;transform:scale(0.4);opacity:0}80%{margin-top:-0.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0deg);opacity:1}}@keyframes swal2-rotate-loading{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes swal2-animate-question-mark{0%{transform:rotateY(-360deg)}100%{transform:rotateY(0)}}@keyframes swal2-animate-i-mark{0%{transform:rotateZ(45deg);opacity:0}25%{transform:rotateZ(-25deg);opacity:.4}50%{transform:rotateZ(15deg);opacity:.8}75%{transform:rotateZ(-5deg);opacity:1}100%{transform:rotateX(0);opacity:1}}@keyframes swal2-toast-show{0%{transform:translateY(-0.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(0.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0deg)}}@keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-0.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}');
    }
  });

  // node_modules/react-icons/lib/esm/iconBase.js
  var import_react2 = __toESM(require_react());

  // node_modules/react-icons/lib/esm/iconContext.js
  var import_react = __toESM(require_react());
  var DefaultContext = {
    color: void 0,
    size: void 0,
    className: void 0,
    style: void 0,
    attr: void 0
  };
  var IconContext = import_react.default.createContext && import_react.default.createContext(DefaultContext);

  // node_modules/react-icons/lib/esm/iconBase.js
  var __assign = function() {
    __assign = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };
  var __rest = function(s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  };
  function Tree2Element(tree) {
    return tree && tree.map(function(node, i) {
      return import_react2.default.createElement(node.tag, __assign({
        key: i
      }, node.attr), Tree2Element(node.child));
    });
  }
  function GenIcon(data) {
    return function(props) {
      return import_react2.default.createElement(IconBase, __assign({
        attr: __assign({}, data.attr)
      }, props), Tree2Element(data.child));
    };
  }
  function IconBase(props) {
    var elem = function(conf) {
      var attr = props.attr, size = props.size, title = props.title, svgProps = __rest(props, ["attr", "size", "title"]);
      var computedSize = size || conf.size || "1em";
      var className;
      if (conf.className)
        className = conf.className;
      if (props.className)
        className = (className ? className + " " : "") + props.className;
      return import_react2.default.createElement("svg", __assign({
        stroke: "currentColor",
        fill: "currentColor",
        strokeWidth: "0"
      }, conf.attr, attr, svgProps, {
        className,
        style: __assign(__assign({
          color: props.color || conf.color
        }, conf.style), props.style),
        height: computedSize,
        width: computedSize,
        xmlns: "http://www.w3.org/2000/svg"
      }), title && import_react2.default.createElement("title", null, title), props.children);
    };
    return IconContext !== void 0 ? import_react2.default.createElement(IconContext.Consumer, null, function(conf) {
      return elem(conf);
    }) : elem(DefaultContext);
  }

  // node_modules/react-icons/md/index.esm.js
  function MdDelete(props) {
    return GenIcon({ "tag": "svg", "attr": { "viewBox": "0 0 24 24" }, "child": [{ "tag": "path", "attr": { "fill": "none", "d": "M0 0h24v24H0z" } }, { "tag": "path", "attr": { "d": "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" } }] })(props);
  }
  function MdSettings(props) {
    return GenIcon({ "tag": "svg", "attr": { "viewBox": "0 0 24 24" }, "child": [{ "tag": "path", "attr": { "fill": "none", "d": "M0 0h24v24H0V0z" } }, { "tag": "path", "attr": { "d": "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" } }] })(props);
  }
  function MdAdd(props) {
    return GenIcon({ "tag": "svg", "attr": { "viewBox": "0 0 24 24" }, "child": [{ "tag": "path", "attr": { "fill": "none", "d": "M0 0h24v24H0z" } }, { "tag": "path", "attr": { "d": "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" } }] })(props);
  }
  function MdSelectAll(props) {
    return GenIcon({ "tag": "svg", "attr": { "viewBox": "0 0 24 24" }, "child": [{ "tag": "path", "attr": { "fill": "none", "d": "M0 0h24v24H0z" } }, { "tag": "path", "attr": { "d": "M3 5h2V3c-1.1 0-2 .9-2 2zm0 8h2v-2H3v2zm4 8h2v-2H7v2zM3 9h2V7H3v2zm10-6h-2v2h2V3zm6 0v2h2c0-1.1-.9-2-2-2zM5 21v-2H3c0 1.1.9 2 2 2zm-2-4h2v-2H3v2zM9 3H7v2h2V3zm2 18h2v-2h-2v2zm8-8h2v-2h-2v2zm0 8c1.1 0 2-.9 2-2h-2v2zm0-12h2V7h-2v2zm0 8h2v-2h-2v2zm-4 4h2v-2h-2v2zm0-16h2V3h-2v2zM7 17h10V7H7v10zm2-8h6v6H9V9z" } }] })(props);
  }
  function MdDesktopWindows(props) {
    return GenIcon({ "tag": "svg", "attr": { "viewBox": "0 0 24 24" }, "child": [{ "tag": "path", "attr": { "fill": "none", "d": "M0 0h24v24H0z" } }, { "tag": "path", "attr": { "d": "M20 3H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h6v2H8v2h8v-2h-2v-2h6c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2" } }] })(props);
  }

  // src/errors.ts
  var NotImplementedError = class extends Error {
    constructor(message, options) {
      super(message, options);
    }
  };

  // src/background/background.ts
  function makeId(length) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  var BaseBackground = class {
    async onConfig() {
      return;
    }
    current = false;
    id = makeId(12);
    static attributes = [];
    static backgroundTypeName;
    async previewBackground() {
      throw new NotImplementedError(
        "Method previewBackground is not implemented"
      );
    }
    async backgroundElement() {
      throw new NotImplementedError(
        "Method backgroundElement is not implemented"
      );
    }
    static default() {
      throw new NotImplementedError("Method default is not implemented");
    }
    static async askAndCreate() {
      throw new NotImplementedError("Method create is not implemented");
    }
    hooks__onBeforeAddBackground(newBG) {
    }
    hooks__onBeforeRemoveBackground(removedBG) {
    }
  };

  // src/background/cssBackground.tsx
  var import_sweetalert2 = __toESM(require_sweetalert2_all());
  var CSSBackground = class _CSSBackground extends BaseBackground {
    static backgroundTypeName = "CSS";
    constructor(css) {
      super();
      this.css = css;
    }
    css;
    async backgroundElement() {
      return /* @__PURE__ */ h("div", { className: "BGE-cssBackground", style: { background: this.css } });
    }
    async previewBackground() {
      return () => /* @__PURE__ */ h("div", { style: { background: this.css } });
    }
    static default() {
      return new _CSSBackground("gray");
    }
    static async askAndCreate() {
      const result = await import_sweetalert2.default.fire({
        title: "\u521B\u5EFA\u4E00\u4E2ACSS\u80CC\u666F",
        text: "\u4F60\u53EF\u4EE5\u5728\u6B64\u5199\u5165\u4EFB\u4F55\u53EF\u4EE5\u4F5C\u4E3A background \u503C\u7684\u5B57\u7B26\u4E32\u3002\u5B83\u5C06\u88AB\u4F5C\u4E3A\u80CC\u666F\u4F7F\u7528\u3002",
        input: "text"
      });
      if (result.value)
        return new _CSSBackground(result.value);
      else
        return null;
    }
  };

  // src/hooks.ts
  function useLocalStorage(key, initialValue, parse = JSON.parse, stringify = JSON.stringify) {
    const [storedValue, setStoredValue] = React.useState(() => {
      try {
        const storage = window.localStorage;
        const item = storage.getItem(key);
        if (item === null)
          return initialValue;
        try {
          return parse(item);
        } catch (error) {
          const backupKey = key + ".invalid-backup";
          if (storage.getItem(backupKey) === null)
            storage.setItem(backupKey, item);
          storage.removeItem(key);
          throw error;
        }
      } catch (error) {
        console.log(error);
        return initialValue;
      }
    });
    const valueRef = React.useRef(storedValue);
    valueRef.current = storedValue;
    const setValue = (value) => {
      try {
        const valueToStore = value instanceof Function ? value(valueRef.current) : value;
        window.localStorage.setItem(key, stringify(valueToStore));
        valueRef.current = valueToStore;
        setStoredValue(valueToStore);
      } catch (error) {
        console.log(error);
      }
    };
    return [storedValue, setValue];
  }
  function resolvePromise(promise) {
    if (typeof promise === "function") {
      return promise();
    }
    return promise;
  }
  var states = {
    pending: "pending",
    rejected: "rejected",
    resolved: "resolved"
  };
  var defaultState = {
    error: void 0,
    result: void 0,
    state: states.pending
  };
  function reducer(state, action) {
    switch (action.type) {
      case states.pending:
        return defaultState;
      case states.resolved:
        return {
          error: void 0,
          result: action.payload,
          state: states.resolved
        };
      case states.rejected:
        return {
          error: action.payload,
          result: void 0,
          state: states.rejected
        };
      default:
        return state;
    }
  }
  function usePromise(promise, inputs) {
    const [{ error, result, state }, dispatch] = React.useReducer(reducer, defaultState);
    React.useEffect(() => {
      const resolvedPromise = Promise.resolve().then(() => resolvePromise(promise));
      let canceled = false;
      dispatch({ type: states.pending });
      resolvedPromise.then(
        (result2) => !canceled && dispatch({
          payload: result2,
          type: states.resolved
        }),
        (error2) => !canceled && dispatch({
          payload: error2,
          type: states.rejected
        })
      );
      return () => {
        canceled = true;
      };
    }, inputs);
    return [result, error, state];
  }

  // src/scale.ts
  var MIN_BACKGROUND_SCALE = 0.25;
  var MAX_BACKGROUND_SCALE = 3;
  function clampScale(value) {
    if (!Number.isFinite(value))
      return 1;
    return Math.min(MAX_BACKGROUND_SCALE, Math.max(MIN_BACKGROUND_SCALE, value));
  }

  // src/blur.ts
  var BLUR_MIN = 0;
  var BLUR_MAX = 60;
  var BLUR_STEP = 0.1;
  var BLUR_PULSE_STRENGTH_MIN = 0;
  var BLUR_PULSE_STRENGTH_MAX = 60;
  var BLUR_PULSE_STRENGTH_STEP = 0.5;
  var BLUR_PULSE_STRENGTH_DEFAULT = 10;
  var BLUR_TRANSITION_MIN = 0;
  var BLUR_TRANSITION_MAX = 500;
  var BLUR_TRANSITION_STEP = 10;
  var BLUR_TRANSITION_DEFAULT = 160;
  function clampBlur(value, fallback = BLUR_MIN) {
    if (!Number.isFinite(value))
      return fallback;
    return Math.min(BLUR_MAX, Math.max(BLUR_MIN, value));
  }
  function toNumber(value, fallback) {
    const parsed = typeof value === "number" ? value : parseFloat(String(value));
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  function clampStoredNumber(raw, min, max, fallback) {
    const parsed = toNumber(raw, Number.NaN);
    if (!Number.isFinite(parsed))
      return fallback;
    return Math.min(max, Math.max(min, parsed));
  }
  function clampBlurValue(value) {
    return clampBlur(toNumber(value, BLUR_MIN));
  }
  function parseBackgroundBlur(raw) {
    return clampStoredNumber(raw, BLUR_MIN, BLUR_MAX, 0);
  }
  function parseBackgroundBrightness(raw) {
    return clampStoredNumber(raw, 0, 1, 1);
  }
  function parseBackgroundScale(raw) {
    return clampStoredNumber(raw, 0.25, 3, 1);
  }
  function clampBlurPulseStrength(value) {
    if (!Number.isFinite(value))
      return BLUR_PULSE_STRENGTH_DEFAULT;
    return Math.min(
      BLUR_PULSE_STRENGTH_MAX,
      Math.max(BLUR_PULSE_STRENGTH_MIN, value)
    );
  }
  function clampBlurPulseStrengthValue(value) {
    return clampBlurPulseStrength(toNumber(value, BLUR_PULSE_STRENGTH_DEFAULT));
  }
  function parseBlurPulseStrength(raw) {
    return clampStoredNumber(
      raw,
      BLUR_PULSE_STRENGTH_MIN,
      BLUR_PULSE_STRENGTH_MAX,
      BLUR_PULSE_STRENGTH_DEFAULT
    );
  }
  function clampBlurTransition(value) {
    if (!Number.isFinite(value))
      return BLUR_TRANSITION_DEFAULT;
    const clamped = Math.min(
      BLUR_TRANSITION_MAX,
      Math.max(BLUR_TRANSITION_MIN, value)
    );
    return Math.round(clamped);
  }
  function clampBlurTransitionValue(value) {
    return clampBlurTransition(toNumber(value, BLUR_TRANSITION_DEFAULT));
  }
  function parseBlurTransition(raw) {
    return clampStoredNumber(
      raw,
      BLUR_TRANSITION_MIN,
      BLUR_TRANSITION_MAX,
      BLUR_TRANSITION_DEFAULT
    );
  }
  function backgroundEffectStyle(blur, brightness, scale) {
    const blurValue = clampBlur(blur);
    const brightnessValue = Number.isFinite(brightness) ? brightness : 1;
    const filter = [
      blurValue > 0 ? `blur(${blurValue}px)` : "",
      brightnessValue !== 1 ? `brightness(${brightnessValue})` : ""
    ].filter(Boolean).join(" ");
    return {
      filter: filter || "none",
      transform: scale !== 1 ? `scale(${scale})` : "none"
    };
  }
  function blurTransitionCss(durationMs) {
    const duration = clampBlurTransition(durationMs);
    if (duration <= 0)
      return "";
    return `filter ${duration}ms ease, transform ${duration}ms ease`;
  }

  // src/keys.ts
  var STORE_BGLIST = "cc.microblock.bgenhanced.backgroundlist";
  var STORE_BGMODE = "cc.microblock.bgenhanced.backgroundmode";
  var STORE_BGSCALE = "cc.microblock.bgenhanced.backgroundscale";
  var STORE_BGBLUR = "cc.microblock.bgenhanced.backgrounblur";
  var STORE_BGBRIGHTNESS = "cc.microblock.bgenhanced.backgroundbrightness";
  var STORE_BGBLURTRANSITION = "cc.microblock.bgenhanced.blurtransition";
  var STORE_BGBLURPULSE = "cc.microblock.bgenhanced.blurpulsestrength";
  var STORE_BGMAXEDGE = "cc.microblock.bgenhanced.maximageedge";

  // src/mediaLoad.ts
  var mountedUrls = /* @__PURE__ */ new Map();
  var preloadedUrls = /* @__PURE__ */ new Map();
  function mountFileCached(path) {
    if (!path)
      return Promise.resolve("");
    let pending = mountedUrls.get(path);
    if (pending === void 0) {
      pending = betterncm.fs.mountFile(path);
      mountedUrls.set(path, pending);
      pending.catch(() => mountedUrls.delete(path));
    }
    return pending;
  }
  function addPreloadLink(url) {
    if (!url || document.querySelector(`link[data-bge-preload="${CSS.escape(url)}"]`))
      return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = url;
    link.setAttribute("data-bge-preload", url);
    document.head.appendChild(link);
  }
  async function preloadBackground(target) {
    try {
      const url = await resolveTargetUrl(target);
      if (!url)
        return "";
      addPreloadLink(url);
      let pending = preloadedUrls.get(url);
      if (pending === void 0) {
        pending = new Promise((resolve) => {
          const image = new Image();
          image.onload = () => resolve(url);
          image.onerror = () => resolve(url);
          image.src = url;
        });
        preloadedUrls.set(url, pending);
      }
      await pending;
      return url;
    } catch {
      return "";
    }
  }
  async function resolveTargetUrl(target) {
    if (typeof target === "string")
      return target;
    if (!target || typeof target !== "object")
      return "";
    const asImage = target;
    if (typeof asImage.resolveImageUrl === "function") {
      return await asImage.resolveImageUrl();
    }
    const asUrl = target;
    return typeof asUrl.url === "string" ? asUrl.url : "";
  }
  function preloadBackgrounds(backgrounds) {
    if (!Array.isArray(backgrounds))
      return;
    for (const background of backgrounds)
      preloadBackground(background);
  }
  function useMountedUrl(imageUrl) {
    const [url, setUrl] = React.useState("");
    React.useEffect(() => {
      if (!imageUrl) {
        setUrl("");
        return;
      }
      let disposed = false;
      setUrl("");
      mountFileCached(imageUrl).then(
        (mounted) => {
          if (!disposed)
            setUrl(mounted || "");
        },
        () => {
          if (!disposed)
            setUrl("");
        }
      );
      return () => {
        disposed = true;
      };
    }, [imageUrl]);
    return url;
  }

  // src/background/coverImageObserver.ts
  var coverImageSelector = ".normal.j-cover, .cmd-image";
  function containsCover(node) {
    if (node.nodeType !== 1)
      return false;
    const element = node;
    return element.matches(coverImageSelector) || !!element.querySelector(coverImageSelector);
  }
  function affectsCover(record) {
    if (record.type === "attributes") {
      return record.attributeName === "src" && record.target.nodeType === 1 && record.target.matches(coverImageSelector);
    }
    if (record.type !== "childList")
      return false;
    return Array.from(record.addedNodes).some(containsCover) || Array.from(record.removedNodes).some(containsCover);
  }
  function observeCoverChanges(update) {
    let disposed = false;
    let frame;
    const observer = new MutationObserver((records) => {
      if (disposed || frame !== void 0 || !records.some(affectsCover))
        return;
      frame = requestAnimationFrame(() => {
        frame = void 0;
        if (!disposed)
          update();
      });
    });
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["src"]
    });
    update();
    return () => {
      disposed = true;
      observer.disconnect();
      if (frame !== void 0)
        cancelAnimationFrame(frame);
    };
  }

  // src/background/coverImageBackground.tsx
  function getCoverUrl() {
    const image = document.querySelector(coverImageSelector);
    if (!image?.src)
      return "";
    const url = new URL(image.src, document.baseURI);
    const query = url.search.slice(1);
    const nested = url.searchParams.get("url") || url.searchParams.get("src") || query;
    const direct = /^https?:\/\//.test(nested) ? nested : "";
    return direct || image.src;
  }
  function Cover({ preview = false }) {
    const [url, setUrl] = React.useState("");
    const previousUrl = React.useRef("");
    const displayedUrl = React.useRef("");
    React.useEffect(() => {
      let disposed = false;
      let latest = "";
      let pending;
      const update = () => {
        const next = getCoverUrl();
        if (!next || next === latest)
          return;
        latest = next;
        preloadBackground(next);
        if (pending)
          pending.onload = pending.onerror = null;
        const image = new Image();
        pending = image;
        image.onload = () => {
          if (!disposed && latest === next) {
            previousUrl.current = displayedUrl.current;
            displayedUrl.current = next;
            setUrl(next);
          }
          image.onload = image.onerror = null;
        };
        image.onerror = () => {
          image.onload = image.onerror = null;
          if (latest === next)
            latest = "";
        };
        image.src = next;
      };
      const stopObserving = observeCoverChanges(update);
      return () => {
        disposed = true;
        stopObserving();
        if (pending)
          pending.onload = pending.onerror = null;
      };
    }, []);
    if (preview)
      return /* @__PURE__ */ h("div", { style: { background: url ? `url(${JSON.stringify(url)}) center / cover` : "transparent" } });
    return /* @__PURE__ */ h("div", { className: "BGE-coverImageBG" }, previousUrl.current && /* @__PURE__ */ h("img", { className: "BGE-coverImageBG-b", src: previousUrl.current }), url && /* @__PURE__ */ h("img", { key: url, className: "BGE-coverImageBG-a BGE-coverImageBG-enter", src: url }));
  }
  var CoverImageBackground = class _CoverImageBackground extends BaseBackground {
    constructor(ImageUrl = "") {
      super();
      this.ImageUrl = ImageUrl;
    }
    static backgroundTypeName = "\u5F53\u524D\u5C01\u9762";
    async backgroundElement() {
      return /* @__PURE__ */ h(Cover, null);
    }
    async previewBackground() {
      return () => /* @__PURE__ */ h(Cover, { preview: true });
    }
    static async askAndCreate() {
      return new _CoverImageBackground();
    }
    static default() {
      return new _CoverImageBackground();
    }
  };

  // src/background/imageBackground.tsx
  var import_sweetalert22 = __toESM(require_sweetalert2_all());

  // src/imageCache.ts
  var THUMBNAIL_MAX_EDGE = 48;
  var THUMBNAIL_QUALITY = 0.55;
  var CACHE_FOLDER = ".bge-cache";
  var cacheDirReady = /* @__PURE__ */ new Map();
  var prepared = /* @__PURE__ */ new Map();
  function fitWithin({ width, height }, maxEdge) {
    if (!(width > 0) || !(height > 0) || !(maxEdge > 0))
      return { width: 0, height: 0 };
    if (width <= maxEdge && height <= maxEdge)
      return { width, height };
    const ratio = maxEdge / Math.max(width, height);
    return {
      width: Math.max(1, Math.round(width * ratio)),
      height: Math.max(1, Math.round(height * ratio))
    };
  }
  function hashPath(value) {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index++) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
  }
  function cacheFileName(filePath, maxEdge) {
    return `${hashPath(filePath)}-${maxEdge}w.webp`;
  }
  function compressibleKind(filePath) {
    const extension = (filePath.split(/[?#]/)[0].match(/\.([a-z0-9]+)$/i)?.[1] ?? "").toLowerCase();
    if (!extension)
      return "thumbnail";
    if (["mp4", "webm", "mov", "mkv", "avi"].includes(extension))
      return "skip";
    if (["gif", "apng", "svg", "bmp", "ico"].includes(extension))
      return "skip";
    if (["jpg", "jpeg", "png", "webp", "avif"].includes(extension))
      return "compress";
    return "thumbnail";
  }
  function formatBytes(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0)
      return "0 KB";
    if (bytes < 1024 * 1024)
      return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  function canvasToBlob(canvas, quality) {
    return new Promise((resolve) => {
      try {
        canvas.toBlob((blob) => resolve(blob && blob.size > 0 ? blob : null), "image/webp", quality);
      } catch {
        resolve(null);
      }
    });
  }
  async function drawToBlob(blob, maxEdge, quality) {
    const bitmap = await createImageBitmap(blob).catch(() => null);
    if (bitmap === null)
      return null;
    try {
      const source = { width: bitmap.width, height: bitmap.height };
      const target = fitWithin(source, maxEdge);
      if (target.width <= 0 || target.height <= 0)
        return null;
      const canvas = document.createElement("canvas");
      canvas.width = target.width;
      canvas.height = target.height;
      const context = canvas.getContext("2d");
      if (context === null)
        return null;
      context.drawImage(bitmap, 0, 0, target.width, target.height);
      const output = await canvasToBlob(canvas, quality);
      return output === null ? null : { output, source };
    } finally {
      bitmap.close?.();
    }
  }
  async function ensureCacheDir(pluginPath) {
    const directory = `${pluginPath.replace(/[\\/]+$/, "")}/${CACHE_FOLDER}`;
    let ready = cacheDirReady.get(directory);
    if (ready === void 0) {
      ready = betterncm.fs.mkdir(directory).then(
        () => directory,
        () => {
          cacheDirReady.delete(directory);
          throw new Error("\u65E0\u6CD5\u521B\u5EFA\u63D2\u4EF6\u7F13\u5B58\u76EE\u5F55");
        }
      );
      cacheDirReady.set(directory, ready);
    }
    return await ready;
  }
  async function createThumbnail(filePath) {
    const blob = await betterncm.fs.readFile(filePath);
    if (!blob || blob.size === 0)
      return "";
    const scaled = await drawToBlob(blob, THUMBNAIL_MAX_EDGE, THUMBNAIL_QUALITY).catch(() => null);
    if (scaled === null)
      return "";
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
      reader.onerror = () => resolve("");
      reader.readAsDataURL(scaled.output);
    });
  }
  async function compressInner(filePath, maxEdge, pluginPath) {
    const directory = await ensureCacheDir(pluginPath);
    const target = `${directory}/${cacheFileName(filePath, maxEdge)}`;
    if (await betterncm.fs.exists(target))
      return target;
    const source = await betterncm.fs.readFile(filePath);
    const scaled = await drawToBlob(source, maxEdge, 0.86);
    if (scaled === null)
      return "";
    if (scaled.output.size >= source.size)
      return "";
    const written = await betterncm.fs.writeFile(target, scaled.output);
    if (!written)
      return "";
    console.log(`BGEnhanced: ${filePath} ${formatBytes(source.size)} -> cached ${formatBytes(scaled.output.size)}`);
    return target;
  }
  function prepareImage(filePath, maxEdge, pluginPath) {
    if (!filePath || !(maxEdge > 0))
      return Promise.resolve("");
    if (compressibleKind(filePath) !== "compress")
      return Promise.resolve("");
    const key = `${filePath}|${maxEdge}`;
    let pending = prepared.get(key);
    if (pending === void 0) {
      pending = compressInner(filePath, maxEdge, pluginPath).catch(() => "");
      prepared.set(key, pending);
    }
    return pending;
  }
  async function cachedImagePath(filePath, maxEdge, pluginPath) {
    if (!filePath || !(maxEdge > 0) || compressibleKind(filePath) !== "compress")
      return "";
    try {
      const directory = await ensureCacheDir(pluginPath);
      const target = `${directory}/${cacheFileName(filePath, maxEdge)}`;
      return await betterncm.fs.exists(target) ? target : "";
    } catch {
      return "";
    }
  }
  async function resolvedImagePath(filePath, maxEdge, pluginPath) {
    return await cachedImagePath(filePath, maxEdge, pluginPath) || filePath;
  }
  async function mountedImageUrl(filePath, maxEdge, pluginPath) {
    if (!filePath)
      return "";
    const path = await resolvedImagePath(filePath, maxEdge, pluginPath);
    return await mountFileCached(path);
  }

  // src/background/imageBackground.tsx
  function maxImageEdgeSetting() {
    try {
      const raw = window.localStorage.getItem(STORE_BGMAXEDGE);
      if (raw === null || raw.trim() === "")
        return 0;
      const value = Number(raw);
      return Number.isFinite(value) && value >= 0 ? value : 0;
    } catch {
      return 0;
    }
  }
  function BackgroundImage({ imageUrl, thumbnail }) {
    const full = useMountedUrl(imageUrl);
    const placeholder = useMountedUrl(thumbnail);
    const [loaded, setLoaded] = React.useState(false);
    if (!full && !placeholder)
      return null;
    return /* @__PURE__ */ h(f, null, thumbnail && !(loaded && placeholder) && /* @__PURE__ */ h(
      "img",
      {
        "aria-hidden": "true",
        src: placeholder,
        style: {
          filter: "blur(24px)",
          transform: "scale(1.15)",
          transformOrigin: "center",
          opacity: !placeholder ? 0 : loaded ? 0 : 1
        }
      }
    ), full && /* @__PURE__ */ h(
      "img",
      {
        src: full,
        onLoad: () => setLoaded(true),
        onError: () => setLoaded(true),
        style: { opacity: loaded ? 1 : 0 }
      }
    ));
  }
  var ImageBackground = class _ImageBackground extends BaseBackground {
    static backgroundTypeName = "\u56FE\u7247";
    constructor(ImageUrl) {
      super();
      this.ImageUrl = ImageUrl;
    }
    ImageUrl;
    /** Optional downscaled copy in the plugin cache; "" means "use ImageUrl". */
    cachePath = "";
    /** Optional ≤48px data url used as the blurred placeholder. */
    thumbnail = "";
    #mountedImageUrl;
    #mountedFor = "";
    async getMountedImageUrl() {
      const key = `${this.cachePath}|${maxImageEdgeSetting()}`;
      if (this.#mountedImageUrl === void 0 || this.#mountedFor !== key) {
        this.#mountedFor = key;
        this.#mountedImageUrl = (this.cachePath ? mountFileCached(this.cachePath) : mountedImageUrl(this.ImageUrl, maxImageEdgeSetting(), plugin.pluginPath)).catch(() => mountFileCached(this.ImageUrl));
      }
      return await this.#mountedImageUrl;
    }
    /** Lets the plugin preload this background before React renders it. */
    async resolveImageUrl() {
      return await this.getMountedImageUrl();
    }
    /**
     * Fills in `cachePath` and `thumbnail` once, if not generated yet. Runs in
     * the background so a large original is never required for the first paint.
     */
    async prepare() {
      let changed = false;
      if (compressibleKind(this.ImageUrl) === "compress") {
        const generated = await prepareImage(this.ImageUrl, maxImageEdgeSetting(), plugin.pluginPath);
        const cachePath = generated || await resolvedImagePath(this.ImageUrl, maxImageEdgeSetting(), plugin.pluginPath);
        if (cachePath && cachePath !== this.ImageUrl && cachePath !== this.cachePath) {
          this.cachePath = cachePath;
          changed = true;
        }
      }
      if (!this.thumbnail) {
        const thumbnail = await createThumbnail(this.ImageUrl);
        if (thumbnail) {
          this.thumbnail = thumbnail;
          changed = true;
        }
      }
      return changed;
    }
    async backgroundElement() {
      return /* @__PURE__ */ h(BackgroundImage, { imageUrl: this.ImageUrl, thumbnail: this.thumbnail });
    }
    async previewBackground() {
      const url = await this.getMountedImageUrl();
      return () => /* @__PURE__ */ h("div", { style: { background: `url(${url}) 0% 0% / cover` } });
    }
    static default() {
      return new _ImageBackground("");
    }
    static async askAndCreate() {
      const path = await betterncm.app.openFileDialog(".webp .png .jpg .jpeg .bmp .gif\0", "./");
      if (!path)
        return null;
      let exists = false;
      try {
        exists = betterncm_native.fs.exists(path);
      } catch {
      }
      if (!exists) {
        import_sweetalert22.default.fire(
          "\u6DFB\u52A0\u80CC\u666F\u5931\u8D25",
          `\u539F\u56E0\u53EF\u80FD\u4E3A\uFF1A
1. \u4F60\u9009\u4E2D\u7684\u8DEF\u5F84\u5185\u6709\u7279\u6B8A\u5B57\u7B26\uFF08\u4E2D\u6587\uFF0C\u5236\u8868\u7B26\u7B49\uFF09
2. \u4F60\u9009\u4E2D\u7684\u8DEF\u5F84\u4E0D\u5B58\u5728`,
          "error"
        );
        return null;
      }
      const background = new _ImageBackground(path);
      const maxEdge = maxImageEdgeSetting();
      void (async () => {
        try {
          const sourceSize = (await betterncm.fs.readFile(path))?.size ?? 0;
          await background.prepare();
          if (background.cachePath) {
            const cachedSize = (await betterncm.fs.readFile(background.cachePath))?.size ?? 0;
            if (maxEdge > 0 && cachedSize > 0 && sourceSize > 0) {
              import_sweetalert22.default.fire({
                toast: true,
                position: "bottom-end",
                timer: 6e3,
                showConfirmButton: false,
                icon: "success",
                title: `\u5DF2\u751F\u6210\u4F18\u5316\u526F\u672C\uFF1A${formatBytes(sourceSize)} \u2192 ${formatBytes(cachedSize)}`,
                text: "\u539F\u6587\u4EF6\u4FDD\u6301\u4E0D\u53D8\uFF0C\u4EC5\u7528\u4E8E\u663E\u793A\u3002"
              });
            }
          }
        } catch {
        }
      })();
      return background;
    }
  };

  // src/background/remoteImageBackground.tsx
  var import_sweetalert23 = __toESM(require_sweetalert2_all());
  var RemoteImageBackground = class _RemoteImageBackground extends BaseBackground {
    static backgroundTypeName = "\u5728\u7EBF\u56FE\u7247";
    constructor(ImageUrl) {
      super();
      this.ImageUrl = ImageUrl;
    }
    ImageUrl;
    async backgroundElement() {
      return /* @__PURE__ */ h(
        "img",
        {
          src: this.ImageUrl
        }
      );
    }
    async previewBackground() {
      return () => /* @__PURE__ */ h("div", { style: { background: `url(${this.ImageUrl}) 0% 0% / cover` } });
    }
    static default() {
      return new _RemoteImageBackground("");
    }
    async onConfig() {
      const result = await import_sweetalert23.default.fire({
        title: "\u4FEE\u6539\u5728\u7EBF\u56FE\u7247\u80CC\u666FURL",
        inputValue: this.ImageUrl,
        input: "text"
      });
      if (result.value)
        this.ImageUrl = result.value;
      return;
    }
    static async askAndCreate() {
      const result = await import_sweetalert23.default.fire({
        title: "\u521B\u5EFA\u4E00\u4E2A\u5728\u7EBF\u56FE\u7247\u80CC\u666F",
        text: "\u4F60\u53EF\u4EE5\u5728\u6B64\u5199\u5165\u4E00\u4E2A\u6307\u5411\u56FE\u7247\u7684URL\u3002",
        input: "text"
      });
      if (result.value)
        return new _RemoteImageBackground(result.value);
      else
        return null;
    }
  };

  // src/background/videoBackground.tsx
  var import_sweetalert24 = __toESM(require_sweetalert2_all());
  function BackgroundVideo({ videoUrl }) {
    const url = useMountedUrl(videoUrl);
    if (!url)
      return null;
    return /* @__PURE__ */ h("video", { autoPlay: true, loop: true, muted: true, preload: "auto", src: url });
  }
  var VideoBackground = class _VideoBackground extends BaseBackground {
    static backgroundTypeName = "\u89C6\u9891";
    constructor(videoUrl) {
      super();
      this.videoUrl = videoUrl;
    }
    videoUrl;
    #mountedVideoUrl;
    async getMountedVideoUrl() {
      if (this.#mountedVideoUrl === void 0)
        this.#mountedVideoUrl = mountFileCached(this.videoUrl);
      return await this.#mountedVideoUrl;
    }
    /** Lets the plugin preload this background before React renders it. */
    async resolveImageUrl() {
      return await this.getMountedVideoUrl();
    }
    async backgroundElement() {
      return /* @__PURE__ */ h(BackgroundVideo, { videoUrl: this.videoUrl });
    }
    async previewBackground() {
      const url = await this.getMountedVideoUrl();
      return () => /* @__PURE__ */ h("video", { preload: "metadata", src: url });
    }
    static default() {
      return new _VideoBackground("");
    }
    static async askAndCreate() {
      const path = await betterncm.app.openFileDialog(".mp4, .webm\0", "./");
      if (!path)
        return null;
      let exists = false;
      try {
        exists = betterncm_native.fs.exists(path);
      } catch {
      }
      if (!exists) {
        import_sweetalert24.default.fire(
          "\u6DFB\u52A0\u80CC\u666F\u5931\u8D25",
          `\u539F\u56E0\u53EF\u80FD\u4E3A\uFF1A
1. \u4F60\u9009\u4E2D\u7684\u8DEF\u5F84\u5185\u6709\u7279\u6B8A\u5B57\u7B26\uFF08\u4E2D\u6587\uFF0C\u5236\u8868\u7B26\u7B49\uFF09
2. \u4F60\u9009\u4E2D\u7684\u8DEF\u5F84\u4E0D\u5B58\u5728`,
          "error"
        );
        return null;
      }
      return new _VideoBackground(path);
    }
  };

  // src/backgroundList.ts
  var legacyTypes = {
    VideoBackground: "video",
    CSSBackground: "css",
    ImageBackground: "image",
    CoverImageBackground: "cover",
    RemoteImageBackground: "remote-image"
  };
  var registry = [
    { type: "video", ctor: VideoBackground },
    { type: "css", ctor: CSSBackground },
    { type: "image", ctor: ImageBackground },
    { type: "cover", ctor: CoverImageBackground },
    { type: "remote-image", ctor: RemoteImageBackground }
  ];
  var BackgroundTypes = registry.map((entry) => entry.ctor);
  function parseBackgroundList(text) {
    const data = JSON.parse(text);
    const values = Array.isArray(data) ? data : data?.version === 1 ? data.backgrounds : null;
    if (!Array.isArray(values))
      throw new Error("\u4E0D\u652F\u6301\u7684\u80CC\u666F\u914D\u7F6E\u7248\u672C");
    const seen = /* @__PURE__ */ new Set();
    return values.flatMap((value) => {
      if (!value || typeof value !== "object")
        return [];
      const normalizedType = legacyTypes[value.type] ?? value.type;
      const entry = registry.find((entry2) => entry2.type === normalizedType);
      if (!entry)
        return [];
      const instance = entry.ctor.default();
      for (const key of Object.keys(instance)) {
        if (key === "id" || key === "current")
          continue;
        const candidate = value[key];
        const initial = instance[key];
        if (Array.isArray(initial)) {
          if (Array.isArray(candidate) && candidate.every((item) => typeof item === "string"))
            instance[key] = candidate;
        } else if (typeof candidate === typeof initial && (typeof candidate !== "number" || Number.isFinite(candidate))) {
          instance[key] = candidate;
        }
      }
      if (typeof value.id === "string" && value.id && !seen.has(value.id))
        instance.id = value.id;
      seen.add(instance.id);
      instance.current = value.current === true;
      return [instance];
    });
  }
  function stringifyBackgroundList(backgrounds) {
    return JSON.stringify({ version: 1, backgrounds: backgrounds.map((bg) => {
      const entry = registry.find((entry2) => bg.constructor === entry2.ctor);
      if (!entry)
        throw new Error("\u672A\u6CE8\u518C\u7684\u80CC\u666F\u7C7B\u578B");
      return { ...bg, type: entry.type };
    }) });
  }
  function useLocalStorageBackgroundList(key) {
    return useLocalStorage(key, [], parseBackgroundList, stringifyBackgroundList);
  }
  function saveBackgroundList(key, backgrounds) {
    try {
      window.localStorage.setItem(key, stringifyBackgroundList(backgrounds));
    } catch (error) {
      console.log(error);
    }
  }

  // src/index.tsx
  var import_sweetalert25 = __toESM(require_sweetalert2_all());

  // src/resizeEffect.ts
  function watchBlurPulse(host, strength, duration, setActive) {
    if (!(strength > 0) || !(duration > 0))
      return () => {
      };
    if (host.matchMedia?.("(prefers-reduced-motion: reduce)").matches)
      return () => {
      };
    let timer;
    let active = false;
    const onResize = () => {
      if (!active) {
        active = true;
        setActive(true);
      }
      host.clearTimeout(timer);
      timer = host.setTimeout(() => {
        active = false;
        setActive(false);
      }, duration);
    };
    host.addEventListener("resize", onResize, { passive: true });
    return () => {
      host.removeEventListener("resize", onResize);
      host.clearTimeout(timer);
      if (active)
        setActive(false);
    };
  }

  // src/index.tsx
  var MAX_IMAGE_EDGE = 15360;
  function parseMaxImageEdge(raw) {
    if (raw === null || raw.trim() === "")
      return 0;
    return clampStoredNumber(raw, 0, MAX_IMAGE_EDGE, 0);
  }
  document.body.classList.add("BGEnhanced");
  console.log(`[BGEnhanced] ${"0.3.16"} loaded, build ${"2026-10-16T06:42:37.553Z"}`);
  var configElement = document.createElement("div");
  var BGDom = document.createElement("div");
  BGDom.classList.add("BGEnhanced-BackgoundDom");
  function preloadCurrentBackground() {
    try {
      const stored = window.localStorage.getItem(STORE_BGLIST);
      if (!stored)
        return;
      const backgroundList = parseBackgroundList(stored);
      const current = backgroundList.find((bg) => bg.current) ?? backgroundList[0];
      if (current)
        preloadBackground(current);
    } catch {
    }
  }
  preloadCurrentBackground();
  var selfPlugin;
  plugin.onLoad((_selfPlugin) => {
    selfPlugin = _selfPlugin.mainPlugin;
    selfPlugin.backgroundList = [];
    ReactDOM.render(/* @__PURE__ */ h(Main, null), BGDom);
    document.body.appendChild(BGDom);
    window.addEventListener("pagehide", () => {
      ReactDOM.unmountComponentAtNode(BGDom);
      BGDom.remove();
      document.body.classList.remove("BGEnhanced", "prefab-transparency");
    }, { once: true });
  });
  function BackgroundPreviewList({
    backgroundList,
    buttons,
    currentIDs = null
  }) {
    function PreviewBackground(background, preview) {
      return /* @__PURE__ */ h("span", { className: `bg-block ${(currentIDs == null ? background.current : currentIDs.includes(background.id)) && "selected"}` }, preview, /* @__PURE__ */ h("div", { className: "info" }, /* @__PURE__ */ h("div", { className: "name" }, background.constructor.backgroundTypeName), /* @__PURE__ */ h("div", { className: "buttons" }, buttons(background))));
    }
    const [previews, setPreviews] = React.useState({});
    React.useEffect(() => {
      let canceled = false;
      setPreviews({});
      for (const background of backgroundList) {
        background.previewBackground().then((component) => {
          if (!canceled)
            setPreviews((prev) => ({ ...prev, [background.id]: { component } }));
        }, (error) => {
          if (!canceled)
            setPreviews((prev) => ({ ...prev, [background.id]: { error: String(error) } }));
        });
      }
      return () => {
        canceled = true;
      };
    }, [backgroundList]);
    return /* @__PURE__ */ h(f, null, backgroundList.map((background) => {
      const preview = previews[background.id];
      return /* @__PURE__ */ h(React.Fragment, { key: background.id }, PreviewBackground(background, preview?.component ? React.createElement(preview.component) : /* @__PURE__ */ h("div", null, preview?.error ?? "\u52A0\u8F7D\u4E2D\u2026")));
    }));
  }
  function Main() {
    const stylesheet = React.useMemo(
      () => betterncm_native.fs.readFileText(`${plugin.pluginPath}/index.css`),
      []
    );
    const [backgroundScale, setBackgroundScale] = useLocalStorage(
      STORE_BGSCALE,
      1,
      parseBackgroundScale
    );
    const [backgroundBrightness, setBackgroundBrightness] = useLocalStorage(
      STORE_BGBRIGHTNESS,
      1,
      parseBackgroundBrightness
    );
    const [backgroundBlur, setBackgroundBlur] = useLocalStorage(
      STORE_BGBLUR,
      0,
      parseBackgroundBlur
    );
    const [blurTransition, setBlurTransition] = useLocalStorage(
      STORE_BGBLURTRANSITION,
      BLUR_TRANSITION_DEFAULT,
      parseBlurTransition
    );
    const [blurPulseStrength, setBlurPulseStrength] = useLocalStorage(
      STORE_BGBLURPULSE,
      BLUR_PULSE_STRENGTH_DEFAULT,
      parseBlurPulseStrength
    );
    const [pulseBlur, setPulseBlur] = React.useState(0);
    React.useEffect(() => {
      const strength = blurPulseStrength;
      const duration = blurTransition;
      return watchBlurPulse(window, strength, duration, (active) => setPulseBlur(active ? strength : 0));
    }, [blurPulseStrength, blurTransition]);
    const [backgroundMode, setBackgroundMode] = useLocalStorage(
      STORE_BGMODE,
      "cover-centered"
    );
    const [prefabTransparencyStatus, setPrefabTransparencyStatus] = useLocalStorage(
      "cc.microblock.prefab.transparency",
      false,
      (v) => v === "true"
    );
    React.useEffect(() => {
      if (prefabTransparencyStatus) {
        document.body.classList.add("prefab-transparency");
      } else {
        document.body.classList.remove("prefab-transparency");
      }
    }, [prefabTransparencyStatus]);
    const [backgroundList, setBackgroundList] = useLocalStorageBackgroundList(STORE_BGLIST);
    const [maxImageEdge, setMaxImageEdge] = useLocalStorage(
      STORE_BGMAXEDGE,
      0,
      parseMaxImageEdge
    );
    React.useEffect(() => {
      preloadBackgrounds(backgroundList);
    }, []);
    React.useEffect(() => {
      let disposed = false;
      void (async () => {
        let changed = false;
        for (const background of backgroundList) {
          const preparable = background;
          if (typeof preparable.prepare !== "function")
            continue;
          try {
            if (await preparable.prepare())
              changed = true;
          } catch {
          }
          if (disposed)
            return;
        }
        if (changed)
          saveBackgroundList(STORE_BGLIST, backgroundList);
      })();
      return () => {
        disposed = true;
      };
    }, [backgroundList]);
    React.useEffect(() => {
      selfPlugin.backgroundList = backgroundList;
    }, [backgroundList]);
    const currentBackground = React.useMemo(() => {
      return backgroundList.find((bg) => bg.current) ?? backgroundList[0] ?? new CSSBackground("linear-gradient(45deg, #0037ff, #005aff)");
    }, [backgroundList]);
    const backgroundRenderKey = backgroundList.find((bg) => bg.current)?.id ?? backgroundList[0]?.id ?? "no-background";
    const [currentConfigBackground, setCurrentConfigBackground] = React.useState(null);
    const [currentBackgroundElement, backgroundError] = usePromise(
      () => currentBackground.backgroundElement(),
      [backgroundList]
    );
    async function askAndAddBackground(background) {
      try {
        const result = await background.askAndCreate();
        if (result != null) {
          for (const bg of backgroundList)
            bg.hooks__onBeforeAddBackground(result);
          setBackgroundList((prev) => prev.concat(result));
        }
      } catch (error) {
        await import_sweetalert25.default.fire("\u6DFB\u52A0\u80CC\u666F\u5931\u8D25", String(error), "error");
      }
    }
    function removeBackground(background) {
      for (const bg of backgroundList)
        bg.hooks__onBeforeRemoveBackground(background);
      setBackgroundList(backgroundList.filter((bg) => bg !== background));
    }
    function selectBackground(background) {
      setBackgroundList(
        backgroundList.map((bg) => {
          if (bg === background)
            bg.current = true;
          else
            bg.current = false;
          return bg;
        })
      );
    }
    function BackgroundModeElement({ name, id }) {
      return /* @__PURE__ */ h(
        "span",
        {
          className: backgroundMode === id ? "bge-option-button enabled" : "bge-option-button",
          onClick: () => setBackgroundMode(id)
        },
        name
      );
    }
    const effectiveScale = clampScale(backgroundScale);
    const effectiveBlur = backgroundBlur + pulseBlur;
    return /* @__PURE__ */ h(f, null, /* @__PURE__ */ h("div", { className: "BGE-viewport" }, /* @__PURE__ */ h(
      "div",
      {
        style: {
          ...backgroundEffectStyle(effectiveBlur, backgroundBrightness, effectiveScale),
          "--bge-background-transition": blurTransitionCss(blurTransition) || "none"
        },
        className: `background mode-${backgroundMode}`
      },
      /* @__PURE__ */ h("div", { className: "container", key: backgroundRenderKey }, backgroundError ? /* @__PURE__ */ h("div", { className: "BGEnhanced-error" }, String(backgroundError)) : currentBackgroundElement)
    )), /* @__PURE__ */ h("style", { className: "BGEnhanced-styles" }, stylesheet), ReactDOM.createPortal(
      /* @__PURE__ */ h(f, null, /* @__PURE__ */ h("div", { className: "BGEnhanced-Config" }, currentConfigBackground ? currentConfigBackground : /* @__PURE__ */ h(f, null, /* @__PURE__ */ h("div", { className: "bge-panels" }, /* @__PURE__ */ h("div", { className: "bge-panel" }, /* @__PURE__ */ h("div", { className: "bge-panel-head" }, /* @__PURE__ */ h("span", { className: "ico" }, /* @__PURE__ */ h(MdAdd, null)), /* @__PURE__ */ h("span", { className: "bge-panel-name" }, "\u6DFB\u52A0\u80CC\u666F")), /* @__PURE__ */ h("div", { className: "bge-panel-body" }, BackgroundTypes.map((type) => (
        // rome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
        /* @__PURE__ */ h(
          "span",
          {
            key: type.name,
            className: "bge-option-button",
            onClick: () => askAndAddBackground(type)
          },
          type.backgroundTypeName
        )
      )))), /* @__PURE__ */ h("div", { className: "bge-panel" }, /* @__PURE__ */ h("div", { className: "bge-panel-head" }, /* @__PURE__ */ h("span", { className: "ico" }, /* @__PURE__ */ h(MdDesktopWindows, null)), /* @__PURE__ */ h("span", { className: "bge-panel-name" }, "\u80CC\u666F\u9002\u914D")), /* @__PURE__ */ h("div", { className: "bge-panel-body" }, /* @__PURE__ */ h(BackgroundModeElement, { name: "\u8986\u76D6", id: "cover" }), /* @__PURE__ */ h(BackgroundModeElement, { name: "\u8986\u76D6\u5C45\u4E2D", id: "cover-centered" }), /* @__PURE__ */ h(BackgroundModeElement, { name: "\u62C9\u4F38", id: "stretch" })))), /* @__PURE__ */ h("div", { className: "universalOptions bge-setting-group u-ibtn5", style: {
        width: "100%",
        height: "max-content",
        borderRadius: ".5em",
        padding: ".5em .6ex",
        opacity: "0.9",
        marginBottom: "1em"
      } }, /* @__PURE__ */ h(
        SliderRow,
        {
          label: "\u7F29\u653E",
          value: backgroundScale,
          min: 0.25,
          max: 3,
          step: 0.01,
          onChange: (value) => setBackgroundScale(clampScale(value))
        }
      ), /* @__PURE__ */ h(
        SliderRow,
        {
          label: "\u6A21\u7CCA",
          suffix: "px",
          value: backgroundBlur,
          min: 0,
          max: BLUR_MAX,
          step: BLUR_STEP,
          onChange: (value) => setBackgroundBlur(clampBlurValue(value))
        }
      ), /* @__PURE__ */ h(
        SliderRow,
        {
          label: "\u660E\u5EA6",
          value: backgroundBrightness,
          min: 0,
          max: 1,
          step: 0.01,
          onChange: (value) => setBackgroundBrightness(value)
        }
      )), /* @__PURE__ */ h("div", { className: "universalOptions bge-setting-group u-ibtn5", style: {
        width: "100%",
        height: "max-content",
        borderRadius: ".5em",
        padding: ".5em .6ex",
        opacity: "0.9",
        marginBottom: "1em"
      } }, /* @__PURE__ */ h("div", { style: { margin: ".5em", opacity: ".75" } }, "\u6A21\u7CCA\u8FC7\u6E21\uFF08\u4F5C\u7528\u4E8E\u7F29\u653E/\u5207\u6362\u80CC\u666F\u548C\u8C03\u6574\u6A21\u7CCA\u3001\u660E\u5EA6\u3001\u7F29\u653E\u65F6\uFF09"), /* @__PURE__ */ h(
        SliderRow,
        {
          label: "\u8FC7\u6E21\u65F6\u95F4",
          suffix: "ms",
          value: blurTransition,
          min: 0,
          max: BLUR_TRANSITION_MAX,
          step: BLUR_TRANSITION_STEP,
          onChange: (value) => setBlurTransition(clampBlurTransitionValue(value))
        }
      ), /* @__PURE__ */ h(
        SliderRow,
        {
          label: "\u7F29\u653E\u8109\u51B2\u5F3A\u5EA6",
          suffix: "px",
          value: blurPulseStrength,
          min: 0,
          max: BLUR_PULSE_STRENGTH_MAX,
          step: BLUR_PULSE_STRENGTH_STEP,
          onChange: (value) => setBlurPulseStrength(clampBlurPulseStrengthValue(value))
        }
      ), /* @__PURE__ */ h("div", { className: "bge-setting-description", style: { margin: ".5em", fontSize: "calc(.85em - .3px)", opacity: ".75" } }, "\u8FC7\u6E21\u65F6\u95F4\u4E3A 0 \u6216\u8109\u51B2\u5F3A\u5EA6\u4E3A 0 \u65F6\u5173\u95ED\u5BF9\u5E94\u6548\u679C\uFF1B\u7CFB\u7EDF\u5F00\u542F\u300C\u51CF\u5C11\u52A8\u6001\u6548\u679C\u300D\u65F6\u540C\u6837\u505C\u7528\u8109\u51B2\u3002")), /* @__PURE__ */ h("div", { className: "universalOptions bge-setting-group u-ibtn5", style: {
        width: "100%",
        height: "max-content",
        borderRadius: ".5em",
        padding: ".5em .6ex",
        opacity: "0.9",
        marginBottom: "1em"
      } }, /* @__PURE__ */ h("div", { style: { margin: ".5em", opacity: ".75" } }, "\u672C\u5730\u56FE\u7247\u4F18\u5316\uFF08\u4EC5\u5BF9\u672C\u5730\u56FE\u7247\u751F\u6548\uFF0C\u539F\u6587\u4EF6\u4E0D\u4F1A\u88AB\u4FEE\u6539\uFF09"), /* @__PURE__ */ h(
        SliderRow,
        {
          label: "\u526F\u672C\u6700\u957F\u8FB9",
          value: maxImageEdge,
          min: 0,
          max: MAX_IMAGE_EDGE,
          step: 256,
          onChange: (value) => setMaxImageEdge(parseMaxImageEdge(String(value)))
        }
      ), /* @__PURE__ */ h("div", { className: "bge-setting-description", style: { margin: ".5em", fontSize: "calc(.85em - .3px)", opacity: ".75" } }, "0 \u8868\u793A\u4E0D\u751F\u6210\u526F\u672C\u3001\u76F4\u63A5\u7528\u539F\u56FE\uFF0C\u8D8A\u5927\u8D8A\u6E05\u6670\uFF1B\u8BBE\u4E3A 0 \u4EE5\u5916\u7684\u503C\u65F6\u4F1A\u5728\u63D2\u4EF6\u76EE\u5F55\u7684 .bge-cache \u4E0B\u751F\u6210\u7F29\u5C0F\u526F\u672C\uFF0C\u5220\u9664\u8BE5\u76EE\u5F55\u5373\u53EF\u5168\u90E8\u91CD\u5EFA\u3002\u6240\u6709\u56FE\u7247\u90FD\u4F1A\u751F\u6210\u4E00\u5F20\u6A21\u7CCA\u5360\u4F4D\u56FE\u6765\u63A9\u76D6\u52A0\u8F7D\u8FC7\u7A0B\u3002")), /* @__PURE__ */ h(
        "div",
        {
          className: "bge-setting-group u-ibtn5",
          style: {
            width: "100%",
            height: "max-content",
            borderRadius: ".5em",
            padding: ".5em .6ex",
            opacity: "0.9",
            marginBottom: "1em"
          },
          onClick: () => setPrefabTransparencyStatus(!prefabTransparencyStatus)
        },
        /* @__PURE__ */ h("span", { className: "btn" }, "[", prefabTransparencyStatus ? "\u221A" : "\xD7", "] \u9884\u5236\u5168\u900F\u660E")
      ), /* @__PURE__ */ h("div", { className: "backgrounds" }, /* @__PURE__ */ h(BackgroundPreviewList, { backgroundList, buttons: (background) => /* @__PURE__ */ h(f, null, /* @__PURE__ */ h("span", { className: "btn", onClick: async () => {
        try {
          await background.onConfig();
          setBackgroundList((prev) => [...prev]);
        } catch (error) {
          await import_sweetalert25.default.fire("\u80CC\u666F\u914D\u7F6E\u5931\u8D25", String(error), "error");
        }
      } }, /* @__PURE__ */ h(MdSettings, null)), /* @__PURE__ */ h(
        "span",
        {
          className: "btn",
          onClick: () => removeBackground(background)
        },
        /* @__PURE__ */ h(MdDelete, null)
      ), /* @__PURE__ */ h(
        "span",
        {
          className: "btn",
          onClick: () => selectBackground(background)
        },
        /* @__PURE__ */ h(MdSelectAll, null)
      )) }))))),
      configElement
    ));
  }
  function NumberRow({ label, value }) {
    return /* @__PURE__ */ h("span", { style: { margin: ".5em" } }, label, /* @__PURE__ */ h("span", { style: { opacity: ".7", marginLeft: ".4em" } }, value));
  }
  function SliderRow({ label, value, min, max, step, suffix, onChange }) {
    return /* @__PURE__ */ h("div", null, /* @__PURE__ */ h(NumberRow, { label, value: suffix ? `${value}${suffix}` : value }), /* @__PURE__ */ h(
      "input",
      {
        type: "range",
        className: "range",
        min,
        max,
        step,
        "aria-label": label,
        style: { width: "calc(100% - 3em)", padding: ".5em" },
        value,
        onChange: (e) => onChange(parseFloat(e.currentTarget.value))
      }
    ));
  }
  plugin.onConfig(() => {
    return configElement;
  });
})();
/*! Bundled license information:

react/cjs/react.development.js:
  (**
   * @license React
   * react.development.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

sweetalert2/dist/sweetalert2.all.js:
  (*!
  * sweetalert2 v11.26.25
  * Released under the MIT License.
  *)
*/
