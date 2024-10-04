import { jsx, jsxs } from 'react/jsx-runtime';
import isValid from 'date-fns/isValid';
import formatStringByPattern from 'format-string-by-pattern';
import React, { useRef, useEffect, Fragment } from 'react';
import isEqual from 'react-fast-compare';
import { convertTokens } from '@date-fns/upgrade/v2/convertTokens';
import format from 'date-fns/format';
import isBefore from 'date-fns/isBefore';
import parse from 'date-fns/parse';
import startOfDay from 'date-fns/startOfDay';
import Dayzed from 'dayzed';
import compareAsc from 'date-fns/compareAsc';
import isSameDay from 'date-fns/isSameDay';
import cn from 'classnames';
import { Button, Ref, Segment, Icon, Form, Input } from 'semantic-ui-react';

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}

var keys = {
  enter: 13,
  escape: 27,
  space: 32
};
var isSelectable = function isSelectable(date, minDate, maxDate) {
  if (minDate && isBefore(date, minDate) || maxDate && isBefore(maxDate, date)) {
    return false;
  }
  return true;
};
var getToday = function getToday(minDate, maxDate) {
  var today = new Date();
  return {
    date: startOfDay(today),
    nextMonth: false,
    prevMonth: false,
    selectable: isSelectable(today, minDate, maxDate),
    selected: false,
    today: true
  };
};
var formatDate = function formatDate(date, dateFormat, formatOptions) {
  return date ? format(startOfDay(date), convertTokens(dateFormat), formatOptions) : undefined;
};
var omit = function omit(keysToOmit, obj) {
  var newObj = _extends({}, obj);
  keysToOmit.forEach(function (key) {
    return delete newObj[key];
  });
  return newObj;
};
var pick = function pick(keysToPick, obj) {
  var newObj = {};
  keysToPick.forEach(function (key) {
    newObj[key] = obj[key];
  });
  return newObj;
};
var moveElementsByN = function moveElementsByN(n, arr) {
  return arr.slice(n).concat(arr.slice(0, n));
};
var formatSelectedDate = function formatSelectedDate(selectedDate, dateFormat, formatOptions) {
  if (!selectedDate) {
    return '';
  }
  return Array.isArray(selectedDate) ? selectedDate.map(function (date) {
    return formatDate(date, dateFormat, formatOptions);
  }).join(' - ') : formatDate(selectedDate, dateFormat, formatOptions);
};
var parseFormatString = function parseFormatString(formatString) {
  return formatString.replace(/[D, Y]/gi, function (a) {
    return a.toLowerCase();
  });
};
var parseOnBlur = function parseOnBlur(typedValue, formatString) {
  return parse(typedValue, parseFormatString(formatString), new Date());
};
var parseRangeOnBlur = function parseRangeOnBlur(typedValue, formatString) {
  var parsedFormatString = parseFormatString(formatString);
  var rangeValues = typedValue.split(' - ');
  return rangeValues.map(function (value) {
    return parse(value, parsedFormatString, new Date());
  }).sort(function (a, b) {
    return a > b ? 1 : -1;
  });
};
var onlyNumbers = function onlyNumbers(value) {
  if (value === void 0) {
    value = '';
  }
  return value.replace(/[^\d]/g, '');
};
function getShortDate(date) {
  if (!date) {
    return undefined;
  }
  return format(date, 'yyyy-MM-dd');
}

/**
 * This is intended to be used to compose event handlers
 * They are executed in order until one of them calls
 * `event.preventDefault()`. Not sure this is the best
 * way to do this, but it seems legit...
 * @param {Function} fns the event hanlder functions
 * @return {Function} the event handler to add to an element
 */
function composeEventHandlers() {
  for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }
  return function (event) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }
    return fns.some(function (fn) {
      if (fn) {
        fn.apply(void 0, [event].concat(args));
      }
      return event.defaultPrevented;
    });
  };
}
/**
 * Create an event handler for keyboard key given a config map
 * of event handlers
 * @param {Object} config consists of left, right, up, and down
 * @return {Function} the event handler to handle keyboard key
 */
function getArrowKeyHandlers(config) {
  return function (event) {
    var keyCode = event.keyCode;
    var fn = {
      37: config.left,
      39: config.right,
      38: config.up,
      40: config.down
    }[keyCode];
    if (fn) {
      fn(event);
    }
  };
}
/**
 * Checks if a given date is with date range
 * @param {Array} range the range array with upper and lower bound
 * @param {Date} date a given date
 * @return {Boolean} true if date is in the range, false otherwise
 */
function isInRange(range, date) {
  return range.length === 2 && range[0] <= date && range[1] >= date;
}

var _excluded$6 = ["refKey"],
  _excluded2$1 = ["children"];
