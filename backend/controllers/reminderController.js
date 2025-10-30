const asyncHandler = require('../utils/asyncHandler');
const Reminder = require('../models/Reminder');

// @desc    Get all reminders
// @route   GET /api/reminders
// @access  Private
exports.getReminders = asyncHandler(async (req, res) => {
  const reminders = await Reminder.find({ user: req.user._id }).sort({
    date: 1,
  });

  res.status(200).json({
    success: true,
    count: reminders.length,
    data: reminders,
  });
});

// @desc    Get single reminder
// @route   GET /api/reminders/:id
// @access  Private
exports.getReminder = asyncHandler(async (req, res) => {
  const reminder = await Reminder.findById(req.params.id);

  if (!reminder) {
    return res.status(404).json({
      success: false,
      message: 'Reminder not found',
    });
  }

  // Make sure user owns reminder
  if (reminder.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this reminder',
    });
  }

  res.status(200).json({
    success: true,
    data: reminder,
  });
});

// @desc    Create new reminder
// @route   POST /api/reminders
// @access  Private
exports.createReminder = asyncHandler(async (req, res) => {
  const { recipient, amount, date, time, note, repeat } = req.body;

  // Validation
  if (!recipient || !amount || !date || !time) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields',
    });
  }

  const reminder = await Reminder.create({
    user: req.user._id,
    recipient,
    amount,
    date,
    time,
    note,
    repeat: repeat || 'none',
  });

  res.status(201).json({
    success: true,
    data: reminder,
  });
});

// @desc    Update reminder
// @route   PUT /api/reminders/:id
// @access  Private
exports.updateReminder = asyncHandler(async (req, res) => {
  let reminder = await Reminder.findById(req.params.id);

  if (!reminder) {
    return res.status(404).json({
      success: false,
      message: 'Reminder not found',
    });
  }

  // Make sure user owns reminder
  if (reminder.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this reminder',
    });
  }

  reminder = await Reminder.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: reminder,
  });
});

// @desc    Delete reminder
// @route   DELETE /api/reminders/:id
// @access  Private
exports.deleteReminder = asyncHandler(async (req, res) => {
  const reminder = await Reminder.findById(req.params.id);

  if (!reminder) {
    return res.status(404).json({
      success: false,
      message: 'Reminder not found',
    });
  }

  // Make sure user owns reminder
  if (reminder.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this reminder',
    });
  }

  await reminder.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get reminders for a specific date
// @route   GET /api/reminders/date/:date
// @access  Private
exports.getRemindersByDate = asyncHandler(async (req, res) => {
  const { date } = req.params;

  const reminders = await Reminder.find({
    user: req.user._id,
    date: date,
  });

  res.status(200).json({
    success: true,
    count: reminders.length,
    data: reminders,
  });
});

