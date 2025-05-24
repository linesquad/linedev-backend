import { Router } from "express";
import { createPricing, getPricing, updatePricing, deletePricing } from "../controllers/Pricing";
import { validate } from "../middlewares/validate";
import { pricingSchema } from "../validators/pricing";
import { requireAuth, requireRole } from "../middlewares/auth";

const router = Router();

//public routes
router.get("/", getPricing);

//private routes
router.post("/",  requireAuth, requireRole('senior'), validate(pricingSchema), createPricing);
router.put("/:id", requireAuth, requireRole('senior'), validate(pricingSchema), updatePricing);
router.delete("/:id", requireAuth, requireRole('senior'), deletePricing);

export default router;