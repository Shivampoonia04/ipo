import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, DollarSign, Building, Download, ExternalLink, FileText, Users, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';

const IPODetailPage = () => {
  const { id } = useParams();
  const [ipo, setIpo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for development
  const mockIPO = {
    id: 1,
    ipoName: 'TechCorp Solutions IPO 2024',
    company: {
      name: 'TechCorp Solutions',
      description: 'Leading technology solutions provider specializing in cloud computing and AI',
      sector: 'Technology',
      website: 'https://techcorp.com',
      foundedYear: 2010,
      headquarters: 'San Francisco, CA'
    },
    openDate: '2024-03-01T00:00:00.000Z',
    closeDate: '2024-03-05T00:00:00.000Z',
    priceRange: '$50-$60',
    lotSize: 100,
    totalShares: 1000000,
    issueSize: 55000000,
    faceValue: 10,
    status: 'upcoming',
    exchange: 'NSE',
    registrar: 'Link Intime',
    leadManager: 'Morgan Stanley',
    description: 'Initial public offering of TechCorp Solutions with focus on cloud computing expansion. The company plans to use the proceeds for research and development, market expansion, and debt repayment.',
    rhpPath: 'sample-rhp.pdf',
    drhpPath: 'sample-drhp.pdf',
    prospectusPath: 'sample-prospectus.pdf'
  };

  useEffect(() => {
    const fetchIPO = async () => {
      try {
        setLoading(true);
        // In production, use the actual API
        // const response = await axios.get(`/api/ipos/${id}`);
        // setIpo(response.data.data);
        
        // For now, use mock data
        setIpo(mockIPO);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch IPO details');
        setLoading(false);
      }
    };

    fetchIPO();
  }, [id]);

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'EEEE, MMMM dd, yyyy');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'status-upcoming';
      case 'open':
        return 'status-open';
      case 'closed':
        return 'status-closed';
      case 'listed':
        return 'status-listed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-upcoming';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading IPO details...</p>
        </div>
      </div>
    );
  }

  if (error || !ipo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'IPO not found'}</p>
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-primary-600">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to IPOs</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* IPO Header */}
            <div className="card mb-8">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {ipo.ipoName}
                    </h1>
                    <p className="text-lg text-gray-600 mb-4">
                      {ipo.company.name}
                    </p>
                    <div className="flex items-center space-x-4">
                      <span className={`status-badge ${getStatusColor(ipo.status)}`}>
                        {ipo.status.charAt(0).toUpperCase() + ipo.status.slice(1)}
                      </span>
                      {ipo.exchange && (
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {ipo.exchange}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Key Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Open Date</p>
                        <p className="font-medium text-gray-900">{formatDate(ipo.openDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Close Date</p>
                        <p className="font-medium text-gray-900">{formatDate(ipo.closeDate)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Price Range</p>
                        <p className="font-medium text-gray-900">{ipo.priceRange || 'TBA'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Lot Size</p>
                        <p className="font-medium text-gray-900">
                          {ipo.lotSize ? `${ipo.lotSize} shares` : 'TBA'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div className="card mb-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Building className="h-5 w-5 mr-2 text-primary-600" />
                  Company Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">{ipo.company.name}</h3>
                    <p className="text-gray-600 mb-4">{ipo.company.description}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Sector</p>
                      <p className="font-medium text-gray-900">{ipo.company.sector}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Founded</p>
                      <p className="font-medium text-gray-900">{ipo.company.foundedYear}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Headquarters</p>
                      <p className="font-medium text-gray-900">{ipo.company.headquarters}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Website</p>
                      <a 
                        href={ipo.company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-primary-600 hover:text-primary-700"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* IPO Details */}
            <div className="card mb-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-primary-600" />
                  IPO Details
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-600">{ipo.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Shares</span>
                        <span className="font-medium">{ipo.totalShares?.toLocaleString() || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Issue Size</span>
                        <span className="font-medium">{formatCurrency(ipo.issueSize)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Face Value</span>
                        <span className="font-medium">{ipo.faceValue ? `₹${ipo.faceValue}` : 'N/A'}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Registrar</span>
                        <span className="font-medium">{ipo.registrar || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lead Manager</span>
                        <span className="font-medium">{ipo.leadManager || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Documents */}
            <div className="card mb-6">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary-600" />
                  Documents
                </h3>
                <div className="space-y-3">
                  {ipo.rhpPath && (
                    <a
                      href={`/api/documents/${ipo.id}/download/rhp`}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="flex items-center space-x-2">
                        <Download className="h-4 w-4 text-primary-600" />
                        <span className="font-medium">RHP</span>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </a>
                  )}
                  {ipo.drhpPath && (
                    <a
                      href={`/api/documents/${ipo.id}/download/drhp`}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="flex items-center space-x-2">
                        <Download className="h-4 w-4 text-primary-600" />
                        <span className="font-medium">DRHP</span>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </a>
                  )}
                  {ipo.prospectusPath && (
                    <a
                      href={`/api/documents/${ipo.id}/download/prospectus`}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="flex items-center space-x-2">
                        <Download className="h-4 w-4 text-primary-600" />
                        <span className="font-medium">Prospectus</span>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </a>
                  )}
                  {!ipo.rhpPath && !ipo.drhpPath && !ipo.prospectusPath && (
                    <p className="text-gray-500 text-sm">No documents available yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full btn-primary">
                    Apply for IPO
                  </button>
                  <button className="w-full btn-secondary">
                    Add to Watchlist
                  </button>
                  <button className="w-full btn-secondary">
                    Share IPO
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IPODetailPage; 