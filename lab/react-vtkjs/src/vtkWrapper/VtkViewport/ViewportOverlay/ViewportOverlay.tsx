/* eslint-disable react/destructuring-assignment */
import React, { PureComponent } from 'react';
import './ViewportOverlay.css';

interface ViewportOverlayProps {
  topLeft?: string;
  topRight?: string;
  botLeft?: string;
  botRight?: string;
}

export function GetWindowingString(width: number, level: number): string {
  const wwwl = `W: ${width.toFixed(0)} L: ${level.toFixed(0)}`;
  return wwwl;
}

export function GetSliceInfoString(total: number, current: number): string {
  const sliceInfo = `${current.toFixed(0)} / ${total.toFixed(0)}`;
  return sliceInfo;
}

class ViewportOverlay extends PureComponent<ViewportOverlayProps> {
  render(): React.ReactElement {
    return (
      <div className="ViewportOverlay">
        <div className="top-left overlay-element">
          {this.props.topLeft ? <div>{this.props.topLeft}</div> : <div />}
        </div>
        <div className="top-right overlay-element">
          {this.props.topRight ? <div>{this.props.topRight}</div> : <div />}
        </div>
        <div className="bottom-right overlay-element">
          {this.props.botRight ? <div>{this.props.botRight}</div> : <div />}
        </div>
        <div className="bottom-left overlay-element">
          {this.props.botLeft ? <div>{this.props.botLeft}</div> : <div />}
        </div>
      </div>
    );
  }
}

export default ViewportOverlay;
