cd C:/projectmrest
docker pull gcr.io/projectm-rest/local:latest
docker run -it -v %cd%:/app -p 51337:51337 --name projectmrest_local gcr.io/projectm-rest/local:latest
