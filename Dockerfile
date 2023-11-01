FROM python:3.11-slim
ENV PYTHONUNBUFFERED=1
WORKDIR /app
COPY  ./shopping-cart-backend/requirements.txt ./
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
COPY ./shopping-cart-backend ./
EXPOSE 8000
#CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]