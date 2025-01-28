// import { debounce } from '@material-ui/core';
// import React, { useCallback, useEffect, useState } from 'react';

// export enum componentStates {
//   LOADING = 'loading',
//   ERROR = 'error',
//   EMPTY = 'empty',
//   NONE = 'none'
// }
// interface IState {
//   loadingState: componentStates;
//   totalCount: number;
//   total: number;
//   skip: number;
//   data: Array<any>;
//   searchString: string;
// }
// type ExtraParams = { resetPagination?: boolean } & {
//   [key: string]: any;
// };
// export const usePaginationWithSearchAndFilter = (props: {
//   pageSize?: number;
//   debounceTime?: number;
//   initialData?: Partial<IState>;
//   fetchData: (data: {
//     skip: number;
//     limit: number;
//     page: number;
//     searchString?: string;
//   }) => Promise<{ totalCount: number; data: Array<any> }>;
//   dontCallOnMount?: boolean;
// }) => {
//   const { pageSize = 50, fetchData, debounceTime = 500, dontCallOnMount, initialData = {} } = props;
//   const [state, setState] = useState<IState>({
//     loadingState: componentStates.NONE,
//     skip: 0,
//     totalCount: pageSize + 1, //to make initial call
//     total: 0,
//     data: [],
//     searchString: null,
//     ...initialData
//   });
//   const { loadingState, totalCount, total, data, skip, searchString } = state;
//   useEffect(() => {
//     if (!dontCallOnMount) fetchNext({});
//   }, []);
//   const resetPagination = ({ total }) => {
//     setState(prev => ({
//       ...prev,
//       loadingState: componentStates.NONE,
//       skip: 0,
//       totalCount: pageSize + 1, //to make initial call
//       total: total ?? 0,
//       data: [],
//       searchString: null
//     }));
//   };
//   const setPaginationData = (data: Partial<IState>) => {
//     setState(prev => ({ ...prev, ...data }));
//   };
//   const fetchNext = async (extraParams = {} as ExtraParams) => {
//     const resetProperties = extraParams.resetPagination
//       ? {
//           skip: 0,
//           totalCount: pageSize + 1, //to make initial call
//           data: [],
//           searchString: null
//         }
//       : {};

//     const skipToUse = extraParams.resetPagination ? 0 : skip;

//     if (skipToUse < totalCount) {
//       setState(prev => ({ ...prev, ...resetProperties, loadingState: componentStates.LOADING }));
//       const { data, totalCount } = await fetchData({
//         skip: skipToUse,
//         limit: pageSize,
//         page: skipToUse ? skipToUse / pageSize + 1 : 1,
//         searchString,
//         ...extraParams
//       });
//       setState(prev => ({
//         ...prev,
//         skip: data.length < pageSize ? prev.totalCount + 1 : prev.skip + pageSize,
//         totalCount,
//         total: totalCount,
//         data: [...prev.data, ...data],
//         loadingState: componentStates.NONE
//       }));
//     }
//   };
//   const debouncedSearch = useCallback(
//     debounce(async searchString => {
//       //if searching, reset everything to first page data
//       const { data, totalCount } = await fetchData({
//         skip: 0,
//         limit: pageSize,
//         page: 1,
//         searchString
//       });
//       setState(prev => ({
//         ...prev,
//         skip: pageSize,
//         totalCount,
//         data: data,
//         loadingState: componentStates.NONE
//       }));
//     }, debounceTime),
//     [totalCount, skip] //DONT add data,search string here
//   );
//   const handleSearch = async (searchString: string) => {
//     setState(prev => ({ ...prev, searchString, data: [], loadingState: componentStates.LOADING }));
//     debouncedSearch(searchString);
//   };
//   const getNextPageParams = () => {
//     setState(prev => ({ ...prev, skip: prev.skip + pageSize }));
//     return { skip: skip + pageSize };
//   };
//   return {
//     loadingState,
//     totalCount,
//     total,
//     skip,
//     data,
//     fetchNext,
//     handleSearch,
//     searchString,
//     resetPagination,
//     getNextPageParams,
//     setPaginationData
//   };
// };
