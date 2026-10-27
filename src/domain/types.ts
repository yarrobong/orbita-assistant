export type FlowPath = 'new' | 'delivery' | 'pickup' | 'after-purchase'
export type Audience = 'buyer' | 'handover'
export type TemplateCategory = 'general' | 'product' | 'delivery' | 'pickup' | 'after-purchase' | 'quest' | 'safety' | 'other'
export type SourceCollection = 'Топ-15' | 'Все ответы' | 'Автоответы — безопасные' | 'Сценарии сделок' | 'ORBITA — начало диалога'

export type FlagName =
  | 'stockConfirmed' | 'deliveryAvailable' | 'orderVerified' | 'shippedVerified'
  | 'arrivedVerified' | 'receivedVerified' | 'handoverConfirmed' | 'buyerMessagePrepared' | 'buyerNotified' | 'addressConfirmed'
  | 'contactPermission' | 'handoverCompleted' | 'reviewRequested' | 'issueOpen'
  | 'compatibilityChecked' | 'variantChecked' | 'priceConfirmed' | 'termsConfirmed'

export type GuardFlag = FlagName | 'noIssueOpen' | 'reviewNotRequested' | 'handoverContext'
  | 'stockAvailable' | 'stockUnavailable'

export type Template = {
  id: string
  title: string
  category: TemplateCategory
  stage: string
  audience: Audience
  body: string
  tags: string[]
  requiredFields: string[]
  guardFlags: GuardFlag[]
  checklist: string[]
  defaultPriority: number
  revision: number
  source: SourceCollection
  usage: string
  neutralAlternative?: string
  withoutContactBody?: string
}

export type FlowFlags = Record<FlagName, boolean>

export type FlowState = {
  path: FlowPath
  stage: string
  audience: Audience
  fields: Record<string, string>
  flags: FlowFlags
}

export type FlowEvent =
  | { type: 'set-field'; field: string; value: string }
  | { type: 'confirm'; flag: FlagName; value: boolean }
  | { type: 'set-audience'; audience: Audience }
  | { type: 'set-stage'; stage: string }
  | { type: 'mark-review-requested' }

export type GuardResult = { allowed: boolean; reasons: string[]; audienceAllowed: boolean; situationAllowed: boolean; contextAllowed: boolean }

export type ImportableTemplate = Omit<Template, 'source' | 'usage'> & { source?: SourceCollection; usage?: string }
