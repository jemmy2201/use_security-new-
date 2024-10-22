
#### 1.1 Overview
   - **Purpose**: To describe the high-level architecture for a web-based application integrating features like multi-step forms, SingPass authentication, face detection, PDF generation, Stripe payment, multi-step form and dashboard.
   - **Scope**: Includes user authentication, data collection, data processing, third-party integrations, and reporting features.
   - **Target Audience**: Developers, architects, business analysts, and stakeholders.

#### 1.2 Architecture 
   - **High-Level Architecture Diagram**: Illustrate the system with the following components:
     - **Frontend (React.js/Next.js)**: Multi-step form handling, user interface, form validations, and dashboards.
     - **Backend (Next.js APIs, Node.js)**: Authentication services, PDF generation, and data processing.
     - **Database (MySQL via Prisma)**: User data, form submissions, and business metrics storage.
     - **Third-Party Integrations**: SingPass for authentication, `face-api` for facial detection, Stripe for payment and oneway sms for sms gateway.
     - **Deployment (AWS with IIS for UAT/Production)**: Environments for development, UAT, and production.
     - **JWK and JWE Handling**: `jose` library documentation for token management.
     - **Face Detection Libraries**: face-api.js .


#### 1.3 Functional Components
   - **Frontend (Next.js/React.js)**
     - **Multi-Step Form Handling**: Collect user information (name, email, preferences) and validate each step.
     - **User Authentication**: Integrates SingPass authentication for production and mock authentication for local environments.
     - **Dashboard and Metrics Views**: Display metrics migrated from Tableau to Apache Superset.
   - **Backend (Node.js/Next.js APIs)**
     - **Authentication Services**: Manage user sessions and integrate with SingPass.
     - **PDF Generation**: generate pdf receipt after successful stripe payment.
     - **Data Handling Services**: Processing data from multi-step forms and storing it in the database.
   - **Database (MySQL using Prisma)**
     - **Schema Design**: Tables for user profiles, form submissions, metrics, and documents.
   - **Third-Party Integrations**
     - **SingPass Integration**: Handling user login through government-backed authentication.
     - **Face Detection (face-api.js)**: Using facial recognition to validate user conditions, such as detecting background and face through face landmark analysis..
      - **Stripe(stripe sdk)**: Payment gateway (using stripe payment and stripe checkout screens for payment).
     - **Oneway sms**: sms gateway.


#### 1.4 Detailed Design for Each Component
   - **Frontend (React.js/Next.js)**
     - **Component Organization**:  
       - `/app/components/passcard`: Multi-step form components.
       - `/app/signin`: Signin page.
       - `/app/components/dashboard`: Components for displaying dashboard.
       - `/app/components/applicantdetails`: Components for displaying dashboard.
       - `/app/components/bookappointment`: Components for booking appointment
       - `/app/components/complete`: Components for once all step completed
       - `/app/components/firsttime`: Components for first time user
       - `/app/components/receipt`: Components for receipt
       - `/app/components/payment`: Components for payment
       - `/app/components/reschedule`: Components for reschedule appointment
       - `/app/components/resubmitphoto`: Components for resubmit photo
       - `/app/components/review`: Components for review details
       - `/app/components/terms`: Components for terms and condition page
       - `/app/components/updatedetails`: Components for update details flow
       - `/app/signin-password`: Components for login using user name and password (only applicable for UAT)
     - **Routing**: Use of Next.js for server-side rendering and API route handling.
   - **Backend Services (Node.js/Next.js APIs)**
     - **Authentication Service**: Manages user login, session creation, and token management.
     - **PDF Generation Service**: Uses server-side libraries to generate documents based on form data.
     - **Form Submission Service**: Validates and processes multi-step form data.
   - **Database Design**
     - **Schema**:  
       - `Users`: Table for storing user profile information.
       - `booking_schedule`: Table for applications.
     - **Data Access Layer**: Implemented using Prisma for ORM and query building.   

- **web.config**: The web.config file is specific to IIS and is used to configure following in application. 
1. URL Rewriting
2. Static File Handling
3. Application Settings

- **server.js**: The server.js file is a Node.js script that sets up a custom server for application. It is often used to handle server-side rendering and routing.
1. Custom Server Logic: port redirect to Admin Application
2. Middleware
3. Environment Configuration  



