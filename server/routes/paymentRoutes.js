const express = require('express');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { generateInvoicePDF, normalizeInvoiceNumber } = require('../utils/pdfGenerator');
const { sendCourseEnrollmentEmail } = require('../utils/emailService');

const router = express.Router();

// GET all enrollments for a user (Payment History)
router.get('/history', protect, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ studentEmail: req.user.emailOrPhone })
      .populate('course', 'title category thumbnailUrl accessValidity duration price')
      .sort('-createdAt');
      
    res.json({ success: true, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error fetching payment history', error: error.message });
  }
});

// Download PDF Invoice
router.get('/invoice/:enrollmentId/download', protect, async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.enrollmentId).populate('course');
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const user = await User.findOne({ emailOrPhone: enrollment.studentEmail });
    let studentName = user?.name;
    if (!studentName && user?.firstName) {
      studentName = `${user.firstName} ${user.lastName || ''}`.trim();
    }
    if (!studentName) {
      studentName = enrollment.studentEmail.split('@')[0];
    }

    const invoiceNumber = normalizeInvoiceNumber(enrollment.invoiceNumber || `MARMAX-INV-${enrollment._id.toString().slice(-6).toUpperCase()}`);
    const invoiceBuffer = await generateInvoicePDF({
      invoiceNumber,
      studentName,
      studentEmail: enrollment.studentEmail,
      courseTitle: enrollment.course?.title || 'Yoga Course',
      amountPaid: enrollment.amountPaid,
      paymentDate: new Date(enrollment.createdAt).toLocaleDateString('en-IN'),
      accessValidity: enrollment.course?.accessValidity || '2 Months'
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Content-Disposition', `attachment; filename=Invoice-${invoiceNumber}.pdf`);
    res.send(invoiceBuffer);
  } catch (error) {
    console.error('Error downloading invoice:', error);
    res.status(500).json({ success: false, message: 'Error generating invoice PDF' });
  }
});

router.post('/create-order', protect, async (req, res) => {
  return res.status(410).json({
    success: false,
    message: 'Course enrollment is handled through WhatsApp. Razorpay has been disabled.'
  });
});

router.post('/verify-payment', protect, async (req, res) => {
  return res.status(410).json({
    success: false,
    message: 'Razorpay payment verification is disabled. Please enroll via WhatsApp.'
  });
});

module.exports = router;
