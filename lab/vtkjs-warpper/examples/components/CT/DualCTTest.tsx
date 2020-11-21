/* eslint-disable react/button-has-type */
import React from 'react';
import { ESVtkCTViewerContainer } from '../../../src';
import { CTViewerLayout } from '../../../src/common/types';

const CT_FILE = 'testdata/ignored/CT20130424_213559_8924_40274191.CT';
const CT_FILE2 = 'testdata/ignored/CT20160217_161446_6460_02000273.CT';

function DualCTTest(): React.ReactElement {
  const style: React.CSSProperties = {
    width: '700px',
    height: '800px',
    position: 'relative',
  };

  return (
    <div style={style}>
      <div style={{ position: 'absolute', left: '0px', top: '0px' }}>
        <ESVtkCTViewerContainer
          id="CTViewer"
          size={{ width: 600, height: 600 }}
          layoutType={CTViewerLayout.LayoutMPR}
          data={CT_FILE}
          active={false}
        />
      </div>
      <div style={{ position: 'absolute', left: '600px', top: '0px' }}>
        <ESVtkCTViewerContainer
          id="CTViewer2"
          size={{ width: 600, height: 600 }}
          layoutType={CTViewerLayout.LayoutMPR}
          data={CT_FILE2}
          active={false}
        />
      </div>
    </div>
  );
}

export default DualCTTest;
