-- Adelaide University Program Roadmap - Seed Data
-- Test account password: 11111111 (bcrypt hash below)
-- Hash generated with bcrypt, 10 salt rounds

USE au_roadmap;

-- Test Users (password: 11111111)
INSERT INTO users (email, password_hash, first_name, last_name, role, student_id) VALUES
('jialaoliu@adelaide.edu.au', '$2b$10$gRRlccf5BYvcfJj4U3JDbuyiLrDuMwakSNS8RG6yMoFb5/U0N2J3W', 'Jialao', 'Liu', 'student', 'a1234567'),
('prospect@example.com', '$2b$10$gRRlccf5BYvcfJj4U3JDbuyiLrDuMwakSNS8RG6yMoFb5/U0N2J3W', 'Emily', 'Wang', 'prospective', NULL),
('admin@example.com', '$2b$10$gRRlccf5BYvcfJj4U3JDbuyiLrDuMwakSNS8RG6yMoFb5/U0N2J3W', 'Admin', 'User', 'admin', NULL);

-- Programs
insert into programs (id, code, name, level, duration_years, faculty, description, overview_html, entry_requirements, atar_requirement, international_requirements, fees_domestic, fees_international, application_deadline, is_active, thumbnail_url, banner_url, seo_title, seo_description, created_at, updated_at)
values  (1, 'BCOMP', 'Bachelor of Computer Science', 'undergraduate', 3.0, 'Sciences, Engineering and Technology', 'The Bachelor of Computer Science provides a comprehensive education in computing fundamentals, software development, algorithms, and modern technologies. Students gain hands-on experience through projects and industry placements.', null, 'Completion of SACE or equivalent with a minimum ATAR. Prerequisites: Mathematical Methods.', 80.0, null, 34500.00, 46000.00, null, 1, null, null, null, null, '2026-04-01 08:54:24', '2026-04-11 11:28:39'),
    (2, 'BENG-SW', 'Bachelor of Engineering (Software)', 'undergraduate', 4.0, 'Sciences, Engineering and Technology', 'The Bachelor of Engineering (Software) combines core engineering principles with software development expertise. This accredited program prepares graduates for professional engineering roles in the software industry.', null, 'Completion of SACE or equivalent with a minimum ATAR. Prerequisites: Specialist Mathematics, Physics.', 85.0, null, 37000.00, 48000.00, null, 1, null, null, null, null, '2026-04-01 08:54:24', '2026-04-11 11:28:39'),
    (3, 'MIT', 'Master of Information Technology', 'undergraduate', 2.0, 'Sciences, Engineering and Technology', 'The Master of Information Technology is designed for graduates looking to transition into IT or deepen their technical expertise. Covers advanced topics in software engineering, data science, and cybersecurity.', null, 'Bachelor degree with minimum GPA 5.0/7.0 or equivalent.', 80.0, null, 38000.00, 50000.00, null, 1, null, null, null, null, '2026-04-01 08:54:24', '2026-04-11 11:34:20'),
    (4, 'BDS', 'Bachelor of Data Science', 'undergraduate', 3.0, 'Sciences, Engineering and Technology', 'The Bachelor of Data Science equips students with skills in statistics, machine learning, data engineering, and visualization. Graduates are prepared for the growing demand in data-driven industries.', null, 'Completion of SACE or equivalent. Prerequisites: Mathematical Methods.', 78.0, null, 34500.00, 46000.00, null, 1, null, null, null, null, '2026-04-01 08:54:24', '2026-04-11 11:28:39'),
    (5, 'BCYBER', 'Bachelor of Cybersecurity', 'undergraduate', 3.0, 'Sciences, Engineering and Technology', 'The Bachelor of Cybersecurity prepares students to protect digital systems and networks. Covers network security, digital forensics, ethical hacking, and security governance.', null, 'Completion of SACE or equivalent with a minimum ATAR.', 75.0, null, 34500.00, 46000.00, null, 1, null, null, null, null, '2026-04-01 08:54:24', '2026-04-11 11:28:39'),
    (6, 'XBACC', 'Bachelor of Accounting', 'undergraduate', 3.0, 'Accounting, Commerce & Economics', 'The Bachelor of Accounting develops knowledge in financial reporting, auditing, taxation, and business law. Students gain practical skills for careers in accounting and financial management.', null, 'Completion of SACE or equivalent with a minimum ATAR.', 75.0, null, 19950.00, 28500.00, null, 1, null, null, null, null, null, '2026-04-12 18:22:36'),
    (7, 'BAGSC', 'Bachelor of Agricultural Sciences', 'undergraduate', 3.0, 'Agriculture, Animal and Veterinary Science', 'The Bachelor of Agricultural Sciences focuses on sustainable agriculture, crop and livestock production, and agricultural technology. Students learn how to improve food production systems.', null, 'Completion of SACE or equivalent with a minimum ATAR.', 70.0, null, 38430.00, 54900.00, null, 1, null, null, null, null, null, '2026-04-11 11:28:39'),
    (8, 'BEXSP', 'Bachelor of Exercise and Sport Science', 'postgraduate', 3.0, 'Allied Health', 'The Bachelor of Exercise and Sport Science explores human movement, fitness, and performance. Students study anatomy, physiology, and exercise programming.', null, 'Completion of SACE or equivalent.', 70.0, null, 35350.00, 50500.00, null, 1, null, null, null, null, null, '2026-04-11 11:34:20'),
    (9, 'BARCH', 'Bachelor of Architectural Design', 'postgraduate', 3.0, 'Architecture & Design', 'The Bachelor of Architectural Design introduces architectural theory, design principles, and digital design technologies used in modern architecture.', null, 'Completion of SACE or equivalent.', 75.0, null, 35350.00, 50500.00, null, 1, null, null, null, null, null, '2026-04-11 11:31:51'),
    (10, 'BARTS', 'Bachelor of Arts', 'postgraduate', 3.0, 'Arts, Humanities & Social Sciences', 'The Bachelor of Arts offers a flexible program covering humanities and social sciences such as history, politics, languages, and sociology.', null, 'Completion of SACE or equivalent.', 65.0, null, 30380.00, 43400.00, null, 1, null, null, null, null, null, '2026-04-11 11:34:20'),
    (11, 'BAVIA', 'Bachelor of Aviation majoring in Management', 'postgraduate', 3.0, 'Aviation', 'The Bachelor of Aviation (Management) prepares students for careers in aviation operations, airport management, and airline administration.', null, 'Completion of SACE or equivalent with a minimum ATAR.', 72.0, null, 32690.00, 46700.00, null, 1, null, null, null, null, null, '2026-04-11 11:34:20'),
    (12, 'BBUSI', 'Bachelor of Business', 'postgraduate', 3.0, 'Business', 'The Bachelor of Business provides knowledge in management, marketing, finance, and entrepreneurship to prepare students for modern business environments.', null, 'Completion of SACE or equivalent.', 70.0, null, 35350.00, 50500.00, null, 1, null, null, null, null, '2026-04-08 11:30:55', '2026-04-11 11:31:51'),
    (13, 'HCOMP', 'Bachelor of Computer Science majoring in Artificial Intelligence and Machine Learning', 'postgraduate', 3.0, 'Computer Science & Information Technology', 'This program focuses on artificial intelligence, machine learning algorithms, and intelligent systems development. Students learn how to build AI-driven applications.', null, 'Completion of SACE or equivalent. Prerequisites: Mathematical Methods.', 85.0, null, 37310.00, 53300.00, null, 1, null, null, null, null, '2026-04-08 11:56:53', '2026-04-11 11:34:20'),
    (14, 'BARTS1', 'Bachelor of Arts majoring in Creative Writing', 'postgraduate', 3.0, 'Creative', 'The Creative Writing major helps students develop storytelling, fiction, poetry, and professional writing skills.', null, 'Completion of SACE or equivalent.', 65.0, null, 30380.00, 43400.00, null, 1, null, null, null, null, '2026-04-08 11:56:53', '2026-04-11 11:34:20'),
    (15, 'HENCH', 'Bachelor of Engineering', 'research', 3.0, 'Engineering', 'The Bachelor of Engineering provides strong foundations in engineering mathematics, physics, and design. Students can specialise in different engineering disciplines.', null, 'Completion of SACE or equivalent. Prerequisites: Specialist Mathematics, Physics.', 80.0, null, 38430.00, 54900.00, null, 1, null, null, null, null, '2026-04-08 11:56:53', '2026-04-11 11:34:20'),
    (16, 'BBIOM', 'Bachelor of Biomedical and Health Sciences', 'research', 3.0, 'Health & Biomedical Sciences', 'This program studies human biology, disease mechanisms, and healthcare systems. It prepares students for careers in health and medical research.', null, 'Completion of SACE or equivalent.', 75.0, null, 35350.00, 50500.00, null, 1, null, null, null, null, '2026-04-08 11:56:53', '2026-04-11 11:34:20'),
    (17, 'BCRIM', 'Bachelor of Criminology and Criminal Justice', 'research', 3.0, 'Law and Justice', 'The Bachelor of Criminology and Criminal Justice examines crime, justice systems, and law enforcement. Students explore crime prevention and social justice.', null, 'Completion of SACE or equivalent.', 70.0, null, 30380.00, 43400.00, null, 1, null, null, null, null, '2026-04-08 11:56:53', '2026-04-11 11:34:20'),
    (18, 'HCOMP1', 'Bachelor of Computer Science majoring in Human-Centred Computing', 'research', 4.0, 'Mathematics & Data Science', 'This program focuses on user experience design, human-computer interaction, and accessible technology development.', null, 'Completion of SACE or equivalent. Prerequisites: Mathematical Methods.', 80.0, null, 37310.00, 53300.00, null, 1, null, null, null, null, '2026-04-08 11:56:53', '2026-04-11 11:34:20'),
    (19, 'BDENT', 'Bachelor of Dental Surgery', 'research', 5.0, 'Medicine', 'The Bachelor of Dental Surgery trains students in oral health, dental procedures, and patient care.', null, 'Completion of SACE or equivalent with a high ATAR.', 95.0, null, 72870.00, 104100.00, null, 1, null, null, null, null, '2026-04-08 11:56:53', '2026-04-11 11:34:20'),
    (20, 'HMUSI', 'Bachelor of Music', 'research', 4.0, 'Music', 'The Bachelor of Music develops skills in performance, composition, and music theory. Students engage in creative practice and music production.', null, 'Completion of SACE or equivalent.', 65.0, null, 31920.00, 45600.00, null, 1, null, null, null, null, '2026-04-08 11:56:53', '2026-04-11 11:34:20'),
    (21, 'BMIDW', 'Bachelor of Midwifery', 'research', 3.0, 'Nursing and Midwifery', 'The Bachelor of Midwifery prepares students to provide pregnancy, childbirth, and postnatal care for mothers and babies.', null, 'Completion of SACE or equivalent.', 75.0, null, 32690.00, 46700.00, null, 1, null, null, null, null, '2026-04-08 11:56:53', '2026-04-11 11:32:21'),
    (22, 'BHUMN', 'Bachelor of Human Nutrition', 'online', 3.0, 'Nutrition & Food Science', 'The Bachelor of Human Nutrition studies diet, health, and food science to promote healthy lifestyles and disease prevention.', null, 'Completion of SACE or equivalent.', 72.0, null, 38430.00, 54900.00, null, 1, null, null, null, null, '2026-04-08 11:56:53', '2026-04-12 17:46:53'),
    (23, 'BCONM', 'Bachelor of Construction Management', 'online', 3.0, 'Property', 'The Bachelor of Construction Management focuses on project planning, construction technology, and building management.', null, 'Completion of SACE or equivalent.', 70.0, null, 35350.00, 50500.00, null, 1, null, null, null, null, '2026-04-08 11:56:53', '2026-04-12 17:46:53'),
    (24, 'BARTS2', 'Bachelor of Arts majoring in Sociology', 'online', 3.0, 'Psychology & Social Work', 'This program studies social structures, cultural change, inequality, and modern society.', null, 'Completion of SACE or equivalent.', 65.0, null, 30380.00, 43400.00, null, 1, null, null, null, null, '2026-04-08 11:56:53', '2026-04-11 11:59:34'),
    (25, 'BTECE', 'Bachelor of Teaching', 'online', 3.0, 'Teaching & Education', 'The Bachelor of Teaching prepares students for careers in primary or secondary education through pedagogy and teaching practice.', null, 'Completion of SACE or equivalent.', 75.0, null, 30380.00, 43400.00, null, 1, null, null, null, null, '2026-04-08 11:56:53', '2026-04-12 17:46:53'),
    (26, 'BBUSI1', 'Bachelor of Business majoring in Sport Management', 'online', 3.0, 'Tourism', 'The Sport Management major combines business knowledge with the management of sports organisations and events.', null, 'Completion of SACE or equivalent.', 70.0, null, 35350.00, 50500.00, null, 1, null, null, null, null, '2026-04-08 11:56:53', '2026-04-12 17:46:53');
