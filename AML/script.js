let suppliers = [
    {
        name: "Acme Piping Solutions", category: "Piping Components", status: "Approved", materials: ["Carbon Steel", "Stainless Steel", "Alloy Steel"], certification: "ISO 9001, API Spec Q1",
        audits: [
            { date: "2023-05-10", notes: "Annual quality audit completed. Minor findings on documentation control, corrective actions submitted and approved." },
            { date: "2024-05-15", notes: "Follow-up audit. All previous findings closed. Overall performance excellent." }
        ],
        region: "Global", brand: "AcmePipe", facility: "Houston Main Plant", country: "USA",
        addressLine1: "123 Industrial Way", addressLine2: null, addressLine3: null, city: "Houston", state: "TX", postalCode: "77001",
        contactName: "Jane Doe", contactEmail: "jane.doe@acmepiping.com", contactPhone: "+1 (713) 555-0101", website: "https://www.acmepiping.com",
        yearEstablished: 1990, numberOfEmployees: 250, productRange: "Pipes, Fittings, Flanges", notes: "Specializes in custom fabrication.",
        riskAssessmentScore: 2, insuranceExpiryDate: "2025-11-30", preferredSupplier: true, complianceScore: 95, nextAuditDate: "2025-05-15", paymentTerms: "Net 30",
        servicesOffered: "Custom Fabrication, Machining, Testing",
        typicalLeadTime: "4-6 weeks",
        otherQualityCertifications: "API 5L, ASTM A106",
        sustainabilityInitiatives: "Recycling programs in place",
        safetyRecord: "Excellent - No major incidents in 5 years",
        minimumOrderValue: "Negotiable",
        typicalWarrantyPeriod: "1 year",
        exportMarkets: "North America, Europe",
        rdFocus: "Material innovation, stress analysis",
        keyEquipment: "CNC Machines, Welding Robots, Hydrostatic Testers"
    },
    {
        name: "ValveTech Innovations", category: "Valves & Actuation", status: "Approved", materials: ["Cast Iron", "Ductile Iron", "Bronze", "Stainless Steel"], certification: "ISO 9001",
        audits: [{ date: "2024-01-20", notes: "Initial audit successful. High scores in product quality and process control." }],
        region: "Global", brand: "ValveTech", facility: "Odessa HQ", country: "USA",
        addressLine1: "456 Production Blvd", addressLine2: "Suite 100", addressLine3: null, city: "Odessa", state: "TX", postalCode: "79760",
        contactName: "John Smith", contactEmail: "john.smith@valvetech.com", contactPhone: "+1 (432) 555-0102", website: "https://www.valvetech.com",
        yearEstablished: 2005, numberOfEmployees: 180, productRange: "Gate, Globe, Check, Ball Valves", notes: "Known for innovative actuator designs.",
        riskAssessmentScore: 1, insuranceExpiryDate: "2026-01-15", preferredSupplier: true, complianceScore: 98, nextAuditDate: "2026-01-20", paymentTerms: "Net 45",
        servicesOffered: "Valve Repair, Actuator Installation, Technical Support",
        typicalLeadTime: "6-8 weeks",
        otherQualityCertifications: "API Spec 6A",
        sustainabilityInitiatives: "Energy efficiency in manufacturing",
        safetyRecord: "Excellent - Consistent low TRIR",
        minimumOrderValue: "$2000",
        typicalWarrantyPeriod: "18 months",
        exportMarkets: "Global",
        rdFocus: "Smart actuation, fugitive emissions reduction",
        keyEquipment: "Automated Assembly Lines, Testing Benches, Painting Booths"
    },
    {
        name: "Global Fasteners Corp", category: "Fittings & Flanges", status: "Approved", materials: ["Carbon Steel", "Stainless Steel", "Duplex Stainless Steel"], certification: "API Spec 20E",
        audits: [
             { date: "2023-11-01", notes: "Routine check. Processes are compliant, stock levels verified." },
             { date: "2024-11-05", notes: "Annual audit. Minor non-conformance on raw material traceability, action plan agreed." }
        ],
        region: "Global", brand: "GlobalFast", facility: "Tulsa Plant 1", country: "USA",
        addressLine1: "789 Commerce Dr", addressLine2: null, addressLine3: null, city: "Tulsa", state: "OK", postalCode: "74101",
        contactName: "Sarah Lee", contactEmail: "sarah.lee@globalfasteners.com", contactPhone: "+1 (918) 555-0103", website: "https://www.globalfasteners.com",
        yearEstablished: 1985, numberOfEmployees: 300, productRange: "Bolts, Nuts, Studs, Gaskets", notes: "Large stock of standard and custom fasteners.",
        riskAssessmentScore: 2, insuranceExpiryDate: "2025-10-31", preferredSupplier: true, complianceScore: 92, nextAuditDate: "2025-11-05", paymentTerms: "Net 30",
        servicesOffered: "Custom Threading, Material Testing, Kitting",
        typicalLeadTime: "Standard Stock: 1-2 days; Custom: 3-5 weeks",
        otherQualityCertifications: "ASTM",
        sustainabilityInitiatives: "Waste reduction focus",
        safetyRecord: "Good - Minor incidents handled effectively",
        minimumOrderValue: "$500",
        typicalWarrantyPeriod: "6 months",
        exportMarkets: "North America",
        rdFocus: "Corrosion resistance, high-strength materials",
        keyEquipment: "Forging Presses, Threading Machines, Heat Treatment Furnaces"
    },
    {
        name: "Industrial Seals Ltd.", category: "Gaskets & Sealing Products", status: "Pending", materials: ["PTFE", "Graphite", "Rubber", "Fiber"], certification: "Pending",
        audits: [],
        region: "Global", brand: "InduSeal", facility: "Lafayette Site", country: "USA",
        addressLine1: "321 Sealing Lane", addressLine2: null, addressLine3: null, city: "Lafayette", state: "LA", postalCode: "70501",
        contactName: "Michael Brown", contactEmail: "michael.brown@industrialseals.com", contactPhone: "+1 (337) 555-0104", website: "https://www.industrialseals.com",
        yearEstablished: 2010, numberOfEmployees: 120, productRange: "Flat Gaskets, Spiral Wound, RTJ", notes: "Undergoing initial qualification.",
        riskAssessmentScore: 3, insuranceExpiryDate: "2025-12-01", preferredSupplier: false, complianceScore: 80, nextAuditDate: "Pending", paymentTerms: "Net 60",
        servicesOffered: "Application Engineering, Material Selection Advice",
        typicalLeadTime: "2-4 weeks",
        otherQualityCertifications: "API Spec 6A",
        sustainabilityInitiatives: "Developing sustainable materials",
        safetyRecord: "Needs Improvement",
        minimumOrderValue: "$1000",
        typicalWarrantyPeriod: "Not specified",
        exportMarkets: "North America",
        rdFocus: "High-temperature and high-pressure sealing",
        keyEquipment: "CNC Cutting Tables, Compression Presses, Material Mixers"
    },
    {
        name: "PipeCo Manufacturing", category: "Piping Components", status: "Approved", materials: ["Carbon Steel", "Low-Temp Carbon Steel"], certification: "ISO 9001",
        audits: [{ date: "2024-03-15", notes: "Focus on safety protocols during audit. Findings were minimal." }],
        region: "Global", brand: "PipeCo", facility: "Pittsburgh Mill", country: "USA",
        addressLine1: "654 Steel Rd", addressLine2: null, addressLine3: null, city: "Pittsburgh", state: "PA", postalCode: "15201",
        contactName: "Emily Davis", contactEmail: "emily.davis@pipecomfg.com", contactPhone: "+1 (412) 555-0105", website: "https://www.pipecomfg.com",
        yearEstablished: 1975, numberOfEmployees: 400, productRange: "Seamless & Welded Pipes", notes: "Focus on large diameter pipes.",
        riskAssessmentScore: 2, insuranceExpiryDate: "2026-03-10", preferredSupplier: true, complianceScore: 93, nextAuditDate: "2026-03-15", paymentTerms: "Net 30",
        servicesOffered: "Pipe Coating, End Finishing, Inspection Services", typicalLeadTime: "Varies by order size (6-12 weeks)", otherQualityCertifications: "API 5CT, ASTM A53", sustainabilityInitiatives: "Reduced water usage in processes", safetyRecord: "Excellent - Strong safety culture", minimumOrderValue: "$5000", typicalWarrantyPeriod: "Standard", exportMarkets: "North America", rdFocus: "Advanced welding techniques", keyEquipment: "Rolling Mills, Welding Lines, NDT Equipment"
    },
    {
        name: "Flow Control Systems", category: "Valves & Actuation", status: "Approved", materials: ["Carbon Steel", "Stainless Steel", "API 6A Materials"], certification: "API Spec 6D, ISO 9001",
        audits: [ { date: "2023-09-10", notes: "Performance audit. Calibration procedures reviewed." }, { date: "2024-09-12", notes: "Compliance audit. No significant issues found." } ],
        region: "Global", brand: "FlowCtrl", facility: "Houston Tech Center", country: "USA",
        addressLine1: "987 Valve Ct", addressLine2: null, addressLine3: null, city: "Houston", state: "TX", postalCode: "77002",
        contactName: "David Wilson", contactEmail: "david.wilson@flowcontrol.com", contactPhone: "+1 (713) 555-0106", website: "https://www.flowcontrol.com",
        yearEstablished: 1998, numberOfEmployees: 220, productRange: "Control Valves, Choke Valves", notes: "Supplier for critical applications.",
        riskAssessmentScore: 1, insuranceExpiryDate: "2025-09-01", preferredSupplier: true, complianceScore: 97, nextAuditDate: "2025-09-12", paymentTerms: "Net 45",
        servicesOffered: "Calibration, Field Service, System Integration", typicalLeadTime: "8-10 weeks", otherQualityCertifications: "API Spec 6A", sustainabilityInitiatives: "Designing more efficient valves", safetyRecord: "Excellent", minimumOrderValue: "Negotiable (project dependent)", typicalWarrantyPeriod: "2 years", exportMarkets: "Global", rdFocus: "Digital control, high-pressure resistance", keyEquipment: "Flow Loop Testers, Clean Rooms, Actuator Testing Rigs"
    },
    {
        name: "ConnectALL Fittings", category: "Fittings & Flanges", status: "Approved", materials: ["Forged Carbon Steel", "Stainless Steel"], certification: "ISO 9001",
        audits: [{ date: "2024-07-22", notes: "Supply chain audit. Traceability of materials verified." }],
        region: "Global", brand: "ConnectALL", facility: "Chicago Hub", country: "USA",
        addressLine1: "111 Connect St", addressLine2: null, addressLine3: null, city: "Chicago", state: "IL", postalCode: "60601",
        contactName: "Linda Adams", contactEmail: "linda.adams@connectall.com", contactPhone: "+1 (312) 555-0107", website: "https://www.connectall.com",
        yearEstablished: 2015, numberOfEmployees: 90, productRange: "Forged Fittings, Flanges", notes: "Quick turnaround on standard items.",
        riskAssessmentScore: 2, insuranceExpiryDate: "2026-07-20", preferredSupplier: false, complianceScore: 90, nextAuditDate: "2026-07-22", paymentTerms: "Net 30",
        servicesOffered: "Expedited Service, Inventory Management Support", typicalLeadTime: "1-3 weeks", otherQualityCertifications: "ASTM A105, ASTM A182", sustainabilityInitiatives: "Optimized logistics", safetyRecord: "Good", minimumOrderValue: "$750", typicalWarrantyPeriod: "1 year", exportMarkets: "North America", rdFocus: "New connection types", keyEquipment: "Forging Presses, CNC Machining Centers, Inspection Gauges"
    },
    {
        name: "HydroSeal Gaskets", category: "Gaskets & Sealing Products", status: "Approved", materials: ["Spiral Wound", "Ring Joint", "Sheet Materials"], certification: "ISO 9001",
        audits: [ { date: "2023-06-18", notes: "Initial product inspection audit. Samples passed testing." }, { date: "2024-06-20", notes: "Process audit. Production consistency reviewed." } ],
        region: "Global", brand: "HydroSeal", facility: "Beaumont Plant", country: "USA",
        addressLine1: "222 Seal Ave", addressLine2: null, addressLine3: null, city: "Beaumont", state: "TX", postalCode: "77701",
        contactName: "Robert Jones", contactEmail: "robert.jones@hydroseal.com", contactPhone: "+1 (409) 555-0108", website: "https://www.hydroseal.com",
        yearEstablished: 1995, numberOfEmployees: 150, productRange: "Industrial Gaskets", notes: "Expertise in high-pressure applications.",
        riskAssessmentScore: 1, insuranceExpiryDate: "2025-06-15", preferredSupplier: true, complianceScore: 96, nextAuditDate: "2025-06-20", paymentTerms: "Net 45",
        servicesOffered: "Emergency Orders, Custom Gasket Design", typicalLeadTime: "2-5 days (standard); 1-3 weeks (custom)", otherQualityCertifications: "API Spec 6A", sustainabilityInitiatives: "Reducing material waste", safetyRecord: "Excellent", minimumOrderValue: "$1500", typicalWarrantyPeriod: "1 year", exportMarkets: "North America, Latin America", rdFocus: "Extreme temperature materials, emissions control", keyEquipment: "Automated Cutters, Winding Machines, Material Presses"
    }
];

