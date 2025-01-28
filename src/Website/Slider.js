import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import Swiper, { SwiperSlide } from '../../components/Swiper';
import { responsiveProp } from '../../utils/responsiveProp';
import Typography from '../../components/Typography';
import Image from '../../components/Image';
import Link from 'next/link';
import useScheduledDemoForm from '../../components/ScheduleDemoForm/OpenForm';
import EverestGroup from '../../containers/Company/RecognitionV2/EverestGroup';
import list from '../../data/emailBanList';

const IMAGE_BASE = '/images/ermSoftware/awards';

const everstGroup = [
  {
    title: `IT Management Products PEAK Matrix® 2024 `,
    image: '/images/recognition/everest1',
    description: `Leena AI is a Major Contender in Conversational AI for IT Management Products PEAK Matrix® Assessment 2024`,
    buttonText: 'Learn More ',
    buttonLink: '/everst_group_contact',
  },
  {
    image: '/images/recognition/everest_group_logo',
    description: `Leena AI has been recognized as a Major Contender in Enterprise Conversational AI research with mentions in 2 matrices, in 2024.`,
    list: [
      { text: `IT Management Products PEAK Matrix® 2024` },
      { text: `Conversational AI Products PEAK Matrix® 2024 ` },
    ],
    buttonText: 'Learn More ',
    buttonLink: '/everst_group_contact',
  },
];

const props = {
  title:
    'Industry recognition and customer trust: A testament to our excellence',
  tags: [
    {
      icon: '',
      tagNo: '',
      tagName: 'ITSM',
      tagDesc: '',
    },
    {
      icon: '',
      tagNo: '',
      tagName: 'Future of Work',
      tagDesc: '',
    },
    {
      icon: '',
      tagNo: '',
      tagName: 'IT Intelligence',
    },

    {
      icon: '',
      tagNo: '',
      tagName: 'Conversational AI',
      tagDesc: '',
    },
  ],
  containerData: [
    {
      titleImage: `/images/ermSoftware/gartner`,
      heading: 'Hype Cycle for IT Service Management 2024',
      description:
        'Leena AI has been recognized as a notable vendor in 3 categories i.e., Virtual Support Agents, AI App for ITSM, and Gen AI-Enabled Virtual Assistant.',

      cta: 'Download report',
      form: 'd473a841-f8e2-419e-a0ec-52482e385ce3',
      image: '/images/gartner/card1',
    },
    {
      titleImage: `/images/ermSoftware/gartner`,
      heading: 'Hype Cycle for the Future of Work 2024',
      description:
        'Leena AI has been recognized as a notable vendor in the Gen AI-Enabled Virtual Assistants category.',

      cta: 'Download report',
      form: '656fbe6e-c56f-4d72-bbde-d8dc53f3d504',
      image: '/images/gartner/card2',
    },
    {
      titleImage: `/images/ermSoftware/gartner`,
      heading: 'Hype Cycle for IT Management Intelligence 2024',
      description:
        'Leena AI has been recognized in 2 categories i.e. Gen AI - Enabled Virtual Assistants and AI Applications for ITSM.',

      cta: 'Download report',
      form: 'e7ff77e5-41c8-4987-a834-bdfa2f8ce40e',
      image: '/images/gartner/card3',
    },

    {
      titleImage: `/images/ermSoftware/gartner`,
      heading: 'Market Guide for Conversational AI Solutions 2024',
      description:
        'Leena AI is mentioned in this research and used by application leaders to navigate the CAI space.',

      cta: 'Download report',
      form: '3372424f-f1d7-480c-8f2a-0aac30a1176f',
      image: '/images/gartner/card4',
    },
  ],
  awards: [
    { awardImage: `${IMAGE_BASE}/gartnerAnalyst1` },
    { awardImage: `${IMAGE_BASE}/gartnerAnalyst2` },
    { awardImage: `${IMAGE_BASE}/gartnerAnalyst3` },
    { awardImage: `${IMAGE_BASE}/gartnerAnalyst4` },
    { awardImage: `${IMAGE_BASE}/gartnerAnalyst5` },
    { awardImage: `${IMAGE_BASE}/gartnerAnalyst6` },
    { awardImage: `${IMAGE_BASE}/gartnerAnalyst7` },
    { awardImage: `${IMAGE_BASE}/gartnerAnalyst8` },
    { awardImage: `${IMAGE_BASE}/gartnerAnalyst9` },
    { awardImage: `${IMAGE_BASE}/gartnerAnalyst10` },
  ],
};

