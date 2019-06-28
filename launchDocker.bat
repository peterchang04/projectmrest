::go to directory
cd C:/projectmrest

::fetch :latest tag from cloud
docker pull gcr.io/projectm-rest/local:latest

::attempt to remove (if exists)
docker rm projectmrest_local

::start docker container
docker run -it -v %cd%:/app -p 51337:51337 --name projectmrest_local gcr.io/projectm-rest/local:latest
