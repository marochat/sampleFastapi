FROM python:3.10.4-slim-bullseye

# python web and database library install
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code
RUN groupadd -g 1001 user;\
    useradd -u 1001 -g user user
COPY requirements.txt /code/
# nodejs
RUN set -eux; \
    apt update; apt install -y nodejs npm git wget curl sudo procps; \
    npm install -g n; \
    n stable; \
    apt purge -y --auto-remove nodejs npm
RUN npm install -g ts-node typescript sass; \
    npm install -g bootstrap
RUN pip install -r requirements.txt

ARG USER_NAME=app
ARG USER_UID=1000
ARG PASSWD=password

RUN useradd -m -s /bin/bash -u $USER_UID $USER_NAME; \
    usermod -d /code $USER_NAME; \
    usermod -s /bin/bash $USER_NAME; \
    echo "${USER_NAME} ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/${USER_NAME}

RUN echo '#!/bin/bash' > /code/startup; \
    echo 'echo startup script.' >> /code/startup; \
    chmod +x /code/startup

CMD ["/bin/bash"]
