import { Router } from "express";

import { lists, newList, deleteList, updateList , shareList, updateSharePermission, unshareList} from "../controllers/list.controller";
import { publicLink, deletePublicLink, updatePublicLinkPermission } from "../controllers/public.controller";

import { validate } from "../middleware/validate";
import { listValidator } from "../validators/list.validator";
const router = Router();


router.get("/", lists);
// router.get("/:id", list);
router.post("/new", listValidator, validate, newList);
router.delete("/:listId", deleteList);
router.patch("/:listId", listValidator, validate, updateList);

router.post("/share/:listId", shareList);
router.patch("/share/:listId", updateSharePermission);
router.delete("/share/:listId", unshareList);

router.post("/public/:listId", publicLink);
router.delete("/public/:listId", deletePublicLink);
router.patch("/public/:listId", updatePublicLinkPermission);




export default router;