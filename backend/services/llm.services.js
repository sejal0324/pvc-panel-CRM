async function enrich(leads) {
    return leads.map((lead) => ({
        ...lead,
        summary: `${lead.business_name} appears to be a potential PVC panel reseller.`,
        business_type: lead.business_type || "Retail Shop",
        confidence: 90,
        recommended_products: [
            "PVC Panels",
            "Wall Panels",
            "Ceiling Panels"
        ],
        next_best_step: "Schedule Visit"
    }));
}

async function analyzeClient(client) {

    // Later this becomes Gemini

    return {
        summary:
            `${client.business_name} is a high-potential ${client.client_type.toLowerCase()} in ${client.address}.`,

        potential: "High",

        recommended_products: [
            "PVC Wall Panels",
            "UV Marble Sheets",
            "Decorative Profiles"
        ],

        next_best_step:
            "Schedule a site visit within 3 days.",

        risks:
            "No previous order history.",

        confidence: 91
    };

}



module.exports={enrich,analyzeClient}