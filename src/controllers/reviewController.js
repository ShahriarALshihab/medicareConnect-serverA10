import Review from "../models/Review.js";
import Doctor from "../models/Doctor.js";

const recalculateDoctorRating = async (doctorId) => {
  const reviews = await Review.find({ doctorId });
  const ratingCount = reviews.length;
  const ratingAverage = ratingCount
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / ratingCount
    : 0;
  await Doctor.findByIdAndUpdate(doctorId, { ratingAverage, ratingCount });
};

export const createReview = async (req, res) => {
  try {
    const review = await Review.create(req.body);
    await recalculateDoctorRating(review.doctorId);
    res.status(201).send(review);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const getPatientReviews = async (req, res) => {
  const reviews = await Review.find({ patientEmail: req.params.email }).sort({
    createdAt: -1,
  });
  res.send(reviews);
};

export const getDoctorReviews = async (req, res) => {
  const reviews = await Review.find({ doctorId: req.params.doctorId }).sort({
    createdAt: -1,
  });
  res.send(reviews);
};

export const getRecentReviews = async (req, res) => {
  const reviews = await Review.find({ rating: { $gte: 4 } })
    .sort({ createdAt: -1 })
    .limit(6);
  res.send(reviews);
};

export const updateReview = async (req, res) => {
  const { rating, reviewText } = req.body;
  const updated = await Review.findByIdAndUpdate(
    req.params.id,
    { rating, reviewText },
    { new: true },
  );
  await recalculateDoctorRating(updated.doctorId);
  res.send(updated);
};

export const deleteReview = async (req, res) => {
  const deleted = await Review.findByIdAndDelete(req.params.id);
  if (deleted) await recalculateDoctorRating(deleted.doctorId);
  res.send(deleted);
};