-- Update student user with program
UPDATE users SET program_id = 3 WHERE email = 'jialaoliu@adelaide.edu.au';

-- Courses for Bachelor of Computer Science
insert into courses (id, code, name, units, level, semester_offered, description, learning_outcomes, assessment_summary, is_elective, is_active, created_at, updated_at)
values  (1, 'COMP1101', 'Introduction to Programming', 3, '1000', 'S1', 'Fundamentals of programming using Python. Covers variables, control structures, functions, and basic data structures.', null, null, 0, 1, '2026-04-01 08:54:24', '2026-04-01 08:54:24'),
        (2, 'COMP1102', 'Object-Oriented Programming', 3, '1000', 'S2', 'Principles of object-oriented design and programming using Java. Inheritance, polymorphism, and design patterns.', null, null, 0, 1, '2026-04-01 08:54:24', '2026-04-01 08:54:24'),
        (3, 'MATH1101', 'Mathematics for Computer Science I', 3, '1000', 'S1', 'Discrete mathematics, logic, sets, relations, and proof techniques essential for computer science.', null, null, 0, 1, '2026-04-01 08:54:24', '2026-04-01 08:54:24'),
        (4, 'MATH1102', 'Mathematics for Computer Science II', 3, '1000', 'S2', 'Linear algebra, calculus, and probability theory with applications in computing.', null, null, 0, 1, '2026-04-01 08:54:24', '2026-04-01 08:54:24'),
        (5, 'COMP2101', 'Data Structures and Algorithms', 3, '2000', 'S1', 'Advanced data structures including trees, graphs, and hash tables. Algorithm design and complexity analysis.', null, null, 0, 1, '2026-04-01 08:54:24', '2026-04-01 08:54:24'),
        (6, 'COMP2102', 'Database Systems', 3, '2000', 'S1', 'Relational database design, SQL, normalisation, and database administration. Introduction to NoSQL databases.', null, null, 0, 1, '2026-04-01 08:54:24', '2026-04-01 08:54:24'),
        (7, 'COMP2103', 'Computer Networks', 3, '2000', 'S2', 'Network protocols, architecture, and security. TCP/IP, routing, and network programming.', null, null, 0, 1, '2026-04-01 08:54:24', '2026-04-01 08:54:24'),
        (8, 'COMP2104', 'Software Engineering', 3, '2000', 'S2', 'Software development methodologies, requirements engineering, testing, and project management.', null, null, 0, 1, '2026-04-01 08:54:24', '2026-04-01 08:54:24'),
        (9, 'COMP3101', 'Operating Systems', 3, '3000', 'S1', 'Process management, memory management, file systems, and concurrent programming.', null, null, 0, 1, '2026-04-01 08:54:24', '2026-04-01 08:54:24'),
        (10, 'COMP3102', 'Artificial Intelligence', 3, '3000', 'S1', 'Search algorithms, knowledge representation, machine learning fundamentals, and neural networks.', null, null, 1, 1, '2026-04-01 08:54:24', '2026-04-01 08:54:24'),
        (11, 'COMP3103', 'Web and Database Computing', 3, '3000', 'S2', 'Full-stack web development. Frontend frameworks, RESTful APIs, and modern web technologies.', null, null, 0, 1, '2026-04-01 08:54:24', '2026-04-01 08:54:24'),
        (12, 'COMP3104', 'Computer Science Project', 6, '3000', 'S1,S2', 'Capstone project applying skills from the program to a substantial software development project.', null, null, 0, 1, '2026-04-01 08:54:24', '2026-04-01 08:54:24'),
        (13, 'ACCT 1006', 'UO Financial Accounting 1', 6, '1000', 'S1', 'Introduction to financial accounting principles, including recording transactions, preparing financial statements, and understanding basic accounting concepts.', null, null, 0, 1, '2026-04-08 13:10:57', '2026-04-08 14:11:26'),
        (14, 'ACCT 2003', 'UO Financial Accounting 2', 6, '2000', 'S2', 'Builds on accounting fundamentals to cover complex transactions, reporting standards, and financial analysis techniques.', null, null, 0, 1, '2026-04-08 13:10:57', '2026-04-08 14:11:26'),
        (15, 'AGRI 2006', 'Agricultural Biochemistry', 6, '2000', 'S2', 'Study of biochemical processes in plants and animals, including metabolism, enzyme activity, and molecular techniques.', null, null, 0, 1, '2026-04-08 13:10:57', '2026-04-08 14:11:26'),
        (16, 'AGRI 1002', 'Agricultural Systems', 6, '1000', 'S1', 'Examination of agricultural production systems, sustainability, and the interaction of crops, livestock, and environment.', null, null, 0, 1, '2026-04-08 13:10:57', '2026-04-08 14:11:26'),
        (17, 'EDUC 3050', 'Exercise Prescription and Delivery 1', 6, '2000', 'S1', 'Principles of exercise physiology, assessment, and designing individualized exercise programs for healthy populations.', null, null, 0, 1, '2026-04-08 13:10:57', '2026-04-08 14:11:26'),
        (18, 'EDUC 3051', 'Exercise Prescription and Delivery 2', 6, '3000', 'S2', 'Advanced exercise program design, delivery techniques, and monitoring for diverse populations.', null, null, 0, 1, '2026-04-08 13:10:57', '2026-04-08 14:11:26'),
        (19, 'CORE X001', 'An Ethically Rich Life', 6, '1000', 'S1', 'Exploration of ethical theories, moral reasoning, and their application to personal and professional decisions.', null, null, 0, 1, '2026-04-08 13:10:57', '2026-04-08 14:11:26'),
        (20, 'CORE X002', 'Fact or Fiction: Data for Everyone', 6, '1000', 'S2', 'Understanding data literacy, critical evaluation of information, and interpreting statistics in everyday contexts.', null, null, 0, 1, '2026-04-08 13:10:57', '2026-04-08 14:11:26'),
        (21, 'CORE X003', 'Igniting Change: Ideas to Action', 6, '1000', 'S1', 'Developing creative problem-solving skills and strategies to implement social or organizational change.', null, null, 0, 1, '2026-04-08 13:10:57', '2026-04-08 14:11:26'),
        (22, 'CORE X004', 'Proppa Ways, Future Practice', 6, '1000', 'S2', 'Introduction to Indigenous perspectives, social responsibility, and preparing for culturally aware professional practice.', null, null, 0, 1, '2026-04-08 13:10:57', '2026-04-08 14:11:26'),
        (23, 'AERO 1000', 'Introduction to Aviation', 6, '1000', 'S1', 'Overview of aviation history, industry structure, and core concepts in aerodynamics and flight operations.', null, null, 0, 1, '2026-04-08 13:15:13', '2026-04-08 14:11:26'),
        (24, 'AERO 1004', 'Introduction to Aviation Management', 6, '1000', 'S2', 'Principles of aviation business management, including operations, safety, and regulatory compliance.', null, null, 0, 1, '2026-04-08 13:15:13', '2026-04-08 14:11:26'),
        (25, 'ACCT 1000', 'Accounting for Decision Makers', 6, '1000', 'S1', 'Applying accounting information for business decision-making, budgeting, and performance analysis.', null, null, 0, 1, '2026-04-08 13:17:07', '2026-04-08 14:11:26'),
        (26, 'BUSI 1002', 'Management, Organisations and Leadership', 6, '1000', 'S2', 'Fundamentals of management theory, organizational behaviour, and leadership skills.', null, null, 0, 1, '2026-04-08 13:17:07', '2026-04-08 14:11:26'),
        (27, 'MATH 1000', 'Foundations in Mathematics', 6, '1000', 'S1', 'Core mathematical concepts including algebra, calculus, and statistics essential for computing studies.', null, null, 0, 1, '2026-04-08 14:11:26', '2026-04-08 14:11:26'),
        (28, 'COMP 2017', 'Data Structures and Algorithms', 6, '1000', 'S2', 'Introduction to efficient data storage, retrieval, and algorithmic problem-solving in computer science.', null, null, 0, 1, '2026-04-08 14:11:26', '2026-04-08 14:11:26'),
        (29, 'WRIT 1000', 'Creative Writing Essentials 1: Prose, Poetry, Performance', 6, '1000', 'S1', 'Development of foundational writing skills across prose, poetry, and performance contexts.', null, null, 0, 1, '2026-04-08 14:11:26', '2026-04-08 14:11:26'),
        (30, 'WRIT 1001', 'Writing Life: From Concept to Practice', 6, '1000', 'S2', 'Focus on practical writing processes, drafting, editing, and developing a personal creative style.', null, null, 0, 1, '2026-04-08 14:11:26', '2026-04-08 14:11:26'),
        (31, 'ENGC1004', 'Engineering Mechanics – Statics', 6, '1000', 'S1', 'Analysis of forces, equilibrium, and structural behaviour in engineering systems.', null, null, 0, 1, '2026-04-08 14:11:26', '2026-04-08 14:11:26'),
        (32, 'ENGI1005', 'Professional Engineering Practice', 6, '1000', 'S2', 'Introduction to engineering ethics, project management, and professional skills.', null, null, 0, 1, '2026-04-08 14:11:26', '2026-04-08 14:11:26'),
        (33, 'HBIO1002', 'Human Anatomy and Physiology A', 6, '1000', 'S1', 'Study of human body systems, structure, and basic physiological functions.', null, null, 0, 1, '2026-04-08 14:11:26', '2026-04-08 14:11:26'),
        (34, 'PUBH1001', 'Principles of Public Health', 6, '1000', 'S2', 'Overview of public health principles, disease prevention, and population health strategies.', null, null, 0, 1, '2026-04-08 14:11:26', '2026-04-08 14:11:26'),
        (35, 'CRMJ1001', 'Introduction to Criminology', 6, '1000', 'S1', 'Exploration of crime, criminal behaviour, and societal responses to criminal activity.', null, null, 0, 1, '2026-04-08 14:11:26', '2026-04-08 14:11:26'),
        (36, 'CRMJ2001', 'Crime, Law and Social Context', 6, '2000', 'S2', 'Examination of the legal system, criminal justice policies, and the social dimensions of crime.', null, null, 0, 1, '2026-04-08 14:11:26', '2026-04-08 14:11:26'),
        (37, 'COMP 1010', 'Introduction to Computing & Human-Computer Interaction', 6, '1000', 'S1', 'Fundamentals of computing with emphasis on human-centred design and interaction principles.', null, null, 0, 1, '2026-04-08 14:11:26', '2026-04-08 14:11:26'),
        (38, 'COMP 2015', 'User-Centred Systems Design', 6, '2000', 'S2', 'Designing software systems with a focus on usability, accessibility, and user experience.', null, null, 0, 1, '2026-04-08 14:11:26', '2026-04-08 14:11:26'),
        (39, 'DENT1001', 'Foundations of Oral Health', 6, '1000', 'S1', 'Introduction to dental anatomy, oral hygiene, and preventive dentistry.', null, null, 0, 1, '2026-04-08 14:11:26', '2026-04-08 14:11:26'),
        (40, 'DENT2002', 'Clinical Dental Practice 1', 6, '2000', 'S2', 'Hands-on clinical skills for dental assessment, patient care, and treatment planning.', null, null, 0, 1, '2026-04-08 14:11:26', '2026-04-08 14:11:26'),
        (41, 'MUSC1001', 'Music Theory and Aural Skills 1', 6, '1000', 'S1', 'Basics of music theory, sight-reading, ear training, and composition fundamentals.', null, null, 0, 1, '2026-04-08 14:11:26', '2026-04-08 14:11:26'),
        (42, 'MUSC1002', 'Ensemble Performance 1', 6, '1000', 'S2', 'Practical ensemble performance, collaboration, and musicianship development.', null, null, 0, 1, '2026-04-08 14:11:26', '2026-04-08 14:11:26'),
        (43, 'MIDW1001', 'Foundations of Midwifery Practice', 6, '1000', 'S1', 'Introduction to midwifery principles, maternal care, and health promotion.', null, null, 0, 1, '2026-04-08 14:11:26', '2026-04-08 14:11:26'),
        (44, 'MIDW2001', 'Maternal and Infant Health', 6, '2000', 'S2', 'Study of maternal and neonatal health, care strategies, and clinical best practices.', null, null, 0, 1, '2026-04-08 14:11:26', '2026-04-08 14:11:26'),
        (45, 'HNUT1001', 'Introduction to Human Nutrition', 6, '1000', 'S1', 'Core concepts of human nutrition, dietary requirements, and nutritional assessment.', null, null, 0, 1, '2026-04-08 14:11:26', '2026-04-08 14:11:26'),
        (46, 'HNUT2001', 'Nutritional Biochemistry', 6, '2000', 'S2', 'Biochemical basis of nutrition, metabolism, and nutrient function in the human body.', null, null, 0, 1, '2026-04-08 14:11:26', '2026-04-08 14:11:26'),
        (47, 'BLDG1004', 'Construction Communication & Digital Construction Fundamentals', 6, '1000', 'S1', 'Fundamentals of communication in construction projects and introduction to digital tools.', null, null, 0, 1, '2026-04-08 14:11:26', '2026-04-08 14:11:26'),
        (48, 'BLDG1015', 'Construction Financial Management', 6, '2000', 'S2', 'Principles of budgeting, cost control, and financial management in construction projects.', null, null, 0, 1, '2026-04-08 14:11:26', '2026-04-08 14:11:26'),
        (49, 'SOCI1001', 'Introduction to Sociology', 6, '1000', 'S1', 'Study of social structures, institutions, and patterns of human behaviour.', null, null, 0, 1, '2026-04-08 14:11:26', '2026-04-08 14:11:26'),
        (50, 'SOCI2007', 'Social Theory and Contemporary Issues', 6, '2000', 'S2', 'Examination of classical and modern social theories applied to contemporary social issues.', null, null, 0, 1, '2026-04-08 14:11:26', '2026-04-08 14:11:26'),
        (51, 'BBHS1001', 'Biological Foundations for Health Sciences', 6, '1000', 'S1', 'Introduction to cell biology, genetics, and physiological processes relevant to health sciences.', null, null, 0, 1, '2026-04-08 14:11:26', '2026-04-08 14:11:26'),
        (52, 'BBHS2001', 'Health and Disease Concepts', 6, '2000', 'S2', 'Exploration of disease mechanisms, epidemiology, and health promotion strategies.', null, null, 0, 1, '2026-04-08 14:11:26', '2026-04-08 14:11:26'),
        (53, 'EDUC1000', 'Foundations of Education', 6, '1000', 'S1', 'Overview of educational theory, teaching practices, and learning environments.', null, null, 0, 1, '2026-04-08 14:11:26', '2026-04-08 14:11:26'),
        (54, 'EDUC2001', 'Curriculum Design and Assessment', 6, '2000', 'S2', 'Principles of curriculum development, instructional planning, and student assessment methods.', null, null, 0, 1, '2026-04-08 14:11:26', '2026-04-08 14:11:26'),
        (55, 'BUSM1001', 'Introduction to Sport Management', 6, '1000', 'S1', 'Core concepts in sport management, governance, and organizational structures.', null, null, 0, 1, '2026-04-08 14:11:26', '2026-04-08 14:11:26'),
        (56, 'BUSM2001', 'Sport Marketing & Events', 6, '2000', 'S2', 'Study of marketing principles, event planning, and promotion in sports contexts.', null, null, 0, 1, '2026-04-08 14:11:26', '2026-04-08 14:11:26');

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

