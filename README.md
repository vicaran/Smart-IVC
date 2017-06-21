# Smart-IVC
[![Build Status](https://travis-ci.org/vicaran/Smart-IVC.svg?branch=master)](https://travis-ci.org/vicaran/Smart-IVC)&nbsp;
<div align="center">
	<img src="images/logo.png" width="300pt" height="300pt" />
	<div align="center">
		<a href="http://reveal.inf.usi.ch/">
			<img src="images/REVEALogo-black.png" width="300pt" height="100pt"/>
		</a>
		<a href="http://www.inf.usi.ch/">
			<img src="images/logo_usi.png" width="100pt" height="100pt"/>
		</a>
	</div>
</div>

# The idea behind this project #
<p>
Cities constantly evolve, with the appearance of new neighborhoods and the disappearance of old buildings. Information about cities are nowadays stored as static data inside huge storages where it is difficult and slow to retrieve particular information. Moreover, different data sources about cities are not aggregated since they are provided by both public websites on the Internet and by public sectors of the city.
</p>
<p>
A visualization can help supporting any decision that involves city evolution,  especially in the contest of what is called a Smart City. No such service exists that provides a unique environment in which the user can both visualize a city and interact with its elements. The only technologies available are either not exhaustive or too complex to use. For example, it is possible to find technologies online that are limited to provide a 3D--visualization without any kind of interaction between the map and the user.
</p>
<p>
Smart-IVC provides an interactive 3D-visualization  model of cities,  integrating heterogeneous data, and supporting complex visual queries. Smart-IVC is  an application accessible by everyone (since it is both user-friendly and publicly available) and that aims to enhance the city visualization, getting closer to the user needs.
</p>

# Just use it #
If you just want to try and play with Smart-IVC, you can find it [here](http://rio.inf.usi.ch:38080).


# Run it on your machine #
If you have more time, you can run it on your machine using the following instructions.

<b>Beware!!
Since the program needs to load all the information about the city, to complete these steps, it may take a while (~24 hours)</b> 

### Prepare the environment 

- The user needs to have Java and MySql installed. Once the latter is installed, set a username and a password (we will refer to them as USERNAME_DB and PASSWORD_DB later).

- Create an empty database and give a name to it (we will refer to it as  NAMEOFDATABASE later)

- Generate a Google Maps Key on [https://console.developers.google.com](https://console.developers.google.com) (we will refer to it as GOOGLEKEY later)

- Download this repository as a zip file
- Unzip the folder
- Execute the following commands to install Cesium:

```bash
cd Smart-IVC
- mkdir src/main/resources/static/Cesium
- npm install cesium
- mv node_modules/cesium/Build src/main/resources/static/Cesium/Build
```

### Run the application
4. Now execute the following commands to run the application Server:

```bash
cd Smart-IVC
mvn clean install
cd target
java -jar demo-0.0.1-SNAPSHOT.jar --DBPASSWORD="PASSWORD_DB" --GoogleMapsKey="GOOGLEKEY" --DBUSERNAME="USERNAME_DB" --DBURL="jdbc:mysql://localhost:3306/NAMEOFDATABASE"
```
After the last command listed has been executed, the server will start.
Be sure that everything works on the terminal, without any output error.
Now open your favourite browser and go to [localhost:8080](localhost:8080) (equivalent to [127.0.0.1:8080](127.0.0.1:8080)).

You can now use the application to visulize and interact with the city.


# Credits #

### Developed by:
-   Andrea Vicari

### Under the supervision of:
- [Prof. Dr. Michele Lanza](http://www.inf.usi.ch/faculty/lanza/)
- [Dr. Andrea Mocci](http://www.inf.usi.ch/postdoc/mocci/)

### In collaboration with:
- [Reveal Team](http://reveal.inf.usi.ch/)
- [Software Institute -  USI Lugano](http://si.usi.ch/) 

Created during the Spring Semester 2017 as a Bachelor Project @[Università della Svizzera Italiana](http://www.inf.usi.ch/) 


