const express = require("express");
const mongoose = require("mongoose");
const WorkerData = require("./models/WorkerModel");
const AgencyData = require("./models/AgencyModel");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

mongoose
  .connect(
    "mongodb+srv://divyanelli14:Divya%4014@cluster0.ydwmy0r.mongodb.net/workerDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Route to fetch workers with valid passes
app.get("/api/workers", async (req, res) => {
  const currentDate = new Date();
  try {
    const workers = await WorkerData.find({
      spass_no: { $ne: null },
      gpass_no: { $ne: null },
      gpass_expiry_dt: { $gte: currentDate },
    });
    res.json(workers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/agencies", async (req, res) => {
  try {
    const agencies = await AgencyData.find();
    res.json(agencies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/agencies/:agency_code", async (req, res) => {
  const { agency_code } = req.params;
  console.log(`Received agency_code: ${agency_code}`);

  try {
    const agency = await AgencyData.find({ agency_code: agency_code });

    if (!agency) {
      console.log(`No agency found for AGENCY_CODE: ${agency_code}`);
      return res.status(404).json({ message: "Agency not found" });
    }
    res.json(agency);
  } catch (err) {
    console.error(`Error querying for agency: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/worker/:job_code", async (req, res) => {
  const { job_code } = req.params;
  console.log(`Received job_code: ${job_code}`);

  try {
    const worker = await WorkerData.find({ job_cd: job_code });

    if (!worker) {
      return res.status(404).json({ message: "Agency not found" });
    }
    res.json(worker);
  } catch (err) {
    console.error(`Error querying for worker: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/workers/:agency_code/:job_code", async (req, res) => {
  const { agency_code, job_code } = req.params;

  try {
    const agency = await AgencyData.findOne({ agency_code });
    if (!agency) {
      return res.status(404).json({ message: "Agency not found" });
    }

    if (!agency.job_cd.includes(job_code)) {
      return res.status(404).json({ message: "Job code not found in agency" });
    }

    const workers = await WorkerData.find({ job_cd: job_code });
    res.json(workers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
