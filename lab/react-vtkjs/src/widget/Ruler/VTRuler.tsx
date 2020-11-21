/*
    Copyright (c) Ewoosoft Co., Ltd.
    
    All rights reserved.
*/
/* eslint-disable react/destructuring-assignment */

import React, { Component } from 'react';
import { Line } from 'react-lineto';
import './VTRuler.css';
import { VTRulerState, VTParentViewState } from './VTRulerTypes';
import VTRulerText from './VTRulerText';

interface VTRulerProps {
  name: string;
  rulerState: VTRulerState;
}

class VTRuler extends Component<VTRulerProps, VTParentViewState> {
  private initialX = 0;

  private initialY = 0;

  private endX = 0;

  private endY = 0;

  private mainLength = 0;

  private graduationNumber = 0;

  private graduationUnit = 'mm';

  private unitMain = 1;

  private unitMiddle = 0;

  private unitSmall = 0;

  private iteration = 0;

  private numberPrecision = 2; // means 0.01 micrometer is the smallest unit.

  private lineElements: unknown[] = [];

  private labelElements: unknown[] = [];

  constructor(props: VTRulerProps) {
    super(props);

    this.state = {} as VTParentViewState;
  }

  componentDidUpdate(): void {
    this.render();
  }

  setup(): void {
    this.lineElements.length = 0;
    this.labelElements.length = 0;

    this.setupUnit();
    this.makeMainLine();
    this.makeGraduationLine();
    this.makeMainNumber();
    this.makeGraduationNumber();
  }

  getGraduationNumber(length: number): number {
    const minGraduation = this.props.rulerState.minThreshouldGraduation;
    const maxGraduation = this.props.rulerState.maxThreshouldGraduation;

    if (length > maxGraduation) {
      return this.getGraduationNumber(length / 10.0);
    }
    if (length < minGraduation) {
      return this.getGraduationNumber(length * 10.0);
    }

    return Math.floor(length);
  }

  getUnit(): string {
    if (this.unitMain >= 1000000) return 'km'; // 1,000,000 ~

    if (this.unitMain >= 1000) return 'm'; // 1000 ~ 100,000

    if (this.unitMain >= 10) return 'cm'; // 10 ~ 100

    if (this.unitMain >= 0.1) return 'mm'; // 0.1 ~ 1

    return '\xb5m'; // µ, ~ 0.01
  }

  getLengthLabel(numberValue: number): number {
    if (this.unitMain >= 1000000) return numberValue / 1000000;

    if (this.unitMain >= 1000) return numberValue / 1000.0;

    if (this.unitMain >= 10) return numberValue / 10.0;

    if (this.unitMain >= 0.1) return numberValue;

    return numberValue * 1000.0;
  }

  setupUnit(): void {
    let length: number;
    this.unitMain = 1;

    switch (this.props.rulerState.position) {
      case 'left':
      case 'right':
      default:
        length = this.state.realHeight;
        break;

      case 'top':
      case 'bottom':
        length = this.state.realWidth;
        break;
    }

    this.mainLength = length * this.props.rulerState.lengthPerClient;

    this.graduationNumber = this.getGraduationNumber(this.mainLength);

    this.calcUnits();
    this.graduationUnit = this.getUnit();
  }

  getRealToScreenX(position: number): number {
    if (this.state.realWidth) return (position * this.state.width) / this.state.realWidth;

    return position;
  }

  getRealToScreenY(position: number): number {
    if (this.state.realHeight) return (position * this.state.height) / this.state.realHeight;

    return position;
  }

  getScreenToRealX(position: number): number {
    if (this.state.width) return (position * this.state.realWidth) / this.state.width;

    return position;
  }

  getScreenToRealY(position: number): number {
    if (this.state.height) return (position * this.state.realHeight) / this.state.height;

    return position;
  }

  removeRoundOffError(given: number): number {
    const precision = 10 ** this.numberPrecision;
    let answer = given * precision;
    answer = Math.floor(answer);
    answer /= precision;

    return answer;
  }

