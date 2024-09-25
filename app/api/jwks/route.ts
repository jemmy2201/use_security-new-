import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {

  const jwksEnv = process.env.SINGPASS_PUBLIC_JWKS;

  if (!jwksEnv) {
    return NextResponse.json({ error: 'JWKS not found in environment variables' }, { status: 500 });
  }

  let jwks;
  try {
    jwks = JSON.parse(jwksEnv);
  } catch (error) {
    return NextResponse.json({ error: 'Error parsing JWKS from environment variables' }, { status: 500 });
  }

  // Example usage
  const phoneNumber = '6581392710'; 
  const message = 'Hello, this is a test message from OnewaySMS.';

  //sendSMS(phoneNumber, message);

  return NextResponse.json(jwks);
}


// const sendSMS = async (phoneNumber: string, message: string) => {

//   const username = process.env.GATEWAY_SMS_USERNAME;
//   const password = process.env.GATEWAY_SMS_PASSWOD;
//   const senderId = process.env.GATEWAY_SMS_SENDER;
//   const apiUrl = 'http://gateway.onewaysms.sg:10002/api.aspx';
//   const apiCredentials = {
//     apiusername: username,
//     apipassword: password,
//   };

//   try {
//     const response = await axios.get(apiUrl, {
//       params: {
//         ...apiCredentials,
//         mobileno: phoneNumber,     
//         message: message,        
//         senderid: 'USE',
//         languagetype: '1',  
//       },
//     });
//     console.log('SMS sent successfully response:', response);
//     console.log('SMS sent successfully data:', response.data);
//   } catch (error) {
//     console.error('Error sending SMS:', error);
//   }
// };


