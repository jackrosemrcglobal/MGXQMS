import { createApp, ref } from 'vue'

const app = createApp({
    setup() {
        const newProcess = ref({
            name: '',
            category: '',
            relatedProcesses: '',
            criteriaFromList: '',
            header: {
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
            criteria: []
        })

        const parseCriteriaFromList = () => {
            if (!newProcess.value.criteriaFromList) return

            const parsedCriteria = newProcess.value.criteriaFromList
                .split(/[\n;]/)
                .map(criterion => criterion.trim())
                .filter(criterion => criterion !== '')

            parsedCriteria.forEach(criterion => {
                if (!newProcess.value.criteria.includes(criterion)) {
                    newProcess.value.criteria.push(criterion)
                }
            })

            newProcess.value.criteriaFromList = ''
        }

        const addProcessCriterion = () => {
            newProcess.value.criteria.push('')
        }

        const removeProcessCriterion = (index) => {
            newProcess.value.criteria.splice(index, 1)
        }

        const saveNewProcess = () => {
            if (!newProcess.value.name.trim()) {
                alert('Please enter a process name')
                return
            }

            const fullCriteria = newProcess.value.criteria
                .filter(criterion => criterion.trim() !== '')
                .map(criterion => ({
                    description: criterion,
                    compliant: false,
                    notes: '',
                    correctiveActions: '',
                    auditStatus: 'Not Assessed'
                }))

            const processToAdd = {
                name: newProcess.value.name,
                header: newProcess.value.header,
                criteria: fullCriteria
            }

            // Get existing processes array from localStorage or initialize empty array
            let existingProcesses = []
            try {
                const processesStr = localStorage.getItem('iso9001Processes')
                if (processesStr) {
                    existingProcesses = JSON.parse(processesStr)
                }
            } catch (e) {
                console.error('Error loading processes from localStorage:', e)
            }

            // Add new process and save back to localStorage
            existingProcesses.push(processToAdd)
            localStorage.setItem('iso9001Processes', JSON.stringify(existingProcesses))
            
            alert('Process saved successfully!')
            resetForm()
        }

        const resetForm = () => {
            newProcess.value = {
                name: '',
                category: '',
                relatedProcesses: '',
                criteriaFromList: '',
                header: {
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
                criteria: []
            }
        }

        const returnToMain = () => {
            window.location.href = 'index.html'
        }

        return {
            newProcess,
            parseCriteriaFromList,
            addProcessCriterion,
            removeProcessCriterion,
            saveNewProcess,
            resetForm,
            returnToMain
        }
    }
})

app.mount('#app')