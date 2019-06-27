cd C:/projectmrest
docker run -it -v %cd%:/app -p 51337:51337 gcr.io/projectm-rest/local:latest