-- Alumni Users (password: 11111111) - alumni are now real users
INSERT INTO users (email, password_hash, first_name, last_name, role, avatar_url) VALUES
('rhaneela.punitham@alumni.adelaide.edu.au', '$2b$10$gRRlccf5BYvcfJj4U3JDbuyiLrDuMwakSNS8RG6yMoFb5/U0N2J3W', 'Rhaneela', 'Punitham', 'alumni', '/alumni/rhaneela-punitham.jpeg'),
('menno.vanderzee@alumni.adelaide.edu.au', '$2b$10$gRRlccf5BYvcfJj4U3JDbuyiLrDuMwakSNS8RG6yMoFb5/U0N2J3W', 'Menno', 'Van Der Zee', 'alumni', NULL),
('helena.wu@alumni.adelaide.edu.au', '$2b$10$gRRlccf5BYvcfJj4U3JDbuyiLrDuMwakSNS8RG6yMoFb5/U0N2J3W', 'Helena', 'Wu', 'alumni', NULL),
('josh.carmichael@alumni.adelaide.edu.au', '$2b$10$gRRlccf5BYvcfJj4U3JDbuyiLrDuMwakSNS8RG6yMoFb5/U0N2J3W', 'Josh', 'Carmichael', 'alumni', NULL),
('jindou.lee@alumni.adelaide.edu.au', '$2b$10$gRRlccf5BYvcfJj4U3JDbuyiLrDuMwakSNS8RG6yMoFb5/U0N2J3W', 'Jindou', 'Lee', 'alumni', NULL),
('andrew.bullock@alumni.adelaide.edu.au', '$2b$10$gRRlccf5BYvcfJj4U3JDbuyiLrDuMwakSNS8RG6yMoFb5/U0N2J3W', 'Andrew', 'Bullock', 'alumni', NULL),
('walter.marsh@alumni.adelaide.edu.au', '$2b$10$gRRlccf5BYvcfJj4U3JDbuyiLrDuMwakSNS8RG6yMoFb5/U0N2J3W', 'Walter', 'Marsh', 'alumni', '/alumni/walter-marsh.jpeg'),
('lasni.kumarasinghe@alumni.adelaide.edu.au', '$2b$10$gRRlccf5BYvcfJj4U3JDbuyiLrDuMwakSNS8RG6yMoFb5/U0N2J3W', 'Lasni', 'Kumarasinghe', 'alumni', '/alumni/lasni-kumarasinghe.jpeg'),
('dave.fletcher@alumni.adelaide.edu.au', '$2b$10$gRRlccf5BYvcfJj4U3JDbuyiLrDuMwakSNS8RG6yMoFb5/U0N2J3W', 'Dave', 'Fletcher', 'alumni', '/alumni/dave-fletcher.jpg');

