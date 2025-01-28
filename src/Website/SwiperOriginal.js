import React, { useState, useEffect, memo, useRef } from 'react';
import SwiperCore, {
  Navigation,
  Pagination,
  Autoplay,
  Parallax,
  Virtual,
  Mousewheel,
} from 'swiper';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  ChevronArrowNext,
  ChevronArrowPrev,
  SampleNextArrow,
  SamplePrevArrow,
  SquareArrowNext,
  SquareArrowPrev,
  BasicChevronNext,
  BasicChevronPrev,
  BasicChevronNextDark,
  BasicChevronPrevDark,
} from './Arrows';
import { NextArrow, PrevArrow } from './ArrowsRounded';
import Arrow from './ArrowsNew';

SwiperCore.use([
  Navigation,
  Pagination,
  Autoplay,
  Parallax,
  Virtual,
  Mousewheel,
]);

const SwiperStyles = styled.div`
  position: relative;
  .swiper-pagination-bullet {
    width: 10px;
    height: 10px;
  }
  .prevArrow,
  .nextArrow {
    position: absolute;
  }
  .line {
    border: 1px solid #e6e6e7;
    position: absolute;
  }
`;

const Slider = ({
  children,
  navigation,
  autoplay,
  line,
  singleLine,
  disableOnInteraction,
  color,
  refs,
  delay,
  customInit,
  customArrows,
  bottomNode,
  ...props
}) => {
  const [sliderRef, setSliderRef] = useState(null);
  const autoplayController = useRef(null);
  const mapArrows = {
    arrows: [SampleNextArrow, SamplePrevArrow],
    roundedArrows: [SampleNextArrow, SamplePrevArrow],
    chevron: [ChevronArrowNext, ChevronArrowPrev],
    squareArrows: [SquareArrowNext, SquareArrowPrev],
    basicChevronArrows: [BasicChevronNext, BasicChevronPrev],
    basicChevronArrowsDark: [BasicChevronNextDark, BasicChevronPrevDark],
  };
  const autoplay_options = autoplay
    ? {
        delay: delay ?? 2000,
        disableOnInteraction: disableOnInteraction ?? true,
      }
    : false;
  useEffect(() => {
    if (sliderRef) {
      sliderRef.on('click', () => {
        sliderRef?.autoplay?.stop();
        clearTimeout(autoplayController.current);
        autoplayController.current = setTimeout(() => {
          sliderRef?.autoplay?.start();
        }, props.touchTimeout ?? 8000);
      });
    }
  }, [sliderRef]);

  return (
    <SwiperStyles>
      {navigation &&
        React.createElement(
          mapArrows[typeof navigation == 'string' ? navigation : 'arrows'][0],
          {
            onClick: () => sliderRef?.slideNext(),
            activeColor: color,
          },
        )}
      {navigation &&
        React.createElement(
          mapArrows[typeof navigation == 'string' ? navigation : 'arrows'][1],
          {
            onClick: () => sliderRef?.slidePrev(),
            activeColor: color,
          },
        )}

      {line && <div className="line left" />}
      {line && <div className="line right" />}
      {singleLine && <div className="line" />}
      <Swiper
        speed={500}
        onSwiper={(slider) => {
          if (refs) {
            refs.current = slider;
          }
          setSliderRef(slider);
          if (customInit) {
            customInit(slider);
          }
        }}
        autoplay={autoplay_options}
        {...props}
      >
        {children}
      </Swiper>

      <div className="bottom__section">
        {customArrows && (
          <div className="arrows">
            <Arrow
              direction={customArrows.direction === 'vertical' ? 'up' : 'left'}
              onClick={() => sliderRef.slidePrev()}
            />
            <Arrow
              direction={
                customArrows.direction === 'vertical' ? 'down' : 'right'
              }
              onClick={() => sliderRef?.slideNext()}
            />
          </div>
        )}
        {bottomNode && <div className="extra">{bottomNode}</div>}
      </div>
    </SwiperStyles>
  );
};

export { SwiperSlide };
export default memo(Slider);
