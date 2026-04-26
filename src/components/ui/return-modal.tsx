import { useEffect, useState } from 'react'
import { Modal } from './modal'
import { Button } from './button'
import { FormField, Textarea } from './form-field'

interface ReturnModalProps {
  open: boolean
  targetStageLabel: string
  submitting?: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
}

export function ReturnModal({ open, targetStageLabel, submitting, onClose, onConfirm }: ReturnModalProps) {
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (!open) setReason('')
  }, [open])

  const trimmed = reason.trim()
  const canSubmit = trimmed.length >= 10 && !submitting

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Return for revision"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            disabled={!canSubmit}
            onClick={() => onConfirm(trimmed)}
          >
            {submitting ? 'Returning...' : `Return to ${targetStageLabel}`}
          </Button>
        </>
      }
    >
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
        Send this appraisal back to <span className="font-semibold">{targetStageLabel}</span>. The reviewee sees this
        reason on their dashboard and self-appraisal page.
      </p>
      <FormField
        label="Reason"
        hint="Minimum 10 characters. Be specific about what to fix or add."
      >
        <Textarea
          rows={5}
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="e.g. KRA-2 evidence missing the rollout dashboard link. Please attach and resubmit."
        />
      </FormField>
    </Modal>
  )
}
