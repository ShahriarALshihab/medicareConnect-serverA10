import Stripe from "stripe";
import Payment from "../models/Payment.js";
import Appointment from "../models/Appointment.js";


const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  try {
    const { fee } = req.body;
    const amountInCents = Math.round(Number(fee) * 100);

    const paymentIntent = await getStripe().paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const recordPayment = async (req, res) => {
  try {
    const {
      appointmentId,
      patientId,
      patientEmail,
      doctorId,
      amount,
      transactionId,
    } = req.body;

    const payment = await Payment.create({
      appointmentId,
      patientId,
      patientEmail,
      doctorId,
      amount,
      transactionId,
    });

    await Appointment.findByIdAndUpdate(appointmentId, {
      paymentStatus: "paid",
    });

    res.status(201).send(payment);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const getPatientPayments = async (req, res) => {
  const payments = await Payment.find({ patientEmail: req.params.email }).sort({
    createdAt: -1,
  });
  res.send(payments);
};

export const getAllPaymentsAdmin = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const total = await Payment.countDocuments();
  const payments = await Payment.find()
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .sort({ createdAt: -1 });
  res.send({
    payments,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  });
};