const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  flex-direction: column;
  gap: 24px;
  ${responsiveProp('width', ['100%', '', ''], '')}
  ${responsiveProp('padding', ['40px 24px', '40px 0px', '40px 0px'], '')}
  .awards_container-gartner-v3 {
    display: flex;
    flex-wrap: wrap;
    ${responsiveProp('flex-direction', ['column', 'row', 'row'], '')}
    ${responsiveProp('justify-content', ['', 'center', 'center'], '')}

    .awards_sub_container {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      justify-content: center;
      ${responsiveProp('column-gap', ['8px', '24px', '24px'], '')}
      ${responsiveProp('justify-content', ['center', 'center', 'center'], '')}
    }

    .award_image {
      display: contents;
      justify-content: center;
      align-items: center;
    }
  }

  .main-everest-cont {
    display: flex;
    align-items: center;
    ${responsiveProp('flex-direction', ['column', 'row', 'row'], '')}

    gap: 24px;
    .green {
      background: #f3fbf8 !important;
    }
    .card {
      display: flex;
      ${responsiveProp('width', ['', '496px', '496px'], '')}
      ${responsiveProp('padding', ['24px 16px', '40px', '40px'], '')}
     
      justify-content: center;
      align-items: center;
      gap: 10px;
      align-self: stretch;
      border-radius: 16px;
      background: #f3f8fe;
      .content {
        display: flex;
        // ${responsiveProp('height', ['', '562px', '562px'], '')}
        ${responsiveProp('gap', ['24px', '48px', '48px'], '')}

        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        flex: 1 0 0;
        .upper {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 24px;
          align-self: stretch;
          img {
            // ${responsiveProp('width', ['100%', '459px', '459px'], '')}
            object-fit: cover;
          }
          .text-content-card1 {
            display: flex;
            ${responsiveProp('flex-direction', ['column', 'row', 'row'], '')}
            ${responsiveProp(
              'align-items',
              ['flex-start', 'center', 'center'],
              '',
            )}
             ${responsiveProp('gap', ['32px', '', ''], '')}
            align-self: stretch;
            .text {
              ${responsiveProp(
                'border-left',
                ['', '1px solid #CEEFE4', '1px solid #CEEFE4'],
                '',
              )}

              ${responsiveProp('padding-left', ['', '22.5px', '22.5px'], '')}
      ${responsiveProp('margin-left', ['', '22.5px', '22.5px'], '')}
            }
            .everest-card-title {
              ${responsiveProp('line-height', ['24px', '28px', '28px'], '')}
              ${responsiveProp(
                'letter-spacing',
                ['-0.2px', '-0.3px', '-0.3px'],
                '',
              )}
            }
            .everest-card-desc {
              ${responsiveProp('line-height', ['18px', '24px', '24px'], '')}
              ${responsiveProp('letter-spacing', ['', '-0.2px', '-0.2px'], '')}
            }
          }
          .text-content {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
            align-self: stretch;
            .everest-card-title {
              ${responsiveProp('line-height', ['24px', '28px', '28px'], '')}
              ${responsiveProp(
                'letter-spacing',
                ['-0.2px', '-0.3px', '-0.3px'],
                '',
              )}
            }
            .everest-card-desc {
              ${responsiveProp('line-height', ['18px', '24px', '24px'], '')}
              ${responsiveProp('letter-spacing', ['', '-0.2px', '-0.2px'], '')}
            }
            .list-text {
              display: flex;
              flex-direction: column;
              gap: 12px;
              .vBorder {
                ${responsiveProp('width', ['156px', '210px', '210px'], '')}
                height: 1px;
                background: #cfe3fc;
              }
            }
          }
        }
        .link-container {
          .btn_container {
            display: flex;
            align-items: center;
            gap: 10px;

            .btn-text {
              color: #0f72ee;
              font-weight: 500;
              ${responsiveProp('font-weight', ['24px', '24px', '24px'], '')}
            }
            &:hover {
              cursor: pointer;
              text-decoration: underline #0f72ee;
            }
          }
        }
      }
    }
  }

  .separator {
    display: flex;
    align-items: center;
    text-align: center;
    ${responsiveProp(
      'width',
      ['100%', '1016px', '1016px'],
      '',
    )} .btn_container {
      display: flex;
      align-items: center;
      gap: 10px;

      .btn-text {
        color: #0f72ee;
        font-weight: 500;
        ${responsiveProp('font-weight', ['24px', '24px', '24px'], '')}
      }
      &:hover {
        cursor: pointer;
        text-decoration: underline #0f72ee;
      }
    }
  }

  .separator::before,
  .separator::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #d9dadb;
  }

  .separator:not(:empty)::before {
    margin-right: 24px;
  }

  .separator:not(:empty)::after {
    margin-left: 24px;
  }

  .cta_container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    ${responsiveProp('width', ['100%', '284px', '284px'], '')}
    &:hover {
      cursor: pointer;
      text-decoration: underline #0f72ef;
    }
  }
