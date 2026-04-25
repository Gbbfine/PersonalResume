USE personal_resume;

INSERT INTO profile (
    full_name,
    title,
    avatar_url,
    location,
    bio,
    resume_pdf_url,
    is_active
) VALUES (
    'Your Name',
    'Java Backend Developer',
    'https://raw.githubusercontent.com/Gbbfine/PersonalFileHosting/main/avatar.webp',
    'China',
    'Write a concise self introduction here.',
    'https://raw.githubusercontent.com/Gbbfine/PersonalFileHosting/main/%E8%91%9B%E5%AE%9D%E6%96%8C%20-%20%E7%AE%80%E5%8E%860903.pdf',
    1
);

SET @active_profile_id = LAST_INSERT_ID();

INSERT INTO skill (profile_id, name, sort_order, is_visible) VALUES
(@active_profile_id, 'Java', 1, 1),
(@active_profile_id, 'Spring Boot', 2, 1),
(@active_profile_id, 'Redis', 3, 1),
(@active_profile_id, 'MySQL', 4, 1),
(@active_profile_id, 'Docker', 5, 1);

INSERT INTO project_experience (
    profile_id,
    name,
    role,
    summary,
    start_date,
    end_date,
    highlight,
    demo_url,
    repo_url,
    sort_order,
    is_visible
) VALUES (
    @active_profile_id,
    'Personal Resume Website',
    'Full Stack Developer',
    'A separated frontend-backend resume website with admin content management.',
    '2026-04-01',
    NULL,
    'Implemented public display pages, admin CRUD and JWT authentication.',
    '',
    '',
    1,
    1
);

INSERT INTO work_experience (
    profile_id,
    company,
    position,
    type,
    start_date,
    end_date,
    description,
    sort_order,
    is_visible
) VALUES (
    @active_profile_id,
    'Example Company',
    'Backend Intern',
    'intern',
    '2025-07-01',
    '2025-12-31',
    'Participated in backend API development and testing.',
    1,
    1
);

INSERT INTO education_experience (
    profile_id,
    school,
    degree,
    major,
    start_date,
    end_date,
    gpa,
    sort_order,
    is_visible
) VALUES (
    @active_profile_id,
    'Example University',
    'Bachelor',
    'Computer Science',
    '2021-09-01',
    '2025-06-30',
    '3.6/4.0',
    1,
    1
);

INSERT INTO honor (
    profile_id,
    title,
    issuer,
    award_date,
    description,
    sort_order,
    is_visible
) VALUES (
    @active_profile_id,
    'Scholarship',
    'Example University',
    '2024-11-01',
    'Received annual scholarship for academic performance.',
    1,
    1
);

INSERT INTO contact (profile_id, type, label, value, sort_order, is_visible) VALUES
(@active_profile_id, 'email', 'Email', 'your@email.com', 1, 1),
(@active_profile_id, 'github', 'GitHub', 'Gbbfine', 2, 1),
(@active_profile_id, 'blog', 'Blog', 'https://your-blog.com', 3, 1);
