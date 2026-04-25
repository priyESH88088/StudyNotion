const { instance } = require("../config/razorpay")
const Course = require("../models/Course")
const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const mongoose = require("mongoose")
const crypto = require("crypto")
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail")
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail")
const CourseProgress = require("../models/CourseProgress") // ✅ ADDED

// Initiate Razorpay Order
exports.capturePayment = async (req, res) => {
  const { courses } = req.body;
  const userId = req.user.id;

  if (courses.length === 0) {
    return res.status(401).json({
      success: false,
      message: "Please choose atleast one course"
    })
  }

  let totalAmount = 0;

  for (const course_id of courses) {
    let course;
    try {
      course = await Course.findById(course_id);
      if (!course) {
        return res.status(401).json({
          success: false,
          message: "No course found for this id try again"
        })
      }

      const uid = new mongoose.Types.ObjectId(userId);
      if (course.studentsEnrolled.includes(uid)) {
        return res.status(403).json({
          success: false,
          message: "User already enrolled"
        })
      }

      totalAmount += course.price;

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong while initiating the razorpay order"
      })
    }
  }

  const options = {
    amount: totalAmount * 100,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
  }

  try {
    const paymentResponse = await instance.orders.create(options);
    return res.status(200).json({
      success: true,
      message: paymentResponse,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not initiate order"
    })
  }
}

// Verify Payment
exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const courses = req.body?.courses;
  const userId = req.user.id;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId) {
    return res.status(200).json({
      success: false,
      message: "Payment Failed"
    });
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    await enrollStudents(courses, userId, res);
    return res.status(200).json({
      success: true,
      message: "Payment Verified"
    });
  }

  return res.status(200).json({
    success: false,
    message: "Payment Failed"
  });
}

// Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;
  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please provide all the details"
    });
  }

  try {
    const enrolledStudent = await User.findById(userId);
    await mailSender(
      enrolledStudent.email,
      "Payment Received",
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    );
    return res.status(200).json({
      success: true,
      message: "Email sent successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not send email"
    });
  }
}

// Helper - Enroll Students
const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please provide data for Courses or UserId"
    });
  }

  for (const courseId of courses) {
    try {
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        return res.status(500).json({
          success: false,
          message: "Course not found"
        });
      }

      // ✅ FIXED: CourseProgress document create karo enrollment pe
      await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      });

      await User.findByIdAndUpdate(
        userId,
        { $push: { courses: courseId } },
        { new: true }
      );

      const student = await User.findById(userId);
      await mailSender(
        student.email,
        `Successfully Enrolled in ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${student.firstName} ${student.lastName}`
        )
      );

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}