var BaseDatePicker = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(BaseDatePicker, _React$Component);
  function BaseDatePicker() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.state = {
      offset: 0
    };
    _this.rootNode = React.createRef();
    _this.handleArrowKeys = getArrowKeyHandlers({
      left: function left() {
        return _this.getKeyOffset(-1);
      },
      right: function right() {
        return _this.getKeyOffset(1);
      },
      up: function up() {
        return _this.getKeyOffset(-7);
      },
      down: function down() {
        return _this.getKeyOffset(7);
      }
    });
    _this.getRootProps = function (_temp) {
      var _extends2;
      var _ref = _temp === void 0 ? {} : _temp,
        _ref$refKey = _ref.refKey,
        refKey = _ref$refKey === void 0 ? 'ref' : _ref$refKey,
        rest = _objectWithoutPropertiesLoose(_ref, _excluded$6);
      return _extends((_extends2 = {}, _extends2[refKey] = _this.rootNode, _extends2.onKeyDown = _this.handleArrowKeys, _extends2), rest);
    };
    _this._handleOffsetChanged = function (offset) {
      _this.setState({
        offset: offset
      });
    };
    return _this;
  }
  var _proto = BaseDatePicker.prototype;
  _proto.getKeyOffset = function getKeyOffset(number) {
    if (!this.rootNode.current) {
      return;
    }
    var activeEl = document.activeElement;
    var buttons = Array.from(this.rootNode.current.querySelectorAll('button:not(:disabled)'));
    buttons.some(function (btn, i) {
      var newNodeKey = i + number;
      if (btn !== activeEl) {
        return false;
      }
      if (newNodeKey <= buttons.length - 1 && newNodeKey >= 0) {
        buttons[newNodeKey].focus();
        return true;
      }
      buttons[0].focus();
      return true;
    });
  };
  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (this.props.date !== prevProps.date) {
      this._handleOffsetChanged(0);
    }
  };
  _proto.render = function render() {
    var _this2 = this;
    var _this$props = this.props,
      children = _this$props.children,
      rest = _objectWithoutPropertiesLoose(_this$props, _excluded2$1);
    return jsx(Dayzed, _extends({}, rest, {
      offset: this.state.offset,
      onOffsetChanged: this._handleOffsetChanged,
      render: function render(renderProps) {
        return children(_extends({}, renderProps, {
          getRootProps: _this2.getRootProps
        }));
      }
    }));
  };
  return BaseDatePicker;
}(React.Component);

var DatePicker = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(DatePicker, _React$Component);
  function DatePicker() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this._handleOnDateSelected = function (_ref, event) {
      var selectable = _ref.selectable,
        date = _ref.date;
      var _this$props = _this.props,
        clearOnSameDateClick = _this$props.clearOnSameDateClick,
        selectedDate = _this$props.selected,
        onChange = _this$props.onChange;
      if (!selectable) {
        return;
      }
      var newDate = date;
      if (selectedDate && selectedDate.getTime() === date.getTime() && clearOnSameDateClick) {
        newDate = null;
      }
      if (onChange) {
        onChange(event, newDate);
      }
    };
    return _this;
  }
  var _proto = DatePicker.prototype;
  _proto.render = function render() {
    return jsx(BaseDatePicker, _extends({}, this.props, {
      onDateSelected: this._handleOnDateSelected
    }));
  };
  return DatePicker;
}(React.Component);

var _excluded$5 = ["onMouseEnter", "onFocus"],
  _excluded2 = ["children"],
  _excluded3 = ["getRootProps", "getDateProps"];