`;
const TagContainerStyles = styled.div`
  background: #faf7ff;
  border-radius: 16px;
  ${responsiveProp('width', ['100%', '1016px', '1016px'], '')}

  ${responsiveProp('padding', ['40px 0px', '40px', '40px'], '')}
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  .title {
    ${responsiveProp('line-height', ['32px', '36px', '36px'], '')}
    font-weight:600;
  }
  .tagContainer {
    display: flex;
    gap: 24px;
    width: 100%;
    max-width: 936px;
    overflow: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
    ${responsiveProp('padding-left', ['10px', '', ''], '')}
    .heading {
      word-break: nowrap;
    }
    .tag {
      display: flex;
      flex-direction: column;
      cursor: pointer;
      width: 100%;
      .textStyle {
        position: relative;
        ${responsiveProp('min-width', ['100px', '100%', '100%'], '')}
        padding: 16px 0px 0px;
        border-top: 2px solid #e5e5e5;
      }
      .active::before {
        content: '';
        position: absolute;
        top: -2px;
        left: 0;
        width: 100%;
        height: 2px;
        background: #0f72ef;
        animation: animate 10s linear;
      }
      .active {
        span {
          color: #191b1f;
        }
      }

      @keyframes animate {
        0% {
          width: 0px;
        }

        100% {
          width: 100%;
        }
      }
      .border {
        border-top: 2px solid #0f72ef;
      }
    }
  }
  .tagContainer::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }

  .mainContainer {
    ${responsiveProp('width', ['100%', '1016px', '1016px'], '')}
    ${responsiveProp(
      'padding',
      ['', '0px 40px 40px 40px', '0px 40px 40px 40px'],
      '',
    )}
    .review {
      display: flex;
      ${responsiveProp('flex-direction', ['column', 'row', 'row'], '')}
      justify-content: flex-start;
      align-items: center;
      ${responsiveProp('gap', ['32px', '80px', '80px'], '')}
      .leftContainer {
        ${responsiveProp('width', ['90%', '448px', '448px'], '')}
        display: flex;
        flex-direction: column;
        gap: 48px;
        .heading {
          line-height: 28px; /* 127.273% */
          letter-spacing: -0.3px;
        }
        .description {
          line-height: 24px; /* 150% */
          letter-spacing: -0.2px;
        }
        .main_content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .content-container {
          padding: 0px 0px;
          .content-text {
            ${responsiveProp('line-height', ['24px', '28px', '28px'], '')}
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 0px;
            border-bottom: 1px solid #d9dadb;
            &:nth-last-child(1) {
              border: none;
            }
          }
        }
        .link-container {
          .link-wrapper {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          :hover {
            text-decoration: underline;
            color: #0f72ee;
            cursor: pointer;
          }
        }
      }
      .rightContainer {
        ${responsiveProp('width', ['90%', '448px', '448px'], '')}
        img {
          ${responsiveProp('width', ['100%', '448px', '448px'], '')}
        }
      }
    }
  }

  progress {
    width: 100%;
    height: 6px;
  }

  .prevArrow {
    display: none;
    position: absolute;
  }
  .nextArrow {
    display: none;
    position: absolute;
  }
  .swiper-pagination {
    display: none;
  }
`;

const ProductCarousel = () => {
  const sliderRef = React.useRef(null);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [screenWidth, setScreenWidth] = React.useState(1500);
  const [intervalId, setIntervalId] = React.useState();
  const [clicked, setClicked] = React.useState(false);
  const [timeoutId, setTimeoutId] = React.useState('');
  const [animate, setAnimate] = React.useState(false);
  const componentRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const { openForm, FormComponent } = useScheduledDemoForm();
  const [selectedFormId, setSelectedFormId] = useState(null);
  const tagRefs = useRef([]);

  const handleFormSelection = (formId) => {
    setSelectedFormId(formId);
    openForm(formId);
  };

  const checkIfInView = () => {
    if (componentRef.current) {
      const rect = componentRef.current.getBoundingClientRect();
      const isInView = rect.top <= 400;

      setIsInView(isInView);
    }
  };

  useEffect(() => {
    checkIfInView();

    window.addEventListener('scroll', checkIfInView);
    window.addEventListener('resize', checkIfInView);

    return () => {
      window.removeEventListener('scroll', checkIfInView);
      window.removeEventListener('resize', checkIfInView);
    };
  }, []);

  React.useEffect(() => {
    setAnimate(false);
    sliderRef.current?.slideToLoop(currentSlide);
    if (intervalId) {
      clearInterval(intervalId);
    }
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (clicked) {
      setClicked(false);
      let timeId = setTimeout(() => {
        setAnimate(true);
        const id = setInterval(() => {
          setCurrentSlide((prev) => {
            if (prev == props.containerData.length - 1) {
              return 0;
            }
            return prev + 1;
          });
        }, 10000);
        setIntervalId(id);
      }, 15000);
      setTimeoutId(timeId);
    } else {
      if (isInView) {
        setAnimate(true);
        const id = setInterval(() => {
          setCurrentSlide((prev) => {
            if (prev == props.containerData.length - 1) {
              return 0;
            }
            return prev + 1;
          });
        }, 10000);
        setIntervalId(id);
      }
    }
    return () => {
      clearInterval(intervalId);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [currentSlide, isInView]);

  React.useEffect(() => {
    setScreenWidth(window?.innerWidth);
  }, []);

  function getWidth(idx) {
    if (screenWidth < 800) {
      return { width: '220px' };
    } else {
      return { width: idx == currentSlide ? '350px' : '176px' };
    }
  }
  const scrollToTag = (idx) => {
    if (screenWidth < 768 && tagRefs.current[idx]) {
      tagRefs.current[idx].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  };
  useEffect(() => {
    scrollToTag(currentSlide);
  }, [currentSlide]);

  return (
    <MainContainer>
      {FormComponent(selectedFormId)}
      <div className="heading_container-gartner-v3">
        <Typography
          variant="h1"
          fontWeight="600"
          fontSizes={[24, 28, 28]}
          color="#191B1F"
          dangerouslySetInnerHTML={{ __html: props.title }}
          className="content-data_1"
        />
      </div>
      <TagContainerStyles ref={componentRef}>
        <div className="mainContainer">
          <Swiper
            loop
            pagination={{ clickable: true }}
            singleLine
            slidesPerView="auto"
            spaceBetween={10}
            centeredSlides
            customArrows={true}
            navigation="basicChevronArrowsDark"
            refs={sliderRef}
            onSlideChange={() => {
              setCurrentSlide(sliderRef?.current?.realIndex ?? 0);
            }}
          >
            {props.containerData.map((item, idx) => (
              <SwiperSlide key={idx}>
                <div
                  className="carousalContainer"
                  onClick={() => sliderRef.current?.slideToLoop(idx)}
                >
                  <div className="review">
                    <div className="leftContainer">
                      <Image
                        src={item.titleImage}
                        className="image"
                        width="174px"
                      />
                      <div className="main_content">
                        <Typography
                          variant="paragraph1"
                          fontSizes={[20, 22, 22]}
                          dangerouslySetInnerHTML={{ __html: item.heading }}
                          className="heading"
                          fontWeight="600"
                          color="#32363E"
                        />
                        <Typography
                          variant="paragraph1"
                          fontSizes={[16, 18, 18]}
                          dangerouslySetInnerHTML={{ __html: item.description }}
                          className="description"
                          color="#32363E"
                        />
                      </div>
                      {/* <div className="content-container">
                      {item.content.map((e) => {
                        return (
                          <div className="content-text">
                            <Image
                              src={'/images/icons/SealCheck'}
                              svg
                              height="24px"
                              width="24px"
                            />
                            <Typography
                              variant="h1"
                              fontSizes={[16, 16, 16]}
                              dangerouslySetInnerHTML={{
                                __html: e.text,
                              }}
                              fontWeight="400"
                              className="headline"
                              color="#32363f"
                            />
                          </div>
                        );
                      })}
                    </div> */}

                      {/* <div
                        className="link-container"
                        onClick={() => handleFormSelection(item.form)}
                      >
                        <div className="link-wrapper">
                          <Typography
                            variant=""
                            fontWeight="500"
                            fontSizes={[16, 18, 18]}
                            color="#0f72ee"
                            dangerouslySetInnerHTML={{ __html: item.cta }}
                            className="content-data"
                          />
                          <div className="icon">
                            <img
                              src="/images/icons/rightBlueArrow.png"
                              width="15px"
                            />
                          </div>
                        </div>
                      </div> */}
                    </div>

                    <div className="rightContainer">
                      <Image src={item.image} height="auto" width="100%" />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="tagContainer">
          {props.tags.map((item, idx) => {
            return (
              <div
                className="tag"
                onClick={() => {
                  setClicked(true);
                  setCurrentSlide(idx);
                }}
                ref={(el) => (tagRefs.current[idx] = el)}
              >
                <div
                  className={
                    idx == currentSlide && animate
                      ? 'textStyle active'
                      : idx == currentSlide
                      ? 'textStyle border'
                      : 'textStyle'
                  }
                  style={getWidth(idx)}
                >
                  <Typography
                    variant="h1"
                    fontSizes={[18, 18, 18]}
                    dangerouslySetInnerHTML={{ __html: item.tagName }}
                    className="heading"
                    color="#656971"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </TagContainerStyles>

      <div className="main-everest-cont">
        <div className="card green">
          <div className="content">
            <div className="upper">
              <div className="text-content-card1">
                <Image src={'/images/gartner/gartnerLogo'} width="40px" />

                <div className="text">
                  <Typography
                    variant=""
                    className="everest-card-desc"
                    text={`Leena AI has been mentioned in 40+ G2 reports for 2024.`}
                    fontSizes={[12, 16, 16]}
                    fontWeight="400"
                    color="#656971"
                  />
                </div>
              </div>
            </div>
            <div className="awards_container-gartner-v3">
              <div className="awards_sub_container">
                {props.awards.map((item) => (
                  <div className="award_image">
                    <Image src={item.awardImage} width="64px" height="auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="content">
            <div className="upper">
              <Image src={everstGroup[1].image} width="183px" />
              <div className="text-content">
                <Typography
                  variant=""
                  className="everest-card-desc"
                  text={everstGroup[1].description}
                  fontSizes={[12, 16, 16]}
                  fontWeight="400"
                  color="#656971"
                />
                {everstGroup[1].list.map((item) => (
                  <div className="list-text">
                    <Typography
                      variant=""
                      className="everest-card-title"
                      text={item.text}
                      fontSizes={[12, 16, 16]}
                      fontWeight="600"
                      color="#191B1F"
                    />
                    <div className="vBorder"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        {/* <div className="awards_container-gartner-v3">
          <div className="awards_sub_container">
            {props.awards.map((item) => (
              <div className="award_image">
                <Image src={item.awardImage} width="80px" height="auto" />
              </div>
            ))}
          </div>
          <div className="awards_sub_container">
              {data.awards.slice(5, 9).map((item) => {
                return <Image src={item.awardImage} className="award_image" />;
              })}
            </div>
        </div> */}
      </div>
      <div className="separator">
        <Link href="/recognition">
          <div className="btn_container">
            <Typography
              variant="h1"
              className="btn-text"
              text={'See all recognitions'}
              fontSizes={[18, 18, 18]}
              color="#0F72EF"
            />
            <Image
              svg
              src="/images/icons/arrowRightBlue"
              height="auto"
              width="16px"
            />
          </div>
        </Link>
      </div>
    </MainContainer>
  );
};

export default ProductCarousel;
