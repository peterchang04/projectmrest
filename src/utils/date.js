module.exports.add = (date, minutes) => {
  const days = minutes / 1440;
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

module.exports.diff = (date1, date2) => { // return number by which date1 is less than date2
  const diffms = date2.getTime() - date1.getTime();
  return diffms / 60000;
}

module.exports.fromISO = (isoString) => { // yyyy-mm-ddThh:mm:ssZ || ...hh:mm:ss:mmmZ
  const dateSplit = isoString.split('T');
  const datePart = dateSplit[0];
  const timePart = dateSplit[1].replace('Z', '');
  return new Date(`${datePart} ${timePart} UTC`);
}
