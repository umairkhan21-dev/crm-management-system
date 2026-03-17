const Employee = require('../models/employee');
const mongoose = require('mongoose');

exports.addEmployee = async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json({ message: "employee added", employee });
  } catch (err) {
    res.status(500).json({ message: "failed to add employee", error: err.message });
  }
};

exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: "failed to fetch employees", error: err.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ message: "employee updated", employee });
  } catch (err) {
    res.status(500).json({ message: "failed to update employee", error: err.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid employee ID" });
    }

    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ message: "employee deleted", employee });
  } catch (err) {
    res.status(500).json({ message: "failed to delete employee", error: err.message });
  }
};
