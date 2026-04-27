import { advanceStatusFor, type Appraisal } from './mock-appraisals'

const draftAppraisal = { status: 'draft' } as Appraisal

if (advanceStatusFor(draftAppraisal, 'staff') !== 'sl_review') {
  throw new Error('staff draft appraisal should advance to SL review')
}

if (advanceStatusFor(draftAppraisal, 'sl') !== 'hod_review') {
  throw new Error('SL self-appraisal should skip SL review and advance to HoD review')
}
