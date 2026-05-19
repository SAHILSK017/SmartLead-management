import mongoose, { Schema } from 'mongoose';
import { ILead, LeadSource, LeadStatus } from '../types';

const leadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    status: {
      type: String,
      enum: Object.values(LeadStatus),
      default: LeadStatus.NEW,
    },
    source: {
      type: String,
      enum: Object.values(LeadSource),
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Indexes for efficient filtering
leadSchema.index({ status: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ createdBy: 1, createdAt: -1 });
leadSchema.index({ status: 1, source: 1, createdAt: -1 });
leadSchema.index({ name: 'text', email: 'text' });

export const Lead = mongoose.model<ILead>('Lead', leadSchema);
