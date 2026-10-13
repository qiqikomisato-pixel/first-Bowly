FROM python:3.14-alpine3.23 AS base

ENV POETRY_VERSION=2.4.1 \
    POETRY_HOME="/opt/poetry" \
    POETRY_VIRTUALENVS_IN_PROJECT=true \
    POETRY_NO_INTERACTION=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

# Создаём пользователя сразу в базовом образе
RUN addgroup -g 1000 -S appgroup \
    && adduser -u 1000 -S appuser -G appgroup

RUN apk add --no-cache curl libpq

RUN curl -sSL https://install.python-poetry.org | python3 -
RUN ln -s /opt/poetry/bin/poetry /usr/local/bin/poetry

COPY pyproject.toml poetry.lock ./

FROM base AS builder
RUN apk add --no-cache gcc musl-dev postgresql-dev
RUN poetry install --no-root

FROM base AS runtime
RUN apk add --no-cache libpq

COPY --from=builder /app/.venv /app/.venv
ENV PATH="/app/.venv/bin:$PATH"

COPY ./app ./app

USER appuser

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]