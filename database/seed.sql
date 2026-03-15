-- Adelaide University Program Roadmap - Seed Data
-- Test account password: 11111111 (bcrypt hash below)
-- Hash generated with bcrypt, 10 salt rounds

USE au_roadmap;

-- Test Users (password: 11111111)
INSERT INTO users (email, password_hash, first_name, last_name, role, student_id) VALUES
('student@example.com', '$2b$10$8KzaNsXZQYLGPCj/CQVpDOvZr4bEqTR1yJwVd.EjGJkn2vkFpK3Sm', 'Alex', 'Chen', 'student', 'a1234567'),
('prospect@example.com', '$2b$10$8KzaNsXZQYLGPCj/CQVpDOvZr4bEqTR1yJwVd.EjGJkn2vkFpK3Sm', 'Emily', 'Wang', 'prospective', NULL),
('admin@example.com', '$2b$10$8KzaNsXZQYLGPCj/CQVpDOvZr4bEqTR1yJwVd.EjGJkn2vkFpK3Sm', 'Admin', 'User', 'admin', NULL);

-- Programs
INSERT INTO programs (code, name, level, duration_years, faculty, description, entry_requirements, atar_requirement, fees_domestic, fees_international) VALUES
('BCOMP', 'Bachelor of Computer Science', 'undergraduate', 3.0, 'Sciences, Engineering and Technology',
 'The Bachelor of Computer Science provides a comprehensive education in computing fundamentals, software development, algorithms, and modern technologies. Students gain hands-on experience through projects and industry placements.',
 'Completion of SACE or equivalent with a minimum ATAR. Prerequisites: Mathematical Methods.',
 80.0, 34500.00, 46000.00),

('BENG-SW', 'Bachelor of Engineering (Software)', 'undergraduate', 4.0, 'Sciences, Engineering and Technology',
 'The Bachelor of Engineering (Software) combines core engineering principles with software development expertise. This accredited program prepares graduates for professional engineering roles in the software industry.',
 'Completion of SACE or equivalent with a minimum ATAR. Prerequisites: Specialist Mathematics, Physics.',
 85.0, 37000.00, 48000.00),

('MIT', 'Master of Information Technology', 'postgraduate', 2.0, 'Sciences, Engineering and Technology',
 'The Master of Information Technology is designed for graduates looking to transition into IT or deepen their technical expertise. Covers advanced topics in software engineering, data science, and cybersecurity.',
 'Bachelor degree with minimum GPA 5.0/7.0 or equivalent.',
 NULL, 38000.00, 50000.00),

('BDS', 'Bachelor of Data Science', 'undergraduate', 3.0, 'Sciences, Engineering and Technology',
 'The Bachelor of Data Science equips students with skills in statistics, machine learning, data engineering, and visualization. Graduates are prepared for the growing demand in data-driven industries.',
 'Completion of SACE or equivalent. Prerequisites: Mathematical Methods.',
 78.0, 34500.00, 46000.00),

('BCYBER', 'Bachelor of Cybersecurity', 'undergraduate', 3.0, 'Sciences, Engineering and Technology',
 'The Bachelor of Cybersecurity prepares students to protect digital systems and networks. Covers network security, digital forensics, ethical hacking, and security governance.',
 'Completion of SACE or equivalent with a minimum ATAR.',
 75.0, 34500.00, 46000.00);

-- Update student user with program
UPDATE users SET program_id = 1 WHERE email = 'student@example.com';

