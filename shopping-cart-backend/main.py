from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import  Text, List, Annotated
from datetime import datetime
import models
from database import engine,  SessionLocal
from sqlalchemy.orm  import Session
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
origins = ["*"] 
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos HTTP (GET, POST, etc.)
    allow_headers=["*"],  # Permite todas las cabeceras HTTP
)
models.Base.metadata.create_all(bind=engine)

class Product(BaseModel):
    order_id: str
    product_id: str
    user_id: str
    name:  str
    count: int
    price: float
    create_at: datetime = datetime.now()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

@app.post("/add-shopping-cart")
async def save_product(product: Product, db: db_dependency):
    db_product = models.Product(
        order_id= product.order_id,
        product_id=product.product_id,
        user_id=product.user_id,
        name=product.name,
        count=product.count,
        price=product.price,
    )

    db.add(db_product)
    db.commit()
    db.refresh(db_product)


@app.get("/get-all-shopping-cart")
async def get_all_products(db: db_dependency):
   try:
       products = db.query(models.Product).all()
       return products
   except Exception as e:
       raise HTTPException(status_code=500, detail="Error al obtener todos los  productos de la  base de datos")



@app.get("/get-user-shopping-cart/{user_id}")
async def get_user_products(user_id: str, db: db_dependency):  
    try:
       productsCart = db.query(models.Product).filter(models.Product.user_id == user_id).all()
       return productsCart
    except Exception as e:
       raise HTTPException(status_code=500, detail="Error al obtener los  productos del  usuario de la  base de datos")


@app.put("/new-quantity-shopping-cart/{order_id}/{new_quantity}")
async def  update_product_quantity(new_quantity:int, order_id:str, db: db_dependency):
    try:
      if new_quantity>=0:  
        productCart = db.query(models.Product).filter(models.Product.order_id == order_id).first()
        
        if productCart is not None:
            productCart.count =  new_quantity
            db.commit()
            db.refresh(productCart)
            return  {"message": "Cantidad del producto actualizada exitosamente"}
        else:
            raise  HTTPException(status_code=404, detail="Producto no encontrado")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error al editar la cantidad del producto en la base de datos")    


@app.delete("/remove-from-cart/{order_id}")
async def remove_from_cart(order_id: str, db: db_dependency):
    try:
        productCart = db.query(models.Product).filter(models.Product.order_id == order_id).first()

        if productCart:
            db.delete(productCart)
            db.commit()
            return {"message": "Producto eliminado del carrito exitosamente"}
        else:
            raise HTTPException(status_code=404, detail="Producto no encontrado en el carrito")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error al eliminar el producto del carrito")


@app.delete("/delete-product-shopping-cart/{user_id}")
async def clear_user_products(user_id: str, db: db_dependency):
    try:
        productsCart = db.query(models.Product).filter(models.Product.user_id == user_id).all()

        if productsCart:
            for product in productsCart:
                db.delete(product)
            db.commit

            return {"message": f"Todos los productos del usuario con ID {user_id} han sido eliminados"}
        else:
            raise HTTPException(status_code=404, detail=f"No se encontraron productos para el usuario con ID {user_id}")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error al eliminar productos del usuario en la base de datos")    
        

@app.get("/total-shopping-cart/{user_id}")
async def calculate_total_price(user_id: str, db: db_dependency):
    try:
        products = db.query(models.Product).filter(models.Product.user_id == user_id).all()
        total_price = sum(product.price * product.count for product in products)
        return {"user_id": user_id, "total_price": total_price}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error al calcular el precio total del carrito del usuario en la base de datos")


@app.get("/")
async def read_root():
    return {"Hello":"World"}

