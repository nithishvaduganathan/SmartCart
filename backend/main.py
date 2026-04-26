from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routes import auth, products, categories, cart, orders, profile, payments, admin, discounts

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SmartCart API",
    description="E-commerce API built with FastAPI",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with /api prefix
app.include_router(auth.router, prefix="/api")
app.include_router(products.router, prefix="/api")
app.include_router(categories.router, prefix="/api")
app.include_router(cart.router, prefix="/api")
app.include_router(orders.router, prefix="/api")
app.include_router(profile.router, prefix="/api")
app.include_router(payments.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(discounts.router, prefix="/api")

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/api/docs")
def api_docs():
    return {"message": "API Documentation available at /docs"}


