export type ReinforcementTopic = 'addition' | 'subtraction' | 'multiplication' | 'division';

export type ChildGender = 'girl' | 'boy' | 'prefer_not_to_say';

export type ParentProfile = {
  id: string;
  userId: string;
  email: string;
  consentAccepted: boolean;
  consentAcceptedAt: string | null;
};

export type ChildProfile = {
  id: string;
  parentId: string;
  name: string;
  age: number;
  gender: ChildGender | null;
  reinforcementTopics: ReinforcementTopic[];
};

export type SaveChildProfileInput = {
  name: string;
  age: number;
  gender: ChildGender | null;
  reinforcementTopics: ReinforcementTopic[];
};
