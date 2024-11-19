FROM python:3.12.7


WORKDIR /code


COPY ./requirements.txt /code/requirements.txt


RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt


COPY ./database /code/database
COPY ./routers /code/routers
COPY ./utils /code/utils
COPY __init__.py /code/__init__.py
COPY main.py /code/main.py


CMD ["fastapi", "run", "main.py", "--proxy-headers", "--host","0.0.0.0","--port", "8000"]
