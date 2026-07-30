function qualifyLead(leadData) {

    let score = 0;

    let reasons = [];

    if (leadData.business_type === "Retail Shop") {

        score += 40;

        reasons.push("PVC retailer identified.");

    }

    if (leadData.business_type === "Interior Designer") {

        score += 30;

        reasons.push("Interior designer identified.");

    }

    if (leadData.phone) {

        score += 10;

        reasons.push("Phone available.");

    }

    if (leadData.address) {

        score += 10;

        reasons.push("Address available.");

    }

    if (leadData.confidence >= 85) {

        score += 20;

        reasons.push("High AI confidence.");

    }

    let status = "DISCOVERED";

    if (score >= 70) {

        status = "QUALIFIED";

    }

    return {

        lead_score: score,

        qualification_status: status,

        qualification_reason: reasons

    };

}

module.exports = { qualifyLead };
