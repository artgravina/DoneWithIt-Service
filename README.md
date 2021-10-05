# DoneWithIt-Service

This is the backend Service for the DoneWithIt project.
Provides the Rest Api to support the functionality.
Utilizes Node/Express

Two data storage envirnoments have been set up:
JSON-SERVER - a simple server storing all data and images locally. The data is pure JSON and can be viewed/edited with any browser. See the "data" directory.
Images are stored in the public directory and are available with public urls.
GCLOUD-SERVER. This option implement the same API utilizing Googles Gcloud storage, and Firebase collections

Either service is configured utilizing the environment files stored in the 'config' directory.

App: https://github.com/artgravina/DoneWithIt.git

Server: https://github.com/artgravina/DoneWithIt-Service.git
