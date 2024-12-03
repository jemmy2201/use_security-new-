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