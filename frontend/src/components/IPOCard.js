import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, DollarSign, Building, Download, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

const IPOCard = ({ ipo }) => {
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
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  return (
    <div className="card hover:shadow-medium transition-shadow duration-300 group">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors duration-200">
              {ipo.ipoName}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {ipo.company?.name}
            </p>
            <div className="flex items-center space-x-2">
              <span className={`status-badge ${getStatusColor(ipo.status)}`}>
                {ipo.status.charAt(0).toUpperCase() + ipo.status.slice(1)}
              </span>
              {ipo.exchange && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {ipo.exchange}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Open Date</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(ipo.openDate)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Close Date</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(ipo.closeDate)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Price Range</span>
            <span className="text-sm font-semibold text-gray-900">
              {ipo.priceRange || 'TBA'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Lot Size</span>
            <span className="text-sm font-semibold text-gray-900">
              {ipo.lotSize ? `${ipo.lotSize} shares` : 'TBA'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Issue Size</span>
            <span className="text-sm font-semibold text-gray-900">
              {formatCurrency(ipo.issueSize)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Face Value</span>
            <span className="text-sm font-semibold text-gray-900">
              {ipo.faceValue ? `₹${ipo.faceValue}` : 'TBA'}
            </span>
          </div>
        </div>

        {ipo.description && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600 line-clamp-2">
              {ipo.description}
            </p>
          </div>
        )}
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {ipo.rhpPath && (
              <a
                href={`/api/documents/${ipo.id}/download/rhp`}
                className="flex items-center space-x-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="h-3 w-3" />
                <span>RHP</span>
              </a>
            )}
            {ipo.drhpPath && (
              <a
                href={`/api/documents/${ipo.id}/download/drhp`}
                className="flex items-center space-x-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="h-3 w-3" />
                <span>DRHP</span>
              </a>
            )}
          </div>
          
          <Link
            to={`/ipo/${ipo.id}`}
            className="btn-primary text-sm py-1.5 px-3"
          >
            View Details
            <ExternalLink className="h-3 w-3 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IPOCard; 