from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

class EmailService:
    """Service for sending emails"""
    
    @staticmethod
    def send_order_confirmation(user_email, user_name, order_id, order_items, total_price):
        """Send order confirmation email"""
        try:
            subject = f"Order Confirmation - #{order_id}"
            context = {
                'user_name': user_name,
                'order_id': order_id,
                'order_items': order_items,
                'total_price': total_price,
            }
            
            # Simple text email (you can add HTML template later)
            message = f"""
            Hi {user_name},
            
            Thank you for your order!
            
            Order ID: {order_id}
            Total: ₹{total_price}
            
            Your order has been received and will be processed soon.
            You will receive another email once your order is shipped.
            
            Best regards,
            SmartCart Team
            """
            
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user_email],
                fail_silently=False,
            )
            return True
        except Exception as e:
            print(f"Error sending order confirmation email: {str(e)}")
            return False
    
    @staticmethod
    def send_payment_received(user_email, user_name, order_id, amount):
        """Send payment received email"""
        try:
            subject = f"Payment Received - Order #{order_id}"
            message = f"""
            Hi {user_name},
            
            We have successfully received your payment!
            
            Order ID: {order_id}
            Amount: ₹{amount}
            
            Your order will be shipped soon. You'll receive a tracking number via email.
            
            Best regards,
            SmartCart Team
            """
            
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user_email],
                fail_silently=False,
            )
            return True
        except Exception as e:
            print(f"Error sending payment received email: {str(e)}")
            return False
    
    @staticmethod
    def send_shipment_notification(user_email, user_name, order_id, tracking_number=None):
        """Send shipment notification email"""
        try:
            subject = f"Order Shipped - #{order_id}"
            tracking_info = f"\nTracking Number: {tracking_number}" if tracking_number else ""
            
            message = f"""
            Hi {user_name},
            
            Great news! Your order has been shipped!
            
            Order ID: {order_id}
            {tracking_info}
            
            You can track your package using the tracking number above.
            The package will arrive within 3-5 business days.
            
            Best regards,
            SmartCart Team
            """
            
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user_email],
                fail_silently=False,
            )
            return True
        except Exception as e:
            print(f"Error sending shipment notification email: {str(e)}")
            return False
    
    @staticmethod
    def send_delivery_confirmation(user_email, user_name, order_id):
        """Send delivery confirmation email"""
        try:
            subject = f"Delivery Confirmed - Order #{order_id}"
            message = f"""
            Hi {user_name},
            
            Your order has been delivered!
            
            Order ID: {order_id}
            
            We hope you enjoy your purchase. If you have any issues, please contact us.
            
            Thank you for shopping with SmartCart!
            
            Best regards,
            SmartCart Team
            """
            
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user_email],
                fail_silently=False,
            )
            return True
        except Exception as e:
            print(f"Error sending delivery confirmation email: {str(e)}")
            return False
    
    @staticmethod
    def send_registration_confirmation(user_email, user_name):
        """Send registration confirmation email"""
        try:
            subject = "Welcome to SmartCart!"
            message = f"""
            Hi {user_name},
            
            Welcome to SmartCart!
            
            Your account has been successfully created.
            You can now login and start shopping.
            
            Happy shopping!
            
            Best regards,
            SmartCart Team
            """
            
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user_email],
                fail_silently=False,
            )
            return True
        except Exception as e:
            print(f"Error sending registration confirmation email: {str(e)}")
            return False