-- Alumni Profiles (user IDs depend on insert order; in a fresh DB with 3 test users, alumni start at ID 4)
INSERT INTO alumni_profiles (user_id, graduation_year, program_id, current_role, current_company, location, bio, success_story, linkedin_url, is_featured) VALUES
(4, 2016, 3, 'Manager, Technology Advisory', 'KPMG', 'Adelaide, SA',
 'Graduate of University of Adelaide with a double degree in Health Sciences and Mathematical & Computer Sciences.',
 'My time at the University of Adelaide gave me a strong analytical foundation. I started as a Technology Risk and Cyber Security consultant at KPMG and have since advanced to Manager in Technology Advisory.',
 'https://www.linkedin.com/in/rhaneela-punitham/',
 TRUE),
(5, 2020, 1, 'Software Developer', 'ADVAM', 'Adelaide, SA',
 'Bachelor of Computer Science graduate from the University of Adelaide with a passion for building scalable software solutions.',
 'Studying Computer Science at Adelaide gave me hands-on experience with real projects. I joined ADVAM as a graduate developer and have been working on payment technology solutions.',
 NULL, TRUE),
(6, 2010, 3, 'Team Leader, New Development', 'Santos Ltd', 'Adelaide, SA',
 'University of South Australia graduate who has built a career in energy sector technology.',
 'After graduating from UniSA, I joined Santos and have grown into a leadership role in new development projects.',
 NULL, TRUE),
