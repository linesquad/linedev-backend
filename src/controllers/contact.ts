import { Request, Response } from "express";
import Contact from "../models/Contact";

export const createContact = async (req: Request, res: Response) => {
  const contact = await Contact.create(req.body);
  res.status(201).json({ message: "Contact created successfully", contact });
};

export const getContacts = async (req: Request, res: Response) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.status(200).json({ message: "Contacts fetched successfully", contacts });
};
