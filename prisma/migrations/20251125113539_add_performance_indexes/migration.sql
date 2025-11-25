-- Migration: Add Performance Indexes
-- Purpose: Improve query performance for common operations
-- Impact: Will significantly speed up queries at scale (500+ users, 5000+ properties, 50000+ bookings)

-- ============== BOOKING INDEXES ==============

-- Index for listing user's bookings by status (used in dashboard)
CREATE INDEX IF NOT EXISTS "Booking_userId_status_idx" ON "Booking"("userId", "status");

-- Index for listing property bookings (used in availability checks)
CREATE INDEX IF NOT EXISTS "Booking_propertyId_status_idx" ON "Booking"("propertyId", "status");

-- Index for availability queries (most critical - prevents table scans)
CREATE INDEX IF NOT EXISTS "Booking_propertyId_checkInDate_checkOutDate_idx"
  ON "Booking"("propertyId", "checkInDate", "checkOutDate");

-- Index for upcoming bookings dashboard
CREATE INDEX IF NOT EXISTS "Booking_status_checkInDate_idx" ON "Booking"("status", "checkInDate");

-- Index for recent bookings
CREATE INDEX IF NOT EXISTS "Booking_userId_createdAt_idx" ON "Booking"("userId", "createdAt" DESC);

-- Index for payment status queries
CREATE INDEX IF NOT EXISTS "Booking_paymentStatus_idx" ON "Booking"("paymentStatus");

-- ============== PROPERTY INDEXES ==============

-- Index for user's properties by status
CREATE INDEX IF NOT EXISTS "Property_userId_status_idx" ON "Property"("userId", "status");

-- Index for property search by city
CREATE INDEX IF NOT EXISTS "Property_city_idx" ON "Property"("city");

-- Index for active properties
CREATE INDEX IF NOT EXISTS "Property_status_idx" ON "Property"("status");

-- Index for available properties
CREATE INDEX IF NOT EXISTS "Property_isAvailable_status_idx" ON "Property"("isAvailable", "status");

-- ============== PAYMENT INDEXES ==============

-- Index for user's payments by status
CREATE INDEX IF NOT EXISTS "Payment_userId_status_idx" ON "Payment"("userId", "status");

-- Index for booking payments (used when updating booking payment status)
CREATE INDEX IF NOT EXISTS "Payment_bookingId_status_idx" ON "Payment"("bookingId", "status");

-- Index for tenant payments
CREATE INDEX IF NOT EXISTS "Payment_tenantId_status_idx" ON "Payment"("tenantId", "status");

-- Index for payment date queries (financial reports)
CREATE INDEX IF NOT EXISTS "Payment_userId_paymentDate_idx" ON "Payment"("userId", "paymentDate" DESC);

-- Index for pending payments
CREATE INDEX IF NOT EXISTS "Payment_status_paymentDate_idx" ON "Payment"("status", "paymentDate");

-- ============== MAINTENANCE REQUEST INDEXES ==============

-- Index for user's maintenance requests by status
CREATE INDEX IF NOT EXISTS "MaintenanceRequest_userId_status_idx" ON "MaintenanceRequest"("userId", "status");

-- Index for property maintenance requests
CREATE INDEX IF NOT EXISTS "MaintenanceRequest_propertyId_status_idx" ON "MaintenanceRequest"("propertyId", "status");

-- Index for urgent/priority maintenance
CREATE INDEX IF NOT EXISTS "MaintenanceRequest_status_priority_idx" ON "MaintenanceRequest"("status", "priority");

-- ============== INQUIRY INDEXES ==============

-- Index for user's inquiries by status
CREATE INDEX IF NOT EXISTS "Inquiry_userId_status_idx" ON "Inquiry"("userId", "status");

-- Index for property inquiries
CREATE INDEX IF NOT EXISTS "Inquiry_propertyId_status_idx" ON "Inquiry"("propertyId", "status");

-- Index for new/unread inquiries
CREATE INDEX IF NOT EXISTS "Inquiry_status_createdAt_idx" ON "Inquiry"("status", "createdAt" DESC);

-- ============== EXPENSE INDEXES ==============

-- Index for user's expenses
CREATE INDEX IF NOT EXISTS "Expense_userId_status_idx" ON "Expense"("userId", "status");

-- Index for property expenses
CREATE INDEX IF NOT EXISTS "Expense_propertyId_expenseDate_idx" ON "Expense"("propertyId", "expenseDate" DESC);

-- Index for expense date queries (financial reports)
CREATE INDEX IF NOT EXISTS "Expense_userId_expenseDate_idx" ON "Expense"("userId", "expenseDate" DESC);

-- ============== DOCUMENT INDEXES ==============

-- Index for user's documents by type
CREATE INDEX IF NOT EXISTS "Document_userId_documentType_idx" ON "Document"("userId", "documentType");

-- Index for folder documents
CREATE INDEX IF NOT EXISTS "Document_folderId_idx" ON "Document"("folderId");

-- Index for property documents
CREATE INDEX IF NOT EXISTS "Document_propertyId_idx" ON "Document"("propertyId");

-- Index for tenant documents
CREATE INDEX IF NOT EXISTS "Document_tenantId_idx" ON "Document"("tenantId");

-- Index for expiring documents
CREATE INDEX IF NOT EXISTS "Document_status_expiryDate_idx" ON "Document"("status", "expiryDate");

-- ============== TASK INDEXES ==============

-- Index for user's tasks by status
CREATE INDEX IF NOT EXISTS "Task_userId_status_idx" ON "Task"("userId", "status");

-- Index for assigned tasks
CREATE INDEX IF NOT EXISTS "Task_assignedTo_status_idx" ON "Task"("assignedTo", "status");

-- Index for upcoming tasks
CREATE INDEX IF NOT EXISTS "Task_status_dueDate_idx" ON "Task"("status", "dueDate");

-- ============== NOTIFICATION INDEXES ==============

-- Index for user notifications
CREATE INDEX IF NOT EXISTS "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");

-- Index for recent notifications
CREATE INDEX IF NOT EXISTS "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt" DESC);

-- ============== MESSAGE INDEXES ==============

-- Index for user messages by type
CREATE INDEX IF NOT EXISTS "Message_userId_messageType_idx" ON "Message"("userId", "messageType");

-- Index for message status
CREATE INDEX IF NOT EXISTS "Message_status_createdAt_idx" ON "Message"("status", "createdAt" DESC);

-- Index for booking messages
CREATE INDEX IF NOT EXISTS "Message_bookingId_idx" ON "Message"("bookingId");

-- ============== AUDIT LOG INDEXES ==============
-- Note: AuditLog already has indexes defined in schema (userId, createdAt) and (entity, entityId)

-- ============== TENANT INDEXES ==============

-- Index for user's tenants by status
CREATE INDEX IF NOT EXISTS "Tenant_userId_status_idx" ON "Tenant"("userId", "status");

-- Index for active tenants
CREATE INDEX IF NOT EXISTS "Tenant_status_idx" ON "Tenant"("status");

-- ============== PROPERTY TENANT INDEXES ==============

-- Index for property-tenant relationships
CREATE INDEX IF NOT EXISTS "PropertyTenant_propertyId_isActive_idx" ON "PropertyTenant"("propertyId", "isActive");

-- Index for tenant properties
CREATE INDEX IF NOT EXISTS "PropertyTenant_tenantId_isActive_idx" ON "PropertyTenant"("tenantId", "isActive");

-- Index for lease expiry
CREATE INDEX IF NOT EXISTS "PropertyTenant_leaseEndDate_isActive_idx" ON "PropertyTenant"("leaseEndDate", "isActive");
