
// ******************* 1.  CREATE users*************************///

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    phone VARCHAR(15),
    role ENUM('admin', 'attendee', 'event_organizer') DEFAULT 'attendee',
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP
);



// ********************* 2. CREATE blacklisted_tokens  ***********************//
CREATE TABLE blacklist_token (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token TEXT NOT NULL,
    blacklisted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    token_type ENUM('access', 'refresh') NOT NULL DEFAULT 'access'
);



// ********************* 3. CREATE EVENTS ***********************//
CREATE TABLE events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    organizer_id INT NOT NULL, -- FK from users
    title VARCHAR(100) NOT NULL,
    description TEXT,
    category_id INT, -- FK from event_categories
    start_datetime DATETIME NOT NULL,
    end_datetime DATETIME NOT NULL,
    venue_id INT NOT NULL, -- FK from venues
    max_attendees INT,
    price DECIMAL(10,2),
    status ENUM('draft', 'published', 'cancelled', 'completed') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (organizer_id) REFERENCES users(user_id),
    FOREIGN KEY (venue_id) REFERENCES venues(venue_id),
    FOREIGN KEY (category_id) REFERENCES event_categories(category_id)
);


********************** 4.  event_category *************
CREATE TABLE event_categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT
);



*********************** 5. venue *****************
CREATE TABLE venues (
    venue_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50),
    country VARCHAR(50) NOT NULL,
    postal_code VARCHAR(20),
    capacity INT NOT NULL,
    contact_phone VARCHAR(20),
    contact_email VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);




**************** 6. Event_Images (for multiple images per event)*********
CREATE TABLE event_images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (event_id) REFERENCES events(event_id)
);


******************** 7. Favourites *******************
CREATE TABLE favorites (
    favorite_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    UNIQUE KEY unique_favorite (user_id, event_id)
);



? *************** 8. Tickets ***********************
CREATE TABLE tickets (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    ticket_type ENUM('VIP', 'Standard', 'EarlyBird', 'Free') NOT NULL DEFAULT 'Free',
    price DECIMAL(10,2) DEFAULT 0.00,
    total_quantity INT NOT NULL,
    remaining_quantity INT NOT NULL,
    sales_start DATETIME,
    sales_end DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (event_id) REFERENCES events(event_id)
);




****************************** 9. Booking ************************

CREATE TABLE bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'confirmed', 'cancelled', 'refunded') DEFAULT 'pending',
    total_amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id)
);



********* 10.  Booking_ticket **************
To allow multiple ticket types in one booking.

Edit
CREATE TABLE booking_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    ticket_id INT,
    quantity INT,
    price DECIMAL(10,2),
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
    FOREIGN KEY (ticket_id) REFERENCES tickets(ticket_id)
);


************************ 11. Payments ***************

CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    user_id INT NOT NULL,
    payment_method ENUM('credit_card', 'paypal', 'bank_transfer', 'esewa') DEFAULT 'credit_card',
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    transaction_id VARCHAR(100) NOT NULL,  -- Here is the transaction ID for the payment.
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);




******************** 11.  attendees **********
CREATE TABLE attendees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_item_id INT,
    name VARCHAR(100),
    email VARCHAR(100),
    checked_in BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (booking_item_id) REFERENCES booking_items(id)
);


***************** 12. Reviews **************

CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    event_id INT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (event_id) REFERENCES events(id)
);


************* 13. Invoices *************
CREATE TABLE invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payment_id INT,
    invoice_number VARCHAR(100) UNIQUE,
    issued_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payment_id) REFERENCES payments(id)
);

************* 14. Notifications **************
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT, -- null if for all users or admins
    title VARCHAR(255),
    message TEXT,
    type ENUM('system', 'event', 'booking', 'payment') DEFAULT 'system',
    seen BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);


************* 15. Logs *******************
CREATE TABLE logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(255), -- e.g., 'created event', 'deleted booking'
    target_table VARCHAR(50),
    target_id INT,
    log_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);


************************** 16. user_activity ************
Tracks what users are doing on your site (page visits, search terms, time of activity).

sql
Copy
Edit
CREATE TABLE user_activity (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    activity_type VARCHAR(100), -- e.g., 'login', 'view_event', 'search', 'booking_attempt'
    activity_data TEXT, -- e.g., event id or search term
    activity_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);



// **************************** 17. Promotion (Optional) **********
CREATE TABLE promotions (
    promotion_id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    discount_type ENUM('percentage', 'fixed') NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    max_uses INT,
    current_uses INT DEFAULT 0,
    min_order_amount DECIMAL(10, 2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);


*************************** organizer_verification  ************
CREATE TABLE organizer_verification (
    verification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    verified BOOLEAN DEFAULT FALSE,  -- Initially false, changed to true once verified
    verification_notes TEXT,  -- Admin notes about the verification process
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);















