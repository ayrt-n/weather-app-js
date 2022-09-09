const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// Input hour in military time, return string in am/pm format
function formatHour(hour) {
  if (hour < 12) {
    return `${hour} am`;
  }

  if (hour === 12) {
    return '12 pm';
  }

  return `${hour - 12} pm`;
}

function formatDayMonth(day, month) {
  return `${months[month]} ${day}`;
}

export {
  formatHour,
  formatDayMonth,
};
