// import React from 'react';
// import { isScrolledToEnd } from 'containers/Engage/utils/CommonUtils';
// import styled from 'styled-components';

// export const ScrollListStyle = styled.div`
//   height: 100%;
//   overflow: auto;
//   -ms-overflow-style: none; /* IE and Edge */
//   scrollbar-width: none;
// `;

// const ScrollList = props => {
//   const handleScroll = event => {
//     if (props.loading) {
//       return;
//     }
//     if (props.handleScroll) props.handleScroll(event);
//     if (isScrolledToEnd(event) && props.onScrollEnd) {
//       props.onScrollEnd();
//     }
//   };
//   return (
//     <ScrollListStyle
//       className="infiniteScrollList"
//       onScroll={handleScroll}
//       id="Infinite_Scroll_List"
//     >
//       {props.list.map((List, idx) => {
//         const { itemProps, idKey } = props;
//         let key = List._id + `idx-${idx}`;
//         if (idKey) key = List[idKey] + `idx-${idx}`;
//         const componentProps = {
//           ...List,
//           itemIndex: idx,
//           ...itemProps
//         };
//         return <props.ItemComponent {...componentProps} key={key} />;
//       })}
//       {props.loading && props.LoaderComponent ? <props.LoaderComponent {...props} /> : null}
//     </ScrollListStyle>
//   );
// };

// export default ScrollList;


// export const isScrolledToEnd = event => {
//     const element = event.target;
//     if (element.scrollTop + 1 > element.scrollHeight - element.clientHeight) {
//       return true;
//     }
//     return false;
//   };