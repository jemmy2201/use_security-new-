This is a USE Portal Application

## Setup



```bash

git clone https://use-security@github.com/use-security/use-portal.git 

npm install

npm i sass

```

Open [http://localhost](http://localhost:3000) with your browser to see the login page.

## Database

## Database Setup

### Install MySQL Locally (Mac)

1. Download MySQL 8.4.3 LTS for Mac from the [official MySQL website](https://dev.mysql.com/downloads/mysql/8.4.html).
2. Choose the DMG archive appropriate for your Mac's architecture (Intel or Apple Silicon).
3. Open the downloaded DMG file and run the MySQL installer package.
4. Follow the installation wizard, accepting the license agreement and choosing your desired setup type.
5. Set a root password when prompted during the installation process.
6. Complete the installation and launch MySQL from the System Preferences pane.

### Create and Populate Database
This is a data dump from the existing portal database (before the new portal development)
1. Navigate to the `db` folder in the repository.
2. Find the SQL file for schema creation (e.g., `data-dump.sql`).
3. Execute this SQL file in your MySQL database to create the necessary tables and structure.

### Add New Columns

After importing the initial database structure:

1. Locate the `add_columns_1.sql` file in the repository.
2. Execute this SQL file to add new columns to the existing tables.
This adds new columns related to new features added for the new portal development

### Connect Application to Database

1. Update the `.env` file with your MySQL connection details:

   ```
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=your_database_name
   ```

2. Ensure your application's database configuration uses these environment variables.

### Using MySQL Workbench for Database Management

MySQL Workbench provides a user-friendly graphical interface for database administration:

1. Download MySQL Workbench from the [official MySQL website](https://dev.mysql.com/downloads/workbench/).
2. Install the version compatible with your operating system.
3. Launch MySQL Workbench after installation.
4. Create a new connection:
   - Click the '+' icon next to 'MySQL Connections'.
   - Enter connection details: name, hostname (localhost), port (3306), and username.
   - Test and save the connection.
5. Use Workbench to:
   - Execute SQL queries
   - Design and modify database schemas
   - Manage user privileges
   - Monitor database performance
   - Create visual data models

This tool simplifies database management tasks, making it easier to work with your MySQL database.

### Using Docker for MySQL

If you prefer using Docker to run MySQL, follow these steps:

1. Ensure Docker is installed on your system.

2. Create a `docker-compose.yml` file in your project root with the following content:

   ```yaml
    version: '3.3'
    services:
    db:
        image: mysql
        restart: always
        environment:
        MYSQL_DATABASE: 'db'
        # root user is automatically created
        # MYSQL_USER: 'dev'
        # You can use whatever password you like
        # MYSQL_PASSWORD: ''
        # Password for root access
        MYSQL_ROOT_PASSWORD: 'password'
        MYSQL_ALLOW_EMPTY_PASSWORD: 1
        ports:
        # <Port exposed> : <MySQL Port running inside container>
        - '3306:3306'
        expose:
        # Opens port 3306 on the container
        - '3306'
        # Where our data will be persisted
        volumes:
        - mysql-db:/var/lib/mysql
    # Names our volume
    volumes:
    mysql-db:
   ```

3. Start the MySQL container:
   ```bash
   docker-compose up -d
   ```

4. Connect to the MySQL instance:
   ```bash
   docker exec -it <container_name> mysql -uroot -p
   ```

5. Create your database:
   ```sql
   CREATE DATABASE your_database_name;
   ```

6. Update your `.env` file to use the Docker MySQL instance:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=example
   DB_NAME=your_database_name
   ```

7. To stop the MySQL container:
   ```bash
   docker-compose down
   ```

Remember to adjust the MySQL root password and other settings for production use.



## Mockpass

We are using mockpass in local to test. In UAT and production it will connect to actual Singpass.

### Setup mockpass 

1. Install Mockpass package:
```bash 
npm install @opengovsg/mockpass
```

2. Set up environment variables (for Mac/Unix):
```bash
# Create or edit your .env file
echo "SHOW_LOGIN_PAGE=true" >> .env
echo "MOCKPASS_NRIC=S8979373D" >> .env
echo "SP_RP_JWKS_ENDPOINT=http://localhost/api/jwks" >> .env

# Or export them directly in your terminal
export SHOW_LOGIN_PAGE=true
export MOCKPASS_NRIC=S8979373D
export SP_RP_JWKS_ENDPOINT=http://localhost/api/jwks
```

3. Start Mockpass:
```bash
# If installed globally
mockpass

# Or using npx
npx mockpass
```

Mockpass will now be running and ready to simulate Singpass authentication for local development.

## Deploy 
