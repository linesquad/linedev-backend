import { Request, Response } from "express";
import Client from "../models/Client";

export const registerClientForm = async (req: Request, res: Response) => {
  try {
    const data = await Client.create(req.body); // აქ დაელოდე შესრულებას
    res.status(201).json({ message: "Client created successfully", data });
  } catch (error) {
    res.status(500).json({ message: "Failed to create client", error });
  }
};

export const getClientsInformation = async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.params;

  const skip = (Number(page) - 1) * Number(limit);

  try {
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
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch clients", error });
  }
};

export const deleteClientInformation = async (req: Request, res: Response) => {
  try {
    const data = await Client.findByIdAndDelete(req.params.id); // აქაც დაელოდე

    if (!data) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete client", error });
  }
};
