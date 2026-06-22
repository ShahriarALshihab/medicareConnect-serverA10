import Prescription from "../models/Prescription.js";


export const createPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.create(req.body);
    res.status(201).send(prescription);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};


export const updatePrescription = async (req, res) => {
  const { diagnosis, medications, notes } = req.body;
  const updated = await Prescription.findByIdAndUpdate(
    req.params.id,
    { diagnosis, medications, notes },
    { new: true }
  );
  res.send(updated);
};


export const getPrescriptionByAppointment = async (req, res) => {
  const prescription = await Prescription.findOne({ appointmentId: req.params.appointmentId });
  res.send(prescription || null);
};


export const getPatientPrescriptions = async (req, res) => {
  const prescriptions = await Prescription.find({ patientId: req.params.patientId }).sort({ createdAt: -1 });
  res.send(prescriptions);
};
