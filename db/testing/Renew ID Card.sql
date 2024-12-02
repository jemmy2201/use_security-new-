-- User (NRIC) = TESTER11, password: 123123
INSERT INTO security_employees.users
      (id, name, email, password, nric, mobileno, created_at, updated_at)
   values 
     ((SELECT max(uu.id) + 1 FROM security_employees.users uu),
     'Tester 11','tester11@admin.com',
     '$2y$10$B9b8MzrKuTHEejOkcE9azeJA5gVKJ9F6VCZEDEiqhvfbF55ap4Wk2',
     'cmR1dnozY0dFbmNIL2JPWFRwSndDQT09',
     '6581392712','2024-07-31 06:26:05','2024-08-07 02:58:56');

INSERT INTO security_employees.booking_schedules
	  (id, app_type, card_id, grade_id, expired_date, nric, passid, created_at, licence_status, card_issue) 
values 
	  ((SELECT max(uu.id) + 1 FROM security_employees.booking_schedules uu), 
    '3', '1', '2', 
    '22/11/2024', 
    'cmR1dnozY0dFbmNIL2JPWFRwSndDQT09', 
    '400220373BSO', 
    '2024-07-31 14:32:22', 
    'Y', 
    '');
