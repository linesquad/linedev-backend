import { Request, Response } from "express";
import Category from "../models/Category";
import Portfolio from "../models/Portfolio";

export const createCategory = async (req: Request, res: Response) => {
  const data = req.body;
  const category = await Category.create(data);

  res.status(201).json(category);
};

export const getCategories = async (req: Request, res: Response) => {
  const categories = await Category.find().sort({ createdAt: -1 });

  res.status(200).json(categories);
};

export const getCategoryPortfolios = async (req: Request, res: Response) => {
  const { category } = req.query;

  if (!category) {
    res.status(400).json({ message: "Category slug is required" });
    return;
  }

  const categoryData = await Category.findOne({ slug: category });

  if (!categoryData) {
    res.status(404).json({ message: "Category not found" });
    return;
  }

  const portfolios = await Portfolio.find({ category: categoryData._id })
    .populate("category")
    .sort({
      createdAt: -1,
    });

  res.status(200).json(portfolios);
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const category = await Category.findByIdAndUpdate(id, data, { new: true });

  if (!category) {
    res.status(404).json({ message: "Category not found" });
    return;
  }

  res.status(200).json(category);
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    res.status(404).json({ message: "Category not found" });
    return;
  }

  res.status(200).json({ message: "Category deleted successfully" });
};
