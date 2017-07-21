import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import update from 'immutability-helper';

import ColorItem from './ColorItem';
import ColorTool from './ColorTool';
import { ColorExtract, InformationModal } from './../Modals';
import './color-palette.scss';

export default class ColorPalette extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedColor: {},
      colors: [],
      showColorTool: false,
      showExtractionTool: false,
      updatedColor: -1
    };
  }

  static propTypes = {
    show: React.PropTypes.bool,
    selectedColor: React.PropTypes.object,
    colors: React.PropTypes.array,
    selectedColors: React.PropTypes.array,
    onApply: React.PropTypes.func,
    onCancel: React.PropTypes.func
  };

  static defaultProps = {
    show: false,
    colors: [],
    selectedColors: [],
    onApply: () => true,
    onCancel: () => true
  };

  onManageColor = index => {
    this.hideExtractionTool();
    this.toggleColorTool();
  }

  onEnter() {
    this.setState({
      colors: this.props.colors.filter(c => c.name !== 'Transparent'),
      updatedColor: -1
    });
  }

  toggleColorTool = () => {
    this.setState({ showColorTool: !this.state.showColorTool });
  }

  showExtractionTool = index => {
    if (index >= 0) this.setState({ updatedColor: index });
    if (this.props.disableECModal || this.props.wasShownECModal) return this.toggleColorTool();
    this.setState({ showExtractionTool: true }, () => { this.props.colorPropositionModal(); });
  }

  hideExtractionTool = () => {
    this.setState({ showExtractionTool: false });
  }

  onRemoveColor(index) {
    const { colors } = this.state;
    const isExist = _.find(this.props.selectedColors, { name: colors[index].name });

    if (isExist || colors.length === 1) return this.toggleDeclineInfoModal();

    this.setState({
      colors: update(this.state.colors, {
        $splice: [
          [index, 1]
        ]
      })
    });
  }

  onSelectColor = target => {
    const { updatedColor, colors } = this.state;
    const { selectedColors } = this.props;

    if (!target || _.find(colors, { name: target.name })) {
      this.setState({ updatedColor: -1 });
      return this.toggleColorTool();
    }

    if (updatedColor >= 0) {
      this.setState({
        colors: update(colors, {
          [updatedColor]: { $set: target }
        }),
        updatedColor: -1
      })
    } else {
      this.setState({ colors: update(colors, { $push: [target] }) });
    }

    this.toggleColorTool();
  }

  toggleDeclineInfoModal = () => this.setState({ declineRemoving: !this.state.declineRemoving });

  onApply() {
    let { colors } = this.state;
    const trColor = _.find(this.props.colors, { name: 'Transparent' });
    if (!!trColor) colors = [trColor, ...colors];
    this.props.onApply(colors);
  }

  render() {
    const { colors } = this.state;

    return (
      <Modal className="vir-color-palette" show={this.props.show}
        onEnter={this.onEnter.bind(this)}>
        <Modal.Header>
          <i className="vir-back icon-left" onClick={this.props.onCancel} />
          <span>Edit Traditional Color Palette</span>
        </Modal.Header>
        <Modal.Body>
          <div className="extracted-colors">
            {colors.map((c, i) =>
              <ColorItem key={i} color={c} onClick={this.showExtractionTool.bind(this, i)}
                onRemoveColor={this.onRemoveColor.bind(this, i)} />
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className="navbar-fixed-bottom">
          <div className="btn-wrapper">
            <Button className="btn-text" onClick={this.props.onCancel}>Cancel</Button>
            <Button className="btn-text active" onClick={this.onApply.bind(this)}>Apply</Button>
          </div>
        </Modal.Footer>

        <ColorTool
          show={this.state.showColorTool}
          showExtractedColorsTab={true}
          onApply={this.onSelectColor}
          onCancel={this.toggleColorTool}
          extractedColors={this.props.extractedColors} />

        <ColorExtract show={this.state.showExtractionTool}
          extractedColors={this.props.extractedColors}
          error={this.props.extractionLimitError}
          onAccept={this.onManageColor}
          onHide={this.hideExtractionTool}
          onDoNotShow={this.props.updateUserSettings}
          onDecline={this.hideExtractionTool} />

        <InformationModal show={this.state.declineRemoving}
          onAccept={this.toggleDeclineInfoModal} />

      </Modal>
    )
  }
}