(7, 2015, 1, 'Renewable Energy & Grid Specialist', 'Transdev', 'Adelaide, SA',
 'University of South Australia graduate with a Bachelor of Science and Bachelor of International Business.',
 'My double degree from UniSA gave me both the technical knowledge and business perspective needed for the renewable energy sector.',
 NULL, FALSE),
(8, 2012, 1, 'CEO and Co-Founder', 'HappyCo', 'Adelaide, SA',
 'University of South Australia Creative graduate who co-founded a successful property technology company.',
 'The entrepreneurial spirit I developed at UniSA led me to co-found HappyCo, a property technology platform.',
 NULL, FALSE),
(9, 2005, 1, 'Chief Executive Officer', '1834 Hotels', 'Adelaide, SA',
 'University of South Australia Business graduate. Also serves as Chair of the South Australian Tourism Commission.',
 'My degree from UniSA in Tourism and Hospitality set the course for my entire career.',
 NULL, FALSE),
(10, 2023, 1, 'Historian and Writer', 'Independent', 'Adelaide, SA',
 'University of Adelaide graduate and acclaimed historian.',
 'My studies at Adelaide gave me the analytical and research skills to pursue a career in historical writing.',
 NULL, FALSE),
(11, 2020, 3, 'Specialist Orthodontist', 'Private Practice', 'Adelaide, SA',
 'University of Adelaide graduate with advanced qualifications in orthodontics.',
 'The rigorous academic environment at Adelaide prepared me for specialist practice.',
 NULL, FALSE),
