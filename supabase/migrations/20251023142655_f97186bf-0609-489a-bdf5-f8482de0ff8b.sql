-- Clear all data from database tables
-- Disable triggers temporarily to avoid conflicts

-- Disable triggers on enquiries table
ALTER TABLE enquiries DISABLE TRIGGER enquiry_audit_trigger;
ALTER TABLE enquiries DISABLE TRIGGER update_enquiries_updated_at;

-- Disable triggers on other sensitive tables
ALTER TABLE contact_submissions DISABLE TRIGGER audit_contact_submissions;
ALTER TABLE blog_comments DISABLE TRIGGER audit_blog_comments;

-- Delete from tables with potential foreign key dependencies first
DELETE FROM tour_reviews;
DELETE FROM enquiry_logs;
DELETE FROM blog_comments;
DELETE FROM country_sections;
DELETE FROM country_attractions;
DELETE FROM country_hero_images;
DELETE FROM country_must_visit;
DELETE FROM country_essential_tips;
DELETE FROM country_content;
DELETE FROM country_cities;
DELETE FROM country_faqs;
DELETE FROM famous_places;
DELETE FROM essential_tips;
DELETE FROM travel_purposes;

-- Delete from main content tables
DELETE FROM packages;
DELETE FROM countries;
DELETE FROM blog_posts;
DELETE FROM authors;
DELETE FROM blog_categories;
DELETE FROM group_tours;
DELETE FROM group_tour_categories;
DELETE FROM seo_settings;
DELETE FROM content;
DELETE FROM contact_info;

-- Delete sensitive data tables
DELETE FROM enquiries;
DELETE FROM contact_submissions;

-- Delete audit logs
DELETE FROM admin_audit_log;

-- Re-enable triggers
ALTER TABLE enquiries ENABLE TRIGGER enquiry_audit_trigger;
ALTER TABLE enquiries ENABLE TRIGGER update_enquiries_updated_at;
ALTER TABLE contact_submissions ENABLE TRIGGER audit_contact_submissions;
ALTER TABLE blog_comments ENABLE TRIGGER audit_blog_comments;