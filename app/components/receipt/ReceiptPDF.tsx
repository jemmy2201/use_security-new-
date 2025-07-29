'use client';

import React from 'react';
import receiptContentstyles from './ReceiptContent.module.css';
import globalStyleCss from '../globalstyle/Global.module.css';
import { booking_schedules } from '@prisma/client';

interface ReceiptPDFProps {
  users:
    | {
        name?: string;
        nric?: string;
        textNric?: string;
        email?: string;
        mobileno?: string;
      }
    | undefined;
  bookingSchedule: booking_schedules | undefined;
  cardTypeMap: { [key: string]: string };
  gradeTypeMap: { [key: string]: string };
  appTypeMap: { [key: string]: string };
  formatExpiryDate: (dateString: string) => string;
  formatAppointmentDate: (dateString: string) => string;
  formatDate: (dateString: string) => string;
}

const ReceiptPDF: React.FC<ReceiptPDFProps> = ({
  users,
  bookingSchedule,
  cardTypeMap,
  gradeTypeMap,
  appTypeMap,
  formatExpiryDate,
  formatAppointmentDate,
  formatDate,
}) => {
  return (
    <div
      className={receiptContentstyles.innerContainer}
      style={{
        padding: '4px',
        maxWidth: '210mm',
        margin: '0 auto',
        maxHeight: '155mm',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        className={receiptContentstyles.receiptHeader}
        style={{
          marginBottom: '4px',
          display: 'flex',
          marginLeft: '10%',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div
          className={receiptContentstyles.logoContainer}
          style={{
            width: '40%',
            float: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ alignContent: 'center', textAlign: 'center' }}>
            <img
              src='/images/logo_pdf.png'
              alt='USE Logo'
              className={receiptContentstyles.logo}
              style={{ maxWidth: '100%', height: '74px' }}
            />
            <p
              style={{
                fontWeight: 'bold',
                textAlign: 'center',
                margin: '2px auto',
                width: '100%',
                fontSize: '20px',
                whiteSpace: 'nowrap',
              }}
            >
              Union of Security Employees
            </p>
          </div>
        </div>

        <div className={receiptContentstyles.titleContainer}>
          <h3 style={{ margin: '4px 0', fontSize: '20px' }}>
            Transaction Receipt
          </h3>
        </div>
      </div>

      <table
        className={receiptContentstyles.receiptTable}
        style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9px' }}
      >
        <tbody>
          <tr>
            <td
              className={receiptContentstyles.labelCell}
              width='30%'
              style={{
                padding: '3px 5px',
                fontWeight: 'bold',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
              }}
            >
              NRIC/FIN
            </td>
            <td
              className={receiptContentstyles.valueCell}
              colSpan={3}
              style={{ padding: '3px 5px', border: '1px solid #ddd' }}
            >
              {users?.textNric}
            </td>
          </tr>
          <tr>
            <td
              className={receiptContentstyles.labelCell}
              width='30%'
              style={{
                padding: '3px 5px',
                fontWeight: 'bold',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
              }}
            >
              Pass ID Number
            </td>
            <td
              className={receiptContentstyles.valueCell}
              colSpan={3}
              style={{ padding: '3px 5px', border: '1px solid #ddd' }}
            >
              {bookingSchedule?.passid
                    ? bookingSchedule.passid.slice(0, -2)
                    : ''}
            </td>
          </tr>
          <tr>
            <td
              className={receiptContentstyles.labelCell}
              width='30%'
              style={{
                padding: '3px 5px',
                fontWeight: 'bold',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
              }}
            >
              Full Name
            </td>
            <td
              className={receiptContentstyles.valueCell}
              colSpan={3}
              style={{ padding: '3px 5px', border: '1px solid #ddd' }}
            >
              {users?.name}
            </td>
          </tr>
          <tr>
            <td
              className={receiptContentstyles.labelCell}
              width='30%'
              style={{
                padding: '3px 5px',
                fontWeight: 'bold',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
              }}
            >
              Card Type
            </td>
            <td
              className={receiptContentstyles.valueCell}
              colSpan={3}
              style={{ padding: '3px 5px', border: '1px solid #ddd' }}
            >
              {cardTypeMap[bookingSchedule?.card_id || ''] || 'Unknown'}
            </td>
          </tr>
          <tr>
            <td
              className={receiptContentstyles.labelCell}
              width='30%'
              style={{
                padding: '3px 5px',
                fontWeight: 'bold',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
              }}
            >
              PWM Grade
            </td>
            <td
              className={receiptContentstyles.valueCell}
              colSpan={3}
              style={{ padding: '3px 5px', border: '1px solid #ddd' }}
            >
              {gradeTypeMap[bookingSchedule?.grade_id || ''] || 'Unknown'}
            </td>
          </tr>
          <tr>
            <td
              className={receiptContentstyles.labelCell}
              width='30%'
              style={{
                padding: '3px 5px',
                fontWeight: 'bold',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
              }}
            >
              Card Expiry Date
            </td>
            <td
              className={receiptContentstyles.valueCell}
              colSpan={3}
              style={{ padding: '3px 5px', border: '1px solid #ddd' }}
            >
              {formatExpiryDate(
                bookingSchedule?.expired_date
                  ? bookingSchedule.expired_date
                  : ''
              )}
            </td>
          </tr>
          <tr>
            <td
              className={receiptContentstyles.labelCell}
              width='30%'
              style={{
                padding: '3px 5px',
                fontWeight: 'bold',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
              }}
            >
              Mobile Number
            </td>
            <td
              className={receiptContentstyles.valueCell}
              colSpan={3}
              style={{ padding: '3px 5px', border: '1px solid #ddd' }}
            >
              {users?.mobileno}
            </td>
          </tr>
          <tr>
            <td colSpan={4} style={{ height: '3px', border: 'none' }}>
              &nbsp;
            </td>
          </tr>
          <tr>
            <td
              className={receiptContentstyles.labelCell}
              width='25%'
              style={{
                padding: '3px 5px',
                fontWeight: 'bold',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
              }}
            >
              Transaction
              <br />
              Reference Number
            </td>
            <td
              className={receiptContentstyles.valueCell}
              width='25%'
              style={{ padding: '3px 5px', border: '1px solid #ddd' }}
            >
              {bookingSchedule?.stripe_payment_id || bookingSchedule?.receiptNo}
            </td>
            <td
              className={receiptContentstyles.labelCell}
              width='25%'
              style={{
                padding: '3px 5px',
                fontWeight: 'bold',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
              }}
            >
              Collection Date
            </td>
            <td
              className={receiptContentstyles.valueCell}
              width='25%'
              style={{ padding: '3px 5px', border: '1px solid #ddd' }}
            >
              {formatAppointmentDate(
                bookingSchedule?.appointment_date
                  ? bookingSchedule.appointment_date
                  : ''
              ) || ''}
            </td>
          </tr>
          <tr>
            <td
              className={receiptContentstyles.labelCell}
              style={{
                padding: '3px 5px',
                fontWeight: 'bold',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
              }}
            >
              Amount Paid
              <br />
              (Inclusive of GST)
            </td>
            <td
              className={receiptContentstyles.valueCell}
              style={{ padding: '3px 5px', border: '1px solid #ddd' }}
            >
              S${parseFloat(bookingSchedule?.grand_total || '0').toFixed(2)}
            </td>
            <td
              className={receiptContentstyles.labelCell}
              style={{
                padding: '3px 5px',
                fontWeight: 'bold',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
              }}
            >
              Time Slot
            </td>
            <td
              className={receiptContentstyles.valueCell}
              style={{ padding: '3px 5px', border: '1px solid #ddd' }}
            >
              {bookingSchedule?.time_start_appointment} -{' '}
              {bookingSchedule?.time_end_appointment}
            </td>
          </tr>
          <tr>
            <td
              className={receiptContentstyles.labelCell}
              style={{
                padding: '3px 5px',
                fontWeight: 'bold',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
              }}
            >

            </td>
            <td
              className={receiptContentstyles.valueCell}
              style={{ padding: '3px 5px', border: '1px solid #ddd' }}
            >

            </td>
            <td
              className={receiptContentstyles.labelCell}
              style={{
                padding: '3px 5px',
                fontWeight: 'bold',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
              }}
            >
              Collection Address
            </td>
            <td
              className={receiptContentstyles.valueCell}
              style={{
                padding: '3px 5px',
                border: '1px solid #ddd',
                lineHeight: '1',
                wordBreak: 'break-word',
              }}
            >
              200, Jalan Sultan
              <br />
              #03-24, Textile Centre
              <br />
              Singapore 199018
              <br />
              <br />
            </td>
          </tr>
        </tbody>
      </table>

      <div
        className={receiptContentstyles.disclaimer}
        style={{
          marginTop: '0px',
          fontSize: '10px',
          textAlign: 'center',
          lineHeight: '1.2',
          position: 'absolute',
          bottom: '10px',
          left: '0',
          right: '0',
          padding: '0 5px',
        }}
      >
        This is an official receipt issued by Union of Security Employees for
        the issuance of the PLRD ID card.
        <br />
        <span style={{ display: 'block', marginTop: '1px' }}>
          Please note that the base transaction fee of $0.36 (inclusive of 9%
          GST) is absorbed by USE.
        </span>
      </div>
    </div>
  );
};

export default ReceiptPDF;