const supplierCardListDiv = document.getElementById('supplier-card-list');
const supplierTable = document.getElementById('supplier-table'); 
const supplierTableBody = document.querySelector('#supplier-table tbody');
const searchInputCard = document.getElementById('search-input');
const searchInputTable = document.getElementById('search-input-table');

const supplierListView = document.getElementById('supplier-list-view');
const supplierTableView = document.getElementById('supplier-table-view');
const auditView = document.getElementById('audit-view');
const materialsView = document.getElementById('materials-view');
const materialsTableBody = document.querySelector('#materials-table tbody');
const loadingMaterialsP = document.getElementById('loading-materials');
const manufacturersView = document.getElementById('manufacturers-view');
const manufacturersTableBody = document.querySelector('#manufacturers-table tbody');
const loadingManufacturersP = document.getElementById('loading-manufacturers');

const backToListButton = document.getElementById('back-to-list');
const backToListFromMaterialsButton = document.getElementById('back-to-list-from-materials');
const homeLink = document.getElementById('home-link');
const toggleViewButtonCard = document.getElementById('toggle-view-button');
const toggleViewButtonTable = document.getElementById('toggle-view-button-table');
const showMaterialsViewButtonList = document.getElementById('show-materials-view-button-list');
const showMaterialsViewButtonTable = document.getElementById('show-materials-view-button-table');
const toggleExtraColumnsButton = document.getElementById('toggle-extra-columns-button'); 
const exportCsvButtonList = document.getElementById('export-csv-button-list'); 
const exportCsvButtonTable = document.getElementById('export-csv-button-table'); 
const importCsvButtonList = document.getElementById('import-csv-button-list'); 
const importCsvButtonTable = document.getElementById('import-csv-button-table'); 
const showManufacturersViewButtonList = document.getElementById('show-manufacturers-view-button-list');
const showManufacturersViewButtonTable = document.getElementById('show-manufacturers-view-button-table');
const backToListFromMfgButton = document.getElementById('back-to-list-from-mfg');

let displayedSuppliers = [];
let currentView = 'list'; 
let extraColumnsVisible = false;

function showSupplierListView() {
    supplierListView.classList.remove('hidden');
    supplierTableView.classList.add('hidden');
    auditView.classList.add('hidden');
    materialsView.classList.add('hidden');
    manufacturersView.classList.add('hidden');
    currentView = 'list';
    renderSuppliers(displayedSuppliers); 
    searchInputCard.value = searchInputTable.value; 
}

function showSupplierTableView() {
     supplierListView.classList.add('hidden');
     supplierTableView.classList.remove('hidden');
     auditView.classList.add('hidden');
     materialsView.classList.add('hidden');
     manufacturersView.classList.add('hidden');
     currentView = 'table';
     renderTable(displayedSuppliers); 
     searchInputTable.value = searchInputCard.value; 
}

function showAuditView(supplier) {
    supplierListView.classList.add('hidden');
    supplierTableView.classList.add('hidden'); 
    materialsView.classList.add('hidden');
    auditView.classList.remove('hidden');
    manufacturersView.classList.add('hidden');
    document.getElementById('audit-supplier-name').textContent = supplier.name;
    document.getElementById('audit-history-list').innerHTML = supplier.audits.map(audit => `<li><strong>${audit.date}:</strong> ${audit.notes}</li>`).join('');
    document.getElementById('new-audit-date').value = '';
    document.getElementById('new-audit-notes').value = '';
}

function showMaterialsTableView() {
    supplierListView.classList.add('hidden');
    supplierTableView.classList.add('hidden');
    auditView.classList.add('hidden');
    materialsView.classList.remove('hidden');
    manufacturersView.classList.add('hidden');
    currentView = 'materials';
    renderMaterialsTable();
}