#### 1.5 Data Flow
   - **User Authentication Flow**: User initiates login, is redirected to SingPass for authentication, and upon successful login, is redirected back to the application dashboard or first time user screen.
   - **Multi-Step Form Flow**: User progresses through steps, data is validated, and upon final submission, data is stored in the database.
   - **PDF Generation Flow**: Server processes form data and generates a PDF, which is then made available for download.
   - **Dashboard Data Flow**: shows the draft, existing, renew, replacement and new application holds by applicant.



#### 1.6 Functionality

The application supports two types of ID Card applications that can be submitted by security personnel: 

1. **Security Officer / AVSO** 
2. **Private Investigator**

To submit an application, the following information is required:

- **Personal Details**: This includes the applicant's mobile number and email address.
- **Applicant Details**: This includes an ID photo that meets specified guidelines and training records relevant to the application type.

#### Scenarios for Application Submission

**Scenario 1: User Logs In via Singpass but Has No Valid License**

- If the user does not possess a valid license for either a Security Officer or Private Investigator, they will not be able to submit a new ID Card application.
- In this scenario, the `booking_schedule` table will not contain any records associated with the user, indicating that there are no active or upcoming licenses.

**Scenario 2: User Logs In and Has a Valid License**

- If the user holds a valid license for one or both roles (Security Officer and/or Private Investigator), they will be allowed to submit a new ID Card application.
- The system will verify the available records in the `booking_schedule` table to confirm the user's eligibility to apply for the respective ID Card(s) based on their valid licenses.

**Scenario 3: User Has an Existing ID Card or an Application in Draft Mode**

- When the user logs in, they will see a dashboard displaying their current applications, which they can continue to work on as needed. The following options are available based on the status of the application:

  - **Draft Mode**: If the application is still in draft mode, the user can continue the process to complete the application, make the payment, and book an appointment.
  
  - **Issued ID Card**: If the user already has a valid ID Card, they can:
    - Update personal details associated with the existing ID Card.
    - Submit an application for a replacement ID Card if the current one is lost or damaged.
    
  - **Expiring ID Card**: If the ID Card is nearing its expiration date, the user can:
    - Apply for a renewal. This process will include payment and appointment booking for the renewal to be completed.
    
  - **Appointment Rescheduling**: Users can change the date and time of their booked appointment as needed.
  
  - **Photo Rejection**: If the photo submitted by the user does not meet the guidelines and is rejected, the user can:
    - Resubmit a new photo.
    - Reschedule the appointment after the new photo is accepted.



### Test Data Creation: 

#### 1. User with no valid licenses

```bash
-- User (NRIC) = G1111111U, password: 123123
INSERT INTO security_employees.users
      (id, name, email, password, nric, mobileno, created_at, updated_at)
   values 
     ((SELECT max(uu.id) + 1 FROM security_employees.users uu),
     'Tester One','G1111111U@admin.com',
     '$2y$10$B9b8MzrKuTHEejOkcE9azeJA5gVKJ9F6VCZEDEiqhvfbF55ap4Wk2',
     'N3VwZEFqZGxrMklqbXJQaVdSVXRodz09',
     '6581392711','2024-07-31 06:26:05','2024-08-07 02:58:56');

```

This user dont have any valid license. 

**Test Case1:** User able to login successfully.

**Test Case2:** User able to see dashobard page with No Record.

**Test Case3:** Applicant get popup with message (No valid license) When applicant click on Application for new ID Card and select SO / AVSO

**Test Case4:** Applicant get popup with message (No valid license) When applicant click on Application for new ID Card and select PI


#### 2. User with one valid license (Security Officier / Aviation Security Officier)

