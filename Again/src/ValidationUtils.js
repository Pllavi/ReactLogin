export function isValidPAN(panNumber) {
  const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panPattern.test(panNumber);
}

export function isValidAadhaar(aadhaarNumber) {
  const aadhaarPattern = /^\d{12}$/;
  return aadhaarPattern.test(aadhaarNumber);
}
