export function checkSameOffice(oldCode, newData) {
  // console.log('oldCode: ', oldCode);
  // console.log('newData: ', newData);
  // console.log('newDataLength: ', newData.datas.length);

  const newDataLength = newData.length
  const newCode = newData[0]?.office

  if (newDataLength == 1) {
    // console.log('newCode: ', newCode);
    // console.log('oldCode: ', oldCode);

    return oldCode == newCode
  } else {
    return false
  }
}
