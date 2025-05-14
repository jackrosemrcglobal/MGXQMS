document.addEventListener('DOMContentLoaded', function() {
    // Set the current date for the initial revision date and other dates
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    
    // Set default dates
    document.getElementById('revisionDate').value = formattedDate;
    document.getElementById('initialDate').textContent = formattedDate;
    document.getElementById('effectiveDate').value = formattedDate;
    document.getElementById('lastReviewDate').value = formattedDate;
    
    // Set next review date to one year from now
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);
    document.getElementById('nextReviewDate').value = nextYear.toISOString().split('T')[0];

    // Set initial document ID and title
    document.getElementById('initialDocId').textContent = document.getElementById('docNumber').value || 'QP-001';
    document.getElementById('initialDocTitle').textContent = document.querySelector('.document-title h1').textContent;

    // Update initial doc ID when document number changes
    document.getElementById('docNumber').addEventListener('input', function() {
        document.getElementById('initialDocId').textContent = this.value;
    });

    // Update initial doc title when document title changes
    document.querySelector('.document-title h1').addEventListener('input', function() {
        document.getElementById('initialDocTitle').textContent = this.textContent;
    });

    // Import company logo
    document.getElementById('importLogo').addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = e => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    // Store the logo in localStorage to persist between document types
                    localStorage.setItem('customLogo', event.target.result);
                    
                    // Update the logo in the document
                    const logoImg = document.getElementById('companyLogo');
                    logoImg.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        };
        
        input.click();
    });

    // Check if there's a stored custom logo when the page loads
    if (localStorage.getItem('customLogo')) {
        document.getElementById('companyLogo').src = localStorage.getItem('customLogo');
    }
    
    // Add new section
    document.getElementById('addSection').addEventListener('click', function() {
        const sections = document.querySelectorAll('.section');
        const newSectionNumber = sections.length + 1;
        
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'section';
        
        sectionDiv.innerHTML = `
            <h2><span class="section-number">${newSectionNumber}.</span> <span class="section-title" contenteditable="true">New Section</span></h2>
            <div class="section-content" contenteditable="true">
                Click to edit this section
            </div>
        `;
        
        document.getElementById('documentContent').appendChild(sectionDiv);
        renumberSections();
    });
    
    // Add image
    document.getElementById('addImage').addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = e => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const activeElement = document.activeElement;
                    if (activeElement && activeElement.classList.contains('section-content')) {
                        const img = document.createElement('img');
                        img.src = event.target.result;
                        img.className = 'document-image';
                        activeElement.appendChild(img);
                    } else {
                        alert('Please click in a section content area first to place the image');
                    }
                };
                reader.readAsDataURL(file);
            }
        };
        
        input.click();
    });
    
    // Add change record
    document.getElementById('addChangeRow').addEventListener('click', function() {
        const tbody = document.querySelector('#changeRegister tbody');
        const rows = tbody.querySelectorAll('tr');
        const newRevNum = parseInt(rows[rows.length - 1].cells[3].textContent) + 1;
        const docNumber = document.getElementById('docNumber').value || 'QP-001';
        const docTitle = document.querySelector('.document-title h1').textContent;
        
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td class="select-row edit-control"><input type="checkbox" class="record-checkbox"></td>
            <td contenteditable="true">${docNumber}</td>
            <td contenteditable="true">${docTitle}</td>
            <td contenteditable="true">${String(newRevNum).padStart(2, '0')}</td>
            <td contenteditable="true">${formattedDate}</td>
            <td contenteditable="true">Update description</td>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
        `;
        
        tbody.appendChild(newRow);
    });
    
    // Select all records checkbox
    document.getElementById('selectAllRecords').addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.record-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });
    
    // Delete selected records
    document.getElementById('deleteSelectedRecords').addEventListener('click', function() {
        const selectedCheckboxes = document.querySelectorAll('.record-checkbox:checked');
        
        if (selectedCheckboxes.length === 0) {
            alert('Please select at least one record to delete');
            return;
        }
        
        // Create confirmation dialog
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        
        const dialog = document.createElement('div');
        dialog.className = 'confirmation-dialog';
        dialog.innerHTML = `
            <h4>Confirm Deletion</h4>
            <p>Are you sure you want to delete ${selectedCheckboxes.length} selected record(s)?</p>
            <div class="buttons">
                <button id="cancelDelete">Cancel</button>
                <button id="confirmDelete" class="delete-btn">Delete</button>
            </div>
        `;
        
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
        
        // Handle confirmation
        document.getElementById('confirmDelete').addEventListener('click', function() {
            selectedCheckboxes.forEach(checkbox => {
                const row = checkbox.closest('tr');
                row.remove();
            });
            
            // Close dialog
            overlay.remove();
            dialog.remove();
            
            // Reset select all checkbox
            document.getElementById('selectAllRecords').checked = false;
            
            // Renumber remaining revisions
            renumberRevisions();
        });
        
        // Handle cancel
        document.getElementById('cancelDelete').addEventListener('click', function() {
            overlay.remove();
            dialog.remove();
        });
    });
    
    // Update document button
    document.getElementById('updateDocument').addEventListener('click', function() {
        // Increment revision number
        const revisionField = document.getElementById('revision');
        let revisionNumber = parseInt(revisionField.value || '0');
        revisionNumber++;
        revisionField.value = String(revisionNumber).padStart(2, '0');
        
        // Update revision date to today
        document.getElementById('revisionDate').value = formattedDate;
        
        alert('Document metadata updated. Don\'t forget to publish changes to update the Change Register.');
    });
    
    // Publish changes button
    document.getElementById('publishChanges').addEventListener('click', function() {
        // Get current revision number
        const revisionNumber = document.getElementById('revision').value || '01';
        
        // Get document ID and title
        const documentNumber = document.getElementById('docNumber').value || '';
        const documentTitle = document.querySelector('.document-title h1').textContent;
        
        // Add a new change record to document change register
        const tbody = document.querySelector('#changeRegister tbody');
        const newRow = document.createElement('tr');
        
        newRow.innerHTML = `
            <td class="select-row edit-control"><input type="checkbox" class="record-checkbox"></td>
            <td contenteditable="true">${documentNumber}</td>
            <td contenteditable="true">${documentTitle}</td>
            <td contenteditable="true">${revisionNumber}</td>
            <td contenteditable="true">${formattedDate}</td>
            <td contenteditable="true">Document updated</td>
            <td contenteditable="true">${document.getElementById('owner').value || ''}</td>
            <td contenteditable="true"></td>
        `;
        
        tbody.appendChild(newRow);
        
        // Also add record to master change register
        const documentType = document.getElementById('documentType').value;
        const documentTypeText = document.getElementById('documentType').options[document.getElementById('documentType').selectedIndex].text;
        const author = document.getElementById('owner').value || '';
        
        // Get existing master register or create new one
        let masterRegister = JSON.parse(localStorage.getItem('masterChangeRegister')) || [];
        
        // Add new record
        masterRegister.push({
            documentType: documentTypeText,
            documentNumber: documentNumber,
            documentTitle: documentTitle,
            revision: revisionNumber,
            revisionDate: formattedDate,
            description: 'Document updated',
            author: author,
            approver: ''
        });
        
        // Save updated master register
        localStorage.setItem('masterChangeRegister', JSON.stringify(masterRegister));
        
        alert('Changes published and Change Registers updated');
    });
    
    // Print/Export document
    document.getElementById('printDoc').addEventListener('click', function() {
        window.print();
    });
    
    // Change document type
    document.getElementById('documentType').addEventListener('change', function() {
        const docType = this.value;
        const docTitle = document.querySelector('.document-title h1');
        const docContent = document.getElementById('documentContent');
        
        // Show/hide buttons based on document type
        const buttonsToToggle = ['addSection', 'addImage', 'updateDocument', 'publishChanges'];
        buttonsToToggle.forEach(id => {
            if (docType === 'master-register') {
                document.getElementById(id).style.display = 'none';
            } else {
                document.getElementById(id).style.display = 'inline-block';
            }
        });
        
        // Change document title based on selection
        switch(docType) {
            case 'quality-policy':
                docTitle.textContent = 'Quality Policy';
                loadQualityPolicyTemplate();
                break;
            case 'quality-manual':
                docTitle.textContent = 'Quality Manual';
                loadQualityManualTemplate();
                break;
            case 'procedure':
                docTitle.textContent = 'Procedure';
                loadProcedureTemplate();
                break;
            case 'work-instruction':
                docTitle.textContent = 'Work Instruction';
                loadWorkInstructionTemplate();
                break;
            case 'form':
                docTitle.textContent = 'Form';
                loadFormTemplate();
                break;
            case 'management-review':
                docTitle.textContent = 'Management Review Meeting Minutes';
                loadManagementReviewTemplate();
                break;
            case 'master-register':
                docTitle.textContent = 'Master Document Change Register';
                loadMasterRegisterTemplate();
                break;
            case 'external-internal-issues':
                docTitle.textContent = 'External and Internal Issues';
                loadExternalInternalIssuesTemplate();
                break;
            case 'interested-parties':
                docTitle.textContent = 'Interested Parties Analysis';
                loadInterestedPartiesTemplate();
                break;
            case 'qms-scope':
                docTitle.textContent = 'Scope of Quality Management System';
                loadQMSScopeTemplate();
                break;
            case 'qms-processes':
                docTitle.textContent = 'QMS Processes';
                loadQMSProcessesTemplate();
                break;
            case 'leadership-commitment':
                docTitle.textContent = 'Leadership Commitment';
                loadLeadershipCommitmentTemplate();
                break;
            case 'communicating-quality-policy':
                docTitle.textContent = 'Communicating Quality Policy';
                loadCommunicatingQualityPolicyTemplate();
                break;
            case 'roles-responsibilities':
                docTitle.textContent = 'Roles, Responsibilities and Authorities';
                loadRolesResponsibilitiesTemplate();
                break;
            case 'risks-opportunities':
                docTitle.textContent = 'Risks and Opportunities';
                loadRisksOpportunitiesTemplate();
                break;
            case 'quality-objectives':
                docTitle.textContent = 'Quality Objectives';
                loadQualityObjectivesTemplate();
                break;
            case 'audit-plan':
                docTitle.textContent = 'Audit Plan';
                loadAuditPlanTemplate();
                break;
            case 'audit-report':
                docTitle.textContent = 'Audit Report';
                loadAuditReportTemplate();
                break;
            case 'nonconformity-report':
                docTitle.textContent = 'Nonconformity Report';
                loadNonconformityReportTemplate();
                break;
            case 'corrective-action-request':
                docTitle.textContent = 'Corrective Action Request';
                loadCorrectiveActionRequestTemplate();
                break;
            case 'training-record':
                docTitle.textContent = 'Training Record';
                loadTrainingRecordTemplate();
                break;
            case 'supplier-evaluation':
                docTitle.textContent = 'Supplier Evaluation';
                loadSupplierEvaluationTemplate();
                break;
            case 'calibration-record':
                docTitle.textContent = 'Calibration Record';
                loadCalibrationRecordTemplate();
                break;
            case 'design-development-plan':
                docTitle.textContent = 'Design and Development Plan';
                loadDesignDevelopmentPlanTemplate();
                break;
            case 'customer-feedback-log':
                docTitle.textContent = 'Customer Feedback Log';
                loadCustomerFeedbackLogTemplate();
                break;
        }
        
        // Ensure custom logo persists after changing document type
        if (localStorage.getItem('customLogo')) {
            document.getElementById('companyLogo').src = localStorage.getItem('customLogo');
        }
    });
    
    // Toggle edit mode button
    document.getElementById('toggleEditMode').addEventListener('click', function() {
        const container = document.querySelector('.container');
        container.classList.toggle('view-mode');
        
        // Update button text
        if (container.classList.contains('view-mode')) {
            this.textContent = 'Show Edit Controls';
            this.classList.add('active');
        } else {
            this.textContent = 'Hide Edit Controls';
            this.classList.remove('active');
        }
    });
    
    // Function to renumber sections
    function renumberSections() {
        const sections = document.querySelectorAll('.section');
        sections.forEach((section, index) => {
            const newNumber = index + 1;
            const numberSpan = section.querySelector('.section-number');
            if (numberSpan) {
                numberSpan.textContent = `${newNumber}.`;
            } else {
                // Fallback for old format sections
                const heading = section.querySelector('h2');
                const currentTitle = heading.textContent;
                const titlePart = currentTitle.replace(/^\d+\.?\s*/, '');
                heading.innerHTML = `<span class="section-number">${newNumber}.</span> <span class="section-title" contenteditable="true">${titlePart}</span>`;
            }
        });
    }
    
    // Function to renumber revisions in change register
    function renumberRevisions() {
        const rows = document.querySelectorAll('#changeRegister tbody tr');
        rows.forEach((row, index) => {
            row.cells[3].textContent = String(index + 1).padStart(2, '0');
        });
    }
    
    // Template loaders
    function loadQualityPolicyTemplate() {
        document.getElementById('documentContent').innerHTML = `
            <div class="section">
                <h2><span class="section-number">1.</span> <span class="section-title" contenteditable="true">Purpose</span></h2>
                <div class="section-content" contenteditable="true">
                    This Quality Policy outlines our organization's commitment to quality in all aspects of our operations.
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">2.</span> <span class="section-title" contenteditable="true">Scope</span></h2>
                <div class="section-content" contenteditable="true">
                    This policy applies to all employees, contractors, and activities within our organization.
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">3.</span> <span class="section-title" contenteditable="true">Policy Statement</span></h2>
                <div class="section-content" contenteditable="true">
                    Our organization is committed to:
                    • Meeting or exceeding customer expectations
                    • Complying with all applicable requirements
                    • Continually improving our quality management system
                    • Ensuring employee engagement in quality initiatives
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">4.</span> <span class="section-title" contenteditable="true">Responsibilities</span></h2>
                <div class="section-content" contenteditable="true">
                    All employees are responsible for implementing this policy in their daily work. Management is responsible for providing necessary resources and support.
                </div>
            </div>
        `;
    }
    
    function loadProcedureTemplate() {
        document.getElementById('documentContent').innerHTML = `
            <div class="section">
                <h2><span class="section-number">1.</span> <span class="section-title" contenteditable="true">Purpose</span></h2>
                <div class="section-content" contenteditable="true">
                    This procedure defines the process for...
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">2.</span> <span class="section-title" contenteditable="true">Scope</span></h2>
                <div class="section-content" contenteditable="true">
                    This procedure applies to...
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">3.</span> <span class="section-title" contenteditable="true">Definitions</span></h2>
                <div class="section-content" contenteditable="true">
                    List key terms and definitions here.
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">4.</span> <span class="section-title" contenteditable="true">Responsibilities</span></h2>
                <div class="section-content" contenteditable="true">
                    Define who is responsible for each aspect of this procedure.
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">5.</span> <span class="section-title" contenteditable="true">Procedure Steps</span></h2>
                <div class="section-content" contenteditable="true">
                    Detail the step-by-step process here.
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">6.</span> <span class="section-title" contenteditable="true">Records</span></h2>
                <div class="section-content" contenteditable="true">
                    List records that must be maintained.
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">7.</span> <span class="section-title" contenteditable="true">References</span></h2>
                <div class="section-content" contenteditable="true">
                    List related documents, standards, etc.
                </div>
            </div>
        `;
    }
    
    function loadWorkInstructionTemplate() {
        document.getElementById('documentContent').innerHTML = `
            <div class="section">
                <h2><span class="section-number">1.</span> <span class="section-title" contenteditable="true">Purpose</span></h2>
                <div class="section-content" contenteditable="true">
                    This work instruction describes how to...
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">2.</span> <span class="section-title" contenteditable="true">Materials/Equipment</span></h2>
                <div class="section-content" contenteditable="true">
                    List required tools, materials, and equipment.
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">3.</span> <span class="section-title" contenteditable="true">Safety Requirements</span></h2>
                <div class="section-content" contenteditable="true">
                    List all safety precautions and PPE requirements.
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">4.</span> <span class="section-title" contenteditable="true">Step-by-Step Instructions</span></h2>
                <div class="section-content" contenteditable="true">
                    Provide detailed steps to complete the task.
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">5.</span> <span class="section-title" contenteditable="true">Quality Checks</span></h2>
                <div class="section-content" contenteditable="true">
                    Describe quality checks to be performed.
                </div>
            </div>
        `;
    }
    
    function loadFormTemplate() {
        document.getElementById('documentContent').innerHTML = `
            <div class="section">
                <h2><span class="section-number">1.</span> <span class="section-title" contenteditable="true">Form Information</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>Form Title:</strong> [Enter form title]</p>
                    <p><strong>Purpose:</strong> [Describe form purpose]</p>
                    <p><strong>Instructions:</strong> [Provide any special instructions for completing the form]</p>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">2.</span> <span class="section-title" contenteditable="true">Form Fields</span></h2>
                <div class="section-content" contenteditable="true">
                    Design your form by adding fields, tables, checkboxes, etc. here.
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">3.</span> <span class="section-title" contenteditable="true">Approvals</span></h2>
                <div class="section-content" contenteditable="true">
                    <table style="width:100%; border-collapse: collapse;">
                        <tr>
                            <th style="border:1px solid #ccc; padding:8px;">Role</th>
                            <th style="border:1px solid #ccc; padding:8px;">Name</th>
                            <th style="border:1px solid #ccc; padding:8px;">Signature</th>
                            <th style="border:1px solid #ccc; padding:8px;">Date</th>
                        </tr>
                        <tr>
                            <td style="border:1px solid #ccc; padding:8px;">Prepared by:</td>
                            <td style="border:1px solid #ccc; padding:8px;"></td>
                            <td style="border:1px solid #ccc; padding:8px;"></td>
                            <td style="border:1px solid #ccc; padding:8px;"></td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #ccc; padding:8px;">Reviewed by:</td>
                            <td style="border:1px solid #ccc; padding:8px;"></td>
                            <td style="border:1px solid #ccc; padding:8px;"></td>
                            <td style="border:1px solid #ccc; padding:8px;"></td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #ccc; padding:8px;">Approved by:</td>
                            <td style="border:1px solid #ccc; padding:8px;"></td>
                            <td style="border:1px solid #ccc; padding:8px;"></td>
                            <td style="border:1px solid #ccc; padding:8px;"></td>
                        </tr>
                    </table>
                </div>
            </div>
        `;
    }
    
    // New Management Review Meeting Minutes template
    function loadManagementReviewTemplate() {
        document.getElementById('documentContent').innerHTML = `
            <div class="section">
                <h2><span class="section-number">1.</span> <span class="section-title" contenteditable="true">Meeting Details</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>Date:</strong> [Enter meeting date]</p>
                    <p><strong>Time:</strong> [Enter meeting time]</p>
                    <p><strong>Location:</strong> [Enter meeting location]</p>
                    <p><strong>Chairperson:</strong> [Enter name]</p>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">2.</span> <span class="section-title" contenteditable="true">Attendees</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>Present:</strong> [List of attendees]</p>
                    <p><strong>Apologies:</strong> [List of apologies]</p>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">3.</span> <span class="section-title" contenteditable="true">Previous Meeting Actions</span></h2>
                <div class="section-content" contenteditable="true">
                    <table style="width:100%; border-collapse: collapse;">
                        <tr>
                            <th style="border:1px solid #ccc; padding:8px;">Action Item</th>
                            <th style="border:1px solid #ccc; padding:8px;">Responsible</th>
                            <th style="border:1px solid #ccc; padding:8px;">Due Date</th>
                            <th style="border:1px solid #ccc; padding:8px;">Status</th>
                        </tr>
                        <tr>
                            <td style="border:1px solid #ccc; padding:8px;"></td>
                            <td style="border:1px solid #ccc; padding:8px;"></td>
                            <td style="border:1px solid #ccc; padding:8px;"></td>
                            <td style="border:1px solid #ccc; padding:8px;"></td>
                        </tr>
                    </table>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">4.</span> <span class="section-title" contenteditable="true">Quality Management System Review</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>4.1 Quality Policy and Objectives:</strong> [Discussion and decisions]</p>
                    <p><strong>4.2 Internal/External Audit Results:</strong> [Summary of findings]</p>
                    <p><strong>4.3 Customer Feedback/Complaints:</strong> [Analysis and trends]</p>
                    <p><strong>4.4 Process Performance:</strong> [Key metrics and analysis]</p>
                    <p><strong>4.5 Nonconformities and Corrective Actions:</strong> [Status update]</p>
                    <p><strong>4.6 Resources:</strong> [Current status and future needs]</p>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">5.</span> <span class="section-title" contenteditable="true">Improvement Opportunities</span></h2>
                <div class="section-content" contenteditable="true">
                    <p>[Document identified improvement opportunities and decisions]</p>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">6.</span> <span class="section-title" contenteditable="true">New Action Items</span></h2>
                <div class="section-content" contenteditable="true">
                    <table style="width:100%; border-collapse: collapse;">
                        <tr>
                            <th style="border:1px solid #ccc; padding:8px;">Action Item</th>
                            <th style="border:1px solid #ccc; padding:8px;">Responsible</th>
                            <th style="border:1px solid #ccc; padding:8px;">Due Date</th>
                        </tr>
                        <tr>
                            <td style="border:1px solid #ccc; padding:8px;"></td>
                            <td style="border:1px solid #ccc; padding:8px;"></td>
                            <td style="border:1px solid #ccc; padding:8px;"></td>
                        </tr>
                    </table>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">7.</span> <span class="section-title" contenteditable="true">Next Meeting</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>Date:</strong> [Enter next meeting date]</p>
                    <p><strong>Time:</strong> [Enter next meeting time]</p>
                    <p><strong>Location:</strong> [Enter next meeting location]</p>
                </div>
            </div>
        `;
    }
    
    // New Master Document Change Register template loader
    function loadMasterRegisterTemplate() {
        // Get master register from localStorage or use empty array if none exists
        const masterRegister = JSON.parse(localStorage.getItem('masterChangeRegister')) || [];
        
        // Create an array of unique document types for the filter
        const documentTypes = [...new Set(masterRegister.map(record => record.documentType))];
        const documentTypeOptions = documentTypes.map(type => `<option value="${type}">${type}</option>`).join('');
        
        // Create the template with filters
        let template = `
            <div class="master-register-filters">
                <div class="filter-group">
                    <label for="filterDocType">Document Type:</label>
                    <select id="filterDocType">
                        <option value="">All Types</option>
                        ${documentTypeOptions}
                    </select>
                </div>
                <div class="filter-group">
                    <label for="filterDocNumber">Document Number:</label>
                    <input type="text" id="filterDocNumber" placeholder="Enter doc number...">
                </div>
                <div class="filter-group">
                    <label for="filterDateFrom">Date From:</label>
                    <input type="date" id="filterDateFrom">
                </div>
                <div class="filter-group">
                    <label for="filterDateTo">Date To:</label>
                    <input type="date" id="filterDateTo">
                </div>
                <button id="applyFilters">Apply Filters</button>
                <button id="resetFilters">Reset</button>
            </div>
            
            <div class="master-register-content">
                <table class="master-table" id="masterRegisterTable">
                    <thead>
                        <tr>
                            <th>Document Type</th>
                            <th>Document Number</th>
                            <th>Document Title</th>
                            <th>Revision</th>
                            <th>Revision Date</th>
                            <th>Description</th>
                            <th>Author</th>
                            <th>Approver</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${generateMasterRegisterRows(masterRegister)}
                    </tbody>
                </table>
            </div>
        `;
        
        document.getElementById('documentContent').innerHTML = template;
        
        // Add event listeners for filter buttons
        document.getElementById('applyFilters').addEventListener('click', function() {
            filterMasterRegister();
        });
        
        document.getElementById('resetFilters').addEventListener('click', function() {
            document.getElementById('filterDocType').value = '';
            document.getElementById('filterDocNumber').value = '';
            document.getElementById('filterDateFrom').value = '';
            document.getElementById('filterDateTo').value = '';
            filterMasterRegister();
        });
    }
    
    // Function to generate rows for master register
    function generateMasterRegisterRows(registerData) {
        if (registerData.length === 0) {
            return '<tr><td colspan="8" style="text-align:center">No records found. Publish changes in documents to add records here.</td></tr>';
        }
        
        // Sort by date descending (most recent first)
        registerData.sort((a, b) => new Date(b.revisionDate) - new Date(a.revisionDate));
        
        return registerData.map(record => `
            <tr>
                <td>${record.documentType || ''}</td>
                <td>${record.documentNumber || ''}</td>
                <td>${record.documentTitle || ''}</td>
                <td>${record.revision || ''}</td>
                <td>${record.revisionDate || ''}</td>
                <td>${record.description || ''}</td>
                <td>${record.author || ''}</td>
                <td>${record.approver || ''}</td>
            </tr>
        `).join('');
    }
    
    // Function to filter master register
    function filterMasterRegister() {
        const docType = document.getElementById('filterDocType').value;
        const docNumber = document.getElementById('filterDocNumber').value.toLowerCase();
        const dateFrom = document.getElementById('filterDateFrom').value;
        const dateTo = document.getElementById('filterDateTo').value;
        
        // Get all records from localStorage
        let masterRegister = JSON.parse(localStorage.getItem('masterChangeRegister')) || [];
        
        // Apply filters
        let filteredData = masterRegister;
        
        if (docType) {
            filteredData = filteredData.filter(record => record.documentType === docType);
        }
        
        if (docNumber) {
            filteredData = filteredData.filter(record => 
                record.documentNumber.toLowerCase().includes(docNumber)
            );
        }
        
        if (dateFrom) {
            filteredData = filteredData.filter(record => 
                new Date(record.revisionDate) >= new Date(dateFrom)
            );
        }
        
        if (dateTo) {
            filteredData = filteredData.filter(record => 
                new Date(record.revisionDate) <= new Date(dateTo)
            );
        }
        
        // Update the table with filtered data
        document.querySelector('#masterRegisterTable tbody').innerHTML = 
            generateMasterRegisterRows(filteredData);
    }

    // Add the new Quality Manual template function
    function loadQualityManualTemplate() {
        document.getElementById('documentContent').innerHTML = `
            <div class="section">
                <h2><span class="section-number">1.</span> <span class="section-title" contenteditable="true">Introduction</span></h2>
                <div class="section-content" contenteditable="true">
                    This Quality Manual defines the quality management system implemented at [Company Name] to ensure the consistent delivery of products and services that meet customer, statutory, and regulatory requirements.
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">2.</span> <span class="section-title" contenteditable="true">Company Background</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>2.1 Company Profile</strong></p>
                    <p>[Provide a brief description of the company, its history, and core business activities]</p>
                    
                    <p><strong>2.2 Vision and Mission</strong></p>
                    <p>[State the company's vision and mission statements]</p>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">3.</span> <span class="section-title" contenteditable="true">Context of the Organization</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>3.1 Understanding the Organization and Its Context</strong></p>
                    <p>[Describe external and internal issues relevant to the organization's purpose and strategic direction]</p>
                    
                    <p><strong>3.2 Interested Parties</strong></p>
                    <p>[Identify relevant interested parties and their requirements]</p>
                    
                    <p><strong>3.3 Scope of the Quality Management System</strong></p>
                    <p>[Define the boundaries and applicability of the QMS]</p>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">4.</span> <span class="section-title" contenteditable="true">Quality Management System</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>4.1 General Requirements</strong></p>
                    <p>[Describe the overall approach to establishing, implementing, maintaining, and continually improving the QMS]</p>
                    
                    <p><strong>4.2 Process Approach</strong></p>
                    <p>[Explain how the organization adopts a process approach for its QMS]</p>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">5.</span> <span class="section-title" contenteditable="true">Leadership</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>5.1 Leadership and Commitment</strong></p>
                    <p>[Describe top management's commitment to the QMS]</p>
                    
                    <p><strong>5.2 Quality Policy</strong></p>
                    <p>[Include the organization's quality policy or reference to it]</p>
                    
                    <p><strong>5.3 Organizational Roles, Responsibilities, and Authorities</strong></p>
                    <p>[Define key roles and responsibilities within the QMS]</p>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">6.</span> <span class="section-title" contenteditable="true">Planning</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>6.1 Actions to Address Risks and Opportunities</strong></p>
                    <p>[Describe how the organization addresses risks and opportunities]</p>
                    
                    <p><strong>6.2 Quality Objectives and Planning</strong></p>
                    <p>[Include or reference quality objectives and plans to achieve them]</p>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">7.</span> <span class="section-title" contenteditable="true">Support</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>7.1 Resources</strong></p>
                    <p>[Describe provision of resources, infrastructure, work environment, etc.]</p>
                    
                    <p><strong>7.2 Competence and Awareness</strong></p>
                    <p>[Explain how competence is ensured and awareness is promoted]</p>
                    
                    <p><strong>7.3 Communication</strong></p>
                    <p>[Describe internal and external communication relevant to the QMS]</p>
                    
                    <p><strong>7.4 Documented Information</strong></p>
                    <p>[Explain the document control system]</p>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">8.</span> <span class="section-title" contenteditable="true">Operation</span></h2>
                <div class="section-content" contenteditable="true">
                    <p>[Provide an overview of operational processes or reference to relevant procedures]</p>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">9.</span> <span class="section-title" contenteditable="true">Performance Evaluation</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>9.1 Monitoring, Measurement, Analysis and Evaluation</strong></p>
                    <p>[Describe how performance is monitored and measured]</p>
                    
                    <p><strong>9.2 Internal Audit</strong></p>
                    <p>[Explain the internal audit program]</p>
                    
                    <p><strong>9.3 Management Review</strong></p>
                    <p>[Describe the management review process]</p>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">10.</span> <span class="section-title" contenteditable="true">Improvement</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>10.1 Nonconformity and Corrective Action</strong></p>
                    <p>[Describe how nonconformities are handled and corrective actions implemented]</p>
                    
                    <p><strong>10.2 Continual Improvement</strong></p>
                    <p>[Explain the approach to continual improvement]</p>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">11.</span> <span class="section-title" contenteditable="true">Appendices</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>11.1 Organization Chart</strong></p>
                    <p>[Insert or reference the organization chart]</p>
                    
                    <p><strong>11.2 Process Interaction Map</strong></p>
                    <p>[Insert or reference a process interaction diagram]</p>
                    
                    <p><strong>11.3 List of Procedures</strong></p>
                    <p>[Provide a list of all procedures that support this Quality Manual]</p>
                </div>
            </div>
        `;
    }

    // Add the new External and Internal Issues template function
    function loadExternalInternalIssuesTemplate() {
        document.getElementById('documentContent').innerHTML = `
            <div class="section">
                <h2><span class="section-number">1.</span> <span class="section-title" contenteditable="true">Purpose</span></h2>
                <div class="section-content" contenteditable="true">
                    <p>To identify and analyze external and internal issues that may impact our organization's strategic direction and quality management system.</p>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">2.</span> <span class="section-title" contenteditable="true">External Context Analysis</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>2.1 Political Factors</strong></p>
                    <p>[Describe relevant political environment, regulations, and potential impacts]</p>
                    
                    <p><strong>2.2 Economic Factors</strong></p>
                    <p>[Analyze economic conditions, market trends, financial factors]</p>
                    
                    <p><strong>2.3 Social Factors</strong></p>
                    <p>[Examine social and cultural trends, demographic changes]</p>
                    
                    <p><strong>2.4 Technological Factors</strong></p>
                    <p>[Assess technological developments, innovation trends, potential disruptions]</p>
                    
                    <p><strong>2.5 Legal Factors</strong></p>
                    <p>[Review legal requirements, compliance obligations, regulatory landscape]</p>
                    
                    <p><strong>2.6 Environmental Factors</strong></p>
                    <p>[Evaluate environmental regulations, sustainability challenges]</p>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">3.</span> <span class="section-title" contenteditable="true">Internal Context Analysis</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>3.1 Organizational Structure</strong></p>
                    <p>[Describe current organizational structure, governance, roles]</p>
                    
                    <p><strong>3.2 Resources and Capabilities</strong></p>
                    <p>[Assess current resources, competencies, technological capabilities]</p>
                    
                    <p><strong>3.3 Organizational Knowledge</strong></p>
                    <p>[Evaluate organizational knowledge, expertise, learning mechanisms]</p>
                    
                    <p><strong>3.4 Performance and Culture</strong></p>
                    <p>[Analyze organizational performance, values, culture, attitudes]</p>
                    
                    <p><strong>3.5 Stakeholder Relationships</strong></p>
                    <p>[Review relationships with employees, shareholders, suppliers, customers]</p>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">4.</span> <span class="section-title" contenteditable="true">Risk and Opportunity Assessment</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>4.1 Risk Identification</strong></p>
                    <p>[List and describe potential risks from external and internal contexts]</p>
                    
                    <p><strong>4.2 Opportunity Identification</strong></p>
                    <p>[Identify potential opportunities arising from the contexts]</p>
                    
                    <p><strong>4.3 Mitigation and Exploitation Strategies</strong></p>
                    <p>[Outline strategies to mitigate risks and capitalize on opportunities]</p>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">5.</span> <span class="section-title" contenteditable="true">Continuous Review and Update</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>5.1 Review Frequency</strong></p>
                    <p>[Define how often this analysis will be reviewed and updated]</p>
                    
                    <p><strong>5.2 Review Process</strong></p>
                    <p>[Describe the process for reviewing and updating the context analysis]</p>
                </div>
            </div>
        `;
    }

    // Add the new Interested Parties template function
    function loadInterestedPartiesTemplate() {
        document.getElementById('documentContent').innerHTML = `
            <div class="section">
                <h2><span class="section-number">1.</span> <span class="section-title" contenteditable="true">Purpose</span></h2>
                <div class="section-content" contenteditable="true">
                    <p>To identify, analyze, and manage interested parties relevant to our organization's quality management system.</p>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">2.</span> <span class="section-title" contenteditable="true">Interested Parties Identification</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>2.1 Internal Interested Parties</strong></p>
                    <table style="width:100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="border:1px solid #ccc; padding:8px;">Party</th>
                                <th style="border:1px solid #ccc; padding:8px;">Requirements</th>
                                <th style="border:1px solid #ccc; padding:8px;">Expectations</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">Employees</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">Management</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">Shareholders/Owners</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <p><strong>2.2 External Interested Parties</strong></p>
                    <table style="width:100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="border:1px solid #ccc; padding:8px;">Party</th>
                                <th style="border:1px solid #ccc; padding:8px;">Requirements</th>
                                <th style="border:1px solid #ccc; padding:8px;">Expectations</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">Customers</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">Suppliers</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">Regulators</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">Local Community</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">3.</span> <span class="section-title" contenteditable="true">Requirements Analysis</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>3.1 Requirement Evaluation</strong></p>
                    <p>Detailed analysis of the needs and expectations of each interested party, including potential impacts on the organization.</p>
                    
                    <p><strong>3.2 Compliance and Engagement Strategies</strong></p>
                    <p>Methods for meeting and managing the requirements of identified interested parties.</p>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">4.</span> <span class="section-title" contenteditable="true">Periodic Review</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>4.1 Review Frequency</strong></p>
                    <p>This analysis of interested parties will be reviewed [frequency of review, e.g., annually or when significant changes occur].</p>
                    
                    <p><strong>4.2 Review Process</strong></p>
                    <p>Process for updating the interested parties analysis and requirements:</p>
                    <ul>
                        <li>Identify changes in internal and external context</li>
                        <li>Reassess interested parties</li>
                        <li>Update requirements and expectations</li>
                        <li>Develop new strategies if needed</li>
                    </ul>
                </div>
            </div>
        `;
    }

    // Add the new Scope of QMS template function
    function loadQMSScopeTemplate() {
        document.getElementById('documentContent').innerHTML = `
            <div class="section">
                <h2><span class="section-number">1.</span> <span class="section-title" contenteditable="true">Introduction</span></h2>
                <div class="section-content" contenteditable="true">
                    <p>This document defines the scope of our Quality Management System (QMS), outlining its boundaries, applicability, and strategic context.</p>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">2.</span> <span class="section-title" contenteditable="true">Organizational Context</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>2.1 External Context</strong></p>
                    <p>Brief overview of external factors influencing the QMS scope:</p>
                    <ul>
                        <li>Legal and regulatory environment</li>
                        <li>Industry standards and requirements</li>
                        <li>Market conditions</li>
                        <li>Technological landscape</li>
                    </ul>
                    
                    <p><strong>2.2 Internal Context</strong></p>
                    <p>Description of internal factors determining QMS scope:</p>
                    <ul>
                        <li>Organizational structure</li>
                        <li>Strategic objectives</li>
                        <li>Core competencies</li>
                        <li>Resources and capabilities</li>
                    </ul>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">3.</span> <span class="section-title" contenteditable="true">QMS Boundaries</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>3.1 Included Processes and Activities</strong></p>
                    <p>List of processes and activities included within the QMS:</p>
                    <ul>
                        <li>Product/Service Design</li>
                        <li>Customer Engagement</li>
                        <li>Production/Service Delivery</li>
                        <li>Quality Control</li>
                        <li>Continuous Improvement</li>
                    </ul>
                    
                    <p><strong>3.2 Excluded Processes and Justification</strong></p>
                    <p>Processes not included in the QMS and rationale for exclusion:</p>
                    <ul>
                        <li>[Process Name]: [Justification]</li>
                    </ul>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">4.</span> <span class="section-title" contenteditable="true">Applicability</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>4.1 Departments and Functions</strong></p>
                    <p>Departments and functions covered by the QMS:</p>
                    <ul>
                        <li>Management</li>
                        <li>Sales and Marketing</li>
                        <li>Product Development</li>
                        <li>Manufacturing/Service Delivery</li>
                        <li>Quality Assurance</li>
                        <li>Customer Support</li>
                    </ul>
                    
                    <p><strong>4.2 Physical Locations</strong></p>
                    <p>Geographic locations where the QMS is implemented:</p>
                    <ul>
                        <li>[Main Office Location]</li>
                        <li>[Production/Service Facility Location]</li>
                        <li>[Additional Branches/Sites]</li>
                    </ul>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">5.</span> <span class="section-title" contenteditable="true">Compliance and Standards</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>5.1 Applicable Standards</strong></p>
                    <p>Quality management standards and regulations followed:</p>
                    <ul>
                        <li>ISO 9001:2015</li>
                        <li>[Industry-Specific Standards]</li>
                        <li>[Regulatory Requirements]</li>
                    </ul>
                    
                    <p><strong>5.2 Certification Scope</strong></p>
                    <p>Details of quality management system certification:</p>
                    <ul>
                        <li>Certification Body: [Name]</li>
                        <li>Certification Standard: [Standard]</li>
                        <li>Initial Certification Date: [Date]</li>
                        <li>Current Certification Validity: [Date Range]</li>
                    </ul>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">6.</span> <span class="section-title" contenteditable="true">Scope Review and Updates</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>6.1 Review Frequency</strong></p>
                    <p>The QMS scope will be reviewed:</p>
                    <ul>
                        <li>Annually during management review</li>
                        <li>When significant organizational changes occur</li>
                        <li>In response to changes in external or internal context</li>
                    </ul>
                    
                    <p><strong>6.2 Review Process</strong></p>
                    <p>Process for reviewing and updating the QMS scope:</p>
                    <ol>
                        <li>Assess current organizational context</li>
                        <li>Evaluate effectiveness of existing QMS boundaries</li>
                        <li>Identify potential improvements or changes</li>
                        <li>Update scope documentation</li>
                        <li>Communicate changes to relevant stakeholders</li>
                    </ol>
                </div>
            </div>
        `;
    }

    // Add the new QMS Processes template function
    function loadQMSProcessesTemplate() {
        document.getElementById('documentContent').innerHTML = `
            <div class="section">
                <h2><span class="section-number">1.</span> <span class="section-title" contenteditable="true">Introduction to QMS Processes</span></h2>
                <div class="section-content" contenteditable="true">
                    <p>This document outlines the key processes that form our Quality Management System (QMS), describing their interactions, objectives, and critical inputs and outputs.</p>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">2.</span> <span class="section-title" contenteditable="true">Process Mapping</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>2.1 Overall Process Interaction</strong></p>
                    <p>Diagram or description of how different organizational processes interact and support each other:</p>
                    <ul>
                        <li>Input/Output Relationships</li>
                        <li>Process Sequence and Dependencies</li>
                        <li>Key Organizational Interfaces</li>
                    </ul>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">3.</span> <span class="section-title" contenteditable="true">Core Management Processes</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>3.1 Strategic Planning Process</strong></p>
                    <p>Description of how strategic objectives are set, communicated, and monitored:</p>
                    <ul>
                        <li>Inputs (e.g., market analysis, stakeholder feedback)</li>
                        <li>Process Steps</li>
                        <li>Outputs (e.g., strategic plan, objectives)</li>
                        <li>Key Performance Indicators</li>
                    </ul>
                    
                    <p><strong>3.2 Management Review Process</strong></p>
                    <p>Details of management review meetings, including:</p>
                    <ul>
                        <li>Frequency</li>
                        <li>Participants</li>
                        <li>Agenda Items</li>
                        <li>Decision-Making Mechanism</li>
                    </ul>
                    
                    <p><strong>3.3 Internal Audit Process</strong></p>
                    <p>Description of internal quality audit procedures:</p>
                    <ul>
                        <li>Audit Planning</li>
                        <li>Audit Execution</li>
                        <li>Reporting</li>
                        <li>Corrective Action Tracking</li>
                    </ul>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">4.</span> <span class="section-title" contenteditable="true">Operational Processes</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>4.1 Customer-Related Processes</strong></p>
                    <p>Processes related to customer interaction:</p>
                    <ul>
                        <li>Customer Requirements Determination</li>
                        <li>Customer Communication</li>
                        <li>Product/Service Design and Development</li>
                        <li>Customer Feedback and Satisfaction Management</li>
                    </ul>
                    
                    <p><strong>4.2 Product/Service Realization Processes</strong></p>
                    <p>Key processes for creating and delivering products/services:</p>
                    <ul>
                        <li>Planning</li>
                        <li>Design and Development</li>
                        <li>Purchasing</li>
                        <li>Production/Service Provision</li>
                        <li>Monitoring and Measuring</li>
                    </ul>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">5.</span> <span class="section-title" contenteditable="true">Support Processes</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>5.1 Competence and Training Process</strong></p>
                    <p>How employee competence is managed:</p>
                    <ul>
                        <li>Training Needs Identification</li>
                        <li>Training Planning</li>
                        <li>Training Execution</li>
                        <li>Competence Evaluation</li>
                    </ul>
                    
                    <p><strong>5.2 Document Control Process</strong></p>
                    <p>Management of documented information:</p>
                    <ul>
                        <li>Document Creation</li>
                        <li>Document Review and Approval</li>
                        <li>Document Distribution</li>
                        <li>Document Revision and Control</li>
                    </ul>
                    
                    <p><strong>5.3 Resource Management Process</strong></p>
                    <p>Management of organizational resources:</p>
                    <ul>
                        <li>Infrastructure Maintenance</li>
                        <li>Work Environment Management</li>
                        <li>Measurement Equipment Calibration</li>
                    </ul>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">6.</span> <span class="section-title" contenteditable="true">Improvement Processes</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>6.1 Nonconformity and Corrective Action Process</strong></p>
                    <p>How nonconformities are identified and addressed:</p>
                    <ul>
                        <li>Nonconformity Detection</li>
                        <li>Root Cause Analysis</li>
                        <li>Corrective Action Planning</li>
                        <li>Action Implementation</li>
                        <li>Effectiveness Review</li>
                    </ul>
                    
                    <p><strong>6.2 Continual Improvement Process</strong></p>
                    <p>Mechanisms for ongoing organizational improvement:</p>
                    <ul>
                        <li>Performance Data Collection</li>
                        <li>Analysis of Trends</li>
                        <li>Improvement Opportunity Identification</li>
                        <li>Innovation Encouragement</li>
                    </ul>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">7.</span> <span class="section-title" contenteditable="true">Process Performance Evaluation</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>7.1 Performance Indicators</strong></p>
                    <p>Key performance indicators (KPIs) for monitoring process effectiveness:</p>
                    <ul>
                        <li>Process Efficiency Metrics</li>
                        <li>Quality Metrics</li>
                        <li>Customer Satisfaction Indicators</li>
                        <li>Compliance Metrics</li>
                    </ul>
                    
                    <p><strong>7.2 Monitoring and Measurement</strong></p>
                    <p>Methods and frequency of process performance assessment:</p>
                    <ul>
                        <li>Data Collection Methods</li>
                        <li>Analysis Techniques</li>
                        <li>Reporting Mechanisms</li>
                    </ul>
                </div>
            </div>
        `;
    }

    // Add the new Leadership Commitment template function
    function loadLeadershipCommitmentTemplate() {
        document.getElementById('documentContent').innerHTML = `
            <div class="section">
                <h2><span class="section-number">1.</span> <span class="section-title" contenteditable="true">Introduction</span></h2>
                <div class="section-content" contenteditable="true">
                    <p>This document outlines the leadership's commitment to establishing, implementing, and continually improving our Quality Management System (QMS).</p>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">2.</span> <span class="section-title" contenteditable="true">Leadership Vision and Strategy</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>2.1 Quality Policy Alignment</strong></p>
                    <p>How leadership ensures alignment with and promotes the organization's quality policy:</p>
                    <ul>
                        <li>Communication of quality objectives</li>
                        <li>Personal involvement in QMS implementation</li>
                        <li>Resource allocation for quality initiatives</li>
                    </ul>
                    
                    <p><strong>2.2 Strategic Quality Objectives</strong></p>
                    <p>Leadership's strategic quality objectives and approach:</p>
                    <ul>
                        <li>Long-term quality goals</li>
                        <li>Customer satisfaction targets</li>
                        <li>Continuous improvement strategies</li>
                    </ul>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">3.</span> <span class="section-title" contenteditable="true">Leadership Roles and Responsibilities</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>3.1 Top Management Commitments</strong></p>
                    <p>Specific commitments by top management to the QMS:</p>
                    <ul>
                        <li>Establishing quality policy and objectives</li>
                        <li>Ensuring customer focus</li>
                        <li>Promoting process approach</li>
                        <li>Driving continual improvement</li>
                    </ul>
                    
                    <p><strong>3.2 Organizational Roles and Responsibilities</strong></p>
                    <p>Detailed breakdown of leadership responsibilities across different organizational levels:</p>
                    <table style="width:100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="border:1px solid #ccc; padding:8px;">Leadership Level</th>
                                <th style="border:1px solid #ccc; padding:8px;">Quality-Related Responsibilities</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">CEO/Managing Director</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">Quality Manager</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">Department Heads</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">4.</span> <span class="section-title" contenteditable="true">Resource Commitment</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>4.1 Resource Allocation</strong></p>
                    <p>Leadership's commitment to providing necessary resources for QMS:</p>
                    <ul>
                        <li>Financial resources</li>
                        <li>Human resources and training</li>
                        <li>Infrastructure and technology</li>
                        <li>Support for continuous improvement</li>
                    </ul>
                    
                    <p><strong>4.2 Competence and Awareness</strong></p>
                    <p>Leadership's approach to ensuring organizational competence:</p>
                    <ul>
                        <li>Training and development programs</li>
                        <li>Competence assessment</li>
                        <li>Communication of quality importance</li>
                    </ul>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">5.</span> <span class="section-title" contenteditable="true">Performance Evaluation and Improvement</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>5.1 Management Review</strong></p>
                    <p>How leadership systematically reviews QMS performance:</p>
                    <ul>
                        <li>Frequency of management reviews</li>
                        <li>Review inputs and outputs</li>
                        <li>Decision-making process</li>
                        <li>Tracking of improvement actions</li>
                    </ul>
                    
                    <p><strong>5.2 Continuous Improvement Commitment</strong></p>
                    <p>Leadership's commitment to continual improvement:</p>
                    <ul>
                        <li>Encouraging innovation</li>
                        <li>Establishing improvement mechanisms</li>
                        <li>Celebrating and recognizing improvements</li>
                    </ul>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">6.</span> <span class="section-title" contenteditable="true">Communication and Engagement</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>6.1 Internal Communication</strong></p>
                    <p>How leadership ensures effective communication about quality:</p>
                    <ul>
                        <li>Communication channels</li>
                        <li>Transparency about QMS performance</li>
                        <li>Encouraging bottom-up communication</li>
                    </ul>
                    
                    <p><strong>6.2 External Stakeholder Engagement</strong></p>
                    <p>Leadership's approach to external stakeholder relationships:</p>
                    <ul>
                        <li>Customer engagement strategies</li>
                        <li>Supplier relationship management</li>
                        <li>Regulatory and community interactions</li>
                    </ul>
                </div>
            </div>
        `;
    }

    // Add the new Communicating Quality Policy template function
    function loadCommunicatingQualityPolicyTemplate() {
        document.getElementById('documentContent').innerHTML = `
            <div class="section">
                <h2><span class="section-number">1.</span> <span class="section-title" contenteditable="true">Purpose</span></h2>
                <div class="section-content" contenteditable="true">
                    <p>To effectively communicate the organization's Quality Policy to all stakeholders, ensuring understanding and alignment with our quality objectives.</p>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">2.</span> <span class="section-title" contenteditable="true">Policy Communication Strategy</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>2.1 Internal Communication Methods</strong></p>
                    <ul>
                        <li>Workplace Displays</li>
                        <li>Employee Orientation</li>
                        <li>Training Sessions</li>
                        <li>Internal Communication Channels</li>
                        <li>Performance Management Discussions</li>
                    </ul>
                    
                    <p><strong>2.2 External Communication Approaches</strong></p>
                    <ul>
                        <li>Company Website</li>
                        <li>Marketing Materials</li>
                        <li>Annual Reports</li>
                        <li>Customer Communications</li>
                        <li>Supplier Interactions</li>
                    </ul>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">3.</span> <span class="section-title" contenteditable="true">Quality Policy Text</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>Our Quality Policy:</strong></p>
                    <blockquote>
                        [Insert full quality policy statement here]
                    </blockquote>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">4.</span> <span class="section-title" contenteditable="true">Policy Interpretation</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>4.1 Key Commitments Breakdown</strong></p>
                    <p>Detailed explanation of each commitment in the quality policy:</p>
                    <ul>
                        <li><strong>Customer Satisfaction:</strong> [Explanation]</li>
                        <li><strong>Continuous Improvement:</strong> [Explanation]</li>
                        <li><strong>Compliance:</strong> [Explanation]</li>
                        <li><strong>Employee Engagement:</strong> [Explanation]</li>
                    </ul>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">5.</span> <span class="section-title" contenteditable="true">Implementation Guidance</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>5.1 Individual Responsibilities</strong></p>
                    <p>How each employee can contribute to the quality policy:</p>
                    <ul>
                        <li>Understanding the policy</li>
                        <li>Applying policy principles in daily work</li>
                        <li>Reporting improvement opportunities</li>
                        <li>Maintaining quality standards</li>
                    </ul>
                    
                    <p><strong>5.2 Management Support</strong></p>
                    <p>How management will support policy implementation:</p>
                    <ul>
                        <li>Providing necessary resources</li>
                        <li>Leading by example</li>
                        <li>Recognizing quality achievements</li>
                        <li>Continuous training and development</li>
                    </ul>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">6.</span> <span class="section-title" contenteditable="true">Policy Review and Update</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>6.1 Review Process</strong></p>
                    <p>How and when the quality policy will be reviewed:</p>
                    <ul>
                        <li>Frequency of review</li>
                        <li>Triggers for policy review</li>
                        <li>Stakeholder input process</li>
                        <li>Approval and communication of updates</li>
                    </ul>
                </div>
            </div>
        `;
    }
    
    // Add the new Roles, Responsibilities and Authorities template function
    function loadRolesResponsibilitiesTemplate() {
        document.getElementById('documentContent').innerHTML = `
            <div class="section">
                <h2><span class="section-number">1.</span> <span class="section-title" contenteditable="true">Purpose</span></h2>
                <div class="section-content" contenteditable="true">
                    <p>To define and communicate the organizational structure, roles, responsibilities, and authorities within our Quality Management System (QMS).</p>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">2.</span> <span class="section-title" contenteditable="true">Organizational Structure</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>2.1 Organizational Hierarchy</strong></p>
                    <p>Description of the organizational structure, including reporting lines and key departments.</p>
                    
                    <table style="width:100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="border:1px solid #ccc; padding:8px;">Department/Function</th>
                                <th style="border:1px solid #ccc; padding:8px;">Key Responsibilities</th>
                                <th style="border:1px solid #ccc; padding:8px;">Reporting To</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">Top Management</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;">Board of Directors</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">Quality Manager</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;">CEO/Managing Director</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">Department Heads</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;">Top Management</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">3.</span> <span class="section-title" contenteditable="true">QMS Roles and Responsibilities</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>3.1 Management Representative Responsibilities</strong></p>
                    <ul>
                        <li>Ensuring QMS implementation and maintenance</li>
                        <li>Reporting QMS performance to top management</li>
                        <li>Promoting awareness of customer and regulatory requirements</li>
                    </ul>
                    
                    <p><strong>3.2 Specific Role Responsibilities</strong></p>
                    <table style="width:100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="border:1px solid #ccc; padding:8px;">Role</th>
                                <th style="border:1px solid #ccc; padding:8px;">Specific QMS Responsibilities</th>
                                <th style="border:1px solid #ccc; padding:8px;">Authority Level</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">CEO/Managing Director</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;">Highest Level</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">Quality Manager</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;">Full QMS Authority</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">Department Heads</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;">Departmental Level</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">4.</span> <span class="section-title" contenteditable="true">Communication and Interface</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>4.1 Internal Communication Channels</strong></p>
                    <ul>
                        <li>Regular management meetings</li>
                        <li>Performance review sessions</li>
                        <li>Internal communication platforms</li>
                        <li>Organizational intranet</li>
                    </ul>
                    
                    <p><strong>4.2 Cross-Functional Interfaces</strong></p>
                    <table style="width:100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="border:1px solid #ccc; padding:8px;">Departments</th>
                                <th style="border:1px solid #ccc; padding:8px;">Key Interaction Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">Quality and Operations</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">Sales and Customer Service</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">HR and Training</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">5.</span> <span class="section-title" contenteditable="true">Competence and Training</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>5.1 Competence Requirements</strong></p>
                    <ul>
                        <li>Defining competence criteria for each role</li>
                        <li>Performance evaluation process</li>
                        <li>Identifying training needs</li>
                    </ul>
                    
                    <p><strong>5.2 Training and Development</strong></p>
                    <table style="width:100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="border:1px solid #ccc; padding:8px;">Role/Department</th>
                                <th style="border:1px solid #ccc; padding:8px;">Required Training</th>
                                <th style="border:1px solid #ccc; padding:8px;">Frequency</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">Quality Team</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">Department Heads</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">All Employees</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">6.</span> <span class="section-title" contenteditable="true">Review and Update</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>6.1 Document Review Process</strong></p>
                    <ul>
                        <li>Frequency of review</li>
                        <li>Triggers for update</li>
                        <li>Approval process for changes</li>
                    </ul>
                    
                    <p><strong>6.2 Continuous Improvement</strong></p>
                    <ul>
                        <li>Mechanism for feedback on roles and responsibilities</li>
                        <li>Process for suggesting organizational improvements</li>
                    </ul>
                </div>
            </div>
        `;
    }

    // Add the new Risks and Opportunities template function
    function loadRisksOpportunitiesTemplate() {
        document.getElementById('documentContent').innerHTML = `
            <div class="section">
                <h2><span class="section-number">1.</span> <span class="section-title" contenteditable="true">Purpose</span></h2>
                <div class="section-content" contenteditable="true">
                    <p>To systematically identify, assess, and manage risks and opportunities within our organization's Quality Management System (QMS).</p>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">2.</span> <span class="section-title" contenteditable="true">Risk Assessment Methodology</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>2.1 Risk Identification Process</strong></p>
                    <ul>
                        <li>Sources of risk identification</li>
                        <li>Risk identification techniques</li>
                        <li>Frequency of risk assessment</li>
                    </ul>
                    
                    <p><strong>2.2 Risk Evaluation Criteria</strong></p>
                    <table style="width:100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="border:1px solid #ccc; padding:8px;">Risk Category</th>
                                <th style="border:1px solid #ccc; padding:8px;">Likelihood</th>
                                <th style="border:1px solid #ccc; padding:8px;">Impact</th>
                                <th style="border:1px solid #ccc; padding:8px;">Risk Level</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">Strategic Risks</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">Operational Risks</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">Compliance Risks</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">3.</span> <span class="section-title" contenteditable="true">Identified Risks</span></h2>
                <div class="section-content" contenteditable="true">
                    <table style="width:100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="border:1px solid #ccc; padding:8px;">Risk Description</th>
                                <th style="border:1px solid #ccc; padding:8px;">Category</th>
                                <th style="border:1px solid #ccc; padding:8px;">Likelihood</th>
                                <th style="border:1px solid #ccc; padding:8px;">Impact</th>
                                <th style="border:1px solid #ccc; padding:8px;">Mitigation Strategy</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">4.</span> <span class="section-title" contenteditable="true">Opportunities Assessment</span></h2>
                <div class="section-content" contenteditable="true">
                    <table style="width:100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="border:1px solid #ccc; padding:8px;">Opportunity Description</th>
                                <th style="border:1px solid #ccc; padding:8px;">Category</th>
                                <th style="border:1px solid #ccc; padding:8px;">Potential Impact</th>
                                <th style="border:1px solid #ccc; padding:8px;">Proposed Action</th>
                                <th style="border:1px solid #ccc; padding:8px;">Responsible Party</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">5.</span> <span class="section-title" contenteditable="true">Risk Treatment and Opportunity Implementation</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>5.1 Risk Treatment Strategies</strong></p>
                    <ul>
                        <li>Risk Mitigation</li>
                        <li>Risk Transfer</li>
                        <li>Risk Acceptance</li>
                        <li>Risk Avoidance</li>
                    </ul>
                    
                    <p><strong>5.2 Opportunity Realization Plan</strong></p>
                    <ul>
                        <li>Resource Allocation</li>
                        <li>Timeline for Implementation</li>
                        <li>Performance Indicators</li>
                    </ul>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">6.</span> <span class="section-title" contenteditable="true">Continuous Monitoring and Review</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>6.1 Periodic Review Process</strong></p>
                    <ul>
                        <li>Frequency of risk and opportunity review</li>
                        <li>Triggers for reassessment</li>
                        <li>Update mechanisms</li>
                    </ul>
                    
                    <p><strong>6.2 Reporting and Communication</strong></p>
                    <ul>
                        <li>Risk and opportunity reporting structure</li>
                        <li>Communication channels</li>
                        <li>Stakeholder engagement</li>
                    </ul>
                </div>
            </div>
        `;
    }

    // Add the new Quality Objectives template function
    function loadQualityObjectivesTemplate() {
        document.getElementById('documentContent').innerHTML = `
            <div class="section">
                <h2><span class="section-number">1.</span> <span class="section-title" contenteditable="true">Purpose</span></h2>
                <div class="section-content" contenteditable="true">
                    <p>To define, communicate, and manage the quality objectives that support our organization's strategic direction and Quality Management System (QMS).</p>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">2.</span> <span class="section-title" contenteditable="true">Strategic Alignment</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>2.1 Organizational Context</strong></p>
                    <p>How quality objectives are derived from and aligned with our organization's strategic goals:</p>
                    <ul>
                        <li>Strategic Vision</li>
                        <li>Mission Statement</li>
                        <li>Organizational Values</li>
                    </ul>
                    
                    <p><strong>2.2 Quality Policy Linkage</strong></p>
                    <p>Direct connection between quality objectives and our established quality policy.</p>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">3.</span> <span class="section-title" contenteditable="true">Quality Objectives Framework</span></h2>
                <div class="section-content" contenteditable="true">
                    <table style="width:100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="border:1px solid #ccc; padding:8px;">Objective Category</th>
                                <th style="border:1px solid #ccc; padding:8px;">Specific Objective</th>
                                <th style="border:1px solid #ccc; padding:8px;">Measurable Target</th>
                                <th style="border:1px solid #ccc; padding:8px;">Responsible Party</th>
                                <th style="border:1px solid #ccc; padding:8px;">Timeline</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">Customer Satisfaction</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">Process Efficiency</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">Quality Performance</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">4.</span> <span class="section-title" contenteditable="true">Objective Setting Process</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>4.1 Objective Determination</strong></p>
                    <ul>
                        <li>Input sources</li>
                        <li>Stakeholder consultation</li>
                        <li>Review of previous performance</li>
                        <li>External and internal context consideration</li>
                    </ul>
                    
                    <p><strong>4.2 SMART Criteria</strong></p>
                    <ul>
                        <li>Specific</li>
                        <li>Measurable</li>
                        <li>Achievable</li>
                        <li>Relevant</li>
                        <li>Time-bound</li>
                    </ul>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">5.</span> <span class="section-title" contenteditable="true">Monitoring and Review</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>5.1 Performance Tracking</strong></p>
                    <ul>
                        <li>Key Performance Indicators (KPIs)</li>
                        <li>Measurement methods</li>
                        <li>Reporting frequency</li>
                    </ul>
                    
                    <p><strong>5.2 Objective Review Mechanism</strong></p>
                    <ul>
                        <li>Periodic review meetings</li>
                        <li>Corrective action planning</li>
                        <li>Objective refinement process</li>
                    </ul>
                </div>
            </div>
            
            <div class="section">
                <h2><span class="section-number">6.</span> <span class="section-title" contenteditable="true">Communication and Deployment</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>6.1 Internal Communication</strong></p>
                    <ul>
                        <li>Methods of communicating objectives</li>
                        <li>Cascading objectives across organization</li>
                        <li>Individual goal alignment</li>
                    </ul>
                    
                    <p><strong>6.2 External Sharing</strong></p>
                    <ul>
                        <li>Stakeholder communication approach</li>
                        <li>Transparency in objective reporting</li>
                    </ul>
                </div>
            </div>
        `;
    }

    // Add Audit Plan template
    function loadAuditPlanTemplate() {
        document.getElementById('documentContent').innerHTML = `
            <div class="section">
                <h2><span class="section-number">1.</span> <span class="section-title" contenteditable="true">Purpose</span></h2>
                <div class="section-content" contenteditable="true">
                    <p>To define the plan for conducting [Internal/External] Audit Number [Audit No.].</p>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">2.</span> <span class="section-title" contenteditable="true">Scope</span></h2>
                <div class="section-content" contenteditable="true">
                    <p>The audit will cover [Specify processes, departments, or areas to be audited].</p>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">3.</span> <span class="section-title" contenteditable="true">Objectives</span></h2>
                <div class="section-content" contenteditable="true">
                    <ul>
                        <li>To verify compliance with [Relevant Standards/Requirements, e.g., ISO 9001:2015].</li>
                        <li>To assess the effectiveness of the Quality Management System.</li>
                        <li>To identify opportunities for improvement.</li>
                    </ul>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">4.</span> <span class="section-title" contenteditable="true">Audit Criteria</span></h2>
                <div class="section-content" contenteditable="true">
                    <p>The audit will be conducted against [List applicable documents, e.g., Quality Manual, Procedures, Standards].</p>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">5.</span> <span class="section-title" contenteditable="true">Audit Schedule</span></h2>
                <div class="section-content" contenteditable="true">
                    <table style="width:100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="border:1px solid #ccc; padding:8px;">Date</th>
                                <th style="border:1px solid #ccc; padding:8px;">Time</th>
                                <th style="border:1px solid #ccc; padding:8px;">Activity/Area</th>
                                <th style="border:1px solid #ccc; padding:8px;">Auditor(s)</th>
                                <th style="border:1px solid #ccc; padding:8px;">Auditee(s)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">[Date]</td>
                                <td style="border:1px solid #ccc; padding:8px;">[Time]</td>
                                <td style="border:1px solid #ccc; padding:8px;">Opening Meeting</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                             <tr>
                                <td style="border:1px solid #ccc; padding:8px;">[Date]</td>
                                <td style="border:1px solid #ccc; padding:8px;">[Time]</td>
                                <td style="border:1px solid #ccc; padding:8px;">[Audit Activity]</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">[Date]</td>
                                <td style="border:1px solid #ccc; padding:8px;">[Time]</td>
                                <td style="border:1px solid #ccc; padding:8px;">Closing Meeting</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">6.</span> <span class="section-title" contenteditable="true">Audit Team</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>Lead Auditor:</strong> [Name]</p>
                    <p><strong>Auditor(s):</strong> [Name(s)]</p>
                    <p><strong>Technical Expert(s) (if any):</strong> [Name(s)]</p>
                </div>
            </div>
             <div class="section">
                <h2><span class="section-number">7.</span> <span class="section-title" contenteditable="true">Responsibilities</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>Lead Auditor:</strong> [Responsibilities]</p>
                    <p><strong>Auditors:</strong> [Responsibilities]</p>
                    <p><strong>Auditees:</strong> [Responsibilities, e.g., provide access, information]</p>
                </div>
            </div>
             <div class="section">
                <h2><span class="section-number">8.</span> <span class="section-title" contenteditable="true">Resources</span></h2>
                <div class="section-content" contenteditable="true">
                    <p>[List any specific resources required for the audit, e.g., meeting rooms, documentation access].</p>
                </div>
            </div>
        `;
    }

    // Add Audit Report template
    function loadAuditReportTemplate() {
        document.getElementById('documentContent').innerHTML = `
            <div class="section">
                <h2><span class="section-number">1.</span> <span class="section-title" contenteditable="true">Audit Details</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>Audit Plan Reference:</strong> [Ref No.]</p>
                    <p><strong>Audit Type:</strong> [Internal/External/Supplier]</p>
                    <p><strong>Audit Dates:</strong> [Start Date] to [End Date]</p>
                    <p><strong>Lead Auditor:</strong> [Name]</p>
                    <p><strong>Audit Team:</strong> [Names]</p>
                    <p><strong>Audited Organization/Department:</strong> [Name]</p>
                    <p><strong>Key Auditee Contact(s):</strong> [Names and Titles]</p>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">2.</span> <span class="section-title" contenteditable="true">Executive Summary</span></h2>
                <div class="section-content" contenteditable="true">
                    <p>[Provide a brief overview of the audit scope, objectives, overall findings, and conclusions.]</p>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">3.</span> <span class="section-title" contenteditable="true">Audit Findings</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>3.1 Nonconformities (NCs)</strong></p>
                    <table style="width:100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="border:1px solid #ccc; padding:8px;">NC Ref#</th>
                                <th style="border:1px solid #ccc; padding:8px;">Requirement Clause</th>
                                <th style="border:1px solid #ccc; padding:8px;">Description of Nonconformity</th>
                                <th style="border:1px solid #ccc; padding:8px;">Evidence</th>
                                <th style="border:1px solid #ccc; padding:8px;">Severity (Major/Minor)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                        </tbody>
                    </table>
                    <p><strong>3.2 Observations (OBS) / Opportunities for Improvement (OFI)</strong></p>
                     <table style="width:100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="border:1px solid #ccc; padding:8px;">OBS/OFI Ref#</th>
                                <th style="border:1px solid #ccc; padding:8px;">Area/Process</th>
                                <th style="border:1px solid #ccc; padding:8px;">Description</th>
                                <th style="border:1px solid #ccc; padding:8px;">Recommendation (Optional)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                        </tbody>
                    </table>
                     <p><strong>3.3 Strengths / Good Practices Noted</strong></p>
                     <p>[List any areas of strength or good practices observed during the audit.]</p>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">4.</span> <span class="section-title" contenteditable="true">Audit Conclusion</span></h2>
                <div class="section-content" contenteditable="true">
                    <p>[State the overall conclusion of the audit regarding the effectiveness of the QMS and compliance with requirements.]</p>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">5.</span> <span class="section-title" contenteditable="true">Recommendations</span></h2>
                <div class="section-content" contenteditable="true">
                    <p>[Provide overall recommendations, e.g., for maintaining/improving certification, specific focus areas.]</p>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">6.</span> <span class="section-title" contenteditable="true">Distribution List</span></h2>
                <div class="section-content" contenteditable="true">
                    <p>[List individuals/departments who will receive this report.]</p>
                </div>
            </div>
        `;
    }

    // Add Nonconformity Report template
    function loadNonconformityReportTemplate() {
        document.getElementById('documentContent').innerHTML = `
            <div class="section">
                <h2><span class="section-number">1.</span> <span class="section-title" contenteditable="true">Report Details</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>Nonconformity ID:</strong> [NC-YYYY-NNN]</p>
                    <p><strong>Date Reported:</strong> [Date]</p>
                    <p><strong>Reported By:</strong> [Name/Department]</p>
                    <p><strong>Source of Nonconformity:</strong> [e.g., Internal Audit, Customer Complaint, Process Monitoring]</p>
                    <p><strong>Related Document/Process:</strong> [Document No. or Process Name]</p>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">2.</span> <span class="section-title" contenteditable="true">Description of Nonconformity</span></h2>
                <div class="section-content" contenteditable="true">
                    <p>[Clearly describe the nonconformity, including what was observed and what the requirement is.]</p>
                    <p><strong>Evidence:</strong> [List or attach evidence supporting the nonconformity.]</p>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">3.</span> <span class="section-title" contenteditable="true">Containment / Immediate Actions Taken</span></h2>
                <div class="section-content" contenteditable="true">
                    <p>[Describe any immediate actions taken to contain the nonconformity and prevent further impact.]</p>
                    <p><strong>Action By:</strong> [Name] <strong>Date:</strong> [Date]</p>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">4.</span> <span class="section-title" contenteditable="true">Root Cause Analysis</span></h2>
                <div class="section-content" contenteditable="true">
                    <p>[Detail the root cause analysis performed (e.g., 5 Whys, Fishbone Diagram). Identify the fundamental cause(s).]</p>
                    <p><strong>Analyzed By:</strong> [Name] <strong>Date:</strong> [Date]</p>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">5.</span> <span class="section-title" contenteditable="true">Corrective Action Plan</span></h2>
                <div class="section-content" contenteditable="true">
                    <table style="width:100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="border:1px solid #ccc; padding:8px;">Action Item</th>
                                <th style="border:1px solid #ccc; padding:8px;">Responsible Person</th>
                                <th style="border:1px solid #ccc; padding:8px;">Due Date</th>
                                <th style="border:1px solid #ccc; padding:8px;">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;">Open</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">6.</span> <span class="section-title" contenteditable="true">Verification of Corrective Action Effectiveness</span></h2>
                <div class="section-content" contenteditable="true">
                    <p>[Describe how the effectiveness of the corrective action will be/was verified.]</p>
                    <p><strong>Verified By:</strong> [Name] <strong>Date:</strong> [Date]</p>
                    <p><strong>Result:</strong> [Effective / Not Effective]</p>
                    <p><strong>Comments:</strong> [Any further comments on effectiveness or further actions needed.]</p>
                </div>
            </div>
             <div class="section">
                <h2><span class="section-number">7.</span> <span class="section-title" contenteditable="true">Closure</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>Closed By:</strong> [Name] <strong>Date:</strong> [Date]</p>
                </div>
            </div>
        `;
    }

    // Add Corrective Action Request (CAR) template
    function loadCorrectiveActionRequestTemplate() {
        document.getElementById('documentContent').innerHTML = `
            <div class="section">
                <h2><span class="section-number">1.</span> <span class="section-title" contenteditable="true">CAR Details</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>CAR ID:</strong> [CAR-YYYY-NNN]</p>
                    <p><strong>Date Issued:</strong> [Date]</p>
                    <p><strong>Issued To (Department/Person):</strong> [Name/Department]</p>
                    <p><strong>Issued By:</strong> [Name/Department]</p>
                    <p><strong>Related Nonconformity Report ID (if any):</strong> [NC-ID]</p>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">2.</span> <span class="section-title" contenteditable="true">Description of Nonconformity / Issue Requiring Correction</span></h2>
                <div class="section-content" contenteditable="true">
                    <p>[Describe the problem or nonconformity that requires corrective action. Reference evidence or NCR if applicable.]</p>
                </div>
            </div>
             <div class="section">
                <h2><span class="section-number">3.</span> <span class="section-title" contenteditable="true">Containment Actions (if applicable)</span></h2>
                <div class="section-content" contenteditable="true">
                    <p>[Detail any immediate actions taken to control the issue.]</p>
                    <p><strong>Action By:</strong> [Name] <strong>Date:</strong> [Date]</p>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">4.</span> <span class="section-title" contenteditable="true">Root Cause Analysis</span></h2>
                <div class="section-content" contenteditable="true">
                    <p>[Summarize the root cause(s) identified. Attach detailed analysis if necessary.]</p>
                    <p><strong>Analysis Performed By:</strong> [Name] <strong>Date Completed:</strong> [Date]</p>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">5.</span> <span class="section-title" contenteditable="true">Proposed Corrective Action(s)</span></h2>
                <div class="section-content" contenteditable="true">
                    <p>[Detail the planned corrective actions to eliminate the root cause(s).]</p>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">6.</span> <span class="section-title" contenteditable="true">Implementation Plan</span></h2>
                <div class="section-content" contenteditable="true">
                     <table style="width:100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="border:1px solid #ccc; padding:8px;">Action Item</th>
                                <th style="border:1px solid #ccc; padding:8px;">Responsible Person</th>
                                <th style="border:1px solid #ccc; padding:8px;">Target Completion Date</th>
                                <th style="border:1px solid #ccc; padding:8px;">Actual Completion Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">7.</span> <span class="section-title" contenteditable="true">Verification of Effectiveness</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>Verification Method:</strong> [How effectiveness will be checked]</p>
                    <p><strong>Verification Due Date:</strong> [Date]</p>
                    <p><strong>Verified By:</strong> [Name]</p>
                    <p><strong>Verification Date:</strong> [Date]</p>
                    <p><strong>Result:</strong> [Effective / Not Effective - Explain]</p>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">8.</span> <span class="section-title" contenteditable="true">CAR Closure</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>Approved By:</strong> [Name/Title]</p>
                    <p><strong>Date Closed:</strong> [Date]</p>
                </div>
            </div>
        `;
    }

    // Add Training Record template
    function loadTrainingRecordTemplate() {
        document.getElementById('documentContent').innerHTML = `
            <div class="section">
                <h2><span class="section-number">1.</span> <span class="section-title" contenteditable="true">Employee Details</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>Employee Name:</strong> [Name]</p>
                    <p><strong>Employee ID:</strong> [ID]</p>
                    <p><strong>Department:</strong> [Department]</p>
                    <p><strong>Position:</strong> [Position]</p>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">2.</span> <span class="section-title" contenteditable="true">Training Log</span></h2>
                <div class="section-content" contenteditable="true">
                    <table style="width:100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="border:1px solid #ccc; padding:8px;">Training Course/Topic</th>
                                <th style="border:1px solid #ccc; padding:8px;">Training Provider</th>
                                <th style="border:1px solid #ccc; padding:8px;">Date(s) of Training</th>
                                <th style="border:1px solid #ccc; padding:8px;">Duration (Hours)</th>
                                <th style="border:1px solid #ccc; padding:8px;">Trainer Name</th>
                                <th style="border:1px solid #ccc; padding:8px;">Assessment Method (if any)</th>
                                <th style="border:1px solid #ccc; padding:8px;">Result/Score</th>
                                <th style="border:1px solid #ccc; padding:8px;">Competency Achieved (Yes/No/Details)</th>
                                <th style="border:1px solid #ccc; padding:8px;">Certificate No. (if applicable)</th>
                                <th style="border:1px solid #ccc; padding:8px;">Next Training Due (if applicable)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                        </tbody>
                    </table>
                     <p style="margin-top:10px;"><i>Add new rows to the table for each training completed.</i></p>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">3.</span> <span class="section-title" contenteditable="true">Skills Matrix / Competency Overview</span></h2>
                <div class="section-content" contenteditable="true">
                    <p>[Optionally, include a summary of key skills/competencies relevant to the employee's role and their current status based on training.]</p>
                     <table style="width:100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="border:1px solid #ccc; padding:8px;">Required Skill/Competency</th>
                                <th style="border:1px solid #ccc; padding:8px;">Required Level</th>
                                <th style="border:1px solid #ccc; padding:8px;">Current Level</th>
                                <th style="border:1px solid #ccc; padding:8px;">Training Needs Identified</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
             <div class="section">
                <h2><span class="section-number">4.</span> <span class="section-title" contenteditable="true">Signatures</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>Employee Signature:</strong> _________________________ <strong>Date:</strong> __________</p>
                    <p><strong>Manager Signature:</strong> _________________________ <strong>Date:</strong> __________</p>
                </div>
            </div>
        `;
    }

    // Add Supplier Evaluation template
    function loadSupplierEvaluationTemplate() {
        document.getElementById('documentContent').innerHTML = `
            <div class="section">
                <h2><span class="section-number">1.</span> <span class="section-title" contenteditable="true">Supplier Details</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>Supplier Name:</strong> [Name]</p>
                    <p><strong>Supplier Contact:</strong> [Contact Person, Email, Phone]</p>
                    <p><strong>Address:</strong> [Address]</p>
                    <p><strong>Products/Services Provided:</strong> [Description]</p>
                    <p><strong>Evaluation Date:</strong> [Date]</p>
                    <p><strong>Evaluated By:</strong> [Name/Department]</p>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">2.</span> <span class="section-title" contenteditable="true">Evaluation Criteria & Scoring</span></h2>
                <div class="section-content" contenteditable="true">
                    <p>(Scoring: e.g., 1=Poor, 2=Fair, 3=Good, 4=Very Good, 5=Excellent, N/A=Not Applicable)</p>
                    <table style="width:100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="border:1px solid #ccc; padding:8px;">Criteria Category</th>
                                <th style="border:1px solid #ccc; padding:8px;">Specific Criteria</th>
                                <th style="border:1px solid #ccc; padding:8px;">Weighting (Optional)</th>
                                <th style="border:1px solid #ccc; padding:8px;">Score</th>
                                <th style="border:1px solid #ccc; padding:8px;">Comments/Evidence</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;" rowspan="3">Quality</td>
                                <td style="border:1px solid #ccc; padding:8px;">Product/Service Conformance to Specifications</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">Quality Management System (e.g., ISO 9001 Certified)</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                             <tr>
                                <td style="border:1px solid #ccc; padding:8px;">Rejection/Return Rate</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;" rowspan="2">Delivery</td>
                                <td style="border:1px solid #ccc; padding:8px;">On-Time Delivery Performance</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">Completeness of Order</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">Price/Cost</td>
                                <td style="border:1px solid #ccc; padding:8px;">Competitiveness of Pricing</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;" rowspan="2">Service/Support</td>
                                <td style="border:1px solid #ccc; padding:8px;">Responsiveness to Inquiries/Issues</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                             <tr>
                                <td style="border:1px solid #ccc; padding:8px;">Technical Support</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">Other (e.g., Financial Stability, Environmental Compliance)</td>
                                <td style="border:1px solid #ccc; padding:8px;">[Specify]</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                             <tr>
                                <td style="border:1px solid #ccc; padding:8px; font-weight:bold;" colspan="3">Total Score / Overall Rating:</td>
                                <td style="border:1px solid #ccc; padding:8px; font-weight:bold;">[Calculate Score]</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">3.</span> <span class="section-title" contenteditable="true">Evaluation Summary & Decision</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>Strengths:</strong> [List key strengths of the supplier]</p>
                    <p><strong>Weaknesses/Areas for Improvement:</strong> [List key weaknesses or areas needing improvement]</p>
                    <p><strong>Overall Assessment:</strong> [Provide a summary statement]</p>
                    <p><strong>Decision:</strong> 
                        <label><input type="radio" name="supplierDecision" value="approved"> Approved</label>
                        <label><input type="radio" name="supplierDecision" value="conditional"> Approved (Conditional - specify conditions below)</label>
                        <label><input type="radio" name="supplierDecision" value="rejected"> Rejected</label>
                    </p>
                    <p><strong>Conditions (if applicable):</strong> [Specify conditions for approval or reasons for rejection]</p>
                    <p><strong>Recommended Actions (if any):</strong> [e.g., Follow-up audit, request corrective action]</p>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">4.</span> <span class="section-title" contenteditable="true">Approvals</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>Evaluator Signature:</strong> _________________________ <strong>Date:</strong> __________</p>
                    <p><strong>Approved By (e.g., Purchasing Manager):</strong> _________________________ <strong>Date:</strong> __________</p>
                </div>
            </div>
        `;
    }

    // Add Calibration Record template
    function loadCalibrationRecordTemplate() {
        document.getElementById('documentContent').innerHTML = `
            <div class="section">
                <h2><span class="section-number">1.</span> <span class="section-title" contenteditable="true">Equipment Details</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>Equipment ID:</strong> [ID Number]</p>
                    <p><strong>Equipment Name/Description:</strong> [Name]</p>
                    <p><strong>Manufacturer:</strong> [Manufacturer]</p>
                    <p><strong>Model Number:</strong> [Model]</p>
                    <p><strong>Serial Number:</strong> [Serial]</p>
                    <p><strong>Location:</strong> [Location of Equipment]</p>
                    <p><strong>Measurement Range:</strong> [e.g., 0-100mm]</p>
                    <p><strong>Accuracy/Tolerance:</strong> [e.g., +/- 0.01mm]</p>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">2.</span> <span class="section-title" contenteditable="true">Calibration Information</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>Calibration Date:</strong> [Date]</p>
                    <p><strong>Calibration Due Date:</strong> [Date]</p>
                    <p><strong>Calibration Procedure Used:</strong> [Procedure No./Reference]</p>
                    <p><strong>Calibration Performed By:</strong> [Name/Company]</p>
                    <p><strong>Calibration Environment (Temp, Humidity, etc.):</strong> [Conditions if relevant]</p>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">3.</span> <span class="section-title" contenteditable="true">Reference Standards Used</span></h2>
                <div class="section-content" contenteditable="true">
                    <table style="width:100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="border:1px solid #ccc; padding:8px;">Standard ID</th>
                                <th style="border:1px solid #ccc; padding:8px;">Description</th>
                                <th style="border:1px solid #ccc; padding:8px;">Certificate No.</th>
                                <th style="border:1px solid #ccc; padding:8px;">Traceability</th>
                                <th style="border:1px solid #ccc; padding:8px;">Calibration Due Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">4.</span> <span class="section-title" contenteditable="true">Calibration Results</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>As Found Condition:</strong> [Describe condition before calibration/adjustment. Include readings if out of tolerance.]</p>
                    <table style="width:100%; border-collapse: collapse; margin-bottom:10px;">
                         <thead><tr><th colspan="4" style="border:1px solid #ccc; padding:8px; text-align:left;">As Found Readings (if applicable)</th></tr></thead>
                        <thead>
                            <tr>
                                <th style="border:1px solid #ccc; padding:8px;">Parameter/Point Checked</th>
                                <th style="border:1px solid #ccc; padding:8px;">Nominal Value</th>
                                <th style="border:1px solid #ccc; padding:8px;">Actual Reading (As Found)</th>
                                <th style="border:1px solid #ccc; padding:8px;">Deviation/Error</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                        </tbody>
                    </table>
                    <p><strong>As Left Condition:</strong> [Describe condition after calibration/adjustment. Confirm if within tolerance.]</p>
                     <table style="width:100%; border-collapse: collapse;">
                         <thead><tr><th colspan="4" style="border:1px solid #ccc; padding:8px; text-align:left;">As Left Readings</th></tr></thead>
                        <thead>
                            <tr>
                                <th style="border:1px solid #ccc; padding:8px;">Parameter/Point Checked</th>
                                <th style="border:1px solid #ccc; padding:8px;">Nominal Value</th>
                                <th style="border:1px solid #ccc; padding:8px;">Actual Reading (As Left)</th>
                                <th style="border:1px solid #ccc; padding:8px;">Deviation/Error</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                        </tbody>
                    </table>
                    <p style="margin-top:10px;"><strong>Calibration Status:</strong> <label><input type="radio" name="calStatus" value="pass"> Pass</label> <label><input type="radio" name="calStatus" value="fail"> Fail</label> <label><input type="radio" name="calStatus" value="adjusted"> Adjusted & Pass</label></p>
                    <p><strong>Remarks/Adjustments Made:</strong> [Details of any adjustments or observations]</p>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">5.</span> <span class="section-title" contenteditable="true">Approvals</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>Technician Signature:</strong> _________________________ <strong>Date:</strong> __________</p>
                    <p><strong>Reviewed By (e.g., Quality Manager):</strong> _________________________ <strong>Date:</strong> __________</p>
                    <p><strong>Calibration Certificate Number (if external):</strong> [Certificate No.]</p>
                </div>
            </div>
        `;
    }
    
    // Add Design and Development Plan template
    function loadDesignDevelopmentPlanTemplate() {
        document.getElementById('documentContent').innerHTML = `
            <div class="section">
                <h2><span class="section-number">1.</span> <span class="section-title" contenteditable="true">Project Details</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>Project Name/Title:</strong> [Name]</p>
                    <p><strong>Project ID/Number:</strong> [ID]</p>
                    <p><strong>Project Manager:</strong> [Name]</p>
                    <p><strong>Customer (if applicable):</strong> [Name]</p>
                    <p><strong>Date Initiated:</strong> [Date]</p>
                    <p><strong>Target Completion Date:</strong> [Date]</p>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">2.</span> <span class="section-title" contenteditable="true">Scope and Objectives</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>2.1 Project Scope:</strong></p>
                    <p>[Clearly define the boundaries of the design and development project. What is included and excluded?]</p>
                    <p><strong>2.2 Project Objectives:</strong></p>
                    <p>[List the specific, measurable, achievable, relevant, and time-bound (SMART) objectives for this project.]</p>
                    <ul>
                        <li>[Objective 1]</li>
                        <li>[Objective 2]</li>
                    </ul>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">3.</span> <span class="section-title" contenteditable="true">Design and Development Stages & Activities</span></h2>
                <div class="section-content" contenteditable="true">
                    <table style="width:100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="border:1px solid #ccc; padding:8px;">Stage No.</th>
                                <th style="border:1px solid #ccc; padding:8px;">Stage Name</th>
                                <th style="border:1px solid #ccc; padding:8px;">Key Activities</th>
                                <th style="border:1px solid #ccc; padding:8px;">Responsible Person/Team</th>
                                <th style="border:1px solid #ccc; padding:8px;">Planned Start Date</th>
                                <th style="border:1px solid #ccc; padding:8px;">Planned End Date</th>
                                <th style="border:1px solid #ccc; padding:8px;">Deliverables/Outputs</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">1</td>
                                <td style="border:1px solid #ccc; padding:8px;">Concept/Feasibility</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">2</td>
                                <td style="border:1px solid #ccc; padding:8px;">Design Input/Requirements</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">3</td>
                                <td style="border:1px solid #ccc; padding:8px;">Design Output/Specification</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">4</td>
                                <td style="border:1px solid #ccc; padding:8px;">Design Review</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">5</td>
                                <td style="border:1px solid #ccc; padding:8px;">Design Verification</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;">6</td>
                                <td style="border:1px solid #ccc; padding:8px;">Design Validation</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                             <tr>
                                <td style="border:1px solid #ccc; padding:8px;">7</td>
                                <td style="border:1px solid #ccc; padding:8px;">Design Transfer/Handover</td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">4.</span> <span class="section-title" contenteditable="true">Responsibilities and Authorities</span></h2>
                <div class="section-content" contenteditable="true">
                    <p>[Define roles, responsibilities, and authorities for key personnel involved in the D&D process.]</p>
                    <p><strong>Project Sponsor:</strong> [Name, Responsibilities]</p>
                    <p><strong>Design Team Lead:</strong> [Name, Responsibilities]</p>
                    <p><strong>Team Members:</strong> [Names/Roles, Responsibilities]</p>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">5.</span> <span class="section-title" contenteditable="true">Resources</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>Personnel:</strong> [Required skills, number of people]</p>
                    <p><strong>Equipment/Software:</strong> [List specific tools]</p>
                    <p><strong>Budget:</strong> [Allocated budget]</p>
                    <p><strong>Other Resources:</strong> [e.g., Facilities, External expertise]</p>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">6.</span> <span class="section-title" contenteditable="true">Design Inputs</span></h2>
                <div class="section-content" contenteditable="true">
                    <p>[List all inputs that will drive the design, e.g., customer requirements, functional specs, regulatory standards, previous project data.]</p>
                </div>
            </div>
             <div class="section">
                <h2><span class="section-number">7.</span> <span class="section-title" contenteditable="true">Design Outputs</span></h2>
                <div class="section-content" contenteditable="true">
                    <p>[List expected outputs from the design process, e.g., drawings, specifications, bill of materials, test procedures, user manuals.]</p>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">8.</span> <span class="section-title" contenteditable="true">Review, Verification, and Validation Activities</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>Design Reviews:</strong> [Describe when and how design reviews will be conducted, participants, and records.]</p>
                    <p><strong>Design Verification:</strong> [Describe methods to verify that design outputs meet design inputs, e.g., calculations, simulations, tests.]</p>
                    <p><strong>Design Validation:</strong> [Describe methods to validate that the final product meets user needs and intended use, e.g., prototype testing, user trials.]</p>
                </div>
            </div>
             <div class="section">
                <h2><span class="section-number">9.</span> <span class="section-title" contenteditable="true">Risk Management</span></h2>
                <div class="section-content" contenteditable="true">
                    <p>[Outline the approach to identifying, assessing, and mitigating risks associated with the design and development project.]</p>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">10.</span> <span class="section-title" contenteditable="true">Design Changes</span></h2>
                <div class="section-content" contenteditable="true">
                    <p>[Describe the process for managing changes to the design during the project lifecycle.]</p>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">11.</span> <span class="section-title" contenteditable="true">Approvals</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>Plan Prepared By:</strong> _________________________ <strong>Date:</strong> __________</p>
                    <p><strong>Plan Approved By (e.g., Project Sponsor/Management):</strong> _________________________ <strong>Date:</strong> __________</p>
                </div>
            </div>
        `;
    }

    // Add Customer Feedback Log template
    function loadCustomerFeedbackLogTemplate() {
        document.getElementById('documentContent').innerHTML = `
            <div class="section">
                <h2><span class="section-number">1.</span> <span class="section-title" contenteditable="true">Log Overview</span></h2>
                <div class="section-content" contenteditable="true">
                    <p><strong>Log Period:</strong> [e.g., Month/Year or Continuous]</p>
                    <p><strong>Department Responsible:</strong> [e.g., Customer Service, Sales]</p>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">2.</span> <span class="section-title" contenteditable="true">Customer Feedback Entries</span></h2>
                <div class="section-content" contenteditable="true">
                    <table style="width:100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="border:1px solid #ccc; padding:8px;">Log ID</th>
                                <th style="border:1px solid #ccc; padding:8px;">Date Received</th>
                                <th style="border:1px solid #ccc; padding:8px;">Customer Name/ID</th>
                                <th style="border:1px solid #ccc; padding:8px;">Contact Info</th>
                                <th style="border:1px solid #ccc; padding:8px;">Feedback Type (Complaint/Compliment/Suggestion/Inquiry)</th>
                                <th style="border:1px solid #ccc; padding:8px;">Product/Service Related To</th>
                                <th style="border:1px solid #ccc; padding:8px;">Feedback Description</th>
                                <th style="border:1px solid #ccc; padding:8px;">Received By</th>
                                <th style="border:1px solid #ccc; padding:8px;">Severity/Priority (if applicable)</th>
                                <th style="border:1px solid #ccc; padding:8px;">Action Taken / Resolution</th>
                                <th style="border:1px solid #ccc; padding:8px;">Responsible for Action</th>
                                <th style="border:1px solid #ccc; padding:8px;">Date Resolved</th>
                                <th style="border:1px solid #ccc; padding:8px;">Status (Open/Closed/Pending)</th>
                                <th style="border:1px solid #ccc; padding:8px;">Follow-up Required? (Y/N)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                                <td style="border:1px solid #ccc; padding:8px;"></td>
                            </tr>
                        </tbody>
                    </table>
                    <p style="margin-top:10px;"><i>Add new rows for each piece of feedback. Consider linking IDs to more detailed reports if necessary.</i></p>
                </div>
            </div>
            <div class="section">
                <h2><span class="section-number">3.</span> <span class="section-title" contenteditable="true">Feedback Analysis & Trends</span></h2>
                <div class="section-content" contenteditable="true">
                    <p>[Summarize key trends, common issues, or positive feedback themes observed during the reporting period. This section can be updated periodically.]</p>
                    <p><strong>Number of Complaints:</strong> [Count]</p>
                    <p><strong>Number of Compliments:</strong> [Count]</p>
                    <p><strong>Common Complaint Themes:</strong></p>
                    <ul>
                        <li>[Theme 1]</li>
                        <li>[Theme 2]</li>
                    </ul>
                    <p><strong>Improvement Actions Initiated based on Feedback:</strong></p>
                    <ul>
                        <li>[Action 1 - Link to CAR/PAR if applicable]</li>
                    </ul>
                </div>
            </div>
        `;
    }
});