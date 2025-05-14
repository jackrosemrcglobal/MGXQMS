import { createApp, ref } from 'vue'

const app = createApp({
    setup() {
        const processRegister = ref([
            {
                category: 'Management Process',
                name: 'Management Responsibility',
                relatedProcesses: 'Business Planning, Management Review',
                lastReviewedDate: '',
                reviewedBy: ''
            },
            {
                category: 'Management Process',
                name: 'Resource Management',
                relatedProcesses: 'Human Resources, Training, Facilities, Equipment, Document Data Control, IT, IS Security',
                lastReviewedDate: '',
                reviewedBy: ''
            },
            {
                category: 'Management Process',
                name: 'Measurement analysis and improvement',
                relatedProcesses: 'Accounting (Payables, Receivables, Inventoy,P&L) Legal, Risk Management, Internal Auditing, Monitoring & Data Analysis (Process, Supplier, Customer and Product)',
                lastReviewedDate: '',
                reviewedBy: ''
            },
            {
                category: 'Basic & Supporting Processes',
                name: 'Marketing',
                relatedProcesses: 'Customer Satisfaction, Vendor Relations',
                lastReviewedDate: '',
                reviewedBy: ''
            },
            {
                category: 'Basic & Supporting Processes',
                name: 'Sales, Projects and Tenders',
                relatedProcesses: 'RFQs, Quotes, Orders, Cost Estimation, Order Review, Order Entry, Desing/Change Control, Specifications, Order Fulfilment',
                lastReviewedDate: '',
                reviewedBy: ''
            },
            {
                category: 'Basic & Supporting Processes',
                name: 'Purchasing',
                relatedProcesses: 'Production, Supplier Management, RFP, Purchase Order, Production, Sub Contractor Activity, Supplier Management, Accounts Payable',
                lastReviewedDate: '',
                reviewedBy: ''
            },
            {
                category: 'Basic & Supporting Processes',
                name: 'Warehousing',
                relatedProcesses: 'Inventory Management, Quality Control, Product Nonconformity, Returned Product, Corrective Action, RMA Status, Receiving, Inspection, Order Fulfilment, Delivery',
                lastReviewedDate: '',
                reviewedBy: ''
            },
            {
                category: 'Basic & Supporting Processes',
                name: 'Shop Work',
                relatedProcesses: 'Design/Change Control, Specs & Drawings',
                lastReviewedDate: '',
                reviewedBy: ''
            },
            {
                category: 'Outsourced Processes',
                name: 'Transportation',
                relatedProcesses: 'Delivery of goods',
                lastReviewedDate: '',
                reviewedBy: ''
            },
            {
                category: 'Outsourced Processes',
                name: 'Subcontractor Activity',
                relatedProcesses: 'Third part work to goods and other services outsourced',
                lastReviewedDate: '',
                reviewedBy: ''
            },
            {
                category: 'Outsourced Processes',
                name: 'Supplier Audit',
                relatedProcesses: 'Supplier Selection, Supplier Performance Evaluation, Contract Management',
                lastReviewedDate: '',
                reviewedBy: ''
            },
            {
                category: 'Management Process',
                name: 'Management Review',
                relatedProcesses: 'Quality Management System Review, Strategic Planning, Organizational Performance Evaluation',
                lastReviewedDate: '',
                reviewedBy: ''
            }
        ])

        const showProcessResponsibilityMatrix = ref(false)
        const roles = [
            'General Manager', 
            'Quality Manager', 
            'Operations Manager', 
            'Sales Manager', 
            'Marketing Manager', 
            'Finance Manager', 
            'HR Manager', 
            'Procurement Manager', 
            'Warehouse Manager', 
            'Production Manager'
        ]

        const processResponsibilityMatrix = ref([
            {
                name: 'Quality Management',
                responsibilities: Object.fromEntries(roles.map(role => [role, '']))
            },
            {
                name: 'Process Control',
                responsibilities: Object.fromEntries(roles.map(role => [role, '']))
            },
            {
                name: 'Management Responsibility',
                responsibilities: Object.fromEntries(roles.map(role => [role, '']))
            },
            {
                name: 'Resource Management',
                responsibilities: Object.fromEntries(roles.map(role => [role, '']))
            },
            {
                name: 'Measurement Analysis and Improvement',
                responsibilities: Object.fromEntries(roles.map(role => [role, '']))
            },
            {
                name: 'Marketing',
                responsibilities: Object.fromEntries(roles.map(role => [role, '']))
            },
            {
                name: 'Sales, Projects and Tenders',
                responsibilities: Object.fromEntries(roles.map(role => [role, '']))
            },
            {
                name: 'Purchasing',
                responsibilities: Object.fromEntries(roles.map(role => [role, '']))
            },
            {
                name: 'Warehousing',
                responsibilities: Object.fromEntries(roles.map(role => [role, '']))
            },
            {
                name: 'Shop Work',
                responsibilities: Object.fromEntries(roles.map(role => [role, '']))
            },
            {
                name: 'Transportation',
                responsibilities: Object.fromEntries(roles.map(role => [role, '']))
            },
            {
                name: 'Subcontractor Activity',
                responsibilities: Object.fromEntries(roles.map(role => [role, '']))
            },
            {
                name: 'Supplier Audit',
                responsibilities: Object.fromEntries(roles.map(role => [role, '']))
            },
            {
                name: 'Management Review',
                responsibilities: Object.fromEntries(roles.map(role => [role, '']))
            }
        ])

        const addProcessRegisterItem = () => {
            processRegister.value.push({
                category: '',
                name: '',
                relatedProcesses: '',
                lastReviewedDate: '',
                reviewedBy: ''
            })
        }

        const deleteProcessRegisterItem = (index) => {
            processRegister.value.splice(index, 1)
        }

        const saveProcessRegister = () => {
            console.log('Saving Process Register:', processRegister.value)
            alert('Process Register saved successfully!')
        }

        const saveProcessResponsibilityMatrix = () => {
            console.log('Saving Process Responsibility Matrix:', processResponsibilityMatrix.value)
            showProcessResponsibilityMatrix.value = false
            alert('Process Responsibility Matrix saved successfully!')
        }

        const exportProcessRegister = () => {
            const exportData = {
                processRegister: processRegister.value,
                processResponsibilityMatrix: processResponsibilityMatrix.value,
                exportDate: new Date().toISOString()
            }

            const jsonString = JSON.stringify(exportData, null, 2)
            const blob = new Blob([jsonString], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            
            const a = document.createElement('a')
            a.href = url
            a.download = `ProcessRegister_${new Date().toISOString().split('T')[0]}.json`
            document.body.appendChild(a)
            a.click()
            
            setTimeout(() => {
                document.body.removeChild(a)
                URL.revokeObjectURL(url)
            }, 100)
        }

        const triggerProcessRegisterFileInput = () => {
            document.getElementById('process-register-file-input').click()
        }

        const loadProcessRegisterFromFile = (event) => {
            const file = event.target.files[0]
            if (!file) return

            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result)
                    if (!data.processRegister) {
                        throw new Error('Invalid process register file format')
                    }

                    processRegister.value = data.processRegister
                    
                    if (data.processResponsibilityMatrix) {
                        processResponsibilityMatrix.value = data.processResponsibilityMatrix
                    }

                    alert('Process Register loaded successfully')
                } catch (error) {
                    console.error('Error loading process register file:', error)
                    alert('Failed to load process register: ' + error.message)
                }
            }
            reader.readAsText(file)
            event.target.value = null // Reset file input
        }

        return {
            processRegister,
            addProcessRegisterItem,
            deleteProcessRegisterItem,
            saveProcessRegister,
            showProcessResponsibilityMatrix,
            roles,
            processResponsibilityMatrix,
            saveProcessResponsibilityMatrix,
            exportProcessRegister,
            triggerProcessRegisterFileInput,
            loadProcessRegisterFromFile
        }
    }
})

app.mount('#app')