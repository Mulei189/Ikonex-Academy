import { Router } from 'express';
import classStreamsController from './class-streams.controller.js';

const router = Router();

router.post('/', classStreamsController.create);
router.get('/', classStreamsController.findAll);
router.get('/:id', classStreamsController.getById);
router.put('/:id', classStreamsController.update);
router.delete('/:id', classStreamsController.delete);

export default router;