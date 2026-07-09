import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validation.middleware';
import {
  registerSchema,
  loginSchema,
  verifySchema,
  updateProfileSchema,
} from '../validators/auth.validator';

const router = Router();
const controller = new AuthController();

router.post('/register', validate(registerSchema), controller.register);
router.post('/login', validate(loginSchema), controller.login);
router.post('/verify', validate(verifySchema), controller.verify);
router.post('/google', controller.googleLogin);
router.post('/google/check', controller.checkGoogleUser);
router.post('/logout', controller.logout);
router.get('/profile', controller.getProfile);
router.put('/profile', validate(updateProfileSchema), controller.updateProfile);
router.post('/become-owner', validate(updateProfileSchema), controller.becomeOwner);

export default router;
