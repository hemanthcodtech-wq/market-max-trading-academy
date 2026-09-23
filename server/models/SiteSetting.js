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
  },
  contactInfo: {
    address: {
      type: String,
      default: 'B Block - 505, Northface Grandeur Apartments, Hyderabad, Telangana - 500001'
    },
    phone: {
      type: String,
      default: '+91 96523 57824'
    },
    phoneHref: {
      type: String,
      default: '+919652357824'
    },
    whatsappNumber: {
      type: String,
      default: '919652357824'
    },
    whatsappUrl: {
      type: String,
      default: 'https://wa.me/919652357824'
    },
    email: {
      type: String,
      default: 'support@marketmaxtradingacademy.com'
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('SiteSetting', siteSettingSchema);
