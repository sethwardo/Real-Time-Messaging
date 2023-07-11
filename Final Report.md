Final Report  
SWEN 400  
12-20-22
==========

## Tyler Ailes

## Seth Ward

## Noah McBride

---

# 1. Purpose of the Application

The purpose of this project is to build an open-source, real-time chat component. Many companies outsource their chat systems, or build off of already created open-source components.  
This will also allow for us to gain experience with working on open-source projects, and help reinforce the Agile Scrum methodology as we learn it.

# 2. Environment and Installation

The environment of this application is hosted within a Docker container which can be downloaded from the production GitHub repository (which would be set up when the application moves into production). This Docker container contains a docker-compose.yml file in which allows for easy installation of the environment variables which the system uses.

Before going into your web serving terminal online, open the repository in your chosen development environment and click on the .env file. This is where all the ports are defined to the application. To make sure this works concurrently with your current port setup on your website. The port numbers which you have to change to coincide with your current set up are the ones below:

```
NODE_LOCAL_PORT= [Enter current webserviner port ]
NODE_DOCKER_PORT= [Enter current webserviner port ]
```

This will now allow the ports to be correct throughout you're whole application and the real time messaging application.

The second part of installation is cloning or downloading the repository then putting it into your folder where the client's current website is being served from. The command is as follows:

```
docker-compose up --detach
```

This allows for the Docker container to be created installing all the necessary libraries for Socket.io implementation of the messaging service. The '--detach' then allows for you to continue to use the command line in the terminal whilst the Docker container runs in the back ground.

Now this means that the Real Time Messaging system is fully operational within its own right, and now just has to be linked from the existing website. For this is can be as simple as creating a button or link within the HTML file of the webpage in which you want users to be able to enter the chat system from. An example of the HTML code in which you could use for this is:

```
<a href="http://[You're Url domain]:3000"> Please click here to talk to a customer service representative </a>
```

Now you have the Real Time Messaging system connected to your website, and is ready to use for your clients.

For access to the admin page for your employee's to have a conversation with the clients. On the employee page of your website, add in a similar HTML but just changed slightly as shown here:

```
<a href="http://[You're Url domain]:3000/admin"> Please click here to talk to a customer service representative </a>
```
Now you have the Real Time Messaging system connected to your website, and is ready to use for your clients and employees. 

# 3. Architecture and Program Flow

The architecture of the system is simple. There is a socket component that is connected to a database. The socket has two components, one for a service user and a costumer user. connections are only one to one, and connections only happen between different users. costumer users are added to a list, which service users can then pick from.

For the program flow of the application, first it uses docker to create an image of where the application will be stored. After this the flow of the application is you click on a button, which will open a jquery popup, this combined with the socket will allow you a service member connect to a customer. once the conversation is over, the socket will no longer be connected. The chat will then be stored in a database for further review.

# 4. Application Features

Our project can be broken down into two areas, one that a potential customer interacts with, and one that your companies support technicians interact with.

Inside the `server.js` file, these are split up by Socket.IO Namespaces that point to seperate HTML files, which are defined as follows:

```
app.get("/admin", (req, res) => {
  res.sendFile(__dirname + "/admin.html");
});
```

```
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/client/username.html");
});
```

This allows for easier plugging into existing websites, as the customer facing portion can be placed on the main page, and the admin facing portion can be placed on a seperate page. It also makes it easier to add on additional features to the admin facing portion, if there is something that your Customer Service reps belive would be useful.

## 4.1. Customer Facing

- Allows a customer to enter a username that shows in the chat logs, or they can begin chatting without entering one
- Popup that appears after pressing the chat button, and an automatic message to inform them that a customer support tech will be with them shortly.

## 4.2. Administrator Facing

- For tracking purposes, customer support technicians have the ablitity to enter a username, however not required and is preset to `Customer Support`
- A running count of the number of customers currently connected
- A list of everyone connected, with the ablilty to start a chat with users that are customers.

# 5. Use Case

A customer user will see a button that will let them chat with a representative. They will have the option to enter a username. Once they click the button they will be added to a list of users. 

A service user will see a list of connected customers. They can change their username, or start a chat with one of the connected customers.

After a chat between a Customer and a service user is completed, the chat will be saved in the database for review.

# 6. Application Uninstallation
Due to the way the application is set up. Uninstallation is as simple as deleting the Docker container folder from within your webserving file system and deleting the routing HTML code from your current website.

Bare in mind, before you delete the folder, if you want to download the chat logs from within the container you shall do so from within the associated MySQL database within the container itself. 

Furthermore, it's good practice to stop and delete each individual image before hard deleting the folder, this can be done through the following commands.

To find the Docker image names run the command:

```
sudo docker container ls -a
```
This will bring up all the Docker containers which are running from within your system. Copy the name's of the app and database images from the Real Time Messaging application into this command.

```
sudo docker container stop [image name]
```
This will stop that container, from here you can go back to the list of all Docker images running and copy the two instance ID's into the command:

```
sudo docker container rm [image id]
```

Now you are free to delete the folder from your directory to complete the uninstallation. 