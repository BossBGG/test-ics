// const filterValueGlobal = ref("");

// export const filterFn = (val, update) => {

//   filterValueGlobal.value = val;
//   console.log('filterValueGlobal.value: ', filterValueGlobal.value);
//   update();
// };

// export function filteredOptions(options, searchBy) {
//   if (!filterValueGlobal.value) {
//     return options;
//   }
//   const needle = filterValueGlobal.value.toLowerCase();
//   return options.filter((option) => {
//     const code = option[searchBy] ? option[searchBy].toLowerCase() : "";
//     return code.includes(needle);
//   });
// }

// export const filterFnAutoSelect = (val: string, update: (callback: () => void, callbackRef: (ref: any) => void) => void, abort: () => void) => {
//   setTimeout(() => {
//     update(
//       () => {
//         if (val === '') {
//           options.value = stringOptions;
//         } else {
//           const needle = val.toLowerCase();
//           options.value = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1);
//         }
//       },

//       (ref: any) => {
//         if (val !== '' && ref.options.length > 0 && ref.getOptionIndex() === -1) {
//           ref.moveOptionSelection(1, true); // focus the first selectable option and do not update the input-value
//           ref.toggleOption(ref.options[ref.optionIndex], true); // toggle the focused option
//         }
//       }
//     );
//   }, 300);
// };


