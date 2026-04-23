const Grievance = require('../models/Grievance');

// @desc    Submit a new grievance
// @route   POST /api/grievances
exports.createGrievance = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    const grievance = await Grievance.create({
      title,
      description,
      category,
      student: req.studentId, // From authMiddleware
    });

    res.status(201).json(grievance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all grievances for logged-in student
// @route   GET /api/grievances
exports.getGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find({ student: req.studentId }).sort({ date: -1 });
    res.status(200).json(grievances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get grievance by ID
// @route   GET /api/grievances/:id
exports.getGrievanceById = async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }

    // Make sure the logged-in student matches the grievance student
    if (grievance.student.toString() !== req.studentId) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    res.status(200).json(grievance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update grievance
// @route   PUT /api/grievances/:id
exports.updateGrievance = async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }

    // Check for user authorization
    if (grievance.student.toString() !== req.studentId) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedGrievance = await Grievance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedGrievance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete grievance
// @route   DELETE /api/grievances/:id
exports.deleteGrievance = async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }

    // Check for user authorization
    if (grievance.student.toString() !== req.studentId) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await grievance.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search grievances by title
// @route   GET /api/grievances/search?title=xyz
exports.searchGrievances = async (req, res) => {
  try {
    const titleRegex = new RegExp(req.query.title, 'i'); // Case-insensitive search
    const grievances = await Grievance.find({
      student: req.studentId,
      title: titleRegex,
    });

    res.status(200).json(grievances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