function showManufacturersTableView() {
    supplierListView.classList.add('hidden');
    supplierTableView.classList.add('hidden');
    auditView.classList.add('hidden');
    materialsView.classList.add('hidden');
    manufacturersView.classList.remove('hidden');
    currentView = 'manufacturers';
    renderManufacturersTable(displayedSuppliers);
}

function getUniqueMaterials() {
    const uniqueMaterialEntries = new Set();
    const materialsData = [];

    suppliers.forEach(supplier => {
        const group = supplier.category || 'Uncategorized';
        if (supplier.materials && Array.isArray(supplier.materials)) {
            supplier.materials.forEach(material => {
                if (material && typeof material === 'string' && material.trim() !== '') {
                    const materialKey = `${group}|${material.trim()}`;
                    if (!uniqueMaterialEntries.has(materialKey)) {
                        uniqueMaterialEntries.add(materialKey);
                        materialsData.push({ group: group, material: material.trim() });
                    }
                }
            });
        }
    });
    return materialsData.sort((a, b) => { 
        if (a.group < b.group) return -1;
        if (a.group > b.group) return 1;
        if (a.material < b.material) return -1;
        if (a.material > b.material) return 1;
        return 0;
    });
}

function renderMaterialsTable() {
    const uniqueMaterials = getUniqueMaterials();
    materialsTableBody.innerHTML = ''; 
    loadingMaterialsP.classList.remove('hidden');

    if (uniqueMaterials.length === 0) {
        loadingMaterialsP.textContent = 'No materials data available or all materials have been deleted.';
        return;
    }

    loadingMaterialsP.classList.add('hidden');

    uniqueMaterials.forEach(item => {
        const row = materialsTableBody.insertRow();
        row.insertCell().textContent = item.group;
        row.insertCell().textContent = item.material;

        const actionsCell = row.insertCell();
        actionsCell.classList.add('action-buttons');

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('action-button-edit');
        editButton.onclick = () => {
            const newMaterialName = prompt(`Enter new name for material '${item.material}' in group '${item.group}':`, item.material);
            if (newMaterialName !== null) { // prompt returns null if Cancel is clicked
                editMaterial(item.group, item.material, newMaterialName);
            }
        };
        actionsCell.appendChild(editButton);

        const detailsButton = document.createElement('button');
        detailsButton.textContent = 'Details';
        detailsButton.classList.add('action-button-details');
        detailsButton.onclick = () => console.log('Details for material:', item); // Placeholder
        actionsCell.appendChild(detailsButton);
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('action-button-delete');
        deleteButton.onclick = () => {
            if (confirm(`Are you sure you want to delete material '${item.material}' from group '${item.group}'? This will remove it from all suppliers in this group.`)) {
                deleteMaterial(item.group, item.material);
            }
        };
        actionsCell.appendChild(deleteButton);
    });
}

function renderManufacturersTable(manufacturers) {
    manufacturersTableBody.innerHTML = '';
    loadingManufacturersP.classList.remove('hidden');

    if (!manufacturers || manufacturers.length === 0) {
        loadingManufacturersP.textContent = 'No manufacturers found matching your search or criteria.';
        if (suppliers.length > 0 && manufacturers.length === 0 && (searchInputCard.value || searchInputTable.value)) {
             loadingManufacturersP.textContent = 'No manufacturers found matching your search. Try clearing the search.';
        } else if (suppliers.length === 0) {
            loadingManufacturersP.textContent = 'No manufacturers data available.';
        }
        return;
    }
    loadingManufacturersP.classList.add('hidden');

    manufacturers.forEach(supplier => {
        const row = manufacturersTableBody.insertRow();

        const statusClass = supplier.status ? supplier.status.toLowerCase().replace(/\s+/g, '-') : 'na';
        const preferredText = supplier.preferredSupplier === true ? 'Yes' : (supplier.preferredSupplier === false ? 'No' : 'N/A');
        const contactInfo = `${supplier.contactName || ''}${supplier.contactEmail ? ` (${supplier.contactEmail})` : ''}`.trim() || 'N/A';
        const websiteLink = supplier.website ? `<a href="${supplier.website}" target="_blank" rel="noopener noreferrer">${supplier.website}</a>` : 'N/A';
        const complianceScoreText = supplier.complianceScore !== undefined && supplier.complianceScore !== null ? `${supplier.complianceScore}%` : 'N/A';
        const riskScoreText = supplier.riskAssessmentScore !== undefined && supplier.riskAssessmentScore !== null ? `${supplier.riskAssessmentScore}/5` : 'N/A';
        
        row.insertCell().textContent = supplier.name || 'N/A';
        row.insertCell().textContent = supplier.category || 'N/A';
        const statusCell = row.insertCell();
        statusCell.innerHTML = `<span class="status ${statusClass}">${supplier.status || 'N/A'}</span>`;
        row.insertCell().textContent = supplier.region || 'N/A';
        row.insertCell().textContent = supplier.country || 'N/A';
        row.insertCell().textContent = supplier.brand || 'N/A';
        row.insertCell().textContent = supplier.facility || 'N/A';
        row.insertCell().textContent = preferredText;
        row.insertCell().textContent = contactInfo;
        row.insertCell().innerHTML = websiteLink;
        row.insertCell().textContent = complianceScoreText;
        row.insertCell().textContent = riskScoreText;
        row.insertCell().textContent = supplier.nextAuditDate || 'N/A';

        const actionsCell = row.insertCell();
        actionsCell.classList.add('action-buttons');

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('action-button-edit');
        editButton.onclick = (event) => {
            event.stopPropagation();
            editManufacturer(supplier);
        };
        actionsCell.appendChild(editButton);

        const detailsButton = document.createElement('button');
        detailsButton.textContent = 'Details';
        detailsButton.classList.add('action-button-details');
        detailsButton.onclick = (event) => { 
            event.stopPropagation();
            showAuditView(supplier); 
        };
        actionsCell.appendChild(detailsButton);
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('action-button-delete');
        deleteButton.onclick = (event) => {
            event.stopPropagation();
            if (confirm(`Are you sure you want to delete manufacturer '${supplier.name}'?`)) {
                deleteManufacturer(supplier);
            }
        };
        actionsCell.appendChild(deleteButton);
    });
}

