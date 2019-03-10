# Bamazon

### Programmer: Paul Meehan
### Date: 3/10/2019


**Purpose:**
This application is a Command Line Interface utility that imitates an online store providing an interface for customers to make purchases, 
a separate interface for managers to maintain their inventory, and another interface for supervisors to monitor their productivity.

A video describing how the application works can be viewed by [clicking this link](https://drive.google.com/file/d/18BxsPxgmc0E-_4jbLX63bj4QRw2ZDhQH/view).

**User instructions:**

This program is a Command Line Interface application, so each module is started by entering a command in a Visual Studio terminal window.  You can start the interface to be used by the customer, manager, or supervisor by entering the following commands respectively:

* node bamazonCustomer
* node bamazonManager
* node bamazonSupervisor

Once you have started each module, you will be presented with a menu of choices.  Select the desired choices and then follow the additional instructions that will be provided by the application.



**Technical information:**


   #### Software requirements:
   1. Visual Studio
   1. Node.js
   1. MySQL


   #### Installation instructions:
   1. Copy the repository to a local folder.
   1. Within MySQL, execute the script in the schema.sql file to create the database.
   1. (Optional) execute the script in the seeds.sql file to load the two tables with test data.
   1. Edit the .env file to specify the database password and port number.  
        * See the .env_sample file for an example of what to enter.
   1. Within Visual Studio, open the folder in a terminal window.
   1. Install the needed dependencies by executing the command "npm i"