  calcUnits(): void {
    const length = this.mainLength / this.graduationNumber;
    const logDigit = Math.floor(Math.log10(length));

    this.unitMain = 10 ** logDigit;
    this.unitMiddle = this.unitMain / 2.0;
    this.unitSmall = this.unitMain / 10.0;
  }

  makeMainLine(): void {
    let tempLength: number;

    switch (this.props.rulerState.trimLength) {
      case 'long':
        this.mainLength = this.graduationNumber * this.unitMain;
        break;
      case 'middle':
        tempLength = this.graduationNumber * this.unitMain;

        if (this.mainLength - tempLength >= this.unitMiddle)
          this.mainLength = tempLength + this.unitMiddle;
        else this.mainLength = tempLength;
        break;
      case 'short':
        tempLength = this.graduationNumber * this.unitMain;

        for (let count = 0; count < 10; count += 1)
          if (
            this.mainLength - count * this.unitSmall >= tempLength &&
            this.mainLength - (count + 1) * this.unitSmall <= tempLength
          ) {
            this.mainLength = tempLength + this.unitSmall * count;
            break;
          }
        break;
      default:
        // Do nothing
        break;
    }

    switch (this.props.rulerState.position) {
      case 'left':
        this.initialX = this.props.rulerState.positionMargin;
        if (this.props.rulerState.graduationPosition === 'outside')
          this.initialX += this.props.rulerState.longGraduation.length;
        break;
      case 'right':
      default:
        this.initialX = this.state.width - this.props.rulerState.positionMargin;
        if (this.props.rulerState.graduationPosition === 'outside')
          this.initialX -= this.props.rulerState.longGraduation.length;
        break;
      case 'top':
        this.initialY = this.props.rulerState.positionMargin;
        if (this.props.rulerState.graduationPosition === 'outside')
          this.initialY += this.props.rulerState.longGraduation.length;
        break;
      case 'bottom':
        this.initialY = this.state.height - this.props.rulerState.positionMargin;
        if (this.props.rulerState.graduationPosition === 'outside')
          this.initialY -= this.props.rulerState.longGraduation.length;
        break;
    }

    switch (this.props.rulerState.position) {
      case 'left':
      case 'right':
      default:
        this.initialY = (this.state.realHeight - this.mainLength) / 2.0;
        this.initialY = this.getRealToScreenY(this.initialY);
        this.endX = this.initialX;
        this.endY = this.initialY + this.getRealToScreenY(this.mainLength);

        if (this.props.rulerState.startMargin >= 1) {
          this.initialY += this.props.rulerState.startMargin;
          const margin = this.getScreenToRealY(this.props.rulerState.startMargin);
          this.mainLength -= margin;
        }

        if (this.props.rulerState.endMargin >= 1) {
          this.endY -= this.props.rulerState.endMargin;
          const margin = this.getScreenToRealY(this.props.rulerState.endMargin);
          this.mainLength -= margin;
        }
        break;
      case 'top':
      case 'bottom':
        this.initialX = (this.state.realWidth - this.mainLength) / 2.0;
        this.initialX = this.getRealToScreenX(this.initialX);
        this.endX = this.initialX + this.getRealToScreenX(this.mainLength);
        this.endY = this.initialY;

        if (this.props.rulerState.startMargin >= 1) {
          this.initialX += this.props.rulerState.startMargin;
          const margin = this.getScreenToRealX(this.props.rulerState.startMargin);
          this.mainLength -= margin;
        }

        if (this.props.rulerState.endMargin >= 1) {
          this.endX -= this.props.rulerState.endMargin;
          const margin = this.getScreenToRealX(this.props.rulerState.endMargin);
          this.mainLength -= margin;
        }
        break;
    }

    this.initialX += this.state.x;
    this.initialY += this.state.y;
    this.endX += this.state.x;
    this.endY += this.state.y;
    const color = this.props.rulerState.rulerColor;
    const width = this.props.rulerState.rulerThickness;

    const key = `${this.props.name}Rular`;

    this.lineElements.push(
      <Line
        key={key}
        x0={this.initialX}
        y0={this.initialY}
        x1={this.endX}
        y1={this.endY}
        borderColor={color}
        borderWidth={width}
      />
    );
  }

