import React from 'react';
import './AiSalesAssistant.css';

const ANALYSIS_STEPS = [
     'Scanning business profile...',
     'Evaluating market potential...',
     'Matching product recommendations...',
     'Analyzing business...',
];

const AiSpinner = ({ stepIndex = 3 }) => (
     <div className="ai-spinner-card">
          <div className="ai-spinner-glow" />
          <div className="ai-spinner-content">
               <div className="ai-spinner-orbit">
                    <div className="ai-spinner-ring" />
                    <div className="ai-spinner-ring ai-spinner-ring--delay" />
                    <span className="ai-spinner-brain">🧠</span>
               </div>
               <p className="ai-spinner-label">{ANALYSIS_STEPS[stepIndex]}</p>
               <div className="ai-spinner-dots">
                    <span /><span /><span />
               </div>
          </div>
     </div>
);

export default AiSpinner;