var RangeDatePicker = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(RangeDatePicker, _React$Component);
  function RangeDatePicker() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.state = {
      hoveredDate: null
    };
    _this.setHoveredDate = function (date) {
      _this.setState(function (state) {
        return state.hoveredDate === date ? null : {
          hoveredDate: date
        };
      });
    };
    _this.onMouseLeave = function () {
      _this.setHoveredDate(null);
    };
    _this._handleOnDateSelected = function (_ref, event) {
      var selectable = _ref.selectable,
        date = _ref.date;
      var _this$props = _this.props,
        selectedDates = _this$props.selected,
        onChange = _this$props.onChange;
      if (!selectable) {
        return;
      }
      var dateTime = date.getTime();
      var newDates = [].concat(selectedDates);
      if (selectedDates.length) {
        if (selectedDates.length === 1) {
          var firstTime = selectedDates[0].getTime();
          if (firstTime < dateTime) {
            newDates.push(date);
          } else {
            newDates.unshift(date);
          }
        } else if (newDates.length === 2) {
          newDates = [date];
        }
      } else {
        newDates.push(date);
      }
      if (onChange) {
        onChange(event, newDates);
      }
      if (newDates.length === 2) {
        _this.setHoveredDate(null);
      }
    };
    _this.getEnhancedDateProps = function (getDateProps, dateBounds, _ref2) {
      var onMouseEnter = _ref2.onMouseEnter,
        onFocus = _ref2.onFocus,
        restProps = _objectWithoutPropertiesLoose(_ref2, _excluded$5);
      var hoveredDate = _this.state.hoveredDate;
      var date = restProps.dateObj.date;
      return getDateProps(_extends({}, restProps, {
        inRange: isInRange(dateBounds, date),
        start: dateBounds[0] && isSameDay(dateBounds[0], date),
        end: dateBounds[1] && isSameDay(dateBounds[1], date),
        // @ts-ignore
        hovered: hoveredDate && isSameDay(hoveredDate, date),
        onMouseEnter: composeEventHandlers(onMouseEnter, function () {
          _this.onHoverFocusDate(date);
        }),
        onFocus: composeEventHandlers(onFocus, function () {
          _this.onHoverFocusDate(date);
        })
      }));
    };
    _this.getEnhancedRootProps = function (getRootProps, props) {
      return getRootProps(_extends({}, props, {
        onMouseLeave: _this.onMouseLeave
      }));
    };
    return _this;
  }
  var _proto = RangeDatePicker.prototype;
  // Date level
  _proto.onHoverFocusDate = function onHoverFocusDate(date) {
    if (this.props.selected.length !== 1) {
      return;
    }
    this.setHoveredDate(date);
  };
  _proto.render = function render() {
    var _this2 = this;
    var _this$props2 = this.props,
      _children = _this$props2.children,
      rest = _objectWithoutPropertiesLoose(_this$props2, _excluded2);
    var hoveredDate = this.state.hoveredDate;
    var selected = this.props.selected;
    var dateBounds = selected.length === 2 || !selected.length || !hoveredDate ? selected :
    // prettier-ignore
    // @ts-ignore
    [selected[0], hoveredDate].sort(compareAsc);
    return jsx(BaseDatePicker, _extends({}, rest, {
      onDateSelected: this._handleOnDateSelected,
      children: function children(_ref3) {
        var getRootProps = _ref3.getRootProps,
          getDateProps = _ref3.getDateProps,
          renderProps = _objectWithoutPropertiesLoose(_ref3, _excluded3);
        return _children(_extends({}, renderProps, {
          getRootProps: _this2.getEnhancedRootProps.bind(_this2, getRootProps),
          getDateProps: _this2.getEnhancedDateProps.bind(_this2, getDateProps, dateBounds)
        }));
      }
    }));
  };
  return RangeDatePicker;
}(React.Component);
RangeDatePicker.defaultProps = {
  selected: []
};

var _excluded$4 = ["icon"];
var CustomButton = function CustomButton(_ref) {
  var icon = _ref.icon,
    otherProps = _objectWithoutPropertiesLoose(_ref, _excluded$4);
  return jsx(Button, _extends({
    basic: true,
    compact: true,
    icon: icon,
    type: "button"
  }, otherProps));
};

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z$1 = ".clndr-cell{background-color:#fff;border:none;color:inherit;cursor:pointer;font-family:inherit;height:30px;padding:5px 0;transition:all .2s}.clndr-cell.inverted{background-color:#4f4f4f}.clndr-cell.inverted:hover{background-color:#757575;color:inherit}.clndr-cell:hover{background-color:#cacbcd;color:inherit}.clndr-cell-today{background-color:#e0e1e2}.clndr-cell-inrange{background-color:#cacbcd;color:inherit}.clndr-cell-inrange.inverted{background-color:#757575;color:inherit}.clndr-cell-disabled{cursor:default;opacity:.45}.clndr-cell-disabled:hover{background-color:#fff}.clndr-cell-disabled.inverted:hover{background-color:#4f4f4f;color:inherit}.clndr-cell-selected{background-color:#4f4f4f;color:#f2f2f2}.clndr-cell-selected.inverted{background-color:#fff;color:#000}.clndr-cell-other-month{color:#d9d9d9}.clndr-cell-other-month.inverted{color:#a6a6a6}";
styleInject(css_248z$1);

