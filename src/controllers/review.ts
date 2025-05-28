import { Request, Response } from "express";
import Review from "../models/Review";

export const postReview = async (req: Request, res: Response) => {
  const data = await Review.create(req.body);

  res.status(201).json({
    message: "Review created successfully",
    data,
  });
};

export const getReviewsByCourseId = async (req: Request, res: Response) => {
  const data = await Review.find({ course: req.params.id })
    .populate("user", "name")
    .sort({ createdAt: -1 });

  if (!data) {
    res.status(404).json({
      message: "Reviews not found",
    });
    return;
  }

  res.status(200).json({
    message: "Reviews fetched successfully",
    data,
  });
};

export const updateOwnReview = async (req: Request, res: Response) => {
  const userId = req.user;

  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404).json({
      message: "Review not found",
    });
    return;
  }

  if (review.user._id.toString() !== userId) {
    res.status(403).json({
      message: "Not authorized to update this review",
    });
    return;
  }

  const data = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json({
    message: "Review updated successfully",
    data,
  });
};

export const deleteOwnReview = async (req: Request, res: Response) => {
  const userId = req.user;

  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404).json({
      message: "Review not found",
    });
    return;
  }

  if (review.user._id.toString() !== userId) {
    res.status(403).json({
      message: "Not authorized to delete this review",
    });
    return;
  }

  await Review.findByIdAndDelete(req.params.id);

  res.status(200).json({
    message: "Review deleted successfully",
  });
};
