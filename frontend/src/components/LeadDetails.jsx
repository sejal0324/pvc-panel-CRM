import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
     ArrowLeft,
     Building2,
     User,
     Phone,
     MapPin,
     Star,
     Clock,
     CheckCircle,
     XCircle,
     Activity
} from 'lucide-react';
import * as leadApi from '../apis/leadApi';
import './LeadDetails.css';

const LeadDetails = () => {
     const { id } = useParams();
     const navigate = useNavigate();
     const [lead, setLead] = useState(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
     const [actionError, setActionError] = useState(null);
     const [actionLoading, setActionLoading] = useState(false);

     useEffect(() => {
          fetchLead();
     }, [id]);

     const fetchLead = async () => {
          try {
               setLoading(true);
               const data = await leadApi.getLeadById(id);
               if (data) {
                    setLead(data);
               } else {
                    setError('Lead record not found.');
               }
               setLoading(false);
          } catch (err) {
               setError('Failed to load lead details.');
               setLoading(false);
          }
     };

     const handleApprove = async () => {
          setActionLoading(true);
          setActionError(null);
          try {
               await leadApi.approveLead(id);
               await fetchLead();
          } catch (err) {
               setActionError(err.response?.data?.error || 'Failed to approve lead.');
          } finally {
               setActionLoading(false);
          }
     };

     const handleReject = async () => {
          setActionLoading(true);
          setActionError(null);
          try {
               await leadApi.rejectLead(id);
               await fetchLead();
          } catch (err) {
               setActionError(err.response?.data?.error || 'Failed to reject lead.');
          } finally {
               setActionLoading(false);
          }
     };

     const getQualColor = (status) => {
          switch (status?.toUpperCase()) {
               case 'QUALIFIED': return 'badge-qualified';
               case 'REVIEW': return 'badge-review';
               case 'DISQUALIFIED': return 'badge-disqualified';
               default: return 'badge-default';
          }
     };

     const getApprovalColor = (status) => {
          switch (status?.toLowerCase()) {
               case 'approved': return 'badge-approved';
               case 'rejected': return 'badge-rejected';
               case 'pending': return 'badge-pending';
               default: return 'badge-default';
          }
     };

     const getInitials = (name) => {
          if (!name) return 'L';
          return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
     };

     const parseReasons = (reasons) => {
          if (!reasons) return [];
          if (Array.isArray(reasons)) return reasons;
          try { return JSON.parse(reasons); } catch { return [reasons]; }
     };

     if (loading) return (
          <div className="loader-container">
               <div className="loader"></div>
               <p>Loading Lead Profile...</p>
          </div>
     );

     if (error || !lead) return (
          <div className="details-error-container">
               <Building2 size={48} className="error-icon" style={{ color: 'var(--alert-red)' }} />
               <h2 className="error-title">Lead Not Found</h2>
               <p className="error-msg">{error || 'The requested lead could not be found.'}</p>
               <button className="back-link" onClick={() => navigate('/leadDashboard')} style={{ margin: '0 auto' }}>
                    <ArrowLeft size={18} /> Back to Pipeline
               </button>
          </div>
     );

     const approval = lead.approval_status?.toUpperCase() ?? '';
     const isActioned = approval === 'APPROVED' || approval === 'REJECTED';
     const reasons = parseReasons(lead.qualification_reason);

     return (
          <div className="client-details-container">
               <div className="details-header">
                    <button className="back-link" onClick={() => navigate('/leadDashboard')}>
                         <ArrowLeft size={18} /> Back to Pipeline
                    </button>
                    <div className="header-meta">
                         Lead Ref: {lead.lead_id}
                    </div>
               </div>

               <div className="details-grid">
                    {/* Main card */}
                    <div className="details-card">
                         <div className="card-header-accent"></div>
                         <div className="card-content">
                              <div className="profile-section">
                                   <div className="profile-avatar">{getInitials(lead.business_name)}</div>
                                   <div className="profile-info">
                                        <h1>{lead.business_name}</h1>
                                        <div className="status-row">
                                             <span className={`status-badge ${getQualColor(lead.qualification_status)}`}>
                                                  {lead.qualification_status || '—'}
                                             </span>
                                             <span className={`status-badge ${getApprovalColor(lead.approval_status)}`}>
                                                  {lead.approval_status || '—'}
                                             </span>
                                        </div>
                                   </div>
                              </div>

                              {/* Business Info */}
                              <div className="info-section">
                                   <h3><Building2 size={18} /> Business Details</h3>
                                   <div className="info-grid">
                                        <div className="info-item">
                                             <div className="info-label">Owner</div>
                                             <div className="info-value">
                                                  <User size={16} style={{ color: 'var(--text-secondary)' }} />
                                                  {lead.owner_name || '—'}
                                             </div>
                                        </div>
                                        <div className="info-item">
                                             <div className="info-label">Phone</div>
                                             <div className="info-value">
                                                  <Phone size={16} style={{ color: 'var(--text-secondary)' }} />
                                                  {lead.phone || '—'}
                                             </div>
                                        </div>
                                        <div className="info-item">
                                             <div className="info-label">Source</div>
                                             <div className="info-value">
                                                  <Activity size={16} style={{ color: 'var(--text-secondary)' }} />
                                                  {lead.source || '—'}
                                             </div>
                                        </div>
                                        <div className="info-item">
                                             <div className="info-label">Created At</div>
                                             <div className="info-value">
                                                  <Clock size={16} style={{ color: 'var(--text-secondary)' }} />
                                                  {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : '—'}
                                             </div>
                                        </div>
                                        <div className="info-item full-width">
                                             <div className="info-label">Address</div>
                                             <div className="info-value">
                                                  <MapPin size={16} style={{ color: 'var(--text-secondary)', alignSelf: 'flex-start', marginTop: '4px' }} />
                                                  <span style={{ lineHeight: '1.4' }}>{lead.address || '—'}</span>
                                             </div>
                                        </div>
                                   </div>
                              </div>

                              {/* Qualification */}
                              <div className="info-section">
                                   <h3><Star size={18} /> Qualification Score</h3>
                                   <div className="info-grid">
                                        <div className="info-item">
                                             <div className="info-label">Lead Score</div>
                                             <div className="info-value">
                                                  <span className="score-chip-lg">{lead.lead_score ?? '—'}</span>
                                             </div>
                                        </div>
                                        <div className="info-item">
                                             <div className="info-label">Qualification Status</div>
                                             <div className="info-value">
                                                  <span className={`status-badge ${getQualColor(lead.qualification_status)}`}>
                                                       {lead.qualification_status || '—'}
                                                  </span>
                                             </div>
                                        </div>
                                        {reasons.length > 0 && (
                                             <div className="info-item full-width">
                                                  <div className="info-label">Qualification Reasons</div>
                                                  <ul className="reasons-list">
                                                       {reasons.map((r, i) => (
                                                            <li key={i}>{r}</li>
                                                       ))}
                                                  </ul>
                                             </div>
                                        )}
                                   </div>
                              </div>
                         </div>
                    </div>

                    {/* Sidebar */}
                    <div className="sidebar-panel">
                         <div className="action-card">
                              <h4>Lead Actions</h4>
                              <p>
                                   {isActioned
                                        ? `This lead has been ${lead.approval_status}. No further actions available.`
                                        : 'Approve to convert this lead into a client, or reject to close it.'}
                              </p>

                              {actionError && (
                                   <div className="dashboard-error" style={{ marginBottom: '16px' }}>
                                        {actionError}
                                   </div>
                              )}

                              <button
                                   id={`approve-detail-btn-${lead.lead_id}`}
                                   className="primary-action-btn approve-action-btn"
                                   onClick={handleApprove}
                                   disabled={isActioned || actionLoading}
                                   style={{ marginBottom: '12px' }}
                              >
                                   <CheckCircle size={16} style={{ display: 'inline', marginRight: '8px' }} />
                                   Approve Lead
                              </button>

                              <button
                                   id={`reject-detail-btn-${lead.lead_id}`}
                                   className="primary-action-btn reject-action-btn"
                                   onClick={handleReject}
                                   disabled={isActioned || actionLoading}
                              >
                                   <XCircle size={16} style={{ display: 'inline', marginRight: '8px' }} />
                                   Reject Lead
                              </button>
                         </div>
                    </div>
               </div>
          </div>
     );
};

export default LeadDetails;