var _excluded$3 = ["children", "end", "hovered", "inRange", "inverted", "nextMonth", "prevMonth", "selectable", "selected", "start", "today"];
var CalendarCell = function CalendarCell(_ref) {
  var children = _ref.children,
    inRange = _ref.inRange,
    inverted = _ref.inverted,
    nextMonth = _ref.nextMonth,
    prevMonth = _ref.prevMonth,
    selectable = _ref.selectable,
    selected = _ref.selected,
    today = _ref.today,
    otherProps = _objectWithoutPropertiesLoose(_ref, _excluded$3);
  var className = cn('clndr-cell', {
    inverted: inverted,
    'clndr-cell-today': today,
    'clndr-cell-disabled': !selectable,
    'clndr-cell-other-month': nextMonth || prevMonth,
    'clndr-cell-inrange': inRange,
    'clndr-cell-selected': selected
  });
  if (!children) {
    return jsx("span", _extends({
      className: className,
      tabIndex: children ? 0 : -1
    }, otherProps, {
      children: children
    }));
  }
  return jsx("button", _extends({
    className: className,
    disabled: !selectable,
    type: "button"
  }, otherProps, {
    children: children
  }));
};
CalendarCell.defaultProps = {
  end: false,
  hovered: false,
  inRange: false,
  nextMonth: false,
  prevMonth: false,
  start: false
};

var _excluded$2 = ["aria-label", "children", "end", "hovered", "inRange", "nextMonth", "prevMonth", "selectable", "selected", "start", "today"];
var style$1 = {
  marginTop: 10
};
var TodayButton = function TodayButton(_ref) {
  var ariaLabel = _ref['aria-label'],
    children = _ref.children,
    otherProps = _objectWithoutPropertiesLoose(_ref, _excluded$2);
  return jsx(Button, _extends({
    "aria-label": ariaLabel + ", " + children,
    className: "clndr-button-today",
    compact: true,
    "data-testid": "datepicker-today-button",
    fluid: true,
    style: style$1,
    type: "button"
  }, otherProps, {
    children: children
  }));
};

var css_248z = ".clndr-calendars-segment{margin-bottom:.25rem!important;margin-top:.25rem!important;text-align:center}.clndr-calendars-segment.clndr-floating{position:absolute!important;z-index:2000}.clndr-calendars-wrapper{grid-gap:1em;display:grid;grid-template-columns:repeat(var(--n,1),1fr)}.clndr-control{align-items:center;display:grid;grid-template-columns:repeat(3,1fr);margin-bottom:10px}.clndr-days{grid-gap:1px;background-color:rgba(0,0,0,.1);border:1px solid rgba(0,0,0,.1);border-radius:.28571429rem;display:grid;grid-template-columns:repeat(7,minmax(2.2rem,1fr));overflow:hidden;text-align:center}.clndr-left{left:0}.clndr-right{right:0}.clndr-top{bottom:100%}.clndr-bottom{top:100%}.clndr-calendars-segment.clndr-top{box-shadow:0 -1px 2px 0 rgba(34,36,38,.15)!important;margin-bottom:.25rem!important}";
styleInject(css_248z);

