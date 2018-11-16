import React, {Component} from 'react';
import PropTypes from 'prop-types';
import I18n from 'src/utils/i18n';
import _ from 'lodash';
import {fontFamily, fontFamilyEN, fontFamilyZH} from 'src/assets/css/variables.scss';

// <SmartText textKey={abc} isSecond={true | false} options={}>
export default class SmartText extends Component {
  static defaultProps = {
    'isSecond': false,
    'options': {}
  };

  static propTypes = {
    'isSecond': PropTypes.bool,
    // eslint-disable-next-line
    options: PropTypes.object,
    'textKey': PropTypes.string.isRequired
  };

  getFontFamily = (locale) => {
    const fonts = {};
    fonts[I18n.localeZH] = fontFamilyZH;
    fonts[I18n.localeEN] = fontFamilyEN;
    return fonts[locale] || fontFamily;
  };

  render() {
    const {main, second} = I18n.getLocale();
    const {textKey, isSecond, options} = this.props;
    const domProps = _.omit(this.props, ['textKey', 'isSecond', 'options']);
    const text = !isSecond ? I18n.get(textKey, options) : I18n.getSecond(textKey, options);
    const currentFontFamily = isSecond ? this.getFontFamily(second) : this.getFontFamily(main);
    return (
        <span style={{'fontFamily': currentFontFamily}} {...domProps}>
            {text}
        </span>
    );
  }
}
