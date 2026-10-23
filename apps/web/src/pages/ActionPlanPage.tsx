import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Printer, 
  ArrowLeft, 
  Plus, 
  ExternalLink, 
  Calendar, 
  Edit3, 
  Trash2
} from 'lucide-react';
import { ActionPlan, PlanStep, PlanStepStatus } from '../types';
import { apiService } from '../services/apiService';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
interface ActionPlanPageProps {
  planId?: string;
}
export const ActionPlanPage: React.FC<ActionPlanPageProps> = ({ planId: propPlanId }) => {
  const { id: routeId } = useParams<{ id: string }>();
  const id = propPlanId || routeId;
  const [plan, setPlan] = useState<ActionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingStep, setIsAddingStep] = useState(false);
  const [newStepTitle, setNewStepTitle] = useState('');
  const [newStepDesc, setNewStepDesc] = useState('');
  const [newStepDate, setNewStepDate] = useState('');
  const [newStepUrl, setNewStepUrl] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const loadPlan = async () => {
    setIsLoading(true);
    try {
      if (id) {
        const found = await apiService.getActionPlanById(id);
        setPlan(found);
      } else {
        const list = await apiService.getActionPlans();
        setPlan(list[0] || null);
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadPlan();
  }, [id]);
  const handleStatusChange = async (stepId: string, newStatus: PlanStepStatus) => {
    if (!plan) return;
    const updated = await apiService.updatePlanStepStatus(plan.id, stepId, newStatus);
    if (updated) {
      setPlan(prev => {
        if (!prev) return null;
        return {
          ...prev,
          tasks: prev.tasks.map(t => t.id === stepId ? { ...t, status: newStatus } : t)
        };
      });
    }
  };
  const handleSaveNote = async (stepId: string) => {
    if (!plan) return;
    await apiService.updatePlanStepStatus(plan.id, stepId, plan.tasks.find(t => t.id === stepId)?.status || 'Not Started', noteDraft);
    setPlan(prev => {
      if (!prev) return null;
      return {
        ...prev,
        tasks: prev.tasks.map(t => t.id === stepId ? { ...t, notes: noteDraft } : t)
      };
    });
    setEditingNoteId(null);
  };
  const handleAddCustomStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan || !newStepTitle.trim()) return;
    await apiService.addPlanStep(plan.id, {
      title: newStepTitle,
      description: newStepDesc,
      status: 'Not Started',
      due_date: newStepDate || undefined,
      source_url: newStepUrl || undefined,
    });
    setNewStepTitle('');
    setNewStepDesc('');
    setNewStepDate('');
    setNewStepUrl('');
    setIsAddingStep(false);
    loadPlan();
  };
  const handleDeleteStep = async (stepId: string) => {
    if (!plan) return;
    await apiService.deletePlanStep(plan.id, stepId);
    setPlan(prev => {
      if (!prev) return null;
      return {
        ...prev,
        tasks: prev.tasks.filter(t => t.id !== stepId)
      };
    });
  };
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-bb-brand border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-bb-ink-muted">Loading your action plan roadmap...</p>
      </div>
    );
  }
  if (!plan) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-bb-ink">No Action Plan Found</h2>
        <p className="text-xs text-bb-ink-muted">You don't have an active action plan yet. Complete a guided search to generate one.</p>
        <Link to="/find-support">
          <Button variant="primary" size="md">Start Guided Intake</Button>
        </Link>
      </div>
    );
  }
  const completedCount = plan.tasks.filter(t => t.status === 'Completed').length;
  const progressPercent = Math.round((completedCount / (plan.tasks.length || 1)) * 100);
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Breadcrumb & Print Toolbar */}
      <div className="flex items-center justify-between no-print">
        <Link
          to="/app"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-bb-ink-muted hover:text-bb-brand transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Dashboard</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => window.print()}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Print / Export PDF
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddingStep(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Custom Step
          </Button>
        </div>
      </div>
      {/* Plan Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-bb-line shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-bb-line">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-bb-brand">
              Action Plan Roadmap
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-bb-ink mt-0.5">
              {plan.title}
            </h1>
            <p className="text-xs text-bb-ink-muted mt-1">
              Goal: <strong className="text-bb-ink">{plan.goal}</strong>
            </p>
          </div>
          <div className="sm:text-right">
            <span className="text-2xl font-serif font-bold text-bb-brand">
              {progressPercent}%
            </span>
            <span className="text-xs text-bb-ink-muted block">
              {completedCount} of {plan.tasks.length} Completed
            </span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-bb-line h-3 rounded-full overflow-hidden">
          <div
            className="bg-bb-brand h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>
      {/* Tasks List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-bb-ink">
            Checklist Steps & Prerequisites
          </h2>
          <span className="text-xs text-bb-ink-subtle">
            Click status to mark progress
          </span>
        </div>
        <div className="space-y-3">
          {plan.tasks.map((task: PlanStep, idx: number) => {
            const isCompleted = task.status === 'Completed';
            const isInProgress = task.status === 'In Progress';
            return (
              <div
                key={task.id}
                className={`bg-white rounded-2xl p-5 border transition-all duration-200 shadow-sm ${
                  isCompleted 
                    ? 'border-emerald-200 bg-emerald-50/20' 
                    : isInProgress
                    ? 'border-bb-brand bg-bb-brand-soft/20'
                    : 'border-bb-line'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Step Order & Info */}
                  <div className="flex items-start gap-3.5 flex-1">
                    <button
                      onClick={() => handleStatusChange(task.id, isCompleted ? 'In Progress' : 'Completed')}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors focus:outline-none focus:ring-2 focus:ring-bb-focus cursor-pointer ${
                        isCompleted
                          ? 'bg-bb-success text-white'
                          : isInProgress
                          ? 'bg-bb-brand-soft text-bb-brand border border-bb-brand'
                          : 'border border-bb-line-strong text-bb-ink-subtle hover:border-bb-brand'
                      }`}
                      aria-label={`Mark task ${task.title} as ${isCompleted ? 'in progress' : 'completed'}`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                    </button>
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className={`text-sm sm:text-base font-semibold ${isCompleted ? 'line-through text-bb-ink-muted' : 'text-bb-ink'}`}>
                          {task.title}
                        </h4>
                        {task.due_date && (
                          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-bb-surface-soft border border-bb-line text-bb-ink-muted">
                            <Calendar className="w-3 h-3 text-bb-ink-subtle" />
                            <span>Due: {task.due_date}</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-bb-ink-muted leading-relaxed">
                        {task.description}
                      </p>
                      {/* Source Link */}
                      {task.source_url && (
                        <div className="pt-1">
                          <a
                            href={task.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-bb-brand hover:underline"
                          >
                            <span>Official Source & Application Form</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                      {/* Notes Box */}
                      {editingNoteId === task.id ? (
                        <div className="pt-2 space-y-2">
                          <textarea
                            rows={2}
                            value={noteDraft}
                            onChange={(e) => setNoteDraft(e.target.value)}
                            placeholder="Add reference numbers, confirmation codes, or appointment dates..."
                            className="w-full text-xs p-2.5 rounded-xl border border-bb-line bg-bb-surface-soft text-bb-ink focus:outline-none focus:ring-2 focus:ring-bb-focus"
                          />
                          <div className="flex gap-2">
                            <Button variant="primary" size="sm" onClick={() => handleSaveNote(task.id)}>Save Note</Button>
                            <Button variant="ghost" size="sm" onClick={() => setEditingNoteId(null)}>Cancel</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="pt-1 flex items-center justify-between text-xs text-bb-ink-subtle">
                          {task.notes ? (
                            <p className="text-xs text-bb-ink bg-bb-surface-soft p-2 rounded-lg border border-bb-line">
                              <strong>Note:</strong> {task.notes}
                            </p>
                          ) : (
                            <span className="no-print">No personal notes added yet.</span>
                          )}
                          <button
                            onClick={() => {
                              setEditingNoteId(task.id);
                              setNoteDraft(task.notes || '');
                            }}
                            className="no-print underline hover:text-bb-brand ml-2 flex items-center gap-1 text-[11px] cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>{task.notes ? 'Edit Note' : 'Add Note'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {}
                  <div className="flex items-center gap-2 self-start no-print">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value as PlanStepStatus)}
                      className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-bb-surface-soft border border-bb-line text-bb-ink focus:outline-none focus:ring-2 focus:ring-bb-focus cursor-pointer"
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Blocked">Blocked</option>
                    </select>
                    <button
                      onClick={() => handleDeleteStep(task.id)}
                      className="p-1.5 rounded-lg text-bb-ink-subtle hover:text-bb-danger transition-colors cursor-pointer"
                      title="Remove task"
                      aria-label="Remove task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {}
      <Modal
        isOpen={isAddingStep}
        onClose={() => setIsAddingStep(false)}
        title="Add a Custom Plan Step"
        description="Add a personal preparation task, phone call, or document gathering reminder to your roadmap."
      >
        <form onSubmit={handleAddCustomStep} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-bb-ink mb-1">
              Task Title <span className="text-bb-danger">*</span>
            </label>
            <input
              type="text"
              required
              value={newStepTitle}
              onChange={(e) => setNewStepTitle(e.target.value)}
              placeholder="e.g. Call loan officer to confirm appointment"
              className="w-full text-xs px-3 py-2 rounded-xl bg-bb-surface-soft border border-bb-line text-bb-ink focus:outline-none focus:ring-2 focus:ring-bb-focus"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-bb-ink mb-1">
              Description / Action Details
            </label>
            <textarea
              rows={2}
              value={newStepDesc}
              onChange={(e) => setNewStepDesc(e.target.value)}
              placeholder="e.g. Confirm 2025 W-2 is signed before meeting..."
              className="w-full text-xs p-3 rounded-xl bg-bb-surface-soft border border-bb-line text-bb-ink focus:outline-none focus:ring-2 focus:ring-bb-focus resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-bb-ink mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={newStepDate}
                onChange={(e) => setNewStepDate(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl bg-bb-surface-soft border border-bb-line text-bb-ink focus:outline-none focus:ring-2 focus:ring-bb-focus"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-bb-ink mb-1">
                Source Link (Optional)
              </label>
              <input
                type="url"
                value={newStepUrl}
                onChange={(e) => setNewStepUrl(e.target.value)}
                placeholder="https://..."
                className="w-full text-xs px-3 py-2 rounded-xl bg-bb-surface-soft border border-bb-line text-bb-ink focus:outline-none focus:ring-2 focus:ring-bb-focus"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-bb-line">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddingStep(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Add Step
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