-- Courses for Bachelor of Computer Science
INSERT INTO courses (code, name, units, level, semester_offered, description, is_elective) VALUES
-- Year 1
('COMP1101', 'Introduction to Programming', 3, '1000', 'S1', 'Fundamentals of programming using Python. Covers variables, control structures, functions, and basic data structures.', FALSE),
('COMP1102', 'Object-Oriented Programming', 3, '1000', 'S2', 'Principles of object-oriented design and programming using Java. Inheritance, polymorphism, and design patterns.', FALSE),
('MATH1101', 'Mathematics for Computer Science I', 3, '1000', 'S1', 'Discrete mathematics, logic, sets, relations, and proof techniques essential for computer science.', FALSE),
('MATH1102', 'Mathematics for Computer Science II', 3, '1000', 'S2', 'Linear algebra, calculus, and probability theory with applications in computing.', FALSE),
-- Year 2
('COMP2101', 'Data Structures and Algorithms', 3, '2000', 'S1', 'Advanced data structures including trees, graphs, and hash tables. Algorithm design and complexity analysis.', FALSE),
('COMP2102', 'Database Systems', 3, '2000', 'S1', 'Relational database design, SQL, normalisation, and database administration. Introduction to NoSQL databases.', FALSE),
('COMP2103', 'Computer Networks', 3, '2000', 'S2', 'Network protocols, architecture, and security. TCP/IP, routing, and network programming.', FALSE),
('COMP2104', 'Software Engineering', 3, '2000', 'S2', 'Software development methodologies, requirements engineering, testing, and project management.', FALSE),
-- Year 3
('COMP3101', 'Operating Systems', 3, '3000', 'S1', 'Process management, memory management, file systems, and concurrent programming.', FALSE),
('COMP3102', 'Artificial Intelligence', 3, '3000', 'S1', 'Search algorithms, knowledge representation, machine learning fundamentals, and neural networks.', TRUE),
('COMP3103', 'Web and Database Computing', 3, '3000', 'S2', 'Full-stack web development. Frontend frameworks, RESTful APIs, and modern web technologies.', FALSE),
('COMP3104', 'Computer Science Project', 6, '3000', 'S1,S2', 'Capstone project applying skills from the program to a substantial software development project.', FALSE);

-- Program-Course Mapping for BCOMP
INSERT INTO program_courses (program_id, course_id, year_level, semester, is_core, course_group, sort_order) VALUES
(1, 1, 1, 1, TRUE, 'Core', 1),   -- COMP1101 Y1S1
(1, 3, 1, 1, TRUE, 'Core', 2),   -- MATH1101 Y1S1
(1, 2, 1, 2, TRUE, 'Core', 1),   -- COMP1102 Y1S2
(1, 4, 1, 2, TRUE, 'Core', 2),   -- MATH1102 Y1S2
(1, 5, 2, 1, TRUE, 'Core', 1),   -- COMP2101 Y2S1
(1, 6, 2, 1, TRUE, 'Core', 2),   -- COMP2102 Y2S1
(1, 7, 2, 2, TRUE, 'Core', 1),   -- COMP2103 Y2S2
(1, 8, 2, 2, TRUE, 'Core', 2),   -- COMP2104 Y2S2
(1, 9, 3, 1, TRUE, 'Core', 1),   -- COMP3101 Y3S1
(1, 10, 3, 1, FALSE, 'Elective', 2), -- COMP3102 Y3S1
(1, 11, 3, 2, TRUE, 'Core', 1),  -- COMP3103 Y3S2
(1, 12, 3, 2, TRUE, 'Core', 2);  -- COMP3104 Y3S2

-- Prerequisites
INSERT INTO prerequisites (course_id, prerequisite_course_id, is_corequisite) VALUES
(2, 1, FALSE),   -- OOP requires Intro to Programming
(5, 2, FALSE),   -- Data Structures requires OOP
(5, 3, FALSE),   -- Data Structures requires Math I
(6, 1, FALSE),   -- Database Systems requires Intro to Programming
(7, 1, FALSE),   -- Computer Networks requires Intro to Programming
(8, 2, FALSE),   -- Software Engineering requires OOP
(9, 5, FALSE),   -- Operating Systems requires Data Structures
(10, 5, FALSE),  -- AI requires Data Structures
(11, 6, FALSE),  -- Web & DB requires Database Systems
(11, 2, FALSE),  -- Web & DB requires OOP
(12, 8, FALSE);  -- CS Project requires Software Engineering

