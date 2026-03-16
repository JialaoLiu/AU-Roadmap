-- Adelaide University Program Roadmap Database Schema
-- Created: 2026-03-10

CREATE DATABASE IF NOT EXISTS au_roadmap;
USE au_roadmap;

-- 1. USERS
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM('student', 'prospective', 'admin') NOT NULL DEFAULT 'prospective',
    avatar_url VARCHAR(500),
    student_id VARCHAR(50),
    program_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- 2. PROGRAMS
CREATE TABLE programs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    level ENUM('undergraduate', 'postgraduate', 'research') NOT NULL,
    duration_years DECIMAL(3,1) NOT NULL,
    faculty VARCHAR(255) NOT NULL,
    description TEXT,
    overview_html TEXT,
    entry_requirements TEXT,
    atar_requirement DECIMAL(4,1),
    international_requirements TEXT,
    fees_domestic DECIMAL(10,2),
    fees_international DECIMAL(10,2),
    application_deadline DATE,
    is_active BOOLEAN DEFAULT TRUE,
    thumbnail_url VARCHAR(500),
    banner_url VARCHAR(500),
    seo_title VARCHAR(255),
    seo_description VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_level (level),
    INDEX idx_faculty (faculty)
);

-- 3. COURSES
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    units INT NOT NULL DEFAULT 3,
    level ENUM('1000', '2000', '3000', '4000', 'postgrad') NOT NULL,
    semester_offered SET('S1', 'S2', 'Summer') NOT NULL,
    description TEXT,
    learning_outcomes TEXT,
    assessment_summary TEXT,
    is_elective BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_level (level)
);

-- 4. PROGRAM-COURSE MAPPING
CREATE TABLE program_courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    program_id INT NOT NULL,
    course_id INT NOT NULL,
    year_level INT NOT NULL,
    semester INT NOT NULL,
    is_core BOOLEAN DEFAULT TRUE,
    course_group VARCHAR(100),
    sort_order INT DEFAULT 0,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY uniq_program_course (program_id, course_id),
    INDEX idx_program (program_id),
    INDEX idx_year_semester (program_id, year_level, semester)
);

-- 5. PREREQUISITES
CREATE TABLE prerequisites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    prerequisite_course_id INT NOT NULL,
    is_corequisite BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (prerequisite_course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY uniq_prereq (course_id, prerequisite_course_id)
);

-- 6. INDUSTRY PARTNERS
CREATE TABLE industry_partners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    industry_sector VARCHAR(255),
    description TEXT,
    logo_url VARCHAR(500),
    website_url VARCHAR(500),
    partnership_type ENUM('internship', 'research', 'sponsorship', 'employment', 'guest_lecture') NOT NULL,
    contact_email VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_sector (industry_sector)
);

-- 7. PROGRAM-INDUSTRY MAPPING
CREATE TABLE program_industry (
    id INT AUTO_INCREMENT PRIMARY KEY,
    program_id INT NOT NULL,
    industry_partner_id INT NOT NULL,
    opportunity_description TEXT,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
    FOREIGN KEY (industry_partner_id) REFERENCES industry_partners(id) ON DELETE CASCADE,
    UNIQUE KEY uniq_prog_industry (program_id, industry_partner_id)
);

-- 8. ALUMNI
CREATE TABLE alumni (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    graduation_year INT NOT NULL,
    program_id INT NOT NULL,
    current_role VARCHAR(255),
    current_company VARCHAR(255),
    location VARCHAR(255),
    bio TEXT,
    success_story TEXT,
    photo_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
    INDEX idx_program (program_id),
    INDEX idx_featured (is_featured)
);

-- 9. CAREER OUTCOMES
CREATE TABLE career_outcomes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    program_id INT NOT NULL,
    year INT NOT NULL,
    employment_rate DECIMAL(5,2),
    median_salary DECIMAL(10,2),
    salary_range_low DECIMAL(10,2),
    salary_range_high DECIMAL(10,2),
    further_study_rate DECIMAL(5,2),
    satisfaction_rate DECIMAL(5,2),
    source VARCHAR(255),
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
    UNIQUE KEY uniq_program_year (program_id, year),
    INDEX idx_program (program_id)
);

-- 10. CAREER PATHS
CREATE TABLE career_paths (
    id INT AUTO_INCREMENT PRIMARY KEY,
    program_id INT NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    description TEXT,
    average_salary DECIMAL(10,2),
    demand_level ENUM('high', 'medium', 'low') DEFAULT 'medium',
    industry_sector VARCHAR(255),
    sort_order INT DEFAULT 0,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
    INDEX idx_program (program_id)
);

-- 11. STUDENT RESOURCES
CREATE TABLE resources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    url VARCHAR(500) NOT NULL,
    category ENUM('academic', 'career', 'wellbeing', 'financial', 'technology', 'library') NOT NULL,
    icon VARCHAR(100),
    program_id INT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE SET NULL,
    INDEX idx_category (category)
);

-- 12. CONTENT BLOCKS (CMS)
CREATE TABLE content_blocks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_key VARCHAR(100) NOT NULL,
    section_key VARCHAR(100) NOT NULL,
    title VARCHAR(255),
    subtitle VARCHAR(255),
    body_html TEXT,
    image_url VARCHAR(500),
    cta_text VARCHAR(100),
    cta_url VARCHAR(500),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_page_section (page_key, section_key)
);

-- 13. KEY DATES
CREATE TABLE key_dates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    category ENUM('application', 'orientation', 'semester', 'examination', 'graduation') NOT NULL,
    program_id INT,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE SET NULL,
    INDEX idx_date (event_date),
    INDEX idx_category (category)
);

-- 14. CAMPUS HIGHLIGHTS
CREATE TABLE campus_highlights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    category ENUM('facilities', 'events', 'clubs', 'accommodation', 'city') NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 15. DISCUSSION THREADS
CREATE TABLE discussion_threads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    program_id INT NOT NULL,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    reply_count INT DEFAULT 0,
    is_pinned TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_program (program_id),
    INDEX idx_user (user_id)
);

-- 16. DISCUSSION REPLIES
CREATE TABLE discussion_replies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    thread_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (thread_id) REFERENCES discussion_threads(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_thread (thread_id)
);

-- Add FK for users.program_id after programs table exists
ALTER TABLE users ADD FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE SET NULL;
