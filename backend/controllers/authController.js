const Student = require('../models/Student');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new student
// @route   POST /api/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if student exists
    const studentExists = await Student.findOne({ email });
    if (studentExists) {
      return res.status(400).json({ message: 'Duplicate email: Student already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create student
    const student = await Student.create({
      name,
      email,
      password: hashedPassword,
    });

    if (student) {
      res.status(201).json({
        _id: student.id,
        name: student.name,
        email: student.email,
        token: generateToken(student._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid student data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a student
// @route   POST /api/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });

    if (student && (await bcrypt.compare(password, student.password))) {
      res.json({
        _id: student.id,
        name: student.name,
        email: student.email,
        token: generateToken(student._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid login: Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
