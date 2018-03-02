import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const _iCheck = 'iCheck';
const _iCheckHelper = _iCheck + '-helper';

class EnhancedSwitch extends React.Component {

  static propTypes = {
    inputType: PropTypes.string.isRequired,

    checked: PropTypes.bool,
    defaultChecked: PropTypes.bool,

    label: PropTypes.node,

    disabled: PropTypes.bool,

    indeterminate: PropTypes.bool,

    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,

    // base class added to customized checkboxes
    checkboxClass: PropTypes.string,

    // base class added to customized radio buttons
    radioClass: PropTypes.string,

    // class added on checked state (input.checked = true)
    checkedClass: PropTypes.string,

    // if not empty, used instead of 'checkedClass' option (input type specific)
    checkedCheckboxClass: PropTypes.string,
    checkedRadioClass: PropTypes.string,

    // if not empty, added as class name on unchecked state (input.checked = false)
    uncheckedClass: PropTypes.string,

    // if not empty, used instead of 'uncheckedClass' option (input type specific)
    uncheckedCheckboxClass: PropTypes.string,
    uncheckedRadioClass: PropTypes.string,

    // class added on disabled state (input.disabled = true)
    disabledClass: PropTypes.string,

    // if not empty, used instead of 'disabledClass' option (input type specific)
    disabledCheckboxClass: PropTypes.string,
    disabledRadioClass: PropTypes.string,

    // if not empty, added as class name on enabled state (input.disabled = false)
    enabledClass: PropTypes.string,

    // if not empty, used instead of 'enabledClass' option (input type specific)
    enabledCheckboxClass: PropTypes.string,
    enabledRadioClass: PropTypes.string,

    // class added on indeterminate state (input.indeterminate = true)
    indeterminateClass: PropTypes.string,

    // if not empty, used instead of 'indeterminateClass' option (input type specific)
    indeterminateCheckboxClass: PropTypes.string,
    indeterminateRadioClass: PropTypes.string,

    // if not empty, added as class name on determinate state (input.indeterminate = false)
    determinateClass: PropTypes.string,

    // if not empty, used instead of 'determinateClass' option (input type specific)
    determinateCheckboxClass: PropTypes.string,
    determinateRadioClass: PropTypes.string,

    // class added on hover state (pointer is moved onto input)
    hoverClass: PropTypes.string,

    // class added on focus state (input has gained focus)
    focusClass: PropTypes.string,

    // class added on active state (mouse button is pressed on input)
    activeClass: PropTypes.string,

    // adds hoverClass to customized input on label hover and labelHoverClass to label on input hover
    labelHover: PropTypes.bool,

    // class added to label if labelHover set to true
    labelHoverClass: PropTypes.string,

    // increase clickable area by given % (negative number to decrease)
    increaseArea: PropTypes.string,

    // set true to inherit original input's class name
    inheritClass: PropTypes.bool,

    // if set to true, input's id is prefixed with 'iCheck-' and attached
    inheritID: PropTypes.bool,

    // set true to activate ARIA support
    aria: PropTypes.bool,

    // add HTML code or text inside customized input
    insert: PropTypes.node,

    children: PropTypes.node,

    // class added for outer label
    labelClassName: PropTypes.string,
  };

  static defaultProps = {

    checkboxClass: 'icheckbox',

    // base class added to customized radio buttons
    radioClass: 'iradio',

    // class added on checked state (input.checked = true)
    checkedClass: 'checked',

    // class added on disabled state (input.disabled = true)
    disabledClass: 'disabled',

    // class added on indeterminate state (input.indeterminate = true)
    indeterminateClass: 'indeterminate',

    // class added on hover state (pointer is moved onto input)
    hoverClass: 'hover',

    // class added on focus state (input has gained focus)
    focusClass: 'focus',

    // class added on active state (mouse button is pressed on input)
    activeClass: 'active',

    // adds hoverClass to customized input on label hover and labelHoverClass to label on input hover
    labelHover: true,

    // class added to label if labelHover set to true
    labelHoverClass: 'hover',

    // increase clickable area by given % (negative number to decrease)
    increaseArea: '',

    // set true to inherit original input's class name
    inheritClass: false,

    // if set to true, input's id is prefixed with 'iCheck-' and attached
    inheritID: false,

    // set true to activate ARIA support
    aria: false,
  };

