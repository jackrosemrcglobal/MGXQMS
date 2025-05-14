import { createApp, ref, computed } from 'vue'

const app = createApp({
    setup() {
        const selectedClauseAuditSection = ref('')
        const isPrintMode = ref(false)
        const bulkEntryInput = ref('')

        const clauseAudit = ref({
            subscore: 0,
            max: 100,
            percentCompliant: 0,
            entries: []
        })

        const pendingEntries = computed(() => {
            return clauseAudit.value.entries.filter(entry => 
                !entry.auditResult || entry.auditResult === ''
            ).length
        })

        const errorCount = computed(() => {
            return clauseAudit.value.entries.filter(entry => {
                // Consider an entry as having an error if required fields are empty
                return !entry.refNo || !entry.clauseTitle || !entry.requirements || !entry.process
            }).length
        })

        const filteredClauseAuditEntries = computed(() => {
            if (!selectedClauseAuditSection.value) {
                return clauseAudit.value.entries
            }
            return clauseAudit.value.entries.filter(
                entry => entry.process === selectedClauseAuditSection.value
            )
        })

        const addClauseAuditEntry = () => {
            clauseAudit.value.entries.push({
                refNo: '',
                clauseTitle: '',
                qNo: '',
                requirements: '',
                process: '',
                auditResult: '',
                recommendedActions: '',
                auditEvidence: '',
                conforms: false,
                score: 0,
                possibleRootCause: '',
                opportunitiesForImprovement: ''
            })
        }

        const addMultipleClauseAuditEntries = () => {
            if (!bulkEntryInput.value.trim()) return

            const entries = bulkEntryInput.value.split('\n')
            
            const parsedEntries = entries.map(entry => {
                const parts = entry.split(/[\t,]+/).map(p => p.trim())
                
                return {
                    refNo: parts[0] || '',
                    clauseTitle: parts[1] || '',
                    qNo: parts[2] || '',
                    requirements: parts[3] || '',
                    process: parts[4] || '',
                    auditResult: '',
                    recommendedActions: '',
                    auditEvidence: '',
                    conforms: false,
                    score: 0,
                    possibleRootCause: '',
                    opportunitiesForImprovement: ''
                }
            }).filter(entry => entry.refNo || entry.clauseTitle || entry.qNo || entry.requirements)

            clauseAudit.value.entries.push(...parsedEntries)

            bulkEntryInput.value = ''
        }

        const saveClauseAudit = () => {
            const totalScore = clauseAudit.value.entries.reduce((sum, entry) => sum + (parseInt(entry.score) || 0), 0)
            const totalPossibleScore = clauseAudit.value.max
            
            clauseAudit.value.subscore = totalScore
            clauseAudit.value.percentCompliant = Math.round((totalScore / totalPossibleScore) * 100)

            console.log('Saving Clause Audit:', clauseAudit.value)
            alert('Clause Audit saved successfully')
        }

        const printClauseAuditToPDF = () => {
            isPrintMode.value = true

            setTimeout(() => {
                window.print()

                window.onafterprint = () => {
                    isPrintMode.value = false
                    window.onafterprint = null
                }
            }, 100)
        }

        const copyClauseAuditToClipboard = () => {
            if (clauseAudit.value.entries.length === 0) {
                alert('No entries to copy')
                return
            }

            const headers = [
                'Ref No.', 
                'Clause Title', 
                'Q-No', 
                'Requirements/Questions', 
                'Process', 
                'Audit Result', 
                'Recommended Actions', 
                'Audit Evidence & Notes', 
                'Conforms', 
                'Score', 
                'Possible Root-cause', 
                'Opportunities for Improvement'
            ]

            const csvContent = [
                headers.join('\t'),
                ...clauseAudit.value.entries.map(entry => [
                    entry.refNo,
                    entry.clauseTitle,
                    entry.qNo,
                    entry.requirements,
                    entry.process,
                    entry.auditResult,
                    entry.recommendedActions,
                    entry.auditEvidence,
                    entry.conforms ? 'Yes' : 'No',
                    entry.score,
                    entry.possibleRootCause,
                    entry.opportunitiesForImprovement
                ].map(val => val || '').join('\t'))
            ].join('\n')

            navigator.clipboard.writeText(csvContent).then(() => {
                alert('Clause Audit entries copied to clipboard!')
            }).catch(err => {
                console.error('Could not copy text: ', err)
                alert('Failed to copy audit entries')
            })
        }

        const exportClauseAuditToFile = () => {
            if (!clauseAudit.value.entries || clauseAudit.value.entries.length === 0) {
                alert('No clause audit entries to export')
                return
            }

            const auditData = {
                subscore: clauseAudit.value.subscore,
                max: clauseAudit.value.max,
                percentCompliant: clauseAudit.value.percentCompliant,
                entries: clauseAudit.value.entries,
                exportDate: new Date().toISOString()
            }

            const jsonString = JSON.stringify(auditData, null, 2)
            const blob = new Blob([jsonString], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            
            const a = document.createElement('a')
            a.href = url
            a.download = `ClauseAudit_${new Date().toISOString().split('T')[0]}.json`
            document.body.appendChild(a)
            a.click()
            
            setTimeout(() => {
                document.body.removeChild(a)
                URL.revokeObjectURL(url)
            }, 100)
        }

        const triggerClauseAuditFileInput = () => {
            document.getElementById('clause-audit-file-input').click()
        }

        const loadClauseAuditFromFile = (event) => {
            const file = event.target.files[0]
            if (!file) return

            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    const auditData = JSON.parse(e.target.result)
                    if (!auditData.entries) {
                        throw new Error('Invalid clause audit file format')
                    }

                    clauseAudit.value = {
                        subscore: auditData.subscore || 0,
                        max: auditData.max || 100,
                        percentCompliant: auditData.percentCompliant || 0,
                        entries: auditData.entries || []
                    }

                    alert('Clause audit loaded successfully')
                } catch (error) {
                    console.error('Error loading clause audit file:', error)
                    alert('Failed to load clause audit: ' + error.message)
                }
            }
            reader.readAsText(file)
            event.target.value = null 
        }

        return {
            selectedClauseAuditSection,
            clauseAudit,
            isPrintMode,
            bulkEntryInput,
            pendingEntries,
            errorCount,
            filteredClauseAuditEntries,
            addClauseAuditEntry,
            addMultipleClauseAuditEntries,
            saveClauseAudit,
            printClauseAuditToPDF,
            copyClauseAuditToClipboard,
            exportClauseAuditToFile,
            triggerClauseAuditFileInput,
            loadClauseAuditFromFile
        }
    }
})

app.mount('#app')