// Utility functions for emitting Socket.io events

// Emit transaction update to user's room
const emitTransactionUpdate = (io, userId, event, data) => {
  io.to(`user-${userId}`).emit(event, data);
};

// Emit reminder update to user's room
const emitReminderUpdate = (io, userId, event, data) => {
  io.to(`user-${userId}`).emit(event, data);
};

module.exports = {
  emitTransactionUpdate,
  emitReminderUpdate,
};

