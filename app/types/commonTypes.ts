import React from 'react';

export type NextTypes = {
  onNextAction: () => void;
};

export type TitleAndNextActionType = {
  title: string;
  onNextAction: () => void;
};

type sectionOptions = {
  id: string;
  name: string;
  icon: React.ElementType;
  duration: string;
  color: string;
  bgColor: string;
};

export type SectionCompleteProps = {
  completedSection: 'reading' | 'listening' | 'writing' | 'speaking';
  nextSection?: 'listening' | 'writing' | 'speaking' | null;
  onContinue: () => void;
  customTitle?: string;
  customSubtitle?: string;
  sections: sectionOptions[];
};