function renderSuppliers(filteredSuppliers) {
    supplierCardListDiv.innerHTML = '';
    if (filteredSuppliers.length === 0) {
        supplierCardListDiv.innerHTML = '<p>No suppliers found matching your search.</p>';
        return;
    }

    filteredSuppliers.forEach(supplier => {
        const supplierItem = document.createElement('div');
        supplierItem.classList.add('supplier-item');

        const statusClass = supplier.status ? supplier.status.toLowerCase().replace(/\s+/g, '-') : 'na';
        const materialsList = supplier.materials ? supplier.materials.join(', ') : 'Not specified'; 
        const certificationStatus = supplier.certification || 'Not specified';
        const supplierRegion = supplier.region || 'Not specified';

        const addressLines = [
            supplier.addressLine1,
            supplier.addressLine2,
            supplier.addressLine3
        ].filter(line => line);

        let addressHtml = '';
        if (addressLines.length > 0 || supplier.city || supplier.state || supplier.postalCode) {
            addressHtml = `<p><strong>Address:</strong></p>`;
            addressLines.forEach(line => {
                addressHtml += `<p>${line}</p>`;
            });
            const cityStatePostalParts = [supplier.city, supplier.state, supplier.postalCode].filter(part => part);
            if (cityStatePostalParts.length > 0) {
                addressHtml += `<p>${cityStatePostalParts.join(', ')}</p>`;
            }
        }

        const contactName = supplier.contactName || 'N/A';
        const contactEmail = supplier.contactEmail || 'N/A';
        const contactPhone = supplier.contactPhone || 'N/A';
        const website = supplier.website ? `<a href="${supplier.website}" target="_blank">${supplier.website}</a>` : 'N/A';
        const yearEstablished = supplier.yearEstablished || 'N/A';
        const numberOfEmployees = supplier.numberOfEmployees || 'N/A';
        const productRange = supplier.productRange || 'Not specified';
        const notes = supplier.notes || 'None';
        const riskAssessmentScore = supplier.riskAssessmentScore !== undefined && supplier.riskAssessmentScore !== null ? supplier.riskAssessmentScore : 'N/A'; 
        const insuranceExpiryDate = supplier.insuranceExpiryDate || 'N/A';
        const preferredSupplier = supplier.preferredSupplier !== undefined && supplier.preferredSupplier !== null ? (supplier.preferredSupplier ? 'Yes' : 'No') : 'N/A'; 
        const complianceScore = supplier.complianceScore !== undefined && supplier.complianceScore !== null ? supplier.complianceScore : 'N/A'; 
        const nextAuditDate = supplier.nextAuditDate || 'N/A';
        const paymentTerms = supplier.paymentTerms || 'N/A';

        const servicesOffered = supplier.servicesOffered || 'Not specified';
        const typicalLeadTime = supplier.typicalLeadTime || 'Not specified';
        const otherQualityCertifications = supplier.otherQualityCertifications || 'None specified';
        const sustainabilityInitiatives = supplier.sustainabilityInitiatives || 'None specified';
        const safetyRecord = supplier.safetyRecord || 'Not specified';
        const minimumOrderValue = supplier.minimumOrderValue || 'Not specified';
        const typicalWarrantyPeriod = supplier.typicalWarrantyPeriod || 'Not specified';
        const exportMarkets = supplier.exportMarkets || 'Not specified';
        const rdFocus = supplier.rdFocus || 'Not specified';
        const keyEquipment = supplier.keyEquipment || 'Not specified';

        supplierItem.innerHTML = `
            <h2>${supplier.name || 'Unnamed Supplier'}</h2>
            <p><strong>Category:</strong> ${supplier.category || 'Not specified'}</p>
            <p><strong>Region:</strong> ${supplierRegion}</p>
            <p><strong>Status:</strong> <span class="status ${statusClass}">${supplier.status || 'Not specified'}</span></p>
            <p><strong>Certification:</strong> ${certificationStatus}</p>
            <p><strong>Next Audit:</strong> ${nextAuditDate}</p>
            <p><strong>Preferred Supplier:</strong> ${preferredSupplier}</p>
            <p><strong>Materials:</strong> ${materialsList}</p>

            <h3>Details:</h3>
            ${addressHtml}
            <p><strong>Contact:</strong> ${contactName} (${contactEmail}, ${contactPhone})</p>
            <p><strong>Website:</strong> ${website}</p>
            <p><strong>Established:</strong> ${yearEstablished}</p>
            <p><strong>Employees:</strong> ${numberOfEmployees}</p>
            <p><strong>Product Range:</strong> ${productRange}</p>
            <p><strong>Services Offered:</strong> ${servicesOffered}</p>
            <p><strong>Typical Lead Time:</strong> ${typicalLeadTime}</p>
            <p><strong>Minimum Order Value:</strong> ${minimumOrderValue}</p>
            <p><strong>Typical Warranty Period:</strong> ${typicalWarrantyPeriod}</p>
            <p><strong>Export Markets:</strong> ${exportMarkets}</p>

            <h3>Compliance & Risk:</h3>
            <p><strong>Risk Score:</strong> ${riskAssessmentScore}${riskAssessmentScore !== 'N/A' ? '/5' : ''}</p>
            <p><strong>Compliance Score:</strong> ${complianceScore}${complianceScore !== 'N/A' ? '%' : ''}</p>
            <p><strong>Insurance Expiry:</strong> ${insuranceExpiryDate}</p>
            <p><strong>Payment Terms:</strong> ${paymentTerms}</p>
            <p><strong>Other Quality Certifications:</strong> ${otherQualityCertifications}</p>
            <p><strong>Sustainability Initiatives:</strong> ${sustainabilityInitiatives}</p>
            <p><strong>Safety Record:</strong> ${safetyRecord}</p>
            <p><strong>R&D Focus:</strong> ${rdFocus}</p>
            <p><strong>Key Equipment:</strong> ${keyEquipment}</p>
            <p><strong>Notes:</strong> ${notes}</p>

        `;

        supplierItem.addEventListener('click', () => {
            console.log(`Clicked on ${supplier.name}`);
            showAuditView(supplier);
        });

        supplierCardListDiv.appendChild(supplierItem);
    });
}

function renderTable(filteredSuppliers) {
    supplierTableBody.innerHTML = '';
    if (filteredSuppliers.length === 0) {
        const colSpan = supplierTable.querySelector('thead tr').children.length;
        supplierTableBody.innerHTML = `<tr><td colspan="${colSpan}">No suppliers found matching your search.</td></tr>`;
        return;
    }

    if (extraColumnsVisible) {
        supplierTable.classList.add('show-other-columns');
        toggleExtraColumnsButton.textContent = 'Hide Extra Columns';
    } else {
        supplierTable.classList.remove('show-other-columns');
        toggleExtraColumnsButton.textContent = 'Show Extra Columns';
    }

    filteredSuppliers.forEach(supplier => {
        const tableRow = document.createElement('tr');
        
        const statusClass = supplier.status ? supplier.status.toLowerCase().replace(/\s+/g, '-') : 'na';
        const materialsDisplay = Array.isArray(supplier.materials) ? supplier.materials.join(', ') : (supplier.materials || 'N/A');

        tableRow.innerHTML = `
            <td>${supplier.name || 'N/A'}</td>
            <td>${supplier.category || 'N/A'}</td>
            <td>${materialsDisplay}</td>
            <td><span class="status ${statusClass}">${supplier.status || 'N/A'}</span></td>
            <td>${supplier.region || 'N/A'}</td>
            <td>${supplier.brand || 'N/A'}</td>
            <td>${supplier.facility || 'N/A'}</td>
            <td>${supplier.country || 'N/A'}</td>
            <td>Click row</td> 
        `;

        const certificationStatus = supplier.certification || 'N/A';
        const nextAuditDate = supplier.nextAuditDate || 'N/A';
        const preferredSupplier = supplier.preferredSupplier !== undefined && supplier.preferredSupplier !== null ? (supplier.preferredSupplier ? 'Yes' : 'No') : 'N/A';
        const complianceScore = supplier.complianceScore !== undefined && supplier.complianceScore !== null ? supplier.complianceScore + '%' : 'N/A';
        const riskAssessmentScore = supplier.riskAssessmentScore !== undefined && supplier.riskAssessmentScore !== null ? supplier.riskAssessmentScore + '/5' : 'N/A';
        const contactName = supplier.contactName || 'N/A';
        const contactEmail = supplier.contactEmail || 'N/A';
        const contactPhone = supplier.contactPhone || 'N/A';
        const contactInfo = `${contactName}${contactEmail !== 'N/A' ? ` (${contactEmail})` : ''}${contactPhone !== 'N/A' ? ` (${contactPhone})` : ''}`;
        const website = supplier.website ? `<a href="${supplier.website}" target="_blank" rel="noopener noreferrer">${supplier.website}</a>` : 'N/A';

        tableRow.innerHTML += `
            <td class="col-other">${certificationStatus}</td>
            <td class="col-other">${nextAuditDate}</td>
            <td class="col-other">${preferredSupplier}</td>
            <td class="col-other">${complianceScore}</td>
            <td class="col-other">${riskAssessmentScore}</td>
            <td class="col-other">${contactInfo}</td>
            <td class="col-other">${website}</td>
        `;
        
        tableRow.addEventListener('click', (event) => {
             if (event.target.tagName === 'A') { 
                 return;
             }
             console.log(`Clicked on ${supplier.name}`);
             showAuditView(supplier);
        });

        supplierTableBody.appendChild(tableRow);
    });
}

