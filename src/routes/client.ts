import { Router } from "express";
import {
  registerClientForm,
  getClientsInformation,
  deleteClientInformation,
} from "../controllers/client";
import { validate } from "../middlewares/validate";
import { createClientSchema } from "../validators/client";

