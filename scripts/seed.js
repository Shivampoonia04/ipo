const { User, Company, IPO } = require('../models');
const sequelize = require('../config/database');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Create sample companies
    const companies = await Company.bulkCreate([
      {
        name: 'TechCorp Solutions',
        description: 'Leading technology solutions provider specializing in cloud computing and AI',
        sector: 'Technology',
        website: 'https://techcorp.com',
        foundedYear: 2010,
        headquarters: 'San Francisco, CA',
        status: 'active'
      },
      {
        name: 'GreenEnergy Ltd',
        description: 'Renewable energy company focused on solar and wind power solutions',
        sector: 'Energy',
        website: 'https://greenenergy.com',
        foundedYear: 2015,
        headquarters: 'Austin, TX',
        status: 'active'
      },
      {
        name: 'HealthTech Innovations',
        description: 'Healthcare technology company developing medical devices and software',
        sector: 'Healthcare',
        website: 'https://healthtech.com',
        foundedYear: 2018,
        headquarters: 'Boston, MA',
        status: 'active'
      },
      {
        name: 'FinServ Digital',
        description: 'Digital financial services platform for banking and payments',
        sector: 'Financial Services',
        website: 'https://finserv.com',
        foundedYear: 2012,
        headquarters: 'New York, NY',
        status: 'active'
      },
      {
        name: 'EduTech Pro',
        description: 'Educational technology platform for online learning and skill development',
        sector: 'Education',
        website: 'https://edutech.com',
        foundedYear: 2016,
        headquarters: 'Seattle, WA',
        status: 'active'
      }
    ]);

    console.log(`✅ Created ${companies.length} companies`);

    // Create sample IPOs
    const ipos = await IPO.bulkCreate([
      {
        companyId: companies[0].id,
        ipoName: 'TechCorp Solutions IPO 2024',
        openDate: new Date('2024-03-01'),
        closeDate: new Date('2024-03-05'),
        priceRange: '$50-$60',
        lotSize: 100,
        totalShares: 1000000,
        issueSize: 55000000,
        faceValue: 10,
        status: 'upcoming',
        exchange: 'NSE',
        registrar: 'Link Intime',
        leadManager: 'Morgan Stanley',
        description: 'Initial public offering of TechCorp Solutions with focus on cloud computing expansion'
      },
      {
        companyId: companies[1].id,
        ipoName: 'GreenEnergy Ltd IPO 2024',
        openDate: new Date('2024-02-15'),
        closeDate: new Date('2024-02-19'),
        priceRange: '$30-$35',
        lotSize: 150,
        totalShares: 2000000,
        issueSize: 65000000,
        faceValue: 5,
        status: 'open',
        exchange: 'BSE',
        registrar: 'Karvy',
        leadManager: 'Goldman Sachs',
        description: 'GreenEnergy Ltd IPO for renewable energy expansion projects'
      },
      {
        companyId: companies[2].id,
        ipoName: 'HealthTech Innovations IPO 2024',
        openDate: new Date('2024-01-10'),
        closeDate: new Date('2024-01-14'),
        priceRange: '$80-$90',
        lotSize: 50,
        totalShares: 500000,
        issueSize: 42500000,
        faceValue: 20,
        status: 'closed',
        exchange: 'NSE',
        registrar: 'Link Intime',
        leadManager: 'JP Morgan',
        description: 'HealthTech Innovations IPO for medical device development'
      },
      {
        companyId: companies[3].id,
        ipoName: 'FinServ Digital IPO 2024',
        openDate: new Date('2024-04-01'),
        closeDate: new Date('2024-04-05'),
        priceRange: '$40-$45',
        lotSize: 200,
        totalShares: 1500000,
        issueSize: 63750000,
        faceValue: 8,
        status: 'upcoming',
        exchange: 'BSE',
        registrar: 'Karvy',
        leadManager: 'Citigroup',
        description: 'FinServ Digital IPO for digital banking platform expansion'
      },
      {
        companyId: companies[4].id,
        ipoName: 'EduTech Pro IPO 2024',
        openDate: new Date('2024-05-01'),
        closeDate: new Date('2024-05-05'),
        priceRange: '$25-$30',
        lotSize: 300,
        totalShares: 3000000,
        issueSize: 82500000,
        faceValue: 5,
        status: 'upcoming',
        exchange: 'NSE',
        registrar: 'Link Intime',
        leadManager: 'Bank of America',
        description: 'EduTech Pro IPO for online education platform development'
      }
    ]);

    console.log(`✅ Created ${ipos.length} IPOs`);

    // Create additional admin user if needed
    const adminExists = await User.findOne({
      where: { email: 'admin2@ipo-platform.com' }
    });

    if (!adminExists) {
      await User.create({
        email: 'admin2@ipo-platform.com',
        password: 'admin123',
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User 2',
        isActive: true
      });
      console.log('✅ Created additional admin user');
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Sample Data Summary:');
    console.log(`   - Companies: ${companies.length}`);
    console.log(`   - IPOs: ${ipos.length}`);
    console.log('\n🔗 Test the API:');
    console.log('   - Health Check: http://localhost:5000/health');
    console.log('   - Get IPOs: http://localhost:5000/api/ipos');
    console.log('   - Get Companies: http://localhost:5000/api/companies');
    console.log('\n🔐 Admin Login:');
    console.log('   - Email: admin@ipo-platform.com');
    console.log('   - Password: admin123');

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run the seed function
seedDatabase(); 