function escapeCsvValue(value) {
    if (value === null || value === undefined) {
        return '';
    }
    value = String(value);
    if (/[",\n]/.test(value)) {
        return '"' + value.replace(/"/g, '""') + '"';
    }
    return value;
}

function unescapeCsvValue(value) {
    if (value === undefined || value === null) {
        return '';
    }
    value = String(value);
    if (value.startsWith('"') && value.endsWith('"')) {
        return value.substring(1, value.length - 1).replace(/""/g, '"');
    }
    return value;
}

function exportToCsv(data) {
    const headers = [
        "Name", "Category", "Region", "Status", "Certification", "Next Audit",
        "Preferred", "Compliance Score", "Risk Score", "Contact Name", "Contact Email",
        "Contact Phone", "Website", "Address Line 1", "Address Line 2", "Address Line 3",
        "City", "State", "Postal Code", "Year Established", "Number of Employees",
        "Product Range", "Services Offered", "Typical Lead Time", "Minimum Order Value",
        "Typical Warranty Period", "Export Markets", "R&D Focus", "Key Equipment",
        "Other Quality Certifications", "Sustainability Initiatives", "Safety Record",
        "Insurance Expiry Date", "Payment Terms", "Notes", "Materials", "Audit History",
        "Brand", "Facility", "Country"
    ];

    let csvContent = headers.map(escapeCsvValue).join(',') + '\n';

    data.forEach(supplier => {
        const auditHistoryCsv = supplier.audits && supplier.audits.length > 0
            ? supplier.audits.map(audit => `${audit.date}: ${audit.notes.replace(/"/g, '""')}`).join('; ') 
            : '';
         const materialsCsv = supplier.materials && supplier.materials.length > 0
             ? supplier.materials.join('; ') 
             : '';

        const row = [
            supplier.name, supplier.category, supplier.region, supplier.status, supplier.certification, supplier.nextAuditDate,
            supplier.preferredSupplier, supplier.complianceScore, supplier.riskAssessmentScore, supplier.contactName, supplier.contactEmail,
            supplier.contactPhone, supplier.website, supplier.addressLine1, supplier.addressLine2, supplier.addressLine3,
            supplier.city, supplier.state, supplier.postalCode, supplier.yearEstablished, supplier.numberOfEmployees,
            supplier.productRange, supplier.servicesOffered, supplier.typicalLeadTime, supplier.minimumOrderValue,
            supplier.typicalWarrantyPeriod, supplier.exportMarkets, supplier.rdFocus, supplier.keyEquipment,
            supplier.otherQualityCertifications, supplier.sustainabilityInitiatives, supplier.safetyRecord,
            supplier.insuranceExpiryDate, supplier.paymentTerms, supplier.notes,
            materialsCsv, auditHistoryCsv,
            supplier.brand, supplier.facility, supplier.country
        ].map(escapeCsvValue).join(','); 

        csvContent += row + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'mrc_suppliers.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function parseCsv(csvText) {
    const lines = csvText.split(/\r?\n/);
    if (lines.length === 0) return { headers: [], data: [] };

    const rawHeaders = lines[0].replace(/^\uFEFF/, '').split(',');
    const headers = rawHeaders.map(h => unescapeCsvValue(h.trim()));
    
    const dataRows = lines.slice(1).filter(line => line.trim() !== ''); 

    const data = [];
    dataRows.forEach(line => {
        const row = [];
        let inQuote = false;
        let currentField = '';
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];

            if (char === '"') {
                if (inQuote && nextChar === '"') {
                    currentField += '"';
                    i++; 
                } else {
                    inQuote = !inQuote;
                }
            } else if (char === ',' && !inQuote) {
                row.push(currentField);
                currentField = '';
            } else {
                currentField += char;
            }
        }
        row.push(currentField); 

        const unescapedRow = row.map(unescapeCsvValue);

        const supplier = {};
        headers.forEach((header, index) => {
             let rawValue = unescapedRow[index] !== undefined ? unescapedRow[index].trim() : '';
             if (rawValue === 'null') rawValue = null; 

             let key = header
                 .replace(/[^a-zA-Z0-9\s]/g, '') 
                 .replace(/\s(.)/g, (match, group) => group.toUpperCase()) 
                 .replace(/\s/g, '') 
                 .replace(/^(.)/, (match, group) => group.toLowerCase()); 
            
             if (header.toLowerCase() === 'group') key = 'category';
             if (header.toLowerCase() === 'company') key = 'name';
             if (header.toLowerCase() === 'details action') return; 


             if (key === 'preferredSupplier' || key === 'preferred') { 
                 supplier.preferredSupplier = rawValue === null ? null : String(rawValue).toLowerCase() === 'yes' || String(rawValue).toLowerCase() === 'true';
             } else if (['complianceScore', 'riskAssessmentScore', 'yearEstablished', 'numberOfEmployees'].includes(key)) {
                 supplier[key] = rawValue === null || rawValue === '' ? null : Number(rawValue); 
             } else if (key === 'materials') {
                  supplier[key] = rawValue === null || rawValue === '' ? [] : rawValue.split(';').map(item => item.trim()).filter(item => item !== '');
             } else if (key === 'audits' || key === 'auditHistory') { 
                 supplier.audits = []; 
                 if (rawValue !== null && rawValue !== '') {
                     const auditEntries = rawValue.split(';').map(entry => entry.trim()).filter(entry => entry !== '');
                     auditEntries.forEach(entry => {
                         const colonIndex = entry.indexOf(':');
                         if (colonIndex > 0) {
                             const date = entry.substring(0, colonIndex).trim();
                             const notes = entry.substring(colonIndex + 1).trim();
                             supplier.audits.push({ date, notes });
                         } else {
                             supplier.audits.push({ date: 'Invalid Date Format', notes: entry });
                         }
                     });
                 }
             } else {
                 supplier[key] = rawValue === '' ? null : rawValue; 
             }
        });
        supplier.brand = supplier.brand || null;
        supplier.facility = supplier.facility || null;
        supplier.country = supplier.country || null;
        
        if (supplier.name && supplier.name.trim() !== '') { 
            data.push(supplier);
        }
    });

    return { headers, data };
}

function importCsv(file) {
    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const csvText = e.target.result;
            const { headers, data } = parseCsv(csvText);

            const requiredHeaders = ["Name", "Category", "Status"];
            const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));

            if (missingHeaders.length > 0) {
                alert(`Error: Missing required CSV headers: ${missingHeaders.join(', ')}. Please use the Export function to get the correct template.`);
                return;
            }

             const validSuppliers = data.filter(supplier => supplier.name && supplier.name.trim() !== '');

            suppliers = validSuppliers;
            displayedSuppliers = suppliers; 

            if (currentView === 'list') {
                renderSuppliers(displayedSuppliers);
            } else if (currentView === 'table') {
                renderTable(displayedSuppliers);
            } else if (currentView === 'materials') {
                renderMaterialsTable(); 
            } else if (currentView === 'manufacturers') {
                renderManufacturersTable(displayedSuppliers);
            }
            alert(`Successfully imported ${suppliers.length} suppliers.`);

        } catch (error) {
            console.error("Error importing CSV:", error);
            alert("Error importing CSV file. Please check the file format.");
        }
    };

    reader.onerror = () => {
        alert("Error reading file.");
    };

    reader.readAsText(file);
}

