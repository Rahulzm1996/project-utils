// import { useDispatch } from 'react-redux';
// import { getHashMapCache } from '../selectors';
// import { updateHashMapCache } from '../actions';

// const useAPICaller = () => {
//   const dispatch = useDispatch();
//   const hashMap = getHashMapCache();

//   const cachedApiCaller = async (requestArray, callback) => {
//     const hashValue = JSON.stringify({
//       requestArray: requestArray,
//       callback: callback.name,
//       callbackLength: callback.length
//     });

//     if (!hashMap[hashValue]) {
//       const response = await callback(requestArray);
//       dispatch(updateHashMapCache({ key: hashValue, data: response }));
//       return response;
//     } else {
//       return hashMap[hashValue];
//     }
//   };
//   return {
//     cachedApiCaller: cachedApiCaller
//   };
// };

// export default useAPICaller;
