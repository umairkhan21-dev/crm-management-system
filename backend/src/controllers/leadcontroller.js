const Lead = require("../models/lead"); 

const allowedSources = ["website", "instagram", "facebook", "referral", "cold-call", "others"];
const allowedStatuses = ["New", "Contacted", "Interested", "Hot", "Warm", "Cold", "Converted", "Lost"];

const normalizeSource = (value) => {
  if (typeof value !== "string" || !value.trim()) {
    return "others";
  }

  const normalized = value.trim().toLowerCase();
  return allowedSources.includes(normalized) ? normalized : "others";
};

const normalizeStatus = (value) => {
  if (typeof value !== "string" || !value.trim()) {
    return "New";
  }

  const normalized = value.trim();
  return allowedStatuses.includes(normalized) ? normalized : "New";
};

exports.addLead = async (req, res) => {
  try {
    const leadData = {
      name: req.body.name,
      email: req.body.email?.trim().toLowerCase() || "",
      phone: req.body.phone || "",
      source: normalizeSource(req.body.source),
      status: normalizeStatus(req.body.status),
      notes: req.body.notes || "",
      assignedTo: req.user.id,
    };

    const newLead = new Lead({
      ...leadData,
      activity: [
        {
          action: "Lead Created",
          by: req.user.id
        }
      ]
    });
    await newLead.save();

    res.status(201).json({ message: "Lead added", lead: newLead });
  } catch (err) {
    res.status(500).json({ message: "Failed to add lead", error: err.message });
  }
};

exports.getLeads = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "staff") {
      filter = {
        $or: [
          { assignedTo: req.user.id },
          { assignedTo: null }
        ]
      };
    }

    const leads = await Lead.find(filter).populate("assignedTo", "name email role");
    res.status(200).json(leads);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch leads",
      error: err.message,
    });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    if (
      req.user.role === "staff" &&
      lead.assignedTo?.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }
    if (req.body.status && req.body.status !== lead.status) {
      lead.activity.push({
        action: `Status changed from ${lead.status} to ${req.body.status}`,
        by: req.user.id,
        at: new Date(),
      });
    } else {
      lead.activity.push({
        action: "Lead updated",
        by: req.user.id,
        at: new Date(),
      });
    }
    if (req.body.source !== undefined) {
      req.body.source = normalizeSource(req.body.source);
    }

    if (req.body.status !== undefined) {
      req.body.status = normalizeStatus(req.body.status);
    }

    Object.assign(lead, req.body);
    await lead.save();

    res.json({
      message: "Lead updated successfully",
      lead,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: "Lead deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete lead", error: err.message });
  }
};
