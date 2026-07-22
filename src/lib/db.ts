type SubmissionPayload = Record<string, unknown>

const createLocalSubmission = async (input?: { data?: SubmissionPayload }) => ({
  id: `local-${Math.random().toString(36).slice(2)}`,
  ...(input?.data ?? {}),
})

export const db = {
  contactSubmission: {
    create: async (input?: { data?: SubmissionPayload }) => createLocalSubmission(input),
    findMany: async () => [],
  },
  dealerSubmission: {
    create: async (input?: { data?: SubmissionPayload }) => createLocalSubmission(input),
    findMany: async () => [],
  },
}