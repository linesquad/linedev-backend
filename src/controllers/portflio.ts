import { Request, Response } from "express";
import Portfolio from "../models/Portfolio";


export const createPortfolio = async (req: Request, res: Response) => {
  const data = await Portfolio.create(req.body);
  if (!data) {
    res.status(400).json({ message: "Portfolio not created" });
    return;
  }
  res.status(201).json({ data, message: "successfully  created portfolio" });
};

export const getAllPortfolios = async (_req: Request, res: Response) => {
  const portfolios = await Portfolio.find().sort({ createdAt: -1 });
  res.status(200).json(portfolios);
};

export const getPortfolioById = async (req: Request, res: Response) => {
  const portfolio = await Portfolio.findById(req.params.id);
  if (!portfolio) {
    res.status(404).json({ message: "Portfolio not found" });
    return;
  }

  res.status(200).json({ portfolio, message: "succes" });
};

export const updatePortfolio = async (req: Request, res: Response) => {
  const updated = await Portfolio.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!updated) {
    res.status(404).json({ message: "Portfolio not found" });
    return;
  }

  res.status(200).json({updated,message:"successfully updated"});
};

export const deletePortfolio = async (req: Request, res: Response) => {
  const deleted = await Portfolio.findByIdAndDelete(req.params.id);

  if (!deleted) {
    res.status(404).json({ message: "Portfolio not found" });
    return;
  }

  res.status(200).json({ message: "Portfolio deleted successfully" });
};
