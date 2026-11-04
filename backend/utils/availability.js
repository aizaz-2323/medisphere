function getAvailableSlots({ openTime, closeTime, slotDurationMinutes, bookedTimes }) {
  if (!openTime || !closeTime) return []; // clinic closed that day

  const toMinutes = (t) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  const toTimeString = (mins) => {
    const h = String(Math.floor(mins / 60)).padStart(2, '0');
    const m = String(mins % 60).padStart(2, '0');
    return `${h}:${m}`;
  };

  const start = toMinutes(openTime);
  const end = toMinutes(closeTime);
  const duration = Number(slotDurationMinutes) || 30;
  const bookedSet = new Set(bookedTimes || []); // e.g. ["09:30", "10:00"]

  const slots = [];
  for (let t = start; t + duration <= end; t += duration) {
    const slotStr = toTimeString(t);
    if (!bookedSet.has(slotStr)) {
      slots.push(slotStr);
    }
  }
  return slots;
}

module.exports = { getAvailableSlots };