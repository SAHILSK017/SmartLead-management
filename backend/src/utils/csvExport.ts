import { ILead } from '../types';

const escapeCsvValue = (value: string): string => {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

export const buildCsvString = (leads: ILead[]): string => {
  const headers = ['Name', 'Email', 'Status', 'Source', 'Created At'];
  const rows = leads.map((lead) => [
    escapeCsvValue(lead.name),
    escapeCsvValue(lead.email),
    escapeCsvValue(lead.status),
    escapeCsvValue(lead.source),
    escapeCsvValue(new Date(lead.createdAt).toISOString()),
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
};
