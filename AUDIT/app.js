import { createApp, ref, computed, onMounted } from 'vue'

const app = createApp({
    setup() {
        const processes = ref([])
        const selectedProcess = ref(null)
        const currentAudit = ref(null)
        const auditHistory = ref([])
        const isPrintMode = ref(false)

        // Load processes from both built-in defaults and localStorage
        onMounted(() => {
            // Check if we have a selectedProcessForAudit in localStorage (from processes.html)
            const selectedProcessName = localStorage.getItem('selectedProcessForAudit')
            
            loadProcesses().then(() => {
                if (selectedProcessName) {
                    const process = processes.value.find(p => p.name === selectedProcessName)
                    if (process) {
                        selectedProcess.value = process
                        startAudit()
                    }
                    // Clear the selected process from localStorage
                    localStorage.removeItem('selectedProcessForAudit')
                }
            })
        })
        
        const loadProcesses = async () => {
            try {
                // First try to fetch from process-data.json
                const response = await fetch('process-data.json')
                const defaultProcesses = await response.json()
                processes.value = defaultProcesses
            } catch (error) {
                console.error('Error loading default processes:', error)
                // If file doesn't exist yet, start with empty array
                processes.value = []
            }
            
            // Then add processes from localStorage
            try {
                const processesStr = localStorage.getItem('iso9001Processes')
                if (processesStr) {
                    const savedProcesses = JSON.parse(processesStr)
                    savedProcesses.forEach(process => {
                        // Update existing or add new
                        const existingIndex = processes.value.findIndex(p => p.name === process.name)
                        if (existingIndex >= 0) {
                            processes.value[existingIndex] = process
                        } else {
                            processes.value.push(process)
                        }
                    })
                }
            } catch (e) {
                console.error('Error loading processes from localStorage:', e)
            }
        }

        const startAudit = () => {
            if (selectedProcess.value) {
                currentAudit.value = {
                    processName: selectedProcess.value.name,
                    header: selectedProcess.value.header ? { ...selectedProcess.value.header } : {
                        auditNumber: '',
                        auditDate: new Date().toISOString().split('T')[0],
                        auditTeam: '',
                        auditScope: '',
                        auditObjective: '',
                        auditCriteria: '',
                        auditLocation: '',
                        leadAuditor: '',
                        additionalNotes: ''
                    },
                    criteria: selectedProcess.value.criteria.map(c => ({
                        ...c,
                        auditStatus: 'Not Assessed'
                    }))
                }
            }
        }
        
        const compliancePercentage = computed(() => {
            if (!currentAudit.value) return 0
            
            const totalCriteria = currentAudit.value.criteria.length
            if (totalCriteria === 0) return 0
            
            const compliantCriteria = currentAudit.value.criteria.filter(c => c.compliant).length
            return Math.round((compliantCriteria / totalCriteria) * 100)
        })

        const finalizeAudit = () => {
            if (currentAudit.value) {
                const auditRecord = {
                    processName: currentAudit.value.processName,
                    date: new Date().toLocaleString(),
                    complianceScore: compliancePercentage.value,
                    header: currentAudit.value.header || {},
                    fullAuditDetails: currentAudit.value.criteria
                }

                auditHistory.value.unshift(auditRecord)
                currentAudit.value = null
            }
        }

        const goToAddProcess = () => {
            window.location.href = 'addnewprocess.html'
        }
        
        const goToProcessLibrary = () => {
            window.location.href = 'processes.html'
        }

        const exportAuditToFile = () => {
            if (!currentAudit.value) {
                alert('No active audit to export')
                return
            }

            const auditData = {
                processName: currentAudit.value.processName,
                header: currentAudit.value.header,
                criteria: currentAudit.value.criteria,
                exportDate: new Date().toISOString()
            }

            const jsonString = JSON.stringify(auditData, null, 2)
            const blob = new Blob([jsonString], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            
            const a = document.createElement('a')
            a.href = url
            a.download = `Audit_${currentAudit.value.processName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`
            document.body.appendChild(a)
            a.click()
            
            setTimeout(() => {
                document.body.removeChild(a)
                URL.revokeObjectURL(url)
            }, 100)
        }

        const triggerAuditFileInput = () => {
            document.getElementById('process-audit-file-input').click()
        }

        const loadAuditFromFile = (event) => {
            const file = event.target.files[0]
            if (!file) return

            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    const auditData = JSON.parse(e.target.result)
                    if (!auditData.processName || !auditData.criteria) {
                        throw new Error('Invalid audit file format')
                    }

                    currentAudit.value = {
                        processName: auditData.processName,
                        header: auditData.header || {
                            auditNumber: '',
                            auditDate: new Date().toISOString().split('T')[0],
                            auditTeam: '',
                            auditScope: '',
                            auditObjective: '',
                            auditCriteria: '',
                            auditLocation: '',
                            leadAuditor: '',
                            additionalNotes: ''
                        },
                        criteria: auditData.criteria
                    }

                    const matchingProcess = processes.value.find(p => p.name === auditData.processName)
                    if (matchingProcess) {
                        selectedProcess.value = matchingProcess
                    }

                    alert('Audit loaded successfully')
                } catch (error) {
                    console.error('Error loading audit file:', error)
                    alert('Failed to load audit: ' + error.message)
                }
            }
            reader.readAsText(file)
            event.target.value = null // Reset file input
        }

        const printAuditToPDF = () => {
            isPrintMode.value = true

            setTimeout(() => {
                window.print()

                window.onafterprint = () => {
                    isPrintMode.value = false
                    window.onafterprint = null
                }
            }, 100)
        }

        return {
            processes,
            selectedProcess,
            currentAudit,
            auditHistory,
            startAudit,
            finalizeAudit,
            compliancePercentage,
            isPrintMode,
            printAuditToPDF,
            exportAuditToFile,
            triggerAuditFileInput,
            loadAuditFromFile,
            goToAddProcess,
            goToProcessLibrary
        }
    }
})

app.mount('#app')