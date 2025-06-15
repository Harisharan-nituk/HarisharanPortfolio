// backend/controllers/dashboardController.js
import asyncHandler from 'express-async-handler';
import Project from '../models/Project.js';
import Resume from '../models/Resume.js';
import Message from '../models/Message.js';
import SkillCategory from '../models/SkillCategory.js';
import Certificate from '../models/Certificate.js'; // <-- 1. Import the Certificate model

const getDashboardSummary = asyncHandler(async (req, res) => {
  try {
    const [
      projectCount,
      resumeCount,
      messageCount,
      skillCategoryCount,
      certificateCount // <-- 2. Add a variable for the certificate count
    ] = await Promise.all([
      Project.countDocuments({}),
      Resume.countDocuments({}),
      Message.countDocuments({}),
      SkillCategory.countDocuments({}),
      Certificate.countDocuments({}) // <-- 3. Add the count operation
    ]);

    const recentMessages = await Message.find({}).sort({ createdAt: -1 }).limit(5);
    const categories = await SkillCategory.find({}, 'skills');
    const totalSkills = categories.reduce((acc, category) => acc + category.skills.length, 0);

    res.json({
      stats: {
        projects: projectCount,
        resumes: resumeCount,
        messages: messageCount,
        skills: totalSkills,
        certificates: certificateCount // <-- 4. Add the new count to the response
      },
      recentMessages
    });

  } catch (error) {
    res.status(500);
    throw new Error('Server error fetching dashboard summary: ' + error.message);
  }
});

export { getDashboardSummary };