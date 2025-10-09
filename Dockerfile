ARG PYTHON_VERSION=3.12-slim

FROM python:${PYTHON_VERSION}

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Use a slim image with a known Python version
ARG PYTHON_VERSION=3.12-slim
FROM python:${PYTHON_VERSION}

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install gosu for a clean privilege drop and create app directory
RUN apt-get update && apt-get install -y --no-install-recommends gosu && \
    mkdir -p /code && \
    adduser --system --disabled-password --group django

# Set working directory and copy files
WORKDIR /code
COPY requirements.txt /tmp/requirements.txt
RUN set -ex && \
    pip install --upgrade pip && \
    pip install -r /tmp/requirements.txt && \
    rm -rf /root/.cache/
COPY . /code

# Copy the startup script and set correct permissions
# The COPY command for the script should come after you copy your code.
COPY start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh
RUN chown root:root /usr/local/bin/start.sh

EXPOSE 8000

# Set the ENTRYPOINT to run the script as root initially
ENTRYPOINT ["/usr/local/bin/start.sh"]
