cd C:/projectmrest
docker run -it -v %cd%:/app -p 51337:51337 gcr.io/projectmrest/development:latest