var _excluded$1 = ["ref"];
var styles = {
  leftBtn: {
    textAlign: 'start'
  },
  rightBtn: {
    textAlign: 'end'
  }
};
var pointings = {
  'top left': 'clndr-top clndr-left',
  'top right': 'clndr-top clndr-right',
  left: 'clndr-left',
  right: 'clndr-right'
};
var Calendar = function Calendar(_ref) {
  var _cn;
  var calendars = _ref.calendars,
    filterDate = _ref.filterDate,
    getBackProps = _ref.getBackProps,
    getDateProps = _ref.getDateProps,
    getForwardProps = _ref.getForwardProps,
    getRootProps = _ref.getRootProps,
    inline = _ref.inline,
    inverted = _ref.inverted,
    maxDate = _ref.maxDate,
    minDate = _ref.minDate,
    months = _ref.months,
    nextMonth = _ref.nextMonth,
    nextYear = _ref.nextYear,
    previousMonth = _ref.previousMonth,
    previousYear = _ref.previousYear,
    showToday = _ref.showToday,
    todayButton = _ref.todayButton,
    weekdays = _ref.weekdays,
    pointing = _ref.pointing;
  var _getRootProps = getRootProps(),
    rootRef = _getRootProps.ref,
    rootProps = _objectWithoutPropertiesLoose(_getRootProps, _excluded$1);
  var pressedBtnRef = useRef();
  var onPressBtn = function onPressBtn(evt) {
    pressedBtnRef.current = evt.target.getAttribute('aria-label');
  };
  useEffect(function () {
    if (pressedBtnRef.current) {
      var selector = "[aria-label=\"" + pressedBtnRef.current + "\"]";
      var prevBtn = document.querySelector(selector);
      if (prevBtn && document.activeElement !== prevBtn) {
        prevBtn.focus();
      }
    }
  });
  return jsx(Ref, {
    innerRef: rootRef,
    children: jsxs(Segment, _extends({}, rootProps, {
      inverted: inverted,
      className: cn('clndr-calendars-segment', (_cn = {
        'clndr-floating': !inline
      }, _cn[pointings[pointing]] = !inline, _cn)),
      children: [jsx("div", {
        className: "clndr-calendars-wrapper",
        style: {
          '--n': calendars.length
        },
        children: calendars.map(function (calendar, calendarIdx) {
          return jsxs("div", {
            children: [jsxs("div", {
              className: "clndr-control",
              children: [jsx("div", {
                style: styles.leftBtn,
                children: calendarIdx === 0 && jsxs(Fragment, {
                  children: [jsx(CustomButton, _extends({
                    icon: "angle double left",
                    inverted: inverted,
                    title: previousYear,
                    type: "button"
                  }, getBackProps({
                    calendars: calendars,
                    'aria-label': previousYear,
                    offset: 12,
                    onClick: onPressBtn
                  }))), jsx(CustomButton, _extends({
                    icon: "angle left",
                    inverted: inverted,
                    style: {
                      marginRight: 0
                    },
                    title: previousMonth,
                    type: "button"
                  }, getBackProps({
                    calendars: calendars,
                    'aria-label': previousMonth,
                    onClick: onPressBtn
                  })))]
                })
              }), jsxs("span", {
                title: months[calendar.month] + " " + calendar.year,
                children: [months[calendar.month].slice(0, 3), " ", calendar.year]
              }), jsx("div", {
                style: styles.rightBtn,
                children: calendarIdx === calendars.length - 1 && jsxs(Fragment, {
                  children: [jsx(CustomButton, _extends({
                    icon: "angle right",
                    inverted: inverted,
                    title: nextMonth,
                    type: "button"
                  }, getForwardProps({
                    calendars: calendars,
                    'aria-label': nextMonth,
                    onClick: onPressBtn
                  }))), jsx(CustomButton, _extends({
                    icon: "angle double right",
                    inverted: inverted,
                    style: {
                      marginRight: 0
                    },
                    title: nextYear,
                    type: "button"
                  }, getForwardProps({
                    calendars: calendars,
                    'aria-label': nextYear,
                    offset: 12,
                    onClick: onPressBtn
                  })))]
                })
              })]
            }), jsxs("div", {
              className: "clndr-days",
              children: [weekdays.map(function (weekday) {
                return jsx(CalendarCell, {
                  inverted: inverted,
                  "aria-label": weekday,
                  title: weekday,
                  children: weekday.slice(0, 2)
                }, calendar.year + "-" + calendar.month + "-" + weekday);
              }), calendar.weeks.map(function (week) {
                return week.map(function (dateObj, weekIdx) {
                  var key = calendar.year + "-" + calendar.month + "-" + weekIdx;
                  if (!dateObj) {
                    return jsx(CalendarCell, {
                      inverted: inverted
                    }, key);
                  }
                  var selectable = dateObj.selectable && filterDate(dateObj.date);
                  var shortDate = getShortDate(dateObj.date);
                  return jsx(CalendarCell, _extends({}, dateObj, getDateProps({
                    dateObj: _extends({}, dateObj, {
                      selectable: selectable
                    }),
                    onClick: onPressBtn
                  }), {
                    "data-testid": "datepicker-cell-" + shortDate,
                    inverted: inverted,
                    selectable: selectable,
                    children: dateObj.date.getDate()
                  }), key);
                });
              })]
            })]
          }, calendar.year + "-" + calendar.month);
        })
      }), showToday ? jsx(TodayButton, _extends({
        inverted: inverted
      }, getToday(minDate, maxDate), getDateProps({
        dateObj: getToday(minDate, maxDate),
        onClick: onPressBtn
      }), {
        children: todayButton
      })) : null]
    }))
  });
};

var CustomIcon = function CustomIcon(_ref) {
  var clearIcon = _ref.clearIcon,
    icon = _ref.icon,
    isClearIconVisible = _ref.isClearIconVisible,
    onClear = _ref.onClear,
    onClick = _ref.onClick;
  if (isClearIconVisible && clearIcon && React.isValidElement(clearIcon)) {
    return React.cloneElement(clearIcon, {
      'data-testid': 'datepicker-clear-icon',
      onClick: onClear
    });
  }
  if (isClearIconVisible && clearIcon && !React.isValidElement(clearIcon)) {
    return jsx(Icon, {
      "aria-pressed": "false",
      "data-testid": "datepicker-clear-icon",
      link: true,
      name: clearIcon,
      onClick: onClear
    });
  }
  if (icon && React.isValidElement(icon)) {
    return React.cloneElement(icon, {
      'data-testid': 'datepicker-icon',
      onClick: onClick
    });
  }
  return jsx(Icon, {
    "data-testid": "datepicker-icon",
    name: icon
  });
};