  makeGraduationLine(): void {
    const totalLine = this.mainLength / this.unitSmall;
    const deltaX = (this.endX - this.initialX) / totalLine;
    const deltaY = (this.endY - this.initialY) / totalLine;
    let diffX = 0;
    let diffX5 = 0;
    let diffX10 = 0;
    let diffY = 0;
    let diffY5 = 0;
    let diffY10 = 0;
    let pixelSmall: number;
    let screenSmall: number;

    switch (this.props.rulerState.position) {
      case 'left':
      case 'right':
      default:
        pixelSmall = this.getRealToScreenY(this.unitSmall);
        screenSmall = pixelSmall * this.state.pixelSizeYmm;

        if (this.props.rulerState.shortGraduation.isOn)
          if (screenSmall > this.props.rulerState.shortGraduation.minSiblingDist)
            diffX = this.props.rulerState.shortGraduation.length;
        if (this.props.rulerState.middleGraduation.isOn)
          if (screenSmall * 5.0 > this.props.rulerState.middleGraduation.minSiblingDist)
            diffX5 = this.props.rulerState.middleGraduation.length;
        if (this.props.rulerState.longGraduation.isOn)
          diffX10 = this.props.rulerState.longGraduation.length;

        diffY = 0;
        diffY5 = 0;
        diffY10 = 0;
        break;
      case 'top':
      case 'bottom':
        diffX = 0;
        diffX5 = 0;
        diffX10 = 0;

        pixelSmall = this.getRealToScreenX(this.unitSmall);
        screenSmall = pixelSmall * this.state.pixelSizeXmm;

        if (this.props.rulerState.shortGraduation.isOn)
          if (screenSmall > this.props.rulerState.shortGraduation.minSiblingDist)
            diffY = this.props.rulerState.shortGraduation.length;
        if (this.props.rulerState.middleGraduation.isOn)
          if (screenSmall * 5.0 > this.props.rulerState.middleGraduation.minSiblingDist)
            diffY5 = this.props.rulerState.middleGraduation.length;
        if (this.props.rulerState.longGraduation.isOn)
          diffY10 = this.props.rulerState.longGraduation.length;
        break;
    }

    if (
      (this.props.rulerState.position === 'left' &&
        this.props.rulerState.graduationPosition === 'outside') ||
      (this.props.rulerState.position === 'right' &&
        this.props.rulerState.graduationPosition === 'inside') ||
      (this.props.rulerState.position === 'top' &&
        this.props.rulerState.graduationPosition === 'outside') ||
      (this.props.rulerState.position === 'bottom' &&
        this.props.rulerState.graduationPosition === 'inside')
    ) {
      diffX *= -1;
      diffX5 *= -1;
      diffX10 *= -1;

      diffY *= -1;
      diffY5 *= -1;
      diffY10 *= -1;
    }

    let sX = this.initialX;
    let sY = this.initialY;
    let eX: number;
    let eY: number;

    for (let count = 0; count <= totalLine; count += 1) {
      const key = `${this.props.name}Rular${count}`;

      if (count % 10 === 0) {
        eX = sX + diffX10;
        eY = sY + diffY10;
      } else if (count % 5 === 0) {
        eX = sX + diffX5;
        eY = sY + diffY5;
      } else {
        eX = sX + diffX;
        eY = sY + diffY;
      }

      const color = this.props.rulerState.rulerColor;
      const width = this.props.rulerState.rulerThickness;
      this.lineElements.push(
        <Line key={key} x0={sX} y0={sY} x1={eX} y1={eY} borderColor={color} borderWidth={width} />
      );

      sX += deltaX;
      sY += deltaY;
    }
  }

