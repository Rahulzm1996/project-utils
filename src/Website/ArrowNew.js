import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ArrowsNewStyles = styled.div`
  width: fit-content;

  .arrow__wrapper {
    cursor: pointer;
    border-radius: 50%;
    width: ${(props) => `${props.size}px`};
    height: ${(props) => `${props.size}px`};
    border: 1px solid ${(props) => props.border};
    display: flex;
    justify-content: center;
    align-items: center;
    
    img {
      user-select: none;
    }

    &:hover {
      background: ${(props) => props.hoverbg};
      .arrow__sign {
        background-color: ${(props) => props.hoverArrowColor};
        &::before,
        &::after {
          background-color: ${(props) => props.hoverArrowColor};
        }
      }
    }
  }

  .arrow__sign {
    width: 23.4%;
    height: 1.5px;
    background-color: ${(props) => props.arrowColor};
    position: relative;
  }

  .left {
    transform: rotate(180deg);
  }

  .up {
    transform: rotate(-90deg);
  }
  .down {
    transform: rotate(90deg);
  }
`;

const ArrowsNew = (props) => {
  return (
    <ArrowsNewStyles
      size={props.size}
      onClick={props.onClick}
      border={props.border}
      arrowColor={props.arrowColor}
      hoverbg={props.hoverbg}
      hoverArrowColor={props.hoverArrowColor}
      className={`${props.direction}__arrow__container ${props.className}`}
    >
      <div className={`${props.direction} arrow__wrapper`}>
        <img loading="lazy" alt="right icon" src="/images/icons/iconly-blue-arrow-right.svg" />
      </div>
    </ArrowsNewStyles>
  );
};

ArrowsNew.propTypes = {
  direction: PropTypes.oneOf(['left', 'right', 'up', 'down']),
  size: PropTypes.number,
  onClick: PropTypes.func.isRequired,
  border: PropTypes.string,
  hoverbg: PropTypes.string,
  hoverArrowColor: PropTypes.string,
  className: PropTypes.string,
};

ArrowsNew.defaultProps = {
  size: 64,
  border: '#0f72ee',
  arrowColor: '#0f72ee',
  hoverbg: '#CCE1FB',
  hoverArrowColor: '#0f72ee',
};

export default React.memo(ArrowsNew);
