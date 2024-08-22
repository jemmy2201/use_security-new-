export interface BookingDetailDataObject {
  id: string;
  nric: string;
  appType?: string;
  cardId?: string;
  gradeId?: string;
  receiptNo?: string;
  passId?: string;
  mobileno?: string;
  email?: string;
  trRtt?: string;
  trCsspb?: string;
  trCctc?: string;
  trHcta?: string;
  trXray: string;
  trAvso: string;
  stripePaymentStatus?: string;
}

export default BookingDetailDataObject;