(12, 2018, 1, 'Winemaker', 'Penfolds', 'Barossa Valley, SA',
 'University of Adelaide oenology graduate with a passion for premium wine production.',
 'My degree in oenology from Adelaide gave me the scientific foundation for a career in winemaking.',
 NULL, FALSE);

-- Courses for Master of Information Technology
INSERT INTO courses (code, name, units, level, semester_offered, description, is_elective) VALUES
-- Year 1 S1
('COMP SCI7207', 'Web and Database Computing', 3, 'postgrad', 'S1', 'Full-stack web development, relational databases, SQL, RESTful APIs, and modern web frameworks.', FALSE),
('COMP SCI7210', 'Foundations of Computer Science A', 3, 'postgrad', 'S1', 'Core theoretical foundations of computer science including logic, sets, algorithms, and computational thinking.', FALSE),
('COMP SCI7211', 'Foundations of Computer Science B', 3, 'postgrad', 'S1', 'Advanced theoretical concepts in computer science including complexity, formal languages, and abstract computation.', FALSE),
('PROJMGNT5021', 'Project Management Fundamentals', 3, 'postgrad', 'S1', 'Introduction to project management methodologies, planning, scheduling, risk management, and team coordination.', FALSE),
-- Year 1 S2
('COMP SCI7064', 'Operating Systems', 3, 'postgrad', 'S2', 'Process management, memory management, file systems, scheduling, and concurrent programming.', FALSE),
('COMP SCI7081', 'Computer Systems', 3, 'postgrad', 'S2', 'Computer architecture, hardware-software interfaces, low-level programming, and system-level design.', FALSE),
('COMP SCI7201', 'Algorithm & Data Structure Analysis', 3, 'postgrad', 'S2', 'Advanced algorithm design and analysis, complexity theory, sorting, searching, graphs, and dynamic programming.', FALSE),
('COMP SCI7212', 'Human and Ethical Factors in Computer Science', 3, 'postgrad', 'S2', 'Ethics in computing, human-computer interaction, accessibility, privacy, and societal impact of technology.', FALSE),
('COMP SCI7307', 'Secure Programming', 3, 'postgrad', 'S2', 'Secure coding practices, common vulnerabilities (OWASP), input validation, authentication, and secure software design.', FALSE),
-- Year 2 S1
('COMP5800', 'Industry Research Project', 3, 'postgrad', 'S1', 'Collaborative industry research project addressing real-world challenges. Students work with industry partners to deliver practical solutions.', FALSE),
('INFO6003', 'Security Architecture and Engineering', 3, 'postgrad', 'S1', 'Security architecture frameworks, threat modelling, enterprise security design, and engineering secure systems.', FALSE),
('COMP6025', 'Stakeholders Engagement', 3, 'postgrad', 'S1', 'Strategies for effective stakeholder identification, communication, and management throughout the software project lifecycle.', FALSE),
-- Year 2 S2
('COMP5203', 'IT Research Methods', 3, 'postgrad', 'S2', 'Research methodologies for IT, literature review techniques, experimental design, and academic writing.', TRUE),
('COMP5204', 'IT Masters Project', 6, 'postgrad', 'S1,S2', 'Capstone project applying advanced IT skills to a real-world problem in collaboration with industry partners.', FALSE);

-- Program-Course Mapping for MIT
-- Note: MIT courses are inserted after the initial seeded course set, so their IDs are 57-70 in the current seed order.
INSERT INTO program_courses (program_id, course_id, year_level, semester, is_core, course_group, sort_order) VALUES
-- Y1S1
(3, 57, 1, 1, TRUE, 'Core', 1),   -- COMP SCI7207
(3, 58, 1, 1, TRUE, 'Core', 2),   -- COMP SCI7210
(3, 59, 1, 1, TRUE, 'Core', 3),   -- COMP SCI7211
(3, 60, 1, 1, TRUE, 'Core', 4),   -- PROJMGNT5021
-- Y1S2
(3, 61, 1, 2, TRUE, 'Core', 1),   -- COMP SCI7064
(3, 62, 1, 2, TRUE, 'Core', 2),   -- COMP SCI7081
(3, 63, 1, 2, TRUE, 'Core', 3),   -- COMP SCI7201
(3, 64, 1, 2, TRUE, 'Core', 4),   -- COMP SCI7212
(3, 65, 1, 2, TRUE, 'Core', 5),   -- COMP SCI7307
-- Y2S1
(3, 66, 2, 1, TRUE, 'Core', 1),   -- COMP5800
(3, 67, 2, 1, TRUE, 'Core', 2),   -- INFO6003
(3, 68, 2, 1, TRUE, 'Core', 3),   -- COMP6025
-- Y2S2
(3, 69, 2, 2, FALSE, 'Elective', 1), -- COMP5203
(3, 70, 2, 2, TRUE, 'Core', 2);   -- COMP5204

-- Program-Industry Mapping for MIT
INSERT INTO program_industry (program_id, industry_partner_id, opportunity_description) VALUES
(3, 1, 'Cloud engineering and AI research graduate positions for postgraduate students.'),
(3, 2, 'Senior developer and technical lead graduate pathways for Masters graduates.'),
(3, 3, 'Data engineering and IT infrastructure roles at Adelaide headquarters.'),
(3, 4, 'Cybersecurity research and analysis placements for postgraduate students.'),
(3, 5, 'Technology consulting and digital transformation roles for MIT graduates.');

-- Discussion Threads for MIT
INSERT INTO discussion_threads (program_id, user_id, title, content, category, reply_count, is_pinned) VALUES
(3, 1, 'Best cloud certifications to complement MIT degree?', 'I''m currently in my first year of the MIT program. Has anyone combined their studies with AWS or Azure certifications? Would love to hear what worked for you.', 'career', 0, 0),
(NULL, 3, 'Welcome to the Community!', 'This is a space for all Adelaide University students and alumni to connect, share advice, and discuss career paths. Feel free to start a conversation!', 'general', 0, 1);

-- Career Paths for MIT
INSERT INTO career_paths (program_id, job_title, description, average_salary, demand_level, industry_sector, sort_order) VALUES
(3, 'Solutions Architect', 'Design and oversee the implementation of IT solutions aligned with business requirements.', 120000.00, 'high', 'Technology', 1),
(3, 'Data Engineer', 'Build and maintain data pipelines, warehouses, and analytics infrastructure.', 105000.00, 'high', 'Technology', 2),
(3, 'Cloud Engineer', 'Design, deploy, and manage cloud-based infrastructure and services.', 110000.00, 'high', 'Technology', 3),
(3, 'IT Project Manager', 'Lead technology projects from planning through delivery, managing teams and stakeholders.', 100000.00, 'medium', 'Various', 4),
(3, 'Cybersecurity Consultant', 'Assess and improve organisational security posture, conduct audits and penetration testing.', 105000.00, 'high', 'Technology/Consulting', 5);

