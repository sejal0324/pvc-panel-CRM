async function discover(zoneName) {

    const rawData = await search(zoneName);

    const structuredLeads = await normalise(rawData);

    const enrichedLeads = await enrich(structuredLeads);

    return enrichedLeads;
}

async function search(zoneName) {

    return [

        {
            name: "Modern PVC House",
            owner: "Amit Shah",
            phone: "9876543211",
            address: `${zoneName}, Pune`,
            type: "Retail Shop"
        },

        {
            name: "ABC Interiors",
            owner: "Rahul Patil",
            phone: "9876543212",
            address: `${zoneName}, Pune`,
            type: "Interior Designer"
        },

        {
            name: "Shree Decor Studio",
            owner: "Neha Kulkarni",
            phone: "9876543213",
            address: `${zoneName}, Pune`,
            type: "Interior Designer"
        },

        {
            name: "Classic Hardware",
            owner: "Rakesh Jain",
            phone: "9876543214",
            address: `${zoneName}, Pune`,
            type: "Retail Shop"
        },

        {
            name: "Elite False Ceiling",
            owner: "Vivek Patil",
            phone: "9876543215",
            address: `${zoneName}, Pune`,
            type: "Interior Designer"
        }

    ];

}

async function normalise(rawData) {

    return rawData.map((lead) => ({

        business_name: lead.name,

        owner_name: lead.owner,

        phone: lead.phone,

        address: lead.address,

        business_type: lead.type

    }));

}

async function enrich(leads) {

    return leads.map((lead) => {

        let summary = "";
        let products = [];
        let nextBestStep = "";
        let confidence = 80;

        if (lead.business_type === "Retail Shop") {

            summary =
                "Established PVC and building material retailer with strong potential for repeat wholesale orders.";

            products = [
                "PVC Wall Panels",
                "Ceiling Panels",
                "PVC Adhesive"
            ];

            nextBestStep = "Schedule Visit";

            confidence = 92;

        } else {

            summary =
                "Interior design business likely to recommend PVC panels for residential and commercial projects.";

            products = [
                "Premium PVC Panels",
                "UV Marble Sheets",
                "Decorative Profiles"
            ];

            nextBestStep = "Schedule Follow-up Call";

            confidence = 88;

        }

        return {

            ...lead,

            summary,

            confidence,

            recommended_products: products,

            next_best_step: nextBestStep,

            source: "AI_DISCOVERY_ENGINE"

        };

    });

}

module.exports = {
    discover
};