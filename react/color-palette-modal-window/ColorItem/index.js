import React from 'react';

import './color-item.scss';

export default class ColorItem extends React.Component {

  static propTypes = {
    color: React.PropTypes.object,
    active: React.PropTypes.bool,
    onClick: React.PropTypes.func,
    onRemoveColor: React.PropTypes.func
  };

  static defaultProps = {
    color: {},
    active: false,
    onClick: () => console.log('onClick'),
    onRemoveColor: () => console.log('onRemoveColor')
  };

  onClick(e) {
    if (e.target.id === 'close-icon') this.props.onRemoveColor();
    else this.props.onClick();
  }

  render() {
    const { color } = this.props;
    const oldC = `rgb(${color.red},${color.green},${color.blue})`;
    let cl = { background: oldC };

    return (
      <div className="vir-color-item">
        <div className="color-item" onClick={this.onClick.bind(this)}>
          <div className="color-input">
            <div className="color" style={cl}></div>
            <i className="icon-close" id="close-icon" onClick={this.props.onRemoveColor} />
            <div className={`color-name ${this.props.active ? 'active' : ''}`}>
              <span>{color.name}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
