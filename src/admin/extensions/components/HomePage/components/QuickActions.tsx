/**
 * Quick Actions Component
 * Subject-specific quick create buttons and common actions
 * 
 * Location: admin/src/pages/HomePage/components/QuickActions.tsx
 */

import React from 'react';
import { useNavigate  } from 'react-router-dom';
import { Box, Card, CardHeader, CardBody, Button, Flex, Typography } from '@strapi/design-system';
import { Plus, Search, Download, Upload } from '@strapi/icons';

// Subject icons (using emojis as placeholders - can replace with custom icons)
const SubjectIcon: React.FC<{ emoji: string; size?: string }> = ({ emoji, size = '32px' }) => (
  <span style={{ fontSize: size, lineHeight: 1 }}>{emoji}</span>
);

interface QuickActionButtonProps {
  label: string;
  emoji: string;
  color: string;
  backgroundColor: string;
  onClick: () => void;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  label,
  emoji,
  color,
  backgroundColor,
  onClick,
}) => {
  return (
    <Button
      variant="secondary"
      onClick={onClick}
      style={{
        height: '100px',
        border: `2px solid var(--strapi-color-${color})`,
        backgroundColor: `var(--strapi-color-${backgroundColor})`,
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <Flex direction="column" alignItems="center" gap={2}>
        <SubjectIcon emoji={emoji} size="36px" />
        <Typography variant="omega" fontWeight="semiBold" textColor={color}>
          {label}
        </Typography>
      </Flex>
    </Button>
  );
};

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const createQuestionWithSubject = (subjectCode: string) => {
    // Navigate to create question page with subject pre-selected
    navigate({
      pathname: '/content-manager/collectionType/api::question.question/create',
      state: { subject: subjectCode },
    });
  };

  const quickActions = [
    {
      label: 'Maths Question',
      emoji: '🔢',
      color: 'primary600',
      backgroundColor: 'primary100',
      onClick: () => createQuestionWithSubject('maths'),
    },
    {
      label: 'English Question',
      emoji: '📚',
      color: 'success600',
      backgroundColor: 'success100',
      onClick: () => createQuestionWithSubject('english'),
    },
    {
      label: 'Verbal Reasoning',
      emoji: '🧠',
      color: 'warning600',
      backgroundColor: 'warning100',
      onClick: () => createQuestionWithSubject('verbal_reasoning'),
    },
    {
      label: 'Non-Verbal Reasoning',
      emoji: '🎨',
      color: 'danger600',
      backgroundColor: 'danger100',
      onClick: () => createQuestionWithSubject('non_verbal_reasoning'),
    },
  ];

  const utilityActions = [
    {
      label: 'Search Questions',
      icon: Search,
      onClick: () => navigate('/content-manager/collectionType/api::question.question'),
    },
    {
      label: 'Bulk Import',
      icon: Upload,
      onClick: () => {
        // TODO: Implement bulk import modal
        alert('Bulk import feature coming soon!');
      },
    },
    {
      label: 'Export Questions',
      icon: Download,
      onClick: () => {
        // TODO: Implement export functionality
        alert('Export feature coming soon!');
      },
    },
  ];

  return (
    <Box>
      <Card>
        <CardHeader>
          <Flex gap={2} alignItems="center">
            <Plus />
            <Typography variant="beta" fontWeight="bold">
              Quick Actions
            </Typography>
          </Flex>
        </CardHeader>
        <CardBody>
          <Flex direction="column" alignItems="stretch" gap={4}>
            
            {/* Subject-specific create buttons */}
            <Box>
              <Typography variant="sigma" textColor="neutral600" marginBottom={2}>
                CREATE NEW QUESTION
              </Typography>
              <Flex gap={3} wrap="wrap">
                {quickActions.map((action, index) => (
                  <Box key={index} style={{ flex: '1 1 calc(25% - 12px)', minWidth: '150px' }}>
                    <QuickActionButton {...action} />
                  </Box>
                ))}
              </Flex>
            </Box>

            {/* Utility actions */}
            <Box paddingTop={2}>
              <Typography variant="sigma" textColor="neutral600" marginBottom={2}>
                QUICK TOOLS
              </Typography>
              <Flex gap={2} wrap="wrap">
                {utilityActions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <Button
                      key={index}
                      variant="secondary"
                      startIcon={<IconComponent />}
                      onClick={action.onClick}
                    >
                      {action.label}
                    </Button>
                  );
                })}
              </Flex>
            </Box>

          </Flex>
        </CardBody>
      </Card>
    </Box>
  );
};
