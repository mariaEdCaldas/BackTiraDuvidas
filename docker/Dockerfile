ARG VARIANT="bookworm"

FROM python:3.13.0a1-${VARIANT} as develop-stage

RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
		postgresql-client \
	&& rm -rf /var/lib/apt/lists/*

RUN apt-get update \
  && pip install --upgrade pip \
  && pip install django \
  && pip install djangorestframework \
  && pip install markdown \
  && pip install django-filter

WORKDIR /app
# RUN pip install -r requirements.txt

EXPOSE 80
CMD ["python", "manage.py", "runserver", "0.0.0.0:80"]
