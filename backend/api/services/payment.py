import razorpay
import os
import hmac
import hashlib
from django.conf import settings
from api.models import Order

class PaymentService:
    """Service for handling Razorpay payments"""
    
    def __init__(self):
        self.client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_SECRET_KEY)
        )
    
    def create_razorpay_order(self, order_id, amount, customer_email=None, customer_phone=None):
        """
        Create a Razorpay order for payment
        
        Args:
            order_id: SmartCart Order ID
            amount: Amount in paisa (1 rupee = 100 paisa)
            customer_email: Customer email
            customer_phone: Customer phone number
            
        Returns:
            dict: Razorpay order details
        """
        try:
            # Amount should be in paisa (smallest currency unit)
            razorpay_order = self.client.order.create({
                'amount': int(amount * 100),  # Convert to paisa
                'currency': 'INR',
                'receipt': f'order_{order_id}',
                'notes': {
                    'order_id': str(order_id),
                    'email': customer_email or '',
                    'phone': customer_phone or '',
                }
            })
            return {
                'success': True,
                'razorpay_order_id': razorpay_order['id'],
                'amount': razorpay_order['amount'],
                'currency': razorpay_order['currency'],
                'receipt': razorpay_order['receipt'],
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def verify_payment_signature(self, razorpay_order_id, razorpay_payment_id, razorpay_signature):
        """
        Verify payment signature from Razorpay
        
        Args:
            razorpay_order_id: Order ID from Razorpay
            razorpay_payment_id: Payment ID from Razorpay
            razorpay_signature: Signature from Razorpay
            
        Returns:
            bool: True if signature is valid, False otherwise
        """
        try:
            # Use Razorpay SDK built-in verifier (most reliable)
            params_dict = {
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature,
            }
            self.client.utility.verify_payment_signature(params_dict)
            return True
        except Exception as e:
            print(f"Razorpay SDK verification failed: {str(e)}, trying manual HMAC...")
            try:
                # Fallback: manual HMAC-SHA256 verification
                body = f'{razorpay_order_id}|{razorpay_payment_id}'
                expected_signature = hmac.new(
                    settings.RAZORPAY_SECRET_KEY.encode(),
                    body.encode(),
                    hashlib.sha256
                ).hexdigest()
                return hmac.compare_digest(expected_signature, razorpay_signature)
            except Exception as e2:
                print(f"Manual HMAC verification error: {str(e2)}")
                return False
    
    def fetch_payment_details(self, payment_id):
        """
        Fetch payment details from Razorpay
        
        Args:
            payment_id: Payment ID from Razorpay
            
        Returns:
            dict: Payment details
        """
        try:
            payment = self.client.payment.fetch(payment_id)
            return {
                'success': True,
                'payment': payment
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def update_order_payment_status(self, order, razorpay_order_id, razorpay_payment_id, status='Paid'):
        """
        Update order with payment details
        
        Args:
            order: Order instance
            razorpay_order_id: Razorpay order ID
            razorpay_payment_id: Razorpay payment ID
            status: Order status to set
            
        Returns:
            bool: True if updated successfully
        """
        try:
            order.razorpay_order_id = razorpay_order_id
            order.razorpay_payment_id = razorpay_payment_id
            order.status = status
            order.save()
            return True
        except Exception as e:
            print(f"Error updating order: {str(e)}")
            return False
    
    def refund_payment(self, payment_id, amount=None):
        """
        Refund a payment
        
        Args:
            payment_id: Razorpay payment ID
            amount: Amount to refund in rupees (optional, full refund if not specified)
            
        Returns:
            dict: Refund response
        """
        try:
            refund_data = {}
            if amount:
                refund_data['amount'] = int(amount * 100)  # Convert to paisa
            
            refund = self.client.payment.refund(payment_id, refund_data)
            return {
                'success': True,
                'refund': refund
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