-- Industry Partners
INSERT INTO industry_partners (name, industry_sector, description, website_url, partnership_type) VALUES
('Google Australia', 'Technology', 'Global technology company offering internships and graduate programs in software engineering, cloud computing, and AI.', 'https://careers.google.com', 'internship'),
('Atlassian', 'Technology', 'Australian software company known for Jira, Confluence, and Bitbucket. Offers graduate programs and internships.', 'https://www.atlassian.com/company/careers', 'employment'),
('Santos', 'Energy', 'Leading Australian energy company providing technology internships in data analytics and software development.', 'https://www.santos.com', 'internship'),
('Defence Science and Technology Group', 'Defence', 'Australian Government defence research organisation offering cybersecurity and software engineering placements.', 'https://www.dst.defence.gov.au', 'research'),
('PwC Australia', 'Consulting', 'Professional services firm offering technology consulting graduate programs and internships.', 'https://www.pwc.com.au', 'employment');

-- Program-Industry Mapping
INSERT INTO program_industry (program_id, industry_partner_id, opportunity_description) VALUES
(1, 1, 'Software engineering internships and graduate roles in Melbourne and Sydney offices.'),
(1, 2, 'Graduate developer program and summer internship opportunities.'),
(1, 3, 'Data analytics and software development internships at Adelaide headquarters.'),
(1, 4, 'Research placements in cybersecurity and AI for final-year students.'),
(1, 5, 'Technology consulting graduate program with Adelaide office placements.');

-- Alumni
INSERT INTO alumni (first_name, last_name, graduation_year, program_id, current_role, current_company, location, bio, success_story, is_featured) VALUES
('Sarah', 'Mitchell', 2022, 1, 'Software Engineer', 'Google', 'Sydney, NSW',
 'Graduated with First Class Honours and joined Google''s graduate program.',
 'During my time at Adelaide University, I focused on AI and machine learning. The strong foundation in algorithms and data structures prepared me well for technical interviews. I completed an internship at Google in my third year, which led to a full-time offer.',
 TRUE),
('James', 'Liu', 2023, 1, 'Full Stack Developer', 'Atlassian', 'Sydney, NSW',
 'Passionate about web technologies and collaborative software development.',
 'The Web and Database Computing course was a turning point for me. Building full-stack applications gave me the practical skills employers were looking for. I now work on Confluence at Atlassian.',
 TRUE),
('Priya', 'Sharma', 2021, 1, 'Data Engineer', 'Santos', 'Adelaide, SA',
 'Combining computer science with data engineering to drive innovation in the energy sector.',
 'Staying in Adelaide after graduation was important to me. Santos offered great opportunities to apply my database and programming skills to real-world energy data challenges.',
 FALSE);

-- Career Outcomes
INSERT INTO career_outcomes (program_id, year, employment_rate, median_salary, salary_range_low, salary_range_high, further_study_rate, satisfaction_rate, source) VALUES
(1, 2024, 92.50, 75000.00, 60000.00, 95000.00, 15.00, 88.50, 'Graduate Outcomes Survey 2024'),
(1, 2023, 90.00, 72000.00, 58000.00, 90000.00, 16.50, 87.00, 'Graduate Outcomes Survey 2023'),
(1, 2022, 88.00, 68000.00, 55000.00, 85000.00, 18.00, 85.00, 'Graduate Outcomes Survey 2022');

-- Career Paths
INSERT INTO career_paths (program_id, job_title, description, average_salary, demand_level, industry_sector, sort_order) VALUES
(1, 'Software Engineer', 'Design, develop, and maintain software applications and systems.', 85000.00, 'high', 'Technology', 1),
(1, 'Full Stack Developer', 'Build both frontend and backend components of web applications.', 80000.00, 'high', 'Technology', 2),
(1, 'Data Analyst', 'Analyse data to help organisations make informed business decisions.', 70000.00, 'high', 'Various', 3),
(1, 'DevOps Engineer', 'Manage deployment pipelines, infrastructure, and system reliability.', 90000.00, 'medium', 'Technology', 4),
(1, 'Cybersecurity Analyst', 'Protect computer systems and networks from security threats.', 85000.00, 'high', 'Technology/Government', 5);

