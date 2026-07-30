import React, { useState, useEffect, useMemo } from 'react';
import { Search, Layers, ArrowUpDown, CheckCircle, XCircle, Filter, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as leadApi from '../apis/leadApi';
import './LeadDashboard.css';

const QUAL_FILTERS = ['ALL', 'QUALIFIED', 'REVIEW', 'DISQUALIFIED'];
const APPROVAL_FILTERS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED'];

const normalizeStatus = (status) => status?.toUpperCase() ?? '';

const isLeadActioned = (status) => {
     const s = normalizeStatus(status);
     return s === 'APPROVED' || s === 'REJECTED';
};

const LeadDashboard = () => {
     const navigate = useNavigate();
     const [leads, setLeads] = useState([]);
     const [searchTerm, setSearchTerm] = useState('');
     const [qualFilter, setQualFilter] = useState('ALL');
     const [approvalFilter, setApprovalFilter] = useState('ALL');
     const [typeFilter, setTypeFilter] = useState('ALL');
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
     const [actionError, setActionError] = useState(null);

     useEffect(() => {
          fetchLeads();
     }, []);

     const fetchLeads = async () => {
          try {
               setLoading(true);
               const data = await leadApi.getLeads();
               setLeads(data);
               setLoading(false);
          } catch (err) {
               setError('Failed to load lead data.');
               setLoading(false);
          }
     };

     const handleDiscoverLeads = async () => {
          try {
               setLoading(true);
               await leadApi.discoverLeads();
               await fetchLeads();
          } catch (err) {
               setError(
                    err.response?.data?.error ||
                    'Failed to discover leads.'
               );
          } finally {
               setLoading(false);
          }
     };

     const handleApprove = async (e, id) => {
          e.stopPropagation();
          setActionError(null);
          try {
               await leadApi.approveLead(id);
               await fetchLeads();
          } catch (err) {
               setActionError(err.response?.data?.error || 'Failed to approve lead.');
          }
     };

     const handleReject = async (e, id) => {
          e.stopPropagation();
          setActionError(null);
          try {
               await leadApi.rejectLead(id);
               await fetchLeads();
          } catch (err) {
               setActionError(err.response?.data?.error || 'Failed to reject lead.');
          }
     };

     const getQualColor = (status) => {
          switch (normalizeStatus(status)) {
               case 'QUALIFIED': return 'badge-qualified';
               case 'REVIEW': return 'badge-review';
               case 'DISQUALIFIED': return 'badge-disqualified';
               default: return 'badge-default';
          }
     };

     const getApprovalColor = (status) => {
          switch (normalizeStatus(status)) {
               case 'APPROVED': return 'badge-approved';
               case 'REJECTED': return 'badge-rejected';
               case 'PENDING': return 'badge-pending';
               default: return 'badge-default';
          }
     };

     const getQualActiveClass = (filter) => {
          switch (filter) {
               case 'QUALIFIED': return 'badge-qualified-active';
               case 'REVIEW': return 'badge-review-active';
               case 'DISQUALIFIED': return 'badge-disqualified-active';
               default: return '';
          }
     };

     const getApprovalActiveClass = (filter) => {
          switch (filter) {
               case 'APPROVED': return 'badge-approved-active';
               case 'REJECTED': return 'badge-rejected-active';
               case 'PENDING': return 'badge-pending-active';
               default: return '';
          }
     };

     const clientTypes = useMemo(() => {
          const types = [...new Set(leads.map(l => l.client_type).filter(Boolean))].sort();
          return ['ALL', ...types];
     }, [leads]);

     const qualCounts = useMemo(() => {
          const counts = { ALL: leads.length };
          QUAL_FILTERS.slice(1).forEach(f => {
               counts[f] = leads.filter(l => normalizeStatus(l.qualification_status) === f).length;
          });
          return counts;
     }, [leads]);

     const approvalCounts = useMemo(() => {
          const counts = { ALL: leads.length };
          APPROVAL_FILTERS.slice(1).forEach(f => {
               counts[f] = leads.filter(l => normalizeStatus(l.approval_status) === f).length;
          });
          return counts;
     }, [leads]);

     const typeCounts = useMemo(() => {
          const counts = { ALL: leads.length };
          clientTypes.slice(1).forEach(t => {
               counts[t] = leads.filter(l => l.client_type === t).length;
          });
          return counts;
     }, [leads, clientTypes]);

     const matchesSearch = (lead) => {
          const term = searchTerm.toLowerCase().trim();
          if (!term) return true;
          return (
               lead.business_name?.toLowerCase().includes(term) ||
               lead.owner_name?.toLowerCase().includes(term) ||
               lead.phone?.toLowerCase().includes(term)
          );
     };

     const filtered = leads.filter(lead => {
          const matchSearch = matchesSearch(lead);
          const matchQual = qualFilter === 'ALL' || normalizeStatus(lead.qualification_status) === qualFilter;
          const matchApproval = approvalFilter === 'ALL' || normalizeStatus(lead.approval_status) === approvalFilter;
          const matchType = typeFilter === 'ALL' || lead.client_type === typeFilter;
          return matchSearch && matchQual && matchApproval && matchType;
     });

     const hasActiveFilters = searchTerm || qualFilter !== 'ALL' || approvalFilter !== 'ALL' || typeFilter !== 'ALL';

     const clearFilters = () => {
          setSearchTerm('');
          setQualFilter('ALL');
          setApprovalFilter('ALL');
          setTypeFilter('ALL');
     };

     if (loading) return (
          <div className="loader-container">
               <div className="loader"></div>
               <p>Loading Lead Pipeline...</p>
          </div>
     );

     return (
          <div className="dashboard-container">
               <div className="dashboard-header">
                    <div className="header-title">
                         <Layers size={28} />
                         <div>
                              <h1>Lead Pipeline</h1>
                              <p>Total Leads: {leads.length}</p>
                         </div>
                    </div>
                    <div className="header-actions">
                         <div className="search-wrapper">
                              <Search size={18} className="search-icon" />
                              <input
                                   type="text"
                                   placeholder="Search name, owner, or phone..."
                                   value={searchTerm}
                                   onChange={(e) => setSearchTerm(e.target.value)}
                              />
                         </div>
                         <button className="refresh-btn" onClick={handleDiscoverLeads}>
                              <ArrowUpDown size={16} /> sync
                         </button>
                    </div>
               </div>

               <div className="filter-bar">
                    <div className="filter-bar-header">
                         <span className="filter-bar-title">
                              <Filter size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                              Filters
                         </span>
                         <span className="filter-result-count">
                              Showing <strong>{filtered.length}</strong> of <strong>{leads.length}</strong> leads
                         </span>
                         {hasActiveFilters && (
                              <button className="filter-clear-btn" onClick={clearFilters}>
                                   <X size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                                   Clear all
                              </button>
                         )}
                    </div>

                    <div className="filter-groups">
                         <div className="filter-group">
                              <span className="filter-label">Qualification</span>
                              <div className="filter-pills">
                                   {QUAL_FILTERS.map(f => (
                                        <button
                                             key={f}
                                             className={`filter-btn ${qualFilter === f ? `filter-active ${getQualActiveClass(f)}` : ''}`}
                                             onClick={() => setQualFilter(f)}
                                        >
                                             {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
                                             <span className="filter-count">{qualCounts[f] ?? 0}</span>
                                        </button>
                                   ))}
                              </div>
                         </div>

                         <div className="filter-group">
                              <span className="filter-label">Approval</span>
                              <div className="filter-pills">
                                   {APPROVAL_FILTERS.map(f => (
                                        <button
                                             key={f}
                                             className={`filter-btn ${approvalFilter === f ? `filter-active ${getApprovalActiveClass(f)}` : ''}`}
                                             onClick={() => setApprovalFilter(f)}
                                        >
                                             {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
                                             <span className="filter-count">{approvalCounts[f] ?? 0}</span>
                                        </button>
                                   ))}
                              </div>
                         </div>

                         {clientTypes.length > 1 && (
                              <div className="filter-group">
                                   <span className="filter-label">Client Type</span>
                                   <div className="filter-pills">
                                        {clientTypes.map(t => (
                                             <button
                                                  key={t}
                                                  className={`filter-btn ${typeFilter === t ? 'filter-active' : ''}`}
                                                  onClick={() => setTypeFilter(t)}
                                             >
                                                  {t === 'ALL' ? 'All' : t}
                                                  <span className="filter-count">{typeCounts[t] ?? 0}</span>
                                             </button>
                                        ))}
                                   </div>
                              </div>
                         )}
                    </div>
               </div>

               {error && <div className="dashboard-error">{error}</div>}
               {actionError && <div className="dashboard-error">{actionError}</div>}

               <div className="table-container">
                    <table className="client-table">
                         <thead>
                              <tr>
                                   <th>BUSINESS NAME</th>
                                   <th>OWNER</th>
                                   <th>PHONE</th>
                                   <th>SCORE</th>
                                   <th>QUALIFICATION</th>
                                   <th>APPROVAL</th>
                                   <th>TYPE</th>
                                   <th>ACTIONS</th>
                              </tr>
                         </thead>
                         <tbody>
                              {filtered.map((lead) => (
                                   <tr
                                        key={lead.lead_id}
                                        onClick={() => navigate(`/leads/${lead.lead_id}`)}
                                   >
                                        <td className="bold-text">{lead.business_name}</td>
                                        <td>{lead.owner_name}</td>
                                        <td>{lead.phone || '—'}</td>
                                        <td>
                                             <span className="score-chip">{lead.lead_score ?? '—'}</span>
                                        </td>
                                        <td>
                                             <span className={`status-badge ${getQualColor(lead.qualification_status)}`}>
                                                  {lead.qualification_status || '—'}
                                             </span>
                                        </td>
                                        <td>
                                             <span className={`status-badge ${getApprovalColor(lead.approval_status)}`}>
                                                  {lead.approval_status || '—'}
                                             </span>
                                        </td>
                                        <td>{lead.client_type || '—'}</td>
                                        <td onClick={(e) => e.stopPropagation()}>
                                             <div className="action-btns">
                                                  <button
                                                       id={`approve-btn-${lead.lead_id}`}
                                                       className="approve-btn"
                                                       onClick={(e) => handleApprove(e, lead.lead_id)}
                                                       disabled={isLeadActioned(lead.approval_status)}
                                                       title="Approve Lead"
                                                  >
                                                       <CheckCircle size={16} />
                                                  </button>
                                                  <button
                                                       id={`reject-btn-${lead.lead_id}`}
                                                       className="reject-btn"
                                                       onClick={(e) => handleReject(e, lead.lead_id)}
                                                       disabled={isLeadActioned(lead.approval_status)}
                                                       title="Reject Lead"
                                                  >
                                                       <XCircle size={16} />
                                                  </button>
                                             </div>
                                        </td>
                                   </tr>
                              ))}
                         </tbody>
                    </table>
                    {filtered.length === 0 && !loading && (
                         <div className="empty-state">
                              <Search size={48} />
                              <p>{hasActiveFilters ? 'No leads match your current filters.' : 'No leads in the pipeline yet. Click "Discover Leads" to find new prospects.'}</p>
                              {hasActiveFilters && (
                                   <button className="filter-clear-btn" onClick={clearFilters} style={{ marginTop: 16 }}>
                                        Clear filters
                                   </button>
                              )}
                         </div>
                    )}
               </div>
          </div>
     );
};

export default LeadDashboard;
