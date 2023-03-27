import crypto from 'crypto';

export default function createPasswordResetToken() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const passResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const passResetTokenExp = Date.now() + 10 * 60 * 1000;

  return { resetToken, passResetToken, passResetTokenExp };
}

export const verifyPasswordResetToken = () => {
  return '';
};