-- Student Resources
INSERT INTO resources (title, description, url, category, icon, sort_order) VALUES
('Academic Skills Centre', 'Free academic support including writing help, study skills, and maths drop-in sessions.', 'https://www.adelaide.edu.au/writingcentre/', 'academic', 'edit_note', 1),
('Career Services', 'Career counselling, resume reviews, mock interviews, and job listings for students.', 'https://www.adelaide.edu.au/careers/', 'career', 'work', 2),
('Counselling Support', 'Free and confidential counselling services for all enrolled students.', 'https://www.adelaide.edu.au/counselling/', 'wellbeing', 'psychology', 3),
('Student Finance', 'Information about scholarships, bursaries, and financial support options.', 'https://www.adelaide.edu.au/scholarships/', 'financial', 'payments', 4),
('University Library', 'Access to digital resources, study spaces, and research databases.', 'https://www.adelaide.edu.au/library/', 'library', 'local_library', 5),
('IT Help Desk', 'Technical support for university IT systems, email, and software.', 'https://www.adelaide.edu.au/technology/', 'technology', 'computer', 6);

-- Key Dates
INSERT INTO key_dates (title, description, event_date, category) VALUES
('Semester 1 Applications Close', 'Last day to submit applications for Semester 1, 2026.', '2026-01-15', 'application'),
('Orientation Week', 'Welcome activities and program introductions for new students.', '2026-02-24', 'orientation'),
('Semester 1 Begins', 'First day of classes for Semester 1, 2026.', '2026-03-03', 'semester'),
('Mid-Semester Break', 'Two-week break between teaching periods.', '2026-04-14', 'semester'),
('Semester 1 Examinations', 'Final examination period for Semester 1.', '2026-06-16', 'examination'),
('Semester 2 Applications Close', 'Last day to submit applications for Semester 2, 2026.', '2026-06-30', 'application'),
('Semester 2 Begins', 'First day of classes for Semester 2, 2026.', '2026-07-21', 'semester'),
('Graduation Ceremony', 'Graduation ceremony for qualifying students.', '2026-12-15', 'graduation');

-- Campus Highlights
INSERT INTO campus_highlights (title, description, image_url, category, is_featured, sort_order) VALUES
('North Terrace Campus', 'Our historic main campus in the heart of Adelaide''s cultural precinct, home to world-class teaching and research facilities.', NULL, 'facilities', TRUE, 1),
('Innovation and Collaboration Centre', 'A modern hub for interdisciplinary research, industry partnerships, and student entrepreneurship.', NULL, 'facilities', TRUE, 2),
('Student Clubs and Societies', 'Over 100 student-run clubs and societies covering academic interests, sports, culture, and social activities.', NULL, 'clubs', FALSE, 3),
('Adelaide City Living', 'Adelaide is consistently ranked among the world''s most liveable cities, offering an affordable and vibrant lifestyle.', NULL, 'city', TRUE, 4);

-- Content Blocks for Home page
INSERT INTO content_blocks (page_key, section_key, title, subtitle, body_html, cta_text, cta_url, sort_order) VALUES
('home', 'hero', 'Find Your Path at Adelaide University', 'Explore programs, plan your studies, and discover career opportunities',
 '<p>Our interactive Program Roadmap helps you navigate your academic journey with confidence.</p>', 'Explore Programs', '/explore', 1),
('home', 'stats', 'By the Numbers', NULL,
 '<ul><li>92% graduate employment rate</li><li>$75,000 median starting salary</li><li>50+ industry partners</li><li>100+ student clubs</li></ul>', NULL, NULL, 2);