var _excluded = ["clearIcon", "error", "icon", "isClearIconVisible", "label", "onClear", "onFocus", "required", "value"];
var inputData = {
  'data-testid': 'datepicker-input'
};
var CustomInput = /*#__PURE__*/React.forwardRef(function (props, ref) {
  var clearIcon = props.clearIcon,
    error = props.error,
    icon = props.icon,
    isClearIconVisible = props.isClearIconVisible,
    label = props.label,
    onClear = props.onClear,
    onFocus = props.onFocus,
    required = props.required,
    value = props.value,
    rest = _objectWithoutPropertiesLoose(props, _excluded);
  return jsxs(Form.Field, {
    error: error,
    required: required,
    children: [label ? jsx("label", {
      htmlFor: rest.id,
      children: label
    }) : null, jsx(Input, _extends({}, rest, {
      ref: ref,
      error: error,
      required: required,
      icon: jsx(CustomIcon, {
        clearIcon: clearIcon,
        icon: icon,
        isClearIconVisible: isClearIconVisible,
        onClear: onClear,
        onClick: onFocus
      }),
      input: inputData,
      onFocus: onFocus,
      value: value
    }))]
  });
});

var todayButton = "Σήμερα";
var nextMonth = "Επόμενος μήνας";
var previousMonth = "Προηγούμενος μήνας";
var nextYear = "Επόμενο έτος";
var previousYear = "Προηγούμενο έτος";
var weekdays = [
	"Κυριακή",
	"Δευτέρα",
	"Τρίτη",
	"Τετάρτη",
	"Πέμπτη",
	"Παρασκευή",
	"Σάββατο"
];
var months = [
	"Ιανουάριος",
	"Φεβρουάριος",
	"Μάρτιος",
	"Απρίλιος",
	"Μάιος",
	"Ιούνιος",
	"Ιούλιος",
	"Αύγουστος",
	"Σεπτέμβριος",
	"Οκτώβριος",
	"Νοέμβριος",
	"Δεκέμβριος"
];
var elGR = {
	todayButton: todayButton,
	nextMonth: nextMonth,
	previousMonth: previousMonth,
	nextYear: nextYear,
	previousYear: previousYear,
	weekdays: weekdays,
	months: months
};