  makeMainNumber(): void {
    if (!this.props.rulerState.isNumberOn) return;

    let textX: number;
    let textY: number;
    const textWidth = 200;
    const textHeight = 50;
    let alignHorizontal: 'left' | 'right' | 'center';
    let alignVertical: 'top' | 'bottom' | 'center';

    switch (this.props.rulerState.numberPosition) {
      case 'start':
        textX = this.initialX - this.state.x;
        textY = this.initialY - this.state.y;
        switch (this.props.rulerState.position) {
          case 'left':
            textY -= textHeight + this.props.rulerState.numberMargin;
            alignHorizontal = 'left';
            alignVertical = 'bottom';
            break;
          case 'right':
          default:
            textX -= textWidth;
            textY -= textHeight + this.props.rulerState.numberMargin;
            alignHorizontal = 'right';
            alignVertical = 'bottom';
            break;
          case 'top':
            textX -= this.props.rulerState.numberMargin + textWidth;
            alignHorizontal = 'right';
            alignVertical = 'top';
            break;
          case 'bottom':
            textX -= this.props.rulerState.numberMargin + textWidth;
            textY -= this.props.rulerState.numberSize * 1.5;
            alignHorizontal = 'right';
            alignVertical = 'top';
            break;
        }
        break;
      case 'end':
      default:
        textX = this.endX - this.state.x;
        textY = this.endY - this.state.y;
        switch (this.props.rulerState.position) {
          case 'left':
            alignHorizontal = 'left';
            alignVertical = 'top';
            break;
          case 'right':
          default:
            textX -= textWidth;
            alignHorizontal = 'right';
            alignVertical = 'top';
            break;
          case 'top':
            textX += this.props.rulerState.numberMargin;
            alignHorizontal = 'left';
            alignVertical = 'top';
            break;
          case 'bottom':
            textX += this.props.rulerState.numberMargin;
            textY -= this.props.rulerState.numberSize * 1.5;
            alignHorizontal = 'left';
            alignVertical = 'top';
            break;
        }
        break;
    }

    if (this.props.rulerState.graduationPosition === 'outside') {
      switch (this.props.rulerState.position) {
        case 'left':
          textX -= this.props.rulerState.longGraduation.length;
          break;
        case 'right':
        default:
          textX += this.props.rulerState.longGraduation.length;
          break;
        case 'top':
          textY -= this.props.rulerState.longGraduation.length;
          break;
        case 'bottom':
          textY += this.props.rulerState.longGraduation.length;
          break;
      }
    }

    const key = `${this.props.name}Text`;
    const name = key;
    let text = this.removeRoundOffError(this.getLengthLabel(this.mainLength)).toString();

    const color = this.props.rulerState.numberColor;
    const size = `${this.props.rulerState.numberSize}pt`;

    if (this.props.rulerState.isUnitOn) text += ` ${this.graduationUnit}`;

    this.labelElements.push(
      <VTRulerText
        key={key}
        text={text}
        x={textX}
        y={textY}
        width={textWidth}
        height={textHeight}
        name={name}
        color={color}
        size={size}
        alignVertical={alignVertical}
        alignHorizontal={alignHorizontal}
      />
    );
  }