-- Career Outcomes
insert into career_outcomes (id, program_id, year, employment_rate, median_salary, salary_range_low, salary_range_high, further_study_rate, satisfaction_rate, source)
values  (15, 1, 2023, 72.00, 78000.00, 60000.00, 100000.00, 18.00, 82.00, 'Graduate Outcomes Survey Australia 2023'),
        (16, 1, 2024, 75.00, 82000.00, 62000.00, 105000.00, 17.00, 84.00, 'Graduate Outcomes Survey Australia 2024'),
        (17, 1, 2025, 78.00, 86000.00, 65000.00, 110000.00, 15.00, 85.00, 'Graduate Outcomes Projection 2025'),
        (18, 2, 2023, 74.00, 80000.00, 65000.00, 110000.00, 16.00, 83.00, 'GOS Australia 2023'),
        (19, 2, 2024, 77.00, 85000.00, 68000.00, 115000.00, 15.00, 85.00, 'GOS Australia 2024'),
        (20, 2, 2025, 80.00, 90000.00, 70000.00, 120000.00, 14.00, 86.00, 'Projection 2025'),
        (21, 3, 2023, 76.00, 90000.00, 70000.00, 120000.00, 20.00, 84.00, 'GOS Australia 2023'),
        (22, 3, 2024, 79.00, 95000.00, 75000.00, 125000.00, 18.00, 86.00, 'GOS Australia 2024'),
        (23, 3, 2025, 82.00, 100000.00, 80000.00, 130000.00, 16.00, 87.00, 'Projection 2025'),
        (24, 4, 2023, 73.00, 82000.00, 65000.00, 110000.00, 19.00, 83.00, 'GOS Australia 2023'),
        (25, 4, 2024, 76.00, 86000.00, 68000.00, 115000.00, 18.00, 85.00, 'GOS Australia 2024'),
        (26, 4, 2025, 79.00, 90000.00, 70000.00, 120000.00, 16.00, 86.00, 'Projection 2025'),
        (27, 5, 2023, 75.00, 85000.00, 68000.00, 115000.00, 17.00, 84.00, 'GOS Australia 2023'),
        (28, 5, 2024, 78.00, 90000.00, 70000.00, 120000.00, 16.00, 86.00, 'GOS Australia 2024'),
        (29, 5, 2025, 82.00, 95000.00, 75000.00, 130000.00, 15.00, 88.00, 'Projection 2025'),
        (30, 6, 2023, 70.00, 68000.00, 55000.00, 90000.00, 22.00, 80.00, 'GOS Australia 2023'),
        (31, 6, 2024, 73.00, 72000.00, 58000.00, 95000.00, 20.00, 82.00, 'GOS Australia 2024'),
        (32, 6, 2025, 75.00, 76000.00, 60000.00, 100000.00, 18.00, 83.00, 'Projection 2025'),
        (33, 7, 2023, 68.00, 65000.00, 50000.00, 85000.00, 25.00, 78.00, 'GOS Australia 2023'),
        (34, 7, 2024, 70.00, 68000.00, 52000.00, 88000.00, 23.00, 80.00, 'GOS Australia 2024'),
        (35, 7, 2025, 72.00, 70000.00, 55000.00, 90000.00, 22.00, 81.00, 'Projection 2025'),
        (36, 8, 2023, 66.00, 62000.00, 48000.00, 80000.00, 27.00, 79.00, 'GOS Australia 2023'),
        (37, 8, 2024, 68.00, 65000.00, 50000.00, 85000.00, 25.00, 81.00, 'GOS Australia 2024'),
        (38, 8, 2025, 70.00, 68000.00, 52000.00, 88000.00, 24.00, 82.00, 'Projection 2025'),
        (39, 9, 2023, 71.00, 75000.00, 60000.00, 100000.00, 18.00, 83.00, 'GOS Australia 2023'),
        (40, 9, 2024, 74.00, 78000.00, 62000.00, 105000.00, 17.00, 85.00, 'GOS Australia 2024'),
        (41, 9, 2025, 76.00, 82000.00, 65000.00, 110000.00, 15.00, 86.00, 'Projection 2025'),
        (42, 10, 2023, 60.00, 58000.00, 45000.00, 75000.00, 35.00, 75.00, 'GOS Australia 2023'),
        (43, 10, 2024, 62.00, 60000.00, 47000.00, 78000.00, 33.00, 77.00, 'GOS Australia 2024'),
        (44, 10, 2025, 65.00, 63000.00, 50000.00, 80000.00, 30.00, 78.00, 'Projection 2025'),
        (45, 11, 2023, 72.00, 78000.00, 60000.00, 100000.00, 20.00, 82.00, 'GOS Australia 2023'),
        (46, 11, 2024, 74.00, 82000.00, 62000.00, 105000.00, 18.00, 84.00, 'GOS Australia 2024'),
        (47, 11, 2025, 77.00, 86000.00, 65000.00, 110000.00, 17.00, 85.00, 'Projection 2025'),
        (48, 12, 2023, 68.00, 65000.00, 50000.00, 85000.00, 25.00, 80.00, 'GOS Australia 2023'),
        (49, 12, 2024, 70.00, 68000.00, 52000.00, 90000.00, 23.00, 82.00, 'GOS Australia 2024'),
        (50, 12, 2025, 73.00, 72000.00, 55000.00, 95000.00, 22.00, 83.00, 'Projection 2025'),
        (51, 13, 2023, 78.00, 95000.00, 75000.00, 130000.00, 15.00, 86.00, 'GOS Australia 2023'),
        (52, 13, 2024, 82.00, 100000.00, 80000.00, 135000.00, 14.00, 88.00, 'GOS Australia 2024'),
        (53, 13, 2025, 85.00, 110000.00, 85000.00, 145000.00, 12.00, 90.00, 'Projection 2025'),
        (54, 14, 2023, 58.00, 55000.00, 42000.00, 70000.00, 40.00, 74.00, 'GOS Australia 2023'),
        (55, 14, 2024, 60.00, 58000.00, 45000.00, 75000.00, 38.00, 76.00, 'GOS Australia 2024'),
        (56, 14, 2025, 63.00, 60000.00, 47000.00, 78000.00, 35.00, 78.00, 'Projection 2025'),
        (57, 15, 2023, 75.00, 80000.00, 65000.00, 110000.00, 18.00, 84.00, 'GOS Australia 2023'),
        (58, 15, 2024, 78.00, 85000.00, 68000.00, 115000.00, 17.00, 86.00, 'GOS Australia 2024'),
        (59, 15, 2025, 81.00, 90000.00, 70000.00, 120000.00, 15.00, 87.00, 'Projection 2025'),
        (60, 16, 2023, 73.00, 70000.00, 55000.00, 90000.00, 20.00, 82.00, 'GOS Australia 2023'),
        (61, 16, 2024, 75.00, 73000.00, 58000.00, 95000.00, 18.00, 84.00, 'GOS Australia 2024'),
        (62, 16, 2025, 78.00, 76000.00, 60000.00, 100000.00, 17.00, 85.00, 'Projection 2025'),
        (63, 17, 2023, 67.00, 62000.00, 48000.00, 80000.00, 28.00, 79.00, 'GOS Australia 2023'),
        (64, 17, 2024, 69.00, 65000.00, 50000.00, 85000.00, 26.00, 81.00, 'GOS Australia 2024'),
        (65, 17, 2025, 72.00, 68000.00, 52000.00, 88000.00, 25.00, 82.00, 'Projection 2025'),
        (66, 18, 2023, 74.00, 85000.00, 68000.00, 115000.00, 18.00, 84.00, 'GOS Australia 2023'),
        (67, 18, 2024, 77.00, 90000.00, 70000.00, 120000.00, 17.00, 86.00, 'GOS Australia 2024'),
        (68, 18, 2025, 80.00, 95000.00, 75000.00, 125000.00, 15.00, 87.00, 'Projection 2025'),
        (69, 19, 2023, 92.00, 110000.00, 90000.00, 140000.00, 5.00, 90.00, 'GOS Australia 2023'),
        (70, 19, 2024, 94.00, 115000.00, 95000.00, 150000.00, 4.00, 92.00, 'GOS Australia 2024'),
        (71, 19, 2025, 96.00, 120000.00, 100000.00, 160000.00, 3.00, 93.00, 'Projection 2025'),
        (72, 20, 2023, 55.00, 52000.00, 40000.00, 70000.00, 38.00, 76.00, 'GOS Australia 2023'),
        (73, 20, 2024, 58.00, 55000.00, 42000.00, 75000.00, 35.00, 78.00, 'GOS Australia 2024'),
        (74, 20, 2025, 60.00, 58000.00, 45000.00, 78000.00, 33.00, 79.00, 'Projection 2025'),
        (75, 21, 2023, 88.00, 85000.00, 70000.00, 110000.00, 6.00, 88.00, 'GOS Australia 2023'),
        (76, 21, 2024, 90.00, 88000.00, 72000.00, 115000.00, 5.00, 90.00, 'GOS Australia 2024'),
        (77, 21, 2025, 92.00, 92000.00, 75000.00, 120000.00, 4.00, 91.00, 'Projection 2025'),
        (78, 22, 2023, 72.00, 65000.00, 50000.00, 85000.00, 20.00, 82.00, 'GOS Australia 2023'),
        (79, 22, 2024, 74.00, 68000.00, 52000.00, 88000.00, 18.00, 84.00, 'GOS Australia 2024'),
        (80, 22, 2025, 76.00, 70000.00, 55000.00, 90000.00, 17.00, 85.00, 'Projection 2025'),
        (81, 23, 2023, 74.00, 78000.00, 60000.00, 100000.00, 18.00, 83.00, 'GOS Australia 2023'),
        (82, 23, 2024, 77.00, 82000.00, 62000.00, 105000.00, 17.00, 85.00, 'GOS Australia 2024'),
        (83, 23, 2025, 80.00, 86000.00, 65000.00, 110000.00, 15.00, 86.00, 'Projection 2025'),
        (84, 24, 2023, 62.00, 58000.00, 45000.00, 75000.00, 32.00, 77.00, 'GOS Australia 2023'),
        (85, 24, 2024, 65.00, 60000.00, 47000.00, 78000.00, 30.00, 79.00, 'GOS Australia 2024'),
        (86, 24, 2025, 67.00, 63000.00, 50000.00, 80000.00, 28.00, 80.00, 'Projection 2025'),
        (87, 25, 2023, 85.00, 70000.00, 55000.00, 90000.00, 10.00, 88.00, 'GOS Australia 2023'),
        (88, 25, 2024, 88.00, 73000.00, 58000.00, 95000.00, 9.00, 90.00, 'GOS Australia 2024'),
        (89, 25, 2025, 90.00, 76000.00, 60000.00, 100000.00, 8.00, 91.00, 'Projection 2025'),
        (90, 26, 2023, 70.00, 65000.00, 50000.00, 85000.00, 22.00, 81.00, 'GOS Australia 2023'),
        (91, 26, 2024, 72.00, 68000.00, 52000.00, 90000.00, 20.00, 83.00, 'GOS Australia 2024'),
        (92, 26, 2025, 75.00, 72000.00, 55000.00, 95000.00, 18.00, 84.00, 'Projection 2025');

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

