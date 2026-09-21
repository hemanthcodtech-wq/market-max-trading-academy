const mongoose = require('mongoose');

const siteSettingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    default: 'platform_stats'
  },
  stats: {
    studentsCount: { type: Number, default: 5000 },
    studentsSuffix: { type: String, default: '+' },
    studentsLabel: { type: String, default: 'Students' },
    
    coursesCount: { type: Number, default: 25 },
    coursesSuffix: { type: String, default: '+' },
    coursesLabel: { type: String, default: 'Courses' },


    satisfactionRate: { type: Number, default: 99 },
    satisfactionSuffix: { type: String, default: '%' },
    satisfactionLabel: { type: String, default: 'Satisfaction' },

    communitiesCount: { type: Number, default: 15 },
    communitiesSuffix: { type: String, default: '+' },
    communitiesLabel: { type: String, default: 'Global Communities' },

    lineageRate: { type: Number, default: 100 },
    lineageSuffix: { type: String, default: '%' },
    lineageLabel: { type: String, default: 'Authentic Financial Lineage' }
  }
}, { timestamps: true });

module.exports = mongoose.model('SiteSetting', siteSettingSchema);
