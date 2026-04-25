USE personal_resume;

SET @new_avatar_url = 'https://raw.githubusercontent.com/Gbbfine/PersonalFileHosting/main/avatar.webp';
SET @new_resume_pdf_url = 'https://raw.githubusercontent.com/Gbbfine/PersonalFileHosting/main/%E8%91%9B%E5%AE%9D%E6%96%8C%20-%20%E7%AE%80%E5%8E%860903.pdf';

UPDATE profile
SET avatar_url = @new_avatar_url,
    resume_pdf_url = @new_resume_pdf_url
WHERE is_active = 1;
