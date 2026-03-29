// importing router
import { Router } from "express";
import { healthCheck } from "../controllers/healthController";

// initializing express router 
const router: Router = Router();

// GET endpoint to get health status
router.get("/health", healthCheck);

// Export router so that app.ts can use this router
export default router;