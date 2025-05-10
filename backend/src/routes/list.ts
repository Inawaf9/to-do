import { Router } from "express";
import { getAllList, createNewList, getListById, deleteList, updateList } from "../controllers/list";

const router = Router();

// Define the route for getting all todos
router.get("/list", getAllList);
router.get("/list/:id", getListById);
router.post("/list/new", createNewList);
router.delete("/list/:id", deleteList);
router.put("/list/:id", updateList);



export default router;