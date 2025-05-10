import {Router} from 'express';
import { shareList, addTaskToSharedList, getSharedLists } from '../controllers/shared';

const router = Router();

router.post('/share-list/:listId', shareList);
router.get('/share-list/', getSharedLists);
router.post('/add-task-to-shared-list/:listId', addTaskToSharedList);

export default router;