// Global utility functions - moved outside of DOM ready event for accessibility
function calculateTotals() {
  // Calculate inspection time partial total
  const inspectionInputs = [
    document.querySelector('input[name="inspection-m"]'),
    document.querySelector('input[name="inspection-t"]'),
    document.querySelector('input[name="inspection-w"]'),
    document.querySelector('input[name="inspection-th"]'),
    document.querySelector('input[name="inspection-f"]')
  ];
  
  let inspectionTotal = 0;
  inspectionInputs.forEach(input => {
    if (input) {
      const value = parseFloat(input.value) || 0;
      inspectionTotal += value;
    }
  });
  
  const inspectionPartial = document.querySelector('input[name="inspection-partial"]');
  if (inspectionPartial) inspectionPartial.value = inspectionTotal;
  
  // Calculate reporting time partial total
  const reportingInputs = [
    document.querySelector('input[name="reporting-m"]'),
    document.querySelector('input[name="reporting-t"]'),
    document.querySelector('input[name="reporting-w"]'),
    document.querySelector('input[name="reporting-th"]'),
    document.querySelector('input[name="reporting-f"]')
  ];
  
  let reportingTotal = 0;
  reportingInputs.forEach(input => {
    if (input) {
      const value = parseFloat(input.value) || 0;
      reportingTotal += value;
    }
  });
  
  const reportingPartial = document.querySelector('input[name="reporting-partial"]');
  if (reportingPartial) reportingPartial.value = reportingTotal;
  
  // Calculate travel time partial total
  const travelInputs = [
    document.querySelector('input[name="travel-m"]'),
    document.querySelector('input[name="travel-t"]'),
    document.querySelector('input[name="travel-w"]'),
    document.querySelector('input[name="travel-th"]'),
    document.querySelector('input[name="travel-f"]')
  ];
  
  let travelTotal = 0;
  travelInputs.forEach(input => {
    if (input) {
      const value = parseFloat(input.value) || 0;
      travelTotal += value;
    }
  });
  
  const travelPartial = document.querySelector('input[name="travel-partial"]');
  if (travelPartial) travelPartial.value = travelTotal;
  
  // Calculate km total
  const kmInputs = [
    document.querySelector('input[name="km-m"]'),
    document.querySelector('input[name="km-t"]'),
    document.querySelector('input[name="km-w"]'),
    document.querySelector('input[name="km-th"]'),
    document.querySelector('input[name="km-f"]')
  ];
  
  let kmTotal = 0;
  kmInputs.forEach(input => {
    if (input) {
      const value = parseFloat(input.value) || 0;
      kmTotal += value;
    }
  });
  
  const kmTotalElement = document.querySelector('input[name="km-total"]');
  if (kmTotalElement) kmTotalElement.value = kmTotal + ' Km';
  
  // Calculate weekly total (sum of all partial totals)
  const weeklyTotal = inspectionTotal + reportingTotal + travelTotal;
  const weeklyTotalElement = document.querySelector('input[name="weekly-total"]');
  if (weeklyTotalElement) weeklyTotalElement.value = weeklyTotal + ' Hours';
}

// Make generateControlNumber function globally available
function generateControlNumber() {
  // Get input elements
  const reportNumber = document.getElementById('report-number');
  const supplier = document.getElementById('supplier');
  const irRevision = document.getElementById('ir-revision');
  const irDate = document.getElementById('ir-date');
  const controlNumber = document.getElementById('control-number');
  
  if (!reportNumber || !supplier || !irRevision || !irDate || !controlNumber) return;
  
  const reportValue = reportNumber.value || '----';
  const supplierValue = supplier.value || '----';
  const revisionValue = irRevision.value || '0';
  const dateValue = irDate.value;
  
  // Format date components
  let formattedDate = '---.--.----';
  
  if (dateValue) {
    const dateObj = new Date(dateValue);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    formattedDate = `${day}.${month}.${year}`;
  }
  
  // Get current year
  const currentYear = new Date().getFullYear();
  
  // Generate control number in specified format
  const controlValue = `${reportValue} - ${supplierValue} - ${revisionValue} - ${currentYear} - ${formattedDate}`;
  
  // Update control number field
  controlNumber.value = controlValue;
}

// Global utility function for getting current date string
function getCurrentDateString() {
  const date = new Date();
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

// Get saved reports from localStorage (moved to global scope)
function getSavedReports() {
  const savedReportsStr = localStorage.getItem('savedReports');
  return savedReportsStr ? JSON.parse(savedReportsStr) : [];
}

// Function to find the closest drop target based on Y position
function findDropTarget(y, sections) {
  return sections.reduce((closest, section) => {
    const rect = section.getBoundingClientRect();
    const offset = y - rect.top - rect.height / 2;
    
    if (closest === null || Math.abs(offset) < Math.abs(closest.offset)) {
      return { element: section, offset: offset };
    } else {
      return closest;
    }
  }, null)?.element || null;
}

// Function to save the current layout state
function saveLayoutState() {
  const sections = document.querySelectorAll('.draggable');
  const orderArray = Array.from(sections).map(section => section.getAttribute('data-section-id'));
  localStorage.setItem('formSectionOrder', JSON.stringify(orderArray));
}

// Function to load and apply saved layout state
function loadLayoutState() {
  const savedOrder = localStorage.getItem('formSectionOrder');
  
  if (savedOrder) {
    try {
      const orderArray = JSON.parse(savedOrder);
      const container = document.querySelector('form');
      
      // Reorder sections according to saved state
      orderArray.forEach(sectionId => {
        const section = document.querySelector(`.draggable[data-section-id="${sectionId}"]`);
        if (section) {
          container.appendChild(section);
        }
      });
    } catch (error) {
      console.error('Error restoring layout:', error);
    }
  }
}

// Load report data function (moved to global scope)
function loadReportFromData(report) {
  const form = document.getElementById('inspection-report');
  
  // Reset form first
  form.reset();
  
  // Fill form with saved data
  for (let key in report.data) {
    if (key === '_sectionOrder') continue;
    
    const input = form.elements[key];
    if (input) {
      if (input.type === 'checkbox' || input.type === 'radio') {
        input.checked = report.data[key] === 'on' || report.data[key] === true;
      } else {
        input.value = report.data[key];
      }
    }
  }
  
  // Restore section order if available
  if (report.data._sectionOrder) {
    const container = document.querySelector('form');
    
    report.data._sectionOrder.forEach(sectionId => {
      const section = document.querySelector(`.draggable[data-section-id="${sectionId}"]`);
      if (section) {
        container.appendChild(section);
      }
    });
  }
  
  // Recalculate totals and control number
  calculateTotals();
  generateControlNumber();
  
  // Load image data if available
  if (report.imageData) {
    localStorage.setItem('reportImages', JSON.stringify(report.imageData));
    restoreImageData();
  }
}

// Function to restore image data
function restoreImageData() {
  const imagesContainer = document.querySelector('.images-container');
  if (!imagesContainer) return;
  
  const savedImages = localStorage.getItem('reportImages');
  
  if (savedImages) {
    try {
      const imageData = JSON.parse(savedImages);
      
      // Clear current images
      imagesContainer.innerHTML = '';
      
      // Restore each image
      imageData.forEach(imgData => {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        imageItem.dataset.imageId = imgData.id;
        
        // Create image header with title and controls
        const imageHeader = document.createElement('div');
        imageHeader.className = 'image-header';
        
        const imageTitle = document.createElement('h4');
        imageTitle.className = 'image-title';
        imageTitle.textContent = imgData.filename;
        
        const imageControls = document.createElement('div');
        imageControls.className = 'image-controls';
        
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'remove-image-btn';
        removeBtn.innerHTML = '<i class="fas fa-trash"></i> Remove';
        removeBtn.addEventListener('click', () => {
          imageItem.remove();
          updateNoImagesPlaceholder();
          saveImageData(); // Save after removal
        });
        
        imageControls.appendChild(removeBtn);
        imageHeader.appendChild(imageTitle);
        imageHeader.appendChild(imageControls);
        
        // Create image preview
        const imagePreview = document.createElement('div');
        imagePreview.className = 'image-preview';
        
        const img = document.createElement('img');
        img.src = imgData.image;
        img.alt = imgData.filename;
        
        imagePreview.appendChild(img);
        
        // Create comment area
        const commentContainer = document.createElement('div');
        commentContainer.className = 'image-comment-container';
        
        const commentLabel = document.createElement('label');
        commentLabel.textContent = 'Comments:';
        commentLabel.setAttribute('for', `comment-${imgData.id}`);
        
        const commentTextarea = document.createElement('textarea');
        commentTextarea.className = 'image-comment';
        commentTextarea.id = `comment-${imgData.id}`;
        commentTextarea.name = `comment-${imgData.id}`;
        commentTextarea.value = imgData.comment || '';
        
        // Save comment when it changes
        commentTextarea.addEventListener('input', saveImageData);
        
        commentContainer.appendChild(commentLabel);
        commentContainer.appendChild(commentTextarea);
        
        // Assemble the image item
        imageItem.appendChild(imageHeader);
        imageItem.appendChild(imagePreview);
        imageItem.appendChild(commentContainer);
        
        // Add the image item to the container
        imagesContainer.appendChild(imageItem);
      });
      
      updateNoImagesPlaceholder();
    } catch (error) {
      console.error('Error restoring image data:', error);
    }
  }
}

// Function to update no images placeholder
function updateNoImagesPlaceholder() {
  const imagesContainer = document.querySelector('.images-container');
  if (!imagesContainer) return;
  
  if (imagesContainer.children.length === 0) {
    const placeholder = document.createElement('div');
    placeholder.className = 'no-image-text';
    placeholder.textContent = 'No images have been added yet. Click "Add New Image" to upload images.';
    imagesContainer.appendChild(placeholder);
  } else {
    const placeholder = imagesContainer.querySelector('.no-image-text');
    if (placeholder) {
      placeholder.remove();
    }
  }
}

// Function to save image data
function saveImageData() {
  const imageData = [];
  const items = document.querySelectorAll('.image-item');
  
  // Collect all images and their comments
  items.forEach(item => {
    const imageId = item.dataset.imageId;
    const imgElement = item.querySelector('img');
    const commentElement = item.querySelector('.image-comment');
    
    if (imgElement && commentElement) {
      imageData.push({
        id: imageId,
        image: imgElement.src,
        filename: imgElement.alt,
        comment: commentElement.value
      });
    }
  });
  
  // Store in localStorage
  localStorage.setItem('reportImages', JSON.stringify(imageData));
}

// Function to toggle dropdown menu
function toggleDropdown() {
  document.querySelector('.dropdown-content').classList.toggle('show');
}

// Close the dropdown if user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn') && !event.target.closest('.dropbtn')) {
    const dropdowns = document.getElementsByClassName('dropdown-content');
    for (let i = 0; i < dropdowns.length; i++) {
      const openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
};

document.addEventListener('DOMContentLoaded', function() {
  // Initialize dropdown functionality
  const dropBtn = document.querySelector('.dropbtn');
  if (dropBtn) {
    dropBtn.addEventListener('click', toggleDropdown);
  }
  
  // Add event listeners to calculate totals when inputs change
  const timeInputs = document.querySelectorAll('.time-breakdown input');
  timeInputs.forEach(input => {
    input.addEventListener('input', calculateTotals);
  });
  
  // Add accordion functionality for the condensed sections
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  
  accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      // Toggle active class on the header
      this.classList.toggle('active');
      
      // Toggle the visibility of the content
      const content = this.nextElementSibling;
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
        content.classList.remove('active');
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
        content.classList.add('active');
      }
    });
  });
  
  // Initialize by opening the first panel
  if (accordionHeaders.length > 0) {
    accordionHeaders[0].click();
  }
  
  // File attachment handling
  const fileInput = document.getElementById('file-attachments');
  const fileList = document.getElementById('file-list');
  const uploadedFiles = [];
  
  if (fileInput && fileList) {
    fileInput.addEventListener('change', function(e) {
      const files = Array.from(e.target.files);
      
      // Clear file list display
      fileList.innerHTML = '';
      
      // Store files for later use
      files.forEach(file => {
        uploadedFiles.push(file);
        
        // Create file display element
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
          <span>${file.name}</span>
          <button type="button" class="remove-file" data-name="${file.name}">×</button>
        `;
        fileList.appendChild(fileItem);
      });
      
      // Add event listeners to remove buttons
      document.querySelectorAll('.remove-file').forEach(button => {
        button.addEventListener('click', function() {
          const fileName = this.getAttribute('data-name');
          const index = uploadedFiles.findIndex(file => file.name === fileName);
          if (index !== -1) {
            uploadedFiles.splice(index, 1);
            this.parentElement.remove();
          }
        });
      });
    });
  }
  
  // Export to CSV functionality
  document.querySelector('.export-btn').addEventListener('click', function() {
    // Collect all form data
    const form = document.getElementById('inspection-report');
    const formData = new FormData(form);
    const data = {};
    
    // Convert FormData to object
    for (let [key, value] of formData.entries()) {
      // Skip file inputs
      if (key !== 'file-attachments') {
        data[key] = value;
      }
    }
    
    // Convert to CSV
    let csvContent = 'data:text/csv;charset=utf-8,';
    
    // Add headers and values
    for (let key in data) {
      csvContent += `${key},${data[key]}\r\n`;
    }
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `inspection_report_${getCurrentDateString()}.csv`);
    document.body.appendChild(link);
    
    // Download CSV
    link.click();
    
    // Handle file attachments if any
    if (uploadedFiles && uploadedFiles.length > 0) {
      createZipAndDownload(uploadedFiles);
    }
  });
  
  // Function to create zip file with attachments
  function createZipAndDownload(files) {
    // Create JSZip instance - load dynamically
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    document.head.appendChild(script);
    
    script.onload = function() {
      const zip = new JSZip();
      
      // Add files to the zip
      let count = 0;
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
          // Add file content to zip
          const fileData = e.target.result;
          zip.file(file.name, fileData);
          count++;
          
          // When all files are processed, generate the zip
          if (count === files.length) {
            zip.generateAsync({type: 'blob'}).then(function(content) {
              // Create download link for the zip
              const zipLink = document.createElement('a');
              zipLink.href = URL.createObjectURL(content);
              zipLink.download = `attachments_${getCurrentDateString()}.zip`;
              document.body.appendChild(zipLink);
              zipLink.click();
              
              // Clean up
              setTimeout(() => {
                document.body.removeChild(zipLink);
                URL.revokeObjectURL(zipLink.href);
              }, 100);
            });
          }
        };
        reader.readAsArrayBuffer(file);
      });
    };
  }
  
  // Handle form submission for printing
  document.querySelector('.print-btn').addEventListener('click', function(e) {
    e.preventDefault();
    window.print();
  });
  
  // Add event listeners to update control number when relevant fields change
  document.getElementById('report-number').addEventListener('input', generateControlNumber);
  document.getElementById('supplier').addEventListener('input', generateControlNumber);
  document.getElementById('ir-revision').addEventListener('input', generateControlNumber);
  document.getElementById('ir-date').addEventListener('input', generateControlNumber);
  
  // Initialize control number on page load
  generateControlNumber();
  
  // Set today's date as default for IR Issued Date
  const today = new Date();
  const formattedDate = today.toISOString().substr(0, 10);
  document.getElementById('ir-date').value = formattedDate;
  
  // Initialize calculations
  calculateTotals();
  
  // Drag and Drop functionality for form sections
  initDragAndDrop();
  
  // Initialize simple save and load functionality
  initSimpleSaveAndLoad();
  
  // Initialize file-based save and load functionality
  initFileSaveAndLoad();
  
  // Initialize image documentation section
  initImageDocumentation();
  
  // Initialize Save Form to HTML functionality
  initSaveFormToHTML();
  
  // Make all accordion sections expanded by default
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.classList.add('active');
    const content = header.nextElementSibling;
    content.classList.add('active');
    content.style.maxHeight = 'none'; // Override the max-height restriction
  });
});

// Function to initialize drag and drop for form sections
function initDragAndDrop() {
  const draggableSections = document.querySelectorAll('.draggable');
  
  draggableSections.forEach(section => {
    const dragHandle = section.querySelector('.drag-handle');
    
    if (dragHandle) {
      dragHandle.addEventListener('mousedown', (e) => {
        // Prevent default behavior and propagation
        e.preventDefault();
        e.stopPropagation();
        
        // Add dragging class for styling
        section.classList.add('dragging');
        
        // Store original position
        const rect = section.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        
        // Get all draggable sections for drop targets
        const allSections = Array.from(document.querySelectorAll('.draggable:not(.dragging)'));
        
        // Function to handle drag movement
        function mouseMoveHandler(e) {
          // Calculate position
          const x = e.clientX - offsetX;
          const y = e.clientY - offsetY;
          
          // Move element (visual feedback only)
          section.style.position = 'fixed';
          section.style.top = `${y}px`;
          section.style.left = `${x}px`;
          section.style.width = `${rect.width}px`;
          section.style.zIndex = 1000;
          
          // Find the drop target
          const dropTarget = findDropTarget(e.clientY, allSections);
          
          // Clear previous drop target highlights
          allSections.forEach(s => s.classList.remove('drop-target'));
          
          // Highlight new drop target
          if (dropTarget) {
            dropTarget.classList.add('drop-target');
          }
        }
        
        // Function to handle drop
        function mouseUpHandler(e) {
          // Remove the dragging class
          section.classList.remove('dragging');
          
          // Reset positioning
          section.style.position = '';
          section.style.top = '';
          section.style.left = '';
          section.style.width = '';
          section.style.zIndex = '';
          
          // Find drop target
          const dropTarget = findDropTarget(e.clientY, allSections);
          
          // Clear drop target highlights
          allSections.forEach(s => s.classList.remove('drop-target'));
          
          // Move the section to the new position
          if (dropTarget) {
            // Determine if we should insert before or after
            const rect = dropTarget.getBoundingClientRect();
            const dropMiddle = rect.top + rect.height / 2;
            
            if (e.clientY < dropMiddle) {
              // Insert before
              dropTarget.parentNode.insertBefore(section, dropTarget);
            } else {
              // Insert after
              dropTarget.parentNode.insertBefore(section, dropTarget.nextSibling);
            }
            
            // Save the current order of sections
            saveLayoutState();
          }
          
          // Remove event listeners
          document.removeEventListener('mousemove', mouseMoveHandler);
          document.removeEventListener('mouseup', mouseUpHandler);
        }
        
        // Add event listeners
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
      });
    }
  });
}

// Simplified Save and Load functionality (no modal needed)
function initSimpleSaveAndLoad() {
  const saveBtn = document.querySelector('.save-btn');
  const loadBtn = document.querySelector('.load-btn');
  
  if (saveBtn) {
    saveBtn.addEventListener('click', function() {
      const reportName = prompt('Enter a name for this report:', `Report_${getCurrentDateString()}`);
      if (reportName) {
        saveFormData(reportName);
      }
    });
  }
  
  if (loadBtn) {
    loadBtn.addEventListener('click', function() {
      // Show list of saved reports
      const savedReports = getSavedReports();
      
      if (savedReports.length === 0) {
        alert('No saved reports found');
        return;
      }
      
      // Create a selection list of reports
      let reportsString = 'Select a report to load:\n\n';
      savedReports.forEach((report, index) => {
        reportsString += `${index + 1}. ${report.name} (${new Date(report.timestamp).toLocaleString()})\n`;
      });
      
      const selection = prompt(reportsString, '1');
      
      if (selection) {
        const reportIndex = parseInt(selection) - 1;
        if (!isNaN(reportIndex) && reportIndex >= 0 && reportIndex < savedReports.length) {
          loadFormData(savedReports[reportIndex].id);
        } else {
          alert('Invalid selection');
        }
      }
    });
  }
  
  // Function to save form data
  function saveFormData(reportName) {
    const form = document.getElementById('inspection-report');
    const formData = new FormData(form);
    const data = {};
    
    // Convert FormData to object
    for (let [key, value] of formData.entries()) {
      // Skip file inputs
      if (key !== 'file-attachments') {
        data[key] = value;
      }
    }
    
    // Get section order
    const sections = document.querySelectorAll('.draggable');
    data._sectionOrder = Array.from(sections).map(section => section.getAttribute('data-section-id'));
    
    // Create report object
    const report = {
      id: Date.now().toString(),
      name: reportName,
      timestamp: Date.now(),
      data: data
    };
    
    // Save to localStorage
    const savedReports = getSavedReports();
    savedReports.push(report);
    localStorage.setItem('savedReports', JSON.stringify(savedReports));
    
    alert(`Report "${reportName}" saved successfully!`);
  }
  
  // Function to load form data
  function loadFormData(reportId) {
    const savedReports = getSavedReports();
    const report = savedReports.find(r => r.id === reportId);
    
    if (!report) {
      alert('Report not found!');
      return;
    }
    
    const form = document.getElementById('inspection-report');
    
    // Reset form first
    form.reset();
    
    // Fill form with saved data
    for (let key in report.data) {
      if (key === '_sectionOrder') continue;
      
      const input = form.elements[key];
      if (input) {
        if (input.type === 'checkbox' || input.type === 'radio') {
          input.checked = report.data[key] === 'on' || report.data[key] === true;
        } else {
          input.value = report.data[key];
        }
      }
    }
    
    // Restore section order if available
    if (report.data._sectionOrder) {
      const container = document.querySelector('form');
      
      report.data._sectionOrder.forEach(sectionId => {
        const section = document.querySelector(`.draggable[data-section-id="${sectionId}"]`);
        if (section) {
          container.appendChild(section);
        }
      });
    }
    
    // Recalculate totals and control number
    calculateTotals();
    generateControlNumber();
    
    alert(`Report "${report.name}" loaded successfully!`);
  }
}

// Initialize file-based save and load functionality
function initFileSaveAndLoad() {
  const saveFileBtn = document.querySelector('.save-file-btn');
  const loadFileBtn = document.querySelector('.load-file-btn');
  const fileInput = document.getElementById('load-report-file');
  
  // Save report to file
  if (saveFileBtn) {
    saveFileBtn.addEventListener('click', function(e) {
      // Prevent default handler
      e.stopPropagation();
      
      // Collect form data
      const form = document.getElementById('inspection-report');
      const formData = new FormData(form);
      const data = {};
      
      // Convert FormData to object
      for (let [key, value] of formData.entries()) {
        // Skip file inputs
        if (key !== 'file-attachments') {
          data[key] = value;
        }
      }
      
      // Get section order
      const sections = document.querySelectorAll('.draggable');
      data._sectionOrder = Array.from(sections).map(section => section.getAttribute('data-section-id'));
      
      // Get image data
      const savedImages = localStorage.getItem('reportImages');
      const imageData = savedImages ? JSON.parse(savedImages) : [];
      
      // Create report object
      const report = {
        name: prompt('Enter a name for this report:', `Report_${getCurrentDateString()}`),
        timestamp: Date.now(),
        data: data,
        imageData: imageData
      };
      
      if (!report.name) return; // User cancelled
      
      // Convert to JSON
      const jsonData = JSON.stringify(report, null, 2);
      
      // Create download link
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${report.name.replace(/\s+/g, '_')}.json`;
      document.body.appendChild(link);
      
      // Download file
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    }, true);
  }
  
  // Load report from file
  if (loadFileBtn && fileInput) {
    loadFileBtn.addEventListener('click', function() {
      fileInput.click();
    });
    
    // Handle file selection
    fileInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const report = JSON.parse(e.target.result);
          
          // Validate report format
          if (!report.data) {
            throw new Error('Invalid report format');
          }
          
          // Load report data
          loadReportFromData(report);
          
          // Reset file input
          fileInput.value = '';
          
          alert(`Report "${report.name}" loaded successfully!`);
        } catch (error) {
          alert(`Error loading report: ${error.message}`);
        }
      };
      
      reader.readAsText(file);
    });
  }
}

// Function to initialize the image documentation section
function initImageDocumentation() {
  const addImageBtn = document.querySelector('.add-image-btn');
  const imagesContainer = document.querySelector('.images-container');
  
  if (!addImageBtn || !imagesContainer) return;
  
  // Create a hidden file input for image selection
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/jpeg,image/png,image/gif';
  fileInput.className = 'hidden-file-input';
  fileInput.multiple = false;
  document.body.appendChild(fileInput);
  
  updateNoImagesPlaceholder();
  
  // Handle Add New Image button click
  addImageBtn.addEventListener('click', () => {
    fileInput.click();
  });
  
  // Handle image file selection
  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Check if file is an image
      if (!file.type.match('image.*')) {
        alert('Please select an image file (JPEG, PNG, or GIF).');
        return;
      }
      
      // Read the image file
      const reader = new FileReader();
      reader.onload = (event) => {
        // Remove placeholder if exists
        const placeholder = imagesContainer.querySelector('.no-image-text');
        if (placeholder) {
          placeholder.remove();
        }
        
        // Create a unique ID for this image
        const imageId = 'img_' + Date.now();
        
        // Create image item container
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        imageItem.dataset.imageId = imageId;
        
        // Create image header with title and controls
        const imageHeader = document.createElement('div');
        imageHeader.className = 'image-header';
        
        const imageTitle = document.createElement('h4');
        imageTitle.className = 'image-title';
        imageTitle.textContent = file.name;
        
        const imageControls = document.createElement('div');
        imageControls.className = 'image-controls';
        
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'remove-image-btn';
        removeBtn.innerHTML = '<i class="fas fa-trash"></i> Remove';
        removeBtn.addEventListener('click', () => {
          imageItem.remove();
          updateNoImagesPlaceholder();
          saveImageData(); // Save after removal
        });
        
        imageControls.appendChild(removeBtn);
        imageHeader.appendChild(imageTitle);
        imageHeader.appendChild(imageControls);
        
        // Create image preview
        const imagePreview = document.createElement('div');
        imagePreview.className = 'image-preview';
        
        const img = document.createElement('img');
        img.src = event.target.result;
        img.alt = file.name;
        
        imagePreview.appendChild(img);
        
        // Create comment area
        const commentContainer = document.createElement('div');
        commentContainer.className = 'image-comment-container';
        
        const commentLabel = document.createElement('label');
        commentLabel.textContent = 'Comments:';
        commentLabel.setAttribute('for', `comment-${imageId}`);
        
        const commentTextarea = document.createElement('textarea');
        commentTextarea.className = 'image-comment';
        commentTextarea.id = `comment-${imageId}`;
        commentTextarea.name = `comment-${imageId}`;
        commentTextarea.placeholder = 'Add your comments about this image here...';
        
        // Save comment when it changes
        commentTextarea.addEventListener('input', saveImageData);
        
        commentContainer.appendChild(commentLabel);
        commentContainer.appendChild(commentTextarea);
        
        // Assemble the image item
        imageItem.appendChild(imageHeader);
        imageItem.appendChild(imagePreview);
        imageItem.appendChild(commentContainer);
        
        // Add the image item to the container
        imagesContainer.appendChild(imageItem);
        
        // Save this image data
        saveImageData();
      };
      
      // Read image as data URL
      reader.readAsDataURL(file);
      
      // Reset the file input
      fileInput.value = '';
    }
  });
}

// Function to initialize Save Form to HTML functionality
function initSaveFormToHTML() {
  const saveHtmlBtn = document.querySelector('.save-html-btn');
  
  if (saveHtmlBtn) {
    saveHtmlBtn.addEventListener('click', function() {
      // Prompt for filename
      const filename = prompt('Enter a name for the HTML file:', `inspection_report_${getCurrentDateString()}`);
      if (!filename) return; // User cancelled
      
      // Create a clone of the form to manipulate
      const form = document.getElementById('inspection-report');
      const formClone = form.cloneNode(true);
      
      // Create a new document with basic structure
      const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MRC Global Inspection Report - ${filename}</title>
  <style>
    /* Basic styling for the exported form */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: Arial, sans-serif;
      line-height: 1.4;
      color: #333;
      background-color: #f9f9f9;
      padding: 20px;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background-color: #fff;
      padding: 20px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    
    .header-content {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      border-bottom: 1px solid #003366;
      padding-bottom: 10px;
    }
    
    .logo {
      width: 60px;
      height: auto;
      margin-right: 15px;
    }
    
    h1 {
      color: #003366;
      font-size: 24px;
    }
    
    .form-section {
      margin-bottom: 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 10px;
      background-color: #fafafa;
    }
    
    .section-header {
      margin-bottom: 10px;
    }
    
    h3 {
      color: #003366;
      font-size: 18px;
      border-bottom: 1px solid #eee;
      padding-bottom: 5px;
      margin-bottom: 10px;
    }
    
    .form-row {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 10px;
    }
    
    .form-group {
      flex: 1;
      min-width: 200px;
      margin-right: 10px;
      margin-bottom: 10px;
    }
    
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      color: #555;
    }
    
    input[type="text"],
    textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 3px;
      background-color: #f9f9f9;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 15px;
    }
    
    th, td {
      padding: 8px;
      border: 1px solid #ddd;
      text-align: left;
    }
    
    th {
      background-color: #f2f2f2;
      font-weight: bold;
    }
    
    .control-number-section {
      background-color: #f0f7ff;
      border-left: 3px solid #003366;
    }
    
    .control-number-input {
      font-weight: bold;
      color: #003366;
    }
    
    .image-item {
      margin-bottom: 20px;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    
    .image-header {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
      margin-bottom: 10px;
    }
    
    .image-title {
      font-weight: bold;
      color: #003366;
    }
    
    .image-preview {
      text-align: center;
      margin-bottom: 10px;
    }
    
    .image-preview img {
      max-width: 100%;
      max-height: 400px;
      border: 1px solid #ddd;
    }
    
    .image-comment-container {
      margin-top: 10px;
    }
    
    /* Remove control elements from the exported HTML */
    .drag-handle,
    button,
    .form-actions,
    .dropdown,
    .drop-target,
    .form-toolbar {
      display: none !important;
    }
    
    /* Make checkbox and radio selections visible */
    input[type="checkbox"]:checked::after,
    input[type="radio"]:checked::after {
      content: "✓";
      display: inline-block;
      text-align: center;
      width: 100%;
      height: 100%;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header-content">
      <h1>MRC Global Inspection Report</h1>
      <div style="margin-left: auto; font-size: 14px; color: #666;">
        Exported on: ${new Date().toLocaleString()}
      </div>
    </div>
    <div id="report-content">
      <!-- Form content will be inserted here -->
    </div>
  </div>
</body>
</html>
      `;
      
      // Create a HTML document
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(htmlContent, 'text/html');
      const reportContainer = htmlDoc.getElementById('report-content');
      
      // Get the control number section
      const controlSection = document.querySelector('.control-number-section').cloneNode(true);
      
      // Remove drag handles and buttons
      controlSection.querySelectorAll('.drag-handle, button').forEach(el => el.remove());
      reportContainer.appendChild(controlSection);
      
      // Process form sections
      formClone.querySelectorAll('.form-section').forEach(section => {
        // Remove drag handles and buttons
        section.querySelectorAll('.drag-handle, button').forEach(el => el.remove());
        reportContainer.appendChild(section);
      });
      
      // Get all form inputs and make them readonly
      htmlDoc.querySelectorAll('input, textarea, select').forEach(input => {
        const originalInput = form.querySelector(`[name="${input.name}"]`);
        if (originalInput) {
          if (originalInput.type === 'checkbox' || originalInput.type === 'radio') {
            input.checked = originalInput.checked;
          } else {
            input.value = originalInput.value;
          }
          input.setAttribute('readonly', 'readonly');
          input.setAttribute('disabled', 'disabled');
        }
      });
      
      // Handle images
      const savedImages = localStorage.getItem('reportImages');
      if (savedImages) {
        try {
          const imageData = JSON.parse(savedImages);
          
          const imagesContainer = htmlDoc.querySelector('.images-container');
          if (imagesContainer) {
            // Clear any placeholder
            imagesContainer.innerHTML = '';
            
            // Add each image
            imageData.forEach(imgData => {
              const imageItem = document.createElement('div');
              imageItem.className = 'image-item';
              
              const imageHeader = document.createElement('div');
              imageHeader.className = 'image-header';
              
              const imageTitle = document.createElement('h4');
              imageTitle.className = 'image-title';
              imageTitle.textContent = imgData.filename;
              
              imageHeader.appendChild(imageTitle);
              
              const imagePreview = document.createElement('div');
              imagePreview.className = 'image-preview';
              
              const img = document.createElement('img');
              img.src = imgData.image;
              img.alt = imgData.filename;
              
              imagePreview.appendChild(img);
              
              const commentContainer = document.createElement('div');
              commentContainer.className = 'image-comment-container';
              
              const commentLabel = document.createElement('label');
              commentLabel.textContent = 'Comments:';
              
              const commentText = document.createElement('div');
              commentText.className = 'image-comment-text';
              commentText.textContent = imgData.comment || '';
              
              commentContainer.appendChild(commentLabel);
              commentContainer.appendChild(commentText);
              
              imageItem.appendChild(imageHeader);
              imageItem.appendChild(imagePreview);
              imageItem.appendChild(commentContainer);
              
              imagesContainer.appendChild(imageItem);
            });
          }
        } catch (error) {
          console.error('Error processing images for HTML export:', error);
        }
      }
      
      // Create a Blob with the HTML content
      const blob = new Blob([htmlDoc.documentElement.outerHTML], { type: 'text/html' });
      
      // Create a download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.html`;
      document.body.appendChild(link);
      
      // Download the HTML file
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    });
  }
}

// Override the accordion initialization to always be open
document.addEventListener('DOMContentLoaded', function() {
  // Expand all accordion sections by default (needs to run after they're created)
  setTimeout(() => {
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.classList.add('active');
      const content = header.nextElementSibling;
      if (content && content.classList.contains('accordion-content')) {
        content.classList.add('active');
        content.style.maxHeight = 'none'; // Override the max-height restriction
      }
    });
  }, 100);
});