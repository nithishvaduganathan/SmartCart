from django.contrib import admin
from .models import Category, Product, Cart, CartItem, Order, OrderItem, UserProfile, Payment

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'stock', 'category')
    list_filter = ('category', 'created_at')
    search_fields = ('name', 'description')

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at')
    list_filter = ('created_at',)

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('cart', 'product', 'quantity')
    list_filter = ('cart',)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'status', 'total_price', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__username', 'razorpay_order_id')
    readonly_fields = ('razorpay_order_id', 'razorpay_payment_id', 'created_at', 'updated_at')
    fieldsets = (
        ('Order Info', {
            'fields': ('id', 'user', 'total_price', 'status', 'created_at', 'updated_at')
        }),
        ('Shipping', {
            'fields': ('shipping_address',)
        }),
        ('Payment Info', {
            'fields': ('razorpay_order_id', 'razorpay_payment_id')
        }),
    )

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'price', 'quantity')
    list_filter = ('order',)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone')
    search_fields = ('user__username', 'phone')

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('razorpay_payment_id', 'order', 'amount', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('razorpay_payment_id', 'razorpay_order_id')
    readonly_fields = ('razorpay_payment_id', 'razorpay_order_id', 'created_at', 'updated_at')

