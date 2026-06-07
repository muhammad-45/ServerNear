const Category = require('../models/Category');
const User = require('../models/User');

const categories = [
  { name: 'Electrician', icon: '⚡', description: 'Electrical wiring, repairs, installations, and maintenance services' },
  { name: 'Plumber', icon: '🔧', description: 'Plumbing repairs, pipe fitting, water heater installation' },
  { name: 'Tutor', icon: '📚', description: 'Home tutoring, online classes, exam preparation' },
  { name: 'Mechanic', icon: '🔩', description: 'Vehicle repair, engine maintenance, oil change, tire services' },
  { name: 'Beautician', icon: '💄', description: 'Hair styling, makeup, skincare, bridal services' },
  { name: 'Carpenter', icon: '🪚', description: 'Furniture making, wood repairs, cabinet installation' },
  { name: 'Painter', icon: '🎨', description: 'House painting, wall textures, waterproofing' },
  { name: 'AC Technician', icon: '❄️', description: 'AC installation, repair, gas refilling, maintenance' },
  { name: 'Cleaning', icon: '🧹', description: 'House cleaning, deep cleaning, office cleaning services' },
  { name: 'Tailor', icon: '🧵', description: 'Stitching, alterations, custom clothing, embroidery' }
];

const autoSeed = async () => {
  try {
    // Seed categories
    const existingCategories = await Category.countDocuments();
    if (existingCategories === 0) {
      await Category.insertMany(categories);
      console.log('✅ Default Categories auto-seeded successfully');
    } else {
      console.log('ℹ️ Categories check passed (already exist)');
    }

    // Seed admin user
    const existingAdmin = await User.findOne({ email: 'admin@servenear.com' });
    if (!existingAdmin) {
      await User.create({
        name: 'Admin',
        email: 'admin@servenear.com',
        password: 'admin123',
        role: 'admin',
        phone: '+92-300-0000000',
        city: 'Islamabad'
      });
      console.log('✅ Default Admin user auto-created (admin@servenear.com)');
    } else {
      console.log('ℹ️ Admin user check passed (already exists)');
    }
  } catch (error) {
    console.error('❌ Auto-seed error:', error);
  }
};

module.exports = autoSeed;
