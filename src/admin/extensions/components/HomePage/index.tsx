/**
 * Custom Strapi Admin Dashboard - Home Page
 * 11+ Question Bank Management
 * 
 * Location: admin/src/pages/HomePage/index.tsx
 */

import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useFetchClient, Page } from '@strapi/admin/strapi-admin';
import {
  Box,
  Typography,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardContent,
  Flex,
} from '@strapi/design-system';
import {
  Plus,
} from '@strapi/icons';
import { useNavigate } from 'react-router-dom';

// Import custom components
import { StatsCards } from './components/StatsCards';
import { QuickActions } from './components/QuickActions';
import { RecentQuestions } from './components/RecentQuestions';
import { PendingReviews, ContentProgress, TopContributors } from './components/AdditionalComponents';

interface DashboardStats {
  totalQuestions: number;
  publishedQuestions: number;
  draftQuestions: number;
  pendingReviews: number;
  questionsBySubject: {
    maths: number;
    english: number;
    verbal_reasoning: number;
    non_verbal_reasoning: number;
  };
  questionsByDifficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
  recentActivity: Array<{
    id: string;
    questionId: string;
    action: string;
    author: string;
    timestamp: string;
  }>;
}

const HomePage = () => {
  const { formatMessage } = useIntl();
  const { get } = useFetchClient();
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard statistics
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all questions with pagination
      const { data: questionsData } = await get('/content-manager/collection-types/api::question.question', {
        params: {
          page: 1,
          pageSize: 10000, // Get all for stats
          sort: 'createdAt:desc',
        },
      });

      const questions = questionsData.results || [];

      // Calculate statistics
      const totalQuestions = questions.length;
      const publishedQuestions = questions.filter(q => q.publishedAt !== null).length;
      const draftQuestions = questions.filter(q => q.publishedAt === null).length;
      const pendingReviews = questions.filter(q => q.reviewStatus === 'peer_review' || q.reviewStatus === 'qa').length;

      // Group by subject
      const questionsBySubject = {
        maths: questions.filter(q => q.subject?.code === 'maths').length,
        english: questions.filter(q => q.subject?.code === 'english').length,
        verbal_reasoning: questions.filter(q => q.subject?.code === 'verbal_reasoning').length,
        non_verbal_reasoning: questions.filter(q => q.subject?.code === 'non_verbal_reasoning').length,
      };

      // Group by difficulty
      const questionsByDifficulty = {
        easy: questions.filter(q => q.difficulty === 'easy').length,
        medium: questions.filter(q => q.difficulty === 'medium').length,
        hard: questions.filter(q => q.difficulty === 'hard').length,
      };

      // Recent activity (mock - you can implement actual activity tracking)
      const recentActivity = questions.slice(0, 5).map(q => ({
        id: q.id,
        questionId: q.questionId || 'N/A',
        action: q.publishedAt ? 'Published' : 'Created',
        author: q.createdBy?.username || 'Unknown',
        timestamp: q.updatedAt,
      }));

      setStats({
        totalQuestions,
        publishedQuestions,
        draftQuestions,
        pendingReviews,
        questionsBySubject,
        questionsByDifficulty,
        recentActivity,
      });
    } catch (err: any) {
      console.error('Error fetching dashboard stats:', err);
      setError(err.message || 'Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardStats();
  };

  if (loading) {
    return (
      <Page.Main>
        <Page.Title>11+ Question Bank Dashboard</Page.Title>
        <Box padding={8}>
          <Typography variant="beta">Loading statistics...</Typography>
        </Box>
      </Page.Main>
    );
  }

  if (error) {
    return (
      <Page.Main>
        <Page.Title>11+ Question Bank Dashboard</Page.Title>
        <Box padding={8}>
          <Card background="danger100">
            <CardBody>
              <Flex direction="column" alignItems="center" gap={4}>
                <Typography variant="beta" textColor="danger600">
                  Error: {error}
                </Typography>
                <Button onClick={handleRefresh} variant="secondary">
                  Retry
                </Button>
              </Flex>
            </CardBody>
          </Card>
        </Box>
      </Page.Main>
    );
  }

  return (
    <Page.Main>
      <Page.Title>11+ Question Bank Dashboard</Page.Title>
      <Flex justifyContent="space-between" paddingBottom={4}>
        <Typography variant="alpha">Manage your test questions and track content creation progress</Typography>
        <Flex gap={2}>
          <Button variant="tertiary" onClick={handleRefresh}>
            Refresh
          </Button>
          <Button
            startIcon={<Plus />}
            onClick={() => navigate('/content-manager/collectionType/api::question.question/create')}
          >
            Create Question
          </Button>
        </Flex>
      </Flex>

      <Box padding={8}>
        <Flex direction="column" alignItems="stretch" gap={6}>
            
            {/* Statistics Cards */}
            <StatsCards stats={stats!} />

            {/* Quick Actions */}
            <QuickActions />

            {/* Main Content Grid */}
            <Flex gap={6} wrap="wrap">
              <Box style={{ flex: '1 1 calc(66.66% - 24px)', minWidth: '300px' }}>
                {/* Recent Questions */}
                <RecentQuestions />
              </Box>

              <Box style={{ flex: '1 1 calc(33.33% - 24px)', minWidth: '250px' }}>
                {/* Pending Reviews */}
                <PendingReviews count={stats!.pendingReviews} />
              </Box>
            </Flex>

            {/* Progress & Contributors */}
            <Flex gap={6} wrap="wrap">
              <Box style={{ flex: '1 1 calc(66.66% - 24px)', minWidth: '300px' }}>
                {/* Content Progress by Subject */}
                <ContentProgress
                  questionsBySubject={stats!.questionsBySubject}
                  questionsByDifficulty={stats!.questionsByDifficulty}
                />
              </Box>

              <Box style={{ flex: '1 1 calc(33.33% - 24px)', minWidth: '250px' }}>
                {/* Top Contributors */}
                <TopContributors />
              </Box>
            </Flex>

          </Flex>
        </Box>
      </Page.Main>
  );
};

export default HomePage;