  constructor(props) {
    super(props);
    let checked = false;
    if ('checked' in props) {
      checked = props.checked;
    } else {
      checked = props.defaultChecked;
    }
    // Assume we aren't on a mobile for server-side-rendering
    this._mobile = false;
    this.state = {
      checked,
      focused: false,
      hovered: false,
      active: false,
    };
  }

  componentDidMount() {
    if (typeof navigator !== 'undefined') {
      this._mobile = /ipad|iphone|ipod|android|blackberry|windows phone|opera mini|silk/i.test(navigator.userAgent);
    }
    this.adjustStyle();
    this.setIndeterminate();
    this.forceUpdate();
  }

  componentWillReceiveProps(nextProps) {
    if ('checked' in nextProps) {
      this.setState({
        checked: nextProps.checked,
      });
    }
  }

  componentDidUpdate() {
    this.adjustStyle();
    this.setIndeterminate();
  }

  getValue() {
    return this.refs.checkbox.value;
  }

  setChecked(newCheckedValue) {
    if (!this.props.hasOwnProperty('checked') || this.props.checked === false) {
      // TODO: this.props.onParentShouldUpdate(newSwitchedValue);
      this.refs.checkbox.checked = newCheckedValue;
    } else {
      if (process.env.NODE_ENV !== 'production') {
        let message = 'Cannot call set method while checked is defined as a property.';
        console.error(message); // eslint-disable-line
      }
    }
  }

  setIndeterminate() {
    if (this.props.indeterminate) {
      this.refs.checkbox.indeterminate = true;
    }
  }

  adjustStyle() {
    const { inputContainer } = this.refs;
    const { position } = window.getComputedStyle(inputContainer);

    if (position === 'static') {
      inputContainer.style.position = 'relative';
    }
  }

  isChecked() {
    return this.refs.checkbox.checked;
  }

  handleChange(e) {
    const checked = e.target.checked;
    if (!('checked' in this.props)) {
      this.setState({
        checked,
      });
    }

    if (this.props.onChange) {
      this.props.onChange(e, checked);
    }
  }

  handleBlur(e) {
    this.setState({
      focused: false,
    });

    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  }

  handleFocus(e) {
    this.setState({
      focused: true,
    });

    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  }

  handleHelperClick(event) {
    if (this.props.label) {
      return;
    }

    if (this.props.disabled) {
      return;
    }

    let newChecked = !this.refs.checkbox.checked;

    if (!('checked' in this.props)) {
      this.refs.checkbox.checked = newChecked;
      this.setState({
        checked: newChecked,
      });
    }

    event.preventDefault();
    event.stopPropagation();

    if (this.props.onChange) {
      // make sure <ins /> element is not target
      event.target = this.refs.checkbox;
      this.props.onChange(event, newChecked);
    }
  }

  render() {
    let props = this.props;
    let { disabled } = props;
    let {
      type,
      name,
      value,
      label,
      onBlur,
      onFocus,
      onMouseUp,
      onMouseDown,
      onMouseLeave,
      onTouchStart,
      onTouchEnd,
      className,

      checkboxClass,
      increaseArea,
      inputType,
      radioClass,
      checkedClass,
      disabledClass,
      indeterminate,
      indeterminateClass,
      hoverClass,
      focusClass,
      activeClass,
      labelHover,
      labelHoverClass,
      labelClassName,
      inheritClass,
      inheritID,
      aria,
      insert,

      ...other,
    } = props;

    let { checked } = this.state;

    // Setup clickable area
    let area = ('' + props.increaseArea).replace('%', '') | 0;

    // Clickable area limit
    if (area < -50) {
      area = -50;
    }

    let id = props.id;

    // Layer styles
    let offset = -area + '%';
    let size = 100 + (area * 2) + '%';
    let layer = {
      position: 'absolute',
      top: offset,
      left: offset,
      display: 'block',
      width: size,
      height: size,
      margin: 0,
      padding: 0,
      background: '#fff',
      border: 0,
      opacity: 0,
      cursor: disabled ? 'default' : 'pointer',
    };

    // Choose how to hide input
    let hide;
    if (this._mobile) {
      hide = {
        position: 'absolute',
        visibility: 'hidden',
      };
    } else if (area) {
      hide = layer;
    } else {
      hide = {
        position: 'absolute',
        opacity: 0,
      };
    }

    // Check ARIA option
    aria = !!props.aria;

    // TODO: Set ARIA placeholder
    // let ariaID = _iCheck + '-' + Math.random().toString(36).substr(2, 6);

    let helper;
    if (props.inputType === 'checkbox' && typeof props.indeterminateCheckboxClass !== 'undefined') {
      indeterminateClass = props.indeterminateCheckboxClass;
    } else if (props.inputType === 'radio' && typeof props.indeterminateRadioClass !== 'undefined') {
      indeterminateClass = props.indeterminateRadioClass;
    }

    const wrapProps = {
      className: classnames({
        [props.checkboxClass]: props.inputType === 'checkbox',
        [props.radioClass]: props.inputType === 'radio',
        [indeterminateClass]: indeterminate,
        [props.checkedClass]: checked,
        [props.disabledClass]: disabled,
        [props.hoverClass]: this.state.hovered,
        [props.focusClass]: this.state.focused,
        [props.activeClass]: this.state.active,
      }),
    };

    if (props.inheritClass) {
      wrapProps.className = classnames(wrapProps.className, props.className);
    }

    if (props.inheritID && id) {
      wrapProps.id = _iCheck + '-' + id;
    }

    if (aria) {
      wrapProps.role = props.inputType;
      // Set ARIA "labelledby"
      wrapProps['aria-labelledby'] = wrapProps.id;
      wrapProps['aria-checked'] = checked;
    }

    // Layer addition
    helper = (
      <ins
        className={_iCheckHelper}
        style={layer}
        onClick={this.handleHelperClick.bind(this)}
      />
    );

    const inputElement = (
      <input
        {...other}

        ref="checkbox"
        type={props.inputType}
        style={hide}
        name={name}
        value={value}
        defaultChecked={props.defaultChecked}
        onChange={this.handleChange.bind(this)}
        onBlur={this.handleBlur.bind(this)}
        onFocus={this.handleFocus.bind(this)}
      />
    );

    let insertElement = props.insert;
    if (insertElement && !React.isValidElement(insertElement)) {
      insertElement = <div dangerouslySetInnerHTML={{ __html: insertElement }}></div>;
    }

    const inputContainer = (
      <div ref="inputContainer" {...wrapProps}>
        {inputElement}
        {insertElement}
        {helper}
      </div>
    );

    let labelElement = props.label;
    if (!labelElement) {
      return inputContainer;
    }
    if (!React.isValidElement(labelElement)) {
      labelElement = <span dangerouslySetInnerHTML={{ __html: labelElement }} />;
    }

    // Label events
    function handleLabelEvent(event) {
      // Do nothing if input is disabled
      if (disabled) {
        return;
      }

      const etype = event.type;

      // Click
      if (etype === 'click') {
        // FIXME
        // if ($(event.target).is('a')) {
        //  return;
        // }
        // Hover state
      } else if (props.labelHover) {
        // mouseout|touchend false
        this.setState({
          hovered: !/ut|nd/.test(etype),
        });
      }

      if (this._mobile) {
        event.stopPropagation();
      }
      // return false;
    }

    const labelProps = {
      // onClick: handleLabelEvent.bind(this),
      onMouseOver: handleLabelEvent.bind(this),
      onMouseOut: handleLabelEvent.bind(this),
      onTouchStart: handleLabelEvent.bind(this),
      onTouchEnd: handleLabelEvent.bind(this),
    };

    // add className prop for outer label
    if (labelClassName) {
      labelProps.className = labelClassName;
    }

    return (
      <label {...labelProps}>
        {inputContainer}
        {labelElement}
      </label>
    );
  }
}

export default EnhancedSwitch;
