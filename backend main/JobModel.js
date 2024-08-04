const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  job_cd: {
    type: String,
    required: true,
  },
  contractor_name: {
    type: String,
    required: true,
  },
  contractor_address: String,
  work_area: {
    type: String,
    required: true,
  },
  job_end_dt: {
    type: String,
    required: true,
  },
  party_cd: {
    type: String,
    required: true,
  },
  job_desc: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("JobData", jobSchema);