import { Request, Response } from "express";
import Comment from "../models/Comment";

export const createComment = async (req: Request, res: Response) => {
  const comment = await Comment.create(req.body);
  res.status(201).json({ message: "Comment created successfully", comment });
};

export const getAllComments = async (req: Request, res: Response) => {
  const comments = await Comment.find({ blog: req.params.blogId }).sort({
    createdAt: -1,
  });
  res.status(200).json({ message: "Comments fetched successfully", comments });
};

export const getApprovedComments = async (req: Request, res: Response) => {
  const comments = await Comment.find({
    blog: req.params.blogId,
    approved: true,
  }).sort({ createdAt: -1 });
  res
    .status(200)
    .json({ message: "Approved comments fetched successfully", comments });
};

export const approveComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { approved } = req.body;

  try {
    const comment = await Comment.findByIdAndUpdate(
      id,
      { approved },
      { new: true }
    );

    if (!comment) {
       res.status(404).json({ message: "Comment not found" });
       return
    }

    res.status(200).json({ message: "Comment approved successfully", comment });
  } catch (error) {
    res.status(500).json({ message: "Error updating comment", error });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedComment = await Comment.findByIdAndDelete(id);
  res
    .status(200)
    .json({ message: "Comment deleted successfully", deletedComment });
};
