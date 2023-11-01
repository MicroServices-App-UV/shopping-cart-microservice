from sqlalchemy import Boolean, Column, ForeignKey, DateTime, Integer, String
from datetime import datetime
from database import Base


class Product(Base):
    __tablename__ = "product"
    
    order_id = Column(String, primary_key=True, index=True)
    product_id = Column(String, index=True)
    user_id = Column(String, index=True)
    name = Column(String, index=True)
    count = Column(Integer, index=True)
    price = Column(Integer, index=True)
    create_at = Column(DateTime, default=datetime.now, index=True)