function editMaterial(group, oldMaterialName, newMaterialName) {
    if (!newMaterialName || newMaterialName.trim() === "") {
        alert("New material name cannot be empty.");
        return;
    }
    newMaterialName = newMaterialName.trim();

    let modified = false;
    suppliers.forEach(supplier => {
        if (supplier.category === group && supplier.materials && supplier.materials.includes(oldMaterialName)) {
            supplier.materials = supplier.materials.map(m => m === oldMaterialName ? newMaterialName : m);
            // Ensure uniqueness if the new name was already present or if multiple old names map to the same new name
            supplier.materials = [...new Set(supplier.materials)];
            modified = true;
        }
    });

    if (modified) {
        renderMaterialsTable(); // Re-render the materials table to show changes
        // Potentially re-render other views if they depend on this data and are visible
        // For simplicity, we only re-render the current materials table.
        // If other views (supplier list/table) are shown later, they will pick up changes from 'suppliers' array.
        alert(`Material '${oldMaterialName}' in group '${group}' updated to '${newMaterialName}'.`);
    } else {
        alert(`Material '${oldMaterialName}' not found in group '${group}' or no changes made.`);
    }
}

function deleteMaterial(group, materialNameToDelete) {
    let modified = false;
    suppliers.forEach(supplier => {
        if (supplier.category === group && supplier.materials && supplier.materials.includes(materialNameToDelete)) {
            supplier.materials = supplier.materials.filter(m => m !== materialNameToDelete);
            modified = true;
        }
    });

    if (modified) {
        renderMaterialsTable(); // Re-render the materials table
        alert(`Material '${materialNameToDelete}' deleted from group '${group}'.`);
    } else {
        alert(`Material '${materialNameToDelete}' not found in group '${group}'.`);
    }
}

function editManufacturer(manufacturer) {
    // For a simple implementation, we'll just let them edit the name and category
    const newName = prompt(`Enter new name for manufacturer:`, manufacturer.name);
    if (newName !== null && newName.trim() !== '') {
        const newCategory = prompt(`Enter new category for manufacturer:`, manufacturer.category);
        if (newCategory !== null) {
            const index = suppliers.findIndex(s => s === manufacturer);
            if (index !== -1) {
                suppliers[index].name = newName.trim();
                suppliers[index].category = newCategory.trim();
                renderManufacturersTable(displayedSuppliers);
                alert(`Manufacturer updated successfully.`);
            }
        }
    }
}

function deleteManufacturer(manufacturer) {
    const index = suppliers.findIndex(s => s === manufacturer);
    if (index !== -1) {
        suppliers.splice(index, 1);
        displayedSuppliers = displayedSuppliers.filter(s => s !== manufacturer);
        renderManufacturersTable(displayedSuppliers);
        alert(`Manufacturer '${manufacturer.name}' deleted successfully.`);
    }
}

displayedSuppliers = suppliers;
renderSuppliers(displayedSuppliers); 

const handleSearch = debounce((event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredSuppliers = suppliers.filter(supplier =>
        Object.values(supplier).some(value => {
            if (value === null || value === undefined) return false;
            if (Array.isArray(value)) {
                return value.some(item => {
                    if (typeof item === 'object' && item !== null) {
                        return Object.values(item).some(nestedValue =>
                             String(nestedValue).toLowerCase().includes(searchTerm)
                        );
                    }
                    return String(item).toLowerCase().includes(searchTerm);
                });
            }
            return String(value).toLowerCase().includes(searchTerm);
        })
    );
    displayedSuppliers = filteredSuppliers;
    if (currentView === 'list') {
        renderSuppliers(filteredSuppliers);
    } else if (currentView === 'table'){
        renderTable(filteredSuppliers);
    }
}, 200);

searchInputCard.addEventListener('input', handleSearch);
searchInputTable.addEventListener('input', handleSearch);

backToListButton.addEventListener('click', showSupplierListView);
backToListFromMaterialsButton.addEventListener('click', showSupplierListView);

homeLink.addEventListener('click', showSupplierListView);

toggleViewButtonCard.addEventListener('click', showSupplierTableView);
toggleViewButtonTable.addEventListener('click', showSupplierListView);
showMaterialsViewButtonList.addEventListener('click', showMaterialsTableView);
showMaterialsViewButtonTable.addEventListener('click', showMaterialsTableView);
showManufacturersViewButtonList.addEventListener('click', showManufacturersTableView);
showManufacturersViewButtonTable.addEventListener('click', showManufacturersTableView);
backToListFromMfgButton.addEventListener('click', showSupplierListView);

toggleExtraColumnsButton.addEventListener('click', () => {
    extraColumnsVisible = !extraColumnsVisible;
    if (currentView === 'table') {
        renderTable(displayedSuppliers); 
    }
});

exportCsvButtonList.addEventListener('click', () => exportToCsv(displayedSuppliers));
exportCsvButtonTable.addEventListener('click', () => exportToCsv(displayedSuppliers));

function setupImportButton(buttonId) {
    document.getElementById(buttonId).addEventListener('click', () => {
        const csvFileInput = document.createElement('input');
        csvFileInput.type = 'file';
        csvFileInput.accept = '.csv';
        csvFileInput.style.display = 'none';
        document.body.appendChild(csvFileInput); 
        csvFileInput.onchange = (event) => { 
            const file = event.target.files[0];
            if (file) {
                importCsv(file);
            }
            csvFileInput.value = ''; 
            document.body.removeChild(csvFileInput); 
        };
        csvFileInput.click();
    });
}

setupImportButton('import-csv-button-list');
setupImportButton('import-csv-button-table');

document.getElementById('save-audit').addEventListener('click', () => {
    const auditDate = document.getElementById('new-audit-date').value;
    const auditNotes = document.getElementById('new-audit-notes').value;
    console.log("Saving new audit:", { date: auditDate, notes: auditNotes });
    alert("Save functionality is a placeholder. Audit not actually saved.");
});

function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}