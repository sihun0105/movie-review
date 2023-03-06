import express, {Request, Response} from 'express';
const router = express.Router();

router.get('/', async (req, res, next) => {
    return res.status(200).json({result : 1});
});

export default router;