import React from 'react';
import styled from 'styled-components';

const BaseArrowStlyes = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: absolute;
  z-index: 2;
  background: #fff;
  border: 1px solid #0f72ee;
  img {
    user-select: none;
  }
`;

const PrevArrowStyles = styled(BaseArrowStlyes)`
  left: -40px;
  img {
    transform: rotate(180deg);
  }
  &:hover {
    background: #cce1fb;
  }
`;

const NextArrowStyles = styled(BaseArrowStlyes)`
  right: -40px;
  &:hover {
    /* transform: rotate(180deg); */
    background: #cce1fb;
  }
`;

const ChevronPrevStyles = styled(PrevArrowStyles)`
  &:hover {
    background: unset;
  }
  img {
    transform: none;
  }
`;
const ChevronNextStyles = styled(NextArrowStyles)`
  &:hover {
    background: unset;
  }
  img {
    transform: rotate(180deg);
  }
`;

const SquareArrowPrevStyles = styled(PrevArrowStyles)`
  border-radius: 12px;
  img {
    transform: none;
  }
`;
const SquareArrowNextStyles = styled(NextArrowStyles)`
  border-radius: 12px;
  img {
    transform: rotate(180deg);
  }
`;

const BasicChevronPrevStyles = styled(PrevArrowStyles)`
  border: none;
  bottom: -5px;
  left: calc(51% - 80px);
  background: transparent;
  img {
    transform: none;
  }
  &:hover {
    background: transparent;
  }
`;
const BasicChevronNextStyles = styled(NextArrowStyles)`
  border: none;
  bottom: -5px;
  left: 51%;
  background: transparent;
  img {
    transform: rotate(180deg);
  }
  &:hover {
    background: transparent;
  }
`;

export function SampleNextArrow(props) {
  const { onClick } = props;
  return (
    <NextArrowStyles className="nextArrow" onClick={onClick}>
      <img
        loading="lazy"
        alt="right icon"
        src="/images/icons/iconly-blue-arrow-right.svg"
      />
    </NextArrowStyles>
  );
}

export function SamplePrevArrow(props) {
  const { onClick } = props;
  return (
    <PrevArrowStyles className="prevArrow" onClick={onClick}>
      <img
        loading="lazy"
        alt="right icon"
        src="/images/icons/iconly-blue-arrow-right.svg"
      />
    </PrevArrowStyles>
  );
}

export function SquareArrowPrev(props) {
  const { onClick } = props;
  return (
    <SquareArrowPrevStyles className="prevArrow" onClick={onClick}>
      <img
        loading="lazy"
        alt="right icon"
        src="/images/icons/chevron_left_blue.svg"
      />
    </SquareArrowPrevStyles>
  );
}

export function SquareArrowNext(props) {
  const { onClick } = props;
  return (
    <SquareArrowNextStyles className="nextArrow" onClick={onClick}>
      <img
        loading="lazy"
        alt="right icon"
        src="/images/icons/chevron_left_blue.svg"
      />
    </SquareArrowNextStyles>
  );
}

export function BasicChevronPrev(props) {
  const { onClick } = props;
  return (
    <BasicChevronPrevStyles className="prevArrow" onClick={onClick}>
      <img
        loading="lazy"
        alt="right icon"
        src="/images/icons/chevron_left_white.svg"
      />
    </BasicChevronPrevStyles>
  );
}

export function BasicChevronNext(props) {
  const { onClick } = props;
  return (
    <BasicChevronNextStyles className="nextArrow" onClick={onClick}>
      <img
        loading="lazy"
        alt="right icon"
        src="/images/icons/chevron_left_white.svg"
      />
    </BasicChevronNextStyles>
  );
}

export function ChevronArrowNext(props) {
  const { onClick } = props;
  return (
    <ChevronNextStyles className="nextArrow" onClick={onClick}>
      <img
        loading="lazy"
        alt="right icon"
        src="/images/icons/chevron_left.svg"
      />
    </ChevronNextStyles>
  );
}

export function ChevronArrowPrev(props) {
  const { onClick } = props;
  return (
    <ChevronPrevStyles className="prevArrow" onClick={onClick}>
      <img
        loading="lazy"
        alt="right icon"
        src="/images/icons/chevron_left.svg"
      />
    </ChevronPrevStyles>
  );
}

export function ExpandMoreIcon() {
  return (
    <svg
      className="expandMoreIconSvg"
      xmlns="http://www.w3.org/2000/svg"
      width="21.155"
      height="11.194"
      viewBox="0 0 21.155 11.194"
    >
      <g transform="translate(0.578 -125.936)">
        <g transform="translate(0 126.513)">
          <path
            className="a"
            d="M19.772,126.743a.781.781,0,0,0-1.1,0l-8.114,8.1a.782.782,0,0,1-1.105,0l-8.114-8.1a.781.781,0,1,0-1.1,1.106l8.113,8.1a2.346,2.346,0,0,0,3.314,0l8.114-8.1A.781.781,0,0,0,19.772,126.743Z"
            transform="translate(0 -126.513)"
          />
        </g>
      </g>
    </svg>
  );
}

export function BasicChevronPrevDark(props) {
  const { onClick } = props;
  return (
    <BasicChevronPrevStyles className="prevArrow" onClick={onClick}>
      <img
        loading="lazy"
        alt="right icon"
        src="/images/peopleScience/icons/caretLeft.svg"
      />
    </BasicChevronPrevStyles>
  );
}

export function BasicChevronNextDark(props) {
  const { onClick } = props;
  return (
    <BasicChevronNextStyles className="nextArrow" onClick={onClick}>
      <img
        loading="lazy"
        alt="right icon"
        src="/images/peopleScience/icons/caretLeft.svg"
      />
    </BasicChevronNextStyles>
  );
}