  makeGraduationNumber(): void {
    if (!this.props.rulerState.longGraduation.isNumberOn) return;

    const totalLine = this.mainLength / this.unitMain;
    const deltaX = (this.endX - this.initialX) / totalLine;
    const deltaY = (this.endY - this.initialY) / totalLine;
    const color = this.props.rulerState.numberColor;
    const size = `${this.props.rulerState.numberSize}pt`;

    let textX = this.initialX - this.state.x;
    let textY = this.initialY - this.state.y;
    const textWidth = 200;
    const textHeight = 50;
    let alignHorizontal: 'left' | 'right' | 'center';
    let alignVertical: 'top' | 'bottom' | 'center';

    switch (this.props.rulerState.longGraduation.numberPosition) {
      case 'inside':
        switch (this.props.rulerState.position) {
          case 'left':
            textX += this.props.rulerState.numberMargin;
            textY -= textHeight / 2.0;
            alignHorizontal = 'left';
            alignVertical = 'center';
            break;
          case 'right':
          default:
            textX -= textWidth + this.props.rulerState.numberMargin;
            textY -= textHeight / 2.0;
            alignHorizontal = 'right';
            alignVertical = 'center';
            break;
          case 'top':
            textX -= textWidth / 2.0;
            textY += this.props.rulerState.numberMargin;
            alignHorizontal = 'center';
            alignVertical = 'top';
            break;
          case 'bottom':
            textX -= textWidth / 2.0;
            textY -= this.props.rulerState.numberMargin + textHeight;
            alignHorizontal = 'center';
            alignVertical = 'bottom';
            break;
        }
        break;
      case 'outside':
        switch (this.props.rulerState.position) {
          case 'left':
            textX -= this.props.rulerState.numberMargin + textWidth;
            textY -= textHeight / 2.0;
            alignHorizontal = 'right';
            alignVertical = 'center';
            break;
          case 'right':
          default:
            textX += this.props.rulerState.numberMargin;
            textY -= textHeight / 2.0;
            alignHorizontal = 'left';
            alignVertical = 'center';
            break;
          case 'top':
            textX -= textWidth / 2.0;
            textY -= this.props.rulerState.numberMargin + textHeight;
            alignHorizontal = 'center';
            alignVertical = 'bottom';
            break;
          case 'bottom':
            textX -= textWidth / 2.0;
            textY += this.props.rulerState.numberMargin;
            alignHorizontal = 'center';
            alignVertical = 'top';
            break;
        }
        break;
      default:
        return;
    }

    if (
      this.props.rulerState.graduationPosition === 'outside' &&
      this.props.rulerState.longGraduation.numberPosition === 'outside'
    ) {
      switch (this.props.rulerState.position) {
        case 'left':
          textX -= this.props.rulerState.longGraduation.length;
          break;
        case 'right':
        default:
          textX += this.props.rulerState.longGraduation.length;
          break;
        case 'top':
          textY -= this.props.rulerState.longGraduation.length;
          break;
        case 'bottom':
          textY += this.props.rulerState.longGraduation.length;
          break;
      }
    }

    if (
      this.props.rulerState.graduationPosition === 'inside' &&
      this.props.rulerState.longGraduation.numberPosition === 'inside'
    ) {
      switch (this.props.rulerState.position) {
        case 'left':
          textX += this.props.rulerState.longGraduation.length;
          break;
        case 'right':
        default:
          textX -= this.props.rulerState.longGraduation.length;
          break;
        case 'top':
          textY += this.props.rulerState.longGraduation.length;
          break;
        case 'bottom':
          textY -= this.props.rulerState.longGraduation.length;
          break;
      }
    }

    for (let count = 0; count <= totalLine; count += 1) {
      const key = `${this.props.name}Text${count}`;
      const name = key;
      let text = this.getLengthLabel(count * this.unitMain).toString();

      if (this.props.rulerState.longGraduation.isUnitOn) text += ` ${this.graduationUnit}`;

      if (this.testTrimGraduationNumber(count, totalLine)) {
        this.labelElements.push(
          <VTRulerText
            key={key}
            text={text}
            x={textX}
            y={textY}
            width={textWidth}
            height={textHeight}
            name={name}
            color={color}
            size={size}
            alignVertical={alignVertical}
            alignHorizontal={alignHorizontal}
          />
        );
      }

      textX += deltaX;
      textY += deltaY;
    }
  }

  testTrimGraduationNumber(current: number, total: number): boolean {
    if (this.props.rulerState.longGraduation.isNumberRulerRangeOnly) {
      if (current === 0) return false;
      if (current >= total) return false;
    }

    return true;
  }

  render(): React.ReactElement {
    if (!this.props) {
      return <div />;
    }

    console.log(`Render@VTRuler`);
    const key = this.props.name + this.iteration;
    this.iteration += 1;

    this.setup();

    return (
      <div className={this.props.name} key={key}>
        {this.lineElements.length > 0 && this.lineElements}
        {this.labelElements.length > 0 && this.labelElements}
      </div>
    );
  }
}

export default VTRuler;
