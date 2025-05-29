import { Request, Response } from "express";
import Contact from "../models/Contact";

interface filterStatus {
  status?: string;
}

export const createContact = async (req: Request, res: Response) => {
  const contact = await Contact.create(req.body);
  res.status(201).json({ message: "Contact created successfully", contact });
};

export const getContacts = async (req: Request, res: Response) => {
  const { status = "new" } = req.query as filterStatus;

  const filters: filterStatus = {};
  if (status) filters.status = status;

  const contacts = await Contact.find(filters).sort({ createdAt: -1 });
  res.status(200).json({ message: "Contacts fetched successfully", contacts });
};

export const updateContactStatus = async (req: Request, res: Response) => {
  const { status } = req.body;
  const data = await Contact.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (!data) {
    res.status(404).json({ message: "Contact not found" });
    return;
  }
  res
    .status(200)
    .json({ message: "Contact status updated successfully", data });
};

export const deleteContact = async (req: Request, res: Response) => {
  const data = await Contact.findByIdAndDelete(req.params.id);
  if (!data) {
    res.status(404).json({ message: "Contact not found" });
    return;
  }
  res.status(200).json({ message: "Contact deleted successfully", data });
};
