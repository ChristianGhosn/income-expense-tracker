const calculateTax = (amount) => {
  const tax = amount - amount / 1.1;
  return Math.abs(tax.toFixed(2));
};

export default calculateTax;
