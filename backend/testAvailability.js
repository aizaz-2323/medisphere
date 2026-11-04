const { getAvailableSlots } = require('./utils/availability');

console.log(
  getAvailableSlots({
    openTime: '09:00',
    closeTime: '10:00',
    slotDurationMinutes: 30,
    bookedTimes: ['09:00'],
  })
);