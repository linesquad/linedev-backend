import { Request, Response } from "express";
import Review from "../models/Review";
import Course from "../models/Courses";
import mongoose from "mongoose";

async function statisticsCourseRatings(courseId: string) {
  const aggregationResult = await Review.aggregate([
    { $match: { course: new mongoose.Types.ObjectId(courseId) } },
    {
      $group: {
        _id: "$course",
        numberOfReviews: { $sum: 1 },
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  let numberOfReviews = 0;
  let averageRating = 0;

  if (aggregationResult.length > 0) {
    numberOfReviews = aggregationResult[0].numberOfReviews;
    averageRating = parseFloat(aggregationResult[0].averageRating.toFixed(1));
  }

  await Course.findByIdAndUpdate(courseId, {
    numberOfReviews,
    averageRating,
  });
}

export const createReview = async (req: Request, res: Response) => {
  const { course, rating, comment } = req.body;
  const userId = req.user;

  const courseExists = await Course.findById(course);
  if (!courseExists) {
    res.status(404).json({ message: "Course not found" });
    return;
  }

  const existingReview = await Review.findOne({ course, user: userId });
  if (existingReview) {
    res.status(400).json({ message: "You have already reviewed this course" });
    return;
  }

  const review = await Review.create({
    course,
    user: userId,
    rating,
    comment,
  });

  await statisticsCourseRatings(course);

  res
    .status(201)
    .json({ message: "Review created successfully", data: review });
};

export const updateOwnReview = async (req: Request, res: Response) => {
  const userId = req.user;

  const review = await Review.findOne({ _id: req.params.id, user: userId });

  if (!review) {
    res.status(404).json({
      message: "Review not found or you don't have permission to update it",
    });
    return;
  }

  const updatedReview = await Review.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  await statisticsCourseRatings(review.course.toString());

  res
    .status(200)
    .json({ message: "Review updated successfully", data: updatedReview });
};

export const deleteOwnReview = async (req: Request, res: Response) => {
  const userId = req.user;

  const review = await Review.findOne({ _id: req.params.id, user: userId });

  if (!review) {
    res.status(404).json({
      message: "Review not found or you don't have permission to delete it",
    });
    return;
  }

  const courseId = review.course.toString();

  await Review.findByIdAndDelete(req.params.id);

  await statisticsCourseRatings(courseId);

  res.status(200).json({ message: "Review deleted successfully" });
};

export const getReviewsByCourse = async (req: Request, res: Response) => {


  const courseExists = await Course.findById(req.params.id);
  if (!courseExists) {
    res.status(404).json({ message: "Course not found" });
    return;
  }

  const reviews = await Review.find({ course: req.params.id }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    message: "Reviews fetched successfully",
    data: reviews,
    meta: {
      averageRating: courseExists.averageRating,
      numberOfReviews: courseExists.numberOfReviews,
    },
  });
};