```bash
-- User (NRIC) = S1111111X, password: 123123
INSERT INTO security_employees.users
      (id, name, email, password, nric, mobileno, created_at, updated_at)
   values 
     ((SELECT max(uu.id) + 1 FROM security_employees.users uu),
     'Tester Two','S1111111X@admin.com',
     '$2y$10$B9b8MzrKuTHEejOkcE9azeJA5gVKJ9F6VCZEDEiqhvfbF55ap4Wk2',
     'b2lrOGRaeHF2aEtHR2FHdTluSUZJdz09',
     '6581392712','2024-07-31 06:26:05','2024-08-07 02:58:56');

-- Creating 1 record for vald license for SO application

INSERT INTO security_employees.booking_schedules
   (id, app_type, card_id, grade_id, expired_date, nric, passid, created_at, licence_status, card_issue) 
values 
   ((SELECT max(uu.id) + 1 FROM security_employees.booking_schedules uu), 
    '1', '1', '3', 
    '22/12/2026', 
    'b2lrOGRaeHF2aEtHR2FHdTluSUZJdz09', 
    '202411111BSO', 
    '2024-07-31 14:32:22', 
    'Y', 
    '');
```

**Test Case1:**  User able to login successfully.

**Test Case2:**  User able to see dashobard page with No Record.

**Test Case3:**  Applicant get popup with message (No valid license) When applicant click on Application for new ID Card and select PI.

**Test Case4:**  Applicant able to raise new ID Card application When applicant click on Application for new ID Card and select SO / AVSO.

**Test Case5:**  Applicant able to pay successfully fees and book appointment.

**Test Case6:**  Applicant logs in and able to see new SO ID Card application on dashboard.

**Test Case7:**  Applicant able to reschedule appointment.

**Test Case8:**  Applicant able to resubmit photo from dashboard after photo gots rejected by system admin staff.

**Test Case9:**  Applicant can continue on same appointment if resubmitted photo and appointment date gap is 3 days or more.

**Test Case10:** Applicant has to rebook appointment if resubmitted photo and appointment date gap is less then 3 days.



#### 3. User with 2 valid license (Security Officier / Aviation Security Officier & Personal Investigator)

```bash
-- User (NRIC) = P1111111X, password: 123123
INSERT INTO security_employees.users
      (id, name, email, password, nric, mobileno, created_at, updated_at)
   values 
     ((SELECT max(uu.id) + 1 FROM security_employees.users uu),
     'Tester Three','P1111111X@admin.com',
     '$2y$10$B9b8MzrKuTHEejOkcE9azeJA5gVKJ9F6VCZEDEiqhvfbF55ap4Wk2',
     'eTUrbnB0cGQzV01RWTRFVHRWcEJ6UT09',
     '6581392712','2024-07-31 06:26:05','2024-08-07 02:58:56');

-- Creating 1 record for vald license for SO application

INSERT INTO security_employees.booking_schedules
   (id, app_type, card_id, grade_id, expired_date, nric, passid, created_at, licence_status, card_issue) 
values 
   ((SELECT max(uu.id) + 1 FROM security_employees.booking_schedules uu), 
    '1', '1', '3', 
    '22/12/2026', 
    'eTUrbnB0cGQzV01RWTRFVHRWcEJ6UT09', 
    '202411111BSO', 
    '2024-07-31 14:32:22', 
    'Y', 
    '');

INSERT INTO security_employees.booking_schedules
   (id, app_type, card_id, grade_id, expired_date, nric, passid, created_at, licence_status, card_issue) 
values 
   ((SELECT max(uu.id) + 1 FROM security_employees.booking_schedules uu), 
    '1', '3', '3', 
    '22/12/2026', 
    'eTUrbnB0cGQzV01RWTRFVHRWcEJ6UT09', 
    '202411111BSO', 
    '2024-07-31 14:32:22', 
    'Y', 
    '');    

```

**Test Case1:**  User able to login successfully.

**Test Case2:**  User able to see dashobard page with No Record.

**Test Case3:**  Applicant able to raise new ID Card application When applicant click on Application for new ID Card and select PI.

**Test Case4:**  Applicant able to raise new ID Card application When applicant click on Application for new ID Card and select SO / AVSO.

**Test Case5:**  Applicant able to pay successfully fees and book appointment.

**Test Case6:**  Applicant logs in and able to see new SO ID Card application on dashboard.

**Test Case7:**  Applicant able to reschedule appointment.

**Test Case8:**  Applicant able to resubmit photo from dashboard after photo gots rejected by system admin staff.

**Test Case9:**  Applicant can continue on same appointment if resubmitted photo and appointment date gap is 3 days or more.

**Test Case10:** Applicant has to rebook appointment if resubmitted photo and appointment date gap is less then 3 days.




