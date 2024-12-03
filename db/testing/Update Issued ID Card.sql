
-- User (NRIC) = TESTER12, password: 123123
INSERT INTO security_employees.users
      (id, name, email, password, nric, mobileno, created_at, updated_at)
   values 
     ((SELECT max(uu.id) + 1 FROM security_employees.users uu),
     'Tester 12','tester12@admin.com',
     '$2y$10$B9b8MzrKuTHEejOkcE9azeJA5gVKJ9F6VCZEDEiqhvfbF55ap4Wk2',
     'YjdJR2VNVk9TcVZuRzR6UHUxQ3d5dz09',
     '6581392712','2024-07-31 06:26:05','2024-08-07 02:58:56');


	INSERT INTO security_employees.booking_schedules
	  (id, app_type, card_id, grade_id, expired_date, nric, passid, created_at, licence_status, card_issue) 
	values 
	  ((SELECT max(uu.id) + 1 FROM security_employees.booking_schedules uu), 
    '2', '1', '3', 
    '22/12/2026', 
    'YjdJR2VNVk9TcVZuRzR6UHUxQ3d5dz09', 
    '410220373BSO', 
    '2024-07-31 14:32:22', 
    'Y', 
    '');
