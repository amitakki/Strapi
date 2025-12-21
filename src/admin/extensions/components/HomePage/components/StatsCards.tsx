/**
 * Stats Cards Component
 * Displays key metrics at the top of dashboard
 * 
 * Location: admin/src/pages/HomePage/components/StatsCards.tsx
 */

import React from 'react';
import { Card, CardBody, Flex, Typography, Box } from '@strapi/design-system';
import { Book, CheckCircle, Clock, Pencil, TrendUp } from '@strapi/icons';

interface StatsCardsProps {
  stats: {
    totalQuestions: number;
    publishedQuestions: number;
    draftQuestions: number;
    pendingReviews: number;
  };
}

interface StatCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon: React.ComponentType;
  iconColor: string;
  backgroundColor: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: IconComponent,
  iconColor,
  backgroundColor,
  trend,
}) => {
  return (
    <Card
      style={{
        height: '100%',
        borderLeft: `4px solid var(--strapi-color-${iconColor})`,
      }}
    >
      <CardBody>
        <Flex direction="column" alignItems="stretch" gap={3}>
          {/* Header with Icon */}
          <Flex justifyContent="space-between" alignItems="center">
            <Typography variant="sigma" textColor="neutral600">
              {title}
            </Typography>
            <Box
              padding={2}
              background={backgroundColor}
              borderRadius="50%"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <IconComponent color={iconColor} width="20px" height="20px" />
            </Box>
          </Flex>

          {/* Main Value */}
          <Typography variant="alpha" fontWeight="bold">
            {value.toLocaleString()}
          </Typography>

          {/* Subtitle or Trend */}
          {subtitle && (
            <Typography variant="pi" textColor="neutral500">
              {subtitle}
            </Typography>
          )}

          {trend && (
            <Flex gap={1} alignItems="center">
              <TrendUp
                color={trend.direction === 'up' ? 'success600' : 'danger600'}
                width="14px"
                height="14px"
                style={{
                  transform: trend.direction === 'down' ? 'rotate(180deg)' : 'none',
                }}
              />
              <Typography
                variant="pi"
                textColor={trend.direction === 'up' ? 'success600' : 'danger600'}
                fontWeight="semiBold"
              >
                {trend.value}% this week
              </Typography>
            </Flex>
          )}
        </Flex>
      </CardBody>
    </Card>
  );
};

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const publishRate = stats.totalQuestions > 0
    ? Math.round((stats.publishedQuestions / stats.totalQuestions) * 100)
    : 0;

  return (
    <Flex gap={4} wrap="wrap">
      <Box style={{ flex: '1 1 calc(25% - 12px)', minWidth: '200px' }}>
        <StatCard
          title="Total Questions"
          value={stats.totalQuestions}
          subtitle="All questions in database"
          icon={Book}
          iconColor="primary600"
          backgroundColor="primary100"
          trend={{ value: 12, direction: 'up' }}
        />
      </Box>

      <Box style={{ flex: '1 1 calc(25% - 12px)', minWidth: '200px' }}>
        <StatCard
          title="Published"
          value={stats.publishedQuestions}
          subtitle={`${publishRate}% of total`}
          icon={CheckCircle}
          iconColor="success600"
          backgroundColor="success100"
        />
      </Box>

      <Box style={{ flex: '1 1 calc(25% - 12px)', minWidth: '200px' }}>
        <StatCard
          title="Draft"
          value={stats.draftQuestions}
          subtitle="Work in progress"
          icon={Pencil}
          iconColor="warning600"
          backgroundColor="warning100"
        />
      </Box>

      <Box style={{ flex: '1 1 calc(25% - 12px)', minWidth: '200px' }}>
        <StatCard
          title="Pending Review"
          value={stats.pendingReviews}
          subtitle="Needs attention"
          icon={Clock}
          iconColor="danger600"
          backgroundColor="danger100"
        />
      </Box>
    </Flex>
  );
};
