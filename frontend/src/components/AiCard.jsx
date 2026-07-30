import React from 'react';
import {
     Brain,
     TrendingUp,
     Package,
     Compass,
     AlertTriangle,
     Sparkles
} from 'lucide-react';
import './AiSalesAssistant.css';

const getPotentialClass = (potential) => {
     const level = potential?.toLowerCase() ?? '';
     if (level.includes('high')) return 'ai-potential-high';
     if (level.includes('medium') || level.includes('mid')) return 'ai-potential-medium';
     if (level.includes('low')) return 'ai-potential-low';
     return 'ai-potential-default';
};

const AiCard = ({ ai }) => {
     if (!ai) return null;

     const products = Array.isArray(ai.recommended_products)
          ? ai.recommended_products
          : ai.recommended_products
               ? [ai.recommended_products]
               : [];

     return (
          <div className="ai-card">
               <div className="ai-card-shimmer" />
               <div className="ai-card-header">
                    <div className="ai-card-title-row">
                         <span className="ai-card-brain">🧠</span>
                         <div>
                              <h3 className="ai-card-title">AI Sales Assistant</h3>
                              {ai.confidence != null && (
                                   <span className="ai-confidence">
                                        <Sparkles size={12} />
                                        {ai.confidence}% confidence
                                   </span>
                              )}
                         </div>
                    </div>
                    <div className="ai-live-badge">
                         <span className="ai-live-dot" />
                         Live
                    </div>
               </div>

               <div className="ai-sections">
                    <section className="ai-section ai-section--reveal" style={{ animationDelay: '0.1s' }}>
                         <h4><Brain size={16} /> Business Summary</h4>
                         <p>{ai.summary}</p>
                    </section>

                    <section className="ai-section ai-section--reveal" style={{ animationDelay: '0.25s' }}>
                         <h4><TrendingUp size={16} /> Potential</h4>
                         <span className={`ai-potential-badge ${getPotentialClass(ai.potential)}`}>
                              {ai.potential}
                         </span>
                    </section>

                    <section className="ai-section ai-section--reveal" style={{ animationDelay: '0.4s' }}>
                         <h4><Package size={16} /> Products</h4>
                         {products.length > 0 ? (
                              <ul className="ai-product-list">
                                   {products.map((product, i) => (
                                        <li key={i} className="ai-product-tag">{product}</li>
                                   ))}
                              </ul>
                         ) : (
                              <p className="ai-empty">No product recommendations yet.</p>
                         )}
                    </section>

                    <section className="ai-section ai-section--reveal" style={{ animationDelay: '0.55s' }}>
                         <h4><Compass size={16} /> Next Best Step</h4>
                         <p className="ai-next-step">{ai.next_best_step}</p>
                    </section>

                    <section className="ai-section ai-section--reveal ai-section--risk" style={{ animationDelay: '0.7s' }}>
                         <h4><AlertTriangle size={16} /> Risk</h4>
                         <p>{ai.risks || 'No significant risks identified.'}</p>
                    </section>
                    
               </div>
               <div className="details-card">

</div>
          </div>
     );
};

export default AiCard;
