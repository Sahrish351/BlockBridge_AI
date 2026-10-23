import React, { useState } from 'react';
import { Resource, ResourceReportSubmission } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { apiService } from '../../services/apiService';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

interface ReportIssueModalProps {
  resource: Resource | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  resource,
  isOpen,
  onClose,
}) => {
  const [reportType, setReportType] = useState<ResourceReportSubmission['report_type']>('outdated_deadline');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!resource) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    try {
      await apiService.submitResourceReport({
        resource_id: resource.id,
        resource_name: resource.name,
        report_type: reportType,
        description,
        reporter_email: email.trim() || undefined,
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setDescription('');
        onClose();
      }, 1800);
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Suggest a Resource Correction"
      description={`Help our civic review team keep "${resource.name}" accurate.`}
    >
      {isSuccess ? (
        <div className="py-6 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-bb-success mx-auto" />
          <h4 className="font-serif text-lg font-bold text-bb-ink">
            Thank you for helping our community
          </h4>
          <p className="text-xs text-bb-ink-muted max-w-xs mx-auto">
            Your report has been entered into the reviewer moderation queue. Our team checks official sources before updating public listings.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-bb-ink mb-1">
              What kind of update are you reporting?
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-bb-line text-bb-ink focus:outline-none focus:ring-2 focus:ring-bb-focus"
            >
              <option value="outdated_deadline">Outdated Deadline or Cohort Date</option>
              <option value="broken_link">Broken Official Portal Link</option>
              <option value="incorrect_eligibility">Incorrect Eligibility Criteria or Documents</option>
              <option value="wrong_location">Wrong Location or Coverage Area</option>
              <option value="other">Other Information Update</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-bb-ink mb-1">
              Correction details & source link <span className="text-bb-danger">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. The application portal moved to a new URL, or the deadline was extended to Nov 15th (include link to source if possible)..."
              className="w-full text-xs p-3 rounded-xl bg-white border border-bb-line text-bb-ink focus:outline-none focus:ring-2 focus:ring-bb-focus resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-bb-ink mb-1">
              Your email <span className="text-bb-ink-subtle font-normal">(Optional, for clarification only)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-bb-line text-bb-ink focus:outline-none focus:ring-2 focus:ring-bb-focus"
            />
          </div>

          <div className="p-3 rounded-xl bg-bb-surface-soft border border-bb-line text-[11px] text-bb-ink-muted flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <span>
              All submissions are checked against official government or nonprofit source pages by a reviewer prior to updating the catalogue.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-bb-line">
            <Button variant="ghost" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              isLoading={isSubmitting}
            >
              Submit for Review
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
