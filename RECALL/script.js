document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const csvUpload = document.getElementById('csvUpload');
    const logoUpload = document.getElementById('logoUpload');
    const logoPreview = document.getElementById('logoPreview');
    const generateBtn = document.getElementById('generateBtn');
    const printBtn = document.getElementById('printBtn');
    const exportBtn = document.getElementById('exportBtn');
    const saveAsImagesBtn = document.getElementById('saveAsImagesBtn');
    const saveAsPDFsBtn = document.getElementById('saveAsPDFsBtn');
    const saveAsImagesBtnCheck = document.getElementById('saveAsImagesBtn');
    const batchPrintBtn = document.getElementById('batchPrintBtn');
    const lettersContainer = document.getElementById('lettersContainer');
    const letters = document.getElementById('letters');
    const fieldSelection = document.getElementById('fieldSelection');
    const fieldCheckboxes = document.getElementById('fieldCheckboxes');
    const useContentOverride = document.getElementById('useContentOverride');
    const contentOverride = document.getElementById('contentOverride');
    
    // Add event listener to restore original page language
    const restoreOriginalLanguageBtn = document.createElement('button');
    restoreOriginalLanguageBtn.id = 'restoreLanguageBtn';
    restoreOriginalLanguageBtn.className = 'btn restore-language-btn';
    restoreOriginalLanguageBtn.textContent = 'Restore Original Language';
    restoreOriginalLanguageBtn.style.display = 'none';
    
    if (document.getElementById('google_translate_element')) {
        document.getElementById('google_translate_element').after(restoreOriginalLanguageBtn);
        
        restoreOriginalLanguageBtn.addEventListener('click', function() {
            // Reset to original language
            var iframe = document.getElementsByClassName('goog-te-banner-frame')[0];
            if (iframe) {
                var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
                var restoreBtn = innerDoc.getElementsByTagName('button')[0];
                if (restoreBtn) {
                    restoreBtn.click();
                }
            }
            
            // Alternative approach
            document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + location.hostname;
            location.reload();
        });
        
        // Monitor for translations and show restore button when needed
        const observer = new MutationObserver(function(mutations) {
            if (document.body.classList.contains('translated-rtl') || 
                document.body.classList.contains('translated-ltr')) {
                restoreOriginalLanguageBtn.style.display = 'inline-block';
            } else {
                restoreOriginalLanguageBtn.style.display = 'none';
            }
        });
        
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }
    
    // Variables to store data
    let csvData = [];
    let columnNames = [];
    let logo = 'placeholder.jpg';
    let generatedLetters = []; // Store letter data for export
    
    // Initialize rich text editors for all paragraph inputs
    initializeRichTextEditors();
    
    // Initialize rich text for content override
    if (document.getElementById('contentOverride')) {
        convertToRichText('contentOverride');
    }
    
    // Event listeners - only add if elements exist
    if (csvUpload) csvUpload.addEventListener('change', handleCSVUpload);
    if (logoUpload) logoUpload.addEventListener('change', handleLogoUpload);
    if (generateBtn) generateBtn.addEventListener('click', generateLetters);
    if (printBtn) printBtn.addEventListener('click', printLetters);
    if (exportBtn) exportBtn.addEventListener('click', exportLettersAsZip);
    if (saveAsImagesBtnCheck) saveAsImagesBtnCheck.addEventListener('click', saveLettersAsImages);
    if (saveAsPDFsBtn) saveAsPDFsBtn.addEventListener('click', saveLettersAsPDFs);
    if (batchPrintBtn) batchPrintBtn.addEventListener('click', saveLettersAsPDFs);
    
    // Update the lettersContainer HTML to include the new buttons
    const updateLettersUI = function() {
        const buttonsContainer = document.querySelector('.buttons-container');
        if (buttonsContainer) {
            // Add Save as PDFs button if not already present
            if (!document.getElementById('saveAsPDFsBtn')) {
                const saveAsPDFsBtn = document.createElement('button');
                saveAsPDFsBtn.id = 'saveAsPDFsBtn';
                saveAsPDFsBtn.className = 'btn';
                saveAsPDFsBtn.textContent = 'Save as PDFs';
                saveAsPDFsBtn.addEventListener('click', saveLettersAsPDFs);
                buttonsContainer.appendChild(saveAsPDFsBtn);
            }
            
            // Add Print Letters in Batch button if not already present
            if (!document.getElementById('batchPrintBtn')) {
                const batchPrintBtn = document.createElement('button');
                batchPrintBtn.id = 'batchPrintBtn';
                batchPrintBtn.className = 'btn';
                batchPrintBtn.textContent = 'Print Letters in Batch';
                batchPrintBtn.addEventListener('click', saveLettersAsPDFs); // Reuse the same function
                buttonsContainer.appendChild(batchPrintBtn);
            }
        }
    };
    
    // Handle CSV upload
    function handleCSVUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                csvData = results.data;
                
                if (csvData.length === 0) {
                    alert('No data found in the CSV file.');
                    return;
                }
                
                // Extract column names from the first row
                columnNames = Object.keys(csvData[0]);
                
                // Create checkboxes for field selection
                createFieldCheckboxes(columnNames);
                
                // Show field selection section
                fieldSelection.classList.remove('hidden');
            },
            error: function(error) {
                console.error('Error parsing CSV:', error);
                alert('Error parsing the CSV file. Please check the format.');
            }
        });
    }
    
    // Create checkboxes for field selection
    function createFieldCheckboxes(fields) {
        fieldCheckboxes.innerHTML = '';
        
        const expectedFields = [
            'Control', 'NCR', 'Address', 'Sales Order', 'Invoice', 
            'Invoice Date', 'Ship Date', 'Sales Representative', 
            'Item ID', 'Item Description', 'Quantity', 'ID', 
            'Customer Order', 'Contract Release#'
        ];
        
        // Process all fields from the CSV, not just expected ones
        fields.forEach(field => {
            const container = document.createElement('div');
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `field-${field.replace(/\s+/g, '-').toLowerCase()}`;
            checkbox.value = field;
            
            // Check by default if it's an expected field
            checkbox.checked = expectedFields.includes(field);
            
            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = field;
            
            // Add a class to distinguish expected vs custom fields (for potential styling)
            if (expectedFields.includes(field)) {
                container.classList.add('expected-field');
            } else {
                container.classList.add('custom-field');
            }
            
            container.appendChild(checkbox);
            container.appendChild(label);
            fieldCheckboxes.appendChild(container);
        });
    }
    
    // Handle logo upload
    function handleLogoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            logo = e.target.result;
            
            // Display preview
            logoPreview.innerHTML = '';
            const img = document.createElement('img');
            img.src = logo;
            img.alt = 'Company Logo';
            img.style.maxWidth = '100%';
            logoPreview.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
    
    // Initialize rich text editors for all paragraph fields
    function initializeRichTextEditors() {
        const paragraphFields = ['paragraph1', 'paragraph2', 'paragraph3', 'paragraph4', 'paragraph5', 'contactInfo'];
        
        paragraphFields.forEach(fieldId => {
            const textArea = document.getElementById(fieldId);
            if (textArea) {
                convertToRichText(fieldId);
            }
        });
    }

    // Convert a textarea to a rich text editor
    function convertToRichText(textareaId) {
        const textarea = document.getElementById(textareaId);
        if (!textarea) return;
        
        // Create container
        const container = document.createElement('div');
        container.className = 'rich-text-container';
        
        // Create toolbar
        const toolbar = createFormattingToolbar(textareaId);
        
        // Create rich text area
        const richTextArea = document.createElement('div');
        richTextArea.id = `${textareaId}-rich`;
        richTextArea.className = 'rich-text-area form-control';
        richTextArea.contentEditable = true;
        richTextArea.innerHTML = textarea.value.replace(/\n/g, '<br>');
        
        // Add event listener to update original textarea when rich text changes
        richTextArea.addEventListener('input', function() {
            textarea.value = richTextArea.innerHTML.replace(/<br>/g, '\n');
        });
        
        // Hide original textarea
        textarea.style.display = 'none';
        
        // Add elements to container
        container.appendChild(toolbar);
        container.appendChild(richTextArea);
        
        // Insert container after textarea
        textarea.parentNode.insertBefore(container, textarea.nextSibling);
        
        // Add event listeners for keyboard shortcuts
        richTextArea.addEventListener('keydown', function(e) {
            if (e.ctrlKey) {
                switch (e.key) {
                    case 'b':
                        e.preventDefault();
                        document.execCommand('bold');
                        break;
                    case 'i':
                        e.preventDefault();
                        document.execCommand('italic');
                        break;
                    case 'u':
                        e.preventDefault();
                        document.execCommand('underline');
                        break;
                }
            }
        });
    }

    // Create the formatting toolbar for a rich text editor
    function createFormattingToolbar(targetId) {
        const toolbar = document.createElement('div');
        toolbar.className = 'formatting-toolbar';
        
        // Bold button
        const boldBtn = document.createElement('button');
        boldBtn.type = 'button';
        boldBtn.className = 'format-btn';
        boldBtn.innerHTML = '<b>B</b>';
        boldBtn.title = 'Bold (Ctrl+B)';
        boldBtn.addEventListener('click', function() {
            document.execCommand('bold');
            document.getElementById(`${targetId}-rich`).focus();
        });
        
        // Italic button
        const italicBtn = document.createElement('button');
        italicBtn.type = 'button';
        italicBtn.className = 'format-btn';
        italicBtn.innerHTML = '<i>I</i>';
        italicBtn.title = 'Italic (Ctrl+I)';
        italicBtn.addEventListener('click', function() {
            document.execCommand('italic');
            document.getElementById(`${targetId}-rich`).focus();
        });
        
        // Underline button
        const underlineBtn = document.createElement('button');
        underlineBtn.type = 'button';
        underlineBtn.className = 'format-btn';
        underlineBtn.innerHTML = '<u>U</u>';
        underlineBtn.title = 'Underline (Ctrl+U)';
        underlineBtn.addEventListener('click', function() {
            document.execCommand('underline');
            document.getElementById(`${targetId}-rich`).focus();
        });
        
        // Separator
        const separator1 = document.createElement('div');
        separator1.className = 'format-separator';
        
        // Font color button and dropdown
        const colorContainer = document.createElement('div');
        colorContainer.className = 'format-dropdown';
        
        const colorBtn = document.createElement('button');
        colorBtn.type = 'button';
        colorBtn.className = 'format-btn color-btn';
        colorBtn.innerHTML = 'A';
        colorBtn.title = 'Text Color';
        colorBtn.style.color = '#000000';
        colorBtn.style.position = 'relative';

        // Add color indicator underline
        const colorIndicator = document.createElement('div');
        colorIndicator.className = 'color-indicator';
        colorIndicator.style.backgroundColor = '#000000';
        colorBtn.appendChild(colorIndicator);
        
        const colorDropdown = document.createElement('div');
        colorDropdown.className = 'format-dropdown-content color-dropdown';
        
        // Add common colors
        const colors = [
            {name: 'Black', value: '#000000'},
            {name: 'Dark Gray', value: '#444444'},
            {name: 'Gray', value: '#888888'},
            {name: 'Silver', value: '#CCCCCC'},
            {name: 'White', value: '#FFFFFF'},
            {name: 'Dark Red', value: '#AA0000'},
            {name: 'Red', value: '#FF0000'},
            {name: 'Orange', value: '#FF8800'},
            {name: 'Yellow', value: '#FFCC00'},
            {name: 'Dark Green', value: '#008800'},
            {name: 'Green', value: '#00CC00'},
            {name: 'Teal', value: '#00CCCC'},
            {name: 'Blue', value: '#0000FF'},
            {name: 'Navy', value: '#000088'},
            {name: 'Purple', value: '#8800CC'},
            {name: 'MRC Blue', value: '#00447c'}
        ];
        
        colors.forEach(color => {
            const colorOption = document.createElement('button');
            colorOption.type = 'button';
            colorOption.className = 'color-option';
            colorOption.style.backgroundColor = color.value;
            colorOption.setAttribute('data-color', color.value);
            colorOption.title = color.name;
            
            // For white color, add a border so it's visible
            if (color.value === '#FFFFFF') {
                colorOption.style.border = '1px solid #ccc';
            }
            
            colorOption.addEventListener('click', function() {
                document.execCommand('foreColor', false, color.value);
                colorBtn.style.color = color.value;
                colorIndicator.style.backgroundColor = color.value;
                document.getElementById(`${targetId}-rich`).focus();
            });
            
            colorDropdown.appendChild(colorOption);
        });
        
        // Custom color picker
        const customColorContainer = document.createElement('div');
        customColorContainer.className = 'custom-color-container';
        
        const customColorInput = document.createElement('input');
        customColorInput.type = 'color';
        customColorInput.className = 'custom-color-input';
        customColorInput.title = 'Custom Color';
        
        customColorInput.addEventListener('input', function() {
            const selectedColor = this.value;
            document.execCommand('foreColor', false, selectedColor);
            colorBtn.style.color = selectedColor;
            colorIndicator.style.backgroundColor = selectedColor;
            document.getElementById(`${targetId}-rich`).focus();
        });
        
        const customColorLabel = document.createElement('span');
        customColorLabel.className = 'custom-color-label';
        customColorLabel.textContent = 'Custom';
        
        customColorContainer.appendChild(customColorInput);
        customColorContainer.appendChild(customColorLabel);
        colorDropdown.appendChild(customColorContainer);
        
        colorContainer.appendChild(colorBtn);
        colorContainer.appendChild(colorDropdown);
        
        // Bullet list button
        const bulletListBtn = document.createElement('button');
        bulletListBtn.type = 'button';
        bulletListBtn.className = 'format-btn';
        bulletListBtn.innerHTML = '•';
        bulletListBtn.title = 'Bullet List';
        bulletListBtn.addEventListener('click', function() {
            document.execCommand('insertUnorderedList');
            document.getElementById(`${targetId}-rich`).focus();
        });
        
        // Numbered list button
        const numberedListBtn = document.createElement('button');
        numberedListBtn.type = 'button';
        numberedListBtn.className = 'format-btn';
        numberedListBtn.innerHTML = '1.';
        numberedListBtn.title = 'Numbered List';
        numberedListBtn.addEventListener('click', function() {
            document.execCommand('insertOrderedList');
            document.getElementById(`${targetId}-rich`).focus();
        });
        
        // Separator
        const separator2 = document.createElement('div');
        separator2.className = 'format-separator';
        
        // Align left button
        const alignLeftBtn = document.createElement('button');
        alignLeftBtn.type = 'button';
        alignLeftBtn.className = 'format-btn';
        alignLeftBtn.innerHTML = '≡';
        alignLeftBtn.title = 'Align Left';
        alignLeftBtn.addEventListener('click', function() {
            document.execCommand('justifyLeft');
            document.getElementById(`${targetId}-rich`).focus();
        });
        
        // Align center button
        const alignCenterBtn = document.createElement('button');
        alignCenterBtn.type = 'button';
        alignCenterBtn.className = 'format-btn';
        alignCenterBtn.innerHTML = '≡';
        alignCenterBtn.style.textAlign = 'center';
        alignCenterBtn.title = 'Align Center';
        alignCenterBtn.addEventListener('click', function() {
            document.execCommand('justifyCenter');
            document.getElementById(`${targetId}-rich`).focus();
        });
        
        // Align right button
        const alignRightBtn = document.createElement('button');
        alignRightBtn.type = 'button';
        alignRightBtn.className = 'format-btn';
        alignRightBtn.innerHTML = '≡';
        alignRightBtn.style.textAlign = 'right';
        alignRightBtn.title = 'Align Right';
        alignRightBtn.addEventListener('click', function() {
            document.execCommand('justifyRight');
            document.getElementById(`${targetId}-rich`).focus();
        });
        
        // Separator
        const separator3 = document.createElement('div');
        separator3.className = 'format-separator';
        
        // Clear formatting button
        const clearFormattingBtn = document.createElement('button');
        clearFormattingBtn.type = 'button';
        clearFormattingBtn.className = 'format-btn';
        clearFormattingBtn.innerHTML = 'Clear';
        clearFormattingBtn.title = 'Clear Formatting';
        clearFormattingBtn.addEventListener('click', function() {
            document.execCommand('removeFormat');
            document.getElementById(`${targetId}-rich`).focus();
        });
        
        // Add buttons to toolbar
        toolbar.appendChild(boldBtn);
        toolbar.appendChild(italicBtn);
        toolbar.appendChild(underlineBtn);
        toolbar.appendChild(separator1);
        toolbar.appendChild(colorContainer); 
        toolbar.appendChild(separator2);
        toolbar.appendChild(bulletListBtn);
        toolbar.appendChild(numberedListBtn);
        toolbar.appendChild(separator3);
        toolbar.appendChild(alignLeftBtn);
        toolbar.appendChild(alignCenterBtn);
        toolbar.appendChild(alignRightBtn);
        toolbar.appendChild(separator3);
        toolbar.appendChild(clearFormattingBtn);
        
        return toolbar;
    }

    // Function to get formatted content from rich text editor for letter generation
    function getFormattedContent(fieldId) {
        const richTextArea = document.getElementById(`${fieldId}-rich`);
        if (richTextArea) {
            return richTextArea.innerHTML;
        }
        return document.getElementById(fieldId).value.replace(/\n/g, '<br>');
    }

    // Generate letters
    function generateLetters() {
        const recallDate = document.getElementById('recallDate').value;
        const manufacturer = document.getElementById('manufacturer').value;
        const ncr = document.getElementById('ncr').value;
        const materialCategory = document.getElementById('materialCategory').value;
        const issue = document.getElementById('issue').value;
        const heatNumber = document.getElementById('heatNumber').value;
        
        // Get custom field values
        const customField1 = document.getElementById('customField1').value;
        const customField2 = document.getElementById('customField2').value;
        const customField3 = document.getElementById('customField3').value;
        const customField4 = document.getElementById('customField4').value;
        const customField5 = document.getElementById('customField5').value;
        
        // Get content override checkbox and text
        const isContentOverride = useContentOverride && useContentOverride.checked;
        const overrideText = contentOverride && contentOverride.value ? 
                            getFormattedContent('contentOverride') : '';
        
        // Get formatted letter content from rich text editors
        const letterTitle = document.getElementById('letterTitle').value;
        const paragraph1 = getFormattedContent('paragraph1');
        const paragraph2 = getFormattedContent('paragraph2');
        const paragraph3 = getFormattedContent('paragraph3');
        const paragraph4 = getFormattedContent('paragraph4');
        const paragraph5 = getFormattedContent('paragraph5');
        const contactInfo = getFormattedContent('contactInfo');
        
        // Validate required fields
        if (!recallDate || !manufacturer || !ncr || !materialCategory || !issue) {
            alert('Please fill in all required recall information fields.');
            return;
        }
        
        // Check if CSV data is available
        if (csvData.length === 0) {
            alert('Please upload a CSV file with customer data.');
            return;
        }
        
        // Get selected grouping method
        const groupByRadios = document.getElementsByName('groupBy');
        let groupBy;
        for (const radio of groupByRadios) {
            if (radio.checked) {
                groupBy = radio.value;
                break;
            }
        }
        
        // Get selected fields to display
        const selectedFields = [];
        const fieldCheckboxElements = fieldCheckboxes.querySelectorAll('input[type="checkbox"]');
        fieldCheckboxElements.forEach(checkbox => {
            if (checkbox.checked) {
                selectedFields.push(checkbox.value);
            }
        });
        
        // Group data based on selected method
        const groupedData = groupDataBy(csvData, groupBy);
        
        // Generate letter HTML
        letters.innerHTML = '';
        generatedLetters = []; // Clear previous letter data
        
        Object.keys(groupedData).forEach(key => {
            const records = groupedData[key];
            if (records.length > 0) {
                // Create letter
                const letter = createLetter(
                    records, 
                    recallDate, 
                    manufacturer, 
                    ncr, 
                    materialCategory, 
                    issue, 
                    selectedFields,
                    heatNumber,
                    letterTitle,
                    paragraph1,
                    paragraph2,
                    paragraph3,
                    paragraph4,
                    paragraph5,
                    contactInfo,
                    {
                        field1: customField1,
                        field2: customField2,
                        field3: customField3,
                        field4: customField4,
                        field5: customField5
                    },
                    isContentOverride,
                    overrideText
                );
                
                letters.appendChild(letter);
                
                // Store letter data for export
                generatedLetters.push({
                    element: letter,
                    control: records[0].Control || 'Unknown',
                    manufacturer: manufacturer,
                    recallDate: recallDate,
                    address: records[0].Address || '',
                    ncr: ncr,
                    materialCategory: materialCategory,
                    issue: issue,
                    heatNumber: heatNumber,
                    records: records,
                    letterTitle: letterTitle,
                    paragraph1: paragraph1,
                    paragraph2: paragraph2,
                    paragraph3: paragraph3,
                    paragraph4: paragraph4,
                    paragraph5: paragraph5,
                    contactInfo: contactInfo,
                    customFields: {
                        field1: customField1,
                        field2: customField2,
                        field3: customField3,
                        field4: customField4,
                        field5: customField5
                    },
                    isContentOverride: isContentOverride,
                    overrideText: overrideText
                });
            }
        });
        
        // Show letters container
        lettersContainer.classList.remove('hidden');
        
        // Update UI after letters are generated
        updateLettersUI();
    }

    // Group data by specified criteria
    function groupDataBy(data, groupBy) {
        const groupedData = {};
        
        switch (groupBy) {
            case 'Control':
                data.forEach(row => {
                    const key = row.Control || 'Unknown';
                    if (!groupedData[key]) {
                        groupedData[key] = [];
                    }
                    groupedData[key].push(row);
                });
                break;
                
            case 'ItemAddress':
                data.forEach(row => {
                    const key = `${row['Item ID'] || 'Unknown'}-${row.Address || 'Unknown'}`;
                    if (!groupedData[key]) {
                        groupedData[key] = [];
                    }
                    groupedData[key].push(row);
                });
                break;
                
            case 'SSR':
                data.forEach(row => {
                    const key = row['Sales Representative'] || 'Unknown';
                    if (!groupedData[key]) {
                        groupedData[key] = [];
                    }
                    groupedData[key].push(row);
                });
                break;
                
            case 'ItemOrder':
                data.forEach(row => {
                    const key = `${row['Item ID'] || 'Unknown'}-${row['Customer Order'] || 'Unknown'}`;
                    if (!groupedData[key]) {
                        groupedData[key] = [];
                    }
                    groupedData[key].push(row);
                });
                break;
                
            case 'Line':
                // Create individual letter for each line item (no grouping)
                data.forEach((row, index) => {
                    const key = `line-${index}`; // Unique key for each row
                    groupedData[key] = [row]; // Array with just this one row
                });
                break;
                
            default:
                // Default to Control Number
                data.forEach(row => {
                    const key = row.Control || 'Unknown';
                    if (!groupedData[key]) {
                        groupedData[key] = [];
                    }
                    groupedData[key].push(row);
                });
        }
        
        return groupedData;
    }

    // Create a letter element
    function createLetter(records, recallDate, manufacturer, ncr, materialCategory, issue, selectedFields, heatNumber, 
                          letterTitle, paragraph1, paragraph2, paragraph3, paragraph4, paragraph5, contactInfo, customFields,
                          isContentOverride, overrideText) {
        const letterDiv = document.createElement('div');
        letterDiv.className = 'letter';
        
        // Format date from user input
        const formattedDate = new Date(recallDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Get control number and address from first record
        const controlNumber = records[0].Control || '';
        const address = records[0].Address || '';
        
        // Don't format address with line breaks - use as is
        const formattedAddress = address;
        
        // Create letter header
        const letterHeader = document.createElement('div');
        letterHeader.className = 'letter-header';
        
        const logoContainer = document.createElement('div');
        logoContainer.className = 'logo-address-container';
        
        const logoDiv = document.createElement('div');
        const logoImg = document.createElement('img');
        logoImg.src = logo;
        logoImg.alt = 'Company Logo';
        logoImg.className = 'letter-logo';
        logoDiv.appendChild(logoImg);
        logoContainer.appendChild(logoDiv);
        
        // Add address under the logo with proper line wrapping
        const addressDiv = document.createElement('div');
        addressDiv.className = 'letter-address editable';
        addressDiv.textContent = formattedAddress;
        addressDiv.setAttribute('data-original', formattedAddress);
        addressDiv.setAttribute('data-field', 'address');
        makeEditable(addressDiv);
        logoContainer.appendChild(addressDiv);
        
        const dateDiv = document.createElement('div');
        dateDiv.className = 'letter-date';
        dateDiv.textContent = `Recall Date: ${formattedDate}`;
        
        letterHeader.appendChild(logoContainer);
        letterHeader.appendChild(dateDiv);
        
        // Create letter title
        const titleDiv = document.createElement('div');
        titleDiv.className = 'letter-title editable';
        titleDiv.textContent = letterTitle;
        titleDiv.setAttribute('data-original', letterTitle);
        titleDiv.setAttribute('data-field', 'letterTitle');
        makeEditable(titleDiv);
        
        // Create manufacturer
        const manufacturerDiv = document.createElement('div');
        manufacturerDiv.className = 'letter-manufacturer editable';
        manufacturerDiv.textContent = `Manufacturer: ${manufacturer}`;
        manufacturerDiv.setAttribute('data-original', `Manufacturer: ${manufacturer}`);
        manufacturerDiv.setAttribute('data-field', 'manufacturer');
        makeEditable(manufacturerDiv);
        
        // Add heat number if provided
        let heatNumberText = '';
        if (heatNumber) {
            heatNumberText = ` | Heat Number: ${heatNumber}`;
        }
        
        // Create control number
        const controlDiv = document.createElement('div');
        controlDiv.className = 'letter-control editable';
        controlDiv.textContent = `Control #: ${controlNumber}${heatNumberText}`;
        controlDiv.setAttribute('data-original', `Control #: ${controlNumber}${heatNumberText}`);
        controlDiv.setAttribute('data-field', 'control');
        makeEditable(controlDiv);
        
        // Create NCR
        const ncrDiv = document.createElement('div');
        ncrDiv.className = 'letter-ncr editable';
        ncrDiv.textContent = `NCR: ${ncr}`;
        ncrDiv.setAttribute('data-original', `NCR: ${ncr}`);
        ncrDiv.setAttribute('data-field', 'ncr');
        makeEditable(ncrDiv);
        
        // Create letter content
        const contentDiv = document.createElement('div');
        contentDiv.className = 'letter-content';
        
        // Handle content based on override checkbox
        if (isContentOverride && overrideText) {
            // Use override text instead of individual paragraphs
            let formattedOverrideText = overrideText
                .replace(/\[MANUFACTURER\]/g, manufacturer)
                .replace(/\[MATERIAL_CATEGORY\]/g, materialCategory)
                .replace(/\[ISSUE\]/g, issue)
                .replace(/\[HEAT_NUMBER\]/g, heatNumber)
                .replace(/\[FIELD1\]/g, customFields.field1)
                .replace(/\[FIELD2\]/g, customFields.field2)
                .replace(/\[FIELD3\]/g, customFields.field3)
                .replace(/\[FIELD4\]/g, customFields.field4)
                .replace(/\[FIELD5\]/g, customFields.field5);
            
            // Create a single content element with the override text
            const overrideContentElem = document.createElement('div');
            overrideContentElem.className = 'editable override-content';
            overrideContentElem.innerHTML = formattedOverrideText;
            
            overrideContentElem.setAttribute('data-original', formattedOverrideText);
            overrideContentElem.setAttribute('data-field', 'overrideContent');
            makeEditable(overrideContentElem);
            
            contentDiv.appendChild(overrideContentElem);
        } else {
            // Use standard paragraphs with formatting
            // Replace placeholders in paragraph text
            let formattedParagraph1 = paragraph1
                .replace(/\[MANUFACTURER\]/g, manufacturer)
                .replace(/\[MATERIAL_CATEGORY\]/g, materialCategory)
                .replace(/\[ISSUE\]/g, issue)
                .replace(/\[FIELD1\]/g, customFields.field1)
                .replace(/\[FIELD2\]/g, customFields.field2)
                .replace(/\[FIELD3\]/g, customFields.field3)
                .replace(/\[FIELD4\]/g, customFields.field4)
                .replace(/\[FIELD5\]/g, customFields.field5);
                
            let formattedParagraph2 = paragraph2
                .replace(/\[FIELD1\]/g, customFields.field1)
                .replace(/\[FIELD2\]/g, customFields.field2)
                .replace(/\[FIELD3\]/g, customFields.field3)
                .replace(/\[FIELD4\]/g, customFields.field4)
                .replace(/\[FIELD5\]/g, customFields.field5);
                
            let formattedParagraph3 = paragraph3
                .replace(/\[MATERIAL_CATEGORY\]/g, materialCategory)
                .replace(/\[FIELD1\]/g, customFields.field1)
                .replace(/\[FIELD2\]/g, customFields.field2)
                .replace(/\[FIELD3\]/g, customFields.field3)
                .replace(/\[FIELD4\]/g, customFields.field4)
                .replace(/\[FIELD5\]/g, customFields.field5);
                
            let formattedParagraph4 = paragraph4
                .replace(/\[FIELD1\]/g, customFields.field1)
                .replace(/\[FIELD2\]/g, customFields.field2)
                .replace(/\[FIELD3\]/g, customFields.field3)
                .replace(/\[FIELD4\]/g, customFields.field4)
                .replace(/\[FIELD5\]/g, customFields.field5);
                
            let formattedParagraph5 = paragraph5
                .replace(/\[FIELD1\]/g, customFields.field1)
                .replace(/\[FIELD2\]/g, customFields.field2)
                .replace(/\[FIELD3\]/g, customFields.field3)
                .replace(/\[FIELD4\]/g, customFields.field4)
                .replace(/\[FIELD5\]/g, customFields.field5);
                
            let formattedContactInfo = contactInfo
                .replace(/\[FIELD1\]/g, customFields.field1)
                .replace(/\[FIELD2\]/g, customFields.field2)
                .replace(/\[FIELD3\]/g, customFields.field3)
                .replace(/\[FIELD4\]/g, customFields.field4)
                .replace(/\[FIELD5\]/g, customFields.field5);
        
            const paragraph1Elem = document.createElement('div');
            paragraph1Elem.className = 'editable';
            paragraph1Elem.innerHTML = formattedParagraph1;
            paragraph1Elem.setAttribute('data-original', formattedParagraph1);
            paragraph1Elem.setAttribute('data-field', 'paragraph1');
            makeEditable(paragraph1Elem);
            
            const paragraph2Elem = document.createElement('div');
            paragraph2Elem.className = 'editable';
            paragraph2Elem.innerHTML = formattedParagraph2;
            paragraph2Elem.setAttribute('data-original', formattedParagraph2);
            paragraph2Elem.setAttribute('data-field', 'paragraph2');
            makeEditable(paragraph2Elem);
            
            const paragraph3Elem = document.createElement('div');
            paragraph3Elem.className = 'editable';
            paragraph3Elem.innerHTML = formattedParagraph3;
            paragraph3Elem.setAttribute('data-original', formattedParagraph3);
            paragraph3Elem.setAttribute('data-field', 'paragraph3');
            makeEditable(paragraph3Elem);
            
            const paragraph4Elem = document.createElement('div');
            paragraph4Elem.className = 'editable';
            paragraph4Elem.innerHTML = formattedParagraph4;
            paragraph4Elem.setAttribute('data-original', formattedParagraph4);
            paragraph4Elem.setAttribute('data-field', 'paragraph4');
            makeEditable(paragraph4Elem);
            
            const paragraph5Elem = document.createElement('div');
            paragraph5Elem.className = 'editable';
            paragraph5Elem.innerHTML = formattedParagraph5;
            paragraph5Elem.setAttribute('data-original', formattedParagraph5);
            paragraph5Elem.setAttribute('data-field', 'paragraph5');
            makeEditable(paragraph5Elem);
            
            const contactInfoElem = document.createElement('div');
            contactInfoElem.className = 'editable';
            contactInfoElem.innerHTML = formattedContactInfo;
            contactInfoElem.setAttribute('data-original', formattedContactInfo);
            contactInfoElem.setAttribute('data-field', 'contactInfo');
            contactInfoElem.style.marginTop = '20px';
            makeEditable(contactInfoElem);
            
            // Add all paragraphs to the content div
            contentDiv.appendChild(paragraph1Elem);
            contentDiv.appendChild(paragraph2Elem);
            contentDiv.appendChild(paragraph3Elem);
            contentDiv.appendChild(paragraph4Elem);
            contentDiv.appendChild(paragraph5Elem);
            contentDiv.appendChild(contactInfoElem);
        }
        
        // Create order table
        const table = document.createElement('table');
        table.className = 'letter-table';
        
        // Table header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        selectedFields.forEach(field => {
            if (columnNames.includes(field)) {
                const th = document.createElement('th');
                th.textContent = field;
                headerRow.appendChild(th);
            }
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Table body
        const tbody = document.createElement('tbody');
        
        records.forEach(record => {
            const row = document.createElement('tr');
            
            selectedFields.forEach(field => {
                if (columnNames.includes(field)) {
                    const td = document.createElement('td');
                    td.textContent = record[field] || '';
                    row.appendChild(td);
                }
            });
            
            tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
        
        // Add individual print button
        const printButtonContainer = document.createElement('div');
        printButtonContainer.className = 'letter-print-button-container no-print';
        
        const printButton = document.createElement('button');
        printButton.className = 'btn letter-print-btn';
        printButton.textContent = 'Print This Letter';
        printButton.addEventListener('click', function() {
            printSingleLetter(letterDiv);
        });
        
        printButtonContainer.appendChild(printButton);
        
        // Assemble letter
        letterDiv.appendChild(printButtonContainer);
        letterDiv.appendChild(letterHeader);
        letterDiv.appendChild(titleDiv);
        letterDiv.appendChild(manufacturerDiv);
        letterDiv.appendChild(controlDiv);
        letterDiv.appendChild(ncrDiv);
        letterDiv.appendChild(contentDiv);
        letterDiv.appendChild(table);
        
        return letterDiv;
    }

    // Make an element editable with click and save/cancel functionality
    function makeEditable(element) {
        element.addEventListener('click', function(e) {
            // Prevent editing if we're already editing something
            if (document.querySelector('.editing')) {
                return;
            }
            
            // Get the letter container to track the edits
            const letterContainer = findLetterContainer(element);
            if (!letterContainer) return;
            
            // Add editing class
            element.classList.add('editing');
            
            // Store original content
            const originalContent = element.innerHTML;
            
            // Make element editable
            element.contentEditable = true;
            element.focus();
            
            // Create edit controls
            const controlsDiv = document.createElement('div');
            controlsDiv.className = 'edit-controls';
            
            const saveBtn = document.createElement('button');
            saveBtn.className = 'edit-btn save-edit-btn';
            saveBtn.textContent = 'Save';
            
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'edit-btn cancel-edit-btn';
            cancelBtn.textContent = 'Cancel';
            
            controlsDiv.appendChild(saveBtn);
            controlsDiv.appendChild(cancelBtn);
            element.parentNode.insertBefore(controlsDiv, element.nextSibling);
            
            // Add indicator
            const indicator = document.createElement('div');
            indicator.className = 'edit-indicator';
            indicator.textContent = 'Editing';
            element.appendChild(indicator);
            
            // Save button handler
            saveBtn.addEventListener('click', function() {
                finishEditing(true);
            });
            
            // Cancel button handler
            cancelBtn.addEventListener('click', function() {
                finishEditing(false);
            });
            
            // Track if editing is still active
            let isEditingActive = true;
            
            // Function to finish editing (save or cancel)
            function finishEditing(save) {
                // Only proceed if editing is still active
                if (!isEditingActive) return;
                isEditingActive = false;
                
                // Remove event listeners first
                document.removeEventListener('mousedown', handleOutsideClick);
                document.removeEventListener('keydown', handleEscape);
                
                if (save) {
                    // Get the modified content - preserve HTML
                    const newContent = element.innerHTML.replace(/<div class="edit-indicator">.*?<\/div>/g, '').trim();
                    
                    // Update the element - preserve HTML
                    element.innerHTML = newContent;
                    
                    // Update the generatedLetters array
                    const letterIndex = Array.from(letters.children).indexOf(letterContainer);
                    if (letterIndex !== -1 && element.hasAttribute('data-field')) {
                        const field = element.getAttribute('data-field');
                        
                        // Update the relevant field in the stored data - preserve HTML
                        switch (field) {
                            case 'address':
                                generatedLetters[letterIndex].address = newContent;
                                break;
                            case 'letterTitle':
                                generatedLetters[letterIndex].letterTitle = newContent;
                                break;
                            case 'manufacturer':
                                generatedLetters[letterIndex].manufacturer = newContent.replace('Manufacturer: ', '');
                                break;
                            case 'control':
                                // Extract just the control number from the text
                                const controlMatch = newContent.match(/Control #: (.*?)(?:\s\|.*)?$/);
                                if (controlMatch) {
                                    generatedLetters[letterIndex].control = controlMatch[1];
                                }
                                break;
                            case 'ncr':
                                generatedLetters[letterIndex].ncr = newContent.replace('NCR: ', '');
                                break;
                            case 'paragraph1':
                                generatedLetters[letterIndex].paragraph1 = newContent;
                                break;
                            case 'paragraph2':
                                generatedLetters[letterIndex].paragraph2 = newContent;
                                break;
                            case 'paragraph3':
                                generatedLetters[letterIndex].paragraph3 = newContent;
                                break;
                            case 'paragraph4':
                                generatedLetters[letterIndex].paragraph4 = newContent;
                                break;
                            case 'paragraph5':
                                generatedLetters[letterIndex].paragraph5 = newContent;
                                break;
                            case 'contactInfo':
                                generatedLetters[letterIndex].contactInfo = newContent;
                                break;
                        }
                    }
                } else {
                    // Reset to original content - preserve HTML
                    element.innerHTML = originalContent;
                }
                
                // Clean up
                element.contentEditable = false;
                element.classList.remove('editing');
                
                // Safely remove controls if they're still in the DOM
                if (controlsDiv.parentNode) {
                    controlsDiv.parentNode.removeChild(controlsDiv);
                }
                
                // Safely remove indicator if it's still in the DOM
                const indicatorElement = element.querySelector('.edit-indicator');
                if (indicatorElement && indicatorElement.parentNode) {
                    indicatorElement.parentNode.removeChild(indicatorElement);
                }
            }
            
            // Handle clicking outside or pressing escape
            function handleOutsideClick(event) {
                // Only proceed if editing is still active
                if (!isEditingActive) return;
                
                if (!element.contains(event.target) && 
                    !controlsDiv.contains(event.target)) {
                    finishEditing(true); // Auto-save on outside click
                }
            }
            
            function handleEscape(event) {
                // Only proceed if editing is still active
                if (!isEditingActive) return;
                
                if (event.key === 'Escape') {
                    finishEditing(false);
                } else if (event.key === 'Enter' && !event.shiftKey) {
                    // Save on Enter (but allow Shift+Enter for new lines)
                    event.preventDefault();
                    finishEditing(true);
                }
            }
            
            // Add event listeners
            setTimeout(() => {
                document.addEventListener('mousedown', handleOutsideClick);
                document.addEventListener('keydown', handleEscape);
            }, 100);
        });
    }

    // Helper function to find the letter container from a child element
    function findLetterContainer(element) {
        let current = element;
        while (current && !current.classList.contains('letter')) {
            current = current.parentElement;
        }
        return current;
    }

    // Update the letter HTML to reflect any edits before exporting
    function updateLetterBeforeExport(letterElement, letterData) {
        // This function ensures the letter content reflects any manual edits
        // before generating PDFs, images or text exports
        
        // Update address if edited
        const addressElem = letterElement.querySelector('.letter-address');
        if (addressElem) {
            addressElem.innerHTML = letterData.address;
        }
        
        // Update title if edited
        const titleElem = letterElement.querySelector('.letter-title');
        if (titleElem) {
            titleElem.innerHTML = letterData.letterTitle;
        }
        
        // Update manufacturer if edited
        const manufacturerElem = letterElement.querySelector('.letter-manufacturer');
        if (manufacturerElem) {
            manufacturerElem.innerHTML = `Manufacturer: ${letterData.manufacturer}`;
        }
        
        // Update NCR if edited
        const ncrElem = letterElement.querySelector('.letter-ncr');
        if (ncrElem) {
            ncrElem.innerHTML = `NCR: ${letterData.ncr}`;
        }
        
        // Update control number if edited
        const controlElem = letterElement.querySelector('.letter-control');
        if (controlElem) {
            let heatNumberText = '';
            if (letterData.heatNumber) {
                heatNumberText = ` | Heat Number: ${letterData.heatNumber}`;
            }
            controlElem.innerHTML = `Control #: ${letterData.control}${heatNumberText}`;
        }
        
        // Check if using content override or standard paragraphs
        if (letterData.isContentOverride && letterData.overrideText) {
            // Update override content
            const contentDiv = letterElement.querySelector('.letter-content');
            if (contentDiv) {
                contentDiv.innerHTML = ''; // Clear existing content
                
                // Format override text
                let formattedOverrideText = letterData.overrideText
                    .replace(/\[MANUFACTURER\]/g, letterData.manufacturer)
                    .replace(/\[MATERIAL_CATEGORY\]/g, letterData.materialCategory)
                    .replace(/\[ISSUE\]/g, letterData.issue)
                    .replace(/\[HEAT_NUMBER\]/g, letterData.heatNumber || '')
                    .replace(/\[FIELD1\]/g, letterData.customFields.field1 || '')
                    .replace(/\[FIELD2\]/g, letterData.customFields.field2 || '')
                    .replace(/\[FIELD3\]/g, letterData.customFields.field3 || '')
                    .replace(/\[FIELD4\]/g, letterData.customFields.field4 || '')
                    .replace(/\[FIELD5\]/g, letterData.customFields.field5 || '');
                
                // Create content element with formatted text
                const overrideContentElem = document.createElement('div');
                overrideContentElem.className = 'override-content';
                
                // Split by lines and create paragraph elements
                const lines = formattedOverrideText.split('\n');
                
                lines.forEach((line, index) => {
                    if (line.trim() === '') {
                        // Empty line, add a line break
                        overrideContentElem.appendChild(document.createElement('br'));
                    } else {
                        // Create paragraph for non-empty lines
                        const p = document.createElement('p');
                        p.textContent = line;
                        overrideContentElem.appendChild(p);
                    }
                });
                
                contentDiv.appendChild(overrideContentElem);
            }
        } else {
            // Update standard paragraphs if edited
            const paragraphs = letterElement.querySelectorAll('.letter-content div');
            if (paragraphs.length >= 6) {
                // Process all placeholders in paragraphs
                paragraphs[0].innerHTML = letterData.paragraph1
                    .replace(/\[MANUFACTURER\]/g, letterData.manufacturer)
                    .replace(/\[MATERIAL_CATEGORY\]/g, letterData.materialCategory)
                    .replace(/\[ISSUE\]/g, letterData.issue)
                    .replace(/\[FIELD1\]/g, letterData.customFields.field1 || '')
                    .replace(/\[FIELD2\]/g, letterData.customFields.field2 || '')
                    .replace(/\[FIELD3\]/g, letterData.customFields.field3 || '')
                    .replace(/\[FIELD4\]/g, letterData.customFields.field4 || '')
                    .replace(/\[FIELD5\]/g, letterData.customFields.field5 || '');
                    
                paragraphs[1].innerHTML = letterData.paragraph2
                    .replace(/\[MATERIAL_CATEGORY\]/g, letterData.materialCategory)
                    .replace(/\[FIELD1\]/g, letterData.customFields.field1 || '')
                    .replace(/\[FIELD2\]/g, letterData.customFields.field2 || '')
                    .replace(/\[FIELD3\]/g, letterData.customFields.field3 || '')
                    .replace(/\[FIELD4\]/g, letterData.customFields.field4 || '')
                    .replace(/\[FIELD5\]/g, letterData.customFields.field5 || '');
                    
                paragraphs[2].innerHTML = letterData.paragraph3
                    .replace(/\[MATERIAL_CATEGORY\]/g, letterData.materialCategory)
                    .replace(/\[FIELD1\]/g, letterData.customFields.field1 || '')
                    .replace(/\[FIELD2\]/g, letterData.customFields.field2 || '')
                    .replace(/\[FIELD3\]/g, letterData.customFields.field3 || '')
                    .replace(/\[FIELD4\]/g, letterData.customFields.field4 || '')
                    .replace(/\[FIELD5\]/g, letterData.customFields.field5 || '');
                    
                paragraphs[3].innerHTML = letterData.paragraph4
                    .replace(/\[FIELD1\]/g, letterData.customFields.field1 || '')
                    .replace(/\[FIELD2\]/g, letterData.customFields.field2 || '')
                    .replace(/\[FIELD3\]/g, letterData.customFields.field3 || '')
                    .replace(/\[FIELD4\]/g, letterData.customFields.field4 || '')
                    .replace(/\[FIELD5\]/g, letterData.customFields.field5 || '');
                    
                paragraphs[4].innerHTML = letterData.paragraph5
                    .replace(/\[FIELD1\]/g, letterData.customFields.field1 || '')
                    .replace(/\[FIELD2\]/g, letterData.customFields.field2 || '')
                    .replace(/\[FIELD3\]/g, letterData.customFields.field3 || '')
                    .replace(/\[FIELD4\]/g, letterData.customFields.field4 || '')
                    .replace(/\[FIELD5\]/g, letterData.customFields.field5 || '');
                    
                paragraphs[5].innerHTML = letterData.contactInfo
                    .replace(/\[FIELD1\]/g, letterData.customFields.field1 || '')
                    .replace(/\[FIELD2\]/g, letterData.customFields.field2 || '')
                    .replace(/\[FIELD3\]/g, letterData.customFields.field3 || '')
                    .replace(/\[FIELD4\]/g, letterData.customFields.field4 || '')
                    .replace(/\[FIELD5\]/g, letterData.customFields.field5 || '');
            }
        }
        
        return letterElement;
    }

    // Save letters as PDF files and download as ZIP
    async function saveLettersAsPDFs() {
        if (generatedLetters.length === 0) {
            alert('No letters to save. Please generate letters first.');
            return;
        }
        
        // Check if jsPDF is available using a safer approach
        if (typeof window.jspdf === 'undefined' || !window.jspdf.jsPDF) {
            alert('PDF library not loaded. Please check your internet connection and try again.');
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const zip = new JSZip();
        const letterElements = document.querySelectorAll('.letter');
        
        // Show loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-overlay';
        loadingDiv.innerHTML = '<div class="loading-spinner"></div><p>Converting letters to PDFs...</p>';
        document.body.appendChild(loadingDiv);
        
        try {
            // Process each letter
            for (let i = 0; i < letterElements.length; i++) {
                const letterData = generatedLetters[i];
                let letterElement = letterElements[i];
                
                // Create a clone and update it with any edits before processing
                const clonedLetter = letterElement.cloneNode(true);
                updateLetterBeforeExport(clonedLetter, letterData);
                
                // Remove all no-print elements including the "Print This Letter" button
                const noPrintElements = clonedLetter.querySelectorAll('.no-print');
                noPrintElements.forEach(elem => elem.remove());
                
                // Ensure all edit controls are removed
                const editControls = clonedLetter.querySelectorAll('.edit-controls, .edit-indicator');
                editControls.forEach(ctrl => ctrl.remove());
                
                // Format date for filename
                const dateObj = new Date(letterData.recallDate);
                const formattedDate = `${dateObj.getFullYear()}-${(dateObj.getMonth()+1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')}`;
                
                // Create filename
                const fileName = `${letterData.ncr} - ${letterData.control} - ${letterData.manufacturer} - ${formattedDate}.pdf`;
                
                clonedLetter.style.position = 'absolute';
                clonedLetter.style.left = '-9999px';
                clonedLetter.style.background = 'white';
                document.body.appendChild(clonedLetter);
                
                // Convert letter HTML to canvas
                const canvas = await html2canvas(clonedLetter, {
                    scale: 2, // Higher resolution
                    backgroundColor: '#ffffff',
                    logging: false,
                    useCORS: true // Enable CORS for images
                });
                
                // Remove the cloned element
                document.body.removeChild(clonedLetter);
                
                // Get canvas dimensions and create PDF of appropriate size
                const imgWidth = 210; // A4 width in mm
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                const pdf = new jsPDF('p', 'mm', 'a4');
                
                // Add canvas image to PDF
                const imgData = canvas.toDataURL('image/jpeg', 1.0);
                pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
                
                // Get PDF as blob
                const pdfBlob = pdf.output('blob');
                
                // Add file to zip
                zip.file(fileName, pdfBlob);
            }
            
            // Generate zip and trigger download
            const zipContent = await zip.generateAsync({type: 'blob'});
            
            // Create download link
            const a = document.createElement('a');
            const url = URL.createObjectURL(zipContent);
            a.href = url;
            a.download = `Recall_Letters_PDFs_${new Date().toISOString().slice(0,10)}.zip`;
            document.body.appendChild(a);
            a.click();
            
            // Cleanup
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
            
        } catch (error) {
            console.error('Error generating PDFs:', error);
            alert('There was an error generating the PDFs. Please try again.');
        } finally {
            // Remove loading indicator
            document.body.removeChild(loadingDiv);
        }
    }

    // Save letters as JPG images and download as ZIP
    async function saveLettersAsImages() {
        if (generatedLetters.length === 0) {
            alert('No letters to save. Please generate letters first.');
            return;
        }
        
        const zip = new JSZip();
        const letterElements = document.querySelectorAll('.letter');
        
        // Show loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-overlay';
        loadingDiv.innerHTML = '<div class="loading-spinner"></div><p>Converting letters to images...</p>';
        document.body.appendChild(loadingDiv);
        
        try {
            // Process each letter
            for (let i = 0; i < letterElements.length; i++) {
                const letterData = generatedLetters[i];
                let letterElement = letterElements[i];
                
                // Create a clone and update it with any edits before processing
                const clonedLetter = letterElement.cloneNode(true);
                updateLetterBeforeExport(clonedLetter, letterData);
                
                // Remove all no-print elements
                const noPrintElements = clonedLetter.querySelectorAll('.no-print');
                noPrintElements.forEach(elem => elem.remove());
                
                // Format date for filename
                const dateObj = new Date(letterData.recallDate);
                const formattedDate = `${dateObj.getFullYear()}-${(dateObj.getMonth()+1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')}`;
                
                // Create filename
                const fileName = `${letterData.ncr} - ${letterData.control} - ${letterData.manufacturer} - ${formattedDate}.jpg`;
                
                // Prepare the letter element for image rendering
                clonedLetter.style.position = 'absolute';
                clonedLetter.style.left = '-9999px';
                clonedLetter.style.background = 'white';
                
                // Remove edit controls and indicators if present
                const editControls = clonedLetter.querySelectorAll('.edit-controls, .edit-indicator');
                editControls.forEach(ctrl => ctrl.remove());
                
                document.body.appendChild(clonedLetter);
                
                // Convert letter HTML to canvas
                const canvas = await html2canvas(clonedLetter, {
                    scale: 2, // Higher resolution
                    backgroundColor: '#ffffff',
                    logging: false,
                    useCORS: true // Enable CORS for images
                });
                
                // Remove the cloned element
                document.body.removeChild(clonedLetter);
                
                // Convert canvas to JPG
                const imgData = canvas.toDataURL('image/jpeg', 0.95);
                
                // Convert base64 to blob
                const byteString = atob(imgData.split(',')[1]);
                const mimeString = imgData.split(',')[0].split(':')[1].split(';')[0];
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                
                for (let j = 0; j < byteString.length; j++) {
                    ia[j] = byteString.charCodeAt(j);
                }
                
                const blob = new Blob([ab], {type: mimeString});
                
                // Add file to zip
                zip.file(fileName, blob);
            }
            
            // Generate zip and trigger download
            const zipContent = await zip.generateAsync({type: 'blob'});
            
            // Create download link
            const a = document.createElement('a');
            const url = URL.createObjectURL(zipContent);
            a.href = url;
            a.download = `Recall_Letters_Images_${new Date().toISOString().slice(0,10)}.zip`;
            document.body.appendChild(a);
            a.click();
            
            // Cleanup
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
            
        } catch (error) {
            console.error('Error generating images:', error);
            alert('There was an error generating the images. Please try again.');
        } finally {
            // Remove loading indicator
            document.body.removeChild(loadingDiv);
        }
    }

    // Export letters as text files in a zip
    function exportLettersAsZip() {
        if (generatedLetters.length === 0) {
            alert('No letters to export. Please generate letters first.');
            return;
        }
        
        const zip = new JSZip();
        
        // Process each letter - all data is already updated in the generatedLetters array
        // when the user edits content, so we don't need to modify this function much
        generatedLetters.forEach(letterData => {
            // Format date for filename
            const dateObj = new Date(letterData.recallDate);
            const formattedDate = `${dateObj.getFullYear()}-${(dateObj.getMonth()+1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')}`;
            
            // Create filename
            const fileName = `${letterData.ncr} - ${letterData.control} - ${letterData.manufacturer} - ${formattedDate}.txt`;
            
            // Convert HTML letter to text - using the updated data from letterData which includes edits
            const letterText = convertLetterToText(letterData);
            
            // Add file to zip
            zip.file(fileName, letterText);
        });
        
        // Generate zip and trigger download
        zip.generateAsync({type: 'blob'})
            .then(function(content) {
                // Create download link
                const a = document.createElement('a');
                const url = URL.createObjectURL(content);
                a.href = url;
                a.download = `Recall_Letters_${new Date().toISOString().slice(0,10)}.zip`;
                document.body.appendChild(a);
                a.click();
                
                // Cleanup
                setTimeout(function() {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 0);
            });
    }

    // Convert letter HTML to text format
    function convertLetterToText(letterData) {
        // Format date
        const formattedDate = new Date(letterData.recallDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Construct text content
        let text = '';
        
        // Add header
        text += `Recall Date: ${formattedDate}\n\n`;
        text += `${letterData.address}\n\n`;
        text += `${letterData.letterTitle}\n\n`;
        text += `Manufacturer: ${letterData.manufacturer}\n`;
        
        // Add heat number if provided
        let heatNumberText = '';
        if (letterData.heatNumber) {
            heatNumberText = ` | Heat Number: ${letterData.heatNumber}`;
        }
        
        text += `Control #: ${letterData.control}${heatNumberText}\n`;
        text += `NCR: ${letterData.ncr}\n\n`;
        
        // Add body content - check if using override content
        if (letterData.isContentOverride && letterData.overrideText) {
            // Format and add override text
            let formattedOverrideText = letterData.overrideText
                .replace(/\[MANUFACTURER\]/g, letterData.manufacturer)
                .replace(/\[MATERIAL_CATEGORY\]/g, letterData.materialCategory)
                .replace(/\[ISSUE\]/g, letterData.issue)
                .replace(/\[HEAT_NUMBER\]/g, letterData.heatNumber || '')
                .replace(/\[FIELD1\]/g, letterData.customFields.field1 || '')
                .replace(/\[FIELD2\]/g, letterData.customFields.field2 || '')
                .replace(/\[FIELD3\]/g, letterData.customFields.field3 || '')
                .replace(/\[FIELD4\]/g, letterData.customFields.field4 || '')
                .replace(/\[FIELD5\]/g, letterData.customFields.field5 || '');
                
            text += `${formattedOverrideText}\n\n`;
        } else {
            // Add standard body paragraphs
            let formattedParagraph1 = letterData.paragraph1
                .replace(/\[MANUFACTURER\]/g, letterData.manufacturer)
                .replace(/\[MATERIAL_CATEGORY\]/g, letterData.materialCategory)
                .replace(/\[ISSUE\]/g, letterData.issue)
                .replace(/\[FIELD1\]/g, letterData.customFields.field1)
                .replace(/\[FIELD2\]/g, letterData.customFields.field2)
                .replace(/\[FIELD3\]/g, letterData.customFields.field3)
                .replace(/\[FIELD4\]/g, letterData.customFields.field4)
                .replace(/\[FIELD5\]/g, letterData.customFields.field5);
                
            let formattedParagraph2 = letterData.paragraph2
                .replace(/\[FIELD1\]/g, letterData.customFields.field1)
                .replace(/\[FIELD2\]/g, letterData.customFields.field2)
                .replace(/\[FIELD3\]/g, letterData.customFields.field3)
                .replace(/\[FIELD4\]/g, letterData.customFields.field4)
                .replace(/\[FIELD5\]/g, letterData.customFields.field5);
                
            let formattedParagraph3 = letterData.paragraph3
                .replace(/\[MATERIAL_CATEGORY\]/g, letterData.materialCategory)
                .replace(/\[FIELD1\]/g, letterData.customFields.field1)
                .replace(/\[FIELD2\]/g, letterData.customFields.field2)
                .replace(/\[FIELD3\]/g, letterData.customFields.field3)
                .replace(/\[FIELD4\]/g, letterData.customFields.field4)
                .replace(/\[FIELD5\]/g, letterData.customFields.field5);
                
            let formattedParagraph4 = letterData.paragraph4
                .replace(/\[FIELD1\]/g, letterData.customFields.field1)
                .replace(/\[FIELD2\]/g, letterData.customFields.field2)
                .replace(/\[FIELD3\]/g, letterData.customFields.field3)
                .replace(/\[FIELD4\]/g, letterData.customFields.field4)
                .replace(/\[FIELD5\]/g, letterData.customFields.field5);
                
            let formattedParagraph5 = letterData.paragraph5
                .replace(/\[FIELD1\]/g, letterData.customFields.field1)
                .replace(/\[FIELD2\]/g, letterData.customFields.field2)
                .replace(/\[FIELD3\]/g, letterData.customFields.field3)
                .replace(/\[FIELD4\]/g, letterData.customFields.field4)
                .replace(/\[FIELD5\]/g, letterData.customFields.field5);
                
            let formattedContactInfo = letterData.contactInfo
                .replace(/\[FIELD1\]/g, letterData.customFields.field1)
                .replace(/\[FIELD2\]/g, letterData.customFields.field2)
                .replace(/\[FIELD3\]/g, letterData.customFields.field3)
                .replace(/\[FIELD4\]/g, letterData.customFields.field4)
                .replace(/\[FIELD5\]/g, letterData.customFields.field5);
            
            text += `${formattedParagraph1}\n\n`;
            text += `${formattedParagraph2}\n\n`;
            text += `${formattedParagraph3}\n\n`;
            text += `${formattedParagraph4}\n\n`;
            text += `${formattedParagraph5}\n\n`;
            text += `${formattedContactInfo}\n\n`;
        }
        
        // Add table data
        text += '------------ ORDER DETAILS ------------\n';
        
        // Get selected fields
        const selectedFields = [];
        const fieldCheckboxElements = fieldCheckboxes.querySelectorAll('input[type="checkbox"]');
        fieldCheckboxElements.forEach(checkbox => {
            if (checkbox.checked) {
                selectedFields.push(checkbox.value);
            }
        });
        
        // Add header row
        const headerRow = selectedFields.join('\t');
        text += headerRow + '\n';
        
        // Add separator
        text += selectedFields.map(() => '--------').join('\t') + '\n';
        
        // Add data rows
        letterData.records.forEach(record => {
            const row = selectedFields.map(field => record[field] || '').join('\t');
            text += row + '\n';
        });
        
        return text;
    }

    // Helper function to strip HTML but preserve line breaks
    function stripHtml(html) {
        // Create temporary element
        const temp = document.createElement('div');
        temp.innerHTML = html;
        
        // Replace <br>, <p>, <div> with line breaks
        const content = temp.innerHTML
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/p><p>/gi, '\n\n')
            .replace(/<\/div><div>/gi, '\n')
            .replace(/<li>/gi, '• ')
            .replace(/<\/li>/gi, '\n');
            
        // Strip all remaining HTML tags
        const stripped = temp.textContent || temp.innerText || '';
        
        // Clean up excessive line breaks
        return stripped.replace(/\n{3,}/g, '\n\n');
    }

    // Function to print a single letter
    function printSingleLetter(letterElement) {
        // Find the index of this letter
        const letterIndex = Array.from(letters.children).indexOf(letterElement);
        let letterData = null;
        
        if (letterIndex !== -1 && letterIndex < generatedLetters.length) {
            letterData = generatedLetters[letterIndex];
        }
        
        // Store all letters
        const allLetters = document.querySelectorAll('.letter');
        
        // Hide all letter print buttons and edit controls
        const allPrintButtons = document.querySelectorAll('.letter-print-button-container, .edit-controls, .edit-indicator');
        allPrintButtons.forEach(btn => {
            btn.style.display = 'none';
        });
        
        // Hide all letters except the one to print
        allLetters.forEach(letter => {
            if (letter !== letterElement) {
                letter.style.display = 'none';
            }
        });
        
        // If we have letter data, update the letter with any edits
        if (letterData) {
            // Create a temporary clone to store original HTML
            const originalHTML = letterElement.innerHTML;
            
            // Update with edits
            updateLetterBeforeExport(letterElement, letterData);
            
            // Print
            window.print();
            
            // Restore original HTML
            setTimeout(() => {
                letterElement.innerHTML = originalHTML;
                
                // Restore display
                allLetters.forEach(letter => {
                    letter.style.display = 'block';
                });
                
                // Restore print buttons
                allPrintButtons.forEach(btn => {
                    btn.style.display = 'block';
                });
            }, 500); // Small delay to ensure print dialog has opened
        } else {
            // Just print without updating if no data found
            window.print();
            
            // Restore display
            setTimeout(() => {
                allLetters.forEach(letter => {
                    letter.style.display = 'block';
                });
                
                // Restore print buttons
                allPrintButtons.forEach(btn => {
                    btn.style.display = 'block';
                });
            }, 500); // Small delay to ensure print dialog has opened
        }
    }

    // Print all letters
    function printLetters() {
        // Hide all edit controls and indicators before printing
        const editElements = document.querySelectorAll('.edit-controls, .edit-indicator, .letter-print-button-container');
        editElements.forEach(el => {
            el.style.display = 'none';
        });
        
        // Print
        window.print();
        
        // Restore edit controls after printing
        setTimeout(() => {
            editElements.forEach(el => {
                el.style.display = 'block';
            });
        }, 500);
    }
});