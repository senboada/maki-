export type ReinforcementTopic = 'addition' | 'subtraction' | 'multiplication' | 'division';

export type ChildGender = 'girl' | 'boy' | 'prefer_not_to_say';
export type ChildAvatarAnimal = 'panda' | 'fox' | 'owl' | 'turtle' | 'rabbit' | 'bird' | 'dog';

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
  lastName: string;
  age: number;
  gender: ChildGender | null;
  avatarAnimal: ChildAvatarAnimal;
  reinforcementTopics: ReinforcementTopic[];
  createdAt: string;
};

export type SaveChildProfileInput = {
  name: string;
  lastName: string;
  age: number;
  gender: ChildGender | null;
  avatarAnimal: ChildAvatarAnimal;
  reinforcementTopics: ReinforcementTopic[];
};
