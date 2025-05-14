import { createApp, ref, onMounted } from 'vue'

const app = createApp({
    setup() {
        const processes = ref([])
        const viewingProcess = ref(null)
        const editingProcess = ref(null)
        
        onMounted(() => {
            loadProcesses()
        })
        
        const loadProcesses = () => {
            // Load processes from both app.js defaults and localStorage
            fetch('process-data.json')
                .then(response => response.json())
                .then(defaultProcesses => {
                    // Start with default processes
                    processes.value = defaultProcesses
                    
                    // Then add any from localStorage
                    try {
                        const processesStr = localStorage.getItem('iso9001Processes')
                        if (processesStr) {
                            const savedProcesses = JSON.parse(processesStr)
                            // Add saved processes that don't already exist
                            savedProcesses.forEach(process => {
                                if (!processes.value.some(p => p.name === process.name)) {
                                    processes.value.push({
                                        ...process,
                                        lastModified: process.lastModified || new Date().toISOString()
                                    })
                                }
                            })
                        }
                    } catch (e) {
                        console.error('Error loading processes from localStorage:', e)
                    }
                })
                .catch(error => {
                    console.error('Error loading default processes:', error)
                    
                    // If we can't fetch defaults, just load from localStorage
                    try {
                        const processesStr = localStorage.getItem('iso9001Processes')
                        if (processesStr) {
                            processes.value = JSON.parse(processesStr)
                        }
                    } catch (e) {
                        console.error('Error loading processes from localStorage:', e)
                    }
                })
        }
        
        const saveAllProcesses = () => {
            localStorage.setItem('iso9001Processes', JSON.stringify(processes.value))
        }
        
        const viewProcess = (index) => {
            viewingProcess.value = {...processes.value[index]}
        }
        
        const editProcess = (index) => {
            editingProcess.value = JSON.parse(JSON.stringify(processes.value[index]))
        }
        
        const saveEditedProcess = () => {
            if (!editingProcess.value.name.trim()) {
                alert('Process name cannot be empty')
                return
            }
            
            editingProcess.value.lastModified = new Date().toISOString()
            
            const index = processes.value.findIndex(p => p.name === editingProcess.value.name)
            if (index >= 0) {
                processes.value[index] = editingProcess.value
            } else {
                processes.value.push(editingProcess.value)
            }
            
            saveAllProcesses()
            editingProcess.value = null
        }
        
        const deleteProcess = (index) => {
            if (confirm(`Are you sure you want to delete the process "${processes.value[index].name}"?`)) {
                processes.value.splice(index, 1)
                saveAllProcesses()
            }
        }
        
        const addEditCriterion = () => {
            editingProcess.value.criteria.push({
                description: '',
                compliant: false,
                notes: '',
                correctiveActions: '',
                auditStatus: 'Not Assessed'
            })
        }
        
        const removeEditCriterion = (index) => {
            editingProcess.value.criteria.splice(index, 1)
        }
        
        const exportProcesses = () => {
            const jsonString = JSON.stringify(processes.value, null, 2)
            const blob = new Blob([jsonString], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            
            const a = document.createElement('a')
            a.href = url
            a.download = `ISO9001_Processes_${new Date().toISOString().split('T')[0]}.json`
            document.body.appendChild(a)
            a.click()
            
            setTimeout(() => {
                document.body.removeChild(a)
                URL.revokeObjectURL(url)
            }, 100)
        }
        
        const triggerImportProcesses = () => {
            document.getElementById('process-import-file').click()
        }
        
        const importProcesses = (event) => {
            const file = event.target.files[0]
            if (!file) return
            
            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    const importedProcesses = JSON.parse(e.target.result)
                    
                    if (!Array.isArray(importedProcesses)) {
                        throw new Error('Invalid process file format')
                    }
                    
                    // Merge imported processes with existing ones
                    importedProcesses.forEach(process => {
                        const existingIndex = processes.value.findIndex(p => p.name === process.name)
                        if (existingIndex >= 0) {
                            if (confirm(`Process "${process.name}" already exists. Replace it?`)) {
                                processes.value[existingIndex] = {
                                    ...process,
                                    lastModified: new Date().toISOString()
                                }
                            }
                        } else {
                            processes.value.push({
                                ...process,
                                lastModified: new Date().toISOString()
                            })
                        }
                    })
                    
                    saveAllProcesses()
                    alert(`Successfully imported ${importedProcesses.length} processes.`)
                } catch (error) {
                    console.error('Error importing processes:', error)
                    alert('Failed to import processes: ' + error.message)
                }
            }
            reader.readAsText(file)
            event.target.value = null // Reset file input
        }
        
        const startAuditFor = (process) => {
            // Store selected process in localStorage for the audit page
            localStorage.setItem('selectedProcessForAudit', process.name)
            window.location.href = 'index.html'
        }
        
        return {
            processes,
            viewingProcess,
            editingProcess,
            viewProcess,
            editProcess,
            saveEditedProcess,
            deleteProcess,
            addEditCriterion,
            removeEditCriterion,
            exportProcesses,
            triggerImportProcesses,
            importProcesses,
            startAuditFor
        }
    }
})

app.mount('#app')