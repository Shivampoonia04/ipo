import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Building } from 'lucide-react';
import IPOCard from '../components/IPOCard';
import axios from 'axios';

const HomePage = () => {
  const [ipos, setIpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');

  // Mock data for development
  const mockIPOs = [
    {
      id: 1,
      ipoName: 'TechCorp Solutions IPO 2024',
      company: { name: 'TechCorp Solutions' },
      openDate: '2024-03-01T00:00:00.000Z',
      closeDate: '2024-03-05T00:00:00.000Z',
      priceRange: '$50-$60',
      lotSize: 100,
      issueSize: 55000000,
      faceValue: 10,
      status: 'upcoming',
      exchange: 'NSE',
      description: 'Initial public offering of TechCorp Solutions with focus on cloud computing expansion',
      rhpPath: 'sample-rhp.pdf',
      drhpPath: 'sample-drhp.pdf'
    },
    {
      id: 2,
      ipoName: 'GreenEnergy Ltd IPO 2024',
      company: { name: 'GreenEnergy Ltd' },
      openDate: '2024-02-15T00:00:00.000Z',
      closeDate: '2024-02-19T00:00:00.000Z',
      priceRange: '$30-$35',
      lotSize: 150,
      issueSize: 65000000,
      faceValue: 5,
      status: 'open',
      exchange: 'BSE',
      description: 'GreenEnergy Ltd IPO for renewable energy expansion projects',
      rhpPath: 'sample-rhp.pdf'
    },
    {
      id: 3,
      ipoName: 'HealthTech Innovations IPO 2024',
      company: { name: 'HealthTech Innovations' },
      openDate: '2024-01-10T00:00:00.000Z',
      closeDate: '2024-01-14T00:00:00.000Z',
      priceRange: '$80-$90',
      lotSize: 50,
      issueSize: 42500000,
      faceValue: 20,
      status: 'closed',
      exchange: 'NSE',
      description: 'HealthTech Innovations IPO for medical device development'
    }
  ];

  useEffect(() => {
    const fetchIPOs = async () => {
      try {
        setLoading(true);
        // In production, use the actual API
        // const response = await axios.get('/api/ipos');
        // setIpos(response.data.data);
        
        // For now, use mock data
        setIpos(mockIPOs);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch IPOs');
        setLoading(false);
      }
    };

    fetchIPOs();
  }, []);

  const filteredIPOs = ipos.filter(ipo => {
    const matchesSearch = ipo.ipoName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ipo.company.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ipo.status === statusFilter;
    const matchesCompany = companyFilter === 'all' || ipo.company.name === companyFilter;

    return matchesSearch && matchesStatus && matchesCompany;
  });

  const companies = [...new Set(ipos.map(ipo => ipo.company.name))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading IPOs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Track Upcoming IPOs
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Stay informed about the latest Initial Public Offerings. Get detailed information, 
              download official documents, and track IPO performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="relative max-w-md mx-auto sm:mx-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search IPOs or companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filter by:</span>
              
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field text-sm max-w-xs"
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="listed">Listed</option>
              </select>

              {/* Company Filter */}
              <select
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="input-field text-sm max-w-xs"
              >
                <option value="all">All Companies</option>
                {companies.map(company => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
            </div>

            <div className="text-sm text-gray-600">
              {filteredIPOs.length} of {ipos.length} IPOs
            </div>
          </div>
        </div>
      </div>

      {/* IPOs Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredIPOs.length === 0 ? (
          <div className="text-center py-12">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No IPOs found</h3>
            <p className="text-gray-600">
              Try adjusting your search or filters to find more IPOs.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIPOs.map(ipo => (
              <IPOCard key={ipo.id} ipo={ipo} />
            ))}
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {ipos.filter(ipo => ipo.status === 'upcoming').length}
              </div>
              <div className="text-gray-600">Upcoming IPOs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-success-600 mb-2">
                {ipos.filter(ipo => ipo.status === 'open').length}
              </div>
              <div className="text-gray-600">Currently Open</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-600 mb-2">
                {companies.length}
              </div>
              <div className="text-gray-600">Companies</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 