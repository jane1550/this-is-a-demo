/**
 * Created by haydn.chen on 4/20/2018.
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Transition from 'react-transition-group/Transition';
import {mapToCssModules, omit, pick, TransitionTimeouts, TransitionPropTypeKeys, TransitionStatuses} from './utils';
import './Collapse.scss';

const propTypes = {
  ...Transition.propTypes,
  isOpen: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  className: PropTypes.node,
  navbar: PropTypes.bool,
  cssModule: PropTypes.object,
  direction: PropTypes.oneOf([
    'horizontal',
    'vertical',
  ]),
};

const defaultProps = {
  ...Transition.defaultProps,
  isOpen: false,
  appear: false,
  enter: true,
  exit: true,
  tag: 'div',
  timeout: TransitionTimeouts.Collapse,
  direction: 'vertical',
};

const transitionStatusToClassHash = {
  [TransitionStatuses.ENTERING]: 'collapsing',
  [TransitionStatuses.ENTERED]: '',
  [TransitionStatuses.EXITING]: 'collapsing',
  [TransitionStatuses.EXITED]: 'hidden',
};

const transitionStatusToClassHashHorizontal = {
  [TransitionStatuses.ENTERING]: 'collapsing-horizontal',
  [TransitionStatuses.ENTERED]: '',
  [TransitionStatuses.EXITING]: 'collapsing-horizontal',
  [TransitionStatuses.EXITED]: 'hidden',
};

function getTransitionClass(status, direction) {
  if (direction === "horizontal") {
    return transitionStatusToClassHashHorizontal[status];
  } else {
    return transitionStatusToClassHash[status];
  }
}

function getHeight(node) {
  return node.scrollHeight;
}

function getWidth(node) {
  return node.scrollWidth;
}

class Collapse extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      width: null,
      maxWidth: null,
      height: null
    };

    ['onEntering', 'onEntered', 'onExit', 'onExiting', 'onExited'].forEach((name) => {
      this[name] = this[name].bind(this);
    });
  }

  onEntering(node, isAppearing) {
    if (this.props.direction === 'horizontal') {
      this.setState({width: getWidth(node), maxWidth: getWidth(node)});
    } else {
      this.setState({height: getHeight(node)});
    }
    this.props.onEntering(node, isAppearing);
  }

  onEntered(node, isAppearing) {
    if (this.props.direction === 'horizontal') {
      this.setState({width: null, maxWidth: null});
    } else {
      this.setState({height: null});
    }
    this.props.onEntered(node, isAppearing);
  }

  onExit(node) {
    if (this.props.direction === 'horizontal') {
      this.setState({width: getWidth(node), maxWidth: getWidth(node)});
    } else {
      this.setState({height: getHeight(node)});
    }
    this.props.onExit(node);
  }

  onExiting(node) {
    // getting this variable triggers a reflow
    if (this.props.direction === 'horizontal') {
      const offsetWidth = node.offsetWidth;
      this.setState({width: offsetWidth / 4, maxWidth: offsetWidth / 4});
    } else {
      const offsetHeight = node.offsetHeight;
      this.setState({height: offsetHeight / 4});
    }
    this.props.onExiting(node);
  }

  onExited(node) {
    if (this.props.direction === 'horizontal') {
      this.setState({width: null, maxWidth: null});
    } else {
      this.setState({height: null});
    }
    this.props.onExited(node);
  }

  render() {
    const {
      tag: Tag,
      isOpen,
      className,
      navbar,
      cssModule,
      children,
      direction,
      ...otherProps
    } = this.props;

    const {width, maxWidth, height} = this.state;

    // In NODE_ENV=production the Transition.propTypes are wrapped which results in an
    // empty object "{}". This is the result of the `react-transition-group` babel
    // configuration settings. Therefore, to ensure that production builds work without
    // error, we can either explicitly define keys or use the Transition.defaultProps.
    // Using the Transition.defaultProps excludes any required props. Thus, the best
    // solution is to explicitly define required props in our utilities and reference these.
    // This also gives us more flexibility in the future to remove the prop-types
    // dependency in distribution builds (Similar to how `react-transition-group` does).
    // Note: Without omitting the `react-transition-group` props, the resulting child
    // Tag component would inherit the Transition properties as attributes for the HTML
    // element which results in errors/warnings for non-valid attributes.
    const transitionProps = pick(otherProps, TransitionPropTypeKeys);
    const childProps = omit(otherProps, TransitionPropTypeKeys);

    return (
      <Transition
        {...transitionProps}
        in={isOpen}
        onEntering={this.onEntering}
        onEntered={this.onEntered}
        onExit={this.onExit}
        onExiting={this.onExiting}
        onExited={this.onExited}
      >
        {(status) => {
          let collapseClass = getTransitionClass(status, direction);
          const classes = mapToCssModules(classNames(
            className,
            collapseClass,
            navbar && 'navbar-collapse'
          ), cssModule);
          let style = null
          if (direction === 'horizontal') {
            style = width === null ? null : {width, maxWidth};
          } else {
            style = height === null ? null : {height};
          }
          return (
            <Tag
              {...childProps}
              style={{ ...childProps.style, ...style }}
              className={classes}
            >
              {children}
            </Tag>
          );
        }}
      </Transition>
    );
  }
}

Collapse.propTypes = propTypes;
Collapse.defaultProps = defaultProps;
export default Collapse;