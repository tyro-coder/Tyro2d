import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  width: 282px;
  height: 572px;
  .gameBox {
    position: absolute;
    left: 16px;
    top: 14px;
    display: block;
    width: 250px;
    height: 541.33333px;
    canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .phone {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url('/img/iphone12.png');
    background-size: 100% 100%;
    background-repeat: no-repeat no-repeat;
  }
`;

const IPhone12 = React.forwardRef(({ children }, ref) => {
  return (
    <Wrapper>
      <div ref={ref} className="gameBox">
        {children}
      </div>
      <div className="phone" />
    </Wrapper>
  );
});

export default IPhone12;
