import type { Schema, Struct } from '@strapi/strapi';

export interface QuestionAnswerOptions extends Struct.ComponentSchema {
  collectionName: 'components_question_answer_options';
  info: {
    description: 'Multiple choice answer options (A-E)';
    displayName: 'Answer Options';
  };
  attributes: {
    optionA: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    optionB: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    optionC: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    optionD: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    optionE: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
  };
}

export interface QuestionCommonMistake extends Struct.ComponentSchema {
  collectionName: 'components_question_common_mistakes';
  info: {
    description: 'Explanation of why wrong answers are wrong';
    displayName: 'Common Mistake';
  };
  attributes: {
    commonMisconception: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    incorrectAnswer: Schema.Attribute.Enumeration<['A', 'B', 'C', 'D', 'E']> &
      Schema.Attribute.Required;
    whyWrong: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
  };
}

export interface QuestionExplanation extends Struct.ComponentSchema {
  collectionName: 'components_question_explanations';
  info: {
    description: 'Detailed solution explanation';
    displayName: 'Explanation';
  };
  attributes: {
    detailedSolution: Schema.Attribute.RichText & Schema.Attribute.Required;
    summary: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    visualAid: Schema.Attribute.Media<'images'>;
    workingSteps: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<[]>;
  };
}

export interface QuestionHint extends Struct.ComponentSchema {
  collectionName: 'components_question_hints';
  info: {
    description: 'Optional hint for students';
    displayName: 'Hint';
  };
  attributes: {
    hintText: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    revealCondition: Schema.Attribute.Enumeration<
      ['always', 'after_attempt', 'on_request']
    > &
      Schema.Attribute.DefaultTo<'on_request'>;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'question.answer-options': QuestionAnswerOptions;
      'question.common-mistake': QuestionCommonMistake;
      'question.explanation': QuestionExplanation;
      'question.hint': QuestionHint;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
    }
  }
}