var style = {
  display: 'inline-block',
  position: 'relative'
};
var semanticInputProps = ['autoComplete', 'autoFocus', 'className', 'clearIcon', 'disabled', 'error', 'icon', 'iconPosition', 'id', 'label', 'loading', 'name', 'onBlur', 'onChange', 'onClick', 'onContextMenu', 'onDoubleClick', 'onFocus', 'onInput', 'onKeyDown', 'onKeyPress', 'onKeyUp', 'onMouseDown', 'onMouseEnter', 'onMouseLeave', 'onMouseMove', 'onMouseOut', 'onMouseOver', 'onMouseUp', 'placeholder', 'required', 'size', 'tabIndex', 'transparent', 'readOnly'];
var SemanticDatepicker = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(SemanticDatepicker, _React$Component);
  function SemanticDatepicker() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.el = React.createRef();
    _this.inputRef = React.createRef();
    _this.state = _this.initialState;
    _this.Component = _this.isRangeInput ? RangeDatePicker : DatePicker;
    _this.resetState = function (event) {
      var _this$props = _this.props,
        keepOpenOnClear = _this$props.keepOpenOnClear,
        onChange = _this$props.onChange;
      var newState = {
        isVisible: keepOpenOnClear,
        selectedDate: _this.isRangeInput ? [] : null,
        selectedDateFormatted: ''
      };
      if (keepOpenOnClear) {
        _this.focusOnInput();
      }
      _this.setState(newState, function () {
        onChange(event, _extends({}, _this.props, {
          value: null
        }));
      });
    };
    _this.clearInput = function (event) {
      _this.resetState(event);
    };
    _this.mousedownCb = function (mousedownEvent) {
      var isVisible = _this.state.isVisible;
      if (isVisible && _this.el) {
        if (_this.el.current && !_this.el.current.contains(mousedownEvent.target)) {
          _this.close();
        }
      }
    };
    _this.keydownCb = function (keydownEvent) {
      var isVisible = _this.state.isVisible;
      if (keydownEvent.keyCode === keys.escape && isVisible) {
        _this.close();
      }
    };
    _this.close = function () {
      window.removeEventListener('keydown', _this.keydownCb);
      window.removeEventListener('mousedown', _this.mousedownCb);
      _this.setState({
        isVisible: false
      });
    };
    _this.focusOnInput = function () {
      var _this$inputRef;
      if ((_this$inputRef = _this.inputRef) != null && _this$inputRef.current) {
        // @ts-ignore
        var _this$inputRef$curren = _this.inputRef.current,
          focus = _this$inputRef$curren.focus,
          inputRef = _this$inputRef$curren.inputRef;
        if (document.activeElement !== inputRef.current) {
          focus();
        }
      }
    };
    _this.showCalendar = function (event) {
      var onFocus = _this.props.onFocus;
      onFocus(event);
      window.addEventListener('mousedown', _this.mousedownCb);
      window.addEventListener('keydown', _this.keydownCb);
      _this.focusOnInput();
      _this.setState({
        isVisible: true
      });
    };
    _this.handleRangeInput = function (newDates, event) {
      var _this$props2 = _this.props,
        format = _this$props2.format,
        keepOpenOnSelect = _this$props2.keepOpenOnSelect,
        onChange = _this$props2.onChange,
        formatOptions = _this$props2.formatOptions;
      if (!newDates || !newDates.length) {
        _this.resetState(event);
        return;
      }
      var newState = {
        selectedDate: newDates,
        selectedDateFormatted: formatSelectedDate(newDates, format, formatOptions),
        typedValue: null
      };
      _this.setState(newState, function () {
        onChange(event, _extends({}, _this.props, {
          value: newDates
        }));
        if (newDates.length === 2) {
          _this.setState({
            isVisible: keepOpenOnSelect
          });
        }
      });
    };
    _this.handleBasicInput = function (newDate, event) {
      var _this$props3 = _this.props,
        format = _this$props3.format,
        keepOpenOnSelect = _this$props3.keepOpenOnSelect,
        onChange = _this$props3.onChange,
        formatOptions = _this$props3.formatOptions;
      if (!newDate) {
        _this.resetState(event);
        return;
      }
      var newState = {
        isVisible: keepOpenOnSelect,
        selectedDate: newDate,
        selectedDateFormatted: formatSelectedDate(newDate, format, formatOptions),
        typedValue: null
      };
      _this.setState(newState, function () {
        onChange(event, _extends({}, _this.props, {
          value: newDate
        }));
      });
    };
    _this.handleBlur = function (event) {
      var _this$props4 = _this.props,
        format = _this$props4.format,
        onBlur = _this$props4.onBlur,
        onChange = _this$props4.onChange;
      var typedValue = _this.state.typedValue;
      if (event) {
        onBlur(event);
      }
      if (!typedValue) {
        return;
      }
      if (_this.isRangeInput) {
        var parsedValue = parseRangeOnBlur(String(typedValue), format);
        var areDatesValid = parsedValue.every(isValid);
        if (areDatesValid) {
          _this.handleRangeInput(parsedValue, event);
          return;
        }
      } else {
        var _parsedValue = parseOnBlur(String(typedValue), format);
        var isDateValid = isValid(_parsedValue);
        if (isDateValid) {
          _this.handleBasicInput(_parsedValue, event);
          return;
        }
      }
      _this.setState({
        typedValue: null
      }, function () {
        onChange(event, _extends({}, _this.props, {
          value: null
        }));
      });
    };
    _this.handleChange = function (event, _ref) {
      var value = _ref.value;
      var _this$props5 = _this.props,
        allowOnlyNumbers = _this$props5.allowOnlyNumbers,
        format = _this$props5.format,
        onChange = _this$props5.onChange;
      var formatString = _this.isRangeInput ? format + " - " + format : format;
      var typedValue = allowOnlyNumbers ? onlyNumbers(value) : value;
      if (!typedValue) {
        var newState = {
          selectedDate: _this.isRangeInput ? [] : null,
          selectedDateFormatted: '',
          typedValue: null
        };
        _this.setState(newState, function () {
          onChange(event, _extends({}, _this.props, {
            value: null
          }));
        });
        return;
      }
      _this.setState({
        selectedDate: _this.isRangeInput ? [] : null,
        selectedDateFormatted: '',
        typedValue: formatStringByPattern(formatString, typedValue)
      });
    };
    _this.handleKeyDown = function (evt) {
      if (evt.keyCode === keys.enter) {
        _this.handleBlur();
      }
    };
    _this.onDateSelected = function (event, dateOrDates) {
      if (_this.isRangeInput) {
        _this.handleRangeInput(dateOrDates, event);
      } else {
        _this.handleBasicInput(dateOrDates, event);
      }
    };
    return _this;
  }
  var _proto = SemanticDatepicker.prototype;
  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    var _this$props6 = this.props,
      locale = _this$props6.locale,
      value = _this$props6.value;
    if (!isEqual(value, prevProps.value)) {
      this.onDateSelected(undefined, value);
    }
    if (locale !== prevProps.locale) {
      this.setState({
        locale: this.locale
      });
    }
  };
  _proto.render = function render() {
    var _this2 = this;
    var _this$state = this.state,
      isVisible = _this$state.isVisible,
      locale = _this$state.locale,
      selectedDate = _this$state.selectedDate,
      selectedDateFormatted = _this$state.selectedDateFormatted,
      typedValue = _this$state.typedValue;
    var _this$props7 = this.props,
      clearable = _this$props7.clearable,
      pointing = _this$props7.pointing,
      filterDate = _this$props7.filterDate,
      inline = _this$props7.inline,
      inverted = _this$props7.inverted,
      readOnly = _this$props7.readOnly,
      datePickerOnly = _this$props7.datePickerOnly;
    var datepickerComponent = jsx(this.Component, _extends({}, this.dayzedProps, {
      monthsToDisplay: this.isRangeInput ? 2 : 1,
      onChange: this.onDateSelected,
      selected: selectedDate,
      date: this.date,
      children: function children(props) {
        return jsx(Calendar, _extends({}, _this2.dayzedProps, props, locale, {
          filterDate: filterDate,
          inverted: inverted,
          pointing: pointing,
          weekdays: _this2.weekdays
        }));
      }
    }));
    return inline ? datepickerComponent : jsxs("div", {
      className: "field",
      style: style,
      ref: this.el,
      children: [jsx(CustomInput, _extends({}, this.inputProps, {
        isClearIconVisible: Boolean(clearable && selectedDateFormatted),
        onBlur: this.handleBlur,
        onChange: this.handleChange,
        onClear: this.clearInput,
        onFocus: readOnly ? null : this.showCalendar,
        onKeyDown: this.handleKeyDown,
        readOnly: readOnly || datePickerOnly,
        ref: this.inputRef,
        value: typedValue || selectedDateFormatted
      })), isVisible && datepickerComponent]
    });
  };
  _createClass(SemanticDatepicker, [{
    key: "isRangeInput",
    get: function get() {
      return this.props.type === 'range';
    }
  }, {
    key: "initialState",
    get: function get() {
      var _this$props8 = this.props,
        format = _this$props8.format,
        value = _this$props8.value,
        formatOptions = _this$props8.formatOptions;
      var initialSelectedDate = this.isRangeInput ? [] : null;
      return {
        isVisible: false,
        locale: this.locale,
        selectedDate: value || initialSelectedDate,
        selectedDateFormatted: formatSelectedDate(value, format, formatOptions),
        typedValue: null
      };
    }
  }, {
    key: "dayzedProps",
    get: function get() {
      return omit(semanticInputProps, this.props);
    }
  }, {
    key: "inputProps",
    get: function get() {
      var props = pick(semanticInputProps, this.props);
      var placeholder = props.placeholder !== undefined ? props.placeholder : this.props.format;
      return _extends({}, props, {
        placeholder: placeholder
      });
    }
  }, {
    key: "date",
    get: function get() {
      var selectedDate = this.state.selectedDate;
      var date = this.props.date;
      if (date || !selectedDate) {
        return date;
      }
      return this.isRangeInput ? selectedDate[0] : selectedDate;
    }
  }, {
    key: "locale",
    get: function get() {
      var locale = this.props.locale;
      var localeJson;
      if (locale === 'el-GR') {
        localeJson = elGR;
      } else {
        try {
          localeJson = require("./locales/" + locale + ".json");
        } catch (e) {
          console.warn("\"" + locale + "\" is not a valid locale");
          localeJson = require('./locales/en-US.json');
        }
      }
      return localeJson;
    }
  }, {
    key: "weekdays",
    get: function get() {
      var firstDayOfWeek = this.dayzedProps.firstDayOfWeek;
      var weekdays = this.state.locale.weekdays;
      return moveElementsByN(firstDayOfWeek, weekdays);
    }
  }]);
  return SemanticDatepicker;
}(React.Component);
SemanticDatepicker.defaultProps = {
  allowOnlyNumbers: false,
  autoFocus: false,
  clearIcon: 'close',
  clearOnSameDateClick: true,
  clearable: true,
  date: undefined,
  filterDate: function filterDate() {
    return true;
  },
  firstDayOfWeek: 0,
  format: 'YYYY-MM-DD',
  icon: 'calendar',
  id: undefined,
  inline: false,
  keepOpenOnClear: false,
  keepOpenOnSelect: false,
  label: undefined,
  locale: 'en-US',
  name: undefined,
  onBlur: function onBlur() {},
  onChange: function onChange() {},
  onFocus: function onFocus() {},
  placeholder: undefined,
  pointing: 'left',
  readOnly: false,
  datePickerOnly: false,
  required: false,
  showToday: true,
  showOutsideDays: false,
  type: 'basic',
  value: null,
  inverted: false
};

export { SemanticDatepicker as default };
//# sourceMappingURL=react-semantic-ui-datepickers.esm.js.map