-- Discussion Threads
INSERT INTO discussion_threads (program_id, user_id, title, content, category, reply_count, is_pinned) VALUES
(1, 1, 'Tips for finding a software internship in Adelaide?', 'Hi everyone! I''m a second-year CS student looking for internship opportunities in Adelaide over the summer break. Any advice on where to look or how to prepare? Would love to hear from alumni who have been through the process.', 'career', 2, 0),
(1, 3, 'Welcome to the Discussion Board!', 'This is a space for current students and alumni to connect, share advice, and discuss career paths. Feel free to start a conversation!', 'general', 0, 1);

-- Discussion Replies
INSERT INTO discussion_replies (thread_id, user_id, content) VALUES
(1, 3, 'Great question! I''d recommend checking out the university careers portal and attending the Industry Research Partnership Forum in April. Networking events are a great way to meet potential employers.'),
(1, 1, 'Thanks for the advice! I''ll definitely check out the careers portal and sign up for the forum.');

-- Sample User Connections (user IDs: 1=Jialao, 4=Rhaneela, 5=Menno, 6=Helena)
INSERT INTO user_connections (requester_id, receiver_id, status) VALUES
(1, 4, 'accepted'),
(1, 5, 'accepted'),
(1, 6, 'pending'),
(4, 5, 'accepted');

-- Sample Messages
INSERT INTO messages (sender_id, receiver_id, content, is_read) VALUES
(1, 4, 'Hi Rhaneela! I''m a current MIT student. Would love to hear about your experience at KPMG.', TRUE),
(4, 1, 'Hi Jialao! Happy to chat. I started in the Technology Risk team after graduation. What area are you interested in?', TRUE),
(1, 4, 'I''m particularly interested in cloud computing and cybersecurity consulting. Any advice?', FALSE),
(1, 5, 'Hey Menno! How did you find the transition from uni to working at ADVAM?', TRUE),
(5, 1, 'It was pretty smooth actually. The practical projects we did in the CS program really helped prepare me for the real world.', FALSE);
