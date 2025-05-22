import { Request, Response } from "express";
import Client from "../models/Client";

export const registerClientForm = async (req: Request, res: Response) => {
  const data = Client.create(req.body);

  res.status(201).json({ message: "Client created successfully", data });
};

export const getClientsInformation = async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.params;

  const skip = (Number(page) - 1) * Number(limit);

  const [clients, total] = await Promise.all([
    Client.find().sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Client.countDocuments(),
  ]);

  res.status(200).json({
    message: "Clients fetched successfully",
    data: clients,
    page: Number(page),
    total,
    totalPages: Math.ceil(total / Number(limit)),
  });
};

export const deleteClientInformation = async (req: Request, res: Response) => {
  const data = Client.findByIdAndDelete(req.params.id);

  if (!data) {
    res.status(404).json({ message: "Client not found" });
    return;
  }

  res.status(200).json({ message: "Client deleted successfully"});
};
