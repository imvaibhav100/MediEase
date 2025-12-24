package com.example.backend.service;

import com.example.backend.model.Cart;
import com.example.backend.model.CartItem;
import com.example.backend.model.Order;
import com.example.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private CartService cartService;

    public Order createOrderFromCart(String userEmail, String shippingAddress, String paymentMethod) {
        Cart cart = cartService.getCartByUserEmail(userEmail);
        
        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }
        
        Order order = new Order();
        order.setUserEmail(userEmail);
        order.setItems(cart.getItems());
        order.setTotalAmount(cart.getTotalAmount());
        order.setShippingAddress(shippingAddress);
        order.setPaymentMethod(paymentMethod);
        order.setStatus("CONFIRMED");
        
        if ("COD".equals(paymentMethod)) {
            order.setPaymentStatus("PENDING");
        }
        
        Order savedOrder = orderRepository.save(order);
        
        // Clear the cart after order is placed
        cartService.clearCart(userEmail);
        
        return savedOrder;
    }

    public Order createBuyNowOrder(String userEmail, CartItem item, String shippingAddress, String paymentMethod) {
        Order order = new Order();
        order.setUserEmail(userEmail);
        order.getItems().add(item);
        order.setTotalAmount(item.getPrice() * item.getQuantity());
        order.setShippingAddress(shippingAddress);
        order.setPaymentMethod(paymentMethod);
        order.setStatus("CONFIRMED");
        
        if ("COD".equals(paymentMethod)) {
            order.setPaymentStatus("PENDING");
        }
        
        return orderRepository.save(order);
    }

    public List<Order> getOrdersByUserEmail(String userEmail) {
        return orderRepository.findByUserEmailOrderByCreatedAtDesc(userEmail);
    }

    public Optional<Order> getOrderById(String orderId) {
        return orderRepository.findById(orderId);
    }

    public Order updateOrderStatus(String orderId, String status) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.setStatus(status);
            return orderRepository.save(order);
        }
        throw new RuntimeException("Order not found");
    }

    public Order cancelOrder(String orderId, String userEmail) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            if (order.getUserEmail().equals(userEmail)) {
                if ("PENDING".equals(order.getStatus()) || "CONFIRMED".equals(order.getStatus())) {
                    order.setStatus("CANCELLED");
                    return orderRepository.save(order);
                }
                throw new RuntimeException("Order cannot be cancelled at this stage");
            }
            throw new RuntimeException("Unauthorized");
        }
        throw new RuntimeException("Order not found");
    }
}
