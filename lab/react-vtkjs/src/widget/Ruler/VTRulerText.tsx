/*
    Copyright (c) Ewoosoft Co., Ltd.
    
    All rights reserved.
*/

import React from 'react';
import './VTRuler.css';
import { CSSProperties } from '@material-ui/core/styles/withStyles';

interface VTRulerTextProps {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  color: string;
  size: string;
  alignHorizontal: 'right' | 'left' | 'center';
  alignVertical: 'top' | 'bottom' | 'center';
}

class VTRulerText extends React.PureComponent<VTRulerTextProps> {
  private textProperty = {} as VTRulerTextProps;

  constructor(props: VTRulerTextProps) {
    super(props);

    this.textProperty = props;
  }

  getStyle(): CSSProperties {
    let alignItems: 'flex-start' | 'flex-end' | 'center';
    let justifyContent: 'flex-start' | 'flex-end' | 'center';

    switch (this.textProperty.alignHorizontal) {
      case 'right':
        justifyContent = 'flex-end';
        break;
      case 'left':
        justifyContent = 'flex-start';
        break;
      case 'center':
      default:
        justifyContent = 'center';
        break;
    }

    switch (this.textProperty.alignVertical) {
      case 'top':
        alignItems = 'flex-start';
        break;
      case 'bottom':
        alignItems = 'flex-end';
        break;
      case 'center':
      default:
        alignItems = 'center';
        break;
    }

    const styles = {
      position: 'absolute' as 'absolute',
      pointerEvents: 'none' as 'none',
      top: this.textProperty.y,
      left: this.textProperty.x,
      height: '50px',
      width: '200px',
      background: '#00000000',
      display: 'flex',
      alignItems,
      justifyContent
    };

    return styles;
  }

  render(): React.ReactElement {
    console.log(`Render@VTRulerTextProps`);

    // const styles = this.getStyle();

    const mainStyle = this.getStyle();
    const styles = {
      color: this.textProperty.color,
      background: '#00000000',
      fontSize: this.textProperty.size
    };

    return (
      <div style={mainStyle}>
        <div style={styles}>{this.textProperty.text}</div>
      </div>
    );
  }
}

export default VTRulerText;
