Guide to use **AWS Database Migration Service (DMS)** for database migration and **RDP (Remote Desktop Protocol)** for file transfer between AWS Windows servers.

---

### Part 1: **AWS Database Migration Service (DMS) for Database Migration**

#### **Step 1: Set Up Source and Target Databases**
1. **Create the Source MySQL Database** on the source AWS Windows server or ensure that it is running.
2. **Create the Target MySQL Database** on the target AWS Windows server or ensure that it is running.
3. Ensure that both databases can be accessed from your DMS replication instance. This typically involves:
   - Ensuring **security group** rules allow inbound traffic to MySQL (default port 3306).
   - Ensuring **user permissions** are set up correctly.

#### **Step 2: Create a DMS Replication Instance**
1. Go to the **AWS Management Console** and open the **DMS Dashboard**.
2. Click on **Create replication instance**.
   - **Name**: Give the instance a meaningful name.
   - **Instance class**: Choose the instance size based on your load (e.g., `dms.r5.large`).
   - **VPC**: Choose the Virtual Private Cloud (VPC) that contains both source and target databases.
   - **Multi-AZ**: Optional, can be used for production workloads.
   - **Publicly accessible**: Enable this if your databases are accessible over the internet.
3. Click **Create**.

#### **Step 3: Set Up Source and Target Endpoints**
1. Go to the **Endpoints** section of the DMS console and click **Create endpoint**.
2. For the **source endpoint**:
   - Choose **Source type** as `MySQL`.
   - Provide the **server name (IP address)**, **port**, **user name**, **password**, and **database name** for the source database.
   - **Test connection** to ensure connectivity.
3. For the **target endpoint**:
   - Choose **Target type** as `MySQL`.
   - Provide the **server name (IP address)**, **port**, **user name**, **password**, and **database name** for the target database.
   - **Test connection** to ensure connectivity.

#### **Step 4: Create a Migration Task**
1. Go to the **Tasks** section and click **Create task**.
2. Provide the following:
   - **Replication instance**: Choose the replication instance created in Step 2.
   - **Source endpoint**: Select the source endpoint created in Step 3.
   - **Target endpoint**: Select the target endpoint created in Step 3.
   - **Migration type**: Choose one of the following:
     - **Migrate existing data** (if only existing data needs to be copied).
     - **Migrate existing data and replicate ongoing changes** (for continuous replication).
   - **Task settings**: Customize the task, such as selecting tables and schemas to migrate.
3. Start the task.

#### **Step 5: Monitor the Migration**
1. Go to the **Tasks** section and monitor the status of your task.
2. Check for any errors or warnings in the logs and fix them as needed.

#### **Step 6: Validate the Data**
1. Once the migration is complete, connect to the **target database** to ensure all data has been successfully copied.
2. Use the **AWS DMS data validation** tool (optional) to verify data consistency.

---

### Part 2: **Remote Desktop Protocol (RDP) for File Transfer**

#### **Step 1: Enable Remote Desktop on AWS Windows Instances**
1. On both the **source** and **target** AWS Windows servers, ensure that **Remote Desktop** is enabled.
   - Right-click **This PC** > **Properties** > **Remote Settings**.
   - Check the box for **Allow remote connections to this computer**.
2. Ensure that the **security group** for each instance allows **RDP traffic (port 3389)**.
   - Go to the **EC2 Dashboard** > **Security Groups**.
   - Edit inbound rules and add a rule for `RDP` with port `3389`.

#### **Step 2: Access the Source Server via RDP**
1. Open the **Remote Desktop Connection** tool on your local machine.
   - Search for "Remote Desktop Connection" or run `mstsc` in the Run dialog.
2. Enter the **public IP address** or **DNS** of the **source server**.
3. Click **Show Options** and go to the **Local Resources** tab.
4. Under **Local devices and resources**, click **More** and select **Drives** to make your local drives available in the RDP session.
5. Click **Connect** and enter the **administrator credentials** for the source server.

#### **Step 3: Transfer Files from Source to Local Machine**
1. Once logged into the source server, navigate to the folder containing the files (PDFs, JPEGs, etc.).
2. Copy the files from the source server.
3. In **File Explorer**, navigate to your **local drives** (under "This PC") that you shared in Step 2.
4. Paste the files into a folder on your local machine.

#### **Step 4: Access the Target Server via RDP**
1. Open the **Remote Desktop Connection** tool again.
2. Enter the **public IP address** or **DNS** of the **target server**.
3. Go to the **Local Resources** tab and share your local drives as you did in Step 2.
4. Click **Connect** and enter the **administrator credentials** for the target server.

#### **Step 5: Transfer Files to Target Server**
1. On the target server, navigate to the folder where you want to store the transferred files.
2. Open **File Explorer** and navigate to the shared **local drives** (under "This PC").
3. Copy the files from your local machine.
4. Paste the files into the desired folder on the target server.

---

### Summary

- **AWS DMS**: Used for migrating the database from one AWS Windows MySQL server to another. Follow the steps to set up a replication instance, create endpoints, and migrate the data.
- **RDP File Transfer**: Used for copying files such as PDFs and images between servers. Simply connect via Remote Desktop, share local drives, and transfer files between the source and target servers.

### Part 3: **Execute SQL to create new columns in MySQL Database**

```bash
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

```

### Part 4: **Deployment**

#### First time

```bash

cd  C:\inetpub\wwwroot

git clone https://use-security@github.com/use-security/use-portal.git

cd use-portal

npm install

npm i sass

UAT: npm run build:uat

Prod: npm run build:prod

restart website in IIS

```

#### Next subsequent deployment

```bash

stop website in IIS (use-portal)

cd C:\inetpub\wwwroot\use-portal

git pull

npm install

npm i sass

UAT: npm run build:uat

Prod: npm run build:prod

restart website in IIS (use-portal)

```

### Part 5: **DNS Switching**



### Part 6: **Verification**

https://www.iduse.org.sg/ 
