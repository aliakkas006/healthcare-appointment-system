/**
 * Generates a random 5-digit verification code.
 * @returns {string} - A 5-digit verification code.
 */
const generateVerificationCode = () => {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return randomNum.toString();
};

export default generateVerificationCode;
