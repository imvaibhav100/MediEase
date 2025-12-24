package com.example.backend.service;

import com.example.backend.model.Cart;
import com.example.backend.model.CartItem;
import com.example.backend.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CartService {
    
    @Autowired
    private CartRepository cartRepository;

    public Cart getCartByUserEmail(String userEmail) {
        Optional<Cart> cartOpt = cartRepository.findByUserEmail(userEmail);
        if (cartOpt.isPresent()) {
            return cartOpt.get();
        }
        // Create new cart if doesn't exist
        Cart newCart = new Cart();
        newCart.setUserEmail(userEmail);
        return cartRepository.save(newCart);
    }

    public Cart addToCart(String userEmail, CartItem item) {
        Cart cart = getCartByUserEmail(userEmail);
        cart.addItem(item);
        return cartRepository.save(cart);
    }

    public Cart removeFromCart(String userEmail, String medicineName) {
        Cart cart = getCartByUserEmail(userEmail);
        cart.removeItem(medicineName);
        return cartRepository.save(cart);
    }

    public Cart updateCartItemQuantity(String userEmail, String medicineName, int quantity) {
        Cart cart = getCartByUserEmail(userEmail);
        cart.updateItemQuantity(medicineName, quantity);
        return cartRepository.save(cart);
    }

    public Cart clearCart(String userEmail) {
        Cart cart = getCartByUserEmail(userEmail);
        cart.clearCart();
        return cartRepository.save(cart);
    }

    public double getCartTotal(String userEmail) {
        Cart cart = getCartByUserEmail(userEmail);
        return cart.getTotalAmount();
    }

    public int getCartItemCount(String userEmail) {
        Cart cart = getCartByUserEmail(userEmail);
        return cart.getTotalItems();
    }
}
