ALTER TABLE security_employees.booking_schedules 
    ADD COLUMN stripe_session_id VARCHAR(255) NULL,
    ADD COLUMN stripe_payment_id VARCHAR(255) NULL;

ALTER TABLE security_employees.booking_schedules 
    ADD COLUMN TR_NOTA VARCHAR(3) NULL,
    ADD COLUMN TR_OBSE VARCHAR(3) NULL,
    ADD COLUMN TR_SSM VARCHAR(3) NULL;

-- CreateIndex
CREATE UNIQUE INDEX stripeid_UNIQUE ON security_employees.booking_schedules(stripe_session_id);

-- CreateIndex
CREATE UNIQUE INDEX stripepaymentid_UNIQUE ON security_employees.booking_schedules(stripe_payment_id);

ALTER TABLE security_employees.so_update_info  
    ADD COLUMN TR_NOTA VARCHAR(255) NULL,
    ADD COLUMN TR_OBSE VARCHAR(255) NULL,
    ADD COLUMN TR_SSM VARCHAR(255) NULL;