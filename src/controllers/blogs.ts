import { Request, Response } from "express";
import Blog from "../models/Blogs";

interface BlogFilters {
  category?: string;
  tag?: {
    $in: string[];
  };
  page?: number;
  limit?: number;
}

export const createBlog = async (req: Request, res: Response) => {
  const data = await Blog.create(req.body);

  res.status(201).json({
    message: "Blog created successfully",
    data,
  });
};

export const getAllBlogs = async (req: Request, res: Response) => {
  const { category, tags, page = 1, limit = 10 } = req.query;

  let filters: BlogFilters = {};

  if (category) filters.category = category as string;
  if (tags) filters.tag = { $in: (tags as string).split(",") };

  const skip = (Number(page) - 1) * Number(limit);

  const [blogs, total] = await Promise.all([
    Blog.find(filters).skip(skip).limit(Number(limit)),
    Blog.countDocuments(filters),
  ]);

  res.status(200).json({
    message: "Blogs fetched successfully",
    blogs,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
    hasNextPage: Number(page) < Math.ceil(total / Number(limit)),
    hasPreviousPage: Number(page) > 1
  });
};

export const getBlogById = async (req: Request, res: Response) => {
  const data = await Blog.findById(req.params.id);

  if (!data) {
    res.status(404).json({
      message: "Blog not found",
    });
    return;
  }

  // Increment views count and save
  data.views = (data.views || 0) + 1;
  await data.save();

  res.status(200).json({
    message: "Blog fetched successfully",
    data,
  });
};

export const updateBlogById = async (req: Request, res: Response) => {
  const data = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!data) {
    res.status(404).json({
      message: "Blog not found",
    });
    return;
  }

  res.status(200).json({
    message: "Blog updated successfully",
    data,
  });
};

export const deleteBlogById = async (req: Request, res: Response) => {
  const data = await Blog.findByIdAndDelete(req.params.id);

  if (!data) {
    res.status(404).json({
      message: "Blog not found",
    });
    return;
  }

  res.status(200).json({
    message: "Blog deleted successfully",
  });
};
