'use client';

import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ArtifactData {
  status: 'valid' | 'invalid';
  type?: string;
  actual: string;
  expected_pattern: string;
  example: string;
  file: string;
  issue?: string;
  suggested?: string;
}

interface CategoryData {
  name: string;
  count: number;
  artifacts: ArtifactData[];
}

interface NamingReportData {
  categories: CategoryData[];
  summary: {
    total_artifacts: number;
    naming_issues: number;
    compliant_artifacts: number;
  };
}

interface NamingReportTableProps {
  data: NamingReportData;
}

export default function NamingReportTable({ data }: NamingReportTableProps) {
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(
    new Set(data.categories.map(c => c.name))
  );

  const toggleCategory = (categoryName: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedCategories(newExpanded);
  };

  const getStatusIcon = (status: string) => {
    if (status === 'valid') {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'valid') {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
          Valid
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
        Invalid
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Artifacts</p>
              <p className="text-2xl font-bold text-gray-900">{data.summary.total_artifacts}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Compliant</p>
              <p className="text-2xl font-bold text-green-600">{data.summary.compliant_artifacts}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Issues Found</p>
              <p className="text-2xl font-bold text-red-600">{data.summary.naming_issues}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {data.categories.map((category) => (
          <div key={category.name} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category.name)}
              className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-200 text-gray-700">
                  {category.count} artifacts
                </span>
              </div>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  expandedCategories.has(category.name) ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Category Content */}
            {expandedCategories.has(category.name) && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      {category.name === 'Activities' && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                      )}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actual Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Expected Pattern
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Example
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        File
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {category.artifacts.map((artifact, idx) => (
                      <tr key={idx} className={artifact.status === 'invalid' ? 'bg-red-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(artifact.status)}
                            {getStatusBadge(artifact.status)}
                          </div>
                        </td>
                        {category.name === 'Activities' && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium rounded bg-purple-100 text-purple-800">
                              {artifact.type}
                            </span>
                          </td>
                        )}
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{artifact.actual}</div>
                          {artifact.status === 'invalid' && artifact.issue && (
                            <div className="text-xs text-red-600 mt-1">{artifact.issue}</div>
                          )}
                          {artifact.status === 'invalid' && artifact.suggested && (
                            <div className="text-xs text-green-600 mt-1">
                              Suggested: {artifact.suggested}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <code className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded">
                            {artifact.expected_pattern}
                          </code>
                        </td>
                        <td className="px-6 py-4">
                          <code className="text-sm text-gray-600">{artifact.example}</code>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 truncate max-w-xs" title={artifact.file}>
                            {artifact.file}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

