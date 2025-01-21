import express from 'express';
import authenticate from './middlewares/auth.js';
import dotenv from 'dotenv';
import getList from './controllers/listOfCertificates.js';
import getTokenController from './controllers/getTokenController.js';
dotenv.config();

const app = express();

const router = express.Router()

router.get('/api/certificates', getList);
router.post('/api/load-key', getTokenController);

app.use(express.json());
app.use(authenticate);
app.use(router);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server listening on port ${process.env.SERVER_PORT}`);
});

export default router;
