export function getPunjabUniGPA(percentage) {
    if (percentage >= 85) return 4.00;
    if (percentage >= 80) return 3.70;
    if (percentage >= 75) return 3.30;
    if (percentage >= 70) return 3.00;
    if (percentage >= 65) return 2.70;
    if (percentage >= 61) return 2.30;
    if (percentage >= 58) return 2.00;
    if (percentage >= 55) return 1.70;
    if (percentage >= 50) return 1.00;
    return 0.00;
  }