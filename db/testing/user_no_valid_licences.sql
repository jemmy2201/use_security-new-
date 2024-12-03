-- User (NRIC) = G1111111U, password: 123123
INSERT INTO security_employees.users
      (id, name, email, password, nric, mobileno, created_at, updated_at)
   values 
     ((SELECT max(uu.id) + 1 FROM security_employees.users uu),
     'Tester One','G1111111U@admin.com',
     '$2y$10$B9b8MzrKuTHEejOkcE9azeJA5gVKJ9F6VCZEDEiqhvfbF55ap4Wk2',
     'N3VwZEFqZGxrMklqbXJQaVdSVXRodz09',
     '6581392711','2024-07-31 06:26:05','2024-08-07 02:58:56');