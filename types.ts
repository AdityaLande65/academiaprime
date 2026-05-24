export enum AppMode {
  DRAFT = 'DRAFT',
  POLISH = 'POLISH',
  ANALYZE = 'ANALYZE',
  GROUNDING = 'GROUNDING',
  REVIEW = 'REVIEW',
  GHOST_WRITER = 'GHOST_WRITER'
}

export enum SectionType {
  ABSTRACT = 'Abstract',
  INTRODUCTION = 'Introduction',
  METHODS = 'Methodology',
  RESULTS = 'Results',
  DISCUSSION = 'Discussion',
  CONCLUSION = 'Conclusion'
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AcademicOutput {
  text: string;
  groundingSources?: GroundingSource[];
  integrityReport?: string;
}
