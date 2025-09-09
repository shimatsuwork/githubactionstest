function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function calculateSum(numbers) {
  return numbers.reduce((sum, num) => sum + num, 0);
}

module.exports = {
  validateEmail,
  formatDate,
  calculateSum
